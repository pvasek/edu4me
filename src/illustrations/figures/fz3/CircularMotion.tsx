import { Draw, Eq, Fade, Figure, Pop, Sym, Vec, f1, useClock } from './kit'

const LABEL =
  'Rovnoměrný pohyb po kružnici. Těleso na provázku obíhá kolem středu S po kružnici o poloměru r proti směru hodinových ručiček. Rychlost v má v každém bodě směr tečny ke kružnici, dostředivá síla F_d a dostředivé zrychlení a_d míří do středu kružnice. Když se provázek přetrhne, dostředivá síla zmizí a těleso letí dál rovnoměrně přímočaře po tečně. Platí v = 2πr/T, a_d = v²/r a F_d = m·v²/r.'

const C: [number, number] = [210, 158]
const R = 100
const BREAK = 125 // deg, where the string breaks
const KV = 0.55 // arrow length per unit speed (px)
const V = 110 // drawn speed

const at = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [C[0] + R * Math.cos(a), C[1] - R * Math.sin(a)]
}
/** unit tangent for anticlockwise motion (screen coordinates) */
const tan = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [-Math.sin(a), -Math.cos(a)]
}

const q = (deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${f1(C[0] + (R + 18) * Math.cos(a))} ${f1(C[1] - (R + 18) * Math.sin(a))}`
}

function Snapshot({ deg, delay, lv, lf, la }: { deg: number; delay: number; lv: [number, number]; lf: [number, number]; la?: [number, number] }) {
  const p = at(deg)
  const t = tan(deg)
  const toC: [number, number] = [(C[0] - p[0]) / R, (C[1] - p[1]) / R]
  return (
    <g>
      <path d={`M${C[0]} ${C[1]} L${f1(p[0])} ${f1(p[1])}`} className="fz3-string" />
      <circle cx={p[0]} cy={p[1]} r={8} className="fz3-o fz3-fill2" />
      <Vec a={p} b={[p[0] + t[0] * V * KV, p[1] + t[1] * V * KV]} tone="lvl" t="v" at={[p[0] + lv[0], p[1] + lv[1]]} delay={delay} />
      <Vec a={p} b={[p[0] + toC[0] * 44, p[1] + toC[1] * 44]} tone="red" t="F_{d}" at={[p[0] + lf[0], p[1] + lf[1]]} delay={delay + 0.15} />
      {la && (
        <Fade delay={delay + 0.4}>
          <Sym x={p[0] + la[0]} y={p[1] + la[1]} t="a_{d}" tone="red" className="fz3-sym-sm" />
        </Fade>
      )}
    </g>
  )
}

function Ball() {
  const t = useClock(2.3)
  const turn = 1.55 // s on the circle
  let x: number
  let y: number
  if (t <= turn) {
    const deg = BREAK - 330 * (1 - t / turn)
    ;[x, y] = at(deg)
  } else {
    const p = at(BREAK)
    const d = tan(BREAK)
    const s = Math.min(1, (t - turn) / 0.6) * 150
    x = p[0] + d[0] * s
    y = p[1] + d[1] * s
  }
  return <circle cx={f1(x)} cy={f1(y)} r={9} className="fz3-o fz3-ball" />
}

export default function CircularMotion() {
  const pb = at(BREAK)
  const tb = tan(BREAK)
  const far: [number, number] = [pb[0] + tb[0] * 170, pb[1] + tb[1] * 170]
  return (
    <Figure level={8} w={420} h={352} max={560} replay label={LABEL}>
      <Draw
        d={`M${C[0] - R} ${C[1]} A${R} ${R} 0 1 0 ${C[0] + R} ${C[1]} A${R} ${R} 0 1 0 ${C[0] - R} ${C[1]}`}
        className="fz3-orbit fz3-orbit-strong"
      />
      <circle cx={C[0]} cy={C[1]} r={3.5} className="fz3-dot" />
      <Sym x={C[0] + 10} y={C[1] + 20} t="S" />
      {/* radius */}
      <Fade delay={0.3}>
        <path d={`M${C[0]} ${C[1]} L${f1(at(-30)[0])} ${f1(at(-30)[1])}`} className="fz3-o fz3-thin fz3-dash" />
        <Sym x={C[0] + 50} y={C[1] + 44} t="r" />
      </Fade>
      {/* the string breaks: the body flies on along the tangent */}
      <Fade delay={1.6}>
        <path d={`M${f1(pb[0])} ${f1(pb[1])} L${f1(far[0])} ${f1(far[1])}`} className="fz3-o fz3-dash" />
        {/* the torn string */}
        <path
          d={`M${C[0]} ${C[1]} L${f1(C[0] + (pb[0] - C[0]) * 0.45)} ${f1(C[1] + (pb[1] - C[1]) * 0.45)} l4 -7 M${f1(C[0] + (pb[0] - C[0]) * 0.6)} ${f1(C[1] + (pb[1] - C[1]) * 0.6)} l-3 6`}
          className="fz3-string"
        />
        {[0.35, 0.65].map((f) => (
          <circle key={f} cx={pb[0] + tb[0] * 170 * f} cy={pb[1] + tb[1] * 170 * f} r={8} className="fz3-o fz3-ghost" />
        ))}
        <text x={14} y={40} className="fz3-lbl fz3-b">
          provázek se přetrhne:
        </text>
        <text x={14} y={58} className="fz3-lbl fz3-sm">
          těleso letí po tečně
        </text>
      </Fade>
      <Snapshot deg={20} delay={0.6} lv={[-2, -60]} lf={[-26, -6]} la={[-26, 32]} />
      <Snapshot deg={-90} delay={0.8} lv={[76, 6]} lf={[18, -30]} />
      <Ball />
      {/* direction of motion */}
      <Draw d={`M${q(52)} A${R + 18} ${R + 18} 0 0 0 ${q(92)}`} className="fz3-arr fz3-arr-muted" arrow="muted" delay={0.9} />

      <Pop delay={1.2}>
        <rect x={40} y={288} width={340} height={56} rx={6} className="fz3-tag" />
        <Eq x={140} y={311} t="v = 2πr / T" anchor="middle" />
        <Eq x={290} y={311} t="a_{d} = v^{2} / r" anchor="middle" />
        <Eq x={210} y={335} t="F_{d} = m · a_{d} = m · v^{2} / r" anchor="middle" />
      </Pop>
    </Figure>
  )
}
