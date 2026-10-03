/**
 * Biology icons (24×24, engraving style, same conventions as icon-paths.ts).
 *
 * The small shape helpers are re-declared here instead of imported: icon-paths.ts
 * imports this module at load time, so a runtime import back would be a cycle.
 * Only types are imported from icon-paths.ts.
 */
import type { IconDef, IconShape } from './icon-paths'

const soft = (d: string): IconShape => ({ d, f: 'soft' })
const hatch = (d: string): IconShape => ({ d, f: 'hatch' })
const thin = (d: string, w = 1): IconShape => ({ d, w })
const circ = (x: number, y: number, r: number, w?: number): IconShape => ({ c: [x, y, r], w })
const dot = (x: number, y: number, r = 0.9): IconShape => ({ c: [x, y, r], f: 'solid' })
const softC = (x: number, y: number, r: number): IconShape => ({ c: [x, y, r], f: 'soft' })
const hatchC = (x: number, y: number, r: number): IconShape => ({ c: [x, y, r], f: 'hatch' })
const ell = (x: number, y: number, rx: number, ry: number, tr?: string, w?: number): IconShape => ({ e: [x, y, rx, ry], tr, w })

/** rotate a group of shapes around (cx, cy) */
function rot(deg: number, shapes: IconDef, cx = 12, cy = 12): IconShape[] {
  const t = `rotate(${deg} ${cx} ${cy})`
  return shapes.map((s) => (typeof s === 'string' ? { d: s, tr: t } : { ...s, tr: s.tr ? `${t} ${s.tr}` : t }))
}
/** repeat shapes rotated n times around (cx, cy) */
function spin(n: number, shapes: IconDef, cx = 12, cy = 12, offset = 0): IconShape[] {
  const out: IconShape[] = []
  for (let i = 0; i < n; i++) out.push(...rot(offset + (360 / n) * i, shapes, cx, cy))
  return out
}
/** the same shapes plus their mirror image across the vertical line x = 12 */
function sym(shapes: IconDef): IconShape[] {
  const t = 'matrix(-1 0 0 1 24 0)'
  const flip = shapes.map((s) => (typeof s === 'string' ? { d: s, tr: t } : { ...s, tr: s.tr ? `${t} ${s.tr}` : t }))
  return [...shapes.map((s) => (typeof s === 'string' ? { d: s } : s)), ...flip]
}

const r2 = (n: number) => +n.toFixed(2)
type Pt = readonly [number, number]
const pt = (p: Pt) => `${r2(p[0])} ${r2(p[1])}`
/** point at radius r, angle a (degrees clockwise from 12 o'clock) */
const polar = (cx: number, cy: number, r: number, a: number): Pt => {
  const t = (a * Math.PI) / 180
  return [cx + r * Math.sin(t), cy - r * Math.cos(t)]
}
/** straight arrow from (x1, y1) to (x2, y2) with an open head */
function arrow(x1: number, y1: number, x2: number, y2: number, head = 2.2, wing = 1.3) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const bx = x2 - ux * head
  const by = y2 - uy * head
  return `M${x1} ${y1}L${x2} ${y2}M${r2(bx - uy * wing)} ${r2(by + ux * wing)}L${x2} ${y2}L${r2(bx + uy * wing)} ${r2(by - ux * wing)}`
}
/** n + 1 points along a cubic Bézier */
function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 16): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const u = 1 - t
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ])
  }
  return out
}
const line = (pts: Pt[]) => `M${pts.map(pt).join('L')}`
/** unit normal of a polyline at index i */
function normal(pts: Pt[], i: number): Pt {
  const a = pts[Math.max(0, i - 1)]
  const b = pts[Math.min(pts.length - 1, i + 1)]
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
}
/** closed outline of a soft tube along a centre line; half-width w(t), t ∈ [0, 1]; round ends */
function tube(pts: Pt[], w: (t: number) => number): string {
  const n = pts.length - 1
  const left: Pt[] = []
  const right: Pt[] = []
  pts.forEach((p, i) => {
    const [nx, ny] = normal(pts, i)
    const h = w(i / n)
    left.push([p[0] + nx * h, p[1] + ny * h])
    right.push([p[0] - nx * h, p[1] - ny * h])
  })
  const we = r2(Math.max(w(1), 0.05))
  const ws = r2(Math.max(w(0), 0.05))
  return `M${left.map(pt).join('L')}A${we} ${we} 0 0 0 ${right
    .slice()
    .reverse()
    .map(pt)
    .join('L')}A${ws} ${ws} 0 0 0 ${pt(left[0])}Z`
}
/** short cross-strokes over a tube at the given t values (segment rings, bands) */
function rungs(pts: Pt[], w: (t: number) => number, ts: number[], k = 0.9): string {
  const n = pts.length - 1
  return ts
    .map((t) => {
      const i = Math.round(t * n)
      const [nx, ny] = normal(pts, i)
      const h = w(i / n) * k
      const p = pts[i]
      return `M${pt([p[0] + nx * h, p[1] + ny * h])}L${pt([p[0] - nx * h, p[1] - ny * h])}`
    })
    .join('')
}
/** a log spiral from the centre outwards: r = r0·e^(bθ) for θ ∈ [0, θmax]; a0 rotates it */
function spiral(cx: number, cy: number, r0: number, r1: number, turns: number, a0 = 0, steps = 60): Pt[] {
  const tMax = turns * 2 * Math.PI
  const b = Math.log(r1 / r0) / tMax
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (tMax * i) / steps
    const r = r0 * Math.exp(b * t)
    out.push([cx + r * Math.cos(t + a0), cy + r * Math.sin(t + a0)])
  }
  return out
}
/** a vertical sine strand x = cx + amp·sin(…) from y0 to y1 (DNA helix strands) */
function strand(cx: number, amp: number, period: number, phase: number, y0: number, y1: number): string {
  const pts: Pt[] = []
  const steps = Math.max(4, Math.round((y1 - y0) * 2))
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps
    pts.push([cx + amp * Math.sin(((y - y0) / period) * 2 * Math.PI + phase), y])
  }
  return line(pts)
}

export const BIOLOGY_ICON_IDS = [
  'virus',
  'bacteria',
  'amoeba',
  'mushroom',
  'lichen',
  'moss',
  'fern',
  'root',
  'flower',
  'seed',
  'sponge',
  'jellyfish',
  'worm',
  'snail',
  'spider',
  'tick',
  'bee',
  'butterfly',
  'starfish',
  'frog',
  'lizard',
  'bird',
  'mouse',
  'deer',
  'paw',
  'skeleton',
  'tooth',
  'kidney',
  'brain',
  'neuron',
  'baby',
  'first-aid',
  'chromosome',
  'pea',
  'twins',
  'fossil',
  'soil',
  'food-chain',
  'forest',
  'pond',
  'family-tree',
  'cell-division',
  'gene-scissors',
] as const
export type BiologyIcon = (typeof BIOLOGY_ICON_IDS)[number]

