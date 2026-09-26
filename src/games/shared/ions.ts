/**
 * Common ions for the nomenclature games.
 *
 * `formula` is written without the charge (e.g. 'SO4', 'NH4'); `charge` is signed.
 * Cations carry the adjective used in compound names (`adj`: 'železitý' → „síran železitý“),
 * anions the noun (`stem`: 'síran'). `ion` is the full Czech name of the ion itself.
 */

export interface Cation {
  formula: string
  charge: number
  /** Adjective used in compound names: „chlorid **železitý**“. */
  adj: string
  /** Name of the ion: „železitý kation“. */
  ion: string
  /** Main element (for the sticker album and ElementTile). */
  element: string
  /** H+ and H3O+ do not form salts; acids are named separately. */
  noSalt?: boolean
}

export interface Anion {
  formula: string
  charge: number
  /** Noun used in compound names: „**síran** měďnatý“. */
  stem: string
  /** Name of the ion: „síranový anion“. */
  ion: string
  /** Name of the corresponding acid (H+ + this anion), if it is a common one. */
  acid?: string
  /** Central (characteristic) element. */
  element: string
}

const cat = (formula: string, charge: number, adj: string, element = formula, noSalt = false): Cation => ({
  formula,
  charge,
  adj,
  ion: `${adj} kation`,
  element,
  ...(noSalt ? { noSalt } : {}),
})

const an = (formula: string, charge: number, stem: string, element: string, acid?: string): Anion => ({
  formula,
  charge,
  stem,
  ion: `${stem}ový anion`,
  element,
  ...(acid ? { acid } : {}),
})

export const CATIONS: Cation[] = [
  cat('H', 1, 'vodíkový', 'H', true),
  cat('H3O', 1, 'oxoniový', 'O', true),
  cat('Li', 1, 'lithný'),
  cat('Na', 1, 'sodný'),
  cat('K', 1, 'draselný'),
  cat('Ag', 1, 'stříbrný'),
  cat('Cu', 1, 'měďný'),
  cat('NH4', 1, 'amonný', 'N'),
  cat('Mg', 2, 'hořečnatý'),
  cat('Ca', 2, 'vápenatý'),
  cat('Sr', 2, 'strontnatý'),
  cat('Ba', 2, 'barnatý'),
  cat('Zn', 2, 'zinečnatý'),
  cat('Cu', 2, 'měďnatý'),
  cat('Fe', 2, 'železnatý'),
  cat('Mn', 2, 'manganatý'),
  cat('Co', 2, 'kobaltnatý'),
  cat('Ni', 2, 'nikelnatý'),
  cat('Pb', 2, 'olovnatý'),
  cat('Sn', 2, 'cínatý'),
  cat('Hg', 2, 'rtuťnatý'),
  cat('Fe', 3, 'železitý'),
  cat('Al', 3, 'hlinitý'),
  cat('Cr', 3, 'chromitý'),
]

export const ANIONS: Anion[] = [
  an('F', -1, 'fluorid', 'F', 'kyselina fluorovodíková'),
  an('Cl', -1, 'chlorid', 'Cl', 'kyselina chlorovodíková'),
  an('Br', -1, 'bromid', 'Br', 'kyselina bromovodíková'),
  an('I', -1, 'jodid', 'I', 'kyselina jodovodíková'),
  an('O', -2, 'oxid', 'O'),
  an('S', -2, 'sulfid', 'S', 'kyselina sulfanová'),
  an('N', -3, 'nitrid', 'N'),
  an('H', -1, 'hydrid', 'H'),
  an('OH', -1, 'hydroxid', 'O'),
  an('CN', -1, 'kyanid', 'C', 'kyselina kyanovodíková'),
  an('NO3', -1, 'dusičnan', 'N', 'kyselina dusičná'),
  an('NO2', -1, 'dusitan', 'N', 'kyselina dusitá'),
  an('SO4', -2, 'síran', 'S', 'kyselina sírová'),
  an('HSO4', -1, 'hydrogensíran', 'S'),
  an('SO3', -2, 'siřičitan', 'S', 'kyselina siřičitá'),
  an('HSO3', -1, 'hydrogensiřičitan', 'S'),
  an('CO3', -2, 'uhličitan', 'C', 'kyselina uhličitá'),
  an('HCO3', -1, 'hydrogenuhličitan', 'C'),
  an('PO4', -3, 'fosforečnan', 'P', 'kyselina fosforečná'),
  an('HPO4', -2, 'hydrogenfosforečnan', 'P'),
  an('H2PO4', -1, 'dihydrogenfosforečnan', 'P'),
  an('SiO3', -2, 'křemičitan', 'Si', 'kyselina křemičitá'),
  an('ClO', -1, 'chlornan', 'Cl', 'kyselina chlorná'),
  an('ClO2', -1, 'chloritan', 'Cl', 'kyselina chloritá'),
  an('ClO3', -1, 'chlorečnan', 'Cl', 'kyselina chlorečná'),
  an('ClO4', -1, 'chloristan', 'Cl', 'kyselina chloristá'),
  an('MnO4', -1, 'manganistan', 'Mn', 'kyselina manganistá'),
  an('CrO4', -2, 'chroman', 'Cr', 'kyselina chromová'),
  an('Cr2O7', -2, 'dichroman', 'Cr', 'kyselina dichromová'),
]

/** Look up an ion by formula and charge: cation('Fe', 3), anion('SO4'). */
export function cation(formula: string, charge?: number): Cation {
  const c = CATIONS.find((x) => x.formula === formula && (charge === undefined || x.charge === charge))
  if (!c) throw new Error(`Neznámý kation ${formula}${charge ?? ''}`)
  return c
}

export function anion(formula: string): Anion {
  const a = ANIONS.find((x) => x.formula === formula)
  if (!a) throw new Error(`Neznámý anion ${formula}`)
  return a
}

/** Markup for <Md>: '$SO4^2-$', '$Fe^3+$', '$NH4^+$'. */
export function ionMarkup(ion: { formula: string; charge: number }): string {
  const n = Math.abs(ion.charge)
  const sign = ion.charge > 0 ? '+' : '-'
  return `$${ion.formula}^${n > 1 ? n : ''}${sign}$`
}

/** Plain text with Unicode superscripts (for aria-labels): 'SO₄²⁻'. */
export function ionPlain(ion: { formula: string; charge: number }): string {
  const sub = '₀₁₂₃₄₅₆₇₈₉'
  const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹'
  const n = Math.abs(ion.charge)
  const f = ion.formula.replace(/\d/g, (d) => sub[Number(d)])
  return f + (n > 1 ? sup[n] : '') + (ion.charge > 0 ? '⁺' : '⁻')
}
