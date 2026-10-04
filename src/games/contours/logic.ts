/**
 * Vrstevnice – task generation. Every task gets its own seeded terrain; the generators
 * retry until the geometry makes the task unambiguous (checked here and in the tests).
 */
import { levelNum } from '../types'
import { shuffle } from '../shared/util'
import { HILLS, LANDFORMS, LANDFORM_WHY, LEVELS, STREAMS, STREAM_INTO, TOURIST_M_PER_UNIT, type Landform, type TaskKind } from './levels'
import {
  MAP_H,
  MAP_W,
  between,
  cellOf,
  cellPt,
  chooseInterval,
  contours,
  descend,
  dist,
  distToLine,
  outletOf,
  flow,
  gradAt,
  heightAt,
  hessAt,
  len,
  placeLabels,
  pointAt,
  polyLength,
  refineCritical,
  sample,
  seeded,
  smooth,
  streams,
  summits,
  type Bump,
  type Contour,
  type Flow,
  type Grid,
  type Label,
  type Pt,
  type Rng,
  type Stream,
  type Terrain,
} from './terrain'

export { seeded }
export const ROUND = 10

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

/* ------------------------------------------------------------------ map data */

export interface Spot extends Pt {
  z: number
  name?: string
}

export interface MapData {
  terrain: Terrain
  interval: number
  lines: Contour[]
  labels: Label[]
  spots: Spot[]
  streams: Pt[][]
  /** Named streams: label position and name. */
  streamNames: (Pt & { name: string; rot: number })[]
  trail?: Pt[]
  hut?: Pt
  /** Metres per map unit when the map shows a scale bar (tourist map). */
  mPerUnit?: number
}

export interface Mark extends Pt {
  label: string
}

export interface Seg {
  pts: Pt[]
  label?: string
  /** bar: a slope to compare · line: a profile line A–B · cand: a candidate path · flow: where water goes */
  style: 'bar' | 'line' | 'cand' | 'flow'
}

interface Base {
  key: string
  kind: TaskKind
  level: number
  eyebrow: string
  text: string
  why: string
  map: MapData
  marks: Mark[]
  segs: Seg[]
  /** Extra drawing revealed after the answer. */
  reveal: Seg[]
}

export interface Option {
  id: string
  label: string
  /** A height profile (m) drawn in the option. */
  profile?: number[]
}

export interface ChoiceTask extends Base {
  type: 'choice'
  options: Option[]
  answer: string
  /** Shared vertical range of the profiles. */
  range?: [number, number]
}

export interface NumberTask extends Base {
  type: 'number'
  answer: number
  tol: number
  unit: 'm'
}

export type Task = ChoiceTask | NumberTask

/* ------------------------------------------------------------------ helpers */

const W = MAP_W
const H = MAP_H
const inMap = (p: Pt, m = 0) => p.x >= m && p.y >= m && p.x <= W - m && p.y <= H - m
const r0 = (x: number) => Math.round(x)
const NB = ' '

/** "1 vrstevnici", "3 vrstevnice", "5 vrstevnic" (accusative after "protne"). */
export function vrstevnic(n: number): string {
  return n === 1 ? '1 vrstevnici' : n >= 2 && n <= 4 ? `${n} vrstevnice` : `${n} vrstevnic`
}

const pickOne = <T,>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]

function randomBump(rng: Rng, o: Partial<Bump> & { aMin: number; aMax: number; sMin: number; sMax: number }): Bump {
  const sx = between(rng, o.sMin, o.sMax)
  return {
    x: o.x ?? between(rng, 30, W - 30),
    y: o.y ?? between(rng, 30, H - 30),
    a: between(rng, o.aMin, o.aMax),
    sx,
    sy: o.sy ?? sx * between(rng, 0.6, 1.5),
    rot: o.rot ?? rng() * Math.PI,
  }
}

const terrain = (base: number, tx: number, ty: number, bumps: Bump[]): Terrain => ({ w: W, h: H, base, tx, ty, bumps })

/** Builds the drawable map: contours, labels on index contours (away from `avoid`), spot heights. */
export function buildMap(t: Terrain, o: { avoid?: Pt[]; spots?: Spot[]; grid?: Grid; interval?: number } = {}): MapData {
  const g = o.grid ?? sample(t)
  const interval = o.interval ?? chooseInterval(g.min, g.max)
  const lines = contours(g, interval)
  const spots = o.spots ?? []
  const labels = placeLabels(t, lines, [...(o.avoid ?? []), ...spots])
  return { terrain: t, interval, lines, labels, spots, streams: [], streamNames: [] }
}

/** Number of contour levels crossed between two heights. */
export const crossings = (a: number, b: number, i: number) => Math.abs(Math.floor(Math.max(a, b) / i) - Math.floor(Math.min(a, b) / i))

/** Heights along a polyline every `step` units. */
export function heightsAlong(t: Terrain, pts: Pt[], n: number): number[] {
  const total = polyLength(pts)
  return Array.from({ length: n }, (_, k) => {
    const { p } = pointAt(pts, (total * k) / (n - 1))
    return heightAt(t, p.x, p.y)
  })
}

/** Contour crossings along a polyline (counted on a fine sampling). */
export function crossingsAlong(t: Terrain, pts: Pt[], interval: number): number {
  const hs = heightsAlong(t, pts, Math.max(20, Math.ceil(polyLength(pts) / 1.5)))
  let n = 0
  for (let k = 1; k < hs.length; k++) n += crossings(hs[k - 1], hs[k], interval)
  return n
}

/** Distance from p to the nearest contour of any level. */
export const distToContours = (p: Pt, lines: Contour[]) => Math.min(...lines.map((l) => distToLine(p, l.pts)))

