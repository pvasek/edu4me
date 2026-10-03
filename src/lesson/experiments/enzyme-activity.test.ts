import { describe, expect, it } from 'vitest'
import { ENZYMES, bestTemperature, enzymeRate, enzymeState, intactShare, pHFactor, pepsinFastest } from './enzyme-activity.model'

const { amylaza, pepsin, termo } = ENZYMES

describe('enzyme-activity model', () => {
  it('peaks near body temperature for saliva amylase and pepsin, near 70 °C for the thermophile', () => {
    expect(Math.abs(bestTemperature(amylaza) - 37)).toBeLessThanOrEqual(1)
    expect(Math.abs(bestTemperature(pepsin) - 37)).toBeLessThanOrEqual(1)
    expect(bestTemperature(termo)).toBe(70)
  })
  it('is at most 100 % and reaches about 100 % at the optimum', () => {
    for (const e of [amylaza, pepsin, termo])
      for (let T = 0; T <= 70; T++) for (let pH = 1; pH <= 12; pH += 0.5) expect(enzymeRate(e, T, pH)).toBeLessThanOrEqual(1 + 1e-9)
    expect(enzymeRate(amylaza, 37, 7)).toBeGreaterThan(0.99)
    expect(enzymeRate(pepsin, 37, 2)).toBeGreaterThan(0.99)
  })
  it('slows about twice per 10 °C of cooling (reversibly)', () => {
    expect(enzymeRate(amylaza, 27, 7) / enzymeRate(amylaza, 37, 7)).toBeCloseTo(0.5, 1)
    expect(enzymeRate(amylaza, 37, 7, 37)).toBeGreaterThan(0.99)
  })
  it('pH optimum: amylase ~7, pepsin ~2; pepsin hardly works at pH 7', () => {
    expect(pHFactor(amylaza, 7)).toBe(1)
    expect(pHFactor(pepsin, 2)).toBe(1)
    expect(enzymeRate(pepsin, 37, 7)).toBeLessThan(0.01)
    expect(enzymeRate(amylaza, 37, 2)).toBeLessThan(0.01)
  })
  it('denaturation is irreversible: after 60 °C amylase does not recover when cooled', () => {
    expect(intactShare(amylaza, 60)).toBe(0)
    expect(enzymeRate(amylaza, 37, 7, 60)).toBe(0)
    expect(enzymeState(amylaza, 60)).toBe('dead')
    // partly: 45 °C leaves about half the molecules
    expect(enzymeRate(amylaza, 37, 7, 45)).toBeCloseTo(intactShare(amylaza, 45) * enzymeRate(amylaza, 37, 7), 6)
    expect(enzymeState(amylaza, 45)).toBe('damaged')
    // the thermophile survives the whole range
    expect(enzymeState(termo, 70)).toBe('ok')
  })
  it('task: pepsin at about 37 °C and pH 2 counts, other enzymes or pH do not', () => {
    expect(pepsinFastest('pepsin', 37, 2, 37)).toBe(true)
    expect(pepsinFastest('pepsin', 37, 7, 37)).toBe(false)
    expect(pepsinFastest('pepsin', 37, 2, 55)).toBe(false)
    expect(pepsinFastest('amylaza', 37, 2, 37)).toBe(false)
  })
})
