import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS, MIX_ROUND, ROUND, STORIES } from './levels'
import {
  answerOf,
  areaOf,
  checkValue,
  describe as describeGraph,
  graphOf,
  graphOptions,
  makeNumTask,
  makeRound,
  makeVt,
  mutations,
  numWhy,
  playedLevel,
  sameMotion,
  slope,
  storyOptions,
  taskKey,
  totalArea,
  type Graph,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const g = (type: 'st' | 'vt', t: number[], y: number[]): Graph => ({ type, t, y })

describe('motion-graph physics', () => {
  it('reads slope and area of a v–t graph', () => {
    const vt = g('vt', [0, 4, 6, 10], [0, 8, 8, 0])
    expect(slope(vt, 0)).toBe(2)
    expect(slope(vt, 1)).toBe(0)
    expect(slope(vt, 2)).toBe(-2)
    expect(areaOf(vt, 0)).toBe(16)
    expect(areaOf(vt, 1)).toBe(16)
    expect(areaOf(vt, 2)).toBe(16)
    expect(totalArea(vt)).toBe(48)
    expect(answerOf('avg', vt, 0)).toBe(4.8)
  })

  it('explains the numbers in one line', () => {
    const vt = g('vt', [0, 4, 6, 10], [0, 8, 8, 0])
    expect(numWhy('slope', vt, 2)).toBe('a = Δv / Δt = (0 − 8) m/s : 4 s = −2 m/s² (směrnice úseku C – záporné, těleso brzdí).')
    expect(numWhy('area', vt, 0)).toContain('trojúhelník ½ · 4 s · 8 m/s = 16 m')
    expect(numWhy('area', vt, 1)).toContain('obdélník 8 m/s · 2 s = 16 m')
    expect(numWhy('total', vt, 0)).toBe('s = plocha pod celým grafem = 16 + 16 + 16 = 48 m.')
    expect(numWhy('avg', vt, 0)).toContain('= 4,8 m/s.')
  })

  it('knows which graphs tell the same story', () => {
    const walk = g('st', [0, 8], [0, 6])
    expect(sameMotion(walk, g('st', [0, 8], [0, 2]))).toBe(true) // slower, but no numbers on level 2
    expect(sameMotion(walk, g('vt', [0, 8], [3, 3]))).toBe(true) // constant speed on a v–t graph
    expect(sameMotion(walk, g('vt', [0, 8], [0, 6]))).toBe(false) // same drawing, v–t = speeding up
    expect(sameMotion(g('st', [0, 8], [3, 3]), g('vt', [0, 8], [0, 0]))).toBe(true) // both stand still
  })

  it('describes graphs piece by piece', () => {
    expect(describeGraph(g('st', [0, 3, 5, 8], [0, 3, 3, 0]))).toBe('Graf s–t: stoupá (pohyb stálou rychlostí) → vodorovně (stojí) → klesá (vrací se zpět).')
    expect(describeGraph(g('st', [0, 4, 8], [0, 2, 6]))).toContain('stoupá strměji (rychleji)')
    expect(describeGraph(g('vt', [0, 5, 8], [4, 4, 0]))).toBe('Graf v–t: vodorovně (stálá rychlost) → klesá k nule (brzdí až do zastavení).')
  })

  it('accepts numbers within ±2 % with comma or dot', () => {
    expect(checkValue('48', 48)).toBe('ok')
    expect(checkValue('48,9', 48)).toBe('ok')
    expect(checkValue('49,5', 48)).toBe('wrong')
    expect(checkValue('−2', -2)).toBe('ok')
    expect(checkValue('2', -2)).toBe('wrong')
    expect(checkValue('0,04', 0)).toBe('ok')
    expect(checkValue('1.25', 1.25)).toBe('ok')
    expect(checkValue('x', 1)).toBe('invalid')
  })
})

describe('motion-graph level content', () => {
  it('has content for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID['motion-graph'].courses.fyzika!).map(Number))
  })

  it('stories are valid graphs and different stories move differently', () => {
    for (const s of STORIES) {
      expect(s.t.length, s.id).toBe(s.y.length)
      expect(s.t[0], s.id).toBe(0)
      s.t.slice(1).forEach((x, k) => expect(x, s.id).toBeGreaterThan(s.t[k]))
      s.y.forEach((y) => expect(y, s.id).toBeGreaterThanOrEqual(0))
      expect(s.text.endsWith('.'), s.id).toBe(true)
    }
    for (const a of STORIES)
      for (const b of STORIES) if (a !== b && a.graph === b.graph) expect(sameMotion(graphOf(a), graphOf(b)), `${a.id} ~ ${b.id}`).toBe(false)
    expect(new Set(STORIES.map((s) => s.id)).size).toBe(STORIES.length)
  })

  it('every story gets 4 graphs with exactly one right, and 3 stories with exactly one right', () => {
    for (let seed = 1; seed <= 20; seed++) {
      for (const s of STORIES) {
        const go = graphOptions(s, rng(seed))
        expect(go.options, s.id).toHaveLength(4)
        const right = go.options.filter((o) => sameMotion(o, graphOf(s)))
        expect(right, s.id).toHaveLength(1)
        expect(go.options[go.answer]).toEqual(graphOf(s))
        const so = storyOptions(s, rng(seed))
        expect(so.options, s.id).toHaveLength(3)
        expect(so.options.filter((o) => sameMotion(graphOf(o), graphOf(s)))).toHaveLength(1)
        expect(so.options[so.answer].id).toBe(s.id)
      }
    }
  })

  it('offers the same drawing on the other axes as a trap', () => {
    const s = STORIES.find((x) => x.id === 'pes')!
    expect(mutations(graphOf(s))[0]).toEqual({ type: 'vt', t: s.t, y: s.y })
    const go = graphOptions(s, rng(4))
    expect(go.options.some((o) => o.type === 'vt')).toBe(true)
  })

  it('generates v–t graphs with nice slopes and asks computed questions', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const vt = makeVt(rng(seed))
      expect(vt.type).toBe('vt')
      for (let k = 0; k < vt.t.length - 1; k++) {
        const a = slope(vt, k)
        expect(Math.round(a * 100)).toBeCloseTo(a * 100, 9)
        expect(Math.abs(a)).toBeLessThanOrEqual(6)
      }
      expect(vt.t[vt.t.length - 1]).toBeLessThanOrEqual(12)
      for (const kind of ['slope', 'area', 'total', 'avg'] as const) {
        const t = makeNumTask(kind, rng(seed * 7 + 1))
        expect(t.answer).toBe(answerOf(kind, t.graph, t.seg))
        expect(checkValue(String(t.answer).replace('.', ','), t.answer)).toBe('ok')
        expect(t.why.length).toBeGreaterThan(10)
        if (kind === 'area') expect(t.answer).toBeGreaterThan(0)
      }
    }
  })
})

