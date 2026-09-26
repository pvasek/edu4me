import { useId, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from '../ui/motion'

/** Props every diagram component receives (already defaulted to {}). */
export interface DiagramProps {
  props: Record<string, unknown>
}

// ------------------------------------------------------------------ props

/** A finite number, or undefined. */
export function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

/** An integer, or undefined. */
export function int(v: unknown): number | undefined {
  const n = num(v)
  return n !== undefined && Number.isInteger(n) ? n : undefined
}

/**
 * Enum prop: returns `def` when the prop is missing, the value when it is
 * one of `options`, and `null` when it is present but invalid.
 */
export function oneOf<T extends string>(v: unknown, options: readonly T[], def: T | null = null): T | null {
  if (v === undefined || v === null) return def
  return typeof v === 'string' && (options as readonly string[]).includes(v) ? (v as T) : null
}

// ------------------------------------------------------------------ text

/** Czech number format: 1,5 */
export function fmt(n: number, digits = 1): string {
  const s = n.toFixed(digits)
  return (digits > 0 ? s.replace(/\.?0+$/, '') : s).replace('.', ',').replace('-', '−')
}

/** Estimated width of a text run (for simple collision avoidance). */
export function textWidth(s: string, size: number, factor = 0.55): number {
  return s.length * size * factor
}

/**
 * SVG text with ^{sup} and _{sub} markup (SVG has no <sup>/<sub>).
 * Example: <ChemText text="Zn^{2+}" /> or "ZnSO_{4}".
 */
export function ChemText({ text }: { text: string }) {
  const parts: { t: string; k: 'n' | 'sup' | 'sub' }[] = []
  const re = /([\^_])\{([^}]*)\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), k: 'n' })
    parts.push({ t: m[2].replace(/-/g, '−'), k: m[1] === '^' ? 'sup' : 'sub' })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: text.slice(last), k: 'n' })
  let shift = 0
  return (
    <>
      {parts.map((p, i) => {
        const target = p.k === 'sup' ? -0.42 : p.k === 'sub' ? 0.28 : 0
        const dy = target - shift
        shift = target
        return (
          <tspan key={i} dy={dy ? `${dy}em` : undefined} fontSize={p.k === 'n' ? undefined : '70%'}>
            {p.t}
          </tspan>
        )
      })}
    </>
  )
}

/** Plain text version of ChemText markup, for aria-labels. */
export function plainChem(text: string): string {
  return text.replace(/[\^_]\{([^}]*)\}/g, '$1')
}

// ------------------------------------------------------------------ svg bits

/** A unique, url()-safe id prefix for gradients and clip paths. */
export function useSvgId(): string {
  return 'dg' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
}

export function Svg({
  label,
  w,
  h,
  max,
  className = '',
  children,
  style,
  onPointerMove,
  onPointerLeave,
}: {
  label: string
  w: number
  h: number
  max?: number
  className?: string
  children: ReactNode
  style?: CSSProperties
  onPointerMove?: React.PointerEventHandler<SVGSVGElement>
  onPointerLeave?: React.PointerEventHandler<SVGSVGElement>
}) {
  return (
    <svg
      className={`dg-svg ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      style={{ maxWidth: max ? `${max}px` : undefined, ...style }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </svg>
  )
}

/**
 * Engraving-style hatch patterns. Render once inside an <svg> and use
 * `fill={hatch(id, 'd')}` on a second copy of a shape (over its base fill).
 *   d = diagonal, h = horizontal (liquids), x = cross-hatch (metals, nuclei)
 */
export function Hatches({ id, gap = 4.5 }: { id: string; gap?: number }) {
  return (
    <defs>
      <pattern id={`${id}-d`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="dg-hatch-line" x1={0} y1={0} x2={0} y2={gap} />
      </pattern>
      <pattern id={`${id}-h`} width={8} height={gap} patternUnits="userSpaceOnUse">
        <line className="dg-hatch-line" x1={0} y1={gap / 2} x2={8} y2={gap / 2} />
      </pattern>
      <pattern id={`${id}-x`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="dg-hatch-line" x1={0} y1={0} x2={0} y2={gap} />
        <line className="dg-hatch-line" x1={0} y1={0} x2={gap} y2={0} />
      </pattern>
    </defs>
  )
}

export const hatch = (id: string, kind: 'd' | 'h' | 'x') => `url(#${id}-${kind})`

/** A path that draws itself in once when it scrolls into view. */
export function DrawPath({ d, className, delay = 0, duration = 1.3 }: { d: string; className?: string; delay?: number; duration?: number }) {
  return (
    <motion.path
      d={d}
      className={className}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: ease.inOut }}
    />
  )
}

/** Group that fades in once when in view (for dashed paths, labels). */
export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: ease.out }}
    >
      {children}
    </motion.g>
  )
}

/** Straight arrow with filled triangular head(s), no <marker> ids needed. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  className = 'dg-arrow',
  head = 9,
  both = false,
  dashed = false,
  width,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  className?: string
  head?: number
  both?: boolean
  dashed?: boolean
  width?: number
}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const tip = (x: number, y: number, ang: number) => {
    const w = head * 0.55
    const bx = x - Math.cos(ang) * head
    const by = y - Math.sin(ang) * head
    return `${x},${y} ${bx + Math.sin(ang) * w},${by - Math.cos(ang) * w} ${bx - Math.sin(ang) * w},${by + Math.cos(ang) * w}`
  }
  // shorten the shaft so its end hides under the head
  const s = head * 0.7
  const sx1 = both ? x1 + Math.cos(a) * s : x1
  const sy1 = both ? y1 + Math.sin(a) * s : y1
  return (
    <g className={className}>
      <line
        x1={sx1}
        y1={sy1}
        x2={x2 - Math.cos(a) * s}
        y2={y2 - Math.sin(a) * s}
        strokeDasharray={dashed ? '5 4' : undefined}
        style={width ? { strokeWidth: width } : undefined}
      />
      <polygon points={tip(x2, y2, a)} />
      {both && <polygon points={tip(x1, y1, a + Math.PI)} />}
    </g>
  )
}

/**
 * Handwritten label with a thin leader line to a target point.
 * (x, y) is the text anchor; (tx, ty) the point being labelled.
 */
export function Label({
  x,
  y,
  tx,
  ty,
  text,
  anchor = 'start',
  className = '',
}: {
  x: number
  y: number
  tx?: number
  ty?: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
  className?: string
}) {
  let lead: ReactNode = null
  if (tx !== undefined && ty !== undefined) {
    // start the leader just beside the text
    const lx = anchor === 'start' ? x - 4 : anchor === 'end' ? x + 4 : x
    const ly = anchor === 'middle' ? (ty < y ? y - 15 : y + 5) : y - 5
    lead = (
      <>
        <line className="dg-leader" x1={lx} y1={ly} x2={tx} y2={ty} />
        <circle className="dg-leader-dot" cx={tx} cy={ty} r={2.2} />
      </>
    )
  }
  return (
    <g className={`dg-label ${className}`}>
      {lead}
      <text className="dg-note" x={x} y={y} textAnchor={anchor}>
        {text}
      </text>
    </g>
  )
}

export function Fallback({ id, reason }: { id: string; reason?: string }) {
  return (
    <div className="dg-fallback" role="note">
      <span aria-hidden="true">⚗</span> Obrázek „{id}“ se nepodařilo zobrazit{reason ? ` (${reason})` : ''}.
    </div>
  )
}
