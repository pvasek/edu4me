import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Fade, Figure, Plate, Pop, useHatch, useNarrow, useOn } from './kit'

const LABEL =
  'Dvoušroubovice DNA, která se pomalu otáčí: dvě antiparalelní vlákna s páteří ze střídající se deoxyribózy a fosfátu, báze míří dovnitř jako příčky. Adenin se páruje s thyminem dvěma vodíkovými vazbami (A–T), guanin s cytosinem třemi (G–C). Vložený rozvinutý žebřík ukazuje cukr S, fosfát P, báze a vodíkové vazby; jedno vlákno běží od 5′ ke 3′, druhé opačně.'

const COL = { A: '#4f9a5a', T: '#d0573f', G: '#e0b43a', C: '#3d6fd1' } as const
type Base = keyof typeof COL
const PAIR: Record<Base, Base> = { A: 'T', T: 'A', G: 'C', C: 'G' }
const SEQ: Base[] = ['A', 'G', 'C', 'T', 'G', 'A', 'C', 'C', 'T', 'G', 'A', 'T', 'G', 'C']

export default function DnaHelix() {
  return (
    <Figure name="dna-helix" level={9} label={LABEL} max={660}>
      <Scene />
    </Figure>
  )
}

/** Slow rotation phase (radians), only while visible and motion is allowed. */
function usePhase(on: boolean) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (!on || reduce) return
    let raf = 0
    let last = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      if (t - last > 33) {
        last = t
        setPhase(((t - t0) / 1000) * 0.55)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduce])
  return phase
}

function Helix({ cx, y0, dy, R }: { cx: number; y0: number; dy: number; R: number }) {
  const on = useOn()
  const phase = usePhase(on)
  const N = SEQ.length
  const turn = (Math.PI * 2) / 10
  const off = 2.3 // angular offset of the second strand (major/minor groove)
  const strand = (s: 0 | 1) => {
    const segs: { d: string; z: number }[] = []
    const steps = (N - 1) * 5
    let prev: [number, number, number] | null = null
    for (let i = 0; i <= steps; i++) {
      const k = i / 5
      const a = phase + k * turn + (s ? off : 0)
      const p: [number, number, number] = [cx + R * Math.sin(a), y0 + k * dy, Math.cos(a)]
      if (prev) segs.push({ d: `M${prev[0].toFixed(1)} ${prev[1].toFixed(1)} L${p[0].toFixed(1)} ${p[1].toFixed(1)}`, z: (prev[2] + p[2]) / 2 })
      prev = p
    }
    return segs
  }
  const s0 = strand(0)
  const s1 = strand(1)
  const rungs = SEQ.map((b, k) => {
    const a = phase + k * turn
    const x1 = cx + R * Math.sin(a)
    const x2 = cx + R * Math.sin(a + off)
    const z = (Math.cos(a) + Math.cos(a + off)) / 2
    return { b, k, x1, x2, y: y0 + k * dy, z, z1: Math.cos(a), z2: Math.cos(a + off) }
  })
  const back = [...s0, ...s1].filter((s) => s.z < 0)
  const front = [...s0, ...s1].filter((s) => s.z >= 0)
  return (
    <g>
      {back.map((s, i) => (
        <path key={`b${i}`} d={s.d} stroke="color-mix(in srgb, var(--edge) 38%, var(--surface))" strokeWidth={4 + s.z * 1.5} strokeLinecap="round" fill="none" />
      ))}
      {[...rungs]
        .sort((a, b) => a.z - b.z)
        .map((r) => {
          const mx = (r.x1 + r.x2) / 2
          const op = 0.55 + 0.45 * ((r.z + 1) / 2)
          return (
            <g key={r.k} opacity={op}>
              <line x1={r.x1} y1={r.y} x2={mx} y2={r.y} stroke={COL[r.b]} strokeWidth={5} />
              <line x1={mx} y1={r.y} x2={r.x2} y2={r.y} stroke={COL[PAIR[r.b]]} strokeWidth={5} />
              <circle cx={r.x1} cy={r.y} r={4} fill="#e88b35" stroke="var(--edge)" strokeWidth={0.7} opacity={r.z1 > 0 ? 1 : 0.5} />
              <circle cx={r.x2} cy={r.y} r={4} fill="#e88b35" stroke="var(--edge)" strokeWidth={0.7} opacity={r.z2 > 0 ? 1 : 0.5} />
            </g>
          )
        })}
      {front.map((s, i) => (
        <path key={`f${i}`} d={s.d} stroke="var(--edge)" strokeWidth={4 + s.z * 2} strokeLinecap="round" fill="none" />
      ))}
    </g>
  )
}

const LADDER: Base[] = ['A', 'G', 'T', 'C', 'A']

function Sugar({ x, y }: { x: number; y: number }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2
    return `${(x + Math.cos(a) * 11).toFixed(1)},${(y + Math.sin(a) * 11).toFixed(1)}`
  }).join(' ')
  return (
    <g>
      <polygon points={pts} fill="#c2a36b" stroke="var(--edge)" strokeWidth={1.1} />
      <text className="f89-t" x={x} y={y + 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: '#1f2a44' }}>
        S
      </text>
    </g>
  )
}
function Phos({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="#e88b35" stroke="var(--edge)" strokeWidth={1.1} />
      <text className="f89-t" x={x} y={y + 3.5} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: '#1f2a44' }}>
        P
      </text>
    </g>
  )
}

