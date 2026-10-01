/**
 * Plave, nebo klesne? – density table and parameter sets per level
 * (spec/courses/fyzika/games.md: 1 hustota, 3 vztlaková síla a Archimédův zákon).
 * Densities are real table values at about 20 °C (ice at 0 °C), in kg/m³.
 * Every answer is computed in logic.ts.
 */

export interface Liquid {
  id: string
  /** Nominative, e.g. "voda". */
  name: string
  /** Locative with preposition, e.g. "ve vodě". */
  inName: string
  rho: number
  /** Theme token for the liquid tint. */
  tint: string
}

export interface Material {
  id: string
  /** Material name, e.g. "hliník". */
  name: string
  /** A thing made of it, e.g. "hliníkový váleček". */
  object: string
  rho: number
  /** Theme token or subject colour of the body. */
  color: string
}

export const LIQUIDS: Record<string, Liquid> = {
  water: { id: 'water', name: 'voda', inName: 've vodě', rho: 1000, tint: 'var(--blue)' },
  sea: { id: 'sea', name: 'mořská voda', inName: 'v mořské vodě', rho: 1025, tint: 'var(--teal)' },
  deadsea: { id: 'deadsea', name: 'voda z Mrtvého moře', inName: 've vodě z Mrtvého moře', rho: 1240, tint: 'var(--green)' },
  oil: { id: 'oil', name: 'slunečnicový olej', inName: 'v oleji', rho: 920, tint: 'var(--yellow)' },
  ethanol: { id: 'ethanol', name: 'líh (ethanol)', inName: 'v lihu', rho: 789, tint: 'var(--violet)' },
  glycerol: { id: 'glycerol', name: 'glycerol', inName: 'v glycerolu', rho: 1260, tint: 'var(--pink)' },
  mercury: { id: 'mercury', name: 'rtuť', inName: 've rtuti', rho: 13546, tint: 'var(--muted)' },
}

export const MATERIALS: Record<string, Material> = {
  balsa: { id: 'balsa', name: 'balzové dřevo', object: 'balzový hranolek', rho: 160, color: '#d8c08a' },
  cork: { id: 'cork', name: 'korek', object: 'korková zátka', rho: 240, color: '#b98a55' },
  spruce: { id: 'spruce', name: 'smrkové dřevo', object: 'smrkové prkénko', rho: 450, color: '#d9b26f' },
  oak: { id: 'oak', name: 'dubové dřevo', object: 'dubový špalík', rho: 750, color: '#9c6b3a' },
  paraffin: { id: 'paraffin', name: 'parafín', object: 'parafínová svíčka', rho: 900, color: '#efe7cf' },
  ice: { id: 'ice', name: 'led', object: 'kostka ledu', rho: 917, color: '#cfe3ee' },
  pe: { id: 'pe', name: 'polyethylen (PE)', object: 'víčko z polyethylenu', rho: 950, color: '#7fb3d9' },
  egg: { id: 'egg', name: 'čerstvé vejce', object: 'čerstvé vejce', rho: 1030, color: '#f2e2c4' },
  pvc: { id: 'pvc', name: 'PVC', object: 'kousek trubky z PVC', rho: 1390, color: '#a9b4c2' },
  glass: { id: 'glass', name: 'sklo', object: 'skleněná kulička', rho: 2500, color: '#9fd3c7' },
  granite: { id: 'granite', name: 'žula', object: 'žulový kamínek', rho: 2600, color: '#8f8a86' },
  aluminium: { id: 'aluminium', name: 'hliník', object: 'hliníkový váleček', rho: 2700, color: '#b8bec8' },
  iron: { id: 'iron', name: 'železo', object: 'železný šroub', rho: 7870, color: '#6f7278' },
  copper: { id: 'copper', name: 'měď', object: 'měděný drát', rho: 8960, color: '#c7773d' },
  silver: { id: 'silver', name: 'stříbro', object: 'stříbrná lžička', rho: 10490, color: '#d4d7dc' },
  lead: { id: 'lead', name: 'olovo', object: 'olověná rybářská zátěž', rho: 11340, color: '#5d6168' },
  gold: { id: 'gold', name: 'zlato', object: 'zlatý prstýnek', rho: 19300, color: '#e0b43a' },
  platinum: { id: 'platinum', name: 'platina', object: 'platinový plíšek', rho: 21450, color: '#c9c9cf' },
}

/** Bodies that hover (vznáší se): their mean density equals the liquid's. m is computed as V · ρ. */
export interface HoverScene {
  id: string
  /** Text with {m} and {V} placeholders. */
  text: string
  liquid: string
  /** Volumes to choose from, in the unit below. */
  volumes: readonly number[]
  unit: 'cm3' | 'm3'
  color: string
}

export const HOVER_SCENES: HoverScene[] = [
  {
    id: 'sub',
    text: 'Ponorka s napuštěnými nádržemi má objem {V} a hmotnost {m}.',
    liquid: 'sea',
    volumes: [1200, 1600, 2000, 2400],
    unit: 'm3',
    color: '#6f7278',
  },
  {
    id: 'diver',
    text: 'Karteziánský potápěč (kapátko se vzduchem) má objem {V} a hmotnost {m}.',
    liquid: 'water',
    volumes: [8, 10, 12, 16],
    unit: 'cm3',
    color: '#9fd3c7',
  },
  {
    id: 'bottle',
    text: 'Uzavřená lahvička s pískem má objem {V} a hmotnost {m}.',
    liquid: 'water',
    volumes: [250, 330, 500],
    unit: 'cm3',
    color: '#a9b4c2',
  },
  {
    id: 'bag',
    text: 'Tenký sáček s olejem má objem {V} a hmotnost {m}.',
    liquid: 'oil',
    volumes: [100, 200, 250],
    unit: 'cm3',
    color: '#e6c36c',
  },
]

export interface LevelSet {
  /** Liquids used in density comparisons (listed more times = more often). */
  liquids: readonly string[]
  /** How many tasks of each kind a round of this level has (sum = 10). */
  mix: Partial<Record<TaskKind, number>>
}

export type TaskKind = 'material' | 'mv' | 'hover' | 'buoyancy' | 'fraction' | 'ship' | 'capacity' | 'forces'

export const LEVELS: Record<number, LevelSet> = {
  1: {
    liquids: ['water', 'water', 'water', 'oil', 'sea', 'ethanol', 'mercury', 'mercury', 'glycerol'],
    mix: { material: 5, mv: 4, hover: 1 },
  },
  3: {
    liquids: ['water', 'water', 'sea', 'oil', 'ethanol', 'glycerol', 'deadsea', 'mercury'],
    mix: { buoyancy: 3, fraction: 2, ship: 2, capacity: 1, forces: 2 },
  },
}

/** Volumes offered in level 1 m/V tasks (cm³) and level 3 buoyancy tasks. */
export const MV_VOLUMES = [10, 20, 25, 40, 50, 80, 100, 125, 200, 250] as const
export const BUOY_VOLUMES_CM3 = [50, 100, 200, 250, 400, 500, 800] as const
export const BUOY_VOLUMES_DM3 = [1, 1.5, 2, 2.5, 4, 5] as const
export const FORCES_VOLUMES_DM3 = [0.5, 1, 1.5, 2, 3, 4, 5] as const
