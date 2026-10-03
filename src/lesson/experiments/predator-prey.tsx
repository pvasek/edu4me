import { useMemo, useState } from 'react'
import { Legend, Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { DEFAULT_A, DEFAULT_LEVEL, K, YEARS, predatorPrey } from './predator-prey.model'

/** "Vyzkoušej si" for b12-4: hare births and lynx hunting efficiency → the two populations over 40 years. */

const X0 = 46
const X1 = 300
const Y1 = 30
const Y0 = 196
/** left axis: hares, right axis: lynx */
const H_MAX = K
const L_MAX = 50
const sx = (t: number) => X0 + (t / YEARS) * (X1 - X0)
const syH = (h: number) => Y0 - (Math.min(H_MAX, h) / H_MAX) * (Y0 - Y1)
const syL = (l: number) => Y0 - (Math.min(L_MAX, l) / L_MAX) * (Y0 - Y1)

function ppLabel(a: number, level: number): string {
  const r = predatorPrey(a, level)
  const end = r.points[r.points.length - 1]
  const fate =
    r.lynxExtinct === null
      ? `Rysi přežívají; po ${YEARS} letech je v lese asi ${Math.round(end[1])} zajíců a ${Math.round(end[2])} rysů.`
      : `Rysi vyhynuli v ${Math.ceil(r.lynxExtinct)}. roce; zajíců pak přibude až k ${Math.round(end[1])}.`
  return (
    `Graf počtu zajíců a rysů během ${YEARS} let. Přírůstek zajíců ${Math.round(a * 100)} % za rok, úspěšnost lovu rysů ${level} z 10. ` +
    `Nejvíc bylo ${Math.round(r.hareMax)} zajíců a ${Math.round(r.lynxMax)} rysů. ${fate}`
  )
}

function Picture({ a, level }: { a: number; level: number }) {
  const r = useMemo(() => predatorPrey(a, level), [a, level])
  const hares = r.points.map(([t, h], i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${syH(h).toFixed(1)}`).join(' ')
  // the lynx line ends where they died out
  const alive = r.points.filter(([t]) => r.lynxExtinct === null || t <= r.lynxExtinct + 0.25)
  const lynx = alive.map(([t, , l], i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${syL(l).toFixed(1)}`).join(' ')
  const ex = r.lynxExtinct
  return (
    <>
      {[10, 20, 30, 40].map((t) => (
        <line key={t} x1={sx(t)} x2={sx(t)} y1={Y1} y2={Y0} className="ph-grid" />
      ))}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={X0} x2={X1} y1={Y0 - f * (Y0 - Y1)} y2={Y0 - f * (Y0 - Y1)} className="ph-grid" />
      ))}
      <path d={`M${X0} ${Y1 - 10} V${Y0} H${X1} V${Y1 - 10}`} className="ph-o" />
      {[0, 10, 20, 30, 40].map((t) => (
        <text key={t} x={sx(t)} y={Y0 + 15} textAnchor="middle" className="ph-num">
          {t}
        </text>
      ))}
      <g className="ph-tone-a">
        {[0, 1000, 2000].map((h) => (
          <text key={h} x={X0 - 5} y={syH(h) + 4} textAnchor="end" className="ph-num" style={{ fill: 'var(--t)' }}>
            {czNum(h)}
          </text>
        ))}
        <text x={X0 - 4} y={Y1 - 14} className="ph-lbl ph-lbl-sm ph-lbl-t">
          zajíci
        </text>
        <path d={hares} className="ph-series" />
      </g>
      <g className="ph-tone-d">
        {[0, 25, 50].map((l) => (
          <text key={l} x={X1 + 5} y={syL(l) + 4} className="ph-num" style={{ fill: 'var(--t)' }}>
            {l}
          </text>
        ))}
        <text x={X1 + 4} y={Y1 - 14} textAnchor="end" className="ph-lbl ph-lbl-sm ph-lbl-t">
          rysi
        </text>
        <path d={lynx} className="ph-series ph-dash" />
        {ex !== null && (
          <>
            <path d={`M${sx(ex) - 5} ${Y0 - 5} l10 10 M${sx(ex) + 5} ${Y0 - 5} l-10 10`} className="ph-series" style={{ strokeDasharray: 'none' }} />
            <text x={Math.min(sx(ex) + 8, X1 - 120)} y={Y0 - 10} className="ph-lbl ph-lbl-sm ph-lbl-t ph-halo">
              rysi vyhynuli
            </text>
          </>
        )}
      </g>
      <text x={X1} y={Y0 + 30} textAnchor="end" className="ph-lbl ph-lbl-sm">
        čas <tspan className="ph-unit">(roky)</tspan>
      </text>
    </>
  )
}

export default function PredatorPrey() {
  const [aPct, setAPct] = useState(Math.round(DEFAULT_A * 100))
  const [level, setLevel] = useState(DEFAULT_LEVEL)
  const nar = useNarrow()
  const a = aPct / 100
  const r = useMemo(() => predatorPrey(a, level), [a, level])
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[2, 0, 338, 234]}
          max={460}
          label={ppLabel(a, level)}
          className="xp-pp"
          footer={
            <Legend
              items={[
                { text: 'zajíci (levá osa)', tone: 'a', kind: 'line' },
                { text: 'rysi (pravá osa)', tone: 'd', kind: 'dashed' },
              ]}
              label="Legenda grafu"
            />
          }
        >
          <Picture a={a} level={level} />
        </Plate>
      }
      controls={
        <>
          <Control label="přírůstek zajíců" unit="% za rok" value={aPct} min={20} max={150} step={5} onChange={setAPct} />
          <Control label="úspěšnost lovu rysů (1–10)" value={level} min={1} max={10} step={1} onChange={setLevel} />
        </>
      }
      readouts={
        <>
          <Readout label="nejvíc zajíců" value={Math.round(r.hareMax)} digits={0} />
          <Readout label="nejvíc rysů" value={Math.round(r.lynxMax)} digits={0} />
          <Readout
            label="rysi"
            value={r.lynxExtinct === null ? 'přežívají' : `vyhynuli v ${Math.ceil(r.lynxExtinct)}. roce`}
            tone={r.lynxExtinct === null ? 'good' : 'bad'}
          />
        </>
      }
      challenge="Najdi nastavení, při kterém rysi nevyhynou."
      done={r.lynxExtinct === null}
    />
  )
}
