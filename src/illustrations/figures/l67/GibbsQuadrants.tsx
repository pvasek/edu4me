import { ChemText, DrawArrow, Eq, Fade, Figure, Flame, Pop, pat, useCompact, useFig } from './kit'

type Icon = 'fire' | 'leaf' | 'freeze' | 'melt'
interface Quad {
  col: 0 | 1
  row: 0 | 1
  signs: string
  verdict: [string, string]
  tone: string
  tint: string
  icon: Icon
  example: [string, string?]
}

// columns: ΔS < 0 | ΔS > 0; rows: ΔH > 0 (top) | ΔH < 0 (bottom)
const QUADS: Quad[] = [
  { col: 0, row: 0, signs: 'ΔH > 0 · ΔS < 0', verdict: ['nikdy', 'samovolná'], tone: 'f67-red-t', tint: 'var(--bad-soft)', icon: 'leaf', example: ['fotosyntéza', '(jen díky světlu)'] },
  { col: 1, row: 0, signs: 'ΔH > 0 · ΔS > 0', verdict: ['jen při', 'vysoké teplotě'], tone: 'f67-acc-t', tint: 'var(--warn-soft)', icon: 'melt', example: ['tání ledu,', 'rozklad CaCO_{3}'] },
  { col: 0, row: 1, signs: 'ΔH < 0 · ΔS < 0', verdict: ['jen při', 'nízké teplotě'], tone: 'f67-blue-t', tint: 'var(--info-soft)', icon: 'freeze', example: ['mrznutí vody'] },
  { col: 1, row: 1, signs: 'ΔH < 0 · ΔS > 0', verdict: ['samovolná', 'vždy'], tone: 'f67-green-t', tint: 'var(--good-soft)', icon: 'fire', example: ['hoření'] },
]

