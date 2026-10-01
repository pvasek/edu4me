import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Icon } from '../ui/Icon'

/**
 * Lets the learner replay a figure's entrance animation: tap the figure or the
 * replay button in its corner. Replaying remounts the figure, so every
 * animation (Motion, in-view triggers, CSS) starts again from the beginning.
 * Figures with their own controls (step films, toggles) are left alone.
 */
export function Replayable({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0)
  const [ownControls, setOwnControls] = useState(true)
  const body = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    setOwnControls(Boolean(body.current?.querySelector('button, input, select, a[href], [role="slider"], [tabindex]')))
  }, [run])

  const enabled = !reduce && !ownControls
  const replay = () => setRun((r) => r + 1)

  return (
    <div className={`replayable${enabled ? ' can-replay' : ''}`}>
      <div key={run} ref={body} className="replayable-body" onClick={enabled ? replay : undefined}>
        {children}
      </div>
      {enabled && (
        <button type="button" className="replay-btn" onClick={replay} aria-label="Přehrát animaci znovu" title="Přehrát znovu">
          <Icon name="refresh" width={16} height={16} />
        </button>
      )}
    </div>
  )
}
