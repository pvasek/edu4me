/**
 * Auto layout of a circuit schematic: a rectangular loop with the source on the
 * left side and the series parts laid clockwise along the top, the right and
 * (when they don't fit) the bottom side. A parallel group becomes a ladder whose
 * branches (series lists) step inwards from the side it sits on.
 *
 * Pure geometry (no React), so it can be unit-tested: every component body and
 * label gets a box, and the layout grows until no two boxes overlap.
 */
import type { CircuitComponent, CircuitComponentKind, CircuitPart, CircuitSource } from '../../core/types'
import { overlaps, textW, type Box } from './kit'

type Pt = [number, number]
export type Side = 'top' | 'right' | 'bottom' | 'left'

/** Half-length along the wire (where the wire stops) and the extent above it (label side) / below it. */
export const SYMBOL: Record<CircuitComponentKind, { body: number; up: number; down: number }> = {
  resistor: { body: 15, up: 7, down: 7 },
  lamp: { body: 11, up: 11, down: 11 },
  switch: { body: 13, up: 6, down: 4 },
  'switch-open': { body: 13, up: 15, down: 4 },
  ammeter: { body: 12, up: 12, down: 12 },
  voltmeter: { body: 12, up: 12, down: 12 },
  ohmmeter: { body: 12, up: 12, down: 12 },
  diode: { body: 8, up: 9, down: 9 },
  'diode-reverse': { body: 8, up: 9, down: 9 },
  led: { body: 8, up: 20, down: 9 },
  capacitor: { body: 4, up: 12, down: 12 },
  coil: { body: 16, up: 9, down: 2 },
  motor: { body: 13, up: 13, down: 13 },
  fuse: { body: 14, up: 6, down: 6 },
  breaker: { body: 14, up: 8, down: 5 },
  rheostat: { body: 15, up: 14, down: 13 },
  ldr: { body: 15, up: 23, down: 7 },
  thermistor: { body: 15, up: 13, down: 12 },
  bell: { body: 11, up: 12, down: 3 },
  wire: { body: 0, up: 0, down: 0 },
}
export const SOURCE_BODY: Record<CircuitSource['kind'], number> = { cell: 5, battery: 15, dc: 14, ac: 14 }

const LABEL = 14.5 // label font size
const ROT: Record<Side, number> = { top: 0, right: 90, bottom: 180, left: 270 }

export interface PlacedComp {
  kind: CircuitComponentKind
  label?: string
  x: number
  y: number
  side: Side
  rot: number
  /** body box (global) */
  box: Box
  /** label anchor + box */
  lx: number
  ly: number
  anchor: 'start' | 'middle' | 'end'
  lbox?: Box
  /** index of the part in `parts`, branch index for group members */
  part: number
  branch?: number
  /** current flows through it (a lamp then glows) */
  live: boolean
}

export interface CircuitLayout {
  comps: PlacedComp[]
  /** wire polylines */
  wires: Pt[][]
  junctions: Pt[]
  source: { kind: CircuitSource['kind']; label?: string; x: number; y: number; box: Box; lbox?: Box; lx: number; ly: number }
  /** loop size: left x = 0, top y = 0 */
  w: number
  h: number
  /** bounding box of the whole drawing */
  box: Box
  /** paths current flows along (the main loop first, then conducting side branches) */
  flows: string[]
  closed: boolean
}

const isGroup = (p: CircuitPart): p is { parallel: CircuitComponent[][] } => 'parallel' in p

/** Slot length of one component along a side (horizontal sides also fit the label width). */
function slot(c: CircuitComponent, horiz: boolean): number {
  const s = SYMBOL[c.kind]
  if (c.kind === 'wire') return 24
  const lw = c.label ? textW(c.label, LABEL) + 14 : 0
  return Math.max(horiz ? 56 : 50, 2 * s.body + 26, horiz ? lw : 0)
}
const branchLen = (b: CircuitComponent[], horiz: boolean) => (b.length ? b.reduce((a, c) => a + slot(c, horiz), 0) : 24)
const STUB = 16

