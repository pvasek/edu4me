import type { LevelContent, Lesson, Question } from '../../../core/types'

/* ------------------------------------------------------------------ */
/* l5-1 Kyseliny a jejich názvosloví                                   */
/* ------------------------------------------------------------------ */

const l51: Lesson = {
  id: 'l5-1',
  title: 'Kyseliny a jejich názvosloví',
  goals: [
    'Vysvětlit, co je kyselina podle Arrhenia, a zapsat její disociaci ve vodě',
    'Pojmenovat bezkyslíkaté i kyslíkaté kyseliny podle oxidačního čísla',
    'Odvodit vzorec kyslíkaté kyseliny z jejího názvu dvěma způsoby',
    'Bezpečně ředit kyseliny a vysvětlit, jak vznikají kyselé deště',
  ],
  hook: 'Citron, ocet, cola i tvůj žaludek mají něco společného: kyselinu. Ta v žaludku by pomalu rozpustila i železný hřebík, jiná zase dělá bublinky v limonádě. Jak je poznat a jak se jim říká?',
  sections: [
    {
      title: 'Co dělá kyselinu kyselinou',
      icon: 'lemon',
      blocks: [
        {
          type: 'iconlist',
          items: [
            { icon: 'lemon', title: 'Chutnají kysele', text: 'ocet, citron, šťovík… V laboratoři ale nikdy nic neochutnávej!' },
            { icon: 'cabbage', title: 'Mění barvu indikátorů', text: 'výluh z červeného zelí zčervená' },
            { icon: 'gas-cloud', title: 'S neušlechtilými kovy uvolňují vodík', text: 'zinek nebo železo -> bublinky $H2$' },
            { icon: 'bulb', title: 'Vedou elektrický proud', text: 'jejich vodné roztoky obsahují ionty' },
          ],
        },
        {
          type: 'p',
          text: 'Proč se chovají tak podobně? Podle švédského chemika Svante **Arrhenia** ==kyselina je látka, která ve vodě uvolňuje vodíkové kationty $H^+$.== Rozpadu látky na ionty ve vodě se říká **elektrolytická disociace**.',
        },
        { type: 'formula', text: '$HCl -> H^+ + Cl^-$', caption: 'disociace chlorovodíku ve vodě (zjednodušený zápis)' },
        {
          type: 'p',
          text: 'Holý proton $H^+$ ve vodě nevydrží. Okamžitě se naváže na volný elektronový pár kyslíku v molekule vody a vznikne **oxoniový kation** $H3O^+$. Přesnější zápis je proto:',
        },
        { type: 'formula', text: '$HCl + H2O -> H3O^+ + Cl^-$' },
        {
          type: 'particles',
          boxes: [
            { label: 'chlorovodík a voda', items: [{ species: 'HCl', count: 3 }, { species: 'H2O', count: 6 }], state: 'solution' },
            { label: 'kyselina chlorovodíková', items: [{ species: 'H3O+', count: 3 }, { species: 'Cl^-', count: 3 }, { species: 'H2O', count: 3 }], state: 'solution' },
          ],
          arrows: true,
          caption: 'Každá molekula $HCl$ předá proton molekule vody: vzniknou $H3O^+$ a $Cl^-$.',
        },
        { type: 'molecule', molecules: ['H2O', 'H3O+'], labels: ['voda', 'oxoniový kation $H3O^+$'] },
        {
          type: 'p',
          text: 'Zbytek po odtržení vodíku je **anion kyseliny**, tady $Cl^-$. Víc vodíků odevzdává kyselina postupně: $H2SO4 -> H^+ + HSO4^-$, potom $HSO4^- <=> H^+ + SO4^2-$ (druhý krok neproběhne úplně).',
        },
        { type: 'molecule', molecules: ['H2SO4', 'SO4^2-'], labels: ['kyselina sírová', 'síranový anion'], caption: 'Po odtržení obou vodíků zbude z $H2SO4$ anion $SO4^2-$.' },
        {
          type: 'keyterms',
          items: [
            { term: 'kyselina (podle Arrhenia)', def: 'látka, která ve vodném roztoku uvolňuje kationty $H^+$' },
            { term: 'oxoniový kation', def: '$H3O^+$, molekula vody s navázaným protonem; nositel kyselosti roztoků' },
            { term: 'elektrolytická disociace', def: 'rozpad látky na ionty působením rozpouštědla (vody)' },
            { term: 'anion kyseliny', def: 'částice, která zbude po odtržení $H^+$, např. $Cl^-$, $NO3^-$, $SO4^2-$' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Kyselou chuť citronu ti prozradí právě ionty $H3O^+$, na které reagují receptory na jazyku. Proto chutnají všechny kyseliny kysele, ať jde o ocet, nebo o šťovík.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který ion vzniká podle Arrhenia ve vodném roztoku každé kyseliny?',
            options: ['$H3O^+$', '$OH^-$', '$Cl^-$', '$Na^+$'],
            answer: 0,
            explain: 'Kyselina uvolňuje $H^+$, který se ve vodě hned naváže na molekulu vody a vznikne oxoniový kation $H3O^+$. Anion $Cl^-$ vzniká jen z $HCl$.',
          },
        },
      ],
    },
    {
      title: 'Bezkyslíkaté kyseliny',
      icon: 'gas-cloud',
      blocks: [
        {
          type: 'p',
          text: 'Nejjednodušší kyseliny obsahují jen vodík a jeden nekov. Tyto **bezkyslíkaté kyseliny** jsou vodné roztoky plynů, třeba chlorovodíku $HCl$ nebo fluorovodíku $HF$.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'gas-cloud', title: 'Plyn', text: 'chlorovodík $HCl$' },
            { icon: 'drop', title: 'Rozpustit ve vodě', text: 'vznikne vodný roztok' },
            { icon: 'book', title: 'Název', text: '**kyselina** + chlorovodík + **-ová**' },
            { icon: 'flask', title: 'Kyselina', text: '**kyselina chlorovodíková**' },
          ],
          caption: 'Název bezkyslíkaté kyseliny = kyselina + název vodíkaté sloučeniny + koncovka -ová.',
        },
        { type: 'molecule', molecules: ['HCl', 'HF', 'H2S'], labels: ['chlorovodík', 'fluorovodík', 'sulfan'] },
        {
          type: 'table',
          headers: ['Vzorec', 'Plyn', 'Kyselina (vodný roztok)', 'Kde ji potkáš'],
          rows: [
            ['$HF$', 'fluorovodík', 'kyselina fluorovodíková', 'leptání skla'],
            ['$HCl$', 'chlorovodík', 'kyselina chlorovodíková (solná)', 'žaludek, čištění kovů'],
            ['$HBr$', 'bromovodík', 'kyselina bromovodíková', 'chemická výroba'],
            ['$HI$', 'jodovodík', 'kyselina jodovodíková', 'chemická výroba'],
            ['$H2S$', 'sulfan (sirovodík)', 'kyselina sulfanová (sirovodíková)', 'zkažená vejce, sopky'],
            ['$HCN$', 'kyanovodík', 'kyselina kyanovodíková', 'prudký jed'],
          ],
          caption: 'Mezi bezkyslíkaté kyseliny se řadí i $HCN$, přestože obsahuje dva nekovy.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Technická kyselina chlorovodíková (asi 35%) se prodává pod tradičním názvem **kyselina solná**. Oba názvy jsou správně.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Kyselina fluorovodíková je výjimečně zrádná. Proniká kůží, váže vápník z tkání a kostí a bolest se často ozve až za několik hodin. Leptá i sklo, proto se uchovává v plastových lahvích.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jak se jmenuje vodný roztok bromovodíku $HBr$?',
            accept: ['kyselina bromovodíková', 'bromovodíková'],
            explain: 'Kyselina + bromovodík + koncovka -ová: kyselina bromovodíková.',
          },
        },
      ],
    },
    {
      title: 'Kyslíkaté kyseliny: od vzorce k názvu',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: '**Kyslíkaté kyseliny** (oxokyseliny) obsahují vodík, kyslík a jeden **centrální atom**, obvykle nekovu. Ve vzorci je pořadí vodík – centrální atom – kyslík: $H2SO4$, $HNO3$, $H3PO4$.',
        },
        { type: 'molecule', molecules: ['H2SO4', 'HNO3', 'H3PO4'], labels: ['kyselina sírová', 'kyselina dusičná', 'kyselina fosforečná'], caption: 'Centrální atom (S, N, P) obklopují kyslíky, vodíky sedí na kyslících.' },
        {
          type: 'p',
          text: 'Koncovka názvu prozradí **oxidační číslo centrálního atomu**. Koncovky znáš z oxidů, jen místo -ý je -á, protože kyselina je „ona“.',
        },
        {
          type: 'table',
          headers: ['Oxidační číslo', 'Koncovka', 'Příklad', 'Vzorec'],
          rows: [
            ['I', '-ná', 'kyselina chlorná', '$HClO$'],
            ['II', '-natá', '(u oxokyselin vzácné)', '–'],
            ['III', '-itá', 'kyselina dusitá', '$HNO2$'],
            ['IV', '-ičitá', 'kyselina siřičitá, uhličitá', '$H2SO3$, $H2CO3$'],
            ['V', '-ičná, -ečná', 'kyselina dusičná, chlorečná', '$HNO3$, $HClO3$'],
            ['VI', '-ová', 'kyselina sírová', '$H2SO4$'],
            ['VII', '-istá', 'kyselina chloristá, manganistá', '$HClO4$, $HMnO4$'],
            ['VIII', '-ičelá', '(vzácné)', '–'],
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Koncovky podle oxidačního čísla I–VIII: **-ná, -natá, -itá, -ičitá, -ičná/-ečná, -ová, -istá, -ičelá**. Je to stejná řada jako u oxidů.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'molecule', title: 'Vzorec', text: '$HNO3$' },
            { icon: 'calculator', title: 'Součet oxidačních čísel = 0', text: '$H^{I}$, $O^{-II}$: +1 + x − 6 = 0' },
            { icon: 'atom', title: 'Oxidační číslo', text: 'x = +5, dusík V' },
            { icon: 'book', title: 'Koncovka', text: 'V -> -ičná: **kyselina dusičná**' },
          ],
          caption: 'Od vzorce k názvu: oxidační číslo centrálního atomu dopočítáš tak, aby součet v molekule byl nula.',
        },
        {
          type: 'example',
          problem: 'Pojmenuj kyselinu $H2SO3$.',
          steps: [
            'Vodík: 2 · (+1) = +2. Kyslík: 3 · (−2) = −6.',
            '+2 + x − 6 = 0, takže x = +4.',
            'Síra má oxidační číslo IV -> koncovka -ičitá.',
          ],
          answer: '$H2SO3$ je **kyselina siřičitá**.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj kyselinu $HClO4$.',
            accept: ['kyselina chloristá', 'chloristá'],
            explain: '+1 + x − 8 = 0, chlor má oxidační číslo VII a tomu odpovídá koncovka -istá.',
          },
        },
      ],
    },
    {
      title: 'Od názvu ke vzorci',
      icon: 'pencil',
      blocks: [
        {
          type: 'p',
          text: 'Opačný směr je v testech nejčastější. Máš dva spolehlivé postupy se stejným výsledkem, vyber si ten, který ti sedí víc.',
        },
        { type: 'h', text: 'Postup 1: oxid + voda' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Koncovka', text: '-ová -> síra VI' },
            { icon: 'gas-cloud', title: 'Oxid', text: 'oxid sírový $SO3$' },
            { icon: 'drop', title: 'Přičti vodu', text: '$SO3 + H2O$' },
            { icon: 'flask', title: 'Kyselina', text: '$H2SO4$' },
          ],
          caption: 'Oxid nekovu se stejným oxidačním číslem + $H2O$. Jsou-li všechny počty atomů sudé, vyděl je dvěma.',
        },
        { type: 'reaction', equation: 'SO3 + H2O -> H2SO4', caption: 'oxid sírový + voda -> kyselina sírová' },
        {
          type: 'example',
          problem: 'Odvoď vzorec kyseliny dusičné.',
          steps: [
            'Koncovka -ičná -> dusík má oxidační číslo V, oxid dusičný je $N2O5$.',
            'Sečti atomy v $N2O5 + H2O$: 2 H, 2 N, 6 O.',
            'Všechny počty jsou sudé, vyděl je dvěma: 1 H, 1 N, 3 O.',
            'Vyčíslená rovnice: $N2O5 + H2O -> 2HNO3$.',
          ],
          answer: '$HNO3$',
        },
        { type: 'h', text: 'Postup 2: počítání vodíků a kyslíků' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Oxidační číslo', text: 'urči ho z koncovky' },
            { icon: 'ion-plus', title: 'Počet H', text: '**liché** číslo -> 1 H, **sudé** -> 2 H' },
            { icon: 'calculator', title: 'Počet O', text: '(oxidační číslo + počet H) : 2' },
            { icon: 'check', title: 'Kontrola', text: 'součet oxidačních čísel = 0' },
          ],
        },
        {
          type: 'example',
          problem: 'Odvoď vzorec kyseliny chloristé.',
          steps: [
            'Koncovka -istá -> chlor VII. To je liché číslo, takže 1 H.',
            'Počet O = (7 + 1) : 2 = 4.',
            'Kontrola: +1 + 7 + 4 · (−2) = 0.',
          ],
          answer: '$HClO4$',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Výjimka, kterou musíš znát',
          text: 'Podle pravidla by kyselina fosforečná ($P^{V}$) měla vzorec $HPO3$. Běžná kyselina fosforečná z coly nebo z hnojiv má ale tři vodíky: $H3PO4$, přesným názvem **kyselina trihydrogenfosforečná**.',
        },
        { type: 'reaction', equation: 'P2O5 + 3H2O -> 2H3PO4', caption: 'oxid fosforečný + tři molekuly vody -> kyselina fosforečná' },
        { type: 'game', gameId: 'naming', text: 'Procvič si převody název ↔ vzorec v Názvoslovném trenažéru. Po pár kolech ti kyseliny půjdou samy.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec kyseliny uhličité.',
            accept: ['H2CO3'],
            caseSensitive: true,
            placeholder: 'např. H2SO4',
            explain: 'Uhlík IV je sudé číslo -> 2 H; O = (4 + 2) : 2 = 3. Nebo z oxidu: $CO2 + H2O -> H2CO3$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec kyseliny dusité.',
            accept: ['HNO2'],
            caseSensitive: true,
            placeholder: 'např. H2SO4',
            explain: 'Dusík III je liché číslo -> 1 H; O = (3 + 1) : 2 = 2. Vzorec je $HNO2$.',
          },
        },
      ],
    },
    {
      title: 'Důležité kyseliny a bezpečnost',
      icon: 'hazard',
      blocks: [
        {
          type: 'p',
          text: 'Koncentrované kyseliny jsou **žíravé**: poškozují kůži, oči i oblečení. Koncentrovaná kyselina chlorovodíková a dusičná navíc uvolňují dráždivé výpary, proto se s nimi pracuje v **digestoři**.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'stomach', title: 'chlorovodíková (solná) $HCl$', text: 'bezbarvá, štiplavé výpary, koncentrovaná asi 35 %; žaludeční šťáva, čištění kovů, výroba PVC' },
            { icon: 'battery', title: 'sírová $H2SO4$', text: 'olejovitá, koncentrovaná 96 %, odnímá vodu (zuhelnatí cukr); autobaterie, hnojiva, chemická výroba' },
            { icon: 'explosion', title: 'dusičná $HNO3$', text: 'koncentrovaná asi 65 %, silně oxiduje, barví kůži žlutě; hnojiva, výbušniny, barviva' },
            { icon: 'glass', title: 'fosforečná $H3PO4$', text: 'zředěná je poměrně bezpečná; cola (E338), odrezovače, hnojiva' },
            { icon: 'plastic-bottle', title: 'uhličitá $H2CO3$', text: 'existuje jen ve vodě, rozpadá se na $CO2$ a vodu; sycené nápoje, minerálky' },
            { icon: 'lemon', title: 'octová a citronová', text: 'přírodní organické kyseliny z octa a citronů; jejich vzorce přijdou na řadu v úrovni 8' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Kyselina sírová je nejvyráběnější chemikálií na světě, ročně jí vznikne přes 250 milionů tun. Podle její spotřeby se kdysi dokonce odhadovala vyspělost průmyslu celé země.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'goggles', title: 'Brýle a rukavice', text: 'nasaď je dřív, než otevřeš lahev' },
            { icon: 'beaker', title: 'Nejdřív voda', text: 'do kádinky nalij vodu' },
            { icon: 'drop', title: 'Potom kyselina', text: 'lij ji pomalu, za stálého míchání' },
            { icon: 'heat', title: 'Hlídej teplo', text: 'roztok se silně zahřívá' },
          ],
          caption: 'Ředění koncentrované kyseliny: *nejdřív voda, potom kyselina*.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nejdřív voda, potom kyselina!',
          text: 'Při ředění koncentrované kyseliny, hlavně sírové, se uvolňuje velké teplo. Kdybys lil vodu do kyseliny, voda by se na povrchu okamžitě vařila a vystříkla i s kyselinou. Proto vždy lij **kyselinu do vody**.',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'První pomoc',
          text: 'Při potřísnění kyselinou sundej zasažený oděv a oplachuj kůži velkým množstvím vody aspoň 15 minut. Oko vyplachuj proudem vody a hned k lékaři. Neutralizovat kyselinu na kůži zásadou nezkoušej, reakce hřeje a poškození zhorší.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Při ředění koncentrované kyseliny sírové se lije voda do kyseliny.',
            answer: false,
            explain: 'Je to naopak: nejdřív voda, potom kyselina. Kyselina se lije pomalu do vody, jinak by se voda prudce vařila a rozstřikovala.',
          },
        },
      ],
    },
    {
      title: 'Kyselé deště',
      icon: 'rain',
      blocks: [
        {
          type: 'p',
          text: 'I úplně čistý déšť je mírně kyselý: rozpouští se v něm oxid uhličitý ze vzduchu a vzniká slabá kyselina uhličitá. Takový déšť má pH asi 5,6 (co je pH, se dozvíš v lekci 5-3).',
        },
        { type: 'reaction', equation: 'CO2 + H2O <=> H2CO3', caption: 'oxid uhličitý + voda ⇌ kyselina uhličitá' },
        {
          type: 'p',
          text: '**Kyselé deště** jsou mnohem kyselejší. Způsobuje je hlavně oxid siřičitý $SO2$ ze spalování uhlí, které obsahuje síru, a oxidy dusíku ($NO$, $NO2$) z motorů a elektráren. Ve vzduchu se mění na kyseliny.',
        },
        { type: 'diagram', id: 'acid-rain', caption: 'Od komína a výfuku ke kyselému dešti: oxidy síry a dusíku se v oblacích mění na kyseliny.' },
        { type: 'reaction', equation: 'SO2 + H2O -> H2SO3', caption: 'vzniká kyselina siřičitá' },
        { type: 'reaction', equation: '2SO2 + O2 -> 2SO3', caption: 'a potom $SO3 + H2O -> H2SO4$ (kyselina sírová)' },
        { type: 'reaction', equation: '4NO2 + O2 + 2H2O -> 4HNO3', caption: 'vzniká kyselina dusičná' },
        {
          type: 'iconlist',
          items: [
            { icon: 'fish', title: 'Jezera', text: 'okyselená voda hubí ryby a jiné živočichy' },
            { icon: 'leaf', title: 'Půda', text: 'kyselá půda poškozuje kořeny stromů' },
            { icon: 'tree', title: 'Lesy', text: 'poškozené jehličí a usychající stromy' },
            { icon: 'mountain', title: 'Vápenec a mramor', text: 'rozpouštějí se sochy i fasády' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'V 70. a 80. letech 20. století odumřely vlivem kyselých dešťů rozsáhlé lesy v Krušných a Jizerských horách. Oblasti na pomezí Česka, Německa a Polska se říkalo „Černý trojúhelník“. Po odsíření elektráren v 90. letech se lesy postupně vracejí.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'factory', title: 'Spaliny z elektrárny', text: 'obsahují $SO2$' },
            { icon: 'powder', title: 'Suspenze vápence', text: 'zachytí oxid siřičitý' },
            { icon: 'crystal', title: 'Sádrovec', text: 'vznikne jako produkt' },
            { icon: 'recycle', title: 'Sádrokarton', text: 'ze sádrovce se vyrábí desky na stavby' },
          ],
          caption: 'Odsíření elektrárny. Na oxidy dusíku z aut zase působí katalyzátor ve výfuku.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které plyny přispívají ke vzniku kyselých dešťů?',
            options: ['$SO2$', '$NO2$', '$N2$', '$CH4$', '$SO3$'],
            answers: [0, 1, 4],
            explain: 'Oxidy síry a dusíku tvoří s vodou kyseliny siřičitou, sírovou a dusičnou. Dusík $N2$ je nereaktivní a metan je skleníkový plyn, kyselinu netvoří.',
          },
        },
      ],
    },
  ],
  summary: [
    'Kyselina podle Arrhenia uvolňuje ve vodě kationty $H^+$, které se hned mění na oxoniové kationty $H3O^+$.',
    'Bezkyslíkaté kyseliny se jmenují podle vodíkaté sloučeniny: $HCl$ je kyselina chlorovodíková.',
    'Koncovka kyslíkaté kyseliny udává oxidační číslo centrálního atomu: -ná, -natá, -itá, -ičitá, -ičná/-ečná, -ová, -istá, -ičelá.',
    'Vzorec odvodíš z oxidu a vody, nebo počítáním: liché oxidační číslo 1 H, sudé 2 H, počet O = (oxidační číslo + H) : 2.',
    'Kyselina fosforečná je výjimka s vzorcem $H3PO4$.',
    'Při ředění vždy platí: nejdřív voda, potom kyselina.',
    'Kyselé deště vznikají hlavně z $SO2$ a oxidů dusíku ze spalování.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Jaké oxidační číslo má síra v kyselině siřičité?',
      options: ['IV', 'VI', 'II', 'III'],
      answer: 0,
      explain: 'Koncovka -ičitá odpovídá oxidačnímu číslu IV: $H2SO3$, 2 + 4 − 6 = 0.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj kyselinu $HClO$.',
      accept: ['kyselina chlorná', 'chlorná'],
      explain: '+1 + x − 2 = 0, chlor má I, koncovka -ná: kyselina chlorná.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec kyseliny bromičné.',
      accept: ['HBrO3'],
      caseSensitive: true,
      placeholder: 'např. H2SO4',
      explain: 'Koncovka -ičná -> brom V, liché číslo -> 1 H; O = (5 + 1) : 2 = 3. Vzorec je $HBrO3$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec kyseliny manganisté.',
      accept: ['HMnO4'],
      caseSensitive: true,
      placeholder: 'např. H2SO4',
      explain: 'Koncovka -istá -> mangan VII, liché -> 1 H; O = (7 + 1) : 2 = 4. Vzorec je $HMnO4$.',
    },
    {
      kind: 'match',
      q: 'Přiřaď ke vzorci název kyseliny.',
      pairs: [
        ['$H2SO4$', 'kyselina sírová'],
        ['$HNO2$', 'kyselina dusitá'],
        ['$H3PO4$', 'kyselina fosforečná'],
        ['$H2S$', 'kyselina sulfanová'],
        ['$HF$', 'kyselina fluorovodíková'],
      ],
      explain: 'Kyslíkaté kyseliny pojmenuješ podle oxidačního čísla (S VI -ová, N III -itá, P V -ečná), bezkyslíkaté podle vodíkaté sloučeniny.',
    },
    {
      kind: 'tf',
      q: 'Kyselina fosforečná má ve vzorci tři atomy vodíku, přestože podle pravidla o lichém oxidačním čísle bychom čekali jen jeden.',
      answer: true,
      explain: 'Běžná kyselina fosforečná je $H3PO4$ (trihydrogenfosforečná). Je to výjimka, kterou je potřeba si zapamatovat.',
    },
    {
      kind: 'tf',
      q: 'Úplně čistá dešťová voda bez znečištění je přesně neutrální.',
      answer: false,
      explain: 'I čistý déšť rozpouští $CO2$ ze vzduchu a vzniká slabá kyselina uhličitá, takže má pH asi 5,6.',
    },
    {
      kind: 'multi',
      q: 'Které zápisy správně popisují chování chlorovodíku ve vodě?',
      options: ['$HCl + H2O -> H3O^+ + Cl^-$', '$HCl -> H^+ + Cl^-$', '$HCl -> H^- + Cl^+$', '$HCl + H2O -> H2Cl^+ + OH^-$'],
      answers: [0, 1],
      explain: 'Chlorovodík odevzdá vodě kation $H^+$ a vznikne $H3O^+$ a $Cl^-$. Zkrácený zápis $HCl -> H^+ + Cl^-$ vyjadřuje totéž.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-2 Hydroxidy a zásady                                             */
/* ------------------------------------------------------------------ */

const l52: Lesson = {
  id: 'l5-2',
  title: 'Hydroxidy a zásady',
  goals: [
    'Pojmenovat hydroxidy a sestavit jejich vzorce',
    'Vysvětlit, co je zásada podle Arrhenia a proč je zásadou i amoniak',
    'Popsat vlastnosti a použití hydroxidu sodného, draselného a vápenatého',
    'Bezpečně pracovat se žíravinami a vědět, jak poskytnout první pomoc',
  ],
  hook: 'Čistič odpadů dokáže rozpustit chuchvalec vlasů v trubce a z mastnoty udělá mýdlo. Poznej chemický protipól kyselin. A pozor, pro oči je ještě zákeřnější než kyseliny.',
  sections: [
    {
      title: 'Co je hydroxid',
      icon: 'ion-minus',
      blocks: [
        {
          type: 'p',
          text: '**Hydroxidy** jsou sloučeniny kationtu kovu a **hydroxidových aniontů** $OH^-$. Hydroxidový anion je skupina z jednoho kyslíku a jednoho vodíku s nábojem −1.',
        },
        { type: 'molecule', molecules: ['OH-'], labels: ['hydroxidový anion $OH^-$'] },
        { type: 'formula', text: '$NaOH$   $Ca(OH)2$   $Al(OH)3$', caption: 'kation kovu + tolik aniontů $OH^-$, kolik je náboj kationtu' },
        {
          type: 'p',
          text: 'Protože $OH^-$ má náboj −1, ==počet skupin OH se rovná oxidačnímu číslu kovu.== Víc skupin patří do **závorky**: $Ca(OH)2$. Název: **hydroxid** + koncovka podle oxidačního čísla kovu jako u oxidů (-ný, -natý, -itý…).',
        },
        {
          type: 'table',
          headers: ['Oxidační číslo kovu', 'Koncovka', 'Název', 'Vzorec'],
          rows: [
            ['I', '-ný', 'hydroxid sodný', '$NaOH$'],
            ['I', '-ný', 'hydroxid draselný', '$KOH$'],
            ['II', '-natý', 'hydroxid vápenatý', '$Ca(OH)2$'],
            ['II', '-natý', 'hydroxid měďnatý', '$Cu(OH)2$'],
            ['III', '-itý', 'hydroxid hlinitý', '$Al(OH)3$'],
            ['III', '-itý', 'hydroxid železitý', '$Fe(OH)3$'],
          ],
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Název', text: 'hydroxid železnatý' },
            { icon: 'ion-plus', title: 'Kation', text: '-natý -> II -> $Fe^{2+}$' },
            { icon: 'ion-minus', title: 'Vyrovnej náboj', text: '+2 potřebuje dva $OH^-$' },
            { icon: 'check', title: 'Vzorec', text: 'OH do závorky s indexem: $Fe(OH)2$' },
          ],
          caption: 'Od názvu ke vzorci hydroxidu.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Nejčastější chyba je zapomenutá závorka. Zápis $CaOH2$ by znamenal jeden kyslík a dva vodíky, což je nesmysl. Správně je $Ca(OH)2$: dva kyslíky a dva vodíky.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec hydroxidu barnatého.',
            accept: ['Ba(OH)2'],
            caseSensitive: true,
            placeholder: 'např. Mg(OH)2',
            explain: 'Barnatý -> $Ba^{2+}$, potřebuje dva $OH^-$: $Ba(OH)2$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj $LiOH$.',
            accept: ['hydroxid lithný'],
            explain: 'Lithium má oxidační číslo I, koncovka -ný: hydroxid lithný.',
          },
        },
      ],
    },
    {
      title: 'Zásady podle Arrhenia',
      icon: 'beaker',
      blocks: [
        {
          type: 'p',
          text: 'Podle Arrhenia je **zásada** látka, která ve vodě uvolňuje **hydroxidové anionty** $OH^-$. Rozpustné hydroxidy to dělají přímo, disociují na ionty.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'pevný $NaOH$', items: [{ species: 'NaOH', count: 4 }], state: 'solid' },
            { label: 'roztok $NaOH$', items: [{ species: 'Na^+', count: 4 }, { species: 'OH-', count: 4 }, { species: 'H2O', count: 5 }], state: 'solution' },
          ],
          arrows: true,
          caption: '$NaOH -> Na^+ + OH^-$',
        },
        { type: 'formula', text: '$Ca(OH)2 -> Ca^{2+} + 2OH^-$' },
        {
          type: 'p',
          text: 'Hydroxidy, které se dobře rozpouštějí ve vodě, se nazývají **alkálie** a jejich roztoky jsou **alkalické**. Většina ostatních hydroxidů je nerozpustná a z roztoků se vylučuje jako **sraženiny**.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Alkálie (rozpustné)', icon: 'drop', tone: 'a', points: ['hydroxidy alkalických kovů: $LiOH$, $NaOH$, $KOH$', 'částečně i kovů alkalických zemin: $Ca(OH)2$, $Ba(OH)2$'] },
            { title: 'Nerozpustné (sraženiny)', icon: 'powder', tone: 'b', points: ['$Cu(OH)2$: modrá', '$Fe(OH)3$: rezavě hnědá', '$Al(OH)3$: bílá rosolovitá'] },
          ],
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'soap', title: 'Mýdlové a kluzké na omak', text: 'rozkládají tuky a bílkoviny pokožky' },
            { icon: 'cabbage', title: 'Mění barvu indikátorů', text: 'fenolftalein fialově růžový, lakmus modrý' },
            { icon: 'bulb', title: 'Vedou elektrický proud', text: 'roztoky obsahují ionty' },
            { icon: 'lemon', title: 'Reagují s kyselinami', text: 'neutralizace (lekce 5-4)' },
          ],
        },
        {
          type: 'p',
          text: 'Hydroxidy vznikají například reakcí alkalického kovu s vodou nebo reakcí oxidu kovu s vodou:',
        },
        { type: 'reaction', equation: '2Na + 2H2O -> 2NaOH + H2', caption: 'sodík + voda -> hydroxid sodný + vodík' },
        { type: 'reaction', equation: 'CaO + H2O -> Ca(OH)2', caption: 'oxid vápenatý + voda -> hydroxid vápenatý' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka je alkálie, tedy dobře rozpustný hydroxid?',
            options: ['$KOH$', '$Fe(OH)3$', '$Cu(OH)2$', '$Al(OH)3$'],
            answer: 0,
            explain: 'Hydroxidy alkalických kovů (Li, Na, K…) jsou ve vodě dobře rozpustné. Hydroxidy železa, mědi a hliníku tvoří sraženiny.',
          },
        },
      ],
    },
    {
      title: 'Amoniak: zásada bez OH ve vzorci',
      icon: 'gas-cloud',
      blocks: [
        {
          type: 'p',
          text: '**Amoniak** $NH3$ je bezbarvý plyn štiplavého zápachu. Skupinu OH ve vzorci nemá, a přesto jeho vodný roztok barví fenolftalein fialově. Jak je to možné?',
        },
        {
          type: 'molecule',
          molecules: ['NH3', 'NH4+'],
          labels: ['amoniak: volný elektronový pár na dusíku', 'amonný kation $NH4^+$'],
          caption: 'Na dusíku v amoniaku je volný elektronový pár. Když na něj naváže $H^+$, vznikne $NH4^+$.',
        },
        {
          type: 'p',
          text: 'Volný elektronový pár dusíku si „přitáhne“ vodíkový kation z molekuly vody. Vznikne **amonný kation** $NH4^+$ a z vody zbude hydroxidový anion $OH^-$, který dělá roztok zásaditým.',
        },
        { type: 'formula', text: '$NH3 + H2O <=> NH4^+ + OH^-$', caption: 'obousměrná šipka: takto zreaguje jen malá část molekul amoniaku' },
        {
          type: 'particles',
          boxes: [
            { label: 'amoniak ve vodě', items: [{ species: 'NH3', count: 5 }, { species: 'H2O', count: 5 }], state: 'solution' },
            { label: 'rovnováha', items: [{ species: 'NH3', count: 4 }, { species: 'H2O', count: 4 }, { species: 'NH4+', count: 1 }, { species: 'OH-', count: 1 }], state: 'solution', note: 'většina $NH3$ zůstane nezměněná' },
          ],
          arrows: true,
        },
        {
          type: 'p',
          text: 'Roztoku amoniaku se říká **čpavková voda** (hovorově **čpavek**), je v některých čističích oken. Název „hydroxid amonný“ ($NH4OH$) nepoužívej, takové molekuly neexistují.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Na amoniaku je vidět, že Arrheniova definice má své meze. V lekci 5-6 poznáš obecnější Brønstedovu teorii, která si s ním poradí elegantně.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Amoniak je zásada, přestože ve svém vzorci nemá žádnou skupinu OH.',
            answer: true,
            explain: 'Amoniak přijme od vody kation $H^+$ a v roztoku tak vzniknou anionty $OH^-$.',
          },
        },
      ],
    },
    {
      title: 'Hydroxidy v praxi',
      icon: 'soap',
      blocks: [
        {
          type: 'iconlist',
          items: [
            { icon: 'soap', title: '$NaOH$, louh sodný', text: 'výroba mýdla, čističe odpadů, papír, výroba hliníku' },
            { icon: 'battery', title: '$KOH$, louh draselný', text: 'tekutá (mazlavá) mýdla, elektrolyt alkalických baterií' },
            { icon: 'powder', title: '$Ca(OH)2$, hašené vápno', text: 'malta, vápenné nátěry, úprava kyselých půd' },
            { icon: 'pill', title: '$Mg(OH)2$, hořečnaté mléko', text: 'lék proti pálení žáhy' },
            { icon: 'fertilizer', title: '$NH3(aq)$, čpavková voda', text: 'čističe skla; amoniak je surovina pro hnojiva' },
          ],
        },
        {
          type: 'p',
          text: '**Mýdlo** vzniká varem tuku s hydroxidem sodným nebo draselným (podrobně v úrovni 9). Totéž se děje v ucpaném odpadu: čistič s $NaOH$ promění mastnotu v rozpustné mýdlo a rozloží i vlasy.',
        },
        { type: 'diagram', id: 'limestone-cycle', caption: 'Vápenný cyklus: vápenec $CaCO3$ -> pálené vápno $CaO$ -> hašené vápno $Ca(OH)2$ -> zpět vápenec.' },
        {
          type: 'p',
          text: '**Pálené vápno** $CaO$ se vyrábí pálením vápence. S vodou reaguje bouřlivě a hodně se zahřeje, tomu se říká **hašení vápna**. Vznikne **hašené vápno** $Ca(OH)2$.',
        },
        { type: 'reaction', equation: 'Ca(OH)2 + CO2 -> CaCO3 + H2O', caption: 'tvrdnutí malty: hašené vápno pohlcuje oxid uhličitý ze vzduchu' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Důkaz oxidu uhličitého',
          text: 'Čirý roztok hydroxidu vápenatého je **vápenná voda**. Když do ní brčkem vydechneš, zakalí se bílým uhličitanem vápenatým.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Vápenná malta ve zdech starých hradů tvrdla celá desetiletí. Hydroxid vápenatý uvnitř zdiva reaguje s $CO2$ ze vzduchu velmi pomalu.',
        },
        { type: 'game', gameId: 'swipe', text: 'Zahraj si Pravda, nebo lež? a otestuj, jestli rozeznáš fakta o kyselinách a zásadách od mýtů.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď hydroxid k jeho typickému použití.',
            pairs: [
              ['$NaOH$', 'výroba mýdla a čistič odpadů'],
              ['$Ca(OH)2$', 'malta a vápno na zdi'],
              ['$KOH$', 'elektrolyt v alkalických bateriích'],
              ['$Mg(OH)2$', 'lék na pálení žáhy'],
            ],
            explain: 'Louh sodný zmýdelňuje tuky, hašené vápno tvrdne s $CO2$, $KOH$ vede proud v bateriích a slabě rozpustný $Mg(OH)2$ jemně neutralizuje žaludeční kyselinu.',
          },
        },
      ],
    },
    {
      title: 'Žíraviny: bezpečnost především',
      icon: 'goggles',
      blocks: [
        {
          type: 'p',
          text: 'Koncentrované roztoky hydroxidů jsou **žíravé**. Na kůži nejdřív působí jako kluzké mýdlo, a právě proto člověk poleptání snadno podcení.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zásady jsou pro oči horší než kyseliny',
          text: 'Kyselina bílkoviny na povrchu srazí a vytvoří jakousi bariéru. Zásada tkáň rozpouští a proniká hlouběji. Zásada v oku může během několika minut natrvalo poškodit rohovku, proto jsou ochranné brýle při práci s $NaOH$ povinné.',
        },
        { type: 'diagram', id: 'lab-safety', caption: 'Hydroxid sodný nese symbol žíraviny (GHS05). Najdeš ho i na obalu čističe odpadů.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'goggles', title: 'Brýle a rukavice', text: 'při práci s hydroxidy vždy' },
            { icon: 'powder', title: 'Pevný $NaOH$ jen lžičkou', text: 'bílé pecičky nebo šupinky neber do ruky' },
            { icon: 'heat', title: 'Rozpouštěj po malých dávkách', text: 'roztok se silně zahřívá, $NaOH$ přidávej do vody' },
            { icon: 'flask', title: 'Nádobu vždy zavírej', text: '$NaOH$ pohlcuje vzdušnou vlhkost i oxid uhličitý' },
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'První pomoc',
          text: 'Zasažené místo oplachuj proudem vody aspoň 15 minut, oko ještě déle, a vyhledej lékaře. Žádný ocet ani citron na kůži nelij.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Co platí o práci s koncentrovaným hydroxidem sodným?',
            options: [
              'Při jeho rozpouštění ve vodě se uvolňuje teplo.',
              'Zasažené oko se vyplachuje proudem vody a pak je nutné jít k lékaři.',
              'Na kůži se nejlépe neutralizuje octem.',
              'Pro oči je méně nebezpečný než kyseliny.',
            ],
            answers: [0, 1],
            explain: 'Rozpouštění $NaOH$ je silně exotermní a první pomocí je vždy voda. Neutralizace na kůži hřeje a zásada je pro oko nebezpečnější než kyselina.',
          },
        },
      ],
    },
  ],
  summary: [
    'Hydroxid tvoří kation kovu a tolik aniontů $OH^-$, kolik je oxidační číslo kovu: $Ca(OH)2$.',
    'Názvy hydroxidů mají stejné koncovky jako oxidy: hydroxid sodný, vápenatý, hlinitý.',
    'Zásada podle Arrhenia uvolňuje ve vodě anionty $OH^-$; dobře rozpustné hydroxidy se nazývají alkálie.',
    'Amoniak je zásada, protože přijme $H^+$ od vody a vzniknou $NH4^+$ a $OH^-$.',
    'Louh sodný slouží k výrobě mýdla a v čističích odpadů, hašené vápno $Ca(OH)2$ ve stavebnictví.',
    'Hydroxidy jsou žíravé a pro oči velmi nebezpečné, ochranné brýle jsou nutnost.',
  ],
  quiz: [
    {
      kind: 'text',
      q: 'Napiš vzorec hydroxidu měďnatého.',
      accept: ['Cu(OH)2'],
      caseSensitive: true,
      placeholder: 'např. Mg(OH)2',
      explain: 'Měďnatý -> $Cu^{2+}$, dva anionty $OH^-$ v závorce: $Cu(OH)2$.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj $Fe(OH)3$.',
      accept: ['hydroxid železitý'],
      explain: 'Tři skupiny OH -> železo má oxidační číslo III, koncovka -itý.',
    },
    {
      kind: 'choice',
      q: 'Co vznikne reakcí draslíku s vodou?',
      options: ['$KOH$ a $H2$', '$K2O$ a $H2$', '$KOH$ a $O2$', '$KH$ a $O2$'],
      answer: 0,
      explain: 'Alkalický kov s vodou tvoří hydroxid a vodík: $2K + 2H2O -> 2KOH + H2$.',
    },
    {
      kind: 'tf',
      q: 'Hydroxid měďnatý se dobře rozpouští ve vodě, je to tedy alkálie.',
      answer: false,
      explain: '$Cu(OH)2$ je nerozpustný, z roztoku se vylučuje jako modrá sraženina. Alkálie jsou hlavně hydroxidy alkalických kovů.',
    },
    {
      kind: 'tf',
      q: 'Vydechovaný vzduch zakalí vápennou vodu, protože $CO2$ s ní vytvoří nerozpustný $CaCO3$.',
      answer: true,
      explain: '$Ca(OH)2 + CO2 -> CaCO3 + H2O$. Bílý uhličitan vápenatý roztok zakalí.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k běžnému názvu vzorec.',
      pairs: [
        ['pálené vápno', '$CaO$'],
        ['hašené vápno', '$Ca(OH)2$'],
        ['vápenec', '$CaCO3$'],
        ['louh sodný', '$NaOH$'],
      ],
      explain: 'Pálením vápence $CaCO3$ vzniká pálené vápno $CaO$, jeho hašením vodou hašené vápno $Ca(OH)2$.',
    },
    {
      kind: 'multi',
      q: 'Které ionty vzniknou reakcí amoniaku s vodou?',
      options: ['$NH4^+$', '$OH^-$', '$H3O^+$', '$NH2^-$', '$N^{3-}$'],
      answers: [0, 1],
      explain: '$NH3 + H2O <=> NH4^+ + OH^-$. Amoniak přijme proton a z vody zbude hydroxidový anion.',
    },
    {
      kind: 'number',
      q: 'Kolik molů iontů $OH^-$ vznikne úplnou disociací 0,5 mol $Ba(OH)2$?',
      answer: 1,
      unit: 'mol',
      explain: 'Z každé vzorcové jednotky $Ba(OH)2$ vzniknou dva $OH^-$: 2 · 0,5 mol = 1 mol.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-3 pH a indikátory                                                */
/* ------------------------------------------------------------------ */

const l53: Lesson = {
  id: 'l5-3',
  title: 'pH a indikátory',
  goals: [
    'Popsat autoprotolýzu vody a použít iontový součin vody',
    'Spočítat pH a pOH roztoků silných kyselin a zásad',
    'Zařadit běžné látky na stupnici pH',
    'Vybrat vhodný indikátor a vysvětlit jeho barevnou změnu',
  ],
  hook: 'Na šampónu stojí „pH 5,5“, v bazénu se pH měří každý den a tvoje krev si drží pH 7,4 s přesností na desetiny. Co to číslo vlastně znamená?',
  sections: [
    {
      title: 'I čistá voda obsahuje ionty',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Čistá voda vede proud jen nepatrně, obsahuje tedy trochu iontů. Molekuly vody si totiž občas předají vodíkový kation: vznikne oxoniový kation a hydroxidový anion. Říká se tomu **autoprotolýza vody**.',
        },
        { type: 'formula', text: '$H2O + H2O <=> H3O^+ + OH^-$' },
        {
          type: 'particles',
          boxes: [
            { label: 'čistá voda', items: [{ species: 'H2O', count: 8 }], state: 'liquid' },
            { label: 'po předání protonu', items: [{ species: 'H2O', count: 6 }, { species: 'H3O+', count: 1 }, { species: 'OH-', count: 1 }], state: 'liquid', note: 've skutečnosti jen asi 1 z 500 milionů molekul' },
          ],
          arrows: true,
          caption: 'Autoprotolýza: dvě molekuly vody si předají proton.',
        },
        { type: 'molecule', molecules: ['H3O+', 'OH-'], labels: ['oxoniový kation', 'hydroxidový anion'] },
        {
          type: 'p',
          text: '$[H3O^+]$ značí molární koncentraci oxoniových kationtů v mol/dm^{3} (totéž $c$ jako v lekci 4-5). V čisté vodě při 25 °C je $[H3O^+] = [OH^-] = 10^{-7}$ mol/dm^{3}.',
        },
        { type: 'formula', text: '$[H3O^+]·[OH^-] = 1,0·10^{-14}$', caption: '**iontový součin vody** $K_{v}$ při 25 °C' },
        {
          type: 'p',
          text: '==Iontový součin vody platí v každém vodném roztoku.== Když přidáš kyselinu, $[H3O^+]$ vzroste a $[OH^-]$ musí úměrně klesnout. Oba ionty jsou přítomné vždy, mění se jen jejich poměr.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'kyselý roztok', icon: 'lemon', tone: 'a', points: ['$[H3O^+] > [OH^-]$'] },
            { title: 'neutrální roztok', icon: 'drop', tone: 'b', points: ['$[H3O^+] = [OH^-]$'] },
            { title: 'zásaditý roztok', icon: 'soap', tone: 'c', points: ['$[H3O^+] < [OH^-]$'] },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'V roztoku je $[H3O^+]$ = 10^{-3} mol/dm^{3}. Jaká je $[OH^-]$?',
            options: ['10^{-11} mol/dm^{3}', '10^{-3} mol/dm^{3}', '10^{-7} mol/dm^{3}', '10^{-17} mol/dm^{3}'],
            answer: 0,
            explain: '$[OH^-]$ = 10^{-14} : 10^{-3} = 10^{-11} mol/dm^{3}. Součin obou koncentrací musí být 10^{-14}.',
          },
        },
      ],
    },
    {
      title: 'Co je pH',
      icon: 'calculator',
      blocks: [
        {
          type: 'p',
          text: 'Psát koncentrace jako 0,0000001 mol/dm^{3} je nepraktické. Dánský chemik Søren **Sørensen** proto v roce 1909 zavedl **pH**: záporně vzatý dekadický logaritmus koncentrace oxoniových kationtů.',
        },
        { type: 'formula', text: '$pH = −log[H3O^+]$' },
        {
          type: 'p',
          text: 'Logaritmu se neboj, pro mocniny deseti je to snadné: ==pH je exponent koncentrace $H3O^+$ s opačným znaménkem.== Když $[H3O^+]$ = 10^{-3} mol/dm^{3}, je pH = 3.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: {
            marks: [
              { ph: 3, label: 'kyselý' },
              { ph: 7, label: 'neutrální' },
              { ph: 11, label: 'zásaditý' },
            ],
          },
          caption: 'pH < 7: roztok je **kyselý**. pH = 7: **neutrální** (při 25 °C). pH > 7: **zásaditý**.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Pokles pH o 1 znamená **desetkrát** vyšší koncentraci $H3O^+$. Roztok s pH 2 je tedy desetkrát kyselejší než roztok s pH 3 a stokrát kyselejší než roztok s pH 4.',
        },
        {
          type: 'p',
          text: 'U **silných kyselin**, jako je $HCl$ nebo $HNO3$, se ve zředěném roztoku rozštěpí všechny molekuly, takže $[H3O^+]$ se rovná koncentraci kyseliny. (Podrobně v lekci 5-6.)',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'zředěná $HCl$', items: [{ species: 'H3O+', count: 4 }, { species: 'Cl^-', count: 4 }, { species: 'H2O', count: 6 }], state: 'solution', note: 'žádná celá molekula $HCl$' },
          ],
          caption: 'Silná kyselina: kolik molekul kyseliny, tolik kationtů $H3O^+$.',
        },
        {
          type: 'example',
          problem: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,01 mol/dm^{3}?',
          steps: [
            '$HCl$ je silná kyselina, disociuje úplně: z každé molekuly vznikne jeden $H3O^+$.',
            '$[H3O^+]$ = $c(HCl)$ = 0,01 mol/dm^{3} = 10^{-2} mol/dm^{3}.',
            'pH = −log 10^{-2} = 2.',
          ],
          answer: 'pH = 2',
        },
        {
          type: 'example',
          problem: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,05 mol/dm^{3}?',
          steps: [
            '$[H3O^+]$ = 0,05 mol/dm^{3}.',
            'To není celá mocnina deseti, použij kalkulačku: log 0,05 = −1,30.',
            'pH = −(−1,30) = 1,30.',
          ],
          answer: 'pH ≈ 1,3',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké pH má roztok kyseliny dusičné $HNO3$ o koncentraci 0,001 mol/dm^{3}?',
            answer: 3,
            tolerance: 0.05,
            explain: '$HNO3$ je silná kyselina: $[H3O^+]$ = 0,001 = 10^{-3} mol/dm^{3}, takže pH = 3.',
          },
        },
      ],
    },
    {
      title: 'pOH a zásadité roztoky',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'U zásad je pohodlnější začít u hydroxidových aniontů. Podobně jako pH se definuje **pOH**:',
        },
        { type: 'formula', text: '$pOH = −log[OH^-]$' },
        { type: 'formula', text: '$pH + pOH = 14$', caption: 'plyne z iontového součinu vody; platí ve vodných roztocích při 25 °C' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'soap', title: '$[OH^-]$', text: 'z koncentrace zásady (u $Ca(OH)2$ dvakrát víc)' },
            { icon: 'calculator', title: 'pOH', text: '= −log $[OH^-]$' },
            { icon: 'balance-scale', title: 'pH', text: '= 14 − pOH' },
            { icon: 'check', title: 'Kontrola', text: 'zásaditý roztok má pH > 7' },
          ],
          caption: 'Výpočet pH roztoku silné zásady.',
        },
        {
          type: 'example',
          problem: 'Jaké pH má roztok hydroxidu sodného o koncentraci 0,001 mol/dm^{3}?',
          steps: [
            '$NaOH$ je silná zásada, disociuje úplně: $[OH^-]$ = 0,001 mol/dm^{3} = 10^{-3} mol/dm^{3}.',
            'pOH = −log 10^{-3} = 3.',
            'pH = 14 − pOH = 14 − 3 = 11.',
          ],
          answer: 'pH = 11',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'roztok $Ca(OH)2$', items: [{ species: 'Ca^{2+}', count: 2 }, { species: 'OH-', count: 4 }, { species: 'H2O', count: 5 }], state: 'solution', note: 'z každé jednotky dva $OH^-$' },
          ],
          caption: '$Ca(OH)2 -> Ca^{2+} + 2OH^-$: koncentrace $OH^-$ je dvojnásobná.',
        },
        {
          type: 'example',
          problem: 'Jaké pH má roztok hydroxidu vápenatého o koncentraci 0,005 mol/dm^{3}?',
          steps: [
            'Z každé vzorcové jednotky $Ca(OH)2$ vzniknou dva anionty $OH^-$.',
            '$[OH^-]$ = 2 · 0,005 mol/dm^{3} = 0,01 mol/dm^{3} = 10^{-2} mol/dm^{3}.',
            'pOH = 2, pH = 14 − 2 = 12.',
          ],
          answer: 'pH = 12',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Typická chyba: u zásady spočítáš pOH a zapomeneš ho převést na pH. Zkontroluj se selským rozumem: zásaditý roztok musí mít pH **větší** než 7.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké pH má roztok hydroxidu draselného o koncentraci 0,01 mol/dm^{3}?',
            answer: 12,
            tolerance: 0.05,
            explain: '$[OH^-]$ = 10^{-2} mol/dm^{3}, pOH = 2, pH = 14 − 2 = 12.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Roztok má pH 4. Jaké je jeho pOH?',
            answer: 10,
            tolerance: 0.05,
            explain: 'pOH = 14 − pH = 14 − 4 = 10.',
          },
        },
      ],
    },
    {
      title: 'Stupnice pH kolem nás',
      icon: 'chart',
      blocks: [
        {
          type: 'p',
          text: 'Stupnice pH běžně sahá od 0 do 14. Podívej se, kam patří látky, které znáš z domova.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: {
            marks: [
              { ph: 1.5, label: 'žaludeční šťáva' },
              { ph: 2.3, label: 'citronová šťáva' },
              { ph: 2.9, label: 'ocet' },
              { ph: 5, label: 'černá káva' },
              { ph: 5.6, label: 'čistý déšť' },
              { ph: 7, label: 'čistá voda' },
              { ph: 7.4, label: 'krev' },
              { ph: 8.3, label: 'roztok jedlé sody' },
              { ph: 10, label: 'mýdlo' },
              { ph: 11.5, label: 'čpavek' },
              { ph: 13.5, label: 'čistič odpadů' },
            ],
          },
          caption: 'Každý dílek stupnice znamená desetinásobnou změnu koncentrace $H3O^+$.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'blood', title: 'Krev: pH 7,35–7,45', text: 'pod 7,35 lékaři mluví o acidóze, jde o vážný stav' },
            { icon: 'stomach', title: 'Žaludek: pH 1–2', text: 'kyselina rozkládá potravu a ničí bakterie' },
            { icon: 'soap', title: 'Kůže: pH asi 5,5', text: 'proto se kosmetika chlubí pH „šetrným k pokožce“' },
            { icon: 'swimming-pool', title: 'Bazén: pH 7,2–7,6', text: 'jinak nefunguje dezinfekce a voda dráždí oči' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Existují i roztoky s pH menším než 0 nebo větším než 14. Třeba koncentrovaná kyselina chlorovodíková má pH záporné. Stupnice 0–14 je jen praktický rozsah pro běžné roztoky.',
        },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď od nejkyselejší po nejzásaditější.',
            items: ['žaludeční šťáva', 'ocet', 'čistá voda', 'roztok jedlé sody', 'čistič odpadů'],
            explain: 'pH asi 1,5 < 2,9 < 7 < 8,3 < 13,5. Čím nižší pH, tím kyselejší roztok.',
          },
        },
      ],
    },
    {
      title: 'Indikátory',
      icon: 'cabbage',
      blocks: [
        {
          type: 'p',
          text: '**Acidobazické indikátory** jsou barviva, která mění barvu podle pH. Každý má svůj **barevný přechod**, tedy rozmezí pH, ve kterém barvu mění.',
        },
        { type: 'diagram', id: 'indicator-colors', caption: 'Barvy běžných indikátorů v kyselém, neutrálním a zásaditém prostředí.' },
        {
          type: 'table',
          headers: ['Indikátor', 'Barva v kyselém', 'Přechod (pH)', 'Barva v zásaditém'],
          rows: [
            ['methyloranž', 'červená', '3,1–4,4', 'žlutá'],
            ['lakmus', 'červená', 'asi 4,5–8,3', 'modrá'],
            ['bromthymolová modř', 'žlutá', '6,0–7,6', 'modrá'],
            ['fenolftalein', 'bezbarvý', '8,2–10,0', 'fialově růžový'],
            ['univerzální indikátor', 'červená až oranžová', 'celá stupnice, pH 7 = zelená', 'modrá až fialová'],
          ],
          caption: 'Pod dolní hranicí přechodu má indikátor „kyselou“ barvu, nad horní hranicí „zásaditou“.',
        },
        {
          type: 'p',
          text: '**Univerzální indikátor** je směs několika indikátorů: papírkem jím nasáklým určíš pH zhruba na jednotku přesně. Přesněji se pH měří elektronickým **pH metrem**.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'cabbage', title: 'Výluh ze zelí', text: 'listy červeného zelí zalij horkou vodou, po 15 minutách sceď; fialová barviva jsou **antokyany**' },
            { icon: 'lemon', title: 'Sklenička s octem', text: 'výluh zčervená' },
            { icon: 'glass', title: 'Sklenička s vodou', text: 'zůstane fialová' },
            { icon: 'powder', title: 'Lžička jedlé sody', text: 'zmodrá až zezelená' },
          ],
          caption: 'Domácí pokus: indikátor z červeného zelí. S horkou vodou buď opatrný.',
        },
        { type: 'game', gameId: 'ph-lab', text: 'V pH laboratoři přikapáváš kyselinu a zásadu a sleduješ, jak se krok za krokem mění barva univerzálního indikátoru.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Do roztoku přikápneš fenolftalein a roztok zůstane bezbarvý. Co můžeš s jistotou říct?',
            options: ['pH je menší než asi 8,2.', 'Roztok je kyselý.', 'Roztok je neutrální.', 'pH je větší než 10.'],
            answer: 0,
            explain: 'Fenolftalein je bezbarvý v celém rozmezí pod pH 8,2: v kyselém, neutrálním i slabě zásaditém roztoku. Víc z něj nevyčteš.',
          },
        },
      ],
    },
  ],
  summary: [
    'Autoprotolýzou vody vznikají ionty $H3O^+$ a $OH^-$; v čisté vodě má každý z nich koncentraci 10^{-7} mol/dm^{3}.',
    'Iontový součin vody je $[H3O^+]·[OH^-] = 10^{-14}$ (při 25 °C).',
    'pH = −log $[H3O^+]$; kyselé roztoky mají pH < 7, zásadité pH > 7.',
    'U silných zásad spočítej pOH = −log $[OH^-]$ a potom pH = 14 − pOH.',
    'Změna pH o 1 znamená desetinásobnou změnu koncentrace $H3O^+$.',
    'Indikátory mění barvu v určitém rozmezí pH: fenolftalein je v zásaditém fialově růžový, methyloranž v kyselém červená.',
  ],
  quiz: [
    {
      kind: 'number',
      q: 'Jaké pH má kyselina chlorovodíková o koncentraci 0,0001 mol/dm^{3}?',
      answer: 4,
      tolerance: 0.05,
      explain: '$[H3O^+]$ = 10^{-4} mol/dm^{3}, takže pH = 4.',
    },
    {
      kind: 'number',
      q: 'Jaké pH má roztok hydroxidu sodného o koncentraci 0,1 mol/dm^{3}?',
      answer: 13,
      tolerance: 0.05,
      explain: '$[OH^-]$ = 10^{-1} mol/dm^{3}, pOH = 1, pH = 14 − 1 = 13.',
    },
    {
      kind: 'tf',
      q: 'Roztok s pH 3 má stokrát vyšší koncentraci $H3O^+$ než roztok s pH 5.',
      answer: true,
      explain: 'Rozdíl dvou jednotek pH znamená 10 · 10 = 100násobný rozdíl koncentrace.',
    },
    {
      kind: 'tf',
      q: 'V kyselém roztoku nejsou žádné hydroxidové anionty $OH^-$.',
      answer: false,
      explain: 'Anionty $OH^-$ jsou ve vodném roztoku vždy, jen je jich v kyselém roztoku méně než $H3O^+$. Součin koncentrací je 10^{-14}.',
    },
    {
      kind: 'choice',
      q: 'Jakou barvu má univerzální indikátor v čisté vodě?',
      options: ['zelenou', 'červenou', 'modrou', 'fialovou'],
      answer: 0,
      explain: 'Čistá voda je neutrální (pH 7) a univerzální indikátor je při pH 7 zelený.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k indikátoru v daném prostředí jeho barvu.',
      pairs: [
        ['lakmus v zásaditém roztoku', 'modrá'],
        ['fenolftalein v zásaditém roztoku', 'fialově růžová'],
        ['methyloranž v zásaditém roztoku', 'žlutá'],
        ['univerzální indikátor při pH 1', 'červená'],
      ],
      explain: 'Lakmus v zásadách zmodrá, fenolftalein zrůžoví, methyloranž zežloutne a univerzální indikátor je v silně kyselém prostředí červený.',
    },
    {
      kind: 'number',
      q: 'Roztok má pOH 2,5. Jaké je jeho pH?',
      answer: 11.5,
      tolerance: 0.05,
      explain: 'pH = 14 − pOH = 14 − 2,5 = 11,5.',
    },
    {
      kind: 'choice',
      q: 'Jaká je $[OH^-]$ v roztoku s pH 9?',
      options: ['10^{-5} mol/dm^{3}', '10^{-9} mol/dm^{3}', '10^{-7} mol/dm^{3}', '9 mol/dm^{3}'],
      answer: 0,
      explain: 'pOH = 14 − 9 = 5, takže $[OH^-]$ = 10^{-5} mol/dm^{3}. Hodnota 10^{-9} je $[H3O^+]$.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-4 Neutralizace a titrace                                         */
/* ------------------------------------------------------------------ */

const l54: Lesson = {
  id: 'l5-4',
  title: 'Neutralizace a titrace',
  goals: [
    'Zapsat neutralizaci molekulovou i iontovou rovnicí',
    'Popsat postup acidobazické titrace a vybrat vhodný indikátor',
    'Spočítat koncentraci kyseliny nebo zásady z výsledku titrace',
    'Vysvětlit, jak neutralizace pomáhá při pálení žáhy a na kyselých půdách',
  ],
  hook: 'Pálí tě žáha? Tableta z lékárny ji zažene za pár minut. Stejná reakce pomáhá zemědělcům na polích i chemikům v laboratoři, kteří díky ní určí koncentraci roztoku s přesností na kapku.',
  sections: [
    {
      title: 'Kyselina + zásada = sůl + voda',
      icon: 'beaker',
      blocks: [
        {
          type: 'p',
          text: '**Neutralizace** je reakce kyseliny se zásadou (hydroxidem), při které vzniká **sůl** a **voda**. Kyselina a zásada se navzájem „vyruší“ a roztok přestane být kyselý i zásaditý.',
        },
        { type: 'diagram', id: 'neutralization', caption: 'Kationty $H3O^+$ z kyseliny a anionty $OH^-$ ze zásady se spojí na vodu, v roztoku zůstane sůl.' },
        { type: 'reaction', equation: 'HCl + NaOH -> NaCl + H2O', caption: 'kyselina chlorovodíková + hydroxid sodný -> chlorid sodný + voda' },
        { type: 'reaction', equation: 'H2SO4 + 2NaOH -> Na2SO4 + 2H2O', caption: 'dvojsytná kyselina sírová potřebuje dva $NaOH$' },
        {
          type: 'p',
          text: 'Rozepiš látky, které jsou v roztoku rozštěpené na ionty, a uvidíš, co se doopravdy děje:',
        },
        { type: 'formula', text: '$H^+ + Cl^- + Na^+ + OH^- -> Na^+ + Cl^- + H2O$' },
        {
          type: 'particles',
          boxes: [
            { label: 'kyselina + zásada', items: [{ species: 'H3O+', count: 3 }, { species: 'Cl^-', count: 3 }, { species: 'Na^+', count: 3 }, { species: 'OH-', count: 3 }], state: 'solution' },
            { label: 'roztok soli', items: [{ species: 'Na^+', count: 3 }, { species: 'Cl^-', count: 3 }, { species: 'H2O', count: 6 }], state: 'solution', note: '$Na^+$ a $Cl^-$ se nezměnily' },
          ],
          arrows: true,
          caption: 'Každý $H3O^+$ se s jedním $OH^-$ změní na dvě molekuly vody.',
        },
        {
          type: 'p',
          text: 'Ionty $Na^+$ a $Cl^-$ jsou na obou stranách beze změny, jsou to **ionty-diváci** (anglicky *spectator ions*). Když je škrtneš, zbude ==iontová rovnice neutralizace, stejná pro všechny silné kyseliny a zásady==:',
        },
        { type: 'formula', text: '$H^+ + OH^- -> H2O$', caption: 'přesněji $H3O^+ + OH^- -> 2H2O$' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Neutralizace je **exotermní**, uvolňuje teplo. U silné kyseliny a silné zásady je to vždy asi 57 kJ na každý mol vzniklé vody, protože pokaždé probíhá stejná reakce $H^+ + OH^- -> H2O$. O reakčním teple víc v úrovni 6.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Neutralizací $HNO3$ hydroxidem draselným $KOH$ vzniká voda a sůl. Napiš vzorec té soli.',
            accept: ['KNO3'],
            caseSensitive: true,
            placeholder: 'např. NaCl',
            explain: '$HNO3 + KOH -> KNO3 + H2O$. Vzniká dusičnan draselný.',
          },
        },
      ],
    },
    {
      title: 'Neutralizace v každodenním životě',
      icon: 'pill',
      blocks: [
        {
          type: 'p',
          text: 'Kyselina chlorovodíková ze žaludku v jícnu pálí: to je **pálení žáhy**. **Antacida**, léky proti překyselení, obsahují slabě rozpustné zásady, které nadbytek kyseliny zneutralizují.',
        },
        { type: 'reaction', equation: 'Mg(OH)2 + 2HCl -> MgCl2 + 2H2O', caption: 'hydroxid hořečnatý neutralizuje žaludeční kyselinu' },
        { type: 'reaction', equation: 'Al(OH)3 + 3HCl -> AlCl3 + 3H2O', caption: 'hydroxid hlinitý dělá totéž' },
        {
          type: 'compare',
          columns: [
            { title: 'Antacida', icon: 'pill', tone: 'good', points: ['málo rozpustné hydroxidy ($Mg(OH)2$, $Al(OH)3$) nebo uhličitany', 'působí mírně', 'reagují jen tam, kde je kyselina'] },
            { title: '$NaOH$', icon: 'hazard', tone: 'bad', points: ['dobře rozpustný a žíravý', 'poleptal by ústa i jícen', 'jako lék nepoužitelný'] },
          ],
          caption: 'Proč se pálení žáhy neléčí hydroxidem sodným.',
        },
        {
          type: 'p',
          text: '**Vápnění půdy**: kyselé půdy, třeba pod smrkovými lesy nebo po kyselých deštích, se posypávají mletým vápencem $CaCO3$ nebo hašeným vápnem. Vápenec reaguje s kyselinou za vzniku oxidu uhličitého:',
        },
        { type: 'formula', text: '$CaCO3 + 2H^+ -> Ca^{2+} + H2O + CO2$' },
        {
          type: 'iconlist',
          items: [
            { icon: 'pill', title: 'Antacida', text: 'zneutralizují nadbytek žaludeční kyseliny' },
            { icon: 'leaf', title: 'Vápnění půdy', text: 'vápenec zlepší kyselé půdy' },
            { icon: 'factory', title: 'Odsíření spalin', text: 'vápenec zachytí kyselý $SO2$ (lekce 5-1)' },
          ],
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Když je někdo „kyselý“, zkus mu nabídnout trochu zásady. U lidí to funguje hůř než u roztoků, ale chemicky je to čistá neutralizace.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka se hodí jako lék proti pálení žáhy?',
            options: ['$Mg(OH)2$', '$NaOH$', '$HCl$', '$NaCl$'],
            answer: 0,
            explain: 'Hydroxid hořečnatý je málo rozpustná, mírná zásada, která zneutralizuje žaludeční kyselinu. $NaOH$ je žíravý, $HCl$ je kyselina a $NaCl$ s kyselinou nereaguje.',
          },
        },
      ],
    },
    {
      title: 'Titrace krok za krokem',
      icon: 'burette',
      blocks: [
        {
          type: 'p',
          text: '**Titrace** (odměrná analýza) je metoda, jak zjistit neznámou koncentraci roztoku. K přesně odměřenému objemu vzorku postupně přidáváš roztok o známé koncentraci, dokud spolu přesně nezreagují.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'byreta', def: 'dlouhá kalibrovaná trubice s kohoutem; přikapává se z ní odměrný roztok a odečítá jeho spotřeba' },
            { term: 'pipeta', def: 'odměří přesný objem vzorku, např. 20,00 cm^{3}, do titrační baňky' },
            { term: 'odměrný roztok', def: 'roztok o přesně známé koncentraci, třeba $NaOH$ o koncentraci 0,100 mol/dm^{3}' },
            { term: 'bod ekvivalence', def: 'okamžik, kdy kyselina a zásada zreagovaly přesně v poměru podle rovnice' },
            { term: 'indikátor', def: 'změnou barvy ukáže, že jsme dosáhli bodu ekvivalence' },
          ],
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'burette', title: 'Naplň byretu', text: 'vypláchni ji odměrným roztokem, naplň a odečti počáteční objem' },
            { icon: 'pipette', title: 'Odměř vzorek', text: 'pipetou přesný objem do titrační baňky' },
            { icon: 'drop', title: 'Přidej indikátor', text: '2–3 kapky' },
            { icon: 'flask', title: 'Titruj', text: 'za stálého kroužení baňkou přikapávej z byrety' },
            { icon: 'magnifier', title: 'Barva se trvale změní', text: 'zavři kohout, odečti konečný objem; rozdíl je spotřeba' },
            { icon: 'arrow-cycle', title: 'Zopakuj', text: 'titraci zopakuj a výsledky zprůměruj' },
          ],
        },
        { type: 'diagram', id: 'meniscus', caption: 'Objem v byretě odečítej u spodního okraje menisku, s okem v jeho úrovni.' },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Pipetuje se vždy **pipetovacím nástavcem (balonkem)**, nikdy ústy. A když plníš byretu hydroxidem, měj nasazené brýle, kapka zásady v oku je vážný problém.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Poslední mililitry přidávej po kapkách. Přetitrovat je snadné: jedna kapka navíc a fenolftalein je sytě růžový.',
        },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď kroky titrace.',
            items: [
              'Naplnit byretu odměrným roztokem a odečíst počáteční objem',
              'Odměřit pipetou vzorek do titrační baňky',
              'Přidat několik kapek indikátoru',
              'Přikapávat roztok z byrety, dokud se nezmění barva',
              'Odečíst spotřebu a spočítat koncentraci',
            ],
            explain: 'Nejdřív připravíš byretu a vzorek, pak přidáš indikátor, titruješ do změny barvy a nakonec počítáš.',
          },
        },
      ],
    },
    {
      title: 'Výpočet z titrace',
      icon: 'calculator',
      blocks: [
        {
          type: 'p',
          text: 'V bodě ekvivalence platí poměr z chemické rovnice. Postup znáš z lekce 4-6:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'burette', title: '$n$ odměrného roztoku', text: '$n = c·V$ ze spotřeby v byretě' },
            { icon: 'balance-scale', title: 'Poměr z rovnice', text: '1 : 1 u $HCl$, 1 : 2 u $H2SO4$' },
            { icon: 'flask', title: '$c$ vzorku', text: '$c = n/V$' },
          ],
        },
        { type: 'formula', text: '$n = c·V$', caption: 'objem dosazuj v dm^{3}: 1 cm^{3} = 0,001 dm^{3}' },
        {
          type: 'example',
          problem: 'Na titraci 20,0 cm^{3} kyseliny chlorovodíkové se spotřebovalo 15,0 cm^{3} roztoku $NaOH$ o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace kyseliny?',
          steps: [
            'Rovnice: $HCl + NaOH -> NaCl + H2O$, poměr 1 : 1.',
            '$n(NaOH)$ = 0,100 mol/dm^{3} · 0,0150 dm^{3} = 0,00150 mol.',
            '$n(HCl)$ = $n(NaOH)$ = 0,00150 mol.',
            '$c(HCl)$ = 0,00150 mol : 0,0200 dm^{3} = 0,0750 mol/dm^{3}.',
          ],
          answer: '$c(HCl)$ = 0,075 mol/dm^{3}',
        },
        {
          type: 'example',
          problem: 'Na titraci 10,0 cm^{3} kyseliny sírové se spotřebovalo 25,0 cm^{3} $NaOH$ o koncentraci 0,200 mol/dm^{3}. Jaká je koncentrace kyseliny?',
          steps: [
            'Rovnice: $H2SO4 + 2NaOH -> Na2SO4 + 2H2O$, poměr 1 : 2.',
            '$n(NaOH)$ = 0,200 mol/dm^{3} · 0,0250 dm^{3} = 0,00500 mol.',
            '$n(H2SO4)$ = 0,00500 mol : 2 = 0,00250 mol.',
            '$c(H2SO4)$ = 0,00250 mol : 0,0100 dm^{3} = 0,250 mol/dm^{3}.',
          ],
          answer: '$c(H2SO4)$ = 0,25 mol/dm^{3}',
        },
        { type: 'reaction', equation: 'H2SO4 + 2NaOH -> Na2SO4 + 2H2O', caption: 'poměr 1 : 2: na jednu $H2SO4$ připadají dvě $NaOH$' },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Kyselina sírová je **dvojsytná**: může odevzdat dva vodíkové kationty. U takových kyselin nezapomeň na poměr z rovnice. Rychlý vzorec $c_{1}·V_{1} = c_{2}·V_{2}$ platí jen pro poměr 1 : 1.',
        },
        { type: 'game', gameId: 'titration', text: 'Vyzkoušej si titraci nanečisto: v minihře Titrace přikapáváš z byrety a ze spotřeby spočítáš koncentraci.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Na 25,0 cm^{3} roztoku $NaOH$ se spotřebovalo 20,0 cm^{3} $HCl$ o koncentraci 0,125 mol/dm^{3}. Jaká je koncentrace $NaOH$?',
            answer: 0.1,
            tolerance: 0.002,
            unit: 'mol/dm³',
            explain: '$n(HCl)$ = 0,125 · 0,0200 = 0,00250 mol = $n(NaOH)$; $c$ = 0,00250 : 0,0250 = 0,100 mol/dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Titrační křivka',
      icon: 'chart',
      blocks: [
        {
          type: 'p',
          text: 'Když během titrace měříš pH a vyneseš ho do grafu proti objemu přidaného odměrného roztoku, dostaneš **titrační křivku**.',
        },
        {
          type: 'diagram',
          id: 'titration-curve',
          props: { kind: 'strong-strong' },
          caption: 'Titrace silné kyseliny silnou zásadou: v okolí bodu ekvivalence vyskočí pH zhruba ze 4 na 10.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'lemon', title: 'Začátek', text: 'pH je nízké a roste pomalu, přidaná zásada se hned spotřebuje' },
            { icon: 'speed', title: 'Skok pH', text: 'kolem bodu ekvivalence stačí kapka a pH se změní o několik jednotek' },
            { icon: 'balance-scale', title: 'Bod ekvivalence', text: 'u silné kyseliny a silné zásady pH = 7, v baňce je jen roztok soli (třeba $NaCl$)' },
            { icon: 'soap', title: 'Za bodem ekvivalence', text: 'nadbytek zásady, pH se ustálí vysoko' },
          ],
        },
        {
          type: 'p',
          text: '==Indikátor musí měnit barvu uvnitř skoku pH.== Při titraci silné kyseliny silnou zásadou proto vyhoví fenolftalein (8,2–10) i methyloranž (3,1–4,4): obě rozmezí leží ve skoku.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'V bodě ekvivalence titrace kyseliny chlorovodíkové hydroxidem sodným má roztok pH 7.',
            answer: true,
            explain: 'Obě látky jsou silné, v bodě ekvivalence zbude jen roztok $NaCl$, který je neutrální.',
          },
        },
      ],
    },
  ],
  summary: [
    'Neutralizace: kyselina + hydroxid -> sůl + voda.',
    'Iontová rovnice neutralizace silných kyselin a zásad je vždy $H^+ + OH^- -> H2O$.',
    'Neutralizace je exotermní, uvolní asi 57 kJ na mol vzniklé vody.',
    'Při titraci se z byrety přidává odměrný roztok ke vzorku v baňce, dokud indikátor nezmění barvu.',
    'Výpočet z titrace: $n = c·V$, poměr z rovnice, pak $c = n/V$.',
    'Na titrační křivce je u bodu ekvivalence prudký skok pH a indikátor musí měnit barvu právě v něm.',
    'Antacida a vápnění půdy jsou neutralizace v praxi.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Co vzniká neutralizací kyseliny sírové hydroxidem draselným?',
      options: ['$K2SO4$ a $H2O$', '$KSO4$ a $H2O$', '$K2SO4$ a $H2$', '$K2S$ a $H2O$'],
      answer: 0,
      explain: '$H2SO4 + 2KOH -> K2SO4 + 2H2O$. Síranový anion $SO4^2-$ potřebuje dva kationty $K^+$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec soli, která vzniká neutralizací kyseliny chlorovodíkové hydroxidem vápenatým.',
      accept: ['CaCl2'],
      caseSensitive: true,
      placeholder: 'např. NaCl',
      explain: '$2HCl + Ca(OH)2 -> CaCl2 + 2H2O$. Vzniká chlorid vápenatý.',
    },
    {
      kind: 'tf',
      q: 'Při neutralizaci se teplo spotřebovává, takže se roztok ochladí.',
      answer: false,
      explain: 'Neutralizace je exotermní, roztok se zahřívá. U silných kyselin a zásad se uvolní asi 57 kJ na mol vody.',
    },
    {
      kind: 'number',
      q: 'Na 20,0 cm^{3} kyseliny chlorovodíkové se spotřebovalo 12,5 cm^{3} $NaOH$ o koncentraci 0,160 mol/dm^{3}. Jaká je koncentrace $HCl$?',
      answer: 0.1,
      tolerance: 0.002,
      unit: 'mol/dm³',
      explain: '$n(NaOH)$ = 0,160 · 0,0125 = 0,00200 mol = $n(HCl)$; $c$ = 0,00200 : 0,0200 = 0,100 mol/dm^{3}.',
    },
    {
      kind: 'number',
      q: 'Kolik cm^{3} roztoku $NaOH$ o koncentraci 0,100 mol/dm^{3} spotřebuješ na neutralizaci 10,0 cm^{3} kyseliny sírové o koncentraci 0,050 mol/dm^{3}?',
      answer: 10,
      tolerance: 0.1,
      unit: 'cm³',
      explain: '$n(H2SO4)$ = 0,050 · 0,0100 = 0,00050 mol; $NaOH$ je potřeba dvakrát víc, 0,00100 mol; $V$ = 0,00100 : 0,100 = 0,0100 dm^{3} = 10 cm^{3}.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k pomůcce nebo pojmu jeho úlohu při titraci.',
      pairs: [
        ['byreta', 'přikapává se z ní odměrný roztok'],
        ['pipeta', 'odměří přesný objem vzorku'],
        ['indikátor', 'změnou barvy ukáže konec titrace'],
        ['bod ekvivalence', 'kyselina a zásada zreagovaly v poměru podle rovnice'],
      ],
      explain: 'Byreta dávkuje a měří spotřebu, pipeta odměřuje vzorek, indikátor signalizuje bod ekvivalence.',
    },
    {
      kind: 'multi',
      q: 'Které děje jsou neutralizace?',
      options: [
        '$HCl + KOH -> KCl + H2O$',
        'lék s $Mg(OH)2$ reaguje se žaludeční kyselinou',
        'vápnění kyselé půdy',
        '$2H2 + O2 -> 2H2O$',
        'rozpouštění cukru ve vodě',
      ],
      answers: [0, 1, 2],
      explain: 'Ve všech třech případech zásaditá látka odstraňuje kyselinu. Hoření vodíku je syntéza a rozpouštění cukru není chemická reakce.',
    },
    {
      kind: 'tf',
      q: 'Rychlý vzorec $c_{1}·V_{1} = c_{2}·V_{2}$ platí i pro titraci kyseliny sírové hydroxidem sodným.',
      answer: false,
      explain: 'Kyselina sírová reaguje s $NaOH$ v poměru 1 : 2, takže je nutné počítat přes látková množství a poměr z rovnice.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-5 Soli a jejich názvosloví                                       */
/* ------------------------------------------------------------------ */

const l55: Lesson = {
  id: 'l5-5',
  title: 'Soli a jejich názvosloví',
  goals: [
    'Uvést způsoby přípravy solí a zapsat je rovnicemi',
    'Pojmenovat soli kyslíkatých kyselin, hydrogensoli a hydráty a sestavit jejich vzorce',
    'Podle pravidel rozpustnosti předpovědět, zda vznikne sraženina',
    'Vyjmenovat důležité soli z běžného života a jejich použití',
  ],
  hook: 'Sůl na talíři je jen jedna z tisíců solí. Křída, sádra, jedlá soda, hnojivo na zahradě i modrá skalice ve vinici jsou taky soli. Zvládneš je všechny pojmenovat?',
  sections: [
    {
      title: 'Co je sůl a jak ji připravit',
      icon: 'salt',
      blocks: [
        {
          type: 'p',
          text: '**Soli** jsou iontové sloučeniny z **kationtu kovu** (nebo amonného kationtu $NH4^+$) a **aniontu kyseliny**. Můžeš si je představit jako kyselinu, ve které vodík nahradil kov.',
        },
        { type: 'diagram', id: 'salt-preparation', caption: 'Jak se v laboratoři připraví sůl.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'beaker', title: 'kyselina + hydroxid', text: 'neutralizace: $HCl + NaOH -> NaCl + H2O$' },
            { icon: 'coin', title: 'kyselina + neušlechtilý kov', text: '$Zn + 2HCl -> ZnCl2 + H2$' },
            { icon: 'powder', title: 'kyselina + oxid kovu', text: '$CuO + H2SO4 -> CuSO4 + H2O$' },
            { icon: 'mountain', title: 'kyselina + uhličitan', text: '$CaCO3 + 2HCl -> CaCl2 + H2O + CO2$' },
            { icon: 'test-tube', title: 'srážení roztoků dvou solí', text: '$AgNO3 + NaCl -> AgCl(s) + NaNO3$' },
            { icon: 'flame', title: 'kov + nekov (přímá syntéza)', text: '$2Na + Cl2 -> 2NaCl$' },
          ],
        },
        { type: 'reaction', equation: 'Zn + 2HCl -> ZnCl2 + H2', caption: 'kyselina + kov: chlorid zinečnatý a bublinky vodíku' },
        {
          type: 'p',
          text: 'S kyselinou chlorovodíkovou za vzniku vodíku reagují jen **neušlechtilé kovy**, třeba zinek, železo nebo hořčík. Ušlechtilá měď, stříbro nebo zlato s ní nereagují. Proč, vysvětlí řada reaktivity kovů v úrovni 6.',
        },
        { type: 'reaction', equation: 'CaCO3 + 2HCl -> CaCl2 + H2O + CO2', caption: 'kyselina + uhličitan: sůl, voda a bublinky oxidu uhličitého' },
        { type: 'reaction', equation: 'CuO + H2SO4 -> CuSO4 + H2O', caption: 'kyselina + oxid kovu: modrý roztok síranu měďnatého' },
        {
          type: 'callout',
          variant: 'tip',
          text: 'U kovu uvidíš bublinky vodíku, u uhličitanu bublinky $CO2$. Proto šumí vodní kámen (uhličitan vápenatý), když ho poliješ octem.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Vodík z reakce kovu s kyselinou je hořlavý a se vzduchem tvoří výbušnou směs. Pracuj s malými množstvími, v brýlích a daleko od plamene.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Při které reakci vzniká sůl, voda a oxid uhličitý?',
            options: [
              'uhličitan vápenatý + kyselina chlorovodíková',
              'zinek + kyselina chlorovodíková',
              'oxid měďnatý + kyselina sírová',
              'hydroxid sodný + kyselina chlorovodíková',
            ],
            answer: 0,
            explain: 'Uhličitany s kyselinou uvolňují $CO2$: $CaCO3 + 2HCl -> CaCl2 + H2O + CO2$. Zinek dá vodík, oxid a hydroxid jen sůl a vodu.',
          },
        },
      ],
    },
    {
      title: 'Názvosloví solí kyslíkatých kyselin',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: 'Název soli = **podstatné jméno podle aniontu** + **přídavné jméno podle kationtu**. Soli bezkyslíkatých kyselin znáš z lekce 3-6 (chlorid sodný). U kyslíkatých kyselin se koncovka změní takto:',
        },
        {
          type: 'table',
          headers: ['Kyselina', 'Oxidační číslo', 'Anion', 'Název aniontu'],
          rows: [
            ['chlorná $HClO$', 'I', '$ClO^-$', 'chlor**nan**'],
            ['dusitá $HNO2$', 'III', '$NO2^-$', 'dusi**tan**'],
            ['siřičitá $H2SO3$', 'IV', '$SO3^2-$', 'siřiči**tan**'],
            ['uhličitá $H2CO3$', 'IV', '$CO3^2-$', 'uhliči**tan**'],
            ['dusičná $HNO3$', 'V', '$NO3^-$', 'dusič**nan**'],
            ['fosforečná $H3PO4$', 'V', '$PO4^3-$', 'fosforeč**nan**'],
            ['sírová $H2SO4$', 'VI', '$SO4^2-$', 'sír**an**'],
            ['chloristá $HClO4$', 'VII', '$ClO4^-$', 'chloris**tan**'],
            ['manganistá $HMnO4$', 'VII', '$MnO4^-$', 'manganis**tan**'],
          ],
        },
        {
          type: 'molecule',
          molecules: ['NO3-', 'SO4^2-', 'CO3^2-', 'PO4^3-'],
          labels: ['dusičnan $NO3^-$', 'síran $SO4^2-$', 'uhličitan $CO3^2-$', 'fosforečnan $PO4^3-$'],
          caption: 'Nejčastější víceatomové anionty: náboj odpovídá počtu vodíků, které kyselina odevzdala.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '-ná -> -nan, -itá -> -itan, -ičitá -> -ičitan, -ičná/-ečná -> -ičnan/-ečnan, -ová -> -an, -istá -> -istan. ==Náboj aniontu se rovná počtu vodíků, které kyselina odevzdala.==',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'flask', title: 'Kyselina', text: 'dusičnan -> kyselina dusičná $HNO3$' },
            { icon: 'ion-minus', title: 'Anion', text: 'odtrhni $H^+$: zbude $NO3^-$' },
            { icon: 'ion-plus', title: 'Kation', text: 'vápenatý -> $Ca^{2+}$' },
            { icon: 'balance-scale', title: 'Vyrovnej náboje', text: '+2 potřebuje dva $NO3^-$, víceatomový anion do závorky' },
            { icon: 'salt', title: 'Sůl', text: '$Ca(NO3)2$, dusičnan vápenatý' },
          ],
          caption: 'Od kyseliny přes anion k soli.',
        },
        {
          type: 'example',
          problem: 'Pojmenuj $Fe2(SO4)3$.',
          steps: [
            'Anion $SO4^2-$ je síran (z kyseliny sírové).',
            'Tři sírany nesou dohromady náboj 3 · (−2) = −6.',
            'Dva atomy železa tedy mají dohromady +6, každý +3: $Fe^{III}$ -> železitý.',
          ],
          answer: '$Fe2(SO4)3$ je **síran železitý**.',
        },
        {
          type: 'example',
          problem: 'Napiš vzorec fosforečnanu vápenatého.',
          steps: [
            'Kyselina $H3PO4$ odevzdá tři $H^+$, anion je $PO4^3-$.',
            'Kation je $Ca^{2+}$. Nejmenší společný násobek nábojů 2 a 3 je 6.',
            '3 · (+2) = +6 a 2 · (−3) = −6, náboje se vyrovnají.',
          ],
          answer: '$Ca3(PO4)2$',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec uhličitanu sodného.',
            accept: ['Na2CO3'],
            caseSensitive: true,
            placeholder: 'např. K2SO4',
            explain: 'Uhličitan $CO3^2-$ (z $H2CO3$) a dva kationty $Na^+$: $Na2CO3$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj $KClO$.',
            accept: ['chlornan draselný'],
            explain: '$ClO^-$ pochází z kyseliny chlorné (Cl I), anion je chlornan; draslík je draselný.',
          },
        },
      ],
    },
    {
      title: 'Hydrogensoli',
      icon: 'ion-minus',
      blocks: [
        {
          type: 'p',
          text: 'Když si anion kyseliny část vodíků ponechá, vznikne **hydrogensůl** (předpona **hydrogen-** nebo **dihydrogen-**). Každý ponechaný vodík zmenší záporný náboj aniontu o 1.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'flask', title: '$H3PO4$', text: 'kyselina fosforečná' },
            { icon: 'ion-minus', title: '$H2PO4^-$', text: 'dihydrogenfosforečnan, náboj −1' },
            { icon: 'ion-minus', title: '$HPO4^2-$', text: 'hydrogenfosforečnan, náboj −2' },
            { icon: 'ion-minus', title: '$PO4^3-$', text: 'fosforečnan, náboj −3' },
          ],
          caption: 'Každý odevzdaný $H^+$ přidá aniontu jeden záporný náboj.',
        },
        { type: 'molecule', molecules: ['H2CO3', 'HCO3-', 'CO3^2-'], labels: ['kyselina uhličitá', 'hydrogenuhličitan', 'uhličitan'] },
        {
          type: 'table',
          headers: ['Anion', 'Náboj', 'Název aniontu', 'Příklad soli'],
          rows: [
            ['$HCO3^-$', '−1', 'hydrogenuhličitan', '$NaHCO3$, hydrogenuhličitan sodný'],
            ['$HSO4^-$', '−1', 'hydrogensíran', '$KHSO4$, hydrogensíran draselný'],
            ['$H2PO4^-$', '−1', 'dihydrogenfosforečnan', '$Ca(H2PO4)2$, dihydrogenfosforečnan vápenatý'],
            ['$HPO4^2-$', '−2', 'hydrogenfosforečnan', '$CaHPO4$, hydrogenfosforečnan vápenatý'],
            ['$PO4^3-$', '−3', 'fosforečnan', '$Na3PO4$, fosforečnan sodný'],
          ],
        },
        {
          type: 'example',
          problem: 'Napiš vzorec dihydrogenfosforečnanu sodného.',
          steps: [
            'Kyselina $H3PO4$ odevzdá jen jeden $H^+$ a dva si ponechá: $H2PO4^-$.',
            'Sodný znamená $Na^+$. Náboje +1 a −1 se vyrovnají v poměru 1 : 1.',
          ],
          answer: '$NaH2PO4$',
        },
        {
          type: 'example',
          problem: 'Pojmenuj $Mg(HCO3)2$.',
          steps: [
            'Anion $HCO3^-$ vznikl z kyseliny uhličité, která si ponechala jeden vodík: hydrogenuhličitan.',
            'Dva anionty s nábojem −1 vyrovnává $Mg^{2+}$: hořečnatý.',
          ],
          answer: '**hydrogenuhličitan hořečnatý**',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Hydrogenuhličitan sodný je **jedlá soda**. Při pečení se rozkládá a v kypřicím prášku navíc reaguje s kyselou složkou. Bublinky $CO2$ nakypří těsto.',
        },
        { type: 'reaction', equation: '2NaHCO3 -> Na2CO3 + H2O + CO2', caption: 'rozklad jedlé sody teplem' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec hydrogenuhličitanu vápenatého.',
            accept: ['Ca(HCO3)2'],
            caseSensitive: true,
            placeholder: 'např. Mg(HCO3)2',
            explain: '$Ca^{2+}$ potřebuje dva anionty $HCO3^-$: $Ca(HCO3)2$. Tahle sůl je rozpuštěná v tvrdé vodě a při varu z ní vzniká vodní kámen.',
          },
        },
      ],
    },
    {
      title: 'Hydráty: krystaly s vodou',
      icon: 'crystal',
      blocks: [
        {
          type: 'p',
          text: 'Některé soli krystalizují s pevně vázanou **krystalovou vodou**, říkáme jim **hydráty**. Ve vzorci se voda připojuje tečkou: $CuSO4·5H2O$ je **pentahydrát síranu měďnatého** (předpona + hydrát + název soli ve 2. pádě).',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'Řecké předpony',
          text: 'mono- (1), di- (2), tri- (3), tetra- (4), penta- (5), hexa- (6), hepta- (7), okta- (8), nona- (9), deka- (10); pro půl molekuly vody hemi-.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'krystal $CuSO4·5H2O$', items: [{ species: 'Cu^{2+}', count: 2 }, { species: 'SO4^2-', count: 2 }, { species: 'H2O', count: 10 }], state: 'solid', note: 'molekuly vody jsou pevně vázané v krystalu' },
          ],
          caption: 'Na každou vzorcovou jednotku $CuSO4$ připadá pět molekul krystalové vody.',
        },
        {
          type: 'table',
          headers: ['Vzorec', 'Název', 'Běžný název'],
          rows: [
            ['$CuSO4·5H2O$', 'pentahydrát síranu měďnatého', 'modrá skalice'],
            ['$FeSO4·7H2O$', 'heptahydrát síranu železnatého', 'zelená skalice'],
            ['$CaSO4·2H2O$', 'dihydrát síranu vápenatého', 'sádrovec'],
            ['$CaSO4·½H2O$', 'hemihydrát síranu vápenatého', 'pálená sádra'],
            ['$Na2CO3·10H2O$', 'dekahydrát uhličitanu sodného', 'krystalová soda'],
          ],
        },
        {
          type: 'example',
          problem: 'Jaká je molární hmotnost modré skalice $CuSO4·5H2O$?',
          steps: [
            '$M(CuSO4)$ = 63,5 + 32 + 4 · 16 = 159,5 g/mol.',
            '$M(5H2O)$ = 5 · 18 g/mol = 90 g/mol.',
            'Sečti: 159,5 g/mol + 90 g/mol = 249,5 g/mol.',
          ],
          answer: '$M(CuSO4·5H2O)$ = 249,5 g/mol',
        },
        { type: 'reaction', equation: 'CuSO4·5H2O -> CuSO4 + 5H2O', caption: 'zahřátím ztratí modrá skalice krystalovou vodu a zbělá' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Bílý bezvodý $CuSO4$ po kápnutí vody zase zmodrá, a proto slouží jako důkaz vody. Podobně tuhne sádra: pálená sádra přijme vodu a změní se zpět na tvrdý sádrovec.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj $Na2SO4·10H2O$.',
            accept: ['dekahydrát síranu sodného'],
            explain: 'Deset molekul vody = deka-, sůl $Na2SO4$ je síran sodný, ve 2. pádě síranu sodného. Říká se mu Glauberova sůl.',
          },
        },
      ],
    },
    {
      title: 'Rozpustnost solí a srážení',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Některé soli se ve vodě rozpouštějí výborně, jiné skoro vůbec. Když smícháš roztoky dvou solí a ionty se mohou spojit do nerozpustné soli, vyloučí se **sraženina**.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'Rozpustné',
              icon: 'drop',
              tone: 'good',
              points: [
                'všechny soli $Na^+$, $K^+$, $NH4^+$',
                'všechny dusičnany $NO3^-$',
                'chloridy $Cl^-$ (kromě $AgCl$, málo $PbCl2$)',
                'většina síranů $SO4^2-$ (kromě $BaSO4$, $PbSO4$, málo $CaSO4$)',
              ],
            },
            {
              title: 'Většinou nerozpustné',
              icon: 'powder',
              tone: 'bad',
              points: [
                'uhličitany $CO3^2-$ a fosforečnany $PO4^3-$ (kromě solí $Na^+$, $K^+$, $NH4^+$)',
                'hydroxidy $OH^-$ (kromě $NaOH$, $KOH$, $Ba(OH)2$, málo $Ca(OH)2$)',
              ],
            },
          ],
          caption: 'Pravidla rozpustnosti ve vodě',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'hned po smíchání $BaCl2$ a $Na2SO4$', items: [{ species: 'Ba^{2+}', count: 2 }, { species: 'Cl^-', count: 4 }, { species: 'Na^+', count: 4 }, { species: 'SO4^2-', count: 2 }], state: 'solution' },
            { label: 'po chvíli', items: [{ species: 'BaSO4', count: 2 }, { species: 'Na^+', count: 4 }, { species: 'Cl^-', count: 4 }], state: 'solution', note: 'bílá sraženina $BaSO4$ klesá ke dnu' },
          ],
          arrows: true,
        },
        { type: 'reaction', equation: 'BaCl2 + Na2SO4 -> BaSO4(s) + 2NaCl', caption: 'vzniká bílá sraženina síranu barnatého' },
        {
          type: 'example',
          problem: 'Vznikne sraženina, když smícháš roztoky $BaCl2$ a $Na2SO4$?',
          steps: [
            'V roztoku jsou ionty $Ba^{2+}$, $Cl^-$, $Na^+$ a $SO4^2-$.',
            'Nové kombinace: $NaCl$ je rozpustný, $BaSO4$ nerozpustný.',
            'Iontová rovnice: $Ba^{2+} + SO4^2- -> BaSO4(s)$.',
          ],
          answer: 'Ano, vznikne bílá sraženina síranu barnatého.',
        },
        { type: 'reaction', equation: 'AgNO3 + NaCl -> AgCl(s) + NaNO3', caption: 'bílá sraženina chloridu stříbrného' },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Rozpustné barnaté soli jsou jedovaté, a přesto pacienti před rentgenem pijí „baryovou kaši“ se síranem barnatým. Je tak nerozpustný, že se v těle téměř nevstřebá, a přitom dobře pohlcuje rentgenové záření.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které soli jsou ve vodě dobře rozpustné?',
            options: ['$KNO3$', '$(NH4)2SO4$', '$AgCl$', '$CaCO3$', '$Na3PO4$'],
            answers: [0, 1, 4],
            explain: 'Soli draslíku, sodíku a amonné soli jsou rozpustné. $AgCl$ a $CaCO3$ patří k výjimkám, které tvoří sraženiny.',
          },
        },
      ],
    },
    {
      title: 'Soli kolem nás',
      icon: 'magnifier',
      blocks: [
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: 'chlorid sodný $NaCl$', text: 'kuchyňská sůl, posyp silnic, fyziologický roztok (0,9 %)' },
            { icon: 'mountain', title: 'uhličitan vápenatý $CaCO3$', text: 'vápenec, mramor, křída, vodní kámen, skořápky' },
            { icon: 'bread', title: 'hydrogenuhličitan sodný $NaHCO3$', text: 'jedlá soda, kypřicí prášek, šumivé tablety' },
            { icon: 'bone', title: 'hemihydrát síranu vápenatého $CaSO4·½H2O$', text: 'sádra, sádrové obvazy a odlitky' },
            { icon: 'leaf', title: 'pentahydrát síranu měďnatého $CuSO4·5H2O$', text: 'postřik proti plísním ve vinicích, hubení řas' },
            { icon: 'soap', title: 'chlornan sodný $NaClO$', text: 'bělicí a dezinfekční prostředky na WC' },
            { icon: 'drop', title: 'manganistan draselný $KMnO4$', text: 'dezinfekce („hypermangan“)' },
            { icon: 'hazard', title: 'dusitan sodný $NaNO2$', text: 'rychlosůl na maso (E250), ve větším množství jedovatý' },
          ],
        },
        {
          type: 'p',
          text: '**Průmyslová hnojiva** (NPK) dodávají rostlinám dusík, fosfor a draslík. Obsahují třeba dusičnan amonný $NH4NO3$, síran amonný $(NH4)2SO4$, $Ca(H2PO4)2$ nebo $KCl$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Nikdy nemíchej čisticí prostředek s chlornanem sodným s kyselým čističem na WC ani s octem! Uvolní se jedovatý chlor.',
        },
        { type: 'reaction', equation: 'NaClO + 2HCl -> NaCl + Cl2 + H2O', caption: 'chlornan + kyselina -> jedovatý plynný chlor' },
        { type: 'game', gameId: 'naming', text: 'Soli jsou v Názvoslovném trenažéru královská disciplína. Zkus kolo se solemi kyslíkatých kyselin a hydráty.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k běžnému názvu vzorec.',
            pairs: [
              ['modrá skalice', '$CuSO4·5H2O$'],
              ['jedlá soda', '$NaHCO3$'],
              ['vápenec', '$CaCO3$'],
              ['hypermangan', '$KMnO4$'],
              ['sádrovec', '$CaSO4·2H2O$'],
            ],
            explain: 'Modrá skalice je pentahydrát síranu měďnatého, jedlá soda hydrogenuhličitan sodný, vápenec uhličitan vápenatý, hypermangan manganistan draselný a sádrovec dihydrát síranu vápenatého.',
          },
        },
      ],
    },
  ],
  summary: [
    'Soli vznikají reakcí kyseliny s hydroxidem, kovem, oxidem kovu nebo uhličitanem, dále srážením a přímou syntézou z prvků.',
    'Anionty kyslíkatých kyselin: -ná -> -nan, -itá -> -itan, -ičitá -> -ičitan, -ičná/-ečná -> -ičnan/-ečnan, -ová -> -an, -istá -> -istan.',
    'Náboj aniontu se rovná počtu odevzdaných vodíků: $NO3^-$, $SO4^2-$, $PO4^3-$.',
    'Hydrogensoli si ponechávají vodík: $NaHCO3$ je hydrogenuhličitan sodný, $NaH2PO4$ dihydrogenfosforečnan sodný.',
    'Hydráty obsahují krystalovou vodu: $CuSO4·5H2O$ je pentahydrát síranu měďnatého.',
    'Sodné, draselné a amonné soli a všechny dusičnany jsou rozpustné; $AgCl$, $BaSO4$ a $CaCO3$ ne.',
  ],
  quiz: [
    {
      kind: 'text',
      q: 'Napiš vzorec síranu hlinitého.',
      accept: ['Al2(SO4)3'],
      caseSensitive: true,
      placeholder: 'např. Fe2(SO4)3',
      explain: '$Al^{3+}$ a $SO4^2-$: nejmenší společný násobek je 6, tedy 2 $Al^{3+}$ a 3 $SO4^2-$: $Al2(SO4)3$.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj $NaNO2$.',
      accept: ['dusitan sodný'],
      explain: '$NO2^-$ pochází z kyseliny dusité (N III), anion je dusitan.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj $K2HPO4$.',
      accept: ['hydrogenfosforečnan draselný'],
      explain: 'Anion $HPO4^2-$ si ponechal jeden vodík z $H3PO4$: hydrogenfosforečnan. Dva $K^+$ vyrovnají náboj −2.',
    },
    {
      kind: 'choice',
      q: 'Jak se jmenuje $Mg(ClO4)2$?',
      options: ['chloristan hořečnatý', 'chlorečnan hořečnatý', 'chlornan hořečnatý', 'chlorid hořečnatý'],
      answer: 0,
      explain: 'V $ClO4^-$ má chlor oxidační číslo VII (x − 8 = −1), anion je chloristan.',
    },
    {
      kind: 'tf',
      q: 'Všechny dusičnany jsou ve vodě rozpustné.',
      answer: true,
      explain: 'Dusičnany patří spolu se solemi sodíku, draslíku a amonnými solemi mezi vždy rozpustné.',
    },
    {
      kind: 'tf',
      q: 'Když smícháš roztoky $NaCl$ a $KNO3$, vznikne sraženina.',
      answer: false,
      explain: 'Možné kombinace $NaNO3$ a $KCl$ jsou obě rozpustné, ionty zůstanou v roztoku.',
    },
    {
      kind: 'number',
      q: 'Jaká je molární hmotnost sádrovce $CaSO4·2H2O$?',
      answer: 172,
      unit: 'g/mol',
      explain: '40 + 32 + 4 · 16 + 2 · 18 = 136 + 36 = 172 g/mol.',
    },
    {
      kind: 'order',
      q: 'Seřaď anionty podle rostoucího oxidačního čísla chloru.',
      items: ['chlorid', 'chlornan', 'chloritan', 'chlorečnan', 'chloristan'],
      explain: 'Chlorid −I, chlornan I, chloritan III, chlorečnan V, chloristan VII.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l5-6 Teorie kyselin a zásad podle Brønsteda                         */
/* ------------------------------------------------------------------ */

const l56: Lesson = {
  id: 'l5-6',
  title: 'Teorie kyselin a zásad podle Brønsteda',
  goals: [
    'Určit v reakci Brønstedovu kyselinu a zásadu a najít konjugované páry',
    'Vysvětlit, co je amfoterní látka, na příkladu vody a $HCO3^-$',
    'Rozlišit silné a slabé kyseliny a zásady a spočítat stupeň disociace',
    'Předpovědět, zda je roztok soli kyselý, neutrální, nebo zásaditý',
  ],
  hook: 'Postav otevřenou láhev čpavku vedle láhve kyseliny chlorovodíkové a nad hrdly se objeví bílý dým. Žádná voda, žádné $OH^-$, a přece reakce kyseliny se zásadou. Arrhenius by tu byl v koncích.',
  sections: [
    {
      title: 'Kyselina dává, zásada bere',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Arrheniova teorie funguje jen ve vodě a amoniak vysvětluje špatně. V roce 1923 proto Dán Johannes **Brønsted** a Angličan Thomas **Lowry** nezávisle navrhli obecnější definici založenou na předávání **protonu** $H^+$.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Arrhenius', icon: 'drop', tone: 'a', points: ['kyselina uvolňuje ve vodě $H^+$', 'zásada uvolňuje ve vodě $OH^-$', 'platí jen ve vodných roztocích', 'amoniak vysvětlí jen s obtížemi'] },
            { title: 'Brønsted a Lowry', icon: 'ion-plus', tone: 'b', points: ['kyselina je **donor protonu**', 'zásada je **akceptor protonu**', 'funguje i bez vody, třeba mezi plyny', 'amoniak je zásada, protože přijme $H^+$'] },
          ],
        },
        {
          type: 'keyterms',
          items: [
            { term: 'Brønstedova kyselina', def: '**donor protonu**: částice, která $H^+$ odevzdá' },
            { term: 'Brønstedova zásada', def: '**akceptor protonu**: částice, která $H^+$ přijme; potřebuje k tomu volný elektronový pár' },
            { term: 'acidobazická reakce', def: 'přenos protonu z kyseliny na zásadu' },
          ],
        },
        { type: 'formula', text: '$HCl + H2O -> H3O^+ + Cl^-$', caption: '$HCl$ je kyselina (odevzdá $H^+$), voda je tady zásada (přijme ho).' },
        { type: 'formula', text: '$NH3 + H2O <=> NH4^+ + OH^-$', caption: 'Tady je naopak voda kyselinou a amoniak zásadou.' },
        {
          type: 'p',
          text: 'A bílý dým z úvodu? Plynný chlorovodík předá proton plynnému amoniaku a vznikne jemný prášek chloridu amonného. Voda ani hydroxidové anionty k tomu nejsou potřeba.',
        },
        { type: 'reaction', equation: 'HCl(g) + NH3(g) -> NH4Cl(s)', caption: 'proton přeskočí z $HCl$ na $NH3$ přímo v plynné fázi' },
        {
          type: 'particles',
          boxes: [
            { label: 'páry nad hrdly lahví', items: [{ species: 'HCl', count: 3 }, { species: 'NH3', count: 3 }], state: 'gas' },
            { label: 'bílý dým', items: [{ species: 'NH4Cl', count: 3 }], state: 'solid', note: 'drobné krystalky $NH4Cl$' },
          ],
          arrows: true,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Kyselina je donor protonu, zásada je akceptor protonu.== Kyselinou nebo zásadou látka není sama o sobě, rozhoduje, co v dané reakci dělá.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která částice je v reakci $HNO3 + H2O -> H3O^+ + NO3^-$ Brønstedovou zásadou?',
            options: ['$H2O$', '$HNO3$', '$H3O^+$'],
            answer: 0,
            explain: 'Voda přijme proton od kyseliny dusičné a stane se z ní $H3O^+$. Přijímat proton je úloha zásady.',
          },
        },
      ],
    },
    {
      title: 'Konjugované páry',
      icon: 'equilibrium',
      blocks: [
        {
          type: 'p',
          text: 'Když kyselina odevzdá proton, to, co z ní zbude, ho může zase přijmout: zbytek kyseliny je tedy zásada. Kyselina a zásada, které se liší právě o jeden proton, tvoří **konjugovaný pár**.',
        },
        { type: 'formula', text: '$HA <=> A^- + H^+$', caption: 'kyselina $HA$ a její konjugovaná zásada $A^-$' },
        {
          type: 'molecule',
          molecules: ['NH4+', 'NH3', 'H3O+', 'H2O'],
          labels: ['kyselina $NH4^+$', 'konjugovaná zásada $NH3$', 'kyselina $H3O^+$', 'konjugovaná zásada $H2O$'],
          caption: 'Dva konjugované páry: kyselina má vždy o jeden proton víc než její zásada.',
        },
        {
          type: 'table',
          headers: ['Kyselina', 'odevzdá', 'Konjugovaná zásada'],
          rows: [
            ['$HCl$', '$H^+$ ->', '$Cl^-$'],
            ['$H2SO4$', '$H^+$ ->', '$HSO4^-$'],
            ['$H3O^+$', '$H^+$ ->', '$H2O$'],
            ['$H2O$', '$H^+$ ->', '$OH^-$'],
            ['$NH4^+$', '$H^+$ ->', '$NH3$'],
            ['$HCO3^-$', '$H^+$ ->', '$CO3^2-$'],
          ],
        },
        {
          type: 'example',
          problem: 'Najdi konjugované páry v reakci $NH3 + H2O <=> NH4^+ + OH^-$.',
          steps: [
            '$NH3$ přijme proton a stane se z něj $NH4^+$: pár $NH4^+$/$NH3$.',
            'Voda proton odevzdá a zbude $OH^-$: pár $H2O$/$OH^-$.',
            'Pár zapisuj vždy v pořadí kyselina/zásada.',
          ],
          answer: 'Konjugované páry jsou $NH4^+$/$NH3$ a $H2O$/$OH^-$.',
        },
        {
          type: 'compare',
          columns: [
            { title: '$HCl$: silná kyselina', icon: 'lightning', tone: 'a', points: ['odevzdává $H^+$ velmi ochotně', 'její konjugovaná zásada $Cl^-$ proton skoro vůbec nepřijímá'] },
            { title: '$NH4^+$: slabá kyselina', icon: 'equilibrium', tone: 'b', points: ['odevzdává $H^+$ neochotně', 'její konjugovaná zásada $NH3$ proton ochotně přijímá'] },
          ],
          caption: 'Čím silnější kyselina, tím slabší je její konjugovaná zásada.',
        },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď ke kyselině její konjugovanou zásadu.',
            pairs: [
              ['$HNO3$', '$NO3^-$'],
              ['$H2PO4^-$', '$HPO4^2-$'],
              ['$NH4^+$', '$NH3$'],
              ['$H3O^+$', '$H2O$'],
            ],
            explain: 'Konjugovaná zásada má vždy o jeden proton méně, a proto i o jeden kladný náboj méně.',
          },
        },
      ],
    },
    {
      title: 'Amfoterní látky',
      icon: 'arrow-cycle',
      blocks: [
        {
          type: 'p',
          text: 'Některé částice umějí proton odevzdat i přijmout, podle toho, s kým se potkají. Říká se jim **amfoterní látky** neboli **amfolyty**. Nejdůležitějším amfolytem je voda.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Voda jako zásada', icon: 'ion-plus', tone: 'a', points: ['s chlorovodíkem proton přijme', '$H2O + HCl -> H3O^+ + Cl^-$'] },
            { title: 'Voda jako kyselina', icon: 'ion-minus', tone: 'b', points: ['s amoniakem proton odevzdá', '$H2O + NH3 <=> OH^- + NH4^+$'] },
            { title: 'Obojí najednou', icon: 'drop', tone: 'c', points: ['sama se sebou: autoprotolýza (lekce 5-3)', '$H2O + H2O <=> H3O^+ + OH^-$'] },
          ],
        },
        {
          type: 'p',
          text: 'Dalším amfolytem je **hydrogenuhličitanový anion** $HCO3^-$ z jedlé sody:',
        },
        {
          type: 'molecule',
          molecules: ['H2CO3', 'HCO3-', 'CO3^2-'],
          labels: ['$H2CO3$: $HCO3^-$ přijal proton', 'amfolyt $HCO3^-$', '$CO3^2-$: $HCO3^-$ odevzdal proton'],
        },
        {
          type: 'formula',
          text: '$HCO3^- + H3O^+ -> H2CO3 + H2O$',
          caption: 'jako zásada přijme proton; vzniklá $H2CO3$ se rozpadá na $CO2$ a vodu',
        },
        { type: 'formula', text: '$HCO3^- + OH^- -> CO3^2- + H2O$', caption: 'jako kyselina proton odevzdá' },
        {
          type: 'p',
          text: 'Amfoterní jsou i některé hydroxidy, například $Al(OH)3$. Rozpustí se v kyselině i v roztoku hydroxidu sodného.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Hydrogenuhličitan v krvi funguje jako tlumič: zachytí nadbytečnou kyselinu i zásadu, a proto pH krve kolísá jen o setiny. Takovým soustavám se říká pufry a podrobně je probereme v úrovni 6.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které částice jsou amfoterní?',
            options: ['$H2O$', '$HCO3^-$', '$H2PO4^-$', '$Cl^-$', '$Na^+$'],
            answers: [0, 1, 2],
            explain: 'Voda, $HCO3^-$ i $H2PO4^-$ mají proton, který mohou odevzdat, a zároveň mohou další proton přijmout. $Cl^-$ proton prakticky nepřijímá a $Na^+$ nemá žádný.',
          },
        },
      ],
    },
    {
      title: 'Silné a slabé kyseliny a zásady',
      icon: 'lightning',
      blocks: [
        {
          type: 'p',
          text: '**Silné kyseliny** odevzdají vodě proton prakticky ze všech molekul, disociují úplně. **Slabé kyseliny** disociují jen z malé části a většina molekul zůstane celá, proto v rovnici píšeme obousměrnou šipku.',
        },
        {
          type: 'particles',
          boxes: [
            { label: '$HCl$: silná', items: [{ species: 'H3O+', count: 5 }, { species: 'Cl^-', count: 5 }, { species: 'H2O', count: 4 }], state: 'solution', note: 'disociováno 100 %' },
            { label: 'kyselina octová: slabá', items: [{ species: 'acetic-acid', count: 5 }, { species: 'H3O+', count: 1 }, { species: 'CH3COO^-', count: 1 }, { species: 'H2O', count: 4 }], state: 'solution', note: 'většina molekul zůstane celá' },
          ],
          caption: 'Stejná koncentrace kyseliny, ale úplně jiný počet kationtů $H3O^+$.',
        },
        {
          type: 'formula',
          text: '$CH3COOH + H2O <=> CH3COO^- + H3O^+$',
          caption: 'Kyselina octová je slabá: v roztoku o koncentraci 0,1 mol/dm^{3} je disociováno jen asi 1,3 % molekul.',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Silné', icon: 'lightning', tone: 'a', points: ['disociují úplně, šipka ->', 'kyseliny: $HCl$, $HBr$, $HI$, $HNO3$, $H2SO4$, $HClO4$', 'zásady: $NaOH$, $KOH$, $Ca(OH)2$, $Ba(OH)2$'] },
            { title: 'Slabé', icon: 'equilibrium', tone: 'b', points: ['disociují částečně, šipka <=>', 'kyseliny: $CH3COOH$, $H2CO3$, $H2S$, $HF$, $HNO2$', 'zásada: $NH3$'] },
          ],
          caption: 'Slabá neznamená neškodná: $HF$ je slabá kyselina, a přesto patří k nejnebezpečnějším.',
        },
        {
          type: 'p',
          text: 'Jak velká část elektrolytu se rozštěpila na ionty, udává **stupeň disociace** $α$: podíl disociovaných molekul ze všech rozpuštěných. Nabývá hodnot od 0 do 1 a často se uvádí v procentech.',
        },
        { type: 'formula', text: '$α = [H3O^+] / c(HA)$', caption: 'pro slabou kyselinu $HA$ rozpuštěnou ve vodě' },
        {
          type: 'example',
          problem: 'Kyselina octová o koncentraci 0,10 mol/dm^{3} má $[H3O^+]$ = 1,3·10^{-3} mol/dm^{3}. Urči stupeň disociace a pH a porovnej je s kyselinou chlorovodíkovou stejné koncentrace.',
          steps: [
            'α = 0,0013 mol/dm^{3} : 0,10 mol/dm^{3} = 0,013, tedy 1,3 %.',
            'pH = −log 0,0013 ≈ 2,9.',
            'Kyselina chlorovodíková o koncentraci 0,10 mol/dm^{3} je disociovaná úplně (α = 1), $[H3O^+]$ = 0,10 mol/dm^{3} a pH = 1.',
          ],
          answer: 'α = 1,3 %, pH ≈ 2,9 (kyselina chlorovodíková: pH 1)',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Silná není totéž co koncentrovaná',
          text: '**Síla** kyseliny říká, jak ochotně odevzdává proton. **Koncentrace** říká, kolik kyseliny je v roztoku. Velmi zředěná $HCl$ je pořád silná kyselina, octová esence pořád slabá. Přesněji sílu vyjadřuje disociační konstanta, tu poznáš v úrovni 6.',
        },
        {
          type: 'p',
          text: 'Slabá kyselina má i jinou titrační křivku: začíná výš, skok je menší a bod ekvivalence leží v zásadité oblasti (u kyseliny octové asi při pH 8,7). Proto se hodí fenolftalein, a ne methyloranž.',
        },
        {
          type: 'diagram',
          id: 'titration-curve',
          props: { kind: 'weak-strong' },
          caption: 'Titrace slabé kyseliny silnou zásadou: bod ekvivalence leží nad pH 7.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Kyselina octová o koncentraci 0,1 mol/dm^{3} má stejné pH jako kyselina chlorovodíková o stejné koncentraci.',
            answer: false,
            explain: 'Kyselina octová je slabá, disociuje jen asi z 1,3 %, a má pH kolem 2,9. Kyselina chlorovodíková disociuje úplně a má pH 1.',
          },
        },
      ],
    },
    {
      title: 'Hydrolýza solí',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Roztok soli nemusí být neutrální! Jedlá soda barví univerzální indikátor zelenomodře a hnojivo s chloridem amonným okyseluje půdu. Za to může **hydrolýza solí**, reakce iontů soli s vodou.',
        },
        {
          type: 'diagram',
          id: 'ph-scale',
          props: {
            marks: [
              { ph: 5.1, label: 'chlorid amonný' },
              { ph: 7, label: 'chlorid sodný' },
              { ph: 8.3, label: 'jedlá soda' },
              { ph: 11.6, label: 'soda' },
            ],
          },
          caption: 'Roztoky solí o koncentraci 0,1 mol/dm^{3}: kyselé, neutrální i zásadité.',
        },
        {
          type: 'p',
          text: 'Rozhoduje, z jak silné kyseliny a zásady sůl vznikla. Anion slabé kyseliny je konjugovaná zásada a bere vodě protony; kation slabé zásady, třeba $NH4^+$, protony vodě předává.',
        },
        {
          type: 'table',
          headers: ['Sůl', 'Vznikla z', 'Reakce s vodou', 'Roztok'],
          rows: [
            ['$NaCl$', 'silné kyseliny a silné zásady', 'ionty s vodou nereagují', 'neutrální, pH 7'],
            ['$Na2CO3$', 'slabé kyseliny a silné zásady', '$CO3^2- + H2O <=> HCO3^- + OH^-$', 'zásaditý, pH > 7'],
            ['$CH3COONa$', 'slabé kyseliny a silné zásady', '$CH3COO^- + H2O <=> CH3COOH + OH^-$', 'zásaditý, pH > 7'],
            ['$NH4Cl$', 'silné kyseliny a slabé zásady', '$NH4^+ + H2O <=> NH3 + H3O^+$', 'kyselý, pH < 7'],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          text: '==Roztok soli se chová podle silnějšího z „rodičů“.== Silná kyselina + slabá zásada -> kyselý roztok. Slabá kyselina + silná zásada -> zásaditý roztok. Obojí silné -> neutrální.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'soap', title: 'Soda $Na2CO3$ na praní', text: 'její zásaditý roztok pomáhá rozpouštět mastnotu' },
            { icon: 'fertilizer', title: 'Amonná hnojiva', text: 'kationty $NH4^+$ půdu postupně okyselují' },
            { icon: 'salt', title: 'Kuchyňská sůl $NaCl$', text: 'sůl silné kyseliny a silné zásady, roztok je neutrální' },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaký bude roztok uhličitanu draselného $K2CO3$?',
            options: ['zásaditý', 'kyselý', 'neutrální'],
            answer: 0,
            explain: '$K2CO3$ vznikl ze slabé kyseliny uhličité a silné zásady $KOH$. Anion $CO3^2-$ bere vodě protony a vznikají $OH^-$.',
          },
        },
      ],
    },
    {
      title: 'Lewisova teorie v kostce',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: 'Ještě obecnější pohled nabídl ve stejném roce 1923 Američan Gilbert N. **Lewis**. Nesleduje proton, ale **elektronový pár**.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'Lewisova kyselina', def: 'akceptor elektronového páru, např. $H^+$, $BF3$, $AlCl3$ nebo kationty kovů' },
            { term: 'Lewisova zásada', def: 'donor elektronového páru, např. $NH3$, $H2O$, $OH^-$, $Cl^-$' },
          ],
        },
        {
          type: 'molecule',
          molecules: ['BF3', 'NH3'],
          labels: ['$BF3$: přijme pár (Lewisova kyselina)', '$NH3$: poskytne pár (Lewisova zásada)'],
        },
        {
          type: 'formula',
          text: '$BF3 + NH3 -> F3B–NH3$',
          caption: 'Bor v $BF3$ má kolem sebe jen šest valenčních elektronů a volný pár dusíku rád přijme. Žádný proton, a přesto reakce kyseliny se zásadou.',
        },
        {
          type: 'p',
          text: 'Každá Brønstedova zásada je i Lewisovou zásadou: proton přijímá právě volným elektronovým párem. Lewisova teorie se hodí hlavně pro komplexy kovů (úroveň 7) a organické reakce (úroveň 8).',
        },
        {
          type: 'compare',
          columns: [
            { title: 'Arrhenius', icon: 'drop', tone: 'a', points: ['kyselina uvolní ve vodě $H^+$', 'zásada uvolní ve vodě $OH^-$'] },
            { title: 'Brønsted', icon: 'ion-plus', tone: 'b', points: ['kyselina je donor protonu', 'zásada je akceptor protonu'] },
            { title: 'Lewis', icon: 'electron', tone: 'c', points: ['kyselina je akceptor elektronového páru', 'zásada je donor elektronového páru'] },
          ],
          caption: 'Tři teorie, každá širší než ta předchozí.',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Arrhenius, Brønsted, Lewis: na běžné výpočty pH ti bohatě stačí Brønsted. Lewise si zatím jen pozdrav, potkáte se později.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Podle Lewise je kyselina akceptorem elektronového páru.',
            answer: true,
            explain: 'Lewisova kyselina elektronový pár přijímá (např. $BF3$, $H^+$), Lewisova zásada ho poskytuje.',
          },
        },
      ],
    },
  ],
  summary: [
    'Podle Brønsteda je kyselina donor protonu a zásada akceptor protonu.',
    'Kyselina a zásada, které se liší o jeden proton, tvoří konjugovaný pár, např. $NH4^+$/$NH3$.',
    'Amfoterní látky, jako voda nebo $HCO3^-$, mohou proton odevzdat i přijmout.',
    'Silné kyseliny a zásady disociují úplně, slabé jen částečně; míru udává stupeň disociace α.',
    'Hydrolýzou solí je roztok $Na2CO3$ zásaditý, $NH4Cl$ kyselý a $NaCl$ neutrální.',
    'Lewisova kyselina přijímá elektronový pár, Lewisova zásada ho poskytuje.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Jaká je konjugovaná zásada kyseliny sírové $H2SO4$?',
      options: ['$HSO4^-$', '$SO4^2-$', '$H3SO4^+$', '$SO3$'],
      answer: 0,
      explain: 'Konjugovaná zásada má o jeden proton méně: $H2SO4 -> HSO4^- + H^+$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec konjugované kyseliny amoniaku i s nábojem (náboj napiš za vzorec, třeba H3O+).',
      accept: ['NH4+', 'NH4^+', 'NH4^{+}'],
      caseSensitive: true,
      placeholder: 'např. H3O+',
      explain: 'Amoniak přijme proton a vznikne amonný kation $NH4^+$.',
    },
    {
      kind: 'tf',
      q: 'Voda může být Brønstedovou kyselinou i zásadou.',
      answer: true,
      explain: 'Voda je amfolyt: s $HCl$ proton přijímá, s $NH3$ ho odevzdává.',
    },
    {
      kind: 'tf',
      q: 'Zředěná kyselina chlorovodíková je slabá kyselina.',
      answer: false,
      explain: 'Síla nezávisí na koncentraci. $HCl$ disociuje úplně i ve zředěném roztoku, je to silná kyselina.',
    },
    {
      kind: 'number',
      q: 'Slabá kyselina o koncentraci 0,20 mol/dm^{3} má $[H3O^+]$ = 0,0020 mol/dm^{3}. Jaký je její stupeň disociace v procentech?',
      answer: 1,
      tolerance: 0.05,
      unit: '%',
      explain: 'α = 0,0020 : 0,20 = 0,010, tedy 1 %.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k soli, jaký bude její vodný roztok.',
      pairs: [
        ['$NaCl$', 'neutrální'],
        ['$NH4Cl$', 'kyselý'],
        ['$Na2CO3$', 'zásaditý'],
      ],
      explain: '$NaCl$ je sůl silné kyseliny a silné zásady, $NH4^+$ předává vodě protony a $CO3^2-$ je od vody bere.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých reakcích vystupuje voda jako Brønstedova kyselina?',
      options: [
        '$NH3 + H2O <=> NH4^+ + OH^-$',
        '$CO3^2- + H2O <=> HCO3^- + OH^-$',
        '$HCl + H2O -> H3O^+ + Cl^-$',
        '$NH4^+ + H2O <=> NH3 + H3O^+$',
      ],
      answers: [0, 1],
      explain: 'Kde z vody vzniká $OH^-$, voda proton odevzdala, byla tedy kyselinou. Kde vzniká $H3O^+$, proton přijala jako zásada.',
    },
    {
      kind: 'choice',
      q: 'Který indikátor zvolíš pro titraci kyseliny octové hydroxidem sodným?',
      options: ['fenolftalein (8,2–10,0)', 'methyloranž (3,1–4,4)', 'bromthymolová modř (6,0–7,6)'],
      answer: 0,
      explain: 'Bod ekvivalence slabé kyseliny se silnou zásadou leží asi při pH 8,7 a skok je v zásadité oblasti. Barvu v něm mění fenolftalein.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Závěrečná výzva                                                     */
/* ------------------------------------------------------------------ */

const boss: Question[] = [
  {
    kind: 'text',
    q: 'Napiš vzorec kyseliny jodisté.',
    accept: ['HIO4'],
    caseSensitive: true,
    placeholder: 'např. HClO4',
    explain: 'Koncovka -istá -> jod VII, liché číslo -> 1 H; O = (7 + 1) : 2 = 4. Vzorec je $HIO4$.',
  },
  {
    kind: 'text',
    q: 'Pojmenuj kyselinu $H2CrO4$.',
    accept: ['kyselina chromová', 'chromová'],
    explain: '2 · (+1) + x + 4 · (−2) = 0, chrom má VI a tomu odpovídá koncovka -ová: kyselina chromová.',
  },
  {
    kind: 'text',
    q: 'Napiš vzorec hydrogensíranu amonného.',
    accept: ['NH4HSO4'],
    caseSensitive: true,
    placeholder: 'např. KHSO4',
    explain: 'Kation $NH4^+$ a anion $HSO4^-$ mají náboje +1 a −1, spojí se 1 : 1: $NH4HSO4$.',
  },
  {
    kind: 'text',
    q: 'Napiš vzorec heptahydrátu síranu hořečnatého (hořká sůl). Tečku mezi solí a vodou můžeš napsat jako obyčejnou tečku.',
    accept: ['MgSO4·7H2O', 'MgSO4.7H2O'],
    caseSensitive: true,
    placeholder: 'např. CuSO4.5H2O',
    explain: 'Síran hořečnatý je $MgSO4$, hepta- znamená 7 molekul vody: $MgSO4·7H2O$.',
  },
  {
    kind: 'match',
    q: 'Přiřaď k názvu aniontu jeho vzorec.',
    pairs: [
      ['chlornan', '$ClO^-$'],
      ['chloritan', '$ClO2^-$'],
      ['chlorečnan', '$ClO3^-$'],
      ['chloristan', '$ClO4^-$'],
    ],
    explain: 'Oxidační číslo chloru roste I, III, V, VII a s ním i počet kyslíků. Náboj zůstává −1.',
  },
  {
    kind: 'number',
    q: 'Smícháš 50 cm^{3} $HCl$ o koncentraci 0,10 mol/dm^{3} a 40 cm^{3} $NaOH$ o koncentraci 0,10 mol/dm^{3}. Jaké pH má výsledný roztok?',
    answer: 1.95,
    tolerance: 0.05,
    explain: '$n(HCl)$ = 0,0050 mol, $n(NaOH)$ = 0,0040 mol. Zbude 0,0010 mol $HCl$ v 0,090 dm^{3}: $[H3O^+]$ = 0,011 mol/dm^{3}, pH = −log 0,011 ≈ 1,95.',
  },
  {
    kind: 'number',
    q: 'Kolik gramů $NaOH$ potřebuješ na přípravu 500 cm^{3} roztoku o pH 12? (M(NaOH) = 40 g/mol)',
    answer: 0.2,
    tolerance: 0.005,
    unit: 'g',
    explain: 'pH 12 -> pOH 2 -> $[OH^-]$ = 0,01 mol/dm^{3}. $n$ = 0,01 · 0,500 = 0,005 mol, $m$ = 0,005 · 40 = 0,2 g.',
  },
  {
    kind: 'number',
    q: 'Na 25,0 cm^{3} roztoku $Ba(OH)2$ se spotřebovalo 30,0 cm^{3} $HCl$ o koncentraci 0,100 mol/dm^{3}. Jaká je koncentrace $Ba(OH)2$?',
    answer: 0.06,
    tolerance: 0.001,
    unit: 'mol/dm³',
    explain: '$Ba(OH)2 + 2HCl -> BaCl2 + 2H2O$. $n(HCl)$ = 0,00300 mol, $n(Ba(OH)2)$ = 0,00150 mol, $c$ = 0,00150 : 0,0250 = 0,060 mol/dm^{3}.',
  },
  {
    kind: 'multi',
    q: 'Které vodné roztoky mají pH větší než 7?',
    options: ['$Na2CO3(aq)$', '$NH3(aq)$', '$NH4Cl(aq)$', '$KNO3(aq)$', '$NaHCO3(aq)$'],
    answers: [0, 1, 4],
    explain: 'Uhličitan a hydrogenuhličitan jsou soli slabé kyseliny a silné zásady, amoniak je slabá zásada. $NH4Cl$ je kyselý, $KNO3$ neutrální.',
  },
  {
    kind: 'choice',
    q: 'Smícháš roztoky $AgNO3$ a $CaCl2$. Která iontová rovnice popisuje vznik sraženiny?',
    options: [
      '$Ag^+ + Cl^- -> AgCl(s)$',
      '$Ca^{2+} + 2NO3^- -> Ca(NO3)2(s)$',
      '$Ag^+ + NO3^- -> AgNO3(s)$',
      '$Ca^{2+} + 2Cl^- -> CaCl2(s)$',
    ],
    answer: 0,
    explain: 'Dusičnany jsou vždy rozpustné a $CaCl2$ také. Nerozpustný je jen chlorid stříbrný.',
  },
  {
    kind: 'order',
    q: 'Seřaď roztoky o stejné koncentraci 0,1 mol/dm^{3} od nejnižšího pH po nejvyšší.',
    items: ['$HCl$', '$CH3COOH$', '$NH4Cl$', '$NaCl$', '$Na2CO3$', '$NaOH$'],
    explain: 'Silná kyselina (pH 1) < slabá kyselina (asi 2,9) < kyselá sůl (asi 5) < neutrální sůl (7) < zásaditá sůl (asi 11,6) < silná zásada (13).',
  },
  {
    kind: 'tf',
    q: 'V reakci $HCO3^- + OH^- -> CO3^2- + H2O$ vystupuje hydrogenuhličitan jako Brønstedova kyselina.',
    answer: true,
    explain: 'Hydrogenuhličitan tu odevzdá proton hydroxidovému aniontu, je tedy kyselinou. S $H3O^+$ by naopak byl zásadou, je to amfolyt.',
  },
]

const level: LevelContent = {
  lessons: {
    'l5-1': l51,
    'l5-2': l52,
    'l5-3': l53,
    'l5-4': l54,
    'l5-5': l55,
    'l5-6': l56,
  },
  boss,
}

export default level
