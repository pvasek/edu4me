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

export interface LevelPoolItem extends PoolItem {
  /** True when the item tops up a thin level from an earlier level ("opakování"). */
  review: boolean
}

export interface LevelPoolOptions {
  /** Keep only these question kinds. */
  kinds?: Question['kind'][]
  /** Extra filter applied before counting (e.g. "choice with at least 2 options"). */
  accept?: (q: Question) => boolean
  /** Minimum pool size; below it, earlier levels top the pool up (marked `review`). */
  min?: number
  /** Random source for picking the top-up questions. */
  rng?: () => number
}

/**
 * Questions for one level of a game. With a known `levelId` only that level's
 * questions are used; if there are fewer than `min`, questions from the
 * previous level (then the one before, …) are added as review items until
 * `min` is reached. Without a level, or with an id the course does not know,
 * every level is used and nothing is marked as review.
 */
export async function loadLevelPool(course: Course, levelId: string | undefined, opts: LevelPoolOptions = {}): Promise<LevelPoolItem[]> {
  const { kinds, accept = () => true, min = 0, rng = Math.random } = opts
  const idx = levelId ? course.levels.findIndex((l) => l.id === levelId) : -1
  const load = async (o: PoolOptions) => (await loadQuestionPool(course, { ...o, kinds })).filter((p) => accept(p.question))
  if (idx < 0) return (await load({})).map((p) => ({ ...p, review: false }))
  const out: LevelPoolItem[] = (await load({ onlyLevel: levelId })).map((p) => ({ ...p, review: false }))
  for (let i = idx - 1; i >= 0 && out.length < min; i--) {
    const earlier = await load({ onlyLevel: course.levels[i].id })
    // Random pick without replacement (Fisher–Yates on a copy).
    for (let j = earlier.length - 1; j > 0; j--) {
      const k = Math.floor(rng() * (j + 1))
      ;[earlier[j], earlier[k]] = [earlier[k], earlier[j]]
    }
    out.push(...earlier.slice(0, min - out.length).map((p) => ({ ...p, review: true })))
  }
  return out
}
