import { Draw, Fade, Figure, Lbl, Plate, Pop, useHatch, useNarrow } from './kit'

const LABEL =
  'Jak mýdlo myje. Anion mýdla, například palmitan CH3(CH2)14COO−, má polární hydrofilní hlavičku –COO− a dlouhý nepolární hydrofobní uhlovodíkový ocas. Ve vodě se molekuly mýdla seskupí kolem kapky mastnoty do micely: ocasy se zanoří do mastnoty, nabité hlavičky míří ven do vody a mastnota se pak spláchne. Kolem micely plavou ionty Na+.'

export default function Micelle() {
  return (
    <Figure name="micelle" level={8} label={LABEL} max={620}>
      <Scene />
    </Figure>
  )
}

/** Zigzag tail from (x1,y1) to (x2,y2) with n segments. */
function tail(x1: number, y1: number, x2: number, y2: number, n: number, amp: number) {
  const dx = (x2 - x1) / n
  const dy = (y2 - y1) / n
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const nx = (-(y2 - y1) / len) * amp
  const ny = ((x2 - x1) / len) * amp
  let d = `M${x1.toFixed(1)} ${y1.toFixed(1)}`
  for (let i = 1; i <= n; i++) {
    const s = i === n ? 0 : i % 2 ? 1 : -1
    d += ` L${(x1 + dx * i + nx * s).toFixed(1)} ${(y1 + dy * i + ny * s).toFixed(1)}`
  }
  return d
}

function Head({ x, y, r = 7, label = false }: { x: number; y: number; r?: number; label?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="f89-lvfill" stroke="var(--edge)" strokeWidth={1.1} />
      {label ? (
        <text className="f89-atom-t" x={x} y={y + 4} style={{ fontSize: 10 }}>
          COO⁻
        </text>
      ) : (
        <text className="f89-atom-t" x={x} y={y + 3.5} style={{ fontSize: 10 }}>
          −
        </text>
      )}
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const hatch = useHatch()
  const L = n
    ? { w: 340, h: 520, mol: { hx: 36, hy: 56, tx: 316, ty: 56 }, water: [8, 160, 324, 352], c: { x: 170, y: 330 } }
    : { w: 500, h: 340, mol: { hx: 64, hy: 44, tx: 64, ty: 290 }, water: [150, 12, 342, 318], c: { x: 322, y: 170 } }
  const { hx, hy, tx, ty } = L.mol
  const horiz = hy === ty
  const N = 22
  const oilR = 54
  const ions = [
    [0.9, 0.12],
    [0.12, 0.88],
    [0.5, 0.05],
    [0.05, 0.5],
    [0.95, 0.52],
    [0.52, 0.95],
  ]
  const [wx, wy, ww, wh] = L.water
  return (
    <Plate w={L.w} h={L.h}>
      {/* single soap anion, enlarged */}
      <Draw d={tail(horiz ? hx + 16 : hx, horiz ? hy : hy + 16, tx, ty, 15, 6)} className="f89-ln" dur={1.1} style={{ strokeWidth: 2.2 }} />
      <Pop delay={0.3}>
        <Head x={hx} y={hy} r={16} label />
      </Pop>
      <Fade delay={0.9}>
        {horiz ? (
          <>
            <text className="f89-lb f89-lv f89-b" x={hx - 14} y={hy - 26}>
              hlavička –COO⁻
            </text>
            <text className="f89-lb f89-sm" x={hx - 14} y={hy + 36}>
              polární, hydrofilní
            </text>
            <text className="f89-lb f89-b" x={tx} y={hy - 26} textAnchor="end">
              ocas
            </text>
            <text className="f89-lb f89-sm" x={tx} y={hy + 36} textAnchor="end">
              nepolární, hydrofobní
            </text>
            <text className="f89-f f89-sm" x={L.w / 2} y={hy + 66} textAnchor="middle">
              CH₃(CH₂)₁₄COO⁻ Na⁺
            </text>
          </>
        ) : (
          <>
            <Lbl x={hx + 24} y={hy - 6} className="f89-b f89-lv">
              hlavička –COO⁻
            </Lbl>
            <Lbl x={hx + 24} y={hy + 12} className="f89-sm">
              polární, hydrofilní
            </Lbl>
            <Lbl x={hx - 22} y={200} className="f89-b" anchor="end" size={16}>
              ocas
            </Lbl>
            <text className="f89-lb f89-sm" x={12} y={318}>
              nepolární, hydrofobní
            </text>
            <text className="f89-f f89-sm" x={12} y={334}>
              CH₃(CH₂)₁₄COO⁻
            </text>
          </>
        )}
      </Fade>

      {/* water */}
      <rect x={wx} y={wy} width={ww} height={wh} rx={8} className="f89-water" />
      <rect x={wx} y={wy} width={ww} height={wh} rx={8} fill={hatch('w')} className="f89-hatch" />
      <rect x={wx} y={wy} width={ww} height={wh} rx={8} className="f89-thin" />

      <g className="f89-bob">
        {/* oil droplet */}
        <Pop delay={0.9}>
          <circle cx={L.c.x} cy={L.c.y} r={oilR} fill="#e8c35a" opacity={0.75} />
          <circle cx={L.c.x} cy={L.c.y} r={oilR} fill={hatch('dd')} className="f89-hatch" />
        </Pop>
        {Array.from({ length: N }, (_, i) => {
          const a = (i / N) * Math.PI * 2
          const c = Math.cos(a)
          const s = Math.sin(a)
          const hr = oilR + 32
          return (
            <Pop key={i} delay={1.3 + i * 0.05}>
              <path d={tail(L.c.x + c * (hr - 7), L.c.y + s * (hr - 7), L.c.x + c * (oilR - 26), L.c.y + s * (oilR - 26), 7, 2.6)} className="f89-thin" style={{ strokeWidth: 1.3 }} />
              <Head x={L.c.x + c * hr} y={L.c.y + s * hr} />
            </Pop>
          )
        })}
      </g>
      <Fade delay={2.6}>
        {ions.map(([fx, fy], i) => {
          const x = wx + 14 + fx * (ww - 28)
          const y = wy + 14 + fy * (wh - 28)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={7} fill="#8a63c9" stroke="var(--edge)" strokeWidth={0.9} />
              <text className="f89-atom-t" x={x} y={y + 3} style={{ fontSize: 8.5 }}>
                Na⁺
              </text>
            </g>
          )
        })}
        <Lbl x={L.c.x} y={L.c.y + 5} anchor="middle" className="f89-b" size={15}>
          mastnota
        </Lbl>
        <Lbl x={wx + ww - 12} y={wy + wh - 12} anchor="end" size={15} className="f89-lb">
          voda
        </Lbl>
        <Lbl x={wx + 12} y={wy + 26} tx={L.c.x - 62} ty={L.c.y - 62} size={15} className="f89-b f89-lv">
          micela
        </Lbl>
      </Fade>
    </Plate>
  )
}
