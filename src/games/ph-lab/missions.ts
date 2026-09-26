/**
 * Content of the pH lab per level (see spec/courses/chemie/games.md):
 *  - L5 strong acids and bases, neutralisation, dilution,
 *  - L6 weak acids and buffers,
 *  - L9 pH in living things (body fluids, enzymes, blood buffer).
 * Every level has its own bottles and missions. A round draws one mission per
 * category; free play ("Vše") mixes missions of all levels.
 */
import { REAGENTS, empty, fill, mixReagent, pour, solution, water, type Mission, type Reagent } from './ph'

export interface LevelSet {
  /** Bottles on the shelf. */
  reagents: Reagent[]
  /** Category order of a round (one mission each). */
  order: string[]
  missions: Mission[]
  /** Show the enzyme activity panel. */
  enzymes?: boolean
}

type MissionDraft = Omit<Mission, 'level'>
const at = (level: number, list: MissionDraft[]): Mission[] => list.map((m) => ({ ...m, level }))

/* ------------------------------ level 5 ------------------------------ */

const L5_MISSIONS = at(5, [
  {
    id: 'acid-3',
    category: 'acid',
    text: 'Připrav **kyselý** roztok s pH 3 (± 0,3).',
    hint: 'Silná kyselina: stačí málo!',
    start: water(),
    min: 2.7,
    max: 3.3,
    par: 1,
  },
  {
    id: 'acid-2',
    category: 'acid',
    text: 'Připrav **silně kyselý** roztok s pH 2 (± 0,3).',
    hint: 'pH 2 je 10× kyselejší než pH 3.',
    start: water(),
    min: 1.7,
    max: 2.3,
    par: 1,
  },
  {
    id: 'acid-4',
    category: 'acid',
    text: 'Připrav **slabě kyselý** roztok s pH 4 (± 0,3). HCl je na to moc silná!',
    hint: 'Zkus něco z kuchyně.',
    start: water(),
    min: 3.7,
    max: 4.3,
    par: 1,
  },
  {
    id: 'base-11',
    category: 'base',
    text: 'Připrav **zásaditý** roztok s pH 11–12.',
    hint: 'OH⁻ ionty zvednou pH.',
    start: water(),
    min: 11,
    max: 12,
    par: 1,
  },
  {
    id: 'base-12',
    category: 'base',
    text: 'Připrav **silně zásaditý** roztok s pH 12 (± 0,3).',
    hint: 'Víc zásady = vyšší pH.',
    start: water(),
    min: 11.7,
    max: 12.3,
    par: 1,
  },
  {
    id: 'base-9',
    category: 'base',
    text: 'Připrav **slabě zásaditý** roztok s pH 9–10. NaOH by to přestřelil.',
    hint: 'Co takhle mýdlo?',
    start: water(),
    min: 9,
    max: 10,
    par: 1,
  },
  {
    id: 'neutral-acid',
    category: 'neutral',
    text: 'V kádince je 100 cm³ HCl o pH 2. **Zneutralizuj** ji na pH 7 ± 0,5.',
    hint: 'n(H₃O⁺) = n(OH⁻). Počítej!',
    start: solution(100, 0.01),
    min: 6.5,
    max: 7.5,
    par: 1,
  },
  {
    id: 'neutral-base',
    category: 'neutral',
    text: 'V kádince je 100 cm³ NaOH o pH 12. **Zneutralizuj** ho na pH 7 ± 0,5.',
    hint: 'Kolik molů OH⁻ tam je?',
    start: solution(100, -0.01),
    min: 6.5,
    max: 7.5,
    par: 1,
  },
  {
    id: 'rain',
    category: 'special',
    text: '**Kyselý déšť:** připrav z vody roztok s pH 5 (± 0,3).',
    hint: 'Jen trošku slabší kyseliny.',
    start: water(),
    min: 4.7,
    max: 5.3,
    par: 1,
  },
  {
    id: 'dilute',
    category: 'special',
    text: 'V kádince je 10 cm³ HCl o pH 2. **Zřeď** ji vodou na pH 3 (± 0,2).',
    hint: 'Desetkrát zředit = pH o 1 výš.',
    start: solution(10, 0.01),
    min: 2.8,
    max: 3.2,
    par: 6,
  },
  {
    id: 'drain',
    category: 'special',
    text: '**Čistič odpadů** je žíravina. Přidej ho do vody tak, aby vzniklo pH 11,5 (± 0,3).',
    hint: 'I 1 cm³ udělá hodně.',
    start: water(),
    min: 11.2,
    max: 11.8,
    par: 1,
  },
])

