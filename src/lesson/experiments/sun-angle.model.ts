/**
 * Astronomy of the `sun-angle` experiment (z2-4, z2-5): the Sun's noon height and the
 * length of the day from the latitude φ and the date.
 *
 * - Solar declination δ (the latitude where the Sun stands overhead at noon), with the
 *   axis tilt ε = 23,5° as Czech textbooks round it. δ follows a sine through the year,
 *   pinned to the four textbook dates: 0° on 21 March and 23 September, +ε on 21 June,
 *   −ε on 21 December (within about 0,5° of the true declination all year).
 * - Noon height of the Sun: h = 90° − |φ − δ| (negative = below the horizon all day).
 * - Day length from the sunrise hour angle H₀: cos H₀ = −tan φ · tan δ, day = 2·H₀ / 15° h.
 *   When −tan φ · tan δ ≤ −1 the Sun never sets (polar day, 24 h), when ≥ 1 it never rises
 *   (polar night, 0 h). Geometric: the centre of the Sun, without refraction, so the
 *   equinox gives 12 h everywhere and the polar circle 66,5° has exactly 24 h on 21 June.
 * - Local solar time: sunrise 12 h − H₀/15°, sunset 12 h + H₀/15°.
 */

export const TILT = 23.5
const RAD = Math.PI / 180

/** Days from 1 January (0) of the four turning points, in a common year of 365 days. */
export const MAR21 = 79
export const JUN21 = 171
export const SEP23 = 265
export const DEC21 = 354
export const YEAR = 365

/** Solar declination in degrees for a day of the year (0 = 1 January). */
export function declination(day: number): number {
  const d = ((day % YEAR) + YEAR) % YEAR
  // quarter of the sine: [start day, start phase]
  const q: [number, number, number][] = [
    [MAR21, JUN21, 0],
    [JUN21, SEP23, 90],
    [SEP23, DEC21, 180],
    [DEC21, MAR21 + YEAR, 270],
  ]
  const dd = d < MAR21 ? d + YEAR : d
  for (const [a, b, ph] of q)
    if (dd >= a && dd < b) {
      const phase = ph + ((dd - a) / (b - a)) * 90
      return TILT * Math.sin(phase * RAD)
    }
  return 0
}

/** Noon height of the Sun above the horizon (°); negative when it stays below the horizon. */
export const noonHeight = (lat: number, decl: number) => 90 - Math.abs(lat - decl)

/** Where the Sun is at noon: to the south, to the north or straight overhead. */
export function noonSide(lat: number, decl: number): 'jih' | 'sever' | 'zenit' {
  if (Math.abs(lat - decl) < 0.05) return 'zenit'
  return lat > decl ? 'jih' : 'sever'
}

const EPS = 1e-9

/** Sunrise hour angle H₀ in degrees (0 = polar night, 180 = polar day). */
export function sunriseAngle(lat: number, decl: number): number {
  const x = -Math.tan(lat * RAD) * Math.tan(decl * RAD)
  if (!Number.isFinite(x) || Number.isNaN(x)) return 90
  if (x <= -1 + EPS) return 180
  if (x >= 1 - EPS) return 0
  return Math.acos(x) / RAD
}

/** Day length in hours (0–24). */
export const dayLength = (lat: number, decl: number) => (2 * sunriseAngle(lat, decl)) / 15

export type DayKind = 'polarni-den' | 'polarni-noc' | 'den-a-noc'
export function dayKind(lat: number, decl: number): DayKind {
  const h0 = sunriseAngle(lat, decl)
  return h0 >= 180 ? 'polarni-den' : h0 <= 0 ? 'polarni-noc' : 'den-a-noc'
}

/** Sunrise and sunset in local solar time (hours). */
export function sunTimes(lat: number, decl: number): { rise: number; set: number } {
  const half = sunriseAngle(lat, decl) / 15
  return { rise: 12 - half, set: 12 + half }
}

/** How strongly the noon Sun heats 1 m² compared with the Sun overhead: sin h (0 when below). */
export const heating = (h: number) => (h > 0 ? Math.sin(h * RAD) : 0)

const MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince']
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** "21. června" for a day of the year (0 = 1 January, common year). */
export function dateText(day: number): string {
  let d = Math.round(day)
  for (let m = 0; m < 12; m++) {
    if (d < MDAYS[m]) return `${d + 1}. ${MONTHS[m]}`
    d -= MDAYS[m]
  }
  return '31. prosince'
}

/** "16 h 10 min" (rounded to whole minutes). */
export function hm(hours: number): string {
  const total = Math.round(hours * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

/** "3:55" for a time of day in hours. */
export function clock(hours: number): string {
  const total = Math.round(hours * 60)
  const h = Math.floor(total / 60) % 24
  return `${h}:${String(total % 60).padStart(2, '0')}`
}

/** The challenge: on 21 June find the southernmost latitude with polar day (the polar circle). */
export function challengeMet(lat: number, day: number): boolean {
  if (Math.round(day) !== JUN21) return false
  const d = declination(day)
  return dayKind(lat, d) === 'polarni-den' && dayKind(lat - 0.5, d) !== 'polarni-den'
}

/** "50° s. š.", "23,5° j. š.", "0° (rovník)" – the decimal comma, no minus sign. */
export function latText(lat: number): string {
  if (Math.abs(lat) < 1e-9) return '0° (rovník)'
  const v = Math.abs(lat).toFixed(1).replace(/\.0$/, '').replace('.', ',')
  return `${v}° ${lat > 0 ? 's. š.' : 'j. š.'}`
}
