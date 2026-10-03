import { useRef, useState } from 'react'
import { useAnimationFrame, useInView } from 'motion/react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { CO2_AIR, MAX_RATE, photosynthesisRate, type Factor } from './photosynthesis-rate.model'

/**
 * "Vyzkoušej si" for b3-3 and b9-6: light, CO₂ and temperature set how fast a sprig of
 * vodní mor gives off oxygen. Three bars show how much each factor would allow; the
 * shortest one (the limiting factor) sets the rate.
 */

// beaker (viewBox units)
const BL = 78
const BR = 204
const RIM = 36
const BOT = 222
const G = 4
const SURF = 58
// the sprig: stem from the weight on the bottom up to the cut end, where bubbles leave
const SX = 136
const CUT = 140
// thermometer
const TX = 188
const T_TOP = 70
const T_BOT = 196
// bars
const BAR_X = [252, 296, 340]
const BAR_W = 24
const BAR_TOP = 70
const BAR_BOT = 196
/** bubble rise speed (px/s) */
const SPEED = 34

const NAMES: Record<Factor, string> = { light: 'světlo', co2: 'CO₂', temp: 'teplota' }
const ORDER: Factor[] = ['light', 'co2', 'temp']

/** Seeded scatter for the dissolved CO₂ dots. */
const DOTS = Array.from({ length: 24 }, (_, i) => {
  const a = Math.sin(i * 91.7 + 3.1) * 43758.5453
  const b = Math.sin(i * 47.3 + 1.7) * 24634.6345
  const fx = a - Math.floor(a)
  const fy = b - Math.floor(b)
  return { x: BL + G + 8 + fx * (BR - BL - 2 * G - 16), y: SURF + 10 + fy * (BOT - G - SURF - 22) }
})

function limitingText(limiting: Factor[]): string {
  if (limiting.length === 0) return 'nic z toho'
  return limiting.map((f) => NAMES[f]).join(' i ')
}

function photoLabel(light: number, co2: number, temp: number): string {
  const { rate, limiting } = photosynthesisRate(light, co2, temp)
  const head = `Kádinka s vodou a větvičkou vodního moru pod lampou. Intenzita světla ${light} %, koncentrace CO₂ ${czNum(co2, 2)} %, teplota ${temp} °C. `
  if (rate < 0.5) return head + (temp >= 45 ? 'Při takové teplotě se enzymy rozpadají a rostlina kyslík nevytváří.' : 'Rostlina nevytváří žádné bublinky kyslíku.')
  const why =
    limiting.length === 0
      ? 'Všechny tři faktory jsou nasycené, rostlina pracuje naplno.'
      : `Rychlost brzdí ${limitingText(limiting)}, ostatní faktory by dovolily víc.`
  const n = Math.round(rate)
  const word = n === 1 ? 'bublinka' : n >= 2 && n <= 4 ? 'bublinky' : 'bublinek'
  return head + `Z rostliny stoupá asi ${n} ${word} kyslíku za minutu. ${why}`
}

/** A few bubbles at a time: born at the cut end at `rate` per minute, rising to the surface. */
function Bubbles({ rate }: { rate: number }) {
  const { still } = usePlate()
  const ref = useRef<SVGGElement>(null)
  const visible = useInView(ref, { amount: 0.1 })
  const st = useRef({ t: 0, phase: 0.6, n: 0, list: [] as { born: number; dx: number }[] })
  const [, tick] = useState(0)
  useAnimationFrame((_, delta) => {
    if (still || !visible) return
    const s = st.current
    if (rate <= 0 && s.list.length === 0) return
    const dt = Math.min(delta, 100) / 1000
    s.t += dt
    s.phase += (rate / 60) * dt
    while (s.phase >= 1) {
      s.phase -= 1
      s.list.push({ born: s.t, dx: ((s.n++ * 7) % 5) - 2 })
    }
    s.list = s.list.filter((b) => CUT - 6 - (s.t - b.born) * SPEED > SURF + 3)
    tick((v) => (v + 1) % 1e6)
  })
  if (still) {
    // a static column: more bubbles for a faster rate
    const n = Math.round((rate / MAX_RATE) * 7)
    return (
      <g ref={ref}>
        {Array.from({ length: n }, (_, i) => (
          <circle key={i} cx={SX + (i % 2 ? 2 : -1)} cy={CUT - 8 - (i * (CUT - SURF - 14)) / Math.max(1, n - 1)} r={2.6} className="ph-o" style={{ fill: 'var(--surface)' }} />
        ))}
      </g>
    )
  }
  const s = st.current
  return (
    <g ref={ref}>
      {s.list.map((b) => {
        const age = s.t - b.born
        return (
          <circle
            key={b.born}
            cx={SX + b.dx + 1.6 * Math.sin(age * 7)}
            cy={CUT - 6 - age * SPEED}
            r={2.2 + Math.min(0.8, age * 0.4)}
            className="ph-o"
            style={{ fill: 'var(--surface)' }}
          />
        )
      })}
    </g>
  )
}

