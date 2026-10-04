/**
 * Shared drawing kit for the parametric physics blocks (graph, circuit, forces,
 * rays, wave). See spec/illustration-guide.md: engraved line art, theme tokens
 * only, role="img" + Czech aria-label, readable at 330 px.
 *
 * <Plate> owns the svg (viewBox, label, patterns, arrow heads) and tells its
 * children whether it has scrolled into view (`seen`), whether reduced motion is
 * on (`still`) and whether the container is narrow (`narrow`, < 440 px).
 */
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { Md, parse, plain } from '../../core/markup'
import type { Tone } from '../../core/types'
import { ease } from '../../ui/motion'
import './physics.css'

export { plain }

// ------------------------------------------------------------------ numbers

/** Czech number: decimal comma, real minus sign, thin-space thousands (≥ 10 000). */
export function czNum(n: number, digits?: number): string {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '−∞'
  let s: string
  if (digits === undefined) {
    const r = Math.round(n * 1e6) / 1e6
    s = String(r)
    if (/e/.test(s)) s = r.toPrecision(3)
  } else s = n.toFixed(digits)
  if (s.includes('.') && digits === undefined) s = s.replace(/\.?0+$/, '')
  let [int, dec] = s.replace('-', '').split('.')
  if (int.length > 4) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const neg = n < 0 && /[1-9]/.test(s)
  return (neg ? '−' : '') + int + (dec ? ',' + dec : '')
}

/** Decimal places needed to show multiples of `step` exactly. */
export function stepDigits(step: number): number {
  for (let d = 0; d < 8; d++) if (Math.abs(Math.round(step * 10 ** d) - step * 10 ** d) < 1e-6) return d
  return 8
}

/** A "nice" tick step (1, 2, 2.5 or 5 × 10ⁿ) giving about `target` intervals over `range`. */
export function niceStep(range: number, target = 5): number {
  if (!(range > 0)) return 1
  const raw = range / Math.max(1, target)
  const mag = 10 ** Math.floor(Math.log10(raw))
  const f = raw / mag
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nice * mag
}

/** Tick values between min and max (inclusive) for a step. */
export function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = []
  const first = Math.ceil(min / step - 1e-9)
  const last = Math.floor(max / step + 1e-9)
  for (let i = first; i <= last && out.length < 200; i++) {
    const v = Math.round(i * step * 1e9) / 1e9
    out.push(Object.is(v, -0) ? 0 : v)
  }
  return out
}

// ------------------------------------------------------------------ tones

const TONES: Tone[] = ['a', 'b', 'c', 'd']
/** The tone of the i-th item when the content does not set one. */
export const toneAt = (i: number, t?: Tone): Tone => t ?? TONES[i % TONES.length]

// ------------------------------------------------------------------ text

/**
 * Inline markup (the same syntax as <Md>: **bold**, *italic*, $chem$, ^{sup}, _{sub}, ->)
 * as SVG tspans – it runs the text through the project's markup parser and maps
 * <sup>/<sub>/<strong>/<em> to baseline-shifted, resized tspans.
 */
export function SvgMd({ text }: { text: string }) {
  const out: ReactNode[] = []
  let shift = 0
  let n = 0
  const walk = (nodes: ReactNode, st: { b?: boolean; i?: boolean; s?: 'sup' | 'sub' }) => {
    Children.forEach(nodes, (node) => {
      if (node === null || node === undefined || typeof node === 'boolean') return
      if (typeof node === 'string' || typeof node === 'number') {
        const target = st.s === 'sup' ? -0.42 : st.s === 'sub' ? 0.26 : 0
        const dy = target - shift
        shift = target
        const t = st.s ? String(node).replace(/-/g, '−') : String(node)
        out.push(
          <tspan
            key={n++}
            dy={dy ? `${dy.toFixed(2)}em` : undefined}
            fontSize={st.s ? '72%' : undefined}
            fontWeight={st.b ? 700 : undefined}
            fontStyle={st.i ? 'italic' : undefined}
          >
            {t}
          </tspan>,
        )
        return
      }
      if (!isValidElement(node)) return
      const el = node as ReactElement<{ children?: ReactNode }>
      const type = el.type
      const kids = el.props.children
      if (type === 'sup') walk(kids, { ...st, s: 'sup' })
      else if (type === 'sub') walk(kids, { ...st, s: 'sub' })
      else if (type === 'strong') walk(kids, { ...st, b: true })
      else if (type === 'em') walk(kids, { ...st, i: true })
      else walk(kids, st)
    })
  }
  walk(parse(text), {})
  // return to the baseline so following text (e.g. "= 0") is not shifted
  if (shift) out.push(<tspan key={n++} dy={`${(-shift).toFixed(2)}em`} />)
  return <>{out}</>
}

