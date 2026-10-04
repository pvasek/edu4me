/**
 * The geometry of a map view: projection, frame (the drawn rectangle) and the lon/lat clip box of its data.
 * All SVG coordinates live in a fixed viewBox 1000 units wide (height = 1000 / aspect); GeoMap scales text and
 * symbols so they keep their on-screen size at any width.
 */
import type { MapView } from '../core/types'
import { makeProjection, type Projection } from './project'
import { VIEW_DEFS, type ViewDef } from './views'

export const VB_W = 1000

/**
 * A custom frame for figures (not for the lesson block): a Lambert azimuthal equal-area map centred on `center`
 * that shows the lon/lat box `bbox`. The data comes from the finest preset view whose data covers it.
 */
export interface CustomFrame {
  /** [lon, lat] */
  center: [number, number]
  /** [west, south, east, north]; east may exceed 180 */
  bbox: [number, number, number, number]
  /** width / height; default: the box's own shape */
  aspect?: number
  /** "Mapa …" for the aria label */
  title?: string
}
/** A preset view id, or a custom frame. */
export type ViewSpec = MapView | CustomFrame

/** Frames used by figures (gz figures in spec/courses/zemepis/figures.md). */
export const FIGURE_FRAMES = {
  /** Labrador to Norway: the Gulf Stream, North Atlantic Drift, Bergen vs Labrador */
  'north-atlantic': { center: [-28, 54], bbox: [-68, 30, 22, 72], aspect: 1.35, title: 'Mapa severního Atlantiku' },
} satisfies Record<string, CustomFrame>

export interface ViewGeo {
  /** cache key: the view id, or the custom frame as JSON */
  key: string
  /** the preset view whose data module is drawn */
  dataView: MapView
  def: ViewDef
  proj: Projection
  /** viewBox height (width is VB_W) */
  H: number
  /** projected frame [x0, y0, x1, y1] (y north) and the projected → SVG scale */
  frame: [number, number, number, number]
  k: number
  /** data clip box in lon/lat [w, s, e, n]; longitudes are continuous around `lonC` and may pass ±180 */
  clip: [number, number, number, number]
  lonC: number
  /** the clip box covers every longitude (world, polar views) */
  global: boolean
  /** world view: the outline of the whole globe in SVG units (sea is drawn inside it) */
  sphere?: string
}

/** Longitude unwrapped to lie within ±180° of `c` (180° itself stays on the side it came from). */
export function unwrap(lon: number, c: number): number {
  let d = lon - c
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return c + d
}

const cache = new Map<MapView, ViewGeo>()

const cache2 = new Map<string, ViewGeo>()

export function getView(id: MapView): ViewGeo {
  const hit = cache.get(id)
  if (hit) return hit
  const def = VIEW_DEFS[id]
  if (!def) throw new Error(`unknown map view ${id}`)
  const g = buildGeo(def, id, id)
  cache.set(id, g)
  return g
}

/** The geometry of a preset view or a custom frame (cached; the same object for an equal spec). */
export function resolveView(v: ViewSpec): ViewGeo {
  if (typeof v === 'string') return getView(v)
  const key = JSON.stringify([v.center, v.bbox, v.aspect ?? null, v.title ?? null])
  const hit = cache2.get(key)
  if (hit) return hit
  const [lon0, lat0] = v.center
  const proj = makeProjection({ kind: 'laea', lon0, lat0 })
  let aspect = v.aspect
  if (!aspect) {
    const b = boundsOf(proj, v.bbox)
    aspect = Math.round(((b[2] - b[0]) / (b[3] - b[1])) * 100) / 100
  }
  const span = Math.max(v.bbox[2] - v.bbox[0], v.bbox[3] - v.bbox[1])
  const grid = span >= 60 ? 10 : span >= 25 ? 5 : span >= 8 ? 2 : 1
  const probe: ViewDef = {
    id: 'world',
    title: v.title ?? 'Mapa',
    proj: { kind: 'laea', lon0, lat0 },
    focus: v.bbox,
    aspect,
    grid,
    gridLabels: grid,
    scale: '50m',
    tol: 0,
    q: 0,
  }
  const tmp = buildGeo(probe, key, 'world')
  const dataView = pickData(tmp)
  const g = buildGeo({ ...probe, id: dataView, scale: VIEW_DEFS[dataView].scale }, key, dataView)
  cache2.set(key, g)
  return g
}

function boundsOf(proj: Projection, [w, s, e, n]: [number, number, number, number]): [number, number, number, number] {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let i = 0; i <= 60; i++) {
    for (const [lon, lat] of [
      [w + ((e - w) * i) / 60, s],
      [w + ((e - w) * i) / 60, n],
      [w, s + ((n - s) * i) / 60],
      [e, s + ((n - s) * i) / 60],
    ]) {
      const [x, y] = proj.forward(lon, lat)
      x0 = Math.min(x0, x)
      x1 = Math.max(x1, x)
      y0 = Math.min(y0, y)
      y1 = Math.max(y1, y)
    }
  }
  return [x0, y0, x1, y1]
}

