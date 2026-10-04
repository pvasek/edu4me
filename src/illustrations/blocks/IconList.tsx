import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import type { IconItem } from '../../core/types'
import { Md } from '../../core/markup'
import { popRow, spring, stagger } from '../../ui/motion'
import { CardViewer, useCardViewer } from '../../ui/CardViewer'
import { Medal } from './Medal'
import '../illustrations.css'

/** Grid of "specimen cards": icon medallion, italic title, short text. Tap a card to open it big. */
export function IconList({ items }: { items: IconItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const viewer = useCardViewer()
  return (
    <div className="il-iconlist" ref={ref}>
      <motion.ul
        className="il-iconlist-grid"
        variants={stagger(0.07, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {items.map((it, i) => (
          <motion.li key={i} variants={popRow}>
            <motion.button
              type="button"
              className="il-spec"
              whileHover={{ y: -4, transition: spring.snappy }}
              whileTap={{ scale: 0.97 }}
              onClick={() => viewer.openAt(i, ref.current)}
              aria-haspopup="dialog"
            >
              <span className="il-spec-no" aria-hidden="true">
                №&nbsp;{i + 1} <span className="il-spec-open">⤢</span>
              </span>
              <Medal icon={it.icon} />
              <span className="il-spec-body">
                <span className="il-spec-title">
                  <Md text={it.title} />
                </span>
                {it.text && (
                  <span className="il-spec-text">
                    <Md text={it.text} />
                  </span>
                )}
              </span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
      <AnimatePresence>
        {viewer.open !== null && (
          <CardViewer
            cards={items.map((it) => ({ icon: it.icon, title: it.title, text: it.text }))}
            index={viewer.open}
            onIndex={viewer.setOpen}
            onClose={viewer.close}
            tone={viewer.tone}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
