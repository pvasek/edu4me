/**
 * Paprsky – pure geometric optics (Czech sign convention, as in Czech textbooks).
 *
 *   Zobrazovací rovnice   1/a + 1/a′ = 1/f
 *   Příčné zvětšení       Z = y′/y = −a′/a
 *   Optická mohutnost     φ = 1/f   (f v metrech, φ v dioptriích D)
 *
 * a > 0: real object in front of the lens / mirror.
 * a′ > 0: real image (behind a lens, in front of a mirror); a′ < 0: virtual image.
 * f > 0: spojka, duté zrcadlo; f < 0: rozptylka, vypuklé zrcadlo.
 * Z > 0: přímý, Z < 0: převrácený; |Z| > 1 zvětšený, |Z| < 1 zmenšený.
 *
 * Drawing coordinates: the lens / mirror vertex is at x = 0, the object stands
 * at x = −a (left), heights are +up.
 */

export type Element = 'spojka' | 'rozptylka' | 'duté' | 'vypuklé'

export const ELEMENTS: Element[] = ['spojka', 'rozptylka', 'duté', 'vypuklé']

export const isMirror = (e: Element) => e === 'duté' || e === 'vypuklé'
export const isConverging = (e: Element) => e === 'spojka' || e === 'duté'
/** Signed focal length for an element and |f|. */
export const signedF = (e: Element, absF: number) => (isConverging(e) ? absF : -absF)

export const ELEMENT_NAME: Record<Element, string> = {
  spojka: 'spojka',
  rozptylka: 'rozptylka',
  duté: 'duté zrcadlo',
  vypuklé: 'vypuklé zrcadlo',
}
/** "před spojkou" / "před zrcadlem" */
export const beforeWord = (e: Element) => (isMirror(e) ? 'před zrcadlem' : e === 'spojka' ? 'před spojkou' : 'před rozptylkou')

export interface Scene {
  el: Element
  /** Signed focal length. */
  f: number
  /** Object distance (> 0). */
  a: number
  /** Object height (> 0). */
  h: number
}

export interface Image {
  /** Image distance a′ (null = the image does not form, object in the focus). */
  ap: number | null
  /** Transverse magnification Z (null when no image). */
  Z: number | null
}

export function imageOf(f: number, a: number): Image {
  if (Math.abs(a - f) < 1e-9 * Math.max(1, Math.abs(f))) return { ap: null, Z: null }
  const ap = (a * f) / (a - f)
  return { ap, Z: -ap / a }
}

/** f from a and a′: 1/f = 1/a + 1/a′. */
export const focalFrom = (a: number, ap: number) => (a * ap) / (a + ap)
/** Optical power in dioptres from f in centimetres. */
export const dioptres = (fCm: number) => 100 / fCm
/** Focal length in centimetres from optical power in dioptres. */
export const focalFromPower = (phi: number) => 100 / phi

export type Size = 'zvětšený' | 'zmenšený' | 'stejně velký'
export interface Props {
  real: boolean
  size: Size
  inverted: boolean
}

/** Properties of the image; null when the object is in the focus (no image). */
export function propsOf(img: Image): Props | null {
  if (img.ap === null || img.Z === null) return null
  const m = Math.abs(img.Z)
  return {
    real: img.ap > 0,
    size: Math.abs(m - 1) < 1e-6 ? 'stejně velký' : m > 1 ? 'zvětšený' : 'zmenšený',
    inverted: img.Z < 0,
  }
}

export const propsText = (p: Props | null) =>
  p ? `${p.real ? 'skutečný' : 'zdánlivý'}, ${p.size}, ${p.inverted ? 'převrácený' : 'přímý'}` : 'obraz nevznikne'

/** Image position in drawing coordinates (x, y of the arrow tip). */
export function imagePoint(s: Scene): { x: number; y: number } | null {
  const img = imageOf(s.f, s.a)
  if (img.ap === null || img.Z === null) return null
  return { x: isMirror(s.el) ? -img.ap : img.ap, y: img.Z * s.h }
}

