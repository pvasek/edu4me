import { Replayable } from './Replayable'
import { Link } from 'react-router-dom'
import type { Block, CalloutVariant } from '../core/types'
import { Md } from '../core/markup'
import { ElementTile } from '../ui/ElementTile'
import { Mascot } from '../ui/Mascot'
import { Icon, type IconName } from '../ui/Icon'
import { Diagram } from '../diagrams'
import { GAME_BY_ID } from '../games/registry'
import { QuestionView } from './QuestionView'
import { IconList } from '../illustrations/blocks/IconList'
import { Compare } from '../illustrations/blocks/Compare'
import { Process } from '../illustrations/blocks/Process'
import { FlipCards } from '../illustrations/blocks/FlipCards'
import { MoleculeView } from '../illustrations/molecules/MoleculeView'
import { ParticleScene } from '../illustrations/particles/ParticleScene'
import { ReactionView } from '../illustrations/particles/ReactionView'
import { CircuitView, ForcesView, GraphView, RaysView, WaveView } from '../illustrations/physics'
import { BiologyBlock } from '../illustrations/biology'
import { GeographyBlock } from '../illustrations/geography'
import { ExperimentBlock } from './experiments/ExperimentBlock'
import './blocks.css'

const CALLOUT: Record<CalloutVariant, { icon: IconName; label: string }> = {
  tip: { icon: 'bulb', label: 'Tip' },
  warning: { icon: 'alert', label: 'Pozor' },
  fact: { icon: 'sparkle', label: 'Věděl/a jsi?' },
  remember: { icon: 'pin', label: 'Zapamatuj si' },
  mascot: { icon: 'info', label: 'Kvído' },
}

