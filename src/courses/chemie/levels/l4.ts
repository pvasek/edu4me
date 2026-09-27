import type { LevelContent, Lesson, Question } from '../../../core/types'

// Úroveň 4 – Reakce a výpočty
// Zaokrouhlené relativní atomové hmotnosti (školní tabulky):
// H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, S 32, Cl 35,5, K 39, Ca 40, Fe 56, Cu 63,5
// Konstanty: N_A = 6,022·10^23 mol^−1, V_m = 22,4 dm^3/mol (normální podmínky), R = 8,314 J·K^−1·mol^−1

const l4_1: Lesson = {
  id: 'l4-1',
  title: 'Chemická reakce a zákon zachování hmotnosti',
  goals: [
    'Poznat chemickou reakci podle jejích znaků a pojmenovat reaktanty a produkty',
    'Vysvětlit zákon zachování hmotnosti a použít ho v jednoduchém výpočtu',
    'Přečíst chemickou rovnici kvalitativně i kvantitativně, včetně stavových symbolů',
    'Zapsat úplnou a zkrácenou iontovou rovnici jednoduché reakce',
  ],
  hook: 'Spálíš v krbu kilo dřeva a zbyde hrstka popela. Kam zmizelo skoro celé kilo? Spoiler: nikam. Chemie nic neztrácí, jen to umí pořádně schovat.',
  sections: [
    {
      title: 'Co se děje při chemické reakci',
      icon: 'flask',
      blocks: [
        {
          type: 'p',
          text: 'Při **chemické reakci** vznikají nové látky, kdežto při fyzikální změně (tání, var, rozpouštění) látka zůstává sama sebou. Vazby ve výchozích látkách se **štěpí** a **vznikají nové**. Atomy se neztrácejí ani nepřibývají, jen se přeskupí jako kostičky stavebnice do jiného modelu.',
        },
        {
          type: 'reaction',
          equation: '2H2 + O2 -> 2H2O',
          caption: 'Vazby H–H a O=O se rozbijí, vzniknou vazby O–H. Atomů je před reakcí i po ní stejně.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'reaktanty (výchozí látky)', def: 'látky, které do reakce vstupují; píšou se na levou stranu rovnice' },
            { term: 'produkty', def: 'látky, které reakcí vznikají; píšou se na pravou stranu' },
            { term: 'chemická rovnice', def: 'zápis reakce pomocí vzorců, např. $C + O2 -> CO2$' },
          ],
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'apple', title: 'změna barvy', text: 'hnědnutí rozkrojeného jablka, rezavění železa' },
            { icon: 'gas-cloud', title: 'vznik plynu (bublinky)', text: 'šumivá tableta ve vodě, ocet a jedlá soda' },
            { icon: 'test-tube', title: 'vznik sraženiny (zákalu)', text: 'vodní kámen v konvici' },
            { icon: 'flame', title: 'uvolnění tepla nebo světla', text: 'hořící svíčka, ohňostroj' },
            { icon: 'bread', title: 'změna vůně nebo chuti', text: 'kynutí těsta, kysnutí mléka' },
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Znak není důkaz',
          text: 'Bublinky vidíš i ve vroucí vodě, a přece jde jen o var, tedy fyzikální změnu. Rozhodující je jediné: ==vznikla nová látka s jinými vlastnostmi?== Znaky ti jen napoví, kde hledat.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Ve kterých dějích probíhá chemická reakce?',
            options: ['pečení palačinky', 'tání ledu v limonádě', 'rezavění plotu', 'rozpuštění cukru v čaji', 'hoření plynu na sporáku'],
            answers: [0, 2, 4],
            explain: 'Při pečení, rezavění a hoření vznikají nové látky. Tání a rozpouštění jsou fyzikální změny: voda i cukr zůstávají vodou a cukrem.',
          },
        },
      ],
    },
    {
      title: 'Zákon zachování hmotnosti',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Kolem roku 1756 zahříval ruský vědec **Michail Lomonosov** kovy v zatavených skleněných nádobách a celková hmotnost se po reakci nezměnila. Nezávisle na něm to roku 1774 přesným vážením potvrdil Francouz **Antoine Lavoisier**.',
        },
        {
          type: 'diagram',
          id: 'conservation-of-mass',
          caption: 'Uzavřená nádoba na vahách: před reakcí i po ní ukazuje váha totéž.',
        },
        {
          type: 'formula',
          text: '$m(reaktantů) = m(produktů)$',
          caption: 'zákon zachování hmotnosti: v uzavřené soustavě se celková hmotnost při reakci nemění',
        },
        {
          type: 'particles',
          arrows: true,
          boxes: [
            { label: 'před reakcí: železo + síra', items: [{ species: 'Fe', count: 4 }, { species: 'S', count: 4 }], state: 'solid', note: '4 atomy Fe, 4 atomy S' },
            { label: 'po reakci: sulfid železnatý', items: [{ species: 'FeS', count: 4 }], state: 'solid', note: '4 atomy Fe, 4 atomy S' },
          ],
          caption: 'Proč zákon platí? Atomy se jen přeskupí. Kolik jich do reakce vstoupí, tolik jich vyjde, a proto se nemění ani hmotnost.',
        },
        {
          type: 'example',
          title: 'Železo a síra',
          problem: 'Smícháš 5,6 g železa a 3,2 g síry a směs zahřeješ. Obě látky zreagují beze zbytku na sulfid železnatý $FeS$. Kolik gramů $FeS$ vznikne?',
          steps: [
            'Rovnice: $Fe + S -> FeS$',
            'Zákon zachování hmotnosti: $m(FeS) = m(Fe) + m(S)$',
            'Dosadíme: $m(FeS)$ = 5,6 g + 3,2 g',
          ],
          answer: 'Vznikne 8,8 g sulfidu železnatého.',
        },
        {
          type: 'example',
          title: 'Když produkt odletí',
          problem: 'Tepelným rozkladem 10 g vápence $CaCO3$ vzniklo 5,6 g oxidu vápenatého $CaO$. Druhým produktem je plynný $CO2$, který unikl. Kolik gramů $CO2$ vzniklo?',
          steps: [
            'Rovnice: $CaCO3 -> CaO + CO2$',
            '$m(CaCO3) = m(CaO) + m(CO2)$',
            '$m(CO2)$ = 10 g − 5,6 g',
          ],
          answer: 'Uniklo 4,4 g oxidu uhličitého.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'Svíčka hubne',
              icon: 'flame',
              tone: 'a',
              points: ['produkty ($CO2$ a vodní pára) odcházejí do vzduchu', 'váha ukáže méně'],
            },
            {
              title: 'Ocelová vlna tloustne',
              icon: 'rust',
              tone: 'b',
              points: ['železo se slučuje s kyslíkem ze vzduchu na pevný oxid', 'váha ukáže více'],
            },
          ],
          caption: 'V obou případech zákon platí, jen do vážení nezahrneš všechny látky.',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Takže to kilo dřeva z krbu? Většina uletěla komínem jako $CO2$ a vodní pára. Kdybys zachytil všechny plyny, váha by seděla na gram. Chemie je poctivý účetní.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Spálením 12 g hořčíku vzniklo 20 g oxidu hořečnatého $MgO$. Kolik gramů kyslíku se spotřebovalo?',
            answer: 8,
            unit: 'g',
            explain: 'Podle zákona zachování hmotnosti: $m(O2)$ = 20 g − 12 g = 8 g.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Když při reakci v otevřené kádince unikne plyn, zákon zachování hmotnosti přestane platit.',
            answer: false,
            explain: 'Zákon platí vždy. Kádinka jen „zhubne“ o hmotnost plynu, který unikl. Kdybychom ho zachytili, součet hmotností by seděl.',
          },
        },
      ],
    },
    {
      title: 'Co všechno prozradí chemická rovnice',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: 'Chemická rovnice je nejkratší možný popis reakce. Vlevo jsou reaktanty, vpravo produkty, mezi nimi šipka. Čte se „reaguje za vzniku“ nebo prostě „dává“.',
        },
        {
          type: 'reaction',
          equation: '2H2(g) + O2(g) -> 2H2O(l)',
          caption: 'hoření vodíku',
        },
        {
          type: 'compare',
          columns: [
            {
              title: '**Kvalitativní** význam',
              icon: 'magnifier',
              tone: 'a',
              points: ['co reaguje a co vzniká', 'vodík reaguje s kyslíkem za vzniku vody'],
            },
            {
              title: '**Kvantitativní** význam',
              icon: 'calculator',
              tone: 'b',
              points: [
                'kolik částic reaguje',
                'dvě molekuly vodíku reagují s jednou molekulou kyslíku a vzniknou dvě molekuly vody',
                'stejný poměr platí i pro obrovská množství částic (lekce o látkovém množství)',
              ],
            },
          ],
        },
        {
          type: 'particles',
          boxes: [
            { label: '(s) pevná látka (*solid*)', items: [{ species: 'CaCO3', count: 6 }], state: 'solid', note: '$CaCO3(s)$' },
            { label: '(l) kapalina (*liquid*)', items: [{ species: 'H2O', count: 6 }], state: 'liquid', note: '$H2O(l)$' },
            { label: '(g) plyn (*gas*)', items: [{ species: 'CO2', count: 4 }], state: 'gas', note: '$CO2(g)$' },
            { label: '(aq) rozpuštěno ve vodě (*aqueous*)', items: [{ species: 'Na^+', count: 3 }, { species: 'Cl^-', count: 3 }, { species: 'H2O', count: 6 }], state: 'solution', note: '$NaCl(aq)$' },
          ],
          caption: 'Stavové symboly za vzorcem říkají, v jakém skupenství látka je.',
        },
        {
          type: 'example',
          title: 'Čteme rovnici',
          problem: 'Co všechno říká rovnice $CaCO3(s) -> CaO(s) + CO2(g)$?',
          steps: [
            'Reaktant: pevný uhličitan vápenatý (vápenec).',
            'Produkty: pevný oxid vápenatý (pálené vápno) a plynný oxid uhličitý.',
            'Počty částic: z jedné „jednotky“ $CaCO3$ vznikne jedna $CaO$ a jedna molekula $CO2$.',
            'Kontrola atomů: vlevo 1 Ca, 1 C, 3 O; vpravo 1 Ca, 1 C, 1 + 2 = 3 O.',
          ],
          answer: 'Rozkladem pevného vápence vzniká pevné pálené vápno a plynný $CO2$ v poměru částic 1 : 1 : 1.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'V rovnici musí být vlevo i vpravo **stejný počet atomů každého prvku**. To je zákon zachování hmotnosti převedený do vzorců. Jak rovnici „srovnat“, se naučíš hned v další lekci.',
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jaký stavový symbol napíšeš za $NaCl$, když je sůl rozpuštěná ve vodě?',
            accept: ['aq', '(aq)'],
            placeholder: 'symbol',
            explain: '(aq) z latinského *aqua*, voda. Označuje látku rozpuštěnou ve vodě.',
          },
        },
      ],
    },
    {
      title: 'Iontové rovnice',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Iontové látky jsou složené z kationtů a aniontů. Ve vodě se ionty od sebe oddělí a volně se pohybují: $NaCl(aq)$ proto ve skutečnosti znamená $Na^+(aq)$ a $Cl^-(aq)$.',
        },
        {
          type: 'particles',
          arrows: true,
          boxes: [
            { label: 'krystal $NaCl(s)$', items: [{ species: 'NaCl', count: 6 }], state: 'solid' },
            { label: 'roztok $NaCl(aq)$', items: [{ species: 'Na^+', count: 6 }, { species: 'Cl^-', count: 6 }, { species: 'H2O', count: 8 }], state: 'solution', note: 'volné ionty $Na^+$ a $Cl^-$' },
          ],
        },
        {
          type: 'p',
          text: 'V **iontové rovnici** rozpuštěné iontové látky rozepíšeš na ionty. Pevné látky, plyny a vodu necháš jako celé vzorce.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'úplná iontová rovnice', def: 'všechny rozpuštěné iontové látky jsou rozepsané na ionty' },
            { term: 'ionty-diváci', def: 'ionty, které jsou na obou stranách rovnice stejné; reakce se neúčastní' },
            { term: 'zkrácená iontová rovnice', def: 'rovnice bez iontů-diváků; ukazuje jen to podstatné' },
          ],
        },
        {
          type: 'reaction',
          equation: 'Zn(s) + CuCl2(aq) -> ZnCl2(aq) + Cu(s)',
          caption: 'zinkový plíšek v modrém roztoku chloridu měďnatého se pokryje mědí',
        },
        {
          type: 'particles',
          arrows: true,
          boxes: [
            { label: 'před reakcí', items: [{ species: 'Zn', count: 2 }, { species: 'Cu^2+', count: 2 }, { species: 'Cl^-', count: 4 }], state: 'solution' },
            { label: 'po reakci', items: [{ species: 'Cu', count: 2 }, { species: 'Zn^2+', count: 2 }, { species: 'Cl^-', count: 4 }], state: 'solution', note: 'ionty $Cl^-$ se nezměnily: jsou to diváci' },
          ],
          caption: 'Doopravdy reagují jen zinek a ionty $Cu^{2+}$.',
        },
        {
          type: 'example',
          title: 'Zinek v roztoku chloridu měďnatého',
          problem: 'Ponoříš zinkový plíšek do modrého roztoku chloridu měďnatého. Plíšek se pokryje červenohnědou mědí. Zapiš úplnou a zkrácenou iontovou rovnici.',
          steps: [
            'Molekulová rovnice: $Zn(s) + CuCl2(aq) -> ZnCl2(aq) + Cu(s)$',
            'Rozepíšeme rozpuštěné látky: $CuCl2(aq)$ na $Cu^{2+}$ a $2Cl^-$, $ZnCl2(aq)$ na $Zn^{2+}$ a $2Cl^-$.',
            'Úplná iontová rovnice: $Zn + Cu^{2+} + 2Cl^-$ -> $Zn^{2+} + 2Cl^- + Cu$',
            'Ionty $Cl^-$ jsou vlevo i vpravo, jsou to diváci. Škrtneme je.',
            'Kontrola nábojů: vlevo 0 + 2 = +2, vpravo +2 + 0 = +2.',
          ],
          answer: 'Zkrácená iontová rovnice: $Zn + Cu^{2+} -> Zn^{2+} + Cu$',
        },
        {
          type: 'example',
          title: 'Sraženina chloridu stříbrného',
          problem: 'Do roztoku kuchyňské soli přikápneš roztok dusičnanu stříbrného $AgNO3$. Vznikne bílá sraženina $AgCl$. Zapiš zkrácenou iontovou rovnici. (Dusičnany a další soli kyslíkatých kyselin pojmenujeme v úrovni 5; teď ti stačí, že $AgNO3$ tvoří ve vodě ionty $Ag^+$ a $NO3^-$.)',
          steps: [
            'Molekulová rovnice: $AgNO3(aq) + NaCl(aq)$ -> $AgCl(s) + NaNO3(aq)$',
            'Úplná iontová: $Ag^+ + NO3^- + Na^+ + Cl^-$ -> $AgCl(s) + Na^+ + NO3^-$',
            'Diváci jsou $Na^+$ a $NO3^-$. Škrtneme je.',
          ],
          answer: 'Zkrácená iontová rovnice: $Ag^+ + Cl^- -> AgCl(s)$',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'V iontové rovnici musí sedět **atomy i náboje**. Součet nábojů vlevo se musí rovnat součtu nábojů vpravo.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Bezpečnost',
          text: 'Dusičnan stříbrný je žíravý a na kůži zanechává černé skvrny, které vydrží několik dní. Pracuj v ochranných brýlích a rukavicích.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Které ionty jsou diváky v reakci $AgNO3(aq) + NaCl(aq)$ -> $AgCl(s) + NaNO3(aq)$?',
            options: ['$Na^+$ a $NO3^-$', '$Ag^+$ a $Cl^-$', '$Ag^+$ a $Na^+$', '$Cl^-$ a $NO3^-$'],
            answer: 0,
            explain: '$Na^+$ a $NO3^-$ jsou v roztoku před reakcí i po ní. Skutečně reagují jen $Ag^+$ a $Cl^-$, které spolu tvoří nerozpustný $AgCl$.',
          },
        },
      ],
    },
  ],
  summary: [
    'Při chemické reakci zanikají výchozí látky (reaktanty) a vznikají nové látky (produkty).',
    'Znaky reakce jsou změna barvy, vznik plynu nebo sraženiny, teplo či světlo; rozhoduje ale vznik nové látky.',
    'Zákon zachování hmotnosti (Lomonosov, Lavoisier): celková hmotnost reaktantů se rovná celkové hmotnosti produktů.',
    'Chemická rovnice říká, co reaguje a v jakém poměru částic; stavové symboly (s), (l), (g), (aq) udávají skupenství.',
    'V iontové rovnici rozepíšeš rozpuštěné iontové látky na ionty; po škrtnutí iontů-diváků dostaneš zkrácenou iontovou rovnici.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Při chemické reakci se atomy přeskupují, ale jejich počet se nemění.',
      answer: true,
      explain: 'Proto platí zákon zachování hmotnosti: štěpí se a vznikají vazby, atomy ale zůstávají.',
    },
    {
      kind: 'choice',
      q: 'Který děj je chemická reakce?',
      options: ['kysnutí mléka', 'odpařování vody z louže', 'rozpouštění soli v polévce', 'sublimace jodu'],
      answer: 0,
      explain: 'Při kysnutí mléka vzniká nová látka (kyselina mléčná). Ostatní děje jsou fyzikální změny.',
    },
    {
      kind: 'number',
      q: 'Zahřátím 21,7 g červeného oxidu rtuťnatého vzniklo 20,1 g rtuti. Zbytek unikl jako kyslík. Kolik gramů kyslíku vzniklo?',
      answer: 1.6,
      tolerance: 0.05,
      unit: 'g',
      explain: 'Hmotnost se zachovává: 21,7 g − 20,1 g = 1,6 g kyslíku. Právě tuto reakci studoval Lavoisier.',
    },
    {
      kind: 'match',
      q: 'Přiřaď stavový symbol k látce.',
      pairs: [
        ['$CO2$ unikající z limonády', '(g)'],
        ['voda v kádince', '(l)'],
        ['sůl rozpuštěná v mořské vodě', '(aq)'],
        ['sraženina na dně zkumavky', '(s)'],
      ],
      explain: '(g) plyn, (l) kapalina, (aq) vodný roztok, (s) pevná látka.',
    },
    {
      kind: 'multi',
      q: 'Co vyčteš z rovnice $2H2 + O2 -> 2H2O$?',
      options: [
        'že vodík reaguje s kyslíkem za vzniku vody',
        'že dvě molekuly vodíku reagují s jednou molekulou kyslíku',
        'že vzniká stejný počet molekul, jako do reakce vstoupil',
        'že 2 g vodíku reagují s 1 g kyslíku',
      ],
      answers: [0, 1],
      explain: 'Rovnice dává kvalitativní i kvantitativní informaci o počtu částic. Počet molekul se měnit může (3 → 2) a koeficienty nejsou hmotnosti.',
    },
    {
      kind: 'tf',
      q: 'Železný hřebík po zrezavění váží stejně jako před ním.',
      answer: false,
      explain: 'Rez vzniká reakcí železa s kyslíkem a vodou ze vzduchu, které se do hřebíku „přidají“. Hřebík proto ztěžkne.',
    },
    {
      kind: 'choice',
      q: 'Jak vypadá zkrácená iontová rovnice reakce $Fe + CuCl2 -> FeCl2 + Cu$ ve vodném roztoku?',
      options: [
        '$Fe + Cu^{2+} -> Fe^{2+} + Cu$',
        '$Fe + 2Cl^- -> FeCl2$',
        '$Cu^{2+} + 2Cl^- -> CuCl2$',
        '$Fe^{2+} + Cu -> Fe + Cu^{2+}$',
      ],
      answer: 0,
      explain: 'Chloridové ionty jsou diváci. Zůstane přechod železa na $Fe^{2+}$ a iontů $Cu^{2+}$ na měď; náboje sedí (+2 = +2).',
    },
  ],
}

