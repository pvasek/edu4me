/** Physics of the `density-float` experiment: a block in a liquid. */

export type FloatState = 'float' | 'hover' | 'sink'

/** Reference liquids (density in g/cm³). */
export const LIQUIDS = {
  voda: { name: 'voda', rho: 1.0 },
  slana: { name: 'slaná voda', rho: 1.03 },
  olej: { name: 'olej', rho: 0.92 },
} as const
export type LiquidId = keyof typeof LIQUIDS

/** A block whose density is this close to the liquid's (after rounding to 0,01) hovers. */
export const HOVER_TOLERANCE = 0.02

/**
 * Density ρ = m / V (g, cm³ → g/cm³) and what the block does in a liquid of density
 * `rhoLiquid`: it floats when lighter, sinks when denser and hovers when the two
 * densities are within ±0,02 g/cm³. The comparison uses ρ rounded to two decimals,
 * so it always agrees with the readout. A floating block is submerged by the
 * fraction ρ / ρ_kapaliny; a hovering or sinking one is under the surface entirely.
 */
export function floatInLiquid(m: number, V: number, rhoLiquid: number): { rho: number; state: FloatState; submerged: number } {
  const rho = V > 0 ? m / V : Infinity
  const shown = Math.round(rho * 100) / 100
  const state: FloatState = Math.abs(shown - rhoLiquid) <= HOVER_TOLERANCE + 1e-9 ? 'hover' : rho < rhoLiquid ? 'float' : 'sink'
  return { rho, state, submerged: state === 'float' ? rho / rhoLiquid : 1 }
}
