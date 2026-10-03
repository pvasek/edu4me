/**
 * Model of the `pulse-exercise` experiment: heart rate of a teenager during
 * 5 minutes of an activity and 5 minutes of rest afterwards (approximate values).
 *
 * - steady rates (tepů za minutu): a trained heart pumps more blood per beat, so
 *   it beats slower at rest and at the same effort; the maximum (≈ 200 /min at
 *   15 years) hardly changes with training,
 * - the rate approaches the steady value exponentially (time constant `rise`),
 *   after the exercise it falls back towards the resting rate (time constant
 *   `recover`); a trained heart recovers about twice as fast. Real recovery has a
 *   fast first minute and a slow tail; one exponential is a simplification.
 */

export const ACTIVITIES = {
  klid: { name: 'klid' },
  chuze: { name: 'chůze' },
  beh: { name: 'běh' },
  sprint: { name: 'sprint' },
} as const
export type ActivityId = keyof typeof ACTIVITIES

export const FITNESS = {
  netrenovany: {
    name: 'netrénovaný',
    rate: { klid: 75, chuze: 110, beh: 165, sprint: 195 },
    rise: 40,
    recover: 240,
  },
  trenovany: {
    name: 'trénovaný',
    rate: { klid: 55, chuze: 90, beh: 140, sprint: 190 },
    rise: 25,
    recover: 120,
  },
} as const
export type FitnessId = keyof typeof FITNESS

/** exercise 0–5 min, rest 5–10 min (in seconds) */
export const EXERCISE_S = 300
export const TOTAL_S = 600
/** "back at rest" = within this many beats of the resting rate */
export const REST_BAND = 10

export const restRate = (f: FitnessId) => FITNESS[f].rate.klid
export const steadyRate = (a: ActivityId, f: FitnessId) => FITNESS[f].rate[a]

/** Heart rate (/min) at time t (s) since the start of the exercise. */
export function rateAt(t: number, a: ActivityId, f: FitnessId): number {
  const F = FITNESS[f]
  const rest = F.rate.klid
  const peak = F.rate[a]
  if (t <= 0) return rest
  const atEnd = peak + (rest - peak) * Math.exp(-EXERCISE_S / F.rise)
  if (t <= EXERCISE_S) return peak + (rest - peak) * Math.exp(-t / F.rise)
  return rest + (atEnd - rest) * Math.exp(-(t - EXERCISE_S) / F.recover)
}

/** Seconds after the end of the exercise until the rate is within REST_BAND of rest (0 if it already is). */
export function recoveryTime(a: ActivityId, f: FitnessId): number {
  const rest = restRate(f)
  const over = rateAt(EXERCISE_S, a, f) - rest
  if (over <= REST_BAND) return 0
  return FITNESS[f].recover * Math.log(over / REST_BAND)
}

/** Samples of the whole 10 minutes, every `step` seconds: [t, rate]. */
export function curve(a: ActivityId, f: FitnessId, step = 10): [number, number][] {
  const out: [number, number][] = []
  for (let t = 0; t <= TOTAL_S; t += step) out.push([t, rateAt(t, a, f)])
  return out
}
