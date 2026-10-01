import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS, UNITS } from './levels'
import {
  ROUND,
  convert,
  distractors,
  explain,
  explain as explainRaw,
  factorOf,
  fmt,
  fmtSci,
  isRight,
  ladderSteps,
  makeRound,
  parseNumber,
  parseSci,
  playedLevel,
  sigDigits,
  valuesFor,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('unit-convert physics', () => {
  it('computes the classic conversions', () => {
    expect(convert(1, 'km', 'm')).toBe(1000)
    expect(convert(2.5, 'km', 'm')).toBe(2500)
    expect(convert(1, 'm²', 'cm²')).toBe(10000)
    expect(convert(1, 'm³', 'l')).toBe(1000)
    expect(convert(1, 'dm³', 'l')).toBe(1)
    expect(convert(1, 'cm³', 'ml')).toBe(1)
    expect(convert(72, 'km/h', 'm/s')).toBe(20)
    expect(convert(10, 'm/s', 'km/h')).toBe(36)
    expect(convert(1, 'kWh', 'MJ')).toBe(3.6)
    expect(convert(1, 'kWh', 'J')).toBe(3.6e6)
    expect(convert(1, 'h', 's')).toBe(3600)
    expect(convert(1, 'g/cm³', 'kg/m³')).toBe(1000)
    expect(convert(1, 'N/cm²', 'Pa')).toBe(1e4)
    expect(convert(450, 'nm', 'm')).toBeCloseTo(4.5e-7, 20)
    expect(convert(1, 'ha', 'm²')).toBe(1e4)
    expect(convert(3, 'mm', 'µm')).toBe(3000)
    expect(factorOf('mA', 'A')).toBe(0.001)
  })

  it('refuses to convert between different quantities', () => {
    expect(() => factorOf('m', 'kg')).toThrow()
  })

  it('formats and parses Czech numbers', () => {
    expect(fmt(2500)).toBe('2 500')
    expect(fmt(0.25)).toBe('0,25')
    expect(fmt(3.6)).toBe('3,6')
    expect(fmt(0.1 + 0.2)).toBe('0,3')
    expect(fmtSci(4.5e-7)).toBe('4,5·10⁻⁷')
    expect(fmtSci(1e6)).toBe('10⁶')
    expect(fmtSci(3.6e6)).toBe('3,6·10⁶')
    expect(parseNumber('2,5')).toBe(2.5)
    expect(parseNumber('2.5')).toBe(2.5)
    expect(parseNumber('2 500')).toBe(2500)
    expect(parseNumber('2 500,5')).toBe(2500.5)
    expect(parseNumber('−3')).toBe(-3)
    expect(parseNumber('4,5e-7')).toBe(4.5e-7)
    expect(parseNumber('4,5·10^-7')).toBe(4.5e-7)
    expect(parseNumber('4,5 × 10⁻⁷')).toBe(4.5e-7)
    expect(parseNumber('10^6')).toBe(1e6)
    expect(parseNumber('abc')).toBeNull()
    expect(parseNumber('')).toBeNull()
    expect(parseSci('4,5', '-7')).toBe(4.5e-7)
    expect(parseSci('4,5', '−7')).toBe(4.5e-7)
    expect(parseSci('2500', '')).toBe(2500)
    expect(parseSci('', '3')).toBeNull()
  })

  it('accepts answers within ±0,5 %', () => {
    expect(isRight(2500, 2500)).toBe(true)
    expect(isRight(2510, 2500)).toBe(true)
    expect(isRight(2520, 2500)).toBe(false)
    expect(isRight(4.51e-7, 4.5e-7)).toBe(true)
    expect(isRight(4.5e-6, 4.5e-7)).toBe(false)
  })

  it('explains every conversion in one line', () => {
    const explain = (t: Parameters<typeof explainRaw>[0]) => explainRaw(t).replace(/\u00a0/g, ' ')
    expect(explain({ from: 'km', to: 'm', value: 2.5, level: 1 })).toBe('1 km = 1 000 m, tedy ×1 000 → 2,5 km = 2 500 m.')
    expect(explain({ from: 'g', to: 'kg', value: 250, level: 1 })).toBe('1 kg = 1 000 g, tedy :1 000 → 250 g = 0,25 kg.')
    expect(explain({ from: 'm²', to: 'cm²', value: 2, level: 1 })).toContain('(100 · 100)')
    expect(explain({ from: 'km/h', to: 'm/s', value: 72, level: 2 })).toBe('1 m/s = 3,6 km/h (1 000 m za 3 600 s), tedy :3,6 → 72 km/h = 20 m/s.')
    expect(explain({ from: 'dm³', to: 'l', value: 3, level: 1 })).toContain('číslo se nemění')
    expect(explain({ from: 'nm', to: 'm', value: 450, level: 8 })).toBe('1 m = 10⁹ nm, tedy :10⁹ → 450 nm = 4,5·10⁻⁷ m.')
    expect(explainRaw({ from: 'km', to: 'm', value: 2.5, level: 1 })).toContain('2,5\u00a0km = 2\u00a0500\u00a0m') // number and unit never split
  })

  it('knows the prefix ladder', () => {
    expect(ladderSteps('km', 'm')).toEqual({ from: 3, to: 0, dim: 1, base: 'm' })
    expect(ladderSteps('m²', 'cm²')).toEqual({ from: 0, to: -2, dim: 2, base: 'm' })
    expect(ladderSteps('h', 's')).toBeNull()
    expect(ladderSteps('dm³', 'l')).toBeNull()
  })

  it('offers three distinct tempting distractors', () => {
    const d = distractors(2, 'm²', 'cm²', rng(3))
    expect(d).toHaveLength(3)
    expect(d).toContain(200) // stepped like a length
    expect(d).not.toContain(20000)
    const s = distractors(72, 'km/h', 'm/s', rng(1))
    expect(s).toContain(259.2) // multiplied instead of divided
  })
})

describe('unit-convert level sets', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(
      Object.keys(GAME_BY_ID['unit-convert'].courses.fyzika!).map(Number).sort((a, b) => a - b),
    )
  })

  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`L${lv}: every pair uses known units of one quantity and has fair values`, () => {
      for (const [a, b] of set.pairs) {
        expect(UNITS[a], a).toBeDefined()
        expect(UNITS[b], b).toBeDefined()
        expect(UNITS[a].q, `${a}→${b}`).toBe(UNITS[b].q)
        expect(valuesFor(Number(lv), a, b).length, `${a}→${b}`).toBeGreaterThanOrEqual(3)
      }
    })
  }

  it('picks the level from the level id, mix otherwise', () => {
    expect(playedLevel('l1')).toBe(1)
    expect(playedLevel('l8')).toBe(8)
    expect(playedLevel('l5')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })
})

