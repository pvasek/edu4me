import { Arrow, CPK, Draw, Fade, Figure, Plate, Pop, useNarrow } from './kit'

const LABEL =
  'Glukóza v otevřené a cyklické formě. Vlevo D-glukóza jako Fischerova projekce: nahoře aldehydová skupina CHO na C1, skupiny OH na C2, C4 a C5 vpravo, na C3 vlevo, dole CH2OH na C6. Hydroxyskupina na C5 se přiblíží k C1 a vznikne šestičlenný kruh s kyslíkem (poloacetal). V Haworthově projekci rozlišujeme α-glukózu se skupinou OH na C1 pod rovinou kruhu a β-glukózu s OH na C1 nad rovinou. V roztoku převažují kruhové formy, otevřený řetězec tvoří jen nepatrnou část.'

export default function GlucoseRing() {
  return (
    <Figure name="glucose-ring" level={9} label={LABEL} max={660}>
      <Scene />
    </Figure>
  )
}

const T = ({ x, y, t, a = 'middle', lv = false, sm = false }: { x: number; y: number; t: string; a?: 'start' | 'middle' | 'end'; lv?: boolean; sm?: boolean }) => (
  <text className="f89-sym" x={x} y={y} textAnchor={a} style={{ fontSize: sm ? 13 : 16, fill: lv ? 'var(--lv-t)' : sm ? 'var(--muted)' : undefined }}>
    {t}
  </text>
)

/** Fischer projection of D-glucose; (x, y) = C1. */
function Fischer({ x, y }: { x: number; y: number }) {
  const dy = 38
  const rows: [string, string][] = [
    ['H', 'OH'],
    ['HO', 'H'],
    ['H', 'OH'],
    ['H', 'OH'],
  ]
  return (
    <g>
      <line className="f89-ln" x1={x} y1={y + 8} x2={x} y2={y + 5 * dy - 14} />
      <T x={x} y={y + 5} t="CHO" lv />
      {rows.map(([l, r], i) => {
        const cy = y + (i + 1) * dy
        const c5 = i === 3
        return (
          <g key={i}>
            <line className="f89-ln" x1={x - 34} y1={cy} x2={x + 34} y2={cy} />
            <T x={x - 38} y={cy + 5} t={l} a="end" />
            <T x={x + 38} y={cy + 5} t={r} a="start" lv={c5} />
            <text className="f89-f f89-sm f89-muted" x={x + 6} y={cy - 5}>
              {`C${i + 2}`}
            </text>
          </g>
        )
      })}
      <T x={x} y={y + 5 * dy + 5} t="CH₂OH" />
      <text className="f89-f f89-sm f89-muted" x={x + 30} y={y - 6}>
        C1
      </text>
      <text className="f89-f f89-sm f89-muted" x={x + 38} y={y + 5 * dy + 4}>
        C6
      </text>
    </g>
  )
}

