import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'
import { bump, shake } from '../../ui/motion'
import type { GameResult } from '../types'

/** Wraps onFinish so it can only ever fire once per mount. */
export function useFinishOnce(onFinish: (r: GameResult) => void) {
  const done = useRef(false)
  const cb = useRef(onFinish)
  cb.current = onFinish
  return useCallback((r: GameResult) => {
    if (done.current) return
    done.current = true
    cb.current(r)
  }, [])
}

/** Current time in ms, refreshed every `every` ms while `active`. */
export function useNow(active: boolean, every = 250): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), every)
    return () => window.clearInterval(id)
  }, [active, every])
  return now
}

/**
 * Motion-driven feedback for one element: attach `ref` and call
 * `jolt.shake()` on a wrong answer or `jolt.pop()` on a right one.
 * Uses the shared presets from src/ui/motion.ts and respects reduced motion.
 */
export function useJolt<T extends Element = HTMLDivElement>() {
  const [scope, animate] = useAnimate<T>()
  const reduce = useReducedMotion()
  const run = useCallback(
    (kind: 'shake' | 'pop') => {
      if (reduce || !scope.current) return
      if (kind === 'shake') animate(scope.current, { x: shake.x }, shake.transition)
      else animate(scope.current, { scale: bump.scale }, bump.transition)
    },
    [animate, reduce, scope],
  )
  const jolt = useMemo(() => ({ shake: () => run('shake'), pop: () => run('pop') }), [run])
  return [scope, jolt] as const
}

/**
 * Re-triggerable CSS animation class (legacy; prefer `useJolt`). `play('shake')` gives
 * `g-sh-shake0` / `g-sh-shake1` alternately, so the same animation
 * restarts even when fired twice in a row.
 */
export function useAnim() {
  const [a, setA] = useState<{ name: string; n: number } | null>(null)
  const play = useCallback((name: 'shake' | 'pop') => setA((p) => ({ name, n: (p?.n ?? 0) + 1 })), [])
  return [a ? `g-sh-${a.name}${a.n % 2}` : '', play] as const
}

/** Runs `fn` after `ms`, cancelling on unmount. */
export function useLater() {
  const ids = useRef<number[]>([])
  useEffect(() => () => ids.current.forEach((id) => window.clearTimeout(id)), [])
  return useCallback((fn: () => void, ms: number) => {
    ids.current.push(window.setTimeout(fn, ms))
  }, [])
}
