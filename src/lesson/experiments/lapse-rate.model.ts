/**
 * Model of the `lapse-rate` experiment (z4-3): climbing from the lowland by the
 * Labe (200 m n. m.) to Sněžka (1 603 m n. m.) in the Krkonoše.
 *
 * - Temperature of the surrounding air falls with altitude by the average
 *   (environmental) lapse rate ≈ 0,65 °C per 100 m. (A rising parcel of dry air
 *   cools faster, 1 °C per 100 m – that is a different thing and is not shown.)
 * - Vegetation belts (vegetační stupně) of the Krkonoše, simplified after the
 *   KRNAP zonation: submontánní 400–800 m, montánní 800–1 200 m, subalpínský
 *   1 200–1 450 m (upper tree line ≈ 1 200–1 300 m), alpínský above 1 450 m;
 *   below 400 m the lowland and hills with broad-leaved woods.
 */

export const LAPSE = 0.65 / 100
export const BASE_ALT = 200
export const TOP_ALT = 1603

export const tempAt = (base: number, alt: number) => base - (alt - BASE_ALT) * LAPSE

export interface Belt {
  id: string
  name: string
  from: number
  to: number
  trees: string
}
export const BELTS: Belt[] = [
  { id: 'listnate', name: 'listnaté lesy', from: 0, to: 400, trees: 'dub, buk, lípa, mezi nimi pole' },
  { id: 'smisene', name: 'smíšené lesy', from: 400, to: 800, trees: 'buk, jedle, smrk' },
  { id: 'smrkove', name: 'smrkové lesy', from: 800, to: 1200, trees: 'smrk' },
  { id: 'kosodrevina', name: 'kosodřevina', from: 1200, to: 1450, trees: 'borovice kleč, horské louky' },
  { id: 'hole', name: 'alpínské hole', from: 1450, to: 2000, trees: 'nízké trávy, mechy, lišejníky, sutě' },
]
export const beltAt = (alt: number): Belt => BELTS.find((b) => alt < b.to) ?? BELTS[BELTS.length - 1]

/** The challenge: 8 °C at the foot of the mountains and the climber where it freezes (0 °C ± 0,1). */
export const CH_BASE = 8
export const challengeMet = (base: number, alt: number) => base === CH_BASE && Math.abs(tempAt(base, alt)) <= 0.1
