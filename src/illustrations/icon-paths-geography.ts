/**
 * Geography icons (24×24, engraving style, same conventions as icon-paths.ts).
 * Placeholders until the icon agent draws them.
 *
 * The small shape helpers are re-declared here instead of imported: icon-paths.ts
 * imports this module at load time, so a runtime import back would be a cycle.
 * Only types are imported from icon-paths.ts.
 */
import type { IconDef, IconShape } from './icon-paths'
import type { ChemIcon } from './catalog'

const circ = (x: number, y: number, r: number, w?: number): IconShape => ({ c: [x, y, r], w })

export type GeographyIcon = Extract<ChemIcon, 'globe' | 'map' | 'pin' | 'signpost' | 'layers' | 'moon' | 'calendar' | 'quake' | 'canyon' | 'cave' | 'river' | 'glacier' | 'cliff' | 'dune' | 'tornado' | 'snowflake' | 'island' | 'people' | 'house' | 'city' | 'flag' | 'border' | 'wheat' | 'tractor' | 'pickaxe' | 'container' | 'train' | 'plane' | 'suitcase' | 'handshake' | 'speech' | 'castle' | 'tent' | 'crown' | 'shield' | 'palm' | 'penguin' | 'binoculars' | 'clipboard' | 'dam' | 'hourglass' | 'footprints'>

export const GEOGRAPHY_ICON_PATHS: Record<GeographyIcon, IconDef> = {
  globe: [circ(12, 12, 8)],
  map: [circ(12, 12, 8)],
  pin: [circ(12, 12, 8)],
  signpost: [circ(12, 12, 8)],
  layers: [circ(12, 12, 8)],
  moon: [circ(12, 12, 8)],
  calendar: [circ(12, 12, 8)],
  quake: [circ(12, 12, 8)],
  canyon: [circ(12, 12, 8)],
  cave: [circ(12, 12, 8)],
  river: [circ(12, 12, 8)],
  glacier: [circ(12, 12, 8)],
  cliff: [circ(12, 12, 8)],
  dune: [circ(12, 12, 8)],
  tornado: [circ(12, 12, 8)],
  snowflake: [circ(12, 12, 8)],
  island: [circ(12, 12, 8)],
  people: [circ(12, 12, 8)],
  house: [circ(12, 12, 8)],
  city: [circ(12, 12, 8)],
  flag: [circ(12, 12, 8)],
  border: [circ(12, 12, 8)],
  wheat: [circ(12, 12, 8)],
  tractor: [circ(12, 12, 8)],
  pickaxe: [circ(12, 12, 8)],
  container: [circ(12, 12, 8)],
  train: [circ(12, 12, 8)],
  plane: [circ(12, 12, 8)],
  suitcase: [circ(12, 12, 8)],
  handshake: [circ(12, 12, 8)],
  speech: [circ(12, 12, 8)],
  castle: [circ(12, 12, 8)],
  tent: [circ(12, 12, 8)],
  crown: [circ(12, 12, 8)],
  shield: [circ(12, 12, 8)],
  palm: [circ(12, 12, 8)],
  penguin: [circ(12, 12, 8)],
  binoculars: [circ(12, 12, 8)],
  clipboard: [circ(12, 12, 8)],
  dam: [circ(12, 12, 8)],
  hourglass: [circ(12, 12, 8)],
  footprints: [circ(12, 12, 8)],
}
