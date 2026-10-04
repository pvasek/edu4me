import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { POPULATIONS, POP_BY_ID } from './data'
import { COHORTS, FUTURE, LEVELS, MIGRANTS, WARS } from './levels'
import { ROUND, checkNumber, cohortGroup, makeRound, playedLevel, sexRatio, stageOf, statsOf, typeOf, type NumberTask } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const pop = (id: string) => POP_BY_ID[id]

describe('pop-pyramid data', () => {
  it('has a content set for every level the registry lists', () => {
    const listed = Object.keys(GAME_BY_ID['pop-pyramid'].courses.zemepis ?? {}).map(Number)
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(listed)
  })

  it('every population has 18 groups whose shares add up to 100 %', () => {
    expect(new Set(POPULATIONS.map((p) => p.id)).size).toBe(POPULATIONS.length)
    for (const p of POPULATIONS) {
      expect(p.male).toHaveLength(18)
      expect(p.female).toHaveLength(18)
      const sum = [...p.male, ...p.female].reduce((a, v) => a + v, 0)
      expect(Math.abs(sum - 100), p.id).toBeLessThan(0.1)
      expect(p.total).toBeGreaterThan(1000)
      expect(Boolean(p.projection)).toBe(p.year > 2023)
    }
  })

  it('agrees with well-known facts (WPP 2024)', () => {
    expect(statsOf(pop('cze-2023')).old).toBeGreaterThan(statsOf(pop('cze-2023')).young)
    expect(statsOf(pop('ner-2023')).young).toBeGreaterThan(45)
    expect(statsOf(pop('jpn-2023')).old).toBeGreaterThan(28)
    expect(pop('cze-2023').total).toBeGreaterThan(10500)
    expect(pop('cze-2023').total).toBeLessThan(11000)
  })

  it('strong generations stick out, weak ones are dents', () => {
    for (const c of COHORTS) {
      const p = pop(c.pop)
      const g = cohortGroup(p, c.from, c.to)
      expect(g, `${c.pop} ${c.from}`).toBeDefined()
      const t = p.male.map((m, i) => m + p.female[i])
      if (c.strength === 'strong') expect(t[g!] > t[g! - 1] && t[g!] > t[g! + 1], `${c.pop} ${c.from}`).toBe(true)
      else expect(t[g!] < t[g! - 1] && t[g!] < t[g! + 1], `${c.pop} ${c.from}`).toBe(true)
    }
  })

  it('war losses and immigrant workers show in the sex ratio', () => {
    for (const w of WARS) expect(Math.min(...[5, 6, 7, 8, 9, 10, 11].map((g) => sexRatio(pop(w.pop), g)))).toBeLessThan(70)
    for (const id of MIGRANTS) expect(sexRatio(pop(id), 6)).toBeGreaterThan(200)
    for (const id of FUTURE) expect(pop(id.replace('2023', '2043'))).toBeDefined()
  })
})

describe('pop-pyramid logic', () => {
  it('classifies the textbook shapes', () => {
    expect(typeOf(pop('ner-2023'))).toBe('progresivni')
    expect(typeOf(pop('nga-2023'))).toBe('progresivni')
    expect(typeOf(pop('ind-2023'))).toBe('stacionarni')
    expect(typeOf(pop('fra-2023'))).toBe('stacionarni')
    expect(typeOf(pop('cze-2023'))).toBe('regresivni')
    expect(typeOf(pop('jpn-2023'))).toBe('regresivni')
    expect(typeOf(pop('ita-2023'))).toBe('regresivni')
  })

  it('finds the stage of the demographic transition from the rates', () => {
    expect(stageOf(pop('ner-2023'))).toBe(2)
    expect(stageOf(pop('ind-2023'))).toBe(3)
    expect(stageOf(pop('bra-2023'))).toBe(4)
    expect(stageOf(pop('cze-2023'))).toBe(5)
    expect(stageOf(pop('jpn-2023'))).toBe(5)
    expect(stageOf(pop('fra-2023'))).toBeUndefined() // births and deaths too close
  })

  it('computes the dependency ratio', () => {
    const s = statsOf(pop('cze-2023'))
    expect(s.dependency).toBeCloseTo(((s.young + s.old) / s.work) * 100, 0)
    expect(statsOf(pop('ner-2023')).dependency).toBeGreaterThan(statsOf(pop('cze-2023')).dependency)
  })

  it('accepts a decimal comma and a unit', () => {
    const t = { mode: 'number', value: 57.1, tol: 1.5, unit: 'na 100', digits: 1 } as NumberTask
    expect(checkNumber('57,1', t).kind).toBe('ok')
    expect(checkNumber('56 na 100', t).kind).toBe('ok')
    expect(checkNumber('60', t).kind).toBe('wrong')
    expect(checkNumber('?', t).kind).toBe('invalid')
  })

  for (const lv of [...Object.keys(LEVELS).map(Number), undefined]) {
    it(`level ${lv ?? 'mix'}: every round has ${ROUND} valid tasks without duplicates`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const tasks = makeRound(lv, rng(seed))
        expect(tasks.length).toBeGreaterThanOrEqual(8)
        expect(tasks.length).toBeLessThanOrEqual(12)
        expect(new Set(tasks.map((t) => t.key)).size).toBe(tasks.length)
        const ids = tasks.flatMap((t) => t.pops)
        expect(new Set(ids).size).toBe(ids.length)
        for (const t of tasks) {
          if (lv !== undefined) expect(t.level).toBe(lv)
          for (const id of [...t.pops, ...(t.after ?? [])]) expect(pop(id)).toBeDefined()
          expect(t.why).not.toMatch(/NaN|undefined/)
          expect(t.text).not.toMatch(/NaN|undefined/)
          if (t.mode === 'choice') {
            expect(t.options.map((o) => o.id)).toContain(t.answer)
            expect(new Set(t.options.map((o) => o.id)).size).toBe(t.options.length)
            expect(new Set(t.options.map((o) => o.label)).size).toBe(t.options.length)
          } else expect(Number.isFinite(t.value)).toBe(true)
        }
      }
    }, 30000)
  }

  it('plays the level of the lesson, or mixes in free play', () => {
    expect(playedLevel('l11')).toBe(11)
    expect(playedLevel('l4')).toBeUndefined()
  })
})
