import { useId } from 'react'
import { Draw, DrawArrow, Fade, Figure, Pop, pat, rng, useCompact, useFig } from './kit'

/** A deterministic zigzag (random walk) inside a circle of radius `r` around (0, 0). */
function walk(r: number, steps = 15, seed = 11): [number, number][] {
  const g = rng(seed)
  const pts: [number, number][] = [[-r * 0.5, -r * 0.1]]
  for (let i = 0; i < steps; i++) {
    const [x, y] = pts[pts.length - 1]
    let nx = x
    let ny = y
    for (let t = 0; t < 8; t++) {
      const a = g() * Math.PI * 2
      const l = r * (0.2 + g() * 0.2)
      nx = x + Math.cos(a) * l
      ny = y + Math.sin(a) * l
      if (Math.hypot(nx, ny) < r * 0.74) break
    }
    pts.push([nx, ny])
  }
  return pts
}

function Grain({ x, y, r }: { x: number; y: number; r: number }) {
  const { id } = useFig()
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#d9b44a" className="fz1-o" />
      <circle cx={x} cy={y} r={r} fill={pat(id, 'dots')} />
      <path d={`M${x - r * 0.55} ${y - r * 0.2} A${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.1} ${y - r * 0.6}`} className="fz1-o fz1-thin" />
    </g>
  )
}

