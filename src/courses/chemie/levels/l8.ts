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
        'Vysvětlit, proč uhlík tvoří tolik sloučenin (čtyřvaznost, řetězce, cykly)',
        'Zapsat molekulu souhrnným, strukturním, racionálním a vazebným vzorcem',
        'Roztřídit uhlíkaté řetězce a určit primární až kvartérní uhlík',
        'Rozpoznat řetězcové, polohové a funkční izomery, cis/trans izomery a chirální uhlík',
      ],
      hook: 'V databázích chemiků je přes sto milionů popsaných látek a drtivá většina z nich obsahuje uhlík. Jeden jediný prvek proti zbytku periodické tabulky, a vyhrává. Jak to dělá?',
      sections: [
        {
          title: 'Proč právě uhlík',
          icon: 'atom',
          blocks: [
            { type: 'p', text: '**Organická chemie** je chemie sloučenin uhlíku. Pár jednoduchých látek jako $CO$, $CO2$, uhličitany nebo kyanidy ale patří do anorganiky (potkal jsi je v úrovni 7).' },
            { type: 'iconlist', items: [
              { icon: 'bread', title: 'Jídlo', text: 'cukry, tuky, bílkoviny' },
              { icon: 'phone', title: 'Plast telefonu' },
              { icon: 'fuel', title: 'Benzin' },
              { icon: 'pill', title: 'Léky', text: 'třeba ten na bolest hlavy' },
              { icon: 'dna', title: 'Tvoje DNA' },
            ] },
            { type: 'callout', variant: 'fact', title: 'Konec „životní síly“', text: 'Dřív se věřilo, že organické látky umí vyrobit jen živé organismy díky tajemné „životní síle“ (*vis vitalis*). V roce 1828 ale Friedrich Wöhler připravil v baňce močovinu z anorganického kyanatanu amonného. Tím začala moderní organická chemie.' },
            { type: 'p', text: 'Uhlík má **4 valenční elektrony**, a tak tvoří **4 kovalentní vazby**: je **čtyřvazný**. Vazby $C-C$ jsou navíc pevné, takže se uhlíky řetězí prakticky donekonečna.' },
            { type: 'molecule', molecules: ['CH4'], labels: ['methan $CH4$: čtyřstěn, 109,5°'], caption: 'Čtyři vazby uhlíku míří do vrcholů čtyřstěnu. Otoč si model prstem.' },
            { type: 'structure', art: s`
    H
    |
H — C — H
    |
    H`, caption: 'Methan na papíře: vazby kreslíme do kříže' },
            { type: 'iconlist', items: [
              { icon: 'protein', title: 'Dlouhé řetězce', text: 'rovné i rozvětvené' },
              { icon: 'arrow-cycle', title: 'Cykly', text: 'kruhy různé velikosti' },
              { icon: 'bond', title: 'Násobné vazby', text: 'jednoduché, dvojné i trojné' },
            ] },
            { type: 'elements', symbols: ['C', 'H', 'O', 'N', 'S', 'Cl'], caption: 'Uhlík se pevně váže i na $H$, $O$, $N$, $S$ a halogeny. Z těchto prvků se skládá drtivá většina organických molekul.' },
            { type: 'keyterms', items: [
              { term: 'Vaznost', def: 'počet kovalentních vazeb, které atom v molekule obvykle tvoří' },
              { term: 'Uhlovodíky', def: 'sloučeniny složené jen z uhlíku a vodíku, např. methan $CH4$' },
              { term: 'Deriváty uhlovodíků', def: 'vzniknou náhradou vodíku jiným atomem nebo skupinou, např. $-OH$ nebo $-Cl$' },
            ] },
            { type: 'callout', variant: 'remember', title: 'Vaznosti v organice', text: '==Uhlík 4, dusík 3, kyslík 2, vodík a halogeny 1.== Když kreslíš vzorec, spočítej čáry u každého atomu. Uhlík s pěti vazbami neexistuje.' },
            { type: 'check', question: { kind: 'tf', q: 'V organických molekulách tvoří atom uhlíku obvykle čtyři kovalentní vazby.', answer: true, explain: 'Uhlík má 4 valenční elektrony a každý z nich použije na jednu společnou elektronovou dvojici, je tedy čtyřvazný.' } },
            { type: 'check', question: { kind: 'number', q: 'Kolik kovalentních vazeb tvoří v organických molekulách atom kyslíku?', answer: 2, explain: 'Kyslík má 6 valenčních elektronů a do oktetu mu chybějí 2, proto je dvojvazný, jako v $H-O-H$ nebo $C-O-H$.' } },
          ],
        },
        {
          title: 'Jak molekulu zapsat: čtyři druhy vzorců',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Jednu molekulu zapíšeš několika způsoby a každý se hodí jinde. Ukážeme si je na ethanolu, alkoholu z piva a vína.' },
            { type: 'molecule', molecules: ['ethanol'], labels: ['ethanol $C2H6O$'], caption: 'Takhle molekula opravdu vypadá. Vzorce na papíře jsou jen její zkratky.' },
            { type: 'keyterms', items: [
              { term: 'Souhrnný (molekulový) vzorec', def: 'jen počty atomů: $C2H6O$. Neříká nic o tom, jak jsou atomy pospojované.' },
              { term: 'Strukturní (konstituční) vzorec', def: 'všechny atomy i všechny vazby nakreslené čarami' },
              { term: 'Racionální (zkrácený) vzorec', def: 'atomy seskupené kolem jednotlivých uhlíků: $CH3-CH2-OH$ nebo $CH3CH2OH$' },
              { term: 'Vazebný (čárový) vzorec', def: 'jen kostra: každý konec a každý zlom čáry je uhlík, vodíky na uhlících se nepíšou' },
            ] },
            { type: 'structure', art: s`
    H   H
    |   |
H — C — C — O — H
    |   |
    H   H`, caption: 'Strukturní vzorec ethanolu' },
            { type: 'structure', art: s`
/\/\      pentan
/\/\OH    butan-1-ol`, caption: 'Vazebné vzorce: 4 čárky spojují 5 bodů. U pentanu je v každém bodě uhlík, u butan-1-olu je na konci místo uhlíku skupina $OH$.' },
            { type: 'callout', variant: 'tip', title: 'Závorky v racionálním vzorci', text: 'Skupina v závorce je **větev**, která visí na uhlíku těsně před ní. $CH3-CH(CH3)-CH3$ je tedy prostřední uhlík se dvěma methyly po stranách a třetím methylem dole.' },
            { type: 'example', title: 'Z racionálního vzorce na souhrnný', problem: 'Jaký je souhrnný vzorec látky $CH3-CH(CH3)-CH2-OH$?', steps: [
              'Spočítej uhlíky: $CH3$, $CH$, $CH3$ v závorce a $CH2$, tedy 4 atomy C.',
              'Spočítej vodíky: 3 + 1 + 3 + 2 + 1 (ve skupině $OH$) = 10.',
              'Kyslík: 1 (ve skupině $OH$).',
            ], answer: '$C4H10O$' },
            { type: 'check', question: { kind: 'text', q: 'Napiš souhrnný vzorec butanu $CH3-CH2-CH2-CH3$.', accept: ['C4H10'], caseSensitive: true, placeholder: 'např. C2H6', explain: 'Uhlíky: 4. Vodíky: 3 + 2 + 2 + 3 = 10. Souhrnný vzorec je $C4H10$.' } },
          ],
        },
        {
          title: 'Uhlíkaté řetězce',
          icon: 'bond',
          blocks: [
            { type: 'p', text: 'Uhlíková „kostra“ molekuly je **uhlíkatý řetězec**. Podle jejího tvaru látky třídíme dřív, než řešíme další atomy.' },
            { type: 'molecule', molecules: ['butane', 'isobutane', 'cyclohexane', 'benzene'], labels: ['butan: nerozvětvený', '2-methylpropan: rozvětvený', 'cyklohexan: alicyklický', 'benzen: aromatický'] },
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
            { type: 'structure', art: s`
      CH3
      |
CH3 — C — CH2 — CH — CH3
      |          |
      CH3        CH3`, caption: 'Isooktan: všechny $CH3$ jsou primární, $CH2$ je sekundární, $CH$ terciární a $C$ bez vodíků kvartérní' },
            { type: 'callout', variant: 'tip', text: 'U alkanů to poznáš podle vodíků: $CH3$ je primární, $CH2$ sekundární, $CH$ terciární a $C$ kvartérní. U derivátů ale raději počítej sousední uhlíky, protože vodík může nahradit jiná skupina.' },
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
            { type: 'p', text: '**Izomery** jsou látky se **stejným souhrnným vzorcem**, ale jinou strukturou, a proto i jinými vlastnostmi. U **konstitučních izomerů** se liší pořadí, v jakém jsou atomy pospojované.' },
            { type: 'compare', columns: [
              { title: 'Řetězcová', tone: 'a', points: ['jiný tvar uhlíkatého řetězce', 'butan × 2-methylpropan ($C4H10$)'] },
              { title: 'Polohová', tone: 'b', points: ['stejná skupina nebo násobná vazba na jiném místě řetězce', 'propan-1-ol × propan-2-ol ($C3H8O$)'] },
              { title: 'Funkční (skupinová)', tone: 'c', points: ['úplně jiná funkční skupina', 'ethanol × dimethylether ($C2H6O$)'] },
            ], caption: 'Tři druhy konstituční izomerie' },
            { type: 'diagram', id: 'isomers', caption: 'Stejný vzorec, jiné vlastnosti: řetězcové izomery $C4H10$ (butan a 2-methylpropan) a funkční izomery $C2H6O$ (kapalný ethanol a plynný dimethylether), všechny s teplotou varu. Obrázek ukazuje i cis/trans a optickou izomerii, kterým se věnuje další část.' },
            { type: 'structure', art: s`
CH3 — CH2 — CH2 — OH

CH3 — CH — CH3
      |
      OH`, caption: 'Polohové izomery $C3H8O$: propan-1-ol (var 97 °C) a propan-2-ol (var 82 °C)' },
            { type: 'callout', variant: 'fact', text: 'Izomerů přibývá závratně rychle. $C4H10$ má 2, $C5H12$ 3, $C6H14$ 5, $C10H22$ už 75 a $C20H42$ neuvěřitelných 366 319.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Rozhoduj rychle a otestuj, co víš o vzorcích a izomerech.' },
            { type: 'check', question: { kind: 'choice', q: 'Ethanol $CH3CH2OH$ a dimethylether $CH3OCH3$ jsou izomery…', options: ['funkční', 'řetězcové', 'polohové', 'optické'], answer: 0, explain: 'Oba mají vzorec $C2H6O$, ale ethanol je alkohol ($-OH$) a dimethylether je ether ($C-O-C$). Liší se funkční skupinou.' } },
            { type: 'check', question: { kind: 'tf', q: 'Izomery mají vždy stejnou teplotu varu, protože mají stejnou molární hmotnost.', answer: false, explain: 'Stejná molární hmotnost nestačí. Ethanol vře při 78 °C, dimethylether už při −24 °C, protože jen ethanol tvoří vodíkové můstky.' } },
          ],
        },
        {
          title: 'Stereoizomerie: když rozhoduje prostor',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'U **stereoizomerů** jsou atomy pospojované stejně, liší se jen **uspořádáním v prostoru**. Pro tvůj nos nebo enzymy v těle jde ale o úplně jiné molekuly.' },
            { type: 'h', text: 'Cis/trans izomerie' },
            { type: 'p', text: 'Kolem dvojné vazby se atomy nemohou volně otáčet (proč, uvidíš v lekci o alkenech). Nese-li každý uhlík dvojné vazby dva **různé** substituenty, vzniká izomer **cis** (stejné skupiny na stejné straně) a **trans** (na opačných stranách).' },
            { type: 'molecule', molecules: ['cis-but-2-ene', 'trans-but-2-ene'], labels: ['cis-but-2-en: methyly na stejné straně', 'trans-but-2-en: methyly na opačných stranách'], caption: 'Cis a trans izomer but-2-enu' },
            { type: 'callout', variant: 'fact', title: 'Trans-tuky', text: 'Cis a trans izomery mají různé fyzikální vlastnosti. Nenasycené mastné kyseliny v přírodních olejích jsou většinou cis. Trans-tuky, které vznikají hlavně při průmyslovém ztužování olejů, škodí srdci a cévám.' },
            { type: 'h', text: 'Optická izomerie a chiralita' },
            { type: 'p', text: 'Uhlík se **čtyřmi různými** atomy nebo skupinami je **chirální** (asymetrický). Molekula s ním existuje ve dvou zrcadlových podobách, které nejdou na sebe přiložit, jako levá a pravá ruka. Takové dvojici říkáme **enantiomery** (optické izomery).' },
            { type: 'molecule', molecules: ['lactic-acid'], labels: ['kyselina mléčná'], caption: 'Prostřední uhlík nese $H$, $OH$, $CH3$ a $COOH$: čtyři různé skupiny, chirální uhlík.' },
            { type: 'compare', columns: [
              { title: 'Enantiomery mají stejnou', icon: 'check', tone: 'a', points: ['teplotu varu', 'hustotu'] },
              { title: 'Enantiomery se liší', icon: 'magnifier', tone: 'b', points: ['stáčejí rovinu polarizovaného světla na opačné strany (proto „optické“)', 'jinak reagují s chirálními molekulami: s receptory v nose nebo s enzymy'] },
            ] },
            { type: 'callout', variant: 'fact', title: 'Máta, nebo kmín?', text: 'Karvon existuje ve dvou enantiomerech. Jeden voní jako máta klasnatá, jeho zrcadlový obraz jako kmín. Tvůj nos je chirální detektor.' },
            { type: 'callout', variant: 'warning', title: 'Tragédie thalidomidu', text: 'Lék thalidomid (Contergan) se koncem 50. let podával těhotným proti nevolnosti. Jeden enantiomer uklidňuje, druhý poškozuje vývoj plodu, a v těle se navíc mění jeden v druhý. Narodily se tisíce dětí s vážnými vadami končetin. Od té doby se u léků musí zkoumat každý enantiomer zvlášť.' },
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
        'Souhrnný vzorec udává složení, strukturní všechny vazby, racionální skupiny atomů a vazebný jen uhlíkovou kostru.',
        'Řetězce jsou acyklické nebo cyklické, rozvětvené nebo nerozvětvené, nasycené nebo nenasycené.',
        'Izomery mají stejný souhrnný vzorec, ale jinou strukturu, a proto i jiné vlastnosti.',
        'Konstituční izomerie je řetězcová, polohová nebo funkční.',
        'Cis/trans izomerie vzniká u dvojné vazby, optická u chirálního uhlíku se čtyřmi různými substituenty.',
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
        { kind: 'number', q: 'Kolik primárních uhlíků je v molekule 2-methylpropanu $CH3-CH(CH3)-CH3$?', answer: 3, explain: 'Tři skupiny $CH3$ jsou každá vázaná jen na prostřední uhlík, který je terciární.' },
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
        'Vysvětlit, jak se zpracovává ropa a co znamená oktanové číslo',
      ],
      hook: 'Plyn ve sporáku, benzin v autě, vosk ve svíčce i asfalt na silnici. To všechno jsou v podstatě stejné molekuly: uhlíky a vodíky v řadě, jen různě dlouhé. Jak může délka řetězce udělat z plynu asfalt?',
      sections: [
        {
          title: 'Homologická řada alkanů',
          icon: 'chart',
          blocks: [
            { type: 'p', text: '**Alkany** jsou nasycené acyklické uhlovodíky: jen uhlík, vodík a jednoduché vazby. Jejich obecný vzorec je $C_{n}H_{2n+2}$.' },
            { type: 'molecule', molecules: ['CH4', 'C2H6', 'C3H8', 'butane'], labels: ['methan $CH4$', 'ethan $C2H6$', 'propan $C3H8$', 'butan $C4H10$'], caption: 'První čtyři alkany: každý je o jednu skupinu $-CH2-$ delší' },
            { type: 'p', text: 'Řadě látek, které se liší právě o $CH2$, říkáme **homologická řada** a jejím členům **homology**. Mají podobné chemické vlastnosti a jejich fyzikální vlastnosti se mění postupně.' },
            { type: 'diagram', id: 'homologous-series', caption: 'Homologická řada nerozvětvených alkanů od methanu po dekan: v každém řádku přibude skupina $-CH2-$. Vedle vazebného a souhrnného vzorce je teplota varu; methan až butan jsou při 25 °C plyny, od pentanu kapaliny.' },
            { type: 'callout', variant: 'tip', title: 'Jak si zapamatovat názvy', text: 'První čtyři mají historické názvy: **meth-, eth-, prop-, but-**. Od pěti uhlíků se používají řecké číslovky (u devítky latinská): **pent**-, **hex**-, **hept**-, **okt**-, **non**-, **dek**-. Stejně jako pentagon, hexagon nebo oktopus s osmi chapadly.' },
            { type: 'keyterms', items: [
              { term: 'Alkyl', def: 'zbytek alkanu po odtržení jednoho vodíku; koncovka -an se mění na **-yl**: methyl $CH3-$, ethyl $CH3-CH2-$, propyl $CH3-CH2-CH2-$' },
              { term: 'Methylenová skupina', def: '$-CH2-$, o kterou se liší sousední homology' },
            ] },
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
              { icon: 'molecule', title: 'Násobící předpony', text: 'stejné větve spoj předponou di-, tri-, tetra-; každá má vlastní lokant: 2,2-dimethyl' },
              { icon: 'book', title: 'Abecedně', text: 'různé větve podle abecedy, násobící předpony se nepočítají: ethyl před methyl' },
              { icon: 'check', title: 'Celý název', text: 'nakonec název hlavního řetězce; čísla odděl čárkou, číslo od písmene spojovníkem, vše jedním slovem' },
            ], caption: 'Šest kroků k názvu rozvětveného alkanu' },
            { type: 'molecule', molecules: ['isobutane'], labels: ['2-methylpropan: hlavní řetězec 3 uhlíky, methyl na C2'], caption: 'Nejjednodušší rozvětvený alkan' },
            { type: 'structure', art: s`
CH3 — CH — CH2 — CH — CH3
      |          |
      CH3        CH2
                 |
                 CH3`, caption: 'Příklad 1: jak se tahle molekula jmenuje?' },
            { type: 'example', title: 'Hlavní řetězec nemusí vést rovně', problem: 'Pojmenuj alkan z příkladu 1.', steps: [
              'Nejdelší řetězec vede z levého $CH3$ přes $CH$, $CH2$, $CH$ a pak dolů přes $CH2$ do $CH3$. Má **6 uhlíků**, základ je tedy **hexan**. Vodorovná řada má jen 5.',
              'Větve: dva methyly, jeden pod prvním $CH$ a druhý je pravý koncový $CH3$.',
              'Číslování zleva dá methylům lokanty 2 a 4, číslování zdola 3 a 5. Nižší lokanty vyhrávají.',
              'Dva stejné methyly spojíš předponou **di**: 2,4-dimethyl.',
            ], answer: '**2,4-dimethylhexan**' },
            { type: 'structure', art: s`
CH3 — CH — CH — CH2 — CH2 — CH3
      |    |
      CH3  CH2
           |
           CH3`, caption: 'Příklad 2: dvě různé větve' },
            { type: 'example', title: 'Dvě různé větve', problem: 'Pojmenuj alkan z příkladu 2.', steps: [
              'Nejdelší řetězec má 6 uhlíků. Vodorovný řetězec i řetězec vedoucí přes ethyl jsou stejně dlouhé, vodorovný má ale dvě větve, a proto vyhrává.',
              'Číslování zleva: methyl na C2, ethyl na C3. Zprava by vyšly lokanty 4 a 5.',
              'Abecední pořadí: **e**thyl před **m**ethyl.',
            ], answer: '**3-ethyl-2-methylhexan**' },
            { type: 'example', title: 'Od názvu ke vzorci', problem: 'Nakresli 2,2,4-trimethylpentan (isooktan).', steps: [
              'Základ **pentan**: nakresli řetězec 5 uhlíků a očísluj ho 1–5.',
              'Na uhlík 2 připoj dva methyly, na uhlík 4 jeden methyl.',
              'Doplň vodíky tak, aby měl každý uhlík čtyři vazby.',
            ], answer: '$CH3-C(CH3)2-CH2-CH(CH3)-CH3$, souhrnně $C8H18$ (vzorec už znáš z první lekce)' },
            { type: 'callout', variant: 'warning', title: 'Nejčastější chyby', text: 'Název „1-methyl…“ nikdy nevznikne, methyl na konci řetězce ho jen prodlužuje. A když ti vyjde „2-ethyl…“, zvolil jsi hlavní řetězec moc krátký: 2-ethylpentan je ve skutečnosti 3-methylhexan.' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj alkan $CH3-CH(CH3)-CH(CH3)-CH3$.', accept: ['2,3-dimethylbutan', '2,3 dimethylbutan', '2, 3-dimethylbutan'], explain: 'Hlavní řetězec má 4 uhlíky (butan), methyly jsou na C2 a C3 z obou stran: 2,3-dimethylbutan.' } },
            { type: 'check', question: { kind: 'choice', q: 'Který z názvů je utvořený správně?', options: ['3-methylhexan', '2-ethylpentan', '4-methylhexan', '1-methylpentan'], answer: 0, explain: '2-ethylpentan je správně 3-methylhexan, 4-methylhexan se má číslovat z druhé strany (3-methylhexan) a 1-methylpentan je prostě hexan.' } },
          ],
        },
        {
          title: 'Vlastnosti a hoření alkanů',
          icon: 'flame',
          blocks: [
            { type: 'p', text: 'Alkany jsou **nepolární**: ve vodě se nerozpouštějí a plavou na ní (benzin na hladině), rozpouštějí ale tuky. Mezi molekulami působí jen slabé **disperzní (Londonovy) síly** (úroveň 3). Čím delší řetězec, tím větší styčná plocha a vyšší teplota varu.' },
            { type: 'iconlist', items: [
              { icon: 'gas-cloud', title: '$C1–C4$: plyny', text: 'methan až butan' },
              { icon: 'drop', title: 'zhruba $C5–C16$: kapaliny', text: 'benzin, petrolej, nafta' },
              { icon: 'crystal', title: 'delší: pevné látky', text: 'třeba parafín ve svíčce' },
            ] },
            { type: 'table', headers: ['Izomer $C5H12$', 'Tvar molekuly', 'Teplota varu'], rows: [
              ['pentan', 'dlouhý, rovný', '36 °C'],
              ['2-methylbutan', 'jedna větev', '28 °C'],
              ['2,2-dimethylpropan', 'téměř kulovitý', '10 °C'],
            ], caption: 'Větvení snižuje teplotu varu' },
            { type: 'callout', variant: 'remember', text: '==Delší řetězec → vyšší teplota varu, víc větví → nižší teplota varu.== Rozvětvená molekula je kompaktnější a dotýká se sousedů menší plochou.' },
            { type: 'p', text: 'Chemicky jsou alkany líné: starý název **parafíny** pochází z latinského *parum affinis*, „málo slučivý“. S kyselinami, zásadami ani běžnými oxidovadly nereagují. Zvládají ale hoření a radikálovou substituci.' },
            { type: 'reaction', equation: 'CH4 + 2O2 -> CO2 + 2H2O', caption: 'dokonalé hoření methanu, uvolní se asi 890 kJ na 1 mol methanu' },
            { type: 'compare', columns: [
              { title: 'Dokonalé hoření', icon: 'flame', tone: 'good', points: ['dost kyslíku', 'vzniká $CO2$ a $H2O$'] },
              { title: 'Nedokonalé hoření', icon: 'warning', tone: 'bad', points: ['kyslíku je málo', 'vzniká jedovatý oxid uhelnatý $CO$ nebo saze (čistý uhlík)'] },
            ] },
            { type: 'reaction', equation: '2CH4 + 3O2 -> 2CO + 4H2O', caption: 'nedokonalé hoření methanu' },
            { type: 'callout', variant: 'warning', title: 'Tichý zabiják', text: 'Oxid uhelnatý $CO$ nevidíš ani necítíš a váže se na hemoglobin mnohem pevněji než kyslík. Špatně seřízený plynový kotel nebo karma v koupelně bez větrání může zabíjet. Detektor $CO$ za pár stovek korun zachraňuje životy.' },
            { type: 'example', title: 'Vyčíslení hoření', problem: 'Vyčísli rovnici dokonalého hoření butanu $C4H10$ (plyn v zapalovači).', steps: [
              'Kostra rovnice: $C4H10 + O2 -> CO2 + H2O$',
              'Uhlíky: 4, tedy $4CO2$. Vodíky: 10, tedy $5H2O$.',
              'Kyslíků vpravo je 4 · 2 + 5 = 13 atomů, potřebuješ tedy 13/2 molekuly $O2$.',
              'Zlomek odstraníš tak, že celou rovnici vynásobíš dvěma.',
            ], answer: '$2C4H10 + 13O2 -> 8CO2 + 10H2O$' },
            { type: 'check', question: { kind: 'number', q: 'Kolik molekul kyslíku spotřebuje dokonalé hoření jedné molekuly propanu $C3H8$?', answer: 5, explain: '$C3H8 + 5O2 -> 3CO2 + 4H2O$. Vpravo je 3 · 2 + 4 = 10 atomů kyslíku, tedy 5 molekul $O2$.' } },
          ],
        },
        {
          title: 'Radikálová substituce',
          icon: 'sun',
          blocks: [
            { type: 'p', text: 'Za světla nebo za vysoké teploty reagují alkany s halogeny: atom vodíku se vymění za atom halogenu. Jde o **substituci** (nahrazení) přes radikály, tedy **radikálovou substituci** ($S_{R}$).' },
            { type: 'reaction', equation: 'CH4 + Cl2 -> CH3Cl + HCl', caption: 'chlorace methanu za UV záření ($hν$), vzniká chlormethan' },
            { type: 'keyterms', items: [
              { term: 'Radikál', def: 'částice s nepárovým elektronem, značí se tečkou: $Cl·$, $·CH3$. Je extrémně reaktivní.' },
              { term: 'Homolytické štěpení', def: 'vazba se rozpadne tak, že si každý atom vezme jeden elektron ze sdíleného páru.' },
              { term: 'Řetězová reakce', def: 'každý krok vytvoří nový radikál, který spustí další krok.' },
            ] },
            { type: 'diagram', id: 'substitution-mechanism', caption: 'Mechanismus chlorace methanu krok za krokem: iniciace (světlo rozštěpí $Cl2$ na dva radikály), dva kroky propagace a terminace. Jediný foton spustí řetěz, který se mnohokrát zopakuje, než ho terminace zastaví.' },
            { type: 'p', text: 'U jednoho vodíku to ale nekončí. Postupně se vymění i další, a tak vzniká směs chlorderivátů.' },
            { type: 'molecule', molecules: ['CH3Cl', 'CH2Cl2', 'CCl4'], labels: ['chlormethan $CH3Cl$', 'dichlormethan $CH2Cl2$', 'tetrachlormethan $CCl4$'], caption: 'Mezi nimi vzniká i trichlormethan $CHCl3$ (chloroform).' },
            { type: 'callout', variant: 'fact', text: 'Chloroform patřil v 19. století k prvním celkovým anestetikům, uspávala se jím i britská královna Viktorie při porodu. Dnes se kvůli toxicitě pro játra a srdce v medicíně nepoužívá.' },
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
            { type: 'p', text: 'Hlavním zdrojem alkanů jsou fosilní suroviny: zemní plyn a ropa. Ropa se v rafinerii dělí **frakční destilací** podle teplot varu.' },
            { type: 'compare', columns: [
              { title: 'Zemní plyn', icon: 'gas-cylinder', tone: 'a', points: ['převážně methan, obvykle přes 90 %', 'příměs ethanu, propanu a butanu'] },
              { title: 'Ropa', icon: 'oil-barrel', tone: 'b', points: ['hustá směs stovek uhlovodíků', 'hlavně alkany a cykloalkany', 'menší podíl aromátů'] },
            ] },
            { type: 'diagram', id: 'fractional-distillation', caption: 'Frakční destilace: páry stoupají kolonou. Nahoře, kde je chladněji, kondenzují krátké molekuly s nízkou teplotou varu, dole ty dlouhé. U každé frakce je počet uhlíků, rozmezí teplot varu a použití (hranice se mezi rafineriemi trochu liší).' },
            { type: 'p', text: 'Dlouhých molekul je v ropě víc, než trh potřebuje, a benzinu málo. Proto se dlouhé řetězce štěpí **krakováním** na kratší alkany a alkeny.' },
            { type: 'reaction', equation: 'C10H22 -> C8H18 + C2H4', caption: 'krakování dekanu na oktan a ethen' },
            { type: 'p', text: 'V motoru se směs benzinu a vzduchu stlačí a zapálí jiskrou. Nevhodné palivo se ale vznítí samo příliš brzy a motor „klepe“ (detonační spalování), což ho ničí. Odolnost paliva proti klepání udává **oktanové číslo**.' },
            { type: 'compare', columns: [
              { title: 'Oktanové číslo 100', icon: 'check', tone: 'good', points: ['isooktan (2,2,4-trimethylpentan)', 'rozvětvený a velmi odolný'] },
              { title: 'Oktanové číslo 0', icon: 'cross', tone: 'bad', points: ['heptan', 'nerozvětvený, klepe hned'] },
            ], caption: '**Natural 95**: benzin se v motoru chová jako směs 95 % isooktanu a 5 % heptanu' },
            { type: 'callout', variant: 'fact', text: 'Rozvětvené alkany a aromáty mají vysoké oktanové číslo, nerozvětvené nízké. Rafinerie proto řetězce záměrně přestavují. Dřív se oktanové číslo zvyšovalo jedovatým tetraethylolovem, olovnatý benzin je ale v EU od roku 2000 zakázaný.' },
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
            { type: 'structure', art: s`
      CH2
     /   \
  H2C     CH2
    |     |
  H2C     CH2
     \   /
      CH2`, caption: 'Cyklohexan $C6H12$. Ve vazebném vzorci je to prostě šestiúhelník.' },
            { type: 'p', text: 'Kolem jednoduché vazby se atomy volně otáčejí. Podoby, které se liší jen natočením kolem jednoduchých vazeb, jsou **konformace**. Nejsou to izomery, molekula mezi nimi přechází miliardkrát za sekundu.' },
            { type: 'compare', columns: [
              { title: 'Stabilnější', icon: 'check', tone: 'good', points: ['ethan: **nezákrytová** konformace, vodíky sousedních uhlíků míří „mezi sebe“', 'cyklohexan: **židlička**, úhly téměř čtyřstěnné, molekula není pnutá'] },
              { title: 'Méně stabilní', icon: 'cross', tone: 'bad', points: ['ethan: **zákrytová** konformace, vodíky přesně za sebou, o něco vyšší energie', 'cyklohexan: **vanička**'] },
            ], caption: 'Rovinný šestiúhelník by měl úhly 120° místo ideálních 109,5°, proto se cyklohexan zkroutí.' },
            { type: 'callout', variant: 'fact', text: 'Cyklopropan je trojúhelník s úhly 60°. Vazby jsou tak napnuté, že se kruh snadno otevírá, a cyklopropan je proto mnohem reaktivnější než ostatní cykloalkany.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: kolik vzorců a názvů alkanů zvládneš za 60 sekund?' },
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
        'Ropa se dělí frakční destilací a kvalitu benzinu udává oktanové číslo.',
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
        { kind: 'tf', q: 'Benzin s oktanovým číslem 95 obsahuje přesně 95 % isooktanu.', answer: false, explain: 'Oktanové číslo jen říká, že se benzin chová jako taková směs. Ve skutečnosti obsahuje stovky různých uhlovodíků.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-3
    'l8-3': {
      id: 'l8-3',
      title: 'Alkeny, alkyny a aromáty',
      goals: [
        'Pojmenovat alkeny a alkyny a nakreslit jejich vzorce podle názvu',
        'Předpovědět produkt elektrofilní adice podle Markovnikovova pravidla a popsat její mechanismus',
        'Vysvětlit, čím je benzen zvláštní a proč podléhá substituci místo adice',
        'Uvést příklady polymerů z alkenů a důležitých arenů včetně jejich rizik',
      ],
      hook: 'Zelené banány dozrají rychleji, když je dáš do sáčku ke zralému jablku. Může za to plyn ethen, nejjednodušší alken. Stačí jedna dvojná vazba a z líného uhlovodíku je reaktivní molekula, ze které se navíc vyrábí většina plastů kolem tebe.',
      sections: [
        {
          title: 'Dvojná a trojná vazba',
          icon: 'bond',
          blocks: [
            { type: 'p', text: '**Alkeny** mají dvojnou vazbu $C=C$ a (s jednou dvojnou vazbou) vzorec $C_{n}H_{2n}$. **Alkyny** mají trojnou vazbu $C≡C$ a vzorec $C_{n}H_{2n-2}$. Oboje jsou **nenasycené** uhlovodíky: na násobnou vazbu jde ještě něco „přidat“.' },
            { type: 'molecule', molecules: ['C2H6', 'C2H4', 'C2H2'], labels: ['ethan: čtyřstěny', 'ethen: plochý, 120°', 'ethyn: lineární, 180°'] },
            { type: 'p', text: 'Dvojná vazba má pevnou **σ-vazbu** přímo na spojnici jader a slabší **π-vazbu** z bočního překryvu orbitalů nad a pod rovinou molekuly. Trojná vazba má jednu σ-vazbu a dvě π-vazby.' },
            { type: 'callout', variant: 'remember', text: 'π-elektrony jsou „venku“, slabě držené a snadno dostupné. ==Proto jsou alkeny a alkyny mnohem reaktivnější než alkany.== Otočením by se π-vazba přetrhla, a tak se kolem dvojné vazby nedá volně otáčet. Odtud cis/trans izomerie z první lekce.' },
            { type: 'compare', columns: [
              { title: 'Alkan', tone: 'a', points: ['$C-C$, délka 154 pm', 'čtyřstěn, 109,5°', '$C_{n}H_{2n+2}$, nasycený', 'ethan'] },
              { title: 'Alken', tone: 'b', points: ['$C=C$, délka 134 pm', 'rovina, 120°', '$C_{n}H_{2n}$', 'ethen (ethylen)'] },
              { title: 'Alkyn', tone: 'c', points: ['$C≡C$, délka 120 pm', 'přímka, 180°', '$C_{n}H_{2n-2}$', 'ethyn (acetylen)'] },
            ], caption: 'Čím víc vazeb mezi uhlíky, tím jsou si blíž' },
            { type: 'callout', variant: 'fact', text: 'Ethen je nejvyráběnější organická látka na světě, přes 150 milionů tun ročně. Rostliny ho samy tvoří jako hormon zrání. Ethyn (acetylen) hoří v kyslíku plamenem o teplotě přes 3 000 °C, a proto se používá ke sváření a řezání oceli.' },
            { type: 'reaction', equation: '2C2H2 + 5O2 -> 4CO2 + 2H2O', caption: 'hoření acetylenu ve svařovacím hořáku' },
            { type: 'check', question: { kind: 'choice', q: 'Jaký obecný vzorec mají alkyny s jednou trojnou vazbou?', options: ['$C_{n}H_{2n-2}$', '$C_{n}H_{2n}$', '$C_{n}H_{2n+2}$', '$C_{n}H_{n}$'], answer: 0, explain: 'Každá π-vazba ubere dva vodíky. Trojná vazba má dvě π-vazby, takže oproti alkanu chybí 4 vodíky: $C_{n}H_{2n-2}$.' } },
            { type: 'check', question: { kind: 'tf', q: 'Kolem dvojné vazby $C=C$ se atomy mohou volně otáčet stejně jako kolem jednoduché vazby.', answer: false, explain: 'Otočení by rozbilo překryv orbitalů π-vazby. Proto je dvojná vazba „zamčená“ a existují cis/trans izomery.' } },
          ],
        },
        {
          title: 'Názvosloví alkenů a alkynů',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Alkeny a alkyny pojmenuješ jako alkany, jen koncovku **-an** vyměníš za **-en** (dvojná vazba) nebo **-yn** (trojná vazba). Číslo před koncovkou říká, na kterém uhlíku násobná vazba začíná: but-1-en, but-2-en.' },
            { type: 'iconlist', items: [
              { icon: 'magnifier', title: 'Hlavní řetězec', text: 'vede přes násobnou vazbu' },
              { icon: 'calculator', title: 'Nejnižší lokant', text: 'dostane **násobná vazba**, má přednost před větvemi' },
              { icon: 'bond', title: 'Víc násobných vazeb', text: 'dvě dvojné: **-dien**, tři: **-trien**, a před koncovku se vloží „a“: buta-1,3-dien' },
              { icon: 'check', title: 'Bez lokantu', text: 'ethen, propen, ethyn a propyn: jiná poloha násobné vazby tu neexistuje' },
            ] },
            { type: 'structure', art: s`
5     4    3    2    1
CH3 — CH — CH = CH — CH3
      |
      CH3`, caption: 'Číslujeme zprava, aby dvojná vazba dostala nejnižší lokant' },
            { type: 'example', title: 'Dvojná vazba má přednost', problem: 'Pojmenuj alken $CH3-CH(CH3)-CH=CH-CH3$.', steps: [
              'Hlavní řetězec s dvojnou vazbou má 5 uhlíků, základ je **pent-**.',
              'Číslování zleva by dalo dvojné vazbě lokant 3, zprava 2. Vyhrává zprava, i když methyl pak dostane vyšší číslo.',
              'Dvojná vazba mezi C2 a C3: **pent-2-en**.',
              'Methyl na C4: **4-methyl**.',
            ], answer: '**4-methylpent-2-en**' },
            { type: 'example', title: 'Od názvu ke vzorci', problem: 'Nakresli but-1-yn a but-2-yn.', steps: [
              'Základ **but-**: řetězec 4 uhlíků.',
              'but-1-yn: trojná vazba mezi C1 a C2, tedy $CH≡C-CH2-CH3$.',
              'but-2-yn: trojná vazba mezi C2 a C3, tedy $CH3-C≡C-CH3$.',
              'Kontrola: uhlík s trojnou vazbou může mít už jen jednu další vazbu.',
            ], answer: 'Obě látky mají vzorec $C4H6$, jsou to polohové izomery.' },
            { type: 'callout', variant: 'tip', title: 'Triviální názvy', text: 'Potkáš je všude: **ethylen** = ethen, **propylen** = propen, **acetylen** = ethyn, **butadien** = buta-1,3-dien (surovina pro syntetický kaučuk).' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj alken $CH2=CH-CH2-CH3$.', accept: ['but-1-en', 'but 1 en', '1-buten', 'buten-1'], explain: 'Čtyři uhlíky a dvojná vazba mezi C1 a C2: but-1-en.' } },
            { type: 'check', question: { kind: 'choice', q: 'Jak se správně jmenuje $CH3-CH=CH-CH2-CH2-CH3$?', options: ['hex-2-en', 'hex-4-en', 'hex-3-en', 'pent-2-en'], answer: 0, explain: 'Řetězec má 6 uhlíků a číslujeme zleva, aby dvojná vazba dostala lokant 2, ne 4.' } },
          ],
        },
        {
          title: 'Elektrofilní adice',
          icon: 'ion-plus',
          blocks: [
            { type: 'p', text: 'Typickou reakcí alkenů je **adice**: π-vazba se rozpojí, na oba uhlíky se připojí nové atomy a z dvojné vazby zbude jednoduchá. Nic se neodštěpuje, dvě molekuly se spojí v jednu.' },
            { type: 'table', headers: ['Činidlo', 'Reakce', 'Produkt z ethenu'], rows: [
              ['$H2$ (katalyzátor $Ni$ nebo $Pt$)', 'hydrogenace', 'ethan $CH3-CH3$'],
              ['$Br2$', 'bromace (halogenace)', '1,2-dibromethan $CH2Br-CH2Br$'],
              ['$HBr$', 'hydrohalogenace', 'bromethan $CH3-CH2Br$'],
              ['$H2O$ (katalyzátor $H^+$)', 'hydratace', 'ethanol $CH3-CH2OH$'],
            ], caption: 'Čtyři základní adice na dvojnou vazbu' },
            { type: 'p', text: 'Oblak π-elektronů přitahuje částice s nedostatkem elektronů, **elektrofily** („milovníky elektronů“), například proton $H^+$. Proto mluvíme o **elektrofilní adici** ($A_{E}$).' },
            { type: 'callout', variant: 'tip', title: 'Důkaz násobné vazby', text: 'K vzorku přidej pár kapek **bromové vody** (oranžovohnědé). Alken nebo alkyn brom aduje a roztok se **odbarví**, alkan barvu nezmění. Brom je leptavý a jedovatý: pracuje se v digestoři, s brýlemi a rukavicemi.' },
            { type: 'p', text: 'U nesymetrického alkenu, jako je propen, může vodík skončit na dvou různých uhlících. Který produkt převládne, určuje **Markovnikovovo pravidlo**.' },
            { type: 'callout', variant: 'remember', title: 'Markovnikovovo pravidlo', text: '==Vodík z činidla $HX$ se naváže na ten uhlík dvojné vazby, který už má víc vodíků.== Kdo má, tomu bude přidáno.' },
            { type: 'diagram', id: 'addition-mechanism', caption: 'Adice $HBr$ na propen krok za krokem: π-elektrony chytí proton a vazba $H-Br$ se štěpí **heterolyticky**, na prostředním uhlíku vznikne **karbokation** (sekundární je stabilnější než primární, sousední alkyly kladný náboj „rozmělní“) a nakonec se na něj naváže $Br^-$. Hlavním produktem je **2-brompropan** $CH3-CHBr-CH3$, 1-brompropanu vznikne jen málo.' },
            { type: 'check', question: { kind: 'text', q: 'Který hlavní produkt vznikne adicí vody na propen (katalyzátor $H^+$)? Napiš název.', accept: ['propan-2-ol', 'propan 2 ol', '2-propanol', 'isopropanol', 'isopropylalkohol'], explain: 'Podle Markovnikova jde vodík na krajní $CH2$ a skupina $-OH$ na prostřední uhlík: vznikne propan-2-ol $CH3-CH(OH)-CH3$.' } },
            { type: 'check', question: { kind: 'choice', q: 'Co pozoruješ, když přidáš bromovou vodu ke cyklohexenu (cyklický alken)?', options: ['oranžová barva zmizí', 'vznikne bílá sraženina', 'roztok zmodrá', 'nic, bromová voda reaguje jen s alkany'], answer: 0, explain: 'Cyklohexen má dvojnou vazbu, na kterou se brom aduje. Barevný brom se spotřebuje a roztok se odbarví.' } },
          ],
        },
        {
          title: 'Polymerace: z malých molekul obři',
          icon: 'plastic-bottle',
          blocks: [
            { type: 'p', text: 'Molekuly alkenů se umí adovat i samy na sebe. Tisíce malých **monomerů** se spojí do jedné obří **makromolekuly**, **polymeru**. Tomuto ději říkáme **adiční polymerace**.' },
            { type: 'diagram', id: 'polymer-chain', caption: 'Adiční polymerace ethenu: π-vazby n molekul $CH2=CH2$ se rozpojí a vznikne řetězec polyethylenu (PE), $n CH2=CH2 -> -[CH2-CH2]_{n}-$, ve kterém se pořád opakuje jednotka $-CH2-CH2-$. Zblízka je makromolekula zamotané klubko. Pro srovnání opakující se jednotky PVC a PET.' },
            { type: 'molecule', molecules: ['C2H4', 'propene', 'vinyl-chloride', 'styrene'], labels: ['ethen -> PE', 'propen -> PP', 'chlorethen (vinylchlorid) -> PVC', 'styren -> PS'], caption: 'Monomery nejdůležitějších plastů' },
            { type: 'iconlist', items: [
              { icon: 'plastic-bottle', title: 'Polyethylen (PE)', text: 'sáčky, fólie, lahve, kanystry' },
              { icon: 'car', title: 'Polypropylen (PP)', text: 'kelímky, krabičky, díly aut, textil' },
              { icon: 'water-tap', title: 'Polyvinylchlorid (PVC)', text: 'okna, trubky, podlahy, kabely' },
              { icon: 'cold', title: 'Polystyren (PS)', text: 'tácky, pěnový polystyren na zateplení' },
              { icon: 'egg', title: 'Teflon (PTFE)', text: 'polytetrafluorethylen z tetrafluorethenu $CF2=CF2$: nepřilnavé pánve, těsnění' },
            ] },
            { type: 'callout', variant: 'fact', text: 'Polyethylen objevili v roce 1933 v britské firmě ICI víceméně náhodou: v aparatuře pod vysokým tlakem se objevila bílá vosková hmota. Dnes je to nejvyráběnější plast na světě.' },
            { type: 'p', text: 'Kondenzační polymeraci, recyklaci plastů a mikroplasty probereme v poslední lekci této úrovně.' },
            { type: 'check', question: { kind: 'number', q: 'Řetězec polyethylenu má molární hmotnost 280 000 g/mol. Z kolika molekul ethenu ($M$ = 28 g/mol) vznikl?', answer: 10000, explain: 'Při adiční polymeraci se nic neodštěpuje, takže 280 000 : 28 = 10 000 monomerů.' } },
            { type: 'check', question: { kind: 'tf', q: 'Při adiční polymeraci ethenu se odštěpuje voda.', answer: false, explain: 'Při adiční polymeraci se jen rozpojují π-vazby a monomery se spojují. Žádný vedlejší produkt nevzniká.' } },
          ],
        },
        {
          title: 'Benzen a aromaticita',
          icon: 'molecule',
          blocks: [
            { type: 'p', text: '**Benzen** $C6H6$ je bezbarvá kapalina (var 80 °C) s typickým zápachem: šest uhlíků v plochém šestiúhelníku, na každém jeden vodík. Podle vzorce by to měl být superreaktivní „trien“, ale bromovou vodu vůbec neodbarví. Proč?' },
            { type: 'molecule', molecules: ['benzene'], labels: ['benzen $C6H6$: plochý kruh'] },
            { type: 'structure', art: s`
      CH
    //  \
  HC     CH
   |     ‖
  HC     CH
    \\  /
      CH`, caption: 'Kekulého vzorec benzenu. Dvojné vazby ale ve skutečnosti nejsou na pevných místech.' },
            { type: 'callout', variant: 'fact', title: 'Had, který se kouše do ocasu', text: 'August Kekulé tvrdil, že ho kruhový tvar benzenu napadl v roce 1865, když podřimoval u krbu a zdál se mu had, který si kouše vlastní ocas.' },
            { type: 'p', text: 'Všech šest vazeb $C-C$ je **stejně dlouhých** (139 pm), něco mezi jednoduchou (154 pm) a dvojnou (134 pm). Šest π-elektronů je totiž **delokalizovaných** nad celým kruhem, proto se benzen kreslí i jako šestiúhelník s kružnicí uvnitř.' },
            { type: 'keyterms', items: [
              { term: 'Aromatický systém', def: 'plochý cyklus s delokalizovanými π-elektrony, jako v benzenu jich bývá 6 (obecně $4n + 2$, tzv. Hückelovo pravidlo)' },
              { term: 'Areny', def: 'aromatické uhlovodíky, tedy uhlovodíky s benzenovým jádrem' },
              { term: 'Fenyl', def: 'skupina $C6H5-$, benzen bez jednoho vodíku' },
            ] },
            { type: 'compare', columns: [
              { title: 'Alken (cyklohexen)', icon: 'bond', tone: 'a', points: ['π-elektrony v jedné dvojné vazbě', 'elektrofilní **adice**', 'bromová voda se odbarví'] },
              { title: 'Benzen', icon: 'molecule', tone: 'b', points: ['6 delokalizovaných π-elektronů, mimořádně stabilní', 'elektrofilní **substituce**, kruh zůstane', 'bromovou vodu neodbarví'] },
            ], caption: 'Adice by aromatický systém zničila, a tak benzen reaguje **elektrofilní substitucí** ($S_{E}$): vodík na jádře se vymění za jinou skupinu.' },
            { type: 'reaction', equation: 'C6H6 + HNO3 -> C6H5NO2 + H2O', caption: 'nitrace benzenu nitrační směsí (koncentrovaná $HNO3$ + koncentrovaná $H2SO4$)' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'catalyst', title: 'Vznik elektrofilu', text: 'kyselina sírová pomůže z $HNO3$ vytvořit **nitroniový kation** $NO2^+$' },
              { icon: 'ion-plus', title: 'Útok na jádro', text: '$NO2^+$ se naváže na jeden uhlík; v kladném meziproduktu je aromaticita dočasně porušená' },
              { icon: 'arrow-cycle', title: 'Návrat aromaticity', text: 'z téhož uhlíku se odštěpí $H^+$ a elektrony se vrátí do kruhu' },
            ], caption: 'Vznikne **nitrobenzen** $C6H5NO2$: vodík na jádře nahradila nitroskupina $-NO2$.' },
            { type: 'reaction', equation: 'C6H6 + Br2 -> C6H5Br + HBr', caption: 'bromace benzenu, katalyzátor $FeBr3$: vzniká brombenzen (opět substituce, ne adice)' },
            { type: 'check', question: { kind: 'choice', q: 'Proč benzen neodbarví bromovou vodu, i když podle Kekulého vzorce má „tři dvojné vazby“?', options: [
              'Jeho π-elektrony jsou delokalizované a adice by zničila stabilní aromatický systém',
              'Benzen je nasycený uhlovodík',
              'Brom se v benzenu nerozpouští',
              'Benzen obsahuje jen jednoduché vazby dlouhé 154 pm',
            ], answer: 0, explain: 'Aromatický systém je tak stabilní, že benzen adici „odmítá“. S bromem reaguje jen za katalýzy $FeBr3$, a to substitucí.' } },
          ],
        },
        {
          title: 'Důležité areny a jejich rizika',
          icon: 'hazard',
          blocks: [
            { type: 'p', text: 'Na benzenové jádro lze navěsit další skupiny nebo k němu připojit další kruh. Tak vzniká rodina **arenů**.' },
            { type: 'molecule', molecules: ['toluene', 'naphthalene', 'styrene'], labels: ['toluen (methylbenzen)', 'naftalen $C10H8$', 'styren (vinylbenzen)'] },
            { type: 'iconlist', items: [
              { icon: 'beaker', title: 'Toluen $C6H5-CH3$', text: 'methylbenzen: rozpouštědlo barev a lepidel, surovina pro výbušninu TNT' },
              { icon: 'molecule', title: 'Xylen', text: 'dimethylbenzen: dvě methylové skupiny na jádře' },
              { icon: 'crystal', title: 'Naftalen $C10H8$', text: 'dva benzenové kruhy se společnou stranou; bílé krystaly s pronikavým pachem, dřív proti molům do skříní' },
              { icon: 'plastic-bottle', title: 'Styren $C6H5-CH=CH2$', text: 'vinylbenzen, surovina pro polystyren' },
            ] },
            { type: 'iconlist', items: [
              { icon: 'hazard', title: 'Benzen je karcinogen', text: 'poškozuje kostní dřeň a prokazatelně způsobuje leukemii' },
              { icon: 'flask', title: 'Náhrada toluenem', text: 'dřív běžné rozpouštědlo, dnes ho nahradil méně nebezpečný toluen' },
              { icon: 'gas-cloud', title: 'Polycyklické aromáty', text: 'několik spojených benzenových kruhů; vznikají při nedokonalém hoření (cigaretový kouř, výfuky, připálené maso z grilu). Benzo[a]pyren je silný karcinogen.' },
            ] },
            { type: 'callout', variant: 'warning', title: 'Benzen × benzin', text: 'Neplést si: benzen je čistá látka $C6H6$, benzin je směs uhlovodíků z ropy. Benzenu smí být v benzinu v EU nejvýš 1 % objemu.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Otestuj, co víš o alkenech, alkynech a arenech.' },
            { type: 'check', question: { kind: 'multi', q: 'Které látky patří mezi areny?', options: ['toluen', 'naftalen', 'cyklohexan', 'styren', 'hex-1-en'], answers: [0, 1, 3], explain: 'Toluen, naftalen i styren mají benzenové jádro. Cyklohexan je alicyklický a hex-1-en je obyčejný alken.' } },
            { type: 'check', question: { kind: 'tf', q: 'Benzin a benzen jsou dva názvy pro tutéž látku.', answer: false, explain: 'Benzen je jedna konkrétní aromatická látka $C6H6$. Benzin je palivo, směs hlavně alkanů $C5–C10$, benzenu smí obsahovat nejvýš 1 %.' } },
          ],
        },
      ],
      summary: [
        'Alkeny ($C_{n}H_{2n}$) mají dvojnou vazbu, alkyny ($C_{n}H_{2n-2}$) trojnou; názvy končí na -en a -yn.',
        'π-vazba je slabší a snadno dostupná, proto alkeny ochotně podléhají elektrofilní adici.',
        'Podle Markovnikovova pravidla jde vodík na uhlík, který už má víc vodíků, protože tak vzniká stabilnější karbokation.',
        'Bromová voda se s alkeny a alkyny odbarví, což dokazuje násobnou vazbu.',
        'Adiční polymerací alkenů vznikají plasty jako PE, PP, PVC, polystyren nebo teflon.',
        'Benzen má delokalizovaný aromatický systém, a proto podléhá elektrofilní substituci (nitrace, halogenace), ne adici.',
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
        { kind: 'tf', q: 'Polyethylen vzniká kondenzační polymerací ethenu, při které se odštěpuje voda.', answer: false, explain: 'Polyethylen vzniká adiční polymerací. Rozpojují se π-vazby a nic se neodštěpuje.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-4
    'l8-4': {
      id: 'l8-4',
      title: 'Halogenderiváty, alkoholy, fenoly a ethery',
      goals: [
        'Rozpoznat hlavní funkční skupiny a přiřadit je ke třídám organických sloučenin',
        'Pojmenovat halogenderiváty a alkoholy a určit, zda je alkohol primární, sekundární nebo terciární',
        'Vysvětlit vlastnosti alkoholů pomocí vodíkových můstků a popsat, proč je methanol tak nebezpečný',
        'Předpovědět produkt oxidace alkoholu a odlišit alkohol, fenol a ether',
      ],
      hook: 'Ethanol a methanol se liší jen o jednu skupinu $CH2$. Ethanol tě „jen“ opije, methanol tě může oslepit nebo zabít. Jak může tak malý rozdíl v molekule dělat tak velký rozdíl v těle?',
      sections: [
        {
          title: 'Funkční skupina: co dělá molekulu',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'Nahradíš-li v uhlovodíku vodík jiným atomem nebo skupinou, vznikne **derivát uhlovodíku**. Nová část je **funkční (charakteristická) skupina** a rozhoduje o tom, jak se látka chová. Uhlovodíkový zbytek je jen „nosič“: methanol, ethanol i propanol se chovají podobně, protože mají skupinu $-OH$ (obecně $R-OH$).' },
            { type: 'molecule', molecules: ['CH3Cl', 'ethanol', 'acetic-acid', 'methylamine'], labels: ['$-Cl$: halogenderivát', '$-OH$: alkohol', '$-COOH$: karboxylová kyselina', '$-NH2$: amin'], caption: 'Stejný „nosič“, jiná skupina, jiné chování' },
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
            { type: 'compare', columns: [
              { title: 'Přípona', icon: 'pencil', tone: 'a', points: ['jediná skupina v molekule: ethan**ol**', 'u více skupin jen ta nejdůležitější'] },
              { title: 'Předpona', icon: 'book', tone: 'b', points: ['ostatní skupiny, když jich je víc', 'halogeny a nitroskupina vždy jen předponou: chlor-, nitro-'] },
            ], caption: 'Předpona, nebo přípona?' },
            { type: 'game', gameId: 'functional-groups', text: 'Poznáš skupinu atomů a přiřadíš ji ke správné třídě? Vyzkoušej hru Funkční skupiny.' },
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
            { type: 'p', text: '**Halogenderiváty** vzniknou náhradou vodíku atomem halogenu. Halogen se v názvu vyjadřuje vždy předponou **fluor-, chlor-, brom-, jod-** s lokantem, více stejných halogenů dostane násobící předponu.' },
            { type: 'molecule', molecules: ['CH3Cl', 'vinyl-chloride', 'CCl2F2'], labels: ['chlormethan $CH3Cl$', 'chlorethen (vinylchlorid) $CH2=CHCl$, monomer PVC', 'dichlordifluormethan (freon) $CCl2F2$'] },
            { type: 'table', headers: ['Vzorec', 'Název', 'Poznámka'], rows: [
              ['$CH2Cl2$', 'dichlormethan', 'rozpouštědlo'],
              ['$CHCl3$', 'trichlormethan', 'chloroform'],
              ['$CH3-CHBr-CH3$', '2-brompropan', ''],
              ['$CF2=CF2$', 'tetrafluorethen', 'monomer teflonu'],
            ], caption: 'Další halogenderiváty' },
            { type: 'formula', text: '$C^{δ+}-X^{δ-}$', caption: 'vazba uhlík–halogen je polární, uhlík nese částečný kladný náboj' },
            { type: 'p', text: 'Halogen je elektronegativnější než uhlík, a tak je vazba $C-X$ **polární** a na kladně polarizovaném uhlíku stojí reaktivita halogenderivátů. S vodou se nemísí a ty s více halogeny bývají nehořlavé a těžší než voda.' },
            { type: 'callout', variant: 'fact', text: 'Teflon (PTFE) je tak nereaktivní a kluzký, že na něm skoro nic neulpí. Objevil ho v roce 1938 Roy Plunkett, když mu v tlakové lahvi s tetrafluorethenem samovolně vznikl bílý prášek.' },
            { type: 'p', text: '**Freony** (chlorfluorované uhlovodíky, CFC), např. $CCl2F2$, plnily ledničky a spreje: jsou nejedovaté, nehořlavé a velmi stálé. Právě proto vydrží tak dlouho, že vystoupají až do stratosféry.' },
            { type: 'diagram', id: 'ozone-layer', caption: 'Ozonová vrstva ve stratosféře pohlcuje většinu UV záření. UV záření z freonu odštěpí radikál chloru $Cl·$ a ten rozkládá ozon v cyklu $Cl· + O3 -> ClO· + O2$ a $ClO· + O -> Cl· + O2$, ve kterém se sám neustále obnovuje: jediný atom chloru zničí až 100 000 molekul ozonu.' },
            { type: 'callout', variant: 'fact', title: 'Montrealský protokol (1987)', text: 'Nad Antarktidou vznikla ozonová díra. Montrealský protokol výrobu freonů zakázal a díra by se měla zacelit kolem roku 2066.' },
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
          title: 'Substituce, nebo eliminace?',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Kladně polarizovaný uhlík láká částice s volným elektronovým párem nebo záporným nábojem, například $OH^-$. Takovým částicím říkáme **nukleofily** („milovníci jader“).' },
            { type: 'compare', columns: [
              { title: 'Nukleofilní substituce ($S_{N}$)', icon: 'drop', tone: 'a', points: ['vodný roztok $NaOH$, zahřívání', 'nukleofil $OH^-$ napadne uhlík a vytlačí halogen jako anion', 'z bromethanu vznikne **ethanol**'] },
              { title: 'Eliminace ($E$)', icon: 'heat', tone: 'b', points: ['horký roztok $KOH$ v **ethanolu** (ne ve vodě)', '$OH^-$ jako zásada utrhne proton ze sousedního uhlíku, odštěpí se $HX$', 'vznikne dvojná vazba $C=C$: z bromethanu **ethen**; opak adice'] },
            ] },
            { type: 'reaction', equation: 'C2H5Br + NaOH -> C2H5OH + NaBr', caption: 'substituce: halogen vystřídá skupina $-OH$ (iontově $CH3-CH2-Br + OH^- -> CH3-CH2-OH + Br^-$)' },
            { type: 'reaction', equation: 'C2H5Br + KOH -> C2H4 + KBr + H2O', caption: 'eliminace v horkém ethanolovém roztoku $KOH$: vzniká ethen' },
            { type: 'callout', variant: 'mascot', text: 'Stejná činidla, jiný výsledek! Voda a mírnější podmínky vedou k substituci, alkohol a horko k eliminaci. Mechanismy si pořádně rozebereme v poslední lekci.' },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne z 2-brompropanu v horkém ethanolovém roztoku $KOH$?', options: ['propen', 'propan-2-ol', 'propan', '2,2-dibrompropan'], answer: 0, explain: 'Horký ethanolový $KOH$ vede k eliminaci: odštěpí se $HBr$ a vznikne dvojná vazba, tedy propen.' } },
            { type: 'check', question: { kind: 'tf', q: 'Nukleofil je částice s nedostatkem elektronů, která napadá místa s vysokou elektronovou hustotou.', answer: false, explain: 'To je popis elektrofilu. Nukleofil má volný elektronový pár nebo záporný náboj a napadá kladně polarizovaný uhlík.' } },
          ],
        },
        {
          title: 'Alkoholy: stavba, názvy a vodíkové můstky',
          icon: 'glass',
          blocks: [
            { type: 'p', text: '**Alkoholy** mají **hydroxylovou skupinu** $-OH$ navázanou na uhlík s jednoduchými vazbami. Název tvoří přípona **-ol** s lokantem: methanol, ethanol, propan-1-ol, propan-2-ol, butan-2-ol.' },
            { type: 'molecule', molecules: ['methanol', 'ethanol', 'propan-2-ol'], labels: ['methanol $CH3OH$', 'ethanol $C2H5OH$', 'propan-2-ol'] },
            { type: 'compare', columns: [
              { title: 'Primární', tone: 'a', points: ['uhlík s $-OH$ nese 1 další uhlík', 'ethanol $CH3-CH2-OH$, propan-1-ol'] },
              { title: 'Sekundární', tone: 'b', points: ['uhlík s $-OH$ nese 2 další uhlíky', 'propan-2-ol $CH3-CH(OH)-CH3$, butan-2-ol'] },
              { title: 'Terciární', tone: 'c', points: ['uhlík s $-OH$ nese 3 další uhlíky', '2-methylpropan-2-ol'] },
            ], caption: 'Rozhoduje, na kolik dalších uhlíků je navázaný uhlík nesoucí $-OH$' },
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
            { type: 'table', headers: ['Látka', 'M (g/mol)', 'Teplota varu', 'Ve vodě'], rows: [
              ['propan $C3H8$', '44', '−42 °C', 'nerozpustný'],
              ['ethanol $C2H5OH$', '46', '78 °C', 'mísí se neomezeně'],
              ['butan-1-ol $C4H9OH$', '74', '118 °C', 'omezeně, asi 7 g ve 100 g vody'],
              ['hexan-1-ol $C6H13OH$', '102', '157 °C', 'téměř nerozpustný'],
            ], caption: 'Vodíkové můstky zvyšují teplotu varu, dlouhý řetězec snižuje rozpustnost' },
            { type: 'check', question: { kind: 'choice', q: 'Který alkohol je terciární?', options: ['2-methylpropan-2-ol', 'butan-2-ol', 'propan-1-ol', '2-methylpropan-1-ol'], answer: 0, explain: 'V 2-methylpropan-2-olu nese uhlík se skupinou $-OH$ tři methyly. Butan-2-ol je sekundární, propan-1-ol i 2-methylpropan-1-ol primární.' } },
            { type: 'check', question: { kind: 'tf', q: 'Ethanol má mnohem vyšší teplotu varu než propan hlavně díky vodíkovým můstkům.', answer: true, explain: 'Molární hmotnost mají skoro stejnou (46 a 44 g/mol), ale molekuly ethanolu drží pohromadě vodíkové můstky.' } },
          ],
        },
        {
          title: 'Významné alkoholy a jejich oxidace',
          icon: 'flask',
          blocks: [
            { type: 'p', text: '**Ethanol** vzniká **alkoholovým kvašením** cukrů pomocí kvasinek bez přístupu vzduchu. Kvasinky vydrží zhruba do 15 % alkoholu, silnější nápoje se proto destilují.' },
            { type: 'reaction', equation: 'C6H12O6 -> 2C2H5OH + 2CO2', caption: 'alkoholové kvašení glukosy' },
            { type: 'iconlist', items: [
              { icon: 'beaker', title: 'Rozpouštědlo' },
              { icon: 'gloves', title: 'Dezinfekce', text: 'nejlépe účinkuje asi 70% roztok' },
              { icon: 'fuel', title: 'Biopalivo', text: 'přidává se do benzinu' },
              { icon: 'warning', title: 'V těle', text: 'tlumí nervovou soustavu a zatěžuje játra; na kocovině se podílí i jedovatý oxidační produkt ethanal (acetaldehyd)' },
            ] },
            { type: 'table', headers: ['Alkohol', 'Oxidací vzniká', 'Příklad'], rows: [
              ['primární', 'aldehyd, dál karboxylová kyselina', 'ethanol -> ethanal -> kyselina octová'],
              ['sekundární', 'keton', 'propan-2-ol -> propanon (aceton)'],
              ['terciární', 'za mírných podmínek nic', '2-methylpropan-2-ol se nemění'],
            ], caption: 'V laboratoři i v těle se alkoholy **oxidují** (v laboratoři např. dichromanem draselným v kyselém prostředí). Co vznikne, záleží na typu alkoholu.' },
            { type: 'callout', variant: 'fact', title: 'Dechová zkouška', text: 'Staré detekční trubičky obsahovaly oranžový dichroman draselný $K2Cr2O7$. Ethanol z dechu ho zredukoval na zelené ionty $Cr^3+$: čím víc zelené, tím víc alkoholu. Dnešní přístroje měří elektrochemicky.' },
            { type: 'callout', variant: 'warning', title: 'Methanol zabíjí', text: '**Methanol** $CH3OH$ se od ethanolu liší jen o skupinu $CH2$, ale v těle je to prudký jed.' },
            { type: 'iconlist', items: [
              { icon: 'glass', title: 'Nerozeznáš ho', text: 'vypadá, voní i chutná jako ethanol' },
              { icon: 'enzyme', title: 'Zrádná oxidace', text: 'stejné enzymy ho oxidují na methanal (formaldehyd) a kyselinu mravenčí' },
              { icon: 'hazard', title: 'Slepota i smrt', text: 'ty ničí zrakový nerv a okyselují krev; asi 10 ml může způsobit trvalou slepotu, 30 ml i smrt' },
              { icon: 'pill', title: 'Protijed', text: 'překvapivě ethanol (nebo lék fomepizol): obsadí enzym a methanol se vyloučí nezměněný' },
            ] },
            { type: 'p', text: '**Glycerol** (propan-1,2,3-triol) je sladká, hustá a nejedovatá kapalina. Váže vlhkost, a proto je v krémech i zubních pastách. Je součástí tuků (úroveň 9) a jeho ester s kyselinou dusičnou, nitroglycerin, je výbušnina i lék na srdce.' },
            { type: 'check', question: { kind: 'number', q: 'Kolik gramů ethanolu nejvýš vznikne kvašením 360 g glukosy? ($M$(glukosa) = 180 g/mol, $M$(ethanol) = 46 g/mol)', answer: 184, unit: 'g', explain: '360 g glukosy je 2 mol. Z každého molu vzniknou 2 mol ethanolu, tedy 4 mol · 46 g/mol = 184 g.' } },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne oxidací propan-2-olu?', options: ['propanon (aceton)', 'propanal', 'kyselina propanová', 'propen'], answer: 0, explain: 'Propan-2-ol je sekundární alkohol, a ty se oxidují na ketony.' } },
          ],
        },
        {
          title: 'Fenoly a ethery',
          icon: 'test-tube',
          blocks: [
            { type: 'p', text: '**Fenoly** mají skupinu $-OH$ navázanou přímo na benzenové jádro. Nejjednodušší je **fenol** $C6H5OH$, bílá krystalická látka s typickým pachem.' },
            { type: 'molecule', molecules: ['phenol', 'diethyl-ether'], labels: ['fenol $C6H5OH$', 'diethylether $C2H5-O-C2H5$'] },
            { type: 'p', text: 'Fenol je **slabá kyselina**, mnohem silnější než alkoholy: s hydroxidem sodným dá sůl, fenolát sodný, což ethanol nedokáže. Záporný náboj fenolátu se totiž rozprostře do aromatického kruhu a tím se stabilizuje.' },
            { type: 'reaction', equation: 'C6H5OH + NaOH -> C6H5ONa + H2O', caption: 'fenol reaguje se zásadou na fenolát sodný' },
            { type: 'callout', variant: 'fact', text: 'Joseph Lister v roce 1867 začal na operačním sále dezinfikovat nástroje i rány roztokem fenolu (tehdy „kyselina karbolová“) a úmrtnost po operacích prudce klesla. Fenol je ale jedovatý a leptá kůži. Dnes se používají šetrnější fenoly, třeba thymol z tymiánu v ústních vodách.' },
            { type: 'p', text: '**Ethery** mají kyslík mezi dvěma uhlovodíkovými zbytky: $R-O-R′$. Nejznámější je **diethylether** (systematicky ethoxyethan) $CH3-CH2-O-CH2-CH3$.' },
            { type: 'compare', columns: [
              { title: 'Alkohol', icon: 'glass', tone: 'a', points: ['$-OH$ na uhlíku řetězce', 'vodíkové můstky: ethanol vře při 78 °C', 's vodným $NaOH$ prakticky nereaguje'] },
              { title: 'Fenol', icon: 'test-tube', tone: 'b', points: ['$-OH$ na benzenovém jádře', 'slabá kyselina', 's $NaOH$ tvoří fenolát'] },
              { title: 'Ether', icon: 'gas-cloud', tone: 'c', points: ['$R-O-R′$, bez vodíku na kyslíku', 'netvoří vodíkové můstky: diethylether vře už při 35 °C', 'kyselý vodík nemá vůbec'] },
            ] },
            { type: 'callout', variant: 'warning', text: 'Diethylether sloužil od roku 1846 jako jedno z prvních anestetik při operacích. Jeho páry jsou ale extrémně hořlavé a těžší než vzduch a při dlouhém stání na vzduchu v něm vznikají výbušné peroxidy. V laboratoři pracuj jen v digestoři a daleko od plamene.' },
            { type: 'check', question: { kind: 'multi', q: 'Které látky reagují s roztokem $NaOH$ na sůl?', options: ['fenol', 'ethanol', 'diethylether', 'kyselina octová'], answers: [0, 3], explain: 'Fenol i kyselina octová jsou kyseliny a se zásadou tvoří soli. Ethanol je tak slabá kyselina, že s vodným $NaOH$ prakticky nereaguje, a ether nemá kyselý vodík vůbec.' } },
          ],
        },
      ],
      summary: [
        'Funkční skupina určuje chování molekuly, uhlovodíkový zbytek $R$ je jen nosič.',
        'Halogenderiváty mají polární vazbu $C-X$; freony ničí ozon, z chlorethenu je PVC, z tetrafluorethenu teflon.',
        'Nukleofil ve vodném prostředí nahradí halogen (substituce), v horkém ethanolovém $KOH$ vzniká alken (eliminace).',
        'Alkoholy mají skupinu $-OH$ a příponu -ol; vodíkové můstky jim dávají vysoké teploty varu.',
        'Primární alkoholy se oxidují na aldehydy a kyseliny, sekundární na ketony, terciární za mírných podmínek vůbec.',
        'Methanol je prudce jedovatý, ethanol vzniká kvašením a glycerol je propan-1,2,3-triol.',
        'Fenol je slabá kyselina; ethery netvoří vodíkové můstky, a proto mají nízké teploty varu.',
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
        { kind: 'choice', q: 'Co vznikne zahříváním bromethanu s vodným roztokem $NaOH$?', options: ['ethanol', 'ethen', 'ethan', 'diethylether'], answer: 0, explain: 'Ve vodném prostředí převládá nukleofilní substituce: $OH^-$ nahradí brom a vznikne ethanol.' },
        { kind: 'number', q: 'Kolik gramů ethanolu vznikne úplným kvašením 90 g glukosy? ($M$: glukosa 180 g/mol, ethanol 46 g/mol)', answer: 46, unit: 'g', explain: '90 g glukosy je 0,5 mol, vznikne 1 mol ethanolu, tedy 46 g.' },
        { kind: 'tf', q: 'Diethylether má vyšší teplotu varu než ethanol, protože má větší molekulu.', answer: false, explain: 'Diethylether vře při 35 °C, ethanol při 78 °C. Etherům chybí vodík na kyslíku, takže netvoří vodíkové můstky.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-5
    'l8-5': {
      id: 'l8-5',
      title: 'Karbonylové sloučeniny, kyseliny a estery',
      goals: [
        'Pojmenovat aldehydy, ketony, karboxylové kyseliny a estery a nakreslit jejich vzorce',
        'Odlišit aldehyd od ketonu Tollensovým nebo Fehlingovým činidlem',
        'Vysvětlit kyselost karboxylových kyselin a zapsat esterifikaci jako rovnovážnou reakci',
        'Popsat hydrolýzu esterů a vznik mýdla',
      ],
      hook: 'Vůně banánu a ananasu, štiplavý ocet, odlakovač na nehty i mýdlo v koupelně. Všechny spojuje jedna skupina atomů: uhlík s dvojnou vazbou na kyslík. Pojď se podívat, co všechno dokáže.',
      sections: [
        {
          title: 'Aldehydy a ketony',
          icon: 'flask',
          blocks: [
            { type: 'p', text: '**Karbonylová skupina** $C=O$ je silně polární: elektronegativnější kyslík nese náboj $δ-$, uhlík $δ+$.' },
            { type: 'compare', columns: [
              { title: 'Aldehyd', tone: 'a', points: ['karbonyl **na konci řetězce**, nese vodík: skupina $-CHO$', 'přípona **-al**', 'ethanal $CH3CHO$'] },
              { title: 'Keton', tone: 'b', points: ['karbonyl **uvnitř řetězce** mezi dvěma uhlíky', 'přípona **-on**', 'propanon (aceton) $CH3COCH3$'] },
            ], caption: 'Uhlík karbonylu se do řetězce vždy počítá.' },
            { type: 'molecule', molecules: ['formaldehyde', 'acetaldehyde', 'acetone'], labels: ['methanal (formaldehyd)', 'ethanal (acetaldehyd)', 'propanon (aceton)'] },
            { type: 'structure', art: s`
      O                  O
      ‖                  ‖
CH3 — C — H        CH3 — C — CH3`, caption: 'Ethanal (aldehyd, vlevo) a propanon neboli aceton (keton, vpravo)' },
            { type: 'iconlist', items: [
              { icon: 'tree', title: 'Methanal $HCHO$', text: 'formaldehyd: formalín, pryskyřice, dřevotřísky' },
              { icon: 'glass', title: 'Ethanal $CH3CHO$', text: 'acetaldehyd: meziprodukt odbourávání alkoholu' },
              { icon: 'sugar', title: 'Benzaldehyd $C6H5CHO$', text: 'vůně mandlí a marcipánu' },
              { icon: 'drop', title: 'Propanon $CH3COCH3$', text: 'aceton: odlakovač, rozpouštědlo' },
              { icon: 'beaker', title: 'Butanon $CH3COCH2CH3$', text: 'methylethylketon: rozpouštědlo lepidel a barev' },
            ] },
            { type: 'p', text: 'Aldehydy a ketony jsou polární, ale netvoří vodíkové můstky (nemají vodík na kyslíku). Teploty varu mají proto mezi alkany a alkoholy: propanal vře při 48 °C, butan při −1 °C a propan-1-ol při 97 °C, při skoro stejné molární hmotnosti.' },
            { type: 'callout', variant: 'warning', title: 'Formaldehyd', text: 'Methanal je štiplavý plyn a jeho asi 37% vodný roztok, **formalín**, se používá ke konzervaci biologických preparátů. Formaldehyd je ale karcinogenní a dráždí oči i dýchací cesty. Uvolňuje se i z levného nábytku z dřevotřísky, proto nový nábytek dobře větrej.' },
            { type: 'callout', variant: 'fact', text: 'Aceton vzniká i v tvém těle, když dlouho hladovíš nebo při neléčené cukrovce. Tělo pak spaluje hlavně tuky a vznikají tzv. ketolátky. Dech může nasládle vonět po acetonu.' },
            { type: 'check', question: { kind: 'text', q: 'Napiš systematický název látky $CH3-CH2-CHO$.', accept: ['propanal'], explain: 'Tři uhlíky včetně uhlíku skupiny $-CHO$ a přípona -al: propanal.' } },
            { type: 'check', question: { kind: 'choice', q: 'Která látka je keton?', options: ['$CH3-CO-CH2-CH3$', '$CH3-CH2-CHO$', '$CH3-CH2-COOH$', '$CH3-O-CH2-CH3$'], answer: 0, explain: 'Keton má skupinu $C=O$ uvnitř řetězce, mezi dvěma uhlíky. Jde o butanon. Ostatní jsou aldehyd, kyselina a ether.' } },
          ],
        },
        {
          title: 'Důkaz aldehydů a nukleofilní adice',
          icon: 'test-tube',
          blocks: [
            { type: 'p', text: 'Aldehydy se snadno **oxidují** na karboxylové kyseliny, jsou tedy **redukční činidla**. Ketony se za mírných podmínek neoxidují, a na tom stojí dvě klasické zkoušky.' },
            { type: 'compare', columns: [
              { title: 'Tollensova zkouška', icon: 'ring', tone: 'a', points: ['amoniakální roztok $AgNO3$ s ionty $[Ag(NH3)2]^+$', 'aldehyd: na stěně zkumavky se vyloučí **stříbrné zrcátko** $Ag$', 'keton: beze změny'] },
              { title: 'Fehlingova zkouška', icon: 'burner', tone: 'b', points: ['modrý roztok s ionty $Cu^2+$', 'aldehyd: vznikne **cihlově červená** sraženina $Cu2O$', 'keton: zůstane modrý'] },
            ], caption: 'Zkoušky na aldehydy (obě se provádějí za zahřátí)' },
            { type: 'formula', text: '$R-CHO -> R-COOH$', caption: 'aldehyd se oxiduje na kyselinu, činidlo se přitom redukuje: $Ag^{I} -> Ag^{0}$, $Cu^{II} -> Cu^{I}$' },
            { type: 'callout', variant: 'warning', text: 'Stříbrné zrcátko je krásný pokus, ale Tollensovo činidlo se vždy připravuje čerstvé a po pokusu se hned zlikviduje. Stáním z něj mohou vzniknout výbušné sloučeniny stříbra. Pracuj s ochrannými brýlemi.' },
            { type: 'p', text: 'Druhou typickou reakcí karbonylu je **nukleofilní adice** ($A_{N}$): uhlík $δ+$ láká nukleofily.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'ion-minus', title: 'Útok nukleofilu', text: '$Nu^-$ napadne kladně polarizovaný uhlík $C^{δ+}$' },
              { icon: 'electron', title: 'Elektrony na kyslík', text: 'elektrony π-vazby $C=O$ se přesunou na kyslík a vznikne $O^-$' },
              { icon: 'ion-plus', title: 'Protonace', text: 'kyslík přijme proton $H^+$ z okolí a vznikne skupina $-OH$' },
            ], caption: 'Z $C=O$ vznikne uhlík nesoucí $-OH$ i $-Nu$. Takto se k aldehydům aduje třeba kyanovodík nebo alkoholy; adice skupiny $-OH$ na aldehydovou skupinu uzavírá do kruhu i molekuly cukrů (úroveň 9).' },
            { type: 'p', text: '**Redukcí** (adicí vodíku) se aldehydy mění zpátky na primární alkoholy a ketony na sekundární alkoholy. Je to přesný opak oxidace z minulé lekce.' },
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
            { type: 'structure', art: s`
      O
      ‖
CH3 — C — O — H`, caption: 'Kyselina ethanová (octová) $CH3COOH$' },
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
            { type: 'reaction', equation: 'CH3COOH + H2O <=> CH3COO^- + H3O^+', caption: 'kyselina octová je slabá kyselina, p$K_{A}$ ≈ 4,8' },
            { type: 'p', text: 'Se zásadami tvoří soli, **karboxyláty**: z kyseliny octové a $NaOH$ vznikne ethanoát sodný (octan sodný). Jsou silnější než kyselina uhličitá, takže vytěsní $CO2$ z uhličitanů i hydrogenuhličitanů.' },
            { type: 'reaction', equation: 'CH3COOH + NaHCO3 -> CH3COONa + H2O + CO2', caption: 'bezpečný domácí pokus: ocet + jedlá soda šumí' },
            { type: 'callout', variant: 'remember', text: 'Pořadí kyselosti: ==alkohol < fenol < karboxylová kyselina==. Ethanol s $NaOH$ nereaguje, fenol ano, ale jen karboxylová kyselina je dost silná na to, aby vytěsnila $CO2$ z jedlé sody.' },
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
            { type: 'example', title: 'Esterifikace krok za krokem', problem: 'Jaký ester vznikne z kyseliny octové a methanolu a jak se jmenuje?', steps: [
              'Kyselina odštěpí celou skupinu $-OH$, alkohol jen vodík ze své skupiny $-OH$. Chemici to dokázali alkoholem s izotopem $^{18}O$: ten skončil v esteru, ne ve vodě.',
              'Skupina $-OH$ a vodík dají dohromady vodu $H2O$.',
              'Zbytek kyseliny $CH3CO-$ a zbytek alkoholu $-OCH3$ se spojí: $CH3COOCH3$.',
              'Název: nejdřív alkyl z alkoholu (**methyl**), spojovník a pak anion kyseliny (kyselina ethanová dá **ethanoát**).',
            ], answer: '**Methyl-ethanoát** (methylacetát) $CH3COOCH3$' },
            { type: 'p', text: 'Rovnováha leží zhruba uprostřed: ze stejného látkového množství kyseliny a alkoholu vzniknou jen asi 2/3 esteru. Výtěžek zvýšíš podle Le Chatelierova principu nadbytkem alkoholu nebo odebíráním vody, kterou navíc sama váže koncentrovaná $H2SO4$.' },
            { type: 'table', headers: ['Ester', 'Vůně nebo použití'], rows: [
              ['ethyl-ethanoát', 'ovocná vůně, typická pro odlakovače'],
              ['3-methylbutyl-ethanoát', 'banán'],
              ['ethyl-butanoát', 'ananas'],
              ['oktyl-ethanoát', 'pomeranč'],
              ['methyl-salicylát', 'hřejivá mast na svaly'],
            ], caption: 'Estery, které potkáš' },
            { type: 'callout', variant: 'fact', text: 'Umělé ovocné aroma v bonbonech bývá jen jeden nebo pár esterů. Skutečná vůně jahody se ale skládá ze stovek látek, a proto „jahodová“ žvýkačka nikdy nevoní úplně jako jahoda.' },
            { type: 'check', question: { kind: 'text', q: 'Pojmenuj ester $HCOOCH2CH3$, který vzniká z kyseliny methanové a ethanolu.', accept: ['ethyl-methanoát', 'ethylmethanoát', 'ethyl methanoát', 'ethyl-formiát', 'ethylformiát'], explain: 'Alkyl z alkoholu je ethyl, anion kyseliny methanové je methanoát: ethyl-methanoát (ethylformiát).' } },
            { type: 'check', question: { kind: 'tf', q: 'Esterifikace je nevratná reakce, takže z kyseliny a alkoholu vždy vznikne 100 % esteru.', answer: false, explain: 'Esterifikace je rovnovážná. Bez zásahu vznikají zhruba 2/3 esteru, víc jen s nadbytkem alkoholu nebo odebíráním vody.' } },
          ],
        },
        {
          title: 'Hydrolýza esterů, mýdla a deriváty kyselin',
          icon: 'soap',
          blocks: [
            { type: 'p', text: 'Opakem esterifikace je **hydrolýza** esteru: voda ester rozštěpí zpět na kyselinu a alkohol.' },
            { type: 'compare', columns: [
              { title: 'V kyselém prostředí', icon: 'equilibrium', tone: 'a', points: ['ester + voda ⇌ kyselina + alkohol', '**vratná** stejně jako esterifikace'] },
              { title: 'V zásaditém prostředí', icon: 'soap', tone: 'b', points: ['s $NaOH$ nebo $KOH$', '**nevratná**: vzniklá kyselina se hned zneutralizuje na karboxylát a ten už s alkoholem nereaguje'] },
            ] },
            { type: 'reaction', equation: 'CH3COOC2H5 + NaOH -> CH3COONa + C2H5OH', caption: 'alkalická hydrolýza ethyl-ethanoátu' },
            { type: 'p', text: 'Tuky jsou estery glycerolu s mastnými kyselinami. Varem s louhem ($NaOH$) vznikne glycerol a sodné soli mastných kyselin, tedy **mýdlo**, a proto se alkalické hydrolýze esterů říká **zmýdelnění**. Sodná mýdla jsou tuhá, draselná mazlavá.' },
            { type: 'diagram', id: 'micelle', caption: 'Jak mýdlo myje: anion mýdla má **hydrofilní** (vodu milující) hlavičku $-COO^-$ a dlouhý **hydrofobní** uhlovodíkový ocas. Ocasy se zanoří do mastnoty, hlavičky zůstanou ve vodě, mastnota se uzavře do drobné kuličky, **micely**, a voda ji spláchne.' },
            { type: 'table', headers: ['Derivát', 'Skupina', 'Příklad'], rows: [
              ['ester', '$-COO-R$', 'ethyl-ethanoát $CH3COOC2H5$'],
              ['amid', '$-CONH2$', 'ethanamid $CH3CONH2$'],
              ['acylhalogenid', '$-COCl$', 'acetylchlorid $CH3COCl$'],
              ['anhydrid', '$-CO-O-CO-$', 'acetanhydrid $(CH3CO)2O$'],
            ], caption: 'Funkční deriváty karboxylových kyselin: skupina $-OH$ z karboxylu je nahrazená jinou skupinou' },
            { type: 'callout', variant: 'fact', text: 'Acetanhydrid se používá k výrobě kyseliny acetylsalicylové, účinné látky známých léků proti bolesti a horečce. I ta je ester: kyselina octová se v ní váže na fenolovou skupinu $-OH$ kyseliny salicylové.' },
            { type: 'game', gameId: 'functional-groups', text: 'Aldehyd, keton, kyselina, nebo ester? Procvič si je ve hře Funkční skupiny.' },
            { type: 'check', question: { kind: 'choice', q: 'Co vznikne varem tuku s roztokem $NaOH$?', options: ['glycerol a mýdlo (sodné soli mastných kyselin)', 'glycerol a volné mastné kyseliny', 'ester a voda', 'ethanol a octan sodný'], answer: 0, explain: 'Zásada ester rozštěpí nevratně: z tuku vznikne glycerol a karboxyláty mastných kyselin, tedy mýdlo.' } },
          ],
        },
      ],
      summary: [
        'Karbonylová skupina $C=O$ je polární; aldehydy ($-CHO$, přípona -al) ji mají na konci řetězce, ketony (přípona -on) uvnitř.',
        'Aldehydy jsou redukční: s Tollensovým činidlem dávají stříbrné zrcátko, s Fehlingovým červený $Cu2O$. Ketony ne.',
        'Na karbonylový uhlík $δ+$ se adují nukleofily (nukleofilní adice).',
        'Karboxylové kyseliny ($-COOH$) jsou slabé, ale silnější než fenoly a alkoholy a vytěsní $CO2$ z uhličitanů.',
        'Esterifikace kyseliny s alkoholem je vratná; ester se jmenuje alkyl-alkanoát, např. ethyl-ethanoát.',
        'Alkalická hydrolýza esterů je nevratná; zmýdelněním tuků vzniká glycerol a mýdlo.',
      ],
      quiz: [
        { kind: 'match', q: 'Přiřaď vzorec k systematickému názvu.', pairs: [
          ['$CH3CHO$', 'ethanal'],
          ['$CH3COCH3$', 'propanon'],
          ['$CH3COOH$', 'kyselina ethanová'],
          ['$CH3COOCH3$', 'methyl-ethanoát'],
        ], explain: 'Aldehyd končí na -al, keton na -on, kyselina na -ová a ester má tvar alkyl-alkanoát.' },
        { kind: 'tf', q: 'Aldehydy se snadno oxidují, a proto dávají pozitivní Fehlingovu zkoušku.', answer: true, explain: 'Aldehyd se oxiduje na kyselinu a přitom zredukuje $Cu^2+$ na červený $Cu2O$.' },
        { kind: 'choice', q: 'Čím rozlišíš propanal a propanon?', options: ['Tollensovým činidlem', 'bromovou vodou', 'univerzálním indikátorem', 'roztokem $NaCl$'], answer: 0, explain: 'Propanal jako aldehyd vyloučí stříbrné zrcátko, keton propanon ne. Obě látky jsou neutrální a nemají dvojnou vazbu $C=C$.' },
        { kind: 'text', q: 'Doplň rovnici esterifikace: kyselina + alkohol ⇌ ester + …', accept: ['voda', 'H2O'], explain: 'Při esterifikaci se odštěpí molekula vody ze skupiny $-OH$ kyseliny a vodíku alkoholu.' },
        { kind: 'order', q: 'Seřaď látky podle kyselosti od nejslabší po nejsilnější.', items: ['ethanol', 'fenol', 'kyselina octová', 'kyselina chlorovodíková'], explain: 'Ethanol je prakticky neutrální, fenol je velmi slabá kyselina, kyselina octová slabá a $HCl$ silná kyselina.' },
        { kind: 'multi', q: 'Jak zvýšíš výtěžek esterifikace?', options: [
          'přidáš nadbytek alkoholu',
          'budeš odebírat vzniklou vodu',
          'přidáš víc vody',
          'přidáš koncentrovanou $H2SO4$, která váže vodu',
          'přidáš hydroxid sodný',
        ], answers: [0, 1, 3], explain: 'Podle Le Chatelierova principu pomůže nadbytek výchozí látky nebo odebírání produktu. Voda by rovnováhu posunula zpět a $NaOH$ by ester hydrolyzoval.' },
        { kind: 'number', q: 'Kolik atomů uhlíku má molekula ethyl-butanoátu?', answer: 6, explain: 'Butanoát dává 4 uhlíky a ethyl 2, dohromady 6: $CH3CH2CH2COOCH2CH3$.' },
        { kind: 'tf', q: 'Alkalická hydrolýza esteru je vratná stejně jako esterifikace.', answer: false, explain: 'V zásaditém prostředí se kyselina hned mění na karboxylát, který s alkoholem nereaguje. Reakce proto doběhne až do konce.' },
      ],
    },

    // ─────────────────────────────────────────────────────────────── l8-6
    'l8-6': {
      id: 'l8-6',
      title: 'Dusíkaté deriváty, reakční mechanismy a polymery',
      goals: [
        'Pojmenovat jednoduché aminy, amidy a nitrosloučeniny a vysvětlit zásaditost aminů',
        'Rozlišit radikál, elektrofil a nukleofil a zařadit reakci podle typu a mechanismu',
        'Porovnat adiční a kondenzační polymeraci na příkladech PE, PVC, nylonu a PET',
        'Číst recyklační kódy plastů a vysvětlit problém mikroplastů',
      ],
      hook: 'Pach rybiny, výbušnina TNT, nylonová bunda i PET lahev. Na první pohled nemají nic společného, ale všechny vysvětlíš pomocí funkčních skupin a několika typů reakcí. Poslední lekce úrovně, jdeme na to!',
      sections: [
        {
          title: 'Aminy: organické zásady',
          icon: 'fish',
          blocks: [
            { type: 'p', text: '**Aminy** si představ jako amoniak $NH3$, ve kterém jsou vodíky nahrazené uhlovodíkovými zbytky. Podle počtu uhlíků navázaných na **dusík** jsou **primární** ($R-NH2$), **sekundární** ($R2NH$) a **terciární** ($R3N$).' },
            { type: 'structure', art: s`
      H                   CH3
      |                   |
CH3 — N — H         CH3 — N — CH3`, caption: 'Methylamin (primární amin) a trimethylamin (terciární amin)' },
            { type: 'callout', variant: 'warning', title: 'Pozor na rozdíl', text: 'U alkoholů rozhoduje, kolik uhlíků nese **uhlík** se skupinou $-OH$. U aminů počítáš uhlíky navázané přímo na **dusík**. Třeba $(CH3)3C-NH2$ má dusík na terciárním uhlíku, a přesto je to primární amin.' },
            { type: 'p', text: 'Názvy tvoříme přidáním **-amin** k názvu uhlovodíkového zbytku: methylamin $CH3NH2$, dimethylamin $(CH3)2NH$, trimethylamin $(CH3)3N$, ethylamin $CH3CH2NH2$. Aromatický **anilin** (fenylamin) $C6H5NH2$ je surovina pro výrobu barviv.' },
            { type: 'molecule', molecules: ['NH3', 'methylamine'], labels: ['amoniak $NH3$', 'methylamin $CH3NH2$'], caption: 'Jeden vodík amoniaku vystřídal methyl, volný elektronový pár na dusíku zůstal' },
            { type: 'p', text: 'Volným elektronovým párem dusík přijme proton. Aminy jsou proto **zásady** podle Brønsteda (úroveň 5), stejně jako amoniak, a jednoduché alkylaminy jsou dokonce o něco silnější zásady než on.' },
            { type: 'formula', text: '$CH3NH2 + H2O <=> CH3NH3^+ + OH^-$', caption: 'methylamin ve vodě: vznikne methylamoniový kation a roztok je zásaditý' },
            { type: 'reaction', equation: 'CH3NH2 + HCl -> CH3NH3Cl', caption: 's kyselinou vznikne sůl, methylamonium-chlorid $CH3NH3^+ Cl^-$' },
            { type: 'callout', variant: 'fact', title: 'Proč se ryba zakapává citronem', text: 'Pach rybiny způsobuje hlavně trimethylamin. Kyselina citronová ho převede na sůl, která netěká, a zápach zmizí. Podobně páchnou i aminy z rozkladu bílkovin: putrescin a kadaverin (doslova „mrtvolin“).' },
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
            { type: 'p', text: '**Amidy** jsou deriváty karboxylových kyselin, v nichž je $-OH$ z karboxylu nahrazené skupinou $-NH2$. Název dostanou koncovkou **-amid**: methanamid (formamid) $HCONH2$, ethanamid (acetamid) $CH3CONH2$.' },
            { type: 'structure', art: s`
      O
      ‖
CH3 — C — NH2`, caption: 'Ethanamid (acetamid)' },
            { type: 'compare', columns: [
              { title: 'Amin', icon: 'fish', tone: 'a', points: ['$R-NH2$', 'volný pár dusíku ochotně přijme proton', '**zásaditý**'] },
              { title: 'Amid', icon: 'protein', tone: 'b', points: ['$R-CONH2$', 'volný pár je „zaměstnaný“ sousední skupinou $C=O$', 'prakticky **neutrální**', 'amidová vazba $-CO-NH-$ drží bílkoviny (peptidová vazba, úroveň 9) i nylon'] },
            ] },
            { type: 'p', text: '**Nitrosloučeniny** mají skupinu $-NO2$ navázanou přímo na uhlík a v názvu předponu **nitro-**.' },
            { type: 'molecule', molecules: ['urea', 'nitrobenzene'], labels: ['močovina $CO(NH2)2$', 'nitrobenzen $C6H5NO2$'] },
            { type: 'iconlist', items: [
              { icon: 'flask', title: 'Močovina', text: 'diamid kyseliny uhličité; právě jí Wöhler v roce 1828 odstartoval organickou chemii' },
              { icon: 'blood', title: 'Močovina v těle', text: 'tělo se v ní zbavuje dusíku z bílkovin' },
              { icon: 'fertilizer', title: 'Hnojivo', text: 'nejpoužívanější dusíkaté hnojivo, obsahuje 46 % dusíku' },
              { icon: 'hazard', title: 'Nitrobenzen', text: 'jedovatá kapalina, voní po hořkých mandlích; jeho redukcí se vyrábí anilin' },
            ] },
            { type: 'formula', text: '$C6H2(NO2)3CH3$', caption: '2,4,6-trinitrotoluen (TNT): toluen se třemi nitroskupinami na benzenovém jádře' },
            { type: 'callout', variant: 'fact', title: 'TNT a nitroglycerin', text: '**TNT** je překvapivě stabilní: dá se tavit, odlévat do tvarů a bez rozbušky nevybuchne. **Nitroglycerin** naopak vybuchne i při otřesu. A pozor na název: nitroglycerin není nitrosloučenina, ale ester glycerolu s kyselinou dusičnou (glycerol-trinitrát), protože skupiny $-NO2$ jsou v něm vázané přes kyslík.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď vzorec k názvu.', pairs: [
              ['$CH3NH2$', 'methylamin'],
              ['$CH3CONH2$', 'ethanamid'],
              ['$C6H5NO2$', 'nitrobenzen'],
              ['$C6H5NH2$', 'anilin'],
            ], explain: '$-NH2$ na uhlovodíkovém zbytku je amin, $-CONH2$ amid a $-NO2$ nitroskupina.' } },
          ],
        },
        {
          title: 'Činidla a typy reakcí: velký přehled',
          icon: 'idea',
          blocks: [
            { type: 'p', text: 'Za celou úroveň jsi potkal spoustu reakcí. Roztřídíš je podle dvou otázek: **Co se s molekulou děje?** (typ reakce) a **jaká částice útočí?** (mechanismus).' },
            { type: 'compare', columns: [
              { title: 'Homolytické štěpení', icon: 'sun', tone: 'a', points: ['každý atom si vezme jeden elektron z vazby', 'vzniknou **radikály**', 'typicky za světla nebo za vysoké teploty'] },
              { title: 'Heterolytické štěpení', icon: 'ion-plus', tone: 'b', points: ['oba elektrony si vezme jeden atom', 'vzniknou **ionty**'] },
            ] },
            { type: 'compare', columns: [
              { title: 'Radikál', icon: 'electron', tone: 'a', points: ['částice s nepárovým elektronem', '$Cl·$, $Br·$, $·CH3$'] },
              { title: 'Elektrofil', icon: 'ion-plus', tone: 'b', points: ['nedostatek elektronů', 'hledá místa bohatá na elektrony: π-vazbu, benzenové jádro', '$H^+$, $NO2^+$, polarizovaná molekula $Br2$'] },
              { title: 'Nukleofil', icon: 'ion-minus', tone: 'c', points: ['volný elektronový pár nebo záporný náboj', 'hledá kladně polarizovaný uhlík', '$OH^-$, $CN^-$, $H2O$, $NH3$'] },
            ], caption: 'Tři druhy činidel' },
            { type: 'compare', columns: [
              { title: 'Substituce ($S$)', tone: 'a', points: ['jeden atom nebo skupina se vymění za jinou'] },
              { title: 'Adice ($A$)', tone: 'b', points: ['dvě molekuly se spojí v jednu a zanikne násobná vazba'] },
              { title: 'Eliminace ($E$)', tone: 'c', points: ['z molekuly se odštěpí malá molekula a vznikne násobná vazba'] },
            ], caption: 'Čtvrtým typem je **přesmyk**: atomy uvnitř molekuly se přeskupí a vznikne izomer, např. butan se v rafinerii mění na 2-methylpropan.' },
            { type: 'table', headers: ['Reakce', 'Typ', 'Mechanismus', 'Příklad'], rows: [
              ['halogenace alkanů', 'substituce', 'radikálový ($Cl·$)', '$CH4 + Cl2 -> CH3Cl + HCl$'],
              ['adice na alkeny', 'adice', 'elektrofilní ($H^+$, $Br2$)', '$CH2=CH2 + HBr -> CH3CH2Br$'],
              ['nitrace benzenu', 'substituce', 'elektrofilní ($NO2^+$)', '$C6H6 + HNO3 -> C6H5NO2 + H2O$'],
              ['halogenderivát + hydroxid', 'substituce', 'nukleofilní ($OH^-$)', '$CH3CH2Br + OH^- -> CH3CH2OH + Br^-$'],
              ['adice na karbonyl', 'adice', 'nukleofilní ($CN^-$)', '$CH3CHO + HCN -> CH3CH(OH)CN$'],
              ['odštěpení $HBr$', 'eliminace', 'zásada ($OH^-$) za horka', '$CH3CH2Br -> CH2=CH2 + HBr$'],
            ], caption: 'Souhrn reakcí z celé úrovně' },
            { type: 'example', title: 'Jak zařadit reakci', problem: 'Urči typ a mechanismus reakce $CH2=CH-CH3 + Br2 -> CH2Br-CHBr-CH3$.', steps: [
              'Ze dvou molekul vznikla jedna a zmizela dvojná vazba: jde o **adici**.',
              'Činidlo útočí na π-elektrony, tedy na místo bohaté na elektrony. Molekula $Br2$ se u dvojné vazby polarizuje na $Br^{δ+}-Br^{δ-}$ a kladný konec se chová jako **elektrofil**.',
              'Vazby se štěpí heterolyticky, vznikají ionty, ne radikály.',
            ], answer: '**Elektrofilní adice** ($A_{E}$), vzniká 1,2-dibrompropan.' },
            { type: 'callout', variant: 'tip', title: 'Tři otázky ke každé reakci', text: 'Co zmizelo a co přibylo? Kde má molekula přebytek a kde nedostatek elektronů? Kdo koho napadá? Násobné vazby a benzenové jádro lákají elektrofily, uhlík $δ+$ vedle halogenu nebo kyslíku láká nukleofily.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: kolik reakcí a činidel správně zařadíš za 60 sekund?' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď částici k typu činidla.', pairs: [
              ['$Cl·$', 'radikál'],
              ['$NO2^+$', 'elektrofil'],
              ['$CN^-$', 'nukleofil'],
            ], explain: '$Cl·$ má nepárový elektron, $NO2^+$ je kladný a hledá elektrony, $CN^-$ má záporný náboj a volný elektronový pár.' } },
            { type: 'check', question: { kind: 'choice', q: 'Jakého typu je reakce $CH3-CH2-OH -> CH2=CH2 + H2O$ (dehydratace ethanolu kyselinou sírovou za horka)?', options: ['eliminace', 'adice', 'substituce', 'přesmyk'], answer: 0, explain: 'Z molekuly se odštěpila malá molekula (voda) a vznikla dvojná vazba, to je eliminace.' } },
          ],
        },
        {
          title: 'Polymery: adiční a kondenzační',
          icon: 'factory',
          blocks: [
            { type: 'p', text: '**Polymery** jsou obří molekuly složené z tisíců opakujících se jednotek. Podle toho, jak vznikají, rozlišujeme dva hlavní typy polymerace.' },
            { type: 'compare', columns: [
              { title: 'Adiční polymerace', icon: 'bond', tone: 'a', points: ['monomer má dvojnou vazbu $C=C$', 'vedlejší produkt: žádný', 'vazba v řetězci: $C-C$', 'PE, PP, PVC, PS, teflon'] },
              { title: 'Kondenzační polymerace', icon: 'droplets', tone: 'b', points: ['monomer má dvě funkční skupiny, např. $-COOH$ a $-OH$ nebo $-NH2$', 'odštěpí se malá molekula, obvykle $H2O$', 'vazba v řetězci: esterová nebo amidová', 'polyestery (PET), polyamidy (nylon)'] },
            ], caption: 'Dva způsoby, jak postavit polymer' },
            { type: 'p', text: '**Nylon 6,6** vzniká z hexan-1,6-diaminu a kyseliny hexandiové (adipové). Aminoskupina jednoho monomeru reaguje s karboxylem druhého, odštěpí se voda a vznikne **amidová vazba**. Každý monomer má skupiny na obou koncích, takže řetězec může růst oběma směry.' },
            { type: 'structure', art: s`
       O            O
       ‖            ‖
[ NH — C — (CH2)4 — C — NH — (CH2)6 ]n`, caption: 'Opakující se jednotka nylonu 6,6: dvě amidové vazby $-CO-NH-$. Čísla 6,6 udávají počet uhlíků v obou monomerech.' },
            { type: 'p', text: '**PET** (polyethylentereftalát) je **polyester** z ethan-1,2-diolu a kyseliny tereftalové (benzen-1,4-dikarboxylové), mezi kterými se tvoří esterové vazby. Dělají se z něj lahve na nápoje i fleecové oblečení.' },
            { type: 'structure', art: s`
      O          O
      ‖          ‖
[ O — C — C6H4 — C — O — CH2 — CH2 ]n`, caption: 'Opakující se jednotka PET: dvě esterové skupiny $-CO-O-$' },
            { type: 'callout', variant: 'fact', text: 'Nylon vyvinul Wallace Carothers ve firmě DuPont ve 30. letech 20. století. Když se v roce 1940 v USA začaly prodávat nylonové punčochy, ženy na ně stály dlouhé fronty a během pár dní se jich prodaly miliony párů.' },
            { type: 'check', question: { kind: 'choice', q: 'Která dvojice monomerů může dát polyester?', options: ['ethan-1,2-diol a kyselina tereftalová', 'ethen a propen', 'hexan-1,6-diamin a kyselina adipová', 'chlorethen a styren'], answer: 0, explain: 'Polyester vzniká z diolu a dikarboxylové kyseliny. Diamin s dikyselinou dá polyamid a alkeny polymerují adičně.' } },
            { type: 'check', question: { kind: 'tf', q: 'Při kondenzační polymeraci se kromě polymeru uvolňuje malá molekula, nejčastěji voda.', answer: true, explain: 'Proto se jí říká kondenzační: při každém spojení dvou monomerů se odštěpí třeba voda.' } },
          ],
        },
        {
          title: 'Plasty, recyklace a mikroplasty',
          icon: 'recycle',
          blocks: [
            { type: 'compare', columns: [
              { title: 'Termoplasty', icon: 'heat', tone: 'good', points: ['teplem měknou a dají se znovu tvarovat', 'PE, PP, PET, PVC', 'recyklovat se dají hlavně ony'] },
              { title: 'Reaktoplasty', icon: 'cross', tone: 'bad', points: ['řetězce propojené pevnými příčnými vazbami', 'teplem už nezměknou', 'bakelit, epoxidové pryskyřice'] },
            ], caption: 'Dvě skupiny plastů podle chování v teple' },
            { type: 'diagram', id: 'plastic-lifecycle', caption: 'Život plastu: z ropy přes monomer a polymer k výrobku. Po použití recyklace, spalovna, skládka, nebo rozpad na mikroplasty, které končí v oceánu. Dole recyklační kódy 1–7.' },
            { type: 'table', headers: ['Kód', 'Zkratka', 'Plast', 'Typické výrobky'], rows: [
              ['1', 'PET', 'polyethylentereftalát', 'lahve od nápojů'],
              ['2', 'HDPE (PE-HD)', 'polyethylen o vysoké hustotě', 'lahve od drogerie, kanystry'],
              ['3', 'PVC', 'polyvinylchlorid', 'trubky, okna, podlahy'],
              ['4', 'LDPE (PE-LD)', 'polyethylen o nízké hustotě', 'sáčky, fólie'],
              ['5', 'PP', 'polypropylen', 'kelímky od jogurtů, víčka'],
              ['6', 'PS', 'polystyren', 'tácky, pěnový polystyren'],
              ['7', 'O', 'ostatní plasty a směsi', 'např. polykarbonát, PLA'],
            ], caption: 'Recyklační kódy najdeš v trojúhelníku ze šipek na obalu' },
            { type: 'iconlist', items: [
              { icon: 'recycle', title: 'Žlutý kontejner', text: 'sem patří plasty' },
              { icon: 'plastic-bottle', title: 'Sešlápni a vylij', text: 'lahve sešlápni a vylij z nich zbytky' },
              { icon: 'star', title: 'Nejlépe čisté PET', text: 'vznikají z něj vlákna i nové lahve' },
              { icon: 'arrow-cycle', title: 'Každá recyklace ubere', text: 'řetězce se zkracují a plast se trochu zhorší' },
              { icon: 'leaf', title: 'Nejlepší plastový odpad', text: 'je ten, který vůbec nevznikne' },
            ] },
            { type: 'callout', variant: 'warning', title: 'Nepal plasty', text: 'Při hoření PVC vzniká leptavý chlorovodík a jedovaté dioxiny. Plasty proto nikdy nepal v kamnech ani na zahradě.' },
            { type: 'p', text: '**Mikroplasty** jsou kousky plastu menší než 5 mm, které vznikají hlavně třemi cestami (viz níže). Najdeme je v oceánech, v pitné vodě i v lidské krvi a vědci teprve zjišťují, co v těle způsobují.' },
            { type: 'iconlist', items: [
              { icon: 'plastic-bottle', title: 'Rozpad odpadu' },
              { icon: 'car', title: 'Oděr pneumatik' },
              { icon: 'soap', title: 'Praní syntetického oblečení' },
            ] },
            { type: 'callout', variant: 'fact', text: 'Existují i **biodegradovatelné** plasty, třeba polyester kyselina polymléčná (PLA) vyráběná z kukuřičného škrobu. Rozloží se ale jen v průmyslové kompostárně za vyšší teploty, ne v lese ani v moři.' },
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
        'Aminy jsou deriváty amoniaku; volný elektronový pár na dusíku z nich dělá zásady.',
        'Amidy ($-CONH2$) jsou prakticky neutrální; amidová vazba drží pohromadě bílkoviny i nylon.',
        'Nitrosloučeniny mají skupinu $-NO2$ na uhlíku (nitrobenzen, TNT); nitroglycerin je ester.',
        'Radikály vznikají homolýzou, elektrofily hledají elektrony, nukleofily kladně polarizovaný uhlík.',
        'Reakce dělíme na substituce, adice, eliminace a přesmyky.',
        'Adiční polymerace spojuje alkeny bez vedlejšího produktu, kondenzační odštěpuje malou molekulu (polyamidy, polyestery).',
        'Recyklační kódy 1–7 označují druh plastu; mikroplasty menší než 5 mm jsou vážný ekologický problém.',
      ],
      quiz: [
        { kind: 'choice', q: 'Která z látek je nejsilnější zásada?', options: ['methylamin', 'ethanamid', 'fenol', 'kyselina octová'], answer: 0, explain: 'Methylamin má volný pár na dusíku. U ethanamidu je pár „zaměstnaný“ skupinou $C=O$, fenol a kyselina octová jsou kyseliny.' },
        { kind: 'tf', q: 'Nitroglycerin je z chemického hlediska nitrosloučenina, stejně jako TNT.', answer: false, explain: 'V nitroglycerinu jsou skupiny $-NO2$ vázané přes kyslík, je to ester kyseliny dusičné (glycerol-trinitrát). V TNT jsou vázané přímo na uhlík.' },
        { kind: 'match', q: 'Přiřaď reakci k jejímu mechanismu.', pairs: [
          ['$CH4 + Cl2 -> CH3Cl + HCl$ (za světla)', 'radikálová substituce'],
          ['$CH2=CH2 + Br2 -> CH2BrCH2Br$', 'elektrofilní adice'],
          ['$C6H6 + HNO3 -> C6H5NO2 + H2O$', 'elektrofilní substituce'],
          ['$CH3Br + OH^- -> CH3OH + Br^-$', 'nukleofilní substituce'],
        ], explain: 'Světlo a alkan znamenají radikály, dvojná vazba láká elektrofily k adici, benzen podléhá substituci a $OH^-$ je nukleofil.' },
        { kind: 'multi', q: 'Které polymery vznikají kondenzační polymerací?', options: ['nylon', 'PET', 'polyethylen', 'PVC', 'polystyren'], answers: [0, 1], explain: 'Nylon (polyamid) a PET (polyester) vznikají za odštěpení vody. PE, PVC a PS vznikají adiční polymerací alkenů.' },
        { kind: 'text', q: 'Jak se zkratkou nazývá plast s recyklačním kódem 1?', accept: ['PET', 'polyethylentereftalát'], explain: 'Kód 1 patří PET, ze kterého jsou lahve na nápoje.' },
        { kind: 'number', q: 'Řetězec polyethylenu má 5 000 opakujících se jednotek $-CH2-CH2-$. Jaká je jeho přibližná molární hmotnost v g/mol? ($M$(C) = 12, $M$(H) = 1)', answer: 140000, unit: 'g/mol', explain: 'Jedna jednotka $C2H4$ má 28 g/mol, tedy 5 000 · 28 = 140 000 g/mol.' },
        { kind: 'choice', q: 'Jak se nazývá částice s volným elektronovým párem, která napadá kladně polarizovaný uhlík?', options: ['nukleofil', 'elektrofil', 'radikál', 'katalyzátor'], answer: 0, explain: 'Nukleofil („milovník jader“) je bohatý na elektrony a hledá místo s kladným nábojem.' },
        { kind: 'tf', q: 'Reaktoplasty lze teplem opakovaně roztavit a znovu tvarovat.', answer: false, explain: 'To umí termoplasty. Reaktoplasty mají řetězce propojené příčnými vazbami a teplem se spíš rozloží, než aby změkly.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── boss
  boss: [
    { kind: 'text', q: 'Pojmenuj alken $CH2=C(CH3)-CH2-CH3$.', accept: ['2-methylbut-1-en', '2 methylbut 1 en', '2-methyl-1-buten', '2-methylbuten-1'], explain: 'Hlavní řetězec s dvojnou vazbou má 4 uhlíky. Číslujeme od konce u dvojné vazby, takže ta dostane lokant 1 a methyl lokant 2.' },
    { kind: 'text', q: 'Pojmenuj alkan $CH3-CH2-CH(CH3)-CH2-CH(CH2CH3)-CH3$. Pozor na hlavní řetězec!', accept: ['3,5-dimethylheptan', '3,5 dimethylheptan', '3, 5-dimethylheptan'], explain: 'Nejdelší řetězec vede přes ethylovou skupinu a má 7 uhlíků. Methyly pak leží na C3 a C5: jde o stejnou látku jako 3,5-dimethylheptan.' },
    { kind: 'number', q: 'Kolik konstitučních izomerů má alkan $C5H12$?', answer: 3, explain: 'Pentan, 2-methylbutan a 2,2-dimethylpropan.' },
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
    { kind: 'number', q: 'Kolik molů kyslíku spotřebuje dokonalé hoření 1 mol oktanu $C8H18$?', answer: 12.5, tolerance: 0.01, unit: 'mol', explain: '$2C8H18 + 25O2 -> 16CO2 + 18H2O$, na 1 mol oktanu tedy připadá 12,5 mol $O2$.' },
    { kind: 'multi', q: 'Které dvojice látek jsou izomery?', options: [
      'butan-1-ol a diethylether',
      'propanal a propanon',
      'ethanol a ethanal',
      'cyklohexan a hex-1-en',
      'butan a buta-1,3-dien',
    ], answers: [0, 1, 3], explain: 'Stejný vzorec mají $C4H10O$, $C3H6O$ a $C6H12$. Ethanal ($C2H4O$) má o dva vodíky méně než ethanol a butadien ($C4H6$) o čtyři méně než butan.' },
    { kind: 'choice', q: 'Která látka obsahuje chirální uhlík a existuje ve dvou enantiomerech?', options: ['2-brombutan', '2-brompropan', '1-brombutan', '2-methylpropan-2-ol'], answer: 0, explain: 'V 2-brombutanu nese uhlík C2 čtyři různé skupiny: $H$, $Br$, $CH3$ a $CH2CH3$. Ostatní látky mají na každém uhlíku aspoň dvě stejné skupiny.' },
  ],
}

export default level
