/**
 * Kdo jsem? – content set per level (see spec/courses/chemie/games.md).
 *   L2: elements, hints about particles (shells, valence electrons, neutrons, position, Z).
 *   L3: elements, hints about bonding (bond with chlorine, oxide, ion, electronegativity).
 *   L7: elements, descriptive hints (appearance, occurrence, production, compounds, uses).
 *   L8: organic compounds.  L9: biomolecules.
 * Every subject has exactly 5 hints, from vague to specific, in <Md> markup.
 * Hints never contain the answer's name (checked by tests).
 */
import { BY_SYMBOL, CATEGORY_LABEL, ELEMENTS, simpleShells } from '../../courses/chemie/data/elements'
import { valenceElectrons } from '../../courses/chemie/data/electronConfig'
import { MAIN_A } from '../build-atom/levels'
import { inPeriod } from '../shared/util'

export interface Hint {
  label: string
  /** <Md> markup. */
  text: string
}

export interface Subject {
  /** Element symbol, or a slug for a compound. */
  id: string
  kind: 'element' | 'compound'
  /** Czech name as shown ("Sodík", "ethanol", "DNA"). */
  name: string
  /** Compounds: formula (or a short description) for the option cards, <Md> markup. */
  formula?: string
  /** Other names accepted when typing (systematic, trivial). */
  aliases?: string[]
  /** Compounds: family, used to pick plausible distractors. */
  family?: string
  hints: Hint[]
}

const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many)
const fmt = (x: number) => x.toFixed(2).replace('.', ',')

// ───────────────────────────── level 2: particles, generated from the element data

const STATE: Record<string, string> = { gas: 'plyn', liquid: 'kapalina', solid: 'pevná látka' }
const KIND: Record<string, string> = { post: 'kov', nonmetal: 'nekov' }
const SHELL_NAMES = ['K', 'L', 'M', 'N']

function level2(sym: string): Subject {
  const e = BY_SYMBOL[sym]
  const kind = KIND[e.category] ?? CATEGORY_LABEL[e.category]
  const shells = simpleShells(e.z)
  const v = valenceElectrons(e.z)
  const n = MAIN_A[sym] - e.z
  const valence =
    e.z === 2
      ? 'Moje jediná vrstva je zaplněná dvěma elektrony, víc se do ní nevejde.'
      : v === 8
        ? 'Mám 8 valenčních elektronů, tedy stabilní oktet.'
        : `Mám ${v} ${plural(v, 'valenční elektron', 'valenční elektrony', 'valenčních elektronů')}.`
  const layers =
    shells.length === 1
      ? 'Elektrony mám jen v jediné vrstvě K.'
      : `Elektrony mám ve ${shells.length} vrstvách (${SHELL_NAMES.slice(0, shells.length).join(', ')}): ${shells.join(', ')}.`
  const nucleus =
    n === 0
      ? 'Můj nejběžnější izotop nemá v jádře žádný neutron.'
      : `V jádře mého nejběžnějšího izotopu ${plural(n, 'je', 'jsou', 'je')} ${n} ${plural(n, 'neutron', 'neutrony', 'neutronů')}.`
  return {
    id: sym,
    kind: 'element',
    name: e.name,
    hints: [
      { label: 'Kategorie', text: `Jsem ${kind} a za pokojové teploty ${STATE[e.state]}.` },
      { label: 'Valenční elektrony', text: valence },
      { label: 'Vrstvy', text: layers },
      { label: 'Jádro', text: nucleus },
      { label: 'Poloha', text: `Najdeš mě ${inPeriod(e.period)} a ${e.group}. skupině, mám protonové číslo ${e.z}.` },
    ],
  }
}

// ───────────────────────────── level 3: bonding

const CL_EN = 3.16
function bondWithChlorine(sym: string): string {
  const en = BY_SYMBOL[sym].en!
  if (sym === 'Cl') return 'Dva moje atomy spolu tvoří nepolární vazbu (ΔX = 0).'
  const dx = Math.abs(CL_EN - en)
  const type = dx < 0.4 ? 'nepolární kovalentní' : dx < 1.7 ? 'polární kovalentní' : 'iontovou'
  return `S chlorem tvořím vazbu ${type} (ΔX = ${fmt(dx)}).`
}

