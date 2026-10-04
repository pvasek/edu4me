/**
 * Drag and drop that also works with taps and the keyboard (shared by Stavitel buňky
 * and Mapa těla).
 *   - pointer: press a chip and drag it onto a slot (mouse, pen or finger);
 *   - tap / click: tap a chip to select it, then tap a slot (or a marker in the picture);
 *   - keyboard: Tab to a chip, Enter or Space selects it, Tab to a slot, Enter places it; Esc cancels.
 * A placed chip is selected the same way and can be moved to another slot or back to the tray.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { emptyBoard, moveToken, type Where } from './board'
import './dnd.css'

export const TRAY = 'tray'

interface Drag {
  id: string
  x: number
  y: number
  over: string | null
}

export interface DndOptions {
  tokens: readonly string[]
  /** How many tokens a slot holds (1 for a label or a step, Infinity for a sorting zone). */
  capacity: (slot: string) => number
  /** False once the task is answered. */
  enabled: boolean
  /** Tokens that may no longer move (confirmed correct). */
  locked: ReadonlySet<string>
  /** Text of a token for the ghost and announcements. */
  label: (token: string) => string
}

export function useDnd({ tokens, capacity, enabled, locked, label }: DndOptions) {
  const [where, setWhere] = useState<Where>(() => emptyBoard(tokens))
  const [armed, setArmed] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [moves, setMoves] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const cleanup = useRef<(() => void) | null>(null)
  const whereRef = useRef(where)
  whereRef.current = where

  useEffect(() => () => cleanup.current?.(), [])
  useEffect(() => {
    if (!enabled) {
      setArmed(null)
      cleanup.current?.()
      setDrag(null)
    }
  }, [enabled])

  // keyboard flow: when the focused element vanished (a slot got filled), continue in the tray
  useEffect(() => {
    if (!moves) return
    const a = document.activeElement
    if (a && a !== document.body && a.isConnected) return
    const next = rootRef.current?.querySelector<HTMLElement>('.g-dnd-tray [data-token]') ?? rootRef.current?.querySelector<HTMLElement>('[data-check]')
    next?.focus({ preventScroll: true })
  }, [moves])

  const slotLocked = useCallback(
    (slot: string) => capacity(slot) === 1 && Object.entries(whereRef.current).some(([t, s]) => s === slot && locked.has(t)),
    [capacity, locked],
  )

  const move = useCallback(
    (token: string, target: string | null) => {
      if (!enabled || locked.has(token)) return
      if (target !== null && slotLocked(target)) return
      setWhere((w) => moveToken(w, token, target, capacity))
      setArmed(null)
      setMoves((n) => n + 1)
    },
    [capacity, enabled, locked, slotLocked],
  )

  /** Slot id under a screen point (only inside this board), TRAY for the tray. */
  const dropAt = (x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop]')
    if (!el || !rootRef.current?.contains(el)) return null
    return el.dataset.drop ?? null
  }

  const startDrag = (id: string) => (e: RPointerEvent<HTMLElement>) => {
    if (!enabled || locked.has(id) || e.button !== 0) return
    cleanup.current?.()
    const x0 = e.clientX
    const y0 = e.clientY
    const pid = e.pointerId
    let dragging = false
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      if (!dragging) {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 7) return
        dragging = true
        setArmed(null)
      }
      ev.preventDefault()
      last = [ev.clientX, ev.clientY]
      setDrag({ id, x: ev.clientX, y: ev.clientY, over: dropAt(ev.clientX, ev.clientY) })
      if (!raf) raf = requestAnimationFrame(edgeScroll)
    }
    // keep scrolling while the finger rests near the top or bottom edge (targets out of view on a phone)
    let last: [number, number] = [x0, y0]
    let raf = 0
    const edgeScroll = () => {
      raf = 0
      const edge = 64
      const [x, y] = last
      const dy = y < edge ? -Math.ceil((edge - y) / 6) : y > window.innerHeight - edge ? Math.ceil((y - window.innerHeight + edge) / 6) : 0
      if (!dy) return
      window.scrollBy(0, dy)
      setDrag({ id, x, y, over: dropAt(x, y) })
      raf = requestAnimationFrame(edgeScroll)
    }
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      stop()
      if (!dragging) return
      suppressClick.current = true
      window.setTimeout(() => (suppressClick.current = false), 0)
      const over = dropAt(ev.clientX, ev.clientY)
      setDrag(null)
      if (over === TRAY) move(id, null)
      else if (over) move(id, over)
    }
    const onCancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return
      stop()
      setDrag(null)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      cleanup.current = null
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    cleanup.current = () => {
      stop()
      setDrag(null)
    }
  }

  /** Props for a chip (in the tray or in a slot). */
  const tokenProps = (id: string) => ({
    'data-token': id,
    'aria-pressed': armed === id,
    'aria-disabled': !enabled || locked.has(id) || undefined,
    onPointerDown: startDrag(id),
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      if (suppressClick.current || !enabled) return
      const slot = whereRef.current[id]
      // another chip is selected: put it where this one lies (they swap)
      if (armed && armed !== id && slot) return move(armed, slot)
      if (locked.has(id)) return
      setArmed((a) => (a === id ? null : id))
    },
  })

  /** Props for an empty slot button or a marker in the picture. */
  const slotProps = (slot: string) => ({
    'data-drop': slot,
    onClick: () => {
      if (suppressClick.current || !enabled) return
      if (armed) return move(armed, slot)
      // nothing selected: select the chip lying there (single slots only)
      if (capacity(slot) === 1) {
        const t = Object.keys(whereRef.current).find((k) => whereRef.current[k] === slot)
        if (t && !locked.has(t)) setArmed(t)
      }
    },
  })

  const toTray = () => {
    if (armed && whereRef.current[armed] !== null) move(armed, null)
  }

  const rootProps = {
    ref: rootRef,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Escape' && armed) {
        e.stopPropagation()
        setArmed(null)
      }
    },
  }

  const isOver = (slot: string) => drag?.over === slot
  const dragging = drag?.id ?? null

  const ghost =
    drag && typeof document !== 'undefined'
      ? createPortal(
          <div className="g-dnd-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
            {label(drag.id)}
          </div>,
          document.body,
        )
      : null

  const announce = armed
    ? `Vybráno: ${label(armed)}. ${whereRef.current[armed] !== null ? 'Vyber jiné místo, nebo tlačítko Zpět do nabídky.' : 'Teď vyber místo.'}`
    : ''

  return { where, setWhere, armed, setArmed, move, moves, tokenProps, slotProps, toTray, rootProps, isOver, dragging, ghost, announce, slotLocked }
}

export type Dnd = ReturnType<typeof useDnd>
