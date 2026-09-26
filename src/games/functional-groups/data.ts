export type ClassId =
  | 'alkohol'
  | 'fenol'
  | 'ether'
  | 'aldehyd'
  | 'keton'
  | 'kyselina'
  | 'ester'
  | 'amin'
  | 'amid'
  | 'halogenderivat'
  | 'alken'
  | 'aren'
  | 'nitro'

export interface FgClass {
  label: string
  /** Characteristic group, <Md> markup. */
  group: string
  /** One-sentence explanation of how to recognise it. */
  tell: string
}

export const CLASSES: Record<ClassId, FgClass> = {
  alkohol: { label: 'alkohol', group: '$–OH$', tell: 'Hydroxylová skupina –OH na nasyceném (sp³) uhlíku.' },
  fenol: { label: 'fenol', group: '$Ar–OH$', tell: 'Skupina –OH navázaná přímo na benzenové jádro.' },
  ether: { label: 'ether', group: "$R–O–R'$", tell: 'Kyslíkový „můstek“ mezi dvěma uhlovodíkovými zbytky.' },
  aldehyd: { label: 'aldehyd', group: '$–CHO$', tell: 'Karbonyl C=O na konci řetězce – uhlík nese ještě vodík.' },
  keton: { label: 'keton', group: '$>C=O$', tell: 'Karbonyl C=O uvnitř řetězce – z obou stran je uhlík.' },
  kyselina: {
    label: 'karboxylová kyselina',
    group: '$–COOH$',
    tell: 'Karboxyl –COOH: na jednom uhlíku je =O i –OH.',
  },
  ester: { label: 'ester', group: "$–COO–R'$", tell: 'Vodík karboxylu je nahrazený uhlovodíkovým zbytkem (z alkoholu).' },
  amin: { label: 'amin', group: '$–NH2$', tell: 'Dusík vázaný na uhlík – derivát amoniaku, bez karbonylu.' },
  amid: { label: 'amid', group: '$–CONH2$', tell: 'Dusík je navázaný přímo na karbonylový uhlík C=O.' },
  halogenderivat: { label: 'halogenderivát', group: '$–X$', tell: 'Atom halogenu (F, Cl, Br, I) nahradil vodík.' },
  alken: { label: 'alken', group: '$C=C$', tell: 'Dvojná vazba mezi dvěma uhlíky.' },
  aren: { label: 'aren', group: 'benzenové jádro', tell: 'Aromatický šestičlenný kruh (benzenové jádro).' },
  nitro: { label: 'nitrosloučenina', group: '$–NO2$', tell: 'Skupina –NO₂ navázaná na uhlík přes dusík.' },
}

/** Classes that learners confuse with each other (used for distractors). */
export const CONFUSE: Record<ClassId, ClassId[]> = {
  alkohol: ['fenol', 'ether', 'kyselina', 'aldehyd'],
  fenol: ['alkohol', 'aren', 'ether'],
  ether: ['alkohol', 'ester', 'keton'],
  aldehyd: ['keton', 'kyselina', 'alkohol'],
  keton: ['aldehyd', 'ester', 'ether'],
  kyselina: ['ester', 'aldehyd', 'alkohol'],
  ester: ['ether', 'kyselina', 'keton'],
  amin: ['amid', 'nitro'],
  amid: ['amin', 'ester', 'keton'],
  halogenderivat: ['alken', 'amin', 'nitro'],
  alken: ['aren', 'halogenderivat'],
  aren: ['alken', 'fenol'],
  nitro: ['amin', 'amid', 'ester'],
}

export type Ring = { sub?: string }

export interface FgItem {
  id: string
  kind: 'fragment' | 'example' | 'bio'
  /** Single-line condensed text (<Md> markup). */
  text?: string
  /** Multi-line structural art in monospace. */
  art?: string
  /** Benzene ring drawing (optionally with a substituent). */
  ring?: Ring
  answer: ClassId | string
  /** For combined answers (biomolecules): the full option list. */
  options?: string[]
  /** Classes that must not appear as distractors (they would also be right). */
  exclude?: ClassId[]
  /** Name of the compound (revealed after answering). */
  name?: string
  /** Extra explanation shown after answering. */
  note?: string
}

const CO = (right: string) => `    O\n    ║\nR ─ C ─ ${right}`

