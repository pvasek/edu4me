import { Link } from 'react-router-dom'
import { COURSES, nextLesson } from '../core/registry'
import { liveStreak, rankFromXp, rankTitle, useProgress } from '../core/progress'
import { MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { motion } from 'motion/react'
import { Bar, CountUp, MLink, Page } from '../ui/anim'
import { pressable, rise, stagger } from '../ui/motion'
import { ElementTile } from '../ui/ElementTile'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Ještě vzhůru?'
  if (h < 10) return 'Dobré ráno!'
  if (h < 18) return 'Ahoj!'
  return 'Dobrý večer!'
}

export function HomePage() {
  const p = useProgress()
  const chem = COURSES[0]
  const next = nextLesson(chem, p.lessons)
  const doneCount = Object.keys(p.lessons).filter((k) => k.startsWith('chemie:')).length
  const total = chem.levels.reduce((a, l) => a + l.lessons.length, 0)
  const { rank, into, need } = rankFromXp(p.xp)
  const streak = liveStreak(p)
  const name = p.settings.name ? `, ${p.settings.name}` : ''

  return (
    <Page className="home">
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">edu4me · hravé učení</span>
          <h1>
            Chemie, která <span className="scribble">dává smysl</span>.
          </h1>
          <p className="lead">
            Od první zkumavky až po organiku a biochemii. 9 úrovní, 54 lekcí, 14 miniher a periodická tabulka, kterou si
            budeš sbírat jako alba samolepek.
          </p>
        </div>
        <MascotSays mood={doneCount ? 'happy' : 'wow'} size={88}>
          <strong>
            {greeting()}
            {name}
          </strong>{' '}
          {doneCount === 0
            ? 'Já jsem Atomík. Provedu tě chemií krok za krokem. Začneme?'
            : next
              ? `Máš za sebou ${doneCount} ${doneCount === 1 ? 'lekci' : doneCount < 5 ? 'lekce' : 'lekcí'}. Jdeme na další!`
              : 'Zvládl/a jsi celý kurz. Klobouk dolů!'}
        </MascotSays>
      </section>

      {next && (
        <MLink
          {...pressable}
          to={`/c/chemie/l/${next.level.id}/${next.lesson.id}`}
          className="continue-card card"
          style={{ ['--level' as string]: next.level.color }}
        >
          <div className="continue-badge">
            <ElementTile symbol={next.level.symbol} size="sm" hideName />
          </div>
          <div className="continue-text">
            <span className="eyebrow">
              {doneCount ? 'Pokračuj' : 'Začni tady'} · Úroveň {next.level.number}
            </span>
            <h2>{next.lesson.title}</h2>
            <span className="muted">
              {next.level.title} · {next.lesson.minutes} min
            </span>
          </div>
          <span className="btn btn-primary btn-lg continue-go">
            <Icon name="play" /> {doneCount ? 'Pokračovat' : 'Začít'}
          </span>
        </MLink>
      )}

      <motion.section className="stat-row" aria-label="Tvoje statistiky" variants={stagger(0.08, 0.3)} initial="hidden" animate="show">
        <motion.div className="stat card-flat" variants={rise}>
          <span className="stat-label">Hodnost</span>
          <strong className="stat-value">
            {rank}. {rankTitle(rank)}
          </strong>
          <Bar value={into / need} color="var(--yellow)" label="Postup k další hodnosti" />
          <span className="stat-sub tabnum">
            {into} / {need} XP do další
          </span>
        </motion.div>
        <motion.div className="stat card-flat" variants={rise}>
          <span className="stat-label">Série</span>
          <strong className="stat-value">
            <Icon name="flame" style={{ color: streak ? 'var(--accent)' : 'var(--muted)' }} /> {streak}{' '}
            {streak === 1 ? 'den' : streak >= 2 && streak <= 4 ? 'dny' : 'dní'}
          </strong>
          <span className="stat-sub">Nejdelší: {p.streak.best}</span>
        </motion.div>
        <motion.div className="stat card-flat" variants={rise}>
          <span className="stat-label">Lekce</span>
          <strong className="stat-value tabnum">
            <CountUp value={doneCount} /> / {total}
          </strong>
          <Bar value={doneCount / total} label="Dokončené lekce" />
        </motion.div>
        <Link to="/profil" className="stat card-flat stat-link">
          <span className="stat-label">Album prvků</span>
          <strong className="stat-value tabnum">
            <CountUp value={p.elements.length} /> / 118
          </strong>
          <span className="stat-sub">
            Otevřít album <Icon name="arrowRight" width={14} height={14} />
          </span>
        </Link>
      </motion.section>

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
