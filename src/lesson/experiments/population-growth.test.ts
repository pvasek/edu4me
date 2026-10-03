import { describe, expect, it } from 'vitest'
import { N0, exponential, halfTime, logistic, reachesHalfAt10 } from './population-growth.model'

describe('population-growth model', () => {
  it('both start at N₀; exponential is N₀·e^(rt)', () => {
    expect(exponential(0.3, 0)).toBe(N0)
    expect(logistic(0.3, 800, 0)).toBeCloseTo(N0)
    expect(exponential(0.5, 2)).toBeCloseTo(N0 * Math.E)
  })
  it('logistic growth stays below K and approaches it', () => {
    for (let t = 0; t <= 40; t += 5) expect(logistic(0.5, 500, t)).toBeLessThan(500)
    expect(logistic(0.5, 500, 100)).toBeCloseTo(500, 3)
  })
  it('early on, logistic ≈ exponential; later it is much smaller', () => {
    expect(logistic(0.3, 1000, 1) / exponential(0.3, 1)).toBeGreaterThan(0.98)
    expect(logistic(0.3, 1000, 20)).toBeLessThan(exponential(0.3, 20) / 3)
  })
  it('half of K at t = ln((K − N₀)/N₀) / r', () => {
    const th = halfTime(0.4, 600)
    expect(logistic(0.4, 600, th)).toBeCloseTo(300)
  })
  it('task: K/2 in 10 steps', () => {
    // K = 1000: ln 99 / r = 10 → r ≈ 0,46
    expect(reachesHalfAt10(0.46, 1000)).toBe(true)
    expect(reachesHalfAt10(0.3, 800)).toBe(false)
    expect(reachesHalfAt10(1, 1000)).toBe(false)
  })
})