function HatchDisc({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig()
  return <circle cx={cx} cy={cy} r={r} fill={pat(id, 'h')} opacity={0.4} />
}

function Water({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const h = (dx: number, dy: number) => [x + dx * c - dy * s, y + dx * s + dy * c]
  const [h1x, h1y] = h(-5.5, -4)
  const [h2x, h2y] = h(5.5, -4)
  return (
    <g className="fz1-jiggle" style={{ animationDelay: `${(-((x * 7 + y * 3) % 9) / 10).toFixed(2)}s` }}>
      <circle cx={h1x} cy={h1y} r={3.2} fill="#f4f1ea" className="fz1-catom" />
      <circle cx={h2x} cy={h2y} r={3.2} fill="#f4f1ea" className="fz1-catom" />
      <circle cx={x} cy={y} r={5.2} fill="#d9493b" className="fz1-catom" />
    </g>
  )
}

/** Magnified inset: water molecules bumping the grain, more hits from the left. */
function Inset({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig()
  const gr = r * 0.34
  const g = rng(3)
  const mols: [number, number, number][] = []
  for (let i = 0; i < 90 && mols.length < 34; i++) {
    const a = g() * Math.PI * 2
    const d = gr + 12 + g() * (r - gr - 20)
    const x = cx + Math.cos(a) * d
    const y = cy + Math.sin(a) * d
    if (mols.every(([mx, my]) => Math.hypot(mx - x, my - y) > 19)) mols.push([x, y, g() * 6])
  }
  // hits: 5 from the left, 2 from the right
  const hits = [150, 170, 190, 205, 222, -20, 25].map((deg) => (deg * Math.PI) / 180)
  return (
    <g>
      <defs>
        <clipPath id={`${id}-bin`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} className="fz1-water" />
      <g clipPath={`url(#${id}-bin)`}>
        {mols.map(([x, y, a], i) => (
          <Water key={i} x={x} y={y} a={a} />
        ))}
      </g>
      <Grain x={cx} y={cy} r={gr} />
      {hits.map((a, i) => {
        const x1 = cx + Math.cos(a) * (gr + 26)
        const y1 = cy + Math.sin(a) * (gr + 26)
        const x2 = cx + Math.cos(a) * (gr + 5)
        const y2 = cy + Math.sin(a) * (gr + 5)
        return <DrawArrow key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} tone="blue" delay={0.9 + i * 0.07} />
      })}
      <DrawArrow d={`M${cx} ${cy} h${gr + 34}`} tone="lvl" delay={1.5} className="fz1-wide" />
      <circle cx={cx} cy={cy} r={r} className="fz1-o fz1-thick" />
    </g>
  )
}

export default function BrownianMotion() {
  const compact = useCompact()
  const n = compact.narrow
  const L = n
    ? { w: 360, h: 592, fx: 180, fy: 156, fr: 120, ix: 180, iy: 416, ir: 100 }
    : { w: 640, h: 380, fx: 170, fy: 190, fr: 148, ix: 478, iy: 178, ir: 120 }
  const pts = walk(L.fr)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(L.fx + x).toFixed(1)} ${(L.fy + y).toFixed(1)}`).join(' ')
  const [ex, ey] = pts[pts.length - 1]
  const gx = L.fx + ex
  const gy = L.fy + ey
  const id = 'bm' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <Figure
      w={L.w}
      h={L.h}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      replay
      label="Brownův pohyb. V mikroskopu vidíme, že drobné zrníčko ve vodě (třeba částečka z pylu) se samo pohybuje po klikaté dráze. Ve zvětšeném výřezu jsou nakresleny molekuly vody, které v mikroskopu vidět nejsou: neustále se pohybují a narážejí do zrnka ze všech stran. Nárazy se v každém okamžiku úplně nevyrovnají, zrnko dostane výsledný šťouchanec a posune se. Brownův pohyb je důkazem, že se částice látky neustále neuspořádaně pohybují."
    >
      <defs>
        <clipPath id={`${id}-bf`}>
          <circle cx={L.fx} cy={L.fy} r={L.fr} />
        </clipPath>
      </defs>
      {/* microscope field of view */}
      <circle cx={L.fx} cy={L.fy} r={L.fr} className="fz1-water" />
      <g clipPath={`url(#${id}-bf)`}>
        <HatchDisc cx={L.fx} cy={L.fy} r={L.fr} />
        {[
          [-0.55, -0.45, 5],
          [0.5, 0.52, 4],
          [0.62, -0.3, 6],
          [-0.4, 0.62, 4.5],
        ].map(([a, b, r], i) => (
          <circle key={i} cx={L.fx + a * L.fr} cy={L.fy + b * L.fr} r={r} fill="#d9b44a" className="fz1-o fz1-thin" opacity={0.7} />
        ))}
      </g>
      <Draw d={d} className="fz1-o fz1-lvl-s" delay={0.15} style={{ strokeWidth: 1.8 }} />
      <Fade delay={0.2}>
        {pts.slice(0, -1).map(([x, y], i) => (
          <circle key={i} cx={L.fx + x} cy={L.fy + y} r={1.8} className="fz1-lvl-f" />
        ))}
      </Fade>
      <Pop delay={1.1}>
        <Grain x={gx} y={gy} r={8} />
      </Pop>
      <circle cx={L.fx} cy={L.fy} r={L.fr} className="fz1-o fz1-thick" />
      <circle cx={L.fx} cy={L.fy} r={L.fr + 6} className="fz1-o fz1-thin" />

      {/* zoom lines from the grain to the inset */}
      <Draw
        d={n ? `M${gx - 10} ${gy + 4} L${L.ix - L.ir * 0.7} ${L.iy - L.ir * 0.72} M${gx + 10} ${gy + 4} L${L.ix + L.ir * 0.7} ${L.iy - L.ir * 0.72}` : `M${gx + 4} ${gy - 9} L${L.ix - L.ir * 0.72} ${L.iy - L.ir * 0.7} M${gx + 4} ${gy + 9} L${L.ix - L.ir * 0.72} ${L.iy + L.ir * 0.7}`}
        className="fz1-o fz1-thin fz1-dash"
        delay={0.6}
      />
      <Pop delay={0.7}>
        <Inset cx={L.ix} cy={L.iy} r={L.ir} />
      </Pop>

      {/* labels */}
      <Fade delay={0.4}>
        <text x={L.fx} y={n ? 18 : 26} textAnchor="middle" className="fz1-lbl fz1-b">
          {n ? 'pohled mikroskopem' : 'pohled mikroskopem: klikatá dráha zrnka'}
        </text>
      </Fade>
      <Fade delay={1.2}>
        <text x={L.ix} y={n ? L.iy + L.ir + 26 : L.iy + L.ir + 28} textAnchor="middle" className="fz1-lbl fz1-b">
          zvětšeno: molekuly vody
        </text>
        <text x={L.ix} y={n ? L.iy + L.ir + 45 : L.iy + L.ir + 48} textAnchor="middle" className="fz1-lbl fz1-sm">
          narážejí do zrnka ze všech stran
        </text>
        <text x={L.ix} y={L.iy + L.ir + (n ? 64 : 66)} textAnchor="middle" className="fz1-lbl fz1-sm">
          nárazy se nevyrovnají → zrnko se posune
        </text>
        <text x={L.ix + L.ir * 0.34 + 4} y={L.iy - 12} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t fz1-halo">
          posun
        </text>
      </Fade>
    </Figure>
  )
}
