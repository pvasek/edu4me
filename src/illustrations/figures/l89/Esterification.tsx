import type { CSSProperties } from 'react'
import { Arrow, Draw, F, Fade, Figure, Mol, Plate, Pop, Slide, useNarrow } from './kit'

const LABEL =
  'Esterifikace: kyselina octová a ethanol reagují za katalýzy koncentrovanou kyselinou sírovou na ethyl-ethanoát (ethylacetát) a vodu. Reakce je vratná. Kyselina odštěpí celou skupinu OH, alkohol jen vodík ze své skupiny OH, a z nich vznikne molekula vody. Ester je těkavý a voní ovocně.'

type P = { x: number; y: number }

function Acid({ x, y, hl }: P & { hl: boolean }) {
  return (
    <Mol
      atoms={[
        ['C', x, y + 10],
        ['C', x + 28, y - 6],
        ['O', x + 28, y - 36],
        ['O', x + 54, y + 10],
        ['H', x + 72, y + 10],
      ]}
      bonds={[
        [0, 1],
        [1, 2, 2],
        [1, 3],
        [3, 4],
      ]}
      highlight={(i) => (hl && (i === 3 || i === 4) ? 'f89-glow' : undefined)}
    />
  )
}
function Ethanol({ x, y, hl }: P & { hl: boolean }) {
  return (
    <Mol
      atoms={[
        ['H', x, y + 10],
        ['O', x + 18, y + 10],
        ['C', x + 44, y - 6],
        ['C', x + 72, y + 10],
      ]}
      bonds={[
        [0, 1],
        [1, 2],
        [2, 3],
      ]}
      highlight={(i) => (hl && i === 0 ? 'f89-glow' : undefined)}
    />
  )
}
function Ester({ x, y }: P) {
  return (
    <Mol
      atoms={[
        ['C', x, y + 10],
        ['C', x + 28, y - 6],
        ['O', x + 28, y - 36],
        ['O', x + 54, y + 10],
        ['C', x + 80, y - 6],
        ['C', x + 108, y + 10],
      ]}
      bonds={[
        [0, 1],
        [1, 2, 2],
        [1, 3],
        [3, 4],
        [4, 5],
      ]}
    />
  )
}
function Water({ x, y }: P) {
  return <Mol atoms={[['O', x, y, { h: [145, 35] }]]} bonds={[]} highlight={() => 'f89-glow'} />
}

function Names({ x, y, name, f }: P & { name: string; f: string }) {
  return (
    <>
      <text className="f89-lb f89-b" x={x} y={y} textAnchor="middle">
        {name}
      </text>
      <F x={x} y={y + 17} t={f} className="f89-f f89-sm" />
    </>
  )
}

/** Small flask with the ester and scent wisps. */
function Vignette({ x, y }: P) {
  return (
    <g>
      <path className="f89-glass" d={`M${x - 5} ${y - 30} V${y - 16} L${x - 20} ${y + 8} Q${x - 22} ${y + 14} ${x - 15} ${y + 14} H${x + 15} Q${x + 22} ${y + 14} ${x + 20} ${y + 8} L${x + 5} ${y - 16} V${y - 30}`} />
      <path d={`M${x - 14} ${y + 1} H${x + 14} L${x + 19} ${y + 9} Q${x + 20} ${y + 13} ${x + 14} ${y + 13} H${x - 14} Q${x - 20} ${y + 13} ${x - 19} ${y + 9}Z`} fill="#f1d67a" opacity={0.85} />
      {[-8, 0, 8].map((dx, i) => (
        <path
          key={dx}
          className="f89-rise f89-lvstroke"
          style={{ strokeWidth: 1.4, '--rise': '-16px', '--del': `${i * 0.8}s`, '--dur': '2.6s' } as CSSProperties}
          d={`M${x + dx} ${y - 34} q4 -5 0 -10 q-4 -5 0 -10`}
        />
      ))}
      {/* pear */}
      <g transform={`translate(${x + 38} ${y - 2})`}>
        <path d="M0 -16 C6 -16 6 -8 8 -3 C12 6 9 14 0 14 C-9 14 -12 6 -8 -3 C-6 -8 -6 -16 0 -16Z" fill="#b9c96a" stroke="var(--edge)" strokeWidth={1.1} />
        <path d="M0 -16 Q1 -21 3 -23" className="f89-thin" />
        <path d="M2 -20 Q8 -24 11 -19 Q6 -17 2 -20Z" fill="#6f9a4f" stroke="var(--edge)" strokeWidth={0.8} />
      </g>
      <text className="f89-lb f89-lv" x={x + 56} y={y + 4}>
        ovocná vůně
      </text>
    </g>
  )
}

