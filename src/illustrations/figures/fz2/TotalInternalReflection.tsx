import { StepStrip } from '../../sequence/StepFigure'
import { Angle, Figure, Frame, Ray, pat, useFig } from './kit'
import { type V, deg, rad } from './geom'

const N = 1.5
const CRIT = deg(Math.asin(1 / N)) // 41.8°
const LABEL =
  'Úplný odraz světla. Paprsek jde ze skla (n = 1,5) do vzduchu a láme se od kolmice. Při malém úhlu dopadu, například 25°, většina světla projde ven pod úhlem asi 39°. Při mezním úhlu 41,8° klouže lomený paprsek podél rozhraní. Při ještě větším úhlu, například 60°, už žádné světlo neprojde a všechno se odrazí zpět do skla – úplný odraz. Tak vede světlo optické vlákno: paprsek se v něm mnohokrát úplně odráží od stěn.'

const P: V = [150, 72]
const H = 164

function Glass({ y = P[1], h = H }: { y?: number; h?: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={0} y={y} width={300} height={h - y} className="fz2-glass-b" />
      <rect x={0} y={y} width={300} height={h - y} fill={pat(id, 'b')} opacity={0.35} />
      <path d={`M0 ${y} H300`} className="fz2-o" />
    </g>
  )
}

function Case({ a }: { a: number }) {
  const L = 104
  const s = Math.sin(rad(a))
  const c = Math.cos(rad(a))
  const src: V = [P[0] - L * s, P[1] + L * c]
  const refl: V = [P[0] + L * s, P[1] + L * c]
  const sb = N * s
  const total = sb > 1.0001
  const grazing = Math.abs(sb - 1) < 0.001
  const b = total ? 90 : deg(Math.asin(Math.min(1, sb)))
  const out: V = grazing ? [292, P[1] - 1.5] : [P[0] + Math.min(130, (P[1] - 6) / Math.cos(rad(b))) * Math.sin(rad(b)), P[1] - Math.min(130, (P[1] - 6) / Math.cos(rad(b))) * Math.cos(rad(b))]
  return (
    <Frame w={300} h={H}>
      <Glass />
      <path d={`M${P[0]} 8 V${H - 4}`} className="fz2-normal" />
      <Ray pts={[src, P]} />
      {!total && <Ray pts={[P, out]} delay={0.4} />}
      <Ray pts={[P, refl]} faint={!total} delay={0.5} />
      <Angle c={P} a1={90} a2={90 + a} r={36} text={`${a === CRIT ? '41,8' : a}°`} tr={a < 30 ? 72 : 56} />
      {!total && !grazing && <Angle c={P} a1={-90} a2={-90 + b} r={32} text={`${Math.round(b)}°`} tr={48} />}
      <text x={8} y={22} className="fz2-lbl fz2-sm">
        vzduch
      </text>
      <text x={8} y={P[1] + 22} className="fz2-lbl fz2-sm">
        sklo
      </text>
      {total && (
        <text x={292} y={40} textAnchor="end" className="fz2-lbl fz2-b fz2-lvl-t">
          nic neprojde
        </text>
      )}
      {grazing && (
        <text x={292} y={P[1] - 12} textAnchor="end" className="fz2-lbl fz2-sm fz2-lvl-t">
          klouže po rozhraní
        </text>
      )}
    </Frame>
  )
}

function Fibre() {
  const { id } = useFig()
  const top = 58
  const bot = 104
  // ray at 26° to the axis bounces between the walls (angle of incidence 64° > 41,8°)
  const k = Math.tan(rad(26))
  const pts: V[] = [[26, 70]]
  let x = 26
  let y = 70
  let down = true
  while (x < 290) {
    const ty = down ? bot : top
    const nx = x + Math.abs(ty - y) / k
    if (nx > 290) {
      pts.push([290, y + (down ? 1 : -1) * (290 - x) * k])
      break
    }
    pts.push([nx, ty])
    x = nx
    y = ty
    down = !down
  }
  return (
    <Frame w={300} h={H}>
      <rect x={20} y={top - 8} width={276} height={bot - top + 16} rx={4} className="fz2-o fz2-fill2" />
      <rect x={20} y={top - 8} width={276} height={bot - top + 16} rx={4} fill={pat(id, 'd')} opacity={0.6} />
      <rect x={20} y={top} width={276} height={bot - top} className="fz2-glass-b" />
      <path d={`M20 ${top} H296 M20 ${bot} H296`} className="fz2-o" />
      <circle cx={14} cy={70} r={8} className="fz2-o" fill="#f2c14e" />
      <Ray pts={pts} />
      <text x={150} y={top - 16} textAnchor="middle" className="fz2-lbl fz2-sm">
        obal (menší n)
      </text>
      <text x={150} y={bot + 30} textAnchor="middle" className="fz2-lbl fz2-sm">
        jádro ze skla
      </text>
    </Frame>
  )
}

export default function TotalInternalReflection() {
  return (
    <Figure level={5} label={LABEL} max={700} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={240}
          steps={[
            { title: 'Malý úhel: lom od kolmice', caption: 'Ze skla do vzduchu se paprsek láme od kolmice, slabý paprsek se odrazí.', art: <Case a={25} /> },
            { title: 'Mezní úhel 41,8°', caption: 'Lomený paprsek jde přesně podél rozhraní (úhel lomu 90°).', art: <Case a={CRIT} /> },
            { title: 'Úplný odraz', caption: 'Nad mezním úhlem se všechno světlo odrazí zpět do skla.', art: <Case a={60} /> },
            { title: 'Optické vlákno', caption: 'Světlo se ve vlákně stále úplně odráží, a tak projde i kilometry.', art: <Fibre /> },
          ]}
        />
      </div>
    </Figure>
  )
}
