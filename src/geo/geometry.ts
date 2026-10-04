/**
 * Runtime geometry for GeoMap: clipping in lon/lat, densifying, projecting into the view's SVG units and
 * building path strings. The base map of a view (countries, coasts, borders, lakes, rivers) is built once per
 * loaded data set and cached.
 */
import type { MapRoute } from '../core/types'
import type { ViewGeo } from './frame'
import { unwrap } from './frame'
import type { GeoData, PlatesData } from './load'

export type XY = [number, number]
export type Box4 = [number, number, number, number]

const r1 = (v: number) => Math.round(v * 10) / 10

// ------------------------------------------------------------------ lon/lat clipping

/** Sutherland–Hodgman of a flat ring against a lon/lat box. */
export function clipRing(ring: ArrayLike<number>, [w, s, e, n]: Box4): number[] {
  let pts: number[] = Array.from(ring)
  const pass = (inside: (x: number, y: number) => boolean, cut: (ax: number, ay: number, bx: number, by: number) => XY) => {
    const out: number[] = []
    const m = pts.length
    for (let i = 0; i < m; i += 2) {
      const j = (i - 2 + m) % m
      const ax = pts[j]
      const ay = pts[j + 1]
      const bx = pts[i]
      const by = pts[i + 1]
      const ia = inside(ax, ay)
      const ib = inside(bx, by)
      if (ib) {
        if (!ia) out.push(...cut(ax, ay, bx, by))
        out.push(bx, by)
      } else if (ia) out.push(...cut(ax, ay, bx, by))
    }
    pts = out
  }
  pass((x) => x >= w, (ax, ay, bx, by) => [w, ay + ((by - ay) * (w - ax)) / (bx - ax)])
  if (pts.length) pass((x) => x <= e, (ax, ay, bx, by) => [e, ay + ((by - ay) * (e - ax)) / (bx - ax)])
  if (pts.length) pass((_, y) => y >= s, (ax, ay, bx, by) => [ax + ((bx - ax) * (s - ay)) / (by - ay), s])
  if (pts.length) pass((_, y) => y <= n, (ax, ay, bx, by) => [ax + ((bx - ax) * (n - ay)) / (by - ay), n])
  return pts.length >= 6 ? pts : []
}

/** Liang–Barsky: the parts of a flat polyline inside a lon/lat box. */
export function clipLine(line: ArrayLike<number>, [w, s, e, n]: Box4): number[][] {
  const parts: number[][] = []
  let cur: number[] | null = null
  for (let i = 2; i < line.length; i += 2) {
    const ax = line[i - 2]
    const ay = line[i - 1]
    const dx = line[i] - ax
    const dy = line[i + 1] - ay
    let t0 = 0
    let t1 = 1
    const p = [-dx, dx, -dy, dy]
    const q = [ax - w, e - ax, ay - s, n - ay]
    let ok = true
    for (let k = 0; k < 4 && ok; k++) {
      if (Math.abs(p[k]) < 1e-15) {
        if (q[k] < 0) ok = false
      } else {
        const r = q[k] / p[k]
        if (p[k] < 0) {
          if (r > t1) ok = false
          else if (r > t0) t0 = r
        } else if (r < t0) ok = false
        else if (r < t1) t1 = r
      }
    }
    if (!ok) {
      cur = null
      continue
    }
    if (!cur || t0 > 0) {
      cur = [ax + t0 * dx, ay + t0 * dy]
      parts.push(cur)
    }
    cur.push(ax + t1 * dx, ay + t1 * dy)
    if (t1 < 1) cur = null
  }
  return parts.filter((p) => p.length >= 4)
}

/** Inserts points so no segment is longer than `step` degrees (straight lon/lat lines bend when projected). */
export function densify(flat: ArrayLike<number>, step: number, closed: boolean): number[] {
  const out: number[] = []
  const m = flat.length
  if (!m) return out
  const last = closed ? m : m - 2
  for (let i = 0; i < last; i += 2) {
    const ax = flat[i]
    const ay = flat[i + 1]
    const bx = flat[(i + 2) % m]
    const by = flat[(i + 3) % m]
    out.push(ax, ay)
    const d = Math.max(Math.abs(bx - ax), Math.abs(by - ay))
    if (d > step) {
      const n = Math.ceil(d / step)
      for (let k = 1; k < n; k++) out.push(ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n)
    }
  }
  if (!closed) out.push(flat[m - 2], flat[m - 1])
  return out
}

