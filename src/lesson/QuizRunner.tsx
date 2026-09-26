import { useState } from 'react'
import type { Question } from '../core/types'
import { QuestionView } from './QuestionView'
import { Icon } from '../ui/Icon'

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
  const [streak, setStreak] = useState(0)
  const q = questions[i]
  const last = i === questions.length - 1

  const next = () => {
    if (last) onDone(score, questions.length)
    else {
      setI(i + 1)
      setAnswered(false)
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
            <span key={k} className={k < i ? 'done' : k === i ? 'cur' : ''} />
          ))}
        </div>
        {streak >= 2 && (
          <span className="chip streak-chip">
            <Icon name="flame" style={{ color: 'var(--accent)' }} /> {streak}× v řadě
          </span>
        )}
      </div>
      <div className="card quiz-card">
        <QuestionView
          key={i}
          question={q}
          onAnswered={(ok) => {
            setAnswered(true)
            if (ok) {
              setScore((s) => s + 1)
              setStreak((s) => s + 1)
            } else setStreak(0)
          }}
        />
      </div>
      <div className="bottom-bar">
        <button type="button" className="btn btn-primary btn-lg" disabled={!answered} onClick={next}>
          {last ? 'Vyhodnotit' : 'Další otázka'} <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  )
}
