import { describe, expect, it } from 'vitest'
import { LEVELS, lostAt, producersNeeded, pyramid } from './energy-pyramid.model'

describe('energy-pyramid model', () => {
  it('the 10 % rule: 10 000 → 1 000 → 100 → 10 kJ', () => {
    const p = pyramid(10000, 0.1)
    expect(p).toHaveLength(LEVELS.length)
    expect(p[1]).toBeCloseTo(1000)
    expect(p[2]).toBeCloseTo(100)
    expect(p[3]).toBeCloseTo(10)
    expect(lostAt(p, 0)).toBeCloseTo(9000)
  })
  it('higher efficiency leaves more for the top predator', () => {
    expect(pyramid(10000, 0.2)[3]).toBeCloseTo(80)
    expect(pyramid(10000, 0.05)[3]).toBeCloseTo(1.25)
  })
  it('energy the plants need for the owl to get 10 kJ', () => {
    expect(producersNeeded(10, 0.1)).toBeCloseTo(10000)
    expect(producersNeeded(10, 0.2)).toBeCloseTo(1250)
    expect(producersNeeded(10, 0.05)).toBeCloseTo(80000)
    expect(pyramid(producersNeeded(10, 0.07), 0.07)[3]).toBeCloseTo(10)
  })
})
