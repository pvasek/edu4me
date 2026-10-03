import { useState } from 'react'
import { Plate, SvgMd, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { bacteria, bakterie, dotPositions, dotScale, hm } from './bacterial-growth.model'

/** "Vyzkoušej si" for b2-2: one bacterium divides again and again; the dish and the graph show how fast. */

const T_MAX = 480 // min
const MILLION = 1_000_000

// dish
const DX = 74
const DY = 104
const DR = 62
// graph
const GX0 = 186
const GX1 = 344
const GY0 = 26 // top
const GY1 = 178 // bottom

type Axis = 'lin' | 'log'
const LOG_MAX = 8 // 10⁸

/** a rough "nice" upper bound: 1, 2 or 5 × 10ⁿ */
function niceCeil(v: number): number {
  const m = 10 ** Math.floor(Math.log10(v))
  const f = v / m
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * m
}

/** "16 mil.", "500 tis.", "250" */
function shortNum(n: number): string {
  if (n >= MILLION) return `${czNum(n / MILLION)} mil.`
  if (n >= 1000) return `${czNum(n / 1000)} tis.`
  return czNum(n)
}

function growthLabel(t: number, td: number, axis: Axis): string {
  const { generations, count } = bacteria(t, td)
  const { perDot } = dotScale(count)
  return (
    `Petriho miska po ${hm(t)}: jedna bakterie se dělí každých ${td} minut, po ${generations} děleních je jich ${count.toLocaleString('cs-CZ')}` +
    (perDot > 1 ? ` (jedna tečka znamená ${perDot.toLocaleString('cs-CZ')} ${bakterie(perDot)})` : '') +
    `. Vedle graf počtu bakterií v čase s ${axis === 'log' ? 'logaritmickou osou, na které je růst přímka' : 'lineární osou, na které křivka dlouho leží u nuly a pak prudce vystřelí'}.`
  )
}

function Dish({ count }: { count: number }) {
  const { id } = usePlate()
  const { perDot, dots } = dotScale(count)
  const pos = dotPositions(dots, DR - 7)
  // each bacterium a short rod (E. coli is a rod about 2 µm long)
  let rods = ''
  pos.forEach(([x, y], i) => {
    const a = i * 2.4
    const cx = DX + x
    const cy = DY + y
    rods += `M${(cx - Math.cos(a) * 1.6).toFixed(1)} ${(cy - Math.sin(a) * 1.6).toFixed(1)}l${(Math.cos(a) * 3.2).toFixed(1)} ${(Math.sin(a) * 3.2).toFixed(1)}`
  })
  return (
    <g>
      <circle cx={DX} cy={DY} r={DR + 5} className="ph-glass" />
      <circle cx={DX} cy={DY} r={DR + 5} fill={url(id, 'd')} opacity={0.35} />
      <circle cx={DX} cy={DY} r={DR} className="xp-bg-agar" />
      <circle cx={DX} cy={DY} r={DR + 5} className="ph-o" />
      <circle cx={DX} cy={DY} r={DR} className="ph-o ph-thin" />
      <path d={rods} className="xp-bg-rod" />
      <text x={DX} y={DY + DR + 26} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        1 tečka = {perDot.toLocaleString('cs-CZ')} {bakterie(perDot)}
      </text>
    </g>
  )
}

function Graph({ t, td, axis }: { t: number; td: number; axis: Axis }) {
  const { id } = usePlate()
  const top = axis === 'lin' ? niceCeil(bacteria(T_MAX, td).count) : 10 ** LOG_MAX
  const X = (m: number) => GX0 + ((GX1 - GX0) * m) / T_MAX
  const Y = (n: number) =>
    axis === 'lin' ? GY1 - ((GY1 - GY0) * n) / top : GY1 - ((GY1 - GY0) * Math.log10(Math.max(1, n))) / LOG_MAX
  // the staircase: every division doubles the count
  const stairs = (from: number, to: number) => {
    let d = `M${X(from).toFixed(1)} ${Y(bacteria(from, td).count).toFixed(1)}`
    for (let k = Math.floor(from / td) + 1; k * td <= to; k++) {
      const m = k * td
      d += `H${X(m).toFixed(1)}V${Y(2 ** k).toFixed(1)}`
    }
    return d + `H${X(to).toFixed(1)}`
  }
  const yTicks: { v: number; text: string }[] =
    axis === 'lin'
      ? [
          { v: 0, text: '0' },
          { v: top / 2, text: shortNum(top / 2) },
          { v: top, text: shortNum(top) },
        ]
      : [0, 2, 4, 6, 8].map((e) => ({ v: 10 ** e, text: e === 0 ? '1' : `10^{${e}}` }))
  const { count } = bacteria(t, td)
  const showMillion = axis === 'log' || top >= MILLION
  return (
    <g>
      {yTicks.map((k) => (
        <g key={k.v}>
          <path d={`M${GX0} ${Y(k.v).toFixed(1)}H${GX1}`} className="ph-grid" />
          <text x={GX0 - 5} y={Y(k.v) + 4} textAnchor="end" className="ph-num">
            <SvgMd text={k.text} />
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8].map((h) => (
        <text key={h} x={X(h * 60)} y={GY1 + 15} textAnchor="middle" className="ph-num">
          {h}
        </text>
      ))}
      <text x={GX1} y={GY1 + 30} textAnchor="end" className="ph-unit">
        čas (h)
      </text>
      {showMillion && (
        <g>
          <path d={`M${GX0} ${Y(MILLION).toFixed(1)}H${GX1}`} className="ph-o ph-thin ph-dash xp-bg-million" />
          <text x={GX0 + 4} y={Y(MILLION) - 4} className="ph-lbl ph-lbl-sm ph-halo">
            milion
          </text>
        </g>
      )}
      <path d={stairs(0, T_MAX)} className="ph-series ph-dash xp-bg-future" />
      <path d={stairs(0, t)} className="ph-series xp-bg-past" />
      <path d={`M${X(t).toFixed(1)} ${GY0}V${GY1}`} className="ph-guide" />
      <circle cx={X(t)} cy={Y(count)} r={4} className="xp-bg-now" />
      <path d={`M${GX0} ${GY0 - 8}V${GY1}H${GX1 + 6}`} className="ph-o" markerEnd={url(id, 'as-ink')} />
      <text x={GX0 - 4} y={GY0 - 13} className="ph-unit">
        počet bakterií
      </text>
    </g>
  )
}

export default function BacterialGrowth() {
  const [t, setT] = useState(60)
  const [td, setTd] = useState(20)
  const [axis, setAxis] = useState<Axis>('lin')
  const nar = useNarrow()
  const { generations, count } = bacteria(t, td)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[4, 2, 352, 230]} max={480} label={growthLabel(t, td, axis)} className="xp-bg">
          <Dish count={count} />
          <Graph t={t} td={td} axis={axis} />
        </Plate>
      }
      controls={
        <>
          <Control label="čas t" value={t} min={0} max={T_MAX} step={10} format={hm} onChange={setT} />
          <Control label="doba zdvojení" unit="min" value={td} min={20} max={60} step={5} onChange={setTd} />
          <Choice
            label="osa y grafu"
            value={axis}
            onChange={setAxis}
            options={[
              { value: 'lin', label: 'lineární' },
              { value: 'log', label: 'logaritmická' },
            ]}
          />
        </>
      }
      readouts={
        <>
          <Readout label="počet bakterií" value={count} digits={0} />
          <Readout label="počet dělení" value={generations} digits={0} />
        </>
      }
      challenge="Za jak dlouho bude bakterií přes milion?"
      done={count > MILLION}
    />
  )
}
