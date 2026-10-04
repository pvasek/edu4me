import { useState } from 'react'
import { Plate, czNum, url, usePlate, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  AREA,
  BANKFULL,
  BASE,
  CH_RAIN,
  COVERS,
  RAIN_PEAK_T,
  RAIN_SHARE,
  T_END,
  challengeMet,
  hydrograph,
  type Cover,
  type Hydro,
} from './flood-hydrograph.model'
import './geo-b.css'

/** "Vyzkoušej si" for z4-6 and z10-6: rain amount and land cover → the flood wave (hydrograph). */

const X0 = 48
const X1 = 342
// rain bars hang from the top axis
const RY = 22
const RH = 40
const R_MAX = 60
// discharge graph
const Y0 = 236
const Y1 = 114
const sx = (t: number) => X0 + (t / T_END) * (X1 - X0)
const ORDER: Cover[] = ['les', 'pole', 'mesto']

/** a ceiling for the discharge axis that splits into 4 round steps */
function niceMax(q: number): number {
  for (const s of [16, 20, 40, 60, 80, 100, 120, 160]) if (q <= s) return s
  return 160
}

function label(p: number, cover: Cover, h: Hydro): string {
  return (
    `Hydrogram malé řeky s povodím ${AREA} km² po bouřce: za 3 hodiny spadne ${czNum(p)} mm deště, v povodí je ${COVERS[cover].label}. ` +
    (h.runoffMm < 0.05
      ? `Všechen déšť se vsákne nebo vypaří, průtok zůstane ${czNum(h.peak, 1)} m³/s.`
      : `Do řeky rychle odteče ${czNum(h.coef * 100, 0)} % deště. Průtok vystoupá z ${czNum(BASE, 1)} na kulminační průtok ${czNum(h.peak, 1)} m³/s ` +
        `za ${czNum(h.lag, 1)} h po nejsilnějším dešti (doba zpoždění). ` +
        (h.floods ? `To je víc než ${BANKFULL} m³/s, které pojme koryto, takže se řeka vylije z břehů.` : `Koryto pojme až ${BANKFULL} m³/s, řeka se nevylije.`))
  )
}