/** The landform at a point, read from the gradient and the curvature (used to verify the generators). */
export function landformAt(t: Terrain, p: Pt): Landform | 'nejasné' {
  const g = gradAt(t, p.x, p.y)
  const gl = len(g)
  const [a, b, d] = hessAt(t, p.x, p.y, 4)
  if (gl < 0.05) {
    const tr = a + d
    const disc = Math.sqrt(((a - d) / 2) ** 2 + b * b)
    const l1 = tr / 2 - disc
    const l2 = tr / 2 + disc
    const e = 0.004
    if (l2 < -e) return 'vrchol'
    if (l1 > e) return 'kotlina'
    if (l1 < -e && l2 > e) return 'sedlo'
    return 'nejasné'
  }
  // second derivative along the contour (perpendicular to the gradient), relative to the slope
  const sx = -g.y / gl
  const sy = g.x / gl
  const hss = a * sx * sx + 2 * b * sx * sy + d * sy * sy
  const k = hss / gl
  if (k < -1 / 45) return 'hřbet'
  if (k > 1 / 45) return 'údolí'
  if (Math.abs(k) < 1 / 250) return 'svah'
  return 'nejasné'
}

function choiceFrom<T extends string>(answer: T, pool: readonly T[], n: number, rng: Rng, label: (x: T) => string = (x) => x): Option[] {
  const others = shuffle(
    pool.filter((x) => x !== answer),
    rng,
  ).slice(0, n - 1)
  return shuffle([answer, ...others], rng).map((x) => ({ id: x, label: label(x) }))
}

const fail = (kind: string): never => {
  throw new Error(`contours: no valid ${kind} task found`)
}

/* ------------------------------------------------------------------ level 1 */

function hilly(rng: Rng): Terrain {
  const n = 2 + Math.floor(rng() * 3)
  const bumps: Bump[] = []
  for (let k = 0; k < n; k++) {
    const b = randomBump(rng, { aMin: 80, aMax: 200, sMin: 30, sMax: 75 })
    if (k > 0 && rng() < 0.2) b.a = -b.a * 0.5
    bumps.push(b)
  }
  return terrain(between(rng, 300, 480), between(rng, -0.4, 0.4), between(rng, -0.4, 0.4), bumps)
}

function hillyMap(rng: Rng, avoid: Pt[] = []): MapData | null {
  const t = hilly(rng)
  const g = sample(t)
  if (g.max - g.min < 110) return null
  const tops = summits(t, g, 60, 24).slice(0, 2)
  const spots = tops.map((p) => ({ ...p, z: r0(heightAt(t, p.x, p.y)) }))
  const m = buildMap(t, { grid: g, spots, avoid })
  if (new Set(m.labels.map((l) => l.text)).size < 2) return null
  return m
}

export function onContourTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const m = hillyMap(rng)
    if (!m) continue
    const i = m.interval
    const cands = m.lines.filter((l) => !l.index && polyLength(l.pts) > 80)
    if (!cands.length) continue
    const line = pickOne(cands, rng)
    const { p } = pointAt(line.pts, polyLength(line.pts) * between(rng, 0.3, 0.7))
    if (!inMap(p, 26)) continue
    if (m.labels.some((l) => dist(l, p) < 28) || m.spots.some((s) => dist(s, p) < 24)) continue
    const others = m.lines.filter((l) => l.level !== line.level)
    if (others.length && distToContours(p, others) < 6) continue
    const L = line.level
    const pool = [L - 2 * i, L - i, L + i, L + 2 * i].filter((x) => x > 0)
    const opts = shuffle([L, ...shuffle(pool, rng).slice(0, 3)], rng)
    return {
      type: 'choice',
      key: `on-contour-${L}-${r0(p.x)}`,
      kind: 'on-contour',
      level: 1,
      eyebrow: 'Výška bodu',
      text: 'Bod X leží přesně na vrstevnici. Jakou má nadmořskou výšku?',
      map: m,
      marks: [{ ...p, label: 'X' }],
      segs: [],
      reveal: [],
      options: opts.map((x) => ({ id: String(x), label: `${x}${NB}m` })),
      answer: String(L),
      why: `Popsané (zesílené) vrstevnice jsou po ${5 * i}${NB}m, tenké mezi nimi po ${i}${NB}m. Odpočítej je od nejbližšího čísla: X leží na vrstevnici ${L}${NB}m.`,
    }
  }
  return fail('on-contour')
}

export function betweenTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    const m = hillyMap(rng)
    if (!m) continue
    const i = m.interval
    for (let k = 0; k < 40; k++) {
      const p = { x: between(rng, 30, W - 30), y: between(rng, 30, H - 30) }
      const z = heightAt(m.terrain, p.x, p.y)
      const L = Math.floor(z / i) * i
      const f = (z - L) / i
      if (f < 0.3 || f > 0.7) continue
      if (distToContours(p, m.lines) < 7) continue
      if (m.labels.some((l) => dist(l, p) < 28) || m.spots.some((s) => dist(s, p) < 24)) continue
      const shift = Math.floor(rng() * 4)
      const lows = [0, 1, 2, 3].map((n) => L + (n - shift) * i).filter((x) => x >= 0)
      if (lows.length < 4) continue
      return {
        type: 'choice',
        key: `between-${L}-${r0(p.x)}`,
        kind: 'between',
        level: 1,
        eyebrow: 'Výška bodu',
        text: 'Bod X leží mezi vrstevnicemi. Jakou má přibližně nadmořskou výšku?',
        map: m,
        marks: [{ ...p, label: 'X' }],
        segs: [],
        reveal: [],
        options: lows.map((x) => ({ id: String(x), label: `${x}–${x + i}${NB}m` })),
        answer: String(L),
        why: `X leží mezi vrstevnicemi ${L} a ${L + i}${NB}m (interval je ${i}${NB}m), takže jeho výška je mezi nimi, asi ${r0(z)}${NB}m.`,
      }
    }
  }
  return fail('between')
}

const INTERVALS = [5, 10, 20, 50, 100]

