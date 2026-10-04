/**
 * Stavitel obvodů – pure circuit physics.
 *
 * A circuit is a source (U_e, R_i) feeding a series–parallel network of parts.
 * Everything the game shows (meter readings, brightness, what happens when a
 * switch opens, whether a built circuit meets its goal) is computed here by a
 * small series/parallel reduction solver – no hand-typed answers.
 *
 * Ideal meters: an ammeter has 0 Ω, a voltmeter an infinite resistance
 * (it is drawn and solved as a parallel branch across what it measures).
 */

export type Part =
  | { t: 'lamp'; id: string; r: number; burnt?: boolean }
  | { t: 'res'; id: string; r: number }
  | { t: 'switch'; id: string; closed: boolean }
  | { t: 'A'; id: string }
  | { t: 'V'; id: string }
  | { t: 'wire'; id?: string }
  /** Empty place in a "build" task. Solved as an open gap until something is put in. */
  | { t: 'slot'; id: string }

export type Group = { t: 'ser'; items: Net[] } | { t: 'par'; items: Net[] }
export type Net = Part | Group

export interface Circuit {
  /** Electromotive force U_e in volts. */
  ue: number
  /** Internal resistance R_i in ohms (0 at ZŠ level). */
  ri: number
  net: Net
}

export const ser = (...items: Net[]): Group => ({ t: 'ser', items })
export const par = (...items: Net[]): Group => ({ t: 'par', items })
export const lamp = (id: string, r: number): Part => ({ t: 'lamp', id, r })
export const res = (id: string, r: number): Part => ({ t: 'res', id, r })
export const sw = (id = 'S', closed = true): Part => ({ t: 'switch', id, closed })
export const amm = (id = 'A'): Part => ({ t: 'A', id })
export const volt = (id = 'V'): Part => ({ t: 'V', id })
export const wire = (id?: string): Part => ({ t: 'wire', id })
export const slot = (id: string): Part => ({ t: 'slot', id })

export const isGroup = (n: Net): n is Group => n.t === 'ser' || n.t === 'par'

/** Resistance of a (sub)network in ohms; Infinity = open, 0 = short. */
export function resistance(n: Net): number {
  switch (n.t) {
    case 'lamp':
      return n.burnt ? Infinity : n.r
    case 'res':
      return n.r
    case 'switch':
      return n.closed ? 0 : Infinity
    case 'A':
    case 'wire':
      return 0
    case 'V':
    case 'slot':
      return Infinity
    case 'ser':
      return n.items.reduce((s, x) => s + resistance(x), 0)
    case 'par': {
      const rs = n.items.map(resistance)
      if (rs.some((r) => r === 0)) return 0
      const g = rs.reduce((s, r) => (Number.isFinite(r) ? s + 1 / r : s), 0)
      return g === 0 ? Infinity : 1 / g
    }
  }
}

export interface Flow {
  /** Current through the part or group in A. */
  I: number
  /** Voltage across it in V. */
  U: number
}

export interface Solution {
  /** Current drawn from the source (A); Infinity for a dead short with R_i = 0. */
  I: number
  /** Terminal voltage U = U_e − R_i·I. */
  U: number
  /** Resistance of the external circuit. */
  R: number
  /** The external circuit has zero resistance. */
  short: boolean
  /** Flow through every node (by object identity). */
  node: Map<Net, Flow>
  /** Flow through every part with an id. */
  part: Map<string, Flow>
}

const mul = (i: number, r: number) => (r === 0 || i === 0 ? 0 : i * r)

function spread(n: Net, I: number, U: number, sol: Solution) {
  sol.node.set(n, { I, U })
  if (!isGroup(n)) {
    if ('id' in n && n.id) sol.part.set(n.id, { I, U })
    return
  }
  if (n.t === 'ser') {
    const rs = n.items.map(resistance)
    const R = rs.reduce((a, b) => a + b, 0)
    if (Number.isFinite(R)) {
      n.items.forEach((x, k) => spread(x, I, mul(I, rs[k]), sol))
    } else {
      // Open series string: no current, the whole voltage sits across the gap(s).
      const gaps = rs.filter((r) => !Number.isFinite(r)).length
      n.items.forEach((x, k) => spread(x, 0, Number.isFinite(rs[k]) ? 0 : U / gaps, sol))
    }
    return
  }
  const rs = n.items.map(resistance)
  const zeros = rs.filter((r) => r === 0).length
  n.items.forEach((x, k) => {
    let i: number
    if (zeros) i = rs[k] === 0 ? I / zeros : 0
    else i = Number.isFinite(rs[k]) ? U / rs[k] : 0
    spread(x, i, U, sol)
  })
}

