import type { ReactNode } from 'react'
import { Fade, Figure, Pop, cells, pat, useCompact, useFig } from './kit'

const CW = 164
const CX = CW / 2

function Ruler() {
  const { id } = useFig()
  const x0 = 16
  const mm = 4.2
  return (
    <g>
      <rect x={x0 - 6} y={34} width={140} height={34} rx={2} className="fz1-o fz1-wood" />
      <rect x={x0 - 6} y={34} width={140} height={34} rx={2} fill={pat(id, 'b')} opacity={0.35} />
      {Array.from({ length: 31 }, (_, i) => (
        <line key={i} x1={x0 + i * mm} x2={x0 + i * mm} y1={36} y2={36 + (i % 10 === 0 ? 12 : i % 5 === 0 ? 9 : 5)} className={i % 10 ? 'fz1-tick' : 'fz1-tickl'} />
      ))}
      {[0, 1, 2, 3].map((c) => (
        <text key={c} x={x0 + c * 42} y={64} textAnchor="middle" className="fz1-scale-n">
          {c}
        </text>
      ))}
      <text x={x0 + 130} y={55} textAnchor="end" className="fz1-scale-n">
        cm
      </text>
    </g>
  )
}

function Caliper() {
  const { id } = useFig()
  return (
    <g>
      {/* main beam with fixed jaws */}
      <path d="M14 30 H150 V42 H14Z" className="fz1-o fz1-metal" />
      <path d="M14 30 V88 H26 V42 M14 30 V18 H20 L23 30" className="fz1-o fz1-metal" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1={34 + i * 4.8} x2={34 + i * 4.8} y1={30} y2={i % 5 === 0 ? 37 : 34} className="fz1-tick" />
      ))}
      {/* measured block between the jaws */}
      <rect x={26} y={54} width={42} height={26} rx={2} className="fz1-o fz1-lvlsoft-f" />
      {/* slider with vernier and moving jaw */}
      <path d="M68 26 H110 V50 H80 V88 H68 V26Z" className="fz1-o fz1-fill" />
      <path d="M68 26 H110 V50 H80 V88 H68 V26Z" fill={pat(id, 'd')} opacity={0.35} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={82 + i * 3.1} x2={82 + i * 3.1} y1={42} y2={i % 5 === 0 ? 49 : 46} className="fz1-tick" />
      ))}
      <path d="M68 26 V18 H62 L59 26" className="fz1-o fz1-metal" />
    </g>
  )
}

function Cylinder() {
  const top = 10
  const bot = 82
  return (
    <g>
      <path d={`M${CX - 16} ${top} V${bot}`} className="fz1-o" />
      <path d={`M${CX + 16} ${top} V${bot}`} className="fz1-o" />
      <path d={`M${CX - 16} ${bot} H${CX + 16}`} className="fz1-o" />
      <path d={`M${CX - 30} ${bot + 6} H${CX + 30} M${CX - 24} ${bot} H${CX + 24} V${bot + 6} M${CX - 24} ${bot} V${bot + 6}`} className="fz1-o" />
      <path d={`M${CX - 16} ${top} Q${CX - 20} ${top - 2} ${CX - 22} ${top - 5}`} className="fz1-o" />
      <path d={`M${CX - 15} 40 Q${CX} 46 ${CX + 15} 40 V${bot - 1} H${CX - 15}Z`} className="fz1-water" />
      <path d={`M${CX - 15} 40 Q${CX} 46 ${CX + 15} 40`} className="fz1-o fz1-thin" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={CX - 16} x2={CX - 16 + (i % 2 ? 6 : 11)} y1={bot - 6 - i * 5.5} y2={bot - 6 - i * 5.5} className="fz1-tick" />
      ))}
      <text x={CX + 22} y={top + 10} className="fz1-scale-n">
        ml
      </text>
    </g>
  )
}

function Stopwatch() {
  const cy = 52
  return (
    <g>
      <rect x={CX - 5} y={6} width={10} height={9} rx={2} className="fz1-o fz1-metal" />
      <path d={`M${CX + 24} ${cy - 30} l7 -7`} className="fz1-o fz1-thick" />
      <circle cx={CX} cy={cy} r={36} className="fz1-o fz1-metal" />
      <circle cx={CX} cy={cy} r={30} className="fz1-o fz1-fill" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <line key={i} x1={CX + Math.sin(a) * 26} y1={cy - Math.cos(a) * 26} x2={CX + Math.sin(a) * 30} y2={cy - Math.cos(a) * 30} className="fz1-tick" />
      })}
      <rect x={CX - 23} y={cy - 9} width={46} height={18} rx={3} className="fz1-lcd" />
      <text x={CX} y={cy + 5} textAnchor="middle" className="fz1-lcd-t" style={{ fontSize: 11 }}>
        12,47
      </text>
    </g>
  )
}

