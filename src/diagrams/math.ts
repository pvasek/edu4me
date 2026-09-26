/** Pure helpers behind the diagrams (kept free of React so they are easy to test). */
import { simpleShells } from '../courses/chemie/data/elements'
import { electronConfig, type Subshell } from '../courses/chemie/data/electronConfig'

// ------------------------------------------------------------------ atoms

const L_ORDER = { s: 0, p: 1, d: 2, f: 3 } as const

/**
 * Electrons per shell (K, L, M, …) for an atom or ion.
 * Z ≤ 20 uses the school 2-8-8-2 model; heavier atoms group the Aufbau
 * configuration by n. Cations lose electrons from the highest n first
 * (so Fe²⁺ loses 4s before 3d). Returns null for impossible input.
 */
export function shellsFor(z: number, ion = 0): number[] | null {
  const electrons = z - ion
  if (!Number.isInteger(z) || !Number.isInteger(ion) || z < 1 || z > 118 || electrons < 0 || electrons > 120) return null
  if (electrons === 0) return []
  if (z <= 20 && electrons <= 20) return simpleShells(electrons)
  let cfg: Subshell[]
  if (ion > 0) {
    cfg = electronConfig(z).map((s) => ({ ...s }))
    let remove = ion
    const order = [...cfg].sort((a, b) => b.n - a.n || L_ORDER[b.l] - L_ORDER[a.l])
    for (const s of order) {
      const take = Math.min(s.e, remove)
      s.e -= take
      remove -= take
      if (!remove) break
    }
  } else {
    cfg = electronConfig(Math.min(electrons, 118))
  }
  const shells: number[] = []
  for (const s of cfg) shells[s.n - 1] = (shells[s.n - 1] ?? 0) + s.e
  const out = Array.from(shells, (v) => v ?? 0)
  while (out.length && out[out.length - 1] === 0) out.pop()
  return out
}

// ------------------------------------------------------------------ titration

export const KW = 1e-14

export interface TitrationSetup {
  /** acid concentration, mol/dm³ */
  ca: number
  /** acid volume, cm³ */
  va: number
  /** NaOH concentration, mol/dm³ */
  cb: number
  /** pKa of the weak acid */
  pKa: number
}

export const DEFAULT_TITRATION: TitrationSetup = { ca: 0.1, va: 25, cb: 0.1, pKa: 4.76 }

/**
 * pH after adding `vb` cm³ of NaOH to the acid, from the exact charge balance
 * (water autoionisation included, so the curve is smooth through the
 * equivalence point).
 */
export function titrationPH(kind: 'strong-strong' | 'weak-strong', vb: number, s: TitrationSetup = DEFAULT_TITRATION): number {
  const V = s.va + vb
  const acid = (s.ca * s.va) / V // total acid (HA + A⁻ or Cl⁻), mol/dm³
  const na = (s.cb * vb) / V // Na⁺
  if (kind === 'strong-strong') {
    const c = acid - na
    const h = (c + Math.sqrt(c * c + 4 * KW)) / 2
    return -Math.log10(h)
  }
  const ka = 10 ** -s.pKa
  // f(h) = h + Na - A(h) - Kw/h is increasing in h: bisect on log10(h)
  let lo = -15
  let hi = 1
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    const h = 10 ** mid
    const f = h + na - (acid * ka) / (ka + h) - KW / h
    if (f > 0) hi = mid
    else lo = mid
  }
  return -(lo + hi) / 2
}

/** Volume of NaOH at the equivalence point, cm³. */
export const equivalenceVolume = (s: TitrationSetup = DEFAULT_TITRATION) => (s.ca * s.va) / s.cb

// ------------------------------------------------------------------ labels

export interface Placed {
  x: number
  w: number
  /** 0 = first row above, 1 = first row below, 2 = second row above, … */
  lane: number
}

/**
 * Greedy lane assignment for labels along a line: each label goes to the
 * first lane (alternating above/below, moving outwards) where it overlaps no
 * other label, and where its leader line (drawn at the original x) crosses
 * no label in an inner lane on the same side, and vice versa.
 */
export function assignLanes(items: { x: number; w: number }[], minX: number, maxX: number, gap = 6, maxLanes = 8): Placed[] {
  const placed: { l: number; r: number; lane: number; mx: number }[] = []
  return items.map(({ x, w }) => {
    const cx = Math.min(Math.max(x, minX + w / 2), maxX - w / 2)
    const l = cx - w / 2
    const r = cx + w / 2
    const fits = (lane: number) =>
      placed.every((p) => {
        if (p.lane === lane) return !(l < p.r + gap && r > p.l - gap)
        if (p.lane % 2 !== lane % 2) return true
        if (p.lane < lane) return x < p.l - 3 || x > p.r + 3
        return p.mx < l - 3 || p.mx > r + 3
      })
    let lane = 0
    while (lane < maxLanes - 1 && !fits(lane)) lane++
    placed.push({ l, r, lane, mx: x })
    return { x: cx, w, lane }
  })
}
