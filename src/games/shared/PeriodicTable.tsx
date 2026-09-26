import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import {
  CATEGORY_LABEL,
  ELEMENTS,
  categoryVar,
  tablePosition,
  type ChemElement,
  type ElementCategory,
} from '../../courses/chemie/data/elements'
import { Icon } from '../../ui/Icon'
import { shake, spring } from '../../ui/motion'
import './periodic-table.css'

export type CellState = 'normal' | 'dim' | 'found' | 'wrong' | 'target'

export interface PeriodicTableProps {
  /** Makes the cells buttons (arrow keys move between them). */
  onPick?: (el: ChemElement) => void
  /** Visual state per element. */
  stateOf?: (el: ChemElement) => CellState
  /** Custom cell content (replaces Z / symbol / name). */
  renderCell?: (el: ChemElement, state: CellState) => ReactNode
  /** Symbols only, smaller cells. */
  compact?: boolean
  /** Czech names under the symbols (hidden automatically on narrow tables). */
  showNames?: boolean
  /** Group numbers on top and period numbers on the left. */
  showAxes?: boolean
  /** Shows a "Zvětšit" toggle for bigger cells (useful on phones). */
  zoomable?: boolean
  /** Category colour legend under the table. */
  legend?: boolean
  /** Disables picking of every cell, or of some cells. */
  disabled?: boolean
  isDisabled?: (el: ChemElement) => boolean
  /** Accessible name of the table. */
  label?: string
  className?: string
}

const STATE_LABEL: Record<CellState, string> = {
  normal: '',
  dim: '',
  found: ', nalezeno',
  wrong: ', špatně',
  target: ', hledaný prvek',
}

const POS = ELEMENTS.map((e) => ({ e, ...tablePosition(e) }))
const AT = new Map(POS.map((p) => [`${p.row}:${p.col}`, p.e]))
const ROWS = [1, 2, 3, 4, 5, 6, 7, 9, 10]
const LEGEND: ElementCategory[] = [
  'alkali',
  'alkaline',
  'transition',
  'post',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble',
  'lanthanide',
  'actinide',
  'unknown',
]

/** Next element from `from` in a direction, skipping the gaps of the table. */
export function neighbour(from: ChemElement, key: string): ChemElement | undefined {
  const { row, col } = tablePosition(from)
  if (key === 'ArrowRight' || key === 'ArrowLeft') {
    const d = key === 'ArrowRight' ? 1 : -1
    for (let c = col + d; c >= 1 && c <= 18; c += d) {
      const e = AT.get(`${row}:${c}`)
      if (e) return e
    }
    return undefined
  }
  if (key === 'Home' || key === 'End') {
    const inRow = POS.filter((p) => p.row === row).sort((a, b) => a.col - b.col)
    return (key === 'Home' ? inRow[0] : inRow[inRow.length - 1])?.e
  }
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    const idx = ROWS.indexOf(row)
    const rows = key === 'ArrowDown' ? ROWS.slice(idx + 1) : ROWS.slice(0, idx).reverse()
    for (const r of rows) {
      const inRow = POS.filter((p) => p.row === r)
      if (!inRow.length) continue
      const same = inRow.find((p) => p.col === col)
      if (same) return same.e
      // no element straight below/above: take the nearest one in that row
      if (r >= 9 || row >= 9) {
        return inRow.reduce((best, p) => (Math.abs(p.col - col) < Math.abs(best.col - col) ? p : best)).e
      }
    }
    return undefined
  }
  return undefined
}

/** Motion targets per cell state (constants so re-renders don't restart them). */
const ANIM: Record<CellState, TargetAndTransition> = {
  normal: { opacity: 1, scale: 1, x: 0 },
  dim: { opacity: 1, scale: 1, x: 0 },
  found: { opacity: 1, scale: [1, 1.32, 1], x: 0 },
  wrong: { opacity: 1, scale: 1, x: shake.x },
  target: { opacity: 1, scale: [1, 1.2, 1, 1.2, 1, 1.2, 1], x: 0 },
}
const HOVER = { y: -2, transition: spring.snappy }
const TAP = { scale: 0.9, transition: spring.snappy }

function cellTransition(state: CellState, row: number, col: number): Transition {
  return {
    opacity: { delay: (row + col) * 0.012, duration: 0.3 },
    x: shake.transition,
    scale: state === 'target' ? { duration: 2.2, ease: 'easeInOut' } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    default: spring.snappy,
  }
}

/**
 * Responsive 18-column periodic table. The f-block sits in rows 9–10
 * with a small gap; group 3 of periods 6/7 shows "57–71" / "89–103".
 * On narrow screens it scrolls horizontally inside its own box.
 * Cells fade in as a wave on mount; found cells pop, wrong ones shake,
 * a revealed target pulses.
 */
