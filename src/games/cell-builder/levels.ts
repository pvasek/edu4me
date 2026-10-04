/**
 * Stavitel buňky – curated biology (spec/courses/biologie/games.md, syllabus b1-3 and b9-2).
 * Which cell has which structure, what each structure does, and where it is drawn.
 */

export type CellId = 'plant' | 'animal' | 'bacterium'

export type PartId =
  | 'stena'
  | 'membrana'
  | 'cytoplazma'
  | 'jadro'
  | 'jaderko'
  | 'mitochondrie'
  | 'chloroplast'
  | 'vakuola'
  | 'ribozomy'
  | 'drsneER'
  | 'hladkeER'
  | 'golgi'
  | 'lysozom'
  | 'centrioly'
  | 'vacek'
  | 'cytoskelet'
  | 'nukleoid'
  | 'plazmid'
  | 'bicik'

export interface Cell {
  id: CellId
  name: string
  /** "rostlinnou buňku" */
  acc: string
  /** "v rostlinné buňce" */
  inName: string
  /** Short name for zone headers. */
  short: string
  /** One line: how to tell this cell. */
  note: string
}

export const CELLS: Record<CellId, Cell> = {
  plant: { id: 'plant', name: 'rostlinná buňka', acc: 'rostlinnou buňku', inName: 'v rostlinné buňce', short: 'rostlinná', note: 'Rostlinnou buňku poznáš podle buněčné stěny, chloroplastů a velké vakuoly.' },
  animal: { id: 'animal', name: 'živočišná buňka', acc: 'živočišnou buňku', inName: 'v živočišné buňce', short: 'živočišná', note: 'Živočišná buňka nemá stěnu, chloroplasty ani velkou vakuolu, a proto nemá pevný tvar.' },
  bacterium: { id: 'bacterium', name: 'bakteriální buňka', acc: 'bakteriální buňku', inName: 'v bakteriální buňce', short: 'bakteriální', note: 'Bakterie nemá jádro ani organely s membránou – je to prokaryotní buňka.' },
}

export interface Part {
  id: PartId
  name: string
  /** Name on a sorting card when the plain name would be ambiguous. */
  sortName?: string
  /** Cells that really have the structure. */
  in: CellId[]
  /**
   * Cells where "it is missing" would be too strong a claim (animal cells have small vacuoles,
   * sperm cells have a flagellum, …). Such a pair is never asked.
   */
  unsure?: CellId[]
  /** Extra line for a sorting card. */
  sortNote?: string
  /** Function in ZŠ words (level 1). */
  fn1?: string
  /** Function at gymnázium depth (level 9). */
  fn9?: string
  /** Why a cell does not have it (one clause). */
  lacks?: Partial<Record<CellId, string>>
}

