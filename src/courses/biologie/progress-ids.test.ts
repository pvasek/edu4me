import { describe, expect, it } from 'vitest'
import { biologie } from './index'
import { gamesForCourse } from '../../games/registry'
import saved from './progress-ids.json'

/**
 * Saved progress refers to these ids ("biologie:b2-3", "biologie:l4", "biologie:<game id>").
 * Renaming or removing one silently orphans learners' progress, so:
 * - an id in progress-ids.json must never disappear;
 * - a new id must be added to progress-ids.json deliberately.
 */
describe('progress ids are stable', () => {
  const now: Record<'levels' | 'lessons' | 'games', string[]> = {
    levels: biologie.levels.map((l) => l.id),
    lessons: biologie.levels.flatMap((l) => l.lessons.map((x) => x.id)),
    games: gamesForCourse('biologie').map((g) => g.id),
  }
  for (const kind of ['levels', 'lessons', 'games'] as const) {
    it(`no ${kind} id was removed or renamed`, () => {
      const missing = saved[kind].filter((id) => !now[kind].includes(id))
      expect(missing, `These ids are gone, learners would lose progress: ${missing.join(', ')}`).toEqual([])
    })
    it(`every ${kind} id is registered in progress-ids.json`, () => {
      const unknown = now[kind].filter((id) => !saved[kind].includes(id))
      expect(unknown, `Add these new ids to src/courses/biologie/progress-ids.json: ${unknown.join(', ')}`).toEqual([])
    })
  }
})
