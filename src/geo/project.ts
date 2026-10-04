/**
 * Map projections in plain TypeScript (no runtime imports: scripts/geo/build-geo.mjs imports this file too).
 *
 * Every projection maps (lon, lat) in degrees to (x, y) on a unit sphere, y pointing NORTH (math axes);
 * the SVG layer flips y. `inverse` returns null for points outside the projection's domain.
 *
 * - Equal Earth (Šavrič, Patterson, Jenny 2018): the `world` view; equal-area, pleasant shapes.
 * - Lambert azimuthal equal-area (LAEA), oblique or polar: the regional and polar views.
 * - Mercator, Natural Earth I and Robinson: for the projection experiment (z1-6) and comparisons.
 */

export type ProjectionKind = 'equal-earth' | 'laea' | 'mercator' | 'natural-earth' | 'robinson'
export interface ProjectionSpec {
  kind: ProjectionKind
  /** centre longitude (all kinds) */
  lon0?: number
  /** centre latitude (laea only; ±90 = polar) */
  lat0?: number
}
export interface Projection {
  spec: ProjectionSpec
  forward(lon: number, lat: number): [number, number]
  inverse(x: number, y: number): [number, number] | null
}

const D = Math.PI / 180
const R = 180 / Math.PI

/** Longitude wrapped to −180…180 (for inverse results). */
export function wrapLon(l: number): number {
  return ((((l + 180) % 360) + 360) % 360) - 180
}
/** Longitude difference brought into −180…180, keeping ±180 as it is (the two edges of a world map). */
function rel(d: number): number {
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

// ------------------------------------------------------------------ Equal Earth

const A1 = 1.340264
const A2 = -0.081106
const A3 = 0.000893
const A4 = 0.003796
const M = Math.sqrt(3) / 2

function equalEarth(lon0: number): Projection {
  return {
    spec: { kind: 'equal-earth', lon0 },
    forward(lon, lat) {
      const l = rel(lon - lon0) * D
      const t = Math.asin(M * Math.sin(lat * D))
      const t2 = t * t
      const t6 = t2 * t2 * t2
      const x = (l * Math.cos(t)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)))
      const y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))
      return [x, y]
    },
    inverse(x, y) {
      let t = y
      for (let i = 0; i < 20; i++) {
        const t2 = t * t
        const t6 = t2 * t2 * t2
        const fy = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)) - y
        const fpy = A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)
        const dt = fy / fpy
        t -= dt
        if (Math.abs(dt) < 1e-12) break
      }
      const t2 = t * t
      const t6 = t2 * t2 * t2
      const s = Math.sin(t) / M
      if (!(Math.abs(s) <= 1 + 1e-9)) return null
      const l = (M * x * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))) / Math.cos(t)
      if (!(Math.abs(l) <= Math.PI + 1e-9)) return null
      return [wrapLon(l * R + lon0), Math.asin(Math.max(-1, Math.min(1, s))) * R]
    },
  }
}

// ------------------------------------------------------------------ Lambert azimuthal equal-area

function laea(lon0: number, lat0: number): Projection {
  const sp0 = Math.sin(lat0 * D)
  const cp0 = Math.cos(lat0 * D)
  return {
    spec: { kind: 'laea', lon0, lat0 },
    forward(lon, lat) {
      const l = (lon - lon0) * D
      const p = lat * D
      const sp = Math.sin(p)
      const cp = Math.cos(p)
      const cl = Math.cos(l)
      const den = 1 + sp0 * sp + cp0 * cp * cl
      // the antipode has no single image (it is the whole bounding circle of radius 2): pick a point on it
      if (den < 1e-12) return [2, 0]
      const k = Math.sqrt(2 / den)
      return [k * cp * Math.sin(l), k * (cp0 * sp - sp0 * cp * cl)]
    },
    inverse(x, y) {
      const rho = Math.hypot(x, y)
      if (rho > 2) return null
      if (rho < 1e-12) return [lon0, lat0]
      const c = 2 * Math.asin(rho / 2)
      const sc = Math.sin(c)
      const cc = Math.cos(c)
      const lat = Math.asin(Math.max(-1, Math.min(1, cc * sp0 + (y * sc * cp0) / rho)))
      const lon = lon0 + Math.atan2(x * sc, rho * cp0 * cc - y * sp0 * sc) * R
      return [wrapLon(lon), lat * R]
    },
  }
}

