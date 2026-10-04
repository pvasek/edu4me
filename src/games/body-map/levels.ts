/**
 * Mapa těla – curated anatomy and physiology (spec/courses/biologie/games.md,
 * syllabus b6-1 … b6-7 and b11-1 … b11-6). The body is drawn from the front
 * (viewBox 320 × 520): the person's right side is on the viewer's left.
 */

export type OrganId =
  | 'mozek'
  | 'oko'
  | 'ucho'
  | 'nosni_dutina'
  | 'usni_dutina'
  | 'hltan'
  | 'hrtan'
  | 'stitna'
  | 'prudusnice'
  | 'prudusky'
  | 'prudusinky'
  | 'sklipky'
  | 'plice'
  | 'srdce'
  | 'branice'
  | 'jicen'
  | 'jatra'
  | 'zlucnik'
  | 'zaludek'
  | 'slinivka'
  | 'slezina'
  | 'tenke_strevo'
  | 'tluste_strevo'
  | 'konecnik'
  | 'ledviny'
  | 'nadledviny'
  | 'mocovod'
  | 'mocovy_mechyr'
  | 'mocova_trubice'
  | 'micha'
  | 'nervy'
  | 'hypofyza'
  | 'brzlik'
  | 'mandle'
  | 'mizni_uzliny'
  | 'kostni_dren'
  | 'lebka'
  | 'klicni_kost'
  | 'hrudni_kost'
  | 'zebra'
  | 'pater'
  | 'panev'
  | 'pazni_kost'
  | 'stehenni_kost'

export interface Organ {
  id: OrganId
  name: string
  /** Marker point (viewBox 320 × 520). */
  at: [number, number]
  /** Drawing group used to show the organ (several points share one drawing). */
  draw?: OrganId
}

const o = (id: OrganId, name: string, at: [number, number], draw?: OrganId): Organ => ({ id, name, at, draw })

export const ORGANS: Record<OrganId, Organ> = {
  mozek: o('mozek', 'mozek', [166, 30]),
  oko: o('oko', 'oko', [147, 56]),
  ucho: o('ucho', 'ucho', [119, 68]),
  nosni_dutina: o('nosni_dutina', 'nosní dutina', [160, 64]),
  usni_dutina: o('usni_dutina', 'ústní dutina', [160, 80]),
  hltan: o('hltan', 'hltan', [160, 92]),
  hrtan: o('hrtan', 'hrtan', [160, 104]),
  stitna: o('stitna', 'štítná žláza', [160, 118]),
  prudusnice: o('prudusnice', 'průdušnice', [160, 140]),
  prudusky: o('prudusky', 'průdušky', [142, 168], 'prudusnice'),
  prudusinky: o('prudusinky', 'průdušinky', [124, 194], 'plice'),
  sklipky: o('sklipky', 'plicní sklípky', [112, 222], 'plice'),
  plice: o('plice', 'plíce', [118, 210]),
  srdce: o('srdce', 'srdce', [176, 222]),
  branice: o('branice', 'bránice', [205, 262]),
  jicen: o('jicen', 'jícen', [160, 180]),
  jatra: o('jatra', 'játra', [124, 292]),
  zlucnik: o('zlucnik', 'žlučník', [146, 322]),
  zaludek: o('zaludek', 'žaludek', [208, 302]),
  slinivka: o('slinivka', 'slinivka břišní', [182, 342]),
  slezina: o('slezina', 'slezina', [222, 288]),
  tenke_strevo: o('tenke_strevo', 'tenké střevo', [160, 392]),
  tluste_strevo: o('tluste_strevo', 'tlusté střevo', [104, 384]),
  konecnik: o('konecnik', 'konečník', [163, 442]),
  ledviny: o('ledviny', 'ledviny', [122, 345]),
  nadledviny: o('nadledviny', 'nadledviny', [198, 314]),
  mocovod: o('mocovod', 'močovod', [139, 390]),
  mocovy_mechyr: o('mocovy_mechyr', 'močový měchýř', [160, 418]),
  mocova_trubice: o('mocova_trubice', 'močová trubice', [160, 450]),
  micha: o('micha', 'mícha', [160, 230]),
  nervy: o('nervy', 'nervy', [70, 248]),
  hypofyza: o('hypofyza', 'hypofýza', [160, 66]),
  brzlik: o('brzlik', 'brzlík', [160, 168]),
  mandle: o('mandle', 'mandle', [160, 88]),
  mizni_uzliny: o('mizni_uzliny', 'mízní uzliny', [228, 162]),
  kostni_dren: o('kostni_dren', 'kostní dřeň', [125, 476]),
  lebka: o('lebka', 'lebka', [160, 30]),
  klicni_kost: o('klicni_kost', 'klíční kost', [198, 128]),
  hrudni_kost: o('hrudni_kost', 'hrudní kost', [160, 190]),
  zebra: o('zebra', 'žebra', [108, 222]),
  pater: o('pater', 'páteř', [160, 330]),
  panev: o('panev', 'pánev', [116, 396]),
  pazni_kost: o('pazni_kost', 'pažní kost', [248, 220]),
  stehenni_kost: o('stehenni_kost', 'stehenní kost', [126, 470]),
}

