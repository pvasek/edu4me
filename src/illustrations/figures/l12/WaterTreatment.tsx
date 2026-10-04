import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Board, Hx, drawV, popV, rng, useHatch } from './kit'

/*
 * Each stage is drawn in a 130 × 170 box: ground at y = 150,
 * water enters at (0, 60) and leaves at (130, 60).
 */

const WATER = 'var(--f12-water)'

/** True inside a horizontally mirrored stage (text must be flipped back). */
const Mirrored = createContext(false)

function Ground() {
  const h = useHatch()
  return (
    <>
      <path className="f12-hatch" d="M-4 150 L134 150 L134 160 L-4 160 Z" fill={h('d')} />
      <path className="f12-line" d="M-4 150 L134 150" />
    </>
  )
}

/** Open concrete tank (walls in section) with water up to y = top. */
function Tank({ x0, x1, y0, top, children }: { x0: number; x1: number; y0: number; top: number; children?: ReactNode }) {
  return (
    <>
      <Hx d={`M${x0 + 4} ${top} L${x1 - 4} ${top} L${x1 - 4} 146 L${x0 + 4} 146 Z`} kind="h" tone={WATER} className="f12-liq" />
      {children}
      <Hx d={`M${x0} ${y0} L${x0 + 4} ${y0} L${x0 + 4} 146 L${x1 - 4} 146 L${x1 - 4} ${y0} L${x1} ${y0} L${x1} 150 L${x0} 150 Z`} kind="x" tone="var(--f12-metal)" />
    </>
  )
}

function Intake() {
  const h = useHatch()
  return (
    <g>
      {/* river */}
      <path className="f12-liq" style={{ fill: WATER }} d="M-4 60 L84 60 L84 146 L40 146 Q10 140 -4 120 Z" />
      <path className="f12-hatch" fill={h('h')} d="M-4 60 L84 60 L84 146 L40 146 Q10 140 -4 120 Z" />
      <path className="f12-line" d="M-4 120 Q10 140 40 146 L130 146" />
      <path className="f12-thin" d="M4 56 q8 -4 16 0 t16 0 t16 0 t16 0" />
      <path className="f12-hatch" fill={h('d')} d="M-4 120 Q10 140 40 146 L-4 146 Z" />
      {/* channel after the screen */}
      <path className="f12-liq" style={{ fill: WATER }} d="M92 60 L130 60 L130 146 L92 146 Z" />
      <path className="f12-hatch" fill={h('h')} d="M92 60 L130 60 L130 146 L92 146 Z" />
      {/* bar screen (česle) */}
      {[82, 86, 90].map((x) => (
        <rect key={x} className="f12-thin" x={x} y={36} width={2.4} height={112} style={{ fill: 'var(--f12-metal-2)' }} />
      ))}
      <path className="f12-line" d="M78 36 L96 36" />
      {/* caught debris */}
      <path className="f12-leaf" d="M72 70 q6 -8 10 0 q-5 6 -10 0 Z" />
      <path className="f12-leaf" d="M74 96 q7 -6 9 2 q-6 5 -9 -2 Z" />
      <path className="f12-twig" d="M60 84 L80 80 M70 82 L74 76" />
      <Ground />
    </g>
  )
}

function Coagulation() {
  const flocs = [
    [30, 110],
    [50, 124],
    [86, 104],
    [98, 126],
    [40, 86],
    [72, 132],
  ]
  return (
    <g>
      <Tank x0={8} x1={122} y0={40} top={60}>
        {flocs.map(([x, y], i) => (
          <g key={i} className="f12-jig">
            <circle className="f12-floc" cx={x} cy={y} r={3} />
            <circle className="f12-floc" cx={x + 3.5} cy={y + 2} r={2.2} />
            <circle className="f12-floc" cx={x - 2} cy={y + 3} r={2} />
          </g>
        ))}
        {/* mixer */}
        <path className="f12-line" d="M65 22 L65 118" />
        <g className="f12-paddle" style={{ transformOrigin: '65px 116px' } as CSSProperties}>
          <rect className="f12-thin" x={46} y={112} width={38} height={8} rx={2} style={{ fill: 'var(--f12-metal-2)' }} />
        </g>
      </Tank>
      <path className="f12-line" d="M40 30 L90 30" />
      <Hx d="M56 12 L74 12 L74 30 L56 30 Z" kind="x" tone="var(--f12-metal-2)" className="f12-thin" />
      {/* dosing hopper */}
      <path className="f12-line" style={{ fill: 'var(--surface-2)' }} d="M14 8 L40 8 L32 24 L22 24 Z" />
      <circle className="f12-dose" cx={27} cy={34} r={1.8} />
      <circle className="f12-dose" cx={27} cy={34} r={1.8} style={{ animationDelay: '-0.6s' }} />
      <Ground />
    </g>
  )
}