const l4_2: Lesson = {
  id: 'l4-2',
  title: 'Vyčíslování chemických rovnic',
  goals: [
    'Rozlišit koeficient a index a vědět, co smíš při vyčíslování měnit',
    'Vyčíslit rovnici krok za krokem: kovy, nekovy, vodík, nakonec kyslík',
    'Vyčíslit rovnici hoření uhlovodíku, i když cestou vyjde zlomek',
    'Zkontrolovat vyčíslenou rovnici sečtením atomů na obou stranách',
  ],
  hook: 'Rovnice je jako účtenka: co je vlevo, musí sedět s tím, co je vpravo. Žádný atom nesmí zmizet ani se objevit z ničeho. Pojď si zahrát na chemického účetního.',
  sections: [
    {
      title: 'Koeficient, nebo index?',
      icon: 'calculator',
      blocks: [
        {
          type: 'p',
          text: 'Rovnice $H2 + O2 -> H2O$ popisuje správné látky, ale nesedí: vlevo jsou dva atomy kyslíku, vpravo jen jeden. **Vyčíslit** rovnici znamená doplnit před vzorce taková čísla, aby na obou stranách byl stejný počet atomů každého prvku.',
        },
        {
          type: 'reaction',
          equation: '2H2 + O2 -> 2H2O',
          caption: 'Vyčísleno: vlevo i vpravo 4 atomy H a 2 atomy O.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'index',
              icon: 'molecule',
              tone: 'a',
              points: [
                'malé číslo vpravo dole ve vzorci',
                'říká, kolik atomů je v jedné částici',
                '$H2O$: 2 atomy H, 1 atom O',
                'při vyčíslování ho **nikdy neměníš**',
              ],
            },
            {
              title: 'stechiometrický koeficient',
              icon: 'calculator',
              tone: 'b',
              points: [
                'číslo před vzorcem',
                'říká, kolik částic dané látky reaguje nebo vzniká',
                '$3H2O$: tři molekuly vody',
                'při vyčíslování ho **doplňuješ**',
              ],
            },
          ],
        },
        {
          type: 'formula',
          text: 'počet atomů = koeficient × index',
          caption: 'u závorky násob ještě indexem za závorkou',
        },
        {
          type: 'particles',
          boxes: [
            { label: '$3H2O$', items: [{ species: 'H2O', count: 3 }], note: '3 molekuly vody: 6 H, 3 O' },
            { label: '$4NH3$', items: [{ species: 'NH3', count: 4 }], note: '4 molekuly amoniaku: 4 N, 12 H' },
            { label: '$2Fe2O3$', items: [{ species: 'Fe2O3', count: 2 }], note: '2 „jednotky“ oxidu železitého: 4 Fe, 6 O' },
          ],
          caption: 'Koeficient říká, kolik částic nakreslíš; index, z kolika atomů je každá složená.',
        },
        {
          type: 'molecule',
          molecules: ['H2O', 'H2O2'],
          labels: ['voda $H2O$', 'peroxid vodíku $H2O2$'],
          caption: 'Jiný index = jiná látka.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Indexy jsou nedotknutelné',
          text: 'Kdybys „vyčíslil“ změnou indexu na $H2 + O2 -> H2O2$, dostaneš peroxid vodíku, tedy úplně jinou látku (bělidlo!). ==Při vyčíslování měníš jen koeficienty, nikdy indexy.==',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Koeficient 1 se nepíše. $O2$ v rovnici znamená jednu molekulu kyslíku.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik atomů kyslíku je zapsáno v $5CO2$?',
            answer: 10,
            tolerance: 0,
            explain: 'Koeficient × index = 5 × 2 = 10 atomů kyslíku.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik atomů vodíku je zapsáno v $3CH4$?',
            answer: 12,
            tolerance: 0,
            explain: 'Každá molekula methanu má 4 atomy H, tři molekuly tedy 3 × 4 = 12.',
          },
        },
      ],
    },
    {
      title: 'Postup krok za krokem',
      icon: 'pencil',
      blocks: [
        {
          type: 'p',
          text: 'Jednoduché rovnice vyčíslíš „od oka“, u složitějších se vyplatí pevné pořadí. Kyslík a vodík bývají ve více látkách, proto přicházejí na řadu nakonec.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'pencil', title: 'vzorce', text: 'napiš správné vzorce reaktantů a produktů' },
            { icon: 'coin', title: '**Ko**vy', text: 'vyrovnej atomy kovů' },
            { icon: 'periodic-table', title: '**Ne**kovy', text: 'kromě vodíku a kyslíku' },
            { icon: 'balloon', title: '**Vo**dík', text: 'vyrovnej vodík' },
            { icon: 'lungs', title: '**Ky**slík', text: 'vyrovnej kyslík' },
            { icon: 'check', title: 'kontrola', text: 'zkontroluj všechny prvky a zkrať koeficienty na nejmenší celá čísla' },
          ],
          caption: 'Pořadí vyčíslování',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pomůcka KoNeVoKy',
          text: '**Ko**vy → **Ne**kovy → **Vo**dík → **Ky**slík. Kyslík je poslední, protože se objevuje skoro všude.',
        },
        {
          type: 'example',
          title: 'Syntéza amoniaku',
          problem: 'Vyčísli rovnici $N2 + H2 -> NH3$.',
          steps: [
            'Kovy tu nejsou.',
            'Dusík: vlevo 2 atomy, vpravo 1. Dáme koeficient 2 před $NH3$: $N2 + H2 -> 2NH3$.',
            'Vodík: vpravo teď 2 × 3 = 6 atomů, vlevo 2. Dáme 3 před $H2$ (3 × 2 = 6).',
            'Kontrola: N 2 = 2, H 6 = 6.',
          ],
          answer: '$N2 + 3H2 -> 2NH3$',
        },
        {
          type: 'reaction',
          equation: 'N2 + 3H2 -> 2NH3',
          caption: '2 atomy N a 6 atomů H na každé straně',
        },
        {
          type: 'example',
          title: 'Hliník na vzduchu',
          problem: 'Hliník se na vzduchu pokrývá tenkou ochrannou vrstvou oxidu. Vyčísli $Al + O2 -> Al2O3$.',
          steps: [
            'Kyslík: vlevo 2 atomy, vpravo 3. Nejmenší společný násobek čísel 2 a 3 je 6.',
            'Aby bylo 6 atomů O na obou stranách: $3O2$ vlevo a $2Al2O3$ vpravo.',
            'Hliník: vpravo teď 2 × 2 = 4 atomy, proto $4Al$ vlevo.',
            'Kontrola: Al 4 = 4, O 3 × 2 = 6 a 2 × 3 = 6.',
          ],
          answer: '$4Al + 3O2 -> 2Al2O3$',
        },
        {
          type: 'reaction',
          equation: '4Al + 3O2 -> 2Al2O3',
          caption: 'nejmenší společný násobek indexů 2 a 3 je 6 atomů kyslíku',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Když má prvek vlevo a vpravo různé indexy (2 a 3), hledej jejich **nejmenší společný násobek**. To je počet atomů, na který obě strany doplníš.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Doplň koeficient před kyslík: $4Fe + ?O2 -> 2Fe2O3$',
            answer: 3,
            tolerance: 0,
            explain: 'Vpravo je 2 × 3 = 6 atomů O, takže vlevo potřebuješ 3 molekuly $O2$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která rovnice je správně vyčíslená?',
            options: ['$2Na + Cl2 -> 2NaCl$', '$Na + Cl2 -> NaCl2$', '$Na + Cl -> NaCl$', '$2Na + Cl2 -> Na2Cl2$'],
            answer: 0,
            explain: 'Chlor tvoří dvouatomové molekuly $Cl2$ a chlorid sodný má vzorec $NaCl$. Vyrovnáš jen koeficienty: 2 Na a 2 Cl na obou stranách.',
          },
        },
      ],
    },
    {
      title: 'Když vyjde zlomek',
      icon: 'idea',
      blocks: [
        {
          type: 'p',
          text: 'Někdy ti na kyslíku vyjde lichý počet atomů, a z molekul $O2$ ho neposkládáš. Pomůže trik: jako **mezikrok** napiš zlomek, třeba $5/2 O2$, a nakonec celou rovnici vynásob dvěma.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'check', title: 'vyrovnej ostatní prvky', text: 'kyslík nech nakonec' },
            { icon: 'calculator', title: 'sečti kyslík vpravo', text: 'vyšel lichý počet atomů?' },
            { icon: 'pencil', title: 'napiš zlomek', text: 'např. $5/2 O2$' },
            { icon: 'arrow-cycle', title: 'vynásob dvěma', text: 'všechny koeficienty' },
            { icon: 'magnifier', title: 'zkontroluj', text: 'všechny atomy' },
          ],
          caption: 'Trik se zlomkem',
        },
        {
          type: 'example',
          title: 'Rozklad peroxidu vodíku',
          problem: 'Peroxid vodíku (dezinfekce na odřeniny) se pomalu rozkládá na vodu a kyslík. Vyčísli $H2O2 -> H2O + O2$.',
          steps: [
            'Vodík: vlevo 2, vpravo 2. Sedí.',
            'Kyslík: vlevo 2, vpravo 1 + 2 = 3. Nesedí.',
            'Zkusíme $2H2O2$: vlevo teď 4 H a 4 O.',
            'Vodík: potřebujeme 4 H vpravo, tedy $2H2O$ (2 × 2 = 4).',
            'Kyslík vpravo: 2 (z vody) + 2 (z $O2$) = 4. Sedí.',
          ],
          answer: '$2H2O2 -> 2H2O + O2$',
        },
        {
          type: 'reaction',
          equation: '2H2O2 -> 2H2O + O2',
          caption: 'rozklad peroxidu vodíku: 4 H a 4 O na každé straně',
        },
        {
          type: 'example',
          title: 'Spalování amoniaku (výroba kyseliny dusičné)',
          problem: 'Vyčísli $NH3 + O2 -> NO + H2O$.',
          steps: [
            'Dusík: 1 = 1. Zatím sedí.',
            'Vodík: vlevo 3, vpravo 2. Násobek je 6: $2NH3$ a $3H2O$.',
            'Dusík se tím rozhodil: vlevo 2, proto $2NO$.',
            'Kyslík vpravo: 2 (z $2NO$) + 3 (z $3H2O$) = 5 atomů. Vlevo potřebujeme $5/2 O2$.',
            'Zlomku se zbavíme vynásobením všech koeficientů dvěma: 4, 5, 4, 6.',
            'Kontrola: N 4 = 4, H 12 = 12, O 10 = 4 + 6.',
          ],
          answer: '$4NH3 + 5O2 -> 4NO + 6H2O$',
        },
        {
          type: 'reaction',
          equation: '4NH3 + 5O2 -> 4NO + 6H2O',
          caption: 'po vynásobení dvěma: N 4 = 4, H 12 = 12, O 10 = 10',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Zlomek je jen pomocný krok. Ve výsledné rovnici musí být **nejmenší celá čísla**. Rovnice $4H2 + 2O2 -> 4H2O$ sice sedí, ale správně je zkrácená $2H2 + O2 -> 2H2O$.',
        },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď kroky, kterými vyčíslíš $NH3 + O2 -> NO + H2O$.',
            items: [
              'vyrovnat vodík: $2NH3$ a $3H2O$',
              'srovnat dusík: $2NO$',
              'sečíst kyslík vpravo a doplnit $5/2 O2$',
              'vynásobit celou rovnici dvěma',
              'zkontrolovat všechny atomy',
            ],
            explain: 'Kyslík, který je ve více produktech, přijde na řadu až nakonec. Zlomek odstraníš vynásobením a vše zkontroluješ.',
          },
        },
      ],
    },
    {
      title: 'Vyčíslování hoření',
      icon: 'flame',
      blocks: [
        {
          type: 'p',
          text: 'Plynový sporák, zapalovač i kempinkový vařič spalují **uhlovodíky**, sloučeniny uhlíku a vodíku. Při dokonalém hoření z nich vždy vzniká oxid uhličitý a voda. Podrobně je poznáš v úrovni 8.',
        },
        {
          type: 'molecule',
          molecules: ['CH4', 'C3H8', 'butane'],
          labels: ['methan $CH4$ (zemní plyn)', 'propan $C3H8$ (plynová bomba)', 'butan $C4H10$ (zapalovač)'],
        },
        {
          type: 'formula',
          text: '$C_{x}H_{y} + O2 -> CO2 + H2O$',
          caption: 'pořadí vyčíslení: uhlík → vodík → kyslík',
        },
        {
          type: 'example',
          title: 'Methan (zemní plyn)',
          problem: 'Vyčísli hoření methanu $CH4 + O2 -> CO2 + H2O$.',
          steps: [
            'Uhlík: 1 = 1, takže $1CO2$.',
            'Vodík: 4 atomy vlevo, proto $2H2O$ vpravo.',
            'Kyslík vpravo: 2 (z $CO2$) + 2 (z $2H2O$) = 4 atomy, tedy $2O2$.',
          ],
          answer: '$CH4 + 2O2 -> CO2 + 2H2O$',
        },
        {
          type: 'reaction',
          equation: 'CH4 + 2O2 -> CO2 + 2H2O',
          caption: 'hoření methanu: C 1 = 1, H 4 = 4, O 4 = 4',
        },
        {
          type: 'example',
          title: 'Butan (zapalovač)',
          problem: 'Vyčísli hoření butanu $C4H10 + O2 -> CO2 + H2O$.',
          steps: [
            'Uhlík: 4 atomy, proto $4CO2$.',
            'Vodík: 10 atomů, proto $5H2O$.',
            'Kyslík vpravo: 4 × 2 + 5 × 1 = 13 atomů, tedy $13/2 O2$.',
            'Vynásobíme vše dvěma: 2, 13, 8, 10.',
            'Kontrola: C 8 = 8, H 20 = 20, O 26 = 16 + 10.',
          ],
          answer: '$2C4H10 + 13O2 -> 8CO2 + 10H2O$',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'Dokonalé hoření',
              icon: 'flame',
              tone: 'good',
              points: ['dost kyslíku', 'vzniká $CO2$ a $H2O$', '$CH4 + 2O2 -> CO2 + 2H2O$'],
            },
            {
              title: 'Nedokonalé hoření',
              icon: 'hazard',
              tone: 'bad',
              points: [
                'málo kyslíku (ucpaný komín, karma v malé koupelně)',
                'vzniká jedovatý **oxid uhelnatý** $CO$',
                '$2CH4 + 3O2 -> 2CO + 4H2O$',
                '$CO$ nevidíš ani necítíš: do bytu s plynovým spotřebičem patří detektor CO',
              ],
            },
          ],
        },
        {
          type: 'game',
          gameId: 'balance',
          text: 'Zkus si vyčíslit co nejvíc rovnic proti času ve hře Vyčísli rovnici.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Propan z plynové bomby hoří podle $C3H8 + ?O2 -> 3CO2 + 4H2O$. Jaký koeficient patří před kyslík?',
            answer: 5,
            tolerance: 0,
            explain: 'Kyslík vpravo: 3 × 2 + 4 × 1 = 10 atomů, tedy 5 molekul $O2$.',
          },
        },
      ],
    },
    {
      title: 'Kontrola a typické chyby',
      icon: 'magnifier',
      blocks: [
        {
          type: 'p',
          text: 'Hotovou rovnici vždy zkontroluj tabulkou: pro každý prvek sečti atomy vlevo a vpravo. Zabere to půl minuty a ušetří ti body v písemce.',
        },
        {
          type: 'table',
          headers: ['Prvek', 'Vlevo', 'Vpravo'],
          rows: [
            ['C', '2 × 4 = 8', '8 × 1 = 8'],
            ['H', '2 × 10 = 20', '10 × 2 = 20'],
            ['O', '13 × 2 = 26', '8 × 2 + 10 × 1 = 26'],
          ],
          caption: 'Kontrola rovnice $2C4H10 + 13O2 -> 8CO2 + 10H2O$',
        },
        {
          type: 'reaction',
          equation: 'Fe2O3 + 3CO -> 2Fe + 3CO2',
          caption: 'Počítadlo atomů pod obrázkem dělá stejnou kontrolu: Fe 2 = 2, C 3 = 3, O vlevo 3 + 3 = 6 a vpravo 3 × 2 = 6.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'cross', title: 'změněný index', text: 'místo koeficientu, a tím vznikne jiná látka' },
            { icon: 'calculator', title: 'zapomenuté násobení', text: 'index se násobí koeficientem: $3H2O$ má 6 atomů H, ne 2' },
            { icon: 'question', title: 'přidaná látka', text: 'která do rovnice nepatří, jen aby to „sedělo“' },
            { icon: 'warning', title: 'zlomek ve výsledku', text: 'nebo koeficienty, které jdou ještě zkrátit' },
            { icon: 'ion-plus', title: 'nezkontrolované náboje', text: 'u iontové rovnice' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Co přijde později',
          text: 'Některé rovnice, třeba reakce s manganistanem draselným $KMnO4$, se zkoušením vyčíslují velmi těžko. Pro ně existuje metoda **vyčíslování pomocí oxidačních čísel**, kterou se naučíš v lekci o redoxních reakcích (úroveň 6).',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Moje zlaté pravidlo: rovnici, kterou jsem nezkontroloval, považuju za nevyčíslenou. Atomy se počítají, ne odhadují!',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Rovnice $4H2 + 2O2 -> 4H2O$ je zapsaná správně v nejjednodušším tvaru.',
            answer: false,
            explain: 'Atomy sice sedí, ale všechny koeficienty jdou vydělit dvěma. Správně je $2H2 + O2 -> 2H2O$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která rovnice je správně vyčíslená?',
            options: [
              '$2Al + 6HCl -> 2AlCl3 + 3H2$',
              '$Al + 3HCl -> AlCl3 + H2$',
              '$2Al + 3HCl -> 2AlCl3 + 3H2$',
              '$Al + 2HCl -> AlCl2 + H2$',
            ],
            answer: 0,
            explain: 'Kontrola: Al 2 = 2, Cl 6 = 2 × 3, H 6 = 3 × 2. Poslední možnost mění vzorec chloridu hlinitého, to se nesmí.',
          },
        },
      ],
    },
  ],
  summary: [
    'Index je součástí vzorce a nesmíš ho měnit; koeficient před vzorcem udává počet částic.',
    'Počet atomů prvku v zápisu spočítáš jako koeficient × index.',
    'Vyčísluj v pořadí kovy → nekovy → vodík → kyslík (KoNeVoKy).',
    'Při různých indexech pomáhá nejmenší společný násobek; zlomek je dovolený jen jako mezikrok.',
    'Při dokonalém hoření uhlovodíku vzniká $CO2$ a $H2O$; vyčísluješ uhlík, vodík a nakonec kyslík.',
    'Výsledné koeficienty jsou nejmenší celá čísla a každou rovnici kontroluješ sečtením atomů.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Při vyčíslování rovnice smíš měnit pouze koeficienty, nikoli indexy.',
      answer: true,
      explain: 'Změnou indexu bys změnil látku, třeba z vody $H2O$ na peroxid $H2O2$.',
    },
    {
      kind: 'number',
      q: 'Kolik atomů kyslíku je celkem zapsáno v $2Fe2O3$?',
      answer: 6,
      tolerance: 0,
      explain: '2 × 3 = 6 atomů kyslíku.',
    },
    {
      kind: 'number',
      q: 'Vyčísli rovnici $Fe + Cl2 -> FeCl3$ a napiš součet všech koeficientů.',
      answer: 7,
      tolerance: 0,
      explain: '$2Fe + 3Cl2 -> 2FeCl3$ (chlor 6 = 6, železo 2 = 2), součet 2 + 3 + 2 = 7.',
    },
    {
      kind: 'order',
      q: 'Seřaď prvky podle toho, v jakém pořadí je obvykle vyrovnáváš.',
      items: ['kovy', 'nekovy kromě H a O', 'vodík', 'kyslík'],
      explain: 'Pomůcka KoNeVoKy: kovy, nekovy, vodík, kyslík. Kyslík bývá ve více látkách, proto je poslední.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k nevyčíslené rovnici správnou sadu koeficientů (v pořadí, jak jsou látky zapsané).',
      pairs: [
        ['$H2 + Cl2 -> HCl$', '1, 1, 2'],
        ['$Mg + O2 -> MgO$', '2, 1, 2'],
        ['$C2H6 + O2 -> CO2 + H2O$', '2, 7, 4, 6'],
        ['$Al + S -> Al2S3$', '2, 3, 1'],
      ],
      explain: 'Vždy zkontroluj atomy: například u ethanu vlevo 4 C, 12 H, 14 O a vpravo 4 C, 12 H, 8 + 6 = 14 O.',
    },
    {
      kind: 'number',
      q: 'Vyčísli hoření butanu $C4H10 + O2 -> CO2 + H2O$ celými čísly. Jaký koeficient patří před $O2$?',
      answer: 13,
      tolerance: 0,
      explain: '$2C4H10 + 13O2 -> 8CO2 + 10H2O$: kyslík vpravo 16 + 10 = 26 atomů, tedy 13 molekul $O2$.',
    },
    {
      kind: 'multi',
      q: 'Které rovnice jsou správně vyčíslené?',
      options: [
        '$CH4 + 2O2 -> CO2 + 2H2O$',
        '$2H2O2 -> 2H2O + O2$',
        '$N2 + H2 -> 2NH3$',
        '$4NH3 + 5O2 -> 4NO + 6H2O$',
        '$Fe2O3 + C -> 2Fe + CO2$',
      ],
      answers: [0, 1, 3],
      explain: 'U amoniaku chybí $3H2$. U redukce oxidu železitého nesedí kyslík ani uhlík; správně je $2Fe2O3 + 3C -> 4Fe + 3CO2$.',
    },
    {
      kind: 'choice',
      q: 'Při kontrole zjistíš, že ti vyšla rovnice $C3H8 + 5O2 -> 3CO2 + 4H2O$. Kolik atomů kyslíku je na pravé straně?',
      options: ['10', '7', '5', '14'],
      answer: 0,
      explain: '3 × 2 + 4 × 1 = 10, stejně jako vlevo 5 × 2 = 10. Rovnice je v pořádku.',
    },
  ],
}

