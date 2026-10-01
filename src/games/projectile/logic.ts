import { levelNum } from '../types'
import { parseDecimal, shuffle } from '../shared/util'
import { BODIES, LEVELS, MIX, type Body, type BodyId, type Plan, type ThrowKind } from './levels'

// ------------------------------------------------------------------ controls

export const ANGLE_MIN = 0
export const ANGLE_MAX = 85
export const V_MIN = 1
export const V_MAX = 40
export const V_STEP = 0.5
export const MAX_SHOTS = 5
/** Points for a hit with the 1st, 2nd… shot: fewer shots = more points. */
export const SHOT_POINTS = [100, 70, 50, 35, 25]
export const BONUS = 20
export const PER_TASK = SHOT_POINTS[0] + BONUS
/** Orbital velocity is accepted within ±3 %. */
export const ORBIT_TOL = 0.03

const RAD = Math.PI / 180

// ------------------------------------------------------------------ numbers

/** Czech number with at most `d` decimals: 12.5 → "12,5", −0.5 → "−0,5", 1678 → "1 678". */
export function cz(x: number, d = 1): string {
  const r = Math.round(x * 10 ** d) / 10 ** d
  let [int, dec] = Math.abs(r).toFixed(d).split('.')
  if (dec) dec = dec.replace(/0+$/, '')
  if (int.length > 3) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (r < 0 ? '−' : '') + int + (dec ? ',' + dec : '')
}

// ------------------------------------------------------------------ physics (no air resistance)

export interface Launch {
  /** Elevation angle in degrees (0 = horizontal). */
  angle: number
  /** Launch speed v₀, m/s. */
  v: number
}

/** Position after time t, from launch height h0. */
export function position(l: Launch, g: number, h0: number, t: number): { x: number; y: number } {
  const c = Math.cos(l.angle * RAD)
  const s = Math.sin(l.angle * RAD)
  return { x: l.v * c * t, y: h0 + l.v * s * t - (g * t * t) / 2 }
}

/** Height of the trajectory above the ground at horizontal distance x. */
export function heightAt(l: Launch, g: number, h0: number, x: number): number {
  const c = Math.cos(l.angle * RAD)
  const t = x / (l.v * c)
  return position(l, g, h0, t).y
}

/** Time until the projectile is back at height `yLevel` on the way down (null if it never gets there). */
export function timeDownTo(l: Launch, g: number, h0: number, yLevel: number): number | null {
  const vy = l.v * Math.sin(l.angle * RAD)
  const disc = vy * vy + 2 * g * (h0 - yLevel)
  if (disc < 0) return null
  return (vy + Math.sqrt(disc)) / g
}

/** Range on flat ground from height h0: where y = 0. */
export function rangeOnGround(l: Launch, g: number, h0 = 0): number {
  const t = timeDownTo(l, g, h0, 0)!
  return l.v * Math.cos(l.angle * RAD) * t
}

/** Highest point above the ground. */
export const apex = (l: Launch, g: number, h0 = 0) => h0 + (l.v * Math.sin(l.angle * RAD)) ** 2 / (2 * g)

/** First cosmic (orbital) velocity just above the surface: g = v²/R → v = √(g·R). */
export const orbitalVelocity = (b: Body) => Math.sqrt(b.g * b.R)

// ------------------------------------------------------------------ tasks

export interface Target {
  /** Centre of the target, m from the launcher. */
  x: number
  /** Height of the target surface (0 = ground, > 0 = top of a platform). */
  y: number
  /** Half-width: a landing within x ± w is a hit. */
  w: number
}

export interface ThrowTask {
  kind: 'throw'
  level: number
  throwKind: ThrowKind
  body: Body
  /** Launch height (a tower for horizontal throws), m. */
  h0: number
  target: Target
  /** One launch that hits the centre (used to build the target and shown after 5 misses). */
  solution: Launch
  /** Angle fixed at 0° for horizontal throws. */
  fixedAngle?: number
}

export interface OrbitTask {
  kind: 'orbit'
  level: number
  body: Body
  /** m/s */
  answer: number
}

export type Task = ThrowTask | OrbitTask

const between = (rng: () => number, a: number, b: number) => a + Math.floor(rng() * (b - a + 1))
const halfSteps = (rng: () => number, a: number, b: number) => between(rng, a * 2, b * 2) / 2

/** Horizontal distance where the shot comes down onto the level y (descending branch). */
export const landingX = (l: Launch, g: number, h0: number, y: number) => {
  const t = timeDownTo(l, g, h0, y)
  return t === null ? null : l.v * Math.cos(l.angle * RAD) * t
}

/** Distances in view that suit a body (weak gravity → longer throws). */
const REACH: Record<BodyId, [number, number]> = { zeme: [10, 60], mesic: [20, 150], mars: [15, 100], jupiter: [4, 30] }

