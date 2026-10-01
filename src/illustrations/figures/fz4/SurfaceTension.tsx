import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, Liquid, Sym, f1, pat, useFig } from './kit'

const LABEL =
  'Tři projevy povrchového napětí. Vodoměrka stojí na hladině: její nohy hladinu jen promáčknou a povrchová blána ji tlačí vzhůru silami, které vyrovnají její tíhovou sílu. Kapka vody na voskovém listu i volně padající kapka jsou kulaté, protože povrchové síly stahují povrch na co nejmenší plochu, a tou je koule. Kapiláry: voda smáčí sklo, v úzké trubici vystoupí nad hladinu a vytvoří vydutý meniskus, v užší trubici výš; rtuť sklo nesmáčí, v trubici klesne pod hladinu a meniskus je vypuklý.'

const W = 260
const H = 210
const WATER = '#5d93d6'
const HG = '#9aa1ad'

// ------------------------------------------------------------- water strider
const SURF = 124
const FEET = [36, 76, 184, 224]
const dip = (x: number) => FEET.reduce((s, f) => s + 7 * Math.exp(-(((x - f) / 9) ** 2)), 0)
const surface = () => {
  const pts: string[] = []
  for (let x = 8; x <= W - 8; x += 2) pts.push(`${x} ${f1(SURF + dip(x))}`)
  return 'M' + pts.join(' L')
}

function Strider() {
  const s = surface()
  const water = `${s} L${W - 8} ${H - 8} L8 ${H - 8}Z`
  return (
    <Frame w={W} h={H}>
      <Liquid d={water} color={WATER} opacity={0.3} />
      <path d={s} className="fz4-o" />
      {/* legs */}
      <path
        d={`M128 90 L64 70 L${FEET[0]} ${SURF + 6} M116 92 L90 100 L${FEET[1]} ${SURF + 6} M146 91 L174 100 L${FEET[2]} ${SURF + 6} M134 90 L198 70 L${FEET[3]} ${SURF + 6}`}
        className="fz4-o fz4-leg"
      />
      <ellipse cx={128} cy={89} rx={34} ry={6.5} className="fz4-o fz4-bug" />
      <circle cx={166} cy={87} r={5.5} className="fz4-o fz4-bug" />
      <path d="M170 84 L186 72 M171 87 L190 80" className="fz4-o fz4-thin" />
      {/* surface-tension forces at one foot and the weight */}
      <Arrow d={`M${FEET[3]} ${SURF + 7} L${FEET[3] - 16} ${SURF - 10}`} tone="lvl" className="fz4-vec" />
      <Arrow d={`M${FEET[3]} ${SURF + 7} L${FEET[3] + 16} ${SURF - 10}`} tone="lvl" className="fz4-vec" />
      <Sym x={FEET[3]} y={SURF - 22} t="F" tone="lvl" />
      <Arrow d="M128 96 V126" tone="red" className="fz4-vec" />
      <Sym x={140} y={128} t="F_{G}" tone="red" anchor="start" />
      <text x={W / 2} y={170} textAnchor="middle" className="fz4-lbl">
        hladina se jen promáčkne
      </text>
      <text x={W / 2} y={190} textAnchor="middle" className="fz4-lbl">
        a pruží jako blána
      </text>
    </Frame>
  )
}

// ------------------------------------------------------------- droplet
function Drop() {
  const { id } = useFig()
  const cx = 104
  const cy = 122
  const rx = 46
  const ry = 41
  return (
    <Frame w={W} h={H}>
      {/* waxy leaf */}
      <path d="M10 176 Q60 158 130 162 Q200 166 250 184 Q190 196 120 192 Q50 190 10 176Z" className="fz4-o fz4-leaf" />
      <path d="M18 177 Q120 170 244 183" className="fz4-o fz4-thin" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={WATER} fillOpacity={0.35} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={pat(id, 'h')} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="fz4-o" />
      <path d={`M${cx - 30} ${cy - 18} Q${cx - 26} ${cy - 32} ${cx - 12} ${cy - 36}`} className="fz4-shine" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8
        const x = cx + Math.cos(a) * rx
        const y = cy + Math.sin(a) * ry
        return <Arrow key={i} d={`M${f1(x)} ${f1(y)} L${f1(x - Math.cos(a) * 15)} ${f1(y - Math.sin(a) * 14)}`} tone="lvl" />
      })}
      {/* a falling drop */}
      <circle cx={208} cy={70} r={15} fill={WATER} fillOpacity={0.35} />
      <circle cx={208} cy={70} r={15} className="fz4-o" />
      <path d="M200 64 Q202 58 208 57" className="fz4-shine" />
      <path d="M208 30 V46 M200 34 V44 M216 34 V44" className="fz4-o fz4-thin fz4-dash" />
      <text x={208} y={110} textAnchor="middle" className="fz4-lbl">
        padající
      </text>
      <text x={208} y={127} textAnchor="middle" className="fz4-lbl">
        kapka
      </text>
      <text x={104} y={22} textAnchor="middle" className="fz4-lbl">
        povrch se stahuje
      </text>
    </Frame>
  )
}

