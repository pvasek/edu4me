import type { Glyph } from './species'
import { chargeLabel, cpk } from '../molecules/cpk'

/**
 * A small particle drawn from a glyph: depth-sorted CPK discs with an ink rim,
 * a tiny engraved highlight and thin ink bonds underneath; ions get a charge badge.
 * Centred at (0,0); `s` = px per Å.
 */
export function GlyphG({ g, s, badge = true }: { g: Glyph; s: number; badge?: boolean }) {
  const order = g.atoms.map((_, i) => i).sort((a, b) => g.atoms[a].z - g.atoms[b].z)
  const qR = g.span * s * 0.5
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
      {badge && g.charge !== 0 && (
        <g className="pt-q" transform={`translate(${(qR * 0.8).toFixed(1)} ${(-qR * 0.8).toFixed(1)})`}>
          <circle r={Math.max(5.5, 3 + chargeLabel(g.charge).length * 2.4)} />
          <text dy="0.35em">{chargeLabel(g.charge)}</text>
        </g>
      )}
    </g>
  )
}
