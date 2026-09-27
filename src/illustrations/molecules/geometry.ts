/**
 * Small 3D toolkit for the molecule library and renderers:
 * vectors, rotation matrices, principal axes and a molecule builder that
 * places atoms with VSEPR geometry (tetrahedral / trigonal / linear).
 */

export type Vec3 = [number, number, number]
/** Row-major 3×3 matrix. */
export type Mat3 = [number, number, number, number, number, number, number, number, number]

export const vadd = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const vsub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const vscale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k]
export const vdot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const vcross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export const vlen = (a: Vec3) => Math.hypot(a[0], a[1], a[2])
export const vdist = (a: Vec3, b: Vec3) => vlen(vsub(a, b))
export function vnorm(a: Vec3): Vec3 {
  const l = vlen(a)
  return l < 1e-9 ? [0, 0, 0] : vscale(a, 1 / l)
}
/** Component of `a` perpendicular to unit vector `u`. */
export const vperp = (a: Vec3, u: Vec3): Vec3 => vsub(a, vscale(u, vdot(a, u)))
/** Any unit vector perpendicular to `u`. */
export function anyPerp(u: Vec3): Vec3 {
  const ax: Vec3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  return vnorm(vcross(u, ax))
}
/** Rotate `p` (perpendicular to unit axis `u`) around `u` by angle `t`. */
export const rotPerp = (p: Vec3, u: Vec3, t: number): Vec3 =>
  vadd(vscale(p, Math.cos(t)), vscale(vcross(u, p), Math.sin(t)))

export const deg = (d: number) => (d * Math.PI) / 180
/** Unit vector in the xy-plane at `d` degrees. */
export const polar = (d: number, z = 0): Vec3 => vnorm([Math.cos(deg(d)), Math.sin(deg(d)), z])

// ---------------------------------------------------------------- matrices
export const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]
export function matMul(a: Mat3, b: Mat3): Mat3 {
  const r = new Array(9).fill(0) as Mat3
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]
  return r
}
export const matVec = (m: Mat3, v: Vec3): Vec3 => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
]
export const rotX = (t: number): Mat3 => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)]
export const rotY = (t: number): Mat3 => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)]
export const rotZ = (t: number): Mat3 => [Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t), 0, 0, 0, 1]

/** Re-orthonormalise a rotation matrix (rows) after many incremental updates. */
export function orthonormalize(m: Mat3): Mat3 {
  const r0 = vnorm([m[0], m[1], m[2]])
  const r1 = vnorm(vperp([m[3], m[4], m[5]], r0))
  const r2 = vcross(r0, r1)
  return [...r0, ...r1, ...r2] as Mat3
}

/**
 * Principal axes of a point cloud: rows are unit eigenvectors sorted by
 * decreasing spread (right-handed). Used to find a readable default view.
 */
export function principalAxes(points: Vec3[]): Mat3 {
  const n = points.length || 1
  const c = points.reduce((s, p) => vadd(s, p), [0, 0, 0] as Vec3)
  const m = vscale(c, 1 / n)
  const a = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (const p of points) {
    const d = vsub(p, m)
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) a[i][j] += d[i] * d[j]
  }
  // Jacobi eigenvalue iteration
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  for (let sweep = 0; sweep < 30; sweep++) {
    let off = 0
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += a[p][q] * a[p][q]
    if (off < 1e-14) break
    for (let p = 0; p < 3; p++)
      for (let q = p + 1; q < 3; q++) {
        if (Math.abs(a[p][q]) < 1e-12) continue
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const cs = 1 / Math.sqrt(t * t + 1)
        const sn = t * cs
        for (let k = 0; k < 3; k++) {
          const akp = a[k][p]
          const akq = a[k][q]
          a[k][p] = cs * akp - sn * akq
          a[k][q] = sn * akp + cs * akq
        }
        for (let k = 0; k < 3; k++) {
          const apk = a[p][k]
          const aqk = a[q][k]
          a[p][k] = cs * apk - sn * aqk
          a[q][k] = sn * apk + cs * aqk
        }
        for (let k = 0; k < 3; k++) {
          const vkp = v[k][p]
          const vkq = v[k][q]
          v[k][p] = cs * vkp - sn * vkq
          v[k][q] = sn * vkp + cs * vkq
        }
      }
  }
  const order = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i])
  const e0 = vnorm([v[0][order[0]], v[1][order[0]], v[2][order[0]]])
  const e1 = vnorm(vperp([v[0][order[1]], v[1][order[1]], v[2][order[1]]], e0))
  const e2 = vcross(e0, e1)
  return [...e0, ...e1, ...e2] as Mat3
}

