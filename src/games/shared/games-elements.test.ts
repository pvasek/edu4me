import { describe, expect, it } from 'vitest'
import { BY_SYMBOL, ELEMENTS } from '../../courses/chemie/data/elements'
import { elementPool, inPeriod, levelNumber, normalize, parseDecimal, timeBonus } from './util'
import { neighbour } from './PeriodicTable'
import { hintFor, makeRounds } from '../periodic-find/logic'
import { dealCards, memoryScore } from '../element-memory/logic'
import { FACTS } from '../who-am-i/facts'
import { hintsFor, matchElement, roundPoints, suggest, tileOptions } from '../who-am-i/logic'
import { chargeText, checkAtom, makeTasks, MAX_E, MAX_N, MAX_P } from '../build-atom/logic'
import {
  emptyFilling,
  keyOf,
  solution,
  subshellsFor,
  tapOrbital,
  validateFilling,
  type Filling,
  type Orbital,
} from '../electron-config/logic'
import { breakdown, checkMass, pickFormulas } from '../molar-mass/logic'

/** Deterministic RNG for repeatable samples. */
function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('shared utils', () => {
  it('normalizes Czech text', () => {
    expect(normalize('  Měď ')).toBe('med')
    expect(normalize('HOŘČÍK')).toBe('horcik')
  })
  it('parses decimals with comma or dot', () => {
    expect(parseDecimal('18,02')).toBe(18.02)
    expect(parseDecimal(' 18.5 g/mol')).toBe(18.5)
    expect(parseDecimal('98')).toBe(98)
    expect(parseDecimal('abc')).toBeNull()
    expect(parseDecimal('')).toBeNull()
  })
  it('knows Czech prepositions and levels', () => {
    expect(inPeriod(1)).toBe('v 1. periodě')
    expect(inPeriod(3)).toBe('ve 3. periodě')
    expect(inPeriod(6)).toBe('v 6. periodě')
    expect(levelNumber('l7')).toBe(7)
    expect(levelNumber(undefined, 4)).toBe(4)
  })
  it('scales the time bonus', () => {
    expect(timeBonus(2, 30, 5, 15)).toBe(30)
    expect(timeBonus(10, 30, 5, 15)).toBe(15)
    expect(timeBonus(20, 30, 5, 15)).toBe(0)
  })
  it('builds level pools', () => {
    const l2 = elementPool(2).map((e) => e.symbol)
    expect(l2).toContain('Ca')
    expect(l2).toContain('Fe')
    expect(l2).not.toContain('Sc')
    const l7 = elementPool(7).map((e) => e.symbol)
    expect(l7).toContain('Ba')
    expect(l7).toContain('W')
    expect(l7).not.toContain('Ce')
  })
})

describe('periodic table navigation', () => {
  it('moves across gaps', () => {
    expect(neighbour(BY_SYMBOL.H, 'ArrowRight')?.symbol).toBe('He')
    expect(neighbour(BY_SYMBOL.Be, 'ArrowRight')?.symbol).toBe('B')
    expect(neighbour(BY_SYMBOL.Na, 'ArrowUp')?.symbol).toBe('Li')
    expect(neighbour(BY_SYMBOL.Y, 'ArrowDown')?.symbol).toBe('La')
    expect(neighbour(BY_SYMBOL.He, 'ArrowUp')).toBeUndefined()
  })
})

describe('periodic-find', () => {
  it('writes clues that identify exactly one element', () => {
    expect(hintFor(BY_SYMBOL.Cl)).toBe('Halogen ve 3. periodě')
    expect(hintFor(BY_SYMBOL.C)).toBe('Prvek 14. skupiny ve 2. periodě')
    for (const e of elementPool(7)) {
      const h = hintFor(e)!
      expect(ELEMENTS.filter((x) => x.group !== null && hintFor(x) === h)).toHaveLength(1)
    }
  })
  it('makes 10 distinct rounds', () => {
    const r = makeRounds(2, 10, rng(3))
    expect(r).toHaveLength(10)
    expect(new Set(r.map((x) => x.el.z)).size).toBe(10)
    expect(r.filter((x) => x.kind === 'hint')).toHaveLength(1)
  })
})

