/**
 * Shared drawing kit for the level 3–5 engraved figures (vsepr, lattices,
 * glassware, labels). Everything here is private to figures/l35.
 * See spec/illustration-guide.md for the visual language.
 */
import { createContext, useContext, useId, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { ease, spring } from '../../../ui/motion'
import { ChemText } from '../../../diagrams/util'
import './l35.css'

export { ChemText }

// ------------------------------------------------------------------ colours

/** CPK atom colours (subject colours, literal on purpose). */
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
  Ag: '#b9bec7',
}
export const cpk = (el: string) => CPK[el] ?? '#b3a58f'
const LIGHT_ATOMS = new Set(['H', 'F', 'S', 'Cl', 'Zn', 'Al', 'Si', 'Ag', 'X'])
/** Text colour that reads on a given atom fill. */
export const onAtom = (el: string) => (LIGHT_ATOMS.has(el) || !(el in CPK) ? '#1f2a44' : '#fffaf0')

// ------------------------------------------------------------------ motion

const VIEW = { once: true, amount: 0.25 } as const

/** Line draws itself in. `custom` = delay in s. */
export const vDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.9, delay: d, ease: ease.inOut }, opacity: { duration: 0.05, delay: d } },
  }),
}
/** Part pops in with a spring. `custom` = delay in s. */
export const vPop: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: (d: number = 0) => ({ opacity: 1, scale: 1, transition: { ...spring.bouncy, delay: d } }),
}
/** Fades in. `custom` = delay in s. */
export const vFade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: d, ease: ease.out } }),
}
/** Rises in from below. `custom` = delay in s. */
export const vRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: ease.out } }),
}

export const boxOrigin: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' }

/** motion.g that pops in (scale from its own centre). */
export function Pop({ d = 0, children, className, style }: { d?: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <motion.g variants={vPop} custom={d} className={className} style={{ ...boxOrigin, ...style }}>
      {children}
    </motion.g>
  )
}
export function Fade({ d = 0, children, className }: { d?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={vFade} custom={d} className={className}>
      {children}
    </motion.g>
  )
}
export function Rise({ d = 0, children, className }: { d?: number; children: ReactNode; className?: string }) {
  return (
    <motion.g variants={vRise} custom={d} className={className}>
      {children}
    </motion.g>
  )
}
/** A path that draws in. */
export function Draw({ d, delay = 0, className = 'f35-line', style }: { d: string; delay?: number; className?: string; style?: CSSProperties }) {
  return <motion.path d={d} className={className} variants={vDraw} custom={delay} style={style} />
}

// ------------------------------------------------------------------ figure frame

const PidCtx = createContext('f35')
/** Pattern id prefix of the current svg (unique per rendered svg). */
export const usePid = () => useContext(PidCtx)
export const pat = (p: string, k: string) => `url(#${p}-${k})`

export interface FigLayout {
  w: number
  h: number
  /** css max-width in px */
  max?: number
  /** 'wide' shows above the breakpoint, 'narrow' below, 'all' always */
  when?: 'wide' | 'narrow' | 'all'
  draw: () => ReactNode
}

/**
 * Root of every figure: a container-query wrapper with one or two svg layouts
 * (wide / narrow). Children animate in when the svg scrolls into view.
 */
export function Figure({
  label,
  level,
  layouts,
  replay = false,
  className = '',
}: {
  label: string
  level: 3 | 4 | 5
  layouts: FigLayout[]
  replay?: boolean
  className?: string
}) {
  const base = 'f35' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [run, setRun] = useState(0)
  return (
    <div className={`f35 f35-l${level} ${className}`}>
      {layouts.map((l, i) => {
        const p = `${base}-${i}`
        return (
          <PidCtx.Provider value={p} key={`${i}-${run}`}>
            <motion.svg
              className={`f35-svg f35-when-${l.when ?? 'all'}`}
              viewBox={`0 0 ${l.w} ${l.h}`}
              role="img"
              aria-label={label}
              style={{ maxWidth: `${l.max ?? 620}px` }}
              initial="hidden"
              whileInView="show"
              viewport={VIEW}
            >
              <Defs />
              {l.draw()}
            </motion.svg>
          </PidCtx.Provider>
        )
      })}
      {replay && (
        <button type="button" className="f35-replay" onClick={() => setRun((r) => r + 1)}>
          <span aria-hidden="true">↻</span> Přehrát znovu
        </button>
      )}
    </div>
  )
}

