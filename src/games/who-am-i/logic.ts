import { BY_SYMBOL, CATEGORY_LABEL, ELEMENTS, fmtMass, type ChemElement } from '../../courses/chemie/data/elements'
import { valenceElectrons } from '../../courses/chemie/data/electronConfig'
import { elementPool, inPeriod, normalize, sample, shuffle } from '../shared/util'
import { FACTS } from './facts'

export interface Hint {
  label: string
  text: string
}

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

/** Five hints from vague to specific. */
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
