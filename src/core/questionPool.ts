import type { Course, LevelOutline, Question } from './types'

export interface PoolItem {
  question: Question
  levelId: string
  /** Lesson the question comes from; undefined for boss (level test) questions. */
  lessonId?: string
}

export interface PoolOptions {
  /** Include levels up to and including this one (in course order). */
  upToLevel?: string
  /** Only this level (wins over `upToLevel`). */
  onlyLevel?: string
  /** Keep only these question kinds. */
  kinds?: Question['kind'][]
}

function pickLevels(course: Course, opts: PoolOptions): LevelOutline[] {
  if (opts.onlyLevel) return course.levels.filter((l) => l.id === opts.onlyLevel)
  if (opts.upToLevel) {
    const idx = course.levels.findIndex((l) => l.id === opts.upToLevel)
    if (idx >= 0) return course.levels.slice(0, idx + 1)
  }
  return course.levels
}

/**
 * Gathers lesson quiz questions and boss questions from a course's levels.
 * Levels whose content fails to load (or is malformed) are silently skipped,
 * so a game never crashes because one level file is missing.
 */
export async function loadQuestionPool(course: Course, opts: PoolOptions = {}): Promise<PoolItem[]> {
  const levels = pickLevels(course, opts)
  const kinds = opts.kinds && opts.kinds.length ? new Set(opts.kinds) : null
  const loaded = await Promise.allSettled(levels.map((l) => Promise.resolve().then(() => l.load())))
  const out: PoolItem[] = []
  loaded.forEach((res, i) => {
    if (res.status !== 'fulfilled' || !res.value) return
    const levelId = levels[i].id
    const content = res.value
    const keep = (q: Question | undefined): q is Question => !!q && typeof q === 'object' && (!kinds || kinds.has(q.kind))
    for (const [key, lesson] of Object.entries(content.lessons ?? {})) {
      if (!lesson || !Array.isArray(lesson.quiz)) continue
      const lessonId = lesson.id ?? key
      for (const q of lesson.quiz) if (keep(q)) out.push({ question: q, levelId, lessonId })
    }
    if (Array.isArray(content.boss)) for (const q of content.boss) if (keep(q)) out.push({ question: q, levelId })
  })
  return out
}
