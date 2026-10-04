import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { boardReady, emptyBoard, gradeBoard, keepCorrect, moveToken } from './board'
import { ANCHORS, CELLS, LEVELS, MISSABLE, PARTS, VIEW, type CellId, type PartId } from './levels'
import { answersOf, has, makeRound, membership, playedLevel, singleSlots, surelyLacks, zonesOf, type Task } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const CELL_IDS = Object.keys(CELLS) as CellId[]
const roundSize = (lv: number) => Object.values(LEVELS[lv].mix).reduce((a, b) => a + b, 0)

describe('cell-builder biology', () => {
  it('knows which cell has what', () => {
    expect(has('chloroplast', 'plant')).toBe(true)
    expect(has('chloroplast', 'animal')).toBe(false)
    expect(has('jadro', 'bacterium')).toBe(false)
    expect(has('nukleoid', 'bacterium')).toBe(true)
    expect(has('stena', 'animal')).toBe(false)
    expect(has('stena', 'bacterium')).toBe(true)
    expect(has('mitochondrie', 'bacterium')).toBe(false)
    for (const c of CELL_IDS) {
      expect(has('membrana', c)).toBe(true)
      expect(has('ribozomy', c)).toBe(true)
      expect(has('cytoplazma', c)).toBe(true)
    }
    expect(has('centrioly', 'plant')).toBe(false)
  })

  it('never claims an uncertain absence', () => {
    // animal cells have small vacuoles, sperm cells a flagellum, plant cells lytic vacuoles
    expect(surelyLacks('vakuola', 'animal')).toBe(false)
    expect(surelyLacks('bicik', 'animal')).toBe(false)
    expect(surelyLacks('lysozom', 'plant')).toBe(false)
    expect(surelyLacks('cytoskelet', 'bacterium')).toBe(false)
    expect(surelyLacks('chloroplast', 'animal')).toBe(true)
  })

  it('has a reason for every absence it may claim', () => {
    for (const p of Object.values(PARTS))
      for (const c of CELL_IDS) if (!p.in.includes(c) && !p.unsure?.includes(c)) expect(p.lacks?.[c], `${p.id} in ${c}`).toBeTruthy()
  })

  it('draws only what the cell really has', () => {
    for (const c of CELL_IDS) for (const p of Object.keys(ANCHORS[c]) as PartId[]) expect(has(p, c), `${p} drawn in ${c}`).toBe(true)
  })

  it('keeps markers apart so they never overlap', () => {
    for (const c of CELL_IDS) {
      const pts = Object.entries(ANCHORS[c])
      for (let a = 0; a < pts.length; a++)
        for (let b = a + 1; b < pts.length; b++) {
          const [pa, [xa, ya]] = pts[a] as [string, [number, number]]
          const [pb, [xb, yb]] = pts[b] as [string, [number, number]]
          expect(Math.hypot(xa - xb, ya - yb), `${c}: ${pa} × ${pb}`).toBeGreaterThanOrEqual(30)
        }
      const [top, h] = VIEW[c]
      for (const [, [x, y]] of Object.entries(ANCHORS[c]) as [string, [number, number]][]) {
        expect(x).toBeGreaterThan(8)
        expect(x).toBeLessThan(352)
        expect(y).toBeGreaterThan(top + 8)
        expect(y).toBeLessThan(top + h - 8)
      }
    }
  })

  it('gives every function text once per level', () => {
    for (const fn of ['fn1', 'fn9'] as const) {
      const texts = Object.values(PARTS)
        .map((p) => p[fn])
        .filter(Boolean)
      expect(new Set(texts).size).toBe(texts.length)
    }
  })

  it('sorts cards by the data', () => {
    const s = LEVELS[1].schemes.find((x) => x.id === 'plant-animal')!
    expect(membership('chloroplast', s)).toEqual([0])
    expect(membership('jadro', s)).toEqual([0, 1])
    expect(membership('vakuola', s)).toBeNull()
    expect(membership('nukleoid', s)).toBeNull()
    const pe = LEVELS[9].schemes.find((x) => x.id === 'prok-euk')!
    expect(membership('stena', pe)).toEqual([0, 1])
    expect(membership('golgi', pe)).toEqual([1])
    expect(membership('plazmid', pe)).toEqual([0])
    expect(membership('bicik', pe)).toBeNull()
    expect(zonesOf(pe).map((z) => z.id)).toEqual(['z0', 'z1', 'z01'])
  })
})

