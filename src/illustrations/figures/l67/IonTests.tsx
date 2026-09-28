import { Draw, Eq, Fade, Figure, Pop, pat, rng, useCompact, useFig } from './kit'

interface Tube {
  ion: string
  ppt: string
  col: string
  name: string[]
  /** light precipitate: needs a darker outline to show on the page */
  light?: boolean
}
const NAOH: Tube[] = [
  { ion: 'Cu^{2+}', ppt: 'Cu(OH)_{2}', col: '#3b7fd0', name: ['modrá'] },
  { ion: 'Fe^{2+}', ppt: 'Fe(OH)_{2}', col: '#5f8a4a', name: ['zelená'] },
  { ion: 'Fe^{3+}', ppt: 'Fe(OH)_{3}', col: '#a4502a', name: ['červeno-', 'hnědá'] },
  { ion: 'Al^{3+}', ppt: 'Al(OH)_{3}', col: '#fbfaf4', name: ['bílá'], light: true },
]
const AGNO3: Tube[] = [
  { ion: 'Cl^{-}', ppt: 'AgCl', col: '#fbfaf4', name: ['bílá'], light: true },
  { ion: 'Br^{-}', ppt: 'AgBr', col: '#f1e2ae', name: ['krémová'], light: true },
  { ion: 'I^{-}', ppt: 'AgI', col: '#f2cf2e', name: ['žlutá'] },
]
const BACL2: Tube[] = [{ ion: 'SO_{4}^{2-}', ppt: 'BaSO_{4}', col: '#fbfaf4', name: ['bílá'], light: true }]

const TT = 84 // tube top
const TB = 214 // tube bottom
const R = 13 // tube radius

function TestTube({ x, t, i }: { x: number; t: Tube; i: number }) {
  const { id } = useFig()
  const clip = `${id}-it${i}`
  const body = `M${x - R} ${TT} V${TB - R} A${R} ${R} 0 0 0 ${x + R} ${TB - R} V${TT}`
  const r = rng(11 + i)
  const heap = `M${x - R} ${TB - 26} Q${x - 6} ${TB - 34} ${x} ${TB - 31} Q${x + 7} ${TB - 35} ${x + R} ${TB - 27} V${TB}H${x - R}Z`
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${body}Z`} />
        </clipPath>
      </defs>
      <Pop delay={0.06 + i * 0.04}>
        <path d={`${body}Z`} className="f67-glass" />
        <g clipPath={`url(#${clip})`}>
          {/* liquid, clouded by the suspension */}
          <rect x={x - R} y={TT + 40} width={2 * R} height={TB - TT - 40} fill={t.col} fillOpacity={t.light ? 0.28 : 0.2} />
          <rect x={x - R} y={TT + 40} width={2 * R} height={TB - TT - 40} fill={pat(id, 'h')} />
          <path d={`M${x - R} ${TT + 40} H${x + R}`} className="f67-o f67-thin" style={{ opacity: 0.6 }} />
          {/* the precipitate settles to the bottom */}
          <path d={heap} fill={t.col} className={t.light ? 'f67-ppt-light' : undefined} />
          <path d={heap} fill={pat(id, 'dots')} />
          {Array.from({ length: 6 }, (_, k) => (
            <circle
              key={k}
              cx={x - 8 + r() * 16}
              cy={TT + 60 + r() * 60}
              r={1.6 + r()}
              fill={t.col}
              className={`f67-flake ${t.light ? 'f67-ppt-light' : 'f67-o f67-thin'}`}
              style={{ animationDelay: `${(-r() * 3).toFixed(2)}s` }}
            />
          ))}
        </g>
        <path d={body} className="f67-o" />
        <path d={`M${x - R - 3} ${TT} H${x + R + 3}`} className="f67-o" />
        <path d={`M${x - R + 4} ${TT + 8} V${TB - R - 6}`} className="f67-o f67-thin f67-glint" />
      </Pop>
      <Fade delay={0.3 + i * 0.04}>
        <Eq x={x} y={TT - 10} t={t.ion} anchor="middle" className="f67-eq-lg f67-b-eq" />
      </Fade>
      <Fade delay={0.48 + i * 0.04}>
        <Eq x={x} y={TB + 46} t={t.ppt} anchor="middle" className="f67-eq-sm f67-keep" />
        {t.name.map((s, k) => (
          <text key={k} x={x} y={TB + 64 + k * 15} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-keep">
            {s}
          </text>
        ))}
      </Fade>
    </g>
  )
}

