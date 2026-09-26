import { describe, expect, it } from 'vitest'
import { EQUATIONS, gcdAll, isBalanced, pickEquations, tally } from './equations'
import { parseFormula } from '../../courses/chemie/data/formula'

/** Rank of an integer matrix (Gaussian elimination with fractions as floats is fine for these sizes). */
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

describe('equation pool', () => {
  it('has at least 30 equations with unique ids', () => {
    expect(EQUATIONS.length).toBeGreaterThanOrEqual(30)
    expect(new Set(EQUATIONS.map((e) => e.id)).size).toBe(EQUATIONS.length)
  })

  it.each(EQUATIONS.map((e) => [e.id, e] as const))('%s is balanced with its stated coefficients', (_, e) => {
    expect(e.coefs.length).toBe(e.reactants.length + e.products.length)
    expect(isBalanced(e, e.coefs)).toBe(true)
    expect(gcdAll(e.coefs)).toBe(1)
    expect(e.coefs.every((c) => Number.isInteger(c) && c >= 1)).toBe(true)
  })

  it.each(EQUATIONS.map((e) => [e.id, e] as const))('%s has a unique solution and is not trivially balanced', (_, e) => {
    const species = [...e.reactants, ...e.products]
    const els = Object.keys(tally(e, e.coefs))
    const matrix = els.map((el) =>
      species.map((f, i) => (parseFormula(f)[el] ?? 0) * (i < e.reactants.length ? 1 : -1)),
    )
    // nullity 1 -> the minimal coefficients are unique
    expect(rank(matrix)).toBe(species.length - 1)
    // starting position (all 1) must not already be balanced
    expect(isBalanced(e, species.map(() => 1))).toBe(false)
  })

  it('has enough equations for every slot', () => {
    for (const level of [4, 5, 6, 7, 9]) {
      for (let i = 0; i < 20; i++) expect(pickEquations(level).length).toBe(6)
    }
    expect(pickEquations(4).some((e) => e.redox)).toBe(false)
    expect(pickEquations(6).filter((e) => e.redox).length).toBe(2)
  })
})
