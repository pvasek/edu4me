/**
 * Drawing kit for the physics figures of levels 10–12 (fz4, see spec/illustration-guide.md;
 * adapted from the fz3 kit). The accent is the page's level colour (--level).
 * One <Figure> per plate: it owns the viewBox, role/aria-label, the hatch
 * patterns and arrow heads, and starts the draw-in when the plate scrolls
 * into view. Children use the small motion helpers below (Draw, Pop, Fade)
 * which pick up the "hidden" → "show" variants from the Figure.
 */
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { ease, spring } from '../../../ui/motion'
import { ChemText } from '../../../diagrams/util'
import { ReplayButton } from '../../sequence/StepFigure'
import './fz4.css'

export { ChemText }

/** CPK colours (spec/illustration-guide.md). */
export const CPK: Record<string, string> = {
  H: '#f4f1ea',
  C: '#3b3b3b',
  N: '#3d6fd1',
  O: '#d9493b',
  S: '#e0b43a',
  P: '#e88b35',
  Cl: '#4fae5a',
  F: '#8fcf6b',
  Br: '#8c3a2b',
  I: '#6b3f8f',
  Na: '#8a63c9',
  K: '#7a4fb3',
  Ca: '#6b8c7a',
  Mg: '#5c9a6b',
  Fe: '#b86a3c',
  Cu: '#c7773d',
  Zn: '#8a93a3',
  Al: '#a3a8b3',
  Si: '#c2a36b',
  Li: '#b3a58f',
  Co: '#b3a58f',
}

export type Tone = 'ink' | 'acc' | 'blue' | 'lvl' | 'red' | 'green' | 'muted'

interface FigState {
  id: string
  /** the plate has scrolled into view (ambient loops may start) */
  seen: boolean
  /** reduced motion requested */
  still: boolean
  /** container narrower than 440 px */
  narrow: boolean
  /** increments on "Přehrát znovu" */
  run: number
}
const FigCtx = createContext<FigState>({
  id: 'fz4',
  seen: false,
  still: true,
  narrow: false,
  run: 0,
})
export const useFig = () => useContext(FigCtx)
/** Ambient loops run only when in view and motion is allowed. */
export const useLive = () => {
  const f = useFig()
  return f.seen && !f.still
}
/** url() of one of the Figure's shared patterns / markers. */
export const pat = (id: string, k: string) => `url(#${id}-${k})`

// ------------------------------------------------------------------ variants
const dly = (c: unknown) => (typeof c === 'number' ? c : 0)

export const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (c: unknown) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, delay: dly(c), ease: ease.inOut },
      opacity: { duration: 0.05, delay: dly(c) },
    },
  }),
}
export const popV: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (c: unknown) => ({
    opacity: 1,
    scale: 1,
    transition: { ...spring.bouncy, delay: dly(c) },
  }),
}
export const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (c: unknown) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: dly(c), ease: ease.out },
  }),
}
export const riseV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (c: unknown) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: dly(c), ease: ease.out },
  }),
}

const origin = { transformBox: 'fill-box', transformOrigin: 'center' } as const

// ------------------------------------------------------------------ figure
/**
 * Tracks whether the plate's container is narrow (< `limit` px), so a figure
 * can switch to its compact layout. Pass the result to <Figure compact={…}>.
 */
