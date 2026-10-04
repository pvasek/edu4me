/**
 * Měřítko mapy – pure logic: unit conversions, task generation and answer checks.
 * Every answer is computed here from the scale (never typed by hand).
 */
import { levelNum } from '../types'
import { pick, shuffle } from '../shared/util'
import { CLASS_NAME, CLASS_SCALES, PLACES, PURPOSES, RULER_SCALES, SCALES, type MapClass } from './levels'

export type Rng = () => number

/** Content sets per level (the game has one level). */
export const LEVELS: Record<number, true> = { 1: true }
export const ROUND = 10

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

/** Small seeded generator (mulberry32) so tasks are reproducible in tests. */
export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------------------------------------------ numbers */

const NB = ' '

/** Czech number: decimal comma, a space in thousands, at most `digits` decimals, no trailing zeros. */
export function fmt(x: number, digits = 3): string {
  const neg = x < 0
  const r = Math.abs(Number(x.toFixed(digits)))
  const [int, dec] = String(r).includes('e') ? [r.toFixed(0), ''] : String(r).split('.')
  const grouped = int.length >= 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, NB) : int
  return (neg ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

/** "1 : 50 000" */
export const scaleText = (s: number) => `1${NB}:${NB}${fmt(s)}`

export type Unit = 'cm' | 'm' | 'km'
export const CM_PER: Record<Unit, number> = { cm: 1, m: 100, km: 100_000 }

/** Converts a length between cm, m and km. */
export const convert = (x: number, from: Unit, to: Unit) => (x * CM_PER[from]) / CM_PER[to]

/** Real distance (in `unit`) of `cm` centimetres on a map of scale 1 : s. */
export const realDistance = (cm: number, s: number, unit: Unit) => convert(cm * s, 'cm', unit)

/** Map distance in cm of a real distance `x` (in `unit`) at scale 1 : s. */
export const mapDistance = (x: number, unit: Unit, s: number) => convert(x, unit, 'cm') / s

/** A length with a unit that reads naturally: under 1 km in metres, otherwise km. */
export function niceLength(cmReal: number): { value: number; unit: Unit; text: string } {
  const unit: Unit = cmReal >= 100_000 ? 'km' : 'm'
  const value = convert(cmReal, 'cm', unit)
  return { value, unit, text: `${fmt(value)}${NB}${unit}` }
}

/** "1 cm na mapě = 50 000 cm = 500 m" */
export const oneCm = (s: number) => `1${NB}cm na mapě = ${fmt(s)}${NB}cm = ${niceLength(s).text}`

/** Parses "2,5", "2.5", "2 000", "2,5 km" → number; null when it is not a number. */
export function parseNum(input: string): number | null {
  const clean = input
    .replace(/\b(km|cm|m)\b\.?/gi, '')
    .replace(/^\s*1\s*:\s*/, '')
    .replace(/[\s  ]/g, '')
    .replace(/−/g, '-')
    .replace(',', '.')
  if (!/^-?\d+(\.\d*)?$|^-?\.\d+$/.test(clean)) return null
  const n = Number(clean)
  return Number.isFinite(n) ? n : null
}

/* ------------------------------------------------------------------ tasks */

export interface BarSpec {
  /** Real length of one 1-cm segment, in cm. */
  segCm: number
}

export interface Option {
  id: string
  label: string
  bar?: BarSpec
}

interface Base {
  /** Key for de-duplication inside a round. */
  key: string
  eyebrow: string
  text: string
  /** One-line explanation shown after the answer. */
  why: string
}

export interface NumberTask extends Base {
  type: 'number'
  answer: number
  unit: Unit | ''
  /** Shown in front of the input ("1 :" for a scale). */
  prefix?: string
  tol: number
  /** A graphic scale bar to read from, if any. */
  bar?: BarSpec
}

export interface ChoiceTask extends Base {
  type: 'choice'
  options: Option[]
  answer: string
  /** A graphic scale bar shown with the question. */
  bar?: BarSpec
}

export interface Pt {
  x: number
  y: number
}

export interface RulerMap {
  /** Map size in map-cm. */
  w: number
  h: number
  a: Pt & { name: string }
  b: Pt & { name: string }
  /** Optional point the route goes through. */
  via?: Pt & { name: string }
  /** Decoration: a river and a road (map-cm points), forest blobs. */
  river: Pt[]
  road: Pt[]
  forests: (Pt & { r: number })[]
}

export interface RulerTask extends Base {
  type: 'ruler'
  scale: number
  map: RulerMap
  /** Route length on the map in cm. */
  cm: number
  answer: number
  unit: Unit
  tol: number
}

export type Task = NumberTask | ChoiceTask | RulerTask

const EXACT = 1e-6
const rel = (x: number) => Math.max(EXACT, Math.abs(x) * 1e-6)

/** 1 cm on the map is how much in reality. */
export function cmEqualsTask(s: number): NumberTask {
  const n = niceLength(s)
  return {
    type: 'number',
    key: `cm-${s}`,
    eyebrow: 'Číselné měřítko',
    text: `Mapa má měřítko ${scaleText(s)}. Kolik ${n.unit === 'km' ? 'kilometrů' : 'metrů'} ve skutečnosti odpovídá 1${NB}cm na mapě?`,
    answer: n.value,
    unit: n.unit,
    tol: rel(n.value),
    why: `${oneCm(s)}.`,
  }
}

/** Graphic → numerical: "1 cm na mapě = 2 km", find the scale. */
export function denominatorTask(s: number): NumberTask {
  const n = niceLength(s)
  return {
    type: 'number',
    key: `den-${s}`,
    eyebrow: 'Z grafického na číselné',
    text: `1${NB}cm na mapě odpovídá ve skutečnosti ${n.text}. Jaké je číselné měřítko mapy?`,
    answer: s,
    unit: '',
    prefix: `1${NB}:`,
    tol: 0.5,
    why: `${n.text} = ${fmt(s)}${NB}cm, takže měřítko je ${scaleText(s)}.`,
  }
}

/** Map distance → real distance. */
export function toRealTask(s: number, cm: number): NumberTask {
  const real = niceLength(cm * s)
  const one = niceLength(s)
  return {
    type: 'number',
    key: `real-${s}-${cm}`,
    eyebrow: 'Z mapy do skutečnosti',
    text: `Na mapě ${scaleText(s)} naměříš mezi dvěma místy ${fmt(cm)}${NB}cm. Jak daleko jsou od sebe ve skutečnosti (v ${real.unit})?`,
    answer: real.value,
    unit: real.unit,
    tol: rel(real.value),
    why: `1${NB}cm = ${one.text}, takže ${fmt(cm)}${NB}cm = ${fmt(cm)} × ${one.text} = ${real.text}.`,
  }
}

/** Real distance → map distance. */
export function toMapTask(s: number, cm: number): NumberTask {
  const real = niceLength(cm * s)
  return {
    type: 'number',
    key: `map-${s}-${cm}`,
    eyebrow: 'Ze skutečnosti na mapu',
    text: `Dvě obce jsou od sebe ${real.text}. Kolik centimetrů to bude na mapě ${scaleText(s)}?`,
    answer: cm,
    unit: 'cm',
    tol: rel(cm),
    why: `${real.text} = ${fmt(cm * s)}${NB}cm; ${fmt(cm * s)} : ${fmt(s)} = ${fmt(cm)}${NB}cm.`,
  }
}

/** Labels of a scale bar: one segment = 1 cm on the map. */
export function barLabels(bar: BarSpec, segments = 4): string[] {
  const useKm = bar.segCm >= 100_000
  return Array.from({ length: segments + 1 }, (_, k) => {
    const v = convert(bar.segCm * k, 'cm', useKm ? 'km' : 'm')
    return k === segments ? `${fmt(v)}${NB}${useKm ? 'km' : 'm'}` : fmt(v)
  })
}

/** Read the numerical scale from a graphic scale bar. */
export function barReadTask(s: number, rng: Rng): ChoiceTask {
  const wrong = shuffle([s * 10, s / 10, s * 2, s / 2, s * 100].filter((x) => Number.isInteger(x) && x >= 500 && x !== s), rng).slice(0, 3)
  const options = shuffle([s, ...wrong], rng).map((x) => ({ id: String(x), label: scaleText(x) }))
  return {
    type: 'choice',
    key: `bread-${s}`,
    eyebrow: 'Grafické měřítko',
    text: 'Jeden dílek grafického měřítka je na mapě dlouhý 1 cm. Jaké je číselné měřítko této mapy?',
    bar: { segCm: s },
    options,
    answer: String(s),
    why: `Dílek 1${NB}cm = ${niceLength(s).text} = ${fmt(s)}${NB}cm, tedy ${scaleText(s)}.`,
  }
}

/** Pick the graphic scale bar that belongs to a numerical scale. */
export function barPickTask(s: number, rng: Rng): ChoiceTask {
  const wrong = shuffle([s * 10, s / 10, s * 2, s / 2].filter((x) => Number.isInteger(x) && x >= 500 && x !== s), rng).slice(0, 3)
  const options = shuffle([s, ...wrong], rng).map((x, k) => ({ id: String(x), label: `Měřítko ${'ABCD'[k]}`, bar: { segCm: x } }))
  return {
    type: 'choice',
    key: `bpick-${s}`,
    eyebrow: 'Grafické měřítko',
    text: `Které grafické měřítko patří k mapě ${scaleText(s)}? Každý dílek je na mapě dlouhý 1${NB}cm.`,
    options,
    answer: String(s),
    why: `${oneCm(s)}, takže dílky jsou po ${niceLength(s).text}.`,
  }
}

/** Which of two maps is larger-scale (more detailed) / covers more ground. */
export function largerTask(a: number, b: number, ask: 'detail' | 'area'): ChoiceTask {
  const big = Math.min(a, b)
  const small = Math.max(a, b)
  const answer = ask === 'detail' ? (a === big ? 'a' : 'b') : a === small ? 'a' : 'b'
  return {
    type: 'choice',
    key: `larger-${a}-${b}-${ask}`,
    eyebrow: 'Velké a malé měřítko',
    text:
      ask === 'detail'
        ? `Mapa A má měřítko ${scaleText(a)}, mapa B ${scaleText(b)}. Která má větší měřítko, tedy je podrobnější?`
        : `Mapa A má měřítko ${scaleText(a)}, mapa B ${scaleText(b)}. Na kterou se na stejně velký list vejde větší území?`,
    options: [
      { id: 'a', label: `A: ${scaleText(a)}` },
      { id: 'b', label: `B: ${scaleText(b)}` },
    ],
    answer,
    why:
      ask === 'detail'
        ? `Zlomek 1/${fmt(big)} je větší než 1/${fmt(small)}: čím menší číslo za dvojtečkou, tím větší měřítko a víc podrobností.`
        : `Na mapě ${scaleText(small)} je 1${NB}cm celých ${niceLength(small).text}, proto se na list vejde víc území (je to menší měřítko).`,
  }
}

/** Choose the scale that suits a purpose; one option from each map class. */
export function purposeTask(index: number, rng: Rng): ChoiceTask {
  const p = PURPOSES[index]
  const classes = Object.keys(CLASS_SCALES) as MapClass[]
  const options = classes.map((c) => {
    const s = pick(CLASS_SCALES[c], rng)
    return { id: c, label: scaleText(s) }
  })
  return {
    type: 'choice',
    key: `purpose-${index}`,
    eyebrow: 'Mapa pro daný účel',
    text: `${p.text} Jaké měřítko mapy zvolíš?`,
    options: shuffle(options, rng),
    answer: p.cls,
    why: `Hodí se ${CLASS_NAME[p.cls]}. ${p.why}`,
  }
}

/* ------------------------------------------------------------------ ruler */

export const MAP_W = 12
export const MAP_H = 9
/** Length of the virtual ruler in cm. */
export const RULER_CM = 10
const MARGIN = 0.9

export const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y)
export const routeCm = (m: Pick<RulerMap, 'a' | 'b' | 'via'>) => (m.via ? dist(m.a, m.via) + dist(m.via, m.b) : dist(m.a, m.b))