// ------------------------------------------------------------- capillaries
function Tube({ x, w, top, level, liquid, convex }: { x: number; w: number; top: number; level: number; liquid: string; convex?: boolean }) {
  const { id } = useFig()
  const bot = 180
  const m = convex ? -4 : 4 // meniscus: water sags in the middle, mercury bulges up
  const col = `M${x - w / 2} ${bot} V${level} Q${x} ${level + 2 * m} ${x + w / 2} ${level} V${bot}Z`
  return (
    <g>
      {/* air inside the tube hides the liquid of the vessel behind it */}
      <rect x={x - w / 2} y={top} width={w} height={bot - top} className="fz4-fill" />
      <path d={col} fill={liquid} fillOpacity={0.55} />
      <path d={col} fill={pat(id, 'h')} />
      <path d={`M${x - w / 2} ${level} Q${x} ${level + 2 * m} ${x + w / 2} ${level}`} className="fz4-o fz4-thin" />
      <path d={`M${x - w / 2 - 2} ${top} V${bot} M${x + w / 2 + 2} ${top} V${bot}`} className="fz4-o fz4-thin" />
      <path d={`M${x - w / 2} ${top} V${bot} M${x + w / 2} ${top} V${bot}`} className="fz4-o fz4-thin" />
    </g>
  )
}

function Beaker({ x0, x1, level, liquid }: { x0: number; x1: number; level: number; liquid: string }) {
  const body = `M${x0} ${level} H${x1} V190 Q${x1} 196 ${x1 - 6} 196 H${x0 + 6} Q${x0} 196 ${x0} 190Z`
  return (
    <g>
      <Liquid d={body} color={liquid} opacity={0.45} />
      <path d={`M${x0 - 3} 104 L${x0} 108 V190 Q${x0} 196 ${x0 + 6} 196 H${x1 - 6} Q${x1} 196 ${x1} 190 V108 L${x1 + 3} 104`} className="fz4-o" />
    </g>
  )
}

const LEVEL = 140

function Capillaries() {
  return (
    <Frame w={W} h={H}>
      <Beaker x0={14} x1={122} level={LEVEL} liquid={WATER} />
      <Tube x={44} w={4} top={34} level={64} liquid={WATER} />
      <Tube x={88} w={10} top={34} level={106} liquid={WATER} />
      <Beaker x0={146} x1={248} level={LEVEL} liquid={HG} />
      <Tube x={198} w={9} top={34} level={166} liquid={HG} convex />
      {/* rise h in the narrow tube */}
      <path d={`M54 64 H62 M54 ${LEVEL} H62 M58 66 V${LEVEL - 2}`} className="fz4-o fz4-thin" />
      <Sym x={67} y={110} t="h" anchor="start" />
      <text x={68} y={208} textAnchor="middle" className="fz4-lbl fz4-b">
        voda
      </text>
      <text x={197} y={208} textAnchor="middle" className="fz4-lbl fz4-b">
        rtuť
      </text>
      <text x={66} y={24} textAnchor="middle" className="fz4-lbl">
        vystoupí
      </text>
      <text x={198} y={24} textAnchor="middle" className="fz4-lbl">
        klesne
      </text>
    </Frame>
  )
}

export default function SurfaceTension() {
  return (
    <Figure level={10} label={LABEL} max={900} interactive boost={false}>
      <div className="fz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={200}
          steps={[
            {
              title: 'Vodoměrka',
              art: <Strider />,
              caption: (
                <>
                  Nohy jen promáčknou hladinu. Povrchová blána tlačí vzhůru silami <i>F</i> a vyrovná tíhovou sílu <i>F</i>
                  <sub>G</sub>.
                </>
              ),
            },
            {
              title: 'Kulatá kapka',
              art: <Drop />,
              caption: 'Povrchové síly stahují povrch na co nejmenší plochu. Při daném objemu ji má koule.',
            },
            {
              title: 'Kapiláry',
              art: <Capillaries />,
              caption: 'Voda smáčí sklo a vystoupí, v užší trubici výš (vydutý meniskus). Rtuť sklo nesmáčí a klesne.',
            },
          ]}
        />
      </div>
    </Figure>
  )
}