export const PARTS: Record<PartId, Part> = {
  stena: {
    id: 'stena',
    name: 'buněčná stěna',
    in: ['plant', 'bacterium'],
    sortNote: 'Stěnu mají rostliny (z celulózy) i bakterie (z peptidoglykanu), živočišná buňka ne.',
    fn1: 'pevný obal – dává buňce tvar a chrání ji',
    fn9: 'pevnost a tvar; brání prasknutí buňky, když nasaje vodu',
    lacks: { animal: 'živočišnou buňku ohraničuje jen pružná membrána' },
  },
  membrana: {
    id: 'membrana',
    name: 'cytoplazmatická membrána',
    in: ['plant', 'animal', 'bacterium'],
    fn1: 'tenká blána – odděluje buňku od okolí a propouští jen některé látky',
    fn9: 'výběrově propustná hranice: řídí, co do buňky vstoupí a co z ní odejde',
  },
  cytoplazma: {
    id: 'cytoplazma',
    name: 'cytoplazma',
    in: ['plant', 'animal', 'bacterium'],
    fn1: 'rosolovitý vnitřek buňky, v němž probíhá většina dějů',
  },
  jadro: {
    id: 'jadro',
    name: 'jádro',
    in: ['plant', 'animal'],
    fn1: 'uchovává dědičnou informaci (DNA) a řídí činnost buňky',
    fn9: 'uchovává DNA za dvojitým jaderným obalem; probíhá v něm replikace a přepis DNA do RNA',
    lacks: { bacterium: 'bakterie má DNA volně v cytoplazmě (nukleoid)' },
  },
  jaderko: {
    id: 'jaderko',
    name: 'jadérko',
    in: ['plant', 'animal'],
    fn9: 'tvoří rRNA a skládá z ní podjednotky ribozomů',
    lacks: { bacterium: 'bakterie nemá jádro, a tedy ani jadérko' },
  },
  mitochondrie: {
    id: 'mitochondrie',
    name: 'mitochondrie',
    in: ['plant', 'animal'],
    fn1: 'buněčné dýchání – uvolňuje energii z cukru',
    fn9: 'buněčné dýchání: Krebsův cyklus a dýchací řetězec tvoří většinu ATP',
    lacks: { bacterium: 'bakterie nemá organely s membránou, dýchá na cytoplazmatické membráně' },
  },
  chloroplast: {
    id: 'chloroplast',
    name: 'chloroplast',
    in: ['plant'],
    fn1: 'fotosyntéza – ze světla, vody a CO₂ vyrábí cukr',
    fn9: 'fotosyntéza: v tylakoidech světelná fáze, ve stromatu Calvinův cyklus',
    lacks: {
      animal: 'živočichové nefotosyntetizují, potravu přijímají',
      bacterium: 'bakterie nemá organely s membránou (sinice fotosyntetizují bez chloroplastů)',
    },
  },
  vakuola: {
    id: 'vakuola',
    name: 'vakuola',
    sortName: 'velká centrální vakuola',
    in: ['plant'],
    unsure: ['animal'],
    fn1: 'zásobárna vody a látek – drží buňku napjatou',
    fn9: 'velký váček s buněčnou šťávou: udržuje turgor, ukládá látky i odpad',
    lacks: { bacterium: 'bakterie nemá organely s membránou' },
  },
  ribozomy: {
    id: 'ribozomy',
    name: 'ribozomy',
    in: ['plant', 'animal', 'bacterium'],
    sortNote: 'Ribozomy má každá buňka – bez bílkovin by nežila (bakteriální jsou jen menší).',
    fn1: 'vyrábějí bílkoviny',
    fn9: 'překládají mRNA do pořadí aminokyselin – syntéza bílkovin',
  },
  drsneER: {
    id: 'drsneER',
    name: 'drsné endoplazmatické retikulum',
    in: ['plant', 'animal'],
    fn9: 'nese ribozomy; vznikají v něm bílkoviny na export a do membrán',
    lacks: { bacterium: 'bakterie nemá vnitřní membrány' },
  },
  hladkeER: {
    id: 'hladkeER',
    name: 'hladké endoplazmatické retikulum',
    in: ['plant', 'animal'],
    fn9: 'syntéza lipidů a steroidů, odbourání jedů, zásobárna Ca²⁺',
    lacks: { bacterium: 'bakterie nemá vnitřní membrány' },
  },
  golgi: {
    id: 'golgi',
    name: 'Golgiho aparát',
    in: ['plant', 'animal'],
    fn9: 'upravuje, třídí a balí bílkoviny do váčků a posílá je na místo určení',
    lacks: { bacterium: 'bakterie nemá vnitřní membrány' },
  },
  lysozom: {
    id: 'lysozom',
    name: 'lysozom',
    in: ['animal'],
    unsure: ['plant'],
    fn9: 'váček s trávicími enzymy – rozloží pohlcené částice i opotřebené organely',
    lacks: { bacterium: 'bakterie nemá organely s membránou' },
  },
  centrioly: {
    id: 'centrioly',
    name: 'centrioly',
    in: ['animal'],
    fn9: 'jádro centrozomu: organizují mikrotubuly a dělicí vřeténko',
    lacks: {
      plant: 'buňky krytosemenných rostlin centrioly nemají, vřeténko tvoří bez nich',
      bacterium: 'bakterie nemá centrioly ani mikrotubuly',
    },
  },
  vacek: {
    id: 'vacek',
    name: 'sekreční váček',
    in: ['plant', 'animal'],
    fn9: 'veze látky z Golgiho aparátu k membráně a vylije je ven (exocytóza)',
    lacks: { bacterium: 'bakterie nemá organely s membránou' },
  },
  cytoskelet: {
    id: 'cytoskelet',
    name: 'cytoskelet',
    in: ['plant', 'animal'],
    unsure: ['bacterium'],
    fn9: 'síť mikrotubulů a vláken: drží tvar buňky a pohání pohyb organel i dělení',
  },
  nukleoid: {
    id: 'nukleoid',
    name: 'nukleoid',
    in: ['bacterium'],
    fn1: 'DNA bakterie – leží volně v cytoplazmě, bez jádra',
    fn9: 'kruhová chromozomová DNA bakterie volně v cytoplazmě, bez jaderného obalu',
    lacks: {
      plant: 'eukaryotní buňka má DNA uzavřenou v jádře',
      animal: 'eukaryotní buňka má DNA uzavřenou v jádře',
    },
  },
  plazmid: {
    id: 'plazmid',
    name: 'plazmid',
    in: ['bacterium'],
    fn9: 'malá kruhová DNA navíc – nese třeba geny odolnosti vůči antibiotikům',
    lacks: {
      plant: 'plazmidy mají bakterie, ne buňky rostlin',
      animal: 'plazmidy mají bakterie, ne buňky živočichů',
    },
  },
  bicik: {
    id: 'bicik',
    name: 'bičík',
    in: ['bacterium'],
    unsure: ['plant', 'animal'],
    fn1: 'pohyb – roztáčí se jako lodní šroub',
    fn9: 'otáčivý pohon bakterie poháněný tokem iontů přes membránu',
  },
}

