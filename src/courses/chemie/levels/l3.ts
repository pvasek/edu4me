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
    'Vysvětlit, proč vznik chemické vazby snižuje energii soustavy',
    'Popsat vztah mezi délkou vazby a vazebnou energií',
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
          text: 'Z úrovně 2 víš, že vzácné plyny mají stálý **oktet** (helium dvojici). Ostatní atomy se k podobnému stavu dopracují přes **chemickou vazbu**, tedy soudržné působení, které drží atomy pohromadě.',
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
          text: '==Když vznikne vazba, energie soustavy klesne a přebytek se uvolní, často jako teplo nebo světlo.== Je to jako kulička, která se skutálí do důlku a sama už nevyleze.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'atom', title: 'Daleko od sebe', text: 'dva atomy vodíku se ještě neovlivňují' },
            { icon: 'magnet', title: 'Přibližují se', text: 'elektron každého atomu přitahuje i jádro souseda, energie klesá' },
            { icon: 'bond', title: 'Energetické minimum', text: 'nejvýhodnější vzdálenost: vznikla vazba s určitou délkou' },
            { icon: 'explosion', title: 'Příliš blízko', text: 'kladná jádra se začnou odpuzovat a energie prudce roste' },
          ],
          caption: 'Co se děje, když se k sobě blíží dva atomy vodíku.',
        },
        {
          type: 'structure',
          art: art(
            'E ↑',
            '  │ \\',
            '  │  \\',
            '0 ┼───\\──────────────────',
            '  │    \\           ___',
            '  │     \\       __/',
            '  │      \\_____/',
            '  │         ↑ délka vazby',
            '  └──────────────────────→ r',
          ),
          caption: 'Energie dvojice atomů podle jejich vzdálenosti r. Vazba vzniká v minimu křivky; hloubka minima odpovídá vazebné energii.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'chemická vazba', def: 'soudržné působení mezi atomy, které vzniká díky valenčním elektronům' },
            { term: 'vazebná energie', def: 'energie, která se uvolní při vzniku vazby; stejně velkou energii musíme dodat, abychom vazbu rozštěpili' },
            { term: 'délka vazby', def: 'vzdálenost jader dvou vázaných atomů' },
          ],
        },
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
          text: 'Každá vazba má svou **délku** v pikometrech (1 pm = 10^{−12} m) a **vazebnou energii** v kJ/mol, tedy na obrovskou „porci“ vazeb (mol poznáš v úrovni 4). Větší energie znamená pevnější vazbu.',
        },
        {
          type: 'table',
          headers: ['Vazba', 'Délka (pm)', 'Vazebná energie (kJ/mol)'],
          rows: [
            ['$H–H$', '74', '436'],
            ['$H–Cl$', '127', '431'],
            ['$Cl–Cl$', '199', '242'],
            ['$C–C$', '154', '348'],
            ['$C=C$', '134', '614'],
            ['$C≡C$', '120', '839'],
            ['$N≡N$', '110', '945'],
          ],
          caption: 'Přibližné délky a energie některých vazeb.',
        },
        {
          type: 'molecule',
          molecules: ['H2', 'Cl2', 'N2'],
          labels: ['$H–H$: 74 pm', '$Cl–Cl$: 199 pm', '$N≡N$: 110 pm, 945 kJ/mol'],
          caption: 'Malé atomy vodíku jsou u sebe blízko, velké atomy chloru daleko. Trojná vazba dusíku je krátká a velmi pevná.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'atom', title: 'Menší atomy, kratší vazba', text: 'vazba $H–H$ je mnohem kratší než $Cl–Cl$' },
            { icon: 'bond', title: 'Kratší bývá pevnější', text: 'sdílené elektrony jsou blíž oběma jádrům' },
            { icon: 'lightning', title: '==Násobné vazby jsou kratší a pevnější než jednoduché==', text: 'co je dvojná a trojná vazba, uvidíš hned v další lekci' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Líný dusík',
          text: 'Vzduch je ze 78 % tvořen dusíkem, a přesto ho rostliny neumějí přímo využít. Trojná vazba v molekule $N2$ patří k nejpevnějším vůbec. Rozštípnout ji dokážou jen hlízkové bakterie, blesky a chemický průmysl při výrobě hnojiv.',
        },
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
          text: 'Dva různé atomy se o sdílené elektrony nedělí vždy spravedlivě. Schopnost atomu ve vazbě přitahovat vazebné elektrony se nazývá **elektronegativita** (anglicky *electronegativity*), značka X.',
        },
        {
          type: 'diagram',
          id: 'periodic-mini',
          props: { highlight: 'trends' },
          caption: 'Elektronegativita roste v periodě zleva doprava a ve skupině zdola nahoru.',
        },
        {
          type: 'p',
          text: 'Používá se **Paulingova stupnice** podle chemika Linuse Paulinga; hodnoty nemají jednotku. Nejvyšší má fluor (3,98), nejnižší cesium a francium (kolem 0,8).',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'nucleus', title: 'V periodě **roste** zleva doprava', text: 'jádro má víc protonů a valenční elektrony přitahuje silněji' },
            { icon: 'atom', title: 'Ve skupině **klesá** shora dolů', text: 'valenční elektrony jsou dál od jádra a vnitřní vrstvy je stíní' },
            { icon: 'coin', title: 'Kovy nízkou, nekovy vysokou', text: 'kovy mají většinou méně než 2' },
            { icon: 'balloon', title: 'Vzácné plyny bez hodnoty', text: 'vazby téměř netvoří, proto se jim hodnota obvykle neuvádí' },
          ],
        },
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
          type: 'elements',
          symbols: ['F', 'O', 'Cl', 'N'],
          caption: 'Čtyři nejelektronegativnější prvky: F (3,98), O (3,44), Cl (3,16) a N (3,04).',
        },
        {
          type: 'callout',
          variant: 'tip',
          text: 'Nejelektronegativnější kout tabulky je vpravo nahoře (vzácné plyny nepočítáme). Čím blíž má prvek k fluoru, tím silněji si elektrony ve vazbě přitahuje.',
        },
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
          text: 'Typ vazby odhadneš z **rozdílu elektronegativit** ΔX. Od větší hodnoty odečítáš menší, takže ΔX nikdy není záporné.',
        },
        { type: 'formula', text: 'ΔX = X_{větší} − X_{menší}', caption: 'rozdíl elektronegativit vázaných atomů' },
        {
          type: 'diagram',
          id: 'bond-type-scale',
          caption: 'Stupnice ΔX: od nepolární vazby přes polární až k iontové. Hranice 0,4 a 1,7 jsou jen orientační.',
        },
        {
          type: 'compare',
          columns: [
            {
              title: 'Nepolární kovalentní',
              icon: 'bond',
              tone: 'a',
              points: ['ΔX menší než 0,4', 'elektrony sdílené zhruba rovnoměrně', '$H2$, $Cl2$, vazba $C–H$'],
            },
            {
              title: 'Polární kovalentní',
              icon: 'magnet',
              tone: 'b',
              points: ['ΔX 0,4–1,7', 'elektrony posunuté k elektronegativnějšímu atomu', '$HCl$, $H2O$, vazba $N–H$'],
            },
            {
              title: 'Iontová',
              icon: 'ion-plus',
              tone: 'c',
              points: ['ΔX 1,7 a více', 'elektrony prakticky předané, vznikají ionty', '$NaCl$, $KBr$, $MgO$'],
            },
          ],
        },
        {
          type: 'p',
          text: 'U polární vazby nese elektronegativnější atom **částečný záporný náboj** δ− a druhý **částečný kladný náboj** δ+. Nejsou to celé náboje jako u iontů, jen posun elektronů. Vazbě se dvěma „póly“ říkáme **dipól**.',
        },
        {
          type: 'structure',
          art: art(' δ+       δ−', ' H  ————  Cl', '   ───→', ' elektrony jsou blíž chloru'),
          caption: 'Polární vazba v chlorovodíku. Šipka ukazuje, kam se posouvá elektronová hustota.',
        },
        {
          type: 'example',
          title: 'Jakou vazbu má chlorovodík?',
          problem: 'Urči typ vazby v molekule $HCl$.',
          steps: ['X(Cl) = 3,16 a X(H) = 2,20', 'ΔX = 3,16 − 2,20 = 0,96', '0,4 ≤ 0,96 < 1,7, vazba je tedy polární kovalentní', 'Elektronegativnější chlor nese δ−, vodík δ+.'],
          answer: 'polární kovalentní vazba, $H^{δ+}–Cl^{δ−}$',
        },
        {
          type: 'molecule',
          molecules: ['HCl'],
          labels: ['$H^{δ+}–Cl^{δ−}$'],
          caption: 'Molekula chlorovodíku: chlor si přitahuje sdílený pár k sobě.',
        },
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
    'Délka vazby je vzdálenost jader; kratší vazby bývají pevnější a násobné vazby jsou kratší a pevnější než jednoduché.',
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
  ],
}

