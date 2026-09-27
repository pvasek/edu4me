/**
 * Species → small 2D particle glyphs (library molecules projected, single atoms,
 * or automatic clusters), plus equation parsing and atom tallies for ReactionView.
 */
import { parseFormula } from '../../courses/chemie/data/formula'
import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { alkane, chargeOf, findMolecule, finish, stripCharge, type MoleculeData } from '../molecules/library'
import { matMul, matVec, principalAxes, rotX, rotY, type Vec3 } from '../molecules/geometry'
import { isMetal, particleRadius } from '../molecules/cpk'

export interface GlyphAtom {
  el: string
  x: number
  y: number
  z: number
  r: number
}
export interface Glyph {
  atoms: GlyphAtom[]
  bonds: { a: number; b: number; order: number }[]
  /** largest extent in Å (diameter of the drawing) */
  span: number
  /** net charge, shown as a badge */
  charge: number
}

// ------------------------------------------------------------------ glyphs
const cache = new Map<string, Glyph>()

/** "2H2O(l)" → "H2O"; keeps charges. */
export function stripState(s: string) {
  return s.trim().replace(/\((s|l|g|aq)\)$/, '')
}

export function glyphFor(species: string): Glyph {
  const key = stripState(species)
  let g = cache.get(key)
  if (!g) {
    g = makeGlyph(key)
    cache.set(key, g)
  }
  return g
}

function makeGlyph(sp: string): Glyph {
  const mol = findMolecule(sp)
  if (mol) return fromMolecule(mol)
  const charge = chargeOf(sp)
  let counts: Record<string, number>
  try {
    counts = parseFormula(stripCharge(sp))
  } catch {
    return center2d({ atoms: [{ el: '?', x: 0, y: 0, z: 0, r: 0.9 }], bonds: [], span: 0, charge: 0 })
  }
  const els = Object.keys(counts)
  const total = els.reduce((s, e) => s + counts[e], 0)
  if (total === 1) return center2d({ atoms: [{ el: els[0], x: 0, y: 0, z: 0, r: particleRadius(els[0]) }], bonds: [], span: 0, charge })
  // linear alkanes (octane, hexane…)
  if (els.length === 2 && counts.C && counts.H === 2 * counts.C + 2 && counts.C <= 20)
    return withCharge(fromMolecule(finish('alkane', '', sp, alkane(counts.C))), charge)
  const comp = composite(stripCharge(sp))
  if (comp) return withCharge(comp, charge)
  if (els.some(isMetal)) return withCharge(ionicCluster(counts), charge)
  return withCharge(covalentCluster(counts), charge)
}

function withCharge(g: Glyph, q: number): Glyph {
  return { ...g, charge: q || g.charge }
}

/** Library molecule → readable 2D view (principal plane, slight tilt). */
function fromMolecule(m: MoleculeData): Glyph {
  const pts = m.atoms.map((a) => a.p)
  const M = matMul(rotX(0.32), matMul(rotY(0.28), pts.length > 1 ? principalAxes(pts) : [1, 0, 0, 0, 1, 0, 0, 0, 1]))
  const atoms = m.atoms.map((a) => {
    const q: Vec3 = matVec(M, a.p)
    return { el: a.el, x: q[0], y: -q[1], z: q[2], r: particleRadius(a.el) }
  })
  return center2d({ atoms, bonds: m.bonds.map((b) => ({ ...b })), span: 0, charge: m.charge })
}

function center2d(g: Glyph): Glyph {
  let x0 = Infinity
  let x1 = -Infinity
  let y0 = Infinity
  let y1 = -Infinity
  for (const a of g.atoms) {
    x0 = Math.min(x0, a.x - a.r)
    x1 = Math.max(x1, a.x + a.r)
    y0 = Math.min(y0, a.y - a.r)
    y1 = Math.max(y1, a.y + a.r)
  }
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  return {
    ...g,
    atoms: g.atoms.map((a) => ({ ...a, x: a.x - cx, y: a.y - cy })),
    span: Math.max(x1 - x0, y1 - y0),
  }
}