/** [symbol, character, compounds (oxide/hydride), ion] – bond with Cl and electronegativity are computed. */
const L3_ROWS: [string, string, Hint, string][] = [
  ['H', 'Jsem nekov, i když v tabulce stojím nad alkalickými kovy. Svůj jediný elektron ve vazbách sdílím.', { label: 'Oxid', text: 'Můj oxid má vzorec $X2O$ a za běžných podmínek je to kapalina.' }, 'Ve vodě ze mě vzniká kation $X^+$, s reaktivními kovy tvořím hydridový anion $X^-$.'],
  ['Li', 'Jsem nejlehčí kov a ve vazbách snadno odevzdám svůj jediný valenční elektron.', { label: 'Oxid', text: 'Můj oxid má vzorec $X2O$, mám v něm oxidační číslo I.' }, 'Tvořím kation $M^+$ s konfigurací helia.'],
  ['C', 'Jsem nekov se 4 valenčními elektrony a ve sloučeninách tvořím 4 kovalentní vazby.', { label: 'Oxid', text: 'Můj oxid $XO2$ je lineární molekula: vazby jsou polární, molekula ne.' }, 'Jednoduché ionty skoro netvořím, elektrony raději sdílím.'],
  ['N', 'Jsem nekov a moje dvouatomová molekula drží pohromadě trojnou vazbou.', { label: 'Oxid', text: 'Můj oxid s nejvyšším oxidačním číslem má vzorec $X2O5$.' }, 'S reaktivními kovy tvořím anion $X^{3-}$ s konfigurací neonu.'],
  ['O', 'Jsem nekov a ve většině sloučenin mám oxidační číslo −II.', { label: 'Hydrid', text: 'S vodíkem tvořím $H2X$, jehož molekuly drží pohromadě vodíkové vazby.' }, 'S kovy tvořím anion $X^{2-}$ s konfigurací neonu.'],
  ['F', 'Jsem nekov, který ve sloučeninách elektrony vždy přitahuje k sobě.', { label: 'Hydrid', text: 'S vodíkem tvořím $HX$: ΔX = 1,78, a přesto je to molekula s polární kovalentní vazbou.' }, 'Tvořím anion $X^-$ a ve sloučeninách mám vždy oxidační číslo −I.'],
  ['Na', 'Jsem měkký kov a ve sloučeninách ochotně odevzdávám svůj jediný valenční elektron.', { label: 'Oxid', text: 'Můj oxid má vzorec $X2O$, můj chlorid $XCl$ tvoří iontovou mřížku.' }, 'Tvořím kation $M^+$ s konfigurací neonu.'],
  ['Mg', 'Jsem kov a ve sloučeninách odevzdávám dva valenční elektrony.', { label: 'Oxid', text: 'Můj oxid má vzorec $XO$, můj nitrid $X3N2$.' }, 'Tvořím kation $M^{2+}$ s konfigurací neonu.'],
  ['Al', 'Jsem lehký kov se třemi valenčními elektrony.', { label: 'Oxid', text: 'Můj oxid má vzorec $X2O3$.' }, 'Tvořím kation $M^{3+}$ s konfigurací neonu.'],
  ['Si', 'Jsem polokov se 4 valenčními elektrony, stejně jako uhlík nade mnou.', { label: 'Oxid', text: 'Můj oxid $XO2$ netvoří molekuly, ale obří kovalentní mřížku, a taje až kolem 1 700 °C.' }, 'Jednoduché ionty netvořím, vazby sdílím.'],
  ['P', 'Jsem nekov s 5 valenčními elektrony.', { label: 'Oxid', text: 'Můj oxid s oxidačním číslem V má vzorec $X4O10$, zjednodušeně $X2O5$.' }, 'S reaktivními kovy tvořím anion $X^{3-}$ s konfigurací argonu.'],
  ['S', 'Jsem žlutý nekov se 6 valenčními elektrony.', { label: 'Oxid', text: 'Tvořím dva důležité oxidy: $XO2$ a $XO3$.' }, 'S kovy tvořím anion $X^{2-}$ s konfigurací argonu.'],
  ['Cl', 'Jsem nekov se 7 valenčními elektrony a jako prvek tvořím dvouatomové molekuly.', { label: 'Oxid', text: 'Můj oxid s nejvyšším oxidačním číslem má vzorec $X2O7$.' }, 'Tvořím anion $X^-$ s konfigurací argonu.'],
  ['K', 'Jsem velmi reaktivní kov se 4 elektronovými vrstvami.', { label: 'Oxid', text: 'Můj oxid má vzorec $X2O$.' }, 'Tvořím kation $M^+$ s konfigurací argonu.'],
  ['Ca', 'Jsem kov alkalických zemin se 4 elektronovými vrstvami.', { label: 'Oxid', text: 'Můj oxid má vzorec $XO$ a s vodou prudce reaguje.' }, 'Tvořím kation $M^{2+}$ s konfigurací argonu.'],
  ['Br', 'Jsem nekov, který elektron spíš přijme, než by ho odevzdal.', { label: 'Hydrid', text: 'S vodíkem tvořím $HX$, jehož vodný roztok je silná kyselina.' }, 'Tvořím anion $X^-$ s konfigurací kryptonu.'],
  ['I', 'Jsem nekov, za pokojové teploty tvořím tmavě fialové krystalky.', { label: 'Hydrid', text: 'S vodíkem tvořím $HX$ s polární vazbou (ΔX = 0,46).' }, 'Tvořím anion $X^-$ s konfigurací xenonu.'],
]

function level3([sym, character, compound, ionText]: (typeof L3_ROWS)[number]): Subject {
  const e = BY_SYMBOL[sym]
  return {
    id: sym,
    kind: 'element',
    name: e.name,
    hints: [
      { label: 'Povaha', text: character },
      { label: 'Vazba s chlorem', text: bondWithChlorine(sym) },
      compound,
      { label: 'Ion', text: ionText },
      { label: 'Elektronegativita', text: `Moje elektronegativita je ${fmt(e.en!)}.` },
    ],
  }
}

// ───────────────────────────── hand-written subjects

const el = (sym: string, ...texts: [string, string][]): Subject => ({
  id: sym,
  kind: 'element',
  name: BY_SYMBOL[sym].name,
  hints: texts.map(([label, text]) => ({ label, text })),
})

