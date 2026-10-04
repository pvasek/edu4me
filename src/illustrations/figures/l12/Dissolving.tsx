import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { StepFilm } from '../../sequence/StepFigure'
import { Board, Frame, Lbl, Water, rng, useHatch } from './kit'

const RNA = 8.5
const RCL = 13
const GX = 44
const GY = 256
const STEP = 30

function Ion({ x, y, na }: { x: number; y: number; na: boolean }) {
  const r = na ? RNA : RCL
  return (
    <g>
      <circle className={`f12-atom ${na ? 'f12-Na' : 'f12-Cl'}`} cx={x} cy={y} r={r} />
      <path className="f12-shine" d={`M${x - r * 0.78} ${y - r * 0.2} A${r * 0.8} ${r * 0.8} 0 0 1 ${x - r * 0.2} ${y - r * 0.78}`} opacity={0.6} />
      <text className="f12-charge" x={x + r * 0.05} y={y + 0.5} style={{ fontSize: na ? 11 : 14 }}>
        {na ? '+' : '−'}
      </text>
    </g>
  )
}

/** Ion with its shell of water molecules; flies in from (fx, fy) (no flight when `still`). */
function Hydrated({ x, y, na, fx, fy, delay, still = false }: { x: number; y: number; na: boolean; fx: number; fy: number; delay: number; still?: boolean }) {
  const n = na ? 6 : 7
  const d = na ? 18.5 : 25
  const shell: ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const th = (i / n) * 360 + (na ? 10 : 0)
    const a = (th * Math.PI) / 180
    // Na+: oxygen towards the ion (H point away); Cl−: hydrogens towards the ion
    shell.push(
      <motion.g
        key={i}
        variants={still ? undefined : { hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1, transition: { delay: delay + 0.35 + i * 0.05, duration: 0.35 } } }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <Water x={x + Math.cos(a) * d} y={y + Math.sin(a) * d} rot={na ? th - 90 : th + 90} s={0.9} />
      </motion.g>,
    )
  }
  return (
    <motion.g
      variants={still ? undefined : { hidden: { x: fx - x, y: fy - y }, show: { x: 0, y: 0, transition: { delay, duration: 1, ease: ease.inOut } } }}
    >
      {shell}
      <Ion x={x} y={y} na={na} />
    </motion.g>
  )
}

/** step 1: water surrounds the crystal, 2: Na⁺ torn off, 3: Cl⁻ torn off */
function Body({ step }: { step: 1 | 2 | 3 }) {
  const h = useHatch()
  const lattice: ReactNode[] = []
  const gone = new Set(step === 1 ? [] : step === 2 ? ['5,0'] : ['5,0', '4,0'])
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const x = GX + c * STEP
      const y = GY + r * STEP
      const na = (c + r) % 2 === 1
      if (gone.has(`${c},${r}`)) lattice.push(<circle key={`${c}${r}`} className="f12-site" cx={x} cy={y} r={na ? RNA : RCL} />)
      else lattice.push(<Ion key={`${c}${r}`} x={x} y={y} na={na} />)
    }
  // free water molecules
  const rand = rng(8)
  const free: ReactNode[] = []
  const avoid = [
    [120, 300, 120],
    [300, 130, 52],
    [466, 236, 58],
    [300, 30, 1],
  ]
  let tries = 0
  const placed: [number, number][] = []
  while (free.length < 17 && tries++ < 3000) {
    const x = 40 + rand() * 530
    const y = 44 + rand() * 310
    if (avoid.some(([ax, ay, ar]) => Math.hypot(x - ax, y - ay) < ar)) continue
    if (x < 230 && y > 196) continue
    // keep label areas clear
    const boxes = [
      [336, 58, 570, 116],
      [390, 292, 600, 356],
      [400, 26, 600, 66],
    ]
    if (boxes.some(([x0, y0, x1, y1]) => x > x0 - 12 && x < x1 + 12 && y > y0 - 12 && y < y1 + 12)) continue
    if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 40)) continue
    placed.push([x, y])
    free.push(
      <g key={free.length} className="f12-jig">
        <Water x={x} y={y} rot={rand() * 360} s={0.9} />
      </g>,
    )
  }
  return (
    <>
      <rect className="f12-tank-water" x={8} y={16} width={584} height={358} rx={10} />
      <rect className="f12-hatch" x={8} y={16} width={584} height={358} rx={10} fill={h('w')} opacity={0.2} />
      {free}
      {/* waters attacking the crystal surface */}
      <Water x={GX + 3 * STEP} y={GY - 26} rot={0} s={0.9} />
      <Water x={GX + 2 * STEP} y={GY - 30} rot={180} s={0.9} />
      <Water x={GX + 6 * STEP - 4} y={GY + STEP + 2} rot={-90} s={0.9} />
      <g>{lattice}</g>
      {step >= 2 && <Hydrated x={300} y={130} na fx={GX + 5 * STEP} fy={GY} delay={0.2} still={step === 3} />}
      {step === 3 && <Hydrated x={466} y={236} na={false} fx={GX + 4 * STEP} fy={GY} delay={0.2} />}

      <Lbl x={44} y={214} tx={GX + STEP} ty={GY - 8} className="f12-lab-strong" delay={0.1}>
        krystal NaCl
      </Lbl>
      {step >= 2 && (
        <Lbl x={346} y={82} tx={312} ty={116} className="f12-lab-strong" delay={step === 2 ? 0.9 : 0} line2="kyslíkem k iontu" line2Sec>
          Na⁺ obalený vodou
        </Lbl>
      )}
      {step === 3 && (
        <Lbl x={586} y={318} tx={480} ty={262} anchor="end" className="f12-lab-strong" delay={0.9} line2="vodíky k iontu" line2Sec>
          Cl⁻ obalený vodou
        </Lbl>
      )}
      <Lbl x={586} y={50} anchor="end" delay={0.2} sec>
        molekula vody H₂O
      </Lbl>
    </>
  )
}

const LABEL =
  'Rozpouštění kuchyňské soli ve vodě: molekuly vody obklopují ionty na povrchu krystalu chloridu sodného a odtrhávají je. K sodnému kationtu Na⁺ se molekuly vody natočí kyslíkem, k chloridovému aniontu Cl⁻ vodíky. Obalené ionty se rozptýlí v roztoku.'

export default function Dissolving() {
  return (
    <Board level={1} max={640} label={LABEL} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: 'Voda obklopí krystal',
            caption: 'Molekuly vody narážejí do iontů na povrchu krystalu soli.',
            art: (
              <Frame w={600} h={390}>
                <Body step={1} />
              </Frame>
            ),
          },
          {
            title: 'Odtrhne se Na⁺',
            caption: 'Molekuly vody odtrhnou sodný kation a obklopí ho kyslíkem.',
            art: (
              <Frame w={600} h={390}>
                <Body step={2} />
              </Frame>
            ),
          },
          {
            title: 'Odtrhne se Cl⁻',
            caption: 'K chloridovému aniontu se molekuly vody natočí vodíky. Obalené ionty se rozptýlí v roztoku.',
            art: (
              <Frame w={600} h={390}>
                <Body step={3} />
              </Frame>
            ),
          },
        ]}
      />
    </Board>
  )
}