export function intervalTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const m = hillyMap(rng)
    if (!m) continue
    const i = m.interval
    const vals = [...new Set(m.labels.map((l) => Number(l.text)))].sort((a, b) => a - b)
    const pair = vals.find((v, k) => k + 1 < vals.length && vals[k + 1] - v === 5 * i)
    if (pair === undefined) continue
    return {
      type: 'choice',
      key: `interval-${i}-${pair}`,
      kind: 'interval',
      level: 1,
      eyebrow: 'Interval vrstevnic',
      text: 'Jaký je na této mapě interval vrstevnic, tedy výškový rozdíl dvou sousedních vrstevnic?',
      map: m,
      marks: [],
      segs: [],
      reveal: [],
      options: choiceFrom(String(i), INTERVALS.map(String), 4, rng, (x) => `${x}${NB}m`),
      answer: String(i),
      why: `Popsané vrstevnice ${pair} a ${pair + 5 * i}${NB}m se liší o ${5 * i}${NB}m a mezi nimi jsou 4 tenké, tedy 5 kroků: ${5 * i} : 5 = ${i}${NB}m.`,
    }
  }
  return fail('interval')
}

const BAR = 40

/** A bar along the fall line through p (from low to high), or null if it does not fit or is not monotonic. */
function fallBar(t: Terrain, p: Pt): Pt[] | null {
  const g = gradAt(t, p.x, p.y)
  const gl = len(g)
  if (gl < 1e-3) return null
  const d = { x: g.x / gl, y: g.y / gl }
  const a = { x: p.x - (d.x * BAR) / 2, y: p.y - (d.y * BAR) / 2 }
  const b = { x: p.x + (d.x * BAR) / 2, y: p.y + (d.y * BAR) / 2 }
  if (!inMap(a, 16) || !inMap(b, 16)) return null
  const hs = heightsAlong(t, [a, b], 12)
  for (let k = 1; k < hs.length; k++) if (hs[k] <= hs[k - 1]) return null
  return [a, b]
}

export function steeperTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const m = hillyMap(rng)
    if (!m) continue
    const i = m.interval
    const bars: { pts: Pt[]; n: number; mid: Pt }[] = []
    for (let k = 0; k < 160; k++) {
      const p = { x: between(rng, 30, W - 30), y: between(rng, 30, H - 30) }
      const pts = fallBar(m.terrain, p)
      if (!pts) continue
      const n = crossingsAlong(m.terrain, pts, i)
      if (n >= 1) bars.push({ pts, n, mid: p })
    }
    const steep = bars.filter((b) => b.n >= 4)
    const gentle = bars.filter((b) => b.n >= 1 && b.n <= 2)
    for (const s of shuffle(steep, rng)) {
      const g = gentle.find((b) => b.n * 2 <= s.n && dist(b.mid, s.mid) > 80)
      if (!g) continue
      const clear = (b: { pts: Pt[] }) => m.labels.every((l) => distToLine(l, b.pts) > 16) && m.spots.every((sp) => distToLine(sp, b.pts) > 16)
      if (!clear(s) || !clear(g)) continue
      const steepIsA = rng() < 0.5
      const [A, B] = steepIsA ? [s, g] : [g, s]
      return {
        type: 'choice',
        key: `steeper-${r0(s.mid.x)}-${r0(g.mid.x)}`,
        kind: 'steeper',
        level: 1,
        eyebrow: 'Sklon svahu',
        text: 'Úsečky A a B jsou stejně dlouhé a vedou po spádnici z kopce dolů. Který svah je strmější?',
        map: m,
        marks: [],
        segs: [
          { pts: A.pts, label: 'A', style: 'bar' },
          { pts: B.pts, label: 'B', style: 'bar' },
        ],
        reveal: [],
        options: [
          { id: 'A', label: 'Svah A' },
          { id: 'B', label: 'Svah B' },
        ],
        answer: steepIsA ? 'A' : 'B',
        why: `Svah ${steepIsA ? 'A' : 'B'} protne na stejné délce ${vrstevnic(s.n)}, svah ${steepIsA ? 'B' : 'A'} jen ${vrstevnic(g.n)}. Čím hustší vrstevnice, tím strmější svah.`,
      }
    }
  }
  return fail('steeper')
}

const PROFILE_N = 48

const profileDiff = (p: number[], q: number[], range: number) => p.reduce((s, v, k) => s + Math.abs(v - q[k]), 0) / p.length / range

function randomLine(rng: Rng, minLen: number, maxLen: number): Pt[] | null {
  const a = { x: between(rng, 22, W - 22), y: between(rng, 22, H - 22) }
  const ang = rng() * Math.PI * 2
  const l = between(rng, minLen, maxLen)
  const b = { x: a.x + Math.cos(ang) * l, y: a.y + Math.sin(ang) * l }
  return inMap(b, 22) ? [a, b] : null
}

