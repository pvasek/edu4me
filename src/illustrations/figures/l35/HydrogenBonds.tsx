import { motion } from 'motion/react'
import { Atom, Bond, Fade, Figure, Note, Pop, T, usePid, vFade } from './kit'

type Pt = [number, number]
interface Mol {
  o: Pt
  /** acceptor molecule index for each H, or a free angle in degrees */
  to: [number | { ang: number }, number | { ang: number }]
}

const RO = 12
const RH = 7.5
const OH = 21

// a small patch of liquid water (coordinates in a 330 × 270 box)
const NET: Mol[] = [
  { o: [165, 140], to: [1, 2] },
  { o: [240, 86], to: [3, { ang: -70 }] },
  { o: [100, 82], to: [{ ang: -40 }, 6] },
  { o: [298, 180], to: [{ ang: 10 }, { ang: 100 }] },
  { o: [214, 228], to: [0, 3] },
  { o: [96, 222], to: [0, 6] },
  { o: [38, 150], to: [2, { ang: 130 }] },
]

const angTo = (a: Pt, b: Pt) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
const pol = (c: Pt, ang: number, len: number): Pt => [c[0] + Math.cos((ang * Math.PI) / 180) * len, c[1] + Math.sin((ang * Math.PI) / 180) * len]

/** H positions spread to 104,5° around the bisector of the two target directions. */
function hydrogens(m: Mol, all: Mol[]) {
  const t = m.to.map((x) => (typeof x === 'number' ? angTo(m.o, all[x].o) : x.ang))
  let diff = t[1] - t[0]
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  const mid = t[0] + diff / 2
  const sgn = diff >= 0 ? 1 : -1
  return [pol(m.o, mid - sgn * 52.25, OH), pol(m.o, mid + sgn * 52.25, OH)]
}

function Water({ o, hs, jiggle = true }: { o: Pt; hs: Pt[]; jiggle?: boolean }) {
  return (
    <g className={jiggle ? 'f35-jiggle' : undefined}>
      {hs.map((h, i) => (
        <Bond key={i} a={o} b={h} ra={RO} rb={RH} w={3.6} />
      ))}
      {hs.map((h, i) => (
        <Atom key={i} x={h[0]} y={h[1]} r={RH} el="H" sym={false} />
      ))}
      <Atom x={o[0]} y={o[1]} r={RO} el="O" />
    </g>
  )
}

function Network({ x, y }: { x: number; y: number }) {
  const hs = NET.map((m) => hydrogens(m, NET))
  const hb: { a: Pt; b: Pt }[] = []
  NET.forEach((m, i) =>
    m.to.forEach((t, k) => {
      if (typeof t !== 'number') return
      const h = hs[i][k]
      const o = NET[t].o
      const L = Math.hypot(o[0] - h[0], o[1] - h[1])
      const u: Pt = [(o[0] - h[0]) / L, (o[1] - h[1]) / L]
      hb.push({ a: [h[0] + u[0] * (RH + 2), h[1] + u[1] * (RH + 2)], b: [o[0] - u[0] * (RO + 2), o[1] - u[1] * (RO + 2)] })
    }),
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g variants={vFade} custom={0.9}>
        {hb.map((b, i) => (
          <line key={i} x1={b.a[0]} y1={b.a[1]} x2={b.b[0]} y2={b.b[1]} className="f35-hbond" />
        ))}
      </motion.g>
      {NET.map((m, i) => (
        <Pop key={i} d={0.1 + i * 0.09}>
          <Water o={m.o} hs={hs[i]} />
        </Pop>
      ))}
      {/* partial charges on the central molecule */}
      <Fade d={1.3}>
        <text x={NET[0].o[0] + 2} y={NET[0].o[1] + 32} className="f35-delta f35-dneg" textAnchor="middle">
          δ−
        </text>
        <text x={hs[0][0][0] + 12} y={hs[0][0][1] - 8} className="f35-delta f35-dpos">
          δ+
        </text>
        <text x={hs[0][1][0] - 14} y={hs[0][1][1] - 8} className="f35-delta f35-dpos" textAnchor="end">
          δ+
        </text>
      </Fade>
    </g>
  )
}

