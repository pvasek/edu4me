/**
 * Pure pH maths for the pH lab. No React here, so it is easy to test.
 *
 * The beaker tracks amounts, not concentrations:
 *  - `nH`: moles of strong anions (Cl⁻ from HCl, i.e. strong acid added),
 *  - `nOH`: moles of strong cations (Na⁺ from NaOH or from a sodium salt),
 *  - `weak`: moles of each weak acid–base system (acetate, ammonium, CO₂…).
 * With strong acids and bases only, [H₃O⁺] = C/2 + sqrt(C²/4 + Kw) with
 * C = (nH − nOH)/V, which includes water autoionisation exactly. With weak
 * systems the charge balance is solved numerically (see equilibrium.ts), so
 * buffers, weak acids and salt hydrolysis come out right without the usual
 * "x is small" shortcuts.
 */

import { KW, solvePh, type WeakTotals } from './equilibrium'

export { KW }
/** Beaker capacity in cm³. */
export const CAPACITY = 250

export interface BeakerState {
  /** Total volume in cm³. */
  volume: number
  /** Total moles of strong acid (strong anions) added. */
  nH: number
  /** Total moles of strong base (strong cations, e.g. Na⁺) added. */
  nOH: number
  /** Moles of weak acid–base systems (total of all their forms). */
  weak?: WeakTotals
}

export interface Reagent {
  id: string
  /** Czech label shown on the bottle. */
  name: string
  /** Short label under the name, e.g. "0,1 mol/dm³" or "pH ≈ 2,8". */
  sub: string
  /** Net strong-acid-equivalent concentration in mol/dm³ (negative = base, e.g. Na⁺ of a salt). */
  conc: number
  /** Weak acid–base systems in the bottle (total concentration, mol/dm³). */
  weak?: WeakTotals
  /** Typical pH of the reagent itself (for the bottle label colour). */
  ph: number
  kind: 'acid' | 'base' | 'water'
}

/** A bottle whose pH is computed from its composition. */
export function mixReagent(id: string, name: string, sub: string, conc: number, weak?: WeakTotals): Reagent {
  const ph = solvePh(conc, weak)
  return { id, name, sub, conc, weak, ph, kind: Math.abs(ph - 7) < 0.05 ? 'water' : ph < 7 ? 'acid' : 'base' }
}

/**
 * Net strong-acid concentration that gives exactly the pH `ph` on its own,
 * including water autoionisation: C = [H3O+] − [OH−].
 */
export function equivalentConc(ph: number): number {
  return 10 ** -ph - 10 ** (ph - 14)
}

const household = (id: string, name: string, ph: number): Reagent => ({
  id,
  name,
  sub: `pH ≈ ${formatNum(ph, 1)}`,
  conc: equivalentConc(ph),
  ph,
  kind: ph < 7 ? 'acid' : 'base',
})

export const REAGENTS: Reagent[] = [
  { id: 'hcl', name: 'HCl', sub: '0,1 mol/dm³', conc: 0.1, ph: 1, kind: 'acid' },
  { id: 'naoh', name: 'NaOH', sub: '0,1 mol/dm³', conc: -0.1, ph: 13, kind: 'base' },
  household('ocet', 'Ocet', 2.8),
  household('citron', 'Citronová šťáva', 2.2),
  household('soda', 'Jedlá soda (roztok)', 8.3),
  household('mydlo', 'Mýdlová voda', 10),
  household('cistic', 'Čistič odpadů', 13.5),
  { id: 'voda', name: 'Destilovaná voda', sub: 'ředění', conc: 0, ph: 7, kind: 'water' },
]

export const REAGENT_BY_ID: Record<string, Reagent> = Object.fromEntries(REAGENTS.map((r) => [r.id, r]))

export function water(volume = 100): BeakerState {
  return { volume, nH: 0, nOH: 0 }
}

/** An empty beaker (the learner mixes a solution from the bottles). */
export function empty(): BeakerState {
  return { volume: 0, nH: 0, nOH: 0 }
}

/** A beaker holding `volume` cm³ of a solution with net acid concentration `conc` (and weak systems). */
export function solution(volume: number, conc: number, weak?: WeakTotals): BeakerState {
  return add(empty(), conc, volume, weak)
}

/** Adds `ml` cm³ of a solution with net acid concentration `conc` and weak systems `weak` (mol/dm³). */
export function add(state: BeakerState, conc: number, ml: number, weak?: WeakTotals): BeakerState {
  const n = (conc * ml) / 1000
  const next: BeakerState = {
    volume: state.volume + ml,
    nH: state.nH + Math.max(n, 0),
    nOH: state.nOH + Math.max(-n, 0),
  }
  if (state.weak || weak) {
    const w: WeakTotals = { ...state.weak }
    for (const [id, c] of Object.entries(weak ?? {}) as [keyof WeakTotals, number][]) w[id] = (w[id] ?? 0) + (c * ml) / 1000
    next.weak = w
  }
  return next
}

/** Pours `ml` cm³ of a bottle into the beaker. */
export function pour(state: BeakerState, r: Reagent, ml: number): BeakerState {
  return add(state, r.conc, ml, r.weak)
}

