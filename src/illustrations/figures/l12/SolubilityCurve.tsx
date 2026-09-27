import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Fade, Plate, Sub, cz, drawV, useHatch } from './kit'

/** Table from lesson l1-5 (g of substance in 100 g of water). */
const TEMPS = [0, 20, 40, 60, 80, 100]
export const SOLUBILITY = {
  sugar: [179, 204, 238, 287, 362, 487],
  kno3: [13.3, 31.6, 63.9, 110, 169, 246],
  nacl: [35.7, 36.0, 36.6, 37.3, 38.4, 39.8],
} as const
type Key = keyof typeof SOLUBILITY

const SERIES: { key: Key; cls: string; name: ReactNode; plain: string; dash?: string }[] = [
  { key: 'sugar', cls: 'f12-sugar', name: 'cukr', plain: 'cukr (sacharóza)', dash: '8 4' },
  { key: 'kno3', cls: 'f12-kno3', name: <>KNO<Sub>3</Sub></>, plain: 'dusičnan draselný KNO₃' },
  { key: 'nacl', cls: 'f12-nacl', name: 'NaCl', plain: 'kuchyňská sůl NaCl', dash: '2 4' },
]

/** Monotone cubic (Fritsch–Carlson) interpolation through the table points. */
export function interp(ys: readonly number[], t: number): number {
  const n = TEMPS.length
  if (t <= TEMPS[0]) return ys[0]
  if (t >= TEMPS[n - 1]) return ys[n - 1]
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (TEMPS[i + 1] - TEMPS[i]))
  const m: number[] = [d[0]]
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
  m.push(d[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0
      continue
    }
    const a = m[i] / d[i]
    const b = m[i + 1] / d[i]
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      m[i] = k * a * d[i]
      m[i + 1] = k * b * d[i]
    }
  }
  let i = 0
  while (t > TEMPS[i + 1]) i++
  const hh = TEMPS[i + 1] - TEMPS[i]
  const u = (t - TEMPS[i]) / hh
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1
  const h10 = u ** 3 - 2 * u ** 2 + u
  const h01 = -2 * u ** 3 + 3 * u ** 2
  const h11 = u ** 3 - u ** 2
  return h00 * ys[i] + h10 * hh * m[i] + h01 * ys[i + 1] + h11 * hh * m[i + 1]
}

const X0 = 74
const X1 = 574
const Y0 = 360
const Y1 = 30
const GMAX = 500
const sx = (t: number) => X0 + (t / 100) * (X1 - X0)
const sy = (g: number) => Y0 - (g / GMAX) * (Y0 - Y1)

function curve(ys: readonly number[]) {
  let d = ''
  for (let t = 0; t <= 100; t += 1) d += `${t ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(interp(ys, t)).toFixed(1)}`
  return d
}

