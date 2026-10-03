/**
 * Genetics of the `punnett-cross` experiment: Mendel's peas, one gene for flower
 * colour. A (fialový květ) is dominant over a (bílý květ).
 */

export type Genotype = 'AA' | 'Aa' | 'aa'
export const GENOTYPES: Genotype[] = ['AA', 'Aa', 'aa']
export type Allele = 'A' | 'a'

/** The two kinds of gametes a parent makes (each with probability 1/2). */
export const gametes = (g: Genotype): [Allele, Allele] => [g[0] as Allele, g[1] as Allele]

/** A zygote from two gametes, written with the dominant allele first (Aa, never aA). */
export const combine = (x: Allele, y: Allele): Genotype => (x === 'A' ? `A${y}` : `${y}a`) as Genotype

export const isWhite = (g: Genotype) => g === 'aa'

/**
 * The Punnett square: rows are the gametes of `mother`, columns those of `father`.
 * `counts` are out of 4 (each cell is one quarter), `white` is the fraction of
 * white-flowered offspring.
 */
export function punnett(mother: Genotype, father: Genotype) {
  const rows = gametes(mother)
  const cols = gametes(father)
  const cells = rows.map((r) => cols.map((c) => combine(r, c)))
  const counts: Record<Genotype, number> = { AA: 0, Aa: 0, aa: 0 }
  for (const g of cells.flat()) counts[g]++
  return { rows, cols, cells, counts, white: counts.aa / 4 }
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

/** Genotype ratio AA : Aa : aa reduced by the common divisor of the non-zero counts (e.g. [1, 2, 1], [1, 1, 0], [0, 1, 0]). */
export function genotypeRatio(counts: Record<Genotype, number>): [number, number, number] {
  const d = GENOTYPES.reduce((acc, g) => gcd(acc, counts[g]), 0)
  return [counts.AA / d, counts.Aa / d, counts.aa / d]
}

/** Phenotype ratio fialové : bílé, reduced; one side is 0 when all offspring look alike. */
export function phenotypeRatio(counts: Record<Genotype, number>): [number, number] {
  const purple = counts.AA + counts.Aa
  const white = counts.aa
  const d = gcd(purple, white)
  return [purple / d, white / d]
}

/** A small deterministic generator (mulberry32), so the offspring are scattered the same way every time. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * `n` offspring (n divisible by 4) in exactly the expected proportions, shuffled
 * with a seed taken from the cross, so they look scattered but the picture is stable.
 */
export function offspring(mother: Genotype, father: Genotype, n = 20): Genotype[] {
  const { counts } = punnett(mother, father)
  const list: Genotype[] = GENOTYPES.flatMap((g) => Array<Genotype>((counts[g] * n) / 4).fill(g))
  const rand = rng(17 + GENOTYPES.indexOf(mother) * 7 + GENOTYPES.indexOf(father) * 3)
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}
