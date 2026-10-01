import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { DrawArrow, Fade, Figure, Liquid, Pop, Val, pat, useCompact, useFig } from './kit'

const N = 16 // units per newton on the meter scale
const S0 = 40 // y of 0 N
const TABLE = 346
const WATER = '#5b8fd0'

/** Spring balance hanging from the beam, reading `f` newtons; returns the hook y. */
function Meter({ x, f }: { x: number; f: number }) {
  const py = S0 + f * N
  const coil = Array.from({ length: 9 }, (_, i) => `L${x + (i % 2 ? 6 : -6)} ${30 + ((py - 34) / 9) * (i + 0.5)}`).join(' ')
  return (
    <g>
      <path d={`M${x} 12 V22`} className="fz1-o" />
      <rect x={x - 12} y={22} width={24} height={112} rx={4} className="fz1-o fz1-glass" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <g key={k}>
          <line x1={x + 12} x2={x + 18} y1={S0 + k * N} y2={S0 + k * N} className="fz1-tick" />
          <text x={x + 21} y={S0 + k * N + 3.5} className="fz1-scale-n" style={{ fontSize: 9.5 }}>
            {k}
          </text>
        </g>
      ))}
      <path d={`M${x} 26 L${x} 30 ${coil} L${x} ${py}`} className="fz1-spring" />
      <path d={`M${x - 9} ${py} H${x + 9}`} className="fz1-o fz1-lvl-s fz1-thick" />
      <path d={`M${x} ${py} V142`} className="fz1-o" />
      <path d={`M${x} 142 q-5 5 0 9 q5 3 6 -2`} className="fz1-o" />
    </g>
  )
}

function Body({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <path d={`M${x} 151 V${y}`} className="fz1-o fz1-thin" />
      <rect x={x - 18} y={y} width={36} height={52} rx={3} fill="#8a93a3" className="fz1-o" />
      <rect x={x - 18} y={y} width={36} height={52} rx={3} fill={pat(id, 'x')} opacity={0.4} />
    </g>
  )
}

function Scene() {
  const { id } = useFig()
  const lx = 64
  const rx = 236
  const c0 = 186
  const c1 = 286
  const spout = 212
  return (
    <g>
      {/* beam */}
      <rect x={20} y={4} width={260} height={8} rx={2} className="fz1-o fz1-wood" />
      <path d={`M${lx} 12 V22`} className="fz1-o" />

      {/* in air: 5,0 N */}
      <Meter x={lx} f={5} />
      <Body x={lx} y={180} />
      <Fade delay={0.5}>
        <text x={lx - 18} y={S0 + 5 * N + 5} textAnchor="end" className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
          5,0 N
        </text>
      </Fade>

      {/* in water: 3,0 N */}
      <Meter x={rx} f={3} />
      <Body x={rx} y={236} />
      <Fade delay={0.9}>
        <text x={rx - 18} y={S0 + 3 * N + 5} textAnchor="end" className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
          3,0 N
        </text>
      </Fade>

      {/* overflow can, full to the spout */}
      <Liquid d={`M${c0} ${spout} H${c1} V${TABLE - 2} H${c0}Z`} color={WATER} opacity={0.32} />
      <path d={`M${c0} ${spout} H${c1}`} className="fz1-o fz1-thin" />
      <path d={`M${c0} 196 V${TABLE} H${c1} V196 M${c1} ${spout - 5} L${c1 + 24} ${spout + 8} M${c1} ${spout + 3} L${c1 + 22} ${spout + 14}`} className="fz1-o fz1-thick" />
      {/* the displaced water runs into the beaker */}
      <Fade delay={0.4}>
        <path d={`M${c1 + 23} ${spout + 12} Q${c1 + 32} ${spout + 22} ${c1 + 34} 316`} className="fz1-jet" />
      </Fade>
      <path d={`M${c1 + 12} 270 V${TABLE} H${c1 + 72} V270`} className="fz1-o" />
      <motion.g
        style={{ originY: 1 }}
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.4, delay: 0.6, ease: ease.out } } }}
      >
        <Liquid d={`M${c1 + 13} 318 H${c1 + 71} V${TABLE - 1} H${c1 + 13}Z`} color={WATER} opacity={0.5} />
      </motion.g>
      <path d={`M0 ${TABLE} H${c1 + 96}`} className="fz1-o" />
      <rect x={0} y={TABLE} width={c1 + 96} height={7} fill={pat(id, 'd')} />

      {/* forces on the submerged body */}
      <DrawArrow d={`M${rx} 262 V${262 - 2 * 14}`} tone="green" delay={1.2} className="fz1-wide" />
      <DrawArrow d={`M${rx} 262 V${262 + 5 * 14}`} tone="red" delay={1.1} className="fz1-wide" />
      <Fade delay={1.4}>
        <Val x={c0 - 6} y={250} t="F_{vz} = 2,0 N" anchor="end" className="fz1-green-t" />
        <Val x={c0 - 6} y={318} t="F_{G} = 5,0 N" anchor="end" className="fz1-red-t" />
        <path d={`M${c0 - 4} 246 H${rx - 6}`} className="fz1-lead" />
        <path d={`M${c0 - 4} 314 L${rx - 6} 322`} className="fz1-lead" />
      </Fade>
      <Fade delay={1.6}>
        <text x={c1 + 44} y={TABLE + 24} textAnchor="middle" className="fz1-lbl fz1-sm">
          vytlačená voda
        </text>
        <text x={c1 + 44} y={TABLE + 42} textAnchor="middle" className="fz1-lbl fz1-sm fz1-b">
          tíha 2,0 N
        </text>
      </Fade>
      <text x={lx} y={TABLE + 26} textAnchor="middle" className="fz1-lbl fz1-b">
        ve vzduchu
      </text>
      <text x={rx} y={TABLE + 26} textAnchor="middle" className="fz1-lbl fz1-b">
        ve vodě
      </text>
    </g>
  )
}

