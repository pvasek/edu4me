/**
 * Pure pH maths for the pH lab. No React here, so it is easy to test.
 *
 * Model: everything is treated as a fully dissociated (strong) acid or base.
 * We track the total moles of H3O+ and OH− ever added, plus the volume.
 * Neutralisation H3O+ + OH− -> 2 H2O removes min(nH, nOH); what is left is
 * a net strong acid or base of concentration C. The water autoionisation
 * (Kw = 1e−14) is included exactly, so the pH approaches 7 smoothly and
 * never "jumps over" neutral for very dilute solutions:
 *   [H3O+] = C/2 + sqrt(C²/4 + Kw)        (C = net acid concentration)
 */

export const KW = 1e-14
/** Beaker capacity in cm³. */
export const CAPACITY = 250

export interface BeakerState {
  /** Total volume in cm³. */
  volume: number
  /** Total moles of H3O+ added (from acids). */
  nH: number
  /** Total moles of OH− added (from bases). */
  nOH: number
}

export interface Reagent {
  id: string
  /** Czech label shown on the bottle. */
  name: string
  /** Short label under the name, e.g. "0,1 mol/dm³" or "pH ≈ 2,8". */
  sub: string
  /** Net strong-acid-equivalent concentration in mol/dm³ (negative = base). */
  conc: number
  /** Typical pH of the reagent itself (for the bottle label colour). */
  ph: number
  kind: 'acid' | 'base' | 'water'
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

/** A beaker holding `volume` cm³ of a solution with net acid concentration `conc`. */
export function solution(volume: number, conc: number): BeakerState {
  const n = (conc * volume) / 1000
  return n >= 0 ? { volume, nH: n, nOH: 0 } : { volume, nH: 0, nOH: -n }
}

/** Adds `ml` cm³ of a solution with net acid concentration `conc` (mol/dm³). */
export function add(state: BeakerState, conc: number, ml: number): BeakerState {
  const n = (conc * ml) / 1000
  return {
    volume: state.volume + ml,
    nH: state.nH + Math.max(n, 0),
    nOH: state.nOH + Math.max(-n, 0),
  }
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
  return phFromNet(state.nH - state.nOH, state.volume)
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

export type MissionCategory = 'acid' | 'base' | 'neutral' | 'special'

export interface Mission {
  id: string
  category: MissionCategory
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
}

export const MISSIONS: Mission[] = [
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
]

const ORDER: MissionCategory[] = ['acid', 'base', 'neutral', 'special']

/** One random mission of each category, in a fixed learning order. */
export function pickMissions(rnd: () => number = Math.random): Mission[] {
  return ORDER.map((cat) => {
    const list = MISSIONS.filter((m) => m.category === cat)
    return list[Math.floor(rnd() * list.length)]
  })
}

export const MISSION_MAX = 10

export interface MissionScore {
  reading: number
  inRange: boolean
  accuracy: number
  efficiency: number
  total: number
}

/**
 * 7 points for accuracy (full if the meter reading is in range, then falling
 * off with the distance), 3 points for efficiency (only if in range).
 */
export function scoreMission(m: Mission, ph: number, additions: number): MissionScore {
  const reading = meterReading(ph)
  const inRange = reading >= m.min - 1e-9 && reading <= m.max + 1e-9
  const dist = inRange ? 0 : Math.min(Math.abs(reading - m.min), Math.abs(reading - m.max))
  const accuracy = inRange ? 7 : Math.round(7 * Math.max(0, 1 - dist / 1.5))
  let efficiency = 0
  if (inRange && additions > 0) {
    if (additions <= m.par) efficiency = 3
    else if (additions <= m.par + 2) efficiency = 2
    else if (additions <= m.par + 5) efficiency = 1
  }
  return { reading, inRange, accuracy, efficiency, total: accuracy + efficiency }
}
