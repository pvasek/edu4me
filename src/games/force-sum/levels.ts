/**
 * Výslednice sil – scene templates per level (spec/courses/fyzika/games.md).
 * Only parameter ranges live here; every number and answer is generated and
 * computed in logic.ts.
 *
 * Angles are in degrees from the positive x axis (to the right), counter-clockwise.
 */

/** [min, max, step] – a value is drawn from min, min + step, … max. */
export type Range = readonly [number, number, number]

/** L2: forces on one line (f2-3, f2-4). */
export interface LineForce {
  /** Symbol with subscript, e.g. "F_{1}", "F_{G}". */
  label: string
  /** Who or what exerts it (Czech, lower case). */
  who: string
  /** Direction: 0 → right, 180 → left, 90 → up, 270 → down. */
  angle: 0 | 90 | 180 | 270
  /** Magnitude in N… */
  range?: Range
  /** …or a mass in kg: the force is the weight F_{G} = m·g with g = 10 N/kg. */
  mass?: Range
  /** Mass is given in the text but the weight is what acts – what the mass belongs to. */
  massOf?: string
}

export interface LineScene {
  id: string
  title: string
  /** One sentence setting the scene. */
  text: string
  body: BodyShape
  forces: LineForce[]
  /** Index of the force the learner adds in a balance task (undefined = no balance task). */
  balance?: number
  /** Balance task question (what keeps the body at rest / at constant speed). */
  balanceText?: string
  /** Whether a resultant task is generated for this scene. */
  resultant: boolean
  /** Snap step of the dragged arrow in N. */
  snap: number
  /** Resultant tasks: the resultant never points against the first force (a static body is not pushed backwards by friction). */
  nonNegative?: boolean
}

export type BodyShape = 'box' | 'ball' | 'ring' | 'lamp' | 'boat' | 'car' | 'rocket' | 'person' | 'sled' | 'book'

/** L8: forces at an angle (f8-1, f8-5). */
export interface AngleForce {
  label: string
  who: string
  range: Range
  /** Possible directions in degrees. */
  angles: readonly number[]
}

export interface AngleScene {
  id: string
  title: string
  text: string
  body: BodyShape
  unit: 'N' | 'kN'
  forces: AngleForce[]
  /** 'resultant': find the resultant; 'balance': add the force that keeps the body at rest. */
  kind: 'resultant' | 'balance'
  snap: number
}

export interface ComponentScene {
  id: string
  title: string
  /** Sentence with {F} and {a} placeholders filled by logic.ts. */
  text: string
  body: BodyShape
  unit: 'N' | 'kN'
  range: Range
  angles: readonly number[]
}

export interface InclineScene {
  id: string
  title: string
  /** Sentence with {m} and {a} placeholders. */
  text: string
  /** Mass range in kg. */
  mass: Range
  angles: readonly number[]
  unit: 'N' | 'kN'
}

/* ------------------------------------------------------------------ L2 */

