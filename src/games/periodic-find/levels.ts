/**
 * Najdi prvek – content set per level (see spec/courses/chemie/games.md).
 *
 * Every prompt names one element (`answer`). Prompts with a `test` predicate are
 * checked by unit tests: exactly the answer may pass it among all 118 elements.
 * Descriptive clues (uses, occurrence, lesson facts) have no predicate; they are
 * checked for not giving the answer's name or symbol away.
 * Texts use the <Md> markup ($X2O3$, $M^{2+}$).
 */
import { BY_SYMBOL, CATEGORY_LABEL, ELEMENTS, simpleShells, type ChemElement, type ElementCategory } from '../../courses/chemie/data/elements'
import { valenceElectrons } from '../../courses/chemie/data/electronConfig'
import { inPeriod } from '../shared/util'

export type PromptKind = 'name' | 'symbol' | 'hint'

export interface FindPrompt {
  /** Symbol of the element to find. */
  answer: string
  kind: PromptKind
  /** Prompt text (<Md> markup). */
  text: string
  /** Kind of clue, used to vary a round ("z", "pos", "ion"…). */
  tag?: string
  /** Exactly the answer passes this among all elements. */
  test?: (e: ChemElement) => boolean
  /** Short explanation shown after the prompt is solved (<Md> markup). */
  why?: string
}

type Pred = (e: ChemElement) => boolean

// ───────────────────────────── predicates

const METALS = new Set<ElementCategory>(['alkali', 'alkaline', 'transition', 'post', 'lanthanide', 'actinide'])
export const isMetal: Pred = (e) => METALS.has(e.category)
export const isMainGroup: Pred = (e) => e.group !== null && (e.group <= 2 || e.group >= 13)
const all =
  (...ps: Pred[]): Pred =>
  (e) =>
    ps.every((p) => p(e))
const period =
  (p: number): Pred =>
  (e) =>
    e.period === p
const group =
  (g: number): Pred =>
  (e) =>
    e.group === g
const at = (p: number, g: number): Pred => all(period(p), group(g))
const category =
  (c: ElementCategory): Pred =>
  (e) =>
    e.category === c
const enIs =
  (x: number): Pred =>
  (e) =>
    e.en !== null && Math.abs(e.en - x) < 0.001
/** The element with the highest (or lowest) electronegativity among those passing `scope`. */
function enExtreme(scope: Pred, dir: 'max' | 'min'): Pred {
  const vals = ELEMENTS.filter((e) => scope(e) && e.en !== null).map((e) => e.en!)
  const target = dir === 'max' ? Math.max(...vals) : Math.min(...vals)
  return (e) => scope(e) && e.en === target
}

/**
 * Charge of the simple ion a main-group element forms (lessons l2-4 and l3-3):
 * groups 1, 2 and the metals of group 13 give cations, groups 15–17 (non-metals) anions.
 */
export function mainIonCharge(e: ChemElement): number | null {
  if (!isMainGroup(e) || e.symbol === 'H') return null
  if (e.group === 1) return 1
  if (e.group === 2) return 2
  if (e.group === 13) return isMetal(e) ? 3 : null
  if (e.category !== 'nonmetal' && e.category !== 'halogen') return null
  if (e.group === 15) return -3
  if (e.group === 16) return -2
  if (e.group === 17) return -1
  return null
}
const ionIs =
  (q: number): Pred =>
  (e) =>
    mainIonCharge(e) === q

/** Beketov reactivity series as taught in l6-2 (left = least noble). */
export const SERIES = ['Li', 'K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Mn', 'Zn', 'Cr', 'Fe', 'Cd', 'Co', 'Ni', 'Sn', 'Pb', 'H', 'Cu', 'Ag', 'Hg', 'Au']
const seriesAt =
  (i: number): Pred =>
  (e) =>
    SERIES.indexOf(e.symbol) === (i < 0 ? SERIES.length + i : i)
const seriesBetween =
  (a: string, b: string): Pred =>
  (e) => {
    const i = SERIES.indexOf(e.symbol)
    return i > SERIES.indexOf(a) && i < SERIES.indexOf(b)
  }

// ───────────────────────────── level 2: generated from the element data

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many)
const shellsLast = (z: number) => {
  const s = simpleShells(z)
  return s[s.length - 1]
}
/** "s 5 valenčními elektrony", "se 2 valenčními elektrony", "s 1 valenčním elektronem" */
function withValence(v: number): string {
  if (v === 1) return 's 1 valenčním elektronem'
  return `${[2, 3, 4, 6, 7].includes(v) ? 'se' : 's'} ${v} valenčními elektrony`
}

