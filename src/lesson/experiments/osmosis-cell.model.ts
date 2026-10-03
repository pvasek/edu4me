/**
 * Osmosis in the `osmosis-cell` experiment: a cell in a solution of table salt (NaCl).
 * Water moves through the membrane towards the more concentrated solution. Values are
 * approximate: blood plasma is isotonic with about 0,9 % NaCl; the cell sap of plant
 * cells differs from plant to plant, here it is taken to be about the same.
 */

export type CellKind = 'rbc' | 'plant'
export type Tonicity = 'hypo' | 'iso' | 'hyper'
export type CellState = 'lysis' | 'swollen' | 'normal' | 'crenated' | 'turgid' | 'flaccid' | 'plasmolysis'

/** NaCl (%) isotonic with the cell. */
export const ISO = 0.9
/** ± band (%) still treated as isotonic: the change in volume is too small to see. */
export const ISO_BAND = 0.05
/** Share of the cell volume that does not take part in osmosis (proteins, organelles…). */
export const INACTIVE: Record<CellKind, number> = { rbc: 0.4, plant: 0.2 }
/** A red blood cell bursts (hemolýza) when its volume grows beyond about 1,7 × (it has become a sphere). */
export const LYSIS_VOLUME = 1.7

export function tonicity(nacl: number): Tonicity {
  if (Math.abs(nacl - ISO) <= ISO_BAND + 1e-9) return 'iso'
  return nacl < ISO ? 'hypo' : 'hyper'
}

/**
 * Relative volume the osmotically active part of the cell would reach (Boyle–van 't
 * Hoff): V / V₀ = b + (1 − b) · c_iso / c, with b the inactive share. In pure water
 * it would grow without limit.
 */
export function relVolume(kind: CellKind, nacl: number): number {
  if (tonicity(nacl) === 'iso') return 1
  if (nacl <= 0) return Infinity
  const b = INACTIVE[kind]
  return b + ((1 - b) * ISO) / nacl
}

/**
 * What the cell does. A red blood cell has no wall: it swells and above LYSIS_VOLUME
 * bursts (around 0,4 % NaCl), or shrinks into a spiky shape (krenace). A plant cell's
 * wall stops it swelling (turgor), so it never bursts; in a hypertonic solution the
 * protoplast pulls away from the wall (plazmolýza). `volume` is what is drawn: the
 * cell (rbc) or the protoplast (plant), relative to the isotonic size.
 */
export function osmosis(kind: CellKind, nacl: number): { tonicity: Tonicity; state: CellState; volume: number; water: 'in' | 'none' | 'out' } {
  const t = tonicity(nacl)
  const v = relVolume(kind, nacl)
  const water = t === 'hypo' ? 'in' : t === 'hyper' ? 'out' : 'none'
  if (kind === 'rbc') {
    const state: CellState = t === 'iso' ? 'normal' : t === 'hyper' ? 'crenated' : v >= LYSIS_VOLUME ? 'lysis' : 'swollen'
    return { tonicity: t, state, volume: Math.min(v, LYSIS_VOLUME), water }
  }
  // plant: the wall lets the protoplast grow only a little (it presses on the wall)
  const state: CellState = t === 'iso' ? 'flaccid' : t === 'hypo' ? 'turgid' : 'plasmolysis'
  return { tonicity: t, state, volume: t === 'hypo' ? 1 : v, water }
}
