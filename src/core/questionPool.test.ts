import { describe, expect, it } from 'vitest'
import { loadQuestionPool } from './questionPool'
import type { Course, Lesson, LevelContent, LevelOutline, Question } from './types'

const tf = (q: string): Question => ({ kind: 'tf', q, answer: true })
const choice = (q: string): Question => ({ kind: 'choice', q, options: ['a', 'b'], answer: 0 })
const num = (q: string): Question => ({ kind: 'number', q, answer: 1 })

const lesson = (id: string, quiz: Question[]): Lesson => ({
  id,
  title: id,
  goals: [],
  hook: '',
  sections: [],
  summary: [],
  quiz,
})

const level = (id: string, n: number, load: () => Promise<LevelContent>): LevelOutline => ({
  id,
  number: n,
  title: id,
  subtitle: '',
  stage: '',
  color: '#000',
  symbol: 'H',
  lessons: [],
  games: [],
  load,
})

const course: Course = {
  id: 'fake',
  title: 'Fake',
  tagline: '',
  color: '#000',
  available: true,
  levels: [
    level('a', 1, async () => ({
      lessons: { 'a-1': lesson('a-1', [tf('a1 tf'), choice('a1 choice')]), 'a-2': lesson('a-2', [num('a2 num')]) },
      boss: [tf('a boss')],
    })),
    level('b', 2, () => Promise.reject(new Error('not written yet'))),
    level('c', 3, async () => ({ lessons: { 'c-1': lesson('c-1', [choice('c1 choice')]) }, boss: [num('c boss')] })),
    level('d', 4, () => {
      throw new Error('sync failure')
    }),
  ],
}

describe('loadQuestionPool', () => {
  it('gathers everything from all loadable levels by default', async () => {
    const pool = await loadQuestionPool(course)
    expect(pool.map((p) => p.question.q)).toEqual(['a1 tf', 'a1 choice', 'a2 num', 'a boss', 'c1 choice', 'c boss'])
  })

  it('tags items with level and lesson ids (none for boss)', async () => {
    const pool = await loadQuestionPool(course)
    expect(pool[0]).toMatchObject({ levelId: 'a', lessonId: 'a-1' })
    expect(pool.find((p) => p.question.q === 'a boss')).toEqual({ question: tf('a boss'), levelId: 'a' })
  })

  it('respects upToLevel (inclusive) and skips failed levels', async () => {
    const pool = await loadQuestionPool(course, { upToLevel: 'b' })
    expect(new Set(pool.map((p) => p.levelId))).toEqual(new Set(['a']))
    const toC = await loadQuestionPool(course, { upToLevel: 'c' })
    expect(toC.some((p) => p.levelId === 'c')).toBe(true)
  })

  it('respects onlyLevel', async () => {
    const pool = await loadQuestionPool(course, { onlyLevel: 'c', upToLevel: 'a' })
    expect(pool.map((p) => p.question.q)).toEqual(['c1 choice', 'c boss'])
    expect(await loadQuestionPool(course, { onlyLevel: 'b' })).toEqual([])
  })

  it('filters by kinds', async () => {
    const pool = await loadQuestionPool(course, { kinds: ['tf', 'choice'] })
    expect(pool.every((p) => p.question.kind === 'tf' || p.question.kind === 'choice')).toBe(true)
    expect(pool).toHaveLength(4)
  })

  it('falls back to all levels for an unknown upToLevel', async () => {
    const pool = await loadQuestionPool(course, { upToLevel: 'zzz' })
    expect(pool).toHaveLength(6)
  })
})
