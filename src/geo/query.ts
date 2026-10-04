/**
 * Hit tests on loaded map data (synchronous: the view's data must be loaded with loadView first).
 * Positions are tested in lon/lat against the view's (simplified) polygons, even-odd, so holes such as
 * Lesotho inside South Africa or the Vatican inside Italy belong to the inner state.
 */
import type { MapView } from '../core/types'
import { getView, resolveView, unwrap, type ViewSpec } from './frame'
import { peekView, type GeoData, type Shape } from './load'
import { MAP_VIEW_IDS } from './views'

/** Even-odd point-in-polygon over all rings of a shape. */
export function inShape(sh: Shape, lon: number, lat: number): boolean {
  const [w, s, e, n] = sh.bbox
  if (lon < w || lon > e || lat < s || lat > n) return false
  let inside = false
  for (const r of sh.rings) {
    const m = r.length
    for (let i = 0, j = m - 2; i < m; j = i, i += 2) {
      const xi = r[i]
      const yi = r[i + 1]
      const xj = r[j]
      const yj = r[j + 1]
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/** The matching shape; when shapes overlap (an enclave kept without its hole at a coarse scale) the smallest wins. */
function find(map: Map<string, Shape>, lon: number, lat: number): string | undefined {
  let best: Shape | undefined
  let ba = Infinity
  for (const sh of map.values())
    if (inShape(sh, lon, lat)) {
      const a = (sh.bbox[2] - sh.bbox[0]) * (sh.bbox[3] - sh.bbox[1])
      if (a < ba) {
        ba = a
        best = sh
      }
    }
  return best?.code
}

function dataOf(view: MapView): GeoData | undefined {
  return peekView(view)
}

/** The country (ADM0_A3) at a position, or undefined (sea, or the data is not loaded yet). */
export function countryAt(view: ViewSpec, lon: number, lat: number): string | undefined {
  const dv = resolveView(view).dataView
  const d = dataOf(dv)
  if (!d) return undefined
  return find(d.countries, unwrap(lon, getView(dv).lonC), lat)
}

/** The Czech region (CZ-xx) at a position; czechia view only. */
export function regionAt(lon: number, lat: number): string | undefined {
  const d = dataOf('czechia')
  if (!d) return undefined
  return find(d.regions, unwrap(lon, getView('czechia').lonC), lat)
}

/**
 * Label point [lon, lat] of a country or region code (Natural Earth LABEL_X/LABEL_Y), from whichever loaded view
 * has it (the world view has every country). Undefined until some view with the code is loaded.
 */
export function labelPoint(code: string, view?: MapView): [number, number] | undefined {
  if (view) return dataOf(view)?.labels[code]
  for (const v of MAP_VIEW_IDS) {
    const p = dataOf(v)?.labels[code]
    if (p) return p
  }
  return undefined
}
