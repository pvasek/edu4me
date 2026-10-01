/**
 * Paprsky – drawings: the optical bench (lens / mirror, object, F and 2F marks,
 * draggable image marker, principal rays), the plane mirror and the refraction
 * boundary. Engraved line art, theme tokens only.
 */
import { useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { motion } from 'motion/react'
import {
  fmt,
  imageOf,
  imagePoint,
  isMirror,
  principalRays,
  refractionAngle,
  type Medium,
  type Pt,
  type Scene,
  type View,
} from './logic'

const VW = 360
const VH = 236
const MX = 12

/** World window for a scene: level 5 in units of f, level 12 sized to fit object and image. */
export function viewFor(s: Scene, cm: boolean): View {
  const f = Math.abs(s.f)
  if (!cm) return { x0: -3.5 * f, x1: 3.5 * f, y0: -2.9 * s.h, y1: 2.9 * s.h }
  const img = imageOf(s.f, s.a)
  const L = Math.max(2.4 * f, 1.18 * s.a, img.ap !== null ? 1.18 * Math.abs(img.ap) : 0)
  const Y = Math.max(s.h, img.Z !== null ? Math.abs(img.Z) * s.h : 0) * 1.45
  return { x0: -L, x1: L, y0: -Y, y1: Y }
}

interface Map2 {
  X: (x: number) => number
  Y: (y: number) => number
  ix: (px: number) => number
  iy: (py: number) => number
}
function mapper(v: View): Map2 {
  const kx = (VW - 2 * MX) / (v.x1 - v.x0)
  const ky = (VH / 2 - 18) / v.y1
  return {
    X: (x) => MX + (x - v.x0) * kx,
    Y: (y) => VH / 2 - y * ky,
    ix: (px) => v.x0 + (px - MX) / kx,
    iy: (py) => (VH / 2 - py) / ky,
  }
}

const RAY_CLASS = { parallel: 'ro-ray-a', center: 'ro-ray-b', focal: 'ro-ray-c' } as const

function Arrow({ x, y0, y1, cls, dashed }: { x: number; y0: number; y1: number; cls: string; dashed?: boolean }) {
  const dir = y1 < y0 ? 1 : -1
  return (
    <g className={cls}>
      <line x1={x} y1={y0} x2={x} y2={y1 + dir * 6} strokeDasharray={dashed ? '4 3' : undefined} />
      <path d={`M${x - 5} ${y1 + dir * 9}L${x} ${y1}L${x + 5} ${y1 + dir * 9}Z`} />
    </g>
  )
}

function Element({ s, m }: { s: Scene; m: Map2 }) {
  const x = m.X(0)
  const top = 14
  const bot = VH - 14
  const mid = VH / 2
  switch (s.el) {
    case 'spojka':
      return <path d={`M${x} ${top}Q${x + 11} ${mid} ${x} ${bot}Q${x - 11} ${mid} ${x} ${top}Z`} className="ro-glass" />
    case 'rozptylka':
      return <path d={`M${x - 7} ${top}L${x + 7} ${top}Q${x + 1.5} ${mid} ${x + 7} ${bot}L${x - 7} ${bot}Q${x - 1.5} ${mid} ${x - 7} ${top}Z`} className="ro-glass" />
    case 'duté':
    case 'vypuklé': {
      const e = s.el === 'duté' ? -8 : 8 // x offset of the edges
      const c = -e // control point → apex at x
      const pts: string[] = []
      for (let k = 1; k < 14; k++) {
        const t = k / 14
        const bx = (1 - t) * (1 - t) * (x + e) + 2 * t * (1 - t) * (x + c) + t * t * (x + e)
        const by = (1 - t) * (1 - t) * top + 2 * t * (1 - t) * mid + t * t * bot
        pts.push(`M${bx} ${by}l7 7`)
      }
      return (
        <g>
          <path d={pts.join('')} className="ro-hatch" />
          <path d={`M${x + e} ${top}Q${x + c} ${mid} ${x + e} ${bot}`} className="ro-mirror" />
        </g>
      )
    }
  }
}

function Marks({ s, m, v }: { s: Scene; m: Map2; v: View }) {
  const f = s.f
  const marks: { x: number; t: string }[] = isMirror(s.el)
    ? [
        { x: -f, t: 'F' },
        { x: -2 * f, t: 'S' },
      ]
    : [
        { x: -Math.abs(f), t: f > 0 ? 'F' : 'F′' },
        { x: Math.abs(f), t: f > 0 ? 'F′' : 'F' },
        { x: -2 * Math.abs(f), t: '2F' },
        { x: 2 * Math.abs(f), t: '2F′' },
      ]
  const y = m.Y(0)
  return (
    <g>
      {marks
        .filter((k) => k.x > v.x0 && k.x < v.x1)
        .map((k) => (
          <g key={k.t}>
            <circle cx={m.X(k.x)} cy={y} r={2.8} className="ro-dot" />
            <text x={m.X(k.x)} y={y + 16} className="ro-mark" textAnchor="middle">
              {k.t}
            </text>
          </g>
        ))}
    </g>
  )
}

function Dim({ x1, x2, y, text }: { x1: number; x2: number; y: number; text: string }) {
  return (
    <g className="ro-dim">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text x={(x1 + x2) / 2} y={y - 4} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

export interface BenchProps {
  scene: Scene
  cm: boolean
  reveal: boolean
  /** Draggable image marker (world coords); omit for no marker. */
  marker?: Pt | null
  onMarker?: (p: Pt) => void
  label: string
  /** Neutral element with a question mark (until revealed). */
  hideElement?: boolean
}

export function Bench({ scene: s, cm, reveal, marker, onMarker, label, hideElement }: BenchProps) {
  const v = viewFor(s, cm)
  const m = mapper(v)
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState(false)
  const img = imagePoint(s)
  const ap = imageOf(s.f, s.a).ap
  const rays = reveal ? principalRays(s, v) : []
  const yAxis = m.Y(0)

  const toWorld = (e: RPointerEvent) => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse())
    const x = Math.min(v.x1, Math.max(v.x0, m.ix(p.x)))
    const y = Math.min(v.y1 * 0.97, Math.max(v.y0 * 0.97, m.iy(p.y)))
    return { x, y }
  }
  const live = !!onMarker && !reveal
  const onDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (!live) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(true)
    onMarker!(toWorld(e))
  }
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (live && drag) onMarker!(toWorld(e))
  }
  const onKey = (e: KeyboardEvent) => {
    if (!live || !marker) return
    const sx = ((v.x1 - v.x0) / 70) * (e.shiftKey ? 4 : 1)
    const sy = (v.y1 / 30) * (e.shiftKey ? 4 : 1)
    const d = { ArrowLeft: [-sx, 0], ArrowRight: [sx, 0], ArrowUp: [0, sy], ArrowDown: [0, -sy] }[e.key]
    if (!d) return
    e.preventDefault()
    onMarker!({ x: Math.min(v.x1, Math.max(v.x0, marker.x + d[0])), y: Math.min(v.y1 * 0.97, Math.max(v.y0 * 0.97, marker.y + d[1])) })
  }

  const unit = cm ? ' cm' : ''
  const posText = marker ? `Šipka obrazu: ${fmt(marker.x)}${unit} od ${isMirror(s.el) ? 'zrcadla' : 'čočky'} (záporně vlevo), výška ${fmt(marker.y / s.h)} násobek předmětu.` : ''

  return (
    <svg
      ref={svgRef}
      className={`ro-svg${live ? ' is-live' : ''}`}
      viewBox={`0 0 ${VW} ${VH}`}
      role={live ? 'application' : 'img'}
      aria-roledescription={live ? 'optická lavice' : undefined}
      aria-label={live ? `${label} Šipkami posouvej obraz, Shift pro větší kroky. ${posText}` : label}
      tabIndex={live ? 0 : undefined}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      onKeyDown={onKey}
    >
      <rect x={0} y={0} width={VW} height={VH} className="ro-bg" />
      <line x1={4} y1={yAxis} x2={VW - 4} y2={yAxis} className="ro-axis" />
      {hideElement && !reveal ? (
        <g>
          <rect x={m.X(0) - 6} y={14} width={12} height={VH - 28} rx={4} className="ro-unknown" />
          <text x={m.X(0)} y={34} className="ro-mark" textAnchor="middle">
            ?
          </text>
        </g>
      ) : (
        <>
          <Element s={s} m={m} />
          <Marks s={s} m={m} v={v} />
        </>
      )}
      {cm && <Dim x1={m.X(-s.a)} x2={m.X(0)} y={VH - 8} text={`a = ${fmt(s.a)} cm`} />}

      {rays.map((r, i) =>
        r.segs.map((g, k) => (
          <motion.line
            key={`${i}-${k}`}
            x1={m.X(g.from.x)}
            y1={m.Y(g.from.y)}
            x2={m.X(g.to.x)}
            y2={m.Y(g.to.y)}
            className={`ro-ray ${RAY_CLASS[r.kind]}${g.virtual ? ' is-virtual' : ''}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.35 + (k === 0 ? 0 : 0.25) + (g.virtual ? 0.2 : 0) }}
          />
        )),
      )}

      <Arrow x={m.X(-s.a)} y0={yAxis} y1={m.Y(s.h)} cls="ro-object" />

      {marker && (
        <g className={`ro-marker${reveal ? ' is-done' : ''}`}>
          <Arrow x={m.X(marker.x)} y0={yAxis} y1={m.Y(marker.y)} cls="ro-marker-arrow" dashed />
          {live && <circle cx={m.X(marker.x)} cy={m.Y(marker.y)} r={20} className="ro-hit" />}
          <circle cx={m.X(marker.x)} cy={m.Y(marker.y)} r={8} className="ro-handle" />
        </g>
      )}

      {reveal && img && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.3 }}>
          <Arrow x={m.X(img.x)} y0={yAxis} y1={m.Y(img.y)} cls="ro-image" dashed={ap !== null && ap < 0} />
          <text x={Math.min(VW - 70, Math.max(70, m.X(img.x)))} y={Math.max(16, Math.min(VH - 24, img.y > 0 ? m.Y(img.y) - 6 : m.Y(img.y) + 16))} className="ro-imglabel" textAnchor="middle">
            {cm && ap !== null ? `obraz, a′ = ${fmt(ap)} cm` : 'obraz'}
          </text>
        </motion.g>
      )}
      {reveal && !img && (
        <text x={VW / 2} y={24} className="ro-imglabel" textAnchor="middle">
          paprsky jdou rovnoběžně – obraz nevznikne
        </text>
      )}
    </svg>
  )
}

// ------------------------------------------------------------------ plane mirror

const deg = Math.PI / 180

export function MirrorScene({ alpha, given, theta, onTheta, reveal, label }: { alpha: number; given: 'normal' | 'surface'; theta: number; onTheta?: (t: number) => void; reveal: boolean; label: string }) {
  const W = 360
  const H = 230
  const hx = W / 2
  const hy = H - 42
  const R = 150
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState(false)
  const live = !!onTheta && !reveal
  const src = { x: hx - R * Math.sin(alpha * deg), y: hy - R * Math.cos(alpha * deg) }
  const end = (t: number, r = R) => ({ x: hx + r * Math.sin(t * deg), y: hy - r * Math.cos(t * deg) })
  const toAngle = (e: RPointerEvent) => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse())
    const t = Math.atan2(p.x - hx, hy - Math.min(p.y, hy - 1)) / deg
    return Math.round(Math.max(-85, Math.min(85, t)))
  }
  const onKey = (e: KeyboardEvent) => {
    if (!live) return
    const d = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1 }[e.key]
    if (!d) return
    e.preventDefault()
    onTheta!(Math.max(-85, Math.min(85, theta + d * (e.shiftKey ? 5 : 1))))
  }
  const p = end(theta)
  const good = end(alpha)
  const arc = (a0: number, a1: number, r: number) => {
    const s = end(a0, r)
    const e = end(a1, r)
    return `M${s.x} ${s.y}A${r} ${r} 0 0 ${a1 > a0 ? 1 : 0} ${e.x} ${e.y}`
  }
  const hatch = Array.from({ length: 22 }, (_, k) => `M${30 + k * 14} ${hy + 2}l-8 10`).join('')
  return (
    <svg
      ref={svgRef}
      className={`ro-svg${live ? ' is-live' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role={live ? 'slider' : 'img'}
      aria-label={label}
      aria-valuemin={live ? -85 : undefined}
      aria-valuemax={live ? 85 : undefined}
      aria-valuenow={live ? theta : undefined}
      aria-valuetext={live ? `odražený paprsek svírá s kolmicí ${Math.abs(theta)}° ${theta >= 0 ? 'vpravo' : 'vlevo'}` : undefined}
      tabIndex={live ? 0 : undefined}
      onPointerDown={(e) => {
        if (!live) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setDrag(true)
        onTheta!(toAngle(e))
      }}
      onPointerMove={(e) => live && drag && onTheta!(toAngle(e))}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      onKeyDown={onKey}
    >
      <rect x={0} y={0} width={W} height={H} className="ro-bg" />
      <path d={hatch} className="ro-hatch" />
      <line x1={24} y1={hy} x2={W - 24} y2={hy} className="ro-mirror" />
      <line x1={hx} y1={hy} x2={hx} y2={20} className="ro-normal" />
      <text x={hx + 4} y={16} className="ro-mark">
        kolmice
      </text>
      {/* incident ray with a mid arrow */}
      <line x1={src.x} y1={src.y} x2={hx} y2={hy} className="ro-ray ro-ray-in" />
      <path
        d={`M0 -5L9 0L0 5Z`}
        transform={`translate(${(src.x + hx) / 2} ${(src.y + hy) / 2}) rotate(${90 - alpha})`}
        className="ro-head"
      />
      {given === 'normal' ? (
        <>
          <path d={arc(-alpha, 0, 42)} className="ro-arc" />
          <text x={end(-alpha / 2, 56).x} y={end(-alpha / 2, 56).y + 4} className="ro-angle" textAnchor="middle">
            {alpha}°
          </text>
        </>
      ) : (
        <>
          <path d={arc(-90, -alpha, 50)} className="ro-arc" />
          <text x={end(-(90 + alpha) / 2, 64).x} y={end(-(90 + alpha) / 2, 64).y + 4} className="ro-angle" textAnchor="middle">
            {90 - alpha}°
          </text>
        </>
      )}
      {/* player's reflected ray */}
      <g className={`ro-marker${reveal ? ' is-done' : ''}`}>
        <line x1={hx} y1={hy} x2={p.x} y2={p.y} className="ro-ray ro-ray-player" />
        {live && <circle cx={p.x} cy={p.y} r={22} className="ro-hit" />}
        <circle cx={p.x} cy={p.y} r={9} className="ro-handle" />
      </g>
      {reveal && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <motion.line x1={hx} y1={hy} x2={good.x} y2={good.y} className="ro-ray ro-ray-a" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          <path d={arc(-alpha, 0, 34)} className="ro-arc" />
          <path d={arc(0, alpha, 34)} className="ro-arc ro-arc-good" />
          <text x={end(alpha / 2, 48).x} y={end(alpha / 2, 48).y + 4} className="ro-angle ro-angle-good" textAnchor="middle">
            α′ = {alpha}°
          </text>
        </motion.g>
      )}
    </svg>
  )
}

// ------------------------------------------------------------------ refraction

export function RefractScene({ m1, m2, alpha, reveal, label }: { m1: Medium; m2: Medium; alpha: number; reveal: boolean; label: string }) {
  const W = 360
  const H = 230
  const hx = W / 2
  const hy = H / 2 + 6
  const R = 120
  const src = { x: hx - R * Math.sin(alpha * deg), y: hy - R * Math.cos(alpha * deg) }
  const beta = refractionAngle(m1.n, m2.n, alpha)
  const out = beta === null ? { x: hx + R * Math.sin(alpha * deg), y: hy - R * Math.cos(alpha * deg) } : { x: hx + R * Math.sin(beta * deg), y: hy + R * Math.cos(beta * deg) }
  const denseTop = m1.n > m2.n
  return (
    <svg className="ro-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <rect x={0} y={0} width={W} height={hy} className={denseTop ? 'ro-medium-dense' : 'ro-medium'} style={{ opacity: 0.35 + 0.25 * (m1.n - 1) }} />
      <rect x={0} y={hy} width={W} height={H - hy} className={!denseTop ? 'ro-medium-dense' : 'ro-medium'} style={{ opacity: 0.35 + 0.25 * (m2.n - 1) }} />
      <line x1={0} y1={hy} x2={W} y2={hy} className="ro-boundary" />
      <line x1={hx} y1={10} x2={hx} y2={H - 10} className="ro-normal" />
      <text x={12} y={24} className="ro-medlabel">
        {m1.name}, n = {fmt(m1.n)}
      </text>
      <text x={12} y={H - 12} className="ro-medlabel">
        {m2.name}, n = {fmt(m2.n)}
      </text>
      <line x1={src.x} y1={src.y} x2={hx} y2={hy} className="ro-ray ro-ray-in" />
      <path d="M0 -5L9 0L0 5Z" transform={`translate(${(src.x + hx) / 2} ${(src.y + hy) / 2}) rotate(${90 - alpha})`} className="ro-head" />
      {alpha > 0 && (
        <>
          <path d={`M${hx} ${hy - 40}A40 40 0 0 0 ${hx - 40 * Math.sin(alpha * deg)} ${hy - 40 * Math.cos(alpha * deg)}`} className="ro-arc" />
          <text x={hx - 54 * Math.sin((alpha / 2) * deg)} y={hy - 54 * Math.cos((alpha / 2) * deg) + 4} className="ro-angle" textAnchor="middle">
            {alpha}°
          </text>
        </>
      )}
      {reveal && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <motion.line x1={hx} y1={hy} x2={out.x} y2={out.y} className="ro-ray ro-ray-a" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          {beta !== null && beta > 0.5 && (
            <text x={hx + 58 * Math.sin((beta / 2) * deg)} y={hy + 58 * Math.cos((beta / 2) * deg) + 4} className="ro-angle ro-angle-good" textAnchor="middle">
              {Math.round(beta)}°
            </text>
          )}
          {beta === null && (
            <text x={out.x} y={out.y - 6} className="ro-angle ro-angle-good" textAnchor="middle">
              úplný odraz
            </text>
          )}
        </motion.g>
      )}
    </svg>
  )
}