// ── shared geometry ──
const wormLine = bez([3, 15.5], [7.5, 6.5], [12.5, 22.5], [21, 10.5], 30)
const wormW = (t: number) => 1.9 - 0.5 * t
const lizardLine = [
  ...bez([16.4, 2.4], [14.6, 6], [11.6, 8.6], [11.6, 12.6], 12),
  ...bez([11.6, 12.6], [11.6, 16.6], [13, 19.6], [16.6, 20.2], 10).slice(1),
  ...bez([16.6, 20.2], [19.4, 20.6], [21, 18.6], [19.8, 16.8], 6).slice(1),
]
/** piecewise-linear profile through [t, value] knots */
const profile = (knots: [number, number][]) => (t: number) => {
  for (let i = 1; i < knots.length; i++) {
    const [t0, v0] = knots[i - 1]
    const [t1, v1] = knots[i]
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)
  }
  return knots[knots.length - 1][1]
}
const lizardW = profile([[0, 1.2], [0.05, 1.8], [0.11, 1.3], [0.26, 2.5], [0.42, 1.5], [1, 0.25]])
/** a bent leg on both sides of the lizard at centre-line index i (front legs reach forward, hind legs back) */
function lizardLegs(i: number, front: boolean): string {
  const p = lizardLine[i]
  const [nx, ny] = normal(lizardLine, i)
  const [tx, ty] = [ny, -nx]
  const w = lizardW(i / (lizardLine.length - 1))
  const k = front ? 0.8 : -1
  return [1, -1]
    .map((s) => {
      const b: Pt = [p[0] + nx * s * w, p[1] + ny * s * w]
      const knee: Pt = [b[0] + nx * s * 2.2 + tx * k, b[1] + ny * s * 2.2 + ty * k]
      const foot: Pt = [knee[0] + nx * s * 0.6 + tx * 1.8, knee[1] + ny * s * 0.6 + ty * 1.8]
      return `M${pt(b)}L${pt(knee)}L${pt(foot)}`
    })
    .join('')
}
const chromLine = bez([7, 3], [11.6, 8], [11.6, 16], [7, 21], 20)
const chromW = (t: number) => 1.6 - 0.75 * Math.exp(-((t - 0.5) ** 2) / 0.004)
const fossilSpiral = spiral(12, 12.2, 0.7, 7, 2.6, -1.2)
const conifer = (x: number, top: number, h: number) => {
  const w = h * 0.42
  const y1 = top + h * 0.38
  const y2 = top + h * 0.7
  return `M${x} ${top}L${r2(x + w * 0.55)} ${r2(y1)}H${r2(x + w * 0.3)}L${r2(x + w * 0.8)} ${r2(y2)}H${r2(x + w * 0.5)}L${r2(x + w)} ${r2(top + h)}H${r2(x - w)}L${r2(x - w * 0.5)} ${r2(y2)}H${r2(x - w * 0.8)}L${r2(x - w * 0.3)} ${r2(y1)}H${r2(x - w * 0.55)}Z`
}
const fernRachis = bez([5.5, 21.5], [7.5, 15], [11, 8.5], [19, 3], 24)
function fernPinnae(): string {
  const out: string[] = []
  for (let i = 3; i <= 21; i += 3) {
    const p = fernRachis[i]
    const [nx, ny] = normal(fernRachis, i)
    const [tx, ty] = [ny, -nx]
    const len = 6.6 * (1 - i / 27)
    for (const side of [1, -1]) {
      // leaflet leans towards the frond tip
      const dx = nx * side * 0.85 + tx * 0.45
      const dy = ny * side * 0.85 + ty * 0.45
      const e: Pt = [p[0] + dx * len, p[1] + dy * len]
      const m: Pt = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2]
      const bw = len * 0.2
      out.push(`M${pt(p)}Q${pt([m[0] - tx * bw, m[1] - ty * bw])} ${pt(e)}Q${pt([m[0] + tx * bw, m[1] + ty * bw])} ${pt(p)}Z`)
    }
  }
  return out.join('')
}
const fern = fernPinnae()
const helixY = (a: number, b: number, phase: number) => strand(6.5, 3, 10, phase, a, b)
const gapTop = 10.4
const gapBot = 13.6
function rungsDNA(y0: number, y1: number): string {
  const out: string[] = []
  for (let y = y0; y <= y1; y += 1.7) {
    const x = 3 * Math.sin(((y - 2) / 10) * 2 * Math.PI)
    if (Math.abs(x) > 0.9) out.push(`M${r2(6.5 - x * 0.75)} ${r2(y)}H${r2(6.5 + x * 0.75)}`)
  }
  return out.join('')
}
const ammoniteRibs = (() => {
  const out: string[] = []
  const n = fossilSpiral.length - 1
  const perTurn = n / 2.6
  for (let i = Math.round(perTurn) + 2; i <= n; i += 2) {
    const a = fossilSpiral[i]
    const b = fossilSpiral[i - Math.round(perTurn)]
    out.push(`M${pt(a)}L${pt([a[0] + (b[0] - a[0]) * 0.92, a[1] + (b[1] - a[1]) * 0.92])}`)
  }
  return out.join('')
})()
const snailSpiral = spiral(10, 11.5, 0.6, 6.2, 2.2, 0.4)
const starfish = (() => {
  const tips = [0, 72, 144, 216, 288]
  let d = ''
  tips.forEach((a, i) => {
    const l = polar(12, 12.6, 9.6, a - 7)
    const r = polar(12, 12.6, 9.6, a + 7)
    const c = polar(12, 12.6, 2.6, a + 36)
    const next = polar(12, 12.6, 9.6, tips[(i + 1) % 5] - 7)
    d += `${i === 0 ? 'M' : 'L'}${pt(l)}A1.2 1.2 0 0 1 ${pt(r)}Q${pt(c)} ${pt(next)}`
  })
  return d + 'Z'
})()

