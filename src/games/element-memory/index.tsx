import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BY_SYMBOL, categoryVar } from '../../courses/chemie/data/elements'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, shake, spring, stagger } from '../../ui/motion'
import { Bump, Feedback, Hud } from '../shared/GameKit'
import { useFinishOnce, useLater, useNow } from '../shared/hooks'
import { levelNumber } from '../shared/util'
import type { GameProps } from '../types'
import { dealCards, memoryScore, type MemCard } from './logic'
import './element-memory.css'

/** Feedback wiggle on the wrapper around the flipping card (runs after the flip lands). */
const JIG = {
  rest: { scale: 1, x: 0 },
  match: { scale: [1, 1.12, 1], x: 0 },
  miss: { scale: 1, x: shake.x },
}
const JIG_T = { delay: 0.32, scale: { duration: 0.4, delay: 0.32 }, x: { ...shake.transition, delay: 0.32 } }

export default function ElementMemory({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId)
  const [cards] = useState<MemCard[]>(() => dealCards(level))
  const pairs = cards.length / 2
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [miss, setMiss] = useState<number[]>([])
  const [last, setLast] = useState<{ kind: 'good' | 'bad'; text: string } | null>(null)
  const [start] = useState(() => Date.now())
  const [end, setEnd] = useState<number | null>(null)
  const missTimer = useRef<number | null>(null)
  const finish = useFinishOnce(onFinish)
  const later = useLater()
  const now = useNow(end === null, 500)
  const done = matched.length === pairs

  useEffect(
    () => () => {
      if (missTimer.current) window.clearTimeout(missTimer.current)
    },
    [],
  )

  const flipBack = () => {
    if (missTimer.current) window.clearTimeout(missTimer.current)
    missTimer.current = null
    setOpen([])
    setMiss([])
  }

  const tap = (idx: number) => {
    const c = cards[idx]
    if (done || matched.includes(c.sym) || open.includes(idx)) return
    // a third tap while a wrong pair is showing: hide it right away
    if (open.length === 2) {
      flipBack()
      setOpen([idx])
      return
    }
    if (open.length === 0) {
      setOpen([idx])
      return
    }
    const a = cards[open[0]]
    const pair = [open[0], idx]
    const m = moves + 1
    setMoves(m)
    setOpen(pair)
    const el = BY_SYMBOL[c.sym]
    if (a.sym === c.sym) {
      const nextMatched = [...matched, c.sym]
      setMatched(nextMatched)
      setOpen([])
      setLast({ kind: 'good', text: `Pár! ${el.symbol} je ${el.name.toLowerCase()}.` })
      if (nextMatched.length === pairs) {
        setEnd(Date.now())
        setLast({ kind: 'good', text: `Hotovo! Všech ${pairs} párů za ${m} tahů.` })
        later(() => finish({ score: memoryScore(m, pairs), max: 100, collected: [...nextMatched] }), 1400)
      }
    } else {
      setMiss(pair)
      const e1 = BY_SYMBOL[a.sym]
      const describe = (card: MemCard, e: typeof el) => (card.face === 'symbol' ? `${e.symbol} = ${e.name.toLowerCase()}` : `${e.name} = ${e.symbol}`)
      setLast({ kind: 'bad', text: `Tohle k sobě nepatří: ${describe(a, e1)}, ${describe(c, el)}.` })
      missTimer.current = window.setTimeout(() => {
        missTimer.current = null
        setOpen([])
        setMiss([])
      }, 1100)
    }
  }

  const secs = ((end ?? now) - start) / 1000
  const mood: Mood = done ? 'cheer' : last?.kind === 'good' ? 'happy' : last?.kind === 'bad' ? 'think' : 'happy'
  const free = Math.ceil(pairs * 1.5)

  return (
    <div className="g-sh-root g-em">
      <p className="g-sh-instr">Otáčej karty a spoj značku prvku s jeho českým názvem. Méně tahů = víc bodů.</p>
      <Hud
        seconds={secs}
        extra={
          <>
            <span className="chip g-sh-hud-chip">
              <Icon name="refresh" />
              <span>
                Tahy <Bump value={moves} />
              </span>
            </span>
            <span className="chip g-sh-hud-chip">
              <Icon name="check" />
              <span>
                Páry <Bump value={matched.length} />/{pairs}
              </span>
            </span>
          </>
        }
      />
      <div className="g-em-talk">
        <Mascot mood={mood} size={52} />
        <div className="g-em-talk-text">
          {last ? (
            <Feedback kind={last.kind} key={`${moves}-${matched.length}`}>
              {last.text}
            </Feedback>
          ) : (
            <p className="note">Na plný počet bodů ti stačí {free} tahů. Zvládneš to?</p>
          )}
        </div>
      </div>

      <motion.div
        className={`g-em-grid g-em-n${cards.length}`}
        role="group"
        aria-label="Karty pexesa"
        variants={stagger(0.045, 0.1)}
        initial="hidden"
        animate="show"
      >
        {cards.map((c, idx) => {
          const el = BY_SYMBOL[c.sym]
          const isMatched = matched.includes(c.sym)
          const up = isMatched || open.includes(idx)
          const bad = miss.includes(idx)
          const label = up
            ? `${c.face === 'symbol' ? `Značka ${el.symbol}` : `Název ${el.name}`}${isMatched ? ', nalezený pár' : ''}`
            : `Karta ${idx + 1}, zakrytá`
          return (
            <motion.button
              key={c.id}
              type="button"
              className={`g-em-card${up ? ' is-up' : ''}${isMatched ? ' is-matched' : ''}${bad ? ' is-miss' : ''}`}
              onClick={() => tap(idx)}
              aria-label={label}
              aria-disabled={isMatched || undefined}
              style={{ ['--em-cat' as string]: categoryVar(el.category) }}
              variants={popIn}
              whileHover={up ? undefined : { y: -4, rotate: -1.2, transition: spring.snappy }}
              whileTap={up ? undefined : { scale: 0.94, transition: spring.snappy }}
            >
              <motion.span
                className="g-em-jig"
                animate={isMatched ? JIG.match : bad ? JIG.miss : JIG.rest}
                transition={JIG_T}
              >
              <motion.span
                className="g-em-inner"
                initial={false}
                animate={{ rotateY: up ? 180 : 0 }}
                transition={spring.gentle}
              >
                <span className="g-em-face g-em-back" aria-hidden="true">
                  <Icon name="atom" />
                </span>
                <span className={`g-em-face g-em-front g-em-${c.face}`} aria-hidden="true">
                  {c.face === 'symbol' ? (
                    <>
                      <span className="g-em-z">{el.z}</span>
                      <span className="g-em-sym">{el.symbol}</span>
                    </>
                  ) : (
                    <>
                      <span className="g-em-tag">název</span>
                      <span className="g-em-name" lang="cs">
                        {el.name}
                      </span>
                    </>
                  )}
                  {isMatched && (
                    <motion.span
                      className="g-em-ok"
                      initial={{ scale: 0, rotate: -60 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ ...spring.bouncy, delay: 0.3 }}
                    >
                      <Icon name="check" />
                    </motion.span>
                  )}
                </span>
              </motion.span>
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
