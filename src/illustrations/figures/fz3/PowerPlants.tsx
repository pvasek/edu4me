import { StepStrip } from '../../sequence/StepFigure'
import { DrawArrow, Figure, Flame, Frame, Liquid, pat, useFig } from './kit'

const LABEL =
  'Srovnání pěti druhů elektráren a jejich energetických řetězců. Tepelná uhelná elektrárna: v kotli hoří uhlí, chemická energie se mění na vnitřní energii páry, pára roztáčí turbínu a ta generátor. Jaderná elektrárna: štěpení uranu v reaktoru ohřívá vodu na páru, dál turbína a generátor. Vodní elektrárna: polohová energie vody za přehradou se mění na pohybovou energii turbíny a generátoru. Větrná elektrárna: vítr roztáčí rotor, generátor je v gondole. Fotovoltaická elektrárna: sluneční záření se v článcích mění přímo na elektrickou energii, bez turbíny.'

const W = 260
const H = 150

function Turbine({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  const d = `M${x - 15} ${y - 12} L${x + 15} ${y - 21} V${y + 21} L${x - 15} ${y + 12}Z`
  return (
    <g>
      <path d={d} className="fz3-o fz3-fill2" />
      <path d={d} fill={pat(id, 'v')} />
    </g>
  )
}

function Gen({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={15} className="fz3-o fz3-lvlsoft-f" />
      <text x={x} y={y + 6} textAnchor="middle" className="fz3-sym-t fz3-tone-lvl" style={{ fontSize: 17, fontStyle: 'normal' }}>
        G
      </text>
    </g>
  )
}

/** Electric output: a wire ending with a lightning mark. */
function Out({ x, y, to }: { x: number; y: number; to: number }) {
  return (
    <g>
      <path d={`M${x} ${y} H${to}`} className="fz3-wire fz3-wire-thin" />
      <path d={`M${to + 7} ${y - 13} L${to + 1} ${y + 1} H${to + 8} L${to + 3} ${y + 14}`} className="fz3-bolt" />
    </g>
  )
}

function Tag({ x, y, t }: { x: number; y: number; t: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fz3-lbl fz3-sm">
      {t}
    </text>
  )
}

/** Turbine → shaft → generator → output, shared by the steam plants. */
function SteamEnd() {
  return (
    <g>
      <Turbine x={134} y={72} />
      <path d="M149 72 H170" className="fz3-o fz3-axle" />
      <Gen x={185} y={72} />
      <Out x={200} y={72} to={226} />
      <Tag x={134} y={112} t="turbína" />
      <Tag x={190} y={112} t="generátor" />
    </g>
  )
}

function Steam({ d }: { d: string }) {
  return (
    <g>
      <path d={d} className="fz3-pipe-o" style={{ strokeWidth: 9 }} />
      <path d={d} className="fz3-pipe-i" style={{ strokeWidth: 6 }} />
      <path d={d} className="fz3-flow" style={{ stroke: 'var(--muted)', strokeWidth: 2.4 }} />
    </g>
  )
}

function Thermal() {
  const { id } = useFig()
  return (
    <Frame w={W} h={H}>
      <rect x={24} y={44} width={50} height={78} rx={3} className="fz3-o fz3-fill" />
      <rect x={24} y={44} width={50} height={78} rx={3} fill={pat(id, 'brick')} />
      <Flame x={49} y={114} h={30} w={12} />
      {[34, 44, 56, 64].map((x, i) => (
        <circle key={x} cx={x} cy={132 - (i % 2) * 3} r={4} fill="#3b3b3b" className="fz3-o fz3-thin" />
      ))}
      <Steam d="M49 44 V30 H104 V64 H119" />
      <SteamEnd />
      <Tag x={49} y={24} t="kotel" />
      <Tag x={96} y={142} t="uhlí" />
    </Frame>
  )
}

function Nuclear() {
  const { id } = useFig()
  return (
    <Frame w={W} h={H}>
      <path d="M14 130 V70 A38 38 0 0 1 90 70 V130Z" className="fz3-o fz3-fill2" />
      <path d="M14 130 V70 A38 38 0 0 1 90 70 V130Z" fill={pat(id, 'd')} opacity={0.5} />
      <rect x={36} y={78} width={32} height={46} rx={10} className="fz3-o fz3-fill" />
      {[44, 52, 60].map((x) => (
        <path key={x} d={`M${x} 88 V116`} className="fz3-rod" />
      ))}
      <Steam d="M52 78 V58 H104 V64 H119" />
      <SteamEnd />
      <Tag x={52} y={146} t="reaktor" />
    </Frame>
  )
}

function Hydro() {
  const { id } = useFig()
  return (
    <Frame w={W} h={H}>
      <Liquid d="M8 44 H74 V132 H8Z" color="#3b8fe0" opacity={0.3} />
      <path d="M74 30 H96 L122 132 H74Z" className="fz3-o fz3-fill2" />
      <path d="M74 30 H96 L122 132 H74Z" fill={pat(id, 'd')} opacity={0.6} />
      <path d="M78 104 L150 126" className="fz3-pipe-o" style={{ strokeWidth: 10 }} />
      <path d="M78 104 L150 126" className="fz3-pipe-i" style={{ strokeWidth: 7 }} />
      <path d="M78 104 L150 126" className="fz3-flow" style={{ stroke: '#3b8fe0', strokeWidth: 3 }} />
      <circle cx={160} cy={128} r={12} className="fz3-o fz3-fill2" />
      <path d="M152 128 H168 M160 120 V136" className="fz3-o fz3-thin" />
      <path d="M160 116 V88" className="fz3-o fz3-axle" />
      <Gen x={160} y={72} />
      <Out x={175} y={72} to={214} />
      <path d="M172 132 Q196 134 250 132" className="fz3-o fz3-water-out" />
      <Tag x={40} y={32} t="nádrž" />
      <Tag x={110} y={20} t="přehrada" />
      <Tag x={210} y={118} t="turbína" />
      <Tag x={160} y={46} t="generátor" />
    </Frame>
  )
}

function Wind() {
  const hub: [number, number] = [118, 52]
  return (
    <Frame w={W} h={H}>
      {[40, 64, 88].map((y, i) => (
        <path key={y} d={`M${10 + i * 6} ${y} q14 -8 28 0 t28 0`} className="fz3-o fz3-thin fz3-wind" />
      ))}
      <path d="M128 142 L131 58 H137 L140 142Z" className="fz3-o fz3-fill" />
      <rect x={122} y={45} width={42} height={16} rx={5} className="fz3-o fz3-lvlsoft-f" />
      <text x={148} y={57} textAnchor="middle" className="fz3-sym-t fz3-tone-lvl" style={{ fontSize: 12, fontStyle: 'normal' }}>
        G
      </text>
      <g className="fz3-spin-slow" style={{ transformOrigin: `${hub[0]}px ${hub[1]}px` }}>
        {[0, 120, 240].map((a) => (
          <path
            key={a}
            d={`M${hub[0]} ${hub[1]} q6 -20 2 -46 q-8 20 -6 46Z`}
            transform={`rotate(${a} ${hub[0]} ${hub[1]})`}
            className="fz3-o fz3-fill"
          />
        ))}
      </g>
      <circle cx={hub[0]} cy={hub[1]} r={5} className="fz3-o fz3-fill2" />
      <Out x={140} y={138} to={214} />
      <Tag x={40} y={112} t="vítr" />
      <Tag x={206} y={40} t="generátor" />
      <Tag x={206} y={58} t="v gondole" />
      <Tag x={62} y={146} t="rotor" />
      <DrawArrow d="M70 136 L104 92" tone="muted" delay={0.3} />
    </Frame>
  )
}

function Solar() {
  const { id } = useFig()
  const panel = 'M74 118 L108 70 H178 L144 118Z'
  return (
    <Frame w={W} h={H}>
      <circle cx={34} cy={34} r={14} className="fz3-sun" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return (
          <path
            key={i}
            d={`M${34 + Math.cos(a) * 18} ${34 + Math.sin(a) * 18} L${34 + Math.cos(a) * 24} ${34 + Math.sin(a) * 24}`}
            className="fz3-o fz3-sunray"
          />
        )
      })}
      {[0, 1, 2].map((i) => (
        <DrawArrow key={i} d={`M${56 + i * 6} ${42 + i * 10} L${100 + i * 14} ${80 + i * 8}`} tone="acc" delay={0.2 + i * 0.1} />
      ))}
      <path d={panel} className="fz3-o fz3-panel" />
      <path d={panel} fill={pat(id, 'x')} opacity={0.5} />
      <path d="M91 94 H161 M97 86 L131 86 M119 70 L85 118 M142 70 L108 118 M165 70 L131 118" className="fz3-o fz3-thin" />
      <path d="M126 118 V132" className="fz3-o" />
      <path d="M144 118 L150 126 H182" className="fz3-wire fz3-wire-thin" />
      <rect x={182} y={114} width={26} height={24} rx={3} className="fz3-o fz3-fill2" />
      <text x={195} y={131} textAnchor="middle" className="fz3-eq fz3-eq-sm">
        ≈
      </text>
      <Out x={208} y={126} to={226} />
      <Tag x={126} y={146} t="panel (články)" />
      <Tag x={200} y={104} t="střídač" />
    </Frame>
  )
}

const PLANTS = [
  {
    title: 'Tepelná (uhelná)',
    art: <Thermal />,
    caption: 'chemická energie uhlí → vnitřní energie páry → pohybová energie turbíny → elektrická',
  },
  {
    title: 'Jaderná',
    art: <Nuclear />,
    caption: 'jaderná energie (štěpení uranu) → vnitřní energie páry → pohybová → elektrická',
  },
  {
    title: 'Vodní',
    art: <Hydro />,
    caption: 'polohová energie vody → pohybová energie vody a turbíny → elektrická',
  },
  {
    title: 'Větrná',
    art: <Wind />,
    caption: 'pohybová energie větru → pohybová energie rotoru → elektrická',
  },
  {
    title: 'Solární (fotovoltaická)',
    art: <Solar />,
    caption: 'energie slunečního záření → elektrická, přímo v článcích bez turbíny',
  },
]

export default function PowerPlants() {
  return (
    <Figure level={7} label={LABEL} max={760} interactive>
      <div className="fz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip min={250} steps={PLANTS} />
        <p className="fz3-strip-note">kromě fotovoltaiky roztáčí každá elektrárna turbínu spojenou s generátorem</p>
      </div>
    </Figure>
  )
}
