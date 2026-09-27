import type { ReactNode } from 'react'
import { Bubbles, ChemText, Fade, Figure, Flame, Pop, pat, useCompact, useFig } from './kit'

const CW = 180 // cell width
const CH = 232 // cell height

/** Upright test tube, mouth at (x, y), length h. Children are clipped inside. */
function Tube({ x, y, h = 116, r = 15, flip = false, children, k }: { x: number; y: number; h?: number; r?: number; flip?: boolean; children?: ReactNode; k: string }) {
  const { id } = useFig()
  const s = flip ? -1 : 1
  const b = y + s * h
  const d = `M${x - r} ${y} V${b - s * r} A${r} ${r} 0 0 ${flip ? 1 : 0} ${x + r} ${b - s * r} V${y}`
  const clip = `${id}-gt${k}`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d}Z`} />
        </clipPath>
      </defs>
      <path d={`${d}Z`} className="f67-glass" />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <path d={d} className="f67-o" />
      <path d={`M${x - r - 3} ${y} H${x + r + 3}`} className="f67-o" />
      <path d={`M${x - r + 4} ${y + s * 8} V${b - s * (r + 6)}`} className="f67-o f67-thin f67-glint" />
    </g>
  )
}

/** Wooden splint from (x1, y1) to the tip (x2, y2). */
function Splint({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} className="f67-splint-o" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} className="f67-splint" />
    </g>
  )
}

function Burst({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g className="f67-flash">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const t = (a * Math.PI) / 180
        const l = i % 2 ? r : r * 1.35
        return <path key={a} d={`M${x + Math.cos(t) * r * 0.5} ${y + Math.sin(t) * r * 0.5} L${x + Math.cos(t) * l} ${y + Math.sin(t) * l}`} className="f67-burst" />
      })}
    </g>
  )
}

/** Damp litmus strip hanging into a tube mouth; top colour `a`, bottom colour `b` after the test. */
function Litmus({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return (
    <g>
      <rect x={x - 6} y={y} width={12} height={34} fill={a} className="f67-o f67-thin" />
      <rect x={x - 6} y={y + 34} width={12} height={34} fill={b} className="f67-o f67-thin" />
      <path d={`M${x} ${y} V${y - 14}`} className="f67-o" />
      <circle cx={x} cy={y - 16} r={3} className="f67-o f67-fill2" />
    </g>
  )
}

function H2({ cx }: { cx: number }) {
  // inverted tube: hydrogen is lighter than air
  return (
    <g>
      <Tube x={cx - 16} y={136} h={106} flip k="h2">
        <rect x={cx - 40} y={20} width={60} height={130} fill="#e8eef8" fillOpacity={0.25} />
      </Tube>
      <Splint x1={cx + 64} y1={166} x2={cx - 6} y2={148} />
      <Flame x={cx - 4} y={150} h={20} w={6} />
      <Burst x={cx - 16} y={144} r={18} />
    </g>
  )
}

function O2({ cx }: { cx: number }) {
  return (
    <g>
      <Tube x={cx} y={70} h={110} k="o2" />
      <Splint x1={cx + 52} y1={20} x2={cx + 2} y2={116} />
      <Flame x={cx + 1} y={122} h={24} w={7} />
      <circle cx={cx + 2} cy={118} r={2.6} fill="#e8892a" />
    </g>
  )
}

function CO2({ cx }: { cx: number }) {
  const { id } = useFig()
  return (
    <g>
      <Tube x={cx + 8} y={60} h={120} r={16} k="co2">
        <rect x={cx - 10} y={112} width={40} height={80} fill="#f4f1ea" fillOpacity={0.92} />
        <rect x={cx - 10} y={112} width={40} height={80} fill={pat(id, 'dots')} />
        <Bubbles x={cx + 8} y={172} rise={56} n={6} spread={8} r={3.2} />
      </Tube>
      {/* delivery tube from the gas generator */}
      <path d={`M${cx - 70} 36 H${cx + 4} V172`} className="f67-deliv-o" />
      <path d={`M${cx - 70} 36 H${cx + 4} V172`} className="f67-deliv" />
      <path d={`M${cx - 8} 112 H${cx + 24}`} className="f67-o f67-thin" />
    </g>
  )
}

function Cl2({ cx }: { cx: number }) {
  const { id } = useFig()
  return (
    <g>
      <Tube x={cx} y={70} h={110} k="cl2">
        <g className="f67-drift">
          <rect x={cx - 20} y={70} width={40} height={120} fill="#a9c23a" fillOpacity={0.45} />
          <rect x={cx - 20} y={70} width={40} height={120} fill={pat(id, 'dots')} />
        </g>
      </Tube>
      <Litmus x={cx} y={42} a="#3d6fd1" b="#f7f4ec" />
    </g>
  )
}

function NH3({ cx }: { cx: number }) {
  return (
    <g>
      <Tube x={cx} y={70} h={110} k="nh3">
        <rect x={cx - 20} y={70} width={40} height={120} fill="#e8eef8" fillOpacity={0.25} />
      </Tube>
      <Litmus x={cx} y={42} a="#d0453a" b="#3d6fd1" />
    </g>
  )
}

const CELLS: { f: string; name: string; art: (cx: number) => ReactNode; cap: string; cap2: string }[] = [
  { f: 'H_{2}', name: 'vodík – štěknutí', art: (cx) => <H2 cx={cx} />, cap: 'hořící špejle', cap2: 'u ústí zkumavky' },
  { f: 'O_{2}', name: 'kyslík – vzplane', art: (cx) => <O2 cx={cx} />, cap: 'doutnající špejle', cap2: 'vložená do plynu' },
  { f: 'CO_{2}', name: 'oxid uhličitý – zákal', art: (cx) => <CO2 cx={cx} />, cap: 'probublává', cap2: 'vápennou vodou' },
  { f: 'Cl_{2}', name: 'chlor – odbarví', art: (cx) => <Cl2 cx={cx} />, cap: 'vlhký modrý', cap2: 'lakmusový papírek' },
  { f: 'NH_{3}', name: 'amoniak – zmodrá', art: (cx) => <NH3 cx={cx} />, cap: 'vlhký červený', cap2: 'lakmusový papírek' },
]

function Cell({ i, x, y }: { i: number; x: number; y: number }) {
  const c = CELLS[i]
  const cx = CW / 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <Fade delay={0.1 + i * 0.12}>
        <text x={12} y={26} className="f67-eq f67-eq-xl f67-lvl-t">
          <ChemText text={c.f} />
        </text>
      </Fade>
      <Pop delay={0.2 + i * 0.15}>{c.art(cx)}</Pop>
      <Fade delay={0.6 + i * 0.15}>
        <text x={cx} y={CH - 38} textAnchor="middle" className="f67-lbl f67-b">
          {c.name}
        </text>
        <text x={cx} y={CH - 20} textAnchor="middle" className="f67-lbl f67-sm">
          {c.cap}
        </text>
        <text x={cx} y={CH - 4} textAnchor="middle" className="f67-lbl f67-sm">
          {c.cap2}
        </text>
      </Fade>
    </g>
  )
}

export default function GasTests() {
  const compact = useCompact()
  const n = compact.narrow
  const cols = n ? 2 : 3
  const W = cols * CW + 8
  const pos = CELLS.map((_, i) => {
    const row = Math.floor(i / cols)
    const inRow = Math.min(cols, CELLS.length - row * cols)
    const col = i % cols
    return [4 + (cols - inRow) * (CW / 2) + col * CW, row * (CH + 16)]
  })
  const rows = Math.ceil(CELLS.length / cols)
  return (
    <Figure
      level={7}
      w={W}
      h={rows * (CH + 16) - 12}
      max={n ? 420 : 640}
      compact={compact}
      boost={false}
      label="Důkazy plynů. Vodík: hořící špejle u ústí zkumavky způsobí štěknutí, pískavé lupnutí. Kyslík: doutnající špejle v kyslíku znovu vzplane. Oxid uhličitý: plyn probublává vápennou vodou a ta se zakalí, zmléčná. Chlor: vlhký modrý lakmusový papírek odbarví, zbělá. Amoniak: vlhký červený lakmusový papírek zmodrá."
    >
      {Array.from({ length: rows - 1 }, (_, r) => (
        <line key={r} x1={16} x2={W - 16} y1={(r + 1) * (CH + 16) - 8} y2={(r + 1) * (CH + 16) - 8} className="f67-o f67-soft" />
      ))}
      {CELLS.map((_, i) => (
        <Cell key={i} i={i} x={pos[i][0]} y={pos[i][1]} />
      ))}
    </Figure>
  )
}
