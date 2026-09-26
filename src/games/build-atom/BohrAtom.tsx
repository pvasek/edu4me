import { motion } from 'motion/react'
import { simpleShells } from '../../courses/chemie/data/elements'
import { spring } from '../../ui/motion'

const C = 150
const SHELL_R = [64, 90, 115, 139]

/** Sunflower (golden-angle) packing for the nucleus. */
function nucleonPos(k: number, total: number) {
  const spread = total > 30 ? 4.6 : total > 12 ? 5.2 : 5.8
  const r = spread * Math.sqrt(k + 0.4)
  const t = k * 2.39996
  return { x: r * Math.cos(t), y: r * Math.sin(t) }
}

/**
 * Bohr-style atom: nucleus of protons/neutrons and electrons on shells
 * (2-8-8-2 school model). Particles glide into place when counts change.
 */
export function BohrAtom({ p, n, e, label }: { p: number; n: number; e: number; label: string }) {
  // interleave so protons and neutrons are mixed
  const nucleons: ('p' | 'n')[] = []
  for (let k = 0; k < Math.max(p, n); k++) {
    if (k < p) nucleons.push('p')
    if (k < n) nucleons.push('n')
  }
  const total = nucleons.length
  const counters = { p: 0, n: 0 }
  const shells = simpleShells(e)
  const edge = total ? nucleonPos(total - 1, total) : { x: 0, y: 0 }
  const glowR = total ? Math.hypot(edge.x, edge.y) + 12 : 0

  return (
    <svg className="g-ba-svg" viewBox="0 0 300 300" role="img" aria-label={label}>
      {SHELL_R.map((r, i) => (
        <circle
          key={r}
          cx={C}
          cy={C}
          r={r}
          className={`g-ba-shell${i < shells.length ? ' is-on' : ''}`}
        />
      ))}
      <motion.circle cx={C} cy={C} className="g-ba-glow" initial={false} animate={{ r: glowR }} transition={spring.bouncy} />
      <g className="g-ba-nucleus">
        {nucleons.map((kind, k) => {
          const idx = counters[kind]++
          const { x, y } = nucleonPos(k, total)
          return (
            <motion.circle
              key={`${kind}${idx}`}
              cx={C}
              cy={C}
              r={6}
              className={`g-ba-${kind}`}
              initial={{ scale: 0, x, y }}
              animate={{ scale: 1, x, y }}
              transition={spring.snappy}
            />
          )
        })}
      </g>
      {shells.map((count, s) => (
        <g key={s} className={`g-ba-orbit g-ba-orbit-${s}`}>
          {Array.from({ length: count }, (_, j) => {
            const deg = (360 / count) * j + s * 17
            const R = SHELL_R[s]
            return (
              // The invisible ring makes the group's box centred on the nucleus,
              // so rotating it moves the electron along its shell.
              <motion.g
                key={j}
                initial={{ rotate: deg - 50, opacity: 0 }}
                animate={{ rotate: deg, opacity: 1 }}
                transition={spring.gentle}
              >
                <circle cx={C} cy={C} r={R + 7} fill="none" stroke="none" />
                <motion.circle
                  cx={C + R}
                  cy={C}
                  r={6.5}
                  className="g-ba-e"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={spring.bouncy}
                />
              </motion.g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}
