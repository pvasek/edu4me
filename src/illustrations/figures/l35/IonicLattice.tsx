import { useRef, useState, type ReactNode } from 'react'
import { motion, useAnimationFrame, useInView, useReducedMotion } from 'motion/react'
import { spring } from '../../../ui/motion'
import { Atom, Ball, ChemText, CPK, Fade, Figure, T, boxOrigin } from './kit'

type V3 = [number, number, number]
interface Ion {
  p: V3
  na: boolean
}
const IONS: Ion[] = []
for (let i = -1; i <= 1; i++)
  for (let j = -1; j <= 1; j++)
    for (let k = -1; k <= 1; k++) IONS.push({ p: [i, j, k], na: (i + j + k + 3) % 2 === 1 })
// neighbour pairs (one step along one axis); cube edges flagged
const PAIRS: { a: number; b: number; edge: boolean }[] = []
IONS.forEach((A, a) =>
  IONS.forEach((B, b) => {
    if (b <= a) return
    const d = A.p.map((v, t) => Math.abs(v - B.p[t]))
    if (d[0] + d[1] + d[2] !== 1) return
    // an edge of the cube: the two unchanged coordinates are both ±1
    const fixed = A.p.filter((v, t) => d[t] === 0)
    PAIRS.push({ a, b, edge: fixed.every((v) => v !== 0) })
  }),
)

function project(p: V3, yaw: number, pitch: number) {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = p[0] * cy + p[2] * sy
  const z1 = -p[0] * sy + p[2] * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y2 = p[1] * cp - z1 * sp
  const z2 = p[1] * sp + z1 * cp
  const f = 6 / (6 - z2)
  return { x: x1 * f, y: -y2 * f, z: z2, f }
}

const R_CL = 0.3
const R_NA = 0.17

/** The rotating 3×3×3 NaCl cell. Drag to turn it; it turns slowly on its own when in view. */
function Lattice({ cx, cy, S }: { cx: number; cy: number; S: number }) {
  const ref = useRef<SVGGElement>(null)
  const inView = useInView(ref)
  const still = useReducedMotion()
  const [ang, setAng] = useState({ yaw: 0.62, pitch: 0.42 })
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null)
  const [hold, setHold] = useState(false)
  const frame = useRef(0)

  useAnimationFrame((_, delta) => {
    if (!inView || still || hold) return
    frame.current++
    if (frame.current % 2) return
    setAng((a) => ({ ...a, yaw: a.yaw + Math.min(delta, 50) * 0.00045 }))
  })

  const pr = IONS.map((ion) => project(ion.p, ang.yaw, ang.pitch))
  const items: { z: number; node: ReactNode }[] = []
  PAIRS.forEach(({ a, b, edge }, i) => {
    const A = pr[a]
    const B = pr[b]
    items.push({
      z: (A.z + B.z) / 2 - 0.05,
      node: (
        <line
          key={`b${i}`}
          x1={cx + A.x * S}
          y1={cy + A.y * S}
          x2={cx + B.x * S}
          y2={cy + B.y * S}
          className={edge ? 'f35-lvline' : 'f35-thin'}
          style={edge ? { strokeWidth: 2.6 } : { strokeOpacity: 0.55 }}
        />
      ),
    })
  })
  IONS.forEach((ion, i) => {
    const P = pr[i]
    const r = (ion.na ? R_NA : R_CL) * S * P.f
    const x = cx + P.x * S
    const y = cy + P.y * S
    items.push({
      z: P.z,
      node: (
        <motion.g
          key={`i${i}`}
          variants={{ hidden: { opacity: 0, scale: 0.3 }, show: { opacity: 1, scale: 1, transition: { ...spring.bouncy, delay: 0.1 + i * 0.035 } } }}
          style={boxOrigin}
        >
          <Ball x={x} y={y} r={r} fill={ion.na ? CPK.Na : CPK.Cl} light={!ion.na} />
          <text
            x={x}
            y={y + r * (ion.na ? 0.36 : 0.3)}
            textAnchor="middle"
            className="f35-sym"
            style={{ fontSize: r * (ion.na ? 1.05 : 0.95), fill: ion.na ? '#fffaf0' : '#1f2a44' }}
          >
            {ion.na ? '+' : '−'}
          </text>
        </motion.g>
      ),
    })
  })
  items.sort((p, q) => p.z - q.z)

  const box = 1.95 * S
  return (
    <g
      ref={ref}
      className="f35-grab"
      onPointerDown={(e) => {
        ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
        drag.current = { x: e.clientX, y: e.clientY, ...ang }
        setHold(true)
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d) return
        setAng({
          yaw: d.yaw + (e.clientX - d.x) * 0.012,
          pitch: Math.max(-1.1, Math.min(1.1, d.pitch + (e.clientY - d.y) * 0.008)),
        })
      }}
      onPointerUp={() => {
        drag.current = null
        setHold(false)
      }}
      onPointerCancel={() => {
        drag.current = null
        setHold(false)
      }}
    >
      <rect x={cx - box} y={cy - box} width={box * 2} height={box * 2} fill="transparent" />
      {/* floor shadow */}
      <ellipse cx={cx} cy={cy + 1.75 * S} rx={1.5 * S} ry={0.2 * S} className="f35-shadow" />
      {items.map((it) => it.node)}
    </g>
  )
}

