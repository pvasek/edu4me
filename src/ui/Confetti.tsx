import { useMemo } from 'react'

const COLORS = ['var(--accent)', 'var(--yellow)', 'var(--blue)', 'var(--green)', 'var(--violet)', 'var(--pink)', 'var(--teal)']

/** One-shot confetti burst (pure CSS). */
export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
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
        <span
          key={i}
          className={`confetti-piece s${p.shape}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--rot' as string]: `${p.rot}deg`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export function Stars({ n, size = 40 }: { n: number; size?: number }) {
  return (
    <div className="stars" aria-label={`${n} ze 3 hvězd`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} className={i < n ? 'on' : ''} style={{ animationDelay: `${0.25 + i * 0.2}s` }}>
          <path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z" />
        </svg>
      ))}
    </div>
  )
}
