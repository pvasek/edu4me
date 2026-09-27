/**
 * Drawing kit for the level 6–7 engraved figures (see spec/illustration-guide.md).
 * One <Figure> per plate: it owns the viewBox, role/aria-label, the hatch
 * patterns and arrow heads, and starts the draw-in when the plate scrolls
 * into view. Children use the small motion helpers below (Draw, Pop, Fade)
 * which pick up the "hidden" → "show" variants from the Figure.
 */
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { ease, spring } from '../../../ui/motion'
import { ChemText } from '../../../diagrams/util'
import './l67.css'

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
const FigCtx = createContext<FigState>({ id: 'f67', seen: false, still: true, narrow: false, run: 0 })
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
    transition: { pathLength: { duration: 1.1, delay: dly(c), ease: ease.inOut }, opacity: { duration: 0.05, delay: dly(c) } },
  }),
}
export const popV: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (c: unknown) => ({ opacity: 1, scale: 1, transition: { ...spring.bouncy, delay: dly(c) } }),
}
export const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: (c: unknown) => ({ opacity: 1, transition: { duration: 0.5, delay: dly(c), ease: ease.out } }),
}
export const riseV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (c: unknown) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: dly(c), ease: ease.out } }),
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
  w,
  h,
  x0 = 0,
  max = 640,
  level,
  className = '',
  controls,
  replay = false,
  compact,
  children,
}: {
  label: string
  w: number
  h: number
  /** viewBox min-x (lets a compact layout crop the side margins) */
  x0?: number
  max?: number
  level: 6 | 7
  className?: string
  /** HTML controls under the plate (toggles) */
  controls?: ReactNode
  /** show a "Přehrát znovu" button that re-runs the entrance */
  replay?: boolean
  /** from useCompact(): the container ref and its narrow flag */
  compact?: ReturnType<typeof useCompact>
  children: ReactNode
}) {
  const own = useCompact()
  const { ref: box, narrow } = compact ?? own
  const svg = useRef<SVGSVGElement>(null)
  const seen = useInView(svg, { once: true, amount: 0.25 })
  const still = !!useReducedMotion()
  const id = 'f67' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [run, setRun] = useState(0)
  return (
    <div ref={box} className={`f67 f67-l${level} ${narrow ? 'f67-narrow' : ''} ${className}`}>
      <svg ref={svg} className="f67-svg" viewBox={`${x0} 0 ${w} ${h}`} role="img" aria-label={label} style={{ maxWidth: max }}>
        <Defs id={id} />
        <FigCtx.Provider value={{ id, seen, still, narrow, run }}>
          <motion.g key={run} initial="hidden" animate={seen ? 'show' : 'hidden'}>
            {children}
          </motion.g>
        </FigCtx.Provider>
      </svg>
      {(controls || replay) && (
        <div className="f67-controls">
          {controls}
          {replay && (
            <button type="button" className="f67-btn f67-btn-ghost" onClick={() => setRun((r) => r + 1)}>
              <span aria-hidden="true">↻</span> Přehrát znovu
            </button>
          )}
        </div>
      )}
    </div>
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
    <div className="f67-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className="f67-btn" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.text}
        </button>
      ))}
    </div>
  )
}

const TONES: Tone[] = ['ink', 'acc', 'blue', 'lvl', 'red', 'green', 'muted']

function Defs({ id }: { id: string }) {
  const hl = (k: string, gap: number, rot: number, cls = 'f67-hl', both = false) => (
    <pattern key={k} id={`${id}-${k}`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
      <line className={cls} x1={0} y1={0} x2={0} y2={gap} />
      {both && <line className={cls} x1={0} y1={0} x2={gap} y2={0} />}
    </pattern>
  )
  return (
    <defs>
      {hl('d', 4.5, 45)}
      {hl('dd', 2.6, 45, 'f67-hl f67-hl-dark')}
      {hl('b', 4.5, -45)}
      {hl('x', 4.5, 45, 'f67-hl', true)}
      {hl('xd', 3, 45, 'f67-hl f67-hl-dark', true)}
      {hl('v', 4, 0)}
      {hl('hi', 2.4, 45, 'f67-hl-light')}
      {hl('sh', 2.2, -45, 'f67-hl-shade')}
      <pattern id={`${id}-h`} width={10} height={4.2} patternUnits="userSpaceOnUse">
        <line className="f67-hl" x1={0} y1={2.1} x2={10} y2={2.1} />
      </pattern>
      <pattern id={`${id}-dots`} width={6} height={6} patternUnits="userSpaceOnUse">
        <circle className="f67-stip" cx={1.5} cy={1.5} r={0.7} />
        <circle className="f67-stip" cx={4.5} cy={4.5} r={0.7} />
      </pattern>
      <pattern id={`${id}-brick`} width={16} height={9} patternUnits="userSpaceOnUse">
        <path className="f67-hl f67-hl-dark" d="M0 0.5 H16 M0 5 H16 M4 0.5 V5 M12 5 V9" />
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
          <path className={`f67-mk f67-mk-${t}`} d="M0 0.8 L10 5 L0 9.2 L2.4 5 Z" />
        </marker>
      ))}
    </defs>
  )
}