export default function ArchimedesPrinciple() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 390 : 640
  const bx = n ? 20 : 410
  const by = n ? 404 : 110
  const bw = n ? 350 : 214
  return (
    <Figure
      w={w}
      h={n ? 482 : 400}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      replay
      label="Archimédův zákon. Kovové těleso zavěšené na siloměru ukazuje ve vzduchu 5,0 N, to je jeho tíha. Když je celé ponořené v přelivné nádobě plné vody, siloměr ukáže jen 3,0 N, protože na těleso působí vzhůru vztlaková síla. Voda, kterou těleso vytlačí, přeteče výlevkou do kádinky a její tíha je 2,0 N. Vztlaková síla F_vz = 5,0 N − 3,0 N = 2,0 N se rovná tíze vytlačené kapaliny."
    >
      <Pop delay={0}>
        <Scene />
      </Pop>
      <Pop delay={1.8}>
        <rect x={bx} y={by} width={bw} height={n ? 66 : 150} rx={6} className="fz1-tag-lvl" />
        {n ? (
          <>
            <Val x={bx + bw / 2} y={by + 27} t="F_{vz} = 5,0 N − 3,0 N = 2,0 N" anchor="middle" />
            <text x={bx + bw / 2} y={by + 52} textAnchor="middle" className="fz1-lbl fz1-sm fz1-b">
              = tíha vytlačené vody
            </text>
          </>
        ) : (
          <>
            <text x={bx + bw / 2} y={by + 26} textAnchor="middle" className="fz1-cap fz1-lvl-t">
              Archimédův zákon
            </text>
            <Val x={bx + bw / 2} y={by + 56} t="F_{vz} = 5,0 N − 3,0 N" anchor="middle" />
            <Val x={bx + bw / 2} y={by + 80} t="F_{vz} = 2,0 N" anchor="middle" className="fz1-val-lg" />
            <text x={bx + bw / 2} y={by + 108} textAnchor="middle" className="fz1-lbl fz1-sm fz1-b">
              = tíha vytlačené vody
            </text>
            <Val x={bx + bw / 2} y={by + 134} t="F_{vz} = V · ρ_{kap} · g" anchor="middle" className="fz1-val-sm" />
          </>
        )}
      </Pop>
    </Figure>
  )
}
