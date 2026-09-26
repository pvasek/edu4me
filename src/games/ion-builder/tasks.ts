import { anion, cation, type Anion, type Cation } from '../shared/ions'
import { crossRule, salt } from '../shared/nomenclature'
import { shuffle } from '../shared/util'

/** A real compound: [cation formula, cation charge, anion formula]. */
export type Pair = [string, number, string]

/** Levels the game supports (see spec/courses/chemie/games.md). */
export const ION_LEVELS = [3, 5, 7] as const
/** Tasks in one round. */
export const ROUND = 8

/**
 * Curated, real compounds per level.
 *  - 3: monatomic ions only (halides, oxides, sulfides, nitrides), cations with one usual charge.
 *  - 5: polyatomic ions: hydroxides, salts of oxoacids, hydrogen salts, ammonium salts.
 *  - 7: transition metals with variable charges and less common anions.
 */
export const LEVELS: Record<number, Pair[]> = {
  3: [
    // 1 : 1
    ['Na', 1, 'Cl'], ['K', 1, 'Br'], ['K', 1, 'I'], ['Li', 1, 'F'], ['Na', 1, 'F'], ['Ag', 1, 'Cl'], ['Ag', 1, 'Br'],
    ['Mg', 2, 'O'], ['Ca', 2, 'O'], ['Ba', 2, 'O'], ['Zn', 2, 'O'], ['Zn', 2, 'S'], ['Ca', 2, 'S'], ['Al', 3, 'N'],
    // 1 : 2 and 2 : 1
    ['Ca', 2, 'Cl'], ['Mg', 2, 'Cl'], ['Ba', 2, 'Cl'], ['Zn', 2, 'Cl'], ['Sr', 2, 'Cl'], ['Ca', 2, 'F'], ['Mg', 2, 'F'],
    ['Mg', 2, 'Br'], ['Na', 1, 'O'], ['K', 1, 'O'], ['Li', 1, 'O'], ['Ag', 1, 'O'], ['Na', 1, 'S'], ['K', 1, 'S'], ['Ag', 1, 'S'],
    // 1 : 3, 3 : 1, 2 : 3, 3 : 2
    ['Al', 3, 'Cl'], ['Al', 3, 'F'], ['Al', 3, 'Br'], ['Li', 1, 'N'], ['Al', 3, 'O'], ['Al', 3, 'S'], ['Mg', 2, 'N'],
    ['Ca', 2, 'N'], ['Ba', 2, 'N'],
  ],
  5: [
    // 1 : 1
    ['Na', 1, 'OH'], ['K', 1, 'OH'], ['Na', 1, 'NO3'], ['K', 1, 'NO3'], ['Ag', 1, 'NO3'], ['NH4', 1, 'NO3'], ['NH4', 1, 'Cl'],
    ['Na', 1, 'NO2'], ['Na', 1, 'ClO'], ['Na', 1, 'HCO3'], ['K', 1, 'HCO3'], ['Na', 1, 'HSO4'], ['Na', 1, 'H2PO4'],
    ['Ba', 2, 'SO4'], ['Ca', 2, 'SO4'], ['Mg', 2, 'SO4'], ['Zn', 2, 'SO4'], ['Ca', 2, 'CO3'], ['Mg', 2, 'CO3'],
    ['Ca', 2, 'HPO4'], ['Al', 3, 'PO4'], ['NH4', 1, 'H2PO4'],
    // 1 : 2 and 2 : 1
    ['Ca', 2, 'OH'], ['Mg', 2, 'OH'], ['Ba', 2, 'OH'], ['Zn', 2, 'OH'], ['Ca', 2, 'NO3'], ['Mg', 2, 'NO3'],
    ['Ba', 2, 'NO3'], ['Ca', 2, 'HCO3'], ['Mg', 2, 'HCO3'], ['Ca', 2, 'ClO'], ['Ca', 2, 'H2PO4'],
    ['Na', 1, 'SO4'], ['K', 1, 'SO4'], ['NH4', 1, 'SO4'], ['Na', 1, 'CO3'], ['K', 1, 'CO3'], ['NH4', 1, 'CO3'],
    ['Na', 1, 'SO3'], ['Na', 1, 'HPO4'], ['K', 1, 'HPO4'], ['NH4', 1, 'HPO4'],
    // 1 : 3, 3 : 1, 2 : 3, 3 : 2
    ['Al', 3, 'OH'], ['Al', 3, 'NO3'], ['Na', 1, 'PO4'], ['K', 1, 'PO4'], ['NH4', 1, 'PO4'],
    ['Ca', 2, 'PO4'], ['Mg', 2, 'PO4'], ['Ba', 2, 'PO4'], ['Al', 3, 'SO4'],
  ],
  7: [
    // 1 : 1
    ['Fe', 2, 'S'], ['Fe', 2, 'O'], ['Fe', 2, 'SO4'], ['Fe', 3, 'PO4'], ['Cu', 1, 'Cl'], ['Cu', 2, 'O'], ['Cu', 2, 'S'],
    ['Cu', 2, 'SO4'], ['Mn', 2, 'SO4'], ['Mn', 2, 'CO3'], ['Pb', 2, 'S'], ['Pb', 2, 'O'], ['Pb', 2, 'CrO4'],
    ['Sn', 2, 'O'], ['K', 1, 'MnO4'], ['Na', 1, 'MnO4'], ['K', 1, 'ClO3'], ['Na', 1, 'ClO3'], ['Ca', 2, 'SiO3'],
    ['Ni', 2, 'SO4'], ['Co', 2, 'CO3'], ['Ba', 2, 'CrO4'],
    // 1 : 2 and 2 : 1
    ['Fe', 2, 'Cl'], ['Fe', 2, 'OH'], ['Cu', 2, 'Cl'], ['Cu', 2, 'OH'], ['Cu', 2, 'NO3'], ['Cu', 1, 'O'], ['Cu', 1, 'S'],
    ['Mn', 2, 'Cl'], ['Pb', 2, 'Cl'], ['Pb', 2, 'I'], ['Pb', 2, 'NO3'], ['Pb', 4, 'O'], ['Sn', 2, 'Cl'], ['Sn', 4, 'O'],
    ['Co', 2, 'Cl'], ['Ni', 2, 'Cl'], ['K', 1, 'Cr2O7'], ['NH4', 1, 'Cr2O7'], ['K', 1, 'CrO4'], ['Na', 1, 'CrO4'],
    ['Na', 1, 'S2O3'], ['K', 1, 'S2O3'], ['Ag', 1, 'CrO4'], ['Na', 1, 'SiO3'], ['Ca', 2, 'ClO3'], ['Ba', 2, 'MnO4'],
    // 1 : 3, 3 : 1, 2 : 3, 1 : 4 …
    ['Fe', 3, 'Cl'], ['Fe', 3, 'OH'], ['Fe', 3, 'NO3'], ['Cr', 3, 'Cl'], ['Cr', 3, 'OH'], ['Fe', 3, 'O'], ['Cr', 3, 'O'],
    ['Fe', 3, 'SO4'], ['Cr', 3, 'SO4'], ['Pb', 4, 'Cl'], ['Sn', 4, 'Cl'],
  ],
}

