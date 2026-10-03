import { describe, expect, it } from 'vitest'
import { coreEdge, largestEdgeWithRatio, ratio, suppliedShare, surface, volume } from './surface-volume.model'

describe('surface-volume model', () => {
  it('S = 6a², V = a³, S : V = 6 / a', () => {
    expect(surface(2)).toBe(24)
    expect(volume(2)).toBe(8)
    expect(ratio(2)).toBe(3)
    expect(ratio(1)).toBe(6)
    expect(ratio(10)).toBeCloseTo(0.6)
  })
  it('doubling the edge quadruples S, multiplies V by 8 and halves S : V', () => {
    expect(surface(6) / surface(3)).toBe(4)
    expect(volume(6) / volume(3)).toBe(8)
    expect(ratio(6)).toBeCloseTo(ratio(3) / 2)
  })
  it('the largest cube with S : V ≥ 1 has edge 6', () => {
    expect(largestEdgeWithRatio(1)).toBe(6)
    expect(ratio(6)).toBe(1)
    expect(ratio(7)).toBeLessThan(1)
  })
  it('a cell is fully supplied while S : V ≥ 1, then its grey core grows', () => {
    for (let a = 1; a <= 6; a++) {
      expect(suppliedShare(a)).toBe(1)
      expect(coreEdge(a)).toBe(0)
    }
    expect(suppliedShare(10)).toBeCloseTo(0.6)
    // the core holds the unsupplied 40 % of the volume
    expect(coreEdge(10) ** 3).toBeCloseTo(0.4 * 1000)
    for (let a = 7; a <= 10; a++) expect(coreEdge(a)).toBeGreaterThan(coreEdge(a - 1))
  })
})
