import { Arrow, Atom, Draw, F, Fade, Figure, Mol, Panel, Panels, Plate, Pop, rng, smooth, useNarrow } from './kit'

const LABEL =
  'Adiční polymerace ethenu: tisíce malých molekul ethenu CH2=CH2 se spojí, dvojné vazby se rozpojí a vznikne dlouhý řetězec polyethylenu, ve kterém se opakuje jednotka –CH2–CH2–. Při přiblížení je makromolekula zamotané klubko, ve kterém každá kulička představuje jednu opakující se jednotku. Pro srovnání opakující se jednotky PVC –CH2–CHCl– a PET, polyesteru z lahví.'

export default function PolymerChain() {
  return (
    <Figure name="polymer-chain" level={8} label={LABEL} max={700}>
      <Panels min={270}>
        <Panel n={1} title="Monomery → polymer" delay={0} className="f89-wide">
          <Polymerisation />
        </Panel>
        <Panel n={2} title="Makromolekula zblízka" delay={1.6}>
          <Tangle />
        </Panel>
        <Panel n={3} title="Další opakující se jednotky" delay={2.2}>
          <Units />
        </Panel>
      </Panels>
    </Figure>
  )
}

function Ethene({ x, y }: { x: number; y: number }) {
  return <Mol atoms={[['C', x - 11, y], ['C', x + 11, y]]} bonds={[[0, 1, 2]]} hLen={15} />
}

function Polymerisation() {
  const narrow = useNarrow()
  const mono = narrow ? [50, 120, 190, 260] : [40, 100, 160, 220]
  const my = narrow ? 50 : 86
  const cy = narrow ? 196 : 86
  const c0 = narrow ? 40 : 338
  const nC = narrow ? 9 : 8
  const w = narrow ? 320 : 620
  const h = narrow ? 266 : 170
  const cs = Array.from({ length: nC }, (_, i) => c0 + i * 30)
  return (
    <Plate w={w} h={h}>
      {mono.map((x, i) => (
        <Pop key={x} delay={0.15 + i * 0.12}>
          <Ethene x={x} y={my} />
        </Pop>
      ))}
      <Fade delay={0.6}>
        <text className="f89-lb f89-sm" x={narrow ? 155 : 130} y={my + 44} textAnchor="middle">
          n × ethen CH₂=CH₂
        </text>
      </Fade>
      <Fade delay={0.8}>
        {narrow ? <Arrow x1={160} y1={96} x2={160} y2={130} className="f89-arr f89-arr-lv" /> : <Arrow x1={264} y1={86} x2={316} y2={86} className="f89-arr f89-arr-lv" />}
        <text className="f89-lb f89-lv f89-sm" x={narrow ? 172 : 290} y={narrow ? 118 : 74} textAnchor={narrow ? 'start' : 'middle'}>
          tlak, katalyzátor
        </text>
      </Fade>
      {/* chain: dashed ends show it continues */}
      <Fade delay={1.0}>
        <line className="f89-guide" x1={cs[0] - 26} y1={cy} x2={cs[0]} y2={cy} />
        <line className="f89-guide" x1={cs[nC - 1]} y1={cy} x2={cs[nC - 1] + 26} y2={cy} />
      </Fade>
      {cs.map((x, i) => (
        <Pop key={x} delay={1.0 + i * 0.1}>
          {i < nC - 1 && <line className="f89-bond" x1={x} y1={cy} x2={cs[i + 1]} y2={cy} />}
          <line className="f89-bond" x1={x} y1={cy} x2={x} y2={cy - 17} />
          <line className="f89-bond" x1={x} y1={cy} x2={x} y2={cy + 17} />
          <Atom x={x} y={cy - 17} el="H" r={5.2} />
          <Atom x={x} y={cy + 17} el="H" r={5.2} />
          <Atom x={x} y={cy} el="C" r={8.5} />
        </Pop>
      ))}
      {/* repeat unit bracket */}
      <Fade delay={1.9}>
        <path className="f89-ln" style={{ stroke: 'var(--lv)', strokeWidth: 2 }} d={`M${cs[2] - 12} ${cy - 30} h-5 v60 h5 M${cs[3] + 12} ${cy - 30} h5 v60 h-5`} />
        <text className="f89-lb f89-lv" x={cs[3] + 21} y={cy + 34}>
          n
        </text>
        <text className="f89-lb f89-sm" x={(cs[2] + cs[3]) / 2} y={cy + 52} textAnchor="middle">
          opakující se jednotka –CH₂–CH₂–
        </text>
        <text className="f89-lb f89-b" x={(cs[0] + cs[nC - 1]) / 2} y={cy - 38} textAnchor="middle">
          polyethylen (PE)
        </text>
      </Fade>
    </Plate>
  )
}

/** A deterministic tangled random-walk chain. */
function tanglePoints(): [number, number][] {
  const r = rng(7)
  const pts: [number, number][] = []
  let x = 110
  let y = 120
  let a = 0
  for (let i = 0; i < 70; i++) {
    a += (r() - 0.5) * 1.9
    x += Math.cos(a) * 14
    y += Math.sin(a) * 14
    // keep inside a blob around (110, 120)
    const dx = x - 110
    const dy = y - 120
    const d = Math.hypot(dx, dy)
    if (d > 78) {
      x = 110 + (dx / d) * 78
      y = 120 + (dy / d) * 78
      a += Math.PI * 0.7
    }
    pts.push([x, y])
  }
  return pts
}