export const L2_POOL = [
  ...ELEMENTS.filter((e) => e.z <= 20).map((e) => e.symbol),
  'Fe',
  'Cu',
  'Zn',
  'Br',
  'Ag',
  'I',
  'Au',
  'Hg',
  'Pb',
]

/** Categories taught by name in l2-6 (hint "Halogen ve 3. periodě"). */
const L2_CATEGORIES: ElementCategory[] = ['alkali', 'alkaline', 'metalloid', 'halogen', 'noble']

function level2(): FindPrompt[] {
  const out: FindPrompt[] = []
  for (const sym of L2_POOL) {
    const e = BY_SYMBOL[sym]
    out.push({ answer: sym, kind: 'name', text: e.name, tag: 'name' })
    out.push({ answer: sym, kind: 'symbol', text: e.symbol, tag: 'symbol' })
    out.push({
      answer: sym,
      kind: 'hint',
      tag: 'z',
      text: `Prvek s protonovým číslem ${e.z}`,
      test: (x) => x.z === e.z,
      why: `Protonové číslo $Z = ${e.z}$: jádro má ${e.z} ${e.z === 1 ? 'proton' : e.z <= 4 ? 'protony' : 'protonů'}.`,
    })
    if (e.group !== null) {
      out.push({
        answer: sym,
        kind: 'hint',
        tag: 'pos',
        text: `Prvek ${inPeriod(e.period)} a ${e.group}. skupině`,
        test: at(e.period, e.group),
        why: `Perioda je řádek, skupina sloupec: ${e.period}. řádek, ${e.group}. sloupec.`,
      })
    }
    if (L2_CATEGORIES.includes(e.category) && ELEMENTS.filter((x) => x.period === e.period && x.category === e.category).length === 1) {
      out.push({
        answer: sym,
        kind: 'hint',
        tag: 'cat',
        text: `${cap(CATEGORY_LABEL[e.category])} ${inPeriod(e.period)}`,
        test: all(category(e.category), period(e.period)),
        why: `${cap(CATEGORY_LABEL[e.category])}, ${e.group}. skupina, ${e.period}. perioda.`,
      })
    }
    if (isMainGroup(e) && e.z !== 2 && e.z <= 36) {
      const v = valenceElectrons(e.z)
      out.push({
        answer: sym,
        kind: 'hint',
        tag: 'val',
        text: `Prvek ${withValence(v)} ${inPeriod(e.period)}`,
        test: (x) => isMainGroup(x) && x.period === e.period && x.z !== 2 && valenceElectrons(x.z) === v,
        why: `${e.group}. skupina = ${v} ${plural(v, 'valenční elektron', 'valenční elektrony', 'valenčních elektronů')}, ${e.period}. perioda = ${e.period} ${plural(e.period, 'elektronová vrstva', 'elektronové vrstvy', 'elektronových vrstev')}.`,
      })
    }
    if (e.z > 2 && e.z <= 20) {
      const shells = simpleShells(e.z).join(', ')
      out.push({
        answer: sym,
        kind: 'hint',
        tag: 'shell',
        text: `Atom s elektronovými vrstvami ${shells}`,
        test: (x) => x.z <= 20 && simpleShells(x.z).join(', ') === shells,
        why: `Elektronů je celkem ${e.z}, tedy $Z = ${e.z}$; valenční vrstva jich má ${shellsLast(e.z)}.`,
      })
    }
  }
  return out
}

// ───────────────────────────── hand-written clue sets

const h = (answer: string, text: string, tag: string, test?: Pred, why?: string): FindPrompt => ({
  answer,
  kind: 'hint',
  text,
  tag,
  test,
  why,
})

