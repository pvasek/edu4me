import type { ReactNode } from 'react'
import { Atom, Draw, F, Fade, Figure, headAt, Plate, Pop, useHatch, useNarrow } from './kit'

const LABEL =
  'Cyklus ATP a ADP. Hydrolýzou ATP (adenosintrifosfátu) vodou vzniká ADP a anorganický fosfát Pi a uvolní se asi 30 kJ/mol energie, kterou buňka využije k práci: ke stahu svalů, k aktivnímu transportu látek přes membrány a k syntéze nových látek. Opačně se z ADP a fosfátu znovu tvoří ATP; energii k tomu dodává potrava přes buněčné dýchání. Dole je náčrt molekuly ATP: adenin, ribosa a tři fosfátové skupiny P–P–P, mezi fosfáty dvě makroergní (energeticky bohaté) vazby, značené vlnovkou.'

export default function AtpCycle() {
  return (
    <Figure name="atp-cycle" level={9} label={LABEL} max={680}>
      <Scene />
    </Figure>
  )
}

const rad = (d: number) => (d * Math.PI) / 180

/** Clockwise arc on a circle from angle a to b (degrees) with an arrowhead at b. */
function ArcArrow({ cx, cy, r, a, b, delay, className = 'f89-lvstroke' }: { cx: number; cy: number; r: number; a: number; b: number; delay: number; className?: string }) {
  const p = (t: number) => [cx + r * Math.cos(rad(t)), cy + r * Math.sin(rad(t))]
  const [x1, y1] = p(a)
  const [x2, y2] = p(b)
  const large = (b - a + 360) % 360 > 180 ? 1 : 0
  const back = [x2 + Math.sin(rad(b)) * 10, y2 - Math.cos(rad(b)) * 10]
  return (
    <g>
      <Draw d={`M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`} className={className} delay={delay} dur={0.9} style={{ strokeWidth: 3 }} />
      <Fade delay={delay + 0.8} dur={0.2}>
        <polygon points={headAt(x2, y2, back[0], back[1], 13)} className="f89-lvfill" />
      </Fade>
    </g>
  )
}

function Node({ x, y, w, children, strong = false }: { x: number; y: number; w: number; children: ReactNode; strong?: boolean }) {
  const hatch = useHatch()
  return (
    <g>
      <rect x={x - w / 2} y={y - 21} width={w} height={42} rx={21} className={strong ? 'f89-soft' : 'f89-box'} style={{ strokeWidth: 1.6 }} />
      {strong && <rect x={x - w / 2} y={y - 21} width={w} height={42} rx={21} fill={hatch('lv')} className="f89-hatch" style={{ opacity: 0.5 }} />}
      {children}
    </g>
  )
}

/** Energy box: title + lines. */
function Box({ x, y, w, h, title, lines, tone }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; tone: 'out' | 'in' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} className="f89-box" style={{ strokeWidth: 1.2, fill: tone === 'out' ? 'color-mix(in srgb, var(--highlight) 30%, var(--surface))' : 'var(--surface)' }} />
      <text className="f89-lb f89-b" x={x + 12} y={y + 22}>
        {title}
      </text>
      {lines.map((t, i) => (
        <text key={t} className="f89-lb f89-sm" x={x + 12} y={y + 42 + i * 17}>
          {t}
        </text>
      ))}
    </g>
  )
}

/** Lightning bolt (energy). */
function Bolt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d={`M${x + 3 * s} ${y - 12 * s} L${x - 6 * s} ${y + 2 * s} H${x} L${x - 3 * s} ${y + 12 * s} L${x + 6 * s} ${y - 2 * s} H${x}Z`}
      fill="#f2c94c"
      stroke="#9a6d0c"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

function wave(x1: number, x2: number, y: number) {
  const n = 3
  const step = (x2 - x1) / n
  let d = `M${x1} ${y}`
  for (let i = 0; i < n; i++) d += ` q${step / 4} -6 ${step / 2} 0 t${step / 2} 0`
  return d
}

