import type { LevelContent } from '../../../core/types'

const level: LevelContent = {
  lessons: {
    // ───────────────────────────────────────────────────────────── f2-1
    'f2-1': {
      id: 'f2-1',
      title: 'Pohyb a jeho popis',
      goals: [
        'Rozhodnout, jestli je těleso v klidu, nebo v pohybu vzhledem ke zvolené vztažné soustavě',
        'Rozlišit trajektorii, dráhu a posunutí a poznat rovnoměrný a nerovnoměrný pohyb',
        'Spočítat rychlost ze vztahu v = s / t a převádět km/h na m/s a zpět',
        'Spočítat průměrnou rychlost celé cesty i s přestávkami',
      ],
      hook: 'Sedíš ve vlaku a čteš si. Pohybuješ se, nebo ne? Průvodčí řekne, že sedíš v klidu. Kráva na louce by řekla, že kolem ní letíš sto dvacítkou. A víš co? Mají pravdu oba!',
      sections: [
        {
          title: 'Klid a pohyb jsou relativní',
          icon: 'car',
          blocks: [
            { type: 'p', text: 'Těleso je **v pohybu**, když mění svou polohu vzhledem k jinému tělesu. Když ji nemění, je **v klidu**. To „jiné těleso“, ke kterému pohyb vztahujeme, se nazývá **vztažná soustava**.' },
            { type: 'compare', columns: [
              { title: 'Vzhledem k vlaku', icon: 'clock', tone: 'a', points: ['cestující na sedadle: **v klidu**', 'kufr na polici: **v klidu**', 'strom za oknem: **pohybuje se** dozadu'] },
              { title: 'Vzhledem k nádraží', icon: 'speed', tone: 'b', points: ['cestující na sedadle: **pohybuje se** 120 km/h', 'kufr na polici: **pohybuje se** 120 km/h', 'strom za oknem: **v klidu**'] },
            ], caption: 'Stejná situace, dvě vztažné soustavy, dvě pravdivé odpovědi.' },
            { type: 'p', text: 'Bez vztažné soustavy nemá otázka „pohybuje se to?“ smysl. ==Klid a pohyb jsou vždy relativní – záleží, vzhledem k čemu je posuzujeme.== V běžném životě za vztažnou soustavu mlčky bereme Zemi: silnici, dům, strom.' },
            { type: 'iconlist', items: [
              { icon: 'earth', title: 'Země kolem Slunce', text: 'I když sedíš, letíš s celou Zemí kolem Slunce rychlostí asi 30 km za sekundu.' },
              { icon: 'satellite', title: 'Družice nad rovníkem', text: 'Televizní družice obíhá tak, že je vůči Zemi pořád nad stejným místem – vzhledem k Zemi je v klidu.' },
              { icon: 'rocket', title: 'Tankování za letu', text: 'Stíhačka a tanker letí vedle sebe 800 km/h, ale vzhledem k sobě navzájem jsou v klidu. Jen tak se dá hadice napojit.' },
              { icon: 'ship', title: 'Na palubě lodi', text: 'Pro námořníka na palubě stojí stěžeň na místě, pro rybáře na břehu pluje spolu s lodí.' },
            ] },
            { type: 'callout', variant: 'mascot', text: 'Já teď sedím na lavici úplně v klidu. Teda… vzhledem k lavici. Vzhledem ke Slunci právě letím rychlostí 30 kilometrů za sekundu. Trochu se mi točí hlava.' },
            { type: 'check', question: { kind: 'tf', q: 'Cestující, který sedí ve vlaku, je v klidu vzhledem k vlaku, ale v pohybu vzhledem k nádraží.', answer: true, explain: 'Vůči vlaku svou polohu nemění, vůči nádraží ano. Klid a pohyb vždy posuzujeme vzhledem ke zvolené vztažné soustavě.' } },
          ],
        },
        {
          title: 'Trajektorie, dráha a posunutí',
          icon: 'ruler',
          blocks: [
            { type: 'p', text: 'Když se těleso pohybuje, opisuje nějakou čáru. Vidíš ji třeba jako stopu lyží ve sněhu nebo jako bílou čáru za letadlem na obloze.' },
            { type: 'keyterms', items: [
              { term: '**Trajektorie**', def: 'čára, kterou těleso při pohybu opisuje (stopa, cesta)' },
              { term: '**Dráha** s', def: 'délka trajektorie; jednotka metr (m). Během pohybu jen roste, nikdy neklesá.' },
              { term: '**Posunutí**', def: 'přímá úsečka od začátku do konce pohybu, i se směrem („vzdušnou čarou“)' },
            ] },
            { type: 'graph', x: { label: 'x', unit: 'm', min: 0, max: 400, step: 100 }, y: { label: 'y', unit: 'm', min: 0, max: 300, step: 100 }, series: [
              { label: 'trajektorie (cesta ulicemi)', points: [[0, 0], [400, 0], [400, 300]], tone: 'a' },
              { label: 'posunutí', points: [[0, 0], [400, 300]], style: 'dashed', tone: 'b' },
            ], marks: [{ x: 0, y: 0, label: 'domov' }, { x: 400, y: 300, label: 'škola' }], caption: 'Plánek cesty do školy. Ulicemi ujdeš dráhu 400 m + 300 m = 700 m. Posunutí (přerušovaná čára) měří jen 500 m.' },
            { type: 'example', title: 'Kolo na atletickém oválu', problem: 'Běžkyně uběhne přesně jedno kolo na 400m oválu a doběhne tam, kde startovala. Jaká je její dráha a jaké posunutí?', steps: [
              'Dráha je délka trajektorie: celé kolo měří 400 m.',
              'Posunutí je úsečka od startu k cíli. Start a cíl jsou na stejném místě, úsečka má délku 0 m.',
            ], answer: 'Dráha s = 400 m, posunutí 0 m.' },
            { type: 'callout', variant: 'remember', text: 'V této úrovni budeme počítat hlavně s **dráhou**. Posunutí a práce se směry (vektory) se vrátí podrobně v úrovni 8.' },
            { type: 'check', question: { kind: 'choice', q: 'Pes vyběhne z boudy, proběhne celou zahradu za míčkem a vrátí se zpátky do boudy. Co platí?', options: ['dráha je větší než nula, posunutí je nulové', 'dráha i posunutí jsou nulové', 'dráha je nulová, posunutí je větší než nula', 'dráha se rovná posunutí'], answer: 0, explain: 'Pes naběhal spoustu metrů, takže dráha je kladná. Skončil ale tam, kde začal, proto je posunutí nulové.' } },
          ],
        },
        {
          title: 'Druhy pohybů: rovnoměrný a nerovnoměrný',
          icon: 'clock',
          blocks: [
            { type: 'p', text: 'Pohyby můžeme třídit podle tvaru trajektorie. Když je trajektorie přímka, jde o pohyb **přímočarý**. Když je zakřivená, je pohyb **křivočarý**.' },
            { type: 'iconlist', items: [
              { icon: 'apple', title: 'Přímočarý', text: 'padající jablko, výtah, vlak na rovné trati' },
              { icon: 'fireworks', title: 'Křivočarý', text: 'hozený míč, raketa ohňostroje, auto v serpentinách' },
              { icon: 'orbit', title: 'Po kružnici', text: 'kolotoč, ventilek na kole, konec hodinové ručičky' },
              { icon: 'pendulum', title: 'Kmitavý (tam a zpět)', text: 'houpačka, kyvadlo hodin, struna kytary' },
            ] },
            { type: 'p', text: 'Podle rychlosti rozlišujeme pohyb **rovnoměrný** (za stejné časy urazí těleso stejné dráhy) a **nerovnoměrný** (dráhy za stejné časy se liší – těleso zrychluje nebo zpomaluje).' },
            { type: 'table', headers: ['čas t', 'dráha auta A', 'dráha auta B'], rows: [
              ['0 s', '0 m', '0 m'],
              ['1 s', '10 m', '2 m'],
              ['2 s', '20 m', '8 m'],
              ['3 s', '30 m', '18 m'],
              ['4 s', '40 m', '32 m'],
            ], caption: 'Auto A jede rovnoměrně: každou sekundu přesně 10 m. Auto B se rozjíždí: každou sekundu ujede víc než v té předchozí.' },
            { type: 'compare', columns: [
              { title: 'Rovnoměrný pohyb', icon: 'check', tone: 'a', points: ['stejné dráhy za stejné časy', 'rychlost se nemění', 'eskalátor, auto s tempomatem na dálnici'] },
              { title: 'Nerovnoměrný pohyb', icon: 'chart', tone: 'b', points: ['za stejné časy různé dráhy', 'rychlost se mění', 'rozjezd, brzdění, jízda městem, padající kámen'] },
            ] },
            { type: 'callout', variant: 'fact', text: 'Dokonale rovnoměrný pohyb v přírodě skoro nenajdeš. Většina pohybů je nerovnoměrná, ale na krátkém úseku je často můžeme za rovnoměrné považovat.' },
            { type: 'check', question: { kind: 'choice', q: 'Který pohyb je nejblíž rovnoměrnému přímočarému pohybu?', options: ['schod jedoucího eskalátoru', 'auto, které se na křižovatce rozjíždí', 'kámen padající ze skály', 'míč odražený od země'], answer: 0, explain: 'Eskalátor jede stále stejnou rychlostí po přímce. Rozjíždějící se auto a padající kámen zrychlují, míč mění rychlost i směr.' } },
          ],
        },
        {
          title: 'Rychlost: v = s / t',
          icon: 'speed',
          blocks: [
            { type: 'p', text: '**Rychlost** udává, jakou dráhu těleso urazí za jednotku času. Čím větší dráhu za stejný čas, tím je těleso rychlejší. U rovnoměrného pohybu je rychlost pořád stejná.' },
            { type: 'formula', text: 'v = s / t', caption: 'v … rychlost (m/s), s … dráha (m), t … čas (s)' },
            { type: 'example', title: 'Sprinter', problem: 'Sprinter uběhne 100 m za 12,5 s. Jakou má průměrnou rychlost?', steps: [
              's = 100 m, t = 12,5 s',
              'v = s / t = 100 m / 12,5 s',
            ], answer: 'v = 8 m/s' },
            { type: 'example', title: 'Hlemýžď', problem: 'Hlemýžď se za 1 minutu posune o 6 cm. Jaká je jeho rychlost v m/s?', steps: [
              'Převedeme na základní jednotky: s = 6 cm = 0,06 m, t = 1 min = 60 s.',
              'v = s / t = 0,06 m / 60 s = 0,001 m/s',
            ], answer: 'v = 0,001 m/s, tedy 1 milimetr za sekundu' },
            { type: 'iconlist', items: [
              { icon: 'muscle', title: 'Chodec', text: '1,4 m/s (5 km/h)' },
              { icon: 'arrow-cycle', title: 'Cyklista', text: '5 m/s (18 km/h)' },
              { icon: 'car', title: 'Auto v obci / na dálnici', text: '14 m/s (50 km/h) / 36 m/s (130 km/h)' },
              { icon: 'sound', title: 'Zvuk ve vzduchu', text: '340 m/s (1 224 km/h)' },
              { icon: 'satellite', title: 'Mezinárodní vesmírná stanice', text: '7 700 m/s (27 700 km/h) – oběhne Zemi za 92 minut' },
            ] },
            { type: 'p', text: 'Vztah můžeš otočit a dopočítat dráhu nebo čas: **s = v · t** a **t = s / v**.' },
            { type: 'example', title: 'Cesta pěšky', problem: 'Chodec jde rychlostí 1,5 m/s. Jakou dráhu ujde za 20 minut?', steps: [
              't = 20 min = 20 · 60 s = 1 200 s',
              's = v · t = 1,5 m/s · 1 200 s = 1 800 m',
            ], answer: 's = 1 800 m = 1,8 km' },
            { type: 'callout', variant: 'tip', title: 'Trojúhelník', text: 'Nakresli trojúhelník: nahoře s, dole vedle sebe v a t. Zakryj prstem, co hledáš: zbylá písmena ti řeknou vzorec (s nad t = dělení, v vedle t = násobení).' },
            { type: 'check', question: { kind: 'number', q: 'Cyklista ujel 3 000 m za 10 minut. Jakou jel průměrnou rychlostí v m/s?', answer: 5, tolerance: 0.05, unit: 'm/s', explain: 't = 10 min = 600 s, v = s / t = 3 000 m / 600 s = 5 m/s.' } },
          ],
        },
        {
          title: 'Převody km/h a m/s',
          icon: 'calculator',
          blocks: [
            { type: 'p', text: 'Tachometr v autě ukazuje km/h, fyzikální vzorce počítají v m/s. Převod je jednoduchý, když víš, odkud se bere číslo 3,6.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'ruler', title: '1 km = 1 000 m' },
              { icon: 'clock', title: '1 h = 3 600 s' },
              { icon: 'calculator', title: '1 km/h = 1 000 m / 3 600 s', text: '= 1/3,6 m/s ≈ 0,28 m/s' },
              { icon: 'speed', title: '1 m/s = 3,6 km/h' },
            ], caption: 'Odkud se bere převodní číslo 3,6' },
            { type: 'formula', text: 'km/h → m/s: vyděl 3,6   ·   m/s → km/h: vynásob 3,6', caption: 'Číslo v km/h je vždy 3,6krát větší než stejná rychlost v m/s.' },
            { type: 'example', title: 'Oběma směry', problem: 'a) Převeď 72 km/h na m/s. b) Převeď 15 m/s na km/h.', steps: [
              'a) 72 : 3,6 = 20',
              'b) 15 · 3,6 = 54',
            ], answer: 'a) 72 km/h = 20 m/s, b) 15 m/s = 54 km/h' },
            { type: 'callout', variant: 'warning', title: 'Kontrola rozumem', text: 'Když převádíš na km/h, musí ti vyjít **větší** číslo. Když ti z 20 m/s vyjde 5,6 km/h, dělil jsi místo násobení.' },
            { type: 'game', gameId: 'unit-convert', text: 'Procvič si převody km/h ↔ m/s na rychlost v mini-hře Převody jednotek.' },
            { type: 'check', question: { kind: 'number', q: 'Auto jede po okresní silnici rychlostí 90 km/h. Kolik je to m/s?', answer: 25, tolerance: 0.1, unit: 'm/s', explain: '90 : 3,6 = 25 m/s.' } },
          ],
        },
        {
          title: 'Průměrná rychlost',
          icon: 'clock',
          blocks: [
            { type: 'p', text: 'Autobus na školním výletě nejede pořád stejně: rozjíždí se, brzdí, stojí na pumpě. Pro celou cestu proto počítáme **průměrnou rychlost**: celkovou dráhu vydělíme celkovým časem, **včetně přestávek**.' },
            { type: 'formula', text: 'v_{p} = s_{celk} / t_{celk}', caption: 'průměrná rychlost = celková dráha / celkový čas' },
            { type: 'example', title: 'Školní výlet', problem: 'Autobus jel po dálnici 120 km za 1,5 h, pak 30 minut stál na odpočívadle a nakonec jel 40 km po okresce za 1 h. Jaká byla průměrná rychlost celé cesty?', steps: [
              's_{celk} = 120 km + 40 km = 160 km',
              't_{celk} = 1,5 h + 0,5 h + 1 h = 3 h',
              'v_{p} = 160 km / 3 h ≈ 53,3 km/h',
            ], answer: 'v_{p} ≈ 53 km/h' },
            { type: 'graph', x: { label: 't', unit: 'h', min: 0, max: 3, step: 0.5 }, y: { label: 's', unit: 'km', min: 0, max: 160, step: 40 }, series: [
              { label: 'skutečná jízda', points: [[0, 0], [1.5, 120], [2, 120], [3, 160]], tone: 'a' },
              { label: 'průměrná rychlost', points: [[0, 0], [3, 160]], style: 'dashed', tone: 'b' },
            ], marks: [{ x: 1.75, y: 120, label: 'přestávka' }], caption: 'Graf dráhy výletu. Přerušovaná přímka ukazuje, jak by jel autobus, kdyby jel celou dobu stejně – průměrnou rychlostí. Grafy pohybu si podrobně ukážeme v další lekci.' },
            { type: 'callout', variant: 'warning', title: 'Průměrná rychlost není průměr rychlostí', text: 'Auto jede 120 km tam rychlostí 60 km/h (2 h) a zpátky rychlostí 40 km/h (3 h). Průměrná rychlost je 240 km / 5 h = **48 km/h**, ne 50 km/h. Pomalejší úsek trval déle, a proto „váží“ víc.' },
            { type: 'callout', variant: 'fact', text: 'Úsekové měření rychlosti na silnicích počítá právě průměrnou rychlost: zná délku úseku a změří, jak dlouho ti trval.' },
            { type: 'check', question: { kind: 'number', q: 'Turista ušel 12 km za 2 h, pak hodinu odpočíval a nakonec ušel ještě 6 km za 1 h. Jaká byla jeho průměrná rychlost v km/h?', answer: 4.5, tolerance: 0.05, unit: 'km/h', explain: 's = 12 + 6 = 18 km, t = 2 + 1 + 1 = 4 h (přestávka se počítá). v_{p} = 18 km / 4 h = 4,5 km/h.' } },
          ],
        },
      ],
      summary: [
        'Klid a pohyb jsou relativní: vždy záleží na vztažné soustavě, vůči které pohyb posuzujeme.',
        'Trajektorie je čára, kterou těleso opisuje, dráha je její délka a posunutí je přímá úsečka od začátku ke konci.',
        'Při rovnoměrném pohybu urazí těleso za stejné časy stejné dráhy, při nerovnoměrném se rychlost mění.',
        'Rychlost spočítáš jako v = s / t, dráhu jako s = v · t a čas jako t = s / v.',
        'Rychlost v m/s převedeš na km/h vynásobením číslem 3,6, opačně dělíš.',
        'Průměrná rychlost je celková dráha dělená celkovým časem včetně přestávek, ne průměr jednotlivých rychlostí.',
      ],
      quiz: [
        { kind: 'tf', q: 'Rychlost 10 m/s je větší než rychlost 30 km/h.', answer: true, explain: '10 m/s = 10 · 3,6 = 36 km/h, a to je víc než 30 km/h.' },
        { kind: 'choice', q: 'Vzhledem k čemu je pilot letícího letadla v klidu?', options: ['vzhledem ke kabině letadla', 'vzhledem k letišti', 'vzhledem k mrakům', 'vzhledem ke Slunci'], answer: 0, explain: 'Pilot sedí v kabině a svou polohu vůči ní nemění. Vůči letišti, mrakům i Slunci se pohybuje.' },
        { kind: 'match', q: 'Přiřaď pojmy k jejich popisu.', pairs: [
          ['trajektorie', 'čára, kterou těleso opisuje'],
          ['dráha', 'délka trajektorie'],
          ['posunutí', 'úsečka od začátku ke konci pohybu'],
          ['rychlost', 'dráha uražená za jednotku času'],
        ], explain: 'Trajektorie je samotná čára, dráha je její délka, posunutí je nejkratší spojnice začátku a konce, rychlost říká, jak rychle dráha přibývá.' },
        { kind: 'number', q: 'Kolik je 54 km/h v m/s?', answer: 15, tolerance: 0.1, unit: 'm/s', explain: '54 : 3,6 = 15 m/s.' },
        { kind: 'order', q: 'Seřaď od nejpomalejšího po nejrychlejší.', items: ['hlemýžď', 'chodec', 'cyklista', 'auto na dálnici', 'zvuk ve vzduchu'], explain: 'Hlemýžď asi 1 mm/s, chodec 1,4 m/s, cyklista 5 m/s, auto na dálnici 36 m/s, zvuk 340 m/s.' },
        { kind: 'number', q: 'Vlak jede stálou rychlostí 30 m/s. Kolik kilometrů ujede za 10 minut?', answer: 18, tolerance: 0.1, unit: 'km', explain: 't = 10 min = 600 s, s = v · t = 30 m/s · 600 s = 18 000 m = 18 km.' },
        { kind: 'number', q: 'Do školy je to 2,4 km. Jdeš rychlostí 1,6 m/s. Za kolik minut tam budeš?', answer: 25, tolerance: 0.2, unit: 'min', explain: 's = 2 400 m, t = s / v = 2 400 m / 1,6 m/s = 1 500 s = 25 min.' },
        { kind: 'choice', q: 'Cyklista jede 10 km do kopce rychlostí 10 km/h a pak stejných 10 km z kopce rychlostí 30 km/h. Jaká je jeho průměrná rychlost?', options: ['15 km/h', '20 km/h', '40 km/h', '10 km/h'], answer: 0, explain: 'Do kopce jede 1 h, z kopce 1/3 h. Celkem 20 km za 4/3 h, tedy 20 : 4/3 = 15 km/h. Pomalý úsek trvá déle, proto to není 20 km/h.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-2
    'f2-2': {
      id: 'f2-2',
      title: 'Grafy pohybu',
      goals: [
        'Vyčíst z grafu dráhy s–t dráhu, čas a rychlost (ze sklonu přímky)',
        'Poznat z grafu rychlosti v–t, jestli těleso jede stálou rychlostí, zrychluje, nebo brzdí',
        'Spočítat dráhu jako plochu pod grafem v–t',
        'Vysvětlit, co je zrychlení, a spočítat ho ze změny rychlosti',
      ],
      hook: 'Aplikace na běhání ti po tréninku ukáže křivky. Poznáš z nich, kdy jsi sprintoval a kdy jsi stál na semaforu? Graf je příběh bez slov – naučím tě ho číst.',
      sections: [
        {
          title: 'Graf dráhy s–t',
          icon: 'chart',
          blocks: [
            { type: 'p', text: 'Pohyb můžeš zapsat do tabulky, ale v grafu ho uvidíš na první pohled. Na vodorovnou osu dáváme **čas t**, na svislou osu **dráhu s**. Každý bod grafu říká: v tomto čase mělo těleso ujeto tolik metrů.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 1 }, y: { label: 's', unit: 'm', min: 0, max: 60, step: 10 }, series: [
              { label: 'cyklista', points: [[0, 0], [2, 10], [4, 20], [6, 30], [8, 40], [10, 50]] },
            ], marks: [{ x: 6, y: 30, label: 'po 6 s: 30 m' }], caption: 'Cyklista jede rovnoměrně: za každé 2 s ujede 10 m. Graf je přímka vycházející z počátku.' },
            { type: 'callout', variant: 'tip', text: 'U každého grafu si nejdřív přečti, co je na osách a v jakých jednotkách. Čas může být v sekundách, minutách i hodinách, dráha v metrech i kilometrech.' },
            { type: 'callout', variant: 'remember', text: '==Rovnoměrný pohyb má v grafu s–t podobu přímky.== Když je graf zakřivený, rychlost se mění.' },
            { type: 'example', title: 'Čteme z grafu', problem: 'Kolik metrů ujel cyklista z grafu za 8 s a jakou jel rychlostí?', steps: [
              'Najdi na ose t hodnotu 8 s, jdi svisle nahoru k přímce a pak vodorovně k ose s: 40 m.',
              'v = s / t = 40 m / 8 s',
            ], answer: 'Za 8 s ujel 40 m, jeho rychlost je 5 m/s.' },
            { type: 'check', question: { kind: 'number', q: 'Podle grafu cyklisty: za kolik sekund ujede 25 m?', answer: 5, tolerance: 0.1, unit: 's', explain: 'Cyklista jede 5 m/s, takže 25 m ujede za t = s / v = 25 m / 5 m/s = 5 s. V grafu: od 25 m na ose s vodorovně k přímce a svisle dolů na 5 s.' } },
          ],
        },
        {
          title: 'Sklon grafu je rychlost',
          icon: 'speed',
          blocks: [
            { type: 'p', text: 'Porovnej tři pohyby v jednom grafu. Čím je přímka **strmější**, tím víc metrů přibude za každou sekundu – tím je těleso **rychlejší**. Vodorovná čára znamená, že dráha nepřibývá: těleso **stojí**.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 's', unit: 'm', min: 0, max: 80, step: 20 }, series: [
              { label: 'běžec', points: [[0, 0], [10, 80]], tone: 'a' },
              { label: 'chodec', points: [[0, 0], [10, 15]], tone: 'b' },
              { label: 'autobus na zastávce', points: [[0, 40], [10, 40]], tone: 'c' },
            ], marks: [{ x: 5, y: 40, label: 'vodorovně = stojí' }], caption: 'Běžec (strmá přímka) je rychlejší než chodec (mírná přímka). Autobus už ujel 40 m a teď stojí na zastávce – jeho dráha nepřibývá.' },
            { type: 'example', title: 'Rychlost ze sklonu', problem: 'Spočítej z grafu rychlost běžce a chodce.', steps: [
              'Vezmi dva body na přímce a spočítej, kolik metrů přibylo a za kolik sekund.',
              'Běžec: za 10 s přibylo 80 m, v = 80 m / 10 s = 8 m/s.',
              'Chodec: za 10 s přibylo 15 m, v = 15 m / 10 s = 1,5 m/s.',
            ], answer: 'Běžec 8 m/s, chodec 1,5 m/s. Strmější přímka = větší rychlost.' },
            { type: 'callout', variant: 'tip', text: 'Sklon přímky si představ jako otázku: „O kolik metrů graf vystoupá za jednu sekundu?“ Odpověď je rychlost v m/s.' },
            { type: 'check', question: { kind: 'choice', q: 'Graf s–t je v určitém úseku vodorovná čára. Co to znamená?', options: ['těleso v tom úseku stojí', 'těleso jede stálou rychlostí', 'těleso zrychluje', 'těleso jede svou největší rychlostí'], answer: 0, explain: 'Když je graf dráhy vodorovný, dráha s časem nepřibývá – těleso se nepohybuje.' } },
          ],
        },
        {
          title: 'Příběh ukrytý v grafu',
          icon: 'book',
          blocks: [
            { type: 'p', text: 'Pavla jde pěšky do pekárny, chvíli tam nakupuje a pak běží domů, protože začalo pršet. Takhle vypadá její graf dráhy:' },
            { type: 'graph', x: { label: 't', unit: 'min', min: 0, max: 14, step: 2 }, y: { label: 's', unit: 'm', min: 0, max: 800, step: 200 }, series: [
              { label: 'dráha Pavly', points: [[0, 0], [5, 400], [10, 400], [13, 800]] },
            ], marks: [{ x: 2.5, y: 200, label: 'chůze' }, { x: 7.5, y: 400, label: 'v pekárně' }, { x: 11.5, y: 600, label: 'běh domů' }], caption: 'Tři úseky, tři části příběhu. Běh domů je strmější než chůze: 400 m za 3 minuty místo za 5 minut.' },
            { type: 'list', items: [
              'Mírně stoupající přímka: jde pomalu (400 m za 5 min, asi 1,3 m/s).',
              'Vodorovná čára: stojí v pekárně 5 minut.',
              'Strmější přímka: běží rychleji (400 m za 3 min, asi 2,2 m/s).',
            ] },
            { type: 'callout', variant: 'warning', title: 'Přečti si osy!', text: 'Graf **dráhy** nikdy neklesá – i cesta zpátky dráhu přidává. Kdyby na svislé ose byla **vzdálenost od domova**, cesta domů by šla dolů. A pozor: graf není obrázek krajiny. Stoupající čára neznamená kopec.' },
            { type: 'graph', x: { label: 't', unit: 'min', min: 0, max: 14, step: 2 }, y: { label: 'vzdálenost od domova', unit: 'm', min: 0, max: 400, step: 100 }, series: [
              { label: 'vzdálenost Pavly od domova', points: [[0, 0], [5, 400], [10, 400], [13, 0]], tone: 'b' },
            ], caption: 'Stejná procházka, jiný graf: tady je na svislé ose vzdálenost od domova, proto při běhu domů klesá k nule.' },
            { type: 'callout', variant: 'mascot', text: 'Když jsem poprvé viděl stoupající graf, myslel jsem, že Pavla leze na kopec. Pak mi došlo, že graf není fotka – je to záznam, jak přibývají metry.' },
            { type: 'check', question: { kind: 'choice', q: 'Graf s–t má dva úseky: nejdřív mírně stoupající přímku, potom strmější přímku. Jaký příběh popisuje?', options: ['těleso se nejdřív pohybovalo pomalu, pak rychleji', 'těleso nejdřív jelo rychle, pak zpomalilo', 'těleso nejdřív stálo, pak se rozjelo', 'těleso jelo nejdřív do mírného kopce, pak do prudkého'], answer: 0, explain: 'Strmější přímka v grafu s–t znamená větší rychlost. Graf není obrázek terénu, takže o kopcích nic neříká.' } },
          ],
        },
        {
          title: 'Graf rychlosti v–t',
          icon: 'gauge',
          blocks: [
            { type: 'p', text: 'Na svislou osu teď dáme **rychlost v** místo dráhy. Pozor: stejné tvary tu znamenají něco jiného! Graf rychlosti ukazuje, co by v každém okamžiku ukazoval tachometr.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 'v', unit: 'm/s', min: 0, max: 20, step: 5 }, series: [
              { label: 'stálá rychlost', points: [[0, 10], [10, 10]], tone: 'a' },
              { label: 'rozjíždí se', points: [[0, 0], [10, 20]], tone: 'b' },
              { label: 'brzdí', points: [[0, 20], [10, 0]], tone: 'c' },
            ], caption: 'Tři auta za 10 sekund: jedno jede stále 10 m/s, druhé se rozjíždí z klidu na 20 m/s, třetí brzdí z 20 m/s až do zastavení.' },
            { type: 'compare', columns: [
              { title: 'Vodorovná čára', icon: 'check', tone: 'a', points: ['rychlost se nemění', '**rovnoměrný** pohyb', 'tempomat na dálnici'] },
              { title: 'Stoupající čára', icon: 'rocket', tone: 'b', points: ['rychlost roste', '**zrychlený** pohyb', 'rozjezd od semaforu'] },
              { title: 'Klesající čára', icon: 'warning', tone: 'c', points: ['rychlost klesá', '**zpomalený** pohyb', 'brzdění před přechodem'] },
            ] },
            { type: 'example', title: 'Čteme graf rychlosti', problem: 'Podle grafu: jakou rychlost má rozjíždějící se auto v čase 5 s a kdy jede stejně rychle jako auto se stálou rychlostí?', steps: [
              'Na ose t najdi 5 s, jdi nahoru k čáře „rozjíždí se“ a vodorovně k ose v: 10 m/s.',
              'Čára „stálá rychlost“ leží ve výšce 10 m/s. Obě čáry se protínají právě v čase 5 s.',
            ], answer: 'V čase 5 s jede rozjíždějící se auto 10 m/s – stejně rychle jako auto s tempomatem. Pak už je rychlejší.' },
            { type: 'callout', variant: 'warning', text: 'Vodorovná čára v grafu **v–t** neznamená, že těleso stojí! Jede stálou rychlostí. Stojí jen tehdy, když graf leží přímo na ose t, tedy v = 0.' },
            { type: 'check', question: { kind: 'tf', q: 'Vodorovná čára v grafu v–t ve výšce 5 m/s znamená, že těleso stojí.', answer: false, explain: 'V grafu v–t znamená vodorovná čára stálou rychlost, tady 5 m/s. Těleso stojí jen při v = 0, tedy když graf leží na ose t.' } },
          ],
        },
        {
          title: 'Plocha pod grafem v–t je dráha',
          icon: 'ruler',
          blocks: [
            { type: 'p', text: 'Z grafu rychlosti umíš spočítat i dráhu. Při stálé rychlosti platí s = v · t. A součin v · t je přesně **plocha obdélníku** pod grafem!' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 'v', unit: 'm/s', min: 0, max: 25, step: 5 }, series: [
              { label: 'auto 20 m/s', points: [[0, 20], [10, 20]], area: true },
            ], marks: [{ x: 5, y: 10, label: 's = 20 m/s · 10 s = 200 m' }], caption: 'Obdélník pod grafem: výška 20 m/s, šířka 10 s. Jeho plocha je dráha 200 m.' },
            { type: 'example', title: 'Plocha obdélníku', problem: 'Auto jede 10 s stálou rychlostí 20 m/s. Jakou urazí dráhu?', steps: [
              'Plocha obdélníku = výška · šířka = v · t',
              's = 20 m/s · 10 s = 200 m',
            ], answer: 's = 200 m' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 'v', unit: 'm/s', min: 0, max: 25, step: 5 }, series: [
              { label: 'rozjezd', points: [[0, 0], [10, 20]], area: true, tone: 'b' },
            ], marks: [{ x: 7, y: 6, label: 's = ½ · 10 s · 20 m/s = 100 m' }], caption: 'Při rovnoměrném rozjezdu z klidu je pod grafem trojúhelník. Jeho plocha je polovina obdélníku.' },
            { type: 'example', title: 'Plocha trojúhelníku', problem: 'Auto se rovnoměrně rozjíždí z klidu a za 10 s dosáhne rychlosti 20 m/s. Jakou dráhu přitom ujede?', steps: [
              'Pod grafem je pravoúhlý trojúhelník se základnou 10 s a výškou 20 m/s.',
              's = ½ · 10 s · 20 m/s = 100 m',
            ], answer: 's = 100 m – polovina toho, co by ujelo stálou rychlostí 20 m/s.' },
            { type: 'callout', variant: 'tip', text: 'Plochu složitějšího grafu rozděl na obdélníky a trojúhelníky, spočítej každý kousek a sečti je.' },
            { type: 'check', question: { kind: 'number', q: 'Moped se rovnoměrně rozjíždí z klidu na 10 m/s za 6 s a pak jede 4 s stálou rychlostí 10 m/s. Jakou dráhu celkem ujede?', answer: 70, tolerance: 0.5, unit: 'm', explain: 'Trojúhelník: ½ · 6 s · 10 m/s = 30 m. Obdélník: 10 m/s · 4 s = 40 m. Celkem 70 m.' } },
          ],
        },
        {
          title: 'Zrychlení: o kolik roste rychlost za sekundu',
          icon: 'car',
          blocks: [
            { type: 'p', text: 'Když se rychlost mění, chceme vědět, **jak rychle** se mění. Tuto veličinu nazýváme **zrychlení** a. Udává, o kolik m/s vzroste rychlost za každou sekundu.' },
            { type: 'formula', text: 'a = Δv / t', caption: 'a … zrychlení (m/s²), Δv … změna rychlosti (m/s), t … doba, za kterou se rychlost změnila (s); Δ (delta) znamená „změna“' },
            { type: 'p', text: 'Jednotka m/s² se čte „metr za sekundu na druhou“. Znamená „metr za sekundu – každou sekundu“: zrychlení 3 m/s² říká, že rychlost vzroste každou sekundu o 3 m/s.' },
            { type: 'example', title: 'Rozjezd auta', problem: 'Auto zrychlí z 0 na 108 km/h za 10 s. Jaké je jeho zrychlení?', steps: [
              'Převod: 108 km/h = 108 : 3,6 = 30 m/s',
              'Δv = 30 m/s − 0 m/s = 30 m/s',
              'a = Δv / t = 30 m/s / 10 s',
            ], answer: 'a = 3 m/s² – rychlost roste každou sekundu o 3 m/s.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 'v', unit: 'm/s', min: 0, max: 35, step: 5 }, series: [
              { label: 'sportovní auto', points: [[0, 0], [5, 30], [10, 30]], tone: 'a' },
              { label: 'rodinné auto', points: [[0, 0], [10, 30]], tone: 'b' },
            ], marks: [{ x: 5, y: 30, label: 'a = 6 m/s²' }], caption: 'Obě auta dosáhnou 30 m/s. Sportovní auto za 5 s, rodinné za 10 s. ==Strmější graf v–t = větší zrychlení.==' },
            { type: 'example', title: 'Brzdění', problem: 'Cyklista jede 8 m/s a zabrzdí do zastavení za 4 s. Jaké je jeho zrychlení?', steps: [
              'Δv = 0 m/s − 8 m/s = −8 m/s (rychlost klesla)',
              'a = Δv / t = −8 m/s / 4 s = −2 m/s²',
            ], answer: 'a = −2 m/s². Záporné zrychlení znamená zpomalování; říkáme také, že zpomalení je 2 m/s².' },
            { type: 'callout', variant: 'fact', text: 'Padající kámen zrychluje asi o 10 m/s každou sekundu (přesněji 9,81 m/s²). Po 3 sekundách volného pádu už letí asi 30 m/s. Volný pád podrobně probereme v úrovni 8.' },
            { type: 'game', gameId: 'motion-graph', text: 'Přiřaď příběhy ke grafům s–t a v–t v mini-hře Graf pohybu.' },
            { type: 'check', question: { kind: 'number', q: 'Skateboardista zrychlí z 2 m/s na 8 m/s za 3 s. Jaké je jeho zrychlení?', answer: 2, tolerance: 0.05, unit: 'm/s²', explain: 'Δv = 8 m/s − 2 m/s = 6 m/s, a = Δv / t = 6 m/s / 3 s = 2 m/s².' } },
          ],
        },
      ],
      summary: [
        'V grafu s–t je rovnoměrný pohyb přímka a její sklon udává rychlost: čím strmější, tím rychlejší.',
        'Vodorovná čára v grafu s–t znamená, že těleso stojí; graf dráhy nikdy neklesá.',
        'V grafu v–t znamená vodorovná čára stálou rychlost, stoupající čára zrychlování a klesající brzdění.',
        'Plocha pod grafem v–t je uražená dráha; složitý graf rozdělíš na obdélníky a trojúhelníky.',
        'Zrychlení a = Δv / t udává, o kolik m/s se změní rychlost za sekundu, jednotka je m/s².',
        'Než začneš graf číst, vždy se podívej, jaké veličiny jsou na osách.',
      ],
      quiz: [
        { kind: 'tf', q: 'Graf dráhy s–t může klesat, když se těleso vrací zpět domů.', answer: false, explain: 'Dráha při pohybu jen přibývá, ať jdeš kamkoli. Klesat může graf vzdálenosti od domova, ne graf dráhy.' },
        { kind: 'choice', q: 'Co udává plocha pod grafem v–t?', options: ['uraženou dráhu', 'rychlost', 'zrychlení', 'celkový čas'], answer: 0, explain: 'Plocha obdélníku pod grafem je v · t, a to je dráha s.' },
        { kind: 'match', q: 'Přiřaď tvar grafu k pohybu.', pairs: [
          ['s–t: vodorovná čára', 'těleso stojí'],
          ['s–t: stoupající přímka', 'rovnoměrný pohyb'],
          ['v–t: stoupající přímka', 'zrychlený pohyb'],
          ['v–t: klesající přímka', 'zpomalený pohyb'],
        ], explain: 'U grafu s–t sleduj, jestli přibývá dráha. U grafu v–t sleduj, jestli roste nebo klesá rychlost.' },
        { kind: 'number', q: 'Přímka v grafu s–t prochází body (0 s; 0 m) a (4 s; 36 m). Jakou rychlostí se těleso pohybuje?', answer: 9, tolerance: 0.05, unit: 'm/s', explain: 'Za 4 s přibylo 36 m, v = 36 m / 4 s = 9 m/s.' },
        { kind: 'number', q: 'Tramvaj jede 50 s stálou rychlostí 12 m/s. Jakou dráhu ujede?', answer: 600, tolerance: 1, unit: 'm', explain: 'Plocha obdélníku pod grafem v–t: s = 12 m/s · 50 s = 600 m.' },
        { kind: 'multi', q: 'Které grafy popisují těleso, které stojí?', options: ['s–t: vodorovná čára', 'v–t: čára ležící na ose t (v = 0)', 'v–t: vodorovná čára ve výšce 5 m/s', 's–t: stoupající přímka', 'v–t: klesající přímka'], answers: [0, 1], explain: 'Stojí těleso, jehož dráha nepřibývá (vodorovná čára v s–t) nebo jehož rychlost je nulová (graf v–t na ose t).' },
        { kind: 'number', q: 'Vlak rovnoměrně brzdí z rychlosti 20 m/s a zastaví za 40 s. Jaká je jeho brzdná dráha?', answer: 400, tolerance: 2, unit: 'm', explain: 'Pod grafem v–t je trojúhelník: s = ½ · 40 s · 20 m/s = 400 m.' },
        { kind: 'choice', q: 'Auto A zrychlí z 0 na 20 m/s za 4 s, auto B z 0 na 30 m/s za 10 s. Které má větší zrychlení?', options: ['auto A (5 m/s²)', 'auto B (3 m/s²)', 'obě mají stejné zrychlení', 'auto B, protože dosáhne vyšší rychlosti'], answer: 0, explain: 'A: 20 / 4 = 5 m/s², B: 30 / 10 = 3 m/s². Zrychlení neříká, jak rychle těleso jede, ale jak rychle se jeho rychlost mění.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-3
    'f2-3': {
      id: 'f2-3',
      title: 'Síla a její měření',
      goals: [
        'Popsat sílu jako vzájemné působení dvou těles a rozlišit její pohybové a deformační účinky',
        'Změřit sílu siloměrem a vyjádřit ji v newtonech',
        'Spočítat tíhovou sílu F_{G} = m · g na Zemi i na Měsíci a odlišit ji od hmotnosti',
        'Znázornit sílu šipkou a rozhodnout podle těžiště, jestli se těleso převrhne',
      ],
      hook: 'Zatlač dlaní do zdi. Zeď se nehne, ale cítíš, že tlačí zpátky na tebe. Síla nikdy nežije sama – vždycky na ní mají podíl dvě tělesa.',
      sections: [
        {
          title: 'Síla je vzájemné působení',
          icon: 'magnet',
          blocks: [
            { type: 'p', text: 'Když kopneš do míče, působíš na něj **silou**. Míč ale současně působí na tvou nohu – proto kopnutí cítíš. ==Síla je vždy projevem vzájemného působení dvou těles.== Jedno těleso působí na druhé a druhé zpátky na první.' },
            { type: 'p', text: 'Kopnutí je ale jen jeden ze způsobů, jak na sebe tělesa působí. Když se rozhlédneš kolem sebe, najdeš dvě velké skupiny: tělesa, která se musí dotknout, a tělesa, která na sebe působí, i když je od sebe dělí vzduch nebo prázdný prostor.' },
            { type: 'compare', columns: [
              { title: 'Působení při dotyku', icon: 'muscle', tone: 'a', points: ['noha kopne do míče', 'tlačíš nákupní vozík', 'lano táhne vlek', 'podlaha brzdí klouzající ponožku (tření)'] },
              { title: 'Působení na dálku (silovým polem)', icon: 'magnet', tone: 'b', points: ['Země přitahuje jablko – **gravitační pole**', 'magnet přitahuje sponku – **magnetické pole**', 'zelektrizovaný balonek přitahuje vlasy – **elektrické pole**'] },
            ], caption: 'Tělesa na sebe mohou působit dotykem, nebo na dálku prostřednictvím pole.' },
            { type: 'p', text: 'Ať jde o dotyk, nebo o pole, každá síla má vždy dva aktéry. Proto se vyplatí ptát se pokaždé stejně:' },
            { type: 'callout', variant: 'remember', text: 'U každé síly se zeptej: **kdo** působí a **na koho**? Když nedokážeš najít těleso, které silou působí, taková síla nejspíš neexistuje.' },
            { type: 'p', text: 'U kopnutí do míče je to jasné. Zkusme ale situaci, kde druhé těleso není hned vidět: zvedáš ze země tašku s nákupem.' },
            { type: 'example', title: 'Kdo na koho?', problem: 'Popiš síly, když zvedáš ze země tašku s nákupem.', steps: [
              'Ruka působí na tašku silou nahoru – a taška táhne ruku dolů (cítíš to v prstech).',
              'Země přitahuje tašku dolů – a taška přitahuje Zemi nahoru (tak slabě, že Země se nepohne).',
            ], answer: 'Každá síla má svůj pár: tělesa působí vždy vzájemně. Víc o tom v lekci o Newtonových zákonech.' },
            { type: 'callout', variant: 'mascot', text: 'Magnet a sponka se nedotýkají, a přesto se přitahují. Připadá mi to jako kouzlo, ale fyzici tomu klidně říkají „pole“.' },
            { type: 'p', text: 'Teď už víme, **co** síla je. Jenže sílu nevidíme – tak podle čeho ji vlastně poznáme?' },
            { type: 'check', question: { kind: 'tf', q: 'Síla může působit jen tehdy, když se tělesa navzájem dotýkají.', answer: false, explain: 'Gravitační, magnetická a elektrická síla působí i na dálku, prostřednictvím pole. Země přitahuje i padající jablko, které se jí zatím nedotýká.' } },
          ],
        },
        {
          title: 'Co síla dokáže: účinky síly',
          icon: 'vector',
          blocks: [
            { type: 'p', text: 'Sílu nevidíme, poznáme ji podle jejích **účinků**. Síla může změnit pohyb tělesa (**pohybový účinek**), nebo změnit jeho tvar (**deformační účinek**).' },
            { type: 'p', text: 'Podívej se na pár běžných situací. Ve všech působí síla, ale pokaždé dělá něco trochu jiného:' },
            { type: 'iconlist', items: [
              { icon: 'rocket', title: 'Uvede těleso do pohybu', text: 'kopnutí do míče, start rakety' },
              { icon: 'car', title: 'Zpomalí nebo zastaví', text: 'brzdy auta, brankář chytí míč' },
              { icon: 'speed', title: 'Zrychlí', text: 'cyklista šlape do pedálů' },
              { icon: 'orbit', title: 'Změní směr pohybu', text: 'hlavička, zatáčení na kole' },
              { icon: 'spring', title: 'Pružná deformace', text: 'trampolína, pružina, luk – po odstranění síly se vrátí do původního tvaru' },
              { icon: 'explosion', title: 'Trvalá (plastická) deformace', text: 'zmačkaná plechovka, plastelína, promáčklý blatník' },
            ] },
            { type: 'p', text: 'Fyzici si síly kreslí šipkami: šipka ukazuje, kam síla táhne, a čím je delší, tím je síla větší. Takhle vypadá okamžik kopnutí:' },
            { type: 'forces', body: 'ball', surface: 'none', forces: [
              { label: 'F (noha na míč)', angle: 30, size: 4 },
              { label: 'F_{G}', angle: 270, size: 1 },
            ], caption: 'V okamžiku kopnutí působí na míč velká síla od nohy šikmo nahoru a malá tíhová síla dolů. Míč se rozletí a na chvíli se i trochu zdeformuje.' },
            { type: 'p', text: 'Často nastanou oba účinky zároveň. Tenisový míček se při úderu nejen rozletí, ale na zlomek sekundy se i zploští. A právě pružná deformace nám v dalším oddílu pomůže sílu změřit.' },
            { type: 'check', question: { kind: 'multi', q: 'Ve kterých situacích vidíš pohybový účinek síly?', options: ['brankář chytí letící míč', 'vítr ohne větev a ta se pak narovná', 'hráč hlavičkou změní směr míče', 'zmačkání prázdné plechovky', 'cyklista šlape a zrychluje'], answers: [0, 2, 4], explain: 'Zastavení, změna směru a zrychlení jsou změny pohybu. Ohnutá větev a zmačkaná plechovka ukazují deformační účinek.' } },
          ],
        },
        {
          title: 'Měříme sílu: siloměr a newton',
          icon: 'spring',
          blocks: [
            { type: 'p', text: 'Jednotkou síly je **newton** (N), pojmenovaný po Isaacu Newtonovi. Pro představu: ==síla 1 N je zhruba tíha tabulky čokolády o hmotnosti 100 g.==' },
            { type: 'p', text: 'Jak ale sílu změřit? Využijeme pružnou deformaci z minulého oddílu: pružina se pod silou natáhne, a když sílu povolíš, vrátí se zpátky. Stačí tedy měřit, o kolik se natáhla.' },
            { type: 'diagram', id: 'measuring-instruments', caption: 'Siloměr mezi dalšími měřidly: uvnitř je pružina, která se natahuje tím víc, čím větší silou za háček táhneš.' },
            { type: 'p', text: '**Siloměr** využívá pružnou deformaci pružiny. Dvakrát větší síla ji natáhne dvakrát víc, trojnásobná síla třikrát víc. Prodloužení pružiny je **přímo úměrné** síle, a proto může mít siloměr rovnoměrnou stupnici.' },
            { type: 'p', text: 'Že to opravdu platí, ověříš jednoduchým pokusem: na pružinu postupně věšej závaží, pokaždé změř prodloužení a body vynes do grafu.' },
            { type: 'graph', x: { label: 'F', unit: 'N', min: 0, max: 5, step: 1 }, y: { label: 'prodloužení', unit: 'cm', min: 0, max: 10, step: 2 }, series: [
              { label: 'pružina siloměru', points: [[0, 0], [5, 10]], tone: 'a' },
              { label: 'naměřeno', points: [[1, 2.1], [2, 3.9], [3, 6.1], [4, 7.9], [5, 10]], style: 'dots', tone: 'b' },
            ], marks: [{ x: 3, y: 6, label: '3 N → 6 cm' }], caption: 'Měření s pružinou: každý newton ji prodlouží asi o 2 cm. Body leží na přímce – prodloužení je úměrné síle.' },
            { type: 'p', text: 'Když víme, o kolik se pružina natáhne na každý newton, umíme to i obráceně: z prodloužení zjistíme sílu.' },
            { type: 'example', title: 'Čteme pružinu', problem: 'Pružina z grafu se prodlužuje o 2 cm na každý 1 N. Zavěsíme na ni závaží a prodlouží se o 7 cm. Jak velkou silou závaží táhne?', steps: [
              '1 N ↔ 2 cm, tedy 1 cm ↔ 0,5 N',
              'F = 7 · 0,5 N = 3,5 N',
            ], answer: 'F = 3,5 N' },
            { type: 'p', text: 'Kolik je vlastně jeden newton? Abys pro síly získal/a cit, tady je pár orientačních hodnot – od jablka až po raketu:' },
            { type: 'table', headers: ['situace', 'přibližná síla'], rows: [
              ['tíha jablka', '1 N'],
              ['stisk ruky dospělého', '400 N'],
              ['tíha dospělého člověka', '700 N'],
              ['tah motoru rozjíždějícího se auta', '3 000 N'],
              ['tah motorů rakety Saturn V', '35 000 000 N'],
            ], caption: 'Jak velké bývají síly' },
            { type: 'callout', variant: 'tip', text: 'Vyber siloměr se správným rozsahem. Když ho přetížíš, pružina se trvale deformuje a siloměr pak ukazuje špatně.' },
            { type: 'check', question: { kind: 'number', q: 'Pružina siloměru se prodlouží o 1,5 cm na každý 1 N. Jakou sílu siloměr ukazuje, když je pružina prodloužená o 6 cm?', answer: 4, tolerance: 0.05, unit: 'N', explain: '6 cm : 1,5 cm = 4, síla je tedy 4 · 1 N = 4 N.' } },
          ],
        },
        {
          title: 'Tíhová síla: F_{G} = m · g',
          icon: 'earth',
          blocks: [
            { type: 'p', text: 'Země přitahuje každé těleso na svém povrchu. Síla, kterou Země působí na těleso, se nazývá **tíhová síla** F_{G}. Míří svisle dolů a je tím větší, čím větší je hmotnost tělesa.' },
            { type: 'p', text: 'O kolik větší? Na Zemi připadá na každý kilogram hmotnosti tíhová síla asi 10 N (přesněji 9,81 N). Stačí tedy hmotnost vynásobit tímto číslem:' },
            { type: 'formula', text: 'F_{G} = m · g', caption: 'F_{G} … tíhová síla (N), m … hmotnost (kg), g … tíhové zrychlení; na Zemi g ≈ 9,81 N/kg, při odhadech počítáme s 10 N/kg' },
            { type: 'p', text: 'Vyzkoušej si to na věci, kterou nosíš každý den.' },
            { type: 'example', title: 'Školní batoh', problem: 'Batoh má hmotnost 6 kg. Jakou tíhovou silou na něj působí Země?', steps: [
              'Odhad: F_{G} = m · g = 6 kg · 10 N/kg = 60 N',
              'Přesněji: F_{G} = 6 kg · 9,81 N/kg ≈ 58,9 N',
            ], answer: 'F_{G} ≈ 60 N' },
            { type: 'p', text: 'Pozor, tady se chybuje nejčastěji. Hmotnost a tíhová síla spolu souvisí, ale nejsou to stejné veličiny. Rozdíl je vidět hlavně tehdy, když opustíš Zemi:' },
            { type: 'compare', columns: [
              { title: 'Hmotnost m', icon: 'balance-scale', tone: 'a', points: ['kolik látky těleso obsahuje, jak je „těžké rozpohybovat“', 'jednotka **kilogram** (kg)', 'měříme **vahami**', 'na Zemi, na Měsíci i ve vesmíru **stejná**'] },
              { title: 'Tíhová síla F_{G}', icon: 'earth', tone: 'b', points: ['jak silně těleso přitahuje planeta', 'jednotka **newton** (N)', 'měříme **siloměrem**', '**závisí na místě**: na Měsíci asi šestkrát menší'] },
            ] },
            { type: 'p', text: 'Číslo g totiž není všude stejné. Menší Měsíc nebo Mars přitahují slaběji, obří Jupiter mnohem silněji:' },
            { type: 'table', headers: ['těleso', 'g (N/kg)', 'F_{G} astronauta se skafandrem 120 kg'], rows: [
              ['Země', '9,81', '1 177 N'],
              ['Měsíc', '1,62', '194 N'],
              ['Mars', '3,71', '445 N'],
              ['Jupiter', '24,8', '2 976 N'],
            ], caption: 'Hmotnost astronauta je všude 120 kg, tíhová síla se mění podle toho, kde stojí.' },
            { type: 'p', text: 'Co to znamená pro astronauta, který vystoupí na Měsíc? Spočítejme to.' },
            { type: 'example', title: 'Astronaut na Měsíci', problem: 'Astronaut i se skafandrem má hmotnost 120 kg. Jak velká je jeho tíhová síla na Měsíci (g = 1,62 N/kg)?', steps: [
              'F_{G} = m · g = 120 kg · 1,62 N/kg',
              'F_{G} ≈ 194 N',
            ], answer: 'Na Měsíci F_{G} ≈ 194 N, na Zemi asi 1 177 N. Hmotnost zůstává 120 kg – proto astronauti na Měsíci poskakují jako klokani.' },
            { type: 'callout', variant: 'warning', text: 'V běžné řeči říkáme „vážím 50 kilo“. Fyzik řekne: moje **hmotnost** je 50 kg a **tíhová síla**, kterou na mě působí Země, je asi 500 N.' },
            { type: 'p', text: 'Tíhovou sílu už umíme spočítat. Aby byl popis síly úplný, potřebujeme ji ještě umět nakreslit.' },
            { type: 'check', question: { kind: 'number', q: 'Jak velkou tíhovou silou působí Země na kufr o hmotnosti 23 kg? Počítej s g = 10 N/kg.', answer: 230, tolerance: 1, unit: 'N', explain: 'F_{G} = m · g = 23 kg · 10 N/kg = 230 N.' } },
          ],
        },
        {
          title: 'Síla jako šipka',
          icon: 'vector',
          blocks: [
            { type: 'p', text: 'Aby byla síla popsaná úplně, nestačí říct, jak je velká. Musíme znát i její směr a místo, kde na těleso působí. Proto sílu kreslíme **šipkou** (říkáme jí vektor).' },
            { type: 'p', text: 'Každá šipka síly nese tři informace najednou:' },
            { type: 'keyterms', items: [
              { term: '**Velikost**', def: 'délka šipky podle zvoleného měřítka, např. 1 cm = 100 N' },
              { term: '**Směr**', def: 'kam šipka míří' },
              { term: '**Působiště**', def: 'bod, ve kterém síla na těleso působí – tam šipka začíná' },
            ] },
            { type: 'p', text: 'Takhle vypadá obrázek sil u bedny, kterou posouváš po podlaze. Všimni si, že každá šipka začíná tam, kde síla působí, a její délka odpovídá velikosti:' },
            { type: 'forces', body: 'box', surface: 'ground', forces: [
              { label: 'F_{G} = 300 N', angle: 270, size: 3 },
              { label: 'F_{N} = 300 N', angle: 90, size: 3, from: 'bottom' },
              { label: 'F = 200 N', angle: 0, size: 2, from: 'left' },
            ], caption: 'Bednu o tíze 300 N tlačíme doprava silou 200 N. Podlaha tlačí bednu nahoru silou F_{N}. Měřítko: jeden dílek délky = 100 N.' },
            { type: 'callout', variant: 'tip', text: 'Značky sil se píšou s indexem, který napoví, o jakou sílu jde: F_{G} tíhová, F_{N} síla podložky, F_{t} třecí. Když si nevíš rady, napiš k šipce slovy, kdo silou působí.' },
            { type: 'p', text: 'Když kreslíš síly sám/sama, postup je vždycky stejný: zvol měřítko, spočítej sílu a z ní délku šipky.' },
            { type: 'example', title: 'Kreslíme podle měřítka', problem: 'Zvol měřítko 1 cm = 50 N. Jak dlouhou šipkou nakreslíš tíhovou sílu psa o hmotnosti 20 kg (g = 10 N/kg)?', steps: [
              'F_{G} = m · g = 20 kg · 10 N/kg = 200 N',
              'Délka šipky = 200 N : 50 N/cm = 4 cm',
            ], answer: 'Šipka dlouhá 4 cm, svisle dolů, začíná v těžišti psa.' },
            { type: 'callout', variant: 'remember', text: 'Tíhová síla míří vždy **svisle dolů** (ke středu Země) a její působiště kreslíme do **těžiště** tělesa.' },
            { type: 'p', text: 'Proč zrovna do těžiště, když Země přitahuje každý kousek tělesa? A co je to vlastně těžiště? Na to se podíváme v posledním oddílu.' },
            { type: 'check', question: { kind: 'number', q: 'Měřítko je 1 cm = 20 N. Šipka síly je dlouhá 3,5 cm. Jak velká je síla?', answer: 70, tolerance: 0.5, unit: 'N', explain: '3,5 · 20 N = 70 N.' } },
          ],
        },
        {
          title: 'Těžiště a stabilita',
          icon: 'balance-scale',
          blocks: [
            { type: 'p', text: 'Země přitahuje každou částečku tělesa. Pro výpočty si ale můžeme představit, že celá tíhová síla působí v jediném bodě – v **těžišti** T.' },
            { type: 'p', text: 'Těžiště rozhoduje o tom, jestli se těleso převrhne. Zkus v duchu naklápět bednu na hraně:' },
            { type: 'diagram', id: 'center-of-gravity', caption: 'Naklápění bedny: dokud svislice z těžiště prochází podstavou, bedna se vrátí zpět. Jakmile ji mine, bedna se převrhne. Nízké těžiště znamená větší stabilitu.' },
            { type: 'callout', variant: 'remember', text: '==Těleso se nepřevrhne, dokud svislice vedená těžištěm prochází plochou, na které stojí.== Čím níž je těžiště a čím širší je podstava, tím je těleso **stabilnější**.' },
            { type: 'p', text: 'Tohle jedno pravidlo vysvětluje spoustu věcí kolem nás:' },
            { type: 'iconlist', items: [
              { icon: 'car', title: 'Závodní auto', text: 'nízké a široké: v ostré zatáčce se nepřevrhne' },
              { icon: 'muscle', title: 'Zápasník', text: 'široký postoj a pokrčená kolena snižují těžiště' },
              { icon: 'ship', title: 'Loď', text: 'těžký náklad a zátěž se dávají dolů do podpalubí' },
              { icon: 'mountain', title: 'Šikmá věž v Pise', text: 'je nakloněná asi o 4°, ale svislice z těžiště pořád prochází základnou' },
            ] },
            { type: 'p', text: 'Jak ale těžiště najít? U ploché desky je to snadné: zavěs ji postupně za dva různé body a pokaždé narýsuj svislici (olovnici). Těžiště leží v průsečíku obou čar. Těžiště nemusí ležet uvnitř tělesa – třeba u prstýnku nebo podkovy je v prázdném prostoru.' },
            { type: 'p', text: 'Teď umíš sílu poznat, změřit, spočítat i nakreslit. V příští lekci uvidíš, co se stane, když na jedno těleso působí několik sil najednou.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč jsou závodní auta nízká a široká?', options: ['mají nízké těžiště a širokou podstavu, takže se v zatáčkách nepřevrhnou', 'aby měla menší hmotnost', 'aby na ně působila menší tíhová síla', 'aby měla těžiště mimo karoserii'], answer: 0, explain: 'Nízké těžiště a široká podstava zvyšují stabilitu: svislice z těžiště nevyjde mimo podstavu ani při velkém náklonu.' } },
          ],
        },
      ],
      summary: [
        'Síla je projevem vzájemného působení dvou těles, a to při dotyku nebo na dálku prostřednictvím pole.',
        'Síla může změnit pohyb tělesa (rozjet, zastavit, zrychlit, změnit směr) nebo jeho tvar (pružně či trvale).',
        'Jednotkou síly je newton (N) a měříme ji siloměrem, jehož pružina se prodlužuje úměrně síle.',
        'Tíhová síla F_{G} = m · g, na Zemi g ≈ 9,81 N/kg, v odhadech 10 N/kg.',
        'Hmotnost je všude stejná, tíhová síla závisí na místě – na Měsíci je asi šestkrát menší.',
        'Sílu kreslíme šipkou, která má velikost, směr a působiště.',
        'Těleso je stabilní, dokud svislice z těžiště prochází jeho podstavou; nízké těžiště stabilitu zvyšuje.',
      ],
      quiz: [
        { kind: 'tf', q: 'Hmotnost astronauta je na Měsíci menší než na Zemi.', answer: false, explain: 'Hmotnost se nemění, na Měsíci je stejná jako na Zemi. Menší je jen tíhová síla, protože Měsíc má menší g.' },
        { kind: 'choice', q: 'Jakou jednotku má síla?', options: ['newton (N)', 'kilogram (kg)', 'metr za sekundu (m/s)', 'joule (J)'], answer: 0, explain: 'Síla se měří v newtonech. Kilogram je jednotka hmotnosti.' },
        { kind: 'match', q: 'Přiřaď měřidlo k veličině, kterou měří.', pairs: [
          ['siloměr', 'síla'],
          ['váhy', 'hmotnost'],
          ['stopky', 'čas'],
          ['svinovací metr', 'délka'],
        ], explain: 'Siloměr měří sílu v newtonech, váhy hmotnost v kilogramech.' },
        { kind: 'number', q: 'Na těleso působí tíhová síla 45 N. Jakou má hmotnost? (g = 10 N/kg)', answer: 4.5, tolerance: 0.05, unit: 'kg', explain: 'm = F_{G} / g = 45 N / 10 N/kg = 4,5 kg.' },
        { kind: 'multi', q: 'Které síly působí na dálku, bez dotyku těles?', options: ['Země přitahuje Měsíc', 'magnet přitahuje sponku', 'tření mezi podrážkou a chodníkem', 'lano táhne lyžaře na vleku', 'zelektrizovaný balonek přitahuje papírky'], answers: [0, 1, 4], explain: 'Gravitační, magnetická a elektrická síla působí prostřednictvím pole. Tření a tah lana vyžadují dotyk.' },
        { kind: 'number', q: 'Na siloměr zavěsíme závaží o hmotnosti 500 g. Kolik newtonů siloměr ukáže na Měsíci (g = 1,6 N/kg)?', answer: 0.8, tolerance: 0.01, unit: 'N', explain: 'm = 500 g = 0,5 kg, F_{G} = 0,5 kg · 1,6 N/kg = 0,8 N. Na Zemi by ukázal asi 5 N.' },
        { kind: 'choice', q: 'Skříň naklápíš na hraně. Kdy se převrhne?', options: ['když svislice z jejího těžiště vyjde mimo podstavu', 'hned, jakmile ji o kousek nakloníš', 'jen když je těžší než 50 kg', 'jen když má těžiště přesně uprostřed'], answer: 0, explain: 'Dokud svislice z těžiště prochází podstavou, tíhová síla skříň vrací zpět. Když podstavu mine, tíhová síla ji dopřeklopí.' },
        { kind: 'tf', q: 'Síla vzniká vždy při vzájemném působení dvou těles.', answer: true, explain: 'Síla nikdy nepůsobí „sama od sebe“: vždy jedno těleso působí na druhé a to druhé zpět na první.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-4
    'f2-4': {
      id: 'f2-4',
      title: 'Skládání sil a rovnováha',
      goals: [
        'Určit výslednici sil, které působí na jedné přímce ve stejném i opačném směru',
        'Graficky složit dvě síly pod úhlem pomocí rovnoběžníku sil',
        'Poznat rovnováhu sil a nakreslit silový diagram knihy na stole, visící lampy nebo přetahované',
      ],
      hook: 'Přetahovaná: na každé straně tahá pět lidí z plných sil – a lano se ani nehne. Že by nepůsobila žádná síla? Právě naopak! Dnes zjistíš, jak se síly sčítají a kdy se navzájem vyruší.',
      sections: [
        {
          title: 'Síly stejného směru se sčítají',
          icon: 'vector',
          blocks: [
            { type: 'p', text: 'Na těleso často působí víc sil najednou. Můžeme je nahradit jedinou silou, která má stejný účinek. Té říkáme **výslednice sil** F_{v}.' },
            { type: 'p', text: 'Nejjednodušší případ nastane, když všechny síly leží na jedné přímce. Pak stačí sčítat a odečítat, jen si musíš hlídat směry.' },
            { type: 'forces', body: 'car', surface: 'ground', forces: [
              { label: 'F_{1} = 300 N', angle: 0, size: 3, from: 'top' },
              { label: 'F_{2} = 250 N', angle: 0, size: 2.5, from: 'bottom' },
            ], resultant: true, caption: 'Dva kamarádi tlačí porouchané auto stejným směrem. Výslednice míří také dopředu a je rovna součtu obou sil.' },
            { type: 'formula', text: 'F_{v} = F_{1} + F_{2}', caption: 'síly stejného směru: výslednice má stejný směr a velikost je součet' },
            { type: 'example', title: 'Tlačení auta', problem: 'Petr tlačí auto silou 300 N, Jakub silou 250 N, oba dopředu. Jak velká je výslednice?', steps: [
              'Síly mají stejný směr, proto je sečteme.',
              'F_{v} = 300 N + 250 N = 550 N',
            ], answer: 'F_{v} = 550 N dopředu' },
            { type: 'callout', variant: 'fact', text: 'Těžké nákladní vlaky do kopce někdy táhnou dvě lokomotivy za sebou, nebo jedna táhne vpředu a druhá tlačí vzadu. Jejich tažné síly se sčítají.' },
            { type: 'check', question: { kind: 'number', q: 'Pes táhne sáňky silou 80 N a dítě je zezadu tlačí stejným směrem silou 60 N. Jak velká je výslednice?', answer: 140, tolerance: 0.5, unit: 'N', explain: 'Síly mají stejný směr: F_{v} = 80 N + 60 N = 140 N.' } },
          ],
        },
        {
          title: 'Síly opačného směru se odečítají',
          icon: 'equilibrium',
          blocks: [
            { type: 'p', text: 'Když síly míří proti sobě, částečně se vyruší. Velikost výslednice je **rozdíl** sil a výslednice míří ve směru **větší** síly.' },
            { type: 'formula', text: 'F_{v} = F_{1} − F_{2}', caption: 'pro F_{1} > F_{2}; výslednice míří ve směru větší síly F_{1}' },
            { type: 'forces', body: 'point', surface: 'none', forces: [
              { label: 'F_{1} = 450 N', angle: 180, size: 4.5 },
              { label: 'F_{2} = 400 N', angle: 0, size: 4 },
            ], resultant: true, caption: 'Přetahovaná: levé družstvo táhne silou 450 N, pravé 400 N. Výslednice 50 N míří doleva – lano se pomalu rozjede k levému družstvu.' },
            { type: 'example', title: 'Loďka proti proudu', problem: 'Motor žene loďku silou 500 N proti proudu. Voda na ni působí odporem 200 N opačným směrem. Jaká je výslednice?', steps: [
              'Síly mají opačný směr, odečteme menší od větší.',
              'F_{v} = 500 N − 200 N = 300 N',
              'Směr: jako větší síla, tedy proti proudu.',
            ], answer: 'F_{v} = 300 N proti proudu' },
            { type: 'example', title: 'Když se lano nehne', problem: 'Při přetahované táhne každé družstvo silou 1 200 N. Jaká je výslednice sil na lano a co lano dělá?', steps: [
              'Síly jsou stejně velké a opačné: F_{v} = 1 200 N − 1 200 N = 0 N.',
              'Výslednice je nulová, lano zůstává v klidu – i když obě družstva tahají ze všech sil.',
            ], answer: 'F_{v} = 0 N, lano je v klidu. To je rovnováha sil, kterou probereme v další části.' },
            { type: 'callout', variant: 'mascot', text: 'Tahám za lano 400 N, kamarád na druhé straně taky 400 N. Rozdíl je nula a my oba stojíme. Rozhodne ten, kdo má lepší boty – ale o tření až za dvě lekce!' },
            { type: 'check', question: { kind: 'choice', q: 'Na loďku působí motor silou 800 N dopředu a vítr silou 300 N dozadu. Jaká je výslednice?', options: ['500 N dopředu', '1 100 N dopředu', '500 N dozadu', '0 N'], answer: 0, explain: 'Síly jsou opačné, proto je odečteme: 800 N − 300 N = 500 N. Výslednice míří ve směru větší síly, tedy dopředu.' } },
          ],
        },
        {
          title: 'Rovnováha sil',
          icon: 'balance-scale',
          blocks: [
            { type: 'p', text: 'Když je výslednice všech sil nulová, říkáme, že síly jsou **v rovnováze**. Těleso se pak chová, jako by na něj žádná síla nepůsobila: buď **stojí**, nebo se pohybuje **stálou rychlostí po přímce** (víc v příští lekci).' },
            { type: 'callout', variant: 'remember', text: '==Rovnováha sil znamená, že výslednice je nulová – ne že žádné síly nepůsobí.==' },
            { type: 'p', text: 'Podívej se, jak rovnováha vypadá u předmětů kolem tebe. Na každý z nich působí aspoň dvě síly, které se přesně vyruší.' },
            { type: 'forces', body: 'box', surface: 'ground', forces: [
              { label: 'F_{G}', angle: 270, size: 3 },
              { label: 'F_{N}', angle: 90, size: 3, from: 'bottom' },
            ], caption: 'Kniha na stole. Země táhne knihu dolů tíhovou silou F_{G}. Stůl tlačí knihu nahoru silou podložky F_{N}. Obě síly jsou stejně velké a opačné, výslednice je nula.' },
            { type: 'keyterms', items: [
              { term: '**Síla podložky** F_{N}', def: 'síla, kterou podložka (stůl, podlaha) tlačí na těleso kolmo nahoru; vznikne, protože se podložka nepatrně prohne' },
              { term: '**Tahová síla** závěsu', def: 'síla, kterou napnuté lano, lanko nebo pružina táhne těleso' },
            ] },
            { type: 'forces', body: 'lamp', surface: 'ceiling', forces: [
              { label: 'F_{lanko}', angle: 90, size: 2, from: 'top' },
              { label: 'F_{G}', angle: 270, size: 2 },
            ], caption: 'Visící lampa: lanko ji táhne nahoru stejně velkou silou, jakou ji Země táhne dolů.' },
            { type: 'example', title: 'Visící lampa', problem: 'Lampa o hmotnosti 2 kg visí ze stropu na lanku. Jak velkou silou lanko táhne lampu? (g = 10 N/kg)', steps: [
              'F_{G} = m · g = 2 kg · 10 N/kg = 20 N',
              'Lampa je v klidu, síly jsou v rovnováze: F_{lanko} = F_{G}.',
            ], answer: 'Lanko táhne lampu silou 20 N svisle nahoru.' },
            { type: 'check', question: { kind: 'tf', q: 'Když kniha leží v klidu na stole, nepůsobí na ni žádná síla.', answer: false, explain: 'Působí na ni tíhová síla dolů a síla podložky nahoru. Jsou v rovnováze, proto je výslednice nulová a kniha zůstává v klidu.' } },
          ],
        },
        {
          title: 'Síly pod úhlem: rovnoběžník sil',
          icon: 'vector',
          blocks: [
            { type: 'p', text: 'Dva psi táhnou saně, ale každý trochu jiným směrem. Výslednice pak nemíří ani za jedním psem – míří **mezi ně** a je **menší** než prostý součet sil. Najdeme ji graficky.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'pencil', title: 'Nakresli obě síly', text: 'z jednoho bodu, ve zvoleném měřítku' },
              { icon: 'ruler', title: 'Doplň rovnoběžník', text: 'koncem každé šipky veď rovnoběžku s druhou silou' },
              { icon: 'vector', title: 'Úhlopříčka', text: 'z působiště do protějšího rohu – to je výslednice' },
              { icon: 'calculator', title: 'Změř a převeď', text: 'délku úhlopříčky převeď měřítkem na newtony' },
            ], caption: 'Rovnoběžník sil krok za krokem' },
            { type: 'forces', body: 'box', surface: 'ground', forces: [
              { label: 'F_{1}', angle: 30, size: 3 },
              { label: 'F_{2}', angle: 330, size: 3 },
            ], resultant: true, caption: 'Dva psi táhnou saně silami F_{1} a F_{2}, které svírají úhel 60°. Výslednice míří přesně mezi ně, dopředu, a je kratší než součet obou šipek.' },
            { type: 'example', title: 'Kolmé síly', problem: 'Na bod působí dvě na sebe kolmé síly 30 N a 40 N. Najdi výslednici graficky (měřítko 1 cm = 10 N).', steps: [
              'Narýsuj z jednoho bodu šipku 3 cm vodorovně a šipku 4 cm svisle.',
              'Doplň rovnoběžník – tady je to obdélník 3 cm × 4 cm.',
              'Úhlopříčka měří 5 cm, to je 5 · 10 N = 50 N.',
            ], answer: 'F_{v} = 50 N – méně než součet 70 N, ale víc než rozdíl 10 N.' },
            { type: 'callout', variant: 'tip', text: 'Výslednice dvou sil leží vždy **mezi jejich rozdílem a součtem**. Čím menší úhel mezi silami, tím je výslednice větší. Při úhlu 0° se síly sčítají, při 180° odečítají.' },
            { type: 'callout', variant: 'fact', text: 'Velkou loď do přístavu často táhnou dva remorkéry, každý trochu šikmo od boku. Jejich síly se skládají jako v rovnoběžníku a loď jede rovně dopředu.' },
            { type: 'check', question: { kind: 'choice', q: 'Na těleso působí síly 60 N a 80 N pod nějakým úhlem. Jakou velikost může mít výslednice?', options: ['100 N', '150 N', '10 N', '0 N'], answer: 0, explain: 'Výslednice musí ležet mezi 80 − 60 = 20 N a 80 + 60 = 140 N. Hodnotě 100 N odpovídá například pravý úhel mezi silami.' } },
          ],
        },
        {
          title: 'Silový diagram krok za krokem',
          icon: 'pencil',
          blocks: [
            { type: 'p', text: 'Fyzici si každou úlohu o silách začnou **silovým diagramem**: nakreslí jedno těleso a všechny síly, které na ně působí. Postup je pořád stejný.' },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'magnifier', title: 'Vyber těleso', text: 'jen jedno – na co se ptáme' },
              { icon: 'earth', title: 'Tíhová síla', text: 'vždy svisle dolů z těžiště' },
              { icon: 'muscle', title: 'Síly dotykem', text: 'podložka, lano, ruka, tření, odpor vzduchu' },
              { icon: 'magnet', title: 'Síly na dálku', text: 'magnet, elektrický náboj' },
              { icon: 'balance-scale', title: 'Kontrola', text: 'stojí nebo jede stálou rychlostí? Pak musí být síly v rovnováze' },
            ] },
            { type: 'forces', body: 'car', surface: 'ground', forces: [
              { label: 'F_{tah} (motor)', angle: 0, size: 3 },
              { label: 'F_{odpor}', angle: 180, size: 3 },
              { label: 'F_{G}', angle: 270, size: 4 },
              { label: 'F_{N}', angle: 90, size: 4, from: 'bottom' },
            ], caption: 'Auto jede po rovné silnici stálou rychlostí. Tah motoru vyrovnává odpor vzduchu a tření, síla silnice vyrovnává tíhovou sílu. Výslednice je nulová.' },
            { type: 'example', title: 'Zavěšený obraz', problem: 'Obraz o hmotnosti 3 kg visí na zdi na jednom háčku. Nakresli silový diagram a urči velikost sil. (g = 10 N/kg)', steps: [
              'Těleso: obraz.',
              'Tíhová síla: F_{G} = 3 kg · 10 N/kg = 30 N svisle dolů.',
              'Dotyk: háček (přes šňůrku) táhne obraz nahoru.',
              'Obraz visí v klidu, síly jsou v rovnováze: síla šňůrky je 30 N nahoru.',
            ], answer: 'Dvě šipky stejné délky: 30 N dolů z těžiště a 30 N nahoru od šňůrky.' },
            { type: 'forces', body: 'box', surface: 'none', forces: [
              { label: 'F_{šňůrka} = 30 N', angle: 90, size: 3, from: 'top' },
              { label: 'F_{G} = 30 N', angle: 270, size: 3 },
            ], caption: 'Silový diagram zavěšeného obrazu: dvě stejně velké opačné síly, výslednice nula.' },
            { type: 'callout', variant: 'warning', text: 'Do diagramu patří jen síly, které působí **na vybrané těleso**. Síla, kterou kniha tlačí na stůl, do diagramu knihy nepatří – působí na stůl.' },
            { type: 'game', gameId: 'force-sum', text: 'Skládej síly na jedné přímce a hledej rovnováhu v mini-hře Výslednice sil.' },
            { type: 'check', question: { kind: 'order', q: 'Seřaď kroky při kreslení silového diagramu.', items: ['vyber jedno těleso', 'nakresli tíhovou sílu z těžiště', 'přidej síly od všeho, čeho se těleso dotýká', 'přidej síly působící na dálku', 'zkontroluj, jestli mají být síly v rovnováze'], explain: 'Nejdřív víš, o jakém tělese mluvíš. Tíhová síla působí vždy, pak projdeš všechny dotyky, pole a nakonec porovnáš s pohybem tělesa.' } },
          ],
        },
      ],
      summary: [
        'Výslednice sil nahrazuje všechny síly působící na těleso jedinou silou se stejným účinkem.',
        'Síly stejného směru se sčítají, síly opačného směru se odečítají a výslednice míří ve směru větší síly.',
        'Dvě síly pod úhlem složíš graficky rovnoběžníkem; výslednice je jeho úhlopříčka a leží mezi rozdílem a součtem sil.',
        'Síly jsou v rovnováze, když je jejich výslednice nulová; těleso pak stojí, nebo jede stálou rychlostí po přímce.',
        'Na knihu na stole působí tíhová síla a stejně velká síla podložky, na visící lampu tíhová síla a tah lanka.',
        'Do silového diagramu kreslíme jen síly, které působí na vybrané těleso.',
      ],
      quiz: [
        { kind: 'tf', q: 'Výslednice sil 5 N a 3 N může mít velikost 8 N.', answer: true, explain: 'Když obě síly míří stejným směrem, sečtou se: 5 N + 3 N = 8 N.' },
        { kind: 'number', q: 'Dva koně táhnou vůz stejným směrem silami 900 N a 700 N. Proti pohybu působí odporové síly celkem 1 200 N. Jak velká je výslednice?', answer: 400, tolerance: 1, unit: 'N', explain: 'Koně dohromady 900 N + 700 N = 1 600 N dopředu, odpor 1 200 N dozadu: F_{v} = 1 600 N − 1 200 N = 400 N dopředu.' },
        { kind: 'choice', q: 'Parašutista s otevřeným padákem klesá stálou rychlostí. Co platí o silách, které na něj působí?', options: ['odpor vzduchu je stejně velký jako tíhová síla', 'tíhová síla je větší než odpor vzduchu', 'nepůsobí na něj žádná síla', 'odpor vzduchu je větší než tíhová síla'], answer: 0, explain: 'Stálá rychlost znamená rovnováhu sil: odpor vzduchu nahoru vyrovnává tíhovou sílu dolů.' },
        { kind: 'multi', q: 'Ve kterých situacích jsou síly působící na těleso v rovnováze?', options: ['kniha ležící na stole', 'auto jedoucí stálou rychlostí po rovné silnici', 'míč v okamžiku kopnutí', 'lampa visící ze stropu', 'auto rozjíždějící se od semaforu'], answers: [0, 1, 3], explain: 'V rovnováze je těleso, které stojí nebo jede stálou rychlostí po přímce. Kopnutý míč a rozjíždějící se auto mění rychlost, takže na ně působí nenulová výslednice.' },
        { kind: 'number', q: 'Při přetahované táhne levé družstvo silou 1 350 N a pravé silou 1 500 N. Jak velká je výslednice?', answer: 150, tolerance: 0.5, unit: 'N', explain: 'Síly jsou opačné: F_{v} = 1 500 N − 1 350 N = 150 N, ve směru pravého družstva.' },
        { kind: 'choice', q: 'Dvě navzájem kolmé síly 6 N a 8 N působí v jednom bodě. Jak velká je jejich výslednice?', options: ['10 N', '14 N', '2 N', '48 N'], answer: 0, explain: 'Rovnoběžník je obdélník 6 × 8 a jeho úhlopříčka měří 10. Výslednice 10 N leží mezi rozdílem 2 N a součtem 14 N.' },
        { kind: 'match', q: 'Přiřaď k situaci dvojici sil, které jsou v rovnováze.', pairs: [
          ['kniha na stole', 'tíhová síla a síla podložky'],
          ['lampa na lanku', 'tíhová síla a tah lanka'],
          ['loď plující stálou rychlostí', 'tah motoru a odpor vody'],
          ['parašutista klesající stálou rychlostí', 'tíhová síla a odpor vzduchu'],
        ], explain: 'Ve všech čtyřech případech těleso stojí nebo se pohybuje stálou rychlostí, takže síly musí být v rovnováze.' },
        { kind: 'tf', q: 'Když jsou síly působící na těleso v rovnováze, těleso musí stát.', answer: false, explain: 'Při rovnováze sil může těleso i jet stálou rychlostí po přímce – třeba auto na dálnici se zapnutým tempomatem.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-5
    'f2-5': {
      id: 'f2-5',
      title: 'Newtonovy pohybové zákony',
      goals: [
        'Vysvětlit, proč pohyb stálou rychlostí nepotřebuje žádnou výslednou sílu (zákon setrvačnosti)',
        'Použít vztah F = m · a k výpočtu síly, hmotnosti nebo zrychlení',
        'Najít k síle její reakci a vysvětlit, proč se akce a reakce navzájem neruší',
        'Popsat pomocí Newtonových zákonů chůzi, plavání, bezpečnostní pás a let rakety',
      ],
      hook: 'Hokejový puk klouže po ledě dlouho, i když do něj nikdo netlačí. Sonda Voyager letí vesmírem skoro padesát let s vypnutým motorem. Kdo je postrká? Nikdo! Pojďme vyvrátit nejslavnější omyl v dějinách fyziky.',
      sections: [
        {
          title: 'Nejslavnější omyl: pohyb potřebuje sílu?',
          icon: 'question',
          blocks: [
            { type: 'p', text: 'Přestaneš šlapat a kolo se po chvíli zastaví. Přestaneš tlačit vozík a zastaví se taky. Proto si lidé skoro dva tisíce let mysleli, že **k pohybu je potřeba síla**. Tak to učil i řecký filozof Aristotelés.' },
            { type: 'compare', columns: [
              { title: 'Aristotelés (a naše intuice)', icon: 'cross', tone: 'bad', points: ['aby se těleso pohybovalo, musí ho něco tlačit', 'bez síly se těleso samo zastaví', 'větší síla = větší rychlost'] },
              { title: 'Galileo a Newton', icon: 'check', tone: 'good', points: ['síla je potřeba ke **změně** pohybu', 'kolo zastaví tření a odpor vzduchu – a to jsou také síly', 'větší síla = větší **zrychlení**'] },
            ], caption: 'Dva pohledy na pohyb. Pravdu má ten pravý sloupec.' },
            { type: 'p', text: 'Galileo Galilei pouštěl kuličky po stále hladších drahách. Čím menší bylo tření, tím dál kulička dojela. Domyslel to do konce: **bez tření by jela pořád** stejnou rychlostí.' },
            { type: 'p', text: 'Isaac Newton tuto myšlenku v roce 1687 zapsal jako první ze tří **pohybových zákonů**. Dodnes podle nich počítáme dráhy družic, brzdné dráhy aut i skoky na lyžích.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10, step: 2 }, y: { label: 'v', unit: 'm/s', min: 0, max: 6, step: 1 }, series: [
              { label: 'koberec', points: [[0, 5], [2, 0]], tone: 'a' },
              { label: 'parkety', points: [[0, 5], [6, 0]], tone: 'b' },
              { label: 'led', points: [[0, 5], [10, 4]], tone: 'c' },
              { label: 'bez tření (myšlenkový pokus)', points: [[0, 5], [10, 5]], style: 'dashed', tone: 'd' },
            ], caption: 'Puk postrčený rychlostí 5 m/s na různých površích. Čím menší tření, tím pomaleji ztrácí rychlost. Bez tření by jel pořád 5 m/s.' },
            { type: 'callout', variant: 'mascot', text: 'Takže to není tak, že se věci „unaví“ a zastaví. Zastaví je síla – tření nebo odpor vzduchu. Ve vesmíru, kde tření skoro není, by můj míček letěl navždy.' },
            { type: 'check', question: { kind: 'tf', q: 'Aby se těleso pohybovalo stálou rychlostí, musí na něj působit výsledná síla ve směru pohybu.', answer: false, explain: 'Pohyb stálou rychlostí nepotřebuje žádnou výslednou sílu. Výslednice je nulová – buď nepůsobí žádné síly, nebo jsou v rovnováze.' } },
          ],
        },
        {
          title: '1. Newtonův zákon: zákon setrvačnosti',
          icon: 'car',
          blocks: [
            { type: 'callout', variant: 'remember', title: 'Zákon setrvačnosti', text: 'Těleso zůstává v klidu nebo v rovnoměrném přímočarém pohybu, dokud na něj nezačne působit **nenulová výslednice sil**.' },
            { type: 'p', text: 'Tato vlastnost těles se jmenuje **setrvačnost**. Čím větší má těleso hmotnost, tím větší má setrvačnost: plně naložený kamion se rozjíždí i zastavuje mnohem hůř než prázdná dodávka.' },
            { type: 'iconlist', items: [
              { icon: 'car', title: 'Bezpečnostní pás', text: 'Při nárazu auto prudce zastaví, ale tvoje tělo setrvačností pokračuje dopředu. Pás ho zadrží.' },
              { icon: 'speed', title: 'Brzdící autobus', text: 'Autobus zabrzdí a stojící cestující „letí“ dopředu. Ve skutečnosti jen pokračují v pohybu.' },
              { icon: 'glass', title: 'Trik s ubrusem', text: 'Rychle stržený ubrus nádobí nestrhne – talíře zůstanou setrvačností v klidu.' },
              { icon: 'droplets', title: 'Otřepání vody', text: 'Ruka se prudce zastaví, kapky vody pokračují dál a odletí.' },
              { icon: 'satellite', title: 'Sonda ve vesmíru', text: 'Motor je vypnutý, sonda letí setrvačností dál.' },
            ] },
            { type: 'forces', body: 'car', surface: 'ground', forces: [
              { label: 'F_{tah}', angle: 0, size: 3 },
              { label: 'F_{odpor}', angle: 180, size: 3 },
              { label: 'F_{G}', angle: 270, size: 4 },
              { label: 'F_{N}', angle: 90, size: 4, from: 'bottom' },
            ], caption: 'Auto jede po dálnici stálou rychlostí 130 km/h. Motor táhne jen proto, aby vyrovnal odpor vzduchu a valivé tření. Výslednice je nulová.' },
            { type: 'callout', variant: 'warning', text: '==Stálá rychlost neznamená „žádné síly“, ale „síly v rovnováze“.== Když řidič přestane plynovat, tah zmizí, odpor převládne a auto zpomaluje.' },
            { type: 'check', question: { kind: 'choice', q: 'Auto prudce zabrzdí. Proč se cestující nakloní dopředu?', options: ['jeho tělo setrvačností pokračuje v pohybu', 'tlačí ho dopředu síla brzd', 'odstrčí ho opěradlo sedadla', 'při brzdění na něj působí větší tíhová síla'], answer: 0, explain: 'Brzdy působí na auto, ne na cestujícího. Jeho tělo pokračuje setrvačností stejnou rychlostí, dokud ho nezastaví pás.' } },
          ],
        },
        {
          title: '2. Newtonův zákon: zákon síly',
          icon: 'weight',
          blocks: [
            { type: 'p', text: 'Když výslednice sil **není** nulová, těleso zrychluje (nebo zpomaluje, nebo zatáčí). Čím větší síla, tím větší zrychlení. Čím větší hmotnost, tím menší zrychlení při stejné síle.' },
            { type: 'formula', text: 'F = m · a', caption: 'F … výslednice sil (N), m … hmotnost (kg), a … zrychlení (m/s²); 1 N = 1 kg · m/s²' },
            { type: 'callout', variant: 'warning', text: 'F ve vzorci je **výslednice** všech sil, ne jen jedna síla. Když motor táhne auto silou 3 000 N a odpor je 1 000 N, dosazuješ 2 000 N.' },
            { type: 'graph', x: { label: 'F', unit: 'N', min: 0, max: 50, step: 10 }, y: { label: 'a', unit: 'm/s²', min: 0, max: 5, step: 1 }, series: [
              { label: 'prázdný vozík 10 kg', points: [[0, 0], [50, 5]], tone: 'a' },
              { label: 'plný vozík 25 kg', points: [[0, 0], [50, 2]], tone: 'b' },
            ], marks: [{ x: 30, y: 3, label: '30 N → 3 m/s²' }], caption: 'Zrychlení roste úměrně síle. Plný vozík (větší hmotnost) má při stejné síle menší zrychlení.' },
            { type: 'example', title: 'Nákupní vozík', problem: 'Tlačíš vozík o hmotnosti 20 kg výslednou silou 30 N. Jaké bude jeho zrychlení?', steps: [
              'Ze vztahu F = m · a vyjádříme a = F / m.',
              'a = 30 N / 20 kg = 1,5 m/s²',
            ], answer: 'a = 1,5 m/s²' },
            { type: 'example', title: 'Rozjezd auta', problem: 'Auto o hmotnosti 1 200 kg se rozjíždí se zrychlením 2 m/s². Jak velká je výslednice sil?', steps: [
              'F = m · a = 1 200 kg · 2 m/s²',
            ], answer: 'F = 2 400 N' },
            { type: 'callout', variant: 'tip', text: 'Tíhová síla F_{G} = m · g je jen zvláštní případ zákona síly. Padající těleso zrychluje právě o g ≈ 9,81 m/s² – proto má g jednotku N/kg i m/s² (je to totéž).' },
            { type: 'check', question: { kind: 'number', q: 'Jak velkou výslednou silou musí působit sprinter o hmotnosti 60 kg, aby na startu zrychlil o 5 m/s²?', answer: 300, tolerance: 0.5, unit: 'N', explain: 'F = m · a = 60 kg · 5 m/s² = 300 N.' } },
          ],
        },
        {
          title: '3. Newtonův zákon: akce a reakce',
          icon: 'arrow-cycle',
          blocks: [
            { type: 'callout', variant: 'remember', title: 'Zákon akce a reakce', text: 'Působí-li těleso A na těleso B silou, působí i těleso B na těleso A stejně velkou silou opačného směru. Obě síly vznikají a zanikají současně a ==každá působí na jiné těleso==.' },
            { type: 'p', text: 'Síla tedy nikdy nepřichází sama. Jakmile na něco zatlačíš, to „něco“ tlačí zpátky na tebe. Tuhle reakci často využíváme k pohybu.' },
            { type: 'iconlist', items: [
              { icon: 'muscle', title: 'Chůze', text: 'Noha tlačí zem dozadu (akce), zem tlačí tebe dopředu (reakce).' },
              { icon: 'swimming-pool', title: 'Plavání', text: 'Ruce odtlačují vodu dozadu, voda tlačí plavce dopředu.' },
              { icon: 'ship', title: 'Veslování', text: 'Veslo tlačí vodu dozadu, voda tlačí loďku dopředu.' },
              { icon: 'balloon', title: 'Vypuštěný balonek', text: 'Balonek tlačí vzduch ven jedním směrem, vzduch tlačí balonek opačným.' },
              { icon: 'rocket', title: 'Raketa', text: 'Raketa vytlačuje plyny dolů, plyny tlačí raketu nahoru.' },
            ] },
            { type: 'forces', body: 'person', surface: 'ground', forces: [
              { label: 'F_{G}', angle: 270, size: 4 },
              { label: 'F_{N}', angle: 90, size: 4, from: 'bottom' },
              { label: 'F (země na chodce)', angle: 0, size: 2, from: 'bottom' },
            ], caption: 'Síly na chodce při odrazu. Chodec odráží nohu dozadu a tlačí na zem (ta síla působí na Zemi, proto tu není). Reakce – síla země na chodce – míří dopředu a posouvá ho.' },
            { type: 'example', title: 'Bruslaři se odstrčí', problem: 'Petr (60 kg) a Jana (40 kg) stojí na bruslích a navzájem se odstrčí. Každý působí na druhého silou 120 N. Jaká zrychlení získají?', steps: [
              'Síly jsou podle 3. zákona stejně velké: 120 N na Petra, 120 N na Janu.',
              'Petr: a = F / m = 120 N / 60 kg = 2 m/s²',
              'Jana: a = F / m = 120 N / 40 kg = 3 m/s²',
            ], answer: 'Petr 2 m/s², Jana 3 m/s². Stejné síly, ale lehčí Jana odjede rychleji.' },
            { type: 'check', question: { kind: 'number', q: 'Tomáš (50 kg) a Ondra (75 kg) stojí na bruslích a odstrčí se od sebe silou 150 N. Jaké zrychlení získá Ondra?', answer: 2, tolerance: 0.05, unit: 'm/s²', explain: 'Na Ondru působí reakce 150 N (stejně velká jako na Tomáše). a = 150 N / 75 kg = 2 m/s². Tomáš získá 3 m/s².' } },
          ],
        },
        {
          title: 'Past: akce a reakce se neruší',
          icon: 'warning',
          blocks: [
            { type: 'p', text: 'Když jsou akce a reakce stejně velké a opačné, proč se nevyruší? Protože ==sčítat můžeme jen síly, které působí na stejné těleso==. Akce a reakce působí vždy na dvě různá tělesa.' },
            { type: 'compare', columns: [
              { title: 'Rovnováha sil', icon: 'balance-scale', tone: 'a', points: ['obě síly působí na **jedno** těleso', 'sčítají se, výslednice je nula', 'mohou být různého druhu (tíhová síla a síla podložky)', 'jedna může zmizet a druhá zůstat'] },
              { title: 'Akce a reakce', icon: 'arrow-cycle', tone: 'b', points: ['síly působí na **dvě různá** tělesa', 'nesčítají se, každá má účinek na své těleso', 'vždy stejného druhu (obě gravitační, obě dotykové…)', 'vznikají a zanikají vždy spolu'] },
            ], caption: 'Dvě dvojice stejně velkých opačných sil – a přesto něco úplně jiného.' },
            { type: 'table', headers: ['síla, která působí na knihu', 'její reakce (působí na jiné těleso)'], rows: [
              ['Země táhne knihu dolů (F_{G})', 'kniha táhne Zemi nahoru'],
              ['stůl tlačí knihu nahoru (F_{N})', 'kniha tlačí stůl dolů'],
            ], caption: 'Kniha na stole: F_{G} a F_{N} jsou v rovnováze, ale nejsou akce a reakce.' },
            { type: 'callout', variant: 'tip', text: 'Test na akci a reakci: prohoď slova. „Země táhne knihu“ → „kniha táhne Zemi“. Když dostaneš sílu na jiné těleso stejného druhu, našel jsi reakci.' },
            { type: 'example', title: 'Paradox koně a vozu', problem: 'Kůň táhne vůz. Podle 3. zákona táhne vůz koně stejně velkou silou dozadu. Jak se tedy mohou rozjet?', steps: [
              'Na vůz působí jen tah koně dopředu (a malé tření kol). Výslednice na vůz míří dopředu – vůz zrychluje.',
              'Na koně působí tah vozu dozadu, ale také síla od země dopředu: kůň se kopyty opírá o zem a tlačí ji dozadu, zem ho tlačí dopředu.',
              'Když síla země na koně převýší tah vozu, výslednice na koně míří dopředu – kůň zrychluje.',
            ], answer: 'Akce a reakce mezi koněm a vozem se neruší, protože každá působí na jiné těleso. O pohybu rozhoduje výslednice sil na každé těleso zvlášť.' },
            { type: 'check', question: { kind: 'choice', q: 'Kniha leží na stole. Co je reakcí k tíhové síle, kterou Země působí na knihu?', options: ['síla, kterou kniha přitahuje Zemi', 'síla, kterou stůl tlačí na knihu', 'síla, kterou kniha tlačí na stůl', 'žádná, tíhová síla reakci nemá'], answer: 0, explain: 'Akce: Země na knihu. Reakce: kniha na Zemi – stejně velká gravitační síla nahoru, působící na Zemi. Síla stolu je sice stejně velká, ale působí na knihu, takže je to rovnováha, ne reakce.' } },
          ],
        },
        {
          title: 'Raketa: tři zákony najednou',
          icon: 'rocket',
          blocks: [
            { type: 'process', layout: 'flow', steps: [
              { icon: 'flame', title: 'Motor spaluje palivo', text: 'vzniknou horké plyny pod vysokým tlakem' },
              { icon: 'arrow-cycle', title: 'Akce a reakce', text: 'raketa vytlačuje plyny dolů, plyny tlačí raketu nahoru (3. zákon)' },
              { icon: 'weight', title: 'Tah větší než tíha', text: 'výslednice míří nahoru, raketa zrychluje: a = F / m (2. zákon)' },
              { icon: 'orbit', title: 'Motor vypnut', text: 've vesmíru letí dál setrvačností (1. zákon)' },
            ], caption: 'Let rakety krok za krokem' },
            { type: 'forces', body: 'point', surface: 'none', forces: [
              { label: 'F_{tah} = 7 MN', angle: 90, size: 5 },
              { label: 'F_{G} = 5 MN', angle: 270, size: 3.5 },
            ], resultant: true, caption: 'Síly na raketu při startu. Tah motorů je větší než tíhová síla, výslednice 2 MN (meganewtony) míří nahoru.' },
            { type: 'example', title: 'Start rakety', problem: 'Raketa má hmotnost 500 t (500 000 kg) a tah motorů 7 000 000 N. Jaké má zrychlení při startu? (g = 10 N/kg)', steps: [
              'F_{G} = m · g = 500 000 kg · 10 N/kg = 5 000 000 N',
              'Výslednice: F = 7 000 000 N − 5 000 000 N = 2 000 000 N nahoru',
              'a = F / m = 2 000 000 N / 500 000 kg',
            ], answer: 'a = 4 m/s²' },
            { type: 'callout', variant: 'fact', text: 'Raketa se nepotřebuje „odrážet od vzduchu“. Odráží se od vlastních plynů, a proto funguje i ve vzduchoprázdnu, dokonce lépe. Jak palivo ubývá, hmotnost rakety klesá a zrychlení roste.' },
            { type: 'callout', variant: 'mascot', text: 'Zkus to doma: nafoukni balonek a pusť ho. Právě jsi odpálil raketu na zákon akce a reakce. Jen řízení se trochu nepovedlo.' },
            { type: 'check', question: { kind: 'tf', q: 'Raketa ve vesmíru nemůže zrychlovat, protože se nemá od čeho odrazit.', answer: false, explain: 'Raketa tlačí na své vlastní výtokové plyny a ty podle zákona akce a reakce tlačí raketu opačným směrem. Vzduch k tomu nepotřebuje.' } },
          ],
        },
      ],
      summary: [
        'Pohyb stálou rychlostí nepotřebuje žádnou výslednou sílu; tělesa zastavuje tření a odpor prostředí, které jsou také síly.',
        '1. Newtonův zákon: bez výsledné síly těleso zůstává v klidu, nebo jede dál stálou rychlostí po přímce (setrvačnost).',
        '2. Newtonův zákon: výsledná síla způsobí zrychlení podle F = m · a; větší hmotnost znamená menší zrychlení.',
        '3. Newtonův zákon: síly vznikají vždy v páru, akce a reakce jsou stejně velké, opačné a působí na různá tělesa.',
        'Akce a reakce se neruší, protože sčítat můžeme jen síly působící na stejné těleso.',
        'Chůze, plavání i let rakety fungují díky reakci: tlačíme něco dozadu, a to tlačí nás dopředu.',
      ],
      quiz: [
        { kind: 'tf', q: 'Na hokejový puk, který klouže po dokonale hladkém ledě stálou rychlostí, musí působit síla ve směru pohybu.', answer: false, explain: 'Puk se pohybuje stálou rychlostí setrvačností. Tíhová síla a síla ledu jsou v rovnováze, žádná síla ve směru pohybu není potřeba.' },
        { kind: 'choice', q: 'Který zákon vysvětluje, proč v autě potřebuješ bezpečnostní pás?', options: ['zákon setrvačnosti', 'zákon síly', 'zákon akce a reakce', 'zákon o těžišti'], answer: 0, explain: 'Při nárazu auto prudce zpomalí, ale tělo pokračuje setrvačností dopředu. Pás na něj působí silou, která ho zastaví.' },
        { kind: 'number', q: 'Při výkopu působí noha na míč o hmotnosti 0,5 kg výslednou silou 200 N. Jaké zrychlení míč získá?', answer: 400, tolerance: 1, unit: 'm/s²', explain: 'a = F / m = 200 N / 0,5 kg = 400 m/s². Síla ale působí jen setinu sekundy.' },
        { kind: 'match', q: 'Přiřaď situaci k Newtonovu zákonu, který ji nejlépe vysvětluje.', pairs: [
          ['otřepávání vody z rukou', 'zákon setrvačnosti'],
          ['plný vozík se rozjíždí hůř než prázdný', 'zákon síly F = m · a'],
          ['plavec odtlačuje vodu dozadu a pluje dopředu', 'zákon akce a reakce'],
        ], explain: 'Kapky pokračují setrvačností, větší hmotnost dává menší zrychlení, a plavec se pohybuje díky reakci vody.' },
        { kind: 'number', q: 'Auto o hmotnosti 1 500 kg zrychluje o 2 m/s². Proti pohybu působí odporové síly 600 N. Jak velkou tažnou silou působí motor?', answer: 3600, tolerance: 5, unit: 'N', explain: 'Výslednice: F = m · a = 1 500 kg · 2 m/s² = 3 000 N. Tah musí navíc překonat odpor: 3 000 N + 600 N = 3 600 N.' },
        { kind: 'multi', q: 'Která tvrzení o akci a reakci platí?', options: ['jsou stejně velké', 'mají opačný směr', 'působí na různá tělesa', 'navzájem se ruší', 'reakce vzniká až chvíli po akci'], answers: [0, 1, 2], explain: 'Akce a reakce jsou stejně velké, opačné, působí na různá tělesa a vznikají současně. Protože působí na různá tělesa, nemohou se zrušit.' },
        { kind: 'choice', q: 'Kamion narazí do osobního auta. Která síla při nárazu je větší?', options: ['obě jsou stejně velké', 'síla, kterou kamion působí na auto', 'síla, kterou auto působí na kamion', 'záleží na tom, kdo jel rychleji'], answer: 0, explain: 'Podle 3. zákona jsou síly stejně velké. Auto má ale mnohem menší hmotnost, takže získá mnohem větší zrychlení (a = F / m) – a proto dopadne hůř.' },
        { kind: 'tf', q: 'Stejně velká výsledná síla udělí tělesu s dvojnásobnou hmotností poloviční zrychlení.', answer: true, explain: 'Z a = F / m: když se hmotnost zdvojnásobí a síla zůstane stejná, zrychlení klesne na polovinu.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-6
    'f2-6': {
      id: 'f2-6',
      title: 'Tření a odporové síly',
      goals: [
        'Vysvětlit, proč vzniká tření, a rozlišit klidové, smykové a valivé tření',
        'Spočítat třecí sílu ze vztahu F_{t} = f · F_{N}',
        'Popsat odpor vzduchu a vody a vysvětlit, proč parašutista padá stálou (mezní) rychlostí',
        'Navrhnout, jak tření zvětšit, kde pomáhá, nebo zmenšit, kde škodí',
      ],
      hook: 'Představ si den bez tření. Nemohl bys chodit, tkaničky by se samy rozvázaly, auto by nezabrzdilo a tužka by nepsala. Tření je otravné i nepostradatelné zároveň.',
      sections: [
        {
          title: 'Odkud se tření bere',
          icon: 'magnifier',
          blocks: [
            { type: 'p', text: 'I nejhladší povrch je pod mikroskopem hrbolatý. Když po sobě dvě tělesa kloužou, jejich nerovnosti se do sebe zaklesávají a částice na styčné ploše se k sobě přitahují. Výsledkem je **třecí síla** F_{t}.' },
            { type: 'callout', variant: 'remember', text: 'Třecí síla působí ve **styčné ploše** a míří vždy **proti pohybu** (nebo proti směru, kterým by se těleso chtělo pohnout).' },
            { type: 'keyterms', items: [
              { term: '**Klidové tření**', def: 'drží těleso na místě, dokud tlačíš málo; je stejně velké jako tvůj tah, až do určitého maxima' },
              { term: '**Smykové tření**', def: 'působí, když těleso po podložce klouže' },
              { term: '**Valivé tření**', def: 'působí, když se těleso po podložce kutálí – je mnohem menší' },
            ] },
            { type: 'graph', x: { label: 'tah', unit: 'N', min: 0, max: 100, step: 20 }, y: { label: 'F_{t}', unit: 'N', min: 0, max: 60, step: 10 }, series: [
              { label: 'třecí síla', points: [[0, 0], [50, 50], [52, 40], [100, 40]] },
            ], marks: [{ x: 50, y: 50, label: 'bedna se utrhne' }, { x: 80, y: 40, label: 'smykové tření' }], caption: 'Táhneš bednu stále větší silou. Dokud stojí, klidové tření roste spolu s tahem. Při 50 N se bedna utrhne a dál klouže – smykové tření je menší, jen 40 N.' },
            { type: 'callout', variant: 'fact', text: 'Proto se těžká skříň rozhýbává hůř, než se pak posouvá. A proto má auto systém ABS: kola, která se při brzdění nezablokují, drží na silnici klidovým třením, a to je větší než smykové.' },
            { type: 'check', question: { kind: 'tf', q: 'Rozhýbat těžkou skříň je obvykle těžší než ji pak udržet v pohybu.', answer: true, explain: 'Největší klidové tření je větší než smykové tření. Jakmile se skříň rozjede, stačí menší síla.' } },
          ],
        },
        {
          title: 'Na čem tření závisí: F_{t} = f · F_{N}',
          icon: 'weight',
          blocks: [
            { type: 'p', text: 'Třecí síla je tím větší, čím víc těleso tlačí na podložku, a závisí na materiálech a drsnosti obou ploch. Skoro vůbec ale nezávisí na **velikosti** styčné plochy ani na rychlosti.' },
            { type: 'formula', text: 'F_{t} = f · F_{N}', caption: 'F_{t} … třecí síla (N), f … součinitel smykového tření (bez jednotky), F_{N} … kolmá tlaková síla na podložku (N); na vodorovné podložce F_{N} = F_{G}' },
            { type: 'p', text: 'Součinitel tření f je jen číslo bez jednotky. Čím je menší, tím po sobě plochy kloužou snáz. Najdeš ho v tabulkách:' },
            { type: 'table', headers: ['dvojice materiálů', 'součinitel tření f'], rows: [
              ['pneumatika – suchý asfalt', '0,7'],
              ['pneumatika – mokrý asfalt', '0,4'],
              ['dřevo – dřevo', '0,3'],
              ['pneumatika – led', '0,1'],
              ['ocelová brusle – led', '0,02'],
            ], caption: 'Přibližné součinitele smykového tření' },
            { type: 'forces', body: 'box', surface: 'ground', forces: [
              { label: 'F = 60 N', angle: 0, size: 2, from: 'right' },
              { label: 'F_{t} = 60 N', angle: 180, size: 2, from: 'bottom' },
              { label: 'F_{G} = 200 N', angle: 270, size: 4 },
              { label: 'F_{N} = 200 N', angle: 90, size: 4, from: 'bottom' },
            ], caption: 'Dřevěnou bednu táhneme po dřevěné podlaze stálou rychlostí. Tah vyrovnává tření, síla podlahy vyrovnává tíhovou sílu.' },
            { type: 'example', title: 'Posouvání bedny', problem: 'Dřevěná bedna o hmotnosti 20 kg stojí na dřevěné podlaze (f = 0,3). Jakou silou ji musíš táhnout, aby jela stálou rychlostí? (g = 10 N/kg)', steps: [
              'Na vodorovné podlaze: F_{N} = F_{G} = m · g = 20 kg · 10 N/kg = 200 N',
              'F_{t} = f · F_{N} = 0,3 · 200 N = 60 N',
              'Při stálé rychlosti jsou síly v rovnováze: tah = třecí síla.',
            ], answer: 'Táhnout musíš silou 60 N.' },
            { type: 'callout', variant: 'warning', text: 'Cihla položená naplocho i na úzkou hranu má stejné tření. Na větší ploše sice tlačí na víc místech, ale na každé z nich slaběji. Rozhoduje celková tlaková síla, ne plocha.' },
            { type: 'check', question: { kind: 'number', q: 'Sáňky o hmotnosti 15 kg jedou po sněhu (f = 0,05). Jak velká je třecí síla? (g = 10 N/kg)', answer: 7.5, tolerance: 0.05, unit: 'N', explain: 'F_{N} = 15 kg · 10 N/kg = 150 N, F_{t} = 0,05 · 150 N = 7,5 N.' } },
          ],
        },
        {
          title: 'Valivé tření: proč vynalezli kolo',
          icon: 'arrow-cycle',
          blocks: [
            { type: 'p', text: 'Když se těleso **valí**, po podložce neklouže. Kolo se jen trochu promáčkne a podložka taky, a to brzdí mnohem méně než smýkání. ==Valivé tření je mnohokrát menší než smykové.==' },
            { type: 'compare', columns: [
              { title: 'Smykové tření', icon: 'weight', tone: 'a', points: ['táhnutí bedny po zemi', 'lyže a brusle', 'zablokovaná kola při smyku', 'f ≈ 0,02 až 0,7'] },
              { title: 'Valivé tření', icon: 'arrow-cycle', tone: 'b', points: ['kolo vozíku, jízdního kola, vlaku', 'kuličky v ložisku', 'kufr na kolečkách', 'zhruba 10× až 100× menší'] },
            ] },
            { type: 'process', layout: 'flow', steps: [
              { icon: 'tree', title: 'Dřevěné válce', text: 'pod těžkými kameny a loďmi' },
              { icon: 'arrow-cycle', title: 'Kolo', text: 'asi před 5 500 lety' },
              { icon: 'gauge', title: 'Kuličková ložiska', text: 'hřídele se neotírají, ale valí' },
              { icon: 'car', title: 'Pneumatiky', text: 'nafouknuté kolo s malým valivým odporem' },
            ], caption: 'Jak lidé postupně vyměnili smýkání za valení' },
            { type: 'example', title: 'Kufr na letišti', problem: 'Kufr má hmotnost 20 kg. Kdybys ho táhl po podlaze, součinitel tření by byl 0,4. Na kolečkách je odpor zhruba jako při f = 0,02. Jak velkou silou ho táhneš v obou případech? (g = 10 N/kg)', steps: [
              'F_{N} = 20 kg · 10 N/kg = 200 N',
              'Bez koleček: F_{t} = 0,4 · 200 N = 80 N',
              'Na kolečkách: F = 0,02 · 200 N = 4 N',
            ], answer: 'Po zemi 80 N, na kolečkách jen asi 4 N – dvacetkrát méně.' },
            { type: 'callout', variant: 'fact', text: 'V jízdním kole, pračce, ventilátoru i v kolečkových bruslích jsou kuličková ložiska. Bez nich by se osy rychle zahřály a opotřebovaly.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč mají cestovní kufry kolečka?', options: ['valivé tření je mnohem menší než smykové', 'kolečka zmenší tíhovou sílu kufru', 'kolečka zvětší styčnou plochu', 'na kolečkách nepůsobí vůbec žádné tření'], answer: 0, explain: 'Kolečka mění smýkání na valení a valivý odpor je mnohonásobně menší. Tíhová síla kufru se nemění a nějaký malý odpor zůstává.' } },
          ],
        },
        {
          title: 'Odpor vzduchu a vody',
          icon: 'parachute',
          blocks: [
            { type: 'p', text: 'Když se těleso pohybuje vzduchem nebo vodou, musí částice prostředí odsouvat stranou. Prostředí na ně působí **odporovou silou** proti pohybu.' },
            { type: 'iconlist', items: [
              { icon: 'speed', title: 'Rychlost', text: 'čím rychleji, tím větší odpor; při dvojnásobné rychlosti asi čtyřnásobný' },
              { icon: 'drop', title: 'Tvar', text: 'aerodynamický (kapkovitý) tvar obtéká vzduch snadno' },
              { icon: 'wind', title: 'Velikost průřezu', text: 'cyklista skrčený na řídítkách má menší odpor než vzpřímený' },
              { icon: 'fish', title: 'Hustota prostředí', text: 'voda je asi 800× hustší než vzduch, proto se v ní běží tak těžko' },
            ] },
            { type: 'p', text: 'Parašutista po výskoku zrychluje. S rychlostí ale roste odpor vzduchu, až se vyrovná tíhové síle. Pak jsou síly v rovnováze a parašutista padá **stálou rychlostí**, které říkáme **mezní rychlost**.' },
            { type: 'forces', body: 'skydiver', surface: 'none', forces: [
              { label: 'F_{odpor}', angle: 90, size: 4 },
              { label: 'F_{G}', angle: 270, size: 4 },
            ], caption: 'Parašutista při mezní rychlosti: odpor vzduchu je stejně velký jako tíhová síla, výslednice je nulová.' },
            { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 40, step: 5 }, y: { label: 'v', unit: 'm/s', min: 0, max: 60, step: 10 }, series: [
              { label: 'parašutista', points: [[0, 0], [2, 19], [4, 33], [6, 42], [8, 48], [10, 51], [14, 54], [20, 55], [25, 55], [26, 30], [27, 15], [28, 8], [30, 5], [40, 5]] },
            ], marks: [{ x: 18, y: 55, label: 'mezní rychlost ≈ 55 m/s (200 km/h)' }, { x: 25, label: 'otevření padáku' }, { x: 35, y: 5, label: 's padákem ≈ 5 m/s' }], caption: 'Graf v–t seskoku. Zrychlování postupně slábne, až se rychlost ustálí. Otevřený padák prudce zvětší odpor, parašutista zpomalí na novou, malou mezní rychlost.' },
            { type: 'callout', variant: 'fact', text: 'Dešťová kapka dopadá rychlostí jen asi 9 m/s. Bez odporu vzduchu by z mraku ve výšce 2 km dopadla rychlostí skoro 200 m/s – a déšť by bolel jako broky.' },
            { type: 'p', text: 'Ve vodě je odpor mnohem větší. Proto mají ryby, delfíni i ponorky protáhlý tvar a plavci si holí nohy a nosí hladké čepice – každá setina sekundy se počítá.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč parašutista po chvíli volného pádu padá stálou rychlostí?', options: ['odpor vzduchu vzroste, až se vyrovná tíhové síle', 'tíhová síla ve výšce zmizí', 'odpor vzduchu je pořád stejně velký', 'vzduch ho nadnáší víc, než ho táhne Země'], answer: 0, explain: 'Odpor roste s rychlostí. Když se vyrovná tíhové síle, výslednice je nulová a podle zákona setrvačnosti se rychlost už nemění.' } },
          ],
        },
        {
          title: 'Kdy tření pomáhá a kdy škodí',
          icon: 'check',
          blocks: [
            { type: 'compare', columns: [
              { title: 'Tření pomáhá', icon: 'check', tone: 'good', points: ['chůze a běh – podrážka se neklouže', 'brzdy kola a auta', 'pneumatiky drží v zatáčce', 'škrtnutí zápalkou', 'uzel na tkaničce drží', 'šroub a hřebík drží ve dřevě'] },
              { title: 'Tření škodí', icon: 'cross', tone: 'bad', points: ['opotřebení bot, pneumatik a součástek', 'zahřívání ložisek a motoru', 'vyšší spotřeba paliva', 'odpor vzduchu brzdí cyklisty a auta'] },
            ] },
            { type: 'p', text: 'Tření mezi pneumatikou a silnicí rozhoduje o tom, jak rychle auto zastaví. Spojme ho se zákonem síly F = m · a.' },
            { type: 'example', title: 'Brzdění na suchu a na mokru', problem: 'Auto o hmotnosti 1 000 kg brzdí tak, že kola se ještě neprotáčejí. Jaké největší zpomalení může mít na suchém asfaltu (f = 0,7) a na mokrém (f = 0,4)? (g = 10 N/kg)', steps: [
              'F_{N} = F_{G} = 1 000 kg · 10 N/kg = 10 000 N',
              'Sucho: F_{t} = 0,7 · 10 000 N = 7 000 N, a = F / m = 7 000 N / 1 000 kg = 7 m/s²',
              'Mokro: F_{t} = 0,4 · 10 000 N = 4 000 N, a = 4 000 N / 1 000 kg = 4 m/s²',
            ], answer: 'Na suchu zpomalí až o 7 m/s², na mokru jen o 4 m/s² – brzdná dráha je skoro dvakrát delší.' },
            { type: 'callout', variant: 'warning', text: 'Na náledí klesne součinitel tření pneumatik na 0,1 i méně. Brzdná dráha je pak několikrát delší. V zimě proto řidiči jezdí pomaleji a dodržují větší odstup.' },
            { type: 'check', question: { kind: 'multi', q: 'Ve kterých situacích je tření užitečné?', options: ['chůze po chodníku', 'brzdění kola', 'opotřebení ložisek v motoru', 'škrtnutí zápalkou', 'zahřívání os vagonu'], answers: [0, 1, 3], explain: 'Bez tření bychom nemohli chodit, brzdit ani zapálit zápalku. Opotřebení a zahřívání součástek jsou naopak škodlivé účinky tření.' } },
          ],
        },
        {
          title: 'Jak tření zmenšit, nebo zvětšit',
          icon: 'drop',
          blocks: [
            { type: 'p', text: 'Inženýři tření neustále ladí: někde ho potřebují co nejmenší, jinde co největší.' },
            { type: 'iconlist', items: [
              { icon: 'oil-barrel', title: 'Mazání', text: 'olej v motoru vytvoří tenkou vrstvu a plochy se nedotýkají přímo (zmenšuje)' },
              { icon: 'gauge', title: 'Ložiska', text: 'smýkání nahradí valení kuliček (zmenšuje)' },
              { icon: 'wind', title: 'Aerodynamický tvar', text: 'auta, vlaky a cyklistické helmy mají zaoblené tvary (zmenšuje odpor)' },
              { icon: 'ship', title: 'Vzduchový polštář', text: 'vznášedlo a stolní hokej plují na vrstvě vzduchu (zmenšuje)' },
              { icon: 'mountain', title: 'Posyp a zimní pneumatiky', text: 'písek na náledí, hluboký vzorek a měkčí guma (zvětšuje)' },
              { icon: 'muscle', title: 'Magnézium', text: 'gymnasté a lezci si jím suší ruce, aby neklouzaly (zvětšuje)' },
            ] },
            { type: 'callout', variant: 'fact', text: 'Cyklisté v pelotonu jedou těsně za sebou. Ten vzadu jede ve „stínu“ vzduchu a potřebuje až o třetinu menší sílu než vedoucí jezdec.' },
            { type: 'game', gameId: 'swipe', text: 'Otestuj se: pravda, nebo lež o síle, tření a Newtonových zákonech.' },
            { type: 'check', question: { kind: 'choice', q: 'Proč se na zledovatělý chodník sype písek?', options: ['zvětší součinitel tření mezi botou a chodníkem', 'zvětší tíhovou sílu chodce', 'roztaví led', 'zmenší styčnou plochu boty'], answer: 0, explain: 'Zrnka písku vytvoří na hladkém ledu nerovnosti, které se zaklesnou do podrážky. Součinitel tření vzroste a boty neujíždějí. Led taje po soli, ne po písku.' } },
          ],
        },
      ],
      summary: [
        'Třecí síla vzniká ve styčné ploše kvůli nerovnostem povrchů a míří vždy proti pohybu.',
        'Klidové tření drží těleso na místě, smykové působí při klouzání a valivé při kutálení; valivé je nejmenší.',
        'Třecí sílu spočítáš jako F_{t} = f · F_{N}; nezávisí na velikosti styčné plochy.',
        'Odpor vzduchu a vody roste s rychlostí a závisí na tvaru, průřezu a hustotě prostředí.',
        'Když odpor vzduchu vyrovná tíhovou sílu, těleso padá stálou mezní rychlostí.',
        'Tření je užitečné při chůzi, brzdění a v pneumatikách, škodí opotřebením a ztrátami energie.',
        'Tření zmenšíme mazáním, ložisky a aerodynamickým tvarem, zvětšíme posypem, vzorkem pneumatik nebo drsnějším povrchem.',
      ],
      quiz: [
        { kind: 'tf', q: 'Třecí síla mezi cihlou a stolem je větší, když cihla leží na své největší stěně.', answer: false, explain: 'Třecí síla nezávisí na velikosti styčné plochy, jen na tlakové síle a materiálech. Tření je v obou polohách stejné.' },
        { kind: 'choice', q: 'Tlačíš bednu po podlaze doprava. Kam míří třecí síla, která na bednu působí?', options: ['doleva', 'doprava', 'svisle nahoru', 'svisle dolů'], answer: 0, explain: 'Tření působí vždy proti pohybu. Bedna jede doprava, tření na ni působí doleva.' },
        { kind: 'number', q: 'Skříň o hmotnosti 80 kg stojí na podlaze, součinitel tření je 0,25. Jak velkou silou ji musíš vodorovně táhnout, aby jela stálou rychlostí? (g = 10 N/kg)', answer: 200, tolerance: 1, unit: 'N', explain: 'F_{N} = 80 kg · 10 N/kg = 800 N, F_{t} = 0,25 · 800 N = 200 N. Při stálé rychlosti musí tah vyrovnat tření.' },
        { kind: 'match', q: 'Přiřaď situaci k druhu odporové síly.', pairs: [
          ['kuličky v ložisku kola', 'valivé tření'],
          ['lyže klouzající po sněhu', 'smykové tření'],
          ['auto zaparkované v kopci se nerozjede', 'klidové tření'],
          ['padající javorový list', 'odpor vzduchu'],
        ], explain: 'Kuličky se valí, lyže kloužou, zaparkované auto drží klidové tření a list brzdí vzduch.' },
        { kind: 'multi', q: 'Na čem závisí odporová síla vzduchu působící na jedoucího cyklistu?', options: ['na jeho rychlosti', 'na tvaru jeho těla a helmy', 'na velikosti jeho průřezu (jak je skrčený)', 'na barvě jeho dresu', 'na tom, jestli má rád sladké'], answers: [0, 1, 2], explain: 'Odpor vzduchu závisí na rychlosti, tvaru, průřezu a hustotě vzduchu. Barva ani chutě na něj vliv nemají.' },
        { kind: 'number', q: 'Bednu o tíze 150 N táhneme po podlaze stálou rychlostí silou 30 N. Jaký je součinitel smykového tření?', answer: 0.2, tolerance: 0.005, explain: 'Při stálé rychlosti je F_{t} = 30 N. f = F_{t} / F_{N} = 30 N / 150 N = 0,2.' },
        { kind: 'choice', q: 'Parašutista padá mezní rychlostí 55 m/s a otevře padák. Co se stane?', options: ['odpor vzduchu převýší tíhovou sílu, parašutista zpomalí a ustálí se na menší mezní rychlosti', 'parašutista začne stoupat vzhůru', 'parašutista se ve vzduchu okamžitě zastaví', 'padá dál stejnou rychlostí, jen bezpečněji'], answer: 0, explain: 'Padák náhle zvětší odpor. Výslednice míří nahoru, parašutista zpomaluje. S menší rychlostí klesá i odpor, až se opět vyrovná s tíhovou silou – asi při 5 m/s.' },
        { kind: 'tf', q: 'Bez tření bychom nemohli normálně chodit.', answer: true, explain: 'Při chůzi tlačíme nohou zem dozadu. Bez tření by noha jen podklouzla, jako na dokonale hladkém ledu.' },
      ],
    },

    // ───────────────────────────────────────────────────────────── f2-7
    'f2-7': {
      id: 'f2-7',
      title: 'Otáčivé účinky síly: páka a kladka',
      goals: [
        'Spočítat moment síly M = F · d a vysvětlit, proč je klika dveří daleko od pantů',
        'Použít podmínku rovnováhy na páce F_{1} · d_{1} = F_{2} · d_{2}',
        'Poznat jednozvratnou a dvojzvratnou páku v nástrojích i v lidském těle',
        'Popsat pevnou a volnou kladku a kladkostroj a vysvětlit zlaté pravidlo mechaniky',
      ],
      hook: 'Archimédés prý řekl: „Dejte mi pevný bod a pohnu Zemí.“ Nepotřeboval by k tomu obří svaly, jen hodně dlouhou páku. Dnes zjistíš, jak malá síla zvedne velké břemeno – a co za to zaplatíš.',
      sections: [
        {
          title: 'Moment síly: M = F · d',
          icon: 'vector',
          blocks: [
            { type: 'p', text: 'Síla umí těleso nejen posunout, ale i **otočit** kolem osy: dveře kolem pantů, matici kolem šroubu, volant kolem hřídele. Otáčivý účinek síly popisuje **moment síly** M.' },
            { type: 'formula', text: 'M = F · d', caption: 'M … moment síly (N·m), F … velikost síly (N), d … rameno síly: kolmá vzdálenost osy otáčení od přímky, ve které síla působí (m)' },
            { type: 'iconlist', items: [
              { icon: 'lever', title: 'Klika dveří', text: 'je co nejdál od pantů – velké rameno, stačí malá síla' },
              { icon: 'gauge', title: 'Volant', text: 'větší volant = delší rameno = snazší zatáčení (proto ho měly velký staré autobusy bez posilovače)' },
              { icon: 'arrow-cycle', title: 'Pedál kola', text: 'nejsnáz se šlape, když je klika vodorovně – rameno je největší' },
              { icon: 'pencil', title: 'Šroubovák', text: 'tlustá rukojeť se točí snáz než tenká' },
            ] },
            { type: 'example', title: 'Klíč na matice', problem: 'Mechanik působí na konec klíče dlouhého 25 cm silou 80 N kolmo na klíč. Jaký je moment síly? A jak dlouhý klíč by potřeboval, aby stejnou silou vyvinul 40 N·m?', steps: [
              'd = 25 cm = 0,25 m',
              'M = F · d = 80 N · 0,25 m = 20 N·m',
              'Pro 40 N·m: d = M / F = 40 N·m / 80 N = 0,5 m',
            ], answer: 'M = 20 N·m; na dvojnásobný moment stačí dvakrát delší klíč (50 cm), třeba s nasazenou trubkou.' },
            { type: 'callout', variant: 'warning', text: 'Rameno je **kolmá** vzdálenost osy od přímky síly. Když zatlačíš na dveře ve směru k pantům, rameno je nulové a dveře se nepohnou, ať tlačíš sebevíc.' },
            { type: 'check', question: { kind: 'number', q: 'Jakou silou musíš tlačit kolmo na dveře ve vzdálenosti 0,8 m od pantů, aby moment síly byl 12 N·m?', answer: 15, tolerance: 0.05, unit: 'N', explain: 'F = M / d = 12 N·m / 0,8 m = 15 N.' } },
          ],
        },
        {
          title: 'Páka v rovnováze',
          icon: 'balance-scale',
          blocks: [
            { type: 'p', text: '**Páka** je tuhá tyč, která se může otáčet kolem pevné osy. Je v rovnováze, když se momenty sil, které ji otáčejí na jednu a na druhou stranu, rovnají.' },
            { type: 'p', text: 'Místo, kde se páka otáčí, se nazývá **osa otáčení** (nebo opěrný bod). Vzdálenosti sil od osy jsou **ramena** d_{1} a d_{2}.' },
            { type: 'formula', text: 'F_{1} · d_{1} = F_{2} · d_{2}', caption: 'podmínka rovnováhy na páce: moment otáčející na jednu stranu = moment otáčející na druhou stranu' },
            { type: 'diagram', id: 'torque-balance', caption: 'Houpačka v rovnováze: těžší táta sedí blíž k ose, lehčí dcera dál. Momenty obou jsou stejné.' },
            { type: 'example', title: 'Houpačka', problem: 'Táta s tíhou 750 N sedí 1 m od osy houpačky. Jak daleko od osy si musí na druhou stranu sednout Eliška s tíhou 300 N, aby byla houpačka v rovnováze?', steps: [
              'F_{1} · d_{1} = F_{2} · d_{2}',
              '750 N · 1 m = 300 N · d_{2}',
              'd_{2} = 750 N·m / 300 N = 2,5 m',
            ], answer: 'Eliška musí sedět 2,5 m od osy.' },
            { type: 'graph', x: { label: 'd', unit: 'm', min: 0, max: 3, step: 0.5 }, y: { label: 'F', unit: 'N', min: 0, max: 250, step: 50 }, series: [
              { label: 'síla potřebná pro moment 120 N·m', points: [[0.5, 240], [0.6, 200], [0.75, 160], [1, 120], [1.25, 96], [1.5, 80], [2, 60], [2.5, 48], [3, 40]], style: 'smooth' },
            ], marks: [{ x: 1, y: 120, label: '1 m → 120 N' }, { x: 2, y: 60, label: '2 m → 60 N' }], caption: 'Jakou silou vyvineš moment 120 N·m: čím delší rameno, tím menší síla. Dvojnásobné rameno = poloviční síla.' },
            { type: 'check', question: { kind: 'number', q: 'Na jedné straně páky visí 2 m od osy závaží s tíhou 30 N. Jak velkou silou musíš působit na druhé straně ve vzdálenosti 0,5 m od osy, aby byla páka v rovnováze?', answer: 120, tolerance: 0.5, unit: 'N', explain: '30 N · 2 m = F · 0,5 m, tedy F = 60 N·m / 0,5 m = 120 N. Kratší rameno vyžaduje větší sílu.' } },
          ],
        },
        {
          title: 'Páky v nástrojích i v těle',
          icon: 'bone',
          blocks: [
            { type: 'keyterms', items: [
              { term: '**Dvojzvratná páka**', def: 'osa leží mezi oběma silami: houpačka, nůžky, kleště, páčidlo, rovnoramenné váhy' },
              { term: '**Jednozvratná páka**', def: 'osa je na kraji a obě síly působí na stejné straně od ní: kolečko (trakař), louskáček, otvírák lahví, pinzeta, předloktí' },
            ] },
            { type: 'diagram', id: 'lever-types', caption: 'Tři uspořádání páky podle polohy osy, síly a břemene. V české škole se druhé a třetí uspořádání společně nazývají páka jednozvratná.' },
            { type: 'flipcards', cards: [
              { icon: 'lever', title: 'Houpačka', text: 'Dvojzvratná páka: osa uprostřed, děti na obou stranách. Lehčí dítě si sedne dál od osy.' },
              { icon: 'plastic-bottle', title: 'Otvírák lahví', text: 'Jednozvratná páka: osa je na okraji víčka, víčko tlačí kousek od ní a ruka táhne daleko na konci. Malá síla ruky, velká síla na víčko.' },
              { icon: 'muscle', title: 'Předloktí', text: 'Jednozvratná páka: osou je loket, biceps táhne jen asi 4 cm od lokte, břemeno je v dlani daleko. Sval musí vyvinout mnohem větší sílu, ale ruka se zato pohybuje rychle a daleko.' },
              { icon: 'balance-scale', title: 'Rovnoramenné váhy', text: 'Dvojzvratná páka se stejně dlouhými rameny: rovnováha nastane, když jsou na obou miskách stejné tíhy.' },
            ], caption: 'Klepni na kartu a zjisti, jak páka pracuje.' },
            { type: 'example', title: 'Biceps', problem: 'Držíš v dlani činku s tíhou 50 N ve vzdálenosti 32 cm od lokte. Biceps se upíná 4 cm od lokte. Jak velkou silou musí sval táhnout?', steps: [
              'Osa je loket: F_{sval} · d_{sval} = F_{činka} · d_{činka}',
              'F_{sval} · 4 cm = 50 N · 32 cm',
              'F_{sval} = 1 600 N·cm / 4 cm = 400 N',
            ], answer: 'Sval táhne silou 400 N – osmkrát větší, než je tíha činky. Za to se dlaň pohybuje osmkrát dál a rychleji než úpon svalu.' },
            { type: 'callout', variant: 'tip', text: 'Ramena na obou stranách můžeš dosadit v centimetrech, když použiješ stejnou jednotku na obou stranách rovnice – krátí se.' },
            { type: 'check', question: { kind: 'choice', q: 'Který z nástrojů je jednozvratná páka?', options: ['zahradní kolečko (trakař)', 'nůžky', 'houpačka', 'kleště'], answer: 0, explain: 'U trakaře je osa (kolo) na kraji, náklad je uprostřed a ruce zvedají na konci – obě síly jsou na stejné straně osy. Nůžky, houpačka a kleště mají osu mezi silami.' } },
          ],
        },
        {
          title: 'Pevná kladka',
          icon: 'pulley',
          blocks: [
            { type: 'p', text: '**Kladka** je kolo s drážkou pro lano, které se otáčí kolem osy. Funguje jako dvojzvratná páka se stejně dlouhými rameny. **Pevná kladka** je upevněná na místě a nesjíždí s břemenem.' },
            { type: 'diagram', id: 'pulley-systems', caption: 'Pevná kladka, volná kladka a kladkostroj. Každý zvedá stejné břemeno, ale potřebuje jinou sílu.' },
            { type: 'p', text: 'Pevná kladka ==mění jen směr síly, ne její velikost==: F = F_{G}. Proč ji tedy používáme? Táhnout lano dolů je pohodlnější než zvedat břemeno nahoru – můžeš se do lana opřít vlastní vahou.' },
            { type: 'iconlist', items: [
              { icon: 'drop', title: 'Studna', text: 'vědro na laně přes kladku nad studnou' },
              { icon: 'star', title: 'Stožár s vlajkou', text: 'lanko vede přes kladku na vrcholu, vlajku vytáhneš zdola' },
              { icon: 'muscle', title: 'Posilovna', text: 'kladkové stroje mění směr tahu závaží' },
              { icon: 'ship', title: 'Plachetnice', text: 'lana plachet vedou přes kladky k palubě' },
            ] },
            { type: 'example', title: 'Vědro ze studny', problem: 'Vytahuješ ze studny přes pevnou kladku vědro s vodou o hmotnosti 12 kg. Jakou silou táhneš lano a kolik lana vytáhneš, když je voda 8 m hluboko? (g = 10 N/kg, tření zanedbej)', steps: [
              'F_{G} = 12 kg · 10 N/kg = 120 N',
              'Pevná kladka sílu nezmenší: F = 120 N.',
              'Vědro stoupne o 8 m, lano vytáhneš také 8 m.',
            ], answer: 'Táhneš silou 120 N a vytáhneš 8 m lana – jen místo zvedání nahoru taháš dolů.' },
            { type: 'check', question: { kind: 'tf', q: 'Pevná kladka zmenší sílu potřebnou ke zvednutí břemene na polovinu.', answer: false, explain: 'Pevná kladka mění jen směr síly. Na zvednutí břemene s tíhou 200 N potřebuješ i s kladkou 200 N (bez tření).' } },
          ],
        },
        {
          title: 'Volná kladka a kladkostroj',
          icon: 'pulley',
          blocks: [
            { type: 'p', text: '**Volná kladka** se pohybuje spolu s břemenem. Břemeno visí na **dvou** úsecích lana a každý z nich nese polovinu tíhy. Síla potřebná ke zvedání je tedy poloviční.' },
            { type: 'forces', body: 'box', surface: 'none', forces: [
              { label: 'F_{lano}', angle: 90, size: 2, from: 'left' },
              { label: 'F_{lano}', angle: 90, size: 2, from: 'right' },
              { label: 'F_{G}', angle: 270, size: 4 },
            ], resultant: true, caption: 'Břemeno na volné kladce visí na dvou úsecích lana. Každý táhne nahoru polovinou tíhové síly, dohromady ji vyrovnají.' },
            { type: 'p', text: '**Kladkostroj** spojuje několik pevných a volných kladek. Břemeno pak visí na více nosných lanech a potřebná síla je ještě menší.' },
            { type: 'formula', text: 'F = F_{G} / n', caption: 'n … počet nosných lan (úseků lana, na kterých břemeno visí); hmotnost kladek a tření zanedbáváme' },
            { type: 'example', title: 'Kladkostroj na stavbě', problem: 'Stavbař zvedá kladkostrojem se 4 nosnými lany pytel cementu o hmotnosti 60 kg do výšky 2 m. Jakou silou táhne a kolik lana musí vytáhnout? (g = 10 N/kg)', steps: [
              'F_{G} = 60 kg · 10 N/kg = 600 N',
              'F = F_{G} / n = 600 N / 4 = 150 N',
              'Každé ze 4 nosných lan se musí zkrátit o 2 m, takže vytáhne 4 · 2 m = 8 m lana.',
            ], answer: 'Táhne silou 150 N a vytáhne 8 m lana.' },
            { type: 'callout', variant: 'warning', text: 'Počítej jen **nosná** lana, tedy úseky lana, které vedou od volné kladky s břemenem nahoru. Volný konec, za který taháš dolů, se nepočítá, pokud nevede přímo z kladky s břemenem.' },
            { type: 'callout', variant: 'fact', text: 'Velké stavební jeřáby mají v kladnici i desítky nosných lan. Díky tomu stačí relativně slabý naviják, aby zvedl několik tun.' },
            { type: 'check', question: { kind: 'number', q: 'Břemeno s tíhou 900 N visí na kladkostroji se 6 nosnými lany. Jak velkou silou musíš táhnout za volný konec lana?', answer: 150, tolerance: 0.5, unit: 'N', explain: 'F = F_{G} / n = 900 N / 6 = 150 N.' } },
          ],
        },
        {
          title: 'Zlaté pravidlo mechaniky',
          icon: 'trophy',
          blocks: [
            { type: 'callout', variant: 'remember', title: 'Zlaté pravidlo mechaniky', text: '==Co získáš na síle, ztratíš na dráze.== Jednoduchý stroj zmenší potřebnou sílu, ale stejně krát prodlouží dráhu, po které musíš působit: F_{1} · s_{1} = F_{2} · s_{2}.' },
            { type: 'compare', columns: [
              { title: 'Bez kladkostroje', icon: 'muscle', tone: 'a', points: ['síla 600 N', 'dráha 2 m', 'F · s = 1 200 N·m'] },
              { title: 'Kladkostroj se 4 lany', icon: 'pulley', tone: 'b', points: ['síla 150 N', 'dráha 8 m', 'F · s = 1 200 N·m'] },
            ], caption: 'Zvedání 60 kg do výšky 2 m. Síla je čtyřikrát menší, dráha čtyřikrát delší – součin zůstává stejný.' },
            { type: 'example', title: 'Páčidlo', problem: 'Páčidlem zvedáš kámen s tíhou 1 000 N. Rameno síly je 1,5 m, rameno břemene 0,3 m. Jakou silou tlačíš? O kolik musíš posunout ruku, aby se kámen zvedl o 4 cm?', steps: [
              'F · 1,5 m = 1 000 N · 0,3 m, tedy F = 300 N·m / 1,5 m = 200 N',
              'Síla je pětkrát menší (1,5 : 0,3 = 5), dráha ruky musí být pětkrát delší.',
              's_{ruka} = 5 · 4 cm = 20 cm',
            ], answer: 'Tlačíš silou 200 N a ruka se posune o 20 cm.' },
            { type: 'p', text: 'Součin síly a dráhy je ve fyzice důležitá veličina – **práce**. Zlaté pravidlo tedy říká, že **žádný stroj práci neušetří**, jen ji rozloží na menší sílu po delší dráze. S prací a energií se podrobně setkáš v lekci o práci a výkonu (úroveň 3).' },
            { type: 'callout', variant: 'mascot', text: 'Takže Archimédés by opravdu pohnul Zemí. Jen by musel svou páku tlačit po dráze delší, než je celý vesmír. Nevadí, dám si radši klacek a kámen na zahradě.' },
            { type: 'check', question: { kind: 'tf', q: 'S kladkostrojem zvedneš břemeno menší silou, ale musíš vytáhnout delší lano.', answer: true, explain: 'Zlaté pravidlo mechaniky: kolikrát menší síla, tolikrát delší dráha. Se 4 nosnými lany potřebuješ čtvrtinovou sílu, ale čtyřikrát delší lano.' } },
          ],
        },
      ],
      summary: [
        'Otáčivý účinek síly popisuje moment síly M = F · d, kde d je kolmá vzdálenost osy od přímky síly.',
        'Páka je v rovnováze, když F_{1} · d_{1} = F_{2} · d_{2}; delší rameno znamená menší potřebnou sílu.',
        'U dvojzvratné páky leží osa mezi silami (houpačka, nůžky), u jednozvratné je na kraji (trakař, louskáček, předloktí).',
        'Pevná kladka mění jen směr síly, volná kladka ji zmenší na polovinu.',
        'Kladkostroj s n nosnými lany zmenší potřebnou sílu na F = F_{G} / n.',
        'Zlaté pravidlo mechaniky: co získáš na síle, ztratíš na dráze, takže stroje práci neušetří.',
      ],
      quiz: [
        { kind: 'tf', q: 'Kliku dveří dáváme co nejdál od pantů, aby k otevření stačila menší síla.', answer: true, explain: 'Větší rameno dává stejný moment síly při menší síle: M = F · d.' },
        { kind: 'choice', q: 'Jaká je jednotka momentu síly?', options: ['newtonmetr (N·m)', 'newton na metr (N/m)', 'newton (N)', 'kilogram metr (kg·m)'], answer: 0, explain: 'M = F · d, tedy newton krát metr: N·m.' },
        { kind: 'number', q: 'Na klíč působíš silou 40 N ve vzdálenosti 0,3 m od osy šroubu, kolmo na klíč. Jak velký je moment síly?', answer: 12, tolerance: 0.05, unit: 'N·m', explain: 'M = F · d = 40 N · 0,3 m = 12 N·m.' },
        { kind: 'number', q: 'Břemeno s tíhou 600 N je 0,2 m od osy páky. Na druhé straně tlačíš ve vzdálenosti 1,2 m od osy. Jak velkou silou musíš tlačit, aby byla páka v rovnováze?', answer: 100, tolerance: 0.5, unit: 'N', explain: 'F · 1,2 m = 600 N · 0,2 m = 120 N·m, tedy F = 120 N·m / 1,2 m = 100 N.' },
        { kind: 'match', q: 'Přiřaď jednoduchý stroj k tomu, co dělá.', pairs: [
          ['pevná kladka', 'mění jen směr síly'],
          ['volná kladka', 'poloviční síla, dvojnásobná dráha'],
          ['kladkostroj se 4 nosnými lany', 'čtvrtinová síla, čtyřnásobná dráha'],
          ['páka s ramenem síly 5× delším než rameno břemene', 'pětkrát menší síla'],
        ], explain: 'Všechny stroje kromě pevné kladky zmenšují sílu – a přesně stejněkrát prodlužují dráhu.' },
        { kind: 'choice', q: 'Na houpačce sedí Ondra s tíhou 400 N ve vzdálenosti 1,5 m od osy. Kam si má sednout táta s tíhou 800 N, aby byla houpačka v rovnováze?', options: ['0,75 m od osy na druhé straně', '3 m od osy na druhé straně', '1,5 m od osy na druhé straně', '0,75 m od osy na stejné straně jako Ondra'], answer: 0, explain: '400 N · 1,5 m = 800 N · d, d = 600 N·m / 800 N = 0,75 m. Musí sedět na druhé straně, aby otáčel houpačkou opačným směrem.' },
        { kind: 'multi', q: 'Které z těchto předmětů fungují jako páka?', options: ['nůžky', 'kleště', 'otvírák lahví', 'teploměr', 'odměrný válec'], answers: [0, 1, 2], explain: 'Nůžky a kleště jsou dvojzvratné páky, otvírák lahví jednozvratná. Teploměr a odměrný válec jsou měřidla, žádná osa otáčení tam nepracuje.' },
        { kind: 'number', q: 'Kolik metrů lana musíš vytáhnout, abys kladkostrojem se 3 nosnými lany zvedl náklad o 1,5 m?', answer: 4.5, tolerance: 0.05, unit: 'm', explain: 'Každé ze 3 nosných lan se zkrátí o 1,5 m, celkem vytáhneš 3 · 1,5 m = 4,5 m. Síla je za to třikrát menší.' },
      ],
    },
  },

  boss: [
    { kind: 'number', q: 'Gepard běží rychlostí 30 m/s. Kolik je to km/h?', answer: 108, tolerance: 0.5, unit: 'km/h', explain: '30 · 3,6 = 108 km/h.' },
    { kind: 'choice', q: 'Graf dráhy s–t je stoupající přímka vycházející z počátku. Jaký pohyb popisuje?', options: ['rovnoměrný pohyb', 'rovnoměrně zrychlený pohyb', 'těleso stojí', 'těleso brzdí'], answer: 0, explain: 'Přímka v grafu s–t znamená, že dráha přibývá stále stejně rychle – rychlost je stálá.' },
    { kind: 'number', q: 'Autobus se rovnoměrně rozjíždí z klidu na 12 m/s za 8 s a pak jede 10 s stálou rychlostí 12 m/s. Jakou dráhu celkem ujede? (Pomoz si plochou pod grafem v–t.)', answer: 168, tolerance: 1, unit: 'm', explain: 'Trojúhelník: ½ · 8 s · 12 m/s = 48 m. Obdélník: 12 m/s · 10 s = 120 m. Celkem 168 m.' },
    { kind: 'number', q: 'Vlak ujel 90 km za 1 h, pak 30 minut stál ve stanici a nakonec ujel 60 km za 1 h. Jaká byla jeho průměrná rychlost v km/h?', answer: 60, tolerance: 0.5, unit: 'km/h', explain: 's = 150 km, t = 1 + 0,5 + 1 = 2,5 h, v_{p} = 150 km / 2,5 h = 60 km/h.' },
    { kind: 'tf', q: 'Siloměr se stejným závažím ukáže na Měsíci asi šestkrát menší hodnotu než na Zemi.', answer: true, explain: 'Tíhové zrychlení na Měsíci je 1,62 N/kg, asi šestkrát menší než 9,81 N/kg. Hmotnost závaží se ale nemění.' },
    { kind: 'number', q: 'Na Marsu (g = 3,7 N/kg) působí na vozítko tíhová síla 740 N. Jakou má vozítko hmotnost?', answer: 200, tolerance: 0.5, unit: 'kg', explain: 'm = F_{G} / g = 740 N / 3,7 N/kg = 200 kg. Na Zemi by stejné vozítko mělo tíhovou sílu asi 2 000 N.' },
    { kind: 'choice', q: 'Na krabici působí síla 12 N doprava a síla 5 N doleva. Jaká je výslednice?', options: ['7 N doprava', '17 N doprava', '7 N doleva', '13 N doprava'], answer: 0, explain: 'Opačné síly se odečítají: 12 N − 5 N = 7 N, ve směru větší síly, tedy doprava.' },
    { kind: 'multi', q: 'Která tvrzení o síle a pohybu jsou pravdivá?', options: ['těleso, na které nepůsobí výsledná síla, může jet stálou rychlostí', 'akce a reakce působí vždy na různá tělesa', 'při stejné síle získá těleso s větší hmotností menší zrychlení', 'když přestane působit síla, pohyb vždy sám zanikne', 'při srážce působí těžší těleso na lehčí větší silou než lehčí na těžší'], answers: [0, 1, 2], explain: 'První tři tvrzení jsou Newtonovy zákony. Pohyb bez síly nezaniká (zastavuje ho tření) a akce a reakce jsou vždy stejně velké, i při srážce kamionu s autem.' },
    { kind: 'number', q: 'Motorový člun o hmotnosti 200 kg tlačí motor silou 500 N, voda mu klade odpor 100 N. Jaké má člun zrychlení?', answer: 2, tolerance: 0.05, unit: 'm/s²', explain: 'Výslednice F = 500 N − 100 N = 400 N, a = F / m = 400 N / 200 kg = 2 m/s².' },
    { kind: 'number', q: 'Sáňky s dítětem mají hmotnost 30 kg, součinitel tření na sněhu je 0,1. Jakou vodorovnou silou je musíš táhnout, aby jely stálou rychlostí? (g = 10 N/kg)', answer: 30, tolerance: 0.5, unit: 'N', explain: 'F_{N} = 30 kg · 10 N/kg = 300 N, F_{t} = 0,1 · 300 N = 30 N. Při stálé rychlosti se tah rovná třecí síle.' },
    { kind: 'number', q: 'Páčidlem zvedáš kámen s tíhou 2 400 N. Rameno břemene je 0,3 m, rameno síly 1,2 m. Jak velkou silou musíš tlačit?', answer: 600, tolerance: 1, unit: 'N', explain: 'F · 1,2 m = 2 400 N · 0,3 m = 720 N·m, tedy F = 720 N·m / 1,2 m = 600 N.' },
    { kind: 'order', q: 'Seřaď způsoby zvedání břemene o hmotnosti 120 kg od nejmenší potřebné síly po největší (tření a hmotnost kladek zanedbej).', items: ['kladkostroj se 6 nosnými lany', 'kladkostroj se 4 nosnými lany', 'volná kladka', 'pevná kladka'], explain: 'F_{G} = 1 200 N. Kladkostroj se 6 lany: 200 N, se 4 lany: 300 N, volná kladka: 600 N, pevná kladka: 1 200 N (mění jen směr).' },
  ],
}

export default level
