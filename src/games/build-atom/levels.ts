/**
 * Postav atom – content set per level (see spec/courses/chemie/games.md).
 *   L2: neutral atoms in nuclide notation (Z ≤ 20), isotopes, one simple ion per round.
 *   L3: ions with a noble-gas configuration, asked as "the ion X forms in a compound with Y".
 */
import { BY_SYMBOL } from '../../courses/chemie/data/elements'

export type TaskKind = 'atom' | 'ion' | 'isotope'

export interface AtomTask {
  kind: TaskKind
  symbol: string
  z: number
  /** neutrons */
  n: number
  /** electrons */
  e: number
  /** mass number */
  a: number
  charge: number
  /** isotope name, e.g. "deuterium" */
  label?: string
  /** Level-3 ions: the compound the ion comes from. */
  partner?: IonPartner
  /** Noble gas with the same electron configuration (ions of level 3). */
  noble?: string
}

export interface IonPartner {
  /** "ze sodíku" – where the ion comes from (genitive with the right preposition). */
  from: string
  /** "s chlorem" – the other element of the compound (instrumental). */
  with: string
  /** Formula of the compound, e.g. "Na2S". */
  formula: string
  /** The other element and its ion charge in that compound. */
  other: string
  otherCharge: number
}

const z = (symbol: string) => BY_SYMBOL[symbol].z

export function atom(symbol: string, a: number): AtomTask {
  return { kind: 'atom', symbol, z: z(symbol), n: a - z(symbol), e: z(symbol), a, charge: 0 }
}

export function isotope(symbol: string, a: number, label: string): AtomTask {
  return { ...atom(symbol, a), kind: 'isotope', label }
}

export function ion(symbol: string, a: number, charge: number, extra: Partial<AtomTask> = {}): AtomTask {
  return { ...atom(symbol, a), kind: 'ion', e: z(symbol) - charge, charge, ...extra }
}

/** Most common isotope of the first 20 elements (mass number). */
export const MAIN_A: Record<string, number> = {
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20,
  Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35, Ar: 40, K: 39, Ca: 40,
}

const L2: AtomTask[] = [
  ...Object.entries(MAIN_A)
    .filter(([s]) => s !== 'H')
    .map(([s, a]) => atom(s, a)),
  isotope('H', 1, 'protium'),
  isotope('H', 2, 'deuterium'),
  isotope('H', 3, 'tritium'),
  isotope('C', 12, 'uhlík-12'),
  isotope('C', 13, 'uhlík-13'),
  isotope('C', 14, 'uhlík-14'),
  isotope('Cl', 35, 'chlor-35'),
  isotope('Cl', 37, 'chlor-37'),
  isotope('O', 18, 'kyslík-18'),
  isotope('N', 15, 'dusík-15'),
  isotope('Li', 6, 'lithium-6'),
  isotope('B', 10, 'bor-10'),
  isotope('K', 40, 'draslík-40'),
  // simple ions from lesson l2-3 and l2-4
  ion('Na', 23, 1),
  ion('K', 39, 1),
  ion('Mg', 24, 2),
  ion('Al', 27, 3),
  ion('Cl', 35, -1),
  ion('O', 16, -2),
  ion('S', 32, -2),
]

/** Level-3 ion "X from a compound with Y", reaching the configuration of `noble`. */
function inCompound(symbol: string, charge: number, noble: string, partner: IonPartner): AtomTask {
  return ion(symbol, MAIN_A[symbol], charge, { partner, noble })
}
const p = (from: string, withWhat: string, formula: string, other: string, otherCharge: number): IonPartner => ({
  from,
  with: withWhat,
  formula,
  other,
  otherCharge,
})

