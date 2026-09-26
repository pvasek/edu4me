import type { Course, Question } from '../../core/types'
import { loadLevelPool } from '../../core/questionPool'
import { GAME_BY_ID } from '../registry'
import { levelNum } from '../types'

export type QfQuestion = Extract<Question, { kind: 'choice' | 'tf' }>

export interface QfItem {
  question: QfQuestion
  /** Topped up from an earlier level (shown with an "opakování" tag). */
  review: boolean
}

/** A level with fewer quiz questions than this is topped up from the previous level. */
export const MIN_POOL = 24

/** The level the round is played at, or undefined for "Vše" (also for levels the game does not list). */
export function playLevel(levelId?: string): string | undefined {
  const n = levelNum(levelId)
  return n !== undefined && n in GAME_BY_ID.quickfire.levels ? levelId : undefined
}

const usable = (q: Question): q is QfQuestion => (q.kind === 'choice' && q.options.length >= 2) || q.kind === 'tf'

/**
 * Question pool for one round: only the chosen level's choice/tf questions,
 * topped up with the previous level's ones when there are too few.
 * Without a level, every level of the course.
 */
export async function quickfirePool(course: Course, levelId?: string, rng: () => number = Math.random): Promise<QfItem[]> {
  const items = await loadLevelPool(course, playLevel(levelId), { kinds: ['choice', 'tf'], accept: usable, min: MIN_POOL, rng })
  return items.map((i) => ({ question: i.question as QfQuestion, review: i.review }))
}