/** Rough width of a label run (for placement), in user units. */
export function textW(text: string, size: number): number {
  const p = plain(text)
  let w = 0
  const scripts = (text.match(/[\^_]\{([^}]*)\}/g) ?? []).reduce((a, s) => a + s.length - 3, 0)
  for (const ch of p) w += /[mwMWŽŠ]/.test(ch) ? 0.78 : /[ilj.,;:'|!\s]/.test(ch) ? 0.3 : /[A-Z0-9ΩΔ]/.test(ch) ? 0.6 : 0.5
  return (w - scripts * 0.18) * size
}

/** Plain-text label for aria descriptions. */
export const say = (text: string) => plain(text).replace(/\s+/g, ' ').trim()

// ------------------------------------------------------------------ geometry

export interface Box {
  x: number
  y: number
  w: number
  h: number
}
export const overlaps = (a: Box, b: Box, pad = 0) =>
  a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad

/** Does segment p→q cross the box? */
export function segHitsBox(p: [number, number], q: [number, number], b: Box): boolean {
  let t0 = 0
  let t1 = 1
  const dx = q[0] - p[0]
  const dy = q[1] - p[1]
  const clip = (pp: number, qq: number) => {
    if (Math.abs(pp) < 1e-12) return qq >= 0
    const r = qq / pp
    if (pp < 0) {
      if (r > t1) return false
      if (r > t0) t0 = r
    } else {
      if (r < t0) return false
      if (r < t1) t1 = r
    }
    return true
  }
  return (
    clip(-dx, p[0] - b.x) && clip(dx, b.x + b.w - p[0]) && clip(-dy, p[1] - b.y) && clip(dy, b.y + b.h - p[1]) && t0 <= t1
  )
}

/**
 * Picks the first candidate box that collides with nothing (or the least
 * colliding one). `taken` gets the chosen box appended.
 */
export function placeBox(
  cands: Box[],
  taken: Box[],
  segs: [[number, number], [number, number]][] = [],
  bounds?: Box,
  /** the whole drawing: a label sticking out of it would be clipped, so it loses to any other spot */
  canvas?: Box,
): Box {
  let best = cands[0]
  let bestScore = Infinity
  for (const c of cands) {
    let score = 0
    for (const t of taken) if (overlaps(c, t, 2)) score += 10
    for (const s of segs) if (segHitsBox(s[0], s[1], c)) score += 3
    if (bounds && (c.x < bounds.x || c.y < bounds.y || c.x + c.w > bounds.x + bounds.w || c.y + c.h > bounds.y + bounds.h))
      score += 6
    if (canvas && (c.x < canvas.x || c.y < canvas.y || c.x + c.w > canvas.x + canvas.w || c.y + c.h > canvas.y + canvas.h))
      score += 100
    if (score < bestScore) {
      best = c
      bestScore = score
      if (score === 0) break
    }
  }
  taken.push(best)
  return best
}

export const f1 = (n: number) => (Math.round(n * 10) / 10).toString()

// ------------------------------------------------------------------ plate

