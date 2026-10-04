import { useId, useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { BASE_ALT, BELTS, CH_BASE, LAPSE, TOP_ALT, beltAt, challengeMet, tempAt } from './lapse-rate.model'
import './geo-b.css'

/** "Vyzkoušej si" for z4-3: climb the Krkonoše – the air cools ≈ 0,65 °C per 100 m and the vegetation belts change. */

const A0 = 100
const A1 = 1700
const Y0 = 246
const Y1 = 22
const sy = (alt: number) => Y0 - ((alt - A0) / (A1 - A0)) * (Y0 - Y1)
// the mountain (x, altitude): the left slope climbs to Sněžka, then a short drop on the right
const PEAK = 9
const MOUNTAIN: [number, number][] = [
  [40, 200],
  [76, 250],
  [104, 360],
  [130, 520],
  [154, 700],
  [180, 900],
  [206, 1100],
  [232, 1300],
  [256, 1470],
  [278, 1603],
  [302, 1500],
  [326, 1330],
  [350, 1200],
  [360, 1170],
]

/** "1 430" – a space in four-digit numbers too, as Czech text writes heights */
const m = (n: number) => czNum(n).replace(/^(\d)(\d{3})$/, '$1 $2')
const deg = (t: number) => `${czNum(t, 1)} °C`
/** shown temperatures are rounded once, so the picture, the label and the readouts agree */
const round1 = (t: number) => Math.round(t * 10) / 10

/** x on the left slope at an altitude */
function slopeX(alt: number): number {
  for (let i = 1; i <= PEAK; i++) {
    const [x0, a0] = MOUNTAIN[i - 1]
    const [x1, a1] = MOUNTAIN[i]
    if (alt <= a1) return x0 + ((x1 - x0) * (alt - a0)) / (a1 - a0)
  }
  return MOUNTAIN[PEAK][0]
}

function label(base: number, alt: number): string {
  const t = round1(tempAt(base, alt))
  const b = beltAt(alt)
  return (
    `Krkonoše v řezu od nížiny u Labe (${BASE_ALT} m n. m.) po Sněžku (${m(TOP_ALT)} m n. m.) s vegetačními stupni: ` +
    BELTS.map((x) => `${x.name} ${x.from ? `od ${m(x.from)} m` : `do ${m(x.to)} m`}`).join(', ') +
    `. Dole je ${czNum(base)} °C. Turista stojí ve výšce ${m(alt)} m n. m., je tam ${deg(t)}, o ${czNum(base - t, 1)} °C chladněji než dole, ` +
    `protože teplota vzduchu klesá asi o ${czNum(LAPSE * 100, 2)} °C na každých 100 m. Vegetační stupeň: ${b.name} (${b.trees}).`
  )
}

function Tree({ alt, kind }: { alt: number; kind: 'leaf' | 'mix' | 'spruce' | 'pine' }) {
  const x = slopeX(alt) + 6
  const y = sy(alt) + 1
  if (kind === 'leaf')
    return (
      <g>
        <path d={`M${x} ${y} v-7`} stroke="var(--edge)" strokeWidth={1.2} />
        <circle cx={x} cy={y - 10} r={5} className="xp-lr-tree" />
      </g>
    )
  if (kind === 'pine')
    return <path d={`M${x - 8} ${y} q1 -6 5 -5 q2 -5 6 -1 q4 -3 5 6Z`} className="xp-lr-tree" />
  const h = kind === 'spruce' ? 15 : 12
  return (
    <g>
      <path d={`M${x} ${y} v-3`} stroke="var(--edge)" strokeWidth={1.2} />
      <path d={`M${x - 4.5} ${y - 3} L${x} ${y - 3 - h} L${x + 4.5} ${y - 3}Z`} className="xp-lr-tree" />
    </g>
  )
}

function Picture({ base, alt }: { base: number; alt: number }) {
  const clip = 'xplr' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const outline = `M${MOUNTAIN.map(([x, a]) => `${x} ${sy(a).toFixed(1)}`).join(' L')} L360 ${Y0} L40 ${Y0}Z`
  const t = round1(tempAt(base, alt))
  const now = beltAt(alt)
  const cx = slopeX(alt)
  const cy = sy(alt)
  // near the foot there is no room on the left: the label goes up and right
  const low = cx < 120
  const ticks = [200, 400, 600, 800, 1000, 1200, 1400, 1600]
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
      </defs>
      {/* altitude axis */}
      {ticks.map((a) => (
        <g key={a}>
          <line x1={36} x2={40} y1={sy(a)} y2={sy(a)} className="ph-tick" />
          <text x={33} y={sy(a) + 4} textAnchor="end" className="ph-num">
            {m(a)}
          </text>
        </g>
      ))}
      <path d={`M40 ${Y0} V${Y1 - 6}`} className="ph-o" />
      <text x={4} y={10} className="ph-unit">
        m n. m.
      </text>
      {/* vegetation belts on the mountain */}
      <g clipPath={`url(#${clip})`}>
        {BELTS.map((b) => (
          <rect key={b.id} x={40} y={sy(Math.min(b.to, A1))} width={320} height={sy(Math.max(b.from, A0)) - sy(Math.min(b.to, A1))} className={`xp-lr-belt-${b.id}`} />
        ))}
        {BELTS.slice(0, -1).map((b) => (
          <line key={b.id} x1={40} x2={360} y1={sy(b.to)} y2={sy(b.to)} stroke="var(--edge)" strokeWidth={0.6} strokeDasharray="3 3" opacity={0.6} />
        ))}
      </g>
      <path d={outline} className="ph-o" />
      {([
        [230, 'leaf'],
        [320, 'leaf'],
        [480, 'mix'],
        [620, 'leaf'],
        [740, 'mix'],
        [880, 'spruce'],
        [1000, 'spruce'],
        [1120, 'spruce'],
        [1260, 'pine'],
        [1360, 'pine'],
      ] as const).map(([a, k]) => (
        <Tree key={a} alt={a} kind={k} />
      ))}
      <line x1={40} x2={cx} y1={cy} y2={cy} className="ph-guide" />
      {/* legend of the belts in the sky */}
      {[...BELTS].reverse().map((b, i) => {
        const y = 32 + i * 17
        const on = b.id === now.id
        return (
          <g key={b.id}>
            <rect x={52} y={y - 10} width={14} height={12} className={`xp-lr-belt-${b.id}`} stroke="var(--edge)" strokeWidth={on ? 1.8 : 0.8} />
            <text x={72} y={y} className={`ph-unit ph-halo${on ? ' xp-lr-now' : ''}`}>
              {b.name}
            </text>
          </g>
        )
      })}
      <text x={278} y={sy(TOP_ALT) - 8} textAnchor="middle" className="ph-unit ph-halo">
        Sněžka
      </text>
      {/* the climber */}
      <path d={`M${cx} ${cy} v-22`} stroke="var(--ink)" strokeWidth={1.6} />
      <path d={`M${cx} ${cy - 22} l12 4 l-12 4Z`} fill="var(--bad)" />
      <circle cx={cx} cy={cy} r={4.5} fill="var(--ink)" stroke="var(--surface)" strokeWidth={1.4} />
      <text
        x={low ? cx + 16 : cx - 9}
        y={low ? cy - 18 : cy - 7}
        textAnchor={low ? 'start' : 'end'}
        className={`ph-lbl ph-halo${t < 0 ? ' xp-lr-cold' : ''}`}
      >
        {deg(t)}
      </text>
      {/* the foot */}
      <text x={46} y={Y0 + 16} className="ph-unit">
        dole ({BASE_ALT} m): {czNum(base)} °C
      </text>
    </>
  )
}

export default function LapseRate() {
  const [alt, setAlt] = useState(800)
  const [base, setBase] = useState(20)
  const nar = useNarrow()
  const t = round1(tempAt(base, alt))
  const b = beltAt(alt)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 268]} max={460} label={label(base, alt)} className="xp-lr">
          <Picture base={base} alt={alt} />
        </Plate>
      }
      controls={
        <>
          <Control label="nadmořská výška" value={alt} min={BASE_ALT} max={1600} step={10} format={(v) => `${m(v)} m`} onChange={setAlt} />
          <Control label={`teplota dole (${BASE_ALT} m n. m.)`} value={base} min={-10} max={30} step={1} format={(v) => `${czNum(v)} °C`} onChange={setBase} />
        </>
      }
      readouts={
        <>
          <Readout label="teplota ve výšce" value={t} digits={1} unit="°C" />
          <Readout label="chladněji než dole o" value={round1(base - t)} digits={1} unit="°C" />
          <Readout label="vegetační stupeň" value={b.name} />
        </>
      }
      challenge={`Dole je ${CH_BASE} °C. Vystoupej tam, kde teplota klesne na 0 °C. Co tam roste?`}
      done={challengeMet(base, alt)}
    />
  )
}