// ---------------------------------------------------------------- builder
export type BondOrder = 1 | 1.5 | 2 | 3
export type Geo = 'tet' | 'tri' | 'lin'

export interface Atom {
  el: string
  p: Vec3
  /** formal charge */
  charge?: number
  /** unpaired electrons (NO, NO2) */
  radical?: number
}
export interface Bond {
  a: number
  b: number
  order: BondOrder
}

/** Covalent radii (Å) used for bond lengths. */
const COV: Record<string, number> = {
  H: 0.31, B: 0.84, Be: 0.96, C: 0.76, N: 0.71, O: 0.66, F: 0.57, P: 1.07, S: 1.05, Cl: 1.02, Br: 1.2, I: 1.39, Xe: 1.4,
}
/** Measured lengths where radii are too far off. */
const LEN_OVERRIDE: Record<string, number> = {
  'H-H-1': 0.74, 'O-O-2': 1.21, 'O-O-1': 1.47, 'F-F-1': 1.42, 'S-O-2': 1.43, 'S-O-1': 1.57, 'O-P-2': 1.49,
  'B-F-1': 1.31, 'Be-Cl-1': 1.75, 'F-S-1': 1.56, 'Cl-Cl-1': 1.99, 'Br-Br-1': 2.28, 'I-I-1': 2.67, 'H-O-1': 0.96,
  'N-O-2': 1.2, 'O-O-1.5': 1.28, 'C-O-3': 1.13, 'N-N-3': 1.1, 'S-S-1': 2.05, 'P-P-1': 2.21, 'Cl-P-1': 2.1,
  'F-Xe-1': 1.95, 'H-S-1': 1.34, 'Cl-H-1': 1.27, 'F-H-1': 0.92, 'C-O-1.5': 1.36, 'N-O-1': 1.36,
}
export function bondLength(a: string, b: string, order: number): number {
  const key = [a, b].sort().join('-') + '-' + order
  if (LEN_OVERRIDE[key]) return LEN_OVERRIDE[key]
  const base = (COV[a] ?? 1) + (COV[b] ?? 1)
  const cut = order === 3 ? 0.32 : order === 2 ? 0.19 : order === 1.5 ? 0.13 : 0
  return base - cut
}

const TET: Vec3[] = [
  vnorm([1, 1, 1]),
  vnorm([-1, -1, 1]),
  vnorm([-1, 1, -1]),
  vnorm([1, -1, -1]),
]
const TET_HALF = Math.acos(-1 / 3) / 2

export interface SubOpts {
  order?: BondOrder
  charge?: number
  radical?: number
  /** geometry of the new atom (otherwise inferred) */
  geo?: Geo
  /** which free direction: index, or the one pointing most 'up'/'down' (±z) */
  pick?: number | 'up' | 'down'
  /** atom the first free direction should be anti to (for 1-neighbour atoms) */
  anti?: number
}

export class MolBuilder {
  atoms: Atom[] = []
  bonds: Bond[] = []
  private geos: (Geo | undefined)[] = []

  add(el: string, p: Vec3 = [0, 0, 0], o: { charge?: number; radical?: number; geo?: Geo } = {}): number {
    const a: Atom = { el, p }
    if (o.charge) a.charge = o.charge
    if (o.radical) a.radical = o.radical
    this.atoms.push(a)
    this.geos.push(o.geo)
    return this.atoms.length - 1
  }
  setGeo(i: number, g: Geo) {
    this.geos[i] = g
    return this
  }
  bond(a: number, b: number, order: BondOrder = 1) {
    this.bonds.push({ a, b, order })
    return this
  }
  nbrs(i: number): number[] {
    const out: number[] = []
    for (const b of this.bonds) {
      if (b.a === i) out.push(b.b)
      else if (b.b === i) out.push(b.a)
    }
    return out
  }
  used(i: number) {
    return this.bonds.reduce((s, b) => s + (b.a === i || b.b === i ? b.order : 0), 0)
  }
  private orders(i: number) {
    return this.bonds.filter((b) => b.a === i || b.b === i).map((b) => b.order)
  }
  geo(i: number): Geo {
    const g = this.geos[i]
    if (g) return g
    const o = this.orders(i)
    if (o.includes(3) || o.filter((x) => x === 2).length >= 2) return 'lin'
    if (o.includes(2) || o.includes(1.5)) return 'tri'
    // nitrogen next to a π system is planar (amides, nucleobases, aniline-like)
    if (this.atoms[i].el === 'N' && this.nbrs(i).some((n) => this.orders(n).some((x) => x > 1))) return 'tri'
    return 'tet'
  }

