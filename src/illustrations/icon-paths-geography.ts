/**
 * Geography icons (24×24, engraving style, same conventions as icon-paths.ts).
 *
 * The small shape helpers are re-declared here instead of imported: icon-paths.ts
 * imports this module at load time, so a runtime import back would be a cycle.
 * Only types are imported from icon-paths.ts.
 */
import type { IconDef, IconShape } from './icon-paths'
import type { ChemIcon } from './catalog'

const soft = (d: string): IconShape => ({ d, f: 'soft' })
const hatch = (d: string): IconShape => ({ d, f: 'hatch' })
const solid = (d: string): IconShape => ({ d, f: 'solid' })
const thin = (d: string, w = 1): IconShape => ({ d, w })
const circ = (x: number, y: number, r: number, w?: number): IconShape => ({ c: [x, y, r], w })
const dot = (x: number, y: number, r = 0.9): IconShape => ({ c: [x, y, r], f: 'solid' })
const softC = (x: number, y: number, r: number): IconShape => ({ c: [x, y, r], f: 'soft' })
const hatchC = (x: number, y: number, r: number): IconShape => ({ c: [x, y, r], f: 'hatch' })
const ell = (x: number, y: number, rx: number, ry: number, tr?: string, w?: number): IconShape => ({ e: [x, y, rx, ry], tr, w })
const dashed = (d: string, dash = '1.6 2', w = 1.2): IconShape => ({ d, dash, w })

/** apply an SVG transform to a group of shapes */
function group(t: string, shapes: IconDef): IconShape[] {
  return shapes.map((s) => (typeof s === 'string' ? { d: s, tr: t } : { ...s, tr: s.tr ? `${t} ${s.tr}` : t }))
}
/** rotate a group of shapes around (cx, cy) */
const rot = (deg: number, shapes: IconDef, cx = 12, cy = 12) => group(`rotate(${deg} ${cx} ${cy})`, shapes)
/** repeat shapes rotated n times around (cx, cy) */
function spin(n: number, shapes: IconDef, cx = 12, cy = 12, offset = 0): IconShape[] {
  const out: IconShape[] = []
  for (let i = 0; i < n; i++) out.push(...rot(offset + (360 / n) * i, shapes, cx, cy))
  return out
}
/** the same shapes plus their mirror image across the vertical line x = 12 */
function sym(shapes: IconDef): IconShape[] {
  return [...shapes.map((s) => (typeof s === 'string' ? { d: s } : s)), ...group('matrix(-1 0 0 1 24 0)', shapes)]
}

const r2 = (n: number) => +n.toFixed(2)
type Pt = readonly [number, number]
const pt = (p: Pt) => `${r2(p[0])} ${r2(p[1])}`
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
/** the two edges of a band of half-width w(t) along a centre line, plus the closed area between them */
function band(pts: Pt[], w: (t: number) => number) {
  const n = pts.length - 1
  const left: Pt[] = []
  const right: Pt[] = []
  pts.forEach((p, i) => {
    const [nx, ny] = normal(pts, i)
    const h = w(i / n)
    left.push([p[0] + nx * h, p[1] + ny * h])
    right.push([p[0] - nx * h, p[1] - ny * h])
  })
  return { left: line(left), right: line(right), area: `${line(left)}L${right.slice().reverse().map(pt).join('L')}Z` }
}
/** short cross-strokes over a band at the given t values (trunk rings) */
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
/** a gentle wave line from x0 to x1 at height y (crest height a, wavelength l) */
function waves(x0: number, x1: number, y: number, l = 3.4, a = 0.8): string {
  let d = `M${x0} ${y}`
  const n = Math.max(1, Math.round((x1 - x0) / l))
  const h = (x1 - x0) / n
  for (let i = 0; i < n; i++) d += `q${r2(h / 4)} ${-a} ${r2(h / 2)} 0t${r2(h / 2)} 0`
  return d
}

export type GeographyIcon = Extract<ChemIcon, 'globe' | 'map' | 'pin' | 'signpost' | 'layers' | 'moon' | 'calendar' | 'quake' | 'canyon' | 'cave' | 'river' | 'glacier' | 'cliff' | 'dune' | 'tornado' | 'snowflake' | 'island' | 'people' | 'house' | 'city' | 'flag' | 'border' | 'wheat' | 'tractor' | 'pickaxe' | 'container' | 'train' | 'plane' | 'suitcase' | 'handshake' | 'speech' | 'castle' | 'tent' | 'crown' | 'shield' | 'palm' | 'penguin' | 'binoculars' | 'clipboard' | 'dam' | 'hourglass' | 'footprints'>

