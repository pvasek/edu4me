/**
 * Pure layout of a family pedigree (the `pedigree` block). Positions are in
 * slot units: x = column (people of one generation are ≥ 1 apart), gen = row
 * (0 = generation I).
 *
 * - Generations come from the parent links; a person without parents who has
 *   a child with someone is put in that partner's generation (married in).
 * - Families are laid out as a tree: a couple sits centred over the block of
 *   its children, a married-in partner stands right next to the spouse, and
 *   siblings' families never interleave.
 */
import type { PedigreePerson } from '../../core/types'

export interface PedNode {
  id: string
  x: number
  gen: number
  person: PedigreePerson
}

export interface PedCouple {
  mother: string
  father: string
  /** the partner drawn on the left / right */
  left: string
  right: string
  gen: number
  /** x of the middle of the couple line (where the children's line drops) */
  mid: number
  children: string[]
}

export interface PedigreeLayout {
  nodes: PedNode[]
  couples: PedCouple[]
  /** number of generations */
  gens: number
  /** columns: x runs from 0 to width - 1 */
  width: number
}

interface Unit {
  members: string[]
  kids: Unit[]
}

const GAP = 0.5

export function pedigreeLayout(people: PedigreePerson[]): PedigreeLayout {
  const byId = new Map(people.map((p) => [p.id, p]))
  const parentsOf = (id: string) => {
    const ps = byId.get(id)?.parents
    return ps && byId.has(ps[0]) && byId.has(ps[1]) ? ps : undefined
  }

  // ---- couples (from the children's parent links), in order of the first child
  const coupleMap = new Map<string, { mother: string; father: string; children: string[] }>()
  for (const p of people) {
    const ps = parentsOf(p.id)
    if (!ps) continue
    const key = ps.join('|')
    const c = coupleMap.get(key) ?? { mother: ps[0], father: ps[1], children: [] }
    c.children.push(p.id)
    coupleMap.set(key, c)
  }
  const couples = [...coupleMap.values()]
  const partners = new Map<string, string[]>()
  for (const c of couples) {
    partners.set(c.mother, [...(partners.get(c.mother) ?? []), c.father])
    partners.set(c.father, [...(partners.get(c.father) ?? []), c.mother])
  }

  // ---- generations
  const base = new Map<string, number>(people.map((p) => [p.id, 0]))
  const computeGens = () => {
    const gen = new Map<string, number>()
    const walk = (id: string, depth = 0): number => {
      const known = gen.get(id)
      if (known !== undefined) return known
      const ps = parentsOf(id)
      const g = ps && depth < 40 ? Math.max(walk(ps[0], depth + 1), walk(ps[1], depth + 1)) + 1 : (base.get(id) ?? 0)
      gen.set(id, g)
      return g
    }
    for (const p of people) walk(p.id)
    return gen
  }
  let gen = computeGens()
  for (let it = 0; it < 12; it++) {
    let changed = false
    for (const c of couples) {
      const gm = gen.get(c.mother)!
      const gf = gen.get(c.father)!
      if (gm === gf) continue
      // move the partner without parents into the other one's generation
      const [low, high] = gm < gf ? [c.mother, c.father] : [c.father, c.mother]
      if (!parentsOf(low)) {
        base.set(low, gen.get(high)!)
        changed = true
      }
    }
    if (!changed) break
    gen = computeGens()
  }
  const minGen = Math.min(...people.map((p) => gen.get(p.id)!))
  for (const p of people) gen.set(p.id, gen.get(p.id)! - minGen)

  // ---- units: a person (with parents) plus the partners who married in
  const marriedIn = new Map<string, string>() // spouse id -> partner id
  for (const p of people) {
    if (parentsOf(p.id)) continue
    const host = (partners.get(p.id) ?? []).find((q) => parentsOf(q))
    if (host) marriedIn.set(p.id, host)
  }
  const placed = new Set<string>()
  const unitOf = new Map<string, Unit>()
  const buildUnit = (members: string[]): Unit => {
    const u: Unit = { members, kids: [] }
    for (const m of members) {
      placed.add(m)
      unitOf.set(m, u)
    }
    return u
  }
  const spousesOf = (id: string) => people.filter((q) => marriedIn.get(q.id) === id && !placed.has(q.id)).map((q) => q.id)

  const roots: Unit[] = []
  // founders' couples first (male on the left), then lone founders
  for (const p of people) {
    if (placed.has(p.id) || parentsOf(p.id) || marriedIn.has(p.id)) continue
    const mates = (partners.get(p.id) ?? []).filter((q) => !placed.has(q) && !parentsOf(q) && !marriedIn.has(q))
    const members = [p.id, ...mates]
    if (members.length === 2 && byId.get(members[0])!.sex === 'f' && byId.get(members[1])!.sex === 'm') members.reverse()
    roots.push(buildUnit(members))
  }
  // which founders' family a person comes from (to order siblings towards an in-law family)
  const rootIdx = new Map<string, number>()
  roots.forEach((r, i) => r.members.forEach((m) => rootIdx.set(m, i)))
  const familyOf = (id: string, depth = 0): number | undefined => {
    const ps = parentsOf(id)
    if (!ps || depth > 40) return rootIdx.get(id) ?? (marriedIn.has(id) ? familyOf(marriedIn.get(id)!, depth + 1) : undefined)
    return familyOf(ps[1], depth + 1) ?? familyOf(ps[0], depth + 1)
  }
  // a couple of two people who both have parents ("two families meet"): its
  // children hang in a floating block centred under the couple, placed later
  const cross = couples.filter((c) => parentsOf(c.mother) && parentsOf(c.father))
  const floats: { couple: (typeof couples)[number]; block: Unit }[] = []
  const crossSide = (kid: string) => {
    // -1: the partner's family stands to the left, +1: to the right, 0: no such partner
    for (const c of cross) {
      const other = c.mother === kid ? c.father : c.father === kid ? c.mother : null
      if (!other) continue
      const a = familyOf(kid) ?? 0
      const b = familyOf(other) ?? 0
      return b > a ? 1 : b < a ? -1 : 0
    }
    return 0
  }
  const kidUnits = (kids: string[]) => {
    const order = kids.filter((k) => !placed.has(k)).sort((a, b) => crossSide(a) - crossSide(b))
    return order.map((kid) => {
      const ku = buildUnit([kid])
      const sp = spousesOf(kid)
      ku.members.push(...sp)
      for (const s of sp) {
        placed.add(s)
        unitOf.set(s, ku)
      }
      queue.push(ku)
      return ku
    })
  }
  // children go under the unit that holds their parents (breadth first, so
  // the order of the input decides the order of siblings)
  const queue: Unit[] = [...roots]
  const done = new Set<(typeof couples)[number]>()
  while (queue.length) {
    const u = queue.shift()!
    for (const c of couples) {
      if (done.has(c) || (!u.members.includes(c.mother) && !u.members.includes(c.father))) continue
      if (cross.includes(c)) {
        if (!unitOf.has(c.mother) || !unitOf.has(c.father)) continue // wait until both partners stand
        done.add(c)
        floats.push({ couple: c, block: { members: [], kids: kidUnits(c.children) } })
        continue
      }
      done.add(c)
      u.kids.push(...kidUnits(c.children))
    }
  }
  // anyone left over (broken links) stands alone
  for (const p of people) if (!placed.has(p.id)) roots.push(buildUnit([p.id]))

  // ---- widths and positions
  const width = new Map<Unit, number>()
  const gapAfter = (a: Unit, b: Unit) => (a.members.length > 1 || b.members.length > 1 || a.kids.length || b.kids.length ? GAP : 0)
  const measure = (u: Unit): number => {
    let kw = 0
    u.kids.forEach((k, i) => (kw += measure(k) + (i ? gapAfter(u.kids[i - 1], k) : 0)))
    const w = Math.max(u.members.length, kw)
    width.set(u, w)
    return w
  }
  const x = new Map<string, number>()
  const place = (u: Unit, x0: number) => {
    const w = width.get(u)!
    const c = x0 + w / 2
    u.members.forEach((m, i) => x.set(m, c - (u.members.length - 1) / 2 + i))
    let kw = 0
    u.kids.forEach((k, i) => (kw += width.get(k)! + (i ? gapAfter(u.kids[i - 1], k) : 0)))
    let cx = c - kw / 2
    u.kids.forEach((k, i) => {
      if (i) cx += gapAfter(u.kids[i - 1], k)
      place(k, cx)
      cx += width.get(k)!
    })
  }
  // families joined by a marriage stand shoulder to shoulder
  const joined = (a: number, b: number) => cross.some((c) => {
    const fm = familyOf(c.mother)
    const ff = familyOf(c.father)
    return (fm === a && ff === b) || (fm === b && ff === a)
  })
  let cursor = 0
  roots.forEach((r, i) => {
    measure(r)
    if (i) cursor += joined(i - 1, i) ? 0 : 1
    place(r, cursor)
    cursor += width.get(r)!
  })
  for (const f of floats) {
    const mid = (x.get(f.couple.mother)! + x.get(f.couple.father)!) / 2
    const w = measure(f.block)
    place(f.block, mid - w / 2)
  }

  // ---- safety: people of one generation are at least one slot apart; a
  // person pushed aside takes their descendants along
  const gens = Math.max(...people.map((p) => gen.get(p.id)!)) + 1
  const kidsOf = (id: string) => people.filter((q) => parentsOf(q.id)?.includes(id)).map((q) => q.id)
  const shift = (id: string, dx: number, seen: Set<string>) => {
    if (seen.has(id)) return
    seen.add(id)
    x.set(id, x.get(id)! + dx)
    for (const k of kidsOf(id)) {
      shift(k, dx, seen)
      for (const q of people) if (marriedIn.get(q.id) === k) shift(q.id, dx, seen)
    }
  }
  for (let g = 0; g < gens; g++) {
    const row = people.filter((p) => gen.get(p.id) === g).sort((a, b) => x.get(a.id)! - x.get(b.id)!)
    for (let i = 1; i < row.length; i++) {
      const need = x.get(row[i - 1].id)! + 1 - x.get(row[i].id)!
      if (need > 1e-9) shift(row[i].id, need, new Set())
    }
  }
  // ---- normalise: the leftmost person stands at x = 0
  const minX = Math.min(...people.map((p) => x.get(p.id)!))
  const nodes: PedNode[] = people.map((p) => ({ id: p.id, x: round(x.get(p.id)! - minX), gen: gen.get(p.id)!, person: p }))
  const at = new Map(nodes.map((n) => [n.id, n]))
  const outCouples: PedCouple[] = couples.map((c) => {
    const m = at.get(c.mother)!
    const f = at.get(c.father)!
    const [left, right] = m.x <= f.x ? [m, f] : [f, m]
    return {
      mother: c.mother,
      father: c.father,
      left: left.id,
      right: right.id,
      gen: Math.max(m.gen, f.gen),
      mid: round((m.x + f.x) / 2),
      children: c.children,
    }
  })
  return { nodes, couples: outCouples, gens, width: Math.max(...nodes.map((n) => n.x)) + 1 }
}

const round = (v: number) => Math.round(v * 1000) / 1000

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
export const roman = (i: number) => ROMAN[i] ?? String(i + 1)