const L7: Subject[] = [
  el('H', ['Vzhled', 'Jsem bezbarvý plyn bez zápachu, asi 14× lehčí než vzduch.'], ['Výskyt', 'Ve vesmíru tvořím asi tři čtvrtiny běžné hmoty, na Zemi jsem hlavně vázaný ve vodě.'], ['Výroba', 'V laboratoři mě připravíš ze zinku a zředěné kyseliny v Kippově přístroji.'], ['Bezpečnost', 'Se vzduchem tvořím třaskavou směs, proto se před zapálením zkouší moje čistota.'], ['Využití', 'Hořím téměř neviditelným plamenem a vzniká jen voda. Říká se mi palivo budoucnosti.']),
  el('O', ['Vzhled', 'Jsem bezbarvý plyn bez zápachu a tvořím 21 % vzduchu.'], ['Výskyt', 'Jsem nejrozšířenější prvek zemské kůry.'], ['Výroba', 'V laboratoři vznikám rozkladem peroxidu vodíku s burelem.'], ['Alotropie', 'Mám dvě alotropické modifikace; ta tříatomová ve stratosféře pohlcuje UV záření.'], ['Důkaz', 'Doutnající špejle se ve mně znovu rozhoří.']),
  el('N', ['Vzhled', 'Jsem bezbarvý, velmi netečný plyn.'], ['Výskyt', 'Tvořím 78 % vzduchu.'], ['Vazba', 'Moje dvouatomová molekula drží pohromadě trojnou vazbou, jednou z nejpevnějších vůbec.'], ['Sloučeniny', 'Haber a Bosch mě naučili slučovat s vodíkem na amoniak, a tak vznikla průmyslová hnojiva.'], ['Využití', 'Plní se mnou sáčky chipsů, aby nežlukly.']),
  el('S', ['Vzhled', 'Jsem žlutá, křehká pevná látka a ve vodě se nerozpouštím.'], ['Stavba', 'Moje atomy tvoří cyklické molekuly ve tvaru korunky.'], ['Životní prostředí', 'Mým hořením vzniká štiplavý plyn, který způsobuje kyselé deště.'], ['Výroba', 'Z mého oxidu se kontaktním způsobem vyrábí nejvyráběnější chemikálie světa.'], ['Sloučeniny', 'Zkažená vejce páchnou po mé sloučenině s vodíkem.']),
  el('P', ['Výskyt', 'Jsem nekov, pevná látka, a volný se v přírodě nevyskytuji.'], ['Alotropie', 'Moje bílá modifikace ve tmě světélkuje a na vzduchu se sama vznítí.'], ['Využití', 'Moje červená modifikace je na škrtátku krabičky zápalek.'], ['Sloučeniny', 'Moje kyselina je v kolových nápojích jako E338.'], ['Životní prostředí', 'Moje soli z hnojiv způsobují eutrofizaci rybníků; spolu s vápníkem tvoří kosti.']),
  el('C', ['Alotropie', 'Mám několik alotropických modifikací s úplně odlišnými vlastnostmi.'], ['Vzhled', 'Jedna moje podoba je nejtvrdší přírodní látka, jiná je měkká a šedočerná.'], ['Objev', 'Moji vrstvu silnou jediný atom odloupli vědci lepicí páskou a dostali za ni Nobelovu cenu.'], ['Sloučeniny', 'Můj oxid, který vzniká při dokonalém hoření, je hlavní skleníkový plyn.'], ['Využití', 'Moje amorfní forma s obrovským povrchem je v lékárničce proti otravám.']),
  el('Si', ['Vzhled', 'Jsem polokov: vypadám kovově lesklý, ale jsem křehký.'], ['Výskyt', 'Jsem druhý nejrozšířenější prvek zemské kůry.'], ['Sloučeniny', 'Můj oxid tvoří písek a taje až kolem 1 700 °C.'], ['Vlastnosti', 'Jsem polovodič a moje vodivost se dá řídit dopováním.'], ['Využití', 'Jsou ze mě čipy v mobilech a solární panely.']),
  el('Cl', ['Vzhled', 'Jsem žlutozelený jedovatý plyn.'], ['Rodina', 'Jsem halogen a s kovy přímo tvořím soli.'], ['Výroba', 'Průmyslově vznikám elektrolýzou solanky spolu s hydroxidem sodným a vodíkem.'], ['Využití', 'Dezinfikuji pitnou vodu i bazény.'], ['Bezpečnost', 'Savo smíchané s kyselým čističem WC mě uvolní. Nikdy je nemíchej!']),
  el('I', ['Vzhled', 'Jsem tmavě fialová, kovově lesklá pevná látka.'], ['Vlastnosti', 'Při zahřívání sublimuji na fialové páry.'], ['Důkaz', 'Se škrobem dávám tmavě modré až černofialové zbarvení.'], ['Využití', 'Můj roztok v ethanolu dezinfikuje kůži kolem ran.'], ['Zdraví', 'Přidávám se do kuchyňské soli kvůli štítné žláze.']),
  el('He', ['Rodina', 'Jsem vzácný plyn a skoro s ničím nereaguji.'], ['Vlastnosti', 'Jsem lehčí než vzduch a nehořlavý.'], ['Využití', 'Kapalný vřu při −269 °C a chladím magnety přístrojů magnetické rezonance.'], ['Využití', 'Potápěči mě dýchají v dýchacích směsích.'], ['Využití', 'Plní se mnou balonky a vzducholodě.']),
  el('Ar', ['Rodina', 'Jsem vzácný plyn.'], ['Výskyt', 'Ve vzduchu mě je 0,93 %, ze vzácných plynů jsem v něm nejhojnější.'], ['Výroba', 'Získávám se frakční destilací zkapalněného vzduchu, a proto jsem levný.'], ['Využití', 'Chráním horký kov před kyslíkem při svařování.'], ['Využití', 'Plní se mnou žárovky.']),
  el('Na', ['Vzhled', 'Jsem měkký stříbřitý kov, dá se krájet nožem.'], ['Bezpečnost', 'Uchovávám se pod parafinovým olejem.'], ['Reakce', 'S vodou prudce reaguji na hydroxid a vodík.'], ['Plamen', 'Barvím plamen žlutě; staré pouliční výbojky svítily mou barvou.'], ['Sloučeniny', 'S chlorem tvořím kuchyňskou sůl.']),
  el('K', ['Vzhled', 'Jsem měkký, velmi reaktivní kov.'], ['Reakce', 'S vodou reaguji tak prudce, že uvolněný vodík vzplane.'], ['Plamen', 'Barvím plamen fialově, ale stopa sodíku mou barvu přehluší. Pomůže kobaltové sklo.'], ['Sloučeniny', 'Můj dusičnan (ledek) je ve střelném prachu i v hnojivech.'], ['Poloha', 'Jsem alkalický kov hned pod sodíkem.']),
  el('Mg', ['Vzhled', 'Jsem lehký stříbřitý kov.'], ['Bezpečnost', 'Hořím oslnivě bílým plamenem a nesmím se hasit vodou ani $CO2$.'], ['Využití', 'Moje slitiny s hliníkem jsou v ráfcích kol a rámech notebooků.'], ['Příroda', 'Sedím uprostřed chlorofylu.'], ['Zdraví', 'V tvém těle mě je asi 25 g a můj nedostatek způsobuje křeče.']),
  el('Ca', ['Rodina', 'Jsem kov alkalických zemin.'], ['Plamen', 'Barvím plamen cihlově červeně.'], ['Výskyt', 'Můj uhličitan tvoří mramor, křídu i krápníky.'], ['Voda', 'Spolu s hořčíkem způsobuji tvrdost vody a vodní kámen.'], ['Sloučeniny', 'Můj síran je sádrovec, z něhož se dělá sádra.']),
  el('Al', ['Vzhled', 'Jsem lehký kov, dá se válcovat na tenkou fólii.'], ['Výskyt', 'Jsem nejrozšířenější kov zemské kůry.'], ['Vlastnosti', 'Na vzduchu se pokryji tenkou vrstvičkou oxidu, která mě chrání (pasivace).'], ['Výroba', 'Vyrábím se elektrolýzou oxidu z bauxitu rozpuštěného v roztaveném kryolitu.'], ['Využití', 'Jsou ze mě plechovky a jejich recyklace ušetří asi 95 % energie.']),
  el('Fe', ['Význam', 'Jsem nejpoužívanější kov na světě.'], ['Výskyt', 'Moje rudy jsou krevel, magnetit a ocelek.'], ['Výroba', 'Vyrábím se ve vysoké peci redukcí rudy oxidem uhelnatým.'], ['Koroze', 'S vodou a kyslíkem koroduji na pórovitou rez.'], ['Biologie', 'V hemoglobinu přenáším kyslík.']),
  el('Cu', ['Vzhled', 'Jsem načervenalý měkký kov.'], ['Vlastnosti', 'Po stříbře nejlépe vedu elektřinu, a proto jsem v kabelech.'], ['Reakce', 'Jsem ušlechtilý: rozpustí mě jen oxidující kyseliny.'], ['Výskyt', 'Na střechách kostelů tvořím zelenou patinu.'], ['Slitiny', 'S cínem tvořím bronz, se zinkem mosaz.']),
  el('Zn', ['Vlastnosti', 'Jsem neušlechtilý kov, na vzduchu se pasivuji.'], ['Využití', 'Tenkou vrstvou chráním železné plechy, svodidla a okapy.'], ['Slitiny', 'S mědí tvořím mosaz.'], ['Sloučeniny', 'Můj oxid je v opalovacích krémech a mastech.'], ['Elektrochemie', 'V Daniellově článku jsem anoda.']),
  el('Ag', ['Vzhled', 'Jsem bílý lesklý ušlechtilý kov.'], ['Vlastnosti', 'Vedu teplo a elektřinu nejlépe ze všech kovů.'], ['Reakce', 'Na vzduchu černám stopami sulfanu.'], ['Důkaz', 'Roztokem mého dusičnanu se dokazují halogenidy.'], ['Využití', 'Jsou ze mě šperky, příbory a medaile za druhé místo.']),
  el('Au', ['Vzhled', 'Jsem žlutý, velmi ušlechtilý kov.'], ['Reakce', 'Nereaguji s kyslíkem ani s běžnými kyselinami.'], ['Reakce', 'Rozpustí mě jen lučavka královská.'], ['Míra', 'Moje ryzost se udává v karátech.'], ['Recyklace', 'V tuně starých mobilů mě je víc než v tuně rudy.']),
  el('Cr', ['Vzhled', 'Jsem tvrdý, lesklý přechodný kov.'], ['Sloučeniny', 'Moje sloučeniny mají mnoho barev: zelenou, oranžovou i žlutou.'], ['Využití', 'Přidaný do oceli (aspoň 10,5 %) ji chráním před rzí.'], ['Využití', 'Pokovují se mnou kliky a vodovodní baterie, aby se leskly.'], ['Bezpečnost', 'Moje sloučeniny s oxidačním číslem VI jsou karcinogenní.']),
  el('Pt', ['Vzhled', 'Jsem šedobílý ušlechtilý kov.'], ['Vlastnosti', 'Jsem výborný katalyzátor.'], ['Využití', 'Pracuji v autokatalyzátorech, které čistí výfukové plyny.'], ['Výroba', 'Na mé síťce se v Ostwaldově výrobě kyseliny dusičné spaluje amoniak.'], ['Medicína', 'Jeden lék proti rakovině je moje komplexní sloučenina.']),
]

