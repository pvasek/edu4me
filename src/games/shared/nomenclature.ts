/**
 * Czech inorganic nomenclature (current school rules) as pure functions.
 *
 *   binary('Fe', 3, 'O')        -> { formula: 'Fe2O3', name: 'oxid železitý' }
 *   hydroxide(cation('Ca', 2))  -> { formula: 'Ca(OH)2', name: 'hydroxid vápenatý' }
 *   salt(cation('Al', 3), anion('SO4')) -> { formula: 'Al2(SO4)3', name: 'síran hlinitý' }
 *   oxoacid('S', 6)             -> { formula: 'H2SO4', name: 'kyselina sírová' }
 *   hydrate(salt(...), 5)       -> { formula: 'CuSO4·5H2O', name: 'pentahydrát síranu měďnatého' }
 */
import { anion as anionOf, type Anion, type Cation } from './ions'

export interface Compound {
  formula: string
  name: string
}

/** Endings for oxidation numbers I–VIII (index = oxidation number). V may be -ičný or -ečný. */
export const ENDINGS = ['', 'ný', 'natý', 'itý', 'ičitý', 'ičný', 'ový', 'istý', 'ičelý'] as const

export const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] as const

interface ElNom {
  /** Stem to which the ending is attached. */
  stem: string
  /** Ending for oxidation number V ('ičný' by default). */
  v?: 'ečný'
  /** Irregular adjectives. */
  over?: Partial<Record<number, string>>
  /** Oxidation numbers that really occur in school chemistry (first = most common). */
  ox: number[]
}

/**
 * Adjective stems. The generated adjectives are checked in nomenclature.test.ts.
 * Stems ending in -n take -atý for II (mangan -> manganatý, cín -> cínatý, vápen -> vápenatý).
 */
export const ELEMENT_NOM: Record<string, ElNom> = {
  Li: { stem: 'lith', ox: [1] },
  Na: { stem: 'sod', ox: [1] },
  K: { stem: 'drasel', ox: [1] },
  Rb: { stem: 'rubid', ox: [1] },
  Cs: { stem: 'ces', ox: [1] },
  Ag: { stem: 'stříbr', ox: [1] },
  Cu: { stem: 'měď', ox: [2, 1] },
  Au: { stem: 'zlat', ox: [3, 1] },
  Hg: { stem: 'rtuť', ox: [2, 1] },
  Mg: { stem: 'hořeč', ox: [2] },
  Ca: { stem: 'vápen', ox: [2] },
  Sr: { stem: 'stront', ox: [2] },
  Ba: { stem: 'bar', ox: [2] },
  Zn: { stem: 'zineč', ox: [2] },
  Fe: { stem: 'želez', ox: [3, 2] },
  Co: { stem: 'kobalt', ox: [2, 3] },
  Ni: { stem: 'nikel', ox: [2] },
  Mn: { stem: 'mangan', ox: [2, 4, 7, 6, 3] },
  Cr: { stem: 'chrom', ox: [3, 6, 2] },
  Pb: { stem: 'olov', ox: [2, 4] },
  Sn: { stem: 'cín', ox: [2, 4] },
  Al: { stem: 'hlin', ox: [3] },
  B: { stem: 'bor', ox: [3] },
  Ti: { stem: 'titan', ox: [4, 3] },
  V: { stem: 'vanad', ox: [5, 4, 3] },
  Os: { stem: 'osm', ox: [8, 4] },
  Xe: { stem: 'xenon', ox: [2, 4, 6] },
  C: { stem: 'uhl', ox: [4, 2], over: { 2: 'uhelnatý' } },
  Si: { stem: 'křem', ox: [4] },
  N: { stem: 'dus', ox: [5, 3, 1, 2, 4] },
  P: { stem: 'fosfor', v: 'ečný', ox: [5, 3] },
  As: { stem: 'arsen', ox: [3, 5] },
  S: { stem: 'siř', ox: [6, 4, 2], over: { 2: 'sirnatý', 6: 'sírový' } },
  Se: { stem: 'selen', ox: [4, 6] },
  Cl: { stem: 'chlor', v: 'ečný', ox: [1, 3, 5, 7, 4] },
  Br: { stem: 'brom', ox: [1, 5, 3, 7] },
  I: { stem: 'jod', ox: [1, 5, 7] },
}

/**
 * Masculine adjective for an element in a given oxidation number:
 * adjective('Fe', 3) -> 'železitý', adjective('S', 6) -> 'sírový', adjective('P', 5) -> 'fosforečný'.
 * Works for "wrong" oxidation numbers too (useful for distractors: adjective('Na', 2) -> 'sodnatý').
 */
