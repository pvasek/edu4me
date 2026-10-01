import { motion } from 'motion/react'
import { StepFilm } from '../../sequence/StepFigure'
import { ease } from '../../../ui/motion'
import { Arrow, Fade, Figure, Frame, pat, useFig } from './kit'

const W = 360
const H = 300
const CX = 206
const KNOB = 64 // knob centre y
const HINGE = 196
const LEAF = 62

type Q = '+' | '−'

function Charge({ x, y, q }: { x: number; y: number; q: Q }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6.5} className={q === '+' ? 'fz1-q-plus' : 'fz1-q-minus'} />
      <text x={x} y={y + 4} textAnchor="middle" className="fz1-q-t">
        {q}
      </text>
    </g>
  )
}

function Leaf({ side, from, to }: { side: -1 | 1; from: number; to: number }) {
  return (
    <motion.g

      variants={{
        // clockwise is positive in svg: the left leaf (side −1) swings out with +angle
        hidden: { rotate: -side * from },
        show: { rotate: -side * to, transition: { duration: 0.8, delay: 0.25, ease: ease.out } },
      }}
    >
      <circle cx={CX} cy={HINGE} r={LEAF + 2} fill="none" stroke="none" />
      <path d={`M${CX + side * 2} ${HINGE} L${CX + side * 2} ${HINGE + LEAF} L${CX + side * 9} ${HINGE + LEAF - 2} L${CX + side * 8} ${HINGE + 1}Z`} fill="#e0b43a" className="fz1-o fz1-thin" />
    </motion.g>
  )
}

/** Charges beside each leaf, placed along its final angle (kept upright). */
function LeafCharges({ side, angle, qs }: { side: -1 | 1; angle: number; qs: Q[] }) {
  const a = (-side * angle * Math.PI) / 180
  return (
    <g>
      {qs.map((q, i) => {
        const dx = side * 17
        const dy = 24 + i * 18
        return <Charge key={i} x={CX + dx * Math.cos(a) - dy * Math.sin(a)} y={HINGE + dx * Math.sin(a) + dy * Math.cos(a)} q={q} />
      })}
    </g>
  )
}

interface Scene {
  rod?: number // x of the rod tip (undefined = no rod)
  rodQ?: Q[]
  knob: Q[]
  stem: Q[]
  leaves: Q[]
  from: number
  to: number
  flow?: boolean
}

function Rod({ tip, qs }: { tip: number; qs: Q[] }) {
  const { id } = useFig()
  return (
    <motion.g variants={{ hidden: { x: -40, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: ease.out } } }}>
      <rect x={4} y={KNOB - 9} width={tip - 4} height={18} rx={9} fill="#2f2f36" className="fz1-o" />
      <rect x={4} y={KNOB - 9} width={tip - 4} height={18} rx={9} fill={pat(id, 'hi')} opacity={0.35} />
      {qs.map((q, i) => (
        <Charge key={i} x={tip - 12 - i * 17} y={KNOB} q={q} />
      ))}
    </motion.g>
  )
}

