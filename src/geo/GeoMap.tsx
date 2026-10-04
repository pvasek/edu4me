/**
 * GeoMap – a real map (Natural Earth data) of one of the fixed views in src/geo/views.ts.
 * Used by the `map` lesson block, by figures that need real coastlines and by the map games.
 * See spec/geo.md for the API, the data and how to regenerate it.
 *
 * The SVG has a fixed viewBox (1000 × 1000/aspect); text, symbols and stroke widths are scaled with the
 * rendered width so they keep their size on screen (330 px phone … 760 px desktop).
 */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { MapBand, MapHighlight, MapLayer, MapPoint, MapRoute, MapView, Tone } from '../core/types'
import { Md, plain } from '../core/markup'
import { SvgMd } from '../illustrations/physics/kit'
import { COUNTRY_NAMES, CZ_REGION_NAMES } from './codes'
import { invert, project, resolveView, VB_W, type ViewGeo, type ViewSpec } from './frame'
import {
  baseMap,
  graticule,
  lonLatRect,
  parallel,
  platesPath,
  projector,
  routePieces,
  visibleAlong,
  type XY,
} from './geometry'
import { Placer, type Box } from './labels'
import { loadPlates, loadView, peekPlates, peekView, type GeoData, type PlatesData } from './load'
import { wrapLon } from './project'
import { countryAt, regionAt } from './query'
import './geo.css'

export interface GeoPick {
  lat: number
  lon: number
  /** country (ADM0_A3) under the tap */
  code?: string
  /** Czech region (CZ-xx) under the tap, czechia view only */
  region?: string
}

export interface GeoMapProps {
  /** a preset view (the lesson block's views) or a custom frame for figures (see FIGURE_FRAMES) */
  view: ViewSpec
  highlight?: MapHighlight[]
  points?: MapPoint[]
  routes?: MapRoute[]
  bands?: MapBand[]
  layers?: MapLayer[]
  /** codes outlined in ink (games: the chosen answer) */
  selected?: string[]
  /** pointer cursor and hover outline */
  interactive?: boolean
  /** a tap on the map: position and the country / region under it */
  onPick?: (hit: GeoPick) => void
  /** replaces the generated aria label */
  label?: string
  /** legend under the map (default true) */
  legend?: boolean
  /** entrance animation of highlights and routes (default true; off with reduced motion) */
  animate?: boolean
  /** drawn on top, in viewBox units; a function gets the projection and the px → unit scale */
  children?: ReactNode | ((ctx: { project: (lon: number, lat: number) => XY; u: number }) => ReactNode)
  className?: string
}

const TONES: Tone[] = ['a', 'b', 'c', 'd']
const toneAt = (i: number, t?: Tone): Tone => t ?? TONES[i % TONES.length]

/** Tropics and polar circles at 23° 26′ and 66° 34′. */
export const TROPIC_LINES = [
  { lat: 66 + 34 / 60, name: 'severní polární kruh', kind: 'polar' },
  { lat: 23 + 26 / 60, name: 'obratník Raka', kind: 'tropic' },
  { lat: 0, name: 'rovník', kind: 'equator' },
  { lat: -(23 + 26 / 60), name: 'obratník Kozoroha', kind: 'tropic' },
  { lat: -(66 + 34 / 60), name: 'jižní polární kruh', kind: 'polar' },
] as const

/** "50° s. š.", "0°" – Czech style. */
export function latLabel(lat: number): string {
  if (Math.abs(lat) < 1e-9) return '0°'
  return `${fmtDeg(Math.abs(lat))} ${lat > 0 ? 's.' : 'j.'} š.`
}
/** "15° v. d.", "180°". */
export function lonLabel(lon: number): string {
  const l = Math.abs(Math.abs(lon) - 180) < 1e-9 ? 180 : wrapLon(lon)
  if (Math.abs(l) < 1e-9) return '0°'
  if (Math.abs(l) === 180) return '180°'
  return `${fmtDeg(Math.abs(l))} ${l > 0 ? 'v.' : 'z.'} d.`
}
function fmtDeg(v: number): string {
  const d = Math.floor(v + 1e-9)
  const m = Math.round((v - d) * 60)
  return m ? `${d}° ${String(m).padStart(2, '0')}′` : `${d}°`
}

/** Czech name of a country or region code. */
export const nameOf = (code: string) => COUNTRY_NAMES[code] ?? CZ_REGION_NAMES[code] ?? code