/** Solves the circuit by series/parallel reduction. */
export function solve(c: Circuit): Solution {
  const R = resistance(c.net)
  let I: number
  let U: number
  if (!Number.isFinite(R)) {
    I = 0
    U = c.ue
  } else if (R + c.ri === 0) {
    I = Infinity
    U = 0
  } else {
    I = c.ue / (R + c.ri)
    U = c.ue - c.ri * I
  }
  const sol: Solution = { I, U, R, short: R === 0, node: new Map(), part: new Map() }
  spread(c.net, I, U, sol)
  return sol
}

/** Power of a part in W (0 for anything without resistance or current). */
export function power(sol: Solution, id: string): number {
  const f = sol.part.get(id)
  if (!f || !Number.isFinite(f.I) || !Number.isFinite(f.U)) return 0
  return f.U * f.I
}

/** Reading of a meter: ammeter → current, voltmeter → voltage. */
export function reading(c: Circuit, sol: Solution, id: string): number {
  const p = findPart(c.net, id)
  const f = sol.part.get(id)
  if (!p || !f) return NaN
  return p.t === 'V' ? f.U : f.I
}

// ------------------------------------------------------------------ tree helpers

export function parts(n: Net, out: Part[] = []): Part[] {
  if (isGroup(n)) n.items.forEach((x) => parts(x, out))
  else out.push(n)
  return out
}

export function findPart(n: Net, id: string): Part | undefined {
  return parts(n).find((p) => 'id' in p && p.id === id)
}

export const lampIds = (n: Net) => parts(n).flatMap((p) => (p.t === 'lamp' ? [p.id] : []))

/** Copy of the net with `fn` applied to every part. */
export function mapParts(n: Net, fn: (p: Part) => Net): Net {
  if (isGroup(n)) return { t: n.t, items: n.items.map((x) => mapParts(x, fn)) }
  return fn(n)
}

export interface Change {
  /** Switch that opens. */
  open?: string
  /** Lamp that burns out. */
  burnt?: string
  /** Switch that closes. */
  close?: string
}

export function applyChange(c: Circuit, ch: Change): Circuit {
  return {
    ...c,
    net: mapParts(c.net, (p) => {
      if (p.t === 'switch' && p.id === ch.open) return { ...p, closed: false }
      if (p.t === 'switch' && p.id === ch.close) return { ...p, closed: true }
      if (p.t === 'lamp' && p.id === ch.burnt) return { ...p, burnt: true }
      return p
    }),
  }
}

/** Sets every switch to `closed`. */
export const setSwitches = (c: Circuit, closed: boolean): Circuit => ({
  ...c,
  net: mapParts(c.net, (p) => (p.t === 'switch' ? { ...p, closed } : p)),
})

/** Puts pieces into the slots (slot id → piece); empty slots stay open gaps. */
export function fill(c: Circuit, placed: Record<string, Part | undefined>): Circuit {
  return { ...c, net: mapParts(c.net, (p) => (p.t === 'slot' && placed[p.id] ? placed[p.id]! : p)) }
}

export const slotIds = (n: Net) => parts(n).flatMap((p) => (p.t === 'slot' ? [p.id] : []))

/** The innermost group containing both parts (series or parallel relation). */
export function relation(n: Net, a: string, b: string): 'ser' | 'par' | null {
  const has = (x: Net, id: string) => parts(x).some((p) => 'id' in p && p.id === id)
  let cur: Net = n
  let rel: 'ser' | 'par' | null = null
  for (;;) {
    if (!isGroup(cur)) return rel
    rel = cur.t
    const inner: Net | undefined = cur.items.find((x) => has(x, a) && has(x, b))
    if (!inner) return rel
    cur = inner
  }
}

// ------------------------------------------------------------------ labels & numbers

const SUB = '₀₁₂₃₄₅₆₇₈₉'
/** "Z1" → "Ž₁", "R2" → "R₂", "S" → "S". */
export function label(id: string): string {
  const m = id.match(/^([A-Za-z]+)(\d*)$/)
  if (!m) return id
  const base = m[1] === 'Z' ? 'Ž' : m[1]
  return base + [...m[2]].map((d) => SUB[Number(d)]).join('')
}

/** Czech number: 3 significant digits (at most `maxDec` decimals), decimal comma, real minus. */
export function fmt(x: number, maxDec = 3): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞'
  const abs = Math.abs(x)
  const dec = abs === 0 ? 0 : Math.min(maxDec, Math.max(0, 2 - Math.floor(Math.log10(abs))))
  let s = abs.toFixed(dec)
  if (s.includes('.')) s = s.replace(/\.?0+$/, '')
  const neg = x < 0 && Number(s) !== 0
  return (neg ? '−' : '') + s.replace('.', ',')
}

/** Number with a unit separated by a space: "1,5 A". */
export const q = (x: number, unit: string, maxDec = 3) => `${fmt(x, maxDec)} ${unit}`