/** Inside the margins and away from the scale label in the top-right corner. */
const inside = (p: Pt) =>
  p.x >= MARGIN && p.x <= MAP_W - MARGIN && p.y >= MARGIN && p.y <= MAP_H - MARGIN && !(p.x > MAP_W - 5.4 && p.y < 1.8)
const round1 = (x: number) => Math.round(x * 10) / 10

/** A point at `d` cm from `p` in direction `ang` (radians). */
const step = (p: Pt, d: number, ang: number): Pt => ({ x: p.x + d * Math.cos(ang), y: p.y + d * Math.sin(ang) })

/** Generates the drawn map: points at whole millimetres apart, all inside the map. */
export function rulerMap(rng: Rng, withVia: boolean, names: [string, string, string]): RulerMap {
  for (let attempt = 0; attempt < 500; attempt++) {
    const a = { x: round1(MARGIN + rng() * (MAP_W - 2 * MARGIN)), y: round1(MARGIN + rng() * (MAP_H - 2 * MARGIN)) }
    if (!inside(a)) continue
    let via: Pt | undefined
    let b: Pt
    if (withVia) {
      const d1 = round1(2.5 + rng() * 3.5)
      const d2 = round1(2.5 + rng() * 3.5)
      const ang1 = rng() * Math.PI * 2
      const turn = (rng() < 0.5 ? -1 : 1) * (0.6 + rng() * 0.7)
      via = step(a, d1, ang1)
      b = step(via, d2, ang1 + turn)
    } else {
      const d = round1(3 + rng() * 6.5)
      b = step(a, d, rng() * Math.PI * 2)
    }
    if (!inside(b) || (via && !inside(via))) continue
    if (via && dist(a, b) < 2.5) continue
    // decoration: a river crossing the map, a road, forest blobs – kept away from the points
    const river: Pt[] = []
    const ry = 1 + rng() * (MAP_H - 2)
    const amp = 0.6 + rng() * 0.8
    const ph = rng() * 6
    for (let x = 0; x <= MAP_W + 0.01; x += 0.5) river.push({ x, y: ry + amp * Math.sin(x * 0.7 + ph) })
    const road: Pt[] = []
    const rx = 1 + rng() * (MAP_W - 2)
    for (let y = 0; y <= MAP_H + 0.01; y += 0.75) road.push({ x: rx + 0.5 * Math.sin(y * 0.9 + ph), y })
    const forests: (Pt & { r: number })[] = []
    for (let k = 0; k < 30 && forests.length < 4; k++) {
      const f = { x: rng() * MAP_W, y: rng() * MAP_H, r: 0.7 + rng() * 0.9 }
      const pts = via ? [a, b, via] : [a, b]
      if (pts.every((p) => dist(p, f) > f.r + 0.5)) forests.push(f)
    }
    return {
      w: MAP_W,
      h: MAP_H,
      a: { ...a, name: names[0] },
      b: { ...b, name: names[1] },
      via: via && { ...via, name: names[2] },
      river,
      road,
      forests,
    }
  }
  throw new Error('rulerMap: no layout found')
}

