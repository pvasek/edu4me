import type { Glyph } from './species'
import { chargeLabel, cpk } from '../molecules/cpk'

/**
 * A small particle drawn from a glyph: depth-sorted CPK discs with an ink rim,
 * a tiny engraved highlight and thin ink bonds underneath; ions get a charge badge.
 * Centred at (0,0); `s` = px per Å.
 */
export function GlyphG({ g, s, badge = true }: { g: Glyph; s: number; badge?: boolean }) {
  const order = g.atoms.map((_, i) => i).sort((a, b) => g.atoms[a].z - g.atoms[b].z)
  return (
    <g className="pt-glyph">
      {g.bonds.map((b, k) => {
        const A = g.atoms[b.a]
        const B = g.atoms[b.b]
        return <line key={'b' + k} x1={A.x * s} y1={A.y * s} x2={B.x * s} y2={B.y * s} className="pt-bond" />
      })}
      {order.map((i) => {
        const a = g.atoms[i]
        const r = a.r * s
        return (
          <g key={i}>
            <circle cx={a.x * s} cy={a.y * s} r={r} fill={cpk(a.el)} className="pt-atom" />
            {r > 3.2 && <circle cx={a.x * s - r * 0.36} cy={a.y * s - r * 0.38} r={r * 0.2} className="pt-atom-hl" />}
          </g>
        )
      })}
      {badge && <ChargeBadge g={g} s={s} />}
    </g>
  )
}

/** Small circled charge ("+", "2−") at the particle's upper right; not rotated with it. */
export function ChargeBadge({ g, s }: { g: Glyph; s: number }) {
  if (!g.charge) return null
  const qR = Math.max(g.span * s * 0.5, 4)
  const t = chargeLabel(g.charge)
  return (
    <g className="pt-q" transform={`translate(${(qR * 0.78).toFixed(1)} ${(-qR * 0.78).toFixed(1)})`}>
      <circle r={t.length > 1 ? 6.2 : 5} />
      <text dy="0.36em">{t}</text>
    </g>
  )
}
