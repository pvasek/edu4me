/**
 * Určovací klíč – pure logic: walking a dichotomous key, the reverse task
 * (which couplet separates two organisms) and building a round.
 * Every answer is computed from the organisms' features in levels.ts.
 */
import { levelNum } from '../types'
import { pick, shuffle } from '../shared/util'
import { LEVELS, type KeyNode, type KeySet, type Organism, type Trait } from './levels'

export const ROUND = 10
/** Positions (0-based) of the reverse tasks in a round; the rest are walks. */
export const REVERSE_AT = [2, 5, 8]
export const OPTIONS = 4

type Rng = () => number

/** Level number whose key is played; undefined = all keys mixed. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

export const traitOf = (set: KeySet, id: string): Trait => {
  const t = set.traits.find((x) => x.id === id)
  if (!t) throw new Error(`Unknown trait ${id} in level ${set.level}`)
  return t
}

export const organismOf = (set: KeySet, id: string): Organism => {
  const o = set.organisms.find((x) => x.id === id)
  if (!o) throw new Error(`Unknown organism ${id} in level ${set.level}`)
  return o
}

/** Lead text for one answer of a trait: "má páteř" / "nemá páteř". */
export const lead = (t: Trait, answer: boolean) => (answer ? t.yes : t.no)
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/* ------------------------------------------------------------------ the key */

export interface Couplet {
  /** Couplet number in the printed key (1, 2, 3 … in depth-first order). */
  n: number
  trait: Trait
  yes: KeyNode
  no: KeyNode
}

/** Couplet numbers in depth-first order, like a printed key ("1a … 2", "1b … 5"). */
export function numberKey(set: KeySet): Map<KeyNode, number> {
  const out = new Map<KeyNode, number>()
  let n = 0
  const walk = (node: KeyNode) => {
    if (typeof node === 'string') return
    out.set(node, ++n)
    walk(node.yes)
    walk(node.no)
  }
  walk(set.key)
  return out
}

export interface Step {
  couplet: Couplet
  /** The right answer for this organism. */
  answer: boolean
}

/** The couplets an organism passes on its way through the key, and where it ends. */
export function pathOf(set: KeySet, orgId: string): { steps: Step[]; leaf: string } {
  const org = organismOf(set, orgId)
  const nums = numberKey(set)
  const steps: Step[] = []
  let node = set.key
  while (typeof node !== 'string') {
    const v = org.t[node.t]
    if (v === undefined) throw new Error(`${org.id} has no value for ${node.t} (level ${set.level})`)
    steps.push({ couplet: { n: nums.get(node)!, trait: traitOf(set, node.t), yes: node.yes, no: node.no }, answer: v })
    node = v ? node.yes : node.no
  }
  return { steps, leaf: node }
}

/** All organism ids at the leaves of a key node. */
export function leavesOf(node: KeyNode): string[] {
  return typeof node === 'string' ? [node] : [...leavesOf(node.yes), ...leavesOf(node.no)]
}

/** Internal key nodes (couplets). */
export function coupletsOf(node: KeyNode): Exclude<KeyNode, string>[] {
  return typeof node === 'string' ? [] : [node, ...coupletsOf(node.yes), ...coupletsOf(node.no)]
}

/** The couplet where the paths of two organisms part (their last common question). */
export function separatingTrait(set: KeySet, a: string, b: string): string {
  const pa = pathOf(set, a).steps
  const pb = pathOf(set, b).steps
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    if (pa[i].couplet.n !== pb[i].couplet.n) break
    if (pa[i].answer !== pb[i].answer) return pa[i].couplet.trait.id
  }
  throw new Error(`${a} and ${b} are not separated by the key`)
}

/* ------------------------------------------------------------------ tasks */

export interface WalkTask {
  kind: 'walk'
  key: string
  level: number
  org: Organism
  steps: Step[]
}

export interface ReverseTask {
  kind: 'reverse'
  key: string
  level: number
  a: Organism
  b: Organism
  /** Trait ids offered (shuffled); exactly one of them differs between a and b. */
  options: string[]
  answer: string
}

export type Task = WalkTask | ReverseTask

