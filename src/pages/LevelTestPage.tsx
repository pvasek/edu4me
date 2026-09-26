import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseById, findLevel } from '../core/registry'
import { useLevelContent } from '../core/useLevelContent'
import { finishLevelTest, PASS_RATIO, starsFor } from '../core/progress'
import { QuizRunner } from '../lesson/QuizRunner'
import { Loading } from '../ui/Loading'
import { Mascot, MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { ElementTile } from '../ui/ElementTile'
import { Confetti, Stars } from '../ui/Confetti'
import { NotFound } from './NotFound'
import '../lesson/lesson.css'

export default function LevelTestPage() {
  const { courseId, levelId } = useParams()
  const course = courseById(courseId)
  const level = course && findLevel(course, levelId)
  const { content, error } = useLevelContent(level)
  const [phase, setPhase] = useState<'intro' | 'quiz' | { score: number; max: number; xp: number; passed: boolean }>('intro')
  const [run, setRun] = useState(0)
  if (!course || !level || error) return <NotFound />
  if (!content) return <Loading />
  const exit = `/c/${course.id}/l/${level.id}`
  const need = Math.ceil(content.boss.length * PASS_RATIO)

  return (
    <main className="lesson" style={{ ['--level' as string]: level.color }}>
      <div className="lesson-bar">
        <Link to={exit} className="icon-btn" aria-label="Zavřít výzvu">
          <Icon name="x" />
        </Link>
        <strong className="lesson-bar-title">Závěrečná výzva · {level.title}</strong>
      </div>
      <div className="lesson-body">
        {phase === 'intro' && (
          <section className="lesson-intro stack">
            <span className="eyebrow">Úroveň {level.number}</span>
            <h1>Závěrečná výzva</h1>
            <MascotSays mood="cheer" size={90}>
              <strong>{content.boss.length} otázek</strong> napříč celou úrovní. Na odznak potřebuješ aspoň <strong>{need} správně</strong>.
              Odměnou je prvek <strong>{level.symbol}</strong> do alba!
            </MascotSays>
            <div className="row">
              <ElementTile symbol={level.symbol} size="lg" />
            </div>
            <div className="bottom-bar">
              <button className="btn btn-primary btn-lg" onClick={() => setPhase('quiz')}>
                Přijímám výzvu <Icon name="trophy" />
              </button>
            </div>
          </section>
        )}
        {phase === 'quiz' && (
          <QuizRunner
            key={run}
            questions={content.boss}
            onDone={(score, max) => {
              const r = finishLevelTest(course.id, level.id, score, max, level.symbol)
              setPhase({ score, max, ...r })
            }}
          />
        )}
        {typeof phase === 'object' && (
          <section className="lesson-done stack">
            {phase.passed && <Confetti count={90} />}
            <Mascot mood={phase.passed ? 'cheer' : 'sad'} size={120} />
            <h1>{phase.passed ? 'Úroveň pokořena!' : 'Tentokrát to nevyšlo'}</h1>
            <Stars n={starsFor(phase.score, phase.max)} />
            <div className="row done-chips">
              <span className="chip">
                <Icon name="target" /> {phase.score} / {phase.max} správně
              </span>
              <span className="chip xp-chip">
                <Icon name="bolt" style={{ color: 'var(--yellow)' }} /> +{phase.xp} XP
              </span>
            </div>
            {!phase.passed && <p className="muted">Potřebuješ {need} správných odpovědí. Projdi si lekce a zkus to znovu.</p>}
            <div className="row done-actions">
              <button
                className="btn"
                onClick={() => {
                  setRun((r) => r + 1)
                  setPhase('quiz')
                }}
              >
                <Icon name="refresh" /> Znovu
              </button>
              <Link to={exit} className="btn btn-primary btn-lg">
                Zpět na úroveň <Icon name="arrowRight" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