const l4_3: Lesson = {
  id: 'l4-3',
  title: 'Typy chemických reakcí',
  goals: [
    'Zařadit reakci mezi syntézu, rozklad, substituci a podvojnou záměnu',
    'Poznat srážecí reakci a neutralizaci jako druhy podvojné záměny',
    'Rozlišit reakce exotermní a endotermní, rychlé a pomalé, vratné a nevratné',
    'Podle změny oxidačních čísel poznat redoxní reakci',
  ],
  hook: 'Rezavění kola trvá roky, výbuch rachejtle zlomek sekundy. Obojí je chemická reakce. Reakcí jsou miliony, ale neboj: vejdou se do pár šuplíků.',
  sections: [
    {
      title: 'Čtyři základní typy',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: 'Nejjednodušší třídění se dívá na to, **jak se mění počet a složení látek**. Stačí porovnat levou a pravou stranu rovnice.',
        },
        {
          type: 'diagram',
          id: 'reaction-types',
          caption: 'Čtyři základní typy reakcí podle změny látek',
        },
        {
          type: 'iconlist',
          items: [
            {
              icon: 'bond',
              title: '**syntéza** (slučování): A + B → AB',
              text: 'z více látek vzniká jedna; hoření hořčíku v bleskovém prášku $2Mg + O2 -> 2MgO$, vznik $FeS$ ze železa a síry',
            },
            {
              icon: 'heat',
              title: '**rozklad** (analýza): AB → A + B',
              text: 'z jedné látky vzniká více látek; pálení vápence $CaCO3 -> CaO + CO2$, elektrolýza vody $2H2O -> 2H2 + O2$',
            },
            {
              icon: 'arrow-cycle',
              title: '**substituce** (nahrazování): A + BC → AC + B',
              text: 'prvek „vystrčí“ jiný prvek ze sloučeniny; zinek vytěsní měď $Zn + CuCl2 -> ZnCl2 + Cu$, chlor vytěsní brom $Cl2 + 2KBr -> 2KCl + Br2$',
            },
            {
              icon: 'mixture',
              title: '**podvojná záměna**: AB + CD → AD + CB',
              text: 'dvě sloučeniny si „vymění partnery“ jako dva páry při tanci; $AgNO3 + NaCl -> AgCl + NaNO3$',
            },
          ],
        },
        {
          type: 'reaction',
          equation: 'Fe + 2HCl -> FeCl2 + H2',
          caption: 'železné piliny v kyselině chlorovodíkové šumí',
        },
        {
          type: 'example',
          title: 'Zařaď reakci',
          problem: 'Železné piliny v kyselině chlorovodíkové šumí: $Fe + 2HCl -> FeCl2 + H2$. O jaký typ reakce jde?',
          steps: [
            'Vlevo je prvek ($Fe$) a sloučenina ($HCl$).',
            'Vpravo je jiná sloučenina ($FeCl2$) a jiný prvek ($H2$).',
            'Železo zaujalo ve sloučenině s chlorem místo vodíku a vodík se uvolnil.',
          ],
          answer: 'Je to substituce (nahrazování).',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Rychlý test: ==jedna látka vpravo = syntéza, jedna látka vlevo = rozklad.== Když je vlevo i vpravo prvek a sloučenina, jde o substituci. Dvě sloučeniny na obou stranách znamenají podvojnou záměnu.',
        },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď reakci k jejímu typu.',
            pairs: [
              ['$2H2 + O2 -> 2H2O$', 'syntéza'],
              ['$2H2O2 -> 2H2O + O2$', 'rozklad'],
              ['$Fe + CuCl2 -> FeCl2 + Cu$', 'substituce'],
              ['$CuCl2 + Na2S -> CuS + 2NaCl$', 'podvojná záměna'],
            ],
            explain: 'Jedna látka vpravo = syntéza, jedna vlevo = rozklad, prvek vytěsní prvek = substituce, dvě sloučeniny si vymění ionty = podvojná záměna.',
          },
        },
      ],
    },
    {
      title: 'Podvojná záměna: sraženiny a neutralizace',
      icon: 'test-tube',
      blocks: [
        {
          type: 'p',
          text: 'Když smícháš dva roztoky iontových látek, podvojná záměna proběhne jen tehdy, když něco „odejde“ z roztoku:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'powder', title: 'nerozpustná sraženina', text: 'např. bílý $AgCl$ nebo žlutý $PbI2$' },
            { icon: 'gas-cloud', title: 'plyn', text: 'např. $CO2$ z octa a jedlé sody' },
            { icon: 'drop', title: 'voda', text: 'při neutralizaci' },
          ],
        },
        {
          type: 'keyterms',
          items: [
            { term: 'srážecí reakce', def: 'podvojná záměna, při které vzniká nerozpustná pevná látka (sraženina); v rovnici ji označíš (s) nebo šipkou ↓' },
            { term: 'neutralizace', def: 'reakce kyseliny s hydroxidem za vzniku soli a vody' },
          ],
        },
        {
          type: 'particles',
          arrows: true,
          boxes: [
            {
              label: 'roztoky $AgNO3$ a $NaCl$',
              items: [{ species: 'Ag^+', count: 3 }, { species: 'NO3-', count: 3 }, { species: 'Na^+', count: 3 }, { species: 'Cl^-', count: 3 }],
              state: 'solution',
            },
            {
              label: 'po smíchání',
              items: [{ species: 'AgCl', count: 3 }, { species: 'Na^+', count: 3 }, { species: 'NO3-', count: 3 }],
              state: 'solution',
              note: '$AgCl$ padá na dno jako bílá sraženina',
            },
          ],
          caption: '$Ag^+$ a $Cl^-$ si „vymění partnery“ a vypadnou z roztoku.',
        },
        {
          type: 'example',
          title: 'Zlatý déšť',
          problem: 'Smícháš bezbarvé roztoky dusičnanu olovnatého a jodidu draselného. Vznikne zářivě žlutá sraženina jodidu olovnatého. Zapiš a vyčísli rovnici.',
          steps: [
            'Vzorce: $Pb(NO3)2 + KI -> PbI2 + KNO3$',
            'Olovo: 1 = 1. Jod: vpravo 2 atomy, proto $2KI$.',
            'Draslík: vlevo teď 2, proto $2KNO3$.',
            'Skupina $NO3$: vlevo 2 (index za závorkou), vpravo 2. Sedí.',
          ],
          answer: '$Pb(NO3)2 + 2KI -> PbI2(s) + 2KNO3$',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Bezpečnost',
          text: 'Sloučeniny olova jsou jedovaté. Zlatý déšť patří jen do školní laboratoře: brýle, rukavice a odpad do označené nádoby, nikdy do výlevky.',
        },
        {
          type: 'reaction',
          equation: 'HCl + NaOH -> NaCl + H2O',
          caption: 'neutralizace: kyselina + hydroxid → sůl + voda (podrobně v úrovni 5)',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Sopka v kuchyni',
          text: 'Nalij ocet na jedlou sodu a začne to šumět. Nejdřív proběhne podvojná záměna a vzniklá kyselina uhličitá se hned rozloží na vodu a $CO2$ (podrobněji v úrovni 5). Je to bezpečný domácí pokus, jen si pod to dej talíř.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka je v reakci $AgNO3(aq) + NaCl(aq)$ -> $AgCl + NaNO3(aq)$ sraženinou?',
            options: ['$AgCl$', '$NaNO3$', '$NaCl$', '$AgNO3$'],
            answer: 0,
            explain: 'Chlorid stříbrný je ve vodě nerozpustný a vypadne jako bílá sraženina. Ostatní látky zůstávají rozpuštěné (aq).',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Neutralizace kyseliny hydroxidem je druh podvojné záměny.',
            answer: true,
            explain: 'Kyselina a hydroxid si vymění partnery: $H^+$ se spojí s $OH^-$ na vodu a zbylé ionty tvoří sůl.',
          },
        },
      ],
    },
    {
      title: 'Teplo: exotermní a endotermní reakce',
      icon: 'heat',
      blocks: [
        {
          type: 'p',
          text: 'Reakce se liší i tím, co dělají s teplem. Když vznikají pevnější vazby, než jaké se rozbily, energie přebývá a uvolní se do okolí.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: '**exotermní** reakce',
              icon: 'heat',
              tone: 'a',
              points: [
                'teplo **uvolňuje**, okolí se ohřívá',
                'produkty mají méně energie než reaktanty',
                'hoření, neutralizace, ohřívací sáčky na ruce',
              ],
            },
            {
              title: '**endotermní** reakce',
              icon: 'cold',
              tone: 'b',
              points: [
                'teplo **spotřebovává**, musíš ho dodávat nebo se okolí ochladí',
                'produkty mají více energie než reaktanty',
                'rozklad vápence, fotosyntéza',
              ],
            },
          ],
        },
        {
          type: 'diagram',
          id: 'energy-profile',
          props: { kind: 'exo' },
          caption: 'Exotermní reakce: produkty mají méně energie než reaktanty, rozdíl odchází jako teplo.',
        },
        {
          type: 'diagram',
          id: 'energy-profile',
          props: { kind: 'endo' },
          caption: 'Endotermní reakce: produkty mají více energie, teplo se musí dodat.',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Pokus do kuchyně',
          text: 'Smíchej lžičku jedlé sody s lžičkou kyseliny citronové a přilij trochu vody. Šumí to a sklenice **studí**. Tahle reakce je endotermní: teplo si bere z okolí, tedy i z tvých prstů.',
        },
        {
          type: 'p',
          text: 'Tepelné změny budeš počítat v úrovni 6 pomocí reakčního tepla $ΔH$. Teď stačí rozpoznat, kterým směrem teplo teče.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Rozklad vápence na pálené vápno, který probíhá jen při stálém zahřívání na asi 900 °C, je exotermní reakce.',
            answer: false,
            explain: 'Teplo se musí neustále dodávat, reakce ho spotřebovává. Je tedy endotermní.',
          },
        },
      ],
    },
    {
      title: 'Rychlé, pomalé a vratné reakce',
      icon: 'stopwatch',
      blocks: [
        {
          type: 'compare',
          columns: [
            {
              title: 'rychlé reakce',
              icon: 'explosion',
              tone: 'a',
              points: ['vznik sraženiny $AgCl$: okamžitě', 'výbuch rachejtle: zlomek sekundy', 'hoření dřeva'],
            },
            {
              title: 'pomalé reakce',
              icon: 'rust',
              tone: 'b',
              points: ['rezavění železa: měsíce až roky', 'kvašení vína: dny', 'zvětrávání kamene: staletí'],
            },
          ],
          caption: 'Proč jsou některé reakce pomalé a jak rychlost ovlivnit, se naučíš v úrovni 6 v lekci o rychlosti reakcí.',
        },
        {
          type: 'p',
          text: 'Většina reakcí jde prakticky jen jedním směrem: spálený papír „neodhoříš“ zpátky. Některé reakce ale mohou probíhat oběma směry. Říkáme jim **vratné** a píšeme je s dvojitou šipkou ⇌.',
        },
        {
          type: 'reaction',
          equation: 'N2 + 3H2 <=> 2NH3',
          caption: 'výroba amoniaku: část amoniaku se zase rozkládá zpátky na dusík a vodík',
        },
        {
          type: 'table',
          headers: ['Reakce', 'Rychlost', 'Směr'],
          rows: [
            ['vznik sraženiny $AgCl$', 'okamžitá', 'prakticky nevratná'],
            ['hoření dřeva', 'rychlá', 'nevratná'],
            ['rezavění železa', 'pomalá', 'nevratná'],
            ['$CaCO3 <=> CaO + CO2$ v uzavřené nádobě', 'závisí na teplotě', 'vratná'],
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Šipka → znamená, že reakce běží jedním směrem. Dvojitá šipka ⇌ znamená, že běží oběma směry zároveň. Co se v takové soustavě děje, probereme v úrovni 6 u chemické rovnováhy.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Co znamená symbol ⇌ v rovnici?',
            options: [
              'reakce probíhá oběma směry',
              'reakce probíhá velmi rychle',
              'reakce uvolňuje teplo',
              'reakce probíhá jen při zahřátí',
            ],
            answer: 0,
            explain: 'Dvojitá šipka označuje vratnou reakci: produkty se mohou zase měnit zpátky na reaktanty.',
          },
        },
      ],
    },
    {
      title: 'Velké rodiny: redoxní a acidobazické reakce',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: 'Chemici třídí reakce také podle toho, **co si částice předávají**. Tak vznikají dvě velké rodiny, se kterými se budeš potkávat až do maturity.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: '**redoxní** reakce',
              icon: 'electron',
              tone: 'a',
              points: ['předávají se **elektrony**', 'poznáš je tak, že se mění oxidační čísla', '$Zn + CuCl2 -> ZnCl2 + Cu$'],
            },
            {
              title: '**acidobazické** reakce',
              icon: 'ion-plus',
              tone: 'b',
              points: ['předávají se **protony** $H^+$', 'reaguje kyselina se zásadou', '$HCl + NaOH -> NaCl + H2O$'],
            },
          ],
        },
        {
          type: 'diagram',
          id: 'redox-transfer',
          caption: 'Při redoxní reakci přecházejí elektrony z jedné částice na druhou.',
        },
        {
          type: 'example',
          title: 'Je to redoxní reakce?',
          problem: 'Rozhodni pomocí oxidačních čísel, zda je reakce $Zn + CuCl2 -> ZnCl2 + Cu$ redoxní.',
          steps: [
            'Zinek: vlevo prvek, $Zn^{0}$; vpravo v $ZnCl2$ má $Zn^{II}$.',
            'Měď: vlevo v $CuCl2$ má $Cu^{II}$; vpravo prvek, $Cu^{0}$.',
            'Chlor: vlevo i vpravo $Cl^{−I}$, nemění se.',
            'Oxidační čísla zinku a mědi se změnila, zinek předal dva elektrony mědi.',
          ],
          answer: 'Ano, jde o redoxní reakci (a zároveň o substituci).',
        },
        {
          type: 'reaction',
          equation: '2Mg + O2 -> 2MgO',
          caption: 'Hoření hořčíku patří do pěti šuplíků najednou.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'bond', title: 'syntéza', text: 'z dvou látek vzniká jedna' },
            { icon: 'heat', title: 'exotermní', text: 'uvolňuje teplo a oslnivé světlo' },
            { icon: 'speed', title: 'rychlá', text: 'proběhne během okamžiku' },
            { icon: 'cross', title: 'nevratná', text: 'z $MgO$ se hořčík sám zpátky nevrátí' },
            { icon: 'electron', title: 'redoxní', text: 'hořčík 0 → II, kyslík 0 → −II' },
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Jedna reakce může patřit do více šuplíků. Podrobně se redoxním reakcím věnuje úroveň 6, kyselinám a zásadám úroveň 5.',
        },
        {
          type: 'game',
          gameId: 'quickfire',
          text: 'Otestuj se v Bleskové výzvě: poznáš typ reakce dřív, než vyprší čas?',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které reakce jsou redoxní (mění se v nich oxidační čísla)?',
            options: [
              '$2Mg + O2 -> 2MgO$',
              '$CaCO3 -> CaO + CO2$',
              '$Cl2 + 2KBr -> 2KCl + Br2$',
              '$AgNO3 + NaCl -> AgCl + NaNO3$',
            ],
            answers: [0, 2],
            explain: 'U hořčíku se mění 0 → II a kyslíku 0 → −II, u chloru 0 → −I a bromu −I → 0. Rozklad vápence a srážení $AgCl$ oxidační čísla nemění.',
          },
        },
      ],
    },
  ],
  summary: [
    'Syntéza spojuje látky v jednu, rozklad jednu látku štěpí na více látek.',
    'Při substituci prvek vytěsní jiný prvek ze sloučeniny, při podvojné záměně si dvě sloučeniny vymění partnery.',
    'Srážecí reakce a neutralizace jsou druhy podvojné záměny.',
    'Exotermní reakce teplo uvolňují, endotermní ho spotřebovávají.',
    'Vratné reakce probíhají oběma směry a zapisují se dvojitou šipkou ⇌.',
    'Při redoxních reakcích se předávají elektrony a mění se oxidační čísla, při acidobazických se předávají protony.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'O jaký typ reakce jde: $2H2O -> 2H2 + O2$?',
      options: ['rozklad', 'syntéza', 'substituce', 'podvojná záměna'],
      answer: 0,
      explain: 'Z jedné látky (vody) vznikají dvě látky. Je to rozklad, konkrétně elektrolýza vody.',
    },
    {
      kind: 'tf',
      q: 'Hoření methanu na plynovém sporáku je exotermní reakce.',
      answer: true,
      explain: 'Hoření teplo uvolňuje, proto na sporáku vaříme.',
    },
    {
      kind: 'tf',
      q: 'Každá podvojná záměna je zároveň redoxní reakcí.',
      answer: false,
      explain: 'Při srážecích reakcích a neutralizaci se oxidační čísla nemění, nejsou to tedy redoxní reakce.',
    },
    {
      kind: 'match',
      q: 'Přiřaď děj ke správnému popisu.',
      pairs: [
        ['ohřívací sáček na ruce', 'exotermní reakce'],
        ['pálení vápence', 'endotermní reakce'],
        ['$N2 + 3H2 <=> 2NH3$', 'vratná reakce'],
        ['rezavění plotu', 'pomalá reakce'],
      ],
      explain: 'Sáček hřeje (uvolňuje teplo), vápenec se musí zahřívat (teplo spotřebovává), ⇌ značí vratnost a rez vzniká měsíce.',
    },
    {
      kind: 'choice',
      q: 'Která reakce je substituce?',
      options: [
        '$Cl2 + 2NaBr -> 2NaCl + Br2$',
        '$2Na + Cl2 -> 2NaCl$',
        '$2HgO -> 2Hg + O2$',
        '$HCl + KOH -> KCl + H2O$',
      ],
      answer: 0,
      explain: 'Chlor vytěsní brom z bromidu sodného. Ostatní jsou syntéza, rozklad a neutralizace.',
    },
    {
      kind: 'multi',
      q: 'Co platí pro reakci $AgNO3(aq) + KCl(aq)$ -> $AgCl(s) + KNO3(aq)$?',
      options: ['je to podvojná záměna', 'je to srážecí reakce', 'je to redoxní reakce', 'je to syntéza', 'zkrácená iontová rovnice je $Ag^+ + Cl^- -> AgCl$'],
      answers: [0, 1, 4],
      explain: 'Ionty si vymění partnery a vznikne nerozpustný $AgCl$. Oxidační čísla se nemění, redox to není.',
    },
    {
      kind: 'text',
      q: 'Jak se jmenuje typ reakce, při kterém z více látek vznikne jediná látka? (jedno slovo)',
      accept: ['syntéza', 'slučování', 'syntéza (slučování)'],
      explain: 'Syntéza neboli slučování, např. $Fe + S -> FeS$.',
    },
    {
      kind: 'choice',
      q: 'Podle čeho poznáš redoxní reakci?',
      options: [
        'mění se oxidační čísla některých prvků',
        'vzniká sraženina',
        'reakce uvolňuje teplo',
        'mezi reaktanty je vždy kyslík',
      ],
      answer: 0,
      explain: 'Při redoxní reakci se předávají elektrony, a proto se mění oxidační čísla. Kyslík u ní být nemusí, viz $Zn + CuCl2$.',
    },
  ],
}

