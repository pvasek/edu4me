/**
 * Věková pyramida – content per level (spec/courses/zemepis/games.md):
 * 5 shape → type (progresivní, stacionární, regresivní), shares, strong and weak
 * generations · 6 pyramid and the level of development · 11 demographic transition,
 * a projection 20 years ahead, migration · 12 ageing, the dependency ratio, the future.
 *
 * A level is a plan of task kinds played in turn; free play mixes the levels. The
 * populations are in data.ts (UN WPP 2024); every answer is computed in logic.ts.
 */

export type TaskKind =
  | 'type'
  | 'share'
  | 'more'
  | 'cohort'
  | 'war'
  | 'develop'
  | 'country'
  | 'stage'
  | 'future'
  | 'trend'
  | 'surplus'
  | 'dependency'
  | 'support'
  | 'dep-pair'

export interface LevelSet {
  plan: TaskKind[]
  /** projection year used by the 'trend' tasks */
  trendYear?: number
}

export const LEVELS: Record<number, LevelSet> = {
  5: { plan: ['type', 'share', 'cohort', 'more', 'type', 'war', 'share', 'cohort', 'type', 'more'] },
  6: { plan: ['develop', 'type', 'country', 'share', 'develop', 'type', 'country', 'more', 'develop', 'share'] },
  11: { plan: ['stage', 'future', 'trend', 'surplus', 'country', 'stage', 'future', 'cohort', 'stage', 'surplus'], trendYear: 2043 },
  12: { plan: ['dependency', 'support', 'dep-pair', 'trend', 'dependency', 'dep-pair', 'support', 'trend', 'dependency', 'dep-pair'], trendYear: 2050 },
}

/**
 * Strong and weak generations: people born in `from`–`to` (one 5-year group in `pop`).
 * The story is a historical fact; the age group is computed, and the test checks that a
 * strong group is a local maximum of the pyramid and a weak one a local minimum.
 */
export interface Cohort {
  pop: string
  from: number
  to: number
  strength: 'strong' | 'weak'
  story: string
}

export const COHORTS: Cohort[] = [
  { pop: 'cze-2023', from: 1974, to: 1978, strength: 'strong', story: 'silné ročníky 70. let (tzv. Husákovy děti)' },
  { pop: 'cze-2023', from: 1999, to: 2003, strength: 'weak', story: 'slabé ročníky kolem roku 2000, kdy se v Česku rodilo nejméně dětí' },
  { pop: 'cze-1990', from: 1971, to: 1975, strength: 'strong', story: 'silné ročníky 70. let' },
  { pop: 'cze-1950', from: 1916, to: 1920, strength: 'weak', story: 'slabé ročníky z doby 1. světové války' },
  { pop: 'deu-1950', from: 1916, to: 1920, strength: 'weak', story: 'slabé ročníky z doby 1. světové války' },
  { pop: 'rus-1970', from: 1941, to: 1945, strength: 'weak', story: 'slabé ročníky z doby 2. světové války' },
  { pop: 'usa-1970', from: 1956, to: 1960, strength: 'strong', story: 'vrchol poválečného baby boomu' },
  { pop: 'jpn-2023', from: 1969, to: 1973, strength: 'strong', story: 'druhý japonský baby boom (děti poválečné generace)' },
  { pop: 'chn-1990', from: 1966, to: 1970, strength: 'strong', story: 'silné ročníky konce 60. let, před politikou jednoho dítěte' },
]

/** Populations where men of fighting age are missing after a war (the group is computed). */
export const WARS: { pop: string; story: string }[] = [
  { pop: 'deu-1950', story: 'muži této generace padli ve 2. světové válce' },
  { pop: 'rus-1970', story: 'muži této generace padli ve 2. světové válce' },
]

/** Populations with many immigrant workers (the male surplus is computed). */
export const MIGRANTS = ['are-2023', 'qat-2023']

/** Populations with a projection 20 years ahead (2023 → 2043). */
export const FUTURE = ['cze-2023', 'jpn-2023', 'ner-2023', 'ind-2023']
