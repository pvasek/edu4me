import type { ReactNode } from 'react'
import type { ForceArrow, ForceBody } from '../../core/types'
import {
  Draw,
  Fade,
  Label,
  Plate,
  czNum,
  f1,
  placeBox,
  say,
  textW,
  toneAt,
  url,
  useNarrow,
  usePlate,
  type Box,
} from './kit'

type Pt = [number, number]
type Surface = 'none' | 'ground' | 'incline' | 'water' | 'ceiling'
type Anchor = NonNullable<ForceArrow['from']>

interface BodyDef {
  name: string
  /** local bounding box [x0, y0, x1, y1] (y down) */
  bb: [number, number, number, number]
  anchors: Record<Anchor, Pt>
  /** waterline for floating (local y) */
  water: number
}

const A = (t: number, b: number, l: number, r: number, ly = 0): Record<Anchor, Pt> => ({
  center: [0, 0],
  top: [0, t],
  bottom: [0, b],
  left: [l, ly],
  right: [r, ly],
})

export const BODIES: Record<ForceBody, BodyDef> = {
  box: { name: 'kvádr', bb: [-30, -22, 30, 22], anchors: A(-22, 22, -30, 30), water: 0 },
  ball: { name: 'míč', bb: [-24, -24, 24, 24], anchors: A(-24, 24, -24, 24), water: 4 },
  car: { name: 'auto', bb: [-46, -22, 46, 22], anchors: A(-22, 22, -46, 46, 2), water: 6 },
  person: { name: 'člověk', bb: [-15, -38, 15, 40], anchors: A(-38, 40, -13, 13, -7), water: 12 },
  point: { name: 'hmotný bod', bb: [-5, -5, 5, 5], anchors: A(0, 0, 0, 0), water: 0 },
  plane: { name: 'letadlo', bb: [-56, -22, 56, 16], anchors: A(-8, 8, -55, 55, 1), water: 6 },
  boat: { name: 'loď', bb: [-46, -20, 46, 18], anchors: A(-20, 18, -46, 46, 4), water: 5 },
  skydiver: { name: 'parašutista', bb: [-37, -72, 37, 30], anchors: A(-70, 30, -36, 36, -42), water: 0 },
  lamp: { name: 'lampa', bb: [-23, -18, 23, 18], anchors: A(-18, 17, -22, 22), water: 0 },
  satellite: { name: 'družice', bb: [-57, -26, 57, 13], anchors: A(-12, 12, -56, 56), water: 0 },
}

