import type { Course, LevelOutline } from './types'
import { chemie } from '../courses/chemie'
import { fyzika } from '../courses/fyzika'
import { biologie } from '../courses/biologie'
import { BY_SYMBOL } from '../courses/chemie/data/elements'

/**
 * All courses. To add a course: create src/courses/<id>/index.ts exporting a
 * Course, add it here, and write its spec in spec/courses/<id>/.
 */
export const COURSES: Course[] = [
  chemie,
  fyzika,
  biologie,
  { id: 'matematika', title: 'Matematika', tagline: 'Čísla, funkce a geometrie hravě.', color: '#7a5290', available: false, levels: [] },
]

export const courseById = (id: string | undefined) => COURSES.find((c) => c.id === id && c.available)

export function findLevel(course: Course, levelId: string | undefined) {
  return course.levels.find((l) => l.id === levelId)
}

/** Next lesson the learner has not finished, in course order. */
export function nextLesson(course: Course, done: Record<string, unknown>) {
  for (const level of course.levels)
    for (const lesson of level.lessons) if (!done[`${course.id}:${lesson.id}`]) return { level, lesson }
  return null
}

/** Id stored in progress.elements for a level's emblem: the element symbol in chemistry, "course:symbol" elsewhere. */
export const albumItemId = (course: Course, symbol: string) => (course.album?.kind === 'emblems' ? `${course.id}:${symbol}` : symbol)

/** Human name of a level's emblem ("newton", "Kyslík"). */
export const emblemName = (level: LevelOutline) => level.emblemName ?? BY_SYMBOL[level.symbol]?.name ?? level.symbol

/** A level's place in the course overview (the overview scrolls to it). */
export const levelHref = (courseId: string, levelId: string) => `/c/${courseId}?uroven=${levelId}`
