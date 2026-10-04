import type { Lesson, LevelContent, Question } from '../../../core/types'

/** Joins lines of a monospace drawing (keeps backslashes and spacing explicit). */
const art = (...lines: string[]) => lines.join('\n')

// ─────────────────────────────────────────────────────────────
// l3-1 Proč se atomy spojují: elektronegativita
// ─────────────────────────────────────────────────────────────
const l31: Lesson = {
  id: 'l3-1',
  title: 'Proč se atomy spojují: elektronegativita',
  goals: [
    'Z křivky energie a vzdálenosti vysvětlit, proč vznik vazby snižuje energii a co je délka vazby',
    'Popsat, jak délka a energie vazby závisí na velikosti atomů a na násobnosti vazby',
    'Určit, jak se mění elektronegativita v periodické tabulce',
    'Z rozdílu elektronegativit ΔX odhadnout, zda je vazba nepolární, polární, nebo iontová',
  ],
  hook: 'Helium se celý život nudí samo, ale kyslík nevydrží bez partnera ani vteřinu. Proč se vlastně atomy spojují? A proč je sůl tvrdý krystal, zatímco voda teče?',
  sections: [
    {
      title: 'Vazba znamená nižší energii',
      icon: 'heat',
      blocks: [
        {
          type: 'p',
          text: 'Helium z úvodu se nudí samo, protože už má všechno, co potřebuje: z úrovně 2 víš, že vzácné plyny mají stálý **oktet** (helium dvojici). Ostatní atomy se k podobnému stavu dopracují přes **chemickou vazbu**, tedy soudržné působení, které drží atomy pohromadě. Mají k tomu tři cesty:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'bond', title: 'Sdílejí', text: 'dva atomy mají společný elektronový pár, jako v $H2$' },
            { icon: 'ion-plus', title: 'Předávají', text: 'atom kovu odevzdá elektrony a stane se kationtem' },
            { icon: 'ion-minus', title: 'Přijímají', text: 'atom nekovu elektrony přijme a stane se aniontem' },
          ],
        },
        {
          type: 'p',
          text: 'Ať atomy elektrony sdílejí, nebo předávají, vždy z toho mají stejný zisk. ==Když vznikne vazba, energie soustavy klesne a přebytek se uvolní, často jako teplo nebo světlo.== Je to jako kulička, která se skutálí do důlku a sama už nevyleze. Proč energie klesá, uvidíš nejlépe na nejjednodušší molekule, vodíku $H2$:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'atom', title: 'Daleko od sebe', text: 'dva atomy vodíku se ještě neovlivňují' },
            { icon: 'magnet', title: 'Přibližují se', text: 'elektron každého atomu přitahuje i jádro souseda, energie klesá' },
            { icon: 'bond', title: 'Energetické minimum', text: 'nejvýhodnější vzdálenost: vznikla vazba s určitou délkou' },
            { icon: 'ion-plus', title: 'Příliš blízko', text: 'kladná jádra se začnou odpuzovat a energie prudce roste' },
          ],
          caption: 'Co se děje, když se k sobě blíží dva atomy vodíku.',
        },
        { type: 'p', text: 'Stejný příběh se dá nakreslit jako graf: vodorovně je vzdálenost jader r, svisle energie E. Sleduj křivku zprava doleva a hledej její nejnižší bod.' },
        {
          type: 'structure',
          art: art(
            'E ↑',
            '  │\\   odpuzování jader',
            '  │ \\',
            '0 ┼──\\────────────────────────→ r',
            '  │   \\               ______',
            '  │    \\          ___/  přitahování',
            '  │     \\_      _/',
            '  │       \\____/',
            '  │          ↑ 74 pm; −436 kJ/mol',
          ),
          caption: 'Křivka energie a vzdálenosti pro dva atomy vodíku. Vpravo jsou atomy daleko od sebe (E = 0). Při přibližování převládá přitahování a energie klesá. Vlevo převládne odpuzování jader a energie prudce roste. Minimum leží ve vzdálenosti rovné délce vazby (74 pm) a jeho hloubka je vazebná energie (436 kJ/mol).',
        },
        { type: 'p', text: 'Ten nejnižší bod je pro vazbu klíčový: z jeho polohy a hloubky vyčteš dvě čísla, která popisují každou vazbu.' },
        {
          type: 'keyterms',
          items: [
            { term: 'chemická vazba', def: 'soudržné působení mezi atomy, které vzniká díky valenčním elektronům' },
            { term: 'vazebná energie', def: 'energie, která se uvolní při vzniku vazby; stejně velkou energii musíme dodat, abychom vazbu rozštěpili' },
            { term: 'délka vazby', def: 'vzdálenost jader dvou vázaných atomů' },
          ],
        },
        { type: 'p', text: 'Proč nás vazebná energie zajímá i mimo graf? Když se při reakci rozpadnou slabší vazby a vzniknou pevnější, rozdíl energie se uvolní. Nejznámější příklad je hoření vodíku:' },
        {
          type: 'reaction',
          equation: '2H2 + O2 -> 2H2O',
          caption: 'Vodík hoří s kyslíkem na vodu. Nové vazby v molekulách vody mají nižší energii než vazby v $H2$ a $O2$.',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Energie z nových vazeb',
          text: 'Právě tahle reakce běží v palivovém článku vodíkového auta: rozdíl energií vazeb pohání elektromotor. Stejná reakce vynášela do vesmíru raketoplány.',
        },
        { type: 'p', text: 'Vazba je tedy energetický důlek. Jak je hluboký a v jaké vzdálenosti leží, se ale vazba od vazby liší – a právě na to se podíváme teď.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Aby mezi dvěma atomy vznikla vazba, musíme jim energii dodat.',
            answer: false,
            explain: 'Je to naopak: při vzniku vazby se energie uvolňuje. Dodat ji musíme, když chceme vazbu rozštěpit.',
          },
        },
      ],
    },
    {
      title: 'Vazebná energie a délka vazby',
      icon: 'bond',
      blocks: [
        {
          type: 'p',
          text: 'Obě čísla z minulého oddílu, polohu a hloubku důlku, už známe jménem. Každá vazba má svou **délku** v pikometrech (1 pm = 10^{−12} m) a **vazebnou energii** v kJ/mol, tedy na obrovskou „porci“ vazeb (mol poznáš v úrovni 4). Větší energie znamená pevnější vazbu. Nejdřív porovnej vazby mezi stejnými atomy, které se liší jen násobností vazby (jednoduchá –, dvojná =, trojná ≡):',
        },
        {
          type: 'table',
          headers: ['Vazba', 'Délka (pm)', 'Vazebná energie (kJ/mol)'],
          rows: [
            ['$C–C$', '154', '348'],
            ['$C=C$', '134', '614'],
            ['$C≡C$', '120', '839'],
            ['$N–N$', '145', '163'],
            ['$N=N$', '125', '418'],
            ['$N≡N$', '110', '945'],
          ],
          caption: 'Násobnost vazby: mezi stejnými atomy je jednoduchá vazba nejdelší a nejslabší, trojná nejkratší a nejpevnější.',
        },
        { type: 'p', text: 'Rozdíly v délce uvidíš i na 3D modelech. Vodík má nejmenší atomy, chlor mnohem větší a dusík drží pohromadě trojná vazba:' },
        {
          type: 'molecule',
          molecules: ['H2', 'Cl2', 'N2'],
          labels: ['$H–H$: 74 pm, 436 kJ/mol', '$Cl–Cl$: 199 pm, 242 kJ/mol', '$N≡N$: 110 pm, 945 kJ/mol'],
          caption: 'Porovnej, jak daleko jsou od sebe jádra v molekulách vodíku, chloru a dusíku.',
        },
        { type: 'p', text: 'U chloru je vidět, že kromě násobnosti hraje roli i velikost atomů. Ověříme to na řadě, kde se mění jen jeden partner: vodík vázaný na fluor, chlor, brom a jod.' },
        {
          type: 'table',
          headers: ['Vazba', 'Délka (pm)', 'Vazebná energie (kJ/mol)'],
          rows: [
            ['$H–F$', '92', '568'],
            ['$H–Cl$', '127', '431'],
            ['$H–Br$', '141', '366'],
            ['$H–I$', '161', '298'],
          ],
          caption: 'Velikost atomu: ve skupině halogenů směrem dolů atomy rostou, vazba $H–X$ se prodlužuje a slábne.',
        },
        { type: 'p', text: 'Z obou tabulek plynou tři pravidla, která platí pro všechny vazby:' },
        {
          type: 'list',
          items: [
            '**Větší atomy, delší vazba:** sdílený pár je dál od jader a drží je slaběji.',
            '**Kratší bývá pevnější:** sdílené elektrony jsou blíž oběma jádrům.',
            '==**Délka vazby klesá s násobností: jednoduchá > dvojná > trojná.**== Co je dvojná a trojná vazba, uvidíš hned v další lekci.',
          ],
        },
        { type: 'p', text: 'Podle první tabulky to vypadá, že každá další vazba přidá stejný díl pevnosti. Platí to opravdu? Spočítejme to.' },
        {
          type: 'example',
          title: 'Je dvojná vazba dvakrát pevnější?',
          problem: 'Porovnej energii vazby $C=C$ s dvojnásobkem energie vazby $C–C$.',
          steps: [
            'Dvojnásobek jednoduché vazby: 2 · 348 kJ/mol = 696 kJ/mol.',
            'Skutečná dvojná vazba $C=C$: 614 kJ/mol.',
            '614 < 696, druhá vazba tedy přidá jen 614 − 348 = 266 kJ/mol, méně než první.',
          ],
          answer: 'Ne. Dvojná vazba je pevnější než jednoduchá, ale ne dvakrát, protože druhá vazba je slabší než první (proč, vysvětlí vazby σ a π v další lekci).',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Líný dusík',
          text: 'Vzduch je ze 78 % tvořen dusíkem, a přesto ho rostliny neumějí přímo využít. Trojná vazba v molekule $N2$ patří k nejpevnějším vůbec. Rozštípnout ji dokážou jen některé bakterie (třeba hlízkové bakterie v kořenech bobovitých rostlin), blesky a chemický průmysl při výrobě hnojiv.',
        },
        { type: 'p', text: 'Délka a pevnost vazby tedy závisí na velikosti atomů a na násobnosti vazby. Zatím jsme ale mlčky počítali s tím, že se oba atomy o elektrony dělí rovným dílem – a to platí jen u stejných atomů.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která z těchto vazeb je nejkratší?',
            options: ['$C–C$', '$C=C$', '$C≡C$', '$Cl–Cl$'],
            answer: 2,
            explain: 'Trojná vazba $C≡C$ (120 pm) je nejkratší: tři sdílené elektronové páry přitáhnou atomy uhlíku k sobě nejvíc.',
          },
        },
      ],
    },
    {
      title: 'Elektronegativita',
      icon: 'magnet',
      blocks: [
        {
          type: 'p',
          text: 'V $H2$ nebo $Cl2$ tahají oba atomy za sdílený pár stejně silně. Dva různé atomy se ale o sdílené elektrony nedělí vždy spravedlivě. Schopnost atomu ve vazbě přitahovat vazebné elektrony se nazývá **elektronegativita** (anglicky *electronegativity*), značka X. Kde v tabulce leží silní a kde slabí „přitahovači“, ukazuje mapa:',
        },
        {
          type: 'diagram',
          id: 'periodic-mini',
          props: { highlight: 'trends' },
          caption: 'Elektronegativita roste v periodě zleva doprava a ve skupině zdola nahoru. Tmavší políčko znamená vyšší elektronegativitu.',
        },
        {
          type: 'p',
          text: 'Používá se **Paulingova stupnice** podle chemika Linuse Paulinga; hodnoty nemají jednotku. Nejvyšší má fluor (3,98), nejnižší cesium a francium (kolem 0,8). Proč roste právě tímto směrem, vyplývá ze stavby atomu, kterou znáš z úrovně 2:',
        },
        {
          type: 'list',
          items: [
            'V periodě zleva doprava **roste**, protože jádro má víc protonů a valenční elektrony přitahuje silněji.',
            'Ve skupině shora dolů **klesá**, protože valenční elektrony jsou dál od jádra a vnitřní vrstvy je stíní.',
            'Kovy mají elektronegativitu nízkou (většinou méně než 2), nekovy vysokou.',
            'Vzácné plyny vazby téměř netvoří, proto se jim hodnota obvykle neuvádí.',
          ],
        },
        { type: 'p', text: 'Pravidla ti řeknou, který prvek přitahuje víc. Pro výpočty ale potřebuješ konkrétní čísla – nemusíš je umět nazpaměť, stačí je umět najít:' },
        {
          type: 'table',
          headers: ['Prvek', 'X', 'Prvek', 'X', 'Prvek', 'X'],
          rows: [
            ['H', '2,20', 'Na', '0,93', 'Mg', '1,31'],
            ['C', '2,55', 'K', '0,82', 'Al', '1,61'],
            ['N', '3,04', 'S', '2,58', 'Br', '2,96'],
            ['O', '3,44', 'Cl', '3,16', 'I', '2,66'],
            ['F', '3,98', 'Ca', '1,00', 'Fe', '1,83'],
          ],
          caption: 'Hodnoty elektronegativity podle Paulinga, které se ti v této úrovni budou hodit.',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Nejelektronegativnější kout tabulky je vpravo nahoře. Čím blíž má prvek k fluoru, tím silněji si elektrony ve vazbě přitahuje.',
        },
        { type: 'p', text: 'Teď umíš u každého atomu zjistit, jak silně si ve vazbě přitahuje elektrony. Co se ale stane, když se potkají dva atomy s hodně odlišnou elektronegativitou?' },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď prvky od nejnižší po nejvyšší elektronegativitu.',
            items: ['Na', 'H', 'C', 'O', 'F'],
            explain: 'Na 0,93 < H 2,20 < C 2,55 < O 3,44 < F 3,98. Kov sodík je na začátku, fluor vpravo nahoře na konci.',
          },
        },
      ],
    },
    {
      title: 'Rozdíl elektronegativit prozradí typ vazby',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Elektronegativita jednoho atomu sama o vazbě nic neřekne; rozhoduje, jak moc se oba partneři liší. Typ vazby proto odhadneš z **rozdílu elektronegativit** ΔX. Od větší hodnoty odečítáš menší, takže ΔX nikdy není záporné.',
        },
        { type: 'formula', text: 'ΔX = X_{větší} − X_{menší}', caption: 'rozdíl elektronegativit vázaných atomů' },
        { type: 'p', text: 'Čím větší ΔX, tím víc se sdílený pár posouvá k jednomu z atomů. Na stupnici je vidět, kde podle toho leží hranice mezi typy vazeb:' },
        {
          type: 'diagram',
          id: 'bond-type-scale',
          caption: 'Stupnice ΔX: pod 0,4 nepolární vazba, od 0,4 do 1,7 polární, od 1,7 iontová. Hranice jsou jen orientační. Oblaky ukazují, jak se elektrony posouvají k elektronegativnějšímu atomu, až vzniknou ionty.',
        },
        { type: 'p', text: 'Každému úseku stupnice odpovídá jeden typ vazby. Tady jsou vedle sebe i s příklady látek, které znáš:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Nepolární kovalentní',
              icon: 'bond',
              tone: 'a',
              points: ['elektrony sdílené zhruba rovnoměrně', '$H2$, $Cl2$, vazba $C–H$'],
            },
            {
              title: 'Polární kovalentní',
              icon: 'magnet',
              tone: 'b',
              points: ['elektrony posunuté k elektronegativnějšímu atomu', '$HCl$, $H2O$, vazba $N–H$'],
            },
            {
              title: 'Iontová',
              icon: 'ion-plus',
              tone: 'c',
              points: ['elektrony prakticky předané, vznikají ionty', '$NaCl$, $KBr$, $MgO$'],
            },
          ],
        },
        {
          type: 'p',
          text: 'U polární vazby nese elektronegativnější atom **částečný záporný náboj** δ− a druhý **částečný kladný náboj** δ+. Nejsou to celé náboje jako u iontů, jen posun elektronů. Vazbě se dvěma „póly“ říkáme **dipól**. Takhle vypadá u chlorovodíku:',
        },
        {
          type: 'molecule',
          molecules: ['HCl'],
          labels: ['$H^{δ+}–Cl^{δ−}$'],
          caption: 'Polární vazba v chlorovodíku: elektronegativnější chlor si přitahuje sdílený pár k sobě.',
        },
        { type: 'p', text: 'Že je vazba v $HCl$ polární, se dá i spočítat. Postup je vždy stejný: najdi obě hodnoty X, odečti menší od větší a výsledek porovnej s hranicemi 0,4 a 1,7.' },
        {
          type: 'example',
          title: 'Jakou vazbu má chlorovodík?',
          problem: 'Urči typ vazby v molekule $HCl$.',
          steps: ['X(Cl) = 3,16 a X(H) = 2,20', 'ΔX = 3,16 − 2,20 = 0,96', '0,4 ≤ 0,96 < 1,7, vazba je tedy polární kovalentní', 'Elektronegativnější chlor nese δ−, vodík δ+.'],
          answer: 'polární kovalentní vazba, $H^{δ+}–Cl^{δ−}$',
        },
        { type: 'p', text: 'Stejný postup u kovu a nekovu dá úplně jiný výsledek. Zkus sodík a chlor v kuchyňské soli:' },
        {
          type: 'example',
          title: 'A kuchyňská sůl?',
          problem: 'Urči typ vazby mezi sodíkem a chlorem v $NaCl$.',
          steps: ['X(Cl) = 3,16 a X(Na) = 0,93', 'ΔX = 3,16 − 0,93 = 2,23', '2,23 ≥ 1,7, vazba je tedy iontová: sodík elektron předá chloru.'],
          answer: 'iontová vazba mezi ionty $Na^+$ a $Cl^-$',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Hranice nejsou ostré',
          text: 'Mezi typy vazeb je plynulý přechod. Fluorovodík $HF$ má ΔX = 1,78, a přesto tvoří molekuly s polární kovalentní vazbou. Užitečné pravidlo navíc: kov + nekov většinou dá iontovou vazbu, nekov + nekov kovalentní.',
        },
        { type: 'p', text: 'Z ΔX tedy odhadneš, jestli atomy elektrony sdílejí, nebo předávají. V další lekci se podíváme zblízka na sdílení: kolik párů mohou atomy sdílet a jak to zapsat Lewisovým vzorcem.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Spočítej ΔX pro vazbu $O–H$. (X(O) = 3,44; X(H) = 2,20)',
            answer: 1.24,
            tolerance: 0.01,
            explain: 'ΔX = 3,44 − 2,20 = 1,24. To je mezi 0,4 a 1,7, vazba $O–H$ je tedy polární kovalentní.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaká vazba je v chloridu draselném $KCl$? (X(K) = 0,82; X(Cl) = 3,16)',
            options: ['nepolární kovalentní', 'polární kovalentní', 'iontová', 'kovová'],
            answer: 2,
            explain: 'ΔX = 3,16 − 0,82 = 2,34, což je víc než 1,7. Draslík předá elektron chloru a vzniknou ionty $K^+$ a $Cl^-$.',
          },
        },
      ],
    },
  ],
  summary: [
    'Při vzniku chemické vazby energie soustavy klesá a uvolňuje se; k rozštěpení vazby ji musíme dodat.',
    'Délka vazby je vzdálenost jader v minimu křivky energie; roste s velikostí atomů ($H–F$ < $H–Cl$ < $H–Br$ < $H–I$) a klesá s násobností (jednoduchá > dvojná > trojná).',
    'Kratší vazby bývají pevnější; dvojná vazba je pevnější než jednoduchá, ale ne dvakrát.',
    'Elektronegativita je schopnost atomu ve vazbě přitahovat elektrony; nejvyšší má fluor (3,98).',
    'Elektronegativita roste v periodě zleva doprava a ve skupině zdola nahoru.',
    'Podle ΔX rozlišujeme vazbu nepolární (pod 0,4), polární (0,4–1,7) a iontovou (od 1,7).',
    'U polární vazby nese elektronegativnější atom částečný náboj δ−, druhý atom δ+.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Elektronegativita prvků ve skupině směrem dolů roste.',
      answer: false,
      explain: 'Klesá. Valenční elektrony jsou u větších atomů dál od jádra, takže je atom přitahuje slaběji.',
    },
    {
      kind: 'text',
      q: 'Napiš značku prvku s nejvyšší elektronegativitou.',
      accept: ['F'],
      caseSensitive: true,
      placeholder: 'značka',
      explain: 'Fluor $F$ má na Paulingově stupnici hodnotu 3,98, nejvyšší ze všech prvků.',
    },
    {
      kind: 'choice',
      q: 'Proč se dva atomy vodíku nepřiblíží úplně k sobě, i když se přitahují?',
      options: [
        'Na malou vzdálenost se začnou silně odpuzovat jejich kladná jádra.',
        'Elektrony se při přiblížení z atomů uvolní.',
        'Vodík přitom přejde na ionty $H^+$ a $H^-$.',
        'Přitažlivost jader a elektronů se na malou vzdálenost vypne.',
      ],
      answer: 0,
      explain: 'Energie klesá jen do určité vzdálenosti. Pak převládne odpuzování kladných jader a energie prudce roste, proto má vazba určitou délku.',
    },
    {
      kind: 'number',
      q: 'Spočítej ΔX pro vazbu $C–O$. (X(C) = 2,55; X(O) = 3,44)',
      answer: 0.89,
      tolerance: 0.01,
      explain: 'ΔX = 3,44 − 2,55 = 0,89, vazba $C–O$ je polární kovalentní a kyslík nese δ−.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k vazbě její typ.',
      pairs: [
        ['$Cl–Cl$ (ΔX = 0)', 'nepolární kovalentní'],
        ['$N–H$ (ΔX = 0,84)', 'polární kovalentní'],
        ['$K–Br$ (ΔX = 2,14)', 'iontová'],
      ],
      explain: 'Stejné atomy mají ΔX = 0. Mezi 0,4 a 1,7 je vazba polární, od 1,7 iontová.',
    },
    {
      kind: 'multi',
      q: 'Která tvrzení jsou pravdivá?',
      options: [
        'Při vzniku vazby se energie uvolňuje.',
        'Trojná vazba mezi dvěma atomy uhlíku je kratší než jednoduchá.',
        'Čím je vazba delší, tím bývá pevnější.',
        'K rozštěpení vazby je potřeba dodat energii.',
        'Kovy mají vyšší elektronegativitu než nekovy.',
      ],
      answers: [0, 1, 3],
      explain: 'Delší vazby bývají slabší, ne pevnější. Kovy mají elektronegativitu nízkou, nekovy vysokou.',
    },
    {
      kind: 'tf',
      q: 'Vazba mezi hořčíkem (X = 1,31) a kyslíkem (X = 3,44) je iontová.',
      answer: true,
      explain: 'ΔX = 3,44 − 1,31 = 2,13, tedy víc než 1,7. Oxid hořečnatý $MgO$ je iontová sloučenina.',
    },
    {
      kind: 'order',
      q: 'Seřaď vazby od nejslabší po nejpevnější.',
      items: ['$H–I$', '$H–Br$', '$H–Cl$', '$H–F$'],
      explain: 'Od jodu k fluoru se atom halogenu zmenšuje, vazba se zkracuje a sílí: 298 < 366 < 431 < 568 kJ/mol.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-2 Kovalentní vazba a Lewisovy vzorce
// ─────────────────────────────────────────────────────────────
const l32: Lesson = {
  id: 'l3-2',
  title: 'Kovalentní vazba a Lewisovy vzorce',
  goals: [
    'Rozlišit jednoduchou, dvojnou a trojnou vazbu a spočítat v nich vazby σ a π',
    'Krok za krokem nakreslit Lewisův (valenční) vzorec molekuly i iontu',
    'Vysvětlit koordinační vazbu v $NH4^+$, $H3O^+$ a $CO$ a spočítat formální náboj atomu',
    'Popsat rezonanci v $O3$, $NO3^-$ a $CO3^2-$ a poznat výjimky z oktetu v $BF3$, $PCl5$ a $SF6$',
  ],
  hook: 'Molekulu nakreslíš na papír za pár vteřin: čárky jsou vazby, tečky volné páry. Jenže u ozonu tě nákres nachytá: jedna vazba vyjde dvojná, druhá jednoduchá, a měření přitom ukazuje dvě úplně stejné. Dnes se naučíš kreslit elektrony tak, aby tě žádná molekula nepřechytračila.',
  sections: [
    {
      title: 'Sdílené elektronové páry',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: 'V minulé lekci vyšlo, že nekovy s malým ΔX si elektrony nepředávají, ale sdílejí. Co to přesně znamená? **Kovalentní vazba** vzniká, když dva atomy **sdílejí elektronový pár**; obvykle každý přispěje jedním valenčním elektronem. Sdílený pár patří oběma atomům a oba se tak přiblíží konfiguraci vzácného plynu. Nejjednodušší případ je vodík:',
        },
        {
          type: 'structure',
          art: art('H·  +  ·H   →   H:H   =   H — H'),
          caption: 'Vznik molekuly vodíku. Sdílený pár kreslíme dvojtečkou, nebo častěji čárkou.',
        },
        {
          type: 'p',
          text: 'Páry, které se na vazbě nepodílejí, jsou **volné** (nevazebné) **elektronové páry**. Ve **valenčním** neboli **Lewisově vzorci** je kreslíme jako dvojici teček nebo čárku u symbolu. Atomy 2. periody se snaží mít kolem sebe osm elektronů (**oktetové pravidlo**), vodíku stačí dva jako heliu. Volné páry poprvé uvidíš u chloru:',
        },
        {
          type: 'structure',
          art: art(' ··      ··', ':Cl  —  Cl:', ' ··      ··'),
          caption: 'Molekula chloru: jeden vazebný pár a na každém atomu tři volné páry. Každý chlor má kolem sebe oktet.',
        },
        { type: 'p', text: 'Ve vzorci chloru jsou tedy dva druhy párů. Než půjdeme dál, ujasněme si názvy, které budeš potřebovat celou lekci:' },
        {
          type: 'keyterms',
          items: [
            { term: 'vazebný elektronový pár', def: 'dvojice elektronů sdílená dvěma atomy, tvoří kovalentní vazbu' },
            { term: 'volný elektronový pár', def: 'dvojice valenčních elektronů, která patří jen jednomu atomu' },
            { term: 'vaznost', def: 'počet kovalentních vazeb, které atom obvykle tvoří: H 1, O 2, N 3, C 4' },
          ],
        },
        {
          type: 'p',
          text: 'Atomy mohou sdílet i víc párů: **jednoduchá vazba** je jeden sdílený pár, **dvojná vazba** dva a **trojná vazba** tři. Kyslík v $O2$ je spojen dvojnou vazbou, dusík v $N2$ trojnou. Čím víc sdílených párů, tím je vazba kratší a pevnější – přesně jak ukazovala tabulka délek v minulé lekci.',
        },
        {
          type: 'molecule',
          molecules: ['Cl2', 'O2', 'N2'],
          labels: ['jednoduchá $Cl–Cl$', 'dvojná $O=O$', 'trojná $N≡N$'],
          caption: 'Otoč si je myší nebo prstem: čím víc sdílených párů, tím blíž jsou atomy u sebe.',
        },
        { type: 'p', text: 'Na papíře zapisujeme stejné molekuly Lewisovým vzorcem. Spočítej si u každého atomu elektrony: vazebné a volné páry dohromady musí dát osm.' },
        {
          type: 'structure',
          art: art(' ··     ··', ' O   =  O          :N ≡ N:', ' ··     ··'),
          caption: 'Kyslík: dvojná vazba a dva volné páry na každém atomu. Dusík: trojná vazba a jeden volný pár na každém atomu.',
        },
        { type: 'p', text: 'V minulé lekci jsme zjistili, že dvojná vazba není dvakrát pevnější než jednoduchá. Vysvětlení je v tom, že sdílené páry nejsou všechny stejné: orbitaly se mohou překrývat dvojím způsobem.' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Vazba σ (sigma)',
              icon: 'bond',
              tone: 'a',
              points: ['překryv orbitalů přímo na spojnici obou jader', 'mezi dvěma atomy vždy právě jedna', 'pevnější'],
            },
            {
              title: 'Vazba π (pí)',
              icon: 'electron',
              tone: 'b',
              points: ['boční překryv orbitalů p nad a pod spojnicí jader', 'druhá a třetí vazba násobné vazby', 'slabší, snáz se „otevře“'],
            },
          ],
          caption: 'Vazby se liší tím, jak se překrývají orbitaly.',
        },
        { type: 'p', text: 'Jak se vazby σ a π skládají v jednoduché, dvojné a trojné vazbě, shrnuje tabulka:' },
        {
          type: 'table',
          headers: ['Vazba', 'Sdílené páry', 'Složení', 'Příklad'],
          rows: [
            ['jednoduchá', '1', '1 σ', '$H–H$, $Cl–Cl$'],
            ['dvojná', '2', '1 σ + 1 π', '$O=O$'],
            ['trojná', '3', '1 σ + 2 π', '$N≡N$'],
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Mezi dvěma atomy je vždy jen jedna vazba σ; každá další vazba je π.== Vazba π je slabší a snáz se „otevře“, proto jsou látky s dvojnými vazbami reaktivnější (uvidíš v organické chemii v úrovni 8).',
        },
        { type: 'p', text: 'Teď víš, z čeho se vazby skládají. U dvouatomových molekul se vzorec dá uhodnout, u větších ale potřebuješ postup, aby ti žádný elektron neutekl.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Z jakých vazeb se skládá trojná vazba v molekule $N2$?',
            options: ['3 σ', '1 σ a 2 π', '2 σ a 1 π', '3 π'],
            answer: 1,
            explain: 'První vazba mezi dvěma atomy je vždy σ, další dvě jsou π.',
          },
        },
      ],
    },
    {
      title: 'Lewisův vzorec krok za krokem',
      icon: 'pencil',
      blocks: [
        {
          type: 'p',
          text: 'Vzorec $H2$ nebo $Cl2$ uhodneš, u $CO2$ nebo $HCN$ to už tak snadné není. Proto se Lewisův vzorec sestavuje podle pevného postupu. Potřebuješ jen počet valenčních elektronů, který vyčteš z čísla skupiny: 1. a 2. skupina má 1 a 2, skupiny 13 až 18 mají o deset méně, než je číslo skupiny. Pak už jen projdeš šest kroků:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'calculator', title: 'Sečti valenční elektrony', text: 'všech atomů; u aniontu přičti, u kationtu odečti náboj. Vyděl dvěma: máš počet párů' },
            { icon: 'atom', title: 'Postav kostru', text: 'centrální je atom s nejvyšší vazností (bývá nejméně elektronegativní); vodík nikdy není uprostřed' },
            { icon: 'bond', title: 'Spoj jednoduchými vazbami', text: 'centrální atom s každým okolním atomem' },
            { icon: 'electron', title: 'Doplň volné páry', text: 'okolním atomům do oktetu, vodíku nic; zbylé páry dej centrálnímu atomu' },
            { icon: 'arrow-cycle', title: 'Dořeš oktet', text: 'chybí-li centrálnímu atomu oktet, udělej z volného páru souseda dvojnou nebo trojnou vazbu' },
            { icon: 'check', title: 'Zkontroluj', text: 'počet elektronů, oktety a formální náboje (uvidíš za chvíli)' },
          ],
          caption: 'Šest kroků k Lewisovu vzorci.',
        },
        { type: 'p', text: 'U jednoduchých molekul s vodíkem stačí první čtyři kroky. Ověř si podle nich vzorce vody, amoniaku a methanu:' },
        {
          type: 'structure',
          art: art('    ··             ··            H', 'H — O — H     H — N — H     H — C — H', '    ··             |            |', '                   H            H'),
          caption: 'Voda (2 volné páry na kyslíku), amoniak (1 volný pár na dusíku) a methan (žádný volný pár).',
        },
        { type: 'p', text: 'Krok „dořeš oktet“ přijde ke slovu až u molekul s násobnými vazbami. Projdeme celý postup na oxidu uhličitém:' },
        {
          type: 'example',
          title: 'Oxid uhličitý',
          problem: 'Nakresli Lewisův vzorec $CO2$.',
          steps: [
            'Valenční elektrony: C má 4, každý O má 6, celkem 4 + 2 · 6 = 16 elektronů, tedy 8 párů.',
            'Centrální atom je uhlík. Kostra $O–C–O$ spotřebuje 2 páry.',
            'Každý kyslík dostane 3 volné páry: to je dalších 6 párů, celkem 8. Všechny páry jsou rozdané.',
            'Uhlík má ale jen 2 vazby, tedy 4 elektrony. Z jednoho volného páru každého kyslíku proto uděláme další vazbu.',
            'Kontrola: každý O má 2 vazby a 2 volné páry (8 elektronů), C má 4 vazby (8 elektronů).',
          ],
          answer: '$O=C=O$ se dvěma volnými páry na každém kyslíku',
        },
        { type: 'p', text: 'U kyanovodíku navíc rozhoduje druhý krok: vodík tvoří jen jednu vazbu, a proto nikdy nestojí uprostřed. Jinak je postup stejný:' },
        {
          type: 'example',
          title: 'Kyanovodík',
          problem: 'Nakresli Lewisův vzorec $HCN$.',
          steps: [
            'Valenční elektrony: 1 (H) + 4 (C) + 5 (N) = 10 elektronů, tedy 5 párů.',
            'Vodík nemůže být uprostřed, centrální je uhlík. Kostra $H–C–N$ spotřebuje 2 páry.',
            'Dusík dostane 3 volné páry, celkem je rozdáno 5 párů.',
            'Uhlík má jen 2 vazby. Dva volné páry dusíku proto převedeme na vazby: vznikne trojná vazba $C≡N$.',
            'Kontrola: C má 4 vazby (8 elektronů), N 3 vazby a 1 volný pár (8 elektronů), H jednu vazbu (2 elektrony).',
          ],
          answer: '$H–C≡N$ s jedním volným párem na dusíku',
        },
        { type: 'p', text: 'Výsledek si nakresli celý, i s volným párem na dusíku – bez něj by dusík neměl oktet.' },
        {
          type: 'structure',
          art: art('H — C ≡ N:'),
          caption: 'Kyanovodík: jedna jednoduchá a jedna trojná vazba. Prudký jed, který voní po hořkých mandlích.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Ion kreslíš stejně',
          text: 'U iontu jen v prvním kroku uprav počet elektronů: za každý záporný náboj jeden elektron přidej, za každý kladný jeden uber. Hotový vzorec dej do hranaté závorky a náboj napiš vpravo nahoru.',
        },
        { type: 'p', text: 'Postup tedy funguje pro molekuly i ionty. U amonného kationtu se ale skrývá zvláštnost: jednu z jeho vazeb tvoří pár, který dodal jen dusík.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik elektronů celkem rozmísťuješ v Lewisově vzorci amonného kationtu $NH4^+$?',
            answer: 8,
            explain: 'Dusík má 5 valenčních elektronů a čtyři vodíky po jednom, to je 9. Kladný náboj znamená o jeden elektron méně: 9 − 1 = 8 elektronů, tedy 4 vazebné páry.',
          },
        },
      ],
    },
    {
      title: 'Koordinační vazba',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Zatím do každé vazby přispěl každý atom jedním elektronem. Někdy ale dodá oba elektrony jen jeden atom. Takové vazbě říkáme **koordinační** (donor-akceptorová, anglicky *dative*) **vazba**. Potřebuje dva partnery s opačnými rolemi:',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'donor', def: 'atom, který poskytne svůj volný elektronový pár (např. N v $NH3$, O v $H2O$)' },
            { term: 'akceptor', def: 'atom nebo ion s prázdným orbitalem, který pár přijme (např. $H^+$, který nemá žádný elektron)' },
          ],
        },
        { type: 'p', text: 'Typickým akceptorem je proton $H^+$: sám elektrony nemá, a tak rád přijme celý pár. Donorem může být dusík amoniaku se svým volným párem:' },
        {
          type: 'reaction',
          equation: 'NH3 + H^+ -> NH4^+',
          caption: 'Vznik amonného kationtu: dusík poskytne volný pár iontu $H^+$.',
        },
        { type: 'p', text: 'Stejně se proton naváže na volný pár kyslíku ve vodě:' },
        {
          type: 'reaction',
          equation: 'H2O + H^+ -> H3O^+',
          caption: 'Vznik oxoniového kationtu: donorem je kyslík vody.',
        },
        { type: 'p', text: 'Ve vzorci se koordinační vazba někdy kreslí šipkou, abys viděl/a, odkud pár přišel:' },
        {
          type: 'structure',
          art: art('      H     +          ··    +', '      |            H — O — H', '  H — N — H            ↓', '      ↓                H', '      H'),
          caption: 'Amonný kation $NH4^+$ a oxoniový kation $H3O^+$. Šipka míří od donoru k akceptoru. Kladný náboj patří celému iontu.',
        },
        {
          type: 'p',
          text: '==Jakmile koordinační vazba vznikne, nijak se neliší od ostatních.== V amonném kationtu jsou všechny čtyři vazby $N–H$ stejně dlouhé a stejně pevné; liší se jen to, odkud elektrony přišly.',
        },
        {
          type: 'p',
          text: 'Koordinační vazbu najdeš i v **oxidu uhelnatém** $CO$. Uhlík a kyslík sdílejí dva páry „obyčejně“ a třetí pár dodá celý kyslík. Vznikne trojná vazba a na každém atomu zůstane jeden volný pár.',
        },
        {
          type: 'structure',
          art: art(':C ≡ O:'),
          caption: 'Oxid uhelnatý: 4 + 6 = 10 elektronů, tedy 5 párů. Tři tvoří trojnou vazbu, z toho jeden je koordinační (oba elektrony od kyslíku).',
        },
        { type: 'p', text: 'Ve všech třech částicích je tedy jedna vazba koordinační. Zkus ji najít na 3D modelech:' },
        {
          type: 'molecule',
          molecules: ['NH4+', 'H3O+', 'CO'],
          labels: ['amonný kation $NH4^+$', 'oxoniový kation $H3O^+$', 'oxid uhelnatý $CO$'],
          caption: 'Tři částice s koordinační vazbou. Poznáš ve 3D modelu, která vazba vznikla koordinačně? Nepoznáš, a to je přesně ono.',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Proč je $CO$ tak jedovatý',
          text: 'Atom železa v hemoglobinu tvé krve váže kyslík koordinační vazbou. Oxid uhelnatý se na stejné místo váže volným párem uhlíku, a to asi 200krát pevněji než kyslík. Krev pak kyslík nepřenáší. O takových sloučeninách (komplexech) uslyšíš víc v úrovni 7.',
        },
        { type: 'p', text: 'Šipka ve vzorci tedy prozrazuje jen původ elektronů. Jak ale u atomu poznat, že dal do vazeb víc, než by „měl“? K tomu slouží formální náboj.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'V amonném kationtu $NH4^+$ se vazba, která vznikla koordinačně, liší délkou od ostatních tří vazeb $N–H$.',
            answer: false,
            explain: 'Všechny čtyři vazby jsou po vzniku rovnocenné. Koordinační vazba se liší jen původem elektronů.',
          },
        },
      ],
    },
    {
      title: 'Formální náboj',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'V amonném kationtu dal dusík do vazeb víc, než kolik z nich „má“. Tuhle nerovnováhu vyjadřuje **formální náboj**: počítáme, jako by se každý vazebný pár dělil mezi oba atomy přesně napůl. Porovnáš tedy, kolik elektronů má atom sám o sobě a kolik mu jich ve vzorci „patří“:',
        },
        {
          type: 'formula',
          text: 'formální náboj = V − N − B/2',
          caption: 'V = valenční elektrony volného atomu, N = elektrony ve volných párech atomu, B/2 = počet vazeb atomu (polovina vazebných elektronů)',
        },
        { type: 'p', text: 'Vyzkoušej vzorec na částicích s koordinační vazbou z minulého oddílu:' },
        {
          type: 'table',
          headers: ['Částice', 'Atom', 'V', 'N', 'Vazby', 'Formální náboj'],
          rows: [
            ['$NH4^+$', 'N', '5', '0', '4', '5 − 0 − 4 = **+1**'],
            ['$H3O^+$', 'O', '6', '2', '3', '6 − 2 − 3 = **+1**'],
            ['$CO$', 'C', '4', '2', '3', '4 − 2 − 3 = **−1**'],
            ['$CO$', 'O', '6', '2', '3', '6 − 2 − 3 = **+1**'],
          ],
          caption: 'Vodíky mají ve všech případech formální náboj 0 (1 − 0 − 1).',
        },
        { type: 'p', text: 'Všimni si, že u $CO$ se náboje +1 a −1 vyruší a u $NH4^+$ dají dohromady náboj iontu. Pro formální náboje platí tři pravidla:' },
        {
          type: 'list',
          items: [
            '**Součet** formálních nábojů se rovná náboji částice, u molekuly je 0.',
            'Nejlepší vzorec má formální náboje **co nejmenší**, ideálně všude 0.',
            'Když už záporný formální náboj být musí, patří **elektronegativnějšímu** atomu.',
          ],
        },
        { type: 'p', text: 'K čemu to je? Pravidla pomohou vybrat mezi vzorci, které oba splňují oktetové pravidlo. Třeba $CO2$ se dá nakreslit dvěma způsoby:' },
        {
          type: 'structure',
          art: art(' ··      ··              ··', ' O = C = O      :O ≡ C — O:', ' ··      ··              ··', ' 0   0   0      +1   0  −1', ' vzorec A        vzorec B'),
          caption: 'Dva vzorce $CO2$, oba s oktety. Pod atomy jsou formální náboje.',
        },
        { type: 'p', text: 'Oktet tady nerozhodne. Spočítejme formální náboje v obou vzorcích a porovnejme je podle pravidel:' },
        {
          type: 'example',
          title: 'Který vzorec oxidu uhličitého je lepší?',
          problem: 'Oba vzorce $CO2$ nahoře splňují oktetové pravidlo. Rozhodni pomocí formálních nábojů, který je správný.',
          steps: [
            'Vzorec A, kyslík: 6 − 4 − 2 = 0; uhlík: 4 − 0 − 4 = 0.',
            'Vzorec B, kyslík s trojnou vazbou: 6 − 2 − 3 = +1; uhlík: 4 − 0 − 4 = 0; kyslík s jednoduchou vazbou: 6 − 6 − 1 = −1.',
            'Oba součty jsou 0, ale vzorec A má všechny formální náboje nulové.',
          ],
          answer: 'Správný je vzorec A, $O=C=O$. Měření to potvrzuje: obě vazby $C=O$ jsou stejně dlouhé.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Formální náboj není oxidační číslo',
          text: 'Formální náboj dělí vazebné páry napůl. Oxidační číslo, které poznáš v lekci o chemických vzorcích, je naopak celé přiděluje elektronegativnějšímu atomu. Uhlík v $CO$ má formální náboj −1, ale oxidační číslo +II.',
        },
        { type: 'p', text: 'Formální náboje nám tedy pomohou vybrat lepší ze dvou vzorců. U ozonu ale narazíme na případ, kdy jsou dva vzorce úplně rovnocenné.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaký formální náboj má kyslík v hydroxidovém aniontu $OH^-$? Kyslík v něm má jednu vazbu a tři volné páry.',
            answer: -1,
            explain: 'V = 6, N = 6 (tři volné páry), 1 vazba: 6 − 6 − 1 = −1. Záporný náboj aniontu tedy „sedí“ na kyslíku.',
          },
        },
      ],
    },
    {
      title: 'Rezonance: když jeden vzorec nestačí',
      icon: 'arrow-cycle',
      blocks: [
        {
          type: 'p',
          text: 'Vrať se k ozonu z úvodu lekce. Podle postupu mu vyjde jedna vazba dvojná a druhá jednoduchá. Měření ale ukazuje, že ==obě vazby $O–O$ jsou stejně dlouhé (128 pm)==, někde mezi jednoduchou (148 pm) a dvojnou (121 pm).',
        },
        {
          type: 'structure',
          art: art(' ··    ··    ··       ··    ··    ··', ' O  =  O  —  O:  ↔   :O  —  O  =  O', ' ··          ··       ··          ··', ' 0    +1    −1       −1    +1     0'),
          caption: 'Dvě rezonanční struktury ozonu se liší jen polohou dvojné vazby. Dole jsou formální náboje.',
        },
        {
          type: 'p',
          text: 'Žádný z obou vzorců sám o sobě neplatí. Skutečná molekula je **rezonanční hybrid**, jakýsi „průměr“ všech **rezonančních** (mezních) **struktur**. Elektrony vazby π nepatří jedné vazbě, ale jsou **delokalizované** přes celou částici. Mezi struktury píšeme obousměrnou šipku ↔. U dusičnanového aniontu jsou struktury dokonce tři:',
        },
        {
          type: 'diagram',
          id: 'resonance',
          caption: 'Tři rezonanční struktury dusičnanového aniontu $NO3^-$ a jejich hybrid. Skutečný ion má všechny tři vazby N–O stejně dlouhé a záporný náboj rozprostřený rovnoměrně na tři kyslíky.',
        },
        { type: 'p', text: 'Uhličitanový anion je stavěný podobně jako dusičnanový. Projdi postup a sleduj, kolika způsoby se dá dvojná vazba umístit:' },
        {
          type: 'example',
          title: 'Uhličitanový anion',
          problem: 'Nakresli Lewisův vzorec $CO3^2-$ a vysvětli, proč jsou v něm všechny tři vazby C–O stejné.',
          steps: [
            'Elektrony: 4 (C) + 3 · 6 (O) + 2 (náboj 2−) = 24, tedy 12 párů.',
            'Kostra: uhlík uprostřed, tři jednoduché vazby C–O spotřebují 3 páry.',
            'Každý kyslík dostane 3 volné páry, to je 9 párů. Rozdáno je všech 12, ale uhlík má jen 6 elektronů.',
            'Jeden volný pár kyslíku převedeme na dvojnou vazbu C=O a uhlík má oktet.',
            'Formální náboje: C 0, kyslík s dvojnou vazbou 0, oba kyslíky s jednoduchou vazbou −1. Součet −2 odpovídá náboji.',
            'Dvojná vazba může vést ke kterémukoli ze tří kyslíků, existují tedy 3 rezonanční struktury.',
          ],
          answer: 'Skutečný ion je hybrid tří struktur: všechny vazby C–O jsou stejné, něco mezi jednoduchou a dvojnou, a náboj 2− se dělí mezi tři kyslíky.',
        },
        { type: 'p', text: 'Ve skutečnosti tedy žádná z vazeb není čistě dvojná ani jednoduchá. Na modelech všech tří částic je to vidět:' },
        {
          type: 'molecule',
          molecules: ['O3', 'NO3-', 'CO3^2-'],
          labels: ['ozon $O3$', 'dusičnanový anion $NO3^-$', 'uhličitanový anion $CO3^2-$'],
          caption: 'Tři částice, které popíšeš jen rezonancí. Ve 3D modelu mají všechny vazby k okolním kyslíkům stejně dlouhé.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Molekula nepřeskakuje',
          text: 'Rezonance neznamená, že se ozon rychle přepíná mezi dvěma vzorci. Je to jako s mezkem: kříženec koně a oslice není chvíli kůň a chvíli osel, ale pořád mezek. Rezonanční struktury jsou jen naše pomůcka, jak na papíře zakreslit delokalizované elektrony.',
        },
        { type: 'p', text: 'Rezonance tedy řeší případy, kdy elektronů je dost, jen se nedají umístit jedním vzorcem. Zbývají molekuly, kde oktet nevyjde vůbec.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'V dusičnanovém aniontu $NO3^-$ je jedna vazba N–O kratší než ostatní dvě, protože je dvojná.',
            answer: false,
            explain: 'Dvojná vazba je delokalizovaná přes všechny tři kyslíky. Skutečný ion je rezonanční hybrid a všechny tři vazby N–O jsou stejně dlouhé.',
          },
        },
      ],
    },
    {
      title: 'Výjimky z oktetu',
      icon: 'warning',
      blocks: [
        {
          type: 'p',
          text: 'Všechny dosavadní vzorce stály na oktetovém pravidle. Je to ale šikovná pomůcka, ne zákon přírody. Výjimky mají tři podoby:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'ion-minus', title: 'Méně než oktet', text: 'bor v $BF3$ má kolem sebe jen 6 elektronů, beryllium v $BeCl2$ jen 4' },
            { icon: 'ion-plus', title: 'Rozšířený oktet', text: 'fosfor v $PCl5$ má 10 elektronů, síra v $SF6$ dokonce 12' },
            { icon: 'electron', title: 'Lichý počet elektronů', text: '$NO$ (11 elektronů) a $NO2$ (17 elektronů) mají jeden nepárový elektron, jsou to **radikály**' },
          ],
        },
        { type: 'p', text: 'První dva typy výjimek ukazují, jak moc se může lišit počet elektronů kolem centrálního atomu – od šesti až do dvanácti:' },
        {
          type: 'molecule',
          molecules: ['BF3', 'PCl5', 'SF6'],
          labels: ['$BF3$: 6 elektronů kolem B', '$PCl5$: 10 elektronů kolem P', '$SF6$: 12 elektronů kolem S'],
          caption: 'Tři výjimky z oktetu ve 3D. Jaký mají tvar, rozebereme v příští lekci.',
        },
        { type: 'p', text: 'Postup pro Lewisův vzorec platí i pro výjimky. U fosforu jen zjistíš, že elektronů kolem něj je na konci víc než osm:' },
        {
          type: 'example',
          title: 'Chlorid fosforečný',
          problem: 'Nakresli Lewisův vzorec $PCl5$ a spočítej elektrony kolem fosforu.',
          steps: [
            'Elektrony: 5 (P) + 5 · 7 (Cl) = 40, tedy 20 párů.',
            'Kostra: fosfor uprostřed a pět vazeb P–Cl, to je 5 párů.',
            'Každý chlor dostane 3 volné páry: 15 párů. Celkem 20, vše je rozdané a každý chlor má oktet.',
            'Fosfor má kolem sebe 5 vazebných párů, tedy 10 elektronů.',
          ],
          answer: 'Fosfor v $PCl5$ má rozšířený oktet: 10 elektronů.',
        },
        {
          type: 'p',
          text: 'Proč smí fosfor a síra mít víc než osm elektronů? Jsou větší, vejde se kolem nich víc sousedů a jejich valenční vrstva má víc orbitalů. Prvky 2. periody (C, N, O, F) mají jen čtyři valenční orbitaly (2s a tři 2p), a proto ==kolem nich nikdy nebude víc než osm elektronů.==',
        },
        { type: 'p', text: 'A co bor, kterému naopak dva elektrony do oktetu chybí? Volné místo mu může zaplnit cizí volný pár – koordinační vazbou, jakou už znáš:' },
        {
          type: 'structure',
          art: art('    F     H', '    |     |', 'F — B  ←  N — H', '    |     |', '    F     H'),
          caption: 'Bor v $BF3$ má volné místo pro jeden pár. Amoniak mu ho ochotně nabídne a vznikne koordinační vazba; bor pak má oktet.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Proč v $BF3$ nekreslíme dvojnou vazbu',
          text: 'Z volného páru fluoru by šla udělat dvojná vazba B=F a bor by měl oktet. Fluor by ale nesl formální náboj +1, a to nejelektronegativnějšímu prvku nesedí. Vzorec se třemi jednoduchými vazbami má všechny formální náboje 0, a proto je lepší.',
        },
        { type: 'p', text: 'Teď umíš nakreslit Lewisův vzorec skoro každé molekuly. Vzorec na papíře je ale plochý – v příští lekci zjistíš, jaký tvar mají molekuly v prostoru.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Kolik elektronů má kolem sebe atom síry v molekule $SF6$?',
            options: ['12', '8', '6', '10'],
            answer: 0,
            explain: 'Síra tvoří šest vazeb S–F a každá je jeden sdílený pár: 6 · 2 = 12 elektronů. Je to rozšířený oktet, možný jen u prvků 3. a vyšší periody.',
          },
        },
      ],
    },
  ],
  summary: [
    'Kovalentní vazbu tvoří sdílený elektronový pár; atomy tím obvykle získají oktet (vodík dvojici).',
    'Jednoduchá vazba je σ, dvojná σ + π a trojná σ + 2π; vazba π je slabší než σ.',
    'Lewisův vzorec sestavíš takto: sečti valenční elektrony, postav kostru, doplň volné páry a chybějící oktet dořeš násobnou vazbou.',
    'Koordinační vazbu tvoří pár, který dodá jediný atom (donor), např. v $NH4^+$, $H3O^+$ a $CO$.',
    'Formální náboj = V − N − B/2; nejlepší vzorec má formální náboje co nejmenší a jejich součet se rovná náboji částice.',
    'Když jeden vzorec nestačí, je skutečná částice rezonančním hybridem: v $O3$, $NO3^-$ a $CO3^2-$ jsou vazby ke kyslíkům stejné.',
    'Výjimky z oktetu: bor v $BF3$ má kolem sebe 6 elektronů, fosfor v $PCl5$ 10 a síra v $SF6$ 12.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Kolik vazeb σ a π obsahuje molekula $CO2$ ($O=C=O$)?',
      options: ['2 σ a 2 π', '4 σ', '2 σ a 1 π', '1 σ a 3 π'],
      answer: 0,
      explain: 'Každá dvojná vazba se skládá z jedné vazby σ a jedné π. Dvě dvojné vazby dávají 2 σ a 2 π.',
    },
    {
      kind: 'number',
      q: 'Kolik volných elektronových párů má atom dusíku v molekule amoniaku $NH3$?',
      answer: 1,
      explain: 'Dusík má 5 valenčních elektronů: 3 použije na vazby s vodíky, zbylé 2 tvoří jeden volný pár.',
    },
    {
      kind: 'tf',
      q: 'Molekula ozonu se neustále přepíná mezi dvěma rezonančními strukturami.',
      answer: false,
      explain: 'Ozon je pořád jeden a tentýž rezonanční hybrid s dvěma stejnými vazbami. Rezonanční struktury jsou jen způsob, jak zakreslit delokalizované elektrony.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých částicích najdeš koordinační vazbu?',
      options: ['$NH4^+$', '$H3O^+$', '$CO$', '$CH4$', '$NH3$'],
      answers: [0, 1, 2],
      explain: 'V $NH4^+$ a $H3O^+$ poskytl volný pár dusík nebo kyslík iontu $H^+$, v $CO$ dodal jeden pár trojné vazby kyslík. $CH4$ a $NH3$ mají jen obyčejné kovalentní vazby.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k molekule počet elektronů kolem centrálního atomu.',
      pairs: [
        ['$BF3$', '6'],
        ['$CH4$', '8'],
        ['$PCl5$', '10'],
        ['$SF6$', '12'],
      ],
      explain: 'Každá vazba znamená 2 elektrony u centrálního atomu. Bor má jen 3 vazby, uhlík oktet, fosfor a síra rozšířený oktet.',
    },
    {
      kind: 'choice',
      q: 'Jaký formální náboj má kyslík, který je v dusičnanovém aniontu $NO3^-$ vázán jednoduchou vazbou (má 3 volné páry)?',
      options: ['−1', '0', '+1', '−2'],
      answer: 0,
      explain: '6 − 6 − 1 = −1. Dva takové kyslíky mají −1, dusík +1 a kyslík s dvojnou vazbou 0: součet −1 odpovídá náboji iontu.',
    },
    {
      kind: 'tf',
      q: 'Atom dusíku může mít ve sloučenině kolem sebe 10 elektronů, podobně jako fosfor v $PCl5$.',
      answer: false,
      explain: 'Dusík je prvek 2. periody a má jen čtyři valenční orbitaly (2s a 2p). Víc než oktet mít nemůže, proto $NCl5$ neexistuje.',
    },
    {
      kind: 'choice',
      q: 'Kolik elektronů sdílejí dva atomy spojené trojnou vazbou?',
      options: ['2', '3', '4', '6'],
      answer: 3,
      explain: 'Trojná vazba jsou tři sdílené elektronové páry, tedy 6 elektronů.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-7 Tvary molekul: VSEPR, hybridizace a polarita
// ─────────────────────────────────────────────────────────────
const l37: Lesson = {
  id: 'l3-7',
  title: 'Tvary molekul: VSEPR, hybridizace a polarita',
  goals: [
    'Podle modelu VSEPR určit tvar molekuly a vazebné úhly pro 2 až 6 elektronových oblastí',
    'Vysvětlit, proč volné elektronové páry zmenšují vazebné úhly',
    'Přiřadit centrálnímu atomu hybridizaci sp, sp² nebo sp³ a spojit ji s vazbami σ a π v ethanu, ethenu a ethynu',
    'Z polarity vazeb a tvaru molekuly rozhodnout, zda je molekula polární',
  ],
  hook: 'Voda i oxid uhličitý jsou tříatomové molekuly s polárními vazbami. Přesto je voda polární kapalina, ve které se rozpustí sůl, a $CO2$ nepolární plyn v bublinkách limonády. Celý rozdíl je ve tvaru: voda je zalomená jako bumerang, $CO2$ rovný jako špejle.',
  sections: [
    {
      title: 'Model VSEPR: elektronové páry se odpuzují',
      icon: 'magnet',
      blocks: [
        {
          type: 'p',
          text: 'Lewisův vzorec z minulé lekce říká, kdo je s kým spojený, ale ne, jak molekula vypadá v prostoru. Tvar molekuly předpovíš modelem **VSEPR** (z anglického *Valence Shell Electron Pair Repulsion*, odpuzování elektronových párů valenční vrstvy). ==Elektronové páry kolem centrálního atomu se odpuzují, a proto se od sebe vzdálí co nejvíc.== Abys to mohl/a použít, potřebuješ tři pojmy:',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'elektronová oblast', def: 'místo s elektrony kolem centrálního atomu: každá vazba (jednoduchá, dvojná i trojná) je jedna oblast, každý volný pár také' },
            { term: 'vazebný úhel', def: 'úhel mezi dvěma vazbami vycházejícími z jednoho atomu' },
            { term: 'tvar molekuly', def: 'rozmístění atomů v prostoru; volné páry do něj nezahrnujeme, i když ho ovlivňují' },
          ],
        },
        { type: 'p', text: 'S nimi už tvar určíš v pěti krocích. Prvním je Lewisův vzorec – bez něj nevíš, kolik oblastí centrální atom má:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'pencil', title: 'Nakresli Lewisův vzorec', text: 'postupem z minulé lekce' },
            { icon: 'calculator', title: 'Spočítej oblasti', text: 'na centrálním atomu: vazby (násobná = jedna) + volné páry' },
            { icon: 'atom', title: 'Rozmísti oblasti', text: '2 přímka, 3 trojúhelník, 4 čtyřstěn, 5 trigonální bipyramida, 6 oktaedr' },
            { icon: 'magnifier', title: 'Pojmenuj tvar', text: 'podle poloh atomů; volné páry místo zabírají, ale do tvaru se nepočítají' },
            { icon: 'electron', title: 'Oprav úhly', text: 'každý volný pár úhly mezi vazbami o kousek stlačí' },
          ],
          caption: 'Jak určit tvar molekuly v pěti krocích.',
        },
        {
          type: 'p',
          text: 'Poslední krok si zaslouží vysvětlení. Proč volný pár odpuzuje víc než vazebný? Vazebný pár drží dvě jádra a je protažený mezi ně. Volný pár drží jen jedno jádro, je blíž centrálnímu atomu a rozprostře se do širšího prostoru. Síla odpuzování proto klesá v tomto pořadí:',
        },
        {
          type: 'formula',
          text: 'volný–volný > volný–vazebný > vazebný–vazebný',
          caption: 'síla odpuzování mezi elektronovými páry',
        },
        { type: 'p', text: 'Jak velký je ten rozdíl? Porovnej tři molekuly se čtyřmi oblastmi, které se liší jen počtem volných párů:' },
        {
          type: 'molecule',
          molecules: ['CH4', 'NH3', 'H2O'],
          labels: ['methan: 109,5°', 'amoniak: 107°', 'voda: 104,5°'],
          caption: 'Ve všech třech míří čtyři elektronové oblasti do rohů čtyřstěnu. Každý volný pár ale stlačí vazebné úhly o kousek víc.',
        },
        { type: 'p', text: 'Teď celý postup krok za krokem na amoniaku:' },
        {
          type: 'example',
          title: 'Tvar amoniaku',
          problem: 'Urči tvar molekuly $NH3$ a odhadni vazebný úhel.',
          steps: [
            'Lewisův vzorec: dusík má 3 vazby $N–H$ a 1 volný pár.',
            'Elektronové oblasti: 3 + 1 = 4, míří tedy do rohů čtyřstěnu.',
            'Atomy: dusík nahoře, tři vodíky pod ním v podstavě. Volný pár zabírá čtvrtý roh, ale do tvaru ho nepočítáme.',
            'Volný pár tlačí na vazby silněji, úhel $H–N–H$ se zmenší ze 109,5° asi na 107°.',
          ],
          answer: 'trigonální pyramida s úhly asi 107°',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Balonkový pokus',
          text: 'Nafoukni čtyři stejné balonky a svaž je uzly k sobě. Samy se natočí do rohů čtyřstěnu jako vazby v methanu. Se dvěma balonky dostaneš přímku, se třemi trojúhelník. Balonky se „odpuzují“ stejně jako elektronové páry.',
        },
        { type: 'p', text: 'Postup i s opravou úhlů tedy znáš. Teď ho použijeme na nejčastější molekuly, které mají kolem centrálního atomu dvě až čtyři oblasti.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč je vazebný úhel ve vodě (104,5°) menší než v methanu (109,5°)?',
            options: [
              'Dva volné páry kyslíku odpuzují vazebné páry silněji, než se odpuzují vazebné páry mezi sebou.',
              'Molekula vody má jen dvě elektronové oblasti.',
              'Atomy vodíku se ve vodě navzájem přitahují.',
              'Kyslík je menší než uhlík, a tak se k němu vazby nevejdou.',
            ],
            answer: 0,
            explain: 'Voda i methan mají 4 elektronové oblasti. Kyslík má ale 2 volné páry, které se roztahují víc než vazby a úhel $H–O–H$ stlačí.',
          },
        },
      ],
    },
    {
      title: 'Dvě až čtyři oblasti',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: 'Většina molekul, které potkáš, má kolem centrálního atomu dvě, tři nebo čtyři elektronové oblasti. Podle toho, kolik z nich jsou volné páry, vznikne pět základních tvarů. Prohlédni si je nejdřív na obrázku:',
        },
        {
          type: 'diagram',
          id: 'vsepr-shapes',
          caption: 'Pět základních tvarů molekul s vazebnými úhly. Klínová vazba míří před rovinu nákresu, čárkovaná za ni.',
        },
        { type: 'p', text: 'Tabulka říká totéž v číslech. Čti ji po řádcích: nejdřív počet oblastí, pak kolik z nich jsou volné páry, a teprve z toho tvar.' },
        {
          type: 'table',
          headers: ['Oblasti', 'Vazby + volné páry', 'Tvar', 'Úhel', 'Příklady'],
          rows: [
            ['2', '2 + 0', 'lineární', '180°', '$BeCl2$, $CO2$'],
            ['3', '3 + 0', 'trojúhelníková (rovinná)', '120°', '$BF3$, $SO3$'],
            ['3', '2 + 1', 'lomená', 'asi 119°', '$SO2$'],
            ['4', '4 + 0', 'tetraedrická', '109,5°', '$CH4$, $CCl4$, $NH4^+$'],
            ['4', '3 + 1', 'trigonální pyramida', 'asi 107° ($NH3$)', '$NH3$, $H3O^+$'],
            ['4', '2 + 2', 'lomená', '104,5°', '$H2O$'],
          ],
          caption: 'Tvary pro dvě až čtyři elektronové oblasti.',
        },
        { type: 'p', text: 'Tvary bez volných párů jsou nejpravidelnější. Otoč si modely a najdi na nich úhly z tabulky:' },
        {
          type: 'molecule',
          molecules: ['BeCl2', 'BF3', 'CH4'],
          labels: ['$BeCl2$: lineární, 180°', '$BF3$: trojúhelník, 120°', '$CH4$: tetraedr, 109,5°'],
          caption: 'Tři tvary bez volných párů. Chlorid beryllnatý má tvar přímky v plynném stavu; pevný tvoří dlouhé řetězce.',
        },
        { type: 'p', text: 'Pozor, oblast není totéž co vazba: dvojná vazba se počítá jako jedna oblast. Proč na tom záleží, ukáže dvojice tříatomových molekul, které na papíře vypadají podobně:' },
        {
          type: 'example',
          title: 'Proč je $CO2$ rovný a $SO2$ zalomený',
          problem: 'Urči tvar molekul $CO2$ a $SO2$.',
          steps: [
            '$CO2$: uhlík má dvě dvojné vazby a žádný volný pár. Dvojná vazba je jedna oblast, oblasti jsou tedy 2.',
            'Dvě oblasti míří na opačné strany: $CO2$ je lineární, 180°.',
            '$SO2$: síra má dvě vazby ke kyslíkům (rezonance z minulé lekce) a navíc jeden volný pár. Oblasti jsou 3.',
            'Tři oblasti tvoří trojúhelník, ale jeden roh zabírá volný pár. Atomy tvoří „V“.',
          ],
          answer: '$CO2$ je lineární (180°), $SO2$ lomený (asi 119°)',
        },
        { type: 'p', text: 'Celý rozdíl dělá jediný volný pár na síře. Na modelech je vidět na první pohled:' },
        {
          type: 'molecule',
          molecules: ['CO2', 'SO2'],
          labels: ['$CO2$: lineární', '$SO2$: lomená'],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Uspořádání oblastí není tvar molekuly',
          text: 'Ve vodě míří čtyři oblasti do rohů čtyřstěnu, ale molekula tetraedrická není: atomy tvoří lomený tvar. Tvar vždy pojmenuj jen podle atomů.',
        },
        { type: 'p', text: 'Pro dvě až čtyři oblasti teď určíš tvar téměř každé molekuly. Co ale prvky, které mají kolem sebe víc než oktet?' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k molekule její tvar.',
            pairs: [
              ['$CO2$', 'lineární'],
              ['$BF3$', 'trojúhelníková'],
              ['$CH4$', 'tetraedrická'],
              ['$NH3$', 'trigonální pyramida'],
              ['$H2O$', 'lomená'],
            ],
            explain: 'Rozhoduje počet elektronových oblastí a volných párů: $NH3$ má 3 vazby a 1 volný pár, $H2O$ 2 vazby a 2 volné páry.',
          },
        },
      ],
    },
    {
      title: 'Pět a šest oblastí',
      icon: 'crystal',
      blocks: [
        {
          type: 'p',
          text: 'V minulé lekci jsi poznal/a výjimky z oktetu $PCl5$ a $SF6$. Prvky 3. a vyšší periody mohou mít rozšířený oktet, a tedy 5 nebo 6 elektronových oblastí. Pět oblastí tvoří **trigonální bipyramidu**: tři vazby leží v rovině „rovníku“ se 120° a dvě míří nahoru a dolů, k rovníku kolmo (90°). Šest oblastí tvoří **oktaedr** (osmistěn) a všechny sousední úhly jsou 90°. Prohlédni si oba tvary na modelech:',
        },
        {
          type: 'molecule',
          molecules: ['PCl5', 'SF6', 'XeF4'],
          labels: ['$PCl5$: trigonální bipyramida', '$SF6$: oktaedr', '$XeF4$: čtvercová'],
          caption: 'Otoč si je a najdi úhly 90° a 120°. Ve $XeF4$ jsou nad a pod rovinou čtverce dva volné páry xenonu, které model neukazuje.',
        },
        { type: 'p', text: 'Stejně jako u čtyř oblastí mohou i tady některé rohy obsadit volné páry. Vznikne tak celá rodina tvarů:' },
        {
          type: 'table',
          headers: ['Oblasti', 'Vazby + volné páry', 'Tvar', 'Úhly', 'Příklad'],
          rows: [
            ['5', '5 + 0', '**trigonální bipyramida**', '90° a 120°', '$PCl5$'],
            ['5', '4 + 1', 'houpačka', 'o něco menší než 90° a 120°', '$SF4$'],
            ['5', '3 + 2', 'tvar T', 'asi 90°', '$ClF3$'],
            ['6', '6 + 0', '**oktaedrická**', '90°', '$SF6$'],
            ['6', '5 + 1', 'čtvercová pyramida', 'asi 90°', '$BrF5$'],
            ['6', '4 + 2', '**čtvercová** (rovinná)', '90°', '$XeF4$'],
          ],
          caption: 'Tučně jsou tvary, které potřebuješ znát. Ostatní řádky ukazují, že stejná pravidla fungují i dál.',
        },
        {
          type: 'p',
          text: 'Kam se volné páry posadí? V bipyramidě do roviny rovníku, kde mají víc místa. V oktaedru jsou si všechny rohy rovné, ale ==dva volné páry se postaví naproti sobě==, co nejdál od sebe. Proto je $XeF4$ plochý čtverec. Ověřme si to výpočtem:',
        },
        {
          type: 'example',
          title: 'Tvar tetrafluoridu xenonu',
          problem: 'Urči tvar molekuly $XeF4$.',
          steps: [
            'Elektrony: 8 (Xe) + 4 · 7 (F) = 36, tedy 18 párů.',
            'Čtyři vazby $Xe–F$ spotřebují 4 páry, každý fluor dostane 3 volné páry (12 párů). Zbývají 2 páry a patří xenonu.',
            'Xenon má 4 vazby + 2 volné páry = 6 oblastí, míří do rohů oktaedru.',
            'Volné páry obsadí protilehlé rohy (nahoře a dole), čtyři fluory leží v jedné rovině.',
          ],
          answer: 'čtvercová (rovinná) molekula s úhly 90°',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Vzácný plyn, a přece sloučenina',
          text: 'Ještě v roce 1961 stálo v učebnicích, že vzácné plyny žádné sloučeniny netvoří. O rok později připravil Neil Bartlett první sloučeninu xenonu a brzy nato vznikl i $XeF4$. Fluorid sírový $SF6$ zase izoluje vysokonapěťové vypínače v rozvodnách, je ale nejsilnějším známým skleníkovým plynem.',
        },
        { type: 'p', text: 'Tvar teď určíš pro dvě až šest oblastí. Zbývá vysvětlit, jak mohou orbitaly atomu mířit právě do těchto směrů – na to je hybridizace.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaký tvar má molekula $SF6$?',
            options: ['oktaedrická', 'trigonální bipyramida', 'čtvercová', 'šestiúhelník v rovině'],
            answer: 0,
            explain: 'Síra má 6 vazeb a žádný volný pár. Šest oblastí míří do rohů oktaedru a všechny sousední úhly $F–S–F$ jsou 90°.',
          },
        },
      ],
    },
    {
      title: 'Hybridizace orbitalů',
      icon: 'atom',
      blocks: [
        {
          type: 'p',
          text: 'VSEPR předpoví úhly, ale neříká nic o orbitalech, ze kterých vazby vznikají. A tady narazíme na rozpor. Uhlík má konfiguraci 1s^{2} 2s^{2} 2p^{2}: jen dva nepárové elektrony a orbitaly p svírají 90°. Methan přitom má čtyři úplně stejné vazby s úhly 109,5°. Rozpor vysvětluje **hybridizace**: orbitaly atomu se před vznikem vazeb „smíchají“ na nové, stejné hybridní orbitaly, které míří tam, kam je potřeba. U methanu to proběhne ve čtyřech krocích:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'electron', title: 'Excitace', text: 'jeden elektron 2s přeskočí do prázdného 2p: 2s^{1} 2p^{3}, uhlík má 4 nepárové elektrony' },
            { icon: 'mixture', title: 'Smíchání', text: 'orbital 2s a tři 2p dají čtyři stejné hybridní orbitaly sp³' },
            { icon: 'atom', title: 'Natočení', text: 'orbitaly sp³ se od sebe vzdálí do rohů čtyřstěnu, 109,5°' },
            { icon: 'bond', title: 'Vazby σ', text: 'každý orbital sp³ se překryje s orbitalem 1s vodíku' },
          ],
          caption: 'Jak vzniknou čtyři stejné vazby v methanu.',
        },
        { type: 'p', text: 'Uhlík ale nemusí smíchat všechny tři orbitaly p. Podle toho, kolik jich do míchání vstoupí, vznikne jeden ze tří typů hybridizace:' },
        {
          type: 'diagram',
          id: 'hybridization',
          caption: 'Hybridizace uhlíku: sp³ (čtyři orbitaly do čtyřstěnu, methan), sp² (tři orbitaly v rovině se 120° a kolmý nehybridizovaný orbital p, ethen) a sp (dva orbitaly v přímce a dva kolmé orbitaly p, ethyn).',
        },
        { type: 'p', text: 'Všimni si, že hybridní orbitaly míří přesně pod úhly, které předpověděl VSEPR. Tabulka proto spojuje obě teorie:' },
        {
          type: 'table',
          headers: ['Oblasti', 'Hybridizace', 'Uspořádání', 'Úhel', 'Příklady'],
          rows: [
            ['2', 'sp', 'lineární', '180°', '$BeCl2$, $CO2$, $C2H2$'],
            ['3', 'sp²', 'trojúhelník', '120°', '$BF3$, $C2H4$'],
            ['4', 'sp³', 'tetraedr', '109,5°', '$CH4$, $NH3$, $H2O$'],
            ['5', 'sp³d', 'trigonální bipyramida', '90° a 120°', '$PCl5$'],
            ['6', 'sp³d²', 'oktaedr', '90°', '$SF6$, $XeF4$'],
          ],
          caption: 'Hybridizace sp³d a sp³d² ber jen jako zmínku: je to zjednodušený popis a moderní výpočty ukazují, že se orbitaly d na vazbách podílejí málo.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Počet elektronových oblastí = počet hybridních orbitalů.== Stačí spočítat oblasti: 2 znamenají sp, 3 sp², 4 sp³. Hybridní orbitaly tvoří vazby σ a nesou volné páry; vazby π vznikají z orbitalů p, které se hybridizace neúčastnily.',
        },
        { type: 'p', text: 'Z počtu oblastí tedy určíš hybridizaci. Nejlépe je to vidět na třech nejjednodušších uhlovodících se dvěma uhlíky.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jakou hybridizaci má bor v molekule $BF3$?',
            options: ['sp²', 'sp', 'sp³', 'sp³d'],
            answer: 0,
            explain: 'Bor má 3 vazby a žádný volný pár, tedy 3 elektronové oblasti. Tři hybridní orbitaly znamenají sp², rovinný trojúhelník se 120°.',
          },
        },
      ],
    },
    {
      title: 'Ethan, ethen a ethyn: σ a π v praxi',
      icon: 'bond',
      blocks: [
        {
          type: 'p',
          text: 'Uhlík umí všechny tři hybridizace, a proto je organická chemie tak pestrá (úroveň 8). V **ethanu** má každý uhlík hybridizaci sp³ a atomy spojuje jednoduchá vazba σ. V **ethenu** je uhlík sp²: tři hybridní orbitaly tvoří vazby σ a zbylé orbitaly p se překryjí bokem nad a pod rovinou molekuly ve vazbu π. V **ethynu** je uhlík sp a dva zbylé orbitaly p dají dvě vazby π. Porovnej tvary všech tří molekul:',
        },
        {
          type: 'molecule',
          molecules: ['C2H6', 'C2H4', 'C2H2'],
          labels: ['ethan: sp³, 109,5°', 'ethen: sp², 120°', 'ethyn: sp, 180°'],
          caption: 'Ethan je prostorový, ethen celý leží v jedné rovině a ethyn je rovný jako tyčka.',
        },
        { type: 'p', text: 'Tvar je jen jedna stránka věci. Z hybridizace plyne i to, kolik vazeb σ a π molekula má:' },
        {
          type: 'table',
          headers: ['Molekula', 'Hybridizace C', 'Vazba C–C', 'Vazby σ', 'Vazby π', 'Tvar'],
          rows: [
            ['ethan $C2H6$', 'sp³', 'jednoduchá', '7', '0', 'tetraedr kolem každého C'],
            ['ethen $C2H4$', 'sp²', 'dvojná', '5', '1', 'rovinný'],
            ['ethyn $C2H2$', 'sp', 'trojná', '3', '2', 'lineární'],
          ],
          caption: 'Vazby σ: všechny vazby $C–H$ plus jedna vazba σ mezi uhlíky.',
        },
        { type: 'p', text: 'Uhlíky v jedné molekule nemusí mít stejnou hybridizaci. Pak ji určíš u každého uhlíku zvlášť, podle počtu jeho oblastí:' },
        {
          type: 'example',
          title: 'Propen',
          problem: 'Urči hybridizaci všech uhlíků v propenu $CH2=CH–CH3$ a spočítej vazby σ a π.',
          steps: [
            'Uhlík $CH2=$: 3 oblasti (dvě vazby $C–H$ a dvojná vazba), tedy sp².',
            'Prostřední uhlík $=CH–$: také 3 oblasti, sp².',
            'Uhlík $–CH3$: 4 jednoduché vazby, tedy sp³.',
            'Vazby σ: 6 vazeb $C–H$ + 2 vazby $C–C$ = 8. Vazba π je jen jedna, ve dvojné vazbě.',
          ],
          answer: 'sp², sp², sp³; 8 vazeb σ a 1 vazba π',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Dvojná vazba se neotáčí',
          text: 'Kolem jednoduché vazby σ se obě poloviny ethanu volně otáčejí. U ethenu by otočení roztrhlo boční překryv vazby π, a tak je molekula tuhá a plochá. Díky tomu existují izomery *cis* a *trans* (úroveň 8). A ještě jedna perlička: ethen je rostlinný hormon, který urychluje zrání ovoce. Proto banány v sáčku s jablkem zežloutnou rychleji.',
        },
        { type: 'p', text: 'Hybridizace tedy spojuje tvar molekuly s vazbami σ a π. Zbývá poslední otázka z úvodu: proč je voda polární a $CO2$ ne?' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik vazeb σ obsahuje molekula ethenu $C2H4$?',
            answer: 5,
            explain: 'Čtyři vazby $C–H$ jsou σ a dvojná vazba $C=C$ má jednu σ a jednu π. Celkem 5 vazeb σ a 1 vazba π.',
          },
        },
      ],
    },
    {
      title: 'Polární vazba a polární molekula',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Odpověď spojuje polaritu vazeb z první lekce s tvarem molekuly. Molekula je **polární**, když má jeden konec trochu záporný a druhý trochu kladný. Každá polární vazba je jako malá šipka (dipól) mířící k elektronegativnějšímu atomu. ==Šipky se sčítají podle tvaru molekuly: když se díky souměrnosti vyruší, molekula je nepolární.== Jak moc je molekula polární, vyjadřuje jedno číslo:',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'dipólový moment μ', def: 'míra polarity: součin částečného náboje a vzdálenosti nábojů, μ = q · d. Udává se v jednotkách debye (D), 1 D ≈ 3,34 · 10^{−30} C·m' },
            { term: 'nepolární molekula', def: 'molekula s dipólovým momentem 0: nepolární vazby, nebo souměrný tvar' },
          ],
        },
        { type: 'p', text: 'Jak se šipky sčítají, ukazuje chlorovodík z první lekce a dvojice z úvodu, voda a $CO2$:' },
        {
          type: 'diagram',
          id: 'polarity',
          caption: 'Dipóly vazeb se sčítají jako šipky. V $HCl$ míří dipól k chloru. V lomené $H2O$ míří oba dipóly ke kyslíku a sečtou se: voda je polární. V lineárním $CO2$ táhnou obě polární vazby stejně silně na opačné strany a vyruší se: molekula je nepolární.',
        },
        { type: 'p', text: 'Stejné pravidlo platí pro všechny tvary, které už znáš. Porovnej tvar každé molekuly s jejím dipólovým momentem:' },
        {
          type: 'table',
          headers: ['Molekula', 'Tvar', 'μ (D)', 'Polární?'],
          rows: [
            ['$CO2$', 'lineární', '0', 'ne'],
            ['$H2O$', 'lomená', '1,85', 'ano'],
            ['$BF3$', 'trojúhelníková', '0', 'ne'],
            ['$NH3$', 'trigonální pyramida', '1,47', 'ano'],
            ['$CCl4$', 'tetraedrická', '0', 'ne'],
            ['$CH2Cl2$', 'tetraedrická, různí sousedé', '1,60', 'ano'],
          ],
          caption: 'Dipólové momenty několika molekul.',
        },
        { type: 'p', text: 'Nejzajímavější je poslední dvojice: obě molekuly mají tvar čtyřstěnu, a přesto se v polaritě liší. Prohlédni si je:' },
        {
          type: 'molecule',
          molecules: ['CCl4', 'CH2Cl2'],
          labels: ['$CCl4$: μ = 0', '$CH2Cl2$: μ = 1,6 D'],
          caption: 'Tetrachlormethan a dichlormethan: oba mají tvar čtyřstěnu, liší se souměrností.',
        },
        { type: 'p', text: 'Proč tomu tak je, zjistíš, když dipóly vazeb sečteš krok za krokem:' },
        {
          type: 'example',
          title: '$CCl4$ proti $CH2Cl2$',
          problem: 'Proč je tetrachlormethan $CCl4$ nepolární, ale dichlormethan $CH2Cl2$ polární?',
          steps: [
            'Vazba $C–Cl$ je polární (ΔX = 3,16 − 2,55 = 0,61), vazba $C–H$ téměř nepolární (ΔX = 0,35).',
            'V $CCl4$ míří čtyři stejné dipóly do rohů pravidelného čtyřstěnu a navzájem se vyruší: μ = 0.',
            'V $CH2Cl2$ táhnou dva dipóly $C–Cl$ na jednu stranu a na druhé straně jsou jen slabě polární vazby $C–H$. Dipóly se nevyruší.',
          ],
          answer: '$CCl4$ je souměrný a nepolární, $CH2Cl2$ nesouměrný a polární (μ = 1,6 D)',
        },
        { type: 'p', text: 'Pozor, tady se chybuje nejčastěji: polární vazba ještě neznamená polární molekulu. Rozdíl shrnuje srovnání:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Polární vazba',
              icon: 'bond',
              tone: 'a',
              points: ['vlastnost jedné vazby', 'rozhoduje jen ΔX (0,4–1,7)', 'např. $C=O$, $O–H$, $C–Cl$'],
            },
            {
              title: 'Polární molekula',
              icon: 'molecule',
              tone: 'b',
              points: ['vlastnost celé molekuly', 'rozhoduje ΔX i tvar', 'dipóly vazeb se nesmí vyrušit: $H2O$, $NH3$, $CH2Cl2$'],
            },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Rychlý test',
          text: 'Má centrální atom volné páry (jako $H2O$, $NH3$), nebo různé sousedy (jako $CH2Cl2$)? Pak je molekula s polárními vazbami skoro jistě polární (výjimkou jsou souměrné tvary jako čtvercový $XeF4$). Souměrné molekuly bez volných párů se stejnými sousedy ($CO2$, $BF3$, $CH4$, $CCl4$, $SF6$) jsou nepolární.',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Proč mikrovlnka ohřeje polévku',
          text: 'Mikrovlny rozkmitají polární molekuly vody: dipóly se v rychle se měnícím elektrickém poli neustále natáčejí a třou o sousedy. Suchý talíř bez vody se proto ohřívá mnohem pomaleji než jídlo.',
        },
        { type: 'p', text: 'Z tvaru a polarity vazeb teď poznáš, jestli je molekula polární. Zatím jsme ale zkoumali jen molekuly; v příští lekci přijdou na řadu látky bez molekul – iontové krystaly a kovy.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které molekuly jsou polární?',
            options: ['$H2O$', '$CO2$', '$NH3$', '$CH4$', '$CH2Cl2$'],
            answers: [0, 2, 4],
            explain: '$H2O$ (lomená), $NH3$ (pyramida) a $CH2Cl2$ (různí sousedé) mají nesouměrně rozložený náboj. $CO2$ a $CH4$ jsou souměrné, dipóly jejich vazeb se vyruší.',
          },
        },
      ],
    },
  ],
  summary: [
    'Podle modelu VSEPR se elektronové oblasti kolem centrálního atomu odpuzují a zaujmou co nejvzdálenější polohy; násobná vazba je jedna oblast.',
    'Dvě oblasti dávají přímku (180°), tři trojúhelník (120°), čtyři tetraedr (109,5°), pět trigonální bipyramidu (90° a 120°) a šest oktaedr (90°).',
    'Volné páry odpuzují silněji než vazebné, proto má $NH3$ úhel 107° a $H2O$ 104,5°; tvar pojmenujeme jen podle atomů, a tak je $XeF4$ čtvercový.',
    'Počet oblastí určuje hybridizaci: 2 sp, 3 sp², 4 sp³ (5 sp³d, 6 sp³d²).',
    'Uhlík v ethanu je sp³, v ethenu sp² s jednou vazbou π a v ethynu sp se dvěma vazbami π.',
    'Molekula je polární, když se dipóly vazeb nevyruší: $H2O$ a $CH2Cl2$ jsou polární, $CO2$ a $CCl4$ nepolární.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Každá molekula, která obsahuje polární vazby, je polární.',
      answer: false,
      explain: 'Rozhoduje i tvar. V souměrných molekulách jako $CO2$ nebo $CCl4$ se dipóly vazeb vyruší a molekula je nepolární.',
    },
    {
      kind: 'order',
      q: 'Seřaď molekuly podle vazebného úhlu od nejmenšího po největší.',
      items: ['$H2O$', '$NH3$', '$CH4$', '$BF3$', '$CO2$'],
      explain: '$H2O$ 104,5° < $NH3$ 107° < $CH4$ 109,5° < $BF3$ 120° < $CO2$ 180°. Čím víc volných párů, tím víc úhel stlačí.',
    },
    {
      kind: 'text',
      q: 'Jakou hybridizaci mají atomy uhlíku v ethynu $C2H2$?',
      accept: ['sp'],
      placeholder: 'např. sp³',
      explain: 'Každý uhlík v ethynu má 2 elektronové oblasti (vazbu $C–H$ a trojnou vazbu), tedy hybridizaci sp a lineární tvar.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k molekule její tvar.',
      pairs: [
        ['$BeCl2$', 'lineární'],
        ['$PCl5$', 'trigonální bipyramida'],
        ['$SF6$', 'oktaedrická'],
        ['$XeF4$', 'čtvercová'],
      ],
      explain: '$BeCl2$ má 2 oblasti, $PCl5$ 5, $SF6$ 6 bez volných párů. $XeF4$ má 6 oblastí, ale dvě z nich jsou volné páry naproti sobě.',
    },
    {
      kind: 'choice',
      q: 'Proč je molekula $CO2$ nepolární, přestože vazby $C=O$ polární jsou?',
      options: [
        'Je lineární, takže se dipóly obou vazeb navzájem vyruší.',
        'Uhlík a kyslík mají stejnou elektronegativitu.',
        'Dvojné vazby nemohou být polární.',
        'Oxid uhličitý je iontová sloučenina.',
      ],
      answer: 0,
      explain: 'ΔX mezi C a O je 0,89, vazby jsou tedy polární. Protože ale míří přesně na opačné strany, jejich účinky se sečtou na nulu.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých molekulách má centrální atom hybridizaci sp³?',
      options: ['$CH4$', '$NH3$', '$H2O$', '$BF3$', '$CO2$'],
      answers: [0, 1, 2],
      explain: '$CH4$, $NH3$ i $H2O$ mají 4 elektronové oblasti (vazby + volné páry), tedy sp³. $BF3$ má 3 oblasti (sp²) a $CO2$ 2 (sp).',
    },
    {
      kind: 'number',
      q: 'Kolik vazeb π obsahuje molekula ethynu $C2H2$?',
      answer: 2,
      explain: 'Trojná vazba $C≡C$ se skládá z jedné vazby σ a dvou vazeb π. Vazby $C–H$ jsou jen σ.',
    },
    {
      kind: 'tf',
      q: 'Volný elektronový pár zabírá kolem centrálního atomu víc místa než vazebný pár.',
      answer: true,
      explain: 'Volný pár drží jen jedno jádro, je blíž centrálnímu atomu a rozprostře se víc. Proto odpuzuje silněji a vazebné úhly zmenšuje.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-3 Iontová a kovová vazba
// ─────────────────────────────────────────────────────────────
const l33: Lesson = {
  id: 'l3-3',
  title: 'Iontová a kovová vazba',
  goals: [
    'Popsat vznik iontů a iontové vazby a sestavit vzorec iontové sloučeniny z nábojů iontů',
    'Vysvětlit vlastnosti iontových látek krystalovou mřížkou a mřížkovou energií',
    'Vysvětlit vodivost, kujnost a lesk kovů i vlastnosti slitin modelem elektronového plynu',
    'Porovnat molekulové látky, kovalentní krystaly, iontové a kovové látky a zařadit látku podle vlastností',
  ],
  hook: 'Kuchyňská sůl taje až při 801 °C, ale ve vodě se rozpustí za pár vteřin. Měděný drát ohneš prsty, krystal soli se rozpadne na kousky. Kdo za tím stojí? Vazby, které nejsou kovalentní.',
  sections: [
    {
      title: 'Od atomů k iontům',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Minulé dvě lekce patřily sdílení elektronů. Teď se vrátíme k druhé cestě z první lekce: při velkém rozdílu elektronegativit (ΔX ≥ 1,7), typicky mezi kovem a nekovem, atomy elektrony **předávají**. Kov odevzdá valenční elektrony a stane se **kationtem**, nekov je přijme a stane se **aniontem**. Pro sodík a chlor to zapíšeš takto:',
        },
        { type: 'formula', text: '$Na -> Na^+ + e^-$ a $Cl + e^- -> Cl^-$', caption: 'sodík elektron ztrácí, chlor ho získává' },
        { type: 'p', text: 'Proč odevzdá sodík právě jeden elektron? Podívej se, jak vypadá jeho kation, a porovnej ho se vzácným plynem:' },
        {
          type: 'diagram',
          id: 'bohr',
          props: { z: 11, ion: 1, label: 'Na⁺' },
          caption: 'Kation $Na^+$: 11 protonů a 10 elektronů (2, 8), stejné uspořádání jako neon.',
        },
        { type: 'p', text: 'Chlor naopak jeden elektron přijal a i on skončil s oktetem:' },
        {
          type: 'diagram',
          id: 'bohr',
          props: { z: 17, ion: -1, label: 'Cl⁻' },
          caption: 'Anion $Cl^-$: 17 protonů a 18 elektronů (2, 8, 8), stejné uspořádání jako argon.',
        },
        { type: 'p', text: 'Oba ionty mají tedy uspořádání vzácného plynu. Ve skutečnosti probíhá taková výměna při reakci sodíku s chlorem:' },
        {
          type: 'reaction',
          equation: '2Na + Cl2 -> 2NaCl',
          caption: 'Sodík hoří v chloru: každý atom $Na$ předá elektron atomu $Cl$ a vznikne chlorid sodný. Prudkou reakci předvádějí chemici jen v digestoři.',
        },
        {
          type: 'p',
          text: 'Vzniklé ionty se pak navzájem drží. ==**Iontová vazba** je elektrostatické přitahování opačně nabitých iontů.== Na rozdíl od kovalentní vazby nemá směr: každý ion přitahuje všechny opačně nabité sousedy kolem sebe. Kolik elektronů atom odevzdá nebo přijme, poznáš podle jeho skupiny:',
        },
        {
          type: 'table',
          headers: ['Skupina', 'Změna', 'Náboj iontu', 'Příklady'],
          rows: [
            ['1', 'odevzdá 1 e⁻', '1+', '$Li^+$, $Na^+$, $K^+$'],
            ['2', 'odevzdá 2 e⁻', '2+', '$Mg^{2+}$, $Ca^{2+}$, $Ba^{2+}$'],
            ['13', 'odevzdá 3 e⁻', '3+', '$Al^{3+}$'],
            ['15', 'přijme 3 e⁻', '3−', '$N^{3-}$'],
            ['16', 'přijme 2 e⁻', '2−', '$O^{2-}$, $S^{2-}$'],
            ['17', 'přijme 1 e⁻', '1−', '$F^-$, $Cl^-$, $Br^-$, $I^-$'],
          ],
          caption: 'Náboje iontů hlavních skupin odpovídají tomu, kolik elektronů chybí nebo přebývá do oktetu.',
        },
        { type: 'p', text: 'Z tabulky tedy vyčteš náboj iontu. Jak z nábojů složit vzorec celé sloučeniny, ukáže další oddíl.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik elektronů má kation hořečnatý $Mg^{2+}$? (Z = 12)',
            answer: 10,
            explain: 'Atom hořčíku má 12 elektronů. Kation $Mg^{2+}$ dva odevzdal, zbývá mu 10 (2, 8), stejně jako neonu.',
          },
        },
      ],
    },
    {
      title: 'Vzorec iontové sloučeniny',
      icon: 'balance-scale',
      blocks: [
        {
          type: 'p',
          text: 'Když víš, jaké náboje ionty nesou, sestavíš vzorec jednoduchou úvahou. Iontová sloučenina je jako celek **elektricky neutrální**: kladných nábojů je přesně tolik jako záporných. Vzorec udává nejmenší celočíselný poměr iontů. Nejdřív jednoduchý případ:',
        },
        {
          type: 'example',
          title: 'Chlorid vápenatý',
          problem: 'Jaký vzorec má sloučenina iontů $Ca^{2+}$ a $Cl^-$?',
          steps: ['Jeden ion $Ca^{2+}$ nese náboj 2+.', 'Jeden ion $Cl^-$ nese náboj 1−, na vyrovnání jsou potřeba dva.', '2+ a 2 · (1−) dává dohromady 0.'],
          answer: '$CaCl2$',
        },
        { type: 'p', text: 'Stejný poměr 1 : 2 je vidět i v rovnici, kterou chlorid vápenatý vzniká z prvků:' },
        {
          type: 'reaction',
          equation: 'Ca + Cl2 -> CaCl2',
          caption: 'Jeden atom vápníku odevzdá dva elektrony, každý ze dvou atomů chloru přijme jeden.',
        },
        { type: 'p', text: 'Složitější je to, když se náboje navzájem nedělí, třeba 3+ a 2−. Pak pomůže nejmenší společný násobek:' },
        {
          type: 'example',
          title: 'Oxid hlinitý',
          problem: 'Jaký vzorec má sloučenina iontů $Al^{3+}$ a $O^{2-}$?',
          steps: ['Nejmenší společný násobek 3 a 2 je 6.', 'Kladný náboj 6+ dají 2 ionty $Al^{3+}$.', 'Záporný náboj 6− dají 3 ionty $O^{2-}$.'],
          answer: '$Al2O3$',
        },
        { type: 'p', text: 'I tady platí, že kolik elektronů hliník odevzdá, tolik jich kyslík přijme. V rovnici to přesně sedí:' },
        {
          type: 'reaction',
          equation: '4Al + 3O2 -> 2Al2O3',
          caption: 'Hliník na vzduchu: na každé 4 atomy hliníku (12 odevzdaných elektronů) připadá 6 atomů kyslíku (12 přijatých).',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Všimni si, že v $Al2O3$ se čísla nábojů „překřížila“: trojka od hliníku je u kyslíku a dvojka od kyslíku u hliníku. Tomuto triku se říká křížové pravidlo a pořádně ho rozebereme v lekci o oxidačním čísle.',
        },
        { type: 'game', gameId: 'ion-builder', text: 'Poskládej z kationtů a aniontů neutrální sloučeninu. Kolik iontů $Cl^-$ potřebuje jeden $Fe^{3+}$?' },
        { type: 'p', text: 'Vzorec tedy udává jen poměr iontů. Jak ty ionty doopravdy leží v pevné látce, se podíváme teď.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec sloučeniny iontů $Mg^{2+}$ a $N^{3-}$.',
            accept: ['Mg3N2'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: 'Nejmenší společný násobek 2 a 3 je 6: tři ionty $Mg^{2+}$ (6+) a dva ionty $N^{3-}$ (6−) dávají $Mg3N2$.',
          },
        },
      ],
    },
    {
      title: 'Iontový krystal',
      icon: 'crystal',
      blocks: [
        {
          type: 'p',
          text: 'Vzorec $NaCl$ říká poměr 1 : 1, ale ne, jak ionty v soli leží. V pevné látce se uspořádají do pravidelné **krystalové mřížky**. V chloridu sodném je každý ion $Na^+$ obklopen šesti ionty $Cl^-$ a každý $Cl^-$ šesti ionty $Na^+$. Prohlédni si mřížku ve 3D:',
        },
        {
          type: 'diagram',
          id: 'ionic-lattice',
          caption: 'Prostorová mřížka $NaCl$: malé kationty $Na^+$ a velké anionty $Cl^-$ se střídají ve všech třech směrech. Zvýrazněné hrany ohraničují elementární buňku. Tažením mřížkou otočíš.',
        },
        {
          type: 'p',
          text: '==V iontové látce nejsou žádné molekuly.== Vzorec $NaCl$ jen říká, že sodných a chloridových iontů je v krystalu stejně. Nejmenší skupině iontů podle vzorce říkáme **vzorcová jednotka**. Rozdíl proti krystalu z molekul ukazuje částicový model:',
        },
        {
          type: 'particles',
          boxes: [
            {
              label: 'Iontový krystal $NaCl$',
              items: [
                { species: 'Na^+', count: 8 },
                { species: 'Cl^-', count: 8 },
              ],
              state: 'solid',
              note: 'jen ionty v poměru 1 : 1, žádné molekuly',
            },
            {
              label: 'Molekulová látka: suchý led $CO2$',
              items: [{ species: 'CO2', count: 8 }],
              state: 'solid',
              note: 'samostatné molekuly',
            },
          ],
          caption: 'Iontová mřížka proti krystalu z molekul.',
        },
        { type: 'p', text: 'Počet sousedů, kterými je každý ion obklopen, má v chemii krystalů vlastní jméno:' },
        {
          type: 'keyterms',
          items: [
            { term: 'koordinační číslo', def: 'počet nejbližších sousedů částice v krystalu; v $NaCl$ je 6' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pokus doma',
          text: 'Rozpusť ve sklenici teplé vody tolik soli, kolik se jí rozpustí, a nech ji pár dní odpařovat na parapetu. Pod lupou uvidíš drobné krychličky: tvar krystalu prozrazuje krychlovou mřížku $NaCl$.',
        },
        { type: 'p', text: 'Teď víš, jak je iontový krystal postavený. Právě z této stavby plynou vlastnosti, kterými jsou iontové látky typické.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Krystal kuchyňské soli je složen z molekul $NaCl$.',
            answer: false,
            explain: 'Chlorid sodný je iontový krystal z iontů $Na^+$ a $Cl^-$. Vzorec vyjadřuje jen jejich poměr 1 : 1.',
          },
        },
      ],
    },
    {
      title: 'Vlastnosti iontových látek',
      icon: 'salt',
      blocks: [
        { type: 'p', text: 'Z úvodu víš, že sůl taje až při 801 °C a v ruce se rozpadne na kousky. Tyto vlastnosti a několik dalších vysvětluje mřížka z minulého oddílu:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'thermometer', title: 'Vysoké teploty tání', text: 'přitažlivé síly působí mezi všemi ionty v krystalu: $NaCl$ taje při 801 °C, $MgO$ až při 2852 °C' },
            { icon: 'mortar', title: 'Tvrdé, ale křehké', text: 'úderem krystal nepromáčkneš, ale rozštípneš' },
            { icon: 'plug', title: 'Vedou proud jen v tavenině nebo v roztoku' },
            { icon: 'drop', title: 'Často se rozpouštějí ve vodě', text: 'ale zdaleka ne všechny' },
          ],
        },
        { type: 'p', text: 'Nejzajímavější je třetí vlastnost. Elektrický proud je pohyb nábojů, a ionty se mohou pohybovat, jen když se mřížka rozpadne – roztavením nebo rozpuštěním:' },
        {
          type: 'particles',
          boxes: [
            {
              label: 'Pevný $NaCl$',
              items: [
                { species: 'Na^+', count: 6 },
                { species: 'Cl^-', count: 6 },
              ],
              state: 'solid',
              note: 'ionty na místě: proud nevede',
            },
            {
              label: 'Tavenina (nad 801 °C)',
              items: [
                { species: 'Na^+', count: 6 },
                { species: 'Cl^-', count: 6 },
              ],
              state: 'liquid',
              note: 'ionty se pohybují: vede',
            },
            {
              label: 'Roztok ve vodě',
              items: [
                { species: 'Na^+', count: 3 },
                { species: 'Cl^-', count: 3 },
                { species: 'H2O', count: 10 },
              ],
              state: 'solution',
              note: 'ionty se pohybují: vede',
            },
          ],
          caption: 'Kdy iontová látka vede elektrický proud.',
        },
        {
          type: 'p',
          text: 'Teploty tání iontových látek se ale hodně liší. Jak pevně drží ionty v krystalu pohromadě, vyjadřuje **mřížková energie**: energie, která se uvolní, když se z volných iontů v plynném stavu poskládá krystal. Stejně velkou energii je potřeba dodat, abychom krystal rozebrali zpátky na volné ionty. Porovnej ji u několika iontových látek:',
        },
        {
          type: 'table',
          headers: ['Látka', 'Náboje iontů', 'Mřížková energie (kJ/mol)', 'Teplota tání'],
          rows: [
            ['$NaF$', '1+ a 1−', '923', '996 °C'],
            ['$NaCl$', '1+ a 1−', '786', '801 °C'],
            ['$NaI$', '1+ a 1−', '704', '661 °C'],
            ['$CaO$', '2+ a 2−', '3401', '2613 °C'],
            ['$MgO$', '2+ a 2−', '3791', '2852 °C'],
          ],
          caption: 'Od fluoridu k jodidu roste velikost aniontu a mřížková energie klesá. Dvojnásobné náboje ji zvýší zhruba čtyř- až pětinásobně.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '==Mřížková energie roste s nábojem iontů a klesá s jejich velikostí.== Větší náboje se přitahují silněji, malé ionty se k sobě dostanou blíž. Čím větší mřížková energie, tím vyšší teplota tání a tvrdší krystal. Proto se z $MgO$ vyrábějí žáruvzdorné vyzdívky pecí.',
        },
        { type: 'p', text: 'Pravidlo si vyzkoušej na třech látkách, z nichž dvě mají stejné náboje iontů:' },
        {
          type: 'example',
          title: 'Seřaď podle teploty tání',
          problem: 'Seřaď $KCl$, $NaCl$ a $MgO$ podle teploty tání od nejnižší.',
          steps: [
            '$MgO$ má ionty s náboji 2+ a 2−, ostatní jen 1+ a 1−. Jeho mřížková energie je daleko největší.',
            '$KCl$ a $NaCl$ mají stejné náboje i stejný anion. Kation $K^+$ je ale větší než $Na^+$ (má o vrstvu víc), ionty jsou dál od sebe.',
            'Mřížková energie $KCl$ je proto menší než $NaCl$.',
          ],
          answer: '$KCl$ (770 °C) < $NaCl$ (801 °C) < $MgO$ (2852 °C)',
        },
        { type: 'p', text: 'Zbývá vysvětlit křehkost z úvodu. Představ si, že úder posune jednu vrstvu iontů o kousek stranou:' },
        {
          type: 'structure',
          art: art(' + − + − +        + − + − +', ' − + − + −   →      − + − + −', '', ' posun vrstvy: souhlasné náboje', ' se ocitnou nad sebou a odpuzují se'),
          caption: 'Proč je iontový krystal křehký: po posunutí o jeden ion se k sobě dostanou stejné náboje a krystal praskne.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Slaná voda i pot vedou elektrický proud, protože obsahují volně pohyblivé ionty. Proto nikdy nesahej na elektrické spotřebiče mokrýma rukama a nenos je do koupelny k vaně.',
        },
        { type: 'p', text: 'Iontové látky tedy drží pohromadě přitahování iontů v mřížce. Kationty tvoří i kovy, a přesto se chovají úplně jinak – proč?' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které vlastnosti má chlorid sodný?',
            options: ['vysoká teplota tání', 'kujnost, dá se vyklepat do plechu', 'vede proud, když je roztavený', 'vede proud i jako pevný krystal', 'křehkost'],
            answers: [0, 2, 4],
            explain: 'Iontové krystaly tají při vysokých teplotách, jsou křehké a proud vedou jen v tavenině nebo roztoku, kde se ionty mohou pohybovat.',
          },
        },
      ],
    },
    {
      title: 'Kovová vazba: moře elektronů',
      icon: 'coin',
      blocks: [
        {
          type: 'p',
          text: 'U soli si elektrony vzal nekov. Co se ale stane, když jsou pohromadě jen atomy kovu a elektrony nikdo nechce? Kovy mají nízkou elektronegativitu a své valenční elektrony snadno uvolní. Atomy se změní na kationty a elektrony vytvoří společný **elektronový plyn** („moře elektronů“), který prostupuje celým kusem kovu. Podívej se, jak to vypadá:',
        },
        {
          type: 'diagram',
          id: 'metallic-bond',
          caption: 'Vlevo kationty kovu v moři volně pohyblivých elektronů. Vpravo kujnost: po úderu kladivem vrstvy kationtů po sobě kloužou a kov se ohne, ale nerozbije.',
        },
        {
          type: 'p',
          text: '==**Kovová vazba** je přitahování mezi kationty kovu a elektronovým plynem.== Elektrony nepatří žádnému konkrétnímu atomu, jsou **delokalizované**. Elektronový plyn vysvětluje typické vlastnosti kovů:',
        },
        {
          type: 'list',
          items: [
            '**Elektrická vodivost:** volné elektrony se v napětí pohybují jedním směrem.',
            '**Tepelná vodivost:** pohyblivé elektrony rychle přenášejí energii.',
            '**Kujnost a tažnost:** elektronový plyn drží vrstvy kationtů pohromadě, i když po sobě kloužou.',
            '**Kovový lesk:** volné elektrony pohlcují a znovu vyzařují světlo.',
          ],
        },
        { type: 'p', text: 'Síla kovové vazby se ale kov od kovu hodně liší. Nejlépe to ukazují teploty tání:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'thermometer', title: 'Rtuť taje při −39 °C', text: 'za pokojové teploty je kapalná' },
            { icon: 'heat', title: 'Gallium taje při 30 °C', text: 'roztaví se v dlani' },
            { icon: 'bulb', title: 'Wolfram taje při 3422 °C', text: 'dělala se z něj vlákna žárovek' },
          ],
        },
        {
          type: 'p',
          text: 'Vlastnosti kovu můžeme i cíleně změnit. **Slitina** je kov smíšený s jiným kovem nebo s nekovem, třeba s uhlíkem. Cizí atomy mají jinou velikost a narušují pravidelné vrstvy kationtů. Vrstvy po sobě hůř kloužou, a proto jsou slitiny obvykle **tvrdší a pevnější** než čisté kovy. Rozdíl uvidíš v částicovém modelu:',
        },
        {
          type: 'particles',
          boxes: [
            { label: 'Čisté železo', items: [{ species: 'Fe', count: 12 }], state: 'solid', note: 'pravidelné vrstvy snadno kloužou' },
            { label: 'Ocel', items: [{ species: 'Fe', count: 12 }, { species: 'C', count: 3 }], state: 'solid', note: 'malé atomy uhlíku v mezerách brzdí posun vrstev' },
            { label: 'Mosaz', items: [{ species: 'Cu', count: 8 }, { species: 'Zn', count: 4 }], state: 'solid', note: 'větší atomy zinku nahrazují část atomů mědi' },
          ],
          caption: 'Čistý kov a dvě slitiny v částicovém modelu.',
        },
        { type: 'p', text: 'Proto se většina kovů používá právě jako slitiny. Tady jsou ty nejznámější:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'factory', title: 'Ocel', text: 'železo a do 2 % uhlíku: mosty, karoserie, nástroje' },
            { icon: 'water-tap', title: 'Nerezová ocel', text: 'železo, chrom a nikl: nerezaví, příbory a dřezy' },
            { icon: 'trophy', title: 'Bronz', text: 'měď a cín: zvony, sochy, bronzové medaile' },
            { icon: 'coin', title: 'Mosaz', text: 'měď a zinek: kliky, trubky, žesťové nástroje' },
            { icon: 'speed', title: 'Dural', text: 'hliník, měď a hořčík: lehký a pevný, letadla a rámy kol' },
            { icon: 'ring', title: 'Zlato 14 karátů', text: 'zlato se stříbrem a mědí: čisté zlato by bylo na šperky příliš měkké' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Zlato se dá vytepat na plátek tenký asi desetitisícinu milimetru. Takovým „plátkovým zlatem“ se zlatí sochy, rámy obrazů, a dokonce i dorty.',
        },
        { type: 'p', text: 'Kovová vazba tedy vysvětluje vodivost, kujnost i lesk kovů. Teď můžeme porovnat všechny typy vazeb a zařadit kteroukoli pevnou látku.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč se kov po úderu kladivem ohne, zatímco iontový krystal praskne?',
            options: [
              'Vrstvy kationtů kovu po sobě kloužou a elektronový plyn je drží pohromadě.',
              'Kovy mají vyšší teplotu tání než iontové látky.',
              'V kovu nejsou žádné náboje.',
              'Atomy kovu jsou spojené pevnými kovalentními vazbami.',
            ],
            answer: 0,
            explain: 'Elektronový plyn funguje jako lepidlo, které drží kationty i po posunutí. V iontovém krystalu by se po posunu setkaly stejné náboje.',
          },
        },
      ],
    },
    {
      title: 'Čtyři typy pevných látek',
      icon: 'diamond',
      blocks: [
        {
          type: 'p',
          text: 'Iontové a kovové látky už známe. Zbývá kovalentní vazba (sdílené elektronové páry mezi nekovy), která tvoří dva různé druhy pevných látek. **Molekulové látky** ($H2O$, $CO2$, $I2$, cukr) mají pevné vazby jen uvnitř molekul a mezi molekulami slabé síly (další lekce), proto tají a vřou při nízkých teplotách. V **kovalentních (atomových) krystalech** jsou kovalentně propojeny všechny atomy: ==roztavit je znamená rozbít pevné kovalentní vazby, proto tají až při velmi vysokých teplotách.==',
        },
        { type: 'p', text: 'Jak velký rozdíl dělá jen způsob propojení atomů, ukazuje uhlík. Ze stejných atomů vzniká několik úplně odlišných látek:' },
        {
          type: 'diagram',
          id: 'carbon-allotropes',
          caption: 'Podoby uhlíku: diamant, grafit, grafen, fulleren $C60$ a nanotrubice. Všechno je čistý uhlík, liší se jen propojení atomů.',
        },
        { type: 'p', text: 'Diamant a grafit jsou typické kovalentní krystaly a patří k nim i křemen. Všimni si, jak počet sousedů každého atomu rozhoduje o vlastnostech:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'diamond', title: 'Diamant', text: 'každý atom C je vázán se 4 sousedy do tvaru čtyřstěnu. Pevná prostorová síť z něj dělá nejtvrdší přírodní látku. Proud nevede.' },
            { icon: 'pencil', title: 'Grafit', text: 'vrstvy ze šestiúhelníků, každý C má jen 3 sousedy. Čtvrtý elektron se volně pohybuje ve vrstvě, proto grafit vede proud. Vrstvy po sobě kloužou, a tak tuha v tužce píše.' },
            { icon: 'crystal', title: 'Oxid křemičitý $SiO2$', text: 'křemen, písek: každý Si je vázán se 4 atomy O a každý O se 2 atomy Si. Taje kolem 1700 °C.' },
          ],
        },
        { type: 'p', text: 'Teď máme pohromadě všechny čtyři typy pevných látek. Tabulka je srovnává vlastnost po vlastnosti:' },
        {
          type: 'table',
          headers: ['Vlastnost', 'Molekulová', 'Kovalentní krystal', 'Iontová', 'Kovová'],
          rows: [
            ['částice', 'molekuly', 'atomy', 'kationty a anionty', 'kationty v elektronovém plynu'],
            ['co je drží', 'slabé síly mezi molekulami', 'kovalentní vazby v celém krystalu', 'iontová vazba', 'kovová vazba'],
            ['teplota tání', 'nízká', 'velmi vysoká', 'vysoká', 'různá, většinou vysoká'],
            ['vodivost pevné látky', 'ne', 'ne (grafit ano)', 'ne', 'ano'],
            ['vodivost taveniny', 'ne', 'ne', 'ano', 'ano'],
            ['mechanické vlastnosti', 'měkké', 'velmi tvrdé (grafit měkký)', 'tvrdé, ale křehké', 'kujné a tažné'],
            ['rozpustnost ve vodě', 'polární ano, nepolární ne', 'nerozpustné', 'často ano', 'nerozpustné (alkalické kovy s vodou reagují)'],
            ['příklady', '$H2O$, $CO2$, $I2$, cukr', 'diamant, grafit, $SiO2$', '$NaCl$, $MgO$, $CaF2$', '$Fe$, $Cu$, $Al$, ocel'],
          ],
          caption: 'Čtyři typy pevných látek podle vazby, která drží jejich částice pohromadě.',
        },
        { type: 'p', text: 'Tabulku můžeš číst i obráceně: z vlastností neznámé látky poznáš její typ. Postupuj vylučovací metodou:' },
        {
          type: 'example',
          title: 'Detektivka s neznámou látkou',
          problem: 'Bílá krystalická látka taje asi při 1700 °C. Proud nevede v pevném stavu ani v tavenině a ve vodě se nerozpouští. Jaký je to typ látky?',
          steps: [
            'Vysoká teplota tání vylučuje molekulovou látku.',
            'Tavenina nevede, v látce tedy nejsou ionty: iontová látka to není.',
            'Pevná látka nevede, nejsou v ní volné elektrony: kov to není.',
            'Zbývá kovalentní krystal, v němž jsou všechny atomy propojené kovalentními vazbami.',
          ],
          answer: 'kovalentní krystal, například oxid křemičitý $SiO2$ (křemen)',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Podobný vzorec, jiný svět',
          text: '$CO2$ a $SiO2$ vypadají podobně, ale oxid uhličitý je molekulový plyn (jako suchý led sublimuje už při −78 °C), kdežto oxid křemičitý je tvrdý kovalentní krystal. U $SiO2$ vzorec vyjadřuje jen poměr atomů 1 : 2.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Za objev grafenu, jediné vrstvy grafitu, dostali Andre Geim a Konstantin Novoselov v roce 2010 Nobelovu cenu.',
        },
        { type: 'p', text: 'Teď umíš látku zařadit podle vlastností. U molekulových látek ale o všem rozhodují slabé síly mezi molekulami – a těm patří příští lekce.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď látku k typu pevné látky.',
            pairs: [
              ['diamant', 'kovalentní krystal'],
              ['chlorid sodný', 'iontová látka'],
              ['měď', 'kovová látka'],
              ['suchý led ($CO2$)', 'molekulová látka'],
            ],
            explain: 'Diamant je síť kovalentních vazeb, $NaCl$ mřížka iontů, měď kationty v elektronovém plynu a suchý led krystal z molekul $CO2$.',
          },
        },
      ],
    },
  ],
  summary: [
    'Iontová vazba je elektrostatické přitahování kationtů a aniontů; vzniká hlavně mezi kovem a nekovem (ΔX ≥ 1,7).',
    'Iontová sloučenina je neutrální, vzorec udává nejmenší poměr iontů, např. $CaCl2$ nebo $Al2O3$.',
    'Iontové látky tvoří krystalové mřížky bez molekul; mají vysoké teploty tání, jsou křehké a vedou proud jen v tavenině nebo roztoku.',
    'Mřížková energie roste s nábojem iontů a klesá s jejich velikostí, proto $MgO$ taje mnohem výš než $NaCl$.',
    'Kovová vazba drží kationty kovu v elektronovém plynu; volné elektrony vysvětlují vodivost, kujnost a lesk. Slitiny jsou tvrdší než čisté kovy, protože cizí atomy brzdí posun vrstev.',
    'Molekulové látky mají nízké teploty tání, kovalentní krystaly (diamant, grafit, $SiO2$) velmi vysoké; grafit jako jediný z nich vede proud.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Pevný chlorid sodný vede elektrický proud.',
      answer: false,
      explain: 'V pevném krystalu jsou ionty pevně na místě. Proud vede až tavenina nebo roztok, kde se ionty mohou pohybovat.',
    },
    {
      kind: 'number',
      q: 'Kolik elektronů má oxidový anion $O^{2-}$? (Z = 8)',
      answer: 10,
      explain: 'Kyslík má 8 elektronů a přijal další 2, celkem 10 (2, 8), stejně jako neon.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec sloučeniny iontů $Al^{3+}$ a $O^{2-}$.',
      accept: ['Al2O3'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: 'Dva ionty $Al^{3+}$ dají 6+, tři ionty $O^{2-}$ dají 6−. Sloučenina je $Al2O3$.',
    },
    {
      kind: 'choice',
      q: 'Proč má $MgO$ mnohem vyšší teplotu tání než $NaCl$?',
      options: [
        'Ionty $Mg^{2+}$ a $O^{2-}$ mají větší náboje, a proto se přitahují silněji.',
        '$MgO$ je tvořen molekulami, které se špatně rozbíjejí.',
        'V $MgO$ je kovová vazba.',
        'Hořčík je těžší než sodík.',
      ],
      answer: 0,
      explain: 'Síla přitahování iontů roste s jejich nábojem a klesá s jejich velikostí. Ionty 2+ a 2− jsou navíc menší než $Na^+$ a $Cl^-$.',
    },
    {
      kind: 'multi',
      q: 'Které vlastnosti kovů vysvětlíš elektronovým plynem?',
      options: ['elektrickou vodivost', 'kujnost a tažnost', 'kovový lesk', 'křehkost', 'nízkou teplotu tání všech kovů'],
      answers: [0, 1, 2],
      explain: 'Pohyblivé elektrony vedou proud, drží posunuté vrstvy kationtů a odrážejí světlo. Kovy křehké nejsou a teploty tání mají velmi různé.',
    },
    {
      kind: 'choice',
      q: 'Proč grafit vede elektrický proud, a diamant ne?',
      options: [
        'V grafitu je každý atom C vázán jen se 3 sousedy a čtvrtý elektron se může pohybovat ve vrstvě.',
        'Grafit obsahuje příměs kovů.',
        'Diamant je iontová látka.',
        'Grafit je molekulová látka s malými molekulami.',
      ],
      answer: 0,
      explain: 'V diamantu jsou všechny 4 valenční elektrony každého uhlíku pevně ve vazbách. V grafitu zbývá jeden delokalizovaný elektron na atom.',
    },
    {
      kind: 'tf',
      q: 'V krystalu oxidu křemičitého nenajdeš samostatné molekuly $SiO2$.',
      answer: true,
      explain: '$SiO2$ je kovalentní krystal: atomy Si a O jsou propojené vazbami v celém krystalu. Vzorec udává jen poměr 1 : 2.',
    },
    {
      kind: 'order',
      q: 'Seřaď iontové látky podle mřížkové energie od nejmenší po největší.',
      items: ['$KI$', '$NaCl$', '$NaF$', '$MgO$'],
      explain: '$KI$ má největší ionty, $NaF$ nejmenší ionty s náboji 1. $MgO$ má dvojnásobné náboje, a proto daleko největší mřížkovou energii.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-4 Mezimolekulové síly a vlastnosti látek
// ─────────────────────────────────────────────────────────────
const l34: Lesson = {
  id: 'l3-4',
  title: 'Mezimolekulové síly a vlastnosti látek',
  goals: [
    'Rozlišit vazby uvnitř molekul a síly mezi molekulami',
    'Popsat Londonovy disperzní síly, dipól–dipólové síly a vodíkovou vazbu',
    'Určit, která síla u látky převládá, a odhadnout pořadí teplot varu (alkany, sloučeniny vodíku 14.–17. skupiny)',
    'Vysvětlit, proč led plave, a použít pravidlo „podobné se rozpouští v podobném“',
  ],
  hook: 'Sulfan (sirovodík) $H2S$ je za pokojové teploty plyn, a přitom má těžší molekulu než voda. Kdyby se voda chovala „podle pravidel“, vřela by asi při −80 °C a na Zemi by nebyl jediný rybník. Co ji drží pohromadě?',
  sections: [
    {
      title: 'Uvnitř pevné, mezi sebou slabé',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: 'Minulá lekce skončila u molekulových látek, které tají a vřou snadno. Proč, vysvětlí rozdíl mezi dvěma druhy soudržnosti. **Kovalentní vazby** drží atomy uvnitř molekuly, **mezimolekulové síly** přitahují celé molekuly k sobě a jsou mnohem slabší. Právě ony rozhodují o teplotě tání a varu, rozpustnosti i povrchovém napětí. ==Při tání a varu molekulové látky se kovalentní vazby nerozbíjejí, molekuly se jen od sebe vzdálí.== Ukažme si to na vaření vody:',
        },
        {
          type: 'particles',
          boxes: [
            {
              label: 'Kapalná voda',
              items: [{ species: 'H2O', count: 8 }],
              state: 'liquid',
              note: 'molekuly se drží u sebe',
            },
            {
              label: 'Vodní pára',
              items: [{ species: 'H2O', count: 8 }],
              state: 'gas',
              note: 'molekuly se pustily sousedů, ale zůstaly celé',
            },
          ],
          arrows: true,
          caption: 'Var vody: překonávají se jen síly mezi molekulami.',
        },
        { type: 'p', text: 'Proč se při varu nerozbijí i molekuly? Porovnej, kolik energie drží atomy v molekule a kolik molekuly mezi sebou:' },
        {
          type: 'table',
          headers: ['Druh soudržnosti', 'Typická energie (kJ/mol)', 'Příklad'],
          rows: [
            ['kovalentní vazba', 'asi 150–950', '$O–H$ uvnitř molekuly vody'],
            ['vodíková vazba', 'asi 5–40', 'mezi molekulami vody'],
            ['van der Waalsovy síly', 'asi 0,1–10', 'mezi molekulami methanu'],
          ],
          caption: 'Mezimolekulové síly jsou desetkrát až tisíckrát slabší než kovalentní vazby.',
        },
        {
          type: 'callout',
          variant: 'mascot',
          text: 'Když voda vře, molekuly $H2O$ se nerozpadnou. Jen se pustí sousedů a vyletí ven jako tanečníci z parketu po poslední písničce. Každý odchází celý!',
        },
        { type: 'p', text: 'Mezimolekulové síly jsou tedy slabé, ale rozhodují o skupenství látky. Teď si projdeme jejich druhy, od nejslabšího.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Při varu vody se molekuly $H2O$ rozpadají na vodík a kyslík.',
            answer: false,
            explain: 'Varem se překonávají jen mezimolekulové síly. Molekuly $H2O$ zůstávají celé, pára je pořád voda.',
          },
        },
      ],
    },
    {
      title: 'Van der Waalsovy síly',
      icon: 'magnet',
      blocks: [
        {
          type: 'p',
          text: '**Van der Waalsovy síly** (podle fyzika J. D. van der Waalse) jsou slabé přitažlivé síly mezi molekulami. Patří sem dva hlavní druhy; silnější je vodíková vazba. Všechny tři druhy vedle sebe:',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'Londonovy (disperzní) síly',
              icon: 'electron',
              tone: 'a',
              points: ['okamžité dipóly z pohybu elektronů', 'působí mezi všemi částicemi', 'sílí s počtem elektronů', 'např. $I2$, $CH4$'],
            },
            {
              title: 'Dipól–dipólové síly',
              icon: 'magnet',
              tone: 'b',
              points: ['trvalé dipóly polárních molekul', 'δ+ jedné molekuly přitahuje δ− sousední', 'např. $HCl$'],
            },
            {
              title: 'Vodíková vazba',
              icon: 'drop',
              tone: 'c',
              points: ['vodík vázaný na F, O nebo N', 'nejsilnější mezimolekulová síla', 'např. $H2O$, $NH3$, $HF$'],
            },
          ],
          caption: 'Tři druhy mezimolekulových sil od nejslabší po nejsilnější.',
        },
        {
          type: 'p',
          text: '**Londonovy síly**: elektrony se pohybují, takže na okamžik bývá na jedné straně molekuly víc elektronů. Vznikne **okamžitý dipól**, který „nakazí“ souseda, a obě molekuly se na chvilku přitáhnou. ==Londonovy síly působí mezi všemi částicemi a rostou s počtem elektronů, tedy s velikostí molekuly.== Ukazují to halogeny, jejichž molekuly jsou nepolární a liší se jen velikostí:',
        },
        {
          type: 'table',
          headers: ['Halogen', 'Elektronů v molekule', 'Skupenství při 25 °C', 'Teplota varu'],
          rows: [
            ['$F2$', '18', 'plyn', '−188 °C'],
            ['$Cl2$', '34', 'plyn', '−34 °C'],
            ['$Br2$', '70', 'kapalina', '59 °C'],
            ['$I2$', '106', 'pevná látka', '184 °C'],
          ],
          caption: 'Čím víc elektronů, tím silnější Londonovy síly a tím vyšší teplota varu.',
        },
        {
          type: 'p',
          text: 'Stejný trend uvidíš u **alkanů**, uhlovodíků s jednoduchými vazbami (podrobně v úrovni 8). Jejich molekuly jsou nepolární, působí mezi nimi jen Londonovy síly. S každým dalším uhlíkem přibude 8 elektronů a molekula se prodlouží. Sleduj, jak s tím roste teplota varu:',
        },
        {
          type: 'table',
          headers: ['Alkan', 'Elektronů v molekule', 'Teplota varu', 'Při 25 °C'],
          rows: [
            ['methan $CH4$', '10', '−162 °C', 'plyn'],
            ['ethan $C2H6$', '18', '−89 °C', 'plyn'],
            ['propan $C3H8$', '26', '−42 °C', 'plyn'],
            ['butan $C4H10$', '34', '−0,5 °C', 'plyn'],
            ['pentan $C5H12$', '42', '36 °C', 'kapalina'],
            ['hexan $C6H14$', '50', '69 °C', 'kapalina'],
            ['oktan $C8H18$', '66', '126 °C', 'kapalina'],
          ],
          caption: 'Čím delší řetězec, tím silnější Londonovy síly a vyšší teplota varu. Proto je propan-butan v bombě plyn a oktan v benzínu kapalina.',
        },
        { type: 'p', text: 'Záleží ale i na tvaru. Dvě molekuly se stejným vzorcem i počtem elektronů mohou vřít při různé teplotě:' },
        {
          type: 'molecule',
          molecules: ['butane', 'isobutane'],
          labels: ['butan: var −0,5 °C', 'methylpropan: var −12 °C'],
          caption: 'Stejný vzorec $C4H10$, stejný počet elektronů, jiný tvar. Protáhlý butan se sousedů dotýká větší plochou než kompaktní rozvětvený methylpropan (isobutan), a proto vře výš.',
        },
        {
          type: 'p',
          text: '**Dipól–dipólové síly** působí mezi polárními molekulami s trvalým dipólem: kladný konec jedné molekuly přitahuje záporný konec sousední. U chlorovodíku to vypadá takto:',
        },
        {
          type: 'structure',
          art: art(' δ+   δ−        δ+   δ−', ' H — Cl  ·····  H — Cl'),
          caption: 'Dipól–dipólové přitahování (tečkovaně) mezi molekulami chlorovodíku.',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Gekon na stropě',
          text: 'Gekon šplhá po skle bez lepidla i přísavek. Na prstech má miliony mikroskopických chloupků a každý se k povrchu přitahuje van der Waalsovými silami. Jedna síla je nepatrná, ale miliony dohromady udrží celé zvíře.',
        },
        { type: 'p', text: 'Van der Waalsovy síly tedy sílí s velikostí molekuly a s její polaritou. U některých molekul se ale přidá ještě mnohem silnější přitahování.' },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď halogeny podle teploty varu od nejnižší po nejvyšší.',
            items: ['$F2$', '$Cl2$', '$Br2$', '$I2$'],
            explain: 'Směrem dolů ve skupině přibývá elektronů, Londonovy síly sílí a teplota varu roste.',
          },
        },
      ],
    },
    {
      title: 'Vodíková vazba',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Právě toto silnější přitahování vysvětluje záhadu vody z úvodu. **Vodíková vazba** je zvlášť silné přitahování molekul. Vzniká, když je vodík vázán na malý, velmi elektronegativní atom **F, O nebo N**. Takový vodík nese výrazný náboj δ+ a přitahuje volný elektronový pár atomu F, O nebo N sousední molekuly. Nejlépe je to vidět na vodě:',
        },
        {
          type: 'diagram',
          id: 'hydrogen-bonds',
          caption: 'Vodíkové vazby ve vodě (tečkovaně): vodík δ+ jedné molekuly přitahuje volný elektronový pár kyslíku sousední molekuly. Každá molekula vody jich může vytvořit až čtyři – dvě přes své vodíky a dvě přes volné páry kyslíku. V ledu tvoří molekuly pravidelnou síť se šestiúhelníkovými dutinami.',
        },
        { type: 'p', text: 'Voda ale není jediná. Porovnej ji s amoniakem a fluorovodíkem – i v nich je vodík vázán na jeden z těch tří prvků:' },
        {
          type: 'molecule',
          molecules: ['H2O', 'NH3', 'HF'],
          labels: ['$O–H$', '$N–H$', '$F–H$'],
          caption: 'Vodíkové vazby tvoří voda, amoniak a fluorovodík, ale také alkoholy, bílkoviny nebo DNA.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Vodíková vazba je nejsilnější mezimolekulová síla, ale pořád zhruba 10–20krát slabší než kovalentní vazba. Nespojuje atomy uvnitř molekuly, ale molekuly mezi sebou (nebo dvě části velké molekuly).',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Dvě vlákna tvé DNA drží u sebe právě vodíkové vazby mezi dusíkatými bázemi. Jsou dost pevné, aby dvoušroubovice držela, a dost slabé, aby se při kopírování dala rozepnout jako zip. Víc v úrovni 9.',
        },
        { type: 'p', text: 'Teď znáš všechny tři druhy mezimolekulových sil. Mezi molekulami jich ale obvykle působí několik najednou – která pak rozhoduje?' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Mezi molekulami kterých látek vznikají vodíkové vazby?',
            options: ['$H2O$', '$CH4$', '$NH3$', '$HF$', '$H2S$'],
            answers: [0, 2, 3],
            explain: 'Vodíkové vazby tvoří látky s vodíkem vázaným na F, O nebo N. V $CH4$ je vodík na uhlíku a v $H2S$ na síře, ty nejsou dost elektronegativní.',
          },
        },
      ],
    },
    {
      title: 'Která síla rozhoduje o teplotě varu',
      icon: 'thermometer',
      blocks: [
        {
          type: 'p',
          text: 'Mezi molekulami obvykle působí několik sil najednou: Londonovy vždy, dipól–dipólové u polárních molekul a vodíkové vazby, když je vodík vázán na F, O nebo N. Kterou z nich brát jako rozhodující, zjistíš ve čtyřech krocích:',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'electron', title: 'Londonovy síly vždy', text: 'rostou s počtem elektronů a s plochou, kterou se molekuly dotýkají' },
            { icon: 'magnet', title: 'Je molekula polární?', text: 'přidej dipól–dipólové síly' },
            { icon: 'drop', title: 'Je vodík na F, O nebo N?', text: 'přidej vodíkové vazby; u malých molekul téměř vždy převládnou' },
            { icon: 'balance-scale', title: 'Porovnej', text: 'u podobně velkých molekul rozhoduje druh sil, u velmi rozdílných často počet elektronů' },
          ],
          caption: 'Jak odhadnout, která mezimolekulová síla převládá.',
        },
        { type: 'p', text: 'Postup si vyzkoušej na třech látkách, u kterých polarita a velikost molekul táhnou každá jinam:' },
        {
          type: 'example',
          title: 'Polarita, nebo velikost?',
          problem: 'Vysvětli pořadí teplot varu: fluor $F2$ (−188 °C) < chlorovodík $HCl$ (−85 °C) < jodovodík $HI$ (−35 °C).',
          steps: [
            '$F2$ i $HCl$ mají 18 elektronů, Londonovy síly jsou podobné. $HCl$ je ale polární a přidají se dipól–dipólové síly, proto vře výš.',
            '$HI$ je méně polární než $HCl$ (ΔX 0,46 proti 0,96), má však 54 elektronů místo 18.',
            'Mnohem silnější Londonovy síly u $HI$ převáží slabší dipóly, a tak vře výš než $HCl$.',
          ],
          answer: 'U stejně velkých molekul rozhodla polarita, u velmi rozdílných velikost molekul (Londonovy síly).',
        },
        { type: 'p', text: 'Teď můžeme rozluštit záhadu z úvodu. Prohlédni si teploty varu sloučenin vodíku s prvky 14.–17. skupiny a hledej, co z řady vybočuje:' },
        {
          type: 'table',
          headers: ['Perioda', '14. skupina', '15. skupina', '16. skupina', '17. skupina'],
          rows: [
            ['2.', '$CH4$ −162 °C', '$NH3$ −33 °C', '$H2O$ 100 °C', '$HF$ 20 °C'],
            ['3.', '$SiH4$ −112 °C', '$PH3$ −88 °C', '$H2S$ −60 °C', '$HCl$ −85 °C'],
            ['4.', '$GeH4$ −88 °C', '$AsH3$ −62 °C', '$H2Se$ −41 °C', '$HBr$ −67 °C'],
            ['5.', '$SnH4$ −52 °C', '$SbH3$ −17 °C', '$H2Te$ −2 °C', '$HI$ −35 °C'],
          ],
          caption: 'Teploty varu sloučenin vodíku s prvky 14.–17. skupiny. Ve 14. skupině roste teplota varu pravidelně, v ostatních první člen z trendu divoce vybočuje.',
        },
        {
          type: 'p',
          text: 'Molekuly $CH4$ až $SnH4$ jsou souměrné tetraedry, a tedy nepolární. Působí mezi nimi jen Londonovy síly, které rostou s počtem elektronů, a teplota varu stoupá bez výjimky. V 15., 16. a 17. skupině vybočují $NH3$, $H2O$ a $HF$: jako jediné tvoří **vodíkové vazby**. Nejvíc vybočuje voda – porovnej ji se sousedem ve skupině:',
        },
        {
          type: 'molecule',
          molecules: ['H2O', 'H2S'],
          labels: ['voda $H2O$', 'sulfan $H2S$'],
          caption: 'Porovnej obě molekuly: tvar mají podobný, liší se centrálním atomem.',
        },
        { type: 'p', text: 'Podle počtu elektronů by měl výš vřít sulfan. Proč je to naopak, rozebereme krok za krokem:' },
        {
          type: 'example',
          title: 'Voda proti sulfanu',
          problem: 'Proč vře voda při 100 °C, ale sulfan $H2S$ už při −60 °C, i když má víc elektronů?',
          steps: [
            'Obě molekuly jsou lomené a polární, liší se centrálním atomem.',
            '$H2S$ má 18 elektronů, $H2O$ jen 10. Londonovy síly jsou tedy silnější u $H2S$.',
            'Kyslík (X = 3,44) je ale malý a velmi elektronegativní, a tak molekuly vody tvoří vodíkové vazby. Síra (X = 2,58) je netvoří.',
            'Rozrušit síť vodíkových vazeb stojí mnohem víc energie, proto voda vře o 160 °C výš.',
          ],
          answer: 'Za vysokou teplotou varu vody stojí vodíkové vazby.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: '==Bez vodíkových vazeb by voda vřela zhruba při −80 °C.== Na Zemi by pak nebyla kapalná voda, oceány ani život, jak ho známe.',
        },
        { type: 'p', text: 'Teď umíš odhadnout pořadí teplot varu. Vodíkové vazby mají ale na vodu ještě jeden nečekaný vliv: led na ní plave.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč má amoniak $NH3$ (−33 °C) vyšší teplotu varu než fosfan $PH3$ (−88 °C)?',
            options: [
              'Mezi molekulami amoniaku vznikají vodíkové vazby.',
              'Molekula $NH3$ má víc elektronů.',
              'Amoniak je iontová látka.',
              'Fosfan má kovovou vazbu.',
            ],
            answer: 0,
            explain: 'Dusík je malý a elektronegativní (3,04), proto $NH3$ tvoří vodíkové vazby. Fosfor (2,19) ne. $PH3$ má přitom víc elektronů, takže Londonovy síly to nevysvětlí.',
          },
        },
      ],
    },
    {
      title: 'Proč led plave',
      icon: 'ice',
      blocks: [
        {
          type: 'p',
          text: 'Vodíkové vazby nevysvětlují jen vysokou teplotu varu vody. U většiny látek je pevná fáze hustší než kapalina, voda je ale výjimka. V ledu je každá molekula vázána vodíkovými vazbami ke čtyřem sousedům a vzniká **řídká šestiúhelníková mřížka** s dutinami. ==Led má proto menší hustotu (asi 0,92 g/cm^{3}) než kapalná voda (1,00 g/cm^{3}) a plave na ní.== Rozdíl je vidět v částicovém modelu:',
        },
        {
          type: 'particles',
          boxes: [
            {
              label: 'Led',
              items: [{ species: 'H2O', count: 6 }],
              state: 'solid',
              note: 'řídká mřížka s dutinami, 0,92 g/cm^{3}',
            },
            {
              label: 'Kapalná voda',
              items: [{ species: 'H2O', count: 9 }],
              state: 'liquid',
              note: 'molekuly blíž u sebe, 1,00 g/cm^{3}',
            },
          ],
          caption: 'Ve stejném objemu je v ledu méně molekul než v kapalné vodě. Při zamrznutí voda zvětší objem zhruba o 9 %.',
        },
        { type: 'p', text: 'Že led plave, má pro život ve vodě obrovský význam. Sleduj, co se děje v rybníce, když přijde mráz:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'cold', title: 'Hladina chladne', text: 'v zimě se voda ochlazuje shora' },
            { icon: 'thermometer', title: 'Voda o 4 °C klesá ke dnu', text: 'při 4 °C je kapalná voda nejhustší' },
            { icon: 'ice', title: 'Nahoře zamrzne led', text: 'chladnější voda a led zůstávají u hladiny jako izolační víko' },
            { icon: 'fish', title: 'Ryby přežijí u dna', text: 'tam má voda pořád kolem 4 °C' },
          ],
          caption: 'Rybník v zimě.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Skleněnou láhev s pitím nedávej do mrazáku: voda při mrznutí zvětší objem a láhev praskne. Ze stejného důvodu se na zimu vypouští voda ze zahradních hadic a venkovních kohoutků.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Voda zatečená do puklin ve skále nebo v asfaltu v zimě zamrzne a rozšíří je. Tomuto mrazovému zvětrávání vděčíme za sutě pod skalami i za výtluky na silnicích po zimě.',
        },
        { type: 'p', text: 'Vodíkové vazby tedy řídí i to, jak voda mrzne. Stejné síly mezi molekulami rozhodují také o tom, co se ve vodě rozpustí.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Led má větší hustotu než kapalná voda.',
            answer: false,
            explain: 'Vodíkové vazby drží molekuly v ledu v řídké mřížce s dutinami. Led je proto méně hustý (0,92 g/cm^{3}) a plave.',
          },
        },
      ],
    },
    {
      title: 'Rozpustnost a povrchové napětí',
      icon: 'droplets',
      blocks: [
        {
          type: 'p',
          text: 'Když se látka rozpouští, musí se její částice obklopit molekulami rozpouštědla. O rozpustnosti proto rozhoduje pravidlo ==**podobné se rozpouští v podobném**.== Polární a iontové látky se dobře rozpouštějí v polárních rozpouštědlech, jako je voda, nepolární látky v nepolárních, jako je benzín. Jak polární voda rozebírá krystal soli, ukazuje obrázek:',
        },
        {
          type: 'diagram',
          id: 'dissolving',
          caption: 'Rozpouštění soli ve vodě: polární molekuly vody obklopí ionty na povrchu krystalu – $Na^+$ kyslíkem, $Cl^-$ vodíky – a odnesou je do roztoku.',
        },
        { type: 'p', text: 'Stejné pravidlo vysvětluje, proč se olej s vodou nemísí a proč mastnou skvrnu voda nesmyje:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: 'Sůl, cukr i líh ve vodě', text: 'jejich částice se s molekulami vody přitahují' },
            { icon: 'oil-barrel', title: 'Olej se s vodou nemísí', text: 'molekuly vody se drží pohromadě vodíkovými vazbami a nepolární olej „vytlačí“' },
            { icon: 'soap', title: 'Mastná skvrna', text: 'voda ji nesmyje, nepolární rozpouštědlo ano; jak to zvládá mýdlo, uvidíš v úrovni 9' },
            { icon: 'beaker', title: 'Jod', text: 've vodě se rozpouští jen nepatrně, v nepolárním benzínu dobře' },
          ],
        },
        { type: 'p', text: 'Vodíkové vazby ovlivňují i chování vody na hladině. Než se na ni podíváme, ujasněme si dva pojmy:' },
        {
          type: 'keyterms',
          items: [
            { term: 'rozpouštědlo', def: 'látka, ve které se jiná látka rozpouští (nejčastěji voda)' },
            { term: 'povrchové napětí', def: 'snaha kapaliny zmenšit svůj povrch; hladina se chová jako pružná blána' },
          ],
        },
        {
          type: 'p',
          text: 'Molekulu na hladině táhnou sousedé jen do stran a dovnitř kapaliny, proto se povrch „stahuje“. Voda má díky vodíkovým vazbám povrchové napětí mimořádně velké: kapky jsou kulaté a vodoměrky běhají po hladině.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pokus doma',
          text: 'Polož na hladinu vody kousek papírového ubrousku a na něj kancelářskou sponku. Ubrousek nasákne a klesne, sponka zůstane na hladině. Pak kápni do vody trochu saponátu: povrchové napětí klesne a sponka se potopí.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Benzín a jiná organická rozpouštědla jsou hořlavá a jejich páry škodí zdraví. Pracuj s nimi jen v malém množství, dobře větrej a nikdy ne u otevřeného ohně.',
        },
        { type: 'p', text: 'Mezimolekulové síly tedy vysvětlují skupenství, rozpustnost i povrchové napětí. V příští lekci se od vlastností látek přesuneme k jejich vzorcům a poznáš oxidační číslo, klíč k názvosloví.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Která látka se nejlépe rozpustí v nepolárním benzínu?',
            options: ['rostlinný olej', 'kuchyňská sůl', 'cukr', 'chlorid vápenatý'],
            answer: 0,
            explain: 'Olej je nepolární, takže se rozpouští v nepolárním benzínu. Sůl, cukr a $CaCl2$ jsou iontové nebo polární a rozpouštějí se ve vodě.',
          },
        },
      ],
    },
  ],
  summary: [
    'Mezimolekulové síly jsou mnohem slabší než kovalentní vazby; při tání a varu molekulových látek se překonávají jen ony.',
    'Londonovy disperzní síly působí mezi všemi molekulami a sílí s počtem elektronů; dipól–dipólové síly působí mezi polárními molekulami.',
    'Vodíková vazba vzniká, když je vodík vázaný na F, O nebo N; je to nejsilnější mezimolekulová síla.',
    'U podobně velkých molekul rozhoduje druh sil, u velmi rozdílných počet elektronů: teplota varu alkanů roste s délkou řetězce a $HI$ vře výš než $HCl$.',
    'Ve 14. skupině roste teplota varu hydridů pravidelně; $NH3$, $H2O$ a $HF$ z trendu vybočují díky vodíkovým vazbám, proto voda vře při 100 °C a $H2S$ už při −60 °C.',
    'Led má řídkou mřížku z vodíkových vazeb, je méně hustý než voda a plave; voda je nejhustší při 4 °C.',
    'Podobné se rozpouští v podobném: polární látky ve vodě, nepolární v nepolárních rozpouštědlech; vodíkové vazby dávají vodě i velké povrchové napětí.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Londonovy disperzní síly působí mezi všemi molekulami, i mezi nepolárními.',
      answer: true,
      explain: 'Okamžité dipóly vznikají díky pohybu elektronů v každé molekule, proto Londonovy síly působí úplně všude.',
    },
    {
      kind: 'choice',
      q: 'Které síly drží pohromadě molekuly v kapalném bromu $Br2$?',
      options: ['Londonovy disperzní síly', 'vodíkové vazby', 'iontové vazby', 'kovová vazba'],
      answer: 0,
      explain: '$Br2$ je nepolární molekula bez vodíku. Mezi jeho molekulami působí jen Londonovy síly, díky 70 elektronům dost silné na to, aby byl brom kapalný.',
    },
    {
      kind: 'multi',
      q: 'Která tvrzení o vodíkové vazbě jsou pravdivá?',
      options: [
        'Vzniká, když je vodík vázaný na F, O nebo N.',
        'Je slabší než kovalentní vazba.',
        'Drží pohromadě řídkou mřížku ledu.',
        'Vzniká mezi molekulami methanu.',
        'Je to kovalentní vazba mezi dvěma atomy vodíku.',
      ],
      answers: [0, 1, 2],
      explain: 'Vodíková vazba je mezimolekulová síla, mnohonásobně slabší než kovalentní vazba. V methanu je vodík vázán na uhlík, a ten ji nevytvoří.',
    },
    {
      kind: 'order',
      q: 'Seřaď sloučeniny vodíku s prvky 16. skupiny podle teploty varu od nejnižší po nejvyšší.',
      items: ['$H2S$', '$H2Se$', '$H2Te$', '$H2O$'],
      explain: '$H2S$ (−60 °C) < $H2Se$ (−41 °C) < $H2Te$ (−2 °C) < $H2O$ (100 °C). U prvních tří rostou Londonovy síly, voda vyčnívá díky vodíkovým vazbám.',
    },
    {
      kind: 'number',
      q: 'Zhruba o kolik procent zvětší voda svůj objem, když zmrzne?',
      answer: 9,
      tolerance: 1,
      unit: '%',
      explain: 'Asi o 9 %. Molekuly se v ledu uspořádají do řídké mřížky s dutinami, proto led plave a láhve v mrazáku praskají.',
    },
    {
      kind: 'tf',
      q: 'Kapalná voda má největší hustotu při 0 °C.',
      answer: false,
      explain: 'Největší hustotu má voda při 4 °C. Proto je u dna zamrzlého rybníka voda o teplotě kolem 4 °C.',
    },
    {
      kind: 'match',
      q: 'Přiřaď jev k jeho vysvětlení.',
      pairs: [
        ['led plave na vodě', 'řídká mřížka z vodíkových vazeb'],
        ['olej se nemísí s vodou', 'voda je polární, olej nepolární'],
        ['vodoměrka běhá po hladině', 'povrchové napětí'],
        ['jod je při 25 °C pevný, fluor plynný', 'silnější Londonovy síly u větších molekul'],
      ],
      explain: 'Každý z jevů má na svědomí jiný druh mezimolekulových sil nebo jejich důsledek.',
    },
    {
      kind: 'choice',
      q: 'Který z alkanů je za pokojové teploty (25 °C) kapalina?',
      options: ['pentan $C5H12$', 'methan $CH4$', 'propan $C3H8$', 'butan $C4H10$'],
      answer: 0,
      explain: 'Pentan má ze všech nejvíc elektronů, nejsilnější Londonovy síly a vře až při 36 °C. Methan, propan i butan vřou pod 0 °C.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-5 Oxidační číslo a chemické vzorce
// ─────────────────────────────────────────────────────────────
const l35: Lesson = {
  id: 'l3-5',
  title: 'Oxidační číslo a chemické vzorce',
  goals: [
    'Určit oxidační čísla atomů v molekule i v iontu podle pravidel',
    'Přiřadit oxidačním číslům I až VIII správné koncovky přídavných jmen',
    'Sestavit vzorec z názvu křížovým pravidlem a z vzorce odvodit název',
  ],
  hook: 'Železo se umí slučovat s chlorem dvojím způsobem: jednou vznikne světle zelená látka, podruhé hnědožlutá. Obě se jmenují „chlorid železa“. Jak je odlišit, aniž bychom si pomáhali barvičkami? Stačí jedno číslo.',
  sections: [
    {
      title: 'Co je oxidační číslo',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: 'Obě látky z úvodu jsou složené jen ze železa a chloru. Liší se tím, kolik elektronů železo „dalo“ chloru, a právě to vyjadřuje jedno číslo. **Oxidační číslo** je myšlený náboj atomu. Dostaneš ho, když si představíš, že ==všechny vazebné elektronové páry patří vždy elektronegativnějšímu z obou atomů==, jako by všechny vazby byly iontové.',
        },
        {
          type: 'p',
          text: 'Pozor na rozdíl proti formálnímu náboji z lekce o Lewisových vzorcích: tam jsme vazebné páry dělili napůl, tady je celé dáme jednomu atomu. Na dvou molekulách, které už znáš, to vypadá takto:',
        },
        {
          type: 'molecule',
          molecules: ['HCl', 'H2O'],
          labels: ['$H^{I}Cl^{−I}$', '$H2^{I}O^{−II}$'],
          caption: 'Elektronegativnější chlor a kyslík si „vezmou“ vazebné páry. Oxidační čísla se píšou římskými číslicemi vpravo nahoru.',
        },
        {
          type: 'p',
          text: 'V $HCl$ má chlor s přiděleným párem o elektron víc než jeho atom: −I; vodík o elektron přišel: +I. V $H2O$ si kyslík vezme oba vazebné páry, dostane −II a každý vodík +I. Jak oxidační čísla zapisovat, záleží na jejich znaménku:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'ion-plus', title: 'Kladná', text: 'bez znaménka nebo se znaménkem plus: $Fe^{III}$' },
            { icon: 'ion-minus', title: 'Záporná', text: 'vždy se znaménkem minus: $O^{−II}$' },
            { icon: 'atom', title: 'Nula', text: 'arabskou číslicí: $Cl2^0$' },
          ],
        },
        { type: 'p', text: 'Pozor, $Fe^{III}$ a $Fe^{3+}$ vypadají podobně, ale neznamenají totéž. Rozdíl je v obsahu i v zápisu:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Náboj iontu $Fe^{3+}$',
              icon: 'ion-plus',
              tone: 'a',
              points: ['skutečný náboj iontu', 'arabská číslice, znaménko za ní', 'jen u iontů'],
            },
            {
              title: 'Oxidační číslo $Fe^{III}$',
              icon: 'atom',
              tone: 'b',
              points: ['myšlený náboj atomu', 'římská číslice', 'má ho každý atom, i ten v molekule bez iontů, jako uhlík v $CO2$'],
            },
          ],
          caption: 'Náboj iontu, nebo oxidační číslo?',
        },
        { type: 'p', text: 'Oxidační číslo tedy určíš z elektronegativit. Kreslit kvůli němu pokaždé vazby by ale bylo zdlouhavé – a naštěstí to není potřeba.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaké oxidační číslo má chlor v molekule $HCl$?',
            options: ['−I', '+I', '0', '−II'],
            answer: 0,
            explain: 'Chlor je elektronegativnější než vodík, připíšeme mu vazebný pár. Má tak o elektron víc, oxidační číslo je −I.',
          },
        },
      ],
    },
    {
      title: 'Pravidla pro určování oxidačních čísel',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: 'Elektronegativita se v tabulce mění pravidelně, a tak některé prvky dostávají skoro vždy stejné oxidační číslo. Stačí si proto zapamatovat šest pravidel, která platí téměř vždy:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'atom', title: 'Prvky: **0**', text: '$Na$, $Fe$, $O2$, $Cl2$, $S8$' },
            { icon: 'toothpaste', title: 'Fluor: vždy **−I**', text: 've všech sloučeninách' },
            { icon: 'lungs', title: 'Kyslík: obvykle **−II**', text: 'výjimky: peroxidy (−I, např. $H2O2$) a sloučeniny s fluorem ($OF2$: +II)' },
            { icon: 'balloon', title: 'Vodík: obvykle **+I**', text: 'výjimka: hydridy kovů (−I, např. $NaH$)' },
            { icon: 'coin', title: 'Kovy: 1. skupina **+I**, 2. skupina **+II**', text: 'hliník vždy **+III**' },
            { icon: 'balance-scale', title: '==**Součet** je 0 nebo náboj iontu==', text: 'v neutrální částici **0**, v iontu se rovná **náboji iontu**' },
          ],
        },
        {
          type: 'p',
          text: 'Pro ostatní prvky pravidlo nemáme, víme ale aspoň, v jakém rozsahu se jejich oxidační číslo pohybuje. Nejvyšší kladné oxidační číslo prvku hlavní skupiny odpovídá počtu valenčních elektronů (výjimkou jsou kyslík a fluor). Nejnižší záporné u nekovů zjistíš jako číslo skupiny minus 18. Pro několik nekovů to vypadá takto:',
        },
        {
          type: 'table',
          headers: ['Prvek', 'Skupina', 'Nejvyšší', 'Nejnižší'],
          rows: [
            ['C', '14', 'IV', '−IV'],
            ['N', '15', 'V', '−III'],
            ['S', '16', 'VI', '−II'],
            ['Cl', '17', 'VII', '−I'],
          ],
          caption: 'Rozsah oxidačních čísel některých nekovů.',
        },
        { type: 'p', text: 'Oba krajní stavy najdeš ve známých molekulách. U uhlíku jsou to methan a oxid uhličitý:' },
        {
          type: 'molecule',
          molecules: ['CH4', 'CO2'],
          labels: ['$C^{−IV}$: nejnižší', '$C^{IV}$: nejvyšší'],
          caption: 'Uhlík (14. skupina) ve svém nejnižším a nejvyšším oxidačním čísle.',
        },
        { type: 'p', text: 'Pravidla dají oxidační čísla většiny atomů hned. Ten poslední, pro který pravidlo nemáme, dopočítáme ze součtu.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'V molekule kyslíku $O2$ má kyslík oxidační číslo −II.',
            answer: false,
            explain: '$O2$ je prvek, oba atomy jsou stejné a elektrony si nikdo „nepřivlastní“. Oxidační číslo je 0.',
          },
        },
      ],
    },
    {
      title: 'Výpočet oxidačního čísla',
      icon: 'calculator',
      blocks: [
        { type: 'p', text: 'Pravidlo o součtu funguje jako rovnice o jedné neznámé: neznámé je oxidační číslo prvku, pro který pravidlo nemáme. Řešíš ji vždy ve stejných krocích:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Známá čísla', text: 'z pravidel doplň O −II, H +I, kovy 1. a 2. skupiny…' },
            { icon: 'question', title: 'Neznámé označ x', text: 'pro prvek, pro který pravidlo nemáš' },
            { icon: 'balance-scale', title: 'Sestav součet', text: 'součet všech atomů = 0, v iontu = náboj iontu' },
            { icon: 'calculator', title: 'Vyřeš x', text: 'počítej s obyčejnými čísly se znaménkem' },
            { icon: 'check', title: 'Přepiš a zkontroluj', text: 'výsledek zapiš římskou číslicí a ověř součet' },
          ],
          caption: 'Oxidační číslo dopočítáš ze součtu.',
        },
        { type: 'p', text: 'Začni jednoduchou molekulou, kde je neznámá jen síra:' },
        {
          type: 'example',
          title: 'Síra v oxidu siřičitém',
          problem: 'Urči oxidační číslo síry v $SO2$.',
          steps: ['Kyslík má −II, dva kyslíky dohromady −4.', 'Molekula je neutrální: x + 2 · (−2) = 0', 'x = +4'],
          answer: '$S^{IV}O2^{−II}$',
        },
        { type: 'p', text: 'Postup funguje i pro látky ze tří prvků. Jen sečteš všechny atomy, které znáš:' },
        {
          type: 'example',
          title: 'Mangan v hypermanganu',
          problem: 'Urči oxidační číslo manganu v $KMnO4$ (manganistan draselný, známý jako „hypermangan“).',
          steps: ['Draslík (1. skupina) má +I, kyslík −II.', '(+1) + x + 4 · (−2) = 0', 'x = 8 − 1 = +7'],
          answer: 'mangan má oxidační číslo VII',
        },
        { type: 'p', text: 'U iontu se mění jediná věc: součet se nerovná nule, ale náboji iontu. Právě na to se nejčastěji zapomíná.' },
        {
          type: 'example',
          title: 'Ion: síranový anion',
          problem: 'Urči oxidační číslo síry v aniontu $SO4^2-$.',
          steps: ['Kyslík má −II, čtyři kyslíky dohromady −8.', 'Součet se rovná náboji iontu: x + (−8) = −2', 'x = +6'],
          answer: 'síra má oxidační číslo VI',
        },
        { type: 'p', text: 'Stejně počítáš u kationtu. Náboj je tu kladný, a přesto může oxidační číslo vyjít záporné:' },
        {
          type: 'example',
          title: 'Ion: amonný kation',
          problem: 'Urči oxidační číslo dusíku v $NH4^+$.',
          steps: ['Vodík má +I, čtyři vodíky +4.', 'x + 4 = +1', 'x = −3'],
          answer: 'dusík má oxidační číslo −III',
        },
        { type: 'p', text: 'Výsledky si prohlédni na modelech. Všimni si, že síra má v $SO2$ a v $SO4^2-$ různá oxidační čísla – jeden prvek jich může mít několik:' },
        {
          type: 'molecule',
          molecules: ['SO2', 'SO4^2-', 'NH4+'],
          labels: ['$S^{IV}$', '$S^{VI}$', '$N^{−III}$'],
          caption: 'Tři vyřešené částice. Ion se počítá stejně, jen součet se rovná jeho náboji.',
        },
        { type: 'p', text: 'Oxidační číslo teď spočítáš v molekule i v iontu. V češtině ho ale nenajdeš jen ve vzorci – schovává se i v názvu látky.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jaké oxidační číslo má dusík v $HNO3$ (kyselina dusičná)?',
            accept: ['V', '+V', '5', '+5'],
            placeholder: 'např. III',
            explain: '(+1) + x + 3 · (−2) = 0, tedy x = +5. Dusík má oxidační číslo V, své maximum.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Urči oxidační číslo chromu v dichromanovém aniontu $Cr2O7^2-$. Napiš ho arabskou číslicí.',
            answer: 6,
            explain: '2x + 7 · (−2) = −2, tedy 2x = 12 a x = +6. Chrom má oxidační číslo VI.',
          },
        },
      ],
    },
    {
      title: 'Koncovky: od -ný po -ičelý',
      icon: 'star',
      blocks: [
        {
          type: 'p',
          text: 'V českém názvosloví se oxidační číslo schovává do **koncovky přídavného jména**: z názvu „oxid hlinitý“ hned víš, že hliník má III. Koncovek je osm, pro oxidační čísla I až VIII:',
        },
        {
          type: 'table',
          headers: ['Oxidační číslo', 'Koncovka', 'Příklad', 'Vzorec'],
          rows: [
            ['I', '-ný', 'oxid sodný', '$Na2O$'],
            ['II', '-natý', 'oxid vápenatý', '$CaO$'],
            ['III', '-itý', 'oxid hlinitý', '$Al2O3$'],
            ['IV', '-ičitý', 'oxid křemičitý', '$SiO2$'],
            ['V', '-ičný, -ečný', 'oxid dusičný, oxid fosforečný', '$N2O5$, $P4O10$'],
            ['VI', '-ový', 'oxid sírový', '$SO3$'],
            ['VII', '-istý', 'oxid chloristý', '$Cl2O7$'],
            ['VIII', '-ičelý', 'oxid osmičelý', '$OsO4$'],
          ],
          caption: 'Variantu -ečný potkáš hlavně u fosforu. Oxid fosforečný se často zjednodušeně zapisuje $P2O5$.',
        },
        {
          type: 'callout',
          variant: 'remember',
          title: 'Jak si koncovky zapamatovat',
          text: 'Odříkej je rytmicky jako rozpočitadlo: **ný – na-tý – i-tý – i-či-tý, ič-ný – o-vý – is-tý – i-če-lý**. A přidej si kotvu ze 3. periody: $Na2O$, $MgO$, $Al2O3$, $SiO2$, $P4O10$, $SO3$, $Cl2O7$ jsou oxid sodný, hořečnatý, hlinitý, křemičitý, fosforečný, sírový a chloristý. ==Skupina po skupině roste oxidační číslo od I do VII a koncovky jdou přesně za sebou.==',
        },
        { type: 'p', text: 'Jak moc na koncovce záleží, ukazují dva oxidy síry, které se liší jediným atomem kyslíku:' },
        {
          type: 'molecule',
          molecules: ['SO2', 'SO3'],
          labels: ['oxid siřičitý ($S^{IV}$)', 'oxid sírový ($S^{VI}$)'],
          caption: 'Jeden kyslík navíc, jiné oxidační číslo, jiná koncovka.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nepravidelné kmeny',
          text: 'Koncovka se připojuje ke kmeni českého názvu prvku a ten se občas změní: hořčík → hořečnatý, vápník → vápenatý, draslík → draselný, zinek → zinečnatý, uhlík → uhelnatý a uhličitý, síra → siřičitý a sírový, nikl → nikelnatý, cín → cínatý a cíničitý.',
        },
        { type: 'game', gameId: 'quickfire', text: 'Procvič si koncovky na čas: kolik oxidačních čísel přiřadíš za 60 sekund?' },
        { type: 'p', text: 'Koncovky tedy převádějí oxidační číslo na slovo. Teď je použijeme naplno: z názvu sestavíme vzorec.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jaká koncovka patří oxidačnímu číslu VI?',
            accept: ['-ový', 'ový', '-ová', 'ová'],
            placeholder: '-…',
            explain: 'Oxidační číslo VI má koncovku -ový, jako oxid sírový $SO3$ nebo oxid chromový $CrO3$.',
          },
        },
      ],
    },
    {
      title: 'Křížové pravidlo: od názvu ke vzorci',
      icon: 'cross',
      blocks: [
        { type: 'p', text: 'Název jako „oxid hlinitý“ obsahuje všechno, co ke vzorci potřebuješ. Stačí vědět, co která jeho část prozrazuje:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Podstatné jméno',
              icon: 'ion-minus',
              tone: 'a',
              points: ['oxid, chlorid, sulfid…', 'elektronegativnější složka', 'záporné oxidační číslo', 've vzorci na druhém místě'],
            },
            {
              title: 'Přídavné jméno',
              icon: 'ion-plus',
              tone: 'b',
              points: ['sodný, železitý, uhličitý…', 'elektropozitivnější složka', 'koncovka prozradí kladné oxidační číslo', 've vzorci **na prvním místě**'],
            },
          ],
          caption: 'Název dvouprvkové sloučeniny má dvě části.',
        },
        { type: 'p', text: 'Z obou částí názvu tedy znáš oxidační čísla obou prvků. Vzorec z nich sestavíš v pěti krocích:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'pencil', title: 'Napiš značky', text: 'nejdřív prvek z přídavného jména, pak z podstatného' },
            { icon: 'book', title: 'Nad ně oxidační čísla', text: 'kladné z koncovky, záporné z podstatného jména (oxid −II, sulfid −II, chlorid −I)' },
            { icon: 'cross', title: 'Do kříže', text: 'oxidační číslo jednoho prvku (bez znaménka) napiš jako index ke druhému' },
            { icon: 'calculator', title: 'Zkrať', text: 'indexy se společným dělitelem vyděl; index 1 se nepíše' },
            { icon: 'check', title: 'Kontrola', text: 'součet oxidačních čísel musí být 0' },
          ],
        },
        { type: 'p', text: 'Proč se čísla kříží? Indexy musí být takové, aby se kladná a záporná oxidační čísla vyrušila, a křížem to vyjde vždy. Na oxidu hlinitém to vypadá takto:' },
        {
          type: 'structure',
          art: art(' III    −II', '  Al     O', '    ╲   ╱', '     ╲ ╱', '      ╳', '     ╱ ╲', '  Al₂     O₃    →    Al₂O₃'),
          caption: 'Křížové pravidlo pro oxid hlinitý: trojka od hliníku jde ke kyslíku, dvojka od kyslíku k hliníku.',
        },
        { type: 'p', text: 'Někdy vyjdou indexy se společným dělitelem. Pak přijde ke slovu čtvrtý krok, krácení:' },
        {
          type: 'example',
          title: 'Oxid uhličitý',
          problem: 'Napiš vzorec oxidu uhličitého.',
          steps: ['-ičitý znamená IV: $C^{IV}$; oxid znamená $O^{−II}$.', 'Do kříže: $C2O4$', 'Oba indexy vydělíme dvěma: $CO2$', 'Kontrola: +4 + 2 · (−2) = 0'],
          answer: '$CO2$',
        },
        { type: 'p', text: 'A když je jedno z oxidačních čísel 1, odpovídající index se nepíše:' },
        {
          type: 'example',
          title: 'Chlorid železitý',
          problem: 'Napiš vzorec chloridu železitého.',
          steps: ['-itý znamená III: $Fe^{III}$; chlorid znamená $Cl^{−I}$.', 'Do kříže: železo dostane index 1 (ten se nepíše), chlor index 3.', 'Kontrola: +3 + 3 · (−1) = 0'],
          answer: '$FeCl3$',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Krátit indexy se nesmí u peroxidů, například u peroxidu vodíku $H2O2$. Proč, uvidíš v další lekci.',
        },
        { type: 'p', text: 'Z názvu teď napíšeš vzorec. Zbývá opačný směr: ze vzorce název.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec oxidu manganistého.',
            accept: ['Mn2O7'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: '-istý znamená VII: $Mn^{VII}$ a $O^{−II}$. Do kříže dostaneš $Mn2O7$ a krátit nejde.',
          },
        },
      ],
    },
    {
      title: 'Od vzorce k názvu',
      icon: 'magnifier',
      blocks: [
        { type: 'p', text: 'Opačný směr je jako křížové pravidlo pozpátku. Oxidační číslo prvního prvku neznáš, ale dopočítáš ho ze záporné složky, jejíž oxidační číslo znáš:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'ion-minus', title: 'Záporná složka', text: 'z jejího známého oxidačního čísla spočítej celkový záporný „náboj“' },
            { icon: 'ion-plus', title: 'Rozděl kladný náboj', text: 'stejně velký kladný si rozdělí atomy prvního prvku' },
            { icon: 'book', title: 'Koncovka', text: '==oxidační číslo prvního prvku přelož na koncovku==' },
          ],
          caption: 'Opačný směr: od vzorce k názvu.',
        },
        { type: 'p', text: 'Vyzkoušej to na oxidu železa, hlavní složce rudy hematitu:' },
        {
          type: 'example',
          title: 'Hematit a červený pigment',
          problem: 'Pojmenuj $Fe2O3$.',
          steps: ['Tři kyslíky: 3 · (−2) = −6', 'Dva atomy železa musí mít dohromady +6, každý tedy +3.', 'III znamená koncovku -itý.'],
          answer: 'oxid železitý',
        },
        { type: 'p', text: 'Když je ve vzorci jen jeden atom kovu, je výpočet ještě kratší:' },
        {
          type: 'example',
          title: 'Galenit',
          problem: 'Pojmenuj $PbS$, hlavní rudu olova.',
          steps: ['Sulfid má −II.', 'Jediný atom olova tedy má +2.', 'II znamená koncovku -natý.'],
          answer: 'sulfid olovnatý',
        },
        { type: 'p', text: 'Teď se vrátíme k otázce z úvodu. Stejné dva prvky mohou tvořit víc sloučenin a v názvu je odliší jedině koncovka:' },
        {
          type: 'table',
          headers: ['Vzorec', 'Výpočet', 'Název'],
          rows: [
            ['$FeCl2$', '2 · (−1) = −2, Fe je II', 'chlorid železnatý'],
            ['$FeCl3$', '3 · (−1) = −3, Fe je III', 'chlorid železitý'],
            ['$PbO2$', '2 · (−2) = −4, Pb je IV', 'oxid olovičitý'],
            ['$Cu2O$', '−2 na dva atomy Cu, Cu je I', 'oxid měďný'],
          ],
          caption: 'Stejné prvky, různá oxidační čísla, různé názvy.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Chlorid železitý $FeCl3$ se používá k leptání měděných plošných spojů v elektronice. Při leptání se mění na chlorid železnatý $FeCl2$. Proto je dobré názvy přesně rozlišovat.',
        },
        { type: 'p', text: 'Teď umíš převádět vzorec na název a zpátky. V příští lekci tuto dovednost použiješ na celé rodiny sloučenin: oxidy, sulfidy, hydridy a další.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj sloučeninu $Cu2O$.',
            accept: ['oxid měďný'],
            placeholder: 'název',
            explain: 'Kyslík −II rozdělený na dva atomy mědi dává každému +I. Koncovka pro I je -ný: oxid měďný.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který vzorec patří oxidu dusičitému?',
            options: ['$NO2$', '$N2O5$', '$NO$', '$N2O$'],
            answer: 0,
            explain: '-ičitý znamená IV. $N^{IV}$ a $O^{−II}$ dávají do kříže $N2O4$, po zkrácení $NO2$. $N2O5$ je oxid dusičný, $NO$ dusnatý a $N2O$ dusný.',
          },
        },
      ],
    },
  ],
  summary: [
    'Oxidační číslo je myšlený náboj atomu, pokud přidělíme vazebné elektrony elektronegativnějšímu atomu; píše se římskými číslicemi.',
    'Prvky mají oxidační číslo 0, fluor −I, kyslík obvykle −II, vodík obvykle +I.',
    'Součet oxidačních čísel je v molekule 0 a v iontu se rovná jeho náboji.',
    'Koncovky pro I až VIII: -ný, -natý, -itý, -ičitý, -ičný/-ečný, -ový, -istý, -ičelý.',
    'Z názvu napíšeš vzorec křížovým pravidlem a indexy zkrátíš (kromě peroxidů).',
    'Z vzorce odvodíš název tak, že záporný součet rozdělíš mezi atomy prvního prvku.',
  ],
  quiz: [
    {
      kind: 'tf',
      q: 'Fluor má ve všech sloučeninách oxidační číslo −I.',
      answer: true,
      explain: 'Fluor je nejelektronegativnější prvek, takže si vazebné elektrony vždy přitáhne. Ve sloučeninách má vždy −I.',
    },
    {
      kind: 'number',
      q: 'Urči oxidační číslo síry v $Na2SO3$. Napiš ho arabskou číslicí.',
      answer: 4,
      explain: '2 · (+1) + x + 3 · (−2) = 0, tedy x = +4. Síra má oxidační číslo IV.',
    },
    {
      kind: 'text',
      q: 'Jaké oxidační číslo má vodík v hydridu sodném $NaH$?',
      accept: ['−I', '-I', '−1', '-1'],
      placeholder: 'např. +I',
      explain: 'V hydridech kovů je vodík elektronegativnější než kov, proto má oxidační číslo −I. Sodík má jako vždy +I.',
    },
    {
      kind: 'match',
      q: 'Přiřaď oxidační číslo ke koncovce.',
      pairs: [
        ['II', '-natý'],
        ['IV', '-ičitý'],
        ['VI', '-ový'],
        ['VII', '-istý'],
        ['VIII', '-ičelý'],
      ],
      explain: 'Celá řada zní: I -ný, II -natý, III -itý, IV -ičitý, V -ičný, VI -ový, VII -istý, VIII -ičelý.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec oxidu olovičitého.',
      accept: ['PbO2'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: '-ičitý znamená IV: $Pb^{IV}$ a $O^{−II}$ dávají $Pb2O4$, po zkrácení $PbO2$.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj sloučeninu $FeCl3$.',
      accept: ['chlorid železitý'],
      placeholder: 'název',
      explain: 'Tři chloridy mají dohromady −3, železo tedy +III. Koncovka -itý: chlorid železitý.',
    },
    {
      kind: 'choice',
      q: 'Čím se liší zápisy $Fe^{3+}$ a $Fe^{III}$?',
      options: [
        '$Fe^{3+}$ je skutečný náboj iontu, $Fe^{III}$ oxidační číslo atomu.',
        'Nijak, jsou to dva zápisy téhož.',
        '$Fe^{3+}$ je oxidační číslo, $Fe^{III}$ náboj iontu.',
        '$Fe^{III}$ znamená tři atomy železa.',
      ],
      answer: 0,
      explain: 'Náboj iontu se píše arabskou číslicí se znaménkem za ní. Oxidační číslo římskou číslicí a má ho každý atom ve sloučenině, i v molekule.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých částicích má síra oxidační číslo VI?',
      options: ['$SO3$', '$SO2$', '$H2SO4$', '$H2S$', '$SO4^2-$'],
      answers: [0, 2, 4],
      explain: 'V $SO3$, $H2SO4$ i $SO4^2-$ vychází x = +6. V $SO2$ má síra IV a v $H2S$ −II.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-6 Názvosloví dvouprvkových sloučenin
// ─────────────────────────────────────────────────────────────
const l36: Lesson = {
  id: 'l3-6',
  title: 'Názvosloví dvouprvkových sloučenin',
  goals: [
    'Pojmenovat oxidy, peroxidy, halogenidy, sulfidy, hydridy, nitridy a karbidy, napsat jejich vzorce a vysvětlit, proč se vzorec peroxidu nekrátí',
    'Používat triviální názvy (voda, amoniak, methan, sulfan) a poznat běžné sloučeniny jako $CO2$, $SiO2$, $Fe2O3$ nebo $CaO$',
    'Rozlišit názvem sloučeniny prvků s více oxidačními čísly, např. $FeO$ × $Fe2O3$ a $CuCl$ × $CuCl2$',
    'Pojmenovat jednoduché kationty a anionty včetně amonného, hydroxidového a kyanidového',
  ],
  hook: 'Písek, rez, kuchyňská sůl, bublinky v limonádě i pálené vápno na stavbě jsou dvouprvkové sloučeniny. S tím, co už umíš, jim dáš jméno i vzorec za pár vteřin. Pojďme z tebe udělat názvoslovného mistra!',
  sections: [
    {
      title: 'Jak vzniká název',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: 'V minulé lekci jsi převáděl/a vzorce na názvy a zpátky. Teď tuto dovednost použiješ na všechny rodiny dvouprvkových sloučenin. **Dvouprvková** (binární) **sloučenina** se skládá ze dvou prvků a její název má dvě slova. ==Podstatné jméno s koncovkou **-id** patří elektronegativnější složce, přídavné jméno s koncovkou podle oxidačního čísla té elektropozitivnější.== Rozeberme to na páleném vápně z úvodu:',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'oxid',
              icon: 'ion-minus',
              tone: 'a',
              points: ['podstatné jméno s koncovkou -id', 'elektronegativnější složka', 'záporné oxidační číslo: $O^{−II}$'],
            },
            {
              title: 'vápenatý',
              icon: 'ion-plus',
              tone: 'b',
              points: ['přídavné jméno', 'elektropozitivnější složka', 'koncovka -natý = $Ca^{II}$'],
            },
          ],
          caption: 'Oxid vápenatý $CaO$ rozebraný na dvě části názvu.',
        },
        { type: 'p', text: 'Koncovku přídavného jména už znáš. Podstatné jméno závisí na tom, který prvek je elektronegativnější složkou – tady je celý přehled:' },
        {
          type: 'table',
          headers: ['Podstatné jméno', 'Záporná složka', 'Příklad'],
          rows: [
            ['oxid', '$O^{−II}$', '$CaO$ oxid vápenatý'],
            ['peroxid', 'skupina $O2$ (–O–O–), každý O −I', '$H2O2$ peroxid vodíku'],
            ['fluorid, chlorid, bromid, jodid', 'F, Cl, Br, I −I', '$KBr$ bromid draselný'],
            ['sulfid', '$S^{−II}$', '$PbS$ sulfid olovnatý'],
            ['hydrid', '$H^{−I}$', '$NaH$ hydrid sodný'],
            ['nitrid', '$N^{−III}$', '$Li3N$ nitrid lithný'],
            ['karbid', '$C^{−IV}$', '$SiC$ karbid křemičitý'],
          ],
          caption: 'Fluoridy, chloridy, bromidy a jodidy se souhrnně nazývají **halogenidy**.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'O tom, kdo dostane koncovku -id, rozhoduje elektronegativita. Proto $OF2$ není oxid fluoru, ale fluorid kyslíku (přesněji difluorid kyslíku): fluor je elektronegativnější, má −I a kyslík tu výjimečně +II.',
        },
        { type: 'p', text: 'Tabulka je mapou celé lekce. Projdeme ji rodinu po rodině a začneme těmi nejběžnějšími, oxidy.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k podstatnému jménu oxidační číslo záporné složky.',
            pairs: [
              ['oxid', '−II'],
              ['chlorid', '−I'],
              ['nitrid', '−III'],
              ['karbid', '−IV'],
            ],
            explain: 'Oxidační číslo záporné složky zjistíš jako číslo skupiny minus 18: O a S −II, halogeny −I, N −III, C −IV.',
          },
        },
      ],
    },
    {
      title: 'Oxidy',
      icon: 'rust',
      blocks: [
        {
          type: 'p',
          text: '**Oxidy** jsou sloučeniny kyslíku s jiným prvkem, kyslík v nich má −II. Najdeš je v horninách, ve vzduchu a oxidem vodíku je koneckonců i voda. Tady jsou ty, na které narazíš nejčastěji:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'plastic-bottle', title: '$CO2$ oxid uhličitý', text: 'vydechuješ ho, bublinky v limonádě, skleníkový plyn' },
            { icon: 'flame', title: '$CO$ oxid uhelnatý', text: 'jedovatý plyn z nedokonalého hoření' },
            { icon: 'glass', title: '$SiO2$ oxid křemičitý', text: 'písek, křemen, sklo' },
            { icon: 'rust', title: '$Fe2O3$ oxid železitý', text: 'hematit, červený pigment, hlavní složka rzi' },
            { icon: 'powder', title: '$CaO$ oxid vápenatý', text: 'pálené vápno na stavbě' },
            { icon: 'ring', title: '$Al2O3$ oxid hlinitý', text: 'ochranná vrstvička na hliníku, rubín a safír' },
            { icon: 'volcano', title: '$SO2$ oxid siřičitý', text: 'sopky, spalování uhlí, kyselé deště' },
            { icon: 'gas-cylinder', title: '$N2O$ oxid dusný', text: '„rajský plyn“ v bombičkách do šlehačky' },
          ],
        },
        { type: 'p', text: 'Oxidy kovů jsou většinou pevné látky, oxidy nekovů naopak často tvoří malé molekuly. Prohlédni si čtyři z nich:' },
        {
          type: 'molecule',
          molecules: ['CO2', 'CO', 'SO2', 'NO2'],
          labels: ['oxid uhličitý', 'oxid uhelnatý', 'oxid siřičitý', 'oxid dusičitý: hnědý plyn z výfuků'],
          caption: 'Tyto čtyři molekulové oxidy nekovů jsou za běžných podmínek plyny.',
        },
        { type: 'p', text: 'Vzorec oxidu napíšeš z názvu křížovým pravidlem. Zopakujme postup na oxidu, který ještě neznáš:' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'book', title: 'Název', text: 'oxid chromitý (zelený pigment do barev)' },
            { icon: 'calculator', title: 'Oxidační čísla', text: '-itý znamená III: $Cr^{III}$, oxid $O^{−II}$' },
            { icon: 'cross', title: 'Do kříže', text: 'chrom dostane index 2, kyslík 3; krátit nejde' },
            { icon: 'check', title: 'Kontrola', text: '2 · (+3) + 3 · (−2) = 0, vzorec $Cr2O3$' },
          ],
          caption: 'Název → vzorec křížovým pravidlem.',
        },
        { type: 'p', text: 'A opačně, ze vzorce název – tentokrát pro oxid z alkalické baterie:' },
        {
          type: 'example',
          title: 'Vzorec → název',
          problem: 'Pojmenuj $MnO2$, černou látku z alkalických baterií.',
          steps: ['Dva kyslíky: 2 · (−2) = −4', 'Jediný mangan má +4.', 'IV znamená koncovku -ičitý.'],
          answer: 'oxid manganičitý',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Oxid uhelnatý $CO$ nemá barvu ani zápach a už malé množství ve vzduchu je smrtelné. Proto patří k plynovým kotlům a karmám detektor CO. Pálené vápno $CaO$ zase s vodou prudce reaguje za vývoje tepla, dráždí kůži a vážně poškozuje oči: pracuj s ním jen v rukavicích a brýlích.',
        },
        { type: 'p', text: 'Oxidy teď pojmenuješ oběma směry. Kyslík ale tvoří i sloučeniny, kde jsou dva jeho atomy vázané k sobě, a v nich se pravidla trochu mění.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec oxidu železitého.',
            accept: ['Fe2O3'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: '-itý znamená III: $Fe^{III}$ a $O^{−II}$ dávají do kříže $Fe2O3$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj oxid $SO3$.',
            accept: ['oxid sírový'],
            placeholder: 'název',
            explain: 'Tři kyslíky mají −6, síra tedy +VI. Koncovka pro VI je -ový: oxid sírový. Pozor, $SO2$ je oxid siřičitý.',
          },
        },
      ],
    },
    {
      title: 'Peroxidy',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Peroxidy vypadají jako oxidy s kyslíkem navíc, ale je v nich zásadní rozdíl. **Peroxidy** obsahují dvojici navzájem vázaných atomů kyslíku –O–O–, tedy peroxidový anion $O2^2-$. ==Každý kyslík v peroxidu má oxidační číslo −I.== Nejznámější je peroxid vodíku:',
        },
        {
          type: 'structure',
          art: art('    ··  ··', ' H — O — O — H', '    ··  ··'),
          caption: 'Peroxid vodíku $H2O2$: mezi atomy kyslíku je jednoduchá vazba.',
        },
        { type: 'p', text: 'Ve 3D je rozdíl proti vodě vidět na první pohled: místo jednoho kyslíku dva, spojené spolu.' },
        {
          type: 'molecule',
          molecules: ['H2O', 'H2O2'],
          labels: ['voda: oxid vodíku, $O^{−II}$', 'peroxid vodíku: –O–O–, $O^{−I}$'],
        },
        { type: 'p', text: 'Pozor, tady se chybuje nejčastěji: vzorec peroxidu nekrátíme, i když by se indexy krátit daly. Proč, ukazuje srovnání s oxidy:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Oxid',
              icon: 'rust',
              tone: 'a',
              points: ['samostatné atomy kyslíku, $O^{−II}$', 'indexy se krátí', '$H2O$, $Na2O$, $BaO$ oxid barnatý'],
            },
            {
              title: 'Peroxid',
              icon: 'drop',
              tone: 'b',
              points: ['skupina –O–O–, $O^{−I}$', '**vzorec se nikdy nekrátí**: skupina O–O musí zůstat celá', '$H2O2$ (H +I), $Na2O2$ (ne $NaO$), $BaO2$ (Ba +II)'],
            },
          ],
          caption: 'Vodík tvoří jen jeden peroxid, a proto se mu říká jednoduše peroxid vodíku.',
        },
        { type: 'p', text: 'Jak poznáš peroxid jen ze vzorce? Spočítej oxidační číslo kyslíku – když vyjde −I, je to peroxid:' },
        {
          type: 'example',
          title: 'Oxid, nebo peroxid?',
          problem: 'Pojmenuj $BaO2$.',
          steps: ['Baryum je ve 2. skupině, má vždy +II.', 'Na dva kyslíky zbývá −2, každý má tedy −I.', 'Kyslík s −I znamená peroxid. Oxid barnatý by byl $BaO$.'],
          answer: 'peroxid barnatý',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Třiprocentní roztok peroxidu vodíku z lékárny dezinfikuje rány, silnější roztoky odbarvují vlasy. Na ráně pění, protože enzym z krve ho rychle rozkládá na vodu a kyslík. Koncentrovaný (30%) roztok ale leptá kůži, takže s ním jen v rukavicích a brýlích.',
        },
        { type: 'p', text: 'Peroxid tedy poznáš podle kyslíku s −I a jeho vzorec nikdy nekrátíš. Teď přijdou na řadu další záporné složky: halogeny a síra.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Peroxid sodný má vzorec $NaO$, protože indexy se vždy krátí.',
            answer: false,
            explain: 'U peroxidů se nekrátí, skupina $O2^2-$ musí zůstat celá. Správně je $Na2O2$.',
          },
        },
      ],
    },
    {
      title: 'Halogenidy a sulfidy',
      icon: 'salt',
      blocks: [
        {
          type: 'p',
          text: '**Halogenidy** jsou sloučeniny halogenů F, Cl, Br a I s oxidačním číslem −I: fluoridy, chloridy, bromidy a jodidy. **Sulfidy** jsou sloučeniny síry s oxidačním číslem −II; mnoho z nich jsou důležité rudy kovů. Halogenidy přitom potkáváš každý den:',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: '$NaCl$ chlorid sodný', text: 'kuchyňská sůl' },
            { icon: 'ice', title: '$CaCl2$ chlorid vápenatý', text: 'posyp silnic, pohlcovače vlhkosti' },
            { icon: 'toothpaste', title: '$SnF2$ fluorid cínatý', text: 'zubní pasty chránící sklovinu' },
            { icon: 'crystal', title: '$CaF2$ fluorid vápenatý', text: 'nerost fluorit (kazivec)' },
            { icon: 'sun', title: '$AgBr$ bromid stříbrný', text: 'klasický fotografický film' },
            { icon: 'pill', title: '$KI$ jodid draselný', text: 'jodové tablety pro případ jaderné havárie' },
          ],
        },
        { type: 'p', text: 'Sulfidy znáš spíš z přírody a z rud. Tady jsou nejdůležitější:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'mountain', title: '$PbS$ sulfid olovnatý', text: 'galenit, hlavní ruda olova' },
            { icon: 'mountain', title: '$ZnS$ sulfid zinečnatý', text: 'sfalerit, ruda zinku' },
            { icon: 'pencil', title: '$HgS$ sulfid rtuťnatý', text: 'rumělka, historický červený pigment' },
            { icon: 'ring', title: '$Ag2S$ sulfid stříbrný', text: 'černý povlak na stříbrných šperkech' },
          ],
        },
        { type: 'p', text: 'Vzorce halogenidů a sulfidů píšeš stejně jako u oxidů, jen záporná složka má jiné oxidační číslo. Vyzkoušej si to na jodidu:' },
        {
          type: 'example',
          title: 'Zlatý déšť',
          problem: 'Napiš vzorec jodidu olovnatého, zlatožluté sraženiny ze známého školního pokusu.',
          steps: ['-natý znamená II: $Pb^{II}$, jodid $I^{−I}$.', 'Do kříže: olovo index 1 (nepíše se), jod index 2.', 'Kontrola: +2 + 2 · (−1) = 0'],
          answer: '$PbI2$',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pokus doma',
          text: 'Zčernalý stříbrný řetízek je pokrytý sulfidem stříbrným $Ag2S$. Polož ho do misky vyložené alobalem, zasyp lžící jedlé sody a zalij horkou vodou. Za pár minut se stříbro vyjasní. Co se přitom děje, vysvětlí redoxní reakce v úrovni 6.',
        },
        { type: 'p', text: 'Halogenidy a sulfidy tedy pojmenuješ stejně jako oxidy, jen záporná složka má jiné oxidační číslo. U vodíku je to složitější: podle partnera může mít +I i −I.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec sulfidu olovnatého.',
            accept: ['PbS'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: '$Pb^{II}$ a $S^{−II}$ dávají do kříže $Pb2S2$, po zkrácení $PbS$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj sloučeninu $CuCl2$.',
            accept: ['chlorid měďnatý'],
            placeholder: 'název',
            explain: 'Dva chloridy mají −2, měď tedy +II. Koncovka pro II je -natý: chlorid měďnatý.',
          },
        },
      ],
    },
    {
      title: 'Hydridy, nitridy a karbidy',
      icon: 'gas-cylinder',
      blocks: [
        { type: 'p', text: 'Vodík je zvláštní: s kovy je elektronegativnější složkou, s nekovy naopak elektropozitivnější. Podle toho se jeho sloučeniny jmenují úplně jinak:' },
        {
          type: 'compare',
          columns: [
            {
              title: 'Hydridy kovů',
              icon: 'ion-minus',
              tone: 'a',
              points: ['iontové sloučeniny s aniontem $H^-$, vodík −I', 'hydrid sodný $NaH$, hydrid lithný $LiH$, hydrid vápenatý $CaH2$', 's vodou bouřlivě reagují a uvolňují hořlavý vodík'],
            },
            {
              title: 'Vodík s nekovy',
              icon: 'molecule',
              tone: 'b',
              points: ['molekuly, vodík +I', 'často **triviální** (zažité) **názvy**', 'vedle nich **systematické** názvy s koncovkou **-an**'],
            },
          ],
        },
        { type: 'p', text: 'U sloučenin vodíku s nekovy se proto koncovka -id nepoužívá. Mají zažité triviální názvy a vedle nich systematické:' },
        {
          type: 'table',
          headers: ['Vzorec', 'Triviální název', 'Systematický název'],
          rows: [
            ['$H2O$', 'voda', 'oxidan'],
            ['$NH3$', 'amoniak', 'azan'],
            ['$CH4$', 'methan', 'methan'],
            ['$H2S$', 'sirovodík', 'sulfan'],
            ['$PH3$', 'fosfin', 'fosfan'],
            ['$SiH4$', '–', 'silan'],
          ],
          caption: 'V praxi říkáme voda a amoniak, u $H2S$ se běžně používá název sulfan i sirovodík. Podobně jako chlorovodík se jmenují fluorovodík $HF$, bromovodík $HBr$ a jodovodík $HI$; jejich vodné roztoky jsou kyseliny (úroveň 5).',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Sulfan (sirovodík) páchne po zkažených vejcích a je velmi jedovatý. Ve vyšší koncentraci ochromí čich, takže ho náhle přestaneš cítit, i když ho ve vzduchu přibývá. Vzniká v kanalizaci, u sopek a v sirných pramenech.',
        },
        {
          type: 'p',
          text: 'Zbývají poslední dvě rodiny z tabulky na začátku lekce. **Nitridy** obsahují dusík s oxidačním číslem −III, **karbidy** uhlík s −IV. Často jsou mimořádně tvrdé a odolné: $TiN$ je zlatavý povlak vrtáků, karbid křemičitý $SiC$ (karborundum) je na brusných papírech a kotoučích. Vzorec nitridu sestavíš křížovým pravidlem jako obvykle:',
        },
        {
          type: 'example',
          title: 'Nitrid hořečnatý',
          problem: 'Napiš vzorec nitridu hořečnatého. Vzniká spolu s oxidem, když hořčík hoří na vzduchu.',
          steps: ['-natý znamená II: $Mg^{II}$, nitrid $N^{−III}$.', 'Do kříže: hořčík index 3, dusík index 2.', 'Kontrola: 3 · (+2) + 2 · (−3) = 0'],
          answer: '$Mg3N2$',
        },
        { type: 'p', text: 'Vzorec $Mg3N2$ se objeví i v rovnici, kterou nitrid vzniká:' },
        {
          type: 'reaction',
          equation: '3Mg + N2 -> Mg3N2',
          caption: 'Hořící hořčík si bere i dusík ze vzduchu.',
        },
        { type: 'p', text: 'Opačný směr funguje stejně jako u oxidů. Zkus pojmenovat karbid:' },
        {
          type: 'example',
          title: 'Karbid ze vzorce',
          problem: 'Pojmenuj $Al4C3$.',
          steps: ['Tři uhlíky: 3 · (−4) = −12', 'Čtyři atomy hliníku mají dohromady +12, každý +3.', 'III znamená koncovku -itý.'],
          answer: 'karbid hlinitý',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Karbidka',
          text: 'Karbid vápenatý $CaC2$ je výjimka: obsahuje dvojici atomů uhlíku, podobně jako peroxid dvojici kyslíků, a uhlík v něm proto nemá −IV, ale −I. S vodou uvolňuje hořlavý plyn acetylen (ethyn) $C2H2$, který svítil jeskyňářům v karbidových lampách. Acetylen je výbušný, s karbidem proto jen pod dohledem.',
        },
        { type: 'p', text: 'Reakci karbidky s vodou zapíšeš takto:' },
        {
          type: 'reaction',
          equation: 'CaC2 + 2H2O -> C2H2 + Ca(OH)2',
          caption: 'Karbid vápenatý a voda dávají acetylen $C2H2$.',
        },
        { type: 'p', text: 'Teď znáš všechny rodiny z úvodní tabulky. Zbývá jeden háček: kovy, které mají víc oxidačních čísel.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k vzorci název.',
            pairs: [
              ['$NH3$', 'amoniak'],
              ['$H2S$', 'sulfan'],
              ['$NaH$', 'hydrid sodný'],
              ['$Li3N$', 'nitrid lithný'],
              ['$SiC$', 'karbid křemičitý'],
            ],
            explain: 'Hydrid je sloučenina, kde má vodík −I, tedy s kovem; sloučeniny vodíku s nekovy mají vlastní názvy. Nitrid má $N^{−III}$, karbid $C^{−IV}$.',
          },
        },
      ],
    },
    {
      title: 'Více oxidačních čísel a názvy iontů',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Dva chloridy železa jsi koncovkou rozlišil/a už v minulé lekci. Takových dvojic je ale víc: mnoho kovů, hlavně přechodných, tvoří sloučeniny s různými oxidačními čísly. Železo se s kyslíkem slučuje jako $Fe^{II}$ i $Fe^{III}$, měď s chlorem jako $Cu^{I}$ i $Cu^{II}$. ==Jediné, co tyto látky v názvu rozliší, je koncovka.== Jak velký rozdíl dělá jedno oxidační číslo, ukazují dva oxidy železa:',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'oxid železnatý $FeO$',
              icon: 'powder',
              tone: 'a',
              points: ['železo II, koncovka -natý', 'černý prášek', 'na vzduchu se snadno oxiduje dál'],
            },
            {
              title: 'oxid železitý $Fe2O3$',
              icon: 'rust',
              tone: 'b',
              points: ['železo III, koncovka -itý', 'červenohnědý: rez, hematit', 'pigment do barev a cihel'],
            },
          ],
          caption: 'Stejné prvky, jiné oxidační číslo, úplně jiná látka.',
        },
        { type: 'p', text: 'Podobné dvojice tvoří i další kovy. Ty nejběžnější najdeš v tabulce:' },
        {
          type: 'table',
          headers: ['Prvek', 'Nižší oxidační číslo', 'Vyšší oxidační číslo'],
          rows: [
            ['Fe', '$FeCl2$ chlorid železnatý', '$FeCl3$ chlorid železitý'],
            ['Cu', '$CuCl$ chlorid měďný', '$CuCl2$ chlorid měďnatý'],
            ['Cu', '$Cu2O$ oxid měďný (červený)', '$CuO$ oxid měďnatý (černý)'],
            ['Sn', '$SnCl2$ chlorid cínatý', '$SnCl4$ chlorid cíničitý'],
            ['Pb', '$PbO$ oxid olovnatý', '$PbO2$ oxid olovičitý'],
          ],
          caption: 'Dvojice sloučenin, které se liší jen oxidačním číslem kovu.',
        },
        { type: 'p', text: 'Jak to poznáš ze vzorce? Spočítej oxidační číslo kovu a podle něj zvol koncovku:' },
        {
          type: 'example',
          title: 'Dva chloridy mědi',
          problem: 'Pojmenuj $CuCl$ a $CuCl2$.',
          steps: [
            '$CuCl$: jeden chlor má −I, měď tedy +I. Koncovka pro I je -ný.',
            '$CuCl2$: dva chlory mají −2, měď tedy +II. Koncovka pro II je -natý.',
          ],
          answer: '$CuCl$ je chlorid měďný, $CuCl2$ chlorid měďnatý',
        },
        {
          type: 'p',
          text: 'Stejné koncovky používáme i pro samotné ionty. **Kation** jednoho prvku pojmenuješ přídavným jménem se stejnou koncovkou jako ve sloučenině: $Na^+$ je sodný kation, $Fe^{2+}$ železnatý a $Fe^{3+}$ železitý kation. **Anion** jednoho prvku dostane koncovku **-idový**: $Cl^-$ chloridový, $O^{2-}$ oxidový, $S^{2-}$ sulfidový anion. Některé víceatomové ionty mají vlastní názvy, které si stačí zapamatovat:',
        },
        {
          type: 'table',
          headers: ['Ion', 'Název', 'Sloučenina s tímto iontem'],
          rows: [
            ['$NH4^+$', 'amonný kation', '$NH4Cl$ chlorid amonný (salmiak)'],
            ['$H3O^+$', 'oxoniový kation', 'je v každém roztoku kyseliny (úroveň 5)'],
            ['$OH^-$', 'hydroxidový anion', '$NaOH$ hydroxid sodný (úroveň 5)'],
            ['$CN^-$', 'kyanidový anion', '$KCN$ kyanid draselný'],
            ['$O2^2-$', 'peroxidový anion', '$Na2O2$ peroxid sodný'],
          ],
          caption: 'Víceatomové ionty s vlastními názvy. Sloučeniny s nimi se jmenují stejně jako dvouprvkové: podstatné jméno podle aniontu, přídavné podle kationtu.',
        },
        { type: 'p', text: 'Amonný a oxoniový kation znáš z lekce o koordinační vazbě, hydroxidový anion z formálního náboje. Prohlédni si je ve 3D:' },
        {
          type: 'molecule',
          molecules: ['NH4+', 'H3O+', 'OH-'],
          labels: ['amonný kation', 'oxoniový kation', 'hydroxidový anion'],
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Kyanidy jsou prudce jedovaté: už desetiny gramu kyanidu draselného zastaví v buňkách dýchání. Patří jen do přísně zabezpečených laboratoří.',
        },
        { type: 'game', gameId: 'naming', text: 'Teď už víš všechno potřebné. Vyzkoušej si v trenažéru převody vzorec ↔ název u oxidů, halogenidů a dalších sloučenin.' },
        { type: 'p', text: 'Teď umíš pojmenovat dvouprvkové sloučeniny i jednoduché ionty. V příští úrovni je začneš používat v chemických rovnicích a výpočtech.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k iontu jeho název.',
            pairs: [
              ['$NH4^+$', 'amonný kation'],
              ['$OH^-$', 'hydroxidový anion'],
              ['$CN^-$', 'kyanidový anion'],
              ['$Fe^{3+}$', 'železitý kation'],
            ],
            explain: 'Kationty kovů mají koncovku podle náboje (III: -itý), anionty jednoho prvku koncovku -idový. Amonný, hydroxidový a kyanidový jsou názvy, které si stačí zapamatovat.',
          },
        },
      ],
    },
  ],
  summary: [
    'Název dvouprvkové sloučeniny tvoří podstatné jméno s koncovkou -id a přídavné jméno s koncovkou podle oxidačního čísla.',
    'Oxidy (O −II), halogenidy (−I), sulfidy (S −II), hydridy (H −I), nitridy (N −III) a karbidy (C −IV).',
    'Peroxidy obsahují skupinu –O–O– s kyslíkem −I a jejich vzorec se nekrátí: $H2O2$, $Na2O2$, $BaO2$.',
    'Sloučeniny vodíku s nekovy mají vlastní názvy: voda, amoniak (azan), methan, sulfan (sirovodík), chlorovodík.',
    'Z běžného života znáš $CO2$ (oxid uhličitý), $SiO2$ (písek), $Fe2O3$ (oxid železitý), $NaCl$ (sůl) a $CaO$ (pálené vápno).',
    'Prvky s více oxidačními čísly rozliší koncovka: $FeO$ je oxid železnatý, $Fe2O3$ oxid železitý, $CuCl$ chlorid měďný a $CuCl2$ chlorid měďnatý.',
    'Kationty mají koncovku podle oxidačního čísla ($Fe^{3+}$ železitý kation), anionty jednoho prvku koncovku -idový ($Cl^-$ chloridový); víceatomové ionty jsou amonný $NH4^+$, oxoniový $H3O^+$, hydroxidový $OH^-$ a kyanidový $CN^-$.',
  ],
  quiz: [
    {
      kind: 'text',
      q: 'Napiš vzorec sulfidu zinečnatého.',
      accept: ['ZnS'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: '$Zn^{II}$ a $S^{−II}$ dávají po zkrácení $ZnS$.',
    },
    {
      kind: 'text',
      q: 'Pojmenuj sloučeninu $FeO$.',
      accept: ['oxid železnatý'],
      placeholder: 'název',
      explain: 'Kyslík má −II, jediný atom železa tedy +II. Koncovka pro II je -natý: oxid železnatý. Rez $Fe2O3$ je oxid železitý.',
    },
    {
      kind: 'tf',
      q: 'V peroxidu vodíku $H2O2$ má kyslík oxidační číslo −I.',
      answer: true,
      explain: 'Dva vodíky mají +2, na dva kyslíky tedy zbývá −2, každý má −I. To je znak peroxidu.',
    },
    {
      kind: 'tf',
      q: 'Sulfid olovnatý má vzorec $PbS2$.',
      answer: false,
      explain: 'Olovnatý znamená II, sulfid −II. Náboje se vyrovnají v poměru 1 : 1, vzorec je $PbS$.',
    },
    {
      kind: 'match',
      q: 'Přiřaď k vzorci název.',
      pairs: [
        ['$SiO2$', 'oxid křemičitý'],
        ['$Mg3N2$', 'nitrid hořečnatý'],
        ['$CaH2$', 'hydrid vápenatý'],
        ['$HgS$', 'sulfid rtuťnatý'],
      ],
      explain: 'Vždy nejdřív urči druh sloučeniny podle záporné složky, pak z vzorce spočítej oxidační číslo kovu nebo křemíku.',
    },
    {
      kind: 'multi',
      q: 'Které dvojice vzorec – název jsou správně?',
      options: ['$H2S$ – sulfan', '$NaH$ – hydrid sodný', '$N2O$ – oxid dusnatý', '$Na2O2$ – peroxid sodný', '$CO$ – oxid uhličitý'],
      answers: [0, 1, 3],
      explain: '$N2O$ je oxid dusný (dusík I), oxid dusnatý je $NO$. $CO$ je oxid uhelnatý, oxid uhličitý je $CO2$.',
    },
    {
      kind: 'choice',
      q: 'Který vzorec patří chloridu cíničitému?',
      options: ['$SnCl4$', '$SnCl2$', '$Sn2Cl$', '$SnCl$'],
      answer: 0,
      explain: '-ičitý znamená IV: $Sn^{IV}$ a $Cl^{−I}$ dávají $SnCl4$. $SnCl2$ je chlorid cínatý.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec chloridu amonného (salmiaku).',
      accept: ['NH4Cl'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: 'Amonný kation $NH4^+$ má náboj 1+, chloridový anion $Cl^-$ 1−. Poměr 1 : 1 dává $NH4Cl$.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// Závěrečná výzva úrovně 3
// ─────────────────────────────────────────────────────────────
const boss: Question[] = [
  {
    kind: 'order',
    q: 'Seřaď vazby od nejméně po nejvíce polární. (X: H 2,20; C 2,55; N 3,04; O 3,44; F 3,98)',
    items: ['$C–H$', '$N–H$', '$O–H$', '$F–H$'],
    explain: 'ΔX postupně roste: 0,35 < 0,84 < 1,24 < 1,78. Čím elektronegativnější partner vodíku, tím polárnější vazba.',
  },
  {
    kind: 'multi',
    q: 'Které molekuly mají polární vazby, a přesto jsou jako celek nepolární?',
    options: ['$CO2$', '$CCl4$', '$BF3$', '$NH3$', '$H2O$'],
    answers: [0, 1, 2],
    explain: 'Lineární $CO2$, tetraedrický $CCl4$ i rovinný trojúhelníkový $BF3$ jsou souměrné, dipóly se vyruší. $NH3$ (pyramida) a $H2O$ (lomená) souměrné nejsou.',
  },
  {
    kind: 'number',
    q: 'Kolik vazeb π obsahuje molekula kyanovodíku $HCN$ (vazby $H–C≡N$)?',
    answer: 2,
    explain: 'Jednoduchá vazba $H–C$ je jen σ. Trojná vazba $C≡N$ má jednu σ a dvě π. Celkem jsou tedy v molekule 2 vazby π.',
  },
  {
    kind: 'choice',
    q: 'Všechny tři vazby C–O v uhličitanovém aniontu $CO3^2-$ jsou stejně dlouhé. Jak to vysvětlíš?',
    options: [
      'Ion je rezonanční hybrid: elektrony dvojné vazby jsou delokalizované přes všechny tři kyslíky.',
      'Dvojná vazba mezi uhlíkem a kyslíky velmi rychle přeskakuje.',
      'Uhlík je vázán se všemi třemi kyslíky dvojnými vazbami.',
      'Všechny tři vazby jsou jednoduché a náboj nese uhlík.',
    ],
    answer: 0,
    explain: 'Lewisův vzorec má jednu dvojnou a dvě jednoduché vazby, ale existují 3 rovnocenné rezonanční struktury. Skutečný ion je jejich hybrid, nic nepřeskakuje. Tři dvojné vazby by uhlíku daly 12 elektronů.',
  },
  {
    kind: 'match',
    q: 'Přiřaď k atomu jeho hybridizaci.',
    pairs: [
      ['uhlík v ethanu $C2H6$', 'sp³'],
      ['bor v $BF3$', 'sp²'],
      ['uhlík v $HCN$', 'sp'],
      ['síra v $SF6$', 'sp³d²'],
    ],
    explain: 'Hybridizaci určuje počet elektronových oblastí: 4 sp³, 3 sp², 2 sp (uhlík v $HCN$ má jednoduchou a trojnou vazbu), 6 sp³d².',
  },
  {
    kind: 'tf',
    q: 'V molekule $PCl5$ svírají všechny sousední vazby $Cl–P–Cl$ stejný úhel.',
    answer: false,
    explain: 'Trigonální bipyramida má dva druhy poloh: tři chlory v rovině svírají 120°, dva osové chlory jsou k nim kolmo (90°).',
  },
  {
    kind: 'choice',
    q: 'Která z látek má nejvyšší teplotu varu?',
    options: ['$HF$', '$HCl$', '$HBr$', '$HI$'],
    answer: 0,
    explain: 'Fluorovodík vře při 20 °C díky vodíkovým vazbám. Z ostatních má nejvyšší teplotu varu $HI$ (−35 °C), protože má nejvíc elektronů a nejsilnější Londonovy síly.',
  },
  {
    kind: 'match',
    q: 'Co je potřeba překonat při tání nebo varu dané látky?',
    pairs: [
      ['jod $I2$', 'Londonovy disperzní síly'],
      ['chlorid sodný', 'iontové vazby'],
      ['led', 'vodíkové vazby'],
      ['diamant', 'kovalentní vazby'],
      ['železo', 'kovovou vazbu'],
    ],
    explain: 'U molekulových látek se překonávají jen mezimolekulové síly. U iontových, kovových látek a kovalentních krystalů se musí oslabit či rozbít samotné vazby, proto tají mnohem výš.',
  },
  {
    kind: 'number',
    q: 'Urči oxidační číslo manganu v mangananu draselném $K2MnO4$. Napiš ho arabskou číslicí.',
    answer: 6,
    explain: '2 · (+1) + x + 4 · (−2) = 0, tedy x = +6. Srovnej s $KMnO4$, kde má mangan VII.',
  },
  {
    kind: 'text',
    q: 'Pojmenuj oxid $N2O3$.',
    accept: ['oxid dusitý'],
    placeholder: 'název',
    explain: 'Tři kyslíky mají −6, dva dusíky tedy dohromady +6, každý +III. Koncovka -itý: oxid dusitý.',
  },
  {
    kind: 'multi',
    q: 'Které vzorce jsou zapsány správně?',
    options: ['oxid osmičelý $OsO4$', 'nitrid hořečnatý $Mg3N2$', 'peroxid barnatý $BaO$', 'sulfid stříbrný $AgS$', 'hydrid vápenatý $CaH2$'],
    answers: [0, 1, 4],
    explain: 'Peroxid barnatý je $BaO2$ (vzorec $BaO$ patří oxidu barnatému). Stříbro má I, sulfid −II, takže sulfid stříbrný je $Ag2S$.',
  },
  {
    kind: 'choice',
    q: 'Neznámá látka tvoří tvrdé, ale křehké krystaly s teplotou tání přes 2000 °C. V pevném stavu proud nevede, jako tavenina ano. Jaká vazba v ní převládá?',
    options: ['iontová', 'kovová', 'kovalentní v celém krystalu', 'slabé síly mezi molekulami'],
    answer: 0,
    explain: 'Vodivost jen v tavenině prozrazuje ionty, které se v tavenině uvolní. Kov by vedl i pevný a kovalentní krystal ani molekulová látka ionty nemají. Příkladem je $MgO$.',
  },
]

const level: LevelContent = {
  lessons: {
    'l3-1': l31,
    'l3-2': l32,
    'l3-7': l37,
    'l3-3': l33,
    'l3-4': l34,
    'l3-5': l35,
    'l3-6': l36,
  },
  boss,
}

export default level
