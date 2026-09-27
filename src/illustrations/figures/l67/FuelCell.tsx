import { Atom, ChemText, Draw, Eq, Fade, Figure, Lbl, Pipe, Pop, Sign, Travel, pat, useFig } from './kit'

const Y0 = 120
const Y1 = 300
const MEM = [200, 280]

function H2({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g>
      <Atom x={x - 5} y={y} r={6.5} el="H" text="" />
      <Atom x={x + 5} y={y} r={6.5} el="H" text="" />
    </g>
  )
}
function O2({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g>
      <Atom x={x - 6} y={y} r={7.5} el="O" text="" />
      <Atom x={x + 6} y={y} r={7.5} el="O" text="" />
    </g>
  )
}
function H2O({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g>
      <Atom x={x - 7} y={y + 5} r={5} el="H" text="" />
      <Atom x={x + 7} y={y + 5} r={5} el="H" text="" />
      <Atom x={x} y={y} r={7.5} el="O" text="" />
    </g>
  )
}
function Hplus() {
  return <Atom x={0} y={0} r={6} el="H" text="+" size={10} />
}

function Body() {
  const { id } = useFig()
  return (
    <g>
      <rect x={60} y={Y0} width={120} height={Y1 - Y0} className="f67-glass" />
      <rect x={300} y={Y0} width={120} height={Y1 - Y0} className="f67-glass" />
      {/* porous electrodes with Pt catalyst */}
      <rect x={180} y={Y0} width={20} height={Y1 - Y0} fill="#3b3b3b" fillOpacity={0.8} />
      <rect x={280} y={Y0} width={20} height={Y1 - Y0} fill="#3b3b3b" fillOpacity={0.8} />
      <rect x={180} y={Y0} width={20} height={Y1 - Y0} fill={pat(id, 'hi')} opacity={0.5} />
      <rect x={280} y={Y0} width={20} height={Y1 - Y0} fill={pat(id, 'hi')} opacity={0.5} />
      {/* proton-exchange membrane */}
      <rect x={MEM[0]} y={Y0} width={MEM[1] - MEM[0]} height={Y1 - Y0} className="f67-lvlsoft-f" />
      <rect x={MEM[0]} y={Y0} width={MEM[1] - MEM[0]} height={Y1 - Y0} fill={pat(id, 'v')} />
      {/* end plates */}
      <rect x={48} y={Y0 - 8} width={12} height={Y1 - Y0 + 16} fill="#9aa0aa" className="f67-o" />
      <rect x={420} y={Y0 - 8} width={12} height={Y1 - Y0 + 16} fill="#9aa0aa" className="f67-o" />
      <path d={`M60 ${Y0} H420 M60 ${Y1} H420 M180 ${Y0} V${Y1} M200 ${Y0} V${Y1} M280 ${Y0} V${Y1} M300 ${Y0} V${Y1}`} className="f67-o" />
    </g>
  )
}