// ------------------------------------------------------------------ Mercator

const MERC_MAX = 85.05113
function mercator(lon0: number): Projection {
  return {
    spec: { kind: 'mercator', lon0 },
    forward(lon, lat) {
      const p = Math.max(-MERC_MAX, Math.min(MERC_MAX, lat)) * D
      return [rel(lon - lon0) * D, Math.log(Math.tan(Math.PI / 4 + p / 2))]
    },
    inverse(x, y) {
      if (Math.abs(x) > Math.PI + 1e-9) return null
      return [wrapLon(x * R + lon0), (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * R]
    },
  }
}

// ------------------------------------------------------------------ Natural Earth I (Šavrič et al. 2011)

function naturalEarth(lon0: number): Projection {
  const fy = (p: number) => {
    const p2 = p * p
    const p4 = p2 * p2
    return p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
  }
  const dfy = (p: number) => {
    const p2 = p * p
    const p4 = p2 * p2
    return 1.007226 + p2 * (0.015085 * 3 + p4 * (-0.044475 * 7 + 0.028874 * 9 * p2 - 0.005916 * 11 * p4))
  }
  const fx = (p: number) => {
    const p2 = p * p
    const p4 = p2 * p2
    return 0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * p2 * (0.003971 - 0.001529 * p2))
  }
  return {
    spec: { kind: 'natural-earth', lon0 },
    forward(lon, lat) {
      const l = rel(lon - lon0) * D
      const p = lat * D
      return [l * fx(p), fy(p)]
    },
    inverse(x, y) {
      let p = y
      for (let i = 0; i < 25; i++) {
        const d = (fy(p) - y) / dfy(p)
        p -= d
        if (Math.abs(d) < 1e-12) break
      }
      if (!(Math.abs(p) <= Math.PI / 2 + 1e-9)) return null
      const l = x / fx(p)
      if (!(Math.abs(l) <= Math.PI + 1e-9)) return null
      return [wrapLon(l * R + lon0), p * R]
    },
  }
}

// ------------------------------------------------------------------ Robinson (table, cubic interpolation)

// PLEN and PDFE per 5° of latitude (Robinson 1974, as in PROJ)
const ROB_X = [1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962, 0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322]
const ROB_Y = [0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1]
const ROB_FXC = 0.8487
const ROB_FYC = 1.3523

function interp(tab: number[], a: number): number {
  // Catmull-Rom through the table, a = |lat| / 5°
  const i = Math.min(17, Math.floor(a))
  const t = a - i
  const p0 = tab[Math.max(0, i - 1)]
  const p1 = tab[i]
  const p2 = tab[i + 1]
  const p3 = tab[Math.min(18, i + 2)]
  return p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))
}

function robinson(lon0: number): Projection {
  return {
    spec: { kind: 'robinson', lon0 },
    forward(lon, lat) {
      const a = Math.min(90, Math.abs(lat)) / 5
      const l = rel(lon - lon0) * D
      return [ROB_FXC * l * interp(ROB_X, a), Math.sign(lat) * ROB_FYC * interp(ROB_Y, a)]
    },
    inverse(x, y) {
      const yy = Math.abs(y) / ROB_FYC
      if (yy > 1 + 1e-9) return null
      let lo = 0
      let hi = 18
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2
        if (interp(ROB_Y, mid) < yy) lo = mid
        else hi = mid
      }
      const a = (lo + hi) / 2
      const l = x / (ROB_FXC * interp(ROB_X, a))
      if (!(Math.abs(l) <= Math.PI + 1e-9)) return null
      return [wrapLon(l * R + lon0), Math.sign(y) * a * 5]
    },
  }
}

/** Builds a projection from its spec. */
export function makeProjection(spec: ProjectionSpec): Projection {
  const lon0 = spec.lon0 ?? 0
  switch (spec.kind) {
    case 'equal-earth':
      return equalEarth(lon0)
    case 'laea':
      return laea(lon0, spec.lat0 ?? 0)
    case 'mercator':
      return mercator(lon0)
    case 'natural-earth':
      return naturalEarth(lon0)
    case 'robinson':
      return robinson(lon0)
  }
}
