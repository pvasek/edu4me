import type { LevelContent } from '../../../core/types'

/*
 * Zeměpis, level 7 – Regiony světa (ZŠ 7.–8. třída).
 * Every region is described with the tools of levels 1–6. Data and sources:
 * - population: UN World Population Prospects 2024 (year 2024); cities: UN World Urbanization Prospects 2025;
 *   Austrálie ABS (31. 12. 2025); Kanada Statistics Canada (2025); Tuvalu sčítání 2022.
 * - economy: World Bank, HDP na obyvatele v běžných USD (2024; Čína a Indie 2025).
 * - climate charts (monthly means, normál 1991–2020): Chicago-O'Hare, Niamey, Bombaj, Verchojansk, Manaus,
 *   Alice Springs, Utqiaġvik = curated values of src/games/climate-chart/data.ts (Manaus also = l4.ts);
 *   Miami temperatures and Rijád, Quito: Climates to Travel compilation (official tables not reachable in review).
 * - Niger pyramid: UN WPP 2024 (2024), absolute numbers via StatisticsTimes, shares computed.
 * - Amazon deforestation: INPE PRODES (2004–2025), INPE DETER (8/2025–7/2026, Mongabay 8/2026).
 * - Great Barrier Reef: AIMS Annual Summary Report of Coral Reef Condition 2024/25.
 * - Sea level: NASA (2025); Falepili: Australian High Commission Tuvalu (2025).
 * - Arctic sea ice: NSIDC (minimum 12. 9. 2026: 4,60 mil. km²); Northern Sea Route: CHNL (2025).
 * - Hormuz: shipping largely halted after the US/Israeli strikes on Iran from 28. 2. 2026; ceasefire 7. 4. 2026,
 *   strait declared closed again 18. 4. 2026; traffic still far below normal in September 2026 (CRS, Al Jazeera, Lloyd's List).
 * - Climate charts Niamey, Bombaj, Verchojansk, Manaus, Chicago, Alice Springs, Utqiaġvik: same values as
 *   src/games/climate-chart/data.ts (1991–2020); Miami precipitation NOAA MIA 1991–2020 (67,41 in) converted to mm.
 * - Cairo 32 mil. (UN WUP 2025, UN DESA 12/2025); Sudan: UNHCR Global Appeal 2026 (14 mil. displaced since 4/2023).
 */

