import { StepStrip } from '../../sequence/StepFigure'
import { Draw, Fade, Figure, Plate, Pop, smooth, useHatch } from './kit'

const LABEL =
  'Čtyři úrovně struktury bílkovin. Primární struktura je pořadí aminokyselin v řetězci od N-konce k C-konci. Sekundární struktura: řetězec se stáčí do α-šroubovice nebo skládá do β-skládaného listu, obojí drží vodíkové vazby. Terciární struktura je celkový prostorový tvar jednoho řetězce, který drží i disulfidové můstky. Kvartérní struktura je spojení více řetězců, například hemoglobin ze čtyř podjednotek, každá s hemem s iontem železa.'

export default function ProteinStructure() {
  return (
    <Figure name="protein-structure" level={9} label={LABEL} max={680}>
      <StepStrip
        min={270}
        steps={[
          { title: 'Primární', caption: 'pořadí aminokyselin', art: <Primary /> },
          { title: 'Sekundární', caption: 'α-šroubovice a β-skládaný list, drží je vodíkové vazby', art: <Secondary /> },
          { title: 'Terciární', caption: 'prostorový tvar celého řetězce', art: <Tertiary /> },
          { title: 'Kvartérní', caption: 'více řetězců dohromady, např. hemoglobin', art: <Quaternary /> },
        ]}
      />
    </Figure>
  )
}

const AA = ['Met', 'Gly', 'Leu', 'Ser', 'Cys', 'Lys', 'Ala', 'Glu']
const AA_COL = ['#c9a86a', '#b98a5a', '#9bb56a', '#6fa0c8', '#e0b43a', '#7f8fd6', '#b98a5a', '#d9736a']

function Primary() {
  const pts = AA.map((_, i) => [30 + i * 32, 92 + Math.sin(i * 0.9) * 22] as [number, number])
  return (
    <Plate w={290} h={170}>
      <Draw d={smooth(pts)} className="f89-ln" delay={0} dur={0.5} style={{ strokeWidth: 2 }} />
      {pts.map(([x, y], i) => (
        <Pop key={i} delay={0.05 + i * 0.03}>
          <circle cx={x} cy={y} r={14} fill={AA_COL[i]} stroke="var(--edge)" strokeWidth={1.2} />
          <text className="f89-t" x={x} y={y + 4} textAnchor="middle" style={{ fill: '#1f2a44', fontWeight: 700, fontSize: 10.5 }}>
            {AA[i]}
          </text>
        </Pop>
      ))}
      <Fade delay={0.25} dur={0.35}>
        <text className="f89-lb f89-sm" x={pts[0][0]} y={pts[0][1] - 24} textAnchor="middle">
          N-konec
        </text>
        <text className="f89-lb f89-sm" x={pts[7][0]} y={pts[7][1] + 34} textAnchor="middle">
          C-konec
        </text>
        <text className="f89-f f89-sm f89-muted" x={145} y={160} textAnchor="middle">
          Met–Gly–Leu–Ser–Cys–Lys–Ala–Glu…
        </text>
      </Fade>
    </Plate>
  )
}

/** Helix as front (bold) and back (thin) half-turns. */
function helix(cx: number, y0: number, len: number, turns: number, R: number) {
  const N = turns * 24
  const front: string[] = []
  const back: string[] = []
  let cur: [number, number][] = []
  let curFront = true
  const flush = () => {
    if (cur.length > 1) (curFront ? front : back).push(smooth(cur))
  }
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const a = t * turns * Math.PI * 2
    const x = cx + R * Math.sin(a)
    const y = y0 + len * t + Math.cos(a) * 5
    const isFront = Math.cos(a) > 0
    if (i > 0 && isFront !== curFront) {
      cur.push([x, y])
      flush()
      cur = [[x, y]]
    } else cur.push([x, y])
    curFront = isFront
  }
  flush()
  return { front, back }
}

function Secondary() {
  const h = helix(70, 34, 116, 4, 26)
  const strands = [0, 1, 2]
  return (
    <Plate w={290} h={170}>
      {h.back.map((d, i) => (
        <Draw key={`b${i}`} d={d} className="f89-ln" delay={0.05 + i * 0.03} dur={0.3} style={{ strokeWidth: 2.5, stroke: 'color-mix(in srgb, var(--lv) 45%, var(--surface))' }} />
      ))}
      {h.front.map((d, i) => (
        <Draw key={`f${i}`} d={d} className="f89-ln" delay={0.08 + i * 0.03} dur={0.3} style={{ strokeWidth: 5, stroke: 'var(--lv)' }} />
      ))}
      <Fade delay={0.25} dur={0.35}>
        {[0, 1, 2].map((k) => (
          <line key={k} className="f89-guide" x1={56 + k * 12} y1={50 + k * 29} x2={56 + k * 12} y2={76 + k * 29} style={{ stroke: 'var(--blue)', strokeWidth: 1.4, strokeDasharray: '2 3' }} />
        ))}
        <text className="f89-lb f89-b" x={70} y={22} textAnchor="middle">
          α-šroubovice
        </text>
      </Fade>
      {/* β-sheet: three pleated strands, alternating direction */}
      {strands.map((s) => {
        const y = 52 + s * 40
        const dir = s % 2 ? -1 : 1
        const x1 = 150
        const x2 = 270
        const zig = Array.from({ length: 7 }, (_, i) => `${x1 + i * 17},${y + (i % 2 ? -5 : 5)}`)
        const tipX = dir > 0 ? x2 + 8 : x1 - 8
        const baseX = dir > 0 ? x2 - 10 : x1 + 10
        return (
          <Pop key={s} delay={0.05 + s * 0.05}>
            <polyline points={zig.join(' ')} fill="none" stroke="#c98a3a" strokeWidth={9} strokeLinejoin="round" opacity={0.85} />
            <polyline points={zig.join(' ')} fill="none" stroke="var(--edge)" strokeWidth={0.9} strokeLinejoin="round" />
            <polygon points={`${tipX},${y} ${baseX},${y - 11} ${baseX},${y + 11}`} fill="#c98a3a" stroke="var(--edge)" strokeWidth={1} />
          </Pop>
        )
      })}
      <Fade delay={0.25} dur={0.35}>
        {[0, 1].map((s) =>
          [0, 1, 2].map((k) => <line key={`${s}${k}`} x1={170 + k * 34} y1={62 + s * 40} x2={170 + k * 34} y2={82 + s * 40} stroke="var(--blue)" strokeWidth={1.4} strokeDasharray="2 3" />),
        )}
        <text className="f89-lb f89-b" x={210} y={22} textAnchor="middle">
          β-list
        </text>
        <text className="f89-lb f89-sm" x={210} y={160} textAnchor="middle" style={{ fill: 'var(--blue)' }}>
          ┆ vodíkové vazby
        </text>
      </Fade>
    </Plate>
  )
}