function BodyArt({ body }: { body: ForceBody }) {
  const { id } = usePlate()
  const hatch = url(id, 'd')
  switch (body) {
    case 'box':
      return (
        <g>
          <rect x={-30} y={-22} width={60} height={44} className="ph-body ph-body-tint" />
          <rect x={16} y={-22} width={14} height={44} fill={hatch} />
          <rect x={-30} y={-22} width={60} height={44} className="ph-body" fill="none" />
        </g>
      )
    case 'ball':
      return (
        <g>
          <circle r={24} className="ph-body ph-body-tint" />
          <path d="M8 -22 A24 24 0 0 1 -22 10 A20 22 0 0 0 8 -22Z" fill={hatch} transform="rotate(180)" />
          <path d="M-14 -12 A16 16 0 0 1 -4 -18" className="ph-o ph-thin" />
          <circle r={24} className="ph-body" fill="none" />
        </g>
      )
    case 'car':
      return (
        <g>
          <path
            d="M-46 11 L-46 -1 Q-44 -8 -36 -9 L-23 -10 L-12 -22 H13 L25 -10 L39 -8 Q46 -6 46 2 L46 11 Z"
            className="ph-body ph-body-tint"
          />
          <path d="M-9 -19 H-1 V-11 H-18 Z M3 -19 H11 L20 -11 H3 Z" className="ph-body ph-glass" />
          <path d="M-44 4 H44" className="ph-o ph-thin" />
          {[-28, 28].map((x) => (
            <g key={x}>
              <circle cx={x} cy={13} r={9} className="ph-body ph-fill2" />
              <circle cx={x} cy={13} r={3} className="ph-body" />
            </g>
          ))}
        </g>
      )
    case 'person':
      return (
        <g className="ph-o" style={{ strokeWidth: 2.4 }}>
          <circle cy={-31} r={7} className="ph-body ph-body-tint" style={{ strokeWidth: 1.6 }} />
          <path d="M0 -24 V6 M-13 -6 L0 -17 L13 -6 M0 6 L-9 40 M0 6 L9 40" />
        </g>
      )
    case 'point':
      return <circle r={4.5} className="ph-ink-f" />
    case 'plane':
      return (
        <g>
          <path d="M-47 -6 L-54 -22 H-45 L-34 -7 Z" className="ph-body ph-body-tint" />
          <path
            d="M-55 2 Q-51 -8 -32 -8 H38 Q51 -8 55 -1 Q51 6 38 8 H-40 Q-52 8 -55 2 Z"
            className="ph-body ph-body-tint"
          />
          <path d="M-6 1 L-22 16 H-10 L12 2 Z" className="ph-body ph-fill2" />
          <path d="M38 -8 Q46 -7 49 -3 H40 Z" className="ph-body ph-glass" />
          {[-24, -14, -4, 6, 16, 26].map((x) => (
            <circle key={x} cx={x} cy={-2.5} r={1.6} className="ph-body ph-glass" />
          ))}
        </g>
      )
    case 'boat':
      return (
        <g>
          <path d="M-12 -6 V-20 H12 V-6" className="ph-body ph-paper" />
          <path d="M-7 -16 H-1 V-11 H-7 Z M2 -16 H8 V-11 H2 Z" className="ph-body ph-glass" />
          <path d="M-46 -6 H46 L34 18 H-34 Z" className="ph-body ph-body-tint" />
          <path d="M-40 1 H40" className="ph-o ph-thin" />
        </g>
      )
    case 'skydiver':
      return (
        <g>
          <path
            d="M-36 -42 Q-34 -72 0 -72 Q34 -72 36 -42 Q27 -47 18 -42 Q9 -47 0 -42 Q-9 -47 -18 -42 Q-27 -47 -36 -42 Z"
            className="ph-body ph-body-tint"
          />
          <path d="M-18 -42 Q-9 -66 0 -72 M18 -42 Q9 -66 0 -72" className="ph-o ph-thin" />
          <path d="M-36 -42 L-7 -12 M-18 -42 L-5 -12 M18 -42 L5 -12 M36 -42 L7 -12" className="ph-o ph-thin" />
          <g className="ph-o" style={{ strokeWidth: 2.4 }}>
            <path d="M0 -6 V13 M-7 -12 L0 -2 L7 -12 M0 13 L-6 30 M0 13 L6 30" />
          </g>
          <circle cy={-11} r={5} className="ph-body ph-body-tint" />
        </g>
      )
    case 'lamp':
      return (
        <g>
          <circle cy={9} r={8} className="ph-body ph-glass" />
          <path d="M-23 4 Q-20 -14 0 -18 Q20 -14 23 4 Z" className="ph-body ph-body-tint" />
          <path d="M-23 4 Q-20 -14 0 -18 Q20 -14 23 4 Z" fill={hatch} />
          <path d="M-23 4 Q-20 -14 0 -18 Q20 -14 23 4 Z" className="ph-body" fill="none" />
        </g>
      )
    case 'satellite':
      return (
        <g>
          <path d="M0 -12 V-20 M-7 -26 Q0 -18 7 -26" className="ph-o" />
          {[-1, 1].map((s) => (
            <g key={s}>
              <path d={`M${s * 12} 0 H${s * 16}`} className="ph-o" />
              <rect x={s > 0 ? 16 : -56} y={-7} width={40} height={14} className="ph-body ph-glass" />
              <path
                d={[10, 20, 30].map((k) => `M${s > 0 ? 16 + k : -56 + k} -7 V7`).join(' ') + ` M${s > 0 ? 16 : -56} 0 h40`}
                className="ph-o ph-thin"
              />
            </g>
          ))}
          <rect x={-12} y={-12} width={24} height={24} className="ph-body ph-body-tint" />
          <rect x={-12} y={-12} width={24} height={24} fill={hatch} />
        </g>
      )
  }
}

