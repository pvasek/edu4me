import type { Course, LevelOutline } from '../core/types'
import { ElementTile } from './ElementTile'
import { EmblemTile } from './EmblemTile'

/** The level's emblem: an element tile in chemistry, a unit/constant medal elsewhere. */
export function LevelTile({
  course,
  level,
  size = 'md',
  hideName = false,
  dim = false,
}: {
  course: Course
  level: LevelOutline
  size?: 'sm' | 'md' | 'lg'
  hideName?: boolean
  dim?: boolean
}) {
  if (course.album?.kind === 'emblems')
    return <EmblemTile symbol={level.symbol} name={level.emblemName} color={level.color} number={level.number} size={size} hideName={hideName} dim={dim} />
  return <ElementTile symbol={level.symbol} size={size} hideName={hideName} dim={dim} />
}