/** Parses "1,5", "1.5", " 1,5 A", "−0,5" → number; null when it is not a number. */
export function parseNum(s: string): number | null {
  const clean = s
    .replace(/\s/g, '')
    .replace(/[−–]/g, '-')
    .replace(/(mA|kΩ|Ω|ohm|A|V|W|D|cm|m)$/i, '')
    .replace(',', '.')
  if (!/^-?\d+(\.\d*)?$|^-?\.\d+$/.test(clean)) return null
  const n = Number(clean)
  return Number.isFinite(n) ? n : null
}

/** Relative tolerance of numeric answers: ±2 %. */
export const REL_TOL = 0.02

export function within(value: number, answer: number, rel = REL_TOL): boolean {
  return Math.abs(value - answer) <= Math.max(Math.abs(answer) * rel, 0.005) + 1e-9
}

// ------------------------------------------------------------------ brightness & changes

/** Power of each lamp in W. */
export function lampPowers(c: Circuit, sol = solve(c)): Record<string, number> {
  return Object.fromEntries(lampIds(c.net).map((id) => [id, power(sol, id)]))
}

/** Id of the brightest lamp, or 'same' when all lamps shine equally (within 1 %). */
export function brightest(c: Circuit): string {
  const p = lampPowers(c)
  const ids = Object.keys(p)
  const max = Math.max(...ids.map((id) => p[id]))
  const min = Math.min(...ids.map((id) => p[id]))
  if (max - min <= max * 0.01) return 'same'
  return ids.reduce((best, id) => (p[id] > p[best] ? id : best), ids[0])
}

/** Ratio between the brightest lamp's power and the second one (how clear the answer is). */
export function brightnessMargin(c: Circuit): number {
  const ps = Object.values(lampPowers(c)).sort((a, b) => b - a)
  return ps.length < 2 || ps[1] === 0 ? Infinity : ps[0] / ps[1]
}

export type Effect = 'off' | 'brighter' | 'dimmer' | 'same'
export const EFFECTS: Effect[] = ['off', 'brighter', 'dimmer', 'same']
export const EFFECT_TEXT: Record<Effect, string> = {
  off: 'zhasne',
  brighter: 'svítí jasněji',
  dimmer: 'svítí slaběji',
  same: 'svítí stejně',
}

/** What happens to lamp `target` after the change. */
export function effectOn(c: Circuit, ch: Change, target: string): Effect {
  const before = power(solve(c), target)
  const after = power(solve(applyChange(c, ch)), target)
  if (after <= 1e-9) return 'off'
  if (after > before * 1.02) return 'brighter'
  if (after < before * 0.98) return 'dimmer'
  return 'same'
}

// ------------------------------------------------------------------ build goals

export type Goal =
  /** Both lamps shine with S closed; opening S turns off only `lamp`. */
  | { t: 'switchOnly'; lamp: string }
  /** All lamps shine with S closed, all go off with S open. */
  | { t: 'switchAll' }
  /** All lamps shine and the ammeter shows the current of `lamp` only. */
  | { t: 'ammeterOnly'; lamp: string }
  /** All lamps shine and the voltmeter shows the source voltage. */
  | { t: 'voltSource' }
  /** All lamps shine and each keeps shining when another one burns out. */
  | { t: 'independent' }
  /** Meter `meter` shows `value` (±2 %). */
  | { t: 'value'; meter: string; value: number }

export interface GoalCheck {
  ok: boolean
  /** Czech one-liner: what is wrong (or right). */
  why: string
}

/** Why a lamp does not shine in this circuit (Czech, short). */
function whyDark(c: Circuit, sol: Solution, id: string): string {
  const L = label(id)
  if (sol.short) return `Zkrat! Proud teče jen drátem mimo žárovky a ${L} nesvítí.`
  if (sol.I === 0) {
    const open = parts(c.net).find((p) => p.t === 'V' || (p.t === 'switch' && !p.closed))
    if (open?.t === 'V') return `Obvod je přerušený: voltmetr zapojený do série má obrovský odpor, a tak ${L} nesvítí.`
    return `Obvod je přerušený, proud neteče a ${L} nesvítí.`
  }
  const f = sol.part.get(id)
  if (f && f.U === 0) return `${L} nesvítí – je zkratovaná, proud jde vedle ní drátem nebo ampérmetrem.`
  return `${L} nesvítí – její větev je přerušená (voltmetr nebo rozpojený spínač v sérii).`
}

const lit = (sol: Solution, id: string) => power(sol, id) > 1e-9