const cmp = (
  id: string,
  name: string,
  formula: string,
  family: string,
  aliases: string[],
  ...texts: [string, string][]
): Subject => ({ id, kind: 'compound', name, formula, family, aliases, hints: texts.map(([label, text]) => ({ label, text })) })

const L8: Subject[] = [
  cmp('methan', 'methan', '$CH4$', 'uhlovodík', ['metan'], ['Třída', 'Jsem uhlovodík, alkan, za běžných podmínek plyn bez barvy a zápachu.'], ['Výskyt', 'Tvořím přes 90 % zemního plynu.'], ['Tvar', 'Moje molekula je pravidelný čtyřstěn s úhly 109,5°.'], ['Životní prostředí', 'Unikám ze skládek, rýžových polí i z trávení krav a jsem silný skleníkový plyn.'], ['Vzorec', 'Mám jediný uhlík: $CH4$.']),
  cmp('ethan', 'ethan', '$C2H6$', 'uhlovodík', ['etan'], ['Třída', 'Jsem alkan a za běžných podmínek hořlavý plyn.'], ['Výskyt', 'V malém množství jsem v zemním plynu a vyrábí se ze mě ethen.'], ['Stavba', 'Mezi mými dvěma uhlíky je jen jednoduchá vazba a kolem ní se části molekuly volně otáčejí.'], ['Reakce', 'S chlorem na světle reaguji radikálovou substitucí na halogenderivát.'], ['Vzorec', '$C2H6$, racionálně $CH3-CH3$.']),
  cmp('propan', 'propan', '$C3H8$', 'uhlovodík', [], ['Třída', 'Jsem alkan, plyn, který se dá snadno zkapalnit.'], ['Využití', 'Se svým o uhlík delším sousedem v řadě plním plynové bombičky a nádrže LPG.'], ['Využití', 'Hořím v kempinkových vařičích a plynových grilech.'], ['Reakce', 'Při dokonalém spálení jednoho molu mě spotřebuje 5 molů kyslíku.'], ['Vzorec', '$C3H8$, racionálně $CH3-CH2-CH3$.']),
  cmp('ethen', 'ethen', '$C2H4$', 'uhlovodík', ['ethylen', 'eten'], ['Třída', 'Jsem nenasycený uhlovodík, alken, a plyn.'], ['Stavba', 'Mezi mými dvěma uhlíky je dvojná vazba.'], ['Příroda', 'Rostliny mě tvoří jako hormon zrání: díky mně dozrávají banány i rajčata.'], ['Reakce', 'Odbarvím bromovou vodu a polymerací ze mě vzniká nejrozšířenější plast na tašky a fólie.'], ['Vzorec', '$C2H4$, racionálně $CH2=CH2$.']),
  cmp('ethyn', 'ethyn', '$C2H2$', 'uhlovodík', ['acetylen', 'etyn'], ['Třída', 'Patřím mezi alkyny, uhlovodíky s trojnou vazbou.'], ['Stavba', 'Jsem nejjednodušší ze své homologické řady.'], ['Vlastnosti', 'V kyslíku hořím plamenem o teplotě přes 3 000 °C.'], ['Využití', 'Svářeči mnou svařují a řežou ocel.'], ['Vzorec', '$C2H2$, racionálně $HC≡CH$.']),
  cmp('benzen', 'benzen', '$C6H6$', 'uhlovodík', [], ['Třída', 'Jsem aromatický uhlovodík, bezbarvá kapalina s typickým zápachem.'], ['Stavba', 'Mých šest uhlíků tvoří plochý šestiúhelník a všechny vazby C–C jsou stejně dlouhé.'], ['Reakce', 'Bromovou vodu neodbarvím: místo adice podléhám elektrofilní substituci.'], ['Historie', 'Kekulé prý na můj tvar přišel ve snu o hadovi, který se kouše do ocasu.'], ['Vzorec', '$C6H6$; pozor, jsem karcinogenní.']),
  cmp('toluen', 'toluen', '$C6H5CH3$', 'uhlovodík', ['methylbenzen'], ['Třída', 'Jsem aromatický uhlovodík, kapalina.'], ['Využití', 'Rozpouštím barvy a lepidla.'], ['Reakce', 'Nitrací ze mě vzniká výbušnina TNT.'], ['Stavba', 'Na benzenovém jádře nesu jednu methylovou skupinu.'], ['Vzorec', '$C6H5-CH3$']),
  cmp('methanol', 'methanol', '$CH3OH$', 'alkohol', ['metanol', 'methylalkohol'], ['Třída', 'Jsem alkohol, bezbarvá kapalina.'], ['Bezpečnost', 'Vypadám i voním skoro jako líh na pití, ale jsem prudce jedovatý: už malé množství oslepuje.'], ['Využití', 'Dřív jsem býval v nemrznoucích směsích do ostřikovačů, dnes je to v EU zakázané.'], ['Stavba', 'Jsem nejjednodušší alkohol, mám jediný uhlík.'], ['Vzorec', '$CH3OH$']),
  cmp('ethanol', 'ethanol', '$C2H5OH$', 'alkohol', ['etanol', 'ethylalkohol', 'líh'], ['Třída', 'Jsem alkohol, bezbarvá hořlavá kapalina.'], ['Výroba', 'Vznikám kvašením cukrů pomocí kvasinek bez přístupu vzduchu.'], ['Využití', 'Nejlépe dezinfikuji jako asi 70% roztok a přidávám se do benzinu jako biopalivo.'], ['Výskyt', 'Jsem v pivu, víně i destilátech; v játrech se oxiduji na acetaldehyd.'], ['Vzorec', '$C2H5OH$']),
  cmp('glycerol', 'glycerol', '$C3H5(OH)3$', 'alkohol', ['glycerin', 'propan-1,2,3-triol'], ['Třída', 'Jsem alkohol, ale mám hned tři skupiny $–OH$.'], ['Vlastnosti', 'Jsem sladká, hustá a nejedovatá kapalina.'], ['Využití', 'Vážu vlhkost, a proto mě najdeš v krémech a zubních pastách.'], ['Sloučeniny', 'Můj ester s kyselinou dusičnou je výbušnina i lék na srdce.'], ['Vzorec', '$CH2OH-CHOH-CH2OH$']),
  cmp('fenol', 'fenol', '$C6H5OH$', 'alkohol', ['kyselina karbolová', 'karbol'], ['Třída', 'Mám skupinu $–OH$, ale nejsem obyčejný alkohol.'], ['Vlastnosti', 'Jsem bílá krystalická látka s typickým pachem, jedovatá a leptám kůži.'], ['Reakce', 'Jsem slabá kyselina: s hydroxidem sodným tvořím sůl, což ethanol nedokáže.'], ['Historie', 'Joseph Lister mnou v roce 1867 dezinfikoval operační nástroje a rány.'], ['Vzorec', 'Skupina $–OH$ je u mě přímo na benzenovém jádře: $C6H5OH$.']),
  cmp('formaldehyd', 'formaldehyd', '$HCHO$', 'karbonyl', ['methanal', 'formaldehyde'], ['Třída', 'Jsem karbonylová sloučenina, konkrétně aldehyd.'], ['Vlastnosti', 'Za běžných podmínek jsem štiplavý plyn.'], ['Využití', 'Vyrábějí se ze mě pryskyřice do dřevotřísek.'], ['Důkaz', 'Jsem nejjednodušší aldehyd a s Tollensovým činidlem dávám stříbrné zrcátko.'], ['Vzorec', '$HCHO$; můj vodný roztok, formalín, konzervuje preparáty.']),
  cmp('aceton', 'aceton', '$CH3COCH3$', 'karbonyl', ['propanon', 'propan-2-on'], ['Třída', 'Jsem karbonylová sloučenina, konkrétně keton.'], ['Vlastnosti', 'Jsem těkavá kapalina a výborné rozpouštědlo.'], ['Využití', 'Najdeš mě v odlakovači na nehty.'], ['Tělo', 'Vznikám i v těle při dlouhém hladovění; dech pak nasládle voní.'], ['Vzorec', '$CH3-CO-CH3$']),
  cmp('kyselina-octova', 'kyselina octová', '$CH3COOH$', 'kyselina', ['kyselina ethanová', 'octová kyselina'], ['Třída', 'Jsem karboxylová kyselina.'], ['Vlastnosti', 'Jsem slabá kyselina: ve vodě odštěpí proton jen malá část mých molekul.'], ['Reakce', 'S jedlou sodou prudce šumím, protože z ní vytěsním $CO2$.'], ['Výskyt', 'V kuchyni mě znáš jako ocet, můj 5–8% roztok.'], ['Vzorec', '$CH3COOH$']),
  cmp('kyselina-mravenci', 'kyselina mravenčí', '$HCOOH$', 'kyselina', ['kyselina methanová', 'mravenčí kyselina'], ['Třída', 'Jsem karboxylová kyselina.'], ['Stavba', 'Jsem nejjednodušší ze své řady, mám jediný uhlík.'], ['Příroda', 'Jsem v žahavých chlupech kopřiv.'], ['Příroda', 'Brání se mnou drobný hmyz z lesních kupek.'], ['Vzorec', '$HCOOH$']),
  cmp('ethylacetat', 'ethylacetát', '$CH3COOC2H5$', 'ester', ['ethyl-ethanoát', 'ethylethanoát', 'octan ethylnatý'], ['Třída', 'Patřím mezi estery.'], ['Vlastnosti', 'Jsem těkavá kapalina s ovocnou vůní.'], ['Výroba', 'Vznikám esterifikací kyseliny octové s ethanolem za katalýzy kyselinou sírovou.'], ['Využití', 'Rozpouštím laky; typicky voní odlakovače a lepidla.'], ['Vzorec', '$CH3-COO-CH2-CH3$']),
  cmp('mocovina', 'močovina', '$CO(NH2)2$', 'dusíkatá', ['urea'], ['Třída', 'Jsem dusíkatý derivát kyseliny, konkrétně diamid.'], ['Využití', 'Jsem nejpoužívanější dusíkaté hnojivo, obsahuji 46 % dusíku.'], ['Historie', 'Wöhler mě v roce 1828 připravil z anorganické látky, a tím začala moderní organická chemie.'], ['Tělo', 'Tělo se ve mně zbavuje dusíku z bílkovin.'], ['Vzorec', '$CO(NH2)2$']),
  cmp('diethylether', 'diethylether', '$C2H5OC2H5$', 'ether', ['ethoxyethan'], ['Třída', 'Mám kyslík mezi dvěma uhlovodíkovými zbytky: $R–O–R′$.'], ['Vlastnosti', 'Jsem velmi těkavá a hořlavá kapalina, vřu už při 35 °C.'], ['Vlastnosti', 'Mezi mými molekulami nevznikají vodíkové můstky.'], ['Historie', 'Od roku 1846 se mnou uspávali pacienty při operacích.'], ['Vzorec', '$C2H5-O-C2H5$']),
  cmp('chloroform', 'chloroform', '$CHCl3$', 'halogenderivát', ['trichlormethan'], ['Třída', 'Patřím mezi halogenderiváty uhlovodíků.'], ['Vznik', 'Vznikám, když chlor na světle postupně nahrazuje vodíky v methanu.'], ['Vlastnosti', 'Jsem těžká těkavá kapalina nasládlé vůně.'], ['Historie', 'Patřil jsem k prvním celkovým anestetikům, uspávala se mnou i královna Viktorie.'], ['Vzorec', '$CHCl3$']),
]

