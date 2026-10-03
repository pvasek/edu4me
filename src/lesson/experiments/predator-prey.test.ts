import { describe, expect, it } from 'vitest'
import { C, D, DEFAULT_A, DEFAULT_LEVEL, H0, K, L0, YEARS, equilibrium, predatorPrey } from './predator-prey.model'

describe('predator-prey model', () => {
  it('samples 40 years from the starting numbers', () => {
    const r = predatorPrey(0.8, 5)
    expect(r.points[0]).toEqual([0, H0, L0])
    expect(r.points[r.points.length - 1][0]).toBeCloseTo(YEARS)
  })
  it('stays finite and non-negative over the whole slider range', () => {
    const bad: string[] = []
    for (const a of [0.2, 0.5, 0.9, 1.2, 1.5])
      for (const lv of [1, 3, 5, 7, 10]) {
        const r = predatorPrey(a, lv)
        if (r.points.some(([, h, l]) => !(Number.isFinite(h) && h >= 0 && h <= K * 1.01 && Number.isFinite(l) && l >= 0))) bad.push(`${a}/${lv}`)
      }
    expect(bad).toEqual([])
  })
  it('weak hunting: the lynx starve (c·b·K < d)', () => {
    expect(C * 0.01 * K).toBeLessThan(D)
    expect(predatorPrey(0.8, 1).lynxExtinct).not.toBeNull()
  })
  it('defaults: very skilled lynx and slow hares – the lynx die out; a middle setting keeps them', () => {
    expect(predatorPrey(DEFAULT_A, DEFAULT_LEVEL).lynxExtinct).not.toBeNull()
    const ok = predatorPrey(0.9, 5)
    expect(ok.lynxExtinct).toBeNull()
    // the populations oscillate: hares peak before the lynx catch up
    const peakH = ok.points.findIndex(([, h]) => h === Math.max(...ok.points.map((p) => p[1])))
    const peakL = ok.points.findIndex(([, , l]) => l === Math.max(...ok.points.map((p) => p[2])))
    expect(peakL).toBeGreaterThan(peakH)
  })
  it('without lynx the hares grow up to what the forest feeds', () => {
    const r = predatorPrey(0.8, 1)
    expect(r.points[r.points.length - 1][1]).toBeGreaterThan(0.95 * K)
  })
  it('equilibrium H* = d/(c·b)', () => {
    expect(equilibrium(0.9, 5).H).toBeCloseTo(D / (C * 0.05))
    expect(equilibrium(0.9, 5).L).toBeGreaterThan(0)
  })
})