interface PlateState {
  id: string
  seen: boolean
  still: boolean
  narrow: boolean
}
const PlateCtx = createContext<PlateState>({ id: 'ph', seen: false, still: true, narrow: false })
export const usePlate = () => useContext(PlateCtx)
/** url() of a shared pattern / marker of the enclosing plate. */
export const url = (id: string, k: string) => `url(#${id}-${k})`

/** Tracks whether the container is narrower than `limit` px. */
export function useNarrow(limit = 440): { ref: RefObject<HTMLDivElement | null>; narrow: boolean } {
  const ref = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 999
      setNarrow(w > 0 && w < limit)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [limit])
  return { ref, narrow }
}

export function Plate({
  label,
  vb,
  max = 640,
  narrow,
  className = '',
  footer,
  children,
}: {
  label: string
  /** viewBox [x, y, w, h] */
  vb: [number, number, number, number]
  max?: number
  narrow: ReturnType<typeof useNarrow>
  className?: string
  /** HTML under the drawing (legend) */
  footer?: ReactNode
  children: ReactNode
}) {
  const svg = useRef<SVGSVGElement>(null)
  const seen = useInView(svg, { once: true, amount: 0.35 })
  const still = !!useReducedMotion()
  const id = 'ph' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [x, y, w, h] = vb.map((v) => Math.round(v * 10) / 10)
  return (
    <div ref={narrow.ref} className={`ph ${narrow.narrow ? 'ph-narrow' : ''} ${className}`}>
      <svg
        ref={svg}
        className="ph-svg"
        viewBox={`${x} ${y} ${w} ${h}`}
        role="img"
        aria-label={label}
        style={{ maxWidth: max }}
      >
        <Defs id={id} />
        <PlateCtx.Provider value={{ id, seen: seen || still, still, narrow: narrow.narrow }}>
          <motion.g initial={still ? false : 'hidden'} animate={seen || still ? 'show' : 'hidden'}>
            {children}
          </motion.g>
        </PlateCtx.Provider>
      </svg>
      {footer}
    </div>
  )
}

const MARKS = ['a', 'b', 'c', 'd', 'ink', 'muted'] as const
export type Mark = (typeof MARKS)[number]

function Defs({ id }: { id: string }) {
  const hl = (k: string, gap: number, rot: number, cls = 'ph-hl') => (
    <pattern key={k} id={`${id}-${k}`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
      <line className={cls} x1={0} y1={0} x2={0} y2={gap} />
    </pattern>
  )
  return (
    <defs>
      {hl('d', 4.5, 45)}
      {hl('b', 4.5, -45)}
      {hl('dd', 3, 45, 'ph-hl ph-hl-dark')}
      {TONES.map((t) => hl(`t${t}`, 4, 45, `ph-hl ph-hl-${t}`))}
      <pattern id={`${id}-h`} width={10} height={4.5} patternUnits="userSpaceOnUse">
        <line className="ph-hl" x1={0} y1={2.2} x2={10} y2={2.2} />
      </pattern>
      {MARKS.map((t) => (
        <marker
          key={t}
          id={`${id}-ah-${t}`}
          viewBox="0 0 10 10"
          refX={8.6}
          refY={5}
          markerWidth={10}
          markerHeight={10}
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path className={`ph-mk ph-mk-${t}`} d="M0 0.6 L10 5 L0 9.4 L2.6 5 Z" />
        </marker>
      ))}
      {MARKS.map((t) => (
        <marker
          key={`s${t}`}
          id={`${id}-as-${t}`}
          viewBox="0 0 10 10"
          refX={8.6}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path className={`ph-mk ph-mk-${t}`} d="M0 0.6 L10 5 L0 9.4 L2.6 5 Z" />
        </marker>
      ))}
    </defs>
  )
}

// ------------------------------------------------------------------ motion bits

const dly = (c: unknown) => (typeof c === 'number' ? c : 0)
/** pathLength draw-in; custom = [delay, duration] or delay. */
export const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (c: unknown) => {
    const [d, dur] = Array.isArray(c) ? (c as [number, number]) : [dly(c), 1]
    return {
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: Math.min(1.2, dur), delay: d, ease: ease.inOut }, opacity: { duration: 0.05, delay: d } },
    }
  },
}
export const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (c: unknown) => ({ opacity: 1, transition: { duration: 0.45, delay: dly(c), ease: ease.out } }),
}

