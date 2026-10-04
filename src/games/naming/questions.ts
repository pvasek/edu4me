import { anion, cation, ionMarkup, type Anion, type Cation } from '../shared/ions'
import {
  ELEMENT_NOM,
  ENDINGS,
  MULT,
  PARTNER,
  ROMAN,
  adjective,
  anionStem,
  binary,
  complexIon,
  crossRule,
  LIGANDS,
  feminine,
  hydrate,
  hydroxide,
  oxoacid,
  salt,
  type BinaryPartner,
  type Compound,
  type Ligand,
} from '../shared/nomenclature'
import { shuffle } from '../shared/util'
import { ORGANIC, ORG_CAT_LABEL, type OrgCat, type OrganicItem } from './organic'

export type InorgCat =
  | 'oxide'
  | 'halide'
  | 'sulfide'
  | 'hydride'
  | 'peroxide'
  | 'nitride'
  | 'hydroxide'
  | 'acid'
  | 'binaryAcid'
  | 'salt'
  | 'hydrogenSalt'
  | 'hydrate'
  | 'ion'
  | 'complex'

export type Cat = InorgCat | OrgCat

export const CAT_LABEL: Record<Cat, string> = {
  oxide: 'oxid',
  halide: 'halogenid',
  sulfide: 'sulfid',
  hydride: 'sloučenina s vodíkem',
  peroxide: 'peroxid',
  nitride: 'nitrid',
  hydroxide: 'hydroxid',
  acid: 'kyslíkatá kyselina',
  binaryAcid: 'bezkyslíkatá kyselina',
  salt: 'sůl',
  hydrogenSalt: 'hydrogensůl',
  hydrate: 'hydrát',
  ion: 'ion',
  complex: 'komplexní sloučenina',
  ...ORG_CAT_LABEL,
}

export interface NItem {
  cat: Cat
  /** Formula as stored (plain, e.g. 'Ca(OH)2', or condensed 'CH3-CH2-OH'); for ions the markup is in `display`. */
  formula: string
  name: string
  /** Wrong names built from typical mistakes, most typical first. */
  wrong: string[]
  /** Markup explanation shown after answering. */
  explain: string
  /** Markup shown as the formula (defaults to $formula$). */
  display?: string
  only?: 'toName' | 'toFormula'
  /** Markup of wrong formulas: name → formula is then multiple choice instead of typing. */
  wrongFormulas?: string[]
  /** Needs level-7 knowledge (less common anions and acids): not used at level 5. */
  adv?: boolean
}

export interface Question {
  dir: 'toName' | 'toFormula'
  item: NItem
  /** 4 shuffled options (names for 'toName', formula markup for a choice 'toFormula'); empty when the formula is typed. */
  options: string[]
  /** The right option (name or formula markup). */
  answer: string
}

/** Formula markup of an item. */
export const markupOf = (it: NItem) => it.display ?? `$${it.formula}$`

const endingOf = (el: string, ox: number) => (ox === 5 ? (ELEMENT_NOM[el]?.v ?? 'ičný') : ENDINGS[ox])
const signed = (n: number) => (n > 0 ? `+${n}` : `−${-n}`)
const uniq = (xs: string[], not: string) => [...new Set(xs)].filter((x) => x !== not)

/** Plausible wrong oxidation numbers: other real ones first, then the neighbours. */
export function wrongOx(el: string, ox: number): number[] {
  const real = ELEMENT_NOM[el]?.ox ?? []
  const near = [ox + 1, ox - 1, ox + 2, ox - 2, ox + 3]
  const out: number[] = []
  for (const o of [...real, ...near]) {
    if (o < 1 || o > 8 || o === ox || out.includes(o)) continue
    if (adjective(el, o) === adjective(el, ox)) continue
    out.push(o)
  }
  return out
}

/** Anion nouns that are easy to confuse. */
const ANION_SIB: Record<string, string[]> = {
  F: ['chlorid'],
  Cl: ['chlornan', 'chlorečnan'],
  Br: ['bromnan', 'bromičnan'],
  I: ['jodnan', 'jodičnan'],
  O: ['peroxid', 'hydroxid'],
  S: ['síran', 'siřičitan'],
  N: ['dusitan', 'dusičnan'],
  H: ['hydroxid'],
  OH: ['oxid', 'peroxid'],
  NO3: ['dusitan', 'nitrid'],
  NO2: ['dusičnan', 'nitrid'],
  SO4: ['siřičitan', 'sulfid'],
  SO3: ['síran', 'sulfid'],
  HSO4: ['síran', 'hydrogensiřičitan'],
  HSO3: ['siřičitan', 'hydrogensíran'],
  CO3: ['hydrogenuhličitan', 'karbid'],
  HCO3: ['uhličitan', 'dihydrogenuhličitan'],
  PO4: ['hydrogenfosforečnan', 'fosforitan'],
  HPO4: ['dihydrogenfosforečnan', 'fosforečnan'],
  H2PO4: ['hydrogenfosforečnan', 'fosforečnan'],
  SiO3: ['uhličitan', 'křemičnan'],
  ClO: ['chlorečnan', 'chlorid'],
  ClO2: ['chlornan', 'chlorečnan'],
  ClO3: ['chloristan', 'chloritan'],
  ClO4: ['chlorečnan', 'chlornan'],
  MnO4: ['manganan', 'manganičitan'],
  CrO4: ['dichroman', 'chromitan'],
  Cr2O7: ['chroman', 'dichromitan'],
  CN: ['kyanatan', 'karbid'],
  S2O3: ['síran', 'siřičitan'],
}