/* ------------------------------------------------------------------ place */

export interface PlaceSet {
  id: string
  title: string
  organs: OrganId[]
  /** One line after the task. */
  note: string
}

export const PLACE_SETS: Record<string, PlaceSet> = {
  digest: {
    id: 'digest',
    title: 'Trávicí soustava',
    organs: ['usni_dutina', 'jicen', 'jatra', 'zlucnik', 'zaludek', 'slinivka', 'tenke_strevo', 'tluste_strevo', 'konecnik'],
    note: 'Játra leží vpravo pod bránicí, žaludek vlevo – na člověka díváš zepředu, proto je to na obrázku obráceně.',
  },
  breath: {
    id: 'breath',
    title: 'Dýchání a oběh',
    organs: ['nosni_dutina', 'hrtan', 'prudusnice', 'plice', 'srdce', 'branice'],
    note: 'Srdce leží mezi plícemi, hrotem mírně vlevo; bránice odděluje hrudník od břicha.',
  },
  urine: {
    id: 'urine',
    title: 'Vylučovací soustava',
    organs: ['ledviny', 'mocovod', 'mocovy_mechyr', 'mocova_trubice'],
    note: 'Ledviny leží u zadní stěny břicha po stranách páteře, pravá o kousek níž – nad ní jsou játra.',
  },
  nerve: {
    id: 'nerve',
    title: 'Nervová soustava a smysly',
    organs: ['mozek', 'oko', 'ucho', 'micha', 'nervy'],
    note: 'Mozek a mícha tvoří ústřední nervovou soustavu, nervy vedou vzruchy do celého těla.',
  },
  skeleton: {
    id: 'skeleton',
    title: 'Kostra',
    organs: ['lebka', 'klicni_kost', 'hrudni_kost', 'zebra', 'pater', 'panev', 'pazni_kost', 'stehenni_kost'],
    note: 'Stehenní kost je nejdelší kost těla; žebra s hrudní kostí a páteří tvoří hrudní koš.',
  },
  endocrine: {
    id: 'endocrine',
    title: 'Žlázy s vnitřní sekrecí',
    organs: ['hypofyza', 'stitna', 'brzlik', 'nadledviny', 'slinivka'],
    note: 'Hypofýza pod mozkem řídí většinu ostatních žláz – proto jí říkáme „dirigent“ hormonů.',
  },
  immune: {
    id: 'immune',
    title: 'Orgány imunity',
    organs: ['mandle', 'mizni_uzliny', 'brzlik', 'slezina', 'kostni_dren'],
    note: 'V kostní dřeni vznikají všechny krvinky; T-lymfocyty pak dozrávají v brzlíku, B-lymfocyty přímo v dřeni.',
  },
}

/* ------------------------------------------------------------------ match */

export interface Pair {
  organ: OrganId
  /** Slot title (defaults to the organ's name). */
  title?: string
  /** Card text. */
  text: string
}

export interface MatchSet {
  id: string
  /** What the cards are. */
  cards: string
  prompt: string
  /** Pairs to choose from; one organ appears at most once in a task. */
  pairs: Pair[]
  /** Cards per task. */
  n: number
}

