import { describe, expect, it } from 'vitest'
import { COURSES } from './registry'
import { checkFlow } from './validate'

/**
 * Teaching thread (spec/content-guidelines.md): every section opens with a
 * paragraph and no two content blocks follow each other without a bridging
 * paragraph. Check one level with: npx vitest run src/core/flow.test.ts -t "fyzika l3\."
 */
describe('teaching thread', () => {
  // every course with an outline, published or still being built
  for (const course of COURSES.filter((c) => c.levels.length))
    for (const level of course.levels)
      it(`${course.id} ${level.id}.`, async () => {
        const content = await level.load()
        expect(Object.values(content.lessons).flatMap(checkFlow)).toEqual([])
      })
})