const PARTNER_DESC: Record<BinaryPartner, string> = {
  O: 'Kyslík má v oxidech −II',
  S: 'Síra má v sulfidech −II',
  F: 'Fluor má ve fluoridech −I',
  Cl: 'Chlor má v chloridech −I',
  Br: 'Brom má v bromidech −I',
  I: 'Jod má v jodidech −I',
  H: 'Vodík má v hydridech kovů −I',
  N: 'Dusík má v nitridech −III',
}

const S_BLOCK = new Set(['Li', 'Na', 'K', 'Mg', 'Ca', 'Sr', 'Ba'])

const PARTNER_SWAP: Partial<Record<BinaryPartner, string>> = {
  O: 'peroxid',
  S: 'síran',
  Cl: 'chlornan',
  Br: 'bromnan',
  I: 'jodnan',
  H: 'hydroxid',
  N: 'dusitan',
}

function binaryItem(cat: Cat, el: string, ox: number, partner: BinaryPartner): NItem {
  const c = binary(el, ox, partner)
  const p = PARTNER[partner]
  const [nEl, nP] = crossRule(ox, p.ox)
  const ws = wrongOx(el, ox).map((o) => `${p.noun} ${adjective(el, o)}`)
  const swap = partner === 'O' && !S_BLOCK.has(el) ? undefined : PARTNER_SWAP[partner]
  const wrong = uniq([ws[0], ...(swap ? [`${swap} ${adjective(el, ox)}`] : []), ...ws.slice(1)].filter(Boolean), c.name)
  const tot = nP * p.ox
  const arithmetic =
    nP === 1 && nEl === 1
      ? `V $${c.formula}$ připadá na jeden atom ${el} jeden atom ${partner}`
      : `V $${c.formula}$: ${nP} × (${signed(p.ox)}) = ${signed(tot)}${nEl > 1 ? `, rozděleno na ${nEl} atomy ${el}` : ''}`
  return {
    cat,
    formula: c.formula,
    name: c.name,
    wrong,
    explain: `${PARTNER_DESC[partner]}. ${arithmetic} → ${el} má ${ROMAN[ox]} → koncovka **‑${endingOf(el, ox)}**.`,
  }
}

