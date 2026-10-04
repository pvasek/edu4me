/**
 * Klimatogram – content per level (spec/courses/zemepis/games.md):
 * 4 read a chart (warmest month, yearly range, dry months, total precipitation), match it
 * to its place or biome · 7 which region of the world · 10 climate types (simplified
 * Köppen), when it rains, oceanic vs continental · 12 water balance: where and when
 * farming needs irrigation.
 *
 * A level is a plan of task kinds (played in turn) and a pool of stations. Free play
 * mixes the levels. Answers are computed in logic.ts from the station data.
 */

export type TaskKind =
  | 'warmest'
  | 'coldest'
  | 'wettest'
  | 'range'
  | 'dry'
  | 'total'
  | 'place'
  | 'biome'
  | 'region'
  | 'hemisphere'
  | 'koppen'
  | 'season'
  | 'ocean'
  | 'irrigation'
  | 'irrig-pair'

export interface LevelSet {
  plan: TaskKind[]
  /** station ids played at this level; undefined = all */
  pool?: string[]
}

/** Places a 7th-grader meets first (z4-4 worked examples and the classic climate types). */
const FIRST = [
  'praha',
  'manaus',
  'kahira',
  'jakutsk',
  'singapur',
  'londyn',
  'rim',
  'moskva',
  'utqiagvik',
  'bombaj',
  'sydney',
  'alice-springs',
  'lima',
  'niamey',
  'darwin',
  'ulanbatar',
  'irkutsk',
  'verchojansk',
  'kapske-mesto',
  'los-angeles',
]

export const LEVELS: Record<number, LevelSet> = {
  4: {
    plan: ['warmest', 'range', 'place', 'dry', 'biome', 'total', 'coldest', 'place', 'wettest', 'biome'],
    pool: FIRST,
  },
  7: {
    plan: ['region', 'hemisphere', 'place', 'region', 'range', 'region', 'hemisphere', 'place', 'wettest', 'region'],
  },
  10: {
    plan: ['koppen', 'season', 'ocean', 'koppen', 'range', 'koppen', 'season', 'ocean', 'koppen', 'season'],
  },
  12: {
    plan: ['irrigation', 'irrig-pair', 'dry', 'irrigation', 'total', 'irrig-pair', 'dry', 'irrigation', 'wettest', 'irrig-pair'],
  },
}
