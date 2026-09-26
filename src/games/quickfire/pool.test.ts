import { describe, expect, it } from 'vitest'
import { MIN_POOL, playLevel, quickfirePool } from './pool'
import { fakeCourse } from './fake-course.test-util'

const lvl = (q: string) => q.match(/^\d/)?.[0]

describe('quickfire level pool', () => {
  it('uses only the chosen level when it has enough questions', async () => {
    const pool = await quickfirePool(fakeCourse(), 'l4')
    expect(pool).toHaveLength(60)
    expect(pool.every((p) => lvl(p.question.q) === '4' && !p.review)).toBe(true)
  })

  it('skips number questions', async () => {
    const pool = await quickfirePool(fakeCourse(), 'l1')
    expect(pool).toHaveLength(40)
    expect(pool.every((p) => p.question.kind === 'tf' || p.question.kind === 'choice')).toBe(true)
  })

  it('tops a thin level up with the previous level, marked as review', async () => {
    const pool = await quickfirePool(fakeCourse(), 'l2')
    expect(pool).toHaveLength(MIN_POOL)
    const own = pool.filter((p) => !p.review)
    expect(own.map((p) => p.question.q).sort()).toEqual(['2boss', '2ch0', '2tf0', '2tf1', '2tf2'])
    const review = pool.filter((p) => p.review)
    expect(review).toHaveLength(MIN_POOL - 5)
    expect(review.every((p) => lvl(p.question.q) === '1')).toBe(true)
  })

  it('walks further back past a level that fails to load', async () => {
    const pool = await quickfirePool(fakeCourse(), 'l3')
    expect(pool).toHaveLength(MIN_POOL)
    expect(pool.every((p) => p.review)).toBe(true)
    expect(pool.filter((p) => lvl(p.question.q) === '2')).toHaveLength(5)
    expect(pool.some((p) => lvl(p.question.q) === '4')).toBe(false)
  })

  it('mixes all levels without a level (and for unknown levels)', async () => {
    for (const id of [undefined, 'l77']) {
      const pool = await quickfirePool(fakeCourse(), id)
      expect(pool).toHaveLength(40 + 5 + 60)
      expect(pool.some((p) => p.review)).toBe(false)
    }
    expect(playLevel(undefined)).toBeUndefined()
    expect(playLevel('l10')).toBeUndefined()
    expect(playLevel('l5')).toBe('l5')
  })
})