const l4_4: Lesson = {
  id: 'l4-4',
  title: 'Látkové množství a molární hmotnost',
  goals: [
    'Převádět mezi počtem částic, látkovým množstvím a hmotností látky',
    'Spočítat molární hmotnost sloučeniny z relativních atomových hmotností',
    'Spočítat objem plynu za normálních podmínek i ze stavové rovnice $pV = nRT$',
    'Určit hmotnostní zlomek prvku ve sloučenině a empirický vzorec ze složení',
  ],
  hook: 'V jednom doušku vody (asi 18 g) je víc molekul, než je zrnek písku na všech plážích světa. Chemici takové obří počty nepočítají po kouscích. Mají na to svůj „chemický tucet“: mol.',
  sections: [
    {
      title: 'Mol: chemický tucet',
      icon: 'egg',
      blocks: [
        {
          type: 'p',
          text: 'Vejce kupuješ po tuctech (12 kusů), papír po balících (500 listů). Atomy a molekuly jsou tak malé, že chemici potřebují „balení“ s obrovským počtem kusů. Tím balením je **mol**.',
        },
        {
          type: 'diagram',
          id: 'mole-scale',
          caption: 'Tucet, balík, mol: jeden mol je obří balení 6,022·10^{23} částic.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'látkové množství $n$', def: 'veličina, která říká, kolik částic (atomů, molekul, iontů) látka obsahuje; jednotka **mol**' },
            { term: 'mol', def: 'látkové množství, které obsahuje přesně 6,022·10^{23} částic' },
            { term: 'Avogadrova konstanta $N_{A}$', def: '$N_{A}$ = 6,022·10^{23} mol^{−1}; počet částic v jednom molu' },
          ],
        },
        {
          type: 'formula',
          text: '$n = N / N_{A}$',
          caption: '$n$ látkové množství (mol), $N$ počet částic, $N_{A}$ = 6,022·10^{23} mol^{−1}',
        },
        {
          type: 'example',
          title: 'Z molů na částice',
          problem: 'Kolik molekul je ve 2,5 mol oxidu uhličitého?',
          steps: [
            'Vyjádříme počet částic: $N = n · N_{A}$',
            'Dosadíme: $N$ = 2,5 mol · 6,022·10^{23} mol^{−1}',
            'Jednotky mol a mol^{−1} se vykrátí: $N$ = 15,055·10^{23}',
          ],
          answer: '$N$ ≈ 1,51·10^{24} molekul $CO2$',
        },
        {
          type: 'example',
          title: 'Z částic na moly',
          problem: 'Železný hřebík obsahuje 3,011·10^{23} atomů železa. Jaké je to látkové množství?',
          steps: [
            '$n = N / N_{A}$',
            '$n$ = 3,011·10^{23} : 6,022·10^{23} mol^{−1}',
            '$n$ = 0,5 mol',
          ],
          answer: 'Hřebík obsahuje 0,5 mol železa.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'molekuly $O2$', items: [{ species: 'O2', count: 4 }], state: 'gas', note: '4 molekuly = 8 atomů O' },
            { label: 'molekuly $H2O$', items: [{ species: 'H2O', count: 4 }], state: 'liquid', note: '4 molekuly = 8 atomů H + 4 atomy O' },
          ],
          caption: 'Stejně je to s moly: 1 mol $O2$ = 2 mol atomů O; 1 mol $H2O$ = 2 mol atomů H + 1 mol atomů O.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Vždy řekni, čeho mol',
          text: '1 mol molekul $O2$ obsahuje **2 mol atomů** kyslíku. ==Než začneš počítat, ujasni si, jaké částice počítáš.==',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Od roku 2019 je mol definován přímo pevnou hodnotou Avogadrovy konstanty: $N_{A}$ = 6,022 140 76·10^{23} mol^{−1}. Kdybys měl mol zrnek máku, pokryl bys celou Českou republiku vrstvou vysokou přes dva kilometry.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké látkové množství odpovídá 1,2044·10^{24} molekulám vody?',
            answer: 2,
            unit: 'mol',
            explain: '$n$ = 1,2044·10^{24} : 6,022·10^{23} mol^{−1} = 2 mol.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik atomů vodíku je v 1 mol molekul vody? Zapiš výsledek jako násobek 10^{23}.',
            answer: 12.044,
            tolerance: 0.05,
            unit: '·10²³',
            explain: 'Každá molekula $H2O$ má 2 atomy H, takže 2 mol atomů H: 2 · 6,022·10^{23} = 12,044·10^{23}.',
          },
        },
      ],
    },
    {
      title: 'Molární hmotnost',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Částice nespočítáš, ale můžeš je zvážit. Most mezi hmotností a látkovým množstvím tvoří **molární hmotnost** $M$, hmotnost jednoho molu látky. V g/mol má stejnou číselnou hodnotu jako **relativní molekulová hmotnost** $M_{r}$, tedy součet relativních atomových hmotností $A_{r}$ všech atomů ve vzorci (najdeš je v periodické tabulce).',
        },
        {
          type: 'diagram',
          id: 'mole-bridge',
          caption: 'Látkové množství je most: z něj se dostaneš k hmotnosti, k počtu částic i k objemu plynu.',
        },
        {
          type: 'formula',
          text: '$n = m / M$',
          caption: '$m$ hmotnost (g), $M$ molární hmotnost (g/mol), $n$ látkové množství (mol)',
        },
        {
          type: 'example',
          title: 'Molární hmotnost ze vzorce',
          problem: 'Spočítej molární hmotnost vody, vápence a oxidu hlinitého. ($A_{r}$: H 1, C 12, O 16, Al 27, Ca 40)',
          steps: [
            '$M(H2O)$ = 2 · 1 + 16 = 18 g/mol',
            '$M(CaCO3)$ = 40 + 12 + 3 · 16 = 100 g/mol',
            '$M(Al2O3)$ = 2 · 27 + 3 · 16 = 54 + 48 = 102 g/mol',
          ],
          answer: '18 g/mol, 100 g/mol a 102 g/mol',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'balance-scale', title: 'hmotnost $m$', text: 'v gramech' },
            { icon: 'calculator', title: '÷ $M$', text: 'molární hmotnost v g/mol' },
            { icon: 'atom', title: 'látkové množství $n$', text: 'v molech' },
            { icon: 'calculator', title: '× $N_{A}$', text: '6,022·10^{23} mol^{−1}' },
            { icon: 'molecule', title: 'počet částic $N$' },
          ],
          caption: 'Opačným směrem násobíš $M$ a dělíš $N_{A}$. Trojúhelník $m$–$n$–$M$: zakryj, co hledáš, a zbude $m = n · M$, $n = m / M$ nebo $M = m / n$.',
        },
        {
          type: 'example',
          title: 'Z hmotnosti na moly a na částice',
          problem: 'V láhvi sodovky je rozpuštěno 8,8 g $CO2$. Jaké je to látkové množství a kolik molekul to je? ($A_{r}$: C 12, O 16)',
          steps: [
            '$M(CO2)$ = 12 + 2 · 16 = 44 g/mol',
            '$n = m / M$ = 8,8 g : 44 g/mol = 0,2 mol',
            '$N = n · N_{A}$ = 0,2 mol · 6,022·10^{23} mol^{−1} = 1,204·10^{23}',
          ],
          answer: '0,2 mol, tedy asi 1,2·10^{23} molekul $CO2$',
        },
        {
          type: 'example',
          title: 'Z molů na hmotnost',
          problem: 'Kolik gramů vápence $CaCO3$ odpovídá 0,25 mol?',
          steps: [
            '$m = n · M$',
            '$M(CaCO3)$ = 100 g/mol',
            '$m$ = 0,25 mol · 100 g/mol = 25 g',
          ],
          answer: '$m$ = 25 g',
        },
        {
          type: 'molecule',
          molecules: ['Cl2', 'O2', 'N2', 'H2'],
          labels: ['$M(Cl2)$ = 71 g/mol', '$M(O2)$ = 32 g/mol', '$M(N2)$ = 28 g/mol', '$M(H2)$ = 2 g/mol'],
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Chlor, kyslík, dusík i vodík tvoří dvouatomové molekuly. $M(Cl2)$ = 71 g/mol, ne 35,5 g/mol. Podobně $M(O2)$ = 32 g/mol.',
        },
        {
          type: 'game',
          gameId: 'molar-mass',
          text: 'Procvič si sčítání atomových hmotností ve hře Molární hmotnost.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaká je molární hmotnost oxidu železitého $Fe2O3$? ($A_{r}$: Fe 56, O 16)',
            answer: 160,
            tolerance: 0.5,
            unit: 'g/mol',
            explain: '$M$ = 2 · 56 + 3 · 16 = 112 + 48 = 160 g/mol.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké látkové množství je v 11,7 g kuchyňské soli $NaCl$? ($A_{r}$: Na 23, Cl 35,5)',
            answer: 0.2,
            tolerance: 0.005,
            unit: 'mol',
            explain: '$M(NaCl)$ = 23 + 35,5 = 58,5 g/mol; $n$ = 11,7 g : 58,5 g/mol = 0,2 mol.',
          },
        },
      ],
    },
    {
      title: 'Molární objem plynů',
      icon: 'balloon',
      blocks: [
        {
          type: 'p',
          text: 'U plynů se hodí měřit objem. **Avogadrův zákon** říká, že stejné objemy různých plynů obsahují za stejné teploty a tlaku stejný počet molekul, ať jde o lehoučký vodík, nebo těžký oxid uhličitý.',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'vodík $H2$', items: [{ species: 'H2', count: 6 }], state: 'gas' },
            { label: 'kyslík $O2$', items: [{ species: 'O2', count: 6 }], state: 'gas' },
            { label: 'oxid uhličitý $CO2$', items: [{ species: 'CO2', count: 6 }], state: 'gas' },
          ],
          caption: 'Stejný objem, teplota a tlak → stejný počet molekul.',
        },
        {
          type: 'p',
          text: 'Jeden mol libovolného plynu proto za **normálních podmínek** (0 °C a 101,325 kPa) zaujímá stejný objem. Říkáme mu **molární objem** $V_{m}$.',
        },
        {
          type: 'formula',
          text: '$n = V / V_{m}$',
          caption: '$V_{m}$ = 22,4 dm^{3}/mol za normálních podmínek (0 °C, 101,325 kPa)',
        },
        {
          type: 'example',
          title: 'Objem z hmotnosti',
          problem: 'Jaký objem zaujímá 8,8 g $CO2$ za normálních podmínek?',
          steps: [
            '$n = m / M$ = 8,8 g : 44 g/mol = 0,2 mol',
            '$V = n · V_{m}$ = 0,2 mol · 22,4 dm^{3}/mol',
            '$V$ = 4,48 dm^{3}',
          ],
          answer: '$V$ ≈ 4,48 dm^{3} (skoro pět litrů)',
        },
        {
          type: 'example',
          title: 'Hmotnost z objemu',
          problem: 'Balonek obsahuje 5,6 dm^{3} vodíku (normální podmínky). Kolik vodík váží? ($A_{r}$(H) = 1)',
          steps: [
            '$n = V / V_{m}$ = 5,6 dm^{3} : 22,4 dm^{3}/mol = 0,25 mol',
            '$M(H2)$ = 2 g/mol',
            '$m = n · M$ = 0,25 mol · 2 g/mol = 0,5 g',
          ],
          answer: '$m$ = 0,5 g vodíku',
        },
        {
          type: 'compare',
          columns: [
            {
              title: '1 mol plynu',
              icon: 'balloon',
              tone: 'good',
              points: ['za normálních podmínek zabere 22,4 dm^{3}', 'platí pro jakýkoli plyn'],
            },
            {
              title: '1 mol kapalné vody',
              icon: 'drop',
              tone: 'bad',
              points: ['18 g zabere asi 18 cm^{3}', 'víc než tisíckrát menší objem', '22,4 dm^{3}/mol pro kapaliny neplatí'],
            },
          ],
          caption: 'Pozor: molární objem 22,4 dm^{3}/mol platí jen pro plyny!',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Mezinárodní unie IUPAC dnes jako standardní tlak doporučuje 100 kPa, pak vychází $V_{m}$ ≈ 22,7 dm^{3}/mol. Při pokojové teplotě 25 °C je to asi 24,5 dm^{3}/mol. V českých školách se běžně počítá s 22,4 dm^{3}/mol, pokud zadání neříká jinak.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaký objem zaujímají 2 mol dusíku $N2$ za normálních podmínek?',
            answer: 44.8,
            tolerance: 0.2,
            unit: 'dm³',
            explain: '$V = n · V_{m}$ = 2 mol · 22,4 dm^{3}/mol = 44,8 dm^{3}.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik gramů váží 11,2 dm^{3} kyslíku $O2$ za normálních podmínek? ($A_{r}$(O) = 16)',
            answer: 16,
            tolerance: 0.2,
            unit: 'g',
            explain: '$n$ = 11,2 : 22,4 = 0,5 mol; $m$ = 0,5 mol · 32 g/mol = 16 g.',
          },
        },
      ],
    },
    {
      title: 'Stavová rovnice ideálního plynu',
      icon: 'thermometer',
      blocks: [
        {
          type: 'p',
          text: 'Co když plyn není za normálních podmínek? Pak použiješ **stavovou rovnici ideálního plynu**, která spojuje tlak, objem, teplotu a látkové množství.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'car', title: 'pneumatika', text: 'vyšší tlak než venku' },
            { icon: 'gas-cylinder', title: 'bombička do šlehačky', text: 'plyn stlačený do malého objemu' },
            { icon: 'ocean', title: 'potápěčská láhev', text: 'vysoký tlak, studená voda' },
          ],
        },
        {
          type: 'formula',
          text: '$pV = nRT$',
          caption: '$p$ tlak (Pa), $V$ objem (m^{3}), $n$ látkové množství (mol), $T$ teplota (K), $R$ = 8,314 J·K^{−1}·mol^{−1}',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'thermometer', title: 'teplota v kelvinech', text: '$T$ = $t$ + 273,15 (25 °C = 298,15 K)' },
            { icon: 'beaker', title: 'objem v m^{3}', text: '1 dm^{3} = 0,001 m^{3}' },
            { icon: 'gas-cloud', title: 'tlak v pascalech', text: '1 kPa = 1000 Pa' },
            { icon: 'idea', title: 'pohodlná zkratka', text: 'když dosadíš tlak v kPa a objem v dm^{3}, jednotky také sedí' },
          ],
        },
        {
          type: 'example',
          title: 'Objem plynu při pokojové teplotě',
          problem: 'Jaký objem zaujímají 2 mol plynu při 25 °C a tlaku 100 kPa?',
          steps: [
            'Převod: $T$ = 25 + 273,15 = 298,15 K; $p$ = 100 000 Pa',
            'Vyjádříme objem: $V = nRT / p$',
            '$V$ = 2 mol · 8,314 J·K^{−1}·mol^{−1} · 298,15 K : 100 000 Pa',
            '$V$ = 0,0496 m^{3} = 49,6 dm^{3}',
          ],
          answer: '$V$ ≈ 49,6 dm^{3}',
        },
        {
          type: 'example',
          title: 'Bombička do šlehačky',
          problem: 'Bombička do šlehačky obsahuje 8 g oxidu dusného $N2O$. Jaký objem by plyn zaujal při 20 °C a tlaku 101,3 kPa? ($A_{r}$: N 14, O 16)',
          steps: [
            '$M(N2O)$ = 2 · 14 + 16 = 44 g/mol; $n$ = 8 g : 44 g/mol = 0,182 mol',
            '$T$ = 20 + 273,15 = 293,15 K; $p$ = 101 300 Pa',
            '$V = nRT / p$ = 0,182 mol · 8,314 J·K^{−1}·mol^{−1} · 293,15 K : 101 300 Pa',
            '$V$ = 0,004 37 m^{3} = 4,37 dm^{3}',
          ],
          answer: 'Z malé bombičky by vzniklo asi 4,4 dm^{3} plynu, proto je v ní tak vysoký tlak.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nejčastější chyba',
          text: 'Dosadit teplotu ve stupních Celsia. Při 0 °C by ti vyšlo, že plyn nemá žádný objem, a při −10 °C dokonce záporný. ==V rovnici $pV = nRT$ je teplota vždy v kelvinech.==',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'V nádobě o objemu 10 dm^{3} je 0,5 mol plynu při teplotě 300 K. Jaký je tlak plynu v kPa?',
            answer: 124.7,
            tolerance: 1,
            unit: 'kPa',
            explain: '$p = nRT / V$ = 0,5 · 8,314 · 300 : 0,010 m^{3} = 124 710 Pa ≈ 124,7 kPa.',
          },
        },
      ],
    },
    {
      title: 'Složení sloučeniny a empirický vzorec',
      icon: 'crystal',
      blocks: [
        {
          type: 'p',
          text: 'Hmotnostní zlomek znáš z roztoků. Stejně spočítáš, jakou část hmotnosti sloučeniny tvoří jeden prvek. Hutník tak zjistí, kolik železa dostane z tuny rudy.',
        },
        {
          type: 'formula',
          text: '$w(X) = x · A_{r}(X) / M_{r}$',
          caption: '$x$ je počet atomů prvku X ve vzorci',
        },
        {
          type: 'example',
          title: 'Kolik železa je v rudě',
          problem: 'Jaký je hmotnostní zlomek železa v oxidu železitém $Fe2O3$ (ruda hematit)? ($A_{r}$: Fe 56, O 16)',
          steps: [
            '$M_{r}(Fe2O3)$ = 2 · 56 + 3 · 16 = 160',
            '$w(Fe)$ = 2 · 56 : 160 = 112 : 160',
            '$w(Fe)$ = 0,70',
          ],
          answer: '$w(Fe)$ = 0,70 = 70 %. Z tuny čistého hematitu získáš 700 kg železa.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'empirický (stechiometrický) vzorec',
              icon: 'pencil',
              tone: 'a',
              points: ['nejmenší celočíselný poměr atomů ve sloučenině', 'např. $CH2O$'],
            },
            {
              title: 'molekulový vzorec',
              icon: 'molecule',
              tone: 'b',
              points: ['skutečný počet atomů v molekule', 'např. glukóza $C6H12O6$', 'je to celistvý násobek empirického vzorce'],
            },
          ],
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'balance-scale', title: 'vezmi 100 g látky', text: 'procenta se změní na gramy' },
            { icon: 'calculator', title: 'převeď na moly', text: '$n = m / A_{r}$ pro každý prvek' },
            { icon: 'chart', title: 'vyděl nejmenším číslem', text: 'dostaneš poměr atomů' },
            { icon: 'check', title: 'dotáhni na celá čísla', text: '1,5 → ×2; 1,33 → ×3' },
            { icon: 'pencil', title: 'napiš vzorec', text: 'z poměru a molární hmotnosti' },
          ],
          caption: 'Jak najít empirický (a molekulový) vzorec ze složení',
        },
        {
          type: 'example',
          title: 'Empirický vzorec ze složení',
          problem: 'Analýza černého oxidu železa ukázala 72,4 % Fe a 27,6 % O. Urči empirický vzorec. ($A_{r}$: Fe 56, O 16)',
          steps: [
            'Vezmeme 100 g látky: je v ní 72,4 g Fe a 27,6 g O.',
            'Převedeme na moly: $n(Fe)$ = 72,4 : 56 = 1,293 mol; $n(O)$ = 27,6 : 16 = 1,725 mol',
            'Vydělíme nejmenším číslem: Fe 1,293 : 1,293 = 1; O 1,725 : 1,293 = 1,334',
            '1,334 je skoro 4/3, proto obě čísla vynásobíme třemi: Fe 3, O 4',
          ],
          answer: 'Empirický vzorec je $Fe3O4$ (magnetit, magnetická železná ruda).',
        },
        {
          type: 'example',
          title: 'Od empirického k molekulovému vzorci',
          problem: 'Cukr obsahuje 40,0 % C, 6,7 % H a 53,3 % O. Jeho molární hmotnost je 180 g/mol. Urči empirický i molekulový vzorec. ($A_{r}$: H 1, C 12, O 16)',
          steps: [
            'Ve 100 g: $n(C)$ = 40,0 : 12 = 3,33 mol; $n(H)$ = 6,7 : 1 = 6,7 mol; $n(O)$ = 53,3 : 16 = 3,33 mol',
            'Vydělíme nejmenším (3,33): C 1, H 2,01 ≈ 2, O 1, empirický vzorec $CH2O$',
            '$M(CH2O)$ = 12 + 2 + 16 = 30 g/mol',
            'Kolikrát se vejde do 180? 180 : 30 = 6, proto vše násobíme šesti.',
          ],
          answer: 'Empirický vzorec $CH2O$, molekulový vzorec $C6H12O6$ (glukóza).',
        },
        {
          type: 'molecule',
          molecules: ['glucose'],
          labels: ['glukóza $C6H12O6$ = 6 × $CH2O$'],
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Když ti po vydělení vyjde 1,5, násob dvěma. Když 1,33 nebo 1,67, násob třemi. Když 1,25, násob čtyřmi. Zaokrouhluj jen čísla opravdu blízká celému číslu (2,01 → 2, ale 1,5 není 2!).',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaký je hmotnostní zlomek kyslíku ve vodě $H2O$ v procentech? ($A_{r}$: H 1, O 16)',
            answer: 88.9,
            tolerance: 0.2,
            unit: '%',
            explain: '$w(O)$ = 16 : 18 = 0,889 = 88,9 %.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Plyn obsahuje 75 % uhlíku a 25 % vodíku. Napiš jeho empirický vzorec. ($A_{r}$: H 1, C 12)',
            accept: ['CH4', 'H4C'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: '$n(C)$ = 75 : 12 = 6,25 mol, $n(H)$ = 25 : 1 = 25 mol; poměr 1 : 4, tedy $CH4$ (methan).',
          },
        },
      ],
    },
  ],
  summary: [
    'Látkové množství $n$ se měří v molech; 1 mol obsahuje $N_{A}$ = 6,022·10^{23} částic a platí $n = N / N_{A}$.',
    'Molární hmotnost $M$ (g/mol) sečteš z relativních atomových hmotností; platí $n = m / M$.',
    'Jeden mol každého plynu zaujímá za normálních podmínek 22,4 dm^{3}, platí $n = V / V_{m}$.',
    'Pro plyn za jiných podmínek použiješ $pV = nRT$ s teplotou v kelvinech a tlakem v pascalech.',
    'Hmotnostní zlomek prvku ve sloučenině je $w(X) = x · A_{r}(X) / M_{r}$.',
    'Empirický vzorec získáš převedením hmotností prvků na moly a hledáním nejmenšího celočíselného poměru.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: '1 mol vodíku $H2$ a 1 mol oxidu uhličitého $CO2$ obsahují stejný počet molekul.',
      answer: true,
      explain: 'Mol je vždy 6,022·10^{23} částic. Liší se jen hmotnost: 2 g oproti 44 g.',
    },
    {
      kind: 'number',
      q: 'Jaká je molární hmotnost síranu měďnatého $CuSO4$? ($A_{r}$: Cu 63,5, S 32, O 16)',
      answer: 159.5,
      tolerance: 0.5,
      unit: 'g/mol',
      explain: '$M$ = 63,5 + 32 + 4 · 16 = 159,5 g/mol.',
    },
    {
      kind: 'number',
      q: 'Kolik gramů váží 1,5 mol vody? ($A_{r}$: H 1, O 16)',
      answer: 27,
      tolerance: 0.2,
      unit: 'g',
      explain: '$m = n · M$ = 1,5 mol · 18 g/mol = 27 g.',
    },
    {
      kind: 'match',
      q: 'Přiřaď veličinu k její jednotce.',
      pairs: [
        ['látkové množství $n$', 'mol'],
        ['molární hmotnost $M$', 'g/mol'],
        ['molární objem $V_{m}$', 'dm^{3}/mol'],
        ['Avogadrova konstanta $N_{A}$', 'mol^{−1}'],
      ],
      explain: 'Jednotky vyplývají z definic: $M = m/n$, $V_{m} = V/n$, $N_{A} = N/n$.',
    },
    {
      kind: 'number',
      q: 'Kolik molekul je ve 22 g $CO2$? Výsledek zapiš jako násobek 10^{23}. ($A_{r}$: C 12, O 16)',
      answer: 3.011,
      tolerance: 0.02,
      unit: '·10²³',
      explain: '$n$ = 22 g : 44 g/mol = 0,5 mol; $N$ = 0,5 · 6,022·10^{23} = 3,011·10^{23} molekul.',
    },
    {
      kind: 'choice',
      q: 'Jaký objem zaujme 0,5 mol $CO2$ za normálních podmínek?',
      options: ['11,2 dm^{3}', '22,4 dm^{3}', '44,8 dm^{3}', '22 dm^{3}'],
      answer: 0,
      explain: '$V = n · V_{m}$ = 0,5 · 22,4 = 11,2 dm^{3}. Druh plynu nehraje roli.',
    },
    {
      kind: 'number',
      q: 'Jaký je hmotnostní zlomek dusíku v amoniaku $NH3$ v procentech? ($A_{r}$: N 14, H 1)',
      answer: 82.4,
      tolerance: 0.2,
      unit: '%',
      explain: '$w(N)$ = 14 : 17 = 0,824 = 82,4 %. Proto je amoniak tak vydatné dusíkaté hnojivo.',
    },
    {
      kind: 'text',
      q: 'Oxid obsahuje 52,9 % hliníku a 47,1 % kyslíku. Napiš jeho empirický vzorec. ($A_{r}$: Al 27, O 16)',
      accept: ['Al2O3'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: '$n(Al)$ = 52,9 : 27 = 1,96 mol, $n(O)$ = 47,1 : 16 = 2,94 mol; poměr 1 : 1,5 = 2 : 3, tedy $Al2O3$.',
    },
  ],
}

