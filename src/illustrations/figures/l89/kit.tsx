/**
 * Shared drawing kit for the level 8–9 engraved figures.
 * Engraving line art, hatching instead of gradients, CPK atoms, italic
 * leader-line labels and a small set of scroll-triggered motion primitives.
 * Everything animates to a complete, readable final state.
 * Steps of a process go in a <StepFilm>, compared variants in a <StepStrip>
 * (src/illustrations/sequence/StepFigure); a single picture animates in ≤ ~2.5 s.
 */
import {
  createContext,
  Fragment,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion, useInView } from 'motion/react'
import { ease, spring } from '../../../ui/motion'
import { ChemText } from '../../../diagrams/util'
import { ReplayButton } from '../../sequence/StepFigure'
import './l89.css'

export { ChemText }

/** Level colours (course outline): level 8 plum, level 9 rose. */
export const LEVEL_COLOR = { 8: '#7a5290', 9: '#a84d6c' } as const

// ------------------------------------------------------------------ context

const OnCtx = createContext(true)
const NarrowCtx = createContext(false)
const HatchCtx = createContext('f89')

/** True once the figure has scrolled into view (drives every entrance). */
export const useOn = () => useContext(OnCtx)
/** True when the figure is rendered in a narrow column (< 460 px). */
export const useNarrow = () => useContext(NarrowCtx)
/** url() of one of the engraving hatch patterns of the current <Plate>. */
export function useHatch() {
  const id = useContext(HatchCtx)
  return (k: HatchKind) => `url(#${id}-${k})`
}

type HatchKind = 'd' | 'dd' | 'x' | 'h' | 's' | 'lv' | 'w'

const NARROW = 460

/**
 * Root of every figure: one `role="img"` region with a Czech description,
 * scroll-into-view trigger, narrow-layout detection and an optional
 * shared "Přehrát znovu" button for a single-picture animation.
 */
