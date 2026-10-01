import { levelNum } from '../types'
import { parseDecimal, shuffle } from '../shared/util'
import { LEVELS, MIX_ROUND, ROUND, STORIES, type GraphType, type Story } from './levels'

/** A piecewise-linear graph through its corners: s(t) for 'st', v(t) for 'vt'. */
export interface Graph {
  type: GraphType
  t: number[]
  y: number[]
}

export const graphOf = (s: Story): Graph => ({ type: s.graph, t: s.t, y: s.y })
export const other = (g: GraphType): GraphType => (g === 'st' ? 'vt' : 'st')
export const typeName = (g: GraphType) => (g === 'st' ? 's–t' : 'v–t')

// ------------------------------------------------------------------ motion of a graph

/** Slope of piece k (speed on an s–t graph, acceleration on a v–t graph). */
export const slope = (g: Graph, k: number) => (g.y[k + 1] - g.y[k]) / (g.t[k + 1] - g.t[k])
export const pieces = (g: Graph) => g.t.length - 1

/** Velocity at time `time` of the motion the graph shows. */
export function velocityAt(g: Graph, time: number): number {
  let k = 0
  while (k < pieces(g) - 1 && time > g.t[k + 1]) k++
  if (g.type === 'st') return slope(g, k)
  const u = (time - g.t[k]) / (g.t[k + 1] - g.t[k])
  return g.y[k] + u * (g.y[k + 1] - g.y[k])
}

/** Velocity sampled over the (normalised) time, scaled to max |v| = 1: the shape of the motion. */
export function profile(g: Graph, n = 64): number[] {
  const T = g.t[g.t.length - 1]
  const v = Array.from({ length: n }, (_, i) => velocityAt(g, ((i + 0.5) / n) * T))
  const m = Math.max(...v.map(Math.abs))
  return m === 0 ? v.map(() => 0) : v.map((x) => x / m)
}

/**
 * Do two graphs (of any type) tell the same story? Level-2 graphs have no numbers,
 * so only the shape counts: same velocity profile up to scale.
 */
export function sameMotion(a: Graph, b: Graph): boolean {
  const pa = profile(a)
  const pb = profile(b)
  return pa.every((x, i) => Math.abs(x - pb[i]) < 0.3)
}

// ------------------------------------------------------------------ explanation (level 2)

function describePieces(g: Graph): string[] {
  const out: string[] = []
  let lastUp: number | null = null
  for (let k = 0; k < pieces(g); k++) {
    const a = g.y[k]
    const b = g.y[k + 1]
    let d: string
    if (g.type === 'st') {
      const s = slope(g, k)
      if (Math.abs(s) < 1e-9) d = 'vodorovně (stojí)'
      else if (s < 0) d = 'klesá (vrací se zpět)'
      else {
        if (lastUp === null) d = 'stoupá (pohyb stálou rychlostí)'
        else if (s > lastUp + 1e-9) d = 'stoupá strměji (rychleji)'
        else if (s < lastUp - 1e-9) d = 'stoupá mírněji (pomaleji)'
        else d = 'stoupá stejně (stejně rychle)'
        lastUp = s
      }
    } else if (a === b) d = a === 0 ? 'na nule (stojí)' : 'vodorovně (stálá rychlost)'
    else if (b > a) d = 'stoupá (zrychluje)'
    else d = b === 0 ? 'klesá k nule (brzdí až do zastavení)' : 'klesá (zpomaluje)'
    if (out[out.length - 1] !== d) out.push(d)
  }
  return out
}

/** "Graf s–t: stoupá (pohyb stálou rychlostí) → vodorovně (stojí) → klesá (vrací se zpět)." */
export const describe = (g: Graph) => `Graf ${typeName(g.type)}: ${describePieces(g).join(' → ')}.`

/** Shape only, without the meaning (for screen readers on the answer buttons): "Graf s–t: stoupá, vodorovně, klesá". */
export const shapeLabel = (g: Graph) => `Graf ${typeName(g.type)}: ${describePieces(g).map((d) => d.replace(/ \(.*\)$/, '')).join(', ')}`

// ------------------------------------------------------------------ wrong graphs (level 2)

