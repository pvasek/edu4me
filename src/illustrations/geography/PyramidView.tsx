import { motion, type Variants } from 'motion/react'
import type { PyramidSpec } from '../../core/types'
import { Md } from '../../core/markup'
import { Fade, Plate, f1, useNarrow } from '../physics/kit'
import { ageLabels, czn, runs, pyramidAxis, pyramidLabel, type PyramidAxis } from './charts'
import './charts.css'

/**
 * Věková pyramida: men left, women right, age groups in the middle column
 * (youngest at the bottom, the last group open), a symmetric % axis. Two pyramids
 * share the same % scale so their shapes can be compared.
 */

const MID = 50 // width of the middle column with the age labels
const SIDE = 12
const TOP = 26
const BOTTOM = 40

const growV: Variants = {
  hidden: { scaleX: 0 },
  show: (i: number) => ({ scaleX: 1, transition: { duration: 0.4, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] } }),
}

export interface PyramidChartProps {
  spec: PyramidSpec
  step: 5 | 10
  /** shared axis (two pyramids side by side); computed from the spec when omitted */
  axis?: PyramidAxis
  /** replaces the label in the header and the description, e.g. "Stát A" (games) */
  name?: string
  /** age groups (indices, youngest = 0) to outline, e.g. the answer of a game task */
  mark?: number[]
  /** show the source line (default true) */
  source?: boolean
}

