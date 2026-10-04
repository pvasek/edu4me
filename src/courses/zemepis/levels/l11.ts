import type { LevelContent } from '../../../core/types'

/*
 * Zeměpis – level 11 „Obyvatelstvo, města a geopolitika“ (gymnázium G2–G3, AP/A-level).
 * Data sources (verified 2026-10): UN World Population Prospects 2024 (pyramids: shares from the wpp2024 package,
 * the same numbers as src/games/pop-pyramid/data.ts; totals and projections, medium variant), ČSÚ (2025, projekce 2023),
 * INSEE (bilan démographique 2025), Statistics Korea (2025), UN DESA International Migrant Stock 2024,
 * World Bank Migration and Development Brief (Dec 2024), Frontex (2025), Eurostat (temporary protection, July 2026),
 * UN World Urbanization Prospects 2018 and 2025, UN-Habitat, FAO SOFI 2026, IPC (2025), UNESCO World Heritage (2026),
 * UNHCR Global Trends 2025 (June 2026) and Ukraine situation (April 2026), IOM DTM Sudan (June 2026), UCDP (2025),
 * UN Security Council and peacekeeping (2025–2026), NATO Hague summit (2025), BRICS summit New Delhi (Sept 2026).
 * Conflicts: dated facts, neutral wording, state as of September/October 2026.
 */

// UN WPP 2024: % of the whole population in groups 0–4 … 80–84, 85+ (men + women = 100 %); 1 July of the year.
const WPP = 'UN World Population Prospects 2024'
const WPP_P = 'UN World Population Prospects 2024, střední varianta projekce'
const NGA_2023_M = [7.4, 7, 6.52, 5.68, 4.73, 3.86, 3.24, 2.76, 2.41, 1.98, 1.5, 1.16, 0.88, 0.63, 0.41, 0.25, 0.11, 0.04]
const NGA_2023_F = [7.22, 6.81, 6.3, 5.47, 4.56, 3.74, 3.14, 2.7, 2.36, 1.94, 1.5, 1.18, 0.92, 0.69, 0.46, 0.27, 0.13, 0.05]
const NGA_2050_M = [5.31, 5.17, 5.09, 4.95, 4.86, 4.53, 4.12, 3.84, 3.29, 2.61, 1.96, 1.57, 1.25, 0.97, 0.67, 0.37, 0.16, 0.06]
const NGA_2050_F = [5.18, 5.03, 4.93, 4.78, 4.69, 4.36, 3.95, 3.68, 3.14, 2.48, 1.88, 1.53, 1.24, 0.99, 0.69, 0.39, 0.18, 0.08]
const KOR_1970_M = [7.13, 7.35, 7.12, 5.37, 4.17, 3.77, 3.51, 2.84, 2.12, 1.93, 1.56, 1.26, 0.98, 0.59, 0.39, 0.2, 0.08, 0.02]
const KOR_1970_F = [6.77, 6.83, 6.63, 5.06, 3.9, 3.44, 3.38, 2.9, 2.4, 2.03, 1.61, 1.38, 1.15, 0.82, 0.64, 0.38, 0.19, 0.06]
const KOR_2050_M = [1.28, 1.36, 1.37, 1.49, 1.75, 1.76, 2.15, 2.75, 2.75, 2.86, 3.68, 4.1, 3.59, 3.9, 3.78, 3.7, 3.09, 3.37]
const KOR_2050_F = [1.21, 1.3, 1.31, 1.44, 1.7, 1.73, 2.11, 2.7, 2.67, 2.71, 3.41, 3.63, 3.34, 3.88, 4.01, 4.2, 3.93, 6]
const CHN_1990_M = [5.81, 4.83, 4.3, 5.29, 5.67, 4.91, 3.62, 3.88, 2.9, 2.17, 2, 1.79, 1.42, 1.06, 0.69, 0.39, 0.16, 0.05]
const CHN_1990_F = [5.29, 4.5, 4.05, 5.02, 5.42, 4.72, 3.49, 3.79, 2.76, 2.01, 1.82, 1.72, 1.42, 1.16, 0.85, 0.57, 0.31, 0.16]
const CHN_2050_M = [1.62, 1.76, 1.75, 1.69, 1.69, 1.85, 3.21, 3.77, 3.59, 3.31, 3.43, 3.81, 4.74, 3.73, 3.01, 3.15, 2.58, 1.88]
const CHN_2050_F = [1.52, 1.66, 1.64, 1.58, 1.55, 1.67, 2.82, 3.26, 3.07, 2.84, 3, 3.46, 4.52, 3.75, 3.2, 3.6, 3.26, 3.05]
const ARE_2023_M = [2.69, 2.86, 2.67, 2.45, 5.01, 9.03, 10.61, 9.2, 6.76, 4.85, 3.35, 2.28, 1.22, 0.47, 0.29, 0.13, 0.07, 0.03]
const ARE_2023_F = [2.59, 2.79, 2.6, 2.19, 3.35, 4.13, 4.42, 4.39, 3.25, 2.03, 1.53, 1.29, 0.71, 0.34, 0.23, 0.12, 0.06, 0.03]

// Members of groupings shown on maps (2026).
const BRICS = ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'EGY', 'ETH', 'IRN', 'ARE', 'IDN']
const BRICS_PARTNERS = ['BLR', 'BOL', 'KAZ', 'CUB', 'MYS', 'NGA', 'THA', 'UGA', 'UZB', 'VNM']

