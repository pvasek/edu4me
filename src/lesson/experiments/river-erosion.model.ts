/**
 * River work in the `river-erosion` experiment (z3-5): slope and discharge → flow velocity →
 * which grains the river erodes, carries or drops (a simplified Hjulström curve).
 *
 * - Flow velocity: Manning's formula for a wide channel of constant width gives
 *   v ∝ Q^0,4 · S^0,3 (more water and a steeper bed → faster flow). Scaled so that a lowland
 *   river (Q = 50 m³/s, S = 1 ‰) flows at about 0,5 m/s, a flood on a steep river at 2–3 m/s.
 * - Hjulström curve (log grain size d vs. mean velocity): above the erosion curve the river
 *   picks grains up from the bed, below the settling curve grains in the water fall to the bed,
 *   between the two grains already in the water are carried on (transport).
 *   The erosion curve has its minimum for sand (0,1–0,5 mm, about 0,2 m/s): sand is the easiest
 *   to erode. Clay is harder (its tiny flat grains stick together, a smooth bed): over 1,5 m/s.
 *   Gravel needs over 1 m/s because it is heavy. Clay settles only in still water (≪ 1 mm/s),
 *   so rivers carry it to lakes and the sea.
 * Points are read off the curve and joined linearly in log–log; the values are rounded.
 */

type Pt = [number, number] // [d in mm, v in m/s]

export const EROSION: Pt[] = [
  [0.001, 2.5],
  [0.01, 0.6],
  [0.1, 0.25],
  [0.3, 0.2],
  [1, 0.3],
  [10, 1.2],
  [100, 3.5],
]
export const SETTLING: Pt[] = [
  [0.001, 0.0001],
  [0.01, 0.001],
  [0.1, 0.008],
  [0.5, 0.05],
  [1, 0.09],
  [10, 0.8],
  [100, 2.6],
]

/** Value of a log–log polyline at grain size d (clamped at the ends). */
export function curveAt(curve: Pt[], d: number): number {
  const x = Math.log10(d)
  if (x <= Math.log10(curve[0][0])) return curve[0][1]
  for (let i = 1; i < curve.length; i++) {
    const [d0, v0] = curve[i - 1]
    const [d1, v1] = curve[i]
    if (x <= Math.log10(d1)) {
      const t = (x - Math.log10(d0)) / (Math.log10(d1) - Math.log10(d0))
      return 10 ** (Math.log10(v0) + t * (Math.log10(v1) - Math.log10(v0)))
    }
  }
  return curve[curve.length - 1][1]
}

export type Grain = 'jil' | 'pisek' | 'sterk'
export const GRAINS: Grain[] = ['jil', 'pisek', 'sterk']
/** Representative grain size (mm). */
export const SIZE: Record<Grain, number> = { jil: 0.002, pisek: 0.5, sterk: 10 }

export const erodeAt = (g: Grain) => curveAt(EROSION, SIZE[g])
export const settleAt = (g: Grain) => curveAt(SETTLING, SIZE[g])

export type Work = 'eroze' | 'transport' | 'ukladani'
export function work(g: Grain, v: number): Work {
  if (v >= erodeAt(g)) return 'eroze'
  if (v < settleAt(g)) return 'ukladani'
  return 'transport'
}

/** Slider stops: discharge Q (m³/s) and slope S (‰ = m per km). */
export const Q_STEPS = [0.5, 1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100, 150, 200, 300, 500]
export const S_STEPS = [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 7, 10, 15, 20]

/** Mean flow velocity (m/s) for discharge Q (m³/s) and slope S (‰). */
export const velocity = (q: number, s: number) => 0.1 * q ** 0.4 * s ** 0.3

/** The challenge: the river erodes gravel, but the clay bed still holds. */
export const challengeMet = (v: number) => work('sterk', v) === 'eroze' && work('jil', v) !== 'eroze'
