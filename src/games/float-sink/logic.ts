/**
 * Plave, nebo klesne? – pure physics (density, Archimedes' principle) and task
 * generation. Every answer and explanation is computed from the data in levels.ts.
 */
import { levelNum } from '../types'
import { parseDecimal, pick, shuffle } from '../shared/util'
import {
  BUOY_VOLUMES_CM3,
  BUOY_VOLUMES_DM3,
  FORCES_VOLUMES_DM3,
  HOVER_SCENES,
  LEVELS,
  LIQUIDS,
  MATERIALS,
  MV_VOLUMES,
  type Liquid,
  type Material,
  type TaskKind,
} from './levels'

/** g used at ZŠ level (f3-2 works with 10 N/kg). */
export const G = 10
/** Pairs whose densities differ by less than 3 % are never asked (too close to call from a table). */
export const CLOSE = 0.03
/** Relative tolerance of numeric answers (±2 %). */
export const REL_TOL = 0.02
/** Submerged fraction: ±1 percentage point. */
export const PCT_TOL = 1
export const ROUND = 10

export type Outcome = 'plave' | 'vznasi' | 'klesne'

export const OUTCOME_LABEL: Record<Outcome, string> = { plave: 'plave', vznasi: 'vznáší se', klesne: 'klesne' }

/* ------------------------------------------------------------------ physics */

/** Body in a liquid: floats when less dense, hovers when equally dense (±0,1 %), sinks when denser. */
export function outcomeOf(rhoBody: number, rhoLiquid: number): Outcome {
  const r = rhoBody / rhoLiquid
  if (Math.abs(r - 1) <= 0.001) return 'vznasi'
  return r < 1 ? 'plave' : 'klesne'
}

/** Archimedes: F_vz = V · ρ_kapaliny · g (V in m³, ρ in kg/m³) → N. */
export const buoyantForce = (volumeM3: number, rhoLiquid: number, g = G) => volumeM3 * rhoLiquid * g

/** Fraction of a floating body's volume under the surface (1 for a body that hovers or sinks). */
export const submergedFraction = (rhoBody: number, rhoLiquid: number) => Math.min(1, rhoBody / rhoLiquid)

/** Density from mass and volume, in kg/m³ (m in g, V in cm³). */
export const densityGcm3 = (massG: number, volumeCm3: number) => (massG / volumeCm3) * 1000

const isClose = (a: number, b: number) => Math.abs(a / b - 1) < CLOSE

/* ------------------------------------------------------------------ numbers */

const round6 = (x: number) => Math.round(x * 1e6) / 1e6