export function checkGoal(c: Circuit, goal: Goal): GoalCheck {
  const on = setSwitches(c, true)
  const sOn = solve(on)
  const lamps = lampIds(c.net)
  const dark = lamps.find((id) => !lit(sOn, id))
  if (goal.t !== 'value' && dark) return { ok: false, why: whyDark(on, sOn, dark) }

  switch (goal.t) {
    case 'switchOnly': {
      if (!parts(c.net).some((p) => p.t === 'switch')) return { ok: false, why: 'Spínač nemá své místo v obvodu.' }
      const off = solve(setSwitches(c, false))
      if (lit(off, goal.lamp)) return { ok: false, why: `Po rozepnutí spínače ${label(goal.lamp)} pořád svítí – spínač musí být ve stejné větvi jako ona.` }
      const other = lamps.find((id) => id !== goal.lamp && !lit(off, id))
      if (other) return { ok: false, why: `Po rozepnutí spínače zhasne i ${label(other)} – spínač je v hlavní větvi, ovládá všechno.` }
      return { ok: true, why: `Spínač je v sérii jen s ${label(goal.lamp)}, druhá žárovka má svou vlastní větev.` }
    }
    case 'switchAll': {
      const off = solve(setSwitches(c, false))
      const still = lamps.find((id) => lit(off, id))
      if (still) return { ok: false, why: `Po rozepnutí spínače ${label(still)} pořád svítí – spínač musí být v hlavní (nerozvětvené) části obvodu.` }
      return { ok: true, why: 'Spínač je v nerozvětvené části obvodu, takže přeruší proud do všech žárovek.' }
    }
    case 'ammeterOnly': {
      const I = reading(on, sOn, 'A')
      const want = sOn.part.get(goal.lamp)!.I
      if (!within(I, want, 0.005)) {
        return {
          ok: false,
          why: within(I, sOn.I, 0.005)
            ? `Ampérmetr ukazuje ${q(I, 'A')}, celkový proud ze zdroje. Proud ${label(goal.lamp)} je jen ${q(want, 'A')} – ampérmetr patří do její větve.`
            : `Ampérmetr ukazuje ${q(I, 'A')}, ale žárovkou ${label(goal.lamp)} teče ${q(want, 'A')}.`,
        }
      }
      if (within(I, sOn.I, 0.005) && lamps.length > 1) return { ok: false, why: 'Ampérmetr měří celkový proud, ne proud jedné žárovky.' }
      return { ok: true, why: `Ampérmetr je v sérii s ${label(goal.lamp)} ve stejné větvi, měří tedy jen její proud.` }
    }
    case 'voltSource': {
      const U = reading(on, sOn, 'V')
      if (!within(U, sOn.U, 0.005)) return { ok: false, why: `Voltmetr ukazuje ${q(U, 'V')}, to je napětí jen na části obvodu, ne na zdroji (${q(sOn.U, 'V')}).` }
      return { ok: true, why: 'Voltmetr je připojený paralelně přímo ke zdroji a teče jím jen nepatrný proud.' }
    }
    case 'independent': {
      for (const b of lamps) {
        const s = solve(applyChange(on, { burnt: b }))
        const off = lamps.find((id) => id !== b && !lit(s, id))
        if (off) return { ok: false, why: `Když se přepálí ${label(b)}, zhasne i ${label(off)} – žárovky jsou v sérii. Každá potřebuje vlastní větev.` }
      }
      return { ok: true, why: 'Každá žárovka má vlastní větev připojenou ke zdroji, přepálení jedné druhou nezhasne.' }
    }
    case 'value': {
      const v = reading(on, sOn, goal.meter)
      const unit = findPart(c.net, goal.meter)?.t === 'V' ? 'V' : 'A'
      if (!Number.isFinite(v)) return { ok: false, why: 'Zkrat! Proud by byl obrovský.' }
      if (!within(v, goal.value)) return { ok: false, why: `${label(goal.meter)} teď ukazuje ${q(v, unit)}, potřebuješ ${q(goal.value, unit)}.` }
      return { ok: true, why: `${label(goal.meter)} ukazuje ${q(v, unit)}. Přesně tak.` }
    }
  }
}

/** Every way to put the pieces into the slots (each piece used once), and whether it meets the goal. */
export function arrangements(c: Circuit, pieces: Part[], goal: Goal): { placed: Record<string, Part>; ok: boolean }[] {
  const slots = slotIds(c.net)
  const out: { placed: Record<string, Part>; ok: boolean }[] = []
  const rec = (k: number, left: Part[], placed: Record<string, Part>) => {
    if (k === slots.length) {
      out.push({ placed: { ...placed }, ok: checkGoal(fill(c, placed), goal).ok })
      return
    }
    left.forEach((p, i) => {
      placed[slots[k]] = p
      rec(k + 1, [...left.slice(0, i), ...left.slice(i + 1)], placed)
      delete placed[slots[k]]
    })
  }
  rec(0, pieces, {})
  return out
}

export const pieceKey = (p: Part) => ('id' in p && p.id ? p.id : p.t)
