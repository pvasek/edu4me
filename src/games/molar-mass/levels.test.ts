import { describe, expect, it } from 'vitest'
import { molarMass, parseFormula } from '../../courses/chemie/data/formula'
import { GAME_BY_ID } from '../registry'
import { ANIONS, CATIONS } from '../shared/ions'
import { hydrate, hydroxide, oxoacid, salt, binary, type BinaryPartner, PARTNER, ELEMENT_NOM, type Compound } from '../shared/nomenclature'
import { LEVELS } from './levels'
import { atomCount, breakdown, checkMass, nameOf, pickItems, playedLevel, toleranceFor } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Everything nomenclature.ts can build from the shared ions: acids, hydroxides, salts, hydrates, binaries. */
function generated(): Map<string, string> {
  const out = new Map<string, string>()
  const add = (c: Compound) => {
    if (!out.has(c.formula)) out.set(c.formula, c.name)
  }
  const salts = CATIONS.filter((c) => !c.noSalt)
  for (const c of salts) {
    add(hydroxide(c))
    for (const a of ANIONS) {
      if (a.formula === 'OH' || a.formula === 'H' || a.formula === 'N' || a.formula === 'O') continue
      const s = salt(c, a)
      add(s)
      for (const n of [2, 5, 7, 10]) add(hydrate(s, n))
    }
  }
  for (const [el, nom] of Object.entries(ELEMENT_NOM)) {
    for (const ox of nom.ox) {
      try {
        add(oxoacid(el, ox))
      } catch {
        /* no such acid */
      }
      for (const p of Object.keys(PARTNER) as BinaryPartner[]) add(binary(el, ox, p))
    }
  }
  return out
}

describe('molar-mass level sets', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(Object.keys(GAME_BY_ID['molar-mass'].levels).map(Number).sort())
  })

  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`L${lv}: at least 15 formulas that parse and have a molar mass`, () => {
      expect(set.length).toBeGreaterThanOrEqual(15)
      for (const { formula, name } of set) {
        expect(name.trim().length, formula).toBeGreaterThan(0)
        expect(() => parseFormula(formula), formula).not.toThrow()
        const m = molarMass(formula)
        expect(Number.isFinite(m) && m > 0, formula).toBe(true)
        expect(breakdown(formula).total).toBeCloseTo(m, 6)
      }
    })
  }

  it('lists every formula and every name only once across all levels', () => {
    const all = Object.values(LEVELS).flat()
    expect(new Set(all.map((x) => x.formula)).size).toBe(all.length)
    expect(new Set(all.map((x) => x.name)).size).toBe(all.length)
  })

  it('names agree with nomenclature.ts wherever it can build the compound', () => {
    const gen = generated()
    let checked = 0
    for (const lv of [4, 5, 7]) {
      for (const { formula, name } of LEVELS[lv]) {
        const expected = gen.get(formula)
        if (!expected) continue
        // trivial names first, systematic name in brackets (or just the trivial name)
        const systematic = name.match(/\(([^)]+)\)$/)?.[1] ?? name
        if (/^(oxid|sulfid|chlorid|fluorid|bromid|jodid|hydrid|nitrid|kyselina|hydroxid|[a-zěščřžýáíéůú]*an |[a-z]*hydrát)/.test(systematic)) {
          expect(systematic, formula).toBe(expected)
          checked++
        }
      }
    }
    expect(checked).toBeGreaterThanOrEqual(30)
  })

  it('contains the spec examples', () => {
    const has = (lv: number, f: string) => expect(LEVELS[lv].map((x) => x.formula), `L${lv} ${f}`).toContain(f)
    ;['H2O', 'CO2', 'NaCl', 'NH3', 'CH4', 'O2', 'CaCO3', 'Fe2O3'].forEach((f) => has(4, f))
    ;['H2SO4', 'H3PO4', 'Ca(OH)2', 'Al2(SO4)3', 'CuSO4·5H2O', 'Na2CO3·10H2O'].forEach((f) => has(5, f))
    ;['Fe3O4', 'Al2O3', 'CaSO4·2H2O', 'KMnO4', 'K2Cr2O7', '[Cu(NH3)4]SO4'].forEach((f) => has(7, f))
    ;['C2H5OH', 'C6H6', 'CH3COOH', 'C6H5OH', 'C3H8O3', 'CH3COOC2H5'].forEach((f) => has(8, f))
    ;['C6H12O6', 'C12H22O11', 'C2H5NO2', 'CO(NH2)2', 'C57H110O6', 'C10H16N5O13P3'].forEach((f) => has(9, f))
  })

  it('has correct masses for a few known compounds', () => {
    expect(molarMass('[Cu(NH3)4]SO4')).toBeCloseTo(227.7, 0)
    expect(molarMass('C10H16N5O13P3')).toBeCloseTo(507.18, 0)
    expect(molarMass('C57H110O6')).toBeCloseTo(891.5, 0)
    expect(molarMass('CuCO3·Cu(OH)2')).toBeCloseTo(221.1, 0)
  })
})

describe('molar-mass rounds', () => {
  it('picks the level from the level id, mix otherwise', () => {
    expect(playedLevel('l7')).toBe(7)
    expect(playedLevel('l6')).toBeUndefined()
    expect(playedLevel(undefined)).toBeUndefined()
  })

  it('deals 8 distinct formulas of the level, from small to big', () => {
    for (const lv of Object.keys(LEVELS).map(Number)) {
      const items = pickItems(lv, rng(lv))
      expect(items).toHaveLength(8)
      expect(new Set(items.map((x) => x.formula)).size).toBe(8)
      for (const x of items) expect(LEVELS[lv]).toContainEqual(x)
      const counts = items.map((x) => atomCount(x.formula))
      expect([...counts].sort((a, b) => a - b)).toEqual(counts)
    }
  })

  it('mixes levels without a level', () => {
    const seen = new Set<number>()
    for (let seed = 1; seed < 30; seed++) {
      for (const x of pickItems(undefined, rng(seed))) {
        for (const [lv, set] of Object.entries(LEVELS)) if (set.some((y) => y.formula === x.formula)) seen.add(Number(lv))
      }
    }
    expect(seen.size).toBe(Object.keys(LEVELS).length)
  })

  it('looks up names and scales the tolerance for big molecules', () => {
    expect(nameOf('H2SO4')).toBe('kyselina sírová')
    expect(toleranceFor(18)).toBe(0.5)
    expect(toleranceFor(891.5)).toBeCloseTo(0.89, 2)
    expect(checkMass('891', 'C57H110O6').kind).toBe('ok')
    expect(checkMass('19', 'H2O').kind).toBe('wrong')
  })
})
