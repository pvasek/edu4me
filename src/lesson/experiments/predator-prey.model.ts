/**
 * Ecology of the `predator-prey` experiment (b12-4): hares (zajíci, H) and lynx
 * (rysi, L) in one forest, Lotka–Volterra equations with a food limit for the hares
 * (t in years):
 *   dH/dt = a·H·(1 − H/K) − b·H·L   hares are born (a), the forest feeds at most K, lynx eat them (b)
 *   dL/dt = c·b·H·L − d·L           lynx raise young from the hares they eat (c) and die (d)
 * Integrated with a small semi-implicit Euler step (stable for the whole slider range).
 * A population that falls below 2 animals (no pair left) is extinct, as in a real
 * forest. Lynx die out when they catch too few hares (c·b·K < d: weak hunting) or when
 * they eat the hares down so far that they then starve (strong hunting, slow hares).
 * The numbers are illustrative, not field data.
 */

export const YEARS = 40
export const DT = 0.005
/** start: hares and lynx in the forest */
export const H0 = 300
export const L0 = 12
/** lynx young per hare eaten and the lynx death rate per year */
export const C = 0.02
export const D = 0.5
/** hunting efficiency shown on the slider (1–10) → b per lynx per year */
export const B_PER_LEVEL = 0.01
/** the most hares the forest can feed (carrying capacity) */
export const K = 2000
export const MIN_ALIVE = 2

export interface PredatorPrey {
  /** samples every 0,25 year: [t, H, L] */
  points: [number, number, number][]
  hareMax: number
  lynxMax: number
  /** year in which the lynx died out (null = they survive the 40 years) */
  lynxExtinct: number | null
  hareExtinct: number | null
}

/**
 * @param a  hare birth rate per year (net of natural deaths), e.g. 0,6 = 60 % a year
 * @param level  hunting efficiency of the lynx on a 1–10 scale
 */
export function predatorPrey(a: number, level: number): PredatorPrey {
  const b = level * B_PER_LEVEL
  let H = H0
  let L = L0
  let lynxExtinct: number | null = null
  let hareExtinct: number | null = null
  const points: [number, number, number][] = [[0, H, L]]
  let hareMax = H
  let lynxMax = L
  const n = Math.round(YEARS / DT)
  const every = Math.round(0.25 / DT)
  for (let i = 1; i <= n; i++) {
    const t = i * DT
    H = H + DT * H * (a * (1 - H / K) - b * L)
    L = L + DT * L * (C * b * H - D)
    if (H < MIN_ALIVE && H > 0) {
      H = 0
      hareExtinct ??= t
    }
    if (L < MIN_ALIVE && L > 0) {
      L = 0
      lynxExtinct ??= t
    }
    hareMax = Math.max(hareMax, H)
    lynxMax = Math.max(lynxMax, L)
    if (i % every === 0) points.push([Math.round(t * 100) / 100, H, L])
  }
  return { points, hareMax, lynxMax, lynxExtinct, hareExtinct }
}

/** Equilibrium (where the cycles settle): H* = d / (c·b), L* = (a / b)·(1 − H* / K); L* ≤ 0 → lynx cannot live there. */
export function equilibrium(a: number, level: number): { H: number; L: number } {
  const b = level * B_PER_LEVEL
  const H = D / (C * b)
  return { H, L: (a / b) * (1 - H / K) }
}

/** Slider defaults: slow hares and very skilled lynx – the lynx eat the hares down and starve. */
export const DEFAULT_A = 0.5
export const DEFAULT_LEVEL = 9
