import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, Liquid, Val, pat, useFig } from './kit'

const W = 230
const H = 260
const WATER = '#5b8fd0'

/* ---------------------------------------------------------------- bottle with holes */
const SURF = 26
const BASIN = 244
const HOLES = [52, 82, 112]
const BX0 = 28
const BX1 = 74
const K = 0.6 // horizontal drawing scale of the jets

/** Jet from a hole at depth h under the surface: x = 2·√(h·s) for a drop s (Torricelli + free fall). */
function jet(y: number) {
  const h = y - SURF
  const pts: string[] = []
  for (let s = 0; s <= BASIN - y; s += 6) pts.push(`${(BX1 + K * 2 * Math.sqrt(h * s)).toFixed(1)} ${(y + s).toFixed(1)}`)
  const s = BASIN - y
  pts.push(`${(BX1 + K * 2 * Math.sqrt(h * s)).toFixed(1)} ${BASIN}`)
  return 'M' + pts.join(' L')
}

function Bottle() {
  const { id } = useFig()
  return (
    <g>
      {/* basin */}
      <path d={`M8 ${BASIN} H${W - 6}`} className="fz1-o" />
      <rect x={8} y={BASIN} width={W - 14} height={8} fill={pat(id, 'd')} />
      {/* stool */}
      <path d={`M${BX0 - 6} 176 H${BX1 + 6} M${BX0} 176 V${BASIN} M${BX1} 176 V${BASIN}`} className="fz1-o fz1-thick" />
      {/* bottle + water */}
      <Liquid d={`M${BX0} ${SURF} H${BX1} V174 H${BX0}Z`} color={WATER} opacity={0.4} />
      <path d={`M${BX0 + 12} 4 V14 Q${BX0} 16 ${BX0} 28 V174 H${BX1} V28 Q${BX1} 16 ${BX1 - 12} 14 V4`} className="fz1-o fz1-thick" />
      <path d={`M${BX0} ${SURF} H${BX1}`} className="fz1-o fz1-thin" />
      {HOLES.map((y, i) => (
        <g key={y}>
          <path d={jet(y)} className="fz1-jet" style={{ animationDelay: `${-i * 0.2}s` }} />
          <circle cx={BX1} cy={y} r={2.6} className="fz1-o fz1-fill" />
          <Arrow d={`M${BX1 - 6 - (i + 1) * 7} ${y} H${BX1 - 4}`} tone="lvl" />
        </g>
      ))}
      {/* depth of the lowest hole */}
      <path d={`M${BX0 - 8} ${SURF} V${HOLES[2]}`} className="fz1-o fz1-thin fz1-lvl-s" />
      <Val x={BX0 - 12} y={(SURF + HOLES[2]) / 2 + 5} t="h" anchor="end" className="fz1-lvl-t" />
      <text x={W - 8} y={24} textAnchor="end" className="fz1-lbl fz1-sm">
        hlouběji →
      </text>
      <text x={W - 8} y={41} textAnchor="end" className="fz1-lbl fz1-sm">
        delší proud
      </text>
    </g>
  )
}

/* ---------------------------------------------------------------- dam */
function Dam() {
  const { id } = useFig()
  const top = 40
  const bot = 224
  const face = 132
  const dam = `M${face} ${top - 10} H${face + 22} L${W - 10} ${bot} H${face}Z`
  return (
    <g>
      <Liquid d={`M10 ${top} H${face} V${bot} H10Z`} color={WATER} opacity={0.4} />
      <path d={`M10 ${top} H${face}`} className="fz1-o fz1-thin" />
      <path d={dam} fill="#b3aa98" className="fz1-o" />
      <path d={dam} fill={pat(id, 'dots')} />
      <path d={`M6 ${bot} H${W - 6}`} className="fz1-o" />
      <rect x={6} y={bot} width={W - 12} height={8} fill={pat(id, 'd')} />
      {[0.15, 0.35, 0.55, 0.75, 0.95].map((f) => {
        const y = top + f * (bot - top)
        const len = 12 + f * 70
        return <Arrow key={f} d={`M${face - 4 - len} ${y} H${face - 4}`} tone="lvl" />
      })}
      <text x={W - 8} y={top - 22} textAnchor="end" className="fz1-lbl fz1-sm">
        nahoře tenká
      </text>
      <text x={face + 10} y={bot - 14} className="fz1-lbl fz1-sm fz1-b fz1-halo">
        dole silná
      </text>
      <text x={14} y={top + 17} className="fz1-lbl fz1-sm fz1-lvl-t fz1-b fz1-halo">
        tlak roste s hloubkou
      </text>
    </g>
  )
}