/** Wooden rack under a row of tubes, from x0 to x1. */
function Rack({ x0, x1 }: { x0: number; x1: number }) {
  const { id } = useFig()
  return (
    <Pop delay={0.03}>
      <rect x={x0} y={TB + 4} width={x1 - x0} height={10} rx={2} fill="#b98a52" className="f67-o" />
      <rect x={x0} y={TB + 4} width={x1 - x0} height={10} rx={2} fill={pat(id, 'd')} />
      <path d={`M${x0 + 6} ${TB + 14} V${TB + 24} M${x1 - 6} ${TB + 14} V${TB + 24}`} className="f67-o f67-thick" style={{ stroke: '#8a5a33' }} />
    </Pop>
  )
}

/** Front board of the rack (drawn over the tubes). */
function Board({ x0, x1 }: { x0: number; x1: number }) {
  const { id } = useFig()
  return (
    <Pop delay={0.09}>
      <rect x={x0} y={TT + 26} width={x1 - x0} height={12} rx={2} fill="#b98a52" className="f67-o" />
      <rect x={x0} y={TT + 26} width={x1 - x0} height={12} rx={2} fill={pat(id, 'd')} />
      <path d={`M${x0 + 4} ${TT + 38} V${TB + 4} M${x1 - 4} ${TT + 38} V${TB + 4}`} className="f67-o f67-thick" style={{ stroke: '#8a5a33' }} />
    </Pop>
  )
}

function Group({ x0, x1, reagent, delay }: { x0: number; x1: number; reagent: string; delay: number }) {
  return (
    <g>
      <Draw d={`M${x0 + 4} 44 V36 H${x1 - 4} V44`} className="f67-o f67-thin" delay={delay} />
      <Fade delay={delay + 0.12}>
        <Eq x={(x0 + x1) / 2} y={26} t={`+ ${reagent}`} anchor="middle" className="f67-eq-lg f67-b-eq" />
      </Fade>
    </g>
  )
}

export default function IonTests() {
  const compact = useCompact()
  const n = compact.narrow
  const S = n ? 78 : 72
  const all = [...NAOH, ...AGNO3, ...BACL2]
  // wide: one row of 8; narrow: NaOH row, then AgNO₃ + BaCl₂ row
  const pos = all.map((_, i) => (n ? (i < 4 ? [48 + i * S, 0] : [48 + (i - 4) * S, 300]) : [40 + i * S + (i >= 4 ? 10 : 0) + (i >= 7 ? 10 : 0), 0]))
  const rows = n
    ? [
        { y: 0, x0: pos[0][0] - 26, x1: pos[3][0] + 26 },
        { y: 300, x0: pos[4][0] - 26, x1: pos[7][0] + 26 },
      ]
    : [{ y: 0, x0: pos[0][0] - 26, x1: pos[7][0] + 26 }]
  const groups = [
    { a: 0, b: 3, r: 'NaOH' },
    { a: 4, b: 6, r: 'AgNO_{3}' },
    { a: 7, b: 7, r: 'BaCl_{2}' },
  ]
  return (
    <Figure
      level={7}
      w={n ? 330 : 616}
      h={n ? 604 : 304}
      max={680}
      compact={compact}
      boost={false}
      label="Důkazy iontů srážením. Stojan se zkumavkami, v každé je sraženina. Po přidání NaOH: ionty Cu2+ dají modrou sraženinu Cu(OH)2, Fe2+ zelenou Fe(OH)2, Fe3+ červenohnědou Fe(OH)3 a Al3+ bílou Al(OH)3. Po přidání AgNO3: chloridy dají bílou AgCl, bromidy krémovou AgBr a jodidy žlutou AgI. Po přidání BaCl2 dají síranové ionty SO4 2− bílou sraženinu BaSO4."
    >
      {rows.map((r, k) => (
        <g key={k} transform={`translate(0 ${r.y})`}>
          <Rack x0={r.x0} x1={r.x1} />
        </g>
      ))}
      {all.map((t, i) => (
        <g key={i} transform={`translate(0 ${pos[i][1]})`}>
          <TestTube x={pos[i][0]} t={t} i={i} />
        </g>
      ))}
      {rows.map((r, k) => (
        <g key={k} transform={`translate(0 ${r.y})`}>
          <Board x0={r.x0} x1={r.x1} />
        </g>
      ))}
      {groups.map((g, k) => (
        <g key={k} transform={`translate(0 ${pos[g.a][1]})`}>
          <Group x0={pos[g.a][0] - 30} x1={pos[g.b][0] + 30} reagent={g.r} delay={0.24 + k * 0.12} />
        </g>
      ))}
    </Figure>
  )
}
