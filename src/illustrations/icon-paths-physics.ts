/**
 * Physics icons (24×24, engraving style, same conventions as icon-paths.ts).
 *
 * The small shape helpers are re-declared here instead of imported: icon-paths.ts
 * imports this module at load time, so a runtime import back would be a cycle.
 * Only types are imported from icon-paths.ts.
 */
import type { IconDef, IconShape } from './icon-paths'

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

const r2 = (n: number) => +n.toFixed(2)
/** point at radius r, angle a (degrees clockwise from 12 o'clock) */
const polar = (cx: number, cy: number, r: number, a: number) => {
  const t = (a * Math.PI) / 180
  return `${r2(cx + r * Math.sin(t))} ${r2(cy - r * Math.cos(t))}`
}
/** annular sector between radii ri < ro, from angle a0 to a1 (clockwise, < 180°) */
const sector = (cx: number, cy: number, ri: number, ro: number, a0: number, a1: number) =>
  `M${polar(cx, cy, ro, a0)}A${ro} ${ro} 0 0 1 ${polar(cx, cy, ro, a1)}L${polar(cx, cy, ri, a1)}A${ri} ${ri} 0 0 0 ${polar(cx, cy, ri, a0)}Z`
/** straight arrow from (x1, y1) to (x2, y2) with an open head */
function arrow(x1: number, y1: number, x2: number, y2: number, head = 2.6, wing = 1.5) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const bx = x2 - ux * head
  const by = y2 - uy * head
  return `M${x1} ${y1}L${x2} ${y2}M${r2(bx - uy * wing)} ${r2(by + ux * wing)}L${x2} ${y2}L${r2(bx + uy * wing)} ${r2(by - ux * wing)}`
}
/**
 * Vertical helix around x = cx from y0 to y1: front half-turns get the main
 * stroke, back half-turns a thin one (engraved depth).
 */
function helix(cx: number, y0: number, y1: number, r: number, turns: number, tilt: number, backW = 0.9): (string | IconShape)[] {
  const steps = 10
  const front: string[] = []
  const back: string[] = []
  for (let h = 0; h < turns * 2; h++) {
    const pts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const t = Math.PI * (h + i / steps)
      const x = cx - r * Math.cos(t)
      const y = y0 + ((y1 - y0) * t) / (2 * Math.PI * turns) + tilt * Math.sin(t)
      pts.push(`${r2(x)} ${r2(y)}`)
    }
    ;(h % 2 === 0 ? front : back).push(`M${pts.join('L')}`)
  }
  return [thin(back.join(''), backW), front.join('')]
}
/** two-armed spiral (galaxy arms) as polylines */
function spiralArm(cx: number, cy: number, phase: number, a: number, b: number, tMax: number, squash: number) {
  const pts: string[] = []
  for (let i = 0; i <= 28; i++) {
    const t = (tMax * i) / 28
    const r = a + b * t
    pts.push(`${r2(cx + r * Math.cos(t + phase))} ${r2(cy + r * Math.sin(t + phase) * squash)}`)
  }
  return `M${pts.join('L')}`
}

export const PHYSICS_ICON_IDS = [
  'ruler', 'clock', 'weight', 'vector', 'lever', 'pulley', 'spring', 'pendulum', 'gauge', 'ship', 'feather', 'parachute',
  'rocket', 'planet', 'orbit', 'satellite', 'galaxy', 'telescope', 'microscope', 'lens', 'mirror', 'prism', 'rainbow',
  'eye', 'camera', 'laser', 'wave', 'sound', 'ear', 'music', 'compass', 'coil', 'motor', 'socket', 'solar-panel',
  'wind-turbine', 'radiation',
] as const
export type PhysicsIcon = (typeof PHYSICS_ICON_IDS)[number]

