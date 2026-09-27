/** Small engraved scenery pieces shared by the nitrogen and carbon cycles. */
import { ChemText, pat, useFig } from './kit'

export function Soil({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const { id } = useFig()
  const top = `M${x} ${y} q20 -4 40 0` + ' t40 0'.repeat(Math.max(0, Math.ceil(w / 40) - 1))
  return (
    <g>
      <path d={`${top} V${y + h} H${x}Z`} fill="#9b7447" fillOpacity={0.28} />
      <path d={`${top} V${y + h} H${x}Z`} fill={pat(id, 'd')} />
      <path d={top} className="f67-o" />
    </g>
  )
}

export function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const d = `M${x} ${y} q${-18 * s} 0 ${-18 * s} ${-14 * s} q0 ${-14 * s} ${16 * s} ${-14 * s} q${4 * s} ${-16 * s} ${24 * s} ${-14 * s} q${14 * s} ${-12 * s} ${30 * s} ${2 * s} q${20 * s} ${-2 * s} ${20 * s} ${14 * s} q${12 * s} ${4 * s} ${6 * s} ${14 * s} Z`
  return <path d={d} className="f67-o f67-fill2" />
}

export function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <g className="f67-spin" style={{ animationDuration: '24s' }}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          return <line key={i} x1={x + Math.cos(a) * 20} y1={y + Math.sin(a) * 20} x2={x + Math.cos(a) * 28} y2={y + Math.sin(a) * 28} className="f67-o" style={{ stroke: '#c9962c' }} />
        })}
      </g>
      <circle cx={x} cy={y} r={15} fill="#f0c53a" className="f67-o" />
    </g>
  )
}

export function Tree({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <path d={`M${x - 6} ${y} Q${x - 4} ${y - 40} ${x - 5} ${y - 70} H${x + 5} Q${x + 4} ${y - 40} ${x + 7} ${y}Z`} fill="#8a5a33" className="f67-o" />
      <path d={`M${x - 4} ${y - 64} L${x - 20} ${y - 84} M${x + 4} ${y - 60} L${x + 22} ${y - 80}`} className="f67-o" />
      {[
        [0, -110, 34],
        [-26, -88, 24],
        [26, -86, 24],
      ].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={x + dx} cy={y + dy} r={r} fill="#5f8f4e" />
          <circle cx={x + dx} cy={y + dy} r={r} fill={pat(id, 'd')} />
          <circle cx={x + dx} cy={y + dy} r={r} className="f67-o" />
        </g>
      ))}
    </g>
  )
}

export function Rabbit({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x - 16} cy={y - 34} rx={4} ry={12} transform={`rotate(-12 ${x - 16} ${y - 34})`} className="f67-o f67-fill3" />
      <ellipse cx={x - 8} cy={y - 34} rx={4} ry={12} transform={`rotate(10 ${x - 8} ${y - 34})`} className="f67-o f67-fill3" />
      <ellipse cx={x + 8} cy={y - 12} rx={22} ry={13} className="f67-o f67-fill3" />
      <circle cx={x - 12} cy={y - 20} r={10} className="f67-o f67-fill3" />
      <circle cx={x + 30} cy={y - 16} r={4} className="f67-o f67-fill" />
      <circle cx={x - 15} cy={y - 22} r={1.4} className="f67-dot" />
      <path d={`M${x + 18} ${y} q6 -2 10 0 M${x - 6} ${y} q4 -2 8 0`} className="f67-o" />
    </g>
  )
}

export function Factory({ x, y, label }: { x: number; y: number; label?: string }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x + 50} y={y - 110} width={12} height={60} className="f67-o f67-fill3" />
      <g className="f67-drift">
        <path d={`M${x + 56} ${y - 116} q-10 -10 0 -20 q10 -10 0 -20`} className="f67-o f67-thin" style={{ opacity: 0.55 }} />
      </g>
      <path d={`M${x} ${y} V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y}Z`} className="f67-fill2" />
      <path d={`M${x} ${y} V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y}Z`} fill={pat(id, 'd')} />
      <path d={`M${x} ${y} V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y - 44} l18 -12 V${y}Z`} className="f67-o" />
      <rect x={x + 10} y={y - 30} width={10} height={12} className="f67-o f67-fill" />
      <rect x={x + 30} y={y - 30} width={10} height={12} className="f67-o f67-fill" />
      <rect x={x + 50} y={y - 30} width={10} height={12} className="f67-o f67-fill" />
      {label && (
        <text x={x + 36} y={y - 64} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          {label}
        </text>
      )}
    </g>
  )
}

/** Chemical species tag (rounded box with a formula). */
export function Tag({ x, y, t, w = 54 }: { x: number; y: number; t: string; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={26} rx={13} className="f67-tag-lvl" />
      <text x={x} y={y + 4} textAnchor="middle" className="f67-eq">
        <ChemText text={t} />
      </text>
    </g>
  )
}

/** Title banner in the sky. */
export function Banner({ x, y, w, children }: { x: number; y: number; w: number; children: React.ReactNode }) {
  return (
    <g>
      <path d={`M${x - w / 2} ${y - 16} H${x + w / 2} L${x + w / 2 + 12} ${y} L${x + w / 2} ${y + 16} H${x - w / 2} L${x - w / 2 - 12} ${y}Z`} className="f67-o f67-fill" />
      <text x={x} y={y + 6} textAnchor="middle" className="f67-lbl f67-b f67-big">
        {children}
      </text>
    </g>
  )
}