function Ladder({ x, y }: { x: number; y: number }) {
  const hatch = useHatch()
  const row = 42
  const L = x + 16
  const R = x + 214
  return (
    <g>
      <rect x={x - 8} y={y - 40} width={246} height={LADDER.length * row + 60} rx={8} className="f89-box" style={{ strokeWidth: 1 }} />
      <text className="f89-lb f89-b" x={x + 115} y={y - 18} textAnchor="middle">
        rozvinutý žebřík
      </text>
      <line className="f89-ln" x1={L} y1={y} x2={L} y2={y + (LADDER.length - 1) * row} />
      <line className="f89-ln" x1={R} y1={y} x2={R} y2={y + (LADDER.length - 1) * row} />
      {LADDER.map((b, k) => {
        const yy = y + k * row
        const p = PAIR[b]
        const purine = (q: Base) => q === 'A' || q === 'G'
        const wl = purine(b) ? 84 : 62
        const wr = purine(p) ? 84 : 62
        const hb = b === 'A' || b === 'T' ? 2 : 3
        const hx = L + 19 + wl
        const hx2 = R - 19 - wr
        return (
          <Pop key={k} delay={0.4 + k * 0.12}>
            <rect x={L + 16} y={yy - 9} width={wl} height={18} rx={3} fill={COL[b]} stroke="var(--edge)" strokeWidth={1} />
            <rect x={L + 16} y={yy - 9} width={wl} height={18} rx={3} fill={hatch('s')} className="f89-hatch" />
            <rect x={R - 16 - wr} y={yy - 9} width={wr} height={18} rx={3} fill={COL[p]} stroke="var(--edge)" strokeWidth={1} />
            <text className="f89-t" x={L + 26} y={yy + 4.5} style={{ fill: '#fff', fontWeight: 700 }}>
              {b}
            </text>
            <text className="f89-t" x={R - 26} y={yy + 4.5} textAnchor="end" style={{ fill: '#fff', fontWeight: 700 }}>
              {p}
            </text>
            {Array.from({ length: hb }, (_, j) => {
              const oy = hb === 2 ? (j ? 4 : -4) : (j - 1) * 5.5
              return <line key={j} x1={hx} y1={yy + oy} x2={hx2} y2={yy + oy} stroke="var(--ink)" strokeWidth={1.3} strokeDasharray="2 2" />
            })}
            <Sugar x={L} y={yy} />
            <Sugar x={R} y={yy} />
            {k < LADDER.length - 1 && (
              <>
                <Phos x={L} y={yy + row / 2} />
                <Phos x={R} y={yy + row / 2} />
              </>
            )}
          </Pop>
        )
      })}
      <text className="f89-f f89-sm" x={L} y={y - 18 + 0} textAnchor="middle" style={{ fontSize: 11 }}>
        5′
      </text>
      <text className="f89-f f89-sm" x={L} y={y + (LADDER.length - 1) * row + 24} textAnchor="middle">
        3′
      </text>
      <text className="f89-f f89-sm" x={R} y={y - 18} textAnchor="middle">
        3′
      </text>
      <text className="f89-f f89-sm" x={R} y={y + (LADDER.length - 1) * row + 24} textAnchor="middle">
        5′
      </text>
    </g>
  )
}

function Legend({ x, y }: { x: number; y: number }) {
  const items: [Base, Base, string][] = [
    ['A', 'T', 'A–T: 2 vodíkové vazby'],
    ['G', 'C', 'G–C: 3 vodíkové vazby'],
  ]
  return (
    <g>
      {items.map(([a, b, t], i) => (
        <g key={t}>
          <rect x={x} y={y + i * 22 - 10} width={14} height={12} fill={COL[a]} stroke="var(--edge)" strokeWidth={0.8} />
          <rect x={x + 14} y={y + i * 22 - 10} width={14} height={12} fill={COL[b]} stroke="var(--edge)" strokeWidth={0.8} />
          <text className="f89-lb" x={x + 36} y={y + i * 22}>
            {t}
          </text>
        </g>
      ))}
      <text className="f89-lb f89-sm" x={x} y={y + 46}>
        S = deoxyribóza · P = fosfát
      </text>
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? { w: 340, h: 800, helix: { cx: 170, y0: 40, dy: 26, R: 56 }, ladder: { x: 55, y: 480 }, legend: { x: 70, y: 742 }, labels: true }
    : { w: 640, h: 440, helix: { cx: 160, y0: 36, dy: 27, R: 62 }, ladder: { x: 360, y: 90 }, legend: { x: 360, y: 350 }, labels: true }
  const { cx, y0, dy, R } = L.helix
  const yEnd = y0 + (SEQ.length - 1) * dy
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.1}>
        <Helix {...L.helix} />
      </Pop>
      <Fade delay={0.8}>
        <text className="f89-lb" x={cx - R - 14} y={y0 + 3 * dy} textAnchor="end">
          páteř
        </text>
        <text className="f89-lb f89-sm" x={cx - R - 14} y={y0 + 3 * dy + 16} textAnchor="end">
          cukr + fosfát
        </text>
        <text className="f89-lb" x={cx + R + 14} y={y0 + 8 * dy}>
          báze
        </text>
        <text className="f89-lb f89-sm" x={cx + R + 14} y={y0 + 8 * dy + 16}>
          páry uvnitř
        </text>
        <text className="f89-f f89-sm f89-muted" x={cx} y={yEnd + 30} textAnchor="middle">
          1 otáčka ≐ 10 párů bází
        </text>
      </Fade>
      <Fade delay={0.4}>
        <Ladder {...L.ladder} />
      </Fade>
      <Fade delay={1.2}>
        <Legend {...L.legend} />
      </Fade>
    </Plate>
  )
}