/** Level 3: electronegativity, ions, bond types, oxidation numbers and binary compounds. */
const L3: FindPrompt[] = [
  h('F', 'Nejelektronegativnější prvek', 'en', enExtreme(() => true, 'max'), 'Fluor má elektronegativitu 3,98, nejvyšší ze všech prvků.'),
  h('O', 'Prvek s elektronegativitou 3,44', 'en', enIs(3.44), 'Kyslík (3,44) je po fluoru druhý nejelektronegativnější.'),
  h('Cl', 'Prvek s elektronegativitou 3,16', 'en', enIs(3.16), 'Chlor: 3,16, třetí nejvyšší hodnota.'),
  h('N', 'Prvek s elektronegativitou 3,04', 'en', enIs(3.04), 'Dusík: 3,04, čtvrtý nejelektronegativnější prvek.'),
  h('Na', 'Kov s elektronegativitou 0,93', 'en', all(isMetal, enIs(0.93)), 'Sodík: 0,93. S chlorem proto tvoří iontovou vazbu (ΔX = 2,23).'),
  h('Ca', 'Kov s elektronegativitou 1,00', 'en', all(isMetal, enIs(1.0)), 'Vápník: 1,00, kov alkalických zemin ve 4. periodě.'),
  h('Mg', 'Kov s elektronegativitou 1,31', 'en', all(isMetal, enIs(1.31)), 'Hořčík: 1,31.'),
  h('Li', 'Prvek 2. periody s nejnižší elektronegativitou', 'en', enExtreme(period(2), 'min'), 'V periodě elektronegativita roste zleva doprava, nejnižší má lithium (0,98).'),
  h('Na', 'Prvek 3. periody s nejnižší elektronegativitou', 'en', enExtreme(period(3), 'min'), 'Sodík stojí ve 3. periodě úplně vlevo (0,93).'),
  h('Cl', 'Prvek 3. periody s nejvyšší elektronegativitou', 'en', enExtreme(period(3), 'max'), 'Vzácné plyny nepočítáme, takže vede chlor (3,16).'),
  h('F', 'Prvek 2. periody, jehož vazba s vodíkem je ze všech nejpolárnější', 'bond', enExtreme(period(2), 'max'), 'Ve fluorovodíku je ΔX = 3,98 − 2,20 = 1,78.'),
  h('K', 'Kov 4. periody, jehož vazba s chlorem má ΔX = 2,34', 'bond', all(isMetal, period(4), enIs(3.16 - 2.34)), 'Draslík: 3,16 − 0,82 = 2,34, iontová vazba.'),
  h('H', 'Nekov, jehož vazba s chlorem má ΔX = 0,96 (polární kovalentní)', 'bond', all(category('nonmetal'), enIs(3.16 - 0.96)), 'Vodík (2,20): v chlorovodíku nese δ+.'),
  h('Br', 'Halogen, který tvoří anion $X^-$ ve 4. periodě', 'ion', all(category('halogen'), period(4)), 'Brom přijme 1 elektron a vznikne bromidový anion $Br^-$.'),
  h('I', 'Halogen, který tvoří anion $X^-$ v 5. periodě', 'ion', all(category('halogen'), period(5)), 'Jod tvoří jodidový anion $I^-$.'),
  h('Mg', 'Kov hlavní skupiny, který tvoří kation $M^{2+}$ ve 3. periodě', 'ion', all(isMetal, period(3), ionIs(2)), 'Hořčík odevzdá 2 valenční elektrony: $Mg^{2+}$ má konfiguraci neonu.'),
  h('Al', 'Kov, který tvoří kation $M^{3+}$ ve 3. periodě', 'ion', all(isMetal, period(3), ionIs(3)), 'Hliník ztratí 3 valenční elektrony: $Al^{3+}$.'),
  h('K', 'Prvek s-bloku, který tvoří kation $M^+$ ve 4. periodě', 'ion', all((e) => e.block === 's', period(4), ionIs(1)), 'Draslík: $K^+$ má konfiguraci argonu.'),
  h('Li', 'Prvek, který ve 2. periodě tvoří kation $M^+$', 'ion', all(period(2), ionIs(1)), 'Lithium: $Li^+$ má konfiguraci helia.'),
  h('N', 'Nekov 2. periody, který tvoří anion $X^{3-}$', 'ion', all(period(2), ionIs(-3)), 'Dusík přijme 3 elektrony: nitridový anion $N^{3-}$.'),
  h('P', 'Nekov 3. periody, který tvoří anion $X^{3-}$', 'ion', all(period(3), ionIs(-3)), 'Fosfor v 15. skupině: $P^{3-}$.'),
  h('S', 'Prvek 3. periody, který tvoří anion $X^{2-}$', 'ion', all(period(3), ionIs(-2)), 'Síra přijme 2 elektrony: sulfidový anion $S^{2-}$.'),
  h('O', 'Prvek 2. periody, který tvoří anion $X^{2-}$', 'ion', all(period(2), ionIs(-2)), 'Kyslík: oxidový anion $O^{2-}$.'),
  h('Si', 'Prvek 3. periody, jehož oxid $XO2$ tvoří atomovou krystalovou mřížku', 'oxide', at(3, 14), 'Oxid křemičitý $SiO2$ (křemen) nemá molekuly, je to atomová krystalová mřížka.'),
  h('C', 'Nekov 2. periody, jehož oxid $XO2$ tvoří malé lineární molekuly', 'oxide', at(2, 14), 'Oxid uhličitý $O=C=O$ je lineární a nepolární.'),
  h('S', 'Prvek 3. periody, jehož oxid s nejvyšším oxidačním číslem má vzorec $XO3$', 'oxide', at(3, 16), 'Oxid sírový $SO3$: síra má oxidační číslo VI.'),
  h('Cl', 'Prvek 3. periody, jehož oxid s nejvyšším oxidačním číslem má vzorec $X2O7$', 'oxide', at(3, 17), 'Oxid chloristý $Cl2O7$: chlor má VII.'),
  h('N', 'Prvek 2. periody, jehož oxid s oxidačním číslem V má vzorec $X2O5$', 'oxide', at(2, 15), 'Oxid dusičný $N2O5$.'),
  h('Al', 'Kov 3. periody, jehož oxid má vzorec $X2O3$', 'oxide', all(isMetal, period(3), group(13)), 'Oxid hlinitý $Al2O3$: $Al^{III}$ a $O^{-II}$, křížové pravidlo.'),
  h('Ca', 'Kov 4. periody, jehož oxid $XO$ se jmenuje pálené vápno', 'oxide', at(4, 2), 'Pálené vápno je oxid vápenatý $CaO$.'),
  h('Mg', 'Kov 2. skupiny ve 3. periodě, jehož nitrid má vzorec $M3N2$', 'oxide', at(3, 2), 'Nitrid hořečnatý $Mg3N2$: 3 · (+2) = 2 · (−3) v absolutní hodnotě.'),
  h('Na', 'Kov 1. skupiny ve 3. periodě, jehož chlorid je kuchyňská sůl', 'bond', at(3, 1), 'Chlorid sodný $NaCl$ tvoří iontovou mřížku.'),
  h('O', 'Prvek 16. skupiny, jehož hydrid $H2X$ má díky vodíkovým vazbám nejvyšší teplotu varu', 'bond', at(2, 16), 'Voda vře při 100 °C, sulfan $H2S$ už při −60 °C.'),
  h('N', 'Prvek 2. periody, jehož molekula $X2$ má trojnou vazbu', 'bond', at(2, 15), 'Molekula $N≡N$ je velmi pevná.'),
  h('C', 'Prvek 2. periody, jehož atom tvoří v molekulách čtyři kovalentní vazby', 'bond', at(2, 14), 'Uhlík má 4 valenční elektrony, a tak tvoří 4 vazby (methan $CH4$).'),
  h('F', 'Prvek, který má ve všech sloučeninách oxidační číslo −I', 'ox', enExtreme(() => true, 'max'), 'Fluor je nejelektronegativnější, elektron si vždy přitáhne.'),
  h('H', 'Nekov, který má ve sloučeninách obvykle oxidační číslo +I, jen v hydridech kovů −I', 'ox', undefined, 'Vodík: +I v $H2O$ či $HCl$, −I v hydridu sodném $NaH$.'),
  h('N', 'Centrální atom amonného kationtu $XH4^+$ s koordinační vazbou', 'bond', undefined, 'V $NH4^+$ poskytne dusík volný elektronový pár iontu $H^+$.'),
]