export const BIOLOGY_ICON_PATHS: Record<BiologyIcon, IconDef> = {
  // ───────────────────────── microbes & simple life ─────────────────────────
  virus: [
    softC(12, 12, 5.6),
    circ(12, 12, 5.6),
    ...spin(8, ['M12 6.4V4', dot(12, 3.1, 1.3)], 12, 12, 22.5),
    thin('M9.4 10.6c.9-1.2 1.8 1 2.7-.2s1.8 1 2.7-.2M9.4 13.6c.9-1.2 1.8 1 2.7-.2s1.8 1 2.7-.2', 1),
  ],
  bacteria: rot(-30, [
    soft('M6.5 9h8a3 3 0 0 1 0 6h-8a3 3 0 0 1 0-6Z'),
    'M6.5 9h8a3 3 0 0 1 0 6h-8a3 3 0 0 1 0-6Z',
    thin('M6.6 12.2c.9-1.3 1.8 1.3 2.8 0s1.8-1.3 2.8 0 1.8 1.3 2.8 0', 1),
    'M17.5 12c1.1-1.6 2.1 1.6 3.2 0 .5-.7 1-.8 1.6-.5',
    thin('M7.5 9 7 7.6M10.5 9V7.5M13.5 9l.5-1.4M7.5 15 7 16.4M10.5 15v1.5M13.5 15l.5 1.4', 0.9),
  ]),
  amoeba: [
    soft('M11 3.8c1.8-.4 2.6 1.6 3.4 2.8.7 1 2.4.2 4.6.5 1.8.3 2.8 1.8 1.6 2.8-1.2 1-3.4.8-3.4 2.4 0 1.6 2.4 2.6 2 4.6-.4 1.8-2.4 1.8-3.4 1-1-.8-2-.6-2.6.6-.7 1.4-1.2 3.4-3 3.2-1.7-.2-1.4-2.4-1.6-3.8-.2-1.2-1.4-1.6-2.8-1.8-1.6-.3-3-1.3-2.4-2.8.6-1.4 2.6-1 3.4-2.2.8-1.2-1-2.4-.6-4 .4-1.6 2.6-1.4 3.6-.7 1 .6 1.2-2.2 1.2-2.6Z'),
    'M11 3.8c1.8-.4 2.6 1.6 3.4 2.8.7 1 2.4.2 4.6.5 1.8.3 2.8 1.8 1.6 2.8-1.2 1-3.4.8-3.4 2.4 0 1.6 2.4 2.6 2 4.6-.4 1.8-2.4 1.8-3.4 1-1-.8-2-.6-2.6.6-.7 1.4-1.2 3.4-3 3.2-1.7-.2-1.4-2.4-1.6-3.8-.2-1.2-1.4-1.6-2.8-1.8-1.6-.3-3-1.3-2.4-2.8.6-1.4 2.6-1 3.4-2.2.8-1.2-1-2.4-.6-4 .4-1.6 2.6-1.4 3.6-.7 1 .6 1.2-2.2 1.2-2.6Z',
    hatchC(11.4, 11.6, 2.3),
    circ(11.4, 11.6, 2.3, 1.2),
    circ(14.8, 15.2, 1, 0.9),
    dot(8.4, 15, 0.55),
    dot(15.2, 9.4, 0.55),
  ],
  mushroom: [
    soft('M3 12.5A9 7.6 0 0 1 21 12.5Z'),
    'M3 12.5A9 7.6 0 0 1 21 12.5Z',
    circ(8, 9.2, 1.1, 1),
    circ(12.8, 7.2, 1.2, 1),
    circ(16.6, 10, 0.9, 1),
    hatch('M10 12.5h4l.5 7.8a1.2 1.2 0 0 1-1.2 1.2h-2.6a1.2 1.2 0 0 1-1.2-1.2Z'),
    'M10 12.5l-.5 7.8a1.2 1.2 0 0 0 1.2 1.2h2.6a1.2 1.2 0 0 0 1.2-1.2L14 12.5',
    thin('M9.6 15.4c1.4.6 3.4.6 4.8 0', 1),
  ],
  lichen: [
    hatch('M15 9.8l4.6 4.4 1.9 6.8H12.5l1.6-6.5Z'),
    'M2.5 21 4.6 13.4 9.6 9l5.4.8 4.6 4.4 1.9 6.8Z',
    soft('M5.6 13.2c.1-1.4 1.5-1.8 2.2-1 .3-1.2 1.9-1.6 2.6-.6.6-1 2.2-.9 2.5.3 1-.4 2.3.4 1.9 1.6 1.2.3 1.3 1.9.3 2.4.6 1-.5 2.2-1.6 1.8-.5 1.2-2.1 1.2-2.7.1-.8.8-2.3.3-2.4-.9-1.2-.1-2-1.3-1.3-2.2-1-.6-.7-2.2.5-2.5Z'),
    'M5.6 13.2c.1-1.4 1.5-1.8 2.2-1 .3-1.2 1.9-1.6 2.6-.6.6-1 2.2-.9 2.5.3 1-.4 2.3.4 1.9 1.6 1.2.3 1.3 1.9.3 2.4.6 1-.5 2.2-1.6 1.8-.5 1.2-2.1 1.2-2.7.1-.8.8-2.3.3-2.4-.9-1.2-.1-2-1.3-1.3-2.2-1-.6-.7-2.2.5-2.5Z',
    circ(8.6, 14.6, 0.8, 1),
    circ(11.8, 13.8, 0.8, 1),
    circ(11, 16.8, 0.7, 1),
    thin('M17 18.2c.4-.9 1.5-.9 1.8 0', 1),
  ],
  moss: [
    hatch('M2.5 21c1.4-3.6 4.6-5.4 9.5-5.4s8.1 1.8 9.5 5.4Z'),
    'M2.5 21c1.4-3.6 4.6-5.4 9.5-5.4s8.1 1.8 9.5 5.4Z',
    thin('M7.8 16.2 6.8 8.4M12 15.6l.6-10M16.2 16.2l1.6-7', 1),
    ell(6.6, 7, 0.9, 1.6, 'rotate(-8 6.6 7)', 1.3),
    ell(12.7, 4, 0.9, 1.6, 'rotate(4 12.7 4)', 1.3),
    ell(18.1, 7.6, 0.9, 1.6, 'rotate(14 18.1 7.6)', 1.3),
    thin('M5 16.8l.6-1.4M9.6 15.8l.4-1.4M14.6 15.8l-.3-1.4M19 16.8l-.6-1.4', 1),
  ],
  fern: [
    soft(fern),
    thin(fern, 1),
    line(fernRachis),
    'M17 21.5c0-3 .8-5.4 3-5.8a1.6 1.6 0 1 1-.4 3.1',
  ],
  root: [
    'M2.5 9h19',
    dot(4.6, 12, 0.5),
    dot(19, 11.4, 0.5),
    dot(5.4, 19.6, 0.5),
    dot(19.6, 15.4, 0.5),
    dot(16, 21, 0.5),
    'M12 9V5.4',
    soft('M12 5.6C11 3.6 9.3 3 7.6 3.4c.5 1.8 2.3 2.6 4.4 2.2ZM12 5c1-2 2.7-2.6 4.4-2.2-.5 1.8-2.3 2.6-4.4 2.2Z'),
    'M12 5.6C11 3.6 9.3 3 7.6 3.4c.5 1.8 2.3 2.6 4.4 2.2ZM12 5c1-2 2.7-2.6 4.4-2.2-.5 1.8-2.3 2.6-4.4 2.2Z',
    'M12 9c0 4 .6 7.8-.4 12.5',
    { d: 'M12.1 11.6c-2 .5-3.6 2-4.6 4.4M12.4 13.8c2 .6 3.6 2.2 4.4 4.6M12.2 17c-1.4.6-2.4 1.8-3 3.6', w: 1.2 },
    thin('M8.6 13.8l-1.2-.4M15 15.6l1.2-.2M10 18.8l-1.1-.2M7.5 16l-.9 1.2M16.8 18.4l.4 1.4', 0.8),
  ],
  flower: [
    ...spin(5, [soft('M12 5.9c-2-1-2.2-4.3 0-4.5 2.2.2 2 3.5 0 4.5Z'), 'M12 5.9c-2-1-2.2-4.3 0-4.5 2.2.2 2 3.5 0 4.5Z'], 12, 8),
    hatchC(12, 8, 2.1),
    circ(12, 8, 2.1),
    'M12 10.1v11.4',
    soft('M12 17.4c.8-2.6 3.2-3.8 5.6-3.4-.6 2.4-3 3.8-5.6 3.4Z'),
    'M12 17.4c.8-2.6 3.2-3.8 5.6-3.4-.6 2.4-3 3.8-5.6 3.4Z',
  ],
  seed: [
    { e: [9, 14.2, 6, 4.4], tr: 'rotate(-30 9 14.2)', f: 'hatch' },
    ell(9, 14.2, 6, 4.4, 'rotate(-30 9 14.2)'),
    thin('M5.4 17.6c2.6-.2 5.8-2 7.6-5', 1),
    'M14 10.8c.8-1.8.8-3.6 0-5.2',
    soft('M14 6.2c1.2-1.8 3.4-2.4 5.4-1.6-.8 1.9-3.2 2.6-5.4 1.6ZM14 6.2c-1-1.6-2.8-2-4.4-1.4.6 1.6 2.6 2.2 4.4 1.4Z'),
    'M14 6.2c1.2-1.8 3.4-2.4 5.4-1.6-.8 1.9-3.2 2.6-5.4 1.6ZM14 6.2c-1-1.6-2.8-2-4.4-1.4.6 1.6 2.6 2.2 4.4 1.4Z',
    'M14.8 12c1.6 2 2 4.6 1.2 8.8',
    thin('M16.3 15.4l1.2-.5M16.2 18.2l-1.2-.3', 1),
  ],
  sponge: [
    hatch('M6 4.2a6 1.4 0 0 0 12 0 6 1.4 0 0 0-12 0Z'),
    soft('M6 4.2h12l-1 5c-.4 2-1 4-1 6.5l.5 5.3h-9l.5-5.3c0-2.5-.6-4.5-1-6.5Z'),
    'M6 4.2l1 5c.4 2 1 4 1 6.5l-.5 5.3h9l-.5-5.3c0-2.5.6-4.5 1-6.5l1-5',
    ell(12, 4.2, 6, 1.4),
    circ(9.4, 8.4, 0.8, 1),
    circ(13.2, 7.6, 0.7, 1),
    circ(15, 10.6, 0.8, 1),
    circ(11, 11.6, 0.8, 1),
    circ(13.4, 14.4, 0.8, 1),
    circ(10.2, 16.6, 0.7, 1),
    circ(13, 18.6, 0.7, 1),
    'M3.5 21h17',
  ],
  // ───────────────────────── animals ─────────────────────────
  jellyfish: [
    soft('M4 11a8 7.5 0 0 1 16 0c-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0Z'),
    'M4 11a8 7.5 0 0 1 16 0c-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0-1.3.9-2.7.9-4 0Z',
    thin('M7.4 7.2c2.6-1.8 6.6-1.8 9.2 0', 1),
    'M6 11.8c-.8 2 .8 3.4 0 5.4s.8 3 0 4.8M18 11.8c.8 2-.8 3.4 0 5.4s-.8 3 0 4.8',
    thin('M10.2 11.8c-.6 2.4.8 4.4 0 6.8M13.8 11.8c.6 2.4-.8 4.4 0 6.8', 1.1),
    thin('M12 11.8c.4 1.8-.4 3.2 0 5', 1),
  ],
  worm: [
    hatch(tube(wormLine.slice(9, 13), () => 1.6)),
    tube(wormLine, wormW),
    thin(rungs(wormLine, wormW, [0.12, 0.2, 0.42, 0.5, 0.58, 0.66, 0.74, 0.82]), 0.9),
    dot(20.4, 10.6, 0.5),
  ],
  snail: [
    soft('M3 19.4h13.4c2.4 0 3.8-1.4 4.2-3.6l.3-2c.1-.9-.6-1.5-1.4-1.2-1 .4-1.3 1.6-1.6 2.6-.3 1-1 1.6-2.2 1.6H5.4c-1.4 0-2.4 1.2-2.4 2.6Z'),
    'M3 19.4h13.4c2.4 0 3.8-1.4 4.2-3.6l.3-2c.1-.9-.6-1.5-1.4-1.2-1 .4-1.3 1.6-1.6 2.6-.3 1-1 1.6-2.2 1.6H5.4c-1.4 0-2.4 1.2-2.4 2.6Z',
    hatchC(10, 11.4, 6.2),
    circ(10, 11.4, 6.2),
    { d: line(snailSpiral), w: 1.2 },
    'M19.8 12.8 18.6 8.6M20.8 12.8l1.1-3.8',
    dot(18.5, 8.2, 0.8),
    dot(22, 8.6, 0.8),
  ],
  spider: [
    thin('M12 1.5v5', 0.9),
    ...sym([{ d: 'M10.3 8.2 7.6 4.8 5.6 2.6M10 9.2 5.6 7.4 2.8 8.8M10 10.4 5.4 11.6 3.4 14.6M10.6 11.4 7.4 15.4 6.4 19.6', w: 1.3 }]),
    hatch('M12 11a3.4 4.2 0 1 1 0 8.4 3.4 4.2 0 1 1 0-8.4Z'),
    ell(12, 15.2, 3.4, 4.2),
    softC(12, 9, 2.2),
    circ(12, 9, 2.2),
  ],
  tick: [
    ...sym([{ d: 'M8 10.2 4.8 8.4 3.8 5.6M7.4 12.2 3.8 11.6 2.2 9.8M7.4 14.4l-3.4 1-1.2 2.4M8 16.6l-2.6 2.6-.4 2.6', w: 1.3 }]),
    hatch('M8.2 11.4c0-2.4 1.8-3.8 3.8-3.8s3.8 1.4 3.8 3.8c0 1.6-1.6 2.8-3.8 2.8s-3.8-1.2-3.8-2.8Z'),
    ell(12, 14.2, 5, 6.4),
    thin('M8.2 11.4c0 1.6 1.6 2.8 3.8 2.8s3.8-1.2 3.8-2.8', 1),
    'M10.6 7.9 11 5.2h2l.4 2.7',
    thin('M11 5.2 10.4 3.6M13 5.2l.6-1.6', 1),
  ],
  bee: [
    soft('M10.6 10.4C8.2 9 7.4 5.2 9.4 3.6c2-1.4 3.6 2.6 2.6 6.6ZM13.4 10.2c.4-3.2 2.8-6 5-5.2 2 .8.6 4.4-3.4 5.8Z'),
    'M10.6 10.4C8.2 9 7.4 5.2 9.4 3.6c2-1.4 3.6 2.6 2.6 6.6M13.4 10.2c.4-3.2 2.8-6 5-5.2 2 .8.6 4.4-3.4 5.8',
    hatch('M11.2 10.6h2v6.8h-2ZM15.2 10.6l1.8.6v5.6l-1.8.6Z'),
    ell(13.4, 14, 5.6, 3.6),
    thin('M11.2 10.7v6.6M13.2 10.4v7.2M15.2 10.6v6.8M17 11.2v5.6', 1),
    circ(6, 13.4, 2.2),
    dot(5.2, 13, 0.6),
    thin('M5.4 11.3 4 8.4M6.8 11.4l.6-3', 1),
    'M19 14h2.4',
  ],
  butterfly: [
    ...sym([
      soft('M12 10C13.6 5.6 17.6 2.6 20.4 3.4c1.8.5 1.2 4.4-.4 6.4-1.6 2-4.6 2.6-8 2.2Z'),
      'M12 10C13.6 5.6 17.6 2.6 20.4 3.4c1.8.5 1.2 4.4-.4 6.4-1.6 2-4.6 2.6-8 2.2',
      hatch('M12.4 12.8c3 .2 5.6 1.4 6.2 3.6.6 2.4-1.2 4.4-3.2 4-2-.4-2.8-3.4-3-7.6Z'),
      'M12.4 12.8c3 .2 5.6 1.4 6.2 3.6.6 2.4-1.2 4.4-3.2 4-2-.4-2.8-3.4-3-7.6',
      circ(17.4, 6.6, 1, 1),
      thin('M12.6 7.8 C12.2 5.6 11.2 4.4 10 4', 1),
    ]),
    { d: 'M12 8v10', w: 2.4 },
  ],
  starfish: [soft(starfish), starfish, circ(12, 12.6, 1.3, 1), ...spin(5, [dot(12, 9, 0.55), dot(12, 6.3, 0.5), dot(12, 3.8, 0.45)], 12, 12.6)],
  frog: [
    soft('M6.2 9.6C5.4 10.4 5 11.4 5 12.6c0 2.6 1.4 4.4 3 5.4h8c1.6-1 3-2.8 3-5.4 0-1.2-.4-2.2-1.2-3Z'),
    'M6.2 9.6C5.4 10.4 5 11.4 5 12.6c0 2.6 1.4 4.4 3 5.4h8c1.6-1 3-2.8 3-5.4 0-1.2-.4-2.2-1.2-3M10.4 7.8c1-.2 2.2-.2 3.2 0',
    circ(8, 7.6, 2.4),
    circ(16, 7.6, 2.4),
    dot(8.2, 7.6, 1),
    dot(15.8, 7.6, 1),
    thin('M8.4 13c2.2 1.4 5 1.4 7.2 0', 1.1),
    ...sym(['M5.6 14.6c-2 .8-3 2.6-2.6 4.4.3 1.3 1.6 2 3 1.8L9.4 20.6', thin('M9.4 18v2.6M8.2 21.2l1.2-.6 1 .8', 1)]),
  ],
  lizard: [
    soft(tube(lizardLine, lizardW)),
    tube(lizardLine, lizardW),
    { d: lizardLegs(5, true) + lizardLegs(11, false), w: 1.3 },
    dot(15.4, 3.4, 0.45),
    dot(17, 3.6, 0.45),
  ],
  bird: [
    hatch('M9.4 12.4c1.8-.9 4.6-.6 6.8 1.4-1.8 1.4-4.6 1.8-7.2 1.2Z'),
    'M2.6 17.6l5.6-2.8c-.3-3.6 2.2-6.4 5.8-6.4h.6c.4-1.8 1.8-3 3.5-3 1.9 0 3.3 1.4 3.4 3.2L23 9.6l-2.5.7c-.3 4.6-3.6 7.7-8 7.7-1.5 0-2.8-.3-3.9-.9Z',
    thin('M9.4 12.4c1.8-.9 4.6-.6 6.8 1.4-1.8 1.4-4.6 1.8-7.2 1.2', 1),
    dot(18.1, 8, 0.8),
    'M11.6 17.9l-.6 3M14.2 17.8l.4 3.2',
    thin('M6.5 21h12', 1),
  ],
  mouse: [
    soft('M3.8 17.6C3.8 13.2 7.2 10 11.6 10c3 0 5.2 1.4 6.6 3.4l3.4 2.4c.5.4.3 1.2-.4 1.3l-3.4.5Z'),
    'M3.8 17.6C3.8 13.2 7.2 10 11.6 10c3 0 5.2 1.4 6.6 3.4l3.4 2.4c.5.4.3 1.2-.4 1.3l-3.4.5Z',
    hatchC(14.6, 9.6, 2.4),
    circ(14.6, 9.6, 2.4),
    dot(17.6, 13.6, 0.75),
    dot(21.6, 16.4, 0.6),
    thin('M19.6 17.5l1.6 1.6M20 17.2l2.4.6', 0.8),
    'M3.8 17.6c-2.2.4-2.4 3.4-.2 3.6 1.6.2 3.2-1 5.4-.4',
    thin('M9 17.6v1.6M14 17.6v1.6', 1.2),
  ],
  deer: [
    ...sym([
      'M10.2 8.6 9.4 5 7.2 2.6M9.7 6.4 6.8 5.8M9.5 5.2l.8-2.6',
      soft('M9.4 9.6C7.4 10 5.4 9.4 4.6 8c1.6-.9 3.6-.8 5 .4Z'),
      'M9.4 9.6C7.4 10 5.4 9.4 4.6 8c1.6-.9 3.6-.8 5 .4Z',
      dot(10.3, 12, 0.7),
    ]),
    soft('M9 8.6c1.8-.7 4.2-.7 6 0l-.6 7c-.3 3-1.2 5.2-2.4 5.2s-2.1-2.2-2.4-5.2Z'),
    'M9 8.6c1.8-.7 4.2-.7 6 0l-.6 7c-.3 3-1.2 5.2-2.4 5.2s-2.1-2.2-2.4-5.2Z',
    dot(12, 19.4, 1),
  ],
  paw: [
    hatch('M12 12.2c2.6 0 5.2 2.8 5.2 5.4 0 1.8-1.2 2.9-2.9 2.9-1 0-1.4-.5-2.3-.5s-1.3.5-2.3.5c-1.7 0-2.9-1.1-2.9-2.9 0-2.6 2.6-5.4 5.2-5.4Z'),
    'M12 12.2c2.6 0 5.2 2.8 5.2 5.4 0 1.8-1.2 2.9-2.9 2.9-1 0-1.4-.5-2.3-.5s-1.3.5-2.3.5c-1.7 0-2.9-1.1-2.9-2.9 0-2.6 2.6-5.4 5.2-5.4Z',
    ...sym([
      { e: [4.8, 11.2, 1.8, 2.3], tr: 'rotate(-25 4.8 11.2)', f: 'hatch' },
      ell(4.8, 11.2, 1.8, 2.3, 'rotate(-25 4.8 11.2)'),
      { e: [9.2, 6.4, 1.9, 2.5], tr: 'rotate(-10 9.2 6.4)', f: 'hatch' },
      ell(9.2, 6.4, 1.9, 2.5, 'rotate(-10 9.2 6.4)'),
    ]),
  ],
  // ───────────────────────── human body ─────────────────────────
  skeleton: [
    soft('M9.4 4.4a2.6 2.6 0 1 1 5.2 0c0 1-.4 1.6-1 2h-3.2c-.6-.4-1-1-1-2Z'),
    'M9.4 4.4a2.6 2.6 0 1 1 5.2 0c0 1-.4 1.6-1 2h-3.2c-.6-.4-1-1-1-2Z',
    dot(11, 4.4, 0.55),
    dot(13, 4.4, 0.55),
    'M12 6.4v9.2M7.6 8h8.8',
    thin('M12 9.6c-2.4 0-3.6.5-3.6 1.4M12 9.6c2.4 0 3.6.5 3.6 1.4M12 11.6c-2 0-3.2.4-3.2 1.2M12 11.6c2 0 3.2.4 3.2 1.2', 1),
    ...sym(['M7.6 8 6.6 13l-.8 4.2', 'M10.4 15.6 9.6 21.6']),
    'M9.4 15.6h5.2l-.6 1.8H10Z',
  ],
  tooth: [
    soft('M7.5 3.5c1.6 0 2.6.9 4.5.9s2.9-.9 4.5-.9c2.4 0 4 2 4 4.6 0 2.4-1.2 3.6-1.8 5.4H5.3C4.7 11.7 3.5 10.5 3.5 8.1c0-2.6 1.6-4.6 4-4.6Z'),
    'M7.5 3.5c1.6 0 2.6.9 4.5.9s2.9-.9 4.5-.9c2.4 0 4 2 4 4.6 0 2.6-1.4 4-2 6.4-.6 2.4-.6 6.5-2.2 6.5-1.8 0-1.6-4.6-4.3-4.6s-2.5 4.6-4.3 4.6c-1.6 0-1.6-4.1-2.2-6.5-.6-2.4-2-3.8-2-6.4 0-2.6 1.6-4.6 4-4.6Z',
    thin('M6.4 6.6c.6-.8 1.6-1.1 2.6-.8', 1),
  ],
  kidney: [
    soft('M13.6 4.2C9 2.4 4.4 5.2 4.4 11.2c0 5.4 3.2 9 7 9 3 0 4.2-2.2 3.2-4.4-.7-1.5-2-2.3-2-3.8 0-1.6 1.6-2.2 2.2-3.8.5-1.5 0-3.2-1.2-4Z'),
    'M13.6 4.2C9 2.4 4.4 5.2 4.4 11.2c0 5.4 3.2 9 7 9 3 0 4.2-2.2 3.2-4.4-.7-1.5-2-2.3-2-3.8 0-1.6 1.6-2.2 2.2-3.8.5-1.5 0-3.2-1.2-4Z',
    hatch('M13.4 9.6c-1.8 0-3.2 1-3.4 2.4-.2 1.4 1 2.6 2.8 2.8L14 13Z'),
    thin('M13.4 9.6c-1.8 0-3.2 1-3.4 2.4-.2 1.4 1 2.6 2.8 2.8', 1),
    thin('M10.4 10.6 8.6 9.2M10 12.4H7.8M10.6 14l-1.6 1.4', 1),
    'M13 14.8c1.6 1.2 2.6 3.6 2.6 7',
    thin('M13.4 9.4h5.4M13.2 11.2h6', 1.1),
  ],
  brain: [
    soft('M7 17.4C4.6 17.4 2.6 15.4 2.6 13 2.6 11.6 3.2 10.4 4 9.6 3.8 6.9 5.8 4.8 8.4 4.8 9.4 3.4 11 2.9 12.6 3.3 13.8 2.5 15.6 2.6 16.6 3.6 18.8 3.5 20.4 5 20.8 7 21.8 8 22 9.6 21.6 11.4 21 14.4 19.6 17.4 17.4 17.4Z'),
    'M7 17.4C4.6 17.4 2.6 15.4 2.6 13 2.6 11.6 3.2 10.4 4 9.6 3.8 6.9 5.8 4.8 8.4 4.8 9.4 3.4 11 2.9 12.6 3.3 13.8 2.5 15.6 2.6 16.6 3.6 18.8 3.5 20.4 5 20.8 7 21.8 8 22 9.6 21.6 11.4 21 14.4 19.6 17.4 17.4 17.4Z',
    hatch('M12.6 17.4c.4 1.8 1.8 2.8 3.4 2.6 1.4-.2 2.2-1.2 2.2-2.6Z'),
    'M12.6 17.4c.4 1.8 1.8 2.8 3.4 2.6 1.4-.2 2.2-1.2 2.2-2.6M11.6 17.4l.4 4.2',
    thin('M4 9.4c1.4-.2 2.6.6 2.8 2M8.6 4.4c0 1.4.8 2.4 2.2 2.6M12.8 3.2c-.6 1.6.2 3 1.6 3.4M17 3.6c-.4 1.4.4 2.8 2 3.2M20.6 8.6c-1.4 0-2.2 1-2.2 2.4M9.4 9.4c1.4-.6 3-.2 3.6 1.2M15 9c-.6 1.4 0 2.8 1.4 3.4M6.4 14.6c1-.8 2.6-.8 3.4.2M11.4 13.6c1 .6 2.4.4 3.2-.6M17.2 14.4c.6-.8 1.8-1 2.8-.6', 1),
  ],
  neuron: [
    ...[7.2, 10.8].map((r) => ({ e: [...polar(7, 7, r, 135), 1.9, 1.05] as const, tr: `rotate(45 ${pt(polar(7, 7, r, 135))})`, f: 'soft' as const })),
    `M${pt(polar(7, 7, 3.6, 135))}L${pt(polar(7, 7, 14, 135))}`,
    ...[7.2, 10.8].map((r) => ell(...polar(7, 7, r, 135), 1.9, 1.05, `rotate(45 ${pt(polar(7, 7, r, 135))})`, 1.2)),
    thin([122, 135, 148].map((a) => `M${pt(polar(7, 7, 14, 135))}L${pt(polar(7, 7, 16, a))}`).join(''), 1.1),
    ...[122, 135, 148].map((a) => dot(...polar(7, 7, 16.2, a), 0.65)),
    { d: [207, 279, 351, 63].map((a) => `M${pt(polar(7, 7, 3.6, a))}L${pt(polar(7, 7, 5.2, a))}`).join(''), w: 1.3 },
    thin([207, 279, 351, 63].map((a) => `M${pt(polar(7, 7, 5.2, a))}L${pt(polar(7, 7, 6.7, a - 20))}M${pt(polar(7, 7, 5.2, a))}L${pt(polar(7, 7, 6.7, a + 20))}`).join(''), 1),
    softC(7, 7, 3.6),
    circ(7, 7, 3.6),
    hatchC(7, 7, 1.5),
    circ(7, 7, 1.5, 1),
  ],
  baby: [
    softC(12, 13, 8),
    circ(12, 13, 8),
    'M12 5c-.6-1.6.4-3 1.8-2.6 1 .3 1 1.8-.2 2',
    thin('M8.2 12.4c.6.7 1.6.7 2.2 0M13.6 12.4c.6.7 1.6.7 2.2 0', 1.2),
    softC(7.6, 15.4, 1.3),
    softC(16.4, 15.4, 1.3),
    thin('M10.8 16.6c.7.6 1.7.6 2.4 0', 1.2),
  ],
  'first-aid': [
    'M9 4.5V2.8h6v1.7',
    'M5 4.5h14a2 2 0 0 1 2 2v12.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z',
    hatch('M10.2 8h3.6v3.2H17v3.6h-3.2V18h-3.6v-3.2H7v-3.6h3.2Z'),
    'M10.2 8h3.6v3.2H17v3.6h-3.2V18h-3.6v-3.2H7v-3.6h3.2Z',
  ],
  // ───────────────────────── genetics & evolution ─────────────────────────
  chromosome: [
    ...sym([
      soft(tube(chromLine, chromW)),
      tube(chromLine, chromW),
      thin(rungs(chromLine, chromW, [0.18, 0.3, 0.7, 0.86], 0.95), 1),
    ]),
    dot(12, 12, 1.2),
  ],
  pea: [
    soft('M2.5 11c5 1.6 14 1.6 19 0-3 6.4-15.6 6.6-19 0Z'),
    'M2.5 11c2.5 6.2 16 6.6 19 0',
    thin('M2.5 11c5 1.6 14 1.6 19 0', 1),
    soft('M2.5 11c3-4.4 13-6.4 19-4-5.6-.2-13.6 1.2-19 4Z'),
    'M2.5 11c3-4.4 13-6.4 19-4-5.6-.2-13.6 1.2-19 4Z',
    ...[6.4, 10.2, 14, 17.8].flatMap((x) => [hatchC(x, 11.4, 1.8), circ(x, 11.4, 1.8)]),
    'M2.5 11 1.2 9.2',
    thin('M21.5 7c.8-1 .6-2.4-.6-2.6-.9-.1-1.2.9-.6 1.4', 1),
  ],
  twins: [
    ...sym([
      softC(7.5, 6.6, 2.6),
      circ(7.5, 6.6, 2.6),
      soft('M3.8 21v-6.4a3.7 3.7 0 0 1 7.4 0V21Z'),
      'M3.8 21v-6.4a3.7 3.7 0 0 1 7.4 0V21',
      thin('M11.2 15.6H12', 1.4),
    ]),
  ],
  fossil: [
    soft('M3.5 8.6 7.4 3.6h9.2l4.6 4.2.9 8-3.8 4.8H7.4l-4.6-3.8Z'),
    thin('M3.5 8.6 7.4 3.6h9.2l4.6 4.2.9 8-3.8 4.8H7.4l-4.6-3.8Z', 1.1),
    line(fossilSpiral),
    thin(ammoniteRibs, 0.8),
  ],
  soil: [
    hatch('M2.5 10h19v4.4c-3.2.6-6.3-.6-9.5 0s-6.3-.6-9.5 0Z'),
    'M2.5 10h19v11.5h-19Z',
    'M2.5 14.4c3.2-.6 6.3.6 9.5 0s6.3-.6 9.5 0',
    thin('M2.5 18.2c3.2.6 6.3-.6 9.5 0s6.3.6 9.5 0', 1),
    circ(6, 16.2, 0.8, 1),
    circ(11, 16.6, 0.6, 1),
    circ(16.6, 16, 0.9, 1),
    dot(5, 20, 0.45),
    dot(9.4, 19.8, 0.45),
    dot(13.8, 20.2, 0.45),
    dot(18.4, 19.8, 0.45),
    'M12 10V6',
    soft('M12 6.6c-.8-1.8-2.4-2.6-4.2-2.2.4 1.8 2.2 2.6 4.2 2.2ZM12 6c.8-1.8 2.4-2.6 4.2-2.2-.4 1.8-2.2 2.6-4.2 2.2Z'),
    'M12 6.6c-.8-1.8-2.4-2.6-4.2-2.2.4 1.8 2.2 2.6 4.2 2.2ZM12 6c.8-1.8 2.4-2.6 4.2-2.2-.4 1.8-2.2 2.6-4.2 2.2Z',
  ],
  // ───────────────────────── ecology ─────────────────────────
  'food-chain': [
    soft('M1.8 21.4c-.4-4 2.4-7 7-7 0 4.4-2.8 7.2-7 7Z'),
    'M1.8 21.4c-.4-4 2.4-7 7-7 0 4.4-2.8 7.2-7 7Z',
    thin('M1.8 21.4l4.8-4.8', 1),
    ...[14.6, 16.8, 19].map((x) => softC(x, 19.6, 1.2)),
    ...[14.6, 16.8, 19].map((x) => circ(x, 19.6, 1.2, 1.3)),
    circ(21.2, 18.6, 1.4, 1.3),
    thin('M21.6 17.2l.6-1.4', 1),
    'M5.8 9.6l2.6-1.3c-.1-2.2 1.3-3.8 3.4-3.8.3-1.1 1.1-1.8 2.2-1.8 1.2 0 2 .9 2 2l1.6.5-1.6.5c-.2 2.8-2.1 4.6-4.8 4.6-.9 0-1.7-.2-2.4-.5Z',
    dot(14.6, 4.6, 0.6),
    { d: arrow(9.6, 18.8, 12.4, 18.8, 1.5, 1.1), w: 1.3 },
    { d: arrow(16.4, 16, 14.6, 12.4, 1.5, 1.1), w: 1.3 },
  ],
  forest: [
    soft('M6.2 9.2a3.6 3.6 0 0 1 3.5 2.8 3.2 3.2 0 0 1-.6 6.2H3.4a3.2 3.2 0 0 1-.7-6.2 3.6 3.6 0 0 1 3.5-2.8Z'),
    hatch(conifer(13, 2.5, 15.5)),
    conifer(13, 2.5, 15.5),
    'M6.2 9.2a3.6 3.6 0 0 1 3.5 2.8 3.2 3.2 0 0 1-.6 6.2H3.4a3.2 3.2 0 0 1-.7-6.2 3.6 3.6 0 0 1 3.5-2.8Z',
    conifer(19, 8.5, 10.5),
    'M6.2 18.2v2.8M13 18v3M19 19v2',
    'M1.5 21h21',
  ],
  pond: [
    hatch('M2 17.4a10 3.6 0 0 0 20 0 10 3.6 0 0 0-20 0Z'),
    ell(12, 17.4, 10, 3.6),
    { d: 'M6 16.8V4.4M8.8 16.2V7.6', w: 1.2 },
    { e: [6, 8.4, 1.2, 2.6], f: 'solid' },
    { e: [8.8, 10.6, 1.1, 2.1], f: 'solid' },
    { d: 'M4.4 16.8C4.2 13.4 3.4 11 2 9.4M10.6 16c.2-3.2 1.4-5.6 3.4-7', w: 1.1 },
    soft('M14.6 17.2c0-1.2 1.6-2 3.6-2s3.6.8 3.6 2-1.6 2-3.6 2l-1-1.8-.2 1.7c-1.4-.2-2.4-1-2.4-1.9Z'),
    'M14.6 17.2c0-1.2 1.6-2 3.6-2s3.6.8 3.6 2-1.6 2-3.6 2l-1-1.8-.2 1.7c-1.4-.2-2.4-1-2.4-1.9Z',
    thin('M8.6 19.4c1.2.4 2.6.4 3.8 0', 1),
  ],
  'family-tree': [
    'M3.8 2.8h4.4v4.4H3.8Z',
    circ(18, 5, 2.2),
    'M8.2 5h7.6M12 5v6M5 11h14M5 11v3.6M12 11v3.6M19 11v3.6',
    'M2.8 14.6h4.4V19H2.8Z',
    hatchC(12, 16.8, 2.2),
    circ(12, 16.8, 2.2),
    'M16.8 14.6h4.4V19h-4.4Z',
  ],
  'cell-division': [
    soft('M12 9.4c-1.4-2.4-3.6-3.8-5.6-3.6-3 .3-4.9 3.1-4.9 6.2s1.9 5.9 4.9 6.2c2 .2 4.2-1.2 5.6-3.6 1.4 2.4 3.6 3.8 5.6 3.6 3-.3 4.9-3.1 4.9-6.2s-1.9-5.9-4.9-6.2c-2-.2-4.2 1.2-5.6 3.6Z'),
    'M12 9.4c-1.4-2.4-3.6-3.8-5.6-3.6-3 .3-4.9 3.1-4.9 6.2s1.9 5.9 4.9 6.2c2 .2 4.2-1.2 5.6-3.6 1.4 2.4 3.6 3.8 5.6 3.6 3-.3 4.9-3.1 4.9-6.2s-1.9-5.9-4.9-6.2c-2-.2-4.2 1.2-5.6 3.6Z',
    hatchC(6.8, 12, 2),
    circ(6.8, 12, 2, 1.2),
    hatchC(17.2, 12, 2),
    circ(17.2, 12, 2, 1.2),
    thin('M12 2v3.6M10.8 4.4 12 5.6l1.2-1.2M12 22v-3.6M10.8 19.6l1.2-1.2 1.2 1.2', 1.1),
  ],
  'gene-scissors': [
    helixY(1.5, gapTop, 0.3),
    helixY(gapBot, 22.5, 0.3 + ((gapBot - 1.5) / 10) * 2 * Math.PI),
    thin(helixY(1.5, gapTop, 0.3 + Math.PI) + helixY(gapBot, 22.5, 0.3 + Math.PI + ((gapBot - 1.5) / 10) * 2 * Math.PI), 1.1),
    thin(rungsDNA(2.4, gapTop - 0.6) + rungsDNA(gapBot + 0.8, 21.8), 0.9),
    softC(18.8, 7.8, 2.4),
    softC(18.8, 16.2, 2.4),
    circ(18.8, 7.8, 2.4),
    circ(18.8, 16.2, 2.4),
    'M17.2 14.4 13 12 8.6 9.6l3.2 3ZM17.2 9.6 13 12l-4.4 2.4 3.2-3Z',
    dot(13, 12, 0.7),
  ],
}
