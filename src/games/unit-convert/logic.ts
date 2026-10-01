import { levelNum } from '../types'
import { shuffle } from '../shared/util'
import { LEVELS, UNITS, type Mode, type Quantity, type Unit } from './levels'

export const ROUND = 10
/** Accepted relative deviation of a typed answer: ±0,5 %. */
export const TOLERANCE = 0.005

export interface Task {
  level: number
  from: string
  to: string
  value: number
  answer: number
  /** 1 `from` = factor `to`. */
  factor: number
  mode: Mode
  /** 4 numbers (the answer among them) for choice tasks, ascending. */
  options?: number[]
}

// ------------------------------------------------------------------ numbers

/** Removes floating-point noise: 0.30000000000000004 → 0.3. */
export const clean = (x: number) => (x === 0 ? 0 : Number(x.toPrecision(12)))

/** Number of significant digits of a (cleaned) number. */
export function sigDigits(x: number): number {
  if (x === 0) return 1
  const m = Math.abs(clean(x)).toExponential(11).split('e')[0].replace('.', '').replace(/0+$/, '')
  return Math.max(1, m.length)
}

/** Decimal places of a (cleaned) number. */
export function decimals(x: number): number {
  const c = Math.abs(clean(x))
  const e = Math.floor(Math.log10(c))
  return Math.max(0, sigDigits(c) - 1 - e)
}

const NBSP = ' '
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
export const superscript = (n: number) => String(n).replace(/./g, (c) => SUP[c] ?? c)

/** Czech number: decimal comma, a (no-break) space between thousands: 12500.5 → "12 500,5". */
export function fmt(x: number): string {
  const c = clean(x)
  const neg = c < 0
  const abs = Math.abs(c)
  const d = abs === 0 ? 0 : Math.min(12, decimals(abs))
  let [int, dec] = abs.toFixed(d).split('.')
  if (int.length > 3) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
  return (neg ? '−' : '') + int + (dec ? ',' + dec : '')
}

/** Scientific notation "4,5·10⁻⁴" (plain number when the exponent is 0). */
export function fmtSci(x: number): string {
  if (x === 0) return '0'
  const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12)
  const m = clean(x / 10 ** e)
  if (e === 0) return fmt(m)
  return `${m === 1 ? '' : fmt(m) + '·'}10${superscript(e)}`
}

/** Plain for everyday magnitudes, scientific when very small or big. */
export function fmtAuto(x: number, sci: boolean): string {
  const a = Math.abs(x)
  return sci && a !== 0 && (a < 0.01 || a >= 1e5) ? fmtSci(x) : fmt(x)
}

/**
 * Parses what a learner typed: "2,5", "2.5", "2 500", "−3", "2,5e3", "2,5·10^3",
 * "2,5 × 10^-3", "2,5*10⁻³". Returns null when it is not a number.
 */
export function parseNumber(text: string): number | null {
  let s = text
    .trim()
    .replace(/[\s  ]/g, '')
    .replace(/[−–]/g, '-')
    .replace(/,/g, '.')
  // superscript exponent → ^n
  s = s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => Object.entries(SUP).find(([, v]) => v === c)?.[0] ?? '').join(''))
  s = s.replace(/^\^/, '')
  const sci = s.match(/^(-?\d*\.?\d+)(?:[·*×x]10\^?(-?\d+)|e(-?\d+))$/i)
  if (sci) {
    const n = Number(sci[1]) * 10 ** Number(sci[2] ?? sci[3])
    return Number.isFinite(n) ? clean(n) : null
  }
  const pow = s.match(/^10\^(-?\d+)$/)
  if (pow) return clean(10 ** Number(pow[1]))
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Mantissa and exponent fields of the scientific-notation input → number (empty exponent = 0). */
export function parseSci(mantissa: string, exponent: string): number | null {
  const m = parseNumber(mantissa)
  if (m === null) return null
  const e = exponent.trim().replace(/[−–]/g, '-')
  if (e === '' || e === '-') return m
  if (!/^-?\d{1,3}$/.test(e)) return null
  return clean(m * 10 ** Number(e))
}

// ------------------------------------------------------------------ conversions

export const unit = (sym: string): Unit => {
  const u = UNITS[sym]
  if (!u) throw new Error(`Unknown unit ${sym}`)
  return u
}