interface Item {
  part: number
  lenH: number
  lenV: number
  /** ladder step between branches */
  gapH: number
  gapV: number
  group?: CircuitComponent[][]
  comp?: CircuitComponent
}

function item(p: CircuitPart, i: number): Item {
  if (!isGroup(p)) return { part: i, comp: p, lenH: slot(p, true), lenV: slot(p, false), gapH: 0, gapV: 0 }
  const br = p.parallel
  const all = br.flat()
  const up = Math.max(6, ...all.map((c) => SYMBOL[c.kind].up))
  const down = Math.max(6, ...all.map((c) => SYMBOL[c.kind].down))
  const lw = Math.max(0, ...all.map((c) => (c.label ? textW(c.label, LABEL) : 0)))
  return {
    part: i,
    group: br,
    lenH: Math.max(...br.map((b) => branchLen(b, true))) + 2 * STUB,
    lenV: Math.max(...br.map((b) => branchLen(b, false))) + 2 * STUB,
    gapH: Math.max(46, up + down + (all.some((c) => c.label) ? LABEL + 12 : 12)),
    gapV: Math.max(48, up + down + (lw ? lw + 16 : 12)),
  }
}

/**
 * Does (steady) current pass the component? An open switch never conducts; on a DC source a
 * capacitor and a diode in reverse bias (`diode-reverse`) block it. On AC both conduct (a diode
 * lets one half-wave through). `diodes: false` treats reverse diodes as conducting (is the loop
 * closed apart from them?).
 */
const conducts = (c: CircuitComponent, ac: boolean, diodes = true) =>
  c.kind !== 'switch-open' && (ac || (c.kind !== 'capacitor' && (!diodes || c.kind !== 'diode-reverse')))
const branchConducts = (b: CircuitComponent[], ac: boolean, diodes = true) => b.every((c) => conducts(c, ac, diodes))

/**
 * Is there a closed path for (steady) current through the whole circuit?
 * With `diodes: false`, reverse-biased diodes count as conducting.
 */
export function circuitClosed(source: CircuitSource, parts: CircuitPart[], diodes = true): boolean {
  const ac = source.kind === 'ac'
  return parts.every((p) => (isGroup(p) ? p.parallel.some((b) => branchConducts(b, ac, diodes)) : conducts(p, ac, diodes)))
}