// ── shared geometry ──
/** a meandering river flowing down the icon, three tight bends */
const riverLine: Pt[] = [
  ...bez([6.4, 0.5], [18, 1.8], [19.6, 8.6], [12, 9.4], 12),
  ...bez([12, 9.4], [4, 10.2], [3.6, 15.4], [11.4, 16], 12).slice(1),
  ...bez([11.4, 16], [19.2, 16.6], [19.6, 22.6], [11.8, 23.6], 10).slice(1),
]
const river = band(riverLine, () => 1.8)
/** outer bank of each bend (eroded, engraved bank line) */
const riverBanks = [riverLine.slice(3, 11), riverLine.slice(28, 34)].map((p) => band(p, () => 3.3).right).join('') + band(riverLine.slice(15, 23), () => 3.3).left
const palmTrunk = bez([13.4, 21.5], [13.6, 16.5], [12.6, 11.5], [10.8, 7.8], 14)
const palmW = (t: number) => 1.15 - 0.4 * t
const palmLeaves = [
  'M11 7.6C8.6 5.6 5 5.6 2.6 8.8 5.4 7.6 8.2 7.8 11 7.6Z',
  'M11 7.6c2.6-2.4 6.6-2.4 9.2 1.2-3-1.2-6.2-1.4-9.2-1.2Z',
  'M11 7.6C9.8 4.8 7.4 3 4.4 2.8 7 4.4 9 5.8 11 7.6Z',
  'M11 7.6c1-2.8 3.6-4.6 6.8-4.8-2.6 1.4-4.8 3-6.8 4.8Z',
  'M11 7.6c-2.2.4-4 2.2-4.6 5 1.2-2 2.8-3.6 4.6-5Z',
  'M11 7.6c2.2.8 3.8 2.8 4 5.6-1-2-2.4-3.8-4-5.6Z',
]
/** a bare footprint: sole + five toes, heel at the origin, toes towards −y */
const footSole = 'M0 0c-1.5 0-2.2-1.2-2-2.8.2-1.6.1-2.8-.2-4.2-.3-1.6.6-3 2.2-3s2.6 1.2 2.4 2.8c-.2 1.5-.7 2.8-.4 4.4.3 1.6-.4 2.8-2 2.8Z'
function foot(x: number, y: number, a: number, mirror = false): IconShape[] {
  const t = `translate(${x} ${y}) rotate(${a})${mirror ? ' scale(-1 1)' : ''}`
  return group(t, [
    soft(footSole),
    footSole,
    dot(-1.4, -11.4, 0.85),
    dot(0.3, -12.1, 0.62),
    dot(1.6, -11.8, 0.55),
    dot(2.6, -11, 0.5),
    dot(3.2, -9.9, 0.45),
  ])
}

