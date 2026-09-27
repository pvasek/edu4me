import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Board, Mini, drawV, riseV, useHatch } from './kit'

const O = [60, 64] as const

/** Teardrop lobe from the nucleus along screen angle `deg`. */
const lobe = (L: number, W: number) =>
  `M0 0 C${L * 0.2} ${-W} ${L} ${-W * 1.1} ${L} 0 C${L} ${W * 1.1} ${L * 0.2} ${W} 0 0 Z`

function Lobe({ deg, L = 44, W = 17, phase }: { deg: number; L?: number; W?: number; phase: 'a' | 'b' }) {
  const h = useHatch()
  const d = lobe(L, W)
  return (
    <g transform={`translate(${O[0]} ${O[1]}) rotate(${deg})`}>
      <path className={phase === 'a' ? 'f12-lobe-a' : 'f12-lobe-b'} d={d} />
      <path className="f12-hatch" d={`M${L * 0.35} ${W * 0.55} C${L * 0.7} ${W * 0.95} ${L} ${W * 0.9} ${L} 0 C${L} ${W * 0.5} ${L * 0.7} ${W * 0.55} ${L * 0.35} ${W * 0.55} Z`} fill={h(phase === 'a' ? 'd' : 'x')} />
      <path className="f12-shine" d={`M${L * 0.45} ${-W * 0.55} Q${L * 0.75} ${-W * 0.75} ${L * 0.88} ${-W * 0.35}`} opacity={0.7} />
    </g>
  )
}

/** Oblique axes: z up, y right, x towards the viewer (lower left). */
function Axes({ front = false }: { front?: boolean }) {
  const [x, y] = O
  if (front)
    return (
      <g className="f12-axis">
        <path d={`M${x} ${y} L${x} ${y - 52} M${x} ${y} L${x + 54} ${y} M${x} ${y} L${x - 38} ${y + 38}`} />
      </g>
    )
  return (
    <g>
      <motion.path className="f12-axis f12-axis-back" d={`M${x} ${y} L${x} ${y + 46} M${x} ${y} L${x - 50} ${y} M${x} ${y} L${x + 30} ${y - 30}`} variants={drawV(0, 0.6)} />
      <text className="f12-axis-t" x={x + 4} y={y - 48}>
        z
      </text>
      <text className="f12-axis-t" x={x + 50} y={y - 5}>
        y
      </text>
      <text className="f12-axis-t" x={x - 44} y={y + 36}>
        x
      </text>
    </g>
  )
}

function Grow({ children, delay = 0.2 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.g
      variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 160, damping: 14, delay } } }}
      style={{ transformBox: 'view-box', transformOrigin: `${O[0]}px ${O[1]}px` }}
    >
      {children}
    </motion.g>
  )
}

function S() {
  const h = useHatch()
  const [x, y] = O
  return (
    <>
      <Axes />
      <Grow>
        <circle className="f12-lobe-a" cx={x} cy={y} r={34} style={{ fillOpacity: 0.85 }} />
        <path className="f12-hatch" d={`M${x + 10} ${y + 32} A34 34 0 0 0 ${x + 32} ${y + 10} A40 40 0 0 1 ${x + 10} ${y + 32} Z`} fill={h('d')} />
        <path className="f12-hatch" d={`M${x - 20} ${y + 27} A34 34 0 0 0 ${x + 30} ${y + 16} A42 42 0 0 1 ${x - 20} ${y + 27} Z`} fill={h('d')} />
        <ellipse className="f12-equator" cx={x} cy={y} rx={34} ry={10} />
        <path className="f12-shine" d={`M${x - 24} ${y - 10} Q${x - 20} ${y - 24} ${x - 6} ${y - 28}`} />
      </Grow>
      <Axes front />
    </>
  )
}

function P({ axis }: { axis: 'x' | 'y' | 'z' }) {
  // back lobe first, then the nucleus, then the front lobe
  const back = axis === 'x' ? { deg: -45, L: 36 } : axis === 'y' ? { deg: 180, L: 44 } : { deg: 90, L: 42 }
  const front = axis === 'x' ? { deg: 135, L: 38 } : axis === 'y' ? { deg: 0, L: 44 } : { deg: -90, L: 44 }
  return (
    <>
      <Axes />
      <Grow>
        <Lobe deg={back.deg} L={back.L} phase="b" />
        <Lobe deg={front.deg} L={front.L} phase="a" />
      </Grow>
      <Axes front />
    </>
  )
}

function Dxy() {
  // four lobes in the xy plane, between the x and y axes
  return (
    <>
      <Axes />
      <Grow>
        <Lobe deg={-22.5} L={40} W={13} phase="b" />
        <Lobe deg={-112.5} L={24} W={11} phase="a" />
        <Lobe deg={157.5} L={42} W={13} phase="b" />
        <Lobe deg={67.5} L={30} W={12} phase="a" />
      </Grow>
      <Axes front />
    </>
  )
}

const ITEMS: { cap: ReactNode; plain: string; note: string; draw: () => ReactNode }[] = [
  { cap: 's', plain: 's', note: 'koule', draw: S },
  { cap: <>p<sub>x</sub></>, plain: 'p x', note: 'činka podél osy x', draw: () => <P axis="x" /> },
  { cap: <>p<sub>y</sub></>, plain: 'p y', note: 'činka podél osy y', draw: () => <P axis="y" /> },
  { cap: <>p<sub>z</sub></>, plain: 'p z', note: 'činka podél osy z', draw: () => <P axis="z" /> },
  { cap: <>d<sub>xy</sub></>, plain: 'd x y', note: 'čtyřlístek mezi osami', draw: Dxy },
]

export default function OrbitalShapes() {
  return (
    <Board
      level={2}
      max={680}
      grid="f12-orb"
      label="Tvary orbitalů na osách x, y a z: orbital s je koule, tři orbitaly p jsou činky orientované podél os x, y a z, orbital d xy je čtyřlístek se čtyřmi laloky mezi osami x a y. Barva laloků rozlišuje znaménko vlnové funkce."
      after={<p className="f12-note">Jádro je v počátku os. Dvě barvy laloků = opačná znaménka vlnové funkce.</p>}
    >
      {ITEMS.map((it) => (
        <motion.div className="f12-cell" key={it.plain} variants={riseV(0)}>
          <Mini w={120} h={124}>
            <it.draw />
          </Mini>
          <p className="f12-cap f12-cap-orb">{it.cap}</p>
          <p className="f12-note">{it.note}</p>
        </motion.div>
      ))}
    </Board>
  )
}
