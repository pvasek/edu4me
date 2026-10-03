import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  ENZYMES,
  PH_MAX,
  PH_MIN,
  T_MAX,
  T_MIN,
  enzymeRate,
  enzymeState,
  intactShare,
  pepsinFastest,
  type EnzymeId,
} from './enzyme-activity.model'

/** "Vyzkoušej si" for b9-4: temperature and pH → how fast an enzyme works; overheating denatures it for good. */

// two plots (viewBox units): rate vs temperature on top, rate vs pH below
const X0 = 46
const X1 = 318
const TOP = { y1: 30, y0: 150 }
const LOW = { y1: 212, y0: 280 }

const sx = (v: number, min: number, max: number) => X0 + ((v - min) / (max - min)) * (X1 - X0)
const sy = (r: number, p: { y1: number; y0: number }) => p.y0 - r * (p.y0 - p.y1)
const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

const STATE_SAYS = { ok: 'funkční', damaged: 'částečně denaturovaný', dead: 'denaturovaný' } as const

function enzymeLabel(id: EnzymeId, T: number, pH: number, hottest: number): string {
  const e = ENZYMES[id]
  const r = Math.round(enzymeRate(e, T, pH, hottest) * 100)
  const st = enzymeState(e, hottest)
  const head = `Dva grafy rychlosti reakce, kterou řídí ${e.name}: nahoře v závislosti na teplotě, dole v závislosti na pH. Při ${T} °C a pH ${czNum(pH)} pracuje enzym rychlostí ${r} % svého maxima. `
  if (st === 'ok') return head + 'Enzym je funkční.'
  return (
    head +
    `Roztok se ohřál až na ${hottest} °C, a proto je enzym ${st === 'dead' ? 'úplně denaturovaný' : `ze ${Math.round((1 - intactShare(e, hottest)) * 100)} % denaturovaný`}; ochlazení ho už neopraví.`
  )
}

function Axes({ p, min, max, step, title, unit }: { p: { y1: number; y0: number }; min: number; max: number; step: number; title: string; unit?: string }) {
  const xt: number[] = []
  for (let v = min; v <= max + 1e-9; v += step) xt.push(v)
  return (
    <>
      {xt.map((v) => (
        <line key={`g${v}`} x1={sx(v, min, max)} x2={sx(v, min, max)} y1={p.y1} y2={p.y0} className="ph-grid" />
      ))}
      {[0.5, 1].map((r) => (
        <line key={`h${r}`} x1={X0} x2={X1} y1={sy(r, p)} y2={sy(r, p)} className="ph-grid" />
      ))}
      <path d={`M${X0} ${p.y1 - 8} V${p.y0} H${X1 + 8}`} className="ph-o" />
      {xt.map((v) => (
        <text key={`t${v}`} x={sx(v, min, max)} y={p.y0 + 15} textAnchor="middle" className="ph-num">
          {czNum(v)}
        </text>
      ))}
      {[0, 50, 100].map((r) => (
        <text key={`r${r}`} x={X0 - 6} y={sy(r / 100, p) + 4} textAnchor="end" className="ph-num">
          {r} %
        </text>
      ))}
      <text x={X1 + 8} y={p.y0 + 30} textAnchor="end" className="ph-lbl ph-lbl-sm">
        {title}
        {unit && <tspan className="ph-unit"> ({unit})</tspan>}
      </text>
    </>
  )
}

