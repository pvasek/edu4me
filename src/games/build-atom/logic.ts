import { BY_SYMBOL, BY_Z } from '../../courses/chemie/data/elements'
import { pickLevel, shuffle } from '../shared/util'
import { LEVELS, PLANS, type AtomTask } from './levels'

export type { AtomTask }

export const MAX_P = 20
export const MAX_N = 24
export const MAX_E = 20

/** Most common isotope's mass number (fine for Z <= 20). */
export const commonA = (z: number) => Math.round(BY_Z[z].mass)

const idOf = (t: AtomTask) => `${t.kind}|${t.symbol}|${t.a}|${t.charge}`

/**
 * Six tasks for a round from the level's content set (./levels.ts), easier first.
 * Without a level, or with one the game has no set for, the round mixes all levels.
 */
export function makeLevelTasks(level?: number, rng: () => number = Math.random): AtomTask[] {
  const lv = pickLevel(LEVELS, level)
  const plan = PLANS[lv ?? 'mix']
  const used = new Set<string>()
  const symbols = new Set<string>()
  return plan.map((slot) => {
    const fits = LEVELS[slot.level].filter((t) => t.kind === slot.kind && (!slot.where || slot.where(t)) && !used.has(idOf(t)))
    // prefer an element that is not in the round yet
    const fresh = fits.filter((t) => !symbols.has(t.symbol))
    const t = shuffle(fresh.length ? fresh : fits, rng)[0]
    used.add(idOf(t))
    symbols.add(t.symbol)
    return t
  })
}

/** Six tasks mixing all levels (kept for older callers). */
export function makeTasks(rng: () => number = Math.random): AtomTask[] {
  return makeLevelTasks(undefined, rng)
}

/** "2+", "−", "3−", "" for 0. */
export function chargeText(q: number): string {
  if (q === 0) return ''
  const n = Math.abs(q)
  return `${n > 1 ? n : ''}${q > 0 ? '+' : '−'}`
}

const elektronu = (n: number) => (n === 1 ? 'elektronu' : 'elektronů')

/** " V $Al2O3$ je kyslík jako $O^{2-}$ …" – why the ion has that charge (level-3 tasks). */
function partnerNote(t: AtomTask): string {
  if (!t.partner) return ''
  const o = t.partner
  return ` Ve sloučenině $${o.formula}$ je ${BY_SYMBOL[o.other].name.toLowerCase()} jako $${o.other}^{${chargeText(o.otherCharge)}}$ a náboje se musí vyrovnat.`
}

/** Noble gas the ion shares its electron configuration with, e.g. "neon". */
export function nobleText(t: AtomTask): string | null {
  return t.noble ? `${BY_SYMBOL[t.noble].name.toLowerCase()} ($${t.noble}$)` : null
}

export interface AtomCheck {
  ok: boolean
  /** Explanations in <Md> markup, one per wrong particle. */
  problems: string[]
}

export function checkAtom(t: AtomTask, p: number, n: number, e: number): AtomCheck {
  const el = BY_Z[t.z]
  const problems: string[] = []
  if (p !== t.z) {
    problems.push(`**Protony:** prvek určuje protonové číslo. ${el.name} má Z = ${t.z}, takže potřebuje ${t.z} protonů (máš ${p}).`)
  }
  if (n !== t.n) {
    const who = t.label ? `Izotop ${t.label}` : `$^{${t.a}}${t.symbol}$`
    problems.push(`**Neutrony:** ${who} má nukleonové číslo A = ${t.a}, takže neutronů je A − Z = ${t.a} − ${t.z} = ${t.n} (máš ${n}).`)
  }
  if (e !== t.e) {
    if (t.charge === 0) {
      problems.push(`**Elektrony:** neutrální atom má stejně elektronů jako protonů, tedy ${t.z} (máš ${e}).`)
    } else if (t.charge > 0) {
      problems.push(
        `**Elektrony:** kation $${t.symbol}^{${chargeText(t.charge)}}$ vznikl ztrátou ${t.charge} ${elektronu(t.charge)}: ${t.z} − ${t.charge} = ${t.e} (máš ${e}).${partnerNote(t)}`,
      )
    } else {
      const q = -t.charge
      problems.push(
        `**Elektrony:** anion $${t.symbol}^{${chargeText(t.charge)}}$ vznikl přijetím ${q} ${elektronu(q)}: ${t.z} + ${q} = ${t.e} (máš ${e}).${partnerNote(t)}`,
      )
    }
  }
  return { ok: problems.length === 0, problems }
}

/** Points for a task by attempt number (1-based). */
export function taskPoints(attempt: number): number {
  return attempt === 1 ? 100 : attempt === 2 ? 60 : attempt === 3 ? 30 : 0
}
