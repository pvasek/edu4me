import { BY_SYMBOL, ELEMENTS, type ChemElement } from '../../courses/chemie/data/elements'

/** "l7" -> 7. Free play (no level) gets a medium difficulty. */
export function levelNumber(levelId?: string, fallback = 4): number {
  if (!levelId) return fallback
  const m = levelId.match(/(\d+)/)
  return m ? Number(m[1]) : fallback
}

export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function sample<T>(arr: readonly T[], n: number, rng: () => number = Math.random): T[] {
  return shuffle(arr, rng).slice(0, n)
}

export function pick<T>(arr: readonly T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Lower-case, no diacritics, trimmed, single spaces. "  Měď " -> "med" */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Parses "18,02", "18.02", " 18,02 g/mol" -> 18.02. Returns null when it is not a number. */
export function parseDecimal(s: string): number | null {
  const clean = s
    .replace(/g\s*\/\s*mol/i, '')
    .replace(/\s/g, '')
    .replace(/−/g, '-')
    .replace(',', '.')
  if (!/^-?\d+(\.\d*)?$|^-?\.\d+$/.test(clean)) return null
  const n = Number(clean)
  return Number.isFinite(n) ? n : null
}

/** Czech number formatting: 18.015 -> "18,02". */
export function fmtNum(x: number, digits = 2): string {
  return x.toFixed(digits).replace('.', ',')
}

/** Czech preposition for an ordinal period: "v 1. periodě", "ve 2. periodě". */
export function inPeriod(p: number): string {
  return `${p >= 2 && p <= 4 ? 've' : 'v'} ${p}. periodě`
}

/** Metals every student meets early on. */
export const COMMON_METALS = ['Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Ni', 'Cr', 'Mn', 'Pt', 'Al']
/** Transition metals worth knowing at upper-secondary level. */
export const KEY_TRANSITION = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Mo', 'Pd', 'Ag', 'Cd', 'W', 'Pt', 'Au', 'Hg']
const EXTRA_BASIC = ['Br', 'I', 'Ba']

const isMainGroup = (e: ChemElement) => e.group !== null && (e.group <= 2 || e.group >= 13)

/**
 * Elements a learner is expected to know at a given level.
 *   level <= 2: Z <= 20 + common metals
 *   3–6: main-group elements up to Kr, plus common metals and a few more
 *   7+: all main-group elements (periods 1–6) + key transition metals
 */
export function elementPool(level: number): ChemElement[] {
  const syms = new Set<string>()
  if (level <= 2) {
    ELEMENTS.filter((e) => e.z <= 20).forEach((e) => syms.add(e.symbol))
    COMMON_METALS.forEach((s) => syms.add(s))
  } else if (level <= 6) {
    ELEMENTS.filter((e) => e.z <= 36 && isMainGroup(e)).forEach((e) => syms.add(e.symbol))
    ;[...COMMON_METALS, ...EXTRA_BASIC, 'Co'].forEach((s) => syms.add(s))
  } else {
    ELEMENTS.filter((e) => isMainGroup(e) && e.period <= 6).forEach((e) => syms.add(e.symbol))
    KEY_TRANSITION.forEach((s) => syms.add(s))
  }
  return [...syms].map((s) => BY_SYMBOL[s]).sort((a, b) => a.z - b.z)
}

/** Linear time bonus: full `max` up to `fullUntil` seconds, 0 from `zeroAt` seconds. */
export function timeBonus(seconds: number, max: number, fullUntil: number, zeroAt: number): number {
  if (seconds <= fullUntil) return max
  if (seconds >= zeroAt) return 0
  return Math.round((max * (zeroAt - seconds)) / (zeroAt - fullUntil))
}

/**
 * The level whose content set a game should play: `level` when the game has a set for it,
 * otherwise undefined, which means "mix all sets" (free play or an unsupported level).
 */
export function pickLevel(sets: Record<number, unknown>, level?: number): number | undefined {
  return level !== undefined && level in sets ? level : undefined
}

/** Level numbers that have a content set, ascending. */
export const levelsOf = (sets: Record<number, unknown>): number[] =>
  Object.keys(sets)
    .map(Number)
    .sort((a, b) => a - b)

/**
 * Picks `n` items from several level sets, taking turns between the levels (in random order)
 * so a mixed round covers them evenly. Items with an already used `key` are skipped.
 */
export function mixLevels<T>(
  sets: Record<number, readonly T[]>,
  n: number,
  rng: () => number = Math.random,
  key: (item: T) => string = (item) => JSON.stringify(item),
): { item: T; level: number }[] {
  const queues = shuffle(levelsOf(sets), rng).map((level) => ({ level, items: shuffle(sets[level], rng) }))
  const used = new Set<string>()
  const out: { item: T; level: number }[] = []
  while (out.length < n && queues.some((q) => q.items.length)) {
    for (const q of queues) {
      if (out.length >= n) break
      while (q.items.length) {
        const item = q.items.shift()!
        if (used.has(key(item))) continue
        used.add(key(item))
        out.push({ item, level: q.level })
        break
      }
    }
  }
  return out
}