/** Metal + known polyatomic anion: "CaCO3", "Ca(OH)2", "Na2SO4", "KNO3". */
function composite(f: string): Glyph | null {
  const m = f.match(/^([A-Z][a-z]?)(\d*)(.+)$/)
  if (!m || !isMetal(m[1]) || !BY_SYMBOL[m[1]]) return null
  const metal = m[1]
  const mCount = m[2] ? Number(m[2]) : 1
  let anion = m[3]
  let aCount = 1
  const par = anion.match(/^\((.+)\)(\d*)$/)
  if (par) {
    anion = par[1]
    aCount = par[2] ? Number(par[2]) : 1
  }
  let mol: MoleculeData | undefined
  for (const q of ['-', '^-', '^2-', '^3-']) {
    mol = findMolecule(anion + q)
    if (mol && mol.charge < 0) break
    mol = undefined
  }
  if (!mol || mCount + aCount > 6) return null
  const ag = fromMolecule(mol)
  const parts: Glyph[] = []
  const metalG = (): Glyph => ({ atoms: [{ el: metal, x: 0, y: 0, z: 0, r: particleRadius(metal) }], bonds: [], span: particleRadius(metal) * 2, charge: 0 })
  // alternate M A M A …
  let mi = mCount
  let ai = aCount
  while (mi || ai) {
    if (mi >= ai && mi) {
      parts.push(metalG())
      mi--
    } else {
      parts.push(ag)
      ai--
    }
  }
  const cols = parts.length <= 3 ? parts.length : Math.ceil(parts.length / 2)
  const cell = Math.max(...parts.map((p) => p.span)) * 0.92
  const atoms: GlyphAtom[] = []
  const bonds: Glyph['bonds'] = []
  parts.forEach((p, k) => {
    const cx = (k % cols) * cell
    const cy = Math.floor(k / cols) * cell * 0.9
    const off = atoms.length
    for (const a of p.atoms) atoms.push({ ...a, x: a.x + cx, y: a.y + cy })
    for (const b of p.bonds) bonds.push({ ...b, a: b.a + off, b: b.b + off })
  })
  return center2d({ atoms, bonds, span: 0, charge: 0 })
}

/** Ionic solid formula unit: touching spheres, cations and anions alternating. */
function ionicCluster(counts: Record<string, number>): Glyph {
  const els = Object.keys(counts).sort((a, b) => Number(isMetal(b)) - Number(isMetal(a)))
  const list: string[] = []
  const left = { ...counts }
  while (list.length < Object.values(counts).reduce((s, n) => s + n, 0)) {
    for (const e of els) if (left[e] > 0) {
      list.push(e)
      left[e]--
    }
  }
  const n = list.length
  const cols = n <= 3 ? n : Math.ceil(Math.sqrt(n))
  const d = Math.max(...list.map(particleRadius)) * 1.75
  const atoms = list.map((el, k) => {
    const r = Math.floor(k / cols)
    const c = r % 2 ? cols - 1 - (k % cols) : k % cols
    return { el, x: c * d + (r % 2) * d * 0.5, y: r * d * 0.88, z: 0, r: particleRadius(el) }
  })
  return center2d({ atoms, bonds: [], span: 0, charge: 0 })
}