/**
 * A reachable target: pick a launch inside the slider range, compute where it lands,
 * put the target there. Every task therefore has at least one exact solution.
 */
export function makeThrow(kind: ThrowKind, bodyId: BodyId, level: number, rng: () => number = Math.random): ThrowTask {
  const body = BODIES[bodyId]
  const g = body.g
  const [lo, hi] = REACH[bodyId]
  for (let guard = 0; guard < 2000; guard++) {
    if (kind === 'horizontal') {
      const h0 = [5, 8, 10, 12, 15, 20, 25, 30][between(rng, 0, 7)]
      const v = halfSteps(rng, 3, 25)
      const sol = { angle: 0, v }
      const x = rangeOnGround(sol, g, h0)
      if (x < lo || x > hi) continue
      return { kind: 'throw', level, throwKind: kind, body, h0, target: { x, y: 0, w: Math.max(0.8, 0.05 * x) }, solution: sol, fixedAngle: 0 }
    }
    if (kind === 'ground') {
      const angle = between(rng, 20, 70)
      const v = halfSteps(rng, 5, 30)
      const sol = { angle, v }
      const x = rangeOnGround(sol, g, 0)
      if (x < lo || x > hi) continue
      return { kind: 'throw', level, throwKind: kind, body, h0: 0, target: { x, y: 0, w: Math.max(1, 0.04 * x) }, solution: sol }
    }
    // platform: land on top of a block of height H
    const H = between(rng, 3, 12)
    const angle = between(rng, 35, 70)
    const v = halfSteps(rng, 8, 30)
    const sol = { angle, v }
    if (apex(sol, g) < H + 2) continue
    const x = landingX(sol, g, 0, H)
    if (x === null || x < lo || x > hi) continue
    const w = Math.max(1.2, 0.05 * x)
    // the shot that hits the centre must clear the near edge of the block
    if (heightAt(sol, g, 0, x - w) < H + 0.3) continue
    return { kind: 'throw', level, throwKind: kind, body, h0: 0, target: { x, y: H, w }, solution: sol }
  }
  throw new Error(`No target for ${kind} on ${bodyId}`)
}

export const makeOrbit = (bodyId: BodyId, level: number): OrbitTask => ({ kind: 'orbit', level, body: BODIES[bodyId], answer: orbitalVelocity(BODIES[bodyId]) })

// ------------------------------------------------------------------ a shot

export type Outcome = 'hit' | 'short' | 'long' | 'wall'

export interface Shot {
  launch: Launch
  outcome: Outcome
  /** Where it stopped (landing, or impact on the block's wall). */
  end: { x: number; y: number }
  /** Flight time until `end`, s. */
  time: number
  /** Points of the trajectory (every ~1/60 of the flight), from the launcher to `end`. */
  path: { x: number; y: number }[]
}

/** Flies the projectile, stopping on the ground, on the platform top or at the platform's near wall. */
export function shoot(task: ThrowTask, launch: Launch): Shot {
  const g = task.body.g
  const { x: tx, y: ty, w } = task.target
  const cx = launch.v * Math.cos(launch.angle * RAD)
  let end: { x: number; y: number }
  let time: number
  let outcome: Outcome
  const tGround = timeDownTo(launch, g, task.h0, 0)!
  const xGround = cx * tGround
  if (ty > 0) {
    const left = tx - w
    const right = tx + w
    const tLeft = cx > 0 ? left / cx : Infinity
    const yLeft = tLeft < tGround ? position(launch, g, task.h0, tLeft).y : -1
    const tTop = timeDownTo(launch, g, task.h0, ty)
    const xTop = tTop === null ? null : cx * tTop
    if (yLeft >= 0 && yLeft < ty && xGround > left) {
      // hits the near wall of the block
      end = { x: left, y: yLeft }
      time = tLeft
      outcome = 'wall'
    } else if (xTop !== null && xTop >= left && xTop <= right) {
      end = { x: xTop, y: ty }
      time = tTop!
      outcome = 'hit'
    } else {
      end = { x: xGround, y: 0 }
      time = tGround
      outcome = xGround < left ? 'short' : 'long'
    }
  } else {
    end = { x: xGround, y: 0 }
    time = tGround
    outcome = Math.abs(xGround - tx) <= w ? 'hit' : xGround < tx ? 'short' : 'long'
  }
  const n = 60
  const path = Array.from({ length: n + 1 }, (_, i) => position(launch, g, task.h0, (time * i) / n))
  path[n] = end
  return { launch, outcome, end, time, path }
}

/** Points for a hit with shot number `shots` (1-based) and time bonus; 0 when missed. */
export function throwPoints(hit: boolean, shots: number, bonus: number): number {
  if (!hit) return 0
  return (SHOT_POINTS[shots - 1] ?? 0) + bonus
}

// ------------------------------------------------------------------ explanations

