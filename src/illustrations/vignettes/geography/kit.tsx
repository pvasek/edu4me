import { useId, type ReactNode } from 'react'
import { PAPER, pathOf } from '../physics/kit'

/**
 * Drawing kit for the geography level vignettes. The plate, strokes, hatching
 * and animation helpers are shared with the physics vignettes (../physics/kit);
 * this file adds the landscape pieces the geography scenes reuse (water,
 * trees, clouds, people, flags, a globe). Colours are theme tokens mixed with
 * the surface, so every scene follows dark mode.
 */
export { Arrow, Ball, G, GLASS, Ground, INK, PAPER, Star, detail, labelFill, labelFont, pathOf, type Ctx } from '../physics/kit'

const mix = (token: string, pct: number, base = 'var(--surface)') => `color-mix(in srgb, ${token} ${pct}%, ${base})`

/** subject colours from the theme: water, forest, fields, rock, roofs… */
export const GEO = {
  sky: mix('var(--blue)', 14),
  sea: mix('var(--blue)', 58),
  seaDeep: mix('var(--blue)', 82),
  lake: mix('var(--teal)', 52),
  forest: mix('var(--green)', 88),
  forestLight: mix('var(--green)', 58),
  meadow: mix('var(--green)', 32),
  field: mix('var(--yellow)', 58),
  fieldPale: mix('var(--yellow)', 30),
  sand: mix('var(--yellow)', 26),
  rock: mix('var(--edge)', 20),
  rockDark: mix('var(--edge)', 38),
  snow: PAPER,
  sun: 'var(--yellow)',
  red: mix('var(--bad)', 85),
  roof: mix('var(--bad)', 62),
  wall: mix('var(--yellow)', 16),
  violet: mix('var(--violet)', 75),
  pink: mix('var(--pink)', 75),
  blue: mix('var(--blue)', 80),
  teal: mix('var(--teal)', 80),
  ochre: mix('var(--accent)', 75),
}

export const f = (n: number) => n.toFixed(1)

/** Horizontal band y0..y1 cut to the plate circle (r 90 around 100,100). */
export function plateBand(y0: number, y1: number, r = 90) {
  const hw = (y: number) => Math.sqrt(Math.max(0, r * r - (y - 100) ** 2))
  const a = hw(y0)
  const b = hw(y1)
  return `M${f(100 - a)} ${f(y0)}H${f(100 + a)}A${r} ${r} 0 0 1 ${f(100 + b)} ${f(y1)}H${f(100 - b)}A${r} ${r} 0 0 1 ${f(100 - a)} ${f(y0)}Z`
}