const level: LevelContent = {
  lessons: {
    // ───────────────────────────────────────────────────────────── z11-1
    'z11-1': {
      id: 'z11-1',
      title: 'Demografický přechod',
      goals: [
        'Popsat pět fází modelu demografického přechodu a přiřadit k nim státy podle porodnosti, úmrtnosti a tvaru pyramidy',
        'Vysvětlit, proč úmrtnost klesá dřív než porodnost, a pracovat s úhrnnou plodností a setrvačností populace',
        'Kriticky zhodnotit meze modelu a číst populační projekce OSN a ČSÚ',
        'Porovnat antinatalistickou a pronatalistickou populační politiku na příkladu Číny a Francie',
      ],
      hook: 'Jižní Korea měla v roce 1970 v průměru 4,5 dítěte na ženu, v roce 2025 jen 0,8. Evropě trvala podobná cesta přes sto let, Koreji padesát. Je demografický přechod přírodní zákon, nebo jen dobře vymyšlený příběh?',
      sections: [
        {
          title: 'Model v pěti fázích',
          icon: 'chart',
          blocks: [
            { type: 'p', text: 'V lekci „Porodnost, úmrtnost a věková pyramida“ jsi viděl/a, že Evropa kdysi vypadala jako dnešní Niger. Teď z toho uděláme přesný nástroj: **model demografického přechodu** (v českých učebnicích také *demografická revoluce*). Popisuje, jak se s rozvojem společnosti mění porodnost, úmrtnost a tím i přirozený přírůstek.' },
            { type: 'p', text: 'Model vznikl zobecněním dějin Evropy a Severní Ameriky (Warren Thompson 1929, Frank Notestein 1945). V grafu sleduj mezeru mezi čarou porodnosti a úmrtnosti: to je přirozený přírůstek.' },
            { type: 'diagram', id: 'demographic-transition', caption: 'Model demografického přechodu: nejdřív klesá úmrtnost, porodnost až se zpožděním. Mezitím populace roste nejrychleji.' },
            { type: 'p', text: 'Abys fáze poznal/a u skutečných států, sleduj u každé tři znaky: vztah porodnosti a úmrtnosti, rychlost růstu a tvar pyramidy. Tabulka je shrnuje s daty OSN:' },
            { type: 'table', headers: ['fáze', 'porodnost a úmrtnost', 'přirozený přírůstek', 'pyramida', 'příklad (porodnost / úmrtnost 2023)'], rows: [
              ['1. vysoká stagnace', 'obě vysoké (≈ 35–40 ‰), úmrtnost kolísá s neúrodou a epidemiemi', 'kolem nuly', 'široká, rychle se zužuje', 'dnes žádný stát; Evropa před rokem 1750'],
              ['2. rychlý růst', 'úmrtnost rychle klesá, porodnost zůstává vysoká', 'nejvyšší', 'progresivní, velmi široká základna', 'Niger 41,9 / 8,9 ‰'],
              ['3. zpomalený růst', 'klesá i porodnost', 'klesá', 'základna se zužuje', 'Indie 16,1 / 6,6 ‰'],
              ['4. nízká stagnace', 'obě nízké a blízko sebe', 'malý', 'zvon', 'USA 10,6 / 8,7 ‰'],
              ['5. úbytek', 'porodnost pod úmrtností', 'záporný', 'urna', 'Japonsko 6,0 / 12,3 ‰'],
            ], caption: 'Porodnost a úmrtnost v roce 2023 podle UN World Population Prospects 2024.' },
            { type: 'p', text: 'Pozor na past u úmrtnosti: ve 4. a 5. fázi úmrtnost znovu mírně *roste*, i když se lidé dožívají víc než kdy dřív. Populace totiž stárne a přibývá starých lidí, kteří umírají nejčastěji. Proto má Japonsko vyšší úmrtnost (12,3 ‰) než Niger (8,9 ‰).' },
            { type: 'p', text: 'Fáze tedy umíme poznat z čísel. Proč ale obě čáry klesají v různou dobu a mezera mezi nimi se otevře na celá desetiletí?' },
            { type: 'check', question: { kind: 'choice', q: 'Stát má porodnost 31 ‰ a úmrtnost 6 ‰ a porodnost v posledních letech zřetelně klesá. Ve které fázi demografického přechodu je?', options: ['ve 3. fázi', 've 2. fázi', 've 4. fázi', 'v 5. fázi'], answer: 0, explain: 'Úmrtnost už je nízká a porodnost klesá – to je 3. fáze. Přírůstek (2,5 % ročně) je ještě vysoký, ale už se zmenšuje. Ve 2. fázi porodnost zůstává vysoká a neklesá.' } },
          ],
        },
        {
          title: 'Proč nejdřív klesá úmrtnost',
          icon: 'baby',
          blocks: [
            { type: 'p', text: 'Úmrtnost a porodnost klesají z různých důvodů. Úmrtnost srazí věci, které chce každý a které se dají rychle zavést i zvenčí: očkování, čistá voda, antibiotika. Porodnost závisí na rozhodnutí milionů rodin, a ta se mění pomaleji – s generacemi.' },
            { type: 'p', text: 'Porovnej, co stojí za poklesem každé z obou veličin:' },
            { type: 'compare', columns: [
              { title: 'Úmrtnost klesá díky', icon: 'first-aid', tone: 'a', points: ['dostatku jídla a lepší dopravě potravin', 'čisté vodě, kanalizaci a mýdlu', 'očkování a antibiotikům', 'péči o matky a novorozence: nejvíc klesá kojenecká úmrtnost'] },
              { title: 'Porodnost klesá, protože', icon: 'baby', tone: 'b', points: ['dívky chodí déle do školy a ženy pracují mimo domov', 've městě je dítě drahé, na statku bylo pracovní silou', 'přežívají skoro všechny děti, není potřeba „pojistka“', 'antikoncepce je dostupná', 'na stáří se rodiče spoléhají na důchod, ne na děti'] },
            ] },
            { type: 'p', text: 'Porodnost v promilích má jednu slabinu: závisí na věkovém složení. V mladé populaci vyjde vysoká, i když má každá žena málo dětí, protože žen v plodném věku je hodně. Demografové proto sledují ještě přesnější ukazatele:' },
            { type: 'keyterms', items: [
              { term: '**Úhrnná plodnost**', def: 'průměrný počet dětí, které by porodila jedna žena za život, kdyby se plodnost žen v jednotlivých věkových skupinách neměnila; svět asi 2,2 (OSN, 2024), Niger kolem 6, Česko 1,28 (ČSÚ, 2025), Jižní Korea 0,80 (2025)' },
              { term: '**Záchovná úroveň plodnosti**', def: 'asi 2,1 dítěte na ženu: dvě děti nahradí rodiče, desetina navíc vyrovná úmrtí před dospělostí a to, že se rodí o něco víc chlapců; při vysoké úmrtnosti je vyšší' },
              { term: '**Kojenecká úmrtnost**', def: 'počet dětí zemřelých do 1 roku na 1 000 živě narozených; nejcitlivější ukazatel zdravotní péče a životních podmínek' },
            ] },
            { type: 'p', text: 'S promile se dá počítat dál. Přirozený přírůstek v ‰ vydělený deseti dá roční růst v procentech, a ten už umíš převést na dobu zdvojnásobení pravidlem 70 z lekce „Kolik nás je a kde žijeme“:' },
            { type: 'example', title: 'Indie ve 3. fázi', problem: 'Indie měla v roce 2023 porodnost 16,1 ‰ a úmrtnost 6,6 ‰ (UN WPP 2024). Jak rychle roste bez migrace a za jak dlouho by se zdvojnásobila, kdyby tempo zůstalo stejné?', steps: [
              'Přirozený přírůstek = 16,1 ‰ − 6,6 ‰ = 9,5 ‰.',
              'V procentech: 9,5 ‰ = 0,95 % ročně (promile dělíme deseti, protože % je „ze sta“).',
              'Doba zdvojnásobení ≐ 70 : 0,95 ≐ 74 let.',
            ], answer: 'Asi 0,95 % ročně, zdvojnásobení zhruba za 74 let. Ve skutečnosti k tomu nedojde: porodnost dál klesá a OSN čeká vrchol Indie kolem 1,7 miliardy na začátku 60. let.' },
            { type: 'p', text: 'Pokles porodnosti tedy růst brzdí. Jenže brzdná dráha je dlouhá: populace roste ještě desítky let poté, co ženy začnou mít málo dětí.' },
            { type: 'check', question: { kind: 'tf', q: 'Úhrnná plodnost 2,1 znamená, že porodnost státu je 2,1 ‰.', answer: false, explain: 'Úhrnná plodnost je počet dětí na jednu ženu za život, porodnost je počet živě narozených na 1 000 obyvatel za rok. Jsou to různé veličiny s různými jednotkami.' } },
          ],
        },
        {
          title: 'Setrvačnost populace',
          icon: 'hourglass',
          blocks: [
            { type: 'p', text: 'Představ si, že by od zítřka měla každá žena v Nigérii jen dvě děti. Přestala by Nigérie růst? Nepřestala. Rodiči příštích let jsou dnešní děti, a to je obrovská generace. Tomuto jevu říkáme **setrvačnost populace** (populační momentum).' },
            { type: 'p', text: 'Porovnej pyramidu Nigérie v roce 2023 a podle střední varianty projekce OSN v roce 2050. Základna se zúží, protože porodnost klesá – a přesto přibude přes 130 milionů lidí:' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Nigérie 2023', male: NGA_2023_M, female: NGA_2023_F, source: WPP },
              { label: 'Nigérie 2050', male: NGA_2050_M, female: NGA_2050_F, source: WPP_P },
            ], caption: 'Nigérie: asi 228 mil. obyvatel (2023) → asi 359 mil. (2050, projekce). Silné ročníky dnešních dětí se posunou do věku rodičů.' },
            { type: 'p', text: 'Setrvačnost funguje i opačně. Vyzkoušej si to: zvol Česko a hledej porodnost, při které by za 50 let mělo stejně obyvatel jako dnes. Pak zvol Niger a sniž porodnost na 20 ‰:' },
            { type: 'experiment', id: 'birth-death-rates', caption: 'Porodnost a úmrtnost → přirozený přírůstek, úhrnná plodnost a pyramida za 50 let (model bez migrace).' },
            { type: 'p', text: 'Všiml/a sis? V Česku nestačí, aby se porodnost vyrovnala úmrtnosti: početné ročníky ze 70. let za 50 let vymřou a slabé ročníky narozené po roce 1995 je nenahradí. Niger poroste i s poloviční porodností, protože má tolik mladých lidí. ==Dnešní věková struktura určuje růst populace na desítky let dopředu.==' },
            { type: 'p', text: 'Model demografického přechodu tedy popisuje směr změny, ale ne její tempo. A tady začínají jeho slabiny.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč počet obyvatel Nigérie poroste ještě desítky let, i když porodnost klesá?', options: ['do věku rodičů dorůstají velmi početné ročníky dnešních dětí', 'úmrtnost v Nigérii prudce roste', 'do Nigérie se stěhují miliony lidí z Evropy', 'porodnost se počítá jen ze žen'], answer: 0, explain: 'To je setrvačnost populace: i když má každá žena méně dětí, matek je tolik, že dětí se rodí stále hodně.' } },
          ],
        },
        {
          title: 'Meze modelu',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Každý model zjednodušuje. Demografický přechod vznikl z dějin Evropy, kde trval 150–200 let a probíhal souběžně s průmyslovou revolucí. Platí stejně i jinde?' },
            { type: 'p', text: 'Dobrým testem je Jižní Korea. Porovnej její pyramidu z roku 1970 s projekcí na rok 2050: z pyramidy se stane urna během jediného lidského života.' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Jižní Korea 1970', male: KOR_1970_M, female: KOR_1970_F, source: WPP },
              { label: 'Jižní Korea 2050', male: KOR_2050_M, female: KOR_2050_F, source: WPP_P },
            ], caption: 'Jižní Korea 1970 (32,5 mil.) a 2050 (projekce 45,1 mil.). Úhrnná plodnost klesla ze 4,5 (1970) na 0,8 (2025, Statistics Korea), jednu z nejnižších na světě.' },
            { type: 'p', text: 'Korea prošla přechodem asi za 50 let, Evropa za 150. Z tohoto a dalších případů plynou hlavní výtky k modelu:' },
            { type: 'list', items: [
              '**Eurocentrismus:** model vychází ze zkušenosti Evropy. Dnešní rozvojové země „dovezly“ očkování a antibiotika, a úmrtnost u nich klesla mnohem rychleji než kdysi v Evropě.',
              '**Neříká kdy:** nepředpoví, kdy porodnost začne klesat ani jak rychle. V části subsaharské Afriky klesá pomaleji, než se čekalo.',
              '**Chybí migrace:** počítá jen s narozenými a zemřelými, i když v Česku nebo v Německu dnes o růstu rozhoduje migrační saldo.',
              '**Nejasný konec:** původní model měl čtyři fáze; pátou (úbytek) přidali demografové až podle dnešní Evropy a východní Asie. Nikdo neví, zda plodnost někde zase vzroste.',
              '**Kultura a politika:** náboženství, postavení žen i státní politika (Čína) pokles porodnosti urychlí, nebo zbrzdí. Úmrtnost může i znovu vzrůst: v jižní Africe ji v 90. letech zvedl HIV/AIDS.',
            ] },
            { type: 'p', text: 'Model tedy dobře popisuje směr, ale nehodí se k předpovědi. Na tu mají demografové jiný nástroj – projekce.' },
            { type: 'check', question: { kind: 'multi', q: 'Které výtky k modelu demografického přechodu jsou oprávněné?', options: ['nepočítá s migrací', 'vznikl podle vývoje Evropy a jinde probíhá jinak rychle', 'neurčuje, kdy porodnost začne klesat', 'tvrdí, že úmrtnost klesá dřív než porodnost', 'neumí popsat stát s vysokou porodností'], answers: [0, 1, 2], explain: 'Model nepočítá s migrací, vychází z Evropy a nedává časový rozvrh. Dřívější pokles úmrtnosti je naopak jeho jádro, které se potvrdilo, a vysokou porodnost popisují fáze 1 a 2.' } },
          ],
        },
        {
          title: 'Projekce: jak daleko vidíme',
          icon: 'telescope',
          blocks: [
            { type: 'p', text: 'Projekce není věštba, ale výpočet „co když“. Demograf vezme dnešní pyramidu a rok po roce ji posouvá: nechá každou skupinu zestárnout o rok, odečte zemřelé podle úmrtnosti v daném věku, přidá narozené podle plodnosti žen a připočte migraci. Výsledek je jen tak dobrý jako tyto předpoklady.' },
            { type: 'p', text: 'Proto OSN počítá několik variant a nejčastěji se cituje ta střední. Podívej se, jak podle ní vypadá budoucnost tří populačních obrů:' },
            { type: 'graph', x: { label: 'rok', min: 1950, max: 2100, step: 25 }, y: { label: 'počet obyvatel', unit: 'mil.', min: 0, max: 1800, step: 300 },
              series: [
                { label: 'Indie', points: [[1950, 346], [1970, 546], [2000, 1058], [2025, 1464], [2050, 1680], [2075, 1671], [2100, 1505]], style: 'smooth', tone: 'a' },
                { label: 'Čína', points: [[1950, 544], [1970, 823], [2000, 1270], [2025, 1416], [2050, 1260], [2075, 934], [2100, 633]], style: 'smooth', tone: 'b' },
                { label: 'Nigérie', points: [[1950, 37], [1970, 56], [2000, 126], [2025, 238], [2050, 359], [2075, 447], [2100, 477]], style: 'smooth', tone: 'c' },
              ],
              marks: [{ x: 2025, label: 'dnes' }],
              caption: 'Počet obyvatel Indie, Číny a Nigérie v milionech. Do roku 2023 odhady, potom střední varianta projekce (UN World Population Prospects 2024).' },
            { type: 'p', text: 'Čína dosáhla vrcholu kolem roku 2021 a do roku 2100 může mít méně než polovinu dnešního počtu obyvatel. Indie poroste ještě asi do roku 2060, až na 1,7 miliardy. Nigérie bude mít v roce 2100 asi 477 milionů lidí. Jak moc ale záleží na předpokladech, ukazuje Česko – dvě instituce, dvě projekce na rok 2050:' },
            { type: 'table', headers: ['projekce', 'Česko 2050', 'čím se liší'], rows: [
              ['ČSÚ 2023, střední varianta', '10,69 mil.', 'plodnost 1,5 dítěte na ženu a migrační saldo +35 000 ročně'],
              ['UN WPP 2024, střední varianta', '9,83 mil.', 'počítá s mnohem menším migračním ziskem'],
            ], caption: 'Výchozí stav: 10,9 mil. obyvatel (ČSÚ, konec roku 2025).' },
            { type: 'p', text: 'Rozdíl asi 860 tisíc lidí je skoro tolik, kolik mají Brno, Ostrava a Plzeň dohromady. Obecně platí: čím dál do budoucnosti, tím víc se varianty rozcházejí. Nejistější jsou porodnost a migrace, úmrtnost se odhaduje nejlépe. Projekce přesto ukazují, že velká část světa bude stárnout – a některé státy se proto snaží porodnost řídit.' },
            { type: 'check', question: { kind: 'number', q: 'Podle střední varianty OSN bude mít Čína v roce 2100 asi 633 milionů obyvatel, v roce 2025 jich měla asi 1 416 milionů. O kolik procent počet obyvatel klesne? Zaokrouhli na celá procenta.', answer: 55, tolerance: 1, unit: '%', explain: '633 : 1 416 ≐ 0,447, tedy zůstane asi 45 %. Pokles je 100 % − 45 % ≐ 55 %.' } },
          ],
        },
        {
          title: 'Populační politika',
          icon: 'flag',
          blocks: [
            { type: 'p', text: '**Populační politika** jsou opatření, kterými stát záměrně mění porodnost, úmrtnost nebo migraci. Podle cíle ji dělíme na **antinatalistickou** (méně dětí) a **pronatalistickou** (víc dětí). Dva nejznámější příklady leží na opačných koncích:' },
            { type: 'compare', columns: [
              { title: 'Čína: antinatalistická politika', icon: 'people', tone: 'a', points: ['1980–2015 politika jednoho dítěte: pokuty, ztráta zaměstnání, ale i vynucené potraty a sterilizace', 'od 2016 dvě děti, od 2021 tři děti', 'od 2025 naopak příspěvek 3 600 jüanů ročně na každé dítě do 3 let', 'úhrnná plodnost kolem 1,0–1,1 (2025), počet obyvatel klesá od roku 2022'] },
              { title: 'Francie: pronatalistická politika', icon: 'baby', tone: 'b', points: ['rodinné přídavky a daňové úlevy rostou s počtem dětí', 'dostupné jesle a školky, matky se snadno vracejí do práce', 'úhrnná plodnost 1,56 (2025, INSEE), stále mezi nejvyššími v EU', 'přesto v roce 2025 poprvé od 2. světové války víc lidí zemřelo, než se narodilo'] },
            ] },
            { type: 'p', text: 'Důsledky čínské politiky jsou dobře vidět v pyramidě. Porovnej rok 1990 s projekcí na rok 2050 a všimni si i základny v roce 1990, kde chlapci převažují nad dívkami:' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Čína 1990', male: CHN_1990_M, female: CHN_1990_F, source: WPP },
              { label: 'Čína 2050', male: CHN_2050_M, female: CHN_2050_F, source: WPP_P },
            ], caption: 'Čína 1990 (1,15 mld.) a 2050 (projekce 1,26 mld.): ze široké pyramidy se stane urna a lidé nad 65 let budou tvořit skoro třetinu obyvatel.' },
            { type: 'p', text: 'Pozor na dvě časté chyby. Zaprvé, porodnost v Číně prudce klesala už v 70. letech, před politikou jednoho dítěte; ta pokles jen urychlila. Zadruhé, peníze samy porodnost výrazně nezvednou – rozhoduje, jestli jde sladit děti s prací a bydlením. Politika jednoho dítěte spolu s upřednostňováním synů navíc vychýlila poměr pohlaví při narození kolem roku 2010 až na 118 chlapců na 100 dívek; přirozený poměr je asi 105 : 100.' },
            { type: 'p', text: 'Fázi přechodu z pyramidy a její podobu za 20 let si procvič ve hře:' },
            { type: 'game', gameId: 'pop-pyramid', text: 'Urči z pyramidy fázi demografického přechodu a odhadni, jak bude populace vypadat za 20 let.' },
            { type: 'p', text: 'Stárnoucí Evropu a východní Asii a mladou Afriku ale nespojují jen čísla v tabulkách. Spojuje je pohyb lidí, a ten vysvětlíme v lekci „Migrace a teorie migrace“.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč dnes Čína vyplácí rodinám příspěvky na děti?', options: ['porodnost klesla tak nízko, že populace rychle stárne a ubývá', 'chce udržet politiku jednoho dítěte', 'v Číně se rodí příliš mnoho dětí', 'nařídila jí to OSN'], answer: 0, explain: 'Po desetiletích antinatalistické politiky má Čína úhrnnou plodnost kolem 1 a od roku 2022 ubývá obyvatel. Proto přešla k pronatalistickým opatřením.' } },
          ],
        },
      ],
      summary: [
        'Model demografického přechodu má pět fází: vysoká stagnace, rychlý růst, zpomalený růst, nízká stagnace a úbytek.',
        'Úmrtnost klesá dřív než porodnost, protože zdravotní pokrok se šíří rychle, kdežto rozhodování rodin o počtu dětí se mění s generacemi.',
        'Úhrnná plodnost je počet dětí na jednu ženu; záchovná úroveň je asi 2,1, Česko mělo v roce 2025 jen 1,28.',
        'Setrvačnost populace znamená, že dnešní věková struktura určuje růst na desítky let: Nigérie poroste, i když porodnost klesá.',
        'Model vychází z Evropy, nepočítá s migrací a neurčuje tempo; Jižní Korea prošla přechodem za 50 let.',
        'Projekce jsou výpočty „co když“; pro Česko v roce 2050 dává ČSÚ 10,69 mil. a OSN 9,83 mil. obyvatel.',
        'Čína omezovala porodnost politikou jednoho dítěte, Francie ji podporuje rodinnou politikou; dnes obě porodnost podporují.',
      ],
      quiz: [
        { kind: 'tf', q: 'V 5. fázi demografického přechodu je porodnost nižší než úmrtnost.', answer: true, explain: 'Pátá fáze je fáze úbytku: přirozený přírůstek je záporný, jako v Japonsku nebo v Česku.' },
        { kind: 'order', q: 'Seřaď státy podle fáze demografického přechodu od nejranější (údaje 2023).', items: ['Niger (41,9 / 8,9 ‰)', 'Indie (16,1 / 6,6 ‰)', 'USA (10,6 / 8,7 ‰)', 'Japonsko (6,0 / 12,3 ‰)'], explain: 'Niger je ve 2. fázi, Indie ve 3., USA ve 4. a Japonsko v 5. fázi s přirozeným úbytkem.' },
        { kind: 'number', q: 'Stát má porodnost 24 ‰ a úmrtnost 7 ‰. Za kolik let by se jeho počet obyvatel bez migrace zdvojnásobil (pravidlo 70)? Zaokrouhli na celé roky.', answer: 41, tolerance: 1, unit: 'let', explain: 'Přirozený přírůstek 17 ‰ = 1,7 % ročně; 70 : 1,7 ≐ 41 let.' },
        { kind: 'choice', q: 'Proč ve 4. a 5. fázi úmrtnost mírně roste, i když se lidé dožívají vyššího věku?', options: ['populace stárne a přibývá starých lidí', 'zhoršuje se zdravotní péče', 'roste kojenecká úmrtnost', 'lidé se stěhují do měst'], answer: 0, explain: 'Úmrtnost se počítá na všechny obyvatele. Když je v populaci víc starých lidí, víc lidí za rok zemře, i když každý žije déle.' },
        { kind: 'multi', q: 'Co obvykle vede k poklesu porodnosti?', options: ['delší vzdělávání dívek', 'stěhování rodin do měst', 'důchodový systém', 'vysoká kojenecká úmrtnost', 'práce dětí na rodinném statku'], answers: [0, 1, 2], explain: 'Vzdělání žen, městský život a zajištění ve stáří snižují počet dětí. Vysoká kojenecká úmrtnost a dětská práce na statku naopak porodnost drží vysoko.' },
        { kind: 'tf', q: 'Když úhrnná plodnost klesne na 2,1, počet obyvatel se okamžitě přestane měnit.', answer: false, explain: 'Kvůli setrvačnosti populace ještě desítky let roste (mladá populace), nebo klesá (stará populace), dokud se věková struktura neustálí.' },
        { kind: 'choice', q: 'Proč se projekce ČSÚ a OSN pro Česko v roce 2050 liší asi o 860 tisíc lidí?', options: ['vycházejí z jiných předpokladů, hlavně o migraci', 'jedna z nich počítá jen muže', 'OSN nezná dnešní počet obyvatel Česka', 'ČSÚ nepočítá se zemřelými'], answer: 0, explain: 'Obě začínají ze stejných dat, ale ČSÚ počítá s vyšším migračním saldem. Migrace je spolu s porodností nejnejistější část každé projekce.' },
        { kind: 'text', q: 'Jak se nazývá průměrný počet dětí, které by porodila jedna žena za život? (dvě slova)', accept: ['úhrnná plodnost', 'plodnost úhrnná'], explain: 'Úhrnná plodnost nezávisí na věkovém složení populace, proto je přesnější než porodnost v ‰.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-2
    'z11-2': {
      id: 'z11-2',
      title: 'Migrace a teorie migrace',
      goals: [
        'Popsat velikost a hlavní směry mezinárodní migrace podle dat OSN',
        'Vysvětlit migraci Leeovým modelem push–pull, Ravensteinovými zákony a gravitačním modelem a znát jejich meze',
        'Spočítat poměr dvou migračních toků gravitačním modelem',
        'Zhodnotit dopady remitencí a odlivu mozků a popsat hlavní migrační trasy do Evropy',
      ],
      hook: 'Kdyby všichni lidé, kteří žijí mimo zemi svého narození, založili vlastní stát, měl by 304 milionů obyvatel – čtvrtý nejlidnatější na světě. Proč se ale stěhuje „jen“ 3,7 % lidstva, a ne mnohem víc?',
      sections: [
        {
          title: 'Migrace v číslech',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'V lekci „Migrace“ jsme migraci rozdělili na vnitřní a mezinárodní, dobrovolnou a nucenou. Na gymnáziu se ptáme hlouběji: kolik lidí migruje, kam a proč právě tam? Začneme čísly OSN.' },
            { type: 'p', text: 'V roce 2024 žilo mimo zemi svého narození 304 milionů lidí, tedy 3,7 % lidstva; v roce 1990 jich bylo 154 milionů (UN DESA, International Migrant Stock 2024). Na mapě porovnej, kam míří nejvíc lidí a odkud jich nejvíc pochází:' },
            { type: 'map', view: 'world', highlight: [
              { codes: ['USA', 'DEU', 'SAU'], tone: 'a', label: 'nejvíc přistěhovalců: USA 52 mil., Německo 17 mil., Saúdská Arábie 14 mil.' },
              { codes: ['IND', 'CHN', 'MEX'], tone: 'b', label: 'nejvíc vystěhovalců: Indie, Čína, Mexiko' },
              { codes: ['ARE', 'QAT'], tone: 'c', label: 'přistěhovalci tvoří přes 70 % obyvatel' },
            ], layers: ['names'], caption: 'Mezinárodní migranti v roce 2024 (UN DESA, International Migrant Stock 2024). Jen v USA žije asi 17 % všech migrantů světa.' },
            { type: 'p', text: 'Mapa vyvrací dvě představy. Migranti nemíří jen do Evropy a Severní Ameriky: třetím největším cílem je Saúdská Arábie. A v Kataru a Spojených arabských emirátech tvoří přistěhovalci přes 70 % obyvatel – přijeli za prací na stavbách, ve službách a v ropném průmyslu. Jak to vypadá v datech o lidech, ukazuje pyramida:' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Spojené arabské emiráty 2023', male: ARE_2023_M, female: ARE_2023_F, source: WPP },
            ], caption: 'Spojené arabské emiráty: obrovský „výběžek“ mužů ve věku 20–44 let tvoří pracovní migranti, hlavně z jižní Asie. Žen, dětí a starých lidí je mnohem méně.' },
            { type: 'p', text: 'Tvar této pyramidy tedy nevytvořila porodnost, ale migrace za prací. Proč se ale člověk vůbec rozhodne odejít? Na to mají geografové několik modelů.' },
            { type: 'check', question: { kind: 'tf', q: 'Většina mezinárodních migrantů světa žije v Evropě.', answer: false, explain: 'Evropa je největším cílovým regionem, ale žije v ní jen asi třetina migrantů. Velkými cíli jsou i Severní Amerika, státy Perského zálivu a další části Asie.' } },
          ],
        },
        {
          title: 'Push–pull a překážky',
          icon: 'signpost',
          blocks: [
            { type: 'p', text: 'Model odpuzujících a přitahujících faktorů už znáš. Jeho autor Everett Lee (1966) ale přidal dvě věci, na které se často zapomíná: **překážky mezi místy** a **osobní faktory** migranta.' },
            { type: 'p', text: 'V obrázku sleduj, že faktory nepůsobí jen v místě odchodu a v cíli. Mezi nimi stojí vzdálenost, cena cesty, víza a hranice:' },
            { type: 'diagram', id: 'push-pull', caption: 'Leeův model: odpuzující faktory (push) ve výchozím místě, přitahující (pull) v cíli a překážky mezi nimi. Rozhodnutí ještě filtrují osobní faktory: věk, vzdělání, rodina, informace.' },
            { type: 'p', text: 'Proč neodcházejí ti nejchudší? Cesta stojí peníze a vyžaduje kontakty. Proto emigrace s rozvojem nejdřív roste a teprve u bohatých zemí klesá; geografové tomu říkají **migrační přechod**. Model push–pull má i další meze:' },
            { type: 'list', items: [
              'vidí jednotlivce, který racionálně porovnává dvě místa, ale ne strukturální příčiny: globální nerovnosti a poptávku bohatých ekonomik po levné práci',
              'přehlíží **migrační sítě**: kdo má v cíli příbuzné, odejde snáz, a tak vznikají celé komunity (Vietnamci v Česku, Češi v Chicagu)',
              'nucenou migraci vysvětluje špatně: uprchlík před válkou nevybírá mezi výhodami, ale utíká tam, kam se dostane',
            ] },
            { type: 'p', text: 'Lee tedy popisuje, proč se rozhodne jeden člověk. Starší modely naopak hledaly pravidelnosti v celých proudech migrantů.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč z nejchudších zemí světa odchází do zahraničí relativně méně lidí než ze zemí se středními příjmy?', options: ['cesta a vyřízení víz stojí peníze, které nejchudší nemají', 'v nejchudších zemích nepůsobí žádné odpuzující faktory', 'nejchudší země emigraci zakazují', 'lidé v nejchudších zemích o migraci nevědí'], answer: 0, explain: 'Migrace je investice: cesta, víza a začátky v cíli stojí peníze. Proto s růstem příjmů emigrace nejdřív roste (migrační přechod).' } },
          ],
        },
        {
          title: 'Ravenstein a gravitační model',
          icon: 'magnet',
          blocks: [
            { type: 'p', text: 'Už v roce 1885 sestavil Ernst Georg Ravenstein z britských sčítání lidu „zákony migrace“. Byly to první popsané pravidelnosti v pohybu obyvatel a mnohé platí dodnes. Obrázek je shrnuje spolu s modelem, který z nich později vyrostl:' },
            { type: 'diagram', id: 'migration-models', caption: 'Ravensteinovy zákony (1885) a gravitační model: tok roste s velikostí míst a klesá se vzdáleností.' },
            { type: 'p', text: 'Nejdůležitější Ravensteinovy zákony v kostce:' },
            { type: 'list', items: [
              'většina migrantů se stěhuje jen na krátkou vzdálenost',
              'migrace probíhá po etapách (**etapová migrace**): z vesnice do menšího města, odtud do velkoměsta',
              'kdo jde daleko, míří obvykle do velkých obchodních a průmyslových center',
              'každý migrační proud má svůj **protiproud**',
              'venkované migrují víc než obyvatelé měst',
              'na krátkou vzdálenost se stěhují spíš ženy, za hranice spíš muži',
            ] },
            { type: 'p', text: 'První zákon se dá zapsat vzorcem. **Gravitační model** si půjčuje myšlenku z Newtonova gravitačního zákona: dvě velká a blízká místa si vymění hodně lidí, malá a vzdálená málo.' },
            { type: 'formula', text: 'M = k · P_{1} · P_{2} / d^{2}', caption: 'M migrační tok, P_{1} a P_{2} počty obyvatel obou míst, d vzdálenost, k konstanta' },
            { type: 'p', text: 'Konstantu k neznáme, ale nepotřebujeme ji, když porovnáváme dva toky ze stejného místa. Vyzkoušej to na Praze:' },
            { type: 'example', title: 'Do Brna, nebo do Ostravy?', problem: 'Praha má 1,40 mil. obyvatel, Brno 0,40 mil. a Ostrava 0,28 mil. (ČSÚ, 2025). Vzdušnou čarou je z Prahy do Brna asi 185 km, do Ostravy asi 280 km. Kolikrát větší tok lidí předpovídá gravitační model mezi Prahou a Brnem než mezi Prahou a Ostravou?', steps: [
              'Poměr toků: M_{B} : M_{O} = (P_{B} / d_{B}^{2}) : (P_{O} / d_{O}^{2}). Konstanta k i počet obyvatel Prahy se zkrátí, protože jsou v obou tocích stejné.',
              'Brno: 0,40 : 185^{2} = 0,40 : 34 225 ≐ 1,17 · 10^{−5}',
              'Ostrava: 0,28 : 280^{2} = 0,28 : 78 400 ≐ 3,57 · 10^{−6}',
              'Poměr: 1,17 · 10^{−5} : 3,57 · 10^{−6} ≐ 3,3',
            ], answer: 'Model předpovídá mezi Prahou a Brnem asi 3,3krát větší tok. Brno je větší i bližší, a vzdálenost se počítá na druhou.' },
            { type: 'p', text: 'Pozor, model je jen první odhad. Skutečný tok ovlivní i jazyk, hranice, cena bydlení nebo dálnice, proto se místo kilometrů často dosazuje doba nebo cena cesty. A migrační sítě umějí vzdálenost „přeskočit“ – z Hanoje do Prahy je přes 8 000 km. Teď víme, kudy a proč lidé jdou. Co ale migrace přináší zemím, odkud odcházejí?' },
            { type: 'check', question: { kind: 'number', q: 'Město A i město B mají po 200 000 obyvatelích. Město A leží 50 km od velkoměsta, město B 100 km. Kolikrát větší tok do velkoměsta předpovídá gravitační model pro město A?', answer: 4, tolerance: 0, explain: 'Velikosti jsou stejné a vzdálenost je poloviční. Tok je nepřímo úměrný druhé mocnině vzdálenosti: (100 : 50)^{2} = 4.' } },
          ],
        },
        {
          title: 'Remitence a odliv mozků',
          icon: 'coin',
          blocks: [
            { type: 'p', text: 'Migranti nemění jen cílové země. Většina z nich posílá část výdělku rodinám domů. Těmto platbám se říká **remitence** a pro mnoho států jsou důležitější než zahraniční investice nebo rozvojová pomoc.' },
            { type: 'p', text: 'Podívej se, kolik peněz takto putuje a kde tvoří velký kus celé ekonomiky:' },
            { type: 'table', headers: ['ukazatel (2024)', 'hodnota'], rows: [
              ['remitence do zemí s nízkými a středními příjmy', 'asi 685 mld. USD – víc než přímé zahraniční investice a oficiální rozvojová pomoc dohromady'],
              ['největší příjemce', 'Indie, asi 129 mld. USD'],
              ['další velcí příjemci', 'Mexiko asi 68 mld., Čína asi 48 mld. USD'],
              ['největší podíl na HDP', 'Tádžikistán, asi 45 % HDP (hlavně výdělky z Ruska)'],
            ], caption: 'Odhady Světové banky pro rok 2024 (Migration and Development Brief, prosinec 2024).' },
            { type: 'p', text: 'Remitence jdou přímo domácnostem: na jídlo, školné, léky a stavbu domu. Ještě důležitější je ale, kdo odchází. Když odcházejí vzdělaní lidé, mluvíme o **odlivu mozků** (*brain drain*). Porovnej, co migrace zemi původu přináší a co jí bere:' },
            { type: 'compare', columns: [
              { title: 'Přínosy pro zemi původu', icon: 'check', tone: 'good', points: ['remitence zvyšují příjmy a spotřebu rodin', 'menší nezaměstnanost doma', 'návrat lidí s novými dovednostmi a kontakty (**cirkulace mozků**)', 'diaspora investuje a zakládá firmy doma (indický IT průmysl)'] },
              { title: 'Ztráty pro zemi původu', icon: 'cross', tone: 'bad', points: ['odchod lékařů, sester a inženýrů, do jejichž studia stát investoval', 'stárnutí vylidněných regionů (venkov Moldavska nebo Bulharska)', 'závislost na remitencích: když v cíli přijde krize, příjmy doma prudce klesnou', 'rodiny rozdělené na roky'] },
            ] },
            { type: 'p', text: 'Odliv mozků se týká i Česka: čeští lékaři a sestry odcházejí za vyššími platy do Německa a Rakouska. Zároveň Česko láká odborníky z Ukrajiny, Slovenska nebo Indie, takže pro ně je to **zisk mozků** (*brain gain*). Česko je přitom jen malá část regionu, kam míří obzvlášť mnoho migrantů: Evropy.' },
            { type: 'check', question: { kind: 'multi', q: 'Co platí o remitencích?', options: ['jsou to peníze, které migranti posílají rodinám domů', 'do zemí s nízkými a středními příjmy jich v roce 2024 přišlo asi 685 mld. USD', 'v Tádžikistánu tvoří asi 45 % HDP', 'platí je cílová země zemi původu za pracovníky', 'nejvíc jich dostávají Spojené státy'], answers: [0, 1, 2], explain: 'Remitence posílají sami migranti, ne státy. Největším příjemcem je Indie; USA jsou naopak zemí, odkud remitence nejvíc odcházejí.' } },
          ],
        },
        {
          title: 'Migrace do Evropy',
          icon: 'ship',
          blocks: [
            { type: 'p', text: 'Evropa je stárnoucí světadíl hned vedle mladé a rychle rostoucí Afriky a neklidného Blízkého východu. Většina migrantů do EU přichází legálně: za prací, studiem a za rodinou. Největší pozornost ale budí nelegální přechody hranice.' },
            { type: 'p', text: 'Na mapě sleduj hlavní trasy z Afriky. Všimni si uzlu Agadez v Nigeru, kterým vede cesta přes Saharu:' },
            { type: 'map', view: 'africa', routes: [
              { points: [{ lat: 16.97, lon: 7.99 }, { lat: 32.9, lon: 13.18 }, { lat: 35.5, lon: 12.6 }], label: 'centrální středomořská trasa', tone: 'a', arrow: true },
              { points: [{ lat: 14.69, lon: -17.45 }, { lat: 20.9, lon: -17.05 }, { lat: 28.1, lon: -15.4 }], label: 'západoafrická (atlantická) trasa', tone: 'b', arrow: true },
              { points: [{ lat: 35.17, lon: -2.93 }, { lat: 36.84, lon: -2.46 }], label: 'západní středomořská trasa', tone: 'c', arrow: true },
            ], points: [
              { lat: 16.97, lon: 7.99, label: 'Agadez', kind: 'city' },
              { lat: 35.5, lon: 12.6, label: 'Lampedusa', kind: 'place' },
              { lat: 28.1, lon: -15.4, label: 'Kanárské ostrovy', kind: 'place' },
            ], caption: 'Hlavní trasy nelegální migrace z Afriky do EU. V roce 2025 zaznamenal Frontex asi 178 000 nelegálních přechodů vnějších hranic EU, o 26 % méně než v roce 2024; přes třetinu (asi 66 000) připadla na centrální středomořskou trasu, západoafrická trasa klesla asi o 60 %.' },
            { type: 'p', text: 'Čísla se rok od roku prudce mění podle dohod EU s Tureckem, Libyí, Tuniskem nebo Mauritánií: jedna trasa se uzavře a jinde se otevře. Pro srovnání: v roce 2015 připlulo do Evropy přes milion lidí. A přes milion lidí přišlo i v roce 2022 – z Ukrajiny, a to legálně. Pravidla shrnují tři pojmy:' },
            { type: 'keyterms', items: [
              { term: '**Schengenský prostor**', def: '29 států bez kontrol na vnitřních hranicích; od ledna 2025 plně i Bulharsko a Rumunsko' },
              { term: '**Dočasná ochrana**', def: 'zvláštní status pro lidi prchající z Ukrajiny od roku 2022; v červenci 2026 ji v EU mělo asi 4,4 milionu lidí, v Česku asi 395 tisíc (Eurostat)' },
              { term: '**Pakt o migraci a azylu**', def: 'nová pravidla EU platná od 12. června 2026: rychlejší řízení na vnějších hranicích a povinná solidarita – stát buď přijme část žadatelů, nebo přispěje penězi' },
            ] },
            { type: 'p', text: 'Migrace tedy Evropu mění, ale nejvíc mění místa, kam lidé na celém světě míří úplně nejčastěji: města. Jak se proměňují, uvidíme v lekci „Urbanizace a město 21. století“.' },
            { type: 'check', question: { kind: 'tf', q: 'Většina migrantů přichází do EU nelegálně přes Středozemní moře.', answer: false, explain: 'Nelegálních přechodů bylo v roce 2025 asi 178 000, legálně (za prací, studiem, k rodině nebo s dočasnou ochranou) přicházejí ročně miliony lidí.' } },
          ],
        },
      ],
      summary: [
        'V roce 2024 žilo mimo zemi narození 304 milionů lidí (3,7 % lidstva); nejvíc v USA, Německu a Saúdské Arábii.',
        'Leeův model push–pull doplňuje překážky mezi místy a osobní faktory; přehlíží ale strukturální příčiny a migrační sítě.',
        'Podle Ravensteina se většina lidí stěhuje na krátkou vzdálenost, po etapách a každý proud má protiproud.',
        'Gravitační model: tok roste se součinem velikostí míst a klesá s druhou mocninou vzdálenosti.',
        'Remitence do zemí s nízkými a středními příjmy dosáhly v roce 2024 asi 685 mld. USD; odliv mozků bere zemím původu vzdělané lidi.',
        'Většina migrantů přichází do EU legálně; nelegálních přechodů bylo v roce 2025 asi 178 000, nejvíc přes centrální Středomoří.',
      ],
      quiz: [
        { kind: 'tf', q: 'Podle Ravensteina se většina migrantů stěhuje jen na krátkou vzdálenost.', answer: true, explain: 'To je první a nejznámější Ravensteinův zákon. Na něj navazuje gravitační model: tok s rostoucí vzdáleností klesá.' },
        { kind: 'choice', q: 'Co do modelu push–pull přidal Everett Lee?', options: ['překážky mezi místy a osobní faktory migranta', 'remitence', 'gravitační konstantu', 'dočasnou ochranu'], answer: 0, explain: 'Lee ukázal, že mezi výchozím místem a cílem stojí překážky (vzdálenost, cena, hranice) a že každý člověk faktory hodnotí jinak.' },
        { kind: 'number', q: 'Město s 300 000 obyvateli leží 60 km od metropole, město se 150 000 obyvateli 30 km. Kolikrát větší tok do metropole předpovídá gravitační model pro menší město?', answer: 2, tolerance: 0, explain: '(150 000 : 30^{2}) : (300 000 : 60^{2}) = 166,7 : 83,3 = 2. Poloviční velikost vyváží čtvrtinová druhá mocnina vzdálenosti.' },
        { kind: 'match', q: 'Přiřaď pojem k jeho významu.', pairs: [
          ['remitence', 'peníze posílané migranty domů'],
          ['odliv mozků', 'odchod vzdělaných lidí ze země'],
          ['migrační síť', 'příbuzní a známí, kteří migrantovi pomohou v cíli'],
          ['protiproud', 'pohyb v opačném směru než hlavní migrační proud'],
        ], explain: 'Všechny čtyři pojmy popisují, jak migrace funguje: proud a protiproud, sítě, které ji usnadňují, a dopady na zemi původu.' },
        { kind: 'choice', q: 'Proč má pyramida Spojených arabských emirátů velký výběžek mužů ve věku 20–44 let?', options: ['přicházejí sem pracovní migranti, hlavně muži', 'v Emirátech se rodí víc chlapců než jinde', 'ženy se z Emirátů hromadně vystěhovaly', 'je to stopa po válce'], answer: 0, explain: 'Většinu obyvatel tvoří přistěhovalci za prací, převážně muži z jižní Asie. Pyramidu tak tvaruje migrace, ne porodnost.' },
        { kind: 'tf', q: 'Odliv mozků se týká jen nejchudších zemí světa.', answer: false, explain: 'Týká se i Česka: lékaři a sestry odcházejí za vyššími platy do Německa a Rakouska.' },
        { kind: 'multi', q: 'Které jsou meze gravitačního modelu?', options: ['nepočítá s jazykem a hranicemi', 'vzdálenost v kilometrech nevystihuje cenu a dobu cesty', 'přehlíží migrační sítě', 'počítá s tím, že větší místa přitahují víc migrantů', 'zahrnuje vzdálenost mezi místy'], answers: [0, 1, 2], explain: 'Model je jednoduchý: zná jen velikost a vzdálenost. Jazyk, hranice, cena cesty a sítě tok mění. Velikost a vzdálenost jsou naopak jeho podstata.' },
        { kind: 'choice', q: 'Která trasa nelegální migrace do EU byla v roce 2025 nejvytíženější?', options: ['centrální středomořská (z Libye a Tuniska do Itálie)', 'západoafrická na Kanárské ostrovy', 'přes Arktidu', 'přes Bospor do Ruska'], answer: 0, explain: 'Podle Frontexu připadla na centrální Středomoří přes třetina nelegálních přechodů (asi 66 000), západoafrická trasa naopak klesla asi o 60 %.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-3
    'z11-3': {
      id: 'z11-3',
      title: 'Urbanizace a město 21. století',
      goals: [
        'Popsat urbanizační křivku a její fáze a vysvětlit, proč ji regiony procházejí v různé době',
        'Porovnat modely vnitřní struktury města (Burgess, Hoyt, Harris–Ullman) a jejich meze',
        'Vysvětlit gentrifikaci a vznik neformálních sídel a zhodnotit způsoby jejich řešení',
        'Posoudit koncepty chytrého a udržitelného města',
      ],
      hook: 'Karlín byl v roce 2002 pod vodou a byty v něm skoro nikdo nechtěl. O dvacet let později patří k nejdražším čtvrtím Prahy. Co se stalo – a kdo na tom vydělal?',
      sections: [
        {
          title: 'Urbanizační křivka',
          icon: 'chart',
          blocks: [
            { type: 'p', text: 'V lekci „Sídla a města“ jsme urbanizaci definovali jako růst podílu obyvatel měst a poznali její stadia od urbanizace po reurbanizaci. Když podíl městského obyvatelstva vyneseme do grafu v čase, dostaneme typický tvar nataženého písmene S – **urbanizační křivku**.' },
            { type: 'p', text: 'Porovnej v grafu svět, Evropu a Afriku. Sleduj, kde je která křivka nejstrmější:' },
            { type: 'graph', x: { label: 'rok', min: 1950, max: 2050, step: 25 }, y: { label: 'podíl obyvatel měst', unit: '%', min: 0, max: 100, step: 20 },
              series: [
                { label: 'Evropa', points: [[1950, 51.7], [2018, 74.5], [2050, 83.7]], style: 'smooth', tone: 'a' },
                { label: 'svět', points: [[1950, 29.6], [1990, 43.0], [2018, 55.3], [2030, 60.4], [2050, 68.4]], style: 'smooth', tone: 'b' },
                { label: 'Afrika', points: [[1950, 14.3], [2018, 42.5], [2050, 58.9]], style: 'smooth', tone: 'c' },
              ],
              marks: [{ x: 2018, label: 'od 2018 projekce' }],
              caption: 'Podíl obyvatel měst podle národních definic (UN World Urbanization Prospects 2018). Nová revize WUP 2025 počítá jednotnou metodou a dělí lidstvo jinak: 45 % ve městech, 36 % v menších městech a městečkách, 19 % na venkově.' },
            { type: 'p', text: 'Křivka má tři úseky. V **počáteční fázi** žije ve městech asi do čtvrtiny lidí a podíl roste pomalu. Ve **zrychlené fázi** se lidé stěhují z venkova za prací v průmyslu a službách a podíl stoupá nejrychleji – tam je dnes Afrika a jižní Asie. V **závěrečné fázi**, nad asi 75 %, se křivka zplošťuje, protože na venkově už zbývá málo lidí – tam je Evropa.' },
            { type: 'p', text: 'Pozor na dvě pasti. Evropa urbanizací prošla za 150 let spolu s průmyslem, dnešní Afrika rychleji a často bez něj: lidé přicházejí do měst, která jim nedokážou nabídnout práci ani bydlení (**urbanizace bez industrializace**). A podíl obyvatel měst závisí na tom, co stát za město považuje – v Japonsku obec od 50 000 obyvatel, v Dánsku sídlo od 200 obyvatel. Proto OSN v roce 2025 zavedla jednotnou metodu.' },
            { type: 'p', text: 'Víme tedy, kolik lidí ve městech žije. Teď se podíváme dovnitř: jak je město uspořádané a proč.' },
            { type: 'check', question: { kind: 'choice', q: 'Ve které fázi urbanizační křivky roste podíl obyvatel měst nejrychleji?', options: ['ve zrychlené fázi', 'v počáteční fázi', 'v závěrečné fázi', 've všech stejně'], answer: 0, explain: 'Ve zrychlené fázi odchází z venkova nejvíc lidí za prací do měst. V závěrečné fázi už na venkově mnoho lidí nezbývá a křivka se zplošťuje.' } },
          ],
        },
        {
          title: 'Modely vnitřní struktury města',
          icon: 'city',
          blocks: [
            { type: 'p', text: 'Když se na velké město podíváš z letadla, nevypadá jako náhodná změť. Obchody, továrny a různé typy bydlení tvoří pásy a čtvrti. Američtí sociologové, ekonomové a geografové (první z nich z Chicaga) se v první polovině 20. století pokusili najít pravidla a vznikly tři klasické modely.' },
            { type: 'p', text: 'Prohlédni si je vedle sebe a u každého si všimni, co tvoří hlavní uspořádání: kruhy, výseče, nebo několik jader.' },
            { type: 'diagram', id: 'urban-models', caption: 'Burgessův model soustředných zón (1925), Hoytův sektorový model (1939) a model mnoha jader (Harris–Ullman, 1945).' },
            { type: 'p', text: 'Za všemi modely stojí stejná logika jako za cenou pozemků: centrum je nejdostupnější, a proto nejdražší. Kdo potřebuje zákazníky (obchod, banky), zaplatí nejvíc; kdo potřebuje hodně místa (průmysl, rodinné domy), jde dál. Liší se tím, co dalšího vysvětlují:' },
            { type: 'table', headers: ['model', 'hlavní myšlenka', 'co vysvětlí'], rows: [
              ['Burgess (1925)', 'soustředné zóny: centrální obchodní čtvrť (CBD), přechodná zóna, dělnické bydlení, bydlení středních vrstev, zóna dojíždějících', 'jak město roste ven a jak nově příchozí postupně nahrazují ty, kdo se stěhují dál (invaze a sukcese)'],
              ['Hoyt (1939)', 'výseče podél dopravních os: továrny podél železnice a řeky, bohaté bydlení podél nejpříjemnějších směrů', 'proč se dělnické i bohaté čtvrti táhnou od centra jedním směrem'],
              ['Harris–Ullman (1945)', 'několik jader: vedle CBD i průmyslová, obchodní a univerzitní centra', 'velká města s auty a předměstími, kde je víc center'],
            ] },
            { type: 'p', text: 'Každý model vystihuje kus pravdy o americkém městě první poloviny 20. století. Jak dobře ale sedí na Prahu nebo na Bombaj?' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď model k jeho hlavní myšlence.', pairs: [
              ['Burgess', 'soustředné zóny kolem CBD'],
              ['Hoyt', 'výseče podél dopravních os'],
              ['Harris–Ullman', 'několik center (jader) v jednom městě'],
            ], explain: 'Burgess kreslí kruhy, Hoyt výseče a Harris s Ullmanem více jader – každý model reaguje na slabinu předchozího.' } },
          ],
        },
        {
          title: 'Meze modelů: jiná města, jiné uspořádání',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Klasické modely vznikly ve městech, která rostla rychle, na volné rovině a podle trhu s pozemky. Evropská města mají staletí staré jádro a socialistická města stavěla podle plánu, ne podle ceny pozemků. Porovnej tři typy měst:' },
            { type: 'compare', columns: [
              { title: 'Severoamerické město', icon: 'car', tone: 'a', points: ['CBD s mrakodrapy, kde skoro nikdo nebydlí', 'vnitřní město často chudé, střední vrstvy na předměstích', 'rozlehlá předměstí závislá na autu (*urban sprawl*)'] },
              { title: 'Evropské a české město', icon: 'castle', tone: 'b', points: ['historické jádro s památkami, hustá zástavba; bohatí bydlí i v centru', 'sídliště na okraji: v Praze Jižní Město nebo Černý Most', 'od 90. let suburbanizace do satelitních obcí'] },
              { title: 'Město v rozvojové zemi', icon: 'tent', tone: 'c', points: ['moderní centrum a bohaté čtvrti podél jedné osy (Griffinův–Fordův model latinskoamerického města)', 'neformální čtvrti na okraji a na nebezpečných svazích', 'chudí bydlí na okraji – opak Burgessova modelu'] },
            ] },
            { type: 'p', text: 'Odtud plynou hlavní výtky: modely jsou statické, přehlížejí přírodní podmínky (řeky, svahy), politiku a územní plánování. Dnešní metropoli s nákupními centry u dálnic a prací z domova nepopisuje přesně žádný z nich. Přesto se pořád používají – jako měřítko, se kterým porovnáváme skutečnost.' },
            { type: 'p', text: 'Uspořádání města se navíc mění i zevnitř, čtvrť po čtvrti. Jeden takový proces mění tvář Prahy, Berlína i New Yorku.' },
            { type: 'check', question: { kind: 'tf', q: 'V Praze, stejně jako v Burgessově modelu, bydlí nejchudší lidé hlavně v historickém centru.', answer: false, explain: 'Historické centrum Prahy patří k nejdražším místům k bydlení. Evropská města mají často opačné uspořádání než Burgessův model: bohaté centrum a sídliště na okraji.' } },
          ],
        },
        {
          title: 'Gentrifikace',
          icon: 'house',
          blocks: [
            { type: 'p', text: '**Gentrifikace** je proměna zchátralé vnitroměstské čtvrti, do které se stěhují lidé s vyššími příjmy, rostou nájmy a původní obyvatelé odcházejí. Slovo zavedla britská socioložka Ruth Glassová v roce 1964 podle anglického *gentry*, drobné šlechty. Průběh má typické kroky:' },
            { type: 'diagram', id: 'gentrification', caption: 'Gentrifikace ve čtyřech krocích: úpadek, umělci a studenti, renovace a kavárny, vysoké nájmy a vytlačení původních obyvatel.' },
            { type: 'p', text: 'V Praze to ukazuje Karlín: po povodni v roce 2002 byly domy levné, přišli developeři, kanceláře a kavárny a ceny bytů dnes patří k nejvyšším ve městě. Podobně Holešovice, Kreuzberg v Berlíně nebo Brooklyn v New Yorku. Gentrifikace má vítěze i poražené:' },
            { type: 'compare', columns: [
              { title: 'Přínosy', icon: 'check', tone: 'good', points: ['opravené domy a ulice, méně kriminality', 'noví obyvatelé, obchody a pracovní místa', 'vyšší daňové příjmy města'] },
              { title: 'Problémy', icon: 'cross', tone: 'bad', points: ['rostoucí nájmy vytlačí původní obyvatele, často seniory', 'čtvrť ztrácí původní ráz a komunitu', 'krátkodobé pronájmy turistům ubírají byty místním (centrum Prahy, Barcelona)'] },
            ] },
            { type: 'p', text: 'Gentrifikace je problémem bohatých měst, kde je o byty v centru zájem. V rychle rostoucích městech rozvojových zemí řeší lidé jinou otázku: kde vůbec bydlet.' },
            { type: 'check', question: { kind: 'choice', q: 'Co je typickým důsledkem gentrifikace?', options: ['růst nájmů a odchod původních obyvatel', 'pokles cen bytů ve čtvrti', 'stěhování těžkého průmyslu do centra', 'vznik neformálních sídel'], answer: 0, explain: 'Do čtvrti přicházejí lidé s vyššími příjmy a investoři, ceny a nájmy rostou a původní obyvatelé si bydlení přestávají moci dovolit.' } },
          ],
        },
        {
          title: 'Neformální sídla',
          icon: 'tent',
          blocks: [
            { type: 'p', text: 'Když do města přichází víc lidí, než kolik pro ně stihne vzniknout bytů, staví si obydlí sami – na cizí půdě, bez povolení, často bez vody. Takové čtvrti OSN nazývá **neformální sídla**, chudé a přelidněné čtvrti obecně **slumy**. Žije v nich přes 1,1 miliardy lidí (UN-Habitat).' },
            { type: 'p', text: 'Najdi na mapě několik nejznámějších. Leží v Asii, Africe i Latinské Americe a mají různá jména – favela, basti, katchi abadi:' },
            { type: 'map', view: 'world', points: [
              { lat: 19.04, lon: 72.85, label: 'Dháravi (Bombaj)', kind: 'place' },
              { lat: 24.95, lon: 67.0, label: 'Orangi (Karáčí)', kind: 'place' },
              { lat: -1.31, lon: 36.79, label: 'Kibera (Nairobi)', kind: 'place' },
              { lat: 6.5, lon: 3.39, label: 'Makoko (Lagos)', kind: 'place' },
              { lat: -22.99, lon: -43.25, label: 'Rocinha (Rio de Janeiro)', kind: 'place' },
            ], caption: 'Velká neformální sídla. Přesné počty jejich obyvatel nikdo nezná, protože se v nich řádně nesčítá.' },
            { type: 'p', text: 'UN-Habitat počítá domácnost mezi obyvatele slumu, když jí chybí aspoň jedna z pěti věcí. Právě ty ukazují, co je potřeba zlepšit:' },
            { type: 'iconlist', items: [
              { icon: 'water-tap', title: 'Nezávadná voda', text: 'dostatek pitné vody bez dlouhých cest' },
              { icon: 'soap', title: 'Hygienické zařízení', text: 'toaleta, kterou nesdílí příliš mnoho domácností' },
              { icon: 'house', title: 'Pevný dům', text: 'odolná stavba na bezpečném místě' },
              { icon: 'people', title: 'Dost místa', text: 'nejvýš tři lidé na jednu obytnou místnost' },
              { icon: 'clipboard', title: 'Jistota bydlení', text: 'ochrana před vystěhováním' },
            ] },
            { type: 'p', text: 'Dřív města slumy často bourala; lidé se pak jen přestěhovali jinam. Dnes se víc osvědčuje **zlepšování na místě**: legalizovat pozemky, dovést vodu, kanalizaci a elektřinu, zpevnit cesty. Kolumbijský Medellín propojil chudé čtvrti na svazích s centrem lanovkou a venkovními eskalátory. Pozor na stereotyp: slumy nejsou jen místa beznaděje, ale i drobného podnikání – v Dháravi pracují tisíce dílen.' },
            { type: 'p', text: 'Slumy ukazují, co se stane, když město roste rychleji, než stihne plánovat. Opačný přístup slibují chytrá a udržitelná města.' },
            { type: 'check', question: { kind: 'multi', q: 'Co podle UN-Habitat patří mezi znaky slumu?', options: ['chybí nezávadná voda', 'chybí jistota, že obyvatele nevystěhují', 'v jedné místnosti žije příliš mnoho lidí', 'leží vždy v centru města', 'obyvatelé nemají žádnou práci'], answers: [0, 1, 2], explain: 'Pět znaků: voda, hygiena, pevný dům, dost místa a jistota bydlení. Slumy leží často na okraji a jejich obyvatelé většinou pracují, i když neformálně.' } },
          ],
        },
        {
          title: 'Chytré a udržitelné město',
          icon: 'bulb',
          blocks: [
            { type: 'p', text: 'Města zabírají jen pár procent souše, ale spotřebují většinu energie a vypouštějí většinu emisí skleníkových plynů. Jak zařídit, aby se v nich dobře žilo a zároveň méně zatěžovala planetu? Tady jsou hlavní nástroje, které se navzájem doplňují:' },
            { type: 'iconlist', items: [
              { icon: 'phone', title: 'Chytré město (smart city)', text: 'senzory a data řídí semafory, osvětlení, parkování a svoz odpadu; Singapur, Barcelona' },
              { icon: 'train', title: 'Veřejná doprava a kola', text: 'kvalitní MHD, cyklostezky a pěší zóny snižují počet aut' },
              { icon: 'tree', title: 'Zeleň a voda proti horku', text: 'stromy, zelené střechy a vodní plochy zmírňují tepelný ostrov města' },
              { icon: 'pin', title: 'Patnáctiminutové město', text: 'škola, obchod, lékař i park do 15 minut pěšky nebo na kole; Paříž' },
              { icon: 'recycle', title: 'Oběhové hospodářství', text: 'třídění, opravy, sdílení věcí a znovuvyužití vody' },
            ] },
            { type: 'p', text: 'Pozor na past: technologie sama město udržitelným neudělá. Senzory nepomohou, když se dál staví předměstí závislá na autu. Chytrá města navíc sbírají spoustu dat o lidech, a tak otevírají otázku soukromí a toho, kdo data vlastní. Rozhoduje územní plánování: husté město se smíšenými funkcemi a dobrou MHD.' },
            { type: 'p', text: 'Města ale rostou na úkor venkova – berou mu lidi, půdu i peníze. Co se mezitím děje na venkově a na polích, která města živí, probereme v lekci „Venkov a zemědělství“.' },
            { type: 'check', question: { kind: 'tf', q: 'Patnáctiminutové město znamená, že každý obyvatel dojede autem do centra za 15 minut.', answer: false, explain: 'Jde o opak: vše potřebné má být do 15 minut pěšky nebo na kole v okolí bydliště, takže auto není potřeba.' } },
          ],
        },
      ],
      summary: [
        'Urbanizační křivka má tvar písmene S s počáteční, zrychlenou a závěrečnou fází; Evropa je v závěrečné, Afrika ve zrychlené.',
        'Afrika se urbanizuje rychleji než kdysi Evropa a často bez průmyslu; podíl obyvatel měst závisí i na definici města.',
        'Burgess popsal soustředné zóny, Hoyt sektory podél dopravních os a Harris s Ullmanem město s více jádry.',
        'Klasické modely vznikly v amerických městech; evropská města mají bohaté historické jádro a sídliště na okraji, města rozvojových zemí chudý okraj.',
        'Gentrifikace opraví čtvrť, ale zvedne nájmy a vytlačí původní obyvatele (Karlín, Kreuzberg).',
        'V neformálních sídlech žije přes 1,1 miliardy lidí; osvědčuje se zlepšování na místě místo bourání.',
        'Chytré a udržitelné město stojí na hustém plánování, MHD, zeleni a datech – a otevírá otázku soukromí.',
      ],
      quiz: [
        { kind: 'tf', q: 'Urbanizační křivka má tvar nataženého písmene S.', answer: true, explain: 'Podíl obyvatel měst roste nejdřív pomalu, pak rychle a nakonec se ustálí – proto tvar S.' },
        { kind: 'choice', q: 'Který model vysvětlí, proč se bohaté čtvrti táhnou od centra jedním směrem?', options: ['Hoytův sektorový model', 'Burgessův model soustředných zón', 'model mnoha jader', 'von Thünenův model'], answer: 0, explain: 'Hoyt ukázal, že čtvrti rostou ve výsečích podél dopravních os a atraktivních směrů.' },
        { kind: 'order', q: 'Seřaď kroky gentrifikace.', items: ['úpadek čtvrti a levné byty', 'příchod umělců a studentů', 'renovace domů a nové kavárny', 'vysoké nájmy a odchod původních obyvatel'], explain: 'Levné nájmy přilákají umělce, za nimi přijdou investoři a lidé s vyššími příjmy a ceny vyrostou.' },
        { kind: 'multi', q: 'Proč Burgessův model špatně sedí na Prahu?', options: ['Praha má historické jádro, kde bydlí i bohatí', 'sídliště stojí na okraji města', 'město rostlo staletí, ne pár desetiletí na volné rovině', 'Praha nemá žádné centrum', 'v Praze nejsou obchody'], answers: [0, 1, 2], explain: 'Burgess modeloval rychle rostoucí Chicago. Praha má staré bohaté jádro a socialistická sídliště na okraji.' },
        { kind: 'number', q: 'Ve státě žilo v roce 1990 ve městech 6 milionů z 15 milionů obyvatel, v roce 2025 to bylo 18 milionů z 30 milionů. O kolik procentních bodů vzrostl podíl obyvatel měst?', answer: 20, tolerance: 0, unit: 'p. b.', explain: '6 : 15 = 40 %, 18 : 30 = 60 %. Podíl vzrostl o 20 procentních bodů.' },
        { kind: 'tf', q: 'Obyvatelé slumů nemají žádnou práci ani podnikání.', answer: false, explain: 'Většina pracuje, často v neformální ekonomice. V Dháravi v Bombaji fungují tisíce dílen.' },
        { kind: 'choice', q: 'Co je hlavní riziko „chytrého města“?', options: ['sběr dat o obyvatelích a otázka soukromí', 'příliš mnoho zeleně', 'nedostatek semaforů', 'zákaz veřejné dopravy'], answer: 0, explain: 'Senzory a kamery sbírají data o pohybu lidí. Kdo je vlastní a jak je chrání, je klíčová otázka.' },
        { kind: 'choice', q: 'Proč nelze jednoduše porovnat podíl obyvatel měst Japonska a Dánska podle národních statistik?', options: ['každý stát definuje město jinak', 'v Dánsku nejsou města', 'Japonsko nesčítá obyvatele', 'oba státy mají přesně stejný podíl'], answer: 0, explain: 'Japonsko počítá za město obec od 50 000 obyvatel, Dánsko sídlo od 200 obyvatel. Proto OSN v roce 2025 zavedla jednotnou metodu.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-4
    'z11-4': {
      id: 'z11-4',
      title: 'Venkov a zemědělství',
      goals: [
        'Popsat, jak se mění venkov v Česku a ve světě (suburbanizace, vylidňování periferií, druhé bydlení)',
        'Třídit zemědělské soustavy podle vstupů, cíle a produkce',
        'Vysvětlit von Thünenův model, spočítat rentu z polohy a zhodnotit meze modelu',
        'Posoudit přínosy a náklady zelené revoluce a vysvětlit čtyři pilíře potravinové bezpečnosti',
      ],
      hook: 'V polovině 60. let hrozil Indii hladomor a odborníci psali, že miliony lidí zemřou hlady. O sedm let později sklízela Indie dvakrát víc pšenice. Za tou změnou stojí nová semena – a spousta vody, hnojiv a dluhů.',
      sections: [
        {
          title: 'Venkov se mění',
          icon: 'house',
          blocks: [
            { type: 'p', text: 'Města z lekce „Urbanizace a město 21. století“ rostou na úkor venkova. Venkov ale není jen „to, co zbude mimo města“. Má vlastní funkce: dává jídlo, dřevo a energii, chrání krajinu a vodu, lidé v něm bydlí i odpočívají. Jeho proměna jde v Česku dvěma opačnými směry.' },
            { type: 'p', text: 'Porovnej venkov v zázemí velkého města a venkov na periferii, daleko od center:' },
            { type: 'compare', columns: [
              { title: 'Venkov v zázemí měst', icon: 'house', tone: 'a', points: ['suburbanizace: noví obyvatelé z města, rodinné domy, satelitní obce (okolí Prahy a Brna)', 'roste počet obyvatel i ceny pozemků', 'přes den se vylidní – lidé dojíždějí do města', 'problémy: doprava, chybějící školy a školky'] },
              { title: 'Periferní venkov', icon: 'tractor', tone: 'b', points: ['odchod mladých za prací a studiem, stárnutí', 'zavírají se obchody, pošty a školy', 'pohraničí a vnitřní periferie na pomezí krajů, Jesenicko', 'šance: cestovní ruch, práce na dálku, místní produkty'] },
            ] },
            { type: 'p', text: 'Typicky českým jevem je **druhé bydlení** – chalupy a chaty; o víkendu tak některé horské obce mají víc obyvatel než ve všední den. Ve světě je obraz jiný: v rozvojových zemích počet lidí na venkově ještě roste a podle OSN (WUP 2025) začne celosvětově klesat až ve 40. letech 21. století.' },
            { type: 'p', text: 'Hlavní hospodářskou funkcí venkova ale zůstává zemědělství. A to se dá popsat jako systém.' },
            { type: 'check', question: { kind: 'choice', q: 'Co je typické pro venkov v zázemí velkého města?', options: ['suburbanizace a přírůstek obyvatel', 'odchod mladých lidí a zavírání škol', 'žádná dojížďka za prací', 'klesající ceny pozemků'], answer: 0, explain: 'Do obcí kolem velkých měst se stěhují lidé z města, kteří dál dojíždějí za prací. Vylidňování a zavírání služeb je typické pro periferie.' } },
          ],
        },
        {
          title: 'Zemědělské soustavy',
          icon: 'wheat',
          blocks: [
            { type: 'p', text: 'V lekci „Zemědělství a výživa světa“ jsi rozlišoval/a intenzivní a extenzivní zemědělství. Teď se na farmu podíváme jako na **systém**: má vstupy (půda, voda, práce, kapitál, osivo, hnojiva), procesy (orba, setí, sklizeň, chov) a výstupy (plodiny, maso, mléko – ale i eroze nebo znečištění vod).' },
            { type: 'p', text: 'Soustavy třídíme podle toho, kolik vstupů připadá na hektar, pro koho se vyrábí a co se vyrábí. Scény na obrázku ukazují hlavní typy:' },
            { type: 'diagram', id: 'farming-systems', caption: 'Intenzivní a extenzivní zemědělství, plantáž, kočovné pastevectví a žďárové (přesunné) zemědělství.' },
            { type: 'p', text: 'Podle toho, komu je produkce určena, rozlišujeme ještě další typy. Pozor, s intenzitou se nekryjí: samozásobitelské pěstování rýže v Asii je velmi intenzivní, protože do malého pole vkládá obrovské množství práce.' },
            { type: 'keyterms', items: [
              { term: '**Samozásobitelské zemědělství**', def: 'rodina pěstuje hlavně pro sebe; malá pole, ruční práce. Většina z asi 570 milionů farem světa je malá (FAO).' },
              { term: '**Komerční zemědělství**', def: 'výroba na prodej, specializace a stroje; od rodinných farem po obří agroholdingy' },
              { term: '**Smíšené zemědělství**', def: 'rostlinná i živočišná výroba na jedné farmě: krmivo z polí, hnůj zpět na pole; typické pro střední Evropu' },
              { term: '**Agrobyznys**', def: 'propojení farem s výrobou osiva a hnojiv, zpracováním a obchodem v rukou velkých firem' },
            ] },
            { type: 'p', text: 'Typ soustavy tedy určují vstupy a trh. Proč ale na jednom místě stojí sad a o pár desítek kilometrů dál pole obilí? Odpověď hledal už před dvěma stoletími jeden statkář z Meklenburska.' },
            { type: 'check', question: { kind: 'choice', q: 'Farma na Ukrajině má tisíce hektarů, moderní stroje a pěstuje pšenici na vývoz. O jaké zemědělství jde?', options: ['komerční', 'samozásobitelské', 'kočovné pastevectví', 'žďárové'], answer: 0, explain: 'Farma vyrábí na prodej do světa a investuje do strojů – je to komerční, extenzivně až středně intenzivně hospodařící podnik.' } },
          ],
        },
        {
          title: 'Von Thünenův model',
          icon: 'pin',
          blocks: [
            { type: 'p', text: 'Johann Heinrich von Thünen v roce 1826 v knize *Izolovaný stát* položil otázku: co se vyplatí pěstovat v jaké vzdálenosti od města, kde se úroda prodává? Představil si rovinu se všude stejnou půdou, jedno město s trhem a dopravu povozem, jejíž cena roste se vzdáleností.' },
            { type: 'p', text: 'Výsledkem jsou soustředné prstence. Sleduj v grafu nad nimi, jak se výnos každého využití půdy zmenšuje se vzdáleností:' },
            { type: 'diagram', id: 'von-thunen', caption: 'Von Thünenovy prstence: zahradnictví a mléko, les, obilí, chov dobytka. V každém prstenci vyhrává využití s nejvyšší rentou z polohy.' },
            { type: 'p', text: 'Klíčem je **renta z polohy**: zisk z hektaru po odečtení nákladů na výrobu i na dopravu. Proč je les tak blízko města? V 19. století bylo dřevo hlavní palivo i stavební materiál, je těžké a jeho doprava drahá. Rentu spočítáme jednoduchým vzorcem:' },
            { type: 'formula', text: 'R = V · (c − n) − V · f · d', caption: 'R renta z polohy (Kč/ha), V výnos (t/ha), c cena na trhu a n náklady výroby (Kč/t), f cena dopravy (Kč na tunu a km), d vzdálenost od trhu (km)' },
            { type: 'p', text: 'Použijme vzorec na dvě plodiny. Čísla jsou modelová, ale poměry odpovídají skutečnosti: zelenina dává vysoký výnos, ale její doprava je drahá, protože se kazí a je objemná.' },
            { type: 'example', title: 'Zelenina, nebo obilí?', problem: 'Zelenina: V = 20 t/ha, c − n = 2 000 Kč/t, f = 50 Kč na tunu a km. Obilí: V = 6 t/ha, c − n = 3 000 Kč/t, f = 10 Kč na tunu a km. Do jaké vzdálenosti od trhu se vyplatí pěstovat zeleninu?', steps: [
              'Zelenina: R = 20 · 2 000 − 20 · 50 · d = 40 000 − 1 000 · d (Kč/ha)',
              'Obilí: R = 6 · 3 000 − 6 · 10 · d = 18 000 − 60 · d (Kč/ha)',
              'Zelenina vyhrává, dokud má vyšší rentu: 40 000 − 1 000 · d > 18 000 − 60 · d',
              '22 000 > 940 · d, tedy d < 23,4 km',
            ], answer: 'Asi do 23 km od trhu se vyplatí zelenina, dál obilí. Obilí přestane vynášet až ve vzdálenosti 18 000 : 60 = 300 km.' },
            { type: 'p', text: 'Model je dnes nutné číst opatrně. Chlazené kamiony a letadla zlevnily dopravu natolik, že růže z Keni a borůvky z Peru se prodávají v Praze. Půda ani reliéf nejsou všude stejné, trhů je mnoho a o tom, co se pěstuje, spolurozhodují dotace EU. Logika „blízko trhu to, co se kazí a je drahé převážet“ ale platí dál: kolem měst najdeš zahradnictví, sady se samosběrem a farmy prodávající ze dvora.' },
            { type: 'p', text: 'Von Thünen vysvětloval, kde se co pěstuje. Ve 20. století ale vyvstala naléhavější otázka: dokáže svět vypěstovat dost pro rychle rostoucí lidstvo?' },
            { type: 'check', question: { kind: 'number', q: 'Renta z polohy pro výrobu mléka je R = 30 000 − 600 · d (Kč/ha, d v km). Do jaké vzdálenosti od trhu je výroba mléka ještě zisková?', answer: 50, tolerance: 0, unit: 'km', explain: 'Renta klesne na nulu, když 30 000 = 600 · d, tedy d = 50 km. Dál už doprava spolkne celý zisk.' } },
          ],
        },
        {
          title: 'Zelená revoluce',
          icon: 'seed',
          blocks: [
            { type: 'p', text: 'Od 40. do 70. let 20. století proběhla nejdřív v Mexiku a pak v Asii **zelená revoluce**: rychlý růst výnosů obilí díky novým odrůdám a moderním vstupům. Jejím symbolem je americký šlechtitel Norman Borlaug, který za ni v roce 1970 dostal Nobelovu cenu míru.' },
            { type: 'p', text: 'Zelená revoluce nebyla jedna věc, ale balíček, ve kterém každá část potřebuje ostatní:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'seed', title: 'Vysoce výnosné odrůdy', text: 'nízká stébla pšenice a rýže, která nepoléhají pod těžkým klasem' },
              { icon: 'dam', title: 'Zavlažování', text: 'nové odrůdy potřebují spolehlivou vodu: kanály, studny, čerpadla' },
              { icon: 'fertilizer', title: 'Průmyslová hnojiva', text: 'dusík a fosfor pro vysoké výnosy' },
              { icon: 'hazard', title: 'Pesticidy', text: 'ochrana před škůdci a plevelem' },
              { icon: 'wheat', title: 'Vyšší sklizně', text: 'Indie sklidila v roce 1972 přes 26 mil. t pšenice, v roce 1965 asi 12 mil. t' },
            ], caption: 'Balíček zelené revoluce. Bez vody a hnojiv nové odrůdy výnos nezvýší.' },
            { type: 'p', text: 'Výsledek byl ohromný: světové výnosy obilovin z hektaru se od roku 1961 zhruba ztrojnásobily (FAO) a velké hladomory v Asii ustaly. Zelená revoluce má ale i stinné stránky. Porovnej je:' },
            { type: 'compare', columns: [
              { title: 'Přínosy', icon: 'check', tone: 'good', points: ['vyšší výnosy a levnější jídlo', 'Indie a další státy Asie soběstačné v obilí', 'víc jídla z hektaru, takže nebylo potřeba kácet tolik lesů na nová pole'] },
              { title: 'Náklady', icon: 'cross', tone: 'bad', points: ['vyčerpaná podzemní voda a zasolené půdy (Paňdžáb)', 'znečištění vod hnojivy a pesticidy', 'ústup tradičních odrůd, menší rozmanitost plodin', 'z drahých vstupů měli užitek hlavně větší a bohatší zemědělci', 'subsaharskou Afriku skoro minula'] },
            ] },
            { type: 'p', text: 'Dnes se mluví o „dvojnásobně zelené“ revoluci: zvýšit výnosy a přitom šetřit vodu a půdu – šlechtěním odrůd odolných vůči suchu, přesným zemědělstvím nebo genovými úpravami. Jídla se tedy vypěstuje hodně. Proč přesto stovky milionů lidí hladovějí?' },
            { type: 'check', question: { kind: 'tf', q: 'Zelená revoluce zvýšila výnosy hlavně díky novým odrůdám, zavlažování a průmyslovým hnojivům.', answer: true, explain: 'Nové odrůdy daly vysoký výnos jen spolu se spolehlivou vodou, hnojivy a ochranou rostlin.' } },
          ],
        },
        {
          title: 'Potravinová bezpečnost',
          icon: 'bread',
          blocks: [
            { type: 'p', text: 'Podle FAO je **potravinová bezpečnost** stav, kdy mají všichni lidé vždy fyzický i ekonomický přístup k dostatku bezpečného a výživného jídla pro aktivní a zdravý život (Světový potravinový summit, 1996). Definice má čtyři pilíře a hlad vzniká, když selže kterýkoli z nich:' },
            { type: 'iconlist', items: [
              { icon: 'wheat', title: 'Dostupnost', text: 'jídlo existuje: produkce, zásoby, dovoz' },
              { icon: 'coin', title: 'Přístup', text: 'lidé si jídlo mohou koupit nebo vypěstovat; selhává při chudobě a vysokých cenách' },
              { icon: 'apple', title: 'Využití', text: 'pestrá strava, čistá voda a zdraví, aby tělo jídlo dokázalo využít' },
              { icon: 'calendar', title: 'Stabilita', text: 'všechno platí trvale, i při suchu, válce nebo skoku cen' },
            ] },
            { type: 'p', text: 'Jak je na tom svět? Zpráva agentur OSN o stavu potravinové bezpečnosti a výživy (SOFI 2026) přinesla tato čísla za rok 2025:' },
            { type: 'table', headers: ['ukazatel (2025)', 'hodnota'], rows: [
              ['podvyživení lidé na světě', 'asi 645 milionů (7,8 % lidstva); hlad ubývá třetí rok za sebou'],
              ['Afrika', 'asi 309 milionů, tedy zhruba každý pátý obyvatel'],
              ['Asie', 'asi 292 milionů'],
              ['potvrzený hladomor (IPC)', 'v srpnu 2025 v části Pásma Gazy, v listopadu 2025 v súdánských městech Al-Fášir a Kádugli'],
            ], caption: 'FAO, IFAD, UNICEF, WFP a WHO: The State of Food Security and Nutrition in the World 2026; IPC = mezinárodní klasifikace potravinové nouze.' },
            { type: 'p', text: 'Všimni si, že nejhorší hlad dnes nevzniká kvůli nedostatku jídla na planetě, ale kvůli válkám, které ničí pole i trhy a blokují pomoc – selhává přístup a stabilita. A Afrika už má víc hladovějících než Asie, i když v Asii žije mnohem víc lidí. Jak nasytit udržitelně 10 miliard lidí, rozebereme v lekci „Potraviny pro 10 miliard“.' },
            { type: 'p', text: 'Pole, vinice a rybníky ale nejsou jen ekonomika: formují vzhled krajiny i to, jak ji lidé vnímají. Tím se zabývá lekce „Kultura a identita míst“.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď situaci k pilíři potravinové bezpečnosti, který v ní selhává.', pairs: [
              ['sucho zničí úrodu v celém regionu', 'dostupnost'],
              ['ceny jídla vzrostou a rodina si ho nemůže dovolit', 'přístup'],
              ['děti trpí průjmy z nečisté vody a jídlo jim neprospívá', 'využití'],
              ['válka každou zimu přeruší dodávky', 'stabilita'],
            ], explain: 'Dostupnost = jídlo existuje, přístup = lidé na něj dosáhnou, využití = tělo ho zužitkuje, stabilita = vše platí trvale.' } },
          ],
        },
      ],
      summary: [
        'Venkov v zázemí měst roste díky suburbanizaci, periferní venkov stárne a ztrácí služby; v Česku je typické druhé bydlení.',
        'Zemědělské soustavy třídíme podle vstupů (intenzivní, extenzivní), cíle (samozásobitelské, komerční) a produkce (rostlinná, živočišná, smíšená).',
        'Von Thünen vysvětlil prstence využití půdy kolem trhu rentou z polohy, která klesá s cenou dopravy.',
        'Model předpokládá rovinu, jeden trh a drahou dopravu; dnes ho mění chlazená doprava, světový obchod a dotace.',
        'Zelená revoluce spojila výnosné odrůdy, zavlažování, hnojiva a pesticidy; výnosy obilovin se od roku 1961 zhruba ztrojnásobily.',
        'Její náklady jsou vyčerpaná voda, znečištění, menší rozmanitost a nerovné rozdělení přínosů.',
        'Potravinová bezpečnost má čtyři pilíře; v roce 2025 hladovělo asi 645 milionů lidí, nejvíc v Africe a hlavně kvůli válkám a chudobě.',
      ],
      quiz: [
        { kind: 'tf', q: 'Von Thünenův model předpokládá rovinu se všude stejnou půdou a jediný trh.', answer: true, explain: 'Díky těmto zjednodušením rozhoduje o využití půdy jen vzdálenost od trhu.' },
        { kind: 'choice', q: 'Proč ležel ve von Thünenově modelu les hned za zahradnictvím?', options: ['dřevo bylo hlavní palivo, je těžké a jeho doprava drahá', 'les potřebuje nejúrodnější půdu', 'les nevyžaduje žádnou péči', 've městě se nesmělo kácet'], answer: 0, explain: 'Rozhoduje cena dopravy: dřevo je objemné a těžké, takže se vyplatí pěstovat ho blízko trhu.' },
        { kind: 'multi', q: 'Které jsou negativní dopady zelené revoluce?', options: ['vyčerpání podzemní vody', 'znečištění vod hnojivy', 'úbytek tradičních odrůd', 'zvýšení výnosů pšenice', 'konec velkých hladomorů v Asii'], answers: [0, 1, 2], explain: 'Vyšší výnosy a konec hladomorů jsou přínosy. Vyčerpaná voda, znečištění a ztráta odrůd jsou cena, kterou se za ně platí.' },
        { kind: 'number', q: 'Podle SOFI 2026 hladovělo v roce 2025 asi 645 milionů lidí, tedy 7,8 % lidstva. Kolik miliard lidí tehdy žilo na Zemi? Zaokrouhli na jedno desetinné místo.', answer: 8.3, tolerance: 0.05, unit: 'mld.', explain: '645 mil. : 0,078 ≐ 8 270 mil. ≐ 8,3 mld. lidí.' },
        { kind: 'choice', q: 'Který pilíř potravinové bezpečnosti selhává, když je v obchodech jídla dost, ale rodina na ně nemá peníze?', options: ['přístup', 'dostupnost', 'využití', 'stabilita'], answer: 0, explain: 'Jídlo je dostupné, ale rodina k němu nemá ekonomický přístup.' },
        { kind: 'tf', q: 'Zelená revoluce nejvíc pomohla subsaharské Africe.', answer: false, explain: 'Nejvíc pomohla Mexiku a Asii (Indie, Pákistán, Filipíny). Subsaharskou Afriku skoro minula – chybělo zavlažování, hnojiva a odrůdy pro místní plodiny.' },
        { kind: 'order', q: 'Seřaď von Thünenovy prstence od trhu směrem ven.', items: ['zahradnictví a mléko', 'les', 'obilí', 'chov dobytka'], explain: 'Nejblíž je to, co se kazí, pak těžké dřevo, dál obilí, které vydrží, a nejdál dobytek, který na trh dojde sám.' },
        { kind: 'choice', q: 'Co je typickým projevem vnitřní periferie v Česku?', options: ['stárnutí obyvatel a zavírání obchodů a škol', 'rychlá výstavba satelitních obcí', 'nejvyšší ceny pozemků v kraji', 'velké množství nových pracovních míst'], answer: 0, explain: 'Vnitřní periferie na pomezí krajů leží daleko od center, mladí odcházejí a služby se zavírají.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-5
    'z11-5': {
      id: 'z11-5',
      title: 'Kultura a identita míst',
      goals: [
        'Rozlišit relokační, nákazovou a hierarchickou difuzi a uvést jejich příklady',
        'Vysvětlit prostorové rozšíření jazyků a náboženství a příčiny ohrožení jazyků',
        'Popsat, z čeho vzniká identita místa a jak ji mění globalizace',
        'Vysvětlit smysl světového dědictví UNESCO a najít české položky na mapě',
      ],
      hook: 'Sushi v Olomouci, K-pop v Liberci, Halloween v Telči. Před třiceti lety tu nic z toho nebylo. Kudy a jak se kultura šíří – a zmizí kvůli tomu jednou rozdíly mezi místy?',
      sections: [
        {
          title: 'Jak se kultura šíří',
          icon: 'arrow-cycle',
          blocks: [
            { type: 'p', text: 'V lekci „Jazyky, náboženství a kultury“ jsme si ukázali, jak pestrý je svět. Teď nás zajímá pohyb: jak se nový zvyk, jazyk nebo vynález dostane z místa vzniku – **ohniska** – jinam. Šíření kulturních jevů v prostoru se říká **kulturní difuze**; jejím průkopníkem byl švédský geograf Torsten Hägerstrand.' },
            { type: 'p', text: 'Porovnej v obrázku tři hlavní typy. Rozhodující otázka zní: stěhují se lidé, nebo jen myšlenka?' },
            { type: 'diagram', id: 'cultural-diffusion', caption: 'Relokační difuze (s migranty), expanzní nákazová (od člověka k člověku) a expanzní hierarchická (od metropolí dolů).' },
            { type: 'p', text: 'U relokační difuze se kultura přesouvá spolu s lidmi a v ohnisku může i slábnout. U expanzní zůstává v ohnisku a jen přibývají další místa. Každý typ má své typické příklady:' },
            { type: 'table', headers: ['typ difuze', 'jak funguje', 'příklady'], rows: [
              ['relokační', 'kulturu si nesou migranti', 'angličtina v Austrálii, čínské restaurace po celém světě, vietnamské večerky v Česku'],
              ['expanzní nákazová', 'od člověka k člověku do okolí, jako vlna', 'virální videa a slang; v minulosti šíření islámu po obchodních cestách'],
              ['expanzní hierarchická', 'od významných center k menším, okolní venkov zůstává pozadu', 'móda z Paříže a New Yorku, chytré telefony, křesťanství ve městech Římské říše'],
            ] },
            { type: 'p', text: 'Difuzi brzdí **bariéry**: vzdálenost, hory a moře, jazyk, náboženství nebo politika (cenzura internetu v Číně). Internet vzdálenost skoro zrušil, ale vytváří nové bariéry: kdo nemá připojení nebo neumí anglicky, zůstává stranou. Nejstarší a nejtrvalejší kulturní jevy, které se takto šíří, jsou jazyky a náboženství.' },
            { type: 'check', question: { kind: 'choice', q: 'Vietnamská jídla se do Česka dostala s vietnamskými přistěhovalci. O jaký typ difuze jde?', options: ['relokační', 'hierarchickou', 'nákazovou', 'o žádnou'], answer: 0, explain: 'Kulturu přinesli sami migranti na nové místo, to je relokační difuze. Teprve pak se jídla šířila dál od člověka k člověku.' } },
          ],
        },
        {
          title: 'Jazyky a náboženství v prostoru',
          icon: 'book',
          blocks: [
            { type: 'p', text: 'Jazyky a náboženství patří k nejvýraznějším znakům kultury a mají svá ohniska. Dnešní rozmístění věřících a mluvčích je výsledkem staletí difuze – migrací, obchodu, misií i dobývání.' },
            { type: 'p', text: 'Najdi na mapě ohniska tří velkých náboženství. Všimni si, jak blízko sebe leží Jeruzalém a Mekka – a jak daleko se z nich víra rozšířila:' },
            { type: 'map', view: 'world', points: [
              { lat: 31.78, lon: 35.23, label: 'Jeruzalém – judaismus, křesťanství', kind: 'place' },
              { lat: 21.42, lon: 39.83, label: 'Mekka – islám', kind: 'place' },
              { lat: 24.7, lon: 84.99, label: 'Bódhgaja – buddhismus', kind: 'place' },
            ], caption: 'Ohniska světových náboženství. Hinduismus nemá jedno ohnisko ani zakladatele; vznikl v severní Indii a jeho posvátnou řekou je Ganga.' },
            { type: 'p', text: 'Proč jsou rozšířená tak různě? **Univerzalistická** náboženství (křesťanství, islám, buddhismus) hledají věřící mezi všemi lidmi a šířila se misiemi i dobýváním. **Etnická** náboženství (hinduismus, judaismus) jsou spjatá s jedním národem a krajinou. U jazyků rozhoduje moc: jazyk vládců, obchodu a dnes internetu se stává **lingua franca**, společným dorozumívacím jazykem – dřív latina, dnes angličtina.' },
            { type: 'p', text: 'Opačnou stranou difuze je zánik. Z asi 7 100 jazyků světa je podle Ethnologue skoro polovina ohrožená, protože je děti už nepřebírají. Že se jazyk dá zachránit, ukazují tyto příklady:' },
            { type: 'iconlist', items: [
              { icon: 'speech', title: 'Velština', text: 'povinný předmět ve školách ve Walesu, vlastní televize; mluví jí asi 18 % obyvatel Walesu (sčítání 2021)' },
              { icon: 'flag', title: 'Katalánština', text: 'úřední jazyk Katalánska a hlavní vyučovací jazyk jeho škol' },
              { icon: 'book', title: 'Hebrejština', text: 'z jazyka modliteb se ve 20. století stala mateřštinou milionů lidí v Izraeli' },
              { icon: 'house', title: 'Lužická srbština', text: 'západoslovanský jazyk v Německu u našich hranic; mluví jí už jen desítky tisíc lidí' },
            ] },
            { type: 'p', text: 'Jazyk a víra jsou jen dva z kamínků, ze kterých se skládá to, jak lidé vnímají své místo. Geografie tomu říká identita místa.' },
            { type: 'check', question: { kind: 'tf', q: 'Hinduismus je univerzalistické náboženství, které se misiemi rozšířilo do celého světa.', answer: false, explain: 'Hinduismus je etnické náboženství spjaté s Indií. Mimo ni ho vyznávají hlavně potomci indických přistěhovalců – jde tedy o relokační difuzi, ne o misie.' } },
          ],
        },
        {
          title: 'Místo a jeho identita',
          icon: 'pin',
          blocks: [
            { type: 'p', text: 'Geografové rozlišují **prostor** a **místo**. Prostor je poloha a rozloha – souřadnice, kilometry. Místo je prostor, kterému lidé dali význam: vzpomínky, příběhy, pocit domova. Stejná ulice je pro jednoho cesta do práce a pro jiného dětství.' },
            { type: 'p', text: 'Z čeho se identita místa skládá? Pomůže rozlišit pohled zevnitř a zvenčí:' },
            { type: 'compare', columns: [
              { title: 'Pohled zevnitř', icon: 'house', tone: 'a', points: ['zkušenost obyvatel: kde vyrostli, koho znají', 'místní nářečí, svátky, spolky a sport (hokej v Třinci)', 'pocit sounáležitosti – nebo naopak vyloučení'] },
              { title: 'Pohled zvenčí', icon: 'camera', tone: 'b', points: ['jak místo ukazují média, filmy a reklama', 'stereotypy: „černá Ostrava“, „zlatá Praha“', 'turisté a investoři hledají „značku“ místa'] },
            ] },
            { type: 'p', text: 'Identita místa se mění, protože se mění lidé, ekonomika i to, jak o místě mluvíme. Ostrava je dobrý příklad **proměny místa**: z města uhlí a oceli, kde se v roce 1994 přestalo těžit, se stává univerzitním a kulturním městem; z vysokých pecí ve Vítkovicích je Dolní oblast Vítkovice s koncerty a festivalem Colours of Ostrava. Pozor ale: nový obraz místa nezmění nezaměstnanost přes noc.' },
            { type: 'p', text: 'Kanadský geograf Edward Relph už v roce 1976 varoval před opačným jevem, **bezmístností** (*placelessness*): obchodní centra, letiště a řetězce vypadají všude stejně a místa ztrácejí svou tvář. Hlavním motorem je globalizace.' },
            { type: 'check', question: { kind: 'choice', q: 'Co geografové myslí pojmem „místo“ na rozdíl od „prostoru“?', options: ['prostor, kterému lidé dali význam, vzpomínky a pocit sounáležitosti', 'bod daný zeměpisnými souřadnicemi', 'území jednoho státu', 'plochu měřenou v km²'], answer: 0, explain: 'Prostor je poloha a rozloha. Místo je prostor naplněný lidskou zkušeností a významem.' } },
          ],
        },
        {
          title: 'Globalizace mění místa',
          icon: 'globe',
          blocks: [
            { type: 'p', text: '**Globalizace** – zrychlené propojení světa obchodem, dopravou, médii a internetem – kultury míst propojuje. Výsledek ale není jednoznačný. Geografové popisují čtyři směry:' },
            { type: 'iconlist', items: [
              { icon: 'coffee', title: 'Homogenizace', text: 'všude stejné značky, filmy a hudba; americké řetězce a seriály, angličtina' },
              { icon: 'apple', title: 'Glokalizace', text: 'globální produkt se přizpůsobí místu: McDonald’s v Indii nabízí burgery bez hovězího, protože kráva je v hinduismu posvátná' },
              { icon: 'music', title: 'Hybridizace', text: 'mísením kultur vznikne něco nového: K-pop spojuje korejské a americké vlivy' },
              { icon: 'shield', title: 'Obrana místního', text: 'farmářské trhy, regionální značky, ochrana nářečí a tradic, malé pivovary' },
            ] },
            { type: 'p', text: 'Pozor na zjednodušení „globalizace všechno smaže“. Často naopak zvýrazní, co je místní, protože to má hodnotu pro turisty i obyvatele. Jenže i cestovní ruch může místo proměnit k nepoznání: když historickým centrem Českého Krumlova s necelými 13 000 obyvateli projde ročně přes milion návštěvníků, mění se v kulisu a místní se stěhují pryč. Tomu se říká **overturismus**.' },
            { type: 'p', text: 'Některá místa jsou pro lidstvo tak cenná, že je chrání mezinárodní úmluva. To je světové dědictví UNESCO.' },
            { type: 'check', question: { kind: 'choice', q: 'McDonald’s v Indii prodává burgery bez hovězího masa. Jak se tomuto jevu říká?', options: ['glokalizace', 'homogenizace', 'relokační difuze', 'bezmístnost'], answer: 0, explain: 'Globální firma přizpůsobí produkt místní kultuře – to je glokalizace (globální + lokální).' } },
          ],
        },
        {
          title: 'Kulturní krajina a světové dědictví',
          icon: 'castle',
          blocks: [
            { type: 'p', text: '**Kulturní krajina** je krajina, kterou po staletí tvaroval člověk: vinice, rybníky, terasy, zámecké parky. Nejcennější památky a krajiny chrání **Úmluva o ochraně světového kulturního a přírodního dědictví** z roku 1972. Po zasedání Výboru pro světové dědictví v roce 2026 je na seznamu 1 273 položek ve 173 státech.' },
            { type: 'p', text: 'Česko má na seznamu 17 položek. Najdi je na mapě a všimni si, kolik z nich tvoří celá historická centra měst:' },
            { type: 'map', view: 'czechia', points: [
              { lat: 50.087, lon: 14.421, label: 'Praha', kind: 'place' },
              { lat: 48.811, lon: 14.315, label: 'Český Krumlov', kind: 'place' },
              { lat: 49.184, lon: 15.453, label: 'Telč', kind: 'place' },
              { lat: 49.581, lon: 15.927, label: 'Zelená hora', kind: 'place' },
              { lat: 49.948, lon: 15.268, label: 'Kutná Hora', kind: 'place' },
              { lat: 48.78, lon: 16.8, label: 'Lednice-Valtice', kind: 'place' },
              { lat: 49.298, lon: 17.393, label: 'Kroměříž', kind: 'place' },
              { lat: 48.969, lon: 14.274, label: 'Holašovice', kind: 'place' },
              { lat: 49.87, lon: 16.312, label: 'Litomyšl', kind: 'place' },
              { lat: 49.594, lon: 17.251, label: 'Olomouc', kind: 'place' },
              { lat: 49.207, lon: 16.616, label: 'vila Tugendhat', kind: 'place' },
              { lat: 49.216, lon: 15.881, label: 'Třebíč', kind: 'place' },
              { lat: 50.684, lon: 13.858, label: 'Krušnohoří', kind: 'place' },
              { lat: 50.058, lon: 15.487, label: 'Kladruby nad Labem', kind: 'place' },
              { lat: 50.86, lon: 15.17, label: 'Jizerskohorské bučiny', kind: 'place' },
              { lat: 50.231, lon: 12.871, label: 'lázně (Karlovy Vary aj.)', kind: 'place' },
              { lat: 50.327, lon: 13.546, label: 'Žatec', kind: 'place' },
            ], caption: 'Česká světová dědictví UNESCO (17 položek, stav 2026), od Prahy a Českého Krumlova (1992) po Žatec a krajinu žateckého chmele (2023). Lázně (Karlovy Vary, Mariánské a Františkovy Lázně) patří k nadnárodní položce Slavná lázeňská města Evropy, Krušnohoří je společné s Německem.' },
            { type: 'p', text: 'Zápis přináší prestiž, turisty a peníze na obnovu, ale i povinnosti. Kdo památku nechrání, riskuje vyškrtnutí: Drážďany přišly o titul v roce 2009 kvůli novému mostu přes Labe, Liverpool v roce 2021 kvůli zástavbě nábřeží. A pozor na častý omyl: UNESCO památky nevlastní ani nespravuje – ochrana zůstává na státu a majitelích.' },
            { type: 'p', text: 'Kultura, jazyk i dědictví ale často slouží také jako argument, komu má území patřit. Tím se dostáváme k politické geografii a k lekci „Státy, hranice a území“. Než se do ní pustíš, ověř si, co víš:' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Difuze, identita míst a světové dědictví.' },
            { type: 'check', question: { kind: 'multi', q: 'Které z těchto míst jsou zapsány na seznamu světového dědictví UNESCO?', options: ['Žatec a krajina žateckého chmele', 'Lednicko-valtický areál', 'vila Tugendhat v Brně', 'Sněžka', 'Macocha'], answers: [0, 1, 2], explain: 'Žatec (2023), Lednicko-valtický areál (1996) a vila Tugendhat (2001) na seznamu jsou. Sněžka a Macocha jsou cenné přírodní lokality, ale světovým dědictvím nejsou.' } },
          ],
        },
      ],
      summary: [
        'Kulturní difuze je relokační (s migranty), nebo expanzní – nákazová (od člověka k člověku) a hierarchická (od velkých center k menším).',
        'Univerzalistická náboženství se šířila misiemi do celého světa, etnická zůstala spjatá s jedním národem; lingua franca je jazyk moci a obchodu.',
        'Skoro polovina ze zhruba 7 100 jazyků světa je ohrožená, ale jazyky se dají zachránit (velština, hebrejština).',
        'Místo je prostor s významem; jeho identitu tvoří pohled obyvatel i obraz zvenčí a mění se, jak ukazuje Ostrava.',
        'Globalizace přináší homogenizaci i glokalizaci a hybridizaci; cestovní ruch může vést k overturismu.',
        'Světové dědictví UNESCO má po roce 2026 celkem 1 273 položek, z toho 17 v Česku; ochrana zůstává na státu.',
      ],
      quiz: [
        { kind: 'tf', q: 'Při relokační difuzi se kultura šíří spolu s migranty.', answer: true, explain: 'Lidé si kulturu nesou s sebou na nové místo, jako Britové angličtinu do Austrálie.' },
        { kind: 'choice', q: 'Chytré telefony se nejdřív rozšířily ve velkých městech a teprve pak na venkově. Jaký typ difuze to je?', options: ['expanzní hierarchická', 'relokační', 'expanzní nákazová', 'žádná, šířily se náhodně'], answer: 0, explain: 'Novinka přeskakuje od velkých center k menším a venkov zůstává pozadu – to je hierarchická difuze.' },
        { kind: 'match', q: 'Přiřaď pojem k jeho popisu.', pairs: [
          ['homogenizace', 'všude se prosadí stejné značky a filmy'],
          ['glokalizace', 'globální produkt přizpůsobený místní kultuře'],
          ['hybridizace', 'mísením kultur vznikne něco nového'],
          ['bezmístnost', 'místa ztrácejí svou tvář a vypadají všude stejně'],
        ], explain: 'Homogenizace je proces sjednocování kultur, bezmístnost jeho výsledek v krajině; glokalizace a hybridizace ukazují, že místní kultura nemizí, ale mění se.' },
        { kind: 'number', q: 'Kolik položek světového dědictví UNESCO má Česko (stav 2026)?', answer: 17, tolerance: 0, explain: 'Česko má 17 položek, od Prahy, Českého Krumlova a Telče (1992) po Žatec (2023).' },
        { kind: 'tf', q: 'Památky zapsané na seznam světového dědictví vlastní a spravuje UNESCO.', answer: false, explain: 'UNESCO vede seznam a radí, ale vlastníkem a správcem zůstává stát, obec nebo jiný majitel.' },
        { kind: 'multi', q: 'Proč se některý jazyk stane lingua franca?', options: ['je jazykem silných států, obchodu a vědy', 'šíří se médii a internetem', 'používají ho mezinárodní organizace', 'má nejjednodušší gramatiku', 'má nejvíc slov'], answers: [0, 1, 2], explain: 'O rozšíření jazyka rozhoduje moc, ekonomika a média, ne jeho stavba. Angličtina má složitý pravopis, a přesto je dnešní lingua franca.' },
        { kind: 'choice', q: 'Které náboženství patří mezi etnická?', options: ['judaismus', 'islám', 'křesťanství', 'buddhismus'], answer: 0, explain: 'Judaismus je spjatý s židovským národem a nehledá nové věřící misiemi. Islám, křesťanství a buddhismus jsou univerzalistická náboženství.' },
        { kind: 'choice', q: 'Co je overturismus?', options: ['přemíra turistů, která mění místo a vytlačuje místní obyvatele', 'zákaz turistiky v památkách', 'cestování do zemí bez památek UNESCO', 'cestování mimo sezonu'], answer: 0, explain: 'Když místem projde příliš mnoho návštěvníků, stoupnou ceny, obchody se přizpůsobí turistům a místní odcházejí.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-6
    'z11-6': {
      id: 'z11-6',
      title: 'Státy, hranice a území',
      goals: [
        'Vysvětlit svrchovanost a kritéria státnosti a rozlišit uznaný stát a de facto stát',
        'Třídit hranice podle tvaru i podle vzniku a vysvětlit pojmy enkláva, exkláva a mikrostát',
        'Posoudit, jak tvar státu ovlivňuje jeho správu, a popsat příčiny a průběh separatismu',
        'Věcně popsat hlavní sporná území světa',
      ],
      hook: 'Ve vesnici Baarle na pomezí Belgie a Nizozemska vede státní hranice obchody i obývacími pokoji. To, ve kterém státě dům je, určují vchodové dveře. Proč si lidé kreslí hranice – a proč se o ně tolik přou?',
      sections: [
        {
          title: 'Svrchovanost a uznání',
          icon: 'crown',
          blocks: [
            { type: 'p', text: 'V lekci „Státy a hranice“ jsme stát popsali čtyřmi znaky: území, obyvatelstvo, státní moc a uznání. Jádrem je **svrchovanost** (suverenita): stát sám rozhoduje o svém území a nikdo nad ním nestojí. Myšlenka pochází z Vestfálského míru (1648), který ukončil třicetiletou válku.' },
            { type: 'p', text: 'Kritéria státu se v mezinárodním právu obvykle odvozují z Montevidejské úmluvy (1933). Ta stanoví čtyři kritéria státu, o uznání ale mlčí – a právě tady začínají spory:' },
            { type: 'keyterms', items: [
              { term: '**Kritéria státnosti** (Montevideo, 1933)', def: 'trvalé obyvatelstvo, vymezené území, vláda a schopnost vstupovat do vztahů s jinými státy' },
              { term: '**Vnitřní svrchovanost**', def: 'stát skutečně vykonává moc na svém území: zákony, policie, daně' },
              { term: '**Vnější svrchovanost**', def: 'ostatní státy ho uznávají jako rovnocenného partnera' },
              { term: '**De facto stát**', def: 'území, které funguje jako stát, ale většina států ho neuznává (Somaliland, Severní Kypr)' },
            ] },
            { type: 'p', text: 'Kolik států nový stát uzná, je politické rozhodnutí. Mapa ukazuje území, jejichž postavení je sporné:' },
            { type: 'map', view: 'world', highlight: [
              { codes: ['TWN'], tone: 'a', label: 'Tchaj-wan – uznává ho 12 států' },
              { codes: ['KOS'], tone: 'b', label: 'Kosovo – uznává ho přes 100 států, mezi nimi Česko' },
              { codes: ['SOL', 'CYN'], tone: 'c', label: 'Somaliland a Severní Kypr – de facto státy' },
              { codes: ['PSX'], tone: 'd', label: 'Palestina – pozorovatel při OSN' },
            ], layers: ['names'], caption: 'Území se sporným postavením (2026). Palestinu jako stát uznává přes 150 členů OSN, plným členem OSN ale není.' },
            { type: 'p', text: 'Pozor na rozdíl mezi kritérii a uznáním: Tchaj-wan splňuje všechna čtyři kritéria – má obyvatele, území, vládu a obchoduje s celým světem –, ale uznává ho jen 12 států, protože Čína ho považuje za svou součást. Svrchovanost se navíc dnes dobrovolně sdílí: členové EU přenesli část rozhodování na unii. Svrchovanost každého státu končí na hranici – a hranice nejsou všechny stejné.' },
            { type: 'check', question: { kind: 'choice', q: 'Které kritérium státnosti Montevidejská úmluva neuvádí?', options: ['uznání jinými státy', 'trvalé obyvatelstvo', 'vymezené území', 'vládu'], answer: 0, explain: 'Úmluva požaduje obyvatelstvo, území, vládu a schopnost jednat s jinými státy. Uznání v ní není, proto jsou spory o uznání politické.' } },
          ],
        },
        {
          title: 'Typy hranic',
          icon: 'border',
          blocks: [
            { type: 'p', text: '**Státní hranice** je myšlená plocha kolmá k zemskému povrchu, která odděluje území států – i ve vzduchu a pod zemí. Hranice třídíme podle toho, jak vypadají v krajině, a podle toho, kdy vznikly vzhledem k osídlení.' },
            { type: 'p', text: 'Nejdřív podle tvaru. Obrázek ukazuje tři základní typy a k tomu dva zvláštní případy, enklávu a exklávu:' },
            { type: 'diagram', id: 'border-types', caption: 'Hranice přírodní, geometrické a kulturní; enkláva (Lesotho, Vatikán) a exkláva (Kaliningradská oblast).' },
            { type: 'p', text: 'Podle vzniku rozlišujeme čtyři typy. Prozrazují, zda hranice respektuje lidi, kteří v území žijí:' },
            { type: 'table', headers: ['typ hranice', 'kdy a jak vznikla', 'příklad'], rows: [
              ['předcházející', 'před hustým osídlením', 'hranice USA a Kanady na 49° s. š. na západě kontinentu'],
              ['následná', 'po osídlení, sleduje kulturní rozdíly', 'hranice Indie a Pákistánu (1947) podle náboženské většiny'],
              ['vnucená', 'zvenčí, bez ohledu na obyvatele', 'koloniální hranice v Africe po Berlínské konferenci (1884–1885)'],
              ['reliktní', 'už neplatí, ale v krajině je stále vidět', 'bývalá hranice mezi NDR a SRN, dnes Zelený pás Evropy'],
            ] },
            { type: 'p', text: 'Hranice Česka patří k nejstarším v Evropě: z velké části vedou po hřebenech hor (Krkonoše, Šumava, Krušné hory) a od středověku se měnily jen málo. Důležitější než tvar je dnes **funkce** hranice: bariéra, filtr, nebo místo setkávání. Do Německa přejedeš v schengenském prostoru bez zastavení, na hranici EU s Běloruskem stojí plot. Některé hranice ovšem oddělují velmi zvláštní kusy území.' },
            { type: 'check', question: { kind: 'choice', q: 'Jak se nazývá hranice, kterou koloniální mocnosti určily bez ohledu na obyvatele?', options: ['vnucená', 'předcházející', 'reliktní', 'přírodní'], answer: 0, explain: 'Vnucená (superponovaná) hranice vznikla zvenčí. Typické jsou rovné koloniální hranice v Africe, které rozdělily i spojily různé národy.' } },
          ],
        },
        {
          title: 'Enklávy, exklávy a mikrostáty',
          icon: 'castle',
          blocks: [
            { type: 'p', text: '**Enkláva** je území ze všech stran obklopené jedním cizím státem, **exkláva** oddělená část státu, kterou od zbytku dělí cizí území. Jedno území může být obojím: Llívia je exkláva Španělska a zároveň enkláva uvnitř Francie.' },
            { type: 'p', text: 'Několik příkladů z Evropy ukazuje mapa. U každého si všimni, jak je spojené se zbytkem svého státu, nebo se sousedem:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['VAT', 'SMR', 'MCO', 'LIE', 'AND'], tone: 'a', label: 'evropské mikrostáty' },
            ], points: [
              { lat: 54.71, lon: 20.51, label: 'Kaliningradská oblast (Rusko)', kind: 'place' },
              { lat: 41.9, lon: 12.45, label: 'Vatikán', kind: 'place' },
              { lat: 43.94, lon: 12.45, label: 'San Marino', kind: 'place' },
              { lat: 43.74, lon: 7.42, label: 'Monako', kind: 'place' },
              { lat: 42.46, lon: 1.98, label: 'Llívia', kind: 'place' },
              { lat: 51.44, lon: 4.93, label: 'Baarle', kind: 'place' },
            ], caption: 'Enklávy, exklávy a mikrostáty Evropy. Kaliningradskou oblast odděluje od zbytku Ruska Litva a Bělorusko.' },
            { type: 'p', text: '**Mikrostáty** jsou svrchované státy s nepatrnou rozlohou a malým počtem obyvatel. Jak žijí a čím jsou zvláštní, ukazuje tabulka:' },
            { type: 'table', headers: ['stát', 'rozloha', 'obyvatelé', 'zvláštnost'], rows: [
              ['Vatikán', '0,44 km²', 'asi 800', 'nejmenší stát světa, sídlo papeže; pozorovatel při OSN'],
              ['Monako', '2,1 km²', 'asi 38 000', 'nejhustěji zalidněný stát světa; finance, kasino, závody formule 1'],
              ['Nauru', '21 km²', 'asi 12 000', 'ostrovní stát v Tichém oceánu, dříve bohatý z těžby fosfátů'],
              ['San Marino', '61 km²', 'asi 34 000', 'nejstarší dochovaná republika (podle tradice od roku 301)'],
              ['Lichtenštejnsko', '160 km²', 'asi 40 000', 'průmysl a finance; knížecí rod po staletí vlastnil panství na Moravě (Lednice, Valtice)'],
            ], caption: 'Zaokrouhlené údaje kolem roku 2025 (UN WPP 2024, národní statistiky).' },
            { type: 'p', text: 'Mikrostáty přežily díky diplomacii, neutralitě a smlouvám se sousedy: obranu Monaka zajišťuje Francie, Vatikán a San Marino používají euro bez členství v EU. Jejich slabinou je závislost na sousedovi. Závislost na geografii ale znají i velké státy – podle toho, jaký mají tvar.' },
            { type: 'check', question: { kind: 'tf', q: 'Kaliningradská oblast je exkláva Ruska.', answer: true, explain: 'Patří Rusku, ale od jeho hlavního území ji dělí Litva a Bělorusko. Je to tedy exkláva.' } },
          ],
        },
        {
          title: 'Tvar státu',
          icon: 'map',
          blocks: [
            { type: 'p', text: 'Tvar území ovlivňuje, jak snadno se stát spravuje, jak drahá je doprava a jak se dá bránit. Geografové rozlišují pět základních tvarů:' },
            { type: 'diagram', id: 'state-shapes', caption: 'Kompaktní (Polsko), protáhlý (Chile), fragmentovaný (Indonésie), perforovaný (Jihoafrická republika s Lesothem) a s výběžkem (Thajsko).' },
            { type: 'p', text: 'Ideálem je kompaktní tvar: hranice je od středu všude zhruba stejně daleko. Každý jiný tvar něco stojí. Kolik, ukáže jednoduchý výpočet se dvěma stejně velkými státy:' },
            { type: 'example', title: 'Stejná rozloha, jiná hranice', problem: 'Dva státy mají rozlohu 10 000 km². První je čtverec 100 km × 100 km, druhý obdélník 400 km × 25 km. Jak dlouhé jsou jejich hranice a jak daleko je ze středu státu do nejvzdálenějšího rohu?', steps: [
              'Čtverec: obvod = 4 · 100 km = 400 km.',
              'Obdélník: obvod = 2 · (400 + 25) km = 850 km.',
              'Ze středu do rohu (Pythagorova věta): čtverec √(50^{2} + 50^{2}) ≐ 71 km, obdélník √(200^{2} + 12,5^{2}) ≐ 200 km.',
            ], answer: 'Protáhlý stát má při stejné rozloze víc než dvojnásobnou hranici a jeho nejvzdálenější místa leží skoro třikrát dál od středu: dražší obrana, doprava i správa.' },
            { type: 'p', text: 'Pozor, tvar nic nepředurčuje. Fragmentovaná Indonésie drží pohromadě, i když se od ní Východní Timor oddělil, a rozpadají se i kompaktní státy. Česko má poměrně kompaktní tvar, jen protažený od západu na východ: měří tak asi 493 km, od severu k jihu jen asi 278 km. Tvar sám stát nerozbije, spory ale nejčastěji vznikají o to, komu území patří.' },
            { type: 'check', question: { kind: 'choice', q: 'Jaký tvar má Chile?', options: ['protáhlý', 'kompaktní', 'perforovaný', 'fragmentovaný'], answer: 0, explain: 'Chile je asi 4 300 km dlouhé a v průměru jen kolem 180 km široké, což ztěžuje dopravu i správu mezi severem a jihem.' } },
          ],
        },
        {
          title: 'Sporná území',
          icon: 'warning',
          blocks: [
            { type: 'p', text: '**Sporné území** je území, na které si činí nárok dva nebo více států či skupin. Spory mívají kořeny v kolonialismu a válkách a v tom, že hranice nesedí na rozmístění národů. Popíšeme je věcně: kdo co nárokuje a jaký je stav.' },
            { type: 'p', text: 'Najdi na mapě hlavní sporná území světa:' },
            { type: 'map', view: 'world', highlight: [{ codes: ['SAH'], tone: 'b', label: 'Západní Sahara' }], points: [
              { lat: 34.5, lon: 76.0, label: 'Kašmír', kind: 'place' },
              { lat: 24.5, lon: -13.0, label: 'Západní Sahara', kind: 'place' },
              { lat: 45.3, lon: 34.4, label: 'Krym', kind: 'place' },
              { lat: -51.7, lon: -59.5, label: 'Falklandy (Malvíny)', kind: 'place' },
              { lat: 10.0, lon: 114.0, label: 'Spratlyovy ostrovy', kind: 'place' },
            ], caption: 'Vybraná sporná území (stav 2026).' },
            { type: 'p', text: 'Kdo si území nárokuje a jak spor stojí, shrnuje tabulka:' },
            { type: 'table', headers: ['území', 'kdo si ho nárokuje', 'stav (2026)'], rows: [
              ['Kašmír', 'Indie a Pákistán, menší část i Čína', 'rozdělen linií kontroly; ozbrojený střet Indie a Pákistánu naposledy v květnu 2025'],
              ['Západní Sahara', 'Maroko a Fronta Polisario (Saharská arabská demokratická republika)', 'většinu spravuje Maroko; Rada bezpečnosti OSN v roce 2025 označila marocký plán autonomie za základ jednání'],
              ['Krym', 'Ukrajina a Rusko', 'Rusko ho v roce 2014 anektovalo; Valné shromáždění OSN anexi neuznalo a potvrdilo územní celistvost Ukrajiny'],
              ['Falklandy (Malvíny)', 'Spojené království a Argentina', 'britské zámořské území; válka v roce 1982; obyvatelé v referendu 2013 hlasovali pro setrvání u Británie'],
              ['ostrovy v Jihočínském moři', 'Čína, Vietnam, Filipíny, Malajsie, Brunej, Tchaj-wan', 'Čína staví umělé ostrovy; arbitrážní soud v roce 2016 její nároky odmítl, Čína rozhodnutí neuznává'],
            ] },
            { type: 'p', text: 'Proč na nich tolik záleží? Kromě identity jde o zdroje a polohu: Jihočínským mořem vede velká část světového obchodu a pod jeho dnem jsou ropa a plyn. Pozor i na jazyk: o sporech mluv neutrálně a s daty – „Rusko Krym anektovalo, OSN anexi neuznala“ je popis, ne názor; „Malvíny“ je argentinský název, „Falklandy“ britský. Polohu sporných území a mikrostátů si procvič na slepé mapě:' },
            { type: 'game', gameId: 'blind-map', text: 'Slepá mapa: najdi státy, sporná území, enklávy a mikrostáty.' },
            { type: 'p', text: 'Spor o území ale nevede jen mezi státy. Často ho vedou i skupiny uvnitř státu, které se chtějí osamostatnit.' },
            { type: 'check', question: { kind: 'tf', q: 'Valné shromáždění OSN uznalo připojení Krymu k Rusku.', answer: false, explain: 'Valné shromáždění v roce 2014 přijalo rezoluci, která anexi neuznala a potvrdila územní celistvost Ukrajiny.' } },
          ],
        },
        {
          title: 'Separatismus',
          icon: 'flag',
          blocks: [
            { type: 'p', text: 'Na každý stát působí dva druhy sil. Když převáží odstředivé, objeví se **separatismus** – snaha části území o samostatnost. Porovnej, co stát drží pohromadě a co ho rozděluje:' },
            { type: 'compare', columns: [
              { title: 'Dostředivé síly', icon: 'handshake', tone: 'a', points: ['společný jazyk, dějiny a symboly', 'dobrá doprava a propojená ekonomika', 'prosperita a spravedlivé rozdělení peněz', 'vnější hrozba, která sjednocuje'] },
              { title: 'Odstředivé síly', icon: 'border', tone: 'b', points: ['odlišný jazyk nebo náboženství části obyvatel', 'chudoba nebo naopak bohatství regionu a pocit křivdy', 'velká vzdálenost od centra, hory, moře', 'vzpomínka na vlastní stát nebo na útlak'] },
            ] },
            { type: 'p', text: 'Výsledek není předem daný. Porovnej, jak skončily některé snahy o odtržení:' },
            { type: 'table', headers: ['území', 'co se stalo', 'výsledek'], rows: [
              ['Česko a Slovensko', 'dohoda politiků, bez referenda', 'pokojné rozdělení 1. 1. 1993'],
              ['Skotsko', 'referendum 2014', '55 % proti nezávislosti'],
              ['Québec (Kanada)', 'referendum 1995', '50,6 % proti nezávislosti'],
              ['Katalánsko (Španělsko)', 'referendum 2017, které španělský ústavní soud zakázal', 'vyhlášení nezávislosti nikdo neuznal, autonomie byla dočasně pozastavena'],
              ['Jižní Súdán', 'referendum 2011 po desetiletích války', '98,8 % pro; nejmladší stát světa'],
              ['Jugoslávie', 'rozpad 1991–2008', 'války s více než 100 000 mrtvých'],
            ] },
            { type: 'p', text: 'Úspěch separatismu závisí na tom, zda souhlasí centrální vláda, jak silná je společná identita a zda nový stát uzná svět. Mnohé státy proto odstředivé síly tlumí **devolucí** – předáním části moci regionům: Skotsko a Wales mají vlastní parlamenty, Katalánsko autonomii. Největším národem bez vlastního státu jsou Kurdové, asi 30–40 milionů lidí v Turecku, Iráku, Íránu a Sýrii.' },
            { type: 'p', text: 'Státy tedy nejsou neměnné. Jak spolu soupeří a spolupracují ve světě jako celku, je tématem lekce „Geopolitika a mezinárodní organizace“.' },
            { type: 'check', question: { kind: 'choice', q: 'Co je devoluce?', options: ['předání části moci z centra regionům', 'odtržení části území', 'sloučení dvou států', 'zrušení kontrol na hranicích'], answer: 0, explain: 'Devoluce posiluje regiony v rámci státu (vlastní parlament, rozpočet), a tím často oslabuje volání po úplném odtržení.' } },
          ],
        },
      ],
      summary: [
        'Svrchovanost znamená, že stát sám rozhoduje o svém území; kritéria státnosti jsou obyvatelstvo, území, vláda a schopnost jednat s jinými státy.',
        'Uznání je politické: Tchaj-wan splňuje všechna kritéria, ale uznává ho jen 12 států.',
        'Hranice jsou podle tvaru přírodní, geometrické a kulturní, podle vzniku předcházející, následné, vnucené a reliktní.',
        'Enkláva je obklopená cizím státem, exkláva je oddělená část státu; mikrostáty (Vatikán, Monako) přežívají díky sousedům.',
        'Kompaktní tvar státu usnadňuje správu, protáhlý a fragmentovaný ji prodražují.',
        'Sporná území (Kašmír, Západní Sahara, Krym, Falklandy, Jihočínské moře) popisujeme neutrálně a s daty.',
        'Separatismus vzniká, když převáží odstředivé síly; končí pokojně (Československo), referendem (Skotsko), nebo válkou (Jugoslávie).',
      ],
      quiz: [
        { kind: 'tf', q: 'Tchaj-wan nesplňuje žádné z kritérií státnosti podle Montevidejské úmluvy.', answer: false, explain: 'Splňuje všechna čtyři. Uznává ho ale jen 12 států, protože uznání je politické rozhodnutí.' },
        { kind: 'match', q: 'Přiřaď pojem k jeho popisu.', pairs: [
          ['enkláva', 'území ze všech stran obklopené jedním cizím státem'],
          ['exkláva', 'oddělená část státu za cizím územím'],
          ['mikrostát', 'svrchovaný stát s nepatrnou rozlohou'],
          ['de facto stát', 'funguje jako stát, ale většina států ho neuznává'],
        ], explain: 'Lesotho a Vatikán jsou enklávy, Kaliningradská oblast exkláva, Monako mikrostát a Somaliland de facto stát.' },
        { kind: 'choice', q: 'Která hranice je reliktní?', options: ['bývalá hranice mezi NDR a SRN', 'hranice USA a Kanady na 49° s. š.', 'hranice Česka a Polska v Krkonoších', 'hranice Egypta a Súdánu'], answer: 0, explain: 'Hranice mezi oběma německými státy zanikla v roce 1990, v krajině ji ale dodnes poznáš jako Zelený pás.' },
        { kind: 'number', q: 'Stát má tvar obdélníku 600 km × 50 km. Jak dlouhá je jeho hranice?', answer: 1300, tolerance: 0, unit: 'km', explain: '2 · (600 + 50) km = 1 300 km. Čtverec se stejnou rozlohou 30 000 km² by měl hranici jen asi 693 km.' },
        { kind: 'multi', q: 'Co patří k odstředivým silám?', options: ['odlišný jazyk části obyvatel', 'pocit ekonomické křivdy regionu', 'velká vzdálenost od hlavního města', 'společná měna a dějiny', 'silná společná národní identita'], answers: [0, 1, 2], explain: 'Jazyk, křivda a vzdálenost stát rozdělují. Společná měna, dějiny a identita ho naopak drží pohromadě.' },
        { kind: 'tf', q: 'Rozdělení Československa v roce 1993 proběhlo na základě referenda.', answer: false, explain: 'O rozdělení se dohodli politici a schválil ho parlament, referendum se nekonalo.' },
        { kind: 'choice', q: 'Který stát je nejmenší na světě?', options: ['Vatikán', 'Monako', 'San Marino', 'Nauru'], answer: 0, explain: 'Vatikán má jen 0,44 km². Monako 2,1 km², Nauru 21 km² a San Marino 61 km².' },
        { kind: 'choice', q: 'O které území se přou Maroko a Fronta Polisario?', options: ['Západní Sahara', 'Kašmír', 'Falklandy', 'Krym'], answer: 0, explain: 'Většinu Západní Sahary spravuje Maroko, Fronta Polisario usiluje o nezávislost. Rada bezpečnosti OSN v roce 2025 označila marocký plán autonomie za základ jednání.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-7
    'z11-7': {
      id: 'z11-7',
      title: 'Geopolitika a mezinárodní organizace',
      goals: [
        'Vysvětlit pojmy geopolitika, tvrdá a měkká moc a strategická úžina',
        'Popsat strukturu OSN a fungování Rady bezpečnosti včetně práva veta',
        'Porovnat NATO, EU, G7, G20 a BRICS podle cíle, členství a způsobu rozhodování',
        'Vysvětlit, jak svět spravuje společné statky: klima, oceány a Antarktidu',
      ],
      hook: 'V Radě bezpečnosti OSN stačí jediné „ne“ jednoho z pěti států a rezoluce, pro kterou hlasovalo všech ostatních čtrnáct, neprojde. Je to pojistka míru, nebo jeho brzda?',
      sections: [
        {
          title: 'Moc a prostor',
          icon: 'compass',
          blocks: [
            { type: 'p', text: 'V lekci „Státy, hranice a území“ jsme sledovali jednotlivé státy. **Geopolitika** se ptá, jak poloha, území a zdroje ovlivňují moc států a vztahy mezi nimi. Proč Rusko stojí o přístup k nezamrzajícím mořím? Proč Čína staví přístavy podél Indického oceánu? Za takovými otázkami je vždy prostor.' },
            { type: 'p', text: 'Klasičtí geopolitici hledali místo, které dává vládu nad světem. Jejich pojmy dnes doplňuje rozlišení dvou druhů moci:' },
            { type: 'keyterms', items: [
              { term: '**Moc na moři** (Mahan, 1890)', def: 'světovou mocností je stát s nejsilnějším loďstvem a sítí základen; vzorem byla Británie' },
              { term: '**Teorie srdce světa** (Mackinder, 1904)', def: 'kdo ovládne vnitrozemí Eurasie, ovládne svět; myšlenka ovlivnila strategii studené války' },
              { term: '**Tvrdá moc**', def: 'armáda, sankce a ekonomický nátlak – druhého donutit' },
              { term: '**Měkká moc** (Nye)', def: 'přitažlivost kultury, hodnot, univerzit a filmů – druhého přesvědčit' },
            ] },
            { type: 'p', text: 'Geopolitika je nejnázornější na **strategických úžinách**, kudy musí projet světový obchod. V lekci „Asie: západ, střed a sever“ jsme viděli, co způsobilo uzavření Hormuzského průlivu v roce 2026. Najdi na mapě i ostatní:' },
            { type: 'map', view: 'world', points: [
              { lat: 26.57, lon: 56.25, label: 'Hormuzský průliv', kind: 'place' },
              { lat: 2.5, lon: 101.5, label: 'Malacký průliv', kind: 'place' },
              { lat: 30.6, lon: 32.33, label: 'Suezský průplav', kind: 'place' },
              { lat: 12.6, lon: 43.4, label: 'Bab al-Mandab', kind: 'place' },
              { lat: 9.08, lon: -79.68, label: 'Panamský průplav', kind: 'place' },
              { lat: 41.12, lon: 29.07, label: 'Bospor', kind: 'place' },
              { lat: 35.97, lon: -5.6, label: 'Gibraltarský průliv', kind: 'place' },
            ], caption: 'Strategické úžiny světového obchodu.' },
            { type: 'p', text: 'Kdo úžinu ovládá nebo ji umí zablokovat, drží páku na celý svět. Proto u nich státy budují základny – v Džibutsku u Bab al-Mandabu jich má hned několik zemí, mezi nimi USA, Čína, Francie a Japonsko. Státy ale moc nejen poměřují, ale i spojují v mezinárodních organizacích.' },
            { type: 'check', question: { kind: 'choice', q: 'Co je měkká moc?', options: ['vliv díky přitažlivosti kultury, hodnot a vzdělání', 'vojenská síla a sankce', 'kontrola strategických úžin', 'právo veta v Radě bezpečnosti'], answer: 0, explain: 'Měkká moc přesvědčuje, místo aby nutila: americké filmy, japonská kultura nebo evropské univerzity lákají lidi i vlády.' } },
          ],
        },
        {
          title: 'OSN a Rada bezpečnosti',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'Organizace spojených národů vznikla v roce 1945 jako pojistka proti další světové válce. Má 193 členů a jejím hlavním úkolem je udržovat mezinárodní mír a bezpečnost. Prohlédni si, z čeho se skládá:' },
            { type: 'diagram', id: 'un-system', caption: 'Hlavní orgány OSN a vybrané agentury.' },
            { type: 'p', text: 'Nejvíc moci má **Rada bezpečnosti**: jen ona přijímá rezoluce závazné pro všechny členy, ukládá sankce a povoluje použití síly. Zasedá v ní pět stálých členů – vítězných mocností 2. světové války – a deset volených na dva roky. Na mapě porovnej, kdo v ní sedí v roce 2026:' },
            { type: 'map', view: 'world', highlight: [
              { codes: ['USA', 'RUS', 'CHN', 'GBR', 'FRA'], tone: 'a', label: 'stálí členové s právem veta' },
              { codes: ['DNK', 'GRC', 'PAK', 'PAN', 'SOM'], tone: 'b', label: 'nestálí členové 2025–2026' },
              { codes: ['BHR', 'COL', 'COD', 'LVA', 'LBR'], tone: 'c', label: 'nestálí členové 2026–2027' },
            ], caption: 'Rada bezpečnosti OSN v roce 2026.' },
            { type: 'p', text: 'Rezoluce potřebuje 9 hlasů z 15 a žádné veto stálého člena. Veto brání tomu, aby se velmoci dostaly do přímé války proti sobě, ale Radu ochromuje, když je velmoc do konfliktu zapletená: Rusko vetovalo rezoluce o Ukrajině, USA o Gaze, Rusko a Čína o Sýrii. Proto se desítky let mluví o reformě – Německo, Indie, Japonsko a Brazílie chtějí stálé křeslo a Afrika nemá žádné.' },
            { type: 'callout', variant: 'fact', text: 'Generálního tajemníka volí Valné shromáždění na doporučení Rady bezpečnosti, takže i tady rozhoduje veto. Funkční období Antónia Guterrese končí 31. prosince 2026 a výběr nástupce právě probíhá (stav k říjnu 2026).' },
            { type: 'p', text: 'OSN sdružuje téměř celý svět, a proto se v ní státy těžko shodnou. Ti, kdo chtějí spolupracovat úžeji, zakládají vlastní organizace.' },
            { type: 'check', question: { kind: 'number', q: 'Kolik hlasů z 15 potřebuje rezoluce Rady bezpečnosti OSN, pokud ji žádný stálý člen nevetuje?', answer: 9, tolerance: 0, explain: 'Rezoluce potřebuje 9 kladných hlasů. Stačí ale jediné „ne“ stálého člena a neprojde.' } },
          ],
        },
        {
          title: 'NATO a Evropská unie',
          icon: 'shield',
          blocks: [
            { type: 'p', text: 'Mezinárodní organizace se liší tím, kolik svrchovanosti jim členové svěří. **Mezivládní** organizace rozhoduje shodou a poslední slovo má každý stát. **Nadnárodní** organizace přijímá rozhodnutí, která platí i pro ty, kdo hlasovali proti. Dvě organizace, jejichž členem je Česko, ukazují oba přístupy:' },
            { type: 'compare', columns: [
              { title: 'NATO', icon: 'shield', tone: 'a', points: ['obranná aliance od roku 1949; 32 členů, naposledy Finsko (2023) a Švédsko (2024)', 'mezivládní: rozhoduje se konsenzem', 'článek 5: útok na jednoho je útokem na všechny; použit jen jednou, po 11. září 2001', 'summit v Haagu (2025): do roku 2035 výdaje 5 % HDP, z toho 3,5 % přímo na obranu'] },
              { title: 'Evropská unie', icon: 'star', tone: 'b', points: ['hospodářská a politická unie 27 států', 'kombinuje nadnárodní orgány (Komise, Parlament, Soudní dvůr, euro) a mezivládní (Evropská rada)', 'jednotný trh: volný pohyb osob, zboží, služeb a kapitálu', 'v mnoha oblastech hlasuje kvalifikovanou většinou, v zahraniční politice jednomyslně'] },
            ] },
            { type: 'p', text: 'Pozor, NATO není „evropská armáda“: patří do něj i USA a Kanada a největší část výdajů aliance nesou Spojené státy. Podrobněji se EU věnuje lekce „Evropská unie a integrace“. Vedle formálních organizací se ale svět stále víc domlouvá v neformálních klubech velkých ekonomik.' },
            { type: 'check', question: { kind: 'tf', q: 'NATO je nadnárodní organizace, jejíž rozhodnutí platí i pro státy, které hlasovaly proti.', answer: false, explain: 'NATO je mezivládní a rozhoduje konsenzem. Nadnárodní prvky má naopak EU, např. hlasování kvalifikovanou většinou.' } },
          ],
        },
        {
          title: 'G7, G20 a BRICS',
          icon: 'handshake',
          blocks: [
            { type: 'p', text: 'Kluby států jako G7, G20 nebo BRICS nemají zakládací smlouvu ani stálý sekretariát s pravomocemi. Jsou to fóra, kde se hlavy států dohadují o ekonomice, financích a krizích. Jejich složení prozrazuje, jak se mění rozložení moci ve světě:' },
            { type: 'table', headers: ['skupina', 'členové', 'co představuje'], rows: [
              ['G7 (od 1975, se sedmi členy od 1976)', 'USA, Japonsko, Německo, Spojené království, Francie, Itálie, Kanada (a EU)', 'vyspělé demokracie; Rusko bylo jako G8 členem do roku 2014'],
              ['G20 (od 1999, summity od 2008)', '19 států, EU a od roku 2023 Africká unie', 'asi 85 % světového HDP a dvě třetiny lidstva; v roce 2026 předsedají USA, které na summit nepozvaly Jihoafrickou republiku'],
              ['BRICS (od 2009)', 'Brazílie, Rusko, Indie, Čína, Jihoafrická republika (2010), Egypt, Etiopie, Írán, SAE (2024), Indonésie (2025)', 'rostoucí ekonomiky globálního Jihu, téměř polovina lidstva; od roku 2024 i partnerské země'],
            ] },
            { type: 'p', text: 'Kde členové BRICS leží, ukazuje mapa. Všimni si Saúdské Arábie: byla k členství pozvána, ale formálně ho nepotvrdila, a tak ji některé zdroje počítají mezi členy a jiné ne:' },
            { type: 'map', view: 'world', highlight: [
              { codes: BRICS, tone: 'a', label: 'členové BRICS' },
              { codes: ['SAU'], tone: 'b', label: 'Saúdská Arábie – pozvána, členství nepotvrdila' },
              { codes: BRICS_PARTNERS, tone: 'c', label: 'partnerské země' },
            ], caption: 'BRICS v roce 2026 (18. summit v Novém Dillí, září 2026).' },
            { type: 'p', text: 'Pozor na zjednodušení „BRICS je protizápadní blok“. Členové mají protichůdné zájmy: Indie a Čína spolu soupeří o hranici v Himálaji, Saúdská Arábie a Írán o vliv v Perském zálivu. Spojuje je hlavně snaha mít větší slovo ve světové ekonomice, třeba v Mezinárodním měnovém fondu a Světové bance. Ekonomika ale není jediné, co je třeba řídit společně – některé věci nepatří žádnému státu.' },
            { type: 'check', question: { kind: 'multi', q: 'Které státy jsou členy BRICS (2026)?', options: ['Indonésie', 'Etiopie', 'Egypt', 'Turecko', 'Mexiko'], answers: [0, 1, 2], explain: 'Indonésie vstoupila v roce 2025, Egypt a Etiopie v roce 2024. Turecko ani Mexiko členy nejsou.' } },
          ],
        },
        {
          title: 'Společné statky: klima, oceány, Antarktida',
          icon: 'ocean',
          blocks: [
            { type: 'p', text: 'Atmosféra, volné moře a Antarktida patří všem a nikomu. Takovým věcem se říká **globální statky** a hrozí jim „tragédie obecní pastviny“: když každý využívá společný zdroj jen pro sebe, zničí ho všichni. Svět se proto pokouší o společná pravidla – **globální vládnutí** (global governance). Tři hlavní oblasti a jejich smlouvy shrnuje tabulka:' },
            { type: 'table', headers: ['oblast', 'hlavní dohody', 'stav (2026)'], rows: [
              ['klima', 'Rámcová úmluva OSN o změně klimatu (1992), Kjótský protokol (1997), Pařížská dohoda (2015)', 'cíl udržet oteplení výrazně pod 2 °C; státy si závazky stanoví samy; USA z dohody vystoupily s účinností od ledna 2026'],
              ['oceány', 'Úmluva OSN o mořském právu (1982), Dohoda o volném moři (BBNJ)', 'BBNJ platí od 17. ledna 2026 a umožní zřizovat chráněná území i na volném moři'],
              ['Antarktida', 'Antarktická smlouva (1959), Madridský protokol (1991)', 'územní nároky zmrazeny, jen mírové a vědecké využití, zákaz těžby nerostů'],
            ] },
            { type: 'p', text: 'Mořské právo dělí moře do pásem podle vzdálenosti od pobřeží. Čím dál od břehu, tím menší má pobřežní stát práva:' },
            { type: 'iconlist', items: [
              { icon: 'flag', title: 'Výsostné vody (12 námořních mil)', text: 'území státu; cizí lodě smějí jen pokojně proplout' },
              { icon: 'ship', title: 'Přilehlá zóna (24 mil)', text: 'stát smí kontrolovat celní a imigrační předpisy' },
              { icon: 'oil-barrel', title: 'Výlučná ekonomická zóna (200 mil)', text: 'rybolov, ropa, plyn a větrné elektrárny patří pobřežnímu státu' },
              { icon: 'ocean', title: 'Volné moře', text: 'nepatří nikomu; asi polovina povrchu Země' },
            ] },
            { type: 'p', text: 'Antarktickou smlouvu už znáš z lekce „Polární oblasti“; je to nejúspěšnější příklad: kontinent bez armád a dolů už přes 60 let. U klimatu je to těžší, protože náklady na snižování emisí nese každý stát sám, kdežto přínos má celý svět – lákavé je nechat šetřit ostatní (problém **černého pasažéra**). Globální vládnutí tedy funguje, jen když se spolupráce státům vyplatí víc než soupeření. Co se stane, když selže, ukáže lekce „Konflikty ve světě“.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč je těžší dohodnout se na ochraně klimatu než na Antarktidě?', options: ['náklady na snižování emisí nese každý stát sám, přínos má celý svět', 'v Antarktidě nikdo nežije, takže na ní nezáleží', 'klima nepatří mezi globální statky', 'na klimatických jednáních se OSN nepodílí'], answer: 0, explain: 'To je problém černého pasažéra: každý stát by nejraději užíval výsledků, aniž by za ně platil. V Antarktidě se státy vzdaly něčeho, co skoro nevyužívaly, u klimatu jde o celou ekonomiku.' } },
          ],
        },
      ],
      summary: [
        'Geopolitika zkoumá, jak poloha, území a zdroje ovlivňují moc; moc je tvrdá (donutit) a měkká (přesvědčit).',
        'Strategické úžiny jako Hormuz, Malacký průliv nebo Suez jsou páky na světový obchod.',
        'OSN má 193 členů; Rada bezpečnosti má 5 stálých členů s právem veta a 10 volených, rezoluce potřebuje 9 hlasů a žádné veto.',
        'NATO je mezivládní obranná aliance 32 států, EU kombinuje nadnárodní a mezivládní rozhodování.',
        'G7 sdružuje vyspělé demokracie, G20 velké ekonomiky světa, BRICS rostoucí státy globálního Jihu (10 členů a Saúdská Arábie s nepotvrzeným členstvím).',
        'Klima, oceány a Antarktidu řídí mezinárodní smlouvy; nejúspěšnější je Antarktická smlouva, nejtěžší klima kvůli problému černého pasažéra.',
      ],
      quiz: [
        { kind: 'tf', q: 'Stálými členy Rady bezpečnosti OSN jsou USA, Rusko, Čína, Spojené království a Francie.', answer: true, explain: 'Jsou to vítězné mocnosti 2. světové války a mají právo veta.' },
        { kind: 'choice', q: 'Kterou úžinou proplouvala asi pětina světové spotřeby ropy, než ji v roce 2026 zablokovala válka?', options: ['Hormuzským průlivem', 'Gibraltarským průlivem', 'Bosporem', 'Panamským průplavem'], answer: 0, explain: 'Hormuzský průliv spojuje Perský záliv s oceánem; jeho uzavření v roce 2026 prudce zvedlo ceny ropy.' },
        { kind: 'match', q: 'Přiřaď organizaci k jejímu popisu.', pairs: [
          ['NATO', 'obranná aliance s článkem 5'],
          ['G7', 'sedm vyspělých demokracií'],
          ['G20', 'velké ekonomiky, asi 85 % světového HDP'],
          ['BRICS', 'rostoucí ekonomiky globálního Jihu'],
        ], explain: 'NATO je vojenská aliance, G7, G20 a BRICS jsou neformální fóra pro ekonomiku a politiku.' },
        { kind: 'tf', q: 'Článek 5 Severoatlantické smlouvy byl použit už mnohokrát.', answer: false, explain: 'Byl použit jedinkrát, po teroristických útocích na USA 11. září 2001.' },
        { kind: 'choice', q: 'Do jaké vzdálenosti od pobřeží sahá výlučná ekonomická zóna?', options: ['200 námořních mil', '12 námořních mil', '24 námořních mil', '1 000 námořních mil'], answer: 0, explain: 'Výsostné vody končí na 12 mílích, přilehlá zóna na 24, výlučná ekonomická zóna sahá do 200 námořních mil.' },
        { kind: 'multi', q: 'Co platí o Evropské unii?', options: ['má 27 členských států', 'v některých oblastech rozhoduje kvalifikovanou většinou', 'má jednotný trh s volným pohybem osob, zboží, služeb a kapitálu', 'je vojenská aliance s USA', 'rozhoduje vždy jednomyslně'], answers: [0, 1, 2], explain: 'EU je hospodářská a politická unie; jednomyslnost platí jen v některých oblastech, např. v zahraniční politice. Vojenskou aliancí s USA je NATO.' },
        { kind: 'choice', q: 'Co znamená „tragédie obecní pastviny“?', options: ['společný zdroj zničí, když ho každý využívá jen pro sebe', 'pastviny v Evropě ubývají kvůli městům', 'státy si rozdělí oceány', 'chov dobytka způsobuje hladomory'], answer: 0, explain: 'Pro každého jednotlivce se vyplatí využít zdroj co nejvíc, ale když to udělají všichni, zdroj se vyčerpá. Proto potřebují globální statky společná pravidla.' },
        { kind: 'text', q: 'Jak se jmenuje smlouva z roku 1959, která zmrazila územní nároky na jižní polární kontinent? (dvě slova)', accept: ['Antarktická smlouva', 'smlouva o Antarktidě'], explain: 'Antarktická smlouva vyhradila Antarktidu mírovému a vědeckému využití; Madridský protokol (1991) přidal zákaz těžby.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z11-8
    'z11-8': {
      id: 'z11-8',
      title: 'Konflikty ve světě',
      goals: [
        'Rozlišit hlavní příčiny konfliktů (zdroje, identita, území, moc) a vysvětlit, proč se obvykle kombinují',
        'Věcně a s daty popsat konflikty na Blízkém východě, na Ukrajině, v Súdánu a v Sahelu',
        'Vysvětlit, kdo je uprchlík podle mezinárodního práva a jaká jsou trvalá řešení',
        'Zhodnotit možnosti a meze mírových operací OSN',
      ],
      hook: 'Podle Uppsalského programu dat o konfliktech (UCDP) probíhalo v roce 2025 na světě 65 ozbrojených konfliktů, ve kterých bojoval aspoň jeden stát – nejvíc od roku 1946. Proč, když máme OSN, mezinárodní právo a propojený světový obchod?',
      sections: [
        {
          title: 'Příčiny konfliktů',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'V lekci „Geopolitika a mezinárodní organizace“ jsme viděli pravidla, kterými se svět snaží spory řešit. Když selžou, vzniká ozbrojený konflikt. UCDP ho počítá, když v něm za rok zemře v bojích aspoň 25 lidí; nad 1 000 mrtvých ročně mluví o válce. Geografie se ptá, proč konflikt vzniká právě tady.' },
            { type: 'p', text: 'Příčiny se dají rozdělit do čtyř skupin. Ve skutečných konfliktech se ale skoro vždy kombinují:' },
            { type: 'iconlist', items: [
              { icon: 'oil-barrel', title: 'Zdroje', text: 'ropa, voda, úrodná půda, nerosty; v Demokratické republice Kongo financuje ozbrojené skupiny těžba koltanu a zlata' },
              { icon: 'people', title: 'Identita', text: 'etnické, náboženské a jazykové rozdíly, často zneužité politiky' },
              { icon: 'border', title: 'Území a hranice', text: 'koloniální hranice, sporná území, separatismus' },
              { icon: 'crown', title: 'Moc a ideologie', text: 'boj o vládu, převraty, soupeření velmocí' },
            ] },
            { type: 'p', text: 'Pozor na nejčastější zjednodušení „bojují kvůli náboženství“ nebo „kvůli etnicitě“. Rozdíly mezi skupinami existují všude, ale ve válku přerůstají hlavně tam, kde se přidá chudoba, slabý stát, soupeření o zdroje a politici, kteří z napětí těží. Výzkumníci proto mluví o **mnohočetných příčinách** konfliktů. Ukážeme si je na čtyřech regionech a začneme Blízkým východem.' },
            { type: 'check', question: { kind: 'tf', q: 'Většina ozbrojených konfliktů má jedinou příčinu, například náboženství.', answer: false, explain: 'Konflikty mají téměř vždy více příčin: zdroje, území, identitu i boj o moc. Náboženství nebo etnicita bývají jen jednou z nich.' } },
          ],
        },
        {
          title: 'Blízký východ',
          icon: 'pin',
          blocks: [
            { type: 'p', text: 'Blízký východ jsme poznali v lekci „Asie: západ, střed a sever“: ropa, nedostatek vody a tři náboženství na malém prostoru. Nejdelším místním konfliktem je izraelsko-palestinský. Jde v něm o území, které nárokují dva národy, o Jeruzalém, o uprchlíky a o bezpečnost.' },
            { type: 'p', text: 'Na mapě najdi hlavní dějiště konfliktů v regionu v letech 2023–2026:' },
            { type: 'map', view: 'middle-east', highlight: [
              { codes: ['ISR'], tone: 'a', label: 'Izrael' },
              { codes: ['PSX'], tone: 'b', label: 'Palestinská území (Západní břeh, Pásmo Gazy)' },
              { codes: ['IRN'], tone: 'c', label: 'Írán' },
              { codes: ['SYR', 'LBN', 'YEM'], tone: 'd', label: 'další dějiště bojů' },
            ], points: [
              { lat: 31.78, lon: 35.23, label: 'Jeruzalém', kind: 'city' },
              { lat: 31.5, lon: 34.47, label: 'Gaza', kind: 'city' },
              { lat: 35.69, lon: 51.39, label: 'Teherán', kind: 'capital' },
              { lat: 26.57, lon: 56.25, label: 'Hormuzský průliv', kind: 'place' },
            ], caption: 'Konflikty na Blízkém východě v letech 2023–2026 (stav k září 2026).' },
            { type: 'p', text: 'Klíčová data ve zkratce:' },
            { type: 'list', items: [
              '**1948 a 1967:** vznik Izraele a válka s arabskými státy; v roce 1967 Izrael obsadil Západní břeh Jordánu, Pásmo Gazy a východní Jeruzalém.',
              '**7. října 2023** zaútočilo hnutí Hamás na Izrael: asi 1 200 mrtvých a přes 250 unesených rukojmí. Následovala izraelská vojenská operace v Pásmu Gazy; podle ministerstva zdravotnictví v Gaze, které řídí Hamás, zemřelo do roku 2026 přes 70 000 Palestinců. V srpnu 2025 potvrdila klasifikace IPC v části Pásma hladomor.',
              '**Říjen 2025:** začalo příměří podle plánu USA. Izraelská armáda dál drží asi polovinu Pásma Gazy a o druhé fázi plánu (odzbrojení Hamásu, mezinárodní stabilizační síly) se stále jedná (stav k září 2026).',
              '**Sýrie:** po 13 letech občanské války padl v prosinci 2024 režim Bašára Asada.',
              '**Írán:** 28. února 2026 zaútočily USA a Izrael na Írán. Příměří sjednané v dubnu 2026 obě strany porušují, od července se boje opakovaně obnovují hlavně kolem Hormuzského průlivu a mírová dohoda zatím není (stav k září 2026).',
            ] },
            { type: 'p', text: 'Pozor, jak o konfliktu mluvíš: čísla obětí pocházejí od stran konfliktu a OSN je používá jako nejlepší dostupný odhad, nikoli jako nezávisle ověřená data. Geograf popisuje, co se stalo, kde a s jakými důsledky; posuzovat vinu je úkol soudů a historiků. Druhý velký konflikt současnosti se odehrává mnohem blíž Česku.' },
            { type: 'check', question: { kind: 'choice', q: 'Co se stalo 7. října 2023?', options: ['Hamás zaútočil na Izrael, poté začala válka v Pásmu Gazy', 'padl režim Bašára Asada v Sýrii', 'začalo příměří v Pásmu Gazy', 'USA a Izrael zaútočily na Írán'], answer: 0, explain: 'Útok Hamásu zabil v Izraeli asi 1 200 lidí a odstartoval válku v Pásmu Gazy. Asadův režim padl v prosinci 2024, příměří začalo v říjnu 2025, útok na Írán přišel v únoru 2026.' } },
          ],
        },
        {
          title: 'Válka na Ukrajině',
          icon: 'shield',
          blocks: [
            { type: 'p', text: 'Válka na Ukrajině je největší válkou v Evropě od roku 1945. Spojuje spor o území, otázku identity – ruské vedení tvrdí, že Rusové a Ukrajinci jsou „jeden národ“ – a geopolitiku: Ukrajina směřovala k EU a NATO, Rusko to považuje za ohrožení svého vlivu.' },
            { type: 'p', text: 'Mapa ukazuje dějiště války. Všimni si, že boje se soustřeďují na východě a jihu země:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['UKR'], tone: 'a', label: 'Ukrajina' },
              { codes: ['RUS'], tone: 'b', label: 'Rusko' },
            ], points: [
              { lat: 50.45, lon: 30.52, label: 'Kyjev', kind: 'capital' },
              { lat: 45.3, lon: 34.4, label: 'Krym', kind: 'place' },
              { lat: 48.0, lon: 37.8, label: 'Donbas', kind: 'place' },
              { lat: 47.84, lon: 35.14, label: 'Záporoží', kind: 'city' },
            ], caption: 'Válka na Ukrajině (stav 2026): Rusko kontroluje asi 19 % území Ukrajiny včetně Krymu a většiny Donbasu.' },
            { type: 'p', text: 'Hlavní mezníky války:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'flag', title: '2014', text: 'Rusko anektuje Krym; na Donbasu začínají boje s ozbrojenci podporovanými Ruskem' },
              { icon: 'explosion', title: '24. 2. 2022', text: 'plná ruská invaze; Valné shromáždění OSN ji odsoudilo hlasy 141 států' },
              { icon: 'footprints', title: '2022–2026', text: 'miliony lidí na útěku; v dubnu 2026 žilo v zahraničí (bez Ruska) 5,8 mil. uprchlíků z Ukrajiny (UNHCR)' },
              { icon: 'handshake', title: '2025–2026', text: 'jednání s účastí USA, krátké příměří zprostředkované USA (9.–11. května 2026); trvalý mír zatím nenastal' },
            ], caption: 'Válka na Ukrajině od roku 2014 (stav k říjnu 2026).' },
            { type: 'p', text: 'Válka má celosvětový dosah. Ukrajina patří k největším vývozcům obilí a slunečnicového oleje, takže boje a blokády v Černém moři zvedají ceny potravin v Africe a Asii; na podzim 2026 se proto za zprostředkování Turecka znovu jedná o bezpečné plavbě po Černém moři. Válka také urychlila zbrojení v Evropě a vstup Finska a Švédska do NATO. Nejvíc lidí na útěku ale dnes není v Evropě – je v Africe.' },
            { type: 'check', question: { kind: 'number', q: 'Ruskou invazi odsoudilo v březnu 2022 ve Valném shromáždění OSN 141 ze 193 členských států. Kolik je to procent? Zaokrouhli na celá procenta.', answer: 73, tolerance: 1, unit: '%', explain: '141 : 193 ≐ 0,73, tedy asi 73 % členů OSN.' } },
          ],
        },
        {
          title: 'Súdán a Sahel',
          icon: 'dune',
          blocks: [
            { type: 'p', text: 'Afrika je dnes světadílem s nejvíce ozbrojenými konflikty. Dva nejvážnější leží v pásu Sahelu na jižním okraji Sahary, který znáš z lekce „Afrika“: suchá krajina, rychle rostoucí mladá populace, chudoba a slabé státy.' },
            { type: 'p', text: 'Na mapě najdi Súdán a tři státy centrálního Sahelu:' },
            { type: 'map', view: 'africa', highlight: [
              { codes: ['SDN'], tone: 'a', label: 'Súdán' },
              { codes: ['MLI', 'BFA', 'NER'], tone: 'b', label: 'Aliance sahelských států (Mali, Burkina Faso, Niger)' },
            ], bands: [{ from: 12, to: 18, label: 'Sahel', tone: 'c' }], points: [
              { lat: 15.5, lon: 32.56, label: 'Chartúm', kind: 'capital' },
              { lat: 13.63, lon: 25.35, label: 'Al-Fášir', kind: 'city' },
              { lat: 12.64, lon: -8.0, label: 'Bamako', kind: 'capital' },
            ], caption: 'Súdán a centrální Sahel (stav 2026).' },
            { type: 'p', text: 'Oba konflikty mají jiné strany i jiné kořeny. Porovnej je:' },
            { type: 'compare', columns: [
              { title: 'Súdán', icon: 'shield', tone: 'a', points: ['od dubna 2023 válka mezi armádou (SAF) a polovojenskými Silami rychlé podpory (RSF)', 'boj o moc po pádu Umara al-Bašíra (2019), o zlato a o půdu', 'v říjnu 2025 dobyly RSF po více než 500denním obléhání Al-Fášir v Dárfúru', 'největší krize vysídlení na světě: asi 8,8 mil. vnitřně vysídlených (IOM, červen 2026) a přes 4 mil. lidí v sousedních státech', 'hladomor potvrzený v Al-Fášir a Kádugli (IPC, listopad 2025)'] },
              { title: 'Centrální Sahel', icon: 'dune', tone: 'b', points: ['od roku 2012 povstání džihádistických skupin (JNIM spojená s al-Káidou, Islámský stát)', 'vojenské převraty v Mali (2020, 2021), Burkině Faso (2022) a Nigeru (2023)', 'odchod francouzských vojsk (2022–2023) a mise OSN z Mali (2023), příchod ruských vojenských jednotek', 'v lednu 2025 státy vystoupily z hospodářského společenství ECOWAS a vytvořily vlastní alianci', 'od září 2025 JNIM opakovaně blokuje dovoz paliva do Bamaka'] },
            ] },
            { type: 'p', text: 'Podnebí v Sahelu hraje roli, ale opatrně s ním: sucha a degradace půdy zostřují spory pastevců a zemědělců o vodu a pastviny, válku však samy nezpůsobí. Rozhoduje, zda stát dokáže spory řešit a lidem zajistit bezpečí a obživu. Kde to nedokáže, lidé utíkají – a tím se dostáváme k uprchlíkům.' },
            { type: 'check', question: { kind: 'choice', q: 'Kdo proti sobě bojuje ve válce v Súdánu, která začala v roce 2023?', options: ['súdánská armáda (SAF) a Síly rychlé podpory (RSF)', 'Súdán a Jižní Súdán', 'Súdán a Egypt', 'mírové síly OSN a džihádisté'], answer: 0, explain: 'Jde o boj o moc mezi dvěma ozbrojenými složkami, které spolu ještě v roce 2021 provedly převrat. Jižní Súdán se oddělil už v roce 2011.' } },
          ],
        },
        {
          title: 'Uprchlíci a vysídlení',
          icon: 'tent',
          blocks: [
            { type: 'p', text: 'V lekci „Migrace“ jsme rozlišili uprchlíka, vnitřně vysídlenou osobu a žadatele o azyl. Právním základem je **Úmluva o právním postavení uprchlíků** (1951): uprchlík je mimo svou zemi a má odůvodněný strach z pronásledování kvůli původu, náboženství, národnosti, příslušnosti k určité společenské skupině nebo politickému přesvědčení. Klíčová je zásada **non-refoulement**: nikoho nelze vrátit tam, kde mu hrozí pronásledování.' },
            { type: 'p', text: 'Jak se počty vyvíjejí, ukazuje graf nuceně vysídlených lidí podle UNHCR. Sleduj zlom po roce 2011 a vrchol v roce 2024:' },
            { type: 'graph', x: { label: 'rok', min: 2010, max: 2025, step: 5 }, y: { label: 'nuceně vysídlení', unit: 'mil.', min: 0, max: 140, step: 20 },
              series: [
                { label: 'nuceně vysídlení celkem', points: [[2010, 43.7], [2012, 45.2], [2014, 59.5], [2016, 65.6], [2018, 70.8], [2020, 82.4], [2021, 89.3], [2022, 108.4], [2023, 117.3], [2024, 123.2], [2025, 117.8]], style: 'line', area: true, tone: 'a' },
              ],
              marks: [{ x: 2024, y: 123.2, label: 'vrchol 123,2 mil.' }],
              caption: 'Nuceně vysídlení lidé na světě, vždy ke konci roku (UNHCR Global Trends 2010–2025).' },
            { type: 'p', text: 'Po roce 2011 přibyla válka v Sýrii, po roce 2022 válka na Ukrajině a v Súdánu. V roce 2025 počet poprvé po letech klesl na 117,8 milionu, z toho 68,7 milionu vnitřně vysídlených a 41,6 milionu uprchlíků. Hlavním důvodem byly návraty do Afghánistánu, Sýrie a Súdánu – ne vždy dobrovolné, část Afghánců vyhostil Írán a Pákistán. Pro uprchlíky existují tři **trvalá řešení**:' },
            { type: 'iconlist', items: [
              { icon: 'house', title: 'Dobrovolný návrat', text: 'domů, až je tam bezpečno; nejčastější přání uprchlíků' },
              { icon: 'handshake', title: 'Místní integrace', text: 'trvalý pobyt a práce v zemi, kam uprchlík utekl' },
              { icon: 'plane', title: 'Přesídlení', text: 'přestěhování do třetí země, která uprchlíka přijme; týká se jen malého zlomku uprchlíků' },
            ] },
            { type: 'p', text: 'Pozor, uprchlík obvykle nezůstává v táboře jen pár měsíců: mnoho situací trvá desítky let (Afghánci v Íránu a Pákistánu, Palestinci). Ukončit konflikt je proto nejlepší pomoc uprchlíkům. Jak se o to snaží mezinárodní společenství?' },
            { type: 'check', question: { kind: 'choice', q: 'Co znamená zásada non-refoulement?', options: ['uprchlíka nelze vrátit tam, kde mu hrozí pronásledování', 'uprchlík musí požádat o azyl v první bezpečné zemi', 'uprchlíci nesmějí pracovat', 'státy musí přijmout všechny migranty'], answer: 0, explain: 'Non-refoulement (zákaz navracení) je jádro uprchlického práva: stát smí žádost zamítnout, ale nesmí člověka poslat tam, kde mu hrozí pronásledování.' } },
          ],
        },
        {
          title: 'Mírové operace OSN',
          icon: 'handshake',
          blocks: [
            { type: 'p', text: 'Mírové operace OSN – vojáci v modrých přilbách – vznikly v roce 1948 na Blízkém východě. Nemají válku vyhrát, ale pomoci udržet příměří a chránit civilisty. Řídí se třemi zásadami: souhlas stran konfliktu, nestrannost a použití síly jen v sebeobraně a na obranu mandátu. Mise je přitom jen jeden článek řetězu od napětí k trvalému míru:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'warning', title: 'Prevence', text: 'včasné varování a diplomacie' },
              { icon: 'speech', title: 'Zprostředkování', text: 'jednání o příměří, prostředníci (Norsko, Katar, Turecko)' },
              { icon: 'handshake', title: 'Příměří', text: 'dohoda o zastavení bojů' },
              { icon: 'shield', title: 'Mírová operace', text: 'dohled nad příměřím, ochrana civilistů' },
              { icon: 'house', title: 'Budování míru', text: 'volby, policie, odminování, obnova' },
            ], caption: 'Od konfliktu k míru: mírová operace přichází až po příměří.' },
            { type: 'p', text: 'Mise mají úspěchy (Libérie, Sierra Leone, Kambodža) i selhání: ve Rwandě v roce 1994 a ve Srebrenici v roce 1995 vojáci OSN genocidě nezabránili. Dnes je tíží nedostatek peněz. V roce 2025 působilo 11 misí s více než 50 000 vojáky a policisty a rozpočet na rok 2025/26 činil 5,38 mld. USD; protože někteří členové neplatí příspěvky, OSN v říjnu 2025 oznámila snížení jejich počtu asi o čtvrtinu. Mandát mise UNIFIL v Libanonu podle rozhodnutí Rady bezpečnosti končí 31. prosince 2026 a během roku 2027 se mise stáhne.' },
            { type: 'callout', variant: 'fact', text: 'Čeští vojáci slouží od roku 1999 v misi NATO KFOR v Kosovu – jedné z nejdelších zahraničních misí české armády.' },
            { type: 'p', text: 'Obyvatelstvo, města, kultura i politika: všechny lekce této úrovně spojuje prostor – kdo kde žije, jak se pohybuje a kdo o území rozhoduje. Poslední úroveň „Globální hospodářství a udržitelnost“ ukáže, jak svět vydělává a jak dlouho to Země vydrží. Než do ní vstoupíš, otestuj se:' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: obyvatelstvo, města, státy a konflikty.' },
            { type: 'check', question: { kind: 'multi', q: 'Na jakých zásadách stojí mírové operace OSN?', options: ['souhlas stran konfliktu', 'nestrannost', 'síla jen v sebeobraně a na obranu mandátu', 'vojenské vítězství nad jednou ze stran', 'převzetí vlády nad územím natrvalo'], answers: [0, 1, 2], explain: 'Mírové jednotky nejsou strana války. Působí se souhlasem stran, nestranně a sílu používají jen v sebeobraně a na ochranu svého mandátu.' } },
          ],
        },
      ],
      summary: [
        'Konflikty mají mnohočetné příčiny: zdroje, identitu, území a boj o moc; v roce 2025 jich bylo nejvíc od roku 1946.',
        'Na Blízkém východě po útoku Hamásu (7. 10. 2023) následovala válka v Gaze, příměří od října 2025 je křehké; v únoru 2026 začala válka USA a Izraele s Íránem.',
        'Rusko anektovalo Krym (2014) a v roce 2022 zahájilo plnou invazi; kontroluje asi 19 % Ukrajiny a trvalý mír zatím nenastal.',
        'Válka armády a RSF v Súdánu je největší krizí vysídlení na světě; centrální Sahel trápí džihádisté, převraty a slabé státy.',
        'Na konci roku 2025 bylo 117,8 milionu nuceně vysídlených; trvalá řešení jsou návrat, místní integrace a přesídlení.',
        'Mírové operace OSN stojí na souhlasu stran, nestrannosti a omezeném použití síly; dnes je oslabují škrty v rozpočtu.',
      ],
      quiz: [
        { kind: 'tf', q: 'Podle UCDP probíhalo v roce 2025 nejvíc konfliktů se zapojením státu od roku 1946.', answer: true, explain: 'UCDP napočítalo 65 takových konfliktů, z toho 13 dosáhlo úrovně války (aspoň 1 000 mrtvých v bojích za rok).' },
        { kind: 'choice', q: 'Jakou část území Ukrajiny Rusko zhruba kontroluje (2026)?', options: ['asi 19 %', 'asi 5 %', 'asi 50 %', 'asi 80 %'], answer: 0, explain: 'Asi pětinu území včetně Krymu a většiny Donbasu.' },
        { kind: 'match', q: 'Přiřaď místo ke státu nebo území, kde leží.', pairs: [
          ['Al-Fášir', 'Súdán'],
          ['Bamako', 'Mali'],
          ['Hormuzský průliv', 'Írán a Omán'],
          ['Gaza', 'Palestinská území'],
        ], explain: 'Al-Fášir je hlavní město severního Dárfúru, Bamako hlavní město Mali, Hormuzský průliv leží mezi Íránem a Ománem a Gaza je největší město Pásma Gazy.' },
        { kind: 'number', q: 'Na konci roku 2025 bylo podle UNHCR 117,8 milionu nuceně vysídlených, z toho 68,7 milionu vnitřně. Kolik procent nuceně vysídlených zůstalo ve vlastní zemi? Zaokrouhli na celá procenta.', answer: 58, tolerance: 1, unit: '%', explain: '68,7 : 117,8 ≐ 0,58, tedy asi 58 %. Většina lidí na útěku tedy hranici nepřekročí.' },
        { kind: 'tf', q: 'Mírové jednotky OSN mají za úkol porazit stranu, která porušila mír.', answer: false, explain: 'Mírové operace jsou nestranné a sílu používají jen v sebeobraně a na obranu mandátu. Vynutit mír silou může jen Rada bezpečnosti zvláštním mandátem.' },
        { kind: 'multi', q: 'Co přispělo ke konfliktům v centrálním Sahelu?', options: ['džihádistická povstání', 'vojenské převraty', 'sucha a spory o pastviny a vodu', 'vstup Mali do NATO', 'dostatek práce pro mladé lidi'], answers: [0, 1, 2], explain: 'Povstání, převraty a slabé státy se tu sčítají se suchem a spory o zdroje. Mali není v NATO a nedostatek práce pro mladé naopak napětí zvyšuje.' },
        { kind: 'order', q: 'Seřaď události chronologicky.', items: ['ruská anexe Krymu', 'plná ruská invaze na Ukrajinu', 'útok Hamásu na Izrael', 'pád Asadova režimu v Sýrii', 'útok USA a Izraele na Írán'], explain: '2014, únor 2022, říjen 2023, prosinec 2024, únor 2026.' },
        { kind: 'choice', q: 'Proč se počet nuceně vysídlených v roce 2025 snížil?', options: ['přibylo návratů do Afghánistánu, Sýrie a Súdánu', 'skončily všechny války', 'UNHCR změnil definici uprchlíka', 'většina uprchlíků získala občanství v Evropě'], answer: 0, explain: 'Mnoho lidí se vrátilo, část ale nedobrovolně – Afghánce vyhošťoval Írán a Pákistán. Války v Súdánu, na Ukrajině i jinde pokračují.' },
      ],
    },
  },
  boss: [
    { kind: 'choice', q: 'Stát má porodnost 9 ‰, úmrtnost 12 ‰ a migrační saldo +5 ‰. Co platí?', options: ['je v 5. fázi demografického přechodu, ale počet obyvatel roste', 'počet obyvatel klesá o 3 ‰ ročně', 'je ve 2. fázi demografického přechodu', 'přirozený přírůstek je kladný'], answer: 0, explain: 'Přirozený přírůstek je 9 − 12 = −3 ‰ (5. fáze), migrační saldo +5 ‰ ho převáží: celkem +2 ‰ ročně. Podobně dnes roste Česko: přirozený úbytek vyrovná přistěhování.' },
    { kind: 'number', q: 'Úhrnná plodnost v Česku byla v roce 2025 asi 1,28. O kolik procent je to pod záchovnou úrovní 2,1? Zaokrouhli na celá procenta.', answer: 39, tolerance: 1, unit: '%', explain: '(2,1 − 1,28) : 2,1 = 0,82 : 2,1 ≐ 0,39, tedy asi o 39 %.' },
    { kind: 'tf', q: 'Model demografického přechodu spolehlivě předpoví, ve kterém roce začne v daném státě klesat porodnost.', answer: false, explain: 'Model popisuje směr změn, ne jejich načasování. Proto jsou v části Afriky odchylky od očekávání.' },
    { kind: 'choice', q: 'Kterou myšlenku obsahují Ravensteinovy zákony migrace?', options: ['migrace probíhá po etapách: z vesnice do menšího města a odtud do velkoměsta', 'migranti posílají domů remitence', 'uprchlíka nelze vrátit tam, kde mu hrozí pronásledování', 'tok klesá s třetí mocninou vzdálenosti'], answer: 0, explain: 'Etapová migrace je jedním z Ravensteinových zákonů (1885). Remitence a non-refoulement jsou pozdější pojmy; gravitační model počítá s druhou mocninou vzdálenosti.' },
    { kind: 'number', q: 'Podle gravitačního modelu: vzdálenost mezi dvěma městy se zvětší třikrát, jejich velikost se nezmění. Kolikrát se zmenší migrační tok?', answer: 9, tolerance: 0, explain: 'Tok je nepřímo úměrný druhé mocnině vzdálenosti: 3^{2} = 9.' },
    { kind: 'match', q: 'Přiřaď model města k jeho podstatě.', pairs: [
      ['Burgess', 'soustředné zóny kolem CBD'],
      ['Hoyt', 'výseče podél dopravních os'],
      ['Harris–Ullman', 'několik jader v jednom městě'],
      ['Griffin–Ford', 'latinskoamerické město s bohatou osou a chudým okrajem'],
    ], explain: 'První tři modely vznikly podle amerických měst, Griffinův–Fordův model reaguje na města Latinské Ameriky.' },
    { kind: 'choice', q: 'Ve von Thünenově modelu chlazená doprava výrazně zlevní převoz zeleniny. Co se stane s prstencem zahradnictví?', options: ['rozšíří se dál od trhu', 'zúží se', 'zmizí', 'přesune se za chov dobytka'], answer: 0, explain: 'Nižší cena dopravy f znamená, že renta zeleniny klesá se vzdáleností pomaleji, a zelenina tak vyhrává i dál od trhu.' },
    { kind: 'tf', q: 'Šíření módy z metropolí do krajských a pak do malých měst je příkladem hierarchické difuze.', answer: true, explain: 'Novinka přeskakuje od velkých center k menším, venkov mezi nimi dostihne až nakonec.' },
    { kind: 'multi', q: 'Které dvojice jsou správně?', options: ['Lesotho – enkláva', 'Kaliningradská oblast – exkláva', 'Chile – protáhlý stát', 'Indonésie – kompaktní stát', 'Polsko – fragmentovaný stát'], answers: [0, 1, 2], explain: 'Indonésie je fragmentovaná (přes 17 000 ostrovů), Polsko kompaktní.' },
    { kind: 'choice', q: 'Proč Rada bezpečnosti OSN často nepřijme rezoluci o válce, do které je zapojena velmoc?', options: ['stálý člen může rezoluci vetovat', 'rezoluce potřebuje souhlas všech 193 států', 'Rada bezpečnosti nemá žádné pravomoci', 'veto mají nestálí členové'], answer: 0, explain: 'Pět stálých členů má právo veta. Rezoluce o Ukrajině vetovalo Rusko, o Gaze USA.' },
    { kind: 'text', q: 'Jak se jmenuje skupina států, jejíž zkratka vznikla z počátečních písmen Brazílie, Ruska, Indie, Číny a Jihoafrické republiky?', accept: ['BRICS'], explain: 'BRICS se od roku 2024 rozšířila o Egypt, Etiopii, Írán, SAE a v roce 2025 o Indonésii.' },
    { kind: 'choice', q: 'Který výrok o uprchlících je správný?', options: ['mnoho uprchlických situací trvá roky až desítky let', 'přesídlení do třetí země se týká většiny uprchlíků', 'uprchlíkem je každý, kdo hledá práci v cizině', 'vnitřně vysídlení lidé jsou podle úmluvy z roku 1951 uprchlíci'], answer: 0, explain: 'Afghánci v Íránu a Pákistánu nebo Palestinci žijí jako uprchlíci po generace. Přesídlení je vzácné a vnitřně vysídlení nepřekročili hranici, takže uprchlíky podle úmluvy nejsou.' },
  ],
}

export default level
