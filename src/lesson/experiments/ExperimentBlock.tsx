import { Suspense } from 'react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import type { ExperimentId } from './catalog'
import { EXPERIMENT_COMPONENTS } from '.'

/** The `experiment` block: a framed "Vyzkoušej si" panel around one lazy-loaded experiment. */
export function ExperimentBlock({ id, caption }: { id: ExperimentId; caption?: string }) {
  const Comp = EXPERIMENT_COMPONENTS[id]
  if (!Comp) return null
  return (
    <figure className="b-visual b-experiment">
      <span className="b-experiment-tag">
        <Icon name="flask" /> Vyzkoušej si
      </span>
      <Suspense fallback={<div className="b-experiment-loading" aria-hidden="true" />}>
        <Comp />
      </Suspense>
      {caption && (
        <figcaption>
          <Md text={caption} />
        </figcaption>
      )}
    </figure>
  )
}