/** ATP sketch: adenine – ribose – P~P~P; (x, y) = adenine ring centre; `gap` = spacing of the parts. */
function AtpSketch({ x, y, gap, narrow }: { x: number; y: number; gap: number; narrow: boolean }) {
  const r = 15
  // adenine: hexagon (pointy top) fused with a pentagon on its right edge
  const hex = Array.from({ length: 6 }, (_, i) => [x + r * Math.cos(rad(30 + 60 * i)), y + r * Math.sin(rad(30 + 60 * i))])
  const s = r
  const R = s / (2 * Math.sin(rad(36)))
  const pc = [x + r * Math.cos(rad(30)) + s / (2 * Math.tan(rad(36))), y]
  const pent = [0, 72, 144, 216, 288].map((a) => [pc[0] + R * Math.cos(rad(a)), pc[1] + R * Math.sin(rad(a))])
  // ribose: pentagon, ring O at the top
  const rx = x + gap * 1.15
  const rr = 15
  const rib = [270, 342, 54, 126, 198].map((a) => [rx + rr * Math.cos(rad(a)), y + 2 + rr * Math.sin(rad(a))])
  const px = [rx + gap * 0.95, rx + gap * 1.65, rx + gap * 2.35]
  const pr = 12
  const pts = (a: number[][]) => a.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')
  return (
    <g>
      {/* backbone bonds */}
      <line className="f89-bond" x1={pent[0][0]} y1={pent[0][1]} x2={rib[4][0]} y2={rib[4][1]} />
      <line className="f89-bond" x1={rib[1][0]} y1={rib[1][1]} x2={px[0] - pr} y2={y} />
      <Draw d={wave(px[0] + pr, px[1] - pr, y)} className="f89-lvstroke" delay={2.4} dur={0.5} style={{ strokeWidth: 2.4 }} />
      <Draw d={wave(px[1] + pr, px[2] - pr, y)} className="f89-lvstroke" delay={2.6} dur={0.5} style={{ strokeWidth: 2.4 }} />
      <polygon points={pts(hex)} style={{ fill: 'var(--cat-nonmetal)', stroke: 'var(--edge)', strokeWidth: 1.4 }} />
      <polygon points={pts(pent)} style={{ fill: 'var(--cat-nonmetal)', stroke: 'var(--edge)', strokeWidth: 1.4 }} />
      <polygon points={pts(rib)} style={{ fill: 'var(--cat-transition)', stroke: 'var(--edge)', strokeWidth: 1.4 }} />
      <circle cx={rib[0][0]} cy={rib[0][1]} r={4.5} fill="#d9493b" stroke="var(--edge)" strokeWidth={1} />
      {px.map((p) => (
        <Atom key={p} x={p} y={y} el="P" r={pr} />
      ))}
      {/* names */}
      <text className="f89-lb f89-sm" x={x + 8} y={y + 38} textAnchor="middle">
        adenin
      </text>
      <text className="f89-lb f89-sm" x={rx} y={y + 38} textAnchor="middle">
        ribosa
      </text>
      <text className="f89-lb f89-sm" x={px[1]} y={y + 38} textAnchor="middle">
        {narrow ? '3 fosfáty' : '3 fosfátové skupiny'}
      </text>
      {/* high-energy bonds */}
      <path className="f89-ln" style={{ stroke: 'var(--lv)', strokeWidth: 1.4 }} d={`M${px[0] + 4} ${y - 22} v-6 H${px[2] - 4} v6`} />
      <text className="f89-lb f89-lv f89-b f89-sm" x={px[1]} y={y - 36} textAnchor="middle">
        makroergní vazby ~
      </text>
      {/* adenosine bracket */}
      <path className="f89-thin" d={`M${x - 14} ${y + 46} v5 H${rx + 14} v-5`} />
      <text className="f89-lb f89-sm f89-muted" x={(x + rx) / 2} y={y + 66} textAnchor="middle">
        adenosin
      </text>
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? {
        w: 340,
        h: 560,
        c: { x: 170, y: 184, r: 76 },
        out: { x: 20, y: 10, w: 300, h: 76 },
        inn: { x: 20, y: 290, w: 300, h: 60 },
        outPath: 'M170 104 C170 96 170 94 170 90',
        inPath: 'M170 286 C170 280 170 276 170 266',
        sketch: { x: 36, y: 468, gap: 70 },
      }
    : {
        w: 660,
        h: 450,
        c: { x: 196, y: 170, r: 104 },
        out: { x: 400, y: 26, w: 244, h: 110 },
        inn: { x: 400, y: 214, w: 244, h: 78 },
        outPath: 'M196 62 C200 26 330 60 394 70',
        inPath: 'M396 262 C330 290 240 300 200 280',
        sketch: { x: 110, y: 390, gap: 96 },
      }
  const { c } = L
  const nodeW = n ? 92 : 108
  const outHead = n ? [170, 90, 170, 100] : [394, 70, 360, 62]
  const inHead = n ? [170, 266, 170, 276] : [200, 280, 226, 292]
  return (
    <Plate w={L.w} h={L.h}>
      {/* the cycle */}
      <ArcArrow cx={c.x} cy={c.y} r={c.r} a={205} b={335} delay={0.5} />
      <ArcArrow cx={c.x} cy={c.y} r={c.r} a={25} b={155} delay={1.3} />
      <Pop delay={0.2}>
        <Node x={c.x - c.r} y={c.y} w={nodeW} strong>
          <text className="f89-sym" x={c.x - c.r} y={c.y + 7} textAnchor="middle" style={{ fontSize: 22 }}>
            ATP
          </text>
        </Node>
      </Pop>
      <Pop delay={0.9}>
        <Node x={c.x + c.r} y={c.y} w={nodeW}>
          <F x={c.x + c.r} y={c.y + 5} t="ADP + P_{i}" className="f89-f f89-b" size={n ? 14 : 15} />
        </Node>
      </Pop>
      <Fade delay={0.9}>
        <text className="f89-lb f89-b" x={c.x} y={c.y - 30} textAnchor="middle">
          hydrolýza
        </text>
        <F x={c.x} y={c.y - 12} t="+ H_{2}O" className="f89-f f89-sm f89-muted" />
        <text className="f89-lb f89-b" x={c.x} y={c.y + (n ? 36 : 26)} textAnchor="middle">
          syntéza ATP
        </text>
        <F x={c.x} y={c.y + (n ? 53 : 44)} t="– H_{2}O" className="f89-f f89-sm f89-muted" />
      </Fade>

      {/* energy out: work */}
      <Fade delay={1.1}>
        <Box {...L.out} tone="out" title={n ? 'energie se uvolní ≈ 30 kJ/mol' : 'energie se uvolní'} lines={n ? ['svaly · transport · syntéza látek', '→ práce buňky'] : ['≈ 30 kJ na 1 mol ATP', '• svaly – stah vláken', '• aktivní transport přes membránu', '• syntéza bílkovin a DNA']} />
      </Fade>
      <Draw d={L.outPath} className="f89-lvstroke" delay={1.2} dur={0.6} style={{ strokeWidth: 2.6 }} />
      <Fade delay={1.7} dur={0.2}>
        <polygon points={headAt(outHead[0], outHead[1], outHead[2], outHead[3], 12)} className="f89-lvfill" />
        <Bolt x={n ? 196 : 300} y={n ? 98 : 50} />
      </Fade>

      {/* energy in: food */}
      <Fade delay={1.9}>
        <Box {...L.inn} tone="in" title="energie z potravy" lines={n ? ['glukóza → buněčné dýchání'] : ['glukóza + O₂ → buněčné dýchání', 'v mitochondriích']} />
      </Fade>
      <Draw d={L.inPath} className="f89-lvstroke" delay={2.0} dur={0.6} style={{ strokeWidth: 2.6 }} />
      <Fade delay={2.5} dur={0.2}>
        <polygon points={headAt(inHead[0], inHead[1], inHead[2], inHead[3], 12)} className="f89-lvfill" />
      </Fade>

      {/* ATP structure */}
      <Fade delay={2.2}>
        <line className="f89-thin" x1={n ? 12 : 20} y1={n ? 380 : 324} x2={n ? 328 : 640} y2={n ? 380 : 324} style={{ opacity: 0.4 }} />
        <text className="f89-lb f89-b" x={n ? 20 : 24} y={n ? 404 : 350}>
          molekula ATP
        </text>
      </Fade>
      <Pop delay={2.3}>
        <AtpSketch {...L.sketch} narrow={n} />
      </Pop>
    </Plate>
  )
}
