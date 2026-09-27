import { Atom, Draw, Fade, Figure, Plate, Pop, useNarrow } from './kit'

const LABEL =
  'Spektrum ¹H NMR ethanolu CH3CH2OH. Vodorovná osa je chemický posun δ v ppm od 5 vlevo do 0 vpravo, kde leží referenční signál TMS. Tři druhy vodíků dávají tři signály: triplet při δ 1,2 patří třem vodíkům CH3, kvartet při δ 3,7 dvěma vodíkům CH2 vedle kyslíku a singlet kolem δ 2,6 jednomu vodíku skupiny OH. Plochy signálů (integrace) jsou v poměru 3 : 2 : 1. Pravidlo n + 1: signál se štěpí na n + 1 čar, kde n je počet vodíků na sousedním uhlíku; CH3 sousedí s CH2, proto triplet, CH2 sousedí s CH3, proto kvartet. Vodík OH se rychle vyměňuje, a proto dává singlet.'

const C_A = 'var(--blue)' // CH3
const C_B = 'var(--accent)' // CH2
const C_C = 'var(--green)' // OH

type Group = { key: string; d: number; lines: number[]; h: number; w: number; color: string; name: string; n: string; mult: string }

/** Multiplets: centre δ, relative line intensities (Pascal), number of H, line half-width. */
const GROUPS: Group[] = [
  { key: 'b', d: 3.7, lines: [1, 3, 3, 1], h: 2, w: 0.012, color: C_B, name: 'CH₂', n: '2H', mult: 'kvartet' },
  { key: 'c', d: 2.6, lines: [1], h: 1, w: 0.03, color: C_C, name: 'OH', n: '1H', mult: 'singlet' },
  { key: 'a', d: 1.2, lines: [1, 2, 1], h: 3, w: 0.012, color: C_A, name: 'CH₃', n: '3H', mult: 'triplet' },
]
const J = 0.09 // line spacing in ppm (exaggerated so the splitting is visible)

/** Peak height of group g at shift δ (Lorentzian lines; area ∝ number of H). */
function intensity(g: Group, d: number) {
  const sum = g.lines.reduce((s, v) => s + v, 0)
  const mid = (g.lines.length - 1) / 2
  let y = 0
  g.lines.forEach((v, i) => {
    const c = g.d + (i - mid) * J
    const k = (g.h * v) / sum
    // normalise peak height by width so the areas stay proportional
    y += (k * (0.012 / g.w)) / (1 + ((d - c) / g.w) ** 2)
  })
  return y
}

export default function NmrSpectrum() {
  return (
    <Figure name="nmr-spectrum" level={8} label={LABEL} max={680}>
      <Scene />
    </Figure>
  )
}

/** Ethanol with its three H environments coloured; (x, y) = CH3 carbon. */
function Ethanol({ x, y }: { x: number; y: number }) {
  const C1 = [x, y + 14]
  const C2 = [x + 50, y - 6]
  const O = [x + 100, y + 14]
  const HO = [x + 128, y - 2]
  const hl = 21
  const at = (p: number[], deg: number) => [p[0] + Math.cos((deg * Math.PI) / 180) * hl, p[1] + Math.sin((deg * Math.PI) / 180) * hl]
  const hA = [at(C1, 95), at(C1, 180), at(C1, 245)]
  const hB = [at(C2, 240), at(C2, 300)]
  const halo = (cx: number, cy: number, rx: number, ry: number, c: string) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={{ fill: `color-mix(in srgb, ${c} 20%, transparent)`, stroke: c, strokeWidth: 1, strokeDasharray: '3 3' }} />
  )
  return (
    <g>
      {halo(C1[0] - 8, C1[1] + 2, 30, 30, C_A)}
      {halo(C2[0], C2[1] - 8, 24, 26, C_B)}
      {halo((O[0] + HO[0]) / 2, (O[1] + HO[1]) / 2, 28, 18, C_C)}
      <line className="f89-bond" x1={C1[0]} y1={C1[1]} x2={C2[0]} y2={C2[1]} />
      <line className="f89-bond" x1={C2[0]} y1={C2[1]} x2={O[0]} y2={O[1]} />
      <line className="f89-bond" x1={O[0]} y1={O[1]} x2={HO[0]} y2={HO[1]} />
      {hA.map((h, i) => (
        <line key={`a${i}`} className="f89-bond" x1={C1[0]} y1={C1[1]} x2={h[0]} y2={h[1]} />
      ))}
      {hB.map((h, i) => (
        <line key={`b${i}`} className="f89-bond" x1={C2[0]} y1={C2[1]} x2={h[0]} y2={h[1]} />
      ))}
      {hA.map((h, i) => (
        <Atom key={`A${i}`} x={h[0]} y={h[1]} el="H" r={7.5} fill={C_A} />
      ))}
      {hB.map((h, i) => (
        <Atom key={`B${i}`} x={h[0]} y={h[1]} el="H" r={7.5} fill={C_B} />
      ))}
      <Atom x={HO[0]} y={HO[1]} el="H" r={7.5} fill={C_C} />
      <Atom x={C1[0]} y={C1[1]} el="C" r={10} />
      <Atom x={C2[0]} y={C2[1]} el="C" r={10} />
      <Atom x={O[0]} y={O[1]} el="O" r={10} />
      <text className="f89-f f89-b" x={C1[0] - 8} y={y + 60} textAnchor="middle" style={{ fill: C_A }}>
        CH₃
      </text>
      <text className="f89-f f89-b" x={C2[0]} y={y + 60} textAnchor="middle" style={{ fill: C_B }}>
        CH₂
      </text>
      <text className="f89-f f89-b" x={(O[0] + HO[0]) / 2} y={y + 60} textAnchor="middle" style={{ fill: C_C }}>
        OH
      </text>
    </g>
  )
}

