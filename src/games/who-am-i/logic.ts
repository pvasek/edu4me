import { BY_SYMBOL, CATEGORY_LABEL, ELEMENTS, fmtMass, type ChemElement } from '../../courses/chemie/data/elements'
import { valenceElectrons } from '../../courses/chemie/data/electronConfig'
import { elementPool, inPeriod, mixLevels, normalize, pickLevel, sample, shuffle } from '../shared/util'
import { FACTS } from './facts'
import { COMPOUNDS, LEVELS, type Hint, type Subject } from './levels'

export type { Hint, Subject }

/** Points by number of hints seen when guessing correctly. */
export const POINTS = [100, 80, 60, 40, 20]
/** Picking from 4 tiles is easier than typing. */
export const TILE_FACTOR = 0.6

export function roundPoints(hintsShown: number, mode: 'type' | 'tiles'): number {
  const p = POINTS[Math.min(POINTS.length, Math.max(1, hintsShown)) - 1]
  return mode === 'tiles' ? Math.round(p * TILE_FACTOR) : p
}

const STATE: Record<ChemElement['state'], string> = { gas: 'plyn', liquid: 'kapalina', solid: 'pevná látka' }

function valenceText(v: number): string {
  if (v === 1) return 'Mám 1 valenční elektron.'
  if (v >= 2 && v <= 4) return `Mám ${v} valenční elektrony.`
  return `Mám ${v} valenčních elektronů.`
}

/** Legacy generic hints for any element (the game uses the per-level sets in ./levels.ts). */
export function hintsFor(el: ChemElement): Hint[] {
  const isMain = el.group !== null && (el.group <= 2 || el.group >= 13)
  const where = el.group === null ? `Najdeš mě v f-bloku, ${inPeriod(el.period)}.` : `Najdeš mě ${inPeriod(el.period)}.`
  const electrons = isMain
    ? valenceText(valenceElectrons(el.z))
    : el.group !== null
      ? `Patřím do ${el.group}. skupiny, mezi prvky d-bloku.`
      : `Můj atom má ${el.z} elektronů.`
  return [
    { label: 'Kategorie', text: `Jsem ${CATEGORY_LABEL[el.category]} a za pokojové teploty ${STATE[el.state]}.` },
    { label: 'Poloha', text: where },
    { label: 'Zajímavost', text: FACTS[el.symbol] ?? `Moje elektronegativita je ${el.en ?? 'neurčená'}.` },
    { label: 'Elektrony', text: electrons },
    { label: 'Čísla', text: `Mám protonové číslo ${el.z} a relativní atomovou hmotnost asi ${fmtMass(el.mass)}.` },
  ]
}

/** Exact match by Czech name (diacritics/case-insensitive) or by symbol (case-insensitive). */
export function matchElement(input: string): ChemElement | undefined {
  const q = normalize(input)
  if (!q) return undefined
  return ELEMENTS.find((e) => normalize(e.name) === q) ?? ELEMENTS.find((e) => e.symbol.toLowerCase() === q)
}

/** Autocomplete suggestions: symbol match first, then names starting with the text, then names containing it. */
export function suggest(input: string, limit = 6): ChemElement[] {
  const q = normalize(input)
  if (!q) return []
  const ranked: { e: ChemElement; r: number }[] = []
  for (const e of ELEMENTS) {
    const n = normalize(e.name)
    let r = -1
    if (e.symbol.toLowerCase() === q) r = 0
    else if (n.startsWith(q)) r = 1
    else if (q.length >= 2 && n.includes(q)) r = 2
    if (r >= 0) ranked.push({ e, r })
  }
  return ranked
    .sort((a, b) => a.r - b.r || a.e.z - b.e.z)
    .slice(0, limit)
    .map((x) => x.e)
}

/** Elements to guess: known at this level and having a fun fact. */
export function targetPool(level: number): ChemElement[] {
  const withFacts = elementPool(level).filter((e) => FACTS[e.symbol])
  return withFacts.length >= 8 ? withFacts : Object.keys(FACTS).map((s) => BY_SYMBOL[s])
}

export function pickTargets(level: number, n = 5, rng: () => number = Math.random): ChemElement[] {
  return sample(targetPool(level), n, rng)
}

