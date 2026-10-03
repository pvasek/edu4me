import { INK, PAPER, pathOf, type Ctx } from '../physics/kit'

/**
 * Drawing kit for the biology level vignettes. The plate, strokes, hatching
 * and animation helpers are shared with the physics vignettes (../physics/kit);
 * this file adds the organic shapes the biology scenes reuse.
 */
export { Arrow, Ball, G, GLASS, Ground, INK, PAPER, Star, detail, labelFill, labelFont, pathOf, type Ctx } from '../physics/kit'

/** literal subject colours (like CPK in chemistry): leaf, petal, bark, blood… */
export const BIO = {
  leaf: '#5f9a4a',
  leafDark: '#3f7034',
  petal: '#e6a3c0',
  pollen: '#e0b43a',
  bark: '#8a6040',
  blood: '#c8473b',
  lung: '#e39a8f',
  fox: '#d0703a',
  frog: '#6aa548',
  bone: '#efe6d2',
  sky: '#7fa8d8',
  bases: ['#d9493b', '#3d6fd1', '#e0b43a', '#4fae5a'],
}

const f = (n: number) => n.toFixed(1)

/** A pointed leaf from (x,y) along angle `a` (deg), length `len`, with a midrib. */
export function Leaf({ x, y, a, len, w = 0.42, fill = BIO.leaf, hatch }: { x: number; y: number; a: number; len: number; w?: number; fill?: string; hatch?: string }) {
  const r = (a * Math.PI) / 180
  const ex = x + len * Math.cos(r)
  const ey = y + len * Math.sin(r)
  const nx = -Math.sin(r) * len * w
  const ny = Math.cos(r) * len * w
  const mx = x + (ex - x) * 0.45
  const my = y + (ey - y) * 0.45
  const d = `M${f(x)} ${f(y)}Q${f(mx + nx)} ${f(my + ny)} ${f(ex)} ${f(ey)}Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)}Z`
  return (
    <g>
      <path d={d} fill={fill} fillOpacity="0.85" strokeWidth="1.4" />
      {hatch && <path d={`M${f(x)} ${f(y)}Q${f(mx - nx)} ${f(my - ny)} ${f(ex)} ${f(ey)}Z`} fill={hatch} stroke="none" />}
      <path d={`M${f(x)} ${f(y)}L${f(ex)} ${f(ey)}`} strokeWidth="1" strokeOpacity="0.7" />
    </g>
  )
}

/** Double helix between y0 and y1 around column cx; `turns` full turns. */
export function Helix({ c, cx, y0, y1, amp, turns = 1, rungs = 9, w = 4.4 }: { c: Ctx; cx: number; y0: number; y1: number; amp: number; turns?: number; rungs?: number; w?: number }) {
  const strand = (s: number) => pathOf(64, (t) => [cx + s * amp * Math.sin(t * turns * Math.PI * 2), y0 + t * (y1 - y0)])
  const steps = Array.from({ length: rungs }, (_, i) => {
    const t = (i + 0.5) / rungs
    const y = y0 + t * (y1 - y0)
    const x = amp * Math.sin(t * turns * Math.PI * 2)
    return { y, x }
  })
  return (
    <g>
      {steps.map(({ y, x }, i) => (
        <g key={i}>
          <path d={`M${f(cx - x)} ${f(y)}H${cx}`} stroke={BIO.bases[i % 4]} strokeWidth="3.4" />
          <path d={`M${cx} ${f(y)}H${f(cx + x)}`} stroke={BIO.bases[(i + 2) % 4]} strokeWidth="3.4" />
        </g>
      ))}
      <path d={strand(-1)} strokeWidth={w} stroke={INK} strokeOpacity="0.4" />
      <path d={strand(1)} strokeWidth={w} stroke={c.L} />
      <path d={strand(1)} strokeWidth="1" stroke={PAPER} strokeOpacity="0.6" />
    </g>
  )
}

/** Horizontal band y0..y1 cut to the plate circle (r 90 around 100,100). */
export function plateBand(y0: number, y1: number, r = 90) {
  const hw = (y: number) => Math.sqrt(Math.max(0, r * r - (y - 100) ** 2))
  const a = hw(y0)
  const b = hw(y1)
  return `M${f(100 - a)} ${f(y0)}H${f(100 + a)}A${r} ${r} 0 0 1 ${f(100 + b)} ${f(y1)}H${f(100 - b)}A${r} ${r} 0 0 1 ${f(100 - a)} ${f(y0)}Z`
}

export type Beak = 'seed' | 'insect' | 'probe' | 'cactus'

/** A small perching bird facing right, feet at (x,y); `scale` ~1 is 30 px long. */
export function Finch({ x, y, body, beak = 'seed', flip = false, scale = 1 }: { x: number; y: number; body: string; beak?: Beak; flip?: boolean; scale?: number }) {
  const beaks: Record<Beak, string> = {
    seed: 'M12 -19c4-2 8 0 9 3-3 3-7 4-10 3Z',
    insect: 'M12 -18l10 1-10 3Z',
    probe: 'M12 -18c6 0 12 2 15 5-5 0-11-1-15-2Z',
    cactus: 'M12 -19l8 1.5 0 1.5-8 1.5Z',
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* tail */}
      <path d="M-8 -9l-12 6 3-6-1-4Z" fill={body} strokeWidth="1.3" />
      {/* body */}
      <path d="M-10 -10c0-10 8-16 16-15 6 0 9 4 9 9 0 8-8 14-17 13-5 0-8-3-8-7Z" fill={body} strokeWidth="1.5" />
      <path d="M-4 -12c4 2 9 1 12-3" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M-6 -9c3 3 8 4 12 2" stroke={PAPER} strokeOpacity="0.5" strokeWidth="1" />
      <path d={beaks[beak]} fill={beak === 'seed' ? '#3b3b3b' : '#6b5a3a'} strokeWidth="1" />
      <circle cx="8.5" cy="-17.5" r="1.6" fill={INK} stroke="none" />
      {/* legs */}
      <path d="M0 -3v3M4 -3v3M-2 0h4M2 0h4" strokeWidth="1.2" />
    </g>
  )
}
