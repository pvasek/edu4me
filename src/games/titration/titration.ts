/**
 * Pure maths for the titration game: an acid sample in the flask titrated
 * with NaOH from the burette. The pH is computed exactly from the charge
 * balance (see ../ph-lab/equilibrium.ts), so the weak-acid curve has its
 * buffer region, pH = pKa at half-equivalence and a basic equivalence point,
 * and the second proton of H₂SO₄ is treated as the weak acid it is.
 */
import { solvePh, type WeakTotals } from '../ph-lab/equilibrium'

export const KW = 1e-14
export const C_NAOH = 0.1 // mol/dm³
export const V_HCL = 20 // cm³ (pipetted sample volume, the same for every acid)
export const V_SAMPLE = V_HCL
export const BURETTE_MAX = 50 // cm³
export const DROP = 0.05 // cm³
export const STREAM_RATE = 0.5 // cm³ per second
/** Phenolphthalein turns pink above this pH. */
export const PINK_FROM = 8.2

export type AcidId = 'hcl' | 'ch3cooh' | 'h2so4'

export interface AcidInfo {
  id: AcidId
  /** Formula in inline markup. */
  formula: string
  /** Formula in plain Unicode (SVG labels). */
  plain: string
  /** Czech name of the sample. */
  name: string
  /** Balanced equation (markup). */
  equation: string
  /** mol NaOH per mol acid at equivalence. */
  ratio: number
  /** Strong-acid equivalents per mol of acid (fully dissociated protons that no weak system accounts for). */
  strong: number
  /** Weak systems per mol of acid. */
  weak: WeakTotals
  /** pKa of a weak acid (marks the half-equivalence point). */
  pKa?: number
  /** Learner picks the indicator first. */
  chooseIndicator?: boolean
  /** Range of the random concentration (mol/dm³). */
  cMin: number
  cMax: number
}

export const ACIDS: Record<AcidId, AcidInfo> = {
  hcl: {
    id: 'hcl',
    formula: '$HCl$',
    plain: 'HCl',
    name: 'kyselina chlorovodíková',
    equation: '$HCl + NaOH -> NaCl + H2O$',
    ratio: 1,
    strong: 1,
    weak: {},
    cMin: 0.06,
    cMax: 0.14,
  },
  ch3cooh: {
    id: 'ch3cooh',
    formula: '$CH3COOH$',
    plain: 'CH₃COOH',
    name: 'zředěný ocet (kyselina octová)',
    equation: '$CH3COOH + NaOH -> CH3COONa + H2O$',
    ratio: 1,
    strong: 0,
    weak: { ac: 1 },
    pKa: 4.76,
    chooseIndicator: true,
    cMin: 0.06,
    cMax: 0.14,
  },
  h2so4: {
    id: 'h2so4',
    formula: '$H2SO4$',
    plain: 'H₂SO₄',
    name: 'kyselina sírová',
    equation: '$H2SO4 + 2NaOH -> Na2SO4 + 2H2O$',
    ratio: 2,
    // First proton strong: H2SO4 -> H+ + HSO4−; the HSO4− system carries that charge.
    strong: 0,
    weak: { so4: 1 },
    cMin: 0.03,
    cMax: 0.07,
  },
}

export interface Sample {
  acid: AcidId
  /** True concentration of the acid in mol/dm³. */
  c: number
}

/** Random sample of an acid; the equivalence volume stays between 12 and 28 cm³. */
export function randomSample(acid: AcidId = 'hcl', rnd: () => number = Math.random): Sample {
  const a = ACIDS[acid]
  const c = a.cMin + rnd() * (a.cMax - a.cMin)
  return { acid, c: Math.round(c * 10000) / 10000 }
}

/** Volume of NaOH (cm³) at the equivalence point. */
export function equivalenceVolume(s: Sample, cBase = C_NAOH, vAcid = V_SAMPLE): number {
  return (ACIDS[s.acid].ratio * s.c * vAcid) / cBase
}

/** pH of the flask after `vBase` cm³ of NaOH was added (exact equilibrium). */
export function phAt(s: Sample, vBase: number, cBase = C_NAOH, vAcid = V_SAMPLE): number {
  const a = ACIDS[s.acid]
  const vol = (vAcid + vBase) / 1000
  const nAcid = (s.c * vAcid) / 1000
  const strong = (a.strong * nAcid - (cBase * vBase) / 1000) / vol
  const weak: WeakTotals = {}
  for (const [id, k] of Object.entries(a.weak) as [keyof WeakTotals, number][]) weak[id] = (k * nAcid) / vol
  return solvePh(strong, weak)
}

