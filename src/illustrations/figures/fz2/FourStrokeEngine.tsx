import { StepFilm } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, pat, useClock, useFig } from './kit'

const LABEL =
  'Čtyřdobý zážehový (benzinový) motor jako animace po krocích. 1. doba – sání: sací ventil je otevřený, píst jde dolů a do válce se nasává směs benzinu a vzduchu. 2. doba – stlačení: oba ventily jsou zavřené, píst jde nahoru a stlačuje směs. 3. doba – výbuch a pracovní zdvih: zapalovací svíčka vytvoří jiskru, směs shoří, horké plyny se rozpínají a tlačí píst dolů; jen tato doba koná práci. 4. doba – výfuk: výfukový ventil je otevřený, píst jde nahoru a vytlačí spaliny ven. Píst přes ojnici otáčí klikovým hřídelem; za čtyři doby se hřídel otočí dvakrát.'

// geometry (viewBox 340 × 360)
const CX = 170
const CY = 296
const R = 34 // crank radius
const L = 100 // connecting rod
const HEAD = 124 // underside of the cylinder head
const IN_X = 143
const EX_X = 197

type Stroke = 0 | 1 | 2 | 3
const GAS = ['#9cc3e6', '#6f9fd8', '#f0a040', '#a3a3a3'] as const

function pinY(th: number) {
  return CY - (R * Math.cos(th) + Math.sqrt(L * L - R * R * Math.sin(th) ** 2))
}
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2)

function Valve({ x, open }: { x: number; open: boolean }) {
  const lift = open ? 11 : 0
  return (
    <g>
      <rect x={x - 2.5} y={58} width={5} height={HEAD - 64 + lift} className="fz2-o fz2-valve" />
      <path d={`M${x - 14} ${HEAD + lift} H${x + 14} L${x + 5} ${HEAD - 7 + lift} H${x - 5}Z`} className="fz2-o fz2-valve" />
      <rect x={x - 7} y={52} width={14} height={6} rx={1.5} className="fz2-o fz2-fill2" />
    </g>
  )
}

