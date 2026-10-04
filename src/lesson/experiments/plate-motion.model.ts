/**
 * Plate boundaries in the `plate-motion` experiment (z3-1): how two plates move (apart,
 * together, sideways) and what crust meets at the boundary decide what forms there.
 *
 * - Apart (divergent): in the ocean a mid-ocean ridge with new oceanic crust; on a continent a
 *   rift valley (příkopová propadlina) that can open into a new ocean. Volcanoes, shallow quakes.
 * - Together (convergent):
 *   ocean–continent: the heavier oceanic plate sinks under the continent (subduction): a deep
 *   trench, a range of volcanoes on the continent, shallow to deep quakes (Andy);
 *   ocean–ocean: the older, heavier oceanic plate sinks: a trench and an island arc (Mariany);
 *   continent–continent: neither sinks (continental crust is too light), the crust crumples and
 *   thickens into fold mountains, quakes but hardly any volcanoes (Himálaj).
 * - Sideways (transform): a fault, crust neither forms nor disappears, frequent quakes,
 *   no volcanoes (San Andreas).
 * Plates move a few centimetres a year; at 5 cm a year that is 50 km per million years.
 */

export type Motion = 'od-sebe' | 'k-sobe' | 'podel'
export type Pair = 'oo' | 'op' | 'pp' | 'oba'

export const PAIRS: Record<Motion, { value: Pair; label: string }[]> = {
  'od-sebe': [
    { value: 'oo', label: 'v oceánu' },
    { value: 'pp', label: 'na pevnině' },
  ],
  'k-sobe': [
    { value: 'oo', label: 'oceán – oceán' },
    { value: 'op', label: 'oceán – pevnina' },
    { value: 'pp', label: 'pevnina – pevnina' },
  ],
  podel: [{ value: 'oba', label: 'v oceánu i na pevnině' }],
}

/** The pair actually shown: the chosen one if it exists for this motion, otherwise the first. */
export function pairFor(motion: Motion, pair: Pair): Pair {
  return PAIRS[motion].some((p) => p.value === pair) ? pair : PAIRS[motion][0].value
}

export interface Boundary {
  kind: string
  forms: string
  volcanoes: boolean
  crust: string
  example: string
}

export function boundary(motion: Motion, pair: Pair): Boundary {
  const p = pairFor(motion, pair)
  if (motion === 'od-sebe')
    return p === 'oo'
      ? { kind: 'rozbíhavá', forms: 'středooceánský hřbet', volcanoes: true, crust: 'nová oceánská kůra vzniká', example: 'Středoatlantský hřbet, Island' }
      : { kind: 'rozbíhavá', forms: 'příkopová propadlina', volcanoes: true, crust: 'pevnina se trhá, časem vznikne oceán', example: 'Východoafrická příkopová propadlina' }
  if (motion === 'k-sobe')
    return p === 'op'
      ? { kind: 'sbíhavá', forms: 'příkop a sopečné pohoří', volcanoes: true, crust: 'oceánská deska se noří (subdukce)', example: 'Andy a\u00a0Peruánsko-chilský příkop' }
      : p === 'oo'
        ? { kind: 'sbíhavá', forms: 'příkop a ostrovní oblouk', volcanoes: true, crust: 'starší oceánská deska se noří (subdukce)', example: 'Mariánský příkop a\u00a0Mariany' }
        : { kind: 'sbíhavá', forms: 'vrásové pohoří', volcanoes: false, crust: 'kůra se vrásní a ztlušťuje, nenoří se', example: 'Himálaj (Indie naráží do Eurasie)' }
  return { kind: 'transformní', forms: 'zlom', volcanoes: false, crust: 'kůra nevzniká ani nezaniká', example: 'zlom San Andreas v\u00a0Kalifornii' }
}

/** Plate speed used for the time slider (cm per year) and the shift after t million years (km). */
export const SPEED = 5
export const T_MAX = 10
export const shiftKm = (t: number) => t * SPEED * 10

/** Volcanoes above a subducting plate appear once it has sunk deep enough. */
export const VOLCANO_AT = 0.3
export const hasVolcanoes = (motion: Motion, pair: Pair, t: number) =>
  boundary(motion, pair).volcanoes && (motion !== 'k-sobe' || t / T_MAX >= VOLCANO_AT)

/** The challenge: volcanoes on a continent and a deep trench, as in the Andes. */
export const challengeMet = (motion: Motion, pair: Pair, t: number) =>
  motion === 'k-sobe' && pairFor(motion, pair) === 'op' && hasVolcanoes(motion, pair, t)
