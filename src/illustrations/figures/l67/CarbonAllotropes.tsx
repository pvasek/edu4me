import { useEffect, useState, type ReactNode } from 'react'
import { ChemText, Fade, Figure, Pop, useCompact, useLive } from './kit'

type V3 = [number, number, number]
const PHI = (1 + Math.sqrt(5)) / 2
const C_ATOM = '#3b3b3b'

/** Slowly increasing angle while the plate is live (in view, motion allowed). */
function useSpin(speed = 0.35) {
  const live = useLive()
  const [a, setA] = useState(0)
  useEffect(() => {
    if (!live || typeof requestAnimationFrame === 'undefined') return
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      if (t - last > 33) {
        setA((x) => x + ((t - last) / 1000) * speed)
        last = t
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [live, speed])
  return a
}

function project(p: V3, yaw: number, pitch: number): V3 {
  const [x, y, z] = p
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw)
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
  const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch)
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch)
  return [x1, y1, z2]
}

/** Ball-and-stick drawing of a 3D point set, depth sorted and depth shaded. */
function BallStick({ pts, bonds, cx, cy, s, yaw, pitch, r = 4.5, faint = true }: { pts: V3[]; bonds: [number, number][]; cx: number; cy: number; s: number; yaw: number; pitch: number; r?: number; faint?: boolean }) {
  const P = pts.map((p) => project(p, yaw, pitch))
  const zs = P.map((p) => p[2])
  const zmin = Math.min(...zs)
  const zmax = Math.max(...zs)
  const depth = (z: number) => (zmax - zmin < 1e-6 ? 1 : (z - zmin) / (zmax - zmin)) // 0 back … 1 front
  const order = P.map((_, i) => i).sort((a, b) => zs[a] - zs[b])
  const bs = [...bonds].sort((a, b) => zs[a[0]] + zs[a[1]] - zs[b[0]] - zs[b[1]])
  return (
    <g>
      {bs.map(([a, b], k) => {
        const d = depth((zs[a] + zs[b]) / 2)
        return (
          <line
            key={k}
            x1={cx + P[a][0] * s}
            y1={cy + P[a][1] * s}
            x2={cx + P[b][0] * s}
            y2={cy + P[b][1] * s}
            className="f67-bond"
            style={{ strokeWidth: 1 + d * 1.6, opacity: faint ? 0.3 + d * 0.7 : 1 }}
          />
        )
      })}
      {order.map((i) => {
        const d = depth(zs[i])
        return <circle key={i} cx={cx + P[i][0] * s} cy={cy + P[i][1] * s} r={r * (0.7 + d * 0.3)} fill={C_ATOM} className="f67-catom" style={{ opacity: faint ? 0.45 + d * 0.55 : 1 }} />
      })}
    </g>
  )
}

// ---------------------------------------------------------------- geometry
const DIAMOND = (() => {
  const fcc: V3[] = []
  for (const x of [0, 4]) for (const y of [0, 4]) for (const z of [0, 4]) fcc.push([x, y, z])
  fcc.push([2, 2, 0], [2, 2, 4], [2, 0, 2], [2, 4, 2], [0, 2, 2], [4, 2, 2])
  const inner: V3[] = [
    [1, 1, 1],
    [1, 3, 3],
    [3, 1, 3],
    [3, 3, 1],
  ]
  const all = [...fcc, ...inner].map((p) => p.map((v) => v - 2) as V3)
  const near = (p: V3, q: V3) => Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - Math.sqrt(3)) < 0.01
  // keep only atoms that take part in a bond inside the cell
  const pts = all.filter((p) => all.some((q) => q !== p && near(p, q)))
  const bonds: [number, number][] = []
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && near(p, q)) bonds.push([i, j])
    }),
  )
  return { pts, bonds }
})()

const C60 = (() => {
  const base: V3[] = []
  const signs = (v: V3) => {
    const out: V3[] = []
    for (const a of v[0] ? [1, -1] : [1]) for (const b of v[1] ? [1, -1] : [1]) for (const c of v[2] ? [1, -1] : [1]) out.push([v[0] * a, v[1] * b, v[2] * c])
    return out
  }
  const cyc = (v: V3): V3[] => [v, [v[1], v[2], v[0]], [v[2], v[0], v[1]]]
  for (const v of [
    [0, 1, 3 * PHI],
    [1, 2 + PHI, 2 * PHI],
    [PHI, 2, 2 * PHI + 1],
  ] as V3[])
    for (const c of cyc(v)) base.push(...signs(c))
  const bonds: [number, number][] = []
  base.forEach((p, i) =>
    base.forEach((q, j) => {
      if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - 2) < 0.01) bonds.push([i, j])
    }),
  )
  return { pts: base, bonds }
})()