function Scope({ s }: { s: Scene }) {
  const { id } = useFig()
  return (
    <g>
      {/* case with a glass window */}
      <path d={`M${CX - 78} 128 H${CX + 78} V${H - 14} H${CX - 78}Z`} className="fz1-o fz1-metal" />
      <rect x={CX - 64} y={140} width={128} height={H - 168} rx={10} className="fz1-o fz1-glass" style={{ fillOpacity: 0.9 }} />
      <rect x={CX - 64} y={140} width={128} height={H - 168} rx={10} fill={pat(id, 'hi')} opacity={0.12} />
      <path d={`M${CX - 96} ${H - 14} H${CX + 96}`} className="fz1-o fz1-thick" />
      {/* insulating plug */}
      <rect x={CX - 14} y={112} width={28} height={26} rx={3} fill="#3b3b3b" className="fz1-o" />
      {/* metal rod + knob */}
      <rect x={CX - 3} y={KNOB + 10} width={6} height={HINGE - KNOB - 8} className="fz1-o fz1-metal" />
      <circle cx={CX} cy={KNOB} r={17} className="fz1-o fz1-metal" />
      <path d={`M${CX - 8} ${KNOB - 9} A10 10 0 0 1 ${CX + 2} ${KNOB - 13}`} className="fz1-o fz1-thin fz1-glint" />
      <Leaf side={-1} from={s.from} to={s.to} />
      <Leaf side={1} from={s.from} to={s.to} />
      <Fade delay={0.55}>
        {s.knob.map((q, i) => (
          <Charge key={i} x={CX - 7 + (i % 2) * 14 - (s.knob.length === 1 ? -7 : 0)} y={KNOB - 5 + Math.floor(i / 2) * 11} q={q} />
        ))}
        {s.stem.map((q, i) => (
          <Charge key={i} x={CX} y={158 + i * 18} q={q} />
        ))}
        <LeafCharges side={-1} angle={s.to} qs={s.leaves} />
        <LeafCharges side={1} angle={s.to} qs={s.leaves} />
      </Fade>
      {s.rod !== undefined && <Rod tip={s.rod} qs={s.rodQ ?? []} />}
      {s.flow && (
        <Fade delay={0.7}>
          <Arrow d={`M${CX - 30} ${KNOB - 28} Q${CX - 12} ${KNOB - 40} ${CX + 2} ${KNOB - 24}`} tone="blue" />
          <text x={CX + 8} y={KNOB - 30} className="fz1-lbl fz1-sm fz1-b fz1-blue-t">
            elektrony
          </text>
        </Fade>
      )}
    </g>
  )
}

const SCENES: { title: string; caption: string; s: Scene; note?: string }[] = [
  {
    title: 'Nenabitý elektroskop',
    caption: 'Kladných i záporných nábojů je stejně – lístky volně visí dolů.',
    s: { knob: ['+', '−'], stem: ['−', '+'], leaves: ['+', '−'], from: 4, to: 4 },
    note: 'kovová tyčinka',
  },
  {
    title: 'Přiblížení tyče – indukce',
    caption: 'Záporná tyč odpuzuje elektrony dolů do lístků. Oba lístky jsou záporné, odpuzují se a rozevřou. Po oddálení tyče zase klesnou.',
    s: { rod: CX - 44, rodQ: ['−', '−', '−', '−'], knob: ['+', '+'], stem: [], leaves: ['−', '−'], from: 4, to: 26 },
    note: 'tyč nabitá záporně',
  },
  {
    title: 'Dotyk tyče – nabití dotykem',
    caption: 'Při dotyku přejde část elektronů z tyče na elektroskop.',
    s: { rod: CX - 16, rodQ: ['−', '−'], knob: ['−'], stem: ['−'], leaves: ['−', '−'], from: 26, to: 34, flow: true },
  },
  {
    title: 'Tyč oddálena',
    caption: 'Elektroskop zůstal nabitý záporně – lístky zůstávají rozevřené.',
    s: { knob: ['−'], stem: ['−'], leaves: ['−', '−'], from: 34, to: 30 },
    note: 'lístky se odpuzují',
  },
]

const LABEL =
  'Elektroskop ve čtyřech krocích. Nenabitý elektroskop má stejně kladných i záporných nábojů a jeho lístky visí dolů. Když přiblížíme záporně nabitou ebonitovou tyč, odpudí elektrony do lístků, lístky se nabijí souhlasně a rozevřou se; po oddálení tyče zase klesnou – to je indukce. Když se tyč kuličky dotkne, přejde část elektronů na elektroskop. Po oddálení tyče zůstane elektroskop nabitý záporně a lístky zůstanou rozevřené.'

export default function Electroscope() {
  return (
    <Figure label={LABEL} max={470} interactive boost={false}>
      <StepFilm
        label={LABEL}
        steps={SCENES.map((sc) => ({
          title: sc.title,
          caption: sc.caption,
          ms: 3800,
          art: (
            <Frame w={W} h={H}>
              <Scope s={sc.s} />
              {sc.note && (
                <Fade delay={0.6}>
                  <text x={sc.s.rod !== undefined ? 8 : CX + 26} y={sc.s.rod !== undefined ? KNOB + 36 : 100} className="fz1-lbl fz1-sm">
                    {sc.note}
                  </text>
                </Fade>
              )}
              <text x={CX + 90} y={HINGE + 30} className="fz1-lbl fz1-sm fz1-sec">
                lístky
              </text>
            </Frame>
          ),
        }))}
      />
    </Figure>
  )
}
