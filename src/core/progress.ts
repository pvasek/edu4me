import { useSyncExternalStore } from 'react'
import { BADGES } from './badges'

/**
 * Learner progress, stored locally in the browser (no account needed).
 * Keys that refer to course content are namespaced "courseId:id" so that
 * future courses share one store.
 */
export interface ProgressState {
  version: 1
  xp: number
  lessons: Record<string, { completedAt: string; best: number; max: number }>
  levels: Record<string, { passedAt: string; best: number; max: number }>
  games: Record<string, { best: number; max: number; plays: number; stars: number }>
  elements: string[]
  badges: Record<string, string>
  perfectQuizzes: number
  streak: { current: number; best: number; lastDay: string | null }
  days: Record<string, number>
  settings: { theme: 'system' | 'light' | 'dark'; name: string }
}

const KEY = 'edu4me-progress-v1'

export const emptyProgress = (): ProgressState => ({
  version: 1,
  xp: 0,
  lessons: {},
  levels: {},
  games: {},
  elements: [],
  badges: {},
  perfectQuizzes: 0,
  streak: { current: 0, best: 0, lastDay: null },
  days: {},
  settings: { theme: 'system', name: '' },
})

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    return { ...emptyProgress(), ...JSON.parse(raw) }
  } catch {
    return emptyProgress()
  }
}

let state: ProgressState = typeof window === 'undefined' ? emptyProgress() : load()
const listeners = new Set<() => void>()

/** Events the UI can show as toasts (new badge, level up…). */
export type ProgressEvent = { type: 'badge'; id: string } | { type: 'xp'; amount: number }
const eventListeners = new Set<(e: ProgressEvent) => void>()
export function onProgressEvent(fn: (e: ProgressEvent) => void) {
  eventListeners.add(fn)
  return () => {
    eventListeners.delete(fn)
  }
}

function commit(next: ProgressState, events: ProgressEvent[] = []) {
  // award badges whose condition became true
  for (const b of BADGES) {
    if (!next.badges[b.id] && b.earned(next)) {
      next = { ...next, badges: { ...next.badges, [b.id]: new Date().toISOString() } }
      events.push({ type: 'badge', id: b.id })
    }
  }
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked – progress stays in memory */
  }
  listeners.forEach((l) => l())
  events.forEach((e) => eventListeners.forEach((l) => l(e)))
}

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
  let { current, best, lastDay } = p.streak
  if (lastDay !== t) {
    current = lastDay === yesterday() ? current + 1 : 1
    lastDay = t
    best = Math.max(best, current)
  }
  return {
    ...p,
    xp: p.xp + xp,
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
  commit({ ...state, settings: { ...state.settings, ...s } })
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}

export function importProgress(json: string): boolean {
  try {
    const data = JSON.parse(json)
    if (data?.version !== 1 || typeof data.xp !== 'number') return false
    commit({ ...emptyProgress(), ...data })
    return true
  } catch {
    return false
  }
}

export function resetProgress() {
  commit({ ...emptyProgress(), settings: state.settings })
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
