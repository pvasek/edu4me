import { Arrow, ChemText, Draw, Eq, Fade, Figure, Flame, Lbl, Pipe, Pop, Travel, pat, rng, useCompact, useFig } from './kit'

const CX = 165
// inner profile, right half: throat → belly → bosh → hearth
const IN = [
  [44, 86],
  [92, 330],
  [72, 440],
  [72, 548],
] as const
const OUT = [
  [62, 80],
  [110, 330],
  [90, 440],
  [90, 566],
] as const
const inner = `M${CX - IN[0][0]} ${IN[0][1]} L${CX - IN[1][0]} ${IN[1][1]} L${CX - IN[2][0]} ${IN[2][1]} L${CX - IN[3][0]} ${IN[3][1]} H${CX + IN[3][0]} L${CX + IN[2][0]} ${IN[2][1]} L${CX + IN[1][0]} ${IN[1][1]} L${CX + IN[0][0]} ${IN[0][1]}`
const lining =
  `M${CX - OUT[0][0]} ${OUT[0][1]} L${CX - OUT[1][0]} ${OUT[1][1]} L${CX - OUT[2][0]} ${OUT[2][1]} L${CX - OUT[3][0]} ${OUT[3][1]} H${CX + OUT[3][0]} L${CX + OUT[2][0]} ${OUT[2][1]} L${CX + OUT[1][0]} ${OUT[1][1]} L${CX + OUT[0][0]} ${OUT[0][1]} ` +
  `H${CX + IN[0][0]} L${CX + IN[1][0]} ${IN[1][1]} L${CX + IN[2][0]} ${IN[2][1]} L${CX + IN[3][0]} ${IN[3][1]} H${CX - IN[3][0]} L${CX - IN[2][0]} ${IN[2][1]} L${CX - IN[1][0]} ${IN[1][1]} L${CX - IN[0][0]} ${IN[0][1]}Z`

const ORE = '#a4502e'
const COKE = '#3b3b3b'
const LIME = '#d9d3c3'
const SLAG = '#c7a44a'
const IRON = '#e8892a'

function Charge() {
  const { id } = useFig()
  const cols = [ORE, COKE, LIME, COKE]
  const bands = []
  for (let i = 0, y = 92; y < 430; i++, y += 17) {
    const col = cols[i % cols.length]
    bands.push(<path key={y} d={`M${CX - 120} ${y} Q${CX} ${y + 14} ${CX + 120} ${y} V${y + 18} Q${CX} ${y + 32} ${CX - 120} ${y + 18}Z`} fill={col} fillOpacity={y > 360 ? 0.55 : 0.85} />)
  }
  const r = rng(3)
  const lumps = Array.from({ length: 26 }, () => [CX - 64 + r() * 128, 440 + r() * 48] as const)
  return (
    <g>
      <clipPath id={`${id}-bf`}>
        <path d={inner + 'Z'} />
      </clipPath>
      <g clipPath={`url(#${id}-bf)`}>
        <rect x={CX - 120} y={80} width={240} height={480} className="f67-fill" />
        {bands}
        <rect x={CX - 120} y={80} width={240} height={420} fill={pat(id, 'd')} />
        {/* coke bed around the tuyeres */}
        {lumps.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4.5} fill={COKE} className="f67-o f67-thin" />
        ))}
        {/* molten layers in the hearth */}
        <rect x={CX - 100} y={494} width={200} height={22} fill={SLAG} />
        <rect x={CX - 100} y={494} width={200} height={22} fill={pat(id, 'h')} />
        <rect x={CX - 100} y={516} width={200} height={34} fill={IRON} className="f67-glow" />
        <rect x={CX - 100} y={516} width={200} height={34} fill={pat(id, 'h')} />
      </g>
      <path d={`M${CX - 72} 494 H${CX + 72} M${CX - 72} 516 H${CX + 72}`} className="f67-o f67-thin" />
    </g>
  )
}

function Lining() {
  const { id } = useFig()
  return (
    <g>
      <path d={lining} className="f67-fill3" />
      <path d={lining} fill={pat(id, 'brick')} />
      <path d={lining} className="f67-o" />
    </g>
  )
}