describe('cell-builder rounds', () => {
  it('is registered for levels 1 and 9', () => {
    expect(Object.keys(GAME_BY_ID['cell-builder'].courses.biologie ?? {}).map(Number)).toEqual(Object.keys(LEVELS).map(Number))
    expect(playedLevel('l9')).toBe(9)
    expect(playedLevel('l4')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })

  const check = (t: Task) => {
    const vocab = new Set(LEVELS[t.level].parts)
    if (t.kind === 'missing') {
      expect(ANCHORS[t.cell][t.missing]).toBeTruthy()
      expect(MISSABLE).toContain(t.missing)
      expect(vocab.has(t.missing)).toBe(true)
      expect(new Set(t.options).size).toBe(t.options.length)
      expect(t.options).toContain(t.missing)
      for (const o of t.options) if (o !== t.missing) expect(ANCHORS[t.cell][o] ? MISSABLE.includes(o) : surelyLacks(o, t.cell)).toBe(true)
      return
    }
    const ids = t.tokens.map((x) => x.id)
    expect(new Set(ids).size).toBe(ids.length)
    const texts = t.tokens.map((x) => x.text)
    expect(new Set(texts).size, texts.join(' | ')).toBe(texts.length)
    if (t.kind === 'sort') {
      const zoneIds = new Set(t.zones.map((z) => z.id))
      for (const z of t.zones) expect(t.tokens.some((x) => x.answer === z.id), `empty zone ${z.id}`).toBe(true)
      for (const x of t.tokens) {
        const part = x.id.slice(2) as PartId
        const m = membership(part, t.scheme)
        expect(m).not.toBeNull()
        expect(x.answer).toBe(`z${m!.join('')}`)
        expect(zoneIds.has(x.answer!)).toBe(true)
        expect(vocab.has(part)).toBe(true)
      }
      expect(t.tokens.length).toBeGreaterThanOrEqual(4)
      return
    }
    const slotIds = new Set(t.slots.map((s) => s.id))
    expect(slotIds.size).toBe(t.slots.length)
    expect(t.slots.map((s) => s.num)).toEqual(t.slots.map((_, k) => k + 1))
    for (const s of t.slots) {
      expect(ANCHORS[t.cell][s.part]).toBeTruthy()
      expect(vocab.has(s.part)).toBe(true)
    }
    // one token per slot, at most one distractor that the cell surely lacks
    for (const s of t.slots) expect(t.tokens.filter((x) => x.answer === s.id)).toHaveLength(1)
    const extra = t.tokens.filter((x) => x.answer === null)
    expect(extra.length).toBeLessThanOrEqual(1)
    for (const x of extra) expect(surelyLacks(x.id.slice(2) as PartId, t.cell)).toBe(true)
    if (t.kind === 'function') for (const s of t.slots) expect(s.title).toBe(PARTS[s.part].name)
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
      }
    })
  }

  it('the answer key solves every board task', () => {
    for (let seed = 1; seed <= 40; seed++)
      for (const t of makeRound(undefined, rng(seed))) {
        if (t.kind === 'missing') continue
        const ans = answersOf(t)
        const g = gradeBoard({ ...ans }, ans)
        expect(Object.values(g).every(Boolean)).toBe(true)
        expect(boardReady({ ...ans }, ans, singleSlots(t))).toBe(true)
      }
  })
})

describe('drag-and-drop board', () => {
  const cap1 = () => 1
  it('places, swaps and returns tokens', () => {
    let w = emptyBoard(['a', 'b'])
    w = moveToken(w, 'a', 's1', cap1)
    expect(w).toEqual({ a: 's1', b: null })
    w = moveToken(w, 'b', 's1', cap1)
    expect(w).toEqual({ a: null, b: 's1' })
    w = moveToken(w, 'a', 's2', cap1)
    w = moveToken(w, 'a', 's1', cap1)
    expect(w).toEqual({ a: 's1', b: 's2' })
    w = moveToken(w, 'a', null, cap1)
    expect(w).toEqual({ a: null, b: 's2' })
  })

  it('zones hold many tokens', () => {
    let w = emptyBoard(['a', 'b'])
    w = moveToken(w, 'a', 'z', () => Infinity)
    w = moveToken(w, 'b', 'z', () => Infinity)
    expect(w).toEqual({ a: 'z', b: 'z' })
  })

  it('keeps the right tokens and sends the rest back', () => {
    const answers = { a: 's1', b: 's2', d: null }
    const w = { a: 's1', b: null, d: 's2' }
    expect(boardReady(w, answers, ['s1', 's2'])).toBe(true)
    expect(gradeBoard(w, answers)).toEqual({ a: true, b: false, d: false })
    const k = keepCorrect(w, answers)
    expect(k.where).toEqual({ a: 's1', b: null, d: null })
    expect([...k.locked]).toEqual(['a'])
    expect(boardReady(k.where, answers, ['s1', 's2'])).toBe(false)
  })
})
