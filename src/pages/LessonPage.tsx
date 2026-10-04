import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { courseById, findLevel, levelHref } from '../core/registry'
import { useLevelContent } from '../core/useLevelContent'
import { completeLesson, getProgress, starsFor } from '../core/progress'
import type { Lesson, LessonSection } from '../core/types'
import { Md, plain } from '../core/markup'
import { BlockView } from '../lesson/BlockView'
import { QuizRunner } from '../lesson/QuizRunner'
import { buildLessonQuiz } from '../lesson/lessonQuiz'
import { Loading } from '../ui/Loading'
import { Mascot, MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { ElementTile } from '../ui/ElementTile'
import { Confetti, Stars } from '../ui/Confetti'
import { NotFound } from './NotFound'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { rise, slide, spring, stagger } from '../ui/motion'
import { ChemIconView } from '../illustrations/ChemIcon'
import { CountUp } from '../ui/anim'
import '../lesson/lesson.css'


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

type Step = { kind: 'read' } | { kind: 'quiz' } | { kind: 'done'; score: number; max: number; xp: number }

function LessonPlayer({ courseId, levelId, levelColor, lesson }: { courseId: string; levelId: string; levelColor: string; lesson: Lesson }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>({ kind: 'read' })
  // the first step appears without the slide-in; later steps slide
  const firstStep = useRef(true)
  useEffect(() => {
    firstStep.current = false
  }, [])
  const [dir, setDir] = useState(1)
  const course = courseById(courseId)!
  const level = findLevel(course, levelId)!
  const idx = level.lessons.findIndex((l) => l.id === lesson.id)
  const nextOutline = level.lessons[idx + 1]
  const elements = useMemo(() => lessonElements(lesson), [lesson])
  const quiz = useMemo(() => buildLessonQuiz(lesson), [lesson])
  const alreadyDone = Boolean(getProgress().lessons[`${courseId}:${lesson.id}`])

  const order = { read: 0, quiz: 1, done: 2 }
  const go = (s: Step) => {
    setDir(order[s.kind] >= order[step.kind] ? 1 : -1)
    setStep(s)
    window.scrollTo({ top: 0 })
  }

  const exit = levelHref(courseId ?? '', levelId ?? '')

  return (
    <main className="lesson" style={{ ['--level' as string]: levelColor }}>
      <div className="lesson-bar">
        <Link to={exit} className="icon-btn" aria-label="Zavřít lekci">
          <Icon name="x" />
        </Link>
        {step.kind === 'read' ? (
          <SectionNav sections={lesson.sections} />
        ) : (
          <span className="lesson-bar-title">
            <b>{step.kind === 'quiz' ? 'Kvíz' : 'Hotovo'}</b> · <Md text={lesson.title} />
          </span>
        )}
        {step.kind === 'read' ? <ReadLine /> : <span className="lesson-line" aria-hidden="true"><span className="lesson-line-fill" /></span>}
      </div>

      <div className="lesson-body">
        {/* no slide on the first render; not via AnimatePresence initial={false}, which would
            also block the entrance of everything mounted later inside (figure replays) */}
        <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step.kind} custom={dir} variants={slide} initial={firstStep.current ? false : 'enter'} animate="center" exit="exit">
        {step.kind === 'read' && (
          <article className="lesson-read">
            <header className="lesson-intro stack">
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
                      <Icon name="check" />
                      <span>
                        <Md text={g} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="row muted">
                  <Icon name="clock" width={16} height={16} /> {level.lessons[idx]?.minutes} min · {lesson.sections.length} částí · na konci
                  kvíz {quiz.length} otázek
                </div>
              </div>
            </header>

            {lesson.sections.map((sec, si) => (
              <section className="lesson-section" key={si} id={`cast-${si + 1}`} data-section={si}>
                <div className="fleuron" aria-hidden="true">
                  {si + 1}
                </div>
                <h2 className="lesson-section-title">
                  {sec.icon && (
                    <motion.span
                      className="lesson-section-icon"
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={spring.bouncy}
                    >
                      <ChemIconView name={sec.icon} size={30} />
                    </motion.span>
                  )}
                  <span className="lesson-section-name">
                    <Md text={sec.title} />
                  </span>
                </h2>
                <div className="lesson-blocks">
                  {sec.blocks
                    .filter((b) => b.type !== 'check')
                    .map((b, bi) => (
                      <motion.div key={bi} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -60px 0px' }}>
                        <BlockView block={b} courseId={courseId} levelId={levelId} />
                      </motion.div>
                    ))}
                </div>
              </section>
            ))}

            <section className="lesson-summary stack" id="shrnuti">
              <div className="fleuron" aria-hidden="true">
                ❦
              </div>
              <h2>Co si odnést</h2>
              <div className="card notebook">
                <motion.ul variants={stagger(0.12, 0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                  {lesson.summary.map((s, i) => (
                    <motion.li key={i} variants={rise} className="ruled">
                      <Md text={s} />
                    </motion.li>
                  ))}
                </motion.ul>
                <span className="note notebook-note">zapiš si to!</span>
              </div>
              <MascotSays mood="think">
                Teď si to ověříme. Kvíz má <strong>{quiz.length} otázek</strong> z celé lekce, za každou správnou odpověď dostaneš XP.
              </MascotSays>
              <div className="bottom-bar">
                <button className="btn btn-primary btn-lg" onClick={() => go({ kind: 'quiz' })}>
                  Spustit kvíz <Icon name="play" />
                </button>
              </div>
            </section>
          </article>
        )}

        {step.kind === 'quiz' && (
          <section className="stack">
            <div className="row lesson-quiz-head">
              <span className="eyebrow">Kvíz · {plain(lesson.title)}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => go({ kind: 'read' })}>
                <Icon name="arrowLeft" /> Zpět k výkladu
              </button>
            </div>
            <QuizRunner
              questions={quiz}
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
                <Icon name="bolt" style={{ color: 'var(--yellow)' }} /> <CountUp value={step.xp} prefix="+" suffix=" XP" />
              </span>
            </div>
            {elements.length > 0 && !alreadyDone && (
              <div className="stack done-elements">
                <span className="hand">Nové prvky ve tvém albu:</span>
                <motion.div className="row" variants={stagger(0.08, 0.8)} initial="hidden" animate="show">
                  {elements.slice(0, 8).map((s) => (
                    <motion.div key={s} variants={{ hidden: { opacity: 0, scale: 0.4, rotate: -20 }, show: { opacity: 1, scale: 1, rotate: 0 } }}>
                      <ElementTile symbol={s} size="sm" />
                    </motion.div>
                  ))}
                </motion.div>
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
              Zpět na přehled kurzu
            </Link>
          </section>
        )}
        </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/** Reading progress, drawn as the header's bottom line: fills as the learner scrolls. */
function ReadLine() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  return (
    <span className="lesson-line" aria-hidden="true">
      <motion.span className="lesson-line-fill" style={{ scaleX }} />
    </span>
  )
}

/**
 * Where am I in the lesson: icon chips on wide screens, a dropdown on phones.
 * Both highlight the section being read and jump to a section on tap.
 */
function SectionNav({ sections }: { sections: LessonSection[] }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pickRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.lesson-section[data-section]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.section))
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])
  useEffect(() => {
    navRef.current?.querySelector<HTMLElement>('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])
  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!pickRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  const jump = (i: number) => {
    setOpen(false)
    document.getElementById(`cast-${i + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const cur = sections[active]
  return (
    <>
      <nav className="lesson-nav" ref={navRef} aria-label="Části lekce">
        {sections.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`lesson-nav-chip${i === active ? ' is-active' : ''}`}
            onClick={() => jump(i)}
            aria-current={i === active ? 'location' : undefined}
            title={plain(s.title)}
          >
            <span className="tabnum">{i + 1}</span>
            {s.icon && <ChemIconView name={s.icon} size={20} />}
            <span className="lesson-nav-label">
              <Md text={s.title} />
            </span>
          </button>
        ))}
      </nav>

      <div className="lesson-pick" ref={pickRef}>
        <button type="button" className="lesson-pick-btn" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
          <span className="lesson-pick-num tabnum">
            {active + 1}/{sections.length}
          </span>
          {cur?.icon && <ChemIconView name={cur.icon} size={20} />}
          <span className="lesson-pick-title">
            <Md text={cur?.title ?? ''} />
          </span>
          <motion.span className="lesson-pick-caret" aria-hidden="true" animate={{ rotate: open ? 180 : 0 }}>
            ▾
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              id={menuId}
              className="lesson-pick-menu"
              aria-label="Části lekce"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {sections.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className={`lesson-pick-item${i === active ? ' is-active' : ''}`}
                    aria-current={i === active ? 'location' : undefined}
                    onClick={() => jump(i)}
                  >
                    <span className="tabnum">{i + 1}</span>
                    {s.icon && <ChemIconView name={s.icon} size={22} />}
                    <span>
                      <Md text={s.title} />
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
