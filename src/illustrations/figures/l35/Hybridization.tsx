import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Arrow, Atom, ChemText, Fade, Figure, Pop, T, pat, usePid, vDraw } from './kit'

type Orb = 's' | 'p' | 'h'

const rad = (d: number) => (d * Math.PI) / 180

/** Teardrop lobe along +x from the origin, length L, half-width W. */
const drop = (L: number, W: number) => `M0 0 C${L * 0.22} ${-W} ${L} ${-W * 1.15} ${L} 0 C${L} ${W * 1.15} ${L * 0.22} ${W} 0 0Z`

/** A lobe shape at (x, y) pointing along `ang` (screen degrees), optionally foreshortened. */
function Lobe({ x, y, ang, L, W, kind, back = false, sy = 1 }: { x: number; y: number; ang: number; L: number; W: number; kind: Orb; back?: boolean; sy?: number }) {
  const p = usePid()
  const d = drop(L, W)
  const t = `translate(${x} ${y}) scale(1 ${sy}) rotate(${ang})`
  return (
    <g transform={t} className={back ? 'f35-hy-back' : undefined}>
      <path d={d} className={`f35-hy-${kind}`} />
      <path d={d} fill={pat(p, 'd')} opacity={0.55} />
      <path d={d} className="f35-hy-edge" />
    </g>
  )
}

/** Hybrid orbital: a big lobe and a small back lobe. */
function Hyb({ x, y, ang, L = 50, W = 15, back = false, sy = 1 }: { x: number; y: number; ang: number; L?: number; W?: number; back?: boolean; sy?: number }) {
  return (
    <g>
      <Lobe x={x} y={y} ang={ang + 180} L={L * 0.26} W={W * 0.5} kind="h" back={back} sy={sy} />
      <Lobe x={x} y={y} ang={ang} L={L} W={W} kind="h" back={back} sy={sy} />
    </g>
  )
}

/** p orbital: two equal lobes (dumbbell) along `ang`. */
function P({ x, y, ang, L = 34, W = 11, faint = false, sy = 1 }: { x: number; y: number; ang: number; L?: number; W?: number; faint?: boolean; sy?: number }) {
  return (
    <g className={faint ? 'f35-hy-rest' : undefined}>
      <Lobe x={x} y={y} ang={ang} L={L} W={W} kind="p" sy={sy} />
      <Lobe x={x} y={y} ang={ang + 180} L={L} W={W} kind="p" sy={sy} />
    </g>
  )
}

/** Small orbital icon for the "recipe" row. */
function Icon({ x, y, k, faint = false }: { x: number; y: number; k: 's' | 'p' | 'h'; faint?: boolean }) {
  if (k === 's')
    return (
      <g>
        <circle cx={x} cy={y} r={8} className="f35-hy-s" />
        <circle cx={x} cy={y} r={8} className="f35-hy-edge" />
      </g>
    )
  if (k === 'p') return <P x={x} y={y} ang={-90} L={12} W={5.5} faint={faint} />
  return <Hyb x={x} y={y + 5} ang={-90} L={17} W={6} />
}

interface Kind {
  name: string
  n: number
  rest: number
  angle: string
  shape: string
  formula: string
  molecule: string
}
const KINDS: Kind[] = [
  { name: 'sp^{3}', n: 3, rest: 0, angle: '109,5°', shape: 'tetraedr', formula: 'CH_{4}', molecule: 'methan' },
  { name: 'sp^{2}', n: 2, rest: 1, angle: '120°', shape: 'trojúhelník', formula: 'C_{2}H_{4}', molecule: 'ethen' },
  { name: 'sp', n: 1, rest: 2, angle: '180°', shape: 'lineární', formula: 'C_{2}H_{2}', molecule: 'ethyn' },
]