describe('unit-convert rounds', () => {
  const levels = [...Object.keys(LEVELS).map(Number), undefined]
  for (const lv of levels) {
    it(`${lv ?? 'mix'}: ${ROUND} valid, distinct tasks with computed answers`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const tasks = makeRound(lv, rng(seed))
        expect(tasks).toHaveLength(ROUND)
        const keys = tasks.map((t) => `${t.from}>${t.to}:${t.value}`)
        expect(new Set(keys).size).toBe(ROUND)
        for (const t of tasks) {
          if (lv !== undefined) expect(t.level).toBe(lv)
          expect(t.answer).toBe(convert(t.value, t.from, t.to))
          expect(t.answer).toBeGreaterThan(0)
          expect(sigDigits(t.answer)).toBeLessThanOrEqual(3)
          expect(explain(t)).toMatch(/^1\s.+, (tedy|číslo).+\.$/)
          if (t.mode === 'choice') {
            expect(t.options).toHaveLength(4)
            expect(t.options).toContain(t.answer)
            expect(new Set(t.options!.map(fmt)).size).toBe(4)
            expect([...t.options!].sort((a, b) => a - b)).toEqual(t.options)
          } else expect(t.options).toBeUndefined()
        }
      }
    })
  }

  it('mixes all levels in free play', () => {
    const seen = new Set<number>()
    for (let seed = 1; seed < 10; seed++) makeRound(undefined, rng(seed)).forEach((t) => seen.add(t.level))
    expect(seen.size).toBe(Object.keys(LEVELS).length)
  })

  it('uses 4 options at levels 1–2 and scientific notation at level 8', () => {
    expect(makeRound(1, rng(2)).every((t) => t.mode === 'choice')).toBe(true)
    expect(makeRound(2, rng(2)).filter((t) => t.mode === 'choice').length).toBeGreaterThanOrEqual(6)
    expect(makeRound(6, rng(2)).every((t) => t.mode === 'type')).toBe(true)
    expect(makeRound(8, rng(2)).every((t) => t.mode === 'sci')).toBe(true)
  })
})
