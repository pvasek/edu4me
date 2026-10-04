/**
 * Vrstevnice – terrain engine (pure): height functions (a tilted plane plus Gaussian
 * hills, ridges and troughs), sampling on a grid, contours by marching squares,
 * contour labels, spot heights and streams (D8 flow accumulation).
 */

export interface Pt {
  x: number
  y: number
}

/** An elliptical Gaussian: positive = hill or ridge, negative = hollow or trough. */
export interface Bump {
  x: number
  y: number
  /** Amplitude in metres. */
  a: number
  /** Spread along the rotated x axis (map units). */
  sx: number
  sy: number
  /** Rotation in radians. */
  rot: number
}

export interface Terrain {
  /** Map size in map units (SVG viewBox). */
  w: number
  h: number
  /** Height at the map centre without bumps (m). */
  base: number
  /** Tilt of the plane in m per map unit. */
  tx: number
  ty: number
  bumps: Bump[]
}

export const MAP_W = 320
export const MAP_H = 260
export const STEP = 4

export type Rng = () => number

/** Small seeded generator (mulberry32). */
export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const between = (rng: Rng, a: number, b: number) => a + rng() * (b - a)

export function heightAt(t: Terrain, x: number, y: number): number {
  let z = t.base + t.tx * (x - t.w / 2) + t.ty * (y - t.h / 2)
  for (const b of t.bumps) {
    const dx = x - b.x
    const dy = y - b.y
    const c = Math.cos(b.rot)
    const s = Math.sin(b.rot)
    const u = dx * c + dy * s
    const v = -dx * s + dy * c
    z += b.a * Math.exp(-(u * u) / (2 * b.sx * b.sx) - (v * v) / (2 * b.sy * b.sy))
  }
  return z
}

/** Gradient (m per map unit), pointing uphill. */
export function gradAt(t: Terrain, x: number, y: number, e = 0.5): Pt {
  return {
    x: (heightAt(t, x + e, y) - heightAt(t, x - e, y)) / (2 * e),
    y: (heightAt(t, x, y + e) - heightAt(t, x, y - e)) / (2 * e),
  }
}

/** Hessian [hxx, hxy, hyy] by finite differences. */
export function hessAt(t: Terrain, x: number, y: number, e = 3): [number, number, number] {
  const h0 = heightAt(t, x, y)
  const hxx = (heightAt(t, x + e, y) - 2 * h0 + heightAt(t, x - e, y)) / (e * e)
  const hyy = (heightAt(t, x, y + e) - 2 * h0 + heightAt(t, x, y - e)) / (e * e)
  const hxy = (heightAt(t, x + e, y + e) - heightAt(t, x + e, y - e) - heightAt(t, x - e, y + e) + heightAt(t, x - e, y - e)) / (4 * e * e)
  return [hxx, hxy, hyy]
}

export const len = (p: Pt) => Math.hypot(p.x, p.y)
export const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y)

/** Moves `p` to the nearby critical point (summit, pit or saddle) with Newton steps on the gradient. */
export function refineCritical(t: Terrain, p: Pt, iters = 30): Pt {
  let q = { ...p }
  for (let k = 0; k < iters; k++) {
    const g = gradAt(t, q.x, q.y)
    const [a, b, d] = hessAt(t, q.x, q.y, 1.5)
    const det = a * d - b * b
    if (Math.abs(det) < 1e-12) break
    const dx = (d * g.x - b * g.y) / det
    const dy = (-b * g.x + a * g.y) / det
    const stepLen = Math.hypot(dx, dy)
    const s = stepLen > 8 ? 8 / stepLen : 1
    q = { x: q.x - dx * s, y: q.y - dy * s }
    if (stepLen < 1e-4) break
  }
  return q
}

/* ------------------------------------------------------------------ grid */

export interface Grid {
  nx: number
  ny: number
  step: number
  v: Float64Array
  min: number
  max: number
}

