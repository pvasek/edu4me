import { useState } from 'react'
import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { DrawArrow, Fade, Figure, Lbl, Pop, Toggle, Val, pat, useCompact, useFig, useLive } from './kit'

type Hot = 'voda' | 'kov'

/*
 * School calorimeter in section, local coordinates: the insulating jacket spans x 0…220,
 * the lid sits at y 56…72, the jacket stands on y 280; the thermometer reaches up to y −34.
 */
const WATER = 122 // cold water level
const T = { duration: 1.3, delay: 0.7, ease: ease.inOut }

/** thermometer: tube at x = 172, bulb at y = 232; temperature → y of the column top */
const TX = 172
const tY = (t: number) => 214 - t * 2.1 // 0 °C at y 214, 100 °C at y 4
const T_COLD = 20
const T_MIX = 44

function Thermometer() {
  const col = (t: number) => `M${TX - 1.6} 226 V${tY(t)} H${TX + 1.6} V226Z`
  return (
    <g>
      <rect x={TX - 4.5} y={-34} width={9} height={262} rx={4.5} className="fz1-o fz1-glass" />
      <circle cx={TX} cy={232} r={7} className="fz1-o fz1-glass" />
      <circle cx={TX} cy={232} r={4.6} className="fz1-red-f" />
      <motion.path className="fz1-red-f" variants={{ hidden: { d: col(T_COLD) }, show: { d: col(T_MIX), transition: T } }} />
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <line key={t} x1={TX + 4.5} x2={TX + 9} y1={tY(t)} y2={tY(t)} className="fz1-tick" />
      ))}
    </g>
  )
}

/** Ring stirrer: a perforated disc on a rod, moved up and down (a few strokes when the plate is seen). */
function Stirrer() {
  const live = useLive()
  return (
    <motion.g
      animate={live ? { y: [0, -14, 0] } : undefined}
      transition={{ duration: 1.1, delay: 0.4, repeat: 3, ease: 'easeInOut' }}
    >
      <path d="M50 14 V232" className="fz1-ln" style={{ strokeWidth: 2.4 }} />
      <circle cx={50} cy={10} r={5} className="fz1-o fz1-metal" />
      <rect x={36} y={232} width={28} height={4.5} rx={1.5} className="fz1-o fz1-metal" />
    </motion.g>
  )
}

function HotBody({ hot }: { hot: Hot }) {
  const { id } = useFig()
  if (hot === 'kov')
    return (
      <g>
        {/* metal cylinder heated in boiling water, hanging on a thread */}
        <path d="M110 20 V170" className="fz1-ln fz1-thin" />
        <circle cx={110} cy={18} r={2.6} className="fz1-ln fz1-thin" />
        <rect x={90} y={170} width={40} height={64} rx={3} className="fz1-o fz1-heat" />
        <rect x={90} y={170} width={40} height={64} rx={3} fill={pat(id, 'd')} opacity={0.6} />
        <ellipse cx={110} cy={170} rx={20} ry={4} className="fz1-o fz1-heat" />
      </g>
    )
  return (
    <g>
      {/* a thin can with hot water standing in the cold water */}
      <path d="M86 112 H134 V246 H86Z" className="fz1-hotwater" />
      <path d="M86 112 H134 V246 H86Z" fill={pat(id, 'h')} />
      <path d="M84 100 V248 H136 V100" className="fz1-ln fz1-metal-s" style={{ strokeWidth: 2.4 }} />
    </g>
  )
}

/** Heat leaves the hot body into the water (wavy arrows). */
function HeatArrows({ hot }: { hot: Hot }) {
  const y = hot === 'kov' ? [184, 214] : [160, 210]
  const l = hot === 'kov' ? 86 : 80
  const r = hot === 'kov' ? 134 : 140
  return (
    <g>
      {y.map((yy, i) => (
        <g key={yy}>
          <DrawArrow d={`M${l} ${yy} q-5 -6 -10 0 t-10 0`} tone="red" delay={0.5 + i * 0.15} className="fz1-wide" />
          <DrawArrow d={`M${r} ${yy} q5 -6 10 0 t10 0`} tone="red" delay={0.5 + i * 0.15} className="fz1-wide" />
        </g>
      ))}
    </g>
  )
}