// ─────────────────────────────────────────────────────────────
// l3-2 Kovalentní vazba a tvary molekul
// ─────────────────────────────────────────────────────────────
const l32: Lesson = {
  id: 'l3-2',
  title: 'Kovalentní vazba a tvary molekul',
  goals: [
    'Nakreslit valenční (Lewisův) vzorec jednoduché molekuly včetně volných elektronových párů',
    'Rozlišit jednoduchou, dvojnou a trojnou vazbu a spočítat v nich vazby σ a π',
    'Vysvětlit vznik koordinační vazby v $NH4^+$ a $H3O^+$',
    'Podle modelu VSEPR určit tvar molekuly a rozhodnout, zda je polární',
  ],
  hook: 'Molekula vody je zalomená jako bumerang, oxid uhličitý rovný jako špejle. Právě ten malý rozdíl ve tvaru rozhoduje o tom, jestli z látky bude oceán, nebo plyn v bublinkách limonády.',
  sections: [
    {
      title: 'Sdílený elektronový pár',
      icon: 'electron',
      blocks: [
        {
          type: 'p',
          text: '**Kovalentní vazba** vzniká, když dva atomy **sdílejí elektronový pár**; obvykle každý přispěje jedním valenčním elektronem. Sdílený pár patří oběma atomům a oba se tak přiblíží konfiguraci vzácného plynu.',
        },
        {
          type: 'structure',
          art: art('H·  +  ·H   →   H:H   =   H — H'),
          caption: 'Vznik molekuly vodíku. Sdílený pár kreslíme dvojtečkou, nebo častěji čárkou.',
        },
        {
          type: 'molecule',
          molecules: ['H2', 'Cl2'],
          labels: ['vodík $H–H$', 'chlor $Cl–Cl$'],
          caption: 'Dvě nejjednodušší molekuly s jednou kovalentní vazbou. Otoč si je myší nebo prstem.',
        },
        {
          type: 'p',
          text: 'Páry, které se na vazbě nepodílejí, jsou **volné** (nevazebné) **elektronové páry**. Ve **valenčním vzorci** (Lewisově vzorci) je kreslíme jako dvojici teček nebo čárku u symbolu atomu.',
        },
        {
          type: 'structure',
          art: art(' ··      ··', ':Cl  —  Cl:', ' ··      ··'),
          caption: 'Molekula chloru: jeden vazebný pár a na každém atomu tři volné páry. Každý chlor má kolem sebe oktet.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'vazebný elektronový pár', def: 'dvojice elektronů sdílená dvěma atomy, tvoří kovalentní vazbu' },
            { term: 'volný elektronový pár', def: 'dvojice valenčních elektronů, která patří jen jednomu atomu a vazbu netvoří' },
            { term: 'valenční vzorec', def: 'vzorec, který ukazuje všechny vazby i volné elektronové páry' },
            { term: 'vaznost', def: 'počet kovalentních vazeb, které atom tvoří: H 1, O 2, N 3, C 4' },
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Vodíku stačí dva elektrony (jako heliu), ostatním atomům 2. periody osm. Tomuto pravidlu se říká **oktetové pravidlo**.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik volných elektronových párů má každý z atomů chloru v molekule $Cl2$?',
            answer: 3,
            explain: 'Chlor má 7 valenčních elektronů. Jeden jde do vazby, zbylých 6 tvoří 3 volné páry. S vazebným párem má chlor oktet.',
          },
        },
      ],
    },
    {
      title: 'Jednoduchá, dvojná a trojná vazba',
      icon: 'bond',
      blocks: [
        {
          type: 'p',
          text: 'Atomy mohou sdílet i víc párů: **jednoduchá vazba** je jeden sdílený pár, **dvojná vazba** dva a **trojná vazba** tři. Kyslík v $O2$ je spojen dvojnou vazbou, dusík v $N2$ trojnou.',
        },
        {
          type: 'molecule',
          molecules: ['Cl2', 'O2', 'N2'],
          labels: ['jednoduchá $Cl–Cl$', 'dvojná $O=O$', 'trojná $N≡N$'],
          caption: 'Čím víc sdílených párů, tím blíž jsou atomy u sebe.',
        },
        {
          type: 'structure',
          art: art(' ··     ··', ' O   =  O          :N ≡ N:', ' ··     ··'),
          caption: 'Kyslík: dvojná vazba a dva volné páry na každém atomu. Dusík: trojná vazba a jeden volný pár na každém atomu.',
        },
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
      title: 'Jak nakreslit valenční vzorec',
      icon: 'pencil',
      blocks: [
        {
          type: 'p',
          text: 'Valenční vzorec sestavíš v pěti krocích. Stačí znát počet valenčních elektronů, který vyčteš z čísla skupiny.',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'calculator', title: 'Sečti elektrony', text: 'valenční elektrony všech atomů vyděl dvěma: dostaneš počet párů' },
            { icon: 'atom', title: 'Vyber centrální atom', text: 'ten, který tvoří nejvíc vazeb (bývá nejméně elektronegativní); vodík nikdy není uprostřed' },
            { icon: 'bond', title: 'Spoj jednoduchými vazbami', text: 'centrální atom s každým okolním atomem' },
            { icon: 'electron', title: 'Doplň volné páry', text: 'okolním atomům do oktetu, vodíku jen dvojici' },
            { icon: 'check', title: 'Zbytek doprostřed', text: 'zbylé páry dej centrálnímu atomu; chybí-li mu oktet, udělej z volného páru souseda dvojnou nebo trojnou vazbu' },
          ],
        },
        {
          type: 'structure',
          art: art('    ··             ··            H', 'H — O — H     H — N — H     H — C — H', '    ··             |            |', '                   H            H'),
          caption: 'Voda (2 volné páry na kyslíku), amoniak (1 volný pár na dusíku) a methan (žádný volný pár).',
        },
        {
          type: 'example',
          title: 'Valenční vzorec oxidu uhličitého',
          problem: 'Nakresli valenční vzorec $CO2$.',
          steps: [
            'Valenční elektrony: C má 4, každý O má 6, celkem 4 + 2 · 6 = 16 elektronů, tedy 8 párů.',
            'Centrální atom je uhlík. Kostra $O–C–O$ spotřebuje 2 páry.',
            'Každý kyslík dostane 3 volné páry: to je dalších 6 párů, celkem 8. Všechny páry jsou rozdané.',
            'Uhlík má ale jen 2 vazby, tedy 4 elektrony. Z jednoho volného páru každého kyslíku proto uděláme další vazbu.',
            'Kontrola: každý O má 2 vazby a 2 volné páry (8 elektronů), C má 4 vazby (8 elektronů).',
          ],
          answer: '$O=C=O$ se dvěma volnými páry na každém kyslíku',
        },
        {
          type: 'structure',
          art: art(' ··         ··', ' O  =  C  =  O', ' ··         ··'),
          caption: 'Valenční vzorec $CO2$: dvě dvojné vazby, uhlík bez volných párů.',
        },
        {
          type: 'molecule',
          molecules: ['BF3', 'SF6'],
          labels: ['$BF3$: jen 6 elektronů kolem B', '$SF6$: 12 elektronů kolem S'],
          caption: 'Výjimky z oktetu.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Výjimky z oktetu',
          text: 'Oktetové pravidlo neplatí vždy. Bor v $BF3$ má kolem sebe jen 6 elektronů. Prvky 3. a vyšší periody mohou mít elektronů víc než osm, třeba síra v $SF6$ má kolem sebe 12 elektronů.',
        },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik valenčních elektronů celkem rozmísťuješ ve valenčním vzorci amoniaku $NH3$?',
            answer: 8,
            explain: 'Dusík (15. skupina) má 5 valenčních elektronů a tři vodíky po jednom: 5 + 3 = 8 elektronů, tedy 4 páry (3 vazebné a 1 volný).',
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
          text: 'Někdy dodá oba elektrony do vazby jen jeden atom. Takové vazbě říkáme **koordinační** (donor-akceptorová, anglicky *dative*) **vazba**.',
        },
        {
          type: 'keyterms',
          items: [
            { term: 'donor', def: 'atom, který poskytne svůj volný elektronový pár (např. N v $NH3$, O v $H2O$)' },
            { term: 'akceptor', def: 'atom nebo ion s prázdným orbitalem, který pár přijme (např. $H^+$, který nemá žádný elektron)' },
          ],
        },
        {
          type: 'reaction',
          equation: 'NH3 + H^+ -> NH4^+',
          caption: 'Vznik amonného kationtu: dusík poskytne volný pár iontu $H^+$.',
        },
        {
          type: 'reaction',
          equation: 'H2O + H^+ -> H3O^+',
          caption: 'Vznik oxoniového kationtu: donorem je kyslík vody.',
        },
        {
          type: 'structure',
          art: art('      H     +          ··    +', '      |            H — O — H', '  H — N — H            ↓', '      ↓                H', '      H'),
          caption: 'Amonný kation $NH4^+$ a oxoniový kation $H3O^+$. Šipka míří od donoru k akceptoru. Kladný náboj patří celému iontu.',
        },
        {
          type: 'molecule',
          molecules: ['NH4+', 'H3O+'],
          labels: ['$NH4^+$: tetraedr', '$H3O^+$: trigonální pyramida'],
          caption: 'Ve 3D modelu nepoznáš, která vazba vznikla koordinačně: všechny jsou stejné.',
        },
        {
          type: 'p',
          text: '==Jakmile koordinační vazba vznikne, nijak se neliší od ostatních.== V amonném kationtu jsou všechny čtyři vazby $N–H$ stejně dlouhé a stejně pevné; liší se jen to, odkud elektrony přišly.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Koordinační vazby drží pohromadě i hemoglobin v tvé krvi: atom železa v něm váže kyslík právě touto vazbou. Víc o takových sloučeninách (komplexech) uslyšíš v úrovni 7.',
        },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'V amonném kationtu $NH4^+$ se vazba, která vznikla koordinačně, liší délkou od ostatních tří vazeb $N–H$.',
            answer: false,
            explain: 'Všechny čtyři vazby jsou po vzniku rovnocenné, ion má tvar pravidelného čtyřstěnu. Koordinační vazba se liší jen původem elektronů.',
          },
        },
      ],
    },
    {
      title: 'Tvary molekul: model VSEPR',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: 'Tvar molekuly předpovíš modelem **VSEPR** (z anglického *Valence Shell Electron Pair Repulsion*, odpuzování elektronových párů valenční vrstvy). ==Elektronové páry kolem centrálního atomu se odpuzují, a proto se od sebe vzdálí co nejvíc.==',
        },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'calculator', title: 'Spočítej elektronové oblasti', text: 'každá vazba (jednoduchá, dvojná i trojná) je jedna oblast, každý volný pár také' },
            { icon: 'magnet', title: 'Rozmísti je co nejdál', text: '2 oblasti v přímce, 3 do trojúhelníku, 4 do čtyřstěnu (tetraedru)' },
            { icon: 'magnifier', title: 'Popiš tvar podle atomů', text: 'volné páry „nevidíme“, ale tlačí na vazby' },
            { icon: 'electron', title: 'Oprav úhly', text: 'volné páry odpuzují silněji než vazebné, proto vazebné úhly zmenšují' },
          ],
        },
        {
          type: 'diagram',
          id: 'vsepr-shapes',
          caption: 'Základní tvary molekul podle počtu elektronových oblastí a volných párů.',
        },
        {
          type: 'molecule',
          molecules: ['BeCl2', 'CO2', 'BF3'],
          labels: ['lineární, 180°', 'lineární, 180°', 'trojúhelníková (rovinná), 120°'],
          caption: 'Dvě a tři elektronové oblasti, žádné volné páry na centrálním atomu.',
        },
        {
          type: 'molecule',
          molecules: ['CH4', 'NH3', 'H2O'],
          labels: ['tetraedr, 109,5° (0 volných párů)', 'trigonální pyramida, 107° (1 volný pár)', 'lomená, 104,5° (2 volné páry)'],
          caption: 'Čtyři elektronové oblasti míří do rohů čtyřstěnu; úhly v methanu mají 109,5°, ne 90°, jak by se zdálo z plochého nákresu. Čím víc volných párů, tím víc stlačí vazebný úhel.',
        },
        {
          type: 'table',
          headers: ['Tvar', 'Příklad', 'Vazebné oblasti', 'Volné páry', 'Vazebný úhel'],
          rows: [
            ['lineární', '$CO2$, $BeCl2$', '2', '0', '180°'],
            ['trojúhelníková (rovinná)', '$BF3$', '3', '0', '120°'],
            ['tetraedrická', '$CH4$', '4', '0', '109,5°'],
            ['trigonální pyramida', '$NH3$', '3', '1', '107°'],
            ['lomená', '$H2O$', '2', '2', '104,5°'],
          ],
          caption: 'Základní tvary molekul podle VSEPR.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Balonkový pokus',
          text: 'Nafoukni čtyři stejné balonky a svaž je uzly k sobě. Samy se natočí do rohů čtyřstěnu jako vazby v methanu. Se dvěma balonky dostaneš přímku, se třemi trojúhelník. Balonky se „odpuzují“ stejně jako elektronové páry.',
        },
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
      title: 'Polární vazba není totéž co polární molekula',
      icon: 'drop',
      blocks: [
        {
          type: 'p',
          text: 'Molekula je **polární**, když má jeden konec trochu záporný a druhý trochu kladný. Každá polární vazba je jako malá šipka (dipól), ale záleží i na tvaru: ==pokud se šipky díky symetrii vyruší, molekula je nepolární.==',
        },
        {
          type: 'diagram',
          id: 'polarity',
          caption: 'Dipóly vazeb se sčítají jako šipky: v souměrné molekule se vyruší, v nesouměrné sečtou.',
        },
        {
          type: 'structure',
          art: art('δ−     δ+     δ−', 'O  =   C   =  O', '←──         ──→', 'dipóly se vyruší'),
          caption: '$CO2$ je lineární: obě polární vazby táhnou stejně silně na opačné strany. Molekula je nepolární.',
        },
        {
          type: 'structure',
          art: art('       δ−', '       O', '     /   \\', '    H     H', '   δ+     δ+', '  dipóly se sečtou ↑'),
          caption: '$H2O$ je lomená: oba dipóly míří „nahoru“ ke kyslíku a sečtou se. Molekula je polární.',
        },
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
              points: ['vlastnost celé molekuly', 'rozhoduje ΔX i tvar', 'dipóly vazeb se nesmí vyrušit: $H2O$, $NH3$, $HCl$'],
            },
          ],
        },
        {
          type: 'molecule',
          molecules: ['CO2', 'CCl4', 'H2O', 'NH3'],
          labels: ['nepolární (lineární)', 'nepolární (tetraedr)', 'polární (lomená)', 'polární (pyramida)'],
          caption: '**Nepolární**: $H2$, $Cl2$, $CO2$, $CH4$, $CCl4$, $BF3$ (nepolární vazby, nebo souměrný tvar). **Polární**: $H2O$, $NH3$, $HCl$ (polární vazby a nesouměrný tvar).',
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Proč mikrovlnka ohřeje polévku',
          text: 'Mikrovlny rozkmitají polární molekuly vody: dipóly se v rychle se měnícím elektrickém poli neustále natáčejí a třou o sousedy. Suchý talíř bez vody se proto ohřívá mnohem pomaleji než jídlo.',
        },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které molekuly jsou polární?',
            options: ['$H2O$', '$CO2$', '$NH3$', '$CH4$', '$HCl$'],
            answers: [0, 2, 4],
            explain: '$H2O$ (lomená), $NH3$ (pyramida) a $HCl$ mají nesouměrně rozložený náboj. $CO2$ a $CH4$ jsou souměrné, dipóly jejich vazeb se vyruší.',
          },
        },
      ],
    },
  ],
  summary: [
    'Kovalentní vazbu tvoří sdílený elektronový pár; atomy tím obvykle získají oktet (vodík dvojici).',
    'Jednoduchá vazba je σ, dvojná σ + π a trojná σ + 2π; vazba π je slabší než σ.',
    'Valenční vzorec ukazuje vazebné i volné elektronové páry; vodík nikdy není centrální atom.',
    'Koordinační vazba vzniká, když oba elektrony dodá donor, např. v $NH4^+$ a $H3O^+$.',
    'Podle VSEPR se elektronové oblasti odpuzují: lineární 180°, trojúhelníková 120°, tetraedrická 109,5°, pyramida 107°, lomená 104,5°.',
    'Molekula s polárními vazbami může být nepolární, pokud je souměrná, jako $CO2$; voda je lomená, a proto polární.',
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
      kind: 'tf',
      q: 'Každá molekula, která obsahuje polární vazby, je polární.',
      answer: false,
      explain: 'Rozhoduje i tvar. V souměrných molekulách jako $CO2$ nebo $CH4$ se dipóly vazeb vyruší a molekula je nepolární.',
    },
    {
      kind: 'number',
      q: 'Kolik volných elektronových párů má atom dusíku v molekule amoniaku $NH3$?',
      answer: 1,
      explain: 'Dusík má 5 valenčních elektronů: 3 použije na vazby s vodíky, zbylé 2 tvoří jeden volný pár.',
    },
    {
      kind: 'order',
      q: 'Seřaď molekuly podle vazebného úhlu od nejmenšího po největší.',
      items: ['$H2O$', '$NH3$', '$CH4$', '$BF3$', '$CO2$'],
      explain: '$H2O$ 104,5° < $NH3$ 107° < $CH4$ 109,5° < $BF3$ 120° < $CO2$ 180°. Čím víc volných párů, tím víc úhel stlačí.',
    },
    {
      kind: 'multi',
      q: 'Ve kterých částicích najdeš koordinační vazbu?',
      options: ['$NH4^+$', '$H3O^+$', '$CH4$', '$NH3$', '$H2O$'],
      answers: [0, 1],
      explain: 'Amonný a oxoniový kation vznikly tak, že $NH3$ nebo $H2O$ poskytly volný pár iontu $H^+$. Ostatní molekuly mají jen obyčejné kovalentní vazby.',
    },
    {
      kind: 'text',
      q: 'Jaký tvar má molekula vody? Napiš jedním slovem.',
      accept: ['lomená', 'lomený', 'lomeny'],
      placeholder: 'tvar',
      explain: 'Kyslík má dvě vazby a dva volné páry. Čtyři oblasti míří do rohů čtyřstěnu, ale atomy tvoří jen „V“ s úhlem 104,5°.',
    },
    {
      kind: 'choice',
      q: 'Kolik elektronů sdílejí dva atomy spojené trojnou vazbou?',
      options: ['2', '3', '4', '6'],
      answer: 3,
      explain: 'Trojná vazba jsou tři sdílené elektronové páry, tedy 6 elektronů.',
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
    'Vysvětlit vlastnosti iontových látek pomocí krystalové mřížky',
    'Vysvětlit vodivost, kujnost a lesk kovů modelem elektronového plynu',
    'Rozlišit molekulové látky, kovalentní krystaly, iontové a kovové látky',
  ],
  hook: 'Kuchyňská sůl taje až při 801 °C, ale ve vodě se rozpustí za pár vteřin. Měděný drát ohneš prsty, krystal soli se rozpadne na kousky. Kdo za tím stojí? Vazby, které nejsou kovalentní.',
  sections: [
    {
      title: 'Od atomů k iontům',
      icon: 'ion-plus',
      blocks: [
        {
          type: 'p',
          text: 'Při velkém rozdílu elektronegativit (ΔX ≥ 1,7), typicky mezi kovem a nekovem, atomy elektrony **předávají**. Kov odevzdá valenční elektrony a stane se **kationtem**, nekov je přijme a stane se **aniontem**.',
        },
        { type: 'formula', text: '$Na -> Na^+ + e^-$ a $Cl + e^- -> Cl^-$', caption: 'sodík elektron ztrácí, chlor ho získává' },
        {
          type: 'diagram',
          id: 'bohr',
          props: { z: 11, ion: 1, label: 'Na⁺' },
          caption: 'Kation $Na^+$: 11 protonů a 10 elektronů (2, 8), stejné uspořádání jako neon.',
        },
        {
          type: 'diagram',
          id: 'bohr',
          props: { z: 17, ion: -1, label: 'Cl⁻' },
          caption: 'Anion $Cl^-$: 17 protonů a 18 elektronů (2, 8, 8), stejné uspořádání jako argon.',
        },
        {
          type: 'reaction',
          equation: '2Na + Cl2 -> 2NaCl',
          caption: 'Sodík hoří v chloru: každý atom $Na$ předá elektron atomu $Cl$ a vznikne chlorid sodný. Prudkou reakci předvádějí chemici jen v digestoři.',
        },
        {
          type: 'p',
          text: '==**Iontová vazba** je elektrostatické přitahování opačně nabitých iontů.== Na rozdíl od kovalentní vazby nemá směr: každý ion přitahuje všechny opačně nabité sousedy kolem sebe.',
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
          text: 'Iontová sloučenina je jako celek **elektricky neutrální**: kladných nábojů je přesně tolik jako záporných. Vzorec udává nejmenší celočíselný poměr iontů.',
        },
        {
          type: 'example',
          title: 'Chlorid vápenatý',
          problem: 'Jaký vzorec má sloučenina iontů $Ca^{2+}$ a $Cl^-$?',
          steps: ['Jeden ion $Ca^{2+}$ nese náboj 2+.', 'Jeden ion $Cl^-$ nese náboj 1−, na vyrovnání jsou potřeba dva.', '2+ a 2 · (1−) dává dohromady 0.'],
          answer: '$CaCl2$',
        },
        {
          type: 'reaction',
          equation: 'Ca + Cl2 -> CaCl2',
          caption: 'Jeden atom vápníku odevzdá dva elektrony, každý ze dvou atomů chloru přijme jeden.',
        },
        {
          type: 'example',
          title: 'Oxid hlinitý',
          problem: 'Jaký vzorec má sloučenina iontů $Al^{3+}$ a $O^{2-}$?',
          steps: ['Nejmenší společný násobek 3 a 2 je 6.', 'Kladný náboj 6+ dají 2 ionty $Al^{3+}$.', 'Záporný náboj 6− dají 3 ionty $O^{2-}$.'],
          answer: '$Al2O3$',
        },
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
          text: 'Ionty se v pevné látce uspořádají do pravidelné **krystalové mřížky**. V chloridu sodném je každý ion $Na^+$ obklopen šesti ionty $Cl^-$ a každý $Cl^-$ šesti ionty $Na^+$.',
        },
        {
          type: 'diagram',
          id: 'ionic-lattice',
          caption: 'Prostorová mřížka $NaCl$: ionty $Na^+$ a $Cl^-$ se střídají ve všech třech směrech.',
        },
        {
          type: 'p',
          text: '==V iontové látce nejsou žádné molekuly.== Vzorec $NaCl$ jen říká, že sodných a chloridových iontů je v krystalu stejně. Nejmenší skupině iontů podle vzorce říkáme **vzorcová jednotka**.',
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
        {
          type: 'keyterms',
          items: [
            { term: 'krystalová mřížka', def: 'pravidelné prostorové uspořádání částic v krystalu' },
            { term: 'vzorcová jednotka', def: 'skupina iontů v poměru daném vzorcem, např. jeden $Na^+$ a jeden $Cl^-$' },
            { term: 'koordinační číslo', def: 'počet nejbližších sousedů částice v krystalu; v $NaCl$ je 6' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pokus doma',
          text: 'Rozpusť ve sklenici teplé vody tolik soli, kolik se jí rozpustí, a nech ji pár dní odpařovat na parapetu. Pod lupou uvidíš drobné krychličky: tvar krystalu prozrazuje krychlovou mřížku $NaCl$.',
        },
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
        {
          type: 'iconlist',
          items: [
            { icon: 'thermometer', title: 'Vysoké teploty tání', text: 'přitažlivé síly působí mezi všemi ionty v krystalu: $NaCl$ taje při 801 °C, $MgO$ až při 2852 °C' },
            { icon: 'mortar', title: 'Tvrdé, ale křehké', text: 'úderem krystal nepromáčkneš, ale rozštípneš' },
            { icon: 'plug', title: 'Vedou proud jen v tavenině nebo v roztoku', text: 'v pevném krystalu jsou ionty pevně na místech, po roztavení nebo rozpuštění se mohou pohybovat' },
            { icon: 'drop', title: 'Často se rozpouštějí ve vodě', text: 'ale zdaleka ne všechny' },
          ],
        },
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
          text: 'Ionty $Mg^{2+}$ a $O^{2-}$ nesou dvojnásobné náboje a jsou menší, takže se přitahují mnohem silněji a $MgO$ taje o dva tisíce stupňů výš než $NaCl$. Vyrábějí se z něj žáruvzdorné vyzdívky pecí.',
        },
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
          text: 'Kovy mají nízkou elektronegativitu a své valenční elektrony snadno uvolní. Atomy se změní na kationty a elektrony vytvoří společný **elektronový plyn** („moře elektronů“), který prostupuje celým kusem kovu.',
        },
        {
          type: 'diagram',
          id: 'metallic-bond',
          caption: 'Kationty kovu v moři volně pohyblivých elektronů.',
        },
        {
          type: 'p',
          text: '==**Kovová vazba** je přitahování mezi kationty kovu a elektronovým plynem.== Elektrony nepatří žádnému konkrétnímu atomu, jsou **delokalizované**.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'plug', title: 'Elektrická vodivost', text: 'volné elektrony se v napětí pohybují jedním směrem' },
            { icon: 'heat', title: 'Tepelná vodivost', text: 'pohyblivé elektrony rychle přenášejí energii' },
            { icon: 'ring', title: 'Kujnost a tažnost', text: 'vrstvy kationtů po sobě kloužou a elektronový plyn je stále drží pohromadě' },
            { icon: 'sun', title: 'Kovový lesk', text: 'volné elektrony pohlcují a znovu vyzařují světlo' },
          ],
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'thermometer', title: 'Rtuť: −39 °C', text: 'za pokojové teploty kapalná' },
            { icon: 'heat', title: 'Gallium: 30 °C', text: 'roztaví se v dlani' },
            { icon: 'bulb', title: 'Wolfram: 3422 °C', text: 'dělala se z něj vlákna žárovek' },
          ],
        },
        {
          type: 'elements',
          symbols: ['Cu', 'Al', 'Fe', 'Au', 'Hg', 'Ga', 'W'],
          caption: 'Kovy s kovovou vazbou: teploty tání se liší obrovsky, od kapalné rtuti po žáruvzdorný wolfram.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Zlato se dá vytepat na plátek tenký asi desetitisícinu milimetru. Takovým „plátkovým zlatem“ se zlatí sochy, rámy obrazů, a dokonce i dorty.',
        },
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
          type: 'compare',
          columns: [
            {
              title: 'Kovalentní vazba',
              icon: 'bond',
              tone: 'a',
              points: ['sdílené elektronové páry', 'nekov + nekov', 'molekuly, nebo síť atomů v celém krystalu'],
            },
            {
              title: 'Iontová vazba',
              icon: 'ion-plus',
              tone: 'b',
              points: ['přitahování kationtů a aniontů', 'kov + nekov, ΔX ≥ 1,7', 'krystalová mřížka bez molekul'],
            },
            {
              title: 'Kovová vazba',
              icon: 'coin',
              tone: 'c',
              points: ['kationty v elektronovém plynu', 'atomy kovů', 'delokalizované elektrony'],
            },
          ],
          caption: 'Tři typy chemické vazby vedle sebe.',
        },
        {
          type: 'p',
          text: '**Molekulové látky** ($H2O$, $CO2$, $I2$, cukr) mají pevné vazby jen uvnitř molekul a mezi molekulami slabé síly (další lekce), proto tají a vřou při nízkých teplotách. V **kovalentních (atomových) krystalech** jsou kovalentně propojeny všechny atomy: ==roztavit je znamená rozbít pevné kovalentní vazby, proto tají až při velmi vysokých teplotách.==',
        },
        {
          type: 'diagram',
          id: 'carbon-allotropes',
          caption: 'Diamant, grafit a další podoby uhlíku: stejné atomy, jiné uspořádání.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'diamond', title: 'Diamant', text: 'každý atom C je vázán se 4 sousedy do tvaru čtyřstěnu. Pevná prostorová síť z něj dělá nejtvrdší přírodní látku. Proud nevede.' },
            { icon: 'pencil', title: 'Grafit', text: 'vrstvy ze šestiúhelníků, každý C má jen 3 sousedy. Čtvrtý elektron se volně pohybuje ve vrstvě, proto grafit vede proud. Vrstvy po sobě kloužou, a tak tuha v tužce píše.' },
            { icon: 'crystal', title: 'Oxid křemičitý $SiO2$', text: 'křemen, písek: každý Si je vázán se 4 atomy O a každý O se 2 atomy Si. Taje kolem 1700 °C.' },
          ],
        },
        {
          type: 'table',
          headers: ['Typ látky', 'Částice', 'Co je drží', 'Teplota tání', 'Vede proud?', 'Příklady'],
          rows: [
            ['molekulová', 'molekuly', 'slabé síly mezi molekulami', 'nízká', 'ne', '$H2O$, $CO2$, $I2$'],
            ['kovalentní krystal', 'atomy', 'kovalentní vazby v celém krystalu', 'velmi vysoká', 'ne (grafit ano)', 'diamant, grafit, $SiO2$'],
            ['iontová', 'kationty a anionty', 'iontová vazba', 'vysoká', 'jen tavenina a roztok', '$NaCl$, $MgO$, $CaF2$'],
            ['kovová', 'kationty a elektronový plyn', 'kovová vazba', 'různá', 'ano, i pevná', '$Fe$, $Cu$, $Al$'],
          ],
          caption: 'Srovnání látek podle typu vazby.',
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
          text: 'Diamant i grafit jsou čistý uhlík, liší se jen uspořádáním atomů. Jediná vrstva grafitu se jmenuje grafen a za jeho objev dostali Andre Geim a Konstantin Novoselov v roce 2010 Nobelovu cenu.',
        },
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
    'Kovová vazba drží kationty kovu v elektronovém plynu; volné elektrony vysvětlují vodivost, kujnost a lesk.',
    'Molekulové látky mají nízké teploty tání, kovalentní krystaly (diamant, grafit, $SiO2$) velmi vysoké.',
    'Grafit vede proud díky pohyblivým elektronům ve vrstvách, diamant ne.',
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
    'Vysvětlit vysokou teplotu varu vody a to, proč led plave',
    'Použít pravidlo „podobné se rozpouští v podobném“ a vysvětlit povrchové napětí',
  ],
  hook: 'Sulfan (sirovodík) $H2S$ je za pokojové teploty plyn, a přitom má těžší molekulu než voda. Kdyby se voda chovala „podle pravidel“, vřela by asi při −80 °C a na Zemi by nebyl jediný rybník. Co ji drží pohromadě?',
  sections: [
    {
      title: 'Uvnitř pevné, mezi sebou slabé',
      icon: 'molecule',
      blocks: [
        {
          type: 'p',
          text: '**Kovalentní vazby** drží atomy uvnitř molekuly, **mezimolekulové síly** přitahují celé molekuly k sobě a jsou mnohem slabší. Právě ony rozhodují o teplotě tání a varu, rozpustnosti i povrchovém napětí. ==Při tání a varu molekulové látky se kovalentní vazby nerozbíjejí, molekuly se jen od sebe vzdálí.==',
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
          text: '**Van der Waalsovy síly** (podle fyzika J. D. van der Waalse) jsou slabé přitažlivé síly mezi molekulami. Patří sem dva hlavní druhy; silnější je vodíková vazba.',
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
          text: '**Londonovy síly**: elektrony se pohybují, takže na okamžik bývá na jedné straně molekuly víc elektronů. Vznikne **okamžitý dipól**, který „nakazí“ souseda, a obě molekuly se na chvilku přitáhnou. ==Londonovy síly působí mezi všemi částicemi a rostou s počtem elektronů, tedy s velikostí molekuly.==',
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
          type: 'molecule',
          molecules: ['F2', 'Cl2', 'Br2', 'I2'],
          labels: ['plyn', 'plyn', 'kapalina', 'pevná látka'],
          caption: 'Halogeny: čím větší molekula, tím silněji se k sobě molekuly lepí.',
        },
        {
          type: 'p',
          text: '**Dipól–dipólové síly** působí mezi polárními molekulami s trvalým dipólem: kladný konec jedné molekuly přitahuje záporný konec sousední.',
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
          text: '**Vodíková vazba** je zvlášť silné přitahování molekul. Vzniká, když je vodík vázán na malý, velmi elektronegativní atom **F, O nebo N**. Takový vodík nese výrazný náboj δ+ a přitahuje volný elektronový pár atomu F, O nebo N sousední molekuly.',
        },
        {
          type: 'diagram',
          id: 'hydrogen-bonds',
          caption: 'Vodíkové vazby (tečkovaně): vodík δ+ jedné molekuly míří k volnému páru atomu O, N nebo F sousední molekuly.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'bond', title: 'Podmínka 1', text: 'vodík vázaný na F, O nebo N (vazby $F–H$, $O–H$, $N–H$)' },
            { icon: 'electron', title: 'Podmínka 2', text: 'na sousední molekule atom F, O nebo N s volným elektronovým párem' },
            { icon: 'dna', title: 'Kde ji najdeš', text: 'voda, amoniak, fluorovodík, alkohol, bílkoviny, DNA' },
            { icon: 'drop', title: 'Až 4 na molekulu vody', text: 'dvě přes své vodíky a dvě přes volné páry kyslíku' },
          ],
        },
        {
          type: 'molecule',
          molecules: ['H2O', 'NH3', 'HF'],
          labels: ['$O–H$', '$N–H$', '$F–H$'],
          caption: 'Molekuly, mezi kterými vznikají vodíkové vazby.',
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
      title: 'Teploty varu hydridů: výjimečná voda',
      icon: 'thermometer',
      blocks: [
        {
          type: 'p',
          text: 'U sloučenin vodíku s prvky 16. a 17. skupiny roste od 3. periody dolů teplota varu: přibývá elektronů a sílí Londonovy síly. První člen každé řady ale z trendu divoce vybočuje.',
        },
        {
          type: 'table',
          headers: ['16. skupina', 'Teplota varu', '17. skupina', 'Teplota varu'],
          rows: [
            ['$H2O$', '100 °C', '$HF$', '20 °C'],
            ['$H2S$', '−60 °C', '$HCl$', '−85 °C'],
            ['$H2Se$', '−41 °C', '$HBr$', '−67 °C'],
            ['$H2Te$', '−2 °C', '$HI$', '−35 °C'],
          ],
          caption: 'Voda a fluorovodík vřou mnohem výš, než by odpovídalo trendu.',
        },
        {
          type: 'molecule',
          molecules: ['H2O', 'H2S'],
          labels: ['voda: vře při 100 °C', 'sulfan: vře při −60 °C'],
          caption: 'Obě molekuly jsou lomené a polární. Liší se centrálním atomem.',
        },
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
          text: 'U většiny látek je pevná fáze hustší než kapalina, voda je výjimka. V ledu je každá molekula vázána vodíkovými vazbami ke čtyřem sousedům a vzniká **řídká šestiúhelníková mřížka** s dutinami. ==Led má proto menší hustotu (asi 0,92 g/cm^{3}) než kapalná voda (1,00 g/cm^{3}) a plave na ní.==',
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
          text: 'O rozpustnosti rozhoduje pravidlo ==**podobné se rozpouští v podobném**.== Polární a iontové látky se dobře rozpouštějí v polárních rozpouštědlech, jako je voda, nepolární látky v nepolárních, jako je benzín.',
        },
        {
          type: 'diagram',
          id: 'dissolving',
          caption: 'Rozpouštění: molekuly rozpouštědla obklopí částice rozpouštěné látky a odnesou je do roztoku.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: 'Sůl, cukr i líh ve vodě', text: 'jejich částice se s molekulami vody přitahují' },
            { icon: 'oil-barrel', title: 'Olej se s vodou nemísí', text: 'molekuly vody se drží pohromadě vodíkovými vazbami a nepolární olej „vytlačí“' },
            { icon: 'soap', title: 'Mastná skvrna', text: 'voda ji nesmyje, nepolární rozpouštědlo ano; jak to zvládá mýdlo, uvidíš v úrovni 9' },
            { icon: 'beaker', title: 'Jod', text: 've vodě se rozpouští jen nepatrně, v nepolárním benzínu dobře' },
          ],
        },
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
    'Díky vodíkovým vazbám vře voda při 100 °C, zatímco $H2S$ už při −60 °C.',
    'Led má řídkou mřížku z vodíkových vazeb, je méně hustý než voda a plave; voda je nejhustší při 4 °C.',
    'Podobné se rozpouští v podobném: polární látky ve vodě, nepolární v nepolárních rozpouštědlech.',
    'Povrchové napětí vzniká, protože molekuly na hladině jsou taženy dovnitř kapaliny.',
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
      q: 'Co se nejlépe rozpustí ve vodě?',
      options: ['kuchyňská sůl', 'rostlinný olej', 'parafín ze svíčky', 'motorový olej'],
      answer: 0,
      explain: 'Sůl je iontová a její ionty se silně přitahují s polárními molekulami vody. Oleje a parafín jsou nepolární.',
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
          text: '**Oxidační číslo** je myšlený (formální) náboj atomu. Dostaneš ho, když si představíš, že ==všechny vazebné elektronové páry patří vždy elektronegativnějšímu z obou atomů==, jako by všechny vazby byly iontové.',
        },
        {
          type: 'molecule',
          molecules: ['HCl', 'H2O'],
          labels: ['$H^{I}Cl^{−I}$', '$H2^{I}O^{−II}$'],
          caption: 'Elektronegativnější chlor a kyslík si „vezmou“ vazebné páry.',
        },
        {
          type: 'p',
          text: 'V $HCl$ má chlor s přiděleným párem o elektron víc než jeho atom: −I; vodík o elektron přišel: +I. V $H2O$ si kyslík vezme oba vazebné páry, dostane −II a každý vodík +I.',
        },
        { type: 'formula', text: '$H^{I}Cl^{−I}$ a $H2^{I}O^{−II}$', caption: 'oxidační čísla se píšou římskými číslicemi vpravo nahoru' },
        {
          type: 'iconlist',
          items: [
            { icon: 'ion-plus', title: 'Kladná', text: 'bez znaménka nebo se znaménkem plus: $Fe^{III}$' },
            { icon: 'ion-minus', title: 'Záporná', text: 'vždy se znaménkem minus: $O^{−II}$' },
            { icon: 'atom', title: 'Nula', text: 'arabskou číslicí: $Cl2^0$' },
          ],
        },
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
              points: ['formální náboj atomu', 'římská číslice', 'má ho každý atom, i ten v molekule bez iontů, jako uhlík v $CO2$'],
            },
          ],
          caption: 'Náboj iontu, nebo oxidační číslo?',
        },
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
          text: 'Nemusíš pokaždé kreslit vazby. Stačí několik pravidel, která platí téměř vždy.',
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
          text: 'Nejvyšší kladné oxidační číslo prvku hlavní skupiny odpovídá počtu valenčních elektronů (výjimkou jsou kyslík a fluor). Nejnižší záporné u nekovů zjistíš jako číslo skupiny minus 18.',
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
        {
          type: 'molecule',
          molecules: ['CH4', 'CO2'],
          labels: ['$C^{−IV}$: nejnižší', '$C^{IV}$: nejvyšší'],
          caption: 'Uhlík (14. skupina) ve svém nejnižším a nejvyšším oxidačním čísle.',
        },
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
        {
          type: 'example',
          title: 'Síra v oxidu siřičitém',
          problem: 'Urči oxidační číslo síry v $SO2$.',
          steps: ['Kyslík má −II, dva kyslíky dohromady −4.', 'Molekula je neutrální: x + 2 · (−2) = 0', 'x = +4'],
          answer: '$S^{IV}O2^{−II}$',
        },
        {
          type: 'example',
          title: 'Mangan v hypermanganu',
          problem: 'Urči oxidační číslo manganu v $KMnO4$ (manganistan draselný, známý jako „hypermangan“).',
          steps: ['Draslík (1. skupina) má +I, kyslík −II.', '(+1) + x + 4 · (−2) = 0', 'x = 8 − 1 = +7'],
          answer: 'mangan má oxidační číslo VII',
        },
        {
          type: 'example',
          title: 'Ion: síranový anion',
          problem: 'Urči oxidační číslo síry v aniontu $SO4^2-$.',
          steps: ['Kyslík má −II, čtyři kyslíky dohromady −8.', 'Součet se rovná náboji iontu: x + (−8) = −2', 'x = +6'],
          answer: 'síra má oxidační číslo VI',
        },
        {
          type: 'example',
          title: 'Ion: amonný kation',
          problem: 'Urči oxidační číslo dusíku v $NH4^+$.',
          steps: ['Vodík má +I, čtyři vodíky +4.', 'x + 4 = +1', 'x = −3'],
          answer: 'dusík má oxidační číslo −III',
        },
        {
          type: 'molecule',
          molecules: ['SO2', 'SO4^2-', 'NH4+'],
          labels: ['$S^{IV}$', '$S^{VI}$', '$N^{−III}$'],
          caption: 'Tři vyřešené částice. Ion se počítá stejně, jen součet se rovná jeho náboji.',
        },
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
          text: 'V českém názvosloví se oxidační číslo schovává do **koncovky přídavného jména**: z názvu „oxid hlinitý“ hned víš, že hliník má III. Koncovek je osm, pro oxidační čísla I až VIII.',
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
        {
          type: 'elements',
          symbols: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Os'],
          caption: 'Prvky 3. periody ve svých nejvyšších oxidačních číslech I až VII a osmium s rekordním VIII.',
        },
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
        {
          type: 'structure',
          art: art(' III    −II', '  Al     O', '    ╲   ╱', '     ╲ ╱', '      ╳', '     ╱ ╲', '  Al₂     O₃    →    Al₂O₃'),
          caption: 'Křížové pravidlo pro oxid hlinitý: trojka od hliníku jde ke kyslíku, dvojka od kyslíku k hliníku.',
        },
        {
          type: 'example',
          title: 'Oxid uhličitý',
          problem: 'Napiš vzorec oxidu uhličitého.',
          steps: ['-ičitý znamená IV: $C^{IV}$; oxid znamená $O^{−II}$.', 'Do kříže: $C2O4$', 'Oba indexy vydělíme dvěma: $CO2$', 'Kontrola: +4 + 2 · (−2) = 0'],
          answer: '$CO2$',
        },
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
        {
          type: 'example',
          title: 'Hematit a červený pigment',
          problem: 'Pojmenuj $Fe2O3$.',
          steps: ['Tři kyslíky: 3 · (−2) = −6', 'Dva atomy železa musí mít dohromady +6, každý tedy +3.', 'III znamená koncovku -itý.'],
          answer: 'oxid železitý',
        },
        {
          type: 'example',
          title: 'Galenit',
          problem: 'Pojmenuj $PbS$, hlavní rudu olova.',
          steps: ['Sulfid má −II.', 'Jediný atom olova tedy má +2.', 'II znamená koncovku -natý.'],
          answer: 'sulfid olovnatý',
        },
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
    'Oxidační číslo je formální náboj atomu, pokud přidělíme vazebné elektrony elektronegativnějšímu atomu; píše se římskými číslicemi.',
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
    'Pojmenovat oxidy, peroxidy, halogenidy, sulfidy, hydridy, nitridy a karbidy a napsat jejich vzorce',
    'Poznat peroxid a vysvětlit, proč se jeho vzorec nekrátí',
    'Používat triviální názvy voda, amoniak, methan a sirovodík a jejich systematické protějšky',
    'Poznat v běžném životě sloučeniny jako $CO2$, $SiO2$, $Fe2O3$, $NaCl$ a $CaO$',
  ],
  hook: 'Písek, rez, kuchyňská sůl, bublinky v limonádě i pálené vápno na stavbě jsou dvouprvkové sloučeniny. S tím, co už umíš, jim dáš jméno i vzorec za pár vteřin. Pojďme z tebe udělat názvoslovného mistra!',
  sections: [
    {
      title: 'Jak vzniká název',
      icon: 'book',
      blocks: [
        {
          type: 'p',
          text: '**Dvouprvková** (binární) **sloučenina** se skládá ze dvou prvků a její název má dvě slova. ==Podstatné jméno s koncovkou **-id** patří elektronegativnější složce, přídavné jméno s koncovkou podle oxidačního čísla té elektropozitivnější.==',
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
        {
          type: 'iconlist',
          items: [
            { icon: 'rust', title: 'oxid: $O^{−II}$', text: '$CaO$ oxid vápenatý' },
            { icon: 'pill', title: 'peroxid: skupina $O2$ (–O–O–), každý O −I', text: '$H2O2$ peroxid vodíku' },
            { icon: 'salt', title: 'fluorid, chlorid, bromid, jodid: F, Cl, Br, I −I', text: '$KBr$ bromid draselný' },
            { icon: 'mountain', title: 'sulfid: $S^{−II}$', text: '$PbS$ sulfid olovnatý' },
            { icon: 'gas-cylinder', title: 'hydrid: $H^{−I}$', text: '$NaH$ hydrid sodný' },
            { icon: 'factory', title: 'nitrid: $N^{−III}$', text: '$Li3N$ nitrid lithný' },
            { icon: 'diamond', title: 'karbid: $C^{−IV}$', text: '$SiC$ karbid křemičitý' },
          ],
        },
        {
          type: 'keyterms',
          items: [
            { term: 'dvouprvková sloučenina', def: 'sloučenina složená z atomů dvou prvků' },
            { term: 'halogenidy', def: 'souhrnný název pro fluoridy, chloridy, bromidy a jodidy' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'O tom, kdo dostane koncovku -id, rozhoduje elektronegativita. Proto $OF2$ není oxid fluoru, ale fluorid kyslíku (přesněji difluorid kyslíku): fluor je elektronegativnější, má −I a kyslík tu výjimečně +II.',
        },
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
          text: '**Oxidy** jsou sloučeniny kyslíku s jiným prvkem, kyslík v nich má −II. Najdeš je v horninách, ve vzduchu a oxidem vodíku je koneckonců i voda.',
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
            { icon: 'milk', title: '$N2O$ oxid dusný', text: '„rajský plyn“ v bombičkách do šlehačky' },
          ],
        },
        {
          type: 'molecule',
          molecules: ['CO2', 'CO', 'SO2', 'NO2'],
          labels: ['oxid uhličitý', 'oxid uhelnatý', 'oxid siřičitý', 'oxid dusičitý: hnědý plyn z výfuků'],
          caption: 'Molekulové oxidy nekovů jsou plyny.',
        },
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
      icon: 'pill',
      blocks: [
        {
          type: 'p',
          text: '**Peroxidy** obsahují dvojici navzájem vázaných atomů kyslíku –O–O–, tedy peroxidový anion $O2^2-$. ==Každý kyslík v peroxidu má oxidační číslo −I.==',
        },
        {
          type: 'structure',
          art: art('    ··  ··', ' H — O — O — H', '    ··  ··'),
          caption: 'Peroxid vodíku $H2O2$: mezi atomy kyslíku je jednoduchá vazba.',
        },
        {
          type: 'molecule',
          molecules: ['H2O', 'H2O2'],
          labels: ['voda: oxid vodíku, $O^{−II}$', 'peroxid vodíku: –O–O–, $O^{−I}$'],
        },
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
              icon: 'pill',
              tone: 'b',
              points: ['skupina –O–O–, $O^{−I}$', '**vzorec se nikdy nekrátí**: skupina O–O musí zůstat celá', '$H2O2$ (H +I), $Na2O2$ (ne $NaO$), $BaO2$ (Ba +II)'],
            },
          ],
          caption: 'Vodík tvoří jen jeden peroxid, a proto se mu říká jednoduše peroxid vodíku.',
        },
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
          text: 'Třiprocentní roztok peroxidu vodíku z lékárny dezinfikuje rány a odbarvuje vlasy. Na ráně pění, protože enzym z krve ho rychle rozkládá na vodu a kyslík. Koncentrovaný (30%) roztok ale leptá kůži, takže s ním jen v rukavicích a brýlích.',
        },
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
          text: '**Halogenidy** jsou sloučeniny halogenů F, Cl, Br a I s oxidačním číslem −I: fluoridy, chloridy, bromidy a jodidy. **Sulfidy** jsou sloučeniny síry s oxidačním číslem −II; mnoho z nich jsou důležité rudy kovů.',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: '$NaCl$ chlorid sodný', text: 'kuchyňská sůl' },
            { icon: 'car', title: '$CaCl2$ chlorid vápenatý', text: 'posyp silnic, pohlcovače vlhkosti' },
            { icon: 'toothpaste', title: '$SnF2$ fluorid cínatý', text: 'zubní pasty chránící sklovinu' },
            { icon: 'crystal', title: '$CaF2$ fluorid vápenatý', text: 'nerost fluorit (kazivec)' },
            { icon: 'magnifier', title: '$AgBr$ bromid stříbrný', text: 'klasický fotografický film' },
            { icon: 'pill', title: '$KI$ jodid draselný', text: 'jodové tablety pro případ jaderné havárie' },
          ],
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'mountain', title: '$PbS$ sulfid olovnatý', text: 'galenit, hlavní ruda olova' },
            { icon: 'powder', title: '$ZnS$ sulfid zinečnatý', text: 'sfalerit, ruda zinku' },
            { icon: 'pencil', title: '$HgS$ sulfid rtuťnatý', text: 'rumělka, historický červený pigment' },
            { icon: 'ring', title: '$Ag2S$ sulfid stříbrný', text: 'černý povlak na stříbrných šperkech' },
          ],
        },
        {
          type: 'elements',
          symbols: ['F', 'Cl', 'Br', 'I', 'S'],
          caption: 'Halogeny tvoří halogenidy (−I), síra sulfidy (−II).',
        },
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
      title: 'Hydridy a sloučeniny vodíku',
      icon: 'gas-cylinder',
      blocks: [
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
        {
          type: 'molecule',
          molecules: ['H2O', 'NH3', 'CH4', 'H2S'],
          labels: ['voda (oxidan)', 'amoniak (azan)', 'methan', 'sulfan (sirovodík)'],
        },
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
          caption: 'V praxi říkáme voda a amoniak, u $H2S$ se běžně používá název sulfan i sirovodík.',
        },
        {
          type: 'p',
          text: 'Sloučeniny vodíku s halogeny jsou **fluorovodík** $HF$, **chlorovodík** $HCl$, **bromovodík** $HBr$ a **jodovodík** $HI$. Jejich vodné roztoky jsou kyseliny, například kyselina chlorovodíková; o nich v úrovni 5.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Sulfan (sirovodík) páchne po zkažených vejcích a je velmi jedovatý. Ve vyšší koncentraci ochromí čich, takže ho náhle přestaneš cítit, i když ho ve vzduchu přibývá. Vzniká v kanalizaci, u sopek a v sirných pramenech.',
        },
        {
          type: 'callout',
          variant: 'fact',
          text: 'Methan je hlavní složkou zemního plynu a sám nemá žádný zápach. Plyn ve sporáku cítíš jen proto, že se do něj úmyslně přidávají páchnoucí látky. Únik plynu tak rychle poznáš.',
        },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď k vzorci název.',
            pairs: [
              ['$NH3$', 'amoniak'],
              ['$CH4$', 'methan'],
              ['$H2S$', 'sulfan'],
              ['$NaH$', 'hydrid sodný'],
              ['$HCl$', 'chlorovodík'],
            ],
            explain: 'Hydrid je jen sloučenina, kde má vodík −I, tedy s kovem. Sloučeniny s nekovy mají vlastní názvy.',
          },
        },
      ],
    },
    {
      title: 'Nitridy a karbidy',
      icon: 'diamond',
      blocks: [
        {
          type: 'p',
          text: '**Nitridy** obsahují dusík s oxidačním číslem −III, **karbidy** uhlík s −IV. Často jsou mimořádně tvrdé a odolné, proto se z nich vyrábějí brusiva, řezné nástroje a keramika.',
        },
        {
          type: 'example',
          title: 'Nitrid hořečnatý',
          problem: 'Napiš vzorec nitridu hořečnatého. Vzniká spolu s oxidem, když hořčík hoří na vzduchu.',
          steps: ['-natý znamená II: $Mg^{II}$, nitrid $N^{−III}$.', 'Do kříže: hořčík index 3, dusík index 2.', 'Kontrola: 3 · (+2) + 2 · (−3) = 0'],
          answer: '$Mg3N2$',
        },
        {
          type: 'reaction',
          equation: '3Mg + N2 -> Mg3N2',
          caption: 'Hořící hořčík si bere i dusík ze vzduchu.',
        },
        {
          type: 'example',
          title: 'Karbid ze vzorce',
          problem: 'Pojmenuj $Al4C3$.',
          steps: ['Tři uhlíky: 3 · (−4) = −12', 'Čtyři atomy hliníku mají dohromady +12, každý +3.', 'III znamená koncovku -itý.'],
          answer: 'karbid hlinitý',
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'battery', title: '$Li3N$ nitrid lithný', text: 'vzniká z lithia a dusíku už za běžné teploty' },
            { icon: 'phone', title: '$AlN$ nitrid hlinitý', text: 'keramika v elektronice, dobře odvádí teplo' },
            { icon: 'factory', title: '$TiN$ nitrid titanitý', text: 'zlatavý tvrdý povlak vrtáků' },
            { icon: 'mortar', title: '$SiC$ karbid křemičitý', text: 'karborundum: brusné papíry a kotouče' },
          ],
        },
        {
          type: 'callout',
          variant: 'fact',
          title: 'Karbidka',
          text: 'Karbid vápenatý $CaC2$ je výjimka: obsahuje dvojici atomů uhlíku, podobně jako peroxid dvojici kyslíků, a proto neodpovídá oxidačnímu číslu −IV. S vodou uvolňuje hořlavý plyn acetylen, který svítil jeskyňářům v karbidových lampách. Acetylen je výbušný, s karbidem proto jen pod dohledem.',
        },
        {
          type: 'reaction',
          equation: 'CaC2 + 2H2O -> C2H2 + Ca(OH)2',
          caption: 'Karbid vápenatý a voda dávají acetylen $C2H2$.',
        },
        { type: 'game', gameId: 'naming', text: 'Teď už víš všechno potřebné. Vyzkoušej si v trenažéru převody vzorec ↔ název u oxidů, halogenidů a dalších sloučenin.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec nitridu lithného.',
            accept: ['Li3N'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: '$Li^{I}$ a $N^{−III}$: do kříže dostane lithium index 3 a dusík index 1. Vzorec je $Li3N$.',
          },
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Pojmenuj sloučeninu $SiC$.',
            accept: ['karbid křemičitý'],
            placeholder: 'název',
            explain: 'Karbid má −IV, křemík tedy +IV. Koncovka pro IV je -ičitý: karbid křemičitý.',
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
      q: 'Pojmenuj sloučeninu $CaO$.',
      accept: ['oxid vápenatý'],
      placeholder: 'název',
      explain: 'Vápník je ve 2. skupině, má +II, a koncovka -natý se připojí ke kmeni vápen-: oxid vápenatý, neboli pálené vápno.',
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
      q: 'Který vzorec nitridu hořečnatého je správný?',
      options: ['$Mg3N2$', '$MgN$', '$Mg2N3$', '$MgN2$'],
      answer: 0,
      explain: '$Mg^{II}$ a $N^{−III}$: do kříže dostane hořčík index 3 a dusík 2. Kontrola: 3 · 2 − 2 · 3 = 0.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec fluoridu vápenatého.',
      accept: ['CaF2'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: '$Ca^{II}$ a $F^{−I}$ dávají $CaF2$. Jako nerost fluorit se používá třeba při výrobě speciálních optických čoček.',
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
    q: 'Jaký tvar má oxoniový kation $H3O^+$?',
    options: ['trigonální pyramida', 'trojúhelníková (rovinná)', 'tetraedrická', 'lomená'],
    answer: 0,
    explain: 'Kyslík má 3 vazby a 1 volný pár, stejně jako dusík v $NH3$. Čtyři elektronové oblasti, ale jen tři atomy kolem: trigonální pyramida.',
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
    kind: 'text',
    q: 'Napiš vzorec oxidu chromitého.',
    accept: ['Cr2O3'],
    caseSensitive: true,
    placeholder: 'vzorec',
    explain: '-itý znamená III: $Cr^{III}$ a $O^{−II}$ dávají křížovým pravidlem $Cr2O3$.',
  },
  {
    kind: 'tf',
    q: 'Vodíkové vazby mezi molekulami vody jsou pevnější než kovalentní vazby $O–H$ uvnitř molekul.',
    answer: false,
    explain: 'Vodíková vazba je sice nejsilnější mezimolekulová síla, ale zhruba 10–20krát slabší než kovalentní vazba. Proto se voda varem nerozkládá.',
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
    'l3-3': l33,
    'l3-4': l34,
    'l3-5': l35,
    'l3-6': l36,
  },
  boss,
}

export default level