function Swatch({ y, col, t }: { y: number; col: string; t: string }) {
  return (
    <g>
      <rect x={12} y={y - 10} width={12} height={12} fill={col} className="f67-o f67-thin" />
      <text x={30} y={y} className="f67-lbl f67-sm">
        {t}
      </text>
    </g>
  )
}

const ROWS = [
  { y: 176, eq: 'Fe_{2}O_{3} + 3CO → 2Fe + 3CO_{2}', note: '400–800 °C · CO redukuje rudu', t: [CX + 42, 196] },
  { y: 256, eq: 'CaCO_{3} → CaO + CO_{2}', note: 'asi 900 °C · rozklad vápence', t: [CX + 60, 272] },
  { y: 336, eq: 'CO_{2} + C → 2CO', note: 'asi 1 000 °C', t: [CX + 70, 350] },
  { y: 416, eq: 'C + O_{2} → CO_{2}', note: 'až 2 000 °C · koks hoří', t: [CX + 58, 466] },
  { y: 496, eq: 'CaO + SiO_{2} → CaSiO_{3}', note: 'struska', t: [CX + 60, 504] },
] as const

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="f67-tag-lvl" />
      <text x={x} y={y + 4.5} textAnchor="middle" className="f67-num f67-num-b" style={{ fontSize: 12 }}>
        {n}
      </text>
    </g>
  )
}

