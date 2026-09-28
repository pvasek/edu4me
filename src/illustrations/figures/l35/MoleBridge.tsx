import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Arrow, Ball, ChemText, CPK, Figure, Pop, pat, usePid } from './kit'

const C = 200
const R = 48

interface Link {
  /** card centre */
  at: [number, number]
  word: string
  sym: string
  unit: string
  div: string
  icon: ReactNode
}

function IconBalance() {
  const p = usePid()
  return (
    <g>
      <path d="M-14 8 H14 L16 16 H-16Z" className="f35-fill2" />
      <path d="M0 8 V-10 M-14 -10 H14" className="f35-line" />
      <path d="M-14 -10 L-19 0 H-9Z M14 -10 L9 0 H19Z" className="f35-thin" />
      <path d="M-20 0 Q-14 6 -8 0Z M8 0 Q14 6 20 0Z" className="f35-fill" />
      <path d="M-14 8 H14 L16 16 H-16Z" fill={pat(p, 'd')} />
    </g>
  )
}
function IconParticles() {
  const pts: [number, number][] = [
    [-10, -8],
    [4, -11],
    [13, 0],
    [-4, 4],
    [-14, 8],
    [8, 12],
  ]
  return (
    <g>
      {pts.map(([x, y], i) => (
        <Ball key={i} x={x} y={y} r={5.5} fill={i % 2 ? CPK.O : CPK.N} />
      ))}
    </g>
  )
}
function IconGas() {
  const p = usePid()
  return (
    <g>
      <path d="M-3 16 C-4 10 -16 4 -16 -6 C-16 -18 16 -18 16 -6 C16 4 4 10 3 16Z" className="f35-balloon" />
      <path d="M-3 16 C-4 10 -16 4 -16 -6 C-16 -18 16 -18 16 -6 C16 4 4 10 3 16Z" fill={pat(p, 'd')} />
      <path d="M0 16 q3 4 -1 8" className="f35-thin" />
    </g>
  )
}
function IconFlask() {
  const p = usePid()
  return (
    <g>
      <path d="M-3 -18 V-2 C-14 0 -16 8 -14 12 C-11 18 11 18 14 12 C16 8 14 0 3 -2 V-18" className="f35-glass" />
      <path d="M-13 6 C-12 16 12 16 13 6Z" className="f35-lv-liquid" />
      <path d="M-13 6 C-12 16 12 16 13 6Z" fill={pat(p, 'h')} />
      <path d="M-3 -18 V-2 C-14 0 -16 8 -14 12 C-11 18 11 18 14 12 C16 8 14 0 3 -2 V-18" className="f35-glass-edge" />
      <path d="M-5 -10 H5" className="f35-thin" />
    </g>
  )
}

const LINKS: Link[] = [
  { at: [86, 62], word: 'hmotnost', sym: 'm', unit: 'g', div: 'M', icon: <IconBalance /> },
  { at: [314, 62], word: 'počet částic', sym: 'N', unit: '', div: 'N_{A}', icon: <IconParticles /> },
  { at: [86, 338], word: 'objem plynu', sym: 'V', unit: 'dm^{3}', div: 'V_{m}', icon: <IconGas /> },
  { at: [314, 338], word: 'roztok', sym: 'c', unit: 'mol/dm^{3}', div: '', icon: <IconFlask /> },
]

function Card({ l, i }: { l: Link; i: number }) {
  const [x, y] = l.at
  return (
    <Pop d={0.3 + i * 0.12}>
      <rect x={x - 78} y={y - 36} width={156} height={72} rx={8} className="f35-fill" />
      <rect x={x - 74} y={y - 32} width={148} height={64} rx={6} className="f35-rule" />
      <g transform={`translate(${x - 50} ${y})`}>{l.icon}</g>
      <text x={x - 22} y={y - 10} className="f35-note" style={{ fontSize: 15 }}>
        {l.word}
      </text>
      <text x={x - 22} y={y + 17} className="f35-bigsym">
        {l.sym}
      </text>
      {l.unit && (
        <text x={x + 2} y={y + 16} className="f35-mono f35-muted" style={{ fontSize: 12 }}>
          <ChemText text={`[${l.unit}]`} />
        </text>
      )}
    </Pop>
  )
}

