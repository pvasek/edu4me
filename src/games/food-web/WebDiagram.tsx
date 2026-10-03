/**
 * Engraved food-web diagram: producers at the bottom, each row one trophic step higher;
 * arrows point from food to eater (the way energy flows).
 */
import { useId } from 'react'
import { ChemIconView } from '../../illustrations/ChemIcon'
import { SPECIES } from './levels'
import { webOf } from './logic'

const W = 320
const NODE_H = 42
const ROW = 64
const PAD = 4
const GAP = 5

export interface WebLayoutNode {
  id: string
  x: number
  y: number
  w: number
}

/** Rows by trophic height, ordered left to right by the mean position of each node's food. */
export function layoutWeb(ecoId: string): { nodes: Map<string, WebLayoutNode>; height: number } {
  const w = webOf(ecoId)
  const top = Math.max(...w.ids.map((id) => w.height.get(id)!))
  const nodes = new Map<string, WebLayoutNode>()
  for (let h = 0; h <= top; h++) {
    let row = w.ids.filter((id) => w.height.get(id) === h)
    if (h > 0) {
      const mean = (id: string) => {
        const xs = w.foods.get(id)!.map((f) => nodes.get(f)!.x + nodes.get(f)!.w / 2)
        return xs.reduce((a, b) => a + b, 0) / xs.length
      }
      row = [...row].sort((a, b) => mean(a) - mean(b))
    }
    const n = row.length
    const nw = Math.min(80, (W - 2 * PAD - (n - 1) * GAP) / n)
    const total = n * nw + (n - 1) * GAP
    const x0 = (W - total) / 2
    row.forEach((id, i) => nodes.set(id, { id, x: x0 + i * (nw + GAP), y: PAD + (top - h) * ROW, w: nw }))
  }
  return { nodes, height: PAD * 2 + top * ROW + NODE_H }
}

export function WebDiagram({
  eco,
  focus = [],
  removed,
  target,
  chain,
}: {
  eco: string
  /** Species to highlight. */
  focus?: string[]
  /** Species that disappeared (crossed out, its arrows dashed). */
  removed?: string
  /** Species the question asks about. */
  target?: string
  /** A chain whose links are drawn bold. */
  chain?: string[]
}) {
  const uid = useId().replace(/:/g, '')
  const w = webOf(eco)
  const { nodes, height } = layoutWeb(eco)
  const inChain = (f: string, e: string) => !!chain && chain.some((id, i) => i > 0 && chain[i - 1] === f && id === e)
  const label = `Potravní síť: ${w.eco.name}. ${w.eco.eats.map(([f, e]) => `${SPECIES[f].short} → ${SPECIES[e].short}`).join(', ')}.`

  return (
    <svg className="g-fw-web" viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label}>
      <defs>
        <marker id={`a${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1L10 5L0 9z" fill="var(--ink)" />
        </marker>
        <marker id={`b${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1L10 5L0 9z" fill="var(--accent)" />
        </marker>
      </defs>
      <g fill="none" strokeLinecap="round">
        {w.eco.eats.map(([f, e]) => {
          const a = nodes.get(f)!
          const b = nodes.get(e)!
          const x1 = a.x + a.w / 2
          const y1 = a.y
          const x2 = b.x + b.w / 2
          const y2 = b.y + NODE_H + 1
          const gone = f === removed || e === removed
          const hot = inChain(f, e) || (focus.includes(f) && focus.includes(e) && !gone)
          return (
            <path
              key={`${f}>${e}`}
              d={`M${x1.toFixed(1)} ${y1}C${x1.toFixed(1)} ${y1 - 22} ${x2.toFixed(1)} ${y2 + 22} ${x2.toFixed(1)} ${y2}`}
              stroke={hot ? 'var(--accent)' : 'var(--ink)'}
              strokeWidth={hot ? 2.2 : 1}
              strokeOpacity={gone ? 0.35 : hot ? 1 : 0.55}
              strokeDasharray={gone ? '3 3' : undefined}
              markerEnd={`url(#${hot ? 'b' : 'a'}${uid})`}
            />
          )
        })}
      </g>
      {[...nodes.values()].map((n) => {
        const s = SPECIES[n.id]
        const isGone = n.id === removed
        const isTarget = n.id === target
        const hot = focus.includes(n.id) || (chain?.includes(n.id) ?? false)
        return (
          <g key={n.id} className="g-fw-node">
            <title>{`${s.name} (${s.latin})`}</title>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={NODE_H}
              rx={7}
              fill={isGone ? 'var(--bad-soft)' : hot ? 'var(--highlight)' : 'var(--surface)'}
              stroke={isTarget ? 'var(--accent)' : 'var(--edge)'}
              strokeWidth={isTarget ? 2.6 : 1.2}
              strokeDasharray={isGone ? '4 3' : undefined}
            />
            <g transform={`translate(${n.x + n.w / 2 - 9} ${n.y + 3})`} color={isGone ? 'var(--muted)' : 'var(--ink)'}>
              <ChemIconView name={s.icon} size={18} />
            </g>
            <text
              x={n.x + n.w / 2}
              y={n.y + NODE_H - 6}
              textAnchor="middle"
              className="g-fw-nodetext"
              fill={isGone ? 'var(--muted)' : 'var(--ink)'}
              textLength={s.short.length * 7 > n.w - 4 ? n.w - 4 : undefined}
              lengthAdjust="spacingAndGlyphs"
            >
              {s.short}
            </text>
            {isGone && <path d={`M${n.x + 6} ${n.y + 6}L${n.x + n.w - 6} ${n.y + NODE_H - 6}M${n.x + n.w - 6} ${n.y + 6}L${n.x + 6} ${n.y + NODE_H - 6}`} stroke="var(--bad)" strokeWidth={2} />}
          </g>
        )
      })}
    </svg>
  )
}
