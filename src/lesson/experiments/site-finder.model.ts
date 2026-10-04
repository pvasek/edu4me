/**
 * Model of the `site-finder` experiment (z10-8): a small synthetic GIS.
 *
 * A made-up area of 1 000 m × 700 m is split into a raster of 50 m cells.
 * Five layers each answer a yes/no question for every cell; the overlay
 * (průnik vrstev, logical AND) keeps only the cells where all active layers
 * say "suitable". Two layers are buffers (obalová zóna): a distance zone
 * around a line – the river (exclude cells closer than the set distance) and
 * the roads (keep cells within the set distance). Distances are measured from
 * the cell centre, slope from the terrain's gradient there. The area, the
 * features and the criteria are invented for the lesson.
 */

export const CELL = 50
export const COLS = 20
export const ROWS = 14
export const W = COLS * CELL
export const H = ROWS * CELL

type Pt = [number, number]

/** river (west → east, along the south) */
export const RIVER: Pt[] = [
  [0, 520],
  [160, 470],
  [330, 520],
  [520, 600],
  [700, 560],
  [860, 470],
  [1000, 450],
]
/** local roads */
export const ROADS: Pt[][] = [
  [
    [0, 330],
    [220, 345],
    [420, 310],
    [600, 330],
    [780, 300],
    [1000, 320],
  ],
  [
    [600, 330],
    [630, 450],
    [660, 700],
  ],
]
/** motorway along the north (the noise source) */
export const MOTORWAY: Pt[] = [
  [0, 70],
  [400, 55],
  [1000, 90],
]
/** nature reserve: an ellipse [cx, cy, rx, ry] */
export const RESERVE = [230, 190, 170, 105] as const
/** a hill: [cx, cy, height m, spread m] */
export const HILL = [840, 230, 55, 120] as const
/** the village (houses to draw) */
export const VILLAGE: Pt[] = [
  [380, 360],
  [430, 370],
  [470, 350],
  [500, 380],
  [440, 405],
  [520, 290],
]

export const NOISE_BUFFER = 250
export const MAX_SLOPE = 12

function segDist([px, py]: Pt, [ax, ay]: Pt, [bx, by]: Pt): number {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}
export function lineDist(p: Pt, line: Pt[]): number {
  let d = Infinity
  for (let i = 1; i < line.length; i++) d = Math.min(d, segDist(p, line[i - 1], line[i]))
  return d
}

/** terrain height above the valley (m) */
export function elevation([x, y]: Pt): number {
  const [cx, cy, h, s] = HILL
  return h * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s))
}
/** slope in % (rise per 100 m) */
export function slope([x, y]: Pt): number {
  const [cx, cy, , s] = HILL
  const e = elevation([x, y])
  const g = (e / (s * s)) * Math.hypot(x - cx, y - cy)
  return g * 100
}

export function inReserve([x, y]: Pt): boolean {
  const [cx, cy, rx, ry] = RESERVE
  return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
}

export type LayerId = 'reka' | 'svah' | 'silnice' | 'chranene' | 'hluk'
export const LAYERS: LayerId[] = ['reka', 'svah', 'silnice', 'chranene', 'hluk']
export const LAYER_LABEL: Record<LayerId, string> = {
  reka: 'řeka',
  svah: 'svah',
  silnice: 'silnice',
  chranene: 'chráněné území',
  hluk: 'hluk z dálnice',
}

export interface Settings {
  layers: Record<LayerId, boolean>
  /** build at least this far from the river (m) */
  riverBuffer: number
  /** at most this far from a road (m) */
  roadMax: number
}

export const cellCentre = (col: number, row: number): Pt => [(col + 0.5) * CELL, (row + 0.5) * CELL]

/** Does one layer allow a cell? */
export function layerOk(layer: LayerId, p: Pt, s: Settings): boolean {
  switch (layer) {
    case 'reka':
      return lineDist(p, RIVER) >= s.riverBuffer
    case 'svah':
      return slope(p) <= MAX_SLOPE
    case 'silnice':
      return Math.min(...ROADS.map((r) => lineDist(p, r))) <= s.roadMax
    case 'chranene':
      return !inReserve(p)
    case 'hluk':
      return lineDist(p, MOTORWAY) >= NOISE_BUFFER
  }
}

/** The river channel itself is never buildable. */
export const inRiver = (p: Pt) => lineDist(p, RIVER) < CELL / 2

/** Overlay: suitable[row][col] when every active layer allows the cell. */
export function suitability(s: Settings): boolean[][] {
  const out: boolean[][] = []
  for (let r = 0; r < ROWS; r++) {
    const row: boolean[] = []
    for (let c = 0; c < COLS; c++) {
      const p = cellCentre(c, r)
      row.push(!inRiver(p) && LAYERS.every((l) => !s.layers[l] || layerOk(l, p, s)))
    }
    out.push(row)
  }
  return out
}

export const countSuitable = (grid: boolean[][]) => grid.reduce((a, row) => a + row.filter(Boolean).length, 0)
/** area of one cell in hectares */
export const CELL_HA = (CELL * CELL) / 10000

/** The task's criteria for a new school. */
export const TASK = { riverBuffer: 200, roadMax: 150 }

/** Done: all layers on, buffers at least as strict as the task, and some cell is left. */
export function challengeMet(s: Settings): boolean {
  return (
    LAYERS.every((l) => s.layers[l]) &&
    s.riverBuffer >= TASK.riverBuffer &&
    s.roadMax <= TASK.roadMax &&
    countSuitable(suitability(s)) > 0
  )
}