const l4_5: Lesson = {
  id: 'l4-5',
  title: 'Koncentrace roztoků a ředění',
  goals: [
    'Spočítat molární koncentraci roztoku a hmotnost látky potřebnou k jeho přípravě',
    'Převést hmotnostní zlomek na molární koncentraci pomocí hustoty a zpět',
    'Vypočítat ředění podle vztahu $c1V1 = c2V2$',
    'Spočítat koncentraci roztoku vzniklého smícháním dvou roztoků',
  ],
  hook: 'Na lahvičce fyziologického roztoku stojí „0,9 %“, na lahvi v laborce „1 mol/dm^{3}“. Obojí říká, kolik látky je v roztoku, jen každé jiným jazykem. Dnes se naučíš oba a hlavně mezi nimi překládat.',
  sections: [
    {
      title: 'Molární koncentrace',
      blocks: [
        {
          type: 'p',
          text: 'V první úrovni jsi složení roztoku popisoval **hmotnostním zlomkem** $w$: kolik gramů látky je ve 100 g roztoku. Chemik ale potřebuje vědět, kolik **částic** v roztoku je, protože reakce probíhají mezi částicemi. Proto používá **molární koncentraci**.',
        },
        {
          type: 'formula',
          text: '$c = n / V$',
          caption: '$c$ molární koncentrace (mol/dm^{3}), $n$ látkové množství rozpuštěné látky (mol), $V$ objem roztoku (dm^{3})',
        },
        {
          type: 'p',
          text: 'Když dosadíš $n = m / M$, dostaneš vzorec, se kterým se počítá nejčastěji:',
        },
        {
          type: 'formula',
          text: '$c = m / (M · V)$',
        },
        {
          type: 'example',
          title: 'Solný roztok',
          problem: 'Rozpustíš 5,85 g $NaCl$ a doplníš vodou na objem 250 cm^{3}. Jaká je molární koncentrace? ($A_{r}$: Na 23, Cl 35,5)',
          steps: [
            '$M(NaCl)$ = 23 + 35,5 = 58,5 g/mol',
            '$n = m / M$ = 5,85 g : 58,5 g/mol = 0,100 mol',
            'Převedeme objem: $V$ = 250 cm^{3} = 0,250 dm^{3}',
            '$c = n / V$ = 0,100 mol : 0,250 dm^{3} = 0,400 mol/dm^{3}',
          ],
          answer: '$c$ = 0,4 mol/dm^{3}',
        },
        {
          type: 'example',
          title: 'Cukr v čaji',
          problem: 'Do hrnku čaje (250 cm^{3}) hodíš dvě kostky cukru, dohromady 10 g sacharosy $C12H22O11$. Jaká je molární koncentrace cukru? ($A_{r}$: H 1, C 12, O 16; objem se rozpuštěním prakticky nezmění.)',
          steps: [
            '$M(C12H22O11)$ = 12 · 12 + 22 · 1 + 11 · 16 = 144 + 22 + 176 = 342 g/mol',
            '$n$ = 10 g : 342 g/mol = 0,0292 mol',
            '$c$ = 0,0292 mol : 0,250 dm^{3} = 0,117 mol/dm^{3}',
          ],
          answer: '$c$ ≈ 0,12 mol/dm^{3}',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Dvě klasické chyby',
          text: 'Objem musí být v dm^{3}: 250 cm^{3} = 0,250 dm^{3}, ne 250. A $V$ je ==objem celého roztoku==, ne objem vody, do které látku sypeš.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'V 500 cm^{3} roztoku je rozpuštěno 0,2 mol glukosy. Jaká je molární koncentrace?',
            answer: 0.4,
            tolerance: 0.005,
            unit: 'mol/dm³',
            explain: '$c = n / V$ = 0,2 mol : 0,500 dm^{3} = 0,4 mol/dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Jak připravit roztok o dané koncentraci',
      blocks: [
        {
          type: 'p',
          text: 'Laborant dostane úkol: „Připrav 250 cm^{3} roztoku $NaCl$ o koncentraci 0,5 mol/dm^{3}.“ Nejdřív počítá, pak váží. Vzorec otočí: $m = c · V · M$.',
        },
        {
          type: 'example',
          title: 'Kolik navážit',
          problem: 'Kolik gramů $NaCl$ potřebuješ na 250 cm^{3} roztoku o koncentraci 0,5 mol/dm^{3}?',
          steps: [
            '$n = c · V$ = 0,5 mol/dm^{3} · 0,250 dm^{3} = 0,125 mol',
            '$m = n · M$ = 0,125 mol · 58,5 g/mol = 7,31 g',
          ],
          answer: 'Navážíš 7,31 g $NaCl$.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Na analytických vahách přesně naváž vypočtené množství látky.',
            'Rozpusť ji v kádince v menším množství destilované vody.',
            'Roztok přelij nálevkou do **odměrné baňky** správného objemu.',
            'Kádinku i nálevku vypláchni destilovanou vodou a oplachy přidej do baňky.',
            'Doplň vodou po rysku (spodní okraj menisku se dotýká rysky) a baňku uzavři a promíchej.',
          ],
        },
        {
          type: 'example',
          title: 'Pozor na hydráty',
          problem: 'Máš připravit 100 cm^{3} roztoku síranu měďnatého o $c$ = 0,1 mol/dm^{3}. V laboratoři je jen modrá skalice $CuSO4·5H2O$. Kolik jí navážíš? ($A_{r}$: Cu 63,5, S 32, O 16, H 1; názvosloví solí přijde v úrovni 5)',
          steps: [
            '$n(CuSO4)$ = 0,1 mol/dm^{3} · 0,100 dm^{3} = 0,010 mol',
            'Každá jednotka hydrátu obsahuje jednu $CuSO4$, tedy $n(hydrátu)$ = 0,010 mol.',
            '$M(CuSO4·5H2O)$ = 63,5 + 32 + 4 · 16 + 5 · 18 = 249,5 g/mol',
            '$m$ = 0,010 mol · 249,5 g/mol = 2,50 g',
          ],
          answer: 'Navážíš 2,50 g modré skalice (bezvodého $CuSO4$ by stačilo jen 1,60 g).',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Síran měďnatý je zdraví škodlivý a dráždí oči. Při vážení a rozpouštění používej brýle a rukavice, rozsypané krystalky hned ukliď.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik gramů chloridu draselného $KCl$ potřebuješ na přípravu 200 cm^{3} roztoku o koncentraci 0,1 mol/dm^{3}? ($A_{r}$: K 39, Cl 35,5)',
            answer: 1.49,
            tolerance: 0.02,
            unit: 'g',
            explain: '$n$ = 0,1 · 0,200 = 0,020 mol; $M(KCl)$ = 74,5 g/mol; $m$ = 0,020 · 74,5 = 1,49 g.',
          },
        },
      ],
    },
    {
      title: 'Z hmotnostního zlomku na koncentraci',
      blocks: [
        {
          type: 'p',
          text: 'Koncentrované kyseliny a čpavek se prodávají s údajem v procentech (hmotnostní zlomek). Pro výpočty reakcí ale potřebuješ mol/dm^{3}. Mostem mezi nimi je **hustota** roztoku $ρ$, která převede objem na hmotnost.',
        },
        {
          type: 'formula',
          text: '$c = w · ρ / M$',
          caption: 'hustotu dosaď v g/dm^{3} (1 g/cm^{3} = 1000 g/dm^{3})',
        },
        {
          type: 'p',
          text: 'Odkud se vzorec bere? Představ si 1 dm^{3} roztoku. Váží $ρ$ gramů, z toho rozpuštěná látka tvoří $w · ρ$ gramů. Vydělíš-li to molární hmotností, máš počet molů v jednom dm^{3}, tedy koncentraci.',
        },
        {
          type: 'example',
          title: 'Fyziologický roztok',
          problem: 'Fyziologický roztok obsahuje 0,9 % $NaCl$, hustota je přibližně 1,00 g/cm^{3}. Jaká je jeho molární koncentrace?',
          steps: [
            '1 dm^{3} roztoku váží 1000 g.',
            'Hmotnost $NaCl$: $m$ = 0,009 · 1000 g = 9 g',
            '$n$ = 9 g : 58,5 g/mol = 0,154 mol',
            'Je to v 1 dm^{3}, proto $c$ = 0,154 mol/dm^{3}.',
          ],
          answer: '$c$ ≈ 0,154 mol/dm^{3}',
        },
        {
          type: 'example',
          title: 'Koncentrovaná kyselina chlorovodíková',
          problem: 'Koncentrovaný roztok chlorovodíku (kyselina chlorovodíková, o kyselinách víc v úrovni 5) má $w$ = 36 % a $ρ$ = 1,18 g/cm^{3}. Jaká je jeho molární koncentrace? ($A_{r}$: H 1, Cl 35,5)',
          steps: [
            '$ρ$ = 1,18 g/cm^{3} = 1180 g/dm^{3}',
            '$M(HCl)$ = 1 + 35,5 = 36,5 g/mol',
            '$c = w · ρ / M$ = 0,36 · 1180 g/dm^{3} : 36,5 g/mol',
            '$c$ = 11,6 mol/dm^{3}',
          ],
          answer: '$c$ ≈ 11,6 mol/dm^{3}, v praxi se říká „asi dvanáctimolární“.',
        },
        {
          type: 'example',
          title: 'A zpátky: z koncentrace na procenta',
          problem: 'Roztok $NaCl$ má $c$ = 2,0 mol/dm^{3} a hustotu 1,08 g/cm^{3}. Jaký je jeho hmotnostní zlomek?',
          steps: [
            'Vyjádříme $w = c · M / ρ$',
            '$w$ = 2,0 mol/dm^{3} · 58,5 g/mol : 1080 g/dm^{3}',
            '$w$ = 117 : 1080 = 0,108',
          ],
          answer: '$w$ ≈ 10,8 %',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Bezpečnost',
          text: 'Koncentrovaná kyselina chlorovodíková i čpavek jsou žíravé a uvolňují dráždivé výpary. Pracuj v digestoři, v brýlích a rukavicích.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Koncentrovaný čpavek je roztok amoniaku $NH3$ s $w$ = 25 % a hustotou 0,91 g/cm^{3}. Jaká je jeho molární koncentrace? ($A_{r}$: N 14, H 1)',
            answer: 13.4,
            tolerance: 0.15,
            unit: 'mol/dm³',
            explain: '$c$ = 0,25 · 910 g/dm^{3} : 17 g/mol = 13,4 mol/dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Ředění: c₁V₁ = c₂V₂',
      blocks: [
        {
          type: 'p',
          text: 'Když do roztoku přileješ vodu, objem vzroste, ale **látkové množství rozpuštěné látky zůstane stejné**. Nic jsi nepřidal ani neubral, jen jsi to samé rozptýlil do většího objemu.',
        },
        {
          type: 'formula',
          text: '$c1 · V1 = c2 · V2$',
          caption: 'před zředěním ($c1$, $V1$) a po zředění ($c2$, $V2$); obě strany jsou rovny $n$',
        },
        {
          type: 'example',
          title: 'Ředění zásobního roztoku',
          problem: 'Máš zásobní roztok $NaCl$ o koncentraci 2,0 mol/dm^{3}. Potřebuješ 250 cm^{3} roztoku o koncentraci 0,40 mol/dm^{3}. Kolik zásobního roztoku odměříš?',
          steps: [
            '$V1 = c2 · V2 / c1$',
            '$V1$ = 0,40 mol/dm^{3} · 250 cm^{3} : 2,0 mol/dm^{3}',
            '$V1$ = 50 cm^{3}',
            'Odměříš 50 cm^{3} zásobního roztoku do odměrné baňky na 250 cm^{3} a doplníš vodou po rysku.',
          ],
          answer: '$V1$ = 50 cm^{3}; vody přidáš asi 200 cm^{3}, ne 250 cm^{3}.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'V rovnici ředění nemusíš převádět cm^{3} na dm^{3}. Stačí, když máš oba objemy ve stejných jednotkách, protože se vykrátí.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Ředění kyselin',
          text: 'Při ředění koncentrované kyseliny se uvolňuje hodně tepla. Proto vždy platí: ==nejdřív voda, potom kyselina==. Kyselinu liješ pomalu do vody za míchání, nikdy naopak.',
        },
        {
          type: 'example',
          title: 'Zředěná kyselina chlorovodíková',
          problem: 'Kolik cm^{3} koncentrované kyseliny chlorovodíkové ($c$ = 12 mol/dm^{3}) potřebuješ na 500 cm^{3} roztoku o koncentraci 1,0 mol/dm^{3}?',
          steps: [
            '$V1 = c2 · V2 / c1$',
            '$V1$ = 1,0 mol/dm^{3} · 500 cm^{3} : 12 mol/dm^{3}',
            '$V1$ = 41,7 cm^{3}',
          ],
          answer: 'Do baňky s asi 300 cm^{3} vody opatrně přilij 41,7 cm^{3} kyseliny a doplň po rysku.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Odpipetuješ 20 cm^{3} roztoku o koncentraci 5,0 mol/dm^{3} a zředíš ho vodou na 100 cm^{3}. Jaká je nová koncentrace?',
            answer: 1,
            tolerance: 0.01,
            unit: 'mol/dm³',
            explain: '$c2 = c1 · V1 / V2$ = 5,0 · 20 : 100 = 1,0 mol/dm^{3}. Roztok jsi zředil pětkrát.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Při ředění roztoku vodou se látkové množství rozpuštěné látky nemění.',
            answer: true,
            explain: 'Přidáváš jen vodu, rozpuštěná látka zůstává. Proto platí $c1V1 = c2V2$.',
          },
        },
      ],
    },
    {
      title: 'Směšování roztoků',
      blocks: [
        {
          type: 'p',
          text: 'Když smícháš dva roztoky téže látky, látková množství se sečtou. U zředěných vodných roztoků můžeš sečíst i objemy.',
        },
        {
          type: 'formula',
          text: '$c = (c1V1 + c2V2) / (V1 + V2)$',
          caption: 'koncentrace po smíchání dvou roztoků téže látky',
        },
        {
          type: 'example',
          title: 'Smíchání dvou roztoků',
          problem: 'Smícháš 200 cm^{3} roztoku $NaCl$ o koncentraci 0,50 mol/dm^{3} a 300 cm^{3} roztoku $NaCl$ o koncentraci 0,10 mol/dm^{3}. Jaká je výsledná koncentrace?',
          steps: [
            '$n1$ = 0,50 mol/dm^{3} · 0,200 dm^{3} = 0,100 mol',
            '$n2$ = 0,10 mol/dm^{3} · 0,300 dm^{3} = 0,030 mol',
            'Celkem $n$ = 0,130 mol v objemu $V$ = 0,500 dm^{3}',
            '$c$ = 0,130 mol : 0,500 dm^{3} = 0,26 mol/dm^{3}',
          ],
          answer: '$c$ = 0,26 mol/dm^{3}',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Výsledná koncentrace leží vždy **mezi** koncentracemi obou roztoků, blíž té, kterého roztoku je víc. Vyjde-li ti něco mimo, máš chybu.',
        },
        {
          type: 'example',
          title: 'Křížové pravidlo pro hmotnostní zlomky',
          problem: 'Kolik gramů 40% a kolik gramů 10% roztoku smícháš, abys dostal 300 g 20% roztoku?',
          steps: [
            'Poměr hmotností: 40% roztok : 10% roztok = (20 − 10) : (40 − 20) = 10 : 20 = 1 : 2',
            '300 g rozdělíme v poměru 1 : 2: 100 g a 200 g',
            'Kontrola: 0,40 · 100 g + 0,10 · 200 g = 40 g + 20 g = 60 g látky; 60 g : 300 g = 0,20',
          ],
          answer: '100 g 40% roztoku a 200 g 10% roztoku',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Objemy se ne vždy sčítají',
          text: 'Smícháš-li 50 cm^{3} lihu a 50 cm^{3} vody, dostaneš jen asi 96 cm^{3} směsi. Molekuly se do sebe „zasunou“ díky vodíkovým vazbám. U zředěných vodných roztoků je rozdíl zanedbatelný, u koncentrovaných raději počítej s hmotnostmi.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Smícháš 100 cm^{3} roztoku o koncentraci 1,0 mol/dm^{3} a 400 cm^{3} roztoku téže látky o koncentraci 0,50 mol/dm^{3}. Jaká je výsledná koncentrace?',
            answer: 0.6,
            tolerance: 0.005,
            unit: 'mol/dm³',
            explain: '$n$ = 0,100 + 0,200 = 0,300 mol, $V$ = 0,500 dm^{3}, $c$ = 0,300 : 0,500 = 0,60 mol/dm^{3}.',
          },
        },
      ],
    },
  ],
  summary: [
    'Molární koncentrace $c = n / V$ udává počet molů rozpuštěné látky v 1 dm^{3} roztoku.',
    'Hmotnost látky na přípravu roztoku spočítáš jako $m = c · V · M$; u hydrátů počítej s molární hmotností hydrátu.',
    'Roztok o přesné koncentraci se připravuje v odměrné baňce doplněním po rysku.',
    'Hmotnostní zlomek a molární koncentraci převádíš přes hustotu: $c = w · ρ / M$.',
    'Při ředění se látkové množství nemění: $c1V1 = c2V2$. Při ředění kyselin platí nejdřív voda, potom kyselina.',
    'Při směšování roztoků sečteš látková množství a objemy; výsledek leží mezi výchozími koncentracemi.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Ve vztahu $c = n / V$ je $V$ objem vody, ve které látku rozpouštíme.',
      answer: false,
      explain: '$V$ je objem celého výsledného roztoku. Proto se roztoky připravují doplněním po rysku v odměrné baňce.',
    },
    {
      kind: 'number',
      q: 'Rozpustíš 2,925 g $NaCl$ a doplníš vodou na 100 cm^{3}. Jaká je molární koncentrace? ($A_{r}$: Na 23, Cl 35,5)',
      answer: 0.5,
      tolerance: 0.005,
      unit: 'mol/dm³',
      explain: '$n$ = 2,925 : 58,5 = 0,050 mol; $c$ = 0,050 mol : 0,100 dm^{3} = 0,50 mol/dm^{3}.',
    },
    {
      kind: 'number',
      q: 'Kolik gramů glukosy $C6H12O6$ ($M$ = 180 g/mol) potřebuješ na 500 cm^{3} roztoku o koncentraci 0,2 mol/dm^{3}?',
      answer: 18,
      tolerance: 0.2,
      unit: 'g',
      explain: '$n$ = 0,2 · 0,500 = 0,100 mol; $m$ = 0,100 · 180 = 18 g.',
    },
    {
      kind: 'order',
      q: 'Seřaď kroky přípravy roztoku o přesné koncentraci.',
      items: [
        'vypočítat hmotnost látky',
        'navážit látku na vahách',
        'rozpustit ji v kádince v menším množství vody',
        'převést roztok do odměrné baňky a vypláchnout kádinku',
        'doplnit vodou po rysku a promíchat',
      ],
      explain: 'Nejdřív počítáš, pak vážíš, rozpouštíš a teprve v odměrné baňce doplníš přesně na požadovaný objem.',
    },
    {
      kind: 'number',
      q: 'Kolik cm^{3} vody musíš přidat ke 100 cm^{3} roztoku o koncentraci 3,0 mol/dm^{3}, abys dostal roztok o koncentraci 0,50 mol/dm^{3}?',
      answer: 500,
      tolerance: 2,
      unit: 'cm³',
      explain: '$V2$ = 3,0 · 100 : 0,50 = 600 cm^{3}. Přidat musíš 600 − 100 = 500 cm^{3} vody.',
    },
    {
      kind: 'number',
      q: 'Roztok $NaCl$ má $w$ = 20 % a hustotu 1,15 g/cm^{3}. Jaká je jeho molární koncentrace? ($A_{r}$: Na 23, Cl 35,5)',
      answer: 3.93,
      tolerance: 0.05,
      unit: 'mol/dm³',
      explain: '$c = w · ρ / M$ = 0,20 · 1150 g/dm^{3} : 58,5 g/mol = 3,93 mol/dm^{3}.',
    },
    {
      kind: 'multi',
      q: 'Co platí, když 50 cm^{3} roztoku o koncentraci 1 mol/dm^{3} zředíš vodou na 500 cm^{3}?',
      options: [
        'koncentrace klesne desetkrát, na 0,1 mol/dm^{3}',
        'látkové množství rozpuštěné látky zůstane 0,05 mol',
        'látkové množství klesne desetkrát',
        'přidal jsi 450 cm^{3} vody',
        'přidal jsi 500 cm^{3} vody',
      ],
      answers: [0, 1, 3],
      explain: '$n$ = 1 · 0,050 = 0,05 mol se nemění, objem vzrostl desetkrát, a tak koncentrace klesla desetkrát. Vody bylo potřeba 500 − 50 = 450 cm^{3}.',
    },
    {
      kind: 'number',
      q: 'Smícháš 250 cm^{3} roztoku o koncentraci 2,0 mol/dm^{3} a 750 cm^{3} roztoku téže látky o koncentraci 0,40 mol/dm^{3}. Jaká je výsledná koncentrace?',
      answer: 0.8,
      tolerance: 0.01,
      unit: 'mol/dm³',
      explain: '$n$ = 0,50 + 0,30 = 0,80 mol v 1,000 dm^{3}, tedy 0,80 mol/dm^{3}.',
    },
  ],
}