export default function Esterification() {
  return (
    <Figure name="esterification" level={8} label={LABEL} max={700}>
      <Scene />
    </Figure>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? { w: 340, h: 470, acid: { x: 26, y: 92 }, plus1: { x: 128, y: 100 }, eth: { x: 152, y: 92 }, arr: [170, 170, 170, 226], cat: { x: 184, y: 196 }, ester: { x: 26, y: 300 }, plus2: { x: 176, y: 308 }, water: { x: 234, y: 304 }, vig: { x: 60, y: 420 } }
    : { w: 660, h: 260, acid: { x: 22, y: 128 }, plus1: { x: 124, y: 136 }, eth: { x: 146, y: 128 }, arr: [252, 132, 322, 132], cat: { x: 287, y: 116 }, ester: { x: 352, y: 128 }, plus2: { x: 492, y: 136 }, water: { x: 548, y: 132 }, vig: { x: 390, y: 48 } }
  const ring = { x: (L.acid.x + 64 + L.eth.x) / 2, y: L.acid.y + 10 }
  const [ax1, ay1, ax2, ay2] = L.arr
  const vertical = ax1 === ax2
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.2}>
        <Acid {...L.acid} hl />
        <Names x={L.acid.x + 36} y={L.acid.y + 50} name="kyselina octová" f="CH_{3}COOH" />
      </Pop>
      <Fade delay={0.3}>
        <text className="f89-sym" x={L.plus1.x} y={L.plus1.y} textAnchor="middle">
          +
        </text>
      </Fade>
      <Pop delay={0.45}>
        <Ethanol {...L.eth} hl />
        <Names x={L.eth.x + 40} y={L.eth.y + 50} name="ethanol" f="CH_{3}CH_{2}OH" />
      </Pop>
      {/* the atoms that leave as water */}
      <Draw
        d={`M${ring.x - 44} ${ring.y} C${ring.x - 44} ${ring.y - 22} ${ring.x + 44} ${ring.y - 22} ${ring.x + 44} ${ring.y} C${ring.x + 44} ${ring.y + 22} ${ring.x - 44} ${ring.y + 22} ${ring.x - 44} ${ring.y}Z`}
        className="f89-ring"
        delay={1.0}
        dur={0.8}
      />
      <Fade delay={1.2}>
        <text className="f89-lb f89-lv f89-sm" x={ring.x} y={ring.y - 22} textAnchor="middle">
          OH + H
        </text>
      </Fade>
      <Fade delay={1.5}>
        {vertical ? (
          <>
            <Arrow x1={ax1 - 5} y1={ay1} x2={ax2 - 5} y2={ay2} />
            <Arrow x1={ax1 + 5} y1={ay2} x2={ax2 + 5} y2={ay1} />
          </>
        ) : (
          <>
            <Arrow x1={ax1} y1={ay1 - 5} x2={ax2} y2={ay2 - 5} />
            <Arrow x1={ax2} y1={ay1 + 5} x2={ax1} y2={ay2 + 5} />
          </>
        )}
        <text className="f89-f f89-sm f89-lv f89-b" x={L.cat.x} y={L.cat.y} textAnchor={vertical ? 'start' : 'middle'}>
          konc. H₂SO₄
        </text>
        <text className="f89-lb f89-sm" x={L.cat.x} y={vertical ? L.cat.y + 18 : ay1 + 28} textAnchor={vertical ? 'start' : 'middle'}>
          vratná reakce
        </text>
      </Fade>
      <Pop delay={2.0}>
        <Ester {...L.ester} />
        <Names x={L.ester.x + 54} y={L.ester.y + 50} name="ethyl-ethanoát" f="CH_{3}COOCH_{2}CH_{3}" />
      </Pop>
      <Fade delay={2.1}>
        <text className="f89-sym" x={L.plus2.x} y={L.plus2.y} textAnchor="middle">
          +
        </text>
      </Fade>
      <Slide delay={2.2} dx={ring.x - L.water.x} dy={ring.y - L.water.y} dur={0.9}>
        <Water {...L.water} />
      </Slide>
      <Fade delay={2.9}>
        <Names x={L.water.x} y={L.water.y + 46} name="voda" f="H_{2}O" />
      </Fade>
      <Fade delay={3.1}>
        <Vignette {...L.vig} />
      </Fade>
    </Plate>
  )
}
