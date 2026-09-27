import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { courseById } from '../core/registry'
import { useProgress, type ProgressState } from '../core/progress'
import type { Course, LevelOutline } from '../core/types'
import { gamesForLevel } from '../games/registry'
import { BY_SYMBOL } from '../courses/chemie/data/elements'
import { ChemIconView } from '../illustrations/ChemIcon'
import { LevelVignette } from '../illustrations/vignettes/LevelVignette'
import { Icon } from '../ui/Icon'
import { Mascot } from '../ui/Mascot'
import { Bar, MLink, Page } from '../ui/anim'
import { Ring } from '../ui/PathMap'
import { popIn, pressable, rise, spring, stagger } from '../ui/motion'
import { NotFound } from './NotFound'
import './course.css'

interface LevelStats {
  level: LevelOutline
  done: boolean[]
  doneCount: number
  passed: boolean
  best?: { best: number; max: number }
}

function statsFor(course: Course, p: ProgressState): LevelStats[] {
  return course.levels.map((level) => {
    const done = level.lessons.map((l) => Boolean(p.lessons[`${course.id}:${l.id}`]))
    const rec = p.levels[`${course.id}:${level.id}`]
    return { level, done, doneCount: done.filter(Boolean).length, passed: Boolean(rec), best: rec }
  })
}

