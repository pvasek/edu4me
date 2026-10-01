import { Angle, Draw, Fade, Figure, Head, Pop, f1, pat, useFig } from './kit'

const LABEL =
  'Roční období. Země obíhá kolem Slunce proti směru hodinových ručiček při pohledu od severu. Její osa je skloněná o 23,5° a míří stále stejným směrem, k Polárce. Kolem 21. června je severní polokoule přikloněná ke Slunci (letní slunovrat), kolem 21. prosince odkloněná (zimní slunovrat); 20. března a 22. září svítí Slunce na obě polokoule stejně (jarní a podzimní rovnodennost). Dole: v létě dopadají paprsky strměji, stejný svazek světla ohřívá menší plochu, a proto je tepleji; v zimě dopadají šikmo a energie se rozloží na větší plochu.'

const CX = 230
const CY = 150
const RX = 165
const E = Math.asin(62 / RX) // viewing elevation
const RY = RX * Math.sin(E)
const R = 19
const TILT = (23.5 * Math.PI) / 180

/** Orbit point at θ (deg): 0 = right, 90 = front (towards the viewer). 3D: X right, Y up, Z to the viewer. */
function orbit(th: number) {
  const a = (th * Math.PI) / 180
  const X = RX * Math.cos(a)
  const Z = RX * Math.sin(a)
  return { X, Z, x: CX + X, y: CY + Z * Math.sin(E) }
}

function Earth({ th }: { th: number }) {
  const { id } = useFig()
  const o = orbit(th)
  const len = Math.hypot(o.X, o.Z)
  const d = [-o.X / len, 0, -o.Z / len] // towards the Sun
  const k = d[2] * Math.cos(E) // component towards the viewer
  const ux = d[0]
  const uy = d[2] * Math.sin(E) // screen y of the Sun direction (down positive)
  const psi = (Math.atan2(uy, ux) * 180) / Math.PI
  const a = Math.abs(k) * R
  const dark =
    k >= 0 ? `M0 ${-R} A${R} ${R} 0 0 0 0 ${R} A${f1(a)} ${R} 0 0 1 0 ${-R}Z` : `M0 ${-R} A${R} ${R} 0 0 0 0 ${R} A${f1(a)} ${R} 0 0 0 0 ${-R}Z`
  // the axis: fixed in space, tilted towards −X
  const ax = -Math.sin(TILT)
  const ay = -Math.cos(TILT) * Math.cos(E)
  const L = R * 1.55
  return (
    <g transform={`translate(${f1(o.x)} ${f1(o.y)})`}>
      <circle r={R} className="fz3-earth" />
      <path d="M-9 -8 q5 -6 11 -2 q4 5 -3 9 q-6 3 -8 -7Z M4 6 q6 -2 8 4 q-4 6 -8 0Z" className="fz3-land" />
      <g transform={`rotate(${f1(psi)})`}>
        <path d={dark} className="fz3-night" />
        <path d={dark} fill={pat(id, 'dd')} opacity={0.5} />
      </g>
      <circle r={R} className="fz3-o" />
      <path d={`M${f1(-ax * L)} ${f1(-ay * L)} L${f1(ax * L)} ${f1(ay * L)}`} className="fz3-o fz3-earth-axis" />
      <circle cx={f1(ax * L)} cy={f1(ay * L)} r={2.6} className="fz3-lvl-f" />
    </g>
  )
}

function Beam({ x, y, deg, label, note }: { x: number; y: number; deg: number; label: string; note: string }) {
  const { id } = useFig()
  // a beam of width w coming down at `deg` above the horizon, hitting the ground (y) around x
  const w = 30
  const a = (deg * Math.PI) / 180
  const spread = w / Math.sin(a) // length of the lit ground
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  const L = 84
  const g0 = x - spread / 2
  const g1 = x + spread / 2
  const top0: [number, number] = [g0 - dx * L, y - dy * L]
  const top1: [number, number] = [g1 - dx * L, y - dy * L]
  const beam = `M${f1(top0[0])} ${f1(top0[1])} L${f1(g0)} ${y} L${f1(g1)} ${y} L${f1(top1[0])} ${f1(top1[1])}Z`
  return (
    <g>
      <path d={beam} className="fz3-beam" />
      {[0.2, 0.5, 0.8].map((f) => {
        const sx = top0[0] + (top1[0] - top0[0]) * f
        const sy = top0[1] + (top1[1] - top0[1]) * f
        return (
          <path
            key={f}
            d={`M${f1(sx)} ${f1(sy)} l${f1(dx * (L - 10))} ${f1(dy * (L - 10))}`}
            className="fz3-arr fz3-arr-acc"
            markerEnd={`url(#${id}-ah-acc)`}
          />
        )
      })}
      <path d={`M${x - 96} ${y} H${x + 96}`} className="fz3-o" />
      <path d={`M${x - 96} ${y} H${x + 96} V${y + 8} H${x - 96}Z`} fill={pat(id, 'd')} />
      <path d={`M${f1(g0)} ${y + 1} H${f1(g1)}`} className="fz3-lit" />
      <text x={x} y={y + 30} textAnchor="middle" className="fz3-lbl fz3-b">
        {label}
      </text>
      <text x={x} y={y + 49} textAnchor="middle" className="fz3-lbl fz3-sm">
        {note}
      </text>
    </g>
  )
}

