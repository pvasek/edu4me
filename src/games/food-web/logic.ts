/**
 * Potravní síť – pure logic: the graph of each web (who eats whom, trophic levels,
 * chains), the consequences of removing a species, energy along a chain, and building
 * a round. Every answer is computed from the arrows in levels.ts.
 */
import { levelNum } from '../types'
import { parseDecimal, pick, shuffle } from '../shared/util'
import { ECOSYSTEMS, EFFICIENCIES, LEVELS, PRODUCER_ENERGY, PRODUCTION, SPECIES, type Ecosystem, type TaskKind } from './levels'

export const ROUND = 10
type Rng = () => number

/** Level number whose set is played; undefined = all levels mixed. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

/* ------------------------------------------------------------------ the web */

export interface Web {
  eco: Ecosystem
  ids: string[]
  foods: Map<string, string[]>
  eaters: Map<string, string[]>
  /** Trophic height: 0 for producers, otherwise 1 + the highest food (longest chain below). */
  height: Map<string, number>
}

const cache = new Map<string, Web>()

export function webOf(ecoId: string): Web {
  const hit = cache.get(ecoId)
  if (hit) return hit
  const eco = ECOSYSTEMS[ecoId]
  const ids: string[] = []
  const foods = new Map<string, string[]>()
  const eaters = new Map<string, string[]>()
  const add = (id: string) => {
    if (!SPECIES[id]) throw new Error(`Unknown species ${id} in ${ecoId}`)
    if (!foods.has(id)) {
      ids.push(id)
      foods.set(id, [])
      eaters.set(id, [])
    }
  }
  for (const [f, e] of eco.eats) {
    add(f)
    add(e)
    foods.get(e)!.push(f)
    eaters.get(f)!.push(e)
  }
  const height = new Map<string, number>()
  const h = (id: string, seen: string[] = []): number => {
    if (seen.includes(id)) throw new Error(`Cycle in ${ecoId}: ${[...seen, id].join(' → ')}`)
    if (height.has(id)) return height.get(id)!
    const fs = foods.get(id)!
    const v = fs.length ? 1 + Math.max(...fs.map((f) => h(f, [...seen, id]))) : 0
    height.set(id, v)
    return v
  }
  ids.forEach((id) => h(id))
  const web = { eco, ids, foods, eaters, height }
  cache.set(ecoId, web)
  return web
}

export const isProducer = (w: Web, id: string) => w.foods.get(id)!.length === 0
export const eats = (w: Web, food: string, eater: string) => w.foods.get(eater)!.includes(food)

/** What the species eats in this web: only plants, only animals, or both. */
export function dietOf(w: Web, id: string): 'none' | 'plant' | 'animal' | 'mixed' {
  const fs = w.foods.get(id)!
  if (!fs.length) return 'none'
  const plants = fs.filter((f) => isProducer(w, f)).length
  return plants === fs.length ? 'plant' : plants === 0 ? 'animal' : 'mixed'
}

/**
 * Consumer order (1 = býložravec / konzument 1. řádu …) when it is unambiguous:
 * every food of the species sits on the same trophic level. Producers have order 0.
 * Undefined for omnivores that eat on several levels.
 */
export function orderOf(w: Web, id: string): number | undefined {
  const fs = w.foods.get(id)!
  if (!fs.length) return 0
  const lv = fs.map((f) => orderOf(w, f))
  if (lv.some((x) => x === undefined) || new Set(lv).size !== 1) return undefined
  return lv[0]! + 1
}

/** All food chains of a web: paths from a producer along the arrows to a species nobody eats or further. */
export function chainsOf(w: Web): string[][] {
  const out: string[][] = []
  const walk = (path: string[]) => {
    if (path.length >= 3) out.push(path)
    for (const e of w.eaters.get(path[path.length - 1])!) walk([...path, e])
  }
  w.ids.filter((id) => isProducer(w, id)).forEach((p) => walk([p]))
  return out
}

/** True when every neighbouring pair is a feeding link (food → eater). */
export function isChain(w: Web, order: string[]): boolean {
  return order.length >= 2 && order.every((id, i) => i === 0 || eats(w, order[i - 1], id)) && isProducer(w, order[0])
}

/* ------------------------------------------------------------------ removal */

export type Change = 'up' | 'down'

export interface RemovalCase {
  removed: string
  target: string
  change: Change
  /** Why, in Czech (names in nominative). */
  why: string
  kind: 'prey' | 'starve' | 'cascade'
}

