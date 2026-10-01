import { DrawArrow, Fade, Figure, Pop, pat, rng, useCompact, useFig } from './kit'

const LABEL =
  'Vývoj hvězd. Hvězda vzniká smrštěním mlhoviny z plynu a prachu. Hvězda s hmotností podobnou Slunci svítí miliardy let na hlavní posloupnosti, pak se nafoukne v červeného obra, odhodí obal jako planetární mlhovinu a zbude bílý trpaslík. Hmotná hvězda (více než asi osmkrát hmotnější než Slunce) se stane červeným veleobrem a skončí výbuchem supernovy; zůstane po ní neutronová hvězda, nebo u nejhmotnějších hvězd černá díra.'

type Kind = 'nebula' | 'sun' | 'massive' | 'giant' | 'super' | 'pn' | 'wd' | 'sn' | 'ns' | 'bh'
interface Node {
  k: Kind
  t: string[]
}
const NODES: Record<Kind, Node> = {
  nebula: { k: 'nebula', t: ['mlhovina', '(plyn a prach)'] },
  sun: { k: 'sun', t: ['hvězda', 'jako Slunce'] },
  massive: { k: 'massive', t: ['hmotná', 'hvězda'] },
  giant: { k: 'giant', t: ['červený obr'] },
  super: { k: 'super', t: ['červený veleobr'] },
  pn: { k: 'pn', t: ['planetární', 'mlhovina'] },
  wd: { k: 'wd', t: ['bílý trpaslík'] },
  sn: { k: 'sn', t: ['supernova'] },
  ns: { k: 'ns', t: ['neutronová', 'hvězda'] },
  bh: { k: 'bh', t: ['černá díra'] },
}
/** Radius of each drawing (for labels and arrows). */
const RAD: Record<Kind, number> = {
  nebula: 38,
  sun: 17,
  massive: 22,
  giant: 30,
  super: 36,
  pn: 24,
  wd: 8,
  sn: 30,
  ns: 8,
  bh: 16,
}

function Art({ k, x, y }: { k: Kind; x: number; y: number }) {
  const { id } = useFig()
  switch (k) {
    case 'nebula': {
      const R = rng(3)
      return (
        <g>
          <path
            d={`M${x - 36} ${y + 6} C${x - 44} ${y - 20} ${x - 14} ${y - 36} ${x + 2} ${y - 24} C${x + 20} ${y - 40} ${x + 46} ${y - 14} ${x + 34} ${y + 6} C${x + 44} ${y + 28} ${x + 8} ${y + 36} ${x - 6} ${y + 24} C${x - 24} ${y + 36} ${x - 44} ${y + 26} ${x - 36} ${y + 6}Z`}
            className="fz3-nebula"
          />
          <path
            d={`M${x - 36} ${y + 6} C${x - 44} ${y - 20} ${x - 14} ${y - 36} ${x + 2} ${y - 24} C${x + 20} ${y - 40} ${x + 46} ${y - 14} ${x + 34} ${y + 6} C${x + 44} ${y + 28} ${x + 8} ${y + 36} ${x - 6} ${y + 24} C${x - 24} ${y + 36} ${x - 44} ${y + 26} ${x - 36} ${y + 6}Z`}
            fill={pat(id, 'dots')}
          />
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={x - 22 + R() * 44} cy={y - 16 + R() * 32} r={1.6} className="fz3-star-dot" />
          ))}
        </g>
      )
    }
    case 'sun':
      return (
        <g>
          <circle cx={x} cy={y} r={24} className="fz3-sun-halo" />
          <circle cx={x} cy={y} r={17} className="fz3-sun" />
        </g>
      )
    case 'massive':
      return (
        <g>
          <circle cx={x} cy={y} r={29} className="fz3-halo-blue" />
          <circle cx={x} cy={y} r={22} className="fz3-o fz3-bluestar" />
        </g>
      )
    case 'giant':
    case 'super':
      return (
        <g>
          <circle cx={x} cy={y} r={RAD[k] + 6} className="fz3-halo-red" />
          <circle cx={x} cy={y} r={RAD[k]} className="fz3-o fz3-redstar" />
          <circle cx={x} cy={y} r={RAD[k]} fill={pat(id, 'dots')} opacity={0.5} />
        </g>
      )
    case 'pn':
      return (
        <g>
          <ellipse cx={x} cy={y} rx={24} ry={18} className="fz3-pn" />
          <ellipse cx={x} cy={y} rx={14} ry={10} className="fz3-pn-in" />
          <circle cx={x} cy={y} r={3} className="fz3-o fz3-wd" />
        </g>
      )
    case 'wd':
      return (
        <g>
          <circle cx={x} cy={y} r={14} className="fz3-halo-blue" />
          <circle cx={x} cy={y} r={7} className="fz3-o fz3-wd" />
        </g>
      )
    case 'sn': {
      const pts = Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12
        const r = i % 2 ? 14 : 30 - (i % 4) * 3
        return `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`
      })
      return (
        <g>
          <path d={`M${pts.join(' L')}Z`} className="fz3-o fz3-sn" />
          <circle cx={x} cy={y} r={8} className="fz3-sn-core" />
        </g>
      )
    }
    case 'ns':
      return (
        <g>
          <path d={`M${x - 16} ${y - 22} L${x + 16} ${y + 22}`} className="fz3-pulsar" />
          <circle cx={x} cy={y} r={6} className="fz3-o fz3-bluestar" />
        </g>
      )
    case 'bh':
      return (
        <g>
          <ellipse cx={x} cy={y} rx={26} ry={7} className="fz3-disk" />
          <circle cx={x} cy={y} r={14} className="fz3-bh" />
          <path d={`M${x - 26} ${y} A26 7 0 0 0 ${x + 26} ${y}`} className="fz3-disk-front" />
        </g>
      )
  }
}

