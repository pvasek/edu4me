import { motion, type Variants } from 'motion/react'
import type { ClimatePlace } from '../../core/types'
import { Md } from '../../core/markup'
import { Draw, Fade, Plate, f1, useNarrow } from '../physics/kit'
import { MONTHS_ROMAN, runs, climateAxes, climateLabel, climateStats, czn, precipUnits, type ClimateAxes } from './charts'
import './charts.css'

/**
 * Klimatogram as Czech textbooks draw it (Walter–Lieth scaling): months I–XII,
 * precipitation as blue bars (right axis, mm), mean temperature as a red line with
 * dots (left axis, °C), 10 °C ↔ 20 mm so a month whose temperature dot lies above
 * its bar is dry (lightly shaded). Above 100 mm the precipitation scale is ten
 * times denser (the darker part of a bar). One or two places; two share the axes.
 */

const L = 40
const R = 44
const TOP = 30
const PH = 180
const H = TOP + PH + 26

const barV: Variants = {
  hidden: { scaleY: 0 },
  show: (i: number) => ({ scaleY: 1, transition: { duration: 0.45, delay: 0.05 + i * 0.035, ease: [0.22, 1, 0.36, 1] } }),
}

export interface ClimateChartProps {
  place: ClimatePlace
  /** shared axes (two places side by side); computed from the place when omitted */
  axes?: ClimateAxes
  /** replaces the place name in the header and the description, e.g. "Místo A" (games) */
  name?: string
  /** show the altitude, mean temperature and yearly total in the header (default true) */
  stats?: boolean
  /** shade the dry months (default true) */
  dry?: boolean
  /** show the source line (default true) */
  source?: boolean
  /** months (0–11) to outline, e.g. the answer of a game task */
  mark?: number[]
}

/** One klimatogram: header, chart and source line. */
export function ClimateChart({ place, axes, name, stats = true, dry = true, source = true, mark = [] }: ClimateChartProps) {
  const nar = useNarrow()
  // narrow containers (phones) get a narrower drawing, so the text stays large
  const W = nar.narrow ? 316 : 360
  const ax = axes ?? climateAxes([place])
  const s = climateStats(place)
  const X0 = L
  const X1 = W - R
  const col = (X1 - X0) / 12
  const Y0 = TOP + PH // bottom of the chart (ax.lo)
  const span = ax.top - ax.lo
  const y = (u: number) => Y0 - ((u - ax.lo) / span) * PH
  const yZero = y(0)
  const cx = (i: number) => X0 + col * (i + 0.5)
  const bw = Math.min(16, col * 0.62)
  const pts = place.temp.map((t, i) => [cx(i), y(t)] as const)
  const line = 'M' + pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L')
  const shown = name ?? place.name

  return (
    <div className="geo-clim-one">
      <div className="geo-clim-head">
        <span className="geo-clim-name">
          <Md text={shown} />
        </span>
        {stats && (
          <span className="geo-clim-stats">
            {place.altitude !== undefined && <span>{`${czn(place.altitude)}\u00a0m\u00a0n.\u00a0m.`}</span>}
            <span>
              <b className="geo-t">{`${czn(s.meanT, 1)}\u00a0°C`}</b>
            </span>
            <span>
              <b className="geo-p">{`${czn(s.totalP)}\u00a0mm`}</b>
            </span>
          </span>
        )}
      </div>
      <Plate
        narrow={nar}
        vb={[0, 0, W, H]}
        max={460}
        label={climateLabel(place, { name: name ? name.replace(/[*_]/g, '') : undefined, stats })}
        className="geo-clim"
        footer={source && place.source ? <p className="geo-source">Zdroj: {place.source}</p> : undefined}
      >
        {/* dry months */}
        {dry &&
          s.dry.map((d, i) =>
            d ? <rect key={`d${i}`} x={f1(X0 + col * i)} y={f1(y(ax.top))} width={f1(col)} height={f1(PH)} className="geo-dry" /> : null,
          )}
        {/* grid every 10 °C (= 20 mm, or 200 mm in the dense part) */}
        <Fade delay={0}>
          {ax.pTicks.map(([u]) => (
            <line key={`g${u}`} x1={X0} x2={X1} y1={f1(y(u))} y2={f1(y(u))} className="ph-grid" />
          ))}
          {ax.tTicks
            .filter((t) => t < 0)
            .map((t) => (
              <line key={`gn${t}`} x1={X0} x2={X1} y1={f1(y(t))} y2={f1(y(t))} className="ph-grid" />
            ))}
          {ax.compressed && <line x1={X0} x2={X1} y1={f1(y(50))} y2={f1(y(50))} className="geo-100" />}
        </Fade>
        {/* precipitation bars */}
        {place.precip.map((p, i) => {
          const u = precipUnits(p)
          const top = y(u)
          const split = y(Math.min(u, 50))
          return (
            <motion.g key={`b${i}`} variants={barV} custom={i} style={{ transformBox: 'fill-box', originX: 0.5, originY: 1 }}>
              <rect x={f1(cx(i) - bw / 2)} y={f1(split)} width={f1(bw)} height={f1(Math.max(0, yZero - split))} className="geo-bar" />
              {u > 50 && <rect x={f1(cx(i) - bw / 2)} y={f1(top)} width={f1(bw)} height={f1(split - top)} className="geo-bar geo-bar-dense" />}
            </motion.g>
          )
        })}
        {runs(mark).map(([a, b]) => (
          <rect key={`m${a}`} x={f1(X0 + col * a + 1)} y={f1(y(ax.top) + 1)} width={f1(col * (b - a + 1) - 2)} height={f1(PH - 2)} rx={3} className="geo-mark" />
        ))}
        {/* axes */}
        <line x1={X0} x2={X0} y1={Y0} y2={f1(y(ax.top) - 6)} className="ph-o" />
        <line x1={X1} x2={X1} y1={f1(yZero)} y2={f1(y(ax.top) - 6)} className="ph-o" />
        <line x1={X0} x2={X1} y1={f1(yZero)} y2={f1(yZero)} className={`ph-o ${ax.lo < 0 ? 'geo-zero' : ''}`} />
        {ax.lo < 0 && <line x1={X0} x2={X1} y1={Y0} y2={Y0} className="ph-o ph-thin" />}
        <Fade delay={0.15}>
          {ax.tTicks.map((t) => (
            <g key={`tt${t}`}>
              <line x1={X0 - 4} x2={X0} y1={f1(y(t))} y2={f1(y(t))} className="ph-tick" />
              <text x={X0 - 7} y={f1(y(t) + 4)} textAnchor="end" className="ph-num geo-num-t">
                {czn(t)}
              </text>
            </g>
          ))}
          {ax.pTicks.map(([u, mm]) => (
            <g key={`pt${u}`}>
              <line x1={X1} x2={X1 + 4} y1={f1(y(u))} y2={f1(y(u))} className="ph-tick" />
              <text x={X1 + 7} y={f1(y(u) + 4)} textAnchor="start" className="ph-num geo-num-p">
                {czn(mm)}
              </text>
            </g>
          ))}
          <text x={X0 - 7} y={f1(y(ax.top) - 12)} textAnchor="middle" className="geo-unit geo-num-t">
            °C
          </text>
          <text x={X1 + 9} y={f1(y(ax.top) - 12)} textAnchor="middle" className="geo-unit geo-num-p">
            mm
          </text>
          {MONTHS_ROMAN.map((m, i) => (
            <text key={m} x={f1(cx(i))} y={Y0 + 17} textAnchor="middle" className="geo-month">
              {m}
            </text>
          ))}
        </Fade>
        {/* temperature */}
        <Draw d={line} className="geo-tline" delay={0.45} dur={0.7} />
        {pts.map(([a, b], i) => (
          <Fade key={`p${i}`} delay={0.45 + i * 0.055}>
            <circle cx={f1(a)} cy={f1(b)} r={3} className="geo-tdot" />
          </Fade>
        ))}
      </Plate>
    </div>
  )
}

