import type { ReactNode } from 'react'
import { AngleArc, Atom, Bond, ChemText, Fade, Figure, LonePair, Pop, T, type BondKind } from './kit'

type Pt = [number, number]
interface Arm {
  el: string
  ang: number
  len: number
  r: number
  kind: BondKind
}
interface Shape {
  name: string
  formula: string
  regions: string
  center: { el: string; r: number; at: Pt }
  arms: Arm[]
  lone?: { ang: number; back?: boolean }[]
  arc: { a1: number; a2: number; r: number; label: string; at: Pt }
}

const pol = (c: Pt, ang: number, len: number): Pt => [c[0] + Math.cos((ang * Math.PI) / 180) * len, c[1] + Math.sin((ang * Math.PI) / 180) * len]

const SHAPES: Shape[] = [
  {
    name: 'lineární',
    formula: 'CO_{2}',
    regions: '2 vazebné oblasti',
    center: { el: 'C', r: 15, at: [80, 104] },
    arms: [
      { el: 'O', ang: 180, len: 47, r: 14, kind: 'double' },
      { el: 'O', ang: 0, len: 47, r: 14, kind: 'double' },
    ],
    arc: { a1: 180, a2: 360, r: 25, label: '180°', at: [80, 70] },
  },
  {
    name: 'trojúhelníková',
    formula: 'BF_{3}',
    regions: '3 oblasti, rovinná',
    center: { el: 'B', r: 14, at: [80, 100] },
    arms: [
      { el: 'F', ang: -90, len: 44, r: 13, kind: 'single' },
      { el: 'F', ang: 150, len: 44, r: 13, kind: 'single' },
      { el: 'F', ang: 30, len: 44, r: 13, kind: 'single' },
    ],
    arc: { a1: 30, a2: 150, r: 21, label: '120°', at: [80, 143] },
  },
  {
    name: 'tetraedr',
    formula: 'CH_{4}',
    regions: '4 oblasti',
    center: { el: 'C', r: 15, at: [84, 102] },
    arms: [
      { el: 'H', ang: -90, len: 44, r: 10, kind: 'single' },
      { el: 'H', ang: 160.5, len: 44, r: 10, kind: 'single' },
      { el: 'H', ang: 28, len: 42, r: 11, kind: 'wedge' },
      { el: 'H', ang: 78, len: 40, r: 8.5, kind: 'dash' },
    ],
    arc: { a1: 160.5, a2: 270, r: 22, label: '109,5°', at: [40, 74] },
  },
  {
    name: 'trigonální pyramida',
    formula: 'NH_{3}',
    regions: '3 vazby + 1 volný pár',
    center: { el: 'N', r: 15, at: [80, 96] },
    arms: [
      { el: 'H', ang: 152, len: 43, r: 10, kind: 'single' },
      { el: 'H', ang: 28, len: 42, r: 11, kind: 'wedge' },
      { el: 'H', ang: 90, len: 40, r: 8.5, kind: 'dash' },
    ],
    lone: [{ ang: -90 }],
    arc: { a1: 28, a2: 90, r: 24, label: '107°', at: [118, 144] },
  },
  {
    name: 'lomená',
    formula: 'H_{2}O',
    regions: '2 vazby + 2 volné páry',
    center: { el: 'O', r: 15, at: [80, 94] },
    arms: [
      { el: 'H', ang: 142.25, len: 42, r: 10, kind: 'single' },
      { el: 'H', ang: 37.75, len: 42, r: 10, kind: 'single' },
    ],
    lone: [{ ang: -128 }, { ang: -52, back: true }],
    arc: { a1: 37.75, a2: 142.25, r: 20, label: '104,5°', at: [80, 138] },
  },
]

