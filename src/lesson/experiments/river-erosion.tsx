import { useState } from 'react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  EROSION,
  GRAINS,
  Q_STEPS,
  SETTLING,
  SIZE,
  S_STEPS,
  challengeMet,
  velocity,
  work,
  type Grain,
  type Work,
} from './river-erosion.model'

/** "Vyzkoušej si" for z3-5: slope and discharge → velocity → erosion, transport or deposition (simplified Hjulström curve). */

const NAME: Record<Grain, string> = { jil: 'jíl', pisek: 'písek', sterk: 'štěrk' }
const WORK: Record<Work, string> = { eroze: 'eroze', transport: 'transport', ukladani: 'ukládání' }
const WORK_SAY: Record<Work, string> = { eroze: 'řeka ho vymílá ze dna', transport: 'řeka ho unáší, ze dna ho ale nezvedne', ukladani: 'usazuje se na dně' }
const COLOR: Record<Grain, string> = {
  jil: 'color-mix(in srgb, var(--accent) 50%, var(--muted))',
  pisek: 'var(--yellow)',
  sterk: 'color-mix(in srgb, var(--muted) 75%, var(--surface))',
}
const R: Record<Grain, number> = { jil: 1.3, pisek: 2.4, sterk: 5 }

const fmtQ = (q: number) => `${czNum(q)} m³/s`
const fmtS = (s: number) => `${czNum(s)} m na 1 km`

// ------------------------------------------------------------------ the river (side view)

const STATIONS: Record<Grain, number> = { jil: 66, pisek: 180, sterk: 294 }
const DEPTH = 58

function River({ v, si }: { v: number; si: number }) {
  const { id } = usePlate()
  const drop = 4 + 30 * (si / (S_STEPS.length - 1))
  const bedY = (x: number) => 118 - drop / 2 + (drop * (x - 6)) / 348
  const surf = (x: number) => bedY(x) - DEPTH
  const L = 14 + 20 * (Math.log10(v) + 1.6)
  return (
    <g>
      {/* water and the bed */}
      <path
        d={`M6 ${surf(6).toFixed(1)} L354 ${surf(354).toFixed(1)} L354 ${bedY(354).toFixed(1)} L6 ${bedY(6).toFixed(1)}Z`}
        fill="color-mix(in srgb, var(--blue) 26%, var(--surface))"
      />
      <path
        d={`M6 ${bedY(6).toFixed(1)} L354 ${bedY(354).toFixed(1)} L354 172 L6 172Z`}
        fill="color-mix(in srgb, var(--accent) 12%, var(--surface))"
      />
      <path d={`M6 ${bedY(6).toFixed(1)} L354 ${bedY(354).toFixed(1)} L354 172 L6 172Z`} fill={url(id, 'd')} />
      <path d={`M6 ${surf(6).toFixed(1)} L354 ${surf(354).toFixed(1)}`} stroke="var(--blue)" strokeWidth={1.8} />
      <path d={`M6 ${bedY(6).toFixed(1)} L354 ${bedY(354).toFixed(1)}`} className="ph-o" />
      {/* flow arrows: longer = faster */}
      {[123, 237].map((x) => {
        const y = surf(x) + DEPTH * 0.42
        return <path key={x} d={`M${(x - L / 2).toFixed(1)} ${y.toFixed(1)} h${L.toFixed(1)}`} className="ph-o ph-thick" markerEnd={url(id, 'as-ink')} />
      })}
      {GRAINS.map((g) => (
        <Station key={g} g={g} w={work(g, v)} x={STATIONS[g]} bed={bedY(STATIONS[g])} />
      ))}
    </g>
  )
}

