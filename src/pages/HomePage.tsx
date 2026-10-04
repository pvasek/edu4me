import { COURSES, nextLesson } from '../core/registry'
import { useProgress } from '../core/progress'
import { Mascot } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { MLink, Page } from '../ui/anim'
import { pressable } from '../ui/motion'

export function HomePage() {
  const p = useProgress()
  const courses = COURSES.filter((c) => c.available)
  const lessonsOf = (id: string) => Object.keys(p.lessons).filter((k) => k.startsWith(`${id}:`)).length
  // continue where the learner was last active: the course with the most recent finished lesson
  const lastAt = (id: string) =>
    Object.entries(p.lessons)
      .filter(([k]) => k.startsWith(`${id}:`))
      .reduce((a, [, v]) => (v.completedAt > a ? v.completedAt : a), '')
  const ordered = [...courses].sort((a, b) => lastAt(b.id).localeCompare(lastAt(a.id)))
  const cont = ordered.map((c) => ({ course: c, next: nextLesson(c, p.lessons) })).find((x) => x.next)
  const next = cont?.next
  const nextCourse = cont?.course
  const doneCount = courses.reduce((a, c) => a + lessonsOf(c.id), 0)
  const total = courses.reduce((a, c) => a + c.levels.reduce((n, l) => n + l.lessons.length, 0), 0)
  const courseDone = nextCourse ? lessonsOf(nextCourse.id) : 0
  const lessonNo = next ? next.level.lessons.findIndex((l) => l.id === next.lesson.id) + 1 : 0

  return (
    <Page className="home">
      {/* continue where you left off: one slim row right under the header */}
      {next && nextCourse && (
        <MLink
          {...pressable}
          to={`/c/${nextCourse.id}/l/${next.level.id}/${next.lesson.id}`}
          className="continue-row card"
          style={{ ['--level' as string]: next.level.color }}
          aria-label={`${courseDone ? 'Pokračovat' : 'Začít'}: ${next.lesson.title} (${nextCourse.title}, lekce ${lessonNo})`}
        >
          <Mascot mood={doneCount ? 'happy' : 'wow'} size={46} className="continue-row-kv" />
          <span className="continue-row-text">
            <strong>{next.lesson.title}</strong>
            <span>
              {courseDone ? 'Pokračuj' : 'Začni tady'} · {nextCourse.title} · lekce {lessonNo}
            </span>
          </span>
          <span className="continue-row-play" aria-hidden="true">
            <Icon name="play" />
          </span>
        </MLink>
      )}

      <section className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">Q &amp; Why · hravé učení</span>
          <h1>
            Učení, které <span className="scribble">dává smysl</span>.
          </h1>
          <p className="lead">
            {courses.map((c, i) => (i ? c.title.toLowerCase() : c.title)).join(', ').replace(/, ([^,]*)$/, ' a $1')}: krátké lekce s obrázky, kvízy a minihrami. {total} lekcí od základní
            školy až po maturitu, sbírky prvků, jednotek a organismů a odznaky za každý krok.
          </p>
        </div>
      </section>



      <section className="stack">
        <h2>Kurzy</h2>
        <div className="course-grid">
          {COURSES.map((c) => {
            const inner = (
              <>
                <span className="course-dot" style={{ background: c.color }} />
                <h3>{c.title}</h3>
                <p className="muted">{c.tagline}</p>
                {c.available ? (
                  <span className="chip">
                    <Icon name="book" /> {c.levels.length} úrovní
                  </span>
                ) : (
                  <span className="chip chip-soft">Připravujeme</span>
                )}
              </>
            )
            return c.available ? (
              <MLink key={c.id} to={`/c/${c.id}`} className="course-card card" {...pressable}>
                {inner}
              </MLink>
            ) : (
              <div key={c.id} className="course-card card-flat disabled" aria-disabled="true">
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </Page>
  )
}
