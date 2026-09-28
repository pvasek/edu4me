import { useState } from 'react'
import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { ChemText, Eq, Fade, Figure, Liquid, Pop, Toggle, useFig } from './kit'

type Mode = 'acid' | 'base'
const PH_COL = ['#d23a2e', '#e8672c', '#f0a53a', '#e8d24a', '#8cc152', '#3aa36b', '#2f8f9d', '#3d6fd1', '#6a4fb3']
const DATA = {
  acid: { ion: 'H^{+}', water: [7, 2], buffer: [4.76, 4.67], eq: 'CH_{3}COO^{-} + H^{+} → CH_{3}COOH', water2: 'H^{+} nemá co zachytit' },
  base: { ion: 'OH^{-}', water: [7, 12], buffer: [4.76, 4.85], eq: 'CH_{3}COOH + OH^{-} → CH_{3}COO^{-} + H_{2}O', water2: 'OH^{-} nemá co zachytit' },
}
const fmt = (n: number) => n.toFixed(2).replace('.', ',')

function Meter({ c, from, to }: { c: number; from: number; to: number }) {
  const { seen, still } = useFig()
  const cy = 116
  const R = 50
  const seg = (i: number) => {
    const a0 = Math.PI + (i / PH_COL.length) * Math.PI
    const a1 = Math.PI + ((i + 1) / PH_COL.length) * Math.PI
    const p = (a: number, r: number) => `${(c + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`
    return `M${p(a0, R)} A${R} ${R} 0 0 1 ${p(a1, R)} L${p(a1, R - 9)} A${R - 9} ${R - 9} 0 0 0 ${p(a0, R - 9)}Z`
  }
  const deg = (p: number) => (p / 14) * 180
  const go = seen && !still
  return (
    <g>
      <rect x={c - 70} y={46} width={140} height={100} rx={8} className="f67-o f67-fill2" />
      {PH_COL.map((col, i) => (
        <path key={i} d={seg(i)} fill={col} className="f67-o f67-thin" />
      ))}
      <text x={c} y={cy - R - 5} textAnchor="middle" className="f67-num" style={{ fontSize: 10 }}>
        7
      </text>
      <text x={c - R - 6} y={cy + 1} textAnchor="end" className="f67-num" style={{ fontSize: 10 }}>
        0
      </text>
      <text x={c + R + 6} y={cy + 1} className="f67-num" style={{ fontSize: 10 }}>
        14
      </text>
      <motion.g
        initial={{ rotate: deg(still ? to : from) }}
        animate={{ rotate: deg(go || still ? to : from) }}
        transition={{ type: 'spring', stiffness: 60, damping: 9, delay: go ? 1.04 : 0 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {/* invisible square centred on the pivot so the rotation origin is the dial centre */}
        <rect x={c - R} y={cy - R} width={2 * R} height={2 * R} fill="none" stroke="none" />
        <path d={`M${c} ${cy - 3} L${c - R + 6} ${cy} L${c} ${cy + 3}Z`} className="f67-needle" />
      </motion.g>
      <circle cx={c} cy={cy} r={5} className="f67-o f67-fill" />
      <text x={c} y={cy + 24} textAnchor="middle" className="f67-num">
        pH {fmt(from)} → <tspan className="f67-num-b">{fmt(to)}</tspan>
      </text>
      <path d={`M${c + 46} 146 V296`} className="f67-o f67-thick" />
      <rect x={c + 42} y={288} width={8} height={18} rx={4} className="f67-o f67-glass" />
    </g>
  )
}

function Dropper({ c, ion }: { c: number; ion: string }) {
  const { seen, still } = useFig()
  const x = c - 36
  const go = seen && !still
  return (
    <g>
      <path d={`M${x - 7} 170 Q${x - 9} 150 ${x} 148 Q${x + 9} 150 ${x + 7} 170Z`} fill="#b0506f" className="f67-o" />
      <path d={`M${x - 4} 170 V206 L${x} 214 L${x + 4} 206 V170`} className="f67-o f67-glass" />
      <text x={x - 12} y={200} textAnchor="end" className="f67-lbl f67-b">
        <ChemText text={ion} />
      </text>
      <motion.path
        d={`M${x} 216 q4 6 0 9 q-4 -3 0 -9Z`}
        className="f67-drop"
        initial={{ y: 0, opacity: 0 }}
        animate={go ? { y: [0, 0, 22], opacity: [0, 1, 0] } : { y: 0, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.56, times: [0, 0.2, 1], ease: 'easeIn' }}
      />
    </g>
  )
}

function Beaker({ c }: { c: number }) {
  return (
    <g>
      <Liquid d={`M${c - 76} 236 H${c + 76} V330 Q${c + 76} 334 ${c + 72} 334 H${c - 72} Q${c - 76} 334 ${c - 76} 330Z`} color="#6f9fd8" opacity={0.25} />
      <path d={`M${c - 82} 196 L${c - 78} 200 V330 Q${c - 78} 336 ${c - 72} 336 H${c + 72} Q${c + 78} 336 ${c + 78} 330 V200 L${c + 82} 196`} className="f67-o f67-thick" />
    </g>
  )
}

/** Acetate (−) and acetic acid tokens inside the buffer; one catches the incoming ion. */
function BufferTokens({ c, mode }: { c: number; mode: Mode }) {
  const { seen, still } = useFig()
  const go = seen && !still
  const pos = [
    [c - 52, 260],
    [c - 18, 300],
    [c + 16, 256],
    [c - 50, 312],
    [c + 20, 314],
    [c - 14, 262],
  ]
  const isA = (i: number) => i % 2 === 0
  const target = mode === 'acid' ? 0 : 1
  const tp = pos[target]
  const start = [c - 36, 238]
  return (
    <g>
      {pos.map(([x, y], i) => (
        <Token key={i} x={x} y={y} a={isA(i)} swap={i === target} delay={1.6} />
      ))}
      <motion.g
        initial={{ x: start[0], y: start[1], opacity: 0 }}
        animate={go ? { x: [start[0], start[0], tp[0]], y: [start[1], start[1], tp[1]], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.72, ease: ease.inOut }}
      >
        <circle r={6} fill={mode === 'acid' ? '#d23a2e' : '#3d6fd1'} className="f67-o f67-thin" />
        <text y={3} textAnchor="middle" className="f67-e-t" style={{ fontSize: 9 }}>
          {mode === 'acid' ? '+' : '−'}
        </text>
      </motion.g>

    </g>
  )
}

function Token({ x, y, a, swap, delay }: { x: number; y: number; a: boolean; swap: boolean; delay: number }) {
  const { seen, still } = useFig()
  const done = swap && (seen || still)
  const t = { duration: 0.4, delay: still ? 0 : delay }
  const A = (
    <>
      <circle cx={x} cy={y} r={9} className="f67-lvl-f f67-o f67-thin" />
      <text x={x} y={y + 4} textAnchor="middle" className="f67-e-t" style={{ fontSize: 12 }}>
        −
      </text>
    </>
  )
  const HA = (
    <>
      <circle cx={x} cy={y} r={9} className="f67-o f67-fill" />
      <text x={x} y={y + 3.5} textAnchor="middle" className="f67-num" style={{ fontSize: 9.5, fontWeight: 700 }}>
        H
      </text>
    </>
  )
  if (!swap) return <g>{a ? A : HA}</g>
  return (
    <g>
      <motion.g initial={{ opacity: 1 }} animate={{ opacity: done ? 0 : 1 }} transition={t}>
        {a ? A : HA}
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={t}>
        {a ? HA : A}
      </motion.g>
    </g>
  )
}

function WaterIons({ c, mode }: { c: number; mode: Mode }) {
  const pts = [
    [c - 40, 262],
    [c + 8, 290],
    [c - 20, 314],
    [c + 30, 258],
    [c - 52, 300],
  ]
  return (
    <g>
      {pts.map(([x, y], i) => (
        <Pop key={i} delay={1.52 + i * 0.06}>
          <circle cx={x} cy={y} r={6} fill={mode === 'acid' ? '#d23a2e' : '#3d6fd1'} className="f67-o f67-thin" />
          <text x={x} y={y + 3} textAnchor="middle" className="f67-e-t" style={{ fontSize: 9 }}>
            {mode === 'acid' ? '+' : '−'}
          </text>
        </Pop>
      ))}
    </g>
  )
}

export default function BufferAction() {
  const [mode, setMode] = useState<Mode>('acid')
  const d = DATA[mode]
  const dw = d.water[1] - d.water[0]
  const db = d.buffer[1] - d.buffer[0]
  const sign = (n: number) => (n > 0 ? '+' : '−') + fmt(Math.abs(n)).replace(/,00$/, '')
  return (
    <Figure
      level={6}
      w={500}
      h={446}
      max={620}
      replay
      label={`Pufr v akci: do vody a do acetátového pufru přidáme stejné malé množství ${mode === 'acid' ? 'kyseliny (H+)' : 'zásady (OH−)'}. pH vody se změní z ${fmt(d.water[0])} na ${fmt(d.water[1])}, pH pufru jen z ${fmt(d.buffer[0])} na ${fmt(d.buffer[1])}, protože ${mode === 'acid' ? 'ionty H+ zachytí acetátové anionty: CH3COO− + H+ → CH3COOH' : 'ionty OH− zachytí kyselina octová: CH3COOH + OH− → CH3COO− + H2O'}.`}
      controls={
        <Toggle<Mode>
          label="Co přidáme"
          value={mode}
          onChange={setMode}
          options={[
            { id: 'acid', text: 'přidám kyselinu' },
            { id: 'base', text: 'přidám zásadu' },
          ]}
        />
      }
    >
      <g key={mode}>
        <Pop>
          <Beaker c={130} />
        </Pop>
        <Pop delay={0.08}>
          <Beaker c={370} />
        </Pop>
        <Fade delay={0.16}>
          <Meter c={130} from={d.water[0]} to={d.water[1]} />
          <Meter c={370} from={d.buffer[0]} to={d.buffer[1]} />
          <Dropper c={130} ion={d.ion} />
          <Dropper c={370} ion={d.ion} />
        </Fade>
        <WaterIons c={130} mode={mode} />
        <BufferTokens c={370} mode={mode} />

        <Fade delay={0.32}>
          <text x={130} y={32} textAnchor="middle" className="f67-lbl f67-b f67-big">
            voda
          </text>
          <text x={370} y={32} textAnchor="middle" className="f67-lbl f67-b f67-big">
            acetátový pufr
          </text>
        </Fade>
        <Fade delay={1.76}>
          <text x={130} y={362} textAnchor="middle" className="f67-lbl f67-b f67-red-t">
            ΔpH = {sign(dw)}
          </text>
          <text x={130} y={382} textAnchor="middle" className="f67-lbl f67-sm">
            <ChemText text={d.water2} />
          </text>
          <text x={370} y={362} textAnchor="middle" className="f67-lbl f67-b f67-green-t">
            ΔpH = {sign(db)}
          </text>
          <text x={370} y={382} textAnchor="middle" className="f67-lbl f67-sm">
            pH se skoro nehne
          </text>
        </Fade>
        <Pop delay={1.92}>
          <rect x={30} y={396} width={440} height={42} rx={6} className="f67-tag-lvl" />
          <Eq x={250} y={423} t={d.eq} anchor="middle" className="f67-eq-lg" />
        </Pop>
      </g>
    </Figure>
  )
}
