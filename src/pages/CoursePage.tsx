import { Link, useParams } from 'react-router-dom'
import { courseById } from '../core/registry'
import { useProgress } from '../core/progress'
import { PathMap, Ring } from '../ui/PathMap'
import { Icon } from '../ui/Icon'
import { Mascot } from '../ui/Mascot'
import { Page } from '../ui/anim'
import { NotFound } from './NotFound'

export function CoursePage() {
  const { courseId } = useParams()
  const course = courseById(courseId)
  const p = useProgress()
  if (!course) return <NotFound />

  const stats = course.levels.map((l) => {
    const done = l.lessons.filter((ls) => p.lessons[`${course.id}:${ls.id}`]).length
    return { level: l, done, ratio: done / l.lessons.length, passed: Boolean(p.levels[`${course.id}:${l.id}`]) }
  })
  const currentIdx = Math.max(0, stats.findIndex((s) => s.ratio < 1 || !s.passed))
  const doneSegments = stats.findIndex((s) => !s.passed)
  const totalDone = stats.reduce((a, s) => a + s.done, 0)
  const total = stats.reduce((a, s) => a + s.level.lessons.length, 0)

  return (
    <Page>
      <section className="course-head">
        <div className="stack">
          <span className="eyebrow">Kurz</span>
          <h1>{course.title}</h1>
          <p className="lead">{course.tagline}</p>
          <div className="row">
            <span className="chip">
              <Icon name="book" /> {totalDone} / {total} lekcí
            </span>
            <span className="chip">
              <Icon name="trophy" /> {stats.filter((s) => s.passed).length} / {stats.length} úrovní
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
      </section>

      <PathMap
        doneCount={doneSegments === -1 ? stats.length : doneSegments}
        items={stats.map((s, i) => ({
          key: s.level.id,
          node: (
            <Link
              to={`/c/${course.id}/l/${s.level.id}`}
              className={`level-node${i === currentIdx ? ' current' : ''}${s.passed ? ' passed' : ''}`}
              style={{ ['--level' as string]: s.level.color }}
            >
              <span className="level-node-disc">
                <Ring value={s.ratio} color={s.level.color} />
                <span className="level-node-tile">
                  <span className="level-node-num">{s.level.number}</span>
                  <span className="level-node-sym">{s.level.symbol}</span>
                </span>
                {s.passed && (
                  <span className="level-node-crown" aria-label="Úroveň splněna">
                    <Icon name="trophy" />
                  </span>
                )}
                {i === currentIdx && <Mascot mood="happy" size={54} className="level-node-mascot" />}
              </span>
              <span className="level-node-label">
                <strong>{s.level.title}</strong>
                <span className="muted">
                  {s.done}/{s.level.lessons.length} lekcí
                </span>
              </span>
            </Link>
          ),
        }))}
      />
    </Page>
  )
}
