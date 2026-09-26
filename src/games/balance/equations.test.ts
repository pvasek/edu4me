import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import {
  ALL_EQUATIONS,
  BALANCE_LEVELS,
  LEVELS,
  MAX_COEF,
  ROUND,
  atoms,
  difficulty,
  gcdAll,
  isBalanced,
  pickEquations,
  poolFor,
  tally,
} from './equations'

/** Rank of an integer matrix (Gaussian elimination; floats are fine for these sizes). */
function rank(m: number[][]): number {
  const a = m.map((r) => [...r])
  let r = 0
  const cols = a[0]?.length ?? 0
  for (let c = 0; c < cols && r < a.length; c++) {
    let p = r
    while (p < a.length && Math.abs(a[p][c]) < 1e-9) p++
    if (p === a.length) continue
    ;[a[r], a[p]] = [a[p], a[r]]
    for (let i = 0; i < a.length; i++) {
      if (i === r) continue
      const f = a[i][c] / a[r][c]
      for (let j = c; j < cols; j++) a[i][j] -= f * a[r][j]
    }
    r++
  }
  return r
}

describe('equation levels', () => {
  it('match the levels in the registry', () => {
    expect(Object.keys(GAME_BY_ID.balance.levels).map(Number)).toEqual([...BALANCE_LEVELS])
    expect(Object.keys(LEVELS).map(Number)).toEqual([...BALANCE_LEVELS])
  })

  it.each(BALANCE_LEVELS.map((l) => [l]))('level %i has at least 12 equations', (l) => {
    expect(LEVELS[l].length).toBeGreaterThanOrEqual(12)
  })

  it('ids are unique and every equation appears in one level only', () => {
    expect(new Set(ALL_EQUATIONS.map((e) => e.id)).size).toBe(ALL_EQUATIONS.length)
    const side = (fs: string[]) => fs.map((f) => JSON.stringify(atoms(f))).sort().join(' + ')
    const key = (e: (typeof ALL_EQUATIONS)[number]) => `${side(e.reactants)} -> ${side(e.products)}`
    const keys = ALL_EQUATIONS.map(key)
    const dup = keys.filter((k, i) => keys.indexOf(k) !== i)
    expect(dup).toEqual([])
  })

  it('every equation has a short Czech caption', () => {
    for (const e of ALL_EQUATIONS) {
      expect(e.caption.length, e.id).toBeGreaterThan(8)
      expect(e.caption.length, e.id).toBeLessThanOrEqual(80)
    }
  })

  it('level 6 is all redox, other levels are not marked redox', () => {
    expect(LEVELS[6].every((e) => e.redox)).toBe(true)
    for (const l of [4, 5, 7, 8, 9]) expect(LEVELS[l].some((e) => e.redox)).toBe(false)
  })
})

describe.each(BALANCE_LEVELS.map((l) => [l]))('level %i equations', (l) => {
  const list = LEVELS[l].map((e) => [e.id, e] as const)

  it.each(list)('%s balances with its minimal coefficients', (_, e) => {
    expect(e.coefs.length).toBe(e.reactants.length + e.products.length)
    expect(isBalanced(e, e.coefs)).toBe(true)
    expect(gcdAll(e.coefs)).toBe(1)
    expect(e.coefs.every((c) => Number.isInteger(c) && c >= 1 && c <= MAX_COEF)).toBe(true)
  })

  it.each(list)('%s has a unique solution and is not balanced at the start', (_, e) => {
    const species = [...e.reactants, ...e.products]
    const els = Object.keys(tally(e, e.coefs))
    const matrix = els.map((el) => species.map((f, i) => (atoms(f)[el] ?? 0) * (i < e.reactants.length ? 1 : -1)))
    // nullity 1 -> the minimal coefficients are the only solution
    expect(rank(matrix)).toBe(species.length - 1)
    expect(isBalanced(e, species.map(() => 1))).toBe(false)
  })
})

describe('pickEquations', () => {
  it('picks a full round from the chosen level only, easy first', () => {
    for (const l of BALANCE_LEVELS) {
      for (let i = 0; i < 20; i++) {
        const got = pickEquations(l)
        expect(got.length).toBe(ROUND)
        expect(new Set(got.map((e) => e.id)).size).toBe(ROUND)
        for (const e of got) expect(LEVELS[l]).toContain(e)
        const d = got.map(difficulty)
        expect([...d].sort()).toEqual(d)
      }
    }
  })

  it('free play and unsupported levels mix all levels', () => {
    expect(poolFor(undefined)).toBe(ALL_EQUATIONS)
    expect(poolFor(2)).toBe(ALL_EQUATIONS)
    const seen = new Set<number>()
    for (let i = 0; i < 60; i++) {
      for (const e of pickEquations(undefined)) seen.add(BALANCE_LEVELS.find((l) => LEVELS[l].includes(e))!)
    }
    expect(seen.size).toBe(BALANCE_LEVELS.length)
  })
})
