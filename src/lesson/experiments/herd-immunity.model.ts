/**
 * Model of the `herd-immunity` experiment: 100 people in a 10 × 10 grid, one of
 * them falls ill and the disease spreads to unvaccinated people around.
 *
 * Everything is deterministic (a seeded hash), so the same coverage always gives
 * the same picture and a higher coverage never gives a bigger outbreak:
 * - every person has a fixed place in the vaccination queue; coverage p vaccinates
 *   the first round(p · 100) people of the queue (the first sick person is last,
 *   a baby too young to be vaccinated),
 * - everybody meets the people up to two places away (up to 24 contacts); each
 *   contact passes the disease on or not, decided once by the hash with the
 *   probability R₀ / 24, so a sick person infects about R₀ others in a fully
 *   susceptible crowd,
 * - a vaccinated person never falls ill (a simplification: real vaccines protect
 *   about 90–97 %).
 */

export const COLS = 10
export const ROWS = 10
export const N = COLS * ROWS
/** the first sick person, near the middle */
export const INDEX_CASE = 4 * COLS + 4
/** contact range in grid steps (Chebyshev distance) */
export const RANGE = 2
/** contacts of a person in the middle of the grid */
export const CONTACTS = (2 * RANGE + 1) ** 2 - 1

export const DISEASES = {
  chripka: { name: 'chřipka', r0: 2 },
  spalnicky: { name: 'spalničky', r0: 15 },
} as const
export type DiseaseId = keyof typeof DISEASES

/** Theory: the share that has to be immune so one sick person infects fewer than one other, 1 − 1 / R₀. */
export const herdThreshold = (r0: number) => 1 - 1 / r0

/** A small integer hash → [0, 1). */
function hash01(...xs: number[]): number {
  let h = 2166136261
  for (const x of xs) {
    h ^= x
    h = Math.imul(h, 16777619)
    h ^= h >>> 13
    h = Math.imul(h, 0x5bd1e995)
    h ^= h >>> 15
  }
  return (h >>> 0) / 4294967296
}

const SEED = 346

/** Vaccination queue: people in a fixed shuffled order, the first sick person last. */
export const QUEUE: number[] = (() => {
  const others = Array.from({ length: N }, (_, i) => i).filter((i) => i !== INDEX_CASE)
  others.sort((a, b) => hash01(SEED, 1, a) - hash01(SEED, 1, b))
  return [...others, INDEX_CASE]
})()

/** Number of vaccinated people for a coverage in % (0–100). */
export const vaccinatedCount = (pct: number) => Math.max(0, Math.min(N, Math.round((pct / 100) * N)))

/** Does the contact between people a and b pass the disease on (fixed for the pair)? */
export function transmits(a: number, b: number, r0: number): boolean {
  const [i, j] = a < b ? [a, b] : [b, a]
  return hash01(SEED, 2, i, j) < r0 / CONTACTS
}

export function neighbours(i: number): number[] {
  const x = i % COLS
  const y = Math.floor(i / COLS)
  const out: number[] = []
  for (let dy = -RANGE; dy <= RANGE; dy++)
    for (let dx = -RANGE; dx <= RANGE; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) out.push(ny * COLS + nx)
    }
  return out
}

export type PersonState = 'vaccinated' | 'healthy' | 'sick'

export interface Outbreak {
  /** state of every person */
  state: PersonState[]
  /** wave in which a sick person fell ill (0 = the first one), −1 otherwise */
  wave: number[]
  vaccinated: number
  /** everybody who fell ill, the first sick person included */
  sick: number
  /** unvaccinated people who stayed healthy */
  sparedUnvaccinated: number
  /** number of waves of the outbreak */
  waves: number
  /** nobody but the first sick person fell ill */
  stopped: boolean
}

/** Runs the outbreak for a coverage in % (breadth first, wave by wave). */
export function outbreak(pct: number, disease: DiseaseId): Outbreak {
  const r0 = DISEASES[disease].r0
  const v = vaccinatedCount(pct)
  const state: PersonState[] = Array(N).fill('healthy')
  for (let k = 0; k < v; k++) state[QUEUE[k]] = 'vaccinated'
  const wave = Array(N).fill(-1)
  let waves = 0
  if (state[INDEX_CASE] !== 'vaccinated') {
    state[INDEX_CASE] = 'sick'
    wave[INDEX_CASE] = 0
    let front = [INDEX_CASE]
    while (front.length) {
      const next: number[] = []
      for (const a of front)
        for (const b of neighbours(a))
          if (state[b] === 'healthy' && transmits(a, b, r0)) {
            state[b] = 'sick'
            wave[b] = wave[a] + 1
            next.push(b)
          }
      if (next.length) waves++
      front = next
    }
  }
  const sick = state.filter((s) => s === 'sick').length
  return {
    state,
    wave,
    vaccinated: v,
    sick,
    sparedUnvaccinated: N - v - sick,
    waves,
    stopped: sick <= 1,
  }
}

/** The lowest coverage (in steps of `step` %) at which the outbreak stops. */
export function lowestStoppingCoverage(disease: DiseaseId, step = 1): number {
  for (let p = 0; p <= 100; p += step) if (outbreak(p, disease).stopped) return p
  return 100
}