function Tangle() {
  const pts = tanglePoints()
  const focus = pts.reduce((b, p) => (p[0] - p[1] * 0.3 > b[0] - b[1] * 0.3 ? p : b), pts[0])
  const lens = { x: 238, y: 72, r: 52 }
  const beads = Array.from({ length: 6 }, (_, i) => [lens.x - 40 + i * 16, lens.y + (i % 2 ? -8 : 8)] as const)
  return (
    <Plate w={300} h={220}>
      <Draw d={smooth(pts)} className="f89-ln" delay={1.9} dur={2.2} style={{ strokeWidth: 2.2, stroke: 'var(--lv)' }} />
      <Fade delay={3.6}>
        {pts.map((p, i) => (i % 3 === 0 ? <circle key={i} cx={p[0]} cy={p[1]} r={2} fill="var(--edge)" /> : null))}
        <circle cx={focus[0]} cy={focus[1]} r={9} className="f89-thin" />
        <line className="f89-lead" x1={focus[0] + 3} y1={focus[1] - 9} x2={lens.x - 44} y2={lens.y - 28} />
        <line className="f89-lead" x1={focus[0] + 6} y1={focus[1] + 7} x2={lens.x - 26} y2={lens.y + 45} />
        <circle cx={lens.x} cy={lens.y} r={lens.r} className="f89-glass" />
        <line className="f89-ln" x1={lens.x + 37} y1={lens.y + 37} x2={lens.x + 52} y2={lens.y + 52} style={{ strokeWidth: 5 }} />
        <path d={beads.map((b, i) => `${i ? 'L' : 'M'}${b[0]} ${b[1]}`).join(' ')} className="f89-bond" fill="none" />
        {beads.map((b, i) => (
          <Atom key={i} x={b[0]} y={b[1]} el="C" r={6.5} label={false} fill={i % 2 ? '#8a6aa0' : '#6d4f82'} />
        ))}
        <text className="f89-lb f89-sm" x={lens.x - 6} y={lens.y + lens.r + 20} textAnchor="middle">
          1 kulička = –CH₂–CH₂–
        </text>
        <text className="f89-lb f89-sm" x={110} y={214} textAnchor="middle">
          klubko z tisíců jednotek
        </text>
      </Fade>
    </Plate>
  )
}

function Units() {
  return (
    <Plate w={300} h={220}>
      <Pop delay={2.6}>
        <text className="f89-lb f89-b" x={16} y={30}>
          PVC
        </text>
        <text className="f89-lb f89-sm" x={56} y={30}>
          z vinylchloridu, kód 3
        </text>
        <Mol
          atoms={[
            ['C', 70, 72, { h: [-90, 90] }],
            ['C', 110, 72, { h: [-90] }],
            ['Cl', 110, 102],
          ]}
          bonds={[
            [0, 1],
            [1, 2],
          ]}
        />
        <line className="f89-guide" x1={40} y1={72} x2={70} y2={72} />
        <line className="f89-guide" x1={110} y1={72} x2={140} y2={72} />
        <path className="f89-ln" style={{ stroke: 'var(--lv)' }} d="M54 44 h-4 v68 h4 M126 44 h4 v68 h-4" />
        <text className="f89-lb f89-lv" x={134} y={116}>
          n
        </text>
        <F x={200} y={78} t="–[CH_{2}–CHCl]_{n}–" size={12.5} />
      </Pop>
      <Pop delay={2.9}>
        <text className="f89-lb f89-b" x={16} y={146}>
          PET
        </text>
        <text className="f89-lb f89-sm" x={56} y={146}>
          polyester z lahví, kód 1
        </text>
        {/* –O–CO–C6H4–CO–O–CH2–CH2– */}
        <g transform="translate(14 186)">
          <text className="f89-sym" style={{ fontSize: 15 }} x={0} y={5}>
            [O–C
          </text>
          <line className="f89-bond" x1={34} y1={-6} x2={34} y2={-20} style={{ strokeWidth: 1.4 }} />
          <line className="f89-bond" x1={38} y1={-6} x2={38} y2={-20} style={{ strokeWidth: 1.4 }} />
          <text className="f89-sym" style={{ fontSize: 13 }} x={36} y={-24} textAnchor="middle">
            O
          </text>
          <line className="f89-bond" x1={44} y1={0} x2={56} y2={0} style={{ strokeWidth: 1.4 }} />
          <polygon points="60,0 70,-15 90,-15 100,0 90,15 70,15" className="f89-thin" style={{ strokeWidth: 1.4 }} />
          <circle cx={80} cy={0} r={8.5} className="f89-thin" />
          <line className="f89-bond" x1={100} y1={0} x2={112} y2={0} style={{ strokeWidth: 1.4 }} />
          <text className="f89-sym" style={{ fontSize: 15 }} x={114} y={5}>
            C–O–CH₂–CH₂]
          </text>
          <line className="f89-bond" x1={119} y1={-6} x2={119} y2={-20} style={{ strokeWidth: 1.4 }} />
          <line className="f89-bond" x1={123} y1={-6} x2={123} y2={-20} style={{ strokeWidth: 1.4 }} />
          <text className="f89-sym" style={{ fontSize: 13 }} x={121} y={-24} textAnchor="middle">
            O
          </text>
          <text className="f89-lb f89-lv" x={214} y={14}>
            n
          </text>
        </g>
      </Pop>
    </Plate>
  )
}
