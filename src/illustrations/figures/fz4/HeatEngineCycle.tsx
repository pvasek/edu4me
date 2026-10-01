import { StepStrip } from '../../sequence/StepFigure'
import { ChemText, Figure, Frame, Qty, f1, pat, useFig, type P2 } from './kit'

const LABEL =
  'Tok energie tepelným strojem, srovnání motoru a chladničky. Tepelný motor: pracovní látka přijme od ohřívače o teplotě T₁ teplo Q₁ = 2,5 kJ, vykoná práci W = 0,9 kJ a zbylé teplo Q₂ = 1,6 kJ odevzdá chladiči o teplotě T₂; účinnost η = W / Q₁ = 36 %. Chladnička pracuje obráceně: dodanou prací W = 0,5 kJ odebere teplo Q₂ = 1,5 kJ z chladného vnitřku a do teplé kuchyně odevzdá teplo Q₁ = Q₂ + W = 2,0 kJ. Šířka šipek odpovídá množství energie.'

const W = 280
const H = 324
const K = 18 // px per kJ
const MX0 = 92
const MX1 = 188
const MY0 = 124
const MY1 = 180

type Kind = 'hot' | 'cold' | 'work'

/** A Sankey band from a to b (axis-aligned), `kj` wide, with an arrow head at b. */
function Band({ a, b, kj, kind }: { a: P2; b: P2; kj: number; kind: Kind }) {
  const { id } = useFig()
  const w = kj * K
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: P2 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  const n: P2 = [-u[1], u[0]]
  const hl = Math.min(16, len * 0.4)
  const base: P2 = [b[0] - u[0] * hl, b[1] - u[1] * hl]
  const p = (q: P2, s: number): string => `${f1(q[0] + n[0] * s)} ${f1(q[1] + n[1] * s)}`
  const hw = w / 2 + 7
  const d = `M${p(a, -w / 2)} L${p(base, -w / 2)} L${p(base, -hw)} L${f1(b[0])} ${f1(b[1])} L${p(base, hw)} L${p(base, w / 2)} L${p(a, w / 2)}Z`
  return (
    <g>
      <path d={d} className={`fz4-sankey fz4-sankey-${kind}`} />
      <path d={d} fill={pat(id, kind === 'work' ? 'b' : 'd')} opacity={0.5} />
      <path d={d} className="fz4-o fz4-thin" />
    </g>
  )
}

function Reservoir({ y, hot, t, sub }: { y: number; hot: boolean; t: string; sub: string }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={24} y={y} width={W - 48} height={48} rx={5} className={`fz4-o ${hot ? 'fz4-res-hot' : 'fz4-res-cold'}`} />
      <rect x={24} y={y} width={W - 48} height={48} rx={5} fill={pat(id, 'h')} opacity={0.6} />
      <text x={W / 2} y={y + 21} textAnchor="middle" className="fz4-lbl fz4-b">
        <ChemText text={t} />
      </text>
      <text x={W / 2} y={y + 39} textAnchor="middle" className="fz4-lbl fz4-sm">
        {sub}
      </text>
    </g>
  )
}

function Machine({ t }: { t: string }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={8} className="fz4-o fz4-fill2" />
      <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={8} fill={pat(id, 'x')} opacity={0.5} />
      <text x={(MX0 + MX1) / 2} y={(MY0 + MY1) / 2 + 6} textAnchor="middle" className="fz4-lbl fz4-b fz4-halo">
        {t}
      </text>
    </g>
  )
}


function Engine() {
  const q1 = 2.5
  const q2 = 1.6
  const w = 0.9
  const left = 140 - (q1 * K) / 2
  return (
    <Frame w={W} h={H}>
      <Reservoir y={12} hot t="ohřívač T_{1}" sub="hořící palivo, pára" />
      <Reservoir y={244} hot={false} t="chladič T_{2}" sub="okolní vzduch, řeka" />
      <Band a={[140, 60]} b={[140, MY0]} kj={q1} kind="hot" />
      <Band a={[left + (q2 * K) / 2, MY1]} b={[left + (q2 * K) / 2, 244]} kj={q2} kind="cold" />
      <Band a={[MX1, 152]} b={[262, 152]} kj={w} kind="work" />
      <Machine t="motor" />
      <Qty x={168} y={98} s="Q_{1}" v="2,5 kJ" className="fz4-eq-lg" />
      <Qty x={194} y={194} s="W" v="0,9 kJ" className="fz4-eq-lg" />
      <Qty x={160} y={222} s="Q_{2}" v="1,6 kJ" className="fz4-eq-lg" />
      <Qty x={W / 2} y={318} s="η = W / Q_{1}" v="0,9 / 2,5 = 36 %" anchor="middle" className="fz4-eq-lg" />
    </Frame>
  )
}

function Fridge() {
  const q1 = 2.0
  const q2 = 1.5
  const w = 0.5
  const left = 140 - (q1 * K) / 2
  return (
    <Frame w={W} h={H}>
      <Reservoir y={12} hot t="teplá kuchyně T_{1}" sub="mřížka vzadu hřeje" />
      <Reservoir y={244} hot={false} t="vnitřek chladničky T_{2}" sub="potraviny se ochlazují" />
      <Band a={[140, MY0]} b={[140, 60]} kj={q1} kind="hot" />
      <Band a={[left + (q2 * K) / 2, 244]} b={[left + (q2 * K) / 2, MY1]} kj={q2} kind="cold" />
      <Band a={[262, 152]} b={[MX1, 152]} kj={w} kind="work" />
      <Machine t="chladnička" />
      <Qty x={166} y={98} s="Q_{1}" v="2,0 kJ" className="fz4-eq-lg" />
      <Qty x={194} y={194} s="W" v="0,5 kJ" className="fz4-eq-lg" />
      <Qty x={160} y={222} s="Q_{2}" v="1,5 kJ" className="fz4-eq-lg" />
      <Qty x={W / 2} y={318} s="Q_{1} = Q_{2} + W" v="2,0 kJ" anchor="middle" className="fz4-eq-lg" />
    </Frame>
  )
}

export default function HeatEngineCycle() {
  return (
    <Figure level={10} label={LABEL} max={720} interactive boost={false}>
      <div className="fz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={240}
          steps={[
            {
              title: 'Tepelný motor',
              art: <Engine />,
              caption: 'Z ohřívače přijme teplo Q₁, část změní na práci W, zbytek Q₂ musí odevzdat chladiči.',
            },
            {
              title: 'Chladnička (obrácený motor)',
              art: <Fridge />,
              caption: 'Šipky jsou obrácené: za dodanou práci W přečerpá teplo z chladného vnitřku do teplé kuchyně.',
            },
          ]}
        />
        <p className="fz4-strip-note">šířka šipky = množství energie za jeden cyklus; energie se nikde neztrácí: Q₁ = W + Q₂</p>
      </div>
    </Figure>
  )
}
