import { ChemText, DrawArrow, Eq, Fade, Figure, Flame, Pop, Travel, pat, useCompact, useFig } from './kit'
import { Badge, StepList } from './flow'

const C = [250, 262] as const
const R = 150
const NR = 40
const pt = (deg: number, r = R): [number, number] => [C[0] + Math.cos((deg * Math.PI) / 180) * r, C[1] + Math.sin((deg * Math.PI) / 180) * r]
const f = (p: [number, number]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

const NODES = [
  { a: -90, t: 'CaCO_{3}', name: 'vápenec', dx: 0, dy: -54 },
  { a: 0, t: 'CaO', name: 'pálené vápno', dx: 0, dy: 62 },
  { a: 90, t: 'Ca(OH)_{2}', name: 'hašené vápno', dx: 0, dy: 64 },
  { a: 180, t: 'malta', name: 'malta, vápenná voda', dx: 0, dy: 62 },
]

const STEPS = [
  { eq: 'CaCO_{3} → CaO + CO_{2}', note: 'pálení vápna, asi 900 °C (endotermní)' },
  { eq: 'CaO + H_{2}O → Ca(OH)_{2}', note: 'hašení (silně exotermní, voda se vaří)' },
  { eq: 'Ca(OH)_{2} + písek + voda', note: 'malta; ve vodě vápenná voda' },
  { eq: 'Ca(OH)_{2} + CO_{2} → CaCO_{3} + H_{2}O', note: 'tuhnutí: CO_{2} ze vzduchu' },
]

function Kiln() {
  const { id } = useFig()
  const body = 'M212 330 L226 206 H274 L288 330Z'
  return (
    <g>
      <path d={body} className="f67-fill3" />
      <path d={body} fill={pat(id, 'brick')} />
      <path d={body} className="f67-o" />
      <path d="M222 206 H278 V196 H222Z" className="f67-o f67-fill2" />
      <path d="M236 330 V310 Q250 292 264 310 V330Z" fill="#2b2320" className="f67-o" />
      <Flame x={250} y={330} h={22} w={8} />
      <g className="f67-drift">
        <path d="M244 190 q-8 -10 0 -18 q8 -8 0 -18 M258 188 q8 -10 0 -18 q-8 -8 0 -16" className="f67-o f67-thin" style={{ opacity: 0.6 }} />
      </g>
    </g>
  )
}

export default function LimestoneCycle() {
  const compact = useCompact()
  const n = compact.narrow
  const gap = 19 // degrees kept free around each node
  const arcs = [0, 1, 2, 3].map((i) => {
    const a0 = NODES[i].a + gap
    const a1 = NODES[i].a + 90 - gap
    return `M${f(pt(a0))} A${R} ${R} 0 0 1 ${f(pt(a1))}`
  })
  const circle = `M${f(pt(-90))} A${R} ${R} 0 1 1 ${f(pt(89.9))} A${R} ${R} 0 1 1 ${f(pt(-90))}`
  return (
    <Figure
      level={7}
      w={n ? 400 : 500}
      x0={n ? 50 : 0}
      h={n ? 670 : 500}
      max={620}
      compact={compact}
      boost={false}
      label="Vápencový cyklus jako kruh. Vápenec CaCO3 se ve vápence pálí při asi 900 °C na pálené vápno CaO a uniká CO2. Pálené vápno se hasí vodou na hašené vápno Ca(OH)2, děj je silně exotermní. S pískem a vodou vzniká malta, ve vodě vápenná voda. Malta tuhne tak, že pohlcuje CO2 ze vzduchu: Ca(OH)2 + CO2 → CaCO3 + H2O, a vzniká opět vápenec."
    >
      <path d={circle} className="f67-o f67-thin f67-dash" style={{ opacity: 0.35 }} />
      {arcs.map((d, i) => (
        <DrawArrow key={i} d={d} tone="lvl" delay={0.32 + i * 0.28} className="f67-wide" />
      ))}
      <Travel path={circle} dur={10} rest={pt(-45)}>
        <circle r={5} className="f67-lvl-f f67-o f67-thin" />
      </Travel>

      <Pop delay={0.16}>
        <Kiln />
      </Pop>
      <Fade delay={0.48}>
        <text x={250} y={352} textAnchor="middle" className="f67-lbl f67-b">
          vápenka
        </text>
        <text x={272} y={170} className="f67-lbl f67-sm">
          <ChemText text="CO_{2}↑" />
        </text>
      </Fade>

      {NODES.map((nd, i) => {
        const [x, y] = pt(nd.a)
        return (
          <Pop key={i} delay={0.16 + i * 0.12}>
            <circle cx={x} cy={y} r={NR} className="f67-fill" />
            <circle cx={x} cy={y} r={NR} className="f67-o f67-thick f67-lvl-s" />
            <circle cx={x} cy={y} r={NR - 4} className="f67-o f67-thin" />
            {nd.t === 'malta' ? (
              <text x={x} y={y + 6} textAnchor="middle" className="f67-lbl f67-b f67-big">
                malta
              </text>
            ) : (
              <Eq x={x} y={y + 6} t={nd.t} anchor="middle" className="f67-eq-lg" />
            )}
            <text x={x + nd.dx} y={y + nd.dy} textAnchor="middle" className="f67-lbl f67-b f67-halo">
              {n && i === 3 ? '' : nd.name}
            </text>
          </Pop>
        )
      })}

      {/* step numbers on the arcs */}
      {[0, 1, 2, 3].map((i) => {
        const [x, y] = pt(NODES[i].a + 45, R)
        return (
          <Fade key={i} delay={0.72 + i * 0.24}>
            <Badge x={x} y={y} n={i + 1} />
          </Fade>
        )
      })}

      {n ? (
        <StepList x={58} y={510} steps={STEPS} gap={42} />
      ) : (
        <>
          <Fade delay={0.88}>
            <text x={366} y={70} className="f67-lbl f67-b">
              pálení, asi 900 °C
            </text>
            <Eq x={366} y={92} t="CaCO_{3} → CaO + CO_{2}" />
          </Fade>
          <Fade delay={1.12}>
            <text x={366} y={430} className="f67-lbl f67-b">
              hašení vodou
            </text>
            <Eq x={366} y={452} t="CaO + H_{2}O → Ca(OH)_{2}" />
            <text x={366} y={472} className="f67-lbl f67-sm">
              silně exotermní
            </text>
          </Fade>
          <Fade delay={1.36}>
            <text x={134} y={444} textAnchor="end" className="f67-lbl f67-b">
              + písek a voda
            </text>
            <text x={134} y={464} textAnchor="end" className="f67-lbl f67-sm">
              ve vodě: vápenná voda
            </text>
          </Fade>
          <Fade delay={1.6}>
            <text x={12} y={52} className="f67-lbl f67-b">
              <ChemText text="tuhnutí: + CO_{2} ze vzduchu" />
            </text>
            <Eq x={12} y={76} t="Ca(OH)_{2} + CO_{2} →" />
            <Eq x={12} y={96} t="CaCO_{3} + H_{2}O" />
          </Fade>
        </>
      )}
    </Figure>
  )
}