export const LINE_SCENES: LineScene[] = [
  {
    id: 'tug',
    title: 'Přetahovaná',
    text: 'Dvě dvojice se přetahují lanem.',
    body: 'ring',
    forces: [
      { label: 'F_{1}', who: 'Adam', angle: 180, range: [150, 350, 10] },
      { label: 'F_{2}', who: 'Bára', angle: 180, range: [120, 300, 10] },
      { label: 'F_{3}', who: 'Cyril', angle: 0, range: [150, 350, 10] },
      { label: 'F_{4}', who: 'Dana', angle: 0, range: [120, 300, 10] },
    ],
    balance: 3,
    balanceText: 'Jak velkou silou a kterým směrem musí táhnout Dana, aby se lano nehnulo?',
    resultant: true,
    snap: 10,
  },
  {
    id: 'wardrobe',
    title: 'Stěhování skříně',
    text: 'Petr skříň tlačí, Jana ji zepředu táhne a proti pohybu působí tření.',
    body: 'box',
    forces: [
      { label: 'F_{1}', who: 'Petr', angle: 0, range: [150, 350, 10] },
      { label: 'F_{2}', who: 'Jana', angle: 0, range: [80, 200, 10] },
      { label: 'F_{t}', who: 'tření', angle: 180, range: [200, 450, 10] },
    ],
    nonNegative: true,
    balance: 2,
    balanceText: 'Skříň se ani nehne. Jak velká třecí síla na ni působí a jakým směrem?',
    resultant: true,
    snap: 10,
  },
  {
    id: 'lamp',
    title: 'Lampa na lanku',
    text: 'Lampa visí v klidu na lanku ze stropu.',
    body: 'lamp',
    forces: [
      { label: 'F_{G}', who: 'tíhová síla', angle: 270, mass: [1, 8, 1], massOf: 'lampa' },
      { label: 'F_{L}', who: 'lanko', angle: 90, range: [10, 80, 10] },
    ],
    balance: 1,
    balanceText: 'Jakou silou musí lanko lampu držet (g = 10 N/kg)?',
    resultant: false,
    snap: 5,
  },
  {
    id: 'boat',
    title: 'Motorový člun',
    text: 'Motor žene člun dopředu, vítr fouká do zádi a voda klade odpor.',
    body: 'boat',
    forces: [
      { label: 'F_{m}', who: 'motor', angle: 0, range: [400, 1200, 50] },
      { label: 'F_{v}', who: 'vítr', angle: 0, range: [50, 250, 50] },
      { label: 'F_{o}', who: 'odpor vody', angle: 180, range: [300, 1100, 50] },
    ],
    balance: 2,
    balanceText: 'Člun pluje stálou rychlostí. Jak velký je odpor vody a kam míří?',
    resultant: true,
    snap: 50,
  },
  {
    id: 'rocket',
    title: 'Start modelu rakety',
    text: 'Model rakety startuje svisle vzhůru (g = 10 N/kg).',
    body: 'rocket',
    forces: [
      { label: 'F_{m}', who: 'tah motoru', angle: 90, range: [6, 20, 1] },
      { label: 'F_{G}', who: 'tíhová síla', angle: 270, mass: [0.2, 0.5, 0.1], massOf: 'raketa' },
    ],
    resultant: true,
    snap: 1,
  },
  {
    id: 'para',
    title: 'Parašutista',
    text: 'Parašutista s padákem klesá k zemi (g = 10 N/kg).',
    body: 'person',
    forces: [
      { label: 'F_{G}', who: 'tíhová síla', angle: 270, mass: [60, 100, 5], massOf: 'parašutista i s výstrojí' },
      { label: 'F_{o}', who: 'odpor vzduchu', angle: 90, range: [300, 900, 50] },
    ],
    balance: 1,
    balanceText: 'Padá stálou rychlostí. Jak velký je odpor vzduchu a kam míří?',
    resultant: true,
    snap: 50,
  },
  {
    id: 'car',
    title: 'Auto na silnici',
    text: 'Motor pohání auto, proti pohybu působí odpor vzduchu a valivé tření.',
    body: 'car',
    forces: [
      { label: 'F_{m}', who: 'tažná síla motoru', angle: 0, range: [800, 2400, 100] },
      { label: 'F_{o}', who: 'odpor vzduchu', angle: 180, range: [200, 900, 50] },
      { label: 'F_{t}', who: 'valivé tření', angle: 180, range: [150, 400, 50] },
    ],
    balance: 0,
    balanceText: 'Auto jede stálou rychlostí. Jakou tažnou silou a kterým směrem působí motor?',
    resultant: true,
    snap: 50,
  },
  {
    id: 'sled',
    title: 'Psí spřežení',
    text: 'Dva psi táhnou saně po sněhu, proti pohybu působí tření.',
    body: 'sled',
    forces: [
      { label: 'F_{1}', who: 'pes Alík', angle: 0, range: [100, 300, 10] },
      { label: 'F_{2}', who: 'pes Bety', angle: 0, range: [100, 300, 10] },
      { label: 'F_{t}', who: 'tření', angle: 180, range: [80, 400, 10] },
    ],
    resultant: true,
    snap: 10,
  },
  {
    id: 'book',
    title: 'Kniha na stole',
    text: 'Kniha leží v klidu na stole (g = 10 N/kg).',
    body: 'book',
    forces: [
      { label: 'F_{G}', who: 'tíhová síla', angle: 270, mass: [0.5, 3, 0.5], massOf: 'kniha' },
      { label: 'F_{N}', who: 'stůl', angle: 90, range: [5, 30, 5] },
    ],
    balance: 1,
    balanceText: 'Jakou silou a kterým směrem na ni tlačí stůl?',
    resultant: false,
    snap: 1,
  },
]

/* ------------------------------------------------------------------ L8 */