function Settling() {
  const h = useHatch()
  return (
    <g>
      <Tank x0={2} x1={128} y0={40} top={60}>
        <path className="f12-sludge" d="M6 146 L6 136 Q40 128 64 134 Q92 140 124 128 L124 146 Z" />
        <path className="f12-hatch" fill={h('s')} d="M6 146 L6 136 Q40 128 64 134 Q92 140 124 128 L124 146 Z" />
        {[20, 44, 70, 96, 112].map((x, i) => (
          <circle key={x} className="f12-floc f12-sink" cx={x} cy={72} r={2.6} style={{ animationDelay: `${-i * 0.7}s` } as CSSProperties} />
        ))}
      </Tank>
      <Ground />
    </g>
  )
}

function SandFilter() {
  const h = useHatch()
  const r = rng(3)
  const pebbles: ReactNode[] = []
  for (let x = 20; x < 112; x += 7) pebbles.push(<ellipse key={x} className="f12-thin" cx={x + r() * 2} cy={128 + r() * 6} rx={3.2} ry={2.4} style={{ fill: 'var(--surface-2)' }} />)
  return (
    <g>
      <Tank x0={12} x1={118} y0={36} top={60} />
      <path style={{ fill: 'color-mix(in srgb, var(--yellow) 40%, var(--surface))' }} d="M16 90 L114 90 L114 120 L16 120 Z" />
      <path className="f12-hatch" fill={h('s')} d="M16 90 L114 90 L114 120 L16 120 Z" />
      <path style={{ fill: 'color-mix(in srgb, var(--ink) 14%, var(--surface))' }} d="M16 120 L114 120 L114 140 L16 140 Z" />
      {pebbles}
      <path className="f12-thin" d="M16 90 L114 90 M16 120 L114 120" />
      {[34, 62, 90].map((x, i) => (
        <circle key={x} className="f12-drip" cx={x} cy={92} r={1.6} style={{ animationDelay: `${-i * 0.5}s` } as CSSProperties} />
      ))}
      {/* underdrain and outlet riser */}
      <path className="f12-pipe" d="M24 143 L124 143 L124 60 L130 60" />
      <Ground />
    </g>
  )
}

function Disinfection() {
  const m = useContext(Mirrored)
  return (
    <g>
      <Tank x0={6} x1={124} y0={44} top={60}>
        <path className="f12-line" d="M46 60 L46 128 M84 146 L84 78" />
        {/* UV lamp */}
        <rect className="f12-uv" x={92} y={96} width={24} height={8} rx={4} />
        <g className="f12-uv-rays">
          <path d="M104 92 L104 86 M96 93 L93 88 M112 93 L115 88 M104 108 L104 114 M96 107 L93 112 M112 107 L115 112" />
        </g>
      </Tank>
      {/* chlorine cylinder */}
      <Hx d="M16 10 Q16 4 22 4 L30 4 Q36 4 36 10 L36 42 L16 42 Z" kind="d" tone="color-mix(in srgb, #9fbf5a 50%, var(--surface))" />
      <text className="f12-cyl-t" x={26} y={28} textAnchor="middle" transform={m ? 'translate(52 0) scale(-1 1)' : undefined}>
        Cl₂
      </text>
      <path className="f12-pipe" d="M36 20 L60 20 L60 64" />
      <circle className="f12-dose f12-dose-cl" cx={60} cy={70} r={1.8} />
      <Ground />
    </g>
  )
}

function Tower() {
  const h = useHatch()
  return (
    <g>
      <path className="f12-pipe" d="M0 60 L14 60 L14 140 L66 140 L66 76" />
      {/* legs */}
      <path className="f12-line" d="M40 76 L30 150 M92 76 L102 150 M66 76 L66 84" />
      <path className="f12-thin" d="M36 104 L96 104 M33 128 L99 128 M36 104 L99 128 M96 104 L33 128" />
      {/* tank */}
      <path className="f12-line" style={{ fill: 'var(--f12-metal)' }} d="M28 30 Q28 16 66 12 Q104 16 104 30 L104 70 Q104 78 66 78 Q28 78 28 70 Z" />
      <path className="f12-liq" style={{ fill: WATER }} d="M31 38 L101 38 L101 70 Q101 75 66 75 Q31 75 31 70 Z" />
      <path className="f12-hatch" fill={h('h')} d="M31 38 L101 38 L101 70 Q101 75 66 75 Q31 75 31 70 Z" />
      <path className="f12-hatch" fill={h('d')} d="M84 16 Q104 18 104 30 L104 70 Q104 76 88 77 Z" />
      <path className="f12-line" d="M28 30 Q28 16 66 12 Q104 16 104 30 L104 70 Q104 78 66 78 Q28 78 28 70 Z" />
      {/* to the houses */}
      <path className="f12-pipe" d="M104 146 L120 146" />
      <path className="f12-line" style={{ fill: 'var(--surface)' }} d="M112 150 L112 132 L121 124 L130 132 L130 150 Z" />
      <rect className="f12-thin" x={118} y={139} width={5} height={11} />
      <Ground />
    </g>
  )
}

