import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { parseFormula } from '../../courses/chemie/data/formula'
import { parseDecimal, sample } from '../shared/util'

export const EASY = ['H2O', 'CO2', 'NaCl', 'NH3', 'CH4', 'HCl', 'KCl', 'MgO', 'CaO', 'O2']
export const MEDIUM = ['H2SO4', 'HNO3', 'NaOH', 'CaCO3', 'Ca(OH)2', 'NaHCO3', 'KMnO4', 'Fe2O3', 'H3PO4', 'C2H5OH']
export const HARD = ['CuSO4·5H2O', 'C6H12O6', 'Al2(SO4)3', 'Ca3(PO4)2', '(NH4)2SO4', 'Mg(NO3)2', 'Fe2(SO4)3']

export const TOLERANCE = 0.5

/** 8 formulas: 3 easy, 3 medium, 2 hard, in that order. */
export function pickFormulas(rng: () => number = Math.random): string[] {
  return [...sample(EASY, 3, rng), ...sample(MEDIUM, 3, rng), ...sample(HARD, 2, rng)]
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

export type MassCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

/** Accepts "18,02", "18.02", "18 g/mol"; right within ±0,5 g/mol. */
export function checkMass(input: string, formula: string, tolerance = TOLERANCE): MassCheck {
  const value = parseDecimal(input)
  if (value === null) return { kind: 'invalid' }
  const { total } = breakdown(formula)
  return Math.abs(value - total) <= tolerance + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}
