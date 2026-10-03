import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { ECOSYSTEMS, LEVELS, SPECIES } from './levels'
import {
  ROUND,
  biomassNeeded,
  chainLinks,
  chainsOf,
  checkNumber,
  cz,
  eats,
  energyAt,
  isChain,
  makeRound,
  orderOf,
  playedLevel,
  removalCases,
  webOf,
  type NumberTask,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('food-web data', () => {
  it('has a content set for every level the registry lists', () => {
    const listed = Object.keys(GAME_BY_ID['food-web'].courses.biologie ?? {}).map(Number)
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(listed)
  })

  it('species have Czech and Latin names and unique short names', () => {
    const shorts = Object.values(SPECIES).map((s) => s.short)
    expect(new Set(shorts).size).toBe(shorts.length)
    for (const s of Object.values(SPECIES)) {
      expect(s.latin).toMatch(/^[A-Z][a-z]+ [a-z-]+$/)
      expect(s.name).toMatch(/\S/)
    }
  })

  for (const eco of Object.values(ECOSYSTEMS)) {
    it(`${eco.id}: no duplicate links, no cycles, every species used`, () => {
      const keys = eco.eats.map(([a, b]) => `${a}>${b}`)
      expect(new Set(keys).size).toBe(keys.length)
      const w = webOf(eco.id) // throws on unknown species or cycles
      expect(w.ids.some((id) => w.height.get(id) === 0)).toBe(true)
      for (const [f, e] of eco.eats) expect(w.height.get(e)!).toBeGreaterThan(w.height.get(f)!)
    })

    it(`${eco.id}: every chain is a valid chain`, () => {
      const w = webOf(eco.id)
      for (const c of chainsOf(w)) {
        expect(isChain(w, c)).toBe(true)
        expect(chainLinks(eco.id, c).every(Boolean)).toBe(true)
      }
    })
  }
})

describe('food-web logic', () => {
  it('computes trophic order only when it is clear-cut', () => {
    const les = webOf('les')
    expect(orderOf(les, 'dub')).toBe(0)
    expect(orderOf(les, 'mysice')).toBe(1)
    expect(orderOf(les, 'sykora')).toBe(2)
    expect(orderOf(les, 'krahujec')).toBe(3)
    expect(orderOf(webOf('hory'), 'prase')).toBeUndefined() // omnivore: beech nuts and mice
  })

  it('predicts the consequences of removing a species', () => {
    const r = webOf('rybnik')
    const stika = removalCases(r, 'stika')
    expect(stika).toContainEqual(expect.objectContaining({ target: 'plotice', change: 'up' }))
    const okrehek = removalCases(r, 'okrehek')
    expect(okrehek).toContainEqual(expect.objectContaining({ target: 'kachna', change: 'down', kind: 'starve' }))
    // otter eats pike and roach: roach is not a clear "up" (pike also rises)
    expect(removalCases(r, 'vydra').find((c) => c.target === 'plotice')).toBeUndefined()
    // wolf gone → more deer → fewer firs (trophic cascade)
    const vlk = removalCases(webOf('hory'), 'vlk')
    expect(vlk).toContainEqual(expect.objectContaining({ target: 'jedle', change: 'down', kind: 'cascade' }))
    expect(vlk.find((c) => c.target === 'buk')).toBeUndefined() // mice eat beech too and do not rise
  })

  it('removal cases are consistent with the arrows', () => {
    for (const eco of Object.keys(ECOSYSTEMS)) {
      const w = webOf(eco)
      for (const x of w.ids)
        for (const c of removalCases(w, x)) {
          if (c.kind === 'prey') expect(eats(w, c.target, x)).toBe(true)
          if (c.kind === 'starve') expect(w.foods.get(c.target)).toEqual([x])
          if (c.kind === 'cascade') expect(w.eaters.get(c.target)!.every((z) => eats(w, z, x))).toBe(true)
        }
    }
  })

  it('energy and biomass follow the 10 % rule', () => {
    expect(energyAt(10_000, 3)).toBeCloseTo(10)
    expect(energyAt(50_000, 2, 15)).toBeCloseTo(1125)
    expect(biomassNeeded(2)).toBeCloseTo(100)
    expect(cz(1_000_000)).toBe('1 000 000')
    expect(cz(0.5)).toBe('0,5')
  })

  it('checks numbers with tolerance', () => {
    const t = { kind: 'efficiency', value: 8, tol: 0.5 } as NumberTask
    expect(checkNumber('8', t).kind).toBe('ok')
    expect(checkNumber('8,4 %', t).kind).toBe('ok')
    expect(checkNumber('9', t).kind).toBe('wrong')
    expect(checkNumber('abc', t).kind).toBe('invalid')
  })
})

describe('food-web rounds', () => {
  it('plays the level of the lesson, or mixes in free play', () => {
    expect(playedLevel('l8')).toBe(8)
    expect(playedLevel('l3')).toBeUndefined()
  })

  for (const level of [...Object.keys(LEVELS).map(Number), undefined]) {
    it(`level ${level ?? 'mix'}: ${ROUND} valid tasks, no duplicates`, () => {
      for (let s = 1; s <= 60; s++) {
        const r = makeRound(level, rng(s))
        expect(r).toHaveLength(ROUND)
        expect(new Set(r.map((t) => t.key)).size).toBe(ROUND)
        if (level !== undefined) {
          expect(r.every((t) => t.level === level)).toBe(true)
          expect(r.map((t) => t.kind)).toEqual(LEVELS[level].plan)
        } else expect(new Set(r.map((t) => t.level)).size).toBe(Object.keys(LEVELS).length)
        for (const t of r) {
          const w = webOf(t.eco)
          if (t.kind === 'chain') {
            expect(isChain(w, t.answer)).toBe(true)
            expect([...t.pool].sort()).toEqual([...t.answer].sort())
            if (t.level === 5) expect(SPECIES[t.answer[t.answer.length - 1]].vertebrate).toBe(true)
          } else if ('options' in t) {
            const ids = t.options.map((o) => o.id)
            expect(new Set(ids).size).toBe(ids.length)
            expect(ids).toContain(t.answer)
            if (t.kind === 'food') {
              const x = t.focus[0]
              expect(ids.filter((id) => eats(w, id, x))).toEqual([t.answer])
            }
            if (t.kind === 'eater') {
              const x = t.focus[0]
              expect(ids.filter((id) => eats(w, x, id))).toEqual([t.answer])
              if (t.level === 5) expect(SPECIES[t.answer].vertebrate).toBe(true)
            }
            if (t.kind === 'order') {
              const n = Number(/(\d)\. řádu/.exec(t.text)![1])
              expect(ids.filter((id) => orderOf(w, id) === n)).toEqual([t.answer])
            }
            if (t.kind === 'removal') {
              const c = removalCases(w, t.removed!).find((x) => x.target === t.target)!
              expect(c.change).toBe(t.answer)
              if (t.level < 12) expect(c.kind).not.toBe('cascade')
            }
          } else {
            expect(Number.isFinite(t.value)).toBe(true)
            expect(t.value).toBeGreaterThan(0)
          }
        }
      }
    })
  }
})
