import { DrawArrow, Fade, Figure, Lbl, Num, Pop, Travel, pat, useFig } from './kit'

const HOT = '#d9493b'

/** Wavy arrow (radiation) from a to b with `n` waves. */
export function wave(a: [number, number], b: [number, number], n = 3.5, amp = 5) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l = Math.hypot(dx, dy)
  const ux = dx / l
  const uy = dy / l
  const steps = Math.round(n * 12)
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const s = i / steps
    const off = Math.sin(s * n * 2 * Math.PI) * amp * Math.min(1, (1 - s) * 5)
    const x = a[0] + dx * s - uy * off
    const y = a[1] + dy * s + ux * off
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `
  }
  return d
}

/** One convection cell: warm water rises in the middle, cool water sinks at the wall. */
function Cell({ s, delay }: { s: 1 | -1; delay: number }) {
  const cx = 190
  const x = (v: number) => cx + s * v
  const up = `M${x(9)} 262 V200`
  const top = `M${x(13)} 192 H${x(48)}`
  const down = `M${x(56)} 200 V254`
  const back = `M${x(50)} 264 H${x(16)}`
  const loop = `M${x(9)} 262 V198 Q${x(9)} 192 ${x(15)} 192 H${x(50)} Q${x(56)} 192 ${x(56)} 198 V256 Q${x(56)} 264 ${x(48)} 264 H${x(15)} Q${x(9)} 264 ${x(9)} 258Z`
  return (
    <g>
      <DrawArrow d={up} tone="red" delay={delay} />
      <DrawArrow d={top} tone="red" delay={delay + 0.2} />
      <DrawArrow d={down} tone="blue" delay={delay + 0.4} />
      <DrawArrow d={back} tone="blue" delay={delay + 0.6} />
      {[0, 0.5].map((ph) => (
        <Travel key={ph} path={loop} dur={5} phase={ph} rest={[x(9), 230 - ph * 40]}>
          <circle r={3} className="fz2-dropdot" />
        </Travel>
      ))}
    </g>
  )
}

/** Spoon handle coloured hot → warm → cool along its length (conduction). */
function Spoon() {
  const { id } = useFig()
  const a: [number, number] = [205, 270]
  const b: [number, number] = [293, 70]
  const cols = [HOT, '#e0703a', '#e8a23a', '#d9c07a', '#b9bec7']
  const n = cols.length
  return (
    <g>
      <ellipse cx={a[0] - 4} cy={a[1] + 4} rx={11} ry={7} transform={`rotate(-66 ${a[0] - 4} ${a[1] + 4})`} fill={HOT} className="fz2-o" />
      <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} className="fz2-o" style={{ strokeWidth: 8.5 }} />
      {cols.map((c, i) => {
        const p = (k: number) => [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
        const [x1, y1] = p(i)
        const [x2, y2] = p(i + 1)
        return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} style={{ stroke: c, strokeWidth: 5.5 }} strokeLinecap="butt" />
      })}
      <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={pat(id, 'hi')} strokeWidth={3} opacity={0.5} />
    </g>
  )
}

export default function HeatTransfer() {
  return (
    <Figure
      level={4}
      w={400}
      h={352}
      max={560}
      label="Tři způsoby šíření tepla v jedné kuchyňské scéně. Vedení: lžička ponořená v horké vodě se ohřívá, teplo postupuje kovem od ponořeného konce až k rukojeti. Proudění: voda ohřátá u dna stoupá uprostřed hrnce vzhůru, u stěn se ochlazuje a klesá dolů, takže v hrnci krouží. Záření: rozpálená plotýnka sálá teplo do okolí i bez přímého dotyku."
    >
      <Scene />
    </Figure>
  )
}

function Scene() {
  const { id } = useFig()
  return (
    <g>
      {/* stove */}
      <Pop delay={0}>
        <rect x={20} y={292} width={360} height={22} rx={3} className="fz2-o fz2-fill2" />
        <rect x={20} y={292} width={360} height={22} rx={3} fill={pat(id, 'd')} />
        <path d="M34 314 V340 M366 314 V340" className="fz2-o" />
        <rect x={88} y={283} width={204} height={9} rx={2} fill={HOT} className="fz2-o fz2-glow" />
        <path d="M96 287.5 H284" className="fz2-o fz2-thin" style={{ stroke: '#f6c08a' }} />
      </Pop>

      {/* pot with water */}
      <Pop delay={0.1}>
        <path d="M119 180 H261 V279 H119Z" className="fz2-water" />
        <path d="M119 180 H261 V279 H119Z" fill={pat(id, 'h')} opacity={0.5} />
        <path d="M114 150 V283 H266 V150" className="fz2-o fz2-thick" fill="none" />
        <path d="M119 150 V279 H261 V150" className="fz2-o fz2-thin" />
        <path d="M108 150 H119 M261 150 H272" className="fz2-o fz2-thick" />
        <path d="M114 164 H100 Q94 164 94 170 Q94 176 100 176 H114" className="fz2-o fz2-fill" />
        <path d="M119 180 Q135 176 150 180 T180 180 T210 180 T240 180 T261 180" className="fz2-o fz2-thin" />
      </Pop>

      <Cell s={-1} delay={0.35} />
      <Cell s={1} delay={0.45} />
      <Pop delay={0.2}>
        <Spoon />
      </Pop>

      {/* conduction arrows along the handle */}
      <DrawArrow d="M280 134 L296 98" tone="red" delay={0.9} />

      {/* radiation from the exposed hob */}
      <DrawArrow d={wave([96, 280], [44, 238])} tone="red" delay={1.0} />
      <DrawArrow d={wave([286, 280], [346, 240])} tone="red" delay={1.1} />

      <Fade delay={1.2}>
        <Num x={32} y={22} n={2} />
        <text x={48} y={27} className="fz2-lbl fz2-b fz2-big">
          proudění
        </text>
        <text x={22} y={50} className="fz2-lbl fz2-sm">
          teplá voda stoupá,
        </text>
        <text x={22} y={69} className="fz2-lbl fz2-sm">
          studená klesá
        </text>
        <line x1={96} y1={76} x2={150} y2={188} className="fz2-lead" />
        <circle cx={150} cy={190} r={2} className="fz2-dot" />

        <Num x={378} y={22} n={1} />
        <text x={362} y={27} textAnchor="end" className="fz2-lbl fz2-b fz2-big">
          vedení
        </text>
        <text x={388} y={50} textAnchor="end" className="fz2-lbl fz2-sm">
          lžička se ohřívá
        </text>
        <text x={388} y={69} textAnchor="end" className="fz2-lbl fz2-sm">
          až k rukojeti
        </text>

        <Num x={32} y={194} n={3} />
        <text x={48} y={199} className="fz2-lbl fz2-b fz2-big">
          záření
        </text>
        <text x={22} y={220} className="fz2-lbl fz2-sm">
          sálá teplo
        </text>
        <Lbl x={200} y={342} anchor="middle" className="fz2-sm">
          rozpálená plotýnka
        </Lbl>
      </Fade>
    </g>
  )
}
