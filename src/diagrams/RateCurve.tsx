import { Arrow, DrawPath, FadeIn, Svg, type DiagramProps } from './util'

const PL = 40
const PR = 344
const PT = 18
const PB = 222
const TMAX = 10
const K = 0.35
const T1 = 2.5

const X = (t: number) => PL + (t / TMAX) * (PR - PL)
const Y = (c: number) => PB - c * (PB - PT - 10)

function curve(f: (t: number) => number) {
  const pts: string[] = []
  for (let t = 0; t <= TMAX + 1e-9; t += 0.1) pts.push(`${pts.length ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(f(t)).toFixed(1)}`)
  return pts.join(' ')
}

function Plot() {
  const c1 = Math.exp(-K * T1)
  const slope = -K * c1
  const at = (t: number) => c1 + slope * (t - T1)
  const a = T1 - 1.3
  const b = T1 + 1.3
  return (
    <Svg
      w={360}
      h={262}
      max={430}
      label="Graf koncentrace v čase: koncentrace reaktantu klesá, koncentrace produktu roste, obě se postupně zpomalují. Tečna ke křivce reaktantu ukazuje okamžitou rychlost reakce v = −Δc/Δt."
    >
      <Arrow x1={PL} y1={PB} x2={PL} y2={PT - 8} className="dg-arrow dg-axis" head={8} />
      <Arrow x1={PL} y1={PB} x2={PR + 10} y2={PB} className="dg-arrow dg-axis" head={8} />
      <text className="dg-t dg-strong" x={PL - 8} y={PT} textAnchor="end">
        c
      </text>
      <text className="dg-t dg-strong" x={PR + 8} y={PB + 20} textAnchor="end">
        t
      </text>
      <text className="dg-mono dg-tick" x={PL - 7} y={PB + 4} textAnchor="end">
        0
      </text>

      <DrawPath d={curve((t) => Math.exp(-K * t))} className="dg-curve dg-curve-a" />
      <DrawPath d={curve((t) => 1 - Math.exp(-K * t))} className="dg-curve dg-curve-b" delay={0.2} />
      <text className="dg-note dg-accent-t" x={X(7.2)} y={Y(0.08) - 10}>
        reaktant
      </text>
      <text className="dg-note dg-blue-t" x={X(7.2)} y={Y(0.92) + 24}>
        produkt
      </text>

      <FadeIn delay={1.2}>
        <line className="dg-tangent" x1={X(T1 - 2.1)} y1={Y(at(T1 - 2.1))} x2={X(T1 + 2.3)} y2={Y(at(T1 + 2.3))} />
        <path className="dg-guide dg-guide-solid" d={`M${X(a)} ${Y(at(a))} H${X(b)} V${Y(at(b))}`} />
        <circle className="dg-point" cx={X(T1)} cy={Y(c1)} r={4.5} />
        <text className="dg-t dg-small dg-strong" x={(X(a) + X(b)) / 2} y={Y(at(a)) - 6} textAnchor="middle">
          Δt
        </text>
        <text className="dg-t dg-small dg-strong" x={X(b) + 5} y={(Y(at(a)) + Y(at(b))) / 2 + 4}>
          Δc
        </text>
        <text className="dg-t dg-strong" x={X(5.3)} y={Y(0.56)}>
          v = −Δc / Δt
        </text>
        <text className="dg-note" x={X(5.3)} y={Y(0.56) + 20}>
          rychlost = sklon tečny
        </text>
        <text className="dg-t dg-small dg-muted" x={X(5.3)} y={Y(0.56) + 38}>
          reakce se zpomaluje
        </text>
      </FadeIn>
    </Svg>
  )
}

function Particle({ cx, cy, cls }: { cx: number; cy: number; cls: string }) {
  return <circle className={`dg-ball ${cls}`} cx={cx} cy={cy} r={11} />
}

function Collisions() {
  return (
    <Svg
      w={200}
      h={262}
      max={220}
      className="dg-collide"
      label="Srážková teorie: při účinné srážce mají částice dost energie a správnou orientaci, vznikne produkt. Při neúčinné srážce se částice jen odrazí."
    >
      <text className="dg-note dg-strong-note" x={100} y={22} textAnchor="middle">
        srážková teorie
      </text>
      {/* effective: they meet and stay bonded */}
      <text className="dg-t dg-small dg-strong" x={100} y={52} textAnchor="middle">
        účinná srážka
      </text>
      <g className="dg-hit-a">
        <Particle cx={89} cy={84} cls="dg-ball-a" />
      </g>
      <g className="dg-hit-b">
        <Particle cx={111} cy={84} cls="dg-ball-b" />
      </g>
      <path className="dg-spark" d="M100 62 l3 8 8 -3 -5 7 7 5 -8 1 1 8 -6 -6 -6 6 1 -8 -8 -1 7 -5 -5 -7 8 3 Z" />
      <text className="dg-note" x={100} y={120} textAnchor="middle">
        → vznikne produkt
      </text>

      {/* ineffective: they bounce off */}
      <text className="dg-t dg-small dg-strong" x={100} y={154} textAnchor="middle">
        neúčinná srážka
      </text>
      <g className="dg-miss-a">
        <Particle cx={44} cy={186} cls="dg-ball-a" />
      </g>
      <g className="dg-miss-b">
        <Particle cx={156} cy={186} cls="dg-ball-b" />
      </g>
      <Arrow x1={70} y1={186} x2={60} y2={186} className="dg-arrow dg-arrow-thin" head={7} />
      <Arrow x1={130} y1={186} x2={140} y2={186} className="dg-arrow dg-arrow-thin" head={7} />
      <text className="dg-note" x={100} y={222} textAnchor="middle">
        → jen se odrazí
      </text>
      <text className="dg-t dg-tiny dg-muted" x={100} y={250} textAnchor="middle">
        chybí energie nebo orientace
      </text>
    </Svg>
  )
}

export default function RateCurve(_: DiagramProps) {
  return (
    <div className="dg dg-rate">
      <Plot />
      <Collisions />
    </div>
  )
}