/** Classes that carry a stroke-dasharray (pathLength would overwrite it). */
const DASHED = /\bph-(dash|dot2|ray-v|vec-res|axis|img-v)\b/

/**
 * A path that draws itself in (≤ 1.2 s). Dashed strokes are revealed through a
 * mask drawn with pathLength, so they keep their dash pattern.
 */
export function Draw({
  d,
  className = 'ph-o',
  delay = 0,
  dur = 1,
  arrow,
  small,
  start,
  style,
}: {
  d: string
  className?: string
  delay?: number
  dur?: number
  arrow?: Mark
  small?: boolean
  start?: boolean
  style?: React.CSSProperties
}) {
  const { id, still } = usePlate()
  const mid = id + 'm' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const m = arrow ? url(id, `${small ? 'as' : 'ah'}-${arrow}`) : undefined
  if (DASHED.test(className)) {
    if (still) return <path d={d} className={className} markerEnd={m} markerStart={start ? m : undefined} style={style} />
    return (
      <g>
        <mask id={mid} maskUnits="userSpaceOnUse" x={-5000} y={-5000} width={10000} height={10000}>
          <motion.path d={d} stroke="#fff" strokeWidth={16} strokeLinecap="round" fill="none" variants={drawV} custom={[delay, dur]} />
        </mask>
        <path d={d} className={className} markerEnd={m} markerStart={start ? m : undefined} style={style} mask={`url(#${mid})`} />
      </g>
    )
  }
  return (
    <motion.path
      d={d}
      className={className}
      variants={drawV}
      custom={[delay, dur]}
      markerEnd={m}
      markerStart={start ? m : undefined}
      style={style}
    />
  )
}

export function Fade({ delay = 0, children, className }: { delay?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={fadeV} custom={delay} className={className}>
      {children}
    </motion.g>
  )
}

/** A label on the plate (italic display face) with inline markup. */
export function Label({
  x,
  y,
  text,
  anchor = 'start',
  className = '',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
  className?: string
}) {
  return (
    <text x={f1(x)} y={f1(y)} textAnchor={anchor} className={`ph-lbl ${className}`}>
      <SvgMd text={text} />
    </text>
  )
}

// ------------------------------------------------------------------ legend

export interface LegendItem {
  text: string
  tone: Tone | 'ink'
  kind: 'line' | 'dashed' | 'dots' | 'bold' | 'area'
}

/** HTML legend under a plate (wraps nicely on phones). */
export function Legend({ items, label = 'Legenda' }: { items: LegendItem[]; label?: string }) {
  return (
    <ul className="ph-legend" aria-label={label}>
      {items.map((it, i) => (
        <li key={i} className={`ph-tone-${it.tone}`}>
          <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true">
            {it.kind === 'area' && <rect x={1} y={1} width={26} height={10} className="ph-leg-area" />}
            {it.kind === 'dots' ? (
              <>
                <circle cx={6} cy={6} r={2.6} className="ph-leg-dot" />
                <circle cx={14} cy={6} r={2.6} className="ph-leg-dot" />
                <circle cx={22} cy={6} r={2.6} className="ph-leg-dot" />
              </>
            ) : (
              <line
                x1={2}
                x2={26}
                y1={6}
                y2={6}
                className={`ph-leg-line ${it.kind === 'dashed' ? 'ph-dash' : ''} ${it.kind === 'bold' ? 'ph-bold' : ''}`}
              />
            )}
          </svg>
          <span>
            <Md text={it.text} />
          </span>
        </li>
      ))}
    </ul>
  )
}
