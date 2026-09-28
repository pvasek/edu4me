import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Draw, Fade, Hx, Lbl, Plate, Pop, useHatch } from './kit'

const CX = 260
const CY = 190
const RR = 120
const SRC = 84 // right edge of the lead block

type Pt = readonly [number, number]
const onRing = (deg: number): Pt => [CX + RR * Math.cos((deg * Math.PI) / 180), CY + RR * Math.sin((deg * Math.PI) / 180)]

/** Trajectories: source → foil → screen. */
const PATHS: { pts: Pt[]; kind: 'straight' | 'bent' | 'back' }[] = [
  ...[-5, -2, 1, 4].map((o) => ({ pts: [[SRC, CY + o], [CX, CY + o], [CX + Math.sqrt(RR * RR - o * o), CY + o]] as Pt[], kind: 'straight' as const })),
  { pts: [[SRC, CY - 1], [CX, CY - 1], onRing(-35)], kind: 'bent' },
  { pts: [[SRC, CY + 2], [CX, CY + 2], onRing(22)], kind: 'bent' },
  { pts: [[SRC, CY + 3], [CX, CY + 3], onRing(68)], kind: 'bent' },
  { pts: [[SRC, CY - 3], [CX, CY - 3], onRing(205)], kind: 'back' },
]

const d = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

function Particles() {
  const ref = useRef<SVGGElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  // most particles go straight: repeat the straight paths more often
  const runs = [0, 1, 2, 3, 0, 2, 4, 1, 3, 5, 0, 2, 6, 1, 3, 7]
  return (
    <g ref={ref}>
      {!reduce &&
        inView &&
        runs.map((pi, k) => {
          const p = PATHS[pi]
          const len1 = Math.hypot(p.pts[1][0] - p.pts[0][0], p.pts[1][1] - p.pts[0][1])
          const len2 = Math.hypot(p.pts[2][0] - p.pts[1][0], p.pts[2][1] - p.pts[1][1])
          const t1 = len1 / (len1 + len2)
          const dur = (len1 + len2) / 190
          const cycle = 5.2
          const common = { duration: dur, delay: k * (cycle / runs.length), repeat: Infinity, repeatDelay: cycle - dur, ease: 'linear' as const }
          const end = p.pts[2]
          return (
            <g key={k}>
              <motion.circle
                className="f12-alpha"
                r={3.6}
                cx={0}
                cy={0}
                initial={{ x: p.pts[0][0], y: p.pts[0][1], opacity: 0 }}
                animate={{ x: p.pts.map((q) => q[0]), y: p.pts.map((q) => q[1]), opacity: [1, 1, 0] }}
                transition={{ ...common, times: [0, t1, 1] }}
              />
              <motion.circle
                className="f12-flash"
                cx={end[0]}
                cy={end[1]}
                r={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 0] }}
                transition={{ ...common, duration: dur + 0.5, repeatDelay: cycle - dur - 0.5, times: [0, dur / (dur + 0.5), (dur + 0.1) / (dur + 0.5), 1] }}
              />
            </g>
          )
        })}
    </g>
  )
}

function Inset() {
  const atoms: ReactNode[] = []
  const cols = [470, 520, 570]
  const rows = [296, 340, 384, 428]
  for (const x of cols)
    for (const y of rows)
      atoms.push(
        <g key={`${x}${y}`}>
          <circle className="f12-au-atom" cx={x} cy={y} r={21} />
          <circle className="f12-au-nuc" cx={x} cy={y} r={2.6} />
        </g>,
      )
  return (
    <g>
      <rect className="f12-inset-plain" x={404} y={250} width={228} height={206} rx={6} />
      <g>{atoms}</g>
      <Draw d="M404 318 L632 318" className="f12-trail" delay={0.96} dur={0.7} />
      <Draw d="M404 362 L632 362" className="f12-trail" delay={1.04} dur={0.7} />
      <Draw d="M404 406 L632 406" className="f12-trail" delay={1.12} dur={0.7} />
      <Draw d="M404 336 L508 336 Q520 334 534 322 L630 262" className="f12-trail f12-trail-hot" delay={1.28} dur={0.8} />
      <Draw d="M404 426 L512 426 Q516 427 512 430 L404 444" className="f12-trail f12-trail-hot" delay={1.44} dur={0.9} />
      <text className="f12-t f12-t-strong" x={418} y={274}>
        fólie zblízka
      </text>
      <Lbl x={626} y={448} tx={571} ty={429} anchor="end" delay={1.6} sec>
        jádro
      </Lbl>
    </g>
  )
}

