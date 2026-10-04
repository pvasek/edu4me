import { describe, expect, it } from 'vitest'
import {
  LIZ_BEST,
  T_MAX,
  T_MIN,
  isBest,
  lizardActivity,
  lizardBody,
  lizardEnergy,
  lizardState,
  mouseBody,
  mouseEnergy,
} from './body-temperature.model'

const range = Array.from({ length: T_MAX - T_MIN + 1 }, (_, i) => T_MIN + i)

describe('body-temperature model', () => {
  it('the lizard follows the air, the mouse keeps about 37 °C', () => {
    for (const t of range) {
      expect(lizardBody(t)).toBe(t)
      expect(mouseBody(t)).toBeGreaterThanOrEqual(37)
      expect(mouseBody(t)).toBeLessThanOrEqual(39)
    }
  })
  it('lizard activity: zero in the cold, a peak near the preferred temperature, falls in heat', () => {
    expect(lizardActivity(0)).toBe(0)
    expect(lizardActivity(5)).toBe(0)
    expect(lizardActivity(LIZ_BEST)).toBe(1)
    expect(lizardActivity(15)).toBeLessThan(lizardActivity(25))
    expect(lizardActivity(40)).toBeLessThan(lizardActivity(LIZ_BEST))
    let best = T_MIN
    for (const t of range) if (lizardActivity(lizardBody(t)) > lizardActivity(lizardBody(best))) best = t
    expect(best).toBe(LIZ_BEST)
  })
  it('the challenge is met only around the preferred temperature', () => {
    const ok = range.filter(isBest)
    expect(ok).toContain(LIZ_BEST)
    expect(Math.min(...ok)).toBeGreaterThanOrEqual(29)
    expect(Math.max(...ok)).toBeLessThanOrEqual(35)
    expect(lizardState(LIZ_BEST)).toBe('nejcilejsi')
    expect(lizardState(2)).toBe('strnula')
    expect(lizardState(-5)).toBe('zmrzla')
    expect(lizardState(40)).toBe('prehrata')
  })
  it('the mouse burns more food the colder it is; the lizard much less than the mouse', () => {
    expect(mouseEnergy(30)).toBe(1)
    expect(mouseEnergy(20)).toBeGreaterThan(2)
    expect(mouseEnergy(0)).toBeGreaterThan(mouseEnergy(20))
    for (let t = T_MIN + 1; t <= 30; t++) expect(mouseEnergy(t)).toBeLessThan(mouseEnergy(t - 1))
    for (const t of range) expect(lizardEnergy(t)).toBeLessThan(mouseEnergy(t) / 4)
    expect(lizardEnergy(10)).toBeLessThan(lizardEnergy(30))
  })
})
