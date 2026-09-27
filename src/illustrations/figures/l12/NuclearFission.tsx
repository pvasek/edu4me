import { Md } from '../../../core/markup'
import { ChemText } from '../../../diagrams/util'
import { Arrow, Draw, Fade, Lbl, Plate, Pop, rng } from './kit'

type Kind = 'u' | 'ba' | 'kr' | 'frag'

/** A nucleus: tinted ball with packed nucleons and its symbol (mass number as a prescript). */
function Nucleus({ x, y, r, kind, text, seed = 1 }: { x: number; y: number; r: number; kind: Kind; text?: string; seed?: number }) {
  const rnd = rng(seed)
  const dots: [number, number, boolean][] = []
  const g = r > 18 ? 7 : 6
  for (let yy = -r; yy <= r; yy += g * 0.87)
    for (let xx = -r + ((Math.round((yy + r) / (g * 0.87)) % 2) * g) / 2; xx <= r; xx += g)
      if (Math.hypot(xx, yy) < r - g * 0.45) dots.push([x + xx, y + yy, rnd() < 0.42])
  return (
    <g>
      <circle className={`f12-fis-n f12-fis-${kind}`} cx={x} cy={y} r={r} />
      {dots.map(([dx, dy, p], i) => (
        <circle key={i} className={p ? 'f12-fis-p' : 'f12-fis-nn'} cx={dx} cy={dy} r={g * 0.5} />
      ))}
      <circle className="f12-fis-ring" cx={x} cy={y} r={r} />
      <path className="f12-shine" d={`M${x - r * 0.68} ${y - r * 0.18} A${r * 0.7} ${r * 0.7} 0 0 1 ${x - r * 0.18} ${y - r * 0.68}`} />
      {text && (
        <text className="f12-fis-sym" x={x} y={y + 6} textAnchor="middle">
          <ChemText text={text} />
        </text>
      )}
    </g>
  )
}

function Neutron({ x, y, r = 6.5 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle className="f12-neutron" cx={x} cy={y} r={r} />
      <path className="f12-shine" d={`M${x - r * 0.6} ${y - r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.15} ${y - r * 0.6}`} opacity={0.7} />
    </g>
  )
}

/** Energy flash: short rays around a point. */
function Burst({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const a = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <g className="f12-fis-burst">
      <circle cx={x} cy={y} r={r * 0.42} />
      {a.map((d, i) => {
        const t = (d * Math.PI) / 180
        const l = i % 2 ? r : r * 1.3
        return <path key={d} d={`M${x + Math.cos(t) * r * 0.6} ${y + Math.sin(t) * r * 0.6} L${x + Math.cos(t) * l} ${y + Math.sin(t) * l}`} />
      })}
    </g>
  )
}

/** One fission of generation 2: U-235 hit from the left, splits, sends 3 neutrons to the right. */
function Fission2({ cx, cy, i }: { cx: number; cy: number; i: number }) {
  const d = 2.4 + i * 0.25
  return (
    <g>
      <Pop delay={d - 0.9}>
        <Nucleus x={cx} y={cy} r={20} kind="u" seed={10 + i} />
      </Pop>
      <Pop delay={d}>
        <Burst x={cx + 28} y={cy} r={11} />
      </Pop>
      <Pop delay={d + 0.15}>
        <Nucleus x={cx + 52} y={cy - 26} r={12} kind="ba" seed={20 + i} />
        <Nucleus x={cx + 50} y={cy + 26} r={10} kind="kr" seed={30 + i} />
      </Pop>
      {[-30, 0, 30].map((dy, k) => (
        <g key={k}>
          <Arrow x1={cx + 42} y1={cy + dy * 0.2} x2={cx + 108} y2={cy + dy} head={7} className="f12-arrow f12-fis-arr" delay={d + 0.3 + k * 0.08} />
          <Pop delay={d + 0.8 + k * 0.08}>
            <Neutron x={cx + 118} y={cy + dy} r={5.5} />
          </Pop>
        </g>
      ))}
    </g>
  )
}

const G1 = [100, 210, 320]

function Body() {
  return (
    <>
      {/* incoming neutron */}
      <Pop delay={0.1}>
        <Neutron x={24} y={210} />
      </Pop>
      <Arrow x1={34} y1={210} x2={80} y2={210} className="f12-arrow f12-fis-arr" delay={0.2} />
      <Lbl x={4} y={180} delay={0.1} className="f12-lab-strong">
        neutron
      </Lbl>

      {/* the first fission */}
      <Pop delay={0.3}>
        <Nucleus x={114} y={210} r={30} kind="u" text="^{235}U" seed={3} />
      </Pop>
      <Pop delay={0.9}>
        <Burst x={160} y={210} r={16} />
      </Pop>
      <Pop delay={1.05}>
        <Nucleus x={212} y={136} r={24} kind="ba" text="^{141}Ba" seed={4} />
      </Pop>
      <Pop delay={1.15}>
        <Nucleus x={206} y={286} r={21} kind="kr" text="^{92}Kr" seed={5} />
      </Pop>
      <Pop delay={1.25}>
        <Neutron x={232} y={188} />
        <Neutron x={246} y={210} />
        <Neutron x={232} y={232} />
      </Pop>
      <Lbl x={100} y={156} tx={156} ty={196} anchor="middle" delay={1}>
        + energie
      </Lbl>
      <Lbl x={126} y={276} tx={150} ty={224} anchor="middle" className="f12-lab-strong" delay={1.1}>
        štěpení
      </Lbl>
      <Lbl x={206} y={336} anchor="middle" delay={1.3} sec>
        úlomky jádra
      </Lbl>

      {/* neutrons of generation 1 hit three more U-235 */}
      <Arrow x1={240} y1={182} x2={332} y2={108} className="f12-arrow f12-fis-arr" delay={1.5} />
      <Arrow x1={256} y1={210} x2={332} y2={210} className="f12-arrow f12-fis-arr" delay={1.6} />
      <Arrow x1={240} y1={238} x2={332} y2={312} className="f12-arrow f12-fis-arr" delay={1.7} />
      {G1.map((y, i) => (
        <Fission2 key={y} cx={356} cy={y} i={i} />
      ))}
      <Fade delay={3.8}>
        {G1.map((y) => (
          <text key={y} className="f12-fis-more" x={500} y={y + 8}>
            …
          </text>
        ))}
      </Fade>

      {/* chain reaction bracket */}
      <Draw d="M322 44 V36 H528 V44" className="f12-thin" delay={2.2} dur={0.6} />
      <Lbl x={425} y={26} anchor="middle" className="f12-lab-strong" delay={2.4}>
        řetězová reakce
      </Lbl>
      <Lbl x={425} y={396} anchor="middle" delay={3.4} sec>
        3 neutrony → 3 štěpení → 9 neutronů …
      </Lbl>
    </>
  )
}

export default function NuclearFission() {
  return (
    <Plate
      level={2}
      w={540}
      h={410}
      max={620}
      label="Štěpení uranu a řetězová reakce. Neutron narazí do jádra uranu-235, které se rozštěpí na baryum-141 a krypton-92, uvolní tři nové neutrony a velké množství energie. Každý z těch tří neutronů zasáhne další jádro uranu-235, to se také rozštěpí a uvolní další tři neutrony. Počet štěpení tak s každou generací roste: 1, 3, 9 … to je řetězová reakce."
      after={
        <p className="f12-fis-eq">
          <Md text="$n$ + $^{235}U$ → $^{141}Ba$ + $^{92}Kr$ + 3 $n$ + energie" />
        </p>
      }
    >
      <Body />
    </Plate>
  )
}
