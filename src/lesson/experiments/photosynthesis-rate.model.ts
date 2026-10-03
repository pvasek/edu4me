/**
 * Biology of the `photosynthesis-rate` experiment: a sprig of vodní mor (Elodea)
 * under a lamp gives off oxygen bubbles. Blackman's law of limiting factors: the
 * rate is set by the factor in shortest supply, so it is the minimum of three
 * curves (light, CO₂, temperature). All values are approximate, for a typical
 * C3 water plant in a school experiment.
 */

export type Factor = 'light' | 'co2' | 'temp'

/** Bubbles per minute when nothing limits (a vigorous sprig under a strong lamp). */
export const MAX_RATE = 60
/** Light intensity (% of the lamp's maximum) above which more light no longer helps. */
export const LIGHT_SAT = 60
/** CO₂ concentration (%) above which more CO₂ no longer helps; ordinary air has about 0,04 %. */
export const CO2_SAT = 0.1
export const CO2_AIR = 0.04
/** Temperature optimum (°C): enzymes of the Calvin cycle work fastest here. */
export const T_OPT: [number, number] = [25, 30]
/** Above this temperature the enzymes are denatured and photosynthesis stops (°C). */
export const T_DEAD = 45

/** Light: rises in proportion to the intensity, then levels off (fraction 0–1 of MAX_RATE). */
export const lightCap = (light: number) => clamp01(light / LIGHT_SAT)

/** CO₂: rises in proportion to the concentration, then levels off (fraction 0–1). */
export const co2Cap = (co2: number) => clamp01(co2 / CO2_SAT)

/**
 * Temperature (fraction 0–1): below the optimum enzymes slow down roughly twice
 * for every 10 °C (Q₁₀ ≈ 2), reaching zero near 0 °C; 25–30 °C is the optimum;
 * above 30 °C the rate falls, steeply above ~40 °C (denaturation), to zero at 45 °C.
 */
export function tempCap(t: number): number {
  const [lo, hi] = T_OPT
  if (t <= 0) return 0
  if (t < lo) {
    const base = 2 ** (-lo / 10)
    return (2 ** ((t - lo) / 10) - base) / (1 - base)
  }
  if (t <= hi) return 1
  if (t >= T_DEAD) return 0
  return Math.cos(((t - hi) / (T_DEAD - hi)) * (Math.PI / 2)) ** 2
}

/**
 * Rate of photosynthesis in bubbles of oxygen per minute: the minimum of the three
 * caps times MAX_RATE. `limiting` lists the factor(s) whose cap sets the rate (all
 * within 1 % of the minimum), empty when all three are saturated: then the plant
 * works at its own maximum (the amount of chlorophyll and enzymes limits it).
 */
export function photosynthesisRate(
  light: number,
  co2: number,
  temp: number,
): { rate: number; caps: Record<Factor, number>; limiting: Factor[] } {
  const caps: Record<Factor, number> = { light: lightCap(light), co2: co2Cap(co2), temp: tempCap(temp) }
  const min = Math.min(caps.light, caps.co2, caps.temp)
  const limiting = min >= 1 - 1e-9 ? [] : (Object.keys(caps) as Factor[]).filter((k) => caps[k] - min <= 0.01)
  return { rate: MAX_RATE * min, caps, limiting }
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}
