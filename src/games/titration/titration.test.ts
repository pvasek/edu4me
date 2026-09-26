import { describe, expect, it } from 'vitest'
import {
  PINK_FROM,
  concFromVolume,
  endpointPoints,
  equivalenceVolume,
  flashDuration,
  parseCz,
  phAt,
  pinkIntensity,
  randomSample,
  scoreSample,
} from './titration'

describe('titration maths', () => {
  const s = { cHcl: 0.0873 }

  it('computes the equivalence volume', () => {
    expect(equivalenceVolume(s)).toBeCloseTo(17.46, 10)
    expect(equivalenceVolume({ cHcl: 0.1 })).toBeCloseTo(20, 10)
  })

  it('starts acidic, is neutral at equivalence and basic after', () => {
    expect(phAt(s, 0)).toBeCloseTo(-Math.log10(0.0873), 6)
    expect(phAt(s, 17.46)).toBeCloseTo(7, 4)
    expect(phAt(s, 17.41)).toBeLessThan(PINK_FROM)
    expect(phAt(s, 17.51)).toBeGreaterThan(PINK_FROM)
    expect(phAt(s, 40)).toBeGreaterThan(12)
  })

  it('is monotonic', () => {
    let prev = -Infinity
    for (let v = 0; v <= 50; v += 0.05) {
      const p = phAt(s, v)
      expect(p).toBeGreaterThanOrEqual(prev)
      prev = p
    }
  })

  it('phenolphthalein is colourless in acid and pink after the endpoint', () => {
    expect(pinkIntensity(7)).toBe(0)
    expect(pinkIntensity(8.5)).toBeGreaterThan(0)
    expect(pinkIntensity(14)).toBe(1)
  })

  it('flashes last longer near the endpoint and vanish after it', () => {
    expect(flashDuration(s, 1)).toBeLessThan(flashDuration(s, 17.3))
    expect(flashDuration(s, 18)).toBe(0)
  })

  it('random samples stay in a burette-friendly range', () => {
    for (let i = 0; i < 50; i++) {
      const v = equivalenceVolume(randomSample())
      expect(v).toBeGreaterThanOrEqual(12)
      expect(v).toBeLessThanOrEqual(28)
    }
  })

  it('parses Czech decimals', () => {
    expect(parseCz('0,0873')).toBeCloseTo(0.0873)
    expect(parseCz(' 17,45 ')).toBeCloseTo(17.45)
    expect(parseCz('abc')).toBeNull()
  })

  it('concentration from volume', () => {
    expect(concFromVolume(17.46)).toBeCloseTo(0.0873, 6)
  })
})

describe('titration scoring', () => {
  const s = { cHcl: 0.0873 }

  it('perfect run earns all points', () => {
    const r = scoreSample(s, 17.5, '17,5', '0,0875')
    expect(r.pink).toBe(true)
    expect(r.total).toBe(10)
  })

  it('penalises overshoot and early stop', () => {
    expect(endpointPoints(0.05)).toBe(5)
    expect(endpointPoints(0.4)).toBe(3)
    expect(endpointPoints(3)).toBe(0)
    expect(endpointPoints(-0.3)).toBe(2)
  })

  it('checks the reading and the calculation with 2 % tolerance', () => {
    const r = scoreSample(s, 20, '21', '0,0873')
    expect(r.readingOk).toBe(false)
    expect(r.calcOk).toBe(true) // matches the true value
    const r2 = scoreSample(s, 20, '20,0', '0,1')
    expect(r2.calcOk).toBe(true) // consistent with the volume used
    const r3 = scoreSample(s, 17.5, '17,5', '0,08')
    expect(r3.calcOk).toBe(false)
  })
})
