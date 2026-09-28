/**
 * Every deploy replaces the hashed JS chunks (LessonPage-<hash>.js …) and deletes
 * the old ones. A tab opened before the deploy then asks for a chunk that no longer
 * exists → the dynamic import fails. Recovery: reload once, with a throwaway `?v=`
 * query so the browser can't serve its cached old index.html (GitHub Pages lets
 * browsers cache it for ~10 min). A time guard prevents reload loops (e.g. offline).
 */
import { lazy, type ComponentType } from 'react'

const GUARD_KEY = 'edu4me-reloaded-at'
const GUARD_MS = 15_000

/** Errors browsers throw when a lazily loaded JS/CSS chunk can't be fetched. */
export function isChunkError(e: unknown): boolean {
  const msg = e instanceof Error ? `${e.name} ${e.message}` : String(e)
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|ChunkLoadError|Loading chunk .* failed/i.test(
    msg,
  )
}

/** Reloads to the newest version of the app. Returns false if we just did that (don't loop). */
export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(GUARD_KEY) ?? 0)
    if (Date.now() - last < GUARD_MS) return false
    sessionStorage.setItem(GUARD_KEY, String(Date.now()))
  } catch {
    /* no sessionStorage: still try once */
  }
  const url = new URL(window.location.href)
  url.searchParams.set('v', Date.now().toString(36))
  window.location.replace(url.toString())
  return true
}

/** React.lazy that reloads to the new version when its chunk is gone after a deploy. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithReload<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(() =>
    factory().catch((e: unknown) => {
      // while the page reloads, keep showing the loading state instead of an error
      if (isChunkError(e) && reloadForNewVersion()) return new Promise<{ default: T }>(() => {})
      throw e
    }),
  )
}

/** Call once at startup. */
export function installStaleBuildRecovery() {
  if (typeof window === 'undefined') return
  // Vite fires this when a chunk's preloaded dependency (JS or CSS) fails
  window.addEventListener('vite:preloadError', (e) => {
    if (reloadForNewVersion()) e.preventDefault()
  })
  // tidy the address bar after a recovery reload (keeps the #/route)
  const url = new URL(window.location.href)
  if (url.searchParams.has('v')) {
    url.searchParams.delete('v')
    window.history.replaceState(window.history.state, '', url.toString())
  }
}
