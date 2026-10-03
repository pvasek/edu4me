import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { coreEdge, largestEdgeWithRatio, ratio, suppliedShare, surface, volume } from './surface-volume.model'

/** "Vyzkoušej si" for b1-4 and b9-3: grow a cube-shaped cell and watch S : V fall until its centre starves. */

const U = 10.5 // px per length unit (both drawings share the scale)
const DEPTH = 0.36 // cabinet projection: depth drawn as this share of the edge, at 45°
const X0 = 18 // cube: left edge of the front face
const BASE = 214 // cube: bottom of the front face
const KX = 248 // cut: centre
const KY = 128

const pct = (f: number) => Math.round(f * 100)
const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`

function svLabel(a: number): string {
  const r = ratio(a)
  const head = `Buňka ve tvaru krychle s hranou a = ${a}: povrch ${surface(a)}, objem ${volume(a)}, poměr S : V je ${czNum(r, 2)} : 1. `
  if (suppliedShare(a) >= 1) return head + 'Povrchem projde dost kyslíku pro celý objem, celý řez buňkou je zásobený.'
  return head + `Kyslík vchází jen povrchem a pro tak velký objem nestačí: zásobeno je asi ${pct(suppliedShare(a))} % buňky, její střed šedne a dusí se.`
}

/** The cube with a grid of unit squares on its three visible faces. */
function Cube({ a }: { a: number }) {
  const { id } = usePlate()
  const L = a * U
  const d = L * DEPTH
  const dx = d * Math.SQRT1_2
  const dy = -d * Math.SQRT1_2
  const x1 = X0 + L
  const y0 = BASE - L
  const front = `M${pt(X0, y0)}H${x1}V${BASE}H${X0}Z`
  const top = `M${pt(X0, y0)}L${pt(X0 + dx, y0 + dy)}H${x1 + dx}L${pt(x1, y0)}Z`
  const side = `M${pt(x1, y0)}L${pt(x1 + dx, y0 + dy)}V${BASE + dy}L${pt(x1, BASE)}Z`
  let grid = ''
  for (let i = 1; i < a; i++) {
    const f = i / a
    // front face
    grid += `M${pt(X0 + f * L, y0)}V${BASE}M${pt(X0, y0 + f * L)}H${x1}`
    // top face
    grid += `M${pt(X0 + f * L, y0)}l${pt(dx, dy)}M${pt(X0 + f * dx, y0 + f * dy)}h${L.toFixed(1)}`
    // side face
    grid += `M${pt(x1 + f * dx, y0 + f * dy)}v${L.toFixed(1)}M${pt(x1, y0 + f * L)}l${pt(dx, dy)}`
  }
  return (
    <g>
      <path d={front} className="xp-sv-face" />
      <path d={top} className="xp-sv-face xp-sv-top" />
      <path d={side} className="xp-sv-face xp-sv-side" />
      <path d={side} fill={url(id, 'd')} opacity={0.5} />
      {a > 1 && <path d={grid} className="ph-o ph-thin xp-sv-grid" />}
      <path d={`${front}${top}${side}`} className="ph-o" />
      <text x={X0 + L / 2} y={BASE + 20} textAnchor="middle" className="ph-lbl">
        a = {a}
      </text>
    </g>
  )
}

/** A cut through the middle of the cell: the supplied rim and the starving grey core. */
function Cut({ a }: { a: number }) {
  const { id, still } = usePlate()
  const L = a * U
  const c = coreEdge(a) * U
  const share = suppliedShare(a)
  const arrows = [0, 90, 180, 270].map((deg) => {
    const r = (deg * Math.PI) / 180
    const ox = Math.cos(r)
    const oy = Math.sin(r)
    const from = L / 2 + 22
    const to = L / 2 + 3
    return `M${pt(KX + ox * from, KY + oy * from)}L${pt(KX + ox * to, KY + oy * to)}`
  })
  return (
    <g>
      <text x={KX} y={22} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        řez buňkou
      </text>
      <rect x={KX - L / 2} y={KY - L / 2} width={L} height={L} rx={Math.min(4, L / 4)} className="xp-sv-alive" />
      <motion.rect
        initial={false}
        animate={{ x: KX - c / 2, y: KY - c / 2, width: c, height: c, opacity: c > 0.5 ? 1 : 0 }}
        transition={still ? { duration: 0 } : { duration: 0.35 }}
        rx={Math.min(3, c / 4)}
        className="xp-sv-core"
      />
      {c > 0.5 && (
        <motion.rect
          initial={false}
          animate={{ x: KX - c / 2, y: KY - c / 2, width: c, height: c }}
          transition={still ? { duration: 0 } : { duration: 0.35 }}
          fill={url(id, 'dd')}
          opacity={0.6}
        />
      )}
      <rect x={KX - L / 2} y={KY - L / 2} width={L} height={L} rx={Math.min(4, L / 4)} className="ph-o xp-sv-membrane" />
      {arrows.map((d, i) => (
        <path key={i} d={d} className="ph-o xp-sv-o2" markerEnd={url(id, 'as-c')} />
      ))}
      <text x={KX + 9} y={KY - L / 2 - 12} className="ph-lbl ph-lbl-sm xp-sv-o2t">
        O₂
      </text>
      <text x={KX} y={KY + Math.max(L / 2, 10) + 44} textAnchor="middle" className={`ph-lbl ${share < 1 ? 'xp-sv-bad' : ''}`}>
        {share < 1 ? `zásobeno ${pct(share)} %` : 'celá zásobená'}
      </text>
    </g>
  )
}

export default function SurfaceVolume() {
  const [a, setA] = useState(2)
  const nar = useNarrow()
  const r = ratio(a)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[6, 6, 344, 240]} max={460} label={svLabel(a)} className="xp-sv">
          <Cube a={a} />
          <Cut a={a} />
        </Plate>
      }
      controls={<Control label="hrana krychle a" value={a} min={1} max={10} step={1} onChange={setA} />}
      readouts={
        <>
          <Readout label="povrch S = 6 · a²" value={surface(a)} digits={0} />
          <Readout label="objem V = a³" value={volume(a)} digits={0} />
          <Readout label="poměr S : V" value={`${czNum(r, 2)} : 1`} tone={r >= 1 ? 'good' : 'bad'} />
        </>
      }
      challenge="Najdi největší krychli, která má S : V aspoň 1."
      done={a === largestEdgeWithRatio(1)}
    />
  )
}
