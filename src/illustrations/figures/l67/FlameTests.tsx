import { Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const METALS = [
  { el: 'Li', name: ['karmínová'], col: '#c8102e', cat: 'var(--cat-alkali)' },
  { el: 'Na', name: ['žlutá'], col: '#f5b700', cat: 'var(--cat-alkali)' },
  { el: 'K', name: ['fialová'], col: '#b58ee0', cat: 'var(--cat-alkali)' },
  { el: 'Ca', name: ['cihlově', 'červená'], col: '#d9582b', cat: 'var(--cat-alkaline)' },
  { el: 'Sr', name: ['červená'], col: '#e3262e', cat: 'var(--cat-alkaline)' },
  { el: 'Ba', name: ['zelená'], col: '#9ccc3c', cat: 'var(--cat-alkaline)' },
  { el: 'Cu', name: ['modro-', 'zelená'], col: '#1fb5a0', cat: 'var(--cat-transition)' },
]

function Burner({ x, y, m, i }: { x: number; y: number; m: (typeof METALS)[number]; i: number }) {
  const { id } = useFig()
  const b = y + 200 // burner mouth
  const h = 92 + (i % 3) * 6
  const w = 15
  const flame = `M${x - w * 0.55} ${b} Q${x - w * 1.2} ${b - h * 0.35} ${x - w * 0.2} ${b - h * 0.75} Q${x + w * 0.1} ${b - h * 0.9} ${x} ${b - h} Q${x + w * 0.5} ${b - h * 0.7} ${x + w * 1.1} ${b - h * 0.4} Q${x + w * 1.1} ${b - h * 0.12} ${x + w * 0.55} ${b}Z`
  const cone = `M${x - 6} ${b} Q${x - 7} ${b - 18} ${x} ${b - 30} Q${x + 7} ${b - 18} ${x + 6} ${b}Z`
  return (
    <g>
      <Fade delay={0.36 + i * 0.07}>
        <ellipse cx={x} cy={b - h * 0.5} rx={w * 1.6} ry={h * 0.58} fill={m.col} fillOpacity={0.13} className="f67-glow" style={{ animationDelay: `${-i * 0.3}s` }} />
        <g className="f67-flicker" style={{ animationDelay: `${-i * 0.23}s` }}>
          <path d={flame} fill={m.col} fillOpacity={0.88} className="f67-flame-o" />
          <path d={cone} fill="#9fb8e8" fillOpacity={0.9} />
        </g>
        {/* platinum wire with the sample */}
        <path d={`M${x + 32} ${b - 64} L${x + 8} ${b - 44}`} className="f67-o f67-thin" style={{ stroke: '#8d939c' }} />
        <circle cx={x + 5} cy={b - 42} r={3} fill="#e8e4d8" className="f67-o f67-thin" />
      </Fade>
      <Pop delay={0.06 + i * 0.04}>
        <rect x={x - 7} y={b} width={14} height={60} className="f67-o f67-fill2" />
        <rect x={x - 7} y={b} width={14} height={60} fill={pat(id, 'd')} />
        <rect x={x - 9} y={b + 36} width={18} height={10} rx={2} className="f67-o f67-fill3" />
        <path d={`M${x - 22} ${b + 72} L${x - 16} ${b + 60} H${x + 16} L${x + 22} ${b + 72}Z`} className="f67-o f67-fill3" />
        <rect x={x - 24} y={b + 82} width={48} height={40} rx={4} fill={m.cat} className="f67-o" />
        <text x={x} y={b + 110} textAnchor="middle" className="f67-sym f67-dark-t">
          {m.el}
        </text>
      </Pop>
      <Fade delay={0.54 + i * 0.06}>
        {m.name.map((t, k) => (
          <text key={k} x={x} y={b + 142 + k * 17} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-keep">
            {t}
          </text>
        ))}
      </Fade>
    </g>
  )
}

export default function FlameTests() {
  const compact = useCompact()
  const n = compact.narrow
  const pos = METALS.map((_, i) => (n ? (i < 4 ? [45 + i * 80, 0] : [85 + (i - 4) * 80, 350]) : [39 + i * 72, 0]))
  return (
    <Figure
      level={7}
      w={n ? 330 : 506}
      h={n ? 720 : 372}
      max={680}
      compact={compact}
      boost={false}
      label="Plamenové zkoušky: sedm kahanů, do okraje plamene je vložen platinový drátek se solí kovu. Lithium barví plamen karmínově, sodík žlutě, draslík fialově, vápník cihlově červeně, stroncium červeně, baryum zeleně a měď modrozeleně."
    >
      {METALS.map((m, i) => (
        <Burner key={m.el} x={pos[i][0]} y={pos[i][1]} m={m} i={i} />
      ))}
    </Figure>
  )
}
