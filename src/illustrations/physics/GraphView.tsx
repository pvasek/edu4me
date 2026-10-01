import type { GraphAxis, GraphMark, GraphSeries } from '../../core/types'
import {
  Draw,
  Fade,
  Label,
  Legend,
  Plate,
  SvgMd,
  czNum,
  f1,
  niceStep,
  placeBox,
  say,
  stepDigits,
  textW,
  ticks,
  toneAt,
  url,
  useNarrow,
  usePlate,
  type Box,
  type LegendItem,
} from './kit'

type Pt = [number, number]

/** Tick step for an axis: the content's `step`, or a nice one. */
export function axisStep(a: GraphAxis, target: number): number {
  return a.step && a.step > 0 ? a.step : niceStep(a.max - a.min, target)
}

/** SVG path through pixel points: straight segments, or a monotone cubic (no overshoot). */
export function seriesPath(pts: Pt[], smooth: boolean): string {
  if (!pts.length) return ''
  const mv = (p: Pt) => `${f1(p[0])} ${f1(p[1])}`
  const increasing = pts.every((p, i) => i === 0 || p[0] > pts[i - 1][0])
  if (!smooth || pts.length < 3 || !increasing) return 'M' + pts.map(mv).join(' L')
  // Fritsch–Carlson monotone cubic interpolation
  const n = pts.length
  const dx: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i])
  }
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
  t.push(m[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0
      t[i + 1] = 0
      continue
    }
    const a = t[i] / m[i]
    const b = t[i + 1] / m[i]
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      t[i] = k * a * m[i]
      t[i + 1] = k * b * m[i]
    }
  }
  let d = 'M' + mv(pts[0])
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += ` C${f1(pts[i][0] + h)} ${f1(pts[i][1] + t[i] * h)} ${f1(pts[i + 1][0] - h)} ${f1(pts[i + 1][1] - t[i + 1] * h)} ${mv(pts[i + 1])}`
  }
  return d
}

const STYLE_WORD = { line: 'čára', dashed: 'čárkovaná čára', dots: 'body', smooth: 'křivka' } as const

function axisText(a: GraphAxis) {
  return say(a.label) + (a.unit ? ` [${a.unit}]` : '')
}
const coord = (x: number, y: number) => `[${czNum(x)}; ${czNum(y)}]`

export function graphLabel(x: GraphAxis, y: GraphAxis, series: GraphSeries[], marks: GraphMark[] = []): string {
  const parts = [`Graf závislosti ${axisText(y)} na ${axisText(x)}.`]
  series.forEach((s, i) => {
    const name = s.label ? say(s.label) : series.length > 1 ? `Řada ${i + 1}` : 'Průběh'
    const p = s.points
    const pts = p.length <= 8 ? `body ${p.map(([a, b]) => coord(a, b)).join(', ')}` : `od ${coord(...p[0])} do ${coord(...p[p.length - 1])}`
    parts.push(`${name} (${STYLE_WORD[s.style ?? 'line']}): ${pts}${s.area ? ', plocha pod čarou je vybarvená' : ''}.`)
  })
  for (const m of marks) {
    if (m.x !== undefined && m.y !== undefined) parts.push(`Vyznačený bod ${coord(m.x, m.y)}: ${say(m.label)}.`)
    else if (m.x !== undefined) parts.push(`Svislá čára v ${say(x.label)} = ${czNum(m.x)}: ${say(m.label)}.`)
    else if (m.y !== undefined) parts.push(`Vodorovná čára v ${say(y.label)} = ${czNum(m.y)}: ${say(m.label)}.`)
  }
  return parts.join(' ')
}

function AxisTitle({ x, y, a, anchor }: { x: number; y: number; a: GraphAxis; anchor: 'start' | 'end' }) {
  return (
    <text x={f1(x)} y={f1(y)} textAnchor={anchor} className="ph-lbl ph-lbl-lg ph-halo">
      <SvgMd text={a.label} />
      {a.unit && <tspan className="ph-unit">{` [${a.unit}]`}</tspan>}
    </text>
  )
}

function Area({ d, tone }: { d: string; tone: string }) {
  const { id } = usePlate()
  return (
    <g className={`ph-tone-${tone}`}>
      <path d={d} className="ph-area-tint" />
      <path d={d} fill={url(id, `t${tone}`)} />
    </g>
  )
}

