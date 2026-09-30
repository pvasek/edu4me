import { Link, useParams } from 'react-router-dom'
import { courseById, findLevel } from '../core/registry'
import { useProgress } from '../core/progress'
import { PathMap } from '../ui/PathMap'
import { Icon } from '../ui/Icon'
import { Mascot } from '../ui/Mascot'
import { ElementTile } from '../ui/ElementTile'
import { gamesForLevel } from '../games/registry'
import { NotFound } from './NotFound'
import { ChemIconView } from '../illustrations/ChemIcon'
import { LevelVignette } from '../illustrations/vignettes/LevelVignette'
import { Page } from '../ui/anim'
import { GameCard } from '../ui/GameCard'

export function LevelPage() {
  const { courseId, levelId } = useParams()
  const course = courseById(courseId)
  const level = course && findLevel(course, levelId)
  const p = useProgress()
  if (!course || !level) return <NotFound />

  const done = level.lessons.map((l) => Boolean(p.lessons[`${course.id}:${l.id}`]))
  const doneCount = done.filter(Boolean).length
  const firstOpen = done.indexOf(false)
  const passed = Boolean(p.levels[`${course.id}:${level.id}`])
  const idx = course.levels.indexOf(level)
  const prev = course.levels[idx - 1]
  const next = course.levels[idx + 1]

  const items = level.lessons.map((ls, i) => ({
    key: ls.id,
    node: (
      <Link
        to={`/c/${course.id}/l/${level.id}/${ls.id}`}
        className={`lesson-node${done[i] ? ' done' : ''}${i === firstOpen ? ' current' : ''}`}
      >
        <span className="lesson-node-disc">
          {done[i] ? <Icon name="check" width={30} height={30} /> : <ChemIconView name={ls.icon} size={34} />}
          <span className="lesson-node-num">{i + 1}</span>
          {i === firstOpen && <Mascot mood="happy" size={50} className="lesson-node-mascot" />}
        </span>
        <span className="lesson-node-label">
          <strong>{ls.title}</strong>
          <span className="muted">
            <Icon name="clock" width={13} height={13} /> {ls.minutes} min
          </span>
        </span>
      </Link>
    ),
  }))
  items.push({
    key: 'boss',
    node: (
      <Link
        to={`/c/${course.id}/l/${level.id}/vyzva`}
        className={`lesson-node boss${passed ? ' done' : ''}${firstOpen === -1 && !passed ? ' current' : ''}`}
      >
        <span className="lesson-node-disc">
          <Icon name="trophy" width={34} height={34} />
        </span>
        <span className="lesson-node-label">
          <strong>Závěrečná výzva</strong>
          <span className="muted">{passed ? 'Splněno!' : 'Získej odznak úrovně'}</span>
        </span>
      </Link>
    ),
  })

  return (
    <Page className="level-page" style={{ ['--level' as string]: level.color }}>
      <nav className="crumbs">
        <Link to={`/c/${course.id}`}>
          <Icon name="arrowLeft" width={16} height={16} /> {course.title}
        </Link>
      </nav>
      <section className="level-hero card">
        <div className="level-hero-art">
          <LevelVignette level={level.number} size={190} />
          <span className="level-hero-tile">
            <ElementTile symbol={level.symbol} size="sm" />
          </span>
        </div>
        <div className="stack">
          <span className="eyebrow">Úroveň {level.number}</span>
          <h1>{level.title}</h1>
          <p className="lead">{level.subtitle}</p>
          <div className="row">
            <span className="chip">{level.stage}</span>
            <span className="chip">
              <Icon name="book" /> {doneCount}/{level.lessons.length}
            </span>
            {passed && (
              <span className="chip" style={{ background: 'var(--good-soft)', borderColor: 'var(--good)' }}>
                <Icon name="trophy" /> Splněno
              </span>
            )}
          </div>
          <div className="progress" style={{ ['--bar' as string]: level.color }}>
            <span style={{ width: `${(doneCount / level.lessons.length) * 100}%` }} />
          </div>
        </div>
      </section>

      <PathMap items={items} doneCount={firstOpen === -1 ? items.length - 1 : firstOpen} color={level.color} rowHeight={150} />

      <section className="stack">
        <h2>Procvič si hrou</h2>
        <div className="game-grid">
          {gamesForLevel(course.id, level.number).map((g) => (
            <GameCard key={g.id} game={g} courseId={course.id} levelId={level.id} note={g.courses[course.id]?.[level.number]} />
          ))}
        </div>
      </section>

      <nav className="level-pager">
        {prev ? (
          <Link to={`/c/${course.id}/l/${prev.id}`} className="btn">
            <Icon name="arrowLeft" /> {prev.number}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/c/${course.id}/l/${next.id}`} className="btn">
            {next.number}. {next.title} <Icon name="arrowRight" />
          </Link>
        )}
      </nav>
    </Page>
  )
}
