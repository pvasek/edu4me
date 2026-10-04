/**
 * Určovací klíč – one dichotomous key per level (spec/courses/biologie/games.md):
 * 1 groups of organisms · 2 microorganisms, fungi, lichens · 3 plants and families ·
 * 4 invertebrates · 5 vertebrates.
 *
 * Every organism carries its real features (`t`: trait id → true/false; a missing trait
 * means "does not apply / not clear-cut" and is never asked about that organism).
 * The path through the key, the name at the end and every answer of the reverse task
 * are computed from these features in logic.ts; the tests check that the key leads
 * every organism to itself.
 */

export type PicId =
  // level 1
  | 'ecoli'
  | 'trepka'
  | 'menavka'
  | 'kvasinka'
  | 'hrib'
  | 'smrk'
  | 'sedmikraska'
  | 'zizala'
  | 'slunecko'
  | 'veverka'
  // level 2
  | 'virus'
  | 'nostoc'
  | 'borelie'
  | 'krasnoocko'
  | 'stetickovec'
  | 'muchomurka'
  | 'tercovnik'
  // level 3
  | 'raselinik'
  | 'kaprad'
  | 'preslicka'
  | 'borovice'
  | 'modrin'
  | 'lilie'
  | 'psenice'
  | 'smetanka'
  | 'hrach'
  | 'kokoska'
  | 'hluchavka'
  | 'ruze'
  // level 4
  | 'houba'
  | 'nezmar'
  | 'hvezdice'
  | 'plostenka'
  | 'skrkavka'
  | 'hlemyzd'
  | 'skeble'
  | 'rak'
  | 'stonozka'
  | 'krizak'
  | 'kliste'
  | 'vcela'
  // level 5
  | 'macka'
  | 'kapr'
  | 'colek'
  | 'skokan'
  | 'jesterka'
  | 'uzovka'
  | 'zmije'
  | 'kane'
  | 'kos'
  | 'netopyr'
  | 'srnec'
  | 'jezek'
  | 'liska'
  | 'mys'

export interface Trait {
  id: string
  /** The couplet as a question ("Má páteř?"), used in the reverse task. */
  q: string
  /** Lead "a" as a predicate that follows a name: "má páteř". */
  yes: string
  /** Lead "b": "nemá páteř". */
  no: string
  /** One line why the feature matters (shown after a wrong step). */
  why: string
}

export interface Organism {
  id: string
  /** Czech name (nominative). */
  name: string
  latin: string
  /** Group in Czech, shown when the organism is named ("savec – šelma"). */
  group: string
  pic: PicId
  /** Seen under a microscope (the picture is a field of view). */
  micro?: boolean
  /** What the learner can see or knows about it (2–3 short notes, no name). */
  look: string[]
  /** Real features: trait id → true/false. Missing = not applicable. */
  t: Record<string, boolean>
}

export type KeyNode = string | { t: string; yes: KeyNode; no: KeyNode }

export interface KeySet {
  level: number
  /** Title of the key ("Klíč k říším organismů"). */
  title: string
  traits: Trait[]
  organisms: Organism[]
  key: KeyNode
}

const k = (t: string, yes: KeyNode, no: KeyNode): KeyNode => ({ t, yes, no })

/* ------------------------------------------------------------------ level 1 */

