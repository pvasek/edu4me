import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Board, Draw, Fade, Hx, Lbl, Pop, useHatch } from './kit'

// rows of the three beams
const RA = 124
const RB = 214
const RG = 304
// source block and barriers (x)
const SRC0 = 206
const SRC1 = 244
const PAPER = 330
const AL0 = 442
const AL1 = 460
const PB0 = 546
const PB1 = 612
const TOP = 76
const BOT = 350

/** Nuclide notation: mass number over proton number, left of the symbol. */
function Nuclide({ x, y, a, z, sym }: { x: number; y: number; a: string; z: string; sym: string }) {
  return (
    <g className="f12-rp-nuc">
      <text className="f12-rp-nuc-n" x={x - 2} y={y - 11} textAnchor="end">
        {a}
      </text>
      <text className="f12-rp-nuc-n" x={x - 2} y={y + 4} textAnchor="end">
        {z}
      </text>
      <text className="f12-rp-nuc-s" x={x} y={y}>
        {sym}
      </text>
    </g>
  )
}

function Alpha({ x, y }: { x: number; y: number }) {
  const parts: [number, number, boolean][] = [
    [-5, -5, true],
    [5, -5, false],
    [-5, 5, false],
    [5, 5, true],
  ]
  return (
    <g>
      {parts.map(([dx, dy, p], i) => (
        <g key={i}>
          <circle className={p ? 'f12-proton' : 'f12-neutron'} cx={x + dx} cy={y + dy} r={5.6} />
          {p && (
            <text className="f12-charge" x={x + dx} y={y + dy + 0.5} style={{ fontSize: 8 }}>
              +
            </text>
          )}
        </g>
      ))}
    </g>
  )
}

function Beta({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle className="f12-electron" cx={x} cy={y} r={6.2} />
      <text className="f12-charge" x={x} y={y + 0.5} style={{ fontSize: 10 }}>
        −
      </text>
    </g>
  )
}

/** Sine wave from x0 to x1 around y. */
function wave(x0: number, x1: number, y: number, amp: number, len = 22) {
  let d = `M${x0} ${y}`
  for (let x = x0; x <= x1; x += 2) d += ` L${x} ${(y - Math.sin(((x - x0) / len) * Math.PI * 2) * amp).toFixed(1)}`
  return d
}

/** A small burst where a beam is stopped. */
function Stop({ x, y, delay }: { x: number; y: number; delay: number }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <Pop delay={delay}>
      <g className="f12-rp-stop">
        {rays.map((a) => {
          const r = (a * Math.PI) / 180
          return <line key={a} x1={x + Math.cos(r) * 5} y1={y + Math.sin(r) * 5} x2={x + Math.cos(r) * 11} y2={y + Math.sin(r) * 11} />
        })}
      </g>
    </Pop>
  )
}