const L3: AtomTask[] = [
  inCompound('Li', 1, 'He', p('z lithia', 's fluorem', 'LiF', 'F', -1)),
  inCompound('Na', 1, 'Ne', p('ze sodíku', 's chlorem', 'NaCl', 'Cl', -1)),
  inCompound('Na', 1, 'Ne', p('ze sodíku', 's kyslíkem', 'Na2O', 'O', -2)),
  inCompound('K', 1, 'Ar', p('z draslíku', 's bromem', 'KBr', 'Br', -1)),
  inCompound('K', 1, 'Ar', p('z draslíku', 'se sírou', 'K2S', 'S', -2)),
  inCompound('Mg', 2, 'Ne', p('z hořčíku', 's kyslíkem', 'MgO', 'O', -2)),
  inCompound('Mg', 2, 'Ne', p('z hořčíku', 's chlorem', 'MgCl2', 'Cl', -1)),
  inCompound('Ca', 2, 'Ar', p('z vápníku', 's chlorem', 'CaCl2', 'Cl', -1)),
  inCompound('Ca', 2, 'Ar', p('z vápníku', 's kyslíkem', 'CaO', 'O', -2)),
  inCompound('Al', 3, 'Ne', p('z hliníku', 's kyslíkem', 'Al2O3', 'O', -2)),
  inCompound('Al', 3, 'Ne', p('z hliníku', 's fluorem', 'AlF3', 'F', -1)),
  inCompound('F', -1, 'Ne', p('z fluoru', 's vápníkem', 'CaF2', 'Ca', 2)),
  inCompound('F', -1, 'Ne', p('z fluoru', 'se sodíkem', 'NaF', 'Na', 1)),
  inCompound('Cl', -1, 'Ar', p('z chloru', 'se sodíkem', 'NaCl', 'Na', 1)),
  inCompound('Cl', -1, 'Ar', p('z chloru', 's hořčíkem', 'MgCl2', 'Mg', 2)),
  inCompound('O', -2, 'Ne', p('z kyslíku', 's hořčíkem', 'MgO', 'Mg', 2)),
  inCompound('O', -2, 'Ne', p('z kyslíku', 's hliníkem', 'Al2O3', 'Al', 3)),
  inCompound('S', -2, 'Ar', p('ze síry', 'se sodíkem', 'Na2S', 'Na', 1)),
  inCompound('S', -2, 'Ar', p('ze síry', 's vápníkem', 'CaS', 'Ca', 2)),
  inCompound('N', -3, 'Ne', p('z dusíku', 's hořčíkem', 'Mg3N2', 'Mg', 2)),
  inCompound('N', -3, 'Ne', p('z dusíku', 's lithiem', 'Li3N', 'Li', 1)),
  inCompound('P', -3, 'Ar', p('z fosforu', 's vápníkem', 'Ca3P2', 'Ca', 2)),
  inCompound('H', -1, 'He', p('z vodíku', 'se sodíkem', 'NaH', 'Na', 1)),
]

export const LEVELS: Record<number, AtomTask[]> = { 2: L2, 3: L3 }

/** One slot of a round: which kind of task it takes (and an optional extra filter). */
export interface Slot {
  level: number
  kind: TaskKind
  where?: (t: AtomTask) => boolean
}

const light = (t: AtomTask) => t.z <= 10
const heavier = (t: AtomTask) => t.z > 10
const hydrogen = (t: AtomTask) => t.symbol === 'H'
const notHydrogen = (t: AtomTask) => t.symbol !== 'H'
const cation = (t: AtomTask) => t.charge > 0
const anion = (t: AtomTask) => t.charge < 0

/** Six tasks per round, easier first. */
export const PLANS: Record<number | 'mix', Slot[]> = {
  2: [
    { level: 2, kind: 'atom', where: light },
    { level: 2, kind: 'atom', where: heavier },
    { level: 2, kind: 'isotope', where: hydrogen },
    { level: 2, kind: 'isotope', where: notHydrogen },
    { level: 2, kind: 'atom' },
    { level: 2, kind: 'ion' },
  ],
  3: [
    { level: 3, kind: 'ion', where: cation },
    { level: 3, kind: 'ion', where: anion },
    { level: 3, kind: 'ion', where: cation },
    { level: 3, kind: 'ion', where: anion },
    { level: 3, kind: 'ion' },
    { level: 3, kind: 'ion' },
  ],
  mix: [
    { level: 2, kind: 'atom' },
    { level: 2, kind: 'isotope' },
    { level: 3, kind: 'ion', where: cation },
    { level: 3, kind: 'ion', where: anion },
    { level: 2, kind: 'isotope' },
    { level: 3, kind: 'ion' },
  ],
}