function Rule({ x, y, w }: { x: number; y: number; w: number }) {
  const rows: [string, string, string][] = [
    ['CH₃', 'soused CH₂ (n = 2) → 3 čáry', C_A],
    ['CH₂', 'soused CH₃ (n = 3) → 4 čáry', C_B],
    ['OH', 'rychlá výměna → 1 čára', C_C],
  ]
  return (
    <g>
      <rect x={x} y={y} width={w} height={136} rx={4} className="f89-box" style={{ strokeWidth: 1.1 }} />
      <text className="f89-lb f89-b" x={x + 12} y={y + 22}>
        pravidlo n + 1
      </text>
      <text className="f89-lb f89-sm" x={x + 12} y={y + 40}>
        n = počet H na sousedním uhlíku
      </text>
      {rows.map(([g, t, c], i) => (
        <g key={g}>
          <text className="f89-f f89-b f89-sm" x={x + 12} y={y + 62 + i * 18} style={{ fill: c }}>
            {g}
          </text>
          <text className="f89-lb f89-sm" x={x + 50} y={y + 62 + i * 18}>
            {t}
          </text>
        </g>
      ))}
      <text className="f89-lb f89-sm" x={x + 12} y={y + 124}>
        plochy signálů 3 : 2 : 1 = počty H
      </text>
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? { w: 340, h: 564, mol: { x: 110, y: 64 }, title: { x: 170, y: 18 }, rule: { x: 20, y: 408, w: 300 }, x0: 30, x1: 316, y0: 330, unit: 80 }
    : { w: 660, h: 420, mol: { x: 70, y: 70 }, title: { x: 20, y: 22 }, rule: { x: 330, y: 10, w: 300 }, x0: 50, x1: 610, y0: 352, unit: 100 }
  const X = (d: number) => L.x1 - (d / 5) * (L.x1 - L.x0)
  const Y = (v: number) => L.y0 - v * L.unit
  const path = (g: Group) => {
    const pts: string[] = []
    for (let d = g.d + 0.32; d >= g.d - 0.32; d -= 0.002) pts.push(`${X(d).toFixed(1)} ${Y(intensity(g, d)).toFixed(1)}`)
    return `M${pts.join(' L')}`
  }
  const tms = { d: 0, v: 0.55 }
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.1}>
        <text className="f89-lb f89-b" x={L.title.x} y={L.title.y} textAnchor={n ? 'middle' : 'start'}>
          ethanol CH₃CH₂OH
        </text>
        <Ethanol {...L.mol} />
      </Pop>
      <Fade delay={0.4}>
        <Rule {...L.rule} />
      </Fade>

      {/* axis */}
      <Fade delay={0.2}>
        <line className="f89-ln" x1={L.x0 - 6} y1={L.y0} x2={L.x1 + 10} y2={L.y0} />
        {[5, 4, 3, 2, 1, 0].map((d) => (
          <g key={d}>
            <line className="f89-thin" x1={X(d)} y1={L.y0} x2={X(d)} y2={L.y0 + 5} />
            <text className="f89-f f89-sm f89-muted" x={X(d)} y={L.y0 + 19} textAnchor="middle">
              {d}
            </text>
          </g>
        ))}
        <text className="f89-lb" x={(L.x0 + L.x1) / 2} y={L.y0 + 40} textAnchor="middle">
          chemický posun δ (ppm)
        </text>
      </Fade>

      {/* TMS reference */}
      <Draw d={`M${X(0.12)} ${L.y0} L${X(0.012)} ${L.y0} L${X(0)} ${Y(tms.v)} L${X(-0.012)} ${L.y0} L${X(-0.06)} ${L.y0}`} className="f89-ln" delay={0.6} dur={0.4} style={{ strokeWidth: 1.4 }} />
      <Fade delay={0.9}>
        <text className="f89-f f89-sm f89-muted" x={X(0) - 4} y={Y(tms.v) - 8} textAnchor={n ? 'end' : 'middle'}>
          TMS
        </text>
      </Fade>

      {GROUPS.map((g, i) => {
        const peakTop = Math.min(...Array.from({ length: 201 }, (_, k) => Y(intensity(g, g.d - 0.2 + k * 0.002))))
        return (
          <g key={g.key}>
            <Draw d={path(g)} className="f89-ln" delay={0.9 + i * 0.5} dur={0.9} style={{ stroke: g.color, strokeWidth: 1.6 }} />
            <Fade delay={1.4 + i * 0.5}>
              <text className="f89-f f89-b" x={X(g.d)} y={peakTop - 30} textAnchor="middle" style={{ fill: g.color }}>
                {n ? g.n : `${g.name} · ${g.n}`}
              </text>
              <text className="f89-lb f89-sm" x={X(g.d)} y={peakTop - 12} textAnchor="middle">
                {g.mult}
              </text>
            </Fade>
          </g>
        )
      })}
      <Fade delay={0.3}>
        <line className="f89-ln" x1={L.x0 - 6} y1={L.y0} x2={L.x1 + 10} y2={L.y0} style={{ strokeWidth: 1.2 }} />
      </Fade>
    </Plate>
  )
}
