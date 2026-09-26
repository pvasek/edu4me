/**
 * Level 8: Czech organic nomenclature (as taught in src/courses/chemie/levels/l8.ts).
 *
 * `formula` is a condensed (racionální) formula as in the lessons: bonds written
 * with -, = and ≡, branches in parentheses after the carbon they hang on.
 * A ring of CH2 groups is written as its molecular formula with " (kruh)".
 * Each item carries three typical-mistake names (wrong numbering direction,
 * wrong main chain, wrong suffix…) and three wrong condensed formulas.
 * Everything is checked in organic.test.ts.
 */

export type OrgCat =
  | 'alkane'
  | 'unsaturated'
  | 'cycloalkane'
  | 'arene'
  | 'alcohol'
  | 'aldehyde'
  | 'ketone'
  | 'carboxylic'
  | 'ester'
  | 'amine'

export const ORG_CAT_LABEL: Record<OrgCat, string> = {
  alkane: 'alkan',
  unsaturated: 'alken / alkyn',
  cycloalkane: 'cykloalkan',
  arene: 'derivát benzenu',
  alcohol: 'alkohol',
  aldehyde: 'aldehyd',
  ketone: 'keton',
  carboxylic: 'karboxylová kyselina',
  ester: 'ester',
  amine: 'amin',
}

export interface OrganicItem {
  cat: OrgCat
  name: string
  /** Condensed formula, e.g. 'CH3-CH(CH3)-CH2-CH3'. */
  formula: string
  /** Molecular formula, e.g. 'C4H10'. */
  molecular: string
  /** Three typical-mistake names. */
  wrongNames: string[]
  /** Three condensed formulas of other compounds. */
  wrongFormulas: string[]
  /** Why the name is what it is (markup). */
  hint: string
}

const o = (
  cat: OrgCat,
  name: string,
  formula: string,
  molecular: string,
  wrongNames: string[],
  wrongFormulas: string[],
  hint: string,
): OrganicItem => ({ cat, name, formula, molecular, wrongNames, wrongFormulas, hint })

