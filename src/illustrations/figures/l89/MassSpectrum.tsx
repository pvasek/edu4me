import { F, Fade, Figure, Grow, Plate, useHatch, useNarrow } from './kit'

const LABEL =
  'Hmotnostní spektrum ethanolu CH3CH2OH jako sloupcový graf: vodorovně poměr hmotnosti a náboje m/z, svisle relativní intenzita v procentech. Molekulový ion M+ má m/z 46 (asi 20 %), ion po ztrátě vodíku CH3CHOH+ m/z 45 (asi 50 %), nejvyšší základní pík 100 % má m/z 31 a patří fragmentu CH2OH+, dále C2H5+ při m/z 29 (asi 25 %) a C2H3+ při m/z 27 (asi 20 %). Vložený graf ukazuje izotopy chloru v chlormethanu CH3Cl: píky M při m/z 50 a M+2 při m/z 52 mají poměr výšek 3 : 1, protože chlor-35 a chlor-37 jsou v přírodě v poměru asi 3 : 1.'

type Peak = { mz: number; i: number; f?: string }

const PEAKS: Peak[] = [
  { mz: 27, i: 20, f: 'C_{2}H_{3}^{+}' },
  { mz: 29, i: 25, f: 'C_{2}H_{5}^{+}' },
  { mz: 31, i: 100, f: 'CH_{2}OH^{+}' },
  { mz: 45, i: 50, f: 'CH_{3}CHOH^{+}' },
  { mz: 46, i: 20 },
]

export default function MassSpectrum() {
  return (
    <Figure name="mass-spectrum" level={8} label={LABEL} max={680}>
      <Scene />
    </Figure>
  )
}

function Scene() {
  const n = useNarrow()
  const hatch = useHatch()
  const L = n
    ? { w: 340, h: 458, x0: 50, x1: 324, y0: 264, y1: 84, bw: 6, inset: { x: 42, y: 326, w: 270, h: 118 } }
    : { w: 660, h: 340, x0: 70, x1: 610, y0: 280, y1: 80, bw: 8, inset: { x: 296, y: 96, w: 172, h: 142 } }
  const X = (mz: number) => L.x0 + ((mz - 20) / 30) * (L.x1 - L.x0)
  const Y = (i: number) => L.y0 - (i / 100) * (L.y0 - L.y1)
  const p = (mz: number) => PEAKS.find((k) => k.mz === mz)!
  return (
    <Plate w={L.w} h={L.h}>
      {/* grid + axes */}
      <Fade delay={0.1}>
        {[20, 40, 60, 80, 100].map((i) => (
          <g key={i}>
            <line className="f89-guide" x1={L.x0} y1={Y(i)} x2={L.x1} y2={Y(i)} style={{ opacity: 0.35, strokeDasharray: '2 5' }} />
            <text className="f89-f f89-sm f89-muted" x={L.x0 - 7} y={Y(i) + 4} textAnchor="end">
              {i}
            </text>
          </g>
        ))}
        {[20, 25, 30, 35, 40, 45, 50].map((mz) => (
          <g key={mz}>
            <line className="f89-thin" x1={X(mz)} y1={L.y0} x2={X(mz)} y2={L.y0 + 5} />
            <text className="f89-f f89-sm f89-muted" x={X(mz)} y={L.y0 + 19} textAnchor="middle">
              {mz}
            </text>
          </g>
        ))}
        <path className="f89-ln" d={`M${L.x0} ${L.y1 - 14} V${L.y0} H${L.x1 + 10}`} />
        <text className="f89-lb" x={(L.x0 + L.x1) / 2} y={L.y0 + 40} textAnchor="middle">
          m/z
        </text>
        <text className="f89-lb" transform={`translate(${n ? 14 : 22} ${(L.y0 + L.y1) / 2}) rotate(-90)`} textAnchor="middle">
          relativní intenzita (%)
        </text>
        <text className="f89-lb f89-b" x={L.x1} y={n ? 20 : L.y1 - 30} textAnchor="end">
          ethanol CH₃CH₂OH
        </text>
      </Fade>

      {/* bars */}
      {PEAKS.map((k, j) => (
        <Grow key={k.mz} axis="y" origin="50% 100%" delay={0.3 + j * 0.1} dur={0.6}>
          <rect
            x={X(k.mz) - L.bw / 2}
            y={Y(k.i)}
            width={L.bw}
            height={L.y0 - Y(k.i)}
            className="f89-lvfill"
            style={{ stroke: 'var(--edge)', strokeWidth: 1, opacity: k.mz === 31 ? 1 : 0.8 }}
          />
          <rect x={X(k.mz) - L.bw / 2} y={Y(k.i)} width={L.bw} height={L.y0 - Y(k.i)} fill={hatch('s')} className="f89-hatch" />
        </Grow>
      ))}

      {/* fragment labels */}
      <Fade delay={1.1}>
        {/* base peak */}
        <text className="f89-lb f89-lv f89-b" x={X(31)} y={Y(100) - 28} textAnchor="middle">
          základní pík
        </text>
        <F x={X(31)} y={Y(100) - 10} t={p(31).f!} className="f89-f f89-b" />
        {/* m/z 29 and 27 */}
        <F x={X(29) + 2} y={Y(25) - 8} t={p(29).f!} anchor="end" className={`f89-f ${n ? 'f89-sm' : ''}`} />
        <F x={X(27) - L.bw / 2 - 4} y={Y(20) + 12} t={p(27).f!} anchor="end" className={`f89-f ${n ? 'f89-sm' : ''}`} />
        {/* m/z 45 */}
        {n ? (
          <>
            <F x={X(45) - 7} y={Y(50) + 14} t={p(45).f!} anchor="end" className="f89-f f89-sm" />
            <F x={X(45) - 7} y={Y(50) + 30} t="[M–H]^{+}" anchor="end" className="f89-f f89-sm f89-muted" />
          </>
        ) : (
          <>
            <F x={X(45)} y={Y(50) - 10} t={p(45).f!} />
            <F x={X(45)} y={Y(50) - 28} t="[M–H]^{+}" className="f89-f f89-sm f89-muted" />
          </>
        )}
        {/* molecular ion */}
        {n ? (
          <>
            <text className="f89-lb f89-b" x={L.w - 4} y={Y(100) + 20} textAnchor="end">
              molekulový ion
            </text>
            <F x={L.w - 4} y={Y(100) + 38} t="M^{+} = CH_{3}CH_{2}OH^{+}" anchor="end" className="f89-f f89-sm" />
            <line className="f89-lead" x1={X(46) + 8} y1={Y(100) + 48} x2={X(46)} y2={Y(20) - 4} />
            <circle className="f89-dot" cx={X(46)} cy={Y(20) - 4} r={2} />
          </>
        ) : (
          <>
            <text className="f89-lb f89-b" x={X(46) + 10} y={Y(20) - 26}>
              molekulový ion
            </text>
            <F x={X(46) + 10} y={Y(20) - 8} t="M^{+} = CH_{3}CH_{2}OH^{+}" anchor="start" className="f89-f f89-sm" />
          </>
        )}
        <text className="f89-f f89-sm f89-muted" x={X(46) + L.bw / 2 + 3} y={Y(20) + 16}>
          46
        </text>
      </Fade>

      <Inset {...L.inset} delay={1.3} />
    </Plate>
  )
}

