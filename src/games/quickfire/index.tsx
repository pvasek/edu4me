import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import { levelNum, type GameProps } from '../types'
import { shuffle } from '../../core/check'
import { Md } from '../../core/markup'
import { courseById } from '../../core/registry'
import { Icon } from '../../ui/Icon'
import { Mascot, MascotSays, type Mood } from '../../ui/Mascot'
import { bump, ease, popIn, rise, shake, slide, spring } from '../../ui/motion'
import { playLevel, quickfirePool, type QfItem } from './pool'
import './quickfire.css'

type Phase = 'loading' | 'empty' | 'play' | 'over'

const DURATION = 60_000
const RING_R = 44
const RING_C = 2 * Math.PI * RING_R

/** Points for the next correct answer given the current streak. */
const multiplier = (streak: number) => (streak >= 6 ? 3 : streak >= 3 ? 2 : 1)


/** Answer options: rise in one after another, bump when right, shake when wrong. */
const optVariants = {
  hidden: rise.hidden,
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, ease: ease.out, delay: 0.08 + i * 0.05 } }),
  ok: { opacity: 1, y: 0, scale: bump.scale, transition: bump.transition },
  bad: { opacity: 1, y: 0, x: shake.x, transition: shake.transition },
}

interface Feedback {
  ok: boolean
  /** Picked option: index into question.options, or the boolean for tf. */
  picked: number | boolean
  gain: number
}