export const MATCH_SETS: Record<string, MatchSet> = {
  organs6: {
    id: 'organs6',
    cards: 'Funkce',
    prompt: 'Co který orgán dělá? Přiřaď funkci k číslu.',
    n: 5,
    pairs: [
      { organ: 'mozek', text: 'řídí činnost těla, myslí a pamatuje si' },
      { organ: 'micha', text: 'vede vzruchy mezi mozkem a tělem a řídí jednoduché reflexy' },
      { organ: 'srdce', text: 'pumpuje krev do plic a do celého těla' },
      { organ: 'plice', text: 'výměna plynů: kyslík do krve, oxid uhličitý ven' },
      { organ: 'branice', text: 'hlavní dýchací sval – stahem zvětší hrudník a nasaje vzduch' },
      { organ: 'hrtan', text: 'jsou v něm hlasivky – tvoří hlas' },
      { organ: 'jicen', text: 'posouvá sousto z hltanu do žaludku' },
      { organ: 'zaludek', text: 'v kyselé šťávě začíná trávit bílkoviny' },
      { organ: 'jatra', text: 'tvoří žluč a zpracovávají živiny i jedy' },
      { organ: 'zlucnik', text: 'skladuje žluč a vylévá ji do dvanáctníku' },
      { organ: 'slinivka', text: 'tvoří trávicí šťávu a hormon inzulin' },
      { organ: 'tenke_strevo', text: 'dokončuje trávení a vstřebává živiny do krve' },
      { organ: 'tluste_strevo', text: 'vstřebává vodu a tvoří stolici' },
      { organ: 'ledviny', text: 'filtrují krev a tvoří moč' },
      { organ: 'mocovy_mechyr', text: 'shromažďuje moč' },
      { organ: 'stitna', text: 'tvoří tyroxin, který řídí rychlost metabolismu' },
    ],
  },
  glands11: {
    id: 'glands11',
    cards: 'Hormony',
    prompt: 'Která žláza hormon vyplavuje do krve? Přiřaď hormon k žláze.',
    n: 4,
    pairs: [
      { organ: 'hypofyza', text: 'růstový hormon' },
      { organ: 'hypofyza', text: 'ADH (antidiuretický hormon)' },
      { organ: 'hypofyza', text: 'TSH (řídí štítnou žlázu)' },
      { organ: 'stitna', text: 'tyroxin' },
      { organ: 'stitna', text: 'kalcitonin' },
      { organ: 'slinivka', text: 'inzulin' },
      { organ: 'slinivka', text: 'glukagon' },
      { organ: 'nadledviny', text: 'adrenalin' },
      { organ: 'nadledviny', text: 'kortizol' },
      { organ: 'nadledviny', text: 'aldosteron' },
    ],
  },
  effects11: {
    id: 'effects11',
    cards: 'Účinky',
    prompt: 'Co hormon v těle způsobí? Přiřaď účinek k hormonu.',
    n: 4,
    pairs: [
      { organ: 'slinivka', title: 'inzulin (slinivka břišní)', text: 'buňky přijímají glukózu, játra z ní tvoří glykogen – glukóza v krvi klesne' },
      { organ: 'slinivka', title: 'glukagon (slinivka břišní)', text: 'játra štěpí glykogen – glukóza v krvi stoupne' },
      { organ: 'nadledviny', title: 'adrenalin (nadledviny)', text: 'poplach: zrychlí tep a dech, uvolní glukózu – útok, nebo útěk' },
      { organ: 'nadledviny', title: 'aldosteron (nadledviny)', text: 'ledviny vracejí do krve víc Na⁺ a s ním vodu' },
      { organ: 'stitna', title: 'tyroxin (štítná žláza)', text: 'zrychlí metabolismus v celém těle, řídí růst a vývoj' },
      { organ: 'stitna', title: 'kalcitonin (štítná žláza)', text: 'sníží hladinu vápníku (Ca²⁺) v krvi' },
      { organ: 'hypofyza', title: 'ADH (hypofýza)', text: 'sběrné kanálky ledvin vracejí vodu do krve – moč je koncentrovanější' },
      { organ: 'hypofyza', title: 'růstový hormon (hypofýza)', text: 'podporuje růst kostí a svalů' },
    ],
  },
  immune11: {
    id: 'immune11',
    cards: 'Úlohy',
    prompt: 'Jakou úlohu má který orgán v imunitě? Přiřaď ji k číslu.',
    n: 4,
    pairs: [
      { organ: 'kostni_dren', text: 'vznikají v ní všechny krvinky a dozrávají B-lymfocyty' },
      { organ: 'brzlik', text: 'dozrávají v něm T-lymfocyty' },
      { organ: 'slezina', text: 'filtruje krev a odstraňuje staré červené krvinky' },
      { organ: 'mizni_uzliny', text: 'filtrují mízu – lymfocyty v nich potkávají antigeny' },
      { organ: 'mandle', text: 'zachytávají mikroby, které vniknou ústy a nosem' },
    ],
  },
  physio11: {
    id: 'physio11',
    cards: 'Děje',
    prompt: 'Kde se to děje? Přiřaď děj k orgánu.',
    n: 5,
    pairs: [
      { organ: 'jatra', text: 'z glukózy tvoří glykogen a z amoniaku močovinu' },
      { organ: 'ledviny', text: 'nefrony filtrují krev a zpětně vstřebávají vodu a glukózu' },
      { organ: 'tenke_strevo', text: 'klky a mikroklky vstřebávají živiny do krve a mízy' },
      { organ: 'plice', text: 've sklípcích difunduje O₂ do krve a CO₂ z krve ven' },
      { organ: 'srdce', text: 'sinoatriální uzel udává rytmus stahů' },
      { organ: 'hypofyza', text: 'řídí ostatní žlázy (TSH, ACTH) a vyplavuje ADH' },
      { organ: 'slinivka', text: 'Langerhansovy ostrůvky hlídají hladinu glukózy' },
      { organ: 'micha', text: 'míšní reflex proběhne dřív, než bolest ucítí mozek' },
    ],
  },
}