/** Engraving patterns: d diagonal, h horizontal (liquids), x cross (metal), s atom shade, dot (powder). */
function Defs() {
  const p = usePid()
  return (
    <defs>
      <pattern id={`${p}-d`} width={4.5} height={4.5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="f35-hl" x1={0} y1={0} x2={0} y2={4.5} />
      </pattern>
      <pattern id={`${p}-h`} width={8} height={4} patternUnits="userSpaceOnUse">
        <line className="f35-hl" x1={0} y1={2} x2={8} y2={2} />
      </pattern>
      <pattern id={`${p}-x`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line className="f35-hl" x1={0} y1={0} x2={0} y2={4} />
        <line className="f35-hl" x1={0} y1={0} x2={4} y2={0} />
      </pattern>
      <pattern id={`${p}-s`} width={2.6} height={2.6} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <line x1={0} y1={0} x2={0} y2={2.6} stroke="#10131c" strokeWidth={0.9} strokeOpacity={0.55} />
      </pattern>
      <pattern id={`${p}-sw`} width={2.6} height={2.6} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <line x1={0} y1={0} x2={0} y2={2.6} stroke="#10131c" strokeWidth={0.7} strokeOpacity={0.3} />
      </pattern>
    </defs>
  )
}

// ------------------------------------------------------------------ atoms & bonds

/** The crescent (lower-right) of a circle, used for the engraved shade. */
export function crescent(cx: number, cy: number, r: number, off = 0.34): string {
  const a = off * r
  const mx = cx - a / 2
  const my = cy - a / 2
  const d = a * Math.SQRT2
  const h = Math.sqrt(Math.max(0, r * r - (d / 2) * (d / 2)))
  const ux = Math.SQRT1_2
  const uy = -Math.SQRT1_2
  const p1x = mx + h * ux
  const p1y = my + h * uy
  const p2x = mx - h * ux
  const p2y = my - h * uy
  const f = (n: number) => n.toFixed(2)
  return `M${f(p1x)} ${f(p1y)} A${r} ${r} 0 1 1 ${f(p2x)} ${f(p2y)} A${r} ${r} 0 0 0 ${f(p1x)} ${f(p1y)}Z`
}

/** Engraved ball: CPK fill, ink outline, hatched crescent shade and a glint. */
export function Ball({
  x,
  y,
  r,
  fill,
  light = false,
  label,
  labelSize,
  labelColor,
  className,
}: {
  x: number
  y: number
  r: number
  fill: string
  light?: boolean
  label?: ReactNode
  labelSize?: number
  labelColor?: string
  className?: string
}) {
  const p = usePid()
  return (
    <g className={className}>
      <circle cx={x} cy={y} r={r} fill={fill} className="f35-atom" />
      <path d={crescent(x, y, r)} fill={pat(p, light ? 'sw' : 's')} />
      {r > 6 && (
        <path
          d={`M${x - r * 0.62} ${y - r * 0.12} A${r * 0.64} ${r * 0.64} 0 0 1 ${x - r * 0.1} ${y - r * 0.63}`}
          className="f35-glint"
          style={{ strokeWidth: Math.min(2.2, Math.max(1, r * 0.12)) }}
        />
      )}
      <circle cx={x} cy={y} r={r} className="f35-atom-edge" />
      {label !== undefined && (
        <text
          x={x}
          y={y + (labelSize ?? r * 0.9) * 0.35}
          textAnchor="middle"
          className="f35-sym"
          style={{ fontSize: labelSize ?? r * 0.9, fill: labelColor }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

/** A CPK atom (element symbol inside when `sym`). */
export function Atom({ x, y, r, el, sym = true, charge, className }: { x: number; y: number; r: number; el: string; sym?: boolean; charge?: string; className?: string }) {
  const light = LIGHT_ATOMS.has(el)
  return (
    <Ball
      x={x}
      y={y}
      r={r}
      fill={cpk(el)}
      light={light}
      className={className}
      label={sym ? (charge ? <ChemText text={`${el}^{${charge}}`} /> : el) : undefined}
      labelSize={r * (el.length > 1 ? 0.8 : 0.95) * (charge ? 0.85 : 1)}
      labelColor={onAtom(el)}
    />
  )
}

export type BondKind = 'single' | 'double' | 'triple' | 'wedge' | 'dash'

/**
 * Bond between two atom centres, trimmed to the atom radii.
 * wedge = toward the viewer, dash = away from the viewer.
 */
export function Bond({
  a,
  b,
  ra = 0,
  rb = 0,
  kind = 'single',
  w = 5,
}: {
  a: [number, number]
  b: [number, number]
  ra?: number
  rb?: number
  kind?: BondKind
  w?: number
}) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  const nx = -uy
  const ny = ux
  const x1 = a[0] + ux * ra * 0.8
  const y1 = a[1] + uy * ra * 0.8
  const x2 = b[0] - ux * rb * 0.8
  const y2 = b[1] - uy * rb * 0.8
  const f = (n: number) => n.toFixed(2)
  if (kind === 'wedge') {
    const W = w * 1.5
    return (
      <polygon
        className="f35-wedge"
        points={`${f(x1)},${f(y1)} ${f(x2 + nx * W)},${f(y2 + ny * W)} ${f(x2 - nx * W)},${f(y2 - ny * W)}`}
      />
    )
  }
  if (kind === 'dash') {
    const n = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 4.2))
    const lines = []
    for (let i = 1; i <= n; i++) {
      const t = i / n
      const px = x1 + (x2 - x1) * t
      const py = y1 + (y2 - y1) * t
      const W = 0.8 + t * w * 1.3
      lines.push(<line key={i} x1={px + nx * W} y1={py + ny * W} x2={px - nx * W} y2={py - ny * W} />)
    }
    return <g className="f35-dash">{lines}</g>
  }
  const offs = kind === 'double' ? [-w * 0.75, w * 0.75] : kind === 'triple' ? [-w * 1.3, 0, w * 1.3] : [0]
  const sw = kind === 'single' ? w : w * 0.72
  return (
    <g>
      {offs.map((o, i) => (
        <g key={i}>
          <line className="f35-stick-o" x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} style={{ strokeWidth: sw + 2.4 }} />
          <line className="f35-stick" x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} style={{ strokeWidth: sw }} />
        </g>
      ))}
    </g>
  )
}

/** Lone electron pair as an engraved lobe pointing along `ang` (degrees, screen). */
export function LonePair({ x, y, ang, len = 26, back = false }: { x: number; y: number; ang: number; len?: number; back?: boolean }) {
  const p = usePid()
  const a = (ang * Math.PI) / 180
  const ux = Math.cos(a)
  const uy = Math.sin(a)
  const nx = -uy
  const ny = ux
  const w = len * 0.36
  const tx = x + ux * len
  const ty = y + uy * len
  const c1x = x + ux * len * 0.55 + nx * w
  const c1y = y + uy * len * 0.55 + ny * w
  const c2x = x + ux * len * 0.55 - nx * w
  const c2y = y + uy * len * 0.55 - ny * w
  const d = `M${x} ${y} C${c1x} ${c1y} ${tx + nx * w * 0.9} ${ty + ny * w * 0.9} ${tx} ${ty} C${tx - nx * w * 0.9} ${ty - ny * w * 0.9} ${c2x} ${c2y} ${x} ${y}Z`
  const ex = x + ux * len * 0.62
  const ey = y + uy * len * 0.62
  return (
    <g className={back ? 'f35-lp f35-lp-back' : 'f35-lp'}>
      <path d={d} className="f35-lp-fill" />
      <path d={d} fill={pat(p, 'd')} />
      <path d={d} className="f35-lp-edge" />
      <circle cx={ex + nx * 3} cy={ey + ny * 3} r={1.7} className="f35-e" />
      <circle cx={ex - nx * 3} cy={ey - ny * 3} r={1.7} className="f35-e" />
    </g>
  )
}

/** Angle arc at (x,y) from angle a1 to a2 (degrees, screen, clockwise). */
export function AngleArc({ x, y, r, a1, a2, delay = 0 }: { x: number; y: number; r: number; a1: number; a2: number; delay?: number }) {
  const rad = (d: number) => (d * Math.PI) / 180
  const sx = x + r * Math.cos(rad(a1))
  const sy = y + r * Math.sin(rad(a1))
  const ex = x + r * Math.cos(rad(a2))
  const ey = y + r * Math.sin(rad(a2))
  let span = a2 - a1
  while (span < 0) span += 360
  const large = span > 180 ? 1 : 0
  return <Draw d={`M${sx.toFixed(2)} ${sy.toFixed(2)} A${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`} className="f35-arc" delay={delay} />
}

// ------------------------------------------------------------------ labels

/**
 * Italic plate label with an optional leader line to (tx, ty).
 * (x, y) is the text baseline anchor.
 */
export function Note({
  x,
  y,
  tx,
  ty,
  anchor = 'start',
  children,
  className = '',
  size,
}: {
  x: number
  y: number
  tx?: number
  ty?: number
  anchor?: 'start' | 'middle' | 'end'
  children: ReactNode
  className?: string
  size?: number
}) {
  let lead: ReactNode = null
  if (tx !== undefined && ty !== undefined) {
    const fs = size ?? 16
    const len = typeof children === 'string' ? children.length : 10
    const w = len * fs * 0.42
    const xl = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
    const xr = xl + w
    const top = y - fs * 0.78
    let lx: number
    let ly: number
    if (ty < top - 2) {
      // target above: leave from the top edge
      lx = Math.min(Math.max(tx, xl + 6), xr - 6)
      ly = top
    } else if (ty > y + 3) {
      lx = Math.min(Math.max(tx, xl + 6), xr - 6)
      ly = y + 5
    } else {
      lx = tx < xl ? xl - 4 : xr + 4
      ly = y - fs * 0.32
    }
    lead = (
      <>
        <line className="f35-leader" x1={lx} y1={ly} x2={tx} y2={ty} />
        <circle className="f35-leader-dot" cx={tx} cy={ty} r={1.9} />
      </>
    )
  }
  return (
    <g className={className}>
      {lead}
      <text className="f35-note" x={x} y={y} textAnchor={anchor} style={size ? { fontSize: size } : undefined}>
        {children}
      </text>
    </g>
  )
}

/** Plain text helper. */
export function T({
  x,
  y,
  children,
  anchor = 'middle',
  className = 'f35-t',
  size,
  style,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  className?: string
  size?: number
  style?: CSSProperties
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={className} style={size ? { fontSize: size, ...style } : style}>
      {children}
    </text>
  )
}

/** Straight arrow with a filled head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  head = 8,
  className = 'f35-arrow',
  both = false,
  delay,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  head?: number
  className?: string
  both?: boolean
  delay?: number
}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const tip = (x: number, y: number, ang: number) => {
    const w = head * 0.5
    const bx = x - Math.cos(ang) * head
    const by = y - Math.sin(ang) * head
    return `${x.toFixed(2)},${y.toFixed(2)} ${(bx + Math.sin(ang) * w).toFixed(2)},${(by - Math.cos(ang) * w).toFixed(2)} ${(bx - Math.sin(ang) * w).toFixed(2)},${(by + Math.cos(ang) * w).toFixed(2)}`
  }
  const s = head * 0.7
  const sx = both ? x1 + Math.cos(a) * s : x1
  const sy = both ? y1 + Math.sin(a) * s : y1
  const d = `M${sx.toFixed(2)} ${sy.toFixed(2)} L${(x2 - Math.cos(a) * s).toFixed(2)} ${(y2 - Math.sin(a) * s).toFixed(2)}`
  const inner = (
    <>
      {delay === undefined ? <path d={d} /> : <motion.path d={d} variants={vDraw} custom={delay} />}
      <polygon points={tip(x2, y2, a)} />
      {both && <polygon points={tip(x1, y1, a + Math.PI)} />}
    </>
  )
  return delay === undefined ? (
    <g className={className}>{inner}</g>
  ) : (
    <motion.g className={className} variants={vFade} custom={delay}>
      {inner}
    </motion.g>
  )
}

/** Curved arrow along a quadratic path from (x1,y1) via control (cx,cy) to (x2,y2). */
export function CurveArrow({
  x1,
  y1,
  cx,
  cy,
  x2,
  y2,
  head = 8,
  className = 'f35-arrow',
  delay = 0,
}: {
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  head?: number
  className?: string
  delay?: number
}) {
  const a = Math.atan2(y2 - cy, x2 - cx)
  const w = head * 0.5
  const bx = x2 - Math.cos(a) * head
  const by = y2 - Math.sin(a) * head
  const pts = `${x2},${y2} ${bx + Math.sin(a) * w},${by - Math.cos(a) * w} ${bx - Math.sin(a) * w},${by + Math.cos(a) * w}`
  const ex = x2 - Math.cos(a) * head * 0.7
  const ey = y2 - Math.sin(a) * head * 0.7
  return (
    <g className={className}>
      <motion.path d={`M${x1} ${y1} Q${cx} ${cy} ${ex} ${ey}`} variants={vDraw} custom={delay} />
      <motion.polygon points={pts} variants={vFade} custom={delay + 0.7} />
    </g>
  )
}

// ------------------------------------------------------------------ glassware

/** Hatched liquid fill inside a clip path. */
function Liquid({ clip, x, y, w, h, color, opacity = 0.45, rise = false, delay = 0 }: { clip: string; x: number; y: number; w: number; h: number; color: string; opacity?: number; rise?: boolean; delay?: number }) {
  const p = usePid()
  const body = (
    <>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={opacity} />
      <rect x={x} y={y} width={w} height={h} fill={pat(p, 'h')} />
      <line x1={x} x2={x + w} y1={y} y2={y} className="f35-surface" />
    </>
  )
  return (
    <g clipPath={`url(#${clip})`}>
      {rise ? (
        <motion.g
          variants={{
            hidden: { y: h },
            show: { y: 0, transition: { duration: 1.1, delay, ease: ease.out } },
          }}
        >
          {body}
        </motion.g>
      ) : (
        body
      )}
    </g>
  )
}

/** Glass reflection strip. */
function Glint({ d }: { d: string }) {
  return <path d={d} className="f35-glass-glint" />
}

/**
 * Beaker with bottom-left corner at (x, y+h). `level` = liquid height from the bottom.
 * Children render clipped inside the liquid (particles etc.).
 */
export function Beaker({
  x,
  y,
  w,
  h,
  level,
  color = 'var(--info-soft)',
  opacity,
  children,
  graduations = true,
  rise,
  delay,
}: {
  x: number
  y: number
  w: number
  h: number
  level: number
  color?: string
  opacity?: number
  children?: ReactNode
  graduations?: boolean
  rise?: boolean
  delay?: number
}) {
  const p = usePid()
  const clip = `${p}-bk${Math.round(x)}-${Math.round(y)}`
  const r = 7
  const body = `M${x} ${y} V${y + h - r} Q${x} ${y + h} ${x + r} ${y + h} H${x + w - r} Q${x + w} ${y + h} ${x + w} ${y + h - r} V${y}`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${body} Z`} />
        </clipPath>
      </defs>
      <path d={`${body} Z`} className="f35-glass" />
      <Liquid clip={clip} x={x} y={y + h - level} w={w} h={level} color={color} opacity={opacity} rise={rise} delay={delay} />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <Glint d={`M${x + 6} ${y + 10} V${y + h - 12}`} />
      {graduations &&
        [0.25, 0.45, 0.65].map((t, i) => (
          <line key={i} className="f35-grad" x1={x + w - 16} x2={x + w - 6} y1={y + h * t + 6} y2={y + h * t + 6} />
        ))}
      <path d={`M${x - 5} ${y - 4} Q${x - 1} ${y - 3} ${x} ${y + 2} ${body.slice(body.indexOf('V'))} Q${x + w + 1} ${y - 3} ${x + w + 4} ${y - 4}`} className="f35-glass-edge" />
    </g>
  )
}

/** Erlenmeyer flask: neck top centre at (cx, y), total height h, base width w. */
export function Erlenmeyer({
  cx,
  y,
  w,
  h,
  neckW = 20,
  neckH,
  level,
  color = 'var(--info-soft)',
  opacity,
  children,
  rim = true,
}: {
  cx: number
  y: number
  w: number
  h: number
  neckW?: number
  neckH?: number
  level: number
  color?: string
  opacity?: number
  children?: ReactNode
  rim?: boolean
}) {
  const p = usePid()
  const clip = `${p}-er${Math.round(cx)}-${Math.round(y)}`
  const nh = neckH ?? h * 0.3
  const b = y + h
  const hw = w / 2
  const nw = neckW / 2
  const d = `M${cx - nw} ${y} V${y + nh} L${cx - hw + 5} ${b - 7} Q${cx - hw} ${b} ${cx - hw + 8} ${b} H${cx + hw - 8} Q${cx + hw} ${b} ${cx + hw - 5} ${b - 7} L${cx + nw} ${y + nh} V${y}`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d} Z`} />
        </clipPath>
      </defs>
      <path d={`${d} Z`} className="f35-glass" />
      <Liquid clip={clip} x={cx - hw} y={b - level} w={w} h={level} color={color} opacity={opacity} />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <Glint d={`M${cx - nw - 4} ${y + nh + 10} L${cx - hw + 12} ${b - 12}`} />
      <path d={d} className="f35-glass-edge" />
      {rim && <rect x={cx - nw - 3} y={y - 3} width={neckW + 6} height={5} rx={2} className="f35-glass-rim" />}
    </g>
  )
}