function fromSlopes(y0: number, t: number[], sl: number[]): number[] {
  const y = [y0]
  for (let k = 0; k < sl.length; k++) y.push(y[k] + sl[k] * (t[k + 1] - t[k]))
  return y
}

/** Tempting wrong graphs: the same drawing on the other axes, and small changes of the story. */
export function mutations(g: Graph): Graph[] {
  const out: Graph[] = [{ ...g, type: other(g.type) }]
  const n = pieces(g)
  const durs = g.t.slice(1).map((x, k) => x - g.t[k])
  const revT = [0]
  ;[...durs].reverse().forEach((d) => revT.push(revT[revT.length - 1] + d))
  if (g.type === 'st') {
    const sl = Array.from({ length: n }, (_, k) => slope(g, k))
    const up = Math.max(1, ...sl)
    const variants: number[][] = []
    for (let k = 0; k < n; k++) {
      if (sl[k] !== 0) variants.push(sl.map((x, j) => (j === k ? 0 : x)))
      if (sl[k] !== 0) variants.push(sl.map((x, j) => (j === k ? -x : x)))
      if (sl[k] === 0) variants.push(sl.map((x, j) => (j === k ? up : x)))
      if (sl[k] > 0) variants.push(sl.map((x, j) => (j === k ? x * 2 : x)))
    }
    for (const v of variants) out.push({ type: 'st', t: g.t, y: fromSlopes(g.y[0], g.t, v) })
    if (n > 1) out.push({ type: 'st', t: revT, y: fromSlopes(g.y[0], revT, [...sl].reverse()) })
    if (n > 1) out.push({ type: 'st', t: [g.t[0], g.t[n]], y: [g.y[0], g.y[n]] })
  } else {
    const top = Math.max(1, ...g.y)
    for (let k = 0; k <= n; k++) {
      if (g.y[k] !== 0) out.push({ type: 'vt', t: g.t, y: g.y.map((x, j) => (j === k ? 0 : x)) })
      if (g.y[k] !== top) out.push({ type: 'vt', t: g.t, y: g.y.map((x, j) => (j === k ? top : x)) })
    }
    out.push({ type: 'vt', t: revT, y: [...g.y].reverse() })
  }
  // positions and speeds never go below zero in these stories
  return out.filter((m) => m.y.every((x) => x >= 0))
}

// ------------------------------------------------------------------ level 8: numbers from a v–t graph

export type NumKind = 'slope' | 'area' | 'total' | 'avg'
export const UNITS = ['m/s²', 'm/s', 'm', 's'] as const
export type Unit = (typeof UNITS)[number]
export const UNIT_OF: Record<NumKind, Unit> = { slope: 'm/s²', area: 'm', total: 'm', avg: 'm/s' }
/** Accepted deviation: ±2 % (±0,05 around zero). */
export const TOL = 0.02

const nice = (x: number) => Math.abs(Math.round(x * 100) - x * 100) < 1e-9
const round2 = (x: number) => Math.round(x * 100) / 100

/** Czech number: decimal comma, real minus sign. */
export function cz(x: number): string {
  const r = round2(x)
  return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',')
}

/** Area under piece k of a v–t graph (distance travelled in it). */
export const areaOf = (g: Graph, k: number) => ((g.y[k] + g.y[k + 1]) / 2) * (g.t[k + 1] - g.t[k])
export const totalArea = (g: Graph) => Array.from({ length: pieces(g) }, (_, k) => areaOf(g, k)).reduce((a, b) => a + b, 0)
export const duration = (g: Graph) => g.t[g.t.length - 1] - g.t[0]

/** A v–t graph with whole seconds and m/s, 2–3 pieces, nice accelerations (≤ 2 decimals). */
export function makeVt(rng: () => number = Math.random): Graph {
  for (let guard = 0; guard < 1000; guard++) {
    const n = rng() < 0.5 ? 2 : 3
    const durs = Array.from({ length: n }, () => 2 + Math.floor(rng() * 5))
    const T = durs.reduce((a, b) => a + b, 0)
    if (T > 12 || T < 5) continue
    const t = [0]
    durs.forEach((d) => t.push(t[t.length - 1] + d))
    const y = [rng() < 0.45 ? 0 : 2 + Math.floor(rng() * 9)]
    for (let k = 0; k < n; k++) {
      const r = rng()
      y.push(r < 0.25 ? y[k] : r < 0.35 ? 0 : Math.floor(rng() * 17))
    }
    const g: Graph = { type: 'vt', t, y }
    const sl = Array.from({ length: n }, (_, k) => slope(g, k))
    if (!sl.every((a) => nice(a) && Math.abs(a) <= 6)) continue
    if (sl.filter((a) => a !== 0).length < 1) continue
    if (Math.max(...y) < 4) continue
    return g
  }
  return { type: 'vt', t: [0, 4, 8], y: [0, 8, 8] }
}