/** Rough text width in px for placement. */
function estW(text: string, size: number, kind: 'caps' | 'serif' | 'sans' | 'mono'): number {
  const f = kind === 'caps' ? 0.74 : kind === 'serif' ? 0.47 : kind === 'mono' ? 0.62 : 0.56
  return plain(text).length * size * f + 2
}

const KIND_WORD: Record<NonNullable<MapPoint['kind']>, string> = {
  capital: 'hlavní město',
  city: 'město',
  peak: 'vrchol',
  volcano: 'sopka',
  quake: 'zemětřesení',
  place: 'místo',
}
const LAYER_WORD: Record<MapLayer, string> = {
  graticule: 'zeměpisná síť',
  'graticule-labels': 'popisky zeměpisné sítě',
  tropics: 'rovník, obratníky a polární kruhy',
  rivers: 'řeky',
  lakes: 'jezera',
  plates: 'hranice litosférických desek',
  regions: 'hranice krajů',
  timezones: 'časová pásma',
  names: 'názvy států',
}

/** Czech description of the map for screen readers. */
export function mapLabel(p: Pick<GeoMapProps, 'view' | 'highlight' | 'points' | 'routes' | 'bands' | 'layers'>): string {
  const g = resolveView(p.view)
  const parts: string[] = []
  for (const h of p.highlight ?? []) {
    const names = h.codes.map(nameOf).join(', ')
    parts.push(`zvýrazněno ${h.label ? `(${plain(h.label)}) ` : ''}${names}`)
  }
  const pts = (p.points ?? []).map((pt) => (pt.label ? plain(pt.label) : KIND_WORD[pt.kind ?? 'place']))
  if (pts.length) parts.push(`body: ${pts.join(', ')}`)
  const rts = (p.routes ?? []).map((r, i) => (r.label ? plain(r.label) : `trasa ${i + 1}`))
  if (rts.length) parts.push(`${p.routes!.some((r) => r.arrow) ? 'šipky' : 'trasy'}: ${rts.join(', ')}`)
  for (const b of p.bands ?? []) parts.push(`pás ${b.label ? plain(b.label) + ' ' : ''}od ${latLabel(b.from)} do ${latLabel(b.to)}`)
  const ls = (p.layers ?? []).filter((l) => l !== 'graticule-labels').map((l) => LAYER_WORD[l])
  if (ls.length) parts.push(`vrstvy: ${ls.join(', ')}`)
  return `${g.def.title}${parts.length ? ': ' + parts.join('; ') : ''}.`
}

// ------------------------------------------------------------------ hooks

function useWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(640)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0]?.contentRect.width ?? 0
      if (cw > 0) setW(Math.max(200, Math.round(cw / 10) * 10))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

function useGeoData(view: MapView): GeoData | undefined {
  const [data, setData] = useState<GeoData | undefined>(() => peekView(view))
  useEffect(() => {
    let live = true
    if (!peekView(view))
      loadView(view).then(
        (d) => live && setData(d),
        () => undefined,
      )
    else setData(peekView(view))
    return () => {
      live = false
    }
  }, [view])
  return data?.view === view ? data : peekView(view)
}

function usePlates(on: boolean): PlatesData | undefined {
  const [p, setP] = useState<PlatesData | undefined>(() => peekPlates())
  useEffect(() => {
    if (!on || peekPlates()) return
    let live = true
    loadPlates().then(
      (d) => live && setP(d),
      () => undefined,
    )
    return () => {
      live = false
    }
  }, [on])
  return on ? (p ?? peekPlates()) : undefined
}

// ------------------------------------------------------------------ symbols

