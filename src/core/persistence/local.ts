/**
 * Local persistence (always on): localStorage with a backup copy of the last good
 * save, a stable device id, "persistent storage" requests and backup bookkeeping.
 */

/** Key name kept from v1 so existing learners keep their progress (the data carries its own version). */
// keys keep the app's old name (edu4me): renaming them would lose learners' saved progress
export const PROGRESS_KEY = 'edu4me-progress-v1'
const BACKUP_KEY = `${PROGRESS_KEY}.bak`
const DEVICE_KEY = 'edu4me-device'
const META_KEY = 'edu4me-meta'

export interface LocalMeta {
  /** when the learner last downloaded a backup file */
  lastExportAt?: string
  /** we already asked the browser for persistent storage */
  persistAsked?: boolean
}

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null // blocked (some private modes, disabled cookies)
  }
}

/** Reads saved progress; falls back to the backup copy if the main copy is missing or corrupt. */
export function readLocal(): unknown | null {
  const s = storage()
  if (!s) return null
  for (const key of [PROGRESS_KEY, BACKUP_KEY]) {
    try {
      const raw = s.getItem(key)
      if (raw) return JSON.parse(raw)
    } catch {
      /* corrupt – try the backup */
    }
  }
  return null
}

/** Saves progress; the previous save is kept as a backup copy. Returns false if storage is unavailable. */
export function writeLocal(data: unknown): boolean {
  const s = storage()
  if (!s) return false
  try {
    const json = JSON.stringify(data)
    const prev = s.getItem(PROGRESS_KEY)
    if (prev && prev !== json) s.setItem(BACKUP_KEY, prev)
    s.setItem(PROGRESS_KEY, json)
    return true
  } catch {
    return false // quota exceeded or blocked – progress stays in memory
  }
}

let deviceId: string | null = null
/** A random id for this browser, used for the per-device XP counter. */
export function getDeviceId(): string {
  if (deviceId) return deviceId
  const s = storage()
  let id = s?.getItem(DEVICE_KEY) ?? null
  if (!id) {
    id = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
    try {
      s?.setItem(DEVICE_KEY, id)
    } catch {
      /* ignore */
    }
  }
  deviceId = id
  return id
}

export function readMeta(): LocalMeta {
  try {
    return JSON.parse(storage()?.getItem(META_KEY) ?? '{}') as LocalMeta
  } catch {
    return {}
  }
}

export function writeMeta(patch: Partial<LocalMeta>) {
  try {
    storage()?.setItem(META_KEY, JSON.stringify({ ...readMeta(), ...patch }))
  } catch {
    /* ignore */
  }
}

/** Is this site's storage protected from automatic eviction? null = the browser can't tell. */
export async function isPersisted(): Promise<boolean | null> {
  try {
    return typeof navigator !== 'undefined' && navigator.storage?.persisted ? await navigator.storage.persisted() : null
  } catch {
    return null
  }
}

/** Asks the browser to protect this site's storage (Chrome/Edge/Safari decide silently, Firefox may ask). */
export async function requestPersist(): Promise<boolean | null> {
  writeMeta({ persistAsked: true })
  try {
    return typeof navigator !== 'undefined' && navigator.storage?.persist ? await navigator.storage.persist() : null
  } catch {
    return null
  }
}

/** Calls `fn` when another tab of this app saves progress. */
export function onOtherTabSave(fn: (data: unknown) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const h = (e: StorageEvent) => {
    if (e.key !== PROGRESS_KEY || !e.newValue) return
    try {
      fn(JSON.parse(e.newValue))
    } catch {
      /* ignore */
    }
  }
  window.addEventListener('storage', h)
  return () => window.removeEventListener('storage', h)
}