/** The finest preset whose drawn frame contains the whole custom frame (else the world). */
function pickData(g: ViewGeo): MapView {
  const samples: [number, number][] = []
  const [x0, y0, x1, y1] = g.frame
  for (let i = 0; i <= 8; i++)
    for (let j = 0; j <= 8; j++) {
      const ll = g.proj.inverse(x0 + ((x1 - x0) * i) / 8, y0 + ((y1 - y0) * j) / 8)
      if (ll) samples.push(ll)
    }
  const cands = (Object.keys(VIEW_DEFS) as MapView[])
    .filter((v) => v !== 'world')
    .map((v) => getView(v))
    .sort((a, b) => a.def.q - b.def.q || (a.frame[2] - a.frame[0]) * (a.frame[3] - a.frame[1]) - (b.frame[2] - b.frame[0]) * (b.frame[3] - b.frame[1]))
  for (const c of cands) {
    const [cx0, cy0, cx1, cy1] = c.frame
    const ok = samples.every(([lon, lat]) => {
      if (lat < c.clip[1] || lat > c.clip[3]) return false
      const [x, y] = c.proj.forward(lon, lat)
      return x >= cx0 && x <= cx1 && y >= cy0 && y <= cy1
    })
    if (ok) return c.def.id
  }
  return 'world'
}

function buildGeo(def: ViewDef, key: string, dataView: MapView): ViewGeo {
  const proj = makeProjection(def.proj)
  const lonC = def.proj.lon0 ?? 0
  const [w, s, e, n] = def.focus
  // frame: bounds of the projected focus box, grown to the aspect
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  const add = (lon: number, lat: number) => {
    const [x, y] = proj.forward(lon, lat)
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  const N = 120
  for (let i = 0; i <= N; i++) {
    const lon = w + ((e - w) * i) / N
    const lat = s + ((n - s) * i) / N
    add(lon, s)
    add(lon, n)
    add(w, lat)
    add(e, lat)
  }
  if (def.proj.kind === 'equal-earth') {
    // a little room for the outline stroke
    const p = (x1 - x0) * 0.008
    x0 -= p
    x1 += p
    y0 -= p
    y1 += p
  }
  const cw = x1 - x0
  const ch = y1 - y0
  if (cw / ch < def.aspect) {
    const add2 = (ch * def.aspect - cw) / 2
    x0 -= add2
    x1 += add2
  } else {
    const add2 = (cw / def.aspect - ch) / 2
    y0 -= add2
    y1 += add2
  }
  const k = VB_W / (x1 - x0)
  const H = VB_W / def.aspect

  // clip box: lon/lat bounds of the frame (inverse-projected), with a margin
  let global = false
  let clip: [number, number, number, number]
  if (def.proj.kind !== 'laea') {
    global = true
    clip = [-180, -90, 180, 90]
  } else {
    let lo = Infinity
    let hi = -Infinity
    let la = Infinity
    let lb = -Infinity
    const M = 200
    for (let i = 0; i <= M; i++) {
      const t = i / M
      for (const [x, y] of [
        [x0 + (x1 - x0) * t, y0],
        [x0 + (x1 - x0) * t, y1],
        [x0, y0 + (y1 - y0) * t],
        [x1, y0 + (y1 - y0) * t],
      ]) {
        const ll = proj.inverse(x, y)
        if (!ll) continue
        const lon = unwrap(ll[0], lonC)
        if (lon < lo) lo = lon
        if (lon > hi) hi = lon
        if (ll[1] < la) la = ll[1]
        if (ll[1] > lb) lb = ll[1]
      }
    }
    const [px, py] = proj.forward(lonC, 90)
    const [sx, sy] = proj.forward(lonC, -90)
    const north = px >= x0 && px <= x1 && py >= y0 && py <= y1
    const south = sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1
    if (north || south) {
      global = true
      clip = [lonC - 180, north ? Math.floor(la - 1) : -90, lonC + 180, south ? Math.ceil(lb + 1) : 90]
    } else
      clip = [Math.floor(lo - 1), Math.max(-90, Math.floor(la - 1)), Math.ceil(hi + 1), Math.min(90, Math.ceil(lb + 1))]
  }

  let sphere: string | undefined
  if (def.proj.kind === 'equal-earth') {
    const pts: string[] = []
    for (let lat = -90; lat <= 90; lat += 2) pts.push(svgPt(proj, x0, y1, k, lonC - 180, lat))
    for (let lat = 90; lat >= -90; lat -= 2) pts.push(svgPt(proj, x0, y1, k, lonC + 180, lat))
    sphere = 'M' + pts.join('L') + 'Z'
  }
  return { key, dataView, def, proj, H, frame: [x0, y0, x1, y1], k, clip, lonC, global, sphere }
}

function svgPt(proj: Projection, x0: number, y1: number, k: number, lon: number, lat: number) {
  const [x, y] = proj.forward(lon, lat)
  return `${r1((x - x0) * k)} ${r1((y1 - y) * k)}`
}
const r1 = (v: number) => Math.round(v * 10) / 10

/** SVG position of a lon/lat point in the view (viewBox units). */
export function project(view: ViewSpec, lon: number, lat: number): [number, number] {
  const g = resolveView(view)
  const [x, y] = g.proj.forward(lon, lat)
  return [(x - g.frame[0]) * g.k, (g.frame[3] - y) * g.k]
}

/** lon/lat under an SVG position, or null outside the projected globe. */
export function invert(view: ViewSpec, x: number, y: number): { lon: number; lat: number } | null {
  const g = resolveView(view)
  const ll = g.proj.inverse(x / g.k + g.frame[0], g.frame[3] - y / g.k)
  return ll ? { lon: ll[0], lat: ll[1] } : null
}

/** The view's viewBox: [0, 0, 1000, height]. */
export function viewBox(view: ViewSpec): [number, number, number, number] {
  return [0, 0, VB_W, Math.round(resolveView(view).H * 10) / 10]
}
