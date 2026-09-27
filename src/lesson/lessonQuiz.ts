import type { Lesson, Question } from '../core/types'

/** Longest the single end-of-lesson quiz gets. */
const QUIZ_MAX = 12

/**
 * One quiz for the whole lesson: a few of the in-text checks (spread across
 * the sections, in reading order) followed by the lesson quiz itself.
 */
export function buildLessonQuiz(lesson: Lesson, max = QUIZ_MAX): Question[] {
  const perSection = lesson.sections.map((s) => s.blocks.flatMap((b) => (b.type === 'check' ? [b.question] : [])))
  const room = Math.max(0, max - lesson.quiz.length)
  const picked: Question[][] = perSection.map(() => [])
  let left = room
  for (let round = 0; left > 0; round++) {
    let any = false
    for (let si = 0; si < perSection.length && left > 0; si++) {
      const q = perSection[si][round]
      if (q) {
        picked[si].push(q)
        left--
        any = true
      }
    }
    if (!any) break
  }
  return [...picked.flat(), ...lesson.quiz]
}
