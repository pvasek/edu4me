import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Fade, Figure, Pop, Val, pat, useCompact, useFig } from './kit'

const A0 = -40 // start (degrees from the vertical)
const A1 = 36 // the other side: a little lower because of friction

/** Energy shares (in % of the start energy) at A, B, C: [E_p, E_k, heat]. */
const E: [number, number, number][] = [
  [100, 0, 0],
  [0, 95, 5],
  [90, 0, 10],
]

interface L {
  w: number
  h: number
  px: number
  py: number
  len: number
  by: number // bars baseline
  bh: number // bar height for 100 %
}

function Bob({ x, y, ghost = false }: { x: number; y: number; ghost?: boolean }) {
  const { id } = useFig()
  return ghost ? (
    <circle cx={x} cy={y} r={13} className="fz1-o fz1-dash" />
  ) : (
    <g>
      <circle cx={x} cy={y} r={13} fill="#8a93a3" className="fz1-o" />
      <circle cx={x} cy={y} r={13} fill={pat(id, 'hi')} opacity={0.45} />
    </g>
  )
}

function Bars({ x, e, bh, by, delay }: { x: number; e: [number, number, number]; bh: number; by: number; delay: number }) {
  const cls = ['fz1-ep', 'fz1-ek', 'fz1-heat']
  return (
    <g>
      <path d={`M${x - 30} ${by} H${x + 30}`} className="fz1-o" />
      {e.map((v, i) => (
        <motion.rect
          key={i}
          x={x - 26 + i * 18}
          y={by - (v / 100) * bh}
          width={15}
          height={Math.max(0.01, (v / 100) * bh)}
          className={`fz1-o ${cls[i]}`}
          style={{ originY: 1 }}
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.6, delay: delay + i * 0.08, ease: ease.out } } }}
        />
      ))}
    </g>
  )
}

export default function PendulumEnergy() {
  const compact = useCompact()
  const n = compact.narrow
  const l: L = n ? { w: 360, h: 344, px: 180, py: 24, len: 150, by: 290, bh: 80 } : { w: 640, h: 416, px: 320, py: 26, len: 200, by: 372, bh: 96 }
  const pos = (deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180
    return [l.px + Math.sin(a) * l.len, l.py + Math.cos(a) * l.len]
  }
  const P = [pos(A0), pos(0), pos(A1)]
  const names = ['A', 'B', 'C']
  const lgx = n ? 20 : 150
  const lgy = n ? l.by + 34 : l.by + 36
  return (
    <Figure
      w={l.w}
      h={l.h}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      replay
      label="Kyvadlo a přeměny mechanické energie. V krajní poloze A má kulička největší polohovou energii Ep a nulovou pohybovou energii Ek. V nejnižším bodě B je polohová energie nejmenší a pohybová největší. V druhé krajní poloze C je zase jen polohová energie. Celková mechanická energie se zachovává, jen kvůli tření a odporu vzduchu se malá část mění na teplo, a proto kulička vystoupí do C o něco níž než v A a kmity pomalu slábnou."
    >
      {/* support */}
      <rect x={l.px - 40} y={l.py - 14} width={80} height={10} rx={2} className="fz1-o fz1-wood" />
      <circle cx={l.px} cy={l.py} r={3} className="fz1-o fz1-fill" />
      {/* arc of the swing */}
      <path
        d={`M${P[0][0]} ${P[0][1]} A${l.len} ${l.len} 0 0 0 ${P[2][0]} ${P[2][1]}`}
        className="fz1-o fz1-thin fz1-dot2"
      />
      {/* heights: start level vs. the lower end point */}
      <Fade delay={1.5}>
        <path d={`M${P[0][0] - 20} ${P[0][1]} H${P[2][0] + 36}`} className="fz1-row-ref" />
        <path d={`M${P[2][0] + 26} ${P[0][1]} V${P[2][1]}`} className="fz1-o fz1-bad-s" />
        <text x={P[2][0] + 34} y={P[2][1] + 2} className="fz1-lbl fz1-sm fz1-red-t">
          {n ? 'tření' : 'ztráta třením'}
        </text>
        <path d={`M${P[1][0] - 40} ${P[1][1] + 13} H${P[1][0] + 40}`} className="fz1-row-ref" />
      </Fade>
      {/* ghosts + labels */}
      {P.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${l.px} ${l.py} L${x} ${y}`} className="fz1-o fz1-thin" style={{ opacity: 0.35 }} />
          <Bob x={x} y={y} ghost />
          <Pop delay={0.2 + i * 0.5}>
            <text x={x + (i === 0 ? -20 : i === 1 ? 20 : 12)} y={y + (i === 1 ? 20 : i === 2 ? 34 : 5)} textAnchor={i === 0 ? 'end' : 'start'} className="fz1-lbl fz1-b fz1-big">
              {names[i]}
            </text>
          </Pop>
        </g>
      ))}
      {/* one swing from A to C */}
      <motion.g

        variants={{ hidden: { rotate: -A0 }, show: { rotate: -A1, transition: { duration: 1.6, delay: 0.2, ease: ease.inOut } } }}
      >
        <circle cx={l.px} cy={l.py} r={l.len + 14} fill="none" stroke="none" />
        <path d={`M${l.px} ${l.py} V${l.py + l.len}`} className="fz1-o" />
        <Bob x={l.px} y={l.py + l.len} />
      </motion.g>

      {/* energy bars under each position */}
      {P.map(([x], i) => (
        <g key={i}>
          <Bars x={x} e={E[i]} bh={l.bh} by={l.by} delay={0.3 + i * 0.5} />
          <text x={x} y={l.by + 20} textAnchor="middle" className="fz1-lbl fz1-b">
            {names[i]}
          </text>
        </g>
      ))}
      {/* legend */}
      <Fade delay={0.4}>
        {[
          ['fz1-ep', 'E_{p} polohová'],
          ['fz1-ek', 'E_{k} pohybová'],
          ['fz1-heat', 'teplo (tření)'],
        ].map(([c, t], i) => (
          <g key={c} transform={`translate(${lgx + i * (n ? 118 : 130)} ${lgy})`}>
            <rect x={0} y={-11} width={13} height={13} className={`fz1-o ${c}`} />
            <Val x={19} y={0} t={t} className="fz1-val-sm" />
          </g>
        ))}
        {!n && (
          <>
            <Val x={l.w - 16} y={56} t="E_{p} + E_{k} + teplo" anchor="end" />
            <text x={l.w - 16} y={78} textAnchor="end" className="fz1-lbl fz1-sm">
              = stále stejně
            </text>
          </>
        )}
      </Fade>
    </Figure>
  )
}