export function profileTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    // check the profiles on the bare terrain first (cheap), build the map only for a good layout
    const t = hilly(rng)
    const g = sample(t)
    if (g.max - g.min < 110) continue
    const i = chooseInterval(g.min, g.max)
    const ab = randomLine(rng, 170, 270)
    if (!ab) continue
    const right = heightsAlong(t, ab, PROFILE_N)
    if (Math.max(...right) - Math.min(...right) < 4 * i) continue
    const reversed = [...right].reverse()
    let other: number[] | null = null
    for (let k = 0; k < 30 && !other; k++) {
      const l = randomLine(rng, 170, 270)
      if (!l || distToLine(l[0], ab) < 30) continue
      const pr = heightsAlong(t, l, PROFILE_N)
      if (Math.max(...pr) - Math.min(...pr) >= 3 * i) other = pr
    }
    if (!other) continue
    const all = [right, reversed, other]
    const lo = Math.min(...all.flat())
    const hi = Math.max(...all.flat())
    const span = hi - lo
    if (profileDiff(right, reversed, span) < 0.12 || profileDiff(right, other, span) < 0.12 || profileDiff(reversed, other, span) < 0.08) continue
    const tops = summits(t, g, 60, 24).slice(0, 2)
    const m = buildMap(t, { grid: g, interval: i, spots: tops.map((p) => ({ ...p, z: r0(heightAt(t, p.x, p.y)) })), avoid: ab })
    if (m.labels.length < 2 || m.labels.some((l) => distToLine(l, ab) < 10)) continue
    const opts = shuffle(
      [
        { id: 'ok', profile: right },
        { id: 'rev', profile: reversed },
        { id: 'other', profile: other },
      ],
      rng,
    ).map((o, k) => ({ ...o, label: `Profil ${k + 1}` }))
    const top = Math.max(...right)
    return {
      type: 'choice',
      key: `profile-${r0(ab[0].x)}-${r0(ab[0].y)}`,
      kind: 'profile',
      level: 1,
      eyebrow: 'Profil terénu',
      text: 'Který profil ukazuje terén podél čáry z A do B?',
      map: m,
      marks: [
        { ...ab[0], label: 'A' },
        { ...ab[1], label: 'B' },
      ],
      segs: [{ pts: ab, style: 'line' }],
      reveal: [],
      options: opts,
      answer: 'ok',
      range: [Math.floor(lo / i) * i, Math.ceil(hi / i) * i],
      why: `V A je terén asi ${r0(right[0])}${NB}m, nejvyšší místo na čáře má asi ${r0(top)}${NB}m a v B asi ${r0(right[PROFILE_N - 1])}${NB}m. Výšky čti tam, kde čára protíná vrstevnice.`,
    }
  }
  return fail('profile')
}

/* ------------------------------------------------------------------ level 3 */

const centre = (rng: Rng): Pt => ({ x: between(rng, 110, W - 110), y: between(rng, 95, H - 95) })
const unit = (ang: number): Pt => ({ x: Math.cos(ang), y: Math.sin(ang) })
const add = (p: Pt, d: Pt, s: number): Pt => ({ x: p.x + d.x * s, y: p.y + d.y * s })

/** Small hills far from `c`, to make the map look like real terrain. */
function extras(rng: Rng, c: Pt, n: number, minDist: number, aMax = 90): Bump[] {
  const out: Bump[] = []
  for (let k = 0; k < 40 && out.length < n; k++) {
    const b = randomBump(rng, { aMin: 40, aMax, sMin: 25, sMax: 45 })
    if (dist(b, c) >= minDist) out.push(b)
  }
  return out
}

/** Terrain and the marker for one landform. */
export function landformTerrain(form: Landform, rng: Rng): { t: Terrain; p: Pt } {
  const c = centre(rng)
  const rot = rng() * Math.PI
  switch (form) {
    case 'vrchol': {
      const main = randomBump(rng, { x: c.x, y: c.y, aMin: 160, aMax: 240, sMin: 38, sMax: 55, rot })
      main.sy = main.sx * between(rng, 0.75, 1.3)
      const t = terrain(between(rng, 380, 520), between(rng, -0.15, 0.15), between(rng, -0.15, 0.15), [main, ...extras(rng, c, 2, 120)])
      return { t, p: refineCritical(t, c) }
    }
    case 'kotlina': {
      const bumps: Bump[] = [{ x: c.x, y: c.y, a: -between(rng, 110, 150), sx: between(rng, 50, 62), sy: between(rng, 50, 62), rot }]
      const off = rng() * Math.PI * 2
      for (let k = 0; k < 4; k++) {
        const q = add(c, unit(off + (k * Math.PI) / 2 + between(rng, -0.3, 0.3)), between(rng, 105, 125))
        bumps.push(randomBump(rng, { x: q.x, y: q.y, aMin: 40, aMax: 80, sMin: 30, sMax: 45 }))
      }
      const t = terrain(between(rng, 560, 700), 0, 0, bumps)
      return { t, p: refineCritical(t, c) }
    }
    case 'sedlo': {
      const d = unit(rot)
      const s = between(rng, 48, 58)
      const a = between(rng, 160, 220)
      const sig = between(rng, 34, 40)
      const b1 = { ...add(c, d, s), a, sx: sig, sy: sig * between(rng, 0.9, 1.2), rot }
      const b2 = { ...add(c, d, -s), a: a * between(rng, 0.85, 1.1), sx: sig, sy: sig * between(rng, 0.9, 1.2), rot }
      const t = terrain(between(rng, 380, 520), between(rng, -0.1, 0.1), between(rng, -0.1, 0.1), [b1, b2, ...extras(rng, c, 1, 140, 60)])
      return { t, p: refineCritical(t, c) }
    }
    case 'hřbet': {
      const d = unit(rot)
      const sx = between(rng, 100, 125)
      const top = add(c, d, -0.85 * sx)
      const ridge = { x: top.x, y: top.y, a: between(rng, 180, 240), sx, sy: between(rng, 24, 32), rot }
      const t = terrain(between(rng, 380, 520), between(rng, -0.1, 0.1), between(rng, -0.1, 0.1), [ridge, ...extras(rng, c, 2, 110, 60)])
      return { t, p: c }
    }
    case 'údolí': {
      const d = unit(rot)
      const slope = between(rng, 0.55, 0.8)
      const trough = { x: c.x, y: c.y, a: -between(rng, 70, 100), sx: 700, sy: between(rng, 22, 30), rot }
      const t = terrain(between(rng, 450, 600), d.x * slope, d.y * slope, [trough, ...extras(rng, c, 2, 100, 50)])
      return { t, p: c }
    }
    case 'svah': {
      const d = unit(rot)
      const slope = between(rng, 0.55, 0.8)
      const t = terrain(between(rng, 450, 600), d.x * slope, d.y * slope, extras(rng, c, 2, 130, 60))
      return { t, p: c }
    }
  }
}

