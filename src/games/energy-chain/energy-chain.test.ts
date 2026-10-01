import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { CHAINS } from './levels'
import {
  LEVEL_NUMBERS,
  carnot,
  checkNumber,
  copFridge,
  copPump,
  efficiency,
  family,
  isRightOrder,
  makeRound,
  missingTask,
  move,
  orderTask,
  playedLevel,
  positionsRight,
  type NumberTask,
  type Task,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('energy-chain physics', () => {
  it('computes efficiency, the Carnot limit and the COP', () => {
    expect(efficiency(240, 800)).toBeCloseTo(0.3, 9)
    expect(carnot(540, 30)).toBeCloseTo(1 - 303.15 / 813.15, 9)
    expect(carnot(540, 30) * 100).toBeCloseTo(62.72, 1)
    expect(carnot(27, 27)).toBeCloseTo(0, 9)
    expect(copFridge(900, 300)).toBe(3)
    expect(copPump(900, 300)).toBe(4)
  })

  it('moves cards for the keyboard buttons', () => {
    expect(move(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c'])
    expect(move(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b'])
    expect(move(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c'])
    expect(move(['a', 'b', 'c'], 2, 3)).toEqual(['a', 'b', 'c'])
  })
})

describe('energy-chain content', () => {
  it('has content for exactly the registry levels', () => {
    expect([...LEVEL_NUMBERS]).toEqual(Object.keys(GAME_BY_ID['energy-chain'].courses.fyzika!).map(Number).sort((a, b) => a - b))
    expect(Object.keys(CHAINS).map(Number).sort((a, b) => a - b)).toEqual([...LEVEL_NUMBERS])
    expect(playedLevel('l7')).toBe(7)
    expect(playedLevel('l5')).toBeUndefined()
  })

  it('chains have 4–5 unique cards and unique ids', () => {
    const ids = Object.values(CHAINS).flat().map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const [lv, chains] of Object.entries(CHAINS)) {
      expect(chains.length, `L${lv}`).toBeGreaterThanOrEqual(lv === '10' ? 4 : 8)
      for (const ch of chains) {
        expect(ch.cards.length).toBeGreaterThanOrEqual(4)
        expect(ch.cards.length).toBeLessThanOrEqual(5)
        expect(new Set(ch.cards.map((c) => c.text)).size, ch.id).toBe(ch.cards.length)
      }
    }
  })

  it('an order task is never dealt already solved and checks positions', () => {
    for (const ch of Object.values(CHAINS).flat()) {
      for (let seed = 1; seed < 30; seed++) {
        const t = orderTask(ch, 3, rng(seed))
        expect(isRightOrder(t.start, ch)).toBe(false)
        expect([...t.start].sort((a, b) => a.text.localeCompare(b.text))).toEqual([...ch.cards].sort((a, b) => a.text.localeCompare(b.text)))
      }
      expect(isRightOrder(ch.cards, ch)).toBe(true)
      expect(positionsRight(move(ch.cards, 0, 1), ch).slice(0, 2)).toEqual([false, false])
    }
  })

  it('a missing-link task offers the right card once and distractors of other energy families', () => {
    for (const [lv, chains] of Object.entries(CHAINS)) {
      for (const ch of chains) {
        for (let seed = 1; seed < 20; seed++) {
          const t = missingTask(ch, Number(lv), rng(seed))
          const right = ch.cards[t.gap]
          expect(t.options.length).toBeGreaterThanOrEqual(3)
          expect(t.options.filter((o) => o === right)).toHaveLength(1)
          const fams = t.options.map((o) => family(o.form))
          expect(new Set(fams).size).toBe(fams.length)
          for (const o of t.options) if (o !== right) expect(ch.cards.map((c) => c.text)).not.toContain(o.text)
        }
      }
    }
  })
})

function validateNumber(t: NumberTask) {
  expect(t.value).toBeGreaterThan(0)
  expect(checkNumber(String(t.value), t).kind).toBe('ok')
  expect(checkNumber(`${String(t.value).replace('.', ',')} ${t.unit}`, t).kind).toBe('ok')
  expect(checkNumber(String(t.value + t.tol * 1.6), t).kind).toBe('wrong')
  const f = t.flow
  expect(f.q1).toBeCloseTo(f.w + f.q2, 6)
  if (t.kind === 'eta') {
    expect(t.value).toBeCloseTo((f.w / f.q1) * 100, 6)
    expect(t.value).toBeLessThan(50)
  }
  if (t.kind === 'useful') expect(t.value).toBeCloseTo(f.w, 6)
  if (t.kind === 'carnot') {
    const m = t.text.match(/t_\{1\} = ([\d\s ,]+) °C\*\*.*t_\{2\} = ([\d\s ,]+) °C/)!
    const n = (s: string) => Number(s.replace(/[\s ]/g, '').replace(',', '.'))
    expect(t.value).toBeCloseTo(carnot(n(m[1]), n(m[2])) * 100, 6)
    expect(t.value).toBeGreaterThan(0)
    expect(t.value).toBeLessThan(100)
  }
  if (t.kind === 'cop') expect(t.value).toBeCloseTo(t.text.includes('chladicí') ? f.q2 / f.w : f.q1 / f.w, 6)
}

describe('energy-chain rounds', () => {
  const check = (round: Task[], n: number, lv?: number) => {
    expect(round).toHaveLength(n)
    expect(new Set(round.map((t) => t.key)).size).toBe(n)
    // every chain at most once per round
    const chainIds = round.flatMap((t) => (t.kind === 'order' || t.kind === 'missing' ? [t.chain.id] : []))
    expect(new Set(chainIds).size).toBe(chainIds.length)
    if (lv !== undefined) expect(round.every((t) => t.level === lv)).toBe(true)
    for (const t of round) if (t.kind !== 'order' && t.kind !== 'missing') validateNumber(t)
  }

  for (const lv of [3, 4, 7]) {
    it(`L${lv}: 8 distinct chain tasks`, () => {
      for (let seed = 1; seed < 40; seed++) {
        const r = makeRound(lv, rng(seed))
        check(r, 8, lv)
        expect(r.filter((t) => t.kind === 'order')).toHaveLength(5)
        expect(r.filter((t) => t.kind === 'missing')).toHaveLength(3)
      }
    })
  }

  it('L10: chains plus efficiency, Carnot and COP tasks, all computed', () => {
    for (let seed = 1; seed < 80; seed++) {
      const r = makeRound(10, rng(seed))
      check(r, 10, 10)
      const kinds = new Set(r.map((t) => t.kind))
      for (const k of ['order', 'missing', 'eta', 'useful', 'carnot', 'cop']) expect(kinds.has(k as Task['kind'])).toBe(true)
    }
  })

  it('free play mixes all four levels', () => {
    for (let seed = 1; seed < 20; seed++) {
      const r = makeRound(undefined, rng(seed))
      check(r, 10)
      expect(new Set(r.map((t) => t.level))).toEqual(new Set([3, 4, 7, 10]))
    }
  })
})