function Legend({ x, y, compact }: { x: number; y: number; compact?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Fade d={0.9}>
        <Atom x={22} y={20} r={11} el="Na" sym={false} />
        <text x={46} y={18} className="f35-t f35-b">
          <ChemText text="Na^{+}" />
          <tspan className="f35-note" dx={6}>
            kation sodný
          </tspan>
        </text>
        <text x={46} y={36} className="f35-mono f35-small f35-muted">
          r = 102 pm
        </text>
        <Atom x={22} y={70} r={19} el="Cl" sym={false} />
        <text x={50} y={68} className="f35-t f35-b">
          <ChemText text="Cl^{−}" />
          <tspan className="f35-note" dx={6}>
            anion chloridový
          </tspan>
        </text>
        <text x={50} y={86} className="f35-mono f35-small f35-muted">
          r = 181 pm
        </text>
        <line x1={6} x2={38} y1={118} y2={118} className="f35-lvline" style={{ strokeWidth: 2.6 }} />
        <text x={46} y={123} className="f35-note">
          hrana elementární buňky
        </text>
      </Fade>
      <Fade d={1.3}>
        <Octa x={compact ? 60 : 62} y={compact ? 196 : 200} />
        <text x={compact ? 128 : 124} y={compact ? 186 : 190} className="f35-note">
          každý ion má
        </text>
        <text x={compact ? 128 : 124} y={compact ? 205 : 209} className="f35-note">
          6 sousedů s opačným
        </text>
        <text x={compact ? 128 : 124} y={compact ? 224 : 228} className="f35-note">
          nábojem
        </text>
      </Fade>
    </g>
  )
}

/** Octahedral coordination: one Na⁺ with six Cl⁻. */
function Octa({ x, y }: { x: number; y: number }) {
  const d = 34
  const pts: [number, number, number][] = [
    [0, -d, 0],
    [-d * 0.95, 4, -1],
    [d * 0.95, -4, -1],
    [-d * 0.42, d * 0.3, 1],
    [d * 0.42, -d * 0.3, -2],
    [0, d, 0],
  ]
  const back = pts.filter((p) => p[2] < 0)
  const front = pts.filter((p) => p[2] >= 0)
  const ball = (p: [number, number, number], i: number) => (
    <g key={i}>
      <line x1={x} y1={y} x2={x + p[0]} y2={y + p[1]} className="f35-thin" />
      <Ball x={x + p[0]} y={y + p[1]} r={p[2] < 0 ? 10 : 12} fill={CPK.Cl} light />
    </g>
  )
  return (
    <g>
      {back.map(ball)}
      <Ball x={x} y={y} r={8} fill={CPK.Na} />
      {front.map(ball)}
    </g>
  )
}

export default function IonicLattice() {
  return (
    <Figure
      level={3}
      label="Krystalová mřížka chloridu sodného: malé kationty Na+ a velké anionty Cl− se střídají ve všech třech směrech a tvoří krychli. Zvýrazněné hrany ohraničují elementární buňku. Každý ion je obklopen šesti ionty s opačným nábojem. Mřížkou lze otáčet tažením."
      layouts={[
        {
          w: 580,
          h: 340,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <Lattice cx={170} cy={168} S={72} />
              <T x={170} y={332} className="f35-t f35-small f35-muted">
                tažením mřížkou otočíš
              </T>
              <text x={352} y={40} className="f35-title">
                chlorid sodný <tspan className="f35-t f35-b" style={{ fontStyle: 'normal' }}>NaCl</tspan>
              </text>
              <Legend x={344} y={64} />
            </>
          ),
        },
        {
          w: 360,
          h: 610,
          max: 440,
          when: 'narrow',
          draw: () => (
            <>
              <text x={180} y={30} textAnchor="middle" className="f35-title">
                chlorid sodný <tspan className="f35-t f35-b" style={{ fontStyle: 'normal' }}>NaCl</tspan>
              </text>
              <Lattice cx={180} cy={196} S={66} />
              <T x={180} y={350} className="f35-t f35-small f35-muted">
                tažením mřížkou otočíš
              </T>
              <Legend x={40} y={372} compact />
            </>
          ),
        },
      ]}
    />
  )
}
