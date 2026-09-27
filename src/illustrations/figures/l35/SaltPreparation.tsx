import type { CSSProperties, ReactNode } from 'react'
import { Beaker, Bubbles, ChemText, Erlenmeyer, Figure, Pop, T, TestTube, pat, usePid } from './kit'

const ACID = 'color-mix(in srgb, var(--info-soft) 80%, var(--surface))'

function Metal({ cx, y }: { cx: number; y: number }) {
  return (
    <g>
      {[
        [-7, 0, 5],
        [3, -2, 6],
        [0, 6, 4.5],
      ].map(([dx, dy, r], i) => (
        <path
          key={i}
          d={`M${cx + dx - r} ${y + dy} L${cx + dx - r * 0.3} ${y + dy - r} L${cx + dx + r} ${y + dy - r * 0.4} L${cx + dx + r * 0.7} ${y + dy + r * 0.7} L${cx + dx - r * 0.4} ${y + dy + r}Z`}
          className="f35-zn"
        />
      ))}
    </g>
  )
}

function GasLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <path d={`M${x} ${y + 8} V${y - 14}`} className="f35-arrow-line" />
      <polygon points={`${x},${y - 20} ${x - 4.5},${y - 12} ${x + 4.5},${y - 12}`} className="f35-arrow-head" />
      <text x={x + 9} y={y - 4} className="f35-t f35-b" style={{ fontSize: 15 }}>
        <ChemText text={text} />
      </text>
    </g>
  )
}

function AcidMetal({ cx, y }: { cx: number; y: number }) {
  return (
    <g>
      <TestTube cx={cx} y={y + 50} w={30} h={100} level={70} color={ACID} opacity={1}>
        <Metal cx={cx} y={y + 136} />
        <Bubbles xs={[cx - 8, cx - 2, cx + 5, cx + 9, cx - 5, cx + 2]} y={y + 128} h={60} r={2.3} />
      </TestTube>
      <GasLabel x={cx} y={y + 42} text="H_{2}" />
      <text x={cx + 22} y={y + 144} className="f35-note" style={{ fontSize: 14 }}>
        Zn
      </text>
      <text x={cx - 22} y={y + 100} textAnchor="end" className="f35-note" style={{ fontSize: 14 }}>
        HCl
      </text>
    </g>
  )
}

function AcidBase({ cx, y }: { cx: number; y: number }) {
  const p = usePid()
  const bx = cx
  return (
    <g>
      {/* burette */}
      <rect x={bx - 5} y={y + 22} width={10} height={70} className="f35-glass" />
      <rect x={bx - 5} y={y + 40} width={10} height={52} fill={ACID} />
      <rect x={bx - 5} y={y + 40} width={10} height={52} fill={pat(p, 'h')} />
      <rect x={bx - 5} y={y + 22} width={10} height={70} className="f35-glass-edge" />
      {[30, 44, 58, 72, 86].map((t) => (
        <line key={t} x1={bx - 5} x2={bx - 1} y1={y + t} y2={y + t} className="f35-grad" />
      ))}
      <path d={`M${bx - 5} ${y + 92} L${bx - 2} ${y + 102} V${y + 108} H${bx + 2} V${y + 102} L${bx + 5} ${y + 92}`} className="f35-glass-edge" />
      <rect x={bx - 10} y={y + 96} width={20} height={4} rx={1.5} className="f35-fill2" />
      <circle cx={bx} cy={y + 112} r={2.4} className="f35-drop f35-drip" style={{ '--drop': '22px' } as CSSProperties} />
      <Erlenmeyer cx={cx} y={y + 118} w={64} h={52} neckW={14} neckH={14} level={20} color="color-mix(in srgb, #d6399b 28%, var(--surface))" opacity={1} />
      <text x={cx + 14} y={y + 60} className="f35-note" style={{ fontSize: 14 }}>
        HCl
      </text>
      <text x={cx + 38} y={y + 160} className="f35-note" style={{ fontSize: 14 }}>
        NaOH
      </text>
    </g>
  )
}

function AcidCarbonate({ cx, y }: { cx: number; y: number }) {
  const chips = [
    [-22, 0, 7],
    [-8, 2, 8],
    [8, 0, 7],
    [22, 2, 6],
    [0, -8, 6],
    [-15, -7, 5],
    [15, -7, 5.5],
  ]
  return (
    <g>
      <Beaker x={cx - 38} y={y + 70} w={76} h={90} level={58} color={ACID} opacity={1} graduations={false}>
        {chips.map(([dx, dy, r], i) => (
          <path
            key={i}
            d={`M${cx + dx - r} ${y + 150 + dy} L${cx + dx - r * 0.3} ${y + 150 + dy - r} L${cx + dx + r} ${y + 150 + dy - r * 0.5} L${cx + dx + r * 0.8} ${y + 150 + dy + r * 0.6} L${cx + dx - r * 0.5} ${y + 150 + dy + r * 0.8}Z`}
            className="f35-crystal"
          />
        ))}
        <Bubbles xs={[cx - 24, cx - 14, cx - 4, cx + 6, cx + 16, cx + 26, cx - 20, cx + 10]} y={y + 138} h={46} r={2.6} />
      </Beaker>
      <GasLabel x={cx} y={y + 58} text="CO_{2}" />
      <text x={cx + 44} y={y + 110} className="f35-note" style={{ fontSize: 14 }}>
        HCl
      </text>
      <text x={cx + 44} y={y + 156} className="f35-note" style={{ fontSize: 14 }}>
        <ChemText text="CaCO_{3}" />
      </text>
    </g>
  )
}

