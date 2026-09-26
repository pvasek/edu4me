import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BY_SYMBOL, categoryVar } from '../../courses/chemie/data/elements'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, shake, spring, stagger } from '../../ui/motion'
import { Bump, Feedback, Hud, LevelChip } from '../shared/GameKit'
import { useFinishOnce, useLater, useNow } from '../shared/hooks'
import type { GameProps } from '../types'
import { dealRound, faceSize, memoryScore, plain, type MemCard, type MemRound, type RoundPair } from './logic'
import './element-memory.css'

/** Feedback wiggle on the wrapper around the flipping card (runs after the flip lands). */
const JIG = {
  rest: { scale: 1, x: 0 },
  match: { scale: [1, 1.12, 1], x: 0 },
  miss: { scale: 1, x: shake.x },
}
const JIG_T = { delay: 0.32, scale: { duration: 0.4, delay: 0.32 }, x: { ...shake.transition, delay: 0.32 } }

const text = (p: RoundPair, side: 'a' | 'b') => (side === 'a' ? p.a : p.b)
const other = (side: 'a' | 'b') => (side === 'a' ? 'b' : 'a')

export default function ElementMemory({ levelId, onFinish }: GameProps) {
  const [round] = useState<MemRound>(() => dealRound(levelId))
  const { cards, pairs: byKey } = round
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

  const collect = (keys: string[]) => [...new Set(keys.flatMap((k) => byKey[k].syms))]

  const tap = (idx: number) => {
    const c = cards[idx]
    if (done || matched.includes(c.pair) || open.includes(idx)) return
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
    const first = cards[open[0]]
    const pair = [open[0], idx]
    const m = moves + 1
    setMoves(m)
    setOpen(pair)
    if (first.pair === c.pair) {
      const p = byKey[c.pair]
      const nextMatched = [...matched, c.pair]
      setMatched(nextMatched)
      setOpen([])
      setLast({ kind: 'good', text: `Pár! ${p.a} – ${p.b}.${p.note ? ` ${p.note}` : ''}` })
      if (nextMatched.length === pairs) {
        setEnd(Date.now())
        setLast({ kind: 'good', text: `Hotovo! Všech ${pairs} párů za ${m} tahů.` })
        later(() => finish({ score: memoryScore(m, pairs), max: 100, collected: collect(nextMatched) }), 1400)
      }
    } else {
      setMiss(pair)
      const hint = (card: MemCard) => {
        const p = byKey[card.pair]
        return `${text(p, card.side)} – ${text(p, other(card.side))}`
      }
      const h1 = hint(first)
      const h2 = hint(c)
      setLast({
        kind: 'bad',
        text:
          plain(h1).length + plain(h2).length <= 70
            ? `Tohle k sobě nepatří: ${h1}, ${h2}.`
            : 'Tohle k sobě nepatří. Zapamatuj si, kde karty leží.',
      })
      missTimer.current = window.setTimeout(() => {
        missTimer.current = null
        setOpen([])
        setMiss([])
      }, round.long ? 1700 : 1100)
    }
  }

  const secs = ((end ?? now) - start) / 1000
  const mood: Mood = done ? 'cheer' : last?.kind === 'good' ? 'happy' : last?.kind === 'bad' ? 'think' : 'happy'
  const free = Math.ceil(pairs * 1.5)

  return (
    <div className="g-sh-root g-em">
      <p className="g-sh-instr">{round.instr} Méně tahů = víc bodů.</p>
      <Hud
        seconds={secs}
        extra={
          <>
            <LevelChip level={round.level} />
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
              <Md text={last.text} />
            </Feedback>
          ) : (
            <p className="note">Na plný počet bodů ti stačí {free} tahů. Zvládneš to?</p>
          )}
        </div>
      </div>

      <motion.div
        className={`g-em-grid g-em-n${cards.length}${round.long ? ' is-long' : ''}`}
        role="group"
        aria-label="Karty pexesa"
        variants={stagger(0.045, 0.1)}
        initial="hidden"
        animate="show"
      >
        {cards.map((c, idx) => {
          const p = byKey[c.pair]
          const face = text(p, c.side)
          const tag = c.side === 'a' ? p.tagA : p.tagB
          const el = c.side === 'a' && p.el ? BY_SYMBOL[p.el] : undefined
          const isMatched = matched.includes(c.pair)
          const up = isMatched || open.includes(idx)
          const bad = miss.includes(idx)
          const label = up
            ? `${el ? `${el.symbol}, ` : ''}${tag ? `${tag}: ` : ''}${plain(face)}${isMatched ? ', nalezený pár' : ''}`
            : `Karta ${idx + 1}, zakrytá`
          return (
            <motion.button
              key={c.id}
              type="button"
              className={`g-em-card${up ? ' is-up' : ''}${isMatched ? ' is-matched' : ''}${bad ? ' is-miss' : ''}`}
              onClick={() => tap(idx)}
              aria-label={label}
              aria-disabled={isMatched || undefined}
              style={el ? { ['--em-cat' as string]: categoryVar(el.category) } : undefined}
              variants={popIn}
              whileHover={up ? undefined : { y: -4, rotate: -1.2, transition: spring.snappy }}
              whileTap={up ? undefined : { scale: 0.94, transition: spring.snappy }}
            >
              <motion.span className="g-em-jig" animate={isMatched ? JIG.match : bad ? JIG.miss : JIG.rest} transition={JIG_T}>
                <motion.span className="g-em-inner" initial={false} animate={{ rotateY: up ? 180 : 0 }} transition={spring.gentle}>
                  <span className="g-em-face g-em-back" aria-hidden="true">
                    <Icon name="atom" />
                  </span>
                  <span className={`g-em-face g-em-front${el ? ' g-em-symbol' : ''}`} aria-hidden="true">
                    {el ? (
                      <>
                        <span className="g-em-z">{el.z}</span>
                        <span className={`g-em-sym${face !== el.symbol ? ' has-name' : ''}`}>{el.symbol}</span>
                        {face !== el.symbol && (
                          <span className="g-em-elname" lang="cs">
                            {face}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {tag && <span className="g-em-tag">{tag}</span>}
                        <span className={`g-em-name g-em-fs-${faceSize(face)}`} lang="cs">
                          <Md text={face} />
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