  /** Place a new atom from atom `i` along `dir` at the bond length for the pair. */
  grow(i: number, el: string, dir: Vec3, o: Omit<SubOpts, 'pick' | 'anti'> & { len?: number } = {}): number {
    const order = o.order ?? 1
    const len = o.len ?? bondLength(this.atoms[i].el, el, order)
    const j = this.add(el, vadd(this.atoms[i].p, vscale(vnorm(dir), len)), o)
    this.bond(i, j, order)
    return j
  }

  /** Unit directions still free around atom `i` for its VSEPR geometry. */
  freeDirs(i: number, geo: Geo = this.geo(i), anti?: number): Vec3[] {
    const p = this.atoms[i].p
    const nb = this.nbrs(i)
    const U = nb.map((n) => vnorm(vsub(this.atoms[n].p, p)))
    const total = geo === 'tet' ? 4 : geo === 'tri' ? 3 : 2
    const k = U.length
    if (k >= total) return []
    if (k === 0) {
      if (geo === 'tet') return TET
      if (geo === 'tri') return [polar(0), polar(120), polar(240)]
      return [
        [1, 0, 0],
        [-1, 0, 0],
      ]
    }
    if (k === 1) {
      const u = U[0]
      if (geo === 'lin') return [vscale(u, -1)]
      // reference: the substituent should be anti to `anti` or to a neighbour of our neighbour
      const n = nb[0]
      const refAtom = anti ?? this.nbrs(n).find((m) => m !== i)
      let q: Vec3
      if (refAtom !== undefined) {
        q = vnorm(vscale(vperp(vsub(this.atoms[refAtom].p, this.atoms[n].p), u), -1))
        if (vlen(q) < 0.5) q = anyPerp(u)
      } else q = anyPerp(u)
      if (geo === 'tri') {
        return [vadd(vscale(u, -0.5), vscale(q, Math.sqrt(3) / 2)), vadd(vscale(u, -0.5), vscale(q, -Math.sqrt(3) / 2))]
      }
      const s = Math.sqrt(8 / 9)
      return [0, 1, 2].map((t) => vadd(vscale(u, -1 / 3), vscale(rotPerp(q, u, (t * 2 * Math.PI) / 3), s)))
    }
    if (k === 2) {
      const bis = vnorm(vscale(vadd(U[0], U[1]), -1))
      if (geo === 'tri') return [bis]
      if (geo === 'lin') return []
      const nrm = vnorm(vcross(U[0], U[1]))
      return [
        vadd(vscale(bis, Math.cos(TET_HALF)), vscale(nrm, Math.sin(TET_HALF))),
        vadd(vscale(bis, Math.cos(TET_HALF)), vscale(nrm, -Math.sin(TET_HALF))),
      ]
    }
    return [vnorm(vscale(U.reduce((s, x) => vadd(s, x), [0, 0, 0] as Vec3), -1))]
  }

  /** Attach a substituent in a free VSEPR direction of atom `i`. */
  sub(i: number, el: string, o: SubOpts = {}): number {
    const dirs = this.freeDirs(i, this.geo(i), o.anti)
    if (!dirs.length) throw new Error(`no free direction on atom ${i} (${this.atoms[i].el})`)
    let d = dirs[0]
    if (o.pick === 'up') d = dirs.reduce((a, b) => (b[2] > a[2] ? b : a))
    else if (o.pick === 'down') d = dirs.reduce((a, b) => (b[2] < a[2] ? b : a))
    else if (typeof o.pick === 'number') d = dirs[o.pick]
    return this.grow(i, el, d, o)
  }

