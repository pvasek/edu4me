import { Axes, Draw, Fade, Figure, Head, Lbl, Pop, Sym, sine } from './kit'
import { NORTH, SOUTH } from './kit'
import { Block, DEPTH_DEG, at, pt, type P } from './machine'

const LABEL =
  'Generátor střídavého proudu (alternátor). Cívka se otáčí v magnetickém poli mezi póly N a S; mění se magnetický indukční tok cívkou, a proto se v ní indukuje napětí. Konce cívky jsou spojené se dvěma sběracími kroužky, z nichž kartáčky odvádějí proud do žárovky. Graf ukazuje výstupní napětí u v závislosti na čase t: sinusoida s amplitudou U_m a periodou T. Napětí je nulové, když je rovina cívky kolmá k indukčním čarám, a největší, když je s nimi rovnoběžná; po půlotáčce se jeho směr obrátí.'

const L = 80
const A0: P = [152, 190]
const HW = 44
const FL: P = [A0[0] - HW, A0[1]]
const FR: P = [A0[0] + HW, A0[1]]
const BL = at(FL, L)
const BR = at(FR, L)
const R1 = at(A0, -22) // slip ring joined to the right side
const R2 = at(A0, -66) // slip ring joined to the left side
const RR = 10

function Ring({ c }: { c: P }) {
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={RR} className="fz3-o fz3-copper" />
      <circle cx={c[0]} cy={c[1]} r={RR - 4} className="fz3-o fz3-thin fz3-fill" />
      <rect x={c[0] - 5} y={c[1] + RR - 1} width={10} height={11} rx={1.5} className="fz3-o fz3-brush" />
    </g>
  )
}

function Machine() {
  const back = at(A0, L + 24)
  const ml = at(FL, L / 2)
  const mr = at(FR, L / 2)
  return (
    <g>
      <Block x={20} y={126} w={34} h={112} depth={L} n="N" />
      {[136, 152].map((y, i) => (
        <Draw key={y} d={`M${pt(at([54, y], L / 2))} L${pt(at([250, y], L / 2))}`} className="fz3-field" delay={0.2 + i * 0.1} />
      ))}
      <Fade delay={0.9}>
        {[136, 152].map((y) => {
          const h = at([240, y], L / 2)
          return <Head key={y} x={h[0]} y={h[1]} deg={0} tone="blue" />
        })}
        <Sym x={at([228, 136], L / 2)[0]} y={at([228, 136], L / 2)[1] - 8} t="B" tone="blue" />
      </Fade>
      {/* axis through the coil and both rings */}
      <path d={`M${pt(at(A0, -76))} L${pt(back)}`} className="fz3-o fz3-axle" />
      <Draw d={`M${pt(FR)} L${pt(BR)} L${pt(BL)} L${pt(FL)} L${pt([R2[0], R2[1] - RR])}`} className="fz3-coil fz3-coil-band" delay={0.1} />
      <path d={`M${pt(FR)} L${pt([R1[0] + 2, R1[1] - RR])}`} className="fz3-coil fz3-coil-band" />
      <Fade delay={0.8}>
        <Head x={mr[0]} y={mr[1]} deg={DEPTH_DEG + 180} tone="acc" s={1.2} />
        <Head x={ml[0]} y={ml[1]} deg={DEPTH_DEG} tone="acc" s={1.2} />
      </Fade>
      {/* rotation driven from outside (turbine, crank) */}
      <Draw
        d={`M${pt([back[0] - 20, back[1] + 8])} A21 21 0 1 1 ${pt([back[0] + 20, back[1] + 8])}`}
        className="fz3-arr fz3-arr-lvl fz3-vec"
        arrow="lvl"
        delay={1}
      />
      <Block x={250} y={126} w={34} h={112} depth={L} n="S" />
      <Ring c={R1} />
      <Ring c={R2} />
      {/* output circuit to a bulb */}
      <path d={`M${R2[0]} ${R2[1] + RR + 10} V300 H62 V292`} className="fz3-wire fz3-wire-thin" />
      <path d={`M${R1[0]} ${R1[1] + RR + 10} V312 H50 V292`} className="fz3-wire fz3-wire-thin" />
      <path d={`M${R1[0]} ${R1[1] + RR + 10} V312 H50 V292`} className="fz3-current" />
      <circle cx={56} cy={268} r={22} className="fz3-glow fz3-bulb-glow" />
      <circle cx={56} cy={266} r={15} className="fz3-o fz3-glass" />
      <path d="M50 280 V270 Q56 258 62 270 V280" className="fz3-o fz3-thin" />
      <rect x={47} y={279} width={18} height={13} rx={2} className="fz3-o fz3-fill3" />
    </g>
  )
}

