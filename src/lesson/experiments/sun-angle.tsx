import { useState } from 'react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  JUN21,
  MAR21,
  YEAR,
  challengeMet,
  clock,
  dateText,
  dayKind,
  dayLength,
  declination,
  heating,
  hm,
  latText,
  noonHeight,
  noonSide,
  sunTimes,
} from './sun-angle.model'

/** "Vyzkoušej si" for z2-4 and z2-5: latitude and date → the Sun's noon height and the length of the day. */

const RAD = Math.PI / 180
const SUN = 'var(--yellow)'
const NIGHT = 'color-mix(in srgb, #0b1224 42%, transparent)'
const LAND = 'color-mix(in srgb, var(--teal) 22%, var(--surface))'

// globe (side view, the Sun on the left)
const GX = 82
const GY = 102
const GR = 56

/** A point at latitude `lat` on the noon (side = −1) or midnight (+1) meridian, screen coordinates. */
function globePt(lat: number, decl: number, side: -1 | 1, r = GR): [number, number] {
  const n = [-Math.sin(decl * RAD), Math.cos(decl * RAD)]
  const e = [Math.cos(decl * RAD), Math.sin(decl * RAD)]
  const c = Math.cos(lat * RAD) * side
  const s = Math.sin(lat * RAD)
  return [GX + r * (c * e[0] + s * n[0]), GY - r * (c * e[1] + s * n[1])]
}
const seg = (a: [number, number], b: [number, number]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`

function Globe({ lat, decl }: { lat: number; decl: number }) {
  const { id } = usePlate()
  const noon = globePt(lat, decl, -1)
  const midnight = globePt(lat, decl, 1)
  // where the parallel crosses the terminator (x = GX): t from noon (0) to midnight (1)
  const tt = Math.tan(lat * RAD) * Math.tan(decl * RAD)
  const t = Math.abs(lat) >= 89.99 ? (lat * decl > 0 ? 1 : 0) : Math.min(1, Math.max(0, (1 + tt) / 2))
  const cut: [number, number] = [noon[0] + (midnight[0] - noon[0]) * t, noon[1] + (midnight[1] - noon[1]) * t]
  const np = globePt(90, decl, 1, GR * 1.22)
  const sp = globePt(-90, decl, 1, GR * 1.22)
  const lines: [number, string][] = [
    [66.5, 'ph-dot2'],
    [23.5, 'ph-dot2'],
    [0, ''],
    [-23.5, 'ph-dot2'],
    [-66.5, 'ph-dot2'],
  ]
  return (
    <g>
      {/* rays from the Sun */}
      {[-36, 0, 36].map((dy) => {
        const xe = GX - Math.sqrt(GR * GR - dy * dy) - 3
        return <path key={dy} d={`M4 ${GY + dy} H${xe.toFixed(1)}`} stroke={SUN} strokeWidth={2.2} markerEnd={url(id, 'as-ink')} />
      })}
      <text x={4} y={GY + 58} className="ph-unit">
        paprsky
      </text>
      <circle cx={GX} cy={GY} r={GR} fill={LAND} />
      {/* night half */}
      <path d={`M${GX} ${GY - GR} A${GR} ${GR} 0 0 1 ${GX} ${GY + GR}Z`} fill={NIGHT} />
      <path d={`M${GX} ${GY - GR} A${GR} ${GR} 0 0 1 ${GX} ${GY + GR}Z`} fill={url(id, 'dd')} />
      {lines.map(([l, cls]) => (
        <path key={l} d={seg(globePt(l, decl, -1), globePt(l, decl, 1))} className={`ph-o ph-thin ${cls}`} />
      ))}
      {/* the chosen parallel: day part bold, night part dashed */}
      <path d={seg(cut, midnight)} stroke="var(--ph-b)" strokeWidth={2.4} strokeDasharray="3 3" />
      <path d={seg(noon, cut)} stroke="var(--ph-b)" strokeWidth={3.4} strokeLinecap="round" />
      <circle cx={GX} cy={GY} r={GR} className="ph-o" />
      {/* axis */}
      <path d={seg(sp, np)} className="ph-o ph-thin" />
      <text x={np[0]} y={np[1] - 4} textAnchor="middle" className="ph-unit ph-halo">
        S
      </text>
      <circle cx={noon[0]} cy={noon[1]} r={4.2} fill="var(--ph-b)" stroke="var(--surface)" strokeWidth={1.4} />
      <text x={GX - GR / 2} y={GY + GR + 22} textAnchor="middle" className="ph-unit">
        den
      </text>
      <text x={GX + GR / 2} y={GY + GR + 22} textAnchor="middle" className="ph-unit">
        noc
      </text>
    </g>
  )
}

// horizon scene
const SX0 = 172
const SX1 = 356
const SY0 = 14
const GROUND = 150
const OX = 264

function Sky({ h, side }: { h: number; side: 'jih' | 'sever' | 'zenit' }) {
  const clip = `${usePlate().id}-sa-clip`
  const up = h > 0
  const dir = side === 'sever' ? -1 : 1
  const L = 82
  const hc = Math.max(h, 0)
  const ux = dir * Math.cos(hc * RAD)
  const uy = Math.sin(hc * RAD)
  const sx = OX + L * ux
  const sy = GROUND - L * uy
  // a bundle of parallel rays of the same width: the lit patch on the ground is W / sin h long
  const W = 26
  const half = Math.min(84, W / 2 / Math.max(Math.sin(hc * RAD), 0.01))
  const rays = [-1, 0, 1].map((k) => {
    // the point on the ground and the start of the ray near the Sun
    const gx = OX + k * half
    return { gx, x0: gx + ux * 220, y0: GROUND - uy * 220 }
  })
  const arcR = 30
  const a0 = side === 'sever' ? 180 : 0
  const a1 = side === 'sever' ? 180 - hc : hc
  const p = (a: number, r: number) => [OX + r * Math.cos(a * RAD), GROUND - r * Math.sin(a * RAD)]
  const [ax0, ay0] = p(a0, arcR)
  const [ax1, ay1] = p(a1, arcR)
  const [lx, ly] = p((a0 + a1) / 2, arcR + 16)
  return (
    <g>
      <clipPath id={clip}>
        <rect x={SX0} y={SY0} width={SX1 - SX0} height={GROUND - SY0 + 36} rx={8} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect
          x={SX0}
          y={SY0}
          width={SX1 - SX0}
          height={GROUND - SY0}
          fill={up ? 'color-mix(in srgb, var(--blue) 14%, var(--surface))' : 'color-mix(in srgb, #0b1224 38%, var(--surface))'}
        />
        <rect x={SX0} y={GROUND} width={SX1 - SX0} height={36} fill="color-mix(in srgb, var(--green) 26%, var(--surface))" />
        {up && (
          <>
            {rays.map((r, i) => (
              <path key={i} d={`M${r.x0.toFixed(1)} ${r.y0.toFixed(1)} L${r.gx.toFixed(1)} ${GROUND}`} stroke={SUN} strokeWidth={2} />
            ))}
            <path d={`M${(OX - half).toFixed(1)} ${GROUND} H${(OX + half).toFixed(1)}`} stroke={SUN} strokeWidth={6} strokeLinecap="butt" />
            <circle cx={sx} cy={sy} r={13} fill={SUN} stroke="var(--edge)" strokeWidth={1.2} />
          </>
        )}
      </g>
      <rect x={SX0} y={SY0} width={SX1 - SX0} height={GROUND - SY0 + 36} rx={8} className="ph-o" />
      <path d={`M${SX0} ${GROUND} H${SX1}`} className="ph-o" />
      {/* the observer */}
      <g className="ph-o">
        <circle cx={OX} cy={GROUND - 21} r={3.6} className="ph-paper" />
        <path d={`M${OX} ${GROUND - 17} V${GROUND - 7} M${OX} ${GROUND - 7} l-3.5 7 M${OX} ${GROUND - 7} l3.5 7 M${OX - 5} ${GROUND - 13} H${OX + 5}`} />
      </g>
      {up && hc < 89.5 && (
        <>
          <path
            d={`M${ax0.toFixed(1)} ${ay0.toFixed(1)} A${arcR} ${arcR} 0 0 ${side === 'sever' ? 1 : 0} ${ax1.toFixed(1)} ${ay1.toFixed(1)}`}
            className="ph-o"
          />
          <text x={lx} y={ly + 5} textAnchor="middle" className="ph-lbl ph-halo">
            {czNum(Math.round(h * 10) / 10)}°
          </text>
        </>
      )}
      {up && hc >= 89.5 && (
        <text x={OX + 20} y={sy + 4} className="ph-lbl ph-halo">
          90°
        </text>
      )}
      {!up && (
        <text x={(SX0 + SX1) / 2} y={70} textAnchor="middle" className="ph-unit" style={{ fill: 'var(--ink)' }}>
          <tspan x={(SX0 + SX1) / 2}>Slunce ani v poledne</tspan>
          <tspan x={(SX0 + SX1) / 2} dy={17}>
            nevyjde nad obzor
          </tspan>
        </text>
      )}
      <text x={SX0 + 6} y={GROUND + 24} className="ph-unit">
        sever
      </text>
      <text x={SX1 - 6} y={GROUND + 24} textAnchor="end" className="ph-unit">
        jih
      </text>
    </g>
  )
}

// 24-hour strip of local solar time
const BX0 = 20
const BX1 = 340
const BY = 222
const bx = (hr: number) => BX0 + (hr / 24) * (BX1 - BX0)

function DayBar({ lat, decl }: { lat: number; decl: number }) {
  const { id } = usePlate()
  const kind = dayKind(lat, decl)
  const { rise, set } = sunTimes(lat, decl)
  const dayFill = 'color-mix(in srgb, var(--yellow) 45%, var(--surface))'
  const riseX = bx(rise)
  const setX = bx(set)
  return (
    <g>
      <rect x={BX0} y={BY} width={BX1 - BX0} height={16} fill={NIGHT} />
      <rect x={BX0} y={BY} width={BX1 - BX0} height={16} fill={url(id, 'dd')} />
      {kind !== 'polarni-noc' && <rect x={riseX} y={BY} width={setX - riseX} height={16} fill={dayFill} />}
      <rect x={BX0} y={BY} width={BX1 - BX0} height={16} className="ph-o" />
      {[0, 6, 12, 18, 24].map((hr) => (
        <g key={hr}>
          <path d={`M${bx(hr)} ${BY + 16} v5`} className="ph-o ph-thin" />
          <text x={bx(hr)} y={BY + 33} textAnchor="middle" className="ph-num">
            {hr === 24 ? '24 h' : `${hr}:00`}
          </text>
        </g>
      ))}
      {kind === 'den-a-noc' ? (
        <>
          <text x={riseX + (riseX > 92 ? -4 : 2)} y={BY - 6} textAnchor={riseX > 92 ? 'end' : 'start'} className="ph-unit ph-halo">
            východ {clock(rise)}
          </text>
          <text x={setX + (setX < 268 ? 4 : -2)} y={BY - 6} textAnchor={setX < 268 ? 'start' : 'end'} className="ph-unit ph-halo">
            západ {clock(set)}
          </text>
        </>
      ) : (
        <text x={(BX0 + BX1) / 2} y={BY - 6} textAnchor="middle" className="ph-unit ph-halo" style={{ fill: 'var(--ink)', fontWeight: 700 }}>
          {kind === 'polarni-den' ? 'Slunce nezapadá: polární den' : 'Slunce nevyjde: polární noc'}
        </text>
      )}
    </g>
  )
}

function sunLabel(lat: number, day: number): string {
  const decl = declination(day)
  const h = noonHeight(lat, decl)
  const side = noonSide(lat, decl)
  const kind = dayKind(lat, decl)
  const { rise, set } = sunTimes(lat, decl)
  const where = side === 'zenit' ? 'přímo v nadhlavníku' : `${czNum(Math.round(h * 10) / 10)}° nad obzorem na ${side === 'jih' ? 'jihu' : 'severu'}`
  return (
    `Zeměkoule osvětlená Sluncem a pohled na obzor. Rovnoběžka ${latText(lat)}, ${dateText(day)}. ` +
    `Slunce stojí v nadhlavníku nad rovnoběžkou ${latText(Math.round(decl * 10) / 10)}; ` +
    (h > 0 ? `tady je v poledne ${where}. ` : 'tady ani v poledne nevyjde nad obzor. ') +
    (kind === 'polarni-den'
      ? 'Slunce nezapadá, je polární den (24 h).'
      : kind === 'polarni-noc'
        ? 'Je polární noc, den trvá 0 h.'
        : `Den trvá ${hm(dayLength(lat, decl))}, Slunce vychází v ${clock(rise)} a zapadá v ${clock(set)} místního slunečního času.`)
  )
}

export default function SunAngle() {
  const [lat, setLat] = useState(50)
  const [day, setDay] = useState(MAR21)
  const nar = useNarrow()
  const decl = declination(day)
  const h = noonHeight(lat, decl)
  const kind = dayKind(lat, decl)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 6, 360, 260]} max={480} label={sunLabel(lat, day)} className="xp-sa">
          <Globe lat={lat} decl={decl} />
          <Sky h={h} side={noonSide(lat, decl)} />
          <DayBar lat={lat} decl={decl} />
        </Plate>
      }
      controls={
        <>
          <Control label="zeměpisná šířka" value={lat} min={-90} max={90} step={0.5} format={latText} onChange={setLat} />
          <Control label="datum" value={day} min={0} max={YEAR - 1} step={1} format={dateText} onChange={setDay} />
        </>
      }
      readouts={
        <>
          <Readout label="Slunce v poledne" value={h > 0 ? `${czNum(Math.round(h * 10) / 10)}°` : 'pod obzorem'} />
          <Readout
            label="délka dne"
            value={kind === 'polarni-den' ? '24 h' : kind === 'polarni-noc' ? '0 h' : hm(dayLength(lat, decl))}
          />
          <Readout label="ohřev 1 m² v poledne" value={Math.round(heating(h) * 100)} unit="%" digits={0} />
        </>
      }
      challenge={`Nastav ${dateText(JUN21)} a najdi nejjižnější rovnoběžku, kde Slunce celý den nezapadá.`}
      done={challengeMet(lat, day)}
    />
  )
}
