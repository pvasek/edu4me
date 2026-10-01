/**
 * Small 2D geometry for the optics plates: vectors, exact reflection and
 * refraction (Snell's law) and ray–segment / ray–circle intersections.
 * SVG coordinates (y grows downwards). Angles in degrees where named `deg`.
 */
export type V = [number, number]

export const rad = (deg: number) => (deg * Math.PI) / 180
export const deg = (r: number) => (r * 180) / Math.PI
export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]]
export const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]]
export const mul = (a: V, k: number): V => [a[0] * k, a[1] * k]
export const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1]
export const len = (a: V) => Math.hypot(a[0], a[1])
export const norm = (a: V): V => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l]
}
/** unit vector at `d` degrees from +x, measured clockwise on screen (y down) */
export const dir = (d: number): V => [Math.cos(rad(d)), Math.sin(rad(d))]
export const along = (p: V, d: V, t: number): V => [p[0] + d[0] * t, p[1] + d[1] * t]

/** Mirror reflection of direction `d` on a surface with normal `n` (any orientation). */
export function reflect(d: V, n: V): V {
  const u = norm(n)
  const k = 2 * dot(d, u)
  return norm([d[0] - k * u[0], d[1] - k * u[1]])
}

/**
 * Refraction of unit direction `d` through a surface with normal `n` from index n1 into n2.
 * Returns null for total internal reflection.
 */
export function refract(d: V, n: V, n1: number, n2: number): V | null {
  let u = norm(n)
  let c = -dot(u, d)
  if (c < 0) {
    u = [-u[0], -u[1]]
    c = -c
  }
  const r = n1 / n2
  const k = 1 - r * r * (1 - c * c)
  if (k < 0) return null
  return norm([r * d[0] + (r * c - Math.sqrt(k)) * u[0], r * d[1] + (r * c - Math.sqrt(k)) * u[1]])
}

/** Distance along the ray p + t·d to the segment a–b (or null). */
export function hitSeg(p: V, d: V, a: V, b: V): number | null {
  const e = sub(b, a)
  const den = d[0] * e[1] - d[1] * e[0]
  if (Math.abs(den) < 1e-9) return null
  const w = sub(a, p)
  const t = (w[0] * e[1] - w[1] * e[0]) / den
  const s = (w[0] * d[1] - w[1] * d[0]) / den
  return t > 1e-6 && s >= 0 && s <= 1 ? t : null
}

/** Distance along the ray to a circle (first hit in front of the ray, `inside` = ray starts inside). */
export function hitCircle(p: V, d: V, c: V, r: number, inside = false): number | null {
  const w = sub(p, c)
  const b = dot(w, d)
  const q = dot(w, w) - r * r
  const disc = b * b - q
  if (disc < 0) return null
  const s = Math.sqrt(disc)
  const t = inside ? -b + s : -b - s
  return t > 1e-6 ? t : null
}

/** Intersection of two lines p1 + t·d1 and p2 + s·d2. */
export function meet(p1: V, d1: V, p2: V, d2: V): V {
  const den = d1[0] * d2[1] - d1[1] * d2[0]
  const w = sub(p2, p1)
  const t = (w[0] * d2[1] - w[1] * d2[0]) / den
  return along(p1, d1, t)
}

/** "x y" with 1 decimal, for path strings. */
export const f = (v: V) => `${v[0].toFixed(1)} ${v[1].toFixed(1)}`
/** Polyline path through points. */
export const poly = (pts: V[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p)}`).join(' ')
