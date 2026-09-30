import { describe, expect, it } from 'vitest'
import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { parseFormula } from '../../courses/chemie/data/formula'
import { mainIonCharge } from '../periodic-find/levels'
import { GAME_BY_ID } from '../registry'
import { LEVELS, MAIN_A } from './levels'
import { MAX_E, MAX_N, MAX_P, checkAtom, makeLevelTasks } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const NOBLE_Z: Record<string, number> = { He: 2, Ne: 10, Ar: 18 }

describe('build-atom level sets', () => {
  it('has a set for every level listed in the registry', () => {
    expect(Object.keys(LEVELS)).toEqual(Object.keys(GAME_BY_ID['build-atom'].courses.chemie!))
  })

  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`level ${lv}: tasks are consistent (Z, A, charge) and buildable`, () => {
      expect(set.length).toBeGreaterThanOrEqual(10)
      for (const t of set) {
        const el = BY_SYMBOL[t.symbol]
        expect(t.z, t.symbol).toBe(el.z)
        expect(t.z + t.n).toBe(t.a)
        expect(t.z - t.e).toBe(t.charge)
        expect(t.n).toBeGreaterThanOrEqual(0)
        expect(t.z).toBeLessThanOrEqual(MAX_P)
        expect(t.n).toBeLessThanOrEqual(MAX_N)
        expect(t.e).toBeLessThanOrEqual(MAX_E)
        if (t.kind !== 'ion') expect(t.charge).toBe(0)
        if (t.kind === 'atom') expect(t.a).toBe(MAIN_A[t.symbol])
        if (t.kind === 'ion') {
          expect(t.charge).not.toBe(0)
          // a real nuclide: A within ±3 of the relative atomic mass
          expect(Math.abs(t.a - el.mass)).toBeLessThan(3)
        }
        expect(checkAtom(t, t.z, t.n, t.e).ok).toBe(true)
      }
    })
  }

  it('level 2 has the isotopes from the lesson', () => {
    const labels = LEVELS[2].filter((t) => t.kind === 'isotope').map((t) => `${t.label}:${t.a}`)
    for (const x of ['protium:1', 'deuterium:2', 'tritium:3', 'uhlík-12:12', 'uhlík-14:14', 'chlor-35:35', 'chlor-37:37']) expect(labels).toContain(x)
  })

  it('level 3 ions reach a noble-gas configuration and balance their compound', () => {
    for (const t of LEVELS[3]) {
      expect(t.kind).toBe('ion')
      expect(t.partner, t.symbol).toBeDefined()
      expect(t.e, `${t.symbol}${t.charge}`).toBe(NOBLE_Z[t.noble!])
      expect(t.charge).toBe(t.symbol === 'H' ? -1 : mainIonCharge(BY_SYMBOL[t.symbol]))
      const p = t.partner!
      if (p.other !== 'H') expect(p.otherCharge).toBe(mainIonCharge(BY_SYMBOL[p.other]))
      const counts = parseFormula(p.formula)
      expect(Object.keys(counts).sort()).toEqual([t.symbol, p.other].sort())
      expect(counts[t.symbol] * t.charge + counts[p.other] * p.otherCharge, p.formula).toBe(0)
    }
    expect(new Set(LEVELS[3].map((t) => `${t.symbol}${t.charge}`)).size).toBeGreaterThanOrEqual(10)
  })

  for (const lv of [2, 3]) {
    it(`level ${lv}: generates rounds of 6 distinct tasks`, () => {
      for (let s = 1; s <= 30; s++) {
        const tasks = makeLevelTasks(lv, rng(s))
        expect(tasks).toHaveLength(6)
        expect(new Set(tasks.map((t) => `${t.kind}${t.symbol}${t.a}${t.charge}`)).size).toBe(6)
        for (const t of tasks) expect(LEVELS[lv]).toContain(t)
      }
    })
  }

  it('level 2 rounds contain exactly one simple ion, level 3 only ions', () => {
    for (let s = 1; s <= 20; s++) {
      expect(makeLevelTasks(2, rng(s)).filter((t) => t.kind === 'ion')).toHaveLength(1)
      expect(makeLevelTasks(3, rng(s)).every((t) => t.kind === 'ion' && t.partner)).toBe(true)
    }
  })

  it('mixes both levels without a level or with an unsupported one', () => {
    for (const lv of [undefined, 7]) {
      const tasks = makeLevelTasks(lv, rng(5))
      expect(tasks).toHaveLength(6)
      expect(tasks.some((t) => LEVELS[2].includes(t))).toBe(true)
      expect(tasks.some((t) => LEVELS[3].includes(t))).toBe(true)
    }
  })

  it('explains the charge of a level-3 ion from its compound', () => {
    const al = LEVELS[3].find((t) => t.partner?.formula === 'Al2O3' && t.symbol === 'Al')!
    const r = checkAtom(al, 13, 14, 13)
    expect(r.ok).toBe(false)
    expect(r.problems[0]).toContain('kation')
    expect(r.problems[0]).toContain('$Al2O3$')
  })
})