/* ---------------------------------------------------------------- diver */
function Diver({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* tank */}
      <rect x={x - 14} y={y - 16} width={34} height={9} rx={4} fill="#c8453a" className="fz1-o" />
      {/* body */}
      <path d={`M${x - 20} ${y - 6} Q${x} ${y - 14} ${x + 26} ${y - 6} Q${x + 28} ${y + 2} ${x + 22} ${y + 3} H${x - 20} Q${x - 24} ${y - 1} ${x - 20} ${y - 6}Z`} fill="#2f2f36" className="fz1-o" />
      <circle cx={x + 32} cy={y - 7} r={7} fill="#2f2f36" className="fz1-o" />
      <rect x={x + 33} y={y - 11} width={7} height={5} rx={1.5} fill="#bfe0f0" className="fz1-o fz1-thin" />
      {/* legs + fins */}
      <path d={`M${x - 20} ${y - 2} L${x - 40} ${y + 2} M${x - 20} ${y + 2} L${x - 38} ${y + 9}`} className="fz1-o fz1-thick" />
      <path d={`M${x - 40} ${y + 2} l-12 -6 l0 10Z M${x - 38} ${y + 9} l-12 -2 l3 9Z`} fill="#e0b43a" className="fz1-o fz1-thin" />
      {/* arm with the gauge */}
      <path d={`M${x + 14} ${y} L${x + 22} ${y + 18}`} className="fz1-o fz1-thick" />
      <circle cx={x + 24} cy={y + 28} r={10} className="fz1-o fz1-fill" />
      <path d={`M${x + 24} ${y + 28} L${x + 30} ${y + 22}`} className="fz1-o fz1-red-s" />
    </g>
  )
}

function Diving() {
  const top = 30
  const m = 9 // units per metre
  return (
    <g>
      <Liquid d={`M40 ${top} H${W - 8} V${top + 22 * m} H40Z`} color={WATER} opacity={0.3} />
      <path d={`M40 ${top} H${W - 8}`} className="fz1-o fz1-thin" />
      {[0, 5, 10, 15, 20].map((d) => (
        <g key={d}>
          <line x1={34} x2={42} y1={top + d * m} y2={top + d * m} className="fz1-tickl" />
          <text x={30} y={top + d * m + 4} textAnchor="end" className="fz1-scale-n">
            {d} m
          </text>
        </g>
      ))}
      <Diver x={122} y={top + 20 * m - 14} />
      <text x={W - 10} y={top + 10 * m - 4} textAnchor="end" className="fz1-lbl fz1-sm">
        10 m: +100 kPa
      </text>
      <text x={W - 10} y={top + 20 * m - 36} textAnchor="end" className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
        20 m: +200 kPa
      </text>
      <path d={`M60 ${top + 10 * m} H${W - 12}`} className="fz1-row-ref" />
    </g>
  )
}

const LABEL =
  'Hydrostatický tlak roste s hloubkou: p = h·ρ·g. Z láhve s otvory v různých hloubkách stříká voda z nejhlubšího otvoru nejdál, protože tam je největší tlak. Hráz přehrady je dole silnější, protože tlak vody u dna je největší. Potápěč v hloubce 10 m má na sebe navíc tlak asi 100 kPa, ve 20 m asi 200 kPa.'

export default function HydrostaticPressure() {
  return (
    <Figure label={LABEL} max={720} interactive boost={false}>
      <div className="fz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            {
              title: 'láhev s otvory',
              caption: 'Čím hlouběji je otvor, tím větší tlak a tím dál voda stříká.',
              art: (
                <Frame w={W} h={H}>
                  <Bottle />
                </Frame>
              ),
            },
            {
              title: 'hráz přehrady',
              caption: 'U dna tlačí voda nejvíc, proto je hráz dole nejsilnější.',
              art: (
                <Frame w={W} h={H}>
                  <Dam />
                </Frame>
              ),
            },
            {
              title: 'potápěč',
              caption: 'Každých 10\u00a0m vody přidá asi 100\u00a0kPa: p = h·ρ·g = 10\u00a0m · 1\u00a0000\u00a0kg/m³ · 10\u00a0N/kg.',
              art: (
                <Frame w={W} h={H}>
                  <Diving />
                </Frame>
              ),
            },
          ]}
        />
        <p className="fz1-strip-note">hydrostatický tlak p = h · ρ · g</p>
      </div>
    </Figure>
  )
}
