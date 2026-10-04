import { Angle, Arrow, Axes, Draw, Fade, Figure, Pop, Sym, pat, sine, useFig } from './kit'

const LABEL =
  'Mechanické kmitání. Vlevo pružinový oscilátor: těleso o hmotnosti m na pružině o tuhosti k kmitá kolem rovnovážné polohy s amplitudou y_m; perioda T = 2π·√(m/k). Vpravo matematické kyvadlo délky l, kyvadlo kmitá s malou výchylkou kolem svislé polohy; perioda T = 2π·√(l/g) nezávisí na hmotnosti. Dole graf výchylky y v závislosti na čase t: kosinusoida s amplitudou y_m a periodou T.'

const SX = 110 // spring axis
const TOP = 36 // ceiling
const EQ = 150 // mass top at equilibrium
const A = 30
const PV: [number, number] = [322, TOP] // pendulum pivot
const L = 156
const SWING = 20 // deg

function Ceiling({ x0, x1 }: { x0: number; x1: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x0} y={TOP - 10} width={x1 - x0} height={10} fill={pat(id, 'd')} />
      <path d={`M${x0} ${TOP} H${x1}`} className="fz3-o" />
    </g>
  )
}

function coil(y0: number, y1: number, turns = 9, w = 14) {
  const seg = (y1 - y0 - 16) / (turns * 2)
  let d = `M${SX} ${y0} V${y0 + 8}`
  for (let i = 0; i < turns * 2; i++) d += ` L${SX + (i % 2 ? -w : w)} ${y0 + 8 + seg * (i + 0.5)}`
  d += ` L${SX} ${y1 - 8} V${y1}`
  return d
}

function SpringSide() {
  return (
    <g>
      <Ceiling x0={50} x1={170} />
      {/* equilibrium and amplitude marks */}
      <path d={`M60 ${EQ + 14} H176`} className="fz3-o fz3-thin fz3-dash" />
      <path d={`M150 ${EQ + 14 - A} H176 M150 ${EQ + 14 + A} H176`} className="fz3-o fz3-thin" />
      <Arrow d={`M170 ${EQ + 14 - A + 3} V${EQ + 14 + A - 3}`} tone="ink" both />
      <Sym x={182} y={EQ + 4} t="y_{m}" anchor="start" />
      <Sym x={182} y={EQ + 38} t="y_{m}" anchor="start" />
      <g className="fz3-spring">
        <path d={coil(TOP, EQ)} className="fz3-o fz3-coilspring" />
      </g>
      <g className="fz3-mass">
        <rect x={SX - 20} y={EQ} width={40} height={28} rx={3} className="fz3-o fz3-massbox" />
        <Sym x={SX} y={EQ + 20} t="m" />
      </g>
      <Sym x={SX - 26} y={(TOP + EQ) / 2 + 6} t="k" anchor="end" />
      <text x={SX + 6} y={236} textAnchor="middle" className="fz3-lbl fz3-b">
        pružinový oscilátor
      </text>
      <Sym x={SX + 6} y={264} t="T = 2π √(m / k)" />
    </g>
  )
}

function PendulumSide() {
  const r = (SWING * Math.PI) / 180
  const ex = PV[0] + Math.sin(r) * L
  const ey = PV[1] + Math.cos(r) * L
  const wx = PV[0] - Math.sin(r) * L
  return (
    <g>
      <Ceiling x0={270} x1={374} />
      <path d={`M${PV[0]} ${PV[1]} V${PV[1] + L + 20}`} className="fz3-o fz3-thin fz3-dash" />
      <path d={`M${wx} ${ey} A${L} ${L} 0 0 0 ${ex} ${ey}`} className="fz3-o fz3-thin fz3-dot2" />
      <circle cx={ex} cy={ey} r={11} className="fz3-o fz3-ghost" />
      <circle cx={wx} cy={ey} r={11} className="fz3-o fz3-ghost" />
      <g className="fz3-swing">
        <path d={`M${PV[0]} ${PV[1]} V${PV[1] + L}`} className="fz3-string" />
        <circle cx={PV[0]} cy={PV[1] + L} r={12} className="fz3-o fz3-bob" />
      </g>
      <circle cx={PV[0]} cy={PV[1]} r={3} className="fz3-dot" />
      <Angle c={PV} a1={90} a2={90 - SWING} r={46} />
      <Sym x={PV[0] + 22} y={PV[1] + 66} t="φ" anchor="start" />
      <Sym x={PV[0] - 12} y={PV[1] + 96} t="l" anchor="end" />
      <text x={PV[0]} y={236} textAnchor="middle" className="fz3-lbl fz3-b">
        matematické kyvadlo
      </text>
      <Sym x={PV[0]} y={264} t="T = 2π √(l / g)" />
    </g>
  )
}

function Graph() {
  const ox = 44
  const oy = 360
  const T = 150
  const amp = 38
  return (
    <g>
      <Axes x={ox} y={oy} w={372} h={amp + 20} down={amp + 12} xl="t" yl="y" delay={0.3} />
      <Draw d={sine(ox, oy, 350, amp, T, Math.PI / 2)} className="fz3-curve fz3-curve-lvl" delay={0.6} />
      <Fade delay={1.3}>
        <path d={`M${ox - 4} ${oy - amp} H${ox + T}`} className="fz3-o fz3-thin fz3-dash" />
        <Sym x={ox - 8} y={oy - amp + 6} t="y_{m}" anchor="end" />
        <path
          d={`M${ox} ${oy - amp - 12} V${oy - amp - 4} M${ox} ${oy - amp - 8} H${ox + T} M${ox + T} ${oy - amp - 12} V${oy - amp - 4}`}
          className="fz3-o fz3-thin"
        />
        <Sym x={ox + T / 2} y={oy - amp - 14} t="T" />
      </Fade>
    </g>
  )
}

export default function SpringPendulum() {
  return (
    <Figure level={9} w={440} h={420} max={560} label={LABEL}>
      <Pop delay={0}>
        <SpringSide />
      </Pop>
      <Pop delay={0.15}>
        <PendulumSide />
      </Pop>
      <line x1={16} x2={424} y1={284} y2={284} className="fz3-o fz3-soft" />
      <Graph />
    </Figure>
  )
}