export function adjective(el: string, ox: number): string {
  const e = ELEMENT_NOM[el]
  if (!e) throw new Error(`Chybí názvoslovný kmen pro ${el}`)
  if (ox < 1 || ox > 8) throw new Error(`Oxidační číslo ${ox} mimo rozsah I–VIII`)
  const over = e.over?.[ox]
  if (over) return over
  if (ox === 5) return e.stem + (e.v ?? 'ičný')
  if (ox === 2 && e.stem.endsWith('n')) return e.stem + 'atý'
  return e.stem + ENDINGS[ox]
}

/** Feminine form (kyselina …): 'sírový' -> 'sírová'. */
export const feminine = (adj: string) => adj.replace(/ý$/, 'á')

/** Genitive of a masculine name ("síran měďnatý" -> "síranu měďnatého"). */
export function genitive(name: string): string {
  return name
    .split(' ')
    .map((w) => (w.endsWith('ý') ? w.slice(0, -1) + 'ého' : w + 'u'))
    .join(' ')
}

/** Anion noun from the acid adjective: 'sírový' -> 'síran', 'dusičný' -> 'dusičnan', 'dusitý' -> 'dusitan'. */
export function anionStem(adj: string): string {
  return adj.endsWith('ový') ? adj.slice(0, -3) + 'an' : adj.slice(0, -1) + 'an'
}

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/** Formula fragment with a count: ('Cl', 2) -> 'Cl2', ('SO4', 3) -> '(SO4)3', ('OH', 1) -> 'OH'. */
export function group(formula: string, n: number): string {
  if (n === 1) return formula
  if (/^\[.*\]$/.test(formula)) return `${formula}${n}` // complex ion: [Ag(NH3)2]2SO4
  const poly = /[A-Z].*[A-Z]/.test(formula) || /\d/.test(formula)
  return poly ? `(${formula})${n}` : `${formula}${n}`
}

/**
 * Cross rule (křížové pravidlo): charges +a and -b -> counts b/g and a/g.
 * crossRule(3, 2) -> [2, 3]  (Al³⁺ + SO₄²⁻ -> Al₂(SO₄)₃)
 */
export function crossRule(cationCharge: number, anionCharge: number): [number, number] {
  const a = Math.abs(cationCharge)
  const b = Math.abs(anionCharge)
  const g = gcd(a, b)
  return [b / g, a / g]
}

export type BinaryPartner = 'O' | 'S' | 'F' | 'Cl' | 'Br' | 'I' | 'H' | 'N'

export const PARTNER: Record<BinaryPartner, { noun: string; ox: number }> = {
  O: { noun: 'oxid', ox: -2 },
  S: { noun: 'sulfid', ox: -2 },
  F: { noun: 'fluorid', ox: -1 },
  Cl: { noun: 'chlorid', ox: -1 },
  Br: { noun: 'bromid', ox: -1 },
  I: { noun: 'jodid', ox: -1 },
  H: { noun: 'hydrid', ox: -1 },
  N: { noun: 'nitrid', ox: -3 },
}

/**
 * Binary compound (oxide, sulfide, halide, hydride, nitride) of `el` in oxidation number `ox`.
 * binary('S', 4, 'O') -> SO2 oxid siřičitý; binary('Ca', 2, 'H') -> CaH2 hydrid vápenatý.
 */
export function binary(el: string, ox: number, partner: BinaryPartner): Compound {
  const p = PARTNER[partner]
  const [nEl, nP] = crossRule(ox, p.ox)
  return { formula: group(el, nEl) + group(partner, nP), name: `${p.noun} ${adjective(el, ox)}` }
}

export const oxide = (el: string, ox: number) => binary(el, ox, 'O')
export const sulfide = (el: string, ox: number) => binary(el, ox, 'S')
export const halide = (el: string, ox: number, halogen: 'F' | 'Cl' | 'Br' | 'I') => binary(el, ox, halogen)

/** Salt (or hydroxide, or binary ionic compound) from a cation and an anion. */
export function salt(c: Pick<Cation, 'formula' | 'charge' | 'adj'>, a: Pick<Anion, 'formula' | 'charge' | 'stem'>): Compound {
  const [nC, nA] = crossRule(c.charge, a.charge)
  return { formula: group(c.formula, nC) + group(a.formula, nA), name: `${a.stem} ${c.adj}` }
}

/** Hydroxide of a cation, or of an element in a given oxidation number. */
export function hydroxide(c: Pick<Cation, 'formula' | 'charge' | 'adj'>): Compound
export function hydroxide(el: string, ox: number): Compound
export function hydroxide(c: Pick<Cation, 'formula' | 'charge' | 'adj'> | string, ox?: number): Compound {
  const cat = typeof c === 'string' ? { formula: c, charge: ox!, adj: adjective(c, ox!) } : c
  return salt(cat, anionOf('OH'))
}

