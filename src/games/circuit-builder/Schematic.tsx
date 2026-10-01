/**
 * European circuit schematic for Stavitel obvodů, laid out from the
 * series–parallel tree: series = left to right, parallel = branches stacked
 * below the main wire. The source sits on the bottom wire (long plate = +).
 *
 * With a solution it shows lamp glow ∝ power, meter readings and moving
 * current dots (static under prefers-reduced-motion).
 */
import type { KeyboardEvent, ReactNode } from 'react'
import { fmt, isGroup, label, lampIds, power, type Circuit, type Net, type Part, type Solution } from './logic'

const CW = 66 // cell width of one part
const CH = 72 // height of one branch row
const PAD = 11 // space between a parallel bus and its branches
const SIDE = 20 // left/right margin to the loop wire
const TOP = 10

interface Box {
  w: number
  h: number
  /** y of the wire, from the top of the box. */
  y0: number
}

function measure(n: Net): Box {
  if (!isGroup(n)) return { w: CW, h: CH, y0: CH / 2 }
  const bs = n.items.map(measure)
  if (n.t === 'ser') {
    const y0 = Math.max(...bs.map((b) => b.y0))
    return { w: bs.reduce((s, b) => s + b.w, 0), h: Math.max(...bs.map((b) => y0 - b.y0 + b.h)), y0 }
  }
  return { w: Math.max(...bs.map((b) => b.w)) + 2 * PAD, h: bs.reduce((s, b) => s + b.h, 0), y0: bs[0].y0 }
}

interface Seg {
  x1: number
  y1: number
  x2: number
  y2: number
  I: number
}

interface Ctx {
  segs: Seg[]
  dots: [number, number][]
  parts: { part: Part; cx: number; cy: number; I: number }[]
  sol?: Solution | null
}

const HALF: Record<Part['t'], number> = { lamp: 14, res: 16, switch: 14, A: 14, V: 14, wire: 0, slot: 22 }

const flowOf = (ctx: Ctx, n: Net) => {
  const f = ctx.sol?.node.get(n)
  return f && Number.isFinite(f.I) ? f.I : ctx.sol?.node.get(n) ? 99 : 0
}

function place(n: Net, x: number, top: number, W: number, ctx: Ctx) {
  const b = measure(n)
  const y = top + b.y0
  const I = flowOf(ctx, n)
  if (!isGroup(n)) {
    const cx = x + W / 2
    const hw = HALF[n.t]
    ctx.segs.push({ x1: x, y1: y, x2: cx - hw, y2: y, I }, { x1: cx + hw, y1: y, x2: x + W, y2: y, I })
    if (n.t === 'wire') ctx.segs.push({ x1: cx - 1, y1: y, x2: cx + 1, y2: y, I })
    ctx.parts.push({ part: n, cx, cy: y, I })
    return
  }
  const bs = n.items.map(measure)
  if (n.t === 'ser') {
    const extra = (W - b.w) / n.items.length
    let cx = x
    n.items.forEach((it, k) => {
      const w = bs[k].w + extra
      place(it, cx, top + b.y0 - bs[k].y0, w, ctx)
      cx += w
    })
    return
  }
  const xl = x + PAD
  const xr = x + W - PAD
  ctx.segs.push({ x1: x, y1: y, x2: xl, y2: y, I }, { x1: xr, y1: y, x2: x + W, y2: y, I })
  let t = top
  const ys: number[] = []
  n.items.forEach((it, k) => {
    ys.push(t + bs[k].y0)
    place(it, xl, t, xr - xl, ctx)
    t += bs[k].h
  })
  const Is = n.items.map((it) => flowOf(ctx, it))
  for (let k = 0; k < ys.length - 1; k++) {
    const below = Is.slice(k + 1).reduce((s, v) => s + v, 0)
    ctx.segs.push({ x1: xl, y1: ys[k], x2: xl, y2: ys[k + 1], I: below }, { x1: xr, y1: ys[k + 1], x2: xr, y2: ys[k], I: below })
    ctx.dots.push([xl, ys[k]], [xr, ys[k]])
  }
}