const l4_6: Lesson = {
  id: 'l4-6',
  title: 'Výpočty z chemických rovnic',
  goals: [
    'Vyčíst z vyčíslené rovnice poměr látkových množství reaktantů a produktů',
    'Vypočítat hmotnost nebo objem produktu z hmotnosti reaktantu (m → n → n → m)',
    'Určit limitující reaktant a spočítat, kolik látky zbude v nadbytku',
    'Spočítat výtěžek reakce a řešit úlohy o více krocích',
  ],
  hook: 'Recept na palačinky: 2 vejce na 250 ml mléka. Máš 6 vajec, ale jen půl litru mléka. Kolik dávek upečeš? Když na to přijdeš, umíš počítat jako chemik. Rovnice je recept a mol je jeho odměrka.',
  sections: [
    {
      title: 'Rovnice jako recept',
      blocks: [
        {
          type: 'p',
          text: 'Z lekce o rovnicích víš, že koeficienty udávají poměr **počtu částic**. A protože mol je jen „balení“ částic, udávají koeficienty i ==poměr látkových množství==.',
        },
        {
          type: 'formula',
          text: '$N2 + 3H2 -> 2NH3$',
          caption: '1 mol $N2$ reaguje se 3 mol $H2$ a vzniknou 2 mol $NH3$',
        },
        {
          type: 'formula',
          text: '$n(A) : n(B) = a : b$',
          caption: '$a$, $b$ jsou koeficienty látek A a B v rovnici',
        },
        {
          type: 'example',
          title: 'Kolik amoniaku',
          problem: 'Kolik molů amoniaku vznikne ze 4,5 mol vodíku (dusíku je dost)?',
          steps: [
            'Poměr z rovnice: $n(NH3) : n(H2)$ = 2 : 3',
            '$n(NH3)$ = 4,5 mol · 2/3',
            '$n(NH3)$ = 3,0 mol',
          ],
          answer: 'Vzniknou 3,0 mol $NH3$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Koeficienty nejsou gramy',
          text: 'Poměr 1 : 3 : 2 platí pro moly, ne pro hmotnosti. Hmotnostně reaguje 28 g $N2$ se 6 g $H2$ na 34 g $NH3$. Hmotnost se zachovává (28 + 6 = 34), počet molů ne (4 → 2).',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik molů kyslíku spotřebuje dokonalé spálení 2 mol methanu podle rovnice $CH4 + 2O2 -> CO2 + 2H2O$?',
            answer: 4,
            tolerance: 0,
            unit: 'mol',
            explain: 'Poměr $n(O2) : n(CH4)$ = 2 : 1, takže 2 mol · 2 = 4 mol $O2$.',
          },
        },
      ],
    },
    {
      title: 'Z hmotnosti na hmotnost',
      blocks: [
        {
          type: 'p',
          text: 'Váhy neměří moly, ale gramy. Většina úloh proto vypadá takto: známe hmotnost jedné látky a hledáme hmotnost jiné. Postup má vždy stejné čtyři kroky.',
        },
        {
          type: 'formula',
          text: '$m(A) -> n(A) -> n(B) -> m(B)$',
          caption: 'přes $M(A)$, přes poměr koeficientů, přes $M(B)$',
        },
        {
          type: 'example',
          title: 'Pálení vápna',
          problem: 'Kolik gramů páleného vápna $CaO$ vznikne rozkladem 250 g vápence $CaCO3$? ($A_{r}$: C 12, O 16, Ca 40)',
          steps: [
            'Rovnice: $CaCO3 -> CaO + CO2$',
            '$n(CaCO3)$ = 250 g : 100 g/mol = 2,5 mol',
            'Poměr 1 : 1, tedy $n(CaO)$ = 2,5 mol',
            '$m(CaO)$ = 2,5 mol · 56 g/mol = 140 g',
          ],
          answer: 'Vznikne 140 g $CaO$ (a zbylých 110 g odejde jako $CO2$).',
        },
        {
          type: 'example',
          title: 'Vysoká pec',
          problem: 'Ve vysoké peci se železo vyrábí redukcí rudy oxidem uhelnatým: $Fe2O3 + 3CO -> 2Fe + 3CO2$. Kolik kilogramů železa získáš z 800 kg $Fe2O3$? ($A_{r}$: Fe 56, O 16)',
          steps: [
            '$n(Fe2O3)$ = 800 000 g : 160 g/mol = 5000 mol',
            'Poměr $n(Fe) : n(Fe2O3)$ = 2 : 1, tedy $n(Fe)$ = 10 000 mol',
            '$m(Fe)$ = 10 000 mol · 56 g/mol = 560 000 g',
          ],
          answer: '$m(Fe)$ = 560 kg (což sedí s $w(Fe)$ = 70 % z minulé lekce).',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Zkratka pro kilogramy',
          text: 'Když dosadíš hmotnost v kg a molární hmotnost v kg/kmol (stejné číslo jako v g/mol), vyjdou ti kilomoly a výsledek rovnou v kilogramech. Přepočet na gramy si ušetříš.',
        },
        {
          type: 'example',
          title: 'Kolik kyslíku spotřebuje hořák',
          problem: 'Kolik gramů kyslíku spotřebuje dokonalé spálení 8 g methanu? ($A_{r}$: H 1, C 12, O 16)',
          steps: [
            'Rovnice: $CH4 + 2O2 -> CO2 + 2H2O$',
            '$n(CH4)$ = 8 g : 16 g/mol = 0,5 mol',
            '$n(O2)$ = 2 · 0,5 mol = 1,0 mol',
            '$m(O2)$ = 1,0 mol · 32 g/mol = 32 g',
          ],
          answer: '$m(O2)$ = 32 g, tedy čtyřikrát víc než methanu.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik gramů oxidu hořečnatého vznikne spálením 6 g hořčíku podle $2Mg + O2 -> 2MgO$? ($A_{r}$: Mg 24, O 16)',
            answer: 10,
            tolerance: 0.1,
            unit: 'g',
            explain: '$n(Mg)$ = 6 : 24 = 0,25 mol, $n(MgO)$ = 0,25 mol, $m$ = 0,25 · 40 = 10 g.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik gramů vody vznikne spálením 4 g vodíku podle $2H2 + O2 -> 2H2O$? ($A_{r}$: H 1, O 16)',
            answer: 36,
            tolerance: 0.2,
            unit: 'g',
            explain: '$n(H2)$ = 4 : 2 = 2 mol, $n(H2O)$ = 2 mol, $m$ = 2 · 18 = 36 g.',
          },
        },
      ],
    },
    {
      title: 'Výpočty s plyny',
      blocks: [
        {
          type: 'p',
          text: 'Když je produktem plyn, poslední krok nevede na hmotnost, ale na objem. Za normálních podmínek použiješ $V = n · V_{m}$, za jiných podmínek $pV = nRT$.',
        },
        {
          type: 'example',
          title: 'Vodík ze zinku',
          problem: 'Kolik dm^{3} vodíku (normální podmínky) vznikne reakcí 13 g zinku s nadbytkem kyseliny chlorovodíkové? $Zn + 2HCl -> ZnCl2 + H2$ ($A_{r}$(Zn) = 65)',
          steps: [
            '$n(Zn)$ = 13 g : 65 g/mol = 0,20 mol',
            'Poměr 1 : 1, tedy $n(H2)$ = 0,20 mol',
            '$V(H2)$ = 0,20 mol · 22,4 dm^{3}/mol = 4,48 dm^{3}',
          ],
          answer: 'Vznikne 4,48 dm^{3} vodíku.',
        },
        {
          type: 'example',
          title: 'Airbag',
          problem: 'Airbag se nafoukne dusíkem z rozkladu azidu sodného: $2NaN3 -> 2Na + 3N2$. Jaký objem dusíku vznikne z 65 g $NaN3$ při 25 °C a 101,3 kPa? ($A_{r}$: Na 23, N 14)',
          steps: [
            '$M(NaN3)$ = 23 + 3 · 14 = 65 g/mol; $n(NaN3)$ = 1,00 mol',
            'Poměr $n(N2) : n(NaN3)$ = 3 : 2, tedy $n(N2)$ = 1,50 mol',
            '$T$ = 298,15 K; $p$ = 101 300 Pa',
            '$V = nRT / p$ = 1,50 · 8,314 · 298,15 : 101 300 = 0,0367 m^{3}',
          ],
          answer: '$V$ ≈ 36,7 dm^{3}, a to za pouhých 30 milisekund.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Plyn s plynem',
          text: 'Když reagují jen plyny za stejné teploty a tlaku, poměr **objemů** je stejný jako poměr koeficientů (Avogadrův zákon). Na spálení 10 dm^{3} propanu $C3H8 + 5O2 -> 3CO2 + 4H2O$ potřebuješ 50 dm^{3} kyslíku a vznikne 30 dm^{3} $CO2$.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Vodík tvoří se vzduchem výbušnou směs. Při pokusech s ním pracuj bez otevřeného ohně a jen v malých množstvích. Azid sodný je prudce jedovatý, v autě je bezpečně uzavřený.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik dm^{3} $CO2$ (normální podmínky) vznikne rozkladem 25 g vápence podle $CaCO3 -> CaO + CO2$? ($A_{r}$: C 12, O 16, Ca 40)',
            answer: 5.6,
            tolerance: 0.05,
            unit: 'dm³',
            explain: '$n(CaCO3)$ = 25 : 100 = 0,25 mol, $n(CO2)$ = 0,25 mol, $V$ = 0,25 · 22,4 = 5,6 dm^{3}.',
          },
        },
      ],
    },
    {
      title: 'Limitující reaktant',
      blocks: [
        {
          type: 'p',
          text: 'Zpátky k palačinkám. Šest vajec by stačilo na tři dávky, půl litru mléka jen na dvě. Mléko dojde dřív, a proto určuje, kolik upečeš. Dvě vejce zbudou.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'limitující reaktant', def: 'reaktant, který se spotřebuje jako první; určuje, kolik produktu vznikne' },
            { term: 'reaktant v nadbytku', def: 'reaktant, jehož část po reakci zbude nezreagovaná' },
          ],
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Převeď hmotnosti všech reaktantů na moly.',
            'Každé látkové množství vyděl koeficientem dané látky v rovnici.',
            'Reaktant s **nejmenším** podílem je limitující.',
            'Množství produktu počítej jen z limitujícího reaktantu.',
          ],
        },
        {
          type: 'example',
          title: 'Vodík a kyslík',
          problem: 'Necháš zreagovat 4 g vodíku a 40 g kyslíku podle $2H2 + O2 -> 2H2O$. Kolik vody vznikne a co zbude? ($A_{r}$: H 1, O 16)',
          steps: [
            '$n(H2)$ = 4 g : 2 g/mol = 2,0 mol; $n(O2)$ = 40 g : 32 g/mol = 1,25 mol',
            'Podíly: $H2$ 2,0 : 2 = 1,0; $O2$ 1,25 : 1 = 1,25',
            'Menší podíl má vodík, je limitující.',
            '$n(H2O) = n(H2)$ = 2,0 mol; $m(H2O)$ = 2,0 · 18 = 36 g',
            'Spotřeba kyslíku: 1,0 mol; zbude 0,25 mol · 32 g/mol = 8 g $O2$',
          ],
          answer: 'Vznikne 36 g vody a zbude 8 g kyslíku. Kontrola: 4 + 40 = 36 + 8 = 44 g.',
        },
        {
          type: 'example',
          title: 'Železo a síra',
          problem: 'Zahřeješ 14 g železa s 10 g síry: $Fe + S -> FeS$. Kolik $FeS$ vznikne a kolik čeho zbude? ($A_{r}$: S 32, Fe 56)',
          steps: [
            '$n(Fe)$ = 14 : 56 = 0,250 mol; $n(S)$ = 10 : 32 = 0,3125 mol',
            'Koeficienty jsou 1 : 1, takže limituje železo (0,250 < 0,3125).',
            '$m(FeS)$ = 0,250 mol · 88 g/mol = 22 g',
            'Zbude síra: 0,0625 mol · 32 g/mol = 2 g',
          ],
          answer: 'Vznikne 22 g $FeS$ a zbudou 2 g síry.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Porovnávej moly, ne gramy',
          text: 'Že máš víc gramů kyslíku než vodíku, nic neznamená. Rozhoduje látkové množství vydělené koeficientem.',
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Spaluješ 4,8 g hořčíku ve 4,8 g kyslíku podle $2Mg + O2 -> 2MgO$. Co je limitující reaktant? ($A_{r}$: Mg 24, O 16)',
            options: ['hořčík', 'kyslík', 'oba zreagují beze zbytku', 'nedá se určit'],
            answer: 0,
            explain: '$n(Mg)$ = 0,20 mol, podíl 0,20 : 2 = 0,10; $n(O2)$ = 0,15 mol, podíl 0,15. Menší podíl má hořčík.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik gramů $MgO$ vznikne v předchozí úloze (4,8 g Mg a 4,8 g $O2$)?',
            answer: 8,
            tolerance: 0.1,
            unit: 'g',
            explain: 'Počítáš z hořčíku: $n(MgO) = n(Mg)$ = 0,20 mol, $m$ = 0,20 · 40 = 8,0 g.',
          },
        },
      ],
    },
    {
      title: 'Výtěžek reakce',
      blocks: [
        {
          type: 'p',
          text: 'Výpočet z rovnice dává **teoretické** množství produktu. Ve skutečnosti ho získáš méně: část látky zůstane na filtru, část zreaguje jinak (vedlejší reakce), vratné reakce neproběhnou úplně.',
        },
        {
          type: 'formula',
          text: '$η = m_{skut} / m_{teor} · 100 %$',
          caption: 'výtěžek $η$ (čti „éta“): skutečně získaná hmotnost produktu děleno teoretickou hmotností',
        },
        {
          type: 'example',
          title: 'Výtěžek z vápenky',
          problem: 'Z 250 g vápence jsi teoreticky mohl získat 140 g $CaO$. Skutečně jsi získal 126 g. Jaký je výtěžek?',
          steps: [
            '$η$ = 126 g : 140 g · 100 %',
            '$η$ = 0,90 · 100 %',
          ],
          answer: '$η$ = 90 %',
        },
        {
          type: 'example',
          title: 'Kolik navážit, když víš, že něco ztratíš',
          problem: 'Potřebuješ získat 28 g $CaO$. Výtěžek rozkladu je 80 %. Kolik gramů $CaCO3$ musíš vypálit? ($A_{r}$: C 12, O 16, Ca 40)',
          steps: [
            'Teoreticky musí vzniknout: 28 g : 0,80 = 35 g $CaO$',
            '$n(CaO)$ = 35 g : 56 g/mol = 0,625 mol',
            '$n(CaCO3)$ = 0,625 mol (poměr 1 : 1)',
            '$m(CaCO3)$ = 0,625 mol · 100 g/mol = 62,5 g',
          ],
          answer: 'Musíš vypálit 62,5 g vápence.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Výtěžkem vždy **děl** teoretickou hodnotu, když hledáš potřebné množství suroviny. Kdybys násobil 0,80, vyšlo by ti méně suroviny, a tedy i méně produktu, než potřebuješ.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Při průmyslové výrobě amoniaku zreaguje v jednom průchodu reaktorem jen asi 15 % dusíku a vodíku. Nezreagované plyny se proto vracejí zpět, takže celkový výtěžek je nakonec přes 95 %.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Z 800 kg $Fe2O3$ lze teoreticky vyrobit 560 kg železa. Vysoká pec jich dala 504 kg. Jaký je výtěžek?',
            answer: 90,
            tolerance: 0.5,
            unit: '%',
            explain: '$η$ = 504 : 560 · 100 % = 90 %.',
          },
        },
      ],
    },
    {
      title: 'Úlohy o více krocích',
      blocks: [
        {
          type: 'p',
          text: 'Na písemce i u maturity se kroky kombinují: reaktant je zadaný jako roztok, produktem je plyn a k tomu výtěžek. Nelekej se. Každá úloha se rozpadne na kroky, které už umíš.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Zapiš a vyčísli rovnici.',
            'Všechno, co znáš, převeď na moly ($m/M$, $c·V$, $V/V_{m}$).',
            'Jsou-li zadané dva reaktanty, najdi limitující.',
            'Podle poměru koeficientů spočítej moly hledané látky.',
            'Moly převeď na to, na co se ptají (hmotnost, objem, koncentraci).',
            'Započítej výtěžek a zkontroluj, jestli je výsledek rozumný.',
          ],
        },
        {
          type: 'example',
          title: 'Hořčík v kyselině',
          problem: 'Kolik cm^{3} kyseliny chlorovodíkové o $c$ = 2,0 mol/dm^{3} je potřeba k rozpuštění 6,0 g hořčíku? A kolik dm^{3} vodíku (normální podmínky) přitom vznikne? $Mg + 2HCl -> MgCl2 + H2$ ($A_{r}$(Mg) = 24)',
          steps: [
            '$n(Mg)$ = 6,0 g : 24 g/mol = 0,25 mol',
            '$n(HCl)$ = 2 · 0,25 mol = 0,50 mol',
            '$V = n / c$ = 0,50 mol : 2,0 mol/dm^{3} = 0,25 dm^{3} = 250 cm^{3}',
            '$n(H2) = n(Mg)$ = 0,25 mol; $V(H2)$ = 0,25 · 22,4 dm^{3}/mol = 5,6 dm^{3}',
          ],
          answer: 'Potřebuješ 250 cm^{3} kyseliny a vznikne 5,6 dm^{3} vodíku.',
        },
        {
          type: 'example',
          title: 'Kolik sraženiny',
          problem: 'K 50 cm^{3} roztoku $AgNO3$ o $c$ = 0,20 mol/dm^{3} přidáš nadbytek roztoku $NaCl$. Kolik gramů $AgCl$ se vysráží? $AgNO3 + NaCl -> AgCl + NaNO3$ ($A_{r}$: Ag 108, Cl 35,5)',
          steps: [
            '$n(AgNO3) = c · V$ = 0,20 mol/dm^{3} · 0,050 dm^{3} = 0,010 mol',
            'Poměr 1 : 1, tedy $n(AgCl)$ = 0,010 mol',
            '$M(AgCl)$ = 108 + 35,5 = 143,5 g/mol',
            '$m(AgCl)$ = 0,010 mol · 143,5 g/mol = 1,435 g',
          ],
          answer: 'Vysráží se asi 1,44 g $AgCl$.',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Můj tajný trik: než začnu dosazovat, odhadnu výsledek. Když mi pak z 6 g hořčíku vyjdou 3 kila vodíku, vím, že jsem se někde spletl. Zdravý rozum je nejlepší kalkulačka.',
        },
        {
          type: 'game',
          gameId: 'balance',
          text: 'Každý výpočet začíná vyčíslenou rovnicí. Zahraj si Vyčísli rovnici a měj ruku jistou.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Vodní kámen $CaCO3$ rozpouštíš kyselinou: $CaCO3 + 2HCl -> CaCl2 + H2O + CO2$. Kolik gramů $CaCO3$ rozpustí 100 cm^{3} kyseliny o $c$ = 1,0 mol/dm^{3}? ($A_{r}$: C 12, O 16, Ca 40)',
            answer: 5,
            tolerance: 0.05,
            unit: 'g',
            explain: '$n(HCl)$ = 1,0 · 0,100 = 0,10 mol; $n(CaCO3)$ = 0,10 : 2 = 0,05 mol; $m$ = 0,05 · 100 = 5,0 g.',
          },
        },
      ],
    },
  ],
  summary: [
    'Koeficienty ve vyčíslené rovnici udávají poměr látkových množství, ne hmotností.',
    'Základní postup je $m(A) -> n(A) -> n(B) -> m(B)$; u plynů končíš objemem přes $V_{m}$ nebo $pV = nRT$.',
    'U plynných reakcí za stejné teploty a tlaku odpovídá poměr objemů poměru koeficientů.',
    'Limitující reaktant má nejmenší podíl $n$ / koeficient; z něj počítáš množství produktu.',
    'Výtěžek $η$ je podíl skutečného a teoretického množství produktu v procentech.',
    'Složitou úlohu rozlož na kroky: rovnice, převod na moly, poměr, převod na hledanou veličinu, výtěžek, kontrola.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Koeficienty ve vyčíslené rovnici udávají poměr hmotností reagujících látek.',
      answer: false,
      explain: 'Koeficienty udávají poměr látkových množství (molů). Hmotnosti získáš až vynásobením molárními hmotnostmi.',
    },
    {
      kind: 'number',
      q: 'Kolik molů kyslíku potřebuješ na spálení 3 mol propanu podle $C3H8 + 5O2 -> 3CO2 + 4H2O$?',
      answer: 15,
      tolerance: 0,
      unit: 'mol',
      explain: 'Poměr $n(O2) : n(C3H8)$ = 5 : 1, tedy 3 · 5 = 15 mol.',
    },
    {
      kind: 'number',
      q: 'Kolik gramů $CO2$ vznikne spálením 16 g methanu podle $CH4 + 2O2 -> CO2 + 2H2O$? ($A_{r}$: H 1, C 12, O 16)',
      answer: 44,
      tolerance: 0.3,
      unit: 'g',
      explain: '$n(CH4)$ = 16 : 16 = 1 mol, $n(CO2)$ = 1 mol, $m$ = 1 · 44 = 44 g.',
    },
    {
      kind: 'number',
      q: 'Kolik dm^{3} kyslíku (normální podmínky) vznikne rozkladem 68 g peroxidu vodíku podle $2H2O2 -> 2H2O + O2$? ($A_{r}$: H 1, O 16)',
      answer: 22.4,
      tolerance: 0.2,
      unit: 'dm³',
      explain: '$n(H2O2)$ = 68 : 34 = 2 mol, $n(O2)$ = 1 mol, $V$ = 1 · 22,4 = 22,4 dm^{3}.',
    },
    {
      kind: 'choice',
      q: 'Smícháš 5,4 g hliníku a 7,1 g chloru, reagují podle $2Al + 3Cl2 -> 2AlCl3$. Který reaktant je limitující? ($A_{r}$: Al 27, Cl 35,5)',
      options: ['chlor', 'hliník', 'oba zreagují beze zbytku', 'ten, kterého je víc gramů'],
      answer: 0,
      explain: '$n(Al)$ = 0,20 mol, podíl 0,20 : 2 = 0,10; $n(Cl2)$ = 0,10 mol, podíl 0,10 : 3 = 0,033. Chlor má menší podíl.',
    },
    {
      kind: 'number',
      q: 'Rozkladem 10 g $CaCO3$ jsi získal 4,48 g $CaO$. Jaký byl výtěžek? ($A_{r}$: C 12, O 16, Ca 40)',
      answer: 80,
      tolerance: 0.5,
      unit: '%',
      explain: 'Teoreticky: 0,10 mol $CaCO3$ → 0,10 mol $CaO$ = 5,6 g. $η$ = 4,48 : 5,6 · 100 % = 80 %.',
    },
    {
      kind: 'order',
      q: 'Seřaď kroky výpočtu hmotnosti produktu z hmotnosti reaktantu.',
      items: [
        'zapsat a vyčíslit rovnici',
        'převést hmotnost reaktantu na látkové množství',
        'podle koeficientů spočítat látkové množství produktu',
        'převést látkové množství produktu na hmotnost',
      ],
      explain: 'Bez vyčíslené rovnice neznáš poměr. Pak vždy m → n → n → m.',
    },
    {
      kind: 'multi',
      q: 'Co platí o limitujícím reaktantu?',
      options: [
        'spotřebuje se jako první',
        'určuje, kolik produktu vznikne',
        'je to vždy reaktant s nejmenší hmotností',
        'po reakci ho zbude nejvíc',
        'poznáš ho podle nejmenšího podílu látkového množství a koeficientu',
      ],
      answers: [0, 1, 4],
      explain: 'Rozhoduje podíl $n$ / koeficient, ne hmotnost. Zbývá naopak reaktant v nadbytku.',
    },
  ],
}

