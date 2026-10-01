/**
 * SVG drawings for Výslednice sil: the scene with the force arrows (and the
 * learner's draggable arrow), the tip-to-tail / parallelogram construction,
 * force components and the incline. Physics coordinates are y-up; SVG is y-down.
 */
import { useId, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { BodyShape } from './levels'
import { angleDiff, cz, DIR_WORD, norm360, toVec, type Force, type Polar } from './logic'

export const COLORS = ['var(--blue)', 'var(--green)', 'var(--violet)', 'var(--teal)', 'var(--pink)']
export const colorOf = (i: number) => COLORS[i % COLORS.length]

interface P {
  x: number
  y: number
}

/* ------------------------------------------------------------------ primitives */

/** Arrow from `a` to `b` in SVG units, head drawn as a polygon so it takes the stroke colour. */
export function Arrow({
  a,
  b,
  color,
  width = 2.6,
  dashed = false,
  delay = 0,
  head = 10,
}: {
  a: P
  b: P
  color: string
  width?: number
  dashed?: boolean
  delay?: number
  head?: number
}) {
  const still = useReducedMotion()
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (len < 0.5) return null
  const ux = dx / len
  const uy = dy / len
  const h = Math.min(head, len * 0.6)
  const bx = b.x - ux * h * 0.8
  const by = b.y - uy * h * 0.8
  const left = { x: b.x - ux * h - uy * h * 0.45, y: b.y - uy * h + ux * h * 0.45 }
  const right = { x: b.x - ux * h + uy * h * 0.45, y: b.y - uy * h - ux * h * 0.45 }
  const t = { duration: 0.5, delay, ease: 'easeOut' as const }
  return (
    <g>
      <motion.line
        x1={a.x}
        y1={a.y}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
        initial={still || dashed ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={t}
      />
      <motion.polygon
        points={`${b.x},${b.y} ${left.x},${left.y} ${right.x},${right.y}`}
        fill={color}
        stroke={color}
        strokeWidth={1}
        strokeLinejoin="round"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...t, delay: delay + 0.35, duration: 0.15 }}
      />
    </g>
  )
}

/** "F_{1}" → F with a subscript; `extra` is appended in the normal font. */
export function Sym({ text, x, y, anchor = 'middle', color = 'var(--ink)', extra }: { text: string; x: number; y: number; anchor?: 'start' | 'middle' | 'end'; color?: string; extra?: string }) {
  const m = text.match(/^([^_]*)(?:_\{([^}]*)\})?(.*)$/)!
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className="g-fs-sym" fill={color}>
      <tspan fontStyle="italic">{m[1]}</tspan>
      {m[2] && (
        <tspan className="g-fs-sub" dy="0.35em" fontSize="0.72em">
          {m[2]}
        </tspan>
      )}
      {(m[3] || extra) && <tspan dy={m[2] ? '-0.35em' : undefined}>{m[3]}{extra}</tspan>}
    </text>
  )
}

function Hatch({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--hatch)" strokeWidth="2.2" />
      </pattern>
    </defs>
  )
}

