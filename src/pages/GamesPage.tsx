import { useParams } from 'react-router-dom'
import { courseById } from '../core/registry'
import { GAMES } from '../games/registry'
import type { GameMeta } from '../games/types'
import { Icon } from '../ui/Icon'
import { MascotSays } from '../ui/Mascot'
import { Page } from '../ui/anim'
import { GameCard, KIND } from '../ui/GameCard'
import { NotFound } from './NotFound'

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
