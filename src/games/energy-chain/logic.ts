/**
 * Energetický řetězec – round building, order checking and the efficiency
 * physics of level 10 (η = W/Q₁, Carnot limit, refrigerator / heat pump factor).
 */
import { levelNum } from '../types'
import { parseDecimal, pick, shuffle } from '../shared/util'
import { CARNOT_SCENES, CHAINS, COP_SCENES, ETA_SCENES, type Card, type Chain, type Range } from './levels'

type Rng = () => number

/** Absolute zero offset: T = t + 273,15. */
export const KELVIN = 273.15
/** Relative tolerance of numeric answers (±2 %). */
export const REL_TOL = 0.02
/** Percent answers: ±1 percentage point. */
export const PCT_TOL = 1

/* ------------------------------------------------------------------ physics */

/** Efficiency η = W / Q₁ (as a fraction). */
export const efficiency = (w: number, q1: number) => w / q1
/** Carnot limit η_max = 1 − T₂/T₁ with temperatures in °C. */
export const carnot = (t1C: number, t2C: number) => 1 - (t2C + KELVIN) / (t1C + KELVIN)
/** Refrigerator: ε = Q₂/W. Heat pump: ε = Q₁/W with Q₁ = Q₂ + W. */
export const copFridge = (q2: number, w: number) => q2 / w
export const copPump = (q2: number, w: number) => (q2 + w) / w

/* ------------------------------------------------------------------ numbers */

const round6 = (x: number) => Math.round(x * 1e6) / 1e6