export interface NumTask {
  level: 8
  kind: NumKind
  graph: Graph
  /** Piece asked about (slope, area). */
  seg: number
  answer: number
  unit: Unit
  question: string
  why: string
}

export const SEG_NAME = ['A', 'B', 'C', 'D']

function numQuestion(kind: NumKind, g: Graph, seg: number): string {
  const name = SEG_NAME[seg]
  const T = duration(g)
  switch (kind) {
    case 'slope':
      return `Jaké je zrychlení tělesa v úseku ${name}?`
    case 'area':
      return `Jakou dráhu těleso urazí v úseku ${name}?`
    case 'total':
      return `Jakou dráhu těleso urazí za celých ${T} s?`
    case 'avg':
      return `Jaká je průměrná rychlost za celých ${T} s?`
  }
}

/** One line: how the answer follows from the graph. */
export function numWhy(kind: NumKind, g: Graph, seg: number): string {
  if (kind === 'slope') {
    const a = slope(g, seg)
    const dt = g.t[seg + 1] - g.t[seg]
    const tail = a < 0 ? ' – záporné, těleso brzdí' : a === 0 ? ' – rychlost se nemění' : ''
    return `a = Δv / Δt = (${g.y[seg + 1]} − ${g.y[seg]}) m/s : ${dt} s = ${cz(a)} m/s² (směrnice úseku ${SEG_NAME[seg]}${tail}).`
  }
  if (kind === 'area') return `s = plocha pod úsekem ${SEG_NAME[seg]}: ${areaFormula(g, seg)} = ${cz(areaOf(g, seg))} m.`
  const parts = Array.from({ length: pieces(g) }, (_, k) => cz(areaOf(g, k)))
  const S = totalArea(g)
  if (kind === 'total') return `s = plocha pod celým grafem = ${parts.join(' + ')} = ${cz(S)} m.`
  return `vₚ = s / t = (${parts.join(' + ')}) m : ${duration(g)} s = ${cz(S)} m : ${duration(g)} s = ${cz(S / duration(g))} m/s.`
}

function areaFormula(g: Graph, k: number): string {
  const a = g.y[k]
  const b = g.y[k + 1]
  const dt = g.t[k + 1] - g.t[k]
  if (a === b) return `obdélník ${a} m/s · ${dt} s`
  if (a === 0 || b === 0) return `trojúhelník ½ · ${dt} s · ${Math.max(a, b)} m/s`
  return `lichoběžník ½ · (${a} + ${b}) m/s · ${dt} s`
}

export function answerOf(kind: NumKind, g: Graph, seg: number): number {
  if (kind === 'slope') return slope(g, seg)
  if (kind === 'area') return areaOf(g, seg)
  if (kind === 'total') return totalArea(g)
  return totalArea(g) / duration(g)
}

export function makeNumTask(kind: NumKind, rng: () => number = Math.random): NumTask {
  for (;;) {
    const g = makeVt(rng)
    const n = pieces(g)
    let seg = 0
    if (kind === 'slope') {
      const moving = Array.from({ length: n }, (_, k) => k).filter((k) => slope(g, k) !== 0)
      const pool = rng() < 0.85 && moving.length ? moving : Array.from({ length: n }, (_, k) => k)
      seg = pool[Math.floor(rng() * pool.length)]
    } else if (kind === 'area') {
      const pool = Array.from({ length: n }, (_, k) => k).filter((k) => areaOf(g, k) > 0)
      if (!pool.length) continue
      seg = pool[Math.floor(rng() * pool.length)]
    }
    const answer = answerOf(kind, g, seg)
    if (!nice(answer)) continue
    return { level: 8, kind, graph: g, seg, answer, unit: UNIT_OF[kind], question: numQuestion(kind, g, seg), why: numWhy(kind, g, seg) }
  }
}

