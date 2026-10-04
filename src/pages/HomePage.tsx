import { COURSES, nextLesson } from '../core/registry'
import { useProgress } from '../core/progress'
import { MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { MLink, Page } from '../ui/anim'
import { pressable } from '../ui/motion'
import { LevelTile } from '../ui/LevelTile'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Ještě vzhůru?'
  if (h < 10) return 'Dobré ráno!'
  if (h < 18) return 'Ahoj!'
  return 'Dobrý večer!'
}

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
  const name = p.settings.name ? `, ${p.settings.name}` : ''

  return (
    <Page className="home">
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
        <MascotSays mood={doneCount ? 'happy' : 'wow'} size={88}>
          <strong>
            {greeting()}
            {name}
          </strong>{' '}
          {doneCount === 0
            ? 'Já jsem Kvído a ptám se „proč?“ na všechno. Provedu tě krok za krokem. Začneme?'
            : next
              ? `Máš za sebou ${doneCount} ${doneCount === 1 ? 'lekci' : doneCount < 5 ? 'lekce' : 'lekcí'}. Jdeme na další!`
              : 'Zvládl/a jsi celý kurz. Klobouk dolů!'}
        </MascotSays>
      </section>

      {next && nextCourse && (
        <MLink
          {...pressable}
          to={`/c/${nextCourse.id}/l/${next.level.id}/${next.lesson.id}`}
          className="continue-card card"
          style={{ ['--level' as string]: next.level.color }}
        >
          <div className="continue-badge">
            <LevelTile course={nextCourse} level={next.level} size="sm" hideName />
          </div>
          <div className="continue-text">
            <span className="eyebrow">
              {courseDone ? 'Pokračuj' : 'Začni tady'} · {nextCourse.title} · Úroveň {next.level.number}
            </span>
            <h2>{next.lesson.title}</h2>
            <span className="muted">
              {next.level.title} · {next.lesson.minutes} min
            </span>
          </div>
          <span className="btn btn-primary btn-lg continue-go">
            <Icon name="play" /> {courseDone ? 'Pokračovat' : 'Začít'}
          </span>
        </MLink>
      )}


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