// ------------------------------------------------------------------ symbols

/** Label with a numeric subscript drawn as a real subscript ("Ž₁" → Ž + ₁ as tspan). */
function Name({ id, x, y, cls = 'cb-name' }: { id: string; x: number; y: number; cls?: string }) {
  const m = id.match(/^([A-Za-z]+)(\d*)$/)
  const base = m ? (m[1] === 'Z' ? 'Ž' : m[1]) : id
  return (
    <text x={x} y={y} className={cls} textAnchor="middle">
      {base}
      {m?.[2] ? (
        <tspan className="cb-sub" dy="4">
          {m[2]}
        </tspan>
      ) : null}
    </text>
  )
}

export interface SymbolOpts {
  /** Glow 0–1 for lamps (undefined = unlit, not yet solved). */
  glow?: number
  /** Show the resistance value under lamps. */
  lampValue?: boolean
  /** Hide labels (tray icons). */
  bare?: boolean
}

/** One part drawn centred at (cx, cy). */
export function PartSymbol({ part, cx, cy, opts = {} }: { part: Part; cx: number; cy: number; opts?: SymbolOpts }) {
  const { glow, bare } = opts
  switch (part.t) {
    case 'lamp': {
      const k = glow ?? 0
      const r = 12
      const d = r * 0.7071
      return (
        <g className={`cb-lamp${part.burnt ? ' is-burnt' : ''}`}>
          {k > 0 && <circle cx={cx} cy={cy} r={r + 3 + 9 * k} className="cb-halo" style={{ opacity: 0.18 + 0.42 * k }} />}
          <circle cx={cx} cy={cy} r={r} className="cb-bulb" style={k > 0 ? { fillOpacity: 0.25 + 0.75 * k } : undefined} data-lit={k > 0 ? '1' : '0'} />
          {part.burnt ? (
            <path d={`M${cx - d} ${cy - d}L${cx - 2} ${cy - 2}M${cx + 2} ${cy + 2}L${cx + d} ${cy + d}M${cx + d} ${cy - d}L${cx + 3} ${cy - 1}l-3 3l-3-1l-3 3M${cx - 3} ${cy + 3}L${cx - d} ${cy + d}`} className="cb-stroke" />
          ) : (
            <path d={`M${cx - d} ${cy - d}L${cx + d} ${cy + d}M${cx + d} ${cy - d}L${cx - d} ${cy + d}`} className="cb-stroke" />
          )}
          {!bare && <Name id={part.id} x={cx} y={cy - 20} />}
          {!bare && part.burnt && (
            <text x={cx} y={cy + 27} className="cb-val cb-warn" textAnchor="middle">
              přepálená
            </text>
          )}
          {!bare && !part.burnt && opts.lampValue && (
            <text x={cx} y={cy + 27} className="cb-val" textAnchor="middle">
              {fmt(part.r)} Ω
            </text>
          )}
        </g>
      )
    }
    case 'res':
      return (
        <g>
          <rect x={cx - 16} y={cy - 6} width={32} height={12} className="cb-body" />
          {!bare && <Name id={part.id} x={cx} y={cy - 13} />}
          {!bare && (
            <text x={cx} y={cy + 22} className="cb-val" textAnchor="middle">
              {fmt(part.r)} Ω
            </text>
          )}
        </g>
      )
    case 'switch': {
      const x1 = cx - 12
      const x2 = cx + 12
      return (
        <g className="cb-switch">
          <line x1={cx - 14} y1={cy} x2={x1} y2={cy} className="cb-stroke" />
          <line x1={x2} y1={cy} x2={cx + 14} y2={cy} className="cb-stroke" />
          <circle cx={x1} cy={cy} r={2.6} className="cb-node" />
          <circle cx={x2} cy={cy} r={2.6} className="cb-node" />
          <line x1={x1} y1={cy} x2={part.closed ? x2 : cx + 9} y2={part.closed ? cy - 1 : cy - 13} className="cb-stroke cb-lever" />
          {!bare && <Name id={part.id} x={cx} y={cy - 18} />}
          {!bare && (
            <text x={cx} y={cy + 22} className="cb-val" textAnchor="middle">
              {part.closed ? 'sepnutý' : 'rozepnutý'}
            </text>
          )}
        </g>
      )
    }
    case 'A':
    case 'V':
      return (
        <g>
          <circle cx={cx} cy={cy} r={12} className="cb-meter" />
          <text x={cx} y={cy + 5} className="cb-meter-t" textAnchor="middle">
            {part.t}
          </text>
        </g>
      )
    case 'wire':
      return <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} className="cb-stroke" />
    case 'slot':
      return null
  }
}

