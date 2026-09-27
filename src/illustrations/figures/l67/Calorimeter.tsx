import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { ChemText, Draw, DrawArrow, Eq, Fade, Figure, Lbl, Liquid, Pop, pat, useCompact, useFig } from './kit'

/** Coffee-cup calorimeter; (cx, oy) = centre of the cups, top of the drawing. */
function Cups({ cx, oy }: { cx: number; oy: number }) {
  const { id } = useFig()
  // outer cup and the inner cup nested in it
  const outer = `M${cx - 76} ${oy + 84} L${cx - 56} ${oy + 284} Q${cx - 55} ${oy + 290} ${cx - 48} ${oy + 290} H${cx + 48} Q${cx + 55} ${oy + 290} ${cx + 56} ${oy + 284} L${cx + 76} ${oy + 84}`
  const inner = `M${cx - 68} ${oy + 78} L${cx - 49} ${oy + 272} Q${cx - 48} ${oy + 278} ${cx - 42} ${oy + 278} H${cx + 42} Q${cx + 48} ${oy + 278} ${cx + 49} ${oy + 272} L${cx + 68} ${oy + 78}`
  const ls = oy + 150 // liquid surface
  const wall = (y: number) => 68 - ((y - (oy + 78)) / 194) * 19
  const liquid = `M${cx - wall(ls) + 2} ${ls} L${cx - 47} ${oy + 272} Q${cx - 46} ${oy + 276} ${cx - 41} ${oy + 276} H${cx + 41} Q${cx + 46} ${oy + 276} ${cx + 47} ${oy + 272} L${cx + wall(ls) - 2} ${ls}Z`
  const tx = cx + 22 // thermometer
  const sx = cx - 26 // stirrer
  return (
    <g>
      {/* cups */}
      <Pop delay={0.1}>
        <path d={`${outer}Z`} className="f67-foam" />
        <path d={`${outer}Z`} fill={pat(id, 'dots')} />
        <path d={outer} className="f67-o f67-thick" />
        <path d={`M${cx - 80} ${oy + 84} H${cx - 72} M${cx + 72} ${oy + 84} H${cx + 80}`} className="f67-o f67-thick" />
      </Pop>
      <Pop delay={0.2}>
        <path d={`${inner}Z`} className="f67-foam f67-foam-in" />
        <Liquid d={liquid} color="#6f9fd8" opacity={0.4} />
        <path d={inner} className="f67-o" />
      </Pop>
      {/* stirrer: rod + ring, moves up and down */}
      <g className="f67-stir">
        <path d={`M${sx} ${oy + 20} V${oy + 258}`} className="f67-o f67-thick" style={{ stroke: '#8d939c' }} />
        <ellipse cx={sx} cy={oy + 258} rx={18} ry={4.5} className="f67-o" style={{ stroke: '#8d939c', strokeWidth: 2.2 }} />
        <circle cx={sx} cy={oy + 14} r={6} className="f67-o" style={{ stroke: '#8d939c', strokeWidth: 2.2 }} />
      </g>
      {/* thermometer with a rising column */}
      <Pop delay={0.3}>
        <rect x={tx - 5} y={oy + 2} width={10} height={250} rx={5} className="f67-o f67-glass" />
        <circle cx={tx} cy={oy + 254} r={8} fill="#d9493b" className="f67-o" />
        {[40, 60, 80, 100, 120].map((y) => (
          <path key={y} d={`M${tx + 5} ${oy + y} h-4`} className="f67-o f67-thin" />
        ))}
      </Pop>
      <motion.rect
        x={tx - 2}
        y={oy + 36}
        width={4}
        height={218}
        fill="#d9493b"
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        variants={{ hidden: { scaleY: 0.45 }, show: { scaleY: 1, transition: { duration: 1.4, delay: 1.2, ease: ease.inOut } } }}
      />
      {/* lid with two holes */}
      <Pop delay={0.35}>
        <path
          d={`M${cx - 84} ${oy + 70} H${sx - 5} V${oy + 82} H${cx - 84}Z M${sx + 5} ${oy + 70} H${tx - 7} V${oy + 82} H${sx + 5}Z M${tx + 7} ${oy + 70} H${cx + 84} V${oy + 82} H${tx + 7}Z`}
          className="f67-o f67-foam"
        />
      </Pop>
    </g>
  )
}

const T1 = 0.22
const T2 = 0.78
/** temperature (0–1) over time (0–1): steady, fast rise after mixing, slow cooling */
function temp(t: number) {
  if (t < 0.28) return T1
  const u = Math.min(1, (t - 0.28) / 0.16)
  const rise = T1 + (T2 - T1) * (1 - Math.pow(1 - u, 3))
  return rise - Math.max(0, t - 0.44) * 0.09
}

