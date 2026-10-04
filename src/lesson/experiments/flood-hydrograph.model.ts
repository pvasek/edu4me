/**
 * Model of the `flood-hydrograph` experiment (z4-6, z10-6): a storm over a small
 * river basin (AREA km²) and the flood wave it sends down the river.
 *
 * - The rain (P mm) falls in 3 hours: 25 %, 50 %, 25 % per hour; the strongest
 *   hour is centred at RAIN_PEAK_T = 1,5 h.
 * - How much of it runs off is the SCS curve-number method: S = 25 400 / CN − 254,
 *   initial loss Iₐ = 0,2 S, runoff Q = (P − Iₐ)² / (P − Iₐ + S). Forest soaks up most
 *   of the rain (CN 60), fields less (CN 78), a town with roofs and asphalt very
 *   little (CN 90).
 * - When it reaches the river is a unit hydrograph shaped like a gamma curve whose
 *   peak comes `tp` hours after the rain: slowly through forest litter and soil
 *   (9 h), faster over fields (5 h), fast down gutters and drains (2,5 h).
 * - The river carries a base flow BASE m³/s; above BANKFULL m³/s it spills over its
 *   banks. Peak discharge (kulminační průtok) and lag time (doba zpoždění: from the
 *   strongest rain to the peak) are read off the curve.
 */

export const AREA = 20
export const BASE = 1.5
export const BANKFULL = 12
export const T_END = 30
export const DT = 0.25
export const RAIN_SHARE = [0.25, 0.5, 0.25]
export const RAIN_PEAK_T = 1.5

export type Cover = 'les' | 'pole' | 'mesto'
export const COVERS: Record<Cover, { label: string; cn: number; tp: number }> = {
  les: { label: 'les', cn: 60, tp: 9 },
  pole: { label: 'pole', cn: 78, tp: 5 },
  mesto: { label: 'město', cn: 90, tp: 2.5 },
}

/** Cumulative direct runoff (mm) from cumulative rain p (mm), SCS curve number. */
export function runoff(p: number, cn: number): number {
  const s = 25400 / cn - 254
  const ia = 0.2 * s
  return p > ia ? (p - ia) ** 2 / (p - ia + s) : 0
}

/** Rain intensity (mm/h) at time t for a storm of p mm. */
export const rainAt = (p: number, t: number) => (t >= 0 && t < RAIN_SHARE.length ? RAIN_SHARE[Math.floor(t)] * p : 0)

const SHAPE = 4
/** Unit hydrograph (1/h): gamma density with its peak at tp hours. */
function uh(t: number, tp: number): number {
  if (t <= 0) return 0
  const th = tp / (SHAPE - 1)
  return (t ** (SHAPE - 1) * Math.exp(-t / th)) / (6 * th ** SHAPE) // Γ(4) = 6
}

export interface Hydro {
  /** [t (h), Q (m³/s)] */
  series: [number, number][]
  peak: number
  peakT: number
  lag: number
  /** runoff depth (mm) and its share of the rain */
  runoffMm: number
  coef: number
  floods: boolean
}

export function hydrograph(p: number, cover: Cover): Hydro {
  const { cn, tp } = COVERS[cover]
  // rainfall excess in each DT step, placed at the middle of the step
  const ex: [number, number][] = []
  let cum = 0
  for (let t = 0; t < RAIN_SHARE.length - 1e-9; t += DT) {
    const before = runoff(cum, cn)
    cum += rainAt(p, t) * DT
    ex.push([t + DT / 2, runoff(cum, cn) - before])
  }
  const series: [number, number][] = []
  let peak = BASE
  let peakT = 0
  for (let t = 0; t <= T_END + 1e-9; t += DT) {
    let q = BASE
    // 1 mm over 1 km² = 1 000 m³; uh is per hour → / 3 600 s
    for (const [ti, e] of ex) q += (e * AREA * 1000 * uh(t - ti, tp)) / 3600
    series.push([t, q])
    if (q > peak + 1e-9) {
      peak = q
      peakT = t
    }
  }
  const runoffMm = runoff(p, cn)
  return {
    series,
    peak,
    peakT,
    lag: peak > BASE + 1e-6 ? peakT - RAIN_PEAK_T : NaN,
    runoffMm,
    coef: p > 0 ? runoffMm / p : 0,
    floods: peak > BANKFULL,
  }
}

/** The challenge: 80 mm of rain and the river stays in its bed. */
export const CH_RAIN = 80
export const challengeMet = (p: number, cover: Cover) => p === CH_RAIN && !hydrograph(p, cover).floods
