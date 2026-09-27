import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import type { MoleculeId } from '../catalog'
import { Md } from '../../core/markup'
import { getMolecule, type MoleculeData } from './library'
import { IDENTITY, matMul, matVec, orthonormalize, principalAxes, rotX, rotY, vlen, vnorm, vscale, vsub, type Mat3, type Vec3 } from './geometry'
import { ballRadius, chargeLabel, cpk, elementName } from './cpk'
import './molecules.css'

/**
 * 1–4 molecules as rotatable 3D ball-and-stick models (engraving style).
 * Auto-rotates slowly while on screen; drag to rotate (with inertia); double click/tap resets.
 */
export function MoleculeView({ molecules, labels }: { molecules: MoleculeId[]; labels?: string[] }) {
  const mols = useMemo(() => molecules.slice(0, 4).map((id) => getMolecule(id)), [molecules])
  const frames = useMemo(() => mols.map(frameOf), [mols])
  const hRef = Math.max(...frames.map((f) => f.hx), 0)
  const n = mols.length
  return (
    <div className="mol-view" data-n={n}>
      <div className="mol-grid">
        {mols.map((m, i) => (
          <div className="mol-cell" key={m.id + i}>
            <Ball3D mol={m} frame={frames[i]} hRef={hRef} />
            <div className="mol-caption">
              <span className="mol-name">{m.name}</span>
              <span className="mol-formula">
                <Md text={'$' + m.formula + '$'} />
              </span>
              {labels?.[i] && (
                <span className="mol-label">
                  <Md text={labels[i]} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mol-hint" aria-hidden="true">
        Táhni pro otočení · dvojklik vrátí pohled
      </p>
    </div>
  )
}

// ------------------------------------------------------------------ 3D model
const VB = 100 // viewBox half-size (user units)
const SPIN = 0.32 // rad/s auto-rotation
const LIGHT: [number, number] = [-0.6, -0.8]

interface Frame {
  initial: Mat3
  /** spin axis on screen: 'y' (vertical) or 'x' for elongated molecules */
  axis: 'x' | 'y'
  /** half-width / half-height (Å) swept while spinning */
  hx: number
  vy: number
  R: number
}

/** Default view and the space the model needs while it spins. */
function frameOf(m: MoleculeData): Frame {
  const pts = m.atoms.map((a) => a.p)
  const r = m.atoms.map((a) => ballRadius(a.el))
  const pca = pts.length > 1 ? principalAxes(pts) : IDENTITY
  const inPca = pts.map((p) => matVec(pca, p))
  const ext = (k: 0 | 1) => Math.max(...inPca.map((q, i) => Math.abs(q[k]) + r[i]))
  const elongated = ext(0) > 1.7 * ext(1)
  const initial = orthonormalize(elongated ? matMul(rotX(0.5), pca) : matMul(rotX(0.42), matMul(rotY(-0.55), pca)))
  const q = pts.map((p) => matVec(initial, p))
  const R = Math.max(...pts.map((p, i) => vlen(p) + r[i]))
  if (elongated)
    return {
      initial,
      axis: 'x',
      hx: Math.max(...q.map((v, i) => Math.abs(v[0]) + r[i])),
      vy: Math.max(...q.map((v, i) => Math.hypot(v[1], v[2]) + r[i])),
      R,
    }
  return {
    initial,
    axis: 'y',
    hx: Math.max(...q.map((v, i) => Math.hypot(v[0], v[2]) + r[i])),
    vy: Math.max(...q.map((v, i) => Math.abs(v[1]) + r[i])),
    R,
  }
}

interface Prepared {
  pts: Vec3[]
  r: number[]
  /** for aromatic bonds: a third ring atom telling on which side the dashed line goes */
  side: (number | null)[]
  D: number
  S: number
  /** viewBox half-height in user units (half-width is VB) */
  vbY: number
  initial: Mat3
  axis: 'x' | 'y'
}

function prepare(m: MoleculeData, fr: Frame, hRef: number): Prepared {
  const pts = m.atoms.map((a) => a.p)
  const r = m.atoms.map((a) => ballRadius(a.el))
  const side = m.bonds.map((b) => {
    if (b.order !== 1.5) return null
    for (const x of m.bonds) {
      if (x === b || x.order !== 1.5) continue
      if (x.a === b.a && x.b !== b.b) return x.b
      if (x.b === b.a && x.a !== b.b) return x.a
    }
    return null
  })
  const hx = Math.max(fr.hx, hRef * 0.55, 1.8)
  const vy = Math.min(Math.max(fr.vy, hx / 1.9, 1.4), hx * 1.15)
  const D = Math.max(fr.R, 1.5) * 5
  const S = VB / (hx * 1.12)
  return { pts, r, side, D, S, vbY: (VB * vy) / hx, initial: fr.initial, axis: fr.axis }
}

interface Projected {
  x: number
  y: number
  z: number
  f: number
  rs: number
}

function crescent(x: number, y: number, r: number) {
  const phi = Math.atan2(LIGHT[1], LIGHT[0])
  const alpha = Math.acos(0.21)
  const p1 = [x + r * Math.cos(phi + alpha), y + r * Math.sin(phi + alpha)]
  const p2 = [x + r * Math.cos(phi - alpha), y + r * Math.sin(phi - alpha)]
  const f = (v: number) => v.toFixed(2)
  return `M${f(p1[0])} ${f(p1[1])}A${f(r)} ${f(r)} 0 1 1 ${f(p2[0])} ${f(p2[1])}A${f(r)} ${f(r)} 0 0 0 ${f(p1[0])} ${f(p1[1])}Z`
}

function highlight(x: number, y: number, r: number) {
  const phi = Math.atan2(LIGHT[1], LIGHT[0])
  const rr = r * 0.62
  const a0 = phi - 0.5
  const a1 = phi + 0.5
  const f = (v: number) => v.toFixed(2)
  return `M${f(x + rr * Math.cos(a0))} ${f(y + rr * Math.sin(a0))}A${f(rr)} ${f(rr)} 0 0 1 ${f(x + rr * Math.cos(a1))} ${f(y + rr * Math.sin(a1))}`
}

function Ball3D({ mol, frame, hRef }: { mol: MoleculeData; frame: Frame; hRef: number }) {
  const prep = useMemo(() => prepare(mol, frame, hRef), [mol, frame, hRef])
  const [rot, setRot] = useState<Mat3>(prep.initial)
  const [hover, setHover] = useState<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const st = useRef({
    rot: prep.initial,
    vx: 0,
    vy: 0,
    dragging: false,
    lx: 0,
    ly: 0,
    lt: 0,
    sx: 0,
    sy: 0,
    moved: 0,
    downAtom: null as number | null,
    lastTap: 0,
    kick: () => {},
  })
  const axisRef = useRef(prep.axis)
  axisRef.current = prep.axis
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  // reset when the molecule changes
  useEffect(() => {
    st.current.rot = prep.initial
    setRot(prep.initial)
  }, [prep])

  // animation loop: runs only while on screen
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const s = st.current
    let visible = false
    let raf = 0
    let last = 0
    const reduce = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0
      last = t
      raf = 0
      if (!s.dragging && dt > 0) {
        if (Math.abs(s.vx) + Math.abs(s.vy) > 0.05) {
          s.rot = orthonormalize(matMul(matMul(rotY(s.vx * dt), rotX(s.vy * dt)), s.rot))
          const k = Math.pow(0.04, dt)
          s.vx *= k
          s.vy *= k
          setRot(s.rot)
        } else if (!reduce?.matches) {
          s.vx = 0
          s.vy = 0
          s.rot = orthonormalize(matMul(axisRef.current === 'x' ? rotX(SPIN * dt) : rotY(SPIN * dt), s.rot))
          setRot(s.rot)
        }
      }
      if (visible && (!reduce?.matches || Math.abs(s.vx) + Math.abs(s.vy) > 0.05 || s.dragging)) raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf && visible) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }
    s.kick = start
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (visible) start()
      })
      io.observe(el)
    } else {
      visible = true
      start()
    }
    return () => {
      io?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      s.kick = () => {}
    }
  }, [])

  // ---------------------------------------------------------- projection
  const { D, S } = prep
  const proj: Projected[] = prep.pts.map((p, i) => {
    const q = matVec(rot, p)
    const f = D / (D - q[2])
    return { x: q[0] * f * S, y: -q[1] * f * S, z: q[2], f, rs: prep.r[i] * f * S }
  })
  const rotated = prep.pts.map((p) => matVec(rot, p))

  type Item = { z: number; key: string; node: ReactNode }
  const items: Item[] = []

  mol.bonds.forEach((b, bi) => {
    const qa = rotated[b.a]
    const qb = rotated[b.b]
    const u = vnorm(vsub(qb, qa))
    const A = vsub(qa, vscale(u, -prep.r[b.a] * 0.7))
    const B = vsub(qb, vscale(u, prep.r[b.b] * 0.7))
    const pa = project(A, D, S)
    const pb = project(B, D, S)
    const dx = pb.x - pa.x
    const dy = pb.y - pa.y
    const L = Math.hypot(dx, dy)
    if (L < 0.5) return
    const nx = -dy / L
    const ny = dx / L
    const stick = (off: number, w: number, k: string) => {
      const o1 = off * pa.f * S
      const o2 = off * pb.f * S
      const w1 = w * pa.f * S
      const w2 = w * pb.f * S
      const pts = [
        [pa.x + nx * (o1 + w1), pa.y + ny * (o1 + w1)],
        [pb.x + nx * (o2 + w2), pb.y + ny * (o2 + w2)],
        [pb.x + nx * (o2 - w2), pb.y + ny * (o2 - w2)],
        [pa.x + nx * (o1 - w1), pa.y + ny * (o1 - w1)],
      ]
      return <polygon key={k} className="mol-stick" points={pts.map((p) => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ')} />
    }
    const parts: ReactNode[] = []
    if (b.order === 2) {
      parts.push(stick(-0.13, 0.068, 'a'), stick(0.13, 0.068, 'b'))
    } else if (b.order === 3) {
      parts.push(stick(-0.21, 0.055, 'a'), stick(0, 0.055, 'b'), stick(0.21, 0.055, 'c'))
    } else {
      parts.push(stick(0, b.order === 1.5 ? 0.09 : 0.1, 'a'))
      if (b.order === 1.5) {
        const c = prep.side[bi]
        let sgn = 1
        if (c !== null) {
          const pc = proj[c]
          sgn = Math.sign(nx * (pc.x - pa.x) + ny * (pc.y - pa.y)) || 1
        }
        const o = 0.27 * sgn
        parts.push(
          <line
            key="d"
            className="mol-arom"
            x1={pa.x + nx * o * pa.f * S + dx * 0.12}
            y1={pa.y + ny * o * pa.f * S + dy * 0.12}
            x2={pb.x + nx * o * pb.f * S - dx * 0.12}
            y2={pb.y + ny * o * pb.f * S - dy * 0.12}
          />,
        )
      }
    }
    items.push({ z: (qa[2] + qb[2]) / 2, key: 'b' + bi, node: <g key={'b' + bi}>{parts}</g> })
  })

  const showCharges = mol.charge !== 0
  const hatch = `mol-h-${uid}`
  mol.atoms.forEach((a, i) => {
    const p = proj[i]
    const on = hover === i || active === i
    items.push({
      z: p.z,
      key: 'a' + i,
      node: (
        <g key={'a' + i} data-atom={i} className={'mol-atom' + (on ? ' is-on' : '')}>
          <circle cx={p.x} cy={p.y} r={p.rs} fill={cpk(a.el)} className="mol-ball" />
          <path d={crescent(p.x, p.y, p.rs)} fill={`url(#${hatch})`} className="mol-shade" />
          <path d={highlight(p.x, p.y, p.rs)} className="mol-hl" />
          <circle cx={p.x} cy={p.y} r={p.rs} className="mol-rim" />
          {showCharges && a.charge ? (
            <text x={p.x + p.rs * 0.95} y={p.y - p.rs * 0.75} className="mol-q">
              {chargeLabel(a.charge)}
            </text>
          ) : null}
        </g>
      ),
    })
  })
  items.sort((x, y) => x.z - y.z)

  // ---------------------------------------------------------- interaction
  const atomFrom = (t: EventTarget | null): number | null => {
    const g = (t as Element | null)?.closest?.('[data-atom]')
    return g ? Number(g.getAttribute('data-atom')) : null
  }
  const reset = () => {
    const s = st.current
    s.vx = 0
    s.vy = 0
    s.rot = prep.initial
    setRot(prep.initial)
    setActive(null)
  }
  const onDown = (e: RPointerEvent<SVGSVGElement>) => {
    const s = st.current
    s.dragging = true
    s.lx = s.sx = e.clientX
    s.ly = s.sy = e.clientY
    s.lt = e.timeStamp
    s.moved = 0
    s.vx = s.vy = 0
    s.downAtom = atomFrom(e.target)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    const s = st.current
    if (!s.dragging) {
      if (e.pointerType === 'mouse') setHover(atomFrom(e.target))
      return
    }
    const w = e.currentTarget.getBoundingClientRect().width || 200
    const dx = e.clientX - s.lx
    const dy = e.clientY - s.ly
    s.moved = Math.max(s.moved, Math.hypot(e.clientX - s.sx, e.clientY - s.sy))
    const ax = (dx / w) * Math.PI
    const ay = (dy / w) * Math.PI
    s.rot = orthonormalize(matMul(matMul(rotY(ax), rotX(ay)), s.rot))
    const dt = Math.max(1, e.timeStamp - s.lt) / 1000
    s.vx = s.vx * 0.3 + (ax / dt) * 0.7
    s.vy = s.vy * 0.3 + (ay / dt) * 0.7
    s.lx = e.clientX
    s.ly = e.clientY
    s.lt = e.timeStamp
    setRot(s.rot)
    if (s.moved > 6 && hover !== null) setHover(null)
  }
  const onUp = (e: RPointerEvent<SVGSVGElement>) => {
    const s = st.current
    if (!s.dragging) return
    s.dragging = false
    if (e.timeStamp - s.lt > 90) s.vx = s.vy = 0
    const cap = 6
    s.vx = Math.max(-cap, Math.min(cap, s.vx))
    s.vy = Math.max(-cap, Math.min(cap, s.vy))
    if (s.moved < 6) {
      s.vx = s.vy = 0
      if (e.pointerType !== 'mouse' && e.timeStamp - s.lastTap < 320) {
        reset()
        s.lastTap = 0
      } else {
        s.lastTap = e.timeStamp
        const at = s.downAtom
        setActive((cur) => (at === null || cur === at ? null : at))
      }
    }
    s.kick()
  }

  const shown = hover ?? active
  const tip = shown !== null && proj[shown] ? proj[shown] : null
  const atom = shown !== null ? mol.atoms[shown] : null
  const aria = `Model molekuly: ${mol.name}. ${describe(mol)}.`

  return (
    <div className="mol-stage" ref={wrap} style={{ aspectRatio: `${VB} / ${prep.vbY.toFixed(2)}` }}>
      <svg
        viewBox={`${-VB} ${(-prep.vbY).toFixed(2)} ${2 * VB} ${(2 * prep.vbY).toFixed(2)}`}
        role="img"
        aria-label={aria}
        className="mol-svg"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={() => setHover(null)}
        onDoubleClick={reset}
      >
        <defs>
          <pattern id={hatch} patternUnits="userSpaceOnUse" width="2.6" height="2.6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="2.6" className="mol-hatch" />
          </pattern>
        </defs>
        {items.map((it) => it.node)}
      </svg>
      {tip && atom && (
        <div
          className="mol-tip"
          style={{ left: `${((tip.x + VB) / (2 * VB)) * 100}%`, top: `${((tip.y - tip.rs + prep.vbY) / (2 * prep.vbY)) * 100}%` }}
        >
          {elementName(atom.el)} <b>{atom.el}</b>
          {atom.charge ? <sup>{chargeLabel(atom.charge)}</sup> : null}
        </div>
      )}
    </div>
  )
}

function project(p: Vec3, D: number, S: number) {
  const f = D / (D - p[2])
  return { x: p[0] * f * S, y: -p[1] * f * S, f }
}

function describe(m: MoleculeData) {
  const counts: Record<string, number> = {}
  for (const a of m.atoms) counts[a.el] = (counts[a.el] ?? 0) + 1
  return Object.entries(counts)
    .map(([el, n]) => `${n}× ${elementName(el)}`)
    .join(', ')
}
