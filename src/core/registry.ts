import type { Course } from './types'
import { chemie } from '../courses/chemie'

/**
 * All courses. To add a course: create src/courses/<id>/index.ts exporting a
 * Course, add it here, and write its spec in spec/courses/<id>/.
 */
export const COURSES: Course[] = [
  chemie,
  { id: 'fyzika', title: 'Fyzika', tagline: 'Síly, energie, elektřina a vesmír.', color: '#4dabf7', available: false, levels: [] },
  { id: 'biologie', title: 'Biologie', tagline: 'Od buňky po ekosystémy.', color: '#51cf66', available: false, levels: [] },
  { id: 'matematika', title: 'Matematika', tagline: 'Čísla, funkce a geometrie hravě.', color: '#b197fc', available: false, levels: [] },
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
