import { motion } from 'motion/react'
import type { IconItem } from '../../core/types'
import { Md } from '../../core/markup'
import { popIn, spring, stagger } from '../../ui/motion'
import { Medal } from './Medal'
import '../illustrations.css'

/** Grid of "specimen cards": icon medallion, italic title, short text. */
export function IconList({ items }: { items: IconItem[] }) {
  return (
    <div className="il-iconlist">
      <motion.ul
        className="il-iconlist-grid"
        variants={stagger(0.07, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {items.map((it, i) => (
          <motion.li
            key={i}
            className="il-spec"
            variants={popIn}
            whileHover={{ y: -4, transition: spring.snappy }}
          >
            <span className="il-spec-no" aria-hidden="true">
              №&nbsp;{i + 1}
            </span>
            <Medal icon={it.icon} />
            <div className="il-spec-body">
              <div className="il-spec-title">
                <Md text={it.title} />
              </div>
              {it.text && (
                <div className="il-spec-text">
                  <Md text={it.text} />
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
