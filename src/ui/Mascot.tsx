import { useId, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { spring } from './motion'
import './mascot.css'

export type Mood = 'happy' | 'think' | 'wow' | 'sad' | 'cheer' | 'sleep'

/**
 * Atomík – the course mascot. A friendly atom whose electrons orbit
 * around a face. Moods change the face; `cheer` also bounces.
 */
export function Mascot({
  mood = 'happy',
  size = 96,
  color = 'var(--accent)',
  style,
  className = '',
}: {
  mood?: Mood
  size?: number
  color?: string
  style?: CSSProperties
  className?: string
}) {
  const hatchId = useId().replace(/:/g, '')
  return (
    <motion.svg
      key={mood}
      initial={{ scale: 0.8, rotate: -8 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={spring.bouncy}
      className={`mascot mascot-${mood} ${className}`}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      style={{ ...style, ['--m-color' as string]: color }}
      role="img"
      aria-label="Atomík"
    >
      <defs>
        <pattern id={hatchId} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#1f2a44" strokeWidth="1.2" opacity=".28" />
        </pattern>
      </defs>
      <g className="mascot-orbits" fill="none" stroke="var(--edge)" strokeWidth="2">
        <ellipse cx="60" cy="60" rx="54" ry="19" />
        <ellipse cx="60" cy="60" rx="54" ry="19" transform="rotate(60 60 60)" />
        <ellipse cx="60" cy="60" rx="54" ry="19" transform="rotate(120 60 60)" />
        <circle cx="6" cy="60" r="6" fill="var(--blue)" stroke="var(--edge)" strokeWidth="2" />
        <circle cx="87" cy="106.8" r="6" fill="var(--yellow)" stroke="var(--edge)" strokeWidth="2" />
        <circle cx="87" cy="13.2" r="6" fill="var(--green)" stroke="var(--edge)" strokeWidth="2" />
      </g>
      <g className="mascot-body">
        <circle cx="60" cy="60" r="27" fill="var(--m-color)" stroke="var(--edge)" strokeWidth="2.4" />
        <path d="M60 33a27 27 0 0 1 0 54a14 27 0 0 0 0-54z" transform="rotate(35 60 60)" fill={`url(#${hatchId})`} />
        <circle cx="60" cy="60" r="23.5" fill="none" stroke="var(--edge)" strokeWidth=".8" opacity=".5" />
        <ellipse cx="51" cy="50" rx="7" ry="4" fill="#fff" opacity=".45" />
        <Face mood={mood} />
      </g>
    </motion.svg>
  )
}

function Face({ mood }: { mood: Mood }) {
  const ink = '#1f2a44'
  switch (mood) {
    case 'think':
      return (
        <g fill={ink} stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <circle cx="51" cy="60" r="3" stroke="none" />
          <circle cx="69" cy="58" r="3" stroke="none" />
          <path d="M53 71h13" fill="none" />
          <path d="M64 50l8-3" fill="none" />
        </g>
      )
    case 'wow':
      return (
        <g fill={ink}>
          <circle cx="51" cy="57" r="3.6" />
          <circle cx="69" cy="57" r="3.6" />
          <ellipse cx="60" cy="71" rx="4.5" ry="5.5" />
        </g>
      )
    case 'sad':
      return (
        <g fill={ink} stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <circle cx="51" cy="59" r="3" stroke="none" />
          <circle cx="69" cy="59" r="3" stroke="none" />
          <path d="M52 73q8-7 16 0" fill="none" />
        </g>
      )
    case 'sleep':
      return (
        <g fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <path d="M47 59q4 3 8 0M65 59q4 3 8 0M56 70h8" />
        </g>
      )
    case 'cheer':
      return (
        <g stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M46 59l5-5 5 5M64 59l5-5 5 5" />
          <path d="M50 66q10 11 20 0z" fill={ink} />
        </g>
      )
    default:
      return (
        <g fill={ink} stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <circle cx="51" cy="58" r="3" stroke="none" />
          <circle cx="69" cy="58" r="3" stroke="none" />
          <path d="M51 67q9 8 18 0" fill="none" />
          <circle cx="45" cy="66" r="3.4" fill="#ff8fa3" stroke="none" opacity=".7" />
          <circle cx="75" cy="66" r="3.4" fill="#ff8fa3" stroke="none" opacity=".7" />
        </g>
      )
  }
}

/** Mascot with a speech bubble. */
export function MascotSays({
  children,
  mood = 'happy',
  size = 72,
}: {
  children: React.ReactNode
  mood?: Mood
  size?: number
}) {
  return (
    <div className="mascot-says">
      <Mascot mood={mood} size={size} />
      <div className="mascot-bubble">{children}</div>
    </div>
  )
}
