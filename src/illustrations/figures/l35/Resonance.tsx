import { Arrow, Fade, Figure, Pop, T } from './kit'

const rad = (d: number) => (d * Math.PI) / 180
/** directions of the three oxygens from nitrogen (screen degrees) */
const DIRS = [-90, 150, 30]

type Pt = [number, number]
const at = (c: Pt, ang: number, r: number): Pt => [c[0] + Math.cos(rad(ang)) * r, c[1] + Math.sin(rad(ang)) * r]

/** Bond line between two atom letters, trimmed; `kind` 1 single, 2 double, 'part' = solid + dashed. */
function BondLine({ a, b, kind, trim = 11 }: { a: Pt; b: Pt; kind: 1 | 2 | 'part'; trim?: number }) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const L = Math.hypot(dx, dy)
  const ux = dx / L
  const uy = dy / L
  const nx = -uy
  const ny = ux
  const x1 = a[0] + ux * trim
  const y1 = a[1] + uy * trim
  const x2 = b[0] - ux * trim
  const y2 = b[1] - uy * trim
  const line = (o: number, cls: string, k: number) => (
    <line key={k} x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} className={cls} />
  )
  if (kind === 1) return line(0, 'f35-rs-bond', 0)
  if (kind === 2) return <g>{[line(-2.6, 'f35-rs-bond', 0), line(2.6, 'f35-rs-bond', 1)]}</g>
  return <g>{[line(-2.6, 'f35-rs-bond', 0), line(2.6, 'f35-rs-part', 1)]}</g>
}

/** Lone electron pairs around an atom, pointing along the given directions. */
function Pairs({ c, dirs }: { c: Pt; dirs: number[] }) {
  return (
    <g>
      {dirs.map((d, i) => {
        const [x, y] = at(c, d, 12.5)
        const nx = -Math.sin(rad(d)) * 3
        const ny = Math.cos(rad(d)) * 3
        return (
          <g key={i}>
            <circle cx={x + nx} cy={y + ny} r={1.5} className="f35-e" />
            <circle cx={x - nx} cy={y - ny} r={1.5} className="f35-e" />
          </g>
        )
      })}
    </g>
  )
}

/** Circled formal charge. */
function Charge({ x, y, s }: { x: number; y: number; s: '+' | '−' }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} className={s === '+' ? 'f35-rs-qp' : 'f35-rs-qn'} />
      <text x={x} y={y + 4} textAnchor="middle" className="f35-rs-qt">
        {s}
      </text>
    </g>
  )
}

/** One Lewis structure of NO₃⁻ with the double bond to oxygen `dbl`. */
function Lewis({ cx, cy, dbl, R = 40 }: { cx: number; cy: number; dbl: number; R?: number }) {
  const N: Pt = [cx, cy]
  return (
    <g>
      {DIRS.map((d, i) => {
        const O = at(N, d, R)
        const double = i === dbl
        return (
          <g key={i}>
            <BondLine a={N} b={O} kind={double ? 2 : 1} />
            <text x={O[0]} y={O[1] + 6} textAnchor="middle" className="f35-rs-atom">
              O
            </text>
            <Pairs c={O} dirs={double ? [d + 60, d - 60] : [d, d + 90, d - 90]} />
            {!double && <Charge x={at(O, d === 30 ? d + 48 : d - 48, 21)[0]} y={at(O, d === 30 ? d + 48 : d - 48, 21)[1]} s="−" />}
          </g>
        )
      })}
      <text x={cx} y={cy + 6} textAnchor="middle" className="f35-rs-atom">
        N
      </text>
      <Charge x={at(N, -30, 16)[0]} y={at(N, -30, 16)[1]} s="+" />
    </g>
  )
}

/** The resonance hybrid: three equal partial double bonds, −⅔ on each oxygen. */
function HybridNO3({ cx, cy, R = 46 }: { cx: number; cy: number; R?: number }) {
  const N: Pt = [cx, cy]
  const top = cy - R - 40
  const bot = cy + R * 0.5 + 32
  const hw = R * 0.87 + 46
  return (
    <g>
      <g className="f35-rs-cloud">
        {DIRS.map((d, i) => {
          const O = at(N, d, R)
          return <ellipse key={i} cx={(N[0] + O[0]) / 2} cy={(N[1] + O[1]) / 2} rx={R / 2 + 6} ry={9} transform={`rotate(${d} ${(N[0] + O[0]) / 2} ${(N[1] + O[1]) / 2})`} />
        })}
      </g>
      {DIRS.map((d, i) => {
        const O = at(N, d, R)
        const q = at(O, d, 23)
        return (
          <g key={i}>
            <BondLine a={N} b={O} kind="part" />
            <text x={O[0]} y={O[1] + 6} textAnchor="middle" className="f35-rs-atom">
              O
            </text>
            <text x={q[0]} y={q[1] + 5} textAnchor="middle" className="f35-rs-frac">
              −⅔
            </text>
          </g>
        )
      })}
      <text x={cx} y={cy + 6} textAnchor="middle" className="f35-rs-atom">
        N
      </text>
      <Charge x={at(N, 90, 16)[0]} y={at(N, 90, 16)[1]} s="+" />
      {/* brackets with the overall charge */}
      <path d={`M${cx - hw + 8} ${top} H${cx - hw} V${bot} H${cx - hw + 8}`} className="f35-thin" />
      <path d={`M${cx + hw - 8} ${top} H${cx + hw} V${bot} H${cx + hw - 8}`} className="f35-thin" />
      <text x={cx + hw + 4} y={top + 10} className="f35-rs-atom" style={{ fontSize: 17 }}>
        −
      </text>
    </g>
  )
}

