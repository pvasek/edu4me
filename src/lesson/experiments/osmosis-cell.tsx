import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { ISO, osmosis, type CellKind, type CellState, type Tonicity } from './osmosis-cell.model'

/**
 * "Vyzkoušej si" for b9-3: a red blood cell or a plant cell in a salt solution. Water
 * crosses the membrane towards the saltier side: the cell swells and bursts, stays as
 * it is, or shrinks (krenace, plazmolýza).
 */

// dish (viewBox units)
const DL = 14
const DR = 326
const DT = 16
const DB = 196
const CX = 170
const CY = 104
/** red blood cell radius in an isotonic solution */
const R0 = 44
/** plant cell wall half-size */
const WA = 78
const WB = 50
/** points on every outline (the same count, so outlines morph smoothly) */
const N = 48

const TON: Record<Tonicity, string> = { hypo: 'hypotonický', iso: 'izotonický', hyper: 'hypertonický' }
const STATE: Record<CellState, string> = {
  lysis: 'praskla (hemolýza)',
  swollen: 'nabobtnala',
  normal: 'nemění se',
  crenated: 'svraštila se',
  turgid: 'napjatá (turgor)',
  flaccid: 'ochablá',
  plasmolysis: 'v plazmolýze',
}
/** The red cell keeps its own colours in both themes (a subject colour, like a flame). */
const RBC = '#c4564a'
const RBC_PALE = '#e3a196'
const RBC_GHOST = 'rgba(232, 176, 166, 0.55)'

const CELL_NAME: Record<CellKind, string> = { rbc: 'červená krvinka', plant: 'rostlinná buňka' }

