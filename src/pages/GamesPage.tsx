import { useParams } from 'react-router-dom'
import { courseById } from '../core/registry'
import { useProgress } from '../core/progress'
import { GAMES } from '../games/registry'
import type { GameMeta } from '../games/types'
import { Icon, type IconName } from '../ui/Icon'
import { MascotSays } from '../ui/Mascot'
import { MLink, Page } from '../ui/anim'
import { pressable } from '../ui/motion'
import { NotFound } from './NotFound'

const KIND: Record<GameMeta['kind'], { title: string; icon: IconName; color: string }> = {
  periodic: { title: 'Periodická tabulka', icon: 'atom', color: 'var(--cat-nonmetal)' },
  build: { title: 'Stavebnice', icon: 'sparkle', color: 'var(--cat-transition)' },
  quiz: { title: 'Kvízy a trenažéry', icon: 'bolt', color: 'var(--cat-noble)' },
  lab: { title: 'Virtuální laboratoř', icon: 'flask', color: 'var(--cat-post)' },
}

export function GameCard({ game, courseId, levelId }: { game: GameMeta; courseId: string; levelId?: string }) {
  const p = useProgress()
  const rec = p.games[game.id]
  const k = KIND[game.kind]
  return (
    <MLink
      {...pressable}
      to={`/c/${courseId}/hry/${game.id}${levelId ? `?uroven=${levelId}` : ''}`}
      className="game-card card"
      style={{ ['--g-color' as string]: k.color }}
    >
      <span className="game-card-art" aria-hidden="true">
        <Icon name={k.icon} width={30} height={30} />
      </span>
      <span className="game-card-text">
        <strong>{game.title}</strong>
        <span className="muted">{game.blurb}</span>
      </span>
      <span className="game-card-meta">
        {rec ? (
          <span className="mini-stars" aria-label={`${rec.stars} ze 3 hvězd`}>
            {[0, 1, 2].map((i) => (
              <Icon key={i} name="star" width={15} height={15} style={{ color: i < rec.stars ? 'var(--yellow)' : 'var(--surface-3)' }} />
            ))}
          </span>
        ) : (
          <span className="chip chip-soft">Nové</span>
        )}
      </span>
    </MLink>
  )
}

export default function GamesPage() {
  const { courseId } = useParams()
  const course = courseById(courseId)
  if (!course) return <NotFound />
  const kinds = Object.keys(KIND) as GameMeta['kind'][]
  return (
    <Page>
      <section className="stack">
        <span className="eyebrow">{course.title}</span>
        <h1>Mini-hry</h1>
        <MascotSays mood="cheer" size={70}>
          Hraním si procvičíš, co ses naučil/a. Každá hra dává XP a některé ti přidají prvky do alba.
        </MascotSays>
      </section>
      {kinds.map((k) => (
        <section key={k} className="stack">
          <h2 className="games-kind">
            <span style={{ background: KIND[k].color }}>
              <Icon name={KIND[k].icon} />
            </span>
            {KIND[k].title}
          </h2>
          <div className="game-grid">
            {GAMES.filter((g) => g.kind === k).map((g) => (
              <GameCard key={g.id} game={g} courseId={course.id} />
            ))}
          </div>
        </section>
      ))}
    </Page>
  )
}
