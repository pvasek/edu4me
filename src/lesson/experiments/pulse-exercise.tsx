import { useState, type CSSProperties } from 'react'
import { Plate, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Experiment, Readout } from './kit'
import {
  ACTIVITIES,
  EXERCISE_S,
  FITNESS,
  TOTAL_S,
  curve,
  rateAt,
  recoveryTime,
  restRate,
  type ActivityId,
  type FitnessId,
} from './pulse-exercise.model'

/** "Vyzkoušej si" for b6-2: heart rate during 5 minutes of exercise and 5 minutes of rest, trained vs untrained. */

// heart
const HX = 62
const HY = 92
// graph: −1 to 10 min, 40 to 200 beats per minute
const GX0 = 150
const GX1 = 346
const GY0 = 22
const GY1 = 176
const T0 = -60
const R0 = 40
const R1 = 200
const X = (t: number) => GX0 + ((GX1 - GX0) * (t - T0)) / (TOTAL_S - T0)
const Y = (r: number) => GY1 - ((GY1 - GY0) * (r - R0)) / (R1 - R0)

const HEART =
  'M0 24C-17 12-33 0-31-15C-30-27-16-31-8-25C-4-22-1-19 0-16C1-19 4-22 8-25C16-31 30-27 31-15C33 0 17 12 0 24Z'

/** "po 5 minutách chůze" */
const OF: Record<ActivityId, string> = { klid: 'klidu', chuze: 'chůze', beh: 'běhu', sprint: 'sprintu' }
const other = (f: FitnessId): FitnessId => (f === 'trenovany' ? 'netrenovany' : 'trenovany')
const r0 = (v: number) => Math.round(v)

/** "≈ 5 min", "≈ 1,5 min", "hned" */
function recoveryText(s: number): string {
  if (s <= 0) return 'hned'
  const half = Math.max(0.5, Math.round(s / 30) / 2)
  return `≈ ${half.toLocaleString('cs-CZ')} min`
}

function pulseLabel(a: ActivityId, f: FitnessId): string {
  const end = r0(rateAt(EXERCISE_S, a, f))
  const rest = restRate(f)
  const who = `${FITNESS[f].name} člověk`
  if (a === 'klid') return `Srdce: ${who} v klidu má tep asi ${rest} za minutu. Graf tepu za 10 minut je vodorovná čára.`
  return (
    `Srdce: ${who} (klidový tep asi ${rest} za minutu) po 5 minutách ${OF[a]} má tep asi ${end} za minutu. ` +
    `Graf: během zátěže tep rychle stoupne, po ní klesá; za minutu odpočinku je asi ${r0(rateAt(EXERCISE_S + 60, a, f))}, ` +
    `ke klidovému tepu se vrátí za ${recoveryText(recoveryTime(a, f)).replace('≈', 'asi')}. ` +
    `Čárkovaně je pro srovnání ${FITNESS[other(f)].name} člověk.`
  )
}

function Heart({ rate, resting }: { rate: number; resting: boolean }) {
  const { id } = usePlate()
  return (
    <g>
      <g transform={`translate(${HX} ${HY})`}>
        <g className="xp-pe-beat" style={{ '--beat': `${(60 / rate).toFixed(3)}s` } as CSSProperties}>
          <path d={HEART} className="xp-pe-heart" />
          <path d={HEART} fill={url(id, 'b')} opacity={0.45} />
          <path d={HEART} className="ph-o" />
        </g>
      </g>
      <text x={HX} y={HY + 58} textAnchor="middle" className="ph-lbl ph-lbl-lg xp-pe-rate">
        {r0(rate)} /min
      </text>
      <text x={HX} y={HY + 78} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        {resting ? 'v klidu' : 'na konci zátěže'}
      </text>
    </g>
  )
}

