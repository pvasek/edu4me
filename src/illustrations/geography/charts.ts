/**
 * Pure helpers of the geography charts (klimatogram, věková pyramida): statistics,
 * axes and Czech number formatting. Used by ClimateView / PyramidView and by the
 * climate-chart and pop-pyramid games, so the numbers a chart shows and the answers
 * a game checks come from the same code.
 */
import type { ClimatePlace, PyramidSpec } from '../../core/types'
import { niceStep, ticks } from '../physics/kit'

// ------------------------------------------------------------------ numbers

/**
 * Czech number: decimal comma, real minus sign, a no-break space in thousands
 * (1 603, 2 362). `digits` fixes the decimals; by default up to 2, trailing zeros dropped.
 */
export function czn(n: number, digits?: number): string {
  if (!Number.isFinite(n)) return '–'
  const fixed = digits === undefined ? String(Math.round(n * 100) / 100) : n.toFixed(digits)
  const neg = n < 0 && /[1-9]/.test(fixed)
  const [int, dec] = fixed.replace('-', '').split('.')
  const grouped = int.length > 3 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int
  return (neg ? '−' : '') + grouped + (dec ? ',' + dec : '')
}

const round1 = (x: number) => Math.round(x * 10) / 10

/** Consecutive runs of indices: [0, 1, 2, 5] → [[0, 2], [5, 5]] (outlines one box per run). */
export function runs(indices: number[]): [number, number][] {
  const out: [number, number][] = []
  for (const i of [...new Set(indices)].sort((a, b) => a - b)) {
    const last = out[out.length - 1]
    if (last && i === last[1] + 1) last[1] = i
    else out.push([i, i])
  }
  return out
}

// ------------------------------------------------------------------ months

export const MONTHS_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const
export const MONTHS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'] as const
/** "v lednu", "v únoru" … */
export const IN_MONTH = ['v lednu', 'v únoru', 'v březnu', 'v dubnu', 'v květnu', 'v červnu', 'v červenci', 'v srpnu', 'v září', 'v říjnu', 'v listopadu', 'v prosinci'] as const

// ------------------------------------------------------------------ klimatogram

export interface ClimateStats {
  /** mean of the 12 monthly means, °C (1 decimal) */
  meanT: number
  /** sum of the 12 monthly totals, mm (whole mm) */
  totalP: number
  /** month index (0 = January) of the highest / lowest mean temperature */
  warmest: number
  coldest: number
  /** yearly range of the monthly means (amplituda), °C (1 decimal) */
  range: number
  wettest: number
  driest: number
  /** Walter–Lieth dry month: precipitation below twice the temperature (P < 2T, 10 °C ↔ 20 mm) */
  dry: boolean[]
  dryCount: number
}

const argmax = (a: number[]) => a.reduce((b, v, i) => (v > a[b] ? i : b), 0)
const argmin = (a: number[]) => a.reduce((b, v, i) => (v < a[b] ? i : b), 0)

/** Dry month in the Walter–Lieth sense: the temperature line lies above the precipitation bar. */
export const isDryMonth = (t: number, p: number) => p < 2 * t

export function climateStats(pl: Pick<ClimatePlace, 'temp' | 'precip'>): ClimateStats {
  const { temp, precip } = pl
  const warmest = argmax(temp)
  const coldest = argmin(temp)
  const dry = temp.map((t, i) => isDryMonth(t, precip[i]))
  return {
    meanT: round1(temp.reduce((a, v) => a + v, 0) / 12),
    totalP: Math.round(precip.reduce((a, v) => a + v, 0)),
    warmest,
    coldest,
    range: round1(temp[warmest] - temp[coldest]),
    wettest: argmax(precip),
    driest: argmin(precip),
    dry,
    dryCount: dry.filter(Boolean).length,
  }
}

/**
 * Walter–Lieth precipitation scale in temperature units: 20 mm ↔ 10 °C up to
 * 100 mm, above 100 mm the scale is ten times denser (200 mm per 10 °C step).
 */
export const precipUnits = (p: number) => (p <= 100 ? p / 2 : 50 + (p - 100) / 20)
/** Inverse of precipUnits: the mm value at a height in temperature units (≥ 0). */
export const unitsToPrecip = (u: number) => (u <= 50 ? u * 2 : 100 + (u - 50) * 20)

export interface ClimateAxes {
  /** bottom of the chart, °C (0 or a negative multiple of 10) */
  lo: number
  /** top of the temperature scale, °C (multiple of 10) */
  tHi: number
  /** top of the chart in temperature units (≥ tHi; higher when the bars need room) */
  top: number
  /** temperature ticks (lo … tHi, every 10 °C) */
  tTicks: number[]
  /** precipitation ticks: [height in temperature units, mm] from 0 up to top */
  pTicks: [number, number][]
  /** true when a bar reaches above 100 mm (the denser scale is used) */
  compressed: boolean
}

