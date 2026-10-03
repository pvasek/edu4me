import { useId, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { spring } from './motion'
import './mascot.css'

export type Mood = 'happy' | 'think' | 'wow' | 'sad' | 'cheer' | 'sleep'

/**
 * Kvído – the Q & Why guide. A living letter Q (round body, Q-tail) with a
 * question-mark curl on top (his body is the question mark's dot), drawn like an engraving. Moods change the face;
 * `cheer` bounces, `sleep` snores. Drawn on a 120 × 120 grid.
 */
export function Mascot({
  mood = 'happy',
  size = 96,
  color = 'var(--kv-gold)',
  style,
  className = '',
}: {
  mood?: Mood
  size?: number
  /** colour of the question-mark curl */
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
      style={{ ...style, ['--kv-curl' as string]: color }}
      role="img"
      aria-label={`Kvído, ${MOOD_LABEL[mood]}`}
    >
      <defs>
        <pattern id={hatchId} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="1" opacity=".3" />
        </pattern>
      </defs>
      <g className="mascot-body">
        {/* the Q's tail */}
        <path d="M78 88C88 96 96 104 108 104" stroke={INK} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M78 88C88 96 96 104 108 104" stroke="var(--kv-navy)" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* body */}
        <circle cx="56" cy="64" r="34" fill="var(--kv-cream)" stroke={INK} strokeWidth="3" />
        <path d="M56 30a34 34 0 0 1 0 68a18 34 0 0 0 0-68z" transform="rotate(30 56 64)" fill={`url(#${hatchId})`} />
        <circle cx="56" cy="64" r="29.5" fill="none" stroke={INK} strokeWidth=".8" opacity=".45" />
        <ellipse cx="44" cy="44" rx="8" ry="4.5" fill="#fff" opacity=".7" transform="rotate(-25 44 44)" />
        {/* question-mark curl */}
        <g className="mascot-curl">
          <path d="M56 31V26C56 20 67 19 67 11C67 4 61 1 55.5 1C49 1 45 5 45 10.5" stroke={INK} strokeWidth="8.5" fill="none" strokeLinecap="round" />
          <path d="M56 31V26C56 20 67 19 67 11C67 4 61 1 55.5 1C49 1 45 5 45 10.5" stroke="var(--kv-curl)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <circle cx="45" cy="11" r="4.4" fill="var(--kv-curl)" stroke={INK} strokeWidth="2" />
        </g>
        {/* feet */}
        <ellipse cx="44" cy="99" rx="9" ry="4.5" fill="var(--kv-navy)" stroke={INK} strokeWidth="1.5" />
        <ellipse cx="68" cy="99" rx="9" ry="4.5" fill="var(--kv-navy)" stroke={INK} strokeWidth="1.5" />
        <Face mood={mood} />
      </g>
      <Extras mood={mood} />
    </motion.svg>
  )
}

const INK = '#0b1d36'
const MOOD_LABEL: Record<Mood, string> = { happy: 'radost', think: 'přemýšlí', wow: 'úžas', sad: 'nevadí', cheer: 'hurá', sleep: 'spí' }

/** Face centred on the body (56, 62); eyes 11 px either side. */
function Face({ mood }: { mood: Mood }) {
  const line = { stroke: INK, strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' as const }
  const eye = (x: number, y: number) => (
    <g key={x}>
      <ellipse cx={x} cy={y} rx="3.4" ry="4.3" fill={INK} />
      <circle cx={x + 1.2} cy={y - 1.5} r="1.2" fill="#fff" />
    </g>
  )
  const cheeks = (
    <g fill="#d98a6a" opacity=".35">
      <ellipse cx="41.7" cy="70.8" rx="4.4" ry="2.6" />
      <ellipse cx="70.3" cy="70.8" rx="4.4" ry="2.6" />
    </g>
  )
  switch (mood) {
    case 'think':
      return (
        <g>
          {eye(45, 63)}
          {eye(67.5, 62)}
          <path d="M63 53.2Q67 48.8 72.5 52.1M40.6 54.3L49.4 53.8" {...line} />
          <path d="M52.7 74.1Q58.2 71.9 62.6 73" {...line} />
        </g>
      )
    case 'wow':
      return (
        <g>
          {[45, 67].map((x) => (
            <g key={x}>
              <circle cx={x} cy="62" r="5.5" fill="#fff" stroke={INK} strokeWidth="2" />
              <circle cx={x} cy="62.6" r="2.9" fill={INK} />
            </g>
          ))}
          <path d="M40.6 52.1Q45 48.8 49.4 51M62.6 51Q67 48.8 71.4 52.1" {...line} />
          <ellipse cx="56" cy="74.1" rx="3.5" ry="4.6" fill={INK} />
        </g>
      )
    case 'sad':
      return (
        <g>
          <path d="M41.7 63.1Q45 67.5 48.3 63.1M63.7 63.1Q67 67.5 70.3 63.1" {...line} />
          <path d="M40.6 56.5L49.4 53.2M62.6 53.2L71.4 56.5" {...line} />
          <path d="M49.4 76.3Q56 70.8 62.6 76.3" {...line} />
        </g>
      )
    case 'cheer':
      return (
        <g>
          {cheeks}
          <path d="M40.6 63.1Q45 56.5 49.4 63.1M62.6 63.1Q67 56.5 71.4 63.1" {...line} />
          <path d="M47.2 68.6Q56 84 64.8 68.6Z" fill={INK} />
          <path d="M51.6 75.2Q56 79 60.4 75.2" fill="#d98a6a" />
        </g>
      )
    case 'sleep':
      return (
        <g>
          <path d="M40.6 62Q45 65.9 49.4 62M62.6 62Q67 65.9 71.4 62" {...line} />
          <ellipse cx="56" cy="73" rx="2.2" ry="2.6" fill={INK} />
        </g>
      )
    default:
      return (
        <g>
          {cheeks}
          {eye(45, 62)}
          {eye(67, 62)}
          <path d="M48.3 70.8Q56 78.5 63.7 70.8" {...line} />
        </g>
      )
  }
}

/** Small signs around Kvído: sparkles, a thinking "?", snoring Z's… */
function Extras({ mood }: { mood: Mood }) {
  const star = (x: number, y: number, r: number, fill: string) =>
    `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z|${fill}`
  switch (mood) {
    case 'cheer':
      return (
        <g className="mascot-extras" stroke={INK} strokeWidth="1">
          {[star(96, 22, 7, 'var(--kv-gold)'), star(22, 32, 5, 'var(--kv-gold)'), star(104, 48, 4, 'var(--kv-cream)')].map((s) => {
            const [d, fill] = s.split('|')
            return <path key={d} d={d} fill={fill} />
          })}
        </g>
      )
    case 'think':
      return (
        <g className="mascot-extras">
          <circle cx="86" cy="38" r="2.2" fill="var(--kv-navy)" />
          <circle cx="91" cy="31" r="3" fill="var(--kv-navy)" />
          <text x="94" y="28" fontFamily="Georgia, serif" fontWeight="700" fontSize="18" fill="var(--kv-gold)" stroke={INK} strokeWidth=".6">
            ?
          </text>
        </g>
      )
    case 'sleep':
      return (
        <g className="mascot-extras" fontFamily="Georgia, serif" fontWeight="700" fill="var(--kv-navy)">
          <text className="mascot-z" x="92" y="32" fontSize="13">
            z
          </text>
          <text className="mascot-z mascot-z2" x="101" y="22" fontSize="17">
            Z
          </text>
        </g>
      )
    case 'wow':
      return <path className="mascot-extras" d="M94 22l6-6M98 30l8-2M88 20l-1-8" stroke="var(--kv-gold)" strokeWidth="3" strokeLinecap="round" />
    case 'sad':
      return <path className="mascot-extras" d="M90 48q3 6 0 9q-3-3 0-9z" fill="#8fb3d9" stroke={INK} strokeWidth="1" />
    default:
      return null
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
