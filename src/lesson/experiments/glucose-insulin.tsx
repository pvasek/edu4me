import { useState, type CSSProperties } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  DOSE_MAX,
  FASTING_HIGH,
  FASTING_LOW,
  HYPO,
  LIMIT_2H,
  MINUTES,
  PERSONS,
  glucoseCurve,
  summarize,
  type Person,
} from './glucose-insulin.model'

/** "Vyzkoušej si" for b11-1: blood glucose for 4 hours after a meal – healthy, type 1 (with an insulin dose), type 2. */

const X0 = 48
const X1 = 318
const Y1 = 28
const Y0 = 196
const G_MAX = 18
const sx = (t: number) => X0 + (t / MINUTES) * (X1 - X0)
const sy = (g: number) => Y0 - (Math.min(G_MAX, g) / G_MAX) * (Y0 - Y1)

function glucoseLabel(person: Person, dose: number): string {
  const s = summarize(glucoseCurve(person, dose))
  const who = person === 't1' ? `člověk s diabetem 1. typu, ${dose ? `který si k jídlu píchl ${dose} j inzulinu` : 'bez inzulinu'}` : PERSONS[person].name
  const verdict = s.low < HYPO ? 'Glykémie klesla pod 3,9 mmol/l, to je hypoglykémie.' : s.inNorm ? 'Glykémie zůstala v normě.' : 'Glykémie zůstává nad normou.'
  return (
    `Graf glykémie (mmol/l) během 4 hodin po jídle; ${who}. Začíná na ${czNum(glucoseCurve(person, dose)[0], 1)}, ` +
    `nejvýš vystoupá na ${czNum(s.peak, 1)} za ${s.peakAt} minut, po 2 hodinách je ${czNum(s.at2h, 1)} a nejníž ${czNum(s.low, 1)} mmol/l. ` +
    `Pásmo normy nalačno je 3,9 až 5,6 mmol/l, po 2 hodinách má být pod 7,8 mmol/l. ${verdict}`
  )
}

function Picture({ person, dose }: { person: Person; dose: number }) {
  const curve = glucoseCurve(person, dose)
  const s = summarize(curve)
  const d = curve.map((g, t) => `${t ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(g).toFixed(1)}`).join(' ')
  const bad2h = s.at2h >= LIMIT_2H
  return (
    <>
      {/* hypoglycaemia zone and the fasting normal range */}
      <rect x={X0} y={sy(HYPO)} width={X1 - X0} height={Y0 - sy(HYPO)} style={{ fill: 'var(--bad-soft)' }} />
      <rect x={X0} y={sy(FASTING_HIGH)} width={X1 - X0} height={sy(FASTING_LOW) - sy(FASTING_HIGH)} style={{ fill: 'var(--good-soft)' }} />
      {[60, 120, 180, 240].map((t) => (
        <line key={t} x1={sx(t)} x2={sx(t)} y1={Y1} y2={Y0} className="ph-grid" />
      ))}
      {[5, 10, 15].map((g) => (
        <line key={g} x1={X0} x2={X1} y1={sy(g)} y2={sy(g)} className="ph-grid" />
      ))}
      <line x1={X0} x2={X1} y1={sy(LIMIT_2H)} y2={sy(LIMIT_2H)} className="ph-guide" />
      <path d={`M${X0} ${Y1 - 10} V${Y0} H${X1 + 8}`} className="ph-o" />
      {[0, 1, 2, 3, 4].map((h) => (
        <text key={h} x={sx(h * 60)} y={Y0 + 15} textAnchor="middle" className="ph-num">
          {h} h
        </text>
      ))}
      {[0, 5, 10, 15].map((g) => (
        <text key={g} x={X0 - 6} y={sy(g) + 4} textAnchor="end" className="ph-num">
          {g}
        </text>
      ))}
      <text x={X0 - 6} y={sy(LIMIT_2H) + 4} textAnchor="end" className="ph-num" style={{ fill: 'var(--ink)' }}>
        7,8
      </text>
      <text x={X0 + 6} y={Y1 - 12} className="ph-lbl ph-lbl-sm">
        glykémie <tspan className="ph-unit">(mmol/l)</tspan>
      </text>
      <text x={X1 + 8} y={Y0 + 30} textAnchor="end" className="ph-lbl ph-lbl-sm">
        čas po jídle
      </text>
      {/* the curve and its value at 2 h */}
      <g className="ph-tone-a">
        <path d={d} className="ph-series" />
      </g>
      <line x1={sx(120)} x2={sx(120)} y1={Y0} y2={sy(s.at2h)} className="ph-guide" />
      <circle cx={sx(120)} cy={sy(s.at2h)} r={5} className="ph-mark-dot" style={{ stroke: bad2h ? 'var(--bad)' : 'var(--ink)' }} />
      {/* meal (and insulin) at time 0 */}
      <text x={X0 + 6} y={Y1 + 8} className="ph-unit ph-halo">
        ↓ jídlo{person === 't1' && dose > 0 ? ` + ${dose} j inzulinu` : ''}
      </text>
    </>
  )
}

function Key() {
  const sw = (style: CSSProperties) => (
    <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true" style={{ width: 28, height: 12, flex: 'none' }}>
      <rect x={1} y={1} width={26} height={10} style={style} />
    </svg>
  )
  return (
    <ul className="ph-legend" aria-label="Legenda grafu">
      <li>{sw({ fill: 'var(--good-soft)', stroke: 'var(--good)', strokeWidth: 1 })}norma nalačno 3,9–5,6</li>
      <li>
        <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true" style={{ width: 28, height: 12, flex: 'none' }}>
          <line x1={1} x2={27} y1={6} y2={6} className="ph-guide" />
        </svg>
        po 2 h pod 7,8
      </li>
      <li>{sw({ fill: 'var(--bad-soft)', stroke: 'var(--bad)', strokeWidth: 1 })}hypoglykémie pod 3,9</li>
    </ul>
  )
}

export default function GlucoseInsulin() {
  const [person, setPerson] = useState<Person>('zdravy')
  const [dose, setDose] = useState(0)
  const nar = useNarrow()
  const s = summarize(glucoseCurve(person, dose))
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[4, 0, 340, 236]} max={460} label={glucoseLabel(person, dose)} className="xp-gi" footer={<Key />}>
          <Picture person={person} dose={dose} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="kdo jí"
            value={person}
            onChange={setPerson}
            options={(Object.keys(PERSONS) as Person[]).map((k) => ({ value: k, label: PERSONS[k].name }))}
          />
          {person === 't1' && (
            <Control label="dávka inzulinu k jídlu" unit="j" value={dose} min={0} max={DOSE_MAX} step={1} onChange={setDose} />
          )}
        </>
      }
      readouts={
        <>
          <Readout label="nejvyšší glykémie" value={s.peak} unit="mmol/l" />
          <Readout label="po 2 hodinách" value={s.at2h} unit="mmol/l" tone={s.at2h < LIMIT_2H && s.at2h >= HYPO ? 'good' : 'bad'} />
          <Readout label="nejnižší" value={s.low} unit="mmol/l" tone={s.low < HYPO ? 'bad' : undefined} />
        </>
      }
      challenge="U diabetu 1. typu nastav dávku inzulinu tak, aby glykémie zůstala v normě (po 2 h pod 7,8 mmol/l, nikdy pod 3,9)."
      done={person === 't1' && s.inNorm}
    />
  )
}
