import { useEffect, useMemo, useState } from 'react'
import { loadView, peekView, type GeoData } from '../../geo/load'
import { Plate, czNum, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  AFRICA,
  CIRCLE_KM,
  GREENLAND,
  KEEPS,
  MERC_LAT,
  REAL_RATIO,
  challengeMet,
  circle,
  growth,
  proj,
  shapesArea,
  type Kind,
} from './map-projection.model'

/** "Vyzkoušej si" for z1-6: Mercator ↔ Robinson ↔ Equal Earth; a circle of the same real size grows towards the pole on Mercator. */

const IN: Record<Kind, string> = {
  mercator: 'v Mercatorově zobrazení',
  robinson: 'v Robinsonově zobrazení',
  'equal-earth': 'v plochojevném zobrazení Equal Earth',
}
const CIRCLE_LON = -22
/** "1 000" (a non-breaking space between the thousands, as Czech writes it) */
const KM = String(CIRCLE_KM).replace(/\B(?=(\d{3})+$)/g, '\u00a0')
const SEA = 'color-mix(in srgb, var(--blue) 17%, var(--paper))'
const LAND = 'var(--surface)'
const COAST = 'color-mix(in srgb, var(--edge) 55%, transparent)'

// the map box inside the 360 × 238 plate
const BX = 4
const BY = 4
const BW = 352
const BH = 230

interface Fit {
  P: (lon: number, lat: number) => [number, number]
  outline: string
  latMax: number
}

function fit(kind: Kind): Fit {
  const p = proj(kind)
  const latMax = kind === 'mercator' ? MERC_LAT : 90
  const xmax = p.forward(180, 0)[0]
  const ymax = p.forward(0, latMax)[1]
  const s = Math.min(BW / (2 * xmax), BH / (2 * ymax))
  const oy = BY + (BH - 2 * ymax * s) / 2
  const P = (lon: number, lat: number): [number, number] => {
    const [x, y] = p.forward(lon, lat)
    return [BX + BW / 2 + x * s, oy + (ymax - y) * s]
  }
  const pts: [number, number][] = []
  for (let lat = -latMax; lat <= latMax; lat += 2) pts.push(P(180, lat))
  for (let lat = latMax; lat >= -latMax; lat -= 2) pts.push(P(-180, lat))
  return { P, outline: path(pts, true), latMax }
}