export function PyramidChart({ spec, step, axis, name, mark = [], source = true }: PyramidChartProps) {
  const nar = useNarrow()
  // narrow containers (phones) get a narrower drawing, so the text stays large
  const W = nar.narrow ? 320 : 360
  const n = spec.male.length
  const ax = axis ?? pyramidAxis([spec])
  const rowH = n > 12 ? 13.5 : n > 8 ? 20 : 26
  const PH = rowH * n
  const H = TOP + PH + BOTTOM
  const half = (W - MID) / 2 - SIDE
  const cxL = SIDE + half // right edge of the men's half
  const cxR = cxL + MID // left edge of the women's half
  const sx = (v: number) => (v / ax.max) * half
  const rowY = (i: number) => TOP + PH - (i + 1) * rowH // i = 0 at the bottom
  const ages = ageLabels(step, n)
  const gap = rowH > 16 ? 3 : 1.6
  const shown = name ?? spec.label
  const fontAge = rowH > 16 ? 'geo-age geo-age-lg' : 'geo-age'

  return (
    <div className="geo-pyr-one">
      <div className="geo-clim-head">
        <span className="geo-clim-name">
          <Md text={shown} />
        </span>
      </div>
      <Plate
        narrow={nar}
        vb={[0, 0, W, H]}
        max={460}
        label={pyramidLabel(name ? { ...spec, source: undefined } : spec, step, name?.replace(/[*_]/g, ''))}
        className="geo-pyr"
        footer={source && spec.source ? <p className="geo-source">Zdroj: {spec.source}</p> : undefined}
      >
        <Fade delay={0}>
          {ax.ticks.map((t) => (
            <g key={`g${t}`}>
              <line x1={f1(cxL - sx(t))} x2={f1(cxL - sx(t))} y1={TOP} y2={TOP + PH} className="ph-grid" />
              <line x1={f1(cxR + sx(t))} x2={f1(cxR + sx(t))} y1={TOP} y2={TOP + PH} className="ph-grid" />
            </g>
          ))}
          <text x={f1(cxL - 4)} y={TOP - 9} textAnchor="end" className="geo-sex geo-sex-m">
            muži
          </text>
          <text x={f1(cxR + 4)} y={TOP - 9} textAnchor="start" className="geo-sex geo-sex-f">
            ženy
          </text>
        </Fade>
        {spec.male.map((m, i) => {
          const f = spec.female[i]
          const yy = rowY(i) + gap / 2
          const hh = rowH - gap
          return (
            <g key={i}>
              <motion.rect
                variants={growV}
                custom={i}
                style={{ transformBox: 'fill-box', originX: 1, originY: 0.5 }}
                x={f1(cxL - sx(m))}
                y={f1(yy)}
                width={f1(sx(m))}
                height={f1(hh)}
                className="geo-pbar geo-pbar-m"
              />
              <motion.rect
                variants={growV}
                custom={i}
                style={{ transformBox: 'fill-box', originX: 0, originY: 0.5 }}
                x={f1(cxR)}
                y={f1(yy)}
                width={f1(sx(f))}
                height={f1(hh)}
                className="geo-pbar geo-pbar-f"
              />
            </g>
          )
        })}
        {runs(mark).map(([a, b]) => (
          <rect
            key={`mk${a}`}
            x={f1(cxL - sx(ax.max) - 3)}
            y={f1(rowY(b))}
            width={f1(cxR + sx(ax.max) - (cxL - sx(ax.max)) + 6)}
            height={f1(rowH * (b - a + 1))}
            rx={3}
            className="geo-mark"
          />
        ))}
        <line x1={f1(cxL)} x2={f1(cxL)} y1={TOP} y2={TOP + PH} className="ph-o ph-thin" />
        <line x1={f1(cxR)} x2={f1(cxR)} y1={TOP} y2={TOP + PH} className="ph-o ph-thin" />
        <Fade delay={0.1}>
          {ages.map((a, i) => (
            <text key={a} x={f1(cxL + MID / 2)} y={f1(rowY(i) + rowH / 2 + 3.6)} textAnchor="middle" className={fontAge}>
              {a}
            </text>
          ))}
          <line x1={f1(cxL - half)} x2={f1(cxL)} y1={TOP + PH} y2={TOP + PH} className="ph-o" />
          <line x1={f1(cxR)} x2={f1(cxR + half)} y1={TOP + PH} y2={TOP + PH} className="ph-o" />
          {ax.ticks.map((t) => (
            <g key={`t${t}`}>
              <line x1={f1(cxL - sx(t))} x2={f1(cxL - sx(t))} y1={TOP + PH} y2={TOP + PH + 4} className="ph-tick" />
              <line x1={f1(cxR + sx(t))} x2={f1(cxR + sx(t))} y1={TOP + PH} y2={TOP + PH + 4} className="ph-tick" />
              <text x={f1(cxL - sx(t))} y={TOP + PH + 16} textAnchor="middle" className="ph-num">
                {czn(t)}
              </text>
              <text x={f1(cxR + sx(t))} y={TOP + PH + 16} textAnchor="middle" className="ph-num">
                {czn(t)}
              </text>
            </g>
          ))}
          <text x={f1(cxL + MID / 2)} y={TOP + PH + 16} textAnchor="middle" className="geo-unit">
            %
          </text>
          <text x={f1(cxL + MID / 2)} y={TOP + PH + 33} textAnchor="middle" className="geo-axis-cap">
            podíl na všech obyvatelích (%)
          </text>
          <text x={f1(cxL + MID / 2)} y={TOP - 9} textAnchor="middle" className="geo-age-cap">
            věk
          </text>
        </Fade>
      </Plate>
    </div>
  )
}

/** The `pyramid` block: one or two pyramids on the same % scale, side by side or stacked on narrow screens. */
export function PyramidView({
  step,
  pyramids,
  names,
  marks,
}: {
  step: 5 | 10
  pyramids: PyramidSpec[]
  /** replacement labels (games hide the real state) */
  names?: string[]
  /** age groups to outline in each pyramid */
  marks?: number[][]
}) {
  const axis = pyramidAxis(pyramids)
  return (
    <div className={`geo-clim-set ${pyramids.length > 1 ? 'geo-two' : ''}`}>
      <div className="geo-clim-grid">
        {pyramids.map((p, i) => (
          <PyramidChart key={i} spec={p} step={step} axis={axis} name={names?.[i]} mark={marks?.[i]} />
        ))}
      </div>
    </div>
  )
}
