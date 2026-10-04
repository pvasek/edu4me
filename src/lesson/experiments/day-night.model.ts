/**
 * Day and night in the `day-night` experiment (z2-2). The Earth turns 360° in 24 h from west to east,
 * so the Sun moves 15° of longitude per hour and the local (solar) time of a place is
 * UTC + longitude / 15° (east positive). The Sun stands overhead at the subsolar point
 * (longitude (12 h − UTC) · 15°, latitude = the declination δ of the date).
 *
 * Height of the Sun: sin h = sin φ sin δ + cos φ cos δ cos H, H = (local time − 12 h) · 15°.
 * The terminator (h = 0) runs at tan φ = −cos H / tan δ; at the equinox (δ = 0) it follows two meridians.
 * Geometric (centre of the Sun, no refraction or twilight), like the `sun-angle` experiment.
 */

const D = Math.PI / 180

export interface City {
  name: string
  lat: number
  lon: number
}
export const CITIES: City[] = [
  { name: 'Praha', lat: 50.09, lon: 14.42 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Tokio', lat: 35.68, lon: 139.69 },
]

export type DateId = 'brezen' | 'cerven' | 'prosinec'
export const DATES: Record<DateId, { label: string; decl: number }> = {
  brezen: { label: '21. března', decl: 0 },
  cerven: { label: '21. června', decl: 23.5 },
  prosinec: { label: '21. prosince', decl: -23.5 },
}

const mod = (a: number, n: number) => ((a % n) + n) % n

/** Longitude where the Sun is overhead at `utc` hours. */
export const subsolarLon = (utc: number) => mod((12 - utc) * 15 + 180, 360) - 180

/** Local solar time (hours, 0–24) at a longitude. */
export const solarTime = (utc: number, lon: number) => mod(utc + lon / 15, 24)

/** Height of the Sun above the horizon (degrees). */
export function sunHeight(lat: number, lon: number, utc: number, decl: number): number {
  const H = (solarTime(utc, lon) - 12) * 15 * D
  const s = Math.sin(lat * D) * Math.sin(decl * D) + Math.cos(lat * D) * Math.cos(decl * D) * Math.cos(H)
  return Math.asin(Math.max(-1, Math.min(1, s))) / D
}
export const isDay = (lat: number, lon: number, utc: number, decl: number) => sunHeight(lat, lon, utc, decl) > 0

/** Latitude of the terminator at a longitude (δ near 0 is nudged so the curve stays a function of longitude). */
export function terminatorLat(lon: number, utc: number, decl: number): number {
  const d = Math.abs(decl) < 0.05 ? 0.05 : decl
  const H = (solarTime(utc, lon) - 12) * 15 * D
  return Math.atan(-Math.cos(H) / Math.tan(d * D)) / D
}

/** The night side as a flat lon/lat ring: the terminator, closed over the pole that lies in darkness. */
export function nightRing(utc: number, decl: number, step = 2): number[] {
  const pole = (Math.abs(decl) < 0.05 ? 0.05 : decl) > 0 ? -90 : 90
  const out: number[] = []
  for (let lon = -180; lon <= 180; lon += step) out.push(lon, terminatorLat(lon, utc, decl))
  out.push(180, pole, -180, pole)
  return out
}

/** "13:58" */
export function clock(hours: number): string {
  const m = Math.round(mod(hours, 24) * 60) % (24 * 60)
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

/** The challenge: the Sun has just risen in Praha (it was below the horizon a quarter of an hour ago). */
export function sunriseInPraha(utc: number, decl: number): boolean {
  const { lat, lon } = CITIES[0]
  return isDay(lat, lon, utc, decl) && !isDay(lat, lon, utc - 0.25, decl)
}