export const PHYSICS_ICON_PATHS: Record<PhysicsIcon, IconDef> = {
  // ───────────────────────── mechanics ─────────────────────────
  ruler: rot(-45, [
    soft('M1.5 13.2h21v1a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1Z'),
    'M2.5 8.8h19a1 1 0 0 1 1 1v4.4a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1V9.8a1 1 0 0 1 1-1Z',
    thin('M5 8.8v3.4M12 8.8v3.4M19 8.8v3.4'),
    thin('M8.5 8.8v2M15.5 8.8v2', 0.9),
  ]),
  clock: [
    soft('M2.8 7.2a3.4 3.4 0 0 1 4.4-4.4ZM21.2 7.2a3.4 3.4 0 0 0-4.4-4.4Z'),
    'M2.8 7.2a3.4 3.4 0 0 1 4.4-4.4ZM21.2 7.2a3.4 3.4 0 0 0-4.4-4.4Z',
    circ(12, 13, 7.6),
    'M6.8 19.2l-1.6 2.2M17.2 19.2l1.6 2.2',
    ...spin(12, [thin('M12 6.6v1', 1)], 12, 13),
    'M12 13V8.8M12 13l3 1.8',
    dot(12, 13, 1),
  ],
  weight: [
    soft('M7.6 20.5a6.8 6.8 0 1 1 8.8 0Z'),
    'M7.6 20.5a6.8 6.8 0 1 1 8.8 0Z',
    'M8.3 10.2 7.8 6.4A2.2 2.2 0 0 1 10 4h4a2.2 2.2 0 0 1 2.2 2.4l-.5 3.8',
    thin('M9.9 9.4 9.6 7A1 1 0 0 1 10.6 5.8h2.8a1 1 0 0 1 1 1.2l-.3 2.4', 0.9),
    { d: 'M9.6 12l1.3-1v4', w: 1.3 },
    ell(13.9, 13, 1.25, 2, undefined, 1.3),
    thin('M9.7 16.1v2.5M11.1 16.8l-1.4 1 1.5 .9', 0.9),
    thin('M14.1 16.6v1.8a.85.85 0 0 1-1.4.6M14.1 17.4a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z', 0.9),
  ],
  vector: [
    dashed('M14.6 19 19.5 6.5M9.5 6.5h8.5', '1.4 1.7', 1.1),
    arrow(2.5, 20.5, 13.6, 20.5),
    arrow(2.5, 20.5, 7.6, 7.5),
    { d: arrow(2.5, 20.5, 19.3, 7.1, 3, 1.8), w: 2 },
    dot(2.5, 20.5, 1.1),
  ],
  lever: [
    hatch('M12 13.2 8.2 20.5h7.6Z'),
    'M12 13.2 8.2 20.5h7.6Z',
    'M3 20.5h18',
    ...rot(14, [
      'M1.8 12h20.4',
      hatch('M3 7.2h4.4V12H3Z'),
      'M3 7.2h4.4V12H3Z',
      'M19.5 3.8v6.2M17.8 8.3l1.7 1.7 1.7-1.7',
    ], 12, 13),
    dot(12, 13.2, 0.9),
  ],
  pulley: [
    'M4.5 2.2h15',
    thin('M6 2.2 7.2 1M9.5 2.2 10.7 1M13 2.2 14.2 1M16.5 2.2 17.7 1', 0.9),
    'M12 2.2v2.4',
    softC(12, 8.6, 4),
    circ(12, 8.6, 4),
    dot(12, 8.6, 1),
    'M8 8.6v7.4M16 8.6v8.6',
    'M14.4 15.6 16 17.2l1.6-1.6',
    hatch('M5.4 16h5.2l.9 5.2H4.5Z'),
    'M5.4 16h5.2l.9 5.2H4.5Z',
  ],
  spring: [
    'M5 2.2h14',
    thin('M6.5 2.2 7.7 1M10 2.2 11.2 1M13.5 2.2 14.7 1M17 2.2 18.2 1', 0.9),
    'M12 2.2v2h-4.2',
    ...helix(12, 4.2, 15.4, 4.2, 3.5, 1.5),
    'M16.2 15.4H12V17',
    hatch('M8 17h8v4.5H8Z'),
    'M8 17h8v4.5H8Z',
  ],
  pendulum: [
    'M6 2.5h12',
    thin('M7.5 2.5 8.7 1.3M11 2.5l1.2-1.2M14.5 2.5l1.2-1.2', 0.9),
    thin('M12 2.5v16', 0.8),
    dashed('M3.31 18.83A18.5 18.5 0 0 0 20.69 18.83', '1.4 1.8', 1.1),
    dashed('M12 2.5 8.2 13', '1.2 1.5', 0.9),
    circ(7.21, 15.66, 2.7, 0.9),
    'M12 2.5 15.8 13',
    hatchC(16.79, 15.66, 2.7),
    circ(16.79, 15.66, 2.7),
    dot(12, 2.5, 1),
  ],
  gauge: [
    hatch(sector(12, 10.5, 5.4, 6.9, 75, 135)),
    circ(12, 10.5, 8.2),
    ...Array.from({ length: 10 }, (_, i) => thin(`M${polar(12, 10.5, 5.6, -135 + i * 30)}L${polar(12, 10.5, 6.9, -135 + i * 30)}`, 1)),
    'M12 10.5 8.6 7.1',
    dot(12, 10.5, 1.3),
    'M10.5 18.6v2.4h3v-2.4',
    'M9 21h6',
  ],
  ship: [
    hatch('M3.6 15.5h16.8l-1.7 3H5.3Z'),
    'M2.5 13h19l-2.8 5.5H5.3Z',
    'M6.5 13v-3h9.5v3',
    'M9.5 10V6h3v4',
    thin('M13.5 4.2c1.4-.8 1.2-2 2.6-2.4', 1),
    circ(9, 11.5, 0.6, 0.9),
    circ(11.3, 11.5, 0.6, 0.9),
    circ(13.6, 11.5, 0.6, 0.9),
    'M1.5 21.2c1.4 0 1.4-1 2.8-1s1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1',
  ],
  feather: [
    hatch('M20.5 3.5c-6.2.2-11.4 4.2-12.4 11l.8.7C12.2 11.6 16 7.6 20.5 3.5Z'),
    'M20.5 3.5c.6 6-3.6 11.4-10.8 12.6L7.6 16.6c-.5-.7-.4-1.4.5-2.1C9.1 7.7 14.3 3.7 20.5 3.5Z',
    'M3.5 20.5C9 15 14 9.5 20.5 3.5',
    thin('M15.8 12.4l-2.2-.6M18.4 8.8l-2.6-.4M12.2 15l-2-.8', 0.9),
    thin('M12.6 5.8l.6 2.4M9.8 9l.8 2.4', 0.9),
  ],
  parachute: [
    soft('M2.5 11a9.5 8 0 0 1 19 0c-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0Z'),
    'M2.5 11a9.5 8 0 0 1 19 0c-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0-1.6-1.2-3.2-1.2-4.75 0Z',
    thin('M12 3c-2.4 1.8-4 4.6-4.75 8M12 3v8M12 3c2.4 1.8 4 4.6 4.75 8', 0.9),
    thin('M2.5 11 10.2 17.5M7.25 11l3 6.5M16.75 11l-3 6.5M21.5 11l-7.7 6.5', 0.9),
    hatch('M10 17.5h4v3.8h-4Z'),
    'M10 17.5h4v3.8h-4Z',
  ],

  // ───────────────────────── space ─────────────────────────
  rocket: rot(45, [
    soft('M10.2 17.5h3.6L12 22Z'),
    thin('M10.2 17.5h3.6L12 22Z', 1),
    hatch('M12 2c1.6 1.3 2.7 3 3.3 5H8.7c.6-2 1.7-3.7 3.3-5Z'),
    'M12 2c3 2.5 4 6 4 10v5.5H8V12c0-4 1-7.5 4-10Z',
    circ(12, 10.2, 1.6),
    'M8 12.8 5 16.5v3l3-1.5M16 12.8l3 3.7v3l-3-1.5',
    thin('M8.7 7h6.6', 0.9),
  ]),
  planet: rot(-20, [
    softC(12, 12, 6),
    circ(12, 12, 6),
    thin('M6.8 9.2c3.2 1.1 7.2 1.1 10.4 0', 0.9),
    'M1.5 12A10.5 3 0 0 1 6.58 9.43M17.42 9.43A10.5 3 0 0 1 22.5 12',
    'M1.5 12a10.5 3 0 0 0 21 0',
    thin('M3.7 12a8.3 2.1 0 0 0 16.6 0', 0.9),
  ]),
  orbit: rot(-18, [
    hatchC(12, 12, 3.2),
    circ(12, 12, 3.2),
    { e: [12, 12, 10, 6], w: 1.2 },
    'M10.4 16.6 12.2 18l-1.8 1.4',
    softC(17, 6.8, 1.9),
    circ(17, 6.8, 1.9),
  ]),
  satellite: [
    ...rot(-35, [
      hatch('M1.5 10h5.5v4H1.5ZM17 10h5.5v4H17Z'),
      'M1.5 10h5.5v4H1.5ZM17 10h5.5v4H17Z',
      thin('M3.3 10v4M5.2 10v4M18.8 10v4M20.7 10v4', 0.9),
      'M7 12h2.5M14.5 12H17',
      'M9.5 9h5v6h-5Z',
      'M12 9V7.2',
      'M9.6 5.2a2.4 2.4 0 0 0 4.8 0Z',
    ]),
    thin('M17.6 3.2a3 3 0 0 1 3.2 3.2M17.4 1.2a5 5 0 0 1 5.4 5.4', 1),
  ],
  galaxy: rot(-25, [
    softC(12, 12, 3),
    spiralArm(12, 12, 0, 1.2, 2.3, 3.6, 0.72),
    spiralArm(12, 12, Math.PI, 1.2, 2.3, 3.6, 0.72),
    thin(spiralArm(12, 12, 0.9, 1.6, 1.9, 2.8, 0.72), 0.9),
    thin(spiralArm(12, 12, 0.9 + Math.PI, 1.6, 1.9, 2.8, 0.72), 0.9),
    dot(12, 12, 1.4),
    dot(3.2, 5.5, 0.55),
    dot(20.6, 17.8, 0.55),
    dot(19.5, 4.8, 0.45),
    dot(4.5, 18.5, 0.45),
  ]),
  telescope: [
    ...rot(-28, [
      hatch('M16.5 7.6h4v6.3h-4Z'),
      'M16.5 7.6h4v6.3h-4Z',
      'M6 8.8h10.5v3.9H6Z',
      'M3 9.7h3v2.1H3Z',
      thin('M9 8.8v3.9M13.5 8.8v3.9', 0.9),
    ], 12, 11),
    dot(11.6, 13, 1),
    'M11.6 13 7.2 21.5M11.6 13l4.4 8.5M11.6 13v8.5',
  ],
  microscope: [
    hatch('M5 21.5h14v-1.6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1Z'),
    'M5 21.5h14v-1.6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1Z',
    ...rot(-28, [
      'M8 3.5h3v8.5H8Z',
      'M7.2 3.5h4.6',
      'M8.7 12v1.8h1.6V12',
      thin('M8 6.5h3', 0.9),
    ], 9.5, 8),
    'M11.4 9.4c3.4.6 5.6 3.4 5.6 6.8v2.7',
    circ(11.9, 9.4, 1.1, 1.2),
    'M5 15.5h8.5',
    'M13.5 15.5v3.4',
  ],

  // ───────────────────────── light & optics ─────────────────────────
  lens: [
    soft('M12 3c2 3 2 15 0 18-2-3-2-15 0-18Z'),
    'M12 3c2 3 2 15 0 18-2-3-2-15 0-18Z',
    thin('M1.5 7h10.3l8.2 5M1.5 17h10.3l8.2-5M1.5 12H22', 1),
    thin('M4 5.6 5.4 7 4 8.4M4 15.6 5.4 17 4 18.4', 1),
    dot(20, 12, 1),
  ],
  mirror: [
    hatch('M2 16h20v2.8H2Z'),
    'M2 16h20',
    dashed('M12 16V3.5', '1.2 1.6', 1),
    arrow(3.5, 4.5, 11.6, 15.5),
    arrow(12.4, 15.5, 20.5, 4.5),
    thin('M9.8 13a3 3 0 0 1 2.2-.9M12 12.1a3 3 0 0 1 2.2.9', 0.9),
  ],
  prism: [
    soft('M12 3.5 20.5 19h-17Z'),
    'M12 3.5 20.5 19h-17Z',
    'M1.5 13.7 7.3 12',
    thin('M7.3 12l9.6.6', 1),
    'M16.9 12.6l5.6-1.6',
    thin('M16.9 12.6l5.6 1.8', 1),
    dashed('M16.9 12.6l5 5', '1.2 1.3', 1.1),
  ],
  rainbow: [
    hatch('M2.5 17a9.5 9.5 0 0 1 19 0h-2.8a6.7 6.7 0 0 0-13.4 0Z'),
    'M2.5 17a9.5 9.5 0 0 1 19 0',
    thin('M5.3 17a6.7 6.7 0 0 1 13.4 0', 1),
    'M8.1 17a3.9 3.9 0 0 1 7.8 0',
    soft('M1 21h5.6a1.8 1.8 0 0 0-.4-3.5 2.4 2.4 0 0 0-4.3 1A1.3 1.3 0 0 0 1 21ZM17.4 21H23a1.3 1.3 0 0 0-.9-2.5 2.4 2.4 0 0 0-4.3-1 1.8 1.8 0 0 0-.4 3.5Z'),
    'M1 21h5.6a1.8 1.8 0 0 0-.4-3.5 2.4 2.4 0 0 0-4.3 1A1.3 1.3 0 0 0 1 21ZM17.4 21H23a1.3 1.3 0 0 0-.9-2.5 2.4 2.4 0 0 0-4.3-1 1.8 1.8 0 0 0-.4 3.5Z',
  ],
  eye: [
    'M1.8 12S5.5 5.5 12 5.5 22.2 12 22.2 12 18.5 18.5 12 18.5 1.8 12 1.8 12Z',
    hatchC(12, 12, 3.8),
    circ(12, 12, 3.8),
    dot(12, 12, 1.5),
    { c: [13.4, 10.6, 0.7], f: 'soft' },
    thin('M12 5.5V3.4M7.2 6.6 6 4.8M16.8 6.6 18 4.8', 1),
  ],
  camera: [
    'M3.5 7.5h3.4l1.6-2.5h7l1.6 2.5h3.4A1.5 1.5 0 0 1 22 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5V9a1.5 1.5 0 0 1 1.5-1.5Z',
    hatchC(12, 13.5, 2.5),
    circ(12, 13.5, 4.3),
    circ(12, 13.5, 2.5, 1),
    thin('M9.6 12a2.8 2.8 0 0 1 1.6-1.5', 0.9),
    'M17.8 10.2h1.4',
    thin('M4 7.5V6h2v1.5', 1),
  ],
  laser: [
    hatch('M2 9h3v6H2Z'),
    'M2 9h8.5v6H2Z',
    'M10.5 10.5h2v3h-2',
    thin('M5 9v6', 1),
    { d: 'M12.5 12h6.3', w: 2 },
    thin('M13 10.6h5M13 13.4h5', 0.8),
    softC(20.3, 12, 1.6),
    thin('M20.3 8.2v1.4M20.3 14.4v1.4M22.9 12h.8M17.7 9.4l.9.9M22.9 9.4l-.9.9M17.7 14.6l.9-.9M22.9 14.6l-.9-.9', 1),
    dot(20.3, 12, 0.9),
  ],
  wave: [
    soft('M2 13.2c1.67-6.67 3.33-6.67 5 0ZM12 13.2c1.67-6.67 3.33-6.67 5 0Z'),
    thin('M1.5 13.2h21', 0.9),
    'M2 13.2c1.67-6.67 3.33-6.67 5 0s3.33 6.67 5 0 3.33-6.67 5 0 3.33 6.67 5 0',
    thin('M4.5 3.4h10M4.5 2.2v2.4M14.5 2.2v2.4', 1),
  ],

  // ───────────────────────── sound ─────────────────────────
  sound: [
    hatch('M2.5 9h3.8l5-4.5v15l-5-4.5H2.5Z'),
    'M2.5 9h3.8l5-4.5v15l-5-4.5H2.5Z',
    thin('M6.3 9v6', 1),
    `M${polar(11.3, 12, 4.2, 45)}A4.2 4.2 0 0 1 ${polar(11.3, 12, 4.2, 135)}`,
    `M${polar(11.3, 12, 7.4, 45)}A7.4 7.4 0 0 1 ${polar(11.3, 12, 7.4, 135)}`,
    thin(`M${polar(11.3, 12, 10.6, 50)}A10.6 10.6 0 0 1 ${polar(11.3, 12, 10.6, 130)}`, 1.1),
  ],
  ear: [
    soft('M9.5 9.5a3 3 0 0 1 6 0c0 1.2-.8 1.9-1.6 2.4-1 .7-1.6 1.6-1.6 2.8H10c.4-1.4 0-2.6-.5-3.6Z'),
    'M7 9.5a6 6 0 0 1 12 0c0 2.8-1.6 4-2.8 5.3-1.1 1.2-1.1 2.6-1.8 4a3.2 3.2 0 0 1-5.3.6',
    'M9.8 9.5a3 3 0 0 1 6 0c0 1.2-.8 1.9-1.6 2.4',
    thin('M11.4 11.4c.8-.3 1.6.3 1.4 1.2-.2 1-1.3 1.3-1.6 2.2', 1),
    thin('M4.3 7.8c-1 2.4-1 4.9 0 7.3M2 6.3c-1.4 3.4-1.4 7 0 10.3', 1),
  ],
  music: [
    { e: [6.8, 18, 2.3, 1.7], f: 'solid', tr: 'rotate(-20 6.8 18)' },
    { e: [16.8, 16, 2.3, 1.7], f: 'solid', tr: 'rotate(-20 16.8 16)' },
    'M9 17.5V5.5l10-2v12',
    { d: 'M9 5.5l10-2', w: 2.4 },
    'M9 8.8l10-2',
  ],

  // ───────────────────────── electricity & magnetism ─────────────────────────
  compass: [
    circ(12, 12, 9.6),
    circ(12, 12, 7.6, 0.8),
    ...spin(4, [thin('M12 4.4v1.4', 1)], 12, 12, 90),
    ...spin(4, [thin('M12 4.4v.8', 0.8)], 12, 12, 45),
    thin('M11.1 7V4.6l1.8 2.4V4.6', 1),
    ...rot(35, [solid('M12 6.6 14 12h-4Z'), 'M12 6.6 14 12h-4ZM10 12h4l-2 5.4Z']),
    dot(12, 12, 0.8),
  ],
  coil: [
    soft('M2.5 10h19v4h-19Z'),
    thin('M2.5 10h19v4h-19Z', 1),
    ...rot(90, helix(12, 5, 19, 5, 5, 0.9), 12, 12),
    'M5 7V3.5H2.5M19 7V3.5h2.5',
  ],
  motor: [
    thin('M5.5 10v5M8 10v5M10.5 10v5M13 10v5', 0.9),
    'M4 7.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V9A1.5 1.5 0 0 1 4 7.5Z',
    'M17.5 9.8h1.5v5.4h-1.5',
    { d: 'M19 12.5h3.2', w: 2 },
    'M5 17.5l-1.2 3h12.4l-1.2-3',
    hatch('M7.5 7.5V4.5h5v3Z'),
    'M7.5 7.5V4.5h5v3',
  ],
  socket: [
    'M5 2.5h14A2.5 2.5 0 0 1 21.5 5v14a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 19V5A2.5 2.5 0 0 1 5 2.5Z',
    softC(12, 12, 6.4),
    circ(12, 12, 6.4),
    dot(9.2, 12, 1.3),
    dot(14.8, 12, 1.3),
    'M10.6 6.6h2.8M10.6 17.4h2.8',
  ],
  'solar-panel': [
    soft('M8 9.5h13.5l-3 8H5Z'),
    'M8 9.5h13.5l-3 8H5Z',
    thin('M12.5 9.5l-3 8M17 9.5l-3 8M6.5 13.5h13.5', 1),
    'M12.2 17.5v3.5M8.8 21h7',
    circ(4.5, 4.5, 1.8, 1.2),
    thin('M4.5 1v1M4.5 7v1M1 4.5h1M7 4.5h1M2 2l.7.7M7 7l-.7-.7M7 2l-.7.7M2 7l.7-.7', 1),
  ],
  'wind-turbine': [
    'M11.2 10.5 10.4 21.5h3.2l-.8-11',
    'M7 21.5h10',
    ...spin(3, [soft('M12 7.6c-1-2.3-1-4.7-.1-6.6.9.3 1.5 1.6 1.5 3.3l-.3 3.3Z')], 12, 9, 15),
    ...spin(3, ['M12 7.6c-1-2.3-1-4.7-.1-6.6.9.3 1.5 1.6 1.5 3.3l-.3 3.3'], 12, 9, 15),
    circ(12, 9, 1.4),
  ],
  radiation: [
    circ(12, 12, 10.2, 1),
    ...[0, 120, 240].map((a) => hatch(sector(12, 12, 3, 8.6, a - 30 + 60, a + 30 + 60))),
    ...[0, 120, 240].map((a) => sector(12, 12, 3, 8.6, a - 30 + 60, a + 30 + 60)),
    dot(12, 12, 1.6),
  ],
}
