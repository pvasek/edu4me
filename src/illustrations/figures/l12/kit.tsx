/**
 * Shared engraving kit for the level 1–2 figures (f12-*).
 * Hatches, labels with leader lines, draw-in / pop-in variants and the
 * figure wrapper (a container-query box so small screens get a compact look).
 */
import { createContext, useContext, useId, type CSSProperties, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { ease, spring } from '../../../ui/motion'
import './l12.css'

// ------------------------------------------------------------------ hatches

const HatchCtx = createContext('f12')

/** Pattern ids: d diagonal, b back-diagonal, h horizontal (liquids), x cross (metal), s stipple, w wide diagonal. */
export type HatchKind = 'd' | 'b' | 'h' | 'x' | 's' | 'w'

export function useHatch() {
  const id = useContext(HatchCtx)
  return (k: HatchKind) => `url(#${id}-${k})`
}

function HatchDefs({ id }: { id: string }) {
  const g = 4.2
  return (
    <defs>
      <pattern id={`${id}-d`} width={g} height={g} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="f12-hl" x1={0} y1={0} x2={0} y2={g} />
      </pattern>
      <pattern id={`${id}-b`} width={g} height={g} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <line className="f12-hl" x1={0} y1={0} x2={0} y2={g} />
      </pattern>
      <pattern id={`${id}-w`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="f12-hl" x1={0} y1={0} x2={0} y2={7} />
      </pattern>
      <pattern id={`${id}-h`} width={8} height={4} patternUnits="userSpaceOnUse">
        <line className="f12-hl" x1={0} y1={2} x2={8} y2={2} />
      </pattern>
      <pattern id={`${id}-x`} width={g} height={g} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="f12-hl" x1={0} y1={0} x2={0} y2={g} />
        <line className="f12-hl" x1={0} y1={0} x2={g} y2={0} />
      </pattern>
      <pattern id={`${id}-s`} width={6} height={6} patternUnits="userSpaceOnUse">
        <circle className="f12-hs" cx={1.5} cy={1.5} r={0.7} />
        <circle className="f12-hs" cx={4.5} cy={4.5} r={0.7} />
      </pattern>
    </defs>
  )
}

/** A unique id for the patterns of one <svg>. */
export function useFigId() {
  return 'f12' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
}

// ------------------------------------------------------------------ wrappers

type Level = 1 | 2

/**
 * One-svg figure: <div class="f12"> (container for queries) > <motion.svg role="img">.
 * Children animate with variants `hidden` → `show` when the figure scrolls into view.
 * `after` renders below the svg (controls, notes), outside the image role.
 */
export function Plate({
  label,
  w,
  h,
  level,
  max = 680,
  className = '',
  children,
  after,
  svgProps,
}: {
  label: string
  w: number
  h: number
  level: Level
  max?: number
  className?: string
  children: ReactNode
  after?: ReactNode
  svgProps?: React.SVGProps<SVGSVGElement>
}) {
  const id = useFigId()
  return (
    <div className={`f12 f12-l${level} ${className}`} style={{ maxWidth: max }}>
      <HatchCtx.Provider value={id}>
        <motion.svg
          className="f12-svg"
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={label}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          {...(svgProps as object)}
        >
          <HatchDefs id={id} />
          {children}
        </motion.svg>
      </HatchCtx.Provider>
      {after}
    </div>
  )
}

/** Multi-part figure (HTML grid of small svgs, or a wide + a narrow layout): the box is the image. */
export function Board({
  label,
  level,
  max = 680,
  className = '',
  grid = '',
  children,
  after,
}: {
  label: string
  level: Level
  max?: number
  className?: string
  /** extra class for the grid box */
  grid?: string
  children: ReactNode
  after?: ReactNode
}) {
  const id = useFigId()
  return (
    <div className={`f12 f12-l${level} ${className}`} style={{ maxWidth: max }}>
      <HatchCtx.Provider value={id}>
        <svg className="f12-defs" aria-hidden="true" focusable="false">
          <HatchDefs id={id} />
        </svg>
        <motion.div
          className={`f12-board ${grid}`}
          role="img"
          aria-label={label}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.07, 0.05)}
        >
          {children}
        </motion.div>
      </HatchCtx.Provider>
      {after}
    </div>
  )
}