/* ------------------------------------------------------------------ paths */

export interface Step {
  text: string
  /** Where the step lies in the body (draws the path in the picture). */
  organ?: OrganId
}

export interface PathDef {
  id: string
  title: string
  prompt: string
  steps: Step[]
  /** A card that does not belong on the path, with the reason. */
  extra?: { text: string; why: string }
  note: string
}

export const PATHS: Record<string, PathDef> = {
  air: {
    id: 'air',
    title: 'Cesta vzduchu',
    prompt: 'Seřaď, kudy proudí vzduch při nádechu – od nosu až do plic.',
    steps: [
      { text: 'nosní dutina', organ: 'nosni_dutina' },
      { text: 'hltan', organ: 'hltan' },
      { text: 'hrtan', organ: 'hrtan' },
      { text: 'průdušnice', organ: 'prudusnice' },
      { text: 'průdušky', organ: 'prudusky' },
      { text: 'průdušinky', organ: 'prudusinky' },
      { text: 'plicní sklípky', organ: 'sklipky' },
    ],
    extra: { text: 'jícen', why: 'jícen vede potravu do žaludku, ne vzduch' },
    note: 'Vzduch a potrava se kříží v hltanu; při polykání hrtanová příklopka uzavře hrtan.',
  },
  food: {
    id: 'food',
    title: 'Cesta potravy',
    prompt: 'Seřaď, kudy putuje sousto – od úst až na konec trávicí trubice.',
    steps: [
      { text: 'ústní dutina', organ: 'usni_dutina' },
      { text: 'hltan', organ: 'hltan' },
      { text: 'jícen', organ: 'jicen' },
      { text: 'žaludek', organ: 'zaludek' },
      { text: 'tenké střevo', organ: 'tenke_strevo' },
      { text: 'tlusté střevo', organ: 'tluste_strevo' },
      { text: 'konečník', organ: 'konecnik' },
    ],
    extra: { text: 'průdušnice', why: 'průdušnicí proudí vzduch do plic' },
    note: 'Játra a slinivka potravu neprocházejí – své šťávy vylévají do dvanáctníku, začátku tenkého střeva.',
  },
  urine: {
    id: 'urine',
    title: 'Cesta moči',
    prompt: 'Seřaď, kudy putuje moč od místa vzniku ven z těla.',
    steps: [
      { text: 'ledviny', organ: 'ledviny' },
      { text: 'močovody', organ: 'mocovod' },
      { text: 'močový měchýř', organ: 'mocovy_mechyr' },
      { text: 'močová trubice', organ: 'mocova_trubice' },
    ],
    extra: { text: 'nadledviny', why: 'nadledviny jsou žlázy s vnitřní sekrecí, moč jimi neteče' },
    note: 'Ledviny přefiltrují asi 180 litrů krevní plazmy denně, moči z toho vznikne jen asi 1,5 litru.',
  },
  pulmonary: {
    id: 'pulmonary',
    title: 'Malý (plicní) oběh',
    prompt: 'Seřaď cestu krve malým oběhem – ze srdce do plic a zpět.',
    steps: [{ text: 'pravá komora' }, { text: 'plicní tepna' }, { text: 'vlásečnice v plicích' }, { text: 'plicní žíly' }, { text: 'levá síň' }],
    extra: { text: 'aorta', why: 'aorta vede okysličenou krev z levé komory do těla' },
    note: 'Plicní tepnou teče krev chudá na kyslík – tepnu poznáš podle toho, že vede krev ze srdce, ne podle kyslíku.',
  },
  systemic: {
    id: 'systemic',
    title: 'Velký (tělní) oběh',
    prompt: 'Seřaď cestu krve velkým oběhem – ze srdce do těla a zpět.',
    steps: [
      { text: 'levá komora' },
      { text: 'aorta' },
      { text: 'tepny' },
      { text: 'vlásečnice v orgánech' },
      { text: 'žíly' },
      { text: 'horní a dolní dutá žíla' },
      { text: 'pravá síň' },
    ],
    note: 'Levá komora má nejsilnější stěnu – tlačí krev do celého těla, ne jen do blízkých plic.',
  },
  reflex: {
    id: 'reflex',
    title: 'Reflexní oblouk',
    prompt: 'Sáhneš na horká kamna. Seřaď, jak proběhne reflex.',
    steps: [
      { text: 'receptor v kůži zachytí podnět' },
      { text: 'dostředivý nerv vede vzruch do míchy' },
      { text: 'mícha vzruch přepojí' },
      { text: 'odstředivý nerv vede vzruch ke svalu' },
      { text: 'sval ucukne rukou' },
    ],
    note: 'Reflex obchází mozek, a proto je tak rychlý; bolest ucítíš až o chvilku později.',
  },
  ear: {
    id: 'ear',
    title: 'Cesta zvuku',
    prompt: 'Seřaď, kudy postupuje zvuk uchem až k mozku.',
    steps: [
      { text: 'zvukovod' },
      { text: 'bubínek' },
      { text: 'kladívko' },
      { text: 'kovadlinka' },
      { text: 'třmínek' },
      { text: 'hlemýžď' },
      { text: 'sluchový nerv' },
    ],
    note: 'Tři sluchové kůstky zesilují chvění bubínku; v hlemýždi ho vláskové buňky mění na vzruchy.',
  },
  eye: {
    id: 'eye',
    title: 'Cesta světla',
    prompt: 'Seřaď, čím prochází světlo v oku, než vznikne vzruch pro mozek.',
    steps: [{ text: 'rohovka' }, { text: 'zornice' }, { text: 'čočka' }, { text: 'sklivec' }, { text: 'sítnice' }, { text: 'zrakový nerv' }],
    extra: { text: 'bubínek', why: 'bubínek je v uchu' },
    note: 'Obraz na sítnici je převrácený a zmenšený – otočí ho až mozek.',
  },
  nephron: {
    id: 'nephron',
    title: 'Nefron',
    prompt: 'Seřaď, kudy teče tekutina nefronem – od filtrace až do pánvičky.',
    steps: [
      { text: 'glomerulus (klubíčko vlásečnic)' },
      { text: 'Bowmanovo pouzdro' },
      { text: 'proximální kanálek' },
      { text: 'Henleova klička' },
      { text: 'distální kanálek' },
      { text: 'sběrný kanálek' },
      { text: 'ledvinná pánvička' },
    ],
    note: 'V proximálním kanálku se vstřebá zpět všechna glukóza a většina vody i solí; ADH ladí jen zbytek ve sběrném kanálku.',
  },
  adh: {
    id: 'adh',
    title: 'Zpětná vazba: voda',
    prompt: 'Celé odpoledne ses potil a nepil. Seřaď, jak tělo šetří vodou.',
    steps: [
      { text: 'krev zhoustne – stoupne koncentrace solí' },
      { text: 'osmoreceptory v hypotalamu to zaznamenají' },
      { text: 'hypofýza vyplaví víc ADH' },
      { text: 'sběrné kanálky ledvin vracejí víc vody do krve' },
      { text: 'moči je méně a je tmavší' },
    ],
    note: 'Je to negativní zpětná vazba: jakmile se koncentrace krve vrátí k normálu, vyplavování ADH zase klesne.',
  },
  glucose: {
    id: 'glucose',
    title: 'Zpětná vazba: glukóza',
    prompt: 'Snědl jsi sladkou svačinu. Seřaď, co následuje.',
    steps: [
      { text: 'glukóza v krvi stoupne' },
      { text: 'β-buňky slinivky vyplaví inzulin' },
      { text: 'buňky přijímají glukózu, játra a svaly tvoří glykogen' },
      { text: 'glukóza v krvi klesne k normálu' },
      { text: 'vyplavování inzulinu se sníží' },
    ],
    extra: { text: 'α-buňky vyplaví glukagon', why: 'glukagon se vyplavuje při nízké glukóze, ne po jídle' },
    note: 'Při cukrovce 1. typu inzulin chybí, při 2. typu na něj buňky přestávají reagovat.',
  },
  synapse: {
    id: 'synapse',
    title: 'Synapse',
    prompt: 'Seřaď, jak se vzruch přenese přes chemickou synapsi.',
    steps: [
      { text: 'akční potenciál dorazí do zakončení axonu' },
      { text: 'do zakončení vstoupí Ca²⁺' },
      { text: 'váčky vylijí neurotransmiter do štěrbiny' },
      { text: 'neurotransmiter se naváže na receptory' },
      { text: 'na další buňce vznikne nový vzruch' },
      { text: 'neurotransmiter se rozloží nebo vrátí zpět' },
    ],
    note: 'Synapse vede vzruch jen jedním směrem – neurotransmiter je jen v presynaptickém zakončení.',
  },
  action: {
    id: 'action',
    title: 'Akční potenciál',
    prompt: 'Seřaď, co se děje na membráně neuronu během akčního potenciálu.',
    steps: [
      { text: 'klidový potenciál asi −70 mV' },
      { text: 'podnět posune napětí až na práh' },
      { text: 'Na⁺ kanály se otevřou, Na⁺ proudí dovnitř' },
      { text: 'K⁺ kanály se otevřou, K⁺ proudí ven' },
      { text: 'krátká hyperpolarizace' },
      { text: 'návrat ke klidovému potenciálu' },
    ],
    note: 'Akční potenciál platí „všechno, nebo nic“: buď podnět dosáhne prahu a vzruch má plnou výšku, nebo nevznikne.',
  },
  muscle: {
    id: 'muscle',
    title: 'Stah svalu',
    prompt: 'Seřaď, jak se sval stáhne, když k němu dorazí vzruch.',
    steps: [
      { text: 'vzruch dorazí na nervosvalovou ploténku' },
      { text: 'uvolní se acetylcholin' },
      { text: 'vzruch se šíří po membráně svalového vlákna' },
      { text: 'sarkoplazmatické retikulum uvolní Ca²⁺' },
      { text: 'myozinové hlavy táhnou aktin (spotřeba ATP)' },
      { text: 'sarkomery se zkrátí' },
    ],
    note: 'ATP potřebuje sval i k uvolnění – bez něj se myozin od aktinu neodpojí (posmrtná ztuhlost).',
  },
  immune: {
    id: 'immune',
    title: 'Imunitní odpověď',
    prompt: 'Do rány se dostaly bakterie. Seřaď, jak vznikne protilátková odpověď.',
    steps: [
      { text: 'makrofág pohltí bakterii a předloží její antigen' },
      { text: 'pomocný T-lymfocyt antigen rozpozná' },
      { text: 'B-lymfocyt se aktivuje a množí' },
      { text: 'plazmatické buňky tvoří protilátky' },
      { text: 'paměťové buňky zůstanou pro příště' },
    ],
    note: 'Díky paměťovým buňkám je druhá odpověď rychlejší a silnější – na tom stojí očkování.',
  },
}

/* ------------------------------------------------------------------ levels */

export interface LevelSet {
  place: string[]
  match: string[]
  paths: string[]
  mix: { place: number; match: number; path: number }
}

export const LEVELS: Record<number, LevelSet> = {
  6: {
    place: ['digest', 'breath', 'urine', 'nerve', 'skeleton', 'endocrine'],
    match: ['organs6'],
    paths: ['air', 'food', 'urine', 'pulmonary', 'systemic', 'reflex', 'ear', 'eye'],
    mix: { place: 3, match: 1, path: 4 },
  },
  11: {
    place: ['endocrine', 'immune'],
    match: ['glands11', 'effects11', 'immune11', 'physio11'],
    paths: ['nephron', 'adh', 'glucose', 'synapse', 'action', 'muscle', 'immune'],
    mix: { place: 1, match: 3, path: 4 },
  },
}

/** Free play: both levels, shorter. */
export const MIX_FREE: Record<number, LevelSet['mix']> = {
  6: { place: 2, match: 1, path: 1 },
  11: { place: 0, match: 2, path: 2 },
}

/** Markers in one picture are at least this far apart (viewBox units). */
export const MIN_GAP = 30
