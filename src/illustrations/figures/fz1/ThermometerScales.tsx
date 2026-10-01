import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Fade, Figure, Pop, Val, useCompact } from './kit'

/** Upper (linear) part of the scale: −25 °C … 110 °C; absolute zero sits below a break. */
const y = (t: number) => (t < -100 ? 334 : 226 - t * 1.52)
const BREAK = 282
const BULB = 378

const ROWS: { name: [string, string]; c: string; k: string; f: string; t: number }[] = [
  { name: ['var', 'vody'], c: '100', k: '373,15', f: '212', t: 100 },
  { name: ['tělesná', 'teplota'], c: '37', k: '310,15', f: '98,6', t: 37 },
  { name: ['tání', 'ledu'], c: '0', k: '273,15', f: '32', t: 0 },
  { name: ['absolutní', 'nula'], c: '−273,15', k: '0', f: '−459,67', t: -273.15 },
]

function Thermo({ x, head, sub, vals, delay }: { x: number; head: string; sub: string; vals: string[]; delay: number }) {
  const zig = `M${x - 12} ${BREAK - 6} l6 -5 l6 10 l6 -10 l6 5 M${x - 12} ${BREAK + 6} l6 -5 l6 10 l6 -10 l6 5`
  return (
    <g>
      <Pop delay={delay}>
        <text x={x} y={20} textAnchor="middle" className="fz1-sym">
          {head}
        </text>
        <text x={x} y={38} textAnchor="middle" className="fz1-cap">
          {sub}
        </text>
      </Pop>
      {/* tube + bulb */}
      <path d={`M${x - 7} 58 A7 7 0 0 1 ${x + 7} 58 V${BULB - 13} A15 15 0 1 1 ${x - 7} ${BULB - 13}Z`} className="fz1-o fz1-glass" />
      <circle cx={x} cy={BULB} r={10.5} fill="#c8453a" />
      <motion.rect
        x={x - 3}
        y={y(37)}
        width={6}
        height={BULB - y(37)}
        fill="#c8453a"
        style={{ originY: 1 }}
        variants={{ hidden: { scaleY: 0.05 }, show: { scaleY: 1, transition: { duration: 1.2, delay: 0.3, ease: ease.out } } }}
      />
      {/* broken scale between −25 °C and absolute zero */}
      <path d={`M${x - 11} ${BREAK - 9} H${x + 11} V${BREAK + 9} H${x - 11}Z`} className="fz1-fill" />
      <path d={zig} className="fz1-o fz1-thin" />
      {[-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((t) => (
        <line key={t} x1={x - 7} x2={x - 2} y1={y(t)} y2={y(t)} className="fz1-tick" />
      ))}
      {ROWS.map((r, i) => (
        <g key={i}>
          <line x1={x - 9} x2={x + 9} y1={y(r.t)} y2={y(r.t)} className="fz1-o fz1-lvl-s fz1-thick" />
          <Fade delay={delay + 0.3 + i * 0.12}>
            <text x={x + 13} y={y(r.t) + 4.5} className="fz1-num fz1-num-b fz1-halo">
              {vals[i]}
            </text>
          </Fade>
        </g>
      ))}
    </g>
  )
}

export default function ThermometerScales() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 360 : 600
  const xs = n ? [100, 192, 282] : [226, 356, 486]
  return (
    <Figure
      w={w}
      h={n ? 470 : 446}
      max={n ? 420 : 640}
      compact={compact}
      boost={false}
      replay
      label="Tři teplotní stupnice vedle sebe: Celsiova ve stupních Celsia, Kelvinova v kelvinech a Fahrenheitova ve stupních Fahrenheita. Var vody: 100 °C = 373,15 K = 212 °F. Tělesná teplota: 37 °C = 310,15 K = 98,6 °F. Tání ledu: 0 °C = 273,15 K = 32 °F. Absolutní nula, nejnižší možná teplota: −273,15 °C = 0 K = −459,67 °F. Převod: T = (t + 273,15) K, kde t je teplota ve stupních Celsia."
    >
      {/* reference rows */}
      {ROWS.map((r, i) => (
        <Fade key={i} delay={0.1 + i * 0.1}>
          <line x1={n ? 4 : 20} x2={w - 8} y1={y(r.t)} y2={y(r.t)} className="fz1-row-ref" />
          {n ? (
            <>
              <text x={4} y={y(r.t) - 20} className="fz1-lbl fz1-sm fz1-b">
                {r.name[0]}
              </text>
              <text x={4} y={y(r.t) - 5} className="fz1-lbl fz1-sm fz1-b">
                {r.name[1]}
              </text>
            </>
          ) : (
            <text x={20} y={y(r.t) - 6} className="fz1-lbl fz1-b">
              {r.name.join(' ')}
            </text>
          )}
        </Fade>
      ))}
      <Thermo x={xs[0]} head="°C" sub="Celsius" vals={ROWS.map((r) => r.c)} delay={0.2} />
      <Thermo x={xs[1]} head="K" sub="Kelvin" vals={ROWS.map((r) => r.k)} delay={0.35} />
      <Thermo x={xs[2]} head="°F" sub="Fahrenheit" vals={ROWS.map((r) => r.f)} delay={0.5} />

      <Fade delay={1.4}>
        <text x={n ? 4 : 20} y={BREAK + 5} className="fz1-lbl fz1-sm fz1-muted-t">
          {n ? '(zkráceno)' : '(stupnice zkrácena)'}
        </text>
        <Val x={w / 2} y={n ? 426 : 426} t="T = (t + 273,15) K" anchor="middle" className="fz1-val-lg" />
        <text x={w / 2} y={n ? 450 : 444} textAnchor="middle" className="fz1-lbl fz1-sm">
          t je teplota ve °C, T je teplota v kelvinech
        </text>
      </Fade>
    </Figure>
  )
}