export function cz(x: number, digits = 2): string {
  const r = round6(Math.round(x * 10 ** digits) / 10 ** digits)
  const [int, dec] = String(Math.abs(r)).split('.')
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int
  return (r < 0 ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

export function draw([min, max, step]: Range, rng: Rng): number {
  const n = Math.round((max - min) / step)
  return round6(min + Math.floor(rng() * (n + 1)) * step)
}

/* ------------------------------------------------------------------ tasks */

export interface OrderTask {
  kind: 'order'
  key: string
  level: number
  chain: Chain
  /** Cards in the order they are dealt (never already right). */
  start: Card[]
}

export interface MissingTask {
  kind: 'missing'
  key: string
  level: number
  chain: Chain
  gap: number
  /** The right card and distractors, shuffled. */
  options: Card[]
}

/** Energy flow of a heat engine or a refrigerator / heat pump for the Sankey diagram. */
export interface Flow {
  mode: 'engine' | 'fridge'
  hot: string
  cold: string
  machine: string
  unit: string
  q1: number
  w: number
  q2: number
  /** Bands hidden until the answer (drawn as "?"). */
  unknown: ('q1' | 'w' | 'q2')[]
  /** Hide all energies (Carnot: only temperatures are known). */
  relative?: boolean
}

export interface NumberTask {
  kind: 'eta' | 'useful' | 'carnot' | 'cop'
  key: string
  level: number
  title: string
  text: string
  symbol: string
  unit: string
  value: number
  tol: number
  flow: Flow
  explain: string
}

export type Task = OrderTask | MissingTask | NumberTask

const isIdentity = (a: Card[], b: Card[]) => a.every((x, i) => x === b[i])

export function orderTask(chain: Chain, level: number, rng: Rng): OrderTask {
  let start = shuffle(chain.cards, rng)
  // a deal that is already right (or just the reverse of it for 2 cards) is reshuffled
  for (let k = 0; k < 20 && isIdentity(start, chain.cards); k++) start = shuffle(chain.cards, rng)
  if (isIdentity(start, chain.cards)) start = [...chain.cards.slice(1), chain.cards[0]]
  return { kind: 'order', key: `order:${chain.id}`, level, chain, start }
}

/** Family of an energy form, so that a distractor never means the same thing as the right card. */
export function family(form: string): string {
  const f = form.toLowerCase()
  if (/světl|záření/.test(f)) return 'light'
  if (/teplo|vnitřní/.test(f)) return 'heat'
  if (/práce|mechanick/.test(f)) return 'work'
  if (/polohov/.test(f)) return 'pot'
  if (/pohybov/.test(f)) return 'kin'
  if (/pružnost/.test(f)) return 'elastic'
  if (/chemick/.test(f)) return 'chem'
  if (/elektr/.test(f)) return 'el'
  if (/jadern/.test(f)) return 'nuc'
  return f
}

/** Cards from other chains of the level that cannot be confused with the right one (each of another energy family). */
export function distractors(chain: Chain, correct: Card, pool: Chain[], n: number, rng: Rng): Card[] {
  const inChain = new Set(chain.cards.map((x) => x.text))
  const seen = new Set([family(correct.form)])
  const out: Card[] = []
  for (const cand of shuffle(
    pool.filter((ch) => ch.id !== chain.id).flatMap((ch) => ch.cards),
    rng,
  )) {
    if (out.length >= n) break
    if (inChain.has(cand.text) || seen.has(family(cand.form))) continue
    seen.add(family(cand.form))
    out.push(cand)
  }
  return out
}

export function missingTask(chain: Chain, level: number, rng: Rng): MissingTask {
  const gap = Math.floor(rng() * chain.cards.length)
  const correct = chain.cards[gap]
  const options = shuffle([correct, ...distractors(chain, correct, CHAINS[level], 3, rng)], rng)
  return { kind: 'missing', key: `missing:${chain.id}`, level, chain, gap, options }
}

function etaTask(rng: Rng, level: number, variant: 'w' | 'q2'): NumberTask {
  const sc = pick(ETA_SCENES, rng)
  const q1 = draw(sc.q1, rng)
  const w = Math.round(q1 * draw(sc.eta, rng))
  const q2 = q1 - w
  const eta = round6(efficiency(w, q1) * 100)
  const u = sc.unit
  const given = variant === 'w' ? `vykoná práci **W = ${cz(w)} ${u}**` : `odevzdá okolí teplo **Q_{2} = ${cz(q2)} ${u}**`
  return {
    kind: 'eta',
    key: `eta:${sc.id}`,
    level,
    title: sc.title,
    text: `${sc.what} přijme ze spáleného paliva teplo **Q_{1} = ${cz(q1)} ${u}** a ${given}. Jaká je jeho účinnost η?`,
    symbol: 'η',
    unit: '%',
    value: eta,
    tol: PCT_TOL,
    flow: { mode: 'engine', hot: 'palivo', cold: 'okolí', machine: 'motor', unit: u, q1, w, q2, unknown: variant === 'w' ? [] : ['w'] },
    explain:
      variant === 'w'
        ? `η = W / Q_{1} = ${cz(w)} ${u} : ${cz(q1)} ${u} ≐ ${cz(eta, 1)} %.`
        : `W = Q_{1} − Q_{2} = ${cz(q1)} − ${cz(q2)} = ${cz(w)} ${u}; η = W / Q_{1} ≐ ${cz(eta, 1)} %.`,
  }
}

function usefulTask(rng: Rng, level: number): NumberTask {
  const sc = pick(ETA_SCENES, rng)
  const q1 = draw(sc.q1, rng)
  const etaPct = Math.round(draw(sc.eta, rng) * 100)
  const w = round6((q1 * etaPct) / 100)
  const u = sc.unit
  return {
    kind: 'useful',
    key: `useful:${sc.id}`,
    level,
    title: sc.title,
    text: `${sc.what} má účinnost **η = ${etaPct} %** a přijme teplo **Q_{1} = ${cz(q1)} ${u}**. Kolik užitečné práce W vykoná?`,
    symbol: 'W',
    unit: u,
    value: w,
    tol: Math.max(0.01, w * REL_TOL),
    flow: { mode: 'engine', hot: 'palivo', cold: 'okolí', machine: 'motor', unit: u, q1, w, q2: q1 - w, unknown: ['w', 'q2'] },
    explain: `W = η · Q_{1} = ${cz(etaPct / 100)} · ${cz(q1)} ${u} = ${cz(w, 1)} ${u}; zbylých ${cz(q1 - w, 1)} ${u} odejde jako teplo Q_{2}.`,
  }
}

function carnotTask(rng: Rng, level: number): NumberTask {
  const sc = pick(CARNOT_SCENES, rng)
  const t1 = draw(sc.t1, rng)
  const t2 = draw(sc.t2, rng)
  const eta = round6(carnot(t1, t2) * 100)
  const T1 = t1 + KELVIN
  const T2 = t2 + KELVIN
  return {
    kind: 'carnot',
    key: `carnot:${sc.id}`,
    level,
    title: sc.title,
    text: `${sc.title}: ohřívač (${sc.hot}) má **t_{1} = ${cz(t1)} °C**, chladič (${sc.cold}) **t_{2} = ${cz(t2)} °C**. Jaká je největší možná (Carnotova) účinnost?`,
    symbol: 'η_{max}',
    unit: '%',
    value: eta,
    tol: PCT_TOL,
    flow: { mode: 'engine', hot: `ohřívač ${cz(t1)} °C`, cold: `chladič ${cz(t2)} °C`, machine: 'stroj', unit: '', q1: 100, w: eta, q2: 100 - eta, unknown: ['w', 'q2'], relative: true },
    explain: `Teploty v kelvinech: T_{1} = ${cz(T1)} K, T_{2} = ${cz(T2)} K; η_{max} = 1 − T_{2}/T_{1} ≐ ${cz(eta, 1)} %.`,
  }
}

function copTask(rng: Rng, level: number): NumberTask {
  const sc = pick(COP_SCENES, rng)
  const q2 = draw(sc.q2, rng)
  const ratio = draw(sc.cop, rng)
  const w = Math.max(1, Math.round(q2 / ratio / 5) * 5)
  const u = sc.unit
  const eps = round6(sc.kind === 'fridge' ? copFridge(q2, w) : copPump(q2, w))
  const q1 = q2 + w
  const text =
    sc.kind === 'fridge'
      ? `${sc.title} odebere z vnitřku teplo **Q_{2} = ${cz(q2)} ${u}**, kompresor přitom spotřebuje práci **W = ${cz(w)} ${u}**. Jaký je chladicí faktor ε = Q_{2}/W?`
      : `${sc.title} odebere venkovnímu vzduchu teplo **Q_{2} = ${cz(q2)} ${u}**, kompresor spotřebuje **W = ${cz(w)} ${u}** elektrické energie. Jaký je topný faktor ε = Q_{1}/W?`
  return {
    kind: 'cop',
    key: `cop:${sc.id}`,
    level,
    title: sc.title,
    text,
    symbol: 'ε',
    unit: '',
    value: eps,
    tol: Math.max(0.01, eps * REL_TOL),
    flow: {
      mode: 'fridge',
      hot: sc.kind === 'fridge' ? 'kuchyň' : 'dům',
      cold: sc.kind === 'fridge' ? 'vnitřek' : 'venkovní vzduch',
      machine: sc.kind === 'fridge' ? 'chladnička' : 'čerpadlo',
      unit: u,
      q1,
      w,
      q2,
      unknown: sc.kind === 'fridge' ? [] : ['q1'],
    },
    explain:
      sc.kind === 'fridge'
        ? `ε = Q_{2} / W = ${cz(q2)} : ${cz(w)} ≐ ${cz(eps)}. Do kuchyně odchází Q_{1} = Q_{2} + W = ${cz(q1)} ${u}.`
        : `Do domu jde Q_{1} = Q_{2} + W = ${cz(q2)} + ${cz(w)} = ${cz(q1)} ${u}; ε = Q_{1} / W ≐ ${cz(eps)}.`,
  }
}

/* ------------------------------------------------------------------ rounds */

export const LEVEL_NUMBERS = [3, 4, 7, 10] as const

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && (LEVEL_NUMBERS as readonly number[]).includes(n) ? n : undefined
}

/** Chain tasks from distinct chains: `order` ordering tasks and `missing` fill-the-gap tasks. */
function chainTasks(level: number, order: number, missing: number, rng: Rng): Task[] {
  const chains = shuffle(CHAINS[level], rng)
  const out: Task[] = []
  chains.slice(0, order).forEach((ch) => out.push(orderTask(ch, level, rng)))
  chains.slice(order, order + missing).forEach((ch) => out.push(missingTask(ch, level, rng)))
  return out
}

function numberTasks(rng: Rng, plan: ('eta-w' | 'eta-q2' | 'useful' | 'carnot' | 'cop')[]): Task[] {
  const used = new Set<string>()
  const out: Task[] = []
  for (const p of plan) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const t =
        p === 'eta-w' ? etaTask(rng, 10, 'w') : p === 'eta-q2' ? etaTask(rng, 10, 'q2') : p === 'useful' ? usefulTask(rng, 10) : p === 'carnot' ? carnotTask(rng, 10) : copTask(rng, 10)
      if (used.has(t.key)) continue
      used.add(t.key)
      out.push(t)
      break
    }
  }
  return out
}