/** Half-equivalence point of a weak acid: V = V_E / 2, where pH = pKa. */
export function halfEquivalence(s: Sample): { v: number; pKa: number } | null {
  const pKa = ACIDS[s.acid].pKa
  return pKa === undefined ? null : { v: equivalenceVolume(s) / 2, pKa }
}

/** Phenolphthalein pink intensity 0..1 (0 = colourless). */
export function pinkIntensity(ph: number): number {
  if (ph < PINK_FROM) return 0
  return Math.min(1, 0.25 + ((ph - PINK_FROM) / 3.8) * 0.75)
}

/**
 * How long (ms) the local pink flash from a drop survives before the
 * solution mixes it away. Longer as the endpoint approaches, like in a real lab.
 */
export function flashDuration(s: Sample, vBase: number): number {
  const left = equivalenceVolume(s) - vBase // cm³ still needed
  if (left <= 0) return 0
  if (left < 0.3) return 2400
  if (left < 1) return 1500
  if (left < 3) return 900
  return 500
}

/**
 * c(acid) = c(NaOH) · V(NaOH) / (ratio · V(acid)):
 * 1 : 1 for HCl and CH₃COOH, 1 : 2 for H₂SO₄ (H₂SO₄ + 2 NaOH).
 */
export function concFromVolume(vBase: number, acid: AcidId = 'hcl', cBase = C_NAOH, vAcid = V_SAMPLE): number {
  return (cBase * vBase) / (ACIDS[acid].ratio * vAcid)
}

export function parseCz(s: string): number | null {
  const t = s.replace(/\s/g, '').replace(',', '.').replace('−', '-')
  if (!t || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return null
  return Number(t)
}

export interface SampleScore {
  endpoint: number // 0..5
  reading: number // 0..2
  calc: number // 0..3
  /** 0..2, only for samples where the learner picks the indicator. */
  indicator: number
  total: number
  max: number
  delta: number // used − equivalence (cm³)
  pink: boolean
  readingOk: boolean
  calcOk: boolean
  /** The answer is exactly the ratio away from right (e.g. forgot the 1 : 2 of H₂SO₄). */
  ratioSlip: boolean
}

export const SAMPLE_MAX = 10
export const INDICATOR_POINTS = 2

/** Maximum points for a sample (indicator choice adds 2). */
export const sampleMax = (s: Sample) => SAMPLE_MAX + (ACIDS[s.acid].chooseIndicator ? INDICATOR_POINTS : 0)

/** Endpoint points: overshoot is penalised, stopping early too. */
export function endpointPoints(delta: number): number {
  if (delta >= -1e-9) {
    if (delta <= 0.1 + 1e-9) return 5
    if (delta <= 0.25) return 4
    if (delta <= 0.5) return 3
    if (delta <= 1) return 2
    if (delta <= 2) return 1
    return 0
  }
  const d = -delta
  if (d <= 0.1) return 3
  if (d <= 0.5) return 2
  if (d <= 1) return 1
  return 0
}

export function scoreSample(
  s: Sample,
  vUsed: number,
  readInput: string,
  concInput: string,
  indicatorOk = true,
): SampleScore {
  const a = ACIDS[s.acid]
  const delta = vUsed - equivalenceVolume(s)
  const pink = phAt(s, vUsed) >= PINK_FROM
  const endpoint = endpointPoints(delta)
  const read = parseCz(readInput)
  const readingOk = read !== null && Math.abs(read - vUsed) <= 0.1 + 1e-9
  const c = parseCz(concInput)
  const within = (target: number) => c !== null && target > 0 && Math.abs(c - target) <= target * 0.02 + 1e-12
  const fromVolume = (v: number) => concFromVolume(v, s.acid)
  const calcOk = within(s.c) || within(fromVolume(vUsed)) || (readingOk && read !== null && within(fromVolume(read)))
  const ratioSlip =
    !calcOk && a.ratio !== 1 && (within(s.c * a.ratio) || within(fromVolume(vUsed) * a.ratio) || within(s.c / a.ratio))
  const reading = readingOk ? 2 : 0
  const calc = calcOk ? 3 : 0
  const indicator = a.chooseIndicator && indicatorOk ? INDICATOR_POINTS : 0
  return {
    endpoint,
    reading,
    calc,
    indicator,
    total: endpoint + reading + calc + indicator,
    max: sampleMax(s),
    delta,
    pink,
    readingOk,
    calcOk,
    ratioSlip,
  }
}

export function fmt(n: number, decimals: number): string {
  return n.toFixed(decimals).replace('.', ',')
}