describe('element-memory', () => {
  it('deals symbol/name pairs', () => {
    const cards = dealCards(2, rng(5))
    expect(cards).toHaveLength(12)
    for (const c of cards) {
      expect(cards.filter((d) => d.sym === c.sym).map((d) => d.face).sort()).toEqual(['name', 'symbol'])
    }
    expect(dealCards(5, rng(2))).toHaveLength(16)
  })
  it('scores by moves', () => {
    expect(memoryScore(6, 6)).toBe(100)
    expect(memoryScore(9, 6)).toBe(100)
    expect(memoryScore(11, 6)).toBe(90)
    expect(memoryScore(100, 6)).toBe(10)
  })
})

describe('who-am-i', () => {
  it('matches typed answers without diacritics', () => {
    expect(matchElement('sodik')?.symbol).toBe('Na')
    expect(matchElement('MĚĎ')?.symbol).toBe('Cu')
    expect(matchElement(' fe ')?.symbol).toBe('Fe')
    expect(matchElement('horcik')?.symbol).toBe('Mg')
    expect(matchElement('xyz')).toBeUndefined()
    expect(matchElement('')).toBeUndefined()
  })
  it('suggests symbol match first, then name prefixes', () => {
    expect(suggest('na')[0].symbol).toBe('Na')
    const ch = suggest('ch').map((e) => e.symbol)
    expect(ch).toContain('Cl')
    expect(ch).toContain('Cr')
    expect(suggest('')).toEqual([])
  })
  it('has at least 40 facts that never give the name away', () => {
    const keys = Object.keys(FACTS)
    expect(keys.length).toBeGreaterThanOrEqual(40)
    for (const k of keys) {
      const e = BY_SYMBOL[k]
      expect(e, k).toBeDefined()
      // no word may start with the name ("borax" would give away bor)
      const words = normalize(FACTS[k]).split(/[^a-z0-9]+/)
      expect(words.some((w) => w.startsWith(normalize(e.name))), `${k}: ${FACTS[k]}`).toBe(false)
    }
  })
  it('gives 5 hints and fewer points for more hints', () => {
    const h = hintsFor(BY_SYMBOL.Cl)
    expect(h).toHaveLength(5)
    expect(h[0].text).toBe('Jsem halogen a za pokojové teploty plyn.')
    expect(h[3].text).toBe('Mám 7 valenčních elektronů.')
    expect(roundPoints(1, 'type')).toBe(100)
    expect(roundPoints(5, 'type')).toBe(20)
    expect(roundPoints(1, 'tiles')).toBe(60)
    const opts = tileOptions(BY_SYMBOL.Na, 2, rng(9))
    expect(opts).toHaveLength(4)
    expect(opts.map((e) => e.symbol)).toContain('Na')
  })
})

describe('build-atom', () => {
  it('checks particles and explains mistakes', () => {
    const na = makeTasks(rng(1)).find((t) => t.kind === 'ion' && t.charge > 0)!
    expect(checkAtom(na, na.z, na.n, na.e).ok).toBe(true)
    const r = checkAtom(na, na.z, na.n, na.z)
    expect(r.ok).toBe(false)
    expect(r.problems).toHaveLength(1)
    expect(r.problems[0]).toContain('kation')
    expect(chargeText(2)).toBe('2+')
    expect(chargeText(-1)).toBe('−')
    expect(chargeText(0)).toBe('')
  })
  it('makes six buildable tasks', () => {
    for (let s = 1; s < 30; s++) {
      const tasks = makeTasks(rng(s))
      expect(tasks).toHaveLength(6)
      for (const t of tasks) {
        expect(t.z).toBeLessThanOrEqual(MAX_P)
        expect(t.n).toBeLessThanOrEqual(MAX_N)
        expect(t.e).toBeLessThanOrEqual(MAX_E)
        expect(t.z + t.n).toBe(t.a)
        expect(t.z - t.e).toBe(t.charge)
      }
    }
  })
})