const line = (h: Hydro, sy: (q: number) => number) => h.series.map(([t, q], i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(q).toFixed(1)}`).join(' ')

function Graph({ p, cover }: { p: number; cover: Cover }) {
  const { id } = usePlate()
  const all = Object.fromEntries(ORDER.map((c) => [c, hydrograph(p, c)])) as Record<Cover, Hydro>
  const h = all[cover]
  const qMax = niceMax(Math.max(BANKFULL * 1.25, ...ORDER.map((c) => all[c].peak)))
  const sy = (q: number) => Y0 - (q / qMax) * (Y0 - Y1)
  const qTicks = [0, 1, 2, 3, 4].map((i) => (i * qMax) / 4)
  // the part of the wave above the banks
  const over = h.series.filter(([, q]) => q > BANKFULL)
  const flood =
    over.length > 1
      ? `M${sx(over[0][0]).toFixed(1)} ${sy(BANKFULL).toFixed(1)} ` +
        over.map(([t, q]) => `L${sx(t).toFixed(1)} ${sy(q).toFixed(1)}`).join(' ') +
        ` L${sx(over[over.length - 1][0]).toFixed(1)} ${sy(BANKFULL).toFixed(1)}Z`
      : ''
  const hasPeak = Number.isFinite(h.lag)
  const lagY = 80
  return (
    <>
      {/* rain */}
      <text x={X0} y={12} className="ph-unit">
        srážky <tspan className="ph-num">(mm/h)</tspan>
      </text>
      <path d={`M${X0} ${RY} H${X1}`} className="ph-o" />
      {RAIN_SHARE.map((s, i) => {
        const hgt = ((s * p) / R_MAX) * RH
        return <rect key={i} x={sx(i) + 0.5} y={RY} width={sx(1) - sx(0) - 1} height={hgt} className="xp-fh-rain" />
      })}
      <text x={sx(3) + 4} y={RY + Math.max(((0.5 * p) / R_MAX) * RH, 8) + 3} className="ph-num">
        {czNum(0.5 * p)}
      </text>
      {/* axes */}
      {qTicks.map((q) => (
        <g key={q}>
          <line x1={X0} x2={X1} y1={sy(q)} y2={sy(q)} className="ph-grid" />
          <text x={X0 - 5} y={sy(q) + 4} textAnchor="end" className="ph-num">
            {czNum(q)}
          </text>
        </g>
      ))}
      {[0, 6, 12, 18, 24, 30].map((t) => (
        <text key={t} x={sx(t)} y={Y0 + 15} textAnchor="middle" className="ph-num">
          {t}
        </text>
      ))}
      <path d={`M${X0} ${Y1 - 8} V${Y0} H${X1 + 6}`} className="ph-o" />
      <text x={X0 + 4} y={Y1 - 6} className="ph-unit ph-halo">
        průtok <tspan className="ph-num">(m³/s)</tspan>
      </text>
      <text x={X1 + 6} y={Y0 + 30} textAnchor="end" className="ph-unit">
        čas od začátku deště <tspan className="ph-num">(h)</tspan>
      </text>
      {/* the banks */}
      <line x1={X0} x2={X1} y1={sy(BANKFULL)} y2={sy(BANKFULL)} className="xp-fh-bank" />
      <text x={X1} y={sy(BANKFULL) - 4} textAnchor="end" className="ph-num xp-fh-bank-t ph-halo">
        plné koryto
      </text>
      {flood && <path d={flood} className="xp-fh-flood" />}
      {/* other land covers, faint */}
      {ORDER.filter((c) => c !== cover).map((c) => {
        const o = all[c]
        return (
          <g key={c}>
            <path d={line(o, sy)} className="xp-fh-other" />
            {o.peak > 2.5 && (
              <text x={sx(o.peakT)} y={sy(o.peak) - 5} textAnchor="middle" className="ph-num ph-halo">
                {COVERS[c].label}
              </text>
            )}
          </g>
        )
      })}
      <g className="ph-tone-a">
        <path d={line(h, sy)} className="ph-series" />
      </g>
      {/* lag time: strongest rain → peak */}
      {hasPeak && (
        <>
          <line x1={sx(RAIN_PEAK_T)} x2={sx(RAIN_PEAK_T)} y1={RY + RH * 0.4} y2={Y0} className="ph-guide" />
          <line x1={sx(h.peakT)} x2={sx(h.peakT)} y1={lagY - 6} y2={sy(h.peak)} className="ph-guide" />
          <path
            d={`M${sx(RAIN_PEAK_T)} ${lagY} H${sx(h.peakT)}`}
            className="ph-o"
            markerEnd={url(id, 'as-ink')}
            markerStart={url(id, 'as-ink')}
          />
          <text x={sx(h.peakT) + 5} y={lagY + 4} className="ph-unit ph-halo">
            zpoždění {czNum(h.lag, 1)} h
          </text>
          <circle cx={sx(h.peakT)} cy={sy(h.peak)} r={4.5} className="ph-mark-dot" />
          <text
            x={sx(h.peakT) + 8}
            y={Math.max(sy(h.peak) + 4, Y1 + 10)}
            className="ph-lbl ph-lbl-sm ph-halo"
          >
            kulminace {czNum(h.peak, h.peak < 10 ? 1 : 0)} m³/s
          </text>
        </>
      )}
    </>
  )
}

export default function FloodHydrograph() {
  const [p, setP] = useState(60)
  const [cover, setCover] = useState<Cover>('pole')
  const nar = useNarrow()
  const h = hydrograph(p, cover)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 270]} max={480} label={label(p, cover, h)} className="xp-fh">
          <Graph p={p} cover={cover} />
        </Plate>
      }
      controls={
        <>
          <Control label="déšť za 3 hodiny" unit="mm" value={p} min={10} max={120} step={5} onChange={setP} />
          <Choice
            label="v povodí je"
            value={cover}
            options={ORDER.map((c) => ({ value: c, label: COVERS[c].label }))}
            onChange={setCover}
          />
        </>
      }
      readouts={
        <>
          <Readout label="kulminační průtok" value={h.peak} digits={1} unit="m³/s" tone={h.floods ? 'bad' : undefined} />
          <Readout label="doba zpoždění" value={Number.isFinite(h.lag) ? h.lag : '–'} digits={1} unit={Number.isFinite(h.lag) ? 'h' : undefined} />
          <Readout label="do řeky odteče" value={h.coef * 100} digits={0} unit="% deště" />
        </>
      }
      challenge={`Spadne ${CH_RAIN} mm deště. Najdi krajinu, ve které se řeka nevylije z koryta.`}
      done={challengeMet(p, cover)}
    />
  )
}
