/**
 * Výslednice sil – pure physics and task generation. Every answer is computed
 * here from the generated forces; nothing is typed in by hand.
 */
import { levelNum } from '../types'
import { parseDecimal, pick, shuffle } from '../shared/util'
import {
  ANGLE_SCENES,
  COMPONENT_SCENES,
  INCLINE_SCENES,
  LINE_SCENES,
  type BodyShape,
  type Range,
} from './levels'

/** Round length. */
export const ROUND = 10
/** Relative tolerance of a magnitude (±2 %), never tighter than ±0,05 of the unit. */
export const REL_TOL = 0.02
export const ABS_TOL = 0.05
/** Angle tolerance in degrees. */
export const ANGLE_TOL = 3
/** g for level 2 (ZŠ estimates) and level 8. */
export const G_ZS = 10
export const G = 9.81

export interface Force {
  label: string
  who: string
  mag: number
  /** Degrees from +x, counter-clockwise, 0 ≤ angle < 360. */
  angle: number
  /** Level 2: the force is a weight given through a mass (kg). */
  mass?: number
  massOf?: string
}

export interface Vec {
  x: number
  y: number
}

export interface Polar {
  mag: number
  angle: number
}

interface Base {
  /** Unique within a round (scene + task type). */
  key: string
  level: number
  title: string
  text: string
  unit: 'N' | 'kN'
}

export interface ResultantTask extends Base {
  kind: 'resultant'
  body: BodyShape
  forces: Force[]
  answer: Polar
  /** Directions offered as arrows to pick from (degrees). */
  choices: number[]
}

export interface BalanceTask extends Base {
  kind: 'balance'
  body: BodyShape
  forces: Force[]
  answer: Polar
  /** Level 2: only the four axis directions; level 8: any angle. */
  axisOnly: boolean
  /** Snap step of the dragged arrow. */
  snap: number
}

export interface ComponentTask extends Base {
  kind: 'component'
  body: BodyShape
  force: Force
  axis: 'x' | 'y'
  answer: number
}

export interface InclineTask extends Base {
  kind: 'incline'
  mass: number
  alpha: number
  part: 'par' | 'perp'
  weight: number
  answer: number
}

export type Task = ResultantTask | BalanceTask | ComponentTask | InclineTask

/* ------------------------------------------------------------------ vectors */

const RAD = Math.PI / 180

export const norm360 = (a: number) => ((a % 360) + 360) % 360

export function toVec(p: Polar): Vec {
  // round away floating noise so cos(90°) is exactly 0
  const r = (v: number) => Math.round(v * 1e9) / 1e9
  return { x: r(p.mag * Math.cos(p.angle * RAD)), y: r(p.mag * Math.sin(p.angle * RAD)) }
}

export function toPolar(v: Vec): Polar {
  const mag = Math.hypot(v.x, v.y)
  if (mag < 1e-9) return { mag: 0, angle: 0 }
  return { mag, angle: norm360(Math.atan2(v.y, v.x) / RAD) }
}

export function sumVec(forces: Polar[]): Vec {
  return forces.map(toVec).reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 })
}

/** The resultant of the forces (magnitude and direction). */
export const resultant = (forces: Polar[]): Polar => toPolar(sumVec(forces))

/** The force that balances the others: the resultant turned by 180°. */
export function balancing(forces: Polar[]): Polar {
  const s = sumVec(forces)
  return toPolar({ x: -s.x, y: -s.y })
}

/** Smallest difference between two directions in degrees (0–180). */
export function angleDiff(a: number, b: number): number {
  const d = Math.abs(norm360(a) - norm360(b))
  return Math.min(d, 360 - d)
}

/** Component of a force along x (horizontal) or y (vertical). */
export const component = (f: Polar, axis: 'x' | 'y') => Math.abs(toVec(f)[axis])

/** Weight components on an incline of angle alpha: parallel m·g·sin α, perpendicular m·g·cos α. */
export function inclineParts(mass: number, alpha: number, g = G) {
  const weight = mass * g
  return { weight, par: weight * Math.sin(alpha * RAD), perp: weight * Math.cos(alpha * RAD) }
}