function PointSymbol({ kind = 'place', x, y, u }: { kind?: MapPoint['kind']; x: number; y: number; u: number }) {
  const s = (v: number) => Math.round(v * u * 10) / 10
  switch (kind) {
    case 'capital':
      return (
        <g className="geo-sym">
          <circle cx={x} cy={y} r={s(5)} className="geo-sym-ring" />
          <circle cx={x} cy={y} r={s(2.2)} className="geo-sym-dot" />
        </g>
      )
    case 'city':
      return <circle cx={x} cy={y} r={s(3)} className="geo-sym geo-sym-dot geo-sym-halo" />
    case 'peak':
      return <path d={`M${x} ${y - s(6)}L${x + s(5.5)} ${y + s(4)}L${x - s(5.5)} ${y + s(4)}Z`} className="geo-sym geo-sym-peak" />
    case 'volcano':
      return (
        <g className="geo-sym">
          <path
            d={`M${x - s(2)} ${y - s(4)}L${x + s(2)} ${y - s(4)}L${x + s(6)} ${y + s(4)}L${x - s(6)} ${y + s(4)}Z`}
            className="geo-sym-volcano"
          />
          <path d={`M${x} ${y - s(5.5)}V${y - s(9)}M${x - s(2.6)} ${y - s(5.5)}L${x - s(4.5)} ${y - s(8.5)}M${x + s(2.6)} ${y - s(5.5)}L${x + s(4.5)} ${y - s(8.5)}`} className="geo-sym-plume" />
        </g>
      )
    case 'quake': {
      let d = ''
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8
        const r = i % 2 ? s(2.6) : s(7)
        d += `${i ? 'L' : 'M'}${(x + r * Math.sin(a)).toFixed(1)} ${(y - r * Math.cos(a)).toFixed(1)}`
      }
      return <path d={d + 'Z'} className="geo-sym geo-sym-quake" />
    }
    default:
      return (
        <g className="geo-sym">
          <path
            d={`M${x} ${y}C${x - s(1.5)} ${y - s(4)} ${x - s(5)} ${y - s(6)} ${x - s(5)} ${y - s(10)}A${s(5)} ${s(5)} 0 1 1 ${x + s(5)} ${y - s(10)}C${x + s(5)} ${y - s(6)} ${x + s(1.5)} ${y - s(4)} ${x} ${y}Z`}
            className="geo-sym-pin"
          />
          <circle cx={x} cy={y - s(10)} r={s(1.8)} className="geo-sym-pin-eye" />
        </g>
      )
  }
}

/** px box a symbol occupies (for label placement). */
function symbolBox(kind: MapPoint['kind'] = 'place', x: number, y: number, u: number): Box {
  if (kind === 'place') return { x: x - 5.5 * u, y: y - 16 * u, w: 11 * u, h: 16 * u }
  if (kind === 'volcano') return { x: x - 6 * u, y: y - 9 * u, w: 12 * u, h: 13 * u }
  const r = (kind === 'quake' ? 7 : kind === 'capital' ? 5.5 : kind === 'peak' ? 6 : 3.5) * u
  return { x: x - r, y: y - r, w: 2 * r, h: 2 * r }
}

// ------------------------------------------------------------------ the map

interface TextItem {
  key: string
  x: number
  y: number
  text: string
  size: number
  cls: string
  anchor: 'start' | 'middle' | 'end'
  lines?: string[]
  md?: boolean
}

