import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Ball, CPK, Fade, Figure, Note, Pop, T, pat, usePid } from './kit'

const METAL = CPK.Cu

/** Deterministic pseudo-random numbers (stable between server and client). */
function rnd(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function Cation({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <Ball x={x} y={y} r={r} fill={METAL} />
      <text x={x} y={y + r * 0.4} textAnchor="middle" className="f35-sym" style={{ fontSize: r * 1.1, fill: '#fffaf0' }}>
        +
      </text>
    </g>
  )
}

/** Block of metal: cations in a sea of drifting electrons. */
function Sea({ x, y, cols, rows, s }: { x: number; y: number; cols: number; rows: number; s: number }) {
  const p = usePid()
  const w = cols * s
  const h = rows * s
  const electrons = []
  let n = 0
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      // one or two electrons in the gaps around each cation
      const k = 1 + (rnd(r * 13 + c) > 0.55 ? 1 : 0)
      for (let e = 0; e < k; e++) {
        const i = n++
        const ex = x + c * s + (rnd(i * 3.1) > 0.5 ? s * 0.92 : s * 0.1) + (rnd(i * 7.7) - 0.5) * s * 0.2
        const ey = y + r * s + (rnd(i * 5.3) > 0.5 ? s * 0.12 : s * 0.9) + (rnd(i * 2.9) - 0.5) * s * 0.3
        const d = (v: number) => `${((rnd(i + v) - 0.5) * s * 0.8).toFixed(1)}px`
        electrons.push(
          <circle
            key={i}
            cx={ex}
            cy={ey}
            r={3.4}
            className="f35-electron f35-drift"
            style={
              {
                '--dx1': d(1.1),
                '--dy1': d(2.2),
                '--dx2': d(3.3),
                '--dy2': d(4.4),
                '--dx3': d(5.5),
                '--dy3': d(6.6),
                animationDuration: `${(4 + rnd(i * 9.1) * 4).toFixed(2)}s`,
                animationDelay: `${(-rnd(i * 4.2) * 4).toFixed(2)}s`,
              } as CSSProperties
            }
          />,
        )
      }
    }
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} className="f35-sea" />
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} fill={pat(p, 'd')} opacity={0.6} />
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} className="f35-line" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <Pop key={`${r}-${c}`} d={0.1 + (r * cols + c) * 0.03}>
            <Cation x={x + c * s + s / 2} y={y + r * s + s / 2} r={s * 0.32} />
          </Pop>
        )),
      )}
      <Fade d={0.9}>{electrons}</Fade>
    </g>
  )
}

/** Side vignette: a hammer blow makes layers of cations slide, the metal bends but holds. */
function Hammer({ x, y }: { x: number; y: number }) {
  const p = usePid()
  const s = 22
  const r = 7
  const layer = (row: number, shift: boolean) => (
    <motion.g
      key={row}
      variants={
        shift
          ? { hidden: { x: 0 }, show: { x: s / 2, transition: { delay: 1.55, duration: 0.5, ease: ease.out } } }
          : undefined
      }
    >
      {Array.from({ length: 5 }, (_, c) => (
        <Cation key={c} x={x + 24 + c * s} y={y + 88 + row * s} r={r} />
      ))}
    </motion.g>
  )
  return (
    <g>
      <T x={x + 80} y={y + 16} className="f35-title">
        kujnost
      </T>
      {/* anvil */}
      <path
        d={`M${x + 8} ${y + 150} H${x + 150} Q${x + 150} ${y + 160} ${x + 138} ${y + 164} H${x + 118} L${x + 110} ${y + 184} H${x + 128} V${y + 194} H${x + 30} V${y + 184} H${x + 48} L${x + 40} ${y + 164} H${x + 22} Q${x - 4} ${y + 158} ${x + 8} ${y + 150}Z`}
        className="f35-fill2"
      />
      <path
        d={`M${x + 40} ${y + 164} H${x + 118} L${x + 110} ${y + 184} H${x + 48}Z`}
        fill={pat(p, 'x')}
      />
      {/* metal piece: three layers of cations in electron gas */}
      <rect x={x + 12} y={y + 76} width={134} height={72} rx={6} className="f35-sea" />
      <rect x={x + 12} y={y + 76} width={134} height={72} rx={6} className="f35-thin" />
      {layer(0, true)}
      {layer(1, true)}
      {layer(2, false)}
      {/* hammer swings in once */}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: `${x + 150}px ${y + 57}px` }}
        variants={{
          hidden: { rotate: -38 },
          show: { rotate: [-38, 6, 0], transition: { delay: 1.2, duration: 0.55, times: [0, 0.6, 1], ease: 'easeIn' } },
        }}
      >
        <rect x={x + 30} y={y + 40} width={44} height={35} rx={3} className="f35-fill2" />
        <rect x={x + 30} y={y + 40} width={44} height={35} rx={3} fill={pat(p, 'x')} />
        <rect x={x + 74} y={y + 51} width={84} height={13} rx={5} className="f35-wood" />
        <path d={`M${x + 80} ${y + 57} H${x + 152}`} className="f35-hair" />
      </motion.g>
      <Note x={x + 80} y={y + 214} anchor="middle" size={15}>
        vrstvy kationtů po sobě
      </Note>
      <Note x={x + 80} y={y + 231} anchor="middle" size={15}>
        kloužou, kov se nerozbije
      </Note>
    </g>
  )
}

export default function MetallicBond() {
  return (
    <Figure
      level={3}
      label="Kovová vazba: pravidelně uspořádané kationty kovu jsou ponořené v elektronovém plynu volně pohyblivých elektronů, které je drží pohromadě. Vedle je kujnost: po úderu kladivem vrstvy kationtů po sobě kloužou a kov se ohne, ale nerozbije."
      layouts={[
        {
          w: 580,
          h: 300,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <T x={180} y={26} className="f35-title">
                kovová vazba
              </T>
              <Sea x={34} y={56} cols={7} rows={4} s={42} />
              <Note x={34} y={262} tx={96} ty={225} size={16}>
                kationty kovu
              </Note>
              <Note x={330} y={276} anchor="end" tx={290} ty={230} size={16}>
                elektronový plyn
              </Note>
              <line x1={372} x2={372} y1={30} y2={280} className="f35-rule" />
              <Hammer x={400} y={16} />
            </>
          ),
        },
        {
          w: 360,
          h: 560,
          max: 440,
          when: 'narrow',
          draw: () => (
            <>
              <T x={180} y={26} className="f35-title">
                kovová vazba
              </T>
              <Sea x={26} y={50} cols={7} rows={4} s={44} />
              <Note x={26} y={262} tx={88} ty={222} size={16}>
                kationty kovu
              </Note>
              <Note x={334} y={284} anchor="end" tx={296} ty={228} size={16}>
                elektronový plyn
              </Note>
              <line x1={20} x2={340} y1={304} y2={304} className="f35-rule" />
              <Hammer x={100} y={316} />
            </>
          ),
        },
      ]}
    />
  )
}
