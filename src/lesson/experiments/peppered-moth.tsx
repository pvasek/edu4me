import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, czNum, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { MAX_GEN, mothHistory, survival } from './peppered-moth.model'

/**
 * "Vyzkoušej si" for b7-5: drsnokřídlec březový on a tree trunk. Soot darkens the bark,
 * birds find the moths that stand out, and over the generations the share of dark
 * moths changes (natural selection).
 */

// trunk (viewBox units)
const TL = 34
const TR = 150
const TT = 24
const TB = 214
// chart
const CL = 232
const CR = 350
const CT = 44
const CB = 176

/**
 * Bark and moth colours are the subject's own colours (lichen-grey bark, soot, the
 * moths), kept literal so that "light" and "dark" mean the same in both themes.
 */
const BARK_CLEAN = '#cdc8b6'
const SOOT = '#383431'
const LICHEN = '#a9b398'
const MOTH_LIGHT = '#ebe6d8'
const MOTH_DARK = '#2c2926'
const SPECKLE = '#4a4540'

/** Fixed spots on the trunk; the first k of them carry the dark moths. */
const SPOTS: [number, number][] = [
  [62, 50],
  [118, 72],
  [80, 104],
  [128, 128],
  [56, 150],
  [100, 180],
  [70, 200],
  [124, 40],
  [96, 140],
  [54, 92],
  [130, 194],
  [86, 64],
]
const CRACKS = [48, 66, 84, 104, 122, 138]

function Moth({ x, y, dark }: { x: number; y: number; dark: boolean }) {
  const fill = dark ? MOTH_DARK : MOTH_LIGHT
  const edge = dark ? '#1c1a18' : '#b9b3a3'
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -4 L-12 4 Q-6 7 0 4 Q6 7 12 4 Z" style={{ fill, stroke: edge, strokeWidth: 0.7, strokeLinejoin: 'round' }} />
      {!dark &&
        [
          [-7, 2.5],
          [-4, 0.5],
          [5, 1.5],
          [8, 3],
          [-2, 3],
          [3, 0],
        ].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={0.7} style={{ fill: SPECKLE }} />)}
      <path d="M0 -5 V4" style={{ stroke: dark ? '#141210' : '#6f685d', strokeWidth: 1.6, strokeLinecap: 'round' }} />
    </g>
  )
}

function Bird() {
  // a small songbird perched on a twig, looking at the trunk
  return (
    <g transform="translate(178 194)" className="ph-o" style={{ fill: 'var(--surface-2)' }}>
      <path d="M-12 22 H22" className="ph-o ph-thick" />
      <path d="M-14 0 Q-14 -11 -4 -11 Q4 -11 6 -2 Q16 6 20 16 Q8 18 0 16 Q-10 15 -12 6 Z" />
      <path d="M-14 -4 L-20 -2 L-14 0" style={{ fill: 'var(--yellow)' }} />
      <circle cx={-8} cy={-5} r={1.4} className="ph-ink-f" style={{ stroke: 'none' }} />
      <path d="M-2 2 Q6 2 12 10" className="ph-o ph-thin" />
      <path d="M-2 16 V22 M3 16 V22" className="ph-o ph-thin" />
    </g>
  )
}

function Chart({ hist, gen }: { hist: number[]; gen: number }) {
  const { still } = usePlate()
  const X = (g: number) => CL + ((CR - CL) * g) / MAX_GEN
  const Y = (f: number) => CB - (CB - CT) * f
  const line = hist.map((f, g) => `${g ? 'L' : 'M'}${X(g).toFixed(1)} ${Y(f).toFixed(1)}`).join(' ')
  const done = hist.slice(0, gen + 1).map((f, g) => `${g ? 'L' : 'M'}${X(g).toFixed(1)} ${Y(f).toFixed(1)}`).join(' ')
  return (
    <g>
      <text x={CL - 6} y={CT - 16} className="ph-cap">
        tmavé můry
      </text>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <path d={`M${CL} ${Y(f)} H${CR}`} className={f === 0.5 ? 'ph-guide' : 'ph-grid'} />
          <text x={CL - 5} y={Y(f) + 4} textAnchor="end" className="ph-num">
            {f * 100} %
          </text>
        </g>
      ))}
      {[0, 10, 20].map((g) => (
        <text key={g} x={X(g)} y={CB + 15} textAnchor="middle" className="ph-num">
          {g}
        </text>
      ))}
      <text x={(CL + CR) / 2} y={CB + 32} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        generace
      </text>
      <path d={`M${CL} ${CT - 4} V${CB} H${CR + 4}`} className="ph-o" />
      {/* the whole course faint, the generations already passed bold */}
      <path d={line} className="ph-o ph-thin ph-dash" style={{ stroke: 'var(--muted)' }} />
      <path d={done} style={{ fill: 'none', stroke: 'var(--ph-a)', strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' }} />
      <motion.circle
        initial={false}
        animate={{ cx: X(gen), cy: Y(hist[gen]) }}
        transition={{ duration: still ? 0 : 0.35 }}
        r={4.5}
        style={{ fill: 'var(--ph-a)', stroke: 'var(--surface)', strokeWidth: 1.5 }}
      />
    </g>
  )
}