// ------------------------------------------------------------------ projecting

export function projector(g: ViewGeo): (lon: number, lat: number) => XY {
  const { proj, k } = g
  const [x0, , , y1] = g.frame
  return (lon, lat) => {
    const [x, y] = proj.forward(lon, lat)
    return [(x - x0) * k, (y1 - y) * k]
  }
}

/** Projects a flat lon/lat list into an SVG path ("M … L …", "Z" when closed); updates `box` if given. */
export function pathOf(g: ViewGeo, flat: ArrayLike<number>, closed: boolean, box?: Box4, step = 1): string {
  const P = projector(g)
  const pts = densify(flat, step, closed)
  let d = ''
  let px = NaN
  let py = NaN
  let n = 0
  for (let i = 0; i < pts.length; i += 2) {
    const [x, y] = P(pts[i], pts[i + 1])
    const X = r1(x)
    const Y = r1(y)
    if (!Number.isFinite(X) || !Number.isFinite(Y)) continue
    if (X === px && Y === py) continue
    d += (n ? 'L' : 'M') + X + ' ' + Y
    px = X
    py = Y
    n++
    if (box) {
      if (X < box[0]) box[0] = X
      if (Y < box[1]) box[1] = Y
      if (X > box[2]) box[2] = X
      if (Y > box[3]) box[3] = Y
    }
  }
  if (n < (closed ? 3 : 2)) return ''
  return closed ? d + 'Z' : d
}

// ------------------------------------------------------------------ base map

export interface ShapePath {
  d: string
  /** SVG bounds */
  box: Box4
  /** extent (larger side) of the largest ring, SVG units: a state is "tiny" on this map when it is a few px */
  ring: number
  /** centre of the largest ring's bounds */
  mid: XY
}
export interface BaseMap {
  countries: Map<string, ShapePath>
  regions: Map<string, ShapePath>
  coast: string
  borders: string
  regionBorders: string
  /** lakes always drawn (large) and the rest (lakes layer) */
  lakesBig: string
  lakesSmall: string
  /** rivers by width class 0 (main) … 2 (small) */
  rivers: [string, string, string]
}

const baseCache = new WeakMap<GeoData, Map<string, BaseMap>>()

function arcPath(g: ViewGeo, d: GeoData, i: number): string {
  return pathOf(g, d.arcs[i], false)
}

function shapePaths(g: ViewGeo, shapes: GeoData['countries']): Map<string, ShapePath> {
  const out = new Map<string, ShapePath>()
  for (const [code, sh] of shapes) {
    const box: Box4 = [Infinity, Infinity, -Infinity, -Infinity]
    let ring = 0
    let mid: XY = [NaN, NaN]
    const d = sh.rings
      .map((r) => {
        const b: Box4 = [Infinity, Infinity, -Infinity, -Infinity]
        const p = pathOf(g, r, true, b)
        if (p) {
          const ext = Math.max(b[2] - b[0], b[3] - b[1])
          if (ext > ring) {
            ring = ext
            mid = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]
          }
          box[0] = Math.min(box[0], b[0])
          box[1] = Math.min(box[1], b[1])
          box[2] = Math.max(box[2], b[2])
          box[3] = Math.max(box[3], b[3])
        }
        return p
      })
      .join('')
    out.set(code, { d, box, ring, mid })
  }
  return out
}