/* ------------------------------ level 6 ------------------------------ */

export const L6_REAGENTS: Reagent[] = [
  mixReagent('ch3cooh', '$CH3COOH$', '0,1 mol/dm³, pK_a 4,76', 0, { ac: 0.1 }),
  mixReagent('ch3coona', '$CH3COONa$', '0,1 mol/dm³', -0.1, { ac: 0.1 }),
  mixReagent('nh3', '$NH3$', '0,1 mol/dm³, pK_b 4,75', 0, { am: 0.1 }),
  mixReagent('nh4cl', '$NH4Cl$', '0,1 mol/dm³', 0.1, { am: 0.1 }),
  { id: 'hcl', name: '$HCl$', sub: '0,1 mol/dm³', conc: 0.1, ph: 1, kind: 'acid' },
  { id: 'naoh', name: '$NaOH$', sub: '0,1 mol/dm³', conc: -0.1, ph: 13, kind: 'base' },
  { id: 'voda', name: 'Destilovaná voda', sub: 'ředění', conc: 0, ph: 7, kind: 'water' },
]
const r6 = (id: string) => L6_REAGENTS.find((r) => r.id === id)!

/** 100 cm³ of a buffer with 0,05 mol/dm³ of each form: 50 cm³ acid + 50 cm³ salt. */
const acetateBuffer = () => pour(fill(r6('ch3cooh'), 50), r6('ch3coona'), 50)
const ammoniaBuffer = () => pour(fill(r6('nh3'), 50), r6('nh4cl'), 50)

