/**
 * Biology icons (24×24, engraving style, same conventions as icon-paths.ts).
 * Placeholders until drawn; only types are imported from icon-paths.ts (no cycle).
 */
import type { IconDef } from './icon-paths'

export const BIOLOGY_ICON_IDS = [
  'virus',
  'bacteria',
  'amoeba',
  'mushroom',
  'lichen',
  'moss',
  'fern',
  'root',
  'flower',
  'seed',
  'sponge',
  'jellyfish',
  'worm',
  'snail',
  'spider',
  'tick',
  'bee',
  'butterfly',
  'starfish',
  'frog',
  'lizard',
  'bird',
  'mouse',
  'deer',
  'paw',
  'skeleton',
  'tooth',
  'kidney',
  'brain',
  'neuron',
  'baby',
  'first-aid',
  'chromosome',
  'pea',
  'twins',
  'fossil',
  'soil',
  'food-chain',
  'forest',
  'pond',
  'family-tree',
  'cell-division',
  'gene-scissors',
] as const
export type BiologyIcon = (typeof BIOLOGY_ICON_IDS)[number]

const PLACEHOLDER: IconDef = [{ c: [12, 12, 8] }, { d: 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14' }, { c: [12, 17, 0.9], f: 'solid' }]

export const BIOLOGY_ICON_PATHS = Object.fromEntries(BIOLOGY_ICON_IDS.map((id) => [id, PLACEHOLDER])) as Record<BiologyIcon, IconDef>