function Picture({ id, T, pH, hottest }: { id: EnzymeId; T: number; pH: number; hottest: number }) {
  const e = ENZYMES[id]
  const fresh: [number, number][] = []
  const now: [number, number][] = []
  for (let t = T_MIN; t <= T_MAX; t += 0.5) {
    fresh.push([sx(t, T_MIN, T_MAX), sy(enzymeRate(e, t, pH), TOP)])
    now.push([sx(t, T_MIN, T_MAX), sy(enzymeRate(e, t, pH, hottest), TOP)])
  }
  const byPH: [number, number][] = []
  for (let v = PH_MIN; v <= PH_MAX; v += 0.1) byPH.push([sx(v, PH_MIN, PH_MAX), sy(enzymeRate(e, T, v, hottest), LOW)])
  const r = enzymeRate(e, T, pH, hottest)
  const damaged = enzymeState(e, hottest) !== 'ok'
  const px = sx(T, T_MIN, T_MAX)
  return (
    <>
      <text x={X0 + 8} y={TOP.y1 - 12} className="ph-lbl ph-lbl-sm">
        rychlost reakce
      </text>
      <Axes p={TOP} min={T_MIN} max={T_MAX} step={10} title="teplota" unit="°C" />
      <Axes p={LOW} min={PH_MIN} max={PH_MAX} step={1} title="pH" />
      <g className="ph-tone-a">
        {damaged && <path d={path(fresh)} className="ph-series ph-dash" style={{ stroke: 'var(--muted)', strokeWidth: 1.6 }} />}
        <path d={path(now)} className="ph-series" />
        <path d={path(byPH)} className="ph-series" />
      </g>
      {damaged && (
        <text x={X1 + 8} y={TOP.y1 - 12} textAnchor="end" className="ph-lbl ph-lbl-sm" style={{ fill: 'var(--bad)' }}>
          denaturováno při {hottest} °C
        </text>
      )}
      {/* the current conditions */}
      <line x1={px} x2={px} y1={TOP.y0} y2={sy(r, TOP)} className="ph-guide" />
      <circle cx={px} cy={sy(r, TOP)} r={5.5} className="ph-mark-dot" />
      <line x1={sx(pH, PH_MIN, PH_MAX)} x2={sx(pH, PH_MIN, PH_MAX)} y1={LOW.y0} y2={sy(r, LOW)} className="ph-guide" />
      <circle cx={sx(pH, PH_MIN, PH_MAX)} cy={sy(r, LOW)} r={5.5} className="ph-mark-dot" />
      <text x={X0 + 8} y={LOW.y1 - 12} className="ph-lbl ph-lbl-sm">
        rychlost při {T} °C
      </text>
    </>
  )
}

export default function EnzymeActivity() {
  const [id, setId] = useState<EnzymeId>('amylaza')
  const [T, setT] = useState(20)
  const [pH, setPH] = useState(7)
  // the hottest the solution has been since a fresh enzyme was added (denaturation is irreversible)
  const [hottest, setHottest] = useState(20)
  const nar = useNarrow()
  const e = ENZYMES[id]
  const st = enzymeState(e, hottest)
  const rate = enzymeRate(e, T, pH, hottest)
  const changeT = (v: number) => {
    setT(v)
    setHottest((h) => Math.max(h, v))
  }
  const fresh = () => setHottest(T)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 340, 312]} max={440} label={enzymeLabel(id, T, pH, hottest)} className="xp-enz">
          <Picture id={id} T={T} pH={pH} hottest={hottest} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="enzym"
            value={id}
            onChange={(v) => {
              setId(v)
              setHottest(T)
            }}
            options={(Object.keys(ENZYMES) as EnzymeId[]).map((k) => ({ value: k, label: ENZYMES[k].name }))}
          />
          <Control label="teplota" unit="°C" value={T} min={T_MIN} max={T_MAX} step={1} onChange={changeT} />
          <Control label="pH" value={pH} min={PH_MIN} max={PH_MAX} step={0.5} digits={1} onChange={setPH} />
          <div className="xp-choice">
            <div className="xp-choice-opts">
              <button type="button" onClick={fresh} disabled={st === 'ok'} style={st === 'ok' ? { opacity: 0.5, cursor: 'default' } : undefined}>
                Přidat čerstvý enzym
              </button>
            </div>
          </div>
        </>
      }
      readouts={
        <>
          <Readout label="rychlost reakce" value={Math.round(rate * 100)} digits={0} unit="% maxima" />
          <Readout label={`${e.name} (${e.where})`} value={STATE_SAYS[st]} tone={st === 'ok' ? 'good' : 'bad'} />
        </>
      }
      challenge="Najdi podmínky, při kterých pepsin pracuje nejrychleji."
      done={pepsinFastest(id, T, pH, hottest)}
    />
  )
}
