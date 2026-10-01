import { Angle, Draw, Eq, Fade, Figure, Pop, Sym, Vec, f1, pat, useClock, useFig } from './kit'

const LABEL =
  'Šikmý vrh. Těleso vržené počáteční rychlostí v₀ pod úhlem α nad vodorovnou rovinou letí po parabole. Rychlost je vždy tečná k trajektorii a skládá se z vodorovné složky vₓ, která je po celou dobu letu stejná, a svislé složky v_y, která se tíhovým zrychlením zmenšuje, v nejvyšším bodě je nulová a pak roste směrem dolů. Vyznačena je maximální výška h_max a délka vrhu d. Platí x = v₀·t·cos α, y = v₀·t·sin α − ½·g·t², h_max = v₀²·sin²α / (2g) a d = v₀²·sin 2α / g.'

// motion in px units: origin O, g in px/s², velocity arrows drawn k seconds long
const O: [number, number] = [40, 162]
const ALPHA = (55 * Math.PI) / 180
const G = 100
const RANGE = 340
const V0 = Math.sqrt((RANGE * G) / Math.sin(2 * ALPHA))
const VX = V0 * Math.cos(ALPHA)
const VY = V0 * Math.sin(ALPHA)
const T = (2 * VY) / G
const HMAX = (VY * VY) / (2 * G)
const K = 0.34

const pos = (t: number): [number, number] => [O[0] + VX * t, O[1] - (VY * t - 0.5 * G * t * t)]
const vel = (t: number): [number, number] => [VX, VY - G * t] // physics: y up

function path() {
  const pts: string[] = []
  for (let i = 0; i <= 60; i++) {
    const [x, y] = pos((T * i) / 60)
    pts.push(`${f1(x)} ${f1(y)}`)
  }
  return 'M' + pts.join(' L')
}

/** Velocity at time t: resultant v (tangent), with its components v_x and v_y. */
function Velocity({ t, labels, delay, vAt }: { t: number; labels?: [string, string, string]; delay: number; vAt?: [number, number] }) {
  const [x, y] = pos(t)
  const [vx, vy] = vel(t)
  const tip: [number, number] = [x + vx * K, y - vy * K]
  const hasY = Math.abs(vy) > 1
  return (
    <g>
      <Vec a={[x, y]} b={[x + vx * K, y]} tone="blue" wide={false} delay={delay} t={labels?.[1]} at={[x + vx * K + 16, y + 6]} />
      {hasY && (
        <Vec a={[x, y]} b={[x, y - vy * K]} tone="acc" wide={false} delay={delay} t={labels?.[2]} at={[x - 14, y - vy * K + (vy > 0 ? 8 : 4)]} />
      )}
      {hasY && (
        <Fade delay={delay + 0.3}>
          <path d={`M${f1(x + vx * K)} ${f1(y)} V${f1(tip[1])} M${f1(x)} ${f1(tip[1])} H${f1(tip[0])}`} className="fz3-o fz3-thin fz3-dot2" />
        </Fade>
      )}
      {hasY && (
        <Vec
          a={[x, y]}
          b={tip}
          tone="lvl"
          delay={delay + 0.1}
          t={labels?.[0]}
          at={vAt ? [x + vAt[0], y + vAt[1]] : [tip[0] + 10, tip[1] + (vy > 0 ? 2 : 12)]}
          anchor={vAt ? 'end' : 'start'}
        />
      )}
    </g>
  )
}

function Ball() {
  const t = useClock(2.3)
  const u = Math.min(1, Math.max(0, (t - 0.4) / 1.7))
  const [x, y] = pos(u * T)
  return <circle cx={f1(x)} cy={f1(y)} r={7} className="fz3-o fz3-ball" />
}

export default function ProjectileMotion() {
  const top = pos(T / 2)
  return (
    <Figure level={8} w={440} h={280} max={580} replay label={LABEL}>
      <Ground />
      <Draw d={path()} className="fz3-traj" delay={0.1} />
      {/* maximum height and range */}
      <Fade delay={0.9}>
        <path d={`M${f1(top[0])} ${f1(top[1])} V${O[1]}`} className="fz3-o fz3-thin fz3-dash" />
        <Sym x={top[0] - 8} y={O[1] - HMAX / 2 + 12} t="h_{max}" anchor="end" />
      </Fade>
      <RangeArrow />
      <Angle c={O} a1={-55} a2={0} r={30} text="α" tr={44} className="fz3-ang-sym" />
      <Velocity t={0} labels={['v_{0}', 'v_{x}', 'v_{y}']} delay={0.8} />
      <Velocity t={T * 0.24} delay={1} />
      <Velocity t={T / 2} labels={['', 'v_{x}', '']} delay={1.15} />
      <Velocity t={T * 0.76} delay={1.3} />
      <Velocity t={T * 0.88} labels={['v', '', '']} delay={1.45} vAt={[14, 34]} />
      <Ball />
      <Pop delay={1.2}>
        <rect x={60} y={214} width={320} height={60} rx={6} className="fz3-tag" />
        <Eq x={220} y={237} t="h_{max} = v_{0}^{2} · sin^{2} α / (2g)" anchor="middle" />
        <Eq x={220} y={261} t="d = v_{0}^{2} · sin 2α / g" anchor="middle" />
      </Pop>
    </Figure>
  )
}

function useFigId() {
  return useFig().id
}

function RangeArrow() {
  const id = useFigId()
  return (
    <Fade delay={1}>
      <path
        d={`M${O[0] + 4} ${O[1] + 16} H${O[0] + RANGE - 4}`}
        className="fz3-arr fz3-arr-ink"
        markerEnd={`url(#${id}-ah-ink)`}
        markerStart={`url(#${id}-ah-ink)`}
      />
      <Sym x={O[0] + RANGE / 2} y={O[1] + 36} t="d" />
    </Fade>
  )
}

function Ground() {
  const { id } = useFig()
  return (
    <g>
      <path d={`M16 ${O[1]} H424`} className="fz3-o" />
      <rect x={16} y={O[1]} width={408} height={8} fill={pat(id, 'd')} />
    </g>
  )
}
