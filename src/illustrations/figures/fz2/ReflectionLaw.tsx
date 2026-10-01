import { Angle, Fade, Figure, Pop, Ray, pat, useCompact, useFig } from './kit'
import { type V, along, dir, f, hitSeg, poly, reflect } from './geom'

const A = 40 // angle of incidence (degrees)

function Mirror({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={9} fill={pat(id, 'd')} />
      <path d={`M${x1} ${y} H${x2}`} className="fz2-mirror" />
    </g>
  )
}

function Law() {
  const P: V = [150, 196]
  const L = 150
  const s = Math.sin((A * Math.PI) / 180)
  const c = Math.cos((A * Math.PI) / 180)
  const inc: V = [P[0] - L * s, P[1] - L * c]
  const out: V = [P[0] + L * s, P[1] - L * c]
  return (
    <g>
      <Mirror x1={24} x2={276} y={P[1]} />
      <path d={`M${P[0]} ${P[1]} V36`} className="fz2-normal" />
      <Ray pts={[inc, P]} delay={0.1} />
      <Ray pts={[P, out]} delay={0.6} />
      <Fade delay={1}>
        <Angle c={P} a1={-90 - A} a2={-90} r={46} text="α" tr={60} />
        <Angle c={P} a1={-90} a2={-90 + A} r={40} text="α′" tr={56} />
        <text x={P[0]} y={28} textAnchor="middle" className="fz2-lbl fz2-sm">
          kolmice dopadu
        </text>
        <text x={inc[0] - 8} y={inc[1] - 12} textAnchor="middle" className="fz2-lbl fz2-sm">
          dopadající paprsek
        </text>
        <text x={out[0] + 8} y={out[1] - 12} textAnchor="middle" className="fz2-lbl fz2-sm">
          odražený paprsek
        </text>
        <text x={30} y={226} className="fz2-lbl fz2-sm">
          rovinné zrcadlo
        </text>
        <rect x={188} y={208} width={88} height={28} rx={6} className="fz2-tag-lvl" />
        <text x={232} y={228} textAnchor="middle" className="fz2-eq fz2-eq-lg">
          α′ = α
        </text>
      </Fade>
    </g>
  )
}

const D = dir(90 - A) // incident direction: down-right, 40° from the vertical

/** Parallel rays on a smooth mirror or a rough surface (each facet obeys the law). */
function Surface({ rough }: { rough: boolean }) {
  // rough: one small facet under every ray, each tilted differently (degrees)
  const pts: V[] = [[16, 100]]
  if (rough) {
    ;[-12, 14, -28, 8].forEach((tau, i) => {
      const h: V = [34 + i * 50 + 70 * Math.tan((A * Math.PI) / 180), 100]
      const u = dir(tau)
      pts.push([h[0] - 25, i % 2 ? 108 : 106], along(h, u, -12), along(h, u, 12))
    })
  }
  pts.push([284, 100])
  const surf = `${poly(pts)} V122 H16Z`
  const rays = [34, 84, 134, 184].map((x0) => {
    const p: V = [x0, 30]
    let best: { t: number; n: V } | null = null
    for (let i = 0; i < pts.length - 1; i++) {
      const t = hitSeg(p, D, pts[i], pts[i + 1])
      if (t !== null && (!best || t < best.t)) {
        const e: V = [pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]]
        best = { t, n: [e[1], -e[0]] }
      }
    }
    const h = along(p, D, best!.t)
    const r = reflect(D, best!.n)
    const nl = Math.hypot(best!.n[0], best!.n[1])
    const nu: V = [best!.n[0] / nl, best!.n[1] / nl]
    return { p, h, o: along(h, r, rough ? 58 : 80), nEnd: along(h, nu[1] < 0 ? nu : [-nu[0], -nu[1]], 24) }
  })
  const { id } = useFig()
  return (
    <g>
      <path d={surf} className="fz2-o fz2-fill2" />
      <path d={surf} fill={pat(id, 'd')} />
      <path d={poly(pts)} className={rough ? 'fz2-o fz2-thick' : 'fz2-mirror'} />
      {rays.map((r, i) => (
        <g key={i}>
          {rough && <path d={`M${f(r.h)} L${f(r.nEnd)}`} className="fz2-normal" />}
          <Ray pts={[r.p, r.h]} delay={0.2 + i * 0.08} />
          <Ray pts={[r.h, r.o]} delay={0.6 + i * 0.08} />
        </g>
      ))}
    </g>
  )
}

export default function ReflectionLaw() {
  const compact = useCompact()
  const n = compact.narrow
  const pos = n
    ? { a: 'translate(10 0)', b: 'translate(10 256)', c: 'translate(10 402)' }
    : { a: 'translate(0 8)', b: 'translate(318 0)', c: 'translate(318 138)' }
  return (
    <Figure
      level={5}
      w={n ? 320 : 620}
      h={n ? 528 : 262}
      max={700}
      compact={compact}
      boost={false}
      label="Zákon odrazu světla: dopadající paprsek, odražený paprsek a kolmice dopadu leží v jedné rovině a úhel odrazu α′ se rovná úhlu dopadu α, zde 40°. Hladký povrch, například zrcadlo, odráží rovnoběžné paprsky zase rovnoběžně – pravidelný odraz, vidíme v něm obraz. Drsný povrch, například papír, má plošky natočené různě; každá odráží podle stejného zákona, ale paprsky se rozptýlí do všech stran – rozptýlený odraz."
    >
      <g transform={pos.a}>
        <Law />
      </g>
      <g transform={pos.b}>
        <Pop delay={0}>
          <text x={16} y={16} className="fz2-lbl fz2-b">
            pravidelný odraz
          </text>
          <text x={284} y={16} textAnchor="end" className="fz2-lbl fz2-sm">
            hladké zrcadlo
          </text>
        </Pop>
        <Surface rough={false} />
      </g>
      <g transform={pos.c}>
        <Pop delay={0}>
          <text x={16} y={16} className="fz2-lbl fz2-b">
            rozptýlený odraz
          </text>
          <text x={284} y={16} textAnchor="end" className="fz2-lbl fz2-sm">
            drsný papír
          </text>
        </Pop>
        <Surface rough />
      </g>
    </Figure>
  )
}
