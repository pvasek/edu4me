import { CATIONS, anion, cation, type Anion, type Cation } from '../shared/ions'
import { crossRule, salt } from '../shared/nomenclature'
import { shuffle } from '../shared/util'

/** Curated, real compounds: [cation formula, cation charge, anion formula]. */
const SALTS: [string, number, string][] = [
  // 1 : 1
  ['Na', 1, 'Cl'], ['K', 1, 'Br'], ['K', 1, 'I'], ['Li', 1, 'F'], ['Ag', 1, 'Cl'], ['Ag', 1, 'Br'],
  ['Mg', 2, 'O'], ['Ca', 2, 'O'], ['Zn', 2, 'S'], ['Fe', 2, 'S'], ['Cu', 2, 'O'], ['Pb', 2, 'S'], ['Ba', 2, 'O'],
  ['Ag', 1, 'NO3'], ['Na', 1, 'NO3'], ['K', 1, 'NO3'], ['NH4', 1, 'Cl'], ['NH4', 1, 'NO3'], ['Na', 1, 'OH'], ['K', 1, 'OH'],
  ['Ba', 2, 'SO4'], ['Ca', 2, 'CO3'], ['Cu', 2, 'SO4'], ['Zn', 2, 'SO4'], ['Fe', 2, 'SO4'], ['Ca', 2, 'SO4'], ['Mg', 2, 'CO3'],
  ['Al', 3, 'PO4'], ['Fe', 3, 'PO4'], ['Na', 1, 'HCO3'], ['K', 1, 'MnO4'], ['Na', 1, 'ClO'], ['K', 1, 'ClO3'], ['Na', 1, 'NO2'],
  // 1 : 2 and 2 : 1
  ['Ca', 2, 'Cl'], ['Mg', 2, 'Cl'], ['Ba', 2, 'Cl'], ['Cu', 2, 'Cl'], ['Fe', 2, 'Cl'], ['Pb', 2, 'I'], ['Ca', 2, 'F'],
  ['Na', 1, 'O'], ['K', 1, 'O'], ['Li', 1, 'O'], ['Cu', 1, 'O'], ['Ag', 1, 'O'], ['Na', 1, 'S'], ['K', 1, 'S'], ['Ag', 1, 'S'],
  ['Na', 1, 'SO4'], ['K', 1, 'SO4'], ['Na', 1, 'CO3'], ['K', 1, 'CO3'], ['Na', 1, 'SO3'], ['K', 1, 'CrO4'], ['K', 1, 'Cr2O7'],
  ['NH4', 1, 'SO4'], ['NH4', 1, 'CO3'], ['Na', 1, 'HPO4'],
  ['Ca', 2, 'OH'], ['Mg', 2, 'OH'], ['Ba', 2, 'OH'], ['Cu', 2, 'OH'], ['Zn', 2, 'OH'],
  ['Ca', 2, 'NO3'], ['Pb', 2, 'NO3'], ['Mg', 2, 'NO3'], ['Cu', 2, 'NO3'], ['Ca', 2, 'HCO3'], ['Ca', 2, 'ClO'],
  // 1 : 3, 3 : 1, 2 : 3, 3 : 2
  ['Al', 3, 'Cl'], ['Fe', 3, 'Cl'], ['Cr', 3, 'Cl'], ['Al', 3, 'F'],
  ['Al', 3, 'O'], ['Fe', 3, 'O'], ['Cr', 3, 'O'], ['Al', 3, 'S'], ['Mg', 2, 'N'], ['Ca', 2, 'N'], ['Li', 1, 'N'],
  ['Al', 3, 'OH'], ['Fe', 3, 'OH'], ['Cr', 3, 'OH'], ['Al', 3, 'NO3'], ['Fe', 3, 'NO3'],
  ['Na', 1, 'PO4'], ['K', 1, 'PO4'], ['NH4', 1, 'PO4'],
  ['Ca', 2, 'PO4'], ['Mg', 2, 'PO4'], ['Ba', 2, 'PO4'], ['Al', 3, 'SO4'], ['Fe', 3, 'SO4'], ['Cr', 3, 'SO4'],
]

/** Anions that are easy to mix up with each other. */
const ANION_TWIN: Record<string, string[]> = {
  F: ['Cl'], Cl: ['ClO', 'Br'], Br: ['Cl', 'I'], I: ['Br'], O: ['OH', 'S'], S: ['SO4', 'O'], N: ['NO3', 'O'],
  OH: ['O'], NO3: ['NO2'], NO2: ['NO3'], SO4: ['SO3', 'S'], SO3: ['SO4'], CO3: ['HCO3'], HCO3: ['CO3'],
  PO4: ['HPO4'], HPO4: ['PO4', 'H2PO4'], ClO: ['ClO3', 'Cl'], ClO3: ['ClO', 'ClO4'], MnO4: ['CrO4'],
  CrO4: ['Cr2O7'], Cr2O7: ['CrO4'],
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

const isMono = (a: Anion) => /^[A-Z][a-z]?$/.test(a.formula)
const ratioClass = (c: Cation, a: Anion) => {
  const [x, y] = crossRule(c.charge, a.charge)
  return Math.max(x, y)
}

function makeTask(c: Cation, a: Anion, mode: Task['mode']): Task {
  const [nC, nA] = crossRule(c.charge, a.charge)
  const s = salt(c, a)
  let trayCations = [c]
  let trayAnions = [a]
  if (mode === 'name') {
    const twinC =
      CATIONS.find((x) => x.formula === c.formula && x.charge !== c.charge && !x.noSalt) ??
      shuffle(CATIONS.filter((x) => !x.noSalt && x.charge !== c.charge && x.formula !== c.formula))[0]
    const twins = (ANION_TWIN[a.formula] ?? []).map((f) => anion(f))
    const twinA = twins[0] ?? anion('Cl')
    trayCations = shuffle([c, twinC])
    trayAnions = shuffle([a, twinA])
  }
  return { cation: c, anion: a, mode, formula: s.formula, name: s.name, trayCations, trayAnions, nC, nA }
}

/**
 * 8 tasks with a difficulty ramp: 1:1 → 1:2 → 2:3, alternating "given ions" and "from the name".
 * Before level 5 the named targets are binary compounds only (oxides, halides, sulfides, nitrides).
 */
export function buildTasks(level: number): Task[] {
  const all = SALTS.map(([cf, ch, af]) => ({ c: cation(cf, ch), a: anion(af) }))
  const plan: { ratio: number; mode: Task['mode']; poly?: boolean }[] = [
    { ratio: 1, mode: 'pair' },
    { ratio: 1, mode: 'name' },
    { ratio: 2, mode: 'pair' },
    { ratio: 2, mode: 'name' },
    { ratio: 2, mode: 'pair', poly: true },
    { ratio: 3, mode: 'name' },
    { ratio: 3, mode: 'pair', poly: true },
    { ratio: 3, mode: 'name', poly: level >= 5 },
  ]
  const used = new Set<string>()
  const tasks: Task[] = []
  for (const slot of plan) {
    const candidates = shuffle(
      all.filter(({ c, a }) => {
        if (used.has(c.formula + c.charge + a.formula)) return false
        if (ratioClass(c, a) !== slot.ratio) return false
        if (slot.mode === 'name' && level < 5 && !isMono(a)) return false
        if (slot.poly === true && isMono(a) && c.formula !== 'NH4') return false
        return true
      }),
    )
    const pick = candidates[0]
    if (!pick) continue
    used.add(pick.c.formula + pick.c.charge + pick.a.formula)
    tasks.push(makeTask(pick.c, pick.a, slot.mode))
  }
  return tasks
}