function Body() {
  const h = useHatch()
  return (
    <>
      {/* detector screen: a ring with a gap for the beam */}
      <Draw d={`M${onRing(-172)[0]} ${onRing(-172)[1]} A${RR} ${RR} 0 1 1 ${onRing(172)[0]} ${onRing(172)[1]}`} className="f12-screen" dur={1.4} />
      <path className="f12-thin" d={`M${CX - RR - 7} ${CY - 17} A${RR + 7} ${RR + 7} 0 1 1 ${CX - RR - 7} ${CY + 17}`} fill="none" />

      {/* static trails */}
      <Fade delay={0.72}>
        {PATHS.map((p, i) => (
          <path key={i} className={`f12-trail ${p.kind !== 'straight' ? 'f12-trail-hot' : ''}`} d={d(p.pts)} />
        ))}
      </Fade>

      {/* lead block with radium */}
      <Hx d={`M12 158 L${SRC} 158 L${SRC} 186 L50 186 L50 194 L${SRC} 194 L${SRC} 222 L12 222 Z`} kind="x" tone="var(--f12-metal-2)" />
      <circle className="f12-radium" cx={46} cy={190} r={5} />

      {/* gold foil */}
      <rect className="f12-gold" x={CX - 2.5} y={CY - 52} width={5} height={104} />
      <rect className="f12-hatch" x={CX - 2.5} y={CY - 52} width={5} height={104} fill={h('d')} />
      <Pop delay={0.48}>
        <circle className="f12-zoom" cx={CX} cy={CY + 34} r={14} />
      </Pop>
      <Draw d={`M${CX + 12} ${CY + 42} L404 262`} className="f12-thin f12-dash" delay={0.8} dur={0.6} />

      <Particles />
      <Inset />

      <Lbl x={48} y={250} anchor="middle" delay={0.24} line2="(radium)" line2Sec>
        zdroj α
      </Lbl>
      <Lbl x={CX} y={40} tx={CX} ty={CY - 54} anchor="middle" className="f12-lab-strong" delay={0.4}>
        zlatá fólie
      </Lbl>
      <Lbl x={390} y={176} tx={CX + RR - 2} ty={CY + 1} className="f12-lab-strong" delay={1.12}>
        většina proletí
      </Lbl>
      <Lbl x={390} y={98} tx={onRing(-35)[0] + 2} ty={onRing(-35)[1]} delay={1.28}>
        některé se odchýlí
      </Lbl>
      <Lbl x={14} y={70} tx={onRing(205)[0]} ty={onRing(205)[1]} delay={1.44} line2="odrazí zpět">
        vzácně se
      </Lbl>
      <Lbl x={214} y={352} tx={onRing(110)[0]} ty={onRing(110)[1] + 4} anchor="end" delay={0.96} line2="se záblesky" line2Sec>
        stínítko
      </Lbl>
    </>
  )
}

export default function RutherfordExperiment() {
  return (
    <Plate
      level={2}
      w={640}
      h={470}
      max={660}
      label="Rutherfordův pokus: zdroj záření alfa (radium) v olověném bloku vysílá svazek částic alfa na tenkou zlatou fólii. Kolem fólie je kruhové stínítko, na kterém každá dopadající částice blikne. Většina částic fólií proletí rovně, některé se odchýlí a vzácně se některá odrazí zpět. Ve zvětšení je vidět, že atomy zlata jsou skoro prázdné a jen těsně kolem malého těžkého jádra se částice odchýlí nebo odrazí."
    >
      <Body />
    </Plate>
  )
}
