/**
 * Exact acid–base equilibrium for aqueous solutions (25 °C, ideal solution).
 *
 * A solution is described by
 *  - `strong`: net strong-acid concentration, i.e. [strong anions] − [strong
 *    cations] (Cl⁻ from HCl is +, Na⁺ from NaOH or from a sodium salt is −),
 *  - totals of weak acid–base systems (acetate, ammonium, carbonate, …).
 *
 * [H₃O⁺] follows from the charge balance
 *
 *   [H₃O⁺] − [OH⁻] − strong + Σ C_i · (z_i − n̄_i) = 0
 *
 * where z_i is the charge of the fully protonated form of system i and n̄_i the
 * average number of protons it has lost at that [H₃O⁺] (from all its pKa).
 * The left side grows monotonically with [H₃O⁺], so bisection on pH always
 * finds the single root. No "x is small" approximation is used.
 */

export const KW = 1e-14

export interface WeakSystem {
  id: string
  /** Czech name of the pair, for tooltips/notes. */
  name: string
  /** pKa values of the successive deprotonations. */
  pKa: number[]
  /** Charge of the fully protonated form (0 for CH₃COOH, +1 for NH₄⁺, −1 for HSO₄⁻). */
  z0: number
}

export const SYSTEMS = {
  /** CH₃COOH / CH₃COO⁻ */
  ac: { id: 'ac', name: 'kyselina octová / octan', pKa: [4.76], z0: 0 },
  /** NH₄⁺ / NH₃ (pKb(NH₃) = 4,75 → pKa(NH₄⁺) = 9,25) */
  am: { id: 'am', name: 'amonný kation / amoniak', pKa: [9.25], z0: 1 },
  /** CO₂(aq) + H₂CO₃ / HCO₃⁻ / CO₃²⁻; the effective pKa 6,1 used for blood includes dissolved CO₂. */
  co2: { id: 'co2', name: 'CO₂ / hydrogenuhličitan', pKa: [6.1, 10.33], z0: 0 },
  /** H₃PO₄ / H₂PO₄⁻ / HPO₄²⁻ / PO₄³⁻ */
  pho: { id: 'pho', name: 'fosfátový pufr', pKa: [2.15, 7.21, 12.32], z0: 0 },
  /** kyselina mléčná / laktát */
  lac: { id: 'lac', name: 'kyselina mléčná / laktát', pKa: [3.86], z0: 0 },
  /** HSO₄⁻ / SO₄²⁻ (the first proton of H₂SO₄ is strong) */
  so4: { id: 'so4', name: 'hydrogensíran / síran', pKa: [1.99], z0: -1 },
} satisfies Record<string, WeakSystem>

export type SystemId = keyof typeof SYSTEMS

/** Total concentrations (mol/dm³) or amounts (mol) of the weak systems. */
export type WeakTotals = Partial<Record<SystemId, number>>

/** Average number of protons lost by a system at [H₃O⁺] = h. */
export function protonsLost(sys: WeakSystem, h: number): number {
  // Fractions α_j ∝ Π_{k<j} Ka_k / h^j, computed relative to the fully protonated form.
  let term = 1
  let sum = 1
  let weighted = 0
  sys.pKa.forEach((pk, j) => {
    term *= 10 ** -pk / h
    sum += term
    weighted += (j + 1) * term
  })
  return weighted / sum
}

/** Charge-balance residual; increases monotonically with h. */
function residual(h: number, strong: number, weak: WeakTotals): number {
  let r = h - KW / h - strong
  for (const [id, c] of Object.entries(weak) as [SystemId, number][]) {
    if (!c) continue
    const sys = SYSTEMS[id]
    r += c * (sys.z0 - protonsLost(sys, h))
  }
  return r
}

/**
 * Exact pH of a solution with net strong-acid concentration `strong` and
 * weak-system totals `weak` (all in mol/dm³).
 */
export function solvePh(strong: number, weak: WeakTotals = {}): number {
  const hasWeak = Object.values(weak).some((c) => c && c > 0)
  if (!hasWeak) {
    // Closed form for strong acid/base only (avoids any numeric noise).
    if (strong >= 0) return -Math.log10(strong / 2 + Math.sqrt((strong * strong) / 4 + KW))
    const b = -strong
    return 14 + Math.log10(b / 2 + Math.sqrt((b * b) / 4 + KW))
  }
  let lo = -3 // pH
  let hi = 17
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    // Lower pH = higher h = larger residual.
    if (residual(10 ** -mid, strong, weak) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Henderson–Hasselbalch estimate, only for comparisons in tests and hints. */
export function hendersonHasselbalch(pKa: number, base: number, acid: number): number {
  return pKa + Math.log10(base / acid)
}