export function landformTask(form: Landform, rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const { t, p } = landformTerrain(form, rng)
    if (!inMap(p, 60)) continue
    if (landformAt(t, p) !== form) continue
    const g = sample(t)
    const z = heightAt(t, p.x, p.y)
    const spots: Spot[] = form === 'vrchol' || form === 'kotlina' || form === 'sedlo' ? [{ ...p, z: r0(z) }] : []
    const m = buildMap(t, { grid: g, spots, avoid: [p] })
    if (m.labels.length < 2 || m.interval > 20) continue
    if (form === 'sedlo') {
      // both summits clearly above the saddle (separate closed contours)
      const tops = t.bumps.slice(0, 2).map((b) => heightAt(t, b.x, b.y))
      if (Math.min(...tops) - z < 2 * m.interval) continue
    }
    if ((form === 'vrchol' || form === 'kotlina') && Math.abs(heightAt(t, p.x + 60, p.y) - z) < 2 * m.interval) continue
    if (form !== 'vrchol' && form !== 'kotlina' && form !== 'sedlo' && distToContours(p, m.lines) > 14) continue
    const options = choiceFrom(form, LANDFORMS, 4, rng, (x) => x[0].toUpperCase() + x.slice(1))
    return {
      type: 'choice',
      key: `landform-${form}`,
      kind: 'landform',
      level: 3,
      eyebrow: 'Tvar reliéfu',
      text: 'Jaký tvar reliéfu je v místě X?',
      map: m,
      marks: [{ ...p, label: 'X' }],
      segs: [],
      reveal: [],
      options,
      answer: form,
      why: LANDFORM_WHY[form],
    }
  }
  return fail(`landform ${form}`)
}

/** Smoothed polyline of a D8 stream. */
const streamLine = (s: Stream) => smooth({ pts: s.pts, closed: false }, 2).pts

export function streamDirTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const { t } = landformTerrain('údolí', rng)
    const g = sample(t)
    const f = flow(g)
    const main = streams(g, f, 60)
      .filter((s) => !s.pit)
      .sort((a, b) => b.size - a.size)[0]
    if (!main || polyLength(main.pts) < 150) continue
    const pts = streamLine(main)
    const up = pointAt(pts, 6).p
    const down = pointAt(pts, polyLength(pts) - 22).p
    if (!inMap(up, 14) || !inMap(down, 14)) continue
    const m = buildMap(t, { grid: g, avoid: [up, down] })
    const i = m.interval
    const hUp = heightAt(t, up.x, up.y)
    const hDown = heightAt(t, down.x, down.y)
    if (hUp - hDown < 4 * i || m.labels.length < 2 || i > 20) continue
    m.streams = [pts]
    const downIsA = rng() < 0.5
    const [la, lb] = downIsA ? ['B', 'A'] : ['A', 'B']
    return {
      type: 'choice',
      key: `stream-dir-${r0(up.x)}-${r0(up.y)}`,
      kind: 'stream-dir',
      level: 3,
      eyebrow: 'Kudy teče potok',
      text: 'Potok teče údolím mezi body A a B. Kterým směrem teče?',
      map: m,
      marks: [
        { ...up, label: la },
        { ...down, label: lb },
      ],
      segs: [],
      reveal: [],
      options: [
        { id: 'A', label: 'Teče k A' },
        { id: 'B', label: 'Teče k B' },
      ],
      answer: lb,
      why: `Vrstevnice v údolí tvoří V se špičkou proti proudu, tedy k ${la}. Výška klesá z asi ${r0(hUp)}${NB}m u ${la} na ${r0(hDown)}${NB}m u ${lb}, potok teče k ${lb}.`,
    }
  }
  return fail('stream-dir')
}

export function streamLineTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    const rot = rng() * Math.PI * 2
    const d = unit(rot)
    const n = { x: -d.y, y: d.x }
    const c = centre(rng)
    const gap = between(rng, 80, 100)
    const v0 = add(c, n, -gap / 2)
    const r1 = add(c, n, gap / 2)
    const slope = between(rng, 0.5, 0.7)
    const t = terrain(between(rng, 450, 600), d.x * slope, d.y * slope, [
      { x: v0.x, y: v0.y, a: -between(rng, 70, 95), sx: 700, sy: between(rng, 22, 28), rot },
      { x: r1.x, y: r1.y, a: between(rng, 70, 95), sx: 700, sy: between(rng, 22, 28), rot },
    ])
    const valley = [add(v0, d, -55), add(v0, d, 55)]
    const ridge = [add(r1, d, -55), add(r1, d, 55)]
    if (![...valley, ...ridge].every((p) => inMap(p, 16))) continue
    if (landformAt(t, v0) !== 'údolí' || landformAt(t, r1) !== 'hřbet') continue
    const g = sample(t)
    const m = buildMap(t, { grid: g })
    if (m.interval > 20) continue
    // a piece of a contour line away from both
    let along: Pt[] | null = null
    for (const l of shuffle(m.lines, rng)) {
      const total = polyLength(l.pts)
      for (let s = 0; s + 100 < total && !along; s += 10) {
        const piece = Array.from({ length: 21 }, (_, k) => pointAt(l.pts, s + k * 5).p)
        if (!piece.every((p) => inMap(p, 18) && distToLine(p, valley) > 35 && distToLine(p, ridge) > 35)) continue
        // a plain slope there (no hidden hollow at the foot of the ridge)
        if ([5, 10, 15].every((k) => landformAt(t, piece[k]) === 'svah')) along = piece
      }
      if (along) break
    }
    if (!along) continue
    // water really gathers along the valley line: the main stream runs next to it
    const f = flow(g)
    const main = streams(g, f, 60).sort((a, b) => b.size - a.size)[0]
    if (!main || distToLine(v0, main.pts) > 8) continue
    const lines = shuffle(
      [
        { id: 'valley', pts: valley },
        { id: 'ridge', pts: ridge },
        { id: 'contour', pts: along },
      ],
      rng,
    )
    const num = (id: string) => String(lines.findIndex((l) => l.id === id) + 1)
    m.labels = placeLabels(t, m.lines, lines.flatMap((l) => l.pts))
    return {
      type: 'choice',
      key: `stream-line-${r0(c.x)}-${r0(c.y)}`,
      kind: 'stream-line',
      level: 3,
      eyebrow: 'Kudy teče potok',
      text: 'Kudy na této mapě poteče potok? Vyber čáru.',
      map: m,
      marks: [],
      segs: lines.map((l, k) => ({ pts: l.pts, label: String(k + 1), style: 'cand' as const })),
      reveal: [],
      options: lines.map((_, k) => ({ id: String(k + 1), label: `Čára ${k + 1}` })),
      answer: num('valley'),
      why: `Voda se sbírá v údolí, kde vrstevnice tvoří V proti svahu (čára ${num('valley')}). Z hřbetu (čára ${num('ridge')}) voda stéká do stran a podél vrstevnice (čára ${num('contour')}) neteče, protože tam je terén rovně.`,
    }
  }
  return fail('stream-line')
}