/** Clips a landscape to the round plate (r 92), so land and water end at its edge. */
export function PlateClip({ children, r = 92 }: { children: ReactNode; r?: number }) {
  const id = `gc${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <>
      <defs>
        <clipPath id={id}>
          <circle cx="100" cy="100" r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  )
}

/** Wavy water line from x0 to x1 at height y. */
export function waveD(x0: number, x1: number, y: number, amp = 1.6, period = 10) {
  const n = Math.max(8, Math.round((x1 - x0) / 2))
  return pathOf(n, (t) => [x0 + t * (x1 - x0), y + amp * Math.sin(((t * (x1 - x0)) / period) * Math.PI * 2)])
}

/** A spruce standing at (x,y), height h; the right half is hatched. */
export function Conifer({ x, y, h, fill = GEO.forest, hatch }: { x: number; y: number; h: number; fill?: string; hatch?: string }) {
  const w = h * 0.25
  const pts = [
    [0.5, -0.7],
    [0.28, -0.7],
    [0.78, -0.42],
    [0.48, -0.42],
    [1, -0.14],
  ]
  const L = (px: number, py: number) => `L${f(x + px * w)} ${f(y + py * h)}`
  const rightSide = pts.map(([px, py]) => L(px, py)).join('')
  const leftSide = [...pts].reverse().map(([px, py]) => L(-px, py)).join('')
  const right = `M${f(x)} ${f(y - h)}${rightSide}${L(0, -0.14)}Z`
  const whole = `M${f(x)} ${f(y - h)}${rightSide}${leftSide}Z`
  return (
    <g>
      <path d={`M${f(x)} ${f(y)}V${f(y - h * 0.16)}`} strokeWidth={Math.max(1, h * 0.06)} />
      <path d={whole} fill={fill} strokeWidth={h > 24 ? 1.4 : 1.1} />
      {hatch && <path d={right} fill={hatch} stroke="none" />}
    </g>
  )
}

/** A broadleaf tree at (x,y) with a bumpy round crown of radius r. */
export function Tree({ x, y, r, fill = GEO.forestLight, hatch, bumps = 7 }: { x: number; y: number; r: number; fill?: string; hatch?: string; bumps?: number }) {
  const cy = y - r * 1.55
  const crown = pathOf(56, (t) => {
    const a = t * Math.PI * 2
    const rr = r * (1 + 0.09 * Math.abs(Math.sin(a * bumps * 0.5)))
    return [x + rr * Math.cos(a), cy + rr * Math.sin(a) * 0.92]
  }) + 'Z'
  return (
    <g>
      <path d={`M${f(x)} ${f(y)}V${f(cy + r * 0.3)}M${f(x)} ${f(cy + r * 0.75)}l${f(r * 0.3)} ${f(-r * 0.3)}`} strokeWidth={Math.max(1.2, r * 0.18)} />
      <path d={crown} fill={fill} strokeWidth={r > 10 ? 1.5 : 1.2} />
      {hatch && <path d={`M${f(x + r * 0.15)} ${f(cy - r * 0.9)}A${f(r * 0.95)} ${f(r * 0.9)} 0 0 1 ${f(x - r * 0.2)} ${f(cy + r * 0.85)}C${f(x + r * 0.5)} ${f(cy + r * 0.3)} ${f(x + r * 0.55)} ${f(cy - r * 0.4)} ${f(x + r * 0.15)} ${f(cy - r * 0.9)}Z`} fill={hatch} stroke="none" />}
    </g>
  )
}

/** A flat-bottomed cloud; (x,y) is the middle of its base, w its width. */
export function Cloud({ x, y, w, fill = 'var(--surface)', hatch }: { x: number; y: number; w: number; fill?: string; hatch?: string }) {
  const d = `M${f(x - w / 2)} ${f(y)}a${f(w * 0.16)} ${f(w * 0.16)} 0 0 1 ${f(w * 0.2)} ${f(-w * 0.14)}a${f(w * 0.22)} ${f(w * 0.22)} 0 0 1 ${f(w * 0.38)} ${f(-w * 0.04)}a${f(w * 0.23)} ${f(w * 0.23)} 0 0 1 ${f(w * 0.42)} ${f(w * 0.18)}Z`
  return (
    <g>
      <path d={d} fill={fill} strokeWidth="1.5" />
      {hatch && <path d={`M${f(x - w / 2 + 3)} ${f(y - 1)}h${f(w - 6)}l-3 ${f(-w * 0.06)}h${f(-w + 12)}Z`} fill={hatch} stroke="none" />}
    </g>
  )
}

/** A standing person, feet at (x,y), ~22·s tall; optional backpack and stick. */
export function Person({ x, y, s = 1, fill, pack, stick, flip }: { x: number; y: number; s?: number; fill: string; pack?: string; stick?: boolean; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-2.6 -8.5L-3.6 0M2.6 -8.5L4 0" strokeWidth="2" />
      {stick && <path d="M5.5 -12L9 0" strokeWidth="1.3" />}
      {pack && <path d="M-4.6 -16.5h-3.4c-1 0-1.6 1-1.6 2v5.5c0 1 .8 1.6 1.6 1.6h3.6Z" fill={pack} strokeWidth="1.2" />}
      <path d="M-4.4 -8c-.6-4-.4-7.6 1-9.2 1.6-1.6 5.2-1.6 6.8 0 1.4 1.6 1.6 5.2 1 9.2Z" fill={fill} strokeWidth="1.3" />
      <path d="M4.2 -15.5l1.6 4.4" strokeWidth="1.6" />
      <circle cx="0" cy="-20.6" r="3.2" fill="var(--surface)" strokeWidth="1.3" />
    </g>
  )
}

/** A flag on a pole; foot at (x,y), pole height h, cloth waving in the wind. */
export function Flag({ x, y, h, fill, band, delay = 0 }: { x: number; y: number; h: number; fill: string; band?: string; delay?: number }) {
  const top = y - h
  const w = h * 0.42
  const fh = h * 0.26
  const cloth = `M${f(x)} ${f(top + 1)}c${f(w * 0.3)} ${f(-fh * 0.25)} ${f(w * 0.6)} ${f(fh * 0.25)} ${f(w)} 0v${f(fh)}c${f(-w * 0.4)} ${f(fh * 0.25)} ${f(-w * 0.7)} ${f(-fh * 0.25)} ${f(-w)} 0Z`
  return (
    <g>
      <path d={`M${f(x)} ${f(y)}V${f(top - 2)}`} strokeWidth="1.5" />
      <circle cx={x} cy={top - 2.6} r="1.3" fill="var(--edge)" stroke="none" />
      <g className="a-sway" style={{ transformOrigin: `${x}px ${top}px`, transformBox: 'view-box', animationDelay: `${delay}s`, animationDuration: '3.4s' }}>
        <path d={cloth} fill={fill} strokeWidth="1.2" />
        {band && <path d={`M${f(x)} ${f(top + 1 + fh * 0.36)}c${f(w * 0.3)} ${f(-fh * 0.25)} ${f(w * 0.6)} ${f(fh * 0.25)} ${f(w)} 0v${f(fh * 0.3)}c${f(-w * 0.4)} ${f(fh * 0.25)} ${f(-w * 0.7)} ${f(-fh * 0.25)} ${f(-w)} 0Z`} fill={band} stroke="none" />}
      </g>
    </g>
  )
}

/**
 * A globe: sea-coloured sphere with a graticule (parallels as front arcs,
 * meridians as ellipses), turned by `tilt` degrees; children draw on top.
 */
export function Globe({ cx, cy, r, tilt = 0, fill = GEO.sea, children }: { cx: number; cy: number; r: number; tilt?: number; fill?: string; children?: ReactNode }) {
  const lats = [-60, -30, 0, 30, 60]
  const lons = [30, 60]
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <g transform={`rotate(${tilt} ${cx} ${cy})`} strokeWidth="0.9" strokeOpacity="0.55">
        {lats.map((la) => {
          const y = cy - r * Math.sin((la * Math.PI) / 180)
          const rx = r * Math.cos((la * Math.PI) / 180)
          const ry = rx * 0.16
          return <path key={la} d={`M${f(cx - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}`} strokeWidth={la === 0 ? 1.3 : 0.9} />
        })}
        <path d={`M${cx} ${f(cy - r)}V${f(cy + r)}`} />
        {lons.map((lo) => (
          <ellipse key={lo} cx={cx} cy={cy} rx={f(r * Math.sin((lo * Math.PI) / 180))} ry={r} />
        ))}
      </g>
      {children}
      <circle cx={cx} cy={cy} r={r} strokeWidth={r > 30 ? 2.2 : 1.6} />
      <path d={`M${f(cx - r * 0.7)} ${f(cy - r * 0.2)}a${f(r * 0.72)} ${f(r * 0.72)} 0 0 1 ${f(r * 0.55)} ${f(-r * 0.52)}`} stroke={PAPER} strokeOpacity="0.7" strokeWidth={Math.max(1.2, r * 0.07)} />
    </g>
  )
}