function Cell({ s, x, y, i }: { s: Shape; x: number; y: number; i: number }) {
  const c = s.center.at
  const d = 0.15 + i * 0.18
  // back bonds first, then the centre, then front bonds
  const order = [...s.arms].sort((a, b) => rank(a.kind) - rank(b.kind))
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={80} y={26} className="f35-title">
        {s.name}
      </T>
      <Pop d={d}>
        {s.lone?.map((l, k) => <LonePair key={k} x={c[0]} y={c[1]} ang={l.ang} len={38} back={l.back} />)}
        {order
          .filter((a) => a.kind === 'dash')
          .map((a, k) => (
            <Arm key={`d${k}`} c={c} a={a} rc={s.center.r} />
          ))}
        {order
          .filter((a) => a.kind !== 'dash' && a.kind !== 'wedge')
          .map((a, k) => (
            <Arm key={`s${k}`} c={c} a={a} rc={s.center.r} />
          ))}
        <Atom x={c[0]} y={c[1]} r={s.center.r} el={s.center.el} />
        {order
          .filter((a) => a.kind === 'wedge')
          .map((a, k) => (
            <Arm key={`w${k}`} c={c} a={a} rc={s.center.r} />
          ))}
      </Pop>
      <AngleArc x={c[0]} y={c[1]} r={s.arc.r} a1={s.arc.a1} a2={s.arc.a2} delay={d + 0.45} />
      <Fade d={d + 0.8}>
        <T x={s.arc.at[0]} y={s.arc.at[1]} className="f35-mono f35-b f35-lvt">
          {s.arc.label}
        </T>
      </Fade>
      <T x={80} y={176} className="f35-t f35-b" size={16}>
        <ChemText text={s.formula} />
      </T>
      <T x={80} y={194} className="f35-t f35-small f35-muted f35-sec">
        {s.regions}
      </T>
    </g>
  )
}

const rank = (k: BondKind) => (k === 'dash' ? 0 : k === 'wedge' ? 2 : 1)

function Arm({ c, a, rc }: { c: Pt; a: Arm; rc: number }) {
  const p = pol(c, a.ang, a.len)
  const atom = <Atom x={p[0]} y={p[1]} r={a.r} el={a.el} sym={a.r >= 8} />
  const bond = <Bond a={c} b={p} ra={rc} rb={a.r} kind={a.kind} w={a.kind === 'double' ? 3.6 : 4.2} />
  // an atom behind the plane is drawn before its bond; in front, after
  return a.kind === 'dash' ? (
    <g>
      {atom}
      {bond}
    </g>
  ) : (
    <g>
      {bond}
      {atom}
    </g>
  )
}

function Legend({ x, y }: { x: number; y: number }) {
  const row = (k: number, sample: ReactNode, text: string) => (
    <g transform={`translate(0 ${48 + k * 34})`}>
      {sample}
      <text x={46} y={5} className="f35-note" style={{ fontSize: 15 }}>
        {text}
      </text>
    </g>
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={80} y={26} className="f35-title" style={{ fill: 'var(--ink-soft)' }}>
        klíč
      </T>
      <Fade d={0.3}>
        {row(0, <Bond a={[6, 0]} b={[38, 0]} kind="single" w={4.2} />, 'vazba v rovině')}
        {row(1, <Bond a={[6, 0]} b={[38, 0]} kind="wedge" w={4.2} />, 'před rovinou')}
        {row(2, <Bond a={[6, 0]} b={[38, 0]} kind="dash" w={4.2} />, 'za rovinou')}
        {row(3, <LonePair x={8} y={0} ang={0} len={30} />, 'volný pár')}
      </Fade>
      <text x={80} y={194} textAnchor="middle" className="f35-t f35-small f35-muted f35-sec">
        oblasti se odpuzují
      </text>
    </g>
  )
}

function Grid({ cols }: { cols: number }) {
  const cells = SHAPES.length + 1
  const rows = Math.ceil(cells / cols)
  const lines: ReactNode[] = []
  for (let c = 1; c < cols; c++) lines.push(<line key={`c${c}`} className="f35-rule" x1={c * 160} x2={c * 160} y1={8} y2={rows * 206 - 8} />)
  for (let r = 1; r < rows; r++) lines.push(<line key={`r${r}`} className="f35-rule" x1={8} x2={cols * 160 - 8} y1={r * 206} y2={r * 206} />)
  return (
    <>
      {lines}
      {SHAPES.map((s, i) => (
        <Cell key={s.name} s={s} i={i} x={(i % cols) * 160} y={Math.floor(i / cols) * 206} />
      ))}
      <Legend x={(SHAPES.length % cols) * 160} y={Math.floor(SHAPES.length / cols) * 206} />
    </>
  )
}

export default function VseprShapes() {
  return (
    <Figure
      level={3}
      label="Tvary molekul podle teorie VSEPR: lineární CO2 se 180°, trojúhelníková BF3 se 120°, tetraedr CH4 se 109,5°, trigonální pyramida NH3 se 107° a jedním volným párem, lomená H2O se 104,5° a dvěma volnými páry. Klínová vazba míří před rovinu nákresu, čárkovaná za ni."
      layouts={[
        { w: 480, h: 412, max: 620, when: 'wide', draw: () => <Grid cols={3} /> },
        { w: 320, h: 618, max: 420, when: 'narrow', draw: () => <Grid cols={2} /> },
      ]}
    />
  )
}