/** A beaker holding `volume` cm³ of a bottle's contents. */
export function fill(r: Reagent, volume: number): BeakerState {
  return pour(empty(), r, volume)
}

/** pH from a net acid amount (mol, negative = base excess) in `volumeMl` cm³. */
export function phFromNet(netMol: number, volumeMl: number): number {
  if (volumeMl <= 0) return 7
  const c = netMol / (volumeMl / 1000)
  if (c >= 0) {
    const h = c / 2 + Math.sqrt((c * c) / 4 + KW)
    return -Math.log10(h)
  }
  // Base excess: compute [OH−] the same way to avoid cancellation, then pH = 14 − pOH.
  const b = -c
  const oh = b / 2 + Math.sqrt((b * b) / 4 + KW)
  return 14 + Math.log10(oh)
}

export function phOf(state: BeakerState): number {
  if (state.volume <= 0) return 7
  if (!state.weak) return phFromNet(state.nH - state.nOH, state.volume)
  const litres = state.volume / 1000
  const conc: WeakTotals = {}
  for (const [id, n] of Object.entries(state.weak) as [keyof WeakTotals, number][]) conc[id] = n / litres
  return solvePh((state.nH - state.nOH) / litres, conc)
}

/** Rounds to one decimal, the resolution of the pH meter. */
export function meterReading(ph: number): number {
  return Math.round(ph * 10) / 10
}

export function formatNum(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace('.', ',').replace('-', '−')
}

/* ------------------------- universal indicator ------------------------- */

/** Universal indicator colour at integer pH 0..14 (subject data, not theme colours). */
export const INDICATOR_STOPS = [
  '#c0172b', // 0
  '#d7263d', // 1  red
  '#e8452c', // 2  red
  '#f26b21', // 3  orange
  '#f7931e', // 4  orange
  '#f5c518', // 5  yellow
  '#dcd324', // 6  yellow
  '#4caf50', // 7  green
  '#1fa59a', // 8  blue-green
  '#2f7fd8', // 9  blue
  '#2c5fcf', // 10 blue
  '#5a3fc0', // 11 violet
  '#6b32b0', // 12 violet
  '#70279f', // 13 violet
  '#661e8a', // 14 violet
]

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

/** Smoothly interpolated universal-indicator colour as `#rrggbb`. */
export function indicatorColor(ph: number): string {
  const p = Math.min(14, Math.max(0, ph))
  const i = Math.min(13, Math.floor(p))
  const t = p - i
  const a = hexToRgb(INDICATOR_STOPS[i])
  const b = hexToRgb(INDICATOR_STOPS[i + 1])
  const mix = a.map((x, k) => Math.round(x + (b[k] - x) * t))
  return '#' + mix.map((x) => x.toString(16).padStart(2, '0')).join('')
}

/** Czech word for the character of the solution. */
export function describePh(ph: number): string {
  const r = meterReading(ph)
  if (r < 3) return 'silně kyselý'
  if (r < 6.5) return 'kyselý'
  if (r <= 7.5) return 'neutrální'
  if (r <= 11) return 'zásaditý'
  return 'silně zásaditý'
}

/* ------------------------------ missions ------------------------------ */

export interface Mission {
  id: string
  /** Level whose content this mission trains (also picks the bottles). */
  level: number
  /** Category; one mission per category is drawn for a round. */
  category: string
  /** Task text (Czech, may use markup). */
  text: string
  /** Handwritten hint from the mascot. */
  hint: string
  start: BeakerState
  /** Accepted meter reading range (inclusive). */
  min: number
  max: number
  /** Number of additions a sharp chemist needs. */
  par: number
  /** A second beaker that receives the same additions, for comparison (e.g. water next to a buffer). */
  twin?: { label: string; start: BeakerState }
  /** Ids of bottles that must all be used for the mission to count. */
  needs?: string[]
  /** Only these bottles of the level's shelf are offered (default: all). */
  bottles?: string[]
}

export const MISSION_MAX = 10

export interface MissionScore {
  reading: number
  inRange: boolean
  accuracy: number
  efficiency: number
  total: number
  /** The mission needed a particular bottle that was never used. */
  missing?: boolean
}

/**
 * 7 points for accuracy (full if the meter reading is in range, then falling
 * off with the distance), 3 points for efficiency (only if in range).
 */
export function scoreMission(m: Mission, ph: number, additions: number, used?: ReadonlySet<string>): MissionScore {
  const reading = meterReading(ph)
  const missing = !!m.needs && !!used && m.needs.some((id) => !used.has(id))
  const inRange = !missing && reading >= m.min - 1e-9 && reading <= m.max + 1e-9
  const dist = inRange ? 0 : Math.min(Math.abs(reading - m.min), Math.abs(reading - m.max))
  const accuracy = inRange ? 7 : Math.round(7 * Math.max(0, 1 - dist / 1.5))
  let efficiency = 0
  if (inRange && additions > 0) {
    if (additions <= m.par) efficiency = 3
    else if (additions <= m.par + 2) efficiency = 2
    else if (additions <= m.par + 5) efficiency = 1
  }
  return { reading, inRange, accuracy: missing ? 0 : accuracy, efficiency, total: (missing ? 0 : accuracy) + efficiency, missing }
}