const L6_MISSIONS = at(6, [
  {
    id: 'buffer-acetate',
    category: 'buffer',
    text: 'Připrav **acetátový pufr** o pH 4,76 (pH 4,7–4,8) z $CH3COOH$ a $CH3COONa$.',
    hint: 'pH = pKₐ, když je kyseliny a soli stejně.',
    start: empty(),
    min: 4.7,
    max: 4.8,
    par: 2,
    needs: ['ch3cooh', 'ch3coona'],
  },
  {
    id: 'buffer-ammonia',
    category: 'buffer',
    text: 'Připrav **amonný pufr** o pH 9,25 (pH 9,2–9,3) z $NH3$ a $NH4Cl$.',
    hint: 'pKₐ(NH₄⁺) = 14 − 4,75 = 9,25.',
    start: empty(),
    min: 9.2,
    max: 9.3,
    par: 2,
    needs: ['nh3', 'nh4cl'],
  },
  {
    id: 'buffer-506',
    category: 'buffer',
    text: 'Připrav **acetátový pufr** o pH 5,06 (pH 5,0–5,1).',
    hint: '5,06 = 4,76 + log 2. Kolikrát víc soli?',
    start: empty(),
    min: 5,
    max: 5.1,
    par: 3,
    needs: ['ch3cooh', 'ch3coona'],
  },
  {
    id: 'weak-acetic-3',
    category: 'weak',
    text: 'Připrav roztok **kyseliny octové** o pH 3,0. Máš kyselinu 0,1 mol/dm³ (pH 2,9) a vodu.',
    hint: 'Slabá kyselina: ředěním se pH mění jen o ½ na desetinásobek.',
    start: empty(),
    min: 3,
    max: 3,
    par: 2,
    bottles: ['ch3cooh', 'voda'],
  },
  {
    id: 'weak-acetic-dilute',
    category: 'weak',
    text: 'V kádince je 50 cm³ **kyseliny octové** 0,1 mol/dm³. Zřeď ji vodou na pH 3,0.',
    hint: 'U HCl by stačilo zředit 1,3×. Tady víc!',
    start: fill(r6('ch3cooh'), 50),
    min: 3,
    max: 3,
    par: 2,
    bottles: ['voda'],
  },
  {
    id: 'weak-ammonia-11',
    category: 'weak',
    text: 'Připrav roztok **amoniaku** o pH 11,0. Máš $NH3$ 0,1 mol/dm³ a vodu.',
    hint: 'pOH = ½ · (pK_b − log c).',
    start: empty(),
    min: 11,
    max: 11,
    par: 2,
    bottles: ['nh3', 'voda'],
  },
  {
    id: 'compare-acid',
    category: 'compare',
    text: 'Vlevo je 100 cm³ **acetátového pufru** (pH 4,76), vedle 100 cm³ **vody**. Přidej **1 cm³ HCl**, dostanou ho obě kádinky. Udrží pufr pH 4,7–4,8?',
    hint: 'Acetát zachytí H₃O⁺ a vznikne slabá kyselina.',
    start: acetateBuffer(),
    min: 4.7,
    max: 4.8,
    par: 1,
    twin: { label: 'voda', start: water() },
    needs: ['hcl'],
  },
  {
    id: 'compare-base',
    category: 'compare',
    text: 'Vlevo je 100 cm³ **amonného pufru** (pH 9,25), vedle 100 cm³ **vody**. Přidej **1 cm³ NaOH**, dostanou ho obě kádinky. Udrží pufr pH 9,2–9,3?',
    hint: 'NH₄⁺ zachytí OH⁻ a vznikne NH₃.',
    start: ammoniaBuffer(),
    min: 9.2,
    max: 9.3,
    par: 1,
    twin: { label: 'voda', start: water() },
    needs: ['naoh'],
  },
  {
    id: 'equiv-acetic',
    category: 'equiv',
    text: 'V kádince je 50 cm³ $CH3COOH$ 0,1 mol/dm³. Přidej $NaOH$ přesně do **bodu ekvivalence** (pH 8,4–9,0).',
    hint: 'Vznikne octan sodný: sůl slabé kyseliny je zásaditá.',
    start: fill(r6('ch3cooh'), 50),
    min: 8.4,
    max: 9,
    par: 5,
    needs: ['naoh'],
  },
  {
    id: 'equiv-ammonia',
    category: 'equiv',
    text: 'V kádince je 20 cm³ $NH3$ 0,1 mol/dm³. Přidej $HCl$ přesně do **bodu ekvivalence** (pH 5,0–5,6).',
    hint: 'Vznikne NH₄Cl: sůl slabé zásady je kyselá.',
    start: fill(r6('nh3'), 20),
    min: 5,
    max: 5.6,
    par: 2,
    needs: ['hcl'],
  },
])

/* ------------------------------ level 9 ------------------------------ */

/** Body fluids as honest mixtures of the buffers that set their pH. */
export const L9_REAGENTS: Reagent[] = [
  mixReagent('zaludek', 'Žaludeční šťáva', 'HCl 0,03 mol/dm³', 0.03),
  mixReagent('krev', 'Krev', 'HCO₃⁻ 24 mmol/dm³', -0.024, { co2: 0.0252 }),
  mixReagent('sliny', 'Sliny', 'HCO₃⁻ 5 mmol/dm³', -0.005, { co2: 0.006 }),
  // NaH2PO4 20 mmol/dm³ + Na2HPO4 1,2 mmol/dm³
  mixReagent('moc', 'Moč', 'fosfátový pufr', -(0.02 + 2 * 0.0012), { pho: 0.0212 }),
  // sodium lactate 20 mmol/dm³ + lactic acid 0,5 mmol/dm³
  mixReagent('pot', 'Pot', 'kyselina mléčná + laktát', -0.02, { lac: 0.0205 }),
  mixReagent('nahco3', '$NaHCO3$', '0,1 mol/dm³ (jako ve slinivce)', -0.1, { co2: 0.1 }),
  mixReagent('co2', '$CO2$ (sodovka)', '0,05 mol/dm³, pK_a 6,1', 0, { co2: 0.05 }),
  { id: 'voda', name: 'Destilovaná voda', sub: 'ředění', conc: 0, ph: 7, kind: 'water' },
]
const r9 = (id: string) => L9_REAGENTS.find((r) => r.id === id)!

