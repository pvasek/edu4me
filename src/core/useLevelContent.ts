import { useEffect, useState } from 'react'
import type { LevelContent, LevelOutline } from './types'

const cache = new Map<string, LevelContent>()

/** Lazy-loads a level's lesson bodies (one JS chunk per level). */
export function useLevelContent(level: LevelOutline | undefined) {
  const [content, setContent] = useState<LevelContent | null>(level ? (cache.get(level.id) ?? null) : null)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!level) return
    const hit = cache.get(level.id)
    if (hit) {
      setContent(hit)
      return
    }
    let alive = true
    level
      .load()
      .then((c) => {
        cache.set(level.id, c)
        if (alive) setContent(c)
      })
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [level])
  return { content, error }
}
