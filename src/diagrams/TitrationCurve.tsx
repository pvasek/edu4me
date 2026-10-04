import { useMemo, useState } from 'react'
import { DEFAULT_TITRATION, equivalenceVolume, titrationPH } from './math'
import { ChemText, DrawPath, Fallback, Svg, fmt, oneOf, type DiagramProps } from './util'

const W = 400
const H = 294
const PL = 46
const PR = 388
const PT = 14
const PB = 250
const VMAX = 50

const X = (v: number) => PL + (v / VMAX) * (PR - PL)
const Y = (ph: number) => PB - (ph / 14) * (PB - PT)

const BANDS = [
  { name: 'fenolftalein', from: 8.2, to: 10, color: '#e64980' },
  { name: 'methyloranž', from: 3.1, to: 4.4, color: '#f76707' },
]

export default function TitrationCurve({ props }: DiagramProps) {
  const kind = oneOf(props.kind, ['strong-strong', 'weak-strong'] as const, null)
  const [hover, setHover] = useState<number | null>(null)
  const path = useMemo(() => {
    if (!kind) return ''
    const vs: number[] = []
    for (let v = 0; v <= VMAX + 1e-9; v += v > 23 && v < 27 ? 0.02 : 0.25) vs.push(v)
    return vs.map((v, i) => `${i ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(titrationPH(kind, v)).toFixed(1)}`).join(' ')
  }, [kind])
  if (!kind) return <Fallback id="titration-curve" reason="kind musí být strong-strong nebo weak-strong" />

  const weak = kind === 'weak-strong'
  const s = DEFAULT_TITRATION
  const vEq = equivalenceVolume(s)
  const phEq = titrationPH(kind, vEq)
  const vHalf = vEq / 2
  const phHalf = titrationPH(kind, vHalf)
  const acid = weak ? 'CH_{3}COOH' : 'HCl'

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width) return
    const sx = ((e.clientX - r.left) / r.width) * W
    const v = ((sx - PL) / (PR - PL)) * VMAX
    setHover(v < -2 || v > VMAX + 2 ? null : Math.min(VMAX, Math.max(0, v)))
  }
  const hv = hover
  const hph = hv !== null ? titrationPH(kind, hv) : 0

  return (
    <div className="dg dg-titration">
      <Svg
        w={W}
        h={H}
        max={600}
        className="dg-touch"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        label={`Titrační křivka: ${fmt(s.va, 0)} cm³ ${weak ? 'kyseliny octové' : 'kyseliny chlorovodíkové'} 0,1 mol/dm³ titrované NaOH 0,1 mol/dm³. Na začátku pH ${fmt(titrationPH(kind, 0))}, bod ekvivalence při ${fmt(vEq, 0)} cm³ a pH ${fmt(phEq)}. Barevné pásy: fenolftalein pH 8,2–10, methyloranž pH 3,1–4,4.`}
      >
        {/* indicator bands */}
        {BANDS.map((b) => (
          <g key={b.name}>
            <rect x={PL} y={Y(b.to)} width={PR - PL} height={Y(b.from) - Y(b.to)} fill={b.color} fillOpacity={0.16} />
            <text className="dg-note" x={PR - 4} y={(Y(b.to) + Y(b.from)) / 2 + 5} textAnchor="end" fill={b.color} style={{ fill: b.color }}>
              {b.name}
            </text>
          </g>
        ))}

        {/* grid + axes */}
        {[0, 2, 4, 6, 8, 10, 12, 14].map((ph) => (
          <g key={ph}>
            {ph > 0 && <line className="dg-grid" x1={PL} x2={PR} y1={Y(ph)} y2={Y(ph)} />}
            <text className="dg-mono dg-tick" x={PL - 7} y={Y(ph) + 4} textAnchor="end">
              {ph}
            </text>
          </g>
        ))}
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <text key={v} className="dg-mono dg-tick" x={X(v)} y={PB + 16} textAnchor="middle">
            {v}
          </text>
        ))}
        <line className="dg-axis-line" x1={PL} y1={PT - 4} x2={PL} y2={PB} />
        <line className="dg-axis-line" x1={PL} y1={PB} x2={PR + 4} y2={PB} />
        <text className="dg-t dg-strong" x={PL - 7} y={PT - 2} textAnchor="end">
          pH
        </text>
        <text className="dg-t dg-muted" x={PR} y={PB + 36} textAnchor="end">
          V(NaOH) / cm³
        </text>

        {/* setup */}
        <text className="dg-t dg-small" x={PL + 8} y={PT + 16}>
          {fmt(s.va, 0)} cm³ <ChemText text={acid} />, c = 0,1 mol/dm³
        </text>
        <text className="dg-t dg-small dg-muted" x={PL + 8} y={PT + 33}>
          + NaOH, c = 0,1 mol/dm³
        </text>

        {/* curve */}
        <DrawPath className="dg-curve dg-curve-main" d={path} duration={1.6} />

        {/* half-equivalence */}
        {weak && (
          <g>
            <path className="dg-guide" d={`M${PL} ${Y(phHalf)} H${X(vHalf)} V${PB}`} />
            <circle className="dg-point dg-point-alt" cx={X(vHalf)} cy={Y(phHalf)} r={5} />
            <text className="dg-note" x={X(vHalf) - 4} y={Y(phHalf) - 44} textAnchor="middle">
              polovina ekvivalence
            </text>
            <text className="dg-t dg-small dg-strong" x={X(vHalf) - 4} y={Y(phHalf) - 26} textAnchor="middle">
              pH = pKₐ = {fmt(s.pKa, 2)}
            </text>
          </g>
        )}

        {/* equivalence */}
        <path className="dg-guide" d={`M${PL} ${Y(phEq)} H${X(vEq)} V${PB}`} />
        <circle className="dg-point" cx={X(vEq)} cy={Y(phEq)} r={5.5} />
        <text className="dg-note" x={X(vEq) + 12} y={Y(phEq) + 22}>
          bod ekvivalence
        </text>
        <text className="dg-t dg-small dg-strong" x={X(vEq) + 12} y={Y(phEq) + 39}>
          {fmt(vEq, 0)} cm³, pH {weak ? '≐' : '='} {fmt(phEq)}
        </text>

        {/* readout */}
        {hv !== null && (
          <g className="dg-readout" pointerEvents="none">
            <line className="dg-guide dg-guide-live" x1={X(hv)} x2={X(hv)} y1={PT} y2={PB} />
            <circle className="dg-point dg-point-live" cx={X(hv)} cy={Y(hph)} r={5} />
            <rect x={hv > 30 ? X(hv) - 150 : X(hv) + 8} y={PT + 40} width={142} height={24} rx={6} />
            <text x={hv > 30 ? X(hv) - 79 : X(hv) + 79} y={PT + 56} textAnchor="middle">
              {fmt(hv)} cm³ → pH {fmt(hph, 2)}
            </text>
          </g>
        )}
      </Svg>
    </div>
  )
}
