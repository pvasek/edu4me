import { useMemo, useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { GROUPS, STARTS, YEARS, calibrate, challengeMet, project, shapeOf, shares, startPyramid, tfr, total, type Pyramid, type Shape, type Start } from './birth-death-rates.model'
import './geo-b.css'

/** "Vyzkoušej si" for z5-2 and z11-1: birth and death rates → natural increase and the pyramid after 50 years. */

const CX = 180
const GAP = 17
const W = 148
const YB = 264
const YT = 40
const RH = (YB - YT) / GROUPS

const SHAPE: Record<Shape, string> = {
  progresivni: 'progresivní',
  stacionarni: 'stacionární',
  regresivni: 'regresivní',
}
const SHAPE_SAY: Record<Shape, string> = {
  progresivni: 'progresivní (mladá populace, široká základna)',
  stacionarni: 'stacionární (tvar zvonu)',
  regresivni: 'regresivní (stárnoucí populace, tvar urny)',
}
const mil = (n: number) => czNum(n / 1e6, n < 1e8 ? 1 : 0)

function niceMax(v: number): number {
  for (const s of [4, 6, 8, 10, 12, 14]) if (v <= s) return s
  return 16
}

function label(start: Start, b: number, d: number, now: Pyramid, later: Pyramid): string {
  const s = STARTS[start]
  const sh0 = shapeOf(now)
  const sh1 = shapeOf(later)
  const inc = b - d
  return (
    `Věková pyramida: ${s.name} ${s.year} (${mil(s.pop)} mil. obyvatel, OSN) a modelový stav za ${YEARS} let. ` +
    `Dnešní porodnost ${czNum(b, 1)} ‰ a úmrtnost ${czNum(d, 1)} ‰ dávají přirozený přírůstek ${czNum(inc, 1)} ‰ ročně; ` +
    `ženy mají v průměru ${czNum(tfr(calibrate(startPyramid(start), b, d).f), 1)} dítěte. Když se plodnost ani úmrtnost podle věku nezmění a nikdo se nestěhuje, ` +
    `počet obyvatel se za ${YEARS} let změní z ${mil(s.pop)} na ${mil(total(later))} mil. ` +
    `Dnes je pyramida ${SHAPE_SAY[sh0.shape]}: děti do 14 let tvoří ${czNum(sh0.kids, 0)} %, lidé nad 50 let ${czNum(sh0.old, 0)} %. ` +
    `Za ${YEARS} let bude ${SHAPE_SAY[sh1.shape]}: děti ${czNum(sh1.kids, 0)} %, lidé nad 50 let ${czNum(sh1.old, 0)} %.`
  )
}

function stepped(shares: number[], side: -1 | 1, k: number): string {
  const x0 = CX + side * GAP
  let d = `M${x0} ${YB}`
  shares.forEach((v, g) => {
    const x = (x0 + side * v * k).toFixed(1)
    d += ` L${x} ${(YB - g * RH).toFixed(1)} L${x} ${(YB - (g + 1) * RH).toFixed(1)}`
  })
  return d + ` L${x0} ${YT}`
}

function Chart({ now, later }: { now: Pyramid; later: Pyramid }) {
  const sMax = niceMax(Math.max(...now.male, ...now.female, ...later.male, ...later.female))
  const k = W / sMax
  return (
    <>
      <text x={CX - GAP - 4} y={22} textAnchor="end" className="ph-lbl ph-lbl-sm">
        muži
      </text>
      <text x={CX + GAP + 4} y={22} className="ph-lbl ph-lbl-sm">
        ženy
      </text>
      <text x={CX} y={YT - 6} textAnchor="middle" className="ph-num">
        věk
      </text>
      {/* grid */}
      {[sMax / 2, sMax].map((v) =>
        [-1, 1].map((side) => (
          <line key={`${v}${side}`} x1={CX + side * (GAP + v * k)} x2={CX + side * (GAP + v * k)} y1={YT} y2={YB} className="ph-grid" />
        )),
      )}
      {/* the pyramid after 50 years */}
      {later.male.map((v, g) => (
        <rect key={`m${g}`} x={CX - GAP - v * k} y={YB - (g + 1) * RH + 1} width={v * k} height={RH - 2} className="xp-bd-m" />
      ))}
      {later.female.map((v, g) => (
        <rect key={`f${g}`} x={CX + GAP} y={YB - (g + 1) * RH + 1} width={v * k} height={RH - 2} className="xp-bd-f" />
      ))}
      {/* today, as an outline */}
      <path d={stepped(now.male, -1, k)} className="xp-bd-start" />
      <path d={stepped(now.female, 1, k)} className="xp-bd-start" />
      {/* ages */}
      {Array.from({ length: GROUPS }, (_, g) =>
        g % 2 === 0 || g === GROUPS - 1 ? (
          <text key={g} x={CX} y={YB - g * RH - RH / 2 + 4} textAnchor="middle" className="ph-num">
            {g === GROUPS - 1 ? '85+' : g * 5}
          </text>
        ) : null,
      )}
      {/* share axis */}
      <path d={`M${CX - GAP - W} ${YB} H${CX - GAP} M${CX + GAP} ${YB} H${CX + GAP + W}`} className="ph-o" />
      {[sMax / 2, sMax].map((v) =>
        [-1, 1].map((side) => (
          <text key={`${v}${side}`} x={CX + side * (GAP + v * k)} y={YB + 15} textAnchor="middle" className="ph-num">
            {czNum(v)} %
          </text>
        )),
      )}
    </>
  )
}

export default function BirthDeathRates() {
  const [start, setStart] = useState<Start>('cesko')
  const [b, setB] = useState(STARTS.cesko.b)
  const [d, setD] = useState(STARTS.cesko.d)
  const nar = useNarrow()
  const s = STARTS[start]
  const later = useMemo(() => project(start, b, d), [start, b, d])
  const now: Pyramid = { male: s.male, female: s.female }
  const laterPct = shares(later)
  const sh = shapeOf(later)
  const kids = useMemo(() => tfr(calibrate(startPyramid(start), b, d).f), [start, b, d])
  const pick = (v: Start) => {
    setStart(v)
    setB(STARTS[v].b)
    setD(STARTS[v].d)
  }
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[0, 0, 360, 286]}
          max={460}
          label={label(start, b, d, now, later)}
          className="xp-bd"
          footer={
            <>
              <ul className="ph-legend" aria-label="Legenda">
                <li>
                  <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true">
                    <rect x={1} y={1} width={12} height={10} className="xp-bd-m" />
                    <rect x={15} y={1} width={12} height={10} className="xp-bd-f" />
                  </svg>
                  <span>za {YEARS} let (model)</span>
                </li>
                <li>
                  <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true">
                    <path d="M2 11 V2 H26 V11" className="xp-bd-start" />
                  </svg>
                  <span>
                    {s.name} {s.year}
                  </span>
                </li>
              </ul>
              <p className="xp-src">
                Pyramida {s.year}: OSN, World Population Prospects 2024. Výchozí porodnost a úmrtnost: {start === 'cesko' ? 'ČSÚ 2024' : 'OSN 2024'}. Model: plodnost a úmrtnost podle věku se nemění, bez stěhování.
              </p>
            </>
          }
        >
          <Chart now={now} later={laterPct} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="výchozí stát"
            value={start}
            options={[
              { value: 'cesko', label: 'Česko' },
              { value: 'niger', label: 'Niger' },
            ]}
            onChange={pick}
          />
          <Control label="porodnost" unit="‰" value={b} min={5} max={50} step={0.1} digits={1} onChange={setB} />
          <Control label="úmrtnost" unit="‰" value={d} min={3} max={30} step={0.1} digits={1} onChange={setD} />
        </>
      }
      readouts={
        <>
          <Readout label="přirozený přírůstek dnes" value={b - d} digits={1} unit="‰" />
          <Readout label="dětí na 1 ženu" value={kids} digits={1} />
          <Readout label={`obyvatel za ${YEARS} let`} value={`${mil(s.pop)} → ${mil(total(later))} mil.`} />
          <Readout label={`pyramida za ${YEARS} let`} value={SHAPE[sh.shape]} />
        </>
      }
      challenge={`Najdi porodnost, při které bude mít ${s.name} za ${YEARS} let stejně obyvatel jako dnes. Stačí, aby se porodnost rovnala úmrtnosti?`}
      done={challengeMet(start, b, d)}
    />
  )
}
