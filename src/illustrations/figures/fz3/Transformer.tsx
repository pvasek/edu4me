import { useState } from 'react'
import { Draw, Eq, Fade, Figure, Head, Pop, Sym, Toggle, pat, useFig } from './kit'

const LABEL =
  'Transformátor. Na uzavřeném železném jádře jsou dvě cívky. Primární cívka s N₁ závity je připojená ke zdroji střídavého napětí U₁, sekundární cívka s N₂ závity napájí spotřebič napětím U₂. Střídavý proud v primární cívce vytváří v jádře proměnný magnetický tok, který indukuje napětí v sekundární cívce. Platí U₂ : U₁ = N₂ : N₁. Snižující transformátor: 1 000 závitů a 230 V na primáru, 50 závitů a 11,5 V na sekundáru. Zvyšující transformátor: 100 závitů a 230 V, 1 000 závitů a 2 300 V.'

type Mode = 'down' | 'up'
const DATA: Record<Mode, { n1: string; n2: string; u2: string; d1: number; d2: number; k: string }> = {
  down: {
    n1: '1 000',
    n2: '50',
    u2: '11,5 V',
    d1: 12,
    d2: 3,
    k: 'snižující: N₂ < N₁ → U₂ < U₁',
  },
  up: {
    n1: '100',
    n2: '1 000',
    u2: '2 300 V',
    d1: 4,
    d2: 12,
    k: 'zvyšující: N₂ > N₁ → U₂ > U₁',
  },
}

// core: outer 110–290 × 34–204, legs 40 wide
const X0 = 110
const X1 = 290
const Y0 = 34
const Y1 = 204
const T = 40

function Core() {
  const { id } = useFig()
  const d = `M${X0} ${Y0} H${X1} V${Y1} H${X0}Z M${X0 + T} ${Y0 + T} V${Y1 - T} H${X1 - T} V${Y0 + T}Z`
  return (
    <g>
      <path d={d} fillRule="evenodd" className="fz3-o fz3-iron" />
      <path d={d} fillRule="evenodd" fill={pat(id, 'h')} />
    </g>
  )
}

/** Front strands of a coil wound on the leg [x, x + T], `n` turns between y0 and y1. */
function Coil({ x, n, y0 = Y0 + 12, y1 = Y1 - 12, delay = 0 }: { x: number; n: number; y0?: number; y1?: number; delay?: number }) {
  const step = n > 1 ? (y1 - y0) / (n - 1) : 0
  const ys = Array.from({ length: n }, (_, i) => (n > 1 ? y0 + i * step : (y0 + y1) / 2))
  return (
    <g>
      {ys.map((y, i) => (
        <Draw
          key={i}
          d={`M${x - 7} ${y - 3} C${x + 8} ${y + 6} ${x + T - 8} ${y + 6} ${x + T + 7} ${y - 3}`}
          className="fz3-coil fz3-coil-band"
          delay={delay + i * 0.04}
        />
      ))}
    </g>
  )
}

export default function Transformer() {
  const [mode, setMode] = useState<Mode>('down')
  const m = DATA[mode]
  const c1 = (Y0 + Y1) / 2
  const s0 = m.d2 < 5 ? c1 - 30 : Y0 + 12
  const s1 = m.d2 < 5 ? c1 + 30 : Y1 - 12
  return (
    <Figure
      level={7}
      w={400}
      h={348}
      max={560}
      label={LABEL}
      controls={
        <Toggle
          label="Druh transformátoru"
          value={mode}
          onChange={setMode}
          options={[
            { id: 'down', text: 'snižující' },
            { id: 'up', text: 'zvyšující' },
          ]}
        />
      }
    >
      <Core />
      {/* alternating magnetic flux in the core */}
      <Draw d={`M${X0 + T / 2} ${c1} V${Y0 + T / 2} H${X1 - T / 2} V${Y1 - T / 2} H${X0 + T / 2}Z`} className="fz3-field fz3-flux" delay={0.3} />
      <Fade delay={1}>
        <Head x={200} y={Y0 + T / 2} deg={0} tone="blue" />
        <Head x={200} y={Y1 - T / 2} deg={180} tone="blue" />
        <text x={200} y={20} textAnchor="middle" className="fz3-lbl fz3-sm fz3-blue-t">
          proměnný magnetický tok v jádře
        </text>
        <Sym x={200} y={c1 + 8} t="Φ" tone="blue" />
      </Fade>
      <g key={mode}>
        <Coil x={X0} n={m.d1} />
        <Coil x={X1 - T} n={m.d2} delay={0.2} y0={s0} y1={s1} />
      </g>
      {/* primary: AC source */}
      <path d={`M${X0 - 7} ${Y0 + 9} H44 V${c1 - 18} M44 ${c1 + 18} V${Y1 - 9} H${X0 - 7}`} className="fz3-wire fz3-wire-thin" />
      <circle cx={44} cy={c1} r={18} className="fz3-o fz3-fill" />
      <path d={`M34 ${c1} C38 ${c1 - 9} 42 ${c1 - 9} 44 ${c1} S50 ${c1 + 9} 54 ${c1}`} className="fz3-o" />
      {/* secondary: a lamp */}
      <path d={`M${X1 + 7} ${s0 - 3} H356 V${c1 - 16} M356 ${c1 + 16} V${s1 - 3} H${X1 + 7}`} className="fz3-wire fz3-wire-thin" />
      <circle cx={356} cy={c1} r={16} className="fz3-o fz3-fill" />
      <path d={`M${356 - 11} ${c1 - 11} L${356 + 11} ${c1 + 11} M${356 + 11} ${c1 - 11} L${356 - 11} ${c1 + 11}`} className="fz3-o" />

      <Pop delay={0.5} key={`t${mode}`}>
        <text x={X0 + T / 2 - 20} y={230} textAnchor="middle" className="fz3-cap">
          primární cívka
        </text>
        <Eq x={X0 + T / 2 - 20} y={252} t={`N_{1} = ${m.n1}`} anchor="middle" className="fz3-eq-lg" />
        <Eq x={X0 + T / 2 - 20} y={274} t="U_{1} = 230 V" anchor="middle" className="fz3-eq-lg" />
        <text x={X1 - T / 2 + 20} y={230} textAnchor="middle" className="fz3-cap">
          sekundární cívka
        </text>
        <Eq x={X1 - T / 2 + 20} y={252} t={`N_{2} = ${m.n2}`} anchor="middle" className="fz3-eq-lg" />
        <Eq x={X1 - T / 2 + 20} y={274} t={`U_{2} = ${m.u2}`} anchor="middle" className="fz3-eq-lg" />
      </Pop>
      <rect x={60} y={290} width={280} height={52} rx={6} className="fz3-tag-lvl" />
      <text x={200} y={314} textAnchor="middle" className="fz3-eq fz3-eq-lg fz3-b-eq">
        U₂ : U₁ = N₂ : N₁
      </text>
      <text x={200} y={333} textAnchor="middle" className="fz3-lbl fz3-sm fz3-lvl-t">
        {m.k}
      </text>
    </Figure>
  )
}