/** Anions that are easy to mix up with each other (used as decoys in the tray). */
const ANION_TWIN: Record<string, string[]> = {
  F: ['Cl'], Cl: ['ClO', 'Br', 'ClO3'], Br: ['Cl', 'I'], I: ['Br'], O: ['OH', 'S'], S: ['SO4', 'O', 'S2O3'], N: ['NO3', 'O'],
  OH: ['O'], NO3: ['NO2'], NO2: ['NO3'], SO4: ['SO3', 'S', 'S2O3'], SO3: ['SO4'], CO3: ['HCO3', 'SiO3'], HCO3: ['CO3'],
  PO4: ['HPO4'], HPO4: ['PO4', 'H2PO4'], H2PO4: ['HPO4'], HSO4: ['SO4'], ClO: ['ClO3', 'Cl'], ClO3: ['ClO', 'Cl'],
  MnO4: ['CrO4'], CrO4: ['Cr2O7'], Cr2O7: ['CrO4'], S2O3: ['SO4', 'SO3'], SiO3: ['CO3'],
}

export interface Task {
  cation: Cation
  anion: Anion
  /** 'name': target given by name, the player must pick the right ions. 'pair': the ions are given. */
  mode: 'name' | 'pair'
  formula: string
  name: string
  /** Ions offered in the tray. */
  trayCations: Cation[]
  trayAnions: Anion[]
  /** Cross-rule counts. */
  nC: number
  nA: number
}