export function CoursePage() {
  const { courseId } = useParams()
  const course = courseById(courseId)
  const p = useProgress()
  const atlasRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: atlasRef, offset: ['start 70%', 'end 70%'] })
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  if (!course) return <NotFound />

  const stats = statsFor(course, p)
  const currentIdx = Math.max(
    0,
    stats.findIndex((s) => s.doneCount < s.level.lessons.length || !s.passed),
  )
  const totalDone = stats.reduce((a, s) => a + s.doneCount, 0)
  const total = stats.reduce((a, s) => a + s.level.lessons.length, 0)
  const passedCount = stats.filter((s) => s.passed).length

  return (
    <Page>
      <motion.section className="course-head" variants={rise}>
        <div className="stack">
          <span className="eyebrow">Kurz · 9 úrovní · {total} lekcí</span>
          <h1>{course.title}</h1>
          <p className="lead">{course.tagline}</p>
          <div className="course-head-progress">
            <Bar value={totalDone / total} label="Postup kurzem" />
            <span className="muted tabnum">
              {totalDone} / {total} lekcí · {passedCount} / {stats.length} úrovní splněno
            </span>
          </div>
        </div>
        <div className="course-head-actions">
          <Link to={`/c/${course.id}/hry`} className="btn">
            <Icon name="gamepad" /> Mini-hry
          </Link>
          <Link to="/profil" className="btn">
            <Icon name="atom" /> Album prvků
          </Link>
        </div>
      </motion.section>

      <nav className="atlas-index" aria-label="Přehled úrovní">
        {stats.map((s, i) => (
          <a
            key={s.level.id}
            href={`#${s.level.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(`atlas-${s.level.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className={`atlas-index-item${s.passed ? ' passed' : ''}${i === currentIdx ? ' current' : ''}`}
            style={{ ['--level' as string]: s.level.color }}
            title={`${s.level.number}. ${s.level.title}`}
          >
            <span className="atlas-index-sym">{s.level.symbol}</span>
            <span className="atlas-index-bar">
              <span style={{ width: `${(s.doneCount / s.level.lessons.length) * 100}%` }} />
            </span>
          </a>
        ))}
      </nav>

      <ol className="atlas" ref={atlasRef}>
        <span className="atlas-spine" aria-hidden="true">
          <motion.span className="atlas-spine-ink" style={{ scaleY: spine }} />
        </span>
        {stats.map((s, i) => (
          <LevelPlate key={s.level.id} s={s} courseId={course.id} current={i === currentIdx} side={i % 2 ? 'right' : 'left'} />
        ))}
      </ol>
    </Page>
  )
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

function LevelPlate({ s, courseId, current, side }: { s: LevelStats; courseId: string; current: boolean; side: 'left' | 'right' }) {
  const { level, done, doneCount, passed, best } = s
  const nextIdx = done.indexOf(false)
  const games = gamesForLevel(level.number)
  const status = passed ? 'Splněno' : doneCount === 0 ? 'Nezačato' : doneCount === level.lessons.length ? 'Čeká na výzvu' : 'Rozpracováno'
  const cta =
    nextIdx !== -1
      ? { to: `/c/${courseId}/l/${level.id}/${level.lessons[nextIdx].id}`, label: doneCount ? 'Pokračovat' : 'Začít úroveň', icon: 'play' as const }
      : !passed
        ? { to: `/c/${courseId}/l/${level.id}/vyzva`, label: 'Závěrečná výzva', icon: 'trophy' as const }
        : { to: `/c/${courseId}/l/${level.id}`, label: 'Opakovat', icon: 'refresh' as const }

  return (
    <li id={`atlas-${level.id}`} className={`atlas-row atlas-${side}${current ? ' current' : ''}`} style={{ ['--level' as string]: level.color }}>
      <motion.div
        className="atlas-node"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px 0px' }}
        transition={spring.bouncy}
      >
        <Link to={`/c/${courseId}/l/${level.id}`} className="level-node-disc" aria-label={`Úroveň ${level.number}: ${level.title}`}>
          <Ring value={doneCount / level.lessons.length} color={level.color} />
          <span className="level-node-tile">
            <span className="level-node-num">{level.number}</span>
            <span className="level-node-sym">{level.symbol}</span>
          </span>
          {passed && (
            <span className="level-node-crown" aria-label="Úroveň splněna">
              <Icon name="trophy" />
            </span>
          )}
        </Link>
        {current && <Mascot mood="happy" size={58} className="atlas-mascot" />}
      </motion.div>

      <motion.article
        className="atlas-plate card"
        variants={stagger(0.05, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px 0px' }}
      >
        <motion.header className="atlas-plate-head" variants={rise}>
          <div className="stack atlas-plate-titles">
            <div className="atlas-plate-eyebrow">
              <span className="eyebrow">
                Úroveň {level.number} · {level.stage}
              </span>
              <span className={`atlas-status${passed ? ' passed' : ''}`}>{status}</span>
            </div>
            <h2>
              <Link to={`/c/${courseId}/l/${level.id}`}>{level.title}</Link>
            </h2>
            <p className="muted">{level.subtitle}</p>
            <div className="atlas-progress">
              <Bar value={doneCount / level.lessons.length} color={level.color} label={`Postup úrovní ${level.number}`} />
              <span className="muted tabnum">
                {doneCount}/{level.lessons.length} lekcí · {level.lessons.reduce((a, l) => a + l.minutes, 0)} min
              </span>
            </div>
          </div>
          <figure className="atlas-plate-art" aria-hidden="true">
            <LevelVignette level={level.number} size={132} />
            <figcaption>
              <span>
                {BY_SYMBOL[level.symbol]?.name} · <b>{level.symbol}</b>
              </span>
              <small>Tabule {ROMAN[level.number - 1]}</small>
            </figcaption>
          </figure>
        </motion.header>

        <motion.ol
          className="atlas-lessons"
          variants={stagger(0.04)}
          style={{ ['--rows' as string]: Math.ceil((level.lessons.length + 1) / 2) }}
        >
          {level.lessons.map((ls, i) => (
            <motion.li key={ls.id} variants={rise}>
              <Link
                to={`/c/${courseId}/l/${level.id}/${ls.id}`}
                className={`atlas-lesson${done[i] ? ' done' : ''}${i === nextIdx ? ' next' : ''}`}
              >
                <span className="atlas-lesson-mark">{done[i] ? <Icon name="check" width={15} height={15} /> : <ChemIconView name={ls.icon} size={16} />}</span>
                <span className="atlas-lesson-title">{ls.title}</span>
                <span className="atlas-lesson-min tabnum">{ls.minutes} min</span>
              </Link>
            </motion.li>
          ))}
          <motion.li variants={rise}>
            <Link to={`/c/${courseId}/l/${level.id}/vyzva`} className={`atlas-lesson boss${passed ? ' done' : ''}`}>
              <span className="atlas-lesson-mark">
                <Icon name="trophy" width={15} height={15} />
              </span>
              <span className="atlas-lesson-title">Závěrečná výzva</span>
              <span className="atlas-lesson-min tabnum">{best ? `${best.best}/${best.max}` : '12 otázek'}</span>
            </Link>
          </motion.li>
        </motion.ol>

        <motion.div className="atlas-games" variants={rise}>
          <span className="stat-label">Hry k úrovni</span>
          <motion.div className="atlas-game-chips" variants={stagger(0.04)}>
            {games.map((g) => (
              <motion.span key={g.id} variants={popIn}>
                <Link to={`/c/${courseId}/hry/${g.id}?uroven=${level.id}`} className="chip atlas-game-chip" title={g.levels[level.number]}>
                  <Icon name="gamepad" /> {g.title}
                </Link>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="atlas-cta" variants={rise}>
          <MLink to={cta.to} className={`btn${current ? ' btn-primary' : ''}`} {...pressable}>
            <Icon name={cta.icon} /> {cta.label}
          </MLink>
          <Link to={`/c/${courseId}/l/${level.id}`} className="btn btn-ghost btn-sm">
            Mapa úrovně <Icon name="arrowRight" />
          </Link>
        </motion.div>
      </motion.article>
    </li>
  )
}
