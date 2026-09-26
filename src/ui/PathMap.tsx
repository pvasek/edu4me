import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease, spring } from './motion'

const XS = [50, 74, 50, 26]

/**
 * Winding path through an old atlas: nodes zig-zag down the page, connected by
 * an inked line. Completed segments are drawn solid and "ink in" on load;
 * the rest are dotted. Nodes pop in one after another.
 */
export function PathMap({
  items,
  doneCount,
  color = 'var(--accent)',
  rowHeight = 176,
}: {
  items: { key: string; node: ReactNode }[]
  doneCount: number
  color?: string
  rowHeight?: number
}) {
  const h = items.length * rowHeight
  const pts = items.map((_, i) => ({ x: XS[i % XS.length], y: i * rowHeight + 50 }))
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const my = (a.y + b.y) / 2
    return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`
  }
  return (
    <div className="pathmap" style={{ height: h }}>
      <svg className="pathmap-line" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true">
        {pts.slice(1).map((p, i) => {
          const done = i < doneCount
          return (
            <g key={i}>
              <path
                d={seg(pts[i], p)}
                fill="none"
                vectorEffect="non-scaling-stroke"
                stroke="var(--line)"
                strokeWidth={2}
                strokeDasharray="2 7"
                strokeLinecap="round"
              />
              {done && (
                <motion.path
                  d={seg(pts[i], p)}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  stroke={color}
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.18, ease: ease.inOut }}
                />
              )}
            </g>
          )
        })}
      </svg>
      {items.map((it, i) => (
        <motion.div
          key={it.key}
          className="pathmap-item"
          style={{ left: `${pts[i].x}%`, top: pts[i].y, x: '-50%', y: -50 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.bouncy, delay: 0.1 + i * 0.08 }}
        >
          {it.node}
        </motion.div>
      ))}
    </div>
  )
}

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
