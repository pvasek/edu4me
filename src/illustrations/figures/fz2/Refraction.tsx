import { StepStrip } from '../../sequence/StepFigure'
import { Angle, Figure, Frame, Ray, pat, useFig } from './kit'
import { type V, along, deg, meet, rad } from './geom'

const N = 1.33
const LABEL =
  'Lom světla na rozhraní vzduchu a vody. Paprsek přechází ze vzduchu (n = 1) do vody (n = 1,33) a láme se ke kolmici: úhel dopadu 50° je větší než úhel lomu asi 35°; malá část světla se odrazí. Zdánlivá hloubka: paprsky od ryby se na hladině lámou od kolmice, oko je prodlouží zpět v přímce a vidí rybu výš a blíž, než opravdu je, proto se voda zdá mělčí.'

function Media({ y, h = 200, labels = true }: { y: number; h?: number; labels?: boolean }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={0} y={y} width={320} height={h - y} className="fz2-water" />
      <rect x={0} y={y} width={320} height={h - y} fill={pat(id, 'h')} opacity={0.4} />
      <path d={`M0 ${y} H320`} className="fz2-o" />
      {labels && (
        <>
          <text x={10} y={y - 10} className="fz2-lbl fz2-sm">
            vzduch
          </text>
          <text x={10} y={y + 22} className="fz2-lbl fz2-sm">
            voda
          </text>
        </>
      )}
    </g>
  )
}

function Bend() {
  const P: V = [160, 100]
  const a = 50
  const b = deg(Math.asin(Math.sin(rad(a)) / N))
  const L = 118
  const inc: V = [P[0] - L * Math.sin(rad(a)), P[1] - L * Math.cos(rad(a))]
  const out: V = [P[0] + 100 * Math.sin(rad(b)), P[1] + 100 * Math.cos(rad(b))]
  const refl: V = [P[0] + 80 * Math.sin(rad(a)), P[1] - 80 * Math.cos(rad(a))]
  return (
    <Frame w={320} h={200}>
      <Media y={P[1]} />
      <path d={`M${P[0]} 14 V192`} className="fz2-normal" />
      <Ray pts={[inc, P]} />
      <Ray pts={[P, out]} delay={0.4} />
      <Ray pts={[P, refl]} faint delay={0.5} />
      <Angle c={P} a1={-90 - a} a2={-90} r={40} text="α" tr={54} />
      <Angle c={P} a1={90 - b} a2={90} r={46} text="β" tr={60} />
      <text x={310} y={P[1] - 10} textAnchor="end" className="fz2-lbl fz2-sm">
        n = 1
      </text>
      <text x={310} y={P[1] + 22} textAnchor="end" className="fz2-lbl fz2-sm">
        n = 1,33
      </text>
      <text x={10} y={186} className="fz2-eq">
        α = 50°, β ≐ 35°
      </text>
    </Frame>
  )
}

function Fish({ x, y, ghost = false }: { x: number; y: number; ghost?: boolean }) {
  return (
    <g className={ghost ? 'fz2-ghost' : ''}>
      <path d={`M${x - 20} ${y} Q${x - 4} ${y - 11} ${x + 12} ${y} Q${x - 4} ${y + 11} ${x - 20} ${y}Z M${x + 10} ${y} L${x + 22} ${y - 8} V${y + 8}Z`} className={ghost ? 'fz2-fish-g' : 'fz2-fish'} />
      {!ghost && <circle cx={x - 12} cy={y - 2} r={1.6} className="fz2-pt" />}
    </g>
  )
}

/** Point on the surface where the ray from q refracts into the eye e. */
function surfacePoint(q: V, e: V, ys: number) {
  let lo = q[0]
  let hi = e[0]
  for (let k = 0; k < 60; k++) {
    const x = (lo + hi) / 2
    const sw = (x - q[0]) / Math.hypot(x - q[0], ys - q[1])
    const sa = Math.min(0.999, N * sw)
    const xe = x + (ys - e[1]) * Math.tan(Math.asin(sa))
    if (xe > e[0]) hi = x
    else lo = x
  }
  return (lo + hi) / 2
}

function Depth() {
  const ys = 80
  const Q: V = [108, 160] // tip of the fish (its eye)
  const eyes: V[] = [
    [226, 12],
    [229, 13],
  ]
  const S = eyes.map((e) => [surfacePoint(Q, e, ys), ys] as V)
  const dirs = S.map((s, i) => {
    const d: V = [eyes[i][0] - s[0], eyes[i][1] - s[1]]
    const l = Math.hypot(d[0], d[1])
    return [d[0] / l, d[1] / l] as V
  })
  const img = meet(S[0], dirs[0], S[1], dirs[1])
  return (
    <Frame w={320} h={200}>
      <Media y={ys} labels={false} />
      <text x={10} y={ys - 10} className="fz2-lbl fz2-sm">
        vzduch
      </text>
      <Fish x={Q[0] + 12} y={Q[1] + 2} />
      <Fish x={img[0] + 12} y={img[1] + 2} ghost />
      {/* one narrow pencil of rays: the eye traces it back to the image */}
      <Ray pts={[Q, S[0]]} />
      <Ray pts={[S[0], along(S[0], dirs[0], Math.hypot(eyes[0][0] - S[0][0], eyes[0][1] - S[0][1]) - 8)]} delay={0.35} />
      <Ray pts={[S[0], img]} dashed delay={0.7} />
      <path d={`M${S[0][0]} ${ys - 40} V${ys + 60}`} className="fz2-normal" />
      {/* observer's eye */}
      <g transform="translate(232 12) rotate(135)">
        <path d="M-12 0 Q0 -9 12 0 Q0 9 -12 0Z" className="fz2-o fz2-fill" />
        <circle cx={2} cy={0} r={4} className="fz2-pt" />
      </g>
      <text x={4} y={img[1] + 6} className="fz2-lbl fz2-sm fz2-lvl-t fz2-halo">
        zdánlivá poloha
      </text>
      <text x={Q[0] - 14} y={Q[1] + 30} textAnchor="middle" className="fz2-lbl fz2-sm fz2-halo">
        skutečná ryba
      </text>
    </Frame>
  )
}

export default function Refraction() {
  return (
    <Figure level={5} label={LABEL} max={700} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            { title: 'Lom ke kolmici', caption: 'Ze vzduchu do vody se světlo zpomalí a láme se ke kolmici: β < α.', art: <Bend /> },
            { title: 'Zdánlivá hloubka', caption: 'Z vody do vzduchu se paprsek láme od kolmice. Oko ho prodlouží zpět, a proto vidí rybu výš.', art: <Depth /> },
          ]}
        />
      </div>
    </Figure>
  )
}
