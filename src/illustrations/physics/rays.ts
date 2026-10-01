/**
 * Imaging by a thin lens or a spherical mirror: 1/a + 1/a′ = 1/f.
 *
 * Sign convention (as in Czech school physics):
 *  - the object distance a > 0 (a real object in front of the element);
 *  - f > 0 for a converging element (convex lens, concave mirror), f < 0 for a
 *    diverging one (concave lens, convex mirror); content gives |f| in `focal`;
 *  - a′ > 0: a real image (behind a lens / in front of a mirror),
 *    a′ < 0: a virtual image (in front of a lens / behind a mirror);
 *  - magnification Z = −a′/a: Z < 0 inverted, Z > 0 upright.
 */
export type OpticalElement = 'convex-lens' | 'concave-lens' | 'concave-mirror' | 'convex-mirror' | 'plane-mirror'

export const isMirror = (e: OpticalElement) => e.endsWith('mirror')
export const isConverging = (e: OpticalElement) => e === 'convex-lens' || e === 'concave-mirror'

/** Signed focal length for the element (∞ for a plane mirror). */
export function signedFocal(element: OpticalElement, focal: number): number {
  if (element === 'plane-mirror') return Infinity
  return isConverging(element) ? Math.abs(focal) : -Math.abs(focal)
}

/** Image distance a′ (signed, see above); ±Infinity when the object is in the focus. */
export function imageDistance(f: number, a: number): number {
  if (!Number.isFinite(f)) return -a
  if (Math.abs(a - f) < 1e-12) return Infinity
  return (a * f) / (a - f)
}

/** Transverse magnification Z = −a′/a. */
export function magnification(f: number, a: number): number {
  const ai = imageDistance(f, a)
  return Number.isFinite(ai) ? -ai / a : Infinity
}

export interface ImageInfo {
  /** signed focal length */
  f: number
  /** image distance a′ (signed) */
  ai: number
  /** magnification Z */
  m: number
  /** false: rays leave parallel, no image */
  exists: boolean
  real: boolean
  upright: boolean
  size: 'larger' | 'smaller' | 'same'
}

export function imageOf(element: OpticalElement, focal: number, object: number): ImageInfo {
  const f = signedFocal(element, focal)
  const ai = imageDistance(f, object)
  const exists = Number.isFinite(ai)
  const m = exists ? -ai / object : Infinity
  const am = Math.abs(m)
  return {
    f,
    ai,
    m,
    exists,
    real: exists && ai > 0,
    upright: m > 0,
    size: Math.abs(am - 1) < 0.005 ? 'same' : am > 1 ? 'larger' : 'smaller',
  }
}

/** Czech description of the image: ["skutečný", "převrácený", "zmenšený"]. */
export function imageWords(info: ImageInfo): string[] {
  if (!info.exists) return ['obraz nevzniká (paprsky jsou rovnoběžné)']
  return [
    info.real ? 'skutečný' : 'zdánlivý',
    info.upright ? 'přímý' : 'převrácený',
    info.size === 'same' ? 'stejně velký' : info.size === 'larger' ? 'zvětšený' : 'zmenšený',
  ]
}

/**
 * The image's x position in the drawing (element at x = 0, object on the left
 * at x = −a): a lens forms real images on the right, a mirror on the left.
 */
export function imageX(element: OpticalElement, ai: number): number {
  return isMirror(element) ? -ai : ai
}
