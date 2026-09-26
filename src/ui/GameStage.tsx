import { useId, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { GameMeta } from '../games/types'
import { spring } from './motion'
import './game-stage.css'

/**
 * The 2D "game world" every mini-game is played in: an engraved backdrop scene
 * for the game family, a title plaque, and a table surface for the play area.
 */
export function GameStage({ meta, levelLabel, children }: { meta: GameMeta; levelLabel?: string; children: ReactNode }) {
  return (
    <div className={`gs gs-${meta.kind}`}>
      <div className="gs-backdrop" aria-hidden="true">
        <Backdrop kind={meta.kind} />
      </div>
      <motion.div
        className="gs-plaque"
        initial={{ y: -30, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={spring.bouncy}
      >
        <span className="gs-plaque-title">{meta.title}</span>
        {levelLabel && <span className="gs-plaque-level">{levelLabel}</span>}
      </motion.div>
      <motion.div
        className="gs-table"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring.gentle, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function Backdrop({ kind }: { kind: GameMeta['kind'] }) {
  const id = useId().replace(/:/g, '')
  const hatch = `gs-h-${id}`
  const defs = (
    <defs>
      <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity=".35" />
      </pattern>
    </defs>
  )
  const common = { viewBox: '0 0 1200 260', preserveAspectRatio: 'xMidYMax slice', className: 'gs-svg' }
  switch (kind) {
    case 'periodic':
      // an archive of element drawers and a hanging lamp
      return (
        <svg {...common}>
          {defs}
          {Array.from({ length: 18 }, (_, c) =>
            Array.from({ length: 4 }, (_, r) => (
              <g key={`${c}-${r}`} className="gs-draw">
                <rect x={30 + c * 64} y={40 + r * 50} width="56" height="42" rx="3" fill={r % 2 ? `url(#${hatch})` : 'none'} />
                <rect x={50 + c * 64} y={56 + r * 50} width="16" height="6" rx="2" />
              </g>
            )),
          )}
          <g className="gs-lamp">
            <line x1="600" y1="0" x2="600" y2="30" />
            <path d="M570 30h60l-12 22h-36z" fill={`url(#${hatch})`} />
          </g>
        </svg>
      )
    case 'build':
      // a workshop wall: pegboard with tools and a molecule model
      return (
        <svg {...common}>
          {defs}
          {Array.from({ length: 30 }, (_, i) =>
            Array.from({ length: 5 }, (_, r) => <circle key={`${i}-${r}`} cx={20 + i * 40} cy={30 + r * 40} r="2" className="gs-dot" />),
          )}
          <g className="gs-draw">
            <path d="M120 40l40 120M150 40l-40 120" />
            <rect x="240" y="50" width="30" height="110" rx="4" fill={`url(#${hatch})`} />
            <path d="M880 60l80 0M920 60v100M900 160h40" />
            <circle cx="1040" cy="90" r="22" fill={`url(#${hatch})`} />
            <circle cx="1100" cy="130" r="14" />
            <circle cx="990" cy="140" r="14" />
            <path d="M1058 104l30 18M1024 106l-24 24" />
          </g>
        </svg>
      )
    case 'lab':
      // a laboratory shelf with glassware and a window
      return (
        <svg {...common}>
          {defs}
          <g className="gs-draw">
            <rect x="480" y="20" width="240" height="160" rx="4" />
            <path d="M600 20v160M480 100h240" />
            <line x1="0" y1="190" x2="1200" y2="190" />
            <path d="M60 190v-60h30v60M75 130v-40" />
            <path d="M150 190c-30 0-30-40-10-60v-40h20v40c20 20 20 60-10 60z" fill={`url(#${hatch})`} />
            <rect x="240" y="120" width="40" height="70" rx="4" fill={`url(#${hatch})`} />
            <path d="M880 190l20-80h10l20 80z" />
            <circle cx="1000" cy="160" r="30" fill={`url(#${hatch})`} />
            <path d="M1000 130v-40h-10M1080 190v-100h20v100" />
          </g>
          <g className="gs-bubbles">
            <circle cx="150" cy="120" r="3" />
            <circle cx="1000" cy="140" r="4" />
            <circle cx="260" cy="110" r="3" />
          </g>
        </svg>
      )
    default:
      // quiz: an arena / lecture hall with a big blackboard and stars
      return (
        <svg {...common}>
          {defs}
          <g className="gs-draw">
            <rect x="380" y="30" width="440" height="150" rx="4" fill={`url(#${hatch})`} />
            <path d="M400 60h140M400 90h220M400 120h100M640 60c40 40 80 40 120 0" />
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M${60 + i * 34} ${170 - (i % 2) * 20}l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z`} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <path key={`r${i}`} d={`M${870 + i * 34} ${160 - (i % 2) * 24}l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z`} />
            ))}
          </g>
        </svg>
      )
  }
}
