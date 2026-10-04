import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Icon } from '../ui/Icon'

const CONTROLS = 'button, input, select, a[href], [role="slider"], [tabindex]'

/** True once something inside `el` animates (CSS/WAAPI animation or Motion changing attributes/styles). */
function watchForAnimation(el: HTMLElement, onAnimated: () => void) {
  const finite = () =>
    el.getAnimations({ subtree: true }).some((a) => a.effect?.getComputedTiming().iterations !== Infinity)
  const mo = new MutationObserver(() => done())
  const timer = setInterval(() => finite() && done(), 400)
  function done() {
    mo.disconnect()
    clearInterval(timer)
    onAnimated()
  }
  mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['style', 'd', 'transform', 'opacity', 'stroke-dashoffset', 'cx', 'cy', 'x', 'y', 'width', 'height', 'r', 'points'] })
  if (finite()) done()
  return () => {
    mo.disconnect()
    clearInterval(timer)
  }
}

/**
 * Lets the learner replay a figure's entrance animation: tap the figure or the
 * replay button in its corner. Replaying remounts the figure, so every
 * animation (Motion, in-view triggers, CSS) starts again from the beginning.
 * The button appears only once the figure has actually animated; figures with
 * their own controls (step films, toggles) and reduced motion get none.
 */
export function Replayable({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0)
  const [ownControls, setOwnControls] = useState(true)
  const [animated, setAnimated] = useState(false)
  const body = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    setOwnControls(Boolean(body.current?.querySelector(CONTROLS)))
  }, [run])

  useEffect(() => {
    if (reduce || ownControls || animated || !body.current) return
    const el = body.current
    // a lazily loaded figure appears after mount: check for its own controls again
    return watchForAnimation(el, () => (el.querySelector(CONTROLS) ? setOwnControls(true) : setAnimated(true)))
  }, [reduce, ownControls, animated])

  const enabled = !reduce && !ownControls && animated
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
