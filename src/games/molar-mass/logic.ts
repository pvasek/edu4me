import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { parseFormula } from '../../courses/chemie/data/formula'
import { levelNum } from '../types'
import { parseDecimal, sample } from '../shared/util'
import { LEVELS, type MassItem } from './levels'

export const TOLERANCE = 0.5
/** Relative tolerance for big molecules (rounded Ar values add up): 0,1 %. */
export const REL_TOLERANCE = 0.001
export const ROUND = 8

/** Level number whose set is played; undefined = mix of all sets. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

const ALL: MassItem[] = Object.values(LEVELS).flat()
const NAME = new Map(ALL.map((x) => [x.formula, x.name]))

/** Czech name of a formula from the level sets ('' if unknown). */
export const nameOf = (formula: string) => NAME.get(formula) ?? ''

/** Number of atoms in the formula (used to order a round from easy to hard). */
export const atomCount = (formula: string) => Object.values(parseFormula(formula)).reduce((a, b) => a + b, 0)

/**
 * 8 formulas of a level (all levels mixed when `level` is undefined),
 * ordered from the fewest atoms to the most.
 */
export function pickItems(level?: number, rng: () => number = Math.random): MassItem[] {
  const pool = level !== undefined && LEVELS[level] ? LEVELS[level] : ALL
  return sample(pool, ROUND, rng).sort((a, b) => atomCount(a.formula) - atomCount(b.formula) || a.formula.localeCompare(b.formula))
}

/** Formulas only (see pickItems). */
export function pickFormulas(rng: () => number = Math.random, level?: number): string[] {
  return pickItems(level, rng).map((x) => x.formula)
}

export interface BreakdownRow {
  symbol: string
  count: number
  ar: number
  subtotal: number
}

/** Element × count × Ar, in the order the elements first appear in the formula. */
export function breakdown(formula: string): { rows: BreakdownRow[]; total: number } {
  const rows = Object.entries(parseFormula(formula)).map(([symbol, count]) => {
    const ar = BY_SYMBOL[symbol].mass
    return { symbol, count, ar, subtotal: ar * count }
  })
  return { rows, total: rows.reduce((a, r) => a + r.subtotal, 0) }
}

/** Allowed deviation in g/mol: ±0,5, or 0,1 % for big molecules. */
export const toleranceFor = (total: number, tolerance = TOLERANCE) => Math.max(tolerance, total * REL_TOLERANCE)

export type MassCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

/** Accepts "18,02", "18.02", "18 g/mol"; right within ±0,5 g/mol (0,1 % for big molecules). */
export function checkMass(input: string, formula: string, tolerance = TOLERANCE): MassCheck {
  const value = parseDecimal(input)
  if (value === null) return { kind: 'invalid' }
  const { total } = breakdown(formula)
  return Math.abs(value - total) <= toleranceFor(total, tolerance) + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}