/* ------------------------------------------------------------------ level 9 */

export interface Tourist {
  t: Terrain
  g: Grid
  f: Flow
  m: MapData
  tops: Pt[]
  systems: { outlet: number; lines: Pt[][]; size: number; name?: string }[]
  streamCells: Map<number, number>
}

const STREAM_T = 70

/** Hilly Czech-like terrain (450–900 m) with streams that all leave the map. */
export function touristMap(rng: Rng): Tourist | null {
  const n = 3 + Math.floor(rng() * 2)
  const bumps: Bump[] = []
  for (let k = 0; k < 40 && bumps.length < n; k++) {
    const b = randomBump(rng, { aMin: 110, aMax: 270, sMin: 32, sMax: 55 })
    b.sy = b.sx * between(rng, 0.8, 1.7)
    if (!inMap(b, 45) || bumps.some((o) => dist(o, b) < 95)) continue
    bumps.push(b)
  }
  if (bumps.length < 3) return null
  const tilt = unit(rng() * Math.PI * 2)
  const s = between(rng, 0.25, 0.5)
  const t = terrain(between(rng, 450, 540), tilt.x * s, tilt.y * s, bumps)
  const g = sample(t)
  if (g.max > 960 || chooseInterval(g.min, g.max) !== 20) return null
  const f = flow(g)
  const all = streams(g, f, STREAM_T)
  if (all.some((x) => x.pit && x.size >= STREAM_T * 1.5)) return null
  const real = all.filter((x) => !x.pit)
  const sysMap = new Map<number, { outlet: number; lines: Pt[][]; size: number }>()
  const streamCells = new Map<number, number>()
  for (const st of real) {
    const sys = sysMap.get(st.outlet) ?? { outlet: st.outlet, lines: [], size: 0 }
    sys.lines.push(streamLine(st))
    sys.size = Math.max(sys.size, st.size)
    sysMap.set(st.outlet, sys)
  }
  // remember which system every stream cell belongs to
  for (let c = 0; c < g.nx * g.ny; c++) {
    if (f.acc[c] < STREAM_T) continue
    const out = outletOf(g, f, c).cell
    if (sysMap.has(out)) streamCells.set(c, out)
  }
  const systems = [...sysMap.values()].sort((a, b) => b.size - a.size)
  if (systems.length < 2) return null
  const tops = summits(t, g, 60, 22)
  if (tops.length < 3) return null
  const names = shuffle(STREAMS, rng)
  systems.slice(0, 2).forEach((sy, k) => Object.assign(sy, { name: names[k] }))
  const m = buildMap(t, { grid: g })
  m.mPerUnit = TOURIST_M_PER_UNIT
  m.streams = systems.flatMap((sy) => sy.lines)
  return { t, g, f, m, tops, systems, streamCells }
}

/** Places the names of the two named streams along their longest line. */
function nameStreams(tm: Tourist) {
  tm.m.streamNames = tm.systems
    .filter((s) => s.name)
    .map((s) => {
      const line = [...s.lines].sort((a, b) => polyLength(b) - polyLength(a))[0]
      const total = polyLength(line)
      const spots = [0.55, 0.45, 0.65, 0.35, 0.75, 0.25].map((f) => pointAt(line, total * f))
      const { p, dir } = spots.find((x) => inMap(x.p, 40)) ?? spots[0]
      let rot = (Math.atan2(dir.y, dir.x) * 180) / Math.PI
      if (rot > 90) rot -= 180
      if (rot < -90) rot += 180
      return { ...p, name: s.name!, rot }
    })
}

/** Gives the hill names and spot heights to the summits (all of them, or none). */
function hillSpots(tm: Tourist, rng: Rng, withHeights: boolean): Spot[] {
  const names = shuffle(HILLS, rng)
  return tm.tops.slice(0, 4).map((p, k) => ({ ...p, z: withHeights ? r0(heightAt(tm.t, p.x, p.y)) : NaN, name: names[k] }))
}

function relabel(tm: Tourist, avoid: Pt[]) {
  tm.m.labels = placeLabels(tm.t, tm.m.lines, [...avoid, ...tm.m.spots, ...(tm.m.hut ? [tm.m.hut] : [])])
}

export function highestTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 200; attempt++) {
    const tm = touristMap(rng)
    if (!tm) continue
    const i = tm.m.interval
    const cand = tm.tops.slice(0, 4)
    const zs = cand.map((p) => heightAt(tm.t, p.x, p.y))
    if (zs[0] - zs[1] < 2 * i) continue
    const spots = hillSpots(tm, rng, false)
    tm.m.spots = []
    nameStreams(tm)
    relabel(tm, cand)
    if (tm.m.labels.length < 2) continue
    const order = shuffle(
      cand.map((p, k) => ({ p, k })),
      rng,
    )
    const letter = (k: number) => 'ABCD'[order.findIndex((o) => o.k === k)]
    return {
      type: 'choice',
      key: `highest-${r0(cand[0].x)}-${r0(cand[0].y)}`,
      kind: 'highest',
      level: 9,
      eyebrow: 'Turistická mapa',
      text: 'Který z vrcholů A–D je nejvyšší?',
      map: tm.m,
      marks: order.map((o, k) => ({ ...o.p, label: 'ABCD'[k] })),
      segs: [],
      reveal: [],
      options: order.map((o, k) => ({ id: 'ABCD'[k], label: `${'ABCD'[k]}: ${spots[o.k].name}` })),
      answer: letter(0),
      why: `Vrchol ${letter(0)} (${spots[0].name}) má asi ${r0(zs[0])}${NB}m, druhý nejvyšší ${letter(1)} jen ${r0(zs[1])}${NB}m. Najdi nejvyšší popsanou vrstevnici a počítej uzavřené vrstevnice nad ní.`,
    }
  }
  return fail('highest')
}

