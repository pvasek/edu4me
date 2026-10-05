import type { LevelContent } from '../../../core/types'

/*
 * Geografie, level 8 – Evropa (ZŠ 8. třída).
 * Europe is described with the tools of levels 1–6; level 7 is the model. Data and sources (checked October 2026):
 * - climate charts (normál 1991–2020, the curated station set of the climate-chart game, src/games/climate-chart/data.ts):
 *   Londýn-Heathrow, Moskva (VDNCh), Řím-Ciampino; Praha-Ruzyně: ČHMÚ, normál 1991–2020.
 * - pyramids Itálie and Francie 2023: UN World Population Prospects 2024 (as in src/games/pop-pyramid/data.ts).
 * - population: Eurostat 1. 1. 2025 (EU 451 mil., Česko 10,9 mil., Německo 83,6, Francie 68,6, Itálie 58,9,
 *   Španělsko 49,1, Polsko 36,5); Evropa ≈ 745 mil. (UN WPP 2024); median age EU 44,9 let and 65+ 22,0 % (Eurostat 2025);
 *   fertility EU 1,34 in 2024, Bulharsko 1,72, Francie 1,61, Malta 1,01 (Eurostat, March 2026).
 * - temporary protection of people from Ukraine: 4,43 mil. in the EU, Česko 395 225 = 36,2 per 1 000 (Eurostat, 31. 7. 2026);
 *   Německo 1,27 mil., Polsko 0,96 mil. (Eurostat, 31. 3. 2026).
 * - euro area 21 states since Bulgaria joined on 1. 1. 2026; Schengen 29 states (Romania and Bulgaria fully from 1. 1. 2025,
 *   Cyprus and Ireland outside); NATO 32 (Finsko 2023, Švédsko 2024); Council of Europe 46 (coe.int).
 * - EU candidates 2026: Albánie, Bosna a Hercegovina, Černá Hora, Gruzie, Moldavsko, Severní Makedonie, Srbsko, Turecko,
 *   Ukrajina; Kosovo potential candidate (Commission enlargement package 2025/2026). Iceland: referendum 29. 8. 2026
 *   rejected resuming EU talks, 52,8 % : 47,2 % (AP, ITV).
 * - Germany's internal border checks (incl. Czech border since 16. 10. 2023) extended to 15. 3. 2027 (The Local, 8/2026).
 * - Ukraine war: ≈ 19 % of Ukraine occupied incl. Crimea (DeepState / Russia Matters, June 2026); ceasefire talks relaunched
 *   in September 2026 without result (Al Jazeera, 25. 9. 2026). EU regulation of 26. 1. 2026 ends Russian gas imports by
 *   the end of 2027; Russia ≈ 12 % of EU gas imports in 2025 (Council of the EU).
 * - GDP per capita in PPS, EU = 100 (Eurostat 2024): Česko 91, Polsko 79, Maďarsko 77, Slovensko 75.
 * - tourism: Francie 102 mil. foreign tourists 2025, Španělsko 96,8 mil. 2025 (INE Frontur).
 * - migration: Frontex (2015 ≈ 1,8 mil. detected crossings; 2025 almost 178 000, −26 %, central Mediterranean the busiest
 *   route with over a third); IOM Missing Migrants (32 238 dead or missing in the Mediterranean 2014 – June 2025);
 *   Pact on Migration and Asylum applies from 12. 6. 2026. Cyprus: Schengen accession not decided by Sept 2026.
 * - Slovakia: 1,07 mil. cars in 2025 = 196 per 1 000 inhabitants (ZAP SR); Denmark: wind 60 % of electricity produced
 *   in 2025 (Energinet); Poland: coal ≈ half of electricity in 2025
 *   (sources give 51–53 %).
 */

