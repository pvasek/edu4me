import { Fade, Figure, Num, Pop, Rise, pat, useCompact, useFig } from './kit'

const LABEL =
  'Jaderná elektrárna s tlakovodním reaktorem. V ochranné obálce (kontejnmentu) je tlaková nádoba reaktoru s aktivní zónou z palivových článků; regulační tyče zasouvané shora řídí štěpnou reakci. Voda primárního okruhu pod vysokým tlakem se v reaktoru ohřeje asi na 320 °C a čerpadlo ji žene do parogenerátoru. Tam předá teplo vodě sekundárního okruhu, která se mění v páru. Pára roztáčí turbínu a ta generátor, který vyrábí elektrickou energii. Za turbínou pára v kondenzátoru zkapalní a vrací se zpět. Kondenzátor chladí voda třetího okruhu, která se ochlazuje v chladicí věži. Okruhy jsou oddělené, radioaktivní voda neopustí kontejnment.'

const HOT = '#d0453a'
const COLD = '#e59a73'
const STEAM = '#9aa3b2'
const FEED = '#3d6fd1'
const COOL = '#6fb3d9'

const PARTS = [
  'kontejnment (obálka)',
  'tlaková nádoba reaktoru',
  'aktivní zóna (palivo)',
  'regulační tyče',
  'parogenerátor',
  'čerpadlo',
  'turbína',
  'generátor',
  'kondenzátor',
  'chladicí věž',
]
const CIRCUITS = [
  { c: HOT, t: 'primární okruh (voda 320 °C)' },
  { c: STEAM, t: 'sekundární okruh (pára)' },
  { c: COOL, t: 'chladicí voda' },
]

function Pipe({ d, c, w = 7 }: { d: string; c: string; w?: number }) {
  return (
    <g>
      <path d={d} className="fz3-pipe-o" style={{ strokeWidth: w + 3 }} />
      <path
        d={d}
        style={{
          stroke: c,
          strokeWidth: w,
          fill: 'none',
          strokeLinejoin: 'round',
        }}
      />
      <path d={d} className="fz3-flow" style={{ stroke: 'var(--surface)', strokeWidth: 2 }} />
    </g>
  )
}

function Pump({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="fz3-o fz3-fill" />
      <path d={`M${x - 5} ${y - 6} L${x + 7} ${y} L${x - 5} ${y + 6}`} className="fz3-o" />
    </g>
  )
}

