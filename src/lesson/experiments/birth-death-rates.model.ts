/**
 * Model of the `birth-death-rates` experiment (z5-2, z11-1): today's birth rate b and
 * death rate d (‰ per year) → natural increase b − d and the age pyramid after 50 years.
 *
 * A simple cohort-component projection without migration, in 5-year steps:
 * 1. Everybody gets 5 years older: an age group moves up one row, multiplied by its
 *    5-year survival S = e^(−k·H), where H is the integrated death risk of that age
 *    (a fixed age pattern, Siler-type: high for babies, low for children and young
 *    adults, rising steeply in old age; women 0,7 × men). The open group 85+ keeps
 *    its own survivors.
 * 2. Births in 5 years = f · Σ (women 15–49 × relative fertility of their age) · 5,
 *    105 boys to 100 girls; they enter the 0–4 group after half a step's risk.
 * 3. The fertility level f and the mortality level k are set ONCE, so that in the
 *    first year the crude rates equal the sliders, and then stay the same for 50
 *    years ("women have as many children as today, people die at the same ages").
 *    So the crude rates themselves change as the pyramid changes: an ageing
 *    population has more deaths and fewer mothers, a young one keeps growing
 *    (population momentum). That is why b = d today does not keep the number
 *    of people constant.
 *
 * Starting pyramids: UN World Population Prospects 2024, estimates for 2023,
 * % of the whole population, 5-year groups, youngest first, last group 85+.
 * Check: the calibrated fertility gives 1,37 children per woman for Česko (ČSÚ 2024:
 * 1,37) and 5,9 for Niger (UN WPP 2024: ≈ 6).
 * Default rates: Česko 2024 – porodnost 7,7 ‰, úmrtnost 10,3 ‰ (ČSÚ: 84,3 tis.
 * živě narozených, 112,2 tis. zemřelých, 10,9 mil. obyvatel); Niger 2024 –
 * porodnost 41 ‰, úmrtnost 9 ‰ (UN WPP 2024 via World Bank).
 */

export const STEP = 5
export const YEARS = 50
export const GROUPS = 18
export const SEX_RATIO = 1.05

export type Start = 'cesko' | 'niger'
export const STARTS: Record<Start, { name: string; year: number; pop: number; b: number; d: number; male: number[]; female: number[] }> = {
  cesko: {
    name: 'Česko',
    year: 2023,
    pop: 10.79e6,
    b: 7.7,
    d: 10.3,
    male: [2.54, 2.72, 2.7, 2.71, 2.53, 2.7, 3.41, 3.51, 3.75, 4.42, 3.68, 3.16, 2.74, 2.76, 2.51, 1.9, 1.0, 0.58],
    female: [2.42, 2.59, 2.58, 2.59, 2.43, 2.56, 3.18, 3.28, 3.5, 4.18, 3.52, 3.1, 2.82, 3.1, 3.14, 2.7, 1.67, 1.33],
  },
  niger: {
    name: 'Niger',
    year: 2023,
    pop: 26.59e6,
    b: 41,
    d: 9,
    male: [9.02, 7.88, 6.88, 5.76, 4.65, 3.66, 2.86, 2.32, 1.94, 1.56, 1.24, 1.01, 0.78, 0.56, 0.36, 0.18, 0.07, 0.02],
    female: [8.74, 7.62, 6.64, 5.56, 4.48, 3.51, 2.74, 2.22, 1.84, 1.49, 1.21, 1.0, 0.8, 0.59, 0.4, 0.25, 0.11, 0.03],
  },
}

/** Annual death risk of a man at exact age a (Siler: infant + constant + Gompertz). */
export const hazard = (a: number) => 0.004 * Math.exp(-1.5 * a) + 0.0002 + 0.00002 * Math.exp(0.1 * a)
const FEMALE = 0.7

/** ∫ hazard over [a0, a1] (midpoint rule, 0,1-year steps). */
function risk(a0: number, a1: number): number {
  let s = 0
  for (let a = a0 + 0.05; a < a1; a += 0.1) s += hazard(a) * 0.1
  return s
}
// risk over the next 5 years for each group: from mid-group a+2,5 to a+7,5; 85+: around 90
const H_GROUP = Array.from({ length: GROUPS }, (_, g) => (g === GROUPS - 1 ? risk(87.5, 92.5) : risk(g * STEP + 2.5, g * STEP + 7.5)))
const H_BIRTH = risk(0, 2.5)

