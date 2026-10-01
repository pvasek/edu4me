import { Draw, Fade, Figure, Sym, f1, pat, useFig, useLive } from './kit'

const LABEL =
  'Stojaté vlnění na struně upevněné na obou koncích. Na struně délky L vzniknou jen takové stojaté vlny, u nichž se na délku struny vejde celistvý počet půlvln: L = n·λ/2. První harmonická (základní tón, n = 1) má vlnovou délku λ₁ = 2L a jednu kmitnu uprostřed; druhá harmonická má λ₂ = L a frekvenci 2f₁; třetí harmonická má λ₃ = 2L/3 a frekvenci 3f₁. Uzly (U) jsou body, které nekmitají, kmitny (K) jsou místa největší výchylky; sousední uzly jsou od sebe λ/2.'

const X0 = 60
const X1 = 380
const LEN = X1 - X0
const AMP = 30
const ROWS = [
  { n: 1, y: 96, t: 'λ_{1} = 2L', f: 'f_{1} – základní tón' },
  { n: 2, y: 214, t: 'λ_{2} = L', f: 'f_{2} = 2f_{1}' },
  { n: 3, y: 332, t: 'λ_{3} = 2L/3', f: 'f_{3} = 3f_{1}' },
]

function shape(n: number, y: number, s: number) {
  const pts: string[] = []
  for (let i = 0; i <= 64; i++) {
    const x = X0 + (LEN * i) / 64
    pts.push(`${f1(x)} ${f1(y - s * AMP * Math.sin((n * Math.PI * (x - X0)) / LEN))}`)
  }
  return 'M' + pts.join(' L')
}

function Clamp({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x - (x < 200 ? 12 : 0)} y={y - 22} width={12} height={44} className="fz3-o fz3-fill2" />
      <rect x={x - (x < 200 ? 12 : 0)} y={y - 22} width={12} height={44} fill={pat(id, 'd')} />
    </g>
  )
}

function Row({ n, y, t, f, i }: { n: number; y: number; t: string; f: string; i: number }) {
  const live = useLive()
  const p1 = shape(n, y, 1)
  const p0 = shape(n, y, 0)
  const m1 = shape(n, y, -1)
  const nodes = Array.from({ length: n + 1 }, (_, k) => X0 + (LEN * k) / n)
  const anti = Array.from({ length: n }, (_, k) => X0 + (LEN * (k + 0.5)) / n)
  return (
    <g>
      <Fade delay={0.1 + i * 0.15}>
        <text x={20} y={y - 46} className="fz3-lbl fz3-b">
          {n}. harmonická
        </text>
        <Sym x={180} y={y - 46} t={t} anchor="start" tone="lvl" />
        <Sym x={400} y={y - 46} t={f} anchor="end" className="fz3-sym-sm" />
      </Fade>
      <path d={`M${X0} ${y} H${X1}`} className="fz3-o fz3-thin fz3-dot2" />
      {/* envelope */}
      <Draw d={p1} className="fz3-envelope" delay={0.2 + i * 0.15} />
      <Draw d={m1} className="fz3-envelope" delay={0.2 + i * 0.15} />
      {/* the string itself */}
      <path d={p1} className="fz3-string-v">
        {live && (
          <animate
            attributeName="d"
            values={`${p1};${p0};${m1};${p0};${p1}`}
            dur={`${1.6 / n}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.25;0.5;0.75;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
      <Clamp x={X0} y={y} />
      <Clamp x={X1} y={y} />
      <Fade delay={0.6 + i * 0.15}>
        {nodes.map((x) => (
          <g key={x}>
            <circle cx={x} cy={y} r={4} className="fz3-nodept" />
            {x > X0 && x < X1 && (
              <text x={x} y={y + 22} textAnchor="middle" className="fz3-lbl fz3-b fz3-sm">
                U
              </text>
            )}
          </g>
        ))}
        {anti.map((x) => (
          <g key={x}>
            <circle cx={x} cy={y - AMP} r={3.5} className="fz3-antipt" />
            <text x={x} y={y + AMP + 18} textAnchor="middle" className="fz3-lbl fz3-b fz3-sm fz3-lvl-t">
              K
            </text>
          </g>
        ))}
      </Fade>
    </g>
  )
}

export default function StandingWaves() {
  return (
    <Figure level={9} w={420} h={456} max={560} label={LABEL}>
      {ROWS.map((r, i) => (
        <Row key={r.n} {...r} i={i} />
      ))}
      <Fade delay={0.8}>
        <path d={`M${X0} 394 v8 H${X1} v-8`} className="fz3-o fz3-thin" />
        <Sym x={(X0 + X1) / 2} y={422} t="L" />
        <text x={20} y={446} className="fz3-lbl fz3-sm">
          U = uzel (nekmitá)
        </text>
        <text x={400} y={446} textAnchor="end" className="fz3-lbl fz3-sm fz3-lvl-t">
          K = kmitna (největší výchylka)
        </text>
      </Fade>
    </Figure>
  )
}
