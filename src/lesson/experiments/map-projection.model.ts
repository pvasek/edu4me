/**
 * Map projections in the `map-projection` experiment (z1-6). The projections themselves come from
 * src/geo/project.ts (Mercator, Robinson, Equal Earth), the coastlines from the Natural Earth world data.
 *
 * - A circle of the same real size (radius 1 000 km on the globe) moved from the equator towards the
 *   pole: on Mercator its area grows with sec² φ (at 60° four times, at 70° about 8,5 times), on the
 *   equal-area Equal Earth it stays the same (only its shape is squeezed), Robinson is a compromise.
 * - Greenland (2,17 mil. km²) vs. Africa (30,4 mil. km²): really Africa is 14× larger; on Mercator
 *   Greenland looks about as large as Africa (Robinson: Africa ≈ 7×).
 * Areas on the map are measured with the shoelace formula on the projected outlines.
 */
import { makeProjection, type Projection } from '../../geo/project'

export type Kind = 'mercator' | 'robinson' | 'equal-earth'
export const KINDS: Kind[] = ['mercator', 'robinson', 'equal-earth']
export const proj = (kind: Kind): Projection => makeProjection({ kind, lon0: 0 })

export const R_EARTH = 6371
export const CIRCLE_KM = 1000
/** Mercator maps are cut at ±80° here (the pole itself would be infinitely far). */
export const MERC_LAT = 80

const D = Math.PI / 180

/** A circle of radius `km` around (lat, lon) on the sphere, as a flat lon/lat ring. */
export function circle(lat: number, lon: number, km = CIRCLE_KM, n = 72): number[] {
  const d = km / R_EARTH
  const p1 = lat * D
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const b = (i / n) * 2 * Math.PI
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b))
    const l2 = lon * D + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2))
    out.push(l2 / D, p2 / D)
  }
  return out
}

/** Area of a flat lon/lat ring on the map (projected units², always positive). */
export function mapArea(p: Projection, ring: ArrayLike<number>): number {
  let a = 0
  const n = ring.length / 2
  let [px, py] = p.forward(ring[2 * (n - 1)], ring[2 * (n - 1) + 1])
  for (let i = 0; i < n; i++) {
    const [x, y] = p.forward(ring[2 * i], ring[2 * i + 1])
    a += px * y - x * py
    px = x
    py = y
  }
  return Math.abs(a) / 2
}

/** How many times larger the circle looks at latitude `lat` than at the equator. */
export function growth(kind: Kind, lat: number, lon = 0): number {
  const p = proj(kind)
  return mapArea(p, circle(lat, lon)) / mapArea(p, circle(0, lon))
}

/** The states of Africa (Natural Earth ADM0_A3, with Western Sahara and Somaliland). */
export const AFRICA = [
  'DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD', 'COM', 'COG', 'COD', 'CIV', 'DJI', 'EGY', 'GNQ', 'ERI',
  'SWZ', 'ETH', 'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG', 'MWI', 'MLI', 'MRT', 'MUS', 'MAR', 'MOZ',
  'NAM', 'NER', 'NGA', 'RWA', 'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'SOL', 'ZAF', 'SDS', 'SDN', 'TZA', 'TGO', 'TUN', 'UGA', 'ZMB',
  'ZWE', 'SAH',
]
export const GREENLAND = 'GRL'
/** Real areas (mil. km²): Greenland 2,17, Africa 30,4 → Africa ≐ 14× larger. */
export const REAL_RATIO = 14

/** Map area of a set of shapes (each a list of flat lon/lat rings). */
export function shapesArea(p: Projection, shapes: ArrayLike<number>[][]): number {
  let a = 0
  for (const rings of shapes) for (const r of rings) a += mapArea(p, r)
  return a
}

export const KEEPS: Record<Kind, string> = {
  mercator: 'úhly a tvary',
  robinson: 'nic přesně',
  'equal-earth': 'plochy',
}

/** The challenge: the projection where Africa really looks about 14× larger than Greenland. */
export const challengeMet = (ratio: number) => Math.abs(ratio / REAL_RATIO - 1) < 0.08