export function GeoMap({
  view,
  highlight = [],
  points = [],
  routes = [],
  bands = [],
  layers = [],
  selected = [],
  interactive = false,
  onPick,
  label,
  legend = true,
  animate = true,
  children,
  className = '',
}: GeoMapProps) {
  const g = resolveView(view)
  const H = g.H
  const [boxRef, px] = useWidth()
  const u = VB_W / px
  const data = useGeoData(g.dataView)
  const has = (l: MapLayer) => layers.includes(l)
  const plates = usePlates(has('plates'))
  const svgRef = useRef<SVGSVGElement>(null)
  const seen = useInView(svgRef, { once: true, amount: 0.3 })
  const still = !!useReducedMotion() || !animate
  const show = still || seen
  const id = 'geo' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [hover, setHover] = useState<string | undefined>()

  const base = useMemo(() => (data ? baseMap(g, data) : undefined), [g, data])
  const grat = useMemo(() => (has('graticule') || has('graticule-labels') ? graticule(g) : undefined), [g, layers]) // eslint-disable-line react-hooks/exhaustive-deps
  const platePaths = useMemo(() => (plates ? platesPath(g, plates) : undefined), [g, plates])

  const toneOf = useMemo(() => {
    const m = new Map<string, Tone>()
    highlight.forEach((h, i) => h.codes.forEach((c) => m.set(c, toneAt(i, h.tone))))
    return m
  }, [highlight])

  const routeGeo = useMemo(() => routes.map((r) => routePieces(g, r)), [g, routes])

  // ---------------------------------------------------------------- labels (depend on the rendered width)
  const overlay = useMemo(() => {
    const P = projector(g)
    const placer = new Placer(VB_W, H, 2 * u)
    const texts: TextItem[] = []
    const markers: { key: string; x: number; y: number; tone: Tone }[] = []
    const add = (t: TextItem, cands: [number, number, 'start' | 'middle' | 'end'][], kind: Parameters<typeof estW>[2], required = false) => {
      const lines = t.lines ?? [t.text]
      const w = Math.max(...lines.map((l) => estW(l, t.size / u, kind))) * u
      const lh = t.size * 1.05
      const boxes = cands.map(([x, y, a]) => ({
        x: a === 'start' ? x : a === 'middle' ? x - w / 2 : x - w,
        y: y - t.size * 0.82,
        w,
        h: lh * lines.length,
      }))
      const b = placer.place(boxes, required)
      if (!b) return false
      const i = boxes.indexOf(b)
      texts.push({ ...t, x: cands[i][0], y: cands[i][1], anchor: cands[i][2], lines })
      return true
    }

    // point symbols first (they block labels)
    const pts = points.map((p) => {
      const [x, y] = P(unwrapLon(g, p.lon), p.lat)
      placer.block(symbolBox(p.kind, x, y, u))
      return { p, x, y }
    })

    // tiny highlighted states → markers
    const tiny = new Set<string>()
    if (data && base) {
      for (const [code, tone] of toneOf) {
        const sp = base.countries.get(code) ?? base.regions.get(code)
        const small = !sp || !sp.d || sp.ring < 5 * u
        if (!small) continue
        const lp = data.labels[code]
        if (!lp) continue
        // the label point (an archipelago's main island), else the centre of the largest ring
        const [x, y] = lp ? P(unwrapLon(g, lp[0]), lp[1]) : sp!.mid
        if (x < 0 || x > VB_W || y < 0 || y > H) continue
        tiny.add(code)
        markers.push({ key: code, x, y, tone })
        placer.block({ x: x - 4.5 * u, y: y - 4.5 * u, w: 9 * u, h: 9 * u })
      }
    }

    // point labels (required)
    pts.forEach(({ p, x, y }, i) => {
      if (!p.label) return
      const size = 14 * u
      const top = p.kind === 'place' ? 17 : p.kind === 'volcano' ? 11 : 8
      add(
        { key: 'p' + i, x, y, text: p.label, size, cls: 'geo-t-pt', anchor: 'start', md: true },
        [
          [x + 8 * u, y + 4.5 * u, 'start'],
          [x - 8 * u, y + 4.5 * u, 'end'],
          [x, y - top * u, 'middle'],
          [x, y + 17 * u, 'middle'],
          [x + 6 * u, y - 6 * u, 'start'],
          [x - 6 * u, y - 6 * u, 'end'],
          [x + 6 * u, y + 15 * u, 'start'],
          [x - 6 * u, y + 15 * u, 'end'],
        ],
        'serif',
        true,
      )
    })

    // names of highlighted states (or of every visible state / region when nothing is highlighted)
    if (has('names') && data && base) {
      const regionsView = g.dataView === 'czechia' && (has('regions') || [...toneOf.keys()].some((c) => c.startsWith('CZ-')))
      let codes = [...toneOf.keys()]
      if (!codes.length) codes = regionsView ? [...base.regions.keys()] : [...base.countries.keys()]
      const items = codes
        .map((code) => {
          const sp = base.countries.get(code) ?? base.regions.get(code)
          const area = sp && sp.d ? sp.ring * sp.ring : 0
          return { code, sp, area }
        })
        .sort((a, b) => b.area - a.area)
      for (const { code, sp } of items) {
        const lp = data.labels[code]
        if (!lp) continue
        const name = nameOf(code)
        const isTiny = tiny.has(code)
        const mk = markers.find((m) => m.key === code)
        const [x, y] = mk ? [mk.x, mk.y] : P(unwrapLon(g, lp[0]), lp[1])
        if (x < 0 || x > VB_W || y < 0 || y > H) continue
        const isRegion = code.startsWith('CZ-')
        const short = isRegion ? name.replace(/ kraj$/, '').replace(/^Kraj /, '').replace('Hlavní město ', '') : name
        const widthPx = sp && sp.d ? sp.ring / u : 0
        let lines = [short]
        if (!isTiny && short.includes(' ') && estW(short, 10.5, 'caps') > Math.max(70, widthPx * 1.1)) {
          const words = short.split(' ')
          let best = 1
          let bd = Infinity
          for (let k = 1; k < words.length; k++) {
            const d = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length)
            if (d < bd) {
              bd = d
              best = k
            }
          }
          lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')]
        }
        if (!isTiny && !toneOf.size && widthPx < estW(lines[0], 10.5, 'caps') * 0.6) continue
        // a smaller size is tried when the name does not fit at the normal one
        for (const px of isRegion ? [10, 8.5] : [10.5, 9]) {
          const size = px * u
          const dy = ((lines.length - 1) * size * 1.05) / 2
          const sh = Math.min(30, widthPx * 0.25) * u
          const cands: [number, number, 'start' | 'middle' | 'end'][] = isTiny
            ? [
                [x + 7 * u, y + 4 * u, 'start'],
                [x - 7 * u, y + 4 * u, 'end'],
                [x, y - 8 * u, 'middle'],
                [x, y + 15 * u, 'middle'],
                [x + 6 * u, y - 6 * u, 'start'],
                [x - 6 * u, y - 6 * u, 'end'],
                [x + 6 * u, y + 14 * u, 'start'],
                [x - 6 * u, y + 14 * u, 'end'],
              ]
            : [
                [x, y + size * 0.35 - dy, 'middle'],
                [x, y - size * 0.8 - dy, 'middle'],
                [x, y + size * 1.4 - dy, 'middle'],
                [x - sh, y + size * 0.35 - dy, 'middle'],
                [x + sh, y + size * 0.35 - dy, 'middle'],
                [x, y - size * 1.9 - dy, 'middle'],
                [x, y + size * 2.5 - dy, 'middle'],
              ]
          const cls = isRegion ? 'geo-t-name geo-t-region' : 'geo-t-name'
          if (add({ key: 'n' + code, x, y, text: short, size, cls, anchor: 'middle', lines }, cands, 'caps')) break
        }
      }
    }

    // band labels at the left edge
    bands.forEach((b, i) => {
      if (!b.label) return
      const mid = (b.from + b.to) / 2
      const vis = visibleAlong(g, [g.clip[0], mid, g.clip[2], mid], H).filter(([x]) => !g.sphere || insideSphere(g, x, mid))
      if (!vis.length) return
      const [x, y] = vis.reduce((a, c) => (c[0] < a[0] ? c : a))
      add({ key: 'b' + i, x, y, text: b.label, size: 12.5 * u, cls: `geo-t-band geo-tone-${toneAt(i, b.tone)}`, anchor: 'start', md: true }, [[x + 6 * u, y + 4 * u, 'start'], [x + 6 * u, y - 6 * u, 'start'], [x + 6 * u, y + 14 * u, 'start']], 'serif')
    })

    // tropics: names at the right end of each line
    if (has('tropics'))
      for (const t of TROPIC_LINES) {
        if (t.lat < g.clip[1] || t.lat > g.clip[3]) continue
        const vis = visibleAlong(g, [g.clip[0], t.lat, g.clip[2], t.lat], H).filter(([x]) => !g.sphere || insideSphere(g, x, t.lat))
        if (!vis.length) continue
        const [x, y] = vis.reduce((a, c) => (c[0] > a[0] ? c : a))
        const right = x > VB_W - 12 * u
        add(
          { key: 't' + t.lat, x, y, text: t.name, size: 11.5 * u, cls: 'geo-t-line', anchor: 'end' },
          [
            [Math.min(x, VB_W) - 6 * u, y - 4 * u, 'end'],
            [Math.min(x, VB_W) - 6 * u, y + 13 * u, 'end'],
            ...(right ? [] : [[x - 60 * u, y - 4 * u, 'end'] as [number, number, 'end']]),
          ],
          'serif',
        )
      }

    // time zones: offsets along the top
    if (has('timezones')) {
      const [w, , e] = g.clip
      const zones: number[] = []
      for (let n = Math.ceil(w / 15 - 1e-9); n * 15 <= e + 1e-9; n++) zones.push(n)
      // UTC first, then outwards: the labels nearest Greenwich win when space is short
      zones.sort((a, b) => Math.abs(wrapLon(a * 15)) - Math.abs(wrapLon(b * 15)))
      for (const n of zones) {
        const c = n * 15
        if (g.def.proj.kind !== 'laea' && Math.abs(c) >= 180) continue
        const off = Math.round(wrapLon(c) / 15)
        const vis = visibleAlong(g, [c, g.clip[1], c, Math.min(g.clip[3], 89.9)], H).filter(([x]) => !g.sphere || x > 0)
        if (!vis.length) continue
        const [x, y] = vis.reduce((a, b) => (b[1] < a[1] ? b : a))
        const text = off === 0 ? 'UTC' : `${off > 0 ? '+' : '−'}${Math.abs(off)}`
        add({ key: 'z' + n, x, y, text, size: 10.5 * u, cls: 'geo-t-tz', anchor: 'middle' }, [[x, y + 13 * u, 'middle'], [x, y + 25 * u, 'middle']], 'mono')
      }
    }

    // graticule labels
    if (grat && has('graticule-labels')) {
      const step = g.def.gridLabels
      const polar = Math.abs(g.def.proj.lat0 ?? 0) === 90
      const pole = polar ? P(0, g.def.proj.lat0!) : null
      for (const lat of grat.lats) {
        if (Math.abs(lat / step - Math.round(lat / step)) > 1e-9) continue
        const vis = visibleAlong(g, [g.clip[0], lat, g.clip[2], lat], H).filter(([x]) => !g.sphere || insideSphere(g, x, lat))
        if (!vis.length) continue
        const [x, y] = vis.reduce((a, c) => (c[0] < a[0] ? c : a))
        // regional views label the parallels at the left edge only (not where they curl round a pole)
        if (!polar && !g.sphere && x > 25 * u) continue
        add({ key: 'gl' + lat, x, y, text: latLabel(lat), size: 9.5 * u, cls: 'geo-t-grid', anchor: 'start' }, [[x + 4 * u, y - 3 * u, 'start'], [x + 4 * u, y + 10 * u, 'start']], 'mono')
      }
      for (const lon of grat.lons) {
        if (Math.abs(lon / step - Math.round(lon / step)) > 1e-9) continue
        const vis = visibleAlong(g, [lon, Math.max(g.clip[1], -89.9), lon, Math.min(g.clip[3], 89.9)], H)
        if (vis.length < 2) continue
        let end: XY
        if (pole) {
          const a = vis[0]
          const b = vis[vis.length - 1]
          const da = Math.hypot(a[0] - pole[0], a[1] - pole[1])
          const db = Math.hypot(b[0] - pole[0], b[1] - pole[1])
          end = da > db ? a : b
        } else end = vis.reduce((a, c) => (c[1] > a[1] ? c : a))
        const [x, y] = end
        if (!polar && !g.sphere && y < H - 25 * u) continue
        const atBottom = y > H - 12 * u
        add(
          { key: 'gm' + lon, x, y, text: lonLabel(lon), size: 9.5 * u, cls: 'geo-t-grid', anchor: 'middle' },
          atBottom || !pole
            ? [[x, y - 5 * u, 'middle'], [x, y - 16 * u, 'middle']]
            : [[x, y + (y < H / 2 ? 12 : -5) * u, 'middle'], [x + (x < VB_W / 2 ? 4 : -4) * u, y, x < VB_W / 2 ? 'start' : 'end']],
          'mono',
        )
      }
    }
    return { texts, markers, pts }
  }, [g, H, u, data, base, points, bands, layers, toneOf, grat]) // eslint-disable-line react-hooks/exhaustive-deps

  const ariaLabel = label ?? mapLabel({ view, highlight, points, routes, bands, layers })

  const onPointer = (e: React.PointerEvent<SVGSVGElement>, pick: boolean) => {
    const svg = svgRef.current
    const m = svg?.getScreenCTM()
    if (!svg || !m) return
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    const ll = invert(view, pt.x, pt.y)
    if (!ll) {
      if (!pick) setHover(undefined)
      return
    }
    const code = countryAt(view, ll.lon, ll.lat)
    const region = g.dataView === 'czechia' ? regionAt(ll.lon, ll.lat) : undefined
    if (pick) onPick?.({ lat: ll.lat, lon: ll.lon, code, region })
    else setHover(region ?? code)
  }

  const shapeD = (code: string) => base?.countries.get(code)?.d || base?.regions.get(code)?.d || ''
  const fade = (delay = 0) =>
    still
      ? { initial: false as const }
      : { initial: { opacity: 0 }, animate: { opacity: show ? 1 : 0 }, transition: { duration: 0.7, delay } }

  const legendItems = [
    ...highlight.flatMap((h, i) => (h.label ? [{ k: 'h' + i, text: h.label, tone: toneAt(i, h.tone), kind: 'area' as const }] : [])),
    ...routes.flatMap((r, i) =>
      r.label ? [{ k: 'r' + i, text: r.label, tone: toneAt(i, r.tone), kind: r.style === 'dashed' ? ('dashed' as const) : ('line' as const) }] : [],
    ),
    ...bands.flatMap((b, i) => (b.label ? [{ k: 'b' + i, text: b.label, tone: toneAt(i, b.tone), kind: 'band' as const }] : [])),
  ]

  const clipUrl = `url(#${id}-clip)`
  const frameD = g.sphere ?? `M0 0H${VB_W}V${r1(H)}H0Z`

  return (
    <div className={`geo ${interactive || onPick ? 'geo-interactive' : ''} ${className}`} style={{ ['--geo-u' as string]: u }}>
      <div ref={boxRef} className="geo-box" style={{ aspectRatio: `${VB_W} / ${r1(H)}` }}>
        <svg
          ref={svgRef}
          className={`geo-svg${g.def.scale === '10m' ? ' geo-fine' : ''}`}
          viewBox={`0 0 ${VB_W} ${r1(H)}`}
          role="img"
          aria-label={ariaLabel}
          aria-busy={data ? undefined : true}
          onPointerUp={onPick ? (e) => onPointer(e, true) : undefined}
          onPointerMove={interactive ? (e) => onPointer(e, false) : undefined}
          onPointerLeave={interactive ? () => setHover(undefined) : undefined}
        >
          <defs>
            <clipPath id={`${id}-clip`}>
              <path d={frameD} />
            </clipPath>
            {TONES.map((t) => (
              <pattern key={t} id={`${id}-h${t}`} width={r1(4.5 * u)} height={r1(4.5 * u)} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1={0} y1={0} x2={0} y2={r1(4.5 * u)} className={`geo-hatch geo-tone-${t}`} strokeWidth={r1(0.9 * u)} />
              </pattern>
            ))}
          </defs>
          <g clipPath={clipUrl}>
            <path d={frameD} className="geo-sea" />
            {base && (
              <g className="geo-land">
                {[...base.countries].map(([code, sp]) =>
                  sp.d ? <path key={code} d={sp.d} data-code={code} className={g.def.home && code !== g.def.home ? 'geo-out' : undefined} /> : null,
                )}
              </g>
            )}
            {has('timezones') && <TimeZones g={g} />}
            {base && toneOf.size > 0 && (
              <motion.g {...fade(0.1)}>
                {[...toneOf].map(([code, t]) => {
                  const d = shapeD(code)
                  return d ? (
                    <g key={code} className={`geo-tone-${t}`}>
                      <path d={d} className="geo-hl" />
                      <path d={d} className="geo-hl-hatch" fill={`url(#${id}-h${t})`} />
                    </g>
                  ) : null
                })}
              </motion.g>
            )}
            {bands.map((b, i) => (
              <motion.g key={i} className={`geo-tone-${toneAt(i, b.tone)}`} {...fade(0.2 + i * 0.1)}>
                <path d={lonLatRect(g, g.clip[0], Math.max(b.from, g.clip[1]), g.clip[2], Math.min(b.to, g.clip[3]))} className="geo-band" />
                <path d={lonLatRect(g, g.clip[0], Math.max(b.from, g.clip[1]), g.clip[2], Math.min(b.to, g.clip[3]))} className="geo-band-hatch" fill={`url(#${id}-h${toneAt(i, b.tone)})`} />
                <path d={parallel(g, b.from) + parallel(g, b.to)} className="geo-band-edge" />
              </motion.g>
            ))}
            {base && (
              <>
                <path d={base.lakesBig} className="geo-lake" />
                {has('lakes') && <path d={base.lakesSmall} className="geo-lake" />}
                {has('rivers') && (
                  <g className="geo-rivers">
                    <path d={base.rivers[2]} className="geo-river geo-river-2" />
                    <path d={base.rivers[1]} className="geo-river geo-river-1" />
                    <path d={base.rivers[0]} className="geo-river geo-river-0" />
                  </g>
                )}
                {has('regions') && <path d={base.regionBorders} className="geo-region-border" />}
                <path d={base.borders} className="geo-border" />
                <path d={base.coast} className="geo-coast" />
              </>
            )}
            {grat && has('graticule') && <path d={grat.d} className="geo-grat" />}
            {has('tropics') &&
              TROPIC_LINES.map((t) => <path key={t.lat} d={parallel(g, t.lat)} className={`geo-tropic geo-tropic-${t.kind}`} />)}
            {platePaths && (
              <g className="geo-plates">
                <title>Hranice litosférických desek: PB2002 (P. Bird 2003), licence ODC-BY</title>
                <path d={platePaths.all} className="geo-plate" />
                <path d={platePaths.subduction} className="geo-plate geo-plate-sub" />
              </g>
            )}
            {hover && <path d={shapeD(hover)} className="geo-hover" />}
            {selected.map((c) => (
              <path key={c} d={shapeD(c)} className="geo-selected" />
            ))}
            {routeGeo.map((pieces, i) => {
              const r = routes[i]
              const t = toneAt(i, r.tone)
              const last = pieces[pieces.length - 1]
              let head: string | null = null
              if (r.arrow && last && last.pts.length >= 2) {
                const [ax, ay] = last.pts[last.pts.length - 2]
                const [bx, by] = last.pts[last.pts.length - 1]
                const a = Math.atan2(by - ay, bx - ax)
                const L = 11 * u
                const W2 = 4.6 * u
                const p = (dx: number, dy: number) => `${r1(bx + dx * Math.cos(a) - dy * Math.sin(a))} ${r1(by + dx * Math.sin(a) + dy * Math.cos(a))}`
                head = `M${p(0, 0)}L${p(-L, W2)}L${p(-L * 0.72, 0)}L${p(-L, -W2)}Z`
              }
              const dashed = r.style === 'dashed'
              return (
                <g key={i} className={`geo-tone-${t}`}>
                  {pieces.map((pc, k) =>
                    dashed || still ? (
                      <motion.path key={k} d={pc.d} className={`geo-route ${dashed ? 'geo-route-dash' : ''}`} {...fade(0.4 + i * 0.15)} />
                    ) : (
                      <motion.path
                        key={k}
                        d={pc.d}
                        className="geo-route"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        transition={{ pathLength: { duration: 0.9, delay: 0.3 + i * 0.15, ease: 'easeInOut' }, opacity: { duration: 0.05, delay: 0.3 + i * 0.15 } }}
                      />
                    ),
                  )}
                  {head && <motion.path d={head} className="geo-route-head" {...fade(still ? 0 : 1.1 + i * 0.15)} />}
                </g>
              )
            })}
          </g>
          <path d={frameD} className="geo-frame" />
          {overlay.markers.map((m) => (
            <motion.circle key={m.key} cx={r1(m.x)} cy={r1(m.y)} r={r1(3.6 * u)} className={`geo-tiny geo-tone-${m.tone}`} {...fade(0.1)} />
          ))}
          {overlay.pts.map(({ p, x, y }, i) => (
            <PointSymbol key={i} kind={p.kind} x={r1(x)} y={r1(y)} u={u} />
          ))}
          <g className="geo-texts" strokeWidth={r1(3.2 * u)}>
            {overlay.texts.map((t) => (
              <text key={t.key} x={r1(t.x)} y={r1(t.y)} fontSize={r1(t.size)} textAnchor={t.anchor} className={`geo-t ${t.cls}`}>
                {t.md ? (
                  <SvgMd text={t.text} />
                ) : t.lines && t.lines.length > 1 ? (
                  t.lines.map((l, k) => (
                    <tspan key={k} x={r1(t.x)} dy={k ? r1(t.size * 1.05) : 0}>
                      {l}
                    </tspan>
                  ))
                ) : (
                  t.text
                )}
              </text>
            ))}
          </g>
          {typeof children === 'function' ? children({ project: (lon, lat) => project(view, lon, lat), u }) : children}
        </svg>
      </div>
      {legend && (legendItems.length > 0 || platePaths) && (
        <div className="geo-foot">
          {legendItems.length > 0 && (
            <ul className="geo-legend" aria-label="Legenda mapy">
              {legendItems.map((it) => (
                <li key={it.k} className={`geo-tone-${it.tone}`}>
                  <svg viewBox="0 0 28 14" width={28} height={14} aria-hidden="true">
                    {it.kind === 'area' && <rect x={1} y={1} width={26} height={12} rx={2} className="geo-leg-area" />}
                    {it.kind === 'band' && <rect x={1} y={3} width={26} height={8} className="geo-leg-band" />}
                    {(it.kind === 'line' || it.kind === 'dashed') && (
                      <line x1={2} x2={26} y1={7} y2={7} className={`geo-leg-line ${it.kind === 'dashed' ? 'geo-route-dash' : ''}`} />
                    )}
                  </svg>
                  <span>
                    <Md text={it.text} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {platePaths && <p className="geo-credit">Hranice litosférických desek: PB2002 (P. Bird, 2003), ODC-BY.</p>}
        </div>
      )}
    </div>
  )
}

export default GeoMap

const r1 = (v: number) => Math.round(v * 10) / 10

function unwrapLon(g: ViewGeo, lon: number): number {
  let d = lon - g.lonC
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return g.lonC + d
}

/** On the world map: is x inside the globe outline at latitude `lat`? */
function insideSphere(g: ViewGeo, x: number, lat: number): boolean {
  const P = projector(g)
  const [xl] = P(g.lonC - 180, lat)
  const [xr] = P(g.lonC + 180, lat)
  return x >= xl - 0.5 && x <= xr + 0.5
}

function TimeZones({ g }: { g: ViewGeo }) {
  const stripes = useMemo(() => {
    const [w, s, e, n] = g.clip
    const out: string[] = []
    for (let k = Math.floor((w + 7.5) / 15); k * 15 - 7.5 < e; k++) {
      if (k % 2 === 0) continue
      const d = lonLatRect(g, Math.max(w, k * 15 - 7.5), s, Math.min(e, k * 15 + 7.5), n)
      if (d) out.push(d)
    }
    return out.join('')
  }, [g])
  return <path d={stripes} className="geo-tz" />
}