  /** Expected valence for hydrogen filling (C, N, O only). */
  private target(i: number): number | null {
    const a = this.atoms[i]
    const q = a.charge ?? 0
    const r = a.radical ?? 0
    if (a.el === 'C') return (q ? 3 : 4) - r
    if (a.el === 'N') return 3 + (q > 0 ? 1 : q < 0 ? -1 : 0) - r
    if (a.el === 'O') return 2 + q - r
    return null
  }

  /** Fill every C, N, O with hydrogens up to its usual valence. */
  hs(): this {
    const n = this.atoms.length
    for (let i = 0; i < n; i++) {
      const t = this.target(i)
      if (t === null) continue
      let need = Math.round(t - this.used(i))
      while (need > 0) {
        const dirs = this.freeDirs(i)
        if (!dirs.length) throw new Error(`cannot place H on atom ${i} (${this.atoms[i].el})`)
        this.grow(i, 'H', dirs[0])
        need--
      }
    }
    return this
  }

  // ------------------------------------------------ chains and rings
  /** Planar zig-zag chain in the xy-plane. `orders[k]` joins atom k and k+1. */
  zig(els: string[], o: { angle?: number; orders?: BondOrder[]; start?: Vec3 } = {}): number[] {
    const beta = deg((180 - (o.angle ?? 109.5)) / 2)
    const ids: number[] = [this.add(els[0], o.start ?? [0, 0, 0])]
    for (let k = 1; k < els.length; k++) {
      const dir: Vec3 = [Math.cos(beta), (k % 2 ? 1 : -1) * Math.sin(beta), 0]
      ids.push(this.grow(ids[k - 1], els[k], dir, { order: o.orders?.[k - 1] ?? 1 }))
    }
    return ids
  }

  /**
   * Ring in the xy-plane (optionally puckered with z offsets), atoms in order.
   * `orders[k]` joins atom k and k+1 (last one closes the ring).
   */
  ring(
    els: string[],
    o: { len?: number; orders?: BondOrder[]; center?: Vec3; start?: number; zs?: number[]; radius?: number } = {},
  ): number[] {
    const n = els.length
    const len = o.len ?? 1.39
    const R = o.radius ?? len / (2 * Math.sin(Math.PI / n))
    const c = o.center ?? [0, 0, 0]
    const ids = els.map((el, k) => {
      const a = deg((o.start ?? 90) - (k * 360) / n)
      return this.add(el, [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a), c[2] + (o.zs?.[k] ?? 0)])
    })
    for (let k = 0; k < n; k++) this.bond(ids[k], ids[(k + 1) % n], o.orders?.[k] ?? 1)
    return ids
  }

  /**
   * Fuse a regular ring onto the existing edge i–j (xy-plane), on the side away
   * from `away`. Returns the new atoms in ring order after j. `orders` are for
   * j→new0, new0→new1, …, last→i.
   */
  fuse(i: number, j: number, els: string[], away: Vec3, orders: BondOrder[] = []): number[] {
    const n = els.length + 2
    const pi = this.atoms[i].p
    const pj = this.atoms[j].p
    const e = vnorm(vsub(pj, pi))
    const L = vdist(pi, pj)
    const m = vscale(vadd(pi, pj), 0.5)
    let w = vnorm(vcross([0, 0, 1], e))
    if (vdot(w, vsub(away, m)) > 0) w = vscale(w, -1)
    const apo = L / (2 * Math.tan(Math.PI / n))
    const R = L / (2 * Math.sin(Math.PI / n))
    const c = vadd(m, vscale(w, apo))
    const Y = vscale(w, -1)
    const ids: number[] = []
    for (let k = 2; k < n; k++) {
      const ang = Math.PI / 2 + Math.PI / n - (k * 2 * Math.PI) / n
      const pos = vadd(c, vadd(vscale(e, R * Math.cos(ang)), vscale(Y, R * Math.sin(ang))))
      ids.push(this.add(els[k - 2], [pos[0], pos[1], (pi[2] + pj[2]) / 2]))
    }
    const chain = [j, ...ids, i]
    for (let k = 0; k < chain.length - 1; k++) this.bond(chain[k], chain[k + 1], orders[k] ?? 1)
    return ids
  }

  centroid(ids: number[]): Vec3 {
    return vscale(
      ids.reduce((s, k) => vadd(s, this.atoms[k].p), [0, 0, 0] as Vec3),
      1 / ids.length,
    )
  }
}