/** A small svg inside a Board (inherits the in-view variants). */
export function Mini({ w, h, className = '', children }: { w: number; h: number; className?: string; children: ReactNode }) {
  return (
    <motion.svg className={`f12-mini ${className}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false" variants={stagger(0.06, 0)}>
      {children}
    </motion.svg>
  )
}

// ------------------------------------------------------------------ variants

export const stagger = (step = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})

export const drawV = (delay = 0, duration = 1.1): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration, delay, ease: ease.inOut }, opacity: { duration: 0.15, delay } },
  },
})

export const popV = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { ...spring.bouncy, delay } },
})

export const fadeV = (delay = 0, duration = 0.5): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, delay, ease: ease.out } },
})

export const riseV = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: ease.out } },
})

/** Scale up from the bottom edge (liquid filling a vessel). */
export const fillV = (delay = 0, duration = 0.9): Variants => ({
  hidden: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: { duration, delay, ease: ease.out } },
})

// ------------------------------------------------------------------ primitives

/** A path that draws itself in. */
export function Draw({
  d,
  className = 'f12-line',
  delay = 0,
  dur = 1.1,
  style,
  fill,
}: {
  d: string
  className?: string
  delay?: number
  dur?: number
  style?: CSSProperties
  fill?: string
}) {
  return <motion.path d={d} className={className} variants={drawV(delay, dur)} style={style} fill={fill} />
}

/** Group that pops in (scale from its own centre, or from `origin`). */
export function Pop({
  children,
  delay = 0,
  className,
  origin,
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  origin?: string
  style?: CSSProperties
}) {
  return (
    <motion.g className={className} variants={popV(delay)} style={{ transformBox: 'fill-box', transformOrigin: origin ?? 'center', ...style }}>
      {children}
    </motion.g>
  )
}

export function Fade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.g className={className} variants={fadeV(delay)}>
      {children}
    </motion.g>
  )
}

/** Shape + the same shape filled with an engraving hatch. `tone` is a CSS colour for the base fill. */
export function Hx({
  d,
  kind = 'd',
  tone,
  className = 'f12-line',
  hatchClass = '',
}: {
  d: string
  kind?: HatchKind
  tone?: string
  className?: string
  hatchClass?: string
}) {
  const h = useHatch()
  return (
    <>
      <path d={d} className={className} style={tone ? { fill: tone } : undefined} />
      <path d={d} className={`f12-hatch ${hatchClass}`} fill={h(kind)} />
    </>
  )
}

/**
 * Italic engraved label with an optional leader line to (tx, ty).
 * `sec` marks a secondary label (hidden on narrow screens).
 */
export function Lbl({
  x,
  y,
  tx,
  ty,
  lx,
  ly,
  children,
  anchor = 'start',
  sec = false,
  className = '',
  delay = 0.4,
  line2,
  line2Sec = false,
}: {
  /** a second line below the first */
  line2?: ReactNode
  /** hide the second line on narrow screens */
  line2Sec?: boolean
  x: number
  y: number
  tx?: number
  ty?: number
  /** leader start (defaults to beside the text) */
  lx?: number
  ly?: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  sec?: boolean
  className?: string
  delay?: number
}) {
  let lead: ReactNode = null
  if (tx !== undefined && ty !== undefined) {
    const sx = lx ?? (anchor === 'start' ? x - 5 : anchor === 'end' ? x + 5 : x)
    const sy = ly ?? (anchor === 'middle' ? (ty < y ? y - 16 : y + 6) : y - 5)
    lead = (
      <>
        <motion.path className="f12-leader" d={`M${sx} ${sy} L${tx} ${ty}`} variants={drawV(delay, 0.5)} />
        <circle className="f12-dot" cx={tx} cy={ty} r={2.2} />
      </>
    )
  }
  return (
    <motion.g className={`f12-lab ${sec ? 'f12-sec' : ''} ${className}`} variants={fadeV(delay + 0.15, 0.4)}>
      {lead}
      <text className="f12-t" x={x} y={y} textAnchor={anchor}>
        {children}
        {line2 !== undefined && (
          <tspan x={x} dy="1.1em" className={line2Sec ? 'f12-sec' : undefined}>
            {line2}
          </tspan>
        )}
      </text>
    </motion.g>
  )
}

/** Sub/superscript helpers for SVG text. */
export const Sub = ({ children }: { children: ReactNode }) => (
  <tspan className="f12-sub" dy="0.3em">
    {children}
  </tspan>
)
/** Resets the baseline after <Sub>. */
export const Base = ({ children }: { children: ReactNode }) => <tspan dy="-0.3em">{children}</tspan>

/** Straight arrow with a filled head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  head = 8,
  className = 'f12-arrow',
  delay = 0,
  animate = true,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  head?: number
  className?: string
  delay?: number
  animate?: boolean
}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const w = head * 0.55
  const bx = x2 - Math.cos(a) * head
  const by = y2 - Math.sin(a) * head
  const pts = `${x2},${y2} ${bx + Math.sin(a) * w},${by - Math.cos(a) * w} ${bx - Math.sin(a) * w},${by + Math.cos(a) * w}`
  const sx = x2 - Math.cos(a) * head * 0.7
  const sy = y2 - Math.sin(a) * head * 0.7
  return (
    <g className={className}>
      {animate ? (
        <motion.path d={`M${x1} ${y1} L${sx} ${sy}`} variants={drawV(delay, 0.6)} />
      ) : (
        <path d={`M${x1} ${y1} L${sx} ${sy}`} />
      )}
      <motion.polygon points={pts} variants={fadeV(delay + (animate ? 0.5 : 0), 0.2)} />
    </g>
  )
}

/** Bunsen-style flame; (x, y) = bottom centre. `kind`: blue (non-luminous) or yellow (luminous). */
export function Flame({ x, y, h = 40, kind = 'blue', className = '' }: { x: number; y: number; h?: number; kind?: 'blue' | 'yellow'; className?: string }) {
  const w = h * (kind === 'blue' ? 0.3 : 0.34)
  const outer = `M${x} ${y - h} C${x + w * 0.4} ${y - h * 0.8} ${x + w * 1.05} ${y - h * 0.45} ${x + w * 0.62} ${y} L${x - w * 0.62} ${y} C${x - w * 1.05} ${y - h * 0.45} ${x - w * 0.4} ${y - h * 0.8} ${x} ${y - h}Z`
  const ih = h * 0.42
  const iw = w * 0.5
  const inner = `M${x} ${y - ih} C${x + iw * 0.6} ${y - ih * 0.6} ${x + iw} ${y - ih * 0.2} ${x + iw * 0.9} ${y} L${x - iw * 0.9} ${y} C${x - iw} ${y - ih * 0.2} ${x - iw * 0.6} ${y - ih * 0.6} ${x} ${y - ih}Z`
  return (
    <g className={`f12-flame f12-flame-${kind} ${className}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <path className="f12-flame-o" d={outer} />
      {kind === 'blue' ? <path className="f12-flame-i" d={inner} /> : <path className="f12-flame-c" d={inner} />}
    </g>
  )
}

/** Water molecule (O red, 2 H) centred on O; `rot` in degrees points the H's. */
export function Water({ x, y, rot = 0, s = 1, className = '' }: { x: number; y: number; rot?: number; s?: number; className?: string }) {
  return (
    <g className={`f12-h2o ${className}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <circle className="f12-atom f12-H" cx={-6.2} cy={6} r={4.2} />
      <circle className="f12-atom f12-H" cx={6.2} cy={6} r={4.2} />
      <circle className="f12-atom f12-O" cx={0} cy={0} r={7} />
      <path className="f12-shine" d="M-4 -2.5 A5 5 0 0 1 -1 -5" />
    </g>
  )
}

/** Liquid that fills its vessel from the bottom when in view. */
export function Liquid({ d, delay = 0.3, tone = 'var(--f12-water)', kind = 'h' as HatchKind, className = 'f12-liq' }: { d: string; delay?: number; tone?: string; kind?: HatchKind; className?: string }) {
  return (
    <motion.g variants={fillV(delay)} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
      <Hx d={d} kind={kind} tone={tone} className={className} />
    </motion.g>
  )
}

/** Czech number: 1 234,5 */
export function cz(n: number, digits = 1): string {
  const s = n.toFixed(digits).replace(/\.?0+$/, (m) => (digits > 0 ? '' : m))
  const [i, f] = s.split('.')
  const ii = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (f ? `${ii},${f}` : ii).replace('-', '−')
}
