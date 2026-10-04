import { useId, useMemo } from 'react'
import type { MapData, Mark, Seg } from './logic'
import { gradAt, heightAt, len, MAP_H, MAP_W, pointAt, polyLength, type Pt } from './terrain'

const d = (pts: Pt[], closed = false) =>
  pts.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + (closed ? ' Z' : '')

/** Spádovky: short ticks pointing downhill on closed contours that enclose a hollow. */
function hollowTicks(m: MapData): Pt[][] {
  const out: Pt[][] = []
  // closed contours whose inside is lower; only the two innermost of each hollow get ticks
  const hollows = m.lines
    .filter((l) => l.closed)
    .map((l) => ({ l, c: l.pts.reduce((a, p) => ({ x: a.x + p.x / l.pts.length, y: a.y + p.y / l.pts.length }), { x: 0, y: 0 }) }))
    .filter(({ l, c }) => heightAt(m.terrain, c.x, c.y) < l.level)
  for (const { l, c } of hollows) {
    const lower = hollows.filter((o) => o.l.level < l.level && Math.hypot(o.c.x - c.x, o.c.y - c.y) < 30).length
    if (lower >= 2) continue
    const total = polyLength(l.pts)
    const n = Math.max(3, Math.min(8, Math.round(total / 22)))
    for (let k = 0; k < n; k++) {
      const { p } = pointAt(l.pts, (total * (k + 0.5)) / n)
      const g = gradAt(m.terrain, p.x, p.y)
      const gl = len(g) || 1
      out.push([p, { x: p.x - (g.x / gl) * 4.5, y: p.y - (g.y / gl) * 4.5 }])
    }
  }
  return out
}

/** A letter marker: a ring on the exact place and the letter in a badge next to it. */
function Marker({ m, dx, dy }: { m: Mark; dx: number; dy: number }) {
  const bx = m.x + dx
  const by = m.y + dy
  return (
    <g className="g-ct-mark">
      <line x1={m.x} y1={m.y} x2={bx} y2={by} className="g-ct-mark-lead" />
      <circle cx={m.x} cy={m.y} r={3.6} className="g-ct-mark-ring" />
      <circle cx={m.x} cy={m.y} r={0.9} className="g-ct-mark-dot" />
      <circle cx={bx} cy={by} r={7.5} className="g-ct-mark-badge" />
      <text x={bx} y={by + 3.4} textAnchor="middle" className="g-ct-mark-text">
        {m.label}
      </text>
    </g>
  )
}

/** Badge offset that points away from the map edge. */
const badgeOffset = (p: Pt): [number, number] => [p.x > MAP_W - 30 ? -12 : 12, p.y < 30 ? 12 : -12]

function SegView({ s }: { s: Seg }) {
  if (s.style === 'bar') {
    const [a, b] = s.pts
    const l = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const n = { x: -(b.y - a.y) / l, y: (b.x - a.x) / l }
    const mid = { x: (a.x + b.x) / 2 + n.x * 11, y: (a.y + b.y) / 2 + n.y * 11 }
    const tick = (p: Pt) => <line x1={p.x - n.x * 4} y1={p.y - n.y * 4} x2={p.x + n.x * 4} y2={p.y + n.y * 4} className="g-ct-bar" />
    return (
      <g>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="g-ct-bar-halo" />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="g-ct-bar" />
        {tick(a)}
        {tick(b)}
        <circle cx={mid.x} cy={mid.y} r={7.5} className="g-ct-mark-badge" />
        <text x={mid.x} y={mid.y + 3.4} textAnchor="middle" className="g-ct-mark-text">
          {s.label}
        </text>
      </g>
    )
  }
  if (s.style === 'cand') {
    const { p } = pointAt(s.pts, polyLength(s.pts) / 2)
    return (
      <g>
        <path d={d(s.pts)} className="g-ct-cand-halo" />
        <path d={d(s.pts)} className="g-ct-cand" />
        <circle cx={p.x} cy={p.y} r={7.5} className="g-ct-cand-badge" />
        <text x={p.x} y={p.y + 3.4} textAnchor="middle" className="g-ct-mark-text">
          {s.label}
        </text>
      </g>
    )
  }
  if (s.style === 'flow') return <path d={d(s.pts)} className="g-ct-flow" />
  return <path d={d(s.pts)} className="g-ct-line" />
}

