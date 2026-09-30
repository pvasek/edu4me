import { useSyncExternalStore } from 'react'
import { BADGES } from './badges'
import { emptyProgress, mergeProgress, migrate, sameProgress, sumXp } from './progressMerge'
import { getDeviceId, onOtherTabSave, readLocal, readMeta, requestPersist, writeLocal } from './persistence/local'

export { emptyProgress }

/**
 * Learner progress. Always saved in this browser (see ./persistence/local.ts);
 * optionally synced to a remote store (see ./persistence/sync.ts). Keys that refer
 * to course content are namespaced "courseId:id" so that future courses share one
 * store. Architecture and merge rules: spec/persistence.md.
 */
export interface ProgressState {
  version: 2
  /** changes on "reset progress"; a newer epoch wins when merging */
  epoch: number
  /** total XP = sum of xpBy (kept for convenience) */
  xp: number
  /** XP earned per device (a grow-only counter, so devices can be merged) */
  xpBy: Record<string, number>
  lessons: Record<string, { completedAt: string; best: number; max: number }>
  levels: Record<string, { passedAt: string; best: number; max: number }>
  games: Record<string, { best: number; max: number; plays: number; stars: number }>
  elements: string[]
  badges: Record<string, string>
  perfectQuizzes: number
  streak: { current: number; best: number; lastDay: string | null }
  days: Record<string, number>
  settings: { theme: 'system' | 'light' | 'dark'; name: string }
  /** when settings last changed (ISO), so the newest wins when merging */
  settingsAt: string
}

function load(): ProgressState {
  return migrate(readLocal()) ?? emptyProgress()
}

let state: ProgressState = typeof window === 'undefined' ? emptyProgress() : load()
const listeners = new Set<() => void>()

/** Called after every local change; the sync engine uses it to push to a remote store. */
let commitHook: (() => void) | null = null
export function setCommitHook(fn: (() => void) | null) {
  commitHook = fn
}

/** Events the UI can show as toasts (new badge, level up…). */
export type ProgressEvent = { type: 'badge'; id: string } | { type: 'xp'; amount: number }
const eventListeners = new Set<(e: ProgressEvent) => void>()
export function onProgressEvent(fn: (e: ProgressEvent) => void) {
  eventListeners.add(fn)
  return () => {
    eventListeners.delete(fn)
  }
}

function commit(next: ProgressState, events: ProgressEvent[] = [], opts: { fromSync?: boolean } = {}) {
  // award badges whose condition became true
  for (const b of BADGES) {
    if (!next.badges[b.id] && b.earned(next)) {
      next = { ...next, badges: { ...next.badges, [b.id]: new Date().toISOString() } }
      events.push({ type: 'badge', id: b.id })
    }
  }
  const firstLesson = Object.keys(state.lessons).length === 0 && Object.keys(next.lessons).length > 0
  state = next
  writeLocal(state)
  listeners.forEach((l) => l())
  events.forEach((e) => eventListeners.forEach((l) => l(e)))
  if (!opts.fromSync) commitHook?.()
  // once there is something worth keeping, ask the browser not to evict it
  if (firstLesson && !readMeta().persistAsked) void requestPersist()
}

/**
 * Merges progress from elsewhere (another tab, a backup file, a remote store) into
 * the current state. Never loses progress. Returns the merged state.
 */
export function mergeIn(other: unknown, opts: { fromSync?: boolean } = {}): ProgressState | null {
  const incoming = migrate(other)
  if (!incoming) return null
  const merged = mergeProgress(state, incoming)
  if (!sameProgress(merged, state)) commit(merged, [], opts)
  return state
}

// another tab saved: merge it in so the two tabs never overwrite each other
if (typeof window !== 'undefined') onOtherTabSave((data) => mergeIn(data, { fromSync: true }))

export function getProgress() {
  return state
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
    () => state,
  )
}

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return today(d)
}

/** Current streak, or 0 if the learner missed yesterday and today. */
export function liveStreak(p: ProgressState) {
  const { lastDay, current } = p.streak
  return lastDay === today() || lastDay === yesterday() ? current : 0
}

function withActivity(p: ProgressState, xp: number): ProgressState {
  const t = today()
  const dev = getDeviceId()
  const xpBy = { ...p.xpBy, [dev]: (p.xpBy[dev] ?? 0) + xp }
  let { current, best, lastDay } = p.streak
  if (lastDay !== t) {
    current = lastDay === yesterday() ? current + 1 : 1
    lastDay = t
    best = Math.max(best, current)
  }
  return {
    ...p,
    xpBy,
    xp: sumXp(xpBy),
    streak: { current, best, lastDay },
    days: { ...p.days, [t]: (p.days[t] ?? 0) + xp },
  }
}