export function useCompact(limit = 440) {
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

export function Figure({
  label,
  w = 0,
  h = 0,
  x0 = 0,
  max = 640,
  level,
  className = '',
  controls,
  replay = false,
  interactive = false,
  compact,
  boost = true,
  children,
}: {
  label: string
  /** viewBox size (not needed with `interactive`) */
  w?: number
  h?: number
  /** viewBox min-x (lets a compact layout crop the side margins) */
  x0?: number
  max?: number
  level: 10 | 11 | 12
  className?: string
  /** HTML controls under the plate (toggles) */
  controls?: ReactNode
  /** show the shared "Přehrát znovu" button that re-runs the entrance (keep it ≤ ~2.5 s) */
  replay?: boolean
  /**
   * hosts a <StepFilm> / <StepStrip> (children are HTML, each step drawn with <Frame>):
   * the wrapper is then not a role="img" (the film carries role="img" + label itself)
   */
  interactive?: boolean
  /** from useCompact(): the container ref and its narrow flag */
  compact?: ReturnType<typeof useCompact>
  /** enlarge text in narrow containers (off for figures with their own compact layout) */
  boost?: boolean
  children: ReactNode
}) {
  const own = useCompact()
  const { ref: box, narrow } = compact ?? own
  const svg = useRef<SVGSVGElement>(null)
  const seen = useInView(svg, { once: true, amount: 0.4 })
  const still = !!useReducedMotion()
  const id = 'fz4' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [run, setRun] = useState(0)
  const cls = `fz4 fz4-l${level} ${narrow ? (boost ? 'fz4-narrow' : 'fz4-compact') : ''} ${className}`
  if (interactive)
    return (
      <div ref={box} className={cls}>
        <div className="fz4-host" style={{ maxWidth: max }}>
          <FigCtx.Provider value={{ id, seen: true, still, narrow, run }}>{children}</FigCtx.Provider>
        </div>
        {controls && <div className="fz4-controls">{controls}</div>}
      </div>
    )
  return (
    <div ref={box} className={cls}>
      <svg ref={svg} className="fz4-svg" viewBox={`${x0} 0 ${w} ${h}`} role="img" aria-label={label} style={{ maxWidth: max }}>
        <Defs id={id} />
        <FigCtx.Provider value={{ id, seen, still, narrow, run }}>
          <motion.g key={run} initial="hidden" animate={seen ? 'show' : 'hidden'}>
            {children}
          </motion.g>
        </FigCtx.Provider>
      </svg>
      {(controls || replay) && (
        <div className="fz4-controls">
          {controls}
          {replay && <ReplayButton onClick={() => setRun((r) => r + 1)} />}
        </div>
      )}
    </div>
  )
}

/**
 * One frame of a <StepFilm> (or one panel of a <StepStrip>) inside an `interactive`
 * Figure: an engraved svg plate with its own patterns that draws itself in as soon as
 * it is mounted (a film mounts each frame when it is shown). Keep a frame's entrance
 * ≤ ~1.2 s. Frames of one film share the same viewBox.
 */
export function Frame({ w, h, x0 = 0, className = '', children }: { w: number; h: number; x0?: number; className?: string; children: ReactNode }) {
  const host = useFig()
  const id = 'fz4' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const ref = useRef<SVGSVGElement>(null)
  // ambient loops (useLive) run only while the frame is on screen
  const seen = useInView(ref, { amount: 0.2 })
  return (
    <svg ref={ref} className={`fz4-svg ${className}`} viewBox={`${x0} 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <Defs id={id} />
      <FigCtx.Provider value={{ ...host, id, seen }}>
        <motion.g initial="hidden" animate="show">
          {children}
        </motion.g>
      </FigCtx.Provider>
    </svg>
  )
}

/** Segmented toggle (HTML, under the plate). */
export function Toggle<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { id: T; text: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="fz4-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className="fz4-btn" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.text}
        </button>
      ))}
    </div>
  )
}

const TONES: Tone[] = ['ink', 'acc', 'blue', 'lvl', 'red', 'green', 'muted']

function Defs({ id }: { id: string }) {
  const hl = (k: string, gap: number, rot: number, cls = 'fz4-hl', both = false) => (
    <pattern key={k} id={`${id}-${k}`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
      <line className={cls} x1={0} y1={0} x2={0} y2={gap} />
      {both && <line className={cls} x1={0} y1={0} x2={gap} y2={0} />}
    </pattern>
  )
  return (
    <defs>
      {hl('d', 4.5, 45)}
      {hl('dd', 2.6, 45, 'fz4-hl fz4-hl-dark')}
      {hl('b', 4.5, -45)}
      {hl('x', 4.5, 45, 'fz4-hl', true)}
      {hl('xd', 3, 45, 'fz4-hl fz4-hl-dark', true)}
      {hl('v', 4, 0)}
      {hl('hi', 2.4, 45, 'fz4-hl-light')}
      {hl('sh', 2.2, -45, 'fz4-hl-shade')}
      <pattern id={`${id}-h`} width={10} height={4.2} patternUnits="userSpaceOnUse">
        <line className="fz4-hl" x1={0} y1={2.1} x2={10} y2={2.1} />
      </pattern>
      <pattern id={`${id}-dots`} width={6} height={6} patternUnits="userSpaceOnUse">
        <circle className="fz4-stip" cx={1.5} cy={1.5} r={0.7} />
        <circle className="fz4-stip" cx={4.5} cy={4.5} r={0.7} />
      </pattern>
      <pattern id={`${id}-brick`} width={16} height={9} patternUnits="userSpaceOnUse">
        <path className="fz4-hl fz4-hl-dark" d="M0 0.5 H16 M0 5 H16 M4 0.5 V5 M12 5 V9" />
      </pattern>
      {TONES.map((t) => (
        <marker
          key={t}
          id={`${id}-ah-${t}`}
          viewBox="0 0 10 10"
          refX={8.5}
          refY={5}
          markerWidth={9}
          markerHeight={9}
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path className={`fz4-mk fz4-mk-${t}`} d="M0 0.8 L10 5 L0 9.2 L2.4 5 Z" />
        </marker>
      ))}
    </defs>
  )
}

// ------------------------------------------------------------------ motion bits
/** A stroke that draws itself in. */
export function Draw({
  d,
  className = 'fz4-o',
  delay = 0,
  arrow,
  start,
  style,
}: {
  d: string
  className?: string
  delay?: number
  arrow?: Tone
  start?: boolean
  style?: React.CSSProperties
}) {
  const { id } = useFig()
  return (
    <motion.path
      d={d}
      className={className}
      variants={drawV}
      custom={delay}
      markerEnd={arrow ? pat(id, `ah-${arrow}`) : undefined}
      markerStart={arrow && start ? pat(id, `ah-${arrow}`) : undefined}
      style={style}
    />
  )
}

export function Pop({ delay = 0, children, className }: { delay?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={popV} custom={delay} style={origin} className={className}>
      {children}
    </motion.g>
  )
}
export function Fade({ delay = 0, children, className }: { delay?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={fadeV} custom={delay} className={className}>
      {children}
    </motion.g>
  )
}
export function Rise({ delay = 0, children, className }: { delay?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={riseV} custom={delay} className={className}>
      {children}
    </motion.g>
  )
}

/**
 * Something that travels along a path forever (SMIL animateMotion, which
 * runs in SVG user units). `phase` 0–1 staggers several travellers; at rest
 * (reduced motion, not yet seen) it sits at `rest`.
 */
export function Travel({
  path,
  dur,
  phase = 0,
  rest,
  rotate,
  fade = false,
  children,
}: {
  path: string
  dur: number
  phase?: number
  rest: [number, number]
  rotate?: boolean
  /** fade in at the start and out at the end of each lap */
  fade?: boolean
  children: ReactNode
}) {
  const live = useLive()
  if (!live) return <g transform={`translate(${rest[0]} ${rest[1]})`}>{children}</g>
  const begin = `${(-phase * dur).toFixed(2)}s`
  return (
    <g>
      <animateMotion path={path} dur={`${dur}s`} begin={begin} repeatCount="indefinite" rotate={rotate ? 'auto' : undefined} />
      {fade && <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />}
      {children}
    </g>
  )
}

/** Engraved flame (for burners and kilns); `color` is the subject colour. */
export function Flame({
  x,
  y,
  h = 22,
  w = 8,
  color = '#e8892a',
  inner = '#f6d36b',
}: {
  x: number
  y: number
  h?: number
  w?: number
  color?: string
  inner?: string
}) {
  return (
    <g className="fz4-flicker">
      <path
        d={`M${x - w} ${y} Q${x - w * 1.3} ${y - h * 0.45} ${x} ${y - h} Q${x + w * 1.3} ${y - h * 0.45} ${x + w} ${y} Q${x} ${y + w * 0.35} ${x - w} ${y}Z`}
        fill={color}
        className="fz4-flame-o"
      />
      <path
        d={`M${x - w * 0.45} ${y} Q${x - w * 0.6} ${y - h * 0.3} ${x} ${y - h * 0.55} Q${x + w * 0.6} ${y - h * 0.3} ${x + w * 0.45} ${y}Z`}
        fill={inner}
      />
    </g>
  )
}

// ------------------------------------------------------------------ drawing bits
/** Straight or curved arrow (path + marker head). */
export function Arrow({
  d,
  tone = 'ink',
  className = '',
  both = false,
  dashed = false,
}: {
  d: string
  tone?: Tone
  className?: string
  both?: boolean
  dashed?: boolean
}) {
  const { id } = useFig()
  return (
    <path
      d={d}
      className={`fz4-arr fz4-arr-${tone} ${dashed ? 'fz4-dash' : ''} ${className}`}
      markerEnd={pat(id, `ah-${tone}`)}
      markerStart={both ? pat(id, `ah-${tone}`) : undefined}
    />
  )
}

/** An arrow that draws itself in. */
export function DrawArrow({
  d,
  tone = 'ink',
  delay = 0,
  className = '',
  both = false,
}: {
  d: string
  tone?: Tone
  delay?: number
  className?: string
  both?: boolean
}) {
  return <Draw d={d} className={`fz4-arr fz4-arr-${tone} ${className}`} delay={delay} arrow={tone} start={both} />
}

/**
 * Italic plate label with a thin leader line to (tx, ty).
 * `sec` marks secondary labels that disappear in narrow containers.
 */
export function Lbl({
  x,
  y,
  tx,
  ty,
  lx,
  ly,
  anchor = 'start',
  sec = false,
  className = '',
  children,
}: {
  x: number
  y: number
  tx?: number
  ty?: number
  lx?: number
  ly?: number
  anchor?: 'start' | 'middle' | 'end'
  sec?: boolean
  className?: string
  children: ReactNode
}) {
  let lead: ReactNode = null
  if (tx !== undefined && ty !== undefined) {
    // estimate the text run so the leader leaves from the side facing the target
    const size = className.includes('fz4-big') ? 19 : className.includes('fz4-sm') ? 14.5 : 16.5
    const tw = flat(children).length * size * (className.includes('fz4-b') ? 0.46 : 0.43)
    const left = anchor === 'start' ? x : anchor === 'end' ? x - tw : x - tw / 2
    const right = left + tw
    let sx: number
    let sy = y - size * 0.3
    if (tx > right) sx = right + 4
    else if (tx < left) sx = left - 4
    else {
      sx = Math.min(Math.max(tx, left), right)
      sy = ty < y ? y - size * 0.95 : y + 5
    }
    sx = lx ?? sx
    sy = ly ?? sy
    lead = (
      <>
        <line className="fz4-lead" x1={sx} y1={sy} x2={tx} y2={ty} />
        <circle className="fz4-dot" cx={tx} cy={ty} r={2} />
      </>
    )
  }
  return (
    <g className={`${sec ? 'fz4-sec' : ''}`}>
      {lead}
      <text className={`fz4-lbl ${className}`} x={x} y={y} textAnchor={anchor}>
        {children}
      </text>
    </g>
  )
}

function flat(n: ReactNode): string {
  if (n === null || n === undefined || typeof n === 'boolean') return ''
  if (typeof n === 'string' || typeof n === 'number') return String(n)
  if (Array.isArray(n)) return n.map(flat).join('')
  if (typeof n === 'object' && 'props' in n) {
    const p = (n as { props: { children?: ReactNode; text?: string } }).props
    return p.text ? p.text.replace(/[\^_]\{([^}]*)\}/g, '$1') : flat(p.children)
  }
  return ''
}

/** A formula (ChemText markup: ^{2+}, _{2}). */
export function Eq({
  x,
  y,
  t,
  anchor = 'start',
  className = '',
}: {
  x: number
  y: number
  t: string
  anchor?: 'start' | 'middle' | 'end'
  className?: string
}) {
  return (
    <text className={`fz4-eq ${className}`} x={x} y={y} textAnchor={anchor}>
      <ChemText text={t} />
    </text>
  )
}

function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/** Crescent (as a path) inside a circle, facing angle `a` (radians). */
function crescent(x: number, y: number, r: number, a: number, span = 1.5, inset = 0.8) {
  const ro = r * inset
  const a1 = a - span / 2
  const a2 = a + span / 2
  const p1 = [x + Math.cos(a1) * ro, y + Math.sin(a1) * ro]
  const p2 = [x + Math.cos(a2) * ro, y + Math.sin(a2) * ro]
  return `M${p1[0].toFixed(2)} ${p1[1].toFixed(2)} A${ro} ${ro} 0 0 1 ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} A${(ro * 1.35).toFixed(2)} ${(ro * 1.35).toFixed(2)} 0 0 0 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}Z`
}

/** An engraved CPK atom or ion with a crescent highlight and shade. */
export function Atom({
  x,
  y,
  r = 14,
  el,
  text,
  fill,
  size,
  className = '',
}: {
  x: number
  y: number
  r?: number
  el: string
  /** label (ChemText markup); defaults to the symbol, '' for none */
  text?: string
  fill?: string
  size?: number
  className?: string
}) {
  const { id } = useFig()
  const col = fill ?? CPK[el] ?? '#b3a58f'
  const dark = lum(col) < 0.55
  const t = text ?? el
  return (
    <g className={`fz4-atom ${className}`}>
      <circle cx={x} cy={y} r={r} fill={col} className="fz4-atom-b" />
      {r >= 6 && <path d={crescent(x, y, r, Math.PI * 1.25)} fill={pat(id, 'hi')} className="fz4-nohit" />}
      {r >= 6 && <path d={crescent(x, y, r, Math.PI * 0.25, 1.9, 0.92)} fill={pat(id, 'sh')} className="fz4-nohit" />}
      <circle cx={x} cy={y} r={r} className="fz4-atom-o" />
      {t && (
        <text
          x={x}
          y={y + (size ?? r * 0.8) * 0.36}
          textAnchor="middle"
          className={`fz4-atom-t ${dark ? 'fz4-atom-t-l' : 'fz4-atom-t-d'}`}
          style={{ fontSize: size ?? Math.max(8, r * 0.8) }}
        >
          <ChemText text={t} />
        </text>
      )}
    </g>
  )
}

/** A thick engraved pipe (hollow double line) with optional flowing gas. */
export function Pipe({ d, gas, w = 10, delay = 0, reverse = false }: { d: string; gas?: string; w?: number; delay?: number; reverse?: boolean }) {
  return (
    <g className="fz4-pipe">
      <Draw d={d} className="fz4-pipe-o" delay={delay} style={{ strokeWidth: w + 3 }} />
      <Draw d={d} className="fz4-pipe-i" delay={delay} style={{ strokeWidth: w }} />
      {gas && (
        <motion.path
          d={d}
          variants={fadeV}
          custom={delay + 0.9}
          className={`fz4-flow ${reverse ? 'fz4-flow-rev' : ''}`}
          style={{ stroke: gas, strokeWidth: Math.max(2, w * 0.36) }}
        />
      )}
    </g>
  )
}

/** Liquid body: tinted fill + horizontal engraving hatch. */
export function Liquid({ d, color, opacity = 0.45, className = '' }: { d: string; color: string; opacity?: number; className?: string }) {
  const { id } = useFig()
  return (
    <g className={className}>
      <path d={d} fill={color} fillOpacity={opacity} />
      <path d={d} fill={pat(id, 'h')} className="fz4-nohit" />
    </g>
  )
}

/** Rising bubbles (CSS loop) from (x, y) up by `rise`. */
export function Bubbles({
  x,
  y,
  rise = 40,
  n = 4,
  spread = 10,
  r = 2.6,
  className = '',
  color,
}: {
  x: number
  y: number
  rise?: number
  n?: number
  spread?: number
  r?: number
  className?: string
  color?: string
}) {
  return (
    <g className={`fz4-bubbles ${className}`}>
      {Array.from({ length: n }, (_, i) => {
        const bx = x + (((i * 37) % 11) / 10) * spread - spread / 2
        const by = y - (i / n) * rise * 0.8
        return (
          <circle
            key={i}
            cx={bx}
            cy={by}
            r={r * (0.75 + ((i * 5) % 4) / 8)}
            className="fz4-bubble"
            style={{
              ['--rise' as string]: `${-rise * (1 - i / n)}px`,
              animationDelay: `${(-i * 0.47).toFixed(2)}s`,
              fill: color,
            }}
          />
        )
      })}
    </g>
  )
}

/** Small "+"/"−" badge. */
export function Sign({ x, y, s, r = 11 }: { x: number; y: number; s: '+' | '−'; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="fz4-badge" />
      <text x={x} y={y + r * 0.42} textAnchor="middle" className="fz4-badge-t" style={{ fontSize: r * 1.35 }}>
        {s}
      </text>
    </g>
  )
}

/** Deterministic pseudo-random numbers for scattering particles. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Point on a quadratic Bézier. */
export function qpt(p0: [number, number], c: [number, number], p1: [number, number], t: number): [number, number] {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]
}

// ------------------------------------------------------------------ physics bits
const pt = (p: P2) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

/**
 * A light ray through the points `pts`: one stroke per segment, each with an
 * arrow head in its middle (the optics convention). `dashed` for extensions
 * (virtual rays), `faint` for a weak partial reflection.
 */
export function Ray({
  pts,
  tone = 'lvl',
  delay = 0,
  dashed = false,
  faint = false,
  heads = true,
  color,
  className = '',
}: {
  pts: P2[]
  tone?: Tone
  delay?: number
  dashed?: boolean
  faint?: boolean
  heads?: boolean
  /** literal subject colour (spectral rays) */
  color?: string
  className?: string
}) {
  const { id } = useFig()
  const segs = pts.slice(1).map((b, i) => [pts[i], b] as const)
  return (
    <g
      className={`fz4-ray fz4-ray-${tone} ${dashed ? 'fz4-ray-dash' : ''} ${faint ? 'fz4-ray-faint' : ''} ${className}`}
      style={color ? { stroke: color } : undefined}
    >
      {segs.map(([a, b], i) => {
        const m: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        return (
          <motion.path
            key={i}
            d={`M${pt(a)} L${pt(m)} L${pt(b)}`}
            variants={drawV}
            custom={delay + i * 0.35}
            markerMid={heads && !dashed ? pat(id, `ah-${tone}`) : undefined}
            style={color ? { stroke: color } : undefined}
          />
        )
      })}
    </g>
  )
}

/** Arc marking the angle at `c` between directions a1 → a2 (degrees, screen clockwise), with a label. */
export function Angle({
  c,
  a1,
  a2,
  r = 30,
  text,
  tr,
  className = '',
}: {
  c: P2
  a1: number
  a2: number
  r?: number
  text?: string
  /** label distance (default r + 12) */
  tr?: number
  className?: string
}) {
  const p = (a: number, rr: number): P2 => [c[0] + Math.cos((a * Math.PI) / 180) * rr, c[1] + Math.sin((a * Math.PI) / 180) * rr]
  const sweep = (a2 - a1 + 360) % 360 <= 180 ? 1 : 0
  const mid = sweep ? a1 + ((a2 - a1 + 360) % 360) / 2 : a1 - ((a1 - a2 + 360) % 360) / 2
  const lp = p(mid, tr ?? r + 12)
  return (
    <g className={className}>
      <path d={`M${pt(p(a1, r))} A${r} ${r} 0 0 ${sweep} ${pt(p(a2, r))}`} className="fz4-angle" />
      {text && (
        <text x={lp[0]} y={lp[1] + 5} textAnchor="middle" className="fz4-lbl fz4-b fz4-ang-t">
          {text}
        </text>
      )}
    </g>
  )
}

/** Numbered badge (for anatomy plates with a legend). */
export function Num({ x, y, n, r = 10 }: { x: number; y: number; n: number | string; r?: number }) {
  return (
    <g className="fz4-num-badge">
      <circle cx={x} cy={y} r={r} />
      <text x={x} y={y + r * 0.4} textAnchor="middle" style={{ fontSize: r * 1.15 }}>
        {n}
      </text>
    </g>
  )
}

/**
 * Time in seconds (0 → `dur`) of a one-shot animation that starts when the plate
 * is seen and restarts on "Přehrát znovu". Reduced motion shows the end at once.
 */
export function useClock(dur: number) {
  const { seen, still, run } = useFig()
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (still || typeof requestAnimationFrame === 'undefined') {
      setT(dur)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const s = Math.min(dur, (now - t0) / 1000)
      setT(s)
      if (s < dur) raf = requestAnimationFrame(tick)
    }
    setT(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, still, run, dur])
  return t
}

// ------------------------------------------------------------------ numbers
export type P2 = [number, number]
export const f1 = (n: number) => n.toFixed(1)
/** Czech number formatting: decimal comma, thin space for thousands. */
export const cz = (n: number, digits = 0) => {
  const [i, d] = n.toFixed(digits).split('.')
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return d ? `${int},${d}` : int
}

/**
 * Italic physics symbol (ChemText markup: v_{x}, F_{g}, T^{2}).
 * Variables are italic by convention; units belong in <Eq> (upright).
 */
export function Sym({
  x,
  y,
  t,
  anchor = 'middle',
  tone = 'ink',
  className = '',
}: {
  x: number
  y: number
  t: string
  anchor?: 'start' | 'middle' | 'end'
  tone?: Tone
  className?: string
}) {
  return (
    <text className={`fz4-sym-t fz4-tone-${tone} ${className}`} x={x} y={y} textAnchor={anchor}>
      <ChemText text={t} />
    </text>
  )
}

/**
 * A vector arrow from `a` to `b` (draws in), optionally labelled with a symbol at `at`
 * (default: beyond the tip).
 */
export function Vec({
  a,
  b,
  tone = 'lvl',
  t,
  at,
  anchor = 'middle',
  delay = 0,
  wide = true,
  still = false,
}: {
  a: P2
  b: P2
  tone?: Tone
  /** symbol (ChemText markup) */
  t?: string
  at?: P2
  anchor?: 'start' | 'middle' | 'end'
  delay?: number
  wide?: boolean
  /** no draw-in (inside frames that must be complete at once) */
  still?: boolean
}) {
  const d = `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}`
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const lp: P2 = at ?? [b[0] + ((b[0] - a[0]) / len) * 14, b[1] + ((b[1] - a[1]) / len) * 14 + 5]
  return (
    <g>
      {still ? (
        <Arrow d={d} tone={tone} className={wide ? 'fz4-vec' : ''} />
      ) : (
        <DrawArrow d={d} tone={tone} delay={delay} className={wide ? 'fz4-vec' : ''} />
      )}
      {t && (
        <Fade delay={still ? 0 : delay + 0.5}>
          <Sym x={lp[0]} y={lp[1]} t={t} tone={tone} anchor={anchor} />
        </Fade>
      )}
    </g>
  )
}

/** A filled arrow head at (x, y) pointing along `deg` (screen degrees, 0 = right, 90 = down). */
export function Head({ x, y, deg, tone = 'ink', s = 1 }: { x: number; y: number; deg: number; tone?: Tone; s?: number }) {
  return (
    <path
      d="M-5 -4.2 L5 0 L-5 4.2 L-2.6 0Z"
      className={`fz4-mk fz4-mk-${tone}`}
      transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(deg)}) scale(${s})`}
    />
  )
}

