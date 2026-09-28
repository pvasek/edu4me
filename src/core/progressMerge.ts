/**
 * Schema migration and conflict-free merging of learner progress.
 *
 * Progress can exist in several places at once (this browser, another tab, a
 * backup file, Google Drive…). Merging never loses progress:
 * - lessons / level tests / games: keep the best result, the earliest completion;
 * - XP is a per-device counter (xpBy), so XP earned on two devices adds up;
 *   the total `xp` is always the sum;
 * - elements, badges: union (earliest badge date);
 * - streak: the one that was active most recently; best = max;
 * - settings: the most recently changed;
 * - `epoch` changes on "reset progress": a newer epoch wins entirely, so a reset
 *   on one device is not undone by old data from another.
 */
import type { ProgressState } from './progress'

type Lesson = ProgressState['lessons'][string]
type Level = ProgressState['levels'][string]
type Game = ProgressState['games'][string]

/** XP that existed before per-device counters: shared key, so it is never counted twice. */
export const LEGACY_DEVICE = 'legacy'

export const emptyProgress = (): ProgressState => ({
  version: 2,
  epoch: 0,
  xp: 0,
  xpBy: {},
  lessons: {},
  levels: {},
  games: {},
  elements: [],
  badges: {},
  perfectQuizzes: 0,
  streak: { current: 0, best: 0, lastDay: null },
  days: {},
  settings: { theme: 'system', name: '' },
  settingsAt: '',
})

export const sumXp = (xpBy: Record<string, number>) => Object.values(xpBy).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)

/** Accepts anything that looks like saved progress (v1 or v2) and returns a valid v2 state, or null. */
export function migrate(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== 'object') return null
  const d = raw as Record<string, unknown>
  if (d.version !== 1 && d.version !== 2) return null
  if (typeof d.xp !== 'number') return null
  const base = emptyProgress()
  const s = { ...base, ...(d as Partial<ProgressState>) } as ProgressState
  s.version = 2
  s.epoch = typeof d.epoch === 'number' ? d.epoch : 0
  s.xpBy = d.xpBy && typeof d.xpBy === 'object' ? { ...(d.xpBy as Record<string, number>) } : { [LEGACY_DEVICE]: d.xp as number }
  s.xp = sumXp(s.xpBy)
  s.settings = { ...base.settings, ...(s.settings ?? {}) }
  s.streak = { ...base.streak, ...(s.streak ?? {}) }
  s.settingsAt = typeof d.settingsAt === 'string' ? d.settingsAt : ''
  return s
}

const minIso = (a?: string, b?: string) => (!a ? b : !b ? a : a < b ? a : b)

function mergeMap<T>(a: Record<string, T>, b: Record<string, T>, f: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? f(out[k], v) : v
  return out
}

export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  if (a.epoch !== b.epoch) return a.epoch > b.epoch ? a : b

  const lessons = mergeMap<Lesson>(a.lessons, b.lessons, (x, y) => ({
    completedAt: minIso(x.completedAt, y.completedAt)!,
    best: Math.max(x.best, y.best),
    max: Math.max(x.max, y.max),
  }))
  const levels = mergeMap<Level>(a.levels, b.levels, (x, y) => ({
    passedAt: minIso(x.passedAt, y.passedAt)!,
    best: Math.max(x.best, y.best),
    max: Math.max(x.max, y.max),
  }))
  const games = mergeMap<Game>(a.games, b.games, (x, y) => ({
    best: Math.max(x.best, y.best),
    max: Math.max(x.max, y.max),
    plays: Math.max(x.plays, y.plays),
    stars: Math.max(x.stars, y.stars),
  }))
  const badges = mergeMap<string>(a.badges, b.badges, (x, y) => minIso(x, y)!)
  const xpBy = mergeMap<number>(a.xpBy, b.xpBy, Math.max)
  const days = mergeMap<number>(a.days, b.days, Math.max)
  const elements = [...a.elements, ...b.elements.filter((e) => !a.elements.includes(e))]

  const la = a.streak.lastDay ?? ''
  const lb = b.streak.lastDay ?? ''
  const recent = la > lb ? a.streak : lb > la ? b.streak : a.streak.current >= b.streak.current ? a.streak : b.streak
  const streak = { ...recent, best: Math.max(a.streak.best, b.streak.best, recent.current) }

  const newerSettings = (b.settingsAt ?? '') > (a.settingsAt ?? '') ? b : a

  return {
    version: 2,
    epoch: a.epoch,
    xpBy,
    xp: sumXp(xpBy),
    lessons,
    levels,
    games,
    elements,
    badges,
    perfectQuizzes: Math.max(a.perfectQuizzes, b.perfectQuizzes),
    streak,
    days,
    settings: { ...newerSettings.settings },
    settingsAt: newerSettings.settingsAt,
  }
}

/** Cheap structural equality for deciding whether a merge changed anything. */
export const sameProgress = (a: ProgressState, b: ProgressState) => JSON.stringify(a) === JSON.stringify(b)