const nm = (id: string) => SPECIES[id].short
const list = (ids: string[]) => (ids.length <= 1 ? ids.map(nm).join('') : `${ids.slice(0, -1).map(nm).join(', ')} a ${nm(ids[ids.length - 1])}`)

/**
 * Prey of `x` that clearly increases when `x` disappears: `y` is eaten by `x` and none of
 * y's other consumers is itself eaten by `x` (that consumer would also increase and eat more y).
 */
export function preyRises(w: Web, x: string, y: string): boolean {
  if (!eats(w, y, x)) return false
  return w.eaters.get(y)!.every((z) => z === x || !eats(w, z, x))
}

/** Every unambiguous consequence of removing `x` from the web. */
export function removalCases(w: Web, x: string): RemovalCase[] {
  const out: RemovalCase[] = []
  const prey = w.foods.get(x)!
  const rising = prey.filter((y) => preyRises(w, x, y))
  for (const y of rising)
    out.push({
      removed: x,
      target: y,
      change: 'up',
      kind: 'prey',
      why: `Šipka ${nm(y)} → ${nm(x)}. Když zmizí ${nm(x)}, ${nm(y)} ztratí ${w.eaters.get(y)!.length > 1 ? 'jednoho ze svých predátorů' : 'svého jediného predátora'}, a proto přibude.`,
    })
  for (const y of w.eaters.get(x)!) {
    if (w.foods.get(y)!.length === 1)
      out.push({ removed: x, target: y, change: 'down', kind: 'starve', why: `${cap(nm(y))} má v této síti jedinou potravu: ${nm(x)}. Když zmizí ${nm(x)}, ${nm(y)} nemá co jíst, a tak ubude.` })
  }
  // trophic cascade: y's consumers are all prey of x that rise; x itself does not eat y
  for (const y of w.ids) {
    if (y === x || eats(w, y, x) || prey.includes(y)) continue
    const cons = w.eaters.get(y)!
    if (!cons.length || !cons.every((z) => rising.includes(z))) continue
    out.push({
      removed: x,
      target: y,
      change: 'down',
      kind: 'cascade',
      why: `Když zmizí ${nm(x)}, přibude ${list(cons)} (${cons.length > 1 ? 'mají' : 'má'} o predátora méně). Spotřebují pak víc potravy, a tak ${nm(y)} ubude.`,
    })
  }
  return out
}

/* ------------------------------------------------------------------ energy */

/** Energy reaching the last member of a chain of `n` species at `eff` % per step. */
export const energyAt = (producers: number, steps: number, eff = 10) => producers * (eff / 100) ** steps

/** Kilograms of producers needed for 1 kg of a consumer `steps` levels above them. */
export const biomassNeeded = (steps: number, eff = 10) => (100 / eff) ** steps

