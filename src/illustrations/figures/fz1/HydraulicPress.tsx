import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Arrow, Fade, Figure, Pop, Val, pat, useCompact, useFig } from './kit'

const D1 = 44 // small piston travel (svg units)
const T = { duration: 1.2, delay: 0.5, ease: ease.inOut }

interface L {
  w: number
  h: number
  a0: number // small cylinder inner left
  a1: number // small cylinder inner right
  b0: number
  b1: number
  top: number // cylinder tops
  p1: number // small piston y at rest (before)
  p2: number // large piston y (before)
  base: number // channel top
}

function Press({ l }: { l: L }) {
  const { id } = useFig()
  const { a0, a1, b0, b1, top, p1, p2, base } = l
  const d2 = (D1 * (a1 - a0)) / (b1 - b0) // same volume of oil moves across
  const outline = `M${a0} ${top} V${base + 36} H${b1} V${top} M${a1} ${top} V${base} H${b0} V${top}`
  const oil = (y1: number, y2: number) => `M${a0} ${y1} H${a1} V${base} H${b0} V${y2} H${b1} V${base + 36} H${a0}Z`
  return (
    <g>
      {/* oil: its top follows the pistons */}
      <motion.path
        className="fz1-oil"
        variants={{ hidden: { d: oil(p1, p2) }, show: { d: oil(p1 + D1, p2 - d2), transition: T } }}
      />
      <motion.path
        fill={pat(id, 'h')}
        variants={{ hidden: { d: oil(p1, p2) }, show: { d: oil(p1 + D1, p2 - d2), transition: T } }}
      />
      <path d={outline} className="fz1-o fz1-wall" />

      {/* small piston pushed down */}
      <motion.g variants={{ hidden: { y: 0 }, show: { y: D1, transition: T } }}>
        <rect x={a0 + 1} y={p1 - 12} width={a1 - a0 - 2} height={12} className="fz1-o fz1-metal" />
        <rect x={(a0 + a1) / 2 - 3} y={p1 - 56} width={6} height={44} className="fz1-o fz1-metal" />
        <Arrow d={`M${(a0 + a1) / 2} ${p1 - 100} V${p1 - 62}`} tone="red" className="fz1-wide" />
        <Val x={(a0 + a1) / 2 + 10} y={p1 - 82} t="F_{1}" className="fz1-red-t fz1-val-lg" />
      </motion.g>
      {/* large piston with the load rises */}
      <motion.g variants={{ hidden: { y: 0 }, show: { y: -d2, transition: T } }}>
        <rect x={b0 + 1} y={p2 - 16} width={b1 - b0 - 2} height={16} className="fz1-o fz1-metal" />
        <rect x={b0 + 1} y={p2 - 16} width={b1 - b0 - 2} height={16} fill={pat(id, 'd')} opacity={0.4} />
        <path d={`M${b0 + 12} ${p2 - 16} V${p2 - 40} H${b1 - 12} V${p2 - 16}`} className="fz1-o fz1-lvlsoft-f" />
        <path d={`M${b0 + 22} ${p2 - 40} L${b0 + 34} ${p2 - 62} H${b1 - 30} L${b1 - 18} ${p2 - 40}`} className="fz1-o fz1-lvlsoft-f" />
        <circle cx={b0 + 30} cy={p2 - 16} r={9} className="fz1-o fz1-fill2" />
        <circle cx={b1 - 30} cy={p2 - 16} r={9} className="fz1-o fz1-fill2" />
      </motion.g>
      <Arrow d={`M${b1 + 26} ${p2 - 4} V${p2 - 64}`} tone="green" className="fz1-wide" />
      <Val x={b1 + 34} y={p2 - 34} t="F_{2}" className="fz1-green-t fz1-val-lg" />

      {/* Pascal: the same pressure in every direction */}
      <Fade delay={1.6}>
        {[
          [(a1 + b0) / 2 + 30, base + 18, 0],
          [(a1 + b0) / 2 + 30, base + 18, 180],
          [(a1 + b0) / 2 + 30, base + 18, 90],
          [(b0 + b1) / 2, base - 40, 0],
          [(b0 + b1) / 2, base - 40, 180],
          [(b0 + b1) / 2, base - 40, -90],
        ].map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <Arrow d="M4 0 H18" tone="blue" />
          </g>
        ))}
      </Fade>
    </g>
  )
}

