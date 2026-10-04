/**
 * Chemické pexeso – one pair set per level (spec/courses/chemie/games.md).
 *
 * Card texts are <Md> markup ($H2SO4$, ^{2+}, _{A}). Every set has at least 16 pairs
 * so rounds of 6–8 pairs vary; levels.test.ts checks that no card text repeats
 * (on either side), so every match is unambiguous.
 */
import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { ANIONS, ionMarkup } from '../shared/ions'
import { group } from '../shared/nomenclature'

export interface MemPair {
  /** Left card (Md markup). With `el` it is shown on an element tile. */
  a: string
  /** Right card (Md markup). */
  b: string
  /** Render card A as an element tile of this symbol (Z, symbol, category colour). */
  el?: string
  /** Small label above the text; overrides the level's default ('' = none). */
  tagA?: string
  tagB?: string
  /** Element symbols the pair is about: go to the sticker album; never two in one mixed round. */
  syms?: string[]
  /** Extra line after a successful match (Md markup). */
  note?: string
  /** Pairs sharing a clash key never meet in one mixed round (would be ambiguous there). */
  clash?: string[]
}

export interface MemLevel {
  /** Instruction line above the board. */
  instr: string
  /** Default labels of the two sides. */
  tagA: string
  tagB: string
  /** Pairs per round. */
  size: number
  /** Long texts: 3 columns on phones, squarer cards. */
  long?: boolean
  /** Symbols preferred when dealing (at least half of the round), e.g. tricky symbols at L2. */
  prefer?: string[]
  /** Clash keys added to every pair of the level. */
  clash?: string[]
  pairs: MemPair[]
}

/* ---------------------------------------------------------------- L2 ---- */