function DoubleArrow({ x, y, w = 30, d }: { x: number; y: number; w?: number; d: number }) {
  return <Arrow x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} both head={7} className="f35-arrow" delay={d} />
}

function Structures({ xs, cy, R, gap }: { xs: number[]; cy: number; R: number; gap: number }) {
  return (
    <g>
      {xs.map((x, i) => (
        <Pop key={i} d={0.2 + i * 0.3}>
          <Lewis cx={x} cy={cy} dbl={i} R={R} />
        </Pop>
      ))}
      {[0, 1].map((i) => (
        <DoubleArrow key={i} x={(xs[i] + xs[i + 1]) / 2} y={cy - 4} w={gap} d={0.5 + i * 0.3} />
      ))}
    </g>
  )
}

const NOTES = ['všechny tři vazby N–O jsou stejné', 'vazebný řád každé vazby = 1⅓', 'každý O nese −⅔ (N +1, celkem −1)']

function Wide() {
  return (
    <>
      <T x={290} y={24} className="f35-title">
        rezonanční struktury
      </T>
      <Structures xs={[112, 290, 468]} cy={98} R={42} gap={34} />
      <Fade d={1.2}>
        <T x={290} y={184} className="f35-t f35-small f35-muted f35-sec">
          liší se jen polohou dvojné vazby a elektronů; atomy zůstávají na místě
        </T>
      </Fade>
      <Arrow x1={290} y1={194} x2={256} y2={214} className="f35-arrow-lv" head={8} delay={1.3} />
      <Pop d={1.6}>
        <HybridNO3 cx={170} cy={318} />
      </Pop>
      <Fade d={1.5}>
        <T x={170} y={226} className="f35-title">
          rezonanční hybrid
        </T>
      </Fade>
      <Fade d={2}>
        {NOTES.map((n, i) => (
          <g key={i}>
            <circle cx={300} cy={284 + i * 30} r={3} className="f35-pointer" />
            <T x={312} y={289 + i * 30} anchor="start" className="f35-note">
              {n}
            </T>
          </g>
        ))}
      </Fade>
    </>
  )
}

function Narrow() {
  return (
    <>
      <T x={160} y={22} className="f35-title">
        rezonanční struktury
      </T>
      <Structures xs={[56, 160, 264]} cy={82} R={32} gap={18} />
      <Arrow x1={160} y1={150} x2={160} y2={178} className="f35-arrow-lv" head={8} delay={1.3} />
      <Fade d={1.5}>
        <T x={160} y={202} className="f35-title">
          rezonanční hybrid
        </T>
      </Fade>
      <Pop d={1.6}>
        <HybridNO3 cx={160} cy={296} />
      </Pop>
      <Fade d={2}>
        {NOTES.map((n, i) => (
          <T key={i} x={160} y={380 + i * 22} className="f35-note" size={15}>
            {n}
          </T>
        ))}
      </Fade>
    </>
  )
}

export default function Resonance() {
  return (
    <Figure
      level={3}
      label="Rezonance dusičnanového aniontu NO3−. Tři rezonanční struktury se liší jen tím, ke kterému kyslíku vede dvojná vazba; dusík má formální náboj +1 a oba jednoduše vázané kyslíky −1. Skutečná částice je rezonanční hybrid: všechny tři vazby N–O jsou stejné, mají vazebný řád 1⅓ (plná a čárkovaná čára) a záporný náboj je rozprostřen rovnoměrně po třech kyslících: každý nese −⅔, dusík +1, celkem −1."
      layouts={[
        { w: 580, h: 404, max: 680, when: 'wide', draw: () => <Wide /> },
        { w: 320, h: 440, max: 440, when: 'narrow', draw: () => <Narrow /> },
      ]}
    />
  )
}