export default function HydraulicPress() {
  const compact = useCompact()
  const n = compact.narrow
  const l: L = n
    ? { w: 360, h: 444, a0: 44, a1: 72, b0: 176, b1: 296, top: 100, p1: 120, p2: 160, base: 240 }
    : { w: 620, h: 336, a0: 86, a1: 116, b0: 240, b1: 380, top: 86, p1: 106, p2: 146, base: 226 }
  const bx = n ? 20 : 446 // formula box
  const bw = n ? 320 : 164
  const fx = bx + bw / 2
  const fy = n ? 332 : 50
  return (
    <Figure
      w={l.w}
      h={l.h}
      max={n ? 420 : 660}
      compact={compact}
      boost={false}
      replay
      label="Hydraulický lis. Dva válce různého průřezu jsou spojené a naplněné olejem. Malou silou F1 zatlačíme na malý píst o obsahu S1; tlak p = F1/S1 se v kapalině šíří všemi směry stejně (Pascalův zákon) a působí i na velký píst o obsahu S2, který zvedne auto velkou silou F2. Platí F1/S1 = F2/S2. Například 100 N na pístu 5 cm² dá 2 000 N na pístu 100 cm². Malý píst ale musí urazit mnohem delší dráhu, než o kolik se zvedne velký."
    >
      <Press l={l} />
      <Fade delay={0.2}>
        <text x={(l.a0 + l.a1) / 2} y={l.base + 72} textAnchor="middle" className="fz1-lbl fz1-sm">
          malý píst <tspan className="fz1-val fz1-val-sm">S₁</tspan>
        </text>
        <text x={(l.b0 + l.b1) / 2} y={l.base + 72} textAnchor="middle" className="fz1-lbl fz1-sm">
          velký píst <tspan className="fz1-val fz1-val-sm">S₂</tspan>
        </text>
        <text x={l.a1 + 8} y={l.base + 24} className="fz1-lbl fz1-sm fz1-b fz1-halo">
          olej
        </text>
      </Fade>
      <Pop delay={1.8}>
        <rect x={bx} y={fy} width={bw} height={n ? 104 : 150} rx={6} className="fz1-tag-lvl" />
        {n ? (
          <>
            <text x={fx} y={fy + 22} textAnchor="middle" className="fz1-cap fz1-lvl-t">
              Pascalův zákon · stejný tlak
            </text>
            <Val x={fx} y={fy + 50} t="p = F_{1} / S_{1} = F_{2} / S_{2}" anchor="middle" className="fz1-val-lg" />
            <text x={fx} y={fy + 80} textAnchor="middle" className="fz1-lbl fz1-sm">
              100 N na 5 cm² → 2 000 N na 100 cm²
            </text>
          </>
        ) : (
          <>
            <text x={fx} y={fy + 24} textAnchor="middle" className="fz1-cap fz1-lvl-t">
              Pascalův zákon
            </text>
            <Val x={fx} y={fy + 54} t="F_{1} / S_{1} = F_{2} / S_{2}" anchor="middle" className="fz1-val-lg" />
            <text x={fx} y={fy + 84} textAnchor="middle" className="fz1-lbl fz1-sm">
              100 N na 5 cm²
            </text>
            <text x={fx} y={fy + 104} textAnchor="middle" className="fz1-lbl fz1-sm">
              ↓
            </text>
            <text x={fx} y={fy + 126} textAnchor="middle" className="fz1-lbl fz1-sm fz1-b">
              2 000 N na 100 cm²
            </text>
          </>
        )}
      </Pop>
    </Figure>
  )
}
