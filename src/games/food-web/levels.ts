/**
 * Potravní síť – species, Czech food webs and energy settings per level
 * (spec/courses/biologie/games.md): 5 who eats whom among vertebrates ·
 * 8 Czech ecosystems and the energy pyramid · 12 populations, communities and energy flow.
 *
 * The webs are simplified but every arrow is a real feeding link (food → eater, the way
 * energy flows). Answers, trophic levels and the consequences of removing a species are
 * computed from these arrows in logic.ts.
 */
import type { ChemIcon } from '../../illustrations/catalog'

export interface Species {
  id: string
  /** Full Czech name. */
  name: string
  latin: string
  /** Short name used in the web and in sentences (nominative). */
  short: string
  icon: ChemIcon
  vertebrate?: boolean
}

export interface Ecosystem {
  id: string
  /** "smíšený les" */
  name: string
  /** "Z lesa" – start of a removal question. */
  from: string
  /** Feeding links: [food, eater]. Producers are the species that eat nothing. */
  eats: [string, string][]
}

const sp = (id: string, name: string, latin: string, short: string, icon: ChemIcon, vertebrate = false): Species => ({ id, name, latin, short, icon, vertebrate })

export const SPECIES: Record<string, Species> = Object.fromEntries(
  [
    // producers
    sp('dub', 'dub letní', 'Quercus robur', 'dub', 'tree'),
    sp('smrk', 'smrk ztepilý', 'Picea abies', 'smrk', 'tree'),
    sp('buk', 'buk lesní', 'Fagus sylvatica', 'buk', 'tree'),
    sp('jedle', 'jedle bělokorá', 'Abies alba', 'jedle', 'tree'),
    sp('boruvka', 'brusnice borůvka', 'Vaccinium myrtillus', 'borůvka', 'seed'),
    sp('jetel', 'jetel luční', 'Trifolium pratense', 'jetel', 'flower'),
    sp('lipnice', 'lipnice luční', 'Poa pratensis', 'lipnice', 'leaf'),
    sp('psenice', 'pšenice setá', 'Triticum aestivum', 'pšenice', 'seed'),
    sp('zelenivka', 'zelenivka obecná', 'Chlorella vulgaris', 'zelenivka', 'droplets'),
    sp('okrehek', 'okřehek menší', 'Lemna minor', 'okřehek', 'leaf'),
    // invertebrates
    sp('obalec', 'obaleč dubový (housenky)', 'Tortrix viridana', 'obaleč', 'butterfly'),
    sp('konik', 'koník zelený', 'Omocestus viridulus', 'koník', 'bee'),
    sp('hrotnatka', 'hrotnatka velká', 'Daphnia magna', 'hrotnatka', 'amoeba'),
    sp('pakomar', 'pakomár péřitý (larvy)', 'Chironomus plumosus', 'pakomár', 'worm'),
    // fish
    sp('plotice', 'plotice obecná', 'Rutilus rutilus', 'plotice', 'fish', true),
    sp('kapr', 'kapr obecný', 'Cyprinus carpio', 'kapr', 'fish', true),
    sp('stika', 'štika obecná', 'Esox lucius', 'štika', 'fish', true),
    // birds
    sp('sykora', 'sýkora koňadra', 'Parus major', 'sýkora', 'bird', true),
    sp('krahujec', 'krahujec obecný', 'Accipiter nisus', 'krahujec', 'bird', true),
    sp('pustik', 'puštík obecný', 'Strix aluco', 'puštík', 'bird', true),
    sp('kane', 'káně lesní', 'Buteo buteo', 'káně', 'bird', true),
    sp('tuhyk', 'ťuhýk obecný', 'Lanius collurio', 'ťuhýk', 'bird', true),
    sp('cap', 'čáp bílý', 'Ciconia ciconia', 'čáp', 'bird', true),
    sp('postolka', 'poštolka obecná', 'Falco tinnunculus', 'poštolka', 'bird', true),
    sp('kachna', 'kachna divoká', 'Anas platyrhynchos', 'kachna', 'bird', true),
    sp('volavka', 'volavka popelavá', 'Ardea cinerea', 'volavka', 'bird', true),
    // mammals
    sp('mysice', 'myšice lesní', 'Apodemus flavicollis', 'myšice', 'mouse', true),
    sp('veverka', 'veverka obecná', 'Sciurus vulgaris', 'veverka', 'mouse', true),
    sp('hrabos', 'hraboš polní', 'Microtus arvalis', 'hraboš', 'mouse', true),
    sp('zajic', 'zajíc polní', 'Lepus europaeus', 'zajíc', 'paw', true),
    sp('srnec', 'srnec obecný', 'Capreolus capreolus', 'srnec', 'deer', true),
    sp('jelen', 'jelen lesní', 'Cervus elaphus', 'jelen', 'deer', true),
    sp('prase', 'prase divoké', 'Sus scrofa', 'prase', 'paw', true),
    sp('kuna', 'kuna lesní', 'Martes martes', 'kuna', 'paw', true),
    sp('lasice', 'lasice kolčava', 'Mustela nivalis', 'lasice', 'paw', true),
    sp('liska', 'liška obecná', 'Vulpes vulpes', 'liška', 'paw', true),
    sp('vydra', 'vydra říční', 'Lutra lutra', 'vydra', 'paw', true),
    sp('rys', 'rys ostrovid', 'Lynx lynx', 'rys', 'paw', true),
    sp('vlk', 'vlk obecný', 'Canis lupus', 'vlk', 'paw', true),
  ].map((s) => [s.id, s]),
)