function Plant() {
  const { id } = useFig()
  const dome = 'M20 300 V120 A100 90 0 0 1 220 120 V300Z'
  const tower = 'M482 300 C500 210 506 150 496 84 H566 C556 150 562 210 580 300Z'
  return (
    <g>
      {/* ground */}
      <path d="M6 300 H630" className="fz3-o" />
      <Pop delay={0}>
        <path d={dome} className="fz3-o fz3-fill" />
        <path d={dome} fill={pat(id, 'd')} opacity={0.35} />
        <path d="M30 300 V122 A90 80 0 0 1 210 122 V300" className="fz3-o fz3-thin" />
      </Pop>
      {/* cooling tower with its plume */}
      <Pop delay={0.2}>
        <path d={tower} className="fz3-o fz3-fill2" />
        <path d={tower} fill={pat(id, 'v')} />
        <g className="fz3-drift">
          <path d="M500 76 q-6 -16 10 -20 q6 -16 24 -8 q16 -10 26 6 q14 2 6 20Z" className="fz3-o fz3-thin fz3-cloud" />
        </g>
      </Pop>

      {/* primary circuit: vessel → hot leg → steam generator → pump → cold leg */}
      <Pipe d="M108 146 H128 V234 H150" c={HOT} />
      <Pipe d="M173 250 V282 H108 V256" c={COLD} />
      {/* secondary: steam to the turbine, feedwater back */}
      <Pipe d="M173 86 V64 H292" c={STEAM} w={8} />
      <Pipe d="M332 102 V176" c={STEAM} w={8} />
      <Pipe d="M300 238 V262 H206 V204 H198" c={FEED} />
      {/* cooling water: condenser ⇄ tower */}
      <Pipe d="M362 196 H500" c={COOL} />
      <Pipe d="M500 280 H392 V226 H362" c={COOL} />

      {/* reactor pressure vessel */}
      <rect x={48} y={110} width={60} height={160} rx={28} className="fz3-o fz3-vessel" />
      <rect x={56} y={196} width={44} height={60} rx={4} className="fz3-o fz3-fill" />
      {[62, 69, 76, 83, 90].map((x) => (
        <path key={x} d={`M${x} 202 V250`} className="fz3-fuel" />
      ))}
      <Rise delay={0.6}>
        {[65.5, 79.5, 93.5].map((x) => (
          <rect key={x} x={x - 2.5} y={84} width={5} height={128} rx={1.5} className="fz3-ctrl" />
        ))}
      </Rise>
      <rect x={56} y={72} width={44} height={14} rx={3} className="fz3-o fz3-fill3" />
      <circle cx={78} cy={226} r={30} className="fz3-glow fz3-core-glow" />

      {/* steam generator with the U tube */}
      <rect x={148} y={84} width={50} height={168} rx={24} className="fz3-o fz3-fill" />
      <path d="M150 234 H158 V132 A15 15 0 0 1 188 132 V250" className="fz3-utube" style={{ stroke: HOT }} />
      <path d="M150 236 H196" className="fz3-o fz3-thin" />
      <Pump x={140} y={282} />

      {/* turbine, generator */}
      <path d="M292 58 L352 42 V102 L292 86Z" className="fz3-o fz3-fill2" />
      <path d="M292 58 L352 42 V102 L292 86Z" fill={pat(id, 'v')} />
      <path d="M352 72 H372" className="fz3-o fz3-axle" />
      <circle cx={394} cy={72} r={22} className="fz3-o fz3-lvlsoft-f" />
      <text x={394} y={79} textAnchor="middle" className="fz3-sym-t fz3-tone-lvl" style={{ fontStyle: 'normal' }}>
        G
      </text>
      <path d="M416 72 H446" className="fz3-wire fz3-wire-thin" />
      <path d="M455 58 L448 74 H456 L450 88" className="fz3-bolt" />

      {/* condenser */}
      <rect x={282} y={176} width={80} height={62} rx={6} className="fz3-o fz3-fill" />
      {[192, 204, 216, 228].map((y) => (
        <path key={y} d={`M290 ${y} H356`} className="fz3-cool-tube" />
      ))}
      <Pump x={250} y={262} />
    </g>
  )
}

const BADGES: [number, number][] = [
  [120, 48],
  [36, 176],
  [78, 284 - 70],
  [78, 60],
  [173, 176],
  [140, 262],
  [322, 30],
  [394, 38],
  [322, 206],
  [531, 200],
]

export default function NuclearReactor() {
  const compact = useCompact()
  const n = compact.narrow
  const cols = n ? 1 : 3
  const rowH = n ? 36 : 25
  const items = [...PARTS.map((t, i) => ({ t, i })), ...CIRCUITS.map((c) => ({ t: c.t, c: c.c }))]
  const rows = Math.ceil(items.length / cols)
  const colW = 640 / cols
  const H = 316 + rows * rowH + 8
  return (
    <Figure level={7} w={640} h={H} max={720} compact={compact} boost={false} label={LABEL}>
      <Plant />
      <Fade delay={0.5}>
        {BADGES.map(([x, y], i) => (
          <Num key={i} x={x} y={y} n={i + 1} r={n ? 14 : 11} />
        ))}
      </Fade>
      <g className={n ? 'fz3-legend-lg' : 'fz3-legend'}>
        {items.map((it, k) => {
          const col = Math.floor(k / rows)
          const row = k % rows
          const x = 14 + col * colW
          const y = 332 + row * rowH
          return (
            <g key={k}>
              {'c' in it ? (
                <path
                  d={`M${x - 4} ${y - 6} h${n ? 30 : 22}`}
                  style={{
                    stroke: it.c,
                    strokeWidth: n ? 8 : 6,
                    strokeLinecap: 'round',
                  }}
                />
              ) : (
                <Num x={x + (n ? 10 : 8)} y={y - 6} n={it.i + 1} r={n ? 13 : 10} />
              )}
              <text x={x + (n ? 38 : 28)} y={y} className="fz3-lbl">
                {it.t}
              </text>
            </g>
          )
        })}
      </g>
    </Figure>
  )
}
