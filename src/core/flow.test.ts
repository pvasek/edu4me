import { describe, expect, it } from 'vitest'
import { COURSES } from './registry'
import { checkFlow } from './validate'

/**
 * Teaching thread (spec/content-guidelines.md): lessons listed here must pass
 * checkFlow. Once every lesson is rewritten, this list goes away and the check
 * applies to all lessons.
 */
const REWRITTEN = new Set(['fyzika:f2-3'])

describe('teaching thread', () => {
  for (const course of COURSES.filter((c) => c.available))
    for (const level of course.levels)
      it(`${course.id} ${level.id}`, async () => {
        const content = await level.load()
        const errors = Object.values(content.lessons)
          .filter((l) => REWRITTEN.has(`${course.id}:${l.id}`))
          .flatMap(checkFlow)
        expect(errors).toEqual([])
      })
})
