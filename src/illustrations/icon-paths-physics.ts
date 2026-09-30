/**
 * Physics icons (24×24, engraving style, same helpers as icon-paths.ts).
 * PLACEHOLDERS: every id temporarily reuses the "question" drawing until the
 * real drawings are added.
 */
import type { IconDef } from './icon-paths'

const PLACEHOLDER: IconDef = ['M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 1.8v.5', 'M12 17.5v.01', { c: [12, 12, 9.5] }]

export const PHYSICS_ICON_IDS = [
  'ruler', 'clock', 'weight', 'vector', 'lever', 'pulley', 'spring', 'pendulum', 'gauge', 'ship', 'feather', 'parachute',
  'rocket', 'planet', 'orbit', 'satellite', 'galaxy', 'telescope', 'microscope', 'lens', 'mirror', 'prism', 'rainbow',
  'eye', 'camera', 'laser', 'wave', 'sound', 'ear', 'music', 'compass', 'coil', 'motor', 'socket', 'solar-panel',
  'wind-turbine', 'radiation',
] as const
export type PhysicsIcon = (typeof PHYSICS_ICON_IDS)[number]

export const PHYSICS_ICON_PATHS: Record<PhysicsIcon, IconDef> = Object.fromEntries(
  PHYSICS_ICON_IDS.map((id) => [id, PLACEHOLDER]),
) as Record<PhysicsIcon, IconDef>