const rot = (p: Pt, deg: number): Pt => {
  const r = (-deg * Math.PI) / 180 // counter-clockwise on screen
  return [p[0] * Math.cos(r) - p[1] * Math.sin(r), p[0] * Math.sin(r) + p[1] * Math.cos(r)]
}
const dirOf = (deg: number): Pt => [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)]

export function directionWord(angle: number): string {
  const a = ((angle % 360) + 360) % 360
  const near = (v: number) => Math.abs(a - v) < 0.5
  if (near(0) || near(360)) return 'vodorovně vpravo'
  if (near(90)) return 'svisle vzhůru'
  if (near(180)) return 'vodorovně vlevo'
  if (near(270)) return 'svisle dolů'
  const q = a < 90 ? 'šikmo vpravo vzhůru' : a < 180 ? 'šikmo vlevo vzhůru' : a < 270 ? 'šikmo vlevo dolů' : 'šikmo vpravo dolů'
  return `${q} (${czNum(Math.round(a))}°)`
}

/** Vector sum of the forces (x right, y up), in the content's size units. */
export function resultantOf(forces: ForceArrow[]): { x: number; y: number; size: number; angle: number; balanced: boolean } {
  let x = 0
  let y = 0
  for (const f of forces) {
    x += f.size * Math.cos((f.angle * Math.PI) / 180)
    y += f.size * Math.sin((f.angle * Math.PI) / 180)
  }
  const size = Math.hypot(x, y)
  const total = forces.reduce((a, f) => a + f.size, 0)
  return { x, y, size, angle: (Math.atan2(y, x) * 180) / Math.PI, balanced: size <= total * 1e-3 }
}

export function forcesLabel(body: ForceBody, surface: Surface, angle: number | undefined, forces: ForceArrow[], resultant: boolean): string {
  const b = BODIES[body]
  const where =
    surface === 'ground'
      ? ' na vodorovné podložce'
      : surface === 'incline'
        ? ` na nakloněné rovině se sklonem ${czNum(angle ?? 0)}°`
        : surface === 'water'
          ? ' na vodní hladině'
          : surface === 'ceiling'
            ? ' zavěšený na laně ze stropu'
            : ''
  const fs = forces.map((f) => `${say(f.label)} ${directionWord(f.angle)}, velikost ${czNum(f.size)}`).join('; ')
  let s = `Silový diagram: ${b.name}${where}. Působící síly: ${fs}.`
  if (resultant) {
    const r = resultantOf(forces)
    s += r.balanced
      ? ' Síly jsou v rovnováze, výslednice je nulová.'
      : ` Výslednice F_v (čárkovaně) míří ${directionWord(Math.round(r.angle))}, velikost ${czNum(Math.round(r.size * 100) / 100)}.`
  }
  return s
}

interface Arrow {
  from: Pt
  to: Pt
  label: string
  tone: string
  res?: boolean
}