/** One particle flying from x0 to x1 over and over, fading in and out. */
function Fly({ x0, x1, dur, delay, children }: { x0: number; x1: number; dur: number; delay: number; children: ReactNode }) {
  const loop = { duration: dur, delay, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' as const }
  return (
    <motion.g initial={{ x: x0, opacity: 0 }} animate={{ x: [x0, x1], opacity: [0, 1, 1, 0] }} transition={{ x: loop, opacity: { ...loop, times: [0, 0.1, 0.88, 1] } }}>
      {children}
    </motion.g>
  )
}

/** Particles flying along the α and β beams (only while in view, not with reduced motion). */
function Flying() {
  const ref = useRef<SVGGElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  return (
    <g ref={ref}>
      {inView && !reduce ? (
        <>
          {[0, 0.9].map((dl) => (
            <Fly key={`a${dl}`} x0={SRC1 + 10} x1={PAPER - 8} dur={1.4} delay={1.28 + dl}>
              <Alpha x={0} y={RA} />
            </Fly>
          ))}
          {[0, 0.8].map((dl) => (
            <Fly key={`b${dl}`} x0={SRC1 + 8} x1={AL0 - 8} dur={1.6} delay={1.44 + dl}>
              <Beta x={0} y={RB} />
            </Fly>
          ))}
        </>
      ) : (
        <>
          <Alpha x={SRC1 + 58} y={RA} />
          <Beta x={SRC1 + 58} y={RB} />
          <Beta x={PAPER + 56} y={RB} />
        </>
      )}
    </g>
  )
}

function Row({ y, greek, charge, cap1, cap2, delay, narrow }: { y: number; greek: string; charge: string; cap1: string; cap2: string; delay: number; narrow: boolean }) {
  const gx = narrow ? 160 : 40
  return (
    <Fade delay={delay}>
      <text className="f12-rp-greek" x={gx} y={y + 10} textAnchor="middle">
        {greek}
      </text>
      <text className="f12-rp-q" x={gx} y={y + (narrow ? 48 : 36)} textAnchor="middle">
        {charge}
      </text>
      <g className={narrow ? 'f12-rp-hide' : undefined}>
        <text className="f12-t" x={72} y={y - 2}>
          {cap1}
        </text>
        <text className="f12-small" x={72} y={y + 18}>
          {cap2}
        </text>
      </g>
    </Fade>
  )
}

function Body({ narrow }: { narrow: boolean }) {
  const h = useHatch()
  return (
    <>
      {/* source blocks (lead with a slit and a radioactive sample) */}
      {[RA, RB, RG].map((y, i) => (
        <Pop key={y} delay={0.08 + i * 0.08}>
          <Hx d={`M${SRC0} ${y - 24} H${SRC1} V${y - 5} H${SRC0 + 22} V${y + 5} H${SRC1} V${y + 24} H${SRC0}Z`} kind="x" tone="var(--f12-metal-2)" />
          <circle className="f12-radium" cx={SRC0 + 17} cy={y} r={4.5} />
        </Pop>
      ))}
      <Row y={RA} greek="α" charge="+2" cap1="jádro helia" cap2="2 p⁺ + 2 n⁰" delay={0.24} narrow={narrow} />
      <Row y={RB} greek="β" charge="−1" cap1="elektron" cap2="vyletí z jádra" delay={0.32} narrow={narrow} />
      <Row y={RG} greek="γ" charge="0" cap1="elektromagnetické" cap2="záření, bez náboje" delay={0.4} narrow={narrow} />

      {/* barriers */}
      <Pop delay={0.16}>
        <rect className="f12-rp-paper" x={PAPER} y={TOP} width={5} height={BOT - TOP} />
      </Pop>
      <Pop delay={0.24}>
        <Hx d={`M${AL0} ${TOP} H${AL1} V${BOT} H${AL0}Z`} kind="d" tone="#a3a8b3" />
      </Pop>
      <Pop delay={0.32}>
        <Hx d={`M${PB0} ${TOP} H${PB1} V${BOT} H${PB0}Z`} kind="x" tone="var(--f12-metal-2)" />
        <rect className="f12-hatch" x={PB0} y={TOP} width={PB1 - PB0} height={BOT - TOP} fill={h('s')} />
      </Pop>

      {/* beams */}
      <Draw d={`M${SRC1} ${RA} H${PAPER}`} className="f12-rp-beam f12-rp-a" delay={0.64} dur={0.5} />
      <Draw d={`M${SRC1} ${RB} H${AL0}`} className="f12-rp-beam f12-rp-b" delay={0.8} dur={0.7} />
      <Draw d={wave(SRC1, PB0, RG, 8)} className="f12-rp-wave" delay={0.96} dur={1} />
      <Draw d={wave(PB1, 664, RG, 3.2)} className="f12-rp-wave f12-rp-weak" delay={1.68} dur={0.5} />
      <Fade delay={1.76}>
        <path d={wave(SRC1, PB0, RG, 8)} className="f12-rp-wave f12-rp-glow f12-flow" />
      </Fade>
      <Stop x={PAPER - 2} y={RA} delay={1.04} />
      <Stop x={AL0 - 2} y={RB} delay={1.36} />
      <Flying />

      {/* nuclide notation above the beams */}
      <Fade delay={0.72}>
        <Nuclide x={284} y={RA - 22} a="4" z="2" sym="He" />
        <Nuclide x={290} y={RB - 22} a="0" z="−1" sym="e" />
        <Nuclide x={292} y={RG - 24} a="0" z="0" sym="γ" />
      </Fade>

      {/* barrier names */}
      <Lbl x={PAPER + 2} y={56} anchor="middle" className="f12-lab-strong" delay={0.32}>
        papír
      </Lbl>
      <Lbl x={(AL0 + AL1) / 2} y={56} anchor="middle" className="f12-lab-strong" delay={0.4}>
        hliník
      </Lbl>
      <Lbl x={(PB0 + PB1) / 2} y={56} anchor="middle" className="f12-lab-strong" delay={0.48}>
        olovo, beton
      </Lbl>
      <Lbl x={PAPER + 2} y={380} anchor="middle" delay={1.12} line2="list papíru" line2Sec>
        zastaví α
      </Lbl>
      <Lbl x={(AL0 + AL1) / 2} y={380} anchor="middle" delay={1.44} line2="několik mm" line2Sec>
        zastaví β
      </Lbl>
      <Lbl x={(PB0 + PB1) / 2} y={380} anchor="middle" delay={1.76} line2="silná vrstva" line2Sec>
        zeslabí γ
      </Lbl>
    </>
  )
}

export default function RadiationPenetration() {
  return (
    <Board
      level={2}
      max={700}
      label="Pronikavost radioaktivního záření. Záření alfa jsou jádra helia se dvěma protony a dvěma neutrony a nábojem +2; zastaví je už list papíru. Záření beta jsou elektrony s nábojem −1; projdou papírem, ale zastaví je hliníkový plech silný několik milimetrů. Záření gama je elektromagnetické záření bez náboje; projde papírem i hliníkem a silná vrstva olova nebo betonu ho jen zeslabí."
    >
      <motion.svg className="f12-svg f12-wide" viewBox="0 26 680 384" aria-hidden="true">
        <Body narrow={false} />
      </motion.svg>
      {/* narrow: the captions give way, the viewBox drops the empty left column */}
      <motion.svg className="f12-svg f12-narrow" viewBox="118 24 560 372" aria-hidden="true">
        <Body narrow />
      </motion.svg>
    </Board>
  )
}