/** Where the object stands relative to F and 2F (Czech phrase). */
export function zone(s: Scene): string {
  const f = Math.abs(s.f)
  if (!isConverging(s.el)) return 'kdekoli před ní'
  const r = s.a / f
  const two = isMirror(s.el) ? 'S (2f)' : '2F'
  if (Math.abs(r - 1) < 1e-9) return 'v ohnisku'
  if (Math.abs(r - 2) < 1e-9) return `ve vzdálenosti 2f (v bodě ${two})`
  if (r > 2) return `dál než 2f (za bodem ${two})`
  if (r > 1) return 'mezi f a 2f'
  return 'blíž než ohnisko'
}

// ------------------------------------------------------------------ principal rays

export interface Pt {
  x: number
  y: number
}
export interface RaySeg {
  from: Pt
  to: Pt
  /** Dashed: backward extension of a ray (virtual image), not real light. */
  virtual: boolean
}
export interface Ray {
  /** 'parallel' = rovnoběžný s osou, 'center' = středový / do vrcholu, 'focal' = ohniskový. */
  kind: 'parallel' | 'center' | 'focal'
  segs: RaySeg[]
}

export interface View {
  x0: number
  x1: number
  y0: number
  y1: number
}

/** Extends a ray from `p` in direction `d` to the edge of the view. */
export function toEdge(p: Pt, d: Pt, v: View): Pt {
  let t = Infinity
  if (d.x > 1e-12) t = Math.min(t, (v.x1 - p.x) / d.x)
  if (d.x < -1e-12) t = Math.min(t, (v.x0 - p.x) / d.x)
  if (d.y > 1e-12) t = Math.min(t, (v.y1 - p.y) / d.y)
  if (d.y < -1e-12) t = Math.min(t, (v.y0 - p.y) / d.y)
  if (!Number.isFinite(t) || t < 0) t = 0
  return { x: p.x + d.x * t, y: p.y + d.y * t }
}

/**
 * The three principal rays from the object tip (−a, h).
 * Lens: parallel → through F′ (x = f); through the centre undeviated; through F (x = −f) → parallel.
 * Mirror: parallel → through F (x = −f); to the vertex → symmetric; through F → parallel.
 * Virtual images get dashed backward extensions to the image point.
 * The focal ray is left out when the object stands in the focus.
 */
export function principalRays(s: Scene, v: View): Ray[] {
  const { f, a, h } = s
  const P = { x: -a, y: h }
  const mirror = isMirror(s.el)
  const img = imagePoint(s)
  const virtual = img !== null && imageOf(f, a).ap! < 0
  const rays: Ray[] = []
  const sg = Math.sign(f)

  const add = (kind: Ray['kind'], hit: Pt, dir: Pt) => {
    const segs: RaySeg[] = [{ from: P, to: hit, virtual: false }, { from: hit, to: toEdge(hit, dir, v), virtual: false }]
    if (virtual && img) segs.push({ from: hit, to: img, virtual: true })
    rays.push({ kind, segs })
  }

  // 1. parallel to the axis
  const hit1 = { x: 0, y: h }
  const d1 = mirror ? { x: -Math.abs(f), y: -h * sg } : { x: Math.abs(f), y: -h * sg }
  add('parallel', hit1, d1)

  // 2. through the centre of the lens / to the vertex of the mirror
  const hit2 = { x: 0, y: 0 }
  add('center', hit2, mirror ? { x: -a, y: -h } : { x: a, y: -h })

  // 3. focal ray: aimed at F on the object side (x = −f), leaves parallel
  if (Math.abs(a - f) > 1e-9) {
    const y0 = (h * f) / (f - a)
    const hit3 = { x: 0, y: y0 }
    add('focal', hit3, mirror ? { x: -1, y: 0 } : { x: 1, y: 0 })
  }
  return rays
}

// ------------------------------------------------------------------ reflection & refraction

/** Law of reflection: the angle of reflection equals the angle of incidence (both from the normal). */
export const reflectionAngle = (alpha: number) => alpha

