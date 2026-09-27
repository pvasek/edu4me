import { useReducedMotion } from 'motion/react'
import { Arrow, Draw, Fade, Lbl, Plate, Pop, useFigId, useHatch } from './kit'

const CX = 310
const CY = 214
const ORBIT = `M${CX - 262} ${CY} A262 166 0 1 1 ${CX + 262} ${CY} A262 166 0 1 1 ${CX - 262} ${CY}`

function Body() {
  const h = useHatch()
  const clip = useFigId()
  const reduce = useReducedMotion()
  const stripes = []
  for (let i = 0; i < 10; i++) stripes.push(<rect key={i} className={i % 2 ? 'f12-pitch-b' : 'f12-pitch-a'} x={160 + i * 30} y={124} width={30} height={180} />)
  const LX = 528
  const LY = 92
  return (
    <>
      {/* stands */}
      <rect className="f12-stand" x={40} y={44} width={540} height={340} rx={112} />
      <rect className="f12-hatch" x={40} y={44} width={540} height={340} rx={112} fill={h('d')} />
      <rect className="f12-thin" x={70} y={66} width={480} height={296} rx={88} />
      <rect className="f12-thin" x={100} y={88} width={420} height={252} rx={62} />
      <rect className="f12-thin" x={128} y={108} width={364} height={212} rx={38} style={{ fill: 'var(--surface)' }} />
      <Draw d="M152 44 H468 A112 112 0 0 1 580 156 V272 A112 112 0 0 1 468 384 H152 A112 112 0 0 1 40 272 V156 A112 112 0 0 1 152 44 Z" dur={1.6} />

      {/* pitch */}
      <g>{stripes}</g>
      <g className="f12-pitch-lines">
        <rect x={160} y={124} width={300} height={180} />
        <line x1={CX} y1={124} x2={CX} y2={304} />
        <circle cx={CX} cy={CY} r={27} />
        <rect x={160} y={160} width={47} height={108} />
        <rect x={413} y={160} width={47} height={108} />
        <rect x={160} y={190} width={16} height={48} />
        <rect x={444} y={190} width={16} height={48} />
      </g>

      {/* nucleus: a pinhead in the centre spot */}
      <circle className="f12-nuc-dot" cx={CX} cy={CY} r={1.6} />
      <circle className="f12-nuc-pulse" cx={CX} cy={CY} r={7} />

      {/* electrons above the stands */}
      <path className="f12-orbit" d={ORBIT} />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="f12-electron" r={5} cx={reduce ? CX + 262 * Math.cos(i * 2.1) : 0} cy={reduce ? CY + 166 * Math.sin(i * 2.1) : 0}>
          {!reduce && <animateMotion dur="14s" repeatCount="indefinite" path={ORBIT} begin={`${-i * 4.7}s`} />}
        </circle>
      ))}

      {/* magnifier on the centre spot */}
      <Draw d={`M${CX + 2} ${CY - 2} L${LX - 40} ${LY + 34} M${CX + 2} ${CY - 2} L${LX - 18} ${LY + 50}`} className="f12-thin f12-dash" delay={1.1} dur={0.6} />
      <Pop delay={1.3}>
        <defs>
          <clipPath id={clip}>
            <circle cx={LX} cy={LY} r={50} />
          </clipPath>
        </defs>
        <circle className="f12-lens-bg" cx={LX} cy={LY} r={50} />
        <g clipPath={`url(#${clip})`}>
          <rect className="f12-pitch-a" x={LX - 60} y={LY - 60} width={120} height={120} />
          <path className="f12-pitch-lines" d={`M${LX - 60} ${LY + 28} Q${LX} ${LY + 10} ${LX + 60} ${LY + 30}`} />
          {/* the pin */}
          <path className="f12-pin" d={`M${LX + 3} ${LY + 4} L${LX + 44} ${LY + 50}`} />
          <circle className="f12-pinhead" cx={LX} cy={LY} r={13} />
          <path className="f12-hatch" d={`M${LX + 4} ${LY + 12} A13 13 0 0 0 ${LX + 12} ${LY - 4} A15 15 0 0 1 ${LX + 4} ${LY + 12} Z`} fill={h('x')} />
          <path className="f12-shine" d={`M${LX - 8} ${LY - 2} A8 8 0 0 1 ${LX - 3} ${LY - 8}`} />
        </g>
        <circle className="f12-lens-ring" cx={LX} cy={LY} r={50} />
        <path className="f12-line" style={{ strokeWidth: 6 }} d={`M${LX - 36} ${LY + 36} L${LX - 56} ${LY + 56}`} />
      </Pop>
      <Lbl x={LX} y={LY + 76} anchor="middle" className="f12-lab-strong" delay={1.6} line2="špendlíková hlavička">
        jádro ≈
      </Lbl>

      <Lbl x={16} y={26} tx={96} ty={124} delay={1} line2="nad tribunami">
        elektrony až
      </Lbl>

      {/* scale bar under the pitch */}
      <Fade delay={1.5}>
        <Arrow x1={CX} y1={416} x2={160} y2={416} head={7} animate={false} />
        <Arrow x1={CX} y1={416} x2={460} y2={416} head={7} animate={false} />
        <path className="f12-thin" d="M160 408 L160 424 M460 408 L460 424" />
        <text className="f12-t f12-t-strong f12-bar-t" x={CX} y={410} textAnchor="middle">
          ≈ 100 m
        </text>
        <text className="f12-t f12-sec" x={CX} y={446} textAnchor="middle">
          jádro : atom ≈ 1 : 100 000
        </text>
      </Fade>
    </>
  )
}

export default function AtomScale() {
  return (
    <Plate
      level={2}
      w={620}
      h={456}
      max={640}
      label="Atom zvětšený na velikost fotbalového stadionu, asi 100 metrů. Jádro by bylo uprostřed hřiště velké jako špendlíková hlavička, asi 1 milimetr, a elektrony by se pohybovaly až nad tribunami. Jádro je zhruba stotisíckrát menší než atom, všechno mezi tím je prázdný prostor."
    >
      <Body />
    </Plate>
  )
}
