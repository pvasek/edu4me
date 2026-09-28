/**
 * Sync engine: keeps the local progress and (optionally) one remote copy in step.
 *
 * sync = load remote → merge into local (never loses progress) → save merged remote.
 * It runs when a remote is connected, a few seconds after every local change
 * (debounced), when the tab is hidden, and when the learner taps "Synchronizovat".
 * Local saving never waits for the network; the app works fully offline.
 */
import { useSyncExternalStore } from 'react'
import { getProgress, mergeIn, setCommitHook } from '../progress'
import { createGoogleDrive } from './googleDrive'
import { NeedsAuthError, type RemoteStorage } from './types'

export type SyncStatus = 'off' | 'idle' | 'syncing' | 'needs-auth' | 'error'

export interface SyncState {
  provider: string | null
  label: string | null
  status: SyncStatus
  lastSyncAt: string | null
  error: string | null
  /** local changes not yet on the remote */
  pending: boolean
}

const PREF_KEY = 'edu4me-sync'
const PUSH_DELAY = 4000

/** Every remote backend the app knows. Add new ones here. */
const REGISTRY: Record<string, () => RemoteStorage> = {
  gdrive: createGoogleDrive,
}

let remote: RemoteStorage | null = null
let sync: SyncState = { provider: null, label: null, status: 'off', lastSyncAt: null, error: null, pending: false }
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | null = null
let running: Promise<void> | null = null

function set(patch: Partial<SyncState>) {
  sync = { ...sync, ...patch }
  listeners.forEach((l) => l())
}

function readPref(): { provider: string; lastSyncAt?: string } | null {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) ?? 'null')
  } catch {
    return null
  }
}
function writePref(p: { provider: string; lastSyncAt?: string } | null) {
  try {
    if (p) localStorage.setItem(PREF_KEY, JSON.stringify(p))
    else localStorage.removeItem(PREF_KEY)
  } catch {
    /* ignore */
  }
}

/** Backends that are built into this deployment (configured). */
export function availableRemotes(): { id: string; label: string }[] {
  return Object.values(REGISTRY)
    .map((make) => make())
    .filter((r) => r.configured)
    .map((r) => ({ id: r.id, label: r.label }))
}

/** One sync round. Safe to call often; concurrent calls share one run. */
export function syncNow(opts: { interactive?: boolean } = {}): Promise<void> {
  if (!remote) return Promise.resolve()
  if (running) return running
  const r = remote
  running = (async () => {
    set({ status: 'syncing', error: null })
    try {
      await r.authorize(Boolean(opts.interactive))
      const theirs = await r.load()
      if (theirs) mergeIn(theirs, { fromSync: true })
      await r.save(getProgress())
      const now = new Date().toISOString()
      writePref({ provider: r.id, lastSyncAt: now })
      set({ status: 'idle', lastSyncAt: now, pending: false })
    } catch (e) {
      if (e instanceof NeedsAuthError || (e as Error)?.name === 'NeedsAuthError') set({ status: 'needs-auth', error: (e as Error).message })
      else set({ status: 'error', error: e instanceof Error ? e.message : String(e) })
    } finally {
      running = null
    }
  })()
  return running
}

function schedulePush() {
  if (!remote) return
  set({ pending: true })
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    if (sync.status !== 'needs-auth') void syncNow()
  }, PUSH_DELAY)
}

/** Connect a backend. Call from a click: it may open a sign-in window. */
export async function connect(id: string): Promise<void> {
  const make = REGISTRY[id]
  if (!make) throw new Error(`Neznámé úložiště: ${id}`)
  remote = make()
  set({ provider: remote.id, label: remote.label, status: 'syncing', error: null, lastSyncAt: null })
  writePref({ provider: remote.id })
  await syncNow({ interactive: true })
  if (sync.status === 'needs-auth' || sync.status === 'error') {
    // the first connection failed (cancelled sign-in, blocked popup, offline): don't stay half-connected
    const reason = sync.error ?? 'Připojení se nepovedlo.'
    await disconnect(false).catch(() => {})
    throw new Error(reason)
  }
}

export async function disconnect(deleteData = false): Promise<void> {
  const r = remote
  remote = null
  writePref(null)
  if (timer) clearTimeout(timer)
  set({ provider: null, label: null, status: 'off', lastSyncAt: null, error: null, pending: false })
  await r?.disconnect(deleteData)
}

/** Preload the backend SDK (e.g. when the profile opens) so a later click can open the sign-in popup at once. */
export function prepareRemote(id?: string) {
  const make = REGISTRY[id ?? remote?.id ?? '']
  ;(remote ?? make?.())?.prepare?.()
}

export function getSyncState() {
  return sync
}

export function useSyncState(): SyncState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => sync,
    () => sync,
  )
}

/** Starts the engine: restores a previous connection and hooks into local saves. Call once at startup. */
export function initSync(registry: Record<string, () => RemoteStorage> = REGISTRY) {
  setCommitHook(schedulePush)
  if (typeof document !== 'undefined')
    document.addEventListener('visibilitychange', () => {
      if (remote && document.visibilityState === 'hidden' && sync.pending && sync.status !== 'needs-auth') void syncNow()
    })
  const pref = readPref()
  const make = pref && registry[pref.provider]
  if (!make) return
  const r = make()
  if (!r.configured) return
  remote = r
  set({ provider: r.id, label: r.label, status: 'idle', lastSyncAt: pref.lastSyncAt ?? null })
  r.prepare?.()
  void syncNow() // succeeds silently if still signed in, otherwise shows "needs-auth"
}

/** For tests. */
export function __resetSyncForTests() {
  remote = null
  running = null
  if (timer) clearTimeout(timer)
  timer = null
  sync = { provider: null, label: null, status: 'off', lastSyncAt: null, error: null, pending: false }
  setCommitHook(null)
}
