import { plain } from '../core/markup'
import { assignLanes } from './math'
import { Fallback, Svg, fmt, textWidth, useSvgId, type DiagramProps } from './util'

/** Universal indicator colours for pH 0 … 14. */
export const PH_COLORS = [
  '#e8212a', '#ef4a23', '#f47a20', '#fbb316', '#f5e60d', '#b5d334', '#84c341', '#4db848',
  '#23a455', '#0fa38b', '#1b8fc4', '#3a64b0', '#4d4da3', '#613b94', '#4b2b7f',
]
const DARK_NUMBERS = new Set([0, 1, 10, 11, 12, 13, 14])

export const DEFAULT_MARKS = [
  { ph: 1.5, label: 'žaludeční šťáva' },
  { ph: 2, label: 'citron' },
  { ph: 3, label: 'ocet' },
  { ph: 5, label: 'káva' },
  { ph: 7, label: 'čistá voda' },
  { ph: 7.4, label: 'krev' },
  { ph: 8.5, label: 'jedlá soda' },
  { ph: 10, label: 'mýdlo' },
  { ph: 11.5, label: 'čpavek' },
  { ph: 14, label: 'čistič odpadů' },
]

function parseMarks(v: unknown): { ph: number; label: string }[] | null {
  if (v === undefined) return DEFAULT_MARKS
  if (!Array.isArray(v)) return null
  const out: { ph: number; label: string }[] = []
  for (const m of v) {
    if (!m || typeof m !== 'object') return null
    const { ph, label } = m as Record<string, unknown>
    if (typeof ph !== 'number' || !Number.isFinite(ph) || ph < 0 || ph > 14 || typeof label !== 'string') return null
    out.push({ ph, label: plain(label) })
  }
  return out
}

const VW = 420
const X0 = 18
const X1 = 402
const BAR_H = 26
const LANE = 21
const FONT = 16

export default function PhScale({ props }: DiagramProps) {
  const gid = useSvgId()
  const marks = parseMarks(props.marks)
  if (!marks) return <Fallback id="ph-scale" reason="neplatné značky" />

  const px = (ph: number) => X0 + (ph / 14) * (X1 - X0)
  const sorted = [...marks].sort((a, b) => a.ph - b.ph)
  const placed = assignLanes(
    sorted.map((m) => ({ x: px(m.ph), w: textWidth(m.label, FONT, 0.47) + 4 })),
    2,
    VW - 2,
  )
  const above = Math.max(0, ...placed.filter((p) => p.lane % 2 === 0).map((p) => p.lane / 2 + 1))
  const below = Math.max(0, ...placed.filter((p) => p.lane % 2 === 1).map((p) => (p.lane - 1) / 2 + 1))
  const barY = 10 + above * LANE + (above ? 10 : 0)
  const barB = barY + BAR_H
  const regionY = barB + below * LANE + (below ? 12 : 0) + 26
  const H = regionY + 10

  return (
    <div className="dg dg-ph">
      <Svg
        w={VW}
        h={H}
        max={640}
        label={`Stupnice pH od 0 do 14: pod 7 kyselé, 7 neutrální, nad 7 zásadité.${
          sorted.length ? ' ' + sorted.map((m) => `${m.label} pH ${fmt(m.ph)}`).join(', ') + '.' : ''
        }`}
      >
        <defs>
          <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
            {PH_COLORS.map((c, i) => (
              <stop key={i} offset={i / 14} stopColor={c} />
            ))}
          </linearGradient>
        </defs>

        <rect className="dg-rule" x={X0 - 4} y={barY - 4} width={X1 - X0 + 8} height={BAR_H + 8} rx={10} />
        <rect x={X0} y={barY} width={X1 - X0} height={BAR_H} rx={7} fill={`url(#${gid})`} className="dg-outline" />
        {Array.from({ length: 15 }, (_, i) => (
          <text
            key={i}
            className="dg-mono dg-ph-num"
            x={Math.min(Math.max(px(i), X0 + 8), X1 - 9)}
            y={barY + BAR_H / 2 + 4}
            textAnchor="middle"
            fill={DARK_NUMBERS.has(i) ? '#fff' : '#26221e'}
          >
            {i}
          </text>
        ))}

        {sorted.map((m, i) => {
          const p = placed[i]
          const up = p.lane % 2 === 0
          const row = up ? p.lane / 2 : (p.lane - 1) / 2
          const ty = up ? barY - 12 - row * LANE : barB + 20 + row * LANE
          const mx = px(m.ph)
          const edge = up ? barY : barB
          const lineEnd = up ? ty + 5 : ty - 14
          return (
            <g className="dg-mark" key={i} tabIndex={0}>
              <title>{`${m.label}: pH ${fmt(m.ph)}`}</title>
              <line className="dg-leader" x1={mx} y1={edge} x2={mx} y2={lineEnd} />
              <circle className="dg-mark-dot" cx={mx} cy={edge} r={3.6} />
              <text className="dg-note dg-ink" x={p.x} y={ty} textAnchor="middle">
                {m.label}
              </text>
            </g>
          )
        })}

        <text className="dg-t dg-strong" x={X0} y={regionY}>
          ← kyselé
        </text>
        <text className="dg-t dg-strong" x={px(7)} y={regionY} textAnchor="middle">
          neutrální
        </text>
        <text className="dg-t dg-strong" x={X1} y={regionY} textAnchor="end">
          zásadité →
        </text>
      </Svg>
    </div>
  )
}
