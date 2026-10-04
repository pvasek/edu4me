/**
 * Model of the `body-temperature` experiment: an ectotherm (a lizard, in the
 * shade) and an endotherm (a mouse) at the same surrounding temperature.
 * Approximate, school-level values.
 *
 * - The lizard's body temperature follows the surroundings (in the sun it
 *   would warm a few degrees above the air; here it sits in the shade).
 * - Its activity follows a thermal performance curve: nothing below ~5 °C
 *   (torpor), a rise to the preferred body temperature (~33 °C for European
 *   lizards such as the sand lizard), then a steep fall towards the critical
 *   maximum (~43 °C).
 * - The mouse keeps ~37 °C. Below its thermoneutral zone (~30 °C) it must
 *   burn more food the colder it is (Scholander: heat loss ∝ T_body − T_air);
 *   above ~34 °C it overheats a little and spends some energy cooling down.
 * - Energy use is relative to the mouse's resting use at 30 °C (= 1). A lizard
 *   of the same size uses far less (≈ 1/8 at 30 °C) and its use falls in the
 *   cold (Q10 ≈ 2,5): that is why it can eat ten times less.
 */

export const T_MIN = -10
export const T_MAX = 40

/** lizard: torpid below, preferred body temperature, critical maximum (°C) */
export const LIZ_TORPOR = 5
export const LIZ_BEST = 33
export const LIZ_CRIT = 43

/** mouse: body temperature and the lower edge of the thermoneutral zone (°C) */
export const MOUSE_BODY = 37
export const MOUSE_TNZ = 30

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Body temperature of the lizard in the shade (°C). */
export const lizardBody = (air: number) => air

/** Body temperature of the mouse (°C): constant, a little higher in heat. */
export const mouseBody = (air: number) => (air <= 34 ? MOUSE_BODY : MOUSE_BODY + (air - 34) * 0.3)

/** Lizard activity 0–1 at body temperature tb. */
export function lizardActivity(tb: number): number {
  if (tb <= LIZ_TORPOR || tb >= LIZ_CRIT) return 0
  if (tb <= LIZ_BEST) {
    const x = (tb - LIZ_TORPOR) / (LIZ_BEST - LIZ_TORPOR)
    return x * x * (3 - 2 * x)
  }
  const x = (LIZ_CRIT - tb) / (LIZ_CRIT - LIZ_BEST)
  return Math.sqrt(x)
}

export type LizardState = 'zmrzla' | 'strnula' | 'pomala' | 'cila' | 'nejcilejsi' | 'prehrata'

/** A word for the lizard's state at air temperature `air` (in the shade). */
export function lizardState(air: number): LizardState {
  const tb = lizardBody(air)
  if (tb < 0) return 'zmrzla'
  const a = lizardActivity(tb)
  if (tb > LIZ_BEST + 2) return 'prehrata'
  if (a < 0.05) return 'strnula'
  if (a < 0.5) return 'pomala'
  if (!isBest(air)) return 'cila'
  return 'nejcilejsi'
}

/** Mouse energy use relative to its resting use in warmth (1 = 1×). */
export function mouseEnergy(air: number): number {
  if (air < MOUSE_TNZ) return (MOUSE_BODY - air) / (MOUSE_BODY - MOUSE_TNZ)
  if (air <= 34) return 1
  return 1 + (air - 34) * 0.08
}

/** Lizard energy use on the same scale (≈ 1/8 of the mouse at 30 °C, Q10 = 2,5). */
export function lizardEnergy(air: number): number {
  const tb = clamp(lizardBody(air), 0, LIZ_CRIT)
  return 0.12 * Math.pow(2.5, (tb - 30) / 10)
}

/** The challenge: find the air temperature at which the lizard is most active. */
export const isBest = (air: number) => lizardActivity(lizardBody(air)) >= 0.98
