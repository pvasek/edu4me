/**
 * Pure maths for the titration game: strong acid (HCl) titrated with a
 * strong base (NaOH), phenolphthalein as indicator.
 */

export const KW = 1e-14
export const C_NAOH = 0.1 // mol/dm³
export const V_HCL = 20 // cm³
export const BURETTE_MAX = 50 // cm³
export const DROP = 0.05 // cm³
export const STREAM_RATE = 0.5 // cm³ per second
/** Phenolphthalein turns pink above this pH. */
export const PINK_FROM = 8.2

export interface Sample {
  /** True concentration of HCl in mol/dm³. */
  cHcl: number
}

/** Random HCl sample, c between 0,0600 and 0,1400 mol/dm³ (4 decimals). */
export function randomSample(rnd: () => number = Math.random): Sample {
  const c = 0.06 + rnd() * 0.08
  return { cHcl: Math.round(c * 10000) / 10000 }
}

/** Volume of NaOH (cm³) at the equivalence point. */
export function equivalenceVolume(s: Sample, cBase = C_NAOH, vAcid = V_HCL): number {
  return (s.cHcl * vAcid) / cBase
}

/** pH of the flask after `vBase` cm³ of NaOH was added. */
export function phAt(s: Sample, vBase: number, cBase = C_NAOH, vAcid = V_HCL): number {
  const nAcid = (s.cHcl * vAcid) / 1000
  const nBase = (cBase * vBase) / 1000
  const vol = (vAcid + vBase) / 1000
  const c = (nAcid - nBase) / vol
  if (c >= 0) return -Math.log10(c / 2 + Math.sqrt((c * c) / 4 + KW))
  const b = -c
  return 14 + Math.log10(b / 2 + Math.sqrt((b * b) / 4 + KW))
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

/** c(HCl) = c(NaOH) · V(NaOH) / V(HCl), HCl + NaOH -> NaCl + H2O (1 : 1). */
export function concFromVolume(vBase: number, cBase = C_NAOH, vAcid = V_HCL): number {
  return (cBase * vBase) / vAcid
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
  total: number
  delta: number // used − equivalence (cm³)
  pink: boolean
  readingOk: boolean
  calcOk: boolean
}

export const SAMPLE_MAX = 10

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
): SampleScore {
  const delta = vUsed - equivalenceVolume(s)
  const pink = phAt(s, vUsed) >= PINK_FROM
  const endpoint = endpointPoints(delta)
  const read = parseCz(readInput)
  const readingOk = read !== null && Math.abs(read - vUsed) <= 0.1 + 1e-9
  const c = parseCz(concInput)
  const within = (target: number) => c !== null && target > 0 && Math.abs(c - target) <= target * 0.02 + 1e-12
  const calcOk = within(s.cHcl) || within(concFromVolume(vUsed)) || (readingOk && read !== null && within(concFromVolume(read)))
  const reading = readingOk ? 2 : 0
  const calc = calcOk ? 3 : 0
  return { endpoint, reading, calc, total: endpoint + reading + calc, delta, pink, readingOk, calcOk }
}

export function fmt(n: number, decimals: number): string {
  return n.toFixed(decimals).replace('.', ',')
}
