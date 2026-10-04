/**
 * Tides of the `tides` experiment (z2-6). Seen from above the North Pole, the Sun far to
 * the left; the Moon goes round the Earth anticlockwise once per synodic month (29,5 days,
 * new Moon to new Moon), so the angle Sun–Earth–Moon is 360° · d / 29,5 after d days.
 *
 * The tidal force of a body stretches the ocean into two bulges, one under the body and
 * one on the opposite side: the height along the equator at angle α is ∝ cos 2(α − θ).
 * The Sun's tide is 0,46 of the Moon's (its mass is huge, but it is 390× farther and the
 * tidal force falls with the cube of the distance). Two such cos 2α patterns add up to one
 * of amplitude A = √(1 + s² + 2s · cos 2(θ_M − θ_S)), s = 0,46:
 * - Sun, Earth and Moon in line (new or full Moon): A = 1,46 → spring tide (skočný příliv);
 * - at right angles (first or last quarter): A = 0,54 → neap tide (hluchý příliv).
 * Every place on the Earth passes both bulges in one lunar day (24 h 50 min): two high and
 * two low tides a day.
 */

export const MONTH = 29.53
export const SUN_RATIO = 0.46
export const LUNAR_DAY = 24 + 50 / 60
const RAD = Math.PI / 180

/** The Moon's angle around the Earth (degrees, anticlockwise from the right; the Sun is at 180°). */
export const moonAngle = (days: number) => (180 + (360 * days) / MONTH) % 360
export const SUN_ANGLE = 180

/** Tidal amplitude relative to the Moon's own tide (1 = the Moon alone). */
export function amplitude(days: number, sun: boolean): number {
  if (!sun) return 1
  const c = Math.cos(2 * (moonAngle(days) - SUN_ANGLE) * RAD)
  return Math.sqrt(1 + SUN_RATIO ** 2 + 2 * SUN_RATIO * c)
}

/** Direction of the main tidal bulge (degrees): towards the Moon, pulled a little towards the Sun's axis. */
export function bulgeAngle(days: number, sun: boolean): number {
  const m = 2 * moonAngle(days) * RAD
  const s = 2 * SUN_ANGLE * RAD
  const k = sun ? SUN_RATIO : 0
  return (Math.atan2(Math.sin(m) + k * Math.sin(s), Math.cos(m) + k * Math.cos(s)) / 2) / RAD
}

/** Height of the water at angle α (degrees) around the equator, relative to the Moon's tide. */
export function height(alpha: number, days: number, sun: boolean): number {
  return amplitude(days, sun) * Math.cos(2 * (alpha - bulgeAngle(days, sun)) * RAD)
}

/** The water level in a harbour during one lunar day: two highs, two lows (t in hours). */
export const harbour = (t: number, days: number, sun: boolean) => amplitude(days, sun) * Math.cos((4 * Math.PI * t) / LUNAR_DAY)

export type TideKind = 'skocny' | 'hluchy' | 'mezi' | 'jen-mesic'
export function tideKind(days: number, sun: boolean): TideKind {
  if (!sun) return 'jen-mesic'
  const a = amplitude(days, sun)
  return a >= 1.35 ? 'skocny' : a <= 0.7 ? 'hluchy' : 'mezi'
}

export type Phase = 'nov' | 'dorusta' | 'prvni-ctvrt' | 'uplnek' | 'ubyva' | 'posledni-ctvrt'
export function phase(days: number): Phase {
  const d = ((days % MONTH) + MONTH) % MONTH
  const near = (x: number) => Math.abs(d - x) < 0.9
  if (near(0) || near(MONTH)) return 'nov'
  if (near(MONTH / 4)) return 'prvni-ctvrt'
  if (near(MONTH / 2)) return 'uplnek'
  if (near((3 * MONTH) / 4)) return 'posledni-ctvrt'
  return d < MONTH / 2 ? 'dorusta' : 'ubyva'
}

/** The challenge: with the Sun on, find a neap tide. */
export const challengeMet = (days: number, sun: boolean) => tideKind(days, sun) === 'hluchy'