/** Direction into (⊗) or out of (⊙) the page: current in a wire seen end-on. */
export function EndOn({ x, y, r = 9, out, tone = 'acc' }: { x: number; y: number; r?: number; out: boolean; tone?: Tone }) {
  const k = r * 0.5
  return (
    <g className={`fz4-endon fz4-endon-${tone}`}>
      <circle cx={x} cy={y} r={r} />
      {out ? (
        <circle cx={x} cy={y} r={r * 0.26} className="fz4-endon-dot" />
      ) : (
        <path d={`M${x - k} ${y - k} L${x + k} ${y + k} M${x + k} ${y - k} L${x - k} ${y + k}`} />
      )}
    </g>
  )
}

export const NORTH = '#c0463a'
export const SOUTH = '#3f6fb5'

/** A magnet pole block (N red, S blue) with its letter. */
export function PoleBlock({ x, y, w, h, n, r = 3 }: { x: number; y: number; w: number; h: number; n: 'N' | 'S'; r?: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={n === 'N' ? NORTH : SOUTH} className="fz4-o" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={pat(id, 'd')} opacity={0.5} />
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" className="fz4-pole-t">
        {n}
      </text>
    </g>
  )
}

/** Sine path from x0 along `len` px: y = y0 − amp·sin(2π·(x/λ) + ph). */
export function sine(x0: number, y0: number, len: number, amp: number, lambda: number, ph = 0, step = 3) {
  const pts: string[] = []
  for (let s = 0; s <= len + 0.01; s += step) {
    const x = x0 + Math.min(s, len)
    pts.push(`${f1(x)} ${f1(y0 - amp * Math.sin((2 * Math.PI * Math.min(s, len)) / lambda + ph))}`)
  }
  return 'M' + pts.join(' L')
}

