/**
 * Population genetics of the `hardy-weinberg` experiment (b10-6). In a large population
 * with random mating (no selection, mutation, migration or drift) the allele
 * frequencies p (A) and q (a), p + q = 1, give the genotype frequencies
 * AA = p², Aa = 2pq, aa = q² in every generation.
 */

export interface HW {
  p: number
  q: number
  AA: number
  Aa: number
  aa: number
}

export function hardyWeinberg(q: number): HW {
  const qq = Math.min(1, Math.max(0, q))
  const p = 1 - qq
  return { p, q: qq, AA: p * p, Aa: 2 * p * qq, aa: qq * qq }
}

/**
 * Whole numbers of people (summing to `n`) for the three genotypes, by the largest
 * remainder method, so the dot picture always has exactly n dots.
 */
export function genotypeCounts(q: number, n = 100): { AA: number; Aa: number; aa: number } {
  const f = hardyWeinberg(q)
  const keys = ['AA', 'Aa', 'aa'] as const
  const exact = keys.map((k) => f[k] * n)
  const out = exact.map(Math.floor)
  let left = n - out.reduce((a, b) => a + b, 0)
  const order = [0, 1, 2].sort((i, j) => exact[j] - out[j] - (exact[i] - out[i]))
  for (const i of order) if (left-- > 0) out[i]++
  return { AA: out[0], Aa: out[1], aa: out[2] }
}

/** "1 z N": how many people per one with the trait (Infinity when nobody has it). */
export const oneIn = (freq: number) => (freq > 0 ? 1 / freq : Infinity)

/** From the share of affected (aa) people back to q = √(q²) and the carriers 2pq. */
export function fromAffected(affected: number): HW {
  return hardyWeinberg(Math.sqrt(affected))
}

/** The challenge: 1 affected in 2 500 → q² = 1/2 500, q = 0,02 (carriers 2pq ≈ 3,9 %, about 1 in 26). */
export const TASK_AFFECTED = 1 / 2500
export const isTaskQ = (q: number) => Math.abs(q - Math.sqrt(TASK_AFFECTED)) < 0.001

/** A fixed shuffle of 0..n−1 (seeded), so the dots keep their places as q changes. */
export function fixedShuffle(n: number, seed = 7): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  let s = seed
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