/** s + p (+ p …) → mixing arrow → hybrid orbitals; (cx, y) = top centre, 150 wide. */
function Recipe({ k, cx, y, d }: { k: Kind; cx: number; y: number; d: number }) {
  const items: ReactNode[] = []
  const step = 32
  const count = 1 + k.n
  const restW = k.rest ? k.rest * 20 + 14 : 0
  const x0 = cx - ((count - 1) * step + restW) / 2
  items.push(<Icon key="s" x={x0} y={y + 14} k="s" />)
  for (let i = 0; i < k.n; i++) {
    items.push(
      <text key={`plus${i}`} x={x0 + step * i + step / 2} y={y + 19} textAnchor="middle" className="f35-t f35-muted">
        +
      </text>,
    )
    items.push(<Icon key={`p${i}`} x={x0 + step * (i + 1)} y={y + 14} k="p" />)
  }
  const rx = x0 + (count - 1) * step + 22
  for (let i = 0; i < k.rest; i++) items.push(<Icon key={`r${i}`} x={rx + i * 20} y={y + 14} k="p" faint />)
  const hyb = count
  const hx0 = cx - ((hyb - 1) * 17 + restW) / 2
  return (
    <g>
      <Pop d={d}>
        {items}
        {k.rest > 0 && <line x1={rx - 11} x2={rx - 11} y1={y} y2={y + 28} className="f35-rule" />}
      </Pop>
      <Arrow x1={cx} y1={y + 36} x2={cx} y2={y + 62} className="f35-arrow-lv" head={7} delay={d + 0.15} />
      <Fade d={d + 0.2}>
        <T x={cx + 8} y={y + 54} anchor="start" className="f35-note" size={14}>
          mísení
        </T>
      </Fade>
      <Pop d={d + 0.35}>
        {Array.from({ length: hyb }, (_, i) => (
          <Icon key={i} x={hx0 + i * 17} y={y + 84} k="h" />
        ))}
        {Array.from({ length: k.rest }, (_, i) => (
          <Icon key={`r${i}`} x={hx0 + (hyb - 1) * 17 + 22 + i * 20} y={y + 84} k="p" faint />
        ))}
      </Pop>
      <Fade d={d + 0.45}>
        <T x={cx} y={y + 118} className="f35-t f35-small f35-muted">
          <ChemText text={`${hyb} × ${k.name}${k.rest ? ` + ${k.rest} p` : ''}`} />
        </T>
      </Fade>
    </g>
  )
}

function Arc({ d, delay }: { d: string; delay: number }) {
  return <motion.path d={d} className="f35-arc" variants={vDraw} custom={delay} />
}

/** Resulting geometry around the carbon at (cx, cy). */
function Geometry({ i, cx, cy, d }: { i: number; cx: number; cy: number; d: number }) {
  const L = 50
  if (i === 0) {
    // tetrahedron: up, lower left, front right, back
    const a1 = 160.5
    return (
      <g>
        <Pop d={d}>
          <Hyb x={cx} y={cy} ang={78} L={L * 0.8} back />
          <Hyb x={cx} y={cy} ang={-90} L={L} />
          <Hyb x={cx} y={cy} ang={a1} L={L} />
          <Atom x={cx} y={cy} r={7} el="C" sym={false} />
          <Hyb x={cx} y={cy} ang={28} L={L * 0.92} W={16} />
        </Pop>
        <Arc d={`M${cx + 30 * Math.cos(rad(a1))} ${cy + 30 * Math.sin(rad(a1))} A30 30 0 0 1 ${cx} ${cy - 30}`} delay={d + 0.25} />
        <Fade d={d + 0.4}>
          <T x={cx - 40} y={cy - 32} className="f35-mono f35-b f35-lvt" size={13}>
            109,5°
          </T>
        </Fade>
      </g>
    )
  }
  if (i === 1) {
    // trigonal plane seen at an angle, the leftover p orbital stands upright
    const sy = 0.42
    const pt = (a: number, r: number) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a)) * sy] as const
    const A = pt(90, 30)
    const B = pt(210, 30)
    return (
      <g>
        <Fade d={d}>
          <ellipse cx={cx} cy={cy} rx={62} ry={62 * sy} className="f35-hy-plane" />
        </Fade>
        <Pop d={d}>
          <P x={cx} y={cy} ang={-90} L={36} W={11} faint />
          <Hyb x={cx} y={cy} ang={-30} L={L} sy={sy} W={17} />
          <Hyb x={cx} y={cy} ang={210} L={L} sy={sy} W={17} />
          <Atom x={cx} y={cy} r={7} el="C" sym={false} />
          <Hyb x={cx} y={cy} ang={90} L={L} sy={sy} W={17} />
        </Pop>
        <Arc d={`M${B[0]} ${B[1]} A30 ${30 * sy} 0 0 0 ${A[0]} ${A[1]}`} delay={d + 0.25} />
        <Fade d={d + 0.4}>
          <T x={cx - 44} y={cy + 30} className="f35-mono f35-b f35-lvt" size={13}>
            120°
          </T>
        </Fade>
      </g>
    )
  }
  // linear: two hybrids on one axis, two p orbitals at right angles
  return (
    <g>
      <Pop d={d}>
        <P x={cx} y={cy} ang={-135} L={26} W={9} faint sy={0.8} />
        <P x={cx} y={cy} ang={-90} L={34} W={11} faint />
        <Hyb x={cx} y={cy} ang={180} L={L} />
        <Hyb x={cx} y={cy} ang={0} L={L} />
        <Atom x={cx} y={cy} r={7} el="C" sym={false} />
      </Pop>
      <Arc d={`M${cx - 46} ${cy + 4} A46 46 0 0 0 ${cx + 46} ${cy + 4}`} delay={d + 0.25} />
      <Fade d={d + 0.4}>
        <T x={cx} y={cy + 66} className="f35-mono f35-b f35-lvt" size={13}>
          180°
        </T>
      </Fade>
    </g>
  )
}