function Scales() {
  return (
    <g>
      <path d={`M${CX - 50} 84 L${CX - 44} 60 H${CX + 44} L${CX + 50} 84Z`} className="fz1-o fz1-fill2" />
      <rect x={CX - 44} y={54} width={88} height={6} rx={2} className="fz1-o fz1-metal" />
      <rect x={CX - 20} y={66} width={40} height={14} rx={2} className="fz1-lcd" />
      <text x={CX} y={77} textAnchor="middle" className="fz1-lcd-t" style={{ fontSize: 10.5 }}>
        125 g
      </text>
      {/* brass weight */}
      <path d={`M${CX - 12} 54 V36 Q${CX - 12} 32 ${CX - 7} 32 H${CX + 7} Q${CX + 12} 32 ${CX + 12} 36 V54Z`} fill="#c9a24a" className="fz1-o" />
      <path d={`M${CX - 5} 32 V24 H${CX + 5} V32`} fill="#c9a24a" className="fz1-o" />
    </g>
  )
}

function Thermometer() {
  return (
    <g>
      <path d={`M${CX - 6} 10 A6 6 0 0 1 ${CX + 6} 10 V70 A11 11 0 1 1 ${CX - 6} 70Z`} className="fz1-o fz1-glass" />
      <circle cx={CX} cy={79} r={7.5} fill="#c8453a" />
      <rect x={CX - 2.2} y={38} width={4.4} height={40} fill="#c8453a" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={CX + 8} x2={CX + (i % 5 === 0 ? 18 : 13)} y1={66 - i * 5.4} y2={66 - i * 5.4} className="fz1-tick" />
      ))}
      <text x={CX + 21} y={69} className="fz1-scale-n">
        0
      </text>
      <text x={CX + 21} y={15} className="fz1-scale-n">
        °C
      </text>
    </g>
  )
}

function NewtonMeter() {
  const coil = Array.from({ length: 8 }, (_, i) => `L${CX + (i % 2 ? 7 : -7)} ${22 + i * 4.5}`).join(' ')
  return (
    <g>
      <path d={`M${CX} 2 V8`} className="fz1-o" />
      <circle cx={CX} cy={6} r={3} className="fz1-o" />
      <rect x={CX - 12} y={9} width={24} height={60} rx={4} className="fz1-o fz1-glass" />
      <path d={`M${CX} 12 V18 ${coil} L${CX} 58 V74`} className="fz1-spring" />
      <path d={`M${CX - 8} 58 H${CX + 8}`} className="fz1-o fz1-lvl-s fz1-thick" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={CX + 12} x2={CX + 17} y1={20 + i * 9} y2={20 + i * 9} className="fz1-tick" />
      ))}
      <text x={CX + 20} y={24} className="fz1-scale-n">
        N
      </text>
      <path d={`M${CX} 74 q-4 4 0 7 q4 3 5 -1`} className="fz1-o" />
      <rect x={CX - 10} y={82} width={20} height={12} rx={2} fill="#8a93a3" className="fz1-o" />
    </g>
  )
}

const ITEMS: { name: string; q: string; res: string; art: ReactNode }[] = [
  { name: 'pravítko', q: 'délka l', res: 'dílek 1 mm', art: <Ruler /> },
  { name: 'posuvné měřidlo', q: 'délka l', res: 'dílek 0,1 mm', art: <Caliper /> },
  { name: 'odměrný válec', q: 'objem V', res: 'dílek 1 ml', art: <Cylinder /> },
  { name: 'stopky', q: 'čas t', res: 'dílek 0,01 s', art: <Stopwatch /> },
  { name: 'váhy', q: 'hmotnost m', res: 'dílek 1 g', art: <Scales /> },
  { name: 'teploměr', q: 'teplota t', res: 'dílek 1 °C', art: <Thermometer /> },
  { name: 'siloměr', q: 'síla F', res: 'dílek 0,1 N', art: <NewtonMeter /> },
]

export default function MeasuringInstruments() {
  const compact = useCompact()
  const n = compact.narrow
  // phone: art a bit smaller and tighter lines so the plate stays ≤ ~600 px tall
  const k = n ? 0.84 : 1
  const ah = n ? 82 : 98
  const lh = n ? 17 : 18
  const g = cells(ITEMS.length, n ? 2 : 4, CW, ah + 3 * lh + 10, 4)
  return (
    <Figure
      w={g.w}
      h={g.h}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      label="Měřidla fyzikální laboratoře a jejich nejmenší dílek (rozlišení): pravítko měří délku s dílkem 1 mm, posuvné měřidlo s noniem měří délku s dílkem 0,1 mm, odměrný válec měří objem po 1 ml, stopky měří čas po 0,01 s, váhy měří hmotnost po 1 g, teploměr měří teplotu po 1 °C a siloměr měří sílu po 0,1 N."
    >
      {ITEMS.map((it, i) => {
        const [x, y] = g.pos[i]
        return (
          <g key={it.name} transform={`translate(${x} ${y})`}>
            <g transform={`translate(${CX * (1 - k)} 0) scale(${k})`}>
              <Pop delay={0.08 + i * 0.1}>{it.art}</Pop>
            </g>
            <Fade delay={0.3 + i * 0.1}>
              <text x={CX} y={ah + lh} textAnchor="middle" className="fz1-lbl fz1-b">
                {it.name}
              </text>
              <text x={CX} y={ah + 2 * lh} textAnchor="middle" className="fz1-lbl fz1-sm">
                {it.q.split(' ')[0]} <tspan className="fz1-val fz1-val-sm">{it.q.split(' ')[1]}</tspan>
              </text>
              <text x={CX} y={ah + 3 * lh} textAnchor="middle" className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
                {it.res}
              </text>
            </Fade>
          </g>
        )
      })}
    </Figure>
  )
}