/** A trail from a hut on a contour to the highest summit, through two bends. */
function trailOn(tm: Tourist, rng: Rng): { hut: Pt; hutLevel: number; way: Pt[] } | null {
  const top = tm.tops[0]
  const zTop = heightAt(tm.t, top.x, top.y)
  const i = tm.m.interval
  const cands = tm.m.lines.filter((l) => !l.index && l.level < zTop - 6 * i)
  for (let k = 0; k < 30; k++) {
    const l = pickOne(cands, rng)
    if (!l) return null
    const { p } = pointAt(l.pts, polyLength(l.pts) * rng())
    const dTop = dist(p, top)
    if (!inMap(p, 24) || dTop < 140 || dTop > 260) continue
    if (tm.m.streams.some((s) => distToLine(p, s) < 14)) continue
    const others = tm.m.lines.filter((o) => o.level !== l.level)
    if (distToContours(p, others) < 5) continue
    const d = { x: (top.x - p.x) / dTop, y: (top.y - p.y) / dTop }
    const nrm = { x: -d.y, y: d.x }
    const w1 = add(add(p, d, dTop * between(rng, 0.28, 0.38)), nrm, between(rng, -45, 45))
    const w2 = add(add(p, d, dTop * between(rng, 0.62, 0.72)), nrm, between(rng, -45, 45))
    if (!inMap(w1, 18) || !inMap(w2, 18)) continue
    return { hut: p, hutLevel: l.level, way: [p, w1, w2, top] }
  }
  return null
}

export function steepPartTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    const tm = touristMap(rng)
    if (!tm) continue
    const tr = trailOn(tm, rng)
    if (!tr) continue
    const i = tm.m.interval
    const secs = [0, 1, 2].map((k) => {
      const pts = [tr.way[k], tr.way[k + 1]]
      const hs = heightsAlong(tm.t, pts, 40)
      let climb = 0
      for (let j = 1; j < hs.length; j++) climb += Math.abs(hs[j] - hs[j - 1])
      const l = polyLength(pts)
      return { k, slope: climb / l, n: crossingsAlong(tm.t, pts, i), l }
    })
    const sorted = [...secs].sort((a, b) => b.slope - a.slope)
    if (sorted[0].slope < 1.5 * sorted[1].slope || sorted[0].n - (sorted[1].n * sorted[0].l) / sorted[1].l < 2) continue
    if (secs.some((s) => s.l < 45)) continue
    const spots = hillSpots(tm, rng, true)
    tm.m.spots = spots
    tm.m.trail = tr.way
    tm.m.hut = tr.hut
    nameStreams(tm)
    relabel(tm, tr.way)
    const L = ['A', 'B', 'C', 'D']
    const sec = (k: number) => `${L[k]}–${L[k + 1]}`
    const best = sorted[0]
    const pct = r0((best.slope / TOURIST_M_PER_UNIT) * 100)
    return {
      type: 'choice',
      key: `steep-part-${r0(tr.hut.x)}-${r0(tr.hut.y)}`,
      kind: 'steep-part',
      level: 9,
      eyebrow: 'Turistická mapa',
      text: `Turistická stezka vede od chaty (A) na vrchol ${spots[0].name} (D). Který úsek je nejstrmější?`,
      map: tm.m,
      marks: tr.way.map((p, k) => ({ ...p, label: L[k] })),
      segs: [],
      reveal: [],
      options: [0, 1, 2].map((k) => ({ id: sec(k), label: `Úsek ${sec(k)}` })),
      answer: sec(best.k),
      why: `Na úseku ${sec(best.k)} jsou vrstevnice podél stezky nejhustší (${vrstevnic(best.n)}): stoupá se tam asi ${pct}${NB}m na 100${NB}m cesty.`,
    }
  }
  return fail('steep-part')
}

export function climbTask(rng: Rng): NumberTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    const tm = touristMap(rng)
    if (!tm) continue
    const tr = trailOn(tm, rng)
    if (!tr) continue
    const spots = hillSpots(tm, rng, true)
    tm.m.spots = spots
    tm.m.trail = tr.way
    tm.m.hut = tr.hut
    nameStreams(tm)
    relabel(tm, [tr.hut])
    // the hut's contour must be easy to identify: a labelled contour nearby
    if (!tm.m.labels.some((l) => dist(l, tr.hut) < 110)) continue
    const top = spots[0]
    const answer = top.z - tr.hutLevel
    return {
      type: 'number',
      key: `climb-${r0(tr.hut.x)}-${r0(tr.hut.y)}`,
      kind: 'climb',
      level: 9,
      eyebrow: 'Turistická mapa',
      text: `Chata stojí přesně na vrstevnici. O kolik metrů výš je vrchol ${top.name} (${top.z}${NB}m)?`,
      map: tm.m,
      marks: [],
      segs: [],
      reveal: [],
      answer,
      tol: 2,
      unit: 'm',
      why: `Chata leží na vrstevnici ${tr.hutLevel}${NB}m (odpočítej po ${tm.m.interval}${NB}m od popsané vrstevnice), vrchol má ${top.z}${NB}m: ${top.z} − ${tr.hutLevel} = ${answer}${NB}m.`,
    }
  }
  return fail('climb')
}

