import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { INDICATORS, LEVELS, fractionAtPh, indicatorExplain, pickSamples } from './samples'
import {
  PINK_FROM,
  concFromVolume,
  equivalenceVolume,
  halfEquivalence,
  phAt,
  randomSample,
  sampleMax,
  scoreSample,
  type Sample,
} from './titration'

const close = (a: number, b: number, d = 0.01) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThan(d)

describe('CH3COOH titrated with NaOH (exact)', () => {
  const s: Sample = { acid: 'ch3cooh', c: 0.1 } // 20 cm³, V_E = 20 cm³

  it('start: pH of 0,1 M acetic acid ≈ 2,88', () => {
    close(phAt(s, 0), 2.88)
  })

  it('half-equivalence: pH = pKa = 4,76', () => {
    const half = halfEquivalence(s)!
    expect(half.v).toBeCloseTo(10, 10)
    close(phAt(s, half.v), 4.76, 0.005)
    expect(half.pKa).toBe(4.76)
  })

  it('equivalence: sodium acetate 0,05 M, pH ≈ 8,72 (basic)', () => {
    close(phAt(s, 20), 8.72)
    expect(phAt(s, 20)).toBeGreaterThan(PINK_FROM)
    expect(phAt(s, 19.5)).toBeLessThan(7)
  })

  it('methyl orange would change far too early', () => {
    const v44 = fractionAtPh(4.76, INDICATORS.methyloranz.to) * equivalenceVolume(s)
    expect(v44).toBeLessThan(equivalenceVolume(s) / 2)
    expect(phAt(s, v44)).toBeCloseTo(4.4, 1)
    expect(indicatorExplain('ch3cooh', 'methyloranz')).toContain('30 %')
  })

  it('buffer region is flat, the jump is at equivalence', () => {
    expect(phAt(s, 14) - phAt(s, 6)).toBeLessThan(1)
    expect(phAt(s, 20.1) - phAt(s, 19.9)).toBeGreaterThan(3)
  })
})

describe('H2SO4 titrated with NaOH (1 : 2, exact)', () => {
  const s: Sample = { acid: 'h2so4', c: 0.05 } // 1 mmol, V_E = 20 cm³

  it('equivalence volume uses the 1 : 2 ratio', () => {
    expect(equivalenceVolume(s)).toBeCloseTo(20, 10)
    expect(concFromVolume(20, 'h2so4')).toBeCloseTo(0.05, 10)
    expect(concFromVolume(20, 'hcl')).toBeCloseTo(0.1, 10)
  })

  it('start: 0,05 M H2SO4 with weak second proton, pH ≈ 1,24', () => {
    const k = 10 ** -1.99
    const c = 0.05
    const x = (-(c + k) + Math.sqrt((c + k) ** 2 + 4 * k * c)) / 2
    close(phAt(s, 0), -Math.log10(c + x), 1e-4)
    close(phAt(s, 0), 1.24)
  })

  it('half-equivalence: NaHSO4 solution, pH ≈ 1,85', () => {
    // 1 mmol HSO4− in 30 cm³: x² / (c − x) = Ka2
    const k = 10 ** -1.99
    const c = 1 / 30
    const x = (-k + Math.sqrt(k * k + 4 * k * c)) / 2
    close(phAt(s, 10), -Math.log10(x), 1e-4)
    close(phAt(s, 10), 1.85)
  })

  it('equivalence: Na2SO4 is practically neutral', () => {
    const p = phAt(s, 20)
    expect(p).toBeGreaterThan(7)
    expect(p).toBeLessThan(7.3)
    expect(phAt(s, 20.1)).toBeGreaterThan(PINK_FROM)
  })

  it('catches the forgotten 1 : 2 ratio', () => {
    const r = scoreSample(s, 20, '20,0', '0,1')
    expect(r.calcOk).toBe(false)
    expect(r.ratioSlip).toBe(true)
    expect(scoreSample(s, 20, '20,0', '0,05').calcOk).toBe(true)
  })
})

describe('curves are monotonic for every acid', () => {
  it('pH rises with added NaOH', () => {
    for (const acid of ['hcl', 'ch3cooh', 'h2so4'] as const) {
      const s = randomSample(acid, () => 0.5)
      let prev = -Infinity
      for (let v = 0; v <= 50; v += 0.1) {
        const p = phAt(s, v)
        expect(p).toBeGreaterThanOrEqual(prev)
        prev = p
      }
    }
  })
})

describe('titration levels', () => {
  it('has content for exactly the registry levels', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID.titration.levels).map(Number))
  })

  it('L5 is HCl only, L6 is vinegar and sulfuric acid', () => {
    expect(pickSamples(5).map((s) => s.acid)).toEqual(['hcl', 'hcl'])
    expect(pickSamples(6).map((s) => s.acid)).toEqual(['ch3cooh', 'h2so4'])
  })

  it('free play and unsupported levels mix two different acids', () => {
    for (const lv of [undefined, 9]) {
      for (const r of [0, 0.4, 0.99]) {
        const acids = pickSamples(lv, () => r).map((s) => s.acid)
        expect(acids).toHaveLength(2)
        expect(new Set(acids).size).toBe(2)
      }
    }
  })

  it('every random sample needs 12–28 cm³ of NaOH', () => {
    for (const acid of ['hcl', 'ch3cooh', 'h2so4'] as const) {
      for (let i = 0; i < 30; i++) {
        const v = equivalenceVolume(randomSample(acid))
        expect(v).toBeGreaterThanOrEqual(12)
        expect(v).toBeLessThanOrEqual(28)
      }
    }
  })

  it('indicator choice is worth 2 extra points on vinegar', () => {
    const s: Sample = { acid: 'ch3cooh', c: 0.1 }
    expect(sampleMax(s)).toBe(12)
    expect(scoreSample(s, 20.02, '20,0', '0,1', true).total).toBe(12)
    expect(scoreSample(s, 20.02, '20,0', '0,1', false).total).toBe(10)
    expect(sampleMax({ acid: 'hcl', c: 0.1 })).toBe(10)
  })
})
