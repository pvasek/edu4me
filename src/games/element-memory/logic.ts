import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { elementPool, sample, shuffle } from '../shared/util'

export interface MemCard {
  id: number
  sym: string
  face: 'symbol' | 'name'
}

/** Symbols whose Czech names don't resemble the symbol – the fun part of the game. */
const TRICKY = ['Na', 'K', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Fe', 'Cu', 'S', 'Si', 'C', 'N', 'O', 'H', 'P', 'Mg', 'Ca', 'Mn', 'Sb', 'W', 'Bi', 'Cl', 'F']

export function pairCount(level: number): number {
  return level <= 2 ? 6 : 8
}

export function dealCards(level: number, rng: () => number = Math.random): MemCard[] {
  const pairs = pairCount(level)
  const pool = elementPool(level).map((e) => e.symbol)
  const tricky = pool.filter((s) => TRICKY.includes(s))
  const first = sample(tricky, Math.ceil(pairs / 2), rng)
  const rest = sample(
    pool.filter((s) => !first.includes(s)),
    pairs - first.length,
    rng,
  )
  const syms = [...first, ...rest].filter((s) => BY_SYMBOL[s])
  const cards: MemCard[] = syms.flatMap((sym) => [
    { id: 0, sym, face: 'symbol' as const },
    { id: 0, sym, face: 'name' as const },
  ])
  return shuffle(cards, rng).map((c, i) => ({ ...c, id: i }))
}

/**
 * Score 0–100 from the number of moves (one move = turning two cards).
 * Up to 1.5 × pairs moves is perfect, then −5 per extra move, never below 10.
 */
export function memoryScore(moves: number, pairs: number): number {
  const free = Math.ceil(pairs * 1.5)
  return Math.max(10, Math.min(100, 100 - Math.max(0, moves - free) * 5))
}