/** Common axes for one or two places (two places share them so they can be compared). */
export function climateAxes(places: Pick<ClimatePlace, 'temp' | 'precip'>[]): ClimateAxes {
  const temps = places.flatMap((p) => p.temp)
  const precs = places.flatMap((p) => p.precip)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const maxP = Math.max(...precs)
  const lo = Math.min(0, Math.floor(minT / 10) * 10)
  const tHi = Math.max(10, Math.ceil(maxT / 10 - 1e-9) * 10)
  const top = Math.max(tHi, Math.ceil(precipUnits(maxP) / 10 - 1e-9) * 10)
  const tTicks = ticks(lo, tHi, 10)
  const pTicks: [number, number][] = ticks(0, top, 10).map((u) => [u, unitsToPrecip(u)])
  return { lo, tHi, top, tTicks, pTicks, compressed: maxP > 100 }
}

const placeName = (pl: ClimatePlace) => pl.name.replace(/[*_=$^{}]/g, '')

/** Czech description of a klimatogram for screen readers. */
export function climateLabel(pl: ClimatePlace, opts: { name?: string; stats?: boolean } = {}): string {
  const s = climateStats(pl)
  const name = opts.name ?? placeName(pl)
  const alt = pl.altitude !== undefined ? ` (${czn(pl.altitude)} m n. m.)` : ''
  const parts = [`Klimatogram ${name}${alt}:`]
  if (opts.stats !== false) parts.push(`průměrná roční teplota ${czn(s.meanT, 1)} °C, roční srážky ${czn(s.totalP)} mm,`)
  parts.push(
    `nejteplejší ${MONTHS[s.warmest]} (${czn(pl.temp[s.warmest], 1)} °C), nejchladnější ${MONTHS[s.coldest]} (${czn(pl.temp[s.coldest], 1)} °C),`,
    `nejvíc srážek ${IN_MONTH[s.wettest]} (${czn(Math.round(pl.precip[s.wettest]))} mm), nejméně ${IN_MONTH[s.driest]} (${czn(Math.round(pl.precip[s.driest]))} mm).`,
  )
  if (opts.stats !== false && s.dryCount) parts.push(`Suchých měsíců: ${s.dryCount}.`)
  return parts.join(' ')
}

// ------------------------------------------------------------------ věková pyramida

/** Age-group labels, youngest first; the last group is open: "0–4" … "85+". */
export function ageLabels(step: number, n: number): string[] {
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? `${i * step}+` : `${i * step}–${i * step + step - 1}`))
}

export interface PyramidStats {
  /** shares of men and women, % (1 decimal) */
  male: number
  female: number
  /** the young / old / working groups: 0–14, 65+ and 15–64 for 5-year groups; 0–19, 60+ and 20–59 for 10-year groups */
  youngLabel: string
  oldLabel: string
  workLabel: string
  young: number
  old: number
  work: number
  /** index of the largest age group (men + women) */
  largest: number
  /** (young + old) / working × 100: index ekonomické závislosti */
  dependency: number
  /** old / working × 100 */
  oldDependency: number
}

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0)

export function pyramidStats(spec: Pick<PyramidSpec, 'male' | 'female'>, step: 5 | 10): PyramidStats {
  const tot = spec.male.map((m, i) => m + spec.female[i])
  const yEnd = step === 5 ? 3 : 2 // groups below 15 / 20
  const oStart = step === 5 ? 13 : 6 // 65 / 60
  const young = sum(tot.slice(0, yEnd))
  const old = sum(tot.slice(oStart))
  const work = sum(tot.slice(yEnd, oStart))
  return {
    male: round1(sum(spec.male)),
    female: round1(sum(spec.female)),
    youngLabel: step === 5 ? '0–14' : '0–19',
    oldLabel: step === 5 ? '65+' : '60+',
    workLabel: step === 5 ? '15–64' : '20–59',
    young: round1(young),
    old: round1(old),
    work: round1(work),
    largest: argmax(tot),
    dependency: round1(((young + old) / work) * 100),
    oldDependency: round1((old / work) * 100),
  }
}

export interface PyramidAxis {
  /** end of each half-axis, % */
  max: number
  step: number
  ticks: number[]
}

/** Symmetric % axis for one or more pyramids: the same scale for all, so they can be compared. */
export function pyramidAxis(specs: Pick<PyramidSpec, 'male' | 'female'>[]): PyramidAxis {
  const top = Math.max(...specs.flatMap((s) => [...s.male, ...s.female]), 0.1)
  const step = niceStep(top, 3)
  const max = Math.ceil(top / step - 1e-9) * step
  return { max, step, ticks: ticks(0, max, step) }
}

/** Czech description of a pyramid for screen readers. */
export function pyramidLabel(spec: PyramidSpec, step: 5 | 10, name?: string): string {
  const s = pyramidStats(spec, step)
  const ages = ageLabels(step, spec.male.length)
  const label = name ?? spec.label.replace(/[*_=$^{}]/g, '')
  return (
    `Věková pyramida ${label}${spec.source ? ` (${spec.source})` : ''}: ` +
    `věkové skupiny po ${step} letech od ${ages[0]} do ${ages[ages.length - 1]}, muži vlevo, ženy vpravo. ` +
    `Lidé ${s.youngLabel} let tvoří ${czn(s.young, 1)} %, ${s.workLabel} let ${czn(s.work, 1)} %, ${s.oldLabel} let ${czn(s.old, 1)} %; ` +
    `nejpočetnější skupina ${ages[s.largest]} let; muži ${czn(s.male, 1)} %, ženy ${czn(s.female, 1)} %.`
  )
}
