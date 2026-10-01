import type { CSSProperties, ReactNode } from 'react'

/**
 * Drawing kit for the physics level vignettes. Mirrors the helpers of the
 * chemistry scenes in ../LevelVignette.tsx (same plate, strokes and hatching),
 * copied here so the two sets stay independent.
 */

export const INK = 'var(--edge)'
export const GLASS = 'color-mix(in srgb, var(--surface) 82%, transparent)'
export const PAPER = '#fffaf0'
/** literal spectrum colours (subject colours, like CPK in chemistry) */
export const SPECTRUM = ['#d9493b', '#e88b35', '#e0b43a', '#4fae5a', '#3d6fd1', '#7a4fb3']

export interface Ctx {
  L: string
  /** ink hatch */
  hi: string
  /** level-colour hatch */
  hl: string
  /** dense ink hatch */
  hx: string
}

export const detail = { strokeWidth: 1.2 }

/** level colour darkened towards the ink, for small italic labels */
export const labelFill = (c: Ctx) => `color-mix(in srgb, ${c.L} 65%, var(--ink))`
export const labelFont = (px = 15): CSSProperties => ({ font: `italic 700 ${px}px var(--font-display)` })

export function Ground({ c, y = 172, rx = 72, cx = 100 }: { c: Ctx; y?: number; rx?: number; cx?: number }) {
  return <ellipse cx={cx} cy={y} rx={rx} ry="6.5" fill={c.hi} stroke="none" />
}

/** A ball with the engraved crescent highlight. */
export function Ball({ x, y, r, fill, cls, style, sw }: { x: number; y: number; r: number; fill: string; cls?: string; style?: CSSProperties; sw?: number }) {
  return (
    <g className={cls} style={style}>
      <circle cx={x} cy={y} r={r} fill={fill} strokeWidth={sw} />
      <path
        d={`M${x - r * 0.62} ${y - r * 0.05}a${r * 0.66} ${r * 0.66} 0 0 1 ${r * 0.58}-${r * 0.56}`}
        stroke={PAPER}
        strokeOpacity="0.8"
        strokeWidth={Math.max(1, r * 0.14)}
      />
    </g>
  )
}

/** Animated group; `origin` is in view-box units ("100px 64px"). */
export function G({ cls, origin, delay, style, children }: { cls: string; origin?: string; delay?: number; style?: CSSProperties; children: ReactNode }) {
  const s: CSSProperties = { ...style }
  if (origin) {
    s.transformOrigin = origin
    s.transformBox = 'view-box'
  }
  if (delay) s.animationDelay = `${delay}s`
  return (
    <g className={cls} style={s}>
      {children}
    </g>
  )
}

/** A straight arrow with an engraved open head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  w = 2.6,
  head = 7,
  filled = true,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  w?: number
  head?: number
  filled?: boolean
}) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const bx = x2 - head * Math.cos(a)
  const by = y2 - head * Math.sin(a)
  const px = (head * 0.55) * Math.cos(a + Math.PI / 2)
  const py = (head * 0.55) * Math.sin(a + Math.PI / 2)
  const f = (n: number) => n.toFixed(1)
  return (
    <g>
      <path d={`M${f(x1)} ${f(y1)}L${f(bx)} ${f(by)}`} stroke={color} strokeWidth={w} />
      <path
        d={`M${f(x2)} ${f(y2)}L${f(bx + px)} ${f(by + py)}L${f(bx - px)} ${f(by - py)}Z`}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={Math.min(w, 1.6)}
      />
    </g>
  )
}

/** Sparkle star (four points). */
export function Star({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const k = r * 0.28
  return (
    <path
      d={`M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`}
      fill={fill}
      strokeWidth="1.2"
    />
  )
}

/** Stopwatch dial with a sweeping hand. */
export function Stopwatch({ c, x, y, r, spin = true }: { c: Ctx; x: number; y: number; r: number; spin?: boolean }) {
  const ri = r * 0.84
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    const r1 = i % 3 === 0 ? ri * 0.72 : ri * 0.84
    return `M${(x + r1 * Math.sin(a)).toFixed(1)} ${(y - r1 * Math.cos(a)).toFixed(1)}L${(x + ri * 0.95 * Math.sin(a)).toFixed(1)} ${(y - ri * 0.95 * Math.cos(a)).toFixed(1)}`
  }).join('')
  const ring = (rr: number) => `M${x - rr} ${y}a${rr} ${rr} 0 1 0 ${rr * 2} 0a${rr} ${rr} 0 1 0 ${-rr * 2} 0Z`
  return (
    <g>
      {/* crown and side button */}
      <path d={`M${x - 3} ${y - r - 3}v-${r * 0.2}h6v${r * 0.2}`} fill="var(--surface)" strokeWidth="1.6" />
      <rect x={x - r * 0.24} y={y - r - 3 - r * 0.2 - 6} width={r * 0.48} height="6" rx="2" fill={c.L} strokeWidth="1.6" />
      <path d={`M${x + r * 0.62} ${y - r * 0.9}l5 -5M${x + r * 0.62 + 2} ${y - r * 0.9 - 7}l7 7`} strokeWidth="2.2" />
      <circle cx={x} cy={y} r={r} fill="var(--surface)" />
      <path d={`${ring(r)}${ring(ri)}`} fill={c.hl} fillRule="evenodd" stroke="none" />
      <circle cx={x} cy={y} r={r} />
      <circle cx={x} cy={y} r={ri} strokeWidth="1.2" />
      <path d={ticks} strokeWidth="1.3" />
      <G cls={spin ? 'a-tick' : ''} origin={`${x}px ${y}px`}>
        <path d={`M${x} ${y + ri * 0.2}V${y - ri * 0.8}`} stroke={c.L} strokeWidth="2.4" />
      </G>
      <circle cx={x} cy={y} r="2.6" fill={INK} stroke="none" />
    </g>
  )
}

/** points of a sampled function as an svg path */
export function pathOf(n: number, f: (t: number) => [number, number]) {
  let d = ''
  for (let k = 0; k <= n; k++) {
    const [x, y] = f(k / n)
    d += `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}
