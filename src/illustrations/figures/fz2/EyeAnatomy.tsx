import { Arrow, Fade, Figure, Num, Pop, Ray, pat, useCompact, useFig } from './kit'
import { type V, along, hitCircle, norm, sub } from './geom'

const C: V = [262, 132] // eyeball centre
const R = 96
const RET = R - 5 // retina radius
const N: V = [196, 132] // lens centre (nodal point)
const OBJ: V = [34, 72] // top of the object (an arrow standing on the axis)

const PARTS: { n: number; t: string; at: V; to?: V }[] = [
  { n: 1, t: 'rohovka', at: [150, 70], to: [160, 104] },
  { n: 2, t: 'duhovka', at: [190, 40], to: [184, 94] },
  { n: 3, t: 'zornice', at: [132, 196], to: [183, 138] },
  { n: 4, t: 'čočka', at: [214, 26], to: [198, 102] },
  { n: 5, t: 'řasnaté těleso', at: [236, 36], to: [204, 90] },
  { n: 6, t: 'sklivec', at: [270, 92] },
  { n: 7, t: 'sítnice', at: [372, 224], to: [326, 206] },
  { n: 8, t: 'žlutá skvrna', at: [384, 154], to: [357, 134] },
  { n: 9, t: 'slepá skvrna', at: [318, 26], to: [343, 90] },
  { n: 10, t: 'zrakový nerv', at: [398, 82] },
]

function Eye() {
  const { id } = useFig()
  const retina = (a: number) => [C[0] + Math.cos(a) * RET, C[1] + Math.sin(a) * RET]
  const [r1x, r1y] = retina(-1.15)
  const [r2x, r2y] = retina(1.15)
  // nerve leaves slightly below the axis (blind spot)
  const bs = retina(-0.42)
  return (
    <g>
      {/* optic nerve */}
      <path d={`M${bs[0] - 4} ${bs[1] - 10} L404 ${bs[1] + 8} V${bs[1] + 34} L${bs[0] - 4} ${bs[1] + 12}Z`} className="fz2-o fz2-nerve-f" />
      <path d={`M${bs[0] + 8} ${bs[1] - 2} L404 ${bs[1] + 14} M${bs[0] + 8} ${bs[1] + 6} L404 ${bs[1] + 22} M${bs[0] + 8} ${bs[1] + 12} L404 ${bs[1] + 29}`} className="fz2-o fz2-thin" />
      {/* sclera and vitreous body */}
      <circle cx={C[0]} cy={C[1]} r={R} className="fz2-o fz2-sclera" />
      <circle cx={C[0]} cy={C[1]} r={R - 4} className="fz2-vitreous" />
      <circle cx={C[0]} cy={C[1]} r={R - 4} fill={pat(id, 'dots')} opacity={0.35} />
      {/* retina */}
      <path d={`M${r1x} ${r1y} A${RET} ${RET} 0 0 1 ${r2x} ${r2y}`} className="fz2-retina" />
      <circle cx={C[0] + RET} cy={C[1]} r={4} fill="#e0b43a" className="fz2-o" />
      {/* cornea and anterior chamber */}
      <path d="M180 84 Q142 132 180 180 Z" className="fz2-o fz2-cornea" />
      {/* iris with the pupil gap */}
      <path d="M184 86 V114 M184 150 V178" className="fz2-iris" />
      {/* ciliary body + lens */}
      <path d="M192 84 L198 96 M192 180 L198 168" className="fz2-o fz2-thick" />
      <ellipse cx={N[0]} cy={N[1]} rx={11} ry={34} className="fz2-o fz2-lens" />
    </g>
  )
}

function Rays() {
  // image of the object tip: the straight ray through the nodal point meets the retina
  const d0 = norm(sub(N, OBJ))
  const t = hitCircle(N, d0, C, RET, true)!
  const I = along(N, d0, t)
  const F: V = [C[0] + RET, C[1]]
  const via: V[] = [
    [N[0], 118],
    [N[0], 146],
  ]
  return (
    <g>
      <Ray pts={[OBJ, N, I]} delay={0.3} />
      {via.map((v, i) => (
        <Ray key={i} pts={[OBJ, v, I]} delay={0.4 + i * 0.1} />
      ))}
      <Fade delay={1.1}>
        <Arrow d={`M${F[0] - 3} ${F[1]} L${I[0] + 1} ${I[1] - 4}`} tone="red" className="fz2-wide" />
        <circle cx={I[0]} cy={I[1]} r={3} className="fz2-pt" />
      </Fade>
    </g>
  )
}

export default function EyeAnatomy() {
  const compact = useCompact()
  const n = compact.narrow
  const legend = PARTS.map((_, i) => (n ? { x: 8 + (i % 2) * 206, y: 290 + Math.floor(i / 2) * 28 } : { x: 440, y: 40 + i * 24 }))
  return (
    <Figure
      level={5}
      w={n ? 420 : 610}
      h={n ? 452 : 290}
      max={680}
      compact={compact}
      boost={false}
      label="Stavba oka a vznik obrazu. Světlo prochází rohovkou, otvorem v duhovce zvaným zornice a čočkou, kterou řasnaté těleso zakulacuje nebo zplošťuje, a sklivcem dopadá na sítnici. Nejostřeji vidíme ve žluté skvrně, ve slepé skvrně, kde z oka vychází zrakový nerv, nejsou žádné buňky citlivé na světlo. Rohovka a čočka vytvoří na sítnici skutečný, zmenšený a převrácený obraz; mozek si ho otočí."
    >
      {/* object */}
      <Pop delay={0}>
        <path d={`M${OBJ[0]} 132 V${OBJ[1] + 6}`} className="fz2-arr fz2-arr-acc fz2-wide" />
        <path d={`M${OBJ[0] - 8} ${OBJ[1] + 12} L${OBJ[0]} ${OBJ[1]} L${OBJ[0] + 8} ${OBJ[1] + 12}`} className="fz2-arr fz2-arr-acc fz2-wide" />
        <text x={OBJ[0]} y={154} textAnchor="middle" className="fz2-lbl fz2-b">
          předmět
        </text>
      </Pop>
      <path d="M14 132 H408" className="fz2-axis" />
      <Eye />
      <Rays />
      <Fade delay={1.2}>
        <text x={262} y={262} textAnchor="middle" className="fz2-lbl fz2-sm fz2-red-t">
          obraz na sítnici: zmenšený a převrácený
        </text>
        {PARTS.map((p) => (
          <g key={p.n}>
            {p.to && <line x1={p.at[0]} y1={p.at[1]} x2={p.to[0]} y2={p.to[1]} className="fz2-lead" />}
            <Num x={p.at[0]} y={p.at[1]} n={p.n} r={9.5} />
          </g>
        ))}
        {PARTS.map((p, i) => (
          <g key={`l${p.n}`}>
            <Num x={legend[i].x + 10} y={legend[i].y - 5} n={p.n} r={9.5} />
            <text x={legend[i].x + 26} y={legend[i].y} className={n ? 'fz2-leg fz2-leg-lg' : 'fz2-leg'}>
              {p.t}
            </text>
          </g>
        ))}
      </Fade>
    </Figure>
  )
}
