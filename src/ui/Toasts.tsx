import { useEffect, useState } from 'react'
import { onProgressEvent } from '../core/progress'
import { BADGE_BY_ID } from '../core/badges'
import { Icon } from './Icon'
import { AnimatePresence, motion } from 'motion/react'
import { spring } from './motion'

interface Toast {
  id: number
  title: string
  text: string
  color: string
}

let seq = 0

/** Shows new badges as they are earned. */
export function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(
    () =>
      onProgressEvent((e) => {
        if (e.type !== 'badge') return
        const b = BADGE_BY_ID[e.id]
        if (!b) return
        const t = { id: ++seq, title: `Nový odznak: ${b.title}`, text: b.description, color: b.color }
        setToasts((ts) => [...ts, t])
        setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), 4500)
      }),
    [],
  )
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          layout
          className="toast"
          style={{ ['--t-color' as string]: t.color }}
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: spring.bouncy }}
          exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
        >
          <span className="toast-icon">
            <Icon name="trophy" />
          </span>
          <div>
            <strong>{t.title}</strong>
            <div className="muted">{t.text}</div>
          </div>
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  )
}