/**
 * A round: levels 3, 4, 7 → 8 chains (5 to order, 3 with a missing link);
 * level 10 → 3 chains + 7 efficiency tasks; free play → 2 chains from each of
 * levels 3, 4, 7 and 4 tasks of level 10 (10 in all).
 */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  if (level === 10) {
    const chains = chainTasks(10, 2, 1, rng)
    const nums = numberTasks(rng, ['eta-w', 'eta-q2', 'useful', 'useful', 'carnot', 'carnot', 'cop'])
    return [...shuffle(chains, rng), ...shuffle(nums, rng)]
  }
  if (level !== undefined) return shuffle(chainTasks(level, 5, 3, rng), rng)
  const out: Task[] = []
  for (const lv of [3, 4, 7]) out.push(...shuffle(chainTasks(lv, 1, 1, rng), rng))
  out.push(...chainTasks(10, 1, 0, rng), ...numberTasks(rng, ['eta-w', 'carnot', 'cop']))
  return out
}

/* ------------------------------------------------------------------ checking */

/** Which positions of the learner's order are right. */
export const positionsRight = (order: Card[], chain: Chain) => order.map((c, i) => c.text === chain.cards[i].text && c.form === chain.cards[i].form)

export const isRightOrder = (order: Card[], chain: Chain) => positionsRight(order, chain).every(Boolean)

/** Moves item `from` to position `to` (keyboard up / down buttons). */
export function move<T>(arr: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return [...arr]
  const out = [...arr]
  const [x] = out.splice(from, 1)
  out.splice(to, 0, x)
  return out
}

export type Check = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

export function checkNumber(input: string, t: NumberTask): Check {
  const value = parseDecimal(input.replace(/(%|[kM]?J)\s*$/i, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - t.value) <= t.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}

/** The chain as a line of energy forms: "polohová → pohybová → …". */
export const formsLine = (chain: Chain) => chain.cards.map((c) => c.form).join(' → ')