/** One line with the formula and the numbers of this launch. */
export function explainThrow(task: ThrowTask, l: Launch): string {
  const g = cz(task.body.g, 2)
  if (task.throwKind === 'horizontal') {
    const t = timeDownTo(l, task.body.g, task.h0, 0)!
    return `Vodorovný vrh: t = √(2h / g) = √(2 · ${cz(task.h0)} m / ${g} m/s²) = ${cz(t, 2)} s, d = v₀ · t = ${cz(l.v)} m/s · ${cz(t, 2)} s = ${cz(l.v * t)} m.`
  }
  if (task.throwKind === 'ground') {
    const d = rangeOnGround(l, task.body.g, 0)
    return `Šikmý vrh: d = v₀² · sin 2α / g = ${cz(l.v)}² · sin ${cz(2 * l.angle, 0)}° / ${g} = ${cz(d)} m.`
  }
  const x = task.target.x
  const y = heightAt(l, task.body.g, 0, x)
  return `Šikmý vrh: y = x · tg α − g · x² / (2 · v₀² · cos² α) = ${cz(x)} · tg ${cz(l.angle, 0)}° − ${g} · ${cz(x)}² / (2 · ${cz(l.v)}² · cos² ${cz(l.angle, 0)}°) = ${cz(y)} m (plošina: ${cz(task.target.y)} m).`
}

/** Short verdict of a missed shot with a hint which way to change it. */
export function missText(task: ThrowTask, shot: Shot): string {
  const off = Math.abs(shot.end.x - task.target.x)
  if (shot.outcome === 'wall') return `Narazil do stěny plošiny ve výšce ${cz(shot.end.y)} m – potřebuješ vyšší oblouk.`
  const where = `Dopad ve vzdálenosti ${cz(shot.end.x)} m, o ${cz(off)} m ${shot.outcome === 'short' ? 'blíž' : 'dál'} než střed cíle.`
  if (task.fixedAngle !== undefined) return `${where} ${shot.outcome === 'short' ? 'Přidej' : 'Uber'} rychlost.`
  return `${where} ${shot.outcome === 'short' ? 'Přidej rychlost, nebo zvol úhel blíž 45°.' : 'Uber rychlost, nebo zvol úhel dál od 45°.'}`
}

export function explainOrbit(b: Body): string {
  const v = orbitalVelocity(b)
  return `Tíha tu působí jako dostředivá síla: g = v² / R, tedy v = √(g · R) = √(${cz(b.g, 2)} m/s² · ${cz(b.R, 0)} m) ≈ ${cz(v, 0)} m/s = ${cz(v / 1000, 2)} km/s.`
}

/** What a satellite launched at `v` (m/s) just above the surface would do. */
export function orbitFate(b: Body, v: number): 'fall' | 'circle' | 'ellipse' | 'escape' {
  const v1 = orbitalVelocity(b)
  if (v < v1 * (1 - ORBIT_TOL)) return 'fall'
  if (v <= v1 * (1 + ORBIT_TOL)) return 'circle'
  if (v < v1 * Math.SQRT2) return 'ellipse'
  return 'escape'
}

/** Typed orbital velocity in km/s → 'ok' within ±3 %. */
export function checkOrbit(text: string, b: Body): { kind: 'invalid' } | { kind: 'ok' | 'wrong'; v: number } {
  const km = parseDecimal(text)
  if (km === null || km <= 0) return { kind: 'invalid' }
  const v = km * 1000
  return { kind: Math.abs(v - orbitalVelocity(b)) <= ORBIT_TOL * orbitalVelocity(b) ? 'ok' : 'wrong', v }
}

// ------------------------------------------------------------------ rounds

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && n in LEVELS ? n : undefined
}

const levelOfPlan = (p: Plan) => (p.body === 'zeme' && p.kind !== 'orbit' ? 8 : 9)

function makeTask(p: Plan, rng: () => number): Task {
  const lv = levelOfPlan(p)
  return p.kind === 'orbit' ? makeOrbit(p.body, lv) : makeThrow(p.kind, p.body, lv, rng)
}

/** Unique key of a task (no two identical targets in a round). */
export const taskKey = (t: Task) =>
  t.kind === 'orbit' ? `orbit:${t.body.id}` : `${t.throwKind}:${t.body.id}:${t.h0}:${t.target.x.toFixed(2)}:${t.target.y}`

/** A round: the level's plan (first task kept easy, the rest lightly shuffled), all targets distinct. */
export function makeRound(level?: number, rng: () => number = Math.random): Task[] {
  const plan = level !== undefined && LEVELS[level] ? LEVELS[level] : MIX
  const [first, ...rest] = plan
  const order = [first, ...shuffle(rest, rng)]
  const seen = new Set<string>()
  return order.map((p) => {
    for (let i = 0; i < 50; i++) {
      const t = makeTask(p, rng)
      if (!seen.has(taskKey(t))) {
        seen.add(taskKey(t))
        return t
      }
    }
    throw new Error('Could not build distinct tasks')
  })
}
