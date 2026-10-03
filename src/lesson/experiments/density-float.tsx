import { useState } from 'react'
import { motion, type Transition } from 'motion/react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { LIQUIDS, floatInLiquid, type FloatState, type LiquidId } from './density-float.model'

/** "Vyzkoušej si" for f1-4: set the mass and volume of a block and watch it float, hover or sink. */

// tank geometry (viewBox units)
const TL = 36 // outer left
const TR = 284 // outer right
const RIM = 30 // top of the glass walls
const BOT = 226 // outer bottom
const G = 5 // glass thickness
const FLOOR = BOT - G // inner bottom: a sunken block rests here
const SURF = 84 // water surface
const BX = 132 // block centre x
/** px per cm: the drawn block is a cube with edge ∛V */
const SCALE = 14

const LIQUID_FILL: Record<LiquidId, string> = {
  voda: 'color-mix(in srgb, var(--blue) 30%, var(--surface))',
  slana: 'color-mix(in srgb, var(--teal) 32%, var(--surface))',
  olej: 'color-mix(in srgb, var(--yellow) 42%, var(--surface))',
}
const IN: Record<LiquidId, string> = { voda: 've vodě', slana: 've slané vodě', olej: 'v oleji' }
const SAYS: Record<FloatState, string> = { float: 'plave', hover: 'vznáší se', sink: 'klesne' }

const settle: Record<FloatState, Transition> = {
  // a floating block bobs a little before it settles
  float: { type: 'spring', bounce: 0.35, duration: 1.2 },
  hover: { type: 'spring', bounce: 0, duration: 1 },
  sink: { type: 'spring', bounce: 0, duration: 0.9 },
}

const pct = (f: number) => Math.round(f * 100)

function densityLabel(m: number, V: number, liquid: LiquidId): string {
  const L = LIQUIDS[liquid]
  const { rho, state, submerged } = floatInLiquid(m, V, L.rho)
  const head = `Nádoba s kapalinou (${L.name}, hustota ${czNum(L.rho, 2)} g/cm³) a v ní kostka o hmotnosti ${m} g a objemu ${V} cm³. Hustota kostky je ${czNum(rho, 2)} g/cm³, `
  if (state === 'float') return head + `tedy menší než hustota kapaliny, a proto kostka plave; pod hladinou je ${pct(submerged)} % jejího objemu.`
  if (state === 'hover') return head + 'tedy téměř stejná jako hustota kapaliny, a proto se kostka vznáší celá pod hladinou.'
  return head + 'tedy větší než hustota kapaliny, a proto kostka klesla ke dnu.'
}

function Tank({ liquid }: { liquid: LiquidId }) {
  const { id } = usePlate()
  const water = `M${TL + G} ${SURF} H${TR - G} V${FLOOR} H${TL + G} Z`
  return (
    <>
      <path d={water} style={{ fill: LIQUID_FILL[liquid] }} opacity={0.62} />
      <path d={water} fill={url(id, 'h')} />
      <path d={`M${TL + G} ${SURF} H${TR - G}`} className="ph-o" />
    </>
  )
}

function Glass() {
  const { id } = usePlate()
  const glass = `M${TL} ${RIM} V${BOT} H${TR} V${RIM} H${TR - G} V${FLOOR} H${TL + G} V${RIM} Z`
  return (
    <>
      <path d={glass} className="ph-glass" />
      <path d={glass} fill={url(id, 'd')} />
      <path d={glass} className="ph-o" />
    </>
  )
}

function Picture({ m, V, liquid }: { m: number; V: number; liquid: LiquidId }) {
  const { id } = usePlate()
  const { rho, state, submerged } = floatInLiquid(m, V, LIQUIDS[liquid].rho)
  const s = SCALE * Math.cbrt(V)
  // y of the block's bottom face
  const bottom = state === 'sink' ? FLOOR : state === 'hover' ? (SURF + FLOOR) / 2 + s / 2 : SURF + submerged * s
  // denser block = deeper colour
  const tint = `color-mix(in srgb, var(--ph-b) ${Math.round(16 + 64 * Math.min(1, rho / 3))}%, var(--surface))`
  const move = { initial: false as const, animate: { y: bottom }, transition: settle[state] }
  const dim = submerged * s
  // the label sits beside the submerged part, but never crosses the surface
  const labelY = Math.max(-dim / 2 + 2, -dim + 17)
  return (
    <>
      <motion.g {...move}>
        <rect x={BX - s / 2} y={-s} width={s} height={s} rx={3} style={{ fill: tint }} />
        <rect x={BX - s / 2} y={-s} width={s} height={s} rx={3} fill={url(id, 'b')} />
        <rect x={BX - s / 2} y={-s} width={s} height={s} rx={3} className="ph-o" />
      </motion.g>
      <Tank liquid={liquid} />
      {state === 'float' && (
        <motion.g {...move}>
          <path
            d={`M${BX + s / 2 + 6} ${-dim} h8 M${BX + s / 2 + 10} ${-dim} V0 M${BX + s / 2 + 6} 0 h8`}
            className="ph-o ph-thin xp-df-dim"
          />
          <text x={BX + s / 2 + 18} y={labelY} className="ph-lbl ph-halo">
            {pct(submerged)} %
          </text>
          <text x={BX + s / 2 + 18} y={labelY + 16} className="ph-lbl ph-lbl-sm ph-halo">
            pod hladinou
          </text>
        </motion.g>
      )}
      <Glass />
      <text x={(TL + TR) / 2} y={BOT + 22} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        {LIQUIDS[liquid].name}: ρ = {czNum(LIQUIDS[liquid].rho, 2)} g/cm³
      </text>
    </>
  )
}

export default function DensityFloat() {
  const [m, setM] = useState(60)
  const [V, setV] = useState(100)
  const [liquid, setLiquid] = useState<LiquidId>('voda')
  const nar = useNarrow()
  const { rho, state } = floatInLiquid(m, V, LIQUIDS[liquid].rho)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[22, -12, 278, 268]} max={380} label={densityLabel(m, V, liquid)} className="xp-df">
          <Picture m={m} V={V} liquid={liquid} />
        </Plate>
      }
      controls={
        <>
          <Control label="hmotnost m" unit="g" value={m} min={5} max={250} step={5} onChange={setM} />
          <Control label="objem V" unit="cm³" value={V} min={25} max={250} step={5} onChange={setV} />
          <Choice
            label="kapalina (ρ v g/cm³)"
            value={liquid}
            onChange={setLiquid}
            options={(Object.keys(LIQUIDS) as LiquidId[]).map((k) => ({ value: k, label: `${LIQUIDS[k].name} ${czNum(LIQUIDS[k].rho, 2)}` }))}
          />
        </>
      }
      readouts={
        <>
          <Readout label="hustota ρ = m / V" value={rho} digits={2} unit="g/cm³" />
          <Readout label={`kostka ${IN[liquid]}`} value={SAYS[state]} />
        </>
      }
      challenge="Nastav hmotnost a objem tak, aby se kostka vznášela."
      done={state === 'hover'}
    />
  )
}