export function GraphView({
  x,
  y,
  series,
  marks = [],
}: {
  x: GraphAxis
  y: GraphAxis
  series: GraphSeries[]
  marks?: GraphMark[]
}) {
  const nar = useNarrow()
  const n = nar.narrow
  const W = n ? 340 : 560
  const H = n ? 256 : 310

  const xs = axisStep(x, n ? 4 : 6)
  const ys = axisStep(y, n ? 4 : 5)
  const xt = ticks(x.min, x.max, xs)
  const yt = ticks(y.min, y.max, ys)
  const xd = stepDigits(xs)
  const yd = stepDigits(ys)
  const tl = (v: number, d: number) => czNum(Math.round(v * 10 ** d) / 10 ** d)
  const yLabelW = Math.max(...yt.map((v) => tl(v, yd).length * 7), 7)

  const X0 = 14 + yLabelW + 8
  const X1 = W - 24
  const Y1 = 40
  const Y0 = H - 46
  const sx = (v: number) => X0 + ((v - x.min) / (x.max - x.min)) * (X1 - X0)
  const sy = (v: number) => Y0 - ((v - y.min) / (y.max - y.min)) * (Y0 - Y1)
  const ax = x.min <= 0 && x.max >= 0 ? sx(0) : X0
  const ay = y.min <= 0 && y.max >= 0 ? sy(0) : Y0
  const originZero = x.min <= 0 && x.max >= 0 && y.min <= 0 && y.max >= 0

  // thin x tick labels that would touch
  const xLabW = Math.max(...xt.map((v) => tl(v, xd).length * 7))
  const pxStep = (xs / (x.max - x.min)) * (X1 - X0)
  const every = pxStep > xLabW + 8 ? 1 : pxStep * 2 > xLabW + 8 ? 2 : 3

  const px = series.map((s) => s.points.map(([a, b]) => [sx(a), sy(b)] as Pt))
  const segs: [Pt, Pt][] = []
  for (const p of px) for (let i = 1; i < p.length; i++) segs.push([p[i - 1], p[i]])

  // mark labels
  const titleW = (a: GraphAxis) => textW(a.label, 19) + (a.unit ? (a.unit.length + 3) * 7.5 : 0)
  const xTitleY = ay === Y0 ? Y0 + 38 : ay - 9
  const taken: Box[] = [
    { x: ax + 9, y: Y1 - 32, w: titleW(y), h: 20 },
    { x: X1 + 18 - titleW(x), y: xTitleY - 16, w: titleW(x), h: 20 },
    // tick label rows
    { x: X0 - 4, y: ay + 5, w: X1 - X0 + 8, h: 15 },
    { x: ax - 8 - yLabelW, y: Y1 - 6, w: yLabelW + 4, h: Y0 - Y1 + 12 },
  ]
  const plot: Box = { x: X0, y: Y1 - 8, w: X1 - X0 + 10, h: Y0 - Y1 + 8 }
  const markEls = marks.map((m, i) => {
    const size = 14.5
    const w = textW(m.label, size) + 4
    const h = size
    const delay = 1.1 + i * 0.12
    if (m.x !== undefined && m.y !== undefined) {
      const cx = sx(m.x)
      const cy = sy(m.y)
      const c: Box[] = [
        { x: cx + 7, y: cy - 8 - h, w, h },
        { x: cx - 7 - w, y: cy - 8 - h, w, h },
        { x: cx + 8, y: cy + 6, w, h },
        { x: cx - 8 - w, y: cy + 6, w, h },
        { x: cx - w / 2, y: cy - 12 - h, w, h },
        { x: cx - w / 2, y: cy + 10, w, h },
      ]
      const b = placeBox(c, taken, segs, plot)
      return (
        <Fade key={i} delay={delay}>
          <path d={`M${f1(cx)} ${f1(ay)} V${f1(cy)} H${f1(ax)}`} className="ph-guide" />
          <circle cx={f1(cx)} cy={f1(cy)} r={4} className="ph-mark-dot" />
          <Label x={b.x + 2} y={b.y + h - 3} text={m.label} className="ph-lbl-sm ph-halo" />
        </Fade>
      )
    }
    if (m.x !== undefined) {
      const cx = sx(m.x)
      const right = cx + 6 + w < X1 + 10
      const b = placeBox(
        [
          right ? { x: cx + 5, y: Y1 - 4, w, h } : { x: cx - 5 - w, y: Y1 - 4, w, h },
          right ? { x: cx + 5, y: Y1 + 18, w, h } : { x: cx - 5 - w, y: Y1 + 18, w, h },
        ],
        taken,
        segs,
      )
      return (
        <Fade key={i} delay={delay}>
          <line x1={f1(cx)} x2={f1(cx)} y1={f1(Y0)} y2={f1(Y1 - 6)} className="ph-guide" />
          <Label x={b.x + 2} y={b.y + h - 3} text={m.label} className="ph-lbl-sm ph-halo" />
        </Fade>
      )
    }
    if (m.y !== undefined) {
      const cy = sy(m.y)
      const b = placeBox(
        [
          { x: X1 - w, y: cy - 5 - h, w, h },
          { x: X1 - w, y: cy + 4, w, h },
          { x: X0 + 8, y: cy - 5 - h, w, h },
          { x: X0 + 8, y: cy + 4, w, h },
        ],
        taken,
        segs,
      )
      return (
        <Fade key={i} delay={delay}>
          <line x1={f1(X0)} x2={f1(X1 + 4)} y1={f1(cy)} y2={f1(cy)} className="ph-guide" />
          <Label x={b.x + 2} y={b.y + h - 3} text={m.label} className="ph-lbl-sm ph-halo" />
        </Fade>
      )
    }
    return null
  })

  const labelled = series.filter((s) => s.label)
  const legend: LegendItem[] = series.flatMap((s, i) =>
    s.label
      ? [{ text: s.label, tone: toneAt(i, s.tone), kind: s.style === 'dots' ? 'dots' : s.style === 'dashed' ? 'dashed' : s.area ? 'area' : 'line' } as LegendItem]
      : [],
  )

  return (
    <Plate
      narrow={nar}
      vb={[0, 0, W, H]}
      max={680}
      label={graphLabel(x, y, series, marks)}
      className="ph-graph"
      footer={labelled.length >= 2 ? <Legend items={legend} label="Legenda grafu" /> : undefined}
    >
      {/* graph paper */}
      <Fade delay={0}>
        {xt.map((v) => (
          <line key={`gx${v}`} x1={f1(sx(v))} x2={f1(sx(v))} y1={Y1} y2={Y0} className="ph-grid" />
        ))}
        {yt.map((v) => (
          <line key={`gy${v}`} x1={X0} x2={X1} y1={f1(sy(v))} y2={f1(sy(v))} className="ph-grid" />
        ))}
      </Fade>
      {/* areas under series */}
      {series.map((s, i) =>
        s.area && px[i].length > 1 ? (
          <Fade key={`a${i}`} delay={0.9 + i * 0.15}>
            <Area
              tone={toneAt(i, s.tone)}
              d={`${seriesPath(px[i], s.style === 'smooth')} L${f1(px[i][px[i].length - 1][0])} ${f1(ay)} L${f1(px[i][0][0])} ${f1(ay)} Z`}
            />
          </Fade>
        ) : null,
      )}
      {/* axes */}
      <Draw d={`M${f1(X0 - 2)} ${f1(ay)} H${f1(X1 + 18)}`} className="ph-o" arrow="ink" dur={0.5} />
      <Draw d={`M${f1(ax)} ${f1(Y0 + 2)} V${f1(Y1 - 22)}`} className="ph-o" arrow="ink" dur={0.5} />
      <Fade delay={0.3}>
        {xt.map((v, i) =>
          originZero && v === 0 ? null : (
            <g key={`tx${v}`}>
              <line x1={f1(sx(v))} x2={f1(sx(v))} y1={f1(ay - 3)} y2={f1(ay + 3)} className="ph-tick" />
              {i % every === 0 && (
                <text x={f1(sx(v))} y={f1(ay + 17)} textAnchor="middle" className="ph-num">
                  {tl(v, xd)}
                </text>
              )}
            </g>
          ),
        )}
        {yt.map((v) =>
          originZero && v === 0 ? null : (
            <g key={`ty${v}`}>
              <line x1={f1(ax - 3)} x2={f1(ax + 3)} y1={f1(sy(v))} y2={f1(sy(v))} className="ph-tick" />
              <text x={f1(ax - 7)} y={f1(sy(v) + 4)} textAnchor="end" className="ph-num ph-halo">
                {tl(v, yd)}
              </text>
            </g>
          ),
        )}
        {originZero && (
          <text x={f1(ax - 6)} y={f1(ay + 16)} textAnchor="end" className="ph-num">
            0
          </text>
        )}
        <AxisTitle x={ax + 9} y={Y1 - 16} a={y} anchor="start" />
        <AxisTitle x={X1 + 18} y={xTitleY} a={x} anchor="end" />
      </Fade>
      {/* series */}
      {series.map((s, i) => {
        const tone = toneAt(i, s.tone)
        const style = s.style ?? 'line'
        const delay = 0.45 + i * 0.18
        return (
          <g key={`s${i}`} className={`ph-tone-${tone}`}>
            {style !== 'dots' && (
              <Draw
                d={seriesPath(px[i], style === 'smooth')}
                className={`ph-series ${style === 'dashed' ? 'ph-dash' : ''}`}
                delay={delay}
                dur={1.1}
              />
            )}
            {(style === 'dots' || style === 'line') &&
              px[i].map((p, k) => (
                <Fade key={k} delay={delay + (k / Math.max(1, px[i].length - 1)) * 0.9}>
                  <circle cx={f1(p[0])} cy={f1(p[1])} r={style === 'dots' ? 4 : 2.8} className="ph-pt" />
                </Fade>
              ))}
          </g>
        )
      })}
      {markEls}
    </Plate>
  )
}