function Leaf({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  const d = `M${x - 22} ${y + 14} C${x - 22} ${y - 10} ${x} ${y - 22} ${x + 24} ${y - 18} C${x + 22} ${y + 4} ${x + 4} ${y + 22} ${x - 22} ${y + 14}Z`
  return (
    <g>
      <path d={d} fill="#5f8f4e" />
      <path d={d} fill={pat(id, 'd')} />
      <path d={d} className="f67-o" />
      <path d={`M${x - 26} ${y + 20} L${x - 18} ${y + 10} Q${x} ${y - 4} ${x + 18} ${y - 14}`} className="f67-o f67-thin" />
      {/* sunlight */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${x + 34 + i * 3} ${y - 16 + i * 8} l-7 3`} className="f67-o" style={{ stroke: '#c9962c', strokeWidth: 2 }} />
      ))}
    </g>
  )
}

function Cube({ x, y, s = 30 }: { x: number; y: number; s?: number }) {
  const { id } = useFig()
  const h = s / 2
  const top = `M${x - h} ${y - h} L${x - h + 8} ${y - h - 7} H${x + h + 8} L${x + h} ${y - h}Z`
  const side = `M${x + h} ${y - h} L${x + h + 8} ${y - h - 7} V${y + h - 7} L${x + h} ${y + h}Z`
  return (
    <g>
      <rect x={x - h} y={y - h} width={s} height={s} rx={2} className="f67-ice" />
      <rect x={x - h} y={y - h} width={s} height={s} rx={2} fill={pat(id, 'hi')} />
      <path d={top} className="f67-ice f67-ice-2" />
      <path d={side} className="f67-ice f67-ice-3" />
      <rect x={x - h} y={y - h} width={s} height={s} rx={2} className="f67-o f67-thin" />
      <path d={top} className="f67-o f67-thin" />
      <path d={side} className="f67-o f67-thin" />
    </g>
  )
}

function Snowflake({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g className="f67-o f67-snow">
      {[0, 60, 120].map((a) => {
        const t = (a * Math.PI) / 180
        return <path key={a} d={`M${x - Math.cos(t) * r} ${y - Math.sin(t) * r} L${x + Math.cos(t) * r} ${y + Math.sin(t) * r}`} />
      })}
    </g>
  )
}

function IconArt({ k, x, y }: { k: Icon; x: number; y: number }) {
  if (k === 'fire')
    return (
      <g>
        <Flame x={x} y={y + 14} h={40} w={13} />
        <rect x={x - 24} y={y + 14} width={48} height={9} rx={4} fill="#8a5a33" className="f67-o" transform={`rotate(-8 ${x} ${y + 18})`} />
        <rect x={x - 24} y={y + 14} width={48} height={9} rx={4} fill="#8a5a33" className="f67-o" transform={`rotate(8 ${x} ${y + 18})`} />
      </g>
    )
  if (k === 'leaf') return <Leaf x={x} y={y} />
  if (k === 'freeze')
    return (
      <g>
        <path d={`M${x - 36} ${y - 6} q4 -8 8 0 q-4 8 -8 0Z`} className="f67-drop" />
        <path d={`M${x - 22} ${y - 2} H${x - 10}`} className="f67-arr f67-arr-blue" />
        <Cube x={x + 8} y={y + 2} />
        <Snowflake x={x + 30} y={y - 20} />
      </g>
    )
  return (
    <g>
      <Cube x={x - 4} y={y - 8} s={26} />
      <path d={`M${x - 4} ${y + 7} q3 5 0 8 q-3 -3 0 -8Z`} className="f67-drop" />
      <ellipse cx={x} cy={y + 20} rx={26} ry={3.5} className="f67-puddle" />
    </g>
  )
}

function Quadrant({ q, x, y, w, h, i }: { q: Quad; x: number; y: number; w: number; h: number; i: number }) {
  const cx = x + w / 2
  const d = 0.5 + i * 0.25
  return (
    <g>
      <Fade delay={d - 0.3}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={q.tint} className="f67-quad" />
      </Fade>
      <Pop delay={d}>
        <Eq x={cx} y={y + 22} t={q.signs} anchor="middle" className="f67-eq-sm f67-muted-t" />
        <text x={cx} y={y + 48} textAnchor="middle" className={`f67-lbl f67-b f67-big ${q.tone}`}>
          {q.verdict[0]}
        </text>
        <text x={cx} y={y + 70} textAnchor="middle" className={`f67-lbl f67-b f67-big ${q.tone}`}>
          {q.verdict[1]}
        </text>
      </Pop>
      <Pop delay={d + 0.2}>
        <IconArt k={q.icon} x={cx} y={y + (q.example[1] ? 102 : 110)} />
      </Pop>
      <Fade delay={d + 0.3}>
        <text x={cx} y={y + h - (q.example[1] ? 30 : 14)} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          <ChemText text={q.example[0]} />
        </text>
        {q.example[1] && (
          <text x={cx} y={y + h - 12} textAnchor="middle" className="f67-lbl f67-sm">
            <ChemText text={q.example[1]} />
          </text>
        )}
      </Fade>
    </g>
  )
}

export default function GibbsQuadrants() {
  const compact = useCompact()
  const n = compact.narrow
  const W = n ? 340 : 520
  const cx = W / 2
  const top = 94
  const qh = 178
  const cy = top + qh + 10
  const qw = cx - 22
  return (
    <Figure
      level={6}
      w={W}
      h={top + 2 * qh + 44}
      max={600}
      compact={compact}
      boost={false}
      label="Kdy probíhá reakce samovolně: ΔG = ΔH − TΔS a reakce je samovolná, když ΔG < 0. Osy dělí možnosti na čtyři kvadranty. ΔH < 0 a ΔS > 0: samovolná vždy, například hoření. ΔH > 0 a ΔS < 0: nikdy samovolná, například fotosyntéza, která probíhá jen díky energii světla. ΔH < 0 a ΔS < 0: samovolná jen při nízké teplotě, například mrznutí vody. ΔH > 0 a ΔS > 0: samovolná jen při vysoké teplotě, například tání ledu nebo rozklad uhličitanu vápenatého."
    >
      {/* formula */}
      <Pop delay={0.1}>
        <rect x={cx - 150} y={8} width={300} height={62} rx={6} className="f67-tag-lvl" />
        <Eq x={cx} y={36} t="ΔG = ΔH − T·ΔS" anchor="middle" className="f67-eq-lg f67-eq-xl" />
        <text x={cx} y={58} textAnchor="middle" className="f67-lbl f67-sm">
          samovolně probíhá, když ΔG &lt; 0
        </text>
      </Pop>

      {QUADS.map((q, i) => (
        <Quadrant key={i} q={q} i={i} x={q.col ? cx + 8 : 14} y={q.row ? cy + 8 : top - 2} w={qw} h={qh - 8} />
      ))}

      {/* axes */}
      <DrawArrow d={`M8 ${cy} H${W - 6}`} delay={0.2} className="f67-wide" />
      <DrawArrow d={`M${cx} ${top + 2 * qh + 20} V${top - 12}`} delay={0.3} className="f67-wide" />
      <Fade delay={0.5}>
        <text x={cx + 10} y={top - 2} className="f67-lbl f67-b f67-big f67-halo">
          ΔH
        </text>
        <text x={W - 8} y={cy - 8} textAnchor="end" className="f67-lbl f67-b f67-big f67-halo">
          ΔS
        </text>
        <circle cx={cx - 14} cy={top + 10} r={9} className="f67-badge" />
        <text x={cx - 14} y={top + 15} textAnchor="middle" className="f67-badge-t">
          +
        </text>
        <circle cx={cx - 14} cy={top + 2 * qh + 4} r={9} className="f67-badge" />
        <text x={cx - 14} y={top + 2 * qh + 9} textAnchor="middle" className="f67-badge-t">
          −
        </text>
        <circle cx={22} cy={cy + 18} r={9} className="f67-badge" />
        <text x={22} y={cy + 23} textAnchor="middle" className="f67-badge-t">
          −
        </text>
        <circle cx={W - 22} cy={cy + 18} r={9} className="f67-badge" />
        <text x={W - 22} y={cy + 23} textAnchor="middle" className="f67-badge-t">
          +
        </text>
      </Fade>
    </Figure>
  )
}
