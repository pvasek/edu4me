import { describe, expect, it } from 'vitest'
import { fixedShuffle, fromAffected, genotypeCounts, hardyWeinberg, isTaskQ, oneIn } from './hardy-weinberg.model'

describe('hardy-weinberg model', () => {
  it('p² + 2pq + q² = 1', () => {
    for (let q = 0; q <= 1; q += 0.05) {
      const f = hardyWeinberg(q)
      expect(f.AA + f.Aa + f.aa).toBeCloseTo(1, 12)
      expect(f.p + f.q).toBeCloseTo(1, 12)
    }
    expect(hardyWeinberg(0.3)).toMatchObject({ p: 0.7 })
    expect(hardyWeinberg(0.3).Aa).toBeCloseTo(0.42)
  })
  it('100 people always, matching the frequencies', () => {
    for (let q = 0; q <= 1; q += 0.01) {
      const c = genotypeCounts(q)
      expect(c.AA + c.Aa + c.aa).toBe(100)
    }
    expect(genotypeCounts(0.5)).toEqual({ AA: 25, Aa: 50, aa: 25 })
    expect(genotypeCounts(0.02)).toEqual({ AA: 96, Aa: 4, aa: 0 })
  })
  it('1 affected in 2 500 → q = 0,02 and about 1 carrier in 26 (≈ 3,9 %)', () => {
    const f = fromAffected(1 / 2500)
    expect(f.q).toBeCloseTo(0.02)
    expect(f.Aa).toBeCloseTo(0.0392)
    expect(Math.round(oneIn(f.Aa))).toBe(26)
    expect(oneIn(0)).toBe(Infinity)
    expect(isTaskQ(0.02)).toBe(true)
    expect(isTaskQ(0.03)).toBe(false)
  })
  it('the fixed shuffle is a permutation and stable', () => {
    const a = fixedShuffle(100)
    expect([...a].sort((x, y) => x - y)).toEqual(Array.from({ length: 100 }, (_, i) => i))
    expect(fixedShuffle(100)).toEqual(a)
  })
})