const L9: Subject[] = [
  cmp('glukoza', 'glukóza', '$C6H12O6$', 'sacharid', ['glukosa', 'hroznový cukr'], ['Třída', 'Jsem monosacharid, aldohexóza.'], ['Vznik', 'Rostliny mě vyrábějí fotosyntézou z $CO2$ a vody.'], ['Důkaz', 'V roztoku tvořím hlavně šestičlenný kruh; s Fehlingovým činidlem dám cihlově červenou sraženinu.'], ['Tělo', 'Koluji v krvi a moji hladinu hlídá inzulin.'], ['Vzorec', '$C6H12O6$; jsem stavební jednotkou škrobu i celulózy.']),
  cmp('fruktoza', 'fruktóza', '$C6H12O6$', 'sacharid', ['fruktosa', 'ovocný cukr'], ['Třída', 'Jsem monosacharid, ketohexóza.'], ['Vzorec', 'Mám stejný souhrnný vzorec jako hroznový cukr.'], ['Stavba', 'Vázaná v disacharidu tvořím pětičlenný kruh.'], ['Výskyt', 'Jsem nejsladší přírodní cukr, najdeš mě v ovoci a medu.'], ['Sloučeniny', 'Spolu s glukózou tvořím sacharózu.']),
  cmp('sacharoza', 'sacharóza', '$C12H22O11$', 'sacharid', ['sacharosa', 'řepný cukr', 'třtinový cukr'], ['Třída', 'Jsem disacharid.'], ['Stavba', 'Skládám se z glukózy a fruktózy spojených glykosidovou vazbou.'], ['Důkaz', 'Nejsem redukující cukr: Fehlingovo činidlo se mnou nezčervená.'], ['Výskyt', 'Získávám se z cukrové řepy a cukrové třtiny a sypeš mě do čaje.'], ['Vzorec', '$C12H22O11$']),
  cmp('laktoza', 'laktóza', '$C12H22O11$', 'sacharid', ['laktosa', 'mléčný cukr'], ['Třída', 'Jsem disacharid.'], ['Stavba', 'Skládám se z galaktózy a glukózy.'], ['Zdraví', 'Lidem, kterým chybí enzym k mému štěpení, způsobuji nadýmání.'], ['Výskyt', 'Najdeš mě v mléce, jogurtech i sýrech.'], ['Vzorec', '$C12H22O11$, stejný vzorec jako cukr do čaje.']),
  cmp('skrob', 'škrob', '$(C6H10O5)_{n}$', 'sacharid', ['amylum'], ['Třída', 'Jsem polysacharid.'], ['Funkce', 'Jsem zásobní látka rostlin z α-glukózy.'], ['Stavba', 'Skládám se z nevětvené amylózy a větveného amylopektinu.'], ['Výskyt', 'Je mě hodně v bramborách, obilí a rýži; ve slinách mě začne štěpit amyláza.'], ['Důkaz', 'S Lugolovým roztokem se barvím tmavě modře až černě.']),
  cmp('celuloza', 'celulóza', '$(C6H10O5)_{n}$', 'sacharid', ['celulosa'], ['Třída', 'Jsem polysacharid.'], ['Funkce', 'Jsem stavební látka rostlin, tvořím stěny jejich buněk.'], ['Stavba', 'Jsem z β-glukózy, a proto mě lidské trávicí enzymy nerozloží.'], ['Výskyt', 'V potravě jsem vláknina; skoro čistou mě najdeš v bavlně a papíru.'], ['Příroda', 'Krávy mě tráví jen díky mikrobům v bachoru.']),
  cmp('glykogen', 'glykogen', '$(C6H10O5)_{n}$', 'sacharid', [], ['Třída', 'Jsem polysacharid.'], ['Funkce', 'Jsem zásobní látka živočichů.'], ['Stavba', 'Jsem z α-glukózy a jsem ještě víc větvený než amylopektin.'], ['Výskyt', 'Ukládám se v játrech a svalech.'], ['Tělo', 'Když klesne hladina glukózy v krvi, hormon glukagon spustí můj rozklad.']),
  cmp('cholesterol', 'cholesterol', '$C27H46O$', 'lipid', [], ['Třída', 'Patřím mezi lipidy, konkrétně mezi steroidy.'], ['Stavba', 'Mám soustavu čtyř spojených kruhů: tři šestičlenné a jeden pětičlenný.'], ['Funkce', 'Jsem nezbytnou součástí buněčných membrán.'], ['Funkce', 'Tělo ze mě vyrábí steroidní hormony a žlučové kyseliny.'], ['Zdraví', 'Když mě krev přenáší moc ve formě LDL, ukládám se ve stěnách cév.']),
  cmp('glycin', 'glycin', '$H2N-CH2-COOH$', 'bílkovina', ['kyselina aminooctová', 'aminooctová kyselina'], ['Třída', 'Jsem aminokyselina.'], ['Stavba', 'Můj postranní řetězec je nejjednodušší možný, jen vodík.'], ['Vlastnosti', 'Jako jediná z aminokyselin v bílkovinách nejsem chirální.'], ['Vlastnosti', 'V roztoku tvořím amfion $H3N^+–CH2–COO^-$.'], ['Vzorec', '$H2N-CH2-COOH$']),
  cmp('hemoglobin', 'hemoglobin', 'bílkovina se 4 hemy', 'bílkovina', ['krevní barvivo'], ['Třída', 'Jsem bílkovina.'], ['Stavba', 'Mám kvartérní strukturu: čtyři polypeptidové řetězce.'], ['Stavba', 'Každý můj řetězec nese skupinu hemu s iontem $Fe^{2+}$.'], ['Bezpečnost', 'Oxid uhelnatý se na mě váže asi 200× pevněji než kyslík.'], ['Funkce', 'V červených krvinkách roznáším kyslík po těle.']),
  cmp('inzulin', 'inzulin', 'bílkovina, 51 aminokyselin', 'bílkovina', ['insulin', 'inzulín'], ['Třída', 'Jsem bílkovina a zároveň hormon.'], ['Stavba', 'Mám 51 aminokyselin ve dvou řetězcích.'], ['Původ', 'Vyrábí mě slinivka břišní.'], ['Historie', 'Od roku 1982 mě vyrábějí geneticky upravené bakterie.'], ['Funkce', 'Snižuji hladinu glukózy v krvi; když chybím, vzniká cukrovka 1. typu.']),
  cmp('dna', 'DNA', 'polynukleotid, 2 vlákna', 'nukleová kyselina', ['deoxyribonukleová kyselina', 'kyselina deoxyribonukleová'], ['Třída', 'Jsem nukleová kyselina.'], ['Stavba', 'Tvořím dvoušroubovici ze dvou antiparalelních vláken.'], ['Stavba', 'Báze se ve mně párují A–T a G–C.'], ['Stavba', 'Mým cukrem je deoxyribóza a místo uracilu mám thymin.'], ['Historie', 'Watson a Crick popsali mou strukturu v roce 1953 díky snímkům Rosalind Franklinové.']),
  cmp('rna', 'RNA', 'polynukleotid, 1 vlákno', 'nukleová kyselina', ['ribonukleová kyselina', 'kyselina ribonukleová'], ['Třída', 'Jsem nukleová kyselina.'], ['Stavba', 'Obvykle mám jen jedno vlákno a jsem kratší a méně stálá.'], ['Stavba', 'Místo thyminu mám uracil.'], ['Stavba', 'Mým cukrem je ribóza.'], ['Funkce', 'Jsem pracovní kopie genetické informace, vznikám transkripcí.']),
  cmp('atp', 'ATP', '$C10H16N5O13P3$', 'nukleová kyselina', ['adenosintrifosfát'], ['Třída', 'Jsem nukleotid.'], ['Stavba', 'Mám adenin, ribózu a tři fosfáty za sebou.'], ['Vznik', 'Vznikám při buněčném dýchání z energie glukózy.'], ['Funkce', 'Odštěpením koncového fosfátu uvolním energii pro práci buňky.'], ['Přezdívka', 'Říká se mi energetická „baterie“ buňky.']),
  cmp('vitamin-c', 'vitamin C', '$C6H8O6$', 'vitamin', ['vitamín C', 'kyselina askorbová'], ['Třída', 'Jsem vitamin rozpustný ve vodě.'], ['Funkce', 'Jsem antioxidant a tělo mě potřebuje k tvorbě kolagenu.'], ['Výskyt', 'Je mě hodně v paprice, citrusech, šípcích a zelí.'], ['Historie', 'Můj nedostatek způsobuje kurděje; James Lind je v roce 1747 léčil citrony.'], ['Vzorec', '$C6H8O6$']),
  cmp('adrenalin', 'adrenalin', '$C9H13NO3$', 'hormon', ['adrenalín', 'epinefrin'], ['Třída', 'Jsem hormon, derivát aminokyseliny tyrosinu.'], ['Původ', 'Tvoří mě dřeň nadledvin.'], ['Funkce', 'Spouštím reakci „bojuj, nebo uteč“.'], ['Funkce', 'Zrychlím tep a uvolním do krve glukózu.'], ['Vzorec', '$C9H13NO3$']),
]

export const LEVELS: Record<number, Subject[]> = {
  2: ELEMENTS.filter((e) => e.z <= 20).map((e) => level2(e.symbol)),
  3: L3_ROWS.map(level3),
  7: L7,
  8: L8,
  9: L9,
}

/** All compound subjects (the typed-answer autocomplete offers these). */
export const COMPOUNDS: Subject[] = [...L8, ...L9]