export function ForcesView({
  body = 'box',
  surface = 'none',
  angle,
  forces,
  resultant = false,
}: {
  body?: ForceBody
  surface?: Surface
  angle?: number
  forces: ForceArrow[]
  resultant?: boolean
}) {
  const nar = useNarrow()
  const def = BODIES[body]
  const tilt = surface === 'incline' ? Math.min(80, Math.max(1, angle ?? 20)) : 0
  const res = resultant ? resultantOf(forces) : null

  // ---- arrows (world: body centre at 0 0, y down)
  const maxSize = Math.max(...forces.map((f) => f.size), res && !res.balanced ? res.size : 0)
  const k = 96 / maxSize
  const anchor = (a: Anchor = 'center'): Pt => rot(def.anchors[a], tilt)
  const groups = new Map<string, number[]>()
  forces.forEach((f, i) => {
    const key = `${f.from ?? 'center'}:${Math.round((((f.angle % 360) + 360) % 360) * 2)}`
    groups.set(key, [...(groups.get(key) ?? []), i])
  })
  const arrows: Arrow[] = forces.map((f, i) => {
    const d = dirOf(f.angle)
    const key = `${f.from ?? 'center'}:${Math.round((((f.angle % 360) + 360) % 360) * 2)}`
    const g = groups.get(key)!
    const j = g.indexOf(i)
    const off = g.length > 1 ? (j - (g.length - 1) / 2) * 7 : 0
    const a0 = anchor(f.from)
    const from: Pt = [a0[0] - d[1] * off, a0[1] + d[0] * off]
    const L = Math.max(16, f.size * k)
    return { from, to: [from[0] + d[0] * L, from[1] + d[1] * L], label: f.label, tone: toneAt(i, f.tone) }
  })
  if (res && !res.balanced) {
    const origins = new Set(forces.map((f) => f.from ?? 'center'))
    const o = origins.size === 1 ? anchor(forces[0].from) : anchor('center')
    const L = Math.max(16, res.size * k)
    const d = dirOf(res.angle)
    arrows.push({ from: o, to: [o[0] + d[0] * L, o[1] + d[1] * L], label: 'F_{v}', tone: 'ink', res: true })
  }

  // ---- body box (world, rotated)
  const [bx0, by0, bx1, by1] = def.bb
  const corners = ([[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]] as Pt[]).map((p) => rot(p, tilt))
  const bodyBox: Box = {
    x: Math.min(...corners.map((c) => c[0])),
    y: Math.min(...corners.map((c) => c[1])),
    w: 0,
    h: 0,
  }
  bodyBox.w = Math.max(...corners.map((c) => c[0])) - bodyBox.x
  bodyBox.h = Math.max(...corners.map((c) => c[1])) - bodyBox.y

  // ---- surfaces
  const pts: Pt[] = [...corners]
  let incline: { B: Pt; T: Pt; C: Pt } | null = null
  const groundY = by1
  const ceilY = by0 - 46
  const waterY = def.water
  if (surface === 'incline') {
    const P = rot([0, by1], tilt)
    const u = dirOf(tilt)
    const L1 = 128
    const L2 = 92
    const B: Pt = [P[0] - u[0] * L1, P[1] - u[1] * L1]
    const T: Pt = [P[0] + u[0] * L2, P[1] + u[1] * L2]
    incline = { B, T, C: [T[0], B[1]] }
    pts.push(B, T, [T[0], B[1] + 6])
  }
  if (surface === 'ground') pts.push([-bx1 - 50, groundY + 12], [bx1 + 50, groundY])
  if (surface === 'water') pts.push([-bx1 - 50, waterY], [bx1 + 50, Math.max(by1 + 18, waterY + 44)])
  if (surface === 'ceiling') pts.push([-60, ceilY - 12], [60, ceilY])

  // ---- labels
  const taken: Box[] = [bodyBox]
  const segs = arrows.map((a) => [a.from, a.to] as [Pt, Pt])
  if (incline) segs.push([incline.B, incline.T])
  if (surface === 'ground') segs.push([[-400, groundY], [400, groundY]], [[-400, groundY + 8], [400, groundY + 8]])
  if (surface === 'water') segs.push([[-400, waterY], [400, waterY]])
  if (surface === 'ceiling') segs.push([[-400, ceilY], [400, ceilY]])
  const size = 17.5
  const placed = arrows.map((a) => {
    const w = textW(a.label, size) + 6
    const h = size + 2
    const d: Pt = [a.to[0] - a.from[0], a.to[1] - a.from[1]]
    const len = Math.hypot(d[0], d[1]) || 1
    const u: Pt = [d[0] / len, d[1] / len]
    const cands: Box[] = []
    for (const deg of [0, 50, -50, 90, -90, 130, -130]) {
      const r = rot(u, deg)
      const dist = 9 + Math.abs(r[0]) * (w / 2) + Math.abs(r[1]) * (h / 2)
      const cx = a.to[0] + r[0] * dist
      const cy = a.to[1] + r[1] * dist
      cands.push({ x: cx - w / 2, y: cy - h / 2, w, h })
    }
    // beside the middle of the shaft
    for (const s of [1, -1]) {
      const n: Pt = [-u[1] * s, u[0] * s]
      const cx = a.from[0] + d[0] * 0.62 + n[0] * (10 + Math.abs(n[0]) * (w / 2) + Math.abs(n[1]) * (h / 2))
      const cy = a.from[1] + d[1] * 0.62 + n[1] * (10 + Math.abs(n[0]) * (w / 2) + Math.abs(n[1]) * (h / 2))
      cands.push({ x: cx - w / 2, y: cy - h / 2, w, h })
    }
    return placeBox(cands, taken, segs)
  })
  let balanceBox: Box | null = null
  if (res?.balanced) {
    const w = 120
    const h = 30
    balanceBox = placeBox(
      [
        { x: bodyBox.x + bodyBox.w + 14, y: -h / 2 - 30, w, h },
        { x: bodyBox.x - 14 - w, y: -h / 2 - 30, w, h },
        { x: bodyBox.x + bodyBox.w + 14, y: 20, w, h },
        { x: bodyBox.x - 14 - w, y: 20, w, h },
      ],
      taken,
      segs,
    )
  }
  for (const a of arrows) pts.push(a.to, a.from)
  for (const b of taken) pts.push([b.x, b.y], [b.x + b.w, b.y + b.h])

  // ---- view box
  const pad = 14
  let x0 = Math.min(...pts.map((p) => p[0])) - pad
  let x1 = Math.max(...pts.map((p) => p[0])) + pad
  const y0 = Math.min(...pts.map((p) => p[1])) - pad
  const y1 = Math.max(...pts.map((p) => p[1])) + pad
  const minW = 280
  if (x1 - x0 < minW) {
    const e = (minW - (x1 - x0)) / 2
    x0 -= e
    x1 += e
  }
  const W = x1 - x0
  const H = y1 - y0

  let surfaceEl: ReactNode = null
  if (surface === 'ground')
    surfaceEl = <Ground x0={x0 + 4} x1={x1 - 4} y={groundY} />
  if (surface === 'ceiling')
    surfaceEl = (
      <g>
        <Ground x0={Math.max(x0 + 4, -90)} x1={Math.min(x1 - 4, 90)} y={ceilY} up />
        <path d={`M0 ${ceilY} V${def.anchors.top[1]}`} className="ph-o" />
      </g>
    )
  if (surface === 'incline' && incline) surfaceEl = <Incline {...incline} angle={tilt} />

  const waterTop = surface === 'water' ? <WaterBack x0={x0} x1={x1} y={waterY} y1={y1} /> : null
  const waterFront = surface === 'water' ? <WaterFront x0={x0} x1={x1} y={waterY} y1={y1} /> : null

  return (
    <Plate
      narrow={nar}
      vb={[x0, y0, W, H]}
      max={Math.min(560, W * 1.3)}
      label={forcesLabel(body, surface, tilt || undefined, forces, resultant)}
      className="ph-forces"
    >
      <Fade delay={0}>
        {waterTop}
        {surfaceEl}
        <g transform={tilt ? `rotate(${-tilt})` : undefined}>
          <BodyArt body={body} />
        </g>
        {waterFront}
      </Fade>
      {arrows.map((a, i) => (
        <g key={i} className={`ph-tone-${a.tone}`}>
          <Draw
            d={`M${f1(a.from[0])} ${f1(a.from[1])} L${f1(a.to[0])} ${f1(a.to[1])}`}
            className={`ph-vec ${a.res ? 'ph-vec-res' : ''}`}
            arrow={a.res ? 'ink' : (a.tone as 'a')}
            delay={0.3 + i * 0.16}
            dur={0.6}
          />
        </g>
      ))}
      <Fade delay={0.3}>
        {[...new Set(arrows.map((a) => `${f1(a.from[0])},${f1(a.from[1])}`))].map((k) => {
          const [x, y] = k.split(',')
          return <circle key={k} cx={x} cy={y} r={3.2} className="ph-anchor" />
        })}
      </Fade>
      {arrows.map((a, i) => {
        const b = placed[i]
        return (
          <Fade key={i} delay={0.6 + i * 0.16} className={`ph-tone-${a.tone}`}>
            <Label x={b.x + b.w / 2} y={b.y + b.h - 5} text={a.label} anchor="middle" className="ph-lbl-lg ph-lbl-t ph-halo" />
          </Fade>
        )
      })}
      {balanceBox && (
        <Fade delay={0.9}>
          <text x={f1(balanceBox.x + balanceBox.w / 2)} y={f1(balanceBox.y + 11)} textAnchor="middle" className="ph-balance ph-halo">
            rovnováha
          </text>
          <Label x={balanceBox.x + balanceBox.w / 2} y={balanceBox.y + 28} text="F_{v} = 0" anchor="middle" className="ph-lbl-sm ph-halo" />
        </Fade>
      )}
    </Plate>
  )
}

