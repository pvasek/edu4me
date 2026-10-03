import { useId, type ReactNode } from 'react'
import { Md } from '../../core/markup'
import './experiments.css'

const fmt = (v: number, digits: number) => v.toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** A labelled slider with its value and unit (Czech decimal comma). */
export function Control({
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  digits = 0,
  onChange,
}: {
  /** inline markup, e.g. "napětí U" or "m" */
  label: string
  unit?: string
  value: number
  min: number
  max: number
  step?: number
  digits?: number
  onChange: (v: number) => void
}) {
  const id = useId()
  const text = `${fmt(value, digits)}${unit ? ` ${unit}` : ''}`
  return (
    <div className="xp-control">
      <label htmlFor={id}>
        <Md text={label} />
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output htmlFor={id} className="tabnum">
        {text}
      </output>
    </div>
  )
}

/** A small row of toggle buttons for a discrete setting (e.g. the liquid in a tank). */
export function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  /** inline markup */
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const id = useId()
  return (
    <div className="xp-choice" role="group" aria-labelledby={id}>
      <span id={id} className="xp-choice-label">
        <Md text={label} />
      </span>
      <div className="xp-choice-opts">
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
            <Md text={o.label} />
          </button>
        ))}
      </div>
    </div>
  )
}

/** A computed value shown next to the picture ("I = 0,45 A"); a string value is shown as is ("plave"). */
export function Readout({
  label,
  value,
  unit,
  digits = 1,
  tone,
}: {
  label: string
  value: number | string
  unit?: string
  digits?: number
  tone?: 'good' | 'bad'
}) {
  const shown = typeof value === 'string' ? value : Number.isFinite(value) ? fmt(value, digits) : '–'
  return (
    <div className={`xp-readout${tone ? ` xp-${tone}` : ''}`}>
      <span>
        <Md text={label} />
      </span>
      <strong className={typeof value === 'string' ? 'xp-word' : 'tabnum'}>
        {shown}
        {unit ? ` ${unit}` : ''}
      </strong>
    </div>
  )
}

/** Layout: the picture, then controls and readouts; an optional little challenge underneath. */
export function Experiment({
  picture,
  controls,
  readouts,
  challenge,
  done,
}: {
  picture: ReactNode
  controls: ReactNode
  readouts?: ReactNode
  challenge?: string
  done?: boolean
}) {
  return (
    <div className="xp-host">
      <div className="xp">
        <div className="xp-stage">{picture}</div>
        <div className="xp-panel">
          <div className="xp-controls">{controls}</div>
          {readouts && (
            <div className="xp-readouts" aria-live="polite">
              {readouts}
            </div>
          )}
          {challenge && (
            <p className={`xp-challenge${done ? ' done' : ''}`} aria-live="polite">
              <strong>{done ? 'Hotovo!' : 'Úkol:'}</strong> <Md text={challenge} />
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