function Calorimeter({ hot }: { hot: Hot }) {
  const { id } = useFig()
  // insulating jacket: a box with an open top (even-odd: outer minus inner)
  const jacket = 'M0 72 H220 V280 H0Z M16 72 V264 H204 V72Z'
  return (
    <g>
      <path d={jacket} fillRule="evenodd" className="fz1-fill2" />
      <path d={jacket} fillRule="evenodd" fill={pat(id, 'dots')} />
      <path d={jacket} fillRule="evenodd" className="fz1-ln" />
      {/* cork feet keep the metal vessel off the jacket */}
      <rect x={50} y={250} width={16} height={14} className="fz1-o fz1-wood" />
      <rect x={154} y={250} width={16} height={14} className="fz1-o fz1-wood" />
      {/* cold water in the metal vessel */}
      <path d={`M36 ${WATER} H184 V249 H36Z`} className="fz1-water" />
      <path d={`M36 ${WATER} H184 V249 H36Z`} fill={pat(id, 'h')} />
      <path d={`M36 ${WATER} H184`} className="fz1-ln fz1-thin" />
      <HotBody hot={hot} />
      {/* thin metal vessel (aluminium) */}
      <path d="M34 76 V250 H186 V76" className="fz1-ln fz1-metal-s" style={{ strokeWidth: 3 }} />
      <HeatArrows hot={hot} />
      <Stirrer />
      <Thermometer />
      {/* insulating lid with holes for the stirrer, the thread / can and the thermometer */}
      <path d="M-6 56 H44 V72 H-6Z M56 56 H104 V72 H56Z M116 56 H166 V72 H116Z M178 56 H226 V72 H178Z" className="fz1-fill2" />
      <path d="M-6 56 H44 V72 H-6Z M56 56 H104 V72 H56Z M116 56 H166 V72 H116Z M178 56 H226 V72 H178Z" fill={pat(id, 'dots')} />
      <path d="M-6 56 H44 V72 H-6Z M56 56 H104 V72 H56Z M116 56 H166 V72 H116Z M178 56 H226 V72 H178Z" className="fz1-ln" />
      <Fade delay={1.9}>
        <Val x={TX - 8} y={tY(T_MIX) + 5} t="t" anchor="end" className="fz1-val-sm" />
      </Fade>
    </g>
  )
}

/** Temperatures before and after: the hot body cools to t, the water warms to t. */
function Balance({ hot }: { hot: Hot }) {
  const y1 = 44
  const y = 128
  const y2 = 204
  return (
    <g>
      <text x={0} y={0} className="fz1-cap">
        tepelná rovnováha
      </text>
      <DrawArrow d={`M14 ${y2 + 24} V10`} tone="ink" delay={0.1} />
      <Val x={22} y={18} t="teplota" className="fz1-val-sm fz1-muted-t" />
      <Fade delay={0.3}>
        <circle cx={14} cy={y1} r={4.5} className="fz1-red-f" />
        <Val x={28} y={y1 + 5} t={hot === 'kov' ? 't_{1} horký kov' : 't_{1} horká voda'} className="fz1-red-t" />
        <circle cx={14} cy={y2} r={4.5} className="fz1-blue-f" />
        <Val x={28} y={y2 + 5} t="t_{2} studená voda" className="fz1-blue-t" />
      </Fade>
      <DrawArrow d={`M40 ${y1 + 12} V${y - 10}`} tone="red" delay={0.9} />
      <DrawArrow d={`M40 ${y2 - 12} V${y + 10}`} tone="blue" delay={0.9} />
      <Fade delay={1.2}>
        <text x={52} y={y1 + 46} className="fz1-lbl fz1-sm">
          ochladí se, odevzdá teplo
        </text>
        <text x={52} y={y2 - 32} className="fz1-lbl fz1-sm">
          ohřeje se, přijme teplo
        </text>
      </Fade>
      <Pop delay={1.6}>
        <circle cx={14} cy={y} r={5} className="fz1-o fz1-lvl-f" />
        <Val x={28} y={y + 5} t="t výsledná teplota" className="fz1-lvl-t" />
      </Pop>
      <Pop delay={2}>
        <rect x={0} y={244} width={250} height={58} rx={6} className="fz1-tag-lvl" />
        <Val x={125} y={272} t="Q_{odevzdané} = Q_{přijaté}" anchor="middle" className="fz1-val-lg" />
        <text x={125} y={292} textAnchor="middle" className="fz1-lbl fz1-sm">
          když teplo neuniká do okolí
        </text>
      </Pop>
    </g>
  )
}

