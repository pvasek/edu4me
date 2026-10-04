import { useMemo, useState } from 'react'
import { Plate, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { useWorld } from './map-projection'
import {
  CITIES,
  DATES,
  clock,
  isDay,
  nightRing,
  solarTime,
  subsolarLon,
  sunriseInPraha,
  type DateId,
} from './day-night.model'

/** "Vyzkoušej si" for z2-2: the hour → the terminator moves over the real continents; local time follows the longitude (15° = 1 h). */

// equirectangular world map: 352 × 176 inside the plate
const X0 = 4
const Y0 = 30
const W = 352
const H = 176
const px = (lon: number) => X0 + ((lon + 180) / 360) * W
const py = (lat: number) => Y0 + ((90 - lat) / 180) * H
const NIGHT = 'color-mix(in srgb, #050912 50%, transparent)'
const DAY = 'color-mix(in srgb, var(--yellow) 16%, transparent)'
const edgeX = (x: number) => Math.min(X0 + W - 26, Math.max(X0 + 26, x))

function ringPath(ring: ArrayLike<number>): string {
  let d = ''
  for (let i = 0; i < ring.length; i += 2) d += `${i ? 'L' : 'M'}${px(ring[i]).toFixed(1)} ${py(ring[i + 1]).toFixed(1)}`
  return d + 'Z'
}

function WorldMap({ utc, decl }: { utc: number; decl: number }) {
  const { id } = usePlate()
  const data = useWorld()
  const land = useMemo(() => {
    if (!data) return ''
    let d = ''
    for (const sh of data.countries.values()) for (const r of sh.rings) d += ringPath(r)
    return d
  }, [data])
  const night = ringPath(nightRing(utc, decl))
  const sLon = subsolarLon(utc)
  const midnight = sLon > 0 ? sLon - 180 : sLon + 180
  const clip = `${id}-dn-clip`
  return (
    <g>
      <clipPath id={clip}>
        <rect x={X0} y={Y0} width={W} height={H} />
      </clipPath>
      <rect x={X0} y={Y0} width={W} height={H} fill="color-mix(in srgb, var(--blue) 17%, var(--paper))" />
      <g clipPath={`url(#${clip})`}>
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
          <path key={lon} d={`M${px(lon)} ${Y0} V${Y0 + H}`} stroke="color-mix(in srgb, var(--blue) 38%, transparent)" strokeWidth={0.6} />
        ))}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <path key={lat} d={`M${X0} ${py(lat)} H${X0 + W}`} stroke="color-mix(in srgb, var(--blue) 38%, transparent)" strokeWidth={lat ? 0.6 : 1} />
        ))}
        <path d={land} fill="var(--surface)" stroke="color-mix(in srgb, var(--edge) 55%, transparent)" strokeWidth={0.4} fillRule="evenodd" />
        <rect x={X0} y={Y0} width={W} height={H} fill={DAY} />
        <path d={night} fill={NIGHT} />
        <path d={night} fill={url(id, 'dd')} />
        <path d={`M${px(sLon)} ${Y0} V${Y0 + H}`} stroke="var(--yellow)" strokeWidth={1.4} strokeDasharray="4 3" />
        <circle cx={px(sLon)} cy={py(decl)} r={7} fill="var(--yellow)" stroke="var(--edge)" strokeWidth={1.2} />
      </g>
      <rect x={X0} y={Y0} width={W} height={H} fill="none" stroke="var(--edge)" strokeWidth={1.2} />
      {/* local solar time along the top edge: 15° = 1 h */}
      {[-120, -60, 0, 60, 120].map((lon) => (
        <g key={lon}>
          <path d={`M${px(lon)} ${Y0 - 4} V${Y0}`} stroke="var(--edge)" strokeWidth={1} />
          <text x={px(lon)} y={Y0 - 8} textAnchor="middle" className="ph-num">
            {clock(solarTime(utc, lon))}
          </text>
        </g>
      ))}
      <text x={edgeX(px(sLon))} y={Y0 + H + 16} textAnchor="middle" className="ph-unit ph-halo" style={{ fill: 'var(--ink)', fontWeight: 700 }}>
        poledne
      </text>
      <text x={edgeX(px(midnight))} y={Y0 + H + 16} textAnchor="middle" className="ph-unit ph-halo">
        půlnoc
      </text>
      {CITIES.map((c) => {
        const day = isDay(c.lat, c.lon, utc, decl)
        const left = c.lon < -30
        return (
          <g key={c.name}>
            <circle cx={px(c.lon)} cy={py(c.lat)} r={3.6} fill={day ? 'var(--accent)' : 'var(--surface)'} stroke="var(--ink)" strokeWidth={1.4} />
            <text
              x={px(c.lon) + (left ? -6 : 6)}
              y={py(c.lat) + 4}
              textAnchor={left ? 'end' : 'start'}
              className="ph-lbl ph-lbl-sm ph-halo"
              style={{ fill: 'var(--ink)' }}
            >
              {c.name}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function dnLabel(utc: number, date: DateId): string {
  const d = DATES[date]
  const sLon = subsolarLon(utc)
  const where = Math.abs(sLon) < 0.5 ? 'na nultém poledníku' : `na poledníku ${Math.round(Math.abs(sLon))}° ${sLon > 0 ? 'v. d.' : 'z. d.'}`
  return (
    `Mapa světa, ${d.label}, v Greenwichi je ${clock(utc)}. Poledne je právě ${where}; noční polovina Země je ztmavená. ` +
    CITIES.map((c) => `${c.name}: místní čas ${clock(solarTime(utc, c.lon))}, ${isDay(c.lat, c.lon, utc, d.decl) ? 'den' : 'noc'}.`).join(' ')
  )
}

export default function DayNight() {
  const [utc, setUtc] = useState(6)
  const [date, setDate] = useState<DateId>('cerven')
  const nar = useNarrow()
  const decl = DATES[date].decl
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 6, 360, 224]} max={560} label={dnLabel(utc, date)} className="xp-dn">
          <WorldMap utc={utc} decl={decl} />
        </Plate>
      }
      controls={
        <>
          <Control label="čas v Greenwichi (UTC)" value={utc} min={0} max={24} step={0.25} format={clock} onChange={setUtc} />
          <Choice
            label="datum"
            value={date}
            options={(Object.keys(DATES) as DateId[]).map((k) => ({ value: k, label: DATES[k].label }))}
            onChange={setDate}
          />
        </>
      }
      readouts={
        <>
          {CITIES.map((c) => (
            <Readout
              key={c.name}
              label={`${c.name}, místní čas`}
              value={`${clock(solarTime(utc, c.lon))}, ${isDay(c.lat, c.lon, utc, decl) ? 'den' : 'noc'}`}
            />
          ))}
        </>
      }
      challenge="Nastav čas, kdy v Praze právě vychází Slunce."
      done={sunriseInPraha(utc, decl)}
    />
  )
}