function Engine({ k }: { k: Stroke }) {
  const { id } = useFig()
  const t = useClock(1.2)
  const p = easeInOut(Math.min(1, t / 1.2))
  const th = (k + p) * Math.PI
  const yp = pinY(th)
  const top = yp - 16
  const cp: [number, number] = [CX + R * Math.sin(th), CY - R * Math.cos(th)]
  const down = k === 0 || k === 2
  const dots = k === 0 ? 14 : k === 1 ? 20 : 0
  const gasH = top - HEAD
  const inPort = 'M131 118 V106 Q131 96 121 96 H100 V78 H121 Q155 78 155 104 V118Z'
  const exPort = 'M209 118 V106 Q209 96 219 96 H240 V78 H219 Q185 78 185 104 V118Z'
  const burn = k === 2
  return (
    <g>
      {/* gas in the cylinder */}
      <rect x={120} y={HEAD} width={100} height={Math.max(0, gasH)} fill={GAS[k]} fillOpacity={burn ? 0.35 + 0.5 * (1 - p) : 0.5} />
      {dots > 0 &&
        Array.from({ length: dots }, (_, i) => {
          const u = ((i * 37) % 97) / 97
          const v = ((i * 61) % 89) / 89
          return <circle key={i} cx={126 + u * 88} cy={HEAD + 5 + v * Math.max(2, gasH - 10)} r={2} className="fz2-mix" />
        })}
      {burn && (
        <g className="fz2-spark" opacity={1 - p * 0.6}>
          {[0, 50, 100, 150, 200, 250, 300].map((a) => {
            const r = (a * Math.PI) / 180
            return <path key={a} d={`M${CX + Math.cos(r) * 5} ${HEAD + 8 + Math.sin(r) * 5} L${CX + Math.cos(r) * 17} ${HEAD + 8 + Math.sin(r) * 17}`} className="fz2-burst" />
          })}
        </g>
      )}

      {/* cylinder walls */}
      <path d="M108 124 V258 H120 V124Z M220 124 V258 H232 V124Z" className="fz2-o fz2-fill2" />
      <path d="M108 124 V258 H120 V124Z M220 124 V258 H232 V124Z" fill={pat(id, 'd')} />

      {/* cylinder head with ports */}
      <path d="M100 72 H240 V124 H100Z" className="fz2-o fz2-fill2" />
      <path d="M100 72 H240 V124 H100Z" fill={pat(id, 'x')} opacity={0.8} />
      <path d={inPort} className="fz2-o" fill={k === 0 ? GAS[0] : 'var(--surface)'} fillOpacity={k === 0 ? 0.6 : 1} />
      <path d={exPort} className="fz2-o" fill={k === 3 ? GAS[3] : 'var(--surface)'} fillOpacity={k === 3 ? 0.6 : 1} />
      <path d="M160 70 H180 V124 H160Z" className="fz2-o fz2-fill" />
      <Valve x={IN_X} open={k === 0} />
      <Valve x={EX_X} open={k === 3} />

      {/* spark plug */}
      <rect x={163} y={30} width={14} height={40} rx={3} className="fz2-o fz2-fill" />
      <path d="M163 40 H177 M163 48 H177 M163 56 H177" className="fz2-o fz2-thin" />
      <rect x={160} y={70} width={20} height={14} className="fz2-o fz2-valve" />
      <path d={`M170 84 V${HEAD + 5} M166 ${HEAD + 8} H174`} className="fz2-o fz2-thick" />

      {/* crank, rod, piston */}
      <circle cx={CX} cy={CY} r={48} className="fz2-o fz2-fill2" />
      <circle cx={CX} cy={CY} r={48} fill={pat(id, 'dots')} />
      <path d={`M${CX} ${CY} L${cp[0]} ${cp[1]}`} className="fz2-o" style={{ strokeWidth: 14 }} />
      <path d={`M${CX} ${CY} L${cp[0]} ${cp[1]}`} className="fz2-web" />
      <path d={`M${CX} ${yp} L${cp[0]} ${cp[1]}`} className="fz2-o" style={{ strokeWidth: 10 }} />
      <path d={`M${CX} ${yp} L${cp[0]} ${cp[1]}`} className="fz2-rod" />
      <circle cx={CX} cy={yp} r={5} className="fz2-o fz2-fill" />
      <circle cx={cp[0]} cy={cp[1]} r={6} className="fz2-o fz2-fill" />
      <circle cx={CX} cy={CY} r={8} className="fz2-o fz2-fill3" />
      <rect x={121} y={top} width={98} height={36} rx={2} className="fz2-o fz2-metal" />
      <rect x={121} y={top} width={98} height={36} rx={2} fill={pat(id, 'd')} opacity={0.7} />
      <path d={`M121 ${top + 6} H219 M121 ${top + 11} H219`} className="fz2-o fz2-thin" />
      <text x={CX} y={top + 30} textAnchor="middle" className="fz2-lbl fz2-b fz2-sm fz2-dark-t">
        píst
      </text>
      <Arrow d={`M${CX + 60 * Math.cos(0.15)} ${CY + 60 * Math.sin(0.15)} A60 60 0 0 1 ${CX + 60 * Math.cos(1.25)} ${CY + 60 * Math.sin(1.25)}`} tone="muted" />

      {/* motion of the piston and of the gases */}
      <Arrow d={down ? 'M254 150 V222' : 'M254 222 V150'} tone="lvl" className="fz2-wide" />
      {k === 0 && <Arrow d="M40 110 Q110 110 136 128" tone="blue" className="fz2-wide" />}
      {k === 3 && <Arrow d="M204 128 Q230 110 300 110" tone="muted" className="fz2-wide" />}

      {/* labels */}
      <text x={12} y={40} className="fz2-lbl fz2-sm">
        sací ventil
      </text>
      <line x1={60} y1={46} x2={IN_X - 7} y2={56} className="fz2-lead" />
      <text x={328} y={20} textAnchor="end" className="fz2-lbl fz2-sm">
        zapalovací svíčka
      </text>
      <line x1={250} y1={25} x2={178} y2={36} className="fz2-lead" />
      <text x={328} y={46} textAnchor="end" className="fz2-lbl fz2-sm">
        výfukový ventil
      </text>
      <line x1={260} y1={50} x2={EX_X + 7} y2={56} className="fz2-lead" />
      <text x={12} y={200} className="fz2-lbl fz2-sm">
        válec
      </text>
      <line x1={50} y1={196} x2={108} y2={196} className="fz2-lead" />
      <text x={328} y={278} textAnchor="end" className="fz2-lbl fz2-sm">
        ojnice
      </text>
      <line x1={288} y1={276} x2={(CX + cp[0]) / 2 + 6} y2={(yp + cp[1]) / 2} className="fz2-lead" />
      <text x={12} y={340} className="fz2-lbl fz2-sm">
        klikový hřídel
      </text>
      <line x1={70} y1={326} x2={CX - 8} y2={CY + 4} className="fz2-lead" />
      <text x={262} y={192} className="fz2-lbl fz2-b fz2-lvl-t">
        {down ? 'dolů' : 'nahoru'}
      </text>
      {k === 0 && (
        <text x={12} y={150} className="fz2-lbl fz2-sm fz2-blue-t">
          <tspan x={12}>benzin</tspan>
          <tspan x={12} dy={18}>+ vzduch</tspan>
        </text>
      )}
      {k === 3 && (
        <text x={328} y={150} textAnchor="end" className="fz2-lbl fz2-sm">
          <tspan x={328}>spaliny</tspan>
          <tspan x={328} dy={18}>ven</tspan>
        </text>
      )}
      {k === 1 && (
        <text x={12} y={150} className="fz2-lbl fz2-sm">
          <tspan x={12}>ventily</tspan>
          <tspan x={12} dy={18}>zavřené</tspan>
        </text>
      )}
      {k === 2 && (
        <text x={12} y={150} className="fz2-lbl fz2-sm fz2-red-t">
          <tspan x={12}>jiskra →</tspan>
          <tspan x={12} dy={18}>výbuch</tspan>
        </text>
      )}
    </g>
  )
}

const STEPS: { title: string; caption: string }[] = [
  { title: 'Sání', caption: 'Sací ventil je otevřený, píst jde dolů a nasává do válce směs benzinu a vzduchu.' },
  { title: 'Stlačení (komprese)', caption: 'Oba ventily jsou zavřené, píst jde nahoru a směs stlačí na malý objem.' },
  { title: 'Výbuch a pracovní zdvih', caption: 'Svíčka zapálí směs jiskrou, horké plyny se rozpínají a tlačí píst dolů – jen tahle doba koná práci.' },
  { title: 'Výfuk', caption: 'Výfukový ventil se otevře a píst jdoucí nahoru vytlačí spaliny ven. Pak vše začíná znovu.' },
]

export default function FourStrokeEngine() {
  return (
    <Figure level={4} label={LABEL} max={460} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s, k) => ({
          ...s,
          art: (
            <Frame w={340} h={356}>
              <Engine k={k as Stroke} />
            </Frame>
          ),
        }))}
      />
    </Figure>
  )
}
