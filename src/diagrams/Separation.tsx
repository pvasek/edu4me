import { cloneElement, createContext, useContext, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from '../ui/motion'
import { Fallback, Hatches, Label, Svg, hatch, oneOf, useSvgId, type DiagramProps } from './util'

const HatchId = createContext('')

/** An <Svg> that also defines the engraving hatch patterns for <Hx>. */
function Sheet(p: { w: number; h: number; max: number; label: string; children: ReactNode }) {
  const id = useSvgId()
  return (
    <HatchId.Provider value={id}>
      <Svg w={p.w} h={p.h} max={p.max} label={p.label}>
        <Hatches id={id} />
        {p.children}
      </Svg>
    </HatchId.Provider>
  )
}

/** Draws a shape, then the same shape again filled with engraved hatching. */
function Hx({ children, kind = 'h' }: { children: ReactElement<{ className?: string; fill?: string }>; kind?: 'h' | 'd' | 'x' }) {
  const id = useContext(HatchId)
  return (
    <>
      {children}
      {cloneElement(children, { className: `dg-hatch${kind === 'h' ? '' : ' dg-hatch-dark'}`, fill: hatch(id, kind) })}
    </>
  )
}

const METHODS = ['filtration', 'distillation', 'chromatography', 'decantation', 'evaporation'] as const
type Method = (typeof METHODS)[number]

const ARIA: Record<Method, string> = {
  filtration:
    'Filtrace: nálevka s filtračním papírem ve stojanu, směs se nalévá do nálevky, pevné částice zůstanou na filtru a do kádinky pod ní kape čirý filtrát.',
  distillation:
    'Destilace: směs se zahřívá kahanem v destilační baňce, teploměr měří teplotu par u bočního vývodu, páry se v chladiči ochladí vodou, která teče dovnitř dole a ven nahoře, a destilát kape do předlohy.',
  chromatography:
    'Papírová chromatografie: proužek papíru se vzorky na startovní čáře je ponořen do rozpouštědla, rozpouštědlo vzlíná až k čelu a složky směsi se rozdělí na samostatné skvrny.',
  decantation:
    'Dekantace: kapalina se opatrně slévá po skleněné tyčince do druhé kádinky, usazenina zůstává na dně původní kádinky.',
  evaporation:
    'Odpařování: roztok v odpařovací misce na síťce se zahřívá kahanem, voda se odpaří a na okrajích misky vznikají krystaly.',
}

function Flame({ x, y, h = 38 }: { x: number; y: number; h?: number }) {
  // (x, y) = bottom centre
  const w = h * 0.36
  return (
    <g className="dg-flame" style={{ transformOrigin: `${x}px ${y}px` } as CSSProperties}>
      <path d={`M${x} ${y - h} C${x + w} ${y - h * 0.55} ${x + w} ${y - h * 0.15} ${x} ${y} C${x - w} ${y - h * 0.15} ${x - w} ${y - h * 0.55} ${x} ${y - h}Z`} fill="#ff922b" stroke="#e8590c" strokeWidth={1.5} />
      <path d={`M${x} ${y - h * 0.55} C${x + w * 0.5} ${y - h * 0.3} ${x + w * 0.5} ${y - h * 0.1} ${x} ${y} C${x - w * 0.5} ${y - h * 0.1} ${x - w * 0.5} ${y - h * 0.3} ${x} ${y - h * 0.55}Z`} fill="#4dabf7" />
    </g>
  )
}

function Burner({ x, y }: { x: number; y: number }) {
  // (x, y) = top centre of the burner tube
  return (
    <g>
      <Flame x={x} y={y - 1} />
      <Hx kind="d"><rect className="dg-metal" x={x - 9} y={y} width={18} height={34} rx={2} /></Hx>
      <Hx kind="d"><rect className="dg-metal" x={x - 24} y={y + 34} width={48} height={9} rx={3} /></Hx>
    </g>
  )
}

function Filtration() {
  return (
    <Sheet w={360} h={322} max={440} label={ARIA.filtration}>
      {/* stand */}
      <Hx kind="d"><rect className="dg-metal" x={26} y={304} width={132} height={10} rx={3} /></Hx>
      <Hx kind="d"><rect className="dg-metal" x={52} y={36} width={7} height={268} rx={2} /></Hx>
      <line className="dg-rod" x1={59} y1={114} x2={152} y2={114} />
      <Hx kind="d"><rect className="dg-metal" x={49} y={107} width={14} height={14} rx={2} /></Hx>
      <ellipse className="dg-ring" cx={185} cy={114} rx={35} ry={6} />
      {/* beaker + filtrate */}
      <Hx><rect className="dg-water" x={143} y={262} width={84} height={37} /></Hx>
      <path className="dg-glass" d="M134 206 L140 212 V300 H230 V212 L236 206" />
      {/* funnel */}
      <path className="dg-glass" d="M145 100 L225 100 L189 156 V214 L181 208 V156 Z" />
      <path className="dg-paper" d="M150 94 L220 94 L185 150 Z" />
      <path className="dg-paper-fold" d="M185 150 L172 94" />
      <Hx><path className="dg-mud" d="M159.4 110 L210.6 110 L185 150 Z" /></Hx>
      {[
        [182, 142],
        [187, 139],
        [184, 136],
        [190, 133],
        [179, 134],
        [186, 131],
      ].map(([cx, cy], i) => (
        <circle key={i} className="dg-grain" cx={cx} cy={cy} r={2.4} />
      ))}
      <ellipse className="dg-drop dg-drip" cx={185} cy={220} rx={2.6} ry={3.6} />
      <Label x={100} y={80} tx={168} ty={118} text="směs" anchor="end" />
      <Label x={240} y={82} tx={214} ty={98} text="filtrační papír" />
      <Label x={246} y={140} tx={207} ty={128} text="nálevka" />
      <Label x={250} y={226} tx={232} ty={230} text="kádinka" />
      <Label x={250} y={284} tx={216} ty={280} text="filtrát" />
      <Label x={72} y={274} tx={58} ty={262} text="stojan" />
    </Sheet>
  )
}

function Distillation() {
  const ang = 22
  return (
    <Sheet w={400} h={326} max={500} label={ARIA.distillation}>
      {/* tripod + burner */}
      <line className="dg-rod" x1={36} y1={242} x2={124} y2={242} />
      <line className="dg-leg" x1={44} y1={243} x2={34} y2={316} />
      <line className="dg-leg" x1={116} y1={243} x2={126} y2={316} />
      <Burner x={80} y={272} />
      {/* flask */}
      <path className="dg-glass" d="M72 96 V175 A34 34 0 1 0 88 175 V96" />
      <Hx><path className="dg-mud dg-mix" d="M46.7 214 A34 34 0 0 0 113.3 214 Z" /></Hx>
      {[
        [70, 232, 0],
        [86, 236, 0.6],
        [96, 228, 1.1],
        [62, 226, 1.6],
      ].map(([cx, cy, d], i) => (
        <circle key={i} className="dg-bubble" cx={cx} cy={cy} r={2.6} style={{ animationDelay: `${d}s` }} />
      ))}
      <rect className="dg-stopper" x={69} y={90} width={22} height={11} rx={2} />
      {/* thermometer: bulb at the side arm */}
      <rect className="dg-glass" x={77} y={36} width={6} height={76} rx={3} />
      <line x1={80} y1={62} x2={80} y2={108} stroke="#e03131" strokeWidth={2.2} />
      <circle cx={80} cy={111} r={4.5} fill="#e03131" className="dg-outline-thin" />
      {/* condenser */}
      <g transform={`translate(88 112) rotate(${ang})`}>
        <rect className="dg-glass" x={60} y={-27} width={10} height={14} />
        <rect className="dg-glass" x={180} y={13} width={10} height={14} />
        <rect className="dg-jacket" x={40} y={-15} width={170} height={30} rx={7} />
        <rect className="dg-glass dg-tube" x={0} y={-4.5} width={250} height={9} />
        <path className="dg-vapour" d="M6 0 H244" />
      </g>
      {/* receiver */}
      <Hx><path className="dg-water" d="M296.4 276 H343.6 L349 297 H291 Z" /></Hx>
      <path className="dg-glass" d="M312 194 V222 L289 299 H351 L328 222 V194" />
      <ellipse className="dg-drop dg-drip dg-drip-long" cx={320} cy={214} rx={2.4} ry={3.4} />
      {/* water in / out */}
      <line className="dg-waterflow" x1={249} y1={246} x2={249} y2={212} />
      <polygon className="dg-waterhead" points="249,206 244,215 254,215" />
      <line className="dg-waterflow" x1={158} y1={108} x2={158} y2={80} />
      <polygon className="dg-waterhead" points="158,74 153,83 163,83" />
      <text className="dg-note dg-water-t" x={167} y={84}>
        voda ven
      </text>
      <text className="dg-note dg-water-t" x={242} y={262} textAnchor="end">
        voda dovnitř
      </text>
      <Label x={98} y={44} tx={84} ty={52} text="teploměr" />
      <Label x={252} y={136} tx={236} ty={152} text="chladič" />
      <Label x={128} y={222} tx={112} ty={212} text="destilační baňka" />
      <Label x={338} y={240} tx={333} ty={250} text="předloha" />
      <Label x={284} y={316} tx={300} ty={290} text="destilát" anchor="end" />
      <Label x={138} y={314} tx={98} ty={300} text="kahan" />
    </Sheet>
  )
}

const rise = { duration: 2.8, delay: 0.3, ease: ease.inOut }
const RUN = 170
const START = 240
const SPOTS = [
  { x: 145, rf: 0.82, c: '#fab005' },
  { x: 145, rf: 0.55, c: '#e03131' },
  { x: 145, rf: 0.28, c: '#1c7ed6' },
  { x: 177, rf: 0.55, c: '#e03131' },
]

function Chromatography() {
  const [run, setRun] = useState(0)
  const front = START - RUN
  return (
    <>
      <Sheet w={360} h={312} max={440} label={ARIA.chromatography} key={run}>
        <path className="dg-glass" d="M92 44 V296 H228 V44" />
        <Hx><rect className="dg-water" x={94} y={268} width={132} height={26} /></Hx>
        <line className="dg-rod" x1={78} y1={38} x2={242} y2={38} />
        <rect className="dg-paper" x={122} y={38} width={76} height={244} />
        <motion.rect
          className="dg-wet"
          x={123}
          y={front}
          width={74}
          height={281 - front}
          style={{ originY: 1 }}
          initial={{ scaleY: (281 - START + 6) / (281 - front) }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={rise}
        />
        <line className="dg-pencil" x1={124} y1={START} x2={196} y2={START} />
        <motion.g initial={{ y: RUN }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={rise}>
          <line className="dg-front" x1={124} y1={front} x2={196} y2={front} />
        </motion.g>
        {SPOTS.map((s, i) => (
          <motion.g key={i} initial={{ y: s.rf * RUN }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={rise}>
            <ellipse cx={s.x} cy={START - s.rf * RUN} rx={7} ry={5.5} fill={s.c} fillOpacity={0.85} className="dg-outline-thin" />
          </motion.g>
        ))}
        <text className="dg-mono dg-small" x={145} y={START + 18} textAnchor="middle">
          A
        </text>
        <text className="dg-mono dg-small" x={177} y={START + 18} textAnchor="middle">
          B
        </text>
        <Label x={238} y={74} tx={198} ty={front} text="čelo rozpouštědla" />
        <Label x={238} y={126} tx={184} ty={START - 0.55 * RUN} text="skvrny" />
        <Label x={238} y={196} tx={199} ty={196} text="papír" />
        <Label x={238} y={244} tx={198} ty={START} text="start" />
        <Label x={238} y={290} tx={226} ty={282} text="rozpouštědlo" />
        <text className="dg-note" x={84} y={98} textAnchor="end">
          směs A
        </text>
        <text className="dg-note" x={84} y={116} textAnchor="end">
          se rozdělí
        </text>
      </Sheet>
      <button type="button" className="btn btn-sm btn-ghost dg-replay" onClick={() => setRun((r) => r + 1)}>
        ↻ Přehrát znovu
      </button>
    </>
  )
}

function Decantation() {
  const clip = useSvgId()
  const T = 'translate(46 133) rotate(40)'
  return (
    <Sheet w={360} h={300} max={440} label={ARIA.decantation}>
      <defs>
        <clipPath id={clip}>
          <rect x={2} y={-100} width={76} height={98} transform={T} />
        </clipPath>
      </defs>
      <text className="dg-note" x={12} y={26}>
        kapalinu opatrně sléváme po tyčince
      </text>
      {/* receiving beaker */}
      <Hx><rect className="dg-water" x={179} y={240} width={94} height={43} /></Hx>
      <path className="dg-glass" d="M172 150 L176 155 V285 H276 V155 L280 150" />
      {/* pouring beaker: liquid stays level */}
      <Hx><rect className="dg-mud dg-mud-light" x={0} y={111} width={360} height={200} clipPath={`url(#${clip})`} /></Hx>
      <g transform={T}>
        <path className="dg-sediment" d="M1 -1 H79 V-13 Q40 -20 1 -11 Z" />
        {[10, 22, 35, 48, 60, 70].map((x, i) => (
          <circle key={i} className="dg-grain" cx={x} cy={-9 - (i % 2) * 3} r={2.3} />
        ))}
        <path className="dg-glass dg-glass-open" d="M-4 -104 L0 -100 V0 H80 V-100 L84 -104" />
      </g>
      {/* glass rod + stream */}
      <line className="dg-glassrod" x1={166} y1={92} x2={220} y2={270} />
      <path className="dg-stream" d="M172 110 L211 240" />
      <Label x={196} y={84} tx={169} ty={100} text="tyčinka" />
      <Label x={20} y={216} tx={96} ty={167} text="usazenina" />
      <Label x={284} y={172} tx={277} ty={178} text="kádinka" />
      <Label x={284} y={262} tx={266} ty={262} text="kapalina" />
    </Sheet>
  )
}

function Evaporation() {
  return (
    <Sheet w={384} h={300} max={460} label={ARIA.evaporation}>
      <text className="dg-note" x={12} y={26}>
        voda se odpaří, sůl zůstane
      </text>
      {/* steam */}
      {[150, 170, 190].map((x, i) => (
        <path
          key={x}
          className="dg-steam"
          d={`M${x} 146 q-7 -10 0 -20 t0 -20 t0 -20`}
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      {/* tripod + mesh */}
      <line className="dg-leg" x1={110} y1={178} x2={96} y2={290} />
      <line className="dg-leg" x1={230} y1={178} x2={244} y2={290} />
      <line className="dg-rod" x1={96} y1={177} x2={244} y2={177} />
      {/* dish */}
      <path className="dg-glass dg-dish" d="M104 146 Q170 206 236 146 Z" />
      <Hx><path className="dg-water" d="M120.5 158 Q170 194 219.5 158 Z" /></Hx>
      {[
        [124, 156, 20],
        [131, 162, 45],
        [128, 151, 10],
        [214, 157, 30],
        [208, 163, 60],
        [217, 151, 15],
        [166, 172, 25],
        [176, 170, 50],
      ].map(([x, y, r], i) => (
        <rect key={i} className="dg-crystal" x={x - 3} y={y - 3} width={6} height={6} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <Burner x={170} y={236} />
      <Label x={250} y={140} tx={230} ty={150} text="odpařovací miska" />
      <Label x={96} y={130} tx={124} ty={152} text="krystaly" anchor="end" />
      <Label x={90} y={170} tx={136} ty={166} text="roztok" anchor="end" />
      <Label x={206} y={98} tx={192} ty={108} text="vodní pára" />
      <Label x={252} y={200} tx={238} ty={178} text="síťka" />
      <Label x={204} y={262} tx={182} ty={258} text="kahan" />
    </Sheet>
  )
}

export default function Separation({ props }: DiagramProps) {
  const method = oneOf(props.method, METHODS, null)
  if (!method) return <Fallback id="separation" reason="neznámá metoda" />
  const C = { filtration: Filtration, distillation: Distillation, chromatography: Chromatography, decantation: Decantation, evaporation: Evaporation }[method]
  return (
    <div className={`dg dg-sep dg-sep-${method}`}>
      <C />
    </div>
  )
}