/** Two axes with arrow heads; origin at (x, y), the x axis `w` long, the y axis `h` up (and `down` below). */
export function Axes({
  x,
  y,
  w,
  h,
  down = 0,
  xl,
  yl,
  delay = 0,
}: {
  x: number
  y: number
  w: number
  h: number
  down?: number
  xl: string
  yl: string
  delay?: number
}) {
  return (
    <g>
      <DrawArrow d={`M${x} ${y} H${x + w}`} tone="ink" delay={delay} className="fz4-axis" />
      <DrawArrow d={`M${x} ${y + down} V${y - h}`} tone="ink" delay={delay} className="fz4-axis" />
      <Fade delay={delay + 0.4}>
        <Sym x={x + w - 2} y={y + 20} t={xl} anchor="end" />
        <Sym x={x + 8} y={y - h + 6} t={yl} anchor="start" />
      </Fade>
    </g>
  )
}

/** A light boxed formula / note (the level tint when `lvl`). */
export function Note({
  x,
  y,
  w,
  h = 30,
  lvl = false,
  children,
}: {
  x: number
  y: number
  w: number
  h?: number
  lvl?: boolean
  children: ReactNode
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={lvl ? 'fz4-tag-lvl' : 'fz4-tag'} />
      {children}
    </g>
  )
}

/**
 * A quantity "symbol = value": the symbol (ChemText markup, e.g. Q_{1}) italic,
 * the value and unit upright.
 */
export function Qty({
  x,
  y,
  s,
  v,
  anchor = 'start',
  className = '',
}: {
  x: number
  y: number
  s: string
  v?: string
  anchor?: 'start' | 'middle' | 'end'
  className?: string
}) {
  return (
    <text className={`fz4-eq ${className}`} x={x} y={y} textAnchor={anchor}>
      <tspan className="fz4-it fz4-qs">
        {/* the zero-width tail resets the baseline after a trailing index */}
        <ChemText text={s + '​'} />
      </tspan>
      {v !== undefined && <ChemText text={` = ${v}`} />}
    </text>
  )
}
