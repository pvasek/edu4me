import { describe, expect, it } from 'vitest'
import { emptyProgress, LEGACY_DEVICE, mergeProgress, migrate } from './progressMerge'
import type { ProgressState } from './progress'

const make = (patch: Partial<ProgressState>): ProgressState => ({ ...emptyProgress(), ...patch })

describe('migrate', () => {
  it('turns v1 data into v2, keeping old XP under the shared legacy key', () => {
    const v1 = { version: 1, xp: 120, lessons: { 'chemie:l1-1': { completedAt: '2026-01-01', best: 7, max: 8 } }, settings: { theme: 'dark' } }
    const s = migrate(v1)!
    expect(s.version).toBe(2)
    expect(s.xpBy).toEqual({ [LEGACY_DEVICE]: 120 })
    expect(s.xp).toBe(120)
    expect(s.lessons['chemie:l1-1'].best).toBe(7)
    expect(s.settings).toEqual({ theme: 'dark', name: '' })
    expect(s.epoch).toBe(0)
  })
  it('rejects things that are not progress', () => {
    expect(migrate(null)).toBeNull()
    expect(migrate({ version: 9, xp: 1 })).toBeNull()
    expect(migrate({ version: 2 })).toBeNull()
    expect(migrate('x')).toBeNull()
  })
})

describe('mergeProgress', () => {
  const a = make({
    xpBy: { dA: 100, legacy: 50 },
    xp: 150,
    lessons: {
      'chemie:l1-1': { completedAt: '2026-02-01', best: 5, max: 8 },
      'chemie:l1-2': { completedAt: '2026-02-02', best: 8, max: 8 },
    },
    games: { quickfire: { best: 10, max: 12, plays: 3, stars: 2 } },
    elements: ['H', 'O'],
    badges: { 'first-lesson': '2026-02-01' },
    streak: { current: 4, best: 6, lastDay: '2026-02-10' },
    days: { '2026-02-10': 40 },
    settings: { theme: 'dark', name: 'Eva' },
    settingsAt: '2026-02-05',
    perfectQuizzes: 1,
  })
  const b = make({
    xpBy: { dB: 70, legacy: 50 },
    xp: 120,
    lessons: {
      'chemie:l1-1': { completedAt: '2026-01-15', best: 7, max: 8 },
      'chemie:l2-1': { completedAt: '2026-02-03', best: 6, max: 8 },
    },
    games: { quickfire: { best: 8, max: 12, plays: 5, stars: 1 } },
    elements: ['O', 'He'],
    badges: { 'first-lesson': '2026-01-15', 'lessons-10': '2026-02-09' },
    streak: { current: 2, best: 3, lastDay: '2026-02-11' },
    days: { '2026-02-10': 25, '2026-02-11': 30 },
    settings: { theme: 'light', name: 'Eva K.' },
    settingsAt: '2026-02-08',
    perfectQuizzes: 3,
  })
  const m = mergeProgress(a, b)

  it('keeps the best result and the earliest completion of every lesson', () => {
    expect(m.lessons['chemie:l1-1']).toEqual({ completedAt: '2026-01-15', best: 7, max: 8 })
    expect(Object.keys(m.lessons).sort()).toEqual(['chemie:l1-1', 'chemie:l1-2', 'chemie:l2-1'])
  })
  it('adds XP from different devices but never counts the same device twice', () => {
    expect(m.xpBy).toEqual({ dA: 100, dB: 70, legacy: 50 })
    expect(m.xp).toBe(220)
  })
  it('merges games, elements, badges, days and counters', () => {
    expect(m.games.quickfire).toEqual({ best: 10, max: 12, plays: 5, stars: 2 })
    expect(m.elements).toEqual(['H', 'O', 'He'])
    expect(m.badges).toEqual({ 'first-lesson': '2026-01-15', 'lessons-10': '2026-02-09' })
    expect(m.days).toEqual({ '2026-02-10': 40, '2026-02-11': 30 })
    expect(m.perfectQuizzes).toBe(3)
  })
  it('takes the most recently active streak and the best best', () => {
    expect(m.streak).toEqual({ current: 2, best: 6, lastDay: '2026-02-11' })
  })
  it('takes the most recently changed settings', () => {
    expect(m.settings).toEqual({ theme: 'light', name: 'Eva K.' })
  })
  it('is commutative and idempotent', () => {
    expect(mergeProgress(b, a)).toEqual({ ...m, elements: ['O', 'He', 'H'] })
    expect(mergeProgress(m, m)).toEqual(m)
    expect(mergeProgress(m, a)).toEqual(m)
  })
  it('lets a newer reset (epoch) win completely', () => {
    const reset = make({ epoch: 5, settings: { theme: 'dark', name: '' } })
    expect(mergeProgress(a, reset)).toBe(reset)
    expect(mergeProgress(reset, a)).toBe(reset)
  })
})