export const ANGLE_SCENES: AngleScene[] = [
  {
    id: 'puck',
    title: 'Puk a dvě hokejky',
    text: 'Dvě hokejky strčí do puku současně, každá jiným směrem.',
    body: 'ball',
    unit: 'N',
    forces: [
      { label: 'F_{1}', who: 'první hokejka', range: [3, 15, 1], angles: [0] },
      { label: 'F_{2}', who: 'druhá hokejka', range: [3, 15, 1], angles: [90] },
    ],
    kind: 'resultant',
    snap: 1,
  },
  {
    id: 'tugs',
    title: 'Dva remorkéry',
    text: 'Dva remorkéry vlečou nákladní loď, lana svírají s osou lodi různé úhly.',
    body: 'boat',
    unit: 'kN',
    forces: [
      { label: 'F_{1}', who: 'první remorkér', range: [20, 60, 5], angles: [20, 25, 30, 35, 40] },
      { label: 'F_{2}', who: 'druhý remorkér', range: [20, 60, 5], angles: [320, 325, 330, 335, 340] },
    ],
    kind: 'resultant',
    snap: 1,
  },
  {
    id: 'ropes2',
    title: 'Dvě lana',
    text: 'Na kládu působí dvě lana, která svírají tupý nebo ostrý úhel.',
    body: 'box',
    unit: 'N',
    forces: [
      { label: 'F_{1}', who: 'první lano', range: [100, 400, 10], angles: [0] },
      { label: 'F_{2}', who: 'druhé lano', range: [100, 400, 10], angles: [45, 60, 120, 135] },
    ],
    kind: 'resultant',
    snap: 10,
  },
  {
    id: 'three',
    title: 'Tři síly',
    text: 'Na těleso na hladkém stole působí tři vodorovná lana.',
    body: 'box',
    unit: 'N',
    forces: [
      { label: 'F_{1}', who: 'první lano', range: [10, 50, 1], angles: [0] },
      { label: 'F_{2}', who: 'druhé lano', range: [10, 50, 1], angles: [90] },
      { label: 'F_{3}', who: 'třetí lano', range: [10, 50, 1], angles: [135, 180, 225] },
    ],
    kind: 'resultant',
    snap: 1,
  },
  {
    id: 'ring',
    title: 'Kroužek na třech lanech',
    text: 'Dvě děti táhnou za lana kroužek, třetí ho má udržet v klidu.',
    body: 'ring',
    unit: 'N',
    forces: [
      { label: 'F_{1}', who: 'Eva', range: [40, 120, 5], angles: [0, 10, 20] },
      { label: 'F_{2}', who: 'Filip', range: [40, 120, 5], angles: [90, 100, 110, 120] },
    ],
    kind: 'balance',
    snap: 1,
  },
  {
    id: 'horses',
    title: 'Kláda a dva koně',
    text: 'Dva koně táhnou kládu po louce, lano uvázané ke stromu ji drží na místě.',
    body: 'box',
    unit: 'N',
    forces: [
      { label: 'F_{1}', who: 'první kůň', range: [300, 800, 50], angles: [0, 10, 20, 30] },
      { label: 'F_{2}', who: 'druhý kůň', range: [300, 800, 50], angles: [60, 75, 90] },
    ],
    kind: 'balance',
    snap: 10,
  },
  {
    id: 'kite',
    title: 'Drak na provázku',
    text: 'Na draka působí vítr a tíhová síla, provázek ho drží na jednom místě ve vzduchu.',
    body: 'box',
    unit: 'N',
    forces: [
      { label: 'F_{v}', who: 'vítr', range: [6, 16, 1], angles: [60, 70, 80] },
      { label: 'F_{G}', who: 'tíhová síla', range: [2, 6, 1], angles: [270] },
    ],
    kind: 'balance',
    snap: 1,
  },
]

export const COMPONENT_SCENES: ComponentScene[] = [
  {
    id: 'suitcase',
    title: 'Kufr na kolečkách',
    text: 'Táhneš kufr silou {F} pod úhlem {a} nad vodorovnou rovinou.',
    body: 'box',
    unit: 'N',
    range: [40, 120, 5],
    angles: [20, 30, 40, 45, 50, 60],
  },
  {
    id: 'sledge',
    title: 'Sáně na provaze',
    text: 'Táta táhne sáně silou {F}, provaz svírá se zemí úhel {a}.',
    body: 'sled',
    unit: 'N',
    range: [60, 200, 10],
    angles: [15, 20, 25, 30, 35, 40],
  },
  {
    id: 'skilift',
    title: 'Lyžařský vlek',
    text: 'Kotva vleku táhne lyžaře silou {F} pod úhlem {a} k vodorovné rovině.',
    body: 'person',
    unit: 'N',
    range: [200, 600, 20],
    angles: [20, 25, 30, 35],
  },
]

export const INCLINE_SCENES: InclineScene[] = [
  {
    id: 'ramp',
    title: 'Bedna na rampě',
    text: 'Bedna o hmotnosti {m} stojí na rampě se sklonem {a}.',
    mass: [10, 60, 5],
    angles: [15, 20, 25, 30, 35, 40],
    unit: 'N',
  },
  {
    id: 'sledder',
    title: 'Sáňkař na kopci',
    text: 'Sáňkař i se saněmi má hmotnost {m}, svah má sklon {a}.',
    mass: [40, 90, 5],
    angles: [10, 15, 20, 25, 30],
    unit: 'N',
  },
  {
    id: 'carhill',
    title: 'Auto ve svahu',
    text: 'Auto o hmotnosti {m} parkuje v ulici se sklonem {a}.',
    mass: [800, 1600, 100],
    angles: [5, 8, 10, 12, 15],
    unit: 'kN',
  },
]

/** Levels with their own content set (registry: courses.fyzika). */
export const LEVELS = { 2: 'line', 8: 'angle' } as const