/** Structures drawn in each picture, with the point the marker sits on (viewBox 360 × 260). */
export const ANCHORS: Record<CellId, Partial<Record<PartId, [number, number]>>> = {
  plant: {
    stena: [16, 160],
    membrana: [318, 238],
    cytoplazma: [125, 46],
    jadro: [62, 68],
    jaderko: [86, 90],
    mitochondrie: [114, 158],
    chloroplast: [250, 35],
    vakuola: [232, 128],
    ribozomy: [134, 186],
    drsneER: [76, 130],
    hladkeER: [106, 212],
    golgi: [64, 178],
  },
  animal: {
    membrana: [190, 24],
    cytoplazma: [244, 52],
    jadro: [148, 98],
    jaderko: [173, 125],
    mitochondrie: [95, 88],
    ribozomy: [140, 200],
    drsneER: [215, 118],
    hladkeER: [250, 204],
    golgi: [268, 152],
    vacek: [308, 118],
    lysozom: [192, 212],
    centrioly: [108, 148],
    cytoskelet: [84, 180],
  },
  bacterium: {
    stena: [100, 76],
    membrana: [120, 178],
    cytoplazma: [70, 130],
    nukleoid: [152, 130],
    plazmid: [232, 108],
    ribozomy: [196, 156],
    bicik: [331, 132],
  },
}

/** Visible part of each picture: [top, height] of the 360-wide view box (the bacterium is a flat rod). */
export const VIEW: Record<CellId, [number, number]> = { plant: [0, 260], animal: [0, 260], bacterium: [56, 148] }

/** Structures whose absence a learner can spot in the picture. */
export const MISSABLE: PartId[] = [
  'stena',
  'jadro',
  'jaderko',
  'mitochondrie',
  'chloroplast',
  'vakuola',
  'golgi',
  'drsneER',
  'lysozom',
  'centrioly',
  'nukleoid',
  'plazmid',
  'bicik',
]

/** A sorting scheme: groups of cells compared; a card goes to "only A", "only B" or "both". */
export interface Scheme {
  id: string
  groups: [{ name: string; cells: CellId[] }, { name: string; cells: CellId[] }]
}

export interface LevelSet {
  /** Vocabulary of the level. */
  parts: PartId[]
  /** Cells drawn in this level's tasks. */
  cells: CellId[]
  schemes: Scheme[]
  /** How many organelles a labelling task asks. */
  labelN: number
  /** Function text used. */
  fn: 'fn1' | 'fn9'
  /** Tasks in a round of this level. */
  mix: { label: number; function: number; sort: number; missing: number }
}

const L1_PARTS: PartId[] = ['stena', 'membrana', 'cytoplazma', 'jadro', 'mitochondrie', 'chloroplast', 'vakuola', 'ribozomy', 'nukleoid', 'bicik']

export const LEVELS: Record<number, LevelSet> = {
  1: {
    parts: L1_PARTS,
    cells: ['plant', 'animal', 'bacterium'],
    schemes: [
      { id: 'plant-animal', groups: [{ name: 'rostlinná', cells: ['plant'] }, { name: 'živočišná', cells: ['animal'] }] },
      { id: 'plant-bacterium', groups: [{ name: 'rostlinná', cells: ['plant'] }, { name: 'bakteriální', cells: ['bacterium'] }] },
      { id: 'animal-bacterium', groups: [{ name: 'živočišná', cells: ['animal'] }, { name: 'bakteriální', cells: ['bacterium'] }] },
    ],
    labelN: 5,
    fn: 'fn1',
    mix: { label: 2, function: 2, sort: 2, missing: 2 },
  },
  9: {
    parts: Object.keys(PARTS) as PartId[],
    cells: ['plant', 'animal', 'bacterium'],
    schemes: [
      { id: 'prok-euk', groups: [{ name: 'prokaryotní', cells: ['bacterium'] }, { name: 'eukaryotní', cells: ['plant', 'animal'] }] },
      { id: 'plant-animal', groups: [{ name: 'rostlinná', cells: ['plant'] }, { name: 'živočišná', cells: ['animal'] }] },
    ],
    labelN: 6,
    fn: 'fn9',
    mix: { label: 2, function: 3, sort: 2, missing: 1 },
  },
}

/** Free play: a shorter mix of both levels. */
export const MIX_FREE: Record<number, LevelSet['mix']> = {
  1: { label: 1, function: 1, sort: 1, missing: 1 },
  9: { label: 1, function: 2, sort: 1, missing: 0 },
}