/** Symbols whose Czech names don't resemble the symbol – the fun part at level 2. */
export const TRICKY = ['Na', 'K', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Fe', 'Cu', 'Sb', 'W', 'S', 'Si', 'C', 'N', 'O', 'H', 'P', 'Mg', 'Ca', 'Mn', 'Cl', 'F']

/** Z 1–20 plus the metals and halogens level 2 names. */
const L2_SYMBOLS = [
  ...Array.from({ length: 20 }, (_, i) => i + 1).map((z) => Object.values(BY_SYMBOL).find((e) => e.z === z)!.symbol),
  'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Sb', 'W', 'Ni', 'Mn', 'Cr', 'Pt', 'Br', 'I',
]

const L2: MemLevel = {
  instr: 'Spoj značku prvku s jeho českým názvem.',
  tagA: '',
  tagB: 'název',
  size: 6,
  prefer: TRICKY,
  pairs: L2_SYMBOLS.map((s) => ({ a: s, b: BY_SYMBOL[s].name, el: s, syms: [s] })),
}

/* ---------------------------------------------------------------- L3 ---- */

/** [formula, name]: binary compounds from lesson l3-6 (+ trivial names). */
const L3_COMPOUNDS: [string, string][] = [
  ['CO2', 'oxid uhličitý'],
  ['CO', 'oxid uhelnatý'],
  ['SO2', 'oxid siřičitý'],
  ['SO3', 'oxid sírový'],
  ['Fe2O3', 'oxid železitý'],
  ['FeO', 'oxid železnatý'],
  ['CuO', 'oxid měďnatý'],
  ['Cu2O', 'oxid měďný'],
  ['CaO', 'oxid vápenatý'],
  ['Na2O', 'oxid sodný'],
  ['SiO2', 'oxid křemičitý'],
  ['Al2O3', 'oxid hlinitý'],
  ['MnO2', 'oxid manganičitý'],
  ['PbO2', 'oxid olovičitý'],
  ['Cl2O7', 'oxid chloristý'],
  ['N2O', 'oxid dusný'],
  ['NO2', 'oxid dusičitý'],
  ['OsO4', 'oxid osmičelý'],
  ['NaCl', 'chlorid sodný'],
  ['CaCl2', 'chlorid vápenatý'],
  ['FeCl3', 'chlorid železitý'],
  ['FeCl2', 'chlorid železnatý'],
  ['KBr', 'bromid draselný'],
  ['KI', 'jodid draselný'],
  ['CaF2', 'fluorid vápenatý'],
  ['SnF2', 'fluorid cínatý'],
  ['PbS', 'sulfid olovnatý'],
  ['ZnS', 'sulfid zinečnatý'],
  ['Ag2S', 'sulfid stříbrný'],
  ['NaH', 'hydrid sodný'],
  ['CaH2', 'hydrid vápenatý'],
  ['Li3N', 'nitrid lithný'],
  ['Mg3N2', 'nitrid hořečnatý'],
  ['H2O2', 'peroxid vodíku'],
  ['Na2O2', 'peroxid sodný'],
  ['BaO2', 'peroxid barnatý'],
  ['SiC', 'karbid křemičitý'],
  ['NH3', 'amoniak'],
  ['H2S', 'sulfan'],
  ['CH4', 'methan'],
]

/** Element symbols in a simple formula, in order of appearance ('Fe2O3' -> ['Fe', 'O']). */
export const symbolsOf = (formula: string) => [...new Set(formula.match(/[A-Z][a-z]?/g) ?? [])]

const L3: MemLevel = {
  instr: 'Spoj vzorec dvouprvkové sloučeniny s jejím názvem.',
  tagA: 'vzorec',
  tagB: 'název',
  size: 8,
  pairs: L3_COMPOUNDS.map(([f, name]) => ({ a: `$${f}$`, b: name, syms: symbolsOf(f) })),
}

/* ---------------------------------------------------------------- L4 ---- */

const L4: MemLevel = {
  instr: 'Spoj veličinu nebo pojem s jednotkou, hodnotou či vztahem.',
  tagA: 'pojem',
  tagB: 'jednotka · vztah',
  size: 6,
  long: true,
  pairs: [
    { a: 'látkové množství $n$', b: 'mol', tagB: 'jednotka' },
    { a: 'molární hmotnost $M$', b: 'g/mol', tagB: 'jednotka' },
    { a: 'molární koncentrace $c$', b: 'mol/dm^{3}', tagB: 'jednotka' },
    { a: 'hustota $ρ$', b: 'g/cm^{3}', tagB: 'jednotka' },
    { a: 'teplota $T$ ve stavové rovnici', b: 'kelvin (K)', tagB: 'jednotka' },
    { a: 'Avogadrova konstanta $N_{A}$', b: '6,022·10^{23} mol^{−1}', tagB: 'hodnota' },
    { a: 'molární objem plynu $V_{m}$', b: '22,4 dm^{3}/mol', tagB: 'hodnota' },
    { a: 'molární plynová konstanta $R$', b: '8,314 J·K^{−1}·mol^{−1}', tagB: 'hodnota' },
    { a: 'normální podmínky', b: '0 °C a 101,325 kPa', tagB: 'hodnota' },
    { a: 'stavová rovnice ideálního plynu', b: '$pV = nRT$', tagB: 'vztah' },
    { a: 'ředění roztoku', b: '$c1V1 = c2V2$', tagB: 'vztah' },
    { a: 'hmotnostní zlomek $w$', b: '*m*(látky) : *m*(roztoku)', tagB: 'vztah' },
    { a: 'zákon zachování hmotnosti', b: '*m*(reaktantů) = *m*(produktů)', tagB: 'vztah' },
    { a: 'výtěžek reakce', b: 'skutečné : teoretické množství · 100 %', tagB: 'vztah' },
    { a: 'relativní atomová hmotnost $A_{r}$', b: 'vážený průměr hmotností izotopů', tagB: 'význam' },
    { a: 'koeficienty v rovnici', b: 'poměr látkových množství', tagB: 'význam' },
    { a: 'omezující reaktant', b: 'spotřebuje se jako první', tagB: 'význam' },
    { a: 'Avogadrův zákon', b: 'za stejné T a p: stejný objem = stejně molekul', tagB: 'význam' },
  ],
}

/* ---------------------------------------------------------------- L5 ---- */

/** Acids of lesson l5-1 whose salts are named in l5-5 (anion formulas from shared/ions). */
const L5_ANIONS = ['Cl', 'F', 'Br', 'I', 'S', 'SO4', 'SO3', 'NO3', 'NO2', 'CO3', 'PO4', 'SiO3', 'ClO', 'ClO3', 'ClO4', 'MnO4', 'CrO4']

const acidPairs: MemPair[] = L5_ANIONS.map((f) => {
  const an = ANIONS.find((x) => x.formula === f)!
  const acidFormula = group('H', -an.charge) + f
  return {
    a: an.acid!,
    b: an.stem,
    syms: [an.element],
    note: `$${acidFormula}$ → ${ionMarkup(an)}`,
  }
})

/** Indicator ↔ colour, as in lesson l5-3 (colours never repeat, so matches stay unambiguous). */
const indicatorPairs: MemPair[] = [
  { a: 'fenolftalein v zásaditém roztoku', b: 'fialově růžová' },
  { a: 'fenolftalein v kyselém roztoku', b: 'bezbarvý' },
  { a: 'lakmus v zásaditém roztoku', b: 'modrá' },
  { a: 'methyloranž v zásaditém roztoku', b: 'žlutá' },
  { a: 'univerzální indikátor při pH 1', b: 'červená' },
  { a: 'univerzální indikátor při pH 7', b: 'zelená' },
].map((p) => ({ ...p, tagA: 'indikátor', tagB: 'barva', clash: ['colour'] }))

const L5: MemLevel = {
  instr: 'Spoj kyselinu s aniontem jejích solí a indikátor s jeho barvou.',
  tagA: '',
  tagB: 'anion soli',
  size: 6,
  long: true,
  pairs: [...acidPairs, ...indicatorPairs],
}

/* ---------------------------------------------------------------- L6 ---- */

const L6: MemLevel = {
  instr: 'Spoj pojem s jeho definicí.',
  tagA: 'pojem',
  tagB: 'definice',
  size: 6,
  long: true,
  pairs: [
    { a: 'oxidace', b: 'odevzdání elektronů, oxidační číslo roste' },
    { a: 'redukce', b: 'přijetí elektronů, oxidační číslo klesá' },
    { a: 'oxidační činidlo', b: 'elektrony bere, samo se redukuje' },
    { a: 'redukční činidlo', b: 'elektrony dává, samo se oxiduje' },
    { a: 'anoda galvanického článku', b: 'elektroda, kde probíhá oxidace' },
    { a: 'katoda galvanického článku', b: 'elektroda, kde probíhá redukce' },
    { a: 'solný můstek', b: 'uzavírá obvod mezi poločlánky' },
    { a: 'elektrolýza', b: 'reakce vynucená elektrickým proudem' },
    { a: 'exotermní děj', b: 'teplo uvolňuje, ΔH < 0' },
    { a: 'endotermní děj', b: 'teplo pohlcuje, ΔH > 0' },
    { a: 'Hessův zákon', b: 'ΔH nezávisí na cestě, jen na počátku a konci' },
    { a: 'Gibbsova energie', b: 'ΔG = ΔH − TΔS rozhoduje o samovolnosti' },
    { a: 'aktivační energie', b: 'nejmenší energie srážky, která vede k reakci' },
    { a: 'katalyzátor', b: 'urychlí reakci a sám se nespotřebuje' },
    { a: 'rychlost reakce', b: 'změna koncentrace za jednotku času' },
    { a: 'dynamická rovnováha', b: 'přímá a zpětná reakce běží stejně rychle' },
    { a: 'Le Chatelierův princip', b: 'soustava zmenšuje účinek vnějšího zásahu' },
    { a: 'rovnovážná konstanta $K_{c}$', b: 'velká hodnota: převažují produkty' },
    { a: '$pK_{a}$', b: 'čím menší, tím silnější kyselina' },
    { a: 'pufr', b: 'směs, která odolává změně pH' },
    { a: 'koroze', b: 'samovolné rozrušování kovu' },
  ],
}

/* ---------------------------------------------------------------- L7 ---- */

const use = (sym: string, b: string, extra: Partial<MemPair> = {}): MemPair => ({
  a: BY_SYMBOL[sym].name,
  el: sym,
  b,
  syms: [sym],
  ...extra,
})

const L7: MemLevel = {
  instr: 'Spoj prvek s jeho typickou sloučeninou, výrobou nebo využitím.',
  tagA: 'prvek',
  tagB: 'typicky',
  size: 6,
  long: true,
  pairs: [
    use('H', 'palivo, které shoří na vodu'),
    use('O', 'ozon, štít proti UV záření'),
    use('N', 'amoniak (Haberova–Boschova syntéza)'),
    use('S', 'kyselina sírová kontaktním způsobem'),
    use('P', 'bílá a červená modifikace'),
    use('C', 'diamant, grafit a grafen'),
    use('Si', 'polovodiče a čipy'),
    use('Cl', 'dezinfekce vody a bazénů'),
    use('F', 'zubní pasty proti zubnímu kazu'),
    use('I', 'tinktura na dezinfekci ran'),
    use('He', 'plnění balonků a vzducholodí'),
    use('Ne', 'svítící reklamní trubice'),
    use('Ar', 'ochranný plyn při svařování'),
    use('Na', 'žlutě barví plamen', { clash: ['colour'] }),
    use('K', 'fialově barví plamen', { clash: ['colour'] }),
    use('Sr', 'červený ohňostroj', { clash: ['colour'] }),
    use('Mg', 'hoří oslnivě bílým světlem'),
    use('Ca', 'vápenec, pálené a hašené vápno'),
    use('Al', 'bauxit a elektrolýza taveniny'),
    use('Fe', 'vysoká pec a krevel'),
    use('Cu', 'elektrické kabely, mosaz a bronz'),
    use('Zn', 'pozinkování plechu'),
    use('Cr', 'lesklé pokovení a nerezová ocel'),
    use('Pt', 'katalyzátory ve výfuku aut'),
    use('Au', 'rozpustí ho jen lučavka královská'),
  ],
}

/* ---------------------------------------------------------------- L8 ---- */

const L8: MemLevel = {
  instr: 'Spoj funkční skupinu nebo vazbu s třídou sloučenin.',
  tagA: 'skupina',
  tagB: 'třída',
  size: 6,
  long: true,
  clash: ['org'],
  pairs: [
    { a: '$C_{n}H_{2n+2}$', b: 'alkan' },
    { a: 'kruh z jednoduchých vazeb $C–C$', b: 'cykloalkan' },
    { a: '$C=C$', b: 'alken' },
    { a: '$C≡C$', b: 'alkyn' },
    { a: 'benzenové jádro', b: 'aren (aromatický uhlovodík)' },
    { a: '$R–X$ (X = F, Cl, Br, I)', b: 'halogenderivát' },
    { a: '$R–OH$', b: 'alkohol' },
    { a: '$–OH$ na benzenovém jádře', b: 'fenol' },
    { a: '$R–O–R$', b: 'ether' },
    { a: '$R–CHO$', b: 'aldehyd' },
    { a: "$R–CO–R'$", b: 'keton' },
    { a: '$R–COOH$', b: 'karboxylová kyselina' },
    { a: "$R–COO–R'$", b: 'ester' },
    { a: '$R–NH2$', b: 'amin' },
    { a: '$R–CONH2$', b: 'amid' },
    { a: '$R–NO2$', b: 'nitrosloučenina' },
    { a: '$R–COO^{−}Na^{+}$', b: 'sodná sůl karboxylové kyseliny' },
  ],
}

/* ---------------------------------------------------------------- L9 ---- */

const L9: MemLevel = {
  instr: 'Spoj biomolekulu s jejími stavebními jednotkami.',
  tagA: 'biomolekula',
  tagB: 'skládá se z',
  size: 6,
  long: true,
  clash: ['org'],
  pairs: [
    { a: 'škrob', b: 'α-glukóza' },
    { a: 'celulóza', b: 'β-glukóza' },
    { a: 'sacharóza', b: 'glukóza + fruktóza' },
    { a: 'laktóza', b: 'galaktóza + glukóza' },
    { a: 'maltóza', b: 'glukóza + glukóza' },
    { a: 'bílkovina', b: 'aminokyseliny spojené peptidovou vazbou' },
    { a: 'DNA', b: 'nukleotidy s deoxyribózou (A, T, G, C)' },
    { a: 'RNA', b: 'nukleotidy s ribózou (A, U, G, C)' },
    { a: 'ATP', b: 'adenin + ribóza + 3 fosfáty', syms: ['P'] },
    { a: 'tuk', b: 'glycerol + 3 mastné kyseliny' },
    { a: 'fosfolipid', b: 'glycerol + 2 mastné kyseliny + fosfát' },
    { a: 'vosk', b: 'mastná kyselina + vyšší alkohol' },
    { a: 'mýdlo', b: 'sodná sůl mastné kyseliny' },
    { a: 'cholesterol', b: 'steroid: čtyři spojené kruhy' },
    { a: 'hemoglobin', b: 'bílkovina + hem s železem', syms: ['Fe'] },
    { a: 'vitamin B_{12}', b: 'kobalt ve středu molekuly', syms: ['Co'] },
    { a: 'chlorofyl', b: 'hořčík ve středu molekuly', syms: ['Mg'] },
  ],
}

/** Pair set per level number (keys = levels in the registry). */
export const LEVELS: Record<number, MemLevel> = { 2: L2, 3: L3, 4: L4, 5: L5, 6: L6, 7: L7, 8: L8, 9: L9 }

/** Pairs per round and layout when the levels are mixed ("Vše"). */
export const MIX = { size: 6, long: true, instr: 'Mix ze všech úrovní: spoj karty, které k sobě patří.' }