/** A heap of one kind of grains on the bed, with grains rising, drifting or falling above it. */
function Station({ g, w, x, bed }: { g: Grain; w: Work; x: number; bed: number }) {
  const { id } = usePlate()
  const h = w === 'eroze' ? 5 : w === 'transport' ? 11 : 17
  const r = R[g]
  const fill = COLOR[g]
  const heap = `M${x - 40} ${bed} Q${x - 22} ${bed - h} ${x} ${bed - h} Q${x + 22} ${bed - h} ${x + 40} ${bed}Z`
  // grains on top of the heap (a deterministic scatter)
  const top: [number, number][] = []
  for (let k = 0; k < 9; k++) {
    const dx = -30 + k * 7.5
    const y = bed - h * (1 - (dx / 40) ** 2) * 0.55 - ((k * 37) % 5) * 0.3
    top.push([x + dx, y])
  }
  const water: { p: [number, number]; d: string }[] =
    w === 'eroze'
      ? [
          { p: [x - 8, bed - h - 9], d: 'M0 0 l5 -9' },
          { p: [x + 8, bed - h - 19], d: 'M0 0 l6 -8' },
          { p: [x + 24, bed - h - 30], d: 'M0 0 l8 -6' },
        ]
      : w === 'transport'
        ? [
            { p: [x - 20, bed - 36], d: 'M0 0 h11' },
            { p: [x + 2, bed - 26], d: 'M0 0 h11' },
            { p: [x + 22, bed - 40], d: 'M0 0 h11' },
          ]
        : [
            { p: [x - 14, bed - h - 26], d: 'M0 0 v9' },
            { p: [x + 6, bed - h - 14], d: 'M0 0 v8' },
            { p: [x + 22, bed - h - 30], d: 'M0 0 v9' },
          ]
  return (
    <g>
      <path d={heap} fill={fill} stroke="var(--edge)" strokeWidth={1.1} />
      {top.map(([gx, gy], k) => (
        <circle key={k} cx={gx} cy={gy} r={r} fill={fill} stroke="var(--edge)" strokeWidth={0.7} />
      ))}
      {water.map(({ p: [gx, gy], d }, k) => (
        <g key={k}>
          <circle cx={gx} cy={gy} r={Math.max(r, 2)} fill={fill} stroke="var(--edge)" strokeWidth={0.8} />
          <path
            d={d}
            transform={`translate(${gx + (w === 'transport' ? r + 2 : w === 'eroze' ? 2 : 0)} ${gy + (w === 'ukladani' ? r + 2 : w === 'eroze' ? -r : 0)})`}
            className="ph-o"
            markerEnd={url(id, 'as-ink')}
          />
        </g>
      ))}
      <text x={x} y={bed + 24} textAnchor="middle" className="ph-lbl ph-halo">
        {NAME[g]}
      </text>
      <text x={x} y={bed + 40} textAnchor="middle" className="ph-unit ph-halo" style={{ fill: 'var(--ink)', fontWeight: 700 }}>
        {WORK[w]}
      </text>
    </g>
  )
}

// ------------------------------------------------------------------ simplified Hjulström curve

const CX0 = 58
const CX1 = 346
const CY0 = 200
const CY1 = 340
const cx = (d: number) => CX0 + ((Math.log10(d) + 3) / 5) * (CX1 - CX0)
const cy = (v: number) => CY1 - ((Math.log10(v) + 2) / 3) * (CY1 - CY0)