/** Haworth projection; (x, y) = ring centre. */
function Haworth({ x, y, beta }: { x: number; y: number; beta: boolean }) {
  const P = {
    O: [x + 28, y - 18],
    C1: [x + 56, y + 2],
    C2: [x + 32, y + 24],
    C3: [x - 22, y + 24],
    C4: [x - 46, y + 2],
    C5: [x - 20, y - 18],
  } as const
  const ring = ['C5', 'O', 'C1', 'C2', 'C3', 'C4'] as const
  const sub = (k: keyof typeof P, up: string, down: string, hl?: 'up' | 'down') => {
    const [px, py] = P[k]
    return (
      <g key={k}>
        <line className="f89-ln" x1={px} y1={py - 22} x2={px} y2={py + 22} />
        <T x={px} y={py - 26} t={up} sm={up === 'H'} lv={hl === 'up'} />
        <T x={px} y={py + 38} t={down} sm={down === 'H'} lv={hl === 'down'} />
      </g>
    )
  }
  return (
    <g>
      {sub('C1', beta ? 'OH' : 'H', beta ? 'H' : 'OH', beta ? 'up' : 'down')}
      {sub('C2', 'H', 'OH')}
      {sub('C3', 'OH', 'H')}
      {sub('C4', 'H', 'OH')}
      {sub('C5', 'CH₂OH', 'H')}
      <polygon points={ring.map((k) => P[k].join(',')).join(' ')} className="f89-soft" />
      {/* front edges drawn heavy (the plane of the ring tilts toward you) */}
      <path className="f89-ln" style={{ strokeWidth: 5 }} d={`M${P.C1.join(' ')} L${P.C2.join(' ')} L${P.C3.join(' ')} L${P.C4.join(' ')}`} />
      <circle cx={P.O[0]} cy={P.O[1]} r={8} fill={CPK.O} stroke="var(--edge)" strokeWidth={1.1} />
      <text className="f89-atom-t" x={P.O[0]} y={P.O[1] + 3.5}>
        O
      </text>
      <text className="f89-f f89-sm f89-muted" x={P.C1[0] + 6} y={P.C1[1] + 4}>
        1
      </text>
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? { w: 340, h: 560, f: { x: 170, y: 40 }, a: { x: 88, y: 410 }, b: { x: 258, y: 410 }, s: 0.82 }
    : { w: 670, h: 330, f: { x: 100, y: 58 }, a: { x: 420, y: 88 }, b: { x: 420, y: 238 }, s: 1 }
  const { f } = L
  // ring-closing arrow: from the C5–OH over to C1
  const c5 = { x: f.x + 60, y: f.y + 4 * 38 }
  const c1 = { x: f.x + 30, y: f.y }
  const arc = `M${c5.x + 6} ${c5.y - 8} C${c5.x + 60} ${c5.y - 40} ${c1.x + 70} ${c1.y + 20} ${c1.x + 16} ${c1.y + 2}`
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.12}>
        <Fischer {...f} />
      </Pop>
      <Fade delay={0.36}>
        <text className="f89-lb f89-b" x={f.x} y={f.y + 5 * 38 + 36} textAnchor="middle">
          otevřený řetězec
        </text>
        <text className="f89-lb f89-sm" x={f.x} y={f.y + 5 * 38 + 54} textAnchor="middle">
          Fischerova projekce · &lt; 1 %
        </text>
      </Fade>
      <Draw d={arc} className="f89-curly-l" delay={0.66} dur={0.8} style={{ strokeDasharray: 'none' }} />
      <Fade delay={1.26}>
        <polygon points={`${c1.x + 12},${c1.y + 1} ${c1.x + 22},${c1.y - 3} ${c1.x + 20},${c1.y + 7}`} className="f89-lvfill" />
        {n ? (
          <text className="f89-lb f89-lv f89-sm" x={284} y={c5.y + 32} textAnchor="middle">
            C5–OH uzavře kruh
          </text>
        ) : (
          <>
            <text className="f89-lb f89-lv f89-sm" x={c1.x + 84} y={(c1.y + c5.y) / 2 + 4}>
              C5–OH
            </text>
            <text className="f89-lb f89-lv f89-sm" x={c1.x + 84} y={(c1.y + c5.y) / 2 + 20}>
              uzavře kruh
            </text>
          </>
        )}
      </Fade>
      {/* equilibria */}
      <Fade delay={1.38}>
        {n ? (
          <>
            <Arrow x1={140} y1={318} x2={100} y2={346} className="f89-arr f89-arr-soft" both />
            <Arrow x1={200} y1={318} x2={240} y2={346} className="f89-arr f89-arr-soft" both />
          </>
        ) : (
          <>
            <Arrow x1={306} y1={128} x2={356} y2={104} className="f89-arr f89-arr-soft" both />
            <Arrow x1={306} y1={184} x2={356} y2={214} className="f89-arr f89-arr-soft" both />
          </>
        )}
      </Fade>
      {[
        { p: L.a, beta: false, name: 'α-glukóza', note: 'OH na C1 dole · 36 %' },
        { p: L.b, beta: true, name: 'β-glukóza', note: 'OH na C1 nahoře · 64 %' },
      ].map((g, i) => (
        <Pop key={g.name} delay={1.5 + i * 0.18}>
          <g transform={`translate(${g.p.x} ${g.p.y}) scale(${L.s}) translate(${-g.p.x} ${-g.p.y})`}>
            <Haworth x={g.p.x} y={g.p.y} beta={g.beta} />
          </g>
          <text className="f89-lb f89-b" x={g.p.x + (n ? 0 : 92)} y={g.p.y + (n ? 72 : -4)} textAnchor={n ? 'middle' : 'start'}>
            {g.name}
          </text>
          <text className="f89-lb f89-sm" x={g.p.x + (n ? 0 : 92)} y={g.p.y + (n ? 90 : 14)} textAnchor={n ? 'middle' : 'start'}>
            {g.note}
          </text>
        </Pop>
      ))}
    </Plate>
  )
}