function Precipitate({ cx, y }: { cx: number; y: number }) {
  const flakes = []
  for (let i = 0; i < 14; i++) {
    const dx = ((i * 37) % 22) - 11
    const dy = (i * 13) % 14
    flakes.push(
      <circle key={i} cx={cx + dx} cy={y + 132 + dy} r={1.8 + (i % 3) * 0.5} className="f35-ppt f35-settle" style={{ animationDelay: `${((i * 0.41) % 3).toFixed(2)}s` }} />,
    )
  }
  return (
    <g>
      {/* dropper */}
      <path d={`M${cx - 3} ${y + 26} V${y + 48} L${cx} ${y + 54} L${cx + 3} ${y + 48} V${y + 26}`} className="f35-glass-edge" />
      <rect x={cx - 6} y={y + 12} width={12} height={16} rx={5} className="f35-rubber" />
      <circle cx={cx} cy={y + 58} r={2.2} className="f35-drop f35-drip" style={{ '--drop': '24px' } as CSSProperties} />
      <TestTube cx={cx} y={y + 66} w={30} h={96} level={62} color={ACID} opacity={1}>
        <path d={`M${cx - 15} ${y + 146} Q${cx} ${y + 142} ${cx + 15} ${y + 146} V${y + 170} H${cx - 15}Z`} className="f35-ppt-layer" />
        {flakes}
      </TestTube>
      <text x={cx - 22} y={y + 112} textAnchor="end" className="f35-note" style={{ fontSize: 14 }}>
        <ChemText text="AgNO_{3}" />
      </text>
      <text x={cx + 22} y={y + 50} className="f35-note" style={{ fontSize: 14 }}>
        NaCl
      </text>
      <text x={cx + 22} y={y + 152} className="f35-note" style={{ fontSize: 14 }}>
        AgCl
      </text>
    </g>
  )
}

interface V {
  title: string
  draw: (cx: number, y: number) => ReactNode
  eq: string[]
}
const VIGNETTES: V[] = [
  { title: 'kyselina + kov', draw: (cx, y) => <AcidMetal cx={cx} y={y} />, eq: ['Zn + 2 HCl → ZnCl_{2} + H_{2}↑'] },
  { title: 'kyselina + zásada', draw: (cx, y) => <AcidBase cx={cx} y={y} />, eq: ['HCl + NaOH → NaCl + H_{2}O'] },
  { title: 'kyselina + uhličitan', draw: (cx, y) => <AcidCarbonate cx={cx} y={y} />, eq: ['CaCO_{3} + 2 HCl →', 'CaCl_{2} + H_{2}O + CO_{2}↑'] },
  { title: 'srážení', draw: (cx, y) => <Precipitate cx={cx} y={y} />, eq: ['AgNO_{3} + NaCl →', 'AgCl↓ + NaNO_{3}'] },
]

function Panel({ v, x, y, i }: { v: V; x: number; y: number; i: number }) {
  const cx = x + 115
  return (
    <g>
      <rect x={x + 6} y={y + 6} width={218} height={250} rx={8} className="f35-box" />
      <T x={cx} y={y + 30} className="f35-title" size={18}>
        {v.title}
      </T>
      <Pop d={0.15 + i * 0.2}>{v.draw(cx, y + 28)}</Pop>
      {v.eq.map((e, k) => (
        <text key={k} x={cx} y={y + 222 + k * 17 - (v.eq.length - 1) * 8} textAnchor="middle" className="f35-mono" style={{ fontSize: 12 }}>
          <ChemText text={e} />
        </text>
      ))}
    </g>
  )
}

export default function SaltPreparation() {
  return (
    <Figure
      level={5}
      label="Čtyři způsoby přípravy solí: kyselina + kov (Zn + 2 HCl → ZnCl2 + H2, unikají bublinky vodíku), kyselina + zásada (neutralizace HCl + NaOH → NaCl + H2O), kyselina + uhličitan (CaCO3 + 2 HCl → CaCl2 + H2O + CO2, šumí oxid uhličitý) a srážení (AgNO3 + NaCl → AgCl + NaNO3, vzniká bílá sraženina)."
      layouts={[
        {
          w: 460,
          h: 526,
          max: 620,
          when: 'wide',
          draw: () => (
            <>
              {VIGNETTES.map((v, i) => (
                <Panel key={v.title} v={v} i={i} x={(i % 2) * 230} y={Math.floor(i / 2) * 262} />
              ))}
            </>
          ),
        },
        {
          w: 260,
          h: 1050,
          max: 400,
          when: 'narrow',
          draw: () => (
            <>
              {VIGNETTES.map((v, i) => (
                <Panel key={v.title} v={v} i={i} x={15} y={i * 262} />
              ))}
            </>
          ),
        },
      ]}
    />
  )
}
