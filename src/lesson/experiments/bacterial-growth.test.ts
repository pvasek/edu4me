import { describe, expect, it } from 'vitest'
import { MAX_DOTS, bacteria, bakterie, dotPositions, dotScale, hm, timeToExceed } from './bacterial-growth.model'

describe('bacterial-growth model', () => {
  it('one bacterium doubles every doubling time', () => {
    expect(bacteria(0, 20)).toEqual({ generations: 0, count: 1 })
    expect(bacteria(19, 20).count).toBe(1)
    expect(bacteria(20, 20).count).toBe(2)
    expect(bacteria(60, 20).count).toBe(8)
    expect(bacteria(60, 30).count).toBe(4)
    expect(bacteria(480, 20).count).toBe(2 ** 24)
  })
  it('passes a million after 20 divisions (2²⁰ = 1 048 576): 6 h 40 min at 20 min', () => {
    expect(timeToExceed(1_000_000, 20)).toBe(400)
    expect(bacteria(400, 20).count).toBeGreaterThan(1_000_000)
    expect(bacteria(390, 20).count).toBeLessThan(1_000_000)
    // within the 8 hours of the slider only with doubling ≤ 24 min
    expect(timeToExceed(1_000_000, 25)).toBeGreaterThan(480)
  })
  it('caps the dots: each dot is a power of two bacteria', () => {
    expect(dotScale(1)).toEqual({ perDot: 1, dots: 1 })
    expect(dotScale(256)).toEqual({ perDot: 1, dots: 256 })
    expect(dotScale(512)).toEqual({ perDot: 2, dots: 256 })
    const big = dotScale(2 ** 24)
    expect(big.dots).toBeLessThanOrEqual(MAX_DOTS)
    expect(big.perDot * big.dots).toBe(2 ** 24)
  })
  it('dots stay inside the dish', () => {
    for (const [x, y] of dotPositions(MAX_DOTS, 50)) expect(Math.hypot(x, y)).toBeLessThanOrEqual(50)
  })
  it('Czech words and times', () => {
    expect(bakterie(1)).toBe('bakterie')
    expect(bakterie(4)).toBe('bakterie')
    expect(bakterie(8)).toBe('bakterií')
    expect(hm(140)).toBe('2 h 20 min')
    expect(hm(40)).toBe('40 min')
    expect(hm(360)).toBe('6 h')
  })
})
