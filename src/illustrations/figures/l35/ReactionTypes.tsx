import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ChemText, Figure, Pop, T, pat, usePid, vDraw, vFade } from './kit'

type P = 'A' | 'B' | 'C' | 'D'
type Tok = P[] | '+' | '→'

const S = 19
const COLORS: Record<P, string> = { A: '#d9493b', B: '#3d6fd1', C: '#e0b43a', D: '#4fae5a' }

/** One particle: A circle, B square, C triangle, D diamond. */
function Shape({ k, x, y }: { k: P; x: number; y: number }) {
  const p = usePid()
  const h = S / 2
  const d =
    k === 'A'
      ? `M${x - h} ${y} A${h} ${h} 0 1 1 ${x + h} ${y} A${h} ${h} 0 1 1 ${x - h} ${y}Z`
      : k === 'B'
        ? `M${x - h + 1} ${y - h + 1} H${x + h - 1} V${y + h - 1} H${x - h + 1}Z`
        : k === 'C'
          ? `M${x} ${y - h - 1} L${x + h + 1} ${y + h - 1} H${x - h - 1}Z`
          : `M${x} ${y - h - 1} L${x + h + 1} ${y} L${x} ${y + h + 1} L${x - h - 1} ${y}Z`
  return (
    <g>
      <path d={d} fill={COLORS[k]} />
      <path d={d} fill={pat(p, 'sw')} />
      <path d={d} className="f35-shape-edge" />
      <text x={x} y={y + (k === 'C' ? 6 : 4.5)} textAnchor="middle" className="f35-sym" style={{ fontSize: 11.5, fill: k === 'C' ? '#1f2a44' : '#fffaf0' }}>
        {k}
      </text>
    </g>
  )
}

function width(t: Tok) {
  if (t === '+') return 18
  if (t === '→') return 34
  return t.length * S + (t.length - 1) * 1
}

function Scheme({ toks, cx, y, delay }: { toks: Tok[]; cx: number; y: number; delay: number }) {
  const total = toks.reduce((a, t) => a + width(t), 0)
  const k = Math.min(1, 200 / total)
  let x = cx - total / 2
  const arrowAt = toks.indexOf('→')
  const out: ReactNode[] = []
  toks.forEach((t, i) => {
    const w = width(t)
    const after = i > arrowAt
    const d = delay + (after ? 0.7 + (i - arrowAt) * 0.12 : i * 0.08)
    if (t === '+') {
      out.push(
        <motion.text key={i} x={x + w / 2} y={y + 5} textAnchor="middle" className="f35-t f35-b" variants={vFade} custom={d}>
          +
        </motion.text>,
      )
    } else if (t === '→') {
      out.push(
        <g key={i} className="f35-arrow-lv">
          <motion.path d={`M${x + 4} ${y} H${x + w - 8}`} variants={vDraw} custom={delay + 0.21} />
          <motion.polygon points={`${x + w - 3},${y} ${x + w - 11},${y - 4.5} ${x + w - 11},${y + 4.5}`} variants={vFade} custom={delay + 0.42} />
        </g>,
      )
    } else {
      const x0 = x
      out.push(
        <Pop key={i} d={d}>
          {t.length > 1 && <line x1={x0 + S / 2} x2={x0 + w - S / 2} y1={y} y2={y} className="f35-line" style={{ strokeWidth: 3 }} />}
          {t.map((k, j) => (
            <Shape key={j} k={k} x={x0 + S / 2 + j * (S + 1)} y={y} />
          ))}
        </Pop>,
      )
    }
    x += w
  })
  return <g transform={k < 1 ? `translate(${cx} ${y}) scale(${k.toFixed(3)}) translate(${-cx} ${-y})` : undefined}>{out}</g>
}

interface Panel {
  name: string
  alt: string
  toks: Tok[]
  general: string
  example: string
}

const PANELS: Panel[] = [
  { name: 'syntéza', alt: 'slučování', toks: [['A'], '+', ['B'], '→', ['A', 'B']], general: 'A + B → AB', example: '2 Mg + O_{2} → 2 MgO' },
  { name: 'rozklad', alt: 'analýza', toks: [['A', 'B'], '→', ['A'], '+', ['B']], general: 'AB → A + B', example: 'CaCO_{3} → CaO + CO_{2}' },
  { name: 'substituce', alt: 'nahrazování', toks: [['A'], '+', ['B', 'C'], '→', ['A', 'C'], '+', ['B']], general: 'A + BC → AC + B', example: 'Zn + CuCl_{2} → ZnCl_{2} + Cu' },
  {
    name: 'podvojná záměna',
    alt: 'výměna partnerů',
    toks: [['A', 'B'], '+', ['C', 'D'], '→', ['A', 'D'], '+', ['C', 'B']],
    general: 'AB + CD → AD + CB',
    example: 'AgNO_{3} + NaCl → AgCl + NaNO_{3}',
  },
]

function PanelView({ p, x, y, i }: { p: Panel; x: number; y: number; i: number }) {
  const cx = x + 115
  return (
    <g>
      <rect x={x + 6} y={y + 6} width={218} height={170} rx={8} className="f35-box" />
      <text x={cx} y={y + 34} textAnchor="middle" className="f35-title">
        {p.name}
      </text>
      <text x={cx} y={y + 52} textAnchor="middle" className="f35-note" style={{ fontSize: 14 }}>
        ({p.alt})
      </text>
      <Scheme toks={p.toks} cx={cx} y={y + 90} delay={0.1 + i * 0.1} />
      <T x={cx} y={y + 134} className="f35-mono f35-b" size={13.5}>
        {p.general}
      </T>
      <T x={cx} y={y + 158} className="f35-t f35-muted" size={12}>
        <ChemText text={p.example} />
      </T>
    </g>
  )
}

export default function ReactionTypes() {
  return (
    <Figure
      level={4}
      label="Čtyři typy chemických reakcí jako částice různých tvarů: syntéza A + B → AB (2Mg + O2 → 2MgO), rozklad AB → A + B (CaCO3 → CaO + CO2), substituce A + BC → AC + B (Zn + CuCl2 → ZnCl2 + Cu) a podvojná záměna AB + CD → AD + CB (AgNO3 + NaCl → AgCl + NaNO3)."
      layouts={[
        {
          w: 460,
          h: 364,
          max: 640,
          when: 'wide',
          draw: () => (
            <>
              {PANELS.map((p, i) => (
                <PanelView key={p.name} p={p} i={i} x={(i % 2) * 230} y={Math.floor(i / 2) * 182} />
              ))}
            </>
          ),
        },
        {
          w: 260,
          h: 728,
          max: 400,
          when: 'narrow',
          draw: () => (
            <>
              {PANELS.map((p, i) => (
                <PanelView key={p.name} p={p} i={i} x={15} y={i * 182} />
              ))}
            </>
          ),
        },
      ]}
    />
  )
}
