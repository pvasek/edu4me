/**
 * Ecology of the `energy-pyramid` experiment: energy flowing up a food chain of four
 * trophic levels. Each level passes on only a small part (about 10 %, in nature roughly
 * 5–20 %) of its energy to the next; the rest is used for life and lost as heat.
 */

export const LEVELS = [
  { name: 'rostliny', role: 'producenti' },
  { name: 'kobylka', role: 'konzument 1. řádu' },
  { name: 'rejsek', role: 'konzument 2. řádu' },
  { name: 'sova', role: 'konzument 3. řádu' },
] as const

/** Energy at each of the four levels (kJ) from the producers' energy and the transfer efficiency (0–1). */
export function pyramid(producers: number, efficiency: number): number[] {
  return LEVELS.map((_, i) => producers * efficiency ** i)
}

/** Energy the producers must hold so that the top predator receives `target` kJ. */
export const producersNeeded = (target: number, efficiency: number) => target / efficiency ** (LEVELS.length - 1)

/** Energy lost (mostly as heat) between level i and i + 1. */
export const lostAt = (levels: number[], i: number) => levels[i] - levels[i + 1]
