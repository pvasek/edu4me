import { Fade, Figure, Pop, Ray, pat, useCompact, useFig } from './kit'
import { type V, along, deg, hitCircle, hitSeg, norm, reflect, refract, sub } from './geom'

/** Spectral colours with the refractive index of a (strongly dispersive) flint glass and of water. */
const SPEC = [
  { c: '#d9342b', name: 'červená', glass: 1.6, water: 1.331 },
  { c: '#ec7a1c', name: 'oranžová', glass: 1.615, water: 1.333 },
  { c: '#e8c21c', name: 'žlutá', glass: 1.63, water: 1.335 },
  { c: '#3fa24a', name: 'zelená', glass: 1.645, water: 1.337 },
  { c: '#2f8fd0', name: 'modrá', glass: 1.66, water: 1.339 },
  { c: '#3b4fc4', name: 'indigo', glass: 1.68, water: 1.341 },
  { c: '#7d3fb8', name: 'fialová', glass: 1.7, water: 1.344 },
]

const A: V = [124, 52]
const BL: V = [40, 200]
const BR: V = [208, 200]

function Prism() {
  const { id } = useFig()
  const src: V = [6, 172]
  const hit: V = [BL[0] + 0.52 * (A[0] - BL[0]), BL[1] + 0.52 * (A[1] - BL[1])]
  const d0 = norm(sub(hit, src))
  const nL: V = [-(A[1] - BL[1]), A[0] - BL[0]] // left face normal (outwards: up-left)
  const nR: V = [BR[1] - A[1], -(BR[0] - A[0])]
  const rays = SPEC.map((s) => {
    const d1 = refract(d0, nL, 1, s.glass)!
    const t = hitSeg(hit, d1, A, BR)!
    const q = along(hit, d1, t)
    const d2 = refract(d1, nR, s.glass, 1)!
    const end = along(q, d2, (318 - q[0]) / d2[0])
    return { ...s, q, end }
  })
  return (
    <g>
      <Pop delay={0}>
        <path d={`M${A[0]} ${A[1]} L${BR[0]} ${BR[1]} H${BL[0]}Z`} className="fz2-o fz2-glass-b" />
        <path d={`M${A[0]} ${A[1]} L${BR[0]} ${BR[1]} H${BL[0]}Z`} fill={pat(id, 'b')} opacity={0.3} />
      </Pop>
      <Ray pts={[src, hit]} tone="ink" className="fz2-white" />
      {rays.map((r, i) => (
        <g key={r.c}>
          <Ray pts={[hit, r.q]} color={r.c} heads={false} delay={0.35} />
          <Ray pts={[r.q, r.end]} color={r.c} heads={i === 0 || i === 6} delay={0.7} />
        </g>
      ))}
      <Fade delay={1.2}>
        <path d={`M318 ${rays[0].end[1] - 14} V${rays[6].end[1] + 14}`} className="fz2-o fz2-thick" />
        <text x={324} y={rays[0].end[1] + 4} className="fz2-lbl fz2-b fz2-sm" style={{ fill: '#d9342b' }}>
          červená
        </text>
        <text x={324} y={rays[6].end[1] + 4} className="fz2-lbl fz2-b fz2-sm" style={{ fill: '#7d3fb8' }}>
          fialová
        </text>
        <text x={6} y={128} className="fz2-lbl fz2-b">
          bílé světlo
        </text>
        <text x={A[0]} y={226} textAnchor="middle" className="fz2-lbl fz2-sm">
          skleněný hranol
        </text>
      </Fade>
    </g>
  )
}

function Drop() {
  const c: V = [104, 110]
  const r = 56
  // each colour enters at its own rainbow ray (minimum deviation): cos²i = (n² − 1)/3
  const rays = [SPEC[0], SPEC[6]].map((s) => {
    const b = r * Math.sqrt(1 - (s.water ** 2 - 1) / 3)
    const src: V = [4, c[1] - b]
    const d0: V = [1, 0]
    const p1 = along(src, d0, hitCircle(src, d0, c, r)!)
    const d1 = refract(d0, sub(p1, c), 1, s.water)!
    const p2 = along(p1, d1, hitCircle(p1, d1, c, r, true)!)
    const d2 = reflect(d1, sub(p2, c))
    const p3 = along(p2, d2, hitCircle(p2, d2, c, r, true)!)
    const d3 = refract(d2, sub(p3, c), s.water, 1)!
    const ang = deg(Math.acos(-d3[0])) // angle to the incoming sunlight
    return { ...s, src, p1, p2, p3, out: along(p3, d3, 50), ang }
  })
  const src = rays[0].src
  const p1 = rays[0].p1
  return (
    <g>
      <text x={104} y={22} textAnchor="middle" className="fz2-lbl fz2-b">
        duha: kapka vody
      </text>
      <circle cx={c[0]} cy={c[1]} r={r} className="fz2-o fz2-drop-b" />
      <Ray pts={[src, p1]} tone="ink" />
      {rays.map((q, i) => (
        <g key={q.c}>
          <Ray pts={[q.p1, q.p2, q.p3]} color={q.c} heads={false} delay={0.4} />
          <Ray pts={[q.p3, q.out]} color={q.c} delay={0.8} />
          <text x={q.out[0] - 6 + (i ? 30 : 0)} y={q.out[1] + (i ? 14 : 2)} textAnchor="end" className="fz2-lbl fz2-sm fz2-b" style={{ fill: q.c }}>
            {q.ang.toFixed(1).replace('.', ',')}°
          </text>
        </g>
      ))}
      <path d={`M${rays[0].p3[0]} ${rays[0].p3[1]} h-66`} className="fz2-normal" />
      <text x={8} y={src[1] - 8} className="fz2-lbl fz2-sm">
        slunce
      </text>
      <text x={196} y={206} textAnchor="end" className="fz2-lbl fz2-sm">
        lom – odraz – lom
      </text>
    </g>
  )
}

export default function PrismDispersion() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={5}
      w={n ? 380 : 600}
      h={n ? 480 : 260}
      max={680}
      compact={compact}
      boost={false}
      label="Rozklad světla hranolem. Bílé světlo se na obou stěnách skleněného hranolu láme, a protože sklo láme každou barvu jinak (fialovou nejvíc, červenou nejmíň), rozloží se na spektrum: červená, oranžová, žlutá, zelená, modrá, indigo a fialová. Duha vzniká stejně v kapkách deště: sluneční světlo se v kapce lomí, odrazí od její zadní stěny a znovu lomí; červená vychází pod úhlem asi 42,4°, fialová asi 40,6° vůči slunečním paprskům."
    >
      <Prism />
      <g transform={n ? 'translate(86 262)' : 'translate(390 20)'}>
        <Pop delay={0.5}>
          <rect x={0} y={0} width={208} height={216} rx={10} className="fz2-o fz2-fill" />
        </Pop>
        <Drop />
      </g>
    </Figure>
  )
}
