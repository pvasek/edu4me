import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ChemElement } from '../../courses/chemie/data/elements'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useLater, useNow } from '../shared/hooks'
import { PeriodicTable, type CellState } from '../shared/PeriodicTable'
import { levelNumber, timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { MAX_PER_ROUND, makeRounds } from './logic'
import './periodic-find.css'

const BONUS_MAX = 30
const BONUS_FULL = 5
const BONUS_ZERO = 15

type Phase = 'play' | 'right' | 'reveal'

export default function PeriodicFind({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId)
  const [rounds] = useState(() => makeRounds(level))
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<Phase>('play')
  const [wrong, setWrong] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [lastPts, setLastPts] = useState(0)
  const [msg, setMsg] = useState<{ kind: 'good' | 'bad' | 'warn'; text: string } | null>(null)
  const [roundStart, setRoundStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const found = useRef<string[]>([])
  const finish = useFinishOnce(onFinish)
  const later = useLater()
  const [cardRef, jolt] = useJolt()
  const now = useNow(phase === 'play', 200)

  const round = rounds[i]
  const secs = phase === 'play' ? Math.max(0, (now - roundStart) / 1000) : frozen
  const bonus = timeBonus(secs, BONUS_MAX, BONUS_FULL, BONUS_ZERO)

  const next = useCallback(() => {
    if (i + 1 >= rounds.length) {
      finish({ score: scoreRef.current, max: rounds.length * MAX_PER_ROUND, collected: [...found.current] })
      return
    }
    setI(i + 1)
    setPhase('play')
    setWrong([])
    setMsg(null)
    setLastPts(0)
    setRoundStart(Date.now())
  }, [i, rounds.length, finish])

  const pick = (el: ChemElement) => {
    if (phase !== 'play' || wrong.includes(el.z)) return
    if (el.z === round.el.z) {
      const t = (Date.now() - roundStart) / 1000
      setFrozen(t)
      const pts = wrong.length === 0 ? 100 + timeBonus(t, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 50
      scoreRef.current += pts
      setScore(scoreRef.current)
      setLastPts(pts)
      found.current.push(el.symbol)
      setPhase('right')
      setMsg({
        kind: 'good',
        text: `Správně! ${el.name} (${el.symbol}) má protonové číslo ${el.z}.${t < BONUS_FULL + 0.5 && wrong.length === 0 ? ' Bleskové!' : ''}`,
      })
      jolt.pop()
      later(next, 1200)
      return
    }
    const w = [...wrong, el.z]
    setWrong(w)
    jolt.shake()
    if (w.length >= 2) {
      setFrozen((Date.now() - roundStart) / 1000)
      setPhase('reveal')
      setMsg({
        kind: 'warn',
        text: `Tohle je ${el.name} (${el.symbol}). Hledaný prvek ${round.el.name} (${round.el.symbol}) svítí v tabulce.`,
      })
    } else {
      setMsg({ kind: 'bad', text: `Tohle je ${el.name} (${el.symbol}). Zkus to ještě jednou!` })
    }
  }

  const stateOf = (el: ChemElement): CellState => {
    if (el.z === round.el.z) {
      if (phase === 'right') return 'found'
      if (phase === 'reveal') return 'target'
    }
    if (wrong.includes(el.z)) return 'wrong'
    return 'normal'
  }

  const mood: Mood = phase === 'right' ? 'cheer' : phase === 'reveal' ? 'sad' : wrong.length ? 'wow' : 'think'
  const label =
    round.kind === 'name' ? 'Najdi prvek' : round.kind === 'symbol' ? 'Najdi prvek se značkou' : 'Najdi prvek podle nápovědy'

  return (
    <div className="g-sh-root g-pf">
      <p className="g-sh-instr">Ťukni v tabulce na zadaný prvek. Čím rychleji, tím víc bodů.</p>
      <Hud score={score} round={i + 1} rounds={rounds.length} seconds={secs} />

      <div ref={cardRef} className="card g-sh-prompt g-pf-prompt" aria-live="polite">
        <Mascot mood={mood} size={64} />
        <div className="g-sh-prompt-body">
          <span className="eyebrow">{label}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              className={`g-pf-target g-pf-${round.kind}`}
              key={i}
              variants={popIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
            >
              {round.text}
            </motion.span>
          </AnimatePresence>
          <div className="g-pf-bonus" aria-label={`Bonus za rychlost: ${phase === 'play' ? bonus : 0} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-pf-bonusbar">
              <span
                style={{
                  width: `${phase === 'play' && wrong.length === 0 ? (bonus / BONUS_MAX) * 100 : 0}%`,
                  ['--bar' as string]: 'var(--yellow)',
                }}
              />
            </div>
          </div>
        </div>
        {phase === 'right' && <PointsPop key={`p${i}`} points={lastPts} />}
      </div>

      <div className="g-pf-status">
        {msg ? (
          <Feedback kind={msg.kind} key={`${i}-${wrong.length}-${phase}`}>
            {msg.text}
          </Feedback>
        ) : (
          <p className="g-pf-tip note">Tip: čísla nahoře jsou skupiny, vlevo periody.</p>
        )}
        {phase === 'reveal' && (
          <button type="button" className="btn btn-primary" onClick={next} autoFocus>
            {i + 1 >= rounds.length ? 'Dokončit' : 'Další prvek'}
            <Icon name="arrowRight" />
          </button>
        )}
      </div>

      <PeriodicTable onPick={pick} stateOf={stateOf} showAxes zoomable disabled={phase !== 'play'} label="Periodická tabulka – vyber prvek" />
    </div>
  )
}
