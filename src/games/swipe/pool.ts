import type { Course, Question } from '../../core/types'
import { shuffle } from '../../core/check'
import { loadLevelPool } from '../../core/questionPool'
import { GAME_BY_ID } from '../registry'
import { levelNum } from '../types'

export type TfQuestion = Extract<Question, { kind: 'tf' }>

export interface SwipeCard {
  question: TfQuestion
  /** Topped up from an earlier level (shown with an "opakování" tag). */
  review: boolean
}

/** Statements per round. */
export const ROUND = 12

/** The level the round is played at, or undefined for "Vše" (also for levels the game does not list). */
export function playLevel(levelId?: string, courseId = 'chemie'): string | undefined {
  const n = levelNum(levelId)
  return n !== undefined && n in (GAME_BY_ID.swipe.courses[courseId] ?? {}) ? levelId : undefined
}

/**
 * Deck for one round: up to ROUND true/false statements from the chosen level
 * only; when the level has fewer, the previous level's statements fill the
 * deck and are marked as review. Without a level, a mix of all levels.
 */
export async function swipeDeck(course: Course, levelId?: string, rng: () => number = Math.random): Promise<SwipeCard[]> {
  const items = await loadLevelPool(course, playLevel(levelId, course.id), { kinds: ['tf'], min: ROUND, rng })
  const own = shuffle(items.filter((i) => !i.review), rng)
  const review = items.filter((i) => i.review)
  const picked = [...own, ...review].slice(0, ROUND)
  return shuffle(picked, rng).map((i) => ({ question: i.question as TfQuestion, review: i.review }))
}