export function sample(t: Terrain, step = STEP): Grid {
  const nx = Math.round(t.w / step) + 1
  const ny = Math.round(t.h / step) + 1
  const v = new Float64Array(nx * ny)
  let min = Infinity
  let max = -Infinity
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const z = heightAt(t, i * step, j * step)
      v[j * nx + i] = z
      if (z < min) min = z
      if (z > max) max = z
    }
  return { nx, ny, step, v, min, max }
}

/* ------------------------------------------------------------------ contours */

export interface Line {
  pts: Pt[]
  closed: boolean
}

export interface Contour extends Line {
  level: number
  index: boolean
}

/** Iso-lines of one level by marching squares, joined into polylines. */
export function isoLines(g: Grid, level: number): Line[] {
  const L = level + 1e-7
  const { nx, ny, step } = g
  const val = (i: number, j: number) => g.v[j * nx + i]
  const pos = new Map<string, Pt>()
  const adj = new Map<string, string[]>()
  const edge = (key: string, x1: number, y1: number, v1: number, x2: number, y2: number, v2: number) => {
    if (!pos.has(key)) {
      const f = (L - v1) / (v2 - v1)
      pos.set(key, { x: (x1 + (x2 - x1) * f) * step, y: (y1 + (y2 - y1) * f) * step })
    }
    return key
  }
  const link = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, [])
    if (!adj.has(b)) adj.set(b, [])
    adj.get(a)!.push(b)
    adj.get(b)!.push(a)
  }
  for (let j = 0; j < ny - 1; j++)
    for (let i = 0; i < nx - 1; i++) {
      const a = val(i, j)
      const b = val(i + 1, j)
      const c = val(i + 1, j + 1)
      const d = val(i, j + 1)
      const sa = a >= L
      const sb = b >= L
      const sc = c >= L
      const sd = d >= L
      if (sa === sb && sb === sc && sc === sd) continue
      const T = sa !== sb ? edge(`h${i},${j}`, i, j, a, i + 1, j, b) : null
      const R = sb !== sc ? edge(`v${i + 1},${j}`, i + 1, j, b, i + 1, j + 1, c) : null
      const B = sd !== sc ? edge(`h${i},${j + 1}`, i, j + 1, d, i + 1, j + 1, c) : null
      const Lf = sa !== sd ? edge(`v${i},${j}`, i, j, a, i, j + 1, d) : null
      const cut = [T, R, B, Lf].filter((x): x is string => x !== null)
      if (cut.length === 2) link(cut[0], cut[1])
      else {
        // saddle cell: decide by the centre value
        const centre = (a + b + c + d) / 4 >= L
        if (centre === sa) {
          link(T!, R!)
          link(B!, Lf!)
        } else {
          link(Lf!, T!)
          link(R!, B!)
        }
      }
    }
  const seen = new Set<string>()
  const out: Line[] = []
  const walk = (start: string) => {
    const keys = [start]
    seen.add(start)
    let cur = start
    for (;;) {
      const nxt = adj.get(cur)!.find((k) => !seen.has(k))
      if (!nxt) break
      seen.add(nxt)
      keys.push(nxt)
      cur = nxt
    }
    const closed = keys.length > 2 && adj.get(cur)!.includes(start)
    return { pts: keys.map((k) => pos.get(k)!), closed }
  }
  for (const [k, n] of adj) if (n.length === 1 && !seen.has(k)) out.push(walk(k))
  for (const k of adj.keys()) if (!seen.has(k)) out.push(walk(k))
  return out.filter((l) => l.pts.length >= 3)
}

/** Chaikin corner cutting (keeps the ends of open lines). */
export function smooth(line: Line, iters = 2): Line {
  let pts = line.pts
  for (let k = 0; k < iters; k++) {
    const n = pts.length
    const out: Pt[] = line.closed ? [] : [pts[0]]
    const m = line.closed ? n : n - 1
    for (let i = 0; i < m; i++) {
      const p = pts[i]
      const q = pts[(i + 1) % n]
      out.push({ x: 0.75 * p.x + 0.25 * q.x, y: 0.75 * p.y + 0.25 * q.y }, { x: 0.25 * p.x + 0.75 * q.x, y: 0.25 * p.y + 0.75 * q.y })
    }
    if (!line.closed) out.push(pts[n - 1])
    pts = out
  }
  return { pts, closed: line.closed }
}

