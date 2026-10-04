/**
 * Model of the `climate-scenario` experiment (z10-4): when global CO₂ emissions
 * peak and how fast they fall → the nearest IPCC AR6 scenario (SSP) and its
 * projected warming in 2081–2100 relative to 1850–1900.
 *
 * A deliberate simplification. The learner's pathway starts at ≈ 42 Gt CO₂ per
 * year in 2025 (Global Carbon Budget 2024: fossil + land use ≈ 41,6 Gt in 2024),
 * grows by a fixed rate until the peak year and then falls linearly by a share
 * of the peak each year, down to zero (no CO₂ removal). Warming depends mainly
 * on cumulative CO₂ emissions (IPCC AR6 WG1 SPM D.1), so the pathway is matched
 * to the SSP with the nearest cumulative emissions 2025–2100. Other gases,
 * aerosols and the shape of the path are ignored; the experiment shows the
 * scenario's numbers, it does not compute its own temperature.
 *
 * SSP CO₂ pathways (fossil + land use, Gt CO₂/yr, rounded): the CMIP6 marker
 * scenarios of the SSP database (Riahi et al. 2017; Meinshausen et al. 2020),
 * as drawn in IPCC AR6 WG1 SPM Fig. SPM.4.
 * Warming 2081–2100 vs 1850–1900: IPCC AR6 WG1 SPM Table SPM.1, best estimate
 * and very likely range (5–95 %).
 */

export const YEARS = [2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100] as const
export const START_YEAR = 2025
export const END_YEAR = 2100
/** global CO₂ emissions in 2025 (Gt CO₂/yr) */
export const E0 = 42

export type ScenarioId = 'ssp119' | 'ssp126' | 'ssp245' | 'ssp370' | 'ssp585'

export interface Scenario {
  id: ScenarioId
  name: string
  /** in words, Czech */
  words: string
  /** CO₂ emissions at YEARS (Gt CO₂/yr) */
  co2: number[]
  /** warming 2081–2100 vs 1850–1900 (°C): best estimate, very likely range */
  best: number
  low: number
  high: number
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'ssp119',
    name: 'SSP1-1.9',
    words: 'velmi nízké emise',
    co2: [39.7, 22.8, 10.5, 2.1, -1.5, -4.5, -7.3, -10.5, -13.9],
    best: 1.4,
    low: 1.0,
    high: 1.8,
  },
  {
    id: 'ssp126',
    name: 'SSP1-2.6',
    words: 'nízké emise',
    co2: [39.8, 34.7, 26.5, 18.0, 10.5, 4.5, -3.3, -8.4, -8.6],
    best: 1.8,
    low: 1.3,
    high: 2.4,
  },
  {
    id: 'ssp245',
    name: 'SSP2-4.5',
    words: 'střední emise',
    co2: [40.6, 43.5, 44.3, 43.5, 40.2, 35.2, 26.8, 16.3, 9.7],
    best: 2.7,
    low: 2.1,
    high: 3.5,
  },
  {
    id: 'ssp370',
    name: 'SSP3-7.0',
    words: 'vysoké emise',
    co2: [44.8, 52.8, 58.5, 62.9, 66.6, 70.6, 73.4, 77.0, 82.7],
    best: 3.6,
    low: 2.8,
    high: 4.6,
  },
  {
    id: 'ssp585',
    name: 'SSP5-8.5',
    words: 'velmi vysoké emise',
    co2: [43.7, 55.3, 68.8, 83.3, 100.3, 116.8, 129.6, 130.6, 126.3],
    best: 4.4,
    low: 3.3,
    high: 5.7,
  },
]

/** A scenario's CO₂ emissions in a year (linear between the decades). */
export function scenarioAt(s: Scenario, year: number): number {
  const i = Math.max(0, Math.min(YEARS.length - 2, Math.floor((year - YEARS[0]) / 10)))
  const f = (year - YEARS[i]) / 10
  return s.co2[i] + (s.co2[i + 1] - s.co2[i]) * f
}

export type Growth = 'pomaly' | 'rychly'
/** yearly growth of emissions until the peak */
export const GROWTH: Record<Growth, number> = { pomaly: 0.01, rychly: 0.02 }

export interface Pathway {
  /** the year emissions stop growing (END_YEAR = they grow all century) */
  peak: number
  /** after the peak, emissions fall each year by this share of the peak (0–0,06) */
  fall: number
  growth: Growth
}

/** The learner's CO₂ emissions in a year (Gt CO₂/yr). */
export function emissionsAt(p: Pathway, year: number): number {
  const g = GROWTH[p.growth]
  const t = Math.max(START_YEAR, year)
  if (t <= p.peak) return E0 * Math.exp(g * (t - START_YEAR))
  const top = E0 * Math.exp(g * (p.peak - START_YEAR))
  return Math.max(0, top * (1 - p.fall * (t - p.peak)))
}

/** The year emissions reach zero, or null if not by 2100. */
export function zeroYear(p: Pathway): number | null {
  if (p.fall <= 0) return null
  const y = p.peak + 1 / p.fall
  return y <= END_YEAR ? y : null
}

/** Sum of yearly values 2025–2100 (mid-year rule). */
function sum(f: (year: number) => number): number {
  let c = 0
  for (let y = START_YEAR; y < END_YEAR; y++) c += f(y + 0.5)
  return c
}

/** Cumulative CO₂ emissions 2025–2100 of the learner's pathway (Gt CO₂). */
export const cumulative = (p: Pathway) => sum((y) => emissionsAt(p, y))

/** Cumulative CO₂ emissions 2025–2100 of each scenario (Gt CO₂). */
export const SCENARIO_CUMULATIVE: Record<ScenarioId, number> = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, sum((y) => scenarioAt(s, y))]),
) as Record<ScenarioId, number>

/** The scenario with the nearest cumulative emissions 2025–2100. */
export function nearestScenario(p: Pathway): Scenario {
  const c = cumulative(p)
  let best = SCENARIOS[0]
  for (const s of SCENARIOS)
    if (Math.abs(SCENARIO_CUMULATIVE[s.id] - c) < Math.abs(SCENARIO_CUMULATIVE[best.id] - c)) best = s
  return best
}

/** The challenge: warming kept well below 2 °C, i.e. one of the two SSP1 scenarios. */
export const challengeMet = (p: Pathway) => nearestScenario(p).best < 2