/** Honeycomb patch (bond length 1) in the x–z plane. */
function honeycomb(radius: number, shift: [number, number] = [0, 0]) {
  const pts: [number, number][] = []
  for (let i = -6; i <= 6; i++)
    for (let j = -6; j <= 6; j++) {
      const ax = i * Math.sqrt(3) + (j * Math.sqrt(3)) / 2 + shift[0]
      const az = 1.5 * j + shift[1]
      for (const p of [
        [ax, az],
        [ax, az + 1],
      ] as [number, number][])
        if (Math.hypot(p[0] * 0.85, p[1]) < radius) pts.push(p)
    }
  const bonds: [number, number][] = []
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1]) - 1) < 0.01) bonds.push([i, j])
    }),
  )
  return { pts, bonds }
}

function Graphite({ cx, cy }: { cx: number; cy: number }) {
  const s = 10
  const gapU = 3.3
  const pitch = 0.5
  const layers = [-1, 0, 1]
  const step = gapU * Math.cos(pitch) * s
  return (
    <g>
      {layers.map((L) => {
        const hc = honeycomb(3.1, L === 0 ? [0, 1] : [0, 0])
        const pts: V3[] = hc.pts.map(([x, z]) => [x, L * gapU, z])
        const P = pts.map((p) => project(p, 0.2, pitch))
        return (
          <g key={L}>
            {hc.bonds.map(([a, b], k) => (
              <line key={k} x1={cx + P[a][0] * s} y1={cy + P[a][1] * s} x2={cx + P[b][0] * s} y2={cy + P[b][1] * s} className="f67-bond" style={{ strokeWidth: 1.3 }} />
            ))}
            {P.map((p, k) => (
              <circle key={k} cx={cx + p[0] * s} cy={cy + p[1] * s} r={2.4} fill={C_ATOM} />
            ))}
          </g>
        )
      })}
      {/* van der Waals gap between two layers */}
      <path d={`M${cx + 54} ${cy - step + 3} V${cy - 3}`} className="f67-arr f67-arr-lvl" />
      <path d={`M${cx + 48} ${cy - step} H${cx + 60} M${cx + 48} ${cy} H${cx + 60}`} className="f67-o f67-thin f67-lvl-s" />
      <text x={cx + 56} y={cy + step + 22} textAnchor="middle" className="f67-num" style={{ fontSize: 10 }}>
        0,335 nm
      </text>
    </g>
  )
}

function Graphene({ cx, cy }: { cx: number; cy: number }) {
  const hc = honeycomb(4.3)
  const s = 11
  return (
    <g>
      {hc.bonds.map(([a, b], k) => (
        <line key={k} x1={cx + hc.pts[a][0] * s} y1={cy + hc.pts[a][1] * s} x2={cx + hc.pts[b][0] * s} y2={cy + hc.pts[b][1] * s} className="f67-bond" style={{ strokeWidth: 1.6 }} />
      ))}
      {hc.pts.map((p, k) => (
        <circle key={k} cx={cx + p[0] * s} cy={cy + p[1] * s} r={3.3} fill={C_ATOM} className="f67-catom" />
      ))}
    </g>
  )
}

function Tube({ cx, cy, spin }: { cx: number; cy: number; spin: number }) {
  const n = 9
  const rows = 11
  const Cc = n * Math.sqrt(3)
  const R = Cc / (2 * Math.PI)
  const s = 7.6
  const L = 1.5 * rows
  type A = { x: number; y: number; z: number }
  const at = (X: number, Y: number): A => {
    const th = (X / Cc) * 2 * Math.PI + spin
    return { x: cx + (Y - L / 2) * s + Math.sin(th) * R * s * 0.18, y: cy + Math.cos(th) * R * s, z: Math.sin(th) }
  }
  const A = (i: number, j: number) => at((((i % n) + n) % n) * Math.sqrt(3) + (j * Math.sqrt(3)) / 2, 1.5 * j)
  const B = (i: number, j: number) => at((((i % n) + n) % n) * Math.sqrt(3) + (j * Math.sqrt(3)) / 2, 1.5 * j + 1)
  const bonds: [A, A][] = []
  for (let i = 0; i < n; i++)
    for (let j = 0; j < rows; j++) {
      bonds.push([A(i, j), B(i, j)])
      if (j < rows - 1) {
        bonds.push([B(i, j), A(i, j + 1)])
        bonds.push([B(i, j), A(i - 1, j + 1)])
      }
    }
  bonds.sort((a, b) => a[0].z + a[1].z - b[0].z - b[1].z)
  return (
    <g>
      {bonds.map(([p, q], k) => {
        const front = (p.z + q.z) / 2 > 0
        return <line key={k} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="f67-bond" style={{ strokeWidth: front ? 1.7 : 0.8, opacity: front ? 1 : 0.3 }} />
      })}
      <ellipse cx={cx - (L / 2) * s} cy={cy} rx={R * s * 0.18} ry={R * s} className="f67-o f67-thin" style={{ opacity: 0.6 }} />
      <ellipse cx={cx + (L / 2) * s + s} cy={cy} rx={R * s * 0.18} ry={R * s} className="f67-o f67-thin" style={{ opacity: 0.6 }} />
    </g>
  )
}