/** Four tiles: the answer + 3 plausible distractors (same category or period first). */
export function tileOptions(target: ChemElement, level: number, rng: () => number = Math.random): ChemElement[] {
  const pool = elementPool(level).filter((e) => e.z !== target.z)
  const close = pool.filter((e) => e.category === target.category || e.period === target.period)
  const others = shuffle(close.length >= 3 ? close : pool, rng).slice(0, 3)
  return shuffle([target, ...others], rng)
}

// ───────────────────────────── per-level content (./levels.ts)

/** One thing to guess in a round, with the level its content set comes from. */
export interface WhoRound {
  subject: Subject
  level: number
}

/** A possible answer: an element (with `symbol`) or a compound (with `formula`). */
export interface Answer {
  id: string
  name: string
  symbol?: string
  formula?: string
}

export const elementAnswer = (e: ChemElement): Answer => ({ id: e.symbol, name: e.name, symbol: e.symbol })
const compoundAnswer = (s: Subject): Answer => ({ id: s.id, name: s.name, formula: s.formula })
export const subjectAnswer = (s: Subject): Answer => (s.kind === 'element' ? elementAnswer(BY_SYMBOL[s.id]) : compoundAnswer(s))

/**
 * Subjects for a round from the level's content set, all different.
 * Without a level, or with one the game has no set for, the round mixes all levels.
 */
export function pickSubjects(level?: number, n = 5, rng: () => number = Math.random): WhoRound[] {
  const lv = pickLevel(LEVELS, level)
  if (lv === undefined) return shuffle(mixLevels(LEVELS, n, rng, (s) => s.id), rng).map(({ item, level: l }) => ({ subject: item, level: l }))
  return sample(LEVELS[lv], n, rng).map((subject) => ({ subject, level: lv }))
}

const namesOf = (s: Subject) => [s.name, ...(s.aliases ?? [])].map(normalize)

/** Exact typed answer: element by name or symbol, compound by name or any alias (diacritics-insensitive). */
export function matchAnswer(input: string, kind: Subject['kind']): Answer | undefined {
  if (kind === 'element') {
    const e = matchElement(input)
    return e && elementAnswer(e)
  }
  const q = normalize(input)
  if (!q) return undefined
  const s = COMPOUNDS.find((c) => namesOf(c).includes(q))
  return s && compoundAnswer(s)
}

/** Autocomplete: elements as in `suggest`, compounds by name/alias prefix, then by substring. */
export function suggestAnswers(input: string, kind: Subject['kind'], limit = 6): Answer[] {
  if (kind === 'element') return suggest(input, limit).map(elementAnswer)
  const q = normalize(input)
  if (!q) return []
  const ranked: { s: Subject; r: number }[] = []
  for (const s of COMPOUNDS) {
    const names = namesOf(s)
    const r = names.some((n) => n.startsWith(q)) ? 1 : q.length >= 2 && names.some((n) => n.includes(q)) ? 2 : -1
    if (r >= 0) ranked.push({ s, r })
  }
  return ranked
    .sort((a, b) => a.r - b.r || a.s.name.localeCompare(b.s.name, 'cs'))
    .slice(0, limit)
    .map((x) => compoundAnswer(x.s))
}

/** Four options for "Vyber ze 4": the answer + 3 plausible distractors from the same level. */
export function answerOptions(round: WhoRound, rng: () => number = Math.random): Answer[] {
  const { subject, level } = round
  const others = LEVELS[level].filter((s) => s.id !== subject.id)
  if (subject.kind === 'element') {
    const target = BY_SYMBOL[subject.id]
    const pool = others.map((s) => BY_SYMBOL[s.id])
    const close = pool.filter((e) => e.category === target.category || e.period === target.period)
    const picked = [...shuffle(close, rng), ...shuffle(pool.filter((e) => !close.includes(e)), rng)].slice(0, 3)
    return shuffle([target, ...picked], rng).map(elementAnswer)
  }
  const close = others.filter((s) => s.family === subject.family)
  const picked = [...shuffle(close, rng), ...shuffle(others.filter((s) => !close.includes(s)), rng)].slice(0, 3)
  return shuffle([subject, ...picked], rng).map(compoundAnswer)
}
