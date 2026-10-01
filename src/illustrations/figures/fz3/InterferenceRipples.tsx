import { useId } from 'react'
import { Draw, Fade, Figure, Sym, f1, pat, useFig, useLive } from './kit'

const LABEL =
  'Interference vlnění na vodní hladině. Dva zdroje Z₁ a Z₂ kmitají souhlasně a vysílají kruhové vlny s vlnovou délkou λ. Kde se potkají dva hřbety, vlnění se zesiluje: to nastává v bodech, jejichž dráhový rozdíl Δd = r₁ − r₂ je celistvým násobkem vlnové délky, Δd = k·λ. Tyto body leží na hyperbolách, na obrázku plné čáry, prostřední je osa mezi zdroji. Mezi nimi leží čárkované čáry zeslabení, kde se potká hřbet s důlem a Δd = (2k + 1)·λ/2. Bod P leží na první čáře zesílení, jeho dráhový rozdíl je právě jedna vlnová délka.'

const CX = 210
const SY = 292 // sources on the lower edge of the tank
const D = 60 // source separation
const LAMBDA = 24
const S1: [number, number] = [CX - D / 2, SY]
const S2: [number, number] = [CX + D / 2, SY]
const TOP = 12

/** One branch of the hyperbola |r1 − r2| = delta (right branch when sign = 1: closer to S2). */
function hyperbola(delta: number, sign: 1 | -1) {
  const c = D / 2
  const a = delta / 2
  if (a === 0) return `M${CX} ${SY} V${TOP}`
  const b = Math.sqrt(c * c - a * a)
  const tEnd = Math.asinh((SY - TOP) / b)
  const pts: string[] = []
  for (let i = 0; i <= 60; i++) {
    const t = (tEnd * i) / 60
    pts.push(`${f1(CX + sign * a * Math.cosh(t))} ${f1(SY - b * Math.sinh(t))}`)
  }
  return 'M' + pts.join(' L')
}

function Ripples({ clip }: { clip: string }) {
  const live = useLive()
  const n = 16
  return (
    <g clipPath={`url(#${clip})`}>
      {[S1, S2].map(([x, y], s) =>
        Array.from({ length: n }, (_, i) => (
          <circle key={`${s}-${i}`} cx={x} cy={y} r={(i + 1) * LAMBDA} className="fz3-wave-crest fz3-ripple">
            {live && <animate attributeName="r" values={`${i * LAMBDA};${(i + 1) * LAMBDA}`} dur="1.4s" repeatCount="indefinite" />}
          </circle>
        )),
      )}
    </g>
  )
}

export default function InterferenceRipples() {
  const clip = 'fz3r' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const anti = [0, 1, 2]
  const nodes = [0.5, 1.5]
  // P on the first antinodal line (Δd = λ), right branch
  const a = LAMBDA / 2
  const b = Math.sqrt((D / 2) ** 2 - a * a)
  const tP = Math.asinh((SY - 150) / b)
  const P: [number, number] = [CX + a * Math.cosh(tP), 150]
  return (
    <Figure level={9} w={420} h={384} max={560} label={LABEL}>
      <defs>
        <clipPath id={clip}>
          <rect x={10} y={TOP} width={400} height={SY - TOP} />
        </clipPath>
      </defs>
      <Tank />
      <Ripples clip={clip} />
      {/* constructive (solid) and destructive (dashed) lines */}
      <g clipPath={`url(#${clip})`}>
        {anti.flatMap((k) =>
          (k === 0 ? [1] : [1, -1]).map((sg) => (
            <Draw key={`a${k}${sg}`} d={hyperbola(k * LAMBDA, sg as 1 | -1)} className="fz3-anti" delay={0.3 + k * 0.15} />
          )),
        )}
        {nodes.flatMap((k) =>
          [1, -1].map((sg) => (
            <Fade key={`n${k}${sg}`} delay={0.9}>
              <path d={hyperbola(k * LAMBDA, sg as 1 | -1)} className="fz3-node" />
            </Fade>
          )),
        )}
      </g>
      {/* path difference to P */}
      <Fade delay={1.2}>
        <path d={`M${S1[0]} ${S1[1]} L${f1(P[0])} ${P[1]} L${S2[0]} ${S2[1]}`} className="fz3-o fz3-pathline" />
        <circle cx={P[0]} cy={P[1]} r={4.5} className="fz3-o fz3-fill" />
        <Sym x={P[0] + 12} y={P[1] - 4} t="P" anchor="start" />
        <Sym x={(S1[0] + P[0]) / 2 - 14} y={(S1[1] + P[1]) / 2} t="r_{1}" anchor="end" />
        <Sym x={(S2[0] + P[0]) / 2 + 12} y={(S2[1] + P[1]) / 2 + 8} t="r_{2}" anchor="start" />
      </Fade>
      {[S1, S2].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} className="fz3-o fz3-source" />
          <Sym x={x + (i ? 10 : -10)} y={y + 22} t={`Z_{${i + 1}}`} anchor={i ? 'start' : 'end'} />
        </g>
      ))}
      {/* legend */}
      <Fade delay={1}>
        <path d="M24 336 H56" className="fz3-anti" />
        <text x={64} y={341} className="fz3-lbl fz3-b">
          zesílení:
        </text>
        <text x={158} y={341} className="fz3-eq">
          Δd = k · λ
        </text>
        <path d="M24 366 H56" className="fz3-node" />
        <text x={64} y={371} className="fz3-lbl fz3-b">
          zeslabení:
        </text>
        <text x={158} y={371} className="fz3-eq">
          Δd = (2k + 1) · λ / 2
        </text>
        <text x={404} y={341} textAnchor="end" className="fz3-eq">
          v bodě P: Δd = λ
        </text>
      </Fade>
    </Figure>
  )
}

function Tank() {
  const { id } = useFig()
  return (
    <g>
      <rect x={10} y={TOP} width={400} height={SY - TOP} rx={4} className="fz3-tank" />
      <rect x={10} y={TOP} width={400} height={SY - TOP} rx={4} fill={pat(id, 'h')} opacity={0.35} />
      <rect x={10} y={TOP} width={400} height={SY - TOP} rx={4} className="fz3-o fz3-thin" />
    </g>
  )
}
