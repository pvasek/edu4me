import { describe, expect, it } from 'vitest'
import { parseFormula } from '../../courses/chemie/data/formula'
import { buildQuestions, pool, weightsFor } from './questions'

describe('naming question pool', () => {
  const all = Object.values(pool()).flat()

  it('every formula parses', () => {
    for (const it of all) expect(() => parseFormula(it.formula), it.formula).not.toThrow()
  })

  it('multiple-choice items have 3 distinct wrong names, none equal to the right one', () => {
    for (const it of all) {
      if (it.only === 'toFormula') continue
      expect(it.wrong.length, it.name).toBeGreaterThanOrEqual(3)
      expect(new Set(it.wrong.slice(0, 3)).size).toBe(3)
      expect(it.wrong).not.toContain(it.name)
    }
  })

  it('a wrong name is never the right name of the same formula elsewhere', () => {
    const namesByFormula = new Map<string, Set<string>>()
    for (const it of all) {
      const k = it.display ?? it.formula
      namesByFormula.set(k, (namesByFormula.get(k) ?? new Set()).add(it.name))
    }
    for (const it of all) for (const w of it.wrong) expect(namesByFormula.get(it.display ?? it.formula)!.has(w)).toBe(false)
  })

  it('builds 10 unique questions for each level', () => {
    for (const level of [3, 4, 5, 6, 7, 9]) {
      for (let i = 0; i < 30; i++) {
        const qs = buildQuestions(level)
        expect(qs.length).toBe(10)
        expect(new Set(qs.map((q) => q.item.formula + q.item.name)).size).toBe(10)
        const allowed = Object.keys(weightsFor(level))
        for (const q of qs) {
          expect(allowed).toContain(q.item.cat)
          if (q.dir === 'toName') {
            expect(q.options.length).toBe(4)
            expect(q.options).toContain(q.item.name)
          }
          if (q.item.only) expect(q.dir).toBe(q.item.only)
        }
      }
    }
  })

  it('level 3 is binary compounds only', () => {
    expect(Object.keys(weightsFor(3)).sort()).toEqual(['halide', 'hydride', 'oxide', 'sulfide'])
  })
})
