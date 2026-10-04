/**
 * Model of the `albedo-balance` experiment (z10-2): the zero-dimensional
 * energy balance of the Earth.
 *
 * The Earth absorbs sunlight on a disc (πR²) and radiates from a sphere (4πR²),
 * so on average every m² gets S/4 ≈ 340 W/m² of sunlight. A share α (albedo)
 * is reflected, the rest is absorbed. In equilibrium the absorbed flux equals
 * what leaves the top of the atmosphere, εσT⁴, where ε is an effective
 * emissivity: ε = 1 means no greenhouse effect, a smaller ε means the
 * atmosphere sends less of the surface's heat radiation out to space.
 *
 *   T = [S (1 − α) / (4 ε σ)]^(1/4)
 *
 * S = 1 361 W/m² (total solar irradiance, Kopp & Lean 2011), α ≈ 0,30,
 * σ = 5,670 · 10⁻⁸ W/(m²·K⁴). With ε = 1 this gives ≈ −18 °C (255 K, the
 * effective radiating temperature); the real mean surface temperature
 * ≈ 15 °C (288 K) needs ε ≈ 0,61. A textbook simplification: real feedbacks
 * (water vapour, clouds, ice) are not modelled.
 */

export const S = 1361
export const SIGMA = 5.670374e-8
export const ALBEDO_EARTH = 0.3
export const T_EARTH = 15
export const K0 = 273.15

/** ε that gives 15 °C with α = 0,30 (≈ 0,61). */
export const EPS_EARTH = Math.round(((S * (1 - ALBEDO_EARTH)) / (4 * SIGMA * (T_EARTH + K0) ** 4)) * 100) / 100

export const ALBEDO_MIN = 0.05
export const ALBEDO_MAX = 0.8
export const EPS_MIN = 0.5
export const EPS_MAX = 1

/** Mean incoming sunlight per m² of the whole surface (W/m²). */
export const incoming = () => S / 4
/** Reflected sunlight (W/m²). */
export const reflected = (albedo: number) => (S / 4) * albedo
/** Absorbed sunlight = outgoing heat radiation in equilibrium (W/m²). */
export const absorbed = (albedo: number) => (S / 4) * (1 - albedo)

/** Equilibrium temperature in °C. */
export function temperature(albedo: number, eps: number): number {
  return ((S * (1 - albedo)) / (4 * eps * SIGMA)) ** 0.25 - K0
}

/** Greenhouse effect in °C: how much warmer than with ε = 1 at the same albedo. */
export const greenhouseWarming = (albedo: number, eps: number) => temperature(albedo, eps) - temperature(albedo, 1)

/** Typical albedo of surfaces (rounded textbook values). */
export const SURFACES: { label: string; albedo: number }[] = [
  { label: 'oceán', albedo: 0.06 },
  { label: 'les', albedo: 0.12 },
  { label: 'tráva', albedo: 0.25 },
  { label: 'poušť', albedo: 0.35 },
  { label: 'mořský led', albedo: 0.6 },
  { label: 'čerstvý sníh', albedo: 0.85 },
]

/** The challenge: no greenhouse effect at all (ε = 1) and still a mean temperature of at least 0 °C. */
export const challengeMet = (albedo: number, eps: number) => eps >= 0.999 && temperature(albedo, eps) >= 0
