/** Shared pieces of the industrial flow sheets (Haber, contact, Ostwald). */
import type { ReactNode } from 'react'
import { ChemText, Eq, Fade, pat, useFig } from './kit'

/** Numbered step badge (level colour). */
export function Badge({ x, y, n, r = 10 }: { x: number; y: number; n: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="f67-lvl-f f67-o f67-thin" />
      <text x={x} y={y + r * 0.42} textAnchor="middle" className="f67-badge-n">
        {n}
      </text>
    </g>
  )
}

export interface Step {
  eq: string
  note: string
}

/** Numbered list of equations with notes (below the flow sheet). */
export function StepList({
  x,
  y,
  steps,
  gap = 44,
  delay = 1.2,
  cols = 1,
  colW = 230,
}: {
  x: number
  y: number
  steps: Step[]
  gap?: number
  delay?: number
  cols?: number
  colW?: number
}) {
  return (
    <g>
      {steps.map((s, i) => {
        const cx = x + (i % cols) * colW
        const cy = y + Math.floor(i / cols) * gap
        return (
          <Fade key={i} delay={delay + i * 0.2}>
            <Badge x={cx + 10} y={cy - 5} n={i + 1} />
            <Eq x={cx + 26} y={cy} t={s.eq} />
            <text x={cx + 26} y={cy + 19} className="f67-lbl f67-sm">
              <ChemText text={s.note} />
            </text>
          </Fade>
        )
      })}
    </g>
  )
}

/** Upright process vessel with domed ends; children are drawn inside (clipped). */
export function Vessel({ x, y, w, h, children, fill = 'f67-fill' }: { x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string }) {
  const { id } = useFig()
  const r = Math.min(w / 2, 18)
  const d = `M${x} ${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r}Z`
  const cid = `${id}-v${Math.round(x)}-${Math.round(y)}`
  return (
    <g>
      <path d={d} className={fill} />
      <clipPath id={cid}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#${cid})`}>{children}</g>
      <path d={d} className="f67-o f67-thick" />
      {/* engraved shading on the right flank */}
      <path d={`M${x + w - 8} ${y + r} V${y + h - r}`} className="f67-o f67-thin" style={{ opacity: 0.5 }} />
    </g>
  )
}

/** Catalyst bed: cross-hatched band inside a vessel. */
export function Bed({ x, y, w, h = 16, color }: { x: number; y: number; w: number; h?: number; color: string }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.55} />
      <rect x={x} y={y} width={w} height={h} fill={pat(id, 'xd')} />
      <path d={`M${x} ${y} H${x + w} M${x} ${y + h} H${x + w}`} className="f67-o f67-thin" />
    </g>
  )
}

/** Compressor symbol: circle with a spinning impeller. */
export function Compressor({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="f67-o f67-thick f67-fill2" />
      <g className="f67-spin">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={`M${x} ${y} Q${x + r * 0.3} ${y - r * 0.5} ${x} ${y - r * 0.78}`} className="f67-o" transform={`rotate(${a} ${x} ${y})`} />
        ))}
      </g>
      <circle cx={x} cy={y} r={4} className="f67-o f67-fill" />
    </g>
  )
}

/** Cooling coil in a water jacket. */
export function Cooler({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const { id } = useFig()
  let coil = `M${x + 8} ${y + 10}`
  const dd = (h - 20) / 12
  for (let k = 0; k < 3; k++) coil += ` H${x + w - 14} q8 0 8 ${dd} t-8 ${dd} H${x + 14} q-8 0 -8 ${dd} t8 ${dd}`
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#6f9fd8" fillOpacity={0.22} />
      <rect x={x} y={y} width={w} height={h} rx={6} fill={pat(id, 'h')} />
      <path d={coil} className="f67-o" />
      <rect x={x} y={y} width={w} height={h} rx={6} className="f67-o f67-thick" />
    </g>
  )
}
