/**
 * Model of the `pressure-wind` experiment (z4-2): a high (H, tlaková výše) and a
 * low (N, tlaková níže) DIST_KM apart, isobars every 5 hPa.
 *
 * - Air moves from high to low pressure; the force pushing it is the pressure
 *   gradient Δp / L, so denser isobars mean a stronger wind.
 * - Speed: the geostrophic wind v_g = (Δp / L) / (ρ · f) with f = 2Ω · sin φ
 *   (φ = 50° s. š.); near the ground friction slows it to about 0,65 · v_g
 *   (over land). The same estimate is shown with the rotation switched off, so
 *   only the direction changes when the learner toggles it.
 * - Direction: without the Earth's rotation the wind blows straight across the
 *   isobars, from H to N. With rotation (northern hemisphere) it is deflected to
 *   the right: it spirals clockwise out of a high and anticlockwise into a low.
 *   Aloft it would blow along the isobars; near the ground friction makes it cross
 *   them at about 30° (CROSS_ANGLE), still towards the low.
 */

export const DIST_KM = 1500
export const P_MID = 1010
export const ISOBAR_STEP = 5
export const DP_MAX = 60
/** air density near the ground (kg/m³) */
export const RHO = 1.25
export const LAT = 50
/** Coriolis parameter at LAT (1/s) */
export const F_COR = 2 * 7.292e-5 * Math.sin((LAT * Math.PI) / 180)
/** near-ground wind as a share of the geostrophic wind (friction over land) */
export const SURFACE = 0.65
/** angle between the near-ground wind and the isobars (°) */
export const CROSS_ANGLE = 30

/** Pressure in the centre of the high and the low (hPa). */
export const centres = (dp: number) => ({ high: P_MID + dp / 2, low: P_MID - dp / 2 })

/**
 * Isobars around each centre, outermost (P_MID) first, with their radius as a share
 * of the outermost one; equal spacing = an even pressure gradient.
 */
export function isobars(dp: number): { high: [number, number][]; low: [number, number][] } {
  const half = dp / 2
  const high: [number, number][] = []
  const low: [number, number][] = []
  for (let j = 0; j * ISOBAR_STEP < half; j++) {
    const r = (half - j * ISOBAR_STEP) / half
    high.push([P_MID + j * ISOBAR_STEP, r])
    low.push([P_MID - j * ISOBAR_STEP, r])
  }
  return { high, low }
}

/** Wind speed near the ground (m/s) for a pressure difference dp (hPa) over DIST_KM. */
export function windSpeed(dp: number): number {
  const grad = (dp * 100) / (DIST_KM * 1000)
  return (SURFACE * grad) / (RHO * F_COR)
}

/** Beaufort scale: upper limits in m/s and the Czech names (ČHMÚ). */
const BF_MAX = [0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.4, 28.4, 32.6]
const BF_NAME = [
  'bezvětří',
  'vánek',
  'slabý vítr',
  'mírný vítr',
  'dosti čerstvý vítr',
  'čerstvý vítr',
  'silný vítr',
  'mírný vichr',
  'čerstvý vichr',
  'silný vichr',
  'plný vichr',
  'vichřice',
  'orkán',
]
export function beaufort(v: number): { force: number; name: string } {
  let force = BF_MAX.findIndex((m) => v <= m + 1e-9)
  if (force < 0) force = 12
  return { force, name: BF_NAME[force] }
}

/**
 * A streamline near one centre, in screen coordinates (y grows downwards, north up).
 * r0 → r1: growing leaves a high, shrinking enters a low. With `rotate` (northern hemisphere)
 * it is a logarithmic spiral crossing every circle (isobar) at CROSS_ANGLE: clockwise
 * out of a high, anticlockwise into a low; without rotation it is a straight ray.
 */
export function streamline(
  cx: number,
  cy: number,
  a0: number,
  r0: number,
  r1: number,
  rotate: boolean,
  n = 24,
): [number, number][] {
  const pts: [number, number][] = []
  const k = Math.tan((CROSS_ANGLE * Math.PI) / 180)
  for (let i = 0; i <= n; i++) {
    const r = r0 + ((r1 - r0) * i) / n
    // log spiral: dθ = ln(r / r0) / tan α; screen angles grow clockwise (y down)
    const turn = rotate ? Math.log(r / r0) / k : 0
    // out of a high r grows, so θ grows (clockwise on screen); into a low r shrinks,
    // ln < 0 and θ falls (anticlockwise): one formula gives both senses
    const a = a0 + turn
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}

/** The challenge: a strong wind (Beaufort 6) and the Earth rotating. */
export const challengeMet = (dp: number, rotate: boolean) => rotate && beaufort(windSpeed(dp)).force === 6