export default function BlastFurnace() {
  const compact = useCompact()
  const n = compact.narrow
  const gas = [
    [CX - 40, 460],
    [CX + 36, 460],
    [CX - 8, 470],
    [CX + 20, 450],
    [CX - 30, 440],
  ]
  return (
    <Figure
      level={7}
      w={n ? 336 : 500}
      h={n ? 842 : 620}
      max={600}
      compact={compact}
      boost={false}
      label="Vysoká pec v řezu. Shora se sype vsázka: železná ruda, koks a vápenec. Zdola se dmyšnami vhání horký vzduch, koks u dna hoří až při 2 000 °C: C + O2 → CO2, výš CO2 + C → 2CO. Stoupající oxid uhelnatý redukuje rudu při 400–800 °C: Fe2O3 + 3CO → 2Fe + 3CO2. Vápenec se rozkládá na CaO, který váže hlušinu do strusky: CaO + SiO2 → CaSiO3. Na dně se hromadí tekuté surové železo a nad ním lehčí struska, obojí se odpichuje. Nahoře odchází vysokopecní plyn."
    >
      <Pop>
        <Charge />
      </Pop>
      <Lining />
      <Draw d={inner} className="f67-o f67-thick" delay={0.1} />

      {/* top: hopper, bell, gas offtakes */}
      <Pop delay={0.3}>
        <path d={`M${CX - 30} 36 L${CX - 10} 62 H${CX + 10} L${CX + 30} 36`} className="f67-o f67-fill2" />
        <path d={`M${CX - 26} 82 L${CX} 64 L${CX + 26} 82Z`} className="f67-o f67-fill3" />
        <path d={`M${CX} 64 V40`} className="f67-o" />
        <rect x={CX - 62} y={72} width={124} height={10} className="f67-o f67-fill3" />
      </Pop>
      <Pipe d={`M${CX + 52} 76 H${CX + 86} V24`} gas="#9aa0aa" w={10} delay={0.5} />
      <Pipe d={`M${CX - 52} 76 H${CX - 86} V24`} gas="#9aa0aa" w={10} delay={0.5} />
      <Fade delay={0.8}>
        <text x={CX + 98} y={30} className="f67-lbl f67-b">
          {n ? 'plyn' : 'vysokopecní plyn'}
        </text>
        <text x={CX + 98} y={48} className="f67-lbl f67-sm f67-sec">
          <ChemText text="CO, CO_{2}, N_{2}" />
        </text>
        <text x={12} y={24} className="f67-lbl f67-b">
          vsázka
        </text>
        <Arrow d={`M40 30 Q70 30 ${CX - 34} 40`} />
        <Swatch y={140} col={ORE} t="ruda" />
        <Swatch y={160} col={COKE} t="koks" />
        <Swatch y={180} col={LIME} t="vápenec" />
      </Fade>

      {/* rising gas */}
      {gas.map(([x, y], i) => (
        <Travel key={i} path={`M${x} ${y} C${x + 10} ${y - 120} ${x - 14} ${y - 260} ${x * 0.3 + CX * 0.7} 96`} dur={4.5} phase={i / gas.length} rest={[x, y - 120 - i * 50]} fade>
          <circle r={3.5} className="f67-gas" />
        </Travel>
      ))}

      {/* hot air blast + tuyeres */}
      <Pipe d={`M8 468 H${CX - 72}`} gas="#e8892a" w={12} delay={0.6} />
      <Pipe d={`M${CX + 112} 468 H${CX + 72}`} gas="#e8892a" w={12} delay={0.6} />
      <Fade delay={1}>
        <Flame x={CX - 60} y={468} h={20} w={6} />
        <Flame x={CX + 60} y={468} h={20} w={6} />
        <text x={8} y={432} className="f67-lbl f67-b f67-acc-t">
          horký
        </text>
        <text x={8} y={450} className="f67-lbl f67-b f67-acc-t">
          vzduch
        </text>
      </Fade>

      {/* taps */}
      <Pipe d={`M${CX - 72} 504 L22 526`} gas={SLAG} w={8} delay={0.8} />
      <Pipe d={`M${CX + 72} 540 L${CX + 122} 560`} gas={IRON} w={8} delay={0.8} />
      <Pop delay={1.2}>
        <path d={`M${CX + 120} 562 H${CX + 170} L${CX + 162} 602 H${CX + 128}Z`} className="f67-o f67-fill3" />
        <path d={`M${CX + 124} 572 H${CX + 166} L${CX + 162} 594 H${CX + 128}Z`} fill={IRON} className="f67-glow" />
      </Pop>
      <Fade delay={1.3}>
        <Lbl x={12} y={560} tx={40} ty={522} className="f67-b">
          struska
        </Lbl>
        <text x={12} y={578} className="f67-lbl f67-sm f67-sec">
          na silnice, do cementu
        </text>
        {n ? (
          <text x={CX + 145} y={622} textAnchor="middle" className="f67-lbl f67-b">
            surové železo
          </text>
        ) : (
          <>
            <Lbl x={CX + 180} y={586} tx={CX + 60} ty={532} className="f67-b" lx={CX + 176} ly={570}>
              surové železo
            </Lbl>
            <text x={CX + 180} y={604} className="f67-lbl f67-sm">
              asi 4 % uhlíku
            </text>
          </>
        )}
        <Lbl x={12} y={392} tx={CX - 96} ty={400} className="f67-sm" sec>
          vyzdívka
        </Lbl>
      </Fade>

      {/* reactions by zone */}
      {ROWS.map((r, i) =>
        n ? (
          <Fade key={r.y} delay={1.2 + i * 0.25}>
            <Badge x={r.t[0] + 12} y={r.t[1] - 4} n={i + 1} />
            <Badge x={16} y={652 + i * 38} n={i + 1} />
            <Eq x={32} y={657 + i * 38} t={r.eq} />
            <text x={32} y={674 + i * 38} className="f67-lbl f67-sm">
              {r.note}
            </text>
          </Fade>
        ) : (
          <Fade key={r.y} delay={1.2 + i * 0.25}>
            <line className="f67-lead" x1={CX + 132} y1={r.y - 5} x2={r.t[0]} y2={r.t[1]} />
            <circle className="f67-dot" cx={r.t[0]} cy={r.t[1]} r={2.2} />
            <Eq x={CX + 136} y={r.y} t={r.eq} className="f67-keep" />
            <text x={CX + 136} y={r.y + 18} className="f67-lbl f67-sm f67-keep">
              {r.note}
            </text>
          </Fade>
        ),
      )}
    </Figure>
  )
}
