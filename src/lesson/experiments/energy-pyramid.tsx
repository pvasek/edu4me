import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { LEVELS, producersNeeded, pyramid } from './energy-pyramid.model'

/**
 * "Vyzkoušej si" for b8-4: energy flowing up a food chain rostliny → saranče → rejsek →
 * sova. The learner sets the producers' energy and the transfer efficiency and sees how
 * little reaches the top predator.
 */

// pyramid (viewBox units)
const CX = 132
const BASE = 192
const BAR_H = 34
const GAP = 4
const MIN_W = 14
const MAX_W = 200
const LX = 248 // labels column
const STEP = 1000
const TARGET = 10

const TINT = ['var(--green)', 'var(--yellow)', 'var(--accent)', 'var(--violet)']

/** Energy in kJ with a decimal comma and sensible precision. */
function kj(v: number): string {
  const digits = v >= 100 ? 0 : v >= 10 ? 1 : v >= 1 ? 2 : 3
  const r = Number(v.toFixed(digits))
  return r.toLocaleString('cs-CZ', { maximumFractionDigits: digits })
}

/**
 * Width of a level relative to the producers. Drawn to scale the top level would be a
 * thousand times narrower than the base, so the width follows the square root of the
 * energy instead (still clearly tapering, and faster for a lower efficiency).
 */
const width = (e: number, base: number) => Math.max(MIN_W, MAX_W * Math.sqrt(e / base))

function pyramidLabel(levels: number[], eff: number): string {
  const parts = LEVELS.map((l, i) => `${l.name} ${kj(levels[i])} kJ`).join(', ')
  return `Energetická pyramida potravního řetězce rostliny, saranče, rejsek, sova. Energie v patrech: ${parts}. Na každé další patro přejde jen ${eff} % energie, zbytek organismy spotřebují na život a uvolní jako teplo.`
}

function Picture({ levels, eff }: { levels: number[]; eff: number }) {
  const { id, still } = usePlate()
  const tr = { duration: still ? 0 : 0.45 }
  return (
    <>
      {levels.map((e, i) => {
        const w = width(e, levels[0])
        const y = BASE - (i + 1) * BAR_H - i * GAP
        return (
          <g key={i}>
            <motion.rect initial={false} animate={{ x: CX - w / 2, width: w }} transition={tr} y={y} height={BAR_H} rx={3} style={{ fill: `color-mix(in srgb, ${TINT[i]} 45%, var(--surface))` }} />
            <motion.rect initial={false} animate={{ x: CX - w / 2, width: w }} transition={tr} y={y} height={BAR_H} rx={3} fill={url(id, 'd')} />
            <motion.rect initial={false} animate={{ x: CX - w / 2, width: w }} transition={tr} y={y} height={BAR_H} rx={3} className="ph-o" />
            {/* leader to the label column */}
            <motion.path initial={false} animate={{ d: `M${(CX + w / 2 + 4).toFixed(1)} ${y + BAR_H / 2} H${LX - 6}` }} transition={tr} className="ph-o ph-thin ph-soft" />
            <text x={LX} y={y + BAR_H / 2 - 2} className="ph-lbl">
              {LEVELS[i].name}
            </text>
            <text x={LX} y={y + BAR_H / 2 + 14} className="ph-num" style={{ fontSize: 13 }}>
              {kj(e)} kJ
            </text>
            {/* heat leaving the level (all but the top one pass energy on) */}
            {i < levels.length - 1 && (
              <motion.g initial={false} animate={{ x: CX - w / 2 - 4 }} transition={tr} style={{ stroke: 'var(--bad)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' }}>
                <path d={`M0 ${y + 12} q-5 -6 -10 -2 t-10 -6`} />
                <path d={`M-16 ${y + 3} l-4.5 1.2 l3.2 3.4`} />
              </motion.g>
            )}
          </g>
        )
      })}
      <text x={CX - MAX_W / 2 - 2} y={BASE + 16} className="ph-lbl ph-lbl-sm" style={{ fill: 'var(--bad)' }}>
        teplo: ztráta {100 - eff} % na každém patře
      </text>
      <text x={CX} y={BASE - 4 * BAR_H - 3 * GAP - 10} textAnchor="middle" className="ph-cap">
        šířky nejsou v měřítku
      </text>
    </>
  )
}

export default function EnergyPyramid() {
  const [producers, setProducers] = useState(5000)
  const [eff, setEff] = useState(10)
  const nar = useNarrow()
  const levels = pyramid(producers, eff / 100)
  const top = levels[levels.length - 1]
  const needed = producersNeeded(TARGET, eff / 100)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 26, 362, 192]} max={480} label={pyramidLabel(levels, eff)}>
          <Picture levels={levels} eff={eff} />
        </Plate>
      }
      controls={
        <>
          <Control label="energie v rostlinách" unit="kJ" value={producers} min={STEP} max={100000} step={STEP} onChange={setProducers} />
          <Control label="přenos na další patro" unit="%" value={eff} min={5} max={20} step={1} onChange={setEff} />
        </>
      }
      readouts={
        <>
          <Readout label="sova dostane" value={top} digits={top >= 100 ? 0 : top >= 10 ? 1 : 2} unit="kJ" />
          <Readout label="ztratí se po cestě" value={100 * (1 - top / producers)} digits={top / producers < 0.001 ? 2 : 1} unit="%" />
        </>
      }
      challenge="Kolik energie musí mít rostliny, aby sova dostala aspoň 10 kJ? Najdi nejmenší hodnotu."
      done={producers >= needed - 1e-6 && producers - STEP < needed - 1e-6}
    />
  )
}