/** Elodea: a stem densely set with whorls of three small leaves curving upwards. */
function Sprig() {
  const whorls = [204, 194, 184, 175, 166, 158, 151, 145]
  const stroke = 'color-mix(in srgb, var(--green) 70%, var(--ink))'
  const leaf = (y: number, side: number, k: number) => {
    const len = 11 - k * 0.5
    const up = 6 + k * 0.3
    return `M${SX} ${y} q${side * len * 0.55} ${-up * 0.05} ${side * len} ${-up} q${-side * len * 0.6} ${up * 0.55} ${-side * len} ${up}`
  }
  return (
    <g>
      <path d={`M${SX} ${BOT - G - 8} V${CUT}`} className="ph-o ph-thick" style={{ stroke }} />
      {whorls.map((y, k) => (
        <g key={y} style={{ fill: 'color-mix(in srgb, var(--green) 55%, var(--surface))', stroke, strokeWidth: 0.9 }}>
          <path d={leaf(y, -1, k)} />
          <path d={leaf(y, 1, k)} />
          <ellipse cx={SX + (k % 2 ? 1.5 : -1.5)} cy={y - 4} rx={1.8} ry={4} />
        </g>
      ))}
      {/* the weight that holds the sprig down */}
      <rect x={SX - 7} y={BOT - G - 10} width={14} height={7} rx={1.5} className="ph-o" style={{ fill: 'var(--surface-3)' }} />
      <path d={`M${SX - 3} ${CUT} h6`} className="ph-o ph-thin" />
    </g>
  )
}

function Lamp({ light }: { light: number }) {
  const k = light / 100
  const rays = [-24, -12, 0, 12, 24]
  return (
    <g>
      {light > 0 && (
        <g style={{ opacity: 0.25 + 0.75 * k }}>
          <circle cx={30} cy={110} r={10 + 12 * k} style={{ fill: 'var(--yellow)', opacity: 0.25 }} />
          {rays.map((a) => {
            const r = (a * Math.PI) / 180
            return (
              <path
                key={a}
                d={`M${(42 + 8 * Math.cos(r)).toFixed(1)} ${(110 + 8 * Math.sin(r)).toFixed(1)} l${(14 + 14 * k) * Math.cos(r)} ${(14 + 14 * k) * Math.sin(r)}`}
                style={{ stroke: 'var(--yellow)', strokeWidth: 2.2, strokeLinecap: 'round' }}
              />
            )
          })}
        </g>
      )}
      {/* reflector, bulb, stand */}
      <path d="M14 92 L40 98 V122 L14 128 Z" className="ph-o" style={{ fill: 'var(--surface-2)' }} />
      <circle cx={40} cy={110} r={7} className="ph-o" style={{ fill: `color-mix(in srgb, var(--yellow) ${Math.round(15 + 80 * k)}%, var(--surface))` }} />
      <path d="M22 128 V214 M8 216 H38" className="ph-o ph-thick" />
    </g>
  )
}

function Thermometer({ temp }: { temp: number }) {
  const y = T_BOT - ((T_BOT - T_TOP - 8) * temp) / 50
  return (
    <g>
      <rect x={TX - 3.5} y={T_TOP - 4} width={7} height={T_BOT - T_TOP + 4} rx={3.5} className="ph-o" style={{ fill: 'var(--surface)' }} />
      <path d={`M${TX} ${T_BOT} V${y.toFixed(1)}`} style={{ stroke: 'var(--bad)', strokeWidth: 3, strokeLinecap: 'round' }} />
      <circle cx={TX} cy={T_BOT + 4} r={5.5} className="ph-o" style={{ fill: 'var(--bad)' }} />
    </g>
  )
}