export interface Medium {
  name: string
  /** "ve vodě" etc. */
  loc: string
  n: number
}
export const MEDIA: Medium[] = [
  { name: 'vzduch', loc: 've vzduchu', n: 1.0 },
  { name: 'voda', loc: 've vodě', n: 1.33 },
  { name: 'sklo', loc: 've skle', n: 1.5 },
  { name: 'diamant', loc: 'v diamantu', n: 2.42 },
]

export type Bend = 'toward' | 'away' | 'straight' | 'total'
export const BEND_TEXT: Record<Bend, string> = {
  toward: 'láme se ke kolmici',
  away: 'láme se od kolmice',
  straight: 'jde dál beze změny směru',
  total: 'nastane úplný odraz',
}

/** Angle of refraction in degrees from Snell's law; null = total internal reflection. */
export function refractionAngle(n1: number, n2: number, alphaDeg: number): number | null {
  const s = (n1 / n2) * Math.sin((alphaDeg * Math.PI) / 180)
  if (s > 1 + 1e-12) return null
  return (Math.asin(Math.min(1, s)) * 180) / Math.PI
}

/** Critical angle in degrees for going from n1 into n2 (n1 > n2); null when it cannot happen. */
export const criticalAngle = (n1: number, n2: number) => (n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null)

export function bendOf(n1: number, n2: number, alphaDeg: number): Bend {
  if (alphaDeg === 0 || n1 === n2) return 'straight'
  const b = refractionAngle(n1, n2, alphaDeg)
  if (b === null) return 'total'
  return n2 > n1 ? 'toward' : 'away'
}

// ------------------------------------------------------------------ numbers

/** Czech number: 3 significant digits (max 2 decimals), decimal comma, real minus sign. */
export function fmt(x: number, maxDec = 2): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞'
  const abs = Math.abs(x)
  const dec = abs === 0 ? 0 : Math.min(maxDec, Math.max(0, 2 - Math.floor(Math.log10(abs))))
  let s = abs.toFixed(dec)
  if (s.includes('.')) s = s.replace(/\.?0+$/, '')
  const neg = x < 0 && Number(s) !== 0
  return (neg ? '−' : '') + s.replace('.', ',')
}

/** Parses "−6,67", "-6.67", "30 cm", "2,5 D", "+4" → number; null when it is not a number. */
export function parseNum(s: string): number | null {
  const clean = s
    .replace(/\s/g, '')
    .replace(/[−–]/g, '-')
    .replace(/^\+/, '')
    .replace(/(cm|m|D|dpt|°)$/i, '')
    .replace(',', '.')
  if (!/^-?\d+(\.\d*)?$|^-?\.\d+$/.test(clean)) return null
  const n = Number(clean)
  return Number.isFinite(n) ? n : null
}

/** Relative tolerance of numeric answers: ±2 %. */
export const REL_TOL = 0.02

export const within = (value: number, answer: number, rel = REL_TOL) => Math.abs(value - answer) <= Math.max(Math.abs(answer) * rel, 0.01) + 1e-9

/**
 * Is a dragged image marker close enough to the real image? Tolerance in
 * x: max(tolX·|a′|, tolF·|f|); in y: the sign must match and the height be
 * within max(tolY·|y′|, tolF·h).
 */
export function nearImage(s: Scene, mark: Pt, tol = { x: 0.2, y: 0.35, f: 0.3 }): { ok: boolean; dx: number; dy: number } {
  const p = imagePoint(s)
  if (!p) return { ok: false, dx: Infinity, dy: Infinity }
  const dx = Math.abs(mark.x - p.x)
  const dy = Math.abs(mark.y - p.y)
  const okX = dx <= Math.max(tol.x * Math.abs(p.x), tol.f * Math.abs(s.f))
  const okY = Math.sign(mark.y) === Math.sign(p.y) && dy <= Math.max(tol.y * Math.abs(p.y), tol.f * s.h)
  return { ok: okX && okY, dx, dy }
}
