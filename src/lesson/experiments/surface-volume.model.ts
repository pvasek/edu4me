/**
 * Model of the `surface-volume` experiment: a cube-shaped cell of edge a.
 *
 * S = 6a², V = a³, S : V = 6 / a (in units of length⁻¹; the experiment uses
 * plain length units). A toy model of supply: oxygen and food enter only through
 * the surface (supply ∝ S), the whole volume uses them (demand ∝ V). With the
 * constant chosen so supply equals demand at S : V = 1, the share of the cell
 * that is supplied is min(1, S : V); the rest is a starving grey core.
 */

export const surface = (a: number) => 6 * a * a
export const volume = (a: number) => a ** 3
export const ratio = (a: number) => (a > 0 ? surface(a) / volume(a) : Infinity)

/** S : V the cell needs (supply = demand). */
export const NEEDED_RATIO = 1

/** Share of the volume that gets enough oxygen (0–1). */
export const suppliedShare = (a: number) => Math.min(1, ratio(a) / NEEDED_RATIO)

/** Edge of the grey core (a cube centred in the cell holding the unsupplied volume). */
export const coreEdge = (a: number) => a * Math.cbrt(1 - suppliedShare(a))

/** The largest whole edge (1–max) whose S : V is still at least `r`. */
export function largestEdgeWithRatio(r: number, max = 10): number {
  let best = 0
  for (let a = 1; a <= max; a++) if (ratio(a) >= r - 1e-9) best = a
  return best
}