/** A sensible contour interval for the height range: at most 24 lines (5, 10, 20, 50 or 100 m). */
export function chooseInterval(min: number, max: number): number {
  for (const i of [5, 10, 20, 50]) if ((max - min) / i <= 24) return i
  return 100
}

/** Index contours every 5 intervals. */
export const isIndex = (level: number, interval: number) => Math.round(level / interval) % 5 === 0

export function contours(g: Grid, interval: number): Contour[] {
  const out: Contour[] = []
  for (let L = Math.ceil(g.min / interval) * interval; L <= g.max; L += interval) {
    for (const l of isoLines(g, L)) out.push({ ...smooth(l), level: L, index: isIndex(L, interval) })
  }
  return out
}

export function polyLength(pts: Pt[]): number {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += dist(pts[i - 1], pts[i])
  return s
}

/** Distance from a point to a polyline. */
export function distToLine(p: Pt, pts: Pt[]): number {
  let best = Infinity
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const l2 = dx * dx + dy * dy
    const f = l2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0
    best = Math.min(best, Math.hypot(p.x - (a.x + f * dx), p.y - (a.y + f * dy)))
  }
  return pts.length === 1 ? dist(p, pts[0]) : best
}

/** Point at arc length `s` along a polyline, with the local direction. */
export function pointAt(pts: Pt[], s: number): { p: Pt; dir: Pt } {
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const d = dist(pts[i - 1], pts[i])
    if (acc + d >= s && d > 0) {
      const f = (s - acc) / d
      const a = pts[i - 1]
      const b = pts[i]
      return { p: { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }, dir: { x: (b.x - a.x) / d, y: (b.y - a.y) / d } }
    }
    acc += d
  }
  const n = pts.length
  const a = pts[n - 2] ?? pts[0]
  const b = pts[n - 1]
  const d = dist(a, b) || 1
  return { p: b, dir: { x: (b.x - a.x) / d, y: (b.y - a.y) / d } }
}

/* ------------------------------------------------------------------ labels */

export interface Label {
  x: number
  y: number
  /** Rotation in degrees; the top of the digits faces uphill. */
  rot: number
  text: string
}

const MARGIN = 16

/**
 * Height labels on index contours: one per long index line, placed where the text
 * reads upright if possible, away from the edges, other labels and `avoid` points.
 */
export function placeLabels(t: Terrain, lines: Contour[], avoid: Pt[] = []): Label[] {
  const out: Label[] = []
  const idx = lines.filter((l) => l.index && polyLength(l.pts) > 70).sort((a, b) => polyLength(b.pts) - polyLength(a.pts))
  for (const l of idx) {
    const total = polyLength(l.pts)
    let best: { score: number; lab: Label } | null = null
    for (let s = 12; s < total - 12; s += 6) {
      const { p, dir } = pointAt(l.pts, s)
      if (p.x < MARGIN || p.y < MARGIN || p.x > t.w - MARGIN || p.y > t.h - MARGIN) continue
      if (out.some((o) => dist(o, p) < 55)) continue
      if (avoid.some((a) => dist(a, p) < 26)) continue
      const g = gradAt(t, p.x, p.y)
      let rot = (Math.atan2(dir.y, dir.x) * 180) / Math.PI
      // text "up" after rotating by rot is (sin, −cos); flip so it faces uphill
      const r = (rot * Math.PI) / 180
      if (Math.sin(r) * g.x - Math.cos(r) * g.y < 0) rot += 180
      rot = ((((rot + 180) % 360) + 360) % 360) - 180
      const upright = Math.abs(rot) <= 70 ? 2 : Math.abs(rot) <= 100 ? 1 : 0
      const central = -Math.hypot(p.x - t.w / 2, p.y - t.h / 2) / 400
      const score = upright + central
      if (!best || score > best.score) best = { score, lab: { x: p.x, y: p.y, rot, text: String(l.level) } }
    }
    if (best) out.push(best.lab)
  }
  return out
}

