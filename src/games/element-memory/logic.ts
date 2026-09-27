import { levelNum } from '../types'
import { sample, shuffle } from '../shared/util'
import { LEVELS, MIX, type MemPair } from './levels'

/** One pair of the round, with its labels resolved. */
export interface RoundPair {
  key: string
  a: string
  b: string
  el?: string
  tagA: string
  tagB: string
  syms: string[]
  note?: string
}

export interface MemCard {
  id: number
  /** Key of the pair the card belongs to. */
  pair: string
  side: 'a' | 'b'
}

export interface MemRound {
  /** Level whose set is played, or 'mix' for "Vše". */
  level: number | 'mix'
  instr: string
  long: boolean
  pairs: Record<string, RoundPair>
  cards: MemCard[]
}

/** Level number whose set is played; undefined = mix of all sets. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

const resolve = (level: number, idx: number, p: MemPair): RoundPair => ({
  key: `${level}:${idx}`,
  a: p.a,
  b: p.b,
  el: p.el,
  tagA: p.tagA ?? LEVELS[level].tagA,
  tagB: p.tagB ?? LEVELS[level].tagB,
  syms: p.syms ?? [],
  note: p.note,
})

/** Keys that must not meet twice in one mixed round. */
const clashKeys = (level: number, p: MemPair) => [...(p.syms ?? []), ...(p.clash ?? []), ...(LEVELS[level].clash ?? [])]

function pickLevel(level: number, rng: () => number): RoundPair[] {
  const L = LEVELS[level]
  const all = L.pairs.map((p, i) => resolve(level, i, p))
  if (!L.prefer) return sample(all, L.size, rng)
  const preferred = all.filter((p) => p.syms.some((s) => L.prefer!.includes(s)))
  const first = sample(preferred, Math.ceil(L.size / 2), rng)
  const rest = sample(
    all.filter((p) => !first.includes(p)),
    L.size - first.length,
    rng,
  )
  return [...first, ...rest]
}

/**
 * "Vše": pairs from as many different levels as possible, never two pairs that
 * share an element or a clash key (e.g. "Al" at L2 and "hliník → bauxit" at L7).
 */
function pickMix(rng: () => number): RoundPair[] {
  const levels = Object.keys(LEVELS).map(Number)
  const used = new Set<string>()
  const picked: RoundPair[] = []
  const taken = new Set<string>()
  for (let pass = 0; pass < 4 && picked.length < MIX.size; pass++) {
    for (const lv of shuffle(levels, rng)) {
      if (picked.length >= MIX.size) break
      const options = shuffle(
        LEVELS[lv].pairs.map((p, i) => [p, i] as const),
        rng,
      ).filter(([p, i]) => !taken.has(`${lv}:${i}`) && clashKeys(lv, p).every((k) => !used.has(k)))
      const hit = options[0]
      if (!hit) continue
      const [p, i] = hit
      clashKeys(lv, p).forEach((k) => used.add(k))
      taken.add(`${lv}:${i}`)
      picked.push(resolve(lv, i, p))
    }
  }
  return picked
}

/** Deals a shuffled board for the level (a level id like "l5", or none for the mix). */
export function dealRound(levelId?: string, rng: () => number = Math.random): MemRound {
  const level = playedLevel(levelId)
  const pairs = level !== undefined ? pickLevel(level, rng) : pickMix(rng)
  const cards: MemCard[] = pairs.flatMap((p) => [
    { id: 0, pair: p.key, side: 'a' as const },
    { id: 0, pair: p.key, side: 'b' as const },
  ])
  return {
    level: level ?? 'mix',
    instr: level !== undefined ? LEVELS[level].instr : MIX.instr,
    long: level !== undefined ? !!LEVELS[level].long : MIX.long,
    pairs: Object.fromEntries(pairs.map((p) => [p.key, p])),
    cards: shuffle(cards, rng).map((c, i) => ({ ...c, id: i })),
  }
}

/** Plain text of a markup string (aria-labels, length checks): '$SO4^{2-}$' -> 'SO4 2-'. */
export function plain(md: string): string {
  return md
    .replace(/\$|\*\*|==|\*/g, '')
    .replace(/\^\{([^}]*)\}/g, '$1')
    .replace(/_\{([^}]*)\}/g, '$1')
    .replace(/\^([0-9+\-−]+)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Font size of a card face in `cqi` (% of the card width): smaller for longer texts,
 * and never so big that the longest word would not fit on one line.
 */
export function faceFont(md: string): number {
  const t = plain(md)
  const longest = Math.max(...t.split(/[\s–-]/).map((w) => w.length))
  const base = t.length <= 4 ? 30 : t.length <= 9 ? 20 : t.length <= 22 ? 16.5 : t.length <= 34 ? 14.5 : 13.5
  return Math.min(base, Math.floor((170 / longest) * 10) / 10)
}

/**
 * Score 0–100 from the number of moves (one move = turning two cards).
 * Up to 1.5 × pairs moves is perfect, then −5 per extra move, never below 10.
 */
export function memoryScore(moves: number, pairs: number): number {
  const free = Math.ceil(pairs * 1.5)
  return Math.max(10, Math.min(100, 100 - Math.max(0, moves - free) * 5))
}

/**
 * @deprecated Legacy symbol ↔ name board (6 pairs at level ≤ 2, otherwise 8), kept only so
 * src/games/shared/games-elements.test.ts keeps compiling. The game itself uses `dealRound`.
 */
export function dealCards(level: number, rng: () => number = Math.random): { id: number; sym: string; face: 'symbol' | 'name' }[] {
  const syms = sample(
    LEVELS[2].pairs.map((p) => p.el!),
    level <= 2 ? 6 : 8,
    rng,
  )
  const cards = syms.flatMap((sym) => [
    { id: 0, sym, face: 'symbol' as const },
    { id: 0, sym, face: 'name' as const },
  ])
  return shuffle(cards, rng).map((c, i) => ({ ...c, id: i }))
}