/** 1 `from` = factor `to`. */
export function factorOf(from: string, to: string): number {
  const a = unit(from)
  const b = unit(to)
  if (a.q !== b.q) throw new Error(`${from} and ${to} measure different quantities`)
  return clean(a.si / b.si)
}

export const convert = (value: number, from: string, to: string) => clean(value * factorOf(from, to))

/** True when the typed value is within the tolerance (±0,5 %). */
export function isRight(value: number, answer: number, tol = TOLERANCE): boolean {
  return Math.abs(value - answer) <= tol * Math.abs(answer) + 1e-15
}

// ------------------------------------------------------------------ values

const MANT = [1, 1.2, 1.5, 1.8, 2, 2.5, 3, 3.6, 4, 4.5, 5, 5.4, 6, 7.2, 7.5, 8, 9]

/** Sizes that occur in real life, in SI units (a speed of 10¹⁰ km/h is no task). */
const REAL: Record<Quantity, [number, number]> = {
  length: [1e-9, 1e7],
  area: [1e-10, 1e9],
  volume: [1e-9, 1e3],
  mass: [1e-9, 1e5],
  time: [1e-9, 1e6],
  speed: [0.5, 400],
  force: [1e-3, 1e8],
  pressure: [1, 1e9],
  energy: [1, 1e13],
  power: [1e-3, 1e10],
  current: [1e-7, 1e4],
  voltage: [1e-4, 1e6],
  resistance: [1e-3, 1e8],
  density: [0.1, 25000],
}

/** Is value→answer a fair task for the level (nice numbers of a real-life size)? */
function fair(level: number, v: number, a: number, u: Unit, to: Unit): boolean {
  if (sigDigits(a) > 3) return false
  const si = v * u.si
  const [lo, hi] = REAL[u.q]
  if (si < lo * (1 - 1e-9) || si > hi * (1 + 1e-9)) return false
  if (level >= 8) {
    // a prefixed unit is written with an everyday number (1 200 µm, not 1,2·10⁻³ µm)
    if (u.si !== 1 && (v < 0.1 || v > 1e4)) return false
    if (to.si !== 1 && (a < 0.001 || a > 1e5)) return false
    // at least one side needs scientific notation, except for derived units (g/cm³, km/h)
    return v < 0.01 || v >= 1e5 || a < 0.01 || a >= 1e5 || u.q === 'density' || u.q === 'speed'
  }
  const small = level <= 1 ? 0.01 : 0.001
  if (v < 0.1 || v > 50000 || a < small || a > 1e7) return false
  if (decimals(a) > (level <= 2 ? 3 : 4)) return false
  return true
}

/** All nice values that make a fair task for the conversion. */
export function valuesFor(level: number, from: string, to: string): number[] {
  const f = factorOf(from, to)
  const u = unit(from)
  const out: number[] = []
  for (let e = -9; e <= 11; e++) {
    for (const m of MANT) {
      const v = clean(m * 10 ** e)
      if (fair(level, v, clean(v * f), u, unit(to))) out.push(v)
    }
  }
  return out
}

// ------------------------------------------------------------------ distractors

/** Three wrong but tempting answers: the wrong direction, a wrong number of steps, a linear area/volume step. */
export function distractors(value: number, from: string, to: string, rng: () => number = Math.random): number[] {
  const f = factorOf(from, to)
  const a = clean(value * f)
  const uf = unit(from)
  const ut = unit(to)
  const first: number[] = []
  if (uf.ladder && ut.ladder && uf.ladder.base === ut.ladder.base && uf.ladder.dim > 1) {
    first.push(clean(value * 10 ** (uf.ladder.p - ut.ladder.p))) // stepped as if it were a length
  }
  first.push(clean(value / f)) // converted the wrong way
  const near = shuffle([clean(a * 10), clean(a / 10)], rng)
  const far = shuffle([clean(a * 100), clean(a / 100), clean(a * 1000), clean(a / 1000)], rng)
  const seen = new Set([fmt(a)])
  const out: number[] = []
  for (const d of [...first, ...near, ...far]) {
    if (out.length >= 3) break
    if (!(d > 0) || d < 1e-9 || d > 1e13 || sigDigits(d) > 4) continue
    const k = fmt(d)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(d)
  }
  return out
}

// ------------------------------------------------------------------ explanation