/** Czech number: thousands separated by a space, decimal comma, at most `digits` decimals. */
export function cz(x: number, digits = 2): string {
  const r = Math.round(x * 10 ** digits) / 10 ** digits
  const [int, dec] = String(Math.abs(r)).split('.')
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int
  return (r < 0 ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
/** Power as superscript: 3 → "³" (empty for 1). */
export const pow = (n: number) => (n === 1 ? '' : String(n).split('').map((d) => SUP[+d]).join(''))

/* ------------------------------------------------------------------ tasks */

interface Base {
  key: string
  level: number
  eco: string
  /** Question (Czech, may contain **bold**). */
  text: string
  /** One-line explanation shown after the answer. */
  why: string
}

export interface ChainTask extends Base {
  kind: 'chain'
  /** The species to order, shuffled. */
  pool: string[]
  /** The only valid order (a Hamiltonian path in a DAG is unique). */
  answer: string[]
}

export interface ChoiceTask extends Base {
  kind: 'food' | 'eater' | 'order' | 'pyramid' | 'removal'
  /** Option labels and ids; `answer` is one of the ids. */
  options: { id: string; label: string }[]
  answer: string
  /** For removal tasks: the species that disappears and the one asked about. */
  removed?: string
  target?: string
  /** Species highlighted in the web after the answer. */
  focus: string[]
  /** Show the web while the question is open (removal). */
  showWeb: boolean
}

export interface NumberTask extends Base {
  kind: 'efficiency' | 'energy' | 'biomass'
  value: number
  unit: string
  /** Allowed absolute deviation. */
  tol: number
  focus: string[]
}

export type Task = ChainTask | ChoiceTask | NumberTask

const chainText = (ids: string[]) => ids.map(nm).join(' → ')

function chainTask(level: number, lengths: number[], ecos: string[], rng: Rng, used: Set<string>): ChainTask | null {
  const all = ecos.flatMap((e) => chainsOf(webOf(e)).map((c) => ({ e, c })))
  const len = pick(lengths, rng)
  let cands = all.filter((x) => x.c.length === len && (level !== 5 || SPECIES[x.c[x.c.length - 1]].vertebrate))
  if (!cands.length) cands = all.filter((x) => lengths.includes(x.c.length))
  cands = shuffle(cands, rng).filter((x) => !used.has(`chain:${x.c.join('>')}`))
  if (!cands.length) return null
  const { e, c } = cands[0]
  let pool = shuffle(c, rng)
  while (pool.every((id, i) => id === c[i])) pool = shuffle(c, rng)
  return {
    kind: 'chain',
    key: `chain:${c.join('>')}`,
    level,
    eco: e,
    text: `Seřaď do potravního řetězce (${ECOSYSTEMS[e].name}): od producenta ke konzumentovi, kterého už nikdo v řetězci nežere.`,
    pool,
    answer: c,
    why: `${chainText(c)}. Šipka míří od potravy ke konzumentovi – tím směrem teče energie.`,
  }
}

const opt = (id: string) => ({ id, label: SPECIES[id].short })

function foodTask(level: number, ecos: string[], rng: Rng, used: Set<string>): ChoiceTask | null {
  for (const e of shuffle(ecos, rng)) {
    const w = webOf(e)
    for (const x of shuffle(w.ids, rng)) {
      if (isProducer(w, x) || (level === 5 && !SPECIES[x].vertebrate) || used.has(`food:${x}`)) continue
      const foods = w.foods.get(x)!
      // safe distractors: x's own consumers, species nobody eats here (top predators), plants for meat-eaters
      const pool = w.ids.filter(
        (y) => y !== x && !foods.includes(y) && (eats(w, x, y) || (!isProducer(w, y) && w.eaters.get(y)!.length === 0) || (dietOf(w, x) === 'animal' && isProducer(w, y))),
      )
      if (pool.length < 3) continue
      const answer = pick(foods, rng)
      return {
        kind: 'food',
        key: `food:${x}`,
        level,
        eco: e,
        text: `${cap(ECOSYSTEMS[e].name)}: čím se živí **${nm(x)}**?`,
        options: shuffle([answer, ...shuffle(pool, rng).slice(0, 3)], rng).map(opt),
        answer,
        why: `V síti: ${foods.map((f) => `${nm(f)} → ${nm(x)}`).join(', ')}.`,
        focus: [x, ...foods],
        showWeb: false,
      }
    }
  }
  return null
}

function eaterTask(level: number, ecos: string[], rng: Rng, used: Set<string>): ChoiceTask | null {
  for (const e of shuffle(ecos, rng)) {
    const w = webOf(e)
    for (const x of shuffle(w.ids, rng)) {
      const eaters = w.eaters.get(x)!.filter((z) => level !== 5 || SPECIES[z].vertebrate)
      if (!eaters.length || used.has(`eater:${x}`)) continue
      // safe distractors: x's own food, plant-eaters when x is an animal, producers
      const pool = w.ids.filter((y) => y !== x && !w.eaters.get(x)!.includes(y) && (eats(w, y, x) || isProducer(w, y) || (!isProducer(w, x) && dietOf(w, y) === 'plant')))
      if (pool.length < 3) continue
      const answer = pick(eaters, rng)
      const all = w.eaters.get(x)!
      return {
        kind: 'eater',
        key: `eater:${x}`,
        level,
        eco: e,
        text: `${cap(ECOSYSTEMS[e].name)}: komu slouží **${nm(x)}** jako potrava?`,
        options: shuffle([answer, ...shuffle(pool, rng).slice(0, 3)], rng).map(opt),
        answer,
        why: `V síti: ${all.map((z) => `${nm(x)} → ${nm(z)}`).join(', ')}.`,
        focus: [x, ...all],
        showWeb: false,
      }
    }
  }
  return null
}

function removalTask(level: number, ecos: string[], rng: Rng, used: Set<string>): ChoiceTask | null {
  const cases = shuffle(
    ecos.flatMap((e) => webOf(e).ids.flatMap((x) => removalCases(webOf(e), x).map((c) => ({ e, c })))),
    rng,
  )
  // level 12 prefers trophic cascades, level 8 the direct cases
  const pref = level >= 12 ? cases.filter((x) => x.c.kind === 'cascade') : cases.filter((x) => x.c.kind !== 'cascade')
  for (const { e, c } of [...pref, ...cases]) {
    if (level < 12 && c.kind === 'cascade') continue
    const key = `removal:${e}:${c.removed}`
    if (used.has(key)) continue
    return {
      kind: 'removal',
      key,
      level,
      eco: e,
      text: `${ECOSYSTEMS[e].from} zmizí **${nm(c.removed)}**. ${cap(nm(c.target))}: přibude, nebo ubude?`,
      options: [
        { id: 'up', label: 'Přibude' },
        { id: 'down', label: 'Ubude' },
      ],
      answer: c.change,
      removed: c.removed,
      target: c.target,
      why: c.why,
      focus: [c.removed, c.target],
      showWeb: true,
    }
  }
  return null
}

function orderTask(level: number, ecos: string[], rng: Rng, used: Set<string>): ChoiceTask | null {
  for (const e of shuffle(ecos, rng)) {
    const w = webOf(e)
    const ord = new Map(w.ids.map((id) => [id, orderOf(w, id)]))
    for (const n of shuffle([1, 2, 3], rng)) {
      const right = w.ids.filter((id) => ord.get(id) === n && !used.has(`order:${id}`))
      const wrong = w.ids.filter((id) => ord.get(id) !== undefined && ord.get(id) !== n)
      if (!right.length || wrong.length < 3) continue
      const answer = pick(right, rng)
      const chain: string[] = [answer]
      while (!isProducer(w, chain[0])) chain.unshift(w.foods.get(chain[0])![0])
      const label = n === 1 ? 'konzument 1. řádu (býložravec)' : `konzument ${n}. řádu`
      return {
        kind: 'order',
        key: `order:${answer}`,
        level,
        eco: e,
        text: `${cap(ECOSYSTEMS[e].name)}: který z nich je **${label}**?`,
        options: shuffle([answer, ...shuffle(wrong, rng).slice(0, 3)], rng).map(opt),
        answer,
        why: `${chainText(chain)}: ${nm(answer)} je ${n}. článek nad producentem, tedy ${label}.`,
        focus: chain,
        showWeb: false,
      }
    }
  }
  return null
}

function pyramidTask(level: number, ecos: string[], rng: Rng, used: Set<string>): ChoiceTask | null {
  const chains = shuffle(
    ecos.flatMap((e) => chainsOf(webOf(e)).filter((c) => c.length >= 3 && c.length <= 5).map((c) => ({ e, c }))),
    rng,
  )
  for (const { e, c } of chains) {
    const key = `pyramid:${c.join('>')}`
    if (used.has(key)) continue
    const E = pick(PRODUCER_ENERGY.filter((x) => x >= 10 ** (c.length + 1)), rng)
    const steps = c.length - 1
    const v = energyAt(E, steps)
    const values = [v / 10, v, v * 10, v * 100]
    return {
      kind: 'pyramid',
      key,
      level,
      eco: e,
      text: `Řetězec ${chainText(c)}. Producenti zachytí **${cz(E)} kJ**. Kolik energie zhruba získá **${nm(c[c.length - 1])}**?`,
      options: values.map((x) => ({ id: String(x), label: `${cz(x)} kJ` })),
      answer: String(v),
      why: `Na každý další článek přejde jen asi 10 %: ${cz(E)} kJ × 0,1${pow(steps)} = ${cz(v)} kJ. Zbytek se spotřebuje na dýchání a uniká jako teplo.`,
      focus: c,
      showWeb: false,
    }
  }
  return null
}

function efficiencyTask(level: number, ecos: string[], rng: Rng, used: Set<string>): NumberTask | null {
  for (let t = 0; t < 40; t++) {
    const e = pick(ecos, rng)
    const w = webOf(e)
    const prod = pick(w.ids.filter((id) => isProducer(w, id)), rng)
    const herb = w.eaters.get(prod)!
    if (!herb.length) continue
    const P = pick(PRODUCTION, rng)
    const eff = pick(EFFICIENCIES, rng)
    const key = `eff:${e}:${P}:${eff}`
    if (used.has(key)) continue
    const C = (P * eff) / 100
    return {
      kind: 'efficiency',
      key,
      level,
      eco: e,
      text: `${cap(ECOSYSTEMS[e].name)}: producenti (např. ${nm(prod)}) vytvoří za rok **${cz(P)} kJ/m²**, konzumenti 1. řádu (např. ${nm(pick(herb, rng))}) z toho získají **${cz(C)} kJ/m²**. Jaká je účinnost přenosu energie?`,
      value: eff,
      unit: '%',
      tol: 0.5,
      why: `Účinnost = ${cz(C)} : ${cz(P)} · 100 % = ${cz(eff)} %. Zbytek se ke konzumentům nedostane: část rostlin nikdo nesežere (skončí u rozkladačů) a část sežrané potravy odejde nestrávená.`,
      focus: [prod, ...herb],
    }
  }
  return null
}

function energyTask(level: number, ecos: string[], rng: Rng, used: Set<string>): NumberTask | null {
  const chains = shuffle(
    ecos.flatMap((e) => chainsOf(webOf(e)).filter((c) => c.length === 3 || c.length === 4).map((c) => ({ e, c }))),
    rng,
  )
  for (const { e, c } of chains) {
    const key = `energy:${c.join('>')}`
    if (used.has(key)) continue
    const eff = pick(EFFICIENCIES.filter((x) => x !== 10), rng)
    const E = pick(PRODUCER_ENERGY.filter((x) => x >= 50_000), rng)
    const steps = c.length - 1
    const v = energyAt(E, steps, eff)
    return {
      kind: 'energy',
      key,
      level,
      eco: e,
      text: `Řetězec ${chainText(c)}. Producenti zachytí **${cz(E)} kJ**, na každý další článek přejde **${eff} %**. Kolik kJ získá **${nm(c[c.length - 1])}**?`,
      value: v,
      unit: 'kJ',
      tol: Math.max(0.05, v * 0.02),
      why: `${cz(E)} kJ × ${cz(eff / 100)}${pow(steps)} = ${cz(v)} kJ.`,
      focus: c,
    }
  }
  return null
}

function biomassTask(level: number, ecos: string[], rng: Rng, used: Set<string>): NumberTask | null {
  const chains = shuffle(
    ecos.flatMap((e) => chainsOf(webOf(e)).filter((c) => c.length === 3 || c.length === 4).map((c) => ({ e, c }))),
    rng,
  )
  for (const { e, c } of chains) {
    const top = c[c.length - 1]
    const key = `biomass:${top}`
    if (used.has(key)) continue
    const steps = c.length - 1
    const v = biomassNeeded(steps)
    return {
      kind: 'biomass',
      key,
      level,
      eco: e,
      text: `Řetězec ${chainText(c)}, účinnost přenosu 10 %. Kolik kg producentů (${nm(c[0])}) je potřeba na 1 kg přírůstku posledního článku (**${nm(top)}**)?`,
      value: v,
      unit: 'kg',
      tol: v * 0.01,
      why: `Každý článek potřebuje 10× víc potravy, než sám přibere: 1 kg × 10${pow(steps)} = ${cz(v)} kg.`,
      focus: c,
    }
  }
  return null
}

function taskOf(kind: TaskKind, level: number, rng: Rng, used: Set<string>): Task | null {
  const set = LEVELS[level]
  const ecos = set.ecosystems
  switch (kind) {
    case 'chain':
      return chainTask(level, set.chainLengths, ecos, rng, used)
    case 'food':
      return foodTask(level, ecos, rng, used)
    case 'eater':
      return eaterTask(level, ecos, rng, used)
    case 'removal':
      return removalTask(level, ecos, rng, used)
    case 'order':
      return orderTask(level, ecos, rng, used)
    case 'pyramid':
      return pyramidTask(level, ecos, rng, used)
    case 'efficiency':
      return efficiencyTask(level, ecos, rng, used)
    case 'energy':
      return energyTask(level, ecos, rng, used)
    case 'biomass':
      return biomassTask(level, ecos, rng, used)
  }
}

/** A round of ROUND tasks following the level's plan; free play takes turns between the levels. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const levels = level !== undefined && LEVELS[level] ? [level] : shuffle(Object.keys(LEVELS).map(Number), rng)
  const next = new Map(levels.map((l) => [l, 0]))
  const used = new Set<string>()
  const out: Task[] = []
  for (let guard = 0; out.length < ROUND && guard < ROUND * 6; guard++) {
    const lv = levels[out.length % levels.length]
    const plan = LEVELS[lv].plan
    const k = next.get(lv)!
    next.set(lv, k + 1)
    const t = taskOf(plan[k % plan.length], lv, rng, used)
    if (!t) continue
    used.add(t.key)
    out.push(t)
  }
  return out
}

/* ------------------------------------------------------------------ checking */

/** Links of a proposed chain that are real feeding links. */
export function chainLinks(eco: string, order: string[]): boolean[] {
  const w = webOf(eco)
  return order.slice(1).map((id, i) => eats(w, order[i], id))
}

export type NumCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

export function checkNumber(input: string, t: NumberTask): NumCheck {
  const value = parseDecimal(input.replace(/%|kJ|kg/gi, '').replace(/ /g, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - t.value) <= t.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}
