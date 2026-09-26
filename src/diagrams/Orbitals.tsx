import { motion, type Variants } from 'motion/react'
import { Md } from '../core/markup'
import { BY_Z } from '../courses/chemie/data/elements'
import { CAPACITY, configMarkup, electronConfig, shorthandMarkup } from '../courses/chemie/data/electronConfig'
import { spring } from '../ui/motion'
import { Fallback, int, type DiagramProps } from './util'

/** Boxes of one subshell filled by Hund's rule: [up, down] per box. */
export function hundBoxes(e: number, boxes: number): [boolean, boolean][] {
  return Array.from({ length: boxes }, (_, i) => [e > i, e > i + boxes])
}

const spinIn: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 0 },
  show: (delay: number) => ({ opacity: 1, scale: 1, transition: { ...spring.bouncy, delay } }),
}

function Spin({ up, delay }: { up: boolean; delay: number }) {
  return (
    <motion.svg
      className={`dg-spin ${up ? 'dg-spin-up' : 'dg-spin-down'}`}
      viewBox="0 0 10 28"
      aria-hidden="true"
      variants={spinIn}
      custom={delay / 1000}
    >
      {up ? <path d="M5 26V3M5 3 0.8 10" /> : <path d="M5 2V25M5 25 9.2 18" />}
    </motion.svg>
  )
}

export default function Orbitals({ props }: DiagramProps) {
  const z = int(props.z)
  const el = z !== undefined ? BY_Z[z] : undefined
  if (!el) return <Fallback id="orbitals" reason="neplatné z" />
  const cfg = electronConfig(el.z)
  const step = Math.min(70, 2200 / el.z)
  let idx = 0
  let unpaired = 0
  const groups = cfg.map((s) => {
    const n = CAPACITY[s.l] / 2
    const boxes = hundBoxes(s.e, n)
    unpaired += boxes.filter(([u, d]) => u !== d).length
    // delays in filling order: first all ups, then downs
    const base = idx
    idx += s.e
    return { s, boxes, base, n }
  })
  const plainCfg = cfg.map((s) => `${s.n}${s.l}${s.e}`).join(' ')

  return (
    <div className="dg dg-orb" role="img" aria-label={`Orbitalový diagram: ${el.name} (${el.symbol}), ${plainCfg}. Nepárových elektronů: ${unpaired}.`}>
      <div className="dg-orb-head" aria-hidden="true">
        <span className="dg-orb-sym">{el.symbol}</span>
        <span className="mono">Z = {el.z}</span>
        <span className="muted">{el.name}</span>
      </div>
      <motion.div className="dg-orb-row" aria-hidden="true" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        {groups.map(({ s, boxes, base, n }) => (
          <div className="dg-orb-sub" key={`${s.n}${s.l}`}>
            <div className="dg-orb-boxes">
              {boxes.map(([u, d], i) => (
                <span className="dg-orb-box" key={i}>
                  {u && <Spin up delay={(base + i) * step} />}
                  {d && <Spin up={false} delay={(base + n + i) * step} />}
                </span>
              ))}
            </div>
            <span className="dg-orb-lab">
              {s.n}
              {s.l}
            </span>
          </div>
        ))}
      </motion.div>
      <p className="dg-orb-cfg" aria-hidden="true">
        <Md text={configMarkup(cfg)} />
      </p>
      <p className="dg-orb-note" aria-hidden="true">
        {el.z > 2 && (
          <span>
            zkráceně <Md text={shorthandMarkup(el.z)} />
          </span>
        )}
        <span className="hand">nepárové elektrony: {unpaired}</span>
      </p>
    </div>
  )
}
