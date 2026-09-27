import { describe, expect, it } from 'vitest'
import { chemie } from '../courses/chemie'
import { buildLessonQuiz } from './lessonQuiz'

describe('buildLessonQuiz', () => {
  it('keeps the whole lesson quiz, adds checks in reading order and stays within 12', async () => {
    for (const lv of chemie.levels) {
      const content = await lv.load()
      for (const lesson of Object.values(content.lessons)) {
        const quiz = buildLessonQuiz(lesson)
        expect(quiz.length).toBeLessThanOrEqual(12)
        expect(quiz.slice(-lesson.quiz.length)).toEqual(lesson.quiz)
        const checks = lesson.sections.flatMap((s) => s.blocks.flatMap((b) => (b.type === 'check' ? [b.question] : [])))
        expect(quiz.length).toBe(Math.min(12, lesson.quiz.length + checks.length))
        // the first check of each section is used before any second one
        const firsts = lesson.sections.map((s) => s.blocks.find((b) => b.type === 'check')).filter(Boolean)
        const used = quiz.length - lesson.quiz.length
        if (used >= firsts.length) for (const b of firsts) expect(quiz).toContain(b!.type === 'check' && b!.question)
      }
    }
  })
})