export default function FuelCell() {
  const lanes = [148, 176, 204, 232, 260, 284]
  return (
    <Figure
      level={6}
      w={480}
      h={430}
      max={620}
      label="Vodíkový palivový článek: zleva se přivádí vodík, zprava kyslík ze vzduchu. Na anodě (−) se vodík rozkládá na ionty H+ a elektrony: H2 → 2H+ + 2e−. Ionty H+ procházejí membránou, elektrony jdou vnějším obvodem přes žárovku. Na katodě (+) vzniká voda: O2 + 4H+ + 4e− → 2H2O, která odtéká. Celkem 2H2 + O2 → 2H2O, napětí asi 1,23 V."
    >
      <Pop delay={0}>
        <Body />
      </Pop>
      <Draw d={`M60 ${Y0} H420 V${Y1} H60Z`} className="f67-o f67-thick" />

      {/* pipes in/out */}
      <Pipe d="M8 150 H48" gas="#e8e4d8" w={12} delay={0.3} />
      <Pipe d="M48 276 H8" gas="#e8e4d8" w={12} delay={0.4} />
      <Pipe d="M472 150 H432" gas="#d9493b" w={12} delay={0.3} />
      <Pipe d="M432 276 H472" gas="#6f9fd8" w={12} delay={0.4} />

      {/* circuit with bulb */}
      <path d={`M190 ${Y0} V52 H224 M256 52 H290 V${Y0}`} className="f67-wire" />
      <Fade delay={1}>
        <path d={`M190 ${Y0} V52 H224 M256 52 H290 V${Y0}`} className="f67-current" />
      </Fade>
      <circle cx={240} cy={48} r={27} fill="#f3d36b" className="f67-glow" opacity={0.45} />
      <circle cx={240} cy={48} r={16} className="f67-o f67-fill" />
      <path d="M232 60 V52 Q236 40 240 52 Q244 40 248 52 V60" className="f67-o f67-thin" style={{ stroke: '#c9962c' }} />
      <path d="M230 62 H250 V72 H230Z" className="f67-o f67-fill3" />
      <text x={160} y={44} textAnchor="middle" className="f67-lbl f67-b f67-blue-t">
        e⁻ →
      </text>
      <text x={320} y={44} textAnchor="middle" className="f67-lbl f67-b f67-blue-t">
        e⁻ ↓
      </text>
      <Sign x={166} y={100} s="−" r={10} />
      <Sign x={314} y={100} s="+" r={10} />

      {/* particles */}
      {lanes.slice(0, 4).map((y, i) => (
        <Travel key={`h${i}`} path={`M72 ${y} L170 ${y + 6}`} dur={3} phase={i / 4} rest={[90 + (i % 2) * 44, y + 4]} fade>
          <H2 />
        </Travel>
      ))}
      {lanes.map((y, i) => (
        <Travel key={`p${i}`} path={`M${MEM[0] - 6} ${y} L${MEM[1] + 6} ${y}`} dur={2.4} phase={i / 6} rest={[MEM[0] + 14 + (i % 3) * 24, y]} fade>
          <Hplus />
        </Travel>
      ))}
      {lanes.slice(0, 3).map((y, i) => (
        <Travel key={`o${i}`} path={`M410 ${y - 6} L312 ${y}`} dur={3.4} phase={i / 3} rest={[392 - (i % 2) * 44, y]} fade>
          <O2 />
        </Travel>
      ))}
      {[0, 1, 2].map((i) => (
        <Travel key={`w${i}`} path="M318 250 Q380 262 440 276" dur={3} phase={i / 3} rest={[334 + i * 30, 256 + i * 6]} fade>
          <H2O />
        </Travel>
      ))}

      {/* inlet/outlet labels */}
      <Fade delay={0.6}>
        <text x={10} y={134} className="f67-lbl f67-b">
          <ChemText text="H_{2}" />
        </text>
        <text x={470} y={134} textAnchor="end" className="f67-lbl f67-b">
          <ChemText text="O_{2}" />
        </text>
        <text x={10} y={304} className="f67-lbl f67-sm f67-sec">
          zbytek <ChemText text="H_{2}" />
        </text>
        <text x={470} y={304} textAnchor="end" className="f67-lbl f67-sm f67-b">
          <ChemText text="H_{2}O" />
        </text>
        <Lbl x={120} y={330} tx={190} ty={296} anchor="end" className="f67-b">
          anoda (−)
        </Lbl>
        <Lbl x={360} y={330} tx={290} ty={296} className="f67-b">
          katoda (+)
        </Lbl>
        <Lbl x={240} y={330} tx={240} ty={300} anchor="middle">
          membrána
        </Lbl>
        <text x={240} y={346} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          propouští jen <ChemText text="H^{+}" />
        </text>
      </Fade>

      {/* equations */}
      <Pop delay={1.4}>
        <rect x={16} y={358} width={448} height={66} rx={6} className="f67-tag-lvl" />
        <Eq x={128} y={380} t="H_{2} → 2H^{+} + 2e^{-}" anchor="middle" />
        <Eq x={348} y={380} t="O_{2} + 4H^{+} + 4e^{-} → 2H_{2}O" anchor="middle" />
        <Eq x={240} y={410} t="2H_{2} + O_{2} → 2H_{2}O   (asi 1,23 V)" anchor="middle" className="f67-eq-lg" />
      </Pop>
    </Figure>
  )
}