describe('motion-graph rounds', () => {
  it('picks the level from the level id, mix otherwise', () => {
    expect(playedLevel('l2')).toBe(2)
    expect(playedLevel('l8')).toBe(8)
    expect(playedLevel('l3')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })

  for (const [lv, n] of [
    [2, ROUND[2]],
    [8, ROUND[8]],
    [undefined, MIX_ROUND],
  ] as const) {
    it(`${lv ?? 'mix'}: ${n} distinct valid tasks`, () => {
      for (let seed = 1; seed <= 30; seed++) {
        const r = makeRound(lv, rng(seed))
        expect(r).toHaveLength(n)
        expect(new Set(r.map(taskKey)).size).toBe(n)
        if (lv) r.forEach((t) => expect(t.level).toBe(lv))
        const stories = r.filter((t) => t.level === 2).map((t) => (t.level === 2 ? t.story.id : ''))
        expect(new Set(stories).size).toBe(stories.length)
      }
    })
  }

  it('level 2 mixes both directions and both graph types', () => {
    const r = makeRound(2, rng(5))
    const kinds = new Set(r.map((t) => t.kind))
    expect(kinds).toEqual(new Set(['pick-graph', 'pick-story']))
    expect(new Set(r.map((t) => (t.level === 2 ? t.story.graph : '')))).toEqual(new Set(['st', 'vt']))
  })
})
