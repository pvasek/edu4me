/**
 * Physiology of the `glucose-insulin` experiment (b11-1): blood glucose (glykémie,
 * mmol/l) during the 4 hours after a meal with about 60 g of carbohydrate. A small
 * "minimal model" integrated with 1-minute Euler steps; the numbers are approximate,
 * chosen to match typical textbook curves:
 * - healthy: fasting about 5 mmol/l, a peak of about 7–8 within an hour, back below
 *   7,8 at 2 h (the oral glucose tolerance test limit) and near fasting by 3 h;
 * - type 1 diabetes: the pancreas makes no insulin, glucose climbs to about 15 and stays
 *   high, unless rapid-acting insulin is injected at the meal (its effect peaks in
 *   about an hour); too big a dose drops glucose under 3,9 (hypoglykémie);
 * - type 2 diabetes: insulin is made, but cells respond to it weakly and late
 *   (insulin resistance), so fasting glucose is high (≥ 7) and the peak is high and long.
 *
 * Equations (t in minutes):
 *   dG/dt = −p₁·(G − G_b) − X·G + Ra(t)
 *   Ra(t) = A · t/τ² · e^(−t/τ)            glucose absorbed from the gut
 *   healthy, type 2: dX/dt = (k·max(0, G − G_b) − X) / τ_x   (insulin action follows glucose)
 *   type 1:  X(t) = dose · s · t/τ_i² · e^(−t/τ_i)            (injected insulin only)
 */

export type Person = 'zdravy' | 't1' | 't2'

export const PERSONS: Record<Person, { name: string }> = {
  zdravy: { name: 'zdravý člověk' },
  t1: { name: 'diabetes 1. typu' },
  t2: { name: 'diabetes 2. typu' },
}

/** Normal ranges (mmol/l, venous plasma), approximate. */
export const FASTING_LOW = 3.9
export const FASTING_HIGH = 5.6
export const LIMIT_2H = 7.8
export const HYPO = 3.9

export const MINUTES = 240
export const DOSE_MAX = 16

interface Params {
  Gb: number
  p1: number
  k: number
  tx: number
}
const PARAMS: Record<Person, Params> = {
  zdravy: { Gb: 5, p1: 0.012, k: 0.004, tx: 12 },
  t1: { Gb: 7.5, p1: 0.006, k: 0, tx: 1 },
  t2: { Gb: 7.2, p1: 0.006, k: 0.00045, tx: 45 },
}
/** meal: total glucose appearance (mmol/l) and the absorption time constant (min) */
const MEAL_A = 11
const MEAL_TAU = 30
/** injected rapid-acting insulin: effect per unit and the time to its peak (min) */
const INS_S = 0.3
const INS_TAU = 60

const gamma = (t: number, tau: number) => (t / (tau * tau)) * Math.exp(-t / tau)

/** Glucose (mmol/l) at every minute 0..MINUTES; `dose` (units) only matters for type 1. */
export function glucoseCurve(person: Person, dose = 0): number[] {
  const { Gb, p1, k, tx } = PARAMS[person]
  let G = Gb
  let X = 0
  const out = [G]
  for (let t = 0; t < MINUTES; t++) {
    const Xt = person === 't1' ? dose * INS_S * gamma(t, INS_TAU) : X
    const dG = -p1 * (G - Gb) - Xt * G + MEAL_A * gamma(t, MEAL_TAU)
    if (person !== 't1') X += ((k * Math.max(0, G - Gb) - X) / tx)
    G = Math.max(1, G + dG)
    out.push(G)
  }
  return out
}

export interface GlucoseSummary {
  peak: number
  peakAt: number
  at2h: number
  low: number
  /** never under 3,9 (no hypoglycaemia), under 7,8 at 2 h and back under 7,8 at the end */
  inNorm: boolean
}

export function summarize(curve: number[]): GlucoseSummary {
  let peak = -Infinity
  let peakAt = 0
  curve.forEach((g, i) => {
    if (g > peak) {
      peak = g
      peakAt = i
    }
  })
  const low = Math.min(...curve)
  const at2h = curve[120]
  const inNorm = low >= HYPO && at2h < LIMIT_2H && curve[curve.length - 1] < LIMIT_2H
  return { peak, peakAt, at2h, low, inNorm }
}