describe('electron-config validator', () => {
  const set = (z: number, spec: Record<string, Orbital[]>): Filling =>
    emptyFilling(z).map((s) => (spec[keyOf(s)] ? { ...s, orbitals: spec[keyOf(s)] } : s))
  const full2 = ['u', 'd'] as Orbital

  it('accepts the ground state of every element up to Kr', () => {
    for (let z = 1; z <= 36; z++) expect(validateFilling(z, solution(z)), `Z=${z}`).toEqual({ ok: true })
  })
  it('shows one decoy subshell', () => {
    expect(subshellsFor(8).map(keyOf)).toEqual(['1s', '2s', '2p', '3s'])
    expect(subshellsFor(36).map(keyOf).pop()).toBe('4p')
  })
  it('cycles a box ↑ → ↑↓ → empty', () => {
    expect(tapOrbital([])).toEqual(['u'])
    expect(tapOrbital(['u'])).toEqual(['u', 'd'])
    expect(tapOrbital(['u', 'd'])).toEqual([])
  })
  it('counts electrons first', () => {
    const v = validateFilling(7, set(7, { '1s': [full2], '2s': [full2] }))
    expect(v.ok || v.rule).toBe('count')
  })
  it('detects Pauli', () => {
    const v = validateFilling(8, set(8, { '1s': [full2], '2s': [full2], '2p': [['u', 'u'], ['u'], ['u']] }))
    expect(v.ok || v.rule).toBe('pauli')
  })
  it('detects Aufbau', () => {
    const v = validateFilling(11, set(11, { '1s': [full2], '2s': [full2], '2p': [full2, full2, ['u']], '3s': [full2] }))
    expect(v.ok || v.rule).toBe('aufbau')
    expect(!v.ok && v.where).toBe('2p')
  })
  it('detects Hund (pairing too early and mixed spins)', () => {
    const v = validateFilling(7, set(7, { '1s': [full2], '2s': [full2], '2p': [full2, ['u'], []] }))
    expect(v.ok || v.rule).toBe('hund')
    const w = validateFilling(7, set(7, { '1s': [full2], '2s': [full2], '2p': [['u'], ['d'], ['u']] }))
    expect(w.ok || w.rule).toBe('hund')
  })
  it('explains the Cr exception', () => {
    const base = { '1s': [full2], '2s': [full2], '2p': [full2, full2, full2], '3s': [full2], '3p': [full2, full2, full2] }
    const v = validateFilling(24, set(24, { ...base, '4s': [full2], '3d': [['u'], ['u'], ['u'], ['u'], []] }))
    expect(v.ok || v.rule).toBe('exception')
    const ok = validateFilling(24, set(24, { ...base, '4s': [['u']], '3d': [['u'], ['u'], ['u'], ['u'], ['u']] }))
    expect(ok.ok).toBe(true)
  })
})

describe('molar-mass', () => {
  it('breaks a formula down', () => {
    const b = breakdown('Ca(OH)2')
    expect(b.rows.map((r) => [r.symbol, r.count])).toEqual([
      ['Ca', 1],
      ['O', 2],
      ['H', 2],
    ])
    expect(b.total).toBeCloseTo(74.09, 1)
    expect(breakdown('CuSO4·5H2O').total).toBeCloseTo(249.68, 1)
  })
  it('accepts answers within ±0,5', () => {
    expect(checkMass('18,02', 'H2O').kind).toBe('ok')
    expect(checkMass('18.5', 'H2O').kind).toBe('ok')
    expect(checkMass('19', 'H2O').kind).toBe('wrong')
    expect(checkMass('98,08 g/mol', 'H2SO4').kind).toBe('ok')
    expect(checkMass('abc', 'H2O').kind).toBe('invalid')
  })
  it('picks 8 distinct formulas', () => {
    const f = pickFormulas(rng(4))
    expect(f).toHaveLength(8)
    expect(new Set(f).size).toBe(8)
    for (const x of f) expect(breakdown(x).total).toBeGreaterThan(0)
  })
})
