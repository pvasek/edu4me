/**
 * Model of the `energy-mix` experiment (z12-5): shares of seven sources in
 * electricity production → emissions per kWh, dependence on imported fuel and
 * how much of the supply can be dispatched (switched up and down on demand).
 *
 * - Life-cycle emissions (g CO₂-ekv./kWh, whole life of the plant incl. building,
 *   mining and fuel): medians of IPCC AR5 WG3 Annex III, Table A.III.2 (2014):
 *   coal 820, gas (combined cycle) 490, biomass (dedicated) 230, solar PV
 *   41 (roof) – 48 (utility) → 45, hydro 24, nuclear 12, wind 11 (onshore).
 * - Import: simplified for Czechia – natural gas and nuclear fuel are imported
 *   (Czechia covers only ≈ 2 % of its gas use), lignite, water, wind, sun and
 *   biomass are domestic. Nuclear fuel is imported but is stored at the plant
 *   for one to two years, gas has to flow all the time: shown separately.
 * - Dispatchable ("řiditelné") sources: coal, gas, nuclear, hydro, biomass;
 *   wind and sun follow the weather.
 * - Preset Česko 2024: gross production 68,7 TWh – nuclear 40,8 %, coal 34,5 %
 *   (brown 33,5 %), solar 5,7 %, gas 5,1 %, hydro ≈ 3,4 %, biomass and biogas
 *   ≈ 6,9 %, wind ≈ 1 % (oEnergetice.cz, Energostat – roční report 2024, data ERÚ a ČEPS; hydro and biomass are given there as 3–4 % each); the rest
 *   (≈ 2,6 %: waste, other gases, pumped storage) is left out and the seven
 *   shares are scaled to 100 %.
 */

export type Source = 'uhli' | 'plyn' | 'jadro' | 'voda' | 'vitr' | 'slunce' | 'biomasa'
export const SOURCES: Source[] = ['uhli', 'plyn', 'jadro', 'voda', 'biomasa', 'vitr', 'slunce']

export const LABEL: Record<Source, string> = {
  uhli: 'uhlí',
  plyn: 'zemní plyn',
  jadro: 'jádro',
  voda: 'voda',
  vitr: 'vítr',
  slunce: 'slunce',
  biomasa: 'biomasa',
}

/** life-cycle emissions, g CO₂-ekv. per kWh (IPCC AR5 medians) */
export const CO2: Record<Source, number> = {
  uhli: 820,
  plyn: 490,
  jadro: 12,
  voda: 24,
  vitr: 11,
  slunce: 45,
  biomasa: 230,
}

/** fuel imported (simplified for Czechia) */
export const IMPORTED: Record<Source, boolean> = {
  uhli: false,
  plyn: true,
  jadro: true,
  voda: false,
  vitr: false,
  slunce: false,
  biomasa: false,
}

/** can be dispatched on demand */
export const DISPATCHABLE: Record<Source, boolean> = {
  uhli: true,
  plyn: true,
  jadro: true,
  voda: true,
  vitr: false,
  slunce: false,
  biomasa: true,
}

export type Mix = Record<Source, number>

const RAW_CZ_2024: Mix = { jadro: 40.8, uhli: 34.5, slunce: 5.7, plyn: 5.1, voda: 3.4, biomasa: 6.9, vitr: 1.0 }

/** scaled so the shares sum to 100 % */
export function normalize(m: Mix): Mix {
  const total = SOURCES.reduce((a, s) => a + Math.max(0, m[s]), 0)
  const out = {} as Mix
  for (const s of SOURCES) out[s] = total > 0 ? (Math.max(0, m[s]) / total) * 100 : 100 / SOURCES.length
  return out
}

export const CZ_2024: Mix = normalize(RAW_CZ_2024)

/**
 * Set one source to `value` % and rescale the others proportionally so the
 * total stays 100 % (if the others are all zero, they share the rest equally).
 */
export function setShare(m: Mix, source: Source, value: number): Mix {
  const v = Math.min(100, Math.max(0, value))
  const others = SOURCES.filter((s) => s !== source)
  const rest = others.reduce((a, s) => a + m[s], 0)
  const out = { ...m, [source]: v } as Mix
  for (const s of others) out[s] = rest > 1e-9 ? (m[s] / rest) * (100 - v) : (100 - v) / others.length
  return out
}

/** Average life-cycle emissions of the mix (g CO₂-ekv./kWh). */
export const intensity = (m: Mix) => SOURCES.reduce((a, s) => a + (m[s] / 100) * CO2[s], 0)

/** Share of electricity made from imported fuel (%). */
export const importShare = (m: Mix) => SOURCES.reduce((a, s) => a + (IMPORTED[s] ? m[s] : 0), 0)

/** Share of dispatchable sources (%). */
export const dispatchableShare = (m: Mix) => SOURCES.reduce((a, s) => a + (DISPATCHABLE[s] ? m[s] : 0), 0)

/**
 * Whole-percent shares for display that add up to exactly 100 (largest remainder).
 */
export function roundedShares(m: Mix): Mix {
  const floors = SOURCES.map((s) => Math.floor(m[s]))
  let left = 100 - floors.reduce((a, b) => a + b, 0)
  const order = SOURCES.map((s, i) => [i, m[s] - floors[i]] as const).sort((a, b) => b[1] - a[1])
  for (const [i] of order) {
    if (left <= 0) break
    floors[i]++
    left--
  }
  const out = {} as Mix
  SOURCES.forEach((s, i) => (out[s] = floors[i]))
  return out
}

export const isPreset = (m: Mix) => SOURCES.every((s) => Math.abs(m[s] - CZ_2024[s]) < 0.05)

/**
 * The challenge: under 150 g/kWh, at least 60 % dispatchable and at most 50 %
 * from imported fuel – simply dropping coal (the rest scaled up) fails on imports.
 */
export const TASK = { maxIntensity: 150, minDispatchable: 60, maxImport: 50 }
export const challengeMet = (m: Mix) =>
  intensity(m) < TASK.maxIntensity && dispatchableShare(m) >= TASK.minDispatchable && importShare(m) <= TASK.maxImport + 1e-9
