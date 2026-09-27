import type { LevelContent, Lesson, Question } from '../../../core/types'

/* ------------------------------------------------------------------ */
/* l7-1 Vodík, kyslík a voda                                           */
/* ------------------------------------------------------------------ */

const l71: Lesson = {
  id: 'l7-1',
  title: 'Vodík, kyslík a voda',
  goals: [
    'Popsat vlastnosti vodíku a kyslíku a zapsat rovnice jejich přípravy',
    'Rozdělit oxidy na kyselé, zásadité, amfoterní a neutrální a zdůvodnit to polohou prvku v tabulce',
    'Vysvětlit anomálie vody a rozlišit přechodnou a trvalou tvrdost vody',
    'Popsat vlastnosti a použití peroxidu vodíku',
  ],
  hook: 'Jeden plyn hoří, druhý hoření podporuje. A když se spojí, vznikne látka, kterou oheň hasíš. Dnes tě čeká nejslavnější chemická dvojice vesmíru a jejich dítě: voda.',
  sections: [
    {
      title: 'Vodík: nejlehčí prvek vesmíru',
      icon: 'balloon',
      blocks: [
        { type: 'elements', symbols: ['H'], caption: 'vodík, $Z = 1$' },
        { type: 'p', text: '**Vodík** má jediný proton a jediný elektron. V tabulce stojí nad alkalickými kovy, ale kovem není: tvoří dvouatomové molekuly $H2$, které drží pohromadě nepolární kovalentní vazba.' },
        {
          type: 'molecule',
          molecules: ['H2'],
          labels: ['$H2$: bezbarvý plyn bez zápachu, asi 14× lehčí než vzduch'],
          caption: 'Ve vesmíru tvoří vodík zhruba tři čtvrtiny hmotnosti běžné hmoty. Na Zemi je skoro celý vázaný, hlavně ve vodě a v organických látkách.',
        },
        {
          type: 'compare',
          caption: 'Tři izotopy vodíku',
          columns: [
            { title: 'protium $^{1}_{1}H$', icon: 'atom', tone: 'a', points: ['jádro tvoří jen proton', 'nejběžnější, 99,98 % vodíku'] },
            { title: 'deuterium $^{2}_{1}H$ (D)', icon: 'drop', tone: 'b', points: ['proton + neutron', '„těžká voda“ $D2O$ zpomaluje neutrony v některých reaktorech'] },
            { title: 'tritium $^{3}_{1}H$ (T)', icon: 'hazard', tone: 'c', points: ['proton + 2 neutrony', 'radioaktivní', 'palivo pro budoucí termojaderné reaktory'] },
          ],
        },
        { type: 'p', text: 'V laboratoři vodík připravíš reakcí **neušlechtilého kovu** se zředěnou kyselinou, obvykle v **Kippově přístroji**. Zinek stojí v řadě napětí vlevo od vodíku ($E° = −0,76 V$), takže vodík z kyseliny vytěsní.' },
        { type: 'reaction', equation: 'Zn + 2HCl -> ZnCl2 + H2', caption: 'laboratorní příprava vodíku' },
        {
          type: 'compare',
          caption: 'Průmyslová výroba vodíku',
          columns: [
            { title: 'parní reformování', icon: 'factory', tone: 'a', points: ['$CH4 + H2O -> CO + 3H2$', 'zemní plyn, niklový katalyzátor, asi 800 °C', 'hlavní zdroj vodíku'] },
            { title: 'elektrolýza vody', icon: 'lightning', tone: 'b', points: ['$2H2O -> 2H2 + O2$', 'stejnosměrný proud', 'v menší míře'] },
          ],
        },
        { type: 'diagram', id: 'electrolysis', caption: 'Elektrolýza: stejnosměrný proud rozkládá látku na elektrodách. U vody vzniká vodík na katodě a kyslík na anodě.' },
        { type: 'callout', variant: 'warning', title: 'Třaskavá směs', text: 'Směs vodíku se vzduchem nebo s kyslíkem (nejprudší je poměr $2 : 1$ s kyslíkem) po zapálení vybuchne. Než vodík zapálíš, zkontroluj jeho čistotu: zkumavku s ním přibliž ústím dolů ke kahanu. Ostré „štěknutí“ znamená, že je v něm ještě vzduch.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který kov s kyselinou chlorovodíkovou vodík **neuvolní**?',
            options: ['měď', 'zinek', 'hořčík', 'železo'],
            answer: 0,
            explain: 'Měď je ušlechtilý kov, v řadě napětí stojí vpravo od vodíku ($E° = +0,34 V$), a proto vodík z kyseliny nevytěsní.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: vodík jako palivo',
      icon: 'fuel',
      blocks: [
        { type: 'p', text: 'Vodík hoří téměř neviditelným plamenem a jediným produktem je voda. Proto se o něm mluví jako o **palivu budoucnosti**.' },
        { type: 'reaction', equation: '2H2 + O2 -> 2H2O', caption: 'hoření vodíku je silně exotermní: ΔH = −572 kJ' },
        {
          type: 'example',
          title: 'Kolik energie je v kilogramu vodíku?',
          problem: 'Spálením 1 mol $H2$ na kapalnou vodu se uvolní 286 kJ. Kolik energie dá 1 kg vodíku? Porovnej s benzinem (asi 46 MJ/kg).',
          steps: [
            '$M(H2) = 2 g/mol$',
            '$n = m / M = 1000 g / 2 g/mol = 500 mol$',
            '$Q = 500 mol · 286 kJ/mol = 143 000 kJ$',
          ],
          answer: 'Asi 143 MJ, tedy zhruba 3× víc než stejná hmotnost benzinu.',
        },
        { type: 'p', text: 'Háček: vodík je tak lehký, že v litru ho moc není. Musí se stlačovat (70 MPa v nádržích aut) nebo zkapalňovat při −253 °C.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'battery', title: 'Palivové články', text: 'v autobusech a autech mění chemickou energii vodíku přímo na elektřinu (podrobněji v úrovni 6)' },
            { icon: 'flame', title: 'Raketové motory', text: 'kapalný vodík a kapalný kyslík poháněly třeba hlavní motory raketoplánu' },
            { icon: 'fertilizer', title: 'Výroba amoniaku', text: 'Haberova–Boschova syntéza spotřebuje velkou část světového vodíku (lekce 7-3)' },
            { icon: 'catalyst', title: 'Ztužování tuků', text: 'na niklovém katalyzátoru se vodík váže na rostlinné oleje a mění je na pevné tuky (margaríny)' },
            { icon: 'bulb', title: 'Redukce kovů', text: 'wolfram na vlákna se získává z oxidu: $WO3 + 3H2 -> W + 3H2O$' },
          ],
        },
        { type: 'callout', variant: 'fact', title: 'Barvy vodíku', text: '„Šedý“ vodík vzniká ze zemního plynu a uvolňuje $CO2$, „modrý“ také, jen se $CO2$ zachytí. „Zelený“ vodík vzniká elektrolýzou vody pomocí elektřiny ze slunce nebo větru. Plyn je pořád stejný, liší se jen stopa, kterou výroba zanechá.' },
        { type: 'callout', variant: 'remember', text: 'Vodík má ve sloučeninách obvykle oxidační číslo $+I$ ($H2O$, $HCl$). S nejreaktivnějšími kovy však tvoří **iontové hydridy**, kde má $−I$, například $NaH$ nebo $CaH2$.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Při hoření vodíku vzniká oxid uhličitý.',
            answer: false,
            explain: 'Vodík neobsahuje uhlík, jeho jediným produktem hoření je voda. $CO2$ může vzniknout jen při jeho výrobě ze zemního plynu.',
          },
        },
      ],
    },
    {
      title: 'Kyslík a ozon',
      icon: 'ozone',
      blocks: [
        { type: 'elements', symbols: ['O'], caption: 'kyslík, $Z = 8$, 16. skupina' },
        { type: 'p', text: '**Kyslík** je nejrozšířenějším prvkem zemské kůry (asi 46 % hmotnosti) a tvoří 21 % objemu vzduchu. Po fluoru je druhým nejelektronegativnějším prvkem (3,44), proto má ve sloučeninách skoro vždy oxidační číslo $−II$.' },
        { type: 'diagram', id: 'bohr', props: { z: 8 }, caption: 'Kyslíku chybí do oktetu dva elektrony' },
        { type: 'p', text: 'Když jeden prvek tvoří více různých forem, mluvíme o **alotropii** a jednotlivým formám říkáme **alotropické modifikace**. Kyslík má dvě.' },
        { type: 'molecule', molecules: ['O2', 'O3'], labels: ['dikyslík $O2$', 'ozon $O3$ (lomená molekula)'] },
        {
          type: 'compare',
          caption: 'Dvě alotropické modifikace kyslíku',
          columns: [
            { title: 'dikyslík $O2$', icon: 'lungs', tone: 'a', points: ['bezbarvý plyn bez zápachu', 'oxidační činidlo', 'vzduch (21 %)', 'nezbytný pro dýchání'] },
            { title: 'ozon $O3$', icon: 'ozone', tone: 'b', points: ['namodralý plyn, pronikavý zápach', 'mnohem silnější oxidační činidlo', 'stratosféra (ozonová vrstva), přízemní smog', 'nahoře chrání před UV, dole dráždí plíce'] },
          ],
        },
        { type: 'reaction', equation: '3O2 -> 2O3', caption: 'ozon vzniká působením UV záření nebo elektrického výboje (blesk, kopírka)' },
        { type: 'p', text: 'V laboratoři se kyslík připravuje **katalytickým rozkladem peroxidu vodíku** na burelu $MnO2$ nebo **zahříváním manganistanu draselného**. Průmyslově se získává **frakční destilací zkapalněného vzduchu** (kyslík vře při −183 °C, dusík při −196 °C).' },
        { type: 'reaction', equation: '2H2O2 -> 2H2O + O2', caption: 'katalyzátor $MnO2$' },
        { type: 'formula', text: '$2KMnO4 -> K2MnO4 + MnO2 + O2$', caption: 'zahřívání manganistanu draselného' },
        { type: 'callout', variant: 'tip', title: 'Důkaz kyslíku', text: 'Doutnající špejle se v kyslíku znovu rozhoří plamenem. Zkouška je rychlá a spolehlivá.' },
        { type: 'callout', variant: 'warning', text: 'V čistém kyslíku hoří prudce i látky, které na vzduchu jen doutnají. Ventily kyslíkových lahví se nikdy nemažou tukem ani olejem, hrozí vznícení a výbuch.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Napiš vzorec ozonu.',
            accept: ['O3'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: 'Ozon je tříatomová molekula $O3$, alotropická modifikace kyslíku.',
          },
        },
      ],
    },
    {
      title: 'Oxidy: kyselé, zásadité, amfoterní a neutrální',
      icon: 'periodic-table',
      blocks: [
        { type: 'p', text: 'Kyslík se slučuje téměř se všemi prvky. Jak se oxid chová k vodě, kyselinám a zásadám, prozradí poloha druhého prvku v tabulce, tedy jeho **elektronegativita**.' },
        { type: 'diagram', id: 'periodic-mini', props: { highlight: 'metals' }, caption: 'Kovy vlevo tvoří zásadité oxidy, nekovy vpravo nahoře kyselé. Na hranici leží prvky s amfoterními oxidy.' },
        {
          type: 'table',
          headers: ['typ oxidu', 'kdo ho tvoří', 'příklady', 'reaguje s'],
          rows: [
            ['**kyselý**', 'nekovy (kovalentní vazba)', '$CO2$, $SO3$, $P4O10$, $SiO2$', 'vodou na kyselinu, se zásadami na sůl'],
            ['**zásaditý**', 'kovy 1. a 2. skupiny (iontová vazba)', '$Na2O$, $CaO$, $MgO$', 'vodou na hydroxid, s kyselinami na sůl'],
            ['**amfoterní**', 'kovy „na hranici“', '$Al2O3$, $ZnO$', 's kyselinami i se zásadami'],
            ['**neutrální**', 'některé nekovy', '$CO$, $NO$, $N2O$', 's vodou, kyselinami ani zásadami sůl netvoří'],
          ],
        },
        { type: 'reaction', equation: 'SO3 + H2O -> H2SO4', caption: 'kyselý oxid + voda → kyselina' },
        { type: 'reaction', equation: 'CaO + H2O -> Ca(OH)2', caption: 'zásaditý oxid + voda → hydroxid' },
        { type: 'p', text: '**Amfoterní** oxid se chová jako zásaditý vůči kyselině a jako kyselý vůči zásadě. Oxid zinečnatý umí oboje.' },
        {
          type: 'compare',
          columns: [
            { title: '$ZnO$ jako zásaditý oxid', icon: 'lemon', tone: 'a', points: ['reaguje s kyselinou', '$ZnO + 2HCl -> ZnCl2 + H2O$', 'vzniká chlorid zinečnatý'] },
            { title: '$ZnO$ jako kyselý oxid', icon: 'soap', tone: 'b', points: ['reaguje se zásadou', '$ZnO + 2NaOH + H2O -> Na2[Zn(OH)4]$', 'vzniká tetrahydroxidozinečnatan sodný'] },
          ],
        },
        { type: 'callout', variant: 'tip', title: 'Pravidlo palce', text: 'Čím víc vpravo a nahoře v tabulce prvek je, tím kyselejší oxid tvoří. U jednoho kovu platí: ==čím vyšší oxidační číslo, tím kyselejší oxid==. Proto je $CrO$ zásaditý, $Cr2O3$ amfoterní a $CrO3$ kyselý.' },
        { type: 'game', gameId: 'naming', text: 'Procvič si názvy oxidů, než půjdeš dál: oxid siřičitý, dusnatý, chromitý…' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď oxid k jeho typu.',
            pairs: [
              ['$SO2$', 'kyselý'],
              ['$Na2O$', 'zásaditý'],
              ['$Al2O3$', 'amfoterní'],
              ['$CO$', 'neutrální'],
            ],
            explain: 'Nekov síra dává kyselý oxid, sodík zásaditý, hliník stojí na hranici kovů a nekovů (amfoterní) a $CO$ netvoří sůl ani s kyselinou, ani se zásadou.',
          },
        },
      ],
    },
    {
      title: 'Voda a peroxid vodíku',
      icon: 'drop',
      blocks: [
        { type: 'p', text: 'Lomená (104,5°), silně polární molekula vody tvoří **vodíkové vazby**. Právě ony stojí za většinou „podivností“ vody.' },
        { type: 'diagram', id: 'hydrogen-bonds', caption: 'Vodíkové vazby mezi molekulami vody' },
        {
          type: 'iconlist',
          items: [
            { icon: 'ice', title: 'Nejvyšší hustota při 4 °C', text: 'vodíkové vazby drží molekuly ledu v řídké šestiúhelníkové mřížce: led plave, rybníky zamrzají odshora a ryby přežijí' },
            { icon: 'thermometer', title: 'Vysoká teplota varu (100 °C)', text: 'drží ji vodíkové vazby ($H2S$ vře už při −60 °C), a tak je voda na Zemi hlavně kapalná' },
            { icon: 'ocean', title: 'Vysoká tepelná kapacita', text: '4,18 J/(g·K): energie se spotřebuje na trhání vodíkových vazeb, moře tlumí výkyvy teplot a voda chladí motory' },
            { icon: 'droplets', title: 'Velké povrchové napětí', text: 'molekuly na povrchu se silně přitahují, vodoměrky chodí po hladině' },
          ],
        },
        { type: 'p', text: '**Tvrdost vody** způsobují ionty $Ca^2+$ a $Mg^2+$. **Přechodnou tvrdost** (hydrogenuhličitany) odstraní var, protože se vyloučí vodní kámen. **Trvalou tvrdost** (sírany, chloridy) var neodstraní, víc v lekci 7-5.' },
        { type: 'reaction', equation: 'Ca(HCO3)2 -> CaCO3 + H2O + CO2', caption: 'při varu vzniká vodní kámen' },
        { type: 'p', text: '**Peroxid vodíku** $H2O2$ obsahuje skupinu $−O−O−$, v níž má kyslík oxidační číslo $−I$, přesně mezi $0$ a $−II$. Proto může být **oxidačním i redukčním činidlem**. Snadno se rozkládá na vodu a kyslík.' },
        { type: 'molecule', molecules: ['H2O', 'H2O2'], labels: ['voda: lomená, 104,5°', 'peroxid vodíku: dva kyslíky spojené jednoduchou vazbou'] },
        {
          type: 'iconlist',
          items: [
            { icon: 'blood', title: 'Dezinfekce ran', text: '3% roztok pění, protože enzym **kataláza** v krvi rozkládá peroxid na kyslík' },
            { icon: 'soap', title: 'Odbarvování', text: 'peroxid oxiduje barviva vlasů a textilu na bezbarvé látky' },
            { icon: 'flask', title: 'Perhydrol', text: '30% roztok pro laboratoř a průmysl' },
          ],
        },
        { type: 'callout', variant: 'warning', text: 'Perhydrol leptá kůži (vznikají bílé skvrny a pálí to). Pracuj s ním v rukavicích a s ochrannými brýlemi a nikdy ho neskladuj v uzavřené lahvi bez odvětrání: rozkladem vzniká kyslík a tlak roste.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč led plave na vodě?',
            options: [
              'Vodíkové vazby v ledu drží molekuly v řídké mřížce, takže led má menší hustotu než kapalná voda.',
              'V ledu jsou uzavřené bublinky vzduchu.',
              'Molekuly v ledu jsou menší než v kapalné vodě.',
              'Led obsahuje těžkou vodu $D2O$.',
            ],
            answer: 0,
            explain: 'V ledu tvoří vodíkové vazby pravidelnou mřížku s dutinami. Led má hustotu asi 0,92 g/cm³, voda 1,00 g/cm³.',
          },
        },
      ],
    },
  ],
  summary: [
    'Vodík je nejlehčí plyn; v laboratoři vzniká reakcí zinku s kyselinou, průmyslově z methanu nebo elektrolýzou vody.',
    'Vodík hoří na vodu a uvolní přitom asi 143 MJ na kilogram, směs se vzduchem je výbušná.',
    'Kyslík tvoří dvě alotropické modifikace: dikyslík $O2$ a ozon $O3$.',
    'Nekovy tvoří kyselé oxidy, kovy 1. a 2. skupiny zásadité, $Al2O3$ a $ZnO$ jsou amfoterní a $CO$, $NO$ a $N2O$ neutrální.',
    'Anomálie vody (hustota, bod varu, tepelná kapacita) způsobují vodíkové vazby.',
    'Přechodnou tvrdost vody odstraní var, trvalou ne.',
    'Peroxid vodíku s kyslíkem v oxidačním čísle $−I$ může oxidovat i redukovat a snadno se rozkládá na vodu a kyslík.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Kterou reakcí se vodík obvykle připravuje v laboratoři?',
      options: ['$Zn + 2HCl -> ZnCl2 + H2$', '$2KMnO4 -> K2MnO4 + MnO2 + O2$', '$Cu + 2HCl -> CuCl2 + H2$', '$CaCO3 -> CaO + CO2$'],
      answer: 0,
      explain: 'Neušlechtilý zinek vytěsní vodík z kyseliny. Měď je ušlechtilá a s $HCl$ nereaguje, rozklad $KMnO4$ dává kyslík.',
    },
    {
      kind: 'tf',
      q: 'Ozon a dikyslík jsou dva izotopy kyslíku.',
      answer: false,
      explain: 'Jsou to alotropické modifikace: stejný prvek, různě velké molekuly ($O2$ a $O3$). Izotopy se liší počtem neutronů v jádře.',
    },
    {
      kind: 'multi',
      q: 'Které oxidy jsou kyselé?',
      options: ['$SO3$', '$CO2$', '$P4O10$', '$Na2O$', '$CaO$'],
      answers: [0, 1, 2],
      explain: 'Oxidy nekovů (síra, uhlík, fosfor) jsou kyselé. $Na2O$ a $CaO$ jsou zásadité oxidy kovů.',
    },
    {
      kind: 'match',
      q: 'Přiřaď vlastnost vody k jejímu důsledku.',
      pairs: [
        ['největší hustota při 4 °C', 'rybníky nezamrzají až ke dnu'],
        ['vysoká tepelná kapacita', 'moře zmírňuje podnebí na pobřeží'],
        ['velké povrchové napětí', 'vodoměrka se udrží na hladině'],
        ['přítomnost $Ca(HCO3)2$', 'v konvici vzniká vodní kámen'],
      ],
      explain: 'Hustota, tepelná kapacita a povrchové napětí jsou důsledky vodíkových vazeb, vodní kámen vzniká rozkladem hydrogenuhličitanů při varu.',
    },
    {
      kind: 'number',
      q: 'Kolik dm³ vodíku (za normálních podmínek, $V_{m} = 22,4 dm^{3}/mol$) vznikne reakcí 6,5 g zinku s nadbytkem kyseliny chlorovodíkové? $M(Zn) = 65 g/mol$.',
      answer: 2.24,
      tolerance: 0.05,
      unit: 'dm³',
      explain: '$n(Zn) = 6,5 / 65 = 0,1 mol$, z rovnice $n(H2) = n(Zn) = 0,1 mol$, $V = 0,1 · 22,4 = 2,24 dm^{3}$.',
    },
    {
      kind: 'text',
      q: 'Jaké oxidační číslo má kyslík v peroxidu vodíku? (Zapiš římskou číslicí se znaménkem.)',
      accept: ['-I', '−I', '-1', '−1'],
      placeholder: 'např. −II',
      explain: 'Ve skupině $−O−O−$ je každý kyslík vázaný jen s jedním vodíkem: $2 · (+I) + 2x = 0$, takže $x = −I$.',
    },
    {
      kind: 'tf',
      q: 'Přechodnou tvrdost vody odstraníš převařením.',
      answer: true,
      explain: 'Hydrogenuhličitany se varem rozloží a vyloučí se nerozpustný $CaCO3$. Trvalou tvrdost (sírany, chloridy) var neodstraní.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l7-2 Halogeny a vzácné plyny                                        */
/* ------------------------------------------------------------------ */

const l72: Lesson = {
  id: 'l7-2',
  title: 'Halogeny a vzácné plyny',
  goals: [
    'Popsat a vysvětlit trendy ve skupině halogenů: skupenství, barvu a reaktivitu',
    'Předpovědět a zapsat vytěsňovací reakce halogenů a přípravu chloru',
    'Dokázat chloridy, bromidy a jodidy dusičnanem stříbrným',
    'Vysvětlit netečnost vzácných plynů a uvést jejich použití',
  ],
  hook: 'Chlor zabíjel v zákopech první světové války, a přesto díky němu z kohoutku teče bezpečná voda. A helium? To se neváže s nikým, ale balonek s ním uletí až do oblak.',
  sections: [
    {
      title: 'Halogeny: rodina tvůrců solí',
      icon: 'salt',
      blocks: [
        { type: 'elements', symbols: ['F', 'Cl', 'Br', 'I', 'At'], caption: '17. skupina: halogeny' },
        { type: 'p', text: 'Slovo **halogen** znamená řecky „solitvorný“: s kovy halogeny přímo tvoří soli, chlor se sodíkem dá kuchyňskou sůl $NaCl$. Všechny mají 7 valenčních elektronů ($ns^2 np^5$), jediný chybějící elektron ochotně přijmou a změní se na **halogenidový anion** $X^-$.' },
        { type: 'molecule', molecules: ['F2', 'Cl2', 'Br2', 'I2'], labels: ['fluor', 'chlor', 'brom', 'jod'], caption: 'Jako prvky tvoří halogeny dvouatomové molekuly $X2$.' },
        { type: 'diagram', id: 'halogen-colors', caption: 'Směrem dolů barva tmavne: světle žlutý fluor, žlutozelený chlor, červenohnědý brom, tmavě fialový jod s fialovými parami' },
        {
          type: 'table',
          headers: ['prvek', 'skupenství (25 °C)', 'barva', 'teplota varu', 'elektronegativita'],
          rows: [
            ['fluor $F2$', 'plyn', 'světle žlutý', '−188 °C', '3,98'],
            ['chlor $Cl2$', 'plyn', 'žlutozelený', '−34 °C', '3,16'],
            ['brom $Br2$', 'kapalina', 'červenohnědý', '59 °C', '2,96'],
            ['jod $I2$', 'pevná látka', 'tmavě fialový, kovově lesklý; páry fialové', '184 °C', '2,66'],
          ],
          caption: 'Směrem dolů barva tmavne, teplota varu roste a elektronegativita klesá',
        },
        { type: 'p', text: 'Proč teplota varu roste? Větší molekuly mají více elektronů, a tak mezi nimi působí silnější **Londonovy (disperzní) síly**. Proto je fluor plyn, brom kapalina a jod pevná látka.' },
        { type: 'callout', variant: 'fact', text: 'Jod při zahřívání **sublimuje**: z lesklých krystalků rovnou stoupají fialové páry, které na studené ploše znovu krystalizují. Tak se jod i čistí.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Který halogen je za pokojové teploty kapalina?',
            options: ['brom', 'chlor', 'jod', 'fluor'],
            answer: 0,
            explain: 'Brom je vedle rtuti jediný prvek, který je za běžných podmínek kapalný. Je červenohnědý a silně těkavý.',
          },
        },
      ],
    },
    {
      title: 'Reaktivita a vytěsňovací reakce',
      icon: 'speed',
      blocks: [
        { type: 'p', text: 'Halogeny jsou **oxidační činidla**: berou elektrony jiným látkám. Směrem dolů síla klesá, protože přijímaný elektron se usadí dál od jádra a jádro ho přitahuje slaběji.' },
        {
          type: 'table',
          headers: ['dvojice', 'E° (V)', 'síla jako oxidační činidlo'],
          rows: [
            ['$F2/F^-$', '+2,87', 'nejsilnější, reaguje skoro se vším'],
            ['$Cl2/Cl^-$', '+1,36', 'velmi silné'],
            ['$Br2/Br^-$', '+1,07', 'střední'],
            ['$I2/I^-$', '+0,54', 'nejslabší'],
          ],
          caption: 'Standardní redukční potenciály halogenů',
        },
        { type: 'p', text: 'Z toho plyne pravidlo: **silnější halogen vytěsní slabší halogen z roztoku jeho halogenidu**. Opačně to nejde.' },
        { type: 'reaction', equation: 'Cl2 + 2KBr -> 2KCl + Br2', caption: 'roztok zoranžoví až zhnědne' },
        { type: 'reaction', equation: 'Cl2 + 2KI -> 2KCl + I2', caption: 'roztok jodidu zhnědne vyloučeným jodem' },
        {
          type: 'example',
          problem: 'Proběhne reakce, když k roztoku chloridu sodného přidáš bromovou vodu?',
          steps: [
            'Porovnej halogeny: brom je ve skupině níž než chlor, je to slabší oxidační činidlo ($+1,07 V < +1,36 V$).',
            'Slabší halogen nemůže vzít elektrony iontům silnějšího halogenu.',
          ],
          answer: 'Neproběhne, roztok zůstane zbarvený jen bromem.',
        },
        { type: 'p', text: 'Stejný trend ukazuje reakce s vodíkem:' },
        {
          type: 'iconlist',
          items: [
            { icon: 'explosion', title: 'fluor + vodík', text: 'vybuchne i ve tmě a za mrazu' },
            { icon: 'sun', title: 'chlor + vodík', text: 'směs vybuchne po osvětlení' },
            { icon: 'heat', title: 'jod + vodík', text: 'reaguje jen za zahřívání a vratně' },
          ],
        },
        { type: 'reaction', equation: 'H2 + I2 <=> 2HI', caption: 'u jodu se ustaví rovnováha' },
        { type: 'callout', variant: 'remember', text: '==Reaktivita halogenů klesá shora dolů: $F2 > Cl2 > Br2 > I2$.== Kdo je výš, vytěsní toho, kdo je níž.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které reakce proběhnou?',
            options: ['$Cl2 + 2NaBr$', '$Br2 + 2KI$', '$I2 + 2NaCl$', '$Br2 + 2KCl$', '$Cl2 + 2KI$'],
            answers: [0, 1, 4],
            explain: 'Halogen vytěsní jen halogen, který je ve skupině pod ním. Jod ani brom chlor z chloridu nevytěsní.',
          },
        },
      ],
    },
    {
      title: 'Chlor, halogenovodíky a důkaz halogenidů',
      icon: 'test-tube',
      blocks: [
        { type: 'p', text: '**Chlor** se v laboratoři připravuje oxidací kyseliny chlorovodíkové burelem nebo manganistanem draselným. Průmyslově vzniká **elektrolýzou solanky** (roztoku $NaCl$), která dá zároveň hydroxid sodný a vodík.' },
        { type: 'reaction', equation: 'MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O', caption: 'laboratorní příprava chloru' },
        { type: 'reaction', equation: '2NaCl + 2H2O -> 2NaOH + H2 + Cl2', caption: 'elektrolýza solanky' },
        { type: 'p', text: 'Ve vodě chlor částečně reaguje na **kyselinu chlornou** $HClO$, která ničí bakterie: tak se dezinfikuje pitná voda i bazény. Se studeným roztokem $NaOH$ vzniká **chlornan sodný**, účinná složka bělidel typu Savo.' },
        { type: 'reaction', equation: 'Cl2 + H2O <=> HCl + HClO', caption: 'chlorová voda' },
        { type: 'reaction', equation: 'Cl2 + 2NaOH -> NaCl + NaClO + H2O', caption: 'výroba bělidla' },
        { type: 'callout', variant: 'warning', title: 'Savo nikdy nemíchej s kyselinou!', text: 'Kyselé čističe WC obsahují často $HCl$. S chlornanem reagují za uvolnění jedovatého chloru: $NaClO + 2HCl -> NaCl + Cl2 + H2O$. Každý rok kvůli tomu někdo skončí v nemocnici.' },
        { type: 'p', text: '**Halogenovodíky** $HF$, $HCl$, $HBr$ a $HI$ jsou plyny, které se ve vodě výborně rozpouštějí na kyseliny. Síla kyselin roste od $HF$ k $HI$, protože vazba $H−X$ je směrem dolů delší a slabší.' },
        { type: 'molecule', molecules: ['HF', 'HCl'], labels: ['$HF$: slabá kyselina, jako jediná leptá sklo', '$HCl$: silná kyselina'], caption: 'Leptání skla: $SiO2 + 4HF -> SiF4 + 2H2O$' },
        { type: 'p', text: '**Důkaz halogenidů**: k roztoku okyselenému kyselinou dusičnou přidej roztok **dusičnanu stříbrného**. Barva sraženiny stříbrné soli prozradí halogen.' },
        { type: 'reaction', equation: 'Ag^+ + Cl^- -> AgCl', caption: 'bílá sraženina chloridu stříbrného' },
        {
          type: 'compare',
          caption: '$F^-$ sraženinu nedá, protože $AgF$ je rozpustný.',
          columns: [
            { title: '$Cl^-$ → $AgCl$', icon: 'test-tube', tone: 'a', points: ['bílá sraženina', 'na světle šedne'] },
            { title: '$Br^-$ → $AgBr$', icon: 'test-tube', tone: 'b', points: ['nažloutlá sraženina'] },
            { title: '$I^-$ → $AgI$', icon: 'test-tube', tone: 'c', points: ['žlutá sraženina'] },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'K roztoku neznámé soli přidáš $AgNO3$ a vznikne bílá sraženina, která na světle šedne. Napiš její vzorec.',
            accept: ['AgCl'],
            caseSensitive: true,
            placeholder: 'vzorec',
            explain: 'Bílou sraženinu tvoří chlorid stříbrný $AgCl$. Světlem se rozkládá a vylučuje se jemné stříbro, proto šedne.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: fluor v pastě, jod v lékárničce',
      icon: 'toothpaste',
      blocks: [
        { type: 'p', text: '**Fluoridy** v zubní pastě (například $NaF$) mění část hydroxyapatitu ve sklovině $Ca5(PO4)3OH$ na **fluorapatit** $Ca5(PO4)3F$. Ten lépe odolává kyselinám, které vytvářejí bakterie v ústech.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'toothpaste', title: 'Fluor', text: 'fluoridové zubní pasty, teflonové (PTFE) pánve; dříve freony, které poškozovaly ozonovou vrstvu' },
            { icon: 'swimming-pool', title: 'Chlor', text: 'dezinfekce vody a bazénů (typická „chlorová“ vůně), výroba PVC a bělidel' },
            { icon: 'fire-extinguisher', title: 'Brom', text: 'dříve fotografický film s $AgBr$, dnes zpomalovače hoření v plastech' },
            { icon: 'pill', title: 'Jodová tinktura', text: 'roztok jodu v ethanolu (s přídavkem $KI$) dezinfikuje kůži kolem ran; jod je i v kontrastních látkách pro rentgen' },
            { icon: 'salt', title: 'Jodidovaná sůl', text: 'štítná žláza potřebuje jod k tvorbě hormonů, a tak se do soli přidává trocha jodidu nebo jodičnanu draselného' },
          ],
        },
        { type: 'molecule', molecules: ['CCl2F2'], labels: ['freon $CCl2F2$ (dichlordifluormethan)'], caption: 'Freony plnily ledničky a spreje. Ve stratosféře z nich UV záření uvolňuje chlor, který rozkládá ozon.' },
        { type: 'callout', variant: 'tip', title: 'Jod a škrob', text: 'Jod dává se škrobem **tmavě modré až černofialové** zbarvení. Tahle reakce je tak citlivá, že slouží jako důkaz jodu i škrobu.' },
        { type: 'callout', variant: 'warning', text: 'Chlor i páry bromu jsou jedovaté a leptají dýchací cesty, pracuje se s nimi jen v digestoři. Brom na kůži způsobuje těžko se hojící popáleniny. Jodovou tinkturu používej jen na kůži, nikdy ji nepij.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Fluoridy v zubní pastě zpevňují sklovinu tím, že z ní vytvoří fluorapatit, který je odolnější vůči kyselinám.',
            answer: true,
            explain: 'Ion $F^-$ nahradí v hydroxyapatitu skupinu $OH^-$ a vznikne fluorapatit, který kyseliny rozpouštějí mnohem hůř.',
          },
        },
      ],
    },
    {
      title: 'Vzácné plyny: aristokraté tabulky',
      icon: 'balloon',
      blocks: [
        { type: 'elements', symbols: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'], caption: '18. skupina: vzácné plyny' },
        { type: 'p', text: '**Vzácné plyny** mají zaplněnou valenční vrstvu (helium $1s^2$, ostatní $ns^2 np^6$) a nejvyšší ionizační energie ve svých periodách. Elektron nepotřebují přijmout ani odevzdat, proto existují jako jednotlivé atomy a skoro s ničím nereagují.' },
        { type: 'diagram', id: 'bohr', props: { z: 10 }, caption: 'Neon: plně obsazená druhá vrstva, stabilní oktet' },
        {
          type: 'iconlist',
          items: [
            { icon: 'balloon', title: 'Helium', text: 'balonky, vzducholodě, dýchací směsi potápěčů, chlazení magnetů v MR; lehčí než vzduch a nehořlavé, kapalné vře při −269 °C' },
            { icon: 'lightning', title: 'Neon', text: 'reklamní trubice: ve výboji svítí oranžovočerveně' },
            { icon: 'gas-cylinder', title: 'Argon', text: 'náplň žárovek, ochranný plyn při svařování; ve vzduchu ho je 0,93 %, je levný a chrání horký kov před kyslíkem' },
            { icon: 'car', title: 'Krypton a xenon', text: 'izolační dvojskla, výbojky, xenonová světla aut: dobře izolují a jasně svítí' },
            { icon: 'hazard', title: 'Radon', text: 'je radioaktivní a užitečné využití nemá' },
          ],
        },
        { type: 'callout', variant: 'warning', title: 'Radon ve sklepě', text: 'Radon vzniká rozpadem uranu v horninách a hromadí se ve sklepech a přízemích. Česko má kvůli žulovému podloží jedno z nejvyšších radonových rizik v Evropě. Pomáhá pravidelné větrání a izolace podlah; měření radonu v domě se vyplatí.' },
        { type: 'callout', variant: 'fact', title: 'Sloučeniny „netečných“ plynů', text: 'V roce 1962 připravil Neil Bartlett první sloučeninu xenonu, brzy následovaly fluoridy $XeF2$, $XeF4$ a $XeF6$. Velký atom xenonu má valenční elektrony daleko od jádra a nejsilnější oxidační činidlo, fluor, mu je dokáže „vzít“. S heliem to nejde.' },
        { type: 'reaction', equation: 'Xe + 2F2 -> XeF4', caption: 'fluorid xenoničitý' },
        { type: 'molecule', molecules: ['XeF4'], labels: ['$XeF4$: čtvercová molekula'] },
        { type: 'game', gameId: 'who-am-i', text: 'Hádej prvek podle nápověd: „Svítím v reklamách oranžovočerveně…“' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď vzácný plyn k jeho typickému použití.',
            pairs: [
              ['helium', 'plnění balonků'],
              ['neon', 'svítící reklamy'],
              ['argon', 'ochranná atmosféra při svařování'],
              ['xenon', 'výbojky autosvětel'],
            ],
            explain: 'Helium je lehké a nehořlavé, neon svítí oranžovočerveně, levný argon chrání kov před oxidací a xenon dává jasné bílé světlo.',
          },
        },
      ],
    },
  ],
  summary: [
    'Halogeny mají 7 valenčních elektronů, tvoří molekuly $X2$ a přijímají elektron za vzniku aniontů $X^-$.',
    'Směrem dolů ve skupině halogenů tmavne barva, roste teplota varu a klesá elektronegativita i reaktivita.',
    'Silnější halogen vytěsní slabší z roztoku jeho halogenidu, například $Cl2 + 2KBr -> 2KCl + Br2$.',
    'Chlor se vyrábí elektrolýzou solanky a slouží k dezinfekci vody a výrobě bělidel; Savo se nesmí míchat s kyselinami.',
    'Dusičnan stříbrný dává s $Cl^-$ bílou, s $Br^-$ nažloutlou a s $I^-$ žlutou sraženinu.',
    'Vzácné plyny mají zaplněnou valenční vrstvu, proto jsou jednoatomové a téměř nereaktivní; xenon přesto tvoří fluoridy.',
  ],
  quiz: [
    {
      kind: 'order',
      q: 'Seřaď halogeny od nejreaktivnějšího po nejméně reaktivní.',
      items: ['$F2$', '$Cl2$', '$Br2$', '$I2$'],
      explain: 'Reaktivita klesá shora dolů, protože větší atom přitahuje přijímaný elektron slaběji.',
    },
    {
      kind: 'choice',
      q: 'K bezbarvému roztoku jodidu draselného přileješ chlorovou vodu. Co uvidíš?',
      options: ['Roztok zhnědne, vyloučí se jod.', 'Vznikne bílá sraženina.', 'Roztok zůstane bezbarvý.', 'Unikají fialové páry chloru.'],
      answer: 0,
      explain: 'Chlor je silnější oxidační činidlo než jod: $Cl2 + 2KI -> 2KCl + I2$, a jod barví roztok hnědě.',
    },
    {
      kind: 'tf',
      q: 'Jod vytěsní chlor z roztoku chloridu sodného.',
      answer: false,
      explain: 'Jod je slabší oxidační činidlo než chlor, takže elektrony chloridovým iontům nevezme.',
    },
    {
      kind: 'match',
      q: 'Přiřaď ion k výsledku zkoušky s $AgNO3$.',
      pairs: [
        ['$Cl^-$', 'bílá sraženina'],
        ['$Br^-$', 'nažloutlá sraženina'],
        ['$I^-$', 'žlutá sraženina'],
        ['$F^-$', 'sraženina nevznikne'],
      ],
      explain: 'Stříbrné halogenidy $AgCl$, $AgBr$ a $AgI$ jsou nerozpustné a směrem k jodu žloutnou, $AgF$ je rozpustný.',
    },
    {
      kind: 'multi',
      q: 'Které z těchto prvků jsou za běžných podmínek plyny tvořené dvouatomovými molekulami?',
      options: ['fluor', 'chlor', 'brom', 'argon', 'jod'],
      answers: [0, 1],
      explain: 'Brom je kapalina a jod pevná látka. Argon je sice plyn, ale tvoří ho jednotlivé atomy.',
    },
    {
      kind: 'text',
      q: 'Jak se jmenuje sloučenina $NaClO$, účinná složka bělidel?',
      accept: ['chlornan sodný', 'chlornan sodny'],
      placeholder: 'název',
      explain: 'Chlor má v ní oxidační číslo $+I$ (koncovka -ná), jde o sůl kyseliny chlorné: chlornan sodný.',
    },
    {
      kind: 'number',
      q: 'Kolik gramů chloridu stříbrného se vysráží z roztoku obsahujícího 0,02 mol $NaCl$ po přidání nadbytku $AgNO3$? $M(AgCl) = 143,5 g/mol$.',
      answer: 2.87,
      tolerance: 0.02,
      unit: 'g',
      explain: '$n(AgCl) = n(NaCl) = 0,02 mol$, $m = 0,02 · 143,5 = 2,87 g$.',
    },
    {
      kind: 'tf',
      q: 'Xenon tvoří sloučeniny s fluorem, přestože patří mezi vzácné plyny.',
      answer: true,
      explain: 'Velký atom xenonu drží valenční elektrony slabě a fluor jako nejsilnější oxidační činidlo mu je dokáže odebrat ($XeF2$, $XeF4$, $XeF6$).',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l7-3 Síra, dusík a fosfor                                           */
/* ------------------------------------------------------------------ */

const l73: Lesson = {
  id: 'l7-3',
  title: 'Síra, dusík a fosfor',
  goals: [
    'Popsat alotropy síry, její oxidy a výrobu kyseliny sírové kontaktním způsobem',
    'Vysvětlit netečnost dusíku a podmínky Haberovy–Boschovy syntézy amoniaku pomocí Le Chatelierova principu',
    'Porovnat bílý a červený fosfor a vysvětlit, jak hnojiva s dusíkem a fosforem způsobují eutrofizaci',
    'Popsat koloběh dusíku',
  ],
  hook: 'Zápach zkažených vajec, vzduch, který právě dýcháš, a hlavička zápalky. Co mají společného? A proč by bez jedné chemické továrny neměla co jíst skoro polovina lidstva?',
  sections: [
    {
      title: 'Síra: žlutý prvek s mnoha tvářemi',
      icon: 'crystal',
      blocks: [
        { type: 'elements', symbols: ['S'], caption: 'síra, $Z = 16$, 16. skupina pod kyslíkem' },
        { type: 'p', text: '**Síra** je žlutá, křehká pevná látka, nerozpustná ve vodě. Její atomy se spojují do cyklických molekul $S8$ ve tvaru korunky a podle jejich uspořádání rozlišujeme několik alotropických modifikací.' },
        { type: 'molecule', molecules: ['S8'], labels: ['$S8$: korunka z osmi atomů síry'] },
        {
          type: 'compare',
          caption: 'Alotropické modifikace síry',
          columns: [
            { title: 'síra kosočtverečná', icon: 'crystal', tone: 'a', points: ['stálá za pokojové teploty', 'světle žluté krystaly'] },
            { title: 'síra jednoklonná', icon: 'heat', tone: 'b', points: ['stálá nad 95,5 °C', 'jehlicovité krystaly'] },
            { title: 'plastická síra', icon: 'drop', tone: 'c', points: ['roztavená síra vlitá do studené vody', 'dlouhé řetězce atomů, gumovitá a hnědá', 'časem se mění zpět na kosočtverečnou'] },
          ],
        },
        { type: 'p', text: 'Síra má 6 valenčních elektronů a elektronegativitu 2,58. S kovy a vodíkem tvoří sloučeniny s oxidačním číslem $−II$, s kyslíkem naopak kladná oxidační čísla.' },
        {
          type: 'table',
          headers: ['oxidační číslo', 'příklad', 'název'],
          rows: [
            ['$−II$', '$H2S$, $FeS2$, $ZnS$', 'sulfan (sirovodík), sulfidy'],
            ['$0$', '$S8$', 'síra'],
            ['$+IV$', '$SO2$, $H2SO3$, $Na2SO3$', 'oxid siřičitý, kyselina siřičitá, siřičitany'],
            ['$+VI$', '$SO3$, $H2SO4$, $CaSO4$', 'oxid sírový, kyselina sírová, sírany'],
          ],
          caption: 'V $FeS2$ (pyrit) jde o disulfid, síra v něm má formálně $−I$',
        },
        { type: 'p', text: 'Hořením síry (a také uhlí a nafty, které síru obsahují) vzniká **oxid siřičitý**: bezbarvý, štiplavě páchnoucí a jedovatý plyn. Ve vzduchu se oxiduje a s vodou vytváří **kyselé deště**.' },
        { type: 'reaction', equation: 'S + O2 -> SO2', caption: 'síra hoří modrým plamenem' },
        { type: 'diagram', id: 'acid-rain', caption: 'Oxidy síry a dusíku ze spalin se ve vzduchu mění na kyseliny a padají v dešti' },
        { type: 'callout', variant: 'fact', title: 'Černý trojúhelník', text: 'V 70. a 80. letech spalovaly elektrárny v severních Čechách hnědé uhlí bohaté na síru a kyselé deště zničily lesy v Krušných horách. Dnes elektrárny spaliny **odsiřují** vápencem a vedlejším produktem je sádrovec: $2CaSO3 + O2 + 4H2O -> 2CaSO4·2H2O$.' },
        { type: 'callout', variant: 'warning', text: 'Sulfan $H2S$ páchne po zkažených vejcích, ale ve vyšší koncentraci ochromí čich a zabíjí. Když zápach „zmizí“, neznamená to, že plyn odešel.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jaké oxidační číslo má síra v kyselině siřičité $H2SO3$?',
            options: ['$+IV$', '$+VI$', '$+II$', '$−II$'],
            answer: 0,
            explain: '$2 · (+I) + x + 3 · (−II) = 0$, takže $x = +IV$. Proto koncovka -ičitá.',
          },
        },
      ],
    },
    {
      title: 'Kontaktní výroba kyseliny sírové',
      icon: 'factory',
      blocks: [
        { type: 'p', text: '**Kyselina sírová** je nejvyráběnější chemikálií světa. Vyrábí se **kontaktním způsobem**: plyny reagují při kontaktu s pevným katalyzátorem.' },
        { type: 'diagram', id: 'contact-process', caption: 'Kontaktní způsob: od síry přes $SO2$ a $SO3$ ke kyselině sírové' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'flame', title: 'Spálení síry', text: '$S + O2 -> SO2$ (nebo pražení pyritu)' },
            { icon: 'catalyst', title: 'Oxidace na $SO3$', text: 'katalyzátor $V2O5$, asi 450 °C' },
            { icon: 'flask', title: 'Pohlcení v $H2SO4$', text: '$SO3 + H2SO4 -> H2S2O7$, vzniká oleum (kyselina disírová)' },
            { icon: 'drop', title: 'Zředění vodou', text: '$H2S2O7 + H2O -> 2H2SO4$' },
          ],
        },
        { type: 'reaction', equation: '2SO2 + O2 <=> 2SO3', caption: 'klíčový vratný krok: ΔH = −198 kJ, katalyzátor $V2O5$' },
        { type: 'molecule', molecules: ['SO2', 'SO3', 'H2SO4'], labels: ['oxid siřičitý', 'oxid sírový', 'kyselina sírová'] },
        { type: 'p', text: 'Reakce je **exotermní**: nízká teplota by podle Le Chatelierova principu zvýšila výtěžek, ale reakce by byla příliš pomalá. ==450 °C s katalyzátorem je kompromis mezi výtěžkem a rychlostí.== Vyšší tlak by pomohl (3 moly plynu → 2), ale konverze přes 99 % stačí i za tlaku blízkého atmosférickému, a drahé kompresory se nevyplatí.' },
        { type: 'callout', variant: 'tip', title: 'Proč ne rovnou do vody?', text: 'Reakce $SO3$ s vodou je tak prudce exotermní, že vznikne mlha drobných kapiček kyseliny, kterou nejde zachytit. Proto se $SO3$ pohlcuje v kyselině sírové.' },
        {
          type: 'example',
          title: 'Kolik kyseliny z tuny síry?',
          problem: 'Kolik tun $H2SO4$ lze teoreticky vyrobit z 1 t síry? $M(S) = 32 g/mol$, $M(H2SO4) = 98 g/mol$.',
          steps: [
            'Z rovnic plyne: 1 mol $S$ → 1 mol $SO2$ → 1 mol $SO3$ → 1 mol $H2SO4$.',
            '$n(S) = 1 000 000 g / 32 g/mol = 31 250 mol$',
            '$m(H2SO4) = 31 250 mol · 98 g/mol = 3 062 500 g$',
          ],
          answer: 'Asi 3,06 t kyseliny sírové.',
        },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď meziprodukty kontaktního způsobu od suroviny k produktu.',
            items: ['$S$', '$SO2$', '$SO3$', '$H2S2O7$', '$H2SO4$'],
            explain: 'Síra shoří na $SO2$, ten se na $V2O5$ oxiduje na $SO3$, který se pohltí v kyselině na oleum $H2S2O7$ a to se zředí vodou.',
          },
        },
      ],
    },
    {
      title: 'Vlastnosti kyseliny sírové a sírany',
      icon: 'hazard',
      blocks: [
        { type: 'p', text: 'Koncentrovaná (96–98%) kyselina sírová je silně **hygroskopická** (pohlcuje vlhkost) a **dehydratační**: odebírá vodu i látkám, které ji jako molekuly neobsahují. Cukr v ní zčerná a nabobtná v porézní uhlík.' },
        { type: 'reaction', equation: 'C12H22O11 -> 12C + 11H2O', caption: 'zuhelnatění sacharózy koncentrovanou kyselinou sírovou' },
        {
          type: 'compare',
          columns: [
            { title: 'koncentrovaná $H2SO4$', icon: 'hazard', tone: 'b', points: ['olejovitá kapalina, 1,84 g/cm³', 'hygroskopická a dehydratační', 'za horka oxidační činidlo, rozpustí i měď: $Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O$'] },
            { title: 'zředěná $H2SO4$', icon: 'drop', tone: 'a', points: ['chová se jako běžná silná kyselina', 's neušlechtilými kovy uvolňuje vodík: $Zn + H2SO4 -> ZnSO4 + H2$'] },
          ],
        },
        { type: 'p', text: '**Sírany** jsou většinou rozpustné. Výjimkou je síran barnatý $BaSO4$, tak nerozpustný, že se pije jako kontrastní látka před rentgenem žaludku. Jeho bílá sraženina zároveň slouží jako důkaz síranů.' },
        { type: 'reaction', equation: 'Ba^2+ + SO4^2- -> BaSO4', caption: 'důkaz síranů: bílá sraženina' },
        {
          type: 'iconlist',
          items: [
            { icon: 'crystal', title: 'Modrá skalice', text: '$CuSO4·5H2O$' },
            { icon: 'bone', title: 'Sádrovec', text: '$CaSO4·2H2O$, z něj se vyrábí sádra' },
            { icon: 'stomach', title: 'Síran barnatý', text: '$BaSO4$, kontrastní látka pro rentgen' },
          ],
        },
        { type: 'callout', variant: 'warning', title: 'Nejdřív voda, potom kyselina', text: 'Ředění kyseliny sírové uvolňuje obrovské teplo. Lij vždy kyselinu pomalu do vody a za míchání, nikdy naopak: voda nalitá do kyseliny se okamžitě vaří a vystříkne i s kyselinou. Ochranné brýle a rukavice jsou samozřejmost.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Co se stane, když na cukr naliješ koncentrovanou kyselinu sírovou?',
            options: [
              'Cukr zčerná a nabobtná v porézní uhlík, protože mu kyselina odebere vodu.',
              'Cukr se v kyselině jen rozpustí na bezbarvý roztok.',
              'Unikne vodík a cukr zůstane bílý.',
              'Vznikne bílá sraženina síranu.',
            ],
            answer: 0,
            explain: 'Koncentrovaná $H2SO4$ je dehydratační činidlo: z molekul sacharózy odebere vodík a kyslík v poměru jako ve vodě a zůstane uhlík.',
          },
        },
      ],
    },
    {
      title: 'Dusík: netečný plyn, bez kterého není život',
      icon: 'fertilizer',
      blocks: [
        { type: 'elements', symbols: ['N'], caption: 'dusík, $Z = 7$, 15. skupina' },
        { type: 'p', text: '**Dusík** tvoří 78 % objemu vzduchu. Jeho **trojná vazba** $N≡N$ (945 kJ/mol) patří k nejpevnějším vůbec, proto je dusík velmi netečný. Slouží jako **ochranná atmosféra**, třeba v sáčcích chipsů, aby nežlukly.' },
        { type: 'molecule', molecules: ['N2', 'NH3'], labels: ['dusík $N≡N$: trojná vazba', 'amoniak: trojboká pyramida'] },
        { type: 'p', text: 'Rostliny i zvířata dusík nutně potřebují (je v bílkovinách i DNA), ale vzdušný $N2$ neumí přímo využít. Vázaný dusík byl proto dlouho vzácný, dokud nepřišla **Haberova–Boschova syntéza amoniaku**.' },
        { type: 'reaction', equation: 'N2 + 3H2 <=> 2NH3', caption: 'ΔH = −92 kJ; železný katalyzátor, 400–450 °C, asi 20 MPa' },
        { type: 'diagram', id: 'haber-process', caption: 'Haberova–Boschova syntéza: nezreagovaný dusík a vodík se vracejí do reaktoru' },
        {
          type: 'compare',
          caption: 'Dva průmyslové procesy, jeden princip: Le Chatelier a kompromis s rychlostí',
          columns: [
            { title: 'Haberova–Boschova syntéza', icon: 'fertilizer', tone: 'a', points: ['$N2 + 3H2 <=> 2NH3$', 'ΔH = −92 kJ (exotermní)', 'katalyzátor železo', '400–450 °C (kompromis)', 'vysoký tlak, asi 20 MPa (4 mol plynu → 2 mol)', 'asi 15 % při jednom průchodu, nezreagovaný plyn se vrací do reaktoru'] },
            { title: 'kontaktní způsob', icon: 'factory', tone: 'b', points: ['$2SO2 + O2 <=> 2SO3$', 'ΔH = −198 kJ (exotermní)', 'katalyzátor $V2O5$', 'asi 450 °C (kompromis)', 'téměř atmosférický tlak (konverze je i tak vysoká)', 'celkem přes 99 % (několik vrstev katalyzátoru)'] },
          ],
        },
        { type: 'p', text: '**Amoniak** $NH3$ je bezbarvý, štiplavě páchnoucí plyn, výborně rozpustný ve vodě. Je to zásada: $NH3 + H2O <=> NH4^+ + OH^-$. S chlorovodíkem tvoří bílý dým chloridu amonného.' },
        { type: 'reaction', equation: 'NH3 + HCl -> NH4Cl', caption: 'bílý dým chloridu amonného' },
        { type: 'p', text: 'Z amoniaku se **Ostwaldovým způsobem** vyrábí **kyselina dusičná**.' },
        { type: 'diagram', id: 'ostwald-process', caption: 'Ostwaldův způsob: amoniak → $NO$ → $NO2$ → $HNO3$' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'catalyst', title: 'Spálení amoniaku', text: '$4NH3 + 5O2 -> 4NO + 6H2O$ na platinové síťce (Pt/Rh)' },
            { icon: 'gas-cloud', title: 'Oxidace na $NO2$', text: '$2NO + O2 -> 2NO2$' },
            { icon: 'drop', title: 'Pohlcení ve vodě', text: '$4NO2 + O2 + 2H2O -> 4HNO3$' },
          ],
        },
        { type: 'molecule', molecules: ['HNO3'], labels: ['kyselina dusičná'] },
        { type: 'p', text: 'Koncentrovaná $HNO3$ je silné oxidační činidlo a rozpustí i měď. **Lučavka královská** (1 díl $HNO3$ + 3 díly $HCl$) rozpustí dokonce zlato. Na kůži dělá kyselina dusičná žluté skvrny (**xanthoproteinová reakce** s bílkovinami).' },
        { type: 'reaction', equation: 'Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O', caption: 'měď v koncentrované kyselině dusičné, unikají hnědé dýmy $NO2$' },
        { type: 'callout', variant: 'fact', text: 'Fritz Haber dostal v roce 1918 Nobelovu cenu. Díky jeho syntéze vznikají dusíkatá hnojiva a odhaduje se, že zhruba polovina atomů dusíku v tvém těle už jednou prošla Haberovým reaktorem.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které změny posunou rovnováhu $N2 + 3H2 <=> 2NH3$ (ΔH < 0) ve prospěch amoniaku?',
            options: ['zvýšení tlaku', 'snížení teploty', 'odvádění vzniklého amoniaku', 'přidání katalyzátoru', 'zvýšení teploty'],
            answers: [0, 1, 2],
            explain: 'Vyšší tlak zvýhodní stranu s méně moly plynu, nižší teplota exotermní směr a odvádění produktu táhne rovnováhu doprava. Katalyzátor jen urychlí ustavení rovnováhy.',
          },
        },
      ],
    },
    {
      title: 'Oxidy dusíku a fosfor',
      icon: 'flame',
      blocks: [
        { type: 'molecule', molecules: ['N2O', 'NO', 'NO2'], labels: ['oxid dusný', 'oxid dusnatý', 'oxid dusičitý'] },
        {
          type: 'compare',
          columns: [
            { title: '$N2O$ oxid dusný', icon: 'syringe', tone: 'a', points: ['neutrální, „rajský plyn“', 'anestetikum u zubaře, šlehačkové bombičky'] },
            { title: '$NO$ oxid dusnatý', icon: 'car', tone: 'b', points: ['bezbarvý, neutrální', 'vzniká v motorech a elektrárnách: $N2 + O2 -> 2NO$ za vysoké teploty'] },
            { title: '$NO2$ oxid dusičitý', icon: 'hazard', tone: 'bad', points: ['hnědý, jedovatý, kyselý', 'vzniká oxidací $NO$ na vzduchu', 'kyselé deště, smog'] },
          ],
        },
        { type: 'p', text: 'Ve městech s hustou dopravou vzniká za slunečných dnů **fotochemický smog**: UV záření štěpí $NO2$ a vzniklý atomární kyslík tvoří s $O2$ přízemní ozon. Proti tomu pomáhají **katalyzátory** ve výfucích.' },
        { type: 'reaction', equation: '2CO + 2NO -> 2CO2 + N2', caption: 'autokatalyzátor mění jedovaté plyny na neškodné' },
        { type: 'elements', symbols: ['P'], caption: 'fosfor, $Z = 15$, pod dusíkem' },
        { type: 'p', text: '**Fosfor** je na rozdíl od dusíku pevná látka a volný se v přírodě nevyskytuje. Jeho alotropické modifikace se od sebe liší jako den a noc.' },
        { type: 'molecule', molecules: ['P4'], labels: ['bílý fosfor: čtyřstěn $P4$'] },
        {
          type: 'compare',
          caption: 'Existuje i černý fosfor, vrstevnatý jako grafit.',
          columns: [
            { title: 'bílý fosfor', icon: 'hazard', tone: 'bad', points: ['molekuly $P4$ (čtyřstěn)', 'na vzduchu se sám vznítí (už kolem 30–40 °C), ve tmě světélkuje', 'prudce jedovatý', 'uchovává se pod vodou; zápalné zbraně'] },
            { title: 'červený fosfor', icon: 'flame', tone: 'good', points: ['polymerní řetězce', 'stálý, vzplane až po zapálení', 'téměř neškodný', 'škrtátko krabičky zápalek'] },
          ],
        },
        { type: 'reaction', equation: 'P4 + 5O2 -> P4O10', caption: 'hoření fosforu, vzniká oxid fosforečný' },
        { type: 'reaction', equation: 'P4O10 + 6H2O -> 4H3PO4', caption: 'kyselina fosforečná' },
        { type: 'p', text: '**Kyselina fosforečná** je středně silná a na rozdíl od sírové a dusičné neoxiduje; je v kolových nápojích (E338) a odrezovačích. Její soli, **fosforečnany**, tvoří kosti a zuby a jsou v DNA i v ATP, která v buňkách přenáší energii.' },
        { type: 'callout', variant: 'warning', text: 'Bílý fosfor způsobuje hluboké popáleniny, které se špatně hasí, a už 0,1 g může být smrtelná dávka. Ve škole se s ním nepracuje.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Bílý fosfor se uchovává pod vodou, protože se na vzduchu samovolně vznítí.',
            answer: true,
            explain: 'Bílý fosfor reaguje se vzdušným kyslíkem tak ochotně, že se zahřeje až ke vznícení. Voda k němu kyslík nepustí.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: hnojiva, koloběh dusíku a eutrofizace',
      icon: 'leaf',
      blocks: [
        { type: 'p', text: 'Dusík v přírodě neustále koluje mezi vzduchem, půdou a živými organismy. Tomuto oběhu říkáme **koloběh dusíku**.' },
        { type: 'diagram', id: 'nitrogen-cycle', caption: 'Koloběh dusíku: vzduch → půda → organismy → zpět do vzduchu' },
        {
          type: 'process',
          layout: 'cycle',
          steps: [
            { icon: 'lightning', title: 'Fixace', text: 'hlízkové bakterie na kořenech bobovitých rostlin (hrách, jetel) a blesky převádějí $N2$ na sloučeniny' },
            { icon: 'cell', title: 'Nitrifikace', text: 'půdní bakterie oxidují amonné ionty přes dusitany na dusičnany $NO3^-$' },
            { icon: 'leaf', title: 'Asimilace', text: 'rostliny z dusičnanů tvoří bílkoviny, živočichové je získají potravou' },
            { icon: 'recycle', title: 'Amonizace', text: 'rozkladači mění odumřelá těla a výkaly zpět na amoniak a amonné ionty' },
            { icon: 'wind', title: 'Denitrifikace', text: 'jiné bakterie redukují dusičnany zpět na $N2$, který se vrací do vzduchu' },
          ],
        },
        { type: 'p', text: 'Zemědělci doplňují dusík, fosfor a draslík (**NPK**) hnojivy.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'fertilizer', title: 'ledek amonný', text: '$NH4NO3$' },
            { icon: 'salt', title: 'síran amonný', text: '$(NH4)2SO4$' },
            { icon: 'powder', title: 'draselný ledek', text: '$KNO3$' },
            { icon: 'mortar', title: 'superfosfát', text: 'vzniká z nerozpustného fosforečnanu vápenatého a kyseliny sírové' },
          ],
        },
        { type: 'reaction', equation: 'Ca3(PO4)2 + 2H2SO4 -> Ca(H2PO4)2 + 2CaSO4', caption: 'superfosfát: rozpustný dihydrogenfosforečnan vápenatý + sádra' },
        {
          type: 'example',
          problem: 'Kolik procent dusíku obsahuje ledek amonný $NH4NO3$? $M(N) = 14 g/mol$, $M(NH4NO3) = 80 g/mol$.',
          steps: [
            'V jednom vzorci jsou 2 atomy dusíku: $2 · 14 = 28 g/mol$.',
            '$w(N) = 28 / 80 = 0,35$',
          ],
          answer: 'Ledek amonný obsahuje 35 % dusíku, a proto je velmi účinným hnojivem.',
        },
        { type: 'p', text: 'Co rostliny nevyužijí, skončí ve vodě a spustí **eutrofizaci**: přehnojení vod živinami, po kterém se ryby dusí. Proto EU od roku 2013 omezila fosfáty v pracích prostředcích.' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'rain', title: 'Splach', text: 'déšť odnese dusičnany a fosforečnany do řek a rybníků' },
            { icon: 'leaf', title: 'Vodní květ', text: '„přihnojené“ řasy a sinice se přemnoží' },
            { icon: 'recycle', title: 'Rozklad', text: 'odumřelé řasy se rozkládají a spotřebují kyslík z vody' },
            { icon: 'fish', title: 'Úhyn ryb', text: 'ryby se udusí' },
          ],
        },
        { type: 'callout', variant: 'warning', title: 'Hnojivo, nebo výbušnina?', text: 'Ledek amonný může při zahřátí nebo iniciaci explodovat. V srpnu 2020 zničil výbuch asi 2 750 t ledku v bejrútském přístavu velkou část města. Hnojiva se skladují v suchu, odděleně od paliv a zdrojů tepla.' },
        { type: 'game', gameId: 'naming', text: 'Sírany, siřičitany, dusičnany, fosforečnany… Zvládneš je pojmenovat na čas?' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Kolik procent dusíku obsahuje síran amonný $(NH4)2SO4$? $M = 132 g/mol$. Zaokrouhli na celá procenta.',
            answer: 21,
            tolerance: 0.5,
            unit: '%',
            explain: 'Ve vzorci jsou 2 atomy dusíku: $w(N) = 28 / 132 = 0,212$, tedy asi 21 %.',
          },
        },
      ],
    },
  ],
  summary: [
    'Síra tvoří molekuly $S8$ a alotropy kosočtverečnou, jednoklonnou a plastickou; hořením dává $SO2$, původce kyselých dešťů.',
    'Kyselina sírová se vyrábí kontaktním způsobem: $SO2$ se na $V2O5$ oxiduje na $SO3$, který se pohltí v kyselině na oleum.',
    'Koncentrovaná kyselina sírová je dehydratační a za horka oxidační; při ředění lij kyselinu do vody.',
    'Dusík je netečný kvůli trojné vazbě; amoniak z něj vzniká Haberovou–Boschovou syntézou na železném katalyzátoru za vysokého tlaku.',
    'Z amoniaku se Ostwaldovým způsobem vyrábí kyselina dusičná; oxidy dusíku z motorů způsobují smog a kyselé deště.',
    'Bílý fosfor je jedovatý a samozápalný, červený stálý; fosforečnany jsou v kostech, DNA a hnojivech.',
    'Nadbytek dusičnanů a fosforečnanů ve vodě způsobuje eutrofizaci.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Jaký katalyzátor se používá při oxidaci $SO2$ na $SO3$ v kontaktním způsobu?',
      options: ['oxid vanadičný $V2O5$', 'železo', 'platina s rhodiem', 'nikl'],
      answer: 0,
      explain: 'Kontaktní způsob používá $V2O5$. Železo katalyzuje syntézu amoniaku, Pt/Rh Ostwaldův způsob a nikl ztužování tuků.',
    },
    {
      kind: 'tf',
      q: 'V průmyslu se oxid sírový zavádí přímo do vody.',
      answer: false,
      explain: 'Reakce s vodou je tak bouřlivá, že vzniká kyselá mlha. $SO3$ se proto pohlcuje v koncentrované kyselině sírové a vzniklé oleum se ředí.',
    },
    {
      kind: 'order',
      q: 'Seřaď sloučeniny v pořadí, jak vznikají při výrobě kyseliny dusičné Ostwaldovým způsobem.',
      items: ['$NH3$', '$NO$', '$NO2$', '$HNO3$'],
      explain: 'Amoniak se na Pt/Rh spálí na $NO$, ten se oxiduje na $NO2$ a ten s vodou a kyslíkem dá $HNO3$.',
    },
    {
      kind: 'match',
      q: 'Přiřaď látku k jejímu použití.',
      pairs: [
        ['červený fosfor', 'škrtátko krabičky zápalek'],
        ['$BaSO4$', 'kontrastní látka pro rentgen'],
        ['$NH4NO3$', 'dusíkaté hnojivo'],
        ['$N2$', 'ochranná atmosféra v sáčku chipsů'],
      ],
      explain: 'Červený fosfor je stálý, $BaSO4$ nerozpustný, a proto nejedovatý, ledek amonný dodá hodně dusíku a netečný $N2$ chrání potraviny před oxidací.',
    },
    {
      kind: 'multi',
      q: 'Která tvrzení o koncentrované kyselině sírové platí?',
      options: ['odebírá vodu i cukru, který zuhelnatí', 'za horka rozpouští měď za vzniku $SO2$', 'při ředění se lije do vody', 'je to plyn se štiplavým zápachem', 'je to slabá kyselina'],
      answers: [0, 1, 2],
      explain: 'Koncentrovaná $H2SO4$ je olejovitá kapalina, silná kyselina, dehydratační a za horka oxidační činidlo.',
    },
    {
      kind: 'number',
      q: 'Kolik tun amoniaku teoreticky vznikne z 28 t dusíku? $M(N2) = 28 g/mol$, $M(NH3) = 17 g/mol$.',
      answer: 34,
      tolerance: 0.5,
      unit: 't',
      explain: '28 t dusíku je $10^{6}$ mol $N2$, z rovnice vznikne dvojnásobek, tedy $2·10^{6}$ mol $NH3$, což je 34 t.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec molekuly bílého fosforu.',
      accept: ['P4'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: 'Bílý fosfor tvoří čtyřatomové molekuly $P4$ ve tvaru čtyřstěnu.',
    },
    {
      kind: 'tf',
      q: 'Eutrofizace znamená, že voda obsahuje příliš málo živin, a proto v ní hynou ryby.',
      answer: false,
      explain: 'Je to naopak: nadbytek živin (dusičnanů a fosforečnanů) vede k přemnožení řas a sinic, jejichž rozklad spotřebuje kyslík.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l7-4 Uhlík a křemík                                                 */
/* ------------------------------------------------------------------ */

const l74: Lesson = {
  id: 'l7-4',
  title: 'Uhlík a křemík',
  goals: [
    'Vysvětlit rozdílné vlastnosti diamantu, grafitu, grafenu a fullerenů jejich stavbou',
    'Porovnat oxid uhelnatý a oxid uhličitý a popsat koloběh uhlíku',
    'Zapsat rovnicemi vápencový cyklus a vysvětlit vznik krasových jeskyní',
    'Popsat využití křemíku, oxidu křemičitého a silikátů ve skle, keramice a cementu',
  ],
  hook: 'Tuha v tužce a diamant v prstýnku jsou chemicky totéž: čistý uhlík. Jedno stojí korunu, druhé celý plat. Jak může stejný prvek vypadat tak různě?',
  sections: [
    {
      title: 'Uhlík: jeden prvek, mnoho podob',
      icon: 'diamond',
      blocks: [
        { type: 'elements', symbols: ['C'], caption: 'uhlík, $Z = 6$, 14. skupina' },
        { type: 'p', text: '**Uhlík** má 4 valenční elektrony, a tak tvoří 4 kovalentní vazby. Jeho atomy se ochotně spojují do řetězců, kruhů i prostorových sítí, a proto má uhlík víc alotropických modifikací než kterýkoli jiný prvek.' },
        { type: 'diagram', id: 'carbon-allotropes', caption: 'Diamant, grafit, grafen, fulleren $C60$ a nanotrubice: stejné atomy, jiné propojení' },
        {
          type: 'compare',
          columns: [
            { title: 'diamant', icon: 'diamond', tone: 'a', points: ['každý atom C vázán na 4 další: prostorová síť čtyřstěnů', 'nejtvrdší přírodní látka', 'nevede proud, průhledný', 'řezné a vrtné nástroje, šperky'] },
            { title: 'grafit', icon: 'pencil', tone: 'b', points: ['vrstvy šestiúhelníků, každý C má 3 vazby', '4. elektron je volně pohyblivý', 'měkký, šedočerný, vede proud', 'tuhy, elektrody, mazivo, anody Li-ion baterií'] },
          ],
        },
        { type: 'p', text: 'Vrstvy grafitu drží pohromadě jen slabé mezimolekulové síly, proto po sobě kloužou a tuha píše po papíře. ==Vlastnosti alotropů neurčuje prvek, ale způsob, jak jsou jeho atomy propojené.==' },
        {
          type: 'iconlist',
          items: [
            { icon: 'phone', title: 'Grafen', text: 'jediná vrstva grafitu silná jeden atom; extrémně pevný, výborně vede proud i teplo (výzkum: elektronika, senzory, kompozity)' },
            { icon: 'molecule', title: 'Fullereny', text: 'kulovité molekuly, nejznámější $C60$ jako fotbalový míč; molekulová látka rozpustná v organických rozpouštědlech' },
            { icon: 'bond', title: 'Nanotrubice', text: 'srolovaný grafen o průměru jednotek nm; pevnější než ocel, vedou proud (rámy kol, rakety, elektronika)' },
            { icon: 'pill', title: 'Amorfní uhlík', text: 'saze, dřevěné uhlí a **aktivní uhlí**: vnitřní povrch až 1 000 m² v gramu zachytí jedy, pachy i barviva (lékárnička, filtry na vodu)' },
          ],
        },
        { type: 'callout', variant: 'fact', title: 'Diamanty nejsou věčné', text: 'Za běžných podmínek je stálejší grafit a diamant by se na něj měl přeměnit. Reakce má ale tak obrovskou aktivační energii, že neproběhne ani za miliardy let. Termodynamika říká „ano“, kinetika „nikdy“.' },
        { type: 'callout', variant: 'fact', text: 'Grafen poprvé získali v roce 2004 Andre Geim a Konstantin Novoselov: z grafitu ho odlupovali obyčejnou lepicí páskou. V roce 2010 za to dostali Nobelovu cenu.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které formy uhlíku vedou elektrický proud?',
            options: ['grafit', 'grafen', 'uhlíkové nanotrubice', 'diamant'],
            answers: [0, 1, 2],
            explain: 'V grafitu, grafenu i nanotrubicích má každý atom C jen 3 vazby a čtvrtý elektron se může pohybovat. V diamantu jsou všechny 4 elektrony pevně ve vazbách.',
          },
        },
      ],
    },
    {
      title: 'Oxid uhelnatý, oxid uhličitý a koloběh uhlíku',
      icon: 'gas-cloud',
      blocks: [
        { type: 'p', text: 'Když uhlík nebo jeho sloučeniny hoří s dostatkem kyslíku, vzniká **oxid uhličitý**. Při nedostatku kyslíku vzniká jedovatý **oxid uhelnatý**.' },
        { type: 'reaction', equation: 'C + O2 -> CO2', caption: 'dokonalé spalování' },
        { type: 'reaction', equation: '2C + O2 -> 2CO', caption: 'nedokonalé spalování' },
        { type: 'molecule', molecules: ['CO', 'CO2'], labels: ['$C≡O$', '$O=C=O$: lineární, nepolární'] },
        {
          type: 'compare',
          columns: [
            { title: 'oxid uhelnatý $CO$', icon: 'hazard', tone: 'bad', points: ['bezbarvý, bez zápachu', 'o něco lehčí než vzduch', 'hoří modrým plamenem, redukční činidlo', 'neutrální oxid', 'prudce jedovatý: váže se na hemoglobin asi 200–250× pevněji než kyslík, a krev pak nemůže roznášet kyslík'] },
            { title: 'oxid uhličitý $CO2$', icon: 'fire-extinguisher', tone: 'a', points: ['bezbarvý, bez zápachu, nakysle štípe v nose', 'asi 1,5× těžší než vzduch, drží se u země', 'nehoří a hoření nepodporuje', 'kyselý oxid', 've vysoké koncentraci dusí'] },
          ],
        },
        { type: 'p', text: '$CO2$ se rozpouští ve vodě za vzniku slabé **kyseliny uhličité**, a proto bublinky v minerálce chutnají trochu kysele. Vápennou vodu zakalí, a to je jeho důkaz.' },
        { type: 'reaction', equation: 'CO2 + H2O <=> H2CO3' },
        { type: 'reaction', equation: 'Ca(OH)2 + CO2 -> CaCO3 + H2O', caption: 'důkaz $CO2$: vápenná voda se zakalí' },
        { type: 'p', text: '$CO2$ je hlavní **skleníkový plyn**. V **koloběhu uhlíku** ho rostliny fotosyntézou berou ze vzduchu, dýchání a rozklad ho vracejí a vápence ho uchovávají miliony let. Spalováním fosilních paliv stoupla jeho koncentrace z asi 280 ppm před průmyslovou revolucí na víc než 420 ppm.' },
        { type: 'diagram', id: 'carbon-cycle', caption: 'Koloběh uhlíku: atmosféra, rostliny, živočichové, oceány, horniny a fosilní paliva' },
        { type: 'reaction', equation: '6CO2 + 6H2O -> C6H12O6 + 6O2', caption: 'fotosyntéza (dýchání probíhá opačně)' },
        { type: 'callout', variant: 'warning', title: 'Tichý zabiják', text: 'Oxid uhelnatý nevidíš ani necítíš. Vzniká ve špatně větraných plynových karmách, kamnech a v uzavřených garážích s běžícím motorem, proto do bytu s plynovým spotřebičem patří **detektor CO**. Pozor i na $CO2$: ve vinných sklepech při kvašení vytlačí vzduch u podlahy.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč se oxidem uhličitým hasí požáry?',
            options: [
              'Je těžší než vzduch, nehoří a oddělí hořící látku od kyslíku.',
              'Reaguje s plamenem za vzniku vody.',
              'Je lehčí než vzduch a odnese teplo nahoru.',
              'Je to redukční činidlo, které odebere kyslík z paliva.',
            ],
            answer: 0,
            explain: '$CO2$ nehoří ani hoření nepodporuje a jako těžký plyn „přikryje“ hořící předmět.',
          },
        },
      ],
    },
    {
      title: 'Uhličitany a jedlá soda',
      icon: 'bread',
      blocks: [
        { type: 'p', text: '**Uhličitany** obsahují anion $CO3^2-$, **hydrogenuhličitany** anion $HCO3^-$. Nejrozšířenější je **uhličitan vápenatý** $CaCO3$: vápenec, mramor, křída i skořápky mušlí. S kyselinami uhličitany šumí, protože uvolňují $CO2$.' },
        { type: 'molecule', molecules: ['CO3^2-', 'HCO3-'], labels: ['uhličitanový anion', 'hydrogenuhličitanový anion'] },
        { type: 'reaction', equation: 'CaCO3 + 2HCl -> CaCl2 + H2O + CO2', caption: 'důkaz uhličitanu: šumění' },
        { type: 'p', text: 'V kuchyni najdeš **hydrogenuhličitan sodný** $NaHCO3$, tedy **jedlou sodu**. Je součástí kypřicího prášku: při pečení se rozkládá a bublinky $CO2$ nakypří těsto.' },
        { type: 'reaction', equation: '2NaHCO3 -> Na2CO3 + H2O + CO2', caption: 'rozklad jedlé sody zahřátím' },
        {
          type: 'process',
          layout: 'flow',
          caption: 'Pokus do kuchyně: bezpečný, stačí soda a ocet',
          steps: [
            { icon: 'powder', title: 'Soda do sklenice', text: 'nasyp lžičku jedlé sody' },
            { icon: 'drop', title: 'Přilij ocet', text: 'kyselina octová rozloží hydrogenuhličitan' },
            { icon: 'gas-cloud', title: 'Šumění', text: 'uniká $CO2$' },
            { icon: 'fire-extinguisher', title: 'Zápalka zhasne', text: 'těžký $CO2$ nad sklenicí uhasí hořící zápalku' },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Co nakypří těsto, do kterého přidáš jedlou sodu?',
            options: ['bublinky oxidu uhličitého', 'bublinky vodíku', 'bublinky kyslíku', 'vodní pára z krystalové vody sody'],
            answer: 0,
            explain: 'Hydrogenuhličitan sodný se teplem (nebo kyselinou) rozkládá a uvolňuje $CO2$, jehož bublinky těsto nadzvednou.',
          },
        },
      ],
    },
    {
      title: 'Vápencový cyklus a kras',
      icon: 'mountain',
      blocks: [
        { type: 'p', text: 'Z vápence se už od starověku vyrábí stavební pojivo. Celý děj je uzavřený kruh, který se jmenuje **vápencový cyklus**.' },
        { type: 'diagram', id: 'limestone-cycle', caption: 'Vápencový cyklus: vápenec → pálené vápno → hašené vápno → vápenec' },
        {
          type: 'process',
          layout: 'cycle',
          steps: [
            { icon: 'heat', title: 'Pálení vápna', text: '$CaCO3 -> CaO + CO2$ ve vápence, asi 900 °C (endotermní)' },
            { icon: 'drop', title: 'Hašení vápna', text: '$CaO + H2O -> Ca(OH)2$, silně exotermní, voda se vaří' },
            { icon: 'mountain', title: 'Tuhnutí malty', text: '$Ca(OH)2 + CO2 -> CaCO3 + H2O$: hašené vápno pohlcuje $CO2$ ze vzduchu' },
          ],
        },
        { type: 'reaction', equation: 'CaCO3 -> CaO + CO2', caption: 'pálení vápna' },
        {
          type: 'keyterms',
          items: [
            { term: 'pálené vápno', def: 'oxid vápenatý $CaO$' },
            { term: 'hašené vápno', def: 'hydroxid vápenatý $Ca(OH)2$' },
            { term: 'vápenná malta', def: 'směs hašeného vápna, písku a vody; tuhne na $CaCO3$, tedy zpátky na „vápenec“' },
          ],
        },
        {
          type: 'example',
          problem: 'Kolik tun $CO2$ se uvolní při pálení 1 t vápence? $M(CaCO3) = 100 g/mol$, $M(CO2) = 44 g/mol$.',
          steps: [
            'Z rovnice: 1 mol $CaCO3$ → 1 mol $CO2$.',
            '$m(CO2) = 1 t · 44 / 100$',
          ],
          answer: '0,44 t $CO2$. Výroba vápna a cementu proto patří k velkým zdrojům skleníkových plynů.',
        },
        { type: 'p', text: 'Voda s rozpuštěným $CO2$ rozpouští vápenec na rozpustný hydrogenuhličitan, a tak vznikají **krasové jeskyně**, třeba v Moravském krasu s propastí Macocha. Když voda kape ze stropu, $CO2$ uniká, rovnováha se posune doleva a vylučuje se $CaCO3$: rostou **krápníky** (stalaktity shora, stalagmity zdola).' },
        { type: 'reaction', equation: 'CaCO3 + H2O + CO2 <=> Ca(HCO3)2', caption: 'doprava: vznik jeskyní; doleva: růst krápníků' },
        { type: 'callout', variant: 'warning', text: 'Pálené i hašené vápno jsou silně žíravé a hlavně v očích napáchají velkou škodu. Při hašení vápna nos ochranné brýle a rukavice, směs se prudce zahřívá a může vystříknout.' },
        {
          type: 'check',
          question: {
            kind: 'order',
            q: 'Seřaď látky ve vápencovém cyklu od vápence zpět k tuhé maltě.',
            items: ['$CaCO3$ (vápenec)', '$CaO$ (pálené vápno)', '$Ca(OH)2$ (hašené vápno)', '$CaCO3$ (ztuhlá malta)'],
            explain: 'Vápenec se pálí na $CaO$, hašením vodou vznikne $Ca(OH)2$ a ten s $CO2$ ze vzduchu ztuhne zpět na $CaCO3$.',
          },
        },
      ],
    },
    {
      title: 'Křemík: od písku k čipům',
      icon: 'phone',
      blocks: [
        { type: 'elements', symbols: ['Si'], caption: 'křemík, $Z = 14$, pod uhlíkem' },
        { type: 'p', text: '**Křemík** je po kyslíku druhým nejrozšířenějším prvkem zemské kůry (asi 28 %), volný se ale nevyskytuje. Je to lesklý, křehký **polokov** a **polovodič**: jeho vodivost roste s teplotou a dá se řídit dopováním stopami jiných prvků.' },
        { type: 'reaction', equation: 'SiO2 + 2C -> Si + 2CO', caption: 'výroba křemíku redukcí křemene koksem v elektrické peci' },
        { type: 'p', text: '**Oxid křemičitý** $SiO2$ (křemen, písek) taje asi při 1 700 °C, zatímco $CO2$ je plyn. Větší atom křemíku totiž netvoří s kyslíkem dvojné vazby, a tak místo malých molekul vzniká **obří kovalentní mřížka**.' },
        {
          type: 'compare',
          columns: [
            { title: 'oxid uhličitý $CO2$', icon: 'gas-cloud', tone: 'a', points: ['malé molekuly $O=C=O$', 'dvojné vazby', 'mezi molekulami jen slabé síly', 'za běžných podmínek plyn'] },
            { title: 'oxid křemičitý $SiO2$', icon: 'crystal', tone: 'b', points: ['obří kovalentní mřížka', 'jednoduché vazby: každý Si na 4 kyslíky, každý O na 2 křemíky', 'při tání se musí trhat kovalentní vazby', 'pevný, taje asi při 1 700 °C'] },
          ],
        },
        { type: 'structure', art: '    O\n    |\nO — Si — O\n    |\n    O', caption: 'tetraedr $SiO4$: základní stavební jednotka křemene i silikátů' },
        { type: 'p', text: '$SiO2$ je kyselý oxid. S vodou nereaguje, ale taví se s hydroxidy a uhličitany na **křemičitany** (silikáty). Roztoku křemičitanu sodného se říká **vodní sklo**.' },
        { type: 'reaction', equation: 'SiO2 + 2NaOH -> Na2SiO3 + H2O', caption: 'vodní sklo' },
        {
          type: 'iconlist',
          items: [
            { icon: 'phone', title: 'Čipy', text: 'polovodičový křemík je v každém mobilu a počítači' },
            { icon: 'sun', title: 'Solární panely', text: 'křemíkové články mění světlo na elektřinu' },
            { icon: 'mountain', title: 'Horniny', text: 'z křemičitanů je většina hornin: živce, slídy a jíly' },
            { icon: 'droplets', title: 'Silikagel', text: 'pórovitý $SiO2$ v sáčcích u nových bot pohlcuje vlhkost' },
          ],
        },
        { type: 'callout', variant: 'warning', text: 'Azbest je vláknitý křemičitan, který se dříve používal v izolacích a střešních deskách. Jeho vdechnutá vlákna způsobují rakovinu plic, proto se při bourání starých staveb odstraňuje jen v ochranných oblecích.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Oxid křemičitý má vysokou teplotu tání, protože tvoří obří kovalentní mřížku, zatímco $CO2$ tvoří malé molekuly.',
            answer: true,
            explain: 'V $SiO2$ je každý atom propojený kovalentními vazbami s celou sítí, při tání se musí vazby trhat. Molekuly $CO2$ drží pohromadě jen slabé síly.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: sklo, keramika a cement',
      icon: 'glass',
      blocks: [
        {
          type: 'iconlist',
          items: [
            { icon: 'glass', title: 'Sodnovápenaté sklo', text: 'písek $SiO2$ + soda $Na2CO3$ + vápenec $CaCO3$, tavení asi při 1 500 °C a rychlé ochlazení: okna, lahve, sklenice' },
            { icon: 'flask', title: 'Borosilikátové sklo', text: 'písek + oxid boritý: varné sklo, laboratorní nádobí' },
            { icon: 'diamond', title: 'Olovnatý křišťál', text: 'písek + oxid olovnatý: broušené sklo, lustry' },
            { icon: 'coffee', title: 'Keramika a porcelán', text: 'jíl, kaolín, živec, křemen; vypalování při 900–1 400 °C: cihly, dlaždice, hrnky' },
            { icon: 'factory', title: 'Cement', text: 'vápenec + jíl, pálení na slínek při 1 450 °C a mletí se sádrovcem: beton, malty' },
          ],
        },
        { type: 'reaction', equation: 'Na2CO3 + SiO2 -> Na2SiO3 + CO2', caption: 'jedna z reakcí ve sklářské peci' },
        { type: 'p', text: '**Sklo** není krystalická látka: je to **amorfní** pevná látka, jakási „ztuhlá kapalina“. Barví se oxidy kovů: kobalt dává modrou, chrom a železo zelenou, zlato rubínově červenou.' },
        {
          type: 'compare',
          caption: 'Výroba cementu způsobuje asi 8 % světových emisí $CO2$.',
          columns: [
            { title: 'vápenná malta', icon: 'wind', tone: 'a', points: ['hašené vápno + písek + voda', 'tuhne reakcí s $CO2$ ze vzduchu', 'potřebuje vzduch'] },
            { title: 'beton', icon: 'factory', tone: 'b', points: ['cement + písek + štěrk + voda', 'tvrdne **hydratací**: minerály slínku se slučují s vodou', 'tvrdne i pod vodou'] },
          ],
        },
        { type: 'callout', variant: 'fact', title: 'České sklo', text: 'Česká sklárna v Sázavě vyrábí varné sklo Simax, kterému nevadí prudké změny teploty. Olovnatý křišťál a broušené sklo z Čech jsou známé po celém světě už od 17. století.' },
        { type: 'game', gameId: 'quickfire', text: 'Diamant, grafit, pálené vápno, vodní sklo: rychlokvíz o uhlíku a křemíku!' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Které tři suroviny se taví na obyčejné okenní sklo?',
            options: [
              'písek, soda a vápenec',
              'jíl, kaolín a živec',
              'vápenec, jíl a sádrovec',
              'grafit, písek a sůl',
            ],
            answer: 0,
            explain: 'Sodnovápenaté sklo vzniká tavením $SiO2$, $Na2CO3$ a $CaCO3$. Jíl a kaolín jsou suroviny keramiky, vápenec s jílem a sádrovcem cementu.',
          },
        },
      ],
    },
  ],
  summary: [
    'Uhlík tvoří alotropy diamant (prostorová síť, tvrdý, nevodivý), grafit (vrstvy, měkký, vodivý), grafen, fullereny a nanotrubice.',
    'Nedokonalým spalováním vzniká jedovatý $CO$, který se váže na hemoglobin; $CO2$ je skleníkový plyn a zakalí vápennou vodu.',
    'Vápencový cyklus: $CaCO3 -> CaO -> Ca(OH)2 -> CaCO3$, tedy pálení, hašení a tuhnutí malty.',
    'Krasové jeskyně a krápníky vznikají díky rovnováze $CaCO3 + H2O + CO2 <=> Ca(HCO3)2$.',
    'Křemík je polovodič; $SiO2$ tvoří obří kovalentní mřížku, proto je pevný s vysokou teplotou tání.',
    'Ze silikátových surovin vzniká sklo, keramika a cement.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Proč grafit vede elektrický proud, ale diamant ne?',
      options: [
        'V grafitu má každý atom C jen 3 vazby a čtvrtý elektron se může pohybovat podél vrstev.',
        'Grafit obsahuje příměs kovů.',
        'Diamant je tvořen molekulami $C60$.',
        'V diamantu jsou mezi atomy iontové vazby.',
      ],
      answer: 0,
      explain: 'Pohyblivé (delokalizované) elektrony ve vrstvách grafitu přenášejí náboj. V diamantu jsou všechny valenční elektrony pevně ve čtyřech kovalentních vazbách.',
    },
    {
      kind: 'tf',
      q: 'Oxid uhelnatý poznáš podle štiplavého zápachu.',
      answer: false,
      explain: '$CO$ je bez barvy i zápachu, a proto je tak nebezpečný. Pomůže jen detektor.',
    },
    {
      kind: 'match',
      q: 'Přiřaď vzorec k triviálnímu názvu.',
      pairs: [
        ['$CaCO3$', 'vápenec'],
        ['$CaO$', 'pálené vápno'],
        ['$Ca(OH)2$', 'hašené vápno'],
        ['$NaHCO3$', 'jedlá soda'],
      ],
      explain: 'Pálením vápence vzniká pálené vápno $CaO$, hašením hašené vápno $Ca(OH)2$. Hydrogenuhličitan sodný je jedlá soda.',
    },
    {
      kind: 'multi',
      q: 'Které látky jsou alotropickými modifikacemi uhlíku?',
      options: ['diamant', 'fulleren $C60$', 'grafen', 'křemen', 'vápenec'],
      answers: [0, 1, 2],
      explain: 'Alotropy jsou různé formy téhož prvku. Křemen je $SiO2$ a vápenec $CaCO3$, to jsou sloučeniny.',
    },
    {
      kind: 'number',
      q: 'Kolik kilogramů $CO2$ se uvolní úplným rozkladem 250 kg vápence $CaCO3$? $M(CaCO3) = 100 g/mol$, $M(CO2) = 44 g/mol$.',
      answer: 110,
      tolerance: 1,
      unit: 'kg',
      explain: 'Poměr hmotností je 44 : 100, takže $m(CO2) = 250 kg · 0,44 = 110 kg$.',
    },
    {
      kind: 'text',
      q: 'Napiš vzorec oxidu křemičitého.',
      accept: ['SiO2'],
      caseSensitive: true,
      placeholder: 'vzorec',
      explain: 'Křemík má oxidační číslo $+IV$ (-ičitý), kyslík $−II$, takže $SiO2$.',
    },
    {
      kind: 'tf',
      q: 'Krápníky rostou, když z roztoku hydrogenuhličitanu vápenatého uniká $CO2$.',
      answer: true,
      explain: 'Únikem $CO2$ se rovnováha $CaCO3 + H2O + CO2 <=> Ca(HCO3)2$ posune doleva a vylučuje se nerozpustný $CaCO3$.',
    },
    {
      kind: 'choice',
      q: 'Čím se liší tvrdnutí betonu od tuhnutí vápenné malty?',
      options: [
        'Beton tvrdne hydratací cementu (reakcí s vodou), vápenná malta reakcí s $CO2$ ze vzduchu.',
        'Beton tvrdne reakcí s $CO2$, malta vysycháním.',
        'Obojí tvrdne jen odpařením vody.',
        'Beton tvrdne reakcí s kyslíkem ze vzduchu.',
      ],
      answer: 0,
      explain: 'Proto beton ztvrdne i pod vodou, kdežto vápenná malta potřebuje vzduch s $CO2$.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l7-5 Alkalické kovy a kovy alkalických zemin                        */
/* ------------------------------------------------------------------ */

const l75: Lesson = {
  id: 'l7-5',
  title: 'Alkalické kovy a kovy alkalických zemin',
  goals: [
    'Popsat a vysvětlit trendy reaktivity v 1. a 2. skupině',
    'Zapsat reakce alkalických kovů a kovů alkalických zemin s vodou a kyslíkem',
    'Určit kov podle barvy plamene',
    'Uvést použití důležitých sloučenin sodíku, draslíku, vápníku a hořčíku a popsat změkčování vody',
  ],
  hook: 'Kov, který krájíš nožem jako máslo, plave na vodě a přitom na ní vzplane fialovým plamenem? To je draslík. A ohňostroj na Silvestra? To je chemie s-prvků rozsypaná po obloze.',
  sections: [
    {
      title: 'Alkalické kovy: měkké, lehké a bouřlivé',
      icon: 'explosion',
      blocks: [
        { type: 'elements', symbols: ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'], caption: '1. skupina: alkalické kovy' },
        { type: 'p', text: '**Alkalické kovy** mají jediný valenční elektron $ns^1$, který snadno odevzdají: stanou se kationty $M^+$ s konfigurací vzácného plynu. Mají nejnižší ionizační energie i elektronegativity a velmi záporné standardní potenciály, jsou to proto velmi silná **redukční činidla**.' },
        { type: 'diagram', id: 'bohr', props: { z: 11 }, caption: 'Sodík: jediný elektron ve třetí vrstvě se snadno odtrhne' },
        {
          type: 'table',
          headers: ['kov', 'teplota tání', 'hustota (g/cm³)', 'reakce s vodou'],
          rows: [
            ['lithium', '181 °C', '0,53', 'klidně šumí'],
            ['sodík', '98 °C', '0,97', 'roztaví se v kuličku a sviští po hladině'],
            ['draslík', '63 °C', '0,86', 'vodík vzplane fialovým plamenem'],
            ['rubidium', '39 °C', '1,53', 'prudce, s výbuchem'],
            ['cesium', '28 °C', '1,93', 'výbušně, taje i v dlani'],
          ],
          caption: 'Směrem dolů klesá teplota tání a roste reaktivita',
        },
        { type: 'p', text: 'Proč reaktivita dolů roste? Každý další kov má o jednu elektronovou vrstvu víc. ==Valenční elektron je dál od jádra a vnitřní vrstvy ho **stíní**, takže ho jádro drží slaběji a odtrhne se snáz.==' },
        { type: 'reaction', equation: '2Na + 2H2O -> 2NaOH + H2', caption: 'vzniká hydroxid a vodík; proto „alkalické“ kovy' },
        { type: 'reaction', equation: '4Na + O2 -> 2Na2O', caption: 'na vzduchu se čerstvý řez během vteřin zakalí' },
        {
          type: 'compare',
          caption: 'Hoření na vzduchu: každý kov dá jiný typ sloučeniny s kyslíkem',
          columns: [
            { title: 'lithium', icon: 'flame', tone: 'a', points: ['oxid $Li2O$', 'nejlehčí kov vůbec'] },
            { title: 'sodík', icon: 'flame', tone: 'b', points: ['peroxid $Na2O2$', 'krájí se nožem'] },
            { title: 'draslík', icon: 'flame', tone: 'c', points: ['hyperoxid $KO2$', 'měkký jako máslo'] },
          ],
        },
        { type: 'callout', variant: 'warning', title: 'Pod olejem, ne pod vodou', text: 'Alkalické kovy se uchovávají pod **parafinovým olejem**, aby se nedostaly ke vzduchu a vlhkosti; lithium plave i na oleji, proto se často skladuje v argonu. Pokusy s nimi dělá jen učitel, s kouskem velkým jako hrášek, za ochranným štítem. Hořící sodík se nikdy nehasí vodou.' },
        { type: 'callout', variant: 'fact', title: 'Lithium je výjimka', text: 'Lithium má nejzápornější standardní potenciál ze všech kovů ($−3,04 V$), a přesto reaguje s vodou nejpomaleji z celé skupiny. Termodynamika říká, kolik energie se uvolní, ale ne, jak rychle: lithium neroztaje a jeho reakce má vyšší aktivační energii.' },
        { type: 'game', gameId: 'periodic-find', text: 'Najdi v tabulce všechny alkalické kovy a kovy alkalických zemin na čas.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč reaguje draslík s vodou prudčeji než sodík?',
            options: [
              'Jeho valenční elektron je dál od jádra, a proto se snáz odtrhne.',
              'Draslík má víc valenčních elektronů.',
              'Draslík má větší hustotu, a proto klesne ke dnu.',
              'Draslík má vyšší elektronegativitu.',
            ],
            answer: 0,
            explain: 'Oba mají jeden valenční elektron, ale u draslíku je ve čtvrté vrstvě, dál od jádra a víc stíněný. Ionizační energie je nižší.',
          },
        },
      ],
    },
    {
      title: 'Kovy alkalických zemin',
      icon: 'bone',
      blocks: [
        { type: 'elements', symbols: ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'], caption: '2. skupina: beryllium a kovy alkalických zemin' },
        { type: 'p', text: 'Prvky 2. skupiny mají dva valenční elektrony $ns^2$ a tvoří kationty $M^2+$. Musejí odevzdat dva elektrony a jejich atomy jsou menší než atomy sousedů z 1. skupiny, proto jsou **méně reaktivní**. Reaktivita i tady roste směrem dolů.' },
        {
          type: 'compare',
          columns: [
            { title: '1. skupina: alkalické kovy', icon: 'explosion', tone: 'a', points: ['1 valenční elektron $ns^1$', 'kationty $M^+$', 'měkké, nízké teploty tání', 's vodou prudce'] },
            { title: '2. skupina: alkalické zeminy', icon: 'bone', tone: 'b', points: ['2 valenční elektrony $ns^2$', 'kationty $M^2+$', 'tvrdší, vyšší teploty tání', 's vodou mírněji, hořčík až s párou'] },
          ],
        },
        { type: 'reaction', equation: 'Ca + 2H2O -> Ca(OH)2 + H2', caption: 'vápník reaguje se studenou vodou mírně' },
        { type: 'reaction', equation: 'Mg + H2O(g) -> MgO + H2', caption: 'hořčík reaguje ochotně až s vodní párou' },
        { type: 'reaction', equation: '2Mg + O2 -> 2MgO', caption: 'hořčík hoří oslnivě bílým plamenem' },
        { type: 'p', text: 'Oxidy těchto kovů jsou **zásadité** a s vodou tvoří hydroxidy. U sloučenin 2. skupiny platí dva protichůdné trendy, které se hodí znát:' },
        {
          type: 'table',
          headers: ['kov', 'rozpustnost hydroxidu', 'rozpustnost síranu'],
          rows: [
            ['Mg', '$Mg(OH)2$ skoro nerozpustný (antacida)', '$MgSO4$ dobře rozpustný (hořká sůl)'],
            ['Ca', '$Ca(OH)2$ málo rozpustný (vápenná voda)', '$CaSO4$ málo rozpustný (sádra)'],
            ['Sr', 'rozpustnější', 'málo rozpustný'],
            ['Ba', '$Ba(OH)2$ dobře rozpustný', '$BaSO4$ nerozpustný (kontrastní látka)'],
          ],
          caption: 'Směrem dolů rozpustnost hydroxidů roste, rozpustnost síranů klesá',
        },
        { type: 'callout', variant: 'warning', title: 'Hořčík nehas vodou!', text: 'Hořící hořčík je tak horký, že rozkládá vodu i $CO2$: $2Mg + CO2 -> 2MgO + C$. Hasí se suchým pískem. A do jeho plamene se nedívej, intenzivní světlo škodí očím.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Vápník reaguje s vodou prudčeji než draslík.',
            answer: false,
            explain: 'Vápník musí odevzdat dva elektrony a jeho atom je menší, proto je méně reaktivní než draslík ze stejné periody.',
          },
        },
      ],
    },
    {
      title: 'Plamenové zkoušky: barvy ohňostroje',
      icon: 'fireworks',
      blocks: [
        { type: 'p', text: 'Teplo plamene **vybudí** elektrony do vyšších energetických hladin. Při návratu zpět vyzáří přebytečnou energii jako světlo určitých vlnových délek. Každý prvek má svou sadu hladin, a tím i svou barvu: říkáme tomu **barvení plamene**.' },
        { type: 'diagram', id: 'flame-tests', caption: 'Každý kov barví plamen svou typickou barvou' },
        {
          type: 'process',
          layout: 'flow',
          caption: 'Jak na plamenovou zkoušku',
          steps: [
            { icon: 'burner', title: 'Očisti drátek', text: 'platinový drátek (nebo magnesiovou tyčinku) očisti v kyselině chlorovodíkové a vyžíhej v plameni, dokud ho nebarví' },
            { icon: 'test-tube', title: 'Naber vzorek', text: 'namoč drátek do roztoku nebo naber trochu vzorku' },
            { icon: 'flame', title: 'Do plamene', text: 'vlož ho do okraje nesvítivého (modrého) plamene kahanu a sleduj barvu' },
          ],
        },
        { type: 'elements', symbols: ['Li', 'Na', 'K', 'Ca', 'Sr', 'Ba', 'Cu'], caption: 'kovy, které barví plamen' },
        {
          type: 'table',
          headers: ['prvek', 'barva plamene', 'kde ji uvidíš'],
          rows: [
            ['lithium', 'karmínová', 'červené světlice'],
            ['sodík', 'žlutá', 'staré pouliční sodíkové výbojky, přeteklá polévka na plynovém sporáku'],
            ['draslík', 'fialová', 'hoření draslíku na vodě'],
            ['vápník', 'cihlově červená', 'oranžové ohňostroje'],
            ['stroncium', 'červená', 'červené ohňostroje a nouzové světlice'],
            ['baryum', 'zelená', 'zelené ohňostroje'],
            ['měď', 'modrozelená', 'modrozelené ohňostroje, spálený měděný drát'],
          ],
          caption: 'Barvy plamene: Li karmínová, Na žlutá, K fialová, Ca cihlově červená, Sr červená, Ba zelená, Cu modrozelená',
        },
        { type: 'callout', variant: 'tip', title: 'Sodík všechno přebije', text: 'Stopa sodíku, třeba z potu na prstech, zbarví plamen žlutě a přehluší slabou fialovou draslíku. Proto se na draslík díváme přes **kobaltové sklo**, které žluté světlo pohltí.' },
        { type: 'callout', variant: 'fact', text: 'Robert Bunsen a Gustav Kirchhoff zkoumali světlo plamenů spektroskopem a v letech 1860–1861 objevili dva nové prvky: cesium (podle latinského *caesius*, blankytný, kvůli modrým čarám) a rubidium (*rubidus*, tmavě červený).' },
        { type: 'callout', variant: 'warning', text: 'Při plamenových zkouškách nos ochranné brýle a svaž si dlouhé vlasy. Rozpustné sloučeniny barya jsou jedovaté, po práci si umyj ruce.' },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď kov k barvě jeho plamene.',
            pairs: [
              ['lithium', 'karmínová'],
              ['sodík', 'žlutá'],
              ['draslík', 'fialová'],
              ['baryum', 'zelená'],
            ],
            explain: 'Každý prvek vyzařuje světlo typických vlnových délek. Tyto barvy se hodí znát zpaměti.',
          },
        },
      ],
    },
    {
      title: 'Důležité sloučeniny s-prvků',
      icon: 'salt',
      blocks: [
        {
          type: 'iconlist',
          items: [
            { icon: 'salt', title: '$NaCl$: kuchyňská sůl', text: 'chlorid sodný; potraviny, výroba chloru a $NaOH$, posyp silnic' },
            { icon: 'soap', title: '$NaOH$: louh sodný', text: 'hydroxid sodný; výroba mýdla a papíru, čistič odpadů' },
            { icon: 'glass', title: '$Na2CO3$: soda', text: 'uhličitan sodný; výroba skla, prací prostředky, změkčování vody' },
            { icon: 'bread', title: '$NaHCO3$: jedlá soda', text: 'hydrogenuhličitan sodný; kypřicí prášek, léky na pálení žáhy' },
            { icon: 'fertilizer', title: '$KNO3$: draselný ledek', text: 'dusičnan draselný; hnojivo, střelný prach' },
            { icon: 'mountain', title: '$CaCO3$: vápenec, mramor, křída', text: 'uhličitan vápenatý; stavebnictví, výroba vápna' },
            { icon: 'bone', title: '$CaSO4·2H2O$: sádrovec', text: 'dihydrát síranu vápenatého; výroba sádry, sádrokarton' },
            { icon: 'pill', title: '$MgSO4·7H2O$: hořká sůl', text: 'heptahydrát síranu hořečnatého; koupelové soli, projímadlo, hnojivo' },
          ],
        },
        { type: 'p', text: '**Sádra** vzniká zahřátím sádrovce, který přitom ztratí většinu krystalové vody. Po smíchání s vodou ji zase přijme a ztuhne, a tak se z ní odlévají sošky i fixují zlomené ruce.' },
        { type: 'formula', text: '$(CaSO4)2·H2O + 3H2O -> 2CaSO4·2H2O$', caption: 'tuhnutí sádry' },
        { type: 'p', text: '**Jedlá soda** neutralizuje nadbytek žaludeční kyseliny, proto pomáhá při pálení žáhy.' },
        { type: 'reaction', equation: 'NaHCO3 + HCl -> NaCl + H2O + CO2', caption: 'jedlá soda proti pálení žáhy' },
        { type: 'callout', variant: 'fact', title: 'Střelný prach', text: 'Je to směs draselného ledku, síry a dřevěného uhlí. Ledek dodává kyslík, takže prach hoří i bez přístupu vzduchu.' },
        { type: 'callout', variant: 'warning', text: 'Hydroxid sodný je silně žíravý. Kapka v oku může způsobit slepotu, proto při práci s ním (i s čističi odpadů) nos brýle a rukavice. Při rozpouštění se roztok silně zahřívá.' },
        {
          type: 'check',
          question: {
            kind: 'text',
            q: 'Jaký je triviální název uhličitanu sodného $Na2CO3$?',
            accept: ['soda', 'prací soda', 'praci soda', 'krystalová soda', 'krystalova soda'],
            placeholder: 'název',
            explain: 'Uhličitan sodný je soda. Nepleť si ji s jedlou sodou, což je hydrogenuhličitan sodný $NaHCO3$.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: tvrdá voda a hořčík v těle',
      icon: 'water-tap',
      blocks: [
        { type: 'p', text: '**Tvrdá voda** obsahuje hodně iontů $Ca^2+$ a $Mg^2+$: na konvici se z ní usazuje vodní kámen, mýdlo v ní špatně pění a tvoří šedé sraženiny. **Přechodnou tvrdost** (z hydrogenuhličitanů) odstraní var, **trvalou** (ze síranů a chloridů) ne.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'heat', title: 'Převaření', text: '$Ca(HCO3)2 -> CaCO3 + H2O + CO2$; odstraní jen přechodnou tvrdost' },
            { icon: 'powder', title: 'Přidání sody', text: '$Ca^2+ + CO3^2- -> CaCO3$; odstraní přechodnou i trvalou' },
            { icon: 'arrow-cycle', title: 'Iontoměnič', text: 'vymění $Ca^2+$ a $Mg^2+$ za $Na^+$; přechodnou i trvalou' },
            { icon: 'steam', title: 'Destilace, reverzní osmóza', text: 'oddělí vodu od všech solí; přechodnou i trvalou' },
          ],
        },
        { type: 'reaction', equation: 'Ca^2+ + CO3^2- -> CaCO3', caption: 'soda vysráží vápník jako nerozpustný uhličitan' },
        { type: 'formula', text: '$2R−Na + Ca^2+ -> R2Ca + 2Na^+$', caption: 'iontoměnič; $R$ označuje pryskyřici' },
        { type: 'p', text: 'Iontoměnič je i v tvé myčce. Když se zaplní vápníkem, **regeneruje** se koncentrovaným roztokem $NaCl$, který rovnováhu obrátí. Proto se do myčky sype speciální sůl.' },
        { type: 'callout', variant: 'tip', title: 'Odvápnění konvice', text: 'Vodní kámen je hlavně $CaCO3$, a ten rozpustí každá kyselina. Stačí ocet nebo kyselina citronová: $CaCO3 + 2H3O^+ -> Ca^2+ + CO2 + 3H2O$.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'leaf', title: 'Chlorofyl', text: 'hořčík je středem molekuly chlorofylu, bez něj by rostliny nefotosyntetizovaly' },
            { icon: 'muscle', title: 'Hořčík v těle', text: 'asi 25 g; potřebují ho stovky enzymů i svaly, jeho nedostatek způsobuje křeče (ořechy, luštěniny, hořká čokoláda)' },
            { icon: 'bone', title: 'Vápník', text: 'spolu s fosforečnany tvoří kosti a zuby' },
            { icon: 'car', title: 'Lehké slitiny', text: 'hořčík je nejlehčí konstrukční kov (1,74 g/cm³); slitiny s hliníkem jsou v ráfcích kol, rámech notebooků a dílech letadel' },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč se do myčky nádobí přidává speciální sůl?',
            options: [
              'Regeneruje iontoměnič, který změkčuje vodu.',
              'Zvyšuje teplotu varu vody.',
              'Rozpouští mastnotu z nádobí.',
              'Chrání sklo před poškrábáním.',
            ],
            answer: 0,
            explain: 'Iontoměnič zachytává $Ca^2+$ a $Mg^2+$ a uvolňuje $Na^+$. Nadbytek $NaCl$ ho vrátí do původní sodné formy.',
          },
        },
      ],
    },
  ],
  summary: [
    'Alkalické kovy mají jeden valenční elektron, jsou měkké, lehké a silně redukční; reaktivita roste od lithia k ceziu.',
    'S vodou tvoří hydroxid a vodík, proto se uchovávají pod parafinovým olejem.',
    'Kovy alkalických zemin tvoří ionty $M^2+$ a jsou méně reaktivní než kovy 1. skupiny; rozpustnost jejich hydroxidů dolů roste, síranů klesá.',
    'Barvy plamene: Li karmínová, Na žlutá, K fialová, Ca cihlově červená, Sr červená, Ba zelená, Cu modrozelená.',
    'Důležité sloučeniny: $NaCl$, $NaOH$, soda, jedlá soda, draselný ledek, vápenec, sádrovec a hořká sůl.',
    'Tvrdost vody způsobují ionty $Ca^2+$ a $Mg^2+$; trvalou tvrdost odstraní soda, iontoměnič nebo destilace.',
  ],
  quiz: [
    {
      kind: 'order',
      q: 'Seřaď alkalické kovy od nejméně po nejvíce reaktivní s vodou.',
      items: ['lithium', 'sodík', 'draslík', 'rubidium', 'cesium'],
      explain: 'Reaktivita roste směrem dolů ve skupině, protože valenční elektron je dál od jádra.',
    },
    {
      kind: 'match',
      q: 'Přiřaď kov k barvě plamene.',
      pairs: [
        ['vápník', 'cihlově červená'],
        ['stroncium', 'červená'],
        ['měď', 'modrozelená'],
        ['draslík', 'fialová'],
      ],
      explain: 'Vápník barví plamen cihlově, stroncium sytě červeně, měď modrozeleně a draslík fialově.',
    },
    {
      kind: 'tf',
      q: 'Sodík se uchovává pod vodou, aby se nedostal ke vzduchu.',
      answer: false,
      explain: 'S vodou by sodík prudce reagoval. Uchovává se pod parafinovým olejem.',
    },
    {
      kind: 'choice',
      q: 'Jaké produkty vzniknou reakcí vápníku s vodou?',
      options: ['$Ca(OH)2$ a $H2$', '$CaO$ a $H2O2$', '$CaH2$ a $O2$', '$CaCO3$ a $H2$'],
      answer: 0,
      explain: '$Ca + 2H2O -> Ca(OH)2 + H2$. Stejně jako alkalické kovy dává vápník hydroxid a vodík, jen pomaleji.',
    },
    {
      kind: 'multi',
      q: 'Které postupy odstraní i trvalou tvrdost vody?',
      options: ['iontoměnič', 'přidání sody $Na2CO3$', 'destilace', 'převaření', 'přefiltrování přes papír'],
      answers: [0, 1, 2],
      explain: 'Var rozloží jen hydrogenuhličitany. Sírany a chloridy odstraní soda (vysráží $CaCO3$), iontoměnič nebo destilace. Filtr rozpuštěné ionty nezachytí.',
    },
    {
      kind: 'number',
      q: 'Kolik dm³ vodíku (za normálních podmínek, $V_{m} = 22,4 dm^{3}/mol$) vznikne reakcí 4,6 g sodíku s vodou? $M(Na) = 23 g/mol$.',
      answer: 2.24,
      tolerance: 0.05,
      unit: 'dm³',
      explain: '$n(Na) = 4,6 / 23 = 0,2 mol$. Z rovnice $2Na + 2H2O -> 2NaOH + H2$ plyne $n(H2) = 0,1 mol$, $V = 2,24 dm^{3}$.',
    },
    {
      kind: 'text',
      q: 'Jaký triviální název má hydrogenuhličitan sodný $NaHCO3$?',
      accept: ['jedlá soda', 'jedla soda', 'soda bikarbona', 'bikarbona'],
      placeholder: 'název',
      explain: 'Hydrogenuhličitan sodný je jedlá soda, součást kypřicích prášků a léků proti pálení žáhy.',
    },
    {
      kind: 'tf',
      q: 'Ve 2. skupině rozpustnost hydroxidů směrem dolů roste, kdežto rozpustnost síranů klesá.',
      answer: true,
      explain: '$Mg(OH)2$ je skoro nerozpustný a $Ba(OH)2$ dobře rozpustný; u síranů je to naopak, od rozpustného $MgSO4$ po nerozpustný $BaSO4$.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* l7-6 Hliník, železo, měď a přechodné kovy                           */
/* ------------------------------------------------------------------ */

const l76: Lesson = {
  id: 'l7-6',
  title: 'Hliník, železo, měď a přechodné kovy',
  goals: [
    'Vysvětlit pasivaci a amfoterní chování hliníku a popsat jeho výrobu elektrolýzou',
    'Zapsat rovnice dějů ve vysoké peci a vysvětlit rezavění železa a ochranu proti korozi',
    'Popsat vlastnosti a použití mědi, zinku, chromu, stříbra, zlata a platiny',
    'Vyjmenovat typické vlastnosti přechodných kovů a popsat stavbu komplexu $[Cu(NH3)4]^{2+}$',
  ],
  hook: 'Hliník je nejrozšířenější kov zemské kůry, a přesto byl v 19. století dražší než zlato. Císař Napoleon III. prý nejvzácnějším hostům servíroval na hliníkových talířích. Co se od té doby změnilo?',
  sections: [
    {
      title: 'Hliník: lehký kov, který se chrání sám',
      icon: 'coin',
      blocks: [
        { type: 'elements', symbols: ['Al'], caption: 'hliník, $Z = 13$, 13. skupina' },
        { type: 'p', text: '**Hliník** je lehký (2,70 g/cm³), dobře vede elektřinu i teplo a dá se válcovat na tenkou fólii. V zemské kůře je ho asi 8 %, víc než kteréhokoli jiného kovu. Ve sloučeninách má oxidační číslo $+III$.' },
        { type: 'diagram', id: 'bohr', props: { z: 13 }, caption: 'Hliník: tři valenční elektrony' },
        { type: 'p', text: 'Podle řady napětí ($E° = −1,66 V$) by měl hliník ochotně reagovat i s vodou. Na vzduchu se ale okamžitě pokryje tenkou, kompaktní vrstvičkou **oxidu hlinitého**, která kov chrání před další oxidací. Tomuto jevu říkáme **pasivace**.' },
        { type: 'reaction', equation: '4Al + 3O2 -> 2Al2O3', caption: 'ochranná vrstva silná jen několik nanometrů' },
        {
          type: 'compare',
          caption: 'Hliník je **amfoterní**: rozpouští se v kyselinách i v roztocích hydroxidů a pokaždé uvolní vodík.',
          columns: [
            { title: 's kyselinou', icon: 'lemon', tone: 'a', points: ['$2Al + 6HCl -> 2AlCl3 + 3H2$', 'vzniká chlorid hlinitý'] },
            { title: 's hydroxidem', icon: 'soap', tone: 'b', points: ['$2Al + 2NaOH + 6H2O -> 2Na[Al(OH)4] + 3H2$', 'vzniká tetrahydroxidohlinitan sodný'] },
          ],
        },
        { type: 'callout', variant: 'fact', title: 'Hliník proti železu', text: 'Směs práškového hliníku a oxidu železitého po zapálení prudce reaguje a vzniká roztavené železo o teplotě přes 2 000 °C. Této **aluminotermii** se svařují kolejnice.' },
        { type: 'reaction', equation: 'Fe2O3 + 2Al -> Al2O3 + 2Fe', caption: 'aluminotermie' },
        { type: 'callout', variant: 'warning', text: 'Granulované čističe odpadů obsahují $NaOH$ a kousky hliníku. Reakcí vzniká vodík a hodně tepla, obsah může vystříknout. Nikdy se nad odpad nenakláněj a nemíchej čistič s jinými přípravky.' },
        {
          type: 'check',
          question: {
            kind: 'tf',
            q: 'Hliník nekoroduje, protože je v řadě napětí ušlechtilejší než železo.',
            answer: false,
            explain: 'Hliník je naopak méně ušlechtilý ($−1,66 V$). Chrání ho kompaktní vrstvička $Al2O3$, tedy pasivace.',
          },
        },
      ],
    },
    {
      title: 'Výroba a recyklace hliníku',
      icon: 'lightning',
      blocks: [
        { type: 'p', text: 'Hlavní rudou je **bauxit**, směs hydratovaných oxidů hliníku se železem, z níž se nejdřív vyčistí čistý $Al2O3$. Ten taje až při 2 050 °C, proto se rozpouští v roztaveném **kryolitu** $Na3AlF6$ a taveninou při asi 950 °C prochází proud. Tomuto postupu se říká **Hallův–Héroultův proces** (1886).' },
        { type: 'diagram', id: 'aluminium-electrolysis', caption: 'Elektrolýza taveniny $Al2O3$ v kryolitu: hliník se vylučuje na katodě, kyslík spaluje grafitovou anodu' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'mountain', title: 'Těžba bauxitu' },
            { icon: 'funnel', title: 'Čištění', text: 'z bauxitu čistý oxid hlinitý' },
            { icon: 'heat', title: 'Rozpuštění v kryolitu', text: '$Al2O3$ v roztaveném $Na3AlF6$, asi 950 °C' },
            { icon: 'lightning', title: 'Elektrolýza', text: 'na katodě se vylučuje hliník' },
            { icon: 'factory', title: 'Odlévání', text: 'tekutý hliník do ingotů' },
          ],
        },
        { type: 'formula', text: '$Al^3+ + 3e^- -> Al$', caption: 'katoda (redukce)' },
        { type: 'formula', text: '$2O^2- -> O2 + 4e^-$', caption: 'grafitová anoda (oxidace); kyslík anodu postupně spaluje na $CO2$' },
        { type: 'reaction', equation: '2Al2O3 -> 4Al + 3O2', caption: 'celková reakce' },
        { type: 'p', text: 'Elektrolýza spotřebuje asi 14 kWh na kilogram hliníku, zhruba tolik, kolik domácnost za dva dny. Proto se hliníkárny stavějí u levné elektřiny, třeba u vodních elektráren na Islandu nebo v Norsku. Dřív se hliník vyráběl chemicky pomocí sodíku, a byl proto vzácný a drahý.' },
        { type: 'callout', variant: 'remember', text: '==Recyklace hliníku spotřebuje jen asi 5 % energie potřebné na výrobu nového kovu.== Plechovka se dá přetavit znovu a znovu, bez ztráty kvality.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Proč se oxid hlinitý při elektrolýze rozpouští v kryolitu?',
            options: [
              'Tavenina má mnohem nižší teplotu tání než čistý $Al2O3$, což šetří energii.',
              'Kryolit redukuje hliník bez proudu.',
              'Kryolit chrání hliník před vzduchem.',
              'Kryolit je zdrojem hliníku.',
            ],
            answer: 0,
            explain: 'Čistý $Al2O3$ taje při 2 050 °C, roztok v kryolitu už kolem 950 °C. Udržet taveninu tak stojí mnohem méně energie.',
          },
        },
      ],
    },
    {
      title: 'Železo: vysoká pec a ocel',
      icon: 'factory',
      blocks: [
        { type: 'elements', symbols: ['Fe'], caption: 'železo, $Z = 26$, d-prvek 8. skupiny' },
        { type: 'p', text: '**Železo** je druhý nejrozšířenější kov zemské kůry a nejpoužívanější kov vůbec. Získáváním kovů z rud se zabývá **metalurgie**.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'mountain', title: 'krevel (hematit)', text: '$Fe2O3$' },
            { icon: 'magnet', title: 'magnetit', text: '$Fe3O4$' },
            { icon: 'rust', title: 'hnědel', text: '$Fe2O3·xH2O$' },
            { icon: 'crystal', title: 'ocelek (siderit)', text: '$FeCO3$' },
          ],
        },
        { type: 'p', text: 'Do **vysoké pece** se shora sype **vsázka**: ruda, koks a vápenec. Zdola se vhání horký vzduch. Koks shoří, a jak plyny stoupají vzhůru, redukují rudu na železo.' },
        { type: 'diagram', id: 'blast-furnace', caption: 'Vysoká pec: vsázka shora, horký vzduch zdola, dole surové železo a struska' },
        {
          type: 'process',
          layout: 'flow',
          steps: [
            { icon: 'flame', title: 'Koks hoří', text: '$C + O2 -> CO2$ u dna pece, teplo až 2 000 °C' },
            { icon: 'gas-cloud', title: 'Vzniká $CO$', text: '$CO2 + C -> 2CO$ na rozžhaveném koksu' },
            { icon: 'heat', title: 'Redukce rudy', text: '$Fe2O3 + 3CO -> 2Fe + 3CO2$' },
            { icon: 'mountain', title: 'Struska', text: '$CaCO3 -> CaO + CO2$; $CaO + SiO2 -> CaSiO3$: vápenec váže hlušinu (písek)' },
          ],
        },
        { type: 'reaction', equation: 'Fe2O3 + 3CO -> 2Fe + 3CO2', caption: 'hlavní děj: $CO$ redukuje rudu ($Fe^{III} -> Fe^{0}$)' },
        { type: 'p', text: 'Na dně pece se hromadí tekuté **surové železo** a nad ním lehčí **struska**, která se využije na stavbu silnic nebo do cementu.' },
        {
          type: 'compare',
          columns: [
            { title: 'surové železo', icon: 'factory', tone: 'a', points: ['asi 4 % uhlíku', 'tvrdé a křehké', 'vzniká ve vysoké peci'] },
            { title: 'ocel', icon: 'star', tone: 'b', points: ['méně než asi 2 % uhlíku', 'v **kyslíkovém konvertoru** čistý kyslík spálí přebytečný uhlík na plynné oxidy', 's chromem (aspoň 10,5 %) a niklem vzniká **nerezová ocel**'] },
          ],
        },
        {
          type: 'example',
          problem: 'Kolik tun železa se teoreticky získá z 1 t čistého $Fe2O3$? $M(Fe2O3) = 160 g/mol$, $M(Fe) = 56 g/mol$.',
          steps: [
            'V 1 molu $Fe2O3$ jsou 2 moly $Fe$: $2 · 56 = 112 g$ železa ve 160 g oxidu.',
            '$w(Fe) = 112 / 160 = 0,70$',
            '$m(Fe) = 0,70 · 1 t$',
          ],
          answer: '0,70 t železa.',
        },
        { type: 'callout', variant: 'fact', text: 'U nás má výroba železa dlouhou tradici: vysoké pece dnes pracují v Třinci a dříve i v ostravských Vítkovicích.' },
        {
          type: 'check',
          question: {
            kind: 'choice',
            q: 'Jakou roli má oxid uhelnatý ve vysoké peci?',
            options: ['redukční činidlo, odebírá rudě kyslík', 'oxidační činidlo, oxiduje železo', 'tvoří strusku s pískem', 'katalyzátor hoření koksu'],
            answer: 0,
            explain: 'V reakci $Fe2O3 + 3CO -> 2Fe + 3CO2$ se železo redukuje z $+III$ na $0$ a uhlík se oxiduje z $+II$ na $+IV$.',
          },
        },
      ],
    },
    {
      title: 'Měď, zinek, chrom a drahé kovy',
      icon: 'ring',
      blocks: [
        { type: 'elements', symbols: ['Cu', 'Zn', 'Cr', 'Ag', 'Au', 'Pt'], caption: 'důležité přechodné kovy' },
        { type: 'p', text: '**Měď** je načervenalý měkký kov a po stříbře nejlepší vodič elektřiny, proto jsou z ní kabely a vinutí motorů. Je ušlechtilá ($E° = +0,34 V$), se zředěnou $HCl$ nereaguje a rozpustí ji jen oxidující kyseliny (koncentrovaná $HNO3$ nebo horká $H2SO4$).' },
        {
          type: 'iconlist',
          items: [
            { icon: 'battery', title: 'Zinek', text: 'neušlechtilý, na vzduchu se pasivuje; pozinkování železa, baterie, $ZnO$ v opalovacích krémech a mastech' },
            { icon: 'star', title: 'Chrom', text: 'tvrdý, lesklý, nekoroduje; chromování, nerezová ocel; sloučeniny $Cr^{VI}$ jsou karcinogenní' },
            { icon: 'ring', title: 'Stříbro', text: 'nejlepší vodič tepla a elektřiny; šperky, zrcadla, kontakty, antibakteriální úprava' },
            { icon: 'coin', title: 'Zlato', text: 'nereaguje s kyslíkem ani s běžnými kyselinami, rozpustí ho jen lučavka královská; šperky, konektory v elektronice' },
            { icon: 'catalyst', title: 'Platina', text: 'ušlechtilá, výborný katalyzátor; autokatalyzátory, elektrody, šperky, lék cisplatina' },
          ],
        },
        { type: 'p', text: 'Na vzduchu měď pomalu pokrývá zelená **měděnka** (patina), zásaditý uhličitan měďnatý; ve městech obsahuje i zásaditý síran. Zelené střechy pražských kostelů jsou původně měděné.' },
        { type: 'formula', text: '$2Cu + O2 + H2O + CO2 -> CuCO3·Cu(OH)2$', caption: 'vznik měděnky' },
        { type: 'p', text: 'Stříbro černá, protože reaguje se stopami sulfanu ve vzduchu (třeba z vajec). Ryzost zlata se udává v **karátech**: 24 karátů je čisté zlato, 14karátové obsahuje 58,5 % zlata.' },
        { type: 'reaction', equation: '4Ag + 2H2S + O2 -> 2Ag2S + 2H2O', caption: 'černání stříbra' },
        {
          type: 'compare',
          caption: 'Tři důležité slitiny',
          columns: [
            { title: 'mosaz', icon: 'coin', tone: 'a', points: ['měď + zinek', 'žlutá', 'kliky, dechové nástroje, šroubení'] },
            { title: 'bronz', icon: 'trophy', tone: 'b', points: ['měď + cín', 'zvony, sochy, medaile', 'dala jméno celé době bronzové'] },
            { title: 'dural', icon: 'speed', tone: 'c', points: ['hliník + měď + hořčík', 'lehký a pevný', 'letadla'] },
          ],
        },
        {
          type: 'check',
          question: {
            kind: 'match',
            q: 'Přiřaď kov k jeho typickému použití.',
            pairs: [
              ['měď', 'elektrické kabely'],
              ['zinek', 'pozinkování plechu'],
              ['chrom', 'lesklé ochranné pokovení'],
              ['platina', 'autokatalyzátor'],
            ],
            explain: 'Měď výborně vede proud, zinek chrání železo, chrom je tvrdý a lesklý a platina je skvělý katalyzátor.',
          },
        },
      ],
    },
    {
      title: 'Přechodné kovy a komplexní sloučeniny',
      icon: 'bond',
      blocks: [
        { type: 'p', text: '**Přechodné kovy** jsou prvky d-bloku. Postupně se jim zaplňují orbitaly d předposlední vrstvy, a to jim dává společné vlastnosti.' },
        { type: 'diagram', id: 'periodic-mini', props: { highlight: 'blocks' }, caption: 'Přechodné kovy tvoří d-blok uprostřed tabulky' },
        {
          type: 'iconlist',
          items: [
            { icon: 'electron', title: 'Proměnlivá oxidační čísla', text: 'železo $+II$ a $+III$, měď $+I$ a $+II$, mangan od $+II$ až po $+VII$' },
            { icon: 'bulb', title: 'Barevné sloučeniny', text: 'neúplně zaplněné orbitaly d pohlcují část viditelného světla' },
            { icon: 'catalyst', title: 'Katalyzátory', text: 'železo (amoniak), $V2O5$ (kyselina sírová), platina (autokatalyzátory), nikl (ztužování tuků), $MnO2$ (rozklad $H2O2$)' },
            { icon: 'balance-scale', title: 'Vysoká hustota a teplota tání', text: 'a tvrdost; výjimkou je rtuť' },
            { icon: 'molecule', title: 'Komplexní sloučeniny', text: 'tvoří je ochotně, viz níže' },
          ],
        },
        {
          type: 'table',
          headers: ['částice ve vodném roztoku', 'barva'],
          rows: [
            ['$Cu^2+$', 'modrá'],
            ['$Fe^2+$', 'světle zelená'],
            ['$Fe^3+$', 'žlutohnědá'],
            ['$Cr^3+$', 'zelená až fialová'],
            ['$MnO4^-$', 'fialová'],
            ['$Cr2O7^2-$', 'oranžová'],
            ['$Zn^2+$', 'bezbarvá (orbitaly d zcela zaplněné)'],
          ],
        },
        { type: 'p', text: '**Komplexní (koordinační) sloučenina** se skládá z centrálního atomu a ligandů:' },
        {
          type: 'keyterms',
          items: [
            { term: 'centrální atom', def: 'uprostřed komplexu, obvykle kation přechodného kovu' },
            { term: 'ligandy', def: 'molekuly nebo anionty s volným elektronovým párem: $H2O$, $NH3$, $OH^-$, $Cl^-$, $CN^-$' },
            { term: 'koordinační (donor-akceptorová) vazba', def: 'vznikne, když ligand poskytne svůj elektronový pár centrálnímu atomu' },
            { term: 'koordinační číslo', def: 'počet vazeb ligandů k centrálnímu atomu' },
          ],
        },
        { type: 'reaction', equation: 'Cu^2+ + 4NH3 -> [Cu(NH3)4]^2+', caption: 'tetraamminměďnatý kation: tmavě modrý, důkaz měďnatých iontů' },
        { type: 'structure', art: '     NH3\n      |\nH3N — Cu — NH3\n      |\n     NH3', caption: '$[Cu(NH3)4]^{2+}$: čtyři ligandy $NH3$ kolem $Cu^{2+}$, koordinační číslo 4' },
        { type: 'p', text: 'Název komplexu tvoří počet ligandů (di-, tetra-, hexa-), název ligandu (**aqua** $H2O$, **ammin** $NH3$, **hydroxido** $OH^-$, **chlorido** $Cl^-$, **kyanido** $CN^-$) a centrální atom s koncovkou oxidačního čísla. Aniontový komplex dostane koncovku **-an**: $K4[Fe(CN)6]$ je **hexakyanidoželeznatan draselný**, známý jako žlutá krevní sůl.' },
        {
          type: 'example',
          problem: 'Jaké oxidační číslo má železo v $K4[Fe(CN)6]$?',
          steps: [
            'Draslík má $+I$, ligand $CN^-$ má náboj $−1$.',
            '$4 · (+1) + x + 6 · (−1) = 0$',
            '$x = +2$',
          ],
          answer: 'Železo má oxidační číslo $+II$ (železnatan).',
        },
        { type: 'callout', variant: 'fact', title: 'Komplexy v tobě', text: 'Hemoglobin v krvi je komplex železa $Fe^{II}$, chlorofyl komplex hořčíku a vitamin $B12$ komplex kobaltu. Žlutá krevní sůl se jako E536 přidává do kuchyňské soli, aby se nehrudkovala.' },
        { type: 'game', gameId: 'who-am-i', text: 'Tvořím modrou skalici, zelenou patinu a vedu proud skoro nejlíp ze všech. Kdo jsem? Zahraj si hádání prvků.' },
        {
          type: 'check',
          question: {
            kind: 'number',
            q: 'Jaké je koordinační číslo centrálního atomu v hexaaquaměďnatém kationtu $[Cu(H2O)6]^{2+}$?',
            answer: 6,
            tolerance: 0,
            explain: 'Kolem mědi je šest molekul vody (předpona hexa-), každá tvoří jednu koordinační vazbu.',
          },
        },
      ],
    },
    {
      title: 'Kde to potkáš: rez, ochrana kovů a recyklace',
      icon: 'rust',
      blocks: [
        { type: 'p', text: '**Rezavění** je elektrochemická koroze železa. Potřebuje současně **vodu i kyslík** a sůl (třeba posypová na silnicích) ho výrazně urychlí, protože zvýší vodivost vody.' },
        { type: 'diagram', id: 'corrosion', caption: 'Koroze železa: železo se oxiduje, kyslík ve vodě se redukuje' },
        { type: 'formula', text: '$Fe -> Fe^2+ + 2e^-$', caption: 'oxidace železa' },
        { type: 'formula', text: '$O2 + 2H2O + 4e^- -> 4OH^-$', caption: 'redukce kyslíku' },
        { type: 'formula', text: '$4Fe + 3O2 + 2xH2O -> 2Fe2O3·xH2O$', caption: 'celkově: rez je hydratovaný oxid železitý' },
        {
          type: 'compare',
          columns: [
            { title: 'rez na železe', icon: 'rust', tone: 'bad', points: ['pórovitá, odlupuje se', 'kyslík a voda pronikají stále hlouběji', 'železo koroduje, dokud se úplně nerozpadne'] },
            { title: '$Al2O3$ na hliníku', icon: 'check', tone: 'good', points: ['kompaktní vrstvička', 'pevně drží na kovu', 'chrání kov před další oxidací (pasivace)'] },
          ],
        },
        {
          type: 'iconlist',
          items: [
            { icon: 'drop', title: 'Nátěr, olej, plast', text: 'odděluje kov od vody a kyslíku: zábradlí, řetěz kola' },
            { icon: 'check', title: 'Pozinkování', text: 'zinek je neušlechtilejší, koroduje místo železa i v místě škrábnutí: svodidla, okapy, plechy' },
            { icon: 'warning', title: 'Pocínování', text: 'cín jen odděluje; po poškrábání železo koroduje ještě rychleji: plechovky od konzerv' },
            { icon: 'battery', title: 'Obětovaná anoda', text: 'blok hořčíku nebo zinku připojený k železu se rozpouští místo něj: lodě, bojlery, potrubí' },
            { icon: 'star', title: 'Legování', text: 'chrom vytvoří na povrchu pasivní vrstvu: nerezové příbory a dřezy' },
          ],
        },
        { type: 'p', text: '**Recyklace kovů** šetří energii i rudy.' },
        {
          type: 'iconlist',
          items: [
            { icon: 'magnet', title: 'Železný šrot', text: 'od ostatního odpadu ho snadno oddělí magnet, ocel se přetavuje v elektrických pecích' },
            { icon: 'phone', title: 'Staré mobily', text: 'v tuně je až několik set gramů zlata, mnohem víc než v tuně zlaté rudy' },
            { icon: 'recycle', title: 'Hliník', text: 'recyklace spotřebuje jen asi 5 % energie potřebné na nový kov' },
          ],
        },
        { type: 'callout', variant: 'warning', text: 'Při broušení rzi a svařování nos brýle nebo svářečský štít a pracuj ve větraném prostoru. Prach ze starých nátěrů může obsahovat olovo nebo chrom.' },
        {
          type: 'check',
          question: {
            kind: 'multi',
            q: 'Které podmínky urychlují rezavění železa?',
            options: ['vlhkost', 'přítomnost kyslíku', 'sůl rozpuštěná ve vodě', 'suchý vzduch bez kyslíku', 'nátěr barvou'],
            answers: [0, 1, 2],
            explain: 'Rezavění potřebuje vodu i kyslík a elektrolyt (sůl) ho urychlí. Nátěr a suché prostředí železo chrání.',
          },
        },
      ],
    },
  ],
  summary: [
    'Hliník chrání tenká vrstva $Al2O3$ (pasivace); je amfoterní a reaguje s kyselinami i hydroxidy za vzniku vodíku.',
    'Hliník se vyrábí elektrolýzou $Al2O3$ rozpuštěného v kryolitu; recyklace spotřebuje jen asi 5 % energie.',
    'Ve vysoké peci redukuje oxid uhelnatý rudu: $Fe2O3 + 3CO -> 2Fe + 3CO2$; vápenec váže hlušinu do strusky.',
    'Ocel má méně uhlíku než surové železo; rez je pórovitý $Fe2O3·xH2O$ a železo chrání nátěry, zinek nebo legování chromem.',
    'Měď vede proud, na vzduchu tvoří měděnku a se zinkem dává mosaz, s cínem bronz.',
    'Přechodné kovy mají proměnlivá oxidační čísla, barevné sloučeniny, katalytické účinky a tvoří komplexy.',
    'Komplex tvoří centrální atom a ligandy s volným elektronovým párem, například $[Cu(NH3)4]^{2+}$.',
  ],
  quiz: [
    {
      kind: 'choice',
      q: 'Co se ve vysoké peci děje s vápencem?',
      options: [
        'Rozloží se na $CaO$, který s pískem z rudy vytvoří strusku.',
        'Redukuje oxid železitý na železo.',
        'Slouží jako palivo.',
        'Mění se na ocel.',
      ],
      answer: 0,
      explain: '$CaCO3 -> CaO + CO2$ a $CaO + SiO2 -> CaSiO3$. Struska plave na surovém železe a odpouští se zvlášť.',
    },
    {
      kind: 'tf',
      q: 'Pozinkované železo je chráněno i v místě poškrábání, protože zinek je neušlechtilejší než železo.',
      answer: true,
      explain: 'Zinek se oxiduje místo železa a funguje jako obětovaná anoda. U pocínovaného plechu je to naopak.',
    },
    {
      kind: 'order',
      q: 'Seřaď kroky výroby hliníku.',
      items: ['těžba bauxitu', 'čištění na oxid hlinitý', 'rozpuštění $Al2O3$ v roztaveném kryolitu', 'elektrolýza taveniny', 'odlévání hliníku do ingotů'],
      explain: 'Z bauxitu se nejdřív získá čistý $Al2O3$, ten se v kryolitu rozpustí a elektrolýzou se na katodě vyloučí hliník.',
    },
    {
      kind: 'match',
      q: 'Přiřaď slitinu k jejímu složení.',
      pairs: [
        ['mosaz', 'měď + zinek'],
        ['bronz', 'měď + cín'],
        ['nerezová ocel', 'železo + chrom + nikl'],
        ['dural', 'hliník + měď + hořčík'],
      ],
      explain: 'Mosaz a bronz jsou slitiny mědi, nerez je ocel s chromem a niklem a dural lehká slitina hliníku.',
    },
    {
      kind: 'multi',
      q: 'Které vlastnosti jsou typické pro přechodné kovy?',
      options: ['proměnlivá oxidační čísla', 'barevné sloučeniny', 'katalytické účinky', 'tvoří jen ionty s nábojem 1+', 'jsou měkké s nízkou teplotou tání'],
      answers: [0, 1, 2],
      explain: 'Díky orbitalům d mají přechodné kovy více oxidačních čísel, barevné ionty a jsou dobré katalyzátory. Obvykle jsou tvrdé a mají vysokou teplotu tání.',
    },
    {
      kind: 'number',
      q: 'Kolik tun železa lze teoreticky získat z 320 t $Fe2O3$? $M(Fe2O3) = 160 g/mol$, $M(Fe) = 56 g/mol$.',
      answer: 224,
      tolerance: 1,
      unit: 't',
      explain: '$w(Fe) = 112 / 160 = 0,70$, takže $m(Fe) = 0,70 · 320 t = 224 t$.',
    },
    {
      kind: 'text',
      q: 'Jaké oxidační číslo má měď v kationtu $[Cu(NH3)4]^{2+}$? Zapiš římskou číslicí.',
      accept: ['II', '+II', '2', '+2'],
      placeholder: 'např. III',
      explain: 'Molekuly $NH3$ jsou neutrální, celý náboj $2+$ tedy nese měď: $Cu^{II}$, proto „měďnatý“.',
    },
    {
      kind: 'tf',
      q: 'Rez chrání železo stejně dobře jako vrstva oxidu hlinitého hliník.',
      answer: false,
      explain: 'Rez je pórovitá a odlupuje se, takže kyslík a voda pronikají dál. Vrstva $Al2O3$ je kompaktní a pevně drží na kovu.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Závěrečná výzva                                                     */
/* ------------------------------------------------------------------ */

const boss: Question[] = [
  {
    kind: 'choice',
    q: 'Ve skupině halogenů reaktivita směrem dolů klesá, u alkalických kovů roste. Co oba trendy vysvětluje?',
    options: [
      'Rostoucí poloměr atomu: halogen hůř přitahuje přijímaný elektron, alkalický kov snáz ztrácí valenční elektron.',
      'Rostoucí počet valenčních elektronů ve skupině.',
      'Rostoucí elektronegativita směrem dolů.',
      'Klesající počet elektronových vrstev směrem dolů.',
    ],
    answer: 0,
    explain: 'Počet valenčních elektronů je ve skupině stejný. S každou další vrstvou je valenční vrstva dál od jádra: elektron se snáz odevzdá, ale hůř přijme.',
  },
  {
    kind: 'multi',
    q: 'Které látky reagují s kyselinou chlorovodíkovou i s roztokem hydroxidu sodného?',
    options: ['$Al$', '$ZnO$', '$Al(OH)3$', '$CaO$', '$SO3$'],
    answers: [0, 1, 2],
    explain: 'Hliník, oxid zinečnatý a hydroxid hlinitý jsou amfoterní. $CaO$ je zásaditý (reaguje jen s kyselinami), $SO3$ kyselý (jen se zásadami).',
  },
  {
    kind: 'match',
    q: 'Přiřaď průmyslový proces k jeho katalyzátoru.',
    pairs: [
      ['Haberova–Boschova syntéza amoniaku', 'železo'],
      ['kontaktní výroba kyseliny sírové', '$V2O5$'],
      ['Ostwaldova výroba kyseliny dusičné', 'platina s rhodiem'],
      ['ztužování rostlinných tuků vodíkem', 'nikl'],
    ],
    explain: 'Přechodné kovy a jejich sloučeniny jsou typické katalyzátory, protože snadno mění oxidační čísla a na povrchu vážou molekuly reaktantů.',
  },
  {
    kind: 'number',
    q: 'Kolik tun kyseliny sírové lze teoreticky vyrobit ze 64 t oxidu siřičitého? $M(SO2) = 64 g/mol$, $M(H2SO4) = 98 g/mol$.',
    answer: 98,
    tolerance: 0.5,
    unit: 't',
    explain: '64 t $SO2$ je $10^{6}$ mol. Každý mol $SO2$ dá jeden mol $SO3$ a nakonec jeden mol $H2SO4$, tedy $10^{6} · 98 g = 98 t$.',
  },
  {
    kind: 'order',
    q: 'Seřaď sloučeniny podle oxidačního čísla dusíku od nejnižšího po nejvyšší.',
    items: ['$NH3$', '$N2$', '$N2O$', '$NO$', '$NO2$', '$HNO3$'],
    explain: 'Dusík má v $NH3$ číslo $−III$, v $N2$ $0$, v $N2O$ $+I$, v $NO$ $+II$, v $NO2$ $+IV$ a v $HNO3$ $+V$.',
  },
  {
    kind: 'choice',
    q: 'Bílá sůl barví plamen cihlově červeně. S kyselinou chlorovodíkovou šumí a vzniklý plyn zakalí vápennou vodu. Co je to za látku?',
    options: ['$CaCO3$', '$Na2CO3$', '$CaCl2$', '$BaCO3$'],
    answer: 0,
    explain: 'Cihlově červený plamen prozrazuje vápník, šumění a zakalení vápenné vody uhličitan. $Na2CO3$ by barvil žlutě, $BaCO3$ zeleně a $CaCl2$ s kyselinou nešumí.',
  },
  {
    kind: 'text',
    q: 'Jaký jedovatý plyn se uvolní, když smícháš bělidlo s chlornanem sodným s kyselým čističem obsahujícím $HCl$? Napiš vzorec.',
    accept: ['Cl2'],
    caseSensitive: true,
    placeholder: 'vzorec',
    explain: '$NaClO + 2HCl -> NaCl + Cl2 + H2O$. Chlor ($+I$) z chlornanu a chlor ($−I$) z $HCl$ se setkají v oxidačním čísle $0$.',
  },
  {
    kind: 'multi',
    q: 'Kterými reakcemi vzniká kyslík?',
    options: ['katalytický rozklad $H2O2$', 'zahřívání $KMnO4$', 'elektrolýza vody', 'reakce zinku s $HCl$', 'tepelný rozklad $CaCO3$'],
    answers: [0, 1, 2],
    explain: 'Kyslík vzniká rozkladem peroxidu, manganistanu i vody. Zinek s kyselinou uvolní vodík a vápenec $CO2$.',
  },
  {
    kind: 'tf',
    q: 'Oxid uhličitý je plyn a oxid křemičitý pevná látka, protože křemík na rozdíl od uhlíku netvoří s kyslíkem dvojné vazby a vzniká obří kovalentní mřížka.',
    answer: true,
    explain: 'Uhlík tvoří molekulu $O=C=O$. Velký atom křemíku se spojuje jednoduchými vazbami se 4 kyslíky, a tak vzniká prostorová síť $SiO2$.',
  },
  {
    kind: 'tf',
    q: 'Ve vysoké peci je hlavním redukčním činidlem oxid uhličitý.',
    answer: false,
    explain: 'Rudu redukuje oxid uhelnatý: $Fe2O3 + 3CO -> 2Fe + 3CO2$. Oxid uhličitý je produktem, uhlík v něm už má nejvyšší oxidační číslo $+IV$.',
  },
  {
    kind: 'number',
    q: 'Kolik dm³ oxidu uhelnatého (za normálních podmínek, $V_{m} = 22,4 dm^{3}/mol$) je potřeba k redukci 1,6 kg $Fe2O3$? $M(Fe2O3) = 160 g/mol$.',
    answer: 672,
    tolerance: 2,
    unit: 'dm³',
    explain: '$n(Fe2O3) = 1600 / 160 = 10 mol$, podle rovnice $Fe2O3 + 3CO -> 2Fe + 3CO2$ je třeba 30 mol $CO$, tedy $30 · 22,4 = 672 dm^{3}$.',
  },
  {
    kind: 'match',
    q: 'Přiřaď částici k barvě jejího roztoku.',
    pairs: [
      ['$[Cu(NH3)4]^{2+}$', 'tmavě modrá'],
      ['$MnO4^-$', 'fialová'],
      ['$Cr2O7^2-$', 'oranžová'],
      ['$Fe^3+$', 'žlutohnědá'],
    ],
    explain: 'Barevnost sloučenin přechodných kovů souvisí s neúplně zaplněnými orbitaly d, které pohlcují část viditelného světla.',
  },
]

const level: LevelContent = {
  lessons: {
    'l7-1': l71,
    'l7-2': l72,
    'l7-3': l73,
    'l7-4': l74,
    'l7-5': l75,
    'l7-6': l76,
  },
  boss,
}

export default level