const POS = [
  {
    th: 0,
    date: '21. června',
    name: 'letní slunovrat',
    anchor: 'end' as const,
    lx: 452,
    ly: 196,
  },
  {
    th: 90,
    date: '20. března',
    name: 'jarní rovnodennost',
    anchor: 'middle' as const,
    lx: CX,
    ly: 254,
  },
  {
    th: 180,
    date: '21. prosince',
    name: 'zimní slunovrat',
    anchor: 'start' as const,
    lx: 8,
    ly: 196,
  },
  {
    th: 270,
    date: '22. září',
    name: 'podzimní rovnodennost',
    anchor: 'middle' as const,
    lx: CX,
    ly: 30,
  },
]

export default function Seasons() {
  const orbitD = `M${CX - RX} ${CY} A${RX} ${f1(RY)} 0 1 0 ${CX + RX} ${CY} A${RX} ${f1(RY)} 0 1 0 ${CX - RX} ${CY}`
  // orbit direction: anticlockwise seen from the north = to the right at the front
  const dirAt = (th: number) => {
    const p = orbit(th)
    const a = (th * Math.PI) / 180
    return {
      x: p.x,
      y: p.y,
      deg: (Math.atan2(-RY * Math.cos(a), RX * Math.sin(a)) * 180) / Math.PI,
    }
  }
  return (
    <Figure level={7} w={460} h={452} max={580} label={LABEL}>
      <Draw d={orbitD} className="fz3-orbit fz3-orbit-strong" delay={0} />
      <Fade delay={0.9}>
        {[45, 225, 135, 315].map((th) => {
          const h = dirAt(th)
          return <Head key={th} x={h.x} y={h.y} deg={h.deg} tone="muted" s={1.2} />
        })}
      </Fade>
      {/* the Sun */}
      <circle cx={CX} cy={CY} r={40} className="fz3-sun-halo" />
      <circle cx={CX} cy={CY} r={27} className="fz3-sun" />
      <text x={CX} y={CY + 6} textAnchor="middle" className="fz3-lbl fz3-b fz3-on-sun">
        Slunce
      </text>
      {POS.map((p, i) => (
        <g key={p.th}>
          <Pop delay={0.2 + i * 0.12}>
            <Earth th={p.th} />
          </Pop>
          <Fade delay={0.5 + i * 0.12}>
            <text x={p.lx} y={p.ly} textAnchor={p.anchor} className="fz3-lbl fz3-b">
              {p.date}
            </text>
            <text x={p.lx} y={p.ly + 19} textAnchor={p.anchor} className="fz3-lbl fz3-sm fz3-lvl-t">
              {p.name}
            </text>
          </Fade>
        </g>
      ))}
      {/* tilt marked at the June Earth */}
      <Fade delay={1}>
        <path d={`M${CX + RX} ${CY} V${CY - 38}`} className="fz3-o fz3-thin fz3-dash" />
        <Angle c={[CX + RX, CY]} a1={-115} a2={-90} r={34} text="23,5°" tr={50} />
        <text x={452} y={274} textAnchor="end" className="fz3-lbl fz3-sm fz3-muted-t">
          osa → Polárka
        </text>
      </Fade>

      <line x1={16} x2={444} y1={290} y2={290} className="fz3-o fz3-soft" />
      <text x={CX} y={314} textAnchor="middle" className="fz3-cap">
        proč je v létě tepleji
      </text>
      <Fade delay={0.6}>
        <Beam x={118} y={392} deg={62} label="léto: Slunce vysoko" note="světlo na menší ploše" />
        <Beam x={342} y={392} deg={22} label="zima: Slunce nízko" note="světlo na větší ploše" />
      </Fade>
    </Figure>
  )
}