/** Test tube: top centre (cx, y), width w, length h. */
export function TestTube({
  cx,
  y,
  w,
  h,
  level,
  color = 'var(--info-soft)',
  opacity,
  children,
  rise,
  delay,
}: {
  cx: number
  y: number
  w: number
  h: number
  level: number
  color?: string
  opacity?: number
  children?: ReactNode
  rise?: boolean
  delay?: number
}) {
  const p = usePid()
  const clip = `${p}-tt${Math.round(cx)}-${Math.round(y)}`
  const r = w / 2
  const d = `M${cx - r} ${y} V${y + h - r} A${r} ${r} 0 0 0 ${cx + r} ${y + h - r} V${y}`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d} Z`} />
        </clipPath>
      </defs>
      <path d={`${d} Z`} className="f35-glass" />
      <Liquid clip={clip} x={cx - r} y={y + h - level} w={w} h={level} color={color} opacity={opacity} rise={rise} delay={delay} />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <Glint d={`M${cx - r + 3.5} ${y + 8} V${y + h - r - 4}`} />
      <path d={d} className="f35-glass-edge" />
      <path d={`M${cx - r - 3} ${y - 1} H${cx + r + 3}`} className="f35-glass-edge" />
    </g>
  )
}

/** Rising bubbles (CSS loop) inside a region. */
export function Bubbles({ xs, y, h, r = 2.4, className = '' }: { xs: number[]; y: number; h: number; r?: number; className?: string }) {
  return (
    <g className={`f35-bubbles ${className}`}>
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r * (0.7 + ((i * 37) % 10) / 16)}
          className="f35-bubble"
          style={{ animationDelay: `${((i * 0.53) % 2.1).toFixed(2)}s`, ['--rise' as string]: `${-h}px` }}
        />
      ))}
    </g>
  )
}
