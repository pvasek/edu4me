import type { CSSProperties } from 'react'
import { Arrow, Hatches, Svg, hatch, useSvgId, type DiagramProps } from './util'

/** Deterministic pseudo-random numbers so server and client render the same. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 120
const H = 100
const R = 9.5
const SOLID = { x: 14, y: 252 }
const LIQUID = { x: 266, y: 252 }
const GAS = { x: 140, y: 38 }

function Box({ x, y, title, titleBelow = true }: { x: number; y: number; title: string; titleBelow?: boolean }) {
  return (
    <>
      <rect className="dg-rule" x={x - 4} y={y - 4} width={W + 8} height={H + 8} rx={13} />
      <rect className="dg-box" x={x} y={y} width={W} height={H} rx={10} />
      <text className="dg-t dg-strong" x={x + W / 2} y={titleBelow ? y + H + 22 : y - 10} textAnchor="middle">
        {title}
      </text>
    </>
  )
}

function Solid() {
  const r = rng(3)
  const out = []
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 5; col++)
      out.push(
        <circle
          key={`${row}-${col}`}
          className="dg-particle dg-vib"
          cx={SOLID.x + 18.5 + col * 20.8}
          cy={SOLID.y + 18 + row * 21.3}
          r={R}
          style={{ animationDuration: `${0.28 + r() * 0.25}s`, animationDelay: `${-r()}s` } as CSSProperties}
        />,
      )
  return <g>{out}</g>
}

function Liquid({ hid }: { hid: string }) {
  const r = rng(11)
  const out = []
  const rows = [
    { y: 88, n: 5, off: 0 },
    { y: 68, n: 5, off: 9 },
    { y: 48, n: 4, off: 4 },
  ]
  for (const [ri, row] of rows.entries())
    for (let i = 0; i < row.n; i++) {
      const cx = LIQUID.x + 14 + row.off + i * 22 + (r() - 0.5) * 5
      const cy = LIQUID.y + row.y + (r() - 0.5) * 5
      out.push(
        <circle
          key={`${ri}-${i}`}
          className="dg-particle dg-slide"
          cx={cx}
          cy={cy}
          r={R}
          style={
            {
              '--dx': `${(r() - 0.5) * 12}px`,
              '--dy': `${(r() - 0.5) * 5}px`,
              animationDuration: `${1.8 + r() * 1.6}s`,
              animationDelay: `${-r() * 3}s`,
            } as CSSProperties
          }
        />,
      )
    }
  return (
    <g>
      <path
        className="dg-liquid-bg"
        d={`M${LIQUID.x + 2} ${LIQUID.y + 34} q15 -5 29 0 t29 0 t29 0 t29 0 V${LIQUID.y + H - 2} H${LIQUID.x + 2} Z`}
      />
      <path
        className="dg-hatch"
        fill={hatch(hid, 'h')}
        d={`M${LIQUID.x + 2} ${LIQUID.y + 34} q15 -5 29 0 t29 0 t29 0 t29 0 V${LIQUID.y + H - 2} H${LIQUID.x + 2} Z`}
      />
      {out}
    </g>
  )
}

function Gas() {
  const r = rng(29)
  const pt = () => ({ x: GAS.x + 14 + r() * (W - 28), y: GAS.y + 14 + r() * (H - 28) })
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const p0 = pt()
        const ws = [pt(), pt(), pt()]
        const style: Record<string, string> = {
          animationDuration: `${2.6 + r() * 1.6}s`,
          animationDelay: `${-r() * 3}s`,
        }
        ws.forEach((w, k) => {
          style[`--x${k + 1}`] = `${(w.x - p0.x).toFixed(1)}px`
          style[`--y${k + 1}`] = `${(w.y - p0.y).toFixed(1)}px`
        })
        return <circle key={i} className="dg-particle dg-fly" cx={p0.x} cy={p0.y} r={R} style={style as CSSProperties} />
      })}
    </g>
  )
}

/** Two opposite arrows between panel centres a → b, clipped to the gap. */
function Pair({
  a,
  b,
  t0,
  t1,
  side = 1,
}: {
  a: { x: number; y: number }
  b: { x: number; y: number }
  t0: number
  t1: number
  side?: number
}) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const nx = -dy / len
  const ny = dx / len
  const o = 8 * side
  const P = (t: number, s: number) => ({ x: a.x + dx * t + nx * o * s, y: a.y + dy * t + ny * o * s })
  const f0 = P(t0, 1)
  const f1 = P(t1, 1)
  const g0 = P(t1, -1)
  const g1 = P(t0, -1)
  return (
    <>
      <Arrow x1={f0.x} y1={f0.y} x2={f1.x} y2={f1.y} className="dg-arrow dg-heat" />
      <Arrow x1={g0.x} y1={g0.y} x2={g1.x} y2={g1.y} className="dg-arrow dg-cool" />
    </>
  )
}

export default function States(_: DiagramProps) {
  const hid = useSvgId()
  const cS = { x: SOLID.x + W / 2, y: SOLID.y + H / 2 }
  const cL = { x: LIQUID.x + W / 2, y: LIQUID.y + H / 2 }
  const cG = { x: GAS.x + W / 2, y: GAS.y + H / 2 }
  return (
    <div className="dg dg-states">
      <Svg
        w={400}
        h={394}
        max={480}
        label="Tři skupenství: v pevné látce částice kmitají na místě v mřížce, v kapalině jsou blízko sebe a kloužou po sobě, v plynu volně létají. Přeměny: tání a tuhnutí, vypařování a kapalnění, sublimace a desublimace."
      >
        <Hatches id={hid} />
        {/* legend */}
        <Arrow x1={138} y1={362} x2={164} y2={362} className="dg-arrow dg-heat" head={8} />
        <text className="dg-t dg-small" x={170} y={366}>
          teplo dodáváme
        </text>
        <Arrow x1={138} y1={382} x2={164} y2={382} className="dg-arrow dg-cool" head={8} />
        <text className="dg-t dg-small" x={170} y={386}>
          teplo odebíráme
        </text>

        <Box {...GAS} title="plyn" titleBelow={false} />
        <Box {...SOLID} title="pevná látka" />
        <Box {...LIQUID} title="kapalina" />
        <Solid />
        <Liquid hid={hid} />
        <Gas />

        {/* solid ↔ liquid */}
        <Arrow x1={144} y1={288} x2={256} y2={288} className="dg-arrow dg-heat" />
        <text className="dg-note dg-heat-t" x={200} y={279} textAnchor="middle">
          tání
        </text>
        <Arrow x1={256} y1={318} x2={144} y2={318} className="dg-arrow dg-cool" />
        <text className="dg-note dg-cool-t" x={200} y={340} textAnchor="middle">
          tuhnutí
        </text>

        {/* liquid ↔ gas */}
        <Pair a={cL} b={cG} t0={0.3} t1={0.72} />
        <text className="dg-note dg-heat-t" x={284} y={182}>
          vypařování
        </text>
        <text className="dg-note dg-cool-t" x={284} y={202}>
          kapalnění
        </text>

        {/* solid ↔ gas */}
        <Pair a={cS} b={cG} t0={0.3} t1={0.72} side={-1} />
        <text className="dg-note dg-heat-t" x={116} y={182} textAnchor="end">
          sublimace
        </text>
        <text className="dg-note dg-cool-t" x={116} y={202} textAnchor="end">
          desublimace
        </text>
      </Svg>
    </div>
  )
}