/** Grid local maxima (summits) inside the margins, highest first, at least `sep` apart. */
export function summits(t: Terrain, g: Grid, sep = 50, margin = 20): Pt[] {
  const cands: { p: Pt; z: number }[] = []
  const { nx, ny, step } = g
  for (let j = 1; j < ny - 1; j++)
    for (let i = 1; i < nx - 1; i++) {
      const z = g.v[j * nx + i]
      let top = true
      for (let dj = -1; dj <= 1 && top; dj++) for (let di = -1; di <= 1; di++) if ((di || dj) && g.v[(j + dj) * nx + i + di] >= z) top = false
      if (!top) continue
      const p = refineCritical(t, { x: i * step, y: j * step })
      if (p.x < margin || p.y < margin || p.x > t.w - margin || p.y > t.h - margin) continue
      cands.push({ p, z: heightAt(t, p.x, p.y) })
    }
  cands.sort((a, b) => b.z - a.z)
  const out: Pt[] = []
  for (const c of cands) if (out.every((o) => dist(o, c.p) >= sep)) out.push(c.p)
  return out
}

/* ------------------------------------------------------------------ water */

export interface Flow {
  /** Index of the downstream cell, −1 for an outlet on the edge, −2 for a pit inside. */
  recv: Int32Array
  acc: Float64Array
}

const N8 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

/** D8 flow: every cell drains to its steepest lower neighbour; accumulation counts the cells upstream. */
export function flow(g: Grid): Flow {
  const { nx, ny, v } = g
  const n = nx * ny
  const recv = new Int32Array(n)
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const c = j * nx + i
      let best = -1
      let drop = 0
      for (const [di, dj] of N8) {
        const a = i + di
        const b = j + dj
        if (a < 0 || b < 0 || a >= nx || b >= ny) continue
        const d = (v[c] - v[b * nx + a]) / Math.hypot(di, dj)
        if (d > drop) {
          drop = d
          best = b * nx + a
        }
      }
      const edge = i === 0 || j === 0 || i === nx - 1 || j === ny - 1
      recv[c] = edge ? (best >= 0 && !isEdgeCell(g, best) ? best : -1) : best >= 0 ? best : -2
    }
  const order = Array.from({ length: n }, (_, k) => k).sort((a, b) => v[b] - v[a])
  const acc = new Float64Array(n).fill(1)
  for (const c of order) if (recv[c] >= 0) acc[recv[c]] += acc[c]
  return { recv, acc }
}

const isEdgeCell = (g: Grid, c: number) => {
  const i = c % g.nx
  const j = Math.floor(c / g.nx)
  return i === 0 || j === 0 || i === g.nx - 1 || j === g.ny - 1
}

export const cellPt = (g: Grid, c: number): Pt => ({ x: (c % g.nx) * g.step, y: Math.floor(c / g.nx) * g.step })
export const cellOf = (g: Grid, p: Pt) =>
  Math.min(g.ny - 1, Math.max(0, Math.round(p.y / g.step))) * g.nx + Math.min(g.nx - 1, Math.max(0, Math.round(p.x / g.step)))

/** Follows the D8 receivers from a cell to its outlet (or pit); returns the cells passed. */
export function downstream(f: Flow, c: number): number[] {
  const path = [c]
  let cur = c
  while (f.recv[cur] >= 0 && path.length < 10_000) {
    cur = f.recv[cur]
    path.push(cur)
  }
  return path
}

/** Cells in the outer band of the grid: streams end there (they leave the map). */
export const nearEdge = (g: Grid, c: number) => {
  const i = c % g.nx
  const j = Math.floor(c / g.nx)
  return i <= 1 || j <= 1 || i >= g.nx - 2 || j >= g.ny - 2
}

/** Where water from cell c leaves the map (first cell in the edge band), or the pit it ends in. */
export function outletOf(g: Grid, f: Flow, c: number): { cell: number; pit: boolean; path: number[] } {
  const full = downstream(f, c)
  const k = full.findIndex((x) => nearEdge(g, x))
  return k >= 0 ? { cell: full[k], pit: false, path: full.slice(0, k + 1) } : { cell: full[full.length - 1], pit: true, path: full }
}

