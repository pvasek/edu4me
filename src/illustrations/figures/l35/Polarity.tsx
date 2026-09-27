import { motion } from 'motion/react'
import { Atom, Bond, Fade, Figure, Pop, T, pat, usePid, vDraw, vFade } from './kit'

/** Dipole arrow: points to the δ− end, a small cross marks the δ+ tail. */
function Dipole({ x1, y1, x2, y2, delay = 0, big = false }: { x1: number; y1: number; x2: number; y2: number; delay?: number; big?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const ux = Math.cos(a)
  const uy = Math.sin(a)
  const nx = -uy
  const ny = ux
  const head = big ? 11 : 8
  const hw = head * 0.55
  const bx = x2 - ux * head
  const by = y2 - uy * head
  const cx = x1 + ux * 7
  const cy = y1 + uy * 7
  const cw = big ? 6 : 5
  return (
    <g className={big ? 'f35-dipole f35-dipole-big' : 'f35-dipole'}>
      <motion.path d={`M${x1} ${y1} L${bx + ux * 2} ${by + uy * 2}`} variants={vDraw} custom={delay} />
      <motion.path d={`M${cx + nx * cw} ${cy + ny * cw} L${cx - nx * cw} ${cy - ny * cw}`} variants={vDraw} custom={delay} />
      <motion.polygon
        points={`${x2},${y2} ${bx + nx * hw},${by + ny * hw} ${bx - nx * hw},${by - ny * hw}`}
        variants={vFade}
        custom={delay + 0.6}
      />
    </g>
  )
}

function Cloud({ d }: { d: string }) {
  const p = usePid()
  return (
    <g>
      <path d={d} className="f35-cloud" />
      <path d={d} fill={pat(p, 'd')} opacity={0.6} />
      <path d={d} className="f35-cloud-edge" />
    </g>
  )
}

const dneg = (x: number, y: number, t = 'δ−') => (
  <text x={x} y={y} className="f35-delta f35-dneg" textAnchor="middle">
    {t}
  </text>
)
const dpos = (x: number, y: number, t = 'δ+') => (
  <text x={x} y={y} className="f35-delta f35-dpos" textAnchor="middle">
    {t}
  </text>
)

function HCl({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={90} y={24} className="f35-title">
        HCl
      </T>
      <Pop d={0.1}>
        <Cloud d="M30 104 C30 86 58 76 96 74 C138 72 150 90 150 104 C150 118 138 136 96 134 C58 132 30 122 30 104Z" />
        <Bond a={[52, 104]} b={[106, 104]} ra={12} rb={22} w={4.5} />
        <Atom x={52} y={104} r={12} el="H" />
        <Atom x={106} y={104} r={22} el="Cl" />
      </Pop>
      <Fade d={0.5}>
        {dpos(46, 72)}
        {dneg(116, 66)}
      </Fade>
      <Dipole x1={44} y1={160} x2={132} y2={160} delay={0.8} big />
      <T x={90} y={196} className="f35-note">
        polární molekula
      </T>
    </g>
  )
}

function Water({ x, y }: { x: number; y: number }) {
  const O: [number, number] = [90, 88]
  const H1: [number, number] = [55, 118]
  const H2: [number, number] = [125, 118]
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={90} y={24} className="f35-title">
        H<tspan dy="0.28em" fontSize="70%">2</tspan>
        <tspan dy="-0.28em">O</tspan>
      </T>
      <Pop d={0.25}>
        <Bond a={O} b={H1} ra={18} rb={12} w={4.5} />
        <Bond a={O} b={H2} ra={18} rb={12} w={4.5} />
        <Atom x={O[0]} y={O[1]} r={18} el="O" />
        <Atom x={H1[0]} y={H1[1]} r={12} el="H" />
        <Atom x={H2[0]} y={H2[1]} r={12} el="H" />
      </Pop>
      <Fade d={0.6}>
        {dneg(90, 58, '2δ−')}
        {dpos(44, 152)}
        {dpos(136, 152)}
      </Fade>
      {/* bond dipoles point to oxygen, drawn beside each bond */}
      {[H1, H2].map((H, k) => {
        const dx = O[0] - H[0]
        const dy = O[1] - H[1]
        const L = Math.hypot(dx, dy)
        const s = k === 0 ? 1 : -1
        const nx = (dy / L) * 15 * s
        const ny = (-dx / L) * 15 * s
        const at = (t: number) => [H[0] + dx * t + nx, H[1] + dy * t + ny] as const
        const a = at(0.02)
        const b = at(0.72)
        return <Dipole key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} delay={0.9} />
      })}
      {/* their sum */}
      <Dipole x1={90} y1={174} x2={90} y2={122} delay={1.5} big />
      <T x={90} y={196} className="f35-note">
        dipóly se sečtou: polární
      </T>
    </g>
  )
}

function CO2({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <T x={90} y={24} className="f35-title">
        CO<tspan dy="0.28em" fontSize="70%">2</tspan>
      </T>
      <Pop d={0.4}>
        <Bond a={[30, 104]} b={[90, 104]} ra={16} rb={15} kind="double" w={3.6} />
        <Bond a={[90, 104]} b={[150, 104]} ra={15} rb={16} kind="double" w={3.6} />
        <Atom x={30} y={104} r={16} el="O" />
        <Atom x={90} y={104} r={15} el="C" />
        <Atom x={150} y={104} r={16} el="O" />
      </Pop>
      <Fade d={0.7}>
        {dneg(30, 76)}
        {dpos(90, 76, '2δ+')}
        {dneg(150, 76)}
      </Fade>
      <Dipole x1={84} y1={148} x2={24} y2={148} delay={1} />
      <Dipole x1={96} y1={148} x2={156} y2={148} delay={1} />
      <Pop d={1.9}>
        <text x={90} y={176} textAnchor="middle" className="f35-mono f35-b f35-lvt" style={{ fontSize: 15 }}>
          součet = 0
        </text>
      </Pop>
      <T x={90} y={196} className="f35-note">
        dipóly se vyruší: nepolární
      </T>
    </g>
  )
}

export default function Polarity() {
  return (
    <Figure
      level={3}
      label="Polarita molekul: v HCl nese vodík částečný kladný náboj δ+ a chlor δ−, dipól míří k chloru. Ve lomené molekule H2O míří oba dipóly vazeb ke kyslíku a sečtou se, voda je polární. Lineární CO2 má dva stejné opačné dipóly, které se vyruší, molekula je nepolární."
      layouts={[
        {
          w: 560,
          h: 214,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <HCl x={0} y={0} />
              <line x1={186} x2={186} y1={14} y2={200} className="f35-rule" />
              <Water x={190} y={0} />
              <line x1={376} x2={376} y1={14} y2={200} className="f35-rule" />
              <CO2 x={380} y={0} />
            </>
          ),
        },
        {
          w: 360,
          h: 432,
          max: 440,
          when: 'narrow',
          draw: () => (
            <>
              <g transform="translate(0 0) scale(1)">
                <HCl x={-2} y={0} />
              </g>
              <line x1={180} x2={180} y1={14} y2={200} className="f35-rule" />
              <Water x={180} y={0} />
              <line x1={20} x2={340} y1={214} y2={214} className="f35-rule" />
              <CO2 x={90} y={218} />
            </>
          ),
        },
      ]}
    />
  )
}