export const GEOGRAPHY_ICON_PATHS: Record<GeographyIcon, IconDef> = {
  // ───────────────────────── maps & orientation ─────────────────────────
  globe: [
    softC(12, 9.5, 6.5),
    hatch('M12 3a6.5 6.5 0 0 0 0 13 3.6 6.5 0 0 1 0-13Z'),
    circ(12, 9.5, 6.5),
    ell(12, 9.5, 2.8, 6.5, undefined, 1),
    thin('M5.5 9.5h13M6.5 6h11M6.5 13h11', 1),
    'M12 1.1a8.4 8.4 0 0 1 0 16.8',
    'M12 17.9v2.8M8.2 21.2h7.6',
  ],
  map: [
    hatch('M9 4l6 2.5V20L9 17.5Z'),
    'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z',
    'M9 4v13.5M15 6.5V20',
    dashed('M5 16.2c1.6-2.8 3.4-3.4 5.2-2.6s3.2.2 4.4-1.8 2.4-3 3.8-3.2', '1.4 1.4', 1.1),
    'M17.2 7.2l1.8 1.8M19 7.2l-1.8 1.8',
  ],
  pin: [
    thin('M7.5 20.6c0 .7 2 1.3 4.5 1.3s4.5-.6 4.5-1.3-2-1.3-4.5-1.3-4.5.6-4.5 1.3Z', 1),
    soft('M12 20.6c-4-4.6-6.5-8.2-6.5-11.6a6.5 6.5 0 0 1 13 0c0 3.4-2.5 7-6.5 11.6Z'),
    'M12 20.6c-4-4.6-6.5-8.2-6.5-11.6a6.5 6.5 0 0 1 13 0c0 3.4-2.5 7-6.5 11.6Z',
    hatchC(12, 9, 2.4),
    circ(12, 9, 2.4),
  ],
  signpost: [
    'M12 2.6V21.4M8.4 21.4h7.2',
    hatch('M15.4 4.4h3l2.4 2.3-2.4 2.3h-3Z'),
    'M4.6 4.4h13.8l2.4 2.3-2.4 2.3H4.6Z',
    hatch('M8.6 11h-3l-2.4 2.3 2.4 2.3h3Z'),
    'M19.4 11H5.6l-2.4 2.3 2.4 2.3h13.8Z',
    thin('M6.4 6.7h4M14 13.3h3.6', 1),
  ],
  layers: [
    soft('M12 3.5 21 8l-9 4.5L3 8Z'),
    'M12 3.5 21 8l-9 4.5L3 8Z',
    thin('M8.4 8.2c1.4-1 2.6-.4 3.6.4s2.4.9 3.6-.4', 1),
    hatch('M3 12l9 4.5 9-4.5-2.6-1.3L12 14l-6.4-3.3Z'),
    'M5.6 10.7 3 12l9 4.5 9-4.5-2.6-1.3',
    'M5.6 14.7 3 16l9 4.5 9-4.5-2.6-1.3',
  ],
  // ───────────────────────── Earth in space & time ─────────────────────────
  moon: [
    soft('M13.6 2.8A9.2 9.2 0 1 0 21 15.6 7.4 7.4 0 0 1 13.6 2.8Z'),
    'M13.6 2.8A9.2 9.2 0 1 0 21 15.6 7.4 7.4 0 0 1 13.6 2.8Z',
    circ(7.6, 11, 1.4, 1),
    circ(10.4, 16.8, 1, 1),
    circ(6.4, 15.6, 0.6, 1),
    dot(19.4, 4.4, 0.6),
    thin('M17.6 9.2v2.4M16.4 10.4h2.4', 1),
  ],
  calendar: [
    hatch('M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5V9.5h-17Z'),
    'M5 5h14a1.5 1.5 0 0 1 1.5 1.5V19.5A1.5 1.5 0 0 1 19 21H5a1.5 1.5 0 0 1-1.5-1.5V6.5A1.5 1.5 0 0 1 5 5Z',
    'M3.5 9.5h17M8 2.8v4.4M16 2.8v4.4',
    dot(7.6, 13, 0.85),
    dot(12, 13, 0.85),
    dot(16.4, 13, 0.85),
    dot(7.6, 17, 0.85),
    dot(12, 17, 0.85),
    softC(16.4, 17, 2),
    circ(16.4, 17, 2, 1.2),
  ],
  // ───────────────────────── landforms & forces ─────────────────────────
  quake: [
    { d: 'M2 8H6.5L7.5 6.4 8.5 9.8 9.7 3 11.1 12.6 12.5 4.4 13.7 10 14.7 7 15.5 8.4 16.3 8H22', w: 1.4 },
    hatch('M2 16.6h9.6l-1 1.9 1.6 1.4-.8 1.8H2ZM22 15.2H11.6v1.4l-1 1.9 1.6 1.4-.8 1.8H22Z'),
    'M2 16.6h9.6M11.6 15.2H22M11.6 15.2v1.4l-1 1.9 1.6 1.4-.8 1.8',
  ],
  canyon: [
    soft('M2 5.5h4.6l.6 3.1 1.2.8.6 3.6 1 .8.6 7.2H2Z'),
    hatch('M22 5.5h-4.6l-.6 3.1-1.2.8-.6 3.6-1 .8-.6 7.2H22Z'),
    soft('M10.6 18.4h2.8l.2 3h-3.2Z'),
    'M1.6 5.5h5l.6 3.1 1.2.8.6 3.6 1 .8.6 7.6M22.4 5.5h-5l-.6 3.1-1.2.8-.6 3.6-1 .8-.6 7.6',
    thin('M2 12.6h5.6M18 12.6h4', 1),
    thin('M10.8 19.6c.4.4.8-.4 1.2 0s.8.4 1.2 0', 0.9),
  ],
  cave: [
    soft('M7 21v-5a5 5 0 0 1 10 0v5Z'),
    'M1.5 21c1-6 3.6-12.6 7.4-15 2.2-1.4 4.6-1.6 6.6-.4 4 2.4 6.2 8.4 7 15.4',
    'M1.5 21h21',
    'M7 21v-5a5 5 0 0 1 10 0v5',
    solid('M8.4 12.9l.9 2.9.7-3.9ZM11.1 11.1l.9 3.7.9-3.7ZM14 11.9l.7 3.9.9-2.9Z'),
    solid('M10 21l.7-2.6.7 2.6ZM13.2 21l.5-1.8.5 1.8Z'),
    thin('M4.6 15.4l1.4-.6M18 9.8l1.2.8M9.6 6.6l1.4-.4', 1),
  ],
  river: [
    soft(river.area),
    river.left,
    river.right,
    thin(riverBanks, 1),
    dot(8.6, 5.6, 0.5),
    dot(10, 4.8, 0.5),
    dot(14.4, 12.6, 0.5),
    dot(15.8, 13.4, 0.5),
    dot(8.4, 19.6, 0.5),
    dot(9.6, 20.6, 0.5),
  ],
  glacier: [
    hatch('M1.5 16.5 6.4 4.4l1.4 2.4L4.2 16.5ZM22.5 16.5 18 3.6l-1.4 2.6 3.2 10.3Z'),
    'M1.5 16.5 6.4 4.4l3.2 5.2M14.4 9.6 18 3.6l4.5 12.9',
    thin('M4.8 8.4l1.4-.8 1.2 1.2M15.8 7.4l1.6-1 1.2 1.2', 1),
    soft('M9.6 9.6c1.6-.6 3.2-.6 4.8 0 .8 4.4 2.2 8 4 11.4H5.6c1.8-3.4 3.2-7 4-11.4Z'),
    'M5.6 21c1.8-3.4 3.2-7 4-11.4 1.6-.6 3.2-.6 4.8 0 .8 4.4 2.2 8 4 11.4Z',
    thin('M9.6 13.4c1.6.8 3.2.8 4.8 0M8.4 17c2.2 1 5 1 7.2 0', 1),
  ],
  cliff: [
    hatch('M2 5h7.5l.8 2.4-.9 2.6 1.4 2.4-.6 3 1 2.6H2Z'),
    'M2 5h7.5l.8 2.4-.9 2.6 1.4 2.4-.6 3 1 2.6',
    'M1.6 5h8.4',
    waves(11.2, 22, 18, 3.6),
    waves(2, 22, 21.2, 3.4),
    dot(12.4, 15.8, 0.5),
    dot(13.6, 16.6, 0.45),
    thin('M15 8c.8-.9 1.6-.9 2 0 .4-.9 1.2-.9 2 0', 1),
  ],
  dune: [
    soft('M16.6 8.2c2 1.8 3.8 4.6 5.4 8.2h-4.6c.2-3 0-5.6-.8-8.2Z'),
    hatch('M11.6 11.6c2.6 2 4.6 4.8 6.2 8.4h-5.4c.2-3.2 0-5.8-.8-8.4Z'),
    'M8.6 13.6c2.6-3 5.2-4.8 8-5.4 2 1.8 3.8 4.6 5.4 8.2',
    'M2 20c2.6-4 6.2-7.2 9.6-8.4 2.6 2 4.6 4.8 6.2 8.4',
    'M1.5 20h21',
    thin('M4.6 18c1.2-1.2 2.6-2 4-2.4M7.4 19.2c1-.8 2.2-1.4 3.4-1.6', 1),
    hatchC(5.6, 5.6, 2),
    circ(5.6, 5.6, 2, 1.3),
  ],
  // ───────────────────────── weather & climate ─────────────────────────
  tornado: [
    soft('M3 4.2C7 6 17 6 21 4.2 19.6 9 16 12.6 13.4 16.4c-.8 1.4-1.2 3-1 5.2-1.6-2.4-2-4.6-1.6-6.4C8 12 4.4 9 3 4.2Z'),
    ell(12, 4.2, 9, 1.6),
    'M4.8 8.4c3.8 1.2 10.6 1.2 14.4 0',
    'M7.4 12c2.6.8 6.6.8 9-.2',
    'M9.8 15.4c1.4.4 2.8.4 4-.2',
    'M3 4.2C4.4 9 8 12 10.8 15.2c-.4 1.8 0 4 1.6 6.4-.2-2.2.2-3.8 1-5.2C16 12.6 19.6 9 21 4.2',
    dot(17.6, 18.4, 0.6),
    dot(19.4, 15.6, 0.5),
    dot(6.4, 17.4, 0.5),
  ],
  snowflake: [
    ...spin(6, ['M12 10V2.6', thin('M12 5.6 9.9 3.9M12 5.6l2.1-1.7M12 8.2 10.2 6.8M12 8.2l1.8-1.4', 1.1)]),
    hatch('M12 9.7 14 10.85v2.3L12 14.3l-2-1.15v-2.3Z'),
    'M12 9.7 14 10.85v2.3L12 14.3l-2-1.15v-2.3Z',
  ],
  island: [
    soft('M5 18.6c1.6-2.8 4-4 7-4s5.4 1.2 7 4Z'),
    'M5 18.6c1.6-2.8 4-4 7-4s5.4 1.2 7 4',
    'M2 18.6h3M19 18.6h3',
    waves(3, 21, 21.4, 3),
    'M13 15c.4-3.6-.4-6.6-2.4-8.8',
    soft('M10.6 6.2C8.6 4.4 5.6 4.6 3.6 7c2.4-.8 4.8-.8 7-.8ZM10.6 6.2c2.2-2 5.4-2 7.6.8-2.6-.8-5-1-7.6-.8ZM10.6 6.2c-.4-1.8.4-3.4 2.4-4.2-.8 1.4-1.4 2.6-2.4 4.2Z'),
    'M10.6 6.2C8.6 4.4 5.6 4.6 3.6 7c2.4-.8 4.8-.8 7-.8ZM10.6 6.2c2.2-2 5.4-2 7.6.8-2.6-.8-5-1-7.6-.8ZM10.6 6.2c-.4-1.8.4-3.4 2.4-4.2-.8 1.4-1.4 2.6-2.4 4.2Z',
  ],
  // ───────────────────────── people & settlements ─────────────────────────
  people: [
    ...sym([
      circ(5.6, 7.4, 2.1),
      'M1.8 17.4v-2a3.8 3.8 0 0 1 6-3.1',
    ]),
    softC(12, 8.4, 2.7),
    circ(12, 8.4, 2.7),
    soft('M6.6 21v-2.6a5.4 5.4 0 0 1 10.8 0V21Z'),
    'M6.6 21v-2.6a5.4 5.4 0 0 1 10.8 0V21',
  ],
  house: [
    hatch('M12 4.6 18.8 10.4H5.2Z'),
    'M2.5 11.6 12 3.5l9.5 8.1',
    'M16.2 6.4V3.6h2.4v4.9',
    'M5 9.8V21h14V9.8',
    'M1.8 21h20.4',
    soft('M13.4 21v-5.6h3.4V21Z'),
    'M13.4 21v-5.6h3.4V21',
    'M7 13.4h3.4v3.4H7Z',
    thin('M8.7 13.4v3.4M7 15.1h3.4', 1),
  ],
  city: [
    hatch('M10 4.4h2.6V21H10Z'),
    'M7.4 21V4.4h5.2V21',
    'M10 4.4V1.8',
    'M2.6 21V10.6h4.8',
    'M12.6 8.6h4.4V21',
    'M17 13h4.4V21',
    'M1.6 21h20.8',
    thin('M4.2 13h1.6M4.2 15.6h1.6M4.2 18.2h1.6M14 11.4h1.6M14 14h1.6M14 16.6h1.6M18.4 15.6h1.6M18.4 18.2h1.6M8.6 7.4h.6M8.6 10h.6M8.6 12.6h.6M8.6 15.2h.6', 1),
  ],
  flag: [
    soft('M5.4 4.2c2.4-1.2 4.6-1.2 7 0s4.6 1.2 7 0v8.6c-2.4 1.2-4.6 1.2-7 0s-4.6-1.2-7 0Z'),
    hatch('M5.4 8.5c2.4-1.2 4.6-1.2 7 0s4.6 1.2 7 0v4.3c-2.4 1.2-4.6 1.2-7 0s-4.6-1.2-7 0Z'),
    'M5.4 4.2c2.4-1.2 4.6-1.2 7 0s4.6 1.2 7 0v8.6c-2.4 1.2-4.6 1.2-7 0s-4.6-1.2-7 0',
    thin('M5.4 8.5c2.4-1.2 4.6-1.2 7 0s4.6 1.2 7 0', 1),
    'M5.4 21.6V3',
    dot(5.4, 2.4, 1),
    'M3.2 21.6h4.4',
  ],
  border: [
    { d: 'M12 2.4v19.2', w: 1.3, dash: '3 1.6 .4 1.6' },
    hatch('M3.6 20.6V8.4l1.7-1.8L7 8.4v12.2Z'),
    'M3.6 20.6V8.4l1.7-1.8L7 8.4v12.2',
    soft('M17 20.6V8.4l1.7-1.8 1.7 1.8v12.2Z'),
    'M17 20.6V8.4l1.7-1.8 1.7 1.8v12.2',
    thin('M17 12.4h3.4M17 16.4h3.4', 1),
    'M1.6 20.6h20.8',
  ],
  // ───────────────────────── economy ─────────────────────────
  wheat: [
    'M12 21.6c0-5 .2-10.4 0-15.4',
    soft('M12 17.6c-2.2-.6-3.6-2.4-3.8-4.8 2 .6 3.4 2.4 3.8 4.8Z'),
    thin('M12 17.6c-2.2-.6-3.6-2.4-3.8-4.8 2 .6 3.4 2.4 3.8 4.8', 1),
    ...sym([
      { e: [10.2, 13.4, 1.2, 2.1], tr: 'rotate(-35 10.2 13.4)', f: 'hatch' },
      ell(10.2, 13.4, 1.2, 2.1, 'rotate(-35 10.2 13.4)', 1.2),
      { e: [10.2, 9.8, 1.2, 2.1], tr: 'rotate(-35 10.2 9.8)', f: 'hatch' },
      ell(10.2, 9.8, 1.2, 2.1, 'rotate(-35 10.2 9.8)', 1.2),
      thin('M9.2 8 7.2 4.6M9.2 11.6 6.4 8.6', 0.9),
    ]),
    { e: [12, 5.4, 1.1, 2], f: 'hatch' },
    ell(12, 5.4, 1.1, 2, undefined, 1.2),
    thin('M12 3.4V1.6', 0.9),
  ],
  tractor: [
    soft('M5.2 5.4h4.4l.9 5.6H5.2Z'),
    'M3.6 12V3.8h6.8l1.4 8.2',
    'M5.2 5.4h4.4l.9 5.6',
    'M11.4 12.2h8.4a1.2 1.2 0 0 1 1.2 1.2v3.2M3.2 12.2h8.2V16',
    'M17.6 12.2V8.4',
    thin('M17 7.6c.4-1 1.2-1.4 2.2-1.2', 1),
    hatchC(7.2, 16.6, 4.6),
    circ(7.2, 16.6, 4.6),
    circ(7.2, 16.6, 1.6, 1.2),
    circ(18.6, 18.6, 2.6),
    dot(18.6, 18.6, 0.8),
  ],
  pickaxe: rot(45, [
    soft('M11.1 6.6h1.8v14.8a.9.9 0 0 1-1.8 0Z'),
    'M11.1 6.6h1.8v14.8a.9.9 0 0 1-1.8 0Z',
    hatch('M2.2 8.6C5.6 4.4 8.6 2.8 12 2.8s6.4 1.6 9.8 5.8C18.4 6.8 15.2 6 12 6S5.6 6.8 2.2 8.6Z'),
    'M2.2 8.6C5.6 4.4 8.6 2.8 12 2.8s6.4 1.6 9.8 5.8C18.4 6.8 15.2 6 12 6S5.6 6.8 2.2 8.6Z',
    'M10.6 3.4h2.8v3.4h-2.8Z',
  ]),
  container: [
    soft('M2.5 8 6.5 5h14.5l-4 3Z'),
    hatch('M17 8l4-3v11l-4 3Z'),
    'M2.5 8 6.5 5h14.5v11l-4 3H2.5Z',
    'M2.5 8H17v11M17 8l4-3',
    thin('M4.6 9.6v7.8M6.8 9.6v7.8M9 9.6v7.8M11.2 9.6v7.8M13.4 9.6v7.8M15.4 9.6v7.8', 1),
  ],
  train: [
    soft('M7 5.8h10v5.4H7Z'),
    'M7 2.8h10a2.4 2.4 0 0 1 2.4 2.4V15a2.4 2.4 0 0 1-2.4 2.4H7A2.4 2.4 0 0 1 4.6 15V5.2A2.4 2.4 0 0 1 7 2.8Z',
    'M7 5.8h10v5.4H7Z',
    dot(8, 14.4, 1.1),
    dot(16, 14.4, 1.1),
    thin('M10.6 14.4h2.8', 1.2),
    'M7.6 17.4 5.4 21.6M16.4 17.4l2.2 4.2',
    thin('M6.6 19.4h10.8M4.6 21.6h14.8', 1),
  ],
  plane: rot(45, [
    soft('M12 2c1 0 1.6 1.2 1.6 2.6v4.8l7.6 4.6v2l-7.6-2.4v4.8l2.6 1.8v1.6L12 20.6l-4.2 1.2v-1.6l2.6-1.8v-4.8L2.8 16v-2l7.6-4.6V4.6C10.4 3.2 11 2 12 2Z'),
    'M12 2c1 0 1.6 1.2 1.6 2.6v4.8l7.6 4.6v2l-7.6-2.4v4.8l2.6 1.8v1.6L12 20.6l-4.2 1.2v-1.6l2.6-1.8v-4.8L2.8 16v-2l7.6-4.6V4.6C10.4 3.2 11 2 12 2Z',
  ]),
  suitcase: [
    'M9 7.6V5.2A1.2 1.2 0 0 1 10.2 4h3.6A1.2 1.2 0 0 1 15 5.2v2.4',
    soft('M4.2 7.6h15.6a1.6 1.6 0 0 1 1.6 1.6v9.6a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6V9.2a1.6 1.6 0 0 1 1.6-1.6Z'),
    'M4.2 7.6h15.6a1.6 1.6 0 0 1 1.6 1.6v9.6a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6V9.2a1.6 1.6 0 0 1 1.6-1.6Z',
    hatch('M6.4 7.6h2v12.8h-2ZM15.6 7.6h2v12.8h-2Z'),
    thin('M6.4 7.6v12.8M8.4 7.6v12.8M15.6 7.6v12.8M17.6 7.6v12.8', 1),
    'M5.4 20.4v1.2M18.6 20.4v1.2',
  ],
  // ───────────────────────── society & politics ─────────────────────────
  handshake: [
    hatch('M1.8 8.6 4.6 7.4l3.2 7.2-2.6 1.4Z'),
    'M1.8 8.6 4.6 7.4l3.2 7.2-2.6 1.4Z',
    hatch('M22.2 8.6l-2.8-1.2-3.2 7.2 2.6 1.4Z'),
    'M22.2 8.6l-2.8-1.2-3.2 7.2 2.6 1.4Z',
    'M17.6 9.4c-1.8-1.4-4.2-1.8-6-.6L8.4 11c-.9.7-.3 2.2.9 1.9l3.2-1.4',
    'M6.2 9.6c1.4-.6 2.6-.8 3.6-.4',
    'M7 15.2l3 2.6a1.1 1.1 0 0 0 1.6-1.6M9.8 16.4l2 1.8a1.1 1.1 0 0 0 1.6-1.6M12 15.6l1.8 1.6a1.1 1.1 0 0 0 1.6-1.6l-3-3M15.2 15.4l1.8-1.6',
  ],
  speech: [
    'M9.5 11.5H6.6L4 14v-2.5A1.5 1.5 0 0 1 2.5 10V4.5A1.5 1.5 0 0 1 4 3h9a1.5 1.5 0 0 1 1.5 1.5V9',
    thin('M5 6h7M5 8.4h3.6', 1),
    soft('M11 9h9a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5h-.6v3l-3-3H11A1.5 1.5 0 0 1 9.5 16v-5.5A1.5 1.5 0 0 1 11 9Z'),
    'M11 9h9a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5h-.6v3l-3-3H11A1.5 1.5 0 0 1 9.5 16v-5.5A1.5 1.5 0 0 1 11 9Z',
    dot(12.6, 13.2, 0.85),
    dot(15.5, 13.2, 0.85),
    dot(18.4, 13.2, 0.85),
  ],
  castle: [
    hatch('M9.6 21v-3.8a2.4 2.4 0 0 1 4.8 0V21Z'),
    'M2.5 21V4h1.7v1.6h1.6V4h1.7v6H9V8.6h1.6V10h2.8V8.6H15V10h1.5V4h1.7v1.6h1.6V4h1.7v17',
    'M9.6 21v-3.8a2.4 2.4 0 0 1 4.8 0V21',
    'M1.5 21h21',
    thin('M5 9v2.4M19 9v2.4M5 14v2.4M19 14v2.4', 1.2),
  ],
  tent: [
    soft('M12 4.6 21.4 20H2.6Z'),
    hatch('M12 9.6 9.2 20h5.6Z'),
    'M12 4.6 21.4 20H2.6Z',
    'M12 4.6v-2',
    'M12 9.6 9.2 20M12 9.6 14.8 20',
    thin('M12 4.6v5', 1),
    'M1.4 20h21.2',
  ],
  crown: [
    soft('M3.4 8.6 7.6 12.6 12 5.6l4.4 7 4.2-4-1.8 9.2H5.2Z'),
    'M3.4 8.6 7.6 12.6 12 5.6l4.4 7 4.2-4-1.8 9.2H5.2Z',
    hatch('M5.2 17.8h13.6v3H5.2Z'),
    'M5.2 17.8h13.6v3H5.2Z',
    dot(3.2, 7.4, 1.1),
    dot(12, 4.2, 1.1),
    dot(20.8, 7.4, 1.1),
    circ(12, 14.4, 1.3, 1.1),
  ],
  shield: [
    hatch('M12 2.6 4 5.6V11c0 5 3.4 8.6 8 10.4Z'),
    'M12 2.6l8 3V11c0 5-3.4 8.6-8 10.4C7.4 19.6 4 16 4 11V5.6Z',
    'M12 2.6v18.8',
    thin('M12 4.4l6.4 2.4V11c0 4-2.6 7-6.4 8.6', 1),
  ],
  // ───────────────────────── regions of the world ─────────────────────────
  palm: [
    soft(band(palmTrunk, palmW).area),
    band(palmTrunk, palmW).left,
    band(palmTrunk, palmW).right,
    thin(rungs(palmTrunk, palmW, [0.15, 0.3, 0.45, 0.6, 0.75]), 0.9),
    ...palmLeaves.map(soft),
    ...palmLeaves,
    hatchC(10, 9.2, 1),
    circ(10, 9.2, 1, 1.1),
    hatchC(12.2, 9.4, 1),
    circ(12.2, 9.4, 1, 1.1),
    'M7.4 21.6c2.6-1.2 9.6-1.2 12 0',
  ],
  penguin: [
    ...sym([
      hatch('M12 2.5c-3 0-4.6 2.4-4.6 5.4 0 .8-2.4 3.4-2.4 7.6 0 3.8 3 5.8 7 5.8v-.1c-2.4 0-4.2-1.4-4.2-3.8 0-2 .8-3.2.8-5.6 0-2.8 1.4-4.4 3.4-4.4Z'),
      'M12 2.5c-3 0-4.6 2.4-4.6 5.4 0 .8-2.4 3.4-2.4 7.6 0 3.8 3 5.8 7 5.8',
      thin('M12 7.4c-2 0-3.4 1.6-3.4 4.4 0 2.4-.8 3.6-.8 5.6 0 2.4 1.8 3.8 4.2 3.8', 1),
      'M6.2 10.6c-1.6 1.4-2.6 3.2-2.8 5.4',
      { d: 'M9 21.4h2', w: 1.8 },
      dot(10.4, 5.2, 0.75),
    ]),
    solid('M10.9 6.6h2.2l-1.1 1.6Z'),
  ],
  binoculars: [
    'M5.4 3.4h3v4.2h-3ZM15.6 3.4h3v4.2h-3Z',
    'M3.2 14.6 4.8 7.6h4.4l1 7M20.8 14.6l-1.6-7h-4.4l-1 7',
    'M10 10.6h4',
    hatchC(6.6, 16.4, 2.2),
    hatchC(17.4, 16.4, 2.2),
    circ(6.6, 16.4, 4),
    circ(17.4, 16.4, 4),
    circ(6.6, 16.4, 2.2, 1),
    circ(17.4, 16.4, 2.2, 1),
  ],
  // ───────────────────────── field work ─────────────────────────
  clipboard: [
    'M8.6 4H6a1.6 1.6 0 0 0-1.6 1.6v14.8A1.6 1.6 0 0 0 6 22h12a1.6 1.6 0 0 0 1.6-1.6V5.6A1.6 1.6 0 0 0 18 4h-2.6',
    hatch('M9 2.4h6v3.2H9Z'),
    'M9 2.4h6v3.2H9Z',
    { d: 'M7 10.2l1.2 1.2 2.2-2.4M7 14.6l1.2 1.2 2.2-2.4', w: 1.4 },
    thin('M12.2 10.4h4.8M12.2 14.8h4.8M12.2 19h4.8', 1.2),
    thin('M7.2 17.8h2.8v2.4H7.2Z', 1.1),
  ],
  dam: [
    soft('M2 8h7.6v13H2Z'),
    'M2 8c1.3-.8 2.5.8 3.8 0s2.5.8 3.8 0',
    thin(waves(2, 9.6, 12, 2.6, 0.6) + waves(2, 9.6, 16, 2.6, 0.6), 0.9),
    hatch('M9.6 4h3l5 17h-8Z'),
    'M9.6 21V4h3l5 17',
    soft('M17.6 18.8h4.4V21h-4Z'),
    'M17.2 18.8c1-.6 1.9.6 2.8 0s1.6-.4 2 0',
    'M1.5 21h21',
  ],
  hourglass: [
    'M5 2.5h14M5 21.5h14',
    'M7 2.5c0 4.6 4 6.2 4 9.5s-4 4.9-4 9.5M17 2.5c0 4.6-4 6.2-4 9.5s4 4.9 4 9.5',
    soft('M8.4 6.6h7.2c-.8 1.8-2.8 3-3.6 4.4-.8-1.4-2.8-2.6-3.6-4.4Z'),
    hatch('M7.4 21.4c.6-2.4 2.4-3.8 4.6-4.4 2.2.6 4 2 4.6 4.4Z'),
    thin('M12 11.4v5.6', 1),
  ],
  footprints: [...foot(8, 21, -8), ...foot(16.4, 13.4, 8, true)],
}