export interface Stream {
  pts: Pt[]
  /** Cell where the stream leaves the map (or its pit). */
  outlet: number
  pit: boolean
  /** Accumulation at the end (size of the catchment in cells). */
  size: number
}

/**
 * Streams = cells draining at least `threshold` cells. Each head is followed down to
 * the map edge (or a pit), or to a junction with a stream drawn earlier (longest first).
 */
export function streams(g: Grid, f: Flow, threshold: number): Stream[] {
  const n = g.nx * g.ny
  const isStream = (c: number) => f.acc[c] >= threshold
  const hasUp = new Uint8Array(n)
  for (let c = 0; c < n; c++) if (isStream(c) && f.recv[c] >= 0) hasUp[f.recv[c]] = 1
  const heads: number[] = []
  for (let c = 0; c < n; c++) if (isStream(c) && !hasUp[c] && !nearEdge(g, c)) heads.push(c)
  const drawn = new Set<number>()
  const out: Stream[] = []
  const withPath = heads.map((h) => ({ h, o: outletOf(g, f, h) })).sort((a, b) => b.o.path.length - a.o.path.length)
  for (const { o } of withPath) {
    const cells: number[] = []
    for (const c of o.path) {
      cells.push(c)
      if (drawn.has(c)) break
    }
    if (cells.length < 4) continue
    // D8 on a plain slope makes parallel strands: skip a strand that runs alongside a drawn stream
    const body = cells.slice(0, -3).map((c) => cellPt(g, c))
    const near = body.filter((p) => out.some((o) => o.pts.some((q) => Math.abs(q.x - p.x) + Math.abs(q.y - p.y) < 3 * g.step))).length
    if (body.length && near / body.length > 0.3) continue
    cells.forEach((c) => drawn.add(c))
    const end = cells[cells.length - 1]
    const pts = cells.map((c) => cellPt(g, c))
    if (end === o.cell && !o.pit) pts.push(edgePush(g, cellPt(g, end)))
    out.push({ pts: soften(pts), outlet: o.cell, pit: o.pit, size: f.acc[end] })
  }
  return out
}

/** Moving average (keeps the ends) to take the stair steps out of D8 paths. */
function soften(pts: Pt[], r = 2): Pt[] {
  return pts.map((p, k) => {
    if (k === 0 || k === pts.length - 1) return p
    const a = Math.max(0, k - r)
    const b = Math.min(pts.length - 1, k + r)
    let x = 0
    let y = 0
    for (let j = a; j <= b; j++) {
      x += pts[j].x
      y += pts[j].y
    }
    return { x: x / (b - a + 1), y: y / (b - a + 1) }
  })
}

/** Extends an outlet point to the map edge so the stream visibly leaves the map. */
function edgePush(g: Grid, p: Pt): Pt {
  const w = (g.nx - 1) * g.step
  const h = (g.ny - 1) * g.step
  const d = [p.x, w - p.x, p.y, h - p.y]
  const k = d.indexOf(Math.min(...d))
  return k === 0 ? { x: -2, y: p.y } : k === 1 ? { x: w + 2, y: p.y } : k === 2 ? { x: p.x, y: -2 } : { x: p.x, y: h + 2 }
}

/** Gradient descent along the terrain from `p` (continuous); stops at the edge or in a hollow. */
export function descend(t: Terrain, p: Pt, stepLen = 2, maxSteps = 600, stop?: (q: Pt) => boolean): Pt[] {
  const out = [p]
  let q = p
  for (let k = 0; k < maxSteps; k++) {
    const g = gradAt(t, q.x, q.y)
    const l = len(g)
    if (l < 1e-4) break
    q = { x: q.x - (g.x / l) * stepLen, y: q.y - (g.y / l) * stepLen }
    out.push(q)
    if (q.x < 0 || q.y < 0 || q.x > t.w || q.y > t.h) break
    if (stop?.(q)) break
  }
  return out
}