function Column({ i, x, y }: { i: number; x: number; y: number }) {
  const k = KINDS[i]
  const d = 0.1 + i * 0.1
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={90} y={24} className="f35-title" size={22}>
        <ChemText text={k.name} />
      </T>
      <Recipe k={k} cx={90} y={38} d={d} />
      <Geometry i={i} cx={90} cy={i === 1 ? 236 : 230} d={d + 0.55} />
      <Fade d={d + 0.7}>
        <T x={90} y={316} className="f35-note" size={16}>
          {`${k.angle} · ${k.shape}`}
        </T>
        <T x={90} y={340} className="f35-t f35-b" size={15}>
          <ChemText text={k.formula} />
          <tspan className="f35-muted" fontWeight={500}>{` (${k.molecule})`}</tspan>
        </T>
      </Fade>
    </g>
  )
}

/** Narrow layout: one row per hybridisation, recipe left, geometry right. */
function Row({ i, y }: { i: number; y: number }) {
  const k = KINDS[i]
  const d = 0.1 + i * 0.1
  return (
    <g transform={`translate(0 ${y})`}>
      <T x={80} y={22} className="f35-title" size={22}>
        <ChemText text={k.name} />
      </T>
      <Recipe k={k} cx={80} y={34} d={d} />
      <Geometry i={i} cx={236} cy={i === 1 ? 88 : 84} d={d + 0.55} />
      <Fade d={d + 0.7}>
        <T x={236} y={172} className="f35-note" size={15}>
          {`${k.angle} · ${k.shape}`}
        </T>
        <T x={80} y={172} className="f35-t f35-b" size={15}>
          <ChemText text={k.formula} />
        </T>
      </Fade>
    </g>
  )
}

function Legend({ x, y }: { x: number; y: number }) {
  return (
    <Fade d={0.1}>
      <g transform={`translate(${x} ${y})`}>
        <Icon x={0} y={0} k="s" />
        <T x={14} y={5} anchor="start" className="f35-t f35-small">
          s
        </T>
        <Icon x={46} y={0} k="p" />
        <T x={58} y={5} anchor="start" className="f35-t f35-small">
          p
        </T>
        <Icon x={90} y={0} k="h" />
        <T x={102} y={5} anchor="start" className="f35-t f35-small">
          hybridní
        </T>
        <Icon x={172} y={0} k="p" faint />
        <T x={184} y={5} anchor="start" className="f35-t f35-small">
          nehybridizovaný p
        </T>
      </g>
    </Fade>
  )
}

export default function Hybridization() {
  return (
    <Figure
      level={3}
      label="Hybridizace orbitalů uhlíku. sp3: orbital s se smísí se třemi orbitaly p na čtyři hybridní orbitaly sp3 mířící do vrcholů tetraedru s úhlem 109,5°, například methan CH4. sp2: s se smísí se dvěma p na tři orbitaly sp2 v rovině trojúhelníku s úhlem 120°, jeden orbital p zůstane nehybridizovaný a stojí kolmo k rovině, například ethen C2H4. sp: s se smísí s jedním p na dva orbitaly sp v přímce s úhlem 180°, dva orbitaly p zůstanou nehybridizované, například ethyn C2H2."
      layouts={[
        {
          w: 580,
          h: 390,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <line x1={193} x2={193} y1={10} y2={350} className="f35-rule" />
              <line x1={387} x2={387} y1={10} y2={350} className="f35-rule" />
              {KINDS.map((_, i) => (
                <Column key={i} i={i} x={4 + i * 193} y={0} />
              ))}
              <Legend x={120} y={374} />
            </>
          ),
        },
        {
          w: 320,
          h: 600,
          max: 440,
          when: 'narrow',
          draw: () => (
            <>
              {KINDS.map((_, i) => (
                <g key={i}>
                  {i > 0 && <line x1={10} x2={310} y1={i * 190 - 8} y2={i * 190 - 8} className="f35-rule" />}
                  <Row i={i} y={i * 190} />
                </g>
              ))}
              <Legend x={16} y={584} />
            </>
          ),
        },
      ]}
    />
  )
}