const L1: KeySet = {
  level: 1,
  title: 'Klíč k hlavním skupinám organismů',
  traits: [
    { id: 'jadro', q: 'Mají buňky jádro?', yes: 'má buňky s jádrem', no: 'má buňky bez jádra', why: 'Buňka bez jádra je prokaryotní – tak vypadají bakterie.' },
    { id: 'jedna', q: 'Tvoří celé tělo jediná buňka?', yes: 'je celý jen jedna buňka', no: 'má tělo z mnoha buněk', why: 'Jednobuněčné organismy uvidíš jen mikroskopem.' },
    { id: 'stena', q: 'Má buňky s pevnou buněčnou stěnou?', yes: 'má buňky s buněčnou stěnou', no: 'má buňky bez buněčné stěny', why: 'Stěnu mají bakterie, houby i rostliny, živočišné buňky ne.' },
    { id: 'brvy', q: 'Je buňka pokrytá brvami?', yes: 'je pokrytý brvami', no: 'nemá brvy', why: 'Brvy jsou krátká vlákénka po celém povrchu, buňka jimi vesluje.' },
    { id: 'zeleny', q: 'Má chloroplasty a fotosyntetizuje?', yes: 'má chloroplasty a fotosyntetizuje', no: 'nemá chloroplasty', why: 'Zelené chloroplasty mají rostliny – vyrábějí si v nich potravu pomocí světla.' },
    { id: 'jehlice', q: 'Má jehlice a šišky?', yes: 'má jehlice a šišky', no: 'nemá jehlice ani šišky', why: 'Jehlice a šišky mají jehličnany – nahosemenné rostliny.' },
    { id: 'pater', q: 'Má páteř?', yes: 'má páteř', no: 'nemá páteř', why: 'Páteř z obratlů je znak obratlovců.' },
    { id: 'exo', q: 'Má vnější kostru a článkované nohy?', yes: 'má vnější kostru a článkované nohy', no: 'nemá vnější kostru ani článkované nohy', why: 'Tvrdý pokryv těla a nohy z článků mají členovci, třeba hmyz.' },
  ],
  organisms: [
    { id: 'ecoli', name: 'Escherichia coli', latin: 'Escherichia coli', group: 'bakterie', pic: 'ecoli', micro: true, look: ['tyčinka dlouhá 2 µm', 'DNA volně v cytoplazmě', 'bičíky, pevná stěna'], t: { jadro: false, jedna: true, stena: true, brvy: false, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'trepka', name: 'trepka velká', latin: 'Paramecium caudatum', group: 'prvok', pic: 'trepka', micro: true, look: ['jedna buňka tvaru střevíčku', 'po povrchu tisíce brv', 'velké jádro uprostřed'], t: { jadro: true, jedna: true, stena: false, brvy: true, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'menavka', name: 'měňavka velká', latin: 'Amoeba proteus', group: 'prvok', pic: 'menavka', micro: true, look: ['jedna buňka bez stálého tvaru', 'leze pomocí panožek', 'jádro, potravní vakuoly'], t: { jadro: true, jedna: true, stena: false, brvy: false, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'kvasinka', name: 'kvasinka pivní', latin: 'Saccharomyces cerevisiae', group: 'houba (jednobuněčná)', pic: 'kvasinka', micro: true, look: ['oválná buňka s pevnou stěnou', 'množí se pučením', 'jádro, bez chloroplastů'], t: { jadro: true, jedna: true, stena: true, brvy: false, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'hrib', name: 'hřib smrkový', latin: 'Boletus edulis', group: 'houba', pic: 'hrib', look: ['hnědý klobouk na tlustém třeni', 'není zelený, živí se látkami z půdy', 'buňky mají stěnu z chitinu'], t: { jadro: true, jedna: false, stena: true, brvy: false, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'smrk', name: 'smrk ztepilý', latin: 'Picea abies', group: 'rostlina – jehličnan', pic: 'smrk', look: ['strom vysoký až 50 m', 'zelené jehlice', 'šišky visí dolů'], t: { jadro: true, jedna: false, stena: true, brvy: false, zeleny: true, jehlice: true, pater: false, exo: false } },
    { id: 'sedmikraska', name: 'sedmikráska chudobka', latin: 'Bellis perennis', group: 'rostlina – kvetoucí', pic: 'sedmikraska', look: ['bílé a žluté květy v trávníku', 'zelené listy v přízemní růžici', 'žádné jehlice'], t: { jadro: true, jedna: false, stena: true, brvy: false, zeleny: true, jehlice: false, pater: false, exo: false } },
    { id: 'zizala', name: 'žížala obecná', latin: 'Lumbricus terrestris', group: 'živočich – kroužkovec', pic: 'zizala', look: ['měkké tělo z kroužků', 'žádná kostra ani nohy', 'žije v půdě'], t: { jadro: true, jedna: false, stena: false, brvy: false, zeleny: false, jehlice: false, pater: false, exo: false } },
    { id: 'slunecko', name: 'slunéčko sedmitečné', latin: 'Coccinella septempunctata', group: 'živočich – hmyz', pic: 'slunecko', look: ['červené krovky se 7 tečkami', 'tvrdý pokryv těla', '6 nohou z článků'], t: { jadro: true, jedna: false, stena: false, brvy: false, zeleny: false, jehlice: false, pater: false, exo: true } },
    { id: 'veverka', name: 'veverka obecná', latin: 'Sciurus vulgaris', group: 'živočich – savec', pic: 'veverka', look: ['rezavá srst a huňatý ocas', 'kostra uvnitř těla', 'šplhá po stromech'], t: { jadro: true, jedna: false, stena: false, brvy: false, zeleny: false, jehlice: false, pater: true, exo: false } },
  ],
  key: k(
    'jadro',
    k(
      'jedna',
      k('stena', 'kvasinka', k('brvy', 'trepka', 'menavka')),
      k('zeleny', k('jehlice', 'smrk', 'sedmikraska'), k('stena', 'hrib', k('pater', 'veverka', k('exo', 'slunecko', 'zizala')))),
    ),
    'ecoli',
  ),
}

/* ------------------------------------------------------------------ level 2 */

const L2: KeySet = {
  level: 2,
  title: 'Klíč k mikroorganismům, houbám a lišejníkům',
  traits: [
    { id: 'bunka', q: 'Je tvořen buňkami?', yes: 'je tvořen buňkou nebo buňkami', no: 'není buňka, jen obal s dědičnou informací', why: 'Virus nemá buňku ani vlastní metabolismus, množí se jen uvnitř cizích buněk.' },
    { id: 'jadro', q: 'Mají buňky jádro?', yes: 'má buňky s jádrem', no: 'má buňky bez jádra', why: 'Bez jádra jsou prokaryota: bakterie a sinice.' },
    { id: 'foto', q: 'Fotosyntetizuje (má chlorofyl)?', yes: 'fotosyntetizuje', no: 'nefotosyntetizuje', why: 'Zelený chlorofyl mají sinice, řasy, rostliny i někteří prvoci.' },
    { id: 'souziti', q: 'Je jeho tělo soužitím houby a řasy?', yes: 'je soužitím houby a řasy', no: 'není soužitím dvou organismů', why: 'Lišejník = houba + řasa nebo sinice, které žijí v symbióze.' },
    { id: 'jedna', q: 'Tvoří celé tělo jediná buňka?', yes: 'je jen jedna buňka', no: 'má tělo z mnoha buněk', why: 'Jednobuněčné jsou kvasinky i prvoci, plísně a houby s plodnicí ne.' },
    { id: 'stena', q: 'Má buňka pevnou buněčnou stěnu?', yes: 'má buněčnou stěnu', no: 'nemá buněčnou stěnu', why: 'Kvasinka má pevnou buněčnou stěnu, měňavka jen tenkou membránu.' },
    { id: 'plodnice', q: 'Tvoří plodnici s kloboukem a třeněm?', yes: 'tvoří plodnici s kloboukem', no: 'netvoří plodnici', why: 'Plíseň tvoří jen podhoubí a výtrusy, „houba“ v košíku je plodnice.' },
    { id: 'rourky', q: 'Má pod kloboukem rourky?', yes: 'má pod kloboukem rourky', no: 'má pod kloboukem lupeny', why: 'Hřiby mají rourky (zespodu jako mycí houba), muchomůrky lupeny.' },
  ],
  organisms: [
    { id: 'virus', name: 'virus chřipky A', latin: 'Alphainfluenzavirus influenzae', group: 'virus', pic: 'virus', micro: true, look: ['kulička 0,1 µm (elektronový mikroskop)', 'obal s výběžky, uvnitř RNA', 'žádná buňka, žádný metabolismus'], t: { bunka: false, foto: false, souziti: false, stena: false, plodnice: false } },
    { id: 'nostoc', name: 'nostoc obecný', latin: 'Nostoc commune', group: 'sinice', pic: 'nostoc', micro: true, look: ['řetízky kulatých buněk v slizu', 'buňky bez jádra', 'chlorofyl a modrý fykocyanin'], t: { bunka: true, jadro: false, foto: true, souziti: false, stena: true, plodnice: false } },
    { id: 'borelie', name: 'borelie', latin: 'Borrelia burgdorferi', group: 'bakterie', pic: 'borelie', micro: true, look: ['šroubovitá buňka bez jádra', 'přenáší ji klíště', 'nemá chlorofyl'], t: { bunka: true, jadro: false, foto: false, souziti: false, jedna: true, stena: true, plodnice: false } },
    { id: 'krasnoocko', name: 'krásnoočko zelené', latin: 'Euglena viridis', group: 'prvok (bičíkovec)', pic: 'krasnoocko', micro: true, look: ['jedna buňka s bičíkem', 'zelené chloroplasty a červená skvrna', 'jádro, pružný povrch bez stěny'], t: { bunka: true, jadro: true, foto: true, souziti: false, jedna: true, stena: false, plodnice: false } },
    { id: 'menavka', name: 'měňavka velká', latin: 'Amoeba proteus', group: 'prvok', pic: 'menavka', micro: true, look: ['jedna buňka bez stálého tvaru', 'panožky, jádro', 'žádné chloroplasty'], t: { bunka: true, jadro: true, foto: false, souziti: false, jedna: true, stena: false, plodnice: false } },
    { id: 'kvasinka', name: 'kvasinka pivní', latin: 'Saccharomyces cerevisiae', group: 'houba (jednobuněčná)', pic: 'kvasinka', micro: true, look: ['oválná buňka, množí se pučením', 'pevná stěna, jádro', 'kvasí cukr na alkohol a CO₂'], t: { bunka: true, jadro: true, foto: false, souziti: false, jedna: true, stena: true, plodnice: false } },
    { id: 'stetickovec', name: 'štětičkovec Roquefortův', latin: 'Penicillium roqueforti', group: 'houba – plíseň', pic: 'stetickovec', micro: true, look: ['vlákna (hyfy) z mnoha buněk', 'štětičky s řetízky výtrusů', 'modrá žilka v sýru'], t: { bunka: true, jadro: true, foto: false, souziti: false, jedna: false, stena: true, plodnice: false } },
    { id: 'hrib', name: 'hřib smrkový', latin: 'Boletus edulis', group: 'houba – stopkovýtrusná', pic: 'hrib', look: ['hnědý klobouk, břichatý třeň se síťkou', 'zespodu klobouku drobné póry', 'jedlý'], t: { bunka: true, jadro: true, foto: false, souziti: false, jedna: false, stena: true, plodnice: true, rourky: true } },
    { id: 'muchomurka', name: 'muchomůrka zelená', latin: 'Amanita phalloides', group: 'houba – stopkovýtrusná', pic: 'muchomurka', look: ['olivově zelený klobouk', 'bílé lupeny, prsten a pochva u báze', 'smrtelně jedovatá'], t: { bunka: true, jadro: true, foto: false, souziti: false, jedna: false, stena: true, plodnice: true, rourky: false } },
    { id: 'tercovnik', name: 'terčovník zední', latin: 'Xanthoria parietina', group: 'lišejník', pic: 'tercovnik', look: ['oranžové lupenité stélky na kůře a zdech', 'pod mikroskopem: houbová vlákna a zelené řasy', 'snese znečištěný vzduch'], t: { bunka: true, jadro: true, foto: true, souziti: true, jedna: false, stena: true } },
  ],
  key: k(
    'bunka',
    k(
      'jadro',
      k(
        'souziti',
        'tercovnik',
        k('jedna', k('foto', 'krasnoocko', k('stena', 'kvasinka', 'menavka')), k('plodnice', k('rourky', 'hrib', 'muchomurka'), 'stetickovec')),
      ),
      k('foto', 'nostoc', 'borelie'),
    ),
    'virus',
  ),
}

/* ------------------------------------------------------------------ level 3 */

const L3: KeySet = {
  level: 3,
  title: 'Klíč k rostlinám a jejich čeledím',
  traits: [
    { id: 'semena', q: 'Tvoří semena?', yes: 'tvoří semena', no: 'netvoří semena, množí se výtrusy', why: 'Mechy, přesličky a kapradiny mají výtrusy, semena až nahosemenné a krytosemenné rostliny.' },
    { id: 'cevy', q: 'Má cévy, kořeny a pravé listy?', yes: 'má cévy, kořeny a pravé listy', no: 'nemá cévy ani pravé kořeny', why: 'Mechy nemají cévy, vodu nasávají celým povrchem.' },
    { id: 'clanky', q: 'Má článkovanou lodyhu s přesleny větévek?', yes: 'má článkovanou lodyhu s přesleny', no: 'nemá článkovanou lodyhu', why: 'Přeslička má lodyhu z článků a v uzlinách přesleny tenkých větévek.' },
    { id: 'plod', q: 'Má květy a semena ukrytá v plodu?', yes: 'má květy a semena v plodu', no: 'má nahá semena na šupinách šišek', why: 'Krytosemenné mají semeník a plod, nahosemenné (jehličnany) nahá semena v šiškách.' },
    { id: 'svazecky', q: 'Rostou jehlice ve svazečcích?', yes: 'má jehlice ve svazečcích', no: 'má jehlice jednotlivě', why: 'Smrk má jehlice jednotlivě, borovice po dvou, modřín v hustých svazečcích.' },
    { id: 'opada', q: 'Shazuje jehlice na zimu?', yes: 'na zimu shazuje jehlice', no: 'je stálezelený', why: 'Modřín je jediný náš jehličnan, který na podzim zežloutne a opadá.' },
    { id: 'soubezna', q: 'Má listy se souběžnou žilnatinou?', yes: 'má listy se souběžnou žilnatinou', no: 'má listy se zpeřenou nebo dlanitou žilnatinou', why: 'Souběžná žilnatina je znak jednoděložných rostlin.' },
    { id: 'sest', q: 'Má nápadný květ se šesti okvětními lístky?', yes: 'má květ se šesti okvětními lístky', no: 'má nenápadné květy v kláscích', why: 'Liliovité mají okvětí ze šesti lístků, lipnicovité (trávy) květy v kláscích.' },
    { id: 'ubor', q: 'Jsou drobné květy nahloučené v úboru?', yes: 'má drobné květy v úboru', no: 'nemá květy v úboru', why: 'Úbor je znak hvězdnicovitých: „jeden květ“ je ve skutečnosti stovka kvítků.' },
    { id: 'motyl', q: 'Má motýlovitý květ a plod lusk?', yes: 'má motýlovitý květ a lusk', no: 'nemá motýlovitý květ ani lusk', why: 'Motýlovitý květ (pavéza, křídla, člunek) a lusk mají bobovité.' },
    { id: 'kriz', q: 'Má čtyři korunní lístky do kříže a plod šešuli nebo šešulku?', yes: 'má čtyři korunní lístky do kříže a šešulky', no: 'nemá korunní lístky do kříže', why: 'Čtyři lístky do kříže a šešule či šešulka jsou znak brukvovitých.' },
    { id: 'pysk', q: 'Má pyskatý květ a čtyřhrannou lodyhu?', yes: 'má pyskaté květy a čtyřhrannou lodyhu', no: 'nemá pyskaté květy', why: 'Pyskatý květ a čtyřhranná lodyha jsou znak hluchavkovitých.' },
  ],
  organisms: [
    { id: 'raselinik', name: 'rašeliník bahenní', latin: 'Sphagnum palustre', group: 'mech', pic: 'raselinik', look: ['roste v hustých polštářích v rašeliništi', 'nasaje vodu jako houba', 'žádné kořeny ani cévy'], t: { semena: false, cevy: false, clanky: false } },
    { id: 'kaprad', name: 'kapraď samec', latin: 'Dryopteris filix-mas', group: 'kapradina', pic: 'kaprad', look: ['velké zpeřené listy', 'na rubu listů hnědé kupky výtrusnic', 'mladé listy stočené jako biskupská berla'], t: { semena: false, cevy: true, clanky: false } },
    { id: 'preslicka', name: 'přeslička rolní', latin: 'Equisetum arvense', group: 'přeslička', pic: 'preslicka', look: ['lodyha z článků', 'v uzlinách přesleny tenkých větévek', 'na jaře hnědé lodyhy s výtrusnými klasy'], t: { semena: false, cevy: true, clanky: true } },
    { id: 'smrk', name: 'smrk ztepilý', latin: 'Picea abies', group: 'nahosemenná – borovicovité', pic: 'smrk', look: ['jehlice jednotlivě kolem větvičky', 'šišky visí dolů', 'zelený i v zimě'], t: { semena: true, cevy: true, clanky: false, plod: false, svazecky: false, opada: false } },
    { id: 'borovice', name: 'borovice lesní', latin: 'Pinus sylvestris', group: 'nahosemenná – borovicovité', pic: 'borovice', look: ['jehlice vždy po dvou', 'oranžová kůra v koruně', 'zelená i v zimě'], t: { semena: true, cevy: true, clanky: false, plod: false, svazecky: true, opada: false } },
    { id: 'modrin', name: 'modřín opadavý', latin: 'Larix decidua', group: 'nahosemenná – borovicovité', pic: 'modrin', look: ['měkké jehlice v hustých svazečcích', 'malé vzpřímené šištice', 'na podzim zlátne'], t: { semena: true, cevy: true, clanky: false, plod: false, svazecky: true, opada: true } },
    { id: 'lilie', name: 'lilie zlatohlavá', latin: 'Lilium martagon', group: 'krytosemenná – liliovité', pic: 'lilie', look: ['nící růžové květy jako turban', 'listy se souběžnými žilkami', 'šest okvětních lístků'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: true, sest: true, ubor: false, motyl: false, kriz: false, pysk: false } },
    { id: 'psenice', name: 'pšenice setá', latin: 'Triticum aestivum', group: 'krytosemenná – lipnicovité', pic: 'psenice', look: ['duté stéblo s kolénky', 'úzké listy se souběžnými žilkami', 'klas z klásků, obilky'], t: { semena: true, cevy: true, plod: true, soubezna: true, sest: false, ubor: false, motyl: false, kriz: false, pysk: false } },
    { id: 'smetanka', name: 'smetánka lékařská', latin: 'Taraxacum officinale', group: 'krytosemenná – hvězdnicovité', pic: 'smetanka', look: ['žlutý „květ“ ze stovky kvítků', 'zubaté listy v růžici', 'nažky s chmýřím'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: false, ubor: true, motyl: false, kriz: false, pysk: false } },
    { id: 'hrach', name: 'hrách setý', latin: 'Pisum sativum', group: 'krytosemenná – bobovité', pic: 'hrach', look: ['popíná se úponky', 'květ s pavézou, křídly a člunkem', 'semena v lusku'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: false, ubor: false, motyl: true, kriz: false, pysk: false } },
    { id: 'kokoska', name: 'kokoška pastuší tobolka', latin: 'Capsella bursa-pastoris', group: 'krytosemenná – brukvovité', pic: 'kokoska', look: ['drobné bílé květy, čtyři lístky', 'srdčité šešulky na stopkách', 'roste u cest'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: false, ubor: false, motyl: false, kriz: true, pysk: false } },
    { id: 'hluchavka', name: 'hluchavka bílá', latin: 'Lamium album', group: 'krytosemenná – hluchavkovité', pic: 'hluchavka', look: ['bílé květy s horním a dolním pyskem', 'lodyha na průřezu čtverec', 'listy jako kopřiva, ale nežahají'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: false, ubor: false, motyl: false, kriz: false, pysk: true } },
    { id: 'ruze', name: 'růže šípková', latin: 'Rosa canina', group: 'krytosemenná – růžovité', pic: 'ruze', look: ['pět růžových korunních lístků', 'mnoho tyčinek, ostny na stonku', 'šípek – souplodí nažek'], t: { semena: true, cevy: true, clanky: false, plod: true, soubezna: false, ubor: false, motyl: false, kriz: false, pysk: false } },
  ],
  key: k(
    'semena',
    k(
      'plod',
      k('soubezna', k('sest', 'lilie', 'psenice'), k('ubor', 'smetanka', k('motyl', 'hrach', k('kriz', 'kokoska', k('pysk', 'hluchavka', 'ruze'))))),
      k('svazecky', k('opada', 'modrin', 'borovice'), 'smrk'),
    ),
    k('cevy', k('clanky', 'preslicka', 'kaprad'), 'raselinik'),
  ),
}

/* ------------------------------------------------------------------ level 4 */

const L4: KeySet = {
  level: 4,
  title: 'Klíč k bezobratlým živočichům',
  traits: [
    { id: 'exo', q: 'Má vnější kostru a článkované končetiny?', yes: 'má vnější kostru a článkované končetiny', no: 'nemá vnější kostru ani článkované končetiny', why: 'Krunýř z chitinu a končetiny z článků mají všichni členovci.' },
    { id: 'sest', q: 'Má tři páry nohou?', yes: 'má tři páry nohou', no: 'nemá šest nohou', why: 'Šest nohou na hrudi má hmyz.' },
    { id: 'osm', q: 'Má čtyři páry nohou?', yes: 'má čtyři páry nohou', no: 'má víc než čtyři páry nohou', why: 'Osm nohou mají pavoukovci: pavouci, klíšťata, roztoči.' },
    { id: 'splyva', q: 'Splývá hlavohruď se zadečkem v jeden celek?', yes: 'má hlavohruď a zadeček srostlé v jeden celek', no: 'má hlavohruď a zadeček oddělené stopkou', why: 'Roztoči a klíšťata mají tělo v jednom kuse, pavouk má mezi hlavohrudí a zadečkem stopku.' },
    { id: 'klepeta', q: 'Má klepeta a dýchá žábrami?', yes: 'má klepeta a dýchá žábrami', no: 'nemá klepeta ani žábry', why: 'Klepeta a žábry má rak – korýš.' },
    { id: 'schranka', q: 'Má měkké tělo chráněné ulitou nebo lasturami?', yes: 'má měkké tělo v ulitě nebo lasturách', no: 'nemá ulitu ani lastury', why: 'Ulitu nebo lastury tvoří měkkýši.' },
    { id: 'lastury', q: 'Má dvě lastury?', yes: 'má dvě lastury', no: 'má jednu stočenou ulitu', why: 'Dvě lastury mají mlži, jednu ulitu plži.' },
    { id: 'cerv', q: 'Má protáhlé červovité tělo bez končetin?', yes: 'má protáhlé červovité tělo', no: 'nemá červovité tělo', why: 'Červovitý tvar mají ploštěnci, hlístice i kroužkovci, i když nejsou blízce příbuzní.' },
    { id: 'clanky', q: 'Je tělo rozdělené na články (kroužky)?', yes: 'má tělo z kroužků (článků)', no: 'má tělo bez článků', why: 'Kroužky na těle má žížala – kroužkovec.' },
    { id: 'ploche', q: 'Je tělo ploché?', yes: 'má ploché tělo', no: 'má oblé tělo', why: 'Ploštěnci jsou ploší jako list, hlístice oblé jako nit.' },
    { id: 'zahave', q: 'Má chapadla se žahavými buňkami?', yes: 'má chapadla se žahavými buňkami', no: 'nemá žahavá chapadla', why: 'Žahavé buňky mají jen žahavci: nezmar, medúzy, koráli.' },
    { id: 'ramena', q: 'Má pět ramen a ostnitou kůži?', yes: 'má pět ramen a ostnitou kůži', no: 'nemá ramena ani ostny', why: 'Pět ramen a ostny v kůži mají ostnokožci.' },
  ],
  organisms: [
    { id: 'houba', name: 'houba rybniční', latin: 'Spongilla lacustris', group: 'houbovec', pic: 'houba', look: ['zelené prstovité trsy na kamenech', 'celý povrch prošpikovaný póry', 'žádné orgány, nehýbe se'], t: { exo: false, schranka: false, cerv: false, zahave: false, ramena: false } },
    { id: 'nezmar', name: 'nezmar zelený', latin: 'Hydra viridissima', group: 'žahavec', pic: 'nezmar', look: ['zelená trubička přisátá k rostlině', 'věnec chapadel kolem úst', 'na chapadlech žahavé buňky'], t: { exo: false, schranka: false, cerv: false, zahave: true, ramena: false } },
    { id: 'hvezdice', name: 'hvězdice červená', latin: 'Asterias rubens', group: 'ostnokožec', pic: 'hvezdice', look: ['pět ramen', 'drsná kůže s drobnými ostny', 'žije v moři'], t: { exo: false, schranka: false, cerv: false, zahave: false, ramena: true } },
    { id: 'plostenka', name: 'ploštěnka mléčná', latin: 'Dendrocoelum lacteum', group: 'ploštěnec', pic: 'plostenka', look: ['bílé ploché tělo jako lístek', 'dvě oči na hlavě', 'klouže po kamenech v potoce'], t: { exo: false, schranka: false, cerv: true, zahave: false, ramena: false, clanky: false, ploche: true } },
    { id: 'skrkavka', name: 'škrkavka dětská', latin: 'Ascaris lumbricoides', group: 'hlístice', pic: 'skrkavka', look: ['oblé hladké tělo až 30 cm', 'žádné kroužky', 'cizopasí ve střevě člověka'], t: { exo: false, schranka: false, cerv: true, zahave: false, ramena: false, clanky: false, ploche: false } },
    { id: 'zizala', name: 'žížala obecná', latin: 'Lumbricus terrestris', group: 'kroužkovec', pic: 'zizala', look: ['tělo ze stovky kroužků', 'světlejší opasek', 'žije v půdě'], t: { exo: false, schranka: false, cerv: true, zahave: false, ramena: false, clanky: true, ploche: false } },
    { id: 'hlemyzd', name: 'hlemýžď zahradní', latin: 'Helix pomatia', group: 'měkkýš – plž', pic: 'hlemyzd', look: ['jedna spirálně stočená ulita', 'svalnatá noha', 'oči na tykadlech'], t: { exo: false, schranka: true, lastury: false, cerv: false, zahave: false, ramena: false } },
    { id: 'skeble', name: 'škeble rybničná', latin: 'Anodonta cygnea', group: 'měkkýš – mlž', pic: 'skeble', look: ['dvě lastury spojené zámkem', 'vysunutá noha', 'filtruje vodu v rybníku'], t: { exo: false, schranka: true, lastury: true, cerv: false, zahave: false, ramena: false } },
    { id: 'rak', name: 'rak říční', latin: 'Astacus astacus', group: 'členovec – korýš', pic: 'rak', look: ['tvrdý krunýř', 'velká klepeta, dlouhá tykadla', 'žije v čistých potocích'], t: { exo: true, sest: false, osm: false, klepeta: true, schranka: false, zahave: false, ramena: false } },
    { id: 'stonozka', name: 'stonožka škvorová', latin: 'Lithobius forficatus', group: 'členovec – stonožka', pic: 'stonozka', look: ['plochý článkovaný trup', '15 párů nohou', 'žije pod kameny'], t: { exo: true, sest: false, osm: false, klepeta: false, schranka: false, zahave: false, ramena: false } },
    { id: 'krizak', name: 'křižák obecný', latin: 'Araneus diadematus', group: 'členovec – pavoukovec', pic: 'krizak', look: ['bílý kříž na velkém zadečku', 'osm nohou', 'stopka mezi hlavohrudí a zadečkem'], t: { exo: true, sest: false, osm: true, splyva: false, klepeta: false, schranka: false, zahave: false, ramena: false } },
    { id: 'kliste', name: 'klíště obecné', latin: 'Ixodes ricinus', group: 'členovec – roztoč', pic: 'kliste', look: ['drobné tělo v jednom kuse', 'osm nohou', 'saje krev, přenáší boreliózu'], t: { exo: true, sest: false, osm: true, splyva: true, klepeta: false, schranka: false, zahave: false, ramena: false } },
    { id: 'vcela', name: 'včela medonosná', latin: 'Apis mellifera', group: 'členovec – hmyz', pic: 'vcela', look: ['hlava, hruď a pruhovaný zadeček', 'dva páry křídel', 'šest nohou'], t: { exo: true, sest: true, klepeta: false, schranka: false, zahave: false, ramena: false } },
  ],
  key: k(
    'exo',
    k('sest', 'vcela', k('osm', k('splyva', 'kliste', 'krizak'), k('klepeta', 'rak', 'stonozka'))),
    k(
      'schranka',
      k('lastury', 'skeble', 'hlemyzd'),
      k('cerv', k('clanky', 'zizala', k('ploche', 'plostenka', 'skrkavka')), k('zahave', 'nezmar', k('ramena', 'hvezdice', 'houba'))),
    ),
  ),
}

/* ------------------------------------------------------------------ level 5 */

const L5: KeySet = {
  level: 5,
  title: 'Klíč k obratlovcům',
  traits: [
    { id: 'srst', q: 'Má srst?', yes: 'má srst', no: 'nemá srst', why: 'Srst a mléko pro mláďata mají jen savci.' },
    { id: 'peri', q: 'Má peří?', yes: 'má peří', no: 'nemá peří', why: 'Peří mají jen ptáci.' },
    { id: 'zabry', q: 'Má ploutve a dýchá celý život žábrami?', yes: 'má ploutve a dýchá žábrami', no: 'dýchá plícemi', why: 'Ryby dýchají žábrami po celý život.' },
    { id: 'chrupavka', q: 'Má kostru z chrupavky a žaberní štěrbiny?', yes: 'má chrupavčitou kostru a žaberní štěrbiny', no: 'má kostěnou kostru a žábry kryté skřelemi', why: 'Žraloci a rejnoci jsou chrupavčití, kapr je kostnatá ryba se skřelemi.' },
    { id: 'supiny', q: 'Má suchou kůži se šupinami?', yes: 'má suchou kůži se šupinami', no: 'má holou vlhkou kůži', why: 'Plazi mají suchou šupinatou kůži, obojživelníci holou a vlhkou (dýchají i kůží).' },
    { id: 'ocas', q: 'Má v dospělosti ocas?', yes: 'má v dospělosti ocas', no: 'v dospělosti nemá ocas', why: 'Ocasatí (mloci, čolci) si ocas nechávají, žáby o něj při proměně přijdou.' },
    { id: 'nohy', q: 'Má končetiny?', yes: 'má čtyři končetiny', no: 'nemá končetiny', why: 'Hadi jsou plazi, kteří končetiny ztratili.' },
    { id: 'skvrny', q: 'Má za hlavou žluté půlměsíčité skvrny?', yes: 'má za hlavou žluté skvrny', no: 'má na hřbetě tmavou klikatou čáru', why: 'Žluté „půlměsíčky“ má neškodná užovka, klikatou čáru jedovatá zmije.' },
    { id: 'zobak', q: 'Má hákovitý zobák a silné pařáty?', yes: 'má hákovitý zobák a pařáty', no: 'má rovný zobák a tenké nohy', why: 'Hákovitý zobák a pařáty mají dravci.' },
    { id: 'blana', q: 'Létá na létací bláně?', yes: 'létá na létací bláně', no: 'nelétá', why: 'Letouni (netopýři a kaloni) jsou jediní savci, kteří opravdu létají.' },
    { id: 'kopyta', q: 'Chodí po kopytech?', yes: 'chodí po kopytech', no: 'nemá kopyta, má prsty s drápy', why: 'Kopyta mají sudokopytníci (srnec) a lichokopytníci (kůň).' },
    { id: 'bodliny', q: 'Má hřbet pokrytý bodlinami?', yes: 'má hřbet pokrytý bodlinami', no: 'nemá bodliny', why: 'Bodliny jsou přeměněné chlupy ježka.' },
    { id: 'hlodaky', q: 'Má hlodavé řezáky, které stále dorůstají?', yes: 'má stále dorůstající hlodavé řezáky', no: 'má velké špičáky', why: 'Hlodavci hlodají řezáky, šelmy trhají kořist špičáky.' },
  ],
  organisms: [
    { id: 'macka', name: 'máčka skvrnitá', latin: 'Scyliorhinus canicula', group: 'paryba (chrupavčitá ryba)', pic: 'macka', look: ['tvar žraloka, kůže s tečkami', 'pět žaberních štěrbin', 'žije v Atlantiku a Středomoří'], t: { srst: false, peri: false, zabry: true, chrupavka: true } },
    { id: 'kapr', name: 'kapr obecný', latin: 'Cyprinus carpio', group: 'ryba (kostnatá)', pic: 'kapr', look: ['šupiny a ploutve', 'žábry pod skřelí', 'vousky u úst'], t: { srst: false, peri: false, zabry: true, chrupavka: false } },
    { id: 'colek', name: 'čolek obecný', latin: 'Lissotriton vulgaris', group: 'obojživelník – ocasatý', pic: 'colek', look: ['holá vlhká kůže', 'zploštělý ocas', 'na jaře v tůních'], t: { srst: false, peri: false, zabry: false, supiny: false, ocas: true, nohy: true } },
    { id: 'skokan', name: 'skokan hnědý', latin: 'Rana temporaria', group: 'obojživelník – žába', pic: 'skokan', look: ['holá vlhká kůže', 'dlouhé skákací nohy, bez ocasu', 'tmavá skvrna za okem'], t: { srst: false, peri: false, zabry: false, supiny: false, ocas: false, nohy: true } },
    { id: 'jesterka', name: 'ještěrka obecná', latin: 'Lacerta agilis', group: 'plaz – ještěr', pic: 'jesterka', look: ['suché šupiny', 'čtyři nohy s drápky', 'samec má zelené boky'], t: { srst: false, peri: false, zabry: false, supiny: true, nohy: true } },
    { id: 'uzovka', name: 'užovka obojková', latin: 'Natrix natrix', group: 'plaz – had', pic: 'uzovka', look: ['šupinatý had bez nohou', 'za hlavou žluté půlměsíčky', 'kulatá zornice, neškodná'], t: { srst: false, peri: false, zabry: false, supiny: true, nohy: false, skvrny: true } },
    { id: 'zmije', name: 'zmije obecná', latin: 'Vipera berus', group: 'plaz – had', pic: 'zmije', look: ['šupinatý had bez nohou', 'klikatá čára po hřbetě', 'svislá zornice, jedovatá'], t: { srst: false, peri: false, zabry: false, supiny: true, nohy: false, skvrny: false } },
    { id: 'kane', name: 'káně lesní', latin: 'Buteo buteo', group: 'pták – dravec', pic: 'kane', look: ['hnědé peří, světlá prsa', 'hákovitý zobák', 'silné pařáty'], t: { srst: false, peri: true, zabry: false, zobak: true } },
    { id: 'kos', name: 'kos černý', latin: 'Turdus merula', group: 'pták – pěvec', pic: 'kos', look: ['černé peří', 'žlutý rovný zobák', 'zpívá na anténách'], t: { srst: false, peri: true, zabry: false, zobak: false } },
    { id: 'netopyr', name: 'netopýr velký', latin: 'Myotis myotis', group: 'savec – letoun', pic: 'netopyr', look: ['srst', 'blána mezi dlouhými prsty', 'loví hmyz v noci'], t: { srst: true, peri: false, zabry: false, blana: true, kopyta: false, bodliny: false } },
    { id: 'srnec', name: 'srnec obecný', latin: 'Capreolus capreolus', group: 'savec – sudokopytník', pic: 'srnec', look: ['srst, štíhlé nohy', 'nohy končí kopýtky', 'samec má parůžky'], t: { srst: true, peri: false, zabry: false, blana: false, kopyta: true, bodliny: false } },
    { id: 'jezek', name: 'ježek západní', latin: 'Erinaceus europaeus', group: 'savec – hmyzožravec', pic: 'jezek', look: ['hřbet z ostrých bodlin', 'srst na břiše', 'stočí se do klubíčka'], t: { srst: true, peri: false, zabry: false, blana: false, kopyta: false, bodliny: true } },
    { id: 'liska', name: 'liška obecná', latin: 'Vulpes vulpes', group: 'savec – šelma', pic: 'liska', look: ['rezavá srst, huňatý ocas', 'velké špičáky', 'prsty s drápy'], t: { srst: true, peri: false, zabry: false, blana: false, kopyta: false, bodliny: false, hlodaky: false } },
    { id: 'mys', name: 'myš domácí', latin: 'Mus musculus', group: 'savec – hlodavec', pic: 'mys', look: ['šedá srst, dlouhý tenký ocas', 'nahoře i dole jeden pár hlodáků', 'prsty s drápky'], t: { srst: true, peri: false, zabry: false, blana: false, kopyta: false, bodliny: false, hlodaky: true } },
  ],
  key: k(
    'srst',
    k('blana', 'netopyr', k('kopyta', 'srnec', k('bodliny', 'jezek', k('hlodaky', 'mys', 'liska')))),
    k(
      'peri',
      k('zobak', 'kane', 'kos'),
      k('zabry', k('chrupavka', 'macka', 'kapr'), k('supiny', k('nohy', 'jesterka', k('skvrny', 'uzovka', 'zmije')), k('ocas', 'colek', 'skokan'))),
    ),
  ),
}

export const LEVELS: Record<number, KeySet> = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5 }