function Graph({ a, f }: { a: ActivityId; f: FitnessId }) {
  const { id } = usePlate()
  const line = (ff: FitnessId) => {
    const pts: [number, number][] = [[T0, restRate(ff)], ...curve(a, ff, 5)]
    return 'M' + pts.map(([t, r]) => `${X(t).toFixed(1)} ${Y(r).toFixed(1)}`).join('L')
  }
  const o = other(f)
  return (
    <g>
      <rect x={X(0)} y={GY0} width={X(EXERCISE_S) - X(0)} height={GY1 - GY0} className="xp-pe-band" />
      <text x={(X(0) + X(EXERCISE_S)) / 2} y={GY1 + 15} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        zátěž
      </text>
      <text x={(X(EXERCISE_S) + X(TOTAL_S)) / 2} y={GY1 + 15} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        odpočinek
      </text>
      {[50, 100, 150, 200].map((r) => (
        <g key={r}>
          <path d={`M${GX0} ${Y(r).toFixed(1)}H${GX1}`} className="ph-grid" />
          <text x={GX0 - 5} y={Y(r) + 4} textAnchor="end" className="ph-num">
            {r}
          </text>
        </g>
      ))}
      {[0, 5, 10].map((m) => (
        <text key={m} x={X(m * 60)} y={GY1 + 15} textAnchor="middle" className="ph-num">
          {m}
        </text>
      ))}
      <text x={GX1} y={GY1 + 30} textAnchor="end" className="ph-unit">
        čas (min)
      </text>
      <path d={line(o)} className="ph-series ph-dash xp-pe-other" />
      <path d={line(f)} className="ph-series xp-pe-main" />
      {/* name each curve at its end: the faster one above it, the slower one below */}
      {([f, o] as FitnessId[]).map((ff) => {
        const end = rateAt(TOTAL_S, a, ff)
        const above = end >= rateAt(TOTAL_S, a, other(ff))
        return (
          <text key={ff} x={GX1 - 2} y={Y(end) + (above ? -6 : 14)} textAnchor="end" className={`ph-lbl ph-lbl-sm ph-halo ${ff === f ? 'xp-pe-main-t' : ''}`}>
            {FITNESS[ff].name}
          </text>
        )
      })}
      <path d={`M${GX0} ${GY0 - 8}V${GY1}H${GX1 + 6}`} className="ph-o" markerEnd={url(id, 'as-ink')} />
      <text x={GX0 - 4} y={GY0 - 13} className="ph-unit">
        tep za minutu
      </text>
    </g>
  )
}

export default function PulseExercise() {
  const [a, setA] = useState<ActivityId>('beh')
  const [f, setF] = useState<FitnessId>('netrenovany')
  // which fitness levels the learner has compared for each activity
  const [seen, setSeen] = useState<string[]>([`beh|netrenovany`])
  const nar = useNarrow()
  const mark = (aa: ActivityId, ff: FitnessId) => setSeen((s) => (s.includes(`${aa}|${ff}`) ? s : [...s, `${aa}|${ff}`]))
  const done = (Object.keys(ACTIVITIES) as ActivityId[]).some(
    (k) => k !== 'klid' && seen.includes(`${k}|trenovany`) && seen.includes(`${k}|netrenovany`),
  )
  const end = rateAt(EXERCISE_S, a, f)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[14, 4, 340, 216]} max={480} label={pulseLabel(a, f)} className="xp-pe">
          <Heart rate={end} resting={a === 'klid'} />
          <Graph a={a} f={f} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="činnost (5 minut)"
            value={a}
            onChange={(v) => {
              setA(v)
              mark(v, f)
            }}
            options={(Object.keys(ACTIVITIES) as ActivityId[]).map((k) => ({ value: k, label: ACTIVITIES[k].name }))}
          />
          <Choice
            label="kondice"
            value={f}
            onChange={(v) => {
              setF(v)
              mark(a, v)
            }}
            options={(Object.keys(FITNESS) as FitnessId[]).map((k) => ({ value: k, label: FITNESS[k].name }))}
          />
        </>
      }
      readouts={
        <>
          <Readout label="klidový tep" value={restRate(f)} digits={0} unit="/min" />
          <Readout label="po 1 minutě odpočinku" value={r0(rateAt(EXERCISE_S + 60, a, f))} digits={0} unit="/min" />
          <Readout label="návrat ke klidu za" value={recoveryText(recoveryTime(a, f))} />
        </>
      }
      challenge="Zjisti, kdo se rychleji vrátí ke klidovému tepu."
      done={done}
    />
  )
}