export const ORGANIC: OrganicItem[] = [
  // ---------------------------------------------------------------- alkany
  o('alkane', 'propan', 'CH3-CH2-CH3', 'C3H8', ['ethan', 'propen', 'butan'], ['CH3-CH3', 'CH2=CH-CH3', 'CH3-CH2-CH2-CH3'],
    'Tři uhlíky = **prop-**, jen jednoduché vazby = koncovka **-an**.'),
  o('alkane', 'butan', 'CH3-CH2-CH2-CH3', 'C4H10', ['propan', 'pentan', '2-methylpropan'], ['CH3-CH(CH3)-CH3', 'CH3-CH2-CH3', 'CH2=CH-CH2-CH3'],
    'Nerozvětvený řetězec se čtyřmi uhlíky: **butan**.'),
  o('alkane', 'hexan', 'CH3-CH2-CH2-CH2-CH2-CH3', 'C6H14', ['pentan', 'heptan', 'cyklohexan'],
    ['CH3-CH2-CH2-CH2-CH3', 'CH3-CH(CH3)-CH2-CH2-CH3', 'C6H12 (kruh)'],
    'Šest uhlíků v řadě = **hex-** + **-an**.'),
  o('alkane', '2-methylpropan', 'CH3-CH(CH3)-CH3', 'C4H10', ['1,1-dimethylethan', '2-methylbutan', 'butan'],
    ['CH3-CH2-CH2-CH3', 'CH3-CH(CH3)-CH2-CH3', 'CH3-C(CH3)2-CH3'],
    'Nejdelší řetězec má jen 3 uhlíky (propan), methyl visí na C2.'),
  o('alkane', '2-methylbutan', 'CH3-CH(CH3)-CH2-CH3', 'C5H12', ['3-methylbutan', '2-ethylpropan', '2-methylpentan'],
    ['CH3-CH2-CH2-CH2-CH3', 'CH3-C(CH3)2-CH3', 'CH3-CH(CH3)-CH2-CH2-CH3'],
    'Hlavní řetězec má 4 uhlíky. Číslujeme od konce blíž k větvi, proto **2**-methyl, ne 3-methyl.'),
  o('alkane', '2,2-dimethylpropan', 'CH3-C(CH3)2-CH3', 'C5H12', ['1,1,1-trimethylethan', '2,2-dimethylbutan', '2-methylbutan'],
    ['CH3-CH(CH3)-CH2-CH3', 'CH3-C(CH3)2-CH2-CH3', 'CH3-CH(CH3)-CH(CH3)-CH3'],
    'Nejdelší řetězec má 3 uhlíky a na prostředním visí **dva** methyly: 2,2-dimethyl.'),
  o('alkane', '3-methylpentan', 'CH3-CH2-CH(CH3)-CH2-CH3', 'C6H14', ['2-ethylbutan', '3-methylhexan', '2-methylpentan'],
    ['CH3-CH(CH3)-CH2-CH2-CH3', 'CH3-CH2-CH(CH3)-CH2-CH2-CH3', 'CH3-CH(CH3)-CH(CH3)-CH3'],
    'Hlavní řetězec má 5 uhlíků, methyl je uprostřed na C3. „2-ethylbutan“ má moc krátký řetězec.'),
  o('alkane', '2,3-dimethylbutan', 'CH3-CH(CH3)-CH(CH3)-CH3', 'C6H14', ['2,2-dimethylbutan', '2-methyl-3-methylbutan', '2,3-dimethylpentan'],
    ['CH3-C(CH3)2-CH2-CH3', 'CH3-CH(CH3)-CH2-CH2-CH3', 'CH3-CH(CH3)-CH(CH3)-CH2-CH3'],
    'Dva stejné methyly na C2 a C3 spoj předponou **di**: 2,3-dimethylbutan.'),
  o('alkane', '3-methylhexan', 'CH3-CH2-CH(CH3)-CH2-CH2-CH3', 'C7H16', ['4-methylhexan', '2-ethylpentan', '3-methylheptan'],
    ['CH3-CH(CH3)-CH2-CH2-CH2-CH3', 'CH3-CH2-CH2-CH(CH3)-CH2-CH2-CH3', 'CH3-CH2-CH(CH3)-CH2-CH3'],
    'Číslujeme od konce blíž k větvi (3, ne 4). „2-ethylpentan“ je chyba: řetězec přes ethyl je delší.'),
  o('alkane', '2,4-dimethylhexan', 'CH3-CH(CH3)-CH2-CH(CH3)-CH2-CH3', 'C8H18', ['3,5-dimethylhexan', '2,4-dimethylpentan', '2-methyl-4-ethylpentan'],
    ['CH3-CH(CH3)-CH2-CH(CH3)-CH3', 'CH3-CH(CH3)-CH(CH3)-CH2-CH2-CH3', 'CH3-C(CH3)2-CH2-CH2-CH2-CH3'],
    'Nejdelší řetězec vede přes ethyl, má 6 uhlíků. Lokanty 2,4 jsou nižší než 3,5.'),
  o('alkane', '3-ethyl-2-methylhexan', 'CH3-CH(CH3)-CH(C2H5)-CH2-CH2-CH3', 'C9H20',
    ['2-methyl-3-ethylhexan', '4-ethyl-5-methylhexan', '3-ethyl-2-methylpentan'],
    ['CH3-CH(CH3)-CH(C2H5)-CH2-CH3', 'CH3-CH(CH3)-CH2-CH(C2H5)-CH2-CH3', 'CH3-C(CH3)2-CH(CH3)-CH2-CH3'],
    'Větve se řadí **abecedně**: ethyl před methyl. Číslování zleva dává lokanty 2 a 3.'),
  o('alkane', '2,2,4-trimethylpentan', 'CH3-C(CH3)2-CH2-CH(CH3)-CH3', 'C8H18', ['2,4,4-trimethylpentan', 'oktan', '2,2,4-trimethylhexan'],
    ['CH3-CH2-CH2-CH2-CH2-CH2-CH2-CH3', 'CH3-C(CH3)2-CH2-CH2-CH3', 'CH3-CH(CH3)-CH2-CH(CH3)-CH3'],
    'Isooktan: pentan se třemi methyly. Lokanty 2,2,4 jsou nižší než 2,4,4.'),

  // --------------------------------------------------- alkeny a alkyny
  o('unsaturated', 'ethen', 'CH2=CH2', 'C2H4', ['ethan', 'ethyn', 'propen'], ['CH3-CH3', 'CH≡CH', 'CH2=CH-CH3'],
    'Dva uhlíky s dvojnou vazbou: **eth-** + **-en** (ethylen).'),
  o('unsaturated', 'propen', 'CH2=CH-CH3', 'C3H6', ['prop-2-en', 'propan', 'propyn'], ['CH3-CH2-CH3', 'CH≡C-CH3', 'CH2=CH-CH2-CH3'],
    'Tři uhlíky, dvojná vazba: propen. Jiná poloha dvojné vazby tu není, lokant se nepíše.'),
  o('unsaturated', 'but-1-en', 'CH2=CH-CH2-CH3', 'C4H8', ['but-3-en', 'but-2-en', 'butan'],
    ['CH3-CH=CH-CH3', 'CH3-CH2-CH2-CH3', 'CH≡C-CH2-CH3'],
    'Dvojná vazba dostane co nejnižší lokant: začíná na C1, proto **but-1-en**.'),
  o('unsaturated', 'but-2-en', 'CH3-CH=CH-CH3', 'C4H8', ['but-1-en', 'but-2-yn', 'butan'],
    ['CH2=CH-CH2-CH3', 'CH3-C≡C-CH3', 'CH2=CH-CH=CH2'],
    'Dvojná vazba mezi C2 a C3 uprostřed řetězce: but-2-en.'),
  o('unsaturated', 'pent-2-en', 'CH3-CH=CH-CH2-CH3', 'C5H10', ['pent-3-en', 'pent-2-yn', 'but-2-en'],
    ['CH2=CH-CH2-CH2-CH3', 'CH3-C≡C-CH2-CH3', 'CH3-CH=CH-CH3'],
    'Číslujeme zleva, aby dvojná vazba dostala lokant 2, ne 3.'),
  o('unsaturated', 'hex-2-en', 'CH3-CH=CH-CH2-CH2-CH3', 'C6H12', ['hex-4-en', 'hex-3-en', 'pent-2-en'],
    ['CH3-CH2-CH=CH-CH2-CH3', 'CH2=CH-CH2-CH2-CH2-CH3', 'CH3-CH=CH-CH2-CH3'],
    'Šest uhlíků, dvojná vazba od C2 (zleva), ne od C4 (zprava).'),
  o('unsaturated', '4-methylpent-2-en', 'CH3-CH(CH3)-CH=CH-CH3', 'C6H12', ['2-methylpent-3-en', '4-methylpent-3-en', '4-methylhex-2-en'],
    ['CH3-C(CH3)=CH-CH2-CH3', 'CH2=CH-CH(CH3)-CH2-CH3', 'CH3-CH(CH3)-C≡C-CH3'],
    'Dvojná vazba má přednost před větví: číslujeme zprava (lokant 2), methyl je pak na C4.'),
  o('unsaturated', 'buta-1,3-dien', 'CH2=CH-CH=CH2', 'C4H6', ['but-1,3-dien', 'buta-2,4-dien', 'but-1-en'],
    ['CH2=CH-CH2-CH3', 'CH≡C-C≡CH', 'CH2=C=CH-CH3'],
    'Dvě dvojné vazby = **-dien**, před ní se vkládá „a“: buta-1,3-dien.'),
  o('unsaturated', 'ethyn', 'CH≡CH', 'C2H2', ['ethen', 'ethan', 'propyn'], ['CH2=CH2', 'CH3-CH3', 'CH≡C-CH3'],
    'Trojná vazba = koncovka **-yn**. Ethyn je acetylen.'),
  o('unsaturated', 'propyn', 'CH≡C-CH3', 'C3H4', ['prop-2-yn', 'propen', 'ethyn'], ['CH2=CH-CH3', 'CH≡CH', 'CH≡C-CH2-CH3'],
    'Tři uhlíky s trojnou vazbou: propyn, lokant se nepíše.'),
  o('unsaturated', 'but-1-yn', 'CH≡C-CH2-CH3', 'C4H6', ['but-3-yn', 'but-2-yn', 'but-1-en'],
    ['CH3-C≡C-CH3', 'CH2=CH-CH2-CH3', 'CH≡C-CH3'],
    'Trojná vazba začíná na C1: but-1-yn.'),
  o('unsaturated', 'but-2-yn', 'CH3-C≡C-CH3', 'C4H6', ['but-1-yn', 'but-2-en', 'butan'],
    ['CH≡C-CH2-CH3', 'CH3-CH=CH-CH3', 'CH3-C≡C-CH2-CH3'],
    'Trojná vazba uprostřed mezi C2 a C3: but-2-yn.'),

  // ----------------------------------------------------------- cykloalkany
  o('cycloalkane', 'cyklohexan', 'C6H12 (kruh)', 'C6H12', ['hexan', 'hex-1-en', 'benzen'],
    ['CH3-CH2-CH2-CH2-CH2-CH3', 'CH2=CH-CH2-CH2-CH2-CH3', 'C6H6'],
    'Šest skupin $CH2$ v kruhu: předpona **cyklo-** + hexan. Obecně $C_{n}H_{2n}$.'),
  o('cycloalkane', 'cyklopentan', 'C5H10 (kruh)', 'C5H10', ['pentan', 'cyklohexan', 'pent-1-en'],
    ['CH3-CH2-CH2-CH2-CH3', 'C6H12 (kruh)', 'CH2=CH-CH2-CH2-CH3'],
    'Pět uhlíků v kruhu: cyklopentan, $C5H10$.'),
  o('cycloalkane', 'cyklopropan', 'C3H6 (kruh)', 'C3H6', ['propen', 'propan', 'cyklobutan'],
    ['CH2=CH-CH3', 'CH3-CH2-CH3', 'C4H8 (kruh)'],
    'Trojúhelník ze tří uhlíků: cyklopropan. Má stejný souhrnný vzorec jako propen.'),
  o('cycloalkane', 'methylcyklohexan', 'C6H11-CH3', 'C7H14', ['methylbenzen', 'heptan', 'ethylcyklohexan'],
    ['C6H5-CH3', 'CH3-CH2-CH2-CH2-CH2-CH2-CH3', 'C6H11-CH2-CH3'],
    'Kruh $C6H11-$ (cyklohexyl) nese jeden methyl. $C6H5-$ by byl benzenový kruh.'),

  // ---------------------------------------------------- deriváty benzenu
  o('arene', 'benzen', 'C6H6', 'C6H6', ['cyklohexan', 'benzin', 'hexan'],
    ['C6H12 (kruh)', 'C6H5-CH3', 'CH3-CH2-CH2-CH2-CH2-CH3'],
    'Benzen je aromatický kruh $C6H6$. Benzin je směs uhlovodíků z ropy.'),
  o('arene', 'methylbenzen', 'C6H5-CH3', 'C7H8', ['methylcyklohexan', 'ethylbenzen', 'dimethylbenzen'],
    ['C6H11-CH3', 'C6H5-CH2-CH3', 'C6H5-OH'],
    'Fenyl $C6H5-$ s methylem: methylbenzen, triviálně **toluen**.'),
  o('arene', 'ethylbenzen', 'C6H5-CH2-CH3', 'C8H10', ['methylbenzen', 'ethylcyklohexan', 'vinylbenzen'],
    ['C6H5-CH=CH2', 'C6H5-CH3', 'C6H11-CH2-CH3'],
    'Na benzenovém jádře visí ethyl $-CH2-CH3$.'),
  o('arene', 'chlorbenzen', 'C6H5-Cl', 'C6H5Cl', ['chlorcyklohexan', 'chlorid fenylnatý', 'chlormethan'],
    ['C6H11-Cl', 'C6H5-CH2-Cl', 'CH3-Cl'],
    'Halogen se v organice píše jen předponou: **chlor**benzen.'),
  o('arene', 'nitrobenzen', 'C6H5-NO2', 'C6H5NO2', ['fenylamin', 'nitrocyklohexan', 'dusičnan fenylu'],
    ['C6H5-NH2', 'C6H11-NO2', 'C6H5-CH2-NO2'],
    'Skupina $-NO2$ = předpona **nitro-**. Vzniká nitrací benzenu.'),

  // -------------------------------------------------------------- alkoholy
  o('alcohol', 'methanol', 'CH3-OH', 'CH4O', ['methanal', 'ethanol', 'methan'], ['HCHO', 'CH3-CH2-OH', 'CH3-O-CH3'],
    'Jeden uhlík + skupina $-OH$ = přípona **-ol**: methanol (jedovatý!).'),
  o('alcohol', 'ethanol', 'CH3-CH2-OH', 'C2H6O', ['ethanal', 'methanol', 'kyselina ethanová'], ['CH3-CHO', 'CH3-OH', 'CH3-COOH'],
    'Dva uhlíky + $-OH$: ethanol. $-CHO$ by byl ethanal (aldehyd).'),
  o('alcohol', 'propan-1-ol', 'CH3-CH2-CH2-OH', 'C3H8O', ['propan-3-ol', 'propan-2-ol', 'propanal'],
    ['CH3-CH(OH)-CH3', 'CH3-CH2-CHO', 'CH3-CH2-CH2-CH2-OH'],
    'Skupina $-OH$ je na konci řetězce; číslujeme od ní, lokant 1.'),
  o('alcohol', 'propan-2-ol', 'CH3-CH(OH)-CH3', 'C3H8O', ['propan-1-ol', 'propanon', 'butan-2-ol'],
    ['CH3-CH2-CH2-OH', 'CH3-CO-CH3', 'CH3-CH(OH)-CH2-CH3'],
    'Skupina $-OH$ na prostředním uhlíku: propan-**2**-ol (sekundární alkohol).'),
  o('alcohol', 'butan-2-ol', 'CH3-CH(OH)-CH2-CH3', 'C4H10O', ['butan-3-ol', 'butan-1-ol', 'butanon'],
    ['CH3-CH2-CH2-CH2-OH', 'CH3-CO-CH2-CH3', 'CH3-C(OH)(CH3)-CH3'],
    'Číslujeme od konce bližšího ke skupině $-OH$: lokant 2, ne 3.'),
  o('alcohol', '2-methylpropan-2-ol', 'CH3-C(OH)(CH3)-CH3', 'C4H10O', ['2-methylpropan-1-ol', 'butan-2-ol', '1,1-dimethylethanol'],
    ['CH3-CH(CH3)-CH2-OH', 'CH3-CH(OH)-CH2-CH3', 'CH3-CH2-CH2-CH2-OH'],
    'Hlavní řetězec má 3 uhlíky, na C2 je methyl i $-OH$: terciární alkohol.'),
  o('alcohol', 'ethan-1,2-diol', 'HO-CH2-CH2-OH', 'C2H6O2', ['ethan-1,1-diol', 'ethanol', 'propan-1,2,3-triol'],
    ['CH3-CH2-OH', 'HO-CH2-CH(OH)-CH2-OH', 'HOOC-COOH'],
    'Dvě skupiny $-OH$ = **-diol**, každá má svůj lokant (ethylenglykol).'),
  o('alcohol', 'propan-1,2,3-triol', 'HO-CH2-CH(OH)-CH2-OH', 'C3H8O3', ['propan-1,2-diol', 'ethan-1,2-diol', 'propan-2-ol'],
    ['HO-CH2-CH2-OH', 'CH3-CH(OH)-CH2-OH', 'CH3-CH(OH)-CH3'],
    'Tři skupiny $-OH$ na třech uhlících: glycerol.'),
  o('alcohol', 'cyklohexanol', 'C6H11-OH', 'C6H12O', ['fenol', 'hexan-1-ol', 'cyklohexylmethanol'],
    ['C6H5-OH', 'CH3-CH2-CH2-CH2-CH2-CH2-OH', 'C6H11-CH2-OH'],
    'Skupina $-OH$ na nasyceném kruhu = alkohol. Na benzenovém jádře by to byl fenol.'),
  o('alcohol', 'fenol', 'C6H5-OH', 'C6H6O', ['cyklohexanol', 'benzylalkohol', 'methylbenzen'],
    ['C6H11-OH', 'C6H5-CH2-OH', 'C6H5-CH3'],
    'Skupina $-OH$ přímo na benzenovém jádře: fenol (slabá kyselina).'),

  // -------------------------------------------------------------- aldehydy
  o('aldehyde', 'methanal', 'HCHO', 'CH2O', ['methanol', 'ethanal', 'kyselina methanová'], ['CH3-OH', 'HCOOH', 'CH3-CHO'],
    'Skupina $-CHO$ = přípona **-al**. Methanal je formaldehyd.'),
  o('aldehyde', 'ethanal', 'CH3-CHO', 'C2H4O', ['ethanol', 'methanal', 'ethanon'], ['CH3-CH2-OH', 'CH3-COOH', 'CH3-CO-CH3'],
    'Uhlík skupiny $-CHO$ se do řetězce počítá: 2 uhlíky = ethanal (acetaldehyd).'),
  o('aldehyde', 'propanal', 'CH3-CH2-CHO', 'C3H6O', ['propanon', 'propan-1-ol', 'butanal'],
    ['CH3-CO-CH3', 'CH3-CH2-CH2-OH', 'CH3-CH2-COOH'],
    'Karbonyl na konci řetězce = aldehyd (**-al**), uvnitř by to byl keton (-on).'),
  o('aldehyde', 'butanal', 'CH3-CH2-CH2-CHO', 'C4H8O', ['butanon', 'propanal', 'butan-1-ol'],
    ['CH3-CO-CH2-CH3', 'CH3-CH2-CH2-COOH', 'CH3-CH2-CHO'],
    'Čtyři uhlíky včetně uhlíku skupiny $-CHO$: butanal.'),
  o('aldehyde', 'benzaldehyd', 'C6H5-CHO', 'C7H6O', ['fenol', 'benzylalkohol', 'kyselina benzoová'],
    ['C6H5-COOH', 'C6H5-CH2-OH', 'C6H5-CO-CH3'],
    'Skupina $-CHO$ na benzenovém jádře: benzaldehyd voní po mandlích.'),

  // ---------------------------------------------------------------- ketony
  o('ketone', 'propanon', 'CH3-CO-CH3', 'C3H6O', ['propanal', 'propan-2-ol', 'ethanon'],
    ['CH3-CH2-CHO', 'CH3-CH(OH)-CH3', 'CH3-CO-CH2-CH3'],
    'Karbonyl $-CO-$ uvnitř řetězce = keton, přípona **-on**. Propanon je aceton.'),
  o('ketone', 'butanon', 'CH3-CO-CH2-CH3', 'C4H8O', ['butanal', 'butan-2-ol', 'propanon'],
    ['CH3-CH2-CH2-CHO', 'CH3-CH(OH)-CH2-CH3', 'CH3-CO-CH3'],
    'Čtyři uhlíky, karbonyl uvnitř: butanon. Jiný keton se 4 uhlíky neexistuje, lokant netřeba.'),
  o('ketone', 'pentan-2-on', 'CH3-CO-CH2-CH2-CH3', 'C5H10O', ['pentan-4-on', 'pentan-3-on', 'pentanal'],
    ['CH3-CH2-CO-CH2-CH3', 'CH3-CH2-CH2-CH2-CHO', 'CH3-CH(OH)-CH2-CH2-CH3'],
    'Číslujeme od konce bližšího ke karbonylu: lokant 2, ne 4.'),
  o('ketone', 'pentan-3-on', 'CH3-CH2-CO-CH2-CH3', 'C5H10O', ['pentan-2-on', 'pentanal', 'pentan-3-ol'],
    ['CH3-CO-CH2-CH2-CH3', 'CH3-CH2-CH(OH)-CH2-CH3', 'CH3-CH2-CH2-CH2-CHO'],
    'Karbonyl přesně uprostřed pětiuhlíkatého řetězce: pentan-3-on.'),

  // -------------------------------------------------- karboxylové kyseliny
  o('carboxylic', 'kyselina methanová', 'HCOOH', 'CH2O2', ['kyselina ethanová', 'methanal', 'methanol'], ['CH3-COOH', 'HCHO', 'CH3-OH'],
    'Jeden uhlík se skupinou $-COOH$: kyselina methanová (mravenčí).'),
  o('carboxylic', 'kyselina ethanová', 'CH3-COOH', 'C2H4O2', ['kyselina methanová', 'ethanal', 'kyselina propanová'],
    ['HCOOH', 'CH3-CHO', 'CH3-CH2-COOH'],
    'Uhlík karboxylu se počítá: 2 uhlíky = kyselina ethanová (octová).'),
  o('carboxylic', 'kyselina propanová', 'CH3-CH2-COOH', 'C3H6O2', ['kyselina ethanová', 'kyselina butanová', 'propanal'],
    ['CH3-COOH', 'CH3-CH2-CHO', 'CH3-CH2-CH2-COOH'],
    'Tři uhlíky včetně karboxylu: kyselina propanová.'),
  o('carboxylic', 'kyselina butanová', 'CH3-CH2-CH2-COOH', 'C4H8O2', ['kyselina propanová', 'kyselina pentanová', 'butanal'],
    ['CH3-CH2-COOH', 'CH3-CH2-CH2-CH2-COOH', 'CH3-CH2-CH2-CHO'],
    'Nezapomeň započítat uhlík karboxylu: 4 uhlíky = kyselina butanová (máselná).'),
  o('carboxylic', 'kyselina benzoová', 'C6H5-COOH', 'C7H6O2', ['benzaldehyd', 'fenol', 'kyselina ethanová'],
    ['C6H5-CHO', 'C6H5-OH', 'C6H5-CH2-COOH'],
    'Karboxyl na benzenovém jádře: kyselina benzoová, konzervant E 210.'),
  o('carboxylic', 'kyselina ethandiová', 'HOOC-COOH', 'C2H2O4', ['kyselina ethanová', 'ethan-1,2-diol', 'kyselina methanová'],
    ['CH3-COOH', 'HO-CH2-CH2-OH', 'HOOC-CH2-COOH'],
    'Dva karboxyly spojené spolu: kyselina ethan**di**ová (šťavelová).'),

  // ---------------------------------------------------------------- estery
  o('ester', 'ethyl-ethanoát', 'CH3-COO-CH2-CH3', 'C4H8O2', ['methyl-propanoát', 'ethyl-methanoát', 'ethanoát ethylnatý'],
    ['CH3-CH2-COO-CH3', 'HCOO-CH2-CH3', 'CH3-COO-CH3'],
    'Nejdřív alkyl z alkoholu (**ethyl**), pak anion kyseliny (**ethanoát**): ethyl-ethanoát.'),
  o('ester', 'methyl-ethanoát', 'CH3-COO-CH3', 'C3H6O2', ['ethyl-methanoát', 'methyl-methanoát', 'ethyl-ethanoát'],
    ['HCOO-CH2-CH3', 'CH3-COO-CH2-CH3', 'HCOO-CH3'],
    'Část $CH3-COO-$ je z kyseliny ethanové, $-CH3$ z methanolu: methyl-ethanoát.'),
  o('ester', 'ethyl-methanoát', 'HCOO-CH2-CH3', 'C3H6O2', ['methyl-ethanoát', 'ethyl-ethanoát', 'kyselina propanová'],
    ['CH3-COO-CH3', 'CH3-CH2-COOH', 'CH3-COO-CH2-CH3'],
    '$HCOO-$ pochází z kyseliny methanové (methanoát), ethyl z ethanolu.'),
  o('ester', 'ethyl-butanoát', 'CH3-CH2-CH2-COO-CH2-CH3', 'C6H12O2', ['butyl-ethanoát', 'ethyl-propanoát', 'ethyl-pentanoát'],
    ['CH3-COO-CH2-CH2-CH2-CH3', 'CH3-CH2-COO-CH2-CH3', 'CH3-CH2-CH2-COO-CH3'],
    'Kyselinová část má 4 uhlíky (butanoát), alkoholová 2 (ethyl). Voní po ananasu.'),
  o('ester', 'propyl-ethanoát', 'CH3-COO-CH2-CH2-CH3', 'C5H10O2', ['ethyl-propanoát', 'propyl-methanoát', 'methyl-butanoát'],
    ['CH3-CH2-COO-CH2-CH3', 'HCOO-CH2-CH2-CH3', 'CH3-COO-CH2-CH3'],
    'Kyselina ethanová dá **ethanoát**, propan-1-ol dá **propyl**.'),

  // ----------------------------------------------------------------- aminy
  o('amine', 'methylamin', 'CH3-NH2', 'CH5N', ['dimethylamin', 'ethylamin', 'methanol'], ['CH3-NH-CH3', 'CH3-CH2-NH2', 'CH3-OH'],
    'Amoniak, ve kterém je jeden vodík nahrazený methylem: methyl + **amin**.'),
  o('amine', 'ethylamin', 'CH3-CH2-NH2', 'C2H7N', ['dimethylamin', 'methylamin', 'ethanol'], ['CH3-NH-CH3', 'CH3-NH2', 'CH3-CH2-OH'],
    'Na dusíku visí jeden ethyl: ethylamin (primární amin).'),
  o('amine', 'dimethylamin', 'CH3-NH-CH3', 'C2H7N', ['ethylamin', 'trimethylamin', 'methylamin'],
    ['CH3-CH2-NH2', 'CH3-N(CH3)-CH3', 'CH3-NH2'],
    'Na dusíku visí **dva** methyly: dimethylamin (sekundární amin).'),
  o('amine', 'trimethylamin', 'CH3-N(CH3)-CH3', 'C3H9N', ['propylamin', 'dimethylamin', 'triethylamin'],
    ['CH3-CH2-CH2-NH2', 'CH3-NH-CH3', 'CH3-CH2-N(CH2-CH3)-CH2-CH3'],
    'Tři methyly na dusíku: trimethylamin (terciární amin), páchne po rybách.'),
  o('amine', 'fenylamin', 'C6H5-NH2', 'C6H7N', ['nitrobenzen', 'benzylamin', 'cyklohexylamin'],
    ['C6H5-NO2', 'C6H5-CH2-NH2', 'C6H11-NH2'],
    'Skupina $-NH2$ na benzenovém jádře: fenylamin, triviálně **anilin**.'),
]
