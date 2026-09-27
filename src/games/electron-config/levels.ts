/**
 * Zaplň orbitaly – content set per level (see spec/courses/chemie/games.md).
 *   L2: atoms with Z ≤ 20.
 *   L3: ions of main-group elements (they reach a noble-gas configuration).
 *   L7: transition metals Z 21–30, their ions (4s empties first) and the Cr/Cu exceptions.
 */

export interface EcTarget {
  /** Proton number of the element. */
  z: number
  /** Charge of the ion; 0 or missing for a neutral atom. */
  charge?: number
  /** Worth ×1,5 (the Cr and Cu exceptions). */
  bonus: boolean
  /** Czech name of the ion ("kation železnatý"); atoms use the element name. */
  name?: string
  /** Kind of target, used to build a round. */
  tag?: 'light' | 'period3' | 'period4' | 'cation' | 'anion' | 'atom' | 'ion' | 'exception'
}

const atom = (z: number, tag: EcTarget['tag']): EcTarget => ({ z, charge: 0, bonus: false, tag })
const ion = (z: number, charge: number, name: string, tag: EcTarget['tag']): EcTarget => ({ z, charge, bonus: false, name, tag })

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)

const L2: EcTarget[] = [
  ...range(3, 10).map((z) => atom(z, 'light')),
  ...range(11, 18).map((z) => atom(z, 'period3')),
  ...range(19, 20).map((z) => atom(z, 'period4')),
]

const L3: EcTarget[] = [
  ion(3, 1, 'kation lithný', 'cation'),
  ion(11, 1, 'kation sodný', 'cation'),
  ion(19, 1, 'kation draselný', 'cation'),
  ion(12, 2, 'kation hořečnatý', 'cation'),
  ion(20, 2, 'kation vápenatý', 'cation'),
  ion(13, 3, 'kation hlinitý', 'cation'),
  ion(7, -3, 'nitridový anion', 'anion'),
  ion(8, -2, 'oxidový anion', 'anion'),
  ion(9, -1, 'fluoridový anion', 'anion'),
  ion(15, -3, 'fosfidový anion', 'anion'),
  ion(16, -2, 'sulfidový anion', 'anion'),
  ion(17, -1, 'chloridový anion', 'anion'),
]

const L7: EcTarget[] = [
  ...[21, 22, 23, 25, 26, 27, 28, 30].map((z) => atom(z, 'atom')),
  { z: 24, charge: 0, bonus: true, tag: 'exception' },
  { z: 29, charge: 0, bonus: true, tag: 'exception' },
  ion(21, 3, 'kation skanditý', 'ion'),
  ion(22, 4, 'kation titaničitý', 'ion'),
  ion(24, 3, 'kation chromitý', 'ion'),
  ion(25, 2, 'kation manganatý', 'ion'),
  ion(26, 2, 'kation železnatý', 'ion'),
  ion(26, 3, 'kation železitý', 'ion'),
  ion(27, 2, 'kation kobaltnatý', 'ion'),
  ion(28, 2, 'kation nikelnatý', 'ion'),
  ion(29, 1, 'kation měďný', 'ion'),
  ion(29, 2, 'kation měďnatý', 'ion'),
  ion(30, 2, 'kation zinečnatý', 'ion'),
]

export const LEVELS: Record<number, EcTarget[]> = { 2: L2, 3: L3, 7: L7 }

/** Four targets per round, easier first: [level, allowed tags]. */
export const PLANS: Record<number | 'mix', [number, EcTarget['tag'][]][]> = {
  2: [
    [2, ['light']],
    [2, ['period3']],
    [2, ['light', 'period3']],
    [2, ['period4']],
  ],
  3: [
    [3, ['cation']],
    [3, ['anion']],
    [3, ['cation']],
    [3, ['anion']],
  ],
  7: [
    [7, ['atom']],
    [7, ['ion']],
    [7, ['ion']],
    [7, ['exception']],
  ],
  mix: [
    [2, ['light', 'period3', 'period4']],
    [3, ['cation', 'anion']],
    [7, ['atom', 'ion']],
    [7, ['exception']],
  ],
}