/** Hexagonal ice: honeycomb of O with H on every edge; open hexagonal gaps. */
function Ice({ cx, cy, R }: { cx: number; cy: number; R: number }) {
  const p = usePid()
  const a = 27
  const verts: Pt[] = []
  const key = (v: Pt) => `${Math.round(v[0])},${Math.round(v[1])}`
  const seen = new Set<string>()
  const hexW = Math.sqrt(3) * a
  for (let row = -5; row <= 5; row++)
    for (let col = -5; col <= 5; col++) {
      const hx = cx + col * hexW + (row % 2 ? hexW / 2 : 0)
      const hy = cy + row * 1.5 * a
      for (let k = 0; k < 6; k++) {
        const ang = ((60 * k - 90) * Math.PI) / 180
        const v: Pt = [hx + a * Math.cos(ang), hy + a * Math.sin(ang)]
        if (Math.hypot(v[0] - cx, v[1] - cy) > R + a) continue
        const kk = key(v)
        if (!seen.has(kk)) {
          seen.add(kk)
          verts.push(v)
        }
      }
    }
  const edges: [Pt, Pt][] = []
  verts.forEach((v, i) =>
    verts.forEach((w, j) => {
      if (j <= i) return
      if (Math.abs(Math.hypot(v[0] - w[0], v[1] - w[1]) - a) < 1) edges.push(v[1] < w[1] - 1 || (Math.abs(v[1] - w[1]) <= 1 && v[0] < w[0]) ? [v, w] : [w, v])
    }),
  )
  const clip = `${p}-ice`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={R} className="f35-ice-bg" />
      <g clipPath={`url(#${clip})`}>
        {edges.map(([v, w], i) => {
          // H sits on the edge, a third of the way from the donor (alternating)
          const donorFirst = i % 2 === 0
          const d = donorFirst ? v : w
          const acc = donorFirst ? w : v
          const hx = d[0] + (acc[0] - d[0]) * 0.36
          const hy = d[1] + (acc[1] - d[1]) * 0.36
          return (
            <g key={i}>
              <line x1={d[0]} y1={d[1]} x2={hx} y2={hy} className="f35-thin" style={{ strokeWidth: 2 }} />
              <line x1={hx} y1={hy} x2={acc[0]} y2={acc[1]} className="f35-hbond" style={{ strokeWidth: 1.7 }} />
              <circle cx={hx} cy={hy} r={3.6} className="f35-h-small" />
            </g>
          )
        })}
        {verts.map((v, i) => (
          <circle key={i} cx={v[0]} cy={v[1]} r={6.5} className="f35-o-small" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={R} className="f35-line" style={{ strokeWidth: 2 }} />
      <circle cx={cx} cy={cy} r={R + 4} className="f35-thin" />
    </g>
  )
}

export default function HydrogenBonds() {
  const netLabels = (dx: number, dy: number) => (
    <>
      <Note x={dx + 330} y={dy + 40} anchor="end" tx={dx + 207} ty={dy + 111} size={16}>
        vodíková vazba
      </Note>
      <Note x={dx + 6} y={dy + 30} tx={dx + 88} ty={dy + 68} size={16}>
        kovalentní vazba O–H
      </Note>
      <Note x={dx + 330} y={dy + 276} anchor="end" tx={dx + 230} ty={dy + 240} size={16} className="f35-sec">
        molekula vody
      </Note>
    </>
  )
  const iceLabels = (cx: number, cy: number, R: number, below: number) => (
    <>
      <T x={cx} y={cy - R - 14} className="f35-title">
        led
      </T>
      <Note x={cx} y={below} anchor="middle" size={15}>
        šestiúhelníkové dutiny: led je řidší
      </Note>
      <Note x={cx} y={below + 18} anchor="middle" size={15}>
        než voda, a proto plave
      </Note>
    </>
  )
  return (
    <Figure
      level={3}
      label="Vodíkové vazby ve vodě: kladně polarizovaný vodík δ+ jedné molekuly přitahuje volný elektronový pár kyslíku δ− sousední molekuly (tečkované čáry). V ledu tvoří molekuly pravidelnou síť se šestiúhelníkovými dutinami, proto je led řidší než voda a plave."
      layouts={[
        {
          w: 590,
          h: 320,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <T x={170} y={24} className="f35-title">
                kapalná voda
              </T>
              <Network x={0} y={30} />
              {netLabels(0, 30)}
              <line x1={352} x2={352} y1={20} y2={300} className="f35-rule" />
              <Fade d={1.5}>
                <Ice cx={472} cy={150} R={96} />
                {iceLabels(472, 150, 96, 276)}
              </Fade>
            </>
          ),
        },
        {
          w: 360,
          h: 610,
          max: 440,
          when: 'narrow',
          draw: () => (
            <>
              <T x={180} y={24} className="f35-title">
                kapalná voda
              </T>
              <Network x={14} y={30} />
              {netLabels(14, 30)}
              <line x1={20} x2={340} y1={318} y2={318} className="f35-rule" />
              <Fade d={1.5}>
                <Ice cx={180} cy={452} R={92} />
                {iceLabels(180, 452, 92, 572)}
              </Fade>
            </>
          ),
        },
      ]}
    />
  )
}
