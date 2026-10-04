import type { GameId } from '../core/types'

export interface GameResult {
  /** Points the learner scored in this round. */
  score: number
  /** Maximum possible points (used for the star rating: >=90 % 3 stars, >=60 % 2, >0 1). */
  max: number
  /** Element symbols the learner "collected" (added to the sticker album). */
  collected?: string[]
}

export interface GameProps {
  /** Course the game was opened from. */
  courseId: string
  /** Level the game was opened from, if any (games may tune difficulty/content to it). */
  levelId?: string
  /** Call exactly once when a round ends. The shell shows results, awards XP and offers replay. */
  onFinish: (result: GameResult) => void
}

export interface GameMeta {
  id: GameId
  title: string
  /** One sentence, Czech, shown on the game card. */
  blurb: string
  /** Skill family, used for grouping and colour. */
  kind: 'periodic' | 'build' | 'quiz' | 'lab' | 'motion' | 'energy' | 'circuit' | 'optics' | 'map'
  /**
   * Courses the game belongs to → levels (by number) it supports there, each
   * with a short Czech description of what it trains at that level. Every
   * listed level has its own content set in the game (see
   * spec/courses/<course>/games.md). Playing without a level ("Vše") mixes them.
   */
  courses: Partial<Record<string, Partial<Record<number, string>>>>
}

/** Level number from a level id like "l5"; undefined for free play. */
export const levelNum = (levelId?: string) => (levelId ? Number(levelId.replace(/\D/g, '')) || undefined : undefined)