function Links() {
  return (
    <>
      {LINKS.map((l, i) => {
        const [x, y] = l.at
        const dx = C - x
        const dy = C - y
        const L = Math.hypot(dx, dy)
        const ux = dx / L
        const uy = dy / L
        // perpendicular pointing "up" the screen side
        let nx = -uy
        let ny = ux
        if (ny > 0) {
          nx = -nx
          ny = -ny
        }
        const start = 64
        const end = L - R - 8
        const P = (t: number, o: number) => [x + ux * t + nx * o, y + uy * t + ny * o] as const
        const a1 = P(start, 7)
        const a2 = P(end, 7)
        const b1 = P(end, -7)
        const b2 = P(start, -7)
        const mid = (start + end) / 2
        const toN = l.div ? `÷ ${l.div}` : '· V'
        const fromN = l.div ? `· ${l.div}` : '÷ V'
        const off = (t: string) => 14 + t.replace(/[_^{}]/g, '').length * 3.1
        const la = P(mid, off(toN))
        const lb = P(mid, -off(fromN))
        return (
          <g key={i}>
            <Arrow x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} className="f35-arrow-lv" delay={0.8 + i * 0.1} head={9} />
            <Arrow x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} delay={1.1 + i * 0.1} head={9} />
            <text x={la[0]} y={la[1] + 5} textAnchor="middle" className="f35-mono f35-b f35-lvt" style={{ fontSize: 14 }}>
              <ChemText text={toN} />
            </text>
            <text x={lb[0]} y={lb[1] + 5} textAnchor="middle" className="f35-mono" style={{ fontSize: 14 }}>
              <ChemText text={fromN} />
            </text>
          </g>
        )
      })}
    </>
  )
}

export default function MoleBridge() {
  return (
    <Figure
      level={4}
      label="Mapa výpočtů s molem: uprostřed látkové množství n v molech. Z hmotnosti m dostaneš n dělením molární hmotností M, z počtu částic N dělením Avogadrovou konstantou NA = 6,022·10^23 mol−1, z objemu plynu V dělením molárním objemem Vm = 22,4 dm3/mol a z roztoku jako n = c · V. Opačným směrem se násobí."
      layouts={[
        {
          w: 400,
          h: 440,
          max: 580,
          draw: () => (
            <>
              <Links />
              <Pop d={0.1}>
                <circle cx={C} cy={C} r={R + 5} className="f35-lvline" style={{ strokeWidth: 1.2 }} />
                <circle cx={C} cy={C} r={R} className="f35-lvfill" />
                <text x={C} y={C + 8} textAnchor="middle" className="f35-bigsym" style={{ fontSize: 40 }}>
                  n
                </text>
                <text x={C} y={C + 30} textAnchor="middle" className="f35-mono f35-b">
                  mol
                </text>
              </Pop>
              {LINKS.map((l, i) => (
                <Card key={i} l={l} i={i} />
              ))}
              {/* a token travels m → n → N once */}
              <motion.circle
                r={6}
                className="f35-token"
                variants={{
                  hidden: { cx: 86, cy: 62, opacity: 0 },
                  show: {
                    cx: [86, 86, C, C, 314, 314],
                    cy: [62, 62, C, C, 62, 62],
                    opacity: [0, 1, 1, 1, 1, 0],
                    transition: { delay: 0.9, duration: 1.5, times: [0, 0.08, 0.42, 0.58, 0.92, 1] },
                  },
                }}
              />
              <line x1={20} x2={380} y1={400} y2={400} className="f35-rule" />
              <text x={200} y={386} textAnchor="middle" className="f35-note" style={{ fontSize: 15 }}>
                n = látkové množství · roztok: n = c · V
              </text>
              <text x={200} y={418} textAnchor="middle" className="f35-mono" style={{ fontSize: 12.5 }}>
                <ChemText text="N_{A} = 6,022·10^{23} mol^{−1}" />
              </text>
              <text x={200} y={436} textAnchor="middle" className="f35-mono" style={{ fontSize: 12.5 }}>
                <ChemText text="V_{m} = 22,4 dm^{3}/mol (0 °C, 101,325 kPa)" />
              </text>
            </>
          ),
        },
      ]}
    />
  )
}