/** Temperature–time graph with ΔT; (gx, gy) = top left, 230 × 200. */
function Graph({ gx, gy }: { gx: number; gy: number }) {
  const X0 = gx + 34
  const X1 = gx + 218
  const YB = gy + 168
  const YT = gy + 14
  const sx = (t: number) => X0 + t * (X1 - X0)
  const sy = (v: number) => YB - v * (YB - YT)
  let d = ''
  for (let i = 0; i <= 80; i++) {
    const t = 0.03 + (i / 80) * 0.94
    d += `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(temp(t)).toFixed(1)}`
  }
  const xm = sx(0.28)
  return (
    <g>
      <DrawArrow d={`M${X0} ${YB} H${X1 + 10}`} />
      <DrawArrow d={`M${X0} ${YB} V${YT - 8}`} />
      <Fade delay={0.3}>
        <text x={X0 - 8} y={YT} textAnchor="end" className="f67-lbl f67-b f67-big">
          T
        </text>
        <text x={X1 + 8} y={YB + 22} textAnchor="end" className="f67-lbl f67-b f67-big">
          t
        </text>
        <text x={X0 - 8} y={sy(T1) + 5} textAnchor="end" className="f67-lbl f67-sm">
          <ChemText text="T_{1}" />
        </text>
        <text x={X0 - 8} y={sy(T2) + 5} textAnchor="end" className="f67-lbl f67-sm">
          <ChemText text="T_{2}" />
        </text>
      </Fade>
      <Fade delay={1.6}>
        <path d={`M${X0} ${sy(T1)} H${sx(0.62)}`} className="f67-o f67-thin f67-dash" />
        <path d={`M${X0} ${sy(T2)} H${xm + 50}`} className="f67-o f67-thin f67-dash" />
        <path d={`M${xm} ${YB} V${sy(T1)}`} className="f67-o f67-thin f67-dot2" />
      </Fade>
      <Draw d={d} className="f67-curve f67-curve-2" delay={1.2} />
      <DrawArrow d={`M${xm - 14} ${sy(T1) - 3} V${sy(T2) + 3}`} tone="red" both delay={2} />
      <Fade delay={2.3}>
        <text x={xm - 20} y={(sy(T1) + sy(T2)) / 2 + 6} textAnchor="end" className="f67-lbl f67-b f67-big f67-red-t">
          ΔT
        </text>
        <text x={xm} y={YB + 20} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          smíchání
        </text>
      </Fade>
    </g>
  )
}

function Formula({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <Pop delay={2.4}>
      <rect x={x} y={y} width={w} height={96} rx={6} className="f67-tag-lvl" />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" className="f67-cap f67-lvl-t">
        teplo předané roztoku
      </text>
      <Eq x={x + w / 2} y={y + 48} t="q = m · c · ΔT" anchor="middle" className="f67-eq-lg f67-eq-xl" />
      <text x={x + w / 2} y={y + 68} textAnchor="middle" className="f67-lbl f67-sm">
        m = hmotnost roztoku
      </text>
      <text x={x + w / 2} y={y + 86} textAnchor="middle" className="f67-lbl f67-sm">
        c = 4,18 J/(g·K) pro vodu
      </text>
    </Pop>
  )
}

export default function Calorimeter() {
  const compact = useCompact()
  const n = compact.narrow
  const cx = n ? 118 : 150
  const oy = 12
  return (
    <Figure
      level={6}
      w={n ? 340 : 560}
      h={n ? 676 : 384}
      max={660}
      compact={compact}
      boost={false}
      label="Kalorimetr z kelímků: dva do sebe zasunuté polystyrenové kelímky s víčkem, kterým prochází teploměr a míchadlo; uvnitř je roztok, ve kterém probíhá reakce. Graf teploty v čase ukazuje, že po smíchání teplota rychle stoupne z T1 na T2, rozdíl je ΔT. Teplo předané roztoku se spočítá jako q = m · c · ΔT, kde m je hmotnost roztoku a c měrná tepelná kapacita, pro vodu 4,18 J/(g·K)."
    >
      <Cups cx={cx} oy={oy} />
      <Fade delay={0.6}>
        <Lbl x={cx - 36} y={oy + 30} tx={cx - 32} ty={oy + 14} anchor="end">
          míchadlo
        </Lbl>
        <Lbl x={cx + 36} y={oy + 20} tx={cx + 27} ty={oy + 30}>
          teploměr
        </Lbl>
        <Lbl x={cx + 96} y={oy + 62} tx={cx + 80} ty={oy + 74}>
          víčko
        </Lbl>
        <Lbl x={cx + 92} y={oy + 196} tx={cx + 40} ty={oy + 214}>
          roztok
        </Lbl>
        <text x={cx} y={oy + 316} textAnchor="middle" className="f67-lbl f67-b">
          dva polystyrenové kelímky
        </text>
        <text x={cx} y={oy + 336} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          izolují, teplo neuniká ven
        </text>
      </Fade>
      {n ? (
        <>
          <Graph gx={62} gy={370} />
          <Formula x={40} y={572} w={260} />
        </>
      ) : (
        <>
          <Graph gx={318} gy={6} />
          <Formula x={318} y={250} w={230} />
        </>
      )}
    </Figure>
  )
}