export const ECOSYSTEMS: Record<string, Ecosystem> = {
  les: {
    id: 'les',
    name: 'smíšený les',
    from: 'Z lesa',
    eats: [
      ['dub', 'obalec'],
      ['dub', 'mysice'],
      ['dub', 'veverka'],
      ['dub', 'srnec'],
      ['smrk', 'veverka'],
      ['smrk', 'mysice'],
      ['obalec', 'sykora'],
      ['sykora', 'krahujec'],
      ['mysice', 'pustik'],
      ['mysice', 'liska'],
      ['mysice', 'kuna'],
      ['mysice', 'kane'],
      ['veverka', 'kuna'],
      ['srnec', 'rys'],
    ],
  },
  louka: {
    id: 'louka',
    name: 'louka a pole',
    from: 'Z louky',
    eats: [
      ['lipnice', 'konik'],
      ['lipnice', 'zajic'],
      ['lipnice', 'hrabos'],
      ['jetel', 'zajic'],
      ['jetel', 'hrabos'],
      ['psenice', 'hrabos'],
      ['konik', 'tuhyk'],
      ['konik', 'cap'],
      ['hrabos', 'postolka'],
      ['hrabos', 'lasice'],
      ['hrabos', 'liska'],
      ['hrabos', 'cap'],
      ['zajic', 'liska'],
    ],
  },
  rybnik: {
    id: 'rybnik',
    name: 'rybník',
    from: 'Z rybníka',
    eats: [
      ['zelenivka', 'hrotnatka'],
      ['zelenivka', 'pakomar'],
      ['okrehek', 'kachna'],
      ['hrotnatka', 'plotice'],
      ['hrotnatka', 'kapr'],
      ['pakomar', 'plotice'],
      ['pakomar', 'kapr'],
      ['plotice', 'stika'],
      ['plotice', 'volavka'],
      ['plotice', 'vydra'],
      ['kapr', 'volavka'],
      ['kapr', 'vydra'],
      ['stika', 'vydra'],
    ],
  },
  hory: {
    id: 'hory',
    name: 'horský les se šelmami',
    from: 'Z horského lesa',
    eats: [
      ['jedle', 'jelen'],
      ['jedle', 'srnec'],
      ['buk', 'jelen'],
      ['buk', 'srnec'],
      ['buk', 'prase'],
      ['buk', 'mysice'],
      ['boruvka', 'jelen'],
      ['boruvka', 'mysice'],
      ['mysice', 'prase'],
      ['mysice', 'liska'],
      ['mysice', 'pustik'],
      ['srnec', 'rys'],
      ['srnec', 'vlk'],
      ['jelen', 'vlk'],
      ['prase', 'vlk'],
    ],
  },
}

export type TaskKind = 'chain' | 'food' | 'eater' | 'removal' | 'order' | 'pyramid' | 'efficiency' | 'energy' | 'biomass'

export interface LevelSet {
  /** Ecosystems whose webs the level plays. */
  ecosystems: string[]
  /** Task kinds of a round, in order (10 tasks). */
  plan: TaskKind[]
  /** Chain lengths (number of species) used in chain tasks. */
  chainLengths: number[]
}

export const LEVELS: Record<number, LevelSet> = {
  5: {
    ecosystems: ['les', 'louka', 'rybnik'],
    plan: ['chain', 'food', 'eater', 'chain', 'food', 'eater', 'chain', 'food', 'eater', 'chain'],
    chainLengths: [3, 4],
  },
  8: {
    ecosystems: ['les', 'louka', 'rybnik'],
    plan: ['chain', 'removal', 'order', 'pyramid', 'chain', 'removal', 'order', 'pyramid', 'removal', 'chain'],
    chainLengths: [4, 5],
  },
  12: {
    ecosystems: ['les', 'louka', 'rybnik', 'hory'],
    plan: ['removal', 'efficiency', 'energy', 'removal', 'biomass', 'removal', 'efficiency', 'energy', 'removal', 'biomass'],
    chainLengths: [4, 5],
  },
}

/** Energy fixed by producers in the questions (kJ). */
export const PRODUCER_ENERGY = [10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000]
/** Transfer efficiencies used at level 12 (%), around the textbook 10 %. */
export const EFFICIENCIES = [5, 8, 10, 12, 15, 20]
/** Producer production per year (kJ/m²) for the efficiency questions. */
export const PRODUCTION = [8_000, 12_000, 15_000, 20_000, 25_000, 30_000]
