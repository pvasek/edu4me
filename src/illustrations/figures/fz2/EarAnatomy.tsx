import { DrawArrow, Fade, Figure, Num, Pop, pat, useCompact, useFig } from './kit'

const SKIN = '#e8b89a'
const BONE = '#efe3c6'
const NERVE = '#e0b43a'
const FLUID = '#bcd7ec'

const PARTS: { n: number; t: string; at: [number, number]; to?: [number, number] }[] = [
  { n: 1, t: 'boltec', at: [40, 206] },
  { n: 2, t: 'zvukovod', at: [128, 178], to: [128, 153] },
  { n: 3, t: 'bubínek', at: [178, 86], to: [191, 122] },
  { n: 4, t: 'kladívko', at: [204, 60], to: [206, 104] },
  { n: 5, t: 'kovadlinka', at: [232, 54], to: [222, 104] },
  { n: 6, t: 'třmínek', at: [240, 204], to: [237, 146] },
  { n: 7, t: 'hlemýžď – sluch', at: [312, 246], to: [300, 206] },
  { n: 8, t: 'sluchový nerv', at: [372, 104], to: [362, 136] },
  { n: 9, t: 'polokruhovité kanálky', at: [300, 40], to: [282, 72] },
  { n: 10, t: 'Eustachova trubice', at: [204, 282], to: [230, 262] },
]

/** Archimedean spiral (cochlea) around c from radius r0 inwards. */
function spiral(c: [number, number], r0: number, turns: number, a0: number) {
  let d = ''
  const n = Math.round(turns * 40)
  for (let i = 0; i <= n; i++) {
    const k = i / n
    const a = a0 + k * turns * 2 * Math.PI
    const r = r0 * (1 - 0.8 * k)
    d += `${i ? 'L' : 'M'}${(c[0] + Math.cos(a) * r).toFixed(1)} ${(c[1] + Math.sin(a) * r).toFixed(1)} `
  }
  return d
}

