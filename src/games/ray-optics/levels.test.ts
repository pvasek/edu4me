import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS, ROUND, makeRound, type Task } from './levels'
import { bendOf, dioptres, focalFrom, imageOf, imagePoint, propsOf } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function verify(t: Task) {
  expect(t.explain).not.toMatch(/NaN|undefined|Infinity|null/)
  expect(t.prompt).not.toMatch(/NaN|undefined|Infinity|null/)
  switch (t.kind) {
    case 'locate':
      expect(imagePoint(t.scene), t.key).not.toBeNull()
      break
    case 'props':
      expect(t.answer).toEqual(propsOf(imageOf(t.scene.f, t.scene.a)))
      break
    case 'calc': {
      const { ap, Z } = imageOf(t.scene.f, t.scene.a)
      const want = { ap, Z, f: focalFrom(t.scene.a, ap!), phi: dioptres(t.scene.f) }[t.ask]!
      expect(t.answer, t.key).toBeCloseTo(want, 9)
      expect(Number.isFinite(t.answer)).toBe(true)
      if (t.ask === 'f') expect(t.answer).toBeCloseTo(t.scene.f, 9)
      break
    }
    case 'reflect':
      expect(t.alpha).toBeGreaterThanOrEqual(15)
      expect(t.alpha).toBeLessThanOrEqual(75)
      break
    case 'refract':
      expect(t.answer).toBe(bendOf(t.m1.n, t.m2.n, t.alpha))
      break
  }
}

describe('ray-optics levels', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(
      Object.keys(GAME_BY_ID['ray-optics'].courses.fyzika!)
        .map(Number)
        .sort(),
    )
  })
  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`L${lv}: plan sums to a round, generators give valid tasks`, () => {
      expect(Object.values(set.plan).reduce((a, b) => a + b, 0)).toBe(ROUND)
      const r = rng(Number(lv))
      for (const [name, gen] of Object.entries(set.gens)) {
        for (let i = 0; i < 40; i++) {
          const t = gen!(r)
          expect(t.level, name).toBe(Number(lv))
          verify(t)
        }
      }
    })
  }
  it('level 5 covers every image case incl. object in the focus, and every refraction outcome', () => {
    const seen = new Set<string>()
    const bends = new Set<string>()
    for (let seed = 1; seed < 80; seed++)
      for (const t of makeRound(5, rng(seed))) {
        if (t.kind === 'props') seen.add(t.answer ? `${t.answer.real}-${t.answer.size}` : 'none')
        if (t.kind === 'refract') bends.add(t.answer)
      }
    expect(seen).toContain('none')
    expect(seen).toContain('true-stejně velký')
    expect(seen).toContain('false-zvětšený')
    expect(seen).toContain('false-zmenšený')
    expect(bends).toEqual(new Set(['toward', 'away', 'total', 'straight']))
  })
  for (const level of [5, 12, undefined]) {
    it(`round for ${level ?? 'mix'}: ${ROUND} unique valid tasks`, () => {
      for (let seed = 1; seed < 40; seed++) {
        const round = makeRound(level, rng(seed))
        expect(round).toHaveLength(ROUND)
        expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
        if (level) expect(round.every((t) => t.level === level)).toBe(true)
        else expect(new Set(round.map((t) => t.level)).size).toBe(2)
        round.forEach(verify)
      }
    })
  }
})