/** Allowed error of a ruler reading on the map, in cm (per measured segment). */
export const RULER_TOL_CM = 0.2

export function rulerTask(s: number, withVia: boolean, rng: Rng): RulerTask {
  const names = pick(PLACES, rng)
  const map = rulerMap(rng, withVia, names)
  const cm = routeCm(map)
  const unit: Unit = s <= 10_000 ? 'm' : 'km'
  const answer = realDistance(cm, s, unit)
  const tolCm = RULER_TOL_CM * (withVia ? 1.5 : 1)
  const one = niceLength(s)
  const cmR = round1(cm)
  return {
    type: 'ruler',
    key: `ruler-${s}-${withVia ? 'via' : 'line'}`,
    eyebrow: withVia ? 'Měření trasy' : 'Měření vzdušnou čarou',
    text: withVia
      ? `Přilož pravítko a změř cestu ${map.a.name} → ${map.via!.name} → ${map.b.name} (oba úseky). Kolik ${unit === 'km' ? 'kilometrů' : 'metrů'} je to ve skutečnosti?`
      : `Přilož pravítko a změř vzdušnou čarou vzdálenost ${map.a.name} → ${map.b.name}. Kolik ${unit === 'km' ? 'kilometrů' : 'metrů'} je to ve skutečnosti?`,
    scale: s,
    map,
    cm,
    answer,
    unit,
    tol: realDistance(tolCm, s, unit),
    why: `Na mapě je to asi ${fmt(cmR, 1)}${NB}cm. 1${NB}cm = ${one.text}, takže ${fmt(cmR, 1)}${NB}cm ≐ ${fmt(realDistance(cmR, s, unit), 2)}${NB}${unit}.`,
  }
}