/** A smooth closed path through N points at radius r(θ) (Catmull–Rom → cubic Béziers). */
function blob(r: (t: number) => number, cx = CX, cy = CY): string {
  const p = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * 2 * Math.PI
    const rr = r(t)
    return [cx + rr * Math.cos(t), cy + rr * Math.sin(t)]
  })
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(p[0][0])} ${f(p[0][1])}`
  for (let i = 0; i < N; i++) {
    const p0 = p[(i - 1 + N) % N]
    const p1 = p[i]
    const p2 = p[(i + 1) % N]
    const p3 = p[(i + 2) % N]
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + ' Z'
}

/** Polar superellipse: a rounded rectangle (big n) that becomes an ellipse (n = 2). */
const superR = (a: number, b: number, n: number) => (t: number) =>
  (Math.abs(Math.cos(t) / a) ** n + Math.abs(Math.sin(t) / b) ** n) ** (-1 / n)

/** Seeded scatter for the salt particles. */
const SALT = Array.from({ length: 70 }, (_, i) => {
  const a = Math.sin(i * 78.233 + 1.3) * 43758.5453
  const b = Math.sin(i * 12.989 + 4.1) * 24634.6345
  return { x: DL + 8 + (a - Math.floor(a)) * (DR - DL - 16), y: DT + 8 + (b - Math.floor(b)) * (DB - DT - 16), na: i % 2 === 0 }
})

function osmosisLabel(kind: CellKind, nacl: number): string {
  const o = osmosis(kind, nacl)
  const head = `${kind === 'rbc' ? 'Červená krvinka' : 'Rostlinná buňka'} v roztoku s ${czNum(nacl, 2)} % NaCl. Roztok je ${TON[o.tonicity]}`
  const water =
    o.water === 'in'
      ? ', voda proudí do buňky.'
      : o.water === 'out'
        ? ', voda z buňky odchází.'
        : ', voda proudí oběma směry stejně.'
  const what: Record<CellState, string> = {
    lysis: 'Krvinka nasála tolik vody, že její membrána praskla a hemoglobin vytekl (hemolýza).',
    swollen: 'Krvinka nabobtnala a zakulatila se.',
    normal: 'Krvinka si drží svůj tvar.',
    crenated: 'Krvinka ztratila vodu, zmenšila se a svraštila (plazmorhiza, krenace).',
    turgid: 'Protoplast se tlačí na buněčnou stěnu, buňka je napjatá (turgor); stěna ji chrání před prasknutím.',
    flaccid: 'Protoplast jen přiléhá ke stěně, buňka je ochablá.',
    plasmolysis: 'Protoplast ztratil vodu a odtrhl se od buněčné stěny (plazmolýza).',
  }
  return `${head}${water} ${what[o.state]}`
}

function Arrows({ water, nacl }: { water: 'in' | 'none' | 'out'; nacl: number }) {
  const { id } = usePlate()
  const strength = Math.min(1, Math.abs(Math.log(Math.max(nacl, 0.05) / ISO)) / 1.6)
  const len = 14 + 16 * strength
  const angles = [-0.6, 0.6, Math.PI - 0.6, Math.PI + 0.6]
  return (
    <g style={{ stroke: 'var(--ph-c)', strokeWidth: 2.4, strokeLinecap: 'round', fill: 'none' }}>
      {angles.map((t, i) => {
        const c = Math.cos(t)
        const s = Math.sin(t)
        // arrows sit outside the cell, along a ray from its centre
        const rOut = 128
        const rIn = rOut - len
        const ex = CX + rOut * c * 0.95
        const ey = CY + rOut * s * 0.6
        const ix = CX + rIn * c * 0.95
        const iy = CY + rIn * s * 0.6
        if (water === 'none')
          return <path key={i} d={`M${ex.toFixed(1)} ${ey.toFixed(1)} L${ix.toFixed(1)} ${iy.toFixed(1)}`} markerEnd={url(id, 'as-c')} markerStart={url(id, 'as-c')} />
        const [x1, y1, x2, y2] = water === 'in' ? [ex, ey, ix, iy] : [ix, iy, ex, ey]
        return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} markerEnd={url(id, 'ah-c')} />
      })}
      <text x={CX + 128 * 0.95 * Math.cos(-0.6) - 10} y={CY + 128 * 0.6 * Math.sin(-0.6) - 16} className="ph-lbl ph-lbl-sm" style={{ stroke: 'none', fill: 'var(--ph-c)' }}>
        voda
      </text>
    </g>
  )
}

function RedCell({ state, volume }: { state: CellState; volume: number }) {
  const { still } = usePlate()
  const tr = { duration: still ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const }
  const R = R0 * Math.cbrt(volume)
  const spikes = state === 'crenated' ? 0.025 + 0.045 * Math.min(1, (1 - volume) / 0.35) : 0
  const torn = state === 'lysis'
  const outline = blob((t) => R * (1 + spikes * Math.abs(Math.sin(8 * t)) - spikes / 2) * (torn ? 1 + 0.015 * Math.sin(9 * t) : 1))
  // the pale dimple in the middle shows the biconcave disc; a swollen cell is a sphere without it
  const dimple = state === 'normal' ? 0.42 : state === 'crenated' ? 0.3 : state === 'swollen' ? 0.42 * Math.max(0, (1.45 - volume) / 0.45) : 0
  const fill = torn ? RBC_GHOST : RBC
  return (
    <g>
      {torn && (
        // hemoglobin escaping into the solution
        <g style={{ fill: RBC, opacity: 0.8 }}>
          {Array.from({ length: 22 }, (_, i) => {
            const t = i * 2.4
            const r = R + 8 + ((i * 37) % 30)
            return <circle key={i} cx={CX + r * Math.cos(t)} cy={CY + r * Math.sin(t) * 0.9} r={1.8} />
          })}
        </g>
      )}
      <g style={{ fill }}>
        <motion.path initial={false} animate={{ d: outline }} transition={tr} />
      </g>
      <g style={{ fill: RBC_PALE }}>
        <motion.circle initial={false} animate={{ r: Math.max(0.01, R * dimple), opacity: dimple > 0 ? 1 : 0 }} transition={tr} cx={CX} cy={CY} />
      </g>
      <motion.path initial={false} animate={{ d: outline }} transition={tr} className="ph-o ph-thick" style={torn ? { strokeDasharray: '16 7' } : undefined} />
    </g>
  )
}

function PlantCell({ state, volume }: { state: CellState; volume: number }) {
  const { id, still } = usePlate()
  const tr = { duration: still ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const }
  const k = state === 'turgid' ? 1.04 : 1
  const a = WA * k
  const b = WB * k
  const wall = `M${CX - a} ${CY - b} H${CX + a} V${CY + b} H${CX - a} Z`
  // protoplast: fills the wall, or shrinks (area ∝ volume) and rounds off in plasmolysis
  const s = Math.sqrt(volume)
  const n = state === 'plasmolysis' ? 2.2 + 6 * Math.max(0, volume - 0.6) : 8
  const pa = (a - 5) * s
  const pb = (b - 5) * (state === 'plasmolysis' ? Math.max(0.55, s * 0.95) : 1)
  const proto = blob(superR(pa, pb, n))
  const vac = blob(superR(pa * 0.66, pb * 0.55, n), CX + 6 * s, CY)
  const chloro = [0.3, 1.1, 1.9, 2.6, 3.5, 4.3, 5.1, 5.8]
  const rp = superR(pa, pb, n)
  return (
    <g>
      {/* cell wall: cellulose, permeable to water and salt */}
      <path d={wall} style={{ fill: 'none', stroke: 'color-mix(in srgb, var(--green) 45%, var(--yellow))', strokeWidth: 7, strokeLinejoin: 'round' }} />
      <path d={wall} fill="none" stroke={url(id, 'd')} strokeWidth={7} />
      <path d={`M${CX - a - 3.5} ${CY - b - 3.5} h${2 * a + 7} v${2 * b + 7} h${-2 * a - 7} Z M${CX - a + 3.5} ${CY - b + 3.5} h${2 * a - 7} v${2 * b - 7} h${-2 * a + 7} Z`} className="ph-o ph-thin" />
      <motion.path initial={false} animate={{ d: proto }} transition={tr} style={{ fill: 'color-mix(in srgb, var(--green) 30%, var(--surface))' }} />
      <motion.path initial={false} animate={{ d: vac }} transition={tr} className="ph-o ph-thin" style={{ fill: 'color-mix(in srgb, var(--info-soft) 70%, var(--surface))' }} />
      {chloro.map((t) => {
        const r = rp(t) * 0.82
        return (
          <motion.ellipse
            key={t}
            initial={false}
            animate={{ cx: CX + r * Math.cos(t), cy: CY + r * Math.sin(t) }}
            transition={tr}
            rx={5}
            ry={3}
            style={{ fill: 'var(--green)', stroke: 'var(--edge)', strokeWidth: 0.6 }}
          />
        )
      })}
      <motion.circle initial={false} animate={{ cx: CX - pa * 0.62, cy: CY + pb * 0.1 }} transition={tr} r={8} className="ph-o ph-thin" style={{ fill: 'color-mix(in srgb, var(--violet) 40%, var(--surface))' }} />
      <motion.path initial={false} animate={{ d: proto }} transition={tr} className="ph-o ph-thick" style={{ fill: 'none' }} />
    </g>
  )
}

function Picture({ kind, nacl }: { kind: CellKind; nacl: number }) {
  const { id } = usePlate()
  const o = osmosis(kind, nacl)
  const nSalt = Math.round((nacl / 3) * SALT.length)
  const dish = `M${DL} ${DT} H${DR} V${DB} H${DL} Z`
  return (
    <>
      <path d={dish} className="ph-water" />
      <path d={dish} fill={url(id, 'h')} opacity={0.5} />
      {SALT.slice(0, nSalt).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.na ? 1.9 : 2.6} style={{ fill: p.na ? 'var(--violet)' : 'var(--muted)', opacity: 0.75 }} />
      ))}
      {kind === 'rbc' ? <RedCell state={o.state} volume={o.volume} /> : <PlantCell state={o.state} volume={o.volume} />}
      <Arrows water={o.water} nacl={nacl} />
      <path d={dish} className="ph-o" />
      <text x={DL + 8} y={DB - 9} className="ph-lbl ph-lbl-sm ph-halo">
        {CELL_NAME[kind]}
      </text>
      <text x={DR - 8} y={DB - 9} textAnchor="end" className="ph-lbl ph-lbl-sm ph-halo">
        NaCl {czNum(nacl, 2)} %
      </text>
    </>
  )
}

export default function OsmosisCell() {
  const [nacl, setNacl] = useState(2)
  const [kind, setKind] = useState<CellKind>('rbc')
  const nar = useNarrow()
  const o = osmosis(kind, nacl)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[8, 10, 324, 192]} max={460} label={osmosisLabel(kind, nacl)}>
          <Picture kind={kind} nacl={nacl} />
        </Plate>
      }
      controls={
        <>
          <Control label="NaCl kolem buňky" unit="%" value={nacl} min={0} max={3} step={0.05} digits={2} onChange={(v) => setNacl(Math.round(v * 100) / 100)} />
          <Choice
            label="buňka"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'rbc', label: 'červená krvinka' },
              { value: 'plant', label: 'rostlinná buňka' },
            ]}
          />
        </>
      }
      readouts={
        <>
          <Readout label="roztok je" value={TON[o.tonicity]} />
          <Readout label={kind === 'rbc' ? 'krvinka' : 'buňka'} value={STATE[o.state]} tone={o.state === 'lysis' ? 'bad' : undefined} />
        </>
      }
      challenge="Najdi koncentraci, ve které se červená krvinka nemění."
      done={kind === 'rbc' && o.tonicity === 'iso'}
    />
  )
}