/** Is the typed value right (±2 %, ±0,05 around zero)? */
export function checkValue(text: string, answer: number): 'invalid' | 'ok' | 'wrong' {
  const v = parseDecimal(text)
  if (v === null) return 'invalid'
  return Math.abs(v - answer) <= Math.max(TOL * Math.abs(answer), 0.05) + 1e-9 ? 'ok' : 'wrong'
}

// ------------------------------------------------------------------ rounds

export interface GraphTask {
  level: 2
  kind: 'pick-graph'
  story: Story
  options: Graph[]
  answer: number
}
export interface StoryTask {
  level: 2
  kind: 'pick-story'
  story: Story
  options: Story[]
  answer: number
}
export type Task = GraphTask | StoryTask | NumTask

/** 4 graphs for a story: the right one and 3 that tell a different story. */
export function graphOptions(story: Story, rng: () => number = Math.random): { options: Graph[]; answer: number } {
  const right = graphOf(story)
  const [swap, ...rest] = mutations(right)
  const others = STORIES.filter((s) => s.id !== story.id && s.graph === story.graph).map(graphOf)
  const pool = [swap, ...shuffle(rest, rng), ...shuffle(others, rng)]
  const picked: Graph[] = []
  for (const g of pool) {
    if (picked.length >= 3) break
    if (sameMotion(g, right) || picked.some((p) => sameMotion(p, g))) continue
    picked.push(g)
  }
  const options = shuffle([right, ...picked], rng)
  return { options, answer: options.indexOf(right) }
}

/** 3 stories for a graph: the right one and 2 of the same graph type that move differently. */
export function storyOptions(story: Story, rng: () => number = Math.random): { options: Story[]; answer: number } {
  const g = graphOf(story)
  const picked: Story[] = []
  for (const s of shuffle(STORIES, rng)) {
    if (picked.length >= 2) break
    if (s.id === story.id || s.graph !== story.graph) continue
    if (sameMotion(graphOf(s), g) || picked.some((p) => sameMotion(graphOf(p), graphOf(s)))) continue
    picked.push(s)
  }
  const options = shuffle([story, ...picked], rng)
  return { options, answer: options.indexOf(story) }
}

function storyTasks(n: number, rng: () => number): Task[] {
  const st = shuffle(STORIES.filter((s) => s.graph === 'st'), rng)
  const vt = shuffle(STORIES.filter((s) => s.graph === 'vt'), rng)
  const out: Task[] = []
  for (let i = 0; i < n; i++) {
    const story = (i % 2 === 0 ? st : vt).shift() ?? (st.shift() || vt.shift())!
    if (i % 4 < 2) out.push({ level: 2, kind: 'pick-graph', story, ...graphOptions(story, rng) })
    else out.push({ level: 2, kind: 'pick-story', story, ...storyOptions(story, rng) })
  }
  return out
}

function numTasks(n: number, rng: () => number): Task[] {
  const kinds = shuffle<NumKind>(['slope', 'slope', 'slope', 'area', 'area', 'total', 'total', 'avg'], rng).slice(0, n)
  return kinds.map((k) => makeNumTask(k, rng))
}

/** Level whose content is played; undefined = mix. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && n in LEVELS ? n : undefined
}

export function makeRound(level?: number, rng: () => number = Math.random): Task[] {
  if (level === 2) return storyTasks(ROUND[2], rng)
  if (level === 8) return numTasks(ROUND[8], rng)
  const a = storyTasks(Math.ceil(MIX_ROUND / 2), rng)
  const b = numTasks(Math.floor(MIX_ROUND / 2), rng)
  const out: Task[] = []
  for (let i = 0; i < MIX_ROUND; i++) {
    const t = (i % 2 === 0 ? a : b).shift()
    if (t) out.push(t)
  }
  return out
}

/** Stable key for "no duplicates in a round". */
export function taskKey(t: Task): string {
  if (t.level === 2) return `${t.kind}:${t.story.id}`
  return `${t.kind}:${t.seg}:${t.graph.t.join(',')}:${t.graph.y.join(',')}`
}
