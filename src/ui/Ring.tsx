import { motion } from 'motion/react'
import { ease } from './motion'

/** Circular progress ring around a node; the arc draws in. */
export function Ring({ value, size = 104, color }: { value: number; size?: number; color: string }) {
  const r = size / 2 - 5
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r - 6} fill="none" stroke="var(--line)" strokeWidth="1" />
      {value > 0 && (
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.min(1, value) }}
          transition={{ duration: 0.9, delay: 0.3, ease: ease.out }}
        />
      )}
    </svg>
  )
}
