import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Arrow, Atom, Beaker, ChemText, CurveArrow, Figure, Note, Pop, T, vFade } from './kit'

type Pt = [number, number]
const pol = (c: Pt, ang: number, len: number): Pt => [c[0] + Math.cos((ang * Math.PI) / 180) * len, c[1] + Math.sin((ang * Math.PI) / 180) * len]

function Water({ at, s = 1, rot = 0 }: { at: Pt; s?: number; rot?: number }) {
  const h1 = pol(at, 90 - 52 + rot, 15 * s)
  const h2 = pol(at, 90 + 52 + rot, 15 * s)
  return (
    <g>
      <Atom x={h1[0]} y={h1[1]} r={6 * s} el="H" sym={false} />
      <Atom x={h2[0]} y={h2[1]} r={6 * s} el="H" sym={false} />
      <Atom x={at[0]} y={at[1]} r={9.5 * s} el="O" sym={false} />
    </g>
  )
}
function Ion({ at, el, r, sign }: { at: Pt; el: 'Na' | 'Cl'; r: number; sign: string }) {
  return <Atom x={at[0]} y={at[1]} r={r} el={el} charge={sign} />
}
function Hydronium({ at }: { at: Pt }) {
  const hs = [pol(at, -90, 15), pol(at, 30, 15), pol(at, 150, 15)]
  return (
    <g>
      {hs.map((h, i) => (
        <Atom key={i} x={h[0]} y={h[1]} r={6} el="H" sym={false} />
      ))}
      <Atom x={at[0]} y={at[1]} r={9.5} el="O" sym={false} />
      <text x={at[0] - 26} y={at[1] + 2} className="f35-t f35-b" style={{ fontSize: 14 }}>
        +
      </text>
    </g>
  )
}
function Hydroxide({ at }: { at: Pt }) {
  const h = pol(at, -35, 15)
  return (
    <g>
      <Atom x={h[0]} y={h[1]} r={6} el="H" sym={false} />
      <Atom x={at[0]} y={at[1]} r={9.5} el="O" sym={false} />
      <text x={at[0] + 14} y={at[1] + 16} className="f35-t f35-b" style={{ fontSize: 15 }}>
        −
      </text>
    </g>
  )
}

/** The beaker full of ions after mixing HCl with NaOH. */
function Scene({ x, y }: { x: number; y: number }) {
  const bx = x
  const by = y
  const inside = (dx: number, dy: number): Pt => [bx + dx, by + dy]
  return (
    <g>
      <Beaker x={bx} y={by} w={200} h={170} level={138} color="color-mix(in srgb, var(--lv) 12%, var(--surface))" opacity={1}>
        <Pop d={0.2}>
          <Ion at={inside(40, 70)} el="Na" r={10} sign="+" />
          <Ion at={inside(150, 128)} el="Na" r={10} sign="+" />
          <Ion at={inside(62, 138)} el="Cl" r={14} sign="−" />
          <Ion at={inside(160, 64)} el="Cl" r={14} sign="−" />
        </Pop>
        <Pop d={0.4}>
          <Water at={inside(110, 72)} rot={20} />
          <Water at={inside(28, 110)} rot={-30} />
          <Water at={inside(176, 100)} rot={40} />
          <Water at={inside(112, 150)} rot={-10} />
        </Pop>
        <Pop d={0.6}>
          <Hydronium at={inside(88, 110)} />
          <Hydroxide at={inside(130, 108)} />
        </Pop>
      </Beaker>
      {/* magnifier ring around the reacting pair */}
      <circle cx={bx + 108} cy={by + 110} r={32} className="f35-lens" />
    </g>
  )
}

