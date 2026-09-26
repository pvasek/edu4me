/**
 * Molární hmotnost – formulas per level (spec/courses/chemie/games.md).
 * Every formula must parse with parseFormula and appears in one level only (levels.test.ts).
 */

export interface MassItem {
  formula: string
  /** Czech name shown next to the formula. */
  name: string
}

const items = (rows: [string, string][]): MassItem[] => rows.map(([formula, name]) => ({ formula, name }))

/** L4 (l4-4): simple compounds and gases. */
const L4 = items([
  ['H2O', 'voda'],
  ['H2', 'vodík'],
  ['O2', 'kyslík'],
  ['N2', 'dusík'],
  ['Cl2', 'chlor'],
  ['CO2', 'oxid uhličitý'],
  ['CO', 'oxid uhelnatý'],
  ['SO2', 'oxid siřičitý'],
  ['NO2', 'oxid dusičitý'],
  ['NH3', 'amoniak'],
  ['CH4', 'methan'],
  ['HCl', 'chlorovodík'],
  ['H2S', 'sulfan'],
  ['H2O2', 'peroxid vodíku'],
  ['NaCl', 'chlorid sodný'],
  ['KCl', 'chlorid draselný'],
  ['MgO', 'oxid hořečnatý'],
  ['CaO', 'oxid vápenatý'],
  ['CuO', 'oxid měďnatý'],
  ['Fe2O3', 'oxid železitý'],
  ['CaCO3', 'vápenec (uhličitan vápenatý)'],
])

/** L5 (l5-1, l5-2, l5-5): acids, hydroxides, salts, hydrogen salts and hydrates. */
const L5 = items([
  ['H2SO4', 'kyselina sírová'],
  ['H2SO3', 'kyselina siřičitá'],
  ['HNO3', 'kyselina dusičná'],
  ['HNO2', 'kyselina dusitá'],
  ['H2CO3', 'kyselina uhličitá'],
  ['H3PO4', 'kyselina fosforečná'],
  ['HClO4', 'kyselina chloristá'],
  ['NaOH', 'hydroxid sodný'],
  ['KOH', 'hydroxid draselný'],
  ['Ca(OH)2', 'hydroxid vápenatý'],
  ['Al(OH)3', 'hydroxid hlinitý'],
  ['Na2CO3', 'uhličitan sodný'],
  ['NaHCO3', 'hydrogenuhličitan sodný'],
  ['Na2SO4', 'síran sodný'],
  ['BaSO4', 'síran barnatý'],
  ['AgNO3', 'dusičnan stříbrný'],
  ['Mg(NO3)2', 'dusičnan hořečnatý'],
  ['Al2(SO4)3', 'síran hlinitý'],
  ['Ca3(PO4)2', 'fosforečnan vápenatý'],
  ['(NH4)2SO4', 'síran amonný'],
  ['NaClO', 'chlornan sodný'],
  ['CuSO4·5H2O', 'pentahydrát síranu měďnatého'],
  ['Na2CO3·10H2O', 'dekahydrát uhličitanu sodného'],
])

/** L7: minerals, ores and industrial compounds (l7-1 to l7-6), incl. coordination compounds. */
const L7 = items([
  ['Fe3O4', 'magnetit'],
  ['FeS2', 'pyrit'],
  ['Al2O3', 'oxid hlinitý'],
  ['SiO2', 'oxid křemičitý (křemen)'],
  ['PbS', 'sulfid olovnatý (galenit)'],
  ['ZnS', 'sulfid zinečnatý (sfalerit)'],
  ['CaSO4·2H2O', 'sádrovec'],
  ['MgSO4·7H2O', 'hořká sůl'],
  ['KNO3', 'draselný ledek'],
  ['NH4NO3', 'ledek amonný'],
  ['Na2SiO3', 'křemičitan sodný (vodní sklo)'],
  ['KMnO4', 'manganistan draselný'],
  ['K2Cr2O7', 'dichroman draselný'],
  ['V2O5', 'oxid vanadičný (katalyzátor)'],
  ['TiO2', 'oxid titaničitý (bílý pigment)'],
  ['MnO2', 'oxid manganičitý'],
  ['CuCO3·Cu(OH)2', 'měděnka'],
  ['[Cu(NH3)4]SO4', 'síran tetraamminměďnatý'],
  ['K4[Fe(CN)6]', 'hexakyanidoželeznatan draselný'],
])

/** L8: organic compounds (l8-2 to l8-6). */
const L8 = items([
  ['C2H6', 'ethan'],
  ['C3H8', 'propan'],
  ['C4H10', 'butan'],
  ['C8H18', 'oktan'],
  ['C6H12', 'cyklohexan'],
  ['C2H4', 'ethen'],
  ['C2H2', 'ethyn'],
  ['C6H6', 'benzen'],
  ['C7H8', 'toluen'],
  ['C10H8', 'naftalen'],
  ['CCl4', 'tetrachlormethan'],
  ['CH3OH', 'methanol'],
  ['C2H5OH', 'ethanol'],
  ['C3H8O3', 'glycerol'],
  ['C6H5OH', 'fenol'],
  ['C2H5OC2H5', 'diethylether'],
  ['HCHO', 'formaldehyd (methanal)'],
  ['CH3COCH3', 'aceton (propanon)'],
  ['HCOOH', 'kyselina mravenčí'],
  ['CH3COOH', 'kyselina octová'],
  ['CH3COOC2H5', 'ethyl-acetát (ethyl-ethanoát)'],
  ['CH3NH2', 'methylamin'],
  ['C6H5NO2', 'nitrobenzen'],
])

/** L9: biomolecules and substances from l9-1 to l9-6. */
const L9 = items([
  ['C6H12O6', 'glukóza'],
  ['C12H22O11', 'sacharóza'],
  ['C5H10O5', 'ribóza'],
  ['C5H10O4', 'deoxyribóza'],
  ['C3H6O3', 'kyselina mléčná'],
  ['C2H5NO2', 'glycin'],
  ['C3H7NO2', 'alanin'],
  ['C5H9NO4', 'kyselina glutamová'],
  ['CO(NH2)2', 'močovina'],
  ['C16H32O2', 'kyselina palmitová'],
  ['C18H36O2', 'kyselina stearová'],
  ['C18H34O2', 'kyselina olejová'],
  ['C57H110O6', 'tristearin (tuk)'],
  ['C27H46O', 'cholesterol'],
  ['C5H5N5', 'adenin'],
  ['C10H16N5O13P3', 'ATP'],
  ['C6H8O6', 'vitamin C'],
  ['C9H8O4', 'aspirin'],
  ['C8H10N4O2', 'kofein'],
])

/** Formula sets per level number (keys = levels in the registry). */
export const LEVELS: Record<number, MassItem[]> = { 4: L4, 5: L5, 7: L7, 8: L8, 9: L9 }