const level: LevelContent = {
  lessons: {
    // ───────────────────────────────────────────────────────────── z8-1
    'z8-1': {
      id: 'z8-1',
      title: 'Příroda Evropy',
      goals: [
        'Popsat polohu a hranice Evropy a ukázat na mapě její hlavní poloostrovy, ostrovy a moře',
        'Rozlišit mladá a stará pohoří Evropy a popsat, co v krajině zanechaly ledovce',
        'Vysvětlit, proč má západ Evropy mírnější zimy než východ, a porovnat oceánské a pevninské podnebí v klimatogramu',
        'Vyjmenovat hlavní evropské řeky a říct, do kterého moře ústí',
      ],
      hook: 'Z Prahy dojedeš za jeden den k moři hned ve třech směrech: k Severnímu, k Baltskému i k Jadranu. Evropa je malý světadíl, a přesto v ní najdeš ledovce, sopky, fjordy i olivové háje. Jak se to všechno vešlo na tak malé území?',
      sections: [
        {
          title: 'Poloha a pobřeží Evropy',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'V lekci „Jak dělíme svět na regiony“ jsme zjistili, že Evropa je **světadíl**, ale ne kontinent: s Asií tvoří jednu pevninu, Eurasii. Teď se na Evropu podíváme zblízka. Kde leží a čím je mezi světadíly zvláštní?' },
            { type: 'p', text: 'Evropa má rozlohu asi 10,5 mil. km² a po Austrálii a Oceánii je druhým nejmenším světadílem. Leží celá na severní polokouli a většinou v mírném podnebném pásu; nultý poledník prochází Londýnem. Na východě ji od Asie odděluje Ural, řeka Ural, Kaspické moře a Kavkaz nebo Kumo-manyčská sníženina.' },
            { type: 'p', text: 'Nejvíc Evropu odlišuje její pobřeží. Moře se zařezává hluboko do pevniny a tvoří poloostrovy, zálivy a ostrovy. Na mapě najdi pět velkých poloostrovů a moře, která je obklopují:' },
            { type: 'map', view: 'europe', points: [
              { lat: 64.5, lon: 15.5, label: 'Skandinávský poloostrov', kind: 'place' },
              { lat: 56.0, lon: 9.2, label: 'Jutský poloostrov', kind: 'place' },
              { lat: 40.0, lon: -4.0, label: 'Pyrenejský poloostrov', kind: 'place' },
              { lat: 43.8, lon: 11.3, label: 'Apeninský poloostrov', kind: 'place' },
              { lat: 41.2, lon: 23.8, label: 'Balkánský poloostrov', kind: 'place' },
              { lat: 56.0, lon: 3.0, label: 'Severní moře', kind: 'place' },
              { lat: 57.5, lon: 19.5, label: 'Baltské moře', kind: 'place' },
              { lat: 37.0, lon: 18.0, label: 'Středozemní moře', kind: 'place' },
              { lat: 43.3, lon: 34.0, label: 'Černé moře', kind: 'place' },
            ], routes: [
              { points: [{ lat: 68.5, lon: 66.0 }, { lat: 64.0, lon: 59.5 }, { lat: 58.0, lon: 59.0 }, { lat: 54.0, lon: 58.6 }, { lat: 51.8, lon: 55.1 }, { lat: 51.2, lon: 51.4 }, { lat: 47.1, lon: 51.9 }],
                label: 'hranice Evropy a Asie (Ural, řeka Ural)', tone: 'a', style: 'dashed' },
            ], caption: 'Evropa: největší poloostrovy a okrajová moře. Na východě vede hranice s Asií po Uralu (vpravo nahoře) a dál po řece Uralu ke Kaspickému moři, které leží skoro celé už za pravým okrajem mapy.' },
            { type: 'p', text: 'Evropa má **nejčlenitější pobřeží** ze všech světadílů; jejími největšími ostrovy jsou Velká Británie a Island. Proto je moře skoro všude blízko: obchodovalo se po něm už ve starověku a dodnes je to znát na podnebí. Než se k podnebí dostaneme, podívejme se, jaký povrch se mezi těmi moři rozkládá.' },
            { type: 'check', question: { kind: 'choice', q: 'Na kterém poloostrově leží Španělsko a Portugalsko?', options: ['na Pyrenejském', 'na Apeninském', 'na Balkánském', 'na Skandinávském'], answer: 0, explain: 'Pyrenejský poloostrov dostal jméno podle pohoří Pyreneje, které ho odděluje od Francie. Na Apeninském leží Itálie, na Balkánském třeba Řecko.' } },
          ],
        },
        {
          title: 'Nížiny na severu, hory na jihu',
          icon: 'mountain',
          blocks: [
            { type: 'p', text: 'Z lekce „Jak vznikají pohoří“ víme, že pohoří vznikají vrásněním a zlomy a že jsou mladá a stará. Evropa má obojí – a tak se dá povrch Evropy přečíst jako kniha jejích dějin. Kde jsou hory a kde roviny?' },
            { type: 'p', text: 'Nejlíp to ukáže řez napříč Evropou od Atlantiku k Uralu. Sleduj, kde je povrch vysoký a kde nízký:' },
            { type: 'diagram', id: 'europe-relief', caption: 'Výškový řez Evropou: na západě a jihu vysoká mladá pohoří, na severu a východě rozlehlé nížiny až k Uralu.' },
            { type: 'p', text: 'Evropa je převážně nížinatá: její průměrná nadmořská výška je jen asi 300 m, zatímco Asie má průměrně asi 950 m. Od Francie přes Německo a Polsko se táhne **Severoevropská nížina**, na ni navazuje obrovská **Východoevropská rovina** až k Uralu. Vysoké hory leží hlavně na jihu. Mladá a stará pohoří se přitom poznají na první pohled:' },
            { type: 'compare', columns: [
              { title: 'Mladá pohoří', icon: 'mountain', tone: 'a', points: ['vyvrásněná v třetihorách (alpinské vrásnění)', 'vysoká, ostré štíty a hřebeny', 'dodnes se zvedají, bývají tu zemětřesení', 'Alpy, Pyreneje, Karpaty, Apeniny, Dinárské hory, Kavkaz'] },
              { title: 'Stará pohoří', icon: 'hourglass', tone: 'b', points: ['vznikla už v prvohorách', 'za stovky milionů let obroušená a nižší', 'oblé hřbety a náhorní plošiny', 'Skandinávské hory, Ural, Český masiv'] },
            ] },
            { type: 'p', text: 'Pozor na otázku, která je nejvyšší hora Evropy. Záleží na tom, kudy vede hranice s Asií. Pokud po hlavním hřebeni Kavkazu, leží v Evropě **Elbrus** (5 642 m). Pokud po Kumo-manyčské sníženině severně od Kavkazu, je nejvyšší **Mont Blanc** v Alpách (4 806 m). Na mapě najdeš obě hory a také evropské sopky:' },
            { type: 'map', view: 'europe', points: [
              { lat: 45.83, lon: 6.86, label: 'Mont Blanc 4 806 m', kind: 'peak' },
              { lat: 43.35, lon: 42.44, label: 'Elbrus 5 642 m', kind: 'peak' },
              { lat: 65.03, lon: 60.12, label: 'Narodnaja 1 895 m (Ural)', kind: 'peak' },
              { lat: 37.75, lon: 14.99, label: 'Etna', kind: 'volcano' },
              { lat: 40.82, lon: 14.43, label: 'Vesuv', kind: 'volcano' },
              { lat: 63.99, lon: -19.67, label: 'Hekla', kind: 'volcano' },
            ], caption: 'Nejvyšší hory a činné sopky Evropy. Etna a Vesuv leží tam, kde se Africká deska tlačí do Euroasijské; Island leží přímo na Středoatlantském hřbetu.' },
            { type: 'p', text: 'Sopky a zemětřesení se v Evropě drží na jihu a na Islandu – přesně tam, kde se podle lekce „Zemětřesení a sopky“ stýkají litosférické desky. Sever Evropy je klidný, ale jeho krajinu přesto někdo hodně přetvořil: ledovec.' },
            { type: 'check', question: { kind: 'multi', q: 'Která pohoří Evropy jsou mladá (vznikla alpinským vrásněním)?', options: ['Alpy', 'Karpaty', 'Pyreneje', 'Ural', 'Skandinávské hory'], answers: [0, 1, 2], explain: 'Alpy, Karpaty a Pyreneje se vyvrásnily v třetihorách a jsou vysoké a ostré. Ural a Skandinávské hory jsou stará pohoří z prvohor, už hodně obroušená.' } },
          ],
        },
        {
          title: 'Co v krajině zanechal led',
          icon: 'glacier',
          blocks: [
            { type: 'p', text: 'Sever Evropy vypadá úplně jinak než jih: všude jezera, skály obroušené do hladka a dlouhé mořské zálivy. Tyto tvary nevytvořily vnitřní síly, ale vnější síla – led.' },
            { type: 'p', text: 'V poslední době ledové, ještě před 20 000 lety, ležel na severu Evropy pevninský ledovec silný až tři kilometry. Při nejmohutnějších zaledněních sahal až na sever Česka, na Ostravsko a Frýdlantsko. Jak led přetváří údolí, víš z lekce „Práce řek, ledovců a větru“; připomeň si to na obrázku:' },
            { type: 'diagram', id: 'glacial-valley', caption: 'Ledovec udělal z údolí tvaru V údolí tvaru U. Když ho po roztátí ledu zalije moře, vznikne fjord.' },
            { type: 'p', text: 'Led vytvořil v Evropě čtyři typické krajiny. Najdeš je v různých státech:' },
            { type: 'iconlist', items: [
              { icon: 'ocean', title: 'Fjordy (Norsko)', text: 'mořem zalitá ledovcová údolí; nejdelší, Sognefjord, měří přes 200 km' },
              { icon: 'pond', title: 'Jezera (Finsko)', text: 'led vyhloubil tisíce pánví; Finsko má asi 188 000 jezer' },
              { icon: 'soil', title: 'Morény a písky (Severoevropská nížina)', text: 'písek, štěrk a bludné balvany, které ledovec přinesl ze Skandinávie' },
              { icon: 'glacier', title: 'Alpská jezera (Švýcarsko, Itálie)', text: 'Ženevské, Bodamské nebo Gardské jezero vyhloubily horské ledovce' },
            ] },
            { type: 'callout', variant: 'fact', text: 'Skandinávie se po roztátí ledu pořád zvedá – u Botnického zálivu skoro o 1 cm za rok. Země se „narovnává“ po tíze ledu, která ji tisíce let tlačila dolů.' },
            { type: 'p', text: 'Mnoho norských fjordů leží až za polárním kruhem, a přesto v zimě nezamrzají. Proč je sever Evropy tak teplý? Odpověď přináší oceán.' },
            { type: 'check', question: { kind: 'tf', q: 'Fjordy vznikly tak, že moře zaplavilo údolí vyhloubená ledovcem.', answer: true, explain: 'Ledovec vyhloubil hluboké údolí tvaru U. Když led roztál a hladina moře stoupla, moře údolí zalilo – vznikl fjord.' } },
          ],
        },
        {
          title: 'Proč je západ mírnější než východ',
          icon: 'ocean',
          blocks: [
            { type: 'p', text: 'Bergen v Norsku leží na 60° s. š., stejně daleko na sever jako jih Grónska. Přesto tam v lednu průměrná teplota neklesá pod nulu. V lekci „Voda na Zemi“ jsme poznali Golfský proud – teď uvidíme, co přesně dělá s Evropou.' },
            { type: 'p', text: 'Na obrázku sleduj, kudy teplá voda teče a jak se liší dvě místa na obou stranách Atlantiku – norský Bergen a Nain na Labradoru, který leží dokonce jižněji:' },
            { type: 'diagram', id: 'gulf-stream', caption: 'Golfský proud a jeho pokračování, Severoatlantský proud, nesou teplou vodu z Karibiku až k Norsku. Bergen má v lednu průměrnou teplotu nad nulou, Nain na pobřeží Labradoru, ležící ještě jižněji, silné mrazy.' },
            { type: 'p', text: 'Teplo z oceánu ale musí někdo dopravit nad pevninu. Dělají to **západní větry**, které znáš z lekce „Oběh vzduchu a podnebné pásy“. Hlavní pohoří střední a jižní Evropy (Alpy, Karpaty) se táhnou od západu na východ, a tak vlhký atlantský vzduch proniká hluboko do pevniny. Čím dál od oceánu, tím je ho méně: podnebí se mění z **oceánského** přes **přechodné** (Česko) na **pevninské**.' },
            { type: 'p', text: 'Rozdíl je nejlíp vidět v klimatogramech. Porovnej Londýn u Atlantiku s Moskvou uprostřed Východoevropské roviny. Sleduj hlavně, jak moc se liší léto a zima:' },
            { type: 'climate', places: [
              { name: 'Londýn-Heathrow', altitude: 25, temp: [5.6, 5.8, 7.9, 10.5, 13.7, 16.8, 19.0, 18.7, 15.9, 12.3, 8.4, 5.9], precip: [58.8, 45.0, 38.8, 42.3, 45.9, 47.3, 45.8, 52.8, 49.6, 65.1, 66.6, 57.1], source: 'normál 1991–2020' },
              { name: 'Moskva', altitude: 147, temp: [-6.2, -5.9, -0.7, 6.9, 13.6, 17.3, 19.7, 17.6, 11.9, 5.8, -0.5, -4.4], precip: [53, 44, 39, 37, 61, 78, 84, 78, 66, 70, 52, 51], source: 'normál 1991–2020' },
            ], caption: 'Léto je v Londýně i v Moskvě skoro stejně teplé. Rozdíl dělá zima: v Londýně nemrzne, v Moskvě je v lednu −6,2 °C.' },
            { type: 'p', text: 'V Londýně je nejtepleji v červenci (19,0 °C) a nejchladněji v lednu (5,6 °C), roční amplituda je jen 13,4 °C. Pozor na past: srážek má Moskva dokonce víc (713 mm proti 615 mm). Oba typy podnebí se neliší ani tak množstvím srážek, jako zimou a tím, **kdy** prší: v Londýně nejvíc na podzim a v zimě, v Moskvě v létě.' },
            { type: 'p', text: 'Na jihu a na dalekém severu má Evropa ještě další typy podnebí. Přehled všech pěti ukazuje tabulka:' },
            { type: 'table', headers: ['podnebí', 'kde v Evropě', 'léto a zima', 'srážky'], rows: [
              ['oceánské', 'Irsko, Velká Británie, Francie, pobřeží Norska', 'chladnější léto, mírná zima', 'po celý rok, nejvíc na podzim a v zimě'],
              ['přechodné', 'Německo, Česko, Polsko', 'teplé léto, chladná zima', 'nejvíc v létě'],
              ['pevninské', 'Rusko, Ukrajina, Bělorusko', 'teplé léto, mrazivá zima', 'nejvíc v létě'],
              ['středomořské', 'Španělsko, Itálie, Řecko', 'horké suché léto, mírná vlhká zima', 'nejvíc na podzim a v zimě'],
              ['subpolární', 'sever Skandinávie a Ruska, Island', 'krátké chladné léto, dlouhá zima', 'málo, často sníh'],
            ], caption: 'Hlavní typy podnebí Evropy (zjednodušeně). Středomořské podnebí podrobně v lekci „Jižní a jihovýchodní Evropa“.' },
            { type: 'p', text: 'Podnebí rozhoduje i o tom, kolik vody nesou řeky a kdy mají nejvíc vody. Řeky jsou posledním dílem přírody Evropy.' },
            { type: 'check', question: { kind: 'number', q: 'V Moskvě je průměrná teplota v lednu −6,2 °C a v červenci 19,7 °C. Jaká je roční amplituda teploty?', answer: 25.9, tolerance: 0.1, unit: '°C', explain: 'Roční amplituda je rozdíl nejteplejšího a nejchladnějšího měsíce: 19,7 °C − (−6,2 °C) = 25,9 °C. To je skoro dvakrát víc než v Londýně (13,4 °C).' } },
          ],
        },
        {
          title: 'Řeky a moře Evropy',
          icon: 'river',
          blocks: [
            { type: 'p', text: 'Evropské řeky nejsou ve srovnání s Amazonkou nebo Nilem dlouhé, ale jsou vodnaté a většinou splavné – plují po nich lodě se zbožím i s turisty. Kam ale tečou? Odpověď dává **úmoří**, pojem z lekce „Řeky, jezera a ledovce“.' },
            { type: 'p', text: 'Na mapě s vrstvou řek najdi Volhu, Dunaj a Rýn. Sleduj, kde pramení a do kterého moře ústí:' },
            { type: 'map', view: 'europe', layers: ['rivers', 'lakes'], points: [
              { lat: 47.95, lon: 8.5, label: 'pramen Dunaje (Schwarzwald)', kind: 'place' },
              { lat: 45.16, lon: 29.65, label: 'ústí Dunaje', kind: 'place' },
              { lat: 51.95, lon: 4.1, label: 'ústí Rýna (Rotterdam)', kind: 'place' },
              { lat: 48.7, lon: 44.5, label: 'Volha', kind: 'place' },
            ], caption: 'Hlavní řeky a jezera Evropy. Dunaj spojuje čtyři hlavní města: Vídeň, Bratislavu, Budapešť a Bělehrad. Volha teče dál na jihovýchod do Kaspického moře, za okraj mapy.' },
            { type: 'p', text: 'Délky a úmoří největších řek porovnej v tabulce. Všimni si, že Volha jako jediná neteče do oceánu:' },
            { type: 'table', headers: ['řeka', 'délka', 'ústí', 'důležitá města'], rows: [
              ['Volha', '3 530 km', 'Kaspické moře (bezodtoká oblast)', 'Nižnij Novgorod, Volgograd'],
              ['Dunaj', '2 850 km', 'Černé moře', 'Vídeň, Bratislava, Budapešť, Bělehrad'],
              ['Dněpr', '≈ 2 200 km', 'Černé moře', 'Kyjev'],
              ['Rýn', '1 233 km', 'Severní moře (Atlantský oceán)', 'Basilej, Kolín nad Rýnem, Rotterdam'],
              ['Visla', '1 047 km', 'Baltské moře (Atlantský oceán)', 'Krakov, Varšava, Gdaňsk'],
            ], caption: 'Největší řeky Evropy. Délky se v různých zdrojích liší o desítky kilometrů podle toho, kde se měří pramen.' },
            { type: 'p', text: 'Dunaj drží světový rekord: protéká deseti státy, víc než kterákoli jiná řeka na Zemi (Německo, Rakousko, Slovensko, Maďarsko, Chorvatsko, Srbsko, Rumunsko, Bulharsko, Moldavsko, Ukrajina). Rýn je zase nejvytíženější vodní cestou Evropy: spojuje Švýcarsko a průmyslové Porúří s přístavem Rotterdam.' },
            { type: 'callout', variant: 'fact', text: 'Od roku 1992 spojuje Rýn a Dunaj průplav Mohan–Dunaj. Loď tak může doplout ze Severního moře až do Černého moře napříč celou Evropou.' },
            { type: 'game', gameId: 'blind-map', text: 'Slepá mapa: najdi evropská pohoří, řeky, moře a poloostrovy.' },
            { type: 'p', text: 'Teď známe přírodu Evropy: členité pobřeží, mladé hory na jihu, nížiny na severu, mírné podnebí díky oceánu a splavné řeky. Na této scéně žije přes 700 milionů lidí – o nich je lekce „Obyvatelstvo a státy Evropy“.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď řeku k moři, do kterého ústí.', pairs: [
              ['Volha', 'Kaspické moře'],
              ['Dunaj', 'Černé moře'],
              ['Rýn', 'Severní moře'],
              ['Visla', 'Baltské moře'],
            ], explain: 'Volha ústí do Kaspického moře, které nemá spojení s oceánem (bezodtoká oblast). Dunaj teče do Černého moře, Rýn do Severního a Visla do Baltského moře.' } },
          ],
        },
      ],
      summary: [
        'Evropa je druhý nejmenší světadíl (asi 10,5 mil. km²) a má nejčlenitější pobřeží: pět velkých poloostrovů a mnoho ostrovů.',
        'Na severu a východě převládají nížiny, na jihu stojí mladá pohoří vyvrásněná v třetihorách (Alpy, Karpaty, Pyreneje); Ural a Skandinávské hory jsou stará pohoří.',
        'Nejvyšší horou Evropy je Elbrus (5 642 m), nebo Mont Blanc (4 806 m) – podle toho, kudy vedeme hranici s Asií.',
        'Pevninský ledovec zanechal na severu fjordy, tisíce jezer a morény na Severoevropské nížině.',
        'Golfský a Severoatlantský proud spolu se západními větry dávají západní Evropě mírné zimy; k východu podnebí přechází z oceánského na pevninské.',
        'Nejdelší řekou Evropy je Volha (do Kaspického moře); Dunaj protéká deseti státy, víc než kterákoli řeka světa.',
      ],
      quiz: [
        { kind: 'tf', q: 'Evropa je nejmenší světadíl na světě.', answer: false, explain: 'Nejmenší je Austrálie a Oceánie. Evropa (asi 10,5 mil. km²) je druhá nejmenší.' },
        { kind: 'choice', q: 'Která nížina se táhne od Francie přes Německo až do Polska?', options: ['Severoevropská nížina', 'Východoevropská rovina', 'Pádská nížina', 'Velká uherská nížina'], answer: 0, explain: 'Severoevropská nížina lemuje Severní a Baltské moře. Na východě na ni navazuje Východoevropská rovina až k Uralu.' },
        { kind: 'choice', q: 'Proč může být nejvyšší horou Evropy Elbrus, ale také Mont Blanc?', options: ['záleží na tom, zda hranice Evropy a Asie vede po hřebeni Kavkazu, nebo severně od něj', 'Elbrus každý rok roste a Mont Blanc klesá', 'Mont Blanc se měří od hladiny jiného moře', 'Elbrus leží na ostrově'], answer: 0, explain: 'Elbrus (5 642 m) leží na severní straně Kavkazu. Vede-li hranice po hlavním hřebeni, je v Evropě; vede-li po Kumo-manyčské sníženině, je v Asii a nejvyšší je Mont Blanc (4 806 m).' },
        { kind: 'tf', q: 'Ural, po kterém vede hranice Evropy a Asie, patří ke starým pohořím.', answer: true, explain: 'Ural vznikl už v prvohorách a je dnes obroušený; jeho nejvyšší hora Narodnaja měří jen 1 895 m.' },
        { kind: 'multi', q: 'Co je typické pro oceánské podnebí v Londýně v porovnání s pevninským v Moskvě?', options: ['mírná zima bez mrazu', 'malá roční amplituda teploty', 'nejvíc srážek na podzim a v zimě', 'mnohem teplejší léto', 'mrazivé zimy'], answers: [0, 1, 2], explain: 'Oceán v zimě hřeje: Londýn má v lednu 5,6 °C a amplitudu jen 13,4 °C. Léto je v obou městech podobné (asi 19 °C).' },
        { kind: 'order', q: 'Seřaď řeky od nejdelší po nejkratší.', items: ['Volha', 'Dunaj', 'Rýn', 'Visla'], explain: 'Volha 3 530 km, Dunaj 2 850 km, Rýn 1 233 km, Visla 1 047 km.' },
        { kind: 'text', q: 'Jak se jmenuje teplý mořský proud, jehož pokračování ohřívá západní Evropu? (dvě slova)', accept: ['Golfský proud', 'Golfsky proud', 'Golfský'], explain: 'Golfský proud nese teplou vodu z Mexického zálivu a Karibiku; jeho pokračování, Severoatlantský proud, dotéká až k Norsku.' },
        { kind: 'choice', q: 'Která řeka protéká nejvíce státy na světě?', options: ['Dunaj', 'Rýn', 'Volha', 'Nil'], answer: 0, explain: 'Dunaj protéká deseti státy od Německa po Ukrajinu a čtyřmi hlavními městy.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── z8-2
    'z8-2': {
      id: 'z8-2',
      title: 'Obyvatelstvo a státy Evropy',
      goals: [
        'Spočítat hustotu zalidnění Evropy a ukázat, kde v Evropě žije nejvíc a nejméně lidí',
        'Vysvětlit, proč Evropa stárne, a přečíst to z věkových pyramid',
        'Popsat hlavní migrační proudy do Evropy i uvnitř ní',
        'Zařadit evropské jazyky do skupin, popsat rozšíření náboženství a ukázat státy a hlavní města na mapě',
      ],
      hook: 'Pár hodin jízdy z Prahy a uslyšíš němčinu, polštinu nebo maďarštinu. Evropa je jen o kousek větší než USA, a přece v ní leží kolem 45 států a mluví se tu desítkami jazyků. Kdo jsou Evropané a kde žijí?',
      sections: [
        {
          title: 'Kolik nás je a kde žijeme',
          icon: 'people',
          blocks: [
            { type: 'p', text: 'Přírodu Evropy už známe. Teď na tu scénu postavíme lidi. V lekci „Kolik nás je a kde žijeme“ jsme se naučili počítat hustotu zalidnění – použijme ji na celou Evropu.' },
            { type: 'p', text: 'V Evropě žije asi 745 milionů lidí (OSN, 2024), tedy asi 9 % lidstva; jen v Evropské unii je to 451 milionů (Eurostat, 1. 1. 2025). Jak hustě je Evropa zalidněná? Spočítejme to:' },
            { type: 'example', title: 'Hustota zalidnění Evropy', problem: 'Evropa má asi 745 milionů obyvatel a rozlohu asi 10,5 milionu km². Kolik lidí připadá na 1 km²?', steps: [
              'Hustota zalidnění = počet obyvatel : rozloha',
              '745 000 000 : 10 500 000 km²',
              'Nuly zkrátíme: 745 : 10,5 ≐ 71',
            ], answer: 'V Evropě žije průměrně asi 71 obyv./km², tedy asi o polovinu méně než v Česku (138 obyv./km²).' },
            { type: 'p', text: 'Průměr ale skrývá velké rozdíly. Na mapě porovnej nejhustěji a nejřidčeji zalidněné státy:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['NLD', 'BEL', 'GBR', 'DEU', 'CHE', 'LUX', 'MLT'], tone: 'a', label: 'přes 200 obyv./km²' },
              { codes: ['NOR', 'SWE', 'FIN', 'ISL', 'LVA', 'RUS'], tone: 'c', label: 'pod 30 obyv./km²' },
            ], points: [
              { lat: 55.75, lon: 37.62, label: 'Moskva', kind: 'capital' },
              { lat: 51.5, lon: -0.13, label: 'Londýn', kind: 'capital' },
              { lat: 48.85, lon: 2.35, label: 'Paříž', kind: 'capital' },
              { lat: 41.01, lon: 28.98, label: 'Istanbul', kind: 'city' },
              { lat: 40.42, lon: -3.7, label: 'Madrid', kind: 'capital' },
              { lat: 52.52, lon: 13.4, label: 'Berlín', kind: 'capital' },
            ], caption: 'Hustota zalidnění vybraných států (zaokrouhleno, 2025): Nizozemsko přes 500, Island asi 4 obyv./km². Největší města Evropy jsou Moskva, Istanbul (leží na obou březích Bosporu), Londýn a Paříž.' },
            { type: 'p', text: 'Nejvíc lidí žije v pásu od Anglie přes Belgii a Nizozemsko a podél Rýna až do severní Itálie; geografové mu podle tvaru říkají **modrý banán**. Je tu staré průmyslové jádro Evropy a nejvíc měst. Nejřidčeji je osídlený chladný sever. Kolik Evropanů bude za pár desítek let, ale rozhodne hlavně to, kolik se jich narodí.' },
            { type: 'check', question: { kind: 'choice', q: 'Kde v Evropě žije nejvíc lidí na 1 km²?', options: ['v pásu od Anglie přes Nizozemsko a Porýní do severní Itálie', 'na severu Skandinávie', 'na Islandu', 'na Východoevropské rovině u Uralu'], answer: 0, explain: 'Tento pás, „modrý banán“, je staré průmyslové a obchodní jádro Evropy. Sever Skandinávie a Island patří k nejřidčeji osídleným místům.' } },
          ],
        },
        {
          title: 'Stárnoucí světadíl',
          icon: 'hourglass',
          blocks: [
            { type: 'p', text: 'V lekci „Porodnost, úmrtnost a věková pyramida“ jsme viděli, že bohaté státy stárnou. Evropa je toho nejlepším příkladem: je to nejstarší světadíl.' },
            { type: 'p', text: 'Polovina obyvatel EU je starší než 44,9 roku a lidé nad 65 let tvoří 22 % obyvatel (Eurostat, 2025). Žena v EU má v průměru jen 1,34 dítěte (2024). Aby se počet obyvatel bez přistěhovalců udržel, musela by každá žena mít v průměru asi 2,1 dítěte. Jak to vypadá v pyramidě, ukazuje srovnání Itálie a Francie. Hledej, kde je každá pyramida nejširší:' },
            { type: 'pyramid', step: 5, pyramids: [
              { label: 'Itálie 2023', male: [1.77, 2.06, 2.35, 2.51, 2.62, 2.73, 2.86, 2.86, 3.16, 3.69, 3.96, 4, 3.55, 2.96, 2.61, 2.2, 1.59, 1.39], female: [1.67, 1.95, 2.21, 2.37, 2.44, 2.49, 2.74, 2.81, 3.12, 3.7, 4.05, 4.15, 3.77, 3.24, 2.96, 2.66, 2.18, 2.62], source: 'OSN, World Population Prospects 2024' },
              { label: 'Francie 2023', male: [2.59, 2.83, 3.09, 3.17, 3.1, 2.9, 2.86, 2.94, 3.04, 3.07, 3.25, 3.12, 3, 2.74, 2.51, 1.96, 1.14, 1.15], female: [2.48, 2.7, 2.94, 3.01, 2.94, 2.85, 2.89, 3.07, 3.16, 3.09, 3.37, 3.31, 3.26, 3.11, 2.97, 2.44, 1.58, 2.34], source: 'OSN, World Population Prospects 2024' },
            ], caption: 'Itálie patří k nejstarším státům světa, Francie má po Bulharsku nejvyšší plodnost v EU (1,61 dítěte na ženu, 2024).' },
            { type: 'p', text: 'Italská pyramida je dole úzká: děti do 5 let tvoří jen asi 3,4 % obyvatel, lidé ve věku 50–59 let přes 16 %. Je to **regresivní** pyramida (urna). Francouzská je dole širší a skoro rovná, děti do 5 let tvoří asi 5 %. Pozor, ani Francie ale nemá dost dětí na to, aby se počet obyvatel bez přistěhovalců dlouhodobě udržel.' },
            { type: 'p', text: 'Co z toho plyne? Ubývá lidí v produktivním věku, kteří platí daně a důchody, a přibývá seniorů, kteří potřebují péči. V EU navíc každý rok zemře víc lidí, než se narodí – počet obyvatel roste jen díky přistěhovalcům. Odkud přicházejí?' },
            { type: 'check', question: { kind: 'tf', q: 'Počet obyvatel EU roste hlavně díky tomu, že se rodí víc dětí, než lidí umírá.', answer: false, explain: 'Je to naopak: v EU umírá víc lidí, než se rodí. Počet obyvatel roste jen díky přistěhovalcům.' } },
          ],
        },
        {
          title: 'Migrace do Evropy i uvnitř ní',
          icon: 'footprints',
          blocks: [
            { type: 'p', text: 'Ještě před sto lety Evropané hromadně odcházeli – do Ameriky, Austrálie a Afriky. Dnes je Evropa naopak cílem migrace. Push a pull faktory, které znáš z lekce „Migrace“, tu působí oběma směry.' },
            { type: 'p', text: 'Migraci v Evropě dělíme na dva proudy. Porovnej, kdo se stěhuje a proč:' },
            { type: 'compare', columns: [
              { title: 'Uvnitř Evropy', icon: 'train', tone: 'a', points: ['občané EU mohou volně žít a pracovat v jiném státě EU', 'za prací z chudšího východu a jihu na bohatší západ a sever: Poláci, Rumuni, Bulhaři do Německa, Británie, Irska', 'studenti (Erasmus+), důchodci za sluncem do Španělska'] },
              { title: 'Do Evropy z jiných světadílů', icon: 'plane', tone: 'b', points: ['za prací a za rodinami: z Turecka, severní Afriky, jižní Asie', 'uprchlíci před válkou: ze Sýrie a Afghánistánu (hlavně 2015), z Ukrajiny (od 2022)', 'nejvíce přistěhovalců míří do Německa, Francie, Španělska a Itálie'] },
            ] },
            { type: 'p', text: 'Největší vlna uprchlíků od druhé světové války přišla po ruském útoku na Ukrajinu v únoru 2022. Mapa ukazuje, kam lidé z Ukrajiny nejčastěji odešli:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['UKR'], tone: 'd', label: 'Ukrajina' },
              { codes: ['DEU', 'POL'], tone: 'a', label: 'přes 900 000 lidí s dočasnou ochranou' },
              { codes: ['CZE'], tone: 'b', label: 'Česko: asi 395 000 – nejvíc na počet obyvatel' },
            ], layers: ['names'], caption: 'Lidé z Ukrajiny s dočasnou ochranou v EU: celkem 4,43 mil. (Eurostat, 31. 7. 2026). V Česku jich připadá 36 na každých 1 000 obyvatel, v průměru EU asi 10.' },
            { type: 'p', text: 'Česko tak přijalo v poměru ke svému počtu obyvatel nejvíc uprchlíků z Ukrajiny v celé EU. Migranti přinášejí do Evropy nové jazyky a náboženství – ale i bez nich je Evropa jazykově velmi pestrá.' },
            { type: 'check', question: { kind: 'multi', q: 'Které situace jsou migrace uvnitř Evropské unie?', options: ['Rumunka jede pracovat jako zdravotní sestra do Německa', 'český student odjíždí na Erasmus do Lisabonu', 'německý důchodce se stěhuje na Mallorku', 'rodina utíká ze Sýrie do Rakouska', 'student z Indie přijíždí studovat do Brna'], answers: [0, 1, 2], explain: 'Rumunsko, Česko, Německo i Španělsko jsou v EU a jejich občané se mohou volně stěhovat. Sýrie a Indie jsou mimo Evropu, jde o migraci do Evropy.' } },
          ],
        },
        {
          title: 'Jazyky a náboženství',
          icon: 'speech',
          blocks: [
            { type: 'p', text: 'V lekci „Jazyky, náboženství a kultury“ jsme poznali jazykové rodiny světa. Většina Evropanů mluví jazyky jedné z nich – **indoevropské**. Uvnitř ní ale tvoří tři velké skupiny, které si rozdělily skoro celou Evropu.' },
            { type: 'p', text: 'Tabulka ukazuje hlavní skupiny jazyků a kde se jimi mluví. Najdi v ní češtinu i jazyky, které vůbec nejsou indoevropské:' },
            { type: 'table', headers: ['skupina', 'jazyky (příklady)', 'kde v Evropě'], rows: [
              ['germánské', 'němčina, angličtina, nizozemština, švédština, norština, dánština', 'západ a sever'],
              ['románské', 'italština, francouzština, španělština, portugalština, rumunština', 'jih a západ, Rumunsko'],
              ['slovanské', 'ruština, ukrajinština, polština, čeština, slovenština, srbština, chorvatština, bulharština', 'střed, východ, Balkán'],
              ['další indoevropské', 'řečtina, albánština, litevština, lotyština, irština, velština', 'Řecko, Albánie, Pobaltí, Irsko, Wales'],
              ['neindoevropské', 'maďarština, finština, estonština (ugrofinské), turečtina, baskičtina', 'Maďarsko, Finsko, Estonsko, Turecko, Baskicko'],
            ], caption: 'Hlavní jazykové skupiny Evropy. Evropská unie má 24 úředních jazyků.' },
            { type: 'p', text: 'Pozor na častou chybu: maďarština není slovanský jazyk, i když Maďarsko leží mezi Slovany. Maďaři přišli do Panonské pánve z východu v 9. století a jejich jazyk je vzdáleně příbuzný finštině. A rumunština je románská – Rumunsko je „latinský ostrov“ mezi Slovany.' },
            { type: 'p', text: 'Podobně se Evropa dělí podle náboženství. Evropa je hlavně křesťanská, ale křesťanství se ve středověku rozdělilo na západní a východní větev a v 16. století se od katolíků oddělili protestanti. Na mapě sleduj, které tradice kde převažují:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['IRL', 'PRT', 'ESP', 'FRA', 'ITA', 'MLT', 'BEL', 'LUX', 'AUT', 'POL', 'SVK', 'HUN', 'HRV', 'SVN', 'LTU'], tone: 'a', label: 'katolická tradice' },
              { codes: ['GBR', 'ISL', 'NOR', 'SWE', 'FIN', 'DNK'], tone: 'b', label: 'protestantská tradice' },
              { codes: ['RUS', 'UKR', 'BLR', 'MDA', 'ROU', 'BGR', 'SRB', 'MNE', 'MKD', 'GRC', 'CYP', 'GEO'], tone: 'c', label: 'pravoslavná tradice' },
              { codes: ['ALB', 'KOS', 'BIH', 'TUR'], tone: 'd', label: 'islámská tradice' },
            ], caption: 'Převažující náboženská tradice podle států (zjednodušeně; v mnoha státech je dnes velká část lidí bez vyznání). V Německu, Nizozemsku a Švýcarsku žijí katolíci i protestanti; Česko a Estonsko patří k nejméně věřícím zemím světa.' },
            { type: 'p', text: 'Hranice mezi katolickým západem a pravoslavným východem jde napříč Evropou a často i napříč jazyky. Chorvati a Srbové si rozumějí skoro jako Češi a Slováci, ale Chorvati jsou většinou katolíci a píšou latinkou, Srbové jsou pravoslavní a píšou cyrilicí i latinkou. Jazyk a víra tak vytvářejí národy – a ty mají své státy.' },
            { type: 'check', question: { kind: 'choice', q: 'Který jazyk je příbuzný finštině?', options: ['maďarština', 'polština', 'rumunština', 'řečtina'], answer: 0, explain: 'Maďarština, finština a estonština patří k ugrofinským jazykům, které nejsou indoevropské. Polština je slovanská, rumunština románská.' } },
          ],
        },
        {
          title: 'Státy a hlavní města',
          icon: 'flag',
          blocks: [
            { type: 'p', text: 'Kolik států má Evropa? Kolem 45 – přesné číslo závisí na tom, jestli počítáme Rusko a Turecko, které leží většinou v Asii, státy za Kavkazem nebo Kosovo, které neuznávají všechny státy. Z lekce „Státy a hranice“ víme, že přesně spočítat státy nejde ani na celém světě.' },
            { type: 'p', text: 'Evropa má rekordmany na obou koncích. Největší stát světa, Rusko, leží z menší části v Evropě; největší stát celý v Evropě je Ukrajina (asi 604 000 km²). Naopak nejmenší stát světa, **Vatikán** (0,44 km²), leží uprostřed Říma. Mezi **trpasličí státy** patří i Monako, San Marino, Lichtenštejnsko, Andorra a Malta. Na mapě najdi hlavní města, která bys měl/a znát:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['RUS'], tone: 'a', label: 'Rusko – největší stát (většina rozlohy v Asii)' },
              { codes: ['UKR'], tone: 'b', label: 'Ukrajina – největší stát ležící celý v Evropě' },
              { codes: ['CZE'], tone: 'c', label: 'Česko' },
            ], points: [
              { lat: 50.09, lon: 14.42, label: 'Praha', kind: 'capital' },
              { lat: 51.5, lon: -0.13, label: 'Londýn', kind: 'capital' },
              { lat: 48.85, lon: 2.35, label: 'Paříž', kind: 'capital' },
              { lat: 52.52, lon: 13.4, label: 'Berlín', kind: 'capital' },
              { lat: 41.9, lon: 12.5, label: 'Řím', kind: 'capital' },
              { lat: 40.42, lon: -3.7, label: 'Madrid', kind: 'capital' },
              { lat: 52.23, lon: 21.01, label: 'Varšava', kind: 'capital' },
              { lat: 59.33, lon: 18.07, label: 'Stockholm', kind: 'capital' },
              { lat: 37.98, lon: 23.73, label: 'Athény', kind: 'capital' },
              { lat: 50.45, lon: 30.52, label: 'Kyjev', kind: 'capital' },
              { lat: 55.75, lon: 37.62, label: 'Moskva', kind: 'capital' },
              { lat: 39.93, lon: 32.85, label: 'Ankara', kind: 'capital' },
            ], caption: 'Největší státy Evropy a vybraná hlavní města. Hlavním městem Turecka je Ankara v Asii, ne Istanbul.' },
            { type: 'p', text: 'Pozor: hlavní město nemusí být největší město státu ani sídlem vlády. V Turecku je hlavní Ankara, i když Istanbul je mnohem větší. Hlavním městem Nizozemska je Amsterdam, ale vláda a parlament sídlí v Haagu. A ve Švýcarsku sídlí vláda v Bernu, ale největším městem je Curych.' },
            { type: 'game', gameId: 'blind-map', text: 'Slepá mapa: najdi evropské státy a jejich hlavní města.' },
            { type: 'p', text: 'S mentální mapou Evropy v hlavě můžeš jít dál. Většina těchto států totiž nežije každý sám za sebe: 27 z nich tvoří Evropskou unii. Jak a proč vznikla, ukáže lekce „Evropská unie a integrace“.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď stát k jeho hlavnímu městu.', pairs: [
              ['Turecko', 'Ankara'],
              ['Nizozemsko', 'Amsterdam'],
              ['Ukrajina', 'Kyjev'],
              ['Švédsko', 'Stockholm'],
            ], explain: 'Turecko má hlavní město Ankaru, ne Istanbul. Nizozemsko má hlavní město Amsterdam, i když vláda sídlí v Haagu.' } },
          ],
        },
      ],
      summary: [
        'V Evropě žije asi 745 milionů lidí, průměrně asi 71 obyv./km²; v EU je to 451 milionů.',
        'Nejhustěji je osídlený pás od Anglie přes Nizozemsko a Porýní do severní Itálie, nejřidčeji chladný sever.',
        'Evropa je nejstarší světadíl: žena v EU má průměrně 1,34 dítěte a lidé nad 65 let tvoří 22 % obyvatel.',
        'V EU umírá víc lidí, než se rodí; obyvatel přibývá jen díky přistěhovalcům z jiných světadílů a uprchlíkům, hlavně z Ukrajiny.',
        'Většina Evropanů mluví germánskými, románskými nebo slovanskými jazyky; maďarština, finština a estonština nejsou indoevropské.',
        'Na západě převažují katolíci, na severu protestanti, na východě a na Balkáně pravoslavní, v Albánii, Kosovu, Bosně a Turecku muslimové.',
        'Evropa má kolem 45 států; největší celý v Evropě je Ukrajina, nejmenší na světě je Vatikán.',
      ],
      quiz: [
        { kind: 'number', q: 'Stát má 18 milionů obyvatel a rozlohu 34 000 km². Jaká je jeho hustota zalidnění? (zaokrouhli na celé číslo)', answer: 529, tolerance: 2, unit: 'obyv./km²', explain: '18 000 000 : 34 000 ≐ 529 obyv./km². Tak hustě je zalidněné Nizozemsko – skoro čtyřikrát hustěji než Česko.' },
        { kind: 'tf', q: 'Evropa je světadíl s nejstarším obyvatelstvem.', answer: true, explain: 'Polovina obyvatel EU je starší než 44,9 roku a lidé nad 65 let tvoří 22 % obyvatel.' },
        { kind: 'choice', q: 'Jak vypadá věková pyramida Itálie?', options: ['dole úzká, nejširší kolem 50–59 let (regresivní)', 'dole široká, nahoře úzká (progresivní)', 'všechny věkové skupiny jsou stejně velké', 'nahoře úzká a uprostřed nejužší'], answer: 0, explain: 'V Itálii se rodí velmi málo dětí, a tak je pyramida dole úzká; nejsilnější jsou ročníky dnešních padesátníků.' },
        { kind: 'tf', q: 'Maďarština patří ke slovanským jazykům.', answer: false, explain: 'Maďarština je ugrofinský jazyk, vzdáleně příbuzný finštině a estonštině. Není ani indoevropská.' },
        { kind: 'match', q: 'Přiřaď jazyk ke skupině.', pairs: [
          ['rumunština', 'románské jazyky'],
          ['nizozemština', 'germánské jazyky'],
          ['bulharština', 'slovanské jazyky'],
          ['finština', 'ugrofinské jazyky'],
        ], explain: 'Rumunština pochází z latiny, nizozemština je příbuzná němčině, bulharština je jihoslovanský jazyk a finština ugrofinský.' },
        { kind: 'choice', q: 'Které náboženství převažuje v Řecku, Srbsku a Rumunsku?', options: ['pravoslavné křesťanství', 'katolické křesťanství', 'protestantské křesťanství', 'islám'], answer: 0, explain: 'Východní část Evropy a Balkán patří k pravoslavné tradici. Katolíci převažují na západě a v Polsku, protestanti na severu.' },
        { kind: 'multi', q: 'Které státy patří mezi evropské trpasličí státy?', options: ['Vatikán', 'Monako', 'Lichtenštejnsko', 'Belgie', 'Slovinsko'], answers: [0, 1, 2], explain: 'Vatikán (0,44 km²), Monako (2 km²) a Lichtenštejnsko (160 km²) jsou trpasličí státy. Belgie a Slovinsko jsou malé, ale ne trpasličí státy.' },
        { kind: 'choice', q: 'Do kterého státu EU přišlo v přepočtu na počet obyvatel nejvíce uprchlíků z Ukrajiny?', options: ['do Česka', 'do Francie', 'do Španělska', 'do Švédska'], answer: 0, explain: 'V Česku žije s dočasnou ochranou asi 36 lidí z Ukrajiny na každých 1 000 obyvatel, nejvíc v EU (Eurostat, 2026). V absolutních číslech je nejvíc v Německu.' },
      ],
    },
    // ───────────────────────────────────────────────────────────── z8-3
    'z8-3': {
      id: 'z8-3',
      title: 'Evropská unie a integrace',
      goals: [
        'Vysvětlit, proč a jak vznikla Evropská unie, a seřadit hlavní kroky jejího vývoje',
        'Popsat, co dělají hlavní instituce EU, a odlišit Evropskou radu, Radu EU a Radu Evropy',
        'Vysvětlit jednotný trh, schengenský prostor a eurozónu a ukázat jejich členy na mapě',
        'Zhodnotit, co Česku členství v EU přináší a co od něj vyžaduje',
      ],
      hook: 'V Bratislavě platíš eurem, z Mnichova voláš domů za stejnou cenu jako z Prahy a na Erasmus do Lisabonu ti stačí občanka. Ještě tvoji rodiče stáli na hranicích s Rakouskem ve frontě na pasovou kontrolu. Co se mezitím stalo?',
      sections: [
        {
          title: 'Od války ke spolupráci',
          icon: 'handshake',
          blocks: [
            { type: 'p', text: 'V lekci „Státy a hranice“ jsme Evropskou unii jen jmenovali. Proč ale vůbec vznikla? Po druhé světové válce ležela Evropa v troskách a Francie s Německem spolu za 70 let válčily třikrát (1870, 1914, 1939).' },
            { type: 'p', text: 'Francouzský ministr zahraničí Robert Schuman proto 9. května 1950 navrhl: dejme uhlí a ocel, suroviny pro zbraně, pod společnou správu. Válka mezi sousedy pak bude „nejen nemyslitelná, ale i materiálně nemožná“. Proto slavíme 9. května **Den Evropy**. Z jeho nápadu vyrostla během 70 let dnešní unie; hlavní kroky ukazuje časová osa:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'pickaxe', title: '1951 ESUO', text: 'Evropské společenství uhlí a oceli: Francie, Západní Německo, Itálie, Belgie, Nizozemsko, Lucembursko' },
              { icon: 'container', title: '1957 Římské smlouvy', text: 'Evropské hospodářské společenství: společný trh šesti států' },
              { icon: 'star', title: '1993 Maastricht', text: 'vzniká Evropská unie: společná pravidla, občanství EU' },
              { icon: 'coin', title: '2002 euro', text: 'bankovky a mince eura v peněženkách' },
              { icon: 'people', title: '2004 velké rozšíření', text: '10 nových států včetně Česka' },
              { icon: 'flag', title: '2020 brexit', text: 'Spojené království jako první stát z EU odchází' },
            ], caption: 'Hlavní kroky evropské integrace. Dnes má EU 27 členských států.' },
            { type: 'p', text: '**Integrace** znamená, že se státy postupně propojují: nejdřív obchod s uhlím, pak celé hospodářství, nakonec i cestování a měna. Jak unie rostla na mapě, ukazují barvy podle roku vstupu:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['BEL', 'FRA', 'DEU', 'ITA', 'LUX', 'NLD'], tone: 'a', label: 'zakládající státy (1951)' },
              { codes: ['DNK', 'IRL', 'GRC', 'ESP', 'PRT', 'AUT', 'FIN', 'SWE'], tone: 'b', label: 'vstup 1973–1995' },
              { codes: ['CZE', 'EST', 'CYP', 'LVA', 'LTU', 'HUN', 'MLT', 'POL', 'SVK', 'SVN', 'BGR', 'ROU', 'HRV'], tone: 'c', label: 'vstup 2004–2013' },
              { codes: ['ALB', 'BIH', 'MNE', 'GEO', 'MDA', 'MKD', 'SRB', 'TUR', 'UKR'], tone: 'd', label: 'kandidátské státy (2026)' },
            ], caption: 'Rozšiřování EU. Spojené království bylo členem v letech 1973–2020. Kosovo je možným kandidátem.' },
            { type: 'p', text: 'Unie roste dál. V roce 2026 má devět kandidátů; nejdál jsou Černá Hora, která chce jednání uzavřít do konce roku 2026, a Albánie. Na vstup ale nestačí chtít: kandidát musí mít fungující demokracii, nezávislé soudy a tržní hospodářství. Kdo o tom všem v EU rozhoduje?' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď události evropské integrace od nejstarší.', items: ['Schumanův plán a ESUO', 'Římské smlouvy', 'vznik Evropské unie v Maastrichtu', 'vstup Česka do EU', 'odchod Spojeného království'], explain: 'ESUO 1951, Římské smlouvy 1957, Maastricht 1993, vstup Česka 2004, brexit 2020.' } },
          ],
        },
        {
          title: 'Kdo v EU rozhoduje',
          icon: 'star',
          blocks: [
            { type: 'p', text: 'EU má 27 členů – jak se tolik států dohodne? K tomu slouží společné **instituce**. Jejich názvy jsou si podobné a pletou se i dospělým, proto si je projdeme pomalu.' },
            { type: 'p', text: 'Na schématu sleduj šipky: kdo koho volí, kdo zákony navrhuje a kdo je schvaluje:' },
            { type: 'diagram', id: 'eu-institutions', caption: 'Hlavní instituce EU. Zákon navrhuje Evropská komise a schvalují ho společně Evropský parlament a Rada EU.' },
            { type: 'p', text: '**Evropský parlament** volí přímo občané každých pět let; má 720 poslanců, z Česka 21. **Evropská komise** v Bruselu je něco jako vláda EU: navrhuje zákony a hlídá, jestli je státy dodržují; z každého státu má jednoho komisaře. **Soudní dvůr EU** v Lucemburku rozhoduje spory o právo EU. Nejvíc se ale pletou tři „rady“:' },
            { type: 'compare', columns: [
              { title: 'Evropská rada', icon: 'star', tone: 'a', points: ['orgán EU', 'schůzky prezidentů a premiérů 27 států', 'určuje hlavní směr EU', 'sídlí v Bruselu'] },
              { title: 'Rada EU', icon: 'handshake', tone: 'b', points: ['orgán EU', 'ministři 27 států podle tématu (zemědělství, doprava…)', 'schvaluje zákony spolu s Parlamentem', 'sídlí v Bruselu'] },
              { title: 'Rada Evropy', icon: 'shield', tone: 'c', points: ['**není** orgán EU', '46 evropských států, i Spojené království, Turecko nebo Ukrajina', 'chrání lidská práva; Evropský soud pro lidská práva', 'sídlí ve Štrasburku'] },
            ], caption: 'Tři rady s podobným jménem. Rusko bylo z Rady Evropy vyloučeno v roce 2022.' },
            { type: 'p', text: 'Instituce jsou mozek unie. Co z jejich rozhodnutí ale poznáš ty sám/sama v běžném životě? Nejvíc jednotný trh.' },
            { type: 'check', question: { kind: 'choice', q: 'Kterou instituci EU volí přímo občané?', options: ['Evropský parlament', 'Evropskou komisi', 'Evropskou radu', 'Soudní dvůr EU'], answer: 0, explain: 'Do Evropského parlamentu volíme každých pět let, naposledy v roce 2024. Ostatní instituce tvoří zástupci vlád nebo je jmenují.' } },
          ],
        },
        {
          title: 'Jednotný trh a čtyři svobody',
          icon: 'container',
          blocks: [
            { type: 'p', text: 'Hlavním nápadem EU je **jednotný (vnitřní) trh**: 27 států obchoduje, jako by byly jedním státem. Z lekce „Služby, cestovní ruch a obchod“ víš, že obchodní bloky ruší cla. Jednotný trh jde mnohem dál – ruší skoro všechny překážky.' },
            { type: 'p', text: 'Jednotný trh stojí na čtyřech svobodách. U každé najdeš příklad, který znáš z běžného života:' },
            { type: 'iconlist', items: [
              { icon: 'container', title: 'Volný pohyb zboží', text: 'kamion z Německa jede do Česka bez cla a bez celní kontroly' },
              { icon: 'house', title: 'Volný pohyb služeb', text: 'česká firma smí opravovat střechy ve Vídni, rakouská banka může mít pobočku v Brně' },
              { icon: 'people', title: 'Volný pohyb osob', text: 'můžeš studovat, pracovat i žít v kterémkoli státě EU (Erasmus+, brigády)' },
              { icon: 'coin', title: 'Volný pohyb kapitálu', text: 'peníze, investice a účty mohou přes hranice volně' },
            ] },
            { type: 'p', text: 'Aby trh fungoval, platí v celé EU stejná pravidla. Proto má každý telefon prodávaný v EU od konce roku 2024 nabíjecí konektor USB-C a proto od června 2017 neplatíš za volání a data v jiném státě EU víc než doma. Pravidla jednotného trhu přijaly i Norsko, Island a Lichtenštejnsko, které v EU nejsou: tvoří s ní **Evropský hospodářský prostor**.' },
            { type: 'callout', variant: 'tip', text: 'Na cesty po EU si vezmi Evropský průkaz zdravotního pojištění – je na zadní straně tvé kartičky pojišťovny. Lékař v jiném státě EU tě ošetří za stejných podmínek jako místní.' },
            { type: 'p', text: 'Zboží tedy jezdí volně. Pro lidi, kteří cestují, je ale důležitější něco jiného: že je na hranicích nikdo nezastaví. To zajišťuje schengenský prostor.' },
            { type: 'check', question: { kind: 'tf', q: 'Volný pohyb osob znamená, že občan Česka může bez pracovního povolení pracovat v Německu.', answer: true, explain: 'Občané EU mohou pracovat v kterémkoli členském státě za stejných podmínek jako místní. To je jedna ze čtyř svobod jednotného trhu.' } },
          ],
        },
        {
          title: 'Schengen a euro',
          icon: 'border',
          blocks: [
            { type: 'p', text: 'Dvě věci si s Evropskou unií pleteme nejčastěji: **schengenský prostor** a **eurozónu**. Obě patří k integraci, ale ani jedna se s EU přesně nekryje.' },
            { type: 'p', text: 'Schengenský prostor dostal jméno podle lucemburské vesnice Schengen, kde se v roce 1985 podepsala první dohoda. Jeho členové zrušili pravidelné kontroly na společných hranicích a společně hlídají hranici vnější. Česko je v Schengenu od 21. prosince 2007, Rumunsko a Bulharsko plně od 1. ledna 2025. Na mapě porovnej, kdo je v EU a kdo v Schengenu:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['AUT', 'BEL', 'BGR', 'HRV', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'], tone: 'a', label: 'v EU i v Schengenu (25)' },
              { codes: ['ISL', 'NOR', 'CHE', 'LIE'], tone: 'b', label: 'v Schengenu, ale ne v EU (4)' },
              { codes: ['IRL', 'CYP'], tone: 'c', label: 'v EU, ale ne v Schengenu (2)' },
            ], caption: 'Schengenský prostor na podzim 2026: 29 států. Irsko si drží společný cestovní prostor se Spojeným královstvím; o přijetí Kypru státy EU zatím nerozhodly.' },
            { type: 'p', text: 'Pozor: i v Schengenu musíš mít u sebe doklad – občanku nebo pas – a státy mohou kontroly na čas obnovit. Německo kontroluje své hranice, včetně té s Českem, od roku 2023 a naposledy kontroly prodloužilo do března 2027.' },
            { type: 'p', text: 'Druhým okruhem je **eurozóna**: státy, které platí společnou měnou euro. Od 1. ledna 2026 jich je 21, posledním přibylo Bulharsko. Euro řídí Evropská centrální banka ve Frankfurtu nad Mohanem. Mapa ukazuje, kdo euro má a kdo ne:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'PRT', 'SVK', 'SVN', 'ESP'], tone: 'a', label: 'eurozóna (21 států EU)' },
              { codes: ['CZE', 'DNK', 'HUN', 'POL', 'ROU', 'SWE'], tone: 'b', label: 'v EU, ale bez eura (6)' },
              { codes: ['KOS', 'MNE', 'AND', 'MCO', 'SMR', 'VAT'], tone: 'c', label: 'platí eurem, ale nejsou v EU' },
            ], caption: 'Eurozóna v roce 2026. Slovensko platí eurem od roku 2009, Chorvatsko od roku 2023, Bulharsko od roku 2026.' },
            { type: 'p', text: 'Výhoda eura je jasná: nemusíš měnit peníze a ceny snadno porovnáš. Stát ale ztrácí vlastní měnu a s ní i možnost sám měnit úrokové sazby, když se mu hospodářsky nedaří. Proto se o euru v Česku stále vedou spory. Dánsko má výjimku, ostatní státy bez eura se zavázaly ho jednou přijmout, ale datum si určují samy.' },
            { type: 'callout', variant: 'fact', text: 'Euromince mají jednu stranu společnou a druhou národní. Na slovenských centech najdeš Kriváň, na řeckém euru sovu, na chorvatském kunu.' },
            { type: 'p', text: 'Schengen a euro ukazují, že EU je „Evropa v několika okruzích“: ne každý člen je ve všem. Jaké místo v těch okruzích má Česko?' },
            { type: 'check', question: { kind: 'multi', q: 'Které státy platí eurem?', options: ['Slovensko', 'Bulharsko', 'Chorvatsko', 'Polsko', 'Česko'], answers: [0, 1, 2], explain: 'Slovensko má euro od roku 2009, Chorvatsko od roku 2023 a Bulharsko od 1. 1. 2026. Polsko a Česko jsou v EU, ale mají vlastní měnu (zlotý a korunu).' } },
          ],
        },
        {
          title: 'Česko v Evropské unii',
          icon: 'pin',
          blocks: [
            { type: 'p', text: 'Teď víme, jak EU funguje. Jak se do ní dostalo Česko? Přihlášku podalo v roce 1996, v referendu v červnu 2003 pro vstup hlasovalo 77,3 % voličů a 1. května 2004 se Česko stalo členem. V letech 2009 a 2022 Radě EU předsedalo.' },
            { type: 'p', text: 'Co členství Česku přináší a co od něj vyžaduje? Porovnej obě strany:' },
            { type: 'compare', columns: [
              { title: 'Co Česko získává', icon: 'check', tone: 'a', points: ['volný přístup na trh 450 milionů lidí; Německo je náš největší obchodní partner', 'peníze z fondů EU na dálnice, železnice, čistírny vod nebo opravy náměstí', 'Češi mohou studovat a pracovat v celé EU', 'cesty bez kontrol a bez poplatků za roaming'] },
              { title: 'Co Česko dává a dodržuje', icon: 'balance-scale', tone: 'b', points: ['odvádí peníze do rozpočtu EU (zatím z něj ale dostává víc, než odvádí)', 'dodržuje společná pravidla, i když s některými nesouhlasí', 'v mnoha otázkách rozhoduje většina států', 'zavázalo se jednou přijmout euro'] },
            ] },
            { type: 'p', text: 'Jak moc pomáhá euro u sousedů, si vyzkoušíš na příkladu z výletu. Kurz koruny se každý den mění, počítejme proto s okrouhlým kurzem 25 Kč za 1 euro:' },
            { type: 'example', title: 'Výlet do Vídně', problem: 'Vstupenka do zoo ve Vídni stojí 28 € a jízdenka na metro na celý den 8 €. Kolik zaplatíš v korunách při kurzu 25 Kč/€?', steps: [
              'Nejdřív sečteme ceny v eurech: 28 € + 8 € = 36 €',
              'Eura převedeme na koruny, každé euro je 25 Kč: 36 · 25 Kč',
              '36 · 25 Kč = 900 Kč',
            ], answer: 'Výlet tě vyjde asi na 900 Kč. Slovák ani Rakušan nic převádět nemusí – platí stejnou měnou.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Schengen, euro a instituce EU – poznáš, co platí?' },
            { type: 'p', text: 'Teď víš, jak Evropa spolupracuje. V dalších lekcích ji projdeme region po regionu. Začneme v lekci „Západní a severní Evropa“ – tam, kde integrace začala.' },
            { type: 'check', question: { kind: 'number', q: 'Lístek na koupaliště v Bratislavě stojí 12 €. Kolik je to v korunách při kurzu 25 Kč/€?', answer: 300, tolerance: 0, unit: 'Kč', explain: '12 · 25 Kč = 300 Kč.' } },
          ],
        },
      ],
      summary: [
        'Evropská integrace začala v roce 1951 společenstvím uhlí a oceli, aby se mezi Francií a Německem už nikdy nemohla vést válka.',
        'Evropská unie vznikla v roce 1993 na základě smlouvy z Maastrichtu; dnes má 27 členů a devět kandidátů, Spojené království odešlo v roce 2020.',
        'Evropský parlament volí občané, Evropská komise navrhuje zákony a Rada EU je schvaluje spolu s Parlamentem; Rada Evropy není orgán EU.',
        'Jednotný trh stojí na volném pohybu zboží, služeb, osob a kapitálu.',
        'Schengenský prostor má 29 států bez pravidelných kontrol na hranicích; eurozóna má od roku 2026 21 států včetně Slovenska a Bulharska.',
        'Česko je v EU od roku 2004 a v Schengenu od roku 2007, euro zatím nepřijalo.',
      ],
      quiz: [
        { kind: 'tf', q: 'Všechny státy Evropské unie platí eurem.', answer: false, explain: 'Euro má 21 z 27 států. Bez eura je Česko, Dánsko, Maďarsko, Polsko, Rumunsko a Švédsko.' },
        { kind: 'choice', q: 'Proč vzniklo v roce 1951 Evropské společenství uhlí a oceli?', options: ['aby válka mezi Francií a Německem byla nemožná', 'aby Evropa mohla vyvážet uhlí do Ameriky', 'aby se v Evropě zavedlo euro', 'aby se zrušily kontroly na hranicích'], answer: 0, explain: 'Uhlí a ocel byly suroviny pro zbrojení. Když je státy spravují společně, nemohou se tajně vyzbrojit proti sobě.' },
        { kind: 'match', q: 'Přiřaď instituci k tomu, co dělá.', pairs: [
          ['Evropská komise', 'navrhuje zákony a hlídá jejich dodržování'],
          ['Evropský parlament', 'volí ho občané, schvaluje zákony'],
          ['Evropská rada', 'hlavy států a vlád určují směr EU'],
          ['Soudní dvůr EU', 'vykládá právo EU a řeší spory'],
        ], explain: 'Komise navrhuje, Parlament a Rada EU schvalují, Evropská rada udává směr a Soudní dvůr rozhoduje spory.' },
        { kind: 'tf', q: 'Rada Evropy je jedním z orgánů Evropské unie.', answer: false, explain: 'Rada Evropy je samostatná organizace 46 států pro lidská práva se sídlem ve Štrasburku. Patří do ní i státy mimo EU, třeba Spojené království nebo Turecko.' },
        { kind: 'choice', q: 'Který stát je v schengenském prostoru, i když není v EU?', options: ['Norsko', 'Irsko', 'Spojené království', 'Srbsko'], answer: 0, explain: 'V Schengenu jsou i Norsko, Island, Švýcarsko a Lichtenštejnsko. Irsko je v EU, ale ne v Schengenu; Spojené království a Srbsko nejsou ani v jednom.' },
        { kind: 'multi', q: 'Co patří ke čtyřem svobodám jednotného trhu EU?', options: ['volný pohyb zboží', 'volný pohyb osob', 'volný pohyb kapitálu', 'společná armáda', 'jeden úřední jazyk'], answers: [0, 1, 2], explain: 'Jednotný trh stojí na volném pohybu zboží, služeb, osob a kapitálu. Společnou armádu EU nemá a úředních jazyků má 24.' },
        { kind: 'number', q: 'Kolik členských států má Evropská unie v roce 2026?', answer: 27, tolerance: 0, explain: 'Po odchodu Spojeného království v roce 2020 má EU 27 členů. Posledním novým členem bylo v roce 2013 Chorvatsko.' },
        { kind: 'order', q: 'Seřaď, kdy Česko vstoupilo do jednotlivých organizací, od nejdřívějšího.', items: ['NATO', 'Evropská unie', 'schengenský prostor'], explain: 'NATO 1999, EU 1. 5. 2004, Schengen 21. 12. 2007. Do eurozóny Česko zatím nevstoupilo.' },
      ],
    },
    // ───────────────────────────────────────────────────────────── z8-4
    'z8-4': {
      id: 'z8-4',
      title: 'Západní a severní Evropa',
      goals: [
        'Vyjmenovat státy západní a severní Evropy s hlavními městy a ukázat je na mapě',
        'Popsat přírodu a hospodářství Spojeného království, Irska, Francie a zemí Beneluxu',
        'Vysvětlit, z čeho žijí severské státy a proč jsou bohaté, i když leží daleko na severu',
        'Rozlišit, které státy regionu jsou v EU, v Schengenu a v NATO',
      ],
      hook: 'Na severu Norska v létě slunce celé týdny nezapadá a v zimě celé týdny nevyjde. Na západě a severu Evropy leží jedny z nejbohatších států světa – a přitom tam často prší, fouká a roste hlavně tráva a les. Jak k bohatství přišly?',
      sections: [
        {
          title: 'Region u Atlantiku',
          icon: 'map',
          blocks: [
            { type: 'p', text: 'Ze všech regionů Evropy leží západ a sever nejblíž Atlantiku. Z lekce „Příroda Evropy“ víme, že Golfský proud a západní větry dávají západu regionu a pobřeží Norska vlhké oceánské podnebí s mírnými zimami; ve Finsku a ve vnitrozemí Švédska jsou ale zimy mrazivé. Které státy sem patří?' },
            { type: 'p', text: 'Na mapě najdeš dvě skupiny států. Všimni si, kolik z nich leží na ostrovech nebo poloostrovech:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['GBR', 'IRL', 'FRA', 'BEL', 'NLD', 'LUX'], tone: 'a', label: 'západní Evropa' },
              { codes: ['NOR', 'SWE', 'FIN', 'DNK', 'ISL'], tone: 'c', label: 'severní Evropa (severské státy)' },
            ], points: [
              { lat: 51.5, lon: -0.13, label: 'Londýn', kind: 'capital' },
              { lat: 53.35, lon: -6.26, label: 'Dublin', kind: 'capital' },
              { lat: 48.85, lon: 2.35, label: 'Paříž', kind: 'capital' },
              { lat: 50.85, lon: 4.35, label: 'Brusel', kind: 'capital' },
              { lat: 59.91, lon: 10.75, label: 'Oslo', kind: 'capital' },
              { lat: 59.33, lon: 18.07, label: 'Stockholm', kind: 'capital' },
              { lat: 60.17, lon: 24.94, label: 'Helsinky', kind: 'capital' },
              { lat: 55.68, lon: 12.57, label: 'Kodaň', kind: 'capital' },
              { lat: 64.15, lon: -21.94, label: 'Reykjavík', kind: 'capital' },
            ], layers: ['names'], caption: 'Státy západní a severní Evropy s hlavními městy. Pobaltské státy (Estonsko, Lotyšsko, Litva) se řadí někdy k severní, jindy k východní Evropě.' },
            { type: 'p', text: 'Moře tu bylo vždy cestou, ne překážkou. Odsud vypluli Vikingové, odsud vyrážely lodě do kolonií a dnes tu leží největší přístavy Evropy. Bohatství regionu začalo právě obchodem po moři – a jako první ho naplno využila Británie.' },
            { type: 'check', question: { kind: 'choice', q: 'Které hlavní město patří k severským státům?', options: ['Helsinky', 'Dublin', 'Brusel', 'Lucemburk'], answer: 0, explain: 'Helsinky jsou hlavním městem Finska. Dublin je v Irsku, Brusel v Belgii a Lucemburk v Lucembursku – to vše je západní Evropa.' } },
          ],
        },
        {
          title: 'Spojené království a Irsko',
          icon: 'crown',
          blocks: [
            { type: 'p', text: 'Velká Británie je největší ostrov Evropy. **Spojené království** tvoří čtyři země: Anglie, Skotsko, Wales a Severní Irsko. Proto pozor: „Anglie“ není jiný název pro celý stát, je to jen jeho největší část.' },
            { type: 'p', text: 'V 18. století tu začala **průmyslová revoluce**: uhlí, železo a parní stroj udělaly z Británie „dílnu světa“ a z Londýna centrum říše, která ovládala čtvrtinu světa. Doly a hutě ale později upadly a Británie přešla na služby. Sousední Irsko prošlo úplně jinou cestou. Porovnej oba státy:' },
            { type: 'compare', columns: [
              { title: 'Spojené království', icon: 'crown', tone: 'a', points: ['69 milionů obyvatel, konstituční monarchie', 'Londýn (asi 9 mil. obyvatel): jedno z největších finančních center světa', 'ropa a plyn ze Severního moře', 'z EU vystoupilo v roce 2020 (brexit)'] },
              { title: 'Irsko', icon: 'leaf', tone: 'b', points: ['asi 5,4 milionu obyvatel, republika', '„zelený ostrov“: vlhké oceánské podnebí, pastviny', 'v Dublinu mají evropská sídla velké technologické firmy', 'člen EU, platí eurem'] },
            ] },
            { type: 'p', text: 'Brexit poznáš i na výletě: do Londýna dnes potřebuješ pas a předem elektronické povolení ke vstupu, občanka nestačí. Ostrov Irsko je přitom rozdělený: na severu leží **Severní Irsko**, které patří ke Spojenému království. Pod kanálem La Manche vede od roku 1994 železniční **Eurotunel** (50 km), který Británii spojuje s Francií.' },
            { type: 'p', text: 'Za tunelem leží Francie – stát, který je v mnohém opakem ostrovní Británie.' },
            { type: 'check', question: { kind: 'tf', q: 'Irsko je členem EU a platí eurem.', answer: true, explain: 'Irsko vstoupilo do EU v roce 1973 a platí eurem. Do EU nepatří jen Severní Irsko, které je součástí Spojeného království.' } },
          ],
        },
        {
          title: 'Francie',
          icon: 'wheat',
          blocks: [
            { type: 'p', text: 'Francie je rozlohou největší stát Evropské unie (bez zámořských území asi 550 000 km²) a má 68,6 milionu obyvatel. Na severu leží úrodná **Pařížská pánev**, uprostřed starý **Centrální masiv**, na jihovýchodě Alpy s Mont Blankem a na jihu Pyreneje.' },
            { type: 'p', text: 'Francie je ve všem trochu „největší“. Podívej se, čím vyniká:' },
            { type: 'iconlist', items: [
              { icon: 'wheat', title: 'Zemědělství', text: 'největší zemědělský výrobce EU: pšenice, víno, sýry' },
              { icon: 'radiation', title: 'Jaderná energie', text: 'jaderné elektrárny vyrábějí asi dvě třetiny elektřiny' },
              { icon: 'suitcase', title: 'Cestovní ruch', text: 'nejnavštěvovanější země světa: 102 milionů zahraničních turistů (2025)' },
              { icon: 'plane', title: 'Letadla a vlaky', text: 'Airbus v Toulouse, rychlovlaky TGV' },
              { icon: 'city', title: 'Paříž', text: 'v regionu kolem Paříže žije skoro pětina Francouzů' },
            ] },
            { type: 'p', text: 'Francie je silně **centralizovaný** stát: dálnice i železnice se sbíhají v Paříži a tam sídlí skoro všechny úřady, banky a velké firmy. Má také zámořská území, která jsou součástí EU – například Francouzská Guyana v Jižní Americe, odkud startují evropské rakety.' },
            { type: 'p', text: 'Od Francie na sever leží tři malé, ale velmi bohaté státy, kterým se podle prvních slabik říká Benelux.' },
            { type: 'check', question: { kind: 'choice', q: 'Kolik zahraničních turistů navštívilo Francii v roce 2025?', options: ['asi 102 milionů', 'asi 10 milionů', 'asi 1 miliarda', 'asi 25 milionů'], answer: 0, explain: 'Francie přivítala 102 milionů zahraničních turistů – víc než má sama obyvatel. Je nejnavštěvovanější zemí světa.' } },
          ],
        },
        {
          title: 'Benelux: život pod hladinou moře',
          icon: 'dam',
          blocks: [
            { type: 'p', text: '**Benelux** je zkratka z prvních slabik Belgie, Nizozemska a Lucemburska. Tyto tři státy spolupracují už od roku 1944 a patří k šesti zakladatelům evropské integrace, které jsme poznali v lekci „Evropská unie a integrace“.' },
            { type: 'p', text: 'Každý ze tří států má jiný příběh. Porovnej je:' },
            { type: 'compare', columns: [
              { title: 'Nizozemsko', icon: 'dam', tone: 'a', points: ['asi čtvrtina území leží pod hladinou moře', '**poldry**: pevnina získaná na moři a chráněná hrázemi', 'Rotterdam, největší přístav Evropy', 'hlavní město Amsterdam, vláda v Haagu'] },
              { title: 'Belgie', icon: 'speech', tone: 'b', points: ['na severu Vlámové (nizozemština), na jihu Valoni (francouzština), na východě menšina mluví německy', 'federace', 'Brusel: sídlo institucí EU i NATO'] },
              { title: 'Lucembursko', icon: 'coin', tone: 'c', points: ['malé velkovévodství', 'banky a finanční služby', 'nejvyšší HDP na obyvatele v EU', 'skoro polovina zaměstnanců dojíždí ze sousedních států'] },
            ] },
            { type: 'p', text: 'Nizozemci říkají: „Bůh stvořil svět, ale Nizozemci Nizozemsko.“ Když v roce 1953 prolomila bouře hráze a zahynulo přes 1 800 lidí, postavili soustavu obřích hrází a pohyblivých bariér **Delta**. S tím, jak stoupá hladina moře, ji musí dál zvyšovat.' },
            { type: 'callout', variant: 'warning', text: 'Pozor: Holandsko není jiný název pro Nizozemsko. Severní a Jižní Holandsko jsou jen dvě z dvanácti provincií. Stát se jmenuje Nizozemsko.' },
            { type: 'p', text: 'Benelux žije z obchodu, přístavů a služeb na malém, hustě zalidněném území. Na severu Evropy je to naopak: hodně prostoru, málo lidí a bohatství ukryté v přírodě.' },
            { type: 'check', question: { kind: 'tf', q: 'Holandsko je jiný název pro celé Nizozemsko.', answer: false, explain: 'Holandsko jsou jen dvě provincie na západě (Severní a Jižní Holandsko). Celý stát se jmenuje Nizozemsko.' } },
          ],
        },
        {
          title: 'Severské státy',
          icon: 'snowflake',
          blocks: [
            { type: 'p', text: '**Severské státy** jsou Norsko, Švédsko, Finsko, Dánsko a Island. Leží daleko na severu: Norsko, Švédsko a Finsko zasahují za severní polární kruh, kde je v létě **polární den** a v zimě **polární noc**, které známe z lekce „Oběh Země kolem Slunce a roční období“. Přesto patří k nejbohatším státům světa.' },
            { type: 'p', text: 'Žije tu jen asi 28 milionů lidí, ale každý stát umí využít to, co mu dala příroda. Podívej se, z čeho žijí:' },
            { type: 'iconlist', items: [
              { icon: 'oil-barrel', title: 'Norsko', text: 'ropa a plyn ze Severního moře; zisky ukládá do státního fondu pro budoucí generace; elektřina skoro jen z vodních elektráren' },
              { icon: 'tree', title: 'Švédsko', text: 'lesy a dřevo, železná ruda z Kiruny; firmy Volvo, IKEA, Spotify' },
              { icon: 'pond', title: 'Finsko', text: 'tisíce jezer a lesy: papír a dřevo; mobilní sítě (Nokia)' },
              { icon: 'wind-turbine', title: 'Dánsko', text: 'vepřové maso a mléko; větrné elektrárny daly asi 60 % elektřiny vyrobené v Dánsku (2025); LEGO' },
              { icon: 'volcano', title: 'Island', text: 'sopky a gejzíry: geotermální energie; rybolov a cestovní ruch' },
            ] },
            { type: 'p', text: 'Peníze z přírody využívají severské státy pro všechny: mají vysoké daně, ale také bezplatné školy a zdravotnictví a silnou pomoc lidem v nouzi. Tomu se říká **severský model**. Na severu Skandinávie žijí také **Sámové**, původní obyvatelé Laponska; někteří z nich dodnes chovají soby.' },
            { type: 'p', text: 'Severské státy nemají k Evropské unii stejný vztah. Norsko odmítlo vstup v referendech v letech 1972 a 1994 a Islanďané 29. srpna 2026 těsně odmítli obnovit jednání o vstupu (52,8 % hlasů proti). Oba státy jsou ale v Schengenu i v Evropském hospodářském prostoru. Finsko (2023) a Švédsko (2024) zase po ruském útoku na Ukrajinu opustily dlouhou neutralitu a vstoupily do NATO.' },
            { type: 'game', gameId: 'quickfire', text: 'Blesková výzva: státy, města a hospodářství západní a severní Evropy.' },
            { type: 'p', text: 'Sever Evropy je chladný, řídce osídlený a bohatý. Úplně jiná je jižní Evropa: slunce, davy turistů a staré civilizace. Tam nás zavede lekce „Jižní a jihovýchodní Evropa“.' },
            { type: 'check', question: { kind: 'match', q: 'Přiřaď severský stát k tomu, co je pro jeho hospodářství typické.', pairs: [
              ['Norsko', 'ropa a plyn ze Severního moře'],
              ['Island', 'geotermální energie ze sopečného podloží'],
              ['Švédsko', 'lesy a železná ruda'],
              ['Dánsko', 'větrné elektrárny a chov prasat'],
            ], explain: 'Každý severský stát využívá svou přírodu: Norsko moře s ropou, Island sopky, Švédsko lesy a rudy, nížinaté Dánsko vítr a úrodnou půdu.' } },
          ],
        },
      ],
      summary: [
        'Západní Evropu tvoří Spojené království, Irsko, Francie a Benelux, severní Evropu Norsko, Švédsko, Finsko, Dánsko a Island.',
        'Západ regionu a pobřeží Norska mají díky Golfskému proudu a západním větrům oceánské podnebí s mírnými zimami; Finsko a vnitrozemí Švédska mají zimy mrazivé.',
        'Ve Spojeném království začala průmyslová revoluce; Londýn je světové finanční centrum a v roce 2020 stát z EU vystoupil.',
        'Francie je rozlohou největší stát EU, jejím největším zemědělským výrobcem a nejnavštěvovanější zemí světa.',
        'Asi čtvrtina Nizozemska leží pod hladinou moře a chrání ji hráze; Rotterdam je největší přístav Evropy, Brusel sídlem EU a NATO.',
        'Severské státy bohatnou z přírody (ropa, lesy, rudy, vítr, geotermální energie) a peníze využívají v severském modelu pro všechny.',
        'Norsko a Island nejsou v EU, ale jsou v Schengenu; Finsko a Švédsko vstoupily po roce 2022 do NATO.',
      ],
      quiz: [
        { kind: 'tf', q: 'Anglie je jiný název pro Spojené království.', answer: false, explain: 'Spojené království tvoří čtyři země: Anglie, Skotsko, Wales a Severní Irsko. Anglie je jen největší z nich.' },
        { kind: 'choice', q: 'Proč mají Londýn i Dublin mírné zimy, i když leží severněji než Praha?', options: ['ohřívá je Golfský proud a západní větry od Atlantiku', 'leží v subtropickém pásu', 'chrání je vysoké hory na severu', 'mají v zimě polární den'], answer: 0, explain: 'Oceán v zimě hřeje a západní větry přinášejí teplý vlhký vzduch nad pevninu. Proto tam v zimě skoro nemrzne.' },
        { kind: 'multi', q: 'Které státy patří k Beneluxu?', options: ['Belgie', 'Nizozemsko', 'Lucembursko', 'Dánsko', 'Švýcarsko'], answers: [0, 1, 2], explain: 'Benelux = Belgie, Nizozemsko, Lucembursko. Dánsko patří k severským státům, Švýcarsko do střední Evropy.' },
        { kind: 'choice', q: 'Co jsou poldry?', options: ['území získaná na moři a chráněná hrázemi', 'údolí vyhloubená ledovcem', 'větrné elektrárny na moři', 'pastviny na svazích hor'], answer: 0, explain: 'Nizozemci vysušili části moře a jezer a obehnali je hrázemi. Na poldrech dnes leží pole i města.' },
        { kind: 'tf', q: 'Norsko je členem Evropské unie.', answer: false, explain: 'Norové vstup do EU dvakrát odmítli v referendu (1972, 1994). Norsko je ale v Schengenu a v Evropském hospodářském prostoru.' },
        { kind: 'match', q: 'Přiřaď stát k hlavnímu městu.', pairs: [
          ['Irsko', 'Dublin'],
          ['Norsko', 'Oslo'],
          ['Dánsko', 'Kodaň'],
          ['Finsko', 'Helsinky'],
        ], explain: 'Dublin, Oslo, Kodaň a Helsinky jsou hlavní města i největší města svých států.' },
        { kind: 'choice', q: 'Které dva severské státy vstoupily do NATO po ruském útoku na Ukrajinu v roce 2022?', options: ['Finsko a Švédsko', 'Norsko a Dánsko', 'Island a Norsko', 'Dánsko a Finsko'], answer: 0, explain: 'Finsko vstoupilo do NATO v roce 2023 a Švédsko v roce 2024. Norsko, Dánsko a Island jsou v NATO od jeho vzniku v roce 1949.' },
        { kind: 'text', q: 'Jak se jmenuje největší přístav Evropy, ležící u ústí Rýna?', accept: ['Rotterdam'], explain: 'Rotterdam v Nizozemsku leží u ústí Rýna do Severního moře. Zboží odtud míří po řece až do Švýcarska.' },
      ],
    },
    // ───────────────────────────────────────────────────────────── z8-5
    'z8-5': {
      id: 'z8-5',
      title: 'Jižní a jihovýchodní Evropa',
      goals: [
        'Přečíst z klimatogramu středomořské podnebí a vysvětlit, proč je léto suché',
        'Popsat přírodu a hospodářství Itálie, Španělska, Portugalska a Řecka',
        'Zhodnotit přínosy a problémy cestovního ruchu ve Středomoří',
        'Vysvětlit, jak dějiny utvořily mapu Balkánu, a popsat hlavní migrační trasy přes Středomoří',
      ],
      hook: 'Chorvatské moře, řecké ostrovy, pizza v Neapoli. Jih Evropy je pro Čechy synonymem prázdnin. Jenže stejné slunce, které láká turisty, přináší sucha a požáry – a stejné moře, po kterém plují trajekty s turisty, je pro migranty z Afriky nejnebezpečnější cestou do Evropy.',
      sections: [
        {
          title: 'Středomořské podnebí',
          icon: 'sun',
          blocks: [
            { type: 'p', text: 'V lekci „Příroda Evropy“ jsme v tabulce podnebí zmínili středomořské podnebí. Teď se na něj podíváme zblízka. Jak vypadá rok v Římě a čím se liší od roku v Praze?' },
            { type: 'p', text: 'Porovnej klimatogram Říma s Prahou. Sleduj hlavně sloupce srážek v létě a teplotu v zimě:' },
            { type: 'climate', places: [
              { name: 'Řím-Ciampino', altitude: 129, temp: [7.5, 8.0, 10.7, 13.6, 18.0, 22.5, 25.1, 25.4, 21.0, 17.0, 12.4, 8.5], precip: [65.6, 62.8, 58.6, 68.6, 56.9, 30.1, 19.8, 30.2, 64.9, 88.1, 108.2, 98.3], source: 'normál 1991–2020' },
              { name: 'Praha-Ruzyně', altitude: 364, temp: [-0.6, 0.7, 4.5, 9.2, 13.6, 17.0, 18.9, 18.7, 13.9, 8.7, 3.8, 0.4], precip: [23.3, 19.1, 30.6, 27.5, 60.3, 73.1, 79.2, 67.2, 38.5, 34.2, 28.5, 25.9], source: 'ČHMÚ, normál 1991–2020' },
            ], caption: 'Řím: horké suché léto a mírná deštivá zima. Praha: nejvíc srážek v létě, zima kolem nuly.' },
            { type: 'p', text: 'V Římě spadne v červenci jen asi 20 mm srážek, v Praze 79 mm. Nejvíc v Římě prší v listopadu (108 mm) a v lednu je tam průměrně 7,5 °C. To je **středomořské podnebí** subtropického pásu: horké suché léto, mírná vlhká zima. Proč? V létě se nad Středomoří posune **subtropická tlaková výše** z lekce „Oběh vzduchu a podnebné pásy“ a přinese jasno; v zimě sem od Atlantiku přicházejí tlakové níže s deštěm.' },
            { type: 'p', text: 'Pozor, Středomoří není poušť: v Římě spadne za rok dokonce víc srážek než v Praze. Potíž je v tom, že voda chybí právě v létě, kdy je nejtepleji. Proto tu rostou **tvrdolisté** rostliny, které umějí šetřit vodou – olivovník, korkový dub, vavřín a nízké křoviny makchie – a pole se musí zavlažovat. Horké suché léto zároveň láká miliony lidí k moři.' },
            { type: 'check', question: { kind: 'choice', q: 'Kdy v Římě prší nejméně?', options: ['v létě, v červenci', 'v zimě, v lednu', 'na podzim, v listopadu', 'na jaře, v dubnu'], answer: 0, explain: 'V červenci spadne v Římě jen asi 20 mm. V létě nad Středomořím leží subtropická tlaková výše, která přináší jasno a sucho.' } },
          ],
        },
        {
          title: 'Čtyři státy jižní Evropy',
          icon: 'palm',
          blocks: [
            { type: 'p', text: 'Ve Středomoří leží tři velké poloostrovy, které jsme poznali v lekci „Příroda Evropy“: Pyrenejský, Apeninský a Balkánský. Na nich leží čtyři hlavní státy jižní Evropy. Najdi je na mapě:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['ESP', 'PRT', 'ITA', 'GRC'], tone: 'a', label: 'hlavní státy jižní Evropy' },
              { codes: ['MLT', 'CYP', 'VAT', 'SMR', 'AND'], tone: 'b', label: 'malé státy jižní Evropy' },
            ], points: [
              { lat: 41.9, lon: 12.5, label: 'Řím', kind: 'capital' },
              { lat: 40.42, lon: -3.7, label: 'Madrid', kind: 'capital' },
              { lat: 38.72, lon: -9.14, label: 'Lisabon', kind: 'capital' },
              { lat: 37.98, lon: 23.73, label: 'Athény', kind: 'capital' },
              { lat: 45.46, lon: 9.19, label: 'Milán', kind: 'city' },
              { lat: 41.39, lon: 2.17, label: 'Barcelona', kind: 'city' },
              { lat: 45.44, lon: 12.34, label: 'Benátky', kind: 'city' },
            ], layers: ['names'], caption: 'Jižní Evropa. Vatikán a San Marino leží uvnitř Itálie, Andorra v Pyrenejích mezi Španělskem a Francií.' },
            { type: 'p', text: 'Všechny čtyři státy spojuje moře, slunce a dlouhé dějiny. Každý z nich má ale jiný povrch a žije z trochu jiných věcí. Porovnej je v tabulce:' },
            { type: 'table', headers: ['stát', 'povrch', 'hospodářství', 'zajímavost'], rows: [
              ['Itálie (58,9 mil.)', 'Alpy, Apeniny, Pádská nížina; sopky Vesuv a Etna', 'průmyslový sever (Milán, Turín), móda, auta, cestovní ruch', 'bohatý sever a chudší jih'],
              ['Španělsko (49,1 mil.)', 'vnitrozemská plošina Meseta, Pyreneje; Baleárské a Kanárské ostrovy', 'cestovní ruch, zelenina a ovoce ze skleníků, auta', '96,8 mil. zahraničních turistů (2025)'],
              ['Portugalsko', 'pobřeží Atlantiku, hornatý sever', 'cestovní ruch, víno, korek', 'mys Roca – nejzápadnější bod pevninské Evropy'],
              ['Řecko', 'hory a tisíce ostrovů', 'cestovní ruch, lodní doprava, olivy', 'kolébka demokracie a olympijských her'],
            ], caption: 'Čtyři hlavní státy jižní Evropy (počty obyvatel: Eurostat, 1. 1. 2025).' },
            { type: 'p', text: 'Itálie je rozdělená: průmyslový sever kolem Milána patří k nejbohatším oblastem EU, jih (Mezzogiorno) k nejchudším. Mladí lidé z jihu proto odcházejí za prací na sever nebo do zahraničí. Pro celý jih Evropy je ale nejdůležitější jedno odvětví: cestovní ruch.' },
            { type: 'check', question: { kind: 'tf', q: 'Nejbohatší část Itálie je její jih.', answer: false, explain: 'Je to naopak: bohatý je průmyslový sever kolem Milána a Turína, jih (Mezzogiorno) je chudší.' } },
          ],
        },
        {
          title: 'Cestovní ruch: požehnání i zátěž',
          icon: 'suitcase',
          blocks: [
            { type: 'p', text: 'V lekci „Služby, cestovní ruch a obchod“ jsme viděli, že cestovní ruch přináší peníze i problémy. Ve Středomoří je to vidět víc než kdekoli jinde: ke Středozemnímu moři míří každý rok stovky milionů turistů.' },
            { type: 'p', text: 'Kolik turistů připadá na jednoho obyvatele, se dá snadno spočítat. Zkusme to pro Španělsko:' },
            { type: 'example', title: 'Turisté ve Španělsku', problem: 'Španělsko navštívilo v roce 2025 asi 96,8 milionu zahraničních turistů a žije v něm 49,1 milionu lidí. Kolik turistů připadá na jednoho obyvatele?', steps: [
              'Počet turistů vydělíme počtem obyvatel, protože chceme turisty „na hlavu“: 96,8 mil. : 49,1 mil.',
              'Miliony se zkrátí: 96,8 : 49,1 ≐ 2,0',
            ], answer: 'Na každého obyvatele Španělska připadají za rok asi 2 zahraniční turisté. Na Mallorce nebo v Barceloně je to ještě mnohem víc.' },
            { type: 'p', text: 'Když jsou turisté rozložení po celém státě, je to výhoda. Když se ale sejdou na pár místech najednou, mluvíme o **přeplnění turisty** (anglicky *overtourism*). Porovnej obě strany:' },
            { type: 'compare', columns: [
              { title: 'Přínosy', icon: 'coin', tone: 'a', points: ['práce pro miliony lidí v hotelech, restauracích, dopravě', 'peníze ze zahraničí', 'opravy památek a lepší doprava'] },
              { title: 'Problémy', icon: 'warning', tone: 'b', points: ['byty se pronajímají turistům, místní si nemohou dovolit bydlení', 'davy v historických centrech (Benátky, Barcelona)', 'spotřeba vody v nejsušším období roku', 'práce jen v sezoně'] },
            ] },
            { type: 'p', text: 'Města se začala bránit: Benátky vybírají od roku 2024 v nejrušnějších dnech vstupné od jednodenních návštěvníků a Barcelona chce do roku 2028 zrušit krátkodobé pronájmy bytů turistům. Ke Středomoří ale nepatří jen italské a španělské pláže. Na jeho východě leží Balkán – oblast se složitými dějinami.' },
            { type: 'check', question: { kind: 'number', q: 'Řecko má asi 10,4 milionu obyvatel a v roce 2025 ho navštívilo asi 38 milionů zahraničních turistů (Řecká národní banka). Kolik turistů připadá na jednoho obyvatele? (zaokrouhli na desetiny)', answer: 3.7, tolerance: 0.1, explain: '38 : 10,4 ≐ 3,7. Na každého Řeka připadají za rok skoro čtyři zahraniční turisté – asi dvakrát víc než ve Španělsku.' } },
          ],
        },
        {
          title: 'Balkán: hory, národy a války',
          icon: 'border',
          blocks: [
            { type: 'p', text: 'Balkánský poloostrov dostal jméno podle pohoří Balkán v Bulharsku. Je hornatý a na západě krasový: podél Jadranu se táhnou **Dinárské hory** z vápence. Slovo **kras** dokonce pochází z náhorní plošiny Kras ve Slovinsku. Proč je ale mapa Balkánu tak rozdrobená?' },
            { type: 'p', text: 'Odpověď je v dějinách. Na Balkáně se po staletí střetávaly říše: Byzanc, Osmanská (turecká) říše a habsburská monarchie (později Rakousko-Uhersko). Proto tu vedle sebe žijí katolíci, pravoslavní i muslimové a mluví se slovanskými jazyky, řečtinou, albánštinou i rumunštinou. Ve 20. století spojila většinu jižních Slovanů **Jugoslávie**. Na mapě najdi státy, které vznikly jejím rozpadem:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'MKD', 'KOS'], tone: 'a', label: 'státy vzniklé rozpadem Jugoslávie' },
              { codes: ['ALB', 'GRC', 'BGR', 'ROU'], tone: 'b', label: 'další státy jihovýchodní Evropy' },
            ], points: [
              { lat: 43.86, lon: 18.41, label: 'Sarajevo', kind: 'capital' },
              { lat: 44.8, lon: 20.46, label: 'Bělehrad', kind: 'capital' },
            ], layers: ['names'], caption: 'Jihovýchodní Evropa. Kosovo vyhlásilo nezávislost v roce 2008; Česko ji uznalo, Srbsko ne.' },
            { type: 'p', text: 'Jugoslávie se rozpadla v letech 1991–1992 a následovaly války. Nejkrutější byla válka v Bosně a Hercegovině (1992–1995); v Srebrenici bylo v roce 1995 zavražděno asi 8 000 bosenských muslimů a mezinárodní soud to označil za genocidu. Dnes jsou Slovinsko a Chorvatsko v EU, Chorvatsko od roku 2023 i v Schengenu a v eurozóně. Ostatní státy západního Balkánu jsou kandidáty na vstup, Kosovo možným kandidátem.' },
            { type: 'p', text: 'Z jihovýchodu Evropy lidé hodně odcházejí za prací na západ. Bulharsko mělo v roce 1989 skoro 9 milionů obyvatel, dnes asi 6,4 milionu. Zatímco z Balkánu se odchází, přes Středozemní moře se do Evropy snaží dostat lidé z jiných světadílů.' },
            { type: 'check', question: { kind: 'multi', q: 'Které státy vznikly rozpadem Jugoslávie?', options: ['Chorvatsko', 'Srbsko', 'Slovinsko', 'Albánie', 'Bulharsko'], answers: [0, 1, 2], explain: 'Z Jugoslávie vzniklo Slovinsko, Chorvatsko, Bosna a Hercegovina, Srbsko, Černá Hora, Severní Makedonie a Kosovo. Albánie a Bulharsko byly samostatné státy už dřív.' } },
          ],
        },
        {
          title: 'Středomoří jako hranice',
          icon: 'footprints',
          blocks: [
            { type: 'p', text: 'Středozemní moře odděluje bohatou Evropu od Afriky a Blízkého východu, kde je víc chudoby a válek. Push a pull faktory z lekce „Migrace“ tu působí velmi silně: pro mnoho lidí je moře branou do Evropy.' },
            { type: 'p', text: 'Na mapě sleduj tři hlavní trasy přes moře a jednu po souši, kterou v roce 2015 prošly statisíce lidí:' },
            { type: 'map', view: 'europe', routes: [
              { points: [{ lat: 32.9, lon: 13.2 }, { lat: 35.5, lon: 12.6 }, { lat: 37.5, lon: 14.0 }], label: 'centrální Středomoří (Libye, Tunisko → Itálie)', tone: 'a', arrow: true },
              { points: [{ lat: 35.2, lon: -3.9 }, { lat: 36.7, lon: -4.4 }], label: 'západní Středomoří (Maroko → Španělsko)', tone: 'b', arrow: true },
              { points: [{ lat: 38.4, lon: 27.1 }, { lat: 39.1, lon: 26.5 }, { lat: 37.98, lon: 23.73 }], label: 'východní Středomoří (Turecko → Řecko)', tone: 'c', arrow: true },
              { points: [{ lat: 40.64, lon: 22.94 }, { lat: 42.0, lon: 21.43 }, { lat: 44.8, lon: 20.46 }, { lat: 47.5, lon: 19.04 }, { lat: 48.21, lon: 16.37 }, { lat: 48.14, lon: 11.58 }], label: 'balkánská trasa (2015)', tone: 'd', style: 'dashed', arrow: true },
            ], points: [{ lat: 35.5, lon: 12.6, label: 'Lampedusa', kind: 'place' }], caption: 'Hlavní migrační trasy do EU (zjednodušeně). Další trasa vede přes Atlantik ze západní Afriky na Kanárské ostrovy.' },
            { type: 'p', text: 'V roce 2015 zaznamenala agentura **Frontex**, která hlídá vnější hranici EU, asi 1,8 milionu nelegálních přechodů hranice (někteří lidé byli započteni víckrát); velkou část tvořili uprchlíci z války v Sýrii. Od té doby jich výrazně ubylo: v roce 2025 to bylo necelých 178 000 a víc než třetina lidí připlula přes centrální Středomoří do Itálie. Cesta je smrtelně nebezpečná: od roku 2014 ve Středozemním moři zemřelo nebo zmizelo víc než 32 000 lidí (Mezinárodní organizace pro migraci, 2025).' },
            { type: 'p', text: 'Jak s migrací zacházet, je jedna z největších sporných otázek v EU. Od června 2026 platí nový **Pakt o migraci a azylu**: rychlejší kontroly na vnější hranici a sdílení odpovědnosti mezi státy. Spory ukazují, že jih Evropy čelí tlaku zvenčí. Střed a východ Evropy zase prošly za posledních 35 let dvěma velkými zlomy – o nich je lekce „Střední a východní Evropa“.' },
            { type: 'game', gameId: 'swipe', text: 'Pravda, nebo lež? Středomoří, Balkán a cestovní ruch.' },
            { type: 'check', question: { kind: 'tf', q: 'V roce 2025 vedla nejvytíženější migrační trasa do EU přes centrální Středomoří do Itálie.', answer: true, explain: 'Podle agentury Frontex připadala na centrální Středomoří víc než třetina všech nelegálních přechodů hranice EU, víc než na kteroukoli jinou trasu. Lidé vyplouvají hlavně z Libye a Tuniska.' } },
          ],
        },
      ],
      summary: [
        'Jih Evropy má středomořské podnebí: horké suché léto pod subtropickou tlakovou výší a mírnou deštivou zimu.',
        'Tvrdolisté rostliny (olivovník, korkový dub, makchie) umějí šetřit vodou, pole se v létě musí zavlažovat.',
        'Itálie má bohatý průmyslový sever a chudší jih; Španělsko, Portugalsko a Řecko žijí hodně z cestovního ruchu.',
        'Cestovní ruch přináší práci a peníze, ale také drahé bydlení, davy a nedostatek vody; města se začínají bránit.',
        'Mapu Balkánu utvořily říše a rozpad Jugoslávie ve válkách 90. let; Slovinsko a Chorvatsko jsou v EU, ostatní státy západního Balkánu jsou kandidáty.',
        'Přes Středozemní moře vedou hlavní migrační trasy do EU; od roku 2014 na nich zemřelo nebo zmizelo víc než 32 000 lidí.',
      ],
      quiz: [
        { kind: 'tf', q: 'Ve Středomoří spadne za rok méně srážek než v poušti, proto je léto suché.', answer: false, explain: 'V Římě spadne za rok přes 700 mm, víc než v Praze. Srážky ale padají hlavně v zimě, léto je suché kvůli tlakové výši.' },
        { kind: 'choice', q: 'Co přináší do Středomoří v létě jasné a suché počasí?', options: ['subtropická tlaková výše', 'Golfský proud', 'monzun', 'studená fronta od severu'], answer: 0, explain: 'V létě se nad Středomoří posune subtropická tlaková výše. V zimě přicházejí od Atlantiku tlakové níže s deštěm.' },
        { kind: 'multi', q: 'Které rostliny jsou typické pro středomořské podnebí?', options: ['olivovník', 'korkový dub', 'vinná réva', 'smrk ztepilý', 'rašeliník'], answers: [0, 1, 2], explain: 'Olivovník, korkový dub a vinná réva snášejí suché léto. Smrk a rašeliník potřebují chladnější a vlhčí podnebí.' },
        { kind: 'match', q: 'Přiřaď stát k tomu, co je pro něj typické.', pairs: [
          ['Itálie', 'Pádská nížina a průmyslový sever'],
          ['Španělsko', 'plošina Meseta a Kanárské ostrovy'],
          ['Řecko', 'tisíce ostrovů a lodní doprava'],
          ['Portugalsko', 'mys Roca, nejzápadnější bod pevninské Evropy'],
        ], explain: 'Každý stát jižní Evropy má jiný povrch: Itálie nížinu pod Alpami, Španělsko vnitrozemskou plošinu, Řecko ostrovy a Portugalsko atlantské pobřeží.' },
        { kind: 'choice', q: 'Proč na Balkáně žijí vedle sebe katolíci, pravoslavní i muslimové?', options: ['po staletí se tu střetávaly různé říše, mimo jiné Osmanská říše a habsburská monarchie', 'přistěhovali se sem až v 21. století', 'všichni obyvatelé mluví stejným jazykem', 'Balkán byl vždy jedním státem'], answer: 0, explain: 'Osmanská říše přinesla islám, západ ovlivnila katolická habsburská monarchie a Řím, východ pravoslavná Byzanc.' },
        { kind: 'tf', q: 'Chorvatsko je členem EU a platí eurem.', answer: true, explain: 'Chorvatsko vstoupilo do EU v roce 2013 a od 1. 1. 2023 je v eurozóně i v Schengenu.' },
        { kind: 'text', q: 'Jak se jmenuje stát, který existoval na Balkáně ve 20. století a rozpadl se v letech 1991–1992?', accept: ['Jugoslávie', 'Jugoslavie'], explain: 'Z Jugoslávie vzniklo sedm států: Slovinsko, Chorvatsko, Bosna a Hercegovina, Srbsko, Černá Hora, Severní Makedonie a Kosovo.' },
        { kind: 'number', q: 'Ostrov má 900 000 obyvatel a za rok na něj přijede 13,5 milionu turistů. Kolik turistů připadá na jednoho obyvatele?', answer: 15, tolerance: 0, explain: '13 500 000 : 900 000 = 15. Podobný nápor turistů zažívají oblíbené ostrovy, třeba Mallorca.' },
      ],
    },
    // ───────────────────────────────────────────────────────────── z8-6
    'z8-6': {
      id: 'z8-6',
      title: 'Střední a východní Evropa',
      goals: [
        'Ukázat na mapě sousedy Česka a popsat jejich přírodu, města a hospodářství',
        'Vysvětlit, jak se střední Evropa proměnila po roce 1989, a porovnat, jak dohání bohatší západ',
        'Popsat Ukrajinu, Bělorusko a evropskou část Ruska',
        'Vysvětlit válku na Ukrajině jako geografickou událost: území, uprchlíci, energie, potraviny a bezpečnost',
      ],
      hook: 'Tvoji prarodiče potřebovali na cestu do Vídně zvláštní povolení a hranici hlídaly ploty s ostnatým drátem. Dnes do Vídně dojedeš vlakem za čtyři hodiny a nikdo tě nezastaví. Jen o pár set kilometrů dál na východ se ale od roku 2022 válčí. Co všechno se ve střední a východní Evropě za posledních 35 let změnilo?',
      sections: [
        {
          title: 'Sousedé Česka',
          icon: 'map',
          blocks: [
            { type: 'p', text: 'Po západě, severu a jihu Evropy se vracíme domů. Ke **střední Evropě** patří Česko a jeho sousedé – Německo, Polsko, Rakousko a Slovensko – a dále Maďarsko, Švýcarsko a Lichtenštejnsko. Najdi je na mapě:' },
            { type: 'map', view: 'central-europe', highlight: [
              { codes: ['CZE'], tone: 'a', label: 'Česko' },
              { codes: ['DEU', 'POL', 'AUT', 'SVK'], tone: 'b', label: 'sousedé Česka' },
              { codes: ['HUN', 'CHE', 'LIE'], tone: 'c', label: 'další státy střední Evropy' },
            ], points: [
              { lat: 50.09, lon: 14.42, label: 'Praha', kind: 'capital' },
              { lat: 52.52, lon: 13.4, label: 'Berlín', kind: 'capital' },
              { lat: 52.23, lon: 21.01, label: 'Varšava', kind: 'capital' },
              { lat: 48.21, lon: 16.37, label: 'Vídeň', kind: 'capital' },
              { lat: 48.15, lon: 17.11, label: 'Bratislava', kind: 'capital' },
              { lat: 47.5, lon: 19.04, label: 'Budapešť', kind: 'capital' },
              { lat: 46.95, lon: 7.45, label: 'Bern', kind: 'capital' },
              { lat: 49.17, lon: 20.13, label: 'Gerlachovský štít 2 655 m', kind: 'peak' },
            ], layers: ['rivers', 'names'], caption: 'Střední Evropa s hlavními městy a řekami. Nejvyšší horou Karpat je Gerlachovský štít ve Vysokých Tatrách.' },
            { type: 'p', text: 'Sousedé Česka se hodně liší velikostí. Porovnej je v tabulce s Českem:' },
            { type: 'table', headers: ['stát', 'obyvatel (2025)', 'rozloha', 'hlavní město'], rows: [
              ['Německo', '83,6 mil.', '357 600 km²', 'Berlín'],
              ['Polsko', '36,5 mil.', '312 700 km²', 'Varšava'],
              ['Česko', '10,9 mil.', '78 900 km²', 'Praha'],
              ['Maďarsko', '9,5 mil.', '93 000 km²', 'Budapešť'],
              ['Rakousko', '9,2 mil.', '83 900 km²', 'Vídeň'],
              ['Slovensko', '5,4 mil.', '49 000 km²', 'Bratislava'],
            ], caption: 'Státy střední Evropy (počet obyvatel k 1. 1. 2025 podle Eurostatu, rozloha zaokrouhleně).' },
            { type: 'p', text: 'Největším sousedem je Německo – a pro Česko také nejdůležitějším. Začneme proto u něj a u Rakouska.' },
            { type: 'check', question: { kind: 'choice', q: 'Se kterým státem Česko nesousedí?', options: ['s Maďarskem', 's Rakouskem', 's Polskem', 'se Slovenskem'], answer: 0, explain: 'Česko sousedí s Německem, Polskem, Rakouskem a Slovenskem. Maďarsko leží až za Slovenskem.' } },
          ],
        },
        {
          title: 'Německo a Rakousko',
          icon: 'factory',
          blocks: [
            { type: 'p', text: '**Německo** je nejlidnatější stát EU a má její největší hospodářství. Na severu leží Severoevropská nížina, uprostřed nižší pohoří Středoněmecké vysočiny a na jihu Alpy. Je to spolková republika – federace 16 spolkových zemí, jak víme z lekce „Státy a hranice“.' },
            { type: 'p', text: 'Německo a Rakousko jsou si jazykem blízké, ale jinak se dost liší. Porovnej je:' },
            { type: 'compare', columns: [
              { title: 'Německo', icon: 'car', tone: 'a', points: ['auta (Volkswagen, BMW, Mercedes-Benz), strojírenství, chemie', 'Porúří: z uhelného a ocelářského kraje oblast služeb a vědy; poslední černouhelný důl zavřen 2018', 'v roce 2023 zavřelo poslední jaderné elektrárny; z obnovitelných zdrojů dnes vyrábí víc než polovinu elektřiny', 'největší obchodní partner Česka: míří sem asi třetina českého vývozu'] },
              { title: 'Rakousko', icon: 'mountain', tone: 'b', points: ['Alpy zabírají asi dvě třetiny území', 'cestovní ruch, hlavně zimní sporty', 'asi 60 % elektřiny z vodních elektráren', 'neutrální stát, není v NATO; Vídeň má asi 2 miliony obyvatel'] },
            ] },
            { type: 'p', text: 'Německo bylo v letech 1949–1990 rozdělené na západní a východní stát a Berlín přetínala zeď. Ani 35 let po sjednocení v roce 1990 nejsou rozdíly pryč: na východě Německa jsou mzdy dodnes nižší a mladí lidé odcházejí na západ. Podobnou cestu z plánovaného hospodářství prošly i Polsko, Slovensko a Maďarsko.' },
            { type: 'check', question: { kind: 'tf', q: 'Rakousko je neutrální stát a není členem NATO.', answer: true, explain: 'Rakousko je neutrální od roku 1955. Je v EU, ale do NATO nevstoupilo.' } },
          ],
        },
        {
          title: 'Polsko, Slovensko a Maďarsko',
          icon: 'car',
          blocks: [
            { type: 'p', text: 'Polsko, Slovensko a Maďarsko mají s Českem hodně společného: podobné dějiny, vstup do EU v roce 2004 a spolupráci ve **Visegrádské skupině** (V4), založené v roce 1991. Přírodou i hospodářstvím se ale liší.' },
            { type: 'p', text: 'Každý stát má svou silnou stránku. Podívej se, čím je který známý:' },
            { type: 'iconlist', items: [
              { icon: 'wheat', title: 'Polsko', text: 'hlavně nížiny (jméno od slova pole – rovina, pláň); Baltské moře a ledovcová Mazurská jezera na severu, Tatry na jihu; z uhlí vyrábí pořád zhruba polovinu elektřiny (2025)' },
              { icon: 'car', title: 'Slovensko', text: 'Karpaty a Tatry; světová jednička ve výrobě aut na obyvatele: 1,07 milionu aut v roce 2025, tedy 196 na každých 1 000 obyvatel; platí eurem od roku 2009' },
              { icon: 'drop', title: 'Maďarsko', text: 'Panonská pánev s Velkou uherskou nížinou, Dunaj a Tisa, jezero Balaton; termální prameny; ugrofinský jazyk' },
            ] },
            { type: 'p', text: 'Pozor: Slovensko vyrábí nejvíc aut na obyvatele na světě, ale ne nejvíc aut celkem – to Čína. Čísla „na obyvatele“ a „celkem“ se v geografii pletou často. Jak se z těchto států staly výrobci aut pro celou Evropu, vysvětluje jejich proměna po roce 1989.' },
            { type: 'check', question: { kind: 'choice', q: 'Který stát je světovou jedničkou ve výrobě aut na obyvatele?', options: ['Slovensko', 'Německo', 'Polsko', 'Maďarsko'], answer: 0, explain: 'Slovensko vyrobilo v roce 2025 asi 196 aut na 1 000 obyvatel. Továrny tam mají Volkswagen, Kia, Stellantis a Jaguar Land Rover.' } },
          ],
        },
        {
          title: 'Proměna po roce 1989',
          icon: 'arrow-cycle',
          blocks: [
            { type: 'p', text: 'Až do roku 1989 patřila východní část střední Evropy pod vliv Sovětského svazu. Hranici se Západem, **železnou oponu**, hlídaly ploty, miny a stráže. Hospodářství bylo **plánované**: co se vyrobí a za kolik, rozhodoval stát. Pak přišel rok 1989 – pád Berlínské zdi 9. listopadu a sametová revoluce 17. listopadu.' },
            { type: 'p', text: 'Přechod k tržnímu hospodářství a demokracii se nazývá **transformace**. Proběhl v několika krocích:' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'flag', title: '1989 revoluce', text: 'pád komunistických vlád, otevřené hranice' },
              { icon: 'coin', title: 'privatizace', text: 'státní podniky dostaly soukromé majitele, vznikly tisíce nových firem' },
              { icon: 'factory', title: 'zahraniční investice', text: 'automobilky a dodavatelé ze západu stavějí továrny' },
              { icon: 'shield', title: 'NATO a EU', text: 'Česko, Polsko a Maďarsko vstupují do NATO 1999, Slovensko 2004; všechny čtyři do EU 2004' },
              { icon: 'chart', title: 'dohánění západu', text: 'mzdy a životní úroveň rostou' },
            ], caption: 'Transformace střední Evropy po roce 1989 (zjednodušeně).' },
            { type: 'p', text: 'Transformace nebyla bezbolestná: staré doly a hutě se zavíraly a v některých krajích vznikla vysoká nezaměstnanost. Celkově ale státy V4 západ rychle dohánějí. Tabulka ukazuje HDP na obyvatele v **paritě kupní síly** – tedy přepočtené tak, aby se vzaly v úvahu rozdílné ceny v jednotlivých státech; průměr EU je 100:' },
            { type: 'table', headers: ['stát', 'HDP na obyvatele (EU = 100)'], rows: [
              ['Česko', '91'],
              ['Polsko', '79'],
              ['Maďarsko', '77'],
              ['Slovensko', '75'],
            ], caption: 'HDP na obyvatele v paritě kupní síly, 2024 (Eurostat). V roce 2004 měly všechny čtyři státy výrazně méně; Polsko tehdy mělo jen asi polovinu průměru EU.' },
            { type: 'p', text: 'Česko je dnes na úrovni Slovinska. Dál na východ, za hranicí EU, ale proběhla transformace úplně jinak – a dnes tam zuří válka.' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď události od nejstarší.', items: ['sametová revoluce', 'vstup Česka do NATO', 'vstup Česka do EU', 'vstup Slovenska do eurozóny'], explain: 'Sametová revoluce 1989, NATO 1999, EU 2004, Slovensko zavedlo euro v roce 2009.' } },
          ],
        },
        {
          title: 'Ukrajina, Bělorusko a Rusko',
          icon: 'wheat',
          blocks: [
            { type: 'p', text: '**Východní Evropu** tvoří hlavně obrovská Východoevropská rovina od Polska až k Uralu. Leží na ní Ukrajina, Bělorusko, Moldavsko a evropská část Ruska. Patří sem i Pobaltí – Estonsko, Lotyšsko a Litva –, které je ale od roku 2004 v EU i v NATO.' },
            { type: 'p', text: 'Tři největší státy východní Evropy se liší hlavně tím, jakou cestou šly po rozpadu Sovětského svazu v roce 1991. Porovnej je:' },
            { type: 'compare', columns: [
              { title: 'Ukrajina', icon: 'wheat', tone: 'a', points: ['největší stát ležící celý v Evropě', 'černozem: před válkou největší vývozce slunečnicového oleje na světě a velký vývozce kukuřice a pšenice', 'Dněpr, Kyjev, Charkov, přístav Oděsa; uhlí a ocel v Donbasu', 'kandidát na vstup do EU'] },
              { title: 'Bělorusko', icon: 'forest', tone: 'b', points: ['rovina s lesy, močály a jezery (Polesí)', 'od roku 1994 vládne stejný prezident, svobodné volby tu nejsou', 'hospodářsky i vojensky úzký spojenec Ruska', 'hlavní město Minsk'] },
              { title: 'Rusko (evropská část)', icon: 'oil-barrel', tone: 'c', points: ['asi čtvrtina rozlohy Ruska, ale asi tři čtvrtiny jeho obyvatel', 'Moskva (asi 13 mil. obyvatel) a Petrohrad; řeka Volha', 'vývoz ropy, plynu, uhlí a obilí', 'exkláva Kaliningradská oblast mezi Polskem a Litvou'] },
            ] },
            { type: 'p', text: 'Pozor na černozem: tuhle úrodnou půdu jsme poznali v lekci „Půdy a jejich ochrana“. Pás černozemí přes Ukrajinu a jih Ruska patří k nejúrodnějším oblastem světa, proto se Ukrajině říká **obilnice Evropy**. Právě na Ukrajině se však od roku 2022 válčí.' },
            { type: 'check', question: { kind: 'tf', q: 'Ukrajina je největší stát, který leží celý v Evropě.', answer: true, explain: 'Ukrajina má asi 604 000 km². Rusko je větší, ale jeho větší část leží v Asii.' } },
          ],
        },
        {
          title: 'Válka na Ukrajině jako geografická událost',
          icon: 'shield',
          blocks: [
            { type: 'p', text: 'Válka není jen téma dějepisu. Mění hranice, pohyb lidí, obchod, energii i životní prostředí – a to jsou otázky geografie. Co se stalo a co to znamená pro mapu Evropy?' },
            { type: 'p', text: 'V roce 2014 Rusko obsadilo a připojilo ukrajinský poloostrov Krym; většina států světa to neuznává. Zároveň podpořilo ozbrojené separatisty v Donbasu. **24. února 2022** zahájilo Rusko útok na celou Ukrajinu. Na podzim 2026 válka pokračuje: Rusko okupuje asi pětinu území Ukrajiny (asi 19 % včetně Krymu, léto 2026) a jednání o příměří zatím k míru nevedla. Mapa ukazuje, jak válka změnila bezpečnostní mapu Evropy:' },
            { type: 'map', view: 'europe', highlight: [
              { codes: ['UKR'], tone: 'a', label: 'Ukrajina – napadený stát' },
              { codes: ['RUS', 'BLR'], tone: 'b', label: 'Rusko a jeho spojenec Bělorusko' },
              { codes: ['ALB', 'BEL', 'BGR', 'HRV', 'CZE', 'DNK', 'EST', 'FRA', 'DEU', 'GRC', 'HUN', 'ISL', 'ITA', 'LVA', 'LTU', 'LUX', 'MNE', 'NLD', 'MKD', 'NOR', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'TUR', 'GBR'], tone: 'c', label: 'státy NATO' },
              { codes: ['FIN', 'SWE'], tone: 'd', label: 'noví členové NATO: Finsko (2023), Švédsko (2024)' },
            ], points: [
              { lat: 50.45, lon: 30.52, label: 'Kyjev', kind: 'capital' },
              { lat: 55.75, lon: 37.62, label: 'Moskva', kind: 'capital' },
              { lat: 45.0, lon: 34.1, label: 'Krym (Rusko ho obsadilo 2014)', kind: 'place' },
              { lat: 47.51, lon: 34.59, label: 'Záporožská jaderná elektrárna', kind: 'place' },
            ], caption: 'Evropa a válka na Ukrajině (2026). NATO má 32 členů; k evropským státům patří ještě USA a Kanada. Vstupem Finska se hranice NATO s Ruskem prodloužila o 1 340 km.' },
            { type: 'p', text: 'Válka připravila o život velké množství vojáků i civilistů a zničila celá města. Její dopady ale sahají daleko za frontu. Podívej se na pět hlavních:' },
            { type: 'iconlist', items: [
              { icon: 'people', title: 'Uprchlíci', text: 'v EU žije s dočasnou ochranou 4,43 milionu lidí z Ukrajiny (červenec 2026), v Česku asi 395 000' },
              { icon: 'fuel', title: 'Energie', text: 'EU omezila dovoz ruského plynu: v roce 2021 tvořil asi 45 % dovozu, v roce 2025 asi 12 %; do konce roku 2027 má skončit úplně' },
              { icon: 'wheat', title: 'Potraviny', text: 'blokáda černomořských přístavů v roce 2022 zdražila obilí ve světě; Ukrajina vyváží i po Dunaji a po souši' },
              { icon: 'dam', title: 'Příroda', text: 'v červnu 2023 byla zničena přehrada Kachovka na Dněpru; zaminovaná pole, okupovaná největší jaderná elektrárna Evropy' },
              { icon: 'shield', title: 'Bezpečnost', text: 'Finsko a Švédsko vstoupily do NATO, evropské státy dávají víc peněz na obranu' },
            ] },
            { type: 'p', text: 'Tím jsme prošli Evropu od Atlantiku až po Ural: přírodu, lidi, unii i všechny regiony. V úrovni „Česko“ se podíváme na stát, který leží uprostřed toho všeho – a který znáš nejlíp.' },
            { type: 'check', question: { kind: 'multi', q: 'Které dopady války na Ukrajině jsou vidět i v Česku?', options: ['v Česku žije asi 395 000 lidí z Ukrajiny s dočasnou ochranou', 'Česko a EU přestávají kupovat ruský plyn', 'evropské státy včetně Česka dávají víc peněz na obranu', 'Česko vystoupilo z Evropské unie', 'Česko přestalo být členem NATO'], answers: [0, 1, 2], explain: 'Česko přijalo v poměru k počtu obyvatel nejvíc uprchlíků v EU, odpojuje se od ruského plynu a zvyšuje výdaje na obranu. Členem EU i NATO zůstává.' } },
          ],
        },
      ],
      summary: [
        'Ke střední Evropě patří Česko, Německo, Polsko, Rakousko, Slovensko, Maďarsko, Švýcarsko a Lichtenštejnsko.',
        'Německo je nejlidnatější stát EU s největším hospodářstvím a největší obchodní partner Česka; Rakousko je alpský neutrální stát.',
        'Polsko je převážně nížinaté a stále hodně závisí na uhlí, Slovensko vyrábí nejvíc aut na obyvatele na světě, Maďarsko leží v Panonské pánvi.',
        'Po roce 1989 prošly státy střední Evropy transformací z plánovaného na tržní hospodářství; Česko dnes dosahuje 91 % průměru EU v HDP na obyvatele.',
        'Východní Evropu tvoří Východoevropská rovina s Ukrajinou, Běloruskem a evropskou částí Ruska; černozem dělá z Ukrajiny obilnici Evropy.',
        'Rusko v roce 2014 obsadilo Krym a v roce 2022 napadlo celou Ukrajinu; v roce 2026 okupuje asi pětinu jejího území.',
        'Válka změnila Evropu: miliony uprchlíků, konec závislosti na ruském plynu a rozšíření NATO o Finsko a Švédsko.',
      ],
      quiz: [
        { kind: 'tf', q: 'Česko sousedí se čtyřmi státy: Německem, Polskem, Rakouskem a Slovenskem.', answer: true, explain: 'Česko má čtyři sousedy. Nejdelší hranici má s Německem, nejkratší se Slovenskem.' },
        { kind: 'choice', q: 'Co znamená, že Česko dosahuje 91 % průměru EU v HDP na obyvatele v paritě kupní síly?', options: ['Česko vytvoří na obyvatele asi o desetinu méně zboží a služeb než průměr EU (po zohlednění cen)', 'Česko má 91 % obyvatel EU', 'Česko vyrábí 91 % aut v EU', 'v Česku pracuje 91 % lidí'], answer: 0, explain: 'Parita kupní síly bere v úvahu i ceny v každém státě. Průměr EU je 100, Česko má 91.' },
        { kind: 'match', q: 'Přiřaď stát k tomu, co je pro něj typické.', pairs: [
          ['Slovensko', 'nejvíc aut na obyvatele na světě'],
          ['Maďarsko', 'Panonská pánev a jezero Balaton'],
          ['Rakousko', 'Alpy, zimní sporty a vodní elektrárny'],
          ['Polsko', 'nížiny a elektřina z uhlí'],
        ], explain: 'Každý soused Česka má jinou přírodu i hospodářství, i když všechny spojuje vstup do EU.' },
        { kind: 'choice', q: 'Proč se Ukrajině říká obilnice Evropy?', options: ['má rozsáhlé černozemě, jedny z nejúrodnějších půd světa', 'leží v tropickém pásu', 'všechno obilí dováží z Ruska', 'má nejvíc srážek v Evropě'], answer: 0, explain: 'Černozem je tmavá půda bohatá na humus. Ukrajina z ní před válkou vyvážela obrovské množství pšenice, kukuřice a slunečnicového oleje.' },
        { kind: 'tf', q: 'Kaliningradská oblast patří k Rusku, i když s ním nesousedí.', answer: true, explain: 'Kaliningradská oblast je ruská exkláva mezi Polskem a Litvou u Baltského moře.' },
        { kind: 'multi', q: 'Které státy vstoupily do NATO v roce 1999?', options: ['Česko', 'Polsko', 'Maďarsko', 'Slovensko', 'Rakousko'], answers: [0, 1, 2], explain: 'Česko, Polsko a Maďarsko vstoupily do NATO v roce 1999, Slovensko v roce 2004. Rakousko je neutrální a v NATO není.' },
        { kind: 'number', q: 'Kolik členů má NATO v roce 2026?', answer: 32, tolerance: 0, explain: 'Po vstupu Finska (2023) a Švédska (2024) má NATO 32 členů: 30 evropských států, USA a Kanadu.' },
        { kind: 'choice', q: 'Jak válka na Ukrajině změnila dovoz energie do EU?', options: ['EU omezila dovoz ruského plynu a do konce roku 2027 ho má ukončit', 'EU začala dovážet víc ruského plynu než dřív', 'EU přestala používat plyn úplně', 'na dovoz energie neměla válka vliv'], answer: 0, explain: 'Podíl Ruska na dovozu plynu do EU klesl z asi 45 % (2021) na asi 12 % (2025). Nařízení EU z ledna 2026 dovoz ruského plynu do konce roku 2027 zakazuje.' },
      ],
    },
  },
  boss: [
    { kind: 'choice', q: 'Klimatogram ukazuje lednový průměr −6 °C, červencový 20 °C a nejvíc srážek v červenci. Které místo to je?', options: ['Moskva', 'Londýn', 'Řím', 'Lisabon'], answer: 0, explain: 'Mrazivá zima, teplé léto a srážky hlavně v létě jsou znaky pevninského podnebí uprostřed Východoevropské roviny. Londýn a Lisabon mají mírnou zimu, Řím suché léto.' },
    { kind: 'tf', q: 'Ural je mladé pohoří, které vzniklo alpinským vrásněním.', answer: false, explain: 'Ural je staré pohoří z prvohor, dnes obroušené na necelé 2 000 m. Mladá pohoří jsou Alpy, Karpaty nebo Pyreneje.' },
    { kind: 'number', q: 'Polsko má 36,5 milionu obyvatel a rozlohu asi 312 700 km². Jaká je jeho hustota zalidnění? (zaokrouhli na celé číslo)', answer: 117, tolerance: 1, unit: 'obyv./km²', explain: '36 500 000 : 312 700 ≐ 117 obyv./km². Polsko je zalidněné řidčeji než Česko (138 obyv./km²).' },
    { kind: 'match', q: 'Přiřaď stát k jeho převažující náboženské tradici.', pairs: [
      ['Polsko', 'katolická'],
      ['Švédsko', 'protestantská'],
      ['Řecko', 'pravoslavná'],
      ['Albánie', 'islámská'],
    ], explain: 'Katolíci převažují na západě a v Polsku, protestanti na severu, pravoslavní na východě a na Balkáně, muslimové v Albánii, Kosovu, Bosně a Turecku.' },
    { kind: 'multi', q: 'Které státy jsou v schengenském prostoru, ale nejsou v Evropské unii?', options: ['Švýcarsko', 'Norsko', 'Island', 'Irsko', 'Kypr'], answers: [0, 1, 2], explain: 'Švýcarsko, Norsko, Island a Lichtenštejnsko jsou v Schengenu bez členství v EU. Irsko a Kypr jsou naopak v EU, ale ne v Schengenu.' },
    { kind: 'choice', q: 'Která instituce EU navrhuje nové zákony?', options: ['Evropská komise', 'Evropský parlament', 'Rada Evropy', 'Soudní dvůr EU'], answer: 0, explain: 'Zákony navrhuje Evropská komise, schvalují je Evropský parlament a Rada EU. Rada Evropy není orgán EU.' },
    { kind: 'multi', q: 'Které státy střední Evropy platí eurem?', options: ['Německo', 'Rakousko', 'Slovensko', 'Polsko', 'Maďarsko'], answers: [0, 1, 2], explain: 'Německo a Rakousko mají euro od jeho vzniku, Slovensko od roku 2009. Polsko a Maďarsko jsou v EU, ale platí zlotým a forintem.' },
    { kind: 'order', q: 'Seřaď hlavní města od západu na východ.', items: ['Lisabon', 'Paříž', 'Berlín', 'Varšava', 'Moskva'], explain: 'Lisabon leží asi na 9° z. d., Paříž na 2° v. d., Berlín na 13° v. d., Varšava na 21° v. d. a Moskva na 38° v. d.' },
    { kind: 'choice', q: 'Z čeho hlavně zbohatlo Norsko?', options: ['z ropy a zemního plynu ze Severního moře', 'z pěstování oliv', 'z výroby aut', 'z těžby černého uhlí v Alpách'], answer: 0, explain: 'Norsko těží ropu a plyn ze dna Severního moře a zisky ukládá do státního fondu. Elektřinu přitom vyrábí skoro jen ve vodních elektrárnách.' },
    { kind: 'text', q: 'Jak se jmenuje podnebí s horkým suchým létem a mírnou deštivou zimou, typické pro Itálii, Španělsko a Řecko?', accept: ['středomořské', 'středomořské podnebí', 'stredomorske'], explain: 'Středomořské podnebí patří k subtropickému pásu. V létě nad ním leží tlaková výše, v zimě přinášejí déšť tlakové níže od Atlantiku.' },
    { kind: 'tf', q: 'Kosovo vzniklo rozpadem Jugoslávie a nezávislost vyhlásilo v roce 2008.', answer: true, explain: 'Kosovo vyhlásilo nezávislost v roce 2008. Česko ji uznalo, Srbsko ji neuznává.' },
    { kind: 'choice', q: 'Jak se změnila hranice NATO s Ruskem, když v roce 2023 vstoupilo do NATO Finsko?', options: ['prodloužila se asi o 1 340 km', 'zkrátila se na polovinu', 'nezměnila se, Finsko s Ruskem nesousedí', 'NATO s Ruskem přestalo sousedit'], answer: 0, explain: 'Finsko má s Ruskem hranici dlouhou asi 1 340 km. Jeho vstupem do NATO se hranice aliance s Ruskem víc než zdvojnásobila.' },
  ],
}

export default level