function mothLabel(pollution: number, gen: number, share: number): string {
  const bark = pollution < 25 ? 'světlá, porostlá lišejníky' : pollution < 60 ? 'částečně začerněná sazemi' : 'tmavá od sazí'
  const w = survival(pollution / 100)
  const seen = Math.abs(w.light - w.dark) < 0.02 ? 'Ptáci najdou světlé i tmavé můry stejně snadno.' : w.light > w.dark ? 'Ptáci snáze najdou tmavé můry.' : 'Ptáci snáze najdou světlé můry.'
  return `Kmen stromu se znečištěním ${pollution} %: kůra je ${bark}. ${seen} V generaci ${gen} je tmavých můr asi ${czNum(Math.round(share * 100))} %.`
}

export default function PepperedMoth() {
  const [pollution, setPollution] = useState(20)
  const [gen, setGen] = useState(0)
  const nar = useNarrow()
  const hist = mothHistory(pollution / 100)
  const share = hist[gen]
  const nDark = Math.round(share * SPOTS.length)
  const w = survival(pollution / 100)
  const bark = `color-mix(in srgb, ${SOOT} ${pollution}%, ${BARK_CLEAN})`
  const crack = `color-mix(in srgb, ${SOOT} ${Math.min(100, pollution + 35)}%, ${BARK_CLEAN})`
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[20, 8, 340, 218]} max={480} label={mothLabel(pollution, gen, share)}>
          <path d={`M${TL} ${TT} C${TL - 4} 90 ${TL + 4} 150 ${TL - 2} ${TB} H${TR + 2} C${TR - 4} 150 ${TR + 4} 90 ${TR} ${TT} Z`} style={{ fill: bark }} />
          {CRACKS.map((x, i) => (
            <path key={x} d={`M${x} ${TT + 6 + (i % 3) * 10} q${i % 2 ? 4 : -4} 40 0 80 t0 ${70 - (i % 3) * 12}`} style={{ fill: 'none', stroke: crack, strokeWidth: 1.6, strokeLinecap: 'round' }} />
          ))}
          {/* lichen patches fade as soot covers the bark */}
          <g style={{ fill: LICHEN, opacity: Math.max(0, 1 - pollution / 60) * 0.9 }}>
            <ellipse cx={74} cy={80} rx={10} ry={6} />
            <ellipse cx={112} cy={160} rx={12} ry={7} />
            <ellipse cx={58} cy={176} rx={8} ry={5} />
            <ellipse cx={134} cy={100} rx={7} ry={9} />
          </g>
          {SPOTS.map(([x, y], i) => (
            <Moth key={i} x={x} y={y} dark={i < nDark} />
          ))}
          <path d={`M${TL} ${TT} C${TL - 4} 90 ${TL + 4} 150 ${TL - 2} ${TB} M${TR + 2} ${TB} C${TR - 4} 150 ${TR + 4} 90 ${TR} ${TT}`} className="ph-o" />
          <Bird />
          <Chart hist={hist} gen={gen} />
        </Plate>
      }
      controls={
        <>
          <Control label="znečištění (saze na kůře)" unit="%" value={pollution} min={0} max={100} step={5} onChange={setPollution} />
          <Control label="generace" value={gen} min={0} max={MAX_GEN} step={1} onChange={setGen} />
        </>
      }
      readouts={
        <>
          <Readout label="tmavých můr" value={Math.round(share * 100)} digits={0} unit="%" />
          <Readout
            label="ptáci snáze najdou"
            value={Math.abs(w.light - w.dark) < 0.02 ? 'obě stejně' : w.light > w.dark ? 'tmavé' : 'světlé'}
          />
        </>
      }
      challenge="Nastav prostředí, ve kterém tmavé můry za 10 generací převládnou."
      done={gen >= 10 && hist[10] > 0.5}
    />
  )
}
