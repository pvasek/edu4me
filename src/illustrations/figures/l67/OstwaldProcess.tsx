import { ChemText, Fade, Figure, Lbl, Liquid, Pipe, Pop, pat, useCompact, useFig } from './kit'
import { Badge, StepList, Vessel } from './flow'

const NH3 = '#3f9e94'
const AIR = '#c9c2ae'
const NO = '#9aa0aa'
const NO2 = '#8a3c14'
const HNO3 = '#e3cf6a'

const STEPS = [
  { eq: '4NH_{3} + 5O_{2} → 4NO + 6H_{2}O', note: 'na rozžhavené síťce Pt–Rh' },
  { eq: '2NO + O_{2} → 2NO_{2}', note: 'bezbarvý NO se mění na hnědý NO_{2}' },
  { eq: '4NO_{2} + O_{2} + 2H_{2}O → 4HNO_{3}', note: 'pohlcení ve vodě' },
]

function Gauze() {
  const { id } = useFig()
  return (
    <g>
      <rect x={110} y={128} width={70} height={12} fill="#f0a53a" className="f67-glow" />
      <rect x={110} y={128} width={70} height={12} fill={pat(id, 'xd')} />
      <path d="M110 128 H180 M110 140 H180" className="f67-o f67-thin" />
    </g>
  )
}

function Brown() {
  const { id } = useFig()
  return (
    <g>
      <rect x={220} y={100} width={70} height={170} fill={NO2} fillOpacity={0.3} />
      <rect x={220} y={100} width={70} height={170} fill={pat(id, 'dots')} />
    </g>
  )
}

function Tower() {
  const { id } = useFig()
  return (
    <g>
      <rect x={370} y={90} width={60} height={140} className="f67-fill3" />
      <rect x={370} y={90} width={60} height={140} fill={pat(id, 'xd')} />
      <Liquid d="M370 240 H430 V282 H370Z" color={HNO3} opacity={0.6} />
    </g>
  )
}

export default function OstwaldProcess() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={7}
      w={480}
      h={n ? 498 : 480}
      max={620}
      compact={compact}
      label="Ostwaldova výroba kyseliny dusičné. 1. Amoniak se smísí se vzduchem a na rozžhavené platino-rhodiové síťce shoří na oxid dusnatý: 4NH3 + 5O2 → 4NO + 6H2O. 2. Oxid dusnatý se se vzduchem oxiduje na hnědý oxid dusičitý: 2NO + O2 → 2NO2. 3. V absorpční věži se NO2 pohlcuje ve vodě za přístupu kyslíku: 4NO2 + O2 + 2H2O → 4HNO3."
    >
      <Pipe d="M20 30 H66 Q80 30 80 42" gas={NH3} w={9} />
      <Pipe d="M20 74 H66 Q80 74 80 62" gas={AIR} w={9} />
      <Pipe d="M88 52 H131 Q145 52 145 66 V70" gas={NH3} delay={0.2} />
      <Pipe d="M145 220 V240 Q145 252 157 252 H220" gas={NO} delay={0.6} />
      <Pipe d="M255 40 V100" gas={AIR} w={8} delay={0.6} />
      <Pipe d="M290 244 H370" gas={NO2} delay={0.9} />
      <Pipe d="M400 30 V64" gas="#6f9fd8" w={8} delay={0.9} />
      <Pipe d="M400 300 V318 H468" gas={HNO3} delay={1.2} />
      <circle cx={80} cy={52} r={8} className="f67-o f67-fill3" />

      <Pop delay={0.3}>
        <Vessel x={110} y={70} w={70} h={150}>
          <Gauze />
        </Vessel>
        <Badge x={110} y={74} n={1} />
      </Pop>
      <Pop delay={0.6}>
        <Vessel x={220} y={100} w={70} h={170}>
          <Brown />
        </Vessel>
        <Badge x={220} y={104} n={2} />
      </Pop>
      <Pop delay={0.9}>
        <Vessel x={370} y={64} w={60} h={236}>
          <Tower />
        </Vessel>
        <path d="M386 80 l-6 12 M400 80 V94 M414 80 l6 12" className="f67-o f67-thin f67-dash" />
        <Badge x={370} y={68} n={3} />
      </Pop>

      <Fade delay={0.8}>
        <text x={18} y={22} className="f67-lbl f67-b">
          <ChemText text="NH_{3}" />
        </text>
        <text x={18} y={96} className="f67-lbl">
          vzduch
        </text>
        <Lbl x={20} y={150} tx={112} ty={134} className="f67-sm f67-b">
          síťka Pt–Rh
        </Lbl>
        <rect x={20} y={160} width={70} height={22} rx={4} className="f67-tag-lvl" />
        <text x={55} y={176} textAnchor="middle" className="f67-num f67-num-b">
          ~900 °C
        </text>
        <text x={186} y={244} className="f67-lbl f67-sm f67-b">
          NO
        </text>
        <text x={264} y={32} className="f67-lbl f67-sm">
          vzduch
        </text>
        <text x={330} y={236} textAnchor="middle" className="f67-lbl f67-sm f67-b" style={{ fill: 'var(--accent)' }}>
          <ChemText text="NO_{2}" />
        </text>
        <text x={412} y={24} className="f67-lbl f67-sm" style={{ fill: 'var(--blue)' }}>
          voda
        </text>
        <text x={468} y={340} textAnchor="end" className="f67-lbl f67-b">
          <ChemText text="HNO_{3}" />
        </text>
        <Lbl x={206} y={300} tx={255} ty={250} anchor="end" className="f67-sm" sec>
          oxidace a chlazení
        </Lbl>
      </Fade>

      <StepList x={16} y={n ? 368 : 362} steps={STEPS} gap={44} />
    </Figure>
  )
}
