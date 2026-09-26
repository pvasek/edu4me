import { CATEGORY_LABEL, ELEMENTS, type ChemElement } from '../../courses/chemie/data/elements'
import { elementPool, inPeriod, sample, shuffle } from '../shared/util'

export type PromptKind = 'name' | 'symbol' | 'hint'
export interface FindRound {
  el: ChemElement
  kind: PromptKind
  /** Text shown big (name, symbol or the hint). */
  text: string
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** A clue that identifies exactly one element, e.g. "Halogen ve 3. periodě". */
export function hintFor(el: ChemElement): string | null {
  if (el.group === null) return null
  const samePeriod = ELEMENTS.filter((e) => e.period === el.period && e.group !== null)
  if (samePeriod.filter((e) => e.category === el.category).length === 1) {
    return `${cap(CATEGORY_LABEL[el.category])} ${inPeriod(el.period)}`
  }
  return `Prvek ${el.group}. skupiny ${inPeriod(el.period)}`
}

export function makeRounds(level: number, count = 10, rng: () => number = Math.random): FindRound[] {
  const els = sample(elementPool(level), count, rng)
  const hints = level <= 2 ? 1 : level <= 6 ? 2 : 3
  const symbols = 2
  const kinds: PromptKind[] = shuffle(
    Array.from({ length: count }, (_, i) => (i < hints ? 'hint' : i < hints + symbols ? 'symbol' : 'name')),
    rng,
  )
  return els.map((el, i) => {
    let kind = kinds[i]
    const hint = hintFor(el)
    if (kind === 'hint' && !hint) kind = 'name'
    const text = kind === 'hint' ? hint! : kind === 'symbol' ? el.symbol : el.name
    return { el, kind, text }
  })
}

/** Points for a round: 100 + up to 30 speed bonus on the first try, 50 on the second. */
export const MAX_PER_ROUND = 130