function Marker({ key2, x, y, on = false }: { key2: Key; x: number; y: number; on?: boolean }) {
  const cls = on ? 'f12-mark-on' : 'f12-mark'
  if (key2 === 'nacl') return <rect className={cls} x={x - 4.5} y={y - 4.5} width={9} height={9} />
  if (key2 === 'sugar') return <path className={cls} d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y} Z`} />
  return <circle className={cls} cx={x} cy={y} r={4.8} />
}

const fmtG = (g: number) => (g >= 100 ? cz(g, 0) : cz(g, 1))

export default function SolubilityCurve() {
  const [t, setT] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    if (p.x < X0 - 20 || p.x > X1 + 20 || p.y < Y1 - 20 || p.y > Y0 + 20) return setT(null)
    setT(Math.max(0, Math.min(100, Math.round(((p.x - X0) / (X1 - X0)) * 100))))
  }
  const table = SERIES.map((s) => `${s.plain}: ${TEMPS.map((tt, i) => `${tt} °C ${cz(SOLUBILITY[s.key][i], 1)} g`).join(', ')}`).join('. ')
  return (
    <Plate
      level={1}
      w={600}
      h={410}
      max={660}
      label={`Křivky rozpustnosti: kolik gramů látky se rozpustí ve 100 g vody při teplotě 0 až 100 °C. ${table}. Rozpustnost dusičnanu draselného s teplotou strmě stoupá, u kuchyňské soli je křivka téměř vodorovná.`}
      svgProps={{ onPointerMove: onMove, onPointerLeave: () => setT(null), ref: svgRef as never, style: { touchAction: 'pan-y' } }}
      after={
        <>
          <div className="f12-legend" aria-hidden="true">
            {SERIES.map((s) => (
              <span key={s.key} className={s.cls}>
                <i style={s.dash ? { borderTopStyle: s.dash === '2 4' ? 'dotted' : 'dashed' } : undefined} />
                {s.plain}
              </span>
            ))}
          </div>
          <label className="f12-range">
            teplota
            <input type="range" min={0} max={100} step={1} value={t ?? 20} onChange={(e) => setT(Number(e.target.value))} />
            <output>{t ?? 20} °C</output>
          </label>
        </>
      }
    >
      <Chart t={t} />
    </Plate>
  )
}

function Chart({ t }: { t: number | null }) {
  const h = useHatch()
  const gTicks = [0, 100, 200, 300, 400, 500]
  return (
    <>
      {/* grid + axes */}
      <g>
        {gTicks.map((g) => (
          <g key={g}>
            <line className="f12-grid" x1={X0} x2={X1} y1={sy(g)} y2={sy(g)} />
            <text className="f12-tick" x={X0 - 8} y={sy(g) + 4} textAnchor="end">
              {g}
            </text>
          </g>
        ))}
        {TEMPS.map((tt) => (
          <g key={tt}>
            <line className="f12-grid" x1={sx(tt)} x2={sx(tt)} y1={Y0} y2={Y1} />
            <text className="f12-tick" x={sx(tt)} y={Y0 + 18} textAnchor="middle">
              {tt}
            </text>
          </g>
        ))}
        <line className="f12-axisline" x1={X0} x2={X1} y1={Y0} y2={Y0} />
        <line className="f12-axisline" x1={X0} x2={X0} y1={Y0} y2={Y1 - 6} />
        <text className="f12-t" x={X1} y={Y0 + 42} textAnchor="end">
          teplota (°C)
        </text>
        <text className="f12-t" x={16} y={Y1 + 150} textAnchor="middle" transform={`rotate(-90 16 ${Y1 + 150})`}>
          g látky ve 100 g vody
        </text>
      </g>

      {/* the KNO3 crystallisation example from the lesson (60 → 20 °C) */}
      <Fade delay={2} className="f12-sec">
        <path className="f12-hatch" d={`M${sx(20)} ${sy(110)} L${sx(60)} ${sy(110)} L${sx(60)} ${sy(31.6)} L${sx(20)} ${sy(31.6)} Z`} fill={h('d')} />
        <path className="f12-cross" d={`M${sx(60)} ${sy(110)} L${sx(20)} ${sy(110)} L${sx(20)} ${sy(31.6)}`} />
        <text className="f12-t" x={sx(22)} y={sy(80)}>
          ochlazením z 60 na 20 °C
        </text>
        <text className="f12-t f12-t-strong" x={sx(22)} y={sy(80) + 20}>
          se vyloučí 78,4 g KNO₃
        </text>
      </Fade>

      {/* curves */}
      {SERIES.map((s, i) => (
        <g key={s.key} className={s.cls}>
          <motion.path className="f12-series" d={curve(SOLUBILITY[s.key])} variants={drawV(0.2 + i * 0.3, 1.4)} style={s.dash ? { strokeDasharray: undefined } : undefined} />
          {TEMPS.map((tt, j) => (
            <motion.g key={tt} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.5 + i * 0.3 + j * 0.12 } } }}>
              <Marker key2={s.key} x={sx(tt)} y={sy(SOLUBILITY[s.key][j])} />
            </motion.g>
          ))}
        </g>
      ))}

      {/* direct labels */}
      <Fade delay={1.6}>
        <text className="f12-t f12-t-strong" x={sx(94)} y={sy(487) + 6} textAnchor="end">
          cukr
        </text>
        <text className="f12-t f12-t-strong" x={sx(96)} y={sy(246) - 10} textAnchor="end">
          KNO<tspan className="f12-sub" dy="0.3em">3</tspan>
        </text>
        <text className="f12-t f12-t-strong" x={sx(100)} y={sy(39.8) - 12} textAnchor="end">
          NaCl
        </text>
      </Fade>

      {/* hover read-out */}
      {t !== null && <ReadOut t={t} />}
      <rect x={X0} y={Y1} width={X1 - X0} height={Y0 - Y1} fill="transparent" />
    </>
  )
}

function ReadOut({ t }: { t: number }) {
  const x = sx(t)
  const vals = SERIES.map((s) => ({ ...s, g: interp(SOLUBILITY[s.key], t) })).sort((a, b) => b.g - a.g)
  const bw = 150
  const bx = t > 62 ? x - bw - 12 : x + 12
  const by = 44
  return (
    <g className="f12-readout" pointerEvents="none">
      <line className="f12-cross" x1={x} x2={x} y1={Y1} y2={Y0} />
      {vals.map((v) => (
        <g key={v.key} className={v.cls}>
          <Marker key2={v.key} x={x} y={sy(v.g)} on />
        </g>
      ))}
      <rect className="f12-tip" x={bx} y={by} width={bw} height={100} rx={6} />
      <text className="f12-tip-h" x={bx + 12} y={by + 24}>
        {t} °C
      </text>
      {vals.map((v, i) => (
        <g key={v.key} className={v.cls} transform={`translate(${bx + 18} ${by + 46 + i * 20})`}>
          <Marker key2={v.key} x={0} y={-4} on />
          <text className="f12-tip-t" x={12} y={0}>
            {v.key === 'kno3' ? 'KNO₃' : v.key === 'nacl' ? 'NaCl' : 'cukr'}
          </text>
          <text className="f12-tip-v" x={bw - 30} y={0} textAnchor="end">
            {fmtG(v.g)} g
          </text>
        </g>
      ))}
    </g>
  )
}
