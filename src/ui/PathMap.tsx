import type { ReactNode } from 'react'

const XS = [50, 74, 50, 26]

/**
 * Winding notebook path: nodes zig-zag down the page, connected by a
 * dashed "pencil" line. The first `doneCount` segments are drawn solid.
 */
export function PathMap({
  items,
  doneCount,
  color = 'var(--accent)',
  rowHeight = 176,
}: {
  items: { key: string; node: ReactNode }[]
  doneCount: number
  color?: string
  rowHeight?: number
}) {
  const h = items.length * rowHeight
  const pts = items.map((_, i) => ({ x: XS[i % XS.length], y: i * rowHeight + 50 }))
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const my = (a.y + b.y) / 2
    return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`
  }
  return (
    <div className="pathmap" style={{ height: h }}>
      <svg className="pathmap-line" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true">
        {pts.slice(1).map((p, i) => (
          <path
            key={i}
            d={seg(pts[i], p)}
            fill="none"
            vectorEffect="non-scaling-stroke"
            stroke={i < doneCount ? color : 'var(--muted)'}
            strokeWidth={i < doneCount ? 5 : 2.5}
            strokeDasharray={i < doneCount ? undefined : '7 8'}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {items.map((it, i) => (
        <div key={it.key} className="pathmap-item" style={{ left: `${pts[i].x}%`, top: pts[i].y }}>
          {it.node}
        </div>
      ))}
    </div>
  )
}

/** Circular progress ring around a node. */
export function Ring({ value, size = 104, color }: { value: number; size?: number; color: string }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${c * Math.min(1, value)} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