function Panel({ x, y, title, lines, delay, children }: { x: number; y: number; title: string; lines: string[]; delay: number; children: ReactNode }) {
  return (
    <Pop delay={delay}>
      <rect x={x} y={y} width={160} height={238} rx={6} className="f67-o f67-thin f67-fill" />
      <rect x={x + 4} y={y + 4} width={152} height={230} rx={4} className="f67-o f67-thin" style={{ opacity: 0.35 }} />
      <text x={x + 80} y={y + 28} textAnchor="middle" className="f67-lbl f67-b f67-big f67-keep">
        <ChemText text={title} />
      </text>
      {children}
      {lines.map((l, i) => (
        <text key={i} x={x + 80} y={y + 198 + i * 18} textAnchor="middle" className="f67-lbl f67-sm f67-keep">
          <ChemText text={l} />
        </text>
      ))}
    </Pop>
  )
}

function Plates({ n }: { n: boolean }) {
  const spin = useSpin(0.4)
  const P = n
    ? [
        [10, 10],
        [176, 10],
        [10, 258],
        [176, 258],
        [93, 506],
      ]
    : [
        [8, 10],
        [176, 10],
        [344, 10],
        [92, 258],
        [260, 258],
      ]
  const mid = (i: number): [number, number] => [P[i][0] + 80, P[i][1] + 112]
  return (
    <>
      <Panel x={P[0][0]} y={P[0][1]} title="diamant" lines={['4 vazby, prostorová síť', 'nejtvrdší, nevede proud']} delay={0}>
        <BallStick pts={DIAMOND.pts} bonds={DIAMOND.bonds} cx={mid(0)[0]} cy={mid(0)[1]} s={17} yaw={0.55 + spin * 0.6} pitch={0.42} r={5.5} />
      </Panel>
      <Panel x={P[1][0]} y={P[1][1]} title="grafit" lines={['vrstvy šestiúhelníků', 'měkký, vede proud']} delay={0.15}>
        <Graphite cx={mid(1)[0] - 6} cy={mid(1)[1]} />
      </Panel>
      <Panel x={P[2][0]} y={P[2][1]} title="grafen" lines={['jediná vrstva grafitu', 'velmi pevný, vodivý']} delay={0.3}>
        <Graphene cx={mid(2)[0]} cy={mid(2)[1]} />
      </Panel>
      <Panel x={P[3][0]} y={P[3][1]} title="fulleren C_{60}" lines={['kulovitá molekula', 'jako fotbalový míč']} delay={0.45}>
        <BallStick pts={C60.pts} bonds={C60.bonds} cx={mid(3)[0]} cy={mid(3)[1]} s={11.5} yaw={0.3 + spin} pitch={0.35} r={3.8} />
      </Panel>
      <Panel x={P[4][0]} y={P[4][1]} title="nanotrubice" lines={['srolovaný grafen', 'pevnější než ocel']} delay={0.6}>
        <Tube cx={mid(4)[0]} cy={mid(4)[1]} spin={spin * 1.5} />
      </Panel>
      <Fade delay={1}>
        <text x={n ? 173 : 256} y={n ? 764 : 514} textAnchor="middle" className="f67-cap f67-sec">
          všechno je čistý uhlík, liší se jen propojení atomů
        </text>
      </Fade>
    </>
  )
}

export default function CarbonAllotropes() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={7}
      w={n ? 346 : 512}
      h={n ? 770 : 520}
      max={680}
      compact={compact}
      boost={false}
      label="Alotropy uhlíku jako modely: diamant je prostorová síť, kde je každý atom uhlíku vázán na čtyři další (nejtvrdší, nevede proud). Grafit tvoří vrstvy šestiúhelníků vzdálené 0,335 nm, je měkký a vede proud. Grafen je jediná vrstva grafitu. Fulleren C60 je kulovitá molekula jako fotbalový míč. Nanotrubice je srolovaný grafen, pevnější než ocel."
    >
      <Plates n={n} />
    </Figure>
  )
}