function Bars({ caps, limiting, rate }: { caps: Record<Factor, number>; limiting: Factor[]; rate: number }) {
  const { id } = usePlate()
  const h = BAR_BOT - BAR_TOP
  const yRate = BAR_BOT - (h * rate) / MAX_RATE
  return (
    <g>
      <text x={(BAR_X[0] + BAR_X[2]) / 2} y={BAR_TOP - 22} textAnchor="middle" className="ph-cap">
        každý faktor dovolí
      </text>
      <path d={`M${BAR_X[0] - 18} ${BAR_TOP} H${BAR_X[2] + 18}`} className="ph-o ph-thin ph-soft" />
      <text x={BAR_X[2] + 18} y={BAR_TOP - 5} textAnchor="end" className="ph-num">
        max.
      </text>
      {ORDER.map((f, i) => {
        const lim = limiting.includes(f)
        const top = BAR_BOT - h * caps[f]
        return (
          <g key={f}>
            <rect x={BAR_X[i] - BAR_W / 2} y={BAR_TOP} width={BAR_W} height={h} className="ph-o ph-thin ph-soft" style={{ fill: 'var(--surface)' }} />
            {caps[f] > 0 && (
              <>
                <rect
                  x={BAR_X[i] - BAR_W / 2}
                  y={top}
                  width={BAR_W}
                  height={BAR_BOT - top}
                  style={{ fill: lim ? 'color-mix(in srgb, var(--ph-a) 45%, var(--surface))' : 'var(--surface-3)' }}
                />
                <rect x={BAR_X[i] - BAR_W / 2} y={top} width={BAR_W} height={BAR_BOT - top} fill={url(id, lim ? 'ta' : 'd')} />
                <rect x={BAR_X[i] - BAR_W / 2} y={top} width={BAR_W} height={BAR_BOT - top} className={`ph-o${lim ? ' ph-thick' : ''}`} />
              </>
            )}
            <text x={BAR_X[i]} y={BAR_BOT + 17} textAnchor="middle" className={`ph-lbl ph-lbl-sm`} style={lim ? { fill: 'var(--ph-a)' } : undefined}>
              {NAMES[f]}
            </text>
          </g>
        )
      })}
      {/* the rate: as high as the shortest bar */}
      <path d={`M${BAR_X[0] - 20} ${yRate.toFixed(1)} H${BAR_X[2] + 20}`} className="ph-guide" />
    </g>
  )
}

function Picture({ light, co2, temp }: { light: number; co2: number; temp: number }) {
  const { id } = usePlate()
  const { rate, caps, limiting } = photosynthesisRate(light, co2, temp)
  const water = `M${BL + G} ${SURF} H${BR - G} V${BOT - G} H${BL + G} Z`
  const glass = `M${BL} ${RIM} V${BOT} H${BR} V${RIM} H${BR - G} V${BOT - G} H${BL + G} V${RIM} Z`
  const nDots = Math.round((co2 / 0.2) * DOTS.length)
  return (
    <>
      <Lamp light={light} />
      <path d={water} className="ph-water" />
      <path d={water} fill={url(id, 'h')} opacity={0.6} />
      {DOTS.slice(0, nDots).map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.6} style={{ fill: 'var(--ink-soft)', opacity: 0.55 }} />
      ))}
      <Sprig />
      <Bubbles rate={rate} />
      <path d={`M${BL + G} ${SURF} H${BR - G}`} className="ph-o" />
      <Thermometer temp={temp} />
      <path d={glass} className="ph-glass" />
      <path d={glass} className="ph-o" />
      <text x={SX - 10} y={SURF - 8} textAnchor="end" className="ph-lbl ph-lbl-sm">
        O₂
      </text>
      <text x={(BL + BR) / 2 - 6} y={BOT + 20} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        vodní mor
      </text>
      <text x={TX} y={RIM - 6} textAnchor="middle" className="ph-num">
        {temp} °C
      </text>
      <Bars caps={caps} limiting={limiting} rate={rate} />
    </>
  )
}

export default function PhotosynthesisRate() {
  const [light, setLight] = useState(30)
  const [co2, setCo2] = useState(0.08)
  const [temp, setTemp] = useState(20)
  const nar = useNarrow()
  const { rate, limiting } = photosynthesisRate(light, co2, temp)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[2, 24, 370, 222]} max={480} label={photoLabel(light, co2, temp)}>
          <Picture light={light} co2={co2} temp={temp} />
        </Plate>
      }
      controls={
        <>
          <Control label="intenzita světla" unit="%" value={light} min={0} max={100} step={5} onChange={setLight} />
          <Control label="CO₂ (vzduch ≈ 0,04 %)" unit="%" value={co2} min={0} max={0.2} step={0.01} digits={2} onChange={(v) => setCo2(Math.round(v * 100) / 100)} />
          <Control label="teplota" unit="°C" value={temp} min={0} max={50} step={1} onChange={setTemp} />
        </>
      }
      readouts={
        <>
          <Readout label="bublinky O₂ za minutu" value={rate} digits={0} />
          <Readout label="co brzdí fotosyntézu" value={rate < 0.5 && temp >= 45 ? 'teplota (enzymy)' : limitingText(limiting)} />
        </>
      }
      challenge="Zjisti, co brzdí fotosyntézu, když je hodně světla, ale málo CO₂."
      done={light >= 70 && co2 <= CO2_AIR && limiting.length === 1 && limiting[0] === 'co2'}
    />
  )
}
