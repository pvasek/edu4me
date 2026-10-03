import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS } from './levels'
import {
  OPTIONS,
  REVERSE_AT,
  ROUND,
  coupletsOf,
  leavesOf,
  makeRound,
  pathOf,
  playedLevel,
  reverseTask,
  separates,
  separatingTrait,
  walkPoints,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const sets = Object.values(LEVELS)

describe('id-key data', () => {
  it('has a key for every level the registry lists', () => {
    const listed = Object.keys(GAME_BY_ID['id-key'].courses.biologie ?? {}).map(Number)
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(listed)
  })

  for (const set of sets) {
    describe(`level ${set.level}`, () => {
      it('has unique ids, Czech and Latin names', () => {
        const ids = set.organisms.map((o) => o.id)
        expect(new Set(ids).size).toBe(ids.length)
        expect(new Set(set.traits.map((t) => t.id)).size).toBe(set.traits.length)
        for (const o of set.organisms) {
          expect(o.name).toMatch(/\S/)
          expect(o.latin).toMatch(/^[A-Z][a-z]+( [a-z-]+)*$/)
          expect(o.look.length).toBeGreaterThanOrEqual(2)
          for (const id of Object.keys(o.t)) expect(set.traits.some((t) => t.id === id), `${o.id}.${id}`).toBe(true)
        }
      })

      it('every organism is a leaf exactly once and every leaf is an organism', () => {
        const leaves = leavesOf(set.key)
        expect([...leaves].sort()).toEqual(set.organisms.map((o) => o.id).sort())
      })

      it('the key leads every organism to itself', () => {
        for (const o of set.organisms) expect(pathOf(set, o.id).leaf).toBe(o.id)
      })

      it('uses every trait in the key and numbers couplets 1..n', () => {
        const used = new Set(coupletsOf(set.key).map((n) => n.t))
        for (const t of set.traits) expect(used.has(t.id), t.id).toBe(true)
        const nums = pathOf(set, set.organisms[0].id).steps.map((s) => s.couplet.n)
        expect(nums[0]).toBe(1)
      })

      it('most couplets can make a reverse task, always with a unique right answer', () => {
        const nodes = coupletsOf(set.key)
        let usable = 0
        for (const node of nodes) {
          let ok = 0
          for (let s = 1; s <= 30; s++) {
            const t = reverseTask(set, node, rng(s))
            if (!t) continue
            ok++
            expect(t.options).toHaveLength(OPTIONS)
            expect(new Set(t.options).size).toBe(OPTIONS)
            expect(t.options.filter((id) => separates(set, id, t.a, t.b))).toEqual([t.answer])
            expect(t.answer).toBe(separatingTrait(set, t.a.id, t.b.id))
          }
          if (ok) usable++
        }
        expect(usable / nodes.length).toBeGreaterThanOrEqual(0.75)
      })
    })
  }
})

describe('id-key rounds', () => {
  it('plays the level of the lesson, or mixes in free play', () => {
    expect(playedLevel('l3')).toBe(3)
    expect(playedLevel('l9')).toBeUndefined()
    expect(playedLevel(undefined)).toBeUndefined()
  })

  for (const level of [...Object.keys(LEVELS).map(Number), undefined]) {
    it(`level ${level ?? 'mix'}: ${ROUND} tasks, reverse at fixed places, no duplicates`, () => {
      for (let s = 1; s <= 40; s++) {
        const r = makeRound(level, rng(s))
        expect(r).toHaveLength(ROUND)
        expect(new Set(r.map((t) => t.key)).size).toBe(ROUND)
        r.forEach((t, i) => expect(t.kind).toBe(REVERSE_AT.includes(i) ? 'reverse' : 'walk'))
        if (level !== undefined) expect(r.every((t) => t.level === level)).toBe(true)
        else expect(new Set(r.map((t) => t.level)).size).toBe(Object.keys(LEVELS).length)
        for (const t of r) if (t.kind === 'walk') expect(t.steps.length).toBeGreaterThan(0)
      }
    })
  }

  it('scores a walk by steps answered right first time', () => {
    expect(walkPoints(4, 0, 25)).toBe(125)
    expect(walkPoints(4, 1, 25)).toBe(75)
    expect(walkPoints(3, 3, 25)).toBe(0)
  })
})