type Pos = Record<Kind, [number, number]>
const WIDE: Pos = {
  nebula: [60, 166],
  sun: [178, 80],
  giant: [300, 80],
  pn: [436, 80],
  wd: [566, 80],
  massive: [178, 252],
  super: [300, 252],
  sn: [436, 252],
  ns: [566, 214],
  bh: [566, 294],
}
const NARROW: Pos = {
  nebula: [170, 48],
  sun: [90, 176],
  massive: [250, 176],
  giant: [90, 318],
  super: [250, 318],
  pn: [90, 446],
  sn: [250, 446],
  wd: [90, 560],
  ns: [214, 560],
  bh: [292, 560],
}
const EDGES: [Kind, Kind][] = [
  ['nebula', 'sun'],
  ['nebula', 'massive'],
  ['sun', 'giant'],
  ['giant', 'pn'],
  ['pn', 'wd'],
  ['massive', 'super'],
  ['super', 'sn'],
  ['sn', 'ns'],
  ['sn', 'bh'],
]
const ORDER: Kind[] = ['nebula', 'sun', 'massive', 'giant', 'super', 'pn', 'sn', 'wd', 'ns', 'bh']

export default function StarLifeCycle() {
  const compact = useCompact()
  const n = compact.narrow
  const P = n ? NARROW : WIDE
  const lblY = (k: Kind) => P[k][1] + Math.max(RAD[k], 12) + (n ? 20 : 18)
  const lblBottom = (k: Kind) => lblY(k) + (NODES[k].t.length - 1) * 18 + 8
  const edge = (a: Kind, b: Kind) => {
    let [x1, y1] = P[a]
    if (a === 'nebula' && !n) [x1, y1] = [96, b === 'sun' ? 150 : 184]
    const [x2, y2] = P[b]
    const d = Math.hypot(x2 - x1, y2 - y1)
    const ux = (x2 - x1) / d
    const uy = (y2 - y1) / d
    // leave below the label when the arrow heads down
    const s = a === 'nebula' ? (n ? RAD[a] + 4 : 0) : uy > 0.5 ? Math.max(RAD[a] + 8, (lblBottom(a) - y1) / uy) : RAD[a] + 8
    const e = RAD[b] + 10
    return `M${(x1 + ux * s).toFixed(1)} ${(y1 + uy * s).toFixed(1)} L${(x2 - ux * e).toFixed(1)} ${(y2 - uy * e).toFixed(1)}`
  }
  const nebLbl = n ? { x: 216, y: 44, a: 'start' as const } : null
  return (
    <Figure level={7} w={n ? 340 : 640} h={n ? 622 : 356} max={n ? 420 : 700} compact={compact} boost={false} label={LABEL}>
      {EDGES.map(([a, b], i) => (
        <DrawArrow key={i} d={edge(a, b)} tone="muted" delay={0.15 + ORDER.indexOf(b) * 0.14} />
      ))}
      {ORDER.map((k, i) => (
        <g key={k}>
          <Pop delay={0.05 + i * 0.14}>
            <Art k={k} x={P[k][0]} y={P[k][1]} />
          </Pop>
          <Fade delay={0.2 + i * 0.14}>
            <text
              x={k === 'nebula' && nebLbl ? nebLbl.x : P[k][0]}
              y={k === 'nebula' && nebLbl ? nebLbl.y : lblY(k)}
              textAnchor={k === 'nebula' && nebLbl ? 'start' : 'middle'}
              className="fz3-lbl fz3-b"
            >
              {NODES[k].t.map((line, j) => (
                <tspan key={j} x={k === 'nebula' && nebLbl ? nebLbl.x : P[k][0]} dy={j ? 18 : 0}>
                  {line}
                </tspan>
              ))}
            </text>
          </Fade>
        </g>
      ))}
      <Fade delay={0.4}>
        {n ? (
          <>
            <text x={100} y={104} textAnchor="end" className="fz3-cap fz3-lvl-t">
              malá
            </text>
            <text x={100} y={118} textAnchor="end" className="fz3-cap fz3-lvl-t">
              hmotnost
            </text>
            <text x={240} y={104} className="fz3-cap fz3-lvl-t">
              velká
            </text>
            <text x={240} y={118} className="fz3-cap fz3-lvl-t">
              hmotnost
            </text>
          </>
        ) : (
          <>
            <text x={126} y={160} className="fz3-cap fz3-lvl-t">
              malá hmotnost
            </text>
            <text x={134} y={194} className="fz3-cap fz3-lvl-t">
              velká hmotnost
            </text>
          </>
        )}
      </Fade>
    </Figure>
  )
}
