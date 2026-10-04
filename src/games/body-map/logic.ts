/**
 * Mapa těla – task generation from the curated data in levels.ts. Positions, pairs and
 * the order of every path come from the data; markers in one picture never overlap.
 */
import { levelNum } from '../types'
import { pick, shuffle } from '../shared/util'
import { LEVELS, MATCH_SETS, MIN_GAP, MIX_FREE, ORGANS, PATHS, PLACE_SETS, type LevelSet, type OrganId, type Pair } from './levels'

type Rng = () => number
type P = [number, number]

export type Kind = 'place' | 'match' | 'path'

export interface TokenDef {
  id: string
  text: string
  answer: string | null
}

export interface SlotDef {
  id: string
  num: number
  /** Where the slot's marker sits in the body (place and match tasks). */
  organ?: OrganId
  title?: string
}

interface Base {
  key: string
  level: number
  kind: Kind
  /** Eyebrow above the task. */
  title: string
  prompt: string
  explain: string
  slots: SlotDef[]
  tokens: TokenDef[]
}

export interface PlaceTask extends Base {
  kind: 'place'
}
export interface MatchTask extends Base {
  kind: 'match'
  /** Card kind for the tray ("Hormony"). */
  cards: string
}
export interface PathTask extends Base {
  kind: 'path'
  /** Points of the path in the body, when every step has a place there. */
  route?: P[]
  /** Organs drawn under the route. */
  organs?: OrganId[]
}

export type Task = PlaceTask | MatchTask | PathTask

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1])
export const farEnough = (a: OrganId, chosen: readonly OrganId[]) => chosen.every((c) => dist(ORGANS[a].at, ORGANS[c].at) >= MIN_GAP)

/** Reading order: top to bottom, then left to right. */
const byPosition = (a: OrganId, b: OrganId) => ORGANS[a].at[1] - ORGANS[b].at[1] || ORGANS[a].at[0] - ORGANS[b].at[0]

function placeTask(level: number, setId: string, rng: Rng): PlaceTask {
  const set = PLACE_SETS[setId]
  const chosen: OrganId[] = []
  for (const id of shuffle(set.organs, rng)) if (chosen.length < 5 && farEnough(id, chosen)) chosen.push(id)
  chosen.sort(byPosition)
  const slots = chosen.map((id, k) => ({ id: `s-${id}`, num: k + 1, organ: id }))
  const tokens = shuffle(
    chosen.map((id) => ({ id: `t-${id}`, text: ORGANS[id].name, answer: `s-${id}` })),
    rng,
  )
  return {
    key: `${level}:place:${setId}`,
    level,
    kind: 'place',
    title: set.title,
    prompt: `${set.title}: přetáhni každý orgán k číslu, kde v těle leží.`,
    explain: set.note,
    slots,
    tokens,
  }
}

function matchTask(level: number, setId: string, rng: Rng): MatchTask {
  const set = MATCH_SETS[setId]
  let chosen: Pair[] = []
  // greedy pick of pairs whose markers do not overlap; a few reshuffles reach the full count
  for (let attempt = 0; attempt < 30 && chosen.length < set.n; attempt++) {
    chosen = []
    for (const p of shuffle(set.pairs, rng)) {
      const organs = chosen.map((c) => c.organ)
      if (chosen.length < set.n && !organs.includes(p.organ) && farEnough(p.organ, organs)) chosen.push(p)
    }
  }
  chosen.sort((a, b) => byPosition(a.organ, b.organ))
  const slots = chosen.map((p, k) => ({ id: `s-${p.organ}`, num: k + 1, organ: p.organ, title: p.title ?? ORGANS[p.organ].name }))
  const tokens = shuffle(
    chosen.map((p) => ({ id: `t-${p.organ}`, text: p.text, answer: `s-${p.organ}` })),
    rng,
  )
  const ex = pick(chosen, rng)
  return {
    key: `${level}:match:${setId}`,
    level,
    kind: 'match',
    title: set.cards,
    cards: set.cards,
    prompt: set.prompt,
    explain:
      setId === 'glands11'
        ? `${chosen.map((p) => `${cap(ORGANS[p.organ].name)} – ${p.text}`).join('; ')}.`
        : `${cap(ex.title ?? ORGANS[ex.organ].name)}: ${ex.text}.`,
    slots,
    tokens,
  }
}

function pathTask(level: number, id: string, rng: Rng): PathTask {
  const path = PATHS[id]
  const slots = path.steps.map((_, k) => ({ id: `p${k}`, num: k + 1 }))
  const tokens: TokenDef[] = path.steps.map((s, k) => ({ id: `t${k}`, text: s.text, answer: `p${k}` }))
  if (path.extra) tokens.push({ id: 'tx', text: path.extra.text, answer: null })
  const placed = path.steps.every((s) => s.organ)
  return {
    key: `${level}:path:${id}`,
    level,
    kind: 'path',
    title: path.title,
    prompt: `${path.prompt}${path.extra ? ' Jedna karta na cestu nepatří.' : ''}`,
    explain: path.extra ? `Karta „${path.extra.text}“ na cestu nepatří – ${path.extra.why}. ${path.note}` : path.note,
    slots,
    tokens: shuffle(tokens, rng),
    route: placed ? path.steps.map((s) => ORGANS[s.organ!].at) : undefined,
    organs: placed ? [...new Set(path.steps.map((s) => s.organ!))] : undefined,
  }
}

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

function build(kind: Kind, level: number, rng: Rng): Task {
  const set: LevelSet = LEVELS[level]
  if (kind === 'place') return placeTask(level, pick(set.place, rng), rng)
  if (kind === 'match') return matchTask(level, pick(set.match, rng), rng)
  return pathTask(level, pick(set.paths, rng), rng)
}

/** A round of distinct tasks (by key). A level plays its own set; free play mixes levels 6 and 11. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const mixes = level !== undefined ? { [level]: LEVELS[level].mix } : MIX_FREE
  const used = new Set<string>()
  const out: Task[] = []
  for (const [lv, mix] of Object.entries(mixes)) {
    const mine: Task[] = []
    for (const [kind, n] of Object.entries(mix) as [Kind, number][]) {
      for (let k = 0; k < n; k++) {
        for (let attempt = 0; attempt < 200; attempt++) {
          const t = build(kind, Number(lv), rng)
          if (used.has(t.key)) continue
          used.add(t.key)
          mine.push(t)
          break
        }
      }
    }
    out.push(...shuffle(mine, rng))
  }
  return out
}

export const answersOf = (t: Task): Record<string, string | null> => Object.fromEntries(t.tokens.map((x) => [x.id, x.answer]))
