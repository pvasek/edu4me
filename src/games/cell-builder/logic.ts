/**
 * Stavitel buňky – task generation. Every answer comes from the curated data in levels.ts
 * (which cell has what, what it does, where it is drawn); nothing is typed per task.
 */
import { levelNum } from '../types'
import { pick, sample, shuffle } from '../shared/util'
import { ANCHORS, CELLS, LEVELS, MISSABLE, MIX_FREE, PARTS, type CellId, type LevelSet, type PartId, type Scheme } from './levels'

type Rng = () => number

export type Kind = 'label' | 'function' | 'sort' | 'missing'

export interface TokenDef {
  id: string
  text: string
  /** Slot or zone the token belongs to; null = it does not belong anywhere (stays in the tray). */
  answer: string | null
}

export interface SlotDef {
  id: string
  num: number
  part: PartId
  /** Shown in the slot (function tasks: the organelle's name). */
  title?: string
}

export interface ZoneDef {
  id: string
  title: string
  /** Groups (by index) the cards in this zone belong to. */
  groups: number[]
}

interface Base {
  key: string
  level: number
  kind: Kind
  /** One line under the task (Czech). */
  explain: string
}

export interface LabelTask extends Base {
  kind: 'label' | 'function'
  cell: CellId
  slots: SlotDef[]
  tokens: TokenDef[]
}

export interface SortTask extends Base {
  kind: 'sort'
  scheme: Scheme
  zones: ZoneDef[]
  tokens: TokenDef[]
}

export interface MissingTask extends Base {
  kind: 'missing'
  cell: CellId
  missing: PartId
  options: PartId[]
}

export type Task = LabelTask | SortTask | MissingTask

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Cells that have a structure, as far as we may claim it (unsure cells count as "maybe"). */
export const has = (part: PartId, cell: CellId) => PARTS[part].in.includes(cell)
const unsure = (part: PartId, cell: CellId) => PARTS[part].unsure?.includes(cell) ?? false
/** The cell surely lacks the part, and we know why. */
export const surelyLacks = (part: PartId, cell: CellId) => !has(part, cell) && !unsure(part, cell) && !!PARTS[part].lacks?.[cell]

/** Drawn structures of a cell from a level's vocabulary, in reading order (top to bottom, left to right). */
export function drawnParts(cell: CellId, vocab: readonly PartId[]): PartId[] {
  const a = ANCHORS[cell]
  return vocab.filter((p) => a[p]).sort((p, q) => a[p]![1] - a[q]![1] || a[p]![0] - a[q]![0])
}

const readingOrder = (cell: CellId, parts: PartId[]) => drawnParts(cell, parts)

const L1 = new Set(LEVELS[1].parts)

/* ------------------------------------------------------------------ label / function */

function labelTask(level: number, set: LevelSet, cell: CellId, rng: Rng): LabelTask {
  const pool = drawnParts(cell, set.parts)
  let chosen: PartId[]
  if (level === 9) {
    // gymnázium level: lean on the organelles that are new at this level
    const adv = pool.filter((p) => !L1.has(p))
    const a = sample(adv, Math.min(3, adv.length), rng)
    chosen = [...a, ...sample(pool.filter((p) => !a.includes(p)), set.labelN - a.length, rng)]
  } else chosen = sample(pool, Math.min(set.labelN, pool.length), rng)
  const parts = readingOrder(cell, chosen)
  const slots: SlotDef[] = parts.map((p, k) => ({ id: `s-${p}`, num: k + 1, part: p }))
  const tokens: TokenDef[] = parts.map((p) => ({ id: `t-${p}`, text: PARTS[p].name, answer: `s-${p}` }))
  const lacking = set.parts.filter((p) => surelyLacks(p, cell))
  let explain = CELLS[cell].note
  if (lacking.length) {
    const d = pick(lacking, rng)
    tokens.push({ id: `t-${d}`, text: PARTS[d].name, answer: null })
    explain = `${cap(PARTS[d].name)} ${CELLS[cell].inName} není: ${PARTS[d].lacks![cell]}.`
  }
  return { key: `${level}:label:${cell}`, level, kind: 'label', cell, slots, tokens: shuffle(tokens, rng), explain }
}

function functionTask(level: number, set: LevelSet, cell: CellId, rng: Rng): LabelTask {
  const fn = set.fn
  const pool = drawnParts(cell, set.parts).filter((p) => PARTS[p][fn])
  const n = level === 9 ? 5 : 4
  const parts = readingOrder(cell, sample(pool, Math.min(n, pool.length), rng))
  const slots: SlotDef[] = parts.map((p, k) => ({ id: `s-${p}`, num: k + 1, part: p, title: PARTS[p].name }))
  const tokens: TokenDef[] = parts.map((p) => ({ id: `f-${p}`, text: PARTS[p][fn]!, answer: `s-${p}` }))
  const lacking = set.parts.filter((p) => surelyLacks(p, cell) && PARTS[p][fn] && !PARTS[p].jobWithout?.includes(cell))
  let explain = `${cap(PARTS[parts[0]].name)}: ${PARTS[parts[0]][fn]}.`
  if (lacking.length) {
    const d = pick(lacking, rng)
    tokens.push({ id: `f-${d}`, text: PARTS[d][fn]!, answer: null })
    explain = `„${cap(PARTS[d][fn]!)}“ dělá ${PARTS[d].name} – ${CELLS[cell].inName} ale není: ${PARTS[d].lacks![cell]}.`
  }
  return { key: `${level}:function:${cell}`, level, kind: 'function', cell, slots, tokens: shuffle(tokens, rng), explain }
}

