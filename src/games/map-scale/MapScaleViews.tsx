import { useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { barLabels, fmt, RULER_CM, scaleText, type BarSpec, type Pt, type RulerMap } from './logic'

/** A graphic scale bar: `segments` segments, each standing for 1 cm on the map. */
export function ScaleBar({ bar, segments = 4, label }: { bar: BarSpec; segments?: number; label?: string }) {
  const seg = 56
  const x0 = 14
  const labels = barLabels(bar, segments)
  return (
    <svg
      className="g-ms-bar"
      viewBox={`0 0 ${x0 * 2 + seg * segments + 34} 46`}
      role="img"
      aria-label={label ?? `Grafické měřítko, dílky po ${labels[1]}${labels[segments].replace(/^[\d\s ,]+/, ' ')}`}
    >
      {Array.from({ length: segments }, (_, k) => (
        <rect key={k} x={x0 + k * seg} y={24} width={seg} height={9} className={k % 2 ? 'g-ms-bar-w' : 'g-ms-bar-b'} />
      ))}
      <rect x={x0} y={24} width={seg * segments} height={9} className="g-ms-bar-frame" />
      {labels.map((t, k) => (
        <g key={k}>
          <line x1={x0 + k * seg} x2={x0 + k * seg} y1={20} y2={24} className="g-ms-bar-tick" />
          <text x={x0 + k * seg} y={16} className="g-ms-bar-text" textAnchor={k === segments ? 'start' : 'middle'} dx={k === segments ? -6 : 0}>
            {t}
          </text>
        </g>
      ))}
      <text x={x0} y={44} className="g-ms-bar-note">
        dílek = 1 cm
      </text>
    </svg>
  )
}

/** Map-cm → SVG units. */
export const U = 28
const KNOB_GAP = 14

interface RulerPos {
  x: number
  y: number
  /** Degrees, clockwise (SVG). */
  deg: number
}

const path = (pts: Pt[]) => pts.map((p, k) => `${k ? 'L' : 'M'}${(p.x * U).toFixed(1)} ${(p.y * U).toFixed(1)}`).join(' ')

/** The drawn map with the route points and a draggable, rotatable ruler (keyboard: arrows). */
export function RulerBoard({ map, scale, done, cm }: { map: RulerMap; scale: number; done: boolean; cm: number }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pos, setPos] = useState<RulerPos>({ x: 0.8, y: map.h - 1.6, deg: 0 })
  const [focus, setFocus] = useState<'body' | 'knob' | null>(null)
  const drag = useRef<{ kind: 'body' | 'knob'; dx: number; dy: number } | null>(null)
  const W = map.w * U
  const H = map.h * U
  const L = RULER_CM * U
  const knobLocal = { x: L + 8 + KNOB_GAP, y: 0.45 * U }
  const knobOffset = Math.atan2(knobLocal.y, knobLocal.x)

  const toMap = (e: RPointerEvent): Pt | null => {
    const svg = svgRef.current
    const m = svg?.getScreenCTM()
    if (!svg || !m) return null
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return { x: p.x / U, y: p.y / U }
  }
  const clampPos = (p: RulerPos): RulerPos => ({
    x: Math.min(map.w, Math.max(0, p.x)),
    y: Math.min(map.h, Math.max(0, p.y)),
    deg: ((((p.deg + 180) % 360) + 360) % 360) - 180,
  })
  const down = (kind: 'body' | 'knob') => (e: RPointerEvent) => {
    if (done) return
    const p = toMap(e)
    if (!p) return
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    drag.current = { kind, dx: p.x - pos.x, dy: p.y - pos.y }
  }
  const move = (e: RPointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = toMap(e)
    if (!p) return
    if (d.kind === 'body') setPos((o) => clampPos({ ...o, x: p.x - d.dx, y: p.y - d.dy }))
    else setPos((o) => clampPos({ ...o, deg: ((Math.atan2(p.y - o.y, p.x - o.x) - knobOffset) * 180) / Math.PI }))
  }
  const up = () => {
    drag.current = null
  }
  const keyBody = (e: KeyboardEvent) => {
    const st = e.shiftKey ? 0.5 : 0.1
    const d: Record<string, [number, number]> = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }
    const v = d[e.key]
    if (!v || done) return
    e.preventDefault()
    setPos((o) => clampPos({ ...o, x: o.x + v[0], y: o.y + v[1] }))
  }
  const rotate = (by: number) => setPos((o) => clampPos({ ...o, deg: o.deg + by }))
  const keyKnob = (e: KeyboardEvent) => {
    const st = e.shiftKey ? 5 : 1
    const by = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? st : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -st : 0
    if (!by || done) return
    e.preventDefault()
    rotate(by)
  }

  const pts = map.via ? [map.a, map.via, map.b] : [map.a, map.b]
  const ticks = Array.from({ length: RULER_CM * 10 + 1 }, (_, k) => k)

  return (
    <div className="g-ms-board">
      <svg
        ref={svgRef}
        className="g-ms-map"
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label={`Mapa v měřítku ${scaleText(scale)} s místy ${pts.map((p) => p.name).join(', ')} a pravítkem`}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <rect width={W} height={H} className="g-ms-paper" />
        {map.forests.map((f, k) => (
          <circle key={k} cx={f.x * U} cy={f.y * U} r={f.r * U} className="g-ms-forest" />
        ))}
        <path d={path(map.river)} className="g-ms-river" />
        <path d={path(map.road)} className="g-ms-road-case" />
        <path d={path(map.road)} className="g-ms-road" />
        {map.via && <path d={path(pts)} className="g-ms-route" />}
        {done && !map.via && <path d={path(pts)} className="g-ms-route g-ms-route-done" />}
        {pts.map((p, k) => (
          <g key={k} className="g-ms-place">
            <circle cx={p.x * U} cy={p.y * U} r={4.5} className={k === 1 && map.via ? 'g-ms-pt-via' : 'g-ms-pt'} />
            <text x={p.x * U} y={p.y * U + (p.y > map.h - 1.2 ? -10 : 18)} textAnchor="middle" className="g-ms-name">
              {p.name}
            </text>
          </g>
        ))}
        {done &&
          pts.slice(1).map((p, k) => {
            const q = pts[k]
            const seg = map.via ? Math.hypot(p.x - q.x, p.y - q.y) : cm
            return (
              <text key={k} x={((p.x + q.x) / 2) * U} y={((p.y + q.y) / 2) * U - 8} textAnchor="middle" className="g-ms-measure">
                {fmt(seg, 1)} cm
              </text>
            )
          })}
        <g transform={`translate(${W - 6} 6)`}>
          <rect x={-128} y={0} width={128} height={24} rx={4} className="g-ms-scalebox" />
          <text x={-64} y={17} textAnchor="middle" className="g-ms-scaletext">
            {scaleText(scale)}
          </text>
        </g>

        <g transform={`translate(${pos.x * U} ${pos.y * U}) rotate(${pos.deg})`} className={`g-ms-ruler${done ? ' locked' : ''}`} aria-hidden={done || undefined}>
          <g
            className="g-ms-ruler-body"
            tabIndex={done ? -1 : 0}
            role="button"
            aria-label="Pravítko: posuň ho tažením nebo šipkami (se Shiftem rychleji). Nula je na jeho horní hraně."
            onPointerDown={down('body')}
            onKeyDown={keyBody}
            onFocus={() => setFocus('body')}
            onBlur={() => setFocus(null)}
          >
            <rect x={-10} y={0} width={L + 20} height={0.9 * U} rx={3} className="g-ms-ruler-rect" />
            {ticks.map((k) => (
              <line key={k} x1={(k / 10) * U} x2={(k / 10) * U} y1={0} y2={k % 10 === 0 ? 11 : k % 5 === 0 ? 8 : 4.5} className={k % 10 === 0 ? 'g-ms-tick-cm' : 'g-ms-tick'} />
            ))}
            {ticks
              .filter((k) => k % 10 === 0)
              .map((k) => (
                <text key={k} x={(k / 10) * U} y={21} textAnchor="middle" className="g-ms-ruler-num">
                  {k / 10}
                </text>
              ))}
            {focus === 'body' && <rect x={-13} y={-3} width={L + 26} height={0.9 * U + 6} rx={5} className="g-ms-focus" />}
          </g>
          <g
            className="g-ms-knob"
            tabIndex={done ? -1 : 0}
            role="slider"
            aria-label="Otočení pravítka (šipky, se Shiftem o 5°)"
            aria-valuemin={-180}
            aria-valuemax={180}
            aria-valuenow={Math.round(pos.deg)}
            aria-valuetext={`${Math.round(pos.deg)}°`}
            onPointerDown={down('knob')}
            onKeyDown={keyKnob}
            onFocus={() => setFocus('knob')}
            onBlur={() => setFocus(null)}
          >
            <circle cx={knobLocal.x} cy={knobLocal.y} r={13} className="g-ms-knob-c" />
            <path
              d={`M${knobLocal.x - 5} ${knobLocal.y - 3} a6 6 0 1 1 1 6`}
              className="g-ms-knob-i"
              transform={`rotate(${-pos.deg} ${knobLocal.x} ${knobLocal.y})`}
            />
            {focus === 'knob' && <circle cx={knobLocal.x} cy={knobLocal.y} r={17} className="g-ms-focus" />}
          </g>
        </g>
      </svg>
      {!done && (
        <div className="g-ms-rot" role="group" aria-label="Otáčení pravítka">
          <button type="button" className="btn btn-sm" onClick={() => rotate(-1)} aria-label="Otočit o 1° doleva">
            ↺ 1°
          </button>
          <button type="button" className="btn btn-sm" onClick={() => rotate(-15)} aria-label="Otočit o 15° doleva">
            ↺ 15°
          </button>
          <button type="button" className="btn btn-sm" onClick={() => rotate(15)} aria-label="Otočit o 15° doprava">
            15° ↻
          </button>
          <button type="button" className="btn btn-sm" onClick={() => rotate(1)} aria-label="Otočit o 1° doprava">
            1° ↻
          </button>
        </div>
      )}
    </div>
  )
}
