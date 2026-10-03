import { useState } from 'react'
import { Legend, Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { HALF_AT, N0, READ_AT, STEPS, exponential, halfTime, logistic, reachesHalfAt10 } from './population-growth.model'

/** "Vyzkoušej si" for b12-4: growth rate r and carrying capacity K → exponential vs logistic growth. */

const X0 = 50
const X1 = 316
const Y1 = 30
const Y0 = 196
const N_MAX = 1200
const sx = (t: number) => X0 + (t / STEPS) * (X1 - X0)
const sy = (n: number) => Y0 - (Math.min(N_MAX, n) / N_MAX) * (Y0 - Y1)

/** a population size for people: whole numbers, millions and billions in words */
function big(n: number): string {
  if (n >= 1e9) return `${czNum(n / 1e9, 1)} mld.`
  if (n >= 1e6) return `${czNum(n / 1e6, 1)} mil.`
  return czNum(Math.round(n))
}

/** readout value: a plain number (mono) unless it needs "mil." / "mld." */
const nVal = (n: number) => (n >= 1e6 ? big(n) : Math.round(n))

function popLabel(r: number, K: number): string {
  const th = halfTime(r, K)
  return (
    `Graf velikosti populace během ${STEPS} kroků, na začátku ${N0} jedinců, rychlost růstu r = ${czNum(r, 2)}, úživnost prostředí K = ${K}. ` +
    `Bez omezení (exponenciální růst) by po ${READ_AT} krocích bylo ${big(exponential(r, READ_AT))} jedinců. ` +
    `S omezenými zdroji (logistický růst) se populace zpomalí a ustálí u K; po ${READ_AT} krocích má ${big(logistic(r, K, READ_AT))} jedinců ` +
    `a polovinu kapacity dosáhne v kroku ${czNum(th, 1)}.`
  )
}

function Picture({ r, K }: { r: number; K: number }) {
  const exp: string[] = []
  const log: string[] = []
  let clipT = STEPS
  for (let t = 0; t <= STEPS + 1e-9; t += 0.25) {
    const e = exponential(r, t)
    if (e <= N_MAX) exp.push(`${exp.length ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(e).toFixed(1)}`)
    else if (clipT === STEPS) {
      // where the exponential leaves the chart
      clipT = Math.log(N_MAX / N0) / r
      exp.push(`L${sx(clipT).toFixed(1)} ${Y1}`)
    }
    log.push(`${log.length ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(logistic(r, K, t)).toFixed(1)}`)
  }
  const th = halfTime(r, K)
  const nLog = logistic(r, K, READ_AT)
  const nExp = exponential(r, READ_AT)
  return (
    <>
      {[5, 10, 15, 20, 25, 30].map((t) => (
        <line key={t} x1={sx(t)} x2={sx(t)} y1={Y1} y2={Y0} className="ph-grid" />
      ))}
      {[400, 800, 1200].map((n) => (
        <line key={n} x1={X0} x2={X1} y1={sy(n)} y2={sy(n)} className="ph-grid" />
      ))}
      <path d={`M${X0} ${Y1 - 10} V${Y0} H${X1 + 10}`} className="ph-o" />
      {[0, 5, 10, 15, 20, 25, 30].map((t) => (
        <text key={t} x={sx(t)} y={Y0 + 15} textAnchor="middle" className="ph-num">
          {t}
        </text>
      ))}
      {[0, 400, 800, 1200].map((n) => (
        <text key={n} x={X0 - 6} y={sy(n) + 4} textAnchor="end" className="ph-num">
          {czNum(n)}
        </text>
      ))}
      <text x={X0 + 6} y={Y1 - 14} className="ph-lbl ph-lbl-sm">
        počet jedinců N
      </text>
      <text x={X1 + 10} y={Y0 + 30} textAnchor="end" className="ph-lbl ph-lbl-sm">
        čas <tspan className="ph-unit">(kroky)</tspan>
      </text>
      {/* carrying capacity and its half */}
      <line x1={X0} x2={X1} y1={sy(K)} y2={sy(K)} className="ph-guide" />
      <text x={X0 + 4} y={sy(K) - 5} className="ph-unit ph-halo">
        K = {czNum(K)}
      </text>
      <line x1={X0} x2={X1} y1={sy(K / 2)} y2={sy(K / 2)} className="ph-grid" style={{ strokeDasharray: '2 3', stroke: 'var(--muted)' }} />
      <text x={X0 + 4} y={sy(K / 2) - 4} className="ph-unit ph-halo">
        K/2
      </text>
      <line x1={sx(READ_AT)} x2={sx(READ_AT)} y1={Y0} y2={Y1} className="ph-guide" />
      <g className="ph-tone-b">
        <path d={exp.join(' ')} className="ph-series ph-dash" />
        {nExp <= N_MAX && <circle cx={sx(READ_AT)} cy={sy(nExp)} r={4.5} className="ph-pt" />}
      </g>
      <g className="ph-tone-a">
        <path d={log.join(' ')} className="ph-series" />
        <circle cx={sx(READ_AT)} cy={sy(nLog)} r={4.5} className="ph-pt" />
      </g>
      {th <= STEPS && <circle cx={sx(th)} cy={sy(K / 2)} r={4} className="ph-mark-dot" />}
      {th <= STEPS && (
        <text x={sx(th) + 7} y={sy(K / 2) + 15} className="ph-unit ph-halo">
          {czNum(th, 1)}
        </text>
      )}
    </>
  )
}

export default function PopulationGrowth() {
  const [r, setR] = useState(0.3)
  const [K, setK] = useState(800)
  const nar = useNarrow()
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[4, 0, 340, 234]}
          max={460}
          label={popLabel(r, K)}
          className="xp-pop"
          footer={
            <Legend
              items={[
                { text: 'logistický růst (zdroje omezené)', tone: 'a', kind: 'line' },
                { text: 'exponenciální růst (bez omezení)', tone: 'b', kind: 'dashed' },
              ]}
              label="Legenda grafu"
            />
          }
        >
          <Picture r={r} K={K} />
        </Plate>
      }
      controls={
        <>
          <Control label="rychlost růstu *r* (za krok)" value={r} min={0.05} max={1} step={0.01} digits={2} onChange={setR} />
          <Control label="úživnost prostředí *K*" unit="jedinců" value={K} min={200} max={1000} step={50} onChange={setK} />
        </>
      }
      readouts={
        <>
          <Readout label={`N po ${READ_AT} krocích, logisticky`} value={nVal(logistic(r, K, READ_AT))} digits={0} />
          <Readout label={`N po ${READ_AT} krocích, exponenciálně`} value={nVal(exponential(r, READ_AT))} digits={0} />
          <Readout label="K/2 dosaženo v kroku" value={halfTime(r, K)} digits={1} tone={reachesHalfAt10(r, K) ? 'good' : undefined} />
        </>
      }
      challenge={`Nastav r a K tak, aby populace dosáhla poloviny kapacity za ${HALF_AT} kroků.`}
      done={reachesHalfAt10(r, K)}
    />
  )
}
