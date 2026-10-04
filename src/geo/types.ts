/**
 * Shapes of the generated data modules in src/geo/data (written by scripts/geo/build-geo.mjs).
 * Coordinate strings: integers in units of `q` degrees, zigzag varint deltas in base64url characters,
 * x (lon) before y (lat), the first point absolute. Decoded by src/geo/load.ts.
 */

/** A ring as arc references: i = arc i, ~i (= −i − 1) = arc i reversed. */
export type ArcRing = number[]

export interface CountryModule {
  /** quantisation step, degrees */
  q: number
  /** arcs of the country (and region) topology */
  arcs: string[]
  /** arcs lying on the clip frame or the antimeridian: filled, never stroked */
  frame: number[]
  /** [ADM0_A3 code, rings] – outer rings and holes, drawn with the even-odd rule */
  countries: [string, ArcRing[]][]
  /** Czech regions (czechia view only): [CZ-xx, rings] */
  regions?: [string, ArcRing[]][]
  /** label points [lon, lat] (Natural Earth LABEL_X / LABEL_Y; regions: admin-1 label point) */
  labels: Record<string, [number, number]>
  /** [Czech name or '', Natural Earth scalerank, rings] */
  lakes: [string, number, string[]][]
  /** [Czech name or Natural Earth name or '', scalerank, lines] */
  rivers: [string, number, string[]][]
}

export interface PlatesModule {
  q: number
  /** [PB2002 name e.g. "EU-AF", 1 = subduction zone, line] */
  lines: [string, number, string][]
}
