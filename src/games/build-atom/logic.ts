import { BY_SYMBOL, BY_Z } from '../../courses/chemie/data/elements'
import { pick, sample, shuffle } from '../shared/util'

export interface AtomTask {
  kind: 'atom' | 'ion' | 'isotope'
  symbol: string
  z: number
  /** neutrons */
  n: number
  /** electrons */
  e: number
  /** mass number */
  a: number
  charge: number
  /** isotope name, e.g. "deuterium" */
  label?: string
}

export const MAX_P = 20
export const MAX_N = 24
export const MAX_E = 20

/** Most common isotope's mass number (fine for Z <= 20). */
export const commonA = (z: number) => Math.round(BY_Z[z].mass)

function atom(symbol: string): AtomTask {
  const z = BY_SYMBOL[symbol].z
  const a = commonA(z)
  return { kind: 'atom', symbol, z, n: a - z, e: z, a, charge: 0 }
}

function ion(symbol: string, charge: number): AtomTask {
  const t = atom(symbol)
  return { ...t, kind: 'ion', e: t.z - charge, charge }
}

function isotope(symbol: string, a: number, label: string): AtomTask {
  const z = BY_SYMBOL[symbol].z
  return { kind: 'isotope', symbol, z, n: a - z, e: z, a, charge: 0, label }
}

const CATIONS: [string, number][] = [
  ['Li', 1], ['Na', 1], ['K', 1], ['Be', 2], ['Mg', 2], ['Ca', 2], ['Al', 3],
]
const ANIONS: [string, number][] = [
  ['F', -1], ['Cl', -1], ['O', -2], ['S', -2], ['N', -3],
]
const ISOTOPES: [string, number, string][] = [
  ['H', 2, 'deuterium'],
  ['H', 3, 'tritium'],
  ['C', 14, 'uhlík-14'],
  ['C', 13, 'uhlík-13'],
  ['N', 15, 'dusík-15'],
  ['O', 18, 'kyslík-18'],
  ['Cl', 37, 'chlor-37'],
  ['Li', 6, 'lithium-6'],
  ['B', 10, 'bor-10'],
  ['K', 40, 'draslík-40'],
]
const LIGHT = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne']
const HEAVIER = ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca']

/** Six tasks, easy to harder: atom, atom, cation, anion, isotope, surprise. */
export function makeTasks(rng: () => number = Math.random): AtomTask[] {
  const [iso1, iso2] = sample(ISOTOPES, 2, rng)
  const cat = pick(CATIONS, rng)
  const an = pick(ANIONS, rng)
  const last = shuffle(
    [
      isotope(...iso2),
      ion(...pick(CATIONS.filter((c) => c[0] !== cat[0]), rng)),
      ion(...pick(ANIONS.filter((c) => c[0] !== an[0]), rng)),
    ],
    rng,
  )[0]
  return [atom(pick(LIGHT, rng)), atom(pick(HEAVIER, rng)), ion(...cat), ion(...an), isotope(...iso1), last]
}

/** "2+", "−", "3−", "" for 0. */
export function chargeText(q: number): string {
  if (q === 0) return ''
  const n = Math.abs(q)
  return `${n > 1 ? n : ''}${q > 0 ? '+' : '−'}`
}

const elektronu = (n: number) => (n === 1 ? 'elektronu' : 'elektronů')

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
        `**Elektrony:** kation $${t.symbol}^{${chargeText(t.charge)}}$ vznikl ztrátou ${t.charge} ${elektronu(t.charge)}: ${t.z} − ${t.charge} = ${t.e} (máš ${e}).`,
      )
    } else {
      const q = -t.charge
      problems.push(
        `**Elektrony:** anion $${t.symbol}^{${chargeText(t.charge)}}$ vznikl přijetím ${q} ${elektronu(q)}: ${t.z} + ${q} = ${t.e} (máš ${e}).`,
      )
    }
  }
  return { ok: problems.length === 0, problems }
}

/** Points for a task by attempt number (1-based). */
export function taskPoints(attempt: number): number {
  return attempt === 1 ? 100 : attempt === 2 ? 60 : attempt === 3 ? 30 : 0
}