/** Level 6: reactivity series, galvanic cells, electrolysis, corrosion, catalysts. */
const L6: FindPrompt[] = [
  h('K', 'Nejreaktivnější alkalický kov ve 4. periodě', 'react', all(category('alkali'), period(4)), 'Draslík reaguje s vodou tak prudce, že vodík vzplane.'),
  h('Au', 'Ušlechtilý kov v 11. skupině 6. periody', 'react', at(6, 11), 'Zlato je na pravém konci řady napětí.'),
  h('Au', 'Nejušlechtilejší kov řady napětí', 'series', seriesAt(-1), 'Řada napětí končí vpravo zlatem.'),
  h('Li', 'Kov s nejzápornějším standardním elektrodovým potenciálem (−3,04 V)', 'series', seriesAt(0), 'Lithium stojí v řadě napětí úplně vlevo.'),
  h('K', 'Kov, který v řadě napětí stojí hned za lithiem', 'series', seriesAt(1), 'Li K Ba Ca Na Mg Al…'),
  h('Ba', 'Kov řady napětí mezi draslíkem a vápníkem', 'series', seriesBetween('K', 'Ca'), 'Li K **Ba** Ca Na…'),
  h('Ca', 'Kov 2. skupiny, který v řadě napětí stojí mezi baryem a sodíkem', 'series', seriesBetween('Ba', 'Na'), '…Ba **Ca** Na Mg…'),
  h('Mn', 'Kov řady napětí mezi hliníkem a zinkem', 'series', seriesBetween('Al', 'Zn'), '…Al **Mn** Zn…'),
  h('Cd', 'Kov řady napětí mezi železem a kobaltem', 'series', seriesBetween('Fe', 'Co'), '…Fe **Cd** Co…'),
  h('Ni', 'Kov řady napětí mezi kobaltem a cínem', 'series', seriesBetween('Co', 'Sn'), '…Co **Ni** Sn…'),
  h('Pb', 'Kov, který v řadě napětí stojí těsně před vodíkem', 'series', seriesAt(SERIES.indexOf('H') - 1), '…Sn **Pb** H Cu…'),
  h('Cu', 'Kov, který v řadě napětí stojí hned napravo od vodíku', 'series', seriesAt(SERIES.indexOf('H') + 1), 'Měď je ušlechtilá, z $HCl$ vodík nevytěsní.'),
  h('Hg', 'Kov řady napětí mezi stříbrem a zlatem', 'series', seriesBetween('Ag', 'Au'), '…Ag **Hg** Au.'),
  h('Zn', 'Kov 12. skupiny ve 4. periodě, který vytěsní měď z roztoku $CuSO4$', 'displace', at(4, 12), 'Zinek stojí v řadě napětí vlevo od mědi: $Zn + CuSO4 -> ZnSO4 + Cu$.'),
  h('Fe', 'Kov, jehož hřebík se v modré skalici potáhne červenou mědí', 'displace', undefined, '$Fe + CuSO4 -> FeSO4 + Cu$'),
  h('Ag', 'Ušlechtilý kov 11. skupiny v 5. periodě, který nereaguje se zředěnou $HCl$', 'displace', at(5, 11), 'Stříbro stojí vpravo od vodíku.'),
  h('Cu', 'Kov katody Daniellova článku', 'cell', undefined, 'Na katodě se redukuje $Cu^{2+} + 2e^- -> Cu$.'),
  h('Zn', 'Kov anody Daniellova článku', 'cell', undefined, 'Na anodě se oxiduje $Zn -> Zn^{2+} + 2e^-$.'),
  h('Li', 'Nejlehčí kov, jehož ionty putují v baterii mobilu mezi elektrodami', 'cell', undefined, 'Li-ion akumulátor dává asi 3,7 V.'),
  h('Pb', 'Kov elektrod autobaterie, akumulátoru s kyselinou sírovou', 'cell', undefined, 'Olověný akumulátor: $Pb$ a $PbO2$ v $H2SO4$.'),
  h('Na', 'Kov, který vzniká na katodě při elektrolýze taveniny kuchyňské soli', 'electrolysis', undefined, '$Na^+ + e^- -> Na$'),
  h('Cl', 'Plyn, který vzniká na anodě při elektrolýze solanky', 'electrolysis', undefined, '$2Cl^- -> Cl2 + 2e^-$'),
  h('H', 'Plyn, který vzniká na katodě při elektrolýze solanky', 'electrolysis', undefined, 'Sodík se z roztoku nevyloučí, redukuje se voda na vodík.'),
  h('Al', 'Kov vyráběný elektrolýzou oxidu rozpuštěného v roztaveném kryolitu', 'electrolysis', undefined, 'Hliník: elektrolýza $Al2O3$ v kryolitu při asi 950 °C.'),
  h('Mg', 'Kov 2. skupiny ve 3. periodě, z něhož se dělají obětované anody lodí', 'corrosion', at(3, 2), 'Hořčík (−2,37 V) se oxiduje místo železa.'),
  h('Zn', 'Kov, kterým se pokovují okapy a svodidla: je neušlechtilejší než železo, a proto ho chrání i po poškrábání', 'corrosion', undefined, 'Pozinkování: zinek se obětuje místo železa.'),
  h('Sn', 'Kov 14. skupiny v 5. periodě, jehož vrstva chrání plechovky, ale po poškrábání železo rezaví rychleji', 'corrosion', at(5, 14), 'Cín je ušlechtilejší než železo.'),
  h('Cr', 'Kov 6. skupiny, který v nerezové oceli vytvoří ochrannou pasivní vrstvu', 'corrosion', undefined, 'Chrom se pasivuje tenkou vrstvou oxidu.'),
  h('Fe', 'Kov 8. skupiny, který katalyzuje Haberovu–Boschovu syntézu amoniaku', 'catalyst', undefined, 'Železný katalyzátor zrychlí ustavení rovnováhy, výtěžek nezmění.'),
  h('Pt', 'Kov 10. skupiny v 6. periodě, na jehož povrchu pracuje katalyzátor ve výfuku', 'catalyst', at(6, 10), 'Platina mění $CO$ a $NO$ na $CO2$ a $N2$.'),
  h('Pd', 'Kov 10. skupiny v 5. periodě, další kov autokatalyzátorů', 'catalyst', at(5, 10), 'Ve výfuku jsou platina, palladium a rhodium.'),
  h('N', 'Plyn, který v Haberově–Boschově syntéze reaguje s vodíkem', 'equilibrium', undefined, '$N2 + 3H2 <=> 2NH3$'),
  h('S', 'Nekov, jehož oxid $XO2$ se při kontaktním způsobu oxiduje na $XO3$', 'equilibrium', undefined, '$2SO2 + O2 <=> 2SO3$ na katalyzátoru.'),
]

