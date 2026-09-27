import { Fragment } from 'react'
import { motion, type Variants } from 'motion/react'
import type { CompareColumn } from '../../core/types'
import { Md } from '../../core/markup'
import { ease, rise, spring } from '../../ui/motion'
import { Medal } from './Medal'
import '../illustrations.css'

const DEFAULT_TONES = ['a', 'b', 'c'] as const

const plate: Variants = {
  hidden: (side: number) => ({ opacity: 0, x: side * 40, y: side === 0 ? 20 : 0 }),
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: ease.out } },
}
const seal: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -30 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { ...spring.bouncy, delay: 0.3 } },
}

/** Engraved bullet: a small ringed dot. */
function Bullet() {
  return (
    <svg className="il-bullet" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="7" r="2.2" fill="currentColor" />
    </svg>
  )
}

/** 2–3 columns side by side as facing plates with a "vs" seal between them. */
export function Compare({ columns }: { columns: CompareColumn[] }) {
  const n = columns.length
  return (
    <div className="il-compare">
      <motion.div
        className="il-compare-grid"
        data-n={n}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {columns.map((c, i) => {
          const tone = c.tone ?? DEFAULT_TONES[i] ?? 'a'
          const side = n === 1 ? 0 : i === 0 ? -1 : i === n - 1 ? 1 : 0
          return (
            <Fragment key={i}>
              {i > 0 && (
                <motion.div className="il-vs" variants={seal} aria-hidden="true">
                  <span className="il-seal">vs</span>
                </motion.div>
              )}
              <motion.section className={`il-plate il-tone-${tone}`} custom={side} variants={plate}>
                <header className="il-plate-head">
                  {c.icon && <Medal icon={c.icon} size="sm" />}
                  <h4 className="il-plate-title">
                    <Md text={c.title} />
                  </h4>
                </header>
                <motion.ul className="il-points" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}>
                  {c.points.map((p, j) => (
                    <motion.li key={j} variants={rise}>
                      <Bullet />
                      <span>
                        <Md text={p} />
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.section>
            </Fragment>
          )
        })}
      </motion.div>
    </div>
  )
}
