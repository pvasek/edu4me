/**
 * Model of the `doubling-time` experiment (z5-1): a population growing by r % a
 * year (compound growth) doubles after T = ln 2 / ln(1 + r/100) years; for small r
 * this is ≈ 69,3 / r, rounded to the "rule of 70": T ≈ 70 / r.
 *
 * Growth rates (whole population change, births − deaths + migration):
 * - Niger 3,3 % (2025) and Indie 0,9 % (2023): UN World Population Prospects 2024
 *   (computed from the WPP 2024 population estimates 2022 → 2023: 3,36 %, 0,89 %),
 * - Česko 0,1 %: ČSÚ 2024 (+8,9 tis. to 10,9 mil., +0,08 %; natural decrease
 *   −27,9 tis., migration +36,8 tis.).
 */

export const R_MAX = 4
export const YEARS = 100

export function doublingTime(rPct: number): number {
  if (rPct <= 0) return Infinity
  return Math.log(2) / Math.log(1 + rPct / 100)
}
export const ruleOf70 = (rPct: number) => (rPct > 0 ? 70 / rPct : Infinity)
export const factor = (rPct: number, years: number) => (1 + rPct / 100) ** years

export type Country = 'niger' | 'indie' | 'cesko'
export const COUNTRIES: Record<Country, { name: string; r: number; source: string }> = {
  niger: { name: 'Niger', r: 3.3, source: 'UN WPP 2024, rok 2025' },
  indie: { name: 'Indie', r: 0.9, source: 'UN WPP 2024, rok 2023' },
  cesko: { name: 'Česko', r: 0.1, source: 'ČSÚ, rok 2024' },
}
export const countryOf = (r: number): Country | '' =>
  (Object.keys(COUNTRIES) as Country[]).find((c) => Math.abs(COUNTRIES[c].r - r) < 1e-9) ?? ''

/** The challenge: the population doubles in 35 years (± 0,6 year). */
export const CH_YEARS = 35
export const challengeMet = (r: number) => Math.abs(doublingTime(r) - CH_YEARS) <= 0.6
