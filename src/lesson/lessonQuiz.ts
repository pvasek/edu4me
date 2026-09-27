import type { Lesson, Question } from '../core/types'

/** The end-of-lesson quiz has at least this many questions when enough checks exist… */
const QUIZ_MIN_CAP = 12
/** …and room for one check per section, but never more than this. */
const QUIZ_HARD_CAP = 14

const defaultCap = (lesson: Lesson) => Math.min(QUIZ_HARD_CAP, Math.max(QUIZ_MIN_CAP, lesson.quiz.length + lesson.sections.length))

/**
 * One quiz for the whole lesson: a few of the in-text checks (spread across
 * the sections, in reading order) followed by the lesson quiz itself.
 */
export function buildLessonQuiz(lesson: Lesson, max = defaultCap(lesson)): Question[] {
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