/** The factor as learners write it: "1 000", "3,6", "10⁻⁶". */
function fmtFactor(f: number, sci: boolean): string {
  const e = Math.log10(f)
  if (sci && Math.abs(e - Math.round(e)) < 1e-9 && Math.abs(e) >= 4) return `10${superscript(Math.round(e))}`
  return sci ? fmtAuto(f, true) : fmt(f)
}

/** One line: "1 km = 1 000 m, tedy ×1 000 → 2,5 km = 2 500 m." */
export function explain(t: Pick<Task, 'from' | 'to' | 'value' | 'level'>): string {
  const sci = t.level >= 8
  const f = factorOf(t.from, t.to)
  const a = clean(t.value * f)
  const uf = unit(t.from)
  const ut = unit(t.to)
  // state the relation with the nicer number: 1 kWh = 3,6 MJ rather than 1 MJ = 0,2777… kWh
  const big = f >= 1 ? sigDigits(f) <= 4 : sigDigits(1 / f) > 4
  const k = big ? f : clean(1 / f)
  let rel = big ? `1 ${t.from} = ${fmtFactor(k, sci)} ${t.to}` : `1 ${t.to} = ${fmtFactor(k, sci)} ${t.from}`
  const dim = uf.ladder && ut.ladder && uf.ladder.base === ut.ladder.base ? uf.ladder.dim : 1
  if (dim > 1 && k !== 1) {
    const step = fmt(clean(k ** (1 / dim)))
    rel += ` (${Array(dim).fill(step).join(' · ')})`
  }
  if (t.from === 'km/h' || t.to === 'km/h') rel += ' (1\u00a0000 m za 3\u00a0600 s)'
  const op = f === 1 ? 'číslo se nemění' : big ? `tedy ×${fmtFactor(k, sci)}` : `tedy :${fmtFactor(k, sci)}`
  const line = `${rel}, ${op} → ${fmtAuto(t.value, sci)} ${t.from} = ${fmtAuto(a, sci)} ${t.to}.`
  // a number never ends a line apart from its unit
  return line.replace(/([\d⁰¹²³⁴⁵⁶⁷⁸⁹]) (?=[A-Za-zµΩ])/g, `$1${NBSP}`)
}

/** Prefix steps between two ladder units ("3 schody dolů"), or null for units off the ladder. */
export function ladderSteps(from: string, to: string): { from: number; to: number; dim: number; base: string } | null {
  const a = unit(from).ladder
  const b = unit(to).ladder
  if (!a || !b || a.base !== b.base || a.dim !== b.dim) return null
  return { from: a.p, to: b.p, dim: a.dim, base: a.base }
}

// ------------------------------------------------------------------ rounds

/** Level whose set is played; undefined = mix of all levels. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

function makeTask(level: number, i: number, from: string, to: string, used: Set<string>, rng: () => number): Task | null {
  const vals = valuesFor(level, from, to).filter((v) => !used.has(`${from}>${to}:${v}`))
  if (!vals.length) return null
  const value = vals[Math.floor(rng() * vals.length)]
  used.add(`${from}>${to}:${value}`)
  const factor = factorOf(from, to)
  const answer = clean(value * factor)
  const mode = LEVELS[level].mode(i)
  const task: Task = { level, from, to, value, answer, factor, mode }
  if (mode === 'choice') task.options = [answer, ...distractors(value, from, to, rng)].sort((x, y) => x - y)
  return task
}

/**
 * A round of ROUND tasks from one level, or from all levels taking turns (free play).
 * No conversion is asked twice with the same value; pairs repeat only after the level's list is used up.
 */
export function makeRound(level?: number, rng: () => number = Math.random, n = ROUND): Task[] {
  const levels = level !== undefined && LEVELS[level] ? [level] : shuffle(Object.keys(LEVELS).map(Number), rng)
  const queues = new Map<number, [string, string][]>()
  const counts = new Map<number, number>()
  const used = new Set<string>()
  const out: Task[] = []
  let guard = 0
  while (out.length < n && guard++ < 500) {
    const lv = levels[out.length % levels.length]
    let q = queues.get(lv)
    if (!q || !q.length) {
      q = shuffle(LEVELS[lv].pairs, rng)
      queues.set(lv, q)
    }
    const [from, to] = q.shift()!
    const i = counts.get(lv) ?? 0
    const t = makeTask(lv, i, from, to, used, rng)
    if (!t) continue
    counts.set(lv, i + 1)
    out.push(t)
  }
  return out
}