/** Level 7: descriptive chemistry of the elements (lessons l7-1 to l7-6). */
const L7: FindPrompt[] = [
  h('N', 'Plyn, který tvoří 78 % vzduchu', 'occurrence', undefined, 'Dusík $N2$ drží pohromadě pevná trojná vazba.'),
  h('O', 'Prvek, jehož alotropem je ozon', 'allotrope', undefined, 'Kyslík: $O2$ a ozon $O3$.'),
  h('C', 'Prvek, jehož alotropem je grafen', 'allotrope', undefined, 'Uhlík: diamant, grafit, grafen, fullereny, nanotrubice.'),
  h('H', 'Plyn, který se vyrábí parním reformováním zemního plynu a hoří téměř neviditelným plamenem', 'production', undefined, 'Vodík hoří na vodu, proto „palivo budoucnosti“.'),
  h('Al', 'Kov vyráběný elektrolýzou oxidu z bauxitu rozpuštěného v roztaveném kryolitu', 'production', undefined, 'Hallův–Héroultův proces, asi 14 kWh na kilogram hliníku.'),
  h('Fe', 'Kov v hemoglobinu', 'bio', undefined, 'Hemoglobin je komplex železa $Fe^{II}$.'),
  h('Br', 'Halogen, který je za normálních podmínek kapalina', 'state', all(category('halogen'), (e) => e.state === 'liquid'), 'Brom: červenohnědá kapalina, vře při 59 °C.'),
  h('Hg', 'Jediný kov, který je za pokojové teploty kapalný', 'state', all(isMetal, (e) => e.state === 'liquid'), 'Rtuť taje už při −39 °C.'),
  h('F', 'Nejsilnější oxidační činidlo mezi halogeny, světle žlutý plyn', 'halogen', all(category('halogen'), enExtreme(category('halogen'), 'max')), 'Fluor s vodíkem vybuchne i ve tmě.'),
  h('Cl', 'Žlutozelený jedovatý plyn, kterým se dezinfikuje pitná voda', 'halogen', undefined, 'Chlor s vodou dává kyselinu chlornou, která ničí bakterie.'),
  h('I', 'Halogen, který sublimuje na fialové páry a se škrobem dává modročerné zbarvení', 'halogen', undefined, 'Jod: lesklé krystalky, fialové páry.'),
  h('He', 'Vzácný plyn, který plní balonky a chladí magnety přístrojů magnetické rezonance', 'noble', undefined, 'Helium je lehčí než vzduch a nehořlavé.'),
  h('Ne', 'Vzácný plyn, který v reklamních trubicích svítí oranžovočerveně', 'noble', undefined, 'Neon ve výboji svítí oranžovočerveně.'),
  h('Ar', 'Vzácný plyn ze žárovek a z ochranné atmosféry při svařování, je ho ve vzduchu 0,93 %', 'noble', undefined, 'Argon je levný a chrání horký kov před kyslíkem.'),
  h('Xe', 'Vzácný plyn, jehož fluoridy $XF2$, $XF4$ a $XF6$ překvapily chemiky', 'noble', undefined, 'Xenon: první sloučeninu připravil Neil Bartlett v roce 1962.'),
  h('Rn', 'Radioaktivní vzácný plyn, který se hromadí ve sklepech', 'noble', all(category('noble'), (e) => e.radioactiveOnly), 'Radon vzniká rozpadem uranu v horninách.'),
  h('S', 'Žlutý křehký nekov, jehož molekuly $X8$ mají tvar korunky', 'nonmetal', undefined, 'Síra: kosočtverečná a jednoklonná modifikace.'),
  h('P', 'Nekov, jehož bílá forma se na vzduchu sama vznítí a červená je na škrtátku zápalek', 'nonmetal', undefined, 'Fosfor: bílý $P4$ a červený polymerní.'),
  h('Si', 'Polokov, z něhož jsou čipy a solární panely', 'nonmetal', undefined, 'Křemík je polovodič.'),
  h('Li', 'Nejlehčí kov, který barví plamen karmínově', 'flame', undefined, 'Lithium plave i na oleji.'),
  h('Na', 'Měkký kov, který barví plamen žlutě a uchovává se pod olejem', 'flame', undefined, 'Sodík: žlutý plamen přehluší i draslík.'),
  h('K', 'Alkalický kov, který barví plamen fialově', 'flame', undefined, 'Draslík: fialovou barvu uvidíš přes kobaltové sklo.'),
  h('Sr', 'Kov 2. skupiny v 5. periodě, který barví ohňostroje červeně', 'flame', at(5, 2), 'Stroncium: červené ohňostroje a nouzové světlice.'),
  h('Ba', 'Kov, který barví ohňostroje zeleně a jehož síran se pije před rentgenem žaludku', 'flame', undefined, 'Baryum: $BaSO4$ je nerozpustný, a proto neškodný.'),
  h('Mg', 'Kov, který hoří oslnivě bílým plamenem a nesmí se hasit vodou', 'metal', undefined, 'Hořčík rozkládá vodu i $CO2$, hasí se pískem.'),
  h('Ca', 'Kov, jehož uhličitan tvoří mramor, křídu i krápníky', 'metal', undefined, 'Uhličitan vápenatý $CaCO3$.'),
  h('Cu', 'Načervenalý kov, po stříbře nejlepší vodič elektřiny, na střechách zelená patina', 'metal', undefined, 'Měď: kabely, měděnka na střechách kostelů.'),
  h('Zn', 'Kov, který s mědí tvoří mosaz a jako vrstva chrání železo před rzí', 'metal', undefined, 'Zinek: pozinkování a mosaz.'),
  h('Cr', 'Tvrdý lesklý kov, kterého nerezová ocel obsahuje aspoň 10,5 %', 'metal', undefined, 'Chrom: nerez a chromování.'),
  h('Mn', 'Kov, jehož oxid $XO2$ (burel) katalyzuje rozklad peroxidu vodíku', 'metal', undefined, 'Burel je oxid manganičitý $MnO2$.'),
  h('Co', 'Kov, jehož oxid barví sklo modře a který je uprostřed vitaminu $B_{12}$', 'metal', undefined, 'Kobalt: modré sklo, vitamin $B_{12}$.'),
  h('Pt', 'Ušlechtilý kov autokatalyzátorů, na jehož síťce se v Ostwaldově výrobě spaluje amoniak', 'metal', undefined, 'Platina je výborný katalyzátor.'),
  h('Ag', 'Nejlepší vodič tepla a elektřiny, který černá stopami sulfanu', 'metal', undefined, 'Stříbro tvoří černý $Ag2S$.'),
  h('Au', 'Kov, který rozpustí jen lučavka královská; ryzost se udává v karátech', 'metal', undefined, 'Zlato: 24 karátů je čisté zlato.'),
]