/* ------------------------------------------------------------------ checking */

/** Allowed deviation of a magnitude. */
export const tolerance = (answer: number) => Math.max(ABS_TOL, Math.abs(answer) * REL_TOL)

export type Check = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

/** Accepts "12,5", "12.5", "12,5 N", "12 kN". */
export function checkNumber(input: string, answer: number): Check {
  const value = parseDecimal(input.replace(/k?N\s*$/i, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - answer) <= tolerance(answer) + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}

export const parseAngle = (input: string) => {
  const v = parseDecimal(input.replace(/°\s*$/, ''))
  return v === null ? null : norm360(v)
}

export type Verdict = 'ok' | 'wrong-mag' | 'wrong-dir' | 'wrong-both'

/** Magnitude within tolerance, direction within ±3° (ignored when the answer is 0). */
export function judgeVector(mag: number, angle: number | null, answer: Polar): Verdict {
  const magOk = Math.abs(mag - answer.mag) <= tolerance(answer.mag) + 1e-9
  const dirOk = answer.mag < 1e-9 || (angle !== null && angleDiff(angle, answer.angle) <= ANGLE_TOL)
  return magOk && dirOk ? 'ok' : magOk ? 'wrong-dir' : dirOk ? 'wrong-mag' : 'wrong-both'
}

/* ------------------------------------------------------------------ generation */

type Rng = () => number

export function draw([min, max, step]: Range, rng: Rng): number {
  const n = Math.round((max - min) / step)
  return round6(min + Math.floor(rng() * (n + 1)) * step)
}

const round6 = (x: number) => Math.round(x * 1e6) / 1e6

/** Czech number: decimal comma, at most `digits` decimals, no trailing zeros. */
export function cz(x: number, digits = 1): string {
  const r = round6(Math.round(x * 10 ** digits) / 10 ** digits)
  const s = String(Math.abs(r)).replace('.', ',')
  const [int, dec] = s.split(',')
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int
  return (r < 0 ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

/** Direction words for the four axis directions. */
export const DIR_WORD: Record<number, string> = { 0: 'doprava', 90: 'nahoru', 180: 'doleva', 270: 'dolů' }

function lineTask(sceneId: string, kind: 'resultant' | 'balance', rng: Rng): ResultantTask | BalanceTask {
  const sc = LINE_SCENES.find((s) => s.id === sceneId)!
  for (let attempt = 0; attempt < 400; attempt++) {
    const forces: Force[] = sc.forces.map((f) => {
      if (f.mass) {
        const mass = draw(f.mass, rng)
        return { label: f.label, who: f.who, mag: round6(mass * G_ZS), angle: f.angle, mass, massOf: f.massOf }
      }
      return { label: f.label, who: f.who, mag: draw(f.range!, rng), angle: f.angle }
    })
    const massNote = forces
      .filter((f) => f.mass !== undefined)
      .map((f) => `${cap(f.massOf!)} má hmotnost ${cz(f.mass!)} kg.`)
      .join(' ')
    if (kind === 'balance') {
      const hidden = forces[sc.balance!]
      const given = forces.filter((_, i) => i !== sc.balance)
      const answer = balancing(given)
      // the hidden force must point the way the scene says (e.g. friction backwards)
      if (answer.mag < 1e-9 || angleDiff(answer.angle, hidden.angle) > 1) continue
      return {
        kind: 'balance',
        key: `${sc.id}:balance`,
        level: 2,
        title: sc.title,
        text: `${sc.text}${massNote ? ' ' + massNote : ''} ${sc.balanceText}`,
        unit: 'N',
        body: sc.body,
        forces: given,
        answer: { mag: round6(answer.mag), angle: Math.round(answer.angle) },
        axisOnly: true,
        snap: sc.snap,
      }
    }
    const r = resultant(forces)
    if (sc.nonNegative && r.mag > 1e-9 && angleDiff(r.angle, forces[0].angle) > 1) continue
    return {
      kind: 'resultant',
      key: `${sc.id}:resultant`,
      level: 2,
      title: sc.title,
      text: `${sc.text}${massNote ? ' ' + massNote : ''} Urči velikost a směr výslednice.`,
      unit: 'N',
      body: sc.body,
      forces,
      answer: { mag: round6(r.mag), angle: r.mag < 1e-9 ? 0 : Math.round(r.angle) },
      choices: [0, 90, 180, 270],
    }
  }
  throw new Error(`cannot generate ${sceneId}`)
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Direction choices for a resultant at an angle: the right one + three clearly different distractors. */
export function directionChoices(correct: number, forces: Polar[], rng: Rng): number[] {
  const candidates = shuffle(
    [
      norm360(-correct),
      norm360(correct + 180),
      norm360(180 - correct),
      norm360(correct + 35),
      norm360(correct - 35),
      norm360(correct + 70),
      ...forces.map((f) => norm360(f.angle)),
    ].map((a) => Math.round(a)),
    rng,
  )
  const out = [Math.round(norm360(correct))]
  for (const c of candidates) {
    if (out.length >= 4) break
    if (out.every((o) => angleDiff(o, c) >= 25)) out.push(c)
  }
  for (let a = 0; out.length < 4 && a < 360; a += 45) if (out.every((o) => angleDiff(o, a) >= 25)) out.push(a)
  return shuffle(out, rng)
}

function angleTask(sceneId: string, rng: Rng): ResultantTask | BalanceTask {
  const sc = ANGLE_SCENES.find((s) => s.id === sceneId)!
  for (let attempt = 0; attempt < 400; attempt++) {
    const forces: Force[] = sc.forces.map((f) => ({ label: f.label, who: f.who, mag: draw(f.range, rng), angle: pick(f.angles, rng) }))
    const r = resultant(forces)
    // avoid degenerate cases (almost cancelling forces)
    const total = forces.reduce((a, f) => a + f.mag, 0)
    if (r.mag < total * 0.15) continue
    const u = sc.unit
    if (sc.kind === 'balance') {
      const b = balancing(forces)
      return {
        kind: 'balance',
        key: `${sc.id}:balance`,
        level: 8,
        title: sc.title,
        text: `${sc.text} Přidej sílu F, která těleso udrží v klidu.`,
        unit: u,
        body: sc.body,
        forces,
        answer: { mag: round6(b.mag), angle: round6(b.angle) },
        axisOnly: false,
        snap: sc.snap,
      }
    }
    return {
      kind: 'resultant',
      key: `${sc.id}:resultant`,
      level: 8,
      title: sc.title,
      text: `${sc.text} Spočítej velikost výslednice v ${u} a vyber šipku jejího směru.`,
      unit: u,
      body: sc.body,
      forces,
      answer: { mag: round6(r.mag), angle: round6(r.angle) },
      choices: directionChoices(r.angle, forces, rng),
    }
  }
  throw new Error(`cannot generate ${sceneId}`)
}

function componentTask(sceneId: string, axis: 'x' | 'y', rng: Rng): ComponentTask {
  const sc = COMPONENT_SCENES.find((s) => s.id === sceneId)!
  const mag = draw(sc.range, rng)
  const angle = pick(sc.angles, rng)
  const force: Force = { label: 'F', who: sc.title, mag, angle }
  const what = axis === 'x' ? 'vodorovná složka F_{x} (táhne vpřed)' : 'svislá složka F_{y} (nadlehčuje)'
  return {
    kind: 'component',
    key: `${sc.id}:${axis}`,
    level: 8,
    title: sc.title,
    text: `${sc.text.replace('{F}', `${cz(mag)} ${sc.unit}`).replace('{a}', `${angle}°`)} Jak velká je ${what}?`,
    unit: sc.unit,
    body: sc.body,
    force,
    axis,
    answer: round6(component(force, axis)),
  }
}

function inclineTask(sceneId: string, part: 'par' | 'perp', rng: Rng): InclineTask {
  const sc = INCLINE_SCENES.find((s) => s.id === sceneId)!
  const mass = draw(sc.mass, rng)
  const alpha = pick(sc.angles, rng)
  const p = inclineParts(mass, alpha)
  const k = sc.unit === 'kN' ? 1000 : 1
  const what =
    part === 'par' ? 'složka tíhové síly rovnoběžná se svahem F_{1} (táhne dolů po svahu)' : 'složka tíhové síly kolmá ke svahu F_{2} (tlačí do svahu)'
  return {
    kind: 'incline',
    key: `${sc.id}:${part}`,
    level: 8,
    title: sc.title,
    text: `${sc.text.replace('{m}', `${cz(mass)} kg`).replace('{a}', `${alpha}°`)} Jak velká je ${what}? (g = 9,81 N/kg)`,
    unit: sc.unit,
    mass,
    alpha,
    part,
    weight: p.weight / k,
    answer: round6((part === 'par' ? p.par : p.perp) / k),
  }
}

/** A task recipe: which scene and which task type. The numbers are drawn when the task is built. */
export interface Slot {
  key: string
  level: number
  group: string
  build: (rng: Rng) => Task
}

export function slotsFor(level: number): Slot[] {
  if (level === 2) {
    const out: Slot[] = []
    for (const sc of LINE_SCENES) {
      if (sc.resultant) out.push({ key: `${sc.id}:resultant`, level, group: 'resultant', build: (r) => lineTask(sc.id, 'resultant', r) })
      if (sc.balance !== undefined) out.push({ key: `${sc.id}:balance`, level, group: 'balance', build: (r) => lineTask(sc.id, 'balance', r) })
    }
    return out
  }
  const out: Slot[] = []
  for (const sc of ANGLE_SCENES) out.push({ key: `${sc.id}:${sc.kind}`, level, group: sc.kind, build: (r) => angleTask(sc.id, r) })
  for (const sc of COMPONENT_SCENES)
    for (const axis of ['x', 'y'] as const) out.push({ key: `${sc.id}:${axis}`, level, group: 'component', build: (r) => componentTask(sc.id, axis, r) })
  for (const sc of INCLINE_SCENES)
    for (const part of ['par', 'perp'] as const) out.push({ key: `${sc.id}:${part}`, level, group: 'incline', build: (r) => inclineTask(sc.id, part, r) })
  return out
}

export const LEVEL_NUMBERS = [2, 8] as const

/** Level number whose set is played; undefined = mix of both. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && (LEVEL_NUMBERS as readonly number[]).includes(n) ? n : undefined
}

/** Takes slots so that task types alternate (round-robin over groups in random order). */
function interleave(slots: Slot[], n: number, rng: Rng): Slot[] {
  const groups = new Map<string, Slot[]>()
  for (const s of shuffle(slots, rng)) groups.set(s.group, [...(groups.get(s.group) ?? []), s])
  const queues = shuffle([...groups.values()], rng)
  const out: Slot[] = []
  while (out.length < n && queues.some((q) => q.length))
    for (const q of queues) if (out.length < n && q.length) out.push(q.shift()!)
  return out
}

/** A round of 10 tasks: one level's set, or both levels mixed (5 + 5), easier level first. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const slots =
    level !== undefined
      ? interleave(slotsFor(level), ROUND, rng)
      : [...interleave(slotsFor(2), ROUND / 2, rng), ...interleave(slotsFor(8), ROUND / 2, rng)]
  return slots.map((s) => s.build(rng))
}

/* ------------------------------------------------------------------ explanations */

/** Sensible decimals for a shown result. */
export const fmt = (x: number) => cz(x, Math.abs(x) < 10 ? 2 : 1)

const weightNotes = (forces: Force[]) =>
  forces
    .filter((f) => f.mass !== undefined)
    .map((f) => `${f.label} = m · g = ${cz(f.mass!)} kg · 10 N/kg = ${cz(f.mag)} N. `)
    .join('')

/** One line (Czech, <Md> markup) saying why the answer is what it is. */
export function explain(t: Task): string {
  const u = t.unit
  if (t.kind === 'component') {
    const fn = t.axis === 'x' ? 'cos' : 'sin'
    return `F_{${t.axis}} = F · ${fn} α = ${cz(t.force.mag)} ${u} · ${fn} ${t.force.angle}° ≐ ${fmt(t.answer)} ${u}.`
  }
  if (t.kind === 'incline') {
    const fn = t.part === 'par' ? 'sin' : 'cos'
    return `F_{G} = m · g = ${cz(t.mass)} kg · 9,81 N/kg ≐ ${fmt(t.weight)} ${u}; F_{${t.part === 'par' ? 1 : 2}} = F_{G} · ${fn} ${t.alpha}° ≐ ${fmt(t.answer)} ${u}.`
  }
  if (t.level === 2) {
    const notes = weightNotes(t.forces)
    const byDir = new Map<number, number[]>()
    for (const f of t.forces) byDir.set(f.angle, [...(byDir.get(f.angle) ?? []), f.mag])
    const parts = [...byDir.entries()].map(([a, ms]) => ({ a, ms, sum: ms.reduce((x, y) => x + y, 0) }))
    const say = (p: { a: number; ms: number[]; sum: number }) =>
      `${DIR_WORD[p.a]} ${p.ms.length > 1 ? `${p.ms.map((m) => cz(m)).join(' + ')} = ` : ''}${cz(p.sum)} N`
    const sides = parts.map(say).join(', ')
    if (t.kind === 'resultant') {
      if (t.answer.mag === 0) return `${notes}${cap(sides)} – síly se vyrovnají, výslednice je 0 N (rovnováha).`
      if (parts.length === 1) return `${notes}Síly stejného směru se sčítají: F = ${cz(t.answer.mag)} N ${DIR_WORD[t.answer.angle]}.`
      const [big, small] = [...parts].sort((a, b) => b.sum - a.sum)
      return `${notes}${cap(sides)} → F = ${cz(big.sum)} − ${cz(small.sum)} = ${cz(t.answer.mag)} N ${DIR_WORD[t.answer.angle]}.`
    }
    if (parts.length === 1)
      return `${notes}${cap(sides)}. F musí být stejně velká a mířit opačně: ${cz(t.answer.mag)} N ${DIR_WORD[t.answer.angle]}.`
    return `${notes}${cap(sides)}. V rovnováze musí F rozdíl vyrovnat: ${cz(t.answer.mag)} N ${DIR_WORD[t.answer.angle]}.`
  }
  const s = sumVec(t.forces)
  const comps = `F_{x} = ${fmt(s.x)} ${u}, F_{y} = ${fmt(s.y)} ${u}`
  const r = toPolar(s)
  if (t.kind === 'resultant')
    return `Sečti složky: ${comps} → F = √(F_{x}^{2} + F_{y}^{2}) ≐ ${fmt(r.mag)} ${u}, úhel ≐ ${cz(r.angle, 0)}°.`
  return `${comps}, výslednice ≐ ${fmt(r.mag)} ${u} pod úhlem ${cz(r.angle, 0)}°. F je stejně velká a opačná: ${fmt(t.answer.mag)} ${u}, ${cz(t.answer.angle, 0)}°.`
}

/** Hint after a first wrong try. */
export function hint(t: Task, verdict: Verdict | 'wrong'): string {
  if (t.kind === 'component') return `Složka ${t.axis === 'x' ? 'vodorovná' : 'svislá'} = F · ${t.axis === 'x' ? 'cos' : 'sin'} α. Máš kalkulačku v režimu stupňů?`
  if (t.kind === 'incline') return `Nejdřív F_{G} = m · g, pak ${t.part === 'par' ? 'rovnoběžná složka = F_{G} · sin α' : 'kolmá složka = F_{G} · cos α'}.`
  if (verdict === 'wrong-dir') return 'Velikost sedí, ale směr ne. Kam míří větší síla?'
  if (t.level === 2) {
    if (t.forces.some((f) => f.mass !== undefined)) return 'Tíhovou sílu spočítej z hmotnosti: F_{G} = m · g, g = 10 N/kg. Síly stejného směru sečti, opačné odečti.'
    return 'Síly stejného směru se sčítají, opačného směru se odečítají.'
  }
  return 'Rozlož síly do složek: F_{x} = F · cos α, F_{y} = F · sin α, sečti je a použij Pythagorovu větu.'
}