/** Zoomed proton transfer: H₃O⁺ + OH⁻ → 2 H₂O. */
function Zoom({ x, y }: { x: number; y: number }) {
  const O1: Pt = [x + 60, y + 96]
  const O2: Pt = [x + 170, y + 96]
  const fixed1 = [pol(O1, 90 + 52, 22), pol(O1, 90 - 52, 22)]
  const oh = pol(O2, 90 + 52, 22)
  const from = pol(O1, -20, 22)
  const to = pol(O2, 90 - 52, 22)
  return (
    <g>
      <rect x={x} y={y} width={230} height={196} rx={10} className="f35-fill" />
      <rect x={x + 4} y={y + 4} width={222} height={188} rx={8} className="f35-rule" />
      <text x={x + 115} y={y + 30} textAnchor="middle" className="f35-note">
        přenos protonu <tspan className="f35-t f35-b" style={{ fontStyle: 'normal' }}><ChemText text="H^{+}" /></tspan>
      </text>
      {fixed1.map((h, i) => (
        <Atom key={i} x={h[0]} y={h[1]} r={9} el="H" sym={false} />
      ))}
      <Atom x={O1[0]} y={O1[1]} r={14} el="O" />
      <Atom x={oh[0]} y={oh[1]} r={9} el="H" sym={false} />
      <Atom x={O2[0]} y={O2[1]} r={14} el="O" />
      {/* the proton hops from H₃O⁺ to OH⁻ */}
      <motion.g
        variants={{
          hidden: { x: 0, y: 0 },
          show: { x: to[0] - from[0], y: to[1] - from[1], transition: { delay: 0.8, duration: 0.9, ease: ease.inOut } },
        }}
      >
        <Atom x={from[0]} y={from[1]} r={9} el="H" sym={false} />
      </motion.g>
      <CurveArrow x1={from[0] + 4} y1={from[1] - 16} cx={(from[0] + to[0]) / 2} cy={y + 34} x2={to[0] - 6} y2={to[1] - 14} className="f35-arrow-lv" delay={0.6} />
      {/* charges before, names after */}
      <motion.g variants={{ hidden: { opacity: 1 }, show: { opacity: 0, transition: { delay: 1.7, duration: 0.25 } } }}>
        <text x={O1[0]} y={y + 150} textAnchor="middle" className="f35-t f35-b">
          <ChemText text="H_{3}O^{+}" />
        </text>
        <text x={O2[0]} y={y + 150} textAnchor="middle" className="f35-t f35-b">
          <ChemText text="OH^{−}" />
        </text>
      </motion.g>
      <motion.g variants={vFade} custom={1.85}>
        <text x={O1[0]} y={y + 150} textAnchor="middle" className="f35-t f35-b">
          <ChemText text="H_{2}O" />
        </text>
        <text x={O2[0]} y={y + 150} textAnchor="middle" className="f35-t f35-b">
          <ChemText text="H_{2}O" />
        </text>
      </motion.g>
      <text x={x + 115} y={y + 180} textAnchor="middle" className="f35-mono f35-b f35-lvt" style={{ fontSize: 13.5 }}>
        <ChemText text="H_{3}O^{+} + OH^{−} → 2 H_{2}O" />
      </text>
    </g>
  )
}

export default function Neutralization() {
  return (
    <Figure
      level={5}
      label="Neutralizace kyseliny chlorovodíkové hydroxidem sodným v kádince: oxoniové kationty H3O+ předají proton hydroxidovým aniontům OH− a vzniknou dvě molekuly vody. Ionty Na+ a Cl− zůstávají v roztoku beze změny jako ionty-diváci. Iontová rovnice: H3O+ + OH− → 2 H2O."
      replay
      layouts={[
        {
          w: 560,
          h: 290,
          max: 680,
          when: 'wide',
          draw: () => (
            <>
              <T x={130} y={24} className="f35-t f35-b" size={15}>
                <ChemText text="HCl + NaOH → NaCl + H_{2}O" />
              </T>
              <Scene x={30} y={54} />
              <Note x={30} y={250} tx={70} ty={124} size={15}>
                <ChemText text="ionty-diváci Na^{+}, Cl^{−}" />
              </Note>
              <line x1={150} y1={134} x2={300} y2={64} className="f35-hair" />
              <line x1={150} y1={194} x2={300} y2={256} className="f35-hair" />
              <Zoom x={300} y={62} />
            </>
          ),
        },
        {
          w: 340,
          h: 520,
          max: 420,
          when: 'narrow',
          draw: () => (
            <>
              <T x={170} y={24} className="f35-t f35-b" size={15}>
                <ChemText text="HCl + NaOH → NaCl + H_{2}O" />
              </T>
              <Scene x={70} y={50} />
              <Note x={16} y={252} tx={110} ty={120} size={15}>
                <ChemText text="ionty-diváci Na^{+}, Cl^{−}" />
              </Note>
              <Arrow x1={178} y1={196} x2={178} y2={292} className="f35-arrow-lv" delay={0.4} />
              <Zoom x={55} y={300} />
            </>
          ),
        },
      ]}
    />
  )
}
