import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { boardReady, gradeBoard } from '../cell-builder/board'
import { DRAWN, drawingOf } from './Body'
import { LEVELS, MATCH_SETS, MIN_GAP, ORGANS, PATHS, PLACE_SETS, type OrganId } from './levels'
import { answersOf, makeRound, playedLevel, type Task } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const gap = (a: OrganId, b: OrganId) => Math.hypot(ORGANS[a].at[0] - ORGANS[b].at[0], ORGANS[a].at[1] - ORGANS[b].at[1])
const roundSize = (lv: number) => Object.values(LEVELS[lv].mix).reduce((a, b) => a + b, 0)

describe('body-map anatomy', () => {
  it('draws every organ it asks about', () => {
    for (const o of Object.values(ORGANS)) expect(DRAWN.has(drawingOf(o.id)), o.id).toBe(true)
  })

  it('keeps the front view: the right side of the body is on the viewer’s left', () => {
    const x = (id: OrganId) => ORGANS[id].at[0]
    expect(x('jatra')).toBeLessThan(160) // liver: right side
    expect(x('zlucnik')).toBeLessThan(160)
    expect(x('zaludek')).toBeGreaterThan(160) // stomach: left side
    expect(x('slezina')).toBeGreaterThan(160) // spleen: left side
    expect(x('srdce')).toBeGreaterThan(160) // heart apex to the left
    expect(x('tluste_strevo')).toBeLessThan(160) // ascending colon on the right
  })

  it('keeps organs at sensible heights', () => {
    const y = (id: OrganId) => ORGANS[id].at[1]
    expect(y('mozek')).toBeLessThan(y('hypofyza'))
    expect(y('hrtan')).toBeLessThan(y('prudusnice'))
    expect(y('stitna')).toBeLessThan(y('brzlik'))
    expect(y('srdce')).toBeLessThan(y('branice') + 1)
    expect(y('branice')).toBeLessThan(y('jatra'))
    expect(y('branice')).toBeLessThan(y('zaludek'))
    expect(y('nadledviny')).toBeLessThan(y('ledviny'))
    expect(y('ledviny')).toBeLessThan(y('mocovod'))
    expect(y('mocovod')).toBeLessThan(y('mocovy_mechyr'))
    expect(y('mocovy_mechyr')).toBeLessThan(y('mocova_trubice'))
    expect(y('panev')).toBeLessThan(y('stehenni_kost'))
  })

  it('never puts two markers of a place set on top of each other', () => {
    for (const set of Object.values(PLACE_SETS)) {
      for (let a = 0; a < set.organs.length; a++)
        for (let b = a + 1; b < set.organs.length; b++)
          expect(gap(set.organs[a], set.organs[b]), `${set.id}: ${set.organs[a]} × ${set.organs[b]}`).toBeGreaterThanOrEqual(MIN_GAP)
      expect(set.organs.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('has unique cards in every match set and path', () => {
    for (const m of Object.values(MATCH_SETS)) {
      const texts = m.pairs.map((p) => p.text)
      expect(new Set(texts).size, m.id).toBe(texts.length)
      expect(new Set(m.pairs.map((p) => p.organ)).size).toBeGreaterThanOrEqual(m.n)
    }
    for (const p of Object.values(PATHS)) {
      const texts = [...p.steps.map((s) => s.text), ...(p.extra ? [p.extra.text] : [])]
      expect(new Set(texts).size, p.id).toBe(texts.length)
      expect(p.steps.length).toBeGreaterThanOrEqual(4)
      expect(p.steps.length).toBeLessThanOrEqual(7)
    }
  })

  it('follows the real order on the paths', () => {
    const txt = (id: string) => PATHS[id].steps.map((s) => s.text)
    expect(txt('air').indexOf('hrtan')).toBeLessThan(txt('air').indexOf('průdušnice'))
    expect(txt('food').indexOf('jícen')).toBeLessThan(txt('food').indexOf('žaludek'))
    expect(txt('food').indexOf('tenké střevo')).toBeLessThan(txt('food').indexOf('tlusté střevo'))
    expect(txt('pulmonary')[0]).toBe('pravá komora')
    expect(txt('pulmonary').at(-1)).toBe('levá síň')
    expect(txt('systemic')[0]).toBe('levá komora')
    expect(txt('systemic').at(-1)).toBe('pravá síň')
    expect(txt('ear').slice(2, 5)).toEqual(['kladívko', 'kovadlinka', 'třmínek'])
    expect(txt('nephron').indexOf('Henleova klička')).toBeGreaterThan(txt('nephron').indexOf('proximální kanálek'))
    expect(txt('nephron').indexOf('Henleova klička')).toBeLessThan(txt('nephron').indexOf('distální kanálek'))
  })

  it('pairs hormones with the gland that releases them', () => {
    const gland = (t: string) => MATCH_SETS.glands11.pairs.find((p) => p.text.startsWith(t))?.organ
    expect(gland('inzulin')).toBe('slinivka')
    expect(gland('glukagon')).toBe('slinivka')
    expect(gland('tyroxin')).toBe('stitna')
    expect(gland('adrenalin')).toBe('nadledviny')
    expect(gland('ADH')).toBe('hypofyza')
  })
})

describe('body-map rounds', () => {
  it('is registered for levels 6 and 11', () => {
    expect(Object.keys(GAME_BY_ID['body-map'].courses.biologie ?? {}).map(Number)).toEqual(Object.keys(LEVELS).map(Number))
    expect(playedLevel('l11')).toBe(11)
    expect(playedLevel('l1')).toBeUndefined()
  })

  const check = (t: Task) => {
    const ids = t.tokens.map((x) => x.id)
    expect(new Set(ids).size).toBe(ids.length)
    const texts = t.tokens.map((x) => x.text)
    expect(new Set(texts).size).toBe(texts.length)
    expect(t.slots.map((s) => s.num)).toEqual(t.slots.map((_, k) => k + 1))
    for (const s of t.slots) expect(t.tokens.filter((x) => x.answer === s.id)).toHaveLength(1)
    expect(t.tokens.filter((x) => x.answer === null).length).toBeLessThanOrEqual(1)
    if (t.kind !== 'path') {
      const organs = t.slots.map((s) => s.organ!)
      expect(new Set(organs).size).toBe(organs.length)
      for (let a = 0; a < organs.length; a++) for (let b = a + 1; b < organs.length; b++) expect(gap(organs[a], organs[b])).toBeGreaterThanOrEqual(MIN_GAP)
      expect(t.slots.length).toBeGreaterThanOrEqual(4)
      // numbers follow the picture from top to bottom
      const ys = organs.map((o) => ORGANS[o].at[1])
      expect([...ys].sort((a, b) => a - b)).toEqual(ys)
    } else {
      const path = PATHS[t.key.split(':')[2]]
      // slot k takes step k
      t.slots.forEach((s, k) => expect(t.tokens.find((x) => x.answer === s.id)!.text).toBe(path.steps[k].text))
    }
    if (t.kind === 'match') {
      const set = Object.values(MATCH_SETS).find((m) => m.prompt === t.prompt)!
      expect(t.slots).toHaveLength(set.n)
      for (const s of t.slots) {
        const tok = t.tokens.find((x) => x.answer === s.id)!
        expect(set.pairs.some((p) => p.organ === s.organ && p.text === tok.text)).toBe(true)
      }
    }
    if (t.kind === 'place') for (const s of t.slots) expect(t.tokens.find((x) => x.answer === s.id)!.text).toBe(ORGANS[s.organ!].name)
    expect(t.explain.length).toBeGreaterThan(10)
  }

  for (const lv of [...Object.keys(LEVELS).map(Number), undefined]) {
    it(`level ${lv ?? 'mix'}: valid rounds without duplicates`, () => {
      for (let seed = 1; seed <= 150; seed++) {
        const tasks = makeRound(lv, rng(seed))
        expect(tasks.length).toBeGreaterThanOrEqual(8)
        expect(tasks.length).toBeLessThanOrEqual(12)
        if (lv !== undefined) expect(tasks).toHaveLength(roundSize(lv))
        expect(new Set(tasks.map((t) => t.key)).size).toBe(tasks.length)
        if (lv !== undefined) for (const t of tasks) expect(t.level).toBe(lv)
        tasks.forEach(check)
        for (const t of tasks) {
          const ans = answersOf(t)
          expect(Object.values(gradeBoard({ ...ans }, ans)).every(Boolean)).toBe(true)
          expect(
            boardReady(
              { ...ans },
              ans,
              t.slots.map((s) => s.id),
            ),
          ).toBe(true)
        }
      }
    })
  }
})