/** Builds (once per data set) the base map of a view. */
export function baseMap(g: ViewGeo, d: GeoData): BaseMap {
  let per = baseCache.get(d)
  if (!per) baseCache.set(d, (per = new Map()))
  const hit = per.get(g.key)
  if (hit) return hit
  const countries = shapePaths(g, d.countries)
  const regions = shapePaths(g, d.regions)
  const useC = new Map<number, number>()
  const useR = new Map<number, number>()
  const count = (m: Map<number, number>, shapes: GeoData['countries']) => {
    for (const sh of shapes.values())
      for (const ring of sh.refs)
        for (const r of ring) {
          const i = r < 0 ? ~r : r
          m.set(i, (m.get(i) ?? 0) + 1)
        }
  }
  count(useC, d.countries)
  count(useR, d.regions)
  let coast = ''
  let borders = ''
  let regionBorders = ''
  d.arcs.forEach((_, i) => {
    if (d.frame.has(i)) return
    const c = useC.get(i) ?? 0
    const r = useR.get(i) ?? 0
    if (c === 1) coast += arcPath(g, d, i)
    else if (c >= 2) borders += arcPath(g, d, i)
    else if (r >= 2) regionBorders += arcPath(g, d, i)
  })
  // lakes: "big" = at least ~14 px across at a 640 px wide map
  let lakesBig = ''
  let lakesSmall = ''
  for (const l of d.lakes)
    for (const ring of l.parts) {
      const box: Box4 = [Infinity, Infinity, -Infinity, -Infinity]
      const p = pathOf(g, ring, true, box)
      if (!p) continue
      if (Math.max(box[2] - box[0], box[3] - box[1]) > 22 && l.rank <= 1) lakesBig += p
      else lakesSmall += p
    }
  const rv: [string, string, string] = ['', '', '']
  const ranks = d.rivers.map((r) => r.rank)
  const lo = Math.min(...ranks)
  for (const r of d.rivers) {
    const cls = r.rank <= lo + 1 ? 0 : r.rank <= lo + 3 ? 1 : 2
    for (const p of r.parts) rv[cls] += pathOf(g, p, false)
  }
  const out: BaseMap = { countries, regions, coast, borders, regionBorders, lakesBig, lakesSmall, rivers: rv }
  per.set(g.key, out)
  return out
}

// ------------------------------------------------------------------ overlays

/** Graticule lines (meridians and parallels) as one path, plus where to label them. */
export function graticule(g: ViewGeo): { d: string; lats: number[]; lons: number[] } {
  const [w, s, e, n] = g.clip
  const step = g.def.grid
  const fine = Math.min(1, step / 4)
  const polar = Math.abs(g.def.proj.lat0 ?? 0) === 90
  const world = g.def.proj.kind !== 'laea'
  let d = ''
  const lons: number[] = []
  const lats: number[] = []
  const lonFrom = Math.ceil(w / step) * step
  for (let lon = lonFrom; lon <= e + 1e-9; lon += step) {
    if (world && Math.abs(Math.abs(lon) - 180) < 1e-9) continue
    if (g.global && !world && lon >= w + 360 - 1e-9) continue
    const top = polar && g.def.proj.lat0 === 90 && lon % (step * 3) !== 0 ? Math.min(n, 80) : Math.min(n, 90)
    const bot = polar && g.def.proj.lat0 === -90 && lon % (step * 3) !== 0 ? Math.max(s, -80) : Math.max(s, -90)
    d += pathOf(g, [lon, bot, lon, top], false, undefined, fine)
    lons.push(lon)
  }
  for (let lat = Math.ceil(s / step) * step; lat <= n + 1e-9; lat += step) {
    if (Math.abs(lat) >= 90) continue
    d += pathOf(g, [w, lat, e, lat], false, undefined, fine)
    lats.push(lat)
  }
  return { d, lats, lons }
}

/** A parallel as a path (tropics, polar circles). */
export function parallel(g: ViewGeo, lat: number): string {
  const [w, s, e, n] = g.clip
  if (lat < s || lat > n) return ''
  return pathOf(g, [w, lat, e, lat], false, undefined, 0.5)
}

/** A lon/lat rectangle (band, time-zone stripe), clipped to the view. */
export function lonLatRect(g: ViewGeo, w: number, s: number, e: number, n: number): string {
  const ring = clipRing([w, s, e, s, e, n, w, n], g.clip)
  return ring.length ? pathOf(g, ring, true, undefined, 0.5) : ''
}

