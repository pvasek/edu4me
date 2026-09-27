import { ChemText, Fade, Figure, Flame, Lbl, Liquid, Pipe, Pop, pat, useCompact, useFig } from './kit'
import { Badge, Bed, StepList, Vessel } from './flow'

const SO2 = '#c9b24a'
const SO3 = '#e0b43a'
const ACID = '#d8c77a'

const STEPS = [
  { eq: 'S + O_{2} → SO_{2}', note: 'spálení síry' },
  { eq: '2SO_{2} + O_{2} ⇌ 2SO_{3}', note: 'V_{2}O_{5}, asi 450 °C, ΔH = −198 kJ' },
  { eq: 'SO_{3} + H_{2}SO_{4} → H_{2}S_{2}O_{7}', note: 'pohlcení v konc. kyselině: oleum' },
  { eq: 'H_{2}S_{2}O_{7} + H_{2}O → 2H_{2}SO_{4}', note: 'zředění olea vodou' },
]

function Packing() {
  const { id } = useFig()
  return (
    <g>
      <rect x={340} y={96} width={60} height={140} className="f67-fill3" />
      <rect x={340} y={96} width={60} height={140} fill={pat(id, 'xd')} />
      <path d="M340 96 H400 M340 236 H400" className="f67-o f67-thin" />
    </g>
  )
}

export default function ContactProcess() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={7}
      w={480}
      h={n ? 624 : 540}
      max={620}
      compact={compact}
      label="Kontaktní výroba kyseliny sírové. 1. Síra shoří se vzduchem na oxid siřičitý: S + O2 → SO2. 2. V konvertoru na vrstvách katalyzátoru V2O5 při asi 450 °C vzniká oxid sírový: 2SO2 + O2 ⇌ 2SO3, ΔH = −198 kJ. 3. SO3 se v absorpční věži pohlcuje v koncentrované kyselině sírové a vzniká oleum: SO3 + H2SO4 → H2S2O7. 4. Oleum se ředí vodou: H2S2O7 + H2O → 2H2SO4. SO3 se nezavádí přímo do vody, vznikla by kyselá mlha."
    >
      {/* pipes */}
      <Pipe d="M45 34 V70" gas={SO3} w={8} delay={0} />
      <Pipe d="M85 34 V70" gas="#c9c2ae" w={8} delay={0} />
      <Pipe d="M110 110 H146 Q160 110 160 96 V62 Q160 48 174 48 H190" gas={SO2} delay={0.4} />
      <Pipe d="M260 214 H340" gas={SO3} delay={0.8} />
      <Pipe d="M466 30 H370 V58" gas={ACID} w={8} delay={0.8} />
      <Pipe d="M370 290 V336 H300" gas={ACID} delay={1.1} />
      <Pipe d="M150 318 H240 V332" gas="#6f9fd8" w={8} delay={1.2} />
      <Pipe d="M220 378 H30" gas={ACID} delay={1.4} />

      {/* 1 sulfur burner */}
      <Pop delay={0.2}>
        <rect x={20} y={70} width={90} height={80} rx={4} className="f67-o f67-thick f67-fill3" />
        <Flame x={50} y={140} h={40} w={12} color="#3d6fd1" inner="#9fb8e8" />
        <Flame x={78} y={140} h={30} w={9} color="#3d6fd1" inner="#9fb8e8" />
        <Badge x={20} y={70} n={1} />
      </Pop>
      <BurnerHatch />

      {/* 2 converter */}
      <Pop delay={0.5}>
        <Vessel x={190} y={36} w={70} h={200}>
          <Bed x={190} y={70} w={70} color="#d9a33a" />
          <Bed x={190} y={120} w={70} color="#d9a33a" />
          <Bed x={190} y={170} w={70} color="#d9a33a" />
        </Vessel>
        <Badge x={190} y={40} n={2} />
      </Pop>

      {/* 3 absorption tower */}
      <Pop delay={0.8}>
        <Vessel x={340} y={58} w={60} h={232}>
          <Packing />
          <Liquid d="M340 256 H400 V290 H340Z" color={ACID} opacity={0.6} />
        </Vessel>
        <path d="M356 76 l-6 12 M370 76 V90 M384 76 l6 12" className="f67-o f67-thin f67-dash" />
        <Badge x={340} y={62} n={3} />
      </Pop>

      {/* 4 dilution tank */}
      <Pop delay={1.1}>
        <Vessel x={220} y={332} w={80} h={56}>
          <Liquid d="M220 350 H300 V388 H220Z" color={ACID} opacity={0.55} />
        </Vessel>
        <Badge x={220} y={336} n={4} />
      </Pop>

      <Fade delay={0.9}>
        <text x={45} y={24} textAnchor="middle" className="f67-lbl f67-b">
          síra
        </text>
        <text x={92} y={24} textAnchor="middle" className="f67-lbl">
          vzduch
        </text>
        <text x={65} y={172} textAnchor="middle" className="f67-lbl">
          pec
        </text>
        <text x={225} y={26} textAnchor="middle" className="f67-lbl f67-b">
          konvertor
        </text>
        <rect x={188} y={248} width={74} height={40} rx={4} className="f67-tag-lvl" />
        <text x={225} y={264} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          <ChemText text="V_{2}O_{5}" />
        </text>
        <text x={225} y={282} textAnchor="middle" className="f67-num f67-num-b">
          450 °C
        </text>
        <text x={300} y={206} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          <ChemText text="SO_{3}" />
        </text>
        <text x={466} y={22} textAnchor="end" className="f67-lbl f67-sm">
          <ChemText text="konc. H_{2}SO_{4}" />
        </text>
        <Lbl x={414} y={170} tx={400} ty={170} className="f67-sm" sec>
          absorpce
        </Lbl>
        <text x={380} y={326} className="f67-lbl f67-b">
          oleum
        </text>
        <text x={150} y={310} className="f67-lbl" style={{ fill: 'var(--blue)' }}>
          voda
        </text>
        <text x={30} y={368} className="f67-lbl f67-b">
          <ChemText text="H_{2}SO_{4}" />
        </text>
        <text x={128} y={100} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          <ChemText text="SO_{2}" />
        </text>
      </Fade>

      <StepList x={16} y={n ? 426 : 426} steps={STEPS} cols={n ? 1 : 2} colW={232} gap={n ? 44 : 50} />
      <Fade delay={2.2}>
        <text x={240} y={n ? 612 : 530} textAnchor="middle" className="f67-lbl f67-sm f67-red-t">
          <ChemText text="✕ SO_{3} ne přímo do vody: vznikla by kyselá mlha" />
        </text>
      </Fade>
    </Figure>
  )
}

function BurnerHatch() {
  const { id } = useFig()
  return <rect x={20} y={70} width={90} height={16} fill={pat(id, 'brick')} className="f67-nohit" />
}
