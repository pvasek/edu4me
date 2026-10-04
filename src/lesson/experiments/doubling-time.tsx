import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { CH_YEARS, COUNTRIES, R_MAX, YEARS, challengeMet, countryOf, doublingTime, factor, ruleOf70, type Country } from './doubling-time.model'
import './geo-b.css'

/** "Vyzkoušej si" for z5-1: yearly growth rate → doubling time (≈ 70 / r); Niger, Indie and Česko to compare. */

const X0 = 44
const X1 = 326
const Y0 = 206
const Y1 = 40
const F_MAX = 8
const sx = (t: number) => X0 + (t / YEARS) * (X1 - X0)
const sy = (f: number) => Y0 - (f / F_MAX) * (Y0 - Y1)
const ORDER: Country[] = ['niger', 'indie', 'cesko']

/** "21 let", "1 rok", "2 roky" */
function years(n: number): string {
  const r = Math.round(n)
  const w = r === 1 ? 'rok' : r >= 2 && r <= 4 ? 'roky' : 'let'
  return `${czNum(r).replace(/^(\d)(\d{3})$/, '$1 $2')} ${w}`
}
const times = (f: number) => `${czNum(f, f < 10 ? 1 : 0)}krát`

/** the curve N(t)/N₀, cut where it leaves the chart */
function curve(r: number): { d: string; end: [number, number] } {
  const pts: string[] = []
  let end: [number, number] = [sx(YEARS), sy(factor(r, YEARS))]
  for (let t = 0; t <= YEARS + 1e-9; t += 1) {
    const f = factor(r, t)
    if (f > F_MAX) {
      const tc = Math.log(F_MAX) / Math.log(1 + r / 100)
      pts.push(`L${sx(tc).toFixed(1)} ${sy(F_MAX)}`)
      end = [sx(tc), sy(F_MAX)]
      break
    }
    pts.push(`${pts.length ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(f).toFixed(1)}`)
  }
  return { d: pts.join(' '), end }
}

function label(r: number): string {
  const T = doublingTime(r)
  const c = countryOf(r)
  return (
    `Graf: kolikrát vzroste počet obyvatel za ${YEARS} let, když každý rok přibude ${czNum(r, 1)} %${c ? ` (jako ${COUNTRIES[c].name})` : ''}. ` +
    (Number.isFinite(T)
      ? `Počet obyvatel se zdvojnásobí za ${czNum(T, 1)} roku, odhad 70 : ${czNum(r, 1)} dává ${czNum(ruleOf70(r), 1)} roku. Za ${YEARS} let bude obyvatel ${times(factor(r, YEARS))} víc. `
      : 'Při nulovém přírůstku se počet obyvatel nemění a nikdy se nezdvojnásobí. ') +
    `Pro srovnání: ${ORDER.map((k) => `${COUNTRIES[k].name} roste o ${czNum(COUNTRIES[k].r, 1)} % ročně a zdvojnásobí se asi za ${years(doublingTime(COUNTRIES[k].r))}`).join(', ')}.`
  )
}

function Graph({ r }: { r: number }) {
  const T = doublingTime(r)
  const marks = [1, 2, 3].filter((k) => k * T <= YEARS + 1e-9)
  const me = curve(r)
  return (
    <>
      {[1, 2, 4, 8].map((f) => (
        <g key={f}>
          <line x1={X0} x2={X1} y1={sy(f)} y2={sy(f)} className="ph-grid" />
          <text x={X0 - 5} y={sy(f) + 4} textAnchor="end" className="ph-num">
            ×{f}
          </text>
        </g>
      ))}
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <text key={t} x={sx(t)} y={Y0 + 15} textAnchor="middle" className="ph-num">
          {t}
        </text>
      ))}
      <path d={`M${X0} ${Y1 - 14} V${Y0} H${X1 + 8}`} className="ph-o" />
      <text x={X0 - 30} y={14} className="ph-unit">
        počet obyvatel (kolikrát víc než na začátku)
      </text>
      <text x={X1 + 8} y={Y0 + 30} textAnchor="end" className="ph-unit">
        roky
      </text>
      {/* real countries, faint */}
      {ORDER.map((k) => {
        const c = curve(COUNTRIES[k].r)
        const [x, y] = c.end
        return (
          <g key={k}>
            <path d={c.d} className="xp-dt-other" />
            <text x={Math.min(x, X1) + (y <= Y1 + 1 ? 0 : 4)} y={y <= Y1 + 1 ? y - 4 : y + 4} textAnchor={y <= Y1 + 1 ? 'middle' : 'start'} className="ph-num ph-halo">
              {COUNTRIES[k].name}
            </text>
          </g>
        )
      })}
      {/* doublings of the current curve */}
      {marks.map((k) => (
        <g key={k}>
          <path d={`M${sx(k * T)} ${Y0} V${sy(2 ** k)}`} className="ph-guide" />
          <circle cx={sx(k * T)} cy={sy(2 ** k)} r={4.5} className="ph-mark-dot" />
          <text x={sx(k * T) + 7} y={sy(2 ** k) + 16} className="ph-unit ph-halo">
            {years(k * T)}
          </text>
        </g>
      ))}
      <g className="ph-tone-a">
        <path d={me.d} className="ph-series" />
      </g>
    </>
  )
}

export default function DoublingTime() {
  const [r, setR] = useState(COUNTRIES.indie.r)
  const nar = useNarrow()
  const T = doublingTime(r)
  const f = factor(r, YEARS)
  const c = countryOf(r)
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[0, 0, 360, 240]}
          max={480}
          label={label(r)}
          className="xp-dt"
          footer={<p className="xp-src">Přírůstek obyvatel: Niger a Indie 2023 (OSN, World Population Prospects 2024), Česko 2024 (ČSÚ).</p>}
        >
          <Graph r={r} />
        </Plate>
      }
      controls={
        <>
          <Control label="roční přírůstek obyvatel *r*" unit="%" value={r} min={0} max={R_MAX} step={0.1} digits={1} onChange={setR} />
          <Choice
            label="dosaď skutečný stát"
            value={c}
            options={ORDER.map((k) => ({ value: k, label: `${COUNTRIES[k].name} ${czNum(COUNTRIES[k].r, 1)} %` }))}
            onChange={(k) => setR(COUNTRIES[k as Country].r)}
          />
        </>
      }
      readouts={
        <>
          <Readout label="doba zdvojnásobení" value={Number.isFinite(T) ? T : 'nikdy'} digits={1} unit={Number.isFinite(T) ? 'roku' : undefined} />
          <Readout label="odhad 70 : *r*" value={Number.isFinite(T) ? ruleOf70(r) : '–'} digits={1} unit={Number.isFinite(T) ? 'roku' : undefined} />
          <Readout label={`obyvatel za ${YEARS} let`} value={f < 1.005 ? 'stejně' : `${times(f)} víc`} />
        </>
      }
      challenge={`Najdi přírůstek, při kterém se počet obyvatel zdvojnásobí za ${CH_YEARS} let.`}
      done={challengeMet(r)}
    />
  )
}