/** A blood sample of `ml` cm³ with the given HCO₃⁻ and CO₂ concentrations (mmol/dm³). */
const blood = (ml: number, hco3: number, co2: number) => solution(ml, -hco3 / 1000, { co2: (hco3 + co2) / 1000 })

const L9_MISSIONS = at(9, [
  {
    id: 'pepsin-bolus',
    category: 'pepsin',
    text: 'Sousto s 50 cm³ **slin** (pH 6,8) dorazilo do žaludku. Přidávej žaludeční šťávu, dokud pH nedosáhne **optima pepsinu** 2 (± 0,3).',
    hint: 'Nejdřív se spotřebuje hydrogenuhličitan ze slin.',
    start: fill(r9('sliny'), 50),
    min: 1.7,
    max: 2.3,
    par: 2,
  },
  {
    id: 'pepsin-water',
    category: 'pepsin',
    text: 'Po sklenici vody se obsah žaludku zředil na pH 2,5. Vrať ho na **optimum pepsinu** 2 (± 0,3).',
    hint: 'Pepsin nejlépe štěpí bílkoviny kolem pH 2.',
    start: pour(fill(r9('zaludek'), 10), r9('voda'), 90),
    min: 1.7,
    max: 2.3,
    par: 1,
  },
  {
    id: 'trypsin-chyme',
    category: 'trypsin',
    text: 'Do dvanáctníku přišlo 10 cm³ **tráveniny** o pH 3. Slinivka přidá $NaHCO3$. Nastav **optimum trypsinu** 8 (± 0,3).',
    hint: 'HCO₃⁻ + H₃O⁺ → CO₂ + 2 H₂O',
    start: solution(10, 0.001),
    min: 7.7,
    max: 8.3,
    par: 1,
  },
  {
    id: 'trypsin-chyme-2',
    category: 'trypsin',
    text: 'Do dvanáctníku přišlo 20 cm³ **tráveniny** o pH 2,7. Zneutralizuj ji $NaHCO3$ na **optimum trypsinu** 8 (± 0,3).',
    hint: 'Hydrogenuhličitanu musí být mnohem víc než vzniklého CO₂.',
    start: solution(20, 0.002),
    min: 7.7,
    max: 8.3,
    par: 2,
  },
  {
    id: 'blood-buffer',
    category: 'blood',
    text: 'Připrav **krevní pufr** o pH 7,4 z $NaHCO3$ a $CO2$ (pKₐ 6,1).',
    hint: '7,4 = 6,1 + log 20: HCO₃⁻ : CO₂ = 20 : 1.',
    start: empty(),
    min: 7.4,
    max: 7.4,
    par: 2,
    bottles: ['nahco3', 'co2', 'voda'],
  },
  {
    id: 'blood-buffer-soda',
    category: 'blood',
    text: 'Ve 100 cm³ vody připrav **krevní pufr** o pH 7,4 z $NaHCO3$ a $CO2$ (pKₐ 6,1).',
    hint: 'Záleží jen na poměru HCO₃⁻ : CO₂, ne na vodě.',
    start: water(),
    min: 7.4,
    max: 7.4,
    par: 2,
    bottles: ['nahco3', 'co2', 'voda'],
  },
  {
    id: 'acidosis',
    category: 'fix',
    text: '**Acidóza:** vzorek 100 cm³ krve má pH 7,17 (chybí hydrogenuhličitan). Vrať ho do zdravého rozmezí 7,35–7,45.',
    hint: 'Co krvi chybí, to přidej.',
    start: blood(100, 14, 1.2),
    min: 7.4,
    max: 7.4,
    par: 1,
  },
  {
    id: 'alkalosis',
    category: 'fix',
    text: '**Hyperventilace:** vydýchal(a) jsi moc CO₂ a pH krve (100 cm³) stouplo na 7,6. Vrať ho na 7,35–7,45.',
    hint: 'Vrať do krve trochu CO₂.',
    start: blood(100, 24, 0.76),
    min: 7.4,
    max: 7.4,
    par: 1,
  },
  {
    id: 'urine',
    category: 'fix',
    text: 'Lékař chce **zalkalizovat moč**, aby se netvořily kamínky z kyseliny močové. Zvyš pH 50 cm³ moči (pH 6,0) na 6,5–7,0.',
    hint: 'HCO₃⁻ odebere H₂PO₄⁻ proton.',
    start: fill(r9('moc'), 50),
    min: 6.5,
    max: 7,
    par: 1,
  },
])