/** The stream system water from p drains into (D8), or −1 when it leaves the map elsewhere. */
export function drainsTo(tm: Tourist, p: Pt): number {
  for (const c of outletOf(tm.g, tm.f, cellOf(tm.g, p)).path) {
    const s = tm.streamCells.get(c)
    if (s !== undefined) return s
  }
  return -1
}

export function waterTask(rng: Rng): ChoiceTask {
  for (let attempt = 0; attempt < 300; attempt++) {
    const tm = touristMap(rng)
    if (!tm) continue
    const named = tm.systems.filter((s) => s.name)
    for (let k = 0; k < 60; k++) {
      const p = { x: between(rng, 30, W - 30), y: between(rng, 30, H - 30) }
      if (tm.m.streams.some((s) => distToLine(p, s) < 26)) continue
      if (tm.tops.some((q) => dist(q, p) < 20)) continue
      const sys = drainsTo(tm, p)
      const target = named.find((s) => s.outlet === sys)
      if (!target) continue
      // unambiguous: the whole neighbourhood drains to the same stream
      const around = Array.from({ length: 12 }, (_, j) => add(p, unit((j * Math.PI) / 6), 10))
      if (around.some((q) => drainsTo(tm, q) !== sys)) continue
      // and the continuous descent agrees
      const path = descend(tm.t, p, 2, 600, (q) => tm.streamCells.has(cellOf(tm.g, q)))
      const end = path[path.length - 1]
      if (tm.streamCells.get(cellOf(tm.g, end)) !== sys) continue
      // the drop ends on a drawn line of that stream
      if (Math.min(...target.lines.map((l) => distToLine(end, l))) > 6) continue
      if (polyLength(path) < 30 || heightAt(tm.t, p.x, p.y) - heightAt(tm.t, end.x, end.y) < 1.5 * tm.m.interval) continue
      tm.m.spots = hillSpots(tm, rng, true)
      nameStreams(tm)
      relabel(tm, [p])
      const other = named.find((s) => s !== target)!
      const options = shuffle([target, other], rng).map((s) => ({ id: s.name!, label: s.name! }))
      return {
        type: 'choice',
        key: `water-${r0(p.x)}-${r0(p.y)}`,
        kind: 'water',
        level: 9,
        eyebrow: 'Kam teče voda',
        text: `V místě X zaprší. Do kterého potoka voda steče: ${named[0].name}, nebo ${named[1].name}?`,
        map: tm.m,
        marks: [{ ...p, label: 'X' }],
        segs: [],
        reveal: [{ pts: smooth({ pts: path, closed: false }, 1).pts, style: 'flow' }],
        options,
        answer: target.name!,
        why: `Voda teče z kopce nejkratší cestou dolů, tedy kolmo na vrstevnice. Z X steče ${STREAM_INTO[target.name!]}.`,
      }
    }
  }
  return fail('water')
}

/* ------------------------------------------------------------------ round */

const MAKERS: Record<TaskKind, (rng: Rng, form: Landform) => Task> = {
  'on-contour': (r) => onContourTask(r),
  between: (r) => betweenTask(r),
  interval: (r) => intervalTask(r),
  steeper: (r) => steeperTask(r),
  profile: (r) => profileTask(r),
  landform: (r, form) => landformTask(form, r),
  'stream-dir': (r) => streamDirTask(r),
  'stream-line': (r) => streamLineTask(r),
  highest: (r) => highestTask(r),
  'steep-part': (r) => steepPartTask(r),
  climb: (r) => climbTask(r),
  water: (r) => waterTask(r),
}

/** Kinds of one round: the level's list, or for free play a mix of all levels. */
export function roundKinds(level: number | undefined, rng: Rng): { kind: TaskKind; level: number }[] {
  if (level !== undefined && LEVELS[level]) return LEVELS[level].map((kind) => ({ kind, level }))
  const lv = Object.keys(LEVELS).map(Number)
  const queues = lv.map((l) => ({ l, ks: shuffle([...new Set(LEVELS[l])], rng) }))
  const out: { kind: TaskKind; level: number }[] = []
  for (let k = 0; out.length < ROUND; k++) {
    const q = queues[k % queues.length]
    out.push({ kind: q.ks[Math.floor(k / queues.length) % q.ks.length], level: q.l })
  }
  return out
}

export interface TaskSpec {
  kind: TaskKind
  level: number
  seed: number
  form: Landform
}

/**
 * One round (10 tasks) as specs; every task has its own seeded terrain and is built
 * on demand with buildTask (a terrain takes up to a few hundred ms, so the game
 * builds the next task only when it is needed).
 */
export function makeRound(level?: number, seed = Math.floor(Math.random() * 2 ** 31)): TaskSpec[] {
  const rng = seeded(seed)
  // every landform task of a round asks about a different landform
  const forms = shuffle(LANDFORMS, rng)
  let nForm = 0
  return roundKinds(level, rng).map(({ kind, level: lv }) => ({
    kind,
    level: lv,
    seed: Math.floor(rng() * 2 ** 31),
    form: forms[kind === 'landform' ? nForm++ % forms.length : 0],
  }))
}

export const buildTask = (s: TaskSpec): Task => MAKERS[s.kind](seeded(s.seed), s.form)

/** Accepts "120", "120 m", "120,0". */
export function checkNumber(input: string, t: { answer: number; tol: number }): { kind: 'invalid' } | { kind: 'ok' | 'wrong'; value: number } {
  const clean = input.replace(/m\b\.?/gi, '').replace(/[\s ]/g, '').replace('−', '-').replace(',', '.')
  if (!/^-?\d+(\.\d*)?$/.test(clean)) return { kind: 'invalid' }
  const value = Number(clean)
  return { kind: Math.abs(value - t.answer) <= t.tol ? 'ok' : 'wrong', value }
}

export { cellPt, type Pt }
