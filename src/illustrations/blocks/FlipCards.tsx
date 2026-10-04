import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { FlipCard } from '../../core/types'
import { Md, plain } from '../../core/markup'
import { popRow, spring, stagger } from '../../ui/motion'
import { ChemIconView } from '../ChemIcon'
import { SpecimenView } from '../specimens'
import './flipcards.css'

/**
 * Specimen cards: a big engraved picture and the name on the front,
 * the explanation on the back. Tap (or Enter/Space) flips a card.
 * Counts how many cards the learner has turned over.
 */
export function FlipCards({ cards }: { cards: FlipCard[] }) {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set())
  const [seen, setSeen] = useState<Set<number>>(() => new Set())

  const toggle = (i: number) => {
    setFlipped((f) => {
      const n = new Set(f)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)))
  }
  const allFlipped = flipped.size === cards.length
  const flipAll = () => {
    if (allFlipped) setFlipped(new Set())
    else {
      setFlipped(new Set(cards.map((_, i) => i)))
      setSeen(new Set(cards.map((_, i) => i)))
    }
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(i)
    }
  }

  return (
    <div className="fc">
      <div className="fc-head">
        <span className="fc-hint">Klepni na kartu a otoč ji.</span>
        <span className="chip tabnum">
          Prohlédnuto {seen.size}/{cards.length}
        </span>
        <button type="button" className="btn btn-sm btn-ghost" onClick={flipAll}>
          {allFlipped ? 'Otočit zpět' : 'Otočit vše'}
        </button>
      </div>
      <motion.div className="fc-grid" variants={stagger(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
        {cards.map((c, i) => {
          const on = flipped.has(i)
          return (
            <motion.div key={i} className="fc-slot" variants={popRow}>
              <div
                className={`fc-card${on ? ' is-flipped' : ''}${seen.has(i) ? ' is-seen' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={on ? `${plain(c.title)}: ${plain(c.text)}` : `${plain(c.title)} – otoč kartu`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <motion.div className="fc-inner" animate={{ rotateY: on ? 180 : 0 }} transition={spring.gentle}>
                  <div className="fc-face fc-front" aria-hidden={on}>
                    <span className="fc-no tabnum">№ {i + 1}</span>
                    <div className="fc-art">
                      {c.art ? <SpecimenView id={c.art} /> : c.icon ? <ChemIconView name={c.icon} size={72} /> : null}
                    </div>
                    <span className="fc-title">
                      <Md text={c.title} />
                    </span>
                    <span className="fc-turn" aria-hidden="true">
                      ↻
                    </span>
                  </div>
                  <div className="fc-face fc-back" aria-hidden={!on}>
                    <span className="fc-title">
                      <Md text={c.title} />
                    </span>
                    <p className="fc-text">
                      <Md text={c.text} />
                    </p>
                    <span className="fc-turn" aria-hidden="true">
                      ↺
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      <AnimatePresence>
        {seen.size === cards.length && (
          <motion.p className="fc-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring.bouncy}>
            ✓ Všechny karty prohlédnuté
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
