/**
 * Ecology of the `population-growth` experiment (b12-4): a population starting from
 * N₀ individuals grows
 * - exponentially, N(t) = N₀ · e^(r·t), when resources are unlimited, or
 * - logistically, dN/dt = r·N·(1 − N/K), N(t) = K / (1 + (K − N₀)/N₀ · e^(−r·t)),
 *   when the environment can feed at most K individuals (carrying capacity).
 * r is the intrinsic growth rate per time step (births minus deaths per individual).
 */

export const N0 = 10
export const STEPS = 30
export const READ_AT = 20

export const exponential = (r: number, t: number, n0 = N0) => n0 * Math.exp(r * t)

export function logistic(r: number, K: number, t: number, n0 = N0): number {
  return K / (1 + ((K - n0) / n0) * Math.exp(-r * t))
}

/** The time when the logistic population reaches K/2 (the inflection: growth is fastest there). */
export function halfTime(r: number, K: number, n0 = N0): number {
  if (r <= 0 || K <= 2 * n0) return r > 0 ? 0 : Infinity
  return Math.log((K - n0) / n0) / r
}

/** The challenge: half the capacity reached in 10 steps (N(10) within K/2 ± 5 % of K). */
export const HALF_AT = 10
export function reachesHalfAt10(r: number, K: number): boolean {
  return Math.abs(logistic(r, K, HALF_AT) / K - 0.5) <= 0.05
}
