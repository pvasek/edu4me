import type { LevelContent } from '../../../core/types'

/**
 * Structure art helper: write the drawing flush-left between backticks.
 * String.raw keeps backslashes (ring and branch bonds); the leading newline is dropped.
 */
const s = (t: TemplateStringsArray) => String.raw(t).replace(/^\n/, '')

const level: LevelContent = {
  lessons: {
    // ─────────────────────────────────────────────────────────────── l8-1
    'l8-1': {
      id: 'l8-1',
      title: 'Uhlík v organice: vzorce a izomerie',
      goals: [
        'Vysvětlit, proč uhlík tvoří tolik sloučenin, a určit hybridizaci uhlíku (sp³, sp², sp) i vazebné úhly',
        'Zapsat molekulu souhrnným, strukturním, racionálním a vazebným vzorcem a roztřídit uhlíkaté řetězce',
        'Rozpoznat řetězcové, polohové a funkční izomery',
        'Určit cis/trans a E/Z izomer, najít chirální uhlík a vysvětlit, proč na enantiomerech záleží',
      ],
      hook: 'V databázích chemiků je přes sto milionů popsaných látek a drtivá většina z nich obsahuje uhlík. Jeden jediný prvek proti zbytku periodické tabulky, a vyhrává. Jak to dělá?',
      sections: [
        {
          title: 'Proč právě uhlík',
          icon: 'atom',
          blocks: [
            { type: 'p', text: 'Uhlík vyhrává tak drtivě, že má celý vlastní obor: **organická chemie** je chemie sloučenin uhlíku. Pár jednoduchých látek jako $CO$, $CO2$, uhličitany nebo kyanidy ale patří do anorganiky (potkal/a jsi je v úrovni 7). Organické látky máš všude kolem sebe, i v sobě:' },
            { type: 'iconlist', items: [
              { icon: 'bread', title: 'Jídlo', text: 'cukry, tuky, bílkoviny' },
              { icon: 'phone', title: 'Plast telefonu' },
              { icon: 'fuel', title: 'Benzin' },
              { icon: 'pill', title: 'Léky', text: 'třeba ten na bolest hlavy' },
              { icon: 'dna', title: 'Tvoje DNA' },
            ] },
            { type: 'callout', variant: 'fact', title: 'Konec „životní síly“', text: 'Dřív se věřilo, že organické látky umí vyrobit jen živé organismy díky tajemné „životní síle“ (*vis vitalis*). V roce 1828 ale Friedrich Wöhler připravil v baňce močovinu z anorganického kyanatanu amonného. Tím začala moderní organická chemie.' },
            { type: 'p', text: 'Zpátky k otázce z úvodu: jak to uhlík dělá? Tajemství je v jeho vazbách. Uhlík má **4 valenční elektrony**, a tak tvoří **4 kovalentní vazby**: je **čtyřvazný**. Vazby $C-C$ jsou navíc pevné, takže se uhlíky řetězí prakticky donekonečna.' },
            { type: 'molecule', molecules: ['CH4'], labels: ['methan $CH4$: čtyřstěn, 109,5°'], caption: 'Čtyři vazby uhlíku míří do vrcholů čtyřstěnu. Otoč si model prstem.' },
            { type: 'p', text: 'Na papíře se čtyřstěn kreslí špatně, proto vazby zjednodušíme do kříže. Pozor: pravé úhly na nákresu nejsou skutečné úhly v molekule.' },
            { type: 'structure', art: s`
    H
    |
H — C — H
    |
    H`, caption: 'Methan na papíře: vazby kreslíme do kříže' },
            { type: 'p', text: 'Čtyři vazby a pevné spoje $C-C$ dávají uhlíku tři možnosti, jak stavět kostru molekuly:' },
            { type: 'iconlist', items: [
              { icon: 'protein', title: 'Dlouhé řetězce', text: 'rovné i rozvětvené' },
              { icon: 'arrow-cycle', title: 'Cykly', text: 'kruhy různé velikosti' },
              { icon: 'bond', title: 'Násobné vazby', text: 'jednoduché, dvojné i trojné' },
            ] },
            { type: 'p', text: 'Na kostru se pak navěšují další atomy. Kupodivu jich stačí jen pár druhů:' },
            { type: 'elements', symbols: ['C', 'H', 'O', 'N', 'S', 'Cl'], caption: 'Uhlík se pevně váže i na $H$, $O$, $N$, $S$ a halogeny. Z těchto prvků se skládá drtivá většina organických molekul.' },
            { type: 'p', text: 'Na třídění organických látek a počítání vazeb budeme v celé úrovni potřebovat tři pojmy:' },
            { type: 'keyterms', items: [
              { term: 'Vaznost', def: 'počet kovalentních vazeb, které atom v molekule obvykle tvoří' },
              { term: 'Uhlovodíky', def: 'sloučeniny složené jen z uhlíku a vodíku, např. methan $CH4$' },
              { term: 'Deriváty uhlovodíků', def: 'vzniknou náhradou vodíku jiným atomem nebo skupinou, např. $-OH$ nebo $-Cl$' },
            ] },
            { type: 'callout', variant: 'remember', title: 'Vaznosti v organice', text: '==Uhlík 4, dusík 3, kyslík 2, vodík a halogeny 1.== Když kreslíš vzorec, spočítej čáry u každého atomu. Uhlík s pěti vazbami neexistuje.' },
            { type: 'p', text: 'Čtyřvaznost uhlíku jsme zatím vzali jako fakt. V dalším oddílu se podíváme, kde se ty čtyři vazby berou a proč míří právě takhle.' },
            { type: 'check', question: { kind: 'tf', q: 'V organických molekulách tvoří atom uhlíku obvykle čtyři kovalentní vazby.', answer: true, explain: 'Uhlík má 4 valenční elektrony a každý z nich použije na jednu společnou elektronovou dvojici, je tedy čtyřvazný.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik kovalentních vazeb tvoří v organických molekulách atom kyslíku?', answer: 2, explain: 'Kyslík má 6 valenčních elektronů a do oktetu mu chybějí 2, proto je dvojvazný, jako v $H-O-H$ nebo $C-O-H$.' } },
          ],
        },
        {
          title: 'Hybridizace uhlíku: sp³, sp², sp',
          icon: 'electron',
          blocks: [
            { type: 'p', text: 'Tady je háček: uhlík má v základním stavu jen dva nepárové elektrony ($2s^{2} 2p^{2}$), a přesto tvoří čtyři rovnocenné vazby. Vysvětlení znáš z úrovně 3: jeden elektron přeskočí z $2s$ do $2p$ a orbitaly se „smíchají“ v nové, stejně tvarované **hybridní orbitaly**. Tomu smíchání říkáme **hybridizace**.' },
            { type: 'diagram', id: 'hybridization', caption: 'Tři typy hybridizace uhlíku: $sp^{3}$ (4 hybridní orbitaly, čtyřstěn, $CH4$), $sp^{2}$ (3 orbitaly v rovině a jeden nehybridizovaný orbital p, $C2H4$) a $sp$ (2 orbitaly na přímce a dva orbitaly p, $C2H2$).' },
            { type: 'p', text: 'Z obrázku si odnes hlavně jedno: počet hybridních orbitalů určuje tvar okolí uhlíku. Tabulka to shrnuje i s úhly a příklady:' },
            { type: 'table', headers: ['Hybridizace', 'Vazby uhlíku', 'Tvar a úhel', 'Příklad'], rows: [
              ['$sp^{3}$', '4 jednoduché (4 σ)', 'čtyřstěn, 109,5°', 'methan, ethan, každý $CH3$'],
              ['$sp^{2}$', '1 dvojná + 2 jednoduché (3 σ + 1 π)', 'trojúhelník v rovině, 120°', 'ethen, benzen, uhlík v $C=O$'],
              ['$sp$', '1 trojná + 1 jednoduchá nebo 2 dvojné (2 σ + 2 π)', 'přímka, 180°', 'ethyn, uhlík v $CO2$'],
            ], caption: 'Hybridizace určuje tvar molekuly kolem každého uhlíku' },
            { type: 'p', text: 'Úhly 109,5°, 120° a 180° jsou nejlépe vidět na trojrozměrných modelech nejjednodušších zástupců:' },
            { type: 'molecule', molecules: ['CH4', 'C2H4', 'C2H2'], labels: ['$sp^{3}$: methan, 109,5°', '$sp^{2}$: ethen, 120°', '$sp$: ethyn, 180°'], caption: 'Otoč si modely: čtyřstěn, rovina a přímka' },
            { type: 'p', text: 'Hybridní orbitaly tvoří **σ-vazby** přímo na spojnici jader. Nehybridizované orbitaly p se překrývají bokem nad a pod rovinou a tvoří **π-vazby**. Každá dvojná vazba je tedy σ + π, trojná σ + 2π (víc v lekci o alkenech).' },
            { type: 'callout', variant: 'tip', title: 'Rychlý trik', text: '==Spočítej, kolika atomům je uhlík přímo vázaný: 4 sousedé → $sp^{3}$, 3 sousedé → $sp^{2}$, 2 sousedé → $sp$.== Násobná vazba se počítá jako jeden soused.' },
            { type: 'p', text: 'Trik si vyzkoušej na molekule, ve které má každý uhlík jiné okolí:' },
            { type: 'example', title: 'Hybridizace v jedné molekule', problem: 'Urči hybridizaci obou uhlíků v kyselině octové $CH3-COOH$ a vazebné úhly kolem nich.', steps: [
              'Uhlík v $CH3$ má čtyři sousedy (3 × H a uhlík karboxylu), samé jednoduché vazby: $sp^{3}$, úhly asi 109,5°.',
              'Uhlík karboxylu má tři sousedy: $CH3$, $=O$ a $-OH$. Dvojná vazba $C=O$ se počítá jako jeden soused: $sp^{2}$, úhly asi 120°.',
            ], answer: '$CH3$: $sp^{3}$ (109,5°), $COOH$: $sp^{2}$ (120°)' },
            { type: 'p', text: 'Z počtu sousedů teď odhadneš tvar molekuly kolem každého uhlíku. Zbývá se naučit, jak takovou prostorovou molekulu zapsat na papír.' },
            { type: 'check', question: { kind: 'choice', q: 'Jakou hybridizaci mají oba uhlíky v ethynu $HC≡CH$ a jaký je úhel $H-C-C$?', options: ['$sp$, 180°', '$sp^{2}$, 120°', '$sp^{3}$, 109,5°', '$sp^{2}$, 180°'], answer: 0, explain: 'Každý uhlík má jen dva sousedy (vodík a druhý uhlík), proto je hybridizovaný $sp$ a molekula je lineární.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik uhlíků v hybridizaci $sp^{2}$ má propen $CH2=CH-CH3$?', answer: 2, explain: 'Oba uhlíky dvojné vazby mají tři sousedy ($sp^{2}$), koncový $CH3$ má čtyři ($sp^{3}$).' } },
          ],
        },
        {
          title: 'Jak molekulu zapsat: čtyři druhy vzorců',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Jednu molekulu zapíšeš několika způsoby a každý se hodí jinde. Ukážeme si je na ethanolu, alkoholu z piva a vína.' },
            { type: 'molecule', molecules: ['ethanol'], labels: ['ethanol $C2H6O$'], caption: 'Takhle molekula opravdu vypadá. Vzorce na papíře jsou jen její zkratky.' },
            { type: 'p', text: 'Každý ze čtyř druhů vzorců z ní zachytí něco jiného. Liší se hlavně tím, kolik toho o vazbách prozradí:' },
            { type: 'keyterms', items: [
              { term: 'Souhrnný (molekulový) vzorec', def: 'jen počty atomů: $C2H6O$. Neříká nic o tom, jak jsou atomy pospojované.' },
              { term: 'Strukturní (konstituční) vzorec', def: 'všechny atomy i všechny vazby nakreslené čarami' },
              { term: 'Racionální (zkrácený) vzorec', def: 'atomy seskupené kolem jednotlivých uhlíků: $CH3-CH2-OH$ nebo $CH3CH2OH$' },
              { term: 'Vazebný (čárový) vzorec', def: 'jen kostra: každý konec a každý zlom čáry je uhlík, vodíky na uhlících se nepíšou' },
            ] },
            { type: 'p', text: 'Strukturní vzorec ukazuje úplně všechno, a proto je u větších molekul nepřehledný. U ethanolu se ještě vejde:' },
            { type: 'structure', art: s`
    H   H
    |   |
H — C — C — O — H
    |   |
    H   H`, caption: 'Strukturní vzorec ethanolu' },
            { type: 'p', text: 'Chemici nejčastěji kreslí vazebné vzorce, protože jsou nejrychlejší. Vodíky si domýšlíš podle vaznosti, aby měl každý uhlík čtyři vazby:' },
            { type: 'structure', art: s`
/\/\      pentan
/\/\OH    butan-1-ol`, caption: 'Vazebné vzorce: 4 čárky spojují 5 bodů. U pentanu je v každém bodě uhlík, u butan-1-olu je na konci místo uhlíku skupina $OH$.' },
            { type: 'callout', variant: 'tip', title: 'Závorky v racionálním vzorci', text: 'Skupina v závorce je **větev**, která visí na uhlíku těsně před ní. $CH3-CH(CH3)-CH3$ je tedy prostřední uhlík se dvěma methyly po stranách a třetím methylem dole.' },
            { type: 'p', text: 'Se závorkami si teď poradíš. Zkus z racionálního vzorce vyčíst, kolik kterých atomů molekula má:' },
            { type: 'example', title: 'Z racionálního vzorce na souhrnný', problem: 'Jaký je souhrnný vzorec látky $CH3-CH(CH3)-CH2-OH$?', steps: [
              'Spočítej uhlíky: $CH3$, $CH$, $CH3$ v závorce a $CH2$, tedy 4 atomy C.',
              'Spočítej vodíky u každé skupiny zvlášť, nezapomeň ani na ten ve skupině $OH$: 3 + 1 + 3 + 2 + 1 = 10.',
              'Kyslík: 1 (ve skupině $OH$).',
            ], answer: '$C4H10O$' },
            { type: 'p', text: 'Vzorce už umíš číst i převádět. Teď se podíváme na samotnou uhlíkovou kostru a na to, podle čeho se řetězce třídí.' },
            { type: 'check', question: { kind: 'text', q: 'Napiš souhrnný vzorec butanu $CH3-CH2-CH2-CH3$.', accept: ['C4H10'], caseSensitive: true, placeholder: 'např. C2H6', explain: 'Uhlíky: 4. Vodíky: 3 + 2 + 2 + 3 = 10. Souhrnný vzorec je $C4H10$.' } },
          ],
        },
        {
          title: 'Uhlíkaté řetězce',
          icon: 'bond',
          blocks: [
            { type: 'p', text: 'Ve vazebném vzorci zbyla jen kostra, a právě ta je pro třídění nejdůležitější. Uhlíková „kostra“ molekuly je **uhlíkatý řetězec**. Podle jejího tvaru látky třídíme dřív, než řešíme další atomy.' },
            { type: 'molecule', molecules: ['butane', 'isobutane', 'cyclohexane', 'benzene'], labels: ['butan: nerozvětvený', '2-methylpropan: rozvětvený', 'cyklohexan: alicyklický', 'benzen: aromatický'] },
            { type: 'p', text: 'Čtyři molekuly nahoře se od sebe liší v několika ohledech najednou. Tabulka je rozebere podle pěti hledisek:' },
            { type: 'table', headers: ['Hledisko', 'Typy', 'Příklad'], rows: [
              ['uzavření', '**acyklický** (otevřený) × **cyklický** (kruh)', 'butan × cyklohexan'],
              ['větvení', '**nerozvětvený** × **rozvětvený**', 'butan × 2-methylpropan'],
              ['násobné vazby', '**nasycený** (jen jednoduché) × **nenasycený** (dvojná, trojná)', 'ethan × ethen'],
              ['druh cyklu', '**alicyklický** × **aromatický** (benzenové jádro)', 'cyklohexan × benzen'],
              ['atomy v cyklu', '**karbocyklický** (jen C) × **heterocyklický** (i N, O, S)', 'benzen × pyridin'],
            ], caption: 'Třídění uhlíkatých řetězců' },
            { type: 'p', text: 'Jednotlivé uhlíky rozlišujeme podle toho, na kolik **dalších uhlíků** jsou navázané. Budeš to potřebovat u názvosloví i u alkoholů.' },
            { type: 'keyterms', items: [
              { term: 'Primární uhlík', def: 'vázaný na 1 další uhlík' },
              { term: 'Sekundární uhlík', def: 'vázaný na 2 další uhlíky' },
              { term: 'Terciární uhlík', def: 'vázaný na 3 další uhlíky' },
              { term: 'Kvartérní uhlík', def: 'vázaný na 4 další uhlíky' },
            ] },
            { type: 'p', text: 'Všechny čtyři druhy uhlíků najdeš v jedné molekule, v isooktanu z benzinu:' },
            { type: 'structure', art: s`
      CH3
      |
CH3 — C — CH2 — CH — CH3
      |          |
      CH3        CH3`, caption: 'Isooktan: všechny $CH3$ jsou primární, $CH2$ je sekundární, $CH$ terciární a $C$ bez vodíků kvartérní' },
            { type: 'callout', variant: 'tip', text: 'U alkanů to poznáš podle vodíků: $CH3$ je primární, $CH2$ sekundární, $CH$ terciární a $C$ kvartérní. U derivátů ale raději počítej sousední uhlíky, protože vodík může nahradit jiná skupina.' },
            { type: 'p', text: 'Kostru už umíš popsat. Co když ale mají dvě látky přesně stejné atomy a liší se jen tím, jak je kostra poskládaná?' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď k látce, jaký má řetězec.', pairs: [
              ['butan', 'acyklický, nerozvětvený, nasycený'],
              ['cyklohexan', 'cyklický, alicyklický'],
              ['benzen', 'cyklický, aromatický'],
              ['ethen', 'acyklický, nenasycený'],
            ], explain: 'Butan je rovný řetězec s jednoduchými vazbami, ethen má dvojnou vazbu, cyklohexan je obyčejný kruh a benzen aromatický kruh.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik primárních uhlíků má isooktan (2,2,4-trimethylpentan) nakreslený výše?', answer: 5, explain: 'Primární jsou všechny skupiny $CH3$: dvě na koncích hlavního řetězce a tři methylové větve, celkem 5.' } },
          ],
        },
        {
          title: 'Izomery: stejný vzorec, jiná molekula',
          icon: 'molecule',
          blocks: [
            { type: 'p', text: 'Takové látky existují a je jich obrovské množství. **Izomery** jsou látky se **stejným souhrnným vzorcem**, ale jinou strukturou, a proto i jinými vlastnostmi. U **konstitučních izomerů** se liší pořadí, v jakém jsou atomy pospojované.' },
            { type: 'compare', columns: [
              { title: 'Řetězcová', tone: 'a', points: ['jiný tvar uhlíkatého řetězce', 'butan × 2-methylpropan ($C4H10$)'] },
              { title: 'Polohová', tone: 'b', points: ['stejná skupina nebo násobná vazba na jiném místě řetězce', 'propan-1-ol × propan-2-ol ($C3H8O$)'] },
              { title: 'Funkční (skupinová)', tone: 'c', points: ['úplně jiná funkční skupina', 'ethanol × dimethylether ($C2H6O$)'] },
            ], caption: 'Tři druhy konstituční izomerie' },
            { type: 'p', text: 'Že nejde jen o jiný obrázek na papíře, prozradí teploty varu. Porovnej je u izomerů na obrázku:' },
            { type: 'diagram', id: 'isomers', caption: 'Stejný vzorec, jiné vlastnosti: řetězcové izomery $C4H10$ (butan a 2-methylpropan) a funkční izomery $C2H6O$ (kapalný ethanol a plynný dimethylether), všechny s teplotou varu. Obrázek ukazuje i cis/trans a optickou izomerii, kterým se věnuje další část.' },
            { type: 'p', text: 'Polohovou izomerii obrázek neukazuje, tak ji uvidíš na dvou propanolech. Liší se jen tím, na kterém uhlíku sedí skupina $OH$:' },
            { type: 'structure', art: s`
CH3 — CH2 — CH2 — OH

CH3 — CH — CH3
      |
      OH`, caption: 'Polohové izomery $C3H8O$: propan-1-ol (var 97 °C) a propan-2-ol (var 82 °C)' },
            { type: 'callout', variant: 'fact', text: 'Izomerů přibývá závratně rychle. $C4H10$ má 2, $C5H12$ 3, $C6H14$ 5, $C10H22$ už 75 a $C20H42$ neuvěřitelných 366 319.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Rozhoduj rychle a otestuj, co víš o vzorcích a izomerech.' },
            { type: 'p', text: 'Konstituční izomery se liší tím, co je s čím spojené. Existují ale i izomery, které mají spojení úplně stejná, a přesto jsou to dvě různé látky.' },
            { type: 'check', question: { kind: 'choice', q: 'Ethanol $CH3CH2OH$ a dimethylether $CH3OCH3$ jsou izomery…', options: ['funkční', 'řetězcové', 'polohové', 'optické'], answer: 0, explain: 'Oba mají vzorec $C2H6O$, ale ethanol je alkohol ($-OH$) a dimethylether je ether ($C-O-C$). Liší se funkční skupinou.' } },
            { type: 'check', question: { kind: 'tf', q: 'Izomery mají vždy stejnou teplotu varu, protože mají stejnou molární hmotnost.', answer: false, explain: 'Stejná molární hmotnost nestačí. Ethanol vře při 78 °C, dimethylether už při −24 °C, protože jen ethanol tvoří vodíkové můstky.' } },
          ],
        },
        {
          title: 'Stereoizomerie: když rozhoduje prostor',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'To je druhá velká skupina izomerů. U **stereoizomerů** jsou atomy pospojované stejně, liší se jen **uspořádáním v prostoru**. Pro tvůj nos nebo enzymy v těle jde ale o úplně jiné molekuly.' },
            { type: 'h', text: 'Cis/trans izomerie' },
            { type: 'p', text: 'Kolem dvojné vazby se atomy nemohou volně otáčet (proč, uvidíš v lekci o alkenech). Nese-li každý uhlík dvojné vazby dva **různé** substituenty, vzniká izomer **cis** (stejné skupiny na stejné straně) a **trans** (na opačných stranách).' },
            { type: 'molecule', molecules: ['cis-but-2-ene', 'trans-but-2-ene'], labels: ['cis-but-2-en: methyly na stejné straně', 'trans-but-2-en: methyly na opačných stranách'], caption: 'Cis a trans izomer but-2-enu' },
            { type: 'callout', variant: 'fact', title: 'Trans-tuky', text: 'Cis a trans izomery mají různé fyzikální vlastnosti. Nenasycené mastné kyseliny v přírodních olejích jsou většinou cis. Trans-tuky, které vznikají hlavně při průmyslovém ztužování olejů, škodí srdci a cévám.' },
            { type: 'h', text: 'Obecnější zápis: E/Z' },
            { type: 'p', text: 'Názvy cis/trans selžou, když jsou na dvojné vazbě tři nebo čtyři různé skupiny: co je pak „stejná“ skupina? IUPAC proto používá systém **E/Z**. Na každém uhlíku dvojné vazby urči skupinu s **vyšší prioritou**: vyhrává atom s vyšším **protonovým číslem** navázaný přímo na uhlík, při shodě se porovnávají atomy o krok dál (pravidla CIP).' },
            { type: 'compare', columns: [
              { title: 'Z (z němčiny *zusammen*, spolu)', tone: 'a', points: ['skupiny s vyšší prioritou jsou na **stejné** straně dvojné vazby', 'u but-2-enu je to totéž co cis'] },
              { title: 'E (z němčiny *entgegen*, naproti)', tone: 'b', points: ['skupiny s vyšší prioritou jsou na **opačných** stranách', 'u but-2-enu je to totéž co trans'] },
            ] },
            { type: 'p', text: 'Vyzkoušej to na molekule, kde cis/trans nepomůže: na jednom uhlíku je brom a chlor, na druhém methyl a vodík.' },
            { type: 'structure', art: s`
Br         CH3
  \       /
   C  =  C
  /       \
Cl         H`, caption: '1-brom-1-chlorprop-1-en: který izomer to je?' },
            { type: 'p', text: 'Postup je pokaždé stejný: najdi skupinu s vyšší prioritou na levém uhlíku, pak na pravém, a nakonec porovnej, na které straně leží.' },
            { type: 'example', title: 'E, nebo Z?', problem: 'Urči, zda nakreslený 1-brom-1-chlorprop-1-en je izomer E, nebo Z.', steps: [
              'Levý uhlík nese $Br$ (Z = 35) a $Cl$ (Z = 17). Vyšší prioritu má **brom** (nahoře).',
              'Pravý uhlík nese $CH3$ (atom C, Z = 6) a $H$ (Z = 1). Vyšší prioritu má **methyl** (nahoře).',
              'Obě skupiny s vyšší prioritou jsou nahoře, tedy na stejné straně dvojné vazby. Na $Cl$ a $H$ už nehledíme, rozhodují jen vítězové.',
            ], answer: '**(Z)-1-brom-1-chlorprop-1-en**' },
            { type: 'callout', variant: 'warning', text: 'Cis a Z se často kryjí, ale ne vždy. Cis/trans porovnává stejné skupiny, E/Z skupiny s vyšší prioritou. Když se ptají na E/Z, vždy počítej priority.' },
            { type: 'h', text: 'Optická izomerie a chiralita' },
            { type: 'p', text: 'Uhlík se **čtyřmi různými** atomy nebo skupinami je **chirální** (asymetrický). Molekula s ním existuje ve dvou zrcadlových podobách, které nejdou na sebe přiložit, jako levá a pravá ruka. Takové dvojici říkáme **enantiomery** (optické izomery).' },
            { type: 'molecule', molecules: ['lactic-acid'], labels: ['kyselina mléčná'], caption: 'Prostřední uhlík nese $H$, $OH$, $CH3$ a $COOH$: čtyři různé skupiny, chirální uhlík.' },
            { type: 'p', text: 'Na první pohled jsou enantiomery k nerozeznání. Rozdíl se projeví, až když na ně posvítíš polarizovaným světlem nebo když se setkají s jinou chirální molekulou:' },
            { type: 'compare', columns: [
              { title: 'Enantiomery mají stejnou', icon: 'check', tone: 'a', points: ['teplotu varu', 'hustotu'] },
              { title: 'Enantiomery se liší', icon: 'magnifier', tone: 'b', points: ['stáčejí rovinu polarizovaného světla na opačné strany (proto „optické“)', 'jinak reagují s chirálními molekulami: s receptory v nose nebo s enzymy'] },
            ] },
            { type: 'callout', variant: 'fact', title: 'Máta, nebo kmín?', text: 'Karvon existuje ve dvou enantiomerech. Jeden voní jako máta klasnatá, jeho zrcadlový obraz jako kmín. Tvůj nos je chirální detektor.' },
            { type: 'callout', variant: 'warning', title: 'Tragédie thalidomidu', text: 'Lék thalidomid (Contergan) se koncem 50. let podával těhotným proti nevolnosti. Jeden enantiomer uklidňuje, druhý poškozuje vývoj plodu, a v těle se navíc mění jeden v druhý. Narodily se tisíce dětí s vážnými vadami končetin. Od té doby se u léků musí zkoumat každý enantiomer zvlášť.' },
            { type: 'p', text: 'Teď umíš molekulu zapsat, roztřídit a poznat její izomery. V příští lekci začneme u nejjednodušších organických látek: u alkanů, které hoří v plynovém sporáku i v motoru auta.' },
            { type: 'check', question: { kind: 'multi', q: 'Které molekuly obsahují chirální uhlík?', options: [
              'butan-2-ol $CH3-CH(OH)-CH2-CH3$',
              'propan-2-ol $CH3-CH(OH)-CH3$',
              'kyselina mléčná $CH3-CH(OH)-COOH$',
              'ethanol $CH3-CH2-OH$',
              '2-chlorbutan $CH3-CHCl-CH2-CH3$',
            ], answers: [0, 2, 4], explain: 'Chirální uhlík nese čtyři různé skupiny. V propan-2-olu jsou na uhlíku s $OH$ dva stejné methyly a v ethanolu nese každý uhlík aspoň dva vodíky.' } },
          ],
        },
      ],
      summary: [
        'Uhlík je čtyřvazný a pevně se váže sám na sebe, proto tvoří řetězce, větve i cykly.',
        'Uhlík se čtyřmi sousedy je $sp^{3}$ (109,5°), se třemi $sp^{2}$ (120°) a se dvěma $sp$ (180°).',
        'Souhrnný vzorec udává složení, strukturní všechny vazby, racionální skupiny atomů a vazebný jen uhlíkovou kostru.',
        'Izomery mají stejný souhrnný vzorec, ale jinou strukturu; konstituční izomerie je řetězcová, polohová nebo funkční.',
        'Cis/trans (obecněji E/Z) izomerie vzniká u dvojné vazby; Z znamená skupiny s vyšší prioritou na stejné straně.',
        'Chirální uhlík nese čtyři různé skupiny; jeho enantiomery mohou mít v těle úplně jiné účinky, jak ukázal thalidomid.',
      ],
      quiz: [
        { kind: 'choice', q: 'Proč tvoří uhlík tolik sloučenin?', options: [
          'Je čtyřvazný a tvoří pevné vazby $C-C$, takže vytváří řetězce a cykly',
          'Je nejrozšířenějším prvkem v zemské kůře',
          'Snadno tvoří ionty $C^4+$ i $C^4-$',
          'Má nejvyšší elektronegativitu ze všech prvků',
        ], answer: 0, explain: 'Klíčem je čtyřvaznost a pevné vazby uhlík–uhlík. Uhlík netvoří jednoduché ionty a nejelektronegativnější je fluor.' },
        { kind: 'tf', q: 'Vazebný (čárový) vzorec ukazuje všechny atomy vodíku navázané na uhlík.', answer: false, explain: 'Ve vazebném vzorci se vodíky na uhlících nekreslí. Domýšlíš si je tak, aby měl každý uhlík čtyři vazby.' },
        { kind: 'text', q: 'Napiš souhrnný vzorec látky $CH3-CH2-CH(CH3)-CH3$.', accept: ['C5H12'], caseSensitive: true, placeholder: 'např. C4H10', explain: 'Uhlíky: 5. Vodíky: 3 + 2 + 1 + 3 + 3 = 12. Jde o 2-methylbutan, izomer pentanu.' },
        { kind: 'match', q: 'Přiřaď dvojici izomerů k typu izomerie.', pairs: [
          ['butan a 2-methylpropan', 'řetězcová'],
          ['propan-1-ol a propan-2-ol', 'polohová'],
          ['ethanol a dimethylether', 'funkční'],
          ['cis- a trans-but-2-en', 'cis/trans (geometrická)'],
        ], explain: 'Jiný řetězec, jiná poloha skupiny, jiná funkční skupina, jiné prostorové uspořádání u dvojné vazby.' },
        { kind: 'choice', q: 'Na jednom uhlíku dvojné vazby je $Cl$ a $H$, na druhém $CH3$ a $CH2CH3$. Chlor a ethyl jsou na stejné straně. Který je to izomer?', options: ['Z', 'E', 'nejde o stereoizomer', 'nedá se určit bez názvu'], answer: 0, explain: 'Na prvním uhlíku vyhrává $Cl$ (Z = 17) nad $H$. Na druhém vyhrává ethyl nad methylem, protože o krok dál má uhlík místo vodíku. Skupiny s vyšší prioritou jsou spolu: izomer Z.' },
        { kind: 'multi', q: 'Co musí platit, aby alken měl cis a trans izomer?', options: [
          'Obsahuje dvojnou vazbu $C=C$',
          'Každý uhlík dvojné vazby nese dvě různé skupiny',
          'Obsahuje chirální uhlík',
          'Kolem dvojné vazby se nelze volně otáčet',
          'Má aspoň šest uhlíků',
        ], answers: [0, 1, 3], explain: 'Cis/trans izomerie potřebuje „zamčenou“ dvojnou vazbu a na každém jejím uhlíku dvě různé skupiny. Chirální uhlík ani délka řetězce nejsou podmínkou.' },
        { kind: 'tf', q: 'Enantiomery mají stejnou teplotu varu, ale v těle mohou mít úplně jiné účinky.', answer: true, explain: 'Fyzikální vlastnosti mají stejné, ale s chirálními receptory a enzymy reagují jinak. Příkladem je karvon (máta × kmín) nebo thalidomid.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-2
    'l8-2': {
      id: 'l8-2',
      title: 'Alkany a cykloalkany',
      goals: [
        'Napsat vzorce a názvy alkanů $C1$ až $C10$ a vysvětlit, co je homologická řada',
        'Pojmenovat rozvětvený alkan podle pravidel IUPAC a nakreslit vzorec podle názvu',
        'Popsat hoření alkanů a mechanismus radikálové substituce',
        'Vysvětlit, jak se ropa zpracovává destilací a krakováním a co znamená oktanové číslo',
      ],
      hook: 'Plyn ve sporáku, benzin v autě, vosk ve svíčce i asfalt na silnici. To všechno jsou v podstatě stejné molekuly: uhlíky a vodíky v řadě, jen různě dlouhé. Jak může délka řetězce udělat z plynu asfalt?',
      sections: [
        {
          title: 'Homologická řada alkanů',
          icon: 'chart',
          blocks: [
            { type: 'p', text: 'Plyn, benzin, vosk i asfalt z úvodu patří do jedné rodiny. **Alkany** jsou nasycené acyklické uhlovodíky: jen uhlík, vodík a jednoduché vazby. Jejich obecný vzorec je $C_{n}H_{2n+2}$. Nejkratší z nich znáš ze sporáku a ze zapalovače:' },
            { type: 'molecule', molecules: ['CH4', 'C2H6', 'C3H8', 'butane'], labels: ['methan $CH4$', 'ethan $C2H6$', 'propan $C3H8$', 'butan $C4H10$'], caption: 'První čtyři alkany: každý je o jednu skupinu $-CH2-$ delší' },
            { type: 'p', text: 'Řadě látek, které se liší právě o $CH2$, říkáme **homologická řada** a jejím členům **homology**. Mají podobné chemické vlastnosti a jejich fyzikální vlastnosti se mění postupně.' },
            { type: 'diagram', id: 'homologous-series', caption: 'Homologická řada nerozvětvených alkanů od methanu po dekan: v každém řádku přibude skupina $-CH2-$. Vedle vazebného a souhrnného vzorce je teplota varu; methan až butan jsou při 25 °C plyny, od pentanu kapaliny.' },
            { type: 'callout', variant: 'tip', title: 'Jak si zapamatovat názvy', text: 'První čtyři mají historické názvy: **meth-, eth-, prop-, but-**. Od pěti uhlíků se používají řecké číslovky (u devítky latinská): **pent**-, **hex**-, **hept**-, **okt**-, **non**-, **dek**-. Stejně jako pentagon, hexagon nebo oktopus s osmi chapadly.' },
            { type: 'p', text: 'Z názvů alkanů se odvozují i názvy větví. Budeš je potřebovat hned v dalším oddílu:' },
            { type: 'keyterms', items: [
              { term: 'Alkyl', def: 'zbytek alkanu po odtržení jednoho vodíku; koncovka -an se mění na **-yl**: methyl $CH3-$, ethyl $CH3-CH2-$, propyl $CH3-CH2-CH2-$' },
              { term: 'Methylenová skupina', def: '$-CH2-$, o kterou se liší sousední homology' },
            ] },
            { type: 'p', text: 'Řadu od methanu po dekan už znáš. Od butanu dál se ale řetězec může i větvit, a pak samotný počet uhlíků k názvu nestačí.' },
            { type: 'check', question: { kind: 'number', q: 'Kolik atomů vodíku má alkan s 12 uhlíky (dodekan)?', answer: 26, explain: 'Podle vzorce $C_{n}H_{2n+2}$: 2 · 12 + 2 = 26, tedy $C12H26$.' } },
            { type: 'check', question: { kind: 'text', q: 'Jak se jmenuje alkan $C7H16$?', accept: ['heptan'], explain: 'Sedm uhlíků, řecká číslovka hepta-, koncovka -an: heptan.' } },
          ],
        },
        {
          title: 'Jak pojmenovat rozvětvený alkan',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Nerozvětvený alkan se jmenuje podle počtu uhlíků. U rozvětveného postupuješ jako detektiv: najdi páteř, očísluj ji a pojmenuj větve.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'magnifier', title: 'Hlavní řetězec', text: 'nejdelší souvislý řetězec uhlíků; nemusí vést rovně. Při shodě vyber ten s více větvemi.' },
              { icon: 'calculator', title: 'Očíslování', text: 'od konce, ke kterému je **nejblíž první větev**, aby čísla poloh (**lokanty**) byla co nejnižší' },
              { icon: 'bond', title: 'Větve jako alkyly', text: 'methyl, ethyl…, před každou číslo uhlíku, na kterém visí' },
              { icon: 'molecule', title: 'Násobicí předpony', text: 'stejné větve spoj předponou di-, tri-, tetra-; každá má vlastní lokant: 2,2-dimethyl' },
              { icon: 'book', title: 'Abecedně', text: 'různé větve podle abecedy, násobicí předpony se nepočítají: ethyl před methyl' },
              { icon: 'check', title: 'Celý název', text: 'nakonec název hlavního řetězce; čísla odděl čárkou, číslo od písmene spojovníkem, vše jedním slovem' },
            ], caption: 'Šest kroků k názvu rozvětveného alkanu' },
            { type: 'p', text: 'Pravidla nejdřív vyzkoušej na nejjednodušším rozvětveném alkanu. Nejdelší řetězec tu má tři uhlíky a methyl visí na prostředním:' },
            { type: 'molecule', molecules: ['isobutane'], labels: ['2-methylpropan: hlavní řetězec 3 uhlíky, methyl na C2'], caption: 'Nejjednodušší rozvětvený alkan' },
            { type: 'p', text: 'Teď těžší molekula. Než se podíváš na řešení, zkus v ní sám/sama najít nejdelší řetězec:' },
            { type: 'structure', art: s`
CH3 — CH — CH2 — CH — CH3
      |          |
      CH3        CH2
                 |
                 CH3`, caption: 'Příklad 1: jak se tahle molekula jmenuje?' },
            { type: 'p', text: 'Pozor, tady se chybuje nejčastěji: vodorovná řada ještě nemusí být hlavní řetězec. Spočítej uhlíky po všech možných cestách:' },
            { type: 'example', title: 'Hlavní řetězec nemusí vést rovně', problem: 'Pojmenuj alkan z příkladu 1.', steps: [
              'Nejdelší řetězec vede z levého $CH3$ přes $CH$, $CH2$, $CH$ a pak dolů přes $CH2$ do $CH3$. Má **6 uhlíků**, základ je tedy **hexan**. Vodorovná řada má jen 5.',
              'Větve: dva methyly, jeden pod prvním $CH$ a druhý je pravý koncový $CH3$.',
              'Číslování zleva dá methylům lokanty 2 a 4, číslování zdola 3 a 5. Nižší lokanty vyhrávají.',
              'Dva stejné methyly spojíš předponou **di**: 2,4-dimethyl.',
            ], answer: '**2,4-dimethylhexan**' },
            { type: 'p', text: 'Druhý příklad má větve dvou různých druhů, takže se uplatní i abecední pořadí:' },
            { type: 'structure', art: s`
CH3 — CH — CH — CH2 — CH2 — CH3
      |    |
      CH3  CH2
           |
           CH3`, caption: 'Příklad 2: dvě různé větve' },
            { type: 'p', text: 'Tady najdeš dva stejně dlouhé řetězce. Rozhodne pravidlo z prvního kroku: vyhrává ten s více větvemi.' },
            { type: 'example', title: 'Dvě různé větve', problem: 'Pojmenuj alkan z příkladu 2.', steps: [
              'Nejdelší řetězec má 6 uhlíků. Vodorovný řetězec i řetězec vedoucí přes ethyl jsou stejně dlouhé, vodorovný má ale dvě větve, a proto vyhrává.',
              'Číslování zleva: methyl na C2, ethyl na C3. Zprava by vyšly lokanty 4 a 5.',
              'Abecední pořadí: **e**thyl před **m**ethyl.',
            ], answer: '**3-ethyl-2-methylhexan**' },
            { type: 'p', text: 'Často potřebuješ opačný postup: máš název a kreslíš vzorec. Začni od konce názvu, tedy od hlavního řetězce, a větve přidej až potom:' },
            { type: 'example', title: 'Od názvu ke vzorci', problem: 'Nakresli 2,2,4-trimethylpentan (isooktan).', steps: [
              'Základ **pentan**: nakresli řetězec 5 uhlíků a očísluj ho 1–5.',
              'Na uhlík 2 připoj dva methyly, na uhlík 4 jeden methyl.',
              'Doplň vodíky tak, aby měl každý uhlík čtyři vazby.',
            ], answer: '$CH3-C(CH3)2-CH2-CH(CH3)-CH3$, souhrnně $C8H18$ (vzorec už znáš z první lekce)' },
            { type: 'callout', variant: 'warning', title: 'Nejčastější chyby', text: 'Název „1-methyl…“ nikdy nevznikne, methyl na konci řetězce ho jen prodlužuje. A když ti vyjde „2-ethyl…“, zvolil/a jsi hlavní řetězec moc krátký: 2-ethylpentan je ve skutečnosti 3-methylhexan.' },
            { type: 'p', text: 'Alkany už umíš pojmenovat. Teď se podíváme, jak se chovají: proč jsou některé plyny a jiné pevné látky a proč tak dobře hoří.' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj alkan $CH3-CH(CH3)-CH(CH3)-CH3$.', accept: ['2,3-dimethylbutan', '2,3 dimethylbutan', '2, 3-dimethylbutan'], explain: 'Hlavní řetězec má 4 uhlíky (butan), methyly jsou na C2 a C3 z obou stran: 2,3-dimethylbutan.' } },
            { type: 'check', question: { kind: 'choice', q: 'Který z názvů je utvořený správně?', options: ['3-methylhexan', '2-ethylpentan', '4-methylhexan', '1-methylpentan'], answer: 0, explain: '2-ethylpentan je správně 3-methylhexan, 4-methylhexan se má číslovat z druhé strany (3-methylhexan) a 1-methylpentan je prostě hexan.' } },
          ],
        },
        {
          title: 'Vlastnosti a hoření alkanů',
          icon: 'flame',
          blocks: [
            { type: 'p', text: 'Vraťme se k otázce z úvodu: jak může délka řetězce udělat z plynu asfalt? Alkany jsou **nepolární**: ve vodě se nerozpouštějí a plavou na ní (benzin na hladině), rozpouštějí ale tuky. Mezi molekulami působí jen slabé **disperzní (Londonovy) síly** (úroveň 3). Čím delší řetězec, tím větší styčná plocha a vyšší teplota varu. Proto se skupenství mění s počtem uhlíků:' },
            { type: 'iconlist', items: [
              { icon: 'gas-cloud', title: '$C1–C4$: plyny', text: 'methan až butan' },
              { icon: 'drop', title: 'zhruba $C5–C16$: kapaliny', text: 'benzin, petrolej, nafta' },
              { icon: 'crystal', title: 'delší: pevné látky', text: 'třeba parafín ve svíčce' },
            ] },
            { type: 'p', text: 'Délka ale není všechno. Porovnej tři izomery pentanu, které mají stejný počet uhlíků i stejnou molární hmotnost:' },
            { type: 'table', headers: ['Izomer $C5H12$', 'Tvar molekuly', 'Teplota varu'], rows: [
              ['pentan', 'dlouhý, rovný', '36 °C'],
              ['2-methylbutan', 'jedna větev', '28 °C'],
              ['2,2-dimethylpropan', 'téměř kulovitý', '10 °C'],
            ], caption: 'Větvení snižuje teplotu varu' },
            { type: 'callout', variant: 'remember', text: '==Delší řetězec → vyšší teplota varu, víc větví → nižší teplota varu.== Rozvětvená molekula je kompaktnější a dotýká se sousedů menší plochou.' },
            { type: 'p', text: 'Chemicky jsou alkany líné: starý název **parafíny** pochází z latinského *parum affinis*, „málo slučivý“. S kyselinami, zásadami ani běžnými oxidovadly nereagují. Zvládají ale hoření a radikálovou substituci.' },
            { type: 'reaction', equation: 'CH4 + 2O2 -> CO2 + 2H2O', caption: 'dokonalé hoření methanu, uvolní se asi 890 kJ na 1 mol methanu' },
            { type: 'p', text: 'Takhle hoří methan ve sporáku, když má plamen dost vzduchu. Když kyslík chybí, vzniknou jiné produkty:' },
            { type: 'compare', columns: [
              { title: 'Dokonalé hoření', icon: 'flame', tone: 'good', points: ['dost kyslíku', 'vzniká $CO2$ a $H2O$'] },
              { title: 'Nedokonalé hoření', icon: 'warning', tone: 'bad', points: ['kyslíku je málo', 'vzniká jedovatý oxid uhelnatý $CO$ nebo saze (čistý uhlík)'] },
            ] },
            { type: 'p', text: 'V rovnici nedokonalého hoření si všimni, že na stejné množství methanu stačí méně kyslíku než při dokonalém hoření:' },
            { type: 'reaction', equation: '2CH4 + 3O2 -> 2CO + 4H2O', caption: 'nedokonalé hoření methanu' },
            { type: 'callout', variant: 'warning', title: 'Tichý zabiják', text: 'Oxid uhelnatý $CO$ nevidíš ani necítíš a váže se na hemoglobin mnohem pevněji než kyslík. Špatně seřízený plynový kotel nebo karma v koupelně bez větrání může zabíjet. Detektor $CO$ za pár stovek korun zachraňuje životy.' },
            { type: 'p', text: 'Rovnice hoření budeš vyčíslovat často. Postup je vždycky stejný, ukážeme si ho na butanu:' },
            { type: 'example', title: 'Vyčíslení hoření', problem: 'Vyčísli rovnici dokonalého hoření butanu $C4H10$ (plyn v zapalovači).', steps: [
              'Kostra rovnice: $C4H10 + O2 -> CO2 + H2O$',
              'Uhlíky: 4, tedy $4CO2$. Vodíky: 10, tedy $5H2O$.',
              'Kyslík vyčísli až nakonec, protože je vlevo jen v $O2$ a nic dalšího nerozhází. Vpravo je 4 · 2 + 5 = 13 atomů, potřebuješ tedy 13/2 molekuly $O2$.',
              'Zlomek odstraníš tak, že celou rovnici vynásobíš dvěma.',
            ], answer: '$2C4H10 + 13O2 -> 8CO2 + 10H2O$' },
            { type: 'p', text: 'Hoření je ale jen jedna ze dvou reakcí, které líné alkany zvládají. Ta druhá z nich vyrábí z alkanů halogenderiváty.' },
            { type: 'check', question: { kind: 'number', q: 'Kolik molekul kyslíku spotřebuje dokonalé hoření jedné molekuly propanu $C3H8$?', answer: 5, explain: '$C3H8 + 5O2 -> 3CO2 + 4H2O$. Vpravo je 3 · 2 + 4 = 10 atomů kyslíku, tedy 5 molekul $O2$.' } },
          ],
        },
        {
          title: 'Radikálová substituce',
          icon: 'sun',
          blocks: [
            { type: 'p', text: 'Druhá reakce potřebuje energii zvenčí. Za světla nebo za vysoké teploty reagují alkany s halogeny: atom vodíku se vymění za atom halogenu. Jde o **substituci** (nahrazení) přes radikály, tedy **radikálovou substituci** ($S_{R}$).' },
            { type: 'reaction', equation: 'CH4 + Cl2 -> CH3Cl + HCl', caption: 'chlorace methanu za UV záření ($hν$), vzniká chlormethan' },
            { type: 'p', text: 'Rovnice vypadá nevinně, ale neříká nic o tom, jak reakce proběhne. K tomu potřebujeme tři nové pojmy:' },
            { type: 'keyterms', items: [
              { term: 'Radikál', def: 'částice s nepárovým elektronem, značí se tečkou: $Cl·$, $·CH3$. Je extrémně reaktivní.' },
              { term: 'Homolytické štěpení', def: 'vazba se rozpadne tak, že si každý atom vezme jeden elektron ze sdíleného páru.' },
              { term: 'Řetězová reakce', def: 'každý krok vytvoří nový radikál, který spustí další krok.' },
            ] },
            { type: 'p', text: 'S nimi už přečteš celý mechanismus. Sleduj, kde radikály vznikají a kde zanikají:' },
            { type: 'diagram', id: 'substitution-mechanism', caption: 'Mechanismus chlorace methanu krok za krokem: iniciace (světlo rozštěpí $Cl2$ na dva radikály), dva kroky propagace a terminace. Jediný foton spustí řetěz, který se mnohokrát zopakuje, než ho terminace zastaví.' },
            { type: 'p', text: 'Stejné tři fáze ještě jednou, tentokrát s rovnicemi. U každé si všimni, co se děje s počtem radikálů:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'sun', title: '1. Iniciace', text: 'UV záření homolyticky rozštěpí molekulu chloru: $Cl2 -> 2Cl·$. Radikály vznikají.' },
              { icon: 'arrow-cycle', title: '2. Propagace', text: '$Cl· + CH4 -> HCl + ·CH3$ a pak $·CH3 + Cl2 -> CH3Cl + Cl·$. Radikál se spotřebuje, ale jiný vznikne, takže řetěz běží dál.' },
              { icon: 'check', title: '3. Terminace', text: 'dva radikály se spojí: $Cl· + Cl· -> Cl2$, $·CH3 + Cl· -> CH3Cl$ nebo $·CH3 + ·CH3 -> C2H6$. Radikály zanikají.' },
            ], caption: 'Tři fáze řetězové reakce. Počet radikálů při iniciaci roste, při propagaci se nemění a při terminaci klesá.' },
            { type: 'callout', variant: 'fact', title: 'Důkaz mechanismu', text: 'Ve směsi po chloraci methanu se najde i trocha **ethanu** $C2H6$. Ten může vzniknout jedině spojením dvou methylových radikálů při terminaci. Stopový produkt tak prozradil, že reakce opravdu běží přes radikály.' },
            { type: 'p', text: 'U jednoho vodíku to ale nekončí. Postupně se vymění i další, a tak vzniká směs chlorderivátů.' },
            { type: 'molecule', molecules: ['CH3Cl', 'CH2Cl2', 'CCl4'], labels: ['chlormethan $CH3Cl$', 'dichlormethan $CH2Cl2$', 'tetrachlormethan $CCl4$'], caption: 'Mezi nimi vzniká i trichlormethan $CHCl3$ (chloroform).' },
            { type: 'callout', variant: 'fact', text: 'Chloroform patřil v 19. století k prvním celkovým anestetikům, uspávala se jím i britská královna Viktorie při porodu. Dnes se kvůli toxicitě pro játra a srdce v medicíně nepoužívá.' },
            { type: 'p', text: 'Teď víš, jak alkany reagují. Kde se ale berou v takovém množství, že jimi topíme a jezdíme?' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď kroky radikálové chlorace methanu.', items: [
              '$Cl2 -> 2Cl·$ (iniciace)',
              '$Cl· + CH4 -> HCl + ·CH3$',
              '$·CH3 + Cl2 -> CH3Cl + Cl·$',
              '$·CH3 + Cl· -> CH3Cl$ (terminace)',
            ], explain: 'Nejdřív světlo vytvoří radikály chloru, pak se v propagaci střídají dva kroky a nakonec se radikály spojí a řetěz skončí.' } },
            { type: 'check', question: { kind: 'tf', q: 'Při chloraci methanu za světla vzniká jen jeden čistý produkt, chlormethan.', answer: false, explain: 'Radikály mohou nahradit i další vodíky, takže vzniká směs $CH3Cl$, $CH2Cl2$, $CHCl3$ a $CCl4$.' } },
          ],
        },
        {
          title: 'Zemní plyn, ropa a oktanové číslo',
          icon: 'oil-barrel',
          blocks: [
            { type: 'p', text: 'Hlavním zdrojem alkanů jsou fosilní suroviny: zemní plyn a ropa. Liší se hlavně tím, jak pestrá je to směs:' },
            { type: 'compare', columns: [
              { title: 'Zemní plyn', icon: 'gas-cylinder', tone: 'a', points: ['převážně methan, obvykle přes 90 %', 'příměs ethanu, propanu a butanu'] },
              { title: 'Ropa', icon: 'oil-barrel', tone: 'b', points: ['kapalná směs tisíců uhlovodíků', 'hlavně alkany a cykloalkany', 'menší podíl aromátů'] },
            ] },
            { type: 'p', text: 'Ropu proto nejdřív musíme rozdělit. V rafinerii se dělí **frakční destilací** podle teplot varu, které už umíš odhadnout z délky řetězce:' },
            { type: 'diagram', id: 'fractional-distillation', caption: 'Frakční destilace: páry stoupají kolonou. Nahoře, kde je chladněji, kondenzují krátké molekuly s nízkou teplotou varu, dole ty dlouhé. U každé frakce je počet uhlíků, rozmezí teplot varu a použití (hranice se mezi rafineriemi trochu liší).' },
            { type: 'p', text: 'Dlouhých molekul je v ropě víc, než trh potřebuje, a benzinu málo. Proto se dlouhé řetězce štěpí **krakováním** na kratší alkany a alkeny.' },
            { type: 'reaction', equation: 'C10H22 -> C8H18 + C2H4', caption: 'krakování dekanu na oktan a ethen' },
            { type: 'p', text: 'Krakovat se dá dvěma způsoby. Liší se teplotou, a hlavně tím, co z nich vyjde:' },
            { type: 'compare', columns: [
              { title: 'Tepelné krakování', icon: 'heat', tone: 'a', points: ['vysoká teplota (asi 800 °C) a tlak', 'hodně alkenů, hlavně ethenu', 'suroviny pro plasty (lekce Polymery a plasty)'] },
              { title: 'Katalytické krakování', icon: 'catalyst', tone: 'b', points: ['nižší teplota (asi 500 °C), katalyzátor **zeolit**', 'rozvětvené alkany a aromáty', 'kvalitní benzin s vysokým oktanovým číslem'] },
            ] },
            { type: 'p', text: 'Chybějící produkt krakování dopočítáš podobně jako u vyčíslování rovnic, stačí hlídat atomy:' },
            { type: 'example', title: 'Doplň produkt krakování', problem: 'Tetradekan $C14H30$ se rozštěpil na oktan $C8H18$ a jeden alken. Který?', steps: [
              'Atomy se při krakování jen přerozdělí, nic nezmizí.',
              'Uhlíky: 14 − 8 = 6. Vodíky: 30 − 18 = 12.',
              'Vzorec $C6H12$ odpovídá obecnému vzorci alkenů $C_{n}H_{2n}$.',
            ], answer: 'Vznikne hexen $C6H12$: $C14H30 -> C8H18 + C6H12$.' },
            { type: 'p', text: 'V motoru se směs benzinu a vzduchu stlačí a zapálí jiskrou. Nevhodné palivo se ale vznítí samo příliš brzy a motor „klepe“ (detonační spalování), což ho ničí. Odolnost paliva proti klepání udává **oktanové číslo**.' },
            { type: 'p', text: 'Oktanové číslo se měří proti dvěma vzorovým alkanům. Všimni si, jakou roli tu hraje větvení:' },
            { type: 'compare', columns: [
              { title: 'Oktanové číslo 100', icon: 'check', tone: 'good', points: ['isooktan (2,2,4-trimethylpentan)', 'rozvětvený a velmi odolný'] },
              { title: 'Oktanové číslo 0', icon: 'cross', tone: 'bad', points: ['heptan', 'nerozvětvený, klepe hned'] },
            ], caption: '**Natural 95**: benzin se v motoru chová jako směs 95 % isooktanu a 5 % heptanu' },
            { type: 'callout', variant: 'fact', text: 'Rozvětvené alkany a aromáty mají vysoké oktanové číslo, nerozvětvené nízké. Rafinerie proto řetězce záměrně přestavují. Dřív se oktanové číslo zvyšovalo jedovatým tetraethylolovem, olovnatý benzin je ale v EU od roku 2000 zakázaný.' },
            { type: 'p', text: 'Rafinerie tedy molekuly nejen třídí, ale i přestavuje. Zatím jsme ale viděli jen otevřené řetězce. Co když se řetězec uzavře do kruhu?' },
            { type: 'check', question: { kind: 'choice', q: 'Která frakce odchází z destilační kolony nejvýše?', options: ['rafinérský plyn', 'benzin', 'petrolej', 'mazut'], answer: 0, explain: 'Nahoře je kolona nejchladnější a dostanou se tam jen látky s nejnižší teplotou varu, tedy nejkratší alkany $C1–C4$.' } },
            { type: 'check', question: { kind: 'tf', q: 'Heptan má oktanové číslo 100, protože má dlouhý nerozvětvený řetězec.', answer: false, explain: 'Je to naopak: nerozvětvený heptan klepe nejvíc a má oktanové číslo 0. Hodnotu 100 má rozvětvený isooktan.' } },
          ],
        },
        {
          title: 'Cykloalkany a konformace',
          icon: 'arrow-cycle',
          blocks: [
            { type: 'p', text: 'Když se konce řetězce spojí, vznikne **cykloalkan**. Ubudou dva vodíky, takže obecný vzorec je $C_{n}H_{2n}$. Název dostane předponu **cyklo-**: cyklopropan, cyklobutan, cyklopentan, cyklohexan.' },
            { type: 'molecule', molecules: ['cyclohexane'], labels: ['cyklohexan $C6H12$'], caption: 'Otoč si model: kruh není plochý, ale prohnutý do židličky.' },
            { type: 'p', text: 'Na papíře se židlička kreslí těžko, proto ji zjednodušíme na rovinný šestiúhelník:' },
            { type: 'structure', art: s`
      CH2
     /   \
  H2C     CH2
    |     |
  H2C     CH2
     \   /
      CH2`, caption: 'Cyklohexan $C6H12$. Ve vazebném vzorci je to prostě šestiúhelník.' },
            { type: 'p', text: 'Kolem jednoduché vazby se atomy volně otáčejí. Podoby, které se liší jen natočením kolem jednoduchých vazeb, jsou **konformace**. Nejsou to izomery, které by šly oddělit: molekula mezi nimi přechází miliardkrát za sekundu.' },
            { type: 'p', text: 'Ne všechny konformace jsou ale stejně výhodné. Porovnej ethan a cyklohexan:' },
            { type: 'compare', columns: [
              { title: 'Stabilnější', icon: 'check', tone: 'good', points: ['ethan: **nezákrytová** konformace, vodíky sousedních uhlíků míří „mezi sebe“', 'cyklohexan: **židlička**, úhly téměř čtyřstěnné, molekula není pnutá'] },
              { title: 'Méně stabilní', icon: 'cross', tone: 'bad', points: ['ethan: **zákrytová** konformace, vodíky přesně za sebou, o něco vyšší energie', 'cyklohexan: **vanička**'] },
            ], caption: 'Rovinný šestiúhelník by měl úhly 120° místo ideálních 109,5°, proto se cyklohexan zkroutí.' },
            { type: 'callout', variant: 'fact', text: 'Cyklopropan je trojúhelník s úhly 60°. Vazby jsou tak napnuté, že se kruh snadno otevírá, a cyklopropan je proto mnohem reaktivnější než ostatní cykloalkany.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: kolik vzorců a názvů alkanů zvládneš za 60 sekund?' },
            { type: 'p', text: 'Alkany umíš pojmenovat, spálit i rozštěpit. V příští lekci přidáme do řetězce dvojnou a trojnou vazbu a uvidíš, jak moc to změní reaktivitu.' },
            { type: 'check', question: { kind: 'choice', q: 'Jaký je souhrnný vzorec cyklopentanu?', options: ['$C5H10$', '$C5H12$', '$C5H8$', '$C6H12$'], answer: 0, explain: 'Cykloalkany mají vzorec $C_{n}H_{2n}$: pro n = 5 je to $C5H10$. $C5H12$ je pentan s otevřeným řetězcem.' } },
          ],
        },
      ],
      summary: [
        'Alkany jsou nasycené uhlovodíky s obecným vzorcem $C_{n}H_{2n+2}$, sousední homology se liší o $CH2$.',
        'Název rozvětveného alkanu: nejdelší řetězec, nejnižší lokanty, větve abecedně, např. 3-ethyl-2-methylhexan.',
        'Teplota varu roste s délkou řetězce a klesá s větvením.',
        'Dokonalé hoření dává $CO2$ a $H2O$, nedokonalé jedovatý $CO$ nebo saze.',
        'Radikálová substituce je řetězová reakce: iniciace, propagace a terminace.',
        'Ropa se dělí frakční destilací, krakování štěpí dlouhé řetězce na kratší alkany a alkeny a kvalitu benzinu udává oktanové číslo.',
        'Cykloalkany mají vzorec $C_{n}H_{2n}$, cyklohexan zaujímá stabilní konformaci židličky.',
      ],
      quiz: [
        { kind: 'number', q: 'Kolik atomů vodíku má nonan (9 uhlíků)?', answer: 20, explain: '$C_{n}H_{2n+2}$: 2 · 9 + 2 = 20, nonan je $C9H20$.' },
        { kind: 'text', q: 'Pojmenuj alkan $CH3-C(CH3)2-CH3$.', accept: ['2,2-dimethylpropan', '2,2 dimethylpropan', '2, 2-dimethylpropan'], explain: 'Hlavní řetězec má 3 uhlíky (propan) a na prostředním uhlíku visí dva methyly: 2,2-dimethylpropan.' },
        { kind: 'choice', q: 'Který alkan má nejvyšší teplotu varu?', options: ['hexan', '2-methylpentan', '2,2-dimethylbutan', 'pentan'], answer: 0, explain: 'Hexan, 2-methylpentan a 2,2-dimethylbutan mají stejný vzorec $C6H14$, ale nerozvětvený hexan má největší styčnou plochu. Pentan je o uhlík kratší.' },
        { kind: 'tf', q: 'Při nedokonalém hoření alkanů může vznikat jedovatý oxid uhelnatý.', answer: true, explain: 'Při nedostatku kyslíku se uhlík nezoxiduje až na $CO2$ a vzniká $CO$ nebo saze.' },
        { kind: 'order', q: 'Seřaď frakce ropy od nejnižší teploty varu po nejvyšší.', items: ['rafinérský plyn', 'benzin', 'petrolej', 'plynový olej', 'mazut'], explain: 'Teplota varu roste s délkou řetězce: od plynů $C1–C4$ až po mazut s řetězci delšími než $C20$.' },
        { kind: 'multi', q: 'Co platí o radikálové substituci alkanů?', options: [
          'Spouští ji UV záření nebo vysoká teplota',
          'Je to řetězová reakce',
          'Atom vodíku se nahradí atomem halogenu',
          'Probíhá přes karbokationty',
          'Vzniká vždy jediný čistý produkt',
        ], answers: [0, 1, 2], explain: 'Reakce běží přes radikály (ne karbokationty) jako řetězová reakce a dává směs produktů.' },
        { kind: 'match', q: 'Přiřaď vzorec k názvu.', pairs: [
          ['$CH4$', 'methan'],
          ['$C3H8$', 'propan'],
          ['$C6H12$ (kruh)', 'cyklohexan'],
          ['$C8H18$', 'oktan'],
        ], explain: 'Alkany mají $C_{n}H_{2n+2}$, cykloalkany $C_{n}H_{2n}$.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-3
    'l8-3': {
      id: 'l8-3',
      title: 'Alkeny, alkyny a aromáty',
      goals: [
        'Pojmenovat alkeny a alkyny a nakreslit jejich vzorce podle názvu',
        'Popsat mechanismus elektrofilní adice a pomocí stability karbokationtů předpovědět produkt (Markovnikovovo pravidlo)',
        'Vysvětlit, proč Kekulého model benzenu nestačí a proč benzen podléhá substituci místo adice',
        'Popsat nitraci, halogenaci a Friedelovu–Craftsovu reakci a uvést důležité areny a jejich rizika',
      ],
      hook: 'Zelené banány dozrají rychleji, když je dáš do sáčku ke zralému jablku. Může za to plyn ethen, nejjednodušší alken. Stačí jedna dvojná vazba a z líného uhlovodíku je reaktivní molekula, ze které se navíc vyrábí většina plastů kolem tebe.',
      sections: [
        {
          title: 'Dvojná a trojná vazba',
          icon: 'bond',
          blocks: [
            { type: 'p', text: 'Alkany z minulé lekce mají jen jednoduché vazby. Když mezi dva uhlíky přibude druhá nebo třetí vazba, vznikne nová rodina. **Alkeny** mají dvojnou vazbu $C=C$ a (s jednou dvojnou vazbou) vzorec $C_{n}H_{2n}$. **Alkyny** mají trojnou vazbu $C≡C$ a vzorec $C_{n}H_{2n-2}$. Oboje jsou **nenasycené** uhlovodíky: na násobnou vazbu jde ještě něco „přidat“.' },
            { type: 'molecule', molecules: ['C2H6', 'C2H4', 'C2H2'], labels: ['ethan: čtyřstěny', 'ethen: plochý, 120°', 'ethyn: lineární, 180°'] },
            { type: 'p', text: 'Dvojná vazba má pevnou **σ-vazbu** přímo na spojnici jader a slabší **π-vazbu** z bočního překryvu orbitalů nad a pod rovinou molekuly. Trojná vazba má jednu σ-vazbu a dvě π-vazby.' },
            { type: 'callout', variant: 'remember', text: 'π-elektrony jsou „venku“, slabě držené a snadno dostupné. ==Proto jsou alkeny a alkyny mnohem reaktivnější než alkany.== Otočením by se π-vazba přetrhla, a tak se kolem dvojné vazby nedá volně otáčet. Odtud cis/trans izomerie z první lekce.' },
            { type: 'p', text: 'Násobná vazba změní i délku vazby a tvar molekuly. Porovnej všechny tři typy vedle sebe:' },
            { type: 'compare', columns: [
              { title: 'Alkan', tone: 'a', points: ['$C-C$, délka 154 pm', 'čtyřstěn, 109,5°', '$C_{n}H_{2n+2}$, nasycený', 'ethan'] },
              { title: 'Alken', tone: 'b', points: ['$C=C$, délka 134 pm', 'rovina, 120°', '$C_{n}H_{2n}$', 'ethen (ethylen)'] },
              { title: 'Alkyn', tone: 'c', points: ['$C≡C$, délka 120 pm', 'přímka, 180°', '$C_{n}H_{2n-2}$', 'ethyn (acetylen)'] },
            ], caption: 'Čím víc vazeb mezi uhlíky, tím jsou si blíž' },
            { type: 'callout', variant: 'fact', text: 'Ethen je nejvyráběnější organická látka na světě, přes 150 milionů tun ročně. Rostliny ho samy tvoří jako hormon zrání. Ethyn (acetylen) hoří v kyslíku plamenem o teplotě přes 3 000 °C, a proto se používá ke sváření a řezání oceli.' },
            { type: 'p', text: 'Plamen svařovacího hořáku je obyčejné dokonalé hoření, jen hodně horké. Vyčíslená rovnice vypadá takto:' },
            { type: 'reaction', equation: '2C2H2 + 5O2 -> 4CO2 + 2H2O', caption: 'hoření acetylenu ve svařovacím hořáku' },
            { type: 'p', text: 'Teď víš, čím se alkeny a alkyny liší od alkanů. Než začneme s jejich reakcemi, musíme je umět pojmenovat.' },
            { type: 'check', question: { kind: 'choice', q: 'Jaký obecný vzorec mají alkyny s jednou trojnou vazbou?', options: ['$C_{n}H_{2n-2}$', '$C_{n}H_{2n}$', '$C_{n}H_{2n+2}$', '$C_{n}H_{n}$'], answer: 0, explain: 'Každá π-vazba ubere dva vodíky. Trojná vazba má dvě π-vazby, takže oproti alkanu chybí 4 vodíky: $C_{n}H_{2n-2}$.' } },
            { type: 'check', question: { kind: 'tf', q: 'Kolem dvojné vazby $C=C$ se atomy mohou volně otáčet stejně jako kolem jednoduché vazby.', answer: false, explain: 'Otočení by rozbilo překryv orbitalů π-vazby. Proto je dvojná vazba „zamčená“ a existují cis/trans izomery.' } },
          ],
        },
        {
          title: 'Názvosloví alkenů a alkynů',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Alkeny a alkyny pojmenuješ jako alkany, jen koncovku **-an** vyměníš za **-en** (dvojná vazba) nebo **-yn** (trojná vazba). Číslo před koncovkou říká, na kterém uhlíku násobná vazba začíná: but-1-en, but-2-en. Ostatní pravidla z minulé lekce platí dál, přibudou jen tato upřesnění:' },
            { type: 'iconlist', items: [
              { icon: 'magnifier', title: 'Hlavní řetězec', text: 'vede přes násobnou vazbu' },
              { icon: 'calculator', title: 'Nejnižší lokant', text: 'dostane **násobná vazba**, má přednost před větvemi' },
              { icon: 'bond', title: 'Víc násobných vazeb', text: 'dvě dvojné: **-dien**, tři: **-trien**, a před koncovku se vloží „a“: buta-1,3-dien' },
              { icon: 'check', title: 'Bez lokantu', text: 'ethen, propen, ethyn a propyn: jiná poloha násobné vazby tu neexistuje' },
            ] },
            { type: 'p', text: 'Nejvíc se chybuje ve druhém pravidle. Podívej se, jak změní číslování u rozvětveného alkenu:' },
            { type: 'structure', art: s`
5     4    3    2    1
CH3 — CH — CH = CH — CH3
      |
      CH3`, caption: 'Číslujeme zprava, aby dvojná vazba dostala nejnižší lokant' },
            { type: 'p', text: 'Celý postup krok za krokem, včetně toho, proč methyl musí ustoupit:' },
            { type: 'example', title: 'Dvojná vazba má přednost', problem: 'Pojmenuj alken $CH3-CH(CH3)-CH=CH-CH3$.', steps: [
              'Hlavní řetězec s dvojnou vazbou má 5 uhlíků, základ je **pent-**.',
              'Číslování zleva by dalo dvojné vazbě lokant 3, zprava 2. Vyhrává zprava, i když methyl pak dostane vyšší číslo.',
              'Dvojná vazba mezi C2 a C3: **pent-2-en**.',
              'Methyl na C4: **4-methyl**.',
            ], answer: '**4-methylpent-2-en**' },
            { type: 'p', text: 'A teď opačný směr, tentokrát u alkynů: z názvu nakreslíš vzorec.' },
            { type: 'example', title: 'Od názvu ke vzorci', problem: 'Nakresli but-1-yn a but-2-yn.', steps: [
              'Základ **but-**: řetězec 4 uhlíků.',
              'but-1-yn: trojná vazba mezi C1 a C2, tedy $CH≡C-CH2-CH3$.',
              'but-2-yn: trojná vazba mezi C2 a C3, tedy $CH3-C≡C-CH3$.',
              'Kontrola: uhlík s trojnou vazbou může mít už jen jednu další vazbu.',
            ], answer: 'Obě látky mají vzorec $C4H6$, jsou to polohové izomery.' },
            { type: 'callout', variant: 'tip', title: 'Triviální názvy', text: 'Potkáš je všude: **ethylen** = ethen, **propylen** = propen, **acetylen** = ethyn, **butadien** = buta-1,3-dien (surovina pro syntetický kaučuk).' },
            { type: 'p', text: 'Názvy máme. Teď se podíváme, co se na dvojné vazbě děje, když alken reaguje.' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj alken $CH2=CH-CH2-CH3$.', accept: ['but-1-en', 'but 1 en', '1-buten', 'buten-1'], explain: 'Čtyři uhlíky a dvojná vazba mezi C1 a C2: but-1-en.' } },
            { type: 'check', question: { kind: 'choice', q: 'Jak se správně jmenuje $CH3-CH=CH-CH2-CH2-CH3$?', options: ['hex-2-en', 'hex-4-en', 'hex-3-en', 'pent-2-en'], answer: 0, explain: 'Řetězec má 6 uhlíků a číslujeme zleva, aby dvojná vazba dostala lokant 2, ne 4.' } },
          ],
        },
        {
          title: 'Elektrofilní adice',
          icon: 'ion-plus',
          blocks: [
            { type: 'p', text: 'Slabá π-vazba z prvního oddílu je místo, kde alken reaguje. Typickou reakcí alkenů je **adice**: π-vazba se rozpojí, na oba uhlíky se připojí nové atomy a z dvojné vazby zbude jednoduchá. Nic se neodštěpuje, dvě molekuly se spojí v jednu. Co všechno se dá na dvojnou vazbu přidat, ukazuje tabulka:' },
            { type: 'table', headers: ['Činidlo', 'Reakce', 'Produkt z ethenu'], rows: [
              ['$H2$ (katalyzátor $Ni$ nebo $Pt$)', 'hydrogenace', 'ethan $CH3-CH3$'],
              ['$Br2$', 'bromace (halogenace)', '1,2-dibromethan $CH2Br-CH2Br$'],
              ['$HBr$', 'hydrohalogenace', 'bromethan $CH3-CH2Br$'],
              ['$H2O$ (katalyzátor $H^+$)', 'hydratace', 'ethanol $CH3-CH2OH$'],
            ], caption: 'Čtyři základní adice na dvojnou vazbu' },
            { type: 'p', text: 'V rovnici je adice nejlépe vidět na bromaci: dvě molekuly vstupují, jedna vystupuje.' },
            { type: 'reaction', equation: 'C2H4 + Br2 -> C2H4Br2', caption: 'bromace ethenu: vzniká 1,2-dibromethan' },
            { type: 'p', text: 'Oblak π-elektronů přitahuje částice s nedostatkem elektronů, **elektrofily** („milovníky elektronů“), například proton $H^+$. Proto mluvíme o **elektrofilní adici** ($A_{E}$).' },
            { type: 'callout', variant: 'tip', title: 'Důkaz násobné vazby', text: 'K vzorku přidej pár kapek **bromové vody** (oranžovohnědé). Alken nebo alkyn brom aduje a roztok se **odbarví**, alkan barvu nezmění. Brom je leptavý a jedovatý: pracuje se v digestoři, s brýlemi a rukavicemi.' },
            { type: 'callout', variant: 'mascot', title: 'Alken + alken + alken…', text: 'Molekuly alkenů se umí adovat i samy na sebe. Tisíce molekul ethenu se spojí v jeden obří řetězec, polyethylen. Téhle **polymeraci** patří celá lekce Polymery a plasty.' },
            { type: 'p', text: 'Víme, co se na dvojnou vazbu přidá. Zatím ale ne, jak přesně se to stane a na který uhlík co skončí.' },
            { type: 'check', question: { kind: 'choice', q: 'Co pozoruješ, když přidáš bromovou vodu ke cyklohexenu (cyklický alken)?', options: ['oranžová barva zmizí', 'vznikne bílá sraženina', 'roztok zmodrá', 'nic, bromová voda reaguje jen s alkany'], answer: 0, explain: 'Cyklohexen má dvojnou vazbu, na kterou se brom aduje. Barevný brom se spotřebuje a roztok se odbarví.' } },
          ],
        },
        {
          title: 'Mechanismus adice a stabilita karbokationtů',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'U ethenu je jedno, na který uhlík se vodík a brom navážou. U propenu už ne, a odpověď dá mechanismus. Adice $HBr$ neproběhne naráz, ale ve dvou krocích. Vazba $H-Br$ se přitom štěpí **heterolyticky**: oba elektrony si vezme brom a odejde jako $Br^-$.' },
            { type: 'diagram', id: 'addition-mechanism', caption: 'Adice $HBr$ na propen krok za krokem: π-elektrony chytí proton, na prostředním uhlíku vznikne **karbokation** a nakonec se na něj naváže $Br^-$. Hlavním produktem je **2-brompropan** $CH3-CHBr-CH3$, 1-brompropanu vznikne jen málo.' },
            { type: 'p', text: 'Obrázek rozložíme do tří kroků. Hlídej hlavně druhý, ve kterém vzniká karbokation:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'electron', title: 'Útok π-elektronů', text: 'elektrony π-vazby se vrhnou na $H^{δ+}$ molekuly $HBr$' },
              { icon: 'ion-plus', title: 'Karbokation', text: 'vznikne vazba $C-H$ a na druhém uhlíku zbude kladný náboj; $Br^-$ odchází' },
              { icon: 'ion-minus', title: 'Připojení aniontu', text: '$Br^-$ se volným elektronovým párem naváže na kladný uhlík' },
            ], caption: 'Pomalejší je první krok, na stabilitě karbokationtu proto záleží nejvíc' },
            { type: 'p', text: '**Karbokation** je částice s kladně nabitým uhlíkem, který má jen šest valenčních elektronů. Alkylové skupiny kolem něj „tlačí“ elektrony k nabitému uhlíku (kladný indukční efekt, +I) a náboj tím rozprostřou. ==Čím víc alkylů nese kladný uhlík, tím je karbokation stabilnější.==' },
            { type: 'table', headers: ['Karbokation', 'Příklad', 'Alkylů na $C^+$', 'Stabilita'], rows: [
              ['terciární', '$(CH3)3C^+$', '3', 'nejvyšší'],
              ['sekundární', '$(CH3)2CH^+$', '2', 'vysoká'],
              ['primární', '$CH3CH2^+$', '1', 'nízká'],
              ['methylový', '$CH3^+$', '0', 'nejnižší'],
            ], caption: 'Stabilita karbokationtů: terciární > sekundární > primární > methylový' },
            { type: 'p', text: 'U nesymetrického alkenu, jako je propen, může vodík skončit na dvou různých uhlících. Reakce jde přednostně cestou přes **stabilnější karbokation**, a to vysvětluje **Markovnikovovo pravidlo**.' },
            { type: 'callout', variant: 'remember', title: 'Markovnikovovo pravidlo', text: 'Vodík z činidla $HX$ se naváže na ten uhlík dvojné vazby, který už má víc vodíků. Kdo má, tomu bude přidáno. Kladný náboj tak zůstane na uhlíku s více alkyly.' },
            { type: 'p', text: 'Pravidlo si ověříme na alkenu, u kterého je rozdíl mezi oběma karbokationty největší:' },
            { type: 'example', title: 'Adice na 2-methylpropen', problem: 'Jaký je hlavní produkt adice $HBr$ na 2-methylpropen $CH2=C(CH3)2$?', steps: [
              'Proton se může navázat na $CH2$ nebo na uhlík se dvěma methyly.',
              'Na $CH2$: kladný náboj zůstane na uhlíku se třemi alkyly, vznikne **terciární** karbokation $(CH3)3C^+$.',
              'Opačně by vznikl jen primární karbokation, a ten je mnohem méně stabilní.',
              'Na terciární karbokation se naváže $Br^-$.',
            ], answer: 'Hlavní produkt je **2-brom-2-methylpropan** $(CH3)3CBr$.' },
            { type: 'p', text: 'Mechanismus teď vysvětlí, kam co při adici skončí. Existuje ale uhlovodík, který má na papíře tři dvojné vazby, a přesto adici odmítá.' },
            { type: 'check', question: { kind: 'text', q: 'Který hlavní produkt vznikne adicí vody na propen (katalyzátor $H^+$)? Napiš název.', accept: ['propan-2-ol', 'propan 2 ol', '2-propanol', 'isopropanol', 'isopropylalkohol'], explain: 'Podle Markovnikova jde vodík na krajní $CH2$ a přes sekundární karbokation skončí skupina $-OH$ na prostředním uhlíku: vznikne propan-2-ol $CH3-CH(OH)-CH3$.' } },
            { type: 'check', question: { kind: 'choice', q: 'Který karbokation je nejstabilnější?', options: ['$(CH3)3C^+$', '$(CH3)2CH^+$', '$CH3CH2^+$', '$CH3^+$'], answer: 0, explain: 'Terciární karbokation má na kladném uhlíku tři alkyly, které náboj nejlépe rozprostřou.' } },
          ],
        },
        {
          title: 'Benzen: Kekulé, nebo delokalizace?',
          icon: 'molecule',
          blocks: [
            { type: 'p', text: '**Benzen** $C6H6$ je bezbarvá kapalina (var 80 °C) s typickým zápachem: šest uhlíků v plochém šestiúhelníku, na každém jeden vodík. Podle vzorce by to měl být superreaktivní „trien“, ale bromovou vodu vůbec neodbarví. Proč?' },
            { type: 'molecule', molecules: ['benzene'], labels: ['benzen $C6H6$: plochý kruh'] },
            { type: 'p', text: 'Kekulé ho nakreslil jako kruh, ve kterém se střídají tři dvojné vazby s jednoduchými:' },
            { type: 'structure', art: s`
      CH
    //  \
  HC     CH
   |     ‖
  HC     CH
    \\  /
      CH`, caption: 'Kekulého vzorec benzenu: tři dvojné vazby na pevných místech' },
            { type: 'callout', variant: 'fact', title: 'Had, který se kouše do ocasu', text: 'August Kekulé tvrdil, že ho kruhový tvar benzenu napadl v roce 1865, když podřimoval u krbu a zdál se mu had, který si kouše vlastní ocas.' },
            { type: 'p', text: 'Kdyby Kekulého vzorec platil, choval by se benzen jako alken. Porovnej, co model předpovídá a co ukázaly pokusy:' },
            { type: 'compare', columns: [
              { title: 'Kekulého model předpovídá', icon: 'cross', tone: 'bad', points: ['střídání krátkých (134 pm) a dlouhých (154 pm) vazeb', 'odbarvení bromové vody jako u alkenu', 'hydrogenační teplo 3 × (−120) = −360 kJ/mol', 'dva různé 1,2-dibrombenzeny (Br přes dvojnou, nebo přes jednoduchou vazbu)'] },
              { title: 'Skutečnost: delokalizovaný model', icon: 'check', tone: 'good', points: ['všech šest vazeb stejně dlouhých, 139 pm', 'bromovou vodu neodbarví', 'hydrogenační teplo jen −208 kJ/mol', 'jen jeden 1,2-dibrombenzen'] },
            ], caption: 'Experimenty, které Kekulého model vyvrátily' },
            { type: 'p', text: 'Šest π-elektronů netvoří tři oddělené dvojné vazby, ale je **delokalizovaných** v prstenci nad a pod celým kruhem. Proto se benzen kreslí i jako šestiúhelník s kružnicí uvnitř. Všechny uhlíky jsou $sp^{2}$, molekula je proto plochá. Kolik energie mu delokalizace ušetří, spočítáš z hydrogenačních tepel:' },
            { type: 'example', title: 'Kolik stability přináší delokalizace?', problem: 'Hydrogenace cyklohexenu (jedna dvojná vazba) uvolní 120 kJ/mol. Hydrogenace benzenu na cyklohexan uvolní 208 kJ/mol. O kolik je benzen stabilnější, než by byl „cyklohexatrien“ podle Kekulého?', steps: [
              'Tři izolované dvojné vazby by uvolnily 3 · 120 = 360 kJ/mol.',
              'Benzen uvolní jen 208 kJ/mol, leží tedy energeticky níž.',
              'Rozdíl: 360 − 208 = 152 kJ/mol.',
            ], answer: 'Delokalizace stabilizuje benzen asi o **152 kJ/mol** (delokalizační energie).' },
            { type: 'p', text: 'Benzen je vzorem celé skupiny látek. Pro ni budeme potřebovat tři pojmy:' },
            { type: 'keyterms', items: [
              { term: 'Aromatický systém', def: 'plochý cyklus s delokalizovanými π-elektrony, jako v benzenu jich bývá 6 (obecně $4n + 2$, tzv. Hückelovo pravidlo)' },
              { term: 'Areny', def: 'aromatické uhlovodíky, tedy uhlovodíky s benzenovým jádrem' },
              { term: 'Fenyl', def: 'skupina $C6H5-$, benzen bez jednoho vodíku' },
            ] },
            { type: 'p', text: 'Benzen je tedy stabilní a adici se brání. Jak potom vůbec reaguje?' },
            { type: 'check', question: { kind: 'choice', q: 'Který experimentální fakt Kekulého model benzenu **nevysvětlí**?', options: [
              'Všechny vazby $C-C$ v benzenu jsou stejně dlouhé',
              'Benzen má vzorec $C6H6$',
              'Na každém uhlíku je jeden vodík',
              'Uhlíky tvoří šestičlenný kruh',
            ], answer: 0, explain: 'Kekulého vzorec má střídavě jednoduché a dvojné vazby, které by musely mít různou délku. Naměřených 139 pm u všech vazeb vysvětlí jen delokalizace.' } },
          ],
        },
        {
          title: 'Elektrofilní substituce a důležité areny',
          icon: 'hazard',
          blocks: [
            { type: 'p', text: 'Bromovou vodu benzen neodbarví, s elektrofily ale přece jen reaguje, jen jinak než alken. Porovnej obě cesty:' },
            { type: 'compare', columns: [
              { title: 'Alken (cyklohexen)', icon: 'bond', tone: 'a', points: ['π-elektrony v jedné dvojné vazbě', 'elektrofilní **adice**', 'bromová voda se odbarví'] },
              { title: 'Benzen', icon: 'molecule', tone: 'b', points: ['6 delokalizovaných π-elektronů, mimořádně stabilní', 'elektrofilní **substituce**, kruh zůstane', 'bromovou vodu neodbarví'] },
            ], caption: 'Adice by aromatický systém zničila, a tak benzen reaguje **elektrofilní substitucí** ($S_{E}$): vodík na jádře se vymění za jinou skupinu.' },
            { type: 'p', text: 'Nejznámější substitucí je nitrace. Z rovnice je vidět, že z jádra odejde vodík a kruh zůstane:' },
            { type: 'reaction', equation: 'C6H6 + HNO3 -> C6H5NO2 + H2O', caption: 'nitrace benzenu nitrační směsí (koncentrovaná $HNO3$ + koncentrovaná $H2SO4$, asi 50 °C)' },
            { type: 'p', text: 'Útok elektrofilu připomíná adici na alken. Rozdíl je až v posledním kroku, kdy se kruh vrátí do aromatického stavu:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'catalyst', title: 'Vznik elektrofilu', text: 'kyselina sírová pomůže z $HNO3$ vytvořit **nitroniový kation** $NO2^+$' },
              { icon: 'ion-plus', title: 'Útok na jádro', text: '$NO2^+$ se naváže na jeden uhlík; v kladném meziproduktu je aromaticita dočasně porušená' },
              { icon: 'arrow-cycle', title: 'Návrat aromaticity', text: 'z téhož uhlíku se odštěpí $H^+$ a elektrony se vrátí do kruhu' },
            ], caption: 'Vznikne **nitrobenzen** $C6H5NO2$: vodík na jádře nahradila nitroskupina $-NO2$.' },
            { type: 'p', text: 'Stejně probíhá i halogenace. Elektrofil tu z molekuly bromu vyrobí katalyzátor:' },
            { type: 'reaction', equation: 'C6H6 + Br2 -> C6H5Br + HBr', caption: 'bromace benzenu, katalyzátor $FeBr3$: vzniká brombenzen (opět substituce, ne adice)' },
            { type: 'p', text: '**Friedelova–Craftsova reakce** připojí na jádro uhlíkatý řetězec. Katalyzátor $AlCl3$ vyrobí z halogenalkanu elektrofil (karbokation), který nahradí vodík na jádře. Takto se vyrábí třeba ethylbenzen, surovina pro styren. Podobně se dá připojit i acylová skupina $R-CO-$ (acylace), vznikne keton.' },
            { type: 'reaction', equation: 'C6H6 + CH3Cl -> C6H5CH3 + HCl', caption: 'Friedelova–Craftsova alkylace: z benzenu a chlormethanu vzniká toluen (katalyzátor $AlCl3$)' },
            { type: 'p', text: 'Toluen z Friedelovy–Craftsovy reakce je jen jedním z důležitých arenů. Podívej se na modely tří z nich:' },
            { type: 'molecule', molecules: ['toluene', 'naphthalene', 'styrene'], labels: ['toluen (methylbenzen)', 'naftalen $C10H8$', 'styren (vinylbenzen)'] },
            { type: 'p', text: 'K čemu se tyto a další areny používají:' },
            { type: 'iconlist', items: [
              { icon: 'beaker', title: 'Toluen $C6H5-CH3$', text: 'methylbenzen: rozpouštědlo barev a lepidel, surovina pro výbušninu TNT' },
              { icon: 'molecule', title: 'Xyleny', text: 'dimethylbenzeny: dvě methylové skupiny na jádře' },
              { icon: 'crystal', title: 'Naftalen $C10H8$', text: 'dva benzenové kruhy se společnou stranou; bílé krystaly s pronikavým pachem, dřív proti molům' },
              { icon: 'plastic-bottle', title: 'Styren $C6H5-CH=CH2$', text: 'vinylbenzen, surovina pro polystyren' },
            ] },
            { type: 'p', text: 'Aromáty jsou užitečné, některé z nich ale i nebezpečné. Tohle o jejich rizicích potřebuješ vědět:' },
            { type: 'iconlist', items: [
              { icon: 'hazard', title: 'Benzen je karcinogen', text: 'poškozuje kostní dřeň a prokazatelně způsobuje leukemii' },
              { icon: 'flask', title: 'Náhrada toluenem', text: 'benzen býval běžné rozpouštědlo, dnes ho nahradil méně nebezpečný toluen' },
              { icon: 'gas-cloud', title: 'Polycyklické aromáty', text: 'několik spojených benzenových kruhů; vznikají při nedokonalém hoření (cigaretový kouř, výfuky, připálené maso z grilu). Benzo[a]pyren je silný karcinogen.' },
            ] },
            { type: 'callout', variant: 'warning', title: 'Benzen × benzin', text: 'Neplést si: benzen je čistá látka $C6H6$, benzin je směs uhlovodíků z ropy. Benzenu smí být v benzinu v EU nejvýš 1 % objemu.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Otestuj, co víš o alkenech, alkynech a arenech.' },
            { type: 'p', text: 'Teď znáš uhlovodíky s jednoduchou, dvojnou i trojnou vazbou i aromatické jádro. V příští lekci na uhlovodíkový řetězec navážeme první cizí atomy: halogeny a kyslík.' },
            { type: 'check', question: { kind: 'multi', q: 'Které reakce benzenu jsou elektrofilní substituce?', options: ['nitrace nitrační směsí', 'bromace za katalýzy $FeBr3$', 'Friedelova–Craftsova alkylace s $AlCl3$', 'odbarvení bromové vody', 'hydrogenace na cyklohexan'], answers: [0, 1, 2], explain: 'Při nitraci, bromaci i Friedelově–Craftsově reakci zůstává aromatický kruh a vodík se vymění. Bromovou vodu benzen neodbarví a hydrogenace je adice, která aromaticitu zničí.' } },
            { type: 'check', question: { kind: 'tf', q: 'Benzin a benzen jsou dva názvy pro tutéž látku.', answer: false, explain: 'Benzen je jedna konkrétní aromatická látka $C6H6$. Benzin je palivo, směs hlavně alkanů $C5–C10$, benzenu smí obsahovat nejvýš 1 %.' } },
          ],
        },
      ],
      summary: [
        'Alkeny ($C_{n}H_{2n}$) mají dvojnou vazbu, alkyny ($C_{n}H_{2n-2}$) trojnou; názvy končí na -en a -yn.',
        'π-vazba je slabší a snadno dostupná, proto alkeny ochotně podléhají elektrofilní adici; bromová voda se s nimi odbarví.',
        'Elektrofilní adice $HX$ běží přes karbokation; terciární karbokation je stabilnější než sekundární a ten než primární.',
        'Markovnikovovo pravidlo (vodík na uhlík s více vodíky) plyne z toho, že reakce jde přes stabilnější karbokation.',
        'Benzen není Kekulého cyklohexatrien: vazby má stejně dlouhé a delokalizace ho stabilizuje asi o 152 kJ/mol.',
        'Benzen proto podléhá elektrofilní substituci (nitrace, halogenace, Friedelova–Craftsova reakce), ne adici.',
        'Benzen je karcinogenní; toluen (methylbenzen) je méně nebezpečný, naftalen má dva kruhy.',
      ],
      quiz: [
        { kind: 'text', q: 'Napiš systematický název látky $CH≡CH$.', accept: ['ethyn'], explain: 'Dva uhlíky a trojná vazba: ethyn. Triviálně se mu říká acetylen.' },
        { kind: 'choice', q: 'Jaký je hlavní produkt adice $HCl$ na propen?', options: ['2-chlorpropan', '1-chlorpropan', '1,2-dichlorpropan', '3-chlorpropen'], answer: 0, explain: 'Podle Markovnikova se vodík naváže na krajní $CH2$ a chlor na prostřední uhlík, přes stabilnější sekundární karbokation.' },
        { kind: 'tf', q: 'Bromová voda se odbarví v přítomnosti alkenu, ale ne v přítomnosti alkanu.', answer: true, explain: 'Brom se aduje na dvojnou vazbu. Alkany žádnou násobnou vazbu nemají a bez světla s bromem nereagují.' },
        { kind: 'match', q: 'Přiřaď produkt adice na ethen.', pairs: [
          ['ethen + $H2$', 'ethan'],
          ['ethen + $Br2$', '1,2-dibromethan'],
          ['ethen + $H2O$', 'ethanol'],
          ['ethen + $HBr$', 'bromethan'],
        ], explain: 'Při adici se oba atomy činidla připojí na dva uhlíky bývalé dvojné vazby.' },
        { kind: 'multi', q: 'Co platí o benzenu?', options: [
          'Všechny vazby $C-C$ v něm jsou stejně dlouhé',
          'Má 6 delokalizovaných π-elektronů',
          'Typicky podléhá elektrofilní adici',
          'Je karcinogenní',
          'Je hlavní složkou benzinu',
        ], answers: [0, 1, 3], explain: 'Benzen typicky podléhá substituci, ne adici. Benzin je hlavně směs alkanů a benzenu smí obsahovat nejvýš 1 %.' },
        { kind: 'order', q: 'Seřaď kroky elektrofilní adice $HBr$ na propen.', items: [
          'molekula $HBr$ se přiblíží k dvojné vazbě',
          'π-elektrony se naváží na proton a z $HBr$ odejde $Br^-$',
          'na prostředním uhlíku vznikne karbokation',
          '$Br^-$ se naváže na karbokation a vznikne 2-brompropan',
        ], explain: 'Nejdřív útočí elektrofil ($H^+$), vzniká karbokation a teprve potom se připojí nukleofilní $Br^-$.' },
        { kind: 'number', q: 'Kolik atomů vodíku má alken s 5 uhlíky a jednou dvojnou vazbou?', answer: 10, explain: '$C_{n}H_{2n}$: 2 · 5 = 10, například pent-1-en $C5H10$.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-4
    'l8-4': {
      id: 'l8-4',
      title: 'Halogenderiváty, alkoholy, fenoly a ethery',
      goals: [
        'Rozpoznat hlavní funkční skupiny a pojmenovat halogenderiváty a alkoholy (primární, sekundární, terciární)',
        'Rozlišit mechanismy $S_{N}1$ a $S_{N}2$ a eliminaci a předpovědět, který převládne',
        'Vysvětlit vlastnosti alkoholů vodíkovými můstky a předpovědět produkt jejich oxidace',
        'Vysvětlit, proč je fenol kyselejší než ethanol, a odlišit alkohol, fenol a ether',
      ],
      hook: 'Ethanol a methanol se liší jen o jednu skupinu $CH2$. Ethanol tě „jen“ opije, methanol tě může oslepit nebo zabít. Jak může tak malý rozdíl v molekule dělat tak velký rozdíl v těle?',
      sections: [
        {
          title: 'Funkční skupina: co dělá molekulu',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'Dosud jsme v molekulách měli jen uhlík a vodík. Teď na kostru přidáme další atomy. Nahradíš-li v uhlovodíku vodík jiným atomem nebo skupinou, vznikne **derivát uhlovodíku**. Nová část je **funkční (charakteristická) skupina** a rozhoduje o tom, jak se látka chová. Uhlovodíkový zbytek je jen „nosič“: methanol, ethanol i propanol se chovají podobně, protože mají skupinu $-OH$ (obecně $R-OH$).' },
            { type: 'molecule', molecules: ['CH3Cl', 'ethanol', 'acetic-acid', 'methylamine'], labels: ['$-Cl$: halogenderivát', '$-OH$: alkohol', '$-COOH$: karboxylová kyselina', '$-NH2$: amin'], caption: 'Stejný „nosič“, jiná skupina, jiné chování' },
            { type: 'p', text: 'Takových skupin je v organické chemii asi deset. Tabulka ti poslouží jako mapa celé úrovně, nemusíš se ji učit najednou:' },
            { type: 'table', headers: ['Skupina', 'Třída', 'Přípona / předpona', 'Příklad'], rows: [
              ['$-F$, $-Cl$, $-Br$, $-I$', 'halogenderiváty', 'fluor-, chlor-, brom-, jod-', 'chlormethan $CH3Cl$'],
              ['$-OH$ na uhlíku řetězce', 'alkoholy', '-ol / hydroxy-', 'ethanol $CH3CH2OH$'],
              ['$-OH$ na benzenovém jádře', 'fenoly', '-ol / hydroxy-', 'fenol $C6H5OH$'],
              ['$R-O-R′$', 'ethery', '-ether / alkoxy-', 'diethylether $C2H5OC2H5$'],
              ['$-CHO$', 'aldehydy', '-al / oxo-', 'ethanal $CH3CHO$'],
              ['$R-CO-R′$', 'ketony', '-on / oxo-', 'propanon $CH3COCH3$'],
              ['$-COOH$', 'karboxylové kyseliny', 'kyselina …ová / karboxy-', 'kyselina ethanová $CH3COOH$'],
              ['$-COO-R$', 'estery', 'alkyl-…oát', 'ethyl-ethanoát $CH3COOC2H5$'],
              ['$-NH2$', 'aminy', '-amin / amino-', 'methylamin $CH3NH2$'],
              ['$-CONH2$', 'amidy', '-amid', 'ethanamid $CH3CONH2$'],
              ['$-NO2$', 'nitrosloučeniny', 'nitro-', 'nitrobenzen $C6H5NO2$'],
            ], caption: 'Přehled funkčních skupin. Aldehydy až nitrosloučeniny podrobně probereme v dalších lekcích.' },
            { type: 'p', text: 'Ve sloupci s názvy vidíš, že se skupina objeví buď v příponě, nebo v předponě. Kdy kterou použít:' },
            { type: 'compare', columns: [
              { title: 'Přípona', icon: 'pencil', tone: 'a', points: ['jediná skupina v molekule: ethan**ol**', 'u více skupin jen ta nejdůležitější'] },
              { title: 'Předpona', icon: 'book', tone: 'b', points: ['ostatní skupiny, když jich je víc', 'halogeny a nitroskupina vždy jen předponou: chlor-, nitro-'] },
            ], caption: 'Předpona, nebo přípona?' },
            { type: 'game', gameId: 'functional-groups', text: 'Poznáš skupinu atomů a přiřadíš ji ke správné třídě? Vyzkoušej hru Funkční skupiny.' },
            { type: 'p', text: 'Mapu skupin máš v ruce. Začneme tou nejjednodušší, která je jen jediný atom: halogenem.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď funkční skupinu ke třídě látek.', pairs: [
              ['$-OH$ (na řetězci)', 'alkoholy'],
              ['$-COOH$', 'karboxylové kyseliny'],
              ['$-NH2$', 'aminy'],
              ['$-CHO$', 'aldehydy'],
              ['$-Cl$', 'halogenderiváty'],
            ], explain: 'Hydroxyl, karboxyl, aminoskupina, aldehydová skupina a halogen jsou nejčastější funkční skupiny organické chemie.' } },
          ],
        },
        {
          title: 'Halogenderiváty',
          icon: 'ozone',
          blocks: [
            { type: 'p', text: 'Halogenderiváty už jsi potkal/a u radikálové chlorace methanu. **Halogenderiváty** vzniknou náhradou vodíku atomem halogenu. Halogen se v názvu vyjadřuje vždy předponou **fluor-, chlor-, brom-, jod-** s lokantem, více stejných halogenů dostane násobicí předponu.' },
            { type: 'molecule', molecules: ['CH3Cl', 'vinyl-chloride', 'CCl2F2'], labels: ['chlormethan $CH3Cl$', 'chlorethen (vinylchlorid) $CH2=CHCl$, monomer PVC', 'dichlordifluormethan (freon) $CCl2F2$'] },
            { type: 'p', text: 'Podle stejného pravidla pojmenuješ i další halogenderiváty. Některé z nich znáš z laboratoře nebo z kuchyně:' },
            { type: 'table', headers: ['Vzorec', 'Název', 'Poznámka'], rows: [
              ['$CH2Cl2$', 'dichlormethan', 'rozpouštědlo'],
              ['$CHCl3$', 'trichlormethan', 'chloroform'],
              ['$CH3-CHBr-CH3$', '2-brompropan', ''],
              ['$CF2=CF2$', 'tetrafluorethen', 'monomer teflonu'],
            ], caption: 'Další halogenderiváty' },
            { type: 'p', text: 'Proč jsou halogenderiváty reaktivnější než alkany? Rozhoduje o tom jediná vazba:' },
            { type: 'formula', text: '$C^{δ+}-X^{δ-}$', caption: 'vazba uhlík–halogen je polární, uhlík nese částečný kladný náboj' },
            { type: 'p', text: 'Halogen je elektronegativnější než uhlík, a tak je vazba $C-X$ **polární** a na kladně polarizovaném uhlíku stojí reaktivita halogenderivátů. S vodou se nemísí a ty s více halogeny bývají nehořlavé a těžší než voda.' },
            { type: 'callout', variant: 'fact', text: 'Teflon (PTFE) je tak nereaktivní a kluzký, že na něm skoro nic neulpí. Objevil ho v roce 1938 Roy Plunkett, když mu v tlakové lahvi s tetrafluorethenem samovolně vznikl bílý prášek.' },
            { type: 'p', text: 'Stálost halogenderivátů je ale dvousečná zbraň. **Freony** (chlorfluorované uhlovodíky, CFC), např. $CCl2F2$, plnily ledničky a spreje: jsou nejedovaté, nehořlavé a velmi stálé. Právě proto vydrží tak dlouho, že vystoupají až do stratosféry.' },
            { type: 'diagram', id: 'ozone-layer', caption: 'Ozonová vrstva ve stratosféře pohlcuje většinu UV záření. UV záření z freonu odštěpí radikál chloru $Cl·$ a ten rozkládá ozon v cyklu $Cl· + O3 -> ClO· + O2$ a $ClO· + O -> Cl· + O2$, ve kterém se sám neustále obnovuje: jediný atom chloru zničí až 100 000 molekul ozonu.' },
            { type: 'callout', variant: 'fact', title: 'Montrealský protokol (1987)', text: 'Nad Antarktidou vznikla ozonová díra. Montrealský protokol výrobu freonů zakázal a díra by se měla zacelit kolem roku 2066.' },
            { type: 'p', text: 'Freony škodí, protože jsou příliš stálé. V laboratoři naopak využíváme to, že kladně polarizovaný uhlík ve vazbě $C-X$ ochotně reaguje.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč freony poškozují ozonovou vrstvu?', options: [
              'UV záření z nich uvolní radikály chloru, které katalyticky rozkládají ozon',
              'Jsou jedovaté pro fytoplankton v oceánech',
              'Reagují s dusíkem ve vzduchu na kyselé deště',
              'Pohlcují UV záření místo ozonu, a ten pak chybí',
            ], answer: 0, explain: 'Radikál $Cl·$ se v cyklu rozkladu ozonu stále obnovuje, a proto jich stačí málo na obrovské škody.' } },
            { type: 'check', question: { kind: 'text', q: 'Napiš systematický název látky $CHCl3$ (chloroform).', accept: ['trichlormethan'], explain: 'Tři atomy chloru na methanu: tri + chlor + methan = trichlormethan.' } },
          ],
        },
        {
          title: 'Nukleofilní substituce $S_{N}1$, $S_{N}2$ a eliminace',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Kladně polarizovaný uhlík láká částice s volným elektronovým párem nebo záporným nábojem, například $OH^-$. Takovým částicím říkáme **nukleofily** („milovníci jader“). Nukleofil vytlačí halogen, který odejde jako anion: to je **nukleofilní substituce** ($S_{N}$).' },
            { type: 'reaction', equation: 'C2H5Br + NaOH -> C2H5OH + NaBr', caption: 'substituce ve vodném roztoku $NaOH$: halogen vystřídá skupina $-OH$ (iontově $CH3-CH2-Br + OH^- -> CH3-CH2-OH + Br^-$)' },
            { type: 'p', text: 'Substituce může proběhnout dvěma cestami. Která vyhraje, záleží hlavně na tom, kolik alkylů nese uhlík s halogenem.' },
            { type: 'p', text: 'Obě cesty se liší tím, jestli halogen odchází současně s příchodem nukleofilu, nebo dřív:' },
            { type: 'compare', columns: [
              { title: '$S_{N}2$: jedním krokem', icon: 'speed', tone: 'a', points: ['nukleofil útočí **zezadu**, z opačné strany než odchází halogen', 'nová vazba vzniká a stará zaniká **současně**', 'rychlost v = k·[RX]·[$OH^-$]: závisí na obou látkách („2“ = dvě částice v kroku)', 'typická pro **primární** halogenderiváty', 'molekula se „převrátí“ jako deštník ve větru'] },
              { title: '$S_{N}1$: dvěma kroky', icon: 'stopwatch', tone: 'b', points: ['nejdřív halogen **sám odstoupí** a vznikne plochý **karbokation** (pomalý krok)', 'pak se rychle připojí nukleofil, z kterékoli strany', 'rychlost v = k·[RX]: na nukleofilu nezávisí („1“)', 'typická pro **terciární** halogenderiváty: jejich karbokation je stabilní (minulá lekce)', 'z chirální látky vznikne směs obou enantiomerů'] },
            ], caption: 'Dva mechanismy nukleofilní substituce' },
            { type: 'p', text: 'Dvoukrokovou cestu $S_{N}1$ si rozeber podrobněji na terciárním bromidu:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'ion-plus', title: '1. Ionizace (pomalu)', text: '$(CH3)3C-Br -> (CH3)3C^+ + Br^-$: vazba se štěpí heterolyticky, vznikne terciární karbokation' },
              { icon: 'ion-minus', title: '2. Útok nukleofilu (rychle)', text: '$(CH3)3C^+ + OH^- -> (CH3)3C-OH$: vznikne 2-methylpropan-2-ol' },
            ], caption: 'Mechanismus $S_{N}1$ u 2-brom-2-methylpropanu' },
            { type: 'p', text: 'Teď už můžeš předpovědět, kterou cestou se konkrétní halogenderivát vydá:' },
            { type: 'table', headers: ['Halogenderivát', 'Převládá', 'Proč'], rows: [
              ['primární, např. 1-brombutan', '$S_{N}2$', 'uhlík je zezadu volně přístupný, primární karbokation je nestabilní'],
              ['sekundární, např. 2-brombutan', '$S_{N}1$ i $S_{N}2$', 'rozhodují podmínky (rozpouštědlo, nukleofil)'],
              ['terciární, např. 2-brom-2-methylpropan', '$S_{N}1$', 'tři alkyly brání útoku zezadu, ale stabilizují karbokation'],
            ], caption: 'Kdo jde kterou cestou' },
            { type: 'p', text: 'Mechanismus se dá poznat i bez kreslení, z toho, jak rychlost závisí na koncentracích:' },
            { type: 'example', title: 'Mechanismus z kinetiky', problem: 'Při hydrolýze halogenderivátu zdvojnásobíš koncentraci $OH^-$ a rychlost se nezmění. Zdvojnásobíš koncentraci halogenderivátu a rychlost se zdvojnásobí. Který mechanismus to je?', steps: [
              'Rychlost nezávisí na [$OH^-$], je vůči němu nultého řádu (řády reakce z úrovně 6).',
              'Vůči halogenderivátu je reakce prvního řádu: v = k·[RX].',
              'V nejpomalejším kroku je tedy jen molekula halogenderivátu, která se sama rozpadá na karbokation.',
            ], answer: 'Jde o **$S_{N}1$**, nejspíš u terciárního halogenderivátu.' },
            { type: 'p', text: 'Hydroxidový ion ale nemusí halogen jen vytlačit. Za jiných podmínek se chová jako zásada a vznikne úplně jiný produkt:' },
            { type: 'compare', columns: [
              { title: 'Substituce ($S_{N}$)', icon: 'drop', tone: 'a', points: ['vodný roztok $NaOH$, mírné zahřívání', '$OH^-$ jako **nukleofil** napadne uhlík', 'z bromethanu vznikne **ethanol**'] },
              { title: 'Eliminace ($E$)', icon: 'heat', tone: 'b', points: ['horký roztok $KOH$ v **ethanolu** (ne ve vodě)', '$OH^-$ jako **zásada** utrhne proton ze sousedního uhlíku, odštěpí se $HX$', 'vznikne dvojná vazba $C=C$: z bromethanu **ethen**; opak adice', 'nejochotněji u terciárních halogenderivátů'] },
            ], caption: 'Stejné činidlo, dvě role: nukleofil, nebo zásada' },
            { type: 'p', text: 'Takhle vypadá eliminace z bromethanu v rovnici. Porovnej ji se substitucí na začátku oddílu: místo alkoholu vzniká alken.' },
            { type: 'reaction', equation: 'C2H5Br + KOH -> C2H4 + KBr + H2O', caption: 'eliminace v horkém ethanolovém roztoku $KOH$: vzniká ethen' },
            { type: 'callout', variant: 'mascot', text: 'Voda a mírnější podmínky vedou k substituci, alkohol a horko k eliminaci. Jak se mechanismy kreslí zahnutými šipkami, uvidíš v lekci o dusíkatých derivátech.' },
            { type: 'p', text: 'Z halogenderivátu tedy umíš udělat alkohol i alken. Alkoholy jsou tak důležité, že jim patří celý další oddíl.' },
            { type: 'check', question: { kind: 'choice', q: 'Který halogenderivát reaguje s vodou nejochotněji mechanismem $S_{N}1$?', options: ['2-brom-2-methylpropan', '1-brombutan', 'brommethan', '1-brompropan'], answer: 0, explain: 'Je terciární: odštěpením bromidu vznikne stabilní terciární karbokation. Ostatní jsou primární (nebo methylové) a reagují spíš $S_{N}2$.' } },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne z 2-brompropanu v horkém ethanolovém roztoku $KOH$?', options: ['propen', 'propan-2-ol', 'propan', '2,2-dibrompropan'], answer: 0, explain: 'Horký ethanolový $KOH$ vede k eliminaci: odštěpí se $HBr$ a vznikne dvojná vazba, tedy propen.' } },
            { type: 'check', question: { kind: 'tf', q: 'Nukleofil je částice s nedostatkem elektronů, která napadá místa s vysokou elektronovou hustotou.', answer: false, explain: 'To je popis elektrofilu. Nukleofil má volný elektronový pár nebo záporný náboj a napadá kladně polarizovaný uhlík.' } },
          ],
        },
        {
          title: 'Alkoholy: stavba, názvy a vodíkové můstky',
          icon: 'glass',
          blocks: [
            { type: 'p', text: 'Ethanol ze substituce je nejznámějším zástupcem velké skupiny. **Alkoholy** mají **hydroxylovou skupinu** $-OH$ navázanou na uhlík s jednoduchými vazbami. Název tvoří přípona **-ol** s lokantem: methanol, ethanol, propan-1-ol, propan-2-ol, butan-2-ol.' },
            { type: 'molecule', molecules: ['methanol', 'ethanol', 'propan-2-ol'], labels: ['methanol $CH3OH$', 'ethanol $C2H5OH$', 'propan-2-ol'] },
            { type: 'p', text: 'Alkoholy třídíme podobně jako uhlíky v řetězci: podle toho, kolik dalších uhlíků sousedí s uhlíkem nesoucím $-OH$. Na tom bude záviset, jak se oxidují.' },
            { type: 'compare', columns: [
              { title: 'Primární', tone: 'a', points: ['uhlík s $-OH$ nese 1 další uhlík', 'ethanol $CH3-CH2-OH$, propan-1-ol'] },
              { title: 'Sekundární', tone: 'b', points: ['uhlík s $-OH$ nese 2 další uhlíky', 'propan-2-ol $CH3-CH(OH)-CH3$, butan-2-ol'] },
              { title: 'Terciární', tone: 'c', points: ['uhlík s $-OH$ nese 3 další uhlíky', '2-methylpropan-2-ol'] },
            ], caption: 'Rozhoduje, na kolik dalších uhlíků je navázaný uhlík nesoucí $-OH$' },
            { type: 'p', text: 'Terciární alkohol se v racionálním vzorci poznává nejhůř, tak si ho prohlédni nakreslený:' },
            { type: 'structure', art: s`
      CH3
      |
CH3 — C — CH3        terciární
      |
      OH`, caption: '2-methylpropan-2-ol: uhlík se skupinou $-OH$ nese tři další uhlíky' },
            { type: 'p', text: 'Molekuly s více skupinami $-OH$ jsou **dioly** a **trioly**. **Ethan-1,2-diol** (ethylenglykol) je sladký a jedovatý a plní se jím chladiče aut jako nemrznoucí směs. **Propan-1,2,3-triol** je glycerol.' },
            { type: 'molecule', molecules: ['ethylene-glycol', 'glycerol'], labels: ['ethan-1,2-diol (ethylenglykol)', 'propan-1,2,3-triol (glycerol)'] },
            { type: 'p', text: 'Skupina $-OH$ tvoří **vodíkové můstky** (úroveň 3). Alkoholy proto vřou mnohem výš než alkany s podobnou molární hmotností a ty krátké se s vodou mísí v libovolném poměru. S délkou řetězce rozpustnost klesá, protože převládne nepolární uhlovodíkový „ocas“.' },
            { type: 'diagram', id: 'hydrogen-bonds', caption: 'Vodíkové můstky mezi molekulami vody (úroveň 3). Stejně se přes skupiny $-OH$ poutají i molekuly alkoholů.' },
            { type: 'p', text: 'Jak velký je vliv vodíkových můstků, ukážou čísla. Porovnej hlavně propan a ethanol, které mají skoro stejnou molární hmotnost:' },
            { type: 'table', headers: ['Látka', 'M (g/mol)', 'Teplota varu', 'Ve vodě'], rows: [
              ['propan $C3H8$', '44', '−42 °C', 'nerozpustný'],
              ['ethanol $C2H5OH$', '46', '78 °C', 'mísí se neomezeně'],
              ['butan-1-ol $C4H9OH$', '74', '118 °C', 'omezeně, asi 7 g ve 100 g vody'],
              ['hexan-1-ol $C6H13OH$', '102', '157 °C', 'velmi málo, asi 0,6 g ve 100 g vody'],
            ], caption: 'Vodíkové můstky zvyšují teplotu varu, dlouhý řetězec snižuje rozpustnost' },
            { type: 'p', text: 'Stavbu alkoholů už znáš. Teď se dostaneme k otázce z úvodu: co se s alkoholem stane, když se oxiduje, třeba v našich játrech.' },
            { type: 'check', question: { kind: 'choice', q: 'Který alkohol je terciární?', options: ['2-methylpropan-2-ol', 'butan-2-ol', 'propan-1-ol', '2-methylpropan-1-ol'], answer: 0, explain: 'V 2-methylpropan-2-olu nese uhlík se skupinou $-OH$ tři methyly. Butan-2-ol je sekundární, propan-1-ol i 2-methylpropan-1-ol primární.' } },
            { type: 'check', question: { kind: 'tf', q: 'Ethanol má mnohem vyšší teplotu varu než propan hlavně díky vodíkovým můstkům.', answer: true, explain: 'Molární hmotnost mají skoro stejnou (46 a 44 g/mol), ale molekuly ethanolu drží pohromadě vodíkové můstky.' } },
          ],
        },
        {
          title: 'Oxidace alkoholů a významné alkoholy',
          icon: 'flask',
          blocks: [
            { type: 'p', text: 'Než se dostaneme k oxidaci, podívejme se, odkud se ethanol bere. **Ethanol** vzniká **alkoholovým kvašením** cukrů pomocí kvasinek bez přístupu vzduchu. Kvasinky vydrží zhruba do 15 % alkoholu, silnější nápoje se proto destilují.' },
            { type: 'reaction', equation: 'C6H12O6 -> 2C2H5OH + 2CO2', caption: 'alkoholové kvašení glukózy' },
            { type: 'p', text: 'Ethanol z kvašení se dá dál oxidovat. Co vznikne, záleží na tom, jestli je alkohol primární, sekundární, nebo terciární:' },
            { type: 'table', headers: ['Alkohol', 'Oxidací vzniká', 'Příklad'], rows: [
              ['primární', 'aldehyd, dál karboxylová kyselina', 'ethanol -> ethanal -> kyselina octová'],
              ['sekundární', 'keton', 'propan-2-ol -> propanon (aceton)'],
              ['terciární', 'za mírných podmínek nic', '2-methylpropan-2-ol se nemění'],
            ], caption: 'V laboratoři i v těle se alkoholy **oxidují** (v laboratoři např. dichromanem draselným v kyselém prostředí). Co vznikne, záleží na typu alkoholu.' },
            { type: 'callout', variant: 'fact', title: 'Dechová zkouška', text: 'Staré detekční trubičky obsahovaly oranžový dichroman draselný $K2Cr2O7$. Ethanol z dechu ho zredukoval na zelené ionty $Cr^3+$: čím víc zelené, tím víc alkoholu. Dnešní přístroje měří elektrochemicky.' },
            { type: 'p', text: 'V laboratoři se alkoholy oxidují **dichromanem draselným** okyseleným kyselinou sírovou. Oranžové ionty $Cr2O7^2-$ se přitom redukují na zelené $Cr^3+$. Barva tedy prozradí typ alkoholu: ==primární a sekundární alkohol roztok zezelená, terciární ho nechá oranžový.==' },
            { type: 'compare', columns: [
              { title: 'Chceš aldehyd', icon: 'steam', tone: 'a', points: ['oxidovadla jen tolik, kolik je třeba', 'aldehyd **hned oddestiluj**: vře níž než alkohol, protože netvoří vodíkové můstky', 'ethanol (78 °C) -> ethanal (20 °C)'] },
              { title: 'Chceš kyselinu', icon: 'arrow-cycle', tone: 'b', points: ['**nadbytek** oxidovadla', 'směs vař **pod zpětným chladičem**, aby aldehyd neutekl a zoxidoval se dál', 'ethanol -> kyselina ethanová (octová)'] },
            ], caption: 'Z primárního alkoholu získáš aldehyd, nebo kyselinu: rozhodují podmínky' },
            { type: 'p', text: 'Oxidaci ethanolu až na kyselinu zvládnou i bakterie, bez dichromanu, jen se vzdušným kyslíkem:' },
            { type: 'reaction', equation: 'C2H5OH + O2 -> CH3COOH + H2O', caption: 'octové kvašení: bakterie octového kvašení na vzduchu oxidují ethanol na kyselinu octovou. Proto otevřené víno zkysne na ocet.' },
            { type: 'callout', variant: 'warning', title: 'Methanol zabíjí', text: '**Methanol** $CH3OH$ se od ethanolu liší jen o skupinu $CH2$, ale v těle je to prudký jed.' },
            { type: 'p', text: 'Odpověď na otázku z úvodu se skrývá právě v oxidaci. Sleduj, co se s methanolem v těle děje:' },
            { type: 'iconlist', items: [
              { icon: 'glass', title: 'Nerozeznáš ho', text: 'vypadá, voní i chutná jako ethanol' },
              { icon: 'enzyme', title: 'Zrádná oxidace', text: 'stejné enzymy ho oxidují na methanal (formaldehyd) a kyselinu mravenčí' },
              { icon: 'hazard', title: 'Slepota i smrt', text: 'ty ničí zrakový nerv a okyselují krev; asi 10 ml může způsobit trvalou slepotu, 30 ml i smrt' },
              { icon: 'pill', title: 'Protijed', text: 'překvapivě ethanol (nebo lék fomepizol): obsadí enzym a methanol se vyloučí nezměněný' },
            ] },
            { type: 'p', text: 'Úplně jinou povahu má alkohol se třemi skupinami $-OH$. **Glycerol** (propan-1,2,3-triol) je sladká, hustá a nejedovatá kapalina. Váže vlhkost, a proto je v krémech i zubních pastách. Je součástí tuků (úroveň 9) a jeho ester s kyselinou dusičnou, nitroglycerin, je výbušnina i lék na srdce.' },
            { type: 'p', text: 'Alkoholy už umíš pojmenovat i zoxidovat. Co se ale stane, když skupinu $-OH$ posadíme přímo na benzenové jádro?' },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne oxidací propan-2-olu?', options: ['propanon (aceton)', 'propanal', 'kyselina propanová', 'propen'], answer: 0, explain: 'Propan-2-ol je sekundární alkohol, a ty se oxidují na ketony.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik gramů ethanolu nejvýš vznikne kvašením 360 g glukózy? ($M$(glukóza) = 180 g/mol, $M$(ethanol) = 46 g/mol)', answer: 184, unit: 'g', explain: '360 g glukózy je 2 mol. Z každého molu vzniknou 2 mol ethanolu, tedy 4 mol · 46 g/mol = 184 g.' } },
          ],
        },
        {
          title: 'Fenoly a ethery',
          icon: 'test-tube',
          blocks: [
            { type: 'p', text: '**Fenoly** mají skupinu $-OH$ navázanou přímo na benzenové jádro. Nejjednodušší je **fenol** $C6H5OH$, bílá krystalická látka s typickým pachem. Vedle něj je na obrázku diethylether, ke kterému se dostaneme na konci oddílu:' },
            { type: 'molecule', molecules: ['phenol', 'diethyl-ether'], labels: ['fenol $C6H5OH$', 'diethylether $C2H5-O-C2H5$'] },
            { type: 'p', text: 'Fenol je **slabá kyselina**, mnohem silnější než alkoholy: s hydroxidem sodným dá sůl, fenolát sodný, což ethanol nedokáže.' },
            { type: 'reaction', equation: 'C6H5OH + NaOH -> C6H5ONa + H2O', caption: 'fenol reaguje se zásadou na fenolát sodný' },
            { type: 'p', text: 'Jak silná kyselina fenol je? Porovnej ho s ethanolem a s kyselinami, které už znáš:' },
            { type: 'table', headers: ['Látka', 'pK_{a}', 's $NaOH$', 's $NaHCO3$ (jedlá soda)'], rows: [
              ['ethanol', 'asi 16', 'prakticky nereaguje', 'nereaguje'],
              ['fenol', '10,0', 'fenolát sodný', 'nereaguje, $CO2$ nevzniká'],
              ['kyselina uhličitá', '6,4', 'reaguje', '– (pro srovnání)'],
              ['kyselina octová', '4,8', 'octan sodný', 'šumí, uniká $CO2$'],
            ], caption: 'Čím menší pK_{a}, tím silnější kyselina (úroveň 6). Fenol je asi milionkrát kyselejší než ethanol, ale slabší než kyselina uhličitá.' },
            { type: 'callout', variant: 'remember', title: 'Proč je fenol kyselejší než ethanol', text: 'Ve fenolátovém aniontu $C6H5O^-$ se záporný náboj z kyslíku rozprostře do delokalizovaných π-elektronů kruhu. Rozprostřený náboj = stabilnější anion = ochotnější odštěpení protonu. V ethanolátu $C2H5O^-$ zůstane náboj na kyslíku a alkyl ho ještě „přitlačí“.' },
            { type: 'p', text: 'Fenol se od benzenu liší i reaktivitou jádra. Porovnej to s bromací benzenu z minulé lekce, která potřebovala katalyzátor:' },
            { type: 'reaction', equation: 'C6H5OH + 3Br2 -> C6H2Br3OH + 3HBr', caption: 'fenol odbarví bromovou vodu i bez katalyzátoru a vznikne bílá sraženina 2,4,6-tribromfenolu. Skupina $-OH$ dodává elektrony do kruhu, a ten je proto reaktivnější než benzen.' },
            { type: 'callout', variant: 'fact', text: 'Joseph Lister v roce 1867 začal na operačním sále dezinfikovat nástroje i rány roztokem fenolu (tehdy „kyselina karbolová“) a úmrtnost po operacích prudce klesla. Fenol je ale jedovatý a leptá kůži. Dnes se používají šetrnější fenoly, třeba thymol z tymiánu v ústních vodách.' },
            { type: 'p', text: '**Ethery** mají kyslík mezi dvěma uhlovodíkovými zbytky: $R-O-R′$. Nejznámější je **diethylether** (systematicky ethoxyethan) $CH3-CH2-O-CH2-CH3$. Alkohol, fenol a ether se snadno spletou, proto je porovnej vedle sebe:' },
            { type: 'compare', columns: [
              { title: 'Alkohol', icon: 'glass', tone: 'a', points: ['$-OH$ na uhlíku řetězce', 'vodíkové můstky: ethanol vře při 78 °C', 's vodným $NaOH$ prakticky nereaguje'] },
              { title: 'Fenol', icon: 'test-tube', tone: 'b', points: ['$-OH$ na benzenovém jádře', 'slabá kyselina', 's $NaOH$ tvoří fenolát'] },
              { title: 'Ether', icon: 'gas-cloud', tone: 'c', points: ['$R-O-R′$, bez vodíku na kyslíku', 'netvoří vodíkové můstky: diethylether vře už při 35 °C', 'kyselý vodík nemá vůbec'] },
            ] },
            { type: 'callout', variant: 'warning', text: 'Diethylether sloužil od roku 1846 jako jedno z prvních anestetik při operacích. Jeho páry jsou ale extrémně hořlavé a těžší než vzduch a při dlouhém stání na vzduchu v něm vznikají výbušné peroxidy. V laboratoři pracuj jen v digestoři a daleko od plamene.' },
            { type: 'p', text: 'Teď znáš látky, ve kterých je kyslík na uhlík vázaný jednoduchou vazbou. V příští lekci se kyslík k uhlíku připojí dvojnou vazbou: přijdou aldehydy, ketony, kyseliny a estery.' },
            { type: 'check', question: { kind: 'multi', q: 'Které látky reagují s roztokem $NaOH$ na sůl?', options: ['fenol', 'ethanol', 'diethylether', 'kyselina octová'], answers: [0, 3], explain: 'Fenol i kyselina octová jsou kyseliny a se zásadou tvoří soli. Ethanol je tak slabá kyselina, že s vodným $NaOH$ prakticky nereaguje, a ether nemá kyselý vodík vůbec.' } },
          ],
        },
      ],
      summary: [
        'Funkční skupina určuje chování molekuly, uhlovodíkový zbytek $R$ je jen nosič.',
        'Halogenderiváty mají polární vazbu $C-X$; freony ničí ozon, z chlorethenu je PVC, z tetrafluorethenu teflon.',
        'Primární halogenderiváty podléhají substituci $S_{N}2$ (jeden krok, útok zezadu), terciární $S_{N}1$ přes stabilní karbokation.',
        'Ve vodném $NaOH$ převládá substituce, v horkém ethanolovém $KOH$ eliminace na alken.',
        'Alkoholy mají skupinu $-OH$ a příponu -ol; vodíkové můstky jim dávají vysoké teploty varu.',
        'Dichroman oxiduje primární alkoholy na aldehydy (oddestilovat) nebo kyseliny (reflux), sekundární na ketony, terciární vůbec.',
        'Fenol (pK_{a} 10) je kyselejší než ethanol, protože náboj fenolátu se rozprostře do kruhu; ethery netvoří vodíkové můstky.',
      ],
      quiz: [
        { kind: 'choice', q: 'Který z alkoholů se oxidací změní na keton?', options: ['butan-2-ol', 'butan-1-ol', '2-methylpropan-2-ol', 'methanol'], answer: 0, explain: 'Na keton se oxidují sekundární alkoholy, a sekundární je jen butan-2-ol. Primární dají aldehyd, terciární za mírných podmínek nereaguje.' },
        { kind: 'tf', q: 'Methanol se v těle oxiduje na formaldehyd a kyselinu mravenčí, které poškozují zrakový nerv.', answer: true, explain: 'Proto otrava methanolem často končí slepotou. Protijedem je ethanol nebo fomepizol, které blokují enzym.' },
        { kind: 'text', q: 'Napiš systematický název glycerolu.', accept: ['propan-1,2,3-triol', 'propan 1,2,3 triol', 'propantriol'], explain: 'Glycerol má tři uhlíky a na každém jednu skupinu $-OH$: propan-1,2,3-triol.' },
        { kind: 'match', q: 'Přiřaď vzorec k názvu.', pairs: [
          ['$CH3-CH2-Cl$', 'chlorethan'],
          ['$CH3-CH(OH)-CH3$', 'propan-2-ol'],
          ['$C6H5OH$', 'fenol'],
          ['$CH3-O-CH3$', 'dimethylether'],
        ], explain: 'Halogen jako předpona, alkohol s příponou -ol, $-OH$ na jádře je fenol a kyslík mezi dvěma methyly dává ether.' },
        { kind: 'multi', q: 'Co platí o freonech?', options: [
          'Obsahují uhlík, chlor a fluor',
          'Ve stratosféře z nich UV záření uvolňuje radikály $Cl·$',
          'Jsou vysoce hořlavé a jedovaté',
          'Jejich výrobu omezil Montrealský protokol',
          'Rozloží se v přízemní vrstvě atmosféry během několika dnů',
        ], answers: [0, 1, 3], explain: 'Freony jsou nehořlavé, nejedovaté a velmi stálé. Právě proto se dostanou až do stratosféry.' },
        { kind: 'match', q: 'Přiřaď k mechanismu jeho znak.', pairs: [
          ['$S_{N}2$', 'jeden krok, nukleofil útočí zezadu'],
          ['$S_{N}1$', 'meziproduktem je karbokation'],
          ['eliminace', 'vzniká dvojná vazba $C=C$'],
        ], explain: '$S_{N}2$ probíhá naráz, $S_{N}1$ přes karbokation (typicky u terciárních halogenderivátů) a při eliminaci se odštěpí $HX$ a vznikne alken.' },
        { kind: 'tf', q: 'Diethylether má vyšší teplotu varu než ethanol, protože má větší molekulu.', answer: false, explain: 'Diethylether vře při 35 °C, ethanol při 78 °C. Etherům chybí vodík na kyslíku, takže netvoří vodíkové můstky.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-5
    'l8-5': {
      id: 'l8-5',
      title: 'Karbonylové sloučeniny, kyseliny a estery',
      goals: [
        'Pojmenovat aldehydy, ketony, karboxylové kyseliny, estery a jejich deriváty a nakreslit jejich vzorce',
        'Odlišit aldehyd od ketonu, popsat nukleofilní adici $HCN$ a redukci karbonylu zpět na alkohol',
        'Vysvětlit kyselost karboxylových kyselin i vliv substituentů a zapsat esterifikaci jako rovnovážnou reakci',
        'Popsat hydrolýzu esterů a zmýdelnění a porovnat reaktivitu acylchloridů, anhydridů, esterů a amidů',
      ],
      hook: 'Vůně banánu a ananasu, štiplavý ocet, odlakovač na nehty i mýdlo v koupelně. Všechny spojuje jedna skupina atomů: uhlík s dvojnou vazbou na kyslík. Pojď se podívat, co všechno dokáže.',
      sections: [
        {
          title: 'Aldehydy a ketony',
          icon: 'flask',
          blocks: [
            { type: 'p', text: 'Oxidací alkoholů jsi v minulé lekci dostal/a aldehydy a ketony. Obě třídy spojuje skupina z úvodu: **karbonylová skupina** $C=O$. Je silně polární: elektronegativnější kyslík nese náboj $δ-$, uhlík $δ+$. Podle toho, kde v řetězci sedí, rozlišujeme dvě třídy:' },
            { type: 'compare', columns: [
              { title: 'Aldehyd', tone: 'a', points: ['karbonyl **na konci řetězce**, nese vodík: skupina $-CHO$', 'přípona **-al**', 'ethanal $CH3CHO$'] },
              { title: 'Keton', tone: 'b', points: ['karbonyl **uvnitř řetězce** mezi dvěma uhlíky', 'přípona **-on**', 'propanon (aceton) $CH3COCH3$'] },
            ], caption: 'Uhlík karbonylu se do řetězce vždy počítá.' },
            { type: 'p', text: 'Nejjednodušší aldehydy a keton si prohlédni v prostoru:' },
            { type: 'molecule', molecules: ['formaldehyde', 'acetaldehyde', 'acetone'], labels: ['methanal (formaldehyd)', 'ethanal (acetaldehyd)', 'propanon (aceton)'] },
            { type: 'p', text: 'Na papíře poznáš rozdíl podle toho, co sedí vedle karbonylu: u aldehydu vodík, u ketonu druhý uhlík.' },
            { type: 'structure', art: s`
      O                  O
      ‖                  ‖
CH3 — C — H        CH3 — C — CH3`, caption: 'Ethanal (aldehyd, vlevo) a propanon neboli aceton (keton, vpravo)' },
            { type: 'p', text: 'Řada aldehydů a ketonů má i triviální názvy, pod kterými je potkáš v obchodě nebo v laboratoři:' },
            { type: 'iconlist', items: [
              { icon: 'tree', title: 'Methanal $HCHO$', text: 'formaldehyd: formalín, pryskyřice, dřevotřísky' },
              { icon: 'glass', title: 'Ethanal $CH3CHO$', text: 'acetaldehyd: meziprodukt odbourávání alkoholu' },
              { icon: 'sugar', title: 'Benzaldehyd $C6H5CHO$', text: 'vůně mandlí a marcipánu' },
              { icon: 'drop', title: 'Propanon $CH3COCH3$', text: 'aceton: odlakovač, rozpouštědlo' },
              { icon: 'beaker', title: 'Butanon $CH3COCH2CH3$', text: 'ethylmethylketon (MEK): rozpouštědlo lepidel a barev' },
            ] },
            { type: 'p', text: 'Aldehydy a ketony jsou polární, ale netvoří vodíkové můstky (nemají vodík na kyslíku). Teploty varu mají proto mezi alkany a alkoholy: propanal vře při 48 °C, butan při −1 °C a propan-1-ol při 97 °C, při skoro stejné molární hmotnosti.' },
            { type: 'callout', variant: 'warning', title: 'Formaldehyd', text: 'Methanal je štiplavý plyn a jeho asi 37% vodný roztok, **formalín**, se používá ke konzervaci biologických preparátů. Formaldehyd je ale karcinogenní a dráždí oči i dýchací cesty. Uvolňuje se i z levného nábytku z dřevotřísky, proto nový nábytek dobře větrej.' },
            { type: 'callout', variant: 'fact', text: 'Aceton vzniká i v tvém těle, když dlouho hladovíš nebo při neléčené cukrovce. Tělo pak spaluje hlavně tuky a vznikají tzv. ketolátky. Dech může nasládle vonět po acetonu.' },
            { type: 'p', text: 'Aldehyd a keton se na papíře liší jediným vodíkem. V dalším oddílu uvidíš, jak je podle něj rozeznáš i ve zkumavce.' },
            { type: 'check', question: { kind: 'text', q: 'Napiš systematický název látky $CH3-CH2-CHO$.', accept: ['propanal'], explain: 'Tři uhlíky včetně uhlíku skupiny $-CHO$ a přípona -al: propanal.' } },
            { type: 'check', question: { kind: 'choice', q: 'Která látka je keton?', options: ['$CH3-CO-CH2-CH3$', '$CH3-CH2-CHO$', '$CH3-CH2-COOH$', '$CH3-O-CH2-CH3$'], answer: 0, explain: 'Keton má skupinu $C=O$ uvnitř řetězce, mezi dvěma uhlíky. Jde o butanon. Ostatní jsou aldehyd, kyselina a ether.' } },
          ],
        },
        {
          title: 'Důkaz aldehydů, nukleofilní adice a redukce',
          icon: 'test-tube',
          blocks: [
            { type: 'p', text: 'Aldehydy se snadno **oxidují** na karboxylové kyseliny, jsou tedy **redukční činidla**. Ketony se za mírných podmínek neoxidují, a na tom stojí dvě klasické zkoušky.' },
            { type: 'compare', columns: [
              { title: 'Tollensova zkouška', icon: 'ring', tone: 'a', points: ['amoniakální roztok $AgNO3$ s ionty $[Ag(NH3)2]^+$', 'aldehyd: na stěně zkumavky se vyloučí **stříbrné zrcátko** $Ag$', 'keton: beze změny'] },
              { title: 'Fehlingova zkouška', icon: 'burner', tone: 'b', points: ['modrý roztok s ionty $Cu^2+$', 'aldehyd: vznikne **cihlově červená** sraženina $Cu2O$', 'keton: zůstane modrý'] },
            ], caption: 'Zkoušky na aldehydy (obě se provádějí za zahřátí)' },
            { type: 'p', text: 'Obě zkoušky stojí na stejné reakci: aldehyd se oxiduje a činidlo se přitom redukuje.' },
            { type: 'formula', text: '$R-CHO -> R-COOH$', caption: 'aldehyd se oxiduje na kyselinu, činidlo se přitom redukuje: $Ag^{I} -> Ag^{0}$, $Cu^{II} -> Cu^{I}$' },
            { type: 'callout', variant: 'warning', text: 'Stříbrné zrcátko je krásný pokus, ale Tollensovo činidlo se vždy připravuje čerstvé a po pokusu se hned zlikviduje. Stáním z něj mohou vzniknout výbušné sloučeniny stříbra. Pracuj s ochrannými brýlemi.' },
            { type: 'p', text: 'Druhou typickou reakcí karbonylu je **nukleofilní adice** ($A_{N}$): uhlík $δ+$ láká nukleofily.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'ion-minus', title: 'Útok nukleofilu', text: '$Nu^-$ napadne kladně polarizovaný uhlík $C^{δ+}$' },
              { icon: 'electron', title: 'Elektrony na kyslík', text: 'elektrony π-vazby $C=O$ se přesunou na kyslík a vznikne $O^-$' },
              { icon: 'ion-plus', title: 'Protonace', text: 'kyslík přijme proton $H^+$ z okolí a vznikne skupina $-OH$' },
            ], caption: 'Z $C=O$ vznikne uhlík nesoucí $-OH$ i $-Nu$. Stejně se adují i alkoholy: adice skupiny $-OH$ na aldehydovou skupinu uzavírá do kruhu molekuly cukrů (úroveň 9).' },
            { type: 'p', text: 'Nejznámějším příkladem nukleofilní adice je adice kyanovodíku na ethanal:' },
            { type: 'reaction', equation: 'CH3CHO + HCN -> CH3CH(OH)CN', caption: 'adice kyanovodíku na ethanal: vzniká 2-hydroxypropannitril' },
            { type: 'p', text: 'Projdi si tu adici podle tří kroků mechanismu a všimni si, co se stane s délkou řetězce:' },
            { type: 'example', title: 'Adice HCN krok za krokem', problem: 'Co vznikne adicí $HCN$ na ethanal a proč je ta reakce pro syntézu cenná?', steps: [
              'Nukleofilem je kyanidový anion $CN^-$ (vzniká z $HCN$ v přítomnosti trochy $KCN$). Napadne uhlík $C^{δ+}$ skupiny $-CHO$.',
              'Elektrony π-vazby přejdou na kyslík, vznikne $O^-$ a ten si vezme proton z $HCN$. Uvolní se nový $CN^-$.',
              'Produkt $CH3-CH(OH)-CN$ nese skupinu $-OH$ i nitrilovou skupinu $-C≡N$ na stejném uhlíku.',
              'Řetězec se prodloužil o jeden uhlík. Z nitrilu se hydrolýzou získá kyselina: takhle se v laboratoři vyrábí třeba kyselina mléčná.',
            ], answer: '**2-hydroxypropannitril** $CH3CH(OH)CN$, řetězec delší o jeden uhlík' },
            { type: 'callout', variant: 'warning', text: 'Kyanovodík i kyanidy jsou prudké jedy, které zastaví buněčné dýchání. S nimi pracují jen profesionálové v digestoři. Zajímavost: nový uhlík s $-OH$ je chirální a $CN^-$ může přijít z obou stran plochého karbonylu, takže vznikne směs obou enantiomerů.' },
            { type: 'p', text: 'Jedna nukleofilní adice je obzvlášť užitečná. **Redukcí** (adicí vodíku) se karbonylové sloučeniny mění zpátky na alkoholy. Je to přesný opak oxidace z minulé lekce. V laboratoři se používá **tetrahydridoboritan sodný** $NaBH4$, zdroj hydridového aniontu $H^-$, který se aduje jako nukleofil. Průmyslově stačí vodík s niklem.' },
            { type: 'table', headers: ['Výchozí látka', 'Redukcí vznikne', 'Příklad'], rows: [
              ['aldehyd', 'primární alkohol', 'ethanal -> ethanol'],
              ['keton', 'sekundární alkohol', 'propanon -> propan-2-ol'],
              ['karboxylová kyselina', 'primární alkohol (jen silné činidlo $LiAlH4$)', 'kyselina ethanová -> ethanol'],
            ], caption: 'Oxidace a redukce jsou dvě strany jedné cesty: alkohol ⇄ aldehyd/keton' },
            { type: 'p', text: 'Průmyslová cesta s vodíkem a katalyzátorem vypadá v rovnici takto, na příkladu acetonu:' },
            { type: 'reaction', equation: 'CH3COCH3 + H2 -> CH3CH(OH)CH3', caption: 'hydrogenace acetonu (katalyzátor $Ni$) na propan-2-ol' },
            { type: 'p', text: 'Aldehydy a ketony tedy umíš rozlišit i přeměnit zpátky na alkoholy. Když se ale aldehyd oxiduje dál, vznikne nová třída: karboxylové kyseliny.' },
            { type: 'check', question: { kind: 'tf', q: 'Aceton dává pozitivní Tollensovu zkoušku (stříbrné zrcátko).', answer: false, explain: 'Aceton je keton a ketony se za mírných podmínek neoxidují, takže stříbro nevyredukují.' } },
            { type: 'check', question: { kind: 'choice', q: 'Co pozoruješ při Fehlingově zkoušce s ethanalem?', options: ['vznikne cihlově červená sraženina', 'vyloučí se stříbrné zrcátko', 'roztok se odbarví a vzniknou bublinky', 'nic, roztok zůstane modrý'], answer: 0, explain: 'Ethanal je aldehyd. Zredukuje modré ionty $Cu^2+$ na červenohnědý oxid měďný $Cu2O$.' } },
          ],
        },
        {
          title: 'Karboxylové kyseliny',
          icon: 'lemon',
          blocks: [
            { type: 'p', text: '**Karboxylové kyseliny** mají skupinu $-COOH$ (**karboxyl**): karbonyl a hydroxyl na jednom uhlíku. Systematický název je „kyselina“ + název uhlovodíku + **-ová**, uhlík karboxylu se do řetězce počítá.' },
            { type: 'molecule', molecules: ['formic-acid', 'acetic-acid'], labels: ['kyselina methanová (mravenčí)', 'kyselina ethanová (octová)'] },
            { type: 'p', text: 'Ve strukturním vzorci karboxylu vidíš obě skupiny vedle sebe, karbonyl i hydroxyl:' },
            { type: 'structure', art: s`
      O
      ‖
CH3 — C — O — H`, caption: 'Kyselina ethanová (octová) $CH3COOH$' },
            { type: 'p', text: 'Mnoho karboxylových kyselin má triviální názvy podle toho, odkud je známe:' },
            { type: 'iconlist', items: [
              { icon: 'leaf', title: 'Kyselina methanová (mravenčí) $HCOOH$', text: 'jed mravenců, žahavé chlupy kopřiv' },
              { icon: 'drop', title: 'Kyselina ethanová (octová) $CH3COOH$', text: 'ocet (5–8 %)' },
              { icon: 'milk', title: 'Kyselina butanová (máselná) $CH3CH2CH2COOH$', text: 'žluklé máslo, pot' },
              { icon: 'bread', title: 'Kyselina benzoová $C6H5COOH$', text: 'konzervant E 210' },
              { icon: 'cabbage', title: 'Kyselina ethandiová (šťavelová) $(COOH)2$', text: 'šťovík, rebarbora' },
              { icon: 'flame', title: 'Kyselina oktadekanová (stearová) $C17H35COOH$', text: 'tuky, svíčky' },
            ] },
            { type: 'p', text: '**Mastné kyseliny** mají dlouhý řetězec (zhruba 12–20 uhlíků) a stavějí tuky (úroveň 9). Nasycené jsou palmitová $C15H31COOH$ a stearová $C17H35COOH$, **olejová** $C17H33COOH$ má jednu dvojnou vazbu v poloze cis.' },
            { type: 'molecule', molecules: ['palmitic-acid'], labels: ['kyselina palmitová: dlouhý uhlovodíkový ocas a karboxyl na konci'] },
            { type: 'p', text: 'Karboxylové kyseliny jsou **slabé**: ve vodě odštěpí proton jen malá část molekul. Anion **karboxylát** je stabilizovaný, záporný náboj se rozdělí mezi oba kyslíky.' },
            { type: 'reaction', equation: 'CH3COOH + H2O <=> CH3COO^- + H3O^+', caption: 'kyselina octová je slabá kyselina, pK_{a} ≈ 4,8' },
            { type: 'p', text: 'Se zásadami tvoří soli, **karboxyláty**: z kyseliny octové a $NaOH$ vznikne ethanoát sodný (octan sodný). Karboxylové kyseliny jsou silnější než kyselina uhličitá, takže vytěsní $CO2$ z uhličitanů i hydrogenuhličitanů.' },
            { type: 'reaction', equation: 'CH3COOH + NaHCO3 -> CH3COONa + H2O + CO2', caption: 'bezpečný domácí pokus: ocet + jedlá soda šumí' },
            { type: 'callout', variant: 'remember', text: 'Pořadí kyselosti: ==alkohol < fenol < karboxylová kyselina==. Ethanol s $NaOH$ nereaguje, fenol ano, ale jen karboxylová kyselina je dost silná na to, aby vytěsnila $CO2$ z jedlé sody.' },
            { type: 'p', text: 'Sílu kyseliny mění i to, co visí na řetězci. **Elektronegativní** atomy jako chlor táhnou elektrony k sobě (záporný indukční efekt, −I), záporný náboj karboxylátu se rozprostře a anion je stabilnější: kyselina je **silnější**. Alkyly elektrony naopak dodávají (+I) a kyselinu **oslabují**.' },
            { type: 'table', headers: ['Kyselina', 'Vzorec', 'pK_{a}'], rows: [
              ['kyselina propanová', '$CH3CH2COOH$', '4,9'],
              ['kyselina ethanová (octová)', '$CH3COOH$', '4,8'],
              ['kyselina methanová (mravenčí)', '$HCOOH$', '3,8'],
              ['kyselina chlorethanová (chloroctová)', '$CH2ClCOOH$', '2,9'],
              ['kyselina dichlorethanová (dichloroctová)', '$CHCl2COOH$', '1,3'],
              ['kyselina trichlorethanová (trichloroctová)', '$CCl3COOH$', '0,7'],
            ], caption: 'Každý další chlor kyselinu zesílí zhruba o řád i víc; delší alkyl ji mírně oslabí' },
            { type: 'callout', variant: 'tip', title: 'Blízko, nebo daleko?', text: 'Indukční efekt slábne se vzdáleností. Kyselina 2-chlorbutanová (chlor hned vedle $-COOH$) je proto mnohem silnější než kyselina 4-chlorbutanová, kde je chlor na druhém konci řetězce.' },
            { type: 'p', text: 'Kyselinu umíš pojmenovat a odhadnout její sílu. Teď ji spojíme s alkoholem z minulé lekce a vznikne látka, která voní.' },
            { type: 'check', question: { kind: 'text', q: 'Jak se systematicky jmenuje kyselina mravenčí?', accept: ['kyselina methanová', 'methanová kyselina', 'methanová'], explain: 'Kyselina mravenčí $HCOOH$ má jediný uhlík, tedy kyselina methanová.' } },
            { type: 'check', question: { kind: 'choice', q: 'Která látka vytěsní $CO2$ z jedlé sody?', options: ['kyselina octová', 'fenol', 'ethanol', 'aceton'], answer: 0, explain: 'Jen karboxylové kyseliny jsou silnější než kyselina uhličitá. Fenol je na to příliš slabý a ethanol ani aceton kyselé nejsou.' } },
          ],
        },
        {
          title: 'Esterifikace a vůně ovoce',
          icon: 'apple',
          blocks: [
            { type: 'p', text: 'Kyselina a alkohol spolu za katalýzy kyselinou sírovou reagují na **ester** a vodu. Reakce se nazývá **esterifikace** a je **vratná**: ustaví se chemická rovnováha (úroveň 6).' },
            { type: 'diagram', id: 'esterification', caption: 'Kyselina octová + ethanol ⇌ ethyl-ethanoát (ethylacetát) + voda, katalyzátor koncentrovaná $H2SO4$. Kyselina dá skupinu $-OH$, alkohol vodík: spojí se ve vodu a zbytky v ester.' },
            { type: 'p', text: 'Podle obrázku už zvládneš sestavit vzorec i název esteru z jiné dvojice:' },
            { type: 'example', title: 'Esterifikace krok za krokem', problem: 'Jaký ester vznikne z kyseliny octové a methanolu a jak se jmenuje?', steps: [
              'Kyselina odštěpí celou skupinu $-OH$, alkohol jen vodík ze své skupiny $-OH$. Chemici to dokázali alkoholem s izotopem $^{18}O$: ten skončil v esteru, ne ve vodě.',
              'Skupina $-OH$ a vodík dají dohromady vodu $H2O$. Proto se esterifikaci říká kondenzace: dvě molekuly se spojí a odštěpí malou molekulu.',
              'Zbytek kyseliny $CH3CO-$ a zbytek alkoholu $-OCH3$ se spojí: $CH3COOCH3$.',
              'Název: nejdřív alkyl z alkoholu (**methyl**), spojovník a pak anion kyseliny (kyselina ethanová dá **ethanoát**).',
            ], answer: '**Methyl-ethanoát** (methylacetát) $CH3COOCH3$' },
            { type: 'p', text: 'Rovnováha leží zhruba uprostřed: ze stejného látkového množství kyseliny a alkoholu vzniknou jen asi 2/3 esteru. Výtěžek zvýšíš podle Le Chatelierova principu nadbytkem alkoholu nebo odebíráním vody, kterou navíc sama váže koncentrovaná $H2SO4$.' },
            { type: 'p', text: 'Proč se estery vůbec vyplatí vyrábět? Mnohé z nich voní po ovoci:' },
            { type: 'table', headers: ['Ester', 'Vůně nebo použití'], rows: [
              ['ethyl-ethanoát', 'ovocná vůně, typická pro odlakovače'],
              ['3-methylbutyl-ethanoát', 'banán'],
              ['ethyl-butanoát', 'ananas'],
              ['oktyl-ethanoát', 'pomeranč'],
              ['methyl-salicylát', 'hřejivá mast na svaly'],
            ], caption: 'Estery, které potkáš' },
            { type: 'callout', variant: 'fact', text: 'Umělé ovocné aroma v bonbonech bývá jen jeden nebo pár esterů. Skutečná vůně jahody se ale skládá ze stovek látek, a proto „jahodová“ žvýkačka nikdy nevoní úplně jako jahoda.' },
            { type: 'p', text: 'Esterifikace je vratná, takže musí jít i obráceně. Právě zpětná reakce, hydrolýza, stojí za výrobou mýdla.' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj ester $HCOOCH2CH3$, který vzniká z kyseliny methanové a ethanolu.', accept: ['ethyl-methanoát', 'ethylmethanoát', 'ethyl methanoát', 'ethyl-formiát', 'ethylformiát'], explain: 'Alkyl z alkoholu je ethyl, anion kyseliny methanové je methanoát: ethyl-methanoát (ethylformiát).' } },
            { type: 'check', question: { kind: 'tf', q: 'Esterifikace je nevratná reakce, takže z kyseliny a alkoholu vždy vznikne 100 % esteru.', answer: false, explain: 'Esterifikace je rovnovážná. Bez zásahu vznikají zhruba 2/3 esteru, víc jen s nadbytkem alkoholu nebo odebíráním vody.' } },
          ],
        },
        {
          title: 'Hydrolýza esterů, mýdla a deriváty kyselin',
          icon: 'soap',
          blocks: [
            { type: 'p', text: 'Opakem esterifikace je **hydrolýza** esteru: voda ester rozštěpí zpět na kyselinu a alkohol. Výsledek ale závisí na tom, jestli ji vedeš v kyselém, nebo v zásaditém prostředí:' },
            { type: 'compare', columns: [
              { title: 'V kyselém prostředí', icon: 'equilibrium', tone: 'a', points: ['ester + voda ⇌ kyselina + alkohol', '**vratná** stejně jako esterifikace'] },
              { title: 'V zásaditém prostředí', icon: 'soap', tone: 'b', points: ['s $NaOH$ nebo $KOH$', '**nevratná**: vzniklá kyselina se hned zneutralizuje na karboxylát a ten už s alkoholem nereaguje'] },
            ] },
            { type: 'p', text: 'Zásaditou hydrolýzu ethyl-ethanoátu zapíšeme takto. Místo kyseliny vzniká rovnou její sodná sůl:' },
            { type: 'reaction', equation: 'CH3COOC2H5 + NaOH -> CH3COONa + C2H5OH', caption: 'alkalická hydrolýza ethyl-ethanoátu' },
            { type: 'p', text: 'Tuky jsou estery glycerolu s mastnými kyselinami. Varem s louhem ($NaOH$) vznikne glycerol a sodné soli mastných kyselin, tedy **mýdlo**, a proto se alkalické hydrolýze esterů říká **zmýdelnění**. Sodná mýdla jsou tuhá, draselná mazlavá.' },
            { type: 'diagram', id: 'micelle', caption: 'Jak mýdlo myje: anion mýdla má **hydrofilní** (vodu milující) hlavičku $-COO^-$ a dlouhý **hydrofobní** uhlovodíkový ocas. Ocasy se zanoří do mastnoty, hlavičky zůstanou ve vodě, mastnota se uzavře do drobné kuličky, **micely**, a voda ji spláchne.' },
            { type: 'p', text: 'Ester je jen jeden z derivátů karboxylových kyselin. U dalších tří stojí místo skupiny $-OR$ aminoskupina, chlor, nebo zbytek druhé molekuly kyseliny:' },
            { type: 'table', headers: ['Derivát', 'Skupina', 'Příklad'], rows: [
              ['ester', '$-COO-R$', 'ethyl-ethanoát $CH3COOC2H5$'],
              ['amid', '$-CONH2$', 'ethanamid $CH3CONH2$'],
              ['acylchlorid', '$-COCl$', 'ethanoylchlorid (acetylchlorid) $CH3COCl$'],
              ['anhydrid', '$-CO-O-CO-$', 'anhydrid kyseliny octové (acetanhydrid) $(CH3CO)2O$'],
            ], caption: 'Funkční deriváty karboxylových kyselin: skupina $-OH$ z karboxylu je nahrazená jinou skupinou' },
            { type: 'p', text: 'Deriváty se liší **reaktivitou**: ==acylchlorid > anhydrid > ester > amid.== Odstupující $Cl^-$ se od uhlíku odtrhne nejsnáz, $NH2^-$ nejhůř. Acylchloridy proto na vlhkém vzduchu dýmají: reagují už se vzdušnou vlhkostí a uvolňují $HCl$.' },
            { type: 'reaction', equation: 'CH3COCl + H2O -> CH3COOH + HCl', caption: 'ethanoylchlorid bouřlivě reaguje s vodou na kyselinu octovou a chlorovodík' },
            { type: 'p', text: 'Stejnou ochotu reagovat využijeme k výrobě esteru. Porovnej to s pomalou rovnovážnou esterifikací z minulého oddílu:' },
            { type: 'reaction', equation: 'CH3COCl + C2H5OH -> CH3COOC2H5 + HCl', caption: 'z acylchloridu a alkoholu vznikne ester rychle, bez katalyzátoru a **nevratně**, na rozdíl od rovnovážné esterifikace. S amoniakem stejně vznikne amid: $CH3COCl + 2NH3 -> CH3CONH2 + NH4Cl$.' },
            { type: 'callout', variant: 'warning', text: 'Acylchloridy leptají kůži, oči i plíce a s vodou reagují prudce. Pracuje se s nimi jen v digestoři, v rukavicích a s brýlemi. Anhydridy reagují mírněji, a proto je průmysl používá raději.' },
            { type: 'callout', variant: 'fact', text: 'Acetanhydrid se používá k výrobě kyseliny acetylsalicylové, účinné látky známých léků proti bolesti a horečce. I ta je ester: kyselina octová se v ní váže na fenolovou skupinu $-OH$ kyseliny salicylové.' },
            { type: 'game', gameId: 'functional-groups', text: 'Aldehyd, keton, kyselina, nebo ester? Procvič si je ve hře Funkční skupiny.' },
            { type: 'p', text: 'Teď znáš všechny důležité kyslíkaté deriváty. V příští lekci přibude dusík: aminy, amidy a nitrosloučeniny, a k tomu velký přehled reakčních mechanismů.' },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne varem tuku s roztokem $NaOH$?', options: ['glycerol a mýdlo (sodné soli mastných kyselin)', 'glycerol a volné mastné kyseliny', 'ester a voda', 'ethanol a octan sodný'], answer: 0, explain: 'Zásada ester rozštěpí nevratně: z tuku vznikne glycerol a karboxyláty mastných kyselin, tedy mýdlo.' } },
            { type: 'check', question: { kind: 'order', q: 'Seřaď deriváty kyseliny octové od nejreaktivnějšího po nejméně reaktivní.', items: ['ethanoylchlorid', 'anhydrid kyseliny octové', 'ethyl-ethanoát', 'ethanamid'], explain: 'Acylchlorid > anhydrid > ester > amid. Čím snáz odstupující skupina odejde, tím je derivát reaktivnější.' } },
          ],
        },
      ],
      summary: [
        'Karbonylová skupina $C=O$ je polární; aldehydy ($-CHO$, přípona -al) ji mají na konci řetězce, ketony (přípona -on) uvnitř.',
        'Aldehydy jsou redukční: s Tollensovým činidlem dávají stříbrné zrcátko, s Fehlingovým červený $Cu2O$. Ketony ne.',
        'Na karbonylový uhlík $δ+$ se adují nukleofily: $HCN$ prodlouží řetězec o uhlík, redukce ($NaBH4$, $H2/Ni$) vrátí aldehyd na primární a keton na sekundární alkohol.',
        'Karboxylové kyseliny ($-COOH$) jsou slabé, ale silnější než fenoly a alkoholy; elektronegativní substituenty jako chlor je zesilují.',
        'Esterifikace kyseliny s alkoholem je vratná; ester se jmenuje alkyl-alkanoát, např. ethyl-ethanoát.',
        'Alkalická hydrolýza esterů je nevratná; zmýdelněním tuků vzniká glycerol a mýdlo. Reaktivita derivátů: acylchlorid > anhydrid > ester > amid.',
      ],
      quiz: [
        { kind: 'match', q: 'Přiřaď vzorec k systematickému názvu.', pairs: [
          ['$CH3CHO$', 'ethanal'],
          ['$CH3COCH3$', 'propanon'],
          ['$CH3COOH$', 'kyselina ethanová'],
          ['$CH3COOCH3$', 'methyl-ethanoát'],
        ], explain: 'Aldehyd končí na -al, keton na -on, kyselina na -ová a ester má tvar alkyl-alkanoát.' },
        { kind: 'tf', q: 'Aldehydy se snadno oxidují, a proto dávají pozitivní Fehlingovu zkoušku.', answer: true, explain: 'Aldehyd se oxiduje na kyselinu a přitom zredukuje $Cu^2+$ na červený $Cu2O$.' },
        { kind: 'choice', q: 'Čím rozlišíš propanal a propanon?', options: ['Tollensovým činidlem', 'vápennou vodou', 'univerzálním indikátorem', 'roztokem $NaCl$'], answer: 0, explain: 'Propanal jako aldehyd vyloučí stříbrné zrcátko, keton propanon ne. Obě látky jsou neutrální a vápenná voda (důkaz $CO2$) ani sůl s nimi nereagují.' },
        { kind: 'order', q: 'Seřaď látky podle kyselosti od nejslabší po nejsilnější.', items: ['ethanol', 'fenol', 'kyselina octová', 'kyselina chloroctová', 'kyselina trichloroctová'], explain: 'Ethanol je prakticky neutrální, fenol velmi slabá kyselina (pK_{a} 10), kyselina octová slabá (4,8) a každý chlor ji dál zesiluje (2,9 a 0,7).' },
        { kind: 'multi', q: 'Jak zvýšíš výtěžek esterifikace?', options: [
          'přidáš nadbytek alkoholu',
          'budeš odebírat vzniklou vodu',
          'přidáš víc vody',
          'přidáš koncentrovanou $H2SO4$, která váže vodu',
          'přidáš hydroxid sodný',
        ], answers: [0, 1, 3], explain: 'Podle Le Chatelierova principu pomůže nadbytek výchozí látky nebo odebírání produktu. Voda by rovnováhu posunula zpět a $NaOH$ by ester hydrolyzoval.' },
        { kind: 'choice', q: 'Co vznikne redukcí butanonu $CH3COCH2CH3$ tetrahydridoboritanem sodným?', options: ['butan-2-ol', 'butan-1-ol', 'butanal', 'kyselina butanová'], answer: 0, explain: 'Redukcí ketonu vznikne sekundární alkohol; skupina $-OH$ zůstane na uhlíku, kde byl karbonyl, tedy na C2.' },
        { kind: 'tf', q: 'Alkalická hydrolýza esteru je vratná stejně jako esterifikace.', answer: false, explain: 'V zásaditém prostředí se kyselina hned mění na karboxylát, který s alkoholem nereaguje. Reakce proto doběhne až do konce.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-6
    'l8-6': {
      id: 'l8-6',
      title: 'Dusíkaté deriváty a reakční mechanismy',
      goals: [
        'Pojmenovat aminy, amidy a nitrosloučeniny a vysvětlit zásaditost aminů včetně anilinu',
        'Popsat cestu od benzenu přes anilin k azobarvivům a vysvětlit, proč jsou barevná',
        'Zařadit reakci podle typu a mechanismu a zapsat její krok zahnutými šipkami',
        'Naplánovat jednoduchou syntézu: převést jednu funkční skupinu na jinou',
      ],
      hook: 'Pach rybiny, výbušnina TNT i žluté barvivo v limonádě mají v molekule dusík. Nejdřív poznáš dusíkaté deriváty a pak si všechno, co víš o reakcích, složíš do jedné mapy: jak z jedné látky vyrobit jinou.',
      sections: [
        {
          title: 'Aminy: organické zásady',
          icon: 'fish',
          blocks: [
            { type: 'p', text: 'Začneme pachem rybiny z úvodu, za kterým stojí aminy. **Aminy** si představ jako amoniak $NH3$, ve kterém jsou vodíky nahrazené uhlovodíkovými zbytky. Podle počtu uhlíků navázaných na **dusík** jsou **primární** ($R-NH2$), **sekundární** ($R2NH$) a **terciární** ($R3N$). Rozdíl vidíš ve vzorcích:' },
            { type: 'structure', art: s`
      H                   CH3
      |                   |
CH3 — N — H         CH3 — N — CH3`, caption: 'Methylamin (primární amin) a trimethylamin (terciární amin)' },
            { type: 'callout', variant: 'warning', title: 'Pozor na rozdíl', text: 'U alkoholů rozhoduje, kolik uhlíků nese **uhlík** se skupinou $-OH$. U aminů počítáš uhlíky navázané přímo na **dusík**. Třeba $(CH3)3C-NH2$ má dusík na terciárním uhlíku, a přesto je to primární amin.' },
            { type: 'p', text: 'Názvy tvoříme přidáním **-amin** k názvu uhlovodíkového zbytku: methylamin $CH3NH2$, dimethylamin $(CH3)2NH$, trimethylamin $(CH3)3N$, ethylamin $CH3CH2NH2$. Aromatický **anilin** (fenylamin) $C6H5NH2$ je surovina pro výrobu barviv.' },
            { type: 'p', text: 'Jak blízko mají aminy k amoniaku, ukazují modely. Všimni si, co na dusíku zůstalo stejné:' },
            { type: 'molecule', molecules: ['NH3', 'methylamine'], labels: ['amoniak $NH3$', 'methylamin $CH3NH2$'], caption: 'Jeden vodík amoniaku vystřídal methyl, volný elektronový pár na dusíku zůstal' },
            { type: 'p', text: 'Volným elektronovým párem dusík přijme proton. Aminy jsou proto **zásady** podle Brønsteda (úroveň 5), stejně jako amoniak, a jednoduché alkylaminy jsou dokonce o něco silnější zásady než on.' },
            { type: 'formula', text: '$CH3NH2 + H2O <=> CH3NH3^+ + OH^-$', caption: 'methylamin ve vodě: vznikne methylamoniový kation a roztok je zásaditý' },
            { type: 'p', text: 'Když místo vody přidáš kyselinu, proton se na dusík naváže úplně a vznikne sůl:' },
            { type: 'reaction', equation: 'CH3NH2 + HCl -> CH3NH3Cl', caption: 's kyselinou vznikne sůl, methylamonium-chlorid $CH3NH3^+ Cl^-$' },
            { type: 'callout', variant: 'fact', title: 'Proč se ryba zakapává citronem', text: 'Pach rybiny způsobuje hlavně trimethylamin. Kyselina citronová ho převede na sůl, která netěká, a zápach zmizí. Podobně páchnou i aminy z rozkladu bílkovin: putrescin a kadaverin (doslova „mrtvolin“).' },
            { type: 'p', text: 'Aminy jsou tedy organické zásady. Co se ale stane s dusíkem, když ho posadíme vedle karbonylu nebo ho obklopíme kyslíky?' },
            { type: 'check', question: { kind: 'choice', q: 'Proč jsou aminy zásadité?', options: [
              'Dusík má volný elektronový pár, kterým váže proton $H^+$',
              'Ve vodě odštěpují proton',
              'Obsahují ve své molekule ionty $OH^-$',
              'Mají dvojnou vazbu $C=N$',
            ], answer: 0, explain: 'Zásada podle Brønsteda je akceptor protonu. Volný pár na dusíku proton přijme a vznikne amoniový kation.' } },
            { type: 'check', question: { kind: 'tf', q: 'Dimethylamin $(CH3)2NH$ je sekundární amin.', answer: true, explain: 'Na dusík jsou navázané dva uhlíky (dva methyly), takže jde o sekundární amin.' } },
          ],
        },
        {
          title: 'Amidy a nitrosloučeniny',
          icon: 'explosion',
          blocks: [
            { type: 'p', text: 'S amidy ses potkal/a v minulé lekci mezi deriváty kyselin. **Amidy** jsou deriváty karboxylových kyselin, v nichž je $-OH$ z karboxylu nahrazené skupinou $-NH2$. Název dostanou koncovkou **-amid**: methanamid (formamid) $HCONH2$, ethanamid (acetamid) $CH3CONH2$.' },
            { type: 'structure', art: s`
      O
      ‖
CH3 — C — NH2`, caption: 'Ethanamid (acetamid)' },
            { type: 'p', text: 'Amin i amid mají skupinu $-NH2$, a přesto se chovají úplně jinak. Rozhoduje, co sousedí s dusíkem:' },
            { type: 'compare', columns: [
              { title: 'Amin', icon: 'fish', tone: 'a', points: ['$R-NH2$', 'volný pár dusíku ochotně přijme proton', '**zásaditý**'] },
              { title: 'Amid', icon: 'protein', tone: 'b', points: ['$R-CONH2$', 'volný pár je „zaměstnaný“ sousední skupinou $C=O$', 'prakticky **neutrální**', 'amidová vazba $-CO-NH-$ drží bílkoviny (peptidová vazba, úroveň 9) i nylon'] },
            ] },
            { type: 'p', text: '**Nitrosloučeniny** mají skupinu $-NO2$ navázanou přímo na uhlík a v názvu předponu **nitro-**. Na modelech vidíš po jednom zástupci: močovinu, nejznámější amid, a nitrobenzen:' },
            { type: 'molecule', molecules: ['urea', 'nitrobenzene'], labels: ['močovina $CO(NH2)2$', 'nitrobenzen $C6H5NO2$'] },
            { type: 'p', text: 'Obě látky mají velký praktický význam, každá úplně jiný:' },
            { type: 'iconlist', items: [
              { icon: 'flask', title: 'Močovina', text: 'diamid kyseliny uhličité; právě jí Wöhler v roce 1828 odstartoval organickou chemii' },
              { icon: 'blood', title: 'Močovina v těle', text: 'tělo se v ní zbavuje dusíku z bílkovin' },
              { icon: 'fertilizer', title: 'Hnojivo', text: 'nejpoužívanější dusíkaté hnojivo, obsahuje 46 % dusíku' },
              { icon: 'hazard', title: 'Nitrobenzen', text: 'jedovatá kapalina, voní po hořkých mandlích; jeho redukcí se vyrábí anilin' },
            ] },
            { type: 'p', text: 'Nitroskupin může být na jádře i víc. Tři nitroskupiny na toluenu dávají výbušninu z úvodu:' },
            { type: 'formula', text: '$C6H2(NO2)3CH3$', caption: '2,4,6-trinitrotoluen (TNT): toluen se třemi nitroskupinami na benzenovém jádře' },
            { type: 'callout', variant: 'fact', title: 'TNT a nitroglycerin', text: '**TNT** je překvapivě stabilní: dá se tavit, odlévat do tvarů a bez rozbušky nevybuchne. **Nitroglycerin** naopak vybuchne i při otřesu. A pozor na název: nitroglycerin není nitrosloučenina, ale ester glycerolu s kyselinou dusičnou (glycerol-trinitrát), protože skupiny $-NO2$ jsou v něm vázané přes kyslík.' },
            { type: 'p', text: 'Nitrobenzen se dá zredukovat na anilin. A právě anilin je výchozí bod cesty k barvivům.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď vzorec k názvu.', pairs: [
              ['$CH3NH2$', 'methylamin'],
              ['$CH3CONH2$', 'ethanamid'],
              ['$C6H5NO2$', 'nitrobenzen'],
              ['$C6H5NH2$', 'anilin'],
            ], explain: '$-NH2$ na uhlovodíkovém zbytku je amin, $-CONH2$ amid a $-NO2$ nitroskupina.' } },
          ],
        },
        {
          title: 'Anilin a azobarviva',
          icon: 'test-tube',
          blocks: [
            { type: 'p', text: '**Anilin** (fenylamin, systematicky benzenamin) $C6H5NH2$ je nejjednodušší aromatický amin: bezbarvá olejovitá kapalina, která na vzduchu hnědne. Je jedovatý a vstřebává se i kůží. Vyrábí se **redukcí nitrobenzenu**.' },
            { type: 'reaction', equation: 'C6H5NO2 + 3H2 -> C6H5NH2 + 2H2O', caption: 'redukce nitrobenzenu na anilin: průmyslově vodíkem na katalyzátoru, v laboratoři cínem nebo železem a kyselinou chlorovodíkovou' },
            { type: 'p', text: 'Anilin je amin, a přesto je mnohem slabší zásada než methylamin. Porovnej, jak dostupný je volný pár dusíku v různých molekulách:' },
            { type: 'table', headers: ['Látka', 'Kde je volný pár dusíku', 'Zásaditost'], rows: [
              ['methylamin $CH3NH2$', 'methyl ho elektrony ještě „posiluje“', 'silnější než amoniak'],
              ['amoniak $NH3$', 'volný na dusíku', 'srovnávací standard'],
              ['anilin $C6H5NH2$', 'částečně rozprostřený do benzenového kruhu', 'asi 40 000krát slabší zásada než amoniak'],
              ['ethanamid $CH3CONH2$', 'zaměstnaný skupinou $C=O$', 'prakticky neutrální'],
            ], caption: 'Čím víc je volný pár dostupný, tím silnější zásada. Stejná delokalizace, která dělá fenol kyselejším, dělá anilin méně zásaditým.' },
            { type: 'p', text: 'Hlavní využití anilinu jsou barviva. Celá cesta od benzenu k barvivu má pět kroků:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'molecule', title: 'Benzen', text: 'surovina z ropy' },
              { icon: 'flask', title: 'Nitrobenzen', text: 'nitrace nitrační směsí' },
              { icon: 'test-tube', title: 'Anilin', text: 'redukce nitroskupiny na $-NH2$' },
              { icon: 'cold', title: 'Diazoniová sůl', text: '$NaNO2$ + $HCl$ při 0–5 °C: vznikne kation $C6H5N2^+$' },
              { icon: 'star', title: 'Azobarvivo', text: 'kopulace s fenolem nebo aminem: dva kruhy spojí skupina $-N=N-$' },
            ], caption: 'Od benzenu k barvivu v pěti krocích' },
            { type: 'p', text: 'Rozhodující jsou poslední dva kroky. Nejdřív z anilinu vznikne diazoniová sůl. Směs se přitom chladí na 0–5 °C, protože za tepla se diazoniová sůl rozkládá:' },
            { type: 'reaction', equation: 'C6H5NH2 + HNO2 + HCl -> C6H5N2Cl + 2H2O', caption: '**diazotace**: kyselina dusitá vzniká přímo ve směsi z dusitanu sodného a $HCl$; vzniká benzendiazonium-chlorid' },
            { type: 'p', text: 'Vzniklý kation pak hned reaguje s fenolem. Porovnej to s elektrofilní substitucí na benzenu z lekce o aromátech:' },
            { type: 'reaction', equation: 'C6H5N2Cl + C6H5OH -> C6H5N2C6H4OH + HCl', caption: '**azokopulace** v zásaditém roztoku: diazoniový kation jako elektrofil napadne kruh fenolu a vznikne oranžovožlutý 4-hydroxyazobenzen' },
            { type: 'p', text: 'Ve vzorci produktu si najdi skupinu, která oba kruhy spojuje:' },
            { type: 'structure', art: s`
C6H5 — N = N — C6H4 — OH
       └───┘
    azoskupina`, caption: '4-hydroxyazobenzen: azoskupina $-N=N-$ spojuje dva aromatické kruhy' },
            { type: 'p', text: 'Proč jsou azobarviva barevná? Azoskupina propojí oba kruhy v jeden dlouhý **delokalizovaný systém** π-elektronů. Takový systém pohlcuje část viditelného světla (hlavně modrou) a my vidíme doplňkovou barvu, žlutou, oranžovou nebo červenou. Azobarviva proto potkáš všude, kde je potřeba výrazná barva:' },
            { type: 'iconlist', items: [
              { icon: 'test-tube', title: 'Methyloranž', text: 'acidobazický indikátor z úrovně 5: v kyselém červený, v zásaditém žlutý' },
              { icon: 'lemon', title: 'Tartrazin (E 102)', text: 'žluté potravinářské barvivo v limonádách a bonbonech' },
              { icon: 'apple', title: 'Červeň allura (E 129)', text: 'červené barvivo cukrovinek' },
              { icon: 'star', title: 'Textil', text: 'azobarviva tvoří asi dvě třetiny všech syntetických barviv' },
            ] },
            { type: 'callout', variant: 'warning', text: 'Suché diazoniové soli jsou výbušné, proto se s nimi pracuje jen v roztoku a v ledové lázni. Některá azobarviva se v těle štěpí na karcinogenní aminy, a proto EU část z nich zakázala. Potraviny s tartrazinem nebo červení allura musí nést upozornění, že mohou nepříznivě ovlivňovat činnost a pozornost dětí.' },
            { type: 'p', text: 'Teď znáš všechny důležité třídy organických látek. Je čas roztřídit reakce z celé úrovně do jednoho přehledu.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč je anilin mnohem slabší zásada než methylamin?', options: [
              'Volný elektronový pár dusíku je částečně rozprostřený do benzenového kruhu',
              'Anilin nemá na dusíku žádný volný elektronový pár',
              'Anilin je kyselina, protože obsahuje benzenové jádro',
              'Benzenový kruh dodává dusíku elektrony, a tím ho oslabuje',
            ], answer: 0, explain: 'Pár, který je delokalizovaný do kruhu, je pro proton hůř dostupný. U methylaminu zůstává celý na dusíku a methyl ho ještě posiluje.' } },
            { type: 'check', question: { kind: 'text', q: 'Jak se jmenuje skupina $-N=N-$, která spojuje dva aromatické kruhy v barvivech?', accept: ['azoskupina', 'azo skupina', 'azo-skupina', 'azo'], explain: 'Skupina $-N=N-$ je azoskupina, a proto se těmto barvivům říká azobarviva.' } },
          ],
        },
        {
          title: 'Činidla a typy reakcí: velký přehled',
          icon: 'idea',
          blocks: [
            { type: 'p', text: 'Za celou úroveň jsi potkal/a spoustu reakcí. Roztřídíš je podle dvou otázek: **Co se s molekulou děje?** (typ reakce) a **jaká částice útočí?** (mechanismus). Druhá otázka začíná u toho, jak se v reakci trhá vazba:' },
            { type: 'compare', columns: [
              { title: 'Homolytické štěpení', icon: 'sun', tone: 'a', points: ['každý atom si vezme jeden elektron z vazby', 'vzniknou **radikály**', 'typicky za světla nebo za vysoké teploty'] },
              { title: 'Heterolytické štěpení', icon: 'ion-plus', tone: 'b', points: ['oba elektrony si vezme jeden atom', 'vzniknou **ionty**'] },
            ] },
            { type: 'p', text: 'Podle způsobu štěpení vznikají tři druhy útočících částic, tedy činidel:' },
            { type: 'compare', columns: [
              { title: 'Radikál', icon: 'electron', tone: 'a', points: ['částice s nepárovým elektronem', '$Cl·$, $Br·$, $·CH3$'] },
              { title: 'Elektrofil', icon: 'ion-plus', tone: 'b', points: ['nedostatek elektronů', 'hledá místa bohatá na elektrony: π-vazbu, benzenové jádro', '$H^+$, $NO2^+$, polarizovaná molekula $Br2$'] },
              { title: 'Nukleofil', icon: 'ion-minus', tone: 'c', points: ['volný elektronový pár nebo záporný náboj', 'hledá kladně polarizovaný uhlík', '$OH^-$, $CN^-$, $H2O$, $NH3$'] },
            ], caption: 'Tři druhy činidel' },
            { type: 'p', text: 'A teď první otázka: co se s molekulou stane. Tři hlavní typy reakcí už znáš z jednotlivých lekcí:' },
            { type: 'compare', columns: [
              { title: 'Substituce ($S$)', tone: 'a', points: ['jeden atom nebo skupina se vymění za jinou'] },
              { title: 'Adice ($A$)', tone: 'b', points: ['dvě molekuly se spojí v jednu a zanikne násobná vazba'] },
              { title: 'Eliminace ($E$)', tone: 'c', points: ['z molekuly se odštěpí malá molekula a vznikne násobná vazba'] },
            ], caption: 'Čtvrtým typem je **přesmyk**: atomy uvnitř molekuly se přeskupí a vznikne izomer, např. butan se v rafinerii mění na 2-methylpropan.' },
            { type: 'p', text: 'Obě hlediska teď spojíme. Tady jsou hlavní reakce z této úrovně, každá s typem i mechanismem:' },
            { type: 'table', headers: ['Reakce', 'Typ', 'Mechanismus', 'Příklad'], rows: [
              ['halogenace alkanů', 'substituce', 'radikálový ($Cl·$)', '$CH4 + Cl2 -> CH3Cl + HCl$'],
              ['adice na alkeny', 'adice', 'elektrofilní ($H^+$, $Br2$)', '$CH2=CH2 + HBr -> CH3CH2Br$'],
              ['nitrace benzenu', 'substituce', 'elektrofilní ($NO2^+$)', '$C6H6 + HNO3 -> C6H5NO2 + H2O$'],
              ['halogenderivát + hydroxid', 'substituce', 'nukleofilní ($OH^-$)', '$CH3CH2Br + OH^- -> CH3CH2OH + Br^-$'],
              ['adice na karbonyl', 'adice', 'nukleofilní ($CN^-$)', '$CH3CHO + HCN -> CH3CH(OH)CN$'],
              ['odštěpení $HBr$', 'eliminace', 'zásada ($OH^-$) za horka', '$CH3CH2Br -> CH2=CH2 + HBr$'],
            ], caption: 'Souhrn reakcí z celé úrovně' },
            { type: 'p', text: 'Reakci, kterou v tabulce nenajdeš, zařadíš stejným postupem. Nejdřív typ, pak útočící částice:' },
            { type: 'example', title: 'Jak zařadit reakci', problem: 'Urči typ a mechanismus reakce $CH2=CH-CH3 + Br2 -> CH2Br-CHBr-CH3$.', steps: [
              'Ze dvou molekul vznikla jedna a zmizela dvojná vazba: jde o **adici**.',
              'Činidlo útočí na π-elektrony, tedy na místo bohaté na elektrony. Molekula $Br2$ se u dvojné vazby polarizuje na $Br^{δ+}-Br^{δ-}$ a kladný konec se chová jako **elektrofil**.',
              'Vazby se štěpí heterolyticky, vznikají ionty, ne radikály.',
            ], answer: '**Elektrofilní adice** ($A_{E}$), vzniká 1,2-dibrompropan.' },
            { type: 'callout', variant: 'tip', title: 'Tři otázky ke každé reakci', text: 'Co zmizelo a co přibylo? Kde má molekula přebytek a kde nedostatek elektronů? Kdo koho napadá? Násobné vazby a benzenové jádro lákají elektrofily, uhlík $δ+$ vedle halogenu nebo kyslíku láká nukleofily.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: kolik reakcí a činidel správně zařadíš za 60 sekund?' },
            { type: 'p', text: 'Reakce už umíš zařadit. Chemici ale chtějí víc: zapsat, kam při reakci putují elektrony.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď částici k typu činidla.', pairs: [
              ['$Cl·$', 'radikál'],
              ['$NO2^+$', 'elektrofil'],
              ['$CN^-$', 'nukleofil'],
            ], explain: '$Cl·$ má nepárový elektron, $NO2^+$ je kladný a hledá elektrony, $CN^-$ má záporný náboj a volný elektronový pár.' } },
            { type: 'check', question: { kind: 'choice', q: 'Jakého typu je reakce $CH3-CH2-OH -> CH2=CH2 + H2O$ (dehydratace ethanolu kyselinou sírovou za horka)?', options: ['eliminace', 'adice', 'substituce', 'přesmyk'], answer: 0, explain: 'Z molekuly se odštěpila malá molekula (voda) a vznikla dvojná vazba, to je eliminace.' } },
          ],
        },
        {
          title: 'Zahnuté šipky: jazyk mechanismů',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Mechanismus je příběh elektronů: kde byly, kam odešly a jaké vazby přitom vznikly nebo zanikly. Chemici ho kreslí **zahnutými šipkami**. Každá šipka ukazuje, kam se přesunou elektrony, nikdy ne atomy.' },
            { type: 'compare', columns: [
              { title: 'Celá šipka (plný hrot)', icon: 'electron', tone: 'a', points: ['přesun **elektronového páru**', 'heterolytické štěpení, vznikají ionty', 'elektrofilní a nukleofilní mechanismy'] },
              { title: 'Poloviční šipka („rybářský háček“)', icon: 'sun', tone: 'b', points: ['přesun **jednoho elektronu**', 'homolytické štěpení, vznikají radikály', 'radikálová substituce: vazbu $Cl-Cl$ rozštěpí dvě poloviční šipky, každá k jednomu atomu'] },
            ], caption: 'Dva druhy zahnutých šipek' },
            { type: 'p', text: 'Aby šipky dávaly smysl, drží se tří pravidel:' },
            { type: 'list', ordered: true, items: [
              'Šipka **začíná u elektronů**: u volného elektronového páru, záporného náboje nebo uprostřed vazby, která se trhá.',
              'Šipka **končí tam, kam elektrony jdou**: u atomu, který je dostane, nebo mezi dvěma atomy, kde vznikne nová vazba.',
              'Celkový náboj se zachovává. Uhlík ani jiný prvek 2. periody nesmí dostat víc než oktet.',
            ] },
            { type: 'p', text: 'Podle pravidel si přečti nejjednodušší mechanismus, substituci $S_{N}2$ z lekce o halogenderivátech:' },
            { type: 'structure', art: s`
  ┌──────┐   ┌─┐
  │      ↓   │ ↓
 HO⁻     CH3 — Br

 →   HO — CH3  +  Br⁻`, caption: 'Substituce $S_{N}2$ dvěma šipkami: (1) volný pár $OH^-$ vytvoří vazbu k uhlíku, (2) elektrony vazby $C-Br$ odejdou na brom, který odchází jako $Br^-$.' },
            { type: 'p', text: 'Teď zkus totéž u dvoukrokové reakce, elektrofilní adice z lekce o alkenech:' },
            { type: 'example', title: 'Nakresli šipky k adici HBr na ethen', problem: 'Popiš zahnutými šipkami oba kroky elektrofilní adice $HBr$ na ethen.', steps: [
              'Krok 1, šipka 1: od **dvojné vazby** $C=C$ (π-elektrony) k vodíku molekuly $H^{δ+}-Br^{δ-}$. Vznikne nová vazba $C-H$.',
              'Krok 1, šipka 2: od středu vazby $H-Br$ k **bromu**. Brom odchází jako $Br^-$ a na druhém uhlíku zbude kladný náboj: karbokation $CH3-CH2^+$.',
              'Krok 2, šipka 3: od **volného páru** $Br^-$ ke kladnému uhlíku. Vznikne vazba $C-Br$.',
            ], answer: 'Tři šipky, dva kroky: vznikne bromethan $CH3-CH2Br$.' },
            { type: 'callout', variant: 'warning', title: 'Nejčastější chyba', text: 'Šipka nikdy nezačíná u kladného náboje ani u atomu vodíku a nemíří od nukleofilu „k elektronům“. Elektrony vždy tečou z místa, kde jich je hodně, k místu, kde jich je málo: od nukleofilu k elektrofilu.' },
            { type: 'p', text: 'Šipky ukazují, co se děje uvnitř jedné reakce. V posledním oddílu poskládáme reakce za sebe a naplánujeme celou cestu od suroviny k produktu.' },
            { type: 'check', question: { kind: 'choice', q: 'Kde začíná zahnutá šipka v mechanismu nukleofilní substituce $OH^- + CH3Br$?', options: ['u volného elektronového páru na kyslíku $OH^-$', 'u atomu bromu', 'u kladně polarizovaného uhlíku', 'u atomu vodíku skupiny $OH^-$'], answer: 0, explain: 'Šipka vždy začíná u elektronů. Nukleofil $OH^-$ nabídne svůj volný pár kladně polarizovanému uhlíku.' } },
            { type: 'check', question: { kind: 'tf', q: 'Poloviční šipka („rybářský háček“) znázorňuje přesun jednoho elektronu a používá se u radikálových reakcí.', answer: true, explain: 'Při homolýze si každý atom vezme jeden elektron z vazby, proto jsou potřeba dvě poloviční šipky.' } },
          ],
        },
        {
          title: 'Mapa organické syntézy',
          icon: 'factory',
          blocks: [
            { type: 'p', text: 'Chemik, který vyrábí lék nebo vonnou látku, plánuje cestu jako navigace: ze snadno dostupné suroviny k cíli, přes několik přeměn funkčních skupin. Všechny reakce, které k tomu potřebuješ, už znáš z této úrovně.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'fuel', title: 'Alkan', text: 'dál: $Cl2$, UV záření (radikálová substituce)' },
              { icon: 'hazard', title: 'Halogenalkan', text: 'dál: $NaOH(aq)$, zahřívání (nukleofilní substituce)' },
              { icon: 'glass', title: 'Primární alkohol', text: 'dál: $K2Cr2O7$ + $H2SO4$, hned oddestilovat (oxidace)' },
              { icon: 'flask', title: 'Aldehyd', text: 'dál: $K2Cr2O7$ + $H2SO4$, reflux (oxidace)' },
              { icon: 'lemon', title: 'Karboxylová kyselina', text: 'dál: alkohol + koncentrovaná $H2SO4$ (esterifikace)' },
              { icon: 'apple', title: 'Ester', text: 'vůně, rozpouštědla, tuky' },
            ], caption: 'Hlavní „dálnice“ organické syntézy: každý krok zvýší oxidační číslo uhlíku nebo vymění skupinu' },
            { type: 'p', text: 'Z hlavní dálnice vedou i odbočky. Tahák shrnuje další přeměny, které už znáš:' },
            { type: 'table', headers: ['Z → na', 'Činidlo a podmínky', 'Typ reakce'], rows: [
              ['alken → halogenalkan', '$HX$', 'elektrofilní adice'],
              ['alken → alkohol', '$H2O$, katalyzátor $H^+$, teplo', 'elektrofilní adice (hydratace)'],
              ['alkohol → alken', 'koncentrovaná $H2SO4$, asi 170 °C', 'eliminace (dehydratace)'],
              ['halogenalkan → alken', '$KOH$ v ethanolu, horko', 'eliminace'],
              ['halogenalkan → amin', 'nadbytek $NH3$', 'nukleofilní substituce'],
              ['halogenalkan → nitril (o 1 C delší)', '$KCN$ v ethanolu', 'nukleofilní substituce'],
              ['aldehyd, keton → alkohol', '$NaBH4$ nebo $H2$/$Ni$', 'redukce (nukleofilní adice)'],
              ['aldehyd → hydroxynitril (o 1 C delší)', '$HCN$ + trocha $KCN$', 'nukleofilní adice'],
              ['acylchlorid → amid', '$NH3$', 'nukleofilní substituce na acylu'],
              ['benzen → nitrobenzen → anilin', '$HNO3$ + $H2SO4$; pak $Sn$ + $HCl$', 'elektrofilní substituce; redukce'],
            ], caption: 'Tahák přeměn funkčních skupin' },
            { type: 'p', text: 'S mapou a tahákem zkus naplánovat syntézu sám/sama. Začni od konce: z čeho cílová látka vzniká?' },
            { type: 'example', title: 'Syntéza ve třech krocích', problem: 'Máš jen ethen, vodu a běžná činidla. Jak připravíš ethyl-ethanoát (ethylacetát)?', steps: [
              'Cíl rozlož: ethyl-ethanoát vzniká z **kyseliny ethanové** a **ethanolu**. Obě části mají 2 uhlíky, stejně jako ethen.',
              'Ethen + voda (katalyzátor $H^+$) → **ethanol** (elektrofilní adice).',
              'Část ethanolu oxiduj dichromanem v kyselém prostředí pod zpětným chladičem, aby se oxidace nezastavila u aldehydu → **kyselina ethanová**.',
              'Kyselinu zahřej se zbytkem ethanolu a koncentrovanou $H2SO4$ → **ethyl-ethanoát** (esterifikace).',
            ], answer: 'ethen → ethanol → kyselina ethanová; ta s ethanolem → ethyl-ethanoát' },
            { type: 'callout', variant: 'tip', title: 'Počítej uhlíky', text: 'Má cíl stejný počet uhlíků jako surovina? Stačí měnit skupiny. Je o jeden uhlík delší? Potřebuješ kyanid: $KCN$ k halogenalkanu, nebo $HCN$ k aldehydu. Nitril pak hydrolýzou převedeš na kyselinu.' },
            { type: 'p', text: 'Mapu organické chemie teď umíš použít jako navigaci. V příští lekci uvidíš, jak se pomocí adice a kondenzace skládají obří molekuly: polymery a plasty.' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď meziprodukty přeměny ethanu na kyselinu ethanovou.', items: ['ethan', 'chlorethan', 'ethanol', 'ethanal', 'kyselina ethanová'], explain: 'Radikálová chlorace, nukleofilní substituce vodným $NaOH$ a dvě oxidace: alkohol → aldehyd → kyselina.' } },
            { type: 'check', question: { kind: 'choice', q: 'Jak převedeš propan-2-ol na propen?', options: ['zahřátím s koncentrovanou $H2SO4$', 'vodným roztokem $NaOH$', 'dichromanem draselným v kyselém prostředí', 'tetrahydridoboritanem sodným'], answer: 0, explain: 'Koncentrovaná kyselina sírová za horka odštěpí z alkoholu vodu (eliminace) a vznikne dvojná vazba. Dichroman by propan-2-ol zoxidoval na propanon.' } },
          ],
        },
      ],
      summary: [
        'Aminy jsou deriváty amoniaku; volný pár na dusíku z nich dělá zásady, anilin je slabší zásada, protože se pár rozprostře do kruhu.',
        'Amidy ($-CONH2$) jsou prakticky neutrální; nitrosloučeniny mají skupinu $-NO2$ na uhlíku, nitroglycerin je ester.',
        'Anilin vzniká redukcí nitrobenzenu; diazotací a azokopulací z něj vznikají barevná azobarviva se skupinou $-N=N-$.',
        'Radikály vznikají homolýzou, elektrofily hledají elektrony, nukleofily kladně polarizovaný uhlík; reakce jsou substituce, adice, eliminace a přesmyky.',
        'Zahnutá šipka ukazuje přesun elektronového páru od elektronů k atomu; poloviční šipka přesun jednoho elektronu.',
        'Syntéza je řetěz přeměn funkčních skupin, např. alkan → halogenalkan → alkohol → aldehyd → kyselina → ester; kyanid prodlouží řetězec o uhlík.',
      ],
      quiz: [
        { kind: 'choice', q: 'Která z látek je nejsilnější zásada?', options: ['methylamin', 'anilin', 'ethanamid', 'fenol'], answer: 0, explain: 'Methylamin má volný pár celý na dusíku. U anilinu je částečně v kruhu, u ethanamidu ho „zaměstná“ skupina $C=O$ a fenol je kyselina.' },
        { kind: 'tf', q: 'Nitroglycerin je z chemického hlediska nitrosloučenina, stejně jako TNT.', answer: false, explain: 'V nitroglycerinu jsou skupiny $-NO2$ vázané přes kyslík, je to ester kyseliny dusičné (glycerol-trinitrát). V TNT jsou vázané přímo na uhlík.' },
        { kind: 'text', q: 'Jak se jmenuje látka, která vzniká redukcí nitrobenzenu a je výchozí surovinou azobarviv?', accept: ['anilin', 'fenylamin', 'benzenamin'], explain: 'Redukcí skupiny $-NO2$ vznikne $-NH2$: nitrobenzen se mění na anilin $C6H5NH2$.' },
        { kind: 'match', q: 'Přiřaď reakci k jejímu mechanismu.', pairs: [
          ['$CH4 + Cl2 -> CH3Cl + HCl$ (za světla)', 'radikálová substituce'],
          ['$CH2=CH2 + Br2 -> CH2BrCH2Br$', 'elektrofilní adice'],
          ['$C6H6 + HNO3 -> C6H5NO2 + H2O$', 'elektrofilní substituce'],
          ['$CH3Br + OH^- -> CH3OH + Br^-$', 'nukleofilní substituce'],
        ], explain: 'Světlo a alkan znamenají radikály, dvojná vazba láká elektrofily k adici, benzen podléhá substituci a $OH^-$ je nukleofil.' },
        { kind: 'choice', q: 'Co znázorňuje celá zahnutá šipka (s plným hrotem) v mechanismu?', options: ['přesun elektronového páru', 'přesun jednoho elektronu', 'přesun atomu vodíku', 'směr, kterým se molekula pohybuje'], answer: 0, explain: 'Celá šipka ukazuje, kam se přesune elektronový pár. Pro jeden elektron se kreslí poloviční šipka.' },
        { kind: 'multi', q: 'Které přeměny prodlouží uhlíkatý řetězec o jeden uhlík?', options: ['halogenalkan + $KCN$', 'aldehyd + $HCN$', 'alkohol + $K2Cr2O7$', 'alken + $HBr$', 'ester + $NaOH$'], answers: [0, 1], explain: 'Jen kyanidový anion přináší nový uhlík: vznikne nitril nebo hydroxynitril. Ostatní reakce jen mění funkční skupiny nebo štěpí molekulu.' },
        { kind: 'tf', q: 'Azobarviva jsou barevná, protože azoskupina spojí dva aromatické kruhy do jednoho delokalizovaného systému, který pohlcuje viditelné světlo.', answer: true, explain: 'Dlouhý delokalizovaný systém π-elektronů pohlcuje část viditelného spektra a my vidíme doplňkovou barvu.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-7
    'l8-7': {
      id: 'l8-7',
      title: 'Polymery a plasty',
      goals: [
        'Vysvětlit pojmy monomer, polymer a opakující se jednotka a nakreslit opakující se jednotku adičního polymeru',
        'Porovnat adiční a kondenzační polymeraci na příkladech PE, PVC, PET, nylonu a Kevlaru',
        'Uvést přírodní polymery a rozlišit termoplasty, reaktoplasty a elastomery',
        'Vysvětlit recyklační kódy, mechanickou a chemickou recyklaci, bioplasty a problém mikroplastů',
      ],
      hook: 'Rozhlédni se: telefon, mikina, kartáček na zuby, pneumatiky kola, a dokonce i DNA v tvých buňkách. To všechno jsou polymery, obří molekuly poskládané z tisíců malých dílků jako vláček z vagonků. Jak se takový vláček staví a co s ním, až doslouží?',
      sections: [
        {
          title: 'Monomer, polymer a opakující se jednotka',
          icon: 'molecule',
          blocks: [
            { type: 'p', text: 'V minulých lekcích jsme adicí nebo kondenzací spojovali dvě molekuly v jednu. Teď jich spojíme tisíce. **Polymer** (z řeckého *poly* = mnoho, *meros* = část) je obří molekula, **makromolekula**, složená z tisíců opakujících se dílků. Vzniká spojováním malých molekul, **monomerů**. Ději se říká **polymerace**. Na celou lekci ti vystačí tři pojmy:' },
            { type: 'keyterms', items: [
              { term: 'Monomer', def: 'malá molekula, ze které polymer vzniká, např. ethen $CH2=CH2$' },
              { term: 'Opakující se (strukturní) jednotka', def: 'nejmenší část řetězce, která se pořád opakuje; píše se do hranatých závorek s indexem n: $-[CH2-CH2]_{n}-$' },
              { term: 'Polymerační stupeň n', def: 'kolik jednotek řetězec obsahuje, obvykle stovky až statisíce' },
            ] },
            { type: 'p', text: 'Všechny tři pojmy uvidíš najednou na nejjednodušším plastu, polyethylenu:' },
            { type: 'diagram', id: 'polymer-chain', caption: 'Adiční polymerace ethenu: π-vazby n molekul $CH2=CH2$ se rozpojí a vznikne řetězec polyethylenu (PE), $n CH2=CH2 -> -[CH2-CH2]_{n}-$, ve kterém se pořád opakuje jednotka $-CH2-CH2-$. Zblízka je makromolekula zamotané klubko. Pro srovnání opakující se jednotky PVC a PET.' },
            { type: 'p', text: 'Z molární hmotnosti řetězce se dá spočítat, kolik monomerů se v něm spojilo:' },
            { type: 'example', title: 'Kolik monomerů je v řetězci?', problem: 'Řetězec polyethylenu má molární hmotnost 280 000 g/mol. Z kolika molekul ethenu ($M$ = 28 g/mol) vznikl?', steps: [
              'Při adiční polymeraci se nic neodštěpuje, jednotka $-CH2-CH2-$ má tedy stejnou molární hmotnost jako ethen: 28 g/mol.',
              'n = $M$(polymer) : $M$(jednotka) = 280 000 : 28.',
            ], answer: 'n = **10 000** molekul ethenu' },
            { type: 'p', text: 'Polymery nevymyslel člověk. Příroda z nich staví dřevo, svaly, vlasy i dědičnou informaci. Podrobně je probereme v úrovni 9.' },
            { type: 'table', headers: ['Přírodní polymer', 'Monomer', 'Kde ho potkáš'], rows: [
              ['škrob, celulóza', 'glukóza', 'brambory, mouka; dřevo, bavlna, papír'],
              ['bílkoviny', 'aminokyseliny (spojené amidovou, tzv. peptidovou vazbou)', 'maso, vlasy, hedvábí, enzymy'],
              ['nukleové kyseliny', 'nukleotidy', 'DNA a RNA'],
              ['přírodní kaučuk', 'isopren (2-methylbuta-1,3-dien)', 'latex z kaučukovníku, gumičky'],
            ], caption: 'Přírodní polymery' },
            { type: 'p', text: 'Monomery dvou nejdůležitějších přírodních polymerů si prohlédni zblízka:' },
            { type: 'molecule', molecules: ['alpha-glucose', 'glycine'], labels: ['glukóza: monomer škrobu a celulózy', 'glycin: nejjednodušší aminokyselina'] },
            { type: 'callout', variant: 'fact', title: 'Obří molekuly? Nesmysl!', text: 'Když Hermann Staudinger ve 20. letech 20. století tvrdil, že kaučuk a celulóza jsou obrovské molekuly spojené obyčejnými kovalentními vazbami, kolegové se mu smáli. Měl pravdu a v roce 1953 za to dostal Nobelovu cenu.' },
            { type: 'p', text: 'Pojmy máme. Teď se podíváme na první způsob, jak se monomery spojují: adici na dvojnou vazbu, kterou znáš z alkenů.' },
            { type: 'check', question: { kind: 'number', q: 'Řetězec PVC má molární hmotnost 125 000 g/mol. Kolik opakujících se jednotek $-CH2-CHCl-$ ($M$ = 62,5 g/mol) obsahuje?', answer: 2000, explain: 'n = 125 000 : 62,5 = 2 000 jednotek. Při adiční polymeraci má jednotka stejnou hmotnost jako monomer chlorethen.' } },
          ],
        },
        {
          title: 'Adiční polymerace a jak nakreslit jednotku',
          icon: 'bond',
          blocks: [
            { type: 'p', text: 'Při **adiční polymeraci** se spojují monomery s dvojnou vazbou $C=C$. π-vazby se rozpojí a monomery se navzájem adují. ==Nic se neodštěpuje, takže polymer má stejné složení jako monomer.== Reakci obvykle spustí radikál z přidaného iniciátoru (peroxidu) a řetěz pak roste jako řetězová reakce z lekce o alkanech.' },
            { type: 'p', text: 'Stačí na monomeru vyměnit jeden atom nebo skupinu a vznikne úplně jiný plast. Takhle vypadají monomery nejdůležitějších z nich:' },
            { type: 'molecule', molecules: ['C2H4', 'propene', 'vinyl-chloride', 'styrene'], labels: ['ethen -> PE', 'propen -> PP', 'chlorethen (vinylchlorid) -> PVC', 'styren -> PS'], caption: 'Monomery nejdůležitějších plastů' },
            { type: 'p', text: 'Tabulka k nim přidává teflon, a hlavně opakující se jednotku, kterou z monomeru odvodíš:' },
            { type: 'table', headers: ['Monomer', 'Polymer', 'Opakující se jednotka', 'Použití'], rows: [
              ['ethen $CH2=CH2$', 'polyethylen, PE (systematicky poly(ethen))', '$-CH2-CH2-$', 'sáčky, fólie, kanystry'],
              ['propen $CH2=CH-CH3$', 'polypropylen, PP (poly(propen))', '$-CH2-CH(CH3)-$', 'kelímky, díly aut, textil'],
              ['chlorethen $CH2=CHCl$', 'polyvinylchlorid, PVC', '$-CH2-CHCl-$', 'okna, trubky, podlahy, kabely'],
              ['tetrafluorethen $CF2=CF2$', 'polytetrafluorethylen, PTFE (teflon)', '$-CF2-CF2-$', 'nepřilnavé pánve, těsnění'],
              ['styren $C6H5-CH=CH2$', 'polystyren, PS', '$-CH2-CH(C6H5)-$', 'tácky, pěnový polystyren na zateplení'],
            ], caption: 'Pět nejdůležitějších adičních polymerů' },
            { type: 'p', text: 'Odvodit jednotku je mechanický postup. Podívej se, jak se to dělá u PVC:' },
            { type: 'structure', art: s`
   H   Cl           ┌ H   Cl ┐
   |   |            │ |   |  │
n  C = C     →    ──┤ C — C  ├──
   |   |            │ |   |  │
   H   H            └ H   H  ┘n`, caption: 'Z monomeru na opakující se jednotku: chlorethen → PVC' },
            { type: 'p', text: 'Teď to zkus u monomeru s boční skupinou, u propenu:' },
            { type: 'example', title: 'Nakresli opakující se jednotku', problem: 'Nakresli opakující se jednotku polypropylenu.', steps: [
              'Nakresli monomer propen tak, aby dvojná vazba ležela vodorovně: $CH2=CH-CH3$, methyl visí dolů.',
              'Dvojnou vazbu změň na jednoduchou: π-vazba se při adici spotřebuje na spojení se sousedy.',
              'Z obou uhlíků bývalé dvojné vazby vyveď vazbu ven, přes hranaté závorky, a připiš index n.',
              'Methyl zůstane viset jako **boční skupina**, do hlavního řetězce nepatří.',
            ], answer: '$-[CH2-CH(CH3)]_{n}-$: hlavní řetězec tvoří jen dva uhlíky z dvojné vazby' },
            { type: 'callout', variant: 'warning', title: 'Nejčastější chyba', text: 'Hlavní řetězec adičního polymeru tvoří **jen uhlíky dvojné vazby**. Skupiny $-CH3$, $-Cl$ nebo $-C6H5$ visí do strany. Polypropylen tedy není $-[CH2-CH2-CH2]_{n}-$.' },
            { type: 'p', text: 'Ze stejného monomeru ale nevzniká vždycky stejný plast. Polyethylen se vyrábí ve dvou podobách, které se liší tvarem řetězců:' },
            { type: 'compare', columns: [
              { title: 'LDPE (kód 4)', tone: 'a', points: ['vysoký tlak, radikálová polymerace', 'řetězce hodně **rozvětvené**, nesedí těsně k sobě', 'měkký, pružný, nižší hustota', 'sáčky, fólie'] },
              { title: 'HDPE (kód 2)', tone: 'b', points: ['nízký tlak, Zieglerovy–Nattovy katalyzátory', 'řetězce **lineární**, skládají se těsně vedle sebe', 'tužší, pevnější, vyšší hustota', 'kanystry, lahve od drogerie'] },
            ], caption: 'Stejný monomer, jiný plast: rozhoduje větvení řetězců' },
            { type: 'callout', variant: 'fact', text: 'Polyethylen objevili v roce 1933 v britské firmě ICI víceméně náhodou: v aparatuře pod vysokým tlakem se objevila bílá vosková hmota. Teflon zase v roce 1938 Roy Plunkett, když mu v lahvi s tetrafluorethenem samovolně vznikl bílý prášek.' },
            { type: 'p', text: 'Adiční polymery mají v řetězci jen vazby $C-C$. Druhý způsob polymerace staví řetězec z esterových a amidových vazeb, které už znáš.' },
            { type: 'check', question: { kind: 'text', q: 'Z jakého monomeru vznikl polymer $-[CF2-CF2]_{n}-$? Napiš název.', accept: ['tetrafluorethen', 'tetrafluorethylen', 'tetrafluoreten'], explain: 'Jednotka má dva uhlíky se čtyřmi atomy fluoru. Monomerem je tetrafluorethen $CF2=CF2$ a polymerem teflon (PTFE).' } },
            { type: 'check', question: { kind: 'tf', q: 'Při adiční polymeraci ethenu se odštěpuje voda.', answer: false, explain: 'Při adiční polymeraci se jen rozpojují π-vazby a monomery se spojují. Žádný vedlejší produkt nevzniká.' } },
          ],
        },
        {
          title: 'Kondenzační polymerace: polyestery a polyamidy',
          icon: 'droplets',
          blocks: [
            { type: 'p', text: 'Při **kondenzační polymeraci** se spojují monomery se **dvěma funkčními skupinami** (na každém konci jednou). Při každém spojení se odštěpí malá molekula, nejčastěji voda. Každý monomer má skupiny na obou koncích, a tak řetězec roste oběma směry.' },
            { type: 'diagram', id: 'polymerization-types', caption: 'Adiční polymerace (nahoře): monomery s dvojnou vazbou se spojí beze zbytku. Kondenzační polymerace (dole): dvě různé bifunkční molekuly se spojují a při každé nové vazbě se uvolní molekula $H2O$. Vyznačená je opakující se jednotka.' },
            { type: 'p', text: 'Rozdíly mezi oběma způsoby, které na obrázku vidíš, shrnuje srovnání:' },
            { type: 'compare', columns: [
              { title: 'Adiční polymerace', icon: 'bond', tone: 'a', points: ['monomer má dvojnou vazbu $C=C$', 'vedlejší produkt: žádný', 'vazba v řetězci: $C-C$', 'PE, PP, PVC, PS, PTFE'] },
              { title: 'Kondenzační polymerace', icon: 'droplets', tone: 'b', points: ['monomery mají dvě funkční skupiny, např. $-COOH$ a $-OH$ nebo $-NH2$', 'odštěpí se malá molekula, obvykle $H2O$', 'vazba v řetězci: esterová nebo amidová', 'polyestery (PET), polyamidy (nylon, Kevlar)'] },
            ], caption: 'Dva způsoby, jak postavit polymer' },
            { type: 'p', text: '**PET** (polyethylentereftalát) je **polyester** z ethan-1,2-diolu a kyseliny benzen-1,4-dikarboxylové (tereftalové). Skupina $-OH$ diolu a $-COOH$ kyseliny spolu vytvoří esterovou vazbu, přesně jako při esterifikaci. Dělají se z něj lahve na nápoje i fleecové oblečení.' },
            { type: 'structure', art: s`
      O          O
      ‖          ‖
[ O — C — C6H4 — C — O — CH2 — CH2 ]n`, caption: 'Opakující se jednotka PET: dvě esterové skupiny $-CO-O-$' },
            { type: 'p', text: '**Nylon 6,6** je **polyamid** z hexan-1,6-diaminu a kyseliny hexandiové (adipové). Aminoskupina jednoho monomeru reaguje s karboxylem druhého, odštěpí se voda a vznikne **amidová vazba** $-CO-NH-$, stejná jako v bílkovinách.' },
            { type: 'structure', art: s`
       O            O
       ‖            ‖
[ NH — C — (CH2)4 — C — NH — (CH2)6 ]n`, caption: 'Opakující se jednotka nylonu 6,6: dvě amidové vazby. Čísla 6,6 udávají počet uhlíků v obou monomerech.' },
            { type: 'p', text: '**Kevlar** je aromatický polyamid (aramid) z benzen-1,4-diaminu a kyseliny tereftalové; průmyslově se místo kyseliny používá její reaktivnější **acylchlorid**, a pak se odštěpuje $HCl$. Ploché tuhé řetězce leží rovnoběžně a drží je husté vodíkové můstky, takže vlákno je na stejnou hmotnost asi pětkrát pevnější než ocel.' },
            { type: 'p', text: 'Rozdílná stavba řetězců vede k úplně jinému použití:' },
            { type: 'iconlist', items: [
              { icon: 'plastic-bottle', title: 'PET', text: 'lahve, fólie, fleece' },
              { icon: 'ring', title: 'Nylon', text: 'punčochy, lana, stany, ozubená kolečka' },
              { icon: 'hazard', title: 'Kevlar', text: 'neprůstřelné vesty, helmy, kabely, závodní plachty' },
            ] },
            { type: 'callout', variant: 'fact', text: 'Nylon vyvinul Wallace Carothers ve firmě DuPont ve 30. letech 20. století. Když se v roce 1940 v USA začaly prodávat nylonové punčochy, lidé na ně stáli dlouhé fronty a během pár dní se jich prodaly miliony párů.' },
            { type: 'callout', variant: 'remember', text: 'Esterovou a amidovou vazbu lze **hydrolyzovat** zpět na monomery. Proto se polyestery a polyamidy dají chemicky recyklovat a některé i biologicky rozložit. Adiční polymery mají jen pevné vazby $C-C$ a v přírodě vydrží stovky let.' },
            { type: 'p', text: 'Teď víš, jak se polymery staví. Proč je ale jeden plast měkký jako sáček a jiný tvrdý jako vypínač?' },
            { type: 'check', question: { kind: 'choice', q: 'Která dvojice monomerů může dát polyester?', options: ['ethan-1,2-diol a kyselina tereftalová', 'ethen a propen', 'hexan-1,6-diamin a kyselina adipová', 'chlorethen a styren'], answer: 0, explain: 'Polyester vzniká z diolu a dikarboxylové kyseliny. Diamin s dikyselinou dá polyamid a alkeny polymerují adičně.' } },
            { type: 'check', question: { kind: 'tf', q: 'Při kondenzační polymeraci se kromě polymeru uvolňuje malá molekula, nejčastěji voda.', answer: true, explain: 'Proto se jí říká kondenzační: při každém spojení dvou monomerů se odštěpí třeba voda.' } },
          ],
        },
        {
          title: 'Termoplasty, reaktoplasty a elastomery',
          icon: 'heat',
          blocks: [
            { type: 'p', text: 'Vlastnosti plastu nezávisí jen na monomeru, ale i na tom, jak jsou řetězce uspořádané a jestli je spojují pevné **příčné vazby** (můstky mezi řetězci). Podle toho rozlišujeme tři skupiny:' },
            { type: 'compare', columns: [
              { title: 'Termoplasty', icon: 'heat', tone: 'a', points: ['samostatné lineární nebo rozvětvené řetězce, drží je jen mezimolekulové síly', 'teplem měknou, dají se roztavit a znovu tvarovat', 'PE, PP, PET, PVC, PS', 'recyklovat mechanicky se dají hlavně ony'] },
              { title: 'Reaktoplasty', icon: 'cross', tone: 'b', points: ['hustá síť pevných kovalentních příčných vazeb', 'po vytvrzení teplem nezměknou, spíš se rozloží', 'bakelit, epoxidové pryskyřice, melaminové desky', 'zásuvky, rukojeti pánví, lepidla'] },
              { title: 'Elastomery', icon: 'balloon', tone: 'c', points: ['stočené řetězce jen **řídce** propojené příčnými vazbami', 'při tahu se natáhnou a pak se vrátí', 'pryž, silikon', 'pneumatiky, gumičky, těsnění'] },
            ], caption: 'Tři skupiny polymerních materiálů' },
            { type: 'p', text: 'K elastomerům vedl jeden šťastný pokus. Přírodní kaučuk je lepkavý a v horku měkne. Charles Goodyear ho v roce 1839 zahřál se **sírou** a vznikly sulfidové můstky mezi řetězci: **vulkanizace**. Z lepivé hmoty se stala pružná a odolná **pryž**, ze které jsou dodnes pneumatiky.' },
            { type: 'p', text: 'Rozdíl mezi všemi třemi skupinami poznáš i doma:' },
            { type: 'iconlist', items: [
              { icon: 'plastic-bottle', title: 'Termoplast', text: 'PET lahev v horké vodě zkroutíš' },
              { icon: 'flame', title: 'Reaktoplast', text: 'rukojeť pánve z bakelitu vydrží teplo plotny' },
              { icon: 'car', title: 'Elastomer', text: 'pneumatika se prohne a vrátí do tvaru' },
            ] },
            { type: 'callout', variant: 'tip', text: 'Plasty se upravují **přísadami**: změkčovadla udělají z tvrdého PVC měkkou hadici, další přísady přidávají barvu nebo zpomalují hoření. Některá změkčovadla (ftaláty) škodí hormonálnímu systému, a proto je EU v hračkách omezila.' },
            { type: 'p', text: 'Typ plastu rozhoduje i o tom, co s ním, až doslouží. Na to se podíváme v posledním oddílu.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď výrobek k typu materiálu.', pairs: [
              ['PET lahev', 'termoplast'],
              ['vypínač z bakelitu', 'reaktoplast'],
              ['pneumatika z vulkanizované pryže', 'elastomer'],
            ], explain: 'PET teplem měkne, bakelit má pevnou síť příčných vazeb a pryž je pružná díky řídkým sulfidovým můstkům.' } },
          ],
        },
        {
          title: 'Recyklace, bioplasty a mikroplasty',
          icon: 'recycle',
          blocks: [
            { type: 'p', text: 'Vraťme se k druhé otázce z úvodu: co s plastem, až doslouží? Celou cestu plastu od ropy až po konec jeho života ukazuje obrázek:' },
            { type: 'diagram', id: 'plastic-lifecycle', caption: 'Život plastu: z ropy přes monomer a polymer k výrobku. Po použití recyklace, spalovna, skládka, nebo rozpad na mikroplasty, které končí v oceánu. Dole recyklační kódy 1–7.' },
            { type: 'p', text: 'Aby šly plasty třídit, nese každý obal číselný kód. Tady je, co jednotlivá čísla znamenají:' },
            { type: 'table', headers: ['Kód', 'Zkratka', 'Plast', 'Typické výrobky'], rows: [
              ['1', 'PET', 'polyethylentereftalát', 'lahve od nápojů'],
              ['2', 'HDPE (PE-HD)', 'polyethylen o vysoké hustotě', 'lahve od drogerie, kanystry'],
              ['3', 'PVC', 'polyvinylchlorid', 'trubky, okna, podlahy'],
              ['4', 'LDPE (PE-LD)', 'polyethylen o nízké hustotě', 'sáčky, fólie'],
              ['5', 'PP', 'polypropylen', 'kelímky od jogurtů, víčka'],
              ['6', 'PS', 'polystyren', 'tácky, pěnový polystyren'],
              ['7', 'O', 'ostatní plasty a směsi', 'např. polykarbonát, PLA'],
            ], caption: 'Recyklační kódy najdeš v trojúhelníku ze šipek na obalu' },
            { type: 'p', text: 'Vytříděný plast může skončit třemi způsoby. Liší se tím, kolik z materiálu zachrání:' },
            { type: 'compare', columns: [
              { title: 'Mechanická recyklace', icon: 'recycle', tone: 'a', points: ['třídění, drcení, mytí a přetavení na granulát', 'jen pro termoplasty', 'řetězce se zkracují a kvalita klesá: z lahve bývá vlákno nebo lavička'] },
              { title: 'Chemická recyklace', icon: 'flask', tone: 'b', points: ['řetězce se rozloží zpět na monomery (hydrolýza PET) nebo na olej (pyrolýza směsných plastů)', 'z monomerů vznikne plast jako nový', 'dražší a energeticky náročnější'] },
              { title: 'Energetické využití', icon: 'flame', tone: 'c', points: ['spálení ve spalovně s čištěním spalin', 'využije se teplo', 'materiál je pryč a vzniká $CO2$'] },
            ], caption: 'Co s plastem, až doslouží' },
            { type: 'p', text: 'Co z toho plyne pro tebe, když vyhazuješ odpad:' },
            { type: 'iconlist', items: [
              { icon: 'recycle', title: 'Žlutý kontejner', text: 'sem patří plasty; lahve sešlápni a vylij z nich zbytky' },
              { icon: 'star', title: 'Nejlépe čisté PET', text: 'vznikají z něj vlákna i nové lahve' },
              { icon: 'leaf', title: 'Nejlepší plastový odpad', text: 'je ten, který vůbec nevznikne' },
            ] },
            { type: 'callout', variant: 'warning', title: 'Nepal plasty', text: 'Při hoření PVC vzniká leptavý chlorovodík a jedovaté dioxiny. Plasty proto nikdy nepal v kamnech ani na zahradě.' },
            { type: 'p', text: 'Část problému mají vyřešit bioplasty. **PLA** (kyselina polymléčná, polylaktid) je **polyester** z kyseliny mléčné, kterou bakterie vyrobí kvašením škrobu z kukuřice nebo cukru z cukrové třtiny. Je **biodegradovatelný**, ale jen v průmyslové kompostárně při teplotě kolem 58 °C a vysoké vlhkosti, ne v lese ani v moři.' },
            { type: 'molecule', molecules: ['lactic-acid'], labels: ['kyselina mléčná: $-OH$ i $-COOH$ v jedné molekule, proto může tvořit polyester sama se sebou'] },
            { type: 'callout', variant: 'tip', title: 'Bio neznamená rozložitelný', text: '„Bioplast“ z obnovitelných surovin nemusí být biodegradovatelný. Třeba polyethylen z ethanolu z cukrové třtiny je chemicky úplně stejný PE jako z ropy a v přírodě vydrží stejně dlouho.' },
            { type: 'p', text: 'Plast, který skončí v přírodě, nezmizí, jen se drobí. **Mikroplasty** jsou kousky plastu menší než 5 mm. Najdeme je v oceánech, v pitné vodě i v lidské krvi a vědci teprve zjišťují, co v těle způsobují. Odkud se berou:' },
            { type: 'iconlist', items: [
              { icon: 'plastic-bottle', title: 'Rozpad odpadu', text: 'UV záření a vlny drobí plasty na stále menší kousky' },
              { icon: 'car', title: 'Oděr pneumatik', text: 'jeden z největších zdrojů ve městech' },
              { icon: 'soap', title: 'Praní syntetického oblečení', text: 'z fleece se uvolňují drobná vlákna' },
            ] },
            { type: 'p', text: 'Teď umíš polymery postavit, roztřídit i rozumně vyhodit. Jak ale chemik zjistí, jaká látka mu v baňce vlastně vznikla? To ukáže příští lekce o spektroskopii a chromatografii.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď recyklační kód k plastu.', pairs: [
              ['1', 'PET'],
              ['3', 'PVC'],
              ['5', 'PP'],
              ['6', 'PS'],
            ], explain: 'Kódy: 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 ostatní.' } },
            { type: 'check', question: { kind: 'tf', q: 'Mikroplasty jsou částice plastu menší než 5 mm.', answer: true, explain: 'Taková je běžná definice. Nejmenší částice, nanoplasty, jsou ještě o několik řádů menší.' } },
          ],
        },
      ],
      summary: [
        'Polymer je makromolekula z opakujících se jednotek, které vznikly z monomerů; jejich počet je polymerační stupeň n.',
        'Při adiční polymeraci se rozpojí dvojné vazby alkenů a nic se neodštěpuje: tak vzniká PE, PP, PVC, PTFE a PS.',
        'Opakující se jednotku nakreslíš z monomeru: dvojnou vazbu změň na jednoduchou, vyveď vazby z obou uhlíků a boční skupiny nech viset mimo řetězec.',
        'Kondenzační polymerace spojuje monomery se dvěma funkčními skupinami a odštěpuje malou molekulu: polyestery (PET) a polyamidy (nylon 6,6, Kevlar).',
        'Přírodními polymery jsou škrob, celulóza, bílkoviny, nukleové kyseliny i kaučuk.',
        'Termoplasty teplem měknou, reaktoplasty drží pevná síť příčných vazeb a elastomery jsou pružné díky řídkým příčným vazbám.',
        'Plasty se recyklují mechanicky nebo chemicky; PLA je kompostovatelný jen průmyslově a mikroplasty menší než 5 mm jsou vážný problém.',
      ],
      quiz: [
        { kind: 'tf', q: 'Polymer vzniklý adiční polymerací má stejné procentové složení jako jeho monomer.', answer: true, explain: 'Při adiční polymeraci se nic neodštěpuje, takže poměr atomů v polymeru je stejný jako v monomeru.' },
        { kind: 'choice', q: 'Jak vypadá opakující se jednotka polypropylenu?', options: ['$-CH2-CH(CH3)-$', '$-CH2-CH2-CH2-$', '$-CH(CH3)=CH-$', '$-CH2-CH2-$'], answer: 0, explain: 'Hlavní řetězec tvoří dva uhlíky bývalé dvojné vazby propenu a methyl visí do strany. Dvojná vazba v polymeru nezůstane.' },
        { kind: 'match', q: 'Přiřaď polymer k monomeru.', pairs: [
          ['PVC', 'chlorethen'],
          ['PTFE (teflon)', 'tetrafluorethen'],
          ['polystyren', 'styren'],
          ['PET', 'ethan-1,2-diol a kyselina tereftalová'],
        ], explain: 'První tři jsou adiční polymery z jednoho alkenu, PET je polyester ze dvou různých monomerů.' },
        { kind: 'multi', q: 'Které polymery vznikají kondenzační polymerací?', options: ['nylon 6,6', 'PET', 'Kevlar', 'PVC', 'polystyren'], answers: [0, 1, 2], explain: 'Nylon a Kevlar (polyamidy) i PET (polyester) vznikají za odštěpení malé molekuly. PVC a polystyren vznikají adiční polymerací alkenů.' },
        { kind: 'number', q: 'Řetězec polystyrenu má molární hmotnost 520 000 g/mol. Kolik opakujících se jednotek obsahuje? (styren $C8H8$, $M$ = 104 g/mol)', answer: 5000, explain: 'n = 520 000 : 104 = 5 000. Adiční polymer má jednotku stejně těžkou jako monomer.' },
        { kind: 'text', q: 'Jak se nazývají plasty, které po vytvrzení teplem nezměknou, protože jejich řetězce spojuje hustá síť příčných vazeb?', accept: ['reaktoplasty', 'reaktoplast', 'termosety', 'termoset'], explain: 'Reaktoplasty (např. bakelit) se po vytvrzení teplem spíš rozloží, než aby změkly. Proto se nedají mechanicky recyklovat.' },
        { kind: 'tf', q: 'PLA se v moři nebo v lese rozloží během několika týdnů.', answer: false, explain: 'PLA je kompostovatelný jen v průmyslové kompostárně kolem 58 °C. V moři nebo v lese vydrží léta.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-8
    'l8-8': {
      id: 'l8-8',
      title: 'Jak určit strukturu: spektroskopie a chromatografie',
      goals: [
        'Vysvětlit, jak chromatografie (TLC, GC) dělí směsi, a spočítat retardační faktor R_{f}',
        'Z hmotnostního spektra určit molární hmotnost a podle izotopových píků poznat chlor nebo brom',
        'V IR spektru najít hlavní funkční skupiny a z ^{1}H a ^{13}C NMR vyčíst prostředí vodíků a uhlíků (δ, integrace, štěpení n + 1)',
        'Spojit data z více metod, určit strukturu neznámé látky a vysvětlit princip MRI',
      ],
      hook: 'Detektiv má otisky prstů, DNA a kamerové záznamy. Chemik má chromatograf, hmotnostní spektrometr, IR a NMR. Za pár minut z nich pozná, jakou molekulu drží v ruce, i když jí má jen miligram. Pojď se naučit číst jejich výpovědi.',
      sections: [
        {
          title: 'Chromatografie: nejdřív směs rozdělit',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'Zkumavkové zkoušky (bromová voda, Tollensovo činidlo, důkazy iontů z úrovně 7) řeknou, jaká skupina v látce je. Farmaceutická firma ale musí u každé šarže léku znát přesnou strukturu a čistotu, z miligramů a rychle. Proto chemici používají přístroje: směs nejdřív **rozdělí chromatografií** a pak jednotlivé látky **identifikují spektroskopií**.' },
            { type: 'p', text: 'Princip chromatografie už znáš z papírku s barvivy. Všimni si, proč každé barvivo doběhne jinam:' },
            { type: 'diagram', id: 'separation', props: { method: 'chromatography' }, caption: 'Papírová chromatografie z úrovně 1: rozpouštědlo vzlíná papírem a nese s sebou barviva. Každé putuje jinak rychle, protože se jinak silně drží papíru.' },
            { type: 'p', text: 'Všechny druhy chromatografie, od papírku po drahý přístroj, popíšeš stejnými pojmy:' },
            { type: 'keyterms', items: [
              { term: 'Stacionární fáze', def: 'to, co stojí: papír, vrstva silikagelu na destičce nebo tenká vrstva uvnitř kolony' },
              { term: 'Mobilní fáze', def: 'to, co se pohybuje a nese látky: rozpouštědlo, u plynové chromatografie inertní plyn' },
              { term: 'Retenční faktor $R_{f}$', def: 'jak daleko látka urazila v poměru k čelu rozpouštědla; číslo mezi 0 a 1' },
            ] },
            { type: 'p', text: 'Při **tenkovrstvé chromatografii (TLC)** naneseš vzorek na startovní čáru destičky se silikagelem a postavíš ji do rozpouštědla. Látky, které se k silikagelu vážou silněji (bývají polárnější), putují pomaleji. Bezbarvé skvrny zviditelní UV lampa nebo páry jodu.' },
            { type: 'p', text: 'Jak daleko látka doputuje, závisí i na tom, jak dlouho destička stála v rozpouštědle. Proto se dráha skvrny vztahuje k dráze čela rozpouštědla:' },
            { type: 'formula', text: '$R_{f}$ = vzdálenost skvrny od startu / vzdálenost čela rozpouštědla od startu', caption: 'Hodnota $R_{f}$ platí jen pro dané rozpouštědlo a destičku, proto se neznámá látka porovnává se standardem na téže destičce.' },
            { type: 'p', text: 'Hodnotu $R_{f}$ využiješ hlavně k porovnání se standardy. Zkus zjistit, co obsahuje tableta:' },
            { type: 'example', title: 'Který lék je v tabletě?', problem: 'Skvrna z rozdrcené tablety urazila 3,2 cm, čelo rozpouštědla 8,0 cm. Standard aspirinu má na téže destičce $R_{f}$ = 0,40, paracetamolu 0,25. Co tableta obsahuje?', steps: [
              '$R_{f}$ = 3,2 cm : 8,0 cm = 0,40 (jednotky se vykrátí).',
              'Hodnota se shoduje se standardem aspirinu, s paracetamolem ne.',
              'Jediná skvrna navíc říká, že v tabletě není jiná látka viditelná touto metodou.',
            ], answer: '$R_{f}$ = **0,40**, tableta obsahuje aspirin (kyselinu acetylsalicylovou)' },
            { type: 'p', text: 'TLC je rychlá a levná, na stopová množství ale nestačí. Při **plynové chromatografii (GC)** se vzorek odpaří a inertní plyn (helium nebo dusík) ho žene tenkou kolonou dlouhou desítky metrů. Každá látka vyjde ven v jiném **retenčním čase** a plocha jejího píku odpovídá množství. Spojení s hmotnostním spektrometrem, **GC-MS**, každou oddělenou látku rovnou identifikuje. Proto se používá všude, kde se hledají stopy látek:' },
            { type: 'iconlist', items: [
              { icon: 'syringe', title: 'Antidopingové zkoušky', text: 'stopy zakázaných látek v moči sportovců' },
              { icon: 'magnifier', title: 'Forenzní laboratoře', text: 'drogy, jedy, zbytky hořlavin po požáru' },
              { icon: 'apple', title: 'Kontrola potravin', text: 'rezidua pesticidů v ovoci a zelenině' },
              { icon: 'glass', title: 'Pančovaný alkohol', text: 'methanol v lihovinách odhalí GC během minut' },
            ] },
            { type: 'p', text: 'Chromatografie směs rozdělí a látky porovná se standardy. Co je každá z nich zač, prozradí až další přístroje. První z nich zjistí, kolik molekula váží.' },
            { type: 'check', question: { kind: 'number', q: 'Skvrna na TLC destičce urazila 2,1 cm a čelo rozpouštědla 7,0 cm. Jaké je $R_{f}$?', answer: 0.3, tolerance: 0.01, explain: '$R_{f}$ = 2,1 : 7,0 = 0,30. Retenční faktor nemá jednotku a je vždy menší než 1.' } },
          ],
        },
        {
          title: 'Hmotnostní spektrometrie: kolik molekula váží',
          icon: 'atom',
          blocks: [
            { type: 'p', text: '**Hmotnostní spektrometr** molekuly nejdřív ionizuje a pak je třídí podle poměru hmotnosti a náboje **m/z**. Většina iontů má náboj +1, takže m/z je prostě jejich relativní hmotnost.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'electron', title: 'Ionizace', text: 'proud elektronů vyrazí z molekuly jeden elektron a vznikne **molekulový ion** $M^+$' },
              { icon: 'explosion', title: 'Fragmentace', text: 'část iontů $M^+$ se rozpadne na menší kladné **fragmenty**' },
              { icon: 'magnet', title: 'Třídění', text: 'elektrické nebo magnetické pole rozdělí ionty podle m/z' },
              { icon: 'chart', title: 'Detektor', text: 'spektrum: m/z na ose x, relativní množství iontů na ose y' },
            ], caption: 'Jak pracuje hmotnostní spektrometr' },
            { type: 'p', text: 'Výsledkem je spektrum: řada píků, každý pro jeden druh iontů. Takhle vypadá u ethanolu:' },
            { type: 'diagram', id: 'mass-spectrum', caption: 'Hmotnostní spektrum ethanolu: molekulový pík $M^+$ při m/z 46 udává molární hmotnost, nejvyšší (základní) pík při m/z 31 patří fragmentu $CH2OH^+$. Vložený graf: chlorovaná látka má dva molekulové píky M a M + 2 v poměru 3 : 1.' },
            { type: 'p', text: 'Z rozdílu mezi molekulovým iontem a fragmentem vyčteš, co se od molekuly odštěpilo:' },
            { type: 'table', headers: ['m/z', 'Ion', 'Co se odštěpilo'], rows: [
              ['46', '$CH3CH2OH^+$ (molekulový ion)', 'nic'],
              ['45', '$CH3CHOH^+$', '$H$ (M − 1)'],
              ['31', '$CH2OH^+$ (základní pík, 100 %)', '$CH3$ (M − 15)'],
              ['29', '$CH3CH2^+$', '$OH$ (M − 17)'],
              ['15', '$CH3^+$', '$CH2OH$'],
            ], caption: 'Fragmenty ethanolu. Typické ztráty: 15 = methyl, 17 = hydroxyl, 29 = ethyl nebo $CHO$, 45 = $COOH$.' },
            { type: 'p', text: 'Některé atomy se ve spektru prozradí samy. Chlor a brom mají dva hojné izotopy, a proto dávají dvojice píků vzdálené o 2. Chlor: $^{35}Cl$ 75 % a $^{37}Cl$ 25 %, tedy píky M a M + 2 v poměru **3 : 1**. Brom: $^{79}Br$ a $^{81}Br$ skoro půl na půl, tedy píky M a M + 2 **stejně vysoké**.' },
            { type: 'p', text: 'Dvojice píků je tak nápadná, že halogen v látce poznáš na první pohled. Zkus to:' },
            { type: 'example', title: 'Kdo je v láhvi?', problem: 'Spektrum neznámého halogenalkanu má molekulové píky při m/z 122 a 124, stejně vysoké. Co to je za látku?', steps: [
              'Dva stejně vysoké píky vzdálené o 2 prozradí jeden atom **bromu**.',
              'Lehčí pík obsahuje $^{79}Br$: zbytek molekuly má 122 − 79 = 43.',
              '43 odpovídá skupině $C3H7$: 3 · 12 + 7 · 1 = 43.',
            ], answer: 'Látka je **brompropan** $C3H7Br$ (1- nebo 2-brompropan; rozhodne až NMR)' },
            { type: 'callout', variant: 'fact', text: 'Přístroje s vysokým rozlišením měří hmotnost na čtyři desetinná místa. Rozliší tak $CO$ (27,995), $N2$ (28,006) a $C2H4$ (28,031), které mají všechny „hmotnost 28“, a určí přímo souhrnný vzorec.' },
            { type: 'p', text: 'Hmotnostní spektrum prozradí, kolik molekula váží a jestli obsahuje halogen. Které funkční skupiny v ní jsou, ukáže IR spektroskopie.' },
            { type: 'check', question: { kind: 'choice', q: 'Spektrum má molekulové píky při m/z 78 a 80 v poměru 3 : 1. Který prvek látka obsahuje?', options: ['chlor', 'brom', 'dusík', 'síru'], answer: 0, explain: 'Poměr 3 : 1 odpovídá izotopům $^{35}Cl$ a $^{37}Cl$. Látka je chlorpropan $C3H7Cl$ (36 + 7 + 35 = 78).' } },
          ],
        },
        {
          title: 'IR spektroskopie: vazby, které vibrují',
          icon: 'heat',
          blocks: [
            { type: 'p', text: 'Kovalentní vazby nejsou tuhé tyčky, ale pružinky: natahují se a ohýbají. Každý typ vazby kmitá svou frekvencí a pohlcuje **infračervené záření** právě té frekvence. V IR spektru se poloha pásu udává **vlnočtem** v cm^{−1} (od 4 000 do 400) a pohlcené záření se ukáže jako „údolí“ dolů.' },
            { type: 'diagram', id: 'ir-spectrum', caption: 'IR spektrum kyseliny ethanové: velmi široký pás $O-H$ (2 500–3 300 cm^{−1}), ostrý silný pás $C=O$ kolem 1 710 cm^{−1} a pod 1 500 cm^{−1} složitá oblast otisku prstu.' },
            { type: 'p', text: 'Každý pás patří jiné vazbě. K rozpoznání hlavních funkčních skupin ti stačí těchto sedm:' },
            { type: 'table', headers: ['Vazba', 'Vlnočet (cm^{−1})', 'Vzhled pásu', 'Kde ji najdeš'], rows: [
              ['$O-H$ (alkohol)', '3 200–3 550', 'silný, **široký** (vodíkové můstky)', 'alkoholy, fenoly'],
              ['$O-H$ (kyselina)', '2 500–3 300', 'velmi široký, přes pásy $C-H$', 'karboxylové kyseliny'],
              ['$N-H$', '3 300–3 500', 'střední, užší', 'aminy, amidy'],
              ['$C-H$', '2 850–3 100', 'střední až silný', 'skoro každá organická látka'],
              ['$C=O$', '1 680–1 750', 'silný, **ostrý**', 'aldehydy, ketony, kyseliny, estery, amidy'],
              ['$C=C$', '1 620–1 680', 'slabší', 'alkeny'],
              ['$C-O$', '1 000–1 300', 'silný', 'alkoholy, ethery, estery'],
            ], caption: 'Tahák IR pásů' },
            { type: 'p', text: 'Oblast pod 1 500 cm^{−1} je **oblast otisku prstu** (*fingerprint*). Je v ní spousta pásů, které patří celé molekule, a každá látka ji má jedinečnou. Porovnáním s databází se látka identifikuje, stejně jako člověk podle otisku.' },
            { type: 'p', text: 'Na rychlé rozhodnutí ti ale stačí tahák a oblast nad 1 500 cm^{−1}. Porovnej tři látky se stejným počtem uhlíků:' },
            { type: 'compare', columns: [
              { title: 'Propan-1-ol', tone: 'a', points: ['široký pás $O-H$ 3 200–3 550', 'žádný pás $C=O$'] },
              { title: 'Propanal', tone: 'b', points: ['žádný pás $O-H$', 'silný pás $C=O$ kolem 1 730'] },
              { title: 'Kyselina propanová', tone: 'c', points: ['velmi široký pás $O-H$ 2 500–3 300', 'silný pás $C=O$ kolem 1 710'] },
            ], caption: 'Tři látky se třemi uhlíky podle IR rozlišíš na první pohled' },
            { type: 'p', text: 'IR spektroskopie nepracuje jen v laboratoři:' },
            { type: 'iconlist', items: [
              { icon: 'car', title: 'Dechová zkouška', text: 'přesné policejní přístroje měří, kolik IR záření pohltí vazby $C-H$ ethanolu v dechu' },
              { icon: 'earth', title: 'Skleníkový efekt', text: '$CO2$, $CH4$ a $H2O$ pohlcují IR záření Země (úroveň 9)' },
              { icon: 'magnifier', title: 'Kriminalistika', text: 'IR mikroskop určí vlákno nebo úlomek laku z místa nehody' },
            ] },
            { type: 'p', text: 'IR řekne, které skupiny v molekule jsou. Jak jsou ale atomy pospojované, odhalí až NMR.' },
            { type: 'check', question: { kind: 'choice', q: 'IR spektrum má velmi široký pás 2 500–3 300 cm^{−1} a silný ostrý pás 1 710 cm^{−1}. O jakou třídu látek jde?', options: ['karboxylová kyselina', 'alkohol', 'keton', 'alkan'], answer: 0, explain: 'Velmi široký $O-H$ spolu s $C=O$ je typický podpis karboxylu $-COOH$. Alkohol nemá $C=O$, keton nemá $O-H$.' } },
          ],
        },
        {
          title: 'NMR: co prozradí vodíky a uhlíky',
          icon: 'magnet',
          blocks: [
            { type: 'p', text: 'Zatím víme, kolik molekula váží a jaké má skupiny. NMR přidá to hlavní: jak vypadá její kostra. Jádra $^{1}H$ a $^{13}C$ se chovají jako maličké magnety. V silném magnetickém poli pohlcují **rádiové vlny** a přesná frekvence závisí na tom, jaké elektrony a sousední atomy jádro obklopují, tedy na jeho **chemickém prostředí**. Tomu se říká **nukleární magnetická rezonance** (NMR).' },
            { type: 'p', text: 'Z jednoho ^{1}H NMR spektra tak vyčteš čtyři informace:' },
            { type: 'iconlist', items: [
              { icon: 'magnifier', title: 'Počet signálů', text: 'kolik je v molekule různých prostředí vodíků' },
              { icon: 'chart', title: 'Chemický posun δ', text: 'jaké je prostředí: vedle kyslíku, karbonylu, benzenového jádra…' },
              { icon: 'calculator', title: 'Integrace', text: 'plocha signálu: poměr počtů vodíků' },
              { icon: 'bond', title: 'Štěpení', text: 'kolik vodíků je na sousedních uhlících' },
            ] },
            { type: 'p', text: 'Chemický posun **δ** se udává v ppm vůči standardu **TMS** (tetramethylsilan, δ = 0). Čím víc elektronegativních atomů je poblíž, tím dál vlevo (výš) signál leží. Vzorek se rozpouští v deuterovaném rozpouštědle, např. $CDCl3$, aby jeho vodíky nepřekryly signály látky.' },
            { type: 'table', headers: ['Vodík v okolí', 'δ (ppm)'], rows: [
              ['$R-CH3$, $R-CH2-R$', '0,9–1,7'],
              ['$CH3-C=O$ (vedle karbonylu)', '2,0–2,6'],
              ['$CH-O$ (alkohol, ether, ester), $CH-Cl$', '3,3–4,3'],
              ['$C=C-H$ (alken)', '4,5–6,5'],
              ['vodíky na benzenovém jádře', '6,5–8,0'],
              ['$-CHO$ (aldehyd)', '9–10'],
              ['$-COOH$', '10–12'],
              ['$R-OH$', '1–5, proměnlivý'],
            ], caption: 'Orientační chemické posuny v ^{1}H NMR' },
            { type: 'p', text: 'Teď všechno spojíme na skutečném spektru ethanolu. Všimni si všech čtyř informací najednou:' },
            { type: 'diagram', id: 'nmr-spectrum', caption: '^{1}H NMR spektrum ethanolu: triplet $CH3$ při 1,2 ppm (3 H), singlet $OH$ (1 H) a kvartet $CH2$ při 3,7 ppm (2 H), posunutý doleva sousedním kyslíkem. Plochy signálů (integrace) jsou v poměru 3 : 1 : 2.' },
            { type: 'callout', variant: 'remember', title: 'Pravidlo n + 1', text: '==Signál vodíků, které mají na sousedních uhlících n vodíků, se rozštěpí na n + 1 čar.== 0 sousedů: singlet, 1: dublet, 2: triplet, 3: kvartet. Stejné (ekvivalentní) vodíky se navzájem neštěpí a vodík skupiny $-OH$ obvykle dává singlet.' },
            { type: 'p', text: 'Celé spektrum teď přečti krok za krokem, podle čtyř otázek ze začátku oddílu:' },
            { type: 'example', title: 'Čteme spektrum ethanolu', problem: 'Vysvětli ^{1}H NMR spektrum ethanolu $CH3-CH2-OH$ na obrázku.', steps: [
              'Tři různá prostředí ($CH3$, $CH2$, $OH$), tedy **tři signály**. Integrace 3 : 2 : 1.',
              '$CH3$ má za sousedy 2 vodíky skupiny $CH2$: 2 + 1 = 3 čáry, **triplet**, δ 1,2 (daleko od kyslíku).',
              '$CH2$ má za sousedy 3 vodíky skupiny $CH3$: 3 + 1 = 4 čáry, **kvartet**, δ 3,7 (vedle kyslíku).',
              '$OH$ se rychle vyměňuje mezi molekulami, a proto je to **singlet**.',
            ], answer: 'Dvojice triplet (3 H) + kvartet (2 H) je typický podpis **ethylové skupiny** $CH3-CH2-$.' },
            { type: 'p', text: 'Vodíky ale nejsou všechno. **^{13}C NMR** ukazuje, kolik je v molekule **různých prostředí uhlíků**; každé dá jednu čáru v rozsahu δ 0–220 ppm a uhlík skupiny $C=O$ leží úplně vlevo, 160–220 ppm. Propan-1-ol má tři signály, symetrický propan-2-ol jen dva, protože oba jeho methyly jsou stejné.' },
            { type: 'p', text: 'Každá metoda ti teď dá jeden kousek skládačky. Zbývá je složit do jednoho obrázku.' },
            { type: 'check', question: { kind: 'choice', q: 'Jak bude v ^{1}H NMR rozštěpený signál skupiny $CH3$ v chlorethanu $CH3-CH2Cl$?', options: ['triplet', 'kvartet', 'singlet', 'dublet'], answer: 0, explain: 'Na sousedním uhlíku jsou 2 vodíky skupiny $CH2$, takže signál $CH3$ má 2 + 1 = 3 čáry.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik signálů má ^{1}H NMR spektrum propanonu (acetonu) $CH3COCH3$?', answer: 1, explain: 'Oba methyly jsou díky symetrii úplně stejné, všech 6 vodíků má jedno prostředí: jediný singlet.' } },
          ],
        },
        {
          title: 'Skládáme důkazy: neznámá látka a MRI',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Žádná metoda sama nestačí. Hmotnostní spektrum dá molární hmotnost, IR funkční skupiny, NMR uhlíkovou kostru. Teprve dohromady tvoří nezvratný důkaz, přesně jako u detektiva.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'atom', title: 'MS', text: 'molární hmotnost, $Cl$ nebo $Br$, možný vzorec' },
              { icon: 'heat', title: 'IR', text: 'které funkční skupiny jsou a které ne' },
              { icon: 'magnet', title: '^{13}C NMR', text: 'kolik různých uhlíků' },
              { icon: 'magnifier', title: '^{1}H NMR', text: 'prostředí vodíků, jejich počty a sousedé' },
              { icon: 'check', title: 'Kontrola', text: 'sedí všechno? porovnej s databází' },
            ], caption: 'Postup určení struktury' },
            { type: 'p', text: 'Vyzkoušej postup na skutečném případu: na kapalině s ovocnou vůní.' },
            { type: 'example', title: 'Určení neznámé látky', problem: 'Bezbarvá kapalina s ovocnou vůní: MS: $M^+$ při m/z 88, bez píku M + 2. IR: silný pás 1 740 cm^{−1} a 1 240 cm^{−1}, žádný široký pás $O-H$. ^{13}C NMR: 4 signály (jeden při 171 ppm). ^{1}H NMR: δ 4,1 (2 H, kvartet), 2,0 (3 H, singlet), 1,3 (3 H, triplet). Co je to za látku?', steps: [
              'IR: $C=O$ a $C-O$, ale žádné $O-H$, takže nejde o kyselinu ani alkohol. Nejspíš **ester**.',
              'MS: M = 88 a žádný halogen. Ester $C4H8O2$ má 4 · 12 + 8 · 1 + 2 · 16 = 88. Sedí.',
              '^{13}C NMR: 4 různé uhlíky, signál 171 ppm je karbonyl esteru.',
              '^{1}H NMR: 2 + 3 + 3 = 8 vodíků, souhlasí se vzorcem. Quartet (2 H) + triplet (3 H) je ethyl $CH2-CH3$; jeho $CH2$ při 4,1 ppm sedí přímo na kyslíku.',
              'Singlet (3 H) při 2,0 ppm je $CH3$ bez sousedních vodíků, vedle $C=O$.',
              'Poskládej: $CH3-CO-O-CH2-CH3$.',
            ], answer: 'Neznámá látka je **ethyl-ethanoát** (ethylacetát), rozpouštědlo z odlakovače' },
            { type: 'p', text: 'Takhle vypadá molekula, ke které nás důkazy dovedly:' },
            { type: 'molecule', molecules: ['ethyl-acetate'], labels: ['ethyl-ethanoát $CH3COOCH2CH3$'] },
            { type: 'callout', variant: 'tip', title: 'Pozor na izomer', text: 'Methyl-propanoát $CH3CH2COOCH3$ má stejný vzorec i podobné IR. Jeho singlet $CH3$ by ale ležel kolem 3,7 ppm (na kyslíku) a kvartet $CH2$ kolem 2,3 ppm (vedle $C=O$). Rozhoduje chemický posun.' },
            { type: 'p', text: 'NMR ale nepomáhá jen chemikům. **Magnetická rezonance (MR, anglicky MRI)** v nemocnici je ^{1}H NMR tvého těla. Signál dávají hlavně vodíky vody a tuků, a protože různé tkáně obsahují různě vody a tuku, počítač z něj složí detailní řezy mozkem, klouby nebo srdcem.' },
            { type: 'iconlist', items: [
              { icon: 'magnet', title: 'Silný magnet', text: '1,5–3 tesla, desítky tisíckrát silnější než magnetické pole Země' },
              { icon: 'drop', title: 'Vodíky vody a tuku', text: 'měkké tkáně jsou na snímku krásně vidět' },
              { icon: 'heart', title: 'Mozek, klouby, srdce', text: 'nádory, poranění vazů, roztroušená skleróza' },
              { icon: 'check', title: 'Bez ionizujícího záření', text: 'na rozdíl od rentgenu a CT' },
            ] },
            { type: 'callout', variant: 'warning', text: 'Do místnosti s magnetem nesmí nic železného: kovové předměty se mění v projektily. Pacienti s kardiostimulátorem nebo kovovými implantáty musí na vyšetření upozornit.' },
            { type: 'callout', variant: 'fact', text: 'Za MRI dostali Paul Lauterbur a Peter Mansfield v roce 2003 Nobelovu cenu. Slovo „nukleární“ z názvu nemocnice vypustily, aby se pacienti nebáli. S radioaktivitou ale metoda nemá nic společného.' },
            { type: 'p', text: 'Teď umíš látku rozdělit, zvážit a přečíst její strukturu. V příští úrovni tyhle znalosti využijeme u molekul života a začneme sacharidy.' },
            { type: 'check', question: { kind: 'tf', q: 'MRI využívá ionizující rentgenové záření, stejně jako CT.', answer: false, explain: 'MRI pracuje se silným magnetem a rádiovými vlnami, které zachytí signál vodíkových jader. Ionizující záření nepoužívá.' } },
          ],
        },
      ],
      summary: [
        'Chromatografie dělí směs mezi stacionární a mobilní fázi; v TLC látku charakterizuje $R_{f}$, v GC retenční čas a GC-MS složky rovnou identifikuje.',
        'Hmotnostní spektrum dává molekulový ion $M^+$ (molární hmotnost) a fragmenty; chlor prozradí píky M a M + 2 v poměru 3 : 1, brom 1 : 1.',
        'IR spektrum ukazuje vazby: široký $O-H$ 3 200–3 550 cm^{−1}, ostrý $C=O$ kolem 1 700 cm^{−1}, $N-H$ a $C-H$; oblast pod 1 500 cm^{−1} je otisk prstu molekuly.',
        'V ^{1}H NMR udává počet signálů počet prostředí, posun δ jejich druh, integrace poměr vodíků a n sousedních vodíků rozštěpí signál na n + 1 čar.',
        '^{13}C NMR ukazuje, kolik je v molekule různých prostředí uhlíků.',
        'Strukturu určíš spojením důkazů: MS dá vzorec, IR skupiny a NMR kostru.',
        'MRI v medicíně je ^{1}H NMR vodíků vody a tuků v těle, bez ionizujícího záření.',
      ],
      quiz: [
        { kind: 'match', q: 'Přiřaď metodu k tomu, co hlavně zjistí.', pairs: [
          ['hmotnostní spektrometrie', 'molární hmotnost a fragmenty'],
          ['IR spektroskopie', 'funkční skupiny (typy vazeb)'],
          ['^{1}H NMR', 'prostředí vodíků a jejich sousedy'],
          ['tenkovrstvá chromatografie', 'počet složek směsi a jejich $R_{f}$'],
        ], explain: 'MS váží molekuly, IR vidí kmitající vazby, NMR prostředí jader a chromatografie směs rozdělí.' },
        { kind: 'number', q: 'Látka má na TLC destičce $R_{f}$ = 0,35 a čelo rozpouštědla urazilo 8,0 cm. Jak daleko od startu je její skvrna?', answer: 2.8, tolerance: 0.05, unit: 'cm', explain: 'Vzdálenost skvrny = $R_{f}$ · vzdálenost čela = 0,35 · 8,0 cm = 2,8 cm.' },
        { kind: 'tf', q: 'Látka s jedním atomem bromu má v hmotnostním spektru dva molekulové píky M a M + 2 přibližně stejně vysoké.', answer: true, explain: 'Izotopy $^{79}Br$ a $^{81}Br$ jsou v přírodě zastoupené skoro stejně, proto jsou oba píky zhruba stejně vysoké.' },
        { kind: 'choice', q: 'Který pás najdeš v IR spektru propan-1-olu, ale ne v IR spektru propanalu?', options: ['široký pás $O-H$ kolem 3 200–3 550 cm^{−1}', 'silný pás $C=O$ kolem 1 730 cm^{−1}', 'pás $C-H$ kolem 2 900 cm^{−1}', 'pás $C=C$ kolem 1 650 cm^{−1}'], answer: 0, explain: 'Jen alkohol má skupinu $-OH$. Pás $C=O$ má naopak jen propanal, $C-H$ mají oba a $C=C$ ani jeden.' },
        { kind: 'multi', q: 'Co platí o ^{1}H NMR spektru ethanolu $CH3CH2OH$?', options: ['má tři signály', 'signál $CH3$ je triplet', 'signál $CH2$ je kvartet', 'integrace signálů je 1 : 1 : 1', 'signál $CH2$ leží při nižším δ než signál $CH3$'], answers: [0, 1, 2], explain: 'Tři prostředí s integrací 3 : 2 : 1. $CH3$ má dva sousední vodíky (triplet), $CH2$ tři (kvartet) a leží při vyšším δ, protože sousedí s kyslíkem.' },
        { kind: 'number', q: 'Kolik signálů má ^{13}C NMR spektrum propan-2-olu $CH3-CH(OH)-CH3$?', answer: 2, explain: 'Oba methyly jsou symetrické a stejné, třetí uhlík nese $-OH$. Dvě prostředí, dva signály.' },
        { kind: 'choice', q: 'Látka $C3H6O$ má v IR silný pás 1 715 cm^{−1}, žádný pás $O-H$ a v ^{1}H NMR jediný signál (singlet, 6 H). Co to je?', options: ['propanon', 'propanal', 'prop-2-en-1-ol', 'cyklopropanol'], answer: 0, explain: 'Pás $C=O$ bez $O-H$ ukazuje keton nebo aldehyd. Jediný singlet znamená, že všech 6 vodíků je stejných: dva stejné methyly kolem $C=O$, tedy propanon (aceton). Propanal by měl tři signály včetně aldehydového kolem 9,8 ppm.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── boss
  boss: [
    { kind: 'text', q: 'Pojmenuj alkan $CH3-CH2-CH(CH3)-CH2-CH(CH2CH3)-CH3$. Pozor na hlavní řetězec!', accept: ['3,5-dimethylheptan', '3,5 dimethylheptan', '3, 5-dimethylheptan'], explain: 'Nejdelší řetězec vede přes ethylovou skupinu a má 7 uhlíků. Methyly pak leží na C3 a C5 při číslování z kterékoli strany: 3,5-dimethylheptan.' },
    { kind: 'multi', q: 'Která tvrzení o reakci propenu s $HBr$ jsou pravdivá?', options: [
      'Jde o elektrofilní adici',
      'Meziproduktem je karbokation',
      'Hlavním produktem je 1-brompropan',
      'Vodík se naváže na krajní uhlík $CH2$',
      'Jde o radikálovou substituci',
    ], answers: [0, 1, 3], explain: 'Proton se naváže na $CH2$, vznikne stabilnější sekundární karbokation a hlavním produktem je 2-brompropan.' },
    { kind: 'order', q: 'Seřaď látky podle teploty varu od nejnižší po nejvyšší.', items: ['propan', 'dimethylether', 'ethanal', 'ethanol', 'kyselina octová'], explain: 'Nepolární propan (−42 °C) < ether bez můstků (−24 °C) < polární ethanal (20 °C) < ethanol s můstky (78 °C) < kyselina octová, jejíž molekuly se spojují vodíkovými můstky do dvojic (118 °C).' },
    { kind: 'choice', q: 'Co vznikne oxidací propan-1-olu dichromanem draselným při dostatku oxidovadla?', options: ['kyselina propanová', 'propanon', 'propanal', 'propen'], answer: 0, explain: 'Primární alkohol se oxiduje nejdřív na aldehyd (propanal) a ten dál na kyselinu. Propanon by vznikl z propan-2-olu.' },
    { kind: 'text', q: 'Který ester vznikne z kyseliny propanové a methanolu? Napiš jeho název.', accept: ['methyl-propanoát', 'methylpropanoát', 'methyl propanoát', 'methyl-propionát', 'methylpropionát'], explain: 'Alkyl z alkoholu (methyl) + anion kyseliny (propanoát): methyl-propanoát $CH3CH2COOCH3$.' },
    { kind: 'tf', q: 'Benzen ochotně aduje brom, a proto odbarvuje bromovou vodu stejně jako cyklohexen.', answer: false, explain: 'Adice by zničila stabilní aromatický systém. Benzen s bromem reaguje jen za katalýzy $FeBr3$, a to substitucí.' },
    { kind: 'match', q: 'Přiřaď zkoušku k pozorování.', pairs: [
      ['bromová voda + alken', 'odbarvení'],
      ['Tollensovo činidlo + aldehyd', 'stříbrné zrcátko'],
      ['Fehlingovo činidlo + aldehyd', 'cihlově červená sraženina'],
      ['jedlá soda + karboxylová kyselina', 'šumění ($CO2$)'],
    ], explain: 'Adice bromu, redukce $Ag^+$ na kovové stříbro, redukce $Cu^2+$ na $Cu2O$ a vytěsnění slabší kyseliny uhličité.' },
    { kind: 'multi', q: 'Které dvojice látek jsou izomery?', options: [
      'butan-1-ol a diethylether',
      'propanal a propanon',
      'ethanol a ethanal',
      'cyklohexan a hex-1-en',
      'butan a buta-1,3-dien',
    ], answers: [0, 1, 3], explain: 'Stejný vzorec mají $C4H10O$, $C3H6O$ a $C6H12$. Ethanal ($C2H4O$) má o dva vodíky méně než ethanol a butadien ($C4H6$) o čtyři méně než butan.' },
    { kind: 'choice', q: 'Která látka obsahuje chirální uhlík a existuje ve dvou enantiomerech?', options: ['2-brombutan', '2-brompropan', '1-brombutan', '2-methylpropan-2-ol'], answer: 0, explain: 'V 2-brombutanu nese uhlík C2 čtyři různé skupiny: $H$, $Br$, $CH3$ a $CH2CH3$. Ostatní látky mají na každém uhlíku aspoň dvě stejné skupiny.' },
    { kind: 'choice', q: 'Jak z brommethanu $CH3Br$ získáš kyselinu ethanovou $CH3COOH$, která má o jeden uhlík víc?', options: ['reakcí s $KCN$ a hydrolýzou vzniklého nitrilu $CH3CN$', 'reakcí s vodným $NaOH$ a oxidací vzniklého methanolu', 'eliminací v horkém ethanolovém $KOH$', 'reakcí s amoniakem a oxidací vzniklého aminu'], answer: 0, explain: 'Nový uhlík přinese jen kyanid: nukleofilní substitucí vznikne ethannitril $CH3CN$ a jeho hydrolýzou kyselina ethanová. Oxidace methanolu by dala jen kyselinu methanovou.' },
    { kind: 'number', q: 'Z 50 molekul hexan-1,6-diaminu a 50 molekul kyseliny adipové vznikne jeden lineární řetězec nylonu 6,6. Kolik molekul vody se přitom uvolní?', answer: 99, explain: '100 monomerů v řadě spojuje 99 amidových vazeb a při vzniku každé z nich se odštěpí jedna molekula vody.' },
    { kind: 'choice', q: 'Neznámá látka: MS $M^+$ při m/z 60; IR velmi široký pás 2 500–3 300 cm^{−1} a silný pás 1 710 cm^{−1}; ^{1}H NMR dva singlety v poměru 3 : 1 (δ 2,1 a 11,5). Co to je?', options: ['kyselina ethanová', 'propan-1-ol', 'methyl-methanoát', 'propan-2-ol'], answer: 0, explain: 'Všechny čtyři mají M = 60. Široký $O-H$ spolu s $C=O$ ukazuje karboxyl, singlet 3 H je $CH3$ vedle $C=O$ a singlet 1 H při 11,5 ppm vodík skupiny $-COOH$: $CH3COOH$.' },
  ],
}

export default level