/* ----------------------------- all levels ----------------------------- */

export const LEVELS: Record<number, LevelSet> = {
  5: { reagents: REAGENTS, order: ['acid', 'base', 'neutral', 'special'], missions: L5_MISSIONS },
  6: { reagents: L6_REAGENTS, order: ['buffer', 'weak', 'compare', 'equiv'], missions: L6_MISSIONS },
  9: { reagents: L9_REAGENTS, order: ['pepsin', 'trypsin', 'blood', 'fix'], missions: L9_MISSIONS, enzymes: true },
}

export const ROUND = 4

const pick = <T,>(list: T[], rnd: () => number) => list[Math.floor(rnd() * list.length)]

/** One random mission of each category of the level, in the level's learning order. */
function levelRound(level: number, rnd: () => number): Mission[] {
  const set = LEVELS[level]
  return set.order.map((cat) => pick(set.missions.filter((m) => m.category === cat), rnd))
}

/**
 * Missions for a round. A supported level gets its own four missions; free
 * play or an unsupported level mixes: one from each level plus one extra,
 * ordered by level.
 */
export function pickMissions(level?: number, rnd: () => number = Math.random): Mission[] {
  if (level !== undefined && LEVELS[level]) return levelRound(level, rnd)
  const levels = Object.keys(LEVELS).map(Number)
  const chosen = [...levels, pick(levels, rnd)].sort((a, b) => a - b)
  const out: Mission[] = []
  for (const lv of chosen) {
    const options = LEVELS[lv].missions.filter((m) => !out.includes(m))
    out.push(pick(options, rnd))
  }
  return out
}

/** Bottles offered for a mission: its level's shelf, optionally narrowed by the mission. */
export const reagentsFor = (m: Mission): Reagent[] =>
  LEVELS[m.level].reagents.filter((r) => !m.bottles || m.bottles.includes(r.id))

/* ------------------------------ enzymes ------------------------------ */

export interface Enzyme {
  id: string
  name: string
  where: string
  /** Optimum pH. */
  opt: number
}

export const ENZYMES: Enzyme[] = [
  { id: 'pepsin', name: 'pepsin', where: 'žaludek', opt: 2 },
  { id: 'amylaza', name: 'slinná amyláza', where: 'ústa', opt: 6.8 },
  { id: 'trypsin', name: 'trypsin', where: 'tenké střevo', opt: 8 },
]

/** Relative activity 0..1: a bell curve around the optimum (half activity about ±0,8 pH). */
export function enzymeActivity(e: Enzyme, ph: number): number {
  return Math.exp(-(((ph - e.opt) / 1) ** 2))
}