const LABEL: Record<Hot, string> = {
  voda:
    'Školní kalorimetr v řezu: tenká kovová nádoba se studenou vodou stojí na korkových podložkách v izolačním plášti a je zakrytá izolačním víčkem, kterým prochází teploměr a míchačka. Do studené vody o teplotě t2 je ponořená plechovka s horkou vodou o teplotě t1. Horká voda se ochlazuje a teplo odevzdává, studená voda se ohřívá a teplo přijímá, až mají obě stejnou výslednou teplotu t; teploměr vystoupá z 20 °C na 44 °C. Protože teplo neuniká do okolí, platí Q odevzdané = Q přijaté.',
  kov:
    'Školní kalorimetr v řezu: tenká kovová nádoba se studenou vodou stojí na korkových podložkách v izolačním plášti a je zakrytá izolačním víčkem, kterým prochází teploměr a míchačka. Do studené vody o teplotě t2 je na niti ponořený kovový váleček ohřátý na teplotu t1. Kov se ochlazuje a teplo odevzdává, voda se ohřívá a teplo přijímá, až mají obě stejnou výslednou teplotu t; teploměr vystoupá z 20 °C na 44 °C. Protože teplo neuniká do okolí, platí Q odevzdané = Q přijaté.',
}

export default function CalorimeterMixing() {
  const compact = useCompact()
  const n = compact.narrow
  const [hot, setHot] = useState<Hot>('voda')
  // wide: apparatus left, balance panel right; narrow: panel under the apparatus
  const W = n ? 400 : 740
  const H = n ? 680 : 380
  const ax = 140
  const ay = n ? 48 : 52
  const px = n ? 75 : 472
  const py = n ? 360 : 44
  const L = (x: number, y: number) => [ax + x, ay + y] as const
  const left = ax - 16
  const label = (txt: string, y: number, tx: number, ty: number, cls = '') => {
    const [gx, gy] = L(tx, ty)
    return (
      <Lbl x={left} y={ay + y} tx={gx} ty={gy} anchor="end" className={`fz1-sm ${cls}`}>
        {txt}
      </Lbl>
    )
  }
  const hotName = hot === 'kov' ? 'horký kov' : 'horká voda'
  return (
    <Figure
      w={W}
      h={H}
      max={n ? 420 : 740}
      compact={compact}
      boost={false}
      replay
      label={LABEL[hot]}
      controls={
        <Toggle
          label="Co je teplejší těleso"
          value={hot}
          onChange={setHot}
          options={[
            { id: 'voda', text: 'horká voda' },
            { id: 'kov', text: 'horký kov' },
          ]}
        />
      }
    >
      <g transform={`translate(${ax} ${ay})`}>
        <Calorimeter key={hot} hot={hot} />
      </g>
      <Fade delay={0.2}>
        {label('míchačka', 14, 45, 10)}
        {label('víčko', 62, -6, 64)}
        {label('kovová nádoba', 104, 34, 100)}
        {label('izolační plášť', 150, 8, 160)}
        {label('studená voda', 200, 66, 196, 'fz1-blue-t')}
        {n ? (
          label(hotName, 250, hot === 'kov' ? 94 : 88, hot === 'kov' ? 226 : 238, 'fz1-red-t')
        ) : (
          <Lbl x={ax + 236} y={ay + 196} tx={ax + (hot === 'kov' ? 130 : 136)} ty={ay + 200} className="fz1-sm fz1-red-t">
            {hotName}
          </Lbl>
        )}
        <text x={ax + TX - 10} y={ay - 22} textAnchor="end" className="fz1-lbl fz1-sm">
          teploměr
        </text>
      </Fade>
      <g transform={`translate(${px} ${py})`}>
        <Balance hot={hot} />
      </g>
    </Figure>
  )
}
