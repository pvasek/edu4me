import { describe, expect, it } from 'vitest'
import {
  CONTACTS,
  INDEX_CASE,
  N,
  QUEUE,
  herdThreshold,
  lowestStoppingCoverage,
  neighbours,
  outbreak,
  vaccinatedCount,
} from './herd-immunity.model'

describe('herd-immunity model', () => {
  it('100 people, everybody meets up to 24 neighbours', () => {
    expect(N).toBe(100)
    expect(CONTACTS).toBe(24)
    expect(neighbours(INDEX_CASE)).toHaveLength(24)
    expect(neighbours(0)).toHaveLength(8)
  })
  it('vaccinates people in a fixed queue; the first sick person is last', () => {
    expect(new Set(QUEUE).size).toBe(N)
    expect(QUEUE[N - 1]).toBe(INDEX_CASE)
    expect(vaccinatedCount(37)).toBe(37)
    expect(outbreak(37, 'chripka').vaccinated).toBe(37)
  })
  it('a vaccinated person never falls ill and counts add up', () => {
    for (const p of [0, 30, 60, 90]) {
      const o = outbreak(p, 'spalnicky')
      expect(o.state.filter((s) => s === 'vaccinated').length).toBe(o.vaccinated)
      expect(o.vaccinated + o.sick + o.sparedUnvaccinated).toBe(N)
    }
  })
  it('without vaccination both diseases spread, measles to everybody', () => {
    expect(outbreak(0, 'chripka').sick).toBeGreaterThan(40)
    expect(outbreak(0, 'spalnicky').sick).toBe(100)
  })
  it('more vaccination never gives a bigger outbreak', () => {
    for (const d of ['chripka', 'spalnicky'] as const)
      for (let p = 1; p <= 100; p++) expect(outbreak(p, d).sick).toBeLessThanOrEqual(outbreak(p - 1, d).sick)
  })
  it('stops near the theoretical threshold 1 − 1/R₀ (flu ≈ 50 %, measles ≈ 93 %)', () => {
    expect(herdThreshold(2)).toBe(0.5)
    expect(herdThreshold(15)).toBeCloseTo(0.933, 3)
    const flu = lowestStoppingCoverage('chripka')
    const measles = lowestStoppingCoverage('spalnicky')
    expect(Math.abs(flu - 50)).toBeLessThanOrEqual(8)
    expect(Math.abs(measles - 93)).toBeLessThanOrEqual(4)
    expect(outbreak(flu, 'chripka').stopped).toBe(true)
    expect(outbreak(flu - 1, 'chripka').stopped).toBe(false)
    // above the threshold also the unvaccinated stay healthy (herd immunity)
    expect(outbreak(measles, 'spalnicky').sparedUnvaccinated).toBeGreaterThan(0)
  })
  it('waves are numbered from the first sick person', () => {
    const o = outbreak(30, 'chripka')
    expect(o.wave[INDEX_CASE]).toBe(0)
    expect(Math.max(...o.wave)).toBe(o.waves)
  })
})