const OXIDES: [string, number][] = [
  ['Na', 1], ['K', 1], ['Li', 1], ['Cu', 1], ['Cu', 2], ['Ag', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Zn', 2],
  ['Fe', 2], ['Fe', 3], ['Al', 3], ['Pb', 2], ['Pb', 4], ['Mn', 2], ['Mn', 4], ['Mn', 7], ['Cr', 3], ['Cr', 6],
  ['C', 2], ['C', 4], ['Si', 4], ['N', 1], ['N', 2], ['N', 3], ['N', 4], ['N', 5], ['P', 3], ['P', 5], ['S', 4],
  ['S', 6], ['Cl', 1], ['Cl', 7], ['Os', 8], ['Sn', 2], ['Sn', 4], ['Ti', 4], ['Hg', 2],
]
const HALIDES: [string, number, 'F' | 'Cl' | 'Br' | 'I'][] = [
  ['Na', 1, 'Cl'], ['K', 1, 'Br'], ['K', 1, 'I'], ['Na', 1, 'F'], ['Li', 1, 'F'], ['Ca', 2, 'F'], ['Mg', 2, 'Cl'],
  ['Ba', 2, 'Cl'], ['Ca', 2, 'Cl'], ['Al', 3, 'Cl'], ['Fe', 3, 'Cl'], ['Fe', 2, 'Cl'], ['Cu', 2, 'Cl'], ['Cu', 1, 'Cl'],
  ['Ag', 1, 'Br'], ['Ag', 1, 'Cl'], ['Ag', 1, 'I'], ['Zn', 2, 'Cl'], ['Pb', 2, 'I'], ['Sn', 4, 'Cl'], ['Sn', 2, 'Cl'],
  ['P', 3, 'Cl'], ['P', 5, 'Cl'], ['S', 6, 'F'], ['C', 4, 'Cl'], ['Si', 4, 'F'], ['Hg', 2, 'Cl'], ['N', 3, 'Cl'],
  ['Cr', 3, 'Cl'], ['Co', 2, 'Cl'], ['Ni', 2, 'Cl'], ['Mn', 2, 'Cl'], ['Au', 3, 'Cl'], ['Xe', 2, 'F'], ['Xe', 4, 'F'],
]
const SULFIDES: [string, number][] = [
  ['Na', 1], ['K', 1], ['Zn', 2], ['Fe', 2], ['Cu', 2], ['Cu', 1], ['Pb', 2], ['Ag', 1], ['Al', 3], ['Hg', 2],
  ['C', 4], ['Mn', 2], ['Ca', 2],
]
const METAL_HYDRIDES: [string, number][] = [['Na', 1], ['Li', 1], ['K', 1], ['Ca', 2], ['Mg', 2], ['Al', 3]]
const NITRIDES: [string, number][] = [['Li', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Al', 3]]

const NONMETAL_HYDRIDES: NItem[] = [
  ['HCl', 'chlorovodík', ['hydrid chlorný', 'kyselina chlorná', 'chlorid vodný'], 'Sloučeniny vodíku s halogeny jsou halogenovodíky: $HCl$ je chlorovodík. Jeho vodný roztok je kyselina chlorovodíková.'],
  ['HF', 'fluorovodík', ['hydrid fluorný', 'kyselina fluorná', 'fluorid vodný'], '$HF$ je fluorovodík (halogenovodík). Leptá sklo.'],
  ['HBr', 'bromovodík', ['hydrid bromný', 'kyselina bromná', 'bromid vodný'], '$HBr$ je bromovodík – vodík + brom.'],
  ['HI', 'jodovodík', ['hydrid jodný', 'kyselina jodná', 'jodid vodný'], '$HI$ je jodovodík – vodík + jod.'],
  ['H2S', 'sulfan', ['sulfid vodný', 'hydrid sirnatý', 'kyselina siřičitá'], '$H2S$ je sulfan (dříve sirovodík) – páchne po zkažených vejcích.'],
  ['NH3', 'amoniak', ['amonný kation', 'hydrid dusitý', 'nitrid vodný'], '$NH3$ je amoniak (systematicky azan). Pozor, $NH4^+$ je amonný kation.'],
  ['CH4', 'methan', ['hydrid uhličitý', 'karbid vodný', 'ethan'], '$CH4$ je methan – hlavní složka zemního plynu.'],
].map(([formula, name, wrong, explain]) => ({ cat: 'hydride' as Cat, formula: formula as string, name: name as string, wrong: wrong as string[], explain: explain as string }))

const PEROXIDES: NItem[] = [
  { cat: 'peroxide', formula: 'H2O2', name: 'peroxid vodíku', wrong: ['oxid vodný', 'hydroxid vodíku', 'voda'], explain: 'Peroxidová skupina $O2^2-$ má kyslík s oxidačním číslem −I. $H2O2$ je peroxid vodíku.' },
  ...(['Na', 'K', 'Li'] as const).map((el) => peroxideItem(el, 1)),
  ...(['Ba', 'Ca'] as const).map((el) => peroxideItem(el, 2)),
]

function peroxideItem(el: string, ox: number): NItem {
  const [n, m] = crossRule(ox, -2)
  const formula = `${el}${n > 1 ? n : ''}O2`
  void m
  const adj = adjective(el, ox)
  return {
    cat: 'peroxide',
    formula,
    name: `peroxid ${adj}`,
    wrong: [`oxid ${adj}`, `peroxid ${adjective(el, wrongOx(el, ox)[0])}`, `hydroxid ${adj}`],
    explain: `Peroxidový anion $O2^2-$ (kyslík −I) nese náboj −2, takže ${el} ${ROMAN[ox]} → $${formula}$. Pozor, ${`oxid ${adj}`} je $${binary(el, ox, 'O').formula}$.`,
  }
}

function hydroxideItem(c: Cation): NItem {
  const h = hydroxide(c)
  const wrongAdj = wrongOx(c.formula, c.charge).map((o) => `hydroxid ${adjective(c.formula, o)}`)
  return {
    cat: 'hydroxide',
    formula: h.formula,
    name: h.name,
    wrong: uniq([wrongAdj[0], `oxid ${c.adj}`, ...wrongAdj.slice(1), `peroxid ${c.adj}`], h.name),
    explain: `Hydroxidový anion $OH^-$ má náboj −1, ${c.ion} ${ionMarkup(c)} +${c.charge} → ${c.charge > 1 ? `${c.charge}× OH, v závorce: ` : ''}$${h.formula}$.`,
  }
}

const HYDROXIDE_CATIONS: [string, number][] = [
  ['Na', 1], ['K', 1], ['Li', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Sr', 2], ['Zn', 2], ['Cu', 2], ['Fe', 2],
  ['Fe', 3], ['Al', 3], ['Cr', 3], ['Pb', 2], ['Ni', 2], ['Co', 2], ['Mn', 2],
]

/** Acids that only level 7 lessons use. */
const ADV_ACIDS = new Set(['B', 'Se', 'I', 'Cr', 'Si'])
/** Anions that only level 7 lessons use. */
const ADV_ANIONS = new Set(['CrO4', 'Cr2O7', 'SiO3', 'CN', 'S2O3'])

function acidItem(el: string, ox: number): NItem {
  const a = oxoacid(el, ox)
  const wrong = wrongOx(el, ox).map((o) => `kyselina ${feminine(adjective(el, o))}`)
  const end = endingOf(el, ox).replace(/ý$/, 'á')
  return {
    cat: 'acid',
    formula: a.formula,
    name: a.name,
    wrong: uniq(wrong, a.name),
    ...(ADV_ACIDS.has(el) ? { adv: true } : {}),
    explain: `Vodík +I, kyslík −II: ${a.h} · (+1) + x + ${a.o} · (−2) = 0 → x = +${ox} (${ROMAN[ox]}) → koncovka **‑${end}**. ${
      a.h === 3 && ox % 2 === 1 ? `Výjimka: ${a.name} má 3 vodíky.` : ox % 2 ? 'Liché oxidační číslo → 1 vodík.' : 'Sudé oxidační číslo → 2 vodíky.'
    }`,
  }
}

const ACIDS: [string, number][] = [
  ['S', 6], ['S', 4], ['N', 5], ['N', 3], ['C', 4], ['P', 5], ['Cl', 7], ['Cl', 5], ['Cl', 3], ['Cl', 1],
  ['Mn', 7], ['Cr', 6], ['Si', 4], ['B', 3], ['Br', 5], ['Br', 1], ['I', 5], ['I', 7], ['Se', 6],
]

const BINARY_ACIDS: NItem[] = (['F', 'Cl', 'Br', 'I', 'S'] as const).map((f) => {
  const a = anion(f)
  const formula = f === 'S' ? 'H2S' : `H${f}`
  return {
    cat: 'binaryAcid' as Cat,
    formula,
    name: a.acid!,
    wrong: [],
    only: 'toFormula' as const,
    explain: `${a.acid![0].toUpperCase() + a.acid!.slice(1)} je vodný roztok ${f === 'S' ? 'sulfanu' : 'halogenovodíku'} $${formula}$ – bez kyslíku.`,
  }
})

function saltItem(cat: Cat, c: Cation, a: Anion): NItem {
  const s = salt(c, a)
  const sib = ANION_SIB[a.formula] ?? []
  const wrongCat = c.formula === c.element && ELEMENT_NOM[c.formula] ? wrongOx(c.formula, c.charge).map((o) => adjective(c.formula, o)) : []
  const wrong = uniq(
    [
      ...(sib[0] ? [`${sib[0]} ${c.adj}`] : []),
      ...(wrongCat[0] ? [`${a.stem} ${wrongCat[0]}`] : []),
      ...(sib[1] ? [`${sib[1]} ${c.adj}`] : []),
      ...(sib[0] && wrongCat[0] ? [`${sib[0]} ${wrongCat[0]}`] : []),
      ...(wrongCat[1] ? [`${a.stem} ${wrongCat[1]}`] : []),
      ...(c.formula === 'NH4' ? [`${a.stem} amonatý`, `${sib[0] ?? a.stem} amonatý`] : []),
    ],
    s.name,
  )
  const [nC, nA] = crossRule(c.charge, a.charge)
  return {
    cat,
    formula: s.formula,
    name: s.name,
    wrong,
    ...(ADV_ANIONS.has(a.formula) ? { adv: true } : {}),
    explain: `${cap(c.ion)} ${ionMarkup(c)} a ${a.ion} ${ionMarkup(a)} → ${
      nC === 1 && nA === 1 ? 'náboje se vyrovnají 1 : 1' : `křížové pravidlo ${nC} : ${nA}`
    } → $${s.formula}$.`,
  }
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

const SALTS: [string, number, string][] = [
  ['Cu', 2, 'SO4'], ['Ag', 1, 'NO3'], ['Ca', 2, 'CO3'], ['Ca', 2, 'PO4'], ['Al', 3, 'SO4'], ['K', 1, 'MnO4'],
  ['Na', 1, 'ClO'], ['K', 1, 'Cr2O7'], ['Na', 1, 'NO3'], ['K', 1, 'NO3'], ['Na', 1, 'NO2'], ['Na', 1, 'SO4'],
  ['Na', 1, 'SO3'], ['Na', 1, 'CO3'], ['K', 1, 'CO3'], ['Mg', 2, 'SO4'], ['Fe', 2, 'SO4'], ['Fe', 3, 'SO4'],
  ['Zn', 2, 'SO4'], ['Ba', 2, 'SO4'], ['Ca', 2, 'SO4'], ['NH4', 1, 'Cl'], ['NH4', 1, 'NO3'], ['NH4', 1, 'SO4'],
  ['Pb', 2, 'NO3'], ['K', 1, 'ClO3'], ['K', 1, 'ClO4'], ['Na', 1, 'PO4'], ['K', 1, 'CrO4'], ['Mg', 2, 'CO3'],
  ['Cu', 2, 'NO3'], ['Fe', 3, 'NO3'], ['Al', 3, 'PO4'], ['Ca', 2, 'NO3'], ['Na', 1, 'SiO3'], ['Ba', 2, 'NO3'],
  ['Ca', 2, 'ClO'], ['K', 1, 'CN'], ['Fe', 3, 'PO4'], ['Cr', 3, 'SO4'],
]
const HYDROGEN_SALTS: [string, number, string][] = [
  ['Na', 1, 'HCO3'], ['Ca', 2, 'HCO3'], ['K', 1, 'HCO3'], ['Na', 1, 'HSO4'], ['K', 1, 'HSO4'], ['Na', 1, 'H2PO4'],
  ['K', 1, 'H2PO4'], ['Na', 1, 'HPO4'], ['K', 1, 'HPO4'], ['Ca', 2, 'HPO4'], ['Ca', 2, 'H2PO4'], ['Na', 1, 'HSO3'],
  ['NH4', 1, 'H2PO4'], ['NH4', 1, 'HPO4'], ['Mg', 2, 'HCO3'],
]
const HYDRATES: [string, number, string, number][] = [
  ['Cu', 2, 'SO4', 5], ['Na', 1, 'CO3', 10], ['Ca', 2, 'SO4', 2], ['Fe', 2, 'SO4', 7], ['Mg', 2, 'SO4', 7],
  ['Zn', 2, 'SO4', 7], ['Na', 1, 'SO4', 10], ['Co', 2, 'Cl', 6], ['Cu', 2, 'Cl', 2], ['Ba', 2, 'Cl', 2],
  ['Ca', 2, 'Cl', 6], ['Ni', 2, 'SO4', 6], ['Fe', 3, 'Cl', 6],
]

function hydrateItem(c: Cation, a: Anion, n: number): NItem {
  const base = salt(c, a)
  const h = hydrate(base, n)
  const alt = (s: Compound, k: number) => hydrate(s, k).name
  const sib = ANION_SIB[a.formula]?.[0]
  const wrongCat = c.formula === c.element ? wrongOx(c.formula, c.charge)[0] : undefined
  const wrong = uniq(
    [
      alt(base, n === 10 ? 9 : n + 1),
      ...(sib ? [alt({ formula: '', name: `${sib} ${c.adj}` }, n)] : []),
      ...(wrongCat ? [alt({ formula: '', name: `${a.stem} ${adjective(c.formula, wrongCat)}` }, n)] : []),
      alt(base, n - 1 || 3),
      `${base.name} ${MULT[n]}hydrát`,
    ],
    h.name,
  )
  return {
    cat: 'hydrate',
    formula: h.formula,
    name: h.name,
    wrong,
    explain: `${cap(MULT[n])}hydrát = ${n} ${n <= 4 ? 'molekuly' : 'molekul'} vody na jednu jednotku ${base.name.split(' ')[0]}u. Voda se píše za tečku: $${h.formula}$. Název soli je ve 2. pádě.`,
  }
}

function cationIonItem(c: Cation): NItem {
  const wrongAdj = wrongOx(c.formula, c.charge).map((o) => `${adjective(c.formula, o)} kation`)
  return {
    cat: 'ion',
    formula: c.formula,
    display: ionMarkup(c),
    name: c.ion,
    wrong: uniq([wrongAdj[0], `${c.adj} anion`, ...wrongAdj.slice(1)], c.ion),
    only: 'toName',
    explain: `Kladný náboj = kation. Náboj ${c.charge}+ → oxidační číslo ${ROMAN[c.charge]} → koncovka **‑${endingOf(c.formula, c.charge)}**.`,
  }
}

function anionIonItem(a: Anion): NItem {
  const sib = (ANION_SIB[a.formula] ?? []).map((s) => `${s}ový anion`)
  return {
    cat: 'ion',
    formula: a.formula,
    display: ionMarkup(a),
    name: a.ion,
    wrong: uniq([sib[0], `${a.stem}ový kation`, ...sib.slice(1), `${a.stem} anion`].filter(Boolean), a.ion),
    only: 'toName',
    explain: a.acid
      ? `Záporný náboj = anion. ${ionMarkup(a)} vznikne z kyseliny (${a.acid}) odtržením ${-a.charge} ${-a.charge === 1 ? 'kationtu' : 'kationtů'} $H^+$.`
      : `Záporný náboj = anion: ${ionMarkup(a)} je ${a.ion}.`,
  }
}

const ION_CATIONS: [string, number][] = [
  ['Na', 1], ['Ag', 1], ['Cu', 1], ['Cu', 2], ['Fe', 2], ['Fe', 3], ['Al', 3], ['Mg', 2], ['Ca', 2], ['Zn', 2], ['Pb', 2],
  ['Cr', 3], ['Mn', 2], ['Sn', 2], ['Pb', 4], ['Sn', 4],
]
const ION_ANIONS = [
  'Cl', 'O', 'S', 'N', 'OH', 'NO3', 'NO2', 'SO4', 'SO3', 'CO3', 'HCO3', 'PO4', 'ClO', 'ClO3', 'ClO4', 'MnO4', 'CrO4', 'Cr2O7', 'S2O3', 'SiO3', 'CN',
]

// ------------------------------------------------------- coordination compounds (level 7)

type CSpec = [metal: string, ox: number, ligand: Ligand, n: number]

const LIGAND_SWAP: Record<Ligand, string> = { NH3: 'aqua', H2O: 'ammin', OH: 'oxido', F: 'chlorido', Cl: 'fluorido', CN: 'chlorido' }
const OTHER_COUNT: Record<number, number> = { 2: 4, 4: 6, 6: 4 }

/** Wrong adjectives/nouns of a complex: other oxidation number, other count, other ligand. */
function complexVariants([m, ox, lig, n]: CSpec) {
  const L = complexIon(m, ox, lig, n)
  const pre = (k: number, name: string) => MULT[k] + name
  const ligName = LIGANDS[lig].name
  const o = wrongOx(m, ox)[0]
  return {
    L,
    adjs: [pre(n, ligName) + adjective(m, o), pre(OTHER_COUNT[n], ligName) + adjective(m, ox), pre(n, LIGAND_SWAP[lig]) + adjective(m, ox)],
    stems: [
      pre(n, ligName) + anionStem(adjective(m, o)),
      pre(OTHER_COUNT[n], ligName) + anionStem(adjective(m, ox)),
      pre(n, LIGAND_SWAP[lig]) + anionStem(adjective(m, ox)),
    ],
  }
}

function cplxExplain([m, ox, lig, n]: CSpec, charge: number): string {
  const neutral = LIGANDS[lig].charge === 0
  return (
    `Centrální atom $${m}$ má oxidační číslo ${ROMAN[ox]} (koncovka **‑${endingOf(m, ox)}**), kolem něj je ` +
    `${n}× ligand ${neutral ? `$${lig}$` : `$${lig}^-$`} (**${MULT[n]}${LIGANDS[lig].name}**). ` +
    `Náboj: ${ox} ${neutral ? '+ 0' : `− ${n}`} = ${charge > 0 ? '+' : '−'}${Math.abs(charge)}` +
    (charge < 0 ? ', je to anion, proto koncovka **‑an**.' : ', je to kation.')
  )
}

function complexIonItem(spec: CSpec): NItem {
  const { L, adjs, stems } = complexVariants(spec)
  const display = ionMarkup(L)
  const wrong =
    L.charge > 0
      ? [`${adjs[0]} kation`, `${adjs[1]} kation`, `${L.stem}ový anion`, `${adjs[2]} kation`]
      : [`${stems[0]}ový anion`, `${L.adj} kation`, `${stems[1]}ový anion`, `${stems[2]}ový anion`]
  return {
    cat: 'complex',
    formula: L.formula,
    display,
    name: L.ion,
    wrong: uniq(wrong, L.ion),
    only: 'toName',
    explain: cplxExplain(spec, L.charge),
  }
}

/** Salt with a complex cation (and a simple anion) or a complex anion (and a simple cation). */
function complexSaltItem(spec: CSpec, counter: Cation | Anion): NItem {
  const { L, adjs, stems } = complexVariants(spec)
  const isCat = L.charge > 0
  const s = isCat ? salt(L, counter as Anion) : salt(counter as Cation, L)
  const wrong = isCat
    ? [`${(counter as Anion).stem} ${adjs[0]}`, `${(counter as Anion).stem} ${adjs[1]}`, `${(counter as Anion).stem} ${L.stem}`, `${(counter as Anion).stem} ${adjs[2]}`]
    : [`${stems[0]} ${(counter as Cation).adj}`, `${L.adj} ${(counter as Cation).adj}`, `${stems[1]} ${(counter as Cation).adj}`, `${stems[2]} ${(counter as Cation).adj}`]
  return {
    cat: 'complex',
    formula: s.formula,
    name: s.name,
    wrong: uniq(wrong, s.name),
    explain: `${cplxExplain(spec, L.charge)} Komplexní ion se píše do hranatých závorek: $${s.formula}$.`,
  }
}

const COMPLEX_IONS: CSpec[] = [
  ['Cu', 2, 'NH3', 4], ['Cu', 2, 'H2O', 6], ['Ag', 1, 'NH3', 2], ['Fe', 3, 'H2O', 6], ['Fe', 2, 'CN', 6], ['Fe', 3, 'CN', 6],
  ['Al', 3, 'OH', 4], ['Zn', 2, 'OH', 4], ['Al', 3, 'F', 6],
]
const COMPLEX_SALTS: [CSpec, () => Cation | Anion][] = [
  [['Cu', 2, 'NH3', 4], () => anion('SO4')],
  [['Ag', 1, 'NH3', 2], () => anion('Cl')],
  [['Co', 3, 'NH3', 6], () => anion('Cl')],
  [['Ni', 2, 'NH3', 6], () => anion('Cl')],
  [['Cu', 2, 'H2O', 6], () => anion('SO4')],
  [['Fe', 2, 'CN', 6], () => cation('K')],
  [['Fe', 3, 'CN', 6], () => cation('K')],
  [['Al', 3, 'OH', 4], () => cation('Na')],
  [['Zn', 2, 'OH', 4], () => cation('Na')],
  [['Al', 3, 'F', 6], () => cation('Na')],
  [['Cu', 2, 'Cl', 4], () => cation('K')],
]

// ------------------------------------------------------------------ organic (level 8)

/** Display markup of a condensed formula: bonds as dashes, ring note outside the formula. */
export function orgMarkup(f: string): string {
  const ring = f.endsWith(' (kruh)')
  const core = (ring ? f.slice(0, -7) : f).replace(/-/g, '–')
  return `$${core}$${ring ? ' (kruh)' : ''}`
}

function organicItem(o: OrganicItem): NItem {
  return {
    cat: o.cat,
    formula: o.formula,
    display: orgMarkup(o.formula),
    name: o.name,
    wrong: o.wrongNames,
    wrongFormulas: o.wrongFormulas.map(orgMarkup),
    explain: `${o.hint} Souhrnný vzorec $${o.molecular}$.`,
  }
}

// ------------------------------------------------------------------------ pools & levels

/** All items per category. */
export function pool(): Record<Cat, NItem[]> {
  const byOrg = Object.fromEntries(
    (Object.keys(ORG_CAT_LABEL) as OrgCat[]).map((c) => [c, ORGANIC.filter((o) => o.cat === c).map(organicItem)]),
  ) as Record<OrgCat, NItem[]>
  return {
    oxide: OXIDES.map(([el, ox]) => binaryItem('oxide', el, ox, 'O')),
    halide: HALIDES.map(([el, ox, x]) => binaryItem('halide', el, ox, x)),
    sulfide: SULFIDES.map(([el, ox]) => binaryItem('sulfide', el, ox, 'S')),
    hydride: [...METAL_HYDRIDES.map(([el, ox]) => binaryItem('hydride', el, ox, 'H')), ...NONMETAL_HYDRIDES],
    peroxide: PEROXIDES,
    nitride: NITRIDES.map(([el, ox]) => binaryItem('nitride', el, ox, 'N')),
    hydroxide: HYDROXIDE_CATIONS.map(([f, ch]) => hydroxideItem(cation(f, ch))),
    acid: ACIDS.map(([el, ox]) => acidItem(el, ox)),
    binaryAcid: BINARY_ACIDS,
    salt: SALTS.map(([f, ch, an]) => saltItem('salt', cation(f, ch), anion(an))),
    hydrogenSalt: HYDROGEN_SALTS.map(([f, ch, an]) => saltItem('hydrogenSalt', cation(f, ch), anion(an))),
    hydrate: HYDRATES.map(([f, ch, an, n]) => hydrateItem(cation(f, ch), anion(an), n)),
    ion: [...ION_CATIONS.map(([f, ch]) => cationIonItem(cation(f, ch))), ...ION_ANIONS.map((f) => anionIonItem(anion(f)))],
    complex: [...COMPLEX_IONS.map(complexIonItem), ...COMPLEX_SALTS.map(([spec, counter]) => complexSaltItem(spec, counter()))],
    ...byOrg,
  }
}

export interface LevelSpec {
  /** Category weights: which kinds of compounds the level trains, and how often. */
  weights: Partial<Record<Cat, number>>
  /** Items the level may use (default: all items of its categories). */
  allow?: (it: NItem) => boolean
}

/** Levels the game supports (see spec/courses/chemie/games.md). */
export const NAMING_LEVELS = [3, 5, 7, 8] as const

/** Content per level. */
export const LEVELS: Record<number, LevelSpec> = {
  // Oxides, halides, sulfides, hydrides, peroxides, nitrides.
  3: { weights: { oxide: 3, halide: 2.5, sulfide: 1.5, hydride: 1.2, peroxide: 1, nitride: 1 } },
  // Oxoacids, hydroxides, salts, hydrogen salts, hydrates (without level-7 anions).
  5: {
    weights: { acid: 2.5, binaryAcid: 0.6, hydroxide: 2, salt: 2.5, hydrogenSalt: 1.5, hydrate: 1.2 },
    allow: (it) => !it.adv,
  },
  // Everything inorganic, with ions and coordination compounds.
  7: {
    weights: {
      oxide: 0.8, halide: 0.6, sulfide: 0.4, hydride: 0.3, peroxide: 0.4, nitride: 0.3, hydroxide: 0.6, acid: 1,
      binaryAcid: 0.3, salt: 1.2, hydrogenSalt: 0.6, hydrate: 0.6, ion: 1.6, complex: 2.2,
    },
  },
  // Organic nomenclature.
  8: {
    weights: {
      alkane: 2, unsaturated: 1.8, cycloalkane: 0.8, arene: 1, alcohol: 1.5, aldehyde: 1, ketone: 1, carboxylic: 1.2,
      ester: 1, amine: 1,
    },
  },
}

/** Free play ("Vše"): every category of every level. */
export const MIX: LevelSpec = {
  weights: Object.assign({}, ...NAMING_LEVELS.map((l) => LEVELS[l].weights)),
}

/** Spec for a level number; free play (undefined) or an unsupported level mixes all levels. */
export const specFor = (level?: number): LevelSpec => (level !== undefined && LEVELS[level]) || MIX

/** Items a level can ask about, per category. */
export function itemsFor(level?: number): Partial<Record<Cat, NItem[]>> {
  const spec = specFor(level)
  const all = pool()
  const out: Partial<Record<Cat, NItem[]>> = {}
  for (const c of Object.keys(spec.weights) as Cat[]) out[c] = all[c].filter((it) => !spec.allow || spec.allow(it))
  return out
}

/** Does the item need a multiple choice for name → formula? */
export const formulaChoice = (it: NItem) => !!it.wrongFormulas

export function buildQuestions(level?: number, n = 10, rnd: () => number = Math.random): Question[] {
  const spec = specFor(level)
  const all = itemsFor(level)
  const weights = spec.weights
  const cats = Object.keys(weights) as Cat[]
  const perCat = Math.max(3, Math.ceil(n / 3))
  const used = new Set<string>()
  const dirs = shuffle([...Array(Math.ceil(n / 2)).fill('toName'), ...Array(Math.floor(n / 2)).fill('toFormula')], rnd) as Question['dir'][]
  const out: Question[] = []
  const catCount = new Map<Cat, number>()
  for (let i = 0; i < n; i++) {
    let dir = dirs[i]
    let item: NItem | undefined
    for (let attempt = 0; attempt < 50 && !item; attempt++) {
      // weighted category pick, avoiding too many of one kind
      const avail = cats.filter((c) => (catCount.get(c) ?? 0) < perCat)
      const total = avail.reduce((s, c) => s + weights[c]!, 0)
      let r = rnd() * total
      let cat = avail[0]
      for (const c of avail) {
        r -= weights[c]!
        if (r <= 0) {
          cat = c
          break
        }
      }
      const candidates = (all[cat] ?? []).filter((it) => !used.has(it.formula + it.name))
      const pickIt = candidates[Math.floor(rnd() * candidates.length)]
      if (!pickIt) continue
      if (pickIt.only && pickIt.only !== dir) {
        // honour the item's direction if the other one is impossible
        dir = pickIt.only
      }
      if (dir === 'toName' && pickIt.wrong.length < 3) continue
      item = pickIt
      catCount.set(cat, (catCount.get(cat) ?? 0) + 1)
    }
    if (!item) continue
    used.add(item.formula + item.name)
    if (dir === 'toName') {
      out.push({ dir, item, options: shuffle([item.name, ...item.wrong.slice(0, 3)], rnd), answer: item.name })
    } else if (formulaChoice(item)) {
      const answer = markupOf(item)
      out.push({ dir, item, options: shuffle([answer, ...item.wrongFormulas!.slice(0, 3)], rnd), answer })
    } else {
      out.push({ dir, item, options: [], answer: item.formula })
    }
  }
  return out
}