export const pairKey = ([c, ch, a]: Pair) => `${c}${ch}${a}`

/** Pairs for a level; free play (undefined) or an unsupported level mixes all levels. */
export function pairsFor(level?: number): Pair[] {
  if (level !== undefined && LEVELS[level]) return LEVELS[level]
  const seen = new Set<string>()
  return ION_LEVELS.flatMap((l) => LEVELS[l]).filter((p) => !seen.has(pairKey(p)) && !!seen.add(pairKey(p)))
}

const ratioClass = ([, ch, a]: Pair) => {
  const [x, y] = crossRule(ch, anion(a).charge)
  return Math.min(3, Math.max(x, y))
}

function makeTask(p: Pair, mode: Task['mode'], pool: Pair[], rnd: () => number): Task {
  const c = cation(p[0], p[1])
  const a = anion(p[2])
  const [nC, nA] = crossRule(c.charge, a.charge)
  const s = salt(c, a)
  let trayCations = [c]
  let trayAnions = [a]
  if (mode === 'name') {
    // Decoys only from ions the level already uses: never teach ahead.
    const cats = uniqBy(pool.map(([f, ch]) => cation(f, ch)), (x) => `${x.formula}${x.charge}`)
    const ans = uniqBy(pool.map(([, , f]) => anion(f)), (x) => x.formula)
    const twinC =
      cats.find((x) => x.formula === c.formula && x.charge !== c.charge) ??
      shuffle(cats.filter((x) => x.charge !== c.charge && x.formula !== c.formula), rnd)[0] ??
      shuffle(cats.filter((x) => x !== c), rnd)[0]
    const twinA =
      (ANION_TWIN[a.formula] ?? []).map((f) => ans.find((x) => x.formula === f)).find(Boolean) ??
      shuffle(ans.filter((x) => x.charge !== a.charge), rnd)[0] ??
      shuffle(ans.filter((x) => x !== a), rnd)[0]
    trayCations = shuffle(twinC ? [c, twinC] : [c], rnd)
    trayAnions = shuffle(twinA ? [a, twinA] : [a], rnd)
  }
  return { cation: c, anion: a, mode, formula: s.formula, name: s.name, trayCations, trayAnions, nC, nA }
}

function uniqBy<T>(xs: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>()
  return xs.filter((x) => !seen.has(key(x)) && !!seen.add(key(x)))
}

/** 8 tasks with a difficulty ramp 1:1 → 1:2 → 2:3, alternating "given ions" and "from the name". */
export function buildTasks(level?: number, rnd: () => number = Math.random): Task[] {
  const pool = pairsFor(level)
  const plan: { ratio: number; mode: Task['mode'] }[] = [
    { ratio: 1, mode: 'pair' },
    { ratio: 1, mode: 'name' },
    { ratio: 2, mode: 'pair' },
    { ratio: 2, mode: 'name' },
    { ratio: 2, mode: 'pair' },
    { ratio: 3, mode: 'name' },
    { ratio: 3, mode: 'pair' },
    { ratio: 3, mode: 'name' },
  ]
  const used = new Set<string>()
  const tasks: Task[] = []
  for (const slot of plan.slice(0, ROUND)) {
    const free = shuffle(
      pool.filter((p) => !used.has(pairKey(p))),
      rnd,
    )
    const pick = free.find((p) => ratioClass(p) === slot.ratio) ?? free[0]
    if (!pick) continue
    used.add(pairKey(pick))
    tasks.push(makeTask(pick, slot.mode, pool, rnd))
  }
  return tasks
}