// ------------------------------------------------------------------ motion bits
/** A stroke that draws itself in. */
export function Draw({
  d,
  className = 'f67-o',
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
export function Flame({ x, y, h = 22, w = 8, color = '#e8892a', inner = '#f6d36b' }: { x: number; y: number; h?: number; w?: number; color?: string; inner?: string }) {
  return (
    <g className="f67-flicker">
      <path d={`M${x - w} ${y} Q${x - w * 1.3} ${y - h * 0.45} ${x} ${y - h} Q${x + w * 1.3} ${y - h * 0.45} ${x + w} ${y} Q${x} ${y + w * 0.35} ${x - w} ${y}Z`} fill={color} className="f67-flame-o" />
      <path d={`M${x - w * 0.45} ${y} Q${x - w * 0.6} ${y - h * 0.3} ${x} ${y - h * 0.55} Q${x + w * 0.6} ${y - h * 0.3} ${x + w * 0.45} ${y}Z`} fill={inner} />
    </g>
  )
}

// ------------------------------------------------------------------ drawing bits
/** Straight or curved arrow (path + marker head). */
export function Arrow({ d, tone = 'ink', className = '', both = false, dashed = false }: { d: string; tone?: Tone; className?: string; both?: boolean; dashed?: boolean }) {
  const { id } = useFig()
  return (
    <path
      d={d}
      className={`f67-arr f67-arr-${tone} ${dashed ? 'f67-dash' : ''} ${className}`}
      markerEnd={pat(id, `ah-${tone}`)}
      markerStart={both ? pat(id, `ah-${tone}`) : undefined}
    />
  )
}

/** An arrow that draws itself in. */
export function DrawArrow({ d, tone = 'ink', delay = 0, className = '', both = false }: { d: string; tone?: Tone; delay?: number; className?: string; both?: boolean }) {
  return <Draw d={d} className={`f67-arr f67-arr-${tone} ${className}`} delay={delay} arrow={tone} start={both} />
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
    const sx = lx ?? (anchor === 'start' ? x - 4 : anchor === 'end' ? x + 4 : x)
    const sy = ly ?? (anchor === 'middle' ? (ty < y ? y - 15 : y + 5) : y - 5)
    lead = (
      <>
        <line className="f67-lead" x1={sx} y1={sy} x2={tx} y2={ty} />
        <circle className="f67-dot" cx={tx} cy={ty} r={2} />
      </>
    )
  }
  return (
    <g className={`${sec ? 'f67-sec' : ''}`}>
      {lead}
      <text className={`f67-lbl ${className}`} x={x} y={y} textAnchor={anchor}>
        {children}
      </text>
    </g>
  )
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
    <text className={`f67-eq ${className}`} x={x} y={y} textAnchor={anchor}>
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
    <g className={`f67-atom ${className}`}>
      <circle cx={x} cy={y} r={r} fill={col} className="f67-atom-b" />
      {r >= 6 && <path d={crescent(x, y, r, Math.PI * 1.25)} fill={pat(id, 'hi')} className="f67-nohit" />}
      {r >= 6 && <path d={crescent(x, y, r, Math.PI * 0.25, 1.9, 0.92)} fill={pat(id, 'sh')} className="f67-nohit" />}
      <circle cx={x} cy={y} r={r} className="f67-atom-o" />
      {t && (
        <text
          x={x}
          y={y + (size ?? r * 0.8) * 0.36}
          textAnchor="middle"
          className={`f67-atom-t ${dark ? 'f67-atom-t-l' : 'f67-atom-t-d'}`}
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
    <g className="f67-pipe">
      <Draw d={d} className="f67-pipe-o" delay={delay} style={{ strokeWidth: w + 3 }} />
      <Draw d={d} className="f67-pipe-i" delay={delay} style={{ strokeWidth: w }} />
      {gas && (
        <motion.path
          d={d}
          variants={fadeV}
          custom={delay + 0.9}
          className={`f67-flow ${reverse ? 'f67-flow-rev' : ''}`}
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
      <path d={d} fill={pat(id, 'h')} className="f67-nohit" />
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
    <g className={`f67-bubbles ${className}`}>
      {Array.from({ length: n }, (_, i) => {
        const bx = x + ((i * 37) % 11) / 10 * spread - spread / 2
        const by = y - (i / n) * rise * 0.8
        return (
          <circle
            key={i}
            cx={bx}
            cy={by}
            r={r * (0.75 + ((i * 5) % 4) / 8)}
            className="f67-bubble"
            style={{ ['--rise' as string]: `${-rise * (1 - i / n)}px`, animationDelay: `${(-i * 0.47).toFixed(2)}s`, fill: color }}
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
      <circle cx={x} cy={y} r={r} className="f67-badge" />
      <text x={x} y={y + r * 0.42} textAnchor="middle" className="f67-badge-t" style={{ fontSize: r * 1.35 }}>
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
