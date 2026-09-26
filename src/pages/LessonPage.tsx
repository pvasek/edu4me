import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { courseById, findLevel } from '../core/registry'
import { useLevelContent } from '../core/useLevelContent'
import { completeLesson, getProgress, starsFor } from '../core/progress'
import type { Lesson } from '../core/types'
import { Md } from '../core/markup'
import { BlockView } from '../lesson/BlockView'
import { QuizRunner } from '../lesson/QuizRunner'
import { Loading } from '../ui/Loading'
import { Mascot, MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { ElementTile } from '../ui/ElementTile'
import { Confetti, Stars } from '../ui/Confetti'
import { NotFound } from './NotFound'
import '../lesson/lesson.css'

type Step = { kind: 'intro' } | { kind: 'section'; i: number } | { kind: 'summary' } | { kind: 'quiz' } | { kind: 'done'; score: number; max: number; xp: number }

export default function LessonPage() {
  const { courseId, levelId, lessonId } = useParams()
  const course = courseById(courseId)
  const level = course && findLevel(course, levelId)
  const { content, error } = useLevelContent(level)
  if (!course || !level) return <NotFound />
  if (error) return <NotFound />
  if (!content) return <Loading />
  const lesson = lessonId ? content.lessons[lessonId] : undefined
  if (!lesson) return <NotFound />
  return <LessonPlayer key={lesson.id} courseId={course.id} levelId={level.id} levelColor={level.color} lesson={lesson} />
}

function lessonElements(lesson: Lesson) {
  const s = new Set<string>()
  for (const sec of lesson.sections) for (const b of sec.blocks) if (b.type === 'elements') b.symbols.forEach((x) => s.add(x))
  return [...s]
}

function LessonPlayer({ courseId, levelId, levelColor, lesson }: { courseId: string; levelId: string; levelColor: string; lesson: Lesson }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>({ kind: 'intro' })
  const [answered, setAnswered] = useState<Record<string, boolean>>({})
  const course = courseById(courseId)!
  const level = findLevel(course, levelId)!
  const idx = level.lessons.findIndex((l) => l.id === lesson.id)
  const nextOutline = level.lessons[idx + 1]
  const elements = useMemo(() => lessonElements(lesson), [lesson])
  const alreadyDone = Boolean(getProgress().lessons[`${courseId}:${lesson.id}`])

  const totalSteps = lesson.sections.length + 3
  const stepIndex =
    step.kind === 'intro' ? 0 : step.kind === 'section' ? step.i + 1 : step.kind === 'summary' ? lesson.sections.length + 1 : totalSteps - 1
  const progress = step.kind === 'done' ? 1 : stepIndex / (totalSteps - 1)

  const go = (s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const exit = `/c/${courseId}/l/${levelId}`

  return (
    <main className="lesson" style={{ ['--level' as string]: levelColor }}>
      <div className="lesson-bar">
        <Link to={exit} className="icon-btn" aria-label="Zavřít lekci">
          <Icon name="x" />
        </Link>
        <div className="progress lesson-progress" style={{ ['--bar' as string]: levelColor }} aria-label={`Postup lekcí ${Math.round(progress * 100)} %`}>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="lesson-bar-step tabnum">
          {Math.min(stepIndex + 1, totalSteps)}/{totalSteps}
        </span>
      </div>

      <div className="lesson-body">
        {step.kind === 'intro' && (
          <section className="lesson-intro stack">
            <span className="eyebrow">
              Úroveň {level.number} · Lekce {idx + 1}
            </span>
            <h1>
              <Md text={lesson.title} />
            </h1>
            <MascotSays mood="wow" size={84}>
              <Md text={lesson.hook} />
            </MascotSays>
            <div className="card goals">
              <h3>Po této lekci budeš umět</h3>
              <ul>
                {lesson.goals.map((g, i) => (
                  <li key={i}>
                    <Icon name="check" /> <Md text={g} />
                  </li>
                ))}
              </ul>
              <div className="row muted">
                <Icon name="clock" width={16} height={16} /> {level.lessons[idx]?.minutes} min · {lesson.sections.length} částí · kvíz{' '}
                {lesson.quiz.length} otázek
              </div>
            </div>
            <div className="bottom-bar">
              <button className="btn btn-primary btn-lg" onClick={() => go({ kind: 'section', i: 0 })}>
                Jdeme na to <Icon name="arrowRight" />
              </button>
            </div>
          </section>
        )}

        {step.kind === 'section' &&
          (() => {
            const sec = lesson.sections[step.i]
            const checks = sec.blocks.map((b, bi) => (b.type === 'check' ? `${step.i}-${bi}` : null)).filter(Boolean) as string[]
            const pending = checks.filter((k) => !(k in answered)).length
            return (
              <section className="lesson-section" key={step.i}>
                <span className="eyebrow">
                  Část {step.i + 1} z {lesson.sections.length}
                </span>
                <h2>
                  <Md text={sec.title} />
                </h2>
                <div className="lesson-blocks">
                  {sec.blocks.map((b, bi) => (
                    <BlockView
                      key={bi}
                      block={b}
                      courseId={courseId}
                      levelId={levelId}
                      onCheck={(ok) => setAnswered((a) => ({ ...a, [`${step.i}-${bi}`]: ok }))}
                    />
                  ))}
                </div>
                <div className="bottom-bar">
                  <button className="btn btn-ghost" onClick={() => go(step.i === 0 ? { kind: 'intro' } : { kind: 'section', i: step.i - 1 })}>
                    <Icon name="arrowLeft" /> Zpět
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={pending > 0}
                    onClick={() => go(step.i + 1 < lesson.sections.length ? { kind: 'section', i: step.i + 1 } : { kind: 'summary' })}
                  >
                    {pending > 0 ? `Nejdřív odpověz (${pending})` : 'Pokračovat'} <Icon name="arrowRight" />
                  </button>
                </div>
              </section>
            )
          })()}

        {step.kind === 'summary' && (
          <section className="lesson-summary stack">
            <span className="eyebrow">Shrnutí</span>
            <h2>Co si odnést</h2>
            <div className="card notebook">
              <ul>
                {lesson.summary.map((s, i) => (
                  <li key={i}>
                    <Md text={s} />
                  </li>
                ))}
              </ul>
              <span className="note notebook-note">zapiš si to!</span>
            </div>
            <MascotSays mood="think">
              Teď si to ověříme. Kvíz má <strong>{lesson.quiz.length} otázek</strong>, za každou správnou odpověď dostaneš XP.
            </MascotSays>
            <div className="bottom-bar">
              <button className="btn btn-ghost" onClick={() => go({ kind: 'section', i: lesson.sections.length - 1 })}>
                <Icon name="arrowLeft" /> Zpět
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => go({ kind: 'quiz' })}>
                Spustit kvíz <Icon name="play" />
              </button>
            </div>
          </section>
        )}

        {step.kind === 'quiz' && (
          <section className="stack">
            <span className="eyebrow">Kvíz</span>
            <QuizRunner
              questions={lesson.quiz}
              onDone={(score, max) => {
                const xp = completeLesson(courseId, lesson.id, score, max, elements)
                go({ kind: 'done', score, max, xp })
              }}
            />
          </section>
        )}

        {step.kind === 'done' && (
          <section className="lesson-done stack">
            {step.score / step.max >= 0.6 && <Confetti />}
            <Mascot mood={step.score / step.max >= 0.6 ? 'cheer' : 'think'} size={120} />
            <h1>{step.score === step.max ? 'Bez jediné chyby!' : step.score / step.max >= 0.6 ? 'Lekce hotová!' : 'Hotovo, ale dá se to zlepšit'}</h1>
            <Stars n={starsFor(step.score, step.max)} />
            <div className="row done-chips">
              <span className="chip">
                <Icon name="target" /> {step.score} / {step.max} správně
              </span>
              <span className="chip xp-chip">
                <Icon name="bolt" style={{ color: 'var(--yellow)' }} /> +{step.xp} XP
              </span>
            </div>
            {elements.length > 0 && !alreadyDone && (
              <div className="stack done-elements">
                <span className="hand">Nové prvky ve tvém albu:</span>
                <div className="row">
                  {elements.slice(0, 8).map((s) => (
                    <ElementTile key={s} symbol={s} size="sm" />
                  ))}
                </div>
              </div>
            )}
            <div className="row done-actions">
              <button className="btn" onClick={() => go({ kind: 'quiz' })}>
                <Icon name="refresh" /> Zkusit kvíz znovu
              </button>
              {nextOutline ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigate(`/c/${courseId}/l/${levelId}/${nextOutline.id}`)}>
                  Další lekce <Icon name="arrowRight" />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => navigate(`/c/${courseId}/l/${levelId}/vyzva`)}>
                  Závěrečná výzva <Icon name="trophy" />
                </button>
              )}
            </div>
            <Link to={exit} className="muted">
              Zpět na přehled úrovně
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}
