import { useRef, useState } from 'react'
import type { Question } from '../core/types'
import { QuestionView, type QuestionControls } from './QuestionView'
import { Icon } from '../ui/Icon'
import { AnimatePresence, motion } from 'motion/react'
import { bump, slide, spring } from '../ui/motion'

/** Runs a list of questions one at a time and reports the score. */
export function QuizRunner({
  questions,
  onDone,
  label = 'Otázka',
}: {
  questions: Question[]
  onDone: (score: number, max: number) => void
  label?: string
}) {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [ready, setReady] = useState(false)
  const question = useRef<QuestionControls>(null)
  const [streak, setStreak] = useState(0)
  const q = questions[i]
  const last = i === questions.length - 1

  const next = () => {
    if (last) onDone(score, questions.length)
    else {
      setI(i + 1)
      setAnswered(false)
      setReady(false)
    }
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="quiz-count tabnum">
          {label} {i + 1} / {questions.length}
        </span>
        <div className="quiz-dots" aria-hidden="true">
          {questions.map((_, k) => (
            <motion.span key={k} className={k < i ? 'done' : k === i ? 'cur' : ''} animate={{ scaleY: k === i ? 1.5 : 1 }} transition={spring.snappy} />
          ))}
        </div>
        <AnimatePresence>
          {streak >= 2 && (
            <motion.span
              className="chip streak-chip"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={spring.bouncy}
            >
              <motion.span key={streak} animate={bump} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <Icon name="flame" style={{ color: 'var(--accent)' }} /> {streak}× v řadě
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" custom={1}>
      <motion.div key={i} className="card quiz-card" custom={1} variants={slide} initial="enter" animate="center" exit="exit">
        <QuestionView
          key={i}
          question={q}
          controls={question}
          onReadyChange={setReady}
          onAnswered={(ok) => {
            setAnswered(true)
            if (ok) {
              setScore((s) => s + 1)
              setStreak((s) => s + 1)
            } else setStreak(0)
          }}
        />
      </motion.div>
      </AnimatePresence>
      <div className="bottom-bar">
        {/* one button in one place: check the answer, then go on */}
        {answered ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={next}>
            {last ? 'Vyhodnotit' : 'Další otázka'} <Icon name="arrowRight" />
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-lg" disabled={!ready} onClick={() => question.current?.submit()}>
            Zkontrolovat <Icon name="check" />
          </button>
        )}
      </div>
    </div>
  )
}
