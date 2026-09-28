import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { memoryStorage } from './memoryStorage'
import type { RemoteStorage } from './types'
import { NeedsAuthError } from './types'

/** A remote that stores one blob in memory. */
function memoryRemote(initial: unknown = null, opts: { needsAuth?: boolean } = {}) {
  let blob = initial
  let authed = !opts.needsAuth
  const r: RemoteStorage & { saves: number; blob: () => unknown; authorized: () => void } = {
    id: 'mem',
    label: 'Paměť',
    configured: true,
    saves: 0,
    async authorize(interactive) {
      if (!authed && !interactive) throw new NeedsAuthError()
      authed = true
    },
    async load() {
      return blob
    },
    async save(d) {
      blob = JSON.parse(JSON.stringify(d))
      r.saves++
    },
    async disconnect() {},
    blob: () => blob,
    authorized: () => (authed = true),
  }
  return r
}

async function fresh() {
  vi.resetModules()
  vi.stubGlobal('localStorage', memoryStorage())
  const progress = await import('../progress')
  const sync = await import('./sync')
  return { progress, sync }
}

describe('sync engine', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('restores a saved connection and merges the remote copy into local progress', async () => {
    const { progress, sync } = await fresh()
    const remote = memoryRemote({ version: 2, epoch: 0, xp: 40, xpBy: { other: 40 }, lessons: { 'chemie:l1-1': { completedAt: '2026-01-01', best: 8, max: 8 } } })
    localStorage.setItem('edu4me-sync', JSON.stringify({ provider: 'mem' }))
    sync.initSync({ mem: () => remote })
    await vi.runAllTimersAsync()
    expect(progress.getProgress().lessons['chemie:l1-1'].best).toBe(8)
    expect(progress.getProgress().xp).toBe(40)
    expect(sync.getSyncState().status).toBe('idle')
    expect(remote.saves).toBe(1)
    sync.__resetSyncForTests()
  })

  it('pushes local changes a few seconds after they happen, merged with the remote', async () => {
    const { progress, sync } = await fresh()
    const remote = memoryRemote(null)
    localStorage.setItem('edu4me-sync', JSON.stringify({ provider: 'mem' }))
    sync.initSync({ mem: () => remote })
    await vi.runAllTimersAsync()
    progress.completeLesson('chemie', 'l1-2', 6, 8)
    expect(sync.getSyncState().pending).toBe(true)
    await vi.advanceTimersByTimeAsync(5000)
    const saved = remote.blob() as { lessons: Record<string, unknown>; xp: number }
    expect(saved.lessons['chemie:l1-2']).toBeTruthy()
    expect(saved.xp).toBe(progress.getProgress().xp)
    expect(sync.getSyncState().pending).toBe(false)
    sync.__resetSyncForTests()
  })

  it('waits for a click when the sign-in expired, and never blocks local saving', async () => {
    const { progress, sync } = await fresh()
    const remote = memoryRemote(null, { needsAuth: true })
    localStorage.setItem('edu4me-sync', JSON.stringify({ provider: 'mem' }))
    sync.initSync({ mem: () => remote })
    await vi.runAllTimersAsync()
    expect(sync.getSyncState().status).toBe('needs-auth')
    progress.completeLesson('chemie', 'l1-3', 8, 8)
    expect(progress.getProgress().lessons['chemie:l1-3']).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('edu4me-progress-v1')!).lessons['chemie:l1-3']).toBeTruthy()
    await vi.advanceTimersByTimeAsync(5000)
    expect(remote.saves).toBe(0)
    await sync.syncNow({ interactive: true })
    expect(sync.getSyncState().status).toBe('idle')
    expect(remote.saves).toBe(1)
    sync.__resetSyncForTests()
  })
})
