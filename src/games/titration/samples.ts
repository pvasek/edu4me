/**
 * Content of the titration game per level (see spec/courses/chemie/games.md):
 *  - L5 HCl with NaOH and phenolphthalein,
 *  - L6 CH₃COOH (vinegar) with NaOH after choosing the indicator, and H₂SO₄
 *    with NaOH (1 : 2).
 * Free play ("Vše") or an unsupported level mixes the samples of all levels.
 */
import { ACIDS, randomSample, type AcidId, type Sample } from './titration'

export const SAMPLES_PER_ROUND = 2

export interface LevelSet {
  /** Acids titrated in one round, in order. */
  acids: AcidId[]
}

export const LEVELS: Record<number, LevelSet> = {
  5: { acids: ['hcl', 'hcl'] },
  6: { acids: ['ch3cooh', 'h2so4'] },
}

/** Level that introduces an acid (for the "Vše" label). */
export const levelOfAcid = (acid: AcidId): number =>
  Number(Object.entries(LEVELS).find(([, set]) => set.acids.includes(acid))?.[0] ?? 5)

export function pickSamples(level?: number, rnd: () => number = Math.random): Sample[] {
  if (level !== undefined && LEVELS[level]) return LEVELS[level].acids.map((a) => randomSample(a, rnd))
  // Mix: two different acids from all levels, easier level first.
  const all = [...new Set(Object.values(LEVELS).flatMap((l) => l.acids))]
  const first = all.splice(Math.floor(rnd() * all.length), 1)[0]
  const second = all[Math.floor(rnd() * all.length)]
  return [first, second].sort((a, b) => levelOfAcid(a) - levelOfAcid(b)).map((a) => randomSample(a, rnd))
}

/* ----------------------------- indicators ----------------------------- */

export type IndicatorId = 'fenolftalein' | 'methyloranz'

export interface Indicator {
  id: IndicatorId
  name: string
  /** Colour change interval (pH). */
  from: number
  to: number
  /** Czech colour description "kyselá → zásaditá". */
  colours: string
}

export const INDICATORS: Record<IndicatorId, Indicator> = {
  fenolftalein: { id: 'fenolftalein', name: 'fenolftalein', from: 8.2, to: 10, colours: 'bezbarvý → fialově růžový' },
  methyloranz: { id: 'methyloranz', name: 'methyloranž', from: 3.1, to: 4.4, colours: 'červená → žlutá' },
}

/** Indicator options offered before a titration where the learner chooses. */
export const INDICATOR_CHOICE: IndicatorId[] = ['fenolftalein', 'methyloranz']

/** The right indicator changes colour inside the pH jump around equivalence (with phenolphthalein for all our samples). */
export const RIGHT_INDICATOR: IndicatorId = 'fenolftalein'

/** Fraction of the equivalence volume at which a weak acid reaches `ph` (Henderson–Hasselbalch). */
export const fractionAtPh = (pKa: number, ph: number) => 1 / (1 + 10 ** (pKa - ph))

export function indicatorExplain(acid: AcidId, picked: IndicatorId): string {
  const pKa = ACIDS[acid].pKa ?? 4.76
  const third = Math.round(fractionAtPh(pKa, INDICATORS.methyloranz.to) * 100)
  if (picked === RIGHT_INDICATOR)
    return `Správně! V bodě ekvivalence je v baňce octan sodný a pH je asi 8,7. Fenolftalein mění barvu při pH 8,2–10,0, tedy právě ve skoku pH.`
  return `Methyloranž mění barvu při pH 3,1–4,4. Kyselina octová (pK_{a} 4,76) by jí zežloutla už po asi ${third} % potřebného NaOH, dávno před bodem ekvivalence (pH ≈ 8,7). Titruješ proto s fenolftaleinem.`
}
