/**
 * Biology of the `enzyme-activity` experiment (b9-4): how fast an enzyme works at a
 * given temperature and pH. Approximate textbook numbers, not lab data.
 *
 * - Below its optimum an enzyme speeds up with temperature like any reaction
 *   (about twice as fast for +10 °C, Q₁₀ ≈ 2) and slows down when cooled, reversibly.
 * - Above its optimum the protein starts to unfold (denature): the share of intact
 *   molecules falls linearly to zero `width` °C above the optimum. Denaturation is
 *   irreversible: cooling the solution back does not refold the enzyme, so the damage
 *   depends on the hottest temperature the solution has reached.
 * - pH: a bell curve round the optimum pH (the charges on the active site change);
 *   in this simplified model the pH effect is reversible.
 */

export type EnzymeId = 'amylaza' | 'pepsin' | 'termo'

export interface Enzyme {
  name: string
  /** where it works, for the label */
  where: string
  /** temperature (°C) at which the enzyme starts to denature (≈ its optimum) */
  tOpt: number
  /** °C above tOpt at which all of it is denatured */
  width: number
  pHOpt: number
  /** width of the pH bell curve (pH units) */
  pHSigma: number
}

export const ENZYMES: Record<EnzymeId, Enzyme> = {
  amylaza: { name: 'amyláza slin', where: 'v ústech', tOpt: 37, width: 15, pHOpt: 7, pHSigma: 1.3 },
  pepsin: { name: 'pepsin', where: 'v žaludku', tOpt: 37, width: 15, pHOpt: 2, pHSigma: 1 },
  termo: { name: 'enzym termofilní bakterie', where: 'v horkých pramenech', tOpt: 70, width: 25, pHOpt: 7.5, pHSigma: 1.4 },
}

export const T_MIN = 0
export const T_MAX = 70
export const PH_MIN = 1
export const PH_MAX = 12

/** Q₁₀ ≈ 2: the reaction runs about twice as fast for every 10 °C. */
const kinetic = (T: number, tOpt: number) => 2 ** ((T - tOpt) / 10)

/** Share (0–1) of enzyme molecules still folded after the solution has reached `hottest` °C. */
export function intactShare(e: Enzyme, hottest: number): number {
  if (hottest <= e.tOpt) return 1
  return Math.max(0, 1 - (hottest - e.tOpt) / e.width)
}

/** pH factor (0–1): a bell curve round the optimum pH. */
export function pHFactor(e: Enzyme, pH: number): number {
  const d = (pH - e.pHOpt) / e.pHSigma
  return Math.exp(-0.5 * d * d)
}

/** Unnormalised rate of a fresh enzyme at T (the peak lies a little above tOpt). */
const rawFresh = (e: Enzyme, T: number) => kinetic(T, e.tOpt) * intactShare(e, T)

const peakCache = new Map<Enzyme, number>()
/** The highest rate a fresh enzyme reaches at its optimum pH (normalisation to 100 %). */
function peak(e: Enzyme): number {
  let p = peakCache.get(e)
  if (p === undefined) {
    p = 0
    for (let T = e.tOpt - 5; T <= e.tOpt + e.width; T += 0.05) p = Math.max(p, rawFresh(e, T))
    peakCache.set(e, p)
  }
  return p
}

/**
 * Relative rate (0–1, 1 = the fastest this enzyme can work) at temperature T and pH,
 * after the solution has been as hot as `hottest` (≥ T; defaults to T = a fresh enzyme).
 */
export function enzymeRate(e: Enzyme, T: number, pH: number, hottest = T): number {
  const h = Math.max(T, hottest)
  return (kinetic(T, e.tOpt) * intactShare(e, h) * pHFactor(e, pH)) / peak(e)
}

/** The temperature (whole °C in the slider range) at which a fresh enzyme is fastest. */
export function bestTemperature(e: Enzyme): number {
  let best = T_MIN
  for (let T = T_MIN; T <= T_MAX; T++) if (enzymeRate(e, T, e.pHOpt) > enzymeRate(e, best, e.pHOpt)) best = T
  return best
}

export type EnzymeState = 'ok' | 'damaged' | 'dead'
export function enzymeState(e: Enzyme, hottest: number): EnzymeState {
  const s = intactShare(e, hottest)
  return s >= 0.999 ? 'ok' : s > 0.001 ? 'damaged' : 'dead'
}

/** The challenge: pepsin working at (nearly) its top speed. */
export const PEPSIN_TARGET = 0.95
export function pepsinFastest(id: EnzymeId, T: number, pH: number, hottest: number): boolean {
  return id === 'pepsin' && enzymeRate(ENZYMES.pepsin, T, pH, hottest) >= PEPSIN_TARGET
}
