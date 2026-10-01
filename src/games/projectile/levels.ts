/**
 * Vrh – content per level (spec/courses/fyzika/games.md):
 *  8 vodorovný a šikmý vrh na Zemi: zasáhni cíl úhlem a rychlostí (f8-3),
 *  9 vrh na Měsíci a planetách, oběžná (1. kosmická) rychlost (f9-1, f9-2).
 *
 * Only measured constants live here (g at the surface, radius); every target,
 * every answer and every explanation is computed in logic.ts. Air resistance is ignored.
 */

export type BodyId = 'zeme' | 'mesic' | 'mars' | 'jupiter'

export interface Body {
  id: BodyId
  name: string
  /** "na Zemi", "na Měsíci"… */
  loc: string
  /** Genitive: "povrch Měsíce". */
  of: string
  /** Gravitational acceleration at the surface, m/s². */
  g: number
  /** Mean radius, m. */
  R: number
}

export const BODIES: Record<BodyId, Body> = {
  zeme: { id: 'zeme', name: 'Země', loc: 'na Zemi', of: 'Země', g: 9.81, R: 6.371e6 },
  mesic: { id: 'mesic', name: 'Měsíc', loc: 'na Měsíci', of: 'Měsíce', g: 1.62, R: 1.737e6 },
  mars: { id: 'mars', name: 'Mars', loc: 'na Marsu', of: 'Marsu', g: 3.71, R: 3.39e6 },
  jupiter: { id: 'jupiter', name: 'Jupiter', loc: 'na Jupiteru', of: 'Jupiteru', g: 24.79, R: 6.99e7 },
}

export type ThrowKind = 'horizontal' | 'ground' | 'platform'

export interface Plan {
  kind: ThrowKind | 'orbit'
  body: BodyId
}

const p = (kind: Plan['kind'], body: BodyId): Plan => ({ kind, body })

/** Task plan of a round per level (order is shuffled a little in logic.ts). */
export const LEVELS: Record<number, Plan[]> = {
  8: [
    p('horizontal', 'zeme'),
    p('ground', 'zeme'),
    p('horizontal', 'zeme'),
    p('ground', 'zeme'),
    p('platform', 'zeme'),
    p('horizontal', 'zeme'),
    p('ground', 'zeme'),
    p('platform', 'zeme'),
  ],
  9: [
    p('ground', 'mesic'),
    p('horizontal', 'mars'),
    p('orbit', 'mesic'),
    p('ground', 'jupiter'),
    p('platform', 'mars'),
    p('horizontal', 'mesic'),
    p('orbit', 'jupiter'),
    p('ground', 'mars'),
  ],
}

/** Free play: half of each level. */
export const MIX: Plan[] = [
  p('horizontal', 'zeme'),
  p('ground', 'mesic'),
  p('ground', 'zeme'),
  p('orbit', 'mars'),
  p('platform', 'zeme'),
  p('horizontal', 'jupiter'),
  p('ground', 'zeme'),
  p('platform', 'mars'),
]