/** Legend under one or two klimatograms. */
export function ClimateLegend({ dry, dense }: { dry: boolean; dense: boolean }) {
  return (
    <ul className="geo-legend" aria-label="Legenda klimatogramu">
      <li>
        <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true">
          <line x1={2} x2={26} y1={6} y2={6} className="geo-tline" />
          <circle cx={14} cy={6} r={3} className="geo-tdot" />
        </svg>
        <span>průměrná teplota (°C)</span>
      </li>
      <li>
        <svg viewBox="0 0 16 12" width={16} height={12} aria-hidden="true">
          <rect x={3} y={1} width={10} height={11} className="geo-bar" />
        </svg>
        <span>srážky (mm)</span>
      </li>
      {dense && (
        <li>
          <svg viewBox="0 0 16 12" width={16} height={12} aria-hidden="true">
            <rect x={3} y={1} width={10} height={11} className="geo-bar geo-bar-dense" />
          </svg>
          <span>nad 100 mm měřítko 10× zhuštěné</span>
        </li>
      )}
      {dry && (
        <li>
          <svg viewBox="0 0 16 12" width={16} height={12} aria-hidden="true">
            <rect x={1} y={0} width={14} height={12} className="geo-dry geo-dry-key" />
          </svg>
          <span>suché období</span>
        </li>
      )}
    </ul>
  )
}

/** The `climate` block: one or two klimatogramy, side by side on wide screens, stacked on narrow ones. */
export function ClimateView({
  places,
  names,
  stats = true,
  dry = true,
  legend = true,
  marks,
}: {
  places: ClimatePlace[]
  /** replacement names (games hide the real place) */
  names?: string[]
  stats?: boolean
  dry?: boolean
  legend?: boolean
  /** months (0–11) to outline in each chart */
  marks?: number[][]
}) {
  const axes = climateAxes(places)
  const anyDry = dry && places.some((p) => climateStats(p).dryCount > 0)
  return (
    <div className={`geo-clim-set ${places.length > 1 ? 'geo-two' : ''}`}>
      <div className="geo-clim-grid">
        {places.map((pl, i) => (
          <ClimateChart key={i} place={pl} axes={axes} name={names?.[i]} stats={stats} dry={dry} mark={marks?.[i]} />
        ))}
      </div>
      {legend && <ClimateLegend dry={anyDry} dense={axes.compressed} />}
    </div>
  )
}
