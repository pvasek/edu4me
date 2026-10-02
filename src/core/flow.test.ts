import { describe, expect, it } from 'vitest'
import { COURSES } from './registry'
import { checkFlow } from './validate'

/**
 * Teaching thread (spec/content-guidelines.md): lessons must pass checkFlow.
 * While the rewrite is in progress only REWRITTEN lessons and levels are enforced;
 * FLOW_ALL=1 enforces every lesson (use it to check a level you rewrote:
 * FLOW_ALL=1 npx vitest run src/core/flow.test.ts -t "fyzika l3\.").
 */
const REWRITTEN = new Set(['fyzika:f2-3'])
const REWRITTEN_LEVELS = new Set(['chemie:l1', 'chemie:l2', 'chemie:l3', 'chemie:l4', 'chemie:l5', 'chemie:l7', 'chemie:l8', 'chemie:l9', 'fyzika:l1', 'fyzika:l2', 'fyzika:l3', 'fyzika:l4', 'fyzika:l5', 'fyzika:l6', 'fyzika:l7', 'fyzika:l8', 'fyzika:l9', 'fyzika:l10', 'fyzika:l11', 'fyzika:l12'])
const ALL = Boolean((globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.FLOW_ALL)

describe('teaching thread', () => {
  for (const course of COURSES.filter((c) => c.available))
    for (const level of course.levels)
      it(`${course.id} ${level.id}.`, async () => {
        const content = await level.load()
        const errors = Object.values(content.lessons)
          .filter((l) => ALL || REWRITTEN_LEVELS.has(`${course.id}:${level.id}`) || REWRITTEN.has(`${course.id}:${l.id}`))
          .flatMap(checkFlow)
        expect(errors).toEqual([])
      })
})
