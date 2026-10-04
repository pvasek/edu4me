import { gameKey, useProgress } from '../core/progress'
import type { GameMeta } from '../games/types'
import { Icon, type IconName } from './Icon'
import { MLink } from './anim'
import { pressable } from './motion'

export const KIND: Record<GameMeta['kind'], { title: string; icon: IconName; color: string }> = {
  periodic: { title: 'Periodická tabulka', icon: 'atom', color: 'var(--cat-nonmetal)' },
  build: { title: 'Stavebnice', icon: 'sparkle', color: 'var(--cat-transition)' },
  quiz: { title: 'Kvízy a trenažéry', icon: 'bolt', color: 'var(--cat-noble)' },
  lab: { title: 'Virtuální laboratoř', icon: 'flask', color: 'var(--cat-post)' },
  motion: { title: 'Pohyb a síly', icon: 'target', color: 'var(--cat-alkali)' },
  energy: { title: 'Energie a látky', icon: 'flame', color: 'var(--cat-alkaline)' },
  circuit: { title: 'Elektřina', icon: 'bolt', color: 'var(--cat-metalloid)' },
  optics: { title: 'Světlo a vlny', icon: 'sun', color: 'var(--cat-halogen)' },
  map: { title: 'Mapy a orientace', icon: 'pin', color: 'var(--cat-lanthanide)' },
}

export function GameCard({ game, courseId, levelId, note }: { game: GameMeta; courseId: string; levelId?: string; note?: string }) {
  const p = useProgress()
  const rec = p.games[gameKey(courseId, game.id)]
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
        <span className="muted">{note ? note.charAt(0).toUpperCase() + note.slice(1) + '.' : game.blurb}</span>
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