export function Figure({
  name,
  label,
  level,
  max = 640,
  replay = false,
  interactive = false,
  children,
}: {
  name: string
  label: string
  level: 8 | 9
  max?: number
  replay?: boolean
  /** hosts a <StepFilm> (which has buttons and carries role="img" itself) */
  interactive?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { once: true, amount: 0.2 })
  const [run, setRun] = useState(0)
  const [narrow, setNarrow] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = (w: number) => setNarrow(w > 0 && w < NARROW)
    measure(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => measure(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const style = { '--lv': LEVEL_COLOR[level], '--f89-max': `${max}px` } as CSSProperties
  return (
    <div ref={ref} className={`f89 f89-${name}${narrow ? ' f89-narrow' : ''}`} style={style} data-figure={name}>
      <div className="f89-art" {...(interactive ? {} : { role: 'img', 'aria-label': label })}>
        <OnCtx.Provider value={on}>
          <NarrowCtx.Provider value={narrow}>
            <Fragment key={run}>{children}</Fragment>
          </NarrowCtx.Provider>
        </OnCtx.Provider>
      </div>
      {replay && <ReplayButton onClick={() => setRun((r) => r + 1)} />}
    </div>
  )
}

/** One engraved SVG plate with its own hatch patterns. */
export function Plate({ w, h, className = '', children, style }: { w: number; h: number; className?: string; children: ReactNode; style?: CSSProperties }) {
  const id = 'f89' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <HatchCtx.Provider value={id}>
      <svg className={`f89-svg ${className}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false" style={style}>
        <defs>
          <pattern id={`${id}-d`} width={4.5} height={4.5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className="f89-hl" x1={0} y1={0} x2={0} y2={4.5} />
          </pattern>
          <pattern id={`${id}-dd`} width={3} height={3} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className="f89-hl" x1={0} y1={0} x2={0} y2={3} />
          </pattern>
          <pattern id={`${id}-x`} width={4.5} height={4.5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className="f89-hl" x1={0} y1={0} x2={0} y2={4.5} />
            <line className="f89-hl" x1={0} y1={0} x2={4.5} y2={0} />
          </pattern>
          <pattern id={`${id}-h`} width={10} height={5} patternUnits="userSpaceOnUse">
            <line className="f89-hl" x1={0} y1={2.5} x2={10} y2={2.5} />
          </pattern>
          {/* shading on coloured objects: darkens in both themes */}
          <pattern id={`${id}-s`} width={3.2} height={3.2} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line className="f89-hs" x1={0} y1={0} x2={0} y2={3.2} />
          </pattern>
          <pattern id={`${id}-lv`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className="f89-hlv" x1={0} y1={0} x2={0} y2={5} />
          </pattern>
          <pattern id={`${id}-w`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line className="f89-hw" x1={0} y1={0} x2={0} y2={6} />
          </pattern>
        </defs>
        {children}
      </svg>
    </HatchCtx.Provider>
  )
}

// ------------------------------------------------------------------ motion

/** A path that draws itself in. */
export function Draw({
  d,
  className = 'f89-ln',
  delay = 0,
  dur = 1,
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
  const on = useOn()
  return (
    <motion.path
      d={d}
      className={className}
      style={style}
      fill={fill}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ pathLength: { duration: dur, delay, ease: ease.inOut }, opacity: { duration: 0.15, delay } }}
    />
  )
}

/** Group that pops in with a spring. */
export function Pop({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const on = useOn()
  return (
    <motion.g
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.55 }}
      animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.55 }}
      transition={{ ...spring.bouncy, delay, opacity: { duration: 0.2, delay } }}
    >
      {children}
    </motion.g>
  )
}

/** Group that fades in. */
export function Fade({ children, delay = 0, dur = 0.5, className }: { children: ReactNode; delay?: number; dur?: number; className?: string }) {
  const on = useOn()
  return (
    <motion.g
      className={className}
      initial={{ opacity: 0 }}
      animate={on ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: dur, delay, ease: ease.out }}
    >
      {children}
    </motion.g>
  )
}

/** Group that slides in from an offset (dx, dy) to its place. */
export function Slide({
  children,
  delay = 0,
  dx = 0,
  dy = 0,
  dur = 0.7,
  className,
}: {
  children: ReactNode
  delay?: number
  dx?: number
  dy?: number
  dur?: number
  className?: string
}) {
  const on = useOn()
  return (
    <motion.g
      className={className}
      initial={{ opacity: 0, x: dx, y: dy }}
      animate={on ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: dx, y: dy }}
      transition={{ duration: dur, delay, ease: ease.out }}
    >
      {children}
    </motion.g>
  )
}

/** Group that grows from a transform origin (bars, fills). */
export function Grow({
  children,
  delay = 0,
  dur = 0.8,
  axis = 'x',
  origin = '0% 50%',
}: {
  children: ReactNode
  delay?: number
  dur?: number
  axis?: 'x' | 'y'
  origin?: string
}) {
  const on = useOn()
  const k = axis === 'x' ? 'scaleX' : 'scaleY'
  return (
    <motion.g
      style={{ transformOrigin: origin }}
      initial={{ [k]: 0 }}
      animate={on ? { [k]: 1 } : { [k]: 0 }}
      transition={{ duration: dur, delay, ease: ease.out }}
    >
      {children}
    </motion.g>
  )
}

// ------------------------------------------------------------------ labels & arrows

/** Italic engraved label with an optional thin leader line to (tx, ty). */
export function Lbl({
  x,
  y,
  tx,
  ty,
  children,
  anchor = 'start',
  className = '',
  size,
  sec = false,
}: {
  x: number
  y: number
  tx?: number
  ty?: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  className?: string
  size?: number
  sec?: boolean
}) {
  let lead: ReactNode = null
  if (tx !== undefined && ty !== undefined) {
    const lx = anchor === 'start' ? x - 4 : anchor === 'end' ? x + 4 : x
    const ly = anchor === 'middle' ? (ty < y ? y - (size ?? 16) : y + 5) : y - (size ?? 16) * 0.32
    lead = (
      <>
        <line className="f89-lead" x1={lx} y1={ly} x2={tx} y2={ty} />
        <circle className="f89-dot" cx={tx} cy={ty} r={2} />
      </>
    )
  }
  return (
    <g className={`${sec ? 'f89-sec' : ''}`}>
      {lead}
      <text className={`f89-lb ${className}`} x={x} y={y} textAnchor={anchor} style={size ? { fontSize: size } : undefined}>
        {children}
      </text>
    </g>
  )
}

/** Straight arrow with a filled head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  className = 'f89-arr',
  head = 8,
  both = false,
  dashed = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  className?: string
  head?: number
  both?: boolean
  dashed?: boolean
}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const tip = (x: number, y: number, ang: number) => {
    const w = head * 0.5
    const bx = x - Math.cos(ang) * head
    const by = y - Math.sin(ang) * head
    return `${x},${y} ${bx + Math.sin(ang) * w},${by - Math.cos(ang) * w} ${bx - Math.sin(ang) * w},${by + Math.cos(ang) * w}`
  }
  const s = head * 0.7
  return (
    <g className={className}>
      <line
        x1={both ? x1 + Math.cos(a) * s : x1}
        y1={both ? y1 + Math.sin(a) * s : y1}
        x2={x2 - Math.cos(a) * s}
        y2={y2 - Math.sin(a) * s}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <polygon points={tip(x2, y2, a)} />
      {both && <polygon points={tip(x1, y1, a + Math.PI)} />}
    </g>
  )
}

/** Arrowhead polygon at the end of a cubic curve (direction from control point c to end p). */
export function headAt(px: number, py: number, cx: number, cy: number, size = 8, half = false) {
  const a = Math.atan2(py - cy, px - cx)
  const bx = px - Math.cos(a) * size
  const by = py - Math.sin(a) * size
  const w = size * 0.5
  const p1 = `${bx + Math.sin(a) * w},${by - Math.cos(a) * w}`
  const p2 = `${bx - Math.sin(a) * w},${by + Math.cos(a) * w}`
  return half ? `${px},${py} ${p1} ${bx},${by}` : `${px},${py} ${p1} ${p2}`
}

/**
 * Curly (electron-pushing) arrow drawn in with an arrowhead that appears at the end.
 * `fish` = single-headed "fishhook" arrow for one electron (radicals).
 */
export function Curly({
  from,
  to,
  bend = 30,
  delay = 0,
  dur = 0.8,
  fish = false,
  className = 'f89-curly',
  side = 1,
}: {
  from: [number, number]
  to: [number, number]
  bend?: number
  delay?: number
  dur?: number
  fish?: boolean
  className?: string
  side?: 1 | -1
}) {
  const [x1, y1] = from
  const [x2, y2] = to
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const nx = (-(y2 - y1) / len) * bend * side
  const ny = ((x2 - x1) / len) * bend * side
  const c1x = x1 + (mx - x1) * 0.2 + nx
  const c1y = y1 + (my - y1) * 0.2 + ny
  const c2x = x2 - (x2 - mx) * 0.2 + nx
  const c2y = y2 - (y2 - my) * 0.2 + ny
  const d = `M${x1} ${y1} C${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`
  return (
    <g className={className}>
      <Draw d={d} className="f89-curly-l" delay={delay} dur={dur} />
      <Fade delay={delay + dur * 0.85} dur={0.2}>
        <polygon className="f89-curly-h" points={headAt(x2, y2, c2x, c2y, 9, fish)} />
      </Fade>
    </g>
  )
}

// ------------------------------------------------------------------ atoms

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
  Na: '#8a63c9',
  K: '#7a4fb3',
  Ca: '#6b8c7a',
  Mg: '#5c9a6b',
  Fe: '#b86a3c',
}
const LIGHT_ATOMS = new Set(['H', 'S', 'F', 'P'])

/** Crescent (lower-right) used for the engraved shading of a sphere of radius r at the origin. */
function crescent(r: number) {
  const th = Math.acos(0.25)
  const a1 = Math.PI / 4 - th
  const a2 = Math.PI / 4 + th
  const A = [r * Math.cos(a1), r * Math.sin(a1)]
  const B = [r * Math.cos(a2), r * Math.sin(a2)]
  return `M${A[0].toFixed(2)} ${A[1].toFixed(2)} A${r} ${r} 0 0 1 ${B[0].toFixed(2)} ${B[1].toFixed(2)} A${r} ${r} 0 0 0 ${A[0].toFixed(2)} ${A[1].toFixed(2)}Z`
}

/** CPK atom with an engraved crescent hatch and a small highlight. */
export function Atom({
  x,
  y,
  el,
  r = 9,
  label,
  fill,
  className = '',
  style,
}: {
  x: number
  y: number
  el: string
  r?: number
  label?: string | false
  fill?: string
  className?: string
  style?: CSSProperties
}) {
  const hatch = useHatch()
  const f = fill ?? CPK[el] ?? '#b3a58f'
  const text = label === false ? null : (label ?? (r >= 7.5 ? el : null))
  const light = LIGHT_ATOMS.has(el) && !fill
  return (
    <g className={`f89-atom ${className}`} transform={`translate(${x} ${y})`} style={style}>
      <circle r={r} fill={f} className="f89-atom-c" />
      <path d={crescent(r)} fill={hatch('s')} className="f89-atom-s" />
      <path d={`M${-r * 0.62} ${-r * 0.15} A${r * 0.66} ${r * 0.66} 0 0 1 ${-r * 0.1} ${-r * 0.62}`} className="f89-atom-hi" />
      <circle r={r} className="f89-atom-o" />
      {text && (
        <text className={`f89-atom-t ${light ? 'f89-atom-t-dark' : ''}`} y={r * 0.36} style={{ fontSize: Math.max(8, r * (text.length > 1 ? 0.9 : 1.05)) }}>
          {text}
        </text>
      )}
    </g>
  )
}

/** A bond between two atom centres (drawn under atoms). order 2 → two parallel lines. */
export function Bond({ x1, y1, x2, y2, order = 1, className = 'f89-bond', gap = 3.2 }: { x1: number; y1: number; x2: number; y2: number; order?: number; className?: string; gap?: number }) {
  if (order === 1) return <line className={className} x1={x1} y1={y1} x2={x2} y2={y2} />
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const nx = (-(y2 - y1) / len) * gap
  const ny = ((x2 - x1) / len) * gap
  const offs = order === 2 ? [-1, 1] : [-1.6, 0, 1.6]
  return (
    <g>
      {offs.map((k) => (
        <line key={k} className={className} x1={x1 + nx * k} y1={y1 + ny * k} x2={x2 + nx * k} y2={y2 + ny * k} />
      ))}
    </g>
  )
}

export type MolAtom = [el: string, x: number, y: number, opts?: { h?: number[]; r?: number; label?: string | false; id?: string }]
export type MolBond = [i: number, j: number, order?: number]

const VALENCE: Record<string, number> = { C: 4, N: 3, O: 2, S: 2 }

/**
 * 2D ball-and-stick molecule. Hydrogens on C/N/O are added automatically
 * (or at the angles given in `opts.h`, degrees, 0 = right, 90 = down).
 * Returns bonds first, then atoms, so atoms sit on top.
 */
export function Mol({
  atoms,
  bonds,
  autoH = true,
  hLen = 17,
  rH = 5.2,
  rHeavy = 8.5,
  highlight,
  className,
}: {
  atoms: MolAtom[]
  bonds: MolBond[]
  autoH?: boolean
  hLen?: number
  rH?: number
  rHeavy?: number
  highlight?: (atomIndex: number | string) => string | undefined
  className?: string
}) {
  const hs: { x: number; y: number; from: number; k: string }[] = []
  if (autoH) {
    atoms.forEach(([el, x, y, o], i) => {
      const val = VALENCE[el]
      if (!val && !o?.h) return
      const nb = bonds.filter((b) => b[0] === i || b[1] === i)
      const used = nb.reduce((s, b) => s + (b[2] ?? 1), 0)
      const need = Math.max(0, (val ?? 0) - used)
      const angs = nb.map((b) => {
        const j = b[0] === i ? b[1] : b[0]
        return Math.atan2(atoms[j][2] - y, atoms[j][1] - x)
      })
      let out: number[] = []
      if (o?.h) out = o.h.map((d) => (d * Math.PI) / 180)
      else if (need > 0) out = placeH(angs, need)
      out.forEach((a, k) => hs.push({ x: x + Math.cos(a) * hLen, y: y + Math.sin(a) * hLen, from: i, k: `${i}-${k}` }))
    })
  }
  return (
    <g className={className}>
      {bonds.map(([i, j, ord], k) => (
        <Bond key={`b${k}`} x1={atoms[i][1]} y1={atoms[i][2]} x2={atoms[j][1]} y2={atoms[j][2]} order={ord ?? 1} />
      ))}
      {hs.map((h) => (
        <line key={`hb${h.k}`} className="f89-bond" x1={atoms[h.from][1]} y1={atoms[h.from][2]} x2={h.x} y2={h.y} />
      ))}
      {hs.map((h) => (
        <Atom key={`h${h.k}`} x={h.x} y={h.y} el="H" r={rH} className={highlight?.(`H${h.k}`) ?? ''} />
      ))}
      {atoms.map(([el, x, y, o], i) => (
        <Atom key={`a${i}`} x={x} y={y} el={el} r={o?.r ?? (el === 'H' ? rH : el === 'Cl' || el === 'Br' ? rHeavy + 1.5 : rHeavy)} label={o?.label} className={highlight?.(i) ?? ''} />
      ))}
    </g>
  )
}

/** Directions (radians) for n hydrogens around existing bond directions. */
export function placeH(existing: number[], n: number): number[] {
  const TAU = Math.PI * 2
  const norm = (a: number) => ((a % TAU) + TAU) % TAU
  if (existing.length === 0) return [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].slice(0, n)
  if (existing.length === 2 && n === 2) {
    const [a, b] = existing
    const bis = Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b)) + Math.PI
    return [bis - 0.62, bis + 0.62]
  }
  if (existing.length === 1 && n === 1) return [existing[0] + (Math.PI * 2) / 3]
  if (existing.length === 1 && n === 2) return [existing[0] + (Math.PI * 2) / 3, existing[0] - (Math.PI * 2) / 3]
  const out: number[] = []
  for (let k = 0; k < n; k++) {
    let best = 0
    let bestScore = -1
    for (let s = 0; s < 72; s++) {
      const c = (s / 72) * TAU
      const score = Math.min(
        ...[...existing, ...out].map((e) => {
          const d = Math.abs(norm(c) - norm(e))
          return Math.min(d, TAU - d)
        }),
      )
      if (score > bestScore + 1e-6) {
        bestScore = score
        best = c
      }
    }
    out.push(best)
  }
  return out
}

/** Short formula text (supports ChemText ^{} and _{} markup). */
export function F({ x, y, t, className = 'f89-f', anchor = 'middle', size }: { x: number; y: number; t: string; className?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return (
    <text className={className} x={x} y={y} textAnchor={anchor} style={size ? { fontSize: size } : undefined}>
      <ChemText text={t} />
    </text>
  )
}

/** Deterministic pseudo-random numbers (for tangles, scattered particles). */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smooth(pts: [number, number][], closed = false, t = 0.5): string {
  if (pts.length < 2) return ''
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]]
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1]
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    const [x3, y3] = p[i + 2]
    const c1x = x1 + ((x2 - x0) / 6) * t * 2
    const c1y = y1 + ((y2 - y0) / 6) * t * 2
    const c2x = x2 - ((x3 - x1) / 6) * t * 2
    const c2y = y2 - ((y3 - y1) / 6) * t * 2
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
  }
  return closed ? d + 'Z' : d
}