// ------------------------------------------------------------------ source

function Source({ c, cx, cy, hideRi }: { c: Circuit; cx: number; cy: number; hideRi?: boolean }) {
  const withRi = c.ri > 0 || hideRi
  const bx = withRi ? cx - 22 : cx
  return (
    <g>
      {/* battery: long thin plate = +, short thick plate = − */}
      <line x1={bx - 5} y1={cy - 15} x2={bx - 5} y2={cy + 15} className="cb-stroke" />
      <line x1={bx + 5} y1={cy - 8} x2={bx + 5} y2={cy + 8} className="cb-plate" />
      <text x={bx - 12} y={cy - 10} className="cb-sign" textAnchor="middle">
        +
      </text>
      <text x={bx + 13} y={cy - 10} className="cb-sign" textAnchor="middle">
        −
      </text>
      {withRi && (
        <>
          <rect x={cx + 10} y={cy - 5} width={24} height={10} className="cb-body" />
          <rect x={bx - 22} y={cy - 24} width={cx + 44 - (bx - 22)} height={48} rx={6} className="cb-srcbox" />
        </>
      )}
      <text x={cx} y={cy + 42} className="cb-srcval" textAnchor="middle">
        {withRi ? (
          <>
            U<tspan className="cb-sub" dy="3">e</tspan>
            <tspan dy="-3"> = {fmt(c.ue)} V, R</tspan>
            <tspan className="cb-sub" dy="3">i</tspan>
            <tspan dy="-3"> = {hideRi ? '?' : `${fmt(c.ri)} Ω`}</tspan>
          </>
        ) : (
          `${fmt(c.ue)} V`
        )}
      </text>
    </g>
  )
}

// ------------------------------------------------------------------ schematic

export interface SlotState {
  content: Record<string, Part | undefined>
  /** A piece is selected in the tray (slots invite a tap). */
  armed: boolean
  onSlot: (id: string) => void
  /** Slot number shown to screen readers. */
  names: Record<string, string>
  locked?: boolean
}

export interface SchematicProps {
  circuit: Circuit
  sol?: Solution | null
  lampValues?: boolean
  hideRi?: boolean
  /** Meter readings shown as given data. */
  given?: Record<string, number>
  /** Power that means "full glow" (so before/after views share one scale). */
  pRef?: number
  /** Lamp to mark with a ring (the one the question is about). */
  target?: string
  slots?: SlotState
  onSwitch?: (id: string) => void
  label: string
}

const unitOf = (p: Part) => (p.t === 'V' ? 'V' : 'A')

