/**
 * Model of the `sea-level-rise` experiment (z7-7, z10-7): raise the sea and see a
 * low coast (a delta with fields and a town) and an atoll go under.
 *
 * Numbers (rise relative to today, i.e. ≈ 1995–2014):
 * - since 1900 the sea has already risen ≈ 0,2 m (IPCC AR6: 0,20 m, 1901–2018);
 * - by 2050 ≈ 0,15–0,3 m; by 2100 ≈ 0,3–1 m depending on emissions (IPCC AR6
 *   likely ranges: SSP1-1.9 0,28–0,55 m … SSP5-8.5 0,63–1,01 m); close to 2 m by
 *   2100 cannot be ruled out if the ice sheets collapse; in later centuries several
 *   metres (2300: up to ≈ 7 m under very high emissions).
 * - People living low: ≈ 110 mil. already below today's high-tide line (behind
 *   dikes) and ≈ 230 mil. less than 1 m above it (Kulp a Strauss 2019, Nature
 *   Communications, corrected); ≈ 267 mil. on land less than 2 m above sea level
 *   (Hooijer a Vernimmen 2021, Nature Communications).
 * The coast and atoll profiles are schematic (heights in m, widths arbitrary).
 */

export const H_MAX = 3
export const SINCE_1900 = 0.2

/** Schematic profiles [x, height in m]; x in drawing units. */
export const COAST: [number, number][] = [
  [0, -3],
  [70, -1.2],
  [96, 0],
  [112, 0.4],
  [150, 0.5],
  [190, 0.7],
  [226, 1.1],
  [260, 1.6],
  [292, 2.3],
  [320, 3.2],
  [352, 4.4],
]
export const ATOLL: [number, number][] = [
  [0, -3],
  [44, -2.4],
  [70, 0],
  [82, 0.5],
  [100, 0.9],
  [118, 1.8],
  [134, 1.1],
  [150, 0.5],
  [160, 0],
  [176, -1.6],
  [200, -2],
  [226, -1.6],
  [240, 0],
  [252, 0.6],
  [270, 1.2],
  [286, 0.8],
  [298, 0],
  [324, -2.4],
  [352, -3],
]

/** Height of a profile at x (linear between points). */
export function heightAt(profile: [number, number][], x: number): number {
  if (x <= profile[0][0]) return profile[0][1]
  for (let i = 1; i < profile.length; i++) {
    const [x0, y0] = profile[i - 1]
    const [x1, y1] = profile[i]
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return profile[profile.length - 1][1]
}

/** Share of the land (today above the sea, height > 0) that a sea level h covers. */
export function floodedShare(profile: [number, number][], h: number): number {
  let land = 0
  let wet = 0
  const x0 = profile[0][0]
  const x1 = profile[profile.length - 1][0]
  for (let x = x0; x < x1; x += 0.5) {
    const z = heightAt(profile, x + 0.25)
    if (z > 0) {
      land++
      if (z <= h) wet++
    }
  }
  return land ? wet / land : 0
}

export type When = 'dnes' | '2050' | '2100' | 'pozdeji'
export function when(h: number): When {
  if (h < 0.05) return 'dnes'
  if (h < 0.3) return '2050'
  if (h <= 1.0 + 1e-9) return '2100'
  return 'pozdeji'
}

/** How many people live lower than the new sea level (from the two studies; their datums differ, so only bounds). */
export function people(h: number): string {
  if (h < 0.05) return '≈ 110 mil.'
  if (h < 1 - 1e-9) return '110–230 mil.'
  if (h < 2 - 1e-9) return 'přes 230 mil.'
  return 'přes 267 mil.'
}

/** The challenge: the worst likely case for 2100 (≈ 1 m). */
export const challengeMet = (h: number) => Math.abs(h - 1) < 1e-6