/** Level 9: biogenic elements – macro-elements and trace elements in living things. */
const L9: FindPrompt[] = [
  h('Mg', 'Prvek ve středu chlorofylu', 'molecule', undefined, 'Chlorofyl je komplex hořčíku.'),
  h('Co', 'Prvek ve vitaminu $B_{12}$', 'molecule', undefined, 'Vitamin $B_{12}$ (kobalamin) je komplex kobaltu.'),
  h('I', 'Prvek ve hormonu štítné žlázy', 'molecule', undefined, 'Tyroxin má čtyři atomy jodu.'),
  h('P', 'Prvek v páteři DNA vedle cukru', 'molecule', undefined, 'Páteř DNA: deoxyribóza – fosfát – deoxyribóza…'),
  h('P', 'Prvek, jehož tři atomy nese energetická „baterie“ buňky ATP', 'molecule', undefined, 'ATP = adenin + ribóza + tři fosfáty.'),
  h('Fe', 'Kov v hemu, který v krvi váže kyslík', 'molecule', undefined, 'Uprostřed hemu je ion $Fe^{2+}$.'),
  h('S', 'Prvek, který spojuje dva cysteiny můstkem $–X–X–$', 'molecule', undefined, 'Disulfidové můstky zpevňují bílkoviny, třeba keratin vlasů.'),
  h('N', 'Prvek, který je v každé aminoskupině a v každé peptidové vazbě', 'molecule', undefined, 'Peptidová vazba $–CO–NH–$.'),
  h('C', 'Prvek, jehož řetězce a kruhy tvoří kostru všech biomolekul', 'macro', undefined, 'Uhlík tvoří 4 vazby a dlouhé řetězce.'),
  h('O', 'Prvek, kterého je v lidském těle nejvíc podle hmotnosti', 'macro', undefined, 'Kyslík tvoří asi 65 % hmotnosti těla, hlavně ve vodě.'),
  h('H', 'Prvek, kterého je v lidském těle nejvíc podle počtu atomů', 'macro', undefined, 'Vodíkových atomů je v těle asi 60 %.'),
  h('Ca', 'Makroprvek, který s fosforečnany tvoří kosti a zuby', 'macro', undefined, 'Vápník; jeho ukládání do kostí řídí vitamin D.'),
  h('K', 'Makroprvek 1. skupiny ve 4. periodě, hlavní kation uvnitř buněk', 'macro', at(4, 1), 'Draslík: hodně ho mají banány.'),
  h('Na', 'Makroprvek 1. skupiny ve 3. periodě, hlavní kation krevní plazmy', 'macro', at(3, 1), 'Sodík: s chloridem tvoří kuchyňskou sůl.'),
  h('Cl', 'Makroprvek, jehož anion $X^-$ je v kuchyňské soli i v žaludeční kyselině', 'macro', undefined, 'Žaludeční šťáva obsahuje $HCl$.'),
  h('Mg', 'Makroprvek, jehož nedostatek způsobuje svalové křeče (je v ořeších a hořké čokoládě)', 'macro', undefined, 'V těle je asi 25 g hořčíku.'),
  h('F', 'Stopový prvek ze zubní pasty, který zpevňuje zubní sklovinu', 'trace', undefined, 'Z hydroxyapatitu vzniká odolnější fluorapatit.'),
  h('Zn', 'Stopový kov 12. skupiny ve 4. periodě, kofaktor stovek enzymů', 'trace', at(4, 12), 'Zinek jako ion $Zn^{2+}$ pomáhá enzymům.'),
  h('Cu', 'Stopový kov 11. skupiny ve 4. periodě, kofaktor enzymů, které přenášejí elektrony', 'trace', at(4, 11), 'Měď je v enzymech buněčného dýchání.'),
  h('Se', 'Stopový nekov 16. skupiny ve 4. periodě, součást antioxidačních enzymů', 'trace', at(4, 16), 'Selen chrání buňky před oxidací.'),
  h('Mn', 'Stopový kov 7. skupiny ve 4. periodě, pomáhá rostlinám rozkládat vodu při fotosyntéze', 'trace', at(4, 7), 'Mangan je v centru, kde se při fotosyntéze uvolňuje kyslík.'),
  h('Mo', 'Stopový kov 6. skupiny v 5. periodě, pomáhá bakteriím vázat vzdušný dusík', 'trace', at(5, 6), 'Molybden je v enzymu nitrogenáze.'),
  h('Fe', 'Stopový kov, jehož nedostatek způsobuje chudokrevnost', 'trace', undefined, 'Bez železa nevznikne dost hemoglobinu.'),
  h('I', 'Stopový halogen, který se kvůli štítné žláze přidává do kuchyňské soli', 'trace', undefined, 'Jodidovaná sůl obsahuje jodid nebo jodičnan draselný.'),
  h('Co', 'Stopový kov 9. skupiny ve 4. periodě, bez kterého nevznikne vitamin $B_{12}$', 'trace', at(4, 9), 'Kobalt: vitamin $B_{12}$ je jen v živočišné potravě.'),
]

export const LEVELS: Record<number, FindPrompt[]> = {
  2: level2(),
  3: L3,
  6: L6,
  7: L7,
  9: L9,
}

/** How many name / symbol prompts a round of 10 has at each level (the rest are clues). */
export const NAME_SYMBOL_QUOTA: Record<number, { name: number; symbol: number }> = {
  2: { name: 3, symbol: 2 },
}