export default function Quickfire({ courseId, levelId, onFinish }: GameProps) {
  const course = courseById(courseId)!
  const [phase, setPhase] = useState<Phase>('loading')
  const pool = useRef<QfItem[]>([])
  const [item, setItem] = useState<QfItem | null>(null)
  const question = item?.question ?? null
  const level = levelNum(playLevel(levelId, courseId))
  const [qKey, setQKey] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [perfect, setPerfect] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const finished = useRef(false)
  const queue = useRef<QfItem[]>([])
  const last = useRef<QfItem | null>(null)
  const advanceTimer = useRef<number | undefined>(undefined)
  const result = useRef({ score: 0, perfect: 0 })
  const ringOffset = useMotionValue(0)

  const finish = useCallback(
    (score: number, max: number) => {
      if (finished.current) return
      finished.current = true
      onFinish({ score, max })
    },
    [onFinish],
  )

  const nextQuestion = useCallback(() => {
    if (!queue.current.length) {
      let q = shuffle(pool.current)
      // Avoid the same question twice in a row across reshuffles.
      if (q.length > 1 && q[0] === last.current) q = [...q.slice(1), q[0]]
      queue.current = q
    }
    const q = queue.current.shift() ?? null
    last.current = q
    setItem(q)
    setQKey((k) => k + 1)
    setFeedback(null)
  }, [])

  // Load the question pool.
  useEffect(() => {
    let alive = true
    quickfirePool(course, levelId)
      .catch(() => [])
      .then((items) => {
        if (!alive) return
        pool.current = items
        if (!pool.current.length) {
          setPhase('empty')
          return
        }
        nextQuestion()
        setPhase('play')
      })
    return () => {
      alive = false
    }
  }, [levelId, nextQuestion])

  // Countdown: the ring drains smoothly over the whole minute, the number ticks.
  useEffect(() => {
    if (phase !== 'play') return
    ringOffset.set(0)
    const ring = animate(ringOffset, RING_C, { duration: DURATION / 1000, ease: 'linear' })
    const start = performance.now()
    const id = window.setInterval(() => {
      const rest = Math.max(0, DURATION - (performance.now() - start))
      setLeft(rest)
      if (rest <= 0) {
        window.clearInterval(id)
        setPhase('over')
      }
    }, 100)
    return () => {
      window.clearInterval(id)
      ring.stop()
    }
  }, [phase, ringOffset])

  // Round over: short "time's up" moment, then report.
  useEffect(() => {
    if (phase !== 'over') return
    window.clearTimeout(advanceTimer.current)
    const id = window.setTimeout(() => finish(result.current.score, Math.max(1, result.current.perfect)), 1600)
    return () => window.clearTimeout(id)
  }, [phase, finish])

  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  const answer = useCallback(
    (picked: number | boolean) => {
      if (phase !== 'play' || !question || feedback) return
      const ok = picked === question.answer
      const gain = ok ? multiplier(streak) : 0
      const nextScore = score + gain
      const nextPerfect = perfect + multiplier(answered)
      result.current = { score: nextScore, perfect: nextPerfect }
      setScore(nextScore)
      setPerfect(nextPerfect)
      setAnswered((n) => n + 1)
      setStreak(ok ? streak + 1 : 0)
      setFeedback({ ok, picked, gain })
      advanceTimer.current = window.setTimeout(nextQuestion, ok ? 550 : 1300)
    },
    [phase, question, feedback, streak, score, perfect, answered, nextQuestion],
  )

  // Option order for choice questions (shuffled per appearance).
  const order = useMemo(
    () => (question?.kind === 'choice' ? shuffle(question.options.map((_, i) => i)) : []),
    [question],
  )

  // Keyboard: 1–4 / A–D for options, ←/→ (or N/P) for true/false.
  useEffect(() => {
    if (phase !== 'play' || !question) return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const k = e.key.toLowerCase()
      if (question.kind === 'tf') {
        if (k === 'arrowleft' || k === 'n') answer(false)
        else if (k === 'arrowright' || k === 'p') answer(true)
        else return
        e.preventDefault()
        return
      }
      let pos = -1
      if (/^[1-9]$/.test(k)) pos = Number(k) - 1
      else if (/^[a-g]$/.test(k)) pos = k.charCodeAt(0) - 97
      if (pos >= 0 && pos < order.length) {
        e.preventDefault()
        answer(order[pos])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, question, order, answer])

  if (phase === 'loading') {
    return (
      <div className="g-qf g-qf-center">
        <MascotSays mood="think">Chystám otázky…</MascotSays>
      </div>
    )
  }

  if (phase === 'empty') {
    return (
      <div className="g-qf g-qf-center">
        <MascotSays mood="sad">
          Pro tuhle úroveň tu zatím nemám žádné otázky. Brzy je doplníme, zkus to prosím později!
        </MascotSays>
        <button type="button" className="btn btn-primary" onClick={() => finish(0, 1)}>
          Rozumím
        </button>
      </div>
    )
  }

  const secs = Math.ceil(left / 1000)
  const mult = multiplier(streak)
  const urgent = secs <= 10
  const mood: Mood =
    phase === 'over' ? 'wow' : feedback ? (feedback.ok ? (mult >= 3 ? 'cheer' : 'happy') : 'sad') : mult >= 2 ? 'cheer' : 'think'

  return (
    <div className="g-qf">
      <div className="g-qf-top">
        <p className="g-qf-instr">Odpovídej jedním klepnutím. Tři správně v řadě a body se násobí!</p>
        <span className="chip chip-soft g-qf-level" title={level ? `Otázky z úrovně ${level}` : 'Otázky ze všech úrovní'}>
          <Icon name="book" /> {level ? `Úroveň ${level}` : 'Vše'}
        </span>
      </div>

      <div className="g-qf-hud">
        <div
          className={`g-qf-ring${urgent ? ' urgent' : ''}`}
          role="timer"
          aria-label={`Zbývá ${secs} sekund`}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r={RING_R} className="g-qf-ring-track" />
            <motion.circle
              cx="50"
              cy="50"
              r={RING_R}
              className="g-qf-ring-bar"
              strokeDasharray={RING_C}
              style={{ strokeDashoffset: ringOffset }}
            />
          </svg>
          <motion.span
            className="g-qf-ring-num tabnum"
            key={urgent ? secs : 'n'}
            initial={urgent ? { scale: 1.4 } : false}
            animate={{ scale: 1 }}
            transition={spring.bouncy}
          >
            {secs}
          </motion.span>
        </div>

        <div className="g-qf-score">
          <span className="g-qf-score-label">Body</span>
          <motion.span
            className="g-qf-score-num tabnum"
            key={score}
            initial={score ? { scale: 1.3 } : false}
            animate={{ scale: 1 }}
            transition={spring.bouncy}
          >
            {score}
          </motion.span>
          {feedback?.ok && (
            <motion.span
              className="g-qf-gain"
              key={`g${qKey}`}
              initial={{ opacity: 0, y: 6, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: [6, 0, -22], scale: [0.6, 1.15, 1] }}
              transition={{ duration: 0.8, times: [0, 0.25, 1] }}
            >
              +{feedback.gain}
            </motion.span>
          )}
        </div>

        <div className="g-qf-combo">
          {mult > 1 ? (
            <motion.span
              className={`chip g-qf-mult x${mult}`}
              key={mult}
              initial={{ scale: 0.4, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={spring.bouncy}
            >
              <Icon name="flame" /> ×{mult}
            </motion.span>
          ) : (
            <span className="chip chip-soft g-qf-streak">
              <Icon name="bolt" /> {streak}/3
            </span>
          )}
          <Mascot mood={mood} size={52} />
        </div>
      </div>

      <div className="g-qf-stage">
        <AnimatePresence mode="popLayout" initial={false} custom={1}>
          {question && (
            <motion.div
              className={`g-qf-card card${feedback ? (feedback.ok ? ' ok' : ' bad') : ''}`}
              key={qKey}
              aria-live="polite"
              custom={1}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {item?.review && (
                <span className="g-qf-review" title="Otázka z předchozí úrovně">
                  <Icon name="refresh" /> opakování
                </span>
              )}
              <div className="g-qf-q">
                <Md text={question.q} />
              </div>

              {question.kind === 'tf' ? (
                <div className="g-qf-tf">
                  {[false, true].map((b) => {
                    const right = !!feedback && question.answer === b
                    const wrong = !!feedback && feedback.picked === b && question.answer !== b
                    return (
                      <motion.button
                        key={String(b)}
                        type="button"
                        className={`g-qf-opt g-qf-tf-btn${right ? ' right' : ''}${wrong ? ' wrong' : ''}`}
                        onClick={() => answer(b)}
                        disabled={!!feedback || phase !== 'play'}
                        custom={b ? 1 : 0}
                        variants={optVariants}
                        initial="hidden"
                        animate={wrong ? 'bad' : right ? 'ok' : 'show'}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon name={b ? 'check' : 'x'} />
                        {b ? 'Pravda' : 'Nepravda'}
                        <span className="g-qf-kbd" aria-hidden="true">
                          {b ? '→' : '←'}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div className="g-qf-opts">
                  {order.map((i, pos) => {
                    const right = !!feedback && question.answer === i
                    const wrong = !!feedback && feedback.picked === i && question.answer !== i
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        className={`g-qf-opt${right ? ' right' : ''}${wrong ? ' wrong' : ''}`}
                        onClick={() => answer(i)}
                        disabled={!!feedback || phase !== 'play'}
                        custom={pos}
                        variants={optVariants}
                        initial="hidden"
                        animate={wrong ? 'bad' : right ? 'ok' : 'show'}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="g-qf-key" aria-hidden="true">
                          {right ? <Icon name="check" /> : wrong ? <Icon name="x" /> : pos + 1}
                        </span>
                        <span>
                          <Md text={question.options[i]} />
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {feedback && (
                <motion.div
                  className={`g-qf-flash ${feedback.ok ? 'ok' : 'bad'}`}
                  role="status"
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={spring.snappy}
                >
                  <Icon name={feedback.ok ? 'check' : 'x'} />
                  {feedback.ok ? (feedback.gain > 1 ? `Správně! +${feedback.gain}` : 'Správně!') : 'Vedle! Správná odpověď svítí zeleně.'}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === 'over' && (
          <motion.div
            className="g-qf-over"
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="g-qf-over-box" variants={popIn} initial="hidden" animate="show">
              <Icon name="clock" />
              <span>Čas vypršel!</span>
              <span className="g-qf-over-score">{score} b.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