/** Central atom with the other atoms arranged around it. */
function covalentCluster(counts: Record<string, number>): Glyph {
  const en = (e: string) => BY_SYMBOL[e]?.en ?? 2.5
  const heavy = Object.keys(counts).filter((e) => e !== 'H')
  const pool = heavy.length ? heavy : Object.keys(counts)
  const center = [...pool].sort((a, b) => counts[a] - counts[b] || en(a) - en(b))[0]
  const ligands: string[] = []
  for (const [e, n] of Object.entries(counts)) for (let k = 0; k < n - (e === center ? 1 : 0); k++) ligands.push(e)
  // heavier ligands first so hydrogens fill the gaps
  ligands.sort((a, b) => particleRadius(b) - particleRadius(a))
  const rc = particleRadius(center)
  const atoms: GlyphAtom[] = [{ el: center, x: 0, y: 0, z: 0, r: rc }]
  const bonds: Glyph['bonds'] = []
  const inner = ligands.slice(0, 8)
  const outer = ligands.slice(8)
  inner.forEach((el, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / inner.length
    const d = (rc + particleRadius(el)) * 0.8
    atoms.push({ el, x: Math.cos(a) * d, y: Math.sin(a) * d, z: Math.sin(a * 2) * 0.3, r: particleRadius(el) })
    bonds.push({ a: 0, b: atoms.length - 1, order: 1 })
  })
  const R2 = (rc + 1.6) * 1.35
  outer.forEach((el, k) => {
    const a = -Math.PI / 2 + ((k + 0.5) * 2 * Math.PI) / outer.length
    atoms.push({ el, x: Math.cos(a) * R2, y: Math.sin(a) * R2, z: -0.5, r: particleRadius(el) })
  })
  return center2d({ atoms, bonds, span: 0, charge: 0 })
}

// ------------------------------------------------------------------ equations
export interface Term {
  coef: number
  /** formula without state, e.g. "H2O", "SO4^2-" */
  species: string
  state?: string
  /** display text for <Md>, e.g. "2H2O(l)" */
  text: string
}
export interface Equation {
  left: Term[]
  right: Term[]
  reversible: boolean
}

export function parseEquation(eq: string): Equation | null {
  const reversible = /<=>|⇌/.test(eq)
  const sides = eq.split(/<=>|->|→|⇌/)
  if (sides.length !== 2) return null
  const side = (s: string): Term[] =>
    s
      .split(/\s+\+\s+/)
      .map((raw) => raw.trim())
      .filter(Boolean)
      .map((raw) => {
        const m = raw.match(/^(\d*)\s*(.+?)(?:\((s|l|g|aq)\))?$/)!
        const coef = m[1] ? Number(m[1]) : 1
        return { coef, species: m[2].trim(), state: m[3], text: raw.replace(/\s+/g, '') }
      })
  const left = side(sides[0])
  const right = side(sides[1])
  if (!left.length || !right.length) return null
  return { left, right, reversible }
}

/** Element counts of a species (library ids resolved through their formula). */
export function countsOf(species: string): Record<string, number> {
  try {
    return parseFormula(stripCharge(species))
  } catch {
    const m = findMolecule(species)
    return m ? parseFormula(stripCharge(m.formula)) : {}
  }
}

export interface TallyRow {
  el: string
  left: number
  right: number
}

/** Atom counts per element on both sides, in order of first appearance. */
export function tally(eq: Equation): TallyRow[] {
  const order: string[] = []
  const sum = (terms: Term[]) => {
    const t: Record<string, number> = {}
    for (const term of terms)
      for (const [el, n] of Object.entries(countsOf(term.species))) {
        if (!order.includes(el)) order.push(el)
        t[el] = (t[el] ?? 0) + n * term.coef
      }
    return t
  }
  const l = sum(eq.left)
  const r = sum(eq.right)
  return order.map((el) => ({ el, left: l[el] ?? 0, right: r[el] ?? 0 }))
}

export function chargeTally(eq: Equation): { left: number; right: number } | null {
  const q = (terms: Term[]) => terms.reduce((s, t) => s + t.coef * chargeOf(t.species), 0)
  const any = [...eq.left, ...eq.right].some((t) => chargeOf(t.species) !== 0)
  return any ? { left: q(eq.left), right: q(eq.right) } : null
}

// ------------------------------------------------------------------ seeded RNG
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