function Tertiary() {
  const hatch = useHatch()
  const pts: [number, number][] = [
    [40, 140],
    [60, 100],
    [100, 118],
    [118, 80],
    [90, 48],
    [140, 34],
    [180, 56],
    [160, 96],
    [200, 110],
    [236, 80],
    [250, 124],
    [210, 150],
    [150, 146],
    [120, 150],
  ]
  return (
    <Plate w={290} h={170}>
      <ellipse cx={150} cy={96} rx={112} ry={64} fill={hatch('d')} className="f89-hatch" />
      <ellipse cx={150} cy={96} rx={112} ry={64} className="f89-guide" />
      <Draw d={smooth(pts)} className="f89-ln" delay={0} dur={0.6} style={{ strokeWidth: 5, stroke: 'var(--lv)' }} />
      <Fade delay={0.3} dur={0.3}>
        {/* disulfide bridge */}
        <line x1={118} y1={80} x2={160} y2={96} stroke="#c49a1a" strokeWidth={2.4} strokeDasharray="3 3" />
        <circle cx={118} cy={80} r={5} fill="#e0b43a" stroke="var(--edge)" />
        <circle cx={160} cy={96} r={5} fill="#e0b43a" stroke="var(--edge)" />
        <text className="f89-lb f89-sm" x={139} y={120} textAnchor="middle">
          S–S můstek
        </text>
        <text className="f89-lb f89-sm" x={256} y={30} textAnchor="middle">
          klubko
        </text>
      </Fade>
    </Plate>
  )
}

function Quaternary() {
  const hatch = useHatch()
  const subs = [
    { x: 105, y: 62, c: '#c46a86', n: 'α' },
    { x: 185, y: 62, c: '#8e6aa8', n: 'β' },
    { x: 105, y: 122, c: '#8e6aa8', n: 'β' },
    { x: 185, y: 122, c: '#c46a86', n: 'α' },
  ]
  return (
    <Plate w={290} h={170}>
      {subs.map((s, i) => (
        <Pop key={i} delay={0.05 + i * 0.05}>
          <path
            d={smooth(
              Array.from({ length: 9 }, (_, k) => {
                const a = (k / 9) * Math.PI * 2
                const r = 36 + Math.sin(a * 3 + i) * 4
                return [s.x + Math.cos(a) * r * 1.1, s.y + Math.sin(a) * r * 0.82] as [number, number]
              }),
              true,
            )}
            fill={s.c}
            stroke="var(--edge)"
            strokeWidth={1.3}
            opacity={0.9}
          />
          <path
            d={smooth(
              Array.from({ length: 9 }, (_, k) => {
                const a = (k / 9) * Math.PI * 2
                const r = 36 + Math.sin(a * 3 + i) * 4
                return [s.x + Math.cos(a) * r * 1.1, s.y + Math.sin(a) * r * 0.82] as [number, number]
              }),
              true,
            )}
            fill={hatch('s')}
            className="f89-hatch"
          />
          {/* haem with Fe */}
          <rect x={s.x - 9 + (i % 2 ? 8 : -8)} y={s.y - 7} width={18} height={14} rx={3} fill="#b3261e" stroke="var(--edge)" strokeWidth={1} />
          <text className="f89-t" x={s.x + (i % 2 ? 8 : -8)} y={s.y + 4} textAnchor="middle" style={{ fill: '#fff', fontSize: 9, fontWeight: 700 }}>
            Fe
          </text>
          <text className="f89-lb f89-b" x={s.x + (i % 2 ? -18 : 18)} y={s.y + 6} textAnchor="middle" style={{ fill: '#fff' }}>
            {s.n}
          </text>
        </Pop>
      ))}
      <Fade delay={0.25} dur={0.35}>
        <text className="f89-lb f89-sm" x={250} y={164} textAnchor="middle">
          hem s Fe²⁺
        </text>
        <line className="f89-lead" x1={236} y1={152} x2={203} y2={128} />
      </Fade>
    </Plate>
  )
}