/** The engraved contour map: brown contours (index ones thicker and labelled), water, trail, hut, spot heights, markers. */
export function ContourMap({ map, marks, segs, label }: { map: MapData; marks: Mark[]; segs: Seg[]; label: string }) {
  const uid = useId().replace(/:/g, '')
  const ticks = useMemo(() => hollowTicks(map), [map])
  const scale = map.mPerUnit ? 500 / map.mPerUnit : 0
  return (
    <svg className="g-ct-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={label}>
      <defs>
        <clipPath id={`${uid}c`}>
          <rect width={MAP_W} height={MAP_H} />
        </clipPath>
        <marker id={`${uid}a`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="g-ct-flow-head" />
        </marker>
      </defs>
      <rect width={MAP_W} height={MAP_H} className="g-ct-paper" />
      <g clipPath={`url(#${uid}c)`}>
        {map.lines
          .filter((l) => !l.index)
          .map((l, k) => (
            <path key={`n${k}`} d={d(l.pts, l.closed)} className="g-ct-c" />
          ))}
        {map.lines
          .filter((l) => l.index)
          .map((l, k) => (
            <path key={`i${k}`} d={d(l.pts, l.closed)} className="g-ct-ci" />
          ))}
        {ticks.map(([a, b], k) => (
          <line key={`t${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="g-ct-ci" />
        ))}
        {map.streams.map((s, k) => (
          <path key={`s${k}`} d={d(s)} className="g-ct-stream" />
        ))}
        {map.labels.map((l, k) => (
          <text key={`l${k}`} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)})`} y={3.2} textAnchor="middle" className="g-ct-label">
            {l.text}
          </text>
        ))}
        {map.streamNames.map((s, k) => (
          <text key={`sn${k}`} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(1)})`} y={-5} textAnchor="middle" className="g-ct-sname">
            {s.name}
          </text>
        ))}
        {map.trail && (
          <>
            <path d={d(map.trail)} className="g-ct-trail-halo" />
            <path d={d(map.trail)} className="g-ct-trail" />
          </>
        )}
        {map.hut && (
          <g className="g-ct-hut">
            <circle cx={map.hut.x} cy={map.hut.y} r={1.8} className="g-ct-spot" />
            <g transform={`translate(${map.hut.x + (map.hut.x > MAP_W - 40 ? -14 : 12)} ${map.hut.y - 12})`}>
              <path d="M-6 0 L0 -6 L6 0 L6 7 L-6 7 Z" className="g-ct-hut-house" />
              <text x={0} y={17} textAnchor="middle" className="g-ct-hut-text">
                chata
              </text>
            </g>
          </g>
        )}
        {map.spots.map((s, k) => (
          <g key={`p${k}`}>
            <circle cx={s.x} cy={s.y} r={1.8} className="g-ct-spot" />
            {Number.isFinite(s.z) && (
              <text x={s.x + 4} y={s.y + 10} className="g-ct-spot-text">
                {s.z}
              </text>
            )}
            {s.name && (
              <text x={s.x} y={s.y - 6} textAnchor="middle" className="g-ct-hill">
                {s.name}
              </text>
            )}
          </g>
        ))}
        {segs.map((s, k) =>
          s.style === 'flow' ? (
            <path key={`g${k}`} d={d(s.pts)} className="g-ct-flow" markerEnd={`url(#${uid}a)`} />
          ) : (
            <SegView key={`g${k}`} s={s} />
          ),
        )}
        {marks.map((m, k) => {
          const [dx, dy] = badgeOffset(m)
          return <Marker key={`m${k}`} m={m} dx={dx} dy={dy} />
        })}
      </g>
      {scale > 0 && (
        <g transform={`translate(10 ${MAP_H - 10})`} className="g-ct-scale">
          <rect x={-4} y={-15} width={scale + 40} height={19} rx={3} className="g-ct-scale-bg" />
          <rect x={0} y={-4} width={scale / 2} height={3.5} className="g-ct-scale-b" />
          <rect x={scale / 2} y={-4} width={scale / 2} height={3.5} className="g-ct-scale-w" />
          <text x={0} y={-7} className="g-ct-scale-t" textAnchor="middle">
            0
          </text>
          <text x={scale} y={-7} className="g-ct-scale-t" textAnchor="middle">
            500
          </text>
          <text x={scale + 7} y={-0.5} className="g-ct-scale-t">
            m
          </text>
        </g>
      )}
      <rect width={MAP_W} height={MAP_H} className="g-ct-frame" />
    </svg>
  )
}

/** A height profile drawn on a shared vertical range. */
export function ProfileChart({ profile, range, interval }: { profile: number[]; range: [number, number]; interval: number }) {
  const w = 300
  const h = 74
  const top = 8
  const bot = h - 14
  const left = 34
  const right = w - 14
  const [lo, hi] = range
  const x = (k: number) => left + ((right - left) * k) / (profile.length - 1)
  const y = (z: number) => bot - ((bot - top) * (z - lo)) / (hi - lo || 1)
  const line = profile.map((z, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)} ${y(z).toFixed(1)}`).join(' ')
  const grid: number[] = []
  const stepZ = Math.max(interval, Math.ceil((hi - lo) / 4 / interval) * interval)
  for (let z = Math.ceil(lo / stepZ) * stepZ; z <= hi; z += stepZ) grid.push(z)
  return (
    <svg className="g-ct-profile" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {grid.map((z) => (
        <g key={z}>
          <line x1={left} x2={right} y1={y(z)} y2={y(z)} className="g-ct-pgrid" />
          <text x={left - 4} y={y(z) + 3} textAnchor="end" className="g-ct-ptext">
            {z}
          </text>
        </g>
      ))}
      <path d={`${line} L${right} ${bot} L${left} ${bot} Z`} className="g-ct-parea" />
      <path d={line} className="g-ct-pline" />
      <line x1={left} x2={right} y1={bot} y2={bot} className="g-ct-paxis" />
      <text x={left} y={h - 2} textAnchor="middle" className="g-ct-pend">
        A
      </text>
      <text x={right} y={h - 2} textAnchor="middle" className="g-ct-pend">
        B
      </text>
    </svg>
  )
}
