import { DrawArrow, Draw, Fade, Figure, Pop, pat, useFig } from './kit'
import { wave } from './HeatTransfer'

const HOTC = '#d9493b'
const WARM = '#e8892a'
const COLD = '#3d6fd1'
const COOL = '#7fb0e0'

/** Coil (zigzag) from x1 to x2 around height y, as ' L…' segments. */
function coil(x1: number, x2: number, y: number, a = 14, n = 6) {
  const w = (x2 - x1) / n
  let d = ''
  for (let i = 0; i < n; i++) d += ` L${x1 + w * (i + 0.25)} ${y - a} L${x1 + w * (i + 0.75)} ${y + a}`
  return `${d} L${x2} ${y}`
}

function Tube({ d, color, delay }: { d: string; color: string; delay: number }) {
  return (
    <g>
      <Draw d={d} className="fz2-tube-o" delay={delay} />
      <Draw d={d} className="fz2-tube" delay={delay} style={{ stroke: color }} />
      <path d={d} className="fz2-flow" style={{ stroke: 'var(--surface)', strokeWidth: 2.2 }} />
    </g>
  )
}

export default function HeatPump() {
  return (
    <Figure
      level={4}
      w={400}
      h={440}
      max={540}
      label="Tepelné čerpadlo a lednice pracují ve stejném oběhu. Chladivo ve výparníku venku (nebo uvnitř lednice) se odpařuje a přijímá teplo Q₂ z okolí, i ze studeného vzduchu. Kompresor poháněný elektřinou páru stlačí, takže se zahřeje. V kondenzátoru v domě (nebo na zadní stěně lednice) pára zkapalní a odevzdá teplo Q₁. Expanzní ventil sníží tlak a chladivo se prudce ochladí. Platí Q₁ = Q₂ + W."
    >
      <Plate />
    </Figure>
  )
}

function Plate() {
  const { id } = useFig()
  const top = 150
  const bot = 300
  const l = 70
  const r = 330
  return (
    <g>
      {/* warm and cold sides */}
      <Fade delay={0}>
        <rect x={10} y={10} width={380} height={86} rx={8} className="fz2-warm-zone" />
        <rect x={10} y={346} width={380} height={50} rx={8} className="fz2-cold-zone" />
        <text x={24} y={34} className="fz2-lbl fz2-b fz2-red-t">
          v domě – teplá strana
        </text>
        <text x={24} y={388} className="fz2-lbl fz2-b fz2-blue-t">
          venku – studená strana
        </text>
      </Fade>

      {/* refrigerant loop: evaporator → compressor → condenser → valve */}
      <Tube d={`M${l} ${bot} H110${coil(110, 290, bot)}`} color={COLD} delay={0.1} />
      <Tube d={`M290 ${bot} H${r} V246`} color={COOL} delay={0.3} />
      <Tube d={`M${r} 186 V${top} H290${coil(290, 110, top)}`} color={HOTC} delay={0.4} />
      <Tube d={`M110 ${top} H${l} V196`} color={WARM} delay={0.6} />
      <Tube d={`M${l} 234 V${bot}`} color={COLD} delay={0.7} />

      {/* compressor */}
      <Pop delay={0.4}>
        <circle cx={r} cy={216} r={30} className="fz2-o fz2-fill2" />
        <circle cx={r} cy={216} r={30} fill={pat(id, 'd')} />
        <path d={`M${r - 14} 234 L${r} 196 L${r + 14} 234`} className="fz2-o fz2-thick" />
      </Pop>
      {/* expansion valve */}
      <Pop delay={0.5}>
        <path d={`M${l - 16} 196 L${l + 16} 196 L${l - 16} 234 L${l + 16} 234Z`} className="fz2-o fz2-fill" />
        <path d={`M${l} 215 H${l + 26}`} className="fz2-o" />
        <circle cx={l + 30} cy={215} r={4} className="fz2-o fz2-fill2" />
      </Pop>

      {/* heat and work */}
      {[140, 200, 260].map((x, i) => (
        <DrawArrow key={x} d={wave([x, top - 22], [x, 50], 2, 4)} tone="red" delay={0.9 + i * 0.08} />
      ))}
      {[140, 200, 260].map((x, i) => (
        <DrawArrow key={x} d={wave([x, 368], [x, bot + 22], 2, 4)} tone="blue" delay={1.0 + i * 0.08} />
      ))}
      <DrawArrow d={`M392 216 H${r + 38}`} tone="acc" delay={1.1} className="fz2-wide" />

      <Fade delay={1.2}>
        <text x={376} y={34} textAnchor="end" className="fz2-lbl fz2-b fz2-big fz2-red-t">
          Q₁
        </text>
        <text x={376} y={56} textAnchor="end" className="fz2-lbl fz2-sm">
          odevzdané teplo
        </text>
        <text x={376} y={372} textAnchor="end" className="fz2-lbl fz2-b fz2-big fz2-blue-t">
          Q₂
        </text>
        <text x={386} y={200} textAnchor="end" className="fz2-lbl fz2-b fz2-acc-t">
          W
        </text>

        <text x={200} y={top + 42} textAnchor="middle" className="fz2-lbl fz2-b">
          kondenzátor
        </text>
        <text x={200} y={top + 62} textAnchor="middle" className="fz2-lbl fz2-sm">
          pára kapalní a hřeje
        </text>
        <text x={200} y={bot - 50} textAnchor="middle" className="fz2-lbl fz2-b">
          výparník
        </text>
        <text x={200} y={bot - 30} textAnchor="middle" className="fz2-lbl fz2-sm">
          chladivo vře
        </text>
        <text x={r} y={270} textAnchor="middle" className="fz2-lbl fz2-b fz2-halo">
          kompresor
        </text>
        <text x={l + 12} y={258} className="fz2-lbl fz2-b">
          ventil
        </text>
        <rect x={40} y={406} width={320} height={30} rx={6} className="fz2-tag-lvl" />
        <text x={200} y={427} textAnchor="middle" className="fz2-eq fz2-eq-lg">
          Q₁ = Q₂ + W
        </text>
      </Fade>
    </g>
  )
}
