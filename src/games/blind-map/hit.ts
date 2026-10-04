/**
 * Tap geometry shared by the map games (Slepá mapa, Zeměpisná síť, Časová pásma).
 * Pure functions over the map engine (src/geo): distances are measured in SVG viewBox units of the view,
 * so a tolerance can be given in screen pixels (× u, the units per CSS px) and stays fair on a phone.
 * Country and region tests need the view's data loaded (loadView) – they use countryAt / regionAt.
 */
import type { MapView } from '../../core/types'
import { invert, project } from '../../geo/frame'
import { countryAt, regionAt } from '../../geo/query'

/** [lon, lat] */
export type LL = [number, number]

/** Distance of point p from the segment a–b (2-D). */
export function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax
  const dy = by - ay
  const l2 = dx * dx + dy * dy
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/** Projected line parts, broken where consecutive points jump across the map (antimeridian on the world map). */
export function projectParts(view: MapView, parts: LL[][]): [number, number][][] {
  const out: [number, number][][] = []
  for (const part of parts) {
    let cur: [number, number][] = []
    let prev: LL | undefined
    for (const ll of part) {
      if (prev && Math.abs(ll[0] - prev[0]) > 180) {
        if (cur.length) out.push(cur)
        cur = []
      }
      cur.push(project(view, ll[0], ll[1]))
      prev = ll
    }
    if (cur.length) out.push(cur)
  }
  return out
}

/** Smallest distance (SVG units) from (x, y) to the projected lines; a part of one point is a point. */
export function distToParts(proj: [number, number][][], x: number, y: number): number {
  let best = Infinity
  for (const p of proj) {
    if (p.length === 1) best = Math.min(best, Math.hypot(x - p[0][0], y - p[0][1]))
    for (let i = 1; i < p.length; i++) best = Math.min(best, segDist(x, y, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]))
  }
  return best
}

/** Distance (SVG units) of a lon/lat tap from lines given in lon/lat. */
export function distLL(view: MapView, parts: LL[][], lon: number, lat: number): number {
  const [x, y] = project(view, lon, lat)
  return distToParts(projectParts(view, parts), x, y)
}

/** SVG units per degree of latitude at a place (the map scale there). */
export function unitsPerDeg(view: MapView, lon: number, lat: number): number {
  const a = project(view, lon, Math.max(-89.5, lat - 0.5))
  const b = project(view, lon, Math.min(89.5, lat + 0.5))
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

/** Tolerance radius in SVG units: `deg` degrees at the place, but never less than `minPx` screen px. */
export function tolUnits(view: MapView, lon: number, lat: number, deg: number, minPx: number, u: number): number {
  return Math.max(deg * unitsPerDeg(view, lon, lat), minPx * u)
}

/**
 * Does a tap at lon/lat hit the area `code`? A direct hit, or (fair to fingers) the area lies within `r` SVG units:
 * points on two rings around the tap are tested. `at` returns the area code at a position.
 */
export function hitArea(view: MapView, code: string, lon: number, lat: number, r: number, at: (lon: number, lat: number) => string | undefined): boolean {
  if (at(lon, lat) === code) return true
  const [x, y] = project(view, lon, lat)
  for (const f of [0.5, 1])
    for (let k = 0; k < 12; k++) {
      const a = (k * Math.PI) / 6
      const ll = invert(view, x + f * r * Math.cos(a), y + f * r * Math.sin(a))
      if (ll && at(ll.lon, ll.lat) === code) return true
    }
  return false
}

/** Country code under a position of a view (data must be loaded). */
export const countryOf = (view: MapView) => (lon: number, lat: number) => countryAt(view, lon, lat)
/** Czech region code under a position (czechia data must be loaded). */
export const regionOf = () => (lon: number, lat: number) => regionAt(lon, lat)

/**
 * Line features (ranges, rivers, volcanoes): the tap hits `target` when it lies within `r` of it and no other
 * feature of the set is clearly nearer (taps on a neighbouring range do not count).
 */
export function hitFeature(view: MapView, target: LL[][], others: LL[][][], lon: number, lat: number, r: number, slack: number): boolean {
  const d = distLL(view, target, lon, lat)
  if (d > r) return false
  for (const o of others) if (distLL(view, o, lon, lat) + slack < d) return false
  return true
}

/** Is the projected point inside the drawing (with a margin, SVG units)? */
export function inFrame(view: MapView, lon: number, lat: number, H: number, margin = 0): boolean {
  const [x, y] = project(view, lon, lat)
  return x >= margin && x <= 1000 - margin && y >= margin && y <= H - margin
}