export function walkTask(set: KeySet, orgId: string): WalkTask {
  const org = organismOf(set, orgId)
  return { kind: 'walk', key: `walk:${set.level}:${org.id}`, level: set.level, org, steps: pathOf(set, orgId).steps }
}

/** Traits defined for both organisms with the same value (good distractors). */
export function sharedTraits(set: KeySet, a: Organism, b: Organism): string[] {
  return set.traits.map((t) => t.id).filter((id) => a.t[id] !== undefined && b.t[id] !== undefined && a.t[id] === b.t[id])
}

/**
 * Reverse task for a couplet: an organism from its "yes" side, one from its "no" side;
 * the answer is the couplet's trait, the distractors are traits the two share.
 * Returns null when the pair has too few shared traits for distractors.
 */
export function reverseTask(set: KeySet, node: Exclude<KeyNode, string>, rng: Rng = Math.random): ReverseTask | null {
  const a = organismOf(set, pick(leavesOf(node.yes), rng))
  const b = organismOf(set, pick(leavesOf(node.no), rng))
  const shared = sharedTraits(set, a, b)
  if (shared.length < OPTIONS - 1) return null
  const answer = separatingTrait(set, a.id, b.id)
  const [x, y] = rng() < 0.5 ? [a, b] : [b, a]
  return {
    kind: 'reverse',
    key: `rev:${set.level}:${[a.id, b.id].sort().join('|')}`,
    level: set.level,
    a: x,
    b: y,
    options: shuffle([answer, ...shuffle(shared, rng).slice(0, OPTIONS - 1)], rng),
    answer,
  }
}

/** True when the trait tells the two organisms apart (both defined, different values). */
export function separates(set: KeySet, traitId: string, a: Organism, b: Organism): boolean {
  traitOf(set, traitId)
  return a.t[traitId] !== undefined && b.t[traitId] !== undefined && a.t[traitId] !== b.t[traitId]
}

/**
 * A round of ROUND tasks: walks through the key, with reverse tasks at REVERSE_AT.
 * One level's key, or (level undefined) the keys of all levels taking turns.
 * No organism is walked twice and no pair is asked twice.
 */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const levels = level !== undefined && LEVELS[level] ? [level] : shuffle(Object.keys(LEVELS).map(Number), rng)
  const walkQueues = new Map(levels.map((l) => [l, shuffle(LEVELS[l].organisms.map((o) => o.id), rng)]))
  const used = new Set<string>()
  const tasks: Task[] = []
  let turn = 0
  for (let i = 0; i < ROUND; i++) {
    const set = LEVELS[levels[turn++ % levels.length]]
    if (REVERSE_AT.includes(i)) {
      // prefer deeper couplets (siblings in the key are the instructive pairs)
      const nodes = shuffle(coupletsOf(set.key), rng)
      let t: ReverseTask | null = null
      for (let tries = 0; tries < 60 && !t; tries++) {
        const cand = reverseTask(set, nodes[tries % nodes.length], rng)
        if (cand && !used.has(cand.key)) t = cand
      }
      if (t) {
        used.add(t.key)
        tasks.push(t)
        continue
      }
    }
    const q = walkQueues.get(set.level)!
    let id = q.shift()
    while (id && used.has(`walk:${set.level}:${id}`)) id = q.shift()
    if (!id) {
      // this key has run out of organisms (cannot happen with ≥ 10 per key, kept for safety)
      i--
      continue
    }
    const w = walkTask(set, id)
    used.add(w.key)
    tasks.push(w)
  }
  return tasks
}

/* ------------------------------------------------------------------ scoring */

export const WALK_POINTS = 100
export const BONUS_MAX = 25

/** Points for a walk: share of steps answered right first time; bonus only for a clean walk. */
export function walkPoints(steps: number, mistakes: number, bonus: number): number {
  const base = Math.round((WALK_POINTS * Math.max(0, steps - mistakes)) / steps)
  return mistakes === 0 ? base + bonus : base
}

/** Seconds of a clean walk that still earn the full bonus / no bonus. */
export const walkBonusWindow = (steps: number) => ({ full: 3 + steps * 3, zero: 10 + steps * 9 })
