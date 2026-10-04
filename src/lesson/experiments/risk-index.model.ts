/**
 * Model of the `risk-index` experiment (z10-6): disaster risk as
 *
 *   riziko R = hrozba H × zranitelnost V ÷ schopnost zvládnout C
 *
 * the common teaching form of the UNDRR framing (risk is a function of hazard,
 * exposure, vulnerability and capacity) – the INFORM Risk Index (EU JRC) works
 * the same way with three 0–10 dimensions: hazard & exposure, vulnerability,
 * lack of coping capacity. Here each factor is a 1–10 score; R runs from 0,1
 * to 100 and is compared on a logarithmic scale. The scores of the two cities
 * are estimates for teaching, not official index values.
 *
 * Real cases (nearly the same earthquake, very different outcome):
 * - Haiti, 12. 1. 2010, M 7,0, about 25 km from Port-au-Prince: over 200 000 dead
 *   (estimates 100 000–316 000), unreinforced buildings, weak state.
 * - Nový Zéland, 4. 9. 2010 (Darfield / Canterbury), M 7,1, about 40 km from
 *   Christchurch: no one killed directly; strict
 *   building codes, rescue services, the quake came at 4.35 a.m.
 */

export const H_MAX = 10

export type CityId = 'haiti' | 'nz'
export interface City {
  id: CityId
  name: string
  event: string
  magnitude: number
  deaths: string
  /** teaching scores 1–10 */
  vulnerability: number
  capacity: number
}

/** the hazard score of the same M 7 quake close to a city */
export const H_QUAKE = 7

export const CITIES: Record<CityId, City> = {
  haiti: {
    id: 'haiti',
    name: 'Port-au-Prince',
    event: 'Haiti, 12. 1. 2010',
    magnitude: 7.0,
    deaths: 'odhadem 100 000–316 000 obětí',
    vulnerability: 9,
    capacity: 2,
  },
  nz: {
    id: 'nz',
    name: 'Christchurch',
    event: 'Nový Zéland, 4. 9. 2010',
    magnitude: 7.1,
    deaths: 'žádná přímá oběť',
    vulnerability: 2,
    capacity: 8,
  },
}

export const risk = (h: number, v: number, c: number) => (h * v) / c

export type Level = 'nizke' | 'stredni' | 'vysoke' | 'extremni'
export const LEVEL_WORD: Record<Level, string> = {
  nizke: 'nízké',
  stredni: 'střední',
  vysoke: 'vysoké',
  extremni: 'velmi vysoké',
}
/** upper bounds of the levels on the R scale */
export const LEVEL_TOPS: [Level, number][] = [
  ['nizke', 2],
  ['stredni', 6],
  ['vysoke', 20],
  ['extremni', Infinity],
]
export function level(r: number): Level {
  for (const [l, top] of LEVEL_TOPS) if (r < top) return l
  return 'extremni'
}

export const R_MIN = 0.1
export const R_MAX = 100
/** position 0–1 on the logarithmic risk scale */
export const scalePos = (r: number) =>
  Math.min(1, Math.max(0, (Math.log10(r) - Math.log10(R_MIN)) / (Math.log10(R_MAX) - Math.log10(R_MIN))))

/** Share of buildings that collapse in the picture (0–1): none for R ≤ 1, all for R = 100, growing with log R. */
export const collapseShare = (r: number) => Math.min(1, Math.max(0, Math.log10(r) / 2))

/** Which preset city the current scores match, if any. */
export function matchingCity(h: number, v: number, c: number): CityId | null {
  for (const city of Object.values(CITIES))
    if (h === H_QUAKE && v === city.vulnerability && c === city.capacity) return city.id
  return null
}

/** The challenge: the same quake (H ≥ 7) and still risk as low as in Christchurch. */
export const challengeMet = (h: number, v: number, c: number) =>
  h >= H_QUAKE && risk(h, v, c) <= risk(H_QUAKE, CITIES.nz.vulnerability, CITIES.nz.capacity) + 1e-9