function Ear() {
  const { id } = useFig()
  const pinna = 'M82 96 C70 58 34 40 20 64 C8 86 14 132 22 168 C30 210 44 250 70 254 C86 256 88 236 82 214 C78 196 80 176 84 164 L84 118Z'
  return (
    <g>
      {/* temporal bone and head */}
      <Pop delay={0}>
        <path d="M84 70 Q120 40 170 34 H400 V304 H170 Q120 296 84 262Z" className="fz2-o fz2-fill2" />
        <path d="M150 38 H400 V300 H150 Q140 170 150 38Z" fill={pat(id, 'd')} opacity={0.7} />
      </Pop>
      {/* outer ear: pinna and canal */}
      <Pop delay={0.1}>
        <path d={pinna} fill={SKIN} className="fz2-o" />
        <path d="M60 80 C40 76 32 110 38 150 C42 190 52 220 66 232" className="fz2-o fz2-thin" />
        <path d="M78 128 Q130 124 190 124 V158 Q130 158 78 154Z" className="fz2-o fz2-fill" />
        <path d="M78 128 Q130 124 190 124 V158 Q130 158 78 154Z" fill={SKIN} fillOpacity={0.35} />
      </Pop>
      {/* middle ear */}
      <Pop delay={0.25}>
        <path d="M196 104 Q196 96 204 96 H240 Q248 96 248 104 V170 Q248 180 238 180 H206 Q196 180 196 170Z" className="fz2-o fz2-fill" />
        <path d="M218 178 Q222 230 232 296 H250 Q238 230 236 178Z" className="fz2-o fz2-fill" />
        <path d="M188 120 Q198 141 190 162" fill="none" className="fz2-drum" />
        {/* malleus, incus, stapes */}
        <path d="M193 144 L204 116" className="fz2-bone-o" />
        <path d="M193 144 L204 116" className="fz2-bone" />
        <circle cx={206} cy={110} r={7} fill={BONE} className="fz2-o" />
        <path d="M216 104 Q226 100 229 110 Q230 120 222 122 L226 140" fill={BONE} className="fz2-o" />
        <path d="M226 140 L242 132 V150Z" fill={BONE} className="fz2-o" />
        <path d="M246 128 V154" className="fz2-o fz2-thick" />
      </Pop>
      {/* inner ear */}
      <Pop delay={0.4}>
        <ellipse cx={258} cy={140} rx={12} ry={16} fill={FLUID} className="fz2-o" />
        <ellipse cx={262} cy={92} rx={13} ry={26} fill="none" className="fz2-canal" />
        <ellipse cx={262} cy={92} rx={13} ry={26} fill="none" className="fz2-canal-in" />
        <ellipse cx={280} cy={104} rx={24} ry={11} fill="none" className="fz2-canal" />
        <ellipse cx={280} cy={104} rx={24} ry={11} fill="none" className="fz2-canal-in" />
        <ellipse cx={250} cy={100} rx={10} ry={18} transform="rotate(-30 250 100)" fill="none" className="fz2-canal" />
        <ellipse cx={250} cy={100} rx={10} ry={18} transform="rotate(-30 250 100)" fill="none" className="fz2-canal-in" />
        <circle cx={292} cy={180} r={36} fill={FLUID} className="fz2-o" />
        <path d={spiral([292, 180], 30, 2.4, Math.PI)} className="fz2-o fz2-thick" />
        <path d="M266 152 Q262 162 262 172" className="fz2-o" />
        {/* auditory nerve */}
        {[-4, 0, 4].map((o) => (
          <path key={o} d={`M300 ${174 + o} C330 ${170 + o} 350 ${140 + o} 398 ${132 + o}`} className="fz2-nerve" style={{ stroke: NERVE }} />
        ))}
      </Pop>

      {/* sound */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${46 + i * 12} 118 Q${56 + i * 12} 140 ${46 + i * 12} 162`} className="fz2-o fz2-soundarc" />
      ))}
      <DrawArrow d="M90 141 H176" tone="lvl" delay={0.7} className="fz2-wide" />
      <DrawArrow d="M372 150 L396 146" tone="lvl" delay={1.2} />
    </g>
  )
}

export default function EarAnatomy() {
  const compact = useCompact()
  const n = compact.narrow
  const W = n ? 404 : 590
  const legend = PARTS.map((_, i) =>
    n ? { x: 8 + (i % 2) * 198, y: 334 + Math.floor(i / 2) * 28 } : { x: 420, y: 44 + i * 25 },
  )
  return (
    <Figure
      level={4}
      w={W}
      h={n ? 496 : 338}
      max={660}
      compact={compact}
      boost={false}
      label="Stavba ucha a cesta zvuku. Vnější ucho tvoří boltec a zvukovod, který končí bubínkem. Ve středním uchu jsou tři sluchové kůstky: kladívko, kovadlinka a třmínek; Eustachova trubice spojuje středouší s nosohltanem. Vnitřní ucho tvoří hlemýžď se sluchovými buňkami a polokruhovité kanálky pro rovnováhu. Zvuk rozkmitá bubínek, kůstky kmity zesílí a předají do tekutiny v hlemýždi, odkud vede sluchový nerv signál do mozku."
    >
      <Fade delay={0}>
        <text x={100} y={20} textAnchor="middle" className="fz2-cap">
          vnější ucho
        </text>
        <text x={221} y={20} textAnchor="middle" className="fz2-cap">
          střední
        </text>
        <text x={318} y={20} textAnchor="middle" className="fz2-cap">
          vnitřní ucho
        </text>
      </Fade>
      <Ear />
      <Fade delay={0.9}>
        {PARTS.map((p) => (
          <g key={p.n}>
            {p.to && <line x1={p.at[0]} y1={p.at[1]} x2={p.to[0]} y2={p.to[1]} className="fz2-lead" />}
            <Num x={p.at[0]} y={p.at[1]} n={p.n} r={9.5} />
          </g>
        ))}
        {PARTS.map((p, i) => (
          <g key={`l${p.n}`}>
            <Num x={legend[i].x + 10} y={legend[i].y - 5} n={p.n} r={9.5} />
            <text x={legend[i].x + 26} y={legend[i].y} className={n ? 'fz2-leg fz2-leg-lg' : 'fz2-leg'}>
              {p.t}
            </text>
          </g>
        ))}
        <text x={14} y={n ? 486 : 328} className="fz2-lbl fz2-sm fz2-lvl-t">
          cesta zvuku: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → mozek
        </text>
      </Fade>
    </Figure>
  )
}