function path(pts: [number, number][], closed: boolean): string {
  let d = ''
  pts.forEach(([x, y], i) => (d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`))
  return closed ? d + 'Z' : d
}
const ringPath = (P: Fit['P'], ring: ArrayLike<number>) => {
  const pts: [number, number][] = []
  for (let i = 0; i < ring.length; i += 2) pts.push(P(ring[i], ring[i + 1]))
  return path(pts, true)
}

/** The Natural Earth world data, loaded once. */
export function useWorld(): GeoData | undefined {
  const [data, setData] = useState<GeoData | undefined>(() => peekView('world'))
  useEffect(() => {
    if (data) return
    let live = true
    loadView('world')
      .then((d) => live && setData(d))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [data])
  return data
}

function MapPicture({ kind, lat, data }: { kind: Kind; lat: number; data?: GeoData }) {
  const { id } = usePlate()
  const f = useMemo(() => fit(kind), [kind])
  const land = useMemo(() => {
    if (!data) return null
    const other: string[] = []
    const africa: string[] = []
    let grl = ''
    for (const [code, sh] of data.countries) {
      const d = sh.rings.map((r) => ringPath(f.P, r)).join('')
      if (code === GREENLAND) grl = d
      else if (AFRICA.includes(code)) africa.push(d)
      else other.push(d)
    }
    return { other: other.join(''), africa: africa.join(''), grl }
  }, [data, f])
  const grid = useMemo(() => {
    const parts: string[] = []
    for (let lon = -150; lon <= 150; lon += 30) {
      const pts: [number, number][] = []
      for (let la = -f.latMax; la <= f.latMax; la += 2) pts.push(f.P(lon, la))
      parts.push(path(pts, false))
    }
    for (let la = -60; la <= 60; la += 30) {
      const pts: [number, number][] = []
      for (let lo = -180; lo <= 180; lo += 3) pts.push(f.P(lo, la))
      parts.push(path(pts, false))
    }
    return parts.join('')
  }, [f])
  const ring = (la: number) => {
    const c = circle(la, CIRCLE_LON)
    const pts: [number, number][] = []
    for (let i = 0; i < c.length; i += 2) pts.push(f.P(c[i], Math.min(f.latMax, c[i + 1])))
    return path(pts, true)
  }
  const clip = `${id}-mp-clip`
  const lbl = (lon: number, la: number, text: string) => {
    const [x, y] = f.P(lon, la)
    return (
      <text x={x} y={y + 5} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo" style={{ fill: 'var(--ink)' }}>
        {text}
      </text>
    )
  }
  return (
    <g>
      <clipPath id={clip}>
        <path d={f.outline} />
      </clipPath>
      <path d={f.outline} fill={SEA} />
      <g clipPath={`url(#${clip})`}>
        <path d={grid} fill="none" stroke="color-mix(in srgb, var(--blue) 38%, transparent)" strokeWidth={0.6} />
        {land && (
          <>
            <path d={land.other} fill={LAND} stroke={COAST} strokeWidth={0.4} fillRule="evenodd" />
            <path d={land.africa} fill="color-mix(in srgb, var(--teal) 34%, var(--surface))" stroke={COAST} strokeWidth={0.4} fillRule="evenodd" />
            <path d={land.grl} fill="color-mix(in srgb, var(--accent) 38%, var(--surface))" stroke={COAST} strokeWidth={0.5} fillRule="evenodd" />
          </>
        )}
        <path d={ring(0)} fill="none" stroke="var(--ink)" strokeWidth={1.3} strokeDasharray="3 3" />
        <path d={ring(lat)} fill="color-mix(in srgb, var(--pink) 35%, transparent)" stroke="var(--pink)" strokeWidth={2} />
      </g>
      <path d={f.outline} fill="none" stroke="var(--edge)" strokeWidth={1.2} />
      {land && lbl(-42, 73, 'Grónsko')}
      {land && lbl(19, 6, 'Afrika')}
    </g>
  )
}

function ratioOf(kind: Kind, data?: GeoData): number {
  if (!data) return NaN
  const p = proj(kind)
  const sh = (codes: string[]) => codes.map((c) => data.countries.get(c)?.rings ?? [])
  return shapesArea(p, sh(AFRICA)) / shapesArea(p, sh([GREENLAND]))
}

function mapLabel(kind: Kind, lat: number, ratio: number): string {
  const g = growth(kind, lat, CIRCLE_LON)
  return (
    `Mapa světa ${IN[kind]}. Kruh o poloměru ${KM} km je posunutý na ${czNum(lat)}° s. š.; ` +
    (Math.abs(g - 1) < 0.05 ? 'na mapě má stejnou plochu jako na rovníku. ' : `na mapě je ${czNum(Math.round(g * 10) / 10)}× větší než stejný kruh na rovníku. `) +
    (Number.isFinite(ratio)
      ? `Afrika je na této mapě ${czNum(Math.round(ratio * 10) / 10)}× větší než Grónsko, ve skutečnosti ${REAL_RATIO}×.`
      : `Afrika je ve skutečnosti ${REAL_RATIO}× větší než Grónsko.`)
  )
}

export default function MapProjection() {
  const [kind, setKind] = useState<Kind>('mercator')
  const [lat, setLat] = useState(0)
  const data = useWorld()
  const nar = useNarrow()
  const ratio = useMemo(() => ratioOf(kind, data), [kind, data])
  const g = growth(kind, lat, CIRCLE_LON)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 238]} max={520} label={mapLabel(kind, lat, ratio)} className="xp-mp">
          <MapPicture kind={kind} lat={lat} data={data} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="zobrazení"
            value={kind}
            options={[
              { value: 'mercator', label: 'Mercatorovo' },
              { value: 'robinson', label: 'Robinsonovo' },
              { value: 'equal-earth', label: 'Equal Earth' },
            ]}
            onChange={setKind}
          />
          <Control label={`kruh o poloměru ${KM} km posuň na sever`} value={lat} min={0} max={70} step={5} format={(v) => (v ? `${v}° s. š.` : '0° (rovník)')} onChange={setLat} />
        </>
      }
      readouts={
        <>
          <Readout label="kruh na mapě oproti rovníku" value={`${czNum(Math.round(g * 10) / 10)}×`} />
          <Readout label={`Afrika : Grónsko na mapě (skutečně ${REAL_RATIO} : 1)`} value={Number.isFinite(ratio) ? `${czNum(Math.round(ratio * 10) / 10)} : 1` : '…'} />
          <Readout label="zobrazení zachovává" value={KEEPS[kind]} />
        </>
      }
      challenge="Najdi zobrazení, na kterém je Afrika opravdu asi 14× větší než Grónsko."
      done={challengeMet(ratio)}
    />
  )
}
