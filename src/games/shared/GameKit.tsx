import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { spring } from '../../ui/motion'
import './game-kit.css'

/** Top bar shared by the games: score, round, optional timer and extras. */
export function Hud({
  score,
  round,
  rounds,
  roundLabel = 'Kolo',
  seconds,
  timeLabel = 'Čas',
  extra,
}: {
  score?: number
  round?: number
  rounds?: number
  roundLabel?: string
  seconds?: number
  timeLabel?: string
  extra?: ReactNode
}) {
  const pct = round !== undefined && rounds ? Math.min(100, ((round - 1) / rounds) * 100) : null
  return (
    <div className="g-sh-hud">
      <div className="g-sh-hud-row">
        {round !== undefined && rounds !== undefined && (
          <span className="chip g-sh-hud-chip">
            <Icon name="target" />
            <span>
              {roundLabel} <Bump value={Math.min(round, rounds)} />/{rounds}
            </span>
          </span>
        )}
        {seconds !== undefined && (
          <span className="chip g-sh-hud-chip" aria-label={`${timeLabel}: ${Math.floor(seconds)} sekund`}>
            <Icon name="clock" />
            <span className="mono">{fmtClock(seconds)}</span>
          </span>
        )}
        {extra}
        <span className="spacer" />
        {score !== undefined && (
          <span className="chip g-sh-hud-chip g-sh-hud-score" aria-live="polite">
            <Icon name="star" />
            <span>
              <Bump value={score} /> b.
            </span>
          </span>
        )}
      </div>
      {pct !== null && (
        <div className="progress g-sh-hud-bar" aria-hidden="true">
          <span style={{ width: `${pct}%`, ['--bar' as string]: 'var(--accent)' }} />
        </div>
      )}
    </div>
  )
}

/** A number that springs up whenever it changes (HUD counters). */
export function Bump({ value, className = '' }: { value: number | string; className?: string }) {
  return (
    <motion.b
      key={String(value)}
      className={`g-sh-bumpnum ${className}`}
      initial={{ scale: 1.55, y: -2 }}
      animate={{ scale: 1, y: 0 }}
      transition={spring.bouncy}
    >
      {value}
    </motion.b>
  )
}

export function fmtClock(s: number): string {
  const t = Math.max(0, Math.floor(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

/** Feedback line with icon + text (never colour alone). Springs in on mount. */
export function Feedback({
  kind,
  children,
  className = '',
}: {
  kind: 'good' | 'bad' | 'info' | 'warn'
  children: ReactNode
  className?: string
}) {
  const icon = kind === 'good' ? 'check' : kind === 'bad' ? 'x' : kind === 'warn' ? 'alert' : 'info'
  return (
    <motion.div
      className={`g-sh-fb g-sh-fb-${kind} ${className}`}
      role="status"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={spring.snappy}
    >
      <motion.span
        className="g-sh-fb-icon"
        initial={{ scale: 0, rotate: kind === 'good' ? -40 : 40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...spring.bouncy, delay: 0.05 }}
      >
        <Icon name={icon} />
      </motion.span>
      <div className="g-sh-fb-text">{children}</div>
    </motion.div>
  )
}

/** Floating "+120" that pops up and fades. Re-mount (key) to replay. */
export function PointsPop({ points }: { points: number }) {
  if (!points) return null
  return (
    <motion.span
      className="g-sh-points"
      aria-hidden="true"
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -8, -30], scale: [0.6, 1.2, 1, 1] }}
      transition={{ duration: 1.2, times: [0, 0.2, 0.6, 1], ease: 'easeOut' }}
    >
      +{points}
    </motion.span>
  )
}
