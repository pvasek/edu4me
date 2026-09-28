/**
 * The one way to show a process in steps (see spec/illustration-guide.md, "Steps").
 *
 * - <StepFilm>  – ONE picture that changes in place: frames replace each other on a
 *   single stage, with a caption, step segments and play / pause / replay.
 *   Use it when the same object changes over time (enzyme + substrate, a mechanism,
 *   dissolving, decay). It autoplays once when the whole stage is in view and pauses
 *   when scrolled away, so the learner always sees the animation it is watching.
 * - <StepStrip> – all steps side by side as numbered panels, fully drawn, with no
 *   step-by-step animation. Use it to compare states or variants (isomers, allotropes,
 *   structure levels, polymer types).
 * - <ReplayButton> – the shared "Přehrát znovu" button for single-picture animations.
 *
 * Both step components are kit-agnostic: each step's `art` is any engraved plate.
 * A film has buttons, so its host figure must not be a role="img" wrapper: kit figures
 * take `interactive` and the film puts role="img" + the description on its stage.
 */
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import './step-figure.css'

export interface FigureStep {
  /** Short step name, shown with its number. */
  title: ReactNode
  /** One sentence shown under the picture. */
  caption?: ReactNode
  /** The picture of this step (an engraved plate). */
  art: ReactNode
  /** How long autoplay stays on this step (ms). */
  ms?: number
}

const DEFAULT_MS = 3400

export function StepFilm({ steps, label, className = '' }: { steps: FigureStep[]; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const last = steps.length - 1
  const ms = steps[i]?.ms ?? DEFAULT_MS

  // autoplay once, the first time the whole stage is on screen
  useEffect(() => {
    if (inView && !started) {
      setStarted(true)
      if (!reduce) setPlaying(true)
    }
  }, [inView, started, reduce])

  // advance while playing and visible; stop on the last step
  useEffect(() => {
    if (!playing || !inView) return
    if (i >= last) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setI((n) => Math.min(n + 1, last)), ms)
    return () => window.clearTimeout(t)
  }, [playing, inView, i, last, ms])

  const go = (n: number) => {
    setPlaying(false)
    setI(Math.max(0, Math.min(last, n)))
  }
  const play = () => {
    if (playing) setPlaying(false)
    else if (i >= last) {
      setI(0)
      setRun((r) => r + 1)
      setPlaying(true)
    } else setPlaying(true)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(i + 1)
    else if (e.key === 'ArrowLeft') go(i - 1)
  }
  const step = steps[i]

  return (
    <div
      ref={ref}
      className={`sf sf-film ${className}`}
      role="group"
      aria-roledescription="animace po krocích"
      onKeyDown={onKey}
    >
      <div className="sf-stage" role="img" aria-label={label} onClick={() => (i < last ? go(i + 1) : undefined)}>
        {/* every frame, invisible, so the stage keeps the height of the tallest one */}
        <div className="sf-sizer" aria-hidden="true">
          {steps.map((s, k) => (
            <div key={k}>{s.art}</div>
          ))}
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={`${run}-${i}`}
            className="sf-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
          >
            {step.art}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sf-bar">
        <div className="sf-segs" role="tablist" aria-label="Kroky">
          {steps.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Krok ${k + 1}`}
              className={`sf-seg${k < i ? ' done' : ''}${k === i ? ' cur' : ''}`}
              onClick={() => go(k)}
            >
              <span className="sf-seg-track">
                {k === i && playing && inView ? (
                  <motion.span
                    key={`${run}-${i}`}
                    className="sf-seg-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: ms / 1000, ease: 'linear' }}
                  />
                ) : (
                  <span className="sf-seg-fill" style={{ transform: `scaleX(${k < i || (k === i && !playing) ? 1 : 0})` }} />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="sf-caps" aria-live="polite">
          {/* all captions stacked invisibly keep the height steady */}
          {steps.map((s, k) => (
            <div key={k} className={`sf-cap${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
              <div className="sf-cap-head">
                <span className="sf-num">{k + 1}</span>
                <span className="sf-title">{s.title}</span>
              </div>
              {s.caption && <p className="sf-text">{s.caption}</p>}
            </div>
          ))}
        </div>

        <div className="sf-ctrl">
          <button type="button" className="sf-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Předchozí krok">
            ‹
          </button>
          <button type="button" className="sf-btn sf-play" onClick={play}>
            {playing ? (
              <>
                <span aria-hidden="true">❚❚</span> Pauza
              </>
            ) : i >= last ? (
              <>
                <span aria-hidden="true">↻</span> Přehrát znovu
              </>
            ) : (
              <>
                <span aria-hidden="true">▶</span> Přehrát
              </>
            )}
          </button>
          <span className="sf-count tabnum">
            {i + 1} / {steps.length}
          </span>
          <button type="button" className="sf-btn" onClick={() => go(i + 1)} disabled={i === last} aria-label="Další krok">
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

/** All steps side by side, numbered, fully drawn – no step-by-step animation. */
export function StepStrip({
  steps,
  min = 200,
  phoneColumns = 1,
  className = '',
}: {
  steps: FigureStep[]
  /** minimum panel width before the grid wraps */
  min?: number
  /** columns on phones (< 480 px): 2 for small, simple panels */
  phoneColumns?: 1 | 2
  className?: string
}) {
  return (
    <div className={`sf sf-strip ${className}`} style={{ '--sf-min': `${min}px`, '--sf-phone': phoneColumns } as CSSProperties}>
      {steps.map((s, k) => (
        <div key={k} className="sf-panel">
          <div className="sf-cap-head">
            <span className="sf-num">{k + 1}</span>
            <span className="sf-title">{s.title}</span>
          </div>
          <div className="sf-panel-art">{s.art}</div>
          {s.caption && <p className="sf-text">{s.caption}</p>}
        </div>
      ))}
    </div>
  )
}

/** The shared replay button for a single-picture animation. */
export function ReplayButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button type="button" className={`sf-replay ${className}`} onClick={onClick}>
      <span aria-hidden="true">↻</span> Přehrát znovu
    </button>
  )
}