function Chart({ v }: { v: number }) {
  const { id } = usePlate()
  const clip = `${id}-re-clip`
  const line = (pts: [number, number][]) => pts.map(([d, u], i) => `${i ? 'L' : 'M'}${cx(d).toFixed(1)} ${cy(u).toFixed(1)}`).join(' ')
  const vy = cy(Math.min(10, Math.max(0.01, v)))
  return (
    <g>
      <text x={CX0} y={CY0 - 10} className="ph-unit">
        rychlost proudu <tspan className="ph-num">(m/s)</tspan>
      </text>
      <clipPath id={clip}>
        <rect x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {/* the transport band between the curves */}
        <path
          d={`${line(EROSION)} L${cx(100)} ${cy(2.6)} ${[...SETTLING].reverse().map(([d, u]) => `L${cx(d).toFixed(1)} ${cy(u).toFixed(1)}`).join(' ')}Z`}
          fill="color-mix(in srgb, var(--blue) 14%, var(--surface))"
        />
        <path d={line(EROSION)} fill="none" stroke="var(--bad)" strokeWidth={2.2} />
        <path d={line(SETTLING)} fill="none" stroke="var(--ph-a)" strokeWidth={2.2} strokeDasharray="6 4" />
      </g>
      <rect x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0} className="ph-o ph-thin" fill="none" />
      {[0.01, 0.1, 1, 10].map((u) => (
        <text key={u} x={CX0 - 5} y={cy(u) + 4} textAnchor="end" className="ph-num">
          {czNum(u)}
        </text>
      ))}
      <text x={cx(0.03)} y={CY0 + 18} className="ph-unit ph-halo" style={{ fill: 'var(--bad)', fontWeight: 700 }}>
        eroze
      </text>
      <text x={cx(0.3)} y={cy(0.06)} textAnchor="middle" className="ph-unit ph-halo">
        transport
      </text>
      <text x={cx(3)} y={CY1 - 8} textAnchor="middle" className="ph-unit ph-halo">
        ukládání
      </text>
      {/* the grains and the current velocity */}
      {GRAINS.map((g) => (
        <g key={g}>
          <path d={`M${cx(SIZE[g])} ${CY0} V${CY1}`} className="ph-guide" />
          <text x={cx(SIZE[g])} y={CY1 + 15} textAnchor="middle" className="ph-unit">
            {NAME[g]}
          </text>
          <text x={cx(SIZE[g])} y={CY1 + 28} textAnchor="middle" className="ph-num">
            {SIZE[g] >= 10 ? `${czNum(SIZE[g] / 10)} cm` : `${czNum(SIZE[g])} mm`}
          </text>
        </g>
      ))}
      <path d={`M${CX0} ${vy} H${CX1}`} stroke="var(--ink)" strokeWidth={1.6} />
      {GRAINS.map((g) => {
        const w = work(g, v)
        return (
          <circle
            key={g}
            cx={cx(SIZE[g])}
            cy={vy}
            r={5}
            fill={w === 'eroze' ? 'var(--bad)' : w === 'transport' ? 'var(--surface)' : 'var(--ph-a)'}
            stroke="var(--edge)"
            strokeWidth={1.3}
          />
        )
      })}
    </g>
  )
}

function riverLabel(q: number, s: number, v: number): string {
  return (
    `Řeka s průtokem ${fmtQ(q)} a sklonem koryta ${fmtS(s)} teče rychlostí ${czNum(v, 2)} m/s. ` +
    GRAINS.map((g) => `${NAME[g][0].toUpperCase()}${NAME[g].slice(1)}: ${WORK_SAY[work(g, v)]}.`).join(' ') +
    ' Pod tím zjednodušená Hjulströmova křivka: nad křivkou eroze řeka zrna vymílá, pod křivkou usazování se ukládají, mezi nimi je unáší. ' +
    'Nejsnáze se vymílá písek, jíl drží pohromadě a štěrk je těžký.'
  )
}

export default function RiverErosion() {
  const [qi, setQi] = useState(Q_STEPS.indexOf(50))
  const [si, setSi] = useState(S_STEPS.indexOf(1))
  const nar = useNarrow()
  const q = Q_STEPS[qi]
  const s = S_STEPS[si]
  const v = velocity(q, s)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 40, 360, 332]} max={480} label={riverLabel(q, s, v)} className="xp-re">
          <River v={v} si={si} />
          <Chart v={v} />
        </Plate>
      }
      controls={
        <>
          <Control label="sklon koryta" value={si} min={0} max={S_STEPS.length - 1} step={1} format={(i) => fmtS(S_STEPS[i])} onChange={setSi} />
          <Control label="průtok" value={qi} min={0} max={Q_STEPS.length - 1} step={1} format={(i) => fmtQ(Q_STEPS[i])} onChange={setQi} />
        </>
      }
      readouts={
        <>
          <Readout label="rychlost proudu" value={v} unit="m/s" digits={2} />
          {GRAINS.map((g) => {
            const w = work(g, v)
            return <Readout key={g} label={NAME[g]} value={WORK[w]} tone={w === 'eroze' ? 'bad' : undefined} />
          })}
        </>
      }
      challenge="Zrychli řeku tak, aby vymílala štěrk, ale jílové dno ještě vydrželo."
      done={challengeMet(v)}
    />
  )
}
