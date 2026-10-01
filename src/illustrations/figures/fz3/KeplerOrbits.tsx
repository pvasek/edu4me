import { Draw, Eq, Fade, Figure, Pop, Sym, Vec, f1, pat, useFig, useLive } from './kit'

const LABEL =
  'Keplerovy zákony. Planeta obíhá po elipse a Slunce leží v jejím ohnisku F₁; druhé ohnisko F₂ je prázdné. Průvodič planety opíše za stejnou dobu stejnou plochu: vyznačené výseče u perihélia a u afélia mají stejný obsah, přestože oblouk u Slunce je mnohem delší. Proto se planeta v perihéliu, nejblíže Slunci, pohybuje nejrychleji a v aféliu nejpomaleji. Třetí zákon: podíl T²/a³ je pro všechny planety stejný.'

const CX = 260
const CY = 160
const A = 160
const E = 0.55
const B = A * Math.sqrt(1 - E * E)
const F1: [number, number] = [CX - A * E, CY] // the Sun
const F2: [number, number] = [CX + A * E, CY]

/** Solve Kepler's equation M = E − e sin E. */
function ecc(M: number) {
  let x = M
  for (let i = 0; i < 30; i++) x -= (x - E * Math.sin(x) - M) / (1 - E * Math.cos(x))
  return x
}
/** Position at mean anomaly M (perihelion on the left, motion anticlockwise). */
function at(M: number): [number, number] {
  const x = ecc(M)
  return [F1[0] - A * (Math.cos(x) - E), CY + B * Math.sin(x)]
}

function sector(m0: number, m1: number) {
  const pts: string[] = []
  for (let i = 0; i <= 24; i++) {
    const [x, y] = at(m0 + ((m1 - m0) * i) / 24)
    pts.push(`${f1(x)} ${f1(y)}`)
  }
  return `M${f1(F1[0])} ${f1(F1[1])} L${pts.join(' L')}Z`
}

const DM = 0.52 // equal time slices
const N = 120
const SAMPLES = Array.from({ length: N + 1 }, (_, i) => at((2 * Math.PI * i) / N))
const LENS = SAMPLES.map((p, i) => (i ? Math.hypot(p[0] - SAMPLES[i - 1][0], p[1] - SAMPLES[i - 1][1]) : 0))
const CUM = LENS.reduce<number[]>((acc, l, i) => [...acc, (i ? acc[i - 1] : 0) + l], [])
const TOTAL = CUM[CUM.length - 1]

/** The planet: moves with Kepler timing (equal mean anomaly per time). */
function Planet() {
  const live = useLive()
  const path = 'M' + SAMPLES.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L')
  const keyPoints = CUM.map((c) => (c / TOTAL).toFixed(4)).join(';')
  const keyTimes = SAMPLES.map((_, i) => (i / N).toFixed(4)).join(';')
  const rest = at(Math.PI * 0.62)
  const body = <circle r={8} className="fz3-o fz3-planet" />
  if (!live) return <g transform={`translate(${f1(rest[0])} ${f1(rest[1])})`}>{body}</g>
  return (
    <g>
      <animateMotion path={path} dur="9s" repeatCount="indefinite" keyPoints={keyPoints} keyTimes={keyTimes} calcMode="linear" />
      {body}
    </g>
  )
}

export default function KeplerOrbits() {
  const orbit = `M${CX - A} ${CY} A${A} ${f1(B)} 0 1 0 ${CX + A} ${CY} A${A} ${f1(B)} 0 1 0 ${CX - A} ${CY}`
  const s1 = sector(-DM / 2, DM / 2)
  const s2 = sector(Math.PI - DM / 2, Math.PI + DM / 2)
  const peri = at(0)
  const aph = at(Math.PI)
  const vp = 64
  const va = (vp * (1 - E)) / (1 + E)
  const c1: [number, number] = [126, 150] // inside the perihelion slice
  const c2: [number, number] = [382, 161] // inside the aphelion slice
  return (
    <Figure level={9} w={520} h={344} max={640} label={LABEL}>
      <Sectors s1={s1} s2={s2} />
      <Draw d={orbit} className="fz3-orbit fz3-orbit-strong" delay={0} />
      <path d={`M${CX - A} ${CY} H${CX + A}`} className="fz3-o fz3-thin fz3-dash" style={{ opacity: 0.5 }} />
      {/* foci */}
      <circle cx={F1[0]} cy={F1[1]} r={24} className="fz3-sun-halo" />
      <circle cx={F1[0]} cy={F1[1]} r={16} className="fz3-sun" />
      <path d={`M${F2[0] - 5} ${CY - 5} L${F2[0] + 5} ${CY + 5} M${F2[0] + 5} ${CY - 5} L${F2[0] - 5} ${CY + 5}`} className="fz3-o" />
      <Fade delay={0.5}>
        <text x={F1[0] - 6} y={CY + 50} className="fz3-lbl fz3-b">
          Slunce
        </text>
        <text x={F1[0] - 6} y={CY + 68} className="fz3-lbl fz3-sm">
          v ohnisku <tspan className="fz3-it">F</tspan>₁
        </text>
        <Sym x={F2[0]} y={CY + 34} t="F_{2}" />
        <text x={peri[0] - 10} y={CY + 5} textAnchor="end" className="fz3-lbl fz3-b">
          perihélium
        </text>
        <text x={aph[0] + 10} y={CY + 5} className="fz3-lbl fz3-b">
          afélium
        </text>
      </Fade>
      {/* speeds: fastest at perihelion, slowest at aphelion */}
      <Vec a={peri} b={[peri[0], peri[1] + vp]} tone="lvl" t="v_{max}" at={[peri[0] - 12, peri[1] + vp - 4]} anchor="end" delay={0.9} />
      <Vec a={aph} b={[aph[0], aph[1] - va]} tone="lvl" t="v_{min}" at={[aph[0] + 10, aph[1] - va - 6]} anchor="start" delay={1} />
      {/* equal areas */}
      <Fade delay={1}>
        <text x={CX} y={20} textAnchor="middle" className="fz3-lbl fz3-b fz3-lvl-t">
          stejné plochy za stejný čas
        </text>
        <line x1={CX - 70} y1={28} x2={c1[0]} y2={c1[1]} className="fz3-lead" />
        <circle cx={c1[0]} cy={c1[1]} r={2.5} className="fz3-dot" />
        <line x1={CX + 70} y1={28} x2={c2[0]} y2={c2[1]} className="fz3-lead" />
        <circle cx={c2[0]} cy={c2[1]} r={2.5} className="fz3-dot" />
      </Fade>
      <Planet />
      {/* semi-major axis */}
      <Fade delay={0.7}>
        <path d={`M${CX} ${CY + B + 12} v8 H${CX + A} v-8`} className="fz3-o fz3-thin" />
        <Sym x={CX + A / 2} y={CY + B + 40} t="a" />
      </Fade>
      <Pop delay={1.2}>
        <rect x={10} y={300} width={154} height={36} rx={6} className="fz3-tag-lvl" />
        <Eq x={87} y={324} t="T^{2} / a^{3} = konst." anchor="middle" />
      </Pop>
    </Figure>
  )
}

function Sectors({ s1, s2 }: { s1: string; s2: string }) {
  const { id } = useFig()
  return (
    <Fade delay={0.6}>
      {[s1, s2].map((d, i) => (
        <g key={i}>
          <path d={d} className="fz3-sector" />
          <path d={d} fill={pat(id, 'd')} opacity={0.6} />
          <path d={d} className="fz3-o fz3-thin" />
        </g>
      ))}
    </Fade>
  )
}
