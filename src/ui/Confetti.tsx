import { useMemo } from 'react'
import { motion } from 'motion/react'
import { spring } from './motion'

const COLORS = ['var(--accent)', 'var(--yellow)', 'var(--blue)', 'var(--green)', 'var(--violet)', 'var(--pink)', 'var(--teal)']

/** One-shot burst of paper scraps falling from the top of the screen. */
export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.8 + Math.random() * 1.6,
        rot: Math.random() * 720 - 360,
        drift: Math.random() * 160 - 80,
        color: COLORS[i % COLORS.length],
        shape: i % 3,
      })),
    [count],
  )
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className={`confetti-piece s${p.shape}`}
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: typeof window !== 'undefined' ? window.innerHeight + 40 : 900, x: p.drift, rotate: p.rot, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.3, 0.2, 0.6, 1] }}
        />
      ))}
    </div>
  )
}

/** Three stars that stamp in one after another. */
export function Stars({ n, size = 44 }: { n: number; size?: number }) {
  return (
    <div className="stars" aria-label={`${n} ze 3 hvězd`}>
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={i < n ? 'on' : ''}
          initial={i < n ? { scale: 0, rotate: -60 } : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ ...spring.bouncy, delay: 0.35 + i * 0.22 }}
        >
          <path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z" />
        </motion.svg>
      ))}
    </div>
  )
}
