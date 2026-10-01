import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS, ROUND, makeRound, type Task } from './levels'
import { applyChange, arrangements, brightest, checkGoal, effectOn, fill, lampIds, reading, solve } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Re-derives the answer of a task from the solver (never trusts stored numbers blindly). */
function verify(t: Task) {
  switch (t.kind) {
    case 'meter': {
      expect(Number.isFinite(t.answer), t.key).toBe(true)
      expect(t.answer, t.key).toBeGreaterThan(0)
      if (t.unit === 'A' && !t.given) {
        const s = solve(t.circuit)
        const I = t.symbol === 'I' || t.symbol === 'I_{k}' ? reading(t.circuit, s, 'A') : t.answer
        expect(t.answer, t.key).toBeCloseTo(I, 9)
      }
      if (t.level === 6) expect(Math.abs(t.answer * 100 - Math.round(t.answer * 100)), t.key).toBeLessThan(1e-6)
      break
    }
    case 'bright':
      expect(t.answer, t.key).toBe(brightest(t.circuit))
      expect(t.options).toContain(t.answer)
      expect(t.options).toHaveLength(lampIds(t.circuit.net).length + 1)
      break
    case 'change':
      expect(t.answer, t.key).toBe(effectOn(t.circuit, t.change, t.target))
      expect(solve(applyChange(t.circuit, t.change))).toBeTruthy()
      break
    case 'build': {
      expect(checkGoal(fill(t.circuit, t.solution), t.goal).ok, t.key).toBe(true)
      const all = arrangements(t.circuit, t.pieces, t.goal)
      expect(all.some((x) => !x.ok), t.key).toBe(true)
      break
    }
  }
  expect(t.explain.length, t.key).toBeGreaterThan(20)
  expect(t.explain).not.toMatch(/NaN|undefined|Infinity/)
  expect(t.prompt).not.toMatch(/NaN|undefined/)
}

describe('circuit-builder levels', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(
      Object.keys(GAME_BY_ID['circuit-builder'].courses.fyzika!)
        .map(Number)
        .sort(),
    )
  })

  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`L${lv}: plan sums to a round`, () => {
      expect(Object.values(set.plan).reduce((a, b) => a + b, 0)).toBe(ROUND)
    })
    for (const kind of ['meter', 'bright', 'change', 'build'] as const) {
      for (const [name, gen] of Object.entries(set[kind])) {
        it(`L${lv} ${kind}/${name}: generates valid tasks`, () => {
          const r = rng(name.length * 97 + Number(lv))
          let made = 0
          for (let i = 0; i < 300 && made < 15; i++) {
            const t = gen(r)
            if (!t) continue
            made++
            expect(t.kind).toBe(kind)
            expect(t.level).toBe(Number(lv))
            verify(t)
          }
          expect(made, name).toBeGreaterThan(0)
        })
      }
    }
  }

  for (const level of [6, 11, undefined]) {
    it(`round for ${level ?? 'mix'}: ${ROUND} tasks, unique keys, valid, meter first, no two builds in a row`, () => {
      for (let seed = 1; seed < 40; seed++) {
        const round = makeRound(level, rng(seed))
        expect(round).toHaveLength(ROUND)
        expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
        expect(round[0].kind).toBe('meter')
        for (let k = 1; k < round.length; k++) expect(round[k].kind === 'build' && round[k - 1].kind === 'build').toBe(false)
        if (level) expect(round.every((t) => t.level === level)).toBe(true)
        else expect(new Set(round.map((t) => t.level)).size).toBe(2)
        round.forEach(verify)
      }
    })
  }
})