/* ------------------------------------------------------------------ sort */

/** Group indexes in which a part is present; null when the answer would be uncertain. */
export function membership(part: PartId, scheme: Scheme): number[] | null {
  const out: number[] = []
  for (const [k, g] of scheme.groups.entries()) {
    if (g.cells.some((c) => has(part, c))) out.push(k)
    else if (g.cells.some((c) => unsure(part, c))) return null
  }
  return out.length ? out : null
}

export function zonesOf(scheme: Scheme): ZoneDef[] {
  const [a, b] = scheme.groups
  return [
    { id: 'z0', title: `jen ${a.name}`, groups: [0] },
    { id: 'z1', title: `jen ${b.name}`, groups: [1] },
    { id: 'z01', title: 'obě', groups: [0, 1] },
  ]
}

const zoneFor = (m: number[]) => `z${m.join('')}`

function sortTask(level: number, set: LevelSet, scheme: Scheme, rng: Rng): SortTask {
  const eligible = set.parts.map((p) => ({ p, m: membership(p, scheme) })).filter((x): x is { p: PartId; m: number[] } => x.m !== null)
  const allZones = zonesOf(scheme)
  const zones = allZones.filter((z) => eligible.some((e) => zoneFor(e.m) === z.id))
  const n = level === 9 ? 6 : 5
  // one card per zone first, then fill up
  const chosen: typeof eligible = []
  for (const z of shuffle(zones, rng)) chosen.push(pick(eligible.filter((e) => zoneFor(e.m) === z.id), rng))
  for (const e of shuffle(eligible, rng)) if (chosen.length < n && !chosen.includes(e)) chosen.push(e)
  const tokens: TokenDef[] = chosen.map(({ p, m }) => ({ id: `t-${p}`, text: PARTS[p].sortName ?? PARTS[p].name, answer: zoneFor(m) }))
  const summary = zones
    .map((z) => {
      const names = tokens.filter((t) => t.answer === z.id).map((t) => t.text)
      return names.length ? `${cap(z.title)}: ${names.join(', ')}.` : ''
    })
    .filter(Boolean)
    .join(' ')
  const note = chosen.map((c) => PARTS[c.p].sortNote).find(Boolean)
  return {
    key: `${level}:sort:${scheme.id}`,
    level,
    kind: 'sort',
    scheme,
    zones,
    tokens: shuffle(tokens, rng),
    explain: note ? `${summary} ${note}` : summary,
  }
}

/* ------------------------------------------------------------------ missing */

function missingTask(level: number, set: LevelSet, cell: CellId, rng: Rng): MissingTask {
  const visible = drawnParts(cell, set.parts).filter((p) => MISSABLE.includes(p))
  const missing = pick(visible, rng)
  const present = sample(
    // a hidden nucleus hides its nucleolus too
    visible.filter((p) => p !== missing && !(missing === 'jadro' && p === 'jaderko')),
    2,
    rng,
  )
  const absent = set.parts.filter((p) => surelyLacks(p, cell))
  const options = shuffle([missing, ...present, ...(absent.length ? [pick(absent, rng)] : [])], rng)
  const fn = PARTS[missing][set.fn] ?? PARTS[missing].fn9 ?? PARTS[missing].fn1
  return {
    key: `${level}:missing:${cell}`,
    level,
    kind: 'missing',
    cell,
    missing,
    options,
    explain: `Na obrázku chybí ${PARTS[missing].name}${fn ? ` – ${fn}` : ''}.`,
  }
}

/* ------------------------------------------------------------------ round */

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

function build(kind: Kind, level: number, rng: Rng): Task {
  const set = LEVELS[level]
  if (kind === 'sort') return sortTask(level, set, pick(set.schemes, rng), rng)
  const cell = pick(set.cells, rng)
  if (kind === 'label') return labelTask(level, set, cell, rng)
  if (kind === 'function') return functionTask(level, set, cell, rng)
  return missingTask(level, set, cell, rng)
}

/** A round of distinct tasks (by key). A level plays its own set; free play mixes levels 1 and 9. */
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

/** Answer key of a board task: token → slot or zone (null = stays in the tray). */
export const answersOf = (t: LabelTask | SortTask): Record<string, string | null> => Object.fromEntries(t.tokens.map((x) => [x.id, x.answer]))

/** Slots that take exactly one token. */
export const singleSlots = (t: LabelTask | SortTask): string[] => (t.kind === 'sort' ? [] : t.slots.map((s) => s.id))