/* ------------------------------------------------------------------ round */

const NICE_CM = [1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 12, 3.5, 4.5]

/** One round of ROUND tasks, from easy to harder, no two tasks alike. */
export function makeRound(rng: Rng = Math.random): Task[] {
  const s = () => pick(SCALES, rng)
  const used = new Set<string>()
  const out: Task[] = []
  const add = (make: () => Task) => {
    for (let k = 0; k < 50; k++) {
      const t = make()
      if (used.has(t.key)) continue
      used.add(t.key)
      out.push(t)
      return
    }
  }
  const pair = (): [number, number] => {
    for (;;) {
      const a = s()
      const b = s()
      if (Math.max(a, b) / Math.min(a, b) >= 4) return [a, b]
    }
  }
  add(() => cmEqualsTask(s()))
  add(() => toRealTask(pick([10_000, 25_000, 50_000, 100_000], rng), pick(NICE_CM, rng)))
  add(() => (rng() < 0.5 ? barReadTask(s(), rng) : barPickTask(s(), rng)))
  add(() => {
    const [a, b] = pair()
    return largerTask(a, b, rng() < 0.6 ? 'detail' : 'area')
  })
  add(() => denominatorTask(pick([10_000, 20_000, 25_000, 50_000, 100_000, 200_000, 500_000, 1_000_000], rng)))
  add(() => toMapTask(pick([25_000, 50_000, 100_000, 200_000, 500_000], rng), pick(NICE_CM, rng)))
  add(() => purposeTask(Math.floor(rng() * PURPOSES.length), rng))
  add(() => rulerTask(pick(RULER_SCALES, rng), false, rng))
  add(() => toRealTask(pick([200_000, 500_000, 1_000_000, 5_000, 20_000], rng), pick(NICE_CM, rng)))
  add(() => rulerTask(pick(RULER_SCALES, rng), true, rng))
  return out
}

/* ------------------------------------------------------------------ checks */

export type Check = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number; units: boolean }

/** Right within the task's tolerance; `units` flags an answer off by a power of ten (cm/m/km mix-up). */
export function checkNumber(input: string, t: { answer: number; tol: number }): Check {
  const value = parseNum(input)
  if (value === null) return { kind: 'invalid' }
  if (Math.abs(value - t.answer) <= t.tol + 1e-9) return { kind: 'ok', value }
  const ratio = value / t.answer
  const units = [10, 100, 1000, 100_000, 1e-1, 1e-2, 1e-3, 1e-5].some((f) => Math.abs(ratio / f - 1) < 0.05)
  return { kind: 'wrong', value, units }
}