export function PeriodicTable({
  onPick,
  stateOf,
  renderCell,
  compact = false,
  showNames = false,
  showAxes = false,
  zoomable = false,
  legend = false,
  disabled = false,
  isDisabled,
  label = 'Periodická tabulka prvků',
  className = '',
}: PeriodicTableProps) {
  const [zoom, setZoom] = useState(false)
  const [focusZ, setFocusZ] = useState(1)
  const refs = useRef(new Map<number, HTMLElement>())
  const scrollRef = useRef<HTMLDivElement>(null)
  const pickRef = useRef(onPick)
  pickRef.current = onPick
  const off = showAxes ? 1 : 0
  const interactive = !!onPick

  const states = ELEMENTS.map((e) => stateOf?.(e) ?? 'normal')
  const statesKey = states.join(',')
  const offKey = ELEMENTS.map((e) => (disabled || isDisabled?.(e) === true ? 1 : 0)).join('')
  const targetKey = ELEMENTS.filter((_, i) => states[i] === 'target')
    .map((e) => e.z)
    .join(',')

  // Bring a revealed target into view when the table scrolls.
  useEffect(() => {
    if (!targetKey) return
    const box = scrollRef.current
    const el = box?.querySelector<HTMLElement>('.g-pt-target')
    if (!box || !el) return
    const b = box.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (r.left < b.left || r.right > b.right) {
      box.scrollBy({ left: r.left - b.left - b.width / 2 + r.width / 2, behavior: 'smooth' })
    }
  }, [targetKey])

  const cells = useMemo(() => {
    const st = statesKey.split(',') as CellState[]
    const onKey = (ev: KeyboardEvent, e: ChemElement) => {
      const next = neighbour(e, ev.key)
      if (!next) return
      ev.preventDefault()
      setFocusZ(next.z)
      refs.current.get(next.z)?.focus()
    }
    return ELEMENTS.map((e, i) => {
      const { row, col } = tablePosition(e)
      const state = st[i]
      const style = {
        gridRow: row + off,
        gridColumn: col + off,
        ['--pt-bg' as string]: categoryVar(e.category),
      }
      const cls = `g-pt-cell g-pt-${state}`
      const inner = renderCell ? (
        renderCell(e, state)
      ) : (
        <>
          {!compact && <span className="g-pt-z">{e.z}</span>}
          <span className="g-pt-sym">{e.symbol}</span>
          {showNames && !compact && <span className="g-pt-name">{e.name}</span>}
        </>
      )
      const badge =
        state === 'found' || state === 'wrong' ? (
          <motion.span
            className={`g-pt-badge g-pt-badge-${state === 'found' ? 'good' : 'bad'}`}
            aria-hidden="true"
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={spring.bouncy}
          >
            <Icon name={state === 'found' ? 'check' : 'x'} />
          </motion.span>
        ) : null
      const aria = `${e.name}, ${e.symbol}, protonové číslo ${e.z}${STATE_LABEL[state]}`
      const common = {
        className: cls,
        style,
        title: e.name,
        initial: { opacity: 0 },
        animate: ANIM[state],
        transition: cellTransition(state, row, col),
      }
      if (interactive) {
        const off2 = offKey[i] === '1'
        return (
          <motion.button
            key={e.z}
            {...common}
            ref={(n: HTMLButtonElement | null) => {
              if (n) refs.current.set(e.z, n)
              else refs.current.delete(e.z)
            }}
            type="button"
            tabIndex={e.z === focusZ ? 0 : -1}
            aria-label={aria}
            aria-disabled={off2 || undefined}
            whileHover={off2 ? undefined : HOVER}
            whileTap={off2 ? undefined : TAP}
            onFocus={() => setFocusZ(e.z)}
            onKeyDown={(ev: KeyboardEvent) => onKey(ev, e)}
            onClick={() => {
              if (!off2) pickRef.current?.(e)
            }}
          >
            {inner}
            {badge}
          </motion.button>
        )
      }
      return (
        <motion.div key={e.z} {...common} aria-label={aria} role="img">
          {inner}
          {badge}
        </motion.div>
      )
    })
  }, [statesKey, offKey, focusZ, compact, showNames, off, renderCell, interactive])

  return (
    <div className={`g-pt ${compact ? 'g-pt-compact' : ''} ${zoom ? 'g-pt-zoom' : ''} ${className}`}>
      {zoomable && (
        <div className="g-pt-tools">
          <button
            type="button"
            className="btn btn-sm btn-ghost g-pt-zoombtn"
            aria-pressed={zoom}
            onClick={() => setZoom((z) => !z)}
          >
            <span aria-hidden="true" className="g-pt-zoomicon">
              {zoom ? '−' : '+'}
            </span>
            {zoom ? 'Zmenšit tabulku' : 'Zvětšit tabulku'}
          </button>
        </div>
      )}
      <div className="g-pt-scroll" ref={scrollRef}>
        <div className={`g-pt-grid ${showAxes ? 'g-pt-axes' : ''}`} role="group" aria-label={label}>
          {showAxes &&
            Array.from({ length: 18 }, (_, g) => (
              <span key={`g${g}`} className="g-pt-axis g-pt-axis-g" style={{ gridRow: 1, gridColumn: g + 2 }} aria-hidden="true">
                {g + 1}
              </span>
            ))}
          {showAxes &&
            Array.from({ length: 7 }, (_, p) => (
              <span key={`p${p}`} className="g-pt-axis g-pt-axis-p" style={{ gridRow: p + 2, gridColumn: 1 }} aria-hidden="true">
                {p + 1}
              </span>
            ))}
          <span
            className="g-pt-cell g-pt-ph"
            style={{ gridRow: 6 + off, gridColumn: 3 + off, ['--pt-bg' as string]: 'var(--cat-lanthanide)' }}
            aria-hidden="true"
          >
            57–71
          </span>
          <span
            className="g-pt-cell g-pt-ph"
            style={{ gridRow: 7 + off, gridColumn: 3 + off, ['--pt-bg' as string]: 'var(--cat-actinide)' }}
            aria-hidden="true"
          >
            89–103
          </span>
          <span className="g-pt-gap" style={{ gridRow: 8 + off }} aria-hidden="true" />
          {cells}
        </div>
      </div>
      {legend && (
        <ul className="g-pt-legend" aria-label="Kategorie prvků">
          {LEGEND.map((c) => (
            <li key={c}>
              <span className="g-pt-swatch" style={{ background: categoryVar(c) }} aria-hidden="true" />
              {CATEGORY_LABEL[c]}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PeriodicTable