const level: LevelContent = {
  lessons: {
    // ───────────────────────────────────────────────────────────── z7-1
    'z7-1': {
      id: 'z7-1',
      title: 'Jak dělíme svět na regiony',
      goals: [
        'Rozlišit světadíl a kontinent a vyjmenovat světadíly a oceány',
        'Vymezit region podle přírody, podle kultury a podle hospodářství a říct, proč se hranice regionů liší',
        'Opravit si mentální mapu světa o nejčastější omyly',
        'Popsat, jakými kroky budeme v této úrovni zkoumat každý region',
      ],
      hook: 'Kolik je na Zemi světadílů? Pět, šest, nebo sedm? Záleží na tom, koho se zeptáš – a každý může mít pravdu. Hranice regionů totiž nekreslí příroda, ale lidé.',
      sections: [
        {
          title: 'Světadíly, kontinenty a oceány',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'Nejhrubší dělení světa znáš od první třídy: pevnina a moře. Jenže pevninu dělíme dvojím způsobem a ty dva způsoby se často pletou. Proč dostáváš na otázku z úvodu různé odpovědi?' },
            { type: 'p', text: 'Rozdíl je v tom, jestli se díváme jen na vodu kolem pevniny, nebo i na dějiny a kulturu. Tady jsou tři pojmy, které budeme v celé úrovni používat:' },
            { type: 'keyterms', items: [
              { term: '**Kontinent** (pevnina)', def: 'souvislá velká pevnina obklopená mořem: Eurasie, Afrika, Severní Amerika, Jižní Amerika, Austrálie, Antarktida' },
              { term: '**Světadíl**', def: 'díl světa, jak ho vymezili lidé podle polohy i dějin: Evropa, Asie, Afrika, Amerika (často dělená na Severní a Jižní), Austrálie a Oceánie, Antarktida' },
              { term: '**Oceán**', def: 'největší souvislá vodní plocha mezi kontinenty: Tichý, Atlantský, Indický a Severní ledový; mnoho geografů dnes vyčleňuje i Jižní oceán kolem Antarktidy' },
            ] },
            { type: 'p', text: 'Pozor na nejčastější omyl: Evropa je **světadíl**, ale ne kontinent. S Asií tvoří jednu pevninu, **Eurasii**. Kolik je tedy světadílů? Šest, když počítáme Ameriku jako jednu, sedm, když ji dělíme na dvě – a pět obydlených, jako je pět kruhů na olympijské vlajce. Jak velké jednotlivé světadíly jsou a kolik v nich žije lidí, ukazuje tabulka:' },
            { type: 'table', headers: ['světadíl', 'rozloha (mil. km²)', 'obyvatel 2024', 'podíl lidstva'], rows: [
              ['Asie', '44,6', '≈ 4,8 mld.', '59 %'],
              ['Afrika', '30,3', '≈ 1,5 mld.', '19 %'],
              ['Severní Amerika', '24,2', '≈ 0,6 mld.', '7 %'],
              ['Jižní Amerika', '17,8', '≈ 0,44 mld.', '5 %'],
              ['Antarktida', '14,2', 'jen výzkumníci', '0 %'],
              ['Evropa', '10,5', '≈ 0,74 mld.', '9 %'],
              ['Austrálie a Oceánie', '8,9', '≈ 0,05 mld.', 'méně než 1 %'],
            ], caption: 'Světadíly podle rozlohy; počty obyvatel zaokrouhleně podle UN World Population Prospects 2024 (svět 2024: 8,2 mld.).' },
            { type: 'p', text: 'Všimni si, že Asie je největší a zároveň v ní žije víc lidí než ve všech ostatních světadílech dohromady. Kudy ale vedou hranice mezi světadíly? Některé tvoří úzké šíje a průplavy, hranice Evropy a Asie je jen dohoda vedená po horách a řekách:' },
            { type: 'map', view: 'world', routes: [
              { points: [
                { lat: 68.5, lon: 66.0 }, { lat: 64.0, lon: 59.5 }, { lat: 58.0, lon: 59.0 }, { lat: 54.0, lon: 58.6 },
                { lat: 51.8, lon: 55.1 }, { lat: 51.2, lon: 51.4 }, { lat: 47.1, lon: 51.9 }, { lat: 44.8, lon: 47.2 },
                { lat: 46.2, lon: 43.5 }, { lat: 47.1, lon: 39.4 }, { lat: 45.3, lon: 36.5 }, { lat: 41.1, lon: 29.1 },
              ], label: 'hranice Evropy a Asie (Ural, řeka Ural, Kaspické moře, Kumo-manyčská sníženina, Bospor)', tone: 'a', style: 'dashed' },
            ], points: [
              { lat: 30.6, lon: 32.3, label: 'Suezský průplav (Afrika | Asie)', kind: 'place' },
              { lat: 9.1, lon: -79.7, label: 'Panamská šíje (Severní | Jižní Amerika)', kind: 'place' },
            ], caption: 'Hranice světadílů. Hranici Evropy a Asie vedou učebnice po Uralu, řece Uralu a Kaspickém moři a dál po Kavkaze nebo po Kumo-manyčské sníženině – v detailu se liší.' },
            { type: 'callout', variant: 'fact', text: 'Tichý oceán je sám větší než všechna pevnina Země dohromady (pevnina má asi 149 mil. km²).' },
            { type: 'p', text: 'Světadíly jsou ale pro zeměpis příliš velké celky. V Asii se vedle sebe najde poušť i prales, miliardové státy i liduprázdná tundra. Proto je dělíme na menší **regiony** – a první měřítko, podle kterého to jde, je příroda.' },
            { type: 'check', question: { kind: 'tf', q: 'Evropa je samostatný kontinent, protože ji ze všech stran obklopuje moře.', answer: false, explain: 'Evropa je světadíl, ale ne kontinent. S Asií tvoří jednu souvislou pevninu – Eurasii. Hranice mezi nimi je jen dohoda lidí (Ural, Kaspické moře, Kavkaz).' } },
          ],
        },
        {
          title: 'Regiony podle přírody',
          icon: 'leaf',
          blocks: [
            { type: 'p', text: '**Region** je část zemského povrchu, která má něco společného a odlišuje se od okolí. Co přesně „společného“, si volí geograf podle toho, na co se ptá. Nejsnáz se region vymezí podle přírody: podle podnebí, rostlin a reliéfu.' },
            { type: 'p', text: 'Přírodní regiony už vlastně znáš. V lekci „Krajinné pásy a změna klimatu“ jsme viděli, že podnebí rozdělilo Zemi na pásy s typickou vegetací. Připomeň si je na obrázku a hledej, kde se opakují severně i jižně od rovníku:' },
            { type: 'diagram', id: 'biomes', caption: 'Hlavní krajinné pásy Země: tropický deštný les, savana, poušť, listnatý les mírného pásu, tajga a tundra; stepi, hory a ledovce mapa řadí mezi ostatní. Každý pás je přírodní region.' },
            { type: 'p', text: 'Přírodní regiony mají jednu zvláštnost: jejich hranice nejsou čáry, ale široké přechody. Savana nekončí u žádného plotu, postupně řídne a mění se v polopoušť. Státní hranice je naopak přesná čára. Rozdíl ukazuje srovnání:' },
            { type: 'compare', columns: [
              { title: 'Přírodní region', icon: 'leaf', tone: 'a', points: ['vymezuje ho podnebí, reliéf, vegetace', 'hranice je přechodné pásmo', 'mění se pomalu (staletí, tisíciletí)', 'příklad: Sahara, Amazonie, Sibiř'] },
              { title: 'Politický region (stát)', icon: 'flag', tone: 'b', points: ['vymezují ho lidé dohodou nebo válkou', 'hranice je přesná čára', 'může se změnit za jeden den', 'příklad: Egypt, Brazílie, Rusko'] },
            ] },
            { type: 'p', text: 'Sahara tedy zasahuje do deseti států a do Západní Sahary a jediný stát, Rusko, sahá od stepí přes tajgu až po tundru. Přírodní mapa světa se s politickou nekryje. A lidé si svět dělí ještě po svém – podle jazyka, víry a bohatství.' },
            { type: 'check', question: { kind: 'choice', q: 'Čím se liší hranice přírodního regionu od hranice státu?', options: ['přírodní hranice bývá široké přechodné pásmo, státní hranice je přesná čára', 'přírodní hranice je vždy řeka nebo hřeben hor', 'státní hranice se nikdy nemění', 'přírodní regiony nemají žádné hranice'], answer: 0, explain: 'Krajinné pásy do sebe postupně přecházejí, třeba savana v polopoušť. Státní hranici lidé vyměří jako přesnou čáru a mohou ji i změnit.' } },
          ],
        },
        {
          title: 'Regiony podle lidí a hospodářství',
          icon: 'people',
          blocks: [
            { type: 'p', text: 'Regiony nevymezuje jen příroda. V lekci „Jazyky, náboženství a kultury“ jsme viděli, že lidé se sdružují podle jazyka a víry. Takové **kulturní regiony** mají často jiné hranice než světadíly.' },
            { type: 'p', text: 'Nejlepší příklad je Amerika. Podle kontinentů ji dělíme na Severní a Jižní, podle kultury na angloamerickou část a **Latinskou Ameriku**, kde se mluví hlavně španělsky a portugalsky. Na mapě hledej Mexiko – v kterém regionu leží?' },
            { type: 'map', view: 'world', highlight: [
              { codes: ['USA', 'CAN'], tone: 'b', label: 'Angloamerika (anglicky a francouzsky mluvící)' },
              { codes: ['MEX', 'GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'DOM', 'HTI', 'PRI', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'CHL', 'ARG', 'URY', 'PRY', 'BRA', 'GUY', 'SUR', 'JAM', 'TTO', 'BHS'], tone: 'a', label: 'Latinská Amerika a Karibik' },
            ], caption: 'Mexiko patří podle světadílů do Severní Ameriky, podle kultury do Latinské Ameriky. Hranice kulturního regionu vede po hranici USA a Mexika, zčásti po řece Rio Grande.' },
            { type: 'p', text: 'Mexiko je tedy zároveň v Severní i v Latinské Americe – podle toho, na co se ptáme. Třetí měřítko známe z lekce „Globalizace a rozvoj“: bohatství. Podle něj geografové mluví o globálním Severu a globálním Jihu. Ani tady „sever“ a „jih“ neznamenají polohu na glóbu:' },
            { type: 'compare', columns: [
              { title: 'Globální Sever', icon: 'factory', tone: 'a', points: ['vysoké HDP na obyvatele a HDI', 'většina lidí pracuje ve službách', 'stárnoucí obyvatelstvo', 'např. USA, Evropa, Japonsko, ale i Austrálie a Nový Zéland na jižní polokouli'] },
              { title: 'Globální Jih', icon: 'wheat', tone: 'b', points: ['nižší příjmy, velké rozdíly uvnitř států', 'větší podíl zemědělství', 'mladé a rychle rostoucí obyvatelstvo', 'např. většina Afriky, jižní Asie, Latinská Amerika'] },
            ], caption: 'Globální Sever a Jih: hospodářské regiony, ne zeměpisné polokoule. Mezi nimi je spousta států „na cestě“, třeba Čína nebo Mexiko.' },
            { type: 'p', text: 'Jedno místo tak může patřit do několika regionů najednou. Nejvíc ale o světě rozhoduje region, který nosíš v hlavě – tvoje mentální mapa.' },
            { type: 'check', question: { kind: 'multi', q: 'Které tvrzení o Mexiku platí?', options: ['leží ve světadílu Severní Amerika', 'patří do kulturního regionu Latinská Amerika', 'leží na kontinentu Jižní Amerika', 'mluví se v něm převážně španělsky', 'patří do Angloameriky'], answers: [0, 1, 3], explain: 'Mexiko leží v Severní Americe (světadíl), ale jazykem a dějinami patří do Latinské Ameriky. Jižní Amerika začíná až za Panamskou šíjí.' } },
          ],
        },
        {
          title: 'Mentální mapa a její omyly',
          icon: 'map',
          blocks: [
            { type: 'p', text: 'V lekci „Co je zeměpis a jak se ptá“ sis kreslil/a **mentální mapu** svého okolí: obraz místa, který máme v hlavě. Mentální mapu máme i o celém světě – a bývá v ní víc omylů, než bychom čekali.' },
            { type: 'p', text: 'Část omylů pochází z map, které vídáme nejčastěji. Jak Mercatorovo zobrazení zvětšuje území u pólů, víš z lekce „Druhy map a jejich zkreslení“. Tady jsou čtyři omyly, které se v mentálních mapách objevují nejčastěji:' },
            { type: 'iconlist', items: [
              { icon: 'globe', title: '„Grónsko je velké jako Afrika“', text: 'Na Mercatorově mapě ano, ve skutečnosti je Afrika asi 14× větší (30,3 vs 2,2 mil. km²).' },
              { icon: 'flag', title: '„Afrika je jedna země“', text: 'Afrika má 54 států, víc než kterýkoli jiný světadíl, a stovky jazyků.' },
              { icon: 'compass', title: '„Evropa leží daleko na jihu“', text: 'Praha (50° s. š.) leží severněji než celé území USA bez Aljašky.' },
              { icon: 'island', title: '„Austrálie je malý ostrov“', text: 'Austrálie je kontinent o rozloze 7,7 mil. km², skoro jako USA bez Aljašky.' },
            ] },
            { type: 'p', text: 'Mentální mapu si nejlépe opravíš tím, že na slepé mapě hledáš státy a regiony, dokud je nenajdeš bez váhání. Vyzkoušej si to:' },
            { type: 'game', gameId: 'blind-map', text: 'Slepá mapa: najdi státy a regiony světadílů, kterými tě provede tato úroveň.' },
            { type: 'p', text: 'S opravenou mentální mapou se ve světě orientuješ líp. Zbývá domluvit se, jak budeme každý region zkoumat, aby se z regionů nestal jen seznam faktů.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč si mnoho lidí myslí, že Grónsko je velké jako Afrika?', options: ['protože Mercatorovo zobrazení zvětšuje území blízko pólů', 'protože Grónsko je ve skutečnosti větší než Afrika', 'protože na glóbu jsou stejně velké', 'protože Afrika je na mapách vždy zmenšená schválně'], answer: 0, explain: 'Mercatorovo zobrazení je válcové a území daleko od rovníku zvětšuje. Ve skutečnosti je Afrika asi 14× větší než Grónsko.' } },
          ],
        },
        {
          title: 'Region jako nástroj geografa',
          icon: 'pin',
          blocks: [
            { type: 'p', text: 'Region není věc, kterou bychom v krajině našli hotovou. Je to **nástroj**: geograf si ho vymezí, aby mohl porovnávat a vysvětlovat. Dobrý region má jednu hlavní otázku, na kterou odpovídáme.' },
            { type: 'p', text: 'V této úrovni projdeme Afriku, Asii, obě Ameriky, Austrálii s Oceánií a polární oblasti. U každého regionu použijeme nástroje, které už máš z předchozích úrovní, a vždy ve stejném pořadí:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'map', title: 'Poloha a reliéf', text: 'mapa, pohoří, nížiny, řeky' },
              { icon: 'thermometer', title: 'Podnebí a krajinné pásy', text: 'klimatogram, vegetace' },
              { icon: 'people', title: 'Obyvatelé a města', text: 'počet, hustota, věková pyramida' },
              { icon: 'coin', title: 'Hospodářství', text: 'suroviny, zemědělství, průmysl, HDP' },
              { icon: 'warning', title: 'Současný problém', text: 'co region právě teď řeší a proč' },
            ], caption: 'Pět kroků, kterými popíšeme každý region světa.' },
            { type: 'p', text: 'Nejdůležitější je poslední krok: najít vazby. Proč je Sahel chudý? Kvůli podnebí, ale také kvůli rychlému růstu obyvatel a válkám. Zeměpis je silný právě tím, že spojuje přírodu a lidi v jednom vysvětlení.' },
            { type: 'callout', variant: 'mascot', text: 'Na každý region se budu ptát jednou otázkou. A první zní: proč je Afrika nejmladší světadíl? Tipni si odpověď, než otevřeš další lekci.' },
            { type: 'p', text: 'Teď máme nástroje i postup. V příští lekci je použijeme na Afriku – světadíl pouští, pralesů a nejrychleji rostoucího obyvatelstva.' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď kroky, kterými v této úrovni popisujeme každý region.', items: ['poloha a reliéf', 'podnebí a krajinné pásy', 'obyvatelé a města', 'hospodářství', 'současný problém'], explain: 'Začínáme přírodou (reliéf, podnebí), pak přidáme lidi a hospodářství a nakonec hledáme, jak se to všechno projevuje v současném problému regionu.' } },
          ],
        },
      ],
      summary: [
        'Kontinent je souvislá pevnina obklopená mořem, světadíl je díl světa vymezený i podle dějin; Evropa je světadíl, ale s Asií tvoří kontinent Eurasii.',
        'Světadílů je šest, nebo sedm (když dělíme Ameriku); oceány jsou Tichý, Atlantský, Indický, Severní ledový a často se počítá i Jižní.',
        'V Asii žije asi 59 % lidstva, v Africe 19 % (UN WPP 2024).',
        'Region je část povrchu, která má něco společného: přírodní region (krajinný pás), kulturní region (Latinská Amerika) nebo hospodářský region (globální Sever a Jih).',
        'Hranice přírodních regionů jsou přechodná pásma, hranice států přesné čáry.',
        'Mentální mapa světa bývá zkreslená, hlavně kvůli Mercatorovu zobrazení.',
        'Každý region popíšeme stejně: reliéf, podnebí, obyvatelé, hospodářství a současný problém.',
      ],
      quiz: [
        { kind: 'match', q: 'Přiřaď k pojmu správný příklad.', pairs: [
          ['kontinent', 'Eurasie'],
          ['světadíl', 'Evropa'],
          ['kulturní region', 'Latinská Amerika'],
          ['přírodní region', 'Sahara'],
        ], explain: 'Eurasie je souvislá pevnina (kontinent), Evropa světadíl. Latinskou Ameriku spojuje jazyk a dějiny, Saharu podnebí a krajina.' },
        { kind: 'tf', q: 'Ve světadílu Asie žije víc lidí než ve všech ostatních světadílech dohromady.', answer: true, explain: 'V Asii žije asi 4,8 mld. z 8,2 mld. lidí, tedy asi 59 % (UN WPP 2024).' },
        { kind: 'choice', q: 'Který světadíl je rozlohou největší?', options: ['Asie', 'Afrika', 'Severní Amerika', 'Antarktida'], answer: 0, explain: 'Asie má asi 44,6 mil. km², Afrika asi 30,3 mil. km².' },
        { kind: 'text', q: 'Jak se jmenuje oceán, který je sám větší než všechna pevnina Země?', accept: ['Tichý', 'Tichý oceán', 'Pacifik', 'Pacifický oceán'], explain: 'Tichý oceán (Pacifik) je největší oceán. Pevnina má asi 149 mil. km², Tichý oceán víc.' },
        { kind: 'tf', q: 'Globální Jih zahrnuje všechny státy na jižní polokouli.', answer: false, explain: 'Globální Sever a Jih jsou hospodářské regiony. Austrálie a Nový Zéland leží na jižní polokouli, ale patří ke globálnímu Severu.' },
        { kind: 'choice', q: 'Kterým průplavem prochází hranice mezi Afrikou a Asií?', options: ['Suezským', 'Panamským', 'Kielským', 'Korintským'], answer: 0, explain: 'Suezský průplav spojuje Středozemní a Rudé moře a odděluje Afriku od Asie (Sinajského poloostrova).' },
        { kind: 'multi', q: 'Podle čeho můžeme vymezit region?', options: ['podle podnebí a vegetace', 'podle jazyka a náboženství', 'podle bohatství a hospodářství', 'jen podle státních hranic', 'jen podle oceánů'], answers: [0, 1, 2], explain: 'Region si geograf vymezuje podle otázky: přírodní, kulturní nebo hospodářský. Státní hranice jsou jen jedna z možností.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-2
    'z7-2': {
      id: 'z7-2',
      title: 'Afrika',
      goals: [
        'Popsat reliéf, řeky a krajinné pásy Afriky a vysvětlit, proč se pásy na sever a na jih od rovníku opakují',
        'Přečíst klimatogram ze Sahelu a vysvětlit, proč je tento region tak zranitelný',
        'Z věkové pyramidy Nigeru vysvětlit, proč je Afrika nejmladší světadíl a co to znamená pro města',
        'Vysvětlit původ rovných hranic v Africe a rozdíl mezi severní a subsaharskou Afrikou',
      ],
      hook: 'Skoro polovina obyvatel Nigeru ještě neoslavila patnáctiny. V Česku je to každý šestý. Proč je Afrika nejmladší světadíl – a co z toho plyne pro její budoucnost?',
      sections: [
        {
          title: 'Světadíl rozdělený rovníkem',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'Než se zeptáme na lidi, podívejme se, kde Afrika leží. Rovník ji protíná skoro uprostřed a severní i jižní obratník vedou přes její pevninu. Afrika je tak nejvíc „tropický“ světadíl.' },
            { type: 'p', text: 'Na mapě sleduj tři věci: rovník a obratníky, velké řeky a jezera a nejvyšší horu. Všimni si také, kde leží největší města:' },
            { type: 'map', view: 'africa', layers: ['tropics', 'rivers', 'lakes'], points: [
              { lat: -3.07, lon: 37.35, label: 'Kilimandžáro 5 895 m', kind: 'peak' },
              { lat: 30.04, lon: 31.24, label: 'Káhira', kind: 'capital' },
              { lat: 6.45, lon: 3.39, label: 'Lagos', kind: 'city' },
              { lat: -4.32, lon: 15.31, label: 'Kinšasa', kind: 'capital' },
              { lat: 23.0, lon: 10.0, label: 'Sahara', kind: 'place' },
            ], caption: 'Afrika: rovník a obratníky, Nil, Kongo, Niger a Viktoriino jezero. Nejvyšší horou je sopka Kilimandžáro v Tanzanii.' },
            { type: 'p', text: 'Velkou část Afriky tvoří rozsáhlé plošiny a pánve. Ostrou výjimkou je východ: tady se africká deska podél **Východoafrického příkopového systému** pomalu trhá. Vznikly tu hluboké příkopy s jezery a sopky jako Kilimandžáro – přesně podle toho, co víš z lekce „Stavba Země a litosférické desky“.' },
            { type: 'p', text: 'Afrika má i rekordní řeky. Jejich hlavní údaje si zapamatuj:' },
            { type: 'keyterms', items: [
              { term: '**Nil**', def: 'jedna ze dvou nejdelších řek světa (asi 6 650 km); teče z rovníkové Afriky přes Saharu do Středozemního moře a dává život Egyptu' },
              { term: '**Kongo**', def: 'po Amazonce druhá nejvodnější řeka světa; teče rovníkovým pralesem' },
              { term: '**Sahara**', def: 'největší horká poušť světa, asi 9 mil. km², tedy skoro jako celé USA' },
            ] },
            { type: 'p', text: 'Protože rovník leží uprostřed, opakují se krajinné pásy na sever i na jih od něj skoro zrcadlově. Projděme je od Sahary až do pralesa.' },
            { type: 'check', question: { kind: 'tf', q: 'Rovník protíná Afriku přibližně uprostřed, proto se krajinné pásy na sever a na jih od něj opakují.', answer: true, explain: 'Afrika leží na obou stranách rovníku. Severně i jižně od pralesa najdeme savanu a dál pouště (Sahara na severu, Namib a Kalahari na jihu).' } },
          ],
        },
        {
          title: 'Od Sahary k pralesu',
          icon: 'dune',
          blocks: [
            { type: 'p', text: 'Proč je na rovníku prales a o pár tisíc kilometrů severněji poušť? Odpověď znáš z lekce „Oběh vzduchu a podnebné pásy“: nad rovníkem vzduch stoupá a prší, v obratníkových oblastech vysokého tlaku klesá, otepluje se a srážky v něm nevznikají.' },
            { type: 'p', text: 'Mezi pouští a pralesem leží přechodné pásy. Projdi řez Afrikou od severu k jihu a sleduj, jak přibývá srážek a vegetace:' },
            { type: 'diagram', id: 'sahel-transect', caption: 'Řez Afrikou: Sahara → Sahel → savana → tropický deštný les. Deštivý pás se v létě posouvá na sever, v zimě zpět k rovníku.' },
            { type: 'p', text: 'Nejzajímavější je úzký pás na jižním okraji Sahary – **Sahel** (arabsky „břeh“ pouště). Jak tu vypadá rok, ukazuje klimatogram hlavního města Nigeru. Hledej, kolik měsíců vůbec neprší:' },
            { type: 'climate', places: [
              { name: 'Niamey (Niger)', temp: [24.6, 27.8, 31.9, 34.7, 34.5, 32.2, 29.5, 28.1, 29.6, 31.5, 29, 25.5], precip: [0, 0.3, 0.2, 9.8, 25.3, 78.6, 145.6, 192.6, 85.1, 16.7, 0, 0], altitude: 223, source: 'normál 1991–2020' },
            ], caption: 'Niamey: horko celý rok, asi 550 mm srážek za rok, z toho přes 90 % od června do září.' },
            { type: 'p', text: 'Srážek je za rok asi 550 mm, dokonce víc než v Praze (Klementinum asi 450 mm). Jenže v Niamey spadnou skoro všechny za čtyři měsíce a při teplotách kolem 30 °C se rychle odpaří. Osm měsíců je sucho. Když deštivý pás v některém roce na sever nedojde, období dešťů selže a s ním i úroda.' },
            { type: 'game', gameId: 'climate-chart', text: 'Klimatogram: poznáš, ze kterého regionu světa graf pochází?' },
            { type: 'p', text: 'Sahel tedy žije na hraně: jedno suché léto stačí k hladu. Podívejme se, co se v tomto pásu děje dnes.' },
            { type: 'check', question: { kind: 'choice', q: 'Co je pro klimatogram Niamey (Sahel) nejtypičtější?', options: ['krátké období dešťů v létě a dlouhé suché období', 'déšť rovnoměrně po celý rok', 'mrazivá zima a teplé léto', 'skoro žádné srážky po celý rok'], answer: 0, explain: 'V Niamey spadne asi 550 mm, ale skoro všechno od června do září. Osm měsíců je sucho a teploty jsou celý rok vysoké.' } },
          ],
        },
        {
          title: 'Sahel: život na hraně pouště',
          icon: 'rain',
          blocks: [
            { type: 'p', text: 'Sahel je jeden z nejchudších a nejrychleji rostoucích regionů světa. Táhne se napříč celou Afrikou, od Atlantiku po Rudé moře. Na mapě hledej, kterými státy prochází:' },
            { type: 'map', view: 'africa', bands: [{ from: 12, to: 18, label: 'Sahel (přibližně)', tone: 'b' }], highlight: [
              { codes: ['SEN', 'MRT', 'MLI', 'BFA', 'NER', 'TCD', 'SDN'], tone: 'a', label: 'státy Sahelu' },
            ], points: [
              { lat: 13.51, lon: 2.11, label: 'Niamey', kind: 'capital' },
              { lat: 13.0, lon: 14.5, label: 'Čadské jezero', kind: 'place' },
            ], caption: 'Sahel: pás polopouští a suchých savan mezi Saharou a savanou, s ročními srážkami asi 200–600 mm.' },
            { type: 'p', text: 'V 70. a 80. letech 20. století postihla Sahel dlouhá sucha a hladomory. Čadské jezero se tehdy zmenšilo na zlomek své plochy. Krajina ale netrpí jen suchem. Proč se okraj pouště posouvá, ukazuje tento sled:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'people', title: 'Víc lidí a stád', text: 'obyvatel rychle přibývá' },
              { icon: 'tree', title: 'Kácení a spásání', text: 'mizí keře a tráva' },
              { icon: 'wind', title: 'Eroze', text: 'vítr a lijáky odnášejí půdu' },
              { icon: 'dune', title: 'Dezertifikace', text: 'z polopouště se stává poušť' },
            ], caption: 'Dezertifikace: poušť se rozšiřuje tam, kde se sejde sucho s nadměrným využíváním půdy.' },
            { type: 'p', text: 'Proti tomu stojí projekt **Velké zelené zdi**: od roku 2007 státy Africké unie obnovují stromy a půdu v pásu dlouhém asi 8 000 km napříč Sahelem. Daří se jen místy, protože region zasahují i války. V Mali, Burkině Faso a Nigeru se v letech 2020–2023 chopily moci armády a bojují s ozbrojenými skupinami. V Súdánu zuří od dubna 2023 válka, která podle OSN vyhnala z domovů asi 14 milionů lidí (UNHCR, konec roku 2025) – je to největší krize vysídlení na světě.' },
            { type: 'callout', variant: 'warning', text: 'Pozor na zjednodušení „Sahel je chudý, protože je tam poušť“. Sucho je jen jedna příčina. Chudobu prohlubuje rychlý růst obyvatel, eroze, slabé státy a války – a ty se navzájem posilují.' },
            { type: 'p', text: 'Rychlý růst obyvatel je tedy součástí sahelského problému. Podívejme se, proč Afričanů přibývá rychleji než kdekoli jinde.' },
            { type: 'check', question: { kind: 'multi', q: 'Co přispívá k dezertifikaci v Sahelu?', options: ['nadměrné spásání stády', 'kácení keřů a stromů na palivo', 'eroze půdy větrem a lijáky', 'příliš mnoho srážek v zimě', 'chladné podnebí'], answers: [0, 1, 2], explain: 'Poušť se šíří tam, kde se k suchu přidá spásání, kácení a následná eroze. V Sahelu v zimě skoro neprší a je tam horko.' } },
          ],
        },
        {
          title: 'Nejmladší světadíl',
          icon: 'baby',
          blocks: [
            { type: 'p', text: 'Teď už můžeme odpovědět na otázku z úvodu. V Africe žilo v roce 2024 asi **1,5 miliardy lidí** a do roku 2050 jich bude podle OSN asi 2,5 miliardy (UN WPP 2024). Proč tak rychle?' },
            { type: 'p', text: 'Odpověď ukáže věková pyramida, kterou umíš číst z lekce „Porodnost, úmrtnost a věková pyramida“. Podívej se na Niger a hledej, jak široká je základna oproti vrcholu:' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Niger 2024', male: [8.98, 7.83, 6.87, 5.77, 4.67, 3.69, 2.88, 2.32, 1.94, 1.57, 1.25, 1.01, 0.78, 0.56, 0.37, 0.18, 0.07, 0.02], female: [8.71, 7.58, 6.63, 5.57, 4.5, 3.54, 2.76, 2.22, 1.84, 1.49, 1.21, 0.99, 0.8, 0.59, 0.4, 0.24, 0.11, 0.03], source: 'UN World Population Prospects 2024' },
            ], caption: 'Niger 2024: 46,6 % obyvatel je mladších 15 let, jen 2,6 % je starších 65 let. Typická progresivní pyramida.' },
            { type: 'p', text: 'Pyramida má širokou základnu: ženy v Nigeru mají v průměru kolem šesti dětí. Úmrtnost dětí přitom klesla, takže většina z nich vyroste. Když tyto děti dospějí, budou mít děti zase ony – a obyvatel přibývá dál, i kdyby se rodilo méně dětí na jednu ženu. V Česku je dětí do 15 let asi 16 % a lidí nad 65 let asi 21 %.' },
            { type: 'p', text: 'Kde budou miliardy mladých Afričanů žít? Stále víc ve městech. Tabulka ukazuje nejlidnatější státy a největší město světadílu:' },
            { type: 'table', headers: ['stát', 'obyvatel 2024', 'zajímavost'], rows: [
              ['Nigérie', '232,7 mil.', 'nejlidnatější stát Afriky; Lagos patří k nejrychleji rostoucím městům světa'],
              ['Etiopie', '132,1 mil.', 'vnitrozemský stát, nikdy nebyla dlouhodobě kolonií'],
              ['Egypt', '116,5 mil.', 'aglomerace Káhiry má asi 32 mil. obyvatel – největší město Afriky (OSN 2025)'],
              ['DR Kongo', '109,3 mil.', 'Kinšasa je největší francouzsky mluvící město světa'],
            ], caption: 'Nejlidnatější státy Afriky (UN WPP 2024); Káhira podle UN World Urbanization Prospects 2025.' },
            { type: 'p', text: 'Mladé obyvatelstvo je velká šance: do roku 2050 přibude lidí v produktivním věku nejvíc právě v Africe. Potřebuje ale školy, práci a bydlení – a o těch rozhoduje hospodářství a hranice států, které Afrika zdědila.' },
            { type: 'check', question: { kind: 'number', q: 'Ve věkové pyramidě Nigeru tvoří skupiny 0–4, 5–9 a 10–14 let dohromady asi 17,7 %, 15,4 % a 13,5 % obyvatel. Kolik procent obyvatel je mladších 15 let?', answer: 46.6, tolerance: 0.2, unit: '%', explain: '17,7 % + 15,4 % + 13,5 % = 46,6 %. Skoro polovina obyvatel Nigeru jsou děti.' } },
          ],
        },
        {
          title: 'Hranice, suroviny a dva regiony',
          icon: 'border',
          blocks: [
            { type: 'p', text: 'Proč mají některé africké státy hranice jako podle pravítka? Na **Berlínské konferenci** (1884–1885) se evropské mocnosti dohodly na pravidlech, jak si Afriku rozdělí. Hranice pak kreslily v Evropě, často po rovnoběžkách a polednících, bez ohledu na národy a jazyky.' },
            { type: 'p', text: 'Většina států získala nezávislost kolem roku 1960, ale koloniální hranice si ponechala. Proto žijí příbuzné národy v různých státech a různé národy v jednom státě. Co Afrika nabízí světu a co jí to přináší, shrnují karty:' },
            { type: 'iconlist', items: [
              { icon: 'pickaxe', title: 'Kobalt z DR Konga', text: 'asi tři čtvrtiny světové těžby; je v bateriích telefonů a elektromobilů' },
              { icon: 'oil-barrel', title: 'Ropa z Nigérie a Angoly', text: 'hlavní vývozní zboží, které ale zaměstná málo lidí' },
              { icon: 'diamond', title: 'Diamanty z Botswany', text: 'příklad, jak může surovina pomoci, když stát dobře hospodaří' },
              { icon: 'coffee', title: 'Káva a kakao', text: 'Pobřeží slonoviny a Ghana vypěstují zhruba polovinu světového kakaa' },
            ] },
            { type: 'p', text: 'Bohatství pod zemí často nedorazí k lidem. Ze surovin se vyváží hlavně nezpracovaná surovina a zisk zůstane malé skupině. Nigérie, největší producent ropy v Africe, měla v roce 2024 HDP jen asi 1 000 USD na obyvatele, Česko přes 30 000 USD (Světová banka). Afriku přitom geografové dělí na dva velmi odlišné regiony:' },
            { type: 'compare', columns: [
              { title: 'Severní Afrika', icon: 'dune', tone: 'a', points: ['Egypt, Libye, Tunisko, Alžírsko, Maroko', 'arabština a islám', 'Sahara a pobřeží Středozemního moře', 'blíže k Evropě a Blízkému východu'] },
              { title: 'Subsaharská Afrika', icon: 'tree', tone: 'b', points: ['státy jižně od Sahary', 'stovky jazyků, křesťanství, islám i tradiční náboženství', 'savany, pralesy, vysočiny', 'nejmladší a nejrychleji rostoucí obyvatelstvo'] },
            ], caption: 'Sahara dělí Afriku na dva kulturní regiony.' },
            { type: 'p', text: 'Afrika je tedy mladá, bohatá na suroviny, ale chudá na příjmy. V příští lekci přeskočíme do regionu, kde žije ještě víc lidí – do monzunové Asie.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč mají mnohé africké státy rovné hranice?', options: ['hranice nakreslily evropské mocnosti při dělení Afriky, často po rovnoběžkách a polednících', 'vedou podél rovných řek', 'tak se rozhodly africké národy po roce 1960, aby to bylo spravedlivé', 'protože v poušti nejsou žádné přírodní překážky, takže tam hranice vznikly samy'], answer: 0, explain: 'Dělení Afriky mezi evropské mocnosti odstartovala Berlínská konference (1884–1885). Hranice vedly často po rovnoběžkách a polednících a nové státy je po nezávislosti převzaly.' } },
          ],
        },
      ],
      summary: [
        'Rovník protíná Afriku skoro uprostřed, proto se krajinné pásy na sever a na jih opakují: prales, savana, polopoušť, poušť.',
        'Na východě se africká deska trhá podél Východoafrického příkopového systému; tam leží Kilimandžáro (5 895 m) a hluboká jezera.',
        'Sahel na jižním okraji Sahary dostane srážky jen v krátkém létě; sucha, dezertifikace a války z něj dělají jeden z nejzranitelnějších regionů světa.',
        'Afrika je nejmladší světadíl: v Nigeru je skoro polovina obyvatel mladších 15 let a Afriky se do roku 2050 rozroste z 1,5 na asi 2,5 mld. lidí.',
        'Rovné hranice jsou dědictvím koloniálního dělení Afriky, které odstartovala Berlínská konference (1884–1885).',
        'Afrika je bohatá na suroviny (kobalt, ropa, diamanty), ale většina států zůstává chudá.',
        'Sahara dělí Afriku na arabskou severní Afriku a subsaharskou Afriku.',
      ],
      quiz: [
        { kind: 'tf', q: 'Sahel leží na severním okraji Sahary u Středozemního moře.', answer: false, explain: 'Sahel je pás na jižním okraji Sahary, mezi pouští a savanou, od Senegalu po Súdán.' },
        { kind: 'choice', q: 'Která africká řeka je po Amazonce druhá nejvodnější na světě?', options: ['Kongo', 'Nil', 'Niger', 'Zambezi'], answer: 0, explain: 'Kongo teče rovníkovým pralesem, kde prší celý rok, proto nese obrovské množství vody. Nil je delší, ale méně vodný.' },
        { kind: 'order', q: 'Seřaď krajinné pásy od Středozemního moře na jih k rovníku.', items: ['Sahara (poušť)', 'Sahel (polopoušť a suchá savana)', 'savana', 'tropický deštný les'], explain: 'Směrem k rovníku přibývá srážek, a proto i vegetace: poušť → Sahel → savana → prales.' },
        { kind: 'match', q: 'Přiřaď africký stát k tomu, čím je známý.', pairs: [
          ['Nigérie', 'nejlidnatější stát Afriky'],
          ['DR Kongo', 'největší těžba kobaltu'],
          ['Egypt', 'Káhira, největší město Afriky'],
          ['Tanzanie', 'Kilimandžáro'],
        ], explain: 'Nigérie má přes 230 mil. obyvatel, DR Kongo vytěží asi tři čtvrtiny kobaltu světa, Káhira je největší africké město a Kilimandžáro leží v Tanzanii.' },
        { kind: 'tf', q: 'Ve věkové pyramidě Nigeru tvoří lidé starší 65 let méně než 3 % obyvatel.', answer: true, explain: 'Podle UN WPP 2024 je v Nigeru starších 65 let jen asi 2,6 % obyvatel, mladších 15 let asi 46,6 %.' },
        { kind: 'multi', q: 'Proč obyvatel Afriky přibývá tak rychle?', options: ['ženy mají v průměru hodně dětí', 'úmrtnost dětí klesla, takže většina dětí vyroste', 'obyvatelstvo je mladé, brzy samo založí rodiny', 'do Afriky se stěhuje víc lidí z jiných světadílů, než kolik jich odchází', 'lidé v Africe žijí déle než v Evropě'], answers: [0, 1, 2], explain: 'Vysoká porodnost, klesající úmrtnost a mladá struktura obyvatel. Přistěhovalectví ani delší život v tom roli nehrají – naděje dožití je v Africe nižší než v Evropě.' },
        { kind: 'choice', q: 'V Niamey spadne asi 550 mm srážek za rok, víc než v Praze. Proč je tam přesto většinu roku sucho?', options: ['srážky spadnou za čtyři měsíce a při vysokých teplotách se rychle odpaří', 'srážky padají jen jako sníh', 'v Niamey je zima, takže voda zamrzne', 'srážky spadnou jen v zimě, kdy je nikdo nepotřebuje'], answer: 0, explain: 'Rozhoduje rozložení srážek a výpar. V Sahelu prší jen od června do září a při teplotách kolem 30 °C se voda rychle odpaří; osm měsíců je sucho.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-3
    'z7-3': {
      id: 'z7-3',
      title: 'Asie: východ a jih',
      goals: [
        'Ukázat na mapě východní, jižní a jihovýchodní Asii, Himaláje a velké řeky regionu',
        'Vysvětlit monzun a přečíst klimatogram z monzunové Asie',
        'Vysvětlit, proč říční nížiny a rýže uživí tolik lidí, a porovnat hustotu zalidnění',
        'Porovnat Čínu, Indii a Japonsko podle počtu obyvatel, stárnutí a hospodářství',
      ],
      hook: 'Ve východní a jižní Asii žije asi 3,6 miliardy lidí – skoro každý druhý člověk na Zemi. Jak je možné, že se na tak malém kousku světa uživí tolik lidí?',
      sections: [
        {
          title: 'Monzunová Asie na mapě',
          icon: 'map',
          blocks: [
            { type: 'p', text: 'Asie je tak velká, že ji probereme ve dvou lekcích. V této začneme jejím lidnatějším koncem: východní, jižní a jihovýchodní Asií. Geografové jim společně říkají **monzunová Asie** – proč, uvidíme za chvíli.' },
            { type: 'p', text: 'Na mapě najdi tři barevné regiony a mezi nimi nejvyšší hory světa. Všimni si, kde leží hlavní města:' },
            { type: 'map', view: 'asia', layers: ['rivers'], highlight: [
              { codes: ['CHN', 'JPN', 'KOR', 'PRK', 'MNG', 'TWN'], tone: 'a', label: 'východní Asie' },
              { codes: ['IND', 'PAK', 'BGD', 'NPL', 'BTN', 'LKA', 'MDV'], tone: 'b', label: 'jižní Asie' },
              { codes: ['IDN', 'MYS', 'THA', 'VNM', 'PHL', 'MMR', 'KHM', 'LAO', 'SGP', 'BRN', 'TLS'], tone: 'c', label: 'jihovýchodní Asie' },
            ], points: [
              { lat: 27.99, lon: 86.93, label: 'Mount Everest 8 849 m', kind: 'peak' },
              { lat: 39.9, lon: 116.41, label: 'Peking', kind: 'capital' },
              { lat: 35.68, lon: 139.69, label: 'Tokio', kind: 'capital' },
              { lat: 28.61, lon: 77.21, label: 'Dillí', kind: 'capital' },
              { lat: 23.81, lon: 90.41, label: 'Dháka', kind: 'capital' },
              { lat: -6.21, lon: 106.85, label: 'Jakarta', kind: 'capital' },
            ], caption: 'Monzunová Asie: východní, jižní a jihovýchodní Asie. Z Himálaje a Tibetu stékají Jang-c’-ťiang, Chuang-che, Mekong, Brahmaputra, Indus i Ganga.' },
            { type: 'p', text: 'Uprostřed regionu stojí Himaláje a Tibetská náhorní plošina, v průměru asi 4 500 m n. m. Jak tak vysoké hory vznikly? Indická deska se před desítkami milionů let srazila s euroasijskou a tlačí do ní dodnes:' },
            { type: 'diagram', id: 'himalaya-section', caption: 'Indická deska se podsouvá pod euroasijskou. Vrstvy hornin se vrásní a Himaláje i Tibet se zvedají o několik milimetrů ročně.' },
            { type: 'p', text: 'Himaláje jsou tedy **mladé pohoří**, jak víš z lekce „Jak vznikají pohoří“, a proto tak vysoké a strmé. Pro miliardy lidí jsou ale důležitější jinak: jsou zdrojem velkých řek a zastavují vzduch, který přináší déšť.' },
            { type: 'check', question: { kind: 'choice', q: 'Jak vznikly Himaláje?', options: ['srážkou indické a euroasijské desky', 'sopečnou činností nad horkou skvrnou', 'rozestupováním dvou desek', 'erozí ledovců na rovině'], answer: 0, explain: 'Indická deska narazila do euroasijské a stále do ní tlačí. Horniny se vrásní a vyzdvihují – Himaláje jsou mladé vrásové pohoří.' } },
          ],
        },
        {
          title: 'Monzun: déšť, který živí miliardy',
          icon: 'rain',
          blocks: [
            { type: 'p', text: 'Proč se regionu říká monzunový? V lekci „Oběh vzduchu a podnebné pásy“ jsme poznali **monzun**: vítr, který během roku mění směr. Nikde není tak silný jako tady, protože obrovská pevnina Asie leží vedle teplého Indického oceánu.' },
            { type: 'p', text: 'Sleduj na obrázku, odkud vane vítr v létě a odkud v zimě a kde přitom prší:' },
            { type: 'diagram', id: 'monsoon', caption: 'Letní monzun: pevnina se ohřeje, vlhký vzduch proudí z oceánu na pevninu a prší. Zimní monzun: suchý vzduch proudí z chladné pevniny k moři.' },
            { type: 'p', text: 'Jak to vypadá v praxi, ukazuje klimatogram Bombaje (Mumbaje), největšího přístavu Indie. Porovnej srážky v červenci a v únoru:' },
            { type: 'climate', places: [
              { name: 'Bombaj (Indie)', temp: [24.6, 25.3, 27.6, 28.8, 30.2, 29.3, 27.9, 27.8, 27.9, 29, 28, 25.8], precip: [0.2, 0.2, 0.1, 0.1, 7.3, 526.3, 919.9, 560.8, 383.5, 91.3, 11, 1.6], source: 'normál 1991–2020 (IMD)' },
            ], caption: 'Bombaj: asi 2 500 mm srážek za rok, z toho asi 95 % od června do září. Od prosince do dubna skoro neprší.' },
            { type: 'p', text: 'Za čtyři letní měsíce tu spadne víc než pětkrát víc vody než v Praze za celý rok. Všimni si i teploty: nejtepleji je v květnu, těsně před příchodem dešťů. Když monzun přijde pozdě nebo je slabý, hrozí neúroda; když je silný, zaplaví města i pole. Rekordy drží vesnice Mawsynram v pohoří Khásí na severovýchodě Indie s průměrem kolem 11 800 mm za rok.' },
            { type: 'callout', variant: 'tip', text: 'Na klimatogramu poznáš monzun podle „hory“ srážek v létě a skoro prázdných zimních měsíců – při teplotách nad 20 °C po celý rok.' },
            { type: 'p', text: 'Monzunové deště tedy přinášejí vodu, řeky ji rozvádějí do nížin. Co na tom lidé pěstují a proč to uživí tolik lidí?' },
            { type: 'check', question: { kind: 'tf', q: 'Letní monzun v Indii vane z pevniny na moře, a proto je léto suché.', answer: false, explain: 'Je to obráceně. V létě se pevnina ohřeje, vlhký vzduch proudí z Indického oceánu na pevninu a přináší vydatné deště. Suchý je zimní monzun.' } },
          ],
        },
        {
          title: 'Řeky a rýže',
          icon: 'wheat',
          blocks: [
            { type: 'p', text: 'Velké asijské řeky každý rok rozlévají povodně a ukládají úrodné náplavy. V jejich nížinách a deltách – na Ganze, Brahmaputře, Jang-c’-ťiangu, Mekongu – se rýže pěstuje tisíce let a žije tu nejvíc lidí.' },
            { type: 'p', text: 'Klíčem je **rýže**. Roste na zaplavených polích, která monzun s řekami zalévají, a ze stejné plochy uživí víc lidí než pšenice. Na svazích se pro ni budují terasy. Asie vypěstuje asi 90 % rýže světa a nejvíc Čína a Indie. Výsledek je vidět na hustotě zalidnění:' },
            { type: 'table', headers: ['stát', 'hustota zalidnění (obyv./km²)', 'pro srovnání'], rows: [
              ['Bangladéš', '≈ 1 170', 'skoro celý stát je delta Gangy a Brahmaputry'],
              ['Indie', '≈ 440', 'třikrát hustěji než Česko'],
              ['Japonsko', '≈ 330', 'lidé žijí hlavně v pobřežních nížinách'],
              ['Čína', '≈ 150', 'průměr: přeplněný východ, prázdný Tibet a pouště'],
              ['Česko', '≈ 138', ''],
            ], caption: 'Hustota zalidnění 2024 (počet obyvatel UN WPP 2024, Česko ČSÚ / rozloha státu), zaokrouhleno.' },
            { type: 'p', text: 'Pozor, průměrná hustota může klamat. Čína má průměr jen o málo vyšší než Česko, ale její obyvatelé se tísní na východě, v nížinách řek a na pobřeží. Hory a pouště na západě jsou skoro prázdné – jak jsme viděli v lekci „Kolik nás je a kde žijeme“.' },
            { type: 'callout', variant: 'fact', text: 'Na Jang-c’-ťiangu stojí přehrada Tři soutěsky, největší vodní elektrárna světa (22,5 GW). Kvůli její nádrži se muselo vystěhovat přes milion lidí.' },
            { type: 'p', text: 'Celý řetěz příčin, proč jsou monzunové nížiny tak lidnaté, si shrň v pěti krocích:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'rain', title: 'Letní monzun', text: 'vydatné deště' },
              { icon: 'river', title: 'Velké řeky', text: 'rozlévají vodu do nížin' },
              { icon: 'soil', title: 'Úrodné náplavy', text: 'každá povodeň přinese nové bahno' },
              { icon: 'wheat', title: 'Rýže', text: 'zaplavená pole, dvě i tři sklizně ročně' },
              { icon: 'people', title: 'Hustě osídlená krajina', text: 'stovky lidí na km²' },
            ] },
            { type: 'p', text: 'Řeky a rýže tedy vysvětlují, proč tu žije tolik lidí. Teď se podíváme na samotné populační obry – a na to, proč jeden stárne a druhý ne.' },
            { type: 'check', question: { kind: 'number', q: 'Bangladéš má asi 174 mil. obyvatel na ploše asi 148 000 km². Jaká je jeho hustota zalidnění? (zaokrouhli na stovky)', answer: 1200, tolerance: 100, unit: 'obyv./km²', explain: '174 000 000 : 148 000 km² ≐ 1 176 obyv./km², tedy asi 1 200 obyv./km² – osmkrát víc než v Česku.' } },
          ],
        },
        {
          title: 'Populační obři',
          icon: 'people',
          blocks: [
            { type: 'p', text: 'V roce 2023 předstihla Indie Čínu a stala se nejlidnatějším státem světa (OSN). Obě mají přes 1,4 miliardy obyvatel. Jejich populace se ale vyvíjí opačně – a s nimi i Japonsko, nejrychleji stárnoucí velký stát.' },
            { type: 'p', text: 'Porovnej v tabulce počet obyvatel a bohatství. Sleduj, jak spolu souvisí:' },
            { type: 'table', headers: ['stát', 'obyvatel 2024', 'HDP na obyvatele', 'jak se mění'], rows: [
              ['Indie', '1 451 mil.', '≈ 2 700 USD', 'roste, mladé obyvatelstvo'],
              ['Čína', '1 419 mil.', '≈ 13 000 USD', 'od roku 2022 ubývá, rychle stárne'],
              ['Indonésie', '283 mil.', '≈ 4 900 USD', 'roste'],
              ['Japonsko', '124 mil.', '≈ 33 000 USD', 'ubývá, asi 29 % lidí je starších 65 let'],
            ], caption: 'Obyvatelé: UN WPP 2024. HDP na obyvatele: Světová banka 2024, zaokrouhleno.' },
            { type: 'p', text: 'Čína dlouho omezovala porodnost politikou jednoho dítěte, a dnes jí proto rychle ubývá mladých lidí. Indie je mladší a ještě poroste. Japonsko ukazuje budoucnost obou: málo dětí, hodně seniorů a ubývající obyvatelstvo. Přesto se lidé dál stěhují do měst. Podle OSN (2025) leží v monzunové Asii tři největší města světa. Najdi je na mapě:' },
            { type: 'map', view: 'asia', points: [
              { lat: -6.21, lon: 106.85, label: 'Jakarta 41,9 mil.', kind: 'capital' },
              { lat: 23.81, lon: 90.41, label: 'Dháka 36,6 mil.', kind: 'capital' },
              { lat: 35.68, lon: 139.69, label: 'Tokio 33,4 mil.', kind: 'capital' },
              { lat: -0.97, lon: 116.7, label: 'Nusantara (staví se)', kind: 'place' },
            ], caption: 'Tři největší města světa podle UN World Urbanization Prospects 2025 (počty obyvatel celých městských aglomerací).' },
            { type: 'p', text: 'Největší město světa tedy už není Tokio, ale Jakarta. Japonců ubývá, zatímco do Jakarty a Dháky se stěhují miliony lidí z venkova.' },
            { type: 'callout', variant: 'fact', text: 'Jakarta se propadá, protože se pod ní čerpá podzemní voda, a trpí záplavami. Indonésie proto staví na Borneu nové hlavní město Nusantara. Hlavním městem je ale stále Jakarta: podle nařízení z roku 2025 se do Nusantary má do roku 2028 přestěhovat vláda a parlament jako do „politického hlavního města“. Stavba se zpomalila a termín je nejistý.' },
            { type: 'p', text: 'Velké populace jsou zároveň velké trhy a levná pracovní síla. To z monzunové Asie udělalo dílnu světa.' },
            { type: 'check', question: { kind: 'choice', q: 'Který stát je od roku 2023 nejlidnatější na světě?', options: ['Indie', 'Čína', 'Indonésie', 'USA'], answer: 0, explain: 'Podle OSN předstihla Indie v roce 2023 Čínu. Obě mají přes 1,4 miliardy obyvatel, ale Číně obyvatel ubývá a Indii přibývá.' } },
          ],
        },
        {
          title: 'Dílna a laboratoř světa',
          icon: 'factory',
          blocks: [
            { type: 'p', text: 'V lekci „Průmysl“ jsme viděli, že továrny se stěhují tam, kde je dost pracovníků, energie a dobré dopravy. Východní Asie to splnila jako nikdo jiný. Čína dnes vyrábí skoro třetinu průmyslového zboží světa.' },
            { type: 'p', text: 'Každý region ale dělá něco jiného. Sleduj na mapě cestu chytrého telefonu, než se dostane do tvé kapsy:' },
            { type: 'diagram', id: 'supply-chain', caption: 'Cesta chytrého telefonu: suroviny z Afriky a Jižní Ameriky, součástky z Japonska, Koreje a Tchaj-wanu, montáž v Číně a Indii, návrh a prodej v USA a Evropě.' },
            { type: 'p', text: 'Japonsko a Jižní Korea jsou bohaté technologické státy (auta, elektronika, lodě). Tchaj-wan vyrábí většinu nejvýkonnějších čipů světa. Indie je silná ve službách: v Bengalúru pracují statisíce programátorů pro firmy z celého světa. Rychlý průmysl má ale i stinnou stránku – vzduch. Dillí patřilo podle měření IQAir (2024) k nejznečištěnějším hlavním městům světa a v zimě tam smog zavírá školy.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: otázky z regionů světa – řeky, monzun, města a státy.' },
            { type: 'p', text: 'Monzunová Asie je tedy region rýže, megaměst i továren. Zbytek Asie vypadá úplně jinak: v příští lekci nás čeká poušť, ropa, step a mrazivá Sibiř.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď stát k tomu, čím je jeho hospodářství známé.', pairs: [
              ['Čína', 'montáž a výroba pro celý svět'],
              ['Tchaj-wan', 'nejvýkonnější čipy'],
              ['Indie', 'programování a IT služby'],
              ['Japonsko', 'auta a elektronika'],
            ], explain: 'Čína je „dílnou světa“, Tchaj-wan vyrábí většinu nejvýkonnějších čipů, Indie vyváží IT služby (Bengalúru) a Japonsko je známé auty a elektronikou.' } },
          ],
        },
      ],
      summary: [
        'Monzunovou Asii tvoří východní, jižní a jihovýchodní Asie; žije v ní víc než polovina lidstva.',
        'Himaláje (Mount Everest 8 849 m) a Tibet vznikly srážkou indické a euroasijské desky a pořád se zvedají.',
        'Letní monzun nese vlhký vzduch z oceánu a přináší vydatné deště, zimní monzun je suchý; v Bombaji spadne většina srážek od června do září.',
        'Úrodné nížiny a delty řek a pěstování rýže uživí velmi hustě zalidněné oblasti (Bangladéš přes 1 100 obyv./km²).',
        'Indie je od roku 2023 nejlidnatějším státem světa; Číně obyvatel od roku 2022 ubývá a Japonsko je nejrychleji stárnoucí velký stát.',
        'Jakarta, Dháka a Tokio jsou největší města světa (OSN 2025); Indonésie staví politické hlavní město Nusantara, hlavním městem zůstává Jakarta.',
        'Východní Asie je dílnou a laboratoří světa: Čína vyrábí, Tchaj-wan, Japonsko a Korea vyvíjejí technologie, Indie poskytuje IT služby.',
      ],
      quiz: [
        { kind: 'tf', q: 'Nejvíc srážek spadne v Bombaji v zimních měsících.', answer: false, explain: 'V Bombaji prší hlavně od června do září, kdy vane letní monzun z oceánu. V zimě skoro neprší.' },
        { kind: 'choice', q: 'Proč uživí monzunové nížiny tolik lidí?', options: ['monzun a řeky dodávají vodu a úrodné náplavy pro rýži', 'leží vysoko v horách, kde je chladno', 'je tam celý rok sucho, takže se nemusí odvodňovat', 'nikdy tam nejsou povodně'], answer: 0, explain: 'Voda z monzunu a řek a úrodné náplavy umožňují pěstovat rýži, která ze stejné plochy uživí hodně lidí.' },
        { kind: 'multi', q: 'Které řeky pramení v Himálaji nebo v Tibetu?', options: ['Jang-c’-ťiang', 'Brahmaputra', 'Mekong', 'Nil', 'Amazonka'], answers: [0, 1, 2], explain: 'Z „vodárny Asie“ stékají Jang-c’-ťiang, Chuang-che, Mekong, Brahmaputra i Indus. Nil a Amazonka jsou v Africe a Jižní Americe.' },
        { kind: 'tf', q: 'Hlavním městem Indonésie je v roce 2026 stále Jakarta.', answer: true, explain: 'Nusantara se staví jako „politické hlavní město“ s cílem přestěhovat vládu do roku 2028. Hlavním městem zůstává Jakarta.' },
        { kind: 'order', q: 'Seřaď státy od nejvyšší po nejnižší hustotu zalidnění.', items: ['Bangladéš', 'Indie', 'Japonsko', 'Čína'], explain: 'Bangladéš ≈ 1 170, Indie ≈ 440, Japonsko ≈ 330, Čína ≈ 150 obyv./km².' },
        { kind: 'choice', q: 'Co čeká Čínu podle vývoje jejího obyvatelstva?', options: ['ubývání a rychlé stárnutí obyvatel', 'nejrychlejší růst obyvatel na světě', 'nejmladší obyvatelstvo v Asii', 'stálý počet obyvatel bez stárnutí'], answer: 0, explain: 'Po desetiletích politiky jednoho dítěte se v Číně rodí málo dětí. Obyvatel ubývá od roku 2022 a podíl seniorů rychle roste.' },
        { kind: 'text', q: 'Jak se jmenuje vítr, který v jižní Asii mění směr podle ročního období a v létě přináší deště?', accept: ['monzun', 'monzuny', 'letní monzun'], explain: 'Monzun vane v létě z oceánu na pevninu (deště), v zimě z pevniny na oceán (sucho).' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-4
    'z7-4': {
      id: 'z7-4',
      title: 'Asie: západ, střed a sever',
      goals: [
        'Vymezit na mapě Blízký východ, Střední Asii a Sibiř a porovnat jejich podnebí podle klimatogramů',
        'Vysvětlit, proč je Blízký východ důležitý pro ropu celého světa a proč mu chybí voda',
        'Popsat, jak zavlažování zničilo Aralské jezero',
        'Popsat Sibiř: tajgu, permafrost, suroviny a řídké osídlení',
      ],
      hook: 'Saúdská Arábie má pod pouští jedny z největších zásob ropy světa, ale ani jednu stálou řeku. Sibiř má ropy a plynu taky dost, jenže v lednu tam mrzne na −45 °C. Jak se žije tam, kde je pod zemí bohatství a nad zemí nouze?',
      sections: [
        {
          title: 'Tři regiony, dvě krajnosti',
          icon: 'thermometer',
          blocks: [
            { type: 'p', text: 'Zbytek Asie mimo monzunovou oblast dělíme na tři regiony. Mají společné jedno: na většinu jejich území monzun nedosáhne. Vzduch od oceánu zastaví hory nebo vzdálenost, a proto tu převládá suché podnebí.' },
            { type: 'p', text: 'Na mapě najdi Blízký východ mezi třemi světadíly, vnitrozemskou Střední Asii a obrovské Rusko, jehož asijskou část tvoří Sibiř a Dálný východ:' },
            { type: 'map', view: 'asia', highlight: [
              { codes: ['SAU', 'ARE', 'OMN', 'YEM', 'QAT', 'BHR', 'KWT', 'IRQ', 'IRN', 'SYR', 'JOR', 'ISR', 'PSX', 'LBN', 'TUR'], tone: 'a', label: 'Blízký východ (západní Asie)' },
              { codes: ['KAZ', 'UZB', 'TKM', 'KGZ', 'TJK'], tone: 'b', label: 'Střední Asie' },
              { codes: ['RUS'], tone: 'c', label: 'Rusko (v Asii Sibiř a Dálný východ)' },
            ], points: [
              { lat: 24.71, lon: 46.68, label: 'Rijád', kind: 'capital' },
              { lat: 67.55, lon: 133.39, label: 'Verchojansk', kind: 'city' },
            ], caption: 'Západní, střední a severní Asie. Asijská část Ruska zabírá asi tři čtvrtiny jeho rozlohy.' },
            { type: 'p', text: 'Oba konce regionu mají suché podnebí, ale každý jinak. Porovnej klimatogram Rijádu v Arabské poušti a Verchojansku na Sibiři. Hledej rozdíl mezi nejteplejším a nejstudenějším měsícem:' },
            { type: 'climate', places: [
              { name: 'Rijád (Saúdská Arábie)', temp: [14, 17.1, 21.5, 26.9, 32.5, 34.8, 36.1, 36.1, 32.7, 27.7, 20.3, 15.1], precip: [11, 6, 12, 14, 2, 0, 0, 0, 0, 1, 11, 9], source: 'průměry 1991–2020 (zpracování Climates to Travel)' },
              { name: 'Verchojansk (Rusko)', temp: [-44.7, -42.1, -28.9, -10.9, 4.2, 13.9, 16.5, 12.1, 2.8, -13.4, -33.7, -43.6], precip: [6, 5, 5, 4, 16, 30, 34, 30, 22, 13, 11, 6], altitude: 137, source: 'normál 1991–2020 (Roshydromet)' },
            ], caption: 'Rijád: horká poušť, jen asi 70 mm srážek za rok. Verchojansk: rozdíl lednové a červencové teploty přes 60 °C a jen asi 180 mm srážek.' },
            { type: 'p', text: 'V Rijádu se teplota během roku mění asi o 22 °C, ve Verchojansku o neuvěřitelných 61,2 °C. To je **kontinentální podnebí** v nejvyhrocenější podobě: daleko od oceánu, který by teploty vyrovnával. Srážek mají obě místa málo – Verchojansk dostane méně vody než leckterá step.' },
            { type: 'p', text: 'Málo vody je osudem celého regionu. Na Blízkém východě se k tomu přidá ještě něco, co potřebuje celý svět: ropa.' },
            { type: 'check', question: { kind: 'number', q: 'Ve Verchojansku je průměrná teplota v lednu −44,7 °C a v červenci 16,5 °C. Jaký je rozdíl (roční amplituda)?', answer: 61.2, tolerance: 0.2, unit: '°C', explain: '16,5 °C − (−44,7 °C) = 16,5 + 44,7 = 61,2 °C. Takovou amplitudu má jen extrémně kontinentální podnebí.' } },
          ],
        },
        {
          title: 'Ropa a Hormuzský průliv',
          icon: 'oil-barrel',
          blocks: [
            { type: 'p', text: 'Pod pouštěmi Blízkého východu leží skoro polovina známých světových zásob ropy. Vznikla z dávných mořských organismů v usazených horninách, jak víš z lekce „Nerostné suroviny a energie“. Těžba je tu levná a vývoz z ní udělal několik pouštních států velmi bohatými.' },
            { type: 'p', text: 'Velká část této ropy musí na cestě do světa projít jediným úzkým místem. Najdi na mapě Perský záliv a průliv, kterým se z něj vyplouvá:' },
            { type: 'map', view: 'middle-east', highlight: [
              { codes: ['SAU', 'IRQ', 'IRN', 'KWT', 'ARE', 'QAT'], tone: 'a', label: 'velcí vývozci ropy u Perského zálivu' },
            ], points: [
              { lat: 26.57, lon: 56.25, label: 'Hormuzský průliv', kind: 'place' },
              { lat: 25.2, lon: 55.27, label: 'Dubaj', kind: 'city' },
              { lat: 24.71, lon: 46.68, label: 'Rijád', kind: 'capital' },
              { lat: 35.69, lon: 51.39, label: 'Teherán', kind: 'capital' },
            ], routes: [
              { points: [{ lat: 28.5, lon: 50.0 }, { lat: 26.6, lon: 54.0 }, { lat: 26.4, lon: 56.4 }, { lat: 24.5, lon: 59.0 }, { lat: 21.0, lon: 61.0 }], label: 'trasa tankerů z Perského zálivu', tone: 'b', arrow: true },
            ], caption: 'Hormuzským průlivem (v nejužším místě široký asi 34 km) proplouvala asi pětina ropy, kterou svět spotřebuje.' },
            { type: 'p', text: 'Takovému místu se říká **strategická úžina**: kdo je ovládne, může zastavit obchod celého světa. Přesně to se stalo v roce 2026. Po leteckých útocích USA a Izraele na Írán od 28. února 2026 vyhlásil Írán průliv za uzavřený a plavba skoro ustala. Ceny ropy vyskočily vysoko nad 100 USD za barel. Ani po dubnovém příměří není plavba bezpečná a průlivem proplouvá jen zlomek dřívějšího počtu lodí (stav k září 2026).' },
            { type: 'p', text: 'Ropné státy vědí, že ropa jednou dojde nebo ji svět přestane potřebovat. Proto se snaží hospodářství rozšířit. Tři příklady ukazuje tabulka:' },
            { type: 'table', headers: ['stát', 'co dělá', 'proč'], rows: [
              ['Spojené arabské emiráty (Dubaj)', 'letecký uzel, přístav, cestovní ruch, finance', 'Dubaj má na rozdíl od Abú Zabí ropy málo, vsadila na služby'],
              ['Saúdská Arábie', 'nová města, průmysl, turistika', 'snaží se snížit závislost na ropě'],
              ['Katar', 'vývoz zemního plynu', 'jedno z největších nalezišť plynu světa'],
            ], caption: 'Ropné státy Perského zálivu hledají, z čeho žít po ropě.' },
            { type: 'p', text: 'Ropy má tedy region nadbytek. Zato mu chybí něco mnohem obyčejnějšího – voda. A ta je spolu s náboženstvím jádrem mnoha zdejších sporů.' },
            { type: 'check', question: { kind: 'tf', q: 'Hormuzský průliv je důležitý, protože jím proplouvá velká část ropy vyvážené z Perského zálivu.', answer: true, explain: 'Průliv spojuje Perský záliv s oceánem. Proplouvala jím asi pětina ropy, kterou svět spotřebuje, proto jeho uzavření v roce 2026 otřáslo trhem.' } },
          ],
        },
        {
          title: 'Voda, víra a konflikty',
          icon: 'water-tap',
          blocks: [
            { type: 'p', text: 'Proč je na Blízkém východě voda tak cenná? Leží v pásu obratníkových pouští, kde vysoký tlak brání dešťům. Stálé řeky má jen několik států a o jejich vodu se dělí. Odkud tedy lidé vodu berou?' },
            { type: 'p', text: 'Zdroje vody v regionu jsou čtyři a každý má svůj háček:' },
            { type: 'iconlist', items: [
              { icon: 'river', title: 'Řeky Eufrat a Tigris', text: 'Mezopotámie, kolébka zemědělství; Turecko na horním toku staví přehrady a Iráku pak teče méně vody' },
              { icon: 'river', title: 'Řeka Jordán', text: 'o jeho vodu se dělí Izrael, Jordánsko, Sýrie a Palestinci; Mrtvé moře kvůli tomu klesá' },
              { icon: 'drop', title: 'Fosilní podzemní voda', text: 'nahromadila se před mnoha tisíci lety, když bylo vlhčeji; čerpá se rychleji, než se doplní' },
              { icon: 'factory', title: 'Odsolování mořské vody', text: 'Saúdská Arábie je největší výrobce odsolené vody světa; spotřebuje ale hodně energie' },
            ] },
            { type: 'p', text: 'Na malém území se tu navíc potkávají tři velká náboženství. **Jeruzalém** je svatým městem židů, křesťanů i muslimů. Islám se dělí na dva hlavní směry, a i to na Blízkém východě rozhoduje o spojencích a nepřátelích:' },
            { type: 'keyterms', items: [
              { term: '**Sunnité**', def: 'většina muslimů světa (asi 85–90 %) i většiny arabských států, např. Saúdské Arábie' },
              { term: '**Šíité**', def: 'menšina muslimů; tvoří většinu v Íránu, Iráku a Bahrajnu' },
              { term: '**Mekka**', def: 'nejsvětější město islámu v Saúdské Arábii; každý rok sem putují miliony poutníků' },
            ] },
            { type: 'p', text: 'Spory o půdu, vodu, víru a moc vedou ke konfliktům, které trvají desítky let: izraelsko-palestinský konflikt (2023–2025 válka v Pásmu Gazy, od října 2025 křehké příměří), občanská válka v Sýrii (2011–2024) nebo války kolem Íránu. Pozor ale na zjednodušení: konflikty nevznikají „kvůli náboženství“ samotnému. Vždy jde i o území, zdroje a politickou moc.' },
            { type: 'p', text: 'Nedostatek vody ale zasáhl i region dál na sever, kde způsobil jednu z největších ekologických katastrof 20. století.' },
            { type: 'check', question: { kind: 'multi', q: 'Odkud získávají státy Blízkého východu vodu?', options: ['z řek Eufrat, Tigris a Jordán', 'z fosilní podzemní vody', 'odsolováním mořské vody', 'z ledovců v Arabské poušti', 'z monzunových dešťů'], answers: [0, 1, 2], explain: 'Region má několik řek, čerpá podzemní vodu z vlhčích dob a odsoluje mořskou vodu. Monzun sem nedosahuje a ledovce v poušti nejsou.' } },
          ],
        },
        {
          title: 'Střední Asie: step a mizející moře',
          icon: 'dune',
          blocks: [
            { type: 'p', text: 'Střední Asie leží uprostřed pevniny, tisíce kilometrů od oceánů. Převládá tu **step** a poušť. Kazachstán je největší vnitrozemský stát světa a do roku 1991 patřily všechny státy regionu k Sovětskému svazu.' },
            { type: 'p', text: 'Na mapě najdi pět států Střední Asie a mezi nimi Aralské jezero, do kterého tečou dvě velké řeky z hor na jihovýchodě:' },
            { type: 'map', view: 'asia', layers: ['rivers', 'lakes'], highlight: [
              { codes: ['KAZ', 'UZB', 'TKM', 'KGZ', 'TJK'], tone: 'b', label: 'Střední Asie' },
            ], points: [
              { lat: 45.0, lon: 59.5, label: 'Aralské jezero', kind: 'place' },
              { lat: 45.92, lon: 63.34, label: 'Bajkonur (kosmodrom)', kind: 'place' },
            ], caption: 'Střední Asie: Kazachstán, Uzbekistán, Turkmenistán, Kyrgyzstán a Tádžikistán. Amudarja a Syrdarja stékají z hor Pamíru a Ťan-šanu.' },
            { type: 'p', text: 'Proč je z jezera dnes jen zbytek? Sovětští plánovači chtěli z pouští udělat pole bavlny. Řeky Amudarja a Syrdarja proto odvedli do zavlažovacích kanálů. Co to udělalo s jezerem, do kterého tyto řeky tekly, ukazují čísla:' },
            { type: 'table', headers: ['rok', 'rozloha Aralského jezera', 'co se dělo'], rows: [
              ['1960', '≈ 68 000 km²', 'čtvrté největší jezero světa, rybářství'],
              ['2018', '≈ 8 300 km²', 'zbylo asi 12 % plochy; dno se změnilo v solnou poušť Aralkum'],
            ], caption: 'Aralské jezero na hranici Kazachstánu a Uzbekistánu (1960 podle map, 2018 podle satelitních snímků).' },
            { type: 'p', text: 'Vítr z vyschlého dna roznáší sůl a zbytky pesticidů na pole a do plic lidí v okolí. Malá naděje přišla v roce 2005: Kazachstán postavil hráz Kokaral, Severní Aral se částečně zaplnil a ryby se vrátily. Velký jižní Aral ale skoro zmizel.' },
            { type: 'callout', variant: 'warning', text: 'Aral je učebnicový příklad, jak zásah do jedné části povodí změní celou krajinu. Zavlažování pomohlo polím podél řek, ale zničilo jezero na jejich konci.' },
            { type: 'p', text: 'Ze Střední Asie vede cesta na sever do ještě rozlehlejšího a ještě prázdnějšího regionu – na Sibiř.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč se zmenšilo Aralské jezero?', options: ['vodu jeho přítoků, Amudarji a Syrdarji, odvedli lidé na zavlažování bavlny', 'jezero se vypařilo kvůli sopečné činnosti', 'zemětřesení otevřelo trhlinu ve dně', 'začalo v regionu víc pršet a voda odtekla do oceánu'], answer: 0, explain: 'Od 60. let se voda z řek odváděla na pole bavlny. Do jezera přitékalo málo vody a ono vysychalo.' } },
          ],
        },
        {
          title: 'Sibiř: tajga, permafrost a poklady',
          icon: 'snowflake',
          blocks: [
            { type: 'p', text: 'Asijská část Ruska zabírá asi tři čtvrtiny jeho rozlohy, ale žije v ní jen asi čtvrtina Rusů. Proč tak málo? Krutou zimu jsme viděli na klimatogramu Verchojansku. Většinu Sibiře navíc pokrývá **tajga** a na severu tundra.' },
            { type: 'p', text: 'Lidé žijí hlavně na jihu, podél železnice, která region spojuje s evropskou částí Ruska. Sleduj ji na mapě od Moskvy k Tichému oceánu:' },
            { type: 'map', view: 'asia', routes: [
              { points: [
                { lat: 55.75, lon: 37.62 }, { lat: 56.84, lon: 60.6 }, { lat: 54.99, lon: 73.37 }, { lat: 55.03, lon: 82.92 },
                { lat: 56.01, lon: 92.87 }, { lat: 52.29, lon: 104.3 }, { lat: 52.03, lon: 113.5 }, { lat: 48.48, lon: 135.07 }, { lat: 43.12, lon: 131.89 },
              ], label: 'Transsibiřská magistrála (Moskva – Vladivostok, 9 288 km)', tone: 'a' },
            ], points: [
              { lat: 53.5, lon: 108.0, label: 'Bajkal', kind: 'place' },
              { lat: 55.03, lon: 82.92, label: 'Novosibirsk', kind: 'city' },
              { lat: 61.0, lon: 73.0, label: 'ropa a plyn Západní Sibiře', kind: 'place' },
              { lat: 69.35, lon: 88.2, label: 'Norilsk', kind: 'city' },
            ], layers: ['rivers'], caption: 'Transsibiřská magistrála spojuje města jižní Sibiře. Velké řeky (Ob, Jenisej, Lena) tečou na sever do Severního ledového oceánu.' },
            { type: 'p', text: 'Pod tajgou leží obrovské bohatství: ropa a zemní plyn Západní Sibiře, nikl a měď z Norilsku, zlato a diamanty Jakutska. Na jihu leží **Bajkal**, nejhlubší jezero světa (1 642 m), které obsahuje asi pětinu nezamrzlé sladké povrchové vody na Zemi. Velkou část Ruska ale podkládá **permafrost** – trvale zmrzlá půda, kterou znáš z lekce „Řeky, jezera a ledovce“.' },
            { type: 'callout', variant: 'warning', text: 'Permafrost s oteplováním taje. Půda pod domy, silnicemi a potrubím povoluje, budovy praskají a z rozmrzlé půdy uniká metan, který dál zesiluje skleníkový efekt.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Rozhoduj o tvrzeních z regionů světa – od Sahelu po Sibiř.' },
            { type: 'p', text: 'Tím jsme obešli celou Asii. Teď přeskočíme oceán: v příští lekci nás čeká Severní Amerika, světadíl tornád, hurikánů a největší ekonomiky světa.' },
            { type: 'check', question: { kind: 'tf', q: 'V asijské části Ruska žije většina obyvatel Ruska.', answer: false, explain: 'Asijská část zabírá asi tři čtvrtiny rozlohy Ruska, ale žije v ní jen asi čtvrtina Rusů. Většina žije v evropské části.' } },
          ],
        },
      ],
      summary: [
        'Na většinu západní, střední a severní Asie monzun nedosáhne, proto má suché podnebí: horké pouště na Blízkém východě, step ve Střední Asii, extrémně kontinentální podnebí na Sibiři.',
        'Ve Verchojansku je rozdíl mezi lednem a červencem přes 60 °C – rekord kontinentálního podnebí.',
        'Blízký východ má skoro polovinu známých zásob ropy; Hormuzským průlivem proplouvala asi pětina ropy světa; od března 2026 je plavba kvůli válce USA a Izraele s Íránem silně omezená (stav k září 2026).',
        'Vodu region bere z několika řek (Eufrat, Tigris, Jordán), z fosilní podzemní vody a z odsolování moře; spory o vodu, území, víru a moc vedou ke konfliktům.',
        'Aralské jezero se zmenšilo na asi osminu plochy (2018), protože vodu jeho přítoků odvedli lidé na zavlažování bavlny.',
        'Sibiř je bohatá na ropu, plyn a kovy, ale řídce osídlená; lidé žijí hlavně na jihu podél Transsibiřské magistrály.',
        'Bajkal je nejhlubší jezero světa; permafrost s oteplováním taje a ničí stavby.',
      ],
      quiz: [
        { kind: 'choice', q: 'Které podnebí má Verchojansk na Sibiři?', options: ['extrémně kontinentální: velmi studená zima, teplé léto, málo srážek', 'oceánské: mírná zima, chladné léto, hodně srážek', 'monzunové: deštivé léto, suchá zima, teplo celý rok', 'tropické: horko a déšť po celý rok'], answer: 0, explain: 'Daleko od oceánu se teplota mění extrémně: v lednu kolem −45 °C, v červenci kolem 16,5 °C, srážek jen asi 180 mm za rok.' },
        { kind: 'tf', q: 'Blízký východ je bohatý na ropu i na sladkou vodu.', answer: false, explain: 'Ropy má region skoro polovinu světových zásob, ale sladké vody je tu velmi málo. Leží v pásu obratníkových pouští.' },
        { kind: 'match', q: 'Přiřaď místo k tomu, čím je známé.', pairs: [
          ['Hormuzský průliv', 'úžina, kterou proplouvají tankery s ropou'],
          ['Aralské jezero', 'vyschlo kvůli zavlažování bavlny'],
          ['Bajkal', 'nejhlubší jezero světa'],
          ['Jeruzalém', 'svaté město tří náboženství'],
        ], explain: 'Hormuz je úžina z Perského zálivu, Aral vysychá od 60. let, Bajkal je hluboký 1 642 m a Jeruzalém je svatý pro židy, křesťany i muslimy.' },
        { kind: 'multi', q: 'Proč je Sibiř tak řídce osídlená?', options: ['velmi studené a dlouhé zimy', 'permafrost, na kterém se těžko staví', 'velká vzdálenost od center a moře', 'nedostatek surovin', 'tropické nemoci'], answers: [0, 1, 2], explain: 'Sibiř je bohatá na suroviny. Lidi odrazuje krutá zima, permafrost a odlehlost.' },
        { kind: 'number', q: 'Aralské jezero mělo v roce 1960 asi 68 000 km², v roce 2018 asi 8 300 km². Kolik procent původní plochy zbylo? (zaokrouhli na celá procenta)', answer: 12, tolerance: 1, unit: '%', explain: '8 300 : 68 000 ≐ 0,122, tedy asi 12 % původní plochy.' },
        { kind: 'tf', q: 'Šíité tvoří většinu obyvatel Íránu.', answer: true, explain: 'Írán je největší šíitský stát. Většina muslimů světa i Saúdské Arábie jsou sunnité.' },
        { kind: 'choice', q: 'Proč se Spojené arabské emiráty zaměřily na letectví, přístavy a cestovní ruch?', options: ['aby nebyly závislé jen na ropě, která jednou dojde', 'protože ropu nikdy neměly', 'protože jim to nařídila OSN', 'protože v poušti nejde nic jiného dělat'], answer: 0, explain: 'Ropa je neobnovitelná surovina a svět ji bude potřebovat méně. Proto se ropné státy snaží rozšířit hospodářství o služby.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-5
    'z7-5': {
      id: 'z7-5',
      title: 'Severní Amerika',
      goals: [
        'Popsat reliéf Severní Ameriky: Kordillery, Appalačské pohoří, Velké planiny, Mississippi a Velká jezera',
        'Vysvětlit, proč má Severní Amerika tolik tornád a kde a kdy ji ohrožují hurikány',
        'Porovnat USA a Kanadu podle obyvatelstva, měst a hospodářství',
        'Rozlišit světadíl Severní Amerika a kulturní region Angloamerika',
      ],
      hook: 'Ve Spojených státech se každý rok vytvoří přes tisíc tornád – víc než ve kterékoli jiné zemi světa. Proč zrovna tady? Odpověď najdeme na mapě reliéfu.',
      sections: [
        {
          title: 'Hory na západě, nížiny uprostřed',
          icon: 'mountain',
          blocks: [
            { type: 'p', text: 'Světadíl **Severní Amerika** sahá od Arktidy po Panamskou šíji: patří k němu Kanada, USA, Mexiko, Střední Amerika i Karibik. V této lekci se soustředíme na jeho severní část, **Angloameriku** – USA a Kanadu. Mexiku a jihu se budeme věnovat v lekci o Latinské Americe.' },
            { type: 'p', text: 'Reliéf Severní Ameriky má jednoduchý plán. Na mapě sleduj hory na západě, staré pohoří na východě a obrovskou nížinu s řekami mezi nimi:' },
            { type: 'map', view: 'north-america', layers: ['rivers', 'lakes'], points: [
              { lat: 63.07, lon: -151.0, label: 'Denali 6 190 m', kind: 'peak' },
              { lat: 36.25, lon: -116.83, label: 'Údolí smrti −86 m', kind: 'place' },
              { lat: 40.0, lon: -106.0, label: 'Skalnaté hory', kind: 'place' },
              { lat: 37.5, lon: -80.5, label: 'Appalačské pohoří', kind: 'place' },
              { lat: 38.9, lon: -77.04, label: 'Washington', kind: 'capital' },
              { lat: 45.42, lon: -75.7, label: 'Ottawa', kind: 'capital' },
            ], caption: 'Severní Amerika: na západě Kordillery (Skalnaté hory), na východě Appalačské pohoří, mezi nimi nížiny s Mississippi a Missouri a Velkými jezery.' },
            { type: 'p', text: 'Západní **Kordillery** jsou mladé pohoří na hranici desek, proto tu jsou zemětřesení a sopky (zlom San Andreas v Kalifornii). **Appalačské pohoří** na východě je staré a obroušené, podobně jako naše hory. Mezi nimi leží rovinaté **Velké planiny** a Centrální nížina. Největší z řek je Mississippi s přítokem Missouri, dlouhá přes 6 000 km.' },
            { type: 'p', text: 'Na severu krajinu modelovaly ledovce, které tu v době ledové byly mocné až asi 3 km. Zanechaly po sobě tisíce jezer:' },
            { type: 'keyterms', items: [
              { term: '**Velká jezera**', def: 'pět jezer na hranici USA a Kanady; Hořejší jezero je plochou největší sladkovodní jezero světa' },
              { term: '**Niagarské vodopády**', def: 'na řece Niagara mezi Erijským a Ontarijským jezerem' },
              { term: '**Kanadský štít**', def: 'stará, ledovcem obroušená skalnatá oblast kolem Hudsonova zálivu, plná jezer a tajgy' },
            ] },
            { type: 'p', text: 'Pro počasí je na této mapě nejdůležitější to, co tu chybí: hory, které by vedly od západu na východ. Uvidíme, proč na tom tolik záleží.' },
            { type: 'check', question: { kind: 'choice', q: 'Které pohoří Severní Ameriky je staré a obroušené?', options: ['Appalačské pohoří', 'Skalnaté hory', 'Kordillery na Aljašce', 'Sierra Nevada'], answer: 0, explain: 'Appalačské pohoří na východě je staré, proto je nižší a obroušené. Skalnaté hory a další pásma Kordiller na západě jsou mladá a vysoká.' } },
          ],
        },
        {
          title: 'Podnebí bez příčných hor',
          icon: 'thermometer',
          blocks: [
            { type: 'p', text: 'V Evropě vedou velká pohoří (Pyreneje, Alpy, Karpaty) převážně od západu na východ: vlhký vzduch od Atlantiku proniká daleko do vnitrozemí a Středomoří chrání Alpy před studeným vzduchem ze severu. V Severní Americe hory vedou od severu k jihu. Mezi Arktidou a Mexickým zálivem tak nestojí žádná překážka.' },
            { type: 'p', text: 'Výsledek ukazují klimatogramy dvou měst. Chicago leží uprostřed nížiny u Michiganského jezera, Miami na jihu Floridy. Porovnej hlavně zimu:' },
            { type: 'climate', places: [
              { name: 'Chicago (USA)', temp: [-3.8, -1.8, 3.9, 9.8, 15.9, 21.4, 24.1, 23.2, 19.1, 12.2, 5.2, -0.8], precip: [51, 50, 62, 95, 114, 104, 94, 108, 81, 87, 61, 54], altitude: 201, source: 'NOAA, normál 1991–2020 (letiště O’Hare)' },
              { name: 'Miami (USA)', temp: [20.3, 21.5, 22.8, 24.8, 26.7, 28.2, 28.9, 29, 28.3, 26.7, 23.8, 21.8], precip: [46, 55, 62, 85, 161, 267, 187, 243, 260, 194, 90, 62], altitude: 2, source: 'NOAA, normál 1991–2020 (letiště Miami)' },
            ], caption: 'Chicago: mírné kontinentální podnebí s mrazivou zimou a horkým létem. Miami: teplo celý rok, deštivé léto a podzim, kdy přicházejí bouřky a hurikány.' },
            { type: 'p', text: 'Chicago leží na stejné zeměpisné šířce jako Řím, a přesto má lednový průměr pod nulou: studený arktický vzduch sem proudí bez překážky. V létě sem naopak proudí horký vlhký vzduch z Mexického zálivu. Miami má teplo celý rok a nejvíc prší od června do října.' },
            { type: 'p', text: 'Když se uprostřed kontinentu potká studený vzduch ze severu s teplým a vlhkým z jihu, vznikají ty nejprudší bouřky na Zemi.' },
            { type: 'check', question: { kind: 'tf', q: 'Chicago má chladnější zimy než Řím, i když leží na podobné zeměpisné šířce.', answer: true, explain: 'Chicago leží uprostřed kontinentu a arktický vzduch k němu proudí bez překážky. Řím leží u teplého Středozemního moře a od severu ho chrání Alpy.' } },
          ],
        },
        {
          title: 'Tornáda a hurikány',
          icon: 'tornado',
          blocks: [
            { type: 'p', text: 'Na jaře se nad Velkými planinami střetává studený suchý vzduch ze severu a západu s teplým vlhkým vzduchem z Mexického zálivu. Z obřích bouřkových oblaků se pak spouštějí **tornáda**, jak víš z lekce „Tlak, vítr a fronty“. USA zaznamenají v průměru asi 1 200 tornád ročně.' },
            { type: 'p', text: 'Na mapě najdi „tornádovou alej“ na Velkých planinách. Druhé nebezpečí přichází z moře – sleduj dráhu hurikánu Helene ze září 2024:' },
            { type: 'map', view: 'north-america', points: [
              { lat: 36.0, lon: -98.0, label: 'tornádová alej (Oklahoma, Kansas, Texas)', kind: 'place' },
              { lat: 25.76, lon: -80.19, label: 'Miami', kind: 'city' },
              { lat: 35.6, lon: -82.55, label: 'Asheville – povodně po hurikánu', kind: 'place' },
            ], routes: [
              { points: [{ lat: 18.5, lon: -84.5 }, { lat: 21.5, lon: -86.0 }, { lat: 25.5, lon: -85.3 }, { lat: 30.0, lon: -83.9 }, { lat: 34.0, lon: -83.0 }, { lat: 36.5, lon: -84.5 }], label: 'dráha hurikánu Helene (září 2024)', tone: 'b', arrow: true },
            ], caption: 'Tornáda vznikají hlavně na Velkých planinách, hurikány přicházejí z teplého Atlantiku a Mexického zálivu.' },
            { type: 'p', text: 'Hurikán je tropická tlaková níže, která čerpá energii z teplé mořské vody. Proto vzniká jen nad mořem s teplotou asi nad 26 °C, hlavně od června do listopadu. Na obrázku sleduj, jak je uspořádaný:' },
            { type: 'diagram', id: 'tropical-cyclone', caption: 'Hurikán: klidné oko uprostřed, stěna oka s nejsilnějším větrem a spirální pásy deště. Na severní polokouli se točí proti směru hodinových ručiček.' },
            { type: 'p', text: 'Helene dorazil na pobřeží Floridy jako hurikán 4. kategorie. Nejvíc obětí ale nezpůsobil vítr na pobřeží, nýbrž přívalové deště a povodně o stovky kilometrů dál v Appalačském pohoří. Pozor tedy na omyl, že hurikán ohrožuje jen pobřeží: nebezpečná je i voda, kterou přinese do vnitrozemí.' },
            { type: 'callout', variant: 'tip', text: 'Tornádo a hurikán si nepleť. Tornádo je malý vír (desítky až stovky metrů), který vznikne nad pevninou a trvá minuty. Hurikán je obří tlaková níže široká stovky kilometrů, vzniká nad teplým mořem a trvá dny.' },
            { type: 'p', text: 'Přes všechna nebezpečí patří Severní Amerika k nejbohatším a nejvíc obydleným oblastem světa. Kde a jak tu lidé žijí?' },
            { type: 'check', question: { kind: 'choice', q: 'Proč vzniká v USA tolik tornád?', options: ['nad Velkými planinami se bez horské překážky střetává studený vzduch ze severu s teplým vlhkým vzduchem z Mexického zálivu', 'protože USA leží na rovníku', 'protože Skalnaté hory vedou od západu na východ', 'protože nad USA je celý rok tlaková výše'], answer: 0, explain: 'Hory vedou od severu k jihu, takže se vzduchové hmoty z Arktidy a od Mexického zálivu střetávají uprostřed nížin. Vznikají obří bouřky a z nich tornáda.' } },
          ],
        },
        {
          title: 'Obyvatelé a města',
          icon: 'city',
          blocks: [
            { type: 'p', text: 'Původními obyvateli Severní Ameriky jsou Indiáni a na severu Inuité. Od 16. století sem přicházeli Evropané, násilím přivezení Afričané a později lidé z celého světa. USA a Kanada jsou dodnes státy přistěhovalců, jak jsme viděli v lekci „Migrace“.' },
            { type: 'p', text: 'Porovnej v tabulce oba státy Angloameriky a jejich jižního souseda Mexiko:' },
            { type: 'table', headers: ['stát', 'rozloha', 'obyvatel', 'kde lidé žijí'], rows: [
              ['USA', '9,8 mil. km²', '≈ 345 mil.', 'východní pobřeží, Kalifornie, Texas, Florida, okolí Velkých jezer'],
              ['Kanada', '10,0 mil. km²', '≈ 41 mil.', 'většina do 160 km od hranice s USA'],
              ['Mexiko', '2,0 mil. km²', '≈ 131 mil.', 'náhorní plošina kolem hlavního města'],
            ], caption: 'Obyvatelé: USA a Mexiko UN WPP 2024, Kanada Statistics Canada 2025, zaokrouhleno.' },
            { type: 'p', text: 'Kanada je rozlohou druhý největší stát světa, ale obyvatel má jen asi o desetinu víc než Polsko. Většina Kanaďanů žije na jihu, kde je nejtepleji – sever pokrývá tajga a tundra. V USA vznikl na severovýchodě pás skoro srostlých měst od Bostonu po Washington, kterému se říká **Megalopolis**. Největší města jsou New York, Los Angeles a Chicago, v Kanadě Toronto a Montréal.' },
            { type: 'p', text: 'Kanada a USA mají mnoho společného, ale přece jen se v něčem liší:' },
            { type: 'compare', columns: [
              { title: 'USA', icon: 'flag', tone: 'a', points: ['federace 50 států', 'mluví se hlavně anglicky, ve velké části jihu i španělsky', 'většina území leží v mírném pásu', 'nejvíc obyvatel z celé Ameriky'] },
              { title: 'Kanada', icon: 'flag', tone: 'b', points: ['federace provincií a teritorií', 'úřední jazyky angličtina a francouzština (Québec)', 'většinu území pokrývá tajga a tundra', 'řídce osídlená, obyvatelé na jihu'] },
            ] },
            { type: 'p', text: 'Lidé se tedy soustředí tam, kde je mírné podnebí, pobřeží a dobrá doprava. Stejná místa jsou i centry nejsilnější ekonomiky světa.' },
            { type: 'check', question: { kind: 'tf', q: 'Většina Kanaďanů žije na severu Kanady, kde je nejvíc surovin.', answer: false, explain: 'Většina Kanaďanů (podle různých odhadů 70–90 %) žije do 160 km od hranice s USA, kde je nejmírnější podnebí. Sever pokrývá tajga a tundra.' } },
          ],
        },
        {
          title: 'Největší ekonomika světa',
          icon: 'coin',
          blocks: [
            { type: 'p', text: 'USA mají největší ekonomiku světa: jejich HDP bylo v roce 2024 asi 29 bilionů USD, na obyvatele asi 86 000 USD (Světová banka). Kanada měla přes 50 000 USD na obyvatele, Mexiko jen asi 14 000 USD. Proč jsou USA tak bohaté?' },
            { type: 'p', text: 'Část odpovědi je v přírodě: úrodné nížiny, suroviny, splavné řeky a dva oceány. Druhá část je v lidech a službách. Na kartách najdeš hlavní hospodářské oblasti:' },
            { type: 'iconlist', items: [
              { icon: 'phone', title: 'Silicon Valley (Kalifornie)', text: 'technologické firmy, výzkum, univerzity – sídla firem, jejichž software a služby používá celý svět' },
              { icon: 'wheat', title: 'Kukuřičný pás (Corn Belt)', text: 'kukuřice a sója na Centrální nížině; velké farmy s málo pracovníky' },
              { icon: 'factory', title: 'Okolí Velkých jezer', text: 'tradiční průmysl (auta v Detroitu, ocel); po útlumu se mu říká „rezavý pás“' },
              { icon: 'oil-barrel', title: 'Texas a Alberta', text: 'ropa a zemní plyn; v kanadské Albertě i ropné písky' },
              { icon: 'city', title: 'New York', text: 'finance, obchod, média – jedno z center globálního hospodářství' },
            ] },
            { type: 'p', text: 'Dnes v USA pracuje ve službách asi osm lidí z deseti, jak to odpovídá vyspělé ekonomice z lekce „Sektory hospodářství“. Kanada vyváží hlavně suroviny (ropu, dřevo, kovy, pšenici) a většinu prodá do USA.' },
            { type: 'game', gameId: 'blind-map', text: 'Slepá mapa: najdi státy a regiony Ameriky.' },
            { type: 'p', text: 'Jižně od Rio Grande začíná jiný svět – jiný jazyk, jiné dějiny a mnohem větší rozdíly mezi bohatými a chudými. V příští lekci se vydáme do Latinské Ameriky.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď oblast k tomu, čím je známá.', pairs: [
              ['Silicon Valley', 'technologie a software'],
              ['Kukuřičný pás', 'kukuřice a sója'],
              ['Alberta', 'ropné písky'],
              ['New York', 'finance a obchod'],
            ], explain: 'Silicon Valley v Kalifornii je centrem technologií, Kukuřičný pás na Centrální nížině zemědělství, kanadská Alberta těžby ropy a New York financí.' } },
          ],
        },
      ],
      summary: [
        'Světadíl Severní Amerika sahá od Arktidy po Panamu; Angloameriku tvoří USA a Kanada.',
        'Na západě leží mladé Kordillery (Skalnaté hory), na východě staré Appalačské pohoří, mezi nimi Velké planiny a nížina s Mississippi a Missouri.',
        'Hory vedou od severu k jihu, proto se studený arktický a teplý vlhký vzduch z Mexického zálivu střetávají uprostřed kontinentu a vznikají tornáda (v USA asi 1 200 ročně).',
        'Hurikány vznikají nad teplým mořem od června do listopadu; ohrožují pobřeží větrem a vnitrozemí povodněmi (Helene 2024).',
        'USA mají asi 345 mil. obyvatel, Kanada přes 41 mil.; Kanaďané žijí hlavně na jihu u hranice s USA.',
        'USA mají největší ekonomiku světa (HDP asi 29 bilionů USD v roce 2024); většina lidí pracuje ve službách.',
      ],
      quiz: [
        { kind: 'tf', q: 'Hory v Severní Americe vedou převážně od západu na východ, podobně jako Alpy v Evropě.', answer: false, explain: 'Kordillery i Appalačské pohoří vedou od severu k jihu. Proto mezi Arktidou a Mexickým zálivem není žádná překážka pro vzduch.' },
        { kind: 'choice', q: 'Které jezero je plochou největší sladkovodní jezero světa?', options: ['Hořejší jezero', 'Bajkal', 'Viktoriino jezero', 'Michiganské jezero'], answer: 0, explain: 'Hořejší jezero na hranici USA a Kanady je plochou největší sladkovodní jezero. Bajkal je nejhlubší a má nejvíc vody.' },
        { kind: 'match', q: 'Přiřaď místo k jeho rekordu nebo zajímavosti.', pairs: [
          ['Denali', 'nejvyšší hora Severní Ameriky'],
          ['Údolí smrti', 'nejnižší místo Severní Ameriky'],
          ['Mississippi', 'nejdelší říční soustava Severní Ameriky (s Missouri)'],
          ['Kanadský štít', 'ledovcem obroušená skalnatá oblast s jezery'],
        ], explain: 'Denali má 6 190 m, Údolí smrti leží 86 m pod hladinou moře, Mississippi s Missouri je dlouhá přes 6 000 km.' },
        { kind: 'multi', q: 'Co platí o hurikánech?', options: ['vznikají nad teplým mořem', 'v Atlantiku je jejich sezona hlavně od června do listopadu', 'mohou způsobit povodně daleko ve vnitrozemí', 'vznikají nad suchou pevninou', 'trvají jen několik minut'], answers: [0, 1, 2], explain: 'Hurikán čerpá energii z teplé vody, trvá dny a jeho deště mohou zaplavit i hory daleko od pobřeží. Krátce trvá tornádo.' },
        { kind: 'number', q: 'Kanada má rozlohu asi 10 mil. km² a asi 41 mil. obyvatel. Jaká je její průměrná hustota zalidnění?', answer: 4.1, tolerance: 0.2, unit: 'obyv./km²', explain: '41 000 000 : 10 000 000 km² = 4,1 obyv./km² – asi třicetkrát méně než v Česku.' },
        { kind: 'choice', q: 'Kde v Kanadě žije většina obyvatel?', options: ['na jihu, blízko hranice s USA', 'na pobřeží Hudsonova zálivu', 'na arktických ostrovech', 'rovnoměrně po celém území'], answer: 0, explain: 'Na jihu je nejmírnější podnebí, úrodná půda a spojení s USA. Sever pokrývá tajga a tundra.' },
        { kind: 'tf', q: 'Mexiko leží ve světadílu Severní Amerika.', answer: true, explain: 'Světadíl Severní Amerika sahá až k Panamské šíji. Kulturně ale Mexiko patří do Latinské Ameriky, ne do Angloameriky.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-6
    'z7-6': {
      id: 'z7-6',
      title: 'Latinská Amerika',
      goals: [
        'Vymezit Latinskou Ameriku jako kulturní region a vysvětlit, proč se v Brazílii mluví portugalsky',
        'Popsat Andy a výškovou stupňovitost a porovnat klimatogramy Quita a Manausu',
        'Popsat povodí Amazonky a příčiny a vývoj odlesňování podle dat INPE',
        'Vysvětlit rychlou urbanizaci a velké nerovnosti v latinskoamerických městech',
      ],
      hook: 'Quito a Manaus leží skoro na rovníku. V Manausu je celý rok kolem 27 °C, v Quitu „věčné jaro“ kolem 14 °C. A les kolem Manausu je největší deštný prales světa – kolik ho ještě zbývá?',
      sections: [
        {
          title: 'Co dělá Ameriku latinskou',
          icon: 'speech',
          blocks: [
            { type: 'p', text: 'V lekci „Jak dělíme svět na regiony“ jsme viděli, že Latinská Amerika není světadíl, ale **kulturní region**. Patří k ní Mexiko, Střední Amerika, většina Karibiku a skoro celá Jižní Amerika. Co ji drží pohromadě?' },
            { type: 'p', text: 'Především jazyk a dějiny. Od konce 15. století si region podmanili Španělé a Portugalci. Na mapě hledej jedinou velkou portugalsky mluvící zemi:' },
            { type: 'map', view: 'latin-america', highlight: [
              { codes: ['MEX', 'GTM', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'DOM', 'PRI', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'CHL', 'ARG', 'URY', 'PRY'], tone: 'a', label: 'španělština' },
              { codes: ['BRA'], tone: 'b', label: 'portugalština' },
              { codes: ['BLZ', 'GUY', 'SUR', 'JAM', 'HTI', 'TTO', 'BHS'], tone: 'c', label: 'angličtina, francouzština, nizozemština' },
            ], caption: 'Úřední jazyky Latinské Ameriky a Karibiku. Brazílie je největší portugalsky mluvící stát světa.' },
            { type: 'p', text: 'Proč zrovna Brazílie mluví portugalsky? V roce 1494 si Španělsko a Portugalsko **smlouvou z Tordesillas** rozdělily nově objevené země po jednom poledníku. Východní výběžek Jižní Ameriky připadl Portugalsku. Z něj se rozrostla dnešní Brazílie.' },
            { type: 'p', text: 'Pod evropskou vrstvou ale žijí i starší kultury. Tři velké civilizace z doby před příchodem Evropanů si zapamatuj:' },
            { type: 'keyterms', items: [
              { term: '**Mayové**', def: 'poloostrov Yucatán a Guatemala; města s pyramidami, písmo, kalendář; mayskými jazyky se tu mluví dodnes' },
              { term: '**Aztékové**', def: 'Mexická vysočina; jejich hlavní město Tenochtitlán stálo na místě dnešního hlavního města Mexika' },
              { term: '**Inkové**', def: 'Andy (Peru, Ekvádor, Bolívie); horské terasy, silnice, Machu Picchu; jejich kečuánštinou mluví miliony lidí' },
            ] },
            { type: 'p', text: 'Obyvatelstvo je dnes velmi smíšené: potomci původních obyvatel, Evropanů, Afričanů přivezených jako otroci a jejich míšenci. Tak rozmanitá jako lidé je i příroda. Začneme nejdelším pohořím světa.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč se v Brazílii mluví portugalsky, zatímco ve většině okolních států španělsky?', options: ['podle smlouvy z Tordesillas (1494) připadl východ Jižní Ameriky Portugalsku', 'Portugalci dobyli Brazílii od Španělů v 20. století', 'portugalštinou mluvili původní obyvatelé Amazonie', 'Brazílie si portugalštinu zvolila až po získání nezávislosti'], answer: 0, explain: 'Smlouva z Tordesillas rozdělila nové země po poledníku: východ Jižní Ameriky Portugalsku, zbytek Španělsku.' } },
          ],
        },
        {
          title: 'Andy: patra podnebí',
          icon: 'mountain',
          blocks: [
            { type: 'p', text: '**Andy** se táhnou podél západního pobřeží Jižní Ameriky asi 7 000 km – jsou nejdelším pohořím světa. Pod Jižní Ameriku se tu podsouvá oceánská deska, a proto tu jsou sopky a silná zemětřesení, jak víš z lekce „Zemětřesení a sopky“. Nejvyšší hora **Aconcagua** (6 961 m) je nejvyšší horou mimo Asii.' },
            { type: 'p', text: 'Co znamenají vysoké hory pro podnebí, ukáže srovnání dvou měst skoro na rovníku. Quito leží v Andách asi 2 800 m n. m., Manaus v Amazonii necelých 100 m n. m.:' },
            { type: 'climate', places: [
              { name: 'Quito (Ekvádor)', temp: [14.6, 14.6, 14.6, 14.6, 14.6, 14.5, 14.4, 14.7, 14.8, 14.7, 14.4, 14.4], precip: [85, 110, 145, 170, 105, 40, 20, 30, 70, 115, 110, 100], source: 'normál 1991–2020, INAMHI (zpracování Climates to Travel)' },
              { name: 'Manaus (Brazílie)', temp: [26.6, 26.6, 26.6, 26.7, 27.0, 27.3, 27.5, 28.2, 28.6, 28.5, 28.0, 27.2], precip: [306, 297, 321, 331, 233, 117, 67, 56, 79, 114, 188, 254], source: 'INMET (Brazílie), normál 1991–2020' },
            ], caption: 'Quito a Manaus: obě města mají skoro stejnou teplotu po celý rok, ale Quito je o 13 °C chladnější. Manaus dostane asi 2 360 mm srážek, Quito asi 1 100 mm.' },
            { type: 'p', text: 'Obě křivky jsou skoro rovné: u rovníku nejsou teplotní roční období. Rozdíl dělá jen nadmořská výška – teplota klesá asi o 0,65 °C na každých 100 m. Proto se v horách krajina mění s výškou jako patra domu. Obrázek ukazuje patra Alp, která znáš z Evropy:' },
            { type: 'diagram', id: 'altitude-zones', caption: 'Výšková stupňovitost na příkladu Alp: listnaté, smíšené a jehličnaté lesy, nad hranicí lesa kleč a alpínské louky, nahoře skály, sníh a led. V Andách u rovníku začíná řada dole tropickým deštným lesem a všechny stupně leží výš.' },
            { type: 'p', text: 'Lidé v Andách žijí hlavně ve středních patrech, kde není příliš horko ani zima: proto leží Quito, Bogotá i La Paz tak vysoko. Pod Andami na východě ale začíná úplně jiný svět – nekonečný prales.' },
            { type: 'game', gameId: 'climate-chart', text: 'Klimatogram: poznáš podle grafu, jestli je místo v horách, v pralese, nebo v poušti?' },
            { type: 'check', question: { kind: 'tf', q: 'Quito je chladnější než Manaus hlavně proto, že leží dál od rovníku.', answer: false, explain: 'Obě města leží skoro na rovníku. Quito je chladnější, protože leží asi 2 800 m n. m.; teplota klesá asi o 0,65 °C na 100 m.' } },
          ],
        },
        {
          title: 'Amazonie a odlesňování',
          icon: 'leaf',
          blocks: [
            { type: 'p', text: 'Amazonka má **největší povodí světa** (asi 7 mil. km², skoro jako Austrálie) a nese nejvíc vody: asi pětinu všeho, co řeky světa přinášejí do oceánů. Její povodí pokrývá největší tropický deštný prales na Zemi. Proč na něm záleží celému světu?' },
            { type: 'p', text: 'Prales ukládá obrovské množství uhlíku, je domovem asi desetiny všech druhů na Zemi a jeho výpar vytváří déšť pro velkou část Jižní Ameriky. Jenže ho lidé kácejí. Na obrázku sleduj, jak odlesňování obvykle postupuje:' },
            { type: 'diagram', id: 'deforestation', caption: 'Odlesňování Amazonie: podél silnic se kácí do stran („rybí kost“), les nahradí pastviny pro dobytek a pole sóji, nakonec zbude vyčerpaná půda.' },
            { type: 'p', text: 'Brazilský ústav pro výzkum vesmíru (INPE) měří kácení ze satelitů každý rok od srpna do července. Podívej se, jak se vyvíjelo:' },
            { type: 'graph', x: { label: 'rok', min: 2002, max: 2026, step: 4 }, y: { label: 'vykáceno', unit: 'tis. km²', min: 0, max: 30, step: 5 }, series: [
              { label: 'brazilská Amazonie (INPE PRODES)', points: [[2004, 27.8], [2008, 12.9], [2012, 4.6], [2016, 7.9], [2019, 10.1], [2021, 13.0], [2023, 9.0], [2024, 6.5], [2025, 5.8]], style: 'dots', tone: 'a' },
            ], marks: [{ x: 2004, y: 27.8, label: 'vrchol 2004' }, { x: 2025, y: 5.8, label: '2025: 5 796 km²' }], caption: 'Roční odlesnění brazilské Amazonie podle INPE PRODES (rok = období od srpna předchozího roku do července). Rok 2004 byl nejhorší od roku 1995, rok 2025 je předběžný odhad INPE.' },
            { type: 'p', text: 'Kácení klesalo, když stát les chránil a kontroloval, a rostlo, když ochranu oslabil (2019–2021). Od roku 2022 zase klesá: rychlé satelitní hlášení DETER zaznamenalo od srpna 2025 do července 2026 jen asi 2 900 km², nejméně od roku 2013. Pozor ale: i 5 800 km² za rok je plocha zhruba poloviny Středočeského kraje. Prales navíc trpí požáry a suchem, které satelity počítají zvlášť.' },
            { type: 'callout', variant: 'warning', text: 'Odlesňování nezpůsobují „domorodci, kteří kácejí“. Hlavními příčinami jsou pastviny pro dobytek, pole sóji, nelegální těžba dřeva a zlata a nové silnice. Území původních obyvatel patří naopak k nejlépe zachovaným částem pralesa.' },
            { type: 'p', text: 'Zatímco prales ubývá, města Latinské Ameriky rostou. Podívejme se, jak se v nich žije.' },
            { type: 'check', question: { kind: 'multi', q: 'Co patří k hlavním příčinám odlesňování Amazonie?', options: ['pastviny pro dobytek', 'pole sóji', 'nelegální těžba dřeva a zlata', 'stavba lyžařských středisek', 'pěstování vinné révy'], answers: [0, 1, 2], explain: 'Prales nejčastěji nahrazují pastviny a sója; k tomu přispívá nelegální těžba a silnice, které otevřou les dalšímu kácení.' } },
          ],
        },
        {
          title: 'Města, bohatství a nerovnosti',
          icon: 'city',
          blocks: [
            { type: 'p', text: 'Latinská Amerika je jedním z nejvíc urbanizovaných regionů světa: ve městech žijí asi čtyři lidé z pěti. Lidé sem přicházeli z venkova za prací, školami a lékaři – proces, který znáš z lekce „Sídla a města“.' },
            { type: 'p', text: 'Na mapě najdi největší města regionu. Všimni si, že většina z nich leží u pobřeží nebo vysoko v horách:' },
            { type: 'map', view: 'latin-america', points: [
              { lat: 19.43, lon: -99.13, label: 'Mexiko (Ciudad de México)', kind: 'capital' },
              { lat: -23.55, lon: -46.63, label: 'São Paulo', kind: 'city' },
              { lat: -22.91, lon: -43.17, label: 'Rio de Janeiro', kind: 'city' },
              { lat: -34.6, lon: -58.38, label: 'Buenos Aires', kind: 'capital' },
              { lat: -12.05, lon: -77.04, label: 'Lima', kind: 'capital' },
              { lat: 4.71, lon: -74.07, label: 'Bogotá', kind: 'capital' },
              { lat: -15.79, lon: -47.88, label: 'Brasília', kind: 'capital' },
            ], caption: 'Největší města Latinské Ameriky a hlavní město Brazílie Brasília. Brasília byla postavena na přelomu 50. a 60. let 20. století uprostřed vnitrozemí, aby se země rozvíjela i mimo pobřeží.' },
            { type: 'p', text: 'Města rostla rychleji, než stihla stavět byty. Na svazích a okrajích proto vznikly čtvrti, které si lidé postavili sami: v Brazílii se jim říká **favely**. Hned vedle stojí hlídané čtvrti bohatých. Latinská Amerika patří k regionům s největšími rozdíly mezi bohatými a chudými na světě (Světová banka).' },
            { type: 'p', text: 'Bohatství regionu přitom stojí hlavně na surovinách a zemědělství. Hlavní vývozní artikly ukazují karty:' },
            { type: 'iconlist', items: [
              { icon: 'seed', title: 'Sója a hovězí (Brazílie, Argentina)', text: 'Brazílie je největším vývozcem sóji na světě' },
              { icon: 'pickaxe', title: 'Měď (Chile, Peru)', text: 'Chile je největším těžařem mědi na světě' },
              { icon: 'oil-barrel', title: 'Ropa (Venezuela, Brazílie, Mexiko)', text: 'Venezuela má největší známé zásoby ropy, a přesto z ní kvůli hospodářské a politické krizi odešlo téměř 8 milionů lidí (R4V, 2025)' },
              { icon: 'coffee', title: 'Káva a banány', text: 'Brazílie a Kolumbie (káva), Ekvádor (banány)' },
              { icon: 'car', title: 'Továrny v Mexiku', text: 'montáž aut a elektroniky pro trh USA' },
            ] },
            { type: 'p', text: 'Mezi Mexikem a Jižní Amerikou leží úzká pevninská šíje Střední Ameriky a ostrovy v Karibském moři. Jsou malé, ale pro světový obchod i pro počasí velmi důležité.' },
            { type: 'check', question: { kind: 'tf', q: 'Ve městech Latinské Ameriky žije menšina obyvatel, většina žije na venkově.', answer: false, explain: 'Latinská Amerika je silně urbanizovaná: ve městech žijí asi čtyři lidé z pěti.' } },
          ],
        },
        {
          title: 'Střední Amerika a Karibik',
          icon: 'island',
          blocks: [
            { type: 'p', text: 'Střední Amerika je úzký most pevniny mezi oběma Amerikami. V nejužším místě, v Panamě, měří jen asi 50 km. Proto tu vznikl průplav, o kterém jsme mluvili v lekci „Doprava a spoje“.' },
            { type: 'p', text: 'Připomeň si, jak průplav převádí lodě přes šíji, která je o desítky metrů vyšší než moře:' },
            { type: 'diagram', id: 'panama-canal', caption: 'Panamský průplav: plavební komory zvednou lodě k Gatúnskému jezeru a zase je spustí k druhému oceánu; cesta kolem Jižní Ameriky odpadne.' },
            { type: 'p', text: 'Region leží na rozhraní desek, a proto ho ohrožují sopky a zemětřesení: zemětřesení na Haiti v roce 2010 zabilo podle odhadů přes 200 000 lidí. Z teplého moře sem navíc přicházejí hurikány. V říjnu 2025 zasáhl Jamajku hurikán Melissa nejvyšší, 5. kategorie – nejsilnější, jaký kdy na ostrov dopadl. Chudé ostrovní státy se z takových katastrof vzpamatovávají roky.' },
            { type: 'callout', variant: 'fact', text: 'Karibik žije hlavně z cestovního ruchu: pláže, korálové útesy a teplé moře. Každý silný hurikán proto zasáhne i jeho hlavní zdroj příjmů.' },
            { type: 'p', text: 'Z Latinské Ameriky se teď vydáme přes celý Tichý oceán: v příští lekci nás čeká nejsušší obydlený světadíl a ostrovy, kterým stoupá moře až ke dveřím.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč ohrožují Střední Ameriku a Karibik zemětřesení i hurikány?', options: ['leží na rozhraní litosférických desek a u teplého moře', 'leží v polárním pásu', 'leží uprostřed velké stabilní pevniny', 'jsou chráněny Andami před větrem'], answer: 0, explain: 'Pohyby desek způsobují zemětřesení a sopky, teplé moře je zdrojem energie hurikánů.' } },
          ],
        },
      ],
      summary: [
        'Latinská Amerika je kulturní region: Mexiko, Střední Amerika, Karibik a Jižní Amerika, kde se mluví hlavně španělsky a v Brazílii portugalsky (smlouva z Tordesillas, 1494).',
        'Před příchodem Evropanů tu žili Mayové, Aztékové a Inkové; dnešní obyvatelstvo je velmi smíšené.',
        'Andy jsou nejdelší pohoří světa (asi 7 000 km) s Aconcaguou (6 961 m); u rovníku určuje podnebí hlavně nadmořská výška (Quito vs Manaus).',
        'Amazonka má největší povodí a nejvíc vody na světě; její prales ubývá kvůli pastvinám, sóje, těžbě a silnicím.',
        'Odlesňování brazilské Amazonie kleslo z 27 772 km² (2004, nejvíc od roku 1995) na asi 5 800 km² (2025, předběžně) podle INPE; satelitní hlášení za 2025/26 ukazují další pokles.',
        'Asi čtyři z pěti obyvatel žijí ve městech; vedle bohatých čtvrtí stojí favely a nerovnosti patří k největším na světě.',
        'Střední Ameriku a Karibik ohrožují zemětřesení, sopky a hurikány (Melissa 2025); region žije z průplavu, zemědělství a cestovního ruchu.',
      ],
      quiz: [
        { kind: 'tf', q: 'Latinská Amerika a Jižní Amerika jsou dva názvy pro totéž území.', answer: false, explain: 'Jižní Amerika je světadíl (kontinent). Latinská Amerika je kulturní region, ke kterému patří i Mexiko, Střední Amerika a Karibik.' },
        { kind: 'choice', q: 'Která řeka má největší povodí a nejvíc vody na světě?', options: ['Amazonka', 'Nil', 'Mississippi', 'Kongo'], answer: 0, explain: 'Povodí Amazonky má asi 7 mil. km² a řeka nese asi pětinu vody, kterou řeky přinášejí do oceánů.' },
        { kind: 'match', q: 'Přiřaď civilizaci k oblasti, kde žila.', pairs: [
          ['Inkové', 'Andy (Peru)'],
          ['Aztékové', 'Mexická vysočina'],
          ['Mayové', 'Yucatán a Guatemala'],
        ], explain: 'Inkové ovládali Andy, Aztékové měli hlavní město Tenochtitlán v Mexiku, Mayové žili na Yucatánu a v Guatemale.' },
        { kind: 'number', q: 'V roce 2004 se v brazilské Amazonii vykácelo 27 772 km² pralesa, v roce 2025 asi 5 796 km². Kolikrát méně to bylo v roce 2025? (zaokrouhli na celé číslo)', answer: 5, tolerance: 0, explain: '27 772 : 5 796 ≐ 4,8, tedy asi pětkrát méně.' },
        { kind: 'multi', q: 'Co platí o Andách?', options: ['jsou nejdelším pohořím světa', 'vznikly podsouváním oceánské desky pod Jižní Ameriku', 'jsou v nich sopky a zemětřesení', 'jsou to staré, obroušené hory', 'leží na východním pobřeží Jižní Ameriky'], answers: [0, 1, 2], explain: 'Andy jsou mladé vysoké pohoří na západním okraji kontinentu, kde se podsouvá oceánská deska – proto sopky a zemětřesení.' },
        { kind: 'choice', q: 'Jak se v Brazílii říká čtvrtím, které si chudí obyvatelé postavili sami na okrajích a svazích měst?', options: ['favely', 'předměstí', 'sídliště', 'favorité'], answer: 0, explain: 'Favely jsou neformální čtvrti brazilských měst. Podobná sídla mají i jiná rychle rostoucí města světa.' },
        { kind: 'tf', q: 'V Quitu se průměrné měsíční teploty během roku skoro nemění.', answer: true, explain: 'Quito leží skoro na rovníku, kde nejsou teplotní roční období. Všechny měsíce mají kolem 14–15 °C.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-7
    'z7-7': {
      id: 'z7-7',
      title: 'Austrálie a Oceánie',
      goals: [
        'Vymezit Austrálii, Nový Zéland, Melanésii, Mikronésii a Polynésii na mapě',
        'Vysvětlit, proč je Austrálie nejsušší obydlený světadíl, a přečíst klimatogram z jejího vnitrozemí',
        'Popsat Velký bariérový útes a příčinu bělení korálů',
        'Vysvětlit, proč stoupající hladina moře ohrožuje korálové ostrovy jako Tuvalu',
      ],
      hook: 'V roce 2025 se přihlásilo do losování o australská víza přes 8 700 lidí z Tuvalu – počet, který odpovídá čtyřem pětinám obyvatel ostrovního státu. Proč by skoro celý národ chtěl odejít z domova?',
      sections: [
        {
          title: 'Kontinent a tisíce ostrovů',
          icon: 'island',
          blocks: [
            { type: 'p', text: 'Austrálie a Oceánie je nejmenší světadíl rozlohou a nejméně lidnatý z obydlených světadílů. Tvoří ho jeden malý kontinent, Austrálie, a tisíce ostrovů roztroušených po Tichém oceánu. Mezi nimi jsou tisíce kilometrů vody.' },
            { type: 'p', text: 'Ostrovy Oceánie se dělí do tří skupin. Na mapě je najdi podle barev a hledej i Tuvalu blízko datové hranice:' },
            { type: 'map', view: 'oceania', highlight: [
              { codes: ['AUS'], tone: 'a', label: 'Austrálie' },
              { codes: ['NZL'], tone: 'b', label: 'Nový Zéland' },
              { codes: ['PNG', 'SLB', 'VUT', 'FJI', 'NCL'], tone: 'c', label: 'Melanésie' },
              { codes: ['FSM', 'MHL', 'PLW', 'NRU', 'KIR', 'TUV', 'WSM', 'TON', 'PYF', 'COK', 'NIU'], tone: 'd', label: 'Mikronésie a Polynésie' },
            ], points: [
              { lat: -35.28, lon: 149.13, label: 'Canberra', kind: 'capital' },
              { lat: -33.87, lon: 151.21, label: 'Sydney', kind: 'city' },
              { lat: -41.29, lon: 174.78, label: 'Wellington', kind: 'capital' },
              { lat: -8.52, lon: 179.2, label: 'Funafuti (Tuvalu)', kind: 'capital' },
            ], caption: 'Austrálie a Oceánie. Hlavním městem Austrálie je Canberra, ne Sydney.' },
            { type: 'p', text: 'Názvy tří skupin ostrovů pocházejí z řečtiny a popisují, jak ostrovy vypadaly prvním evropským mořeplavcům:' },
            { type: 'keyterms', items: [
              { term: '**Melanésie**', def: '„černé ostrovy“: velké, hornaté a zalesněné ostrovy na západě (Nová Guinea, Šalamounovy ostrovy, Fidži)' },
              { term: '**Mikronésie**', def: '„malé ostrovy“: drobné ostrovy a atoly severně od rovníku (Marshallovy ostrovy, Palau)' },
              { term: '**Polynésie**', def: '„mnoho ostrovů“: obrovský trojúhelník mezi Havajem, Novým Zélandem a Velikonočním ostrovem (Samoa, Tonga, Tuvalu)' },
            ] },
            { type: 'p', text: 'Pozor na omyl: Nový Zéland leží v Polynésii, ale nepočítá se mezi drobné ostrovy – je velký a hornatý. Začneme ale u největšího kusu pevniny – u Austrálie.' },
            { type: 'check', question: { kind: 'tf', q: 'Hlavním městem Austrálie je Sydney.', answer: false, explain: 'Hlavním městem je Canberra, postavená jako kompromis mezi Sydney a Melbourne. Sydney je největší město.' } },
          ],
        },
        {
          title: 'Nejsušší obydlený světadíl',
          icon: 'dune',
          blocks: [
            { type: 'p', text: 'Austrálie je nejsušší obydlený světadíl – sušší je jen Antarktida. Asi 70 % území tvoří pouště a polopouště. Proč, když ji ze všech stran obklopuje oceán?' },
            { type: 'p', text: 'Příčiny jsou tři a všechny znáš z lekce „Oběh vzduchu a podnebné pásy“:' },
            { type: 'iconlist', items: [
              { icon: 'sun', title: 'Obratník Kozoroha', text: 'střed Austrálie leží v pásu vysokého tlaku, kde vzduch klesá, otepluje se a srážky v něm nevznikají' },
              { icon: 'mountain', title: 'Velké předělové pohoří', text: 'na východním pobřeží zachytí vlhký vzduch od oceánu; vnitrozemí zůstane v dešťovém stínu' },
              { icon: 'ocean', title: 'Studený proud na západě', text: 'studené moře u západního pobřeží dává málo páry na déšť' },
            ] },
            { type: 'p', text: 'Jak vypadá rok v srdci Austrálie, ukazuje klimatogram Alice Springs. Pozor: leží na jižní polokouli. Hledej, kdy je léto:' },
            { type: 'climate', places: [
              { name: 'Alice Springs (Austrálie)', temp: [29.7, 28.5, 25.7, 21.1, 15.8, 12.4, 12.3, 14.7, 20, 23.4, 26.4, 28.2], precip: [48.9, 40.7, 19.9, 19.9, 17.5, 10.3, 13, 3.8, 7.8, 18.7, 33, 41.3], altitude: 546, source: 'Bureau of Meteorology, normál 1991–2020' },
            ], caption: 'Alice Springs: nejtepleji v lednu (léto jižní polokoule), jen asi 275 mm srážek za rok.' },
            { type: 'p', text: 'Nejtepleji je v lednu a nejchladněji v červenci – roční období jsou proti nám obrácená, jak víš z lekce „Oběh Země kolem Slunce a roční období“. Ročně tu spadne jen asi 275 mm srážek. Proto žije většina z 27,8 milionu Australanů (ABS, prosinec 2025) na úrodném a vlhčím jihovýchodním pobřeží: v Sydney, Melbourne a Brisbane. Vnitrozemí („outback“) je skoro prázdné.' },
            { type: 'p', text: 'Pobřeží Austrálie ale nejsou jen města. U severovýchodního pobřeží leží největší stavba, kterou kdy vytvořily živé organismy.' },
            { type: 'check', question: { kind: 'multi', q: 'Proč je vnitrozemí Austrálie tak suché?', options: ['leží v pásu vysokého tlaku u obratníku', 'Velké předělové pohoří zachytí vlhký vzduch na východním pobřeží', 'u západního pobřeží teče studený mořský proud', 'leží v polárním pásu', 'má monzunové podnebí s deštivou zimou'], answers: [0, 1, 2], explain: 'Klesající vzduch u obratníku, dešťový stín za horami a studený proud na západě – tři příčiny sucha. Monzun zasahuje jen tropický sever Austrálie.' } },
          ],
        },
        {
          title: 'Velký bariérový útes',
          icon: 'fish',
          blocks: [
            { type: 'p', text: '**Velký bariérový útes** se táhne asi 2 300 km podél pobřeží Queenslandu. Je to největší soustava korálových útesů na Zemi a od roku 1981 je na Seznamu světového dědictví UNESCO. Kde přesně leží?' },
            { type: 'p', text: 'Najdi ho na mapě podél severovýchodního pobřeží Austrálie:' },
            { type: 'map', view: 'oceania', routes: [
              { points: [{ lat: -10.7, lon: 143.5 }, { lat: -14.5, lon: 145.0 }, { lat: -16.5, lon: 146.2 }, { lat: -19.5, lon: 148.5 }, { lat: -22.0, lon: 151.5 }, { lat: -24.5, lon: 152.7 }], label: 'Velký bariérový útes', tone: 'c' },
            ], points: [
              { lat: -16.92, lon: 145.77, label: 'Cairns', kind: 'city' },
            ], caption: 'Velký bariérový útes u pobřeží Queenslandu, asi 2 300 km dlouhý.' },
            { type: 'p', text: 'Útes staví korálové polypy, drobní živočichové, kteří žijí v soužití s řasami. Když je moře příliš teplé, korály řasy vypudí a zbělají – **bělení korálů**. Pokud horko trvá dlouho, korály uhynou. Útes postihlo hromadné bělení v letech 1998, 2002, 2016, 2017, 2020, 2022, 2024 a 2025. Výsledek změřil australský institut AIMS:' },
            { type: 'table', headers: ['část útesu', '2024', '2025', '2026'], rows: [
              ['severní', '39,8 %', '30,0 %', '35,1 %'],
              ['střední', '33,2 %', '28,6 %', '31,6 %'],
              ['jižní', '38,9 %', '26,9 %', '26,4 %'],
            ], caption: 'Pokryvnost korálů = podíl dna pokrytého živými korály, podle AIMS (zprávy 2024/25 a 2025/26). V roce 2025 šlo na severu a jihu o největší roční pokles za 39 let měření; v roce 2026 se sever a střed začaly zotavovat.' },
            { type: 'p', text: 'Příčinou je podle vědců hlavně oteplování oceánu při změně klimatu, škodí i cyklony a hvězdice trnová koruna. Korály se umějí vzpamatovat, jak ukazuje rok 2026, ale potřebují k tomu roky klidu – a horké roky přicházejí stále častěji.' },
            { type: 'p', text: 'Moře tedy pro Austrálii znamená bohatství i hrozbu. Nejdéle s ním ale žijí lidé, kteří sem připluli jako první.' },
            { type: 'check', question: { kind: 'choice', q: 'Co způsobuje bělení korálů?', options: ['příliš teplá mořská voda, kvůli které korály vypudí řasy', 'příliš studená voda v zimě', 'rybáři, kteří korály natírají', 'sníh, který napadá na útes'], answer: 0, explain: 'V teplé vodě korály vypudí řasy, se kterými žijí, a zbělají. Trvá-li horko dlouho, korály hynou.' } },
          ],
        },
        {
          title: 'První obyvatelé a Nový Zéland',
          icon: 'people',
          blocks: [
            { type: 'p', text: 'Původní obyvatelé Austrálie, **Aboriginci**, a obyvatelé ostrovů Torresova průlivu tu žijí nejméně 50 000 let. Patří tak k nejstarším nepřetržitým kulturám světa. Dnes tvoří asi 3,8 % obyvatel Austrálie (ABS, 2021). Pro místní Anangu je posvátná hora Uluru v poušti uprostřed kontinentu.' },
            { type: 'p', text: 'Na Nový Zéland dorazili lidé mnohem později: polynéští mořeplavci **Maorové** asi kolem roku 1300, Evropané se tu začali usazovat až v 19. století. Dnes se k Maorům hlásí asi 18 % obyvatel. Oba státy mají britské dějiny, ale jejich příroda se úplně liší:' },
            { type: 'compare', columns: [
              { title: 'Austrálie', icon: 'dune', tone: 'a', points: ['starý, stabilní kontinent uprostřed desky', 'nízký a plochý, nejvyšší hora 2 228 m', 'skoro žádné sopky ani silná zemětřesení', 'pouště, savany, eukalyptové lesy'] },
              { title: 'Nový Zéland', icon: 'volcano', tone: 'b', points: ['ostrovy na hranici dvou desek', 'Jižní Alpy, Aoraki / Mount Cook 3 724 m', 'sopky, gejzíry a zemětřesení (Christchurch 2011)', 'deštné lesy, ledovce a fjordy'] },
            ], caption: 'Austrálie a Nový Zéland: sousedé s úplně jinou přírodou.' },
            { type: 'p', text: 'Obě země jsou bohaté: Austrálie vyváží železnou rudu, uhlí, zemní plyn a pšenici, hlavně do Asie. Nový Zéland žije z chovu ovcí a skotu, mléčných výrobků a turistiky. Mnohem chudší a zranitelnější jsou ale malé ostrovní státy v Tichém oceánu.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: rychlé otázky z Austrálie, Oceánie a ostatních regionů světa.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč má Nový Zéland sopky a zemětřesení, a Austrálie skoro ne?', options: ['Nový Zéland leží na hranici dvou litosférických desek, Austrálie uprostřed desky', 'Nový Zéland je blíž k rovníku', 'Austrálie je menší než Nový Zéland', 'v Austrálii je moc sucho na sopky'], answer: 0, explain: 'Sopky a zemětřesení vznikají hlavně na hranicích desek. Nový Zéland na jedné leží, Austrálie je uprostřed stabilní desky.' } },
          ],
        },
        {
          title: 'Ostrovy, kterým stoupá moře',
          icon: 'ocean',
          blocks: [
            { type: 'p', text: 'Proč tedy obyvatelé Tuvalu žádají o víza? Tuvalu tvoří devět korálových ostrovů a atolů o rozloze jen asi 26 km², na kterých žilo asi 10 600 lidí (sčítání 2022). Nejvyšší bod leží jen asi 4,6 m nad mořem. Jak takový ostrov vznikl?' },
            { type: 'p', text: 'Odpověď najdeš v lekci „Pobřeží“: **atol** je prstenec korálů kolem laguny, který zbyl po potopené sopce. Sleduj na obrázku, jak vzniká:' },
            { type: 'diagram', id: 'coral-atoll', caption: 'Vznik atolu: korály rostou kolem sopečného ostrova; ostrov se pomalu potápí, korály rostou vzhůru a nakonec zbude jen prstenec kolem laguny.' },
            { type: 'p', text: 'Atol je tedy jen o málo vyšší než příliv. Hladina světového oceánu přitom od roku 1880 stoupla o 21–24 cm a stoupá stále rychleji: v roce 1993 asi o 2,1 mm ročně, v roce 2024 už o 4,5 mm ročně (NASA). Příčinou je tání ledovců a teplotní roztažnost oteplené vody. Vyzkoušej si, co znamená každý centimetr:' },
            { type: 'experiment', id: 'sea-level-rise', caption: 'Hladina moře stoupá: nízké pobřeží a atol mizí pod vodou. Proč moře stoupá, podrobněji vysvětlí lekce „Krajiny ledovců, pouští a pobřeží“.' },
            { type: 'p', text: 'Všiml/a sis? Atol nezmizí najednou. Už pár desítek centimetrů stačí, aby bouřkový příliv zaplavoval domy a slaná voda pronikla do studní a polí. Ostrov se stane neobyvatelným dřív, než ho moře zatopí.' },
            { type: 'p', text: 'Ostrovní státy proto hledají východiska. Tuvalu a Austrálie podepsaly v roce 2023 smlouvu **Falepili**: od roku 2025 může každý rok 280 obyvatel Tuvalu získat australské trvalé pobytové vízum. Do prvního losování se v roce 2025 přihlásilo 8 750 lidí včetně rodin, tedy počet odpovídající asi 82 % obyvatel podle sčítání 2022. Sousední Kiribati koupilo pole na Fidži, aby mělo kde pěstovat potraviny.' },
            { type: 'callout', variant: 'warning', text: 'Ostrovy Tichého oceánu vypouštějí jen nepatrný zlomek skleníkových plynů. Změnu klimatu ale pocítí jako první. Je to jeden z nejjasnějších příkladů nespravedlnosti změny klimatu.' },
            { type: 'p', text: 'Led, jehož tání zvedá hladinu moře u Tuvalu, leží hlavně na opačných koncích Země. V poslední lekci úrovně se proto vydáme do polárních oblastí.' },
            { type: 'check', question: { kind: 'tf', q: 'Atol jako Tuvalu se stane neobyvatelným, až když ho moře úplně zatopí.', answer: false, explain: 'Už o něco vyšší hladina stačí, aby bouřkové vlny zaplavovaly domy a slaná voda zničila studny a pole. Ostrov přestane být obyvatelný dřív, než zmizí.' } },
          ],
        },
      ],
      summary: [
        'Austrálie a Oceánie je nejmenší světadíl: kontinent Austrálie, Nový Zéland a ostrovy Melanésie, Mikronésie a Polynésie.',
        'Austrálie je nejsušší obydlený světadíl: leží u obratníku v pásu vysokého tlaku, hory na východě zachytí vlhkost a na západě je studený proud.',
        'Většina z 27,8 mil. Australanů žije na jihovýchodním pobřeží; hlavním městem je Canberra.',
        'Velký bariérový útes (asi 2 300 km) je největší soustava korálových útesů; kvůli teplému moři opakovaně bělá, v roce 2025 zaznamenal na severu a jihu největší pokles korálů za 39 let měření.',
        'Aboriginci žijí v Austrálii nejméně 50 000 let, Maorové na Novém Zélandu asi od roku 1300.',
        'Nový Zéland leží na hranici desek (sopky, zemětřesení), Austrálie uprostřed stabilní desky.',
        'Hladina moře stoupá asi o 4,5 mm ročně (2024); nízké atoly jako Tuvalu se stávají neobyvatelnými, proto Tuvalu uzavřelo s Austrálií smlouvu Falepili.',
      ],
      quiz: [
        { kind: 'choice', q: 'Který světadíl je sušší než Austrálie?', options: ['Antarktida', 'Afrika', 'Asie', 'Evropa'], answer: 0, explain: 'Antarktida je nejsušší světadíl (polární poušť). Austrálie je nejsušší obydlený světadíl.' },
        { kind: 'tf', q: 'V Alice Springs je nejtepleji v lednu.', answer: true, explain: 'Alice Springs leží na jižní polokouli, kde je v lednu léto. Lednový průměr je asi 29,7 °C, červencový asi 12,3 °C.' },
        { kind: 'match', q: 'Přiřaď skupinu ostrovů k jejímu popisu.', pairs: [
          ['Melanésie', 'velké hornaté ostrovy na západě (Nová Guinea, Fidži)'],
          ['Mikronésie', 'drobné ostrovy a atoly severně od rovníku'],
          ['Polynésie', 'trojúhelník mezi Havajem, Novým Zélandem a Velikonočním ostrovem'],
        ], explain: 'Melanésie = „černé ostrovy“, Mikronésie = „malé ostrovy“, Polynésie = „mnoho ostrovů“.' },
        { kind: 'number', q: 'Hladina oceánu stoupá asi o 4,5 mm za rok. O kolik centimetrů by stoupla za 20 let, kdyby rychlost zůstala stejná?', answer: 9, tolerance: 0.1, unit: 'cm', explain: '4,5 mm · 20 = 90 mm = 9 cm. Ve skutečnosti se vzestup ještě zrychluje.' },
        { kind: 'multi', q: 'Co platí o Velkém bariérovém útesu?', options: ['je největší soustavou korálových útesů na Zemi', 'leží u severovýchodního pobřeží Austrálie', 'opakovaně bělá kvůli příliš teplému moři', 'leží u pobřeží Nového Zélandu', 'vytvořily ho sopky'], answers: [0, 1, 2], explain: 'Útes tvoří korály u pobřeží Queenslandu. V letech 2024 a 2025 hromadně bělal a pokryvnost korálů prudce klesla.' },
        { kind: 'choice', q: 'Proč žije většina Australanů na jihovýchodním pobřeží?', options: ['je tam mírnější a vlhčí podnebí a úrodná půda', 'vnitrozemí je hornaté a zalesněné', 'na jihovýchodě jsou největší pouště', 'jinde nesmí lidé žít ze zákona'], answer: 0, explain: 'Vnitrozemí je suché (Alice Springs jen asi 275 mm srážek). Na jihovýchodě je víc srážek, mírné podnebí a úrodná půda.' },
        { kind: 'tf', q: 'Atol vzniká z korálů, které rostou kolem potápějícího se sopečného ostrova.', answer: true, explain: 'Korály rostou vzhůru, zatímco sopečný ostrov klesá. Nakonec zbude jen korálový prstenec kolem laguny.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z7-8
    'z7-8': {
      id: 'z7-8',
      title: 'Polární oblasti',
      goals: [
        'Rozlišit Arktidu (zamrzlý oceán obklopený pevninami) a Antarktidu (zaledněný světadíl obklopený oceánem)',
        'Vysvětlit, proč je Antarktida chladnější než Arktida, a přečíst klimatogram z arktického pobřeží',
        'Popsat Antarktickou smlouvu a českou účast ve výzkumu Antarktidy',
        'Vysvětlit, jak tání arktického ledu otevírá nové lodní cesty a proč se Arktida otepluje nejrychleji',
      ],
      hook: 'Lední medvěd nikdy nepotká tučňáka. Medvědi žijí jen na severu, tučňáci (až na výjimky u rovníku) jen na jihu. Proč jsou si oba póly tak vzdálené – a nejen kilometry?',
      sections: [
        {
          title: 'Oceán, nebo pevnina?',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'Oba póly jsou pokryté ledem a v zimě tonou v polární noci, jak víš z lekce „Oběh Země kolem Slunce a roční období“. Pod ledem je ale zásadní rozdíl. Na severním pólu je pod ledem oceán, na jižním pevnina.' },
            { type: 'p', text: 'Prohlédni si řez oběma polárními oblastmi a porovnej, co je pod ledem a jak je led silný:' },
            { type: 'diagram', id: 'polar-compare', caption: 'Arktida: zamrzlý Severní ledový oceán, mořský led silný jen pár metrů, kolem pevniny. Antarktida: světadíl pod ledovým štítem silným v průměru asi 2 km, kolem oceán.' },
            { type: 'p', text: 'Pozor, v názvech se chybuje často. Tři pojmy, které musíš rozlišit:' },
            { type: 'keyterms', items: [
              { term: '**Arktida**', def: 'oblast kolem severního pólu: Severní ledový oceán, ostrovy (Grónsko, Špicberky) a severní okraje Evropy, Asie a Ameriky' },
              { term: '**Antarktida**', def: 'světadíl kolem jižního pólu, z 98 % pokrytý ledovým štítem (asi 14,2 mil. km²)' },
              { term: '**Antarktis**', def: 'celá jižní polární oblast: Antarktida spolu s okolním Jižním oceánem a ostrovy' },
            ] },
            { type: 'p', text: 'Arktida má obyvatele: Inuity, Sámy, Něnce a další národy i města s tisíci lidí. Na mapě najdi státy, kterým patří území za polárním kruhem:' },
            { type: 'map', view: 'arctic', layers: ['tropics'], highlight: [
              { codes: ['CAN', 'USA', 'RUS', 'NOR', 'SWE', 'FIN', 'ISL', 'DNK', 'GRL'], tone: 'a', label: 'arktické státy (Grónsko patří k Dánsku)' },
            ], points: [
              { lat: 90, lon: 0, label: 'severní pól', kind: 'place' },
              { lat: 71.29, lon: -156.79, label: 'Utqiaġvik', kind: 'city' },
              { lat: 78.22, lon: 15.65, label: 'Longyearbyen (Špicberky)', kind: 'city' },
              { lat: 64.18, lon: -51.69, label: 'Nuuk', kind: 'city' },
            ], caption: 'Arktida: Severní ledový oceán obklopený pevninami osmi arktických států. Vyznačen je i severní polární kruh.' },
            { type: 'p', text: 'Arktida je tedy moře mezi kontinenty, Antarktida kontinent uprostřed moře. A právě tento rozdíl rozhoduje o tom, kde je větší zima.' },
            { type: 'check', question: { kind: 'tf', q: 'Pod ledem na severním pólu leží pevnina.', answer: false, explain: 'Na severním pólu je pod několik metrů silným mořským ledem Severní ledový oceán. Pevnina je pod ledem na jižním pólu – Antarktida.' } },
          ],
        },
        {
          title: 'Kde je větší zima',
          icon: 'snowflake',
          blocks: [
            { type: 'p', text: 'Oba póly dostávají stejně málo slunečního záření. Přesto je Antarktida mnohem chladnější. Začněme u Arktidy: jak vypadá rok v nejsevernějším městě USA, Utqiaġviku na Aljašce?' },
            { type: 'p', text: 'Na klimatogramu sleduj, kolik měsíců je teplota nad nulou a kolik srážek spadne:' },
            { type: 'climate', places: [
              { name: 'Utqiaġvik (Aljaška, USA)', temp: [-24.2, -24.4, -23.6, -15.6, -5.2, 2.2, 5.4, 4.3, 0.9, -6, -14.6, -21.3], precip: [3.6, 5.3, 4.6, 4.6, 7.1, 11, 25, 28, 20, 14, 9.4, 5.6], source: 'NOAA, normál 1991–2020' },
            ], caption: 'Utqiaġvik (71° s. š.): jen čtyři měsíce nad nulou, asi 140 mm srážek za rok – polární podnebí, a přesto skoro poušť.' },
            { type: 'p', text: 'Nad nulou jsou jen čtyři letní měsíce a srážek spadne méně než v mnoha pouštích. V Antarktidě je ale ještě mnohem chladněji. Porovnej průměrné roční teploty antarktických stanic:' },
            { type: 'table', headers: ['místo', 'poloha', 'průměrná roční teplota'], rows: [
              ['Utqiaġvik', 'arktické pobřeží Aljašky', '≈ −10 °C'],
              ['McMurdo', 'pobřeží Antarktidy', '≈ −17 °C'],
              ['Vostok', 'vnitrozemí Antarktidy, 3 488 m n. m.', '≈ −55 °C'],
            ], caption: 'Na stanici Vostok naměřili 21. 7. 1983 −89,2 °C, nejnižší teplotu změřenou teploměrem na Zemi.' },
            { type: 'p', text: 'Proč je jih chladnější? Antarktida je v průměru nejvýše položený světadíl, protože na ní leží led silný až 4,8 km – a s výškou teplota klesá. Navíc ji obklopuje studený oceán. Arktidu naopak oceán pod ledem zahřívá: voda pod ledem má kolem −2 °C, ne −50 °C.' },
            { type: 'callout', variant: 'fact', text: 'V Antarktidě je asi 90 % veškerého ledu na Zemi. Kdyby celý roztál, hladina světového oceánu by stoupla asi o 58 m.' },
            { type: 'p', text: 'Takové bohatství ledu, a pod ním možná i nerostných surovin, by mohlo být důvodem ke sporům. Antarktida je ale jediný světadíl, který nepatří žádnému státu.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč je v Antarktidě chladněji než v Arktidě?', options: ['Antarktida je vysoko položená pevnina pod silným ledem, Arktidu zahřívá oceán pod ledem', 'Antarktida je blíž ke Slunci', 'v Arktidě je celý rok polární den', 'na jižní polokouli Slunce nesvítí'], answer: 0, explain: 'Led silný kilometry dělá z Antarktidy nejvýše položený světadíl a s výškou teplota klesá. V Arktidě je pod tenkým ledem relativně teplá voda.' } },
          ],
        },
        {
          title: 'Antarktida: světadíl pro vědu',
          icon: 'penguin',
          blocks: [
            { type: 'p', text: 'Několik států si v minulosti nárokovalo části Antarktidy. Aby se o ni nevedly spory, podepsalo v roce 1959 ve Washingtonu dvanáct států **Antarktickou smlouvu** (platí od roku 1961). Dnes ji přijalo přes padesát států.' },
            { type: 'p', text: 'Co smlouva stanoví, shrnují body:' },
            { type: 'iconlist', items: [
              { icon: 'microscope', title: 'Jen pro mír a vědu', text: 'žádné vojenské základny ani zbraně, výsledky výzkumu se sdílejí' },
              { icon: 'flag', title: 'Nároky zmrazeny', text: 'žádný stát si nesmí přisvojit nové území' },
              { icon: 'pickaxe', title: 'Zákaz těžby', text: 'Madridský protokol (1991) zakázal těžbu nerostných surovin' },
              { icon: 'recycle', title: 'Ochrana přírody', text: 'odpad se z Antarktidy odváží, chráněni jsou tučňáci, tuleni i krajina' },
            ] },
            { type: 'p', text: 'Do Antarktidy jezdí i čeští vědci. Masarykova univerzita z Brna provozuje od roku 2007 **stanici Johanna Gregora Mendela** na ostrově Jamese Rosse u Antarktického poloostrova. Od roku 2014 je Česko konzultativní stranou smlouvy, tedy státem, který o Antarktidě spolurozhoduje. Na mapě najdi českou stanici a další známá místa:' },
            { type: 'map', view: 'antarctica', points: [
              { lat: -90, lon: 0, label: 'jižní pól', kind: 'place' },
              { lat: -78.46, lon: 106.84, label: 'stanice Vostok', kind: 'place' },
              { lat: -77.85, lon: 166.67, label: 'McMurdo', kind: 'place' },
              { lat: -63.8, lon: -57.88, label: 'česká stanice J. G. Mendela', kind: 'place' },
            ], caption: 'Antarktida: jižní pól, nejchladnější stanice Vostok, největší stanice McMurdo a česká stanice Johanna Gregora Mendela na ostrově Jamese Rosse.' },
            { type: 'p', text: 'Antarktida je tedy chráněná smlouvou. Arktida takovou smlouvu nemá: její moře a pevniny patří jednotlivým státům – a s ustupujícím ledem roste jejich zájem.' },
            { type: 'check', question: { kind: 'multi', q: 'Co stanoví Antarktická smlouva a Madridský protokol?', options: ['Antarktidu lze využívat jen k mírovým a vědeckým účelům', 'nárokům států na území se nesmí přidávat nové', 'těžba nerostných surovin je zakázána', 'Antarktida patří Spojeným státům', 'v Antarktidě se smějí zkoušet zbraně'], answers: [0, 1, 2], explain: 'Antarktida slouží míru a vědě, nároky jsou zmrazené a těžba zakázaná. Žádnému státu nepatří.' } },
          ],
        },
        {
          title: 'Arktida: suroviny a nové cesty',
          icon: 'ship',
          blocks: [
            { type: 'p', text: 'Pod dnem Severního ledového oceánu leží podle odhadu USGS (2008) asi 13 % dosud neobjevené ropy a 30 % neobjeveného zemního plynu světa. A když led v létě ustupuje, otevírají se lodím cesty, které byly dřív zamrzlé.' },
            { type: 'p', text: 'Klasická cesta z Evropy do východní Asie vede na jih přes Suezský průplav a Indický oceán. Na mapě najdi dvě kratší arktické cesty:' },
            { type: 'map', view: 'arctic', routes: [
              { points: [{ lat: 69.0, lon: 33.1 }, { lat: 70.4, lon: 58.0 }, { lat: 73.5, lon: 80.0 }, { lat: 77.8, lon: 104.0 }, { lat: 76.0, lon: 125.0 }, { lat: 74.5, lon: 150.0 }, { lat: 70.0, lon: 175.0 }, { lat: 66.0, lon: -169.0 }], label: 'Severní mořská cesta (podél Ruska)', tone: 'a', arrow: true },
              { points: [{ lat: 66.0, lon: -169.0 }, { lat: 71.3, lon: -156.8 }, { lat: 70.5, lon: -130.0 }, { lat: 74.5, lon: -100.0 }, { lat: 74.2, lon: -80.0 }, { lat: 70.0, lon: -60.0 }, { lat: 64.0, lon: -55.0 }], label: 'Severozápadní průjezd (Kanadské arktické souostroví)', tone: 'b', style: 'dashed' },
            ], points: [
              { lat: 68.97, lon: 33.08, label: 'Murmansk', kind: 'city' },
              { lat: 66.0, lon: -169.0, label: 'Beringův průliv', kind: 'place' },
            ], caption: 'Severní mořská cesta zkracuje plavbu z Evropy do východní Asie asi o třetinu. Je ale splavná jen v létě a na podzim, často s pomocí ledoborců.' },
            { type: 'p', text: 'Arktické cesty mají ale háček. V roce 2025 proplulo celou Severní mořskou cestou 103 lodí s asi 3,2 mil. tun nákladu (CHNL, Rosatom) – víc než kdy dřív, ale nepatrně proti zhruba 26 000 lodím, které proplouvaly Suezským průplavem každý rok před krizí v Rudém moři. Plavba je možná jen pár měsíců, potřebuje drahé ledoborce a vede podél Ruska, které ji kontroluje.' },
            { type: 'callout', variant: 'warning', text: 'Ropa v ledovém moři je velké riziko: když dojde k havárii, ve tmě, mrazu a ledu se skoro nedá uklidit a rozkládá se mnohem pomaleji než v teplém moři.' },
            { type: 'p', text: 'Nové cesty a suroviny tedy otevírá tání ledu. Proč led ubývá a proč právě na pólech nejrychleji?' },
            { type: 'check', question: { kind: 'choice', q: 'Proč zatím Severní mořská cesta nenahradila cestu přes Suezský průplav?', options: ['je splavná jen několik měsíců v roce a často potřebuje ledoborce', 'je delší než cesta kolem Afriky', 'vede přes Antarktidu', 'je zakázána Antarktickou smlouvou'], answer: 0, explain: 'Cesta je kratší, ale led ji většinu roku uzavírá. V roce 2025 jí proplulo jen 103 lodí, Suezem dříve asi 26 000 ročně.' } },
          ],
        },
        {
          title: 'Póly a změna klimatu',
          icon: 'thermometer',
          blocks: [
            { type: 'p', text: 'Arktida se od roku 1979 otepluje asi čtyřikrát rychleji než průměr Země. Plocha mořského ledu, který v létě zůstane, se zmenšuje. Data z družic ukazují, o kolik:' },
            { type: 'table', headers: ['nejmenší plocha arktického mořského ledu v září', 'mil. km²'], rows: [
              ['průměr let 1981–2010', '6,22'],
              ['rekordní minimum 2012', '3,39'],
              ['2025', '4,60'],
              ['2026 (12. září)', '4,60'],
            ], caption: 'Arktický mořský led na konci léta podle NSIDC. Rok 2026 se dělí o 10. nejnižší hodnotu s lety 2008, 2010 a 2025.' },
            { type: 'p', text: 'Proč se Arktida otepluje tak rychle? Bílý led odráží většinu slunečního světla, tmavá voda ho naopak pohltí. Když led roztaje, vznikne smyčka, která oteplování zesiluje:' },
            { type: 'process', layout: 'cycle', steps: [
              { icon: 'thermometer', title: 'Oteplení', text: 'vzduch a moře se ohřejí' },
              { icon: 'ice', title: 'Tání ledu', text: 'bílého ledu ubývá' },
              { icon: 'ocean', title: 'Tmavá voda', text: 'pohltí víc slunečního záření' },
              { icon: 'heat', title: 'Další ohřev', text: 'moře se ohřeje ještě víc' },
            ], caption: 'Zesilující smyčka „led – odraz světla“. Podrobněji v úrovni „Systémy Země a přírodní rizika“.' },
            { type: 'p', text: 'Pozor na častý omyl: tání **mořského** ledu v Arktidě hladinu oceánu skoro nezvedne – led už ve vodě plave, jako kostka ledu ve sklenici. Hladinu zvedá tání **pevninského** ledu: grónského a antarktického ledového štítu a horských ledovců. Proto osud Tuvalu závisí hlavně na Grónsku a Antarktidě.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Otestuj se z polárních oblastí a ostatních regionů světa.' },
            { type: 'p', text: 'Tím jsme obešli celý svět mimo Evropu. V příští úrovni se vrátíme domů: přírodu, lidi a státy Evropy prozkoumáme stejnými nástroji, jako jsme to dělali tady.' },
            { type: 'check', question: { kind: 'tf', q: 'Když roztaje mořský led v Arktidě, hladina světového oceánu výrazně stoupne.', answer: false, explain: 'Mořský led už plave ve vodě, takže jeho tání hladinu skoro nezmění. Hladinu zvedá tání ledu na pevnině (Grónsko, Antarktida, ledovce) a teplotní roztažnost vody.' } },
          ],
        },
      ],
      summary: [
        'Arktida je zamrzlý Severní ledový oceán obklopený pevninami, Antarktida je světadíl pokrytý ledovým štítem a obklopený oceánem; Antarktis je celá jižní polární oblast.',
        'Antarktida je chladnější než Arktida, protože je vysoko položená a pokrytá ledem až 4,8 km silným; na stanici Vostok naměřili −89,2 °C.',
        'Obě polární oblasti mají málo srážek; Utqiaġvik na Aljašce má asi 140 mm za rok.',
        'Antarktická smlouva (1959) vyhrazuje Antarktidu míru a vědě a Madridský protokol zakázal těžbu; Česko má stanici J. G. Mendela a od roku 2014 o Antarktidě spolurozhoduje.',
        'Arktida skrývá velké zásoby ropy a plynu a ustupující led otevírá Severní mořskou cestu, zatím ale jen na pár měsíců v roce.',
        'Arktida se otepluje asi čtyřikrát rychleji než průměr Země; plocha letního mořského ledu klesla z průměru 6,22 mil. km² (1981–2010) na 4,60 mil. km² v roce 2026.',
        'Hladinu oceánu zvedá tání pevninského ledu (Grónsko, Antarktida), ne tání plovoucího mořského ledu.',
      ],
      quiz: [
        { kind: 'match', q: 'Přiřaď pojem k jeho popisu.', pairs: [
          ['Arktida', 'oblast kolem severního pólu se zamrzlým oceánem'],
          ['Antarktida', 'zaledněný světadíl kolem jižního pólu'],
          ['Antarktis', 'jižní polární oblast včetně oceánu a ostrovů'],
        ], explain: 'Arktida je oblast kolem severního pólu, Antarktida světadíl a Antarktis celá jižní polární oblast.' },
        { kind: 'tf', q: 'Antarktida nepatří žádnému státu a je vyhrazena míru a vědě.', answer: true, explain: 'Antarktická smlouva z roku 1959 zmrazila územní nároky a dovoluje jen mírové a vědecké využití.' },
        { kind: 'choice', q: 'Kde naměřili nejnižší teplotu na Zemi (−89,2 °C)?', options: ['na stanici Vostok v Antarktidě', 've Verchojansku na Sibiři', 'na severním pólu', 'v Utqiaġviku na Aljašce'], answer: 0, explain: 'Stanice Vostok leží ve vnitrozemí Antarktidy ve výšce 3 488 m. Teplotu −89,2 °C tam změřili 21. července 1983.' },
        { kind: 'text', q: 'Jak se jmenuje česká vědecká stanice v Antarktidě? Napiš příjmení vědce, po kterém je pojmenovaná.', accept: ['Mendel', 'Mendela', 'Mendelova', 'J. G. Mendel', 'Johann Gregor Mendel', 'stanice Johanna Gregora Mendela'], explain: 'Stanice Johanna Gregora Mendela stojí na ostrově Jamese Rosse a provozuje ji Masarykova univerzita v Brně.' },
        { kind: 'multi', q: 'Co zvedá hladinu světového oceánu?', options: ['tání grónského ledového štítu', 'tání antarktického ledového štítu', 'tání horských ledovců', 'tání plovoucího mořského ledu v Arktidě', 'zamrzání moře v zimě'], answers: [0, 1, 2], explain: 'Hladinu zvedá voda, která přiteče z pevniny, a teplotní roztažnost oceánu. Plovoucí mořský led už ve vodě je, takže jeho tání hladinu skoro nezmění.' },
        { kind: 'number', q: 'Průměrná nejmenší plocha arktického mořského ledu v letech 1981–2010 byla 6,22 mil. km², v roce 2026 4,60 mil. km². O kolik mil. km² méně ledu zůstalo v roce 2026?', answer: 1.62, tolerance: 0.01, unit: 'mil. km²', explain: '6,22 − 4,60 = 1,62 mil. km². To je asi dvacetkrát víc, než je rozloha Česka.' },
        { kind: 'choice', q: 'Proč se Arktida otepluje rychleji než zbytek Země?', options: ['tající led odhaluje tmavou vodu, která pohltí víc slunečního záření', 'Arktida je blíž ke Slunci', 'v Arktidě jsou aktivní sopky', 'v Arktidě nikdy nesvítí Slunce'], answer: 0, explain: 'Bílý led odráží světlo, tmavá voda ho pohltí a ohřeje se. Tání tak oteplování zesiluje.' },
      ],
    },
  },
  boss: [
    { kind: 'choice', q: 'Ve kterém regionu leží místo, jehož klimatogram ukazuje: teplota 24–35 °C po celý rok, srážky asi 550 mm, skoro všechny od června do září, osm měsíců sucho?', options: ['Sahel', 'Amazonie', 'Sibiř', 'jihovýchodní pobřeží Austrálie'], answer: 0, explain: 'Horko celý rok a krátké letní období dešťů s dlouhým suchem je typické pro Sahel (např. Niamey). Amazonie má srážky skoro celý rok, Sibiř mrazivou zimu.' },
    { kind: 'match', q: 'Přiřaď region k jeho současnému problému.', pairs: [
      ['Amazonie', 'odlesňování kvůli pastvinám a sóje'],
      ['Tuvalu', 'stoupající hladina moře'],
      ['Aralské jezero', 'vysychání kvůli zavlažování'],
      ['Velký bariérový útes', 'bělení korálů v teplém moři'],
    ], explain: 'Každý region má svůj problém, ale téměř všechny souvisejí s tím, jak lidé zacházejí s vodou, lesem a klimatem.' },
    { kind: 'tf', q: 'Monzun i tornáda v USA souvisejí s tím, jak se střetávají nebo střídají vzduchové hmoty nad pevninou a nad oceánem.', answer: true, explain: 'Monzun vzniká kvůli rozdílnému ohřevu pevniny a oceánu, tornáda ve střetu studeného vzduchu ze severu s teplým vlhkým vzduchem od Mexického zálivu.' },
    { kind: 'multi', q: 'Ve kterých regionech určuje podnebí hlavně nadmořská výška nebo vysoké hory?', options: ['Quito v Andách', 'vnitrozemí Antarktidy (Vostok)', 'Tibetská náhorní plošina', 'delta Gangy a Brahmaputry', 'pobřeží Floridy'], answers: [0, 1, 2], explain: 'Quito (asi 2 800 m), Vostok (3 488 m) i Tibet (v průměru asi 4 500 m) jsou chladné kvůli výšce. Delta a Florida leží těsně nad mořem.' },
    { kind: 'order', q: 'Seřaď státy od nejvíce po nejméně obyvatel (2024).', items: ['Indie', 'Čína', 'USA', 'Nigérie', 'Japonsko'], explain: 'Indie 1 451 mil., Čína 1 419 mil., USA asi 345 mil., Nigérie 233 mil., Japonsko 124 mil. (UN WPP 2024).' },
    { kind: 'choice', q: 'Která dvojice ukazuje kulturní region a světadíl, do kterých patří Mexiko?', options: ['Latinská Amerika – Severní Amerika', 'Angloamerika – Jižní Amerika', 'Latinská Amerika – Jižní Amerika', 'Angloamerika – Severní Amerika'], answer: 0, explain: 'Mexiko leží ve světadílu Severní Amerika, ale jazykem a dějinami patří do Latinské Ameriky.' },
    { kind: 'number', q: 'Ve Verchojansku je průměrná teplota v lednu −44,7 °C, v Alice Springs v lednu 29,7 °C. O kolik stupňů je v lednu tepleji v Alice Springs?', answer: 74.4, tolerance: 0.2, unit: '°C', explain: '29,7 − (−44,7) = 29,7 + 44,7 = 74,4 °C. V lednu je na Sibiři vrchol zimy a v Austrálii vrchol léta.' },
    { kind: 'tf', q: 'Rovné hranice států najdeme jen v Africe.', answer: false, explain: 'Rovné hranice po rovnoběžkách a polednících má i Severní Amerika (hranice USA a Kanady po 49° s. š.) nebo Blízký východ. V Africe jsou ale nejčastější, protože ji rozdělily koloniální mocnosti.' },
    { kind: 'choice', q: 'Co mají společného Hormuzský průliv a Panamský průplav?', options: ['jsou to úzká místa, kterými prochází velká část světového obchodu', 'oba leží v Latinské Americe', 'oba vznikly sopečnou činností', 'oba jsou v zimě zamrzlé'], answer: 0, explain: 'Strategická úžina nebo průplav zkracuje či umožňuje cestu lodí. Když se uzavře, jako Hormuz v roce 2026, zasáhne to celý svět.' },
    { kind: 'multi', q: 'Které tvrzení o obyvatelstvu regionů světa je pravdivé?', options: ['v Nigeru je skoro polovina obyvatel mladších 15 let', 'Japonsko patří k nejrychleji stárnoucím státům', 'v Latinské Americe žije většina lidí ve městech', 'většina Kanaďanů žije na arktickém severu', 'v asijské části Ruska žije většina Rusů'], answers: [0, 1, 2], explain: 'Kanaďané žijí hlavně na jihu u hranice s USA a většina Rusů v evropské části. Ostatní tvrzení platí.' },
    { kind: 'text', q: 'Jak se jmenuje největší město světa podle OSN (2025)?', accept: ['Jakarta', 'Džakarta'], explain: 'Podle UN World Urbanization Prospects 2025 má aglomerace Jakarty 41,9 mil. obyvatel, před Dhákou a Tokiem. Hlavním městem Indonésie zůstává.' },
    { kind: 'choice', q: 'Proč hladinu oceánu u Tuvalu ohrožuje víc tání Grónska než tání ledu na Severním ledovém oceánu?', options: ['grónský led leží na pevnině, takže jeho voda do oceánu přibude; mořský led už plave ve vodě', 'Grónsko leží blíž k Tuvalu', 'mořský led je slaný, a proto netaje', 'grónský led je tenčí, takže taje rychleji'], answer: 0, explain: 'Plovoucí led už vodu vytlačuje, jeho tání hladinu skoro nemění. Led z pevniny do oceánu přiteče navíc.' },
  ],
}

export default level