/** Chlorine isotope pattern of chloromethane: M : M+2 = 3 : 1. */
function Inset({ x, y, w, h, delay }: { x: number; y: number; w: number; h: number; delay: number }) {
  const hatch = useHatch()
  const base = y + h - 26
  const top = y + 58
  const bx = [x + w * 0.36, x + w * 0.66]
  const H = (i: number) => base - (i / 100) * (base - top)
  return (
    <Fade delay={delay}>
      <rect x={x} y={y} width={w} height={h} rx={4} className="f89-box" style={{ strokeWidth: 1.1 }} />
      <text className="f89-lb f89-b f89-sm" x={x + w / 2} y={y + 20} textAnchor="middle">
        izotopy chloru v CH₃Cl
      </text>
      <F x={x + w / 2} y={y + 38} t="^{35}Cl : ^{37}Cl ≈ 3 : 1" className="f89-f f89-sm" />
      <line className="f89-thin" x1={x + 14} y1={base} x2={x + w - 14} y2={base} />
      {[
        { i: 100, mz: 50, t: 'M' },
        { i: 33, mz: 52, t: 'M+2' },
      ].map((b, k) => (
        <g key={b.mz}>
          <Grow axis="y" origin="50% 100%" delay={delay + 0.2 + k * 0.15} dur={0.5}>
            <rect x={bx[k] - 5} y={H(b.i)} width={10} height={base - H(b.i)} fill="#4fae5a" stroke="var(--edge)" strokeWidth={1} />
            <rect x={bx[k] - 5} y={H(b.i)} width={10} height={base - H(b.i)} fill={hatch('s')} className="f89-hatch" />
          </Grow>
          <text className="f89-f f89-sm f89-b" x={bx[k] + 9} y={H(b.i) + 10}>
            {b.t}
          </text>
          <text className="f89-f f89-sm f89-muted" x={bx[k]} y={base + 15} textAnchor="middle">
            {b.mz}
          </text>
        </g>
      ))}
      <text className="f89-lb f89-lv" x={x + 14} y={H(40)}>
        3 : 1
      </text>
    </Fade>
  )
}