const uniq = (a: string[]) => [...new Set(a)]

/** XP rules – see spec/gamification.md */
export const XP = {
  lessonFirst: 30,
  perCorrect: 5,
  lessonRepeat: 10,
  levelPass: 100,
  gameBase: 10,
  gameMax: 40,
}

export function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`
}

/** Returns XP earned. */
export function completeLesson(courseId: string, lessonId: string, score: number, max: number, elements: string[] = []) {
  const key = lessonKey(courseId, lessonId)
  const prev = state.lessons[key]
  const xp = prev ? XP.lessonRepeat + Math.max(0, score - prev.best) * XP.perCorrect : XP.lessonFirst + score * XP.perCorrect
  let next = withActivity(state, xp)
  next = {
    ...next,
    lessons: {
      ...next.lessons,
      [key]: { completedAt: prev?.completedAt ?? new Date().toISOString(), best: Math.max(prev?.best ?? 0, score), max },
    },
    elements: uniq([...next.elements, ...elements]),
    perfectQuizzes: next.perfectQuizzes + (score === max && max > 0 ? 1 : 0),
  }
  commit(next, [{ type: 'xp', amount: xp }])
  return xp
}

export const PASS_RATIO = 0.7

export function finishLevelTest(courseId: string, levelId: string, score: number, max: number, symbol: string) {
  const key = `${courseId}:${levelId}`
  const prev = state.levels[key]
  const passed = max > 0 && score / max >= PASS_RATIO
  const xp = passed && !prev ? XP.levelPass : passed ? XP.lessonRepeat : score * 2
  let next = withActivity(state, xp)
  if (passed) {
    next = {
      ...next,
      levels: { ...next.levels, [key]: { passedAt: prev?.passedAt ?? new Date().toISOString(), best: Math.max(prev?.best ?? 0, score), max } },
      elements: uniq([...next.elements, symbol]),
    }
  }
  commit(next, [{ type: 'xp', amount: xp }])
  return { xp, passed }
}

export function starsFor(score: number, max: number) {
  if (max <= 0 || score <= 0) return 0
  const r = score / max
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1
}

/** Progress key of a game in a course (chemistry keeps its original un-prefixed keys). */
export const gameKey = (courseId: string, gameId: string) => (courseId === 'chemie' ? gameId : `${courseId}:${gameId}`)

export function finishGame(gameId: string, score: number, max: number, collected: string[] = []) {
  const ratio = max > 0 ? Math.min(1, score / max) : 0
  const xp = Math.round(XP.gameBase + XP.gameMax * ratio)
  const prev = state.games[gameId]
  const stars = starsFor(score, max)
  let next = withActivity(state, xp)
  next = {
    ...next,
    games: {
      ...next.games,
      [gameId]: {
        best: Math.max(prev?.best ?? 0, score),
        max: Math.max(prev?.max ?? 0, max),
        plays: (prev?.plays ?? 0) + 1,
        stars: Math.max(prev?.stars ?? 0, stars),
      },
    },
    elements: uniq([...next.elements, ...collected]),
  }
  commit(next, [{ type: 'xp', amount: xp }])
  return { xp, stars }
}

export function setSettings(s: Partial<ProgressState['settings']>) {
  commit({ ...state, settings: { ...state.settings, ...s }, settingsAt: new Date().toISOString() })
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}

/** Loads a backup file. It is MERGED with the current progress, so nothing is lost. */
export function importProgress(json: string): boolean {
  try {
    return mergeIn(JSON.parse(json)) !== null
  } catch {
    return false
  }
}

/** Starts over. The new epoch makes the reset win over older copies (other devices, Drive). */
export function resetProgress() {
  commit({ ...emptyProgress(), epoch: Date.now(), settings: state.settings, settingsAt: state.settingsAt })
}

/** Player level from XP: each level needs 50 XP more than the previous one. */
export function rankFromXp(xp: number) {
  let lvl = 1
  let need = 100
  let left = xp
  while (left >= need) {
    left -= need
    lvl++
    need += 50
  }
  return { rank: lvl, into: left, need }
}

export const RANK_TITLES = ['Zvědavec', 'Pozorovatel', 'Laborant', 'Mladý chemik', 'Analytik', 'Syntetik', 'Badatel', 'Chemik', 'Vědec', 'Profesor', 'Nobelista']
export const rankTitle = (rank: number) => RANK_TITLES[Math.min(rank - 1, RANK_TITLES.length - 1)]
