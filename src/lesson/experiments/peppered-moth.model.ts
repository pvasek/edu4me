/**
 * Natural selection in the `peppered-moth` experiment: drsnokřídlec březový (Biston
 * betularia) on tree bark. The dark form (carbonaria) is caused by a dominant allele C,
 * the light one is cc. Birds find the moth that contrasts with the bark more easily.
 * A simple one-gene selection model with approximate, illustrative numbers.
 */

/** Share of dark moths at generation 0: a rare form, as around 1850. */
export const START_DARK = 0.05
export const MAX_GEN = 20
/** Even a well-camouflaged moth is found by a bird sometimes. */
export const BASE_EATEN = 0.1
/** Extra chance of being eaten for a moth that does not match the bark at all. */
export const MISMATCH_EATEN = 0.4

/**
 * Chance that a light and a dark moth survive birds until they breed. `pollution`
 * (0–1) darkens the bark from light lichen-covered to sooty: on clean bark the light
 * moth is hidden and the dark one sticks out, on sooty bark the other way round.
 */
export function survival(pollution: number): { light: number; dark: number } {
  const p = Math.max(0, Math.min(1, pollution))
  return { light: 1 - BASE_EATEN - MISMATCH_EATEN * p, dark: 1 - BASE_EATEN - MISMATCH_EATEN * (1 - p) }
}

/** Share of dark moths (phenotype) when the allele C has frequency q: CC and Cc are dark. */
export const darkShare = (q: number) => 1 - (1 - q) ** 2

/**
 * Share of dark moths in generations 0…`gens`. Each generation the birds eat moths
 * (survival above), the survivors mate at random and the allele frequency of C is
 * q′ = q · w_dark / w̄, where w̄ is the mean survival.
 */
export function mothHistory(pollution: number, gens = MAX_GEN, start = START_DARK): number[] {
  const w = survival(pollution)
  let q = 1 - Math.sqrt(1 - start)
  const out = [darkShare(q)]
  for (let g = 0; g < gens; g++) {
    const d = darkShare(q)
    const mean = d * w.dark + (1 - d) * w.light
    q = (q * w.dark) / mean
    out.push(darkShare(q))
  }
  return out
}