/** relative fertility of women aged 15–19 … 45–49 (groups 3–9) */
const FERT = [0.25, 0.9, 1.1, 0.85, 0.45, 0.12, 0.02]
const FIRST_MOTHER = 3

export interface Pyramid {
  male: number[]
  female: number[]
}
export const total = (p: Pyramid) => p.male.reduce((s, x) => s + x, 0) + p.female.reduce((s, x) => s + x, 0)

const mothers = (p: Pyramid) => FERT.reduce((s, w, i) => s + w * p.female[FIRST_MOTHER + i], 0)

/** One 5-year step with fertility level f and mortality level k; returns the new pyramid, births and deaths. */
export function step(p: Pyramid, f: number, k: number): { next: Pyramid; births: number; deaths: number } {
  const births = f * mothers(p) * STEP
  const bm = (births * SEX_RATIO) / (1 + SEX_RATIO)
  const bf = births - bm
  const male = new Array<number>(GROUPS).fill(0)
  const female = new Array<number>(GROUPS).fill(0)
  let deaths = 0
  for (let g = 0; g < GROUPS; g++) {
    const to = Math.min(g + 1, GROUPS - 1)
    const sm = Math.exp(-k * H_GROUP[g])
    const sf = Math.exp(-k * FEMALE * H_GROUP[g])
    male[to] += p.male[g] * sm
    female[to] += p.female[g] * sf
    deaths += p.male[g] * (1 - sm) + p.female[g] * (1 - sf)
  }
  const sbm = Math.exp(-k * H_BIRTH)
  const sbf = Math.exp(-k * FEMALE * H_BIRTH)
  male[0] = bm * sbm
  female[0] = bf * sbf
  deaths += bm * (1 - sbm) + bf * (1 - sbf)
  return { next: { male, female }, births, deaths }
}

/** Fertility and mortality levels that give the crude rates b and d (‰) in the first step. */
export function calibrate(p: Pyramid, b: number, d: number): { f: number; k: number } {
  const P = total(p)
  const f = ((b / 1000) * P) / mothers(p)
  // deaths grow with k: bisection on log k
  let lo = Math.log(1e-3)
  let hi = Math.log(1e3)
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (step(p, f, Math.exp(mid)).deaths < (d / 1000) * P * STEP) lo = mid
    else hi = mid
  }
  return { f, k: Math.exp((lo + hi) / 2) }
}

/** Children per woman (total fertility rate) implied by the fertility level f. */
export const tfr = (f: number) => f * FERT.reduce((s, w) => s + w, 0) * STEP

export const startPyramid = (start: Start): Pyramid => {
  const s = STARTS[start]
  return { male: s.male.map((x) => (x / 100) * s.pop), female: s.female.map((x) => (x / 100) * s.pop) }
}

/** The pyramid after `years` (default 50), in absolute numbers. */
export function project(start: Start, b: number, d: number, years = YEARS): Pyramid {
  let p = startPyramid(start)
  const { f, k } = calibrate(p, b, d)
  for (let t = 0; t < years; t += STEP) p = step(p, f, k).next
  return p
}

/** Shares in % of the whole population. */
export function shares(p: Pyramid): Pyramid {
  const t = total(p)
  return { male: p.male.map((x) => (x / t) * 100), female: p.female.map((x) => (x / t) * 100) }
}

/**
 * Sundbärg's types: children (0–14) against people aged 50+.
 * progresivní (young, a pyramid), stacionární (a bell), regresivní (an urn).
 */
export type Shape = 'progresivni' | 'stacionarni' | 'regresivni'
export function shapeOf(p: Pyramid): { shape: Shape; kids: number; old: number } {
  const s = shares(p)
  const sum = (a: number[], from: number, to: number) => a.slice(from, to).reduce((x, y) => x + y, 0)
  const kids = sum(s.male, 0, 3) + sum(s.female, 0, 3)
  const old = sum(s.male, 10, GROUPS) + sum(s.female, 10, GROUPS)
  const q = kids / old
  return { shape: q > 1.25 ? 'progresivni' : q < 0.8 ? 'regresivni' : 'stacionarni', kids, old }
}

/** The challenge: the population after 50 years within ± 1 % of today's. */
export const challengeMet = (start: Start, b: number, d: number) => Math.abs(total(project(start, b, d)) / STARTS[start].pop - 1) <= 0.01