/** Number of H in the usual oxoacid (H/X/O rule: 1 for odd, 2 for even oxidation numbers). */
export function acidHydrogens(el: string, ox: number): number {
  if (el === 'P' && ox === 5) return 3 // H3PO4
  if (el === 'B' && ox === 3) return 3 // H3BO3
  return ox % 2 ? 1 : 2
}

export interface Oxoacid extends Compound {
  h: number
  o: number
}

/**
 * Oxoacid from its central atom and oxidation number (H/X/O rule):
 * number of O = (number of H + oxidation number) / 2.
 * oxoacid('N', 5) -> HNO3 kyselina dusičná; oxoacid('P', 5) -> H3PO4 kyselina fosforečná.
 */
export function oxoacid(el: string, ox: number, h = acidHydrogens(el, ox)): Oxoacid {
  const o = (h + ox) / 2
  if (!Number.isInteger(o)) throw new Error(`Nelze sestavit kyselinu ${el}(${ox}) s ${h} H`)
  return {
    formula: group('H', h) + el + group('O', o),
    name: `kyselina ${feminine(adjective(el, ox))}`,
    h,
    o,
  }
}

/**
 * Anion of an oxoacid, optionally keeping some hydrogens:
 * oxoanion('S', 6) -> SO4 2- síran; oxoanion('P', 5, 2) -> H2PO4- dihydrogenfosforečnan.
 */
export function oxoanion(el: string, ox: number, keepH = 0): Pick<Anion, 'formula' | 'charge' | 'stem'> {
  const acid = oxoacid(el, ox)
  if (keepH >= acid.h) throw new Error('Anion musí mít záporný náboj')
  const prefix = ['', 'hydrogen', 'dihydrogen'][keepH]
  return {
    formula: (keepH ? group('H', keepH) : '') + el + group('O', acid.o),
    charge: -(acid.h - keepH),
    stem: prefix + anionStem(adjective(el, ox)),
  }
}

export const MULT = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'okta', 'nona', 'deka', 'undeka', 'dodeka']

/** Hydrate: hydrate(CuSO4, 5) -> CuSO4·5H2O pentahydrát síranu měďnatého. */
export function hydrate(c: Compound, n: number): Compound {
  return { formula: `${c.formula}·${n > 1 ? n : ''}H2O`, name: `${MULT[n]}hydrát ${genitive(c.name)}` }
}

/** Ligands of simple coordination compounds (level 7). */
export const LIGANDS = {
  H2O: { name: 'aqua', charge: 0 },
  NH3: { name: 'ammin', charge: 0 },
  OH: { name: 'hydroxido', charge: -1 },
  F: { name: 'fluorido', charge: -1 },
  Cl: { name: 'chlorido', charge: -1 },
  CN: { name: 'kyanido', charge: -1 },
} as const

export type Ligand = keyof typeof LIGANDS

export interface ComplexIon {
  /** '[Cu(NH3)4]' (without the charge). */
  formula: string
  charge: number
  /** Adjective of a complex cation: 'tetraamminměďnatý' (síran tetraamminměďnatý). */
  adj: string
  /** Noun of a complex anion: 'hexakyanidoželeznatan' (hexakyanidoželeznatan draselný). */
  stem: string
  /** Name of the ion: 'tetraamminměďnatý kation', 'hexakyanidoželeznatanový anion'. */
  ion: string
}

/**
 * Complex ion with one kind of ligand:
 * complexIon('Cu', 2, 'NH3', 4) -> [Cu(NH3)4] 2+ tetraamminměďnatý kation;
 * complexIon('Fe', 2, 'CN', 6) -> [Fe(CN)6] 4− hexakyanidoželeznatanový anion.
 */
export function complexIon(metal: string, ox: number, ligand: Ligand, n: number): ComplexIon {
  const L = LIGANDS[ligand]
  const charge = ox + n * L.charge
  if (charge === 0) throw new Error('Neutrální komplex nemá kation ani anion')
  const prefix = MULT[n] + L.name
  const adj = prefix + adjective(metal, ox)
  const stem = prefix + anionStem(adjective(metal, ox))
  return {
    formula: `[${metal}${group(ligand, n)}]`,
    charge,
    adj,
    stem,
    ion: charge > 0 ? `${adj} kation` : `${stem}ový anion`,
  }
}

/** Formula as <Md> markup (subscripts come for free): 'Ca3(PO4)2' -> '$Ca3(PO4)2$'. */
export const chem = (formula: string) => `$${formula}$`

/**
 * Normalise a typed formula for comparison: no spaces, all dot variants -> '·',
 * Unicode subscripts -> digits. Case is kept (Co ≠ CO).
 */
export function normalizeFormula(s: string): string {
  const sub = '₀₁₂₃₄₅₆₇₈₉'
  return s
    .replace(/\s+/g, '')
    .replace(/[.*•⋅∙]/g, '·')
    .replace(/[₀-₉]/g, (d) => String(sub.indexOf(d)))
    .replace(/\$/g, '')
}
