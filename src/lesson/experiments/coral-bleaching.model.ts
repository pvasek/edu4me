/**
 * Model of the `coral-bleaching` experiment: a reef coral with symbiotic
 * algae (zooxanthellae) in sea water warmer than usual, for a number of days.
 *
 * Built on NOAA Coral Reef Watch "degree heating weeks" (DHW): only warming of
 * at least 1 °C above the usual summer maximum (MMM) counts, and the stress is
 * the excess in °C times the time in weeks.
 * - DHW ≥ 4 °C·weeks: significant bleaching (the coral expels most algae),
 * - DHW ≥ 8: severe bleaching, corals start to die,
 * - DHW ≥ 16: more than half of the coral dies, ≥ 20: nearly all.
 * Cooled in time (before ~8 °C·weeks) the algae move back in and the coral
 * recovers over months. Simplified for a lesson.
 */

export const T_MIN = 24
export const T_MAX = 34
export const DAYS_MAX = 84
/** the usual summer maximum of this reef (°C) */
export const MMM = 29
/** only warming of at least this much over MMM counts (°C) */
export const HOTSPOT = 1
export const BLEACH_DHW = 4
export const DEATH_DHW = 8

/** Degree heating weeks after `days` at temperature `t` (°C·weeks). */
export function dhw(t: number, days: number): number {
  const hot = t - MMM
  if (hot < HOTSPOT) return 0
  return (hot * days) / 7
}

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x))
  return c * c * (3 - 2 * c)
}

/** Share of the symbiotic algae still in the coral (1 = all, 0 = none). */
export const algaeShare = (d: number) => 1 - smooth((d - 1) / 6)

/** Share of the coral colony that has died (0–1). */
export function deadShare(d: number): number {
  const pts: [number, number][] = [
    [DEATH_DHW, 0],
    [12, 0.2],
    [16, 0.5],
    [20, 0.85],
    [24, 1],
  ]
  if (d <= pts[0][0]) return 0
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    if (d <= x1) return y0 + ((y1 - y0) * (d - x0)) / (x1 - x0)
  }
  return 1
}

export type CoralState = 'zdravy' | 'bledne' | 'vybeleny' | 'odumira' | 'mrtvy'

export function coralState(t: number, days: number): CoralState {
  const d = dhw(t, days)
  if (deadShare(d) >= 0.95) return 'mrtvy'
  if (d > DEATH_DHW) return 'odumira'
  if (d >= BLEACH_DHW) return 'vybeleny'
  if (algaeShare(d) < 0.95) return 'bledne'
  return 'zdravy'
}

/** What happens when the sea cools down again. */
export type Outcome = 'bez-zmeny' | 'zotavi' | 'cast-uhyne' | 'uhyne'
export function outcome(t: number, days: number): Outcome {
  const d = dhw(t, days)
  const dead = deadShare(d)
  if (dead >= 0.95) return 'uhyne'
  if (dead > 0) return 'cast-uhyne'
  if (algaeShare(d) < 0.95) return 'zotavi'
  return 'bez-zmeny'
}

/** Days at temperature t until the coral bleaches / starts dying (Infinity if never). */
export function daysTo(t: number, level: number): number {
  const hot = t - MMM
  if (hot < HOTSPOT) return Infinity
  return (level * 7) / hot
}

/** The challenge: 2 °C warmer than usual, and the duration set to where dying starts (± 3 days). */
export function challengeMet(t: number, days: number): boolean {
  return t === MMM + 2 && Math.abs(days - daysTo(t, DEATH_DHW)) <= 3
}
