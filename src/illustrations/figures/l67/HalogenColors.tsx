import { ChemText, DrawArrow, Fade, Figure, Pop, pat, rng, useCompact, useFig } from './kit'

const JARS = [
  { f: 'F_{2}', name: 'fluor', state: ['světle žlutý', 'plyn'], bp: '−188 °C' },
  { f: 'Cl_{2}', name: 'chlor', state: ['žlutozelený', 'plyn'], bp: '−34 °C' },
  { f: 'Br_{2}', name: 'brom', state: ['červenohnědá', 'kapalina, páry'], bp: '59 °C' },
  { f: 'I_{2}', name: 'jod', state: ['fialově černé', 'krystaly, fialové páry'], bp: '184 °C' },
]

const TOP = 58
const BOT = 250

function Contents({ x, k }: { x: number; k: number }) {
  const { id } = useFig()
  const L = x - 36
  const W = 72
  const gas = (col: string, op: number, y0 = TOP + 10, y1 = BOT) => (
    <>
      <rect x={L} y={y0} width={W} height={y1 - y0} fill="#fffaf0" fillOpacity={0.14} />
      <rect x={L} y={y0} width={W} height={y1 - y0} fill={col} fillOpacity={op} />
      <rect x={L} y={y0} width={W} height={y1 - y0} fill={pat(id, 'dots')} />
    </>
  )
  if (k === 0) return gas('#e6df7a', 0.32)
  if (k === 1) return gas('#a9c23a', 0.55)
  if (k === 2)
    return (
      <>
        {gas('#a0461e', 0.18, TOP + 10, 150)}
        <g className="f67-drift">{gas('#a0461e', 0.38, 150, 214)}</g>
        <rect x={L} y={214} width={W} height={BOT - 214} fill="#6e1f0f" fillOpacity={0.95} />
        <rect x={L} y={214} width={W} height={BOT - 214} fill={pat(id, 'h')} />
        <path d={`M${L} 214 H${L + W}`} className="f67-o f67-thin" />
      </>
    )
  const r = rng(5)
  return (
    <>
      <g className="f67-drift">{gas('#7b3fa8', 0.3, TOP + 10, 226)}</g>
      {Array.from({ length: 9 }, (_, i) => {
        const cx = L + 8 + i * 7 + r() * 4
        const cy = BOT - 6 - r() * 10
        const s = 5 + r() * 4
        return <path key={i} d={`M${cx - s} ${cy} L${cx - s * 0.3} ${cy - s} L${cx + s * 0.8} ${cy - s * 0.6} L${cx + s} ${cy + 2} Z`} fill="#2e2238" className="f67-o f67-thin" />
      })}
      <path d={`M${L + 14} ${BOT - 16} l4 -4 M${L + 40} ${BOT - 14} l4 -4`} stroke="#c4a6d8" strokeWidth={1} />
    </>
  )
}

function Jar({ x, y, k }: { x: number; y: number; k: number }) {
  const j = JARS[k]
  return (
    <g transform={`translate(0 ${y})`}>
      <Pop delay={0.1 + k * 0.12}>
        <Contents x={x} k={k} />
        {/* gas jar with ground-glass stopper */}
        <path d={`M${x - 38} ${TOP + 6} V${BOT - 4} Q${x - 38} ${BOT + 2} ${x - 32} ${BOT + 2} H${x + 32} Q${x + 38} ${BOT + 2} ${x + 38} ${BOT - 4} V${TOP + 6}`} className="f67-o f67-thick" />
        <rect x={x - 44} y={TOP - 2} width={88} height={8} rx={2} className="f67-o f67-fill2" />
        <path d={`M${x - 28} ${TOP + 22} V${BOT - 20}`} className="f67-o f67-thin" style={{ opacity: 0.45 }} />
      </Pop>
      <Fade delay={0.6 + k * 0.12}>
        <text x={x} y={BOT + 30} textAnchor="middle" className="f67-eq f67-eq-lg">
          <ChemText text={j.f} />
        </text>
        <text x={x} y={BOT + 50} textAnchor="middle" className="f67-lbl f67-b f67-keep">
          {j.name}
        </text>
        {j.state.map((t, i) => (
          <text key={i} x={x} y={BOT + 68 + i * 16} textAnchor="middle" className="f67-lbl f67-sm f67-keep">
            {t}
          </text>
        ))}
        <text x={x} y={BOT + 114} textAnchor="middle" className="f67-lbl f67-sm f67-keep">
          t. v. <tspan className="f67-num">{j.bp}</tspan>
        </text>
      </Fade>
    </g>
  )
}

export default function HalogenColors() {
  const compact = useCompact()
  const n = compact.narrow
  const pos = n
    ? [
        [85, 0],
        [245, 0],
        [85, 330],
        [245, 330],
      ]
    : [
        [64, 0],
        [182, 0],
        [300, 0],
        [418, 0],
      ]
  const ty = n ? 752 : 418
  const W = n ? 330 : 482
  return (
    <Figure
      level={7}
      w={W}
      h={n ? 800 : 462}
      max={640}
      compact={compact}
      boost={false}
      label="Halogeny v odměrných válcích: fluor F2 je světle žlutý plyn, chlor Cl2 žlutozelený plyn, brom Br2 červenohnědá kapalina s hnědými parami a jod I2 fialově černé krystaly s fialovými parami. Směrem dolů ve skupině barva tmavne a teplota varu roste (−188 °C, −34 °C, 59 °C, 184 °C), elektronegativita klesá."
    >
      {JARS.map((_, k) => (
        <Jar key={k} x={pos[k][0]} y={pos[k][1]} k={k} />
      ))}
      <DrawArrow d={`M24 ${ty} H${W - 20}`} tone="lvl" delay={1.2} className="f67-wide" />
      <Fade delay={1.5}>
        {n ? (
          <>
            <text x={W / 2} y={ty - 30} textAnchor="middle" className="f67-lbl f67-b f67-lvl-t">
              dolů ve skupině: barva tmavne,
            </text>
            <text x={W / 2} y={ty - 10} textAnchor="middle" className="f67-lbl f67-b f67-lvl-t">
              teplota varu roste
            </text>
          </>
        ) : (
          <text x={W / 2} y={ty - 10} textAnchor="middle" className="f67-lbl f67-b f67-lvl-t">
            dolů ve skupině: barva tmavne, teplota varu roste
          </text>
        )}
        <text x={W / 2} y={ty + 24} textAnchor="middle" className="f67-lbl f67-sm f67-keep">
          elektronegativita klesá
        </text>
      </Fade>
    </Figure>
  )
}