export function BlockView({
  block,
  courseId,
  levelId,
  onCheck,
}: {
  block: Block
  courseId: string
  levelId: string
  onCheck?: (correct: boolean) => void
}) {
  switch (block.type) {
    case 'p':
      return (
        <p className="b-p">
          <Md text={block.text} />
        </p>
      )
    case 'h':
      return (
        <h3 className="b-h">
          <Md text={block.text} />
        </h3>
      )
    case 'list': {
      const L = block.ordered ? 'ol' : 'ul'
      return (
        <L className={`b-list${block.ordered ? ' ordered' : ''}`}>
          {block.items.map((it, i) => (
            <li key={i}>
              <Md text={it} />
            </li>
          ))}
        </L>
      )
    }
    case 'callout': {
      const c = CALLOUT[block.variant]
      if (block.variant === 'mascot')
        return (
          <div className="b-mascot">
            <Mascot mood="happy" size={64} />
            <div className="b-mascot-bubble">
              {block.title && (
                <strong className="b-callout-title">
                  <Md text={block.title} />
                </strong>
              )}
              <Md text={block.text} />
            </div>
          </div>
        )
      return (
        <aside className={`b-callout b-callout-${block.variant}`}>
          <div className="b-callout-head">
            <Icon name={c.icon} />
            <span>{block.title ? <Md text={block.title} /> : c.label}</span>
          </div>
          <div>
            <Md text={block.text} />
          </div>
        </aside>
      )
    }
    case 'keyterms':
      return (
        <dl className="b-terms">
          {block.items.map((t, i) => (
            <div key={i} className="b-term">
              <dt>
                <Md text={t.term} />
              </dt>
              <dd>
                <Md text={t.def} />
              </dd>
            </div>
          ))}
        </dl>
      )
    case 'formula':
      return (
        <figure className="b-formula">
          <div className="b-formula-body">
            <Md text={block.text} />
          </div>
          {block.caption && (
            <figcaption className="hand">
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'example':
      return (
        <section className="b-example">
          <div className="b-example-head">
            <span className="eyebrow">Řešený příklad</span>
            {block.title && (
              <strong>
                <Md text={block.title} />
              </strong>
            )}
          </div>
          <p className="b-example-problem">
            <Md text={block.problem} />
          </p>
          <ol className="b-example-steps">
            {block.steps.map((s, i) => (
              <li key={i}>
                <Md text={s} />
              </li>
            ))}
          </ol>
          <div className="b-example-answer">
            <Icon name="check" />
            <span>
              <Md text={block.answer} />
            </span>
          </div>
        </section>
      )
    case 'table':
      return (
        <figure className="b-table">
          <div className="b-table-scroll">
            <table>
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i}>
                      <Md text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>
                        <Md text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'elements':
      return (
        <figure className="b-elements">
          <div className="b-elements-row">
            {block.symbols.map((s) => (
              <ElementTile key={s} symbol={s} size={block.symbols.length > 5 ? 'sm' : 'md'} />
            ))}
          </div>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'structure':
      return (
        <figure className="b-structure">
          <pre aria-label="Strukturní vzorec">{block.art}</pre>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'diagram':
      return (
        <figure className="b-diagram">
          <Replayable>
            <Diagram id={block.id} props={block.props} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'molecule':
      return (
        <figure className="b-visual">
          <Replayable>
            <MoleculeView molecules={block.molecules} labels={block.labels} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'particles':
      return (
        <figure className="b-visual">
          <Replayable>
            <ParticleScene boxes={block.boxes} arrows={block.arrows} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'reaction':
      return (
        <figure className="b-visual">
          <Replayable>
            <ReactionView equation={block.equation} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'graph':
    case 'circuit':
    case 'forces':
    case 'rays':
    case 'wave':
      return (
        <figure className="b-visual">
          <Replayable>
            <PhysicsBlock block={block} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'punnett':
    case 'pedigree':
      return (
        <figure className="b-visual">
          <Replayable>
            <BiologyBlock block={block} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'map':
    case 'climate':
    case 'pyramid':
      return (
        <figure className="b-visual">
          <Replayable>
            <GeographyBlock block={block} />
          </Replayable>
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'process':
      return (
        <figure className="b-visual b-visual-plain">
          <Process layout={block.layout} steps={block.steps} />
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'iconlist':
      return <IconList items={block.items} />
    case 'flipcards':
      return (
        <figure className="b-visual b-visual-plain">
          <FlipCards cards={block.cards} />
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'compare':
      return (
        <figure className="b-visual b-visual-plain">
          <Compare columns={block.columns} />
          {block.caption && (
            <figcaption>
              <Md text={block.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'check':
      return (
        <div className="b-check">
          <div className="b-check-tag">
            <Icon name="target" /> Zkus si to
          </div>
          <QuestionView question={block.question} onAnswered={onCheck} compact />
        </div>
      )
    case 'experiment':
      return <ExperimentBlock id={block.id} caption={block.caption} />
    case 'game': {
      const g = GAME_BY_ID[block.gameId]
      if (!g || !g.courses[courseId]) return null // game not (yet) available in this course
      return (
        <Link className="b-game" to={`/c/${courseId}/hry/${g.id}?uroven=${levelId}`}>
          <span className="b-game-icon">
            <Icon name="gamepad" />
          </span>
          <span className="b-game-text">
            <span className="eyebrow">Mini-hra</span>
            <strong>{g.title}</strong>
            <span className="muted">{block.text ? <Md text={block.text} /> : g.blurb}</span>
          </span>
          <Icon name="arrowRight" />
        </Link>
      )
    }
  }
}

type PhysicsBlockData = Extract<Block, { type: 'graph' | 'circuit' | 'forces' | 'rays' | 'wave' }>

/** The parametric physics drawings (src/illustrations/physics). */
function PhysicsBlock({ block }: { block: PhysicsBlockData }) {
  switch (block.type) {
    case 'graph':
      return <GraphView x={block.x} y={block.y} series={block.series} marks={block.marks} />
    case 'circuit':
      return <CircuitView source={block.source} parts={block.parts} />
    case 'forces':
      return <ForcesView body={block.body} surface={block.surface} angle={block.angle} forces={block.forces} resultant={block.resultant} />
    case 'rays':
      return <RaysView element={block.element} focal={block.focal} object={block.object} height={block.height} />
    case 'wave':
      return <WaveView kind={block.kind} waves={block.waves} sum={block.sum} marks={block.marks} />
  }
}