/** Position of the coil (seen along the axis) between N and S at phase φ (0 = plane ⊥ B). */
function CoilIcon({ x, y, phi }: { x: number; y: number; phi: number }) {
  const dx = Math.sin(phi) * 11
  const dy = -Math.cos(phi) * 11
  return (
    <g>
      <rect x={x - 19} y={y - 12} width={4} height={24} fill={NORTH} />
      <rect x={x + 15} y={y - 12} width={4} height={24} fill={SOUTH} />
      <path d={`M${x - dx} ${y - dy} L${x + dx} ${y + dy}`} className="fz3-coil" />
      <circle cx={x - dx} cy={y - dy} r={2.2} className="fz3-o fz3-fill" />
      <circle cx={x + dx} cy={y + dy} r={2.2} className="fz3-o fz3-fill" />
    </g>
  )
}

function Graph() {
  const ox = 40
  const oy = 432
  const T = 272
  const A = 46
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  return (
    <g>
      <Axes x={ox} y={oy} w={312} h={A + 22} down={A + 10} xl="t" yl="u" />
      <Draw d={sine(ox, oy, T + 22, A, T)} className="fz3-curve fz3-curve-lvl" delay={0.4} />
      <path d={`M${ox - 4} ${oy - A} H${ox + T / 4}`} className="fz3-o fz3-thin fz3-dash" />
      <Sym x={ox - 8} y={oy - A + 6} t="U_{m}" anchor="end" />
      <path d={`M${ox + T} ${oy - 5} V${oy + 5}`} className="fz3-o" />
      <Sym x={ox + T} y={oy + 22} t="T" />
      <path d={`M${ox + T / 2} ${oy - 5} V${oy + 5}`} className="fz3-o" />
      <text x={ox + T / 2} y={oy + 22} textAnchor="middle" className="fz3-sym-t" style={{ fontSize: 16 }}>
        T/2
      </text>
      {ticks.map((f) => {
        const x = ox + f * T
        const y = oy - A * Math.sin(2 * Math.PI * f)
        return (
          <g key={f}>
            <path d={`M${x} 356 V${y}`} className="fz3-o fz3-thin fz3-dot2" />
            <circle cx={x} cy={y} r={3} className="fz3-lvl-f" />
            <CoilIcon x={x} y={340} phi={2 * Math.PI * f} />
          </g>
        )
      })}
    </g>
  )
}

export default function Generator() {
  return (
    <Figure level={7} w={372} h={474} max={520} label={LABEL}>
      <g transform="translate(0 -74)">
        <Pop delay={0}>
          <Machine />
        </Pop>
        <Fade delay={0.4}>
          <Lbl x={176} y={98} tx={BL[0] + 40} ty={BL[1]} className="fz3-b">
            cívka
          </Lbl>
          <Lbl x={172} y={268} tx={R1[0] + 9} ty={R1[1] + 5} className="fz3-sm">
            sběrací kroužky
          </Lbl>
          <Lbl x={172} y={290} tx={R1[0] + 6} ty={R1[1] + 18} className="fz3-sm">
            kartáčky
          </Lbl>
          <text x={56} y={334} textAnchor="middle" className="fz3-lbl fz3-sm">
            žárovka
          </text>
        </Fade>
      </g>
      <g transform="translate(0 -50)">
        <Graph />
        <text x={186} y={518} textAnchor="middle" className="fz3-lbl fz3-sm">
          střídavé napětí: po půlotáčce mění směr
        </text>
      </g>
    </Figure>
  )
}