const boss: Question[] = [
  {
    kind: 'number',
    q: 'Acetylen ze svářecí láhve hoří podle $C2H2 + O2 -> CO2 + H2O$. Vyčísli rovnici nejmenšími celými čísly a napiš součet všech koeficientů.',
    answer: 13,
    tolerance: 0,
    explain: '$2C2H2 + 5O2 -> 4CO2 + 2H2O$: přes mezikrok $5/2 O2$ a vynásobení dvěma. Součet 2 + 5 + 4 + 2 = 13.',
  },
  {
    kind: 'choice',
    q: 'Jak nejlépe zařadíš reakci $Mg + 2HCl -> MgCl2 + H2$?',
    options: [
      'substituce a zároveň redoxní reakce',
      'podvojná záměna, není redoxní',
      'syntéza a zároveň redoxní reakce',
      'substituce, není redoxní',
    ],
    answer: 0,
    explain: 'Hořčík nahradí vodík ve sloučenině s chlorem (substituce). Oxidační číslo hořčíku roste z 0 na II a vodíku klesá z I na 0, jde tedy i o redoxní reakci.',
  },
  {
    kind: 'choice',
    q: 'Ve kterém vzorku je nejvíce atomů? ($A_{r}$: H 1, C 12, N 14, O 16)',
    options: ['17 g $NH3$', '2 g $H2$', '18 g $H2O$', '44 g $CO2$'],
    answer: 0,
    explain: 'Všechny vzorky odpovídají 1 mol molekul. Molekula $NH3$ má 4 atomy, $H2O$ a $CO2$ po 3, $H2$ jen 2. Nejvíc atomů je tedy v amoniaku.',
  },
  {
    kind: 'number',
    q: 'Lékařská kyslíková láhev má objem 10 dm^{3} a obsahuje čistý kyslík pod tlakem 15 MPa při 300 K. Kolik kilogramů kyslíku obsahuje? ($R$ = 8,314 J·K^{−1}·mol^{−1}, $A_{r}$(O) = 16)',
    answer: 1.92,
    tolerance: 0.03,
    unit: 'kg',
    explain: '$n = pV / RT$ = 15 000 000 Pa · 0,010 m^{3} : (8,314 · 300) = 60,1 mol; $m$ = 60,1 · 32 g/mol = 1924 g ≈ 1,92 kg.',
  },
  {
    kind: 'text',
    q: 'Uhlovodík obsahuje 85,7 % uhlíku a 14,3 % vodíku, jeho molární hmotnost je 56 g/mol. Napiš jeho molekulový vzorec. ($A_{r}$: H 1, C 12)',
    accept: ['C4H8'],
    caseSensitive: true,
    placeholder: 'vzorec',
    explain: '$n(C)$ = 85,7 : 12 = 7,14; $n(H)$ = 14,3 : 1 = 14,3; poměr 1 : 2, empirický vzorec $CH2$ (14 g/mol). 56 : 14 = 4, tedy $C4H8$.',
  },
  {
    kind: 'number',
    q: 'Roztok $NaCl$ má $w$ = 10 % a hustotu 1,07 g/cm^{3}. Jaká je jeho molární koncentrace? ($A_{r}$: Na 23, Cl 35,5)',
    answer: 1.83,
    tolerance: 0.03,
    unit: 'mol/dm³',
    explain: '1 dm^{3} váží 1070 g, z toho 107 g $NaCl$ = 107 : 58,5 = 1,83 mol. $c$ = 1,83 mol/dm^{3}.',
  },
  {
    kind: 'number',
    q: 'Kolik dm^{3} $CO2$ (normální podmínky) vznikne, když 200 cm^{3} kyseliny chlorovodíkové o $c$ = 0,50 mol/dm^{3} zreaguje s nadbytkem vápence? $CaCO3 + 2HCl -> CaCl2 + H2O + CO2$',
    answer: 1.12,
    tolerance: 0.02,
    unit: 'dm³',
    explain: '$n(HCl)$ = 0,50 · 0,200 = 0,10 mol; $n(CO2)$ = 0,10 : 2 = 0,050 mol; $V$ = 0,050 · 22,4 = 1,12 dm^{3}.',
  },
  {
    kind: 'number',
    q: 'Necháš zreagovat 10 g vodíku a 64 g kyslíku podle $2H2 + O2 -> 2H2O$. Kolik gramů vody vznikne? ($A_{r}$: H 1, O 16)',
    answer: 72,
    tolerance: 0.5,
    unit: 'g',
    explain: '$n(H2)$ = 5 mol (podíl 2,5), $n(O2)$ = 2 mol (podíl 2). Limituje kyslík: vznikne 4 mol vody = 72 g a 2 g vodíku zbudou.',
  },
  {
    kind: 'number',
    q: 'Aluminotermie (svařování kolejnic): $2Al + Fe2O3 -> Al2O3 + 2Fe$. Z 54 g hliníku a nadbytku $Fe2O3$ jsi získal 100,8 g železa. Jaký byl výtěžek? ($A_{r}$: O 16, Al 27, Fe 56)',
    answer: 90,
    tolerance: 0.5,
    unit: '%',
    explain: '$n(Al)$ = 2 mol, teoreticky $n(Fe)$ = 2 mol = 112 g. $η$ = 100,8 : 112 · 100 % = 90 %.',
  },
  {
    kind: 'multi',
    q: 'Které výroky jsou pravdivé?',
    options: [
      '1 mol $H2O$ a 1 mol $CO2$ obsahují stejný počet molekul',
      '1 mol $H2O$ a 1 mol $CO2$ mají stejnou hmotnost',
      '1 mol vody zaujímá za normálních podmínek 22,4 dm^{3}',
      '1 mol $O2$ obsahuje 2 mol atomů kyslíku',
      '1 mol $CO2$ zaujímá za normálních podmínek asi 22,4 dm^{3}',
    ],
    answers: [0, 3, 4],
    explain: 'Mol je vždy stejný počet částic, ale hmotnosti se liší (18 g × 44 g). Molární objem 22,4 dm^{3}/mol platí jen pro plyny, voda je za 0 °C kapalina či led.',
  },
  {
    kind: 'order',
    q: 'Seřaď kroky úlohy: „Kolik gramů produktu získáš z roztoku reaktantu o známé koncentraci a objemu, je-li výtěžek 85 %?“',
    items: [
      'zapsat a vyčíslit rovnici',
      'spočítat látkové množství reaktantu jako $c · V$',
      'podle koeficientů spočítat teoretické látkové množství produktu',
      'převést na teoretickou hmotnost produktu přes $M$',
      'vynásobit teoretickou hmotnost výtěžkem 0,85',
    ],
    explain: 'Rovnice → moly reaktantu → moly produktu → hmotnost → výtěžek. Tady hledáš skutečný produkt, proto výtěžkem násobíš.',
  },
  {
    kind: 'tf',
    q: 'Když 50 cm^{3} roztoku o koncentraci 6,0 mol/dm^{3} zředíš na 1,5 mol/dm^{3}, musíš přidat 150 cm^{3} vody.',
    answer: true,
    explain: '$V2$ = 6,0 · 50 : 1,5 = 200 cm^{3}; přidáš 200 − 50 = 150 cm^{3} vody.',
  },
]

const level: LevelContent = {
  lessons: {
    'l4-1': l4_1,
    'l4-2': l4_2,
    'l4-3': l4_3,
    'l4-4': l4_4,
    'l4-5': l4_5,
    'l4-6': l4_6,
  },
  boss,
}

export default level
