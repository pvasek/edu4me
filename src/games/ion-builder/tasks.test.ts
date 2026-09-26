import { describe, expect, it } from 'vitest'
import { parseFormula } from '../../courses/chemie/data/formula'
import { GAME_BY_ID } from '../registry'
import { anion, cation } from '../shared/ions'
import { adjective, crossRule, salt } from '../shared/nomenclature'
import { ION_LEVELS, LEVELS, ROUND, buildTasks, pairKey, pairsFor } from './tasks'

const isMono = (f: string) => /^[A-Z][a-z]?$/.test(f)
const VARIABLE = new Set(['Fe', 'Cu', 'Cr', 'Mn', 'Pb', 'Sn', 'Co', 'Ni'])
const RARE_ANIONS = new Set(['MnO4', 'Cr2O7', 'CrO4', 'ClO3', 'S2O3', 'SiO3'])

describe('ion-builder levels', () => {
  it('match the registry', () => {
    expect(Object.keys(GAME_BY_ID['ion-builder'].levels).map(Number)).toEqual([...ION_LEVELS])
    expect(Object.keys(LEVELS).map(Number)).toEqual([...ION_LEVELS])
  })

  it.each(ION_LEVELS.map((l) => [l]))('level %i has enough unique compounds for several rounds', (l) => {
    const keys = LEVELS[l].map(pairKey)
    expect(new Set(keys).size).toBe(keys.length)
    expect(keys.length).toBeGreaterThanOrEqual(3 * ROUND)
  })

  it.each(ION_LEVELS.flatMap((l) => LEVELS[l].map((p) => [l, p.join(' '), p] as const)))(
    'L%i %s: formula and name agree with nomenclature.ts',
    (_, __, [cf, ch, af]) => {
      const c = cation(cf, ch)
      const a = anion(af)
      const s = salt(c, a)
      // the name uses the element's adjective for its oxidation number
      if (c.formula === c.element) expect(c.adj).toBe(adjective(cf, ch))
      expect(s.name).toBe(`${a.stem} ${c.adj}`)
      // electroneutral: counts from the cross rule, formula parses to them
      const [nC, nA] = crossRule(ch, a.charge)
      expect(nC * ch + nA * a.charge).toBe(0)
      const atoms = parseFormula(s.formula)
      const ionAtoms = (f: string, n: number) => Object.entries(parseFormula(f)).map(([el, k]) => [el, k * n] as const)
      const expected: Record<string, number> = {}
      for (const [el, k] of [...ionAtoms(c.formula, nC), ...ionAtoms(a.formula, nA)]) expected[el] = (expected[el] ?? 0) + k
      expect(atoms).toEqual(expected)
    },
  )

  it('level 3 uses monatomic ions and cations with a single usual charge only', () => {
    for (const [cf, , af] of LEVELS[3]) {
      expect(isMono(cf)).toBe(true)
      expect(isMono(af)).toBe(true)
      expect(VARIABLE.has(cf)).toBe(false)
    }
  })

  it('level 5 uses polyatomic ions without variable-charge metals or rare anions', () => {
    for (const [cf, , af] of LEVELS[5]) {
      expect(isMono(cf) && isMono(af), `${cf} ${af}`).toBe(false)
      expect(VARIABLE.has(cf)).toBe(false)
      expect(RARE_ANIONS.has(af)).toBe(false)
    }
  })

  it('level 7 always has a variable-charge metal or a less common anion, and covers all of them', () => {
    for (const [cf, , af] of LEVELS[7]) expect(VARIABLE.has(cf) || RARE_ANIONS.has(af), `${cf} ${af}`).toBe(true)
    const ions = new Set(LEVELS[7].flatMap(([cf, ch, af]) => [`${cf}${ch}`, af]))
    for (const x of ['Fe2', 'Fe3', 'Cu1', 'Cu2', 'Cr3', 'Mn2', 'Pb2', 'Pb4', 'Sn2', 'Sn4', ...RARE_ANIONS]) expect(ions.has(x), x).toBe(true)
  })
})

describe('buildTasks', () => {
  it.each(ION_LEVELS.map((l) => [l]))('level %i: a full round of unique tasks from that level, decoys too', (l) => {
    const pool = LEVELS[l]
    const cats = new Set(pool.map(([c, ch]) => `${c}${ch}`))
    const ans = new Set(pool.map(([, , a]) => a))
    for (let i = 0; i < 40; i++) {
      const tasks = buildTasks(l)
      expect(tasks.length).toBe(ROUND)
      expect(new Set(tasks.map((t) => t.formula)).size).toBe(ROUND)
      for (const t of tasks) {
        expect(pool.map(pairKey)).toContain(`${t.cation.formula}${t.cation.charge}${t.anion.formula}`)
        for (const c of t.trayCations) expect(cats.has(`${c.formula}${c.charge}`)).toBe(true)
        for (const a of t.trayAnions) expect(ans.has(a.formula)).toBe(true)
        expect(t.trayCations).toContain(t.cation)
        expect(t.trayAnions).toContain(t.anion)
        if (t.mode === 'name') {
          expect(t.trayCations.length).toBe(2)
          expect(t.trayAnions.length).toBe(2)
        }
      }
    }
  })

  it('free play and unsupported levels mix all levels', () => {
    const all = new Set(ION_LEVELS.flatMap((l) => LEVELS[l].map(pairKey)))
    expect(new Set(pairsFor(undefined).map(pairKey))).toEqual(all)
    expect(pairsFor(4)).toEqual(pairsFor(undefined))
    expect(buildTasks(undefined).length).toBe(ROUND)
  })
})