export function layoutCircuit(source: CircuitSource, parts: CircuitPart[], narrow = false): CircuitLayout {
  const items = parts.map(item)
  const maxTop = narrow ? 260 : 440
  const maxRight = narrow ? 290 : 260

  // ---- assign items to sides, keeping their order clockwise: top → right → bottom.
  // The top and bottom sides are limited in width (phones), the right side may grow tall.
  const sides: Record<'top' | 'right' | 'bottom', Item[]> = { top: [], right: [], bottom: [] }
  let acc = 0
  let i = 0
  for (; i < items.length; i++) {
    if (sides.top.length && acc + items[i].lenH > maxTop) break
    sides.top.push(items[i])
    acc += items[i].lenH
  }
  const rest = items.slice(i)
  if (rest.reduce((a, it) => a + it.lenV, 0) <= maxRight) sides.right = rest
  else {
    acc = 0
    let j = rest.length
    while (j > 1 && acc + rest[j - 1].lenH <= maxTop) {
      j--
      acc += rest[j].lenH
    }
    // the right side's ladders eat into the bottom side: hand bottom items back to the right side until it fits
    const rightDepth = (k: number) => Math.max(0, ...rest.slice(0, k).map((it) => (it.group ? (it.group.length - 1) * it.gapV : 0)))
    while (j < rest.length && rest.slice(j).reduce((a, it) => a + it.lenH, 0) + rightDepth(j) > maxTop) j++
    sides.right = rest.slice(0, j)
    sides.bottom = rest.slice(j)
  }
  const len = (s: Side, list: Item[]) => list.reduce((a, it) => a + (s === 'right' ? it.lenV : it.lenH), 0)
  const depth = (s: Side, list: Item[]) =>
    Math.max(0, ...list.map((it) => (it.group ? (it.group.length - 1) * (s === 'right' ? it.gapV : it.gapH) : 0)))
  const dTop = depth('top', sides.top)
  const dBot = depth('bottom', sides.bottom)
  const dRight = depth('right', sides.right)
  const srcLen = 2 * SOURCE_BODY[source.kind] + 60

  // ladders step inwards; keep the neighbouring sides clear of them near the corners
  let W = Math.max(narrow ? 190 : 230, len('top', sides.top) + 40 + dRight, len('bottom', sides.bottom) + 40 + dRight, dRight + 90)
  let H = Math.max(narrow ? 150 : 160, len('right', sides.right) + 40 + dTop + dBot, srcLen, dTop + dBot + 70)

  for (let iter = 0; iter < 60; iter++) {
    const out = place(W, H)
    const boxes: { b: Box; key: string }[] = []
    for (const c of out.comps) {
      if (c.kind !== 'wire') boxes.push({ b: c.box, key: `c${c.part}.${c.branch ?? ''}` })
      if (c.lbox) boxes.push({ b: c.lbox, key: `l${c.part}.${c.branch ?? ''}` })
    }
    boxes.push({ b: out.source.box, key: 's' })
    if (out.source.lbox) boxes.push({ b: out.source.lbox, key: 'sl' })
    let bad = false
    for (let i = 0; i < boxes.length && !bad; i++)
      for (let j = i + 1; j < boxes.length; j++)
        if (overlaps(boxes[i].b, boxes[j].b, 3)) {
          bad = true
          break
        }
    // bodies and labels must not sit on wires (a wire ending at a body edge doesn't count)
    if (!bad)
      outer: for (const { b } of boxes)
        for (const wire of out.wires)
          for (let k = 1; k < wire.length; k++)
            if (segBox(wire[k - 1], wire[k], b)) {
              bad = true
              break outer
            }
    // wires may meet only at their ends (corners, T-junctions), never cross or run on top of each other
    if (!bad) bad = wiresClash(out.wires)
    if (!bad) return out
    W += 14
    H += 12
  }
  return place(W, H)

  // ------------------------------------------------------------------ placement
  function place(W: number, H: number): CircuitLayout {
    const comps: PlacedComp[] = []
    const wires: Pt[][] = []
    const junctions: Pt[] = []
    const flows: string[] = []
    const ac = source.kind === 'ac'
    // side point: t along the side (clockwise), d inwards
    const P = (s: Side, t: number, d: number): Pt =>
      s === 'top' ? [t, d] : s === 'right' ? [W - d, t] : s === 'bottom' ? [W - t, H - d] : [d, H - t]
    const sideLen = (s: Side) => (s === 'top' || s === 'bottom' ? W : H)
    let mainOk = true

    /** A straight run from t0 to t1 at depth d, cut around component bodies. */
    const run = (s: Side, t0: number, t1: number, d: number, bodies: [number, number][]) => {
      const cuts = bodies.filter(([, b]) => b > 0).sort((a, b) => a[0] - b[0])
      let from = t0
      for (const [t, b] of cuts) {
        if (t - b > from) wires.push([P(s, from, d), P(s, t - b, d)])
        from = t + b
      }
      if (t1 > from) wires.push([P(s, from, d), P(s, t1, d)])
    }

    const putComp = (c: CircuitComponent, s: Side, t: number, d: number, part: number, branch?: number, live = true): number => {
      const [x, y] = P(s, t, d)
      const sym = SYMBOL[c.kind]
      const along = sym.body
      // body box: `up` is outwards
      const box: Box =
        s === 'top'
          ? { x: x - along, y: y - sym.up, w: 2 * along, h: sym.up + sym.down }
          : s === 'bottom'
            ? { x: x - along, y: y - sym.down, w: 2 * along, h: sym.up + sym.down }
            : s === 'right'
              ? { x: x - sym.down, y: y - along, w: sym.up + sym.down, h: 2 * along }
              : { x: x - sym.up, y: y - along, w: sym.up + sym.down, h: 2 * along }
      let lx = x
      let ly = y
      let anchor: PlacedComp['anchor'] = 'middle'
      let lbox: Box | undefined
      if (c.label && c.kind !== 'wire') {
        const tw = textW(c.label, LABEL)
        const off = sym.up + 5
        if (s === 'top') {
          ly = y - off - 1
          lbox = { x: x - tw / 2, y: ly - LABEL * 0.8, w: tw, h: LABEL }
        } else if (s === 'bottom') {
          ly = y + off + LABEL * 0.8
          lbox = { x: x - tw / 2, y: y + off, w: tw, h: LABEL }
        } else if (s === 'right') {
          lx = x + off + 1
          ly = y + 5
          anchor = 'start'
          lbox = { x: lx, y: y - LABEL / 2, w: tw, h: LABEL }
        } else {
          lx = x - off - 1
          ly = y + 5
          anchor = 'end'
          lbox = { x: lx - tw, y: y - LABEL / 2, w: tw, h: LABEL }
        }
      }
      comps.push({ kind: c.kind, label: c.label, x, y, side: s, rot: ROT[s], box, lx, ly, anchor, lbox, part, branch, live })
      return along
    }

    /** Lays the items of one side; returns body cuts on the main line. */
    const lay = (s: 'top' | 'right' | 'bottom', list: Item[]) => {
      const horiz = s !== 'right'
      const L = sideLen(s)
      const lens = list.map((it) => (horiz ? it.lenH : it.lenV))
      const total = lens.reduce((a, b) => a + b, 0)
      // usable span along the side (clear of the ladders of the neighbouring sides)
      const a0 = 20 + (s === 'right' ? dTop : s === 'bottom' ? dRight : 0)
      const a1 = L - 20 - (s === 'right' ? dBot : s === 'top' ? dRight : 0)
      const free = Math.max(0, a1 - a0 - total)
      const gap = free / (list.length + 1)
      let t = a0 + gap
      const cuts: [number, number][] = []
      list.forEach((it, i) => {
        const t0 = t
        const t1 = t + lens[i]
        if (it.comp) {
          const b = putComp(it.comp, s, (t0 + t1) / 2, 0, it.part)
          cuts.push([(t0 + t1) / 2, b])
          if (!conducts(it.comp, ac)) mainOk = false
        } else if (it.group) {
          const br = it.group
          const step = horiz ? it.gapH : it.gapV
          const g0 = t0 + 2
          const g1 = t1 - 2
          // rails
          wires.push([P(s, g0, 0), P(s, g0, (br.length - 1) * step)])
          wires.push([P(s, g1, 0), P(s, g1, (br.length - 1) * step)])
          for (let k = 0; k < br.length - 1; k++) junctions.push(P(s, g0, k * step), P(s, g1, k * step))
          br.forEach((b, k) => {
            const d = k * step
            const inner = g1 - g0 - 2 * STUB + 4
            const bl = b.map((c) => slot(c, horiz))
            const bt = bl.reduce((a, x) => a + x, 0)
            const bg = Math.max(0, inner - bt) / (b.length + 1)
            let u = g0 + STUB - 2 + bg
            const bcuts: [number, number][] = []
            b.forEach((c, j) => {
              const mid = u + bl[j] / 2
              bcuts.push([mid, putComp(c, s, mid, d, it.part, k, branchConducts(b, ac))])
              u += bl[j] + bg
            })
            if (k === 0) cuts.push(...bcuts)
            else run(s, g0, g1, d, bcuts)
            if (k === 0 && !branchConducts(b, ac)) mainOk = false
            if (k > 0 && branchConducts(b, ac)) {
              const a = P(s, g0, 0)
              const p1 = P(s, g0, d)
              const p2 = P(s, g1, d)
              const z = P(s, g1, 0)
              flows.push(`M${a[0]} ${a[1]} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} L${z[0]} ${z[1]}`)
            }
          })
        }
        t = t1 + gap
      })
      run(s, 0, L, 0, cuts)
    }

    lay('top', sides.top)
    lay('right', sides.right)
    lay('bottom', sides.bottom)

    // source on the left side, + terminal up
    const sb = SOURCE_BODY[source.kind]
    const sy = H / 2
    run('left', 0, H, 0, [[H / 2, sb]])
    const sbox: Box = { x: -15, y: sy - sb, w: 42, h: 2 * sb }
    let slbox: Box | undefined
    const slx = -20
    const sly = sy + 5
    if (source.label) {
      const tw = textW(source.label, LABEL)
      slbox = { x: slx - tw, y: sy - LABEL / 2, w: tw, h: LABEL }
    }

    const closed = circuitClosed(source, parts)
    const flowing = closed && mainOk
    for (const c of comps) c.live = c.live && flowing
    const main = `M0 0 H${W} V${H} H0 Z`
    const all: Box[] = [{ x: 0, y: 0, w: W, h: H }, sbox]
    if (slbox) all.push(slbox)
    for (const c of comps) {
      all.push(c.box)
      if (c.lbox) all.push(c.lbox)
    }
    const minX = Math.min(...all.map((b) => b.x))
    const minY = Math.min(...all.map((b) => b.y))
    const maxX = Math.max(...all.map((b) => b.x + b.w))
    const maxY = Math.max(...all.map((b) => b.y + b.h))
    return {
      comps,
      wires,
      junctions,
      source: { kind: source.kind, label: source.label, x: 0, y: sy, box: sbox, lbox: slbox, lx: slx, ly: sly },
      w: W,
      h: H,
      box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
      flows: flowing ? [main, ...flows] : [],
      closed,
    }
  }
}