/** Czech number: decimal comma, up to `digits` decimals without trailing zeros, spaces from 10 000. */
export function cz(x: number, digits = 2): string {
  const r = round6(Math.round(x * 10 ** digits) / 10 ** digits)
  const [int, dec] = String(Math.abs(r)).split('.')
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int
  return (r < 0 ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

const rho = (x: number) => `${cz(x)} kg/m^{3}`
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/* ------------------------------------------------------------------ tasks */

export interface BodyLook {
  /** Mean density of the body (kg/m³) – decides the animation. */
  rho: number
  color: string
  shape: 'block' | 'ball' | 'ship'
  /** Short Czech name for the picture's label. */
  label: string
}

interface Base {
  key: string
  level: number
  kind: TaskKind
  /** Question (Czech, <Md> markup). */
  text: string
  liquid: Liquid
  body: BodyLook
  /** What really happens when the body is let go. */
  outcome: Outcome
  /** One line why (Czech, <Md> markup). */
  explain: string
}

export interface PredictTask extends Base {
  answer: 'predict'
  options: Outcome[]
}

export interface NumberTask extends Base {
  answer: 'number'
  value: number
  unit: 'N' | '%' | 't'
  /** Allowed absolute deviation. */
  tol: number
  /** Symbol shown in front of the input, e.g. "F_{vz}". */
  symbol: string
}

export type Task = PredictTask | NumberTask

type Rng = () => number

const ALL_MATERIALS = Object.values(MATERIALS)
const shapeOf = (m: Material): BodyLook['shape'] => (m.id === 'egg' || m.id === 'glass' ? 'ball' : 'block')
const look = (m: Material, rhoBody = m.rho): BodyLook => ({ rho: rhoBody, color: m.color, shape: shapeOf(m), label: m.name })

function compareLine(rb: number, rl: number): string {
  const o = outcomeOf(rb, rl)
  if (o === 'vznasi') return `ρ tělesa = ρ kapaliny → těleso se **vznáší**.`
  if (o === 'plave')
    return `ρ tělesa ${rho(rb)} < ρ kapaliny ${rho(rl)} → **plave** (pod hladinou je ${cz(submergedFraction(rb, rl) * 100, 0)} % objemu).`
  return `ρ tělesa ${rho(rb)} > ρ kapaliny ${rho(rl)} → **klesne** ke dnu.`
}

/** A float or sink target, half and half. */
const target = (rng: Rng): Outcome => (rng() < 0.5 ? 'plave' : 'klesne')

function materialTask(liquids: readonly string[], rng: Rng, level: number): PredictTask {
  const want = target(rng)
  for (;;) {
    const l = LIQUIDS[pick(liquids, rng)]
    const m = pick(ALL_MATERIALS, rng)
    if (isClose(m.rho, l.rho) || outcomeOf(m.rho, l.rho) !== want) continue
    return {
      key: `material:${m.id}`,
      level,
      kind: 'material',
      answer: 'predict',
      options: ['plave', 'vznasi', 'klesne'],
      text: `Co udělá **${m.object}** (${m.name}, ρ = ${rho(m.rho)}) ${l.inName} (ρ = ${rho(l.rho)})?`,
      liquid: l,
      body: look(m),
      outcome: want,
      explain: compareLine(m.rho, l.rho),
    }
  }
}

function mvTask(liquids: readonly string[], rng: Rng, level: number): PredictTask {
  const want = target(rng)
  for (;;) {
    const l = LIQUIDS[pick(liquids, rng)]
    const m = pick(ALL_MATERIALS, rng)
    const V = pick(MV_VOLUMES, rng)
    const mass = Math.round((m.rho / 1000) * V * 10) / 10
    const rb = densityGcm3(mass, V)
    if (isClose(rb, l.rho) || outcomeOf(rb, l.rho) !== want) continue
    return {
      key: `mv:${m.id}`,
      level,
      kind: 'mv',
      answer: 'predict',
      options: ['plave', 'vznasi', 'klesne'],
      text: `Neznámé těleso má hmotnost **${cz(mass, 1)} g** a objem **${V} cm^{3}**. Co udělá ${l.inName} (ρ = ${rho(l.rho)})?`,
      liquid: l,
      body: { ...look(m, rb), label: 'neznámé těleso' },
      outcome: want,
      explain: `ρ = m/V = ${cz(mass, 1)} g : ${V} cm^{3} ≈ ${cz(rb / 1000, 3)} g/cm^{3} = ${rho(Math.round(rb))} (${m.name}). ${compareLine(Math.round(rb), l.rho)}`,
    }
  }
}

function hoverTask(rng: Rng, level: number): PredictTask {
  const sc = pick(HOVER_SCENES, rng)
  const l = LIQUIDS[sc.liquid]
  const V = pick(sc.volumes, rng)
  // m = V · ρ: in g for cm³ (ρ in g/cm³), in t for m³ (ρ in t/m³)
  const mass = round6(V * (l.rho / 1000))
  const mu = sc.unit === 'cm3' ? 'g' : 't'
  const vu = sc.unit === 'cm3' ? 'cm^{3}' : 'm^{3}'
  const rb = (mass / V) * 1000
  return {
    key: `hover:${sc.id}`,
    level,
    kind: 'hover',
    answer: 'predict',
    options: ['plave', 'vznasi', 'klesne'],
    text: `${sc.text.replace('{V}', `**${cz(V)} ${vu}**`).replace('{m}', `**${cz(mass, 3)} ${mu}**`)} Co udělá ${l.inName} (ρ = ${rho(l.rho)})?`,
    liquid: l,
    body: { rho: rb, color: sc.color, shape: sc.id === 'sub' ? 'ship' : 'block', label: sc.id === 'sub' ? 'ponorka' : 'těleso' },
    outcome: outcomeOf(rb, l.rho),
    explain: `ρ = m/V = ${cz(mass, 3)} ${mu} : ${cz(V)} ${vu} = ${cz(rb / 1000, 3)} ${mu}/${vu} = ${rho(rb)}, stejně jako ${l.name} → **vznáší se**.`,
  }
}

function buoyancyTask(liquids: readonly string[], rng: Rng, level: number): NumberTask {
  const l = LIQUIDS[pick(liquids, rng)]
  const m = pick(ALL_MATERIALS, rng)
  const inDm3 = rng() < 0.5
  const V = inDm3 ? pick(BUOY_VOLUMES_DM3, rng) : pick(BUOY_VOLUMES_CM3, rng)
  const Vm3 = inDm3 ? V / 1000 : V / 1e6
  const F = round6(buoyantForce(Vm3, l.rho))
  const o = outcomeOf(m.rho, l.rho)
  const how = o === 'plave' ? 'je přidržovaný celý pod hladinou' : 'je celý ponořený'
  return {
    key: `buoyancy:${m.id}`,
    level,
    kind: 'buoyancy',
    answer: 'number',
    value: F,
    unit: 'N',
    tol: Math.max(0.01, F * REL_TOL),
    symbol: 'F_{vz}',
    text: `${cap(m.object)} o objemu **${cz(V)} ${inDm3 ? 'dm^{3}' : 'cm^{3}'}** ${how} ${l.inName} (ρ = ${rho(l.rho)}). Jak velká vztlaková síla na něj působí? (g = 10 N/kg)`,
    liquid: l,
    body: look(m),
    outcome: o,
    explain: `F_{vz} = V · ρ · g = ${cz(Vm3, 6)} m^{3} · ${rho(l.rho)} · 10 N/kg = ${cz(F, 3)} N. Po puštění ${o === 'plave' ? 'vyplave' : o === 'klesne' ? 'klesne' : 'se vznáší'}.`,
  }
}

function fractionTask(liquids: readonly string[], rng: Rng, level: number): NumberTask {
  for (;;) {
    const l = LIQUIDS[pick(liquids, rng)]
    const m = pick(ALL_MATERIALS, rng)
    const f = m.rho / l.rho
    if (f < 0.1 || f > 0.97) continue
    const pct = round6(f * 100)
    return {
      key: `fraction:${m.id}`,
      level,
      kind: 'fraction',
      answer: 'number',
      value: pct,
      unit: '%',
      tol: PCT_TOL,
      symbol: 'V_{pon} : V',
      text: `${cap(m.object)} (ρ = ${rho(m.rho)}) plave ${l.inName} (ρ = ${rho(l.rho)}). Kolik procent objemu tělesa je pod hladinou?`,
      liquid: l,
      body: look(m),
      outcome: 'plave',
      explain: `Plovoucí těleso se ponoří tak, aby F_{vz} = F_{G}, takže V_{pon} : V = ρ_{t} : ρ_{k} = ${cz(m.rho)} : ${cz(l.rho)} ≈ ${cz(pct, 1)} %.`,
    }
  }
}

const SHIP_PLACE: Record<string, string> = { water: 'na řece', sea: 'na moři' }

function shipParams(rng: Rng, want: Outcome) {
  for (;;) {
    const lid = rng() < 0.6 ? 'water' : 'sea'
    const l = LIQUIDS[lid]
    const V = 80 + Math.floor(rng() * 23) * 10 // 80–300 m³
    const hull = 20 + Math.floor(rng() * 13) * 5 // 20–80 t
    const capacity = round6((V * l.rho) / 1000 - hull) // t
    if (capacity < 20) continue
    const k = want === 'plave' ? 0.3 + rng() * 0.62 : 1.06 + rng() * 0.5
    const cargo = Math.max(5, Math.round((capacity * k) / 5) * 5)
    const total = hull + cargo
    const maxMass = (V * l.rho) / 1000
    const o: Outcome = total < maxMass ? 'plave' : 'klesne'
    if (o !== want || Math.abs(total / maxMass - 1) < CLOSE) continue
    return { l, V, hull, cargo, capacity, total, maxMass }
  }
}

function shipTask(rng: Rng, level: number): PredictTask {
  const want = target(rng)
  const { l, V, hull, cargo, total, maxMass } = shipParams(rng, want)
  const rb = (total / V) * 1000
  return {
    key: `ship:${V}:${hull}:${cargo}`,
    level,
    kind: 'ship',
    answer: 'predict',
    options: ['plave', 'klesne'],
    text: `Nákladní člun má hmotnost **${hull} t**. Ponořit se může nejvýš **${V} m^{3}** trupu, víc už by nabral vodu. Naložíme **${cargo} t** písku. Udrží se ${SHIP_PLACE[l.id]} (ρ = ${rho(l.rho)})?`,
    liquid: l,
    body: { rho: rb, color: '#9c6b3a', shape: 'ship', label: 'člun' },
    outcome: want,
    explain: `Největší vztlaková síla nadnese ${cz(V)} m^{3} · ${rho(l.rho)} = ${cz(maxMass, 1)} t. Člun s nákladem má ${hull} + ${cargo} = ${total} t ${want === 'plave' ? '<' : '>'} ${cz(maxMass, 1)} t → ${want === 'plave' ? '**udrží se**' : '**potopí se**'}.`,
  }
}

function capacityTask(rng: Rng, level: number): NumberTask {
  const { l, V, hull, capacity, maxMass } = shipParams(rng, 'plave')
  return {
    key: `capacity:${V}:${hull}`,
    level,
    kind: 'capacity',
    answer: 'number',
    value: capacity,
    unit: 't',
    tol: Math.max(0.1, capacity * REL_TOL),
    symbol: 'm_{nákladu}',
    text: `Nákladní člun má hmotnost **${hull} t**. Ponořit se může nejvýš **${V} m^{3}** trupu. Kolik tun nákladu nejvýše unese ${SHIP_PLACE[l.id]} (ρ = ${rho(l.rho)})?`,
    liquid: l,
    body: { rho: ((hull + capacity * 0.8) / V) * 1000, color: '#9c6b3a', shape: 'ship', label: 'člun' },
    outcome: 'plave',
    explain: `Vztlak unese nejvýš V · ρ = ${cz(V)} m^{3} · ${rho(l.rho)} = ${cz(maxMass, 1)} t, z toho ${hull} t je člun → náklad ${cz(capacity, 1)} t.`,
  }
}

function forcesTask(liquids: readonly string[], rng: Rng, level: number): PredictTask {
  const r = rng()
  const want: Outcome = r < 0.4 ? 'plave' : r < 0.8 ? 'klesne' : 'vznasi'
  for (;;) {
    const l = LIQUIDS[pick(liquids.filter((x) => x !== 'mercury'), rng)]
    const V = pick(FORCES_VOLUMES_DM3, rng)
    const Fvz = round6(buoyantForce(V / 1000, l.rho))
    let FG = Fvz
    if (want !== 'vznasi') {
      const k = want === 'plave' ? 0.3 + rng() * 0.6 : 1.15 + rng() * 1.5
      FG = Math.max(0.5, Math.round(Fvz * k * 2) / 2)
      if (isClose(FG, Fvz)) continue
    }
    const rb = FG / (G * (V / 1000))
    const o = outcomeOf(rb, l.rho)
    if (o !== want) continue
    const sign = o === 'plave' ? '<' : o === 'klesne' ? '>' : '='
    return {
      key: `forces:${l.id}:${V}:${want}`,
      level,
      kind: 'forces',
      answer: 'predict',
      options: ['plave', 'vznasi', 'klesne'],
      text: `Těleso o objemu **${cz(V)} dm^{3}** má tíhu **F_{G} = ${cz(FG)} N**. Ponoříme ho celé ${l.inName} (ρ = ${rho(l.rho)}) a pustíme. Co udělá? (g = 10 N/kg)`,
      liquid: l,
      body: { rho: rb, color: '#b8bec8', shape: 'block', label: 'těleso' },
      outcome: o,
      explain: `F_{vz} = V · ρ · g = ${cz(V / 1000, 4)} m^{3} · ${rho(l.rho)} · 10 N/kg = ${cz(Fvz)} N. F_{G} ${sign} F_{vz} → **${OUTCOME_LABEL[o]}**${o === 'plave' ? ' (vyplave a část vystoupí nad hladinu)' : ''}.`,
    }
  }
}

function build(kind: TaskKind, level: number, rng: Rng): Task {
  const liquids = LEVELS[level].liquids
  switch (kind) {
    case 'material':
      return materialTask(liquids, rng, level)
    case 'mv':
      return mvTask(liquids, rng, level)
    case 'hover':
      return hoverTask(rng, level)
    case 'buoyancy':
      return buoyancyTask(liquids, rng, level)
    case 'fraction':
      return fractionTask(liquids, rng, level)
    case 'ship':
      return shipTask(rng, level)
    case 'capacity':
      return capacityTask(rng, level)
    case 'forces':
      return forcesTask(liquids, rng, level)
  }
}

/** Free play: half a round from each level. */
export const MIX_FREE: Record<number, Partial<Record<TaskKind, number>>> = {
  1: { material: 2, mv: 2, hover: 1 },
  3: { buoyancy: 2, fraction: 1, ship: 1, forces: 1 },
}

/** Level number whose set is played; undefined = mix of both. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

/** A round of 10 distinct tasks (by key), shuffled; free play mixes levels 1 and 3. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const plan: [number, TaskKind, number][] = []
  const mixes = level !== undefined ? { [level]: LEVELS[level].mix } : MIX_FREE
  for (const [lv, mix] of Object.entries(mixes)) for (const [kind, n] of Object.entries(mix)) plan.push([Number(lv), kind as TaskKind, n!])
  const used = new Set<string>()
  const out: Task[] = []
  for (const [lv, kind, n] of plan) {
    for (let k = 0; k < n; k++) {
      for (let attempt = 0; attempt < 200; attempt++) {
        const t = build(kind, lv, rng)
        if (used.has(t.key)) continue
        used.add(t.key)
        out.push(t)
        break
      }
    }
  }
  // easier level first in free play, shuffled inside a level
  const byLevel = [...new Set(out.map((t) => t.level))].sort((a, b) => a - b)
  return byLevel.flatMap((lv) => shuffle(out.filter((t) => t.level === lv), rng))
}

/* ------------------------------------------------------------------ checking */

export type Check = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

/** Accepts "2,3", "2.3", "2,3 N", "89 %", "150 t". */
export function checkNumber(input: string, t: NumberTask): Check {
  const value = parseDecimal(input.replace(/(N|%|t)\s*$/i, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - t.value) <= t.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}

/** Tolerance text for the instructions. */
export const toleranceText = (t: NumberTask) => (t.unit === '%' ? '±1 procentní bod' : '±2 %')