/** The body the forces act on, centred at (0, 0), about 44 units wide. */
export function Body({ shape, fill }: { shape: BodyShape; fill: string }) {
  const s = { fill, stroke: 'var(--edge)', strokeWidth: 1.5, strokeLinejoin: 'round' as const }
  switch (shape) {
    case 'ball':
      return <circle r="16" {...s} />
    case 'ring':
      return (
        <g>
          <circle r="15" {...s} fill="none" strokeWidth={5} stroke="var(--edge)" />
          <circle r="15" fill="none" stroke="var(--surface)" strokeWidth={2} />
        </g>
      )
    case 'lamp':
      return (
        <g>
          <path d="M-18 8 L-8 -12 L8 -12 L18 8 Z" {...s} />
          <path d="M-6 8 a6 6 0 0 0 12 0" {...s} fill="var(--highlight)" />
        </g>
      )
    case 'boat':
      return <path d="M-26 -4 L26 -4 L18 12 L-20 12 Z M-8 -4 L-8 -16 L10 -16 L10 -4" {...s} />
    case 'car':
      return (
        <g>
          <path d="M-26 6 L-26 -6 L-12 -8 L-6 -18 L12 -18 L18 -8 L26 -6 L26 6 Z" {...s} />
          <circle cx="-14" cy="8" r="6" {...s} fill="var(--surface)" />
          <circle cx="14" cy="8" r="6" {...s} fill="var(--surface)" />
        </g>
      )
    case 'rocket':
      return <path d="M0 -26 C9 -16 10 -2 9 14 L14 22 L-14 22 L-9 14 C-10 -2 -9 -16 0 -26 Z" {...s} />
    case 'person':
      return (
        <g>
          <path d="M-24 -30 Q0 -52 24 -30 Z" {...s} />
          <line x1="-22" y1="-30" x2="-5" y2="-6" stroke="var(--edge)" strokeWidth="1" />
          <line x1="22" y1="-30" x2="5" y2="-6" stroke="var(--edge)" strokeWidth="1" />
          <circle cy="-8" r="6" {...s} />
          <path d="M-7 0 L7 0 L6 18 L-6 18 Z" {...s} />
        </g>
      )
    case 'sled':
      return (
        <g>
          <rect x="-24" y="-10" width="48" height="10" rx="2" {...s} />
          <path d="M-24 8 L22 8 Q30 8 28 0" fill="none" stroke="var(--edge)" strokeWidth="2" />
          <line x1="-16" y1="0" x2="-16" y2="8" stroke="var(--edge)" strokeWidth="1.5" />
          <line x1="14" y1="0" x2="14" y2="8" stroke="var(--edge)" strokeWidth="1.5" />
        </g>
      )
    case 'book':
      return <rect x="-22" y="-8" width="44" height="16" rx="2" {...s} />
    default:
      return <rect x="-20" y="-20" width="40" height="40" rx="3" {...s} />
  }
}

/* ------------------------------------------------------------------ scene */

const VIEW = { x: -170, y: -125, w: 340, h: 250 }
const LONGEST = 100
const MAX_DRAG = 150

/** Perpendicular offsets so that forces pointing the same way do not overlap. */
function offsets(angles: number[]): number[] {
  return angles.map((a, i) => {
    const same = angles.filter((b) => angleDiff(a, b) < 1)
    const idx = angles.slice(0, i).filter((b) => angleDiff(a, b) < 1).length
    return (idx - (same.length - 1) / 2) * 12
  })
}

export interface EditorProps {
  value: Polar | null
  onChange: (p: Polar) => void
  axisOnly: boolean
  snap: number
  unit: string
}

/**
 * The body with its forces drawn from the centre. With `editor` the learner
 * adds an arrow by dragging its tip (or with the keyboard on the handle).
 */