/**
 * Visible points of a parallel or meridian in SVG units (inside the frame and, on the world map, the globe),
 * ordered along the line.
 */
export function visibleAlong(g: ViewGeo, flat: number[], H: number): XY[] {
  const P = projector(g)
  const pts = densify(flat, 0.25, false)
  const out: XY[] = []
  for (let i = 0; i < pts.length; i += 2) {
    const [x, y] = P(pts[i], pts[i + 1])
    if (x >= 0 && x <= 1000 && y >= 0 && y <= H) out.push([x, y])
  }
  return out
}

/** Plate boundaries clipped to the view. */
export function platesPath(g: ViewGeo, plates: PlatesData): { all: string; subduction: string } {
  let all = ''
  let subduction = ''
  for (const l of plates.lines) {
    // unwrap to the view's longitudes, splitting where a line jumps across the antimeridian
    const pts = Array.from(l.pts)
    const parts: number[][] = [[]]
    let prev = NaN
    for (let i = 0; i < pts.length; i += 2) {
      const lon = unwrap(pts[i], g.lonC)
      if (Number.isFinite(prev) && Math.abs(lon - prev) > 180) parts.push([])
      parts[parts.length - 1].push(lon, pts[i + 1])
      prev = lon
    }
    for (const part of parts)
      for (const c of clipLine(part, g.clip)) {
        const p = pathOf(g, c, false, undefined, 1)
        if (l.subduction) subduction += p
        else all += p
      }
  }
  return { all, subduction }
}

/** Great-circle interpolation between two lon/lat points (for long route legs). */
function greatCircle(a: XY, b: XY, n: number): XY[] {
  const D = Math.PI / 180
  const toV = ([lon, lat]: XY) => [Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D)]
  const va = toV(a)
  const vb = toV(b)
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))
  const om = Math.acos(dot)
  if (om < 1e-9) return [a, b]
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    const t = k / n
    const sa = Math.sin((1 - t) * om) / Math.sin(om)
    const sb = Math.sin(t * om) / Math.sin(om)
    const v = [sa * va[0] + sb * vb[0], sa * va[1] + sb * vb[1], sa * va[2] + sb * vb[2]]
    out.push([Math.atan2(v[1], v[0]) / D, Math.atan2(v[2], Math.hypot(v[0], v[1])) / D])
  }
  return out
}

/** Smooth path through SVG points (Catmull–Rom as cubic Béziers). */
export function smoothPath(pts: XY[]): string {
  if (pts.length < 2) return ''
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`
  if (pts.length === 2) return d + `L${r1(pts[1][0])} ${r1(pts[1][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d
}

/**
 * A route as SVG pieces (split where it crosses the edge of a world map). Long legs follow the great circle;
 * the result is smoothed. Returns the pieces' points (for the arrowhead and label placement) and paths.
 */
export function routePieces(g: ViewGeo, route: MapRoute): { pts: XY[]; d: string }[] {
  const P = projector(g)
  const ll: XY[] = []
  const rp = route.points.map((p) => [unwrap(p.lon, g.lonC), p.lat] as XY)
  for (let i = 0; i < rp.length; i++) {
    if (i === 0) {
      ll.push(rp[0])
      continue
    }
    const a = rp[i - 1]
    const b = rp[i]
    const dist = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]))
    // a single long leg (a flight) follows the great circle; a drawn path (a current) is smoothed through its points
    if (rp.length === 2 && dist > 8) ll.push(...greatCircle(a, b, Math.ceil(dist / 4)).slice(1))
    else ll.push(b)
  }
  const pieces: XY[][] = [[]]
  let prev: XY | null = null
  for (const p of ll) {
    const lon = unwrap(p[0], g.lonC)
    // only a world map has an edge at lonC ± 180°; azimuthal views are continuous there
    if (prev && Math.abs(lon - prev[0]) > 180 && g.def.proj.kind !== 'laea') pieces.push([])
    pieces[pieces.length - 1].push(P(lon, p[1]))
    prev = [lon, p[1]]
  }
  return pieces.filter((p) => p.length >= 2).map((pts) => ({ pts, d: smoothPath(pts) }))
}