export const ITEMS: FgItem[] = [
  // ---------- fragments: compact ----------
  { id: 'f-oh', kind: 'fragment', text: '$R–OH$', answer: 'alkohol', note: 'R je uhlovodíkový zbytek (třeba $CH3–CH2–$).' },
  { id: 'f-cho', kind: 'fragment', text: '$R–CHO$', answer: 'aldehyd', note: 'Zápis –CHO = –CH=O, karbonyl na konci řetězce.' },
  { id: 'f-co', kind: 'fragment', text: "$R–CO–R'$", answer: 'keton', note: 'Karbonylová skupina >C=O mezi dvěma uhlíky.' },
  { id: 'f-cooh', kind: 'fragment', text: '$R–COOH$', answer: 'kyselina', note: 'Karboxylová skupina odštěpuje $H^+$, proto je to kyselina.' },
  { id: 'f-coo', kind: 'fragment', text: "$R–COO–R'$", answer: 'ester', note: 'Ester vzniká z kyseliny a alkoholu (esterifikace).' },
  { id: 'f-nh2', kind: 'fragment', text: '$R–NH2$', answer: 'amin', note: 'Aminy jsou zásadité jako amoniak.' },
  { id: 'f-conh2', kind: 'fragment', text: '$R–CONH2$', answer: 'amid', note: 'Na rozdíl od aminu je dusík hned vedle C=O.' },
  { id: 'f-x', kind: 'fragment', text: '$R–X$  (X = F, Cl, Br, I)', answer: 'halogenderivat' },
  { id: 'f-cc', kind: 'fragment', text: '$>C=C<$', answer: 'alken', note: 'Na dvojnou vazbu se dá adovat – třeba brom (odbarví bromovou vodu).' },
  { id: 'f-ror', kind: 'fragment', text: "$R–O–R'$", answer: 'ether', note: 'Na kyslíku není vodík, takže to není alkohol.' },
  { id: 'f-no2', kind: 'fragment', text: '$R–NO2$', answer: 'nitro', note: 'Nitroskupinu obsahuje třeba TNT.' },
  { id: 'f-ring', kind: 'fragment', ring: {}, answer: 'aren', note: 'Šest uhlíků se šesti delokalizovanými π-elektrony.' },
  { id: 'f-arOH', kind: 'fragment', ring: { sub: 'OH' }, answer: 'fenol', exclude: ['aren'], note: 'Fenoly jsou kyselejší než alkoholy.' },
  // ---------- fragments: structural art ----------
  { id: 'a-cho', kind: 'fragment', art: CO('H'), answer: 'aldehyd', note: 'Na karbonylovém uhlíku je vodík → aldehyd.' },
  { id: 'a-co', kind: 'fragment', art: CO("R'"), answer: 'keton', note: 'Na karbonylovém uhlíku jsou dva uhlíkové zbytky → keton.' },
  { id: 'a-cooh', kind: 'fragment', art: CO('OH'), answer: 'kyselina', note: 'C=O a –OH na stejném uhlíku = karboxyl.' },
  { id: 'a-coor', kind: 'fragment', art: CO("O ─ R'"), answer: 'ester' },
  { id: 'a-conh2', kind: 'fragment', art: CO('NH₂'), answer: 'amid' },
  { id: 'a-cc', kind: 'fragment', art: ' H       H\n  ╲     ╱\n   C ═ C\n  ╱     ╲\n H       H', answer: 'alken', name: 'ethen (ethylen)' },
  // ---------- example molecules ----------
  { id: 'e-ethanol', kind: 'example', text: '$CH3–CH2–OH$', answer: 'alkohol', name: 'ethanol', note: 'Líh v nápojích i v kahanu.' },
  { id: 'e-methanol', kind: 'example', text: '$CH3–OH$', answer: 'alkohol', name: 'methanol', note: 'Pozor, jedovatý – už malé množství poškozuje zrak.' },
  { id: 'e-glycerol', kind: 'example', text: '$CH2(OH)–CH(OH)–CH2(OH)$', answer: 'alkohol', name: 'glycerol (propan-1,2,3-triol)', note: 'Trojsytný alkohol, součást tuků.' },
  { id: 'e-dme', kind: 'example', text: '$CH3–CH2–O–CH2–CH3$', answer: 'ether', name: 'diethylether', note: 'Dřív se používal k narkóze.' },
  { id: 'e-phenol', kind: 'example', ring: { sub: 'OH' }, answer: 'fenol', exclude: ['aren'], name: 'fenol (hydroxybenzen)' },
  { id: 'e-formal', kind: 'example', text: '$HCHO$', answer: 'aldehyd', name: 'formaldehyd (methanal)', note: 'Jeho vodný roztok je formalín.' },
  { id: 'e-acetal', kind: 'example', text: '$CH3–CHO$', answer: 'aldehyd', name: 'acetaldehyd (ethanal)' },
  { id: 'e-acetone', kind: 'example', text: '$CH3–CO–CH3$', answer: 'keton', name: 'aceton (propanon)', note: 'Rozpouštědlo v odlakovači.' },
  { id: 'e-butanone', kind: 'example', text: '$CH3–CO–CH2–CH3$', answer: 'keton', name: 'butanon' },
  { id: 'e-acetic', kind: 'example', text: '$CH3–COOH$', answer: 'kyselina', name: 'kyselina octová (ethanová)', note: 'Ocet je její asi 8% roztok.' },
  { id: 'e-formic', kind: 'example', text: '$HCOOH$', answer: 'kyselina', name: 'kyselina mravenčí (methanová)', note: 'Mravenci a kopřivy ji používají k obraně.' },
  { id: 'e-etac', kind: 'example', text: '$CH3–COO–CH2–CH3$', answer: 'ester', name: 'ethyl-acetát', note: 'Voní po ovoci, je v odlakovačích.' },
  { id: 'e-methylamine', kind: 'example', text: '$CH3–NH2$', answer: 'amin', name: 'methylamin', note: 'Páchne po rybách.' },
  { id: 'e-aniline', kind: 'example', ring: { sub: 'NH2' }, answer: 'amin', exclude: ['aren'], name: 'anilin (fenylamin)', note: 'Surovina pro výrobu barviv.' },
  { id: 'e-acetamide', kind: 'example', text: '$CH3–CONH2$', answer: 'amid', name: 'acetamid (ethanamid)' },
  { id: 'e-urea', kind: 'example', text: '$H2N–CO–NH2$', answer: 'amid', exclude: ['amin'], name: 'močovina', note: 'Diamid kyseliny uhličité, konečný produkt metabolismu dusíku.' },
  { id: 'e-chloroform', kind: 'example', text: '$CHCl3$', answer: 'halogenderivat', name: 'chloroform (trichlormethan)' },
  { id: 'e-freon', kind: 'example', text: '$CCl2F2$', answer: 'halogenderivat', name: 'freon 12 (dichlordifluormethan)', note: 'Freony poškozují ozonovou vrstvu.' },
  { id: 'e-chlorobenzene', kind: 'example', ring: { sub: 'Cl' }, answer: 'halogenderivat', exclude: ['aren'], name: 'chlorbenzen' },
  { id: 'e-ethene', kind: 'example', text: '$CH2=CH2$', answer: 'alken', name: 'ethen (ethylen)', note: 'Z něj se vyrábí polyethylen.' },
  { id: 'e-propene', kind: 'example', text: '$CH3–CH=CH2$', answer: 'alken', name: 'propen' },
  { id: 'e-toluene', kind: 'example', ring: { sub: 'CH3' }, answer: 'aren', name: 'toluen (methylbenzen)' },
  { id: 'e-benzene', kind: 'example', text: '$C6H6$', answer: 'aren', name: 'benzen', note: 'Karcinogenní – dnes se nahrazuje toluenem.' },
  { id: 'e-nitrobenzene', kind: 'example', ring: { sub: 'NO2' }, answer: 'nitro', exclude: ['aren'], name: 'nitrobenzen', note: 'Vzniká nitrací benzenu.' },
  { id: 'e-nitromethane', kind: 'example', text: '$CH3–NO2$', answer: 'nitro', name: 'nitromethan', note: 'Palivo pro závodní modely.' },
  // ---------- biomolecules (level 9) ----------
  {
    id: 'b-peptide',
    kind: 'bio',
    text: '$…–CO–NH–…$  (peptidová vazba)',
    answer: 'amid',
    exclude: ['amin'],
    name: 'peptidová vazba',
    note: 'Peptidová vazba spojuje aminokyseliny v bílkovinách – chemicky je to amidová vazba.',
  },
  {
    id: 'b-glucose',
    kind: 'bio',
    text: '$CH2OH–(CHOH)4–CHO$',
    answer: 'aldehyd + alkohol',
    options: ['aldehyd + alkohol', 'keton + alkohol', 'karboxylová kyselina + alkohol', 'ester + alkohol'],
    name: 'glukóza (otevřená forma)',
    note: 'Glukóza je aldohexóza: na konci má –CHO a k tomu pět skupin –OH.',
  },
  {
    id: 'b-fructose',
    kind: 'bio',
    text: '$CH2OH–CO–(CHOH)3–CH2OH$',
    answer: 'keton + alkohol',
    options: ['aldehyd + alkohol', 'keton + alkohol', 'ester + alkohol', 'ether + alkohol'],
    name: 'fruktóza (otevřená forma)',
    note: 'Fruktóza je ketohexóza: karbonyl je na 2. uhlíku.',
  },
  {
    id: 'b-fat',
    kind: 'bio',
    text: "$CH2–O–CO–R$\n$CH–O–CO–R'$\n$CH2–O–CO–R''$",
    answer: 'ester',
    exclude: ['ether'],
    name: 'tuk (triacylglycerol)',
    note: 'Tuky jsou estery glycerolu a mastných kyselin. Zmýdelněním z nich vzniká mýdlo.',
  },
  {
    id: 'b-glycine',
    kind: 'bio',
    text: '$H2N–CH2–COOH$',
    answer: 'amin + karboxylová kyselina',
    options: ['amin + karboxylová kyselina', 'amid + alkohol', 'amid + karboxylová kyselina', 'nitrosloučenina + aldehyd'],
    name: 'glycin (kyselina aminooctová)',
    note: 'Aminokyselina: aminoskupina a karboxyl na jedné molekule.',
  },
  {
    id: 'b-lactic',
    kind: 'bio',
    text: '$CH3–CH(OH)–COOH$',
    answer: 'alkohol + karboxylová kyselina',
    options: ['alkohol + karboxylová kyselina', 'aldehyd + alkohol', 'ester', 'keton + karboxylová kyselina'],
    name: 'kyselina mléčná',
    note: 'Hydroxykyselina – vzniká ve svalech při námaze a v kysaném mléce.',
  },
  {
    id: 'b-stearic',
    kind: 'bio',
    text: '$CH3–(CH2)16–COOH$',
    answer: 'kyselina',
    name: 'kyselina stearová',
    note: 'Nasycená mastná kyselina ze živočišných tuků.',
  },
  {
    id: 'b-oleic',
    kind: 'bio',
    text: '$CH3–(CH2)7–CH=CH–(CH2)7–COOH$',
    answer: 'alken + karboxylová kyselina',
    options: ['alken + karboxylová kyselina', 'aren + karboxylová kyselina', 'alken + ester', 'alkohol + aldehyd'],
    name: 'kyselina olejová',
    note: 'Nenasycená mastná kyselina z olivového oleje: dvojná vazba C=C v řetězci a karboxyl na konci.',
  },
  {
    id: 'b-alanine',
    kind: 'bio',
    text: '$CH3–CH(NH2)–COOH$',
    answer: 'amin + karboxylová kyselina',
    options: ['amin + karboxylová kyselina', 'amid + karboxylová kyselina', 'amin + ester', 'nitrosloučenina + karboxylová kyselina'],
    name: 'alanin',
    note: 'Každá aminokyselina má aminoskupinu –NH₂ i karboxyl –COOH; liší se jen postranním řetězcem (tady –CH₃).',
  },
  {
    id: 'b-ribose',
    kind: 'bio',
    text: '$CH2OH–(CHOH)3–CHO$',
    answer: 'aldehyd + alkohol',
    options: ['aldehyd + alkohol', 'keton + alkohol', 'karboxylová kyselina + alkohol', 'ether + alkohol'],
    name: 'ribóza (otevřená forma)',
    note: 'Ribóza je aldopentóza, cukr v nukleotidech RNA. V DNA je deoxyribóza, které chybí jedna skupina –OH.',
  },
  {
    id: 'b-phosphodiester',
    kind: 'bio',
    text: '$…–CH2–O–PO2^-–O–CH…$  (páteř DNA)',
    answer: 'ester',
    exclude: ['ether'],
    name: 'fosfodiesterová vazba',
    note: 'Nukleotidy v DNA a RNA spojuje fosfodiesterová vazba: kyselina fosforečná tvoří ester se dvěma cukry.',
  },
  {
    id: 'b-cholesterol',
    kind: 'bio',
    text: '$C27H45–OH$  (steroidní kostra)',
    answer: 'alkohol',
    exclude: ['fenol'],
    name: 'cholesterol',
    note: 'Cholesterol je steroidní alkohol: skupina –OH sedí na nasyceném uhlíku kruhu, ne na benzenovém jádře.',
  },
]

/** How many items of each kind one round of 10 takes. */
export type LevelPlan = [FgItem['kind'], number][]

/**
 * Content per level (see spec/courses/chemie/games.md):
 * L8 organic functional groups, L9 groups in biomolecules.
 * Free play ("Vše") mixes both.
 */
export const LEVELS: Record<number, LevelPlan> = {
  8: [
    ['fragment', 4],
    ['example', 6],
  ],
  9: [
    ['fragment', 2],
    ['bio', 8],
  ],
}

export const MIX_PLAN: LevelPlan = [
  ['fragment', 3],
  ['example', 3],
  ['bio', 4],
]

export function planFor(level: number | undefined): LevelPlan {
  return (level !== undefined && LEVELS[level]) || MIX_PLAN
}

export function labelOf(answer: string): string {
  return answer in CLASSES ? CLASSES[answer as ClassId].label : answer
}
