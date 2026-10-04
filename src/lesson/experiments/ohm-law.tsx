import { useId, useRef, useState } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue } from 'motion/react'
import { Plate, czNum, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { ohmLaw } from './ohm-law.model'

/** "Vyzkoušej si" for f6-3: change the voltage and the resistance and watch the ammeter and the lamp. */

// circuit loop (viewBox units): battery on the left, ammeter and resistor on top, lamp on the right
const L = 44
const R = 292
const T = 56
const B = 200
const MID = (T + B) / 2
const AX = 128 // ammeter x
const RX = 214 // resistor x
/** distance between the current dots along the wire */
const GAP = 20
/** dot speed: px per second per ampere (capped so big currents don't strobe) */
const PX_PER_A = 60
const MAX_SPEED = 260

/** The wire as one path from the + terminal round the loop to the − terminal (direction of the current). */
const WIRE = `M${L} ${MID - 15} V${T} H${R} V${B} H${L} V${MID + 15}`

const RAYS = [-50, -25, 0, 25, 50, 130, 155, 180, 205, 230]

function ohmLabel(U: number, Rv: number): string {
  const { I, P, glow } = ohmLaw(U, Rv)
  const head = `Schéma obvodu: baterie s napětím ${czNum(U)} V, ampérmetr, rezistor s odporem ${Rv} Ω a žárovka zapojené za sebou. `
  if (I === 0) return head + 'Napětí je nulové, obvodem neteče proud a žárovka nesvítí.'
  const lamp = glow < 0.3 ? 'svítí slabě' : glow < 0.65 ? 'svítí středně jasně' : 'svítí jasně'
  return head + `Ampérmetr ukazuje proud ${czNum(I, 2)} A, žárovka ${lamp} (příkon ${czNum(P, P < 10 ? 2 : 1)} W).`
}

/** Current dots drifting along the wire, faster with a bigger current; hidden under the parts. */
function Current({ I }: { I: number }) {
  const { still } = usePlate()
  const ref = useRef<SVGPathElement>(null)
  const visible = useInView(ref, { amount: 0.2 })
  const offset = useMotionValue(0)
  const mask = 'xpo' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const speed = Math.min(MAX_SPEED, PX_PER_A * I)
  useAnimationFrame((_, delta) => {
    if (still || !visible || speed === 0) return
    // a negative offset moves the dots forward along the path (from + to −)
    offset.set((offset.get() - (speed * Math.min(delta, 100)) / 1000) % GAP)
  })
  if (still) return null
  return (
    <g>
      <mask id={mask} maskUnits="userSpaceOnUse" x={0} y={0} width={340} height={240}>
        <rect x={0} y={0} width={340} height={240} fill="#fff" />
        <circle cx={AX} cy={T} r={14} fill="#000" />
        <rect x={RX - 17} y={T - 9} width={34} height={18} fill="#000" />
        <circle cx={R} cy={MID} r={14} fill="#000" />
      </mask>
      {/* no current, no drift: hidden (not unmounted, so useInView keeps its element) */}
      <motion.path
        ref={ref}
        d={WIRE}
        className={`xp-ohm-dots${I > 0 ? '' : ' xp-ohm-off'}`}
        mask={`url(#${mask})`}
        style={{ strokeDashoffset: offset }}
      />
    </g>
  )
}

function Lamp({ glow }: { glow: number }) {
  const r0 = 15
  return (
    <g transform={`translate(${R} ${MID})`}>
      {glow > 0 && (
        <g className="xp-ohm-light" style={{ opacity: Math.min(1, glow * 2.5) }}>
          <circle r={r0 + 4 + 22 * glow} className="xp-ohm-halo" style={{ opacity: 0.1 + 0.12 * glow }} />
          <circle r={r0 + 2 + 10 * glow} className="xp-ohm-halo" style={{ opacity: 0.14 + 0.2 * glow }} />
          {RAYS.map((a) => {
            const c = Math.cos((a * Math.PI) / 180)
            const s = Math.sin((a * Math.PI) / 180)
            const r1 = r0 + 4 + 22 * glow
            return <path key={a} d={`M${(c * r0).toFixed(1)} ${(s * r0).toFixed(1)} L${(c * r1).toFixed(1)} ${(s * r1).toFixed(1)}`} className="xp-ohm-ray" />
          })}
        </g>
      )}
      <circle r={11} className="ph-part" style={{ fill: `color-mix(in srgb, var(--yellow) ${Math.round(glow * 90)}%, var(--surface))` }} />
      <path d="M-7.8 -7.8 L7.8 7.8 M-7.8 7.8 L7.8 -7.8" className="ph-part" />
    </g>
  )
}

function Battery() {
  const sign = (t: string, y: number) => (
    <text x={L - 22} y={y} className="ph-part-t" style={{ fontSize: 14 }}>
      {t}
    </text>
  )
  return (
    <g className="ph-part">
      <path d={`M${L - 14} ${MID - 15} H${L + 14} M${L - 14} ${MID + 6} H${L + 14}`} />
      <path d={`M${L - 7} ${MID - 6} H${L + 7} M${L - 7} ${MID + 15} H${L + 7}`} style={{ strokeWidth: 4.2 }} />
      <path d={`M${L} ${MID - 6} V${MID + 6}`} className="ph-dot2" style={{ strokeWidth: 1.4 }} />
      {sign('+', MID - 12)}
      {sign('−', MID + 22)}
    </g>
  )
}

function Picture({ U, Rv }: { U: number; Rv: number }) {
  const { I, glow } = ohmLaw(U, Rv)
  return (
    <>
      <path d={WIRE} className="ph-wire" />
      <Current I={I} />
      <Battery />
      <text x={L + 22} y={MID + 5} className="ph-lbl">
        U = {czNum(U)} V
      </text>
      {/* ammeter with its reading */}
      <circle cx={AX} cy={T} r={12} className="ph-part ph-part-fill" />
      <text x={AX} y={T + 4.6} className="ph-part-t">
        A
      </text>
      <text x={AX} y={T + 36} textAnchor="middle" className="ph-lbl xp-ohm-reading">
        I = {czNum(I, 2)} A
      </text>
      {/* resistor */}
      <rect x={RX - 15} y={T - 6.5} width={30} height={13} className="ph-part ph-part-fill" />
      <text x={RX} y={T - 16} textAnchor="middle" className="ph-lbl">
        R = {Rv} Ω
      </text>
      <Lamp glow={glow} />
    </>
  )
}

export default function OhmLaw() {
  const [U, setU] = useState(6)
  const [Rv, setR] = useState(20)
  const nar = useNarrow()
  const { I, P } = ohmLaw(U, Rv)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[4, 14, 336, 214]} max={460} label={ohmLabel(U, Rv)} className="xp-ohm">
          <Picture U={U} Rv={Rv} />
        </Plate>
      }
      controls={
        <>
          <Control label="napětí U" unit="V" value={U} min={0} max={12} step={0.5} digits={1} onChange={setU} />
          <Control label="odpor R" unit="Ω" value={Rv} min={2} max={60} step={1} onChange={setR} />
        </>
      }
      readouts={
        <>
          <Readout label="proud I = U / R" value={I} digits={2} unit="A" />
          <Readout label="příkon P = U · I" value={P} digits={P < 10 ? 2 : 1} unit="W" />
        </>
      }
      challenge="Nastav proud přesně 0,5 A."
      done={Math.abs(I - 0.5) < 5e-4}
    />
  )
}