export function Scene({
  forces,
  body,
  showAxes,
  editor,
  scaleTo,
  label,
  extra,
}: {
  forces: Force[]
  body: BodyShape
  showAxes: boolean
  editor?: EditorProps
  /** Magnitude drawn as the longest arrow (defaults to the largest force). */
  scaleTo?: number
  label: string
  extra?: ReactNode
}) {
  const hid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef(false)
  const S = LONGEST / Math.max(scaleTo ?? 0, ...forces.map((f) => f.mag), 1e-9)
  const pt = (p: Polar, len = p.mag * S): P => {
    const v = toVec({ mag: len, angle: p.angle })
    return { x: v.x, y: -v.y }
  }
  const all = [...forces.map((f) => f.angle), ...(editor?.value ? [editor.value.angle] : [])]
  const off = offsets(all)

  const fromPointer = (e: PointerEvent) => {
    if (!editor || !svgRef.current) return
    const ctm = svgRef.current.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    let len = Math.min(MAX_DRAG, Math.hypot(p.x, p.y))
    let angle = norm360((Math.atan2(-p.y, p.x) * 180) / Math.PI)
    if (editor.axisOnly) angle = norm360(Math.round(angle / 90) * 90)
    else angle = Math.round(angle)
    len = len / S
    const mag = Math.max(editor.snap, Math.round(len / editor.snap) * editor.snap)
    editor.onChange({ mag: Math.min(mag, MAX_DRAG / S), angle })
  }

  const onKey = (e: KeyboardEvent) => {
    if (!editor) return
    const cur = editor.value ?? { mag: editor.snap * 5, angle: 0 }
    const big = e.shiftKey ? 10 : 1
    let next: Polar | null = null
    if (editor.axisOnly) {
      const dir: Record<string, number> = { ArrowRight: 0, ArrowUp: 90, ArrowLeft: 180, ArrowDown: 270 }
      if (e.key in dir) next = { ...cur, angle: dir[e.key] }
      else if (e.key === '+' || e.key === '=' || e.key === 'PageUp') next = { ...cur, mag: cur.mag + editor.snap * big }
      else if (e.key === '-' || e.key === 'PageDown') next = { ...cur, mag: Math.max(editor.snap, cur.mag - editor.snap * big) }
    } else {
      const step = e.shiftKey ? 1 : 5
      if (e.key === 'ArrowLeft') next = { ...cur, angle: norm360(cur.angle + step) }
      else if (e.key === 'ArrowRight') next = { ...cur, angle: norm360(cur.angle - step) }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') next = { ...cur, mag: cur.mag + editor.snap * big }
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') next = { ...cur, mag: Math.max(editor.snap, cur.mag - editor.snap * big) }
    }
    if (next) {
      e.preventDefault()
      editor.onChange({ mag: Math.min(next.mag, MAX_DRAG / S), angle: next.angle })
    }
  }

  // without an editor the picture is cropped to the arrows (horizontal scenes need little height)
  let viewBox = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`
  if (!editor && !showAxes) {
    const ys = forces.map((f) => pt(f).y)
    const top = Math.max(VIEW.y, Math.min(-34, ...ys) - 30)
    const bottom = Math.min(VIEW.y + VIEW.h, Math.max(34, ...ys) + 30)
    viewBox = `${VIEW.x} ${top} ${VIEW.w} ${bottom - top}`
  }

  const ev = editor?.value
  const tip = ev ? pt(ev) : { x: 60, y: 0 }
  const valueText = ev
    ? `F = ${cz(ev.mag)} ${editor!.unit}, ${editor!.axisOnly ? `směr ${DIR_WORD[ev.angle] ?? ''}` : `úhel ${cz(ev.angle)}°`}`
    : 'síla zatím není'

  return (
    <svg ref={svgRef} className="g-fs-svg" viewBox={viewBox} role="img" aria-label={label}>
      <Hatch id={hid} />
      {showAxes && (
        <g className="g-fs-axes" aria-hidden="true">
          <line x1={VIEW.x + 10} y1="0" x2={VIEW.x + VIEW.w - 10} y2="0" />
          <line x1="0" y1={VIEW.y + 10} x2="0" y2={VIEW.y + VIEW.h - 10} />
          <text x={VIEW.x + VIEW.w - 12} y="-6" textAnchor="end">
            x · 0°
          </text>
          <text x="-6" y={VIEW.y + 16} textAnchor="end">
            90°
          </text>
        </g>
      )}
      <Body shape={body} fill={`url(#${hid})`} />
      {forces.map((f, i) => {
        const o = off[i]
        const u = toVec({ mag: 1, angle: f.angle })
        const perp = { x: -u.y * o, y: -u.x * o }
        const a = { x: perp.x, y: perp.y }
        const b0 = pt(f, Math.max(f.mag * S, 36))
        const b = { x: b0.x + perp.x, y: b0.y + perp.y }
        let lp: P
        let anchor: 'start' | 'middle' | 'end'
        if (o !== 0 && Math.abs(u.x) > 0.9) {
          // stacked horizontal arrows: label above or below the middle
          lp = { x: Math.sign(b0.x) * Math.max(Math.abs(b0.x) * 0.55, 38) + perp.x, y: perp.y + (perp.y > 0 ? 14 : -14) }
          anchor = 'middle'
        } else if (o !== 0 && Math.abs(u.y) > 0.9) {
          lp = { x: perp.x + (perp.x > 0 ? 10 : -10), y: Math.sign(b0.y) * Math.max(Math.abs(b0.y) * 0.55, 38) + perp.y }
          anchor = perp.x > 0 ? 'start' : 'end'
        } else {
          lp = { x: b.x + u.x * 15, y: b.y - u.y * 15 }
          anchor = u.x > 0.3 ? 'start' : u.x < -0.3 ? 'end' : 'middle'
        }
        return (
          <g key={i}>
            <Arrow a={a} b={b} color={colorOf(i)} delay={0.1 + i * 0.12} />
            <Sym
              text={f.label}
              x={lp.x}
              y={lp.y}
              color={colorOf(i)}
              anchor={anchor}
            />
          </g>
        )
      })}
      {extra}
      {editor && (
        <g>
          {ev && <Arrow a={{ x: 0, y: 0 }} b={tip} color="var(--accent)" width={3.4} />}
          {ev && <Sym text="F" x={tip.x + (tip.x >= 0 ? 14 : -14)} y={tip.y + (Math.abs(tip.x) < 20 ? (tip.y > 0 ? 14 : -14) : -12)} color="var(--accent)" anchor={Math.abs(tip.x) < 20 ? 'middle' : tip.x >= 0 ? 'start' : 'end'} />}
          <g
            className="g-fs-handle"
            tabIndex={0}
            role="slider"
            aria-label={
              editor.axisOnly
                ? 'Hledaná síla: šipkami zvol směr, klávesami + a − měň velikost, nebo táhni myší či prstem'
                : 'Hledaná síla: šipkami vlevo a vpravo otáčej, nahoru a dolů měň velikost (Shift jemněji), nebo táhni'
            }
            aria-valuenow={ev ? ev.mag : 0}
            aria-valuetext={valueText}
            transform={`translate(${tip.x} ${tip.y})`}
            onKeyDown={onKey}
            onPointerDown={(e) => {
              drag.current = true
              ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
              fromPointer(e)
            }}
            onPointerMove={(e) => drag.current && fromPointer(e)}
            onPointerUp={() => (drag.current = false)}
            onPointerCancel={() => (drag.current = false)}
          >
            <circle r="24" fill="transparent" />
            <circle className="g-fs-handle-dot" r={ev ? 8 : 11} strokeDasharray={ev ? undefined : '3 3'} />
            {!ev && (
              <text y="-18" textAnchor="middle" className="g-fs-hint">
                táhni
              </text>
            )}
          </g>
        </g>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ construction */

export interface ConstructionItem {
  label: string
  polar: Polar
  color: string
}

/** Fits physics points into a ~320 × 220 box and returns the scale and viewBox. */
function fit(points: P[], maxW = 280, maxH = 170, pad = 34) {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const w = Math.max(maxX - minX, 1e-9)
  const h = Math.max(maxY - minY, 1e-9)
  const S = Math.min(maxW / w, maxH / h)
  const vw = Math.max(w * S + 2 * pad, 200)
  const vh = h * S + 2 * pad
  const cx = ((minX + maxX) / 2) * S
  const cy = -((minY + maxY) / 2) * S
  return { S, box: `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}` }
}

const isCollinear = (items: Polar[]) => items.every((p) => angleDiff(p.angle, items[0].angle) < 1 || angleDiff(p.angle, items[0].angle) > 179)

/**
 * Tip-to-tail chain (forces on one line are drawn as steps one under another)
 * or a parallelogram for two forces at an angle. `closing` is drawn from the
 * end of the chain back to the start (balance), `result` from start to end.
 */
export function Construction({
  items,
  result,
  closing,
  wrong,
  label,
}: {
  items: ConstructionItem[]
  result?: ConstructionItem
  closing?: ConstructionItem
  wrong?: Polar | null
  label: string
}) {
  const all = [...items.map((x) => x.polar), ...(closing ? [closing.polar] : [])]
  const line = isCollinear(all)
  const parallelogram = !line && !closing && items.length === 2

  if (parallelogram) {
    const a = toVec(items[0].polar)
    const b = toVec(items[1].polar)
    const r = { x: a.x + b.x, y: a.y + b.y }
    const { S, box } = fit([{ x: 0, y: 0 }, a, b, r])
    const sv = (p: P) => ({ x: p.x * S, y: -p.y * S })
    const O = { x: 0, y: 0 }
    return (
      <svg className="g-fs-svg g-fs-con" viewBox={box} role="img" aria-label={label}>
        <line className="g-fs-guide" x1={sv(a).x} y1={sv(a).y} x2={sv(r).x} y2={sv(r).y} />
        <line className="g-fs-guide" x1={sv(b).x} y1={sv(b).y} x2={sv(r).x} y2={sv(r).y} />
        <Arrow a={O} b={sv(a)} color={items[0].color} />
        <Arrow a={O} b={sv(b)} color={items[1].color} delay={0.15} />
        {result && <Arrow a={O} b={sv(r)} color={result.color} width={3.4} delay={0.6} />}
        {wrong && <Arrow a={O} b={sv(toVec(wrong))} color="var(--bad)" dashed />}
        <Sym text={items[0].label} x={sv(a).x * 0.55} y={sv(a).y * 0.55 + 14} color={items[0].color} />
        <Sym text={items[1].label} x={sv(b).x * 0.55 - 14} y={sv(b).y * 0.55} color={items[1].color} anchor="end" />
        {result && <Sym text={result.label} x={sv(r).x + 8} y={sv(r).y - 10} color={result.color} anchor="start" />}
        <circle r="3" fill="var(--edge)" />
      </svg>
    )
  }

  // chain; on one line every next arrow steps down (perpendicular) so it stays visible
  const stepDir = line ? toVec({ mag: 1, angle: all[0].angle + 90 }) : { x: 0, y: 0 }
  const step = (() => {
    const total = all.reduce((s, p) => s + p.mag, 0)
    return total * 0.09
  })()
  const segs: { a: P; b: P; item: ConstructionItem }[] = []
  let cur: P = { x: 0, y: 0 }
  items.forEach((it, k) => {
    const v = toVec(it.polar)
    const a = { x: cur.x - stepDir.x * step * k, y: cur.y - stepDir.y * step * k }
    const b = { x: a.x + v.x, y: a.y + v.y }
    segs.push({ a, b, item: it })
    cur = { x: cur.x + v.x, y: cur.y + v.y }
  })
  const n = items.length
  const endRow = { x: cur.x - stepDir.x * step * n, y: cur.y - stepDir.y * step * n }
  const startRow = { x: -stepDir.x * step * n, y: -stepDir.y * step * n }
  let closeSeg: { a: P; b: P } | null = null
  if (closing) {
    const v = toVec(closing.polar)
    const a = line ? endRow : cur
    closeSeg = { a, b: { x: a.x + v.x, y: a.y + v.y } }
  }
  const resSeg = result ? (line ? { a: startRow, b: endRow } : { a: { x: 0, y: 0 }, b: cur }) : null
  const wrongSeg = wrong && closeSeg ? { a: closeSeg.a, b: { x: closeSeg.a.x + toVec(wrong).x, y: closeSeg.a.y + toVec(wrong).y } } : null
  const pts = [
    { x: 0, y: 0 },
    ...segs.flatMap((s) => [s.a, s.b]),
    ...(closeSeg ? [closeSeg.a, closeSeg.b] : []),
    ...(resSeg ? [resSeg.a, resSeg.b] : []),
    ...(wrongSeg ? [wrongSeg.b] : []),
  ]
  const { S, box } = fit(pts)
  const sv = (p: P) => ({ x: p.x * S, y: -p.y * S })
  const labelAt = (a: P, b: P, color: string, text: string, flip = false) => {
    const A = sv(a)
    const B = sv(b)
    const dx = B.x - A.x
    const dy = B.y - A.y
    const len = Math.hypot(dx, dy) || 1
    const nx = (-dy / len) * 13 * (flip ? -1 : 1)
    const ny = (dx / len) * 13 * (flip ? -1 : 1)
    return <Sym text={text} x={(A.x + B.x) / 2 + nx} y={(A.y + B.y) / 2 + ny} color={color} />
  }
  return (
    <svg className="g-fs-svg g-fs-con" viewBox={box} role="img" aria-label={label}>
      {line &&
        segs.slice(1).map((s, k) => {
          const prev = segs[k]
          return <line key={`g${k}`} className="g-fs-guide" x1={sv(prev.b).x} y1={sv(prev.b).y} x2={sv(s.a).x} y2={sv(s.a).y} />
        })}
      {line && resSeg && (
        <>
          <line className="g-fs-guide" x1={sv({ x: 0, y: 0 }).x} y1={0} x2={sv(startRow).x} y2={sv(startRow).y} />
          <line className="g-fs-guide" x1={sv(segs[n - 1].b).x} y1={sv(segs[n - 1].b).y} x2={sv(endRow).x} y2={sv(endRow).y} />
        </>
      )}
      {line && closeSeg && <line className="g-fs-guide" x1={sv(segs[n - 1].b).x} y1={sv(segs[n - 1].b).y} x2={sv(endRow).x} y2={sv(endRow).y} />}
      {segs.map((s, k) => (
        <g key={k}>
          <Arrow a={sv(s.a)} b={sv(s.b)} color={s.item.color} delay={k * 0.35} />
          {labelAt(s.a, s.b, s.item.color, s.item.label, line)}
        </g>
      ))}
      {resSeg && result && (
        <g>
          <Arrow a={sv(resSeg.a)} b={sv(resSeg.b)} color={result.color} width={3.4} delay={n * 0.35 + 0.1} />
          {labelAt(resSeg.a, resSeg.b, result.color, result.label, line)}
        </g>
      )}
      {wrongSeg && <Arrow a={sv(wrongSeg.a)} b={sv(wrongSeg.b)} color="var(--bad)" dashed />}
      {closeSeg && closing && (
        <g>
          <Arrow a={sv(closeSeg.a)} b={sv(closeSeg.b)} color={closing.color} width={3.4} delay={n * 0.35 + 0.1} />
          {labelAt(closeSeg.a, closeSeg.b, closing.color, closing.label, line)}
        </g>
      )}
      <circle cx={sv(segs[0].a).x} cy={sv(segs[0].a).y} r="3" fill="var(--edge)" />
    </svg>
  )
}

/* ------------------------------------------------------------------ components */

/** A force at angle α with its x and y components (after the answer). */
export function ComponentsFigure({ force, body, reveal, axis, unit }: { force: Force; body: BodyShape; reveal: boolean; axis: 'x' | 'y'; unit: string }) {
  const hid = useId().replace(/:/g, '')
  const L = 120
  const v = toVec({ mag: L, angle: force.angle })
  const tip = { x: v.x, y: -v.y }
  const r = 34
  const arc = toVec({ mag: r, angle: force.angle })
  return (
    <svg
      className="g-fs-svg"
      viewBox="-70 -125 250 160"
      role="img"
      aria-label={`Síla ${cz(force.mag)} ${unit} pod úhlem ${force.angle}° nad vodorovnou rovinou${reveal ? ', rozložená do vodorovné a svislé složky' : ''}`}
    >
      <Hatch id={hid} />
      <g className="g-fs-axes" aria-hidden="true">
        <line x1="-60" y1="0" x2="170" y2="0" />
        <line x1="0" y1="-118" x2="0" y2="28" />
      </g>
      <Body shape={body} fill={`url(#${hid})`} />
      <path d={`M ${r} 0 A ${r} ${r} 0 0 0 ${arc.x} ${-arc.y}`} fill="none" stroke="var(--ink-soft)" strokeWidth="1.2" />
      <text x={r + 6} y={-8} className="g-fs-angle">
        {force.angle}°
      </text>
      {reveal && (
        <>
          <line className="g-fs-guide" x1={tip.x} y1={tip.y} x2={tip.x} y2="0" />
          <line className="g-fs-guide" x1={tip.x} y1={tip.y} x2="0" y2={tip.y} />
          <Arrow a={{ x: 0, y: 0 }} b={{ x: tip.x, y: 0 }} color={axis === 'x' ? 'var(--accent)' : 'var(--blue)'} width={axis === 'x' ? 3.4 : 2.4} delay={0.1} />
          <Arrow a={{ x: 0, y: 0 }} b={{ x: 0, y: tip.y }} color={axis === 'y' ? 'var(--accent)' : 'var(--green)'} width={axis === 'y' ? 3.4 : 2.4} delay={0.3} />
          <Sym text="F_{x}" x={tip.x / 2} y={16} color={axis === 'x' ? 'var(--accent)' : 'var(--blue)'} />
          <Sym text="F_{y}" x={-8} y={tip.y / 2} anchor="end" color={axis === 'y' ? 'var(--accent)' : 'var(--green)'} />
        </>
      )}
      <Arrow a={{ x: 0, y: 0 }} b={tip} color="var(--violet)" width={3} />
      <Sym text="F" x={tip.x + 10} y={tip.y - 6} anchor="start" color="var(--violet)" extra={` = ${cz(force.mag)} ${unit}`} />
    </svg>
  )
}

/** Block on an incline; F_G and, after the answer, its parallel and perpendicular parts. */
export function InclineFigure({ alpha, reveal, part }: { alpha: number; reveal: boolean; part: 'par' | 'perp' }) {
  const hid = useId().replace(/:/g, '')
  const t = Math.tan((alpha * Math.PI) / 180)
  const sin = Math.sin((alpha * Math.PI) / 180)
  const cos = Math.cos((alpha * Math.PI) / 180)
  const L = Math.min(290, 130 / t)
  const x0 = 10
  const y0 = 200
  const top = { x: x0 + L, y: y0 - L * t }
  const P = { x: x0 + 0.62 * L, y: y0 - 0.62 * L * t }
  const n = { x: -sin, y: -cos } // outward normal (SVG)
  const C = { x: P.x + n.x * 17, y: P.y + n.y * 17 }
  const W = 88
  const down = { x: -cos, y: sin }
  const into = { x: sin, y: cos }
  const f1 = { x: C.x + down.x * W * sin, y: C.y + down.y * W * sin }
  const f2 = { x: C.x + into.x * W * cos, y: C.y + into.y * W * cos }
  const g = { x: C.x, y: C.y + W }
  const arcR = 42
  return (
    <svg className="g-fs-svg" viewBox="-5 20 320 200" role="img" aria-label={`Těleso na nakloněné rovině se sklonem ${alpha}°${reveal ? ', tíhová síla rozložená na složku rovnoběžnou a kolmou ke svahu' : ''}`}>
      <Hatch id={hid} />
      <path d={`M ${x0} ${y0} L ${top.x} ${y0} L ${top.x} ${top.y} Z`} fill={`url(#${hid})`} stroke="var(--edge)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M ${x0 + arcR} ${y0} A ${arcR} ${arcR} 0 0 0 ${x0 + arcR * cos} ${y0 - arcR * sin}`} fill="none" stroke="var(--ink-soft)" strokeWidth="1.2" />
      <text x={x0 + arcR + 6} y={y0 - 7} className="g-fs-angle">
        {alpha}°
      </text>
      <g transform={`translate(${C.x} ${C.y}) rotate(${-alpha})`}>
        <rect x="-17" y="-17" width="34" height="34" rx="3" fill="var(--surface)" stroke="var(--edge)" strokeWidth="1.5" />
      </g>
      {reveal && (
        <>
          <line className="g-fs-guide" x1={f1.x} y1={f1.y} x2={g.x} y2={g.y} />
          <line className="g-fs-guide" x1={f2.x} y1={f2.y} x2={g.x} y2={g.y} />
          <Arrow a={C} b={f1} color={part === 'par' ? 'var(--accent)' : 'var(--blue)'} width={part === 'par' ? 3.4 : 2.4} delay={0.1} />
          <Arrow a={C} b={f2} color={part === 'perp' ? 'var(--accent)' : 'var(--green)'} width={part === 'perp' ? 3.4 : 2.4} delay={0.3} />
          <Sym text="F_{1}" x={f1.x - 6} y={f1.y - 12} anchor="end" color={part === 'par' ? 'var(--accent)' : 'var(--blue)'} />
          <Sym text="F_{2}" x={f2.x + 10} y={f2.y + 4} anchor="start" color={part === 'perp' ? 'var(--accent)' : 'var(--green)'} />
        </>
      )}
      <Arrow a={C} b={g} color="var(--violet)" width={3} />
      <Sym text="F_{G}" x={g.x + 8} y={g.y - 10} anchor="start" color="var(--violet)" />
      <circle cx={C.x} cy={C.y} r="2.5" fill="var(--edge)" />
    </svg>
  )
}
