import { describe, expect, it } from 'vitest'
import { ROUND, playLevel, swipeDeck } from './pool'
import { fakeCourse } from '../quickfire/fake-course.test-util'

const lvl = (q: string) => q.match(/^\d/)?.[0]

describe('swipe level deck', () => {
  it('only true/false statements of the chosen level', async () => {
    const deck = await swipeDeck(fakeCourse(), 'l4')
    expect(deck).toHaveLength(ROUND)
    expect(deck.every((c) => c.question.kind === 'tf' && lvl(c.question.q) === '4' && !c.review)).toBe(true)
  })

  it('tops up a thin level from the previous one', async () => {
    const deck = await swipeDeck(fakeCourse(), 'l2')
    expect(deck).toHaveLength(ROUND)
    expect(deck.filter((c) => !c.review).map((c) => c.question.q).sort()).toEqual(['2tf0', '2tf1', '2tf2'])
    expect(deck.filter((c) => c.review).every((c) => lvl(c.question.q) === '1')).toBe(true)
  })

  it('mixes levels in free play', async () => {
    const levels = new Set<string | undefined>()
    for (let i = 0; i < 20; i++) for (const c of await swipeDeck(fakeCourse())) levels.add(lvl(c.question.q))
    expect(levels).toEqual(new Set(['1', '2', '4']))
    expect(playLevel('l9')).toBe('l9')
    expect(playLevel('xyz')).toBeUndefined()
  })
})