const STAGES: { name: string; sub: string; C: () => ReactNode }[] = [
  { name: 'česle', sub: 'hrubé nečistoty', C: Intake },
  { name: 'čiření', sub: 'vznikají vločky', C: Coagulation },
  { name: 'usazování', sub: 'vločky klesnou', C: Settling },
  { name: 'pískový filtr', sub: 'jemné částice', C: SandFilter },
  { name: 'dezinfekce', sub: 'chlor, ozon, UV', C: Disinfection },
  { name: 'vodojem', sub: 'pitná voda', C: Tower },
]

function StageLabel({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <motion.g variants={popV(0.3 + i * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <g className="f12-badge">
        <circle cx={x - 2} cy={y - 6} r={10} />
        <text x={x - 2} y={y - 5.5}>
          {i + 1}
        </text>
      </g>
      <text className="f12-t f12-t-strong" x={x + 12} y={y}>
        {STAGES[i].name}
      </text>
      <text className="f12-small f12-sec" x={x + 12} y={y + 18}>
        {STAGES[i].sub}
      </text>
    </motion.g>
  )
}

function Stage({ i, x, y, mirror = false }: { i: number; x: number; y: number; mirror?: boolean }) {
  const { C } = STAGES[i]
  return (
    <motion.g variants={popV(0.1 + i * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
      <g transform={mirror ? `translate(${x + 130} ${y}) scale(-1 1)` : `translate(${x} ${y})`}>
        <Mirrored.Provider value={mirror}>
          <C />
        </Mirrored.Provider>
      </g>
    </motion.g>
  )
}

function Pipe({ d, delay }: { d: string; delay: number }) {
  return (
    <g>
      <motion.path className="f12-pipe" d={d} variants={drawV(delay, 0.5)} />
      <motion.path className="f12-flow f12-flow-w" d={d} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: delay + 0.5 } } }} />
    </g>
  )
}

function Wide() {
  const X = (i: number) => 8 + i * 150
  return (
    <motion.svg className="f12-svg f12-wide" viewBox="0 0 910 232" aria-hidden="true" style={{ ['--f12-fs' as string]: '22px' }}>
      {STAGES.map((_, i) => (
        <Stage key={i} i={i} x={X(i)} y={4} />
      ))}
      {STAGES.slice(0, -1).map((_, i) => (
        <Pipe key={i} d={`M${X(i) + 124} 64 L${X(i + 1) + 6} 64`} delay={0.8 + i * 0.15} />
      ))}
      {STAGES.map((_, i) => (
        <StageLabel key={i} i={i} x={X(i) + 16} y={196} />
      ))}
    </motion.svg>
  )
}

function Narrow() {
  // row 1 left → right, row 2 right → left (stages mirrored so water still flows in and out correctly)
  const pos = [
    [8, 0],
    [158, 0],
    [308, 0],
    [308, 250],
    [158, 250],
    [8, 250],
  ]
  return (
    <motion.svg className="f12-svg f12-narrow" viewBox="0 0 460 480" aria-hidden="true" style={{ ['--f12-fs' as string]: '22px' }}>
      {STAGES.map((_, i) => (
        <Stage key={i} i={i} x={pos[i][0]} y={pos[i][1]} mirror={i >= 3} />
      ))}
      <Pipe d="M132 60 L164 60" delay={0.8} />
      <Pipe d="M282 60 L314 60" delay={0.95} />
      <Pipe d="M432 60 L452 60 L452 310 L432 310" delay={1.1} />
      <Pipe d="M314 310 L282 310" delay={1.3} />
      <Pipe d="M164 310 L132 310" delay={1.45} />
      {STAGES.map((_, i) => (
        <StageLabel key={i} i={i} x={pos[i][0] + 6} y={pos[i][1] + 190} />
      ))}
    </motion.svg>
  )
}

export default function WaterTreatment() {
  return (
    <Board
      level={1}
      max={900}
      className="f12-water"
      label="Úpravna vody v řezu. Voda z řeky projde česlemi, které zachytí hrubé nečistoty. Při čiření se přidá síran hlinitý a vznikají vločky, na které se nalepí jemné nečistoty. V usazovací nádrži vločky klesnou ke dnu jako kal. Pískový filtr zachytí zbylé jemné částice. Dezinfekce chlorem, ozonem nebo UV zářením zničí bakterie a viry. Pitná voda se čerpá do vodojemu a odtud teče do domů."
    >
      <Wide />
      <Narrow />
    </Board>
  )
}