function segBox(p: Pt, q: Pt, b: Box): boolean {
  // wires are axis-aligned: shrink the label box a little so touching doesn't count
  const s = { x: b.x + 1, y: b.y + 1, w: b.w - 2, h: b.h - 2 }
  const x0 = Math.min(p[0], q[0])
  const x1 = Math.max(p[0], q[0])
  const y0 = Math.min(p[1], q[1])
  const y1 = Math.max(p[1], q[1])
  return x1 >= s.x && x0 <= s.x + s.w && y1 >= s.y && y0 <= s.y + s.h
}

/** Do two axis-aligned wires cross (interior to both) or overlap along a line? */
export function wiresClash(wires: Pt[][]): boolean {
  const segs: [Pt, Pt][] = []
  for (const w of wires) for (let k = 1; k < w.length; k++) segs.push([w[k - 1], w[k]])
  const e = 0.5
  for (let i = 0; i < segs.length; i++)
    for (let j = i + 1; j < segs.length; j++) {
      const [p, q] = segs[i]
      const [r, t] = segs[j]
      const hA = Math.abs(p[1] - q[1]) < e
      const hB = Math.abs(r[1] - t[1]) < e
      const ax0 = Math.min(p[0], q[0])
      const ax1 = Math.max(p[0], q[0])
      const ay0 = Math.min(p[1], q[1])
      const ay1 = Math.max(p[1], q[1])
      const bx0 = Math.min(r[0], t[0])
      const bx1 = Math.max(r[0], t[0])
      const by0 = Math.min(r[1], t[1])
      const by1 = Math.max(r[1], t[1])
      if (hA === hB) {
        // parallel: clash when on the same line and overlapping by more than a point
        const same = hA ? Math.abs(p[1] - r[1]) < e : Math.abs(p[0] - r[0]) < e
        const ov = hA ? Math.min(ax1, bx1) - Math.max(ax0, bx0) : Math.min(ay1, by1) - Math.max(ay0, by0)
        if (same && ov > e) return true
        continue
      }
      // perpendicular: the crossing point must be strictly inside both
      const [h0, h1, hy, v0, v1, vx] = hA ? [ax0, ax1, p[1], by0, by1, r[0]] : [bx0, bx1, r[1], ay0, ay1, p[0]]
      if (vx > h0 + e && vx < h1 - e && hy > v0 + e && hy < v1 - e) return true
    }
  return false
}