export function Schematic({ circuit, sol, lampValues, hideRi, given, pRef, target, slots, onSwitch, label: aria }: SchematicProps) {
  const box = measure(circuit.net)
  const withRi = circuit.ri > 0 || !!hideRi
  const W = Math.max(box.w, withRi ? 150 : 90)
  const ctx: Ctx = { segs: [], dots: [], parts: [], sol }
  const yTop = TOP + box.y0
  place(circuit.net, SIDE, TOP, W, ctx)
  const bottom = TOP + box.h + 16
  const scx = SIDE + W / 2
  const Imain = sol ? (Number.isFinite(sol.I) ? sol.I : 99) : 0
  const srcL = withRi ? scx - 22 - 5 : scx - 5
  const srcR = withRi ? scx + 34 : scx + 5
  ctx.segs.push(
    { x1: srcL, y1: bottom, x2: SIDE, y2: bottom, I: Imain },
    { x1: SIDE, y1: bottom, x2: SIDE, y2: yTop, I: Imain },
    { x1: SIDE + W, y1: yTop, x2: SIDE + W, y2: bottom, I: Imain },
    { x1: SIDE + W, y1: bottom, x2: srcR, y2: bottom, I: Imain },
  )
  if (withRi) ctx.segs.push({ x1: scx + 10, y1: bottom, x2: scx - 17, y2: bottom, I: Imain })
  const vbW = W + 2 * SIDE
  const vbH = bottom + 52

  const lamps = lampIds(circuit.net)
  const ref = pRef ?? (sol ? Math.max(1e-9, ...lamps.map((id) => power(sol, id))) : 1)
  const glowOf = (id: string) => {
    if (!sol) return undefined
    const p = power(sol, id)
    return p > 1e-9 ? Math.min(1, Math.pow(p / ref, 0.6)) : 0
  }
  const Imax = Math.max(1e-9, ...ctx.segs.map((s) => (s.I < 99 ? s.I : 0)))
  const interactive = !!slots || !!onSwitch

  const nodes: ReactNode[] = []
  ctx.parts.forEach(({ part, cx, cy }, i) => {
    const key = `p${i}`
    if (part.t === 'slot') {
      const inside = slots?.content[part.id]
      const name = slots?.names[part.id] ?? part.id
      const act = () => slots?.onSlot(part.id)
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          act()
        }
      }
      const desc = inside ? pieceName(inside) : 'prázdné'
      nodes.push(
        <g
          key={key}
          className={`cb-slot${inside ? ' is-full' : ''}${slots?.armed ? ' is-armed' : ''}${slots?.locked ? ' is-locked' : ''}`}
          role={slots && !slots.locked ? 'button' : undefined}
          tabIndex={slots && !slots.locked ? 0 : undefined}
          aria-label={`${name}: ${desc}`}
          onClick={slots && !slots.locked ? act : undefined}
          onKeyDown={slots && !slots.locked ? onKey : undefined}
        >
          <rect x={cx - CW / 2 + 2} y={cy - CH / 2 + 4} width={CW - 4} height={CH - 8} className="cb-hit" />
          <rect x={cx - 22} y={cy - 17} width={44} height={34} rx={7} className="cb-slotbox" />
          {inside ? (
            <PartSymbol part={inside} cx={cx} cy={cy} opts={{ glow: inside.t === 'lamp' ? glowOf(inside.id) : undefined, bare: true }} />
          ) : (
            <text x={cx} y={cy + 6} className="cb-plus" textAnchor="middle">
              +
            </text>
          )}
          {inside && 'id' in inside && inside.id && inside.t !== 'wire' && inside.t !== 'A' && inside.t !== 'V' && <Name id={inside.id} x={cx} y={cy - 22} />}
          {inside?.t === 'res' && (
            <text x={cx} y={cy + 29} className="cb-val" textAnchor="middle">
              {fmt(inside.r)} Ω
            </text>
          )}
          {inside && (inside.t === 'A' || inside.t === 'V') && sol && <Reading value={readingOf(sol, inside)} unit={unitOf(inside)} x={cx} y={cy + 30} />}
        </g>,
      )
      return
    }
    const glow = part.t === 'lamp' ? glowOf(part.id) : undefined
    const sym = <PartSymbol part={part} cx={cx} cy={cy} opts={{ glow, lampValue: lampValues }} />
    if (part.t === 'switch' && onSwitch) {
      nodes.push(
        <g
          key={key}
          className="cb-tap"
          role="button"
          tabIndex={0}
          aria-label={`Spínač ${label(part.id)}: ${part.closed ? 'sepnutý' : 'rozepnutý'}. Přepnout.`}
          onClick={() => onSwitch(part.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSwitch(part.id)
            }
          }}
        >
          <rect x={cx - CW / 2 + 4} y={cy - CH / 2 + 4} width={CW - 8} height={CH - 8} rx={8} className="cb-hit" />
          {sym}
        </g>,
      )
    } else nodes.push(<g key={key}>{sym}</g>)
    if (part.t === 'lamp' && part.id === target) nodes.push(<circle key={`${key}t`} cx={cx} cy={cy} r={19} className="cb-target" />)
    if ((part.t === 'A' || part.t === 'V') && (sol || given?.[part.id] !== undefined)) {
      const v = given?.[part.id] ?? readingOf(sol!, part)
      nodes.push(<Reading key={`${key}r`} value={v} unit={unitOf(part)} x={cx} y={cy + 27} given={given?.[part.id] !== undefined} />)
    }
  })

  return (
    <svg
      className="cb-svg"
      viewBox={`0 0 ${vbW} ${vbH}`}
      style={{ width: Math.round(vbW * 1.4), maxWidth: '100%' }}
      role={interactive ? 'group' : 'img'}
      aria-label={aria}
    >
      <g>
        {ctx.segs.map((s, i) => (
          <line key={`w${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className="cb-wire" />
        ))}
        {ctx.dots.map(([x, y], i) => (
          <circle key={`d${i}`} cx={x} cy={y} r={3} className="cb-node" />
        ))}
        {sol &&
          ctx.segs.map((s, i) => {
            if (!(s.I > 1e-9)) return null
            const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1)
            if (len < 3) return null
            const v = 14 + 46 * Math.min(1, s.I / Imax)
            return (
              <line
                key={`f${i}`}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                className="cb-flow"
                style={{ animationDuration: `${(12 / v).toFixed(2)}s` }}
              />
            )
          })}
        <Source c={circuit} cx={scx} cy={bottom} hideRi={hideRi} />
        {nodes}
      </g>
    </svg>
  )
}

function readingOf(sol: Solution, p: Part): number {
  const f = 'id' in p && p.id ? sol.part.get(p.id) : undefined
  if (!f) return NaN
  return p.t === 'V' ? f.U : f.I
}

function Reading({ value, unit, x, y, given }: { value: number; unit: string; x: number; y: number; given?: boolean }) {
  const text = Number.isFinite(value) ? `${fmt(value)} ${unit}` : '∞'
  const w = text.length * 7 + 10
  return (
    <g className={`cb-reading${given ? ' is-given' : ''}`}>
      <rect x={x - w / 2} y={y - 12} width={w} height={17} rx={4} />
      <text x={x} y={y + 1} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

/** Czech name of a piece for the tray and screen readers. */
export function pieceName(p: Part): string {
  switch (p.t) {
    case 'lamp':
      return `žárovka ${label(p.id)}`
    case 'res':
      return `rezistor ${label(p.id)} ${fmt(p.r)} Ω`
    case 'switch':
      return `spínač ${label(p.id)}`
    case 'A':
      return 'ampérmetr'
    case 'V':
      return 'voltmetr'
    case 'wire':
      return 'drát'
    case 'slot':
      return 'prázdné místo'
  }
}

/** Short spoken description of a circuit for aria-label. */
export function describe(c: Circuit, lampValues = false): string {
  const d = (n: Net): string => {
    if (!isGroup(n)) {
      if (n.t === 'lamp') return `žárovka ${label(n.id)}${lampValues ? ` ${fmt(n.r)} Ω` : ''}`
      if (n.t === 'slot') return 'prázdné místo'
      return pieceName(n)
    }
    const inner = n.items.map(d).join(n.t === 'ser' ? ', za ním ' : ' a vedle toho ')
    return n.t === 'ser' ? inner : `paralelně: (${inner})`
  }
  const src = c.ri > 0 ? `zdroj ${fmt(c.ue)} V s vnitřním odporem ${fmt(c.ri)} Ω` : `zdroj ${fmt(c.ue)} V`
  return `Schéma obvodu: ${src}; ${d(c.net)}.`
}
