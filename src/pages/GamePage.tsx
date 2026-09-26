import { Suspense, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { courseById } from '../core/registry'
import { finishGame, useProgress } from '../core/progress'
import { GAME_BY_ID, GAME_COMPONENTS } from '../games/registry'
import type { GameResult } from '../games/types'
import type { GameId } from '../core/types'
import { Loading } from '../ui/Loading'
import { Mascot, MascotSays } from '../ui/Mascot'
import { Icon } from '../ui/Icon'
import { ElementTile } from '../ui/ElementTile'
import { Confetti, Stars } from '../ui/Confetti'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { NotFound } from './NotFound'

type Phase = { kind: 'intro' } | { kind: 'play'; run: number } | { kind: 'result'; result: GameResult; xp: number; stars: number }

export default function GamePage() {
  const { courseId, gameId } = useParams()
  const [search, setSearch] = useSearchParams()
  const course = courseById(courseId)
  const meta = GAME_BY_ID[gameId as GameId]
  const p = useProgress()
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' })
  const [runs, setRuns] = useState(0)
  if (!course || !meta) return <NotFound />
  const Game = GAME_COMPONENTS[meta.id]
  const levels = course.levels.filter((l) => l.number >= meta.minLevel)
  const levelId = search.get('uroven') ?? undefined
  const level = course.levels.find((l) => l.id === levelId)
  const rec = p.games[meta.id]

  const start = () => {
    setRuns((r) => r + 1)
    setPhase({ kind: 'play', run: runs + 1 })
  }

  return (
    <main className="page game-page" style={level ? { ['--level' as string]: level.color } : undefined}>
      <nav className="crumbs">
        <Link to={level ? `/c/${course.id}/l/${level.id}` : `/c/${course.id}/hry`}>
          <Icon name="arrowLeft" width={16} height={16} /> {level ? `${level.number}. ${level.title}` : 'Mini-hry'}
        </Link>
      </nav>
      <header className="game-head">
        <div className="stack">
          <span className="eyebrow">Mini-hra</span>
          <h1>{meta.title}</h1>
        </div>
        {phase.kind === 'play' && (
          <button className="btn btn-sm" onClick={() => setPhase({ kind: 'intro' })}>
            <Icon name="x" /> Ukončit
          </button>
        )}
      </header>

      {phase.kind === 'intro' && (
        <section className="card game-intro stack">
          <MascotSays mood="cheer">{meta.blurb}</MascotSays>
          {levels.length > 1 && (
            <div className="stack">
              <span className="stat-label">Obtížnost podle úrovně</span>
              <div className="row level-chips" role="radiogroup" aria-label="Úroveň">
                <button
                  type="button"
                  role="radio"
                  aria-checked={!level}
                  className={`chip level-chip${!level ? ' on' : ''}`}
                  onClick={() => setSearch({})}
                >
                  Vše
                </button>
                {levels.map((l) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={level?.id === l.id}
                    key={l.id}
                    className={`chip level-chip${level?.id === l.id ? ' on' : ''}`}
                    style={{ ['--c' as string]: l.color }}
                    onClick={() => setSearch({ uroven: l.id })}
                    title={l.title}
                  >
                    {l.number}. {l.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          {rec && (
            <p className="muted">
              Tvůj rekord: <strong>{rec.best}</strong> bodů · odehráno {rec.plays}×
            </p>
          )}
          <div>
            <button className="btn btn-primary btn-lg" onClick={start}>
              <Icon name="play" /> Hrát
            </button>
          </div>
        </section>
      )}

      {phase.kind === 'play' && (
        <section className="game-stage">
          <ErrorBoundary fallback={<MascotSays mood="sad">Tahle hra se zrovna nepovedla načíst. Zkus to prosím znovu.</MascotSays>}>
            <Suspense fallback={<Loading text="Připravuju hru…" />}>
              <Game
                key={phase.run}
                levelId={level?.id}
                onFinish={(result) => {
                  const r = finishGame(meta.id, result.score, result.max, result.collected)
                  setPhase({ kind: 'result', result, ...r })
                }}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      )}

      {phase.kind === 'result' && (
        <section className="card lesson-done stack">
          {phase.stars >= 2 && <Confetti />}
          <Mascot mood={phase.stars >= 2 ? 'cheer' : phase.stars === 1 ? 'happy' : 'think'} size={110} />
          <h2>{phase.stars === 3 ? 'Fantastické!' : phase.stars === 2 ? 'Skvělá hra!' : phase.stars === 1 ? 'Dobrý začátek!' : 'Příště to vyjde!'}</h2>
          <Stars n={phase.stars} />
          <div className="row done-chips">
            <span className="chip">
              <Icon name="target" /> {phase.result.score} / {phase.result.max} bodů
            </span>
            <span className="chip xp-chip">
              <Icon name="bolt" style={{ color: 'var(--yellow)' }} /> +{phase.xp} XP
            </span>
          </div>
          {phase.result.collected && phase.result.collected.length > 0 && (
            <div className="stack done-elements">
              <span className="hand">Prvky do alba:</span>
              <div className="row">
                {[...new Set(phase.result.collected)].slice(0, 10).map((s) => (
                  <ElementTile key={s} symbol={s} size="sm" />
                ))}
              </div>
            </div>
          )}
          <div className="row done-actions">
            <button className="btn btn-primary btn-lg" onClick={start}>
              <Icon name="refresh" /> Hrát znovu
            </button>
            <Link to={`/c/${course.id}/hry`} className="btn">
              Další hry
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