function Ground({ x0, x1, y, up = false }: { x0: number; x1: number; y: number; up?: boolean }) {
  const s = up ? -1 : 1
  let d = ''
  for (let x = x0 + 4; x < x1; x += 9) d += `M${f1(x)} ${f1(y)} l-7 ${10 * s}`
  return (
    <g>
      <path d={d} className="ph-o ph-thin" />
      <path d={`M${f1(x0)} ${f1(y)} H${f1(x1)}`} className="ph-o ph-thick" />
    </g>
  )
}

function Incline({ B, T, C, angle }: { B: Pt; T: Pt; C: Pt; angle: number }) {
  const { id } = usePlate()
  const r = 34
  const e = dirOf(angle)
  const mid = dirOf(angle / 2)
  const tri = `M${f1(B[0])} ${f1(B[1])} L${f1(T[0])} ${f1(T[1])} L${f1(C[0])} ${f1(C[1])} Z`
  return (
    <g>
      <path d={tri} className="ph-fill2" />
      <path d={tri} fill={url(id, 'd')} />
      <path d={tri} className="ph-o" />
      <path d={`M${f1(B[0] - 14)} ${f1(B[1])} H${f1(C[0] + 14)}`} className="ph-o ph-thick" />
      <path
        d={`M${f1(B[0] + r)} ${f1(B[1])} A${r} ${r} 0 0 0 ${f1(B[0] + e[0] * r)} ${f1(B[1] + e[1] * r)}`}
        className="ph-o ph-thin"
      />
      <text x={f1(B[0] + mid[0] * (r + 16))} y={f1(B[1] + mid[1] * (r + 16) + 5)} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
        {czNum(angle)}°
      </text>
    </g>
  )
}

function wavy(x0: number, x1: number, y: number) {
  let d = `M${f1(x0)} ${f1(y)}`
  for (let x = x0; x < x1; x += 16) d += ` q4 -3 8 0 t8 0`
  return d
}
function WaterBack({ x0, x1, y, y1 }: { x0: number; x1: number; y: number; y1: number }) {
  return <rect x={f1(x0)} y={f1(y)} width={f1(x1 - x0)} height={f1(y1 - y)} className="ph-water" />
}
function WaterFront({ x0, x1, y, y1 }: { x0: number; x1: number; y: number; y1: number }) {
  const { id } = usePlate()
  return (
    <g>
      <rect x={f1(x0)} y={f1(y)} width={f1(x1 - x0)} height={f1(y1 - y)} fill={url(id, 'h')} opacity={0.8} />
      <path d={wavy(x0, x1, y)} className="ph-o" style={{ stroke: 'var(--blue)' }} />
    </g>
  )
}
