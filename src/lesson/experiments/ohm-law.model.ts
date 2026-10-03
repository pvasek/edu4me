/** Physics of the `ohm-law` experiment: a source, an ammeter, a resistor and a lamp in series. */

/** Power at which the lamp is drawn at full glow (the brightest the sliders allow is 12 V / 2 Ω = 72 W). */
export const FULL_GLOW_W = 40

/**
 * Ohm's law I = U / R (V, Ω → A) and the power P = U · I (W). R is the resistance
 * of the whole circuit. `glow` (0–1) is how bright the lamp is drawn: the light it
 * gives is proportional to P, and the eye perceives brightness roughly as its square
 * root, so glow = √(P / FULL_GLOW_W), capped at 1.
 */
export function ohmLaw(U: number, R: number): { I: number; P: number; glow: number } {
  const I = R > 0 ? U / R : 0
  const P = U * I
  return { I, P, glow: Math.min(1, Math.sqrt(Math.max(0, P) / FULL_GLOW_W)) }
}
