import { BY_SYMBOL, CATEGORY_LABEL, ELEMENTS, type ChemElement } from '../../courses/chemie/data/elements'
import { elementPool, inPeriod, mixLevels, pickLevel, sample, shuffle } from '../shared/util'
import { LEVELS, NAME_SYMBOL_QUOTA, type FindPrompt, type PromptKind } from './levels'

export type { PromptKind }
export interface FindRound {
  el: ChemElement
  kind: PromptKind
  /** Text shown big (name, symbol or the hint); <Md> markup. */
  text: string
  /** Explanation shown once the element is found (<Md> markup). */
  why?: string
  /** Level whose content set the prompt comes from. */
  level?: number
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

/** Legacy level-agnostic rounds from the element pools (kept for older callers; the game uses makeLevelRounds). */
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

const toRound = (p: FindPrompt, level: number): FindRound => ({
  el: BY_SYMBOL[p.answer],
  kind: p.kind,
  text: p.text,
  why: p.why,
  level,
})

/**
 * Rounds from the level's content set (see ./levels.ts): distinct elements, clue types varied.
 * Without a level, or with one the game has no set for, the rounds mix all levels.
 */
export function makeLevelRounds(level?: number, count = 10, rng: () => number = Math.random): FindRound[] {
  const lv = pickLevel(LEVELS, level)
  if (lv === undefined) {
    return shuffle(
      mixLevels(LEVELS, count, rng, (p) => p.answer).map(({ item, level: l }) => toRound(item, l)),
      rng,
    )
  }
  const quota = NAME_SYMBOL_QUOTA[lv] ?? { name: 0, symbol: 0 }
  const want: Record<PromptKind, number> = { name: quota.name, symbol: quota.symbol, hint: count - quota.name - quota.symbol }
  const perTag = Math.max(2, Math.ceil(want.hint / 3))
  const used = new Set<string>()
  const tags: Record<string, number> = {}
  const out: FindPrompt[] = []
  const pool = shuffle(LEVELS[lv], rng)
  // two passes: first keep clue types varied, then fill whatever is missing
  for (const strict of [true, false]) {
    for (const p of pool) {
      if (out.length >= count) break
      if (used.has(p.answer) || want[p.kind] <= 0) continue
      const tag = p.tag ?? p.kind
      if (strict && p.kind === 'hint' && (tags[tag] ?? 0) >= perTag) continue
      out.push(p)
      used.add(p.answer)
      want[p.kind]--
      tags[tag] = (tags[tag] ?? 0) + 1
    }
  }
  return shuffle(out, rng).map((p) => toRound(p, lv))
}

/** Points for a round: 100 + up to 30 speed bonus on the first try, 50 on the second. */
export const MAX_PER_ROUND = 130
