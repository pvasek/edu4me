/** Field lines of a bar magnet modelled as two point poles (N = source, S = sink), in svg units. */
export type Pt = [number, number]

export interface Poles {
  n: Pt
  s: Pt
}

/** Magnetic field direction (unnormalised) at `q`. */
export function bAt(q: Pt, { n, s }: Poles): Pt {
  const f = (c: Pt, k: number): Pt => {
    const dx = q[0] - c[0]
    const dy = q[1] - c[1]
    const r3 = Math.pow(dx * dx + dy * dy, 1.5) || 1e-9
    return [(k * dx) / r3, (k * dy) / r3]
  }
  const a = f(n, 1)
  const b = f(s, -1)
  return [a[0] + b[0], a[1] + b[1]]
}

/**
 * Traces a field line from the N pole, leaving it at angle `ang` (radians, 0 = +x, y down)
 * until it reaches the S pole or leaves the box. Returns the points and whether it closed.
 */
export function trace(poles: Poles, ang: number, box: [number, number, number, number], start = 12, step = 3, max = 900) {
  const pts: Pt[] = [[poles.n[0] + Math.cos(ang) * start, poles.n[1] + Math.sin(ang) * start]]
  let closed = false
  for (let i = 0; i < max; i++) {
    const p = pts[pts.length - 1]
    // midpoint (RK2) step
    const b1 = bAt(p, poles)
    const l1 = Math.hypot(b1[0], b1[1])
    const m: Pt = [p[0] + (b1[0] / l1) * step * 0.5, p[1] + (b1[1] / l1) * step * 0.5]
    const b2 = bAt(m, poles)
    const l2 = Math.hypot(b2[0], b2[1])
    const q: Pt = [p[0] + (b2[0] / l2) * step, p[1] + (b2[1] / l2) * step]
    pts.push(q)
    if (Math.hypot(q[0] - poles.s[0], q[1] - poles.s[1]) < start) {
      closed = true
      break
    }
    if (q[0] < box[0] || q[0] > box[2] || q[1] < box[1] || q[1] > box[3]) break
  }
  return { pts, closed }
}

export const toPath = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

/** Point and direction (degrees) a fraction `t` along a polyline. */
export function along(pts: Pt[], t: number): { p: Pt; deg: number } {
  let total = 0
  const seg: number[] = []
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    seg.push(l)
    total += l
  }
  let goal = total * t
  for (let i = 0; i < seg.length; i++) {
    if (goal <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? goal / seg[i] : 0
      const a = pts[i]
      const b = pts[i + 1]
      return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], deg: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI }
    }
    goal -= seg[i]
  }
  return { p: pts[0], deg: 0 }
}

/**
 * Field lines leaving N at the given angles (degrees). A line that leaves the box is
 * paired with its mirror image across the magnet's middle plane, reversed so that it
 * runs into S – so the picture stays symmetric.
 */
export function fieldLines(poles: Poles, box: [number, number, number, number], angles: number[]) {
  const m: Pt = [(poles.n[0] + poles.s[0]) / 2, (poles.n[1] + poles.s[1]) / 2]
  const len = Math.hypot(poles.n[0] - poles.s[0], poles.n[1] - poles.s[1]) || 1
  const a: Pt = [(poles.n[0] - poles.s[0]) / len, (poles.n[1] - poles.s[1]) / len]
  const mirror = ([x, y]: Pt): Pt => {
    const d = (x - m[0]) * a[0] + (y - m[1]) * a[1]
    return [x - 2 * d * a[0], y - 2 * d * a[1]]
  }
  const out: Pt[][] = []
  for (const deg of angles) {
    const { pts, closed } = trace(poles, (deg * Math.PI) / 180, box)
    out.push(pts)
    if (!closed) out.push(pts.map(mirror).reverse())
  }
  return out
}
