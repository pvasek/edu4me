import { useId, type CSSProperties, type ReactNode } from 'react'
import '../illustrations.css'

/** Level colours in course order (mirrors src/courses/chemie/index.ts). */
const LEVEL_COLORS = ['#b8483a', '#bd6a26', '#9c7a12', '#56834a', '#2c7a72', '#3f6699', '#555a9e', '#7a5290', '#a84d6c']

const LABELS = [
  'Svět látek: baňky, kádinka se směsí a nálevka',
  'Uvnitř atomu: jádro a elektrony na drahách',
  'Vazby a názvosloví: dva atomy sdílejí elektrony, pod nimi krystalová mřížka',
  'Reakce a výpočty: váhy s molekulami na obou miskách',
  'Kyseliny, zásady a soli: zkumavky v barvách indikátoru',
  'Energie, rychlost a rovnováha: baterie, blesk a houpačka rovnováhy',
  'Chemie prvků: pec, minerály a dlaždice prvků',
  'Organická chemie: benzenové jádro a uhlovodíkový řetězec',
  'Biochemie: dvoušroubovice DNA a list',
]

const INK = 'var(--edge)'
const GLASS = 'color-mix(in srgb, var(--surface) 82%, transparent)'
const CPK = { H: '#f4f1ea', C: '#3b3b3b', O: '#d9493b', N: '#3d6fd1', Fe: '#b86a3c', Cu: '#c7773d', Na: '#8a63c9' }

interface Ctx {
  L: string
  /** ink hatch */
  hi: string
  /** level-colour hatch */
  hl: string
  /** dense ink hatch */
  hx: string
}

/** Engraved vignette for a course level (1–9), ~200×200, readable at 120 px. */
export function LevelVignette({
  level,
  size = 200,
  color,
  className,
}: {
  level: number
  size?: number
  /** override the level colour */
  color?: string
  className?: string
}) {
  const uid = useId().replace(/:/g, '')
  const idx = Math.min(9, Math.max(1, Math.round(level))) - 1
  const L = color ?? LEVEL_COLORS[idx]
  const c: Ctx = { L, hi: `url(#vi${uid})`, hl: `url(#vl${uid})`, hx: `url(#vx${uid})` }
  const Scene = SCENES[idx]
  return (
    <svg
      className={className ? `il-vignette ${className}` : 'il-vignette'}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={LABELS[idx]}
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern id={`vi${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.9" strokeOpacity="0.45" />
        </pattern>
        <pattern id={`vl${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill={L} fillOpacity="0.28" stroke="none" />
          <line x1="0" y1="0" x2="0" y2="4" stroke={L} strokeWidth="1.3" />
        </pattern>
        <pattern id={`vx${uid}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke={INK} strokeWidth="0.9" strokeOpacity="0.6" />
          <line x1="0" y1="0" x2="3" y2="0" stroke={INK} strokeWidth="0.6" strokeOpacity="0.35" />
        </pattern>
      </defs>
      {/* backdrop plate */}
      <circle cx="100" cy="100" r="92" fill={L} fillOpacity="0.09" stroke="none" />
      <circle cx="100" cy="100" r="92" stroke={L} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 4.5" />
      <Scene {...c} />
    </svg>
  )
}

/* ---------------------------------------------------------------- helpers */
const detail = { strokeWidth: 1.2 }

function Ground({ c, y = 172, rx = 72 }: { c: Ctx; y?: number; rx?: number }) {
  return <ellipse cx="100" cy={y} rx={rx} ry="6.5" fill={c.hi} stroke="none" />
}

function Atom({ x, y, r, fill, cls, style }: { x: number; y: number; r: number; fill: string; cls?: string; style?: CSSProperties }) {
  return (
    <g className={cls} style={style}>
      <circle cx={x} cy={y} r={r} fill={fill} />
      {/* engraved crescent highlight */}
      <path
        d={`M${x - r * 0.62} ${y - r * 0.05}a${r * 0.66} ${r * 0.66} 0 0 1 ${r * 0.58}-${r * 0.56}`}
        stroke="#fffaf0"
        strokeOpacity="0.8"
        strokeWidth={Math.max(1, r * 0.14)}
      />
    </g>
  )
}

function Bubble({ x, y, r = 2.6, delay = 0 }: { x: number; y: number; r?: number; delay?: number }) {
  return <circle className="a-bubble" cx={x} cy={y} r={r} strokeWidth="1.1" fill={GLASS} style={{ animationDelay: `${delay}s` }} />
}

function G({ cls, origin, delay, children }: { cls: string; origin?: string; delay?: number; children: ReactNode }) {
  const style: CSSProperties = {}
  if (origin) {
    style.transformOrigin = origin
    style.transformBox = 'view-box'
  }
  if (delay) style.animationDelay = `${delay}s`
  return (
    <g className={cls} style={style}>
      {children}
    </g>
  )
}

/* ---------------------------------------------------------------- 1 Svět látek */
function Matter(c: Ctx) {
  return (
    <>
      <Ground c={c} />
      {/* Erlenmeyer flask */}
      <path d="M70 60h24M73 60v34L44 158a8 8 0 0 0 7 12h62a8 8 0 0 0 7-12L91 94V60" fill={GLASS} />
      <path d="M58.5 126h47l14.7 32.5a8 8 0 0 1-7 11.5H51a8 8 0 0 1-7-11.5Z" fill={c.hl} stroke="none" />
      <path d="M58.5 126h47" stroke={c.L} strokeWidth="1.6" />
      <path d="M73 60v34L44 158a8 8 0 0 0 7 12h62a8 8 0 0 0 7-12L91 94V60" />
      <path d="M68 60h28" strokeWidth="2.6" />
      <path d="M80 70v20" {...detail} strokeOpacity="0.5" />
      <Bubble x={76} y={150} delay={0} />
      <Bubble x={88} y={156} r={2} delay={1.1} />
      <Bubble x={96} y={146} r={1.6} delay={2.1} />
      {/* beaker with a mixture */}
      <path d="M122 104h46M124 104v60a6 6 0 0 0 6 6h30a6 6 0 0 0 6-6v-60" fill={GLASS} />
      <path d="M124 134h42v30a6 6 0 0 1-6 6h-30a6 6 0 0 1-6-6Z" fill={c.L} fillOpacity="0.16" stroke="none" />
      <path d="M124 134h42" stroke={c.L} strokeWidth="1.4" />
      <path d="M121 104c2 0 3 1 3 3v57a6 6 0 0 0 6 6h30a6 6 0 0 0 6-6v-60" />
      <path d="M152 112h10M155 120h7M152 128h10" {...detail} />
      {/* particles: two kinds */}
      {[
        [132, 144],
        [150, 156],
        [140, 162],
        [158, 142],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="var(--blue)" strokeWidth="1" />
      ))}
      {[
        [143, 148],
        [131, 158],
        [156, 162],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill="var(--yellow)" strokeWidth="1" />
      ))}
      {/* funnel over the beaker */}
      <path d="M121 70h42l-17 20h-8Z" fill={GLASS} />
      <path d="M127 74h30l-12 13.5h-6Z" fill={c.hi} stroke="none" />
      <path d="M121 70h42l-17 20h-8Z" />
      <path d="M138 90v26l8-3V90" fill={GLASS} />
      <path d="M130 70l12 18 12-18" {...detail} />
      <G cls="a-bob" delay={0.4}>
        <path d="M142 124c1.6 2.2 2.6 3.8 2.6 5.2a2.6 2.6 0 0 1-5.2 0c0-1.4 1-3 2.6-5.2Z" fill={c.L} strokeWidth="1" />
      </G>
      {/* sparkle notes */}
      <path d="M44 48l3 6M36 60l6 2M56 42l-1 6" {...detail} stroke={c.L} />
    </>
  )
}

/* ---------------------------------------------------------------- 2 Uvnitř atomu */
function AtomScene(c: Ctx) {
  const nucleus: [number, number, boolean][] = [
    [100, 92, true],
    [110, 99, false],
    [90, 99, false],
    [100, 106, true],
    [110, 111, true],
    [91, 112, false],
    [100, 118, true],
  ]
  return (
    <>
      <circle cx="100" cy="104" r="62" strokeWidth="1" strokeDasharray="2 5" strokeOpacity="0.5" />
      <G cls="a-spin" origin="100px 104px">
        <ellipse cx="100" cy="104" rx="80" ry="28" />
        <circle cx="180" cy="104" r="6" fill={c.L} strokeWidth="1.6" />
      </G>
      <G cls="a-spin-slow" origin="100px 104px">
        <ellipse cx="100" cy="104" rx="80" ry="28" transform="rotate(60 100 104)" />
        <circle cx="60" cy="34.7" r="6" fill={c.L} strokeWidth="1.6" />
      </G>
      <G cls="a-spin" origin="100px 104px">
        <ellipse cx="100" cy="104" rx="80" ry="28" transform="rotate(-60 100 104)" />
        <circle cx="60" cy="173.3" r="6" fill={c.L} strokeWidth="1.6" />
      </G>
      <circle cx="100" cy="105" r="24" fill="var(--surface)" strokeWidth="1" strokeOpacity="0.5" />
      {nucleus.map(([x, y, p], i) =>
        p ? (
          <g key={i}>
            <Atom x={x} y={y} r={9} fill={c.L} />
            <path d={`M${x - 3.5} ${y}h7M${x} ${y - 3.5}v7`} stroke="#fffaf0" strokeWidth="1.5" />
          </g>
        ) : (
          <g key={i}>
            <circle cx={x} cy={y} r={9} fill="var(--surface)" />
            <circle cx={x} cy={y} r={9} fill={c.hx} strokeWidth="1.8" />
          </g>
        ),
      )}
    </>
  )
}

/* ---------------------------------------------------------------- 3 Vazby */
function Bonds(c: Ctx) {
  const ions: [number, number, boolean][] = []
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) ions.push([40 + k * 24, 146 + r * 22, (r + k) % 2 === 0])
  return (
    <>
      <G cls="a-bob">
        {/* electron clouds */}
        <circle cx="74" cy="72" r="36" fill={c.L} fillOpacity="0.1" strokeWidth="1.2" strokeDasharray="3 4" />
        <circle cx="126" cy="72" r="36" fill={c.hi} strokeWidth="1.2" strokeDasharray="3 4" />
        <Atom x={74} y={72} r={15} fill={c.L} />
        <Atom x={126} y={72} r={15} fill={CPK.C} />
        <text x="74" y="77.5" textAnchor="middle" fill="#fffaf0" stroke="none" style={{ font: 'italic 700 16px var(--font-display)' }}>
          A
        </text>
        <text x="126" y="77.5" textAnchor="middle" fill="#fffaf0" stroke="none" style={{ font: 'italic 700 16px var(--font-display)' }}>
          B
        </text>
        {/* shared pair */}
        <ellipse cx="100" cy="72" rx="9" ry="16" strokeWidth="1.3" stroke={c.L} />
        <circle className="a-glow" cx="100" cy="64" r="4" fill={c.L} stroke="none" />
        <circle className="a-glow" cx="100" cy="80" r="4" fill={c.L} stroke="none" style={{ animationDelay: '1.2s' }} />
        {/* lone electrons */}
        <circle cx="46" cy="60" r="2.6" fill={INK} stroke="none" />
        <circle cx="46" cy="84" r="2.6" fill={INK} stroke="none" />
        <circle cx="154" cy="60" r="2.6" fill={INK} stroke="none" />
        <circle cx="154" cy="84" r="2.6" fill={INK} stroke="none" />
      </G>
      {/* lattice */}
      <path d="M40 146h120M40 168h120M40 146v22M64 146v22M88 146v22M112 146v22M136 146v22M160 146v22" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M52 136l12 10M76 136l12 10M100 136l12 10M124 136l12 10M148 136l12 10" strokeWidth="1" strokeOpacity="0.4" />
      {ions.map(([x, y, a], i) =>
        a ? <Atom key={i} x={x} y={y} r={8} fill={c.L} /> : <circle key={i} cx={x} cy={y} r={6} fill="var(--surface)" strokeWidth="1.6" />,
      )}
      {ions
        .filter(([, , a]) => !a)
        .map(([x, y], i) => (
          <circle key={`h${i}`} cx={x} cy={y} r={6} fill={c.hi} stroke="none" />
        ))}
    </>
  )
}

/* ---------------------------------------------------------------- 4 Reakce a výpočty */
function Molecule2({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return (
    <g>
      <path d={`M${x - 6} ${y}h12`} strokeWidth="3" />
      <Atom x={x - 7} y={y} r={6.5} fill={a} />
      <Atom x={x + 7} y={y} r={6.5} fill={b} />
    </g>
  )
}
function Water({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 9} ${y + 6}L${x} ${y}l9 6`} strokeWidth="3" />
      <Atom x={x - 9} y={y + 6} r={5} fill={CPK.H} />
      <Atom x={x + 9} y={y + 6} r={5} fill={CPK.H} />
      <Atom x={x} y={y} r={7.5} fill={CPK.O} />
    </g>
  )
}
function Balance(c: Ctx) {
  return (
    <>
      <Ground c={c} y={174} rx={60} />
      <path d="M72 172h56l-6-10H78Z" fill={c.hi} />
      <path d="M100 162V62" strokeWidth="3" />
      <path d="M94 70h12l-6-12Z" fill={c.L} />
      <G cls="a-sway" origin="100px 64px">
        <path d="M30 64h140" strokeWidth="3" />
        <circle cx="100" cy="64" r="5" fill="var(--surface)" />
        {/* left pan: 2 H2 + O2 */}
        <path d="M34 66l-16 58M34 66l16 58M166 66l-16 58M166 66l16 58" strokeWidth="1.2" />
        <path d="M12 124h44a22 10 0 0 1-44 0Z" fill={c.hl} />
        <path d="M144 124h44a22 10 0 0 1-44 0Z" fill={c.hl} />
        <Molecule2 x={26} y={116} a={CPK.H} b={CPK.H} />
        <Molecule2 x={44} y={114} a={CPK.H} b={CPK.H} />
        <Molecule2 x={34} y={100} a={CPK.O} b={CPK.O} />
        <Water x={156} y={108} />
        <Water x={176} y={108} />
      </G>
      <text x="100" y="192" textAnchor="middle" fill={`color-mix(in srgb, ${c.L} 65%, var(--ink))`} stroke="none" style={{ font: 'italic 700 15px var(--font-display)' }}>
        m₁ = m₂
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 5 Kyseliny a zásady */
function Acids(c: Ctx) {
  const tubes = ['#d9493b', '#e88b35', '#e0b43a', '#4fae5a', '#3d6fd1', '#7a4fb3']
  return (
    <>
      <Ground c={c} y={170} />
      {tubes.map((col, i) => {
        const x = 40 + i * 24
        const top = 62
        const lvl = 110 + (i % 2) * 8
        return (
          <g key={i}>
            <path d={`M${x - 8} ${top}v84a8 8 0 0 0 16 0v-84`} fill={GLASS} />
            <path d={`M${x - 8} ${lvl}h16v36a8 8 0 0 1-16 0Z`} fill={col} fillOpacity="0.75" stroke="none" />
            <path d={`M${x - 8} ${lvl}h16v36a8 8 0 0 1-16 0Z`} fill={c.hi} stroke="none" />
            <path d={`M${x - 8} ${lvl}h16`} stroke={col} strokeWidth="1.6" />
            <path d={`M${x - 8} ${top}v84a8 8 0 0 0 16 0v-84M${x - 10} ${top}h20`} />
            <path d={`M${x - 3} ${top + 8}v26`} {...detail} strokeOpacity="0.45" />
            {i === 0 && <Bubble x={x + 2} y={148} r={2} delay={0.4} />}
            {i === 5 && <Bubble x={x - 2} y={150} r={2} delay={1.6} />}
          </g>
        )
      })}
      {/* rack */}
      <path d="M22 124h156v10H22Z" fill={c.L} fillOpacity="0.85" />
      <path d="M22 124h156v10H22Z" fill={c.hi} stroke="none" />
      <path d="M28 134v36M172 134v36M22 170h156" strokeWidth="2.4" />
      {/* dropper above */}
      <G cls="a-bob">
        <path d="M112 16h8v14a4 4 0 0 1-8 0Z" fill={c.L} />
        <path d="M113.5 34h5v14l-2.5 6-2.5-6Z" fill={GLASS} />
      </G>
      <path className="a-bubble" d="M116 58c1.8 2.4 2.8 4 2.8 5.4a2.8 2.8 0 0 1-5.6 0c0-1.4 1-3 2.8-5.4Z" fill="#3d6fd1" strokeWidth="1" style={{ animationDirection: 'reverse' }} />
      <text x="100" y="192" textAnchor="middle" fill={`color-mix(in srgb, ${c.L} 65%, var(--ink))`} stroke="none" style={{ font: 'italic 700 14px var(--font-display)' }}>
        pH 1 · 4 · 7 · 10 · 13
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 6 Energie, rychlost, rovnováha */
function Energy(c: Ctx) {
  return (
    <>
      <Ground c={c} y={176} rx={64} />
      {/* battery */}
      <g transform="rotate(-12 52 78)">
        <path d="M46 36h12v6H46Z" fill={INK} />
        <rect x="34" y="42" width="36" height="72" rx="5" fill="var(--surface)" />
        <rect x="34" y="72" width="36" height="42" rx="5" fill={c.L} fillOpacity="0.85" stroke="none" />
        <rect x="34" y="72" width="36" height="42" rx="0" fill={c.hi} stroke="none" />
        <rect x="34" y="42" width="36" height="72" rx="5" />
        <path d="M34 72h36" />
        <path d="M52 52v10M47 57h10" strokeWidth="2.2" />
        <path d="M47 94h10" stroke="#fffaf0" strokeWidth="2.2" />
      </g>
      {/* lightning */}
      <g className="a-glow">
        <path d="M138 20 112 66h18l-10 40 34-52h-19l12-34Z" fill="var(--yellow)" />
        <path d="M138 20 112 66h18l-10 40 34-52h-19l12-34Z" fill={c.hi} stroke="none" />
      </g>
      <path d="M160 36l10-4M164 50l10 2M104 36l-8-6" {...detail} stroke={c.L} />
      {/* equilibrium seesaw */}
      <path d="M100 150l-14 24h28Z" fill={c.hl} />
      <G cls="a-sway" origin="100px 150px">
        <path d="M34 150h132" strokeWidth="3.4" />
        <Molecule2 x={52} y={140} a={CPK.N} b={CPK.N} />
        <Molecule2 x={68} y={128} a={CPK.H} b={CPK.H} />
        <path d="M140 140l-8 6M140 140l8 6M140 140v-9" strokeWidth="2.6" />
        <Atom x={140} y={140} r={7} fill={CPK.N} />
        <Atom x={131} y={146} r={4.2} fill={CPK.H} />
        <Atom x={149} y={146} r={4.2} fill={CPK.H} />
        <Atom x={140} y={130} r={4.2} fill={CPK.H} />
      </G>
      <path d="M86 124h26l-5-4M114 132H88l5 4" strokeWidth="1.6" stroke={c.L} />
    </>
  )
}

/* ---------------------------------------------------------------- 7 Chemie prvků */
function Tile({ x, y, sym, z, fill }: { x: number; y: number; sym: string; z: number; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="32" rx="2" fill={fill} strokeWidth="1.6" />
      <text x={x + 4} y={y + 9} fill="var(--cat-ink)" stroke="none" style={{ font: '700 7px var(--font-mono)' }}>
        {z}
      </text>
      <text x={x + 15} y={y + 26} textAnchor="middle" fill="var(--cat-ink)" stroke="none" style={{ font: '700 16px var(--font-display)' }}>
        {sym}
      </text>
    </g>
  )
}
function Elements(c: Ctx) {
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* furnace */}
      <path d="M40 172l8-92h36l8 92Z" fill="var(--surface)" />
      <path d="M40 172l8-92h36l8 92Z" fill={c.hx} stroke="none" />
      <path d="M40 172l8-92h36l8 92Z" />
      <path d="M44 80h44v-8H44Z" fill={c.L} />
      <path d="M52 72V48h10v24M70 72V58h8v14" />
      <path d="M44 120h44M42 146h48" {...detail} />
      <path d="M56 172v-22a10 10 0 0 1 20 0v22Z" fill="var(--surface)" />
      <g className="a-flicker">
        <path d="M66 170c-8 0-10-6-8-11 1 3 3 4 4 4-1-6 2-10 5-13 0 5 7 7 7 13 0 4-3 7-8 7Z" fill="#e88b35" />
        <path d="M66 170c-3 0-4-2-3-5 1 1 2 1 2 1 0-2 1-4 2-5 0 2 3 3 3 5 0 2-1 4-4 4Z" fill="#e0b43a" stroke="none" />
      </g>
      <g className="a-drift">
        <circle cx="58" cy="40" r="5" strokeWidth="1.2" fill={GLASS} />
        <circle cx="66" cy="30" r="7" strokeWidth="1.2" fill={GLASS} />
        <circle cx="78" cy="22" r="5" strokeWidth="1.2" fill={GLASS} />
      </g>
      {/* periodic tiles */}
      <G cls="a-bob">
        <Tile x={108} y={42} sym="Fe" z={26} fill="var(--cat-transition)" />
        <Tile x={140} y={42} sym="Cu" z={29} fill="var(--cat-transition)" />
        <Tile x={124} y={76} sym="Na" z={11} fill="var(--cat-alkali)" />
      </G>
      {/* minerals */}
      <path d="M112 172l6-30 10-8 8 12 2 26Z" fill={c.L} fillOpacity="0.85" />
      <path d="M118 142l10 4 8 0M128 146v26" {...detail} stroke="#fffaf0" />
      <path d="M136 172l4-40 9-10 9 10 2 40Z" fill="var(--cat-metalloid)" />
      <path d="M140 132l9 6 9-6M149 138v34" {...detail} />
      <path d="M149 138l9-6 2 40h-11Z" fill={c.hi} stroke="none" />
      <path d="M158 172l4-22 7-6 7 8 0 20Z" fill="var(--cat-noble)" />
      <path d="M162 150l7 4 7-2M169 154v18" {...detail} />
    </>
  )
}

/* ---------------------------------------------------------------- 8 Organická chemie */
function Organic(c: Ctx) {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 90) * Math.PI) / 180
    return [100 + 38 * Math.cos(a), 72 + 38 * Math.sin(a)] as const
  })
  const chain: [number, number][] = [
    [34, 156],
    [60, 142],
    [86, 156],
    [112, 142],
    [138, 156],
    [164, 142],
  ]
  return (
    <>
      <Ground c={c} y={180} rx={70} />
      <G cls="a-spin-slow" origin="100px 72px">
        <path d={`M${hex.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`} fill={c.hl} strokeWidth="3" />
        <circle cx="100" cy="72" r="21" strokeWidth="2" stroke={c.L} strokeDasharray="4 3" />
        {hex.map(([x, y], i) => {
          const hx = 100 + (x - 100) * 1.45
          const hy = 72 + (y - 72) * 1.45
          return (
            <g key={i}>
              <path d={`M${x} ${y}L${hx} ${hy}`} strokeWidth="2" />
              <Atom x={hx} y={hy} r={5} fill={CPK.H} />
            </g>
          )
        })}
        {hex.map(([x, y], i) => (
          <Atom key={`c${i}`} x={x} y={y} r={7} fill={CPK.C} />
        ))}
      </G>
      {/* chain */}
      <path d={`M${chain.map(([x, y]) => `${x} ${y}`).join('L')}`} strokeWidth="3" />
      {chain.map(([x, y], i) => {
        const up = i % 2 === 1
        const dy = up ? -14 : 14
        return (
          <g key={i}>
            <path d={`M${x} ${y}l-8 ${dy}M${x} ${y}l8 ${dy}`} strokeWidth="1.6" />
            <Atom x={x - 8} y={y + dy} r={4} fill={CPK.H} />
            <Atom x={x + 8} y={y + dy} r={4} fill={CPK.H} />
          </g>
        )
      })}
      {chain.map(([x, y], i) => (
        <Atom key={`k${i}`} x={x} y={y} r={6.5} fill={CPK.C} />
      ))}
    </>
  )
}

/* ---------------------------------------------------------------- 9 Biochemie */
function Bio(c: Ctx) {
  const N = 9
  const rungs = Array.from({ length: N }, (_, i) => {
    const y = 30 + i * 16
    const ph = (i / (N - 1)) * Math.PI * 2
    return { y, x1: 70 + 26 * Math.sin(ph), x2: 70 - 26 * Math.sin(ph) }
  })
  const strand = (s: number) => {
    let d = ''
    for (let k = 0; k <= 64; k++) {
      const t = k / 64
      const y = 22 + t * 144
      const ph = ((y - 30) / 128) * Math.PI * 2
      const x = 70 + s * 26 * Math.sin(ph)
      d += `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return d
  }
  const base = ['#d9493b', '#3d6fd1', '#e0b43a', '#4fae5a']
  return (
    <>
      <Ground c={c} y={176} rx={70} />
      {rungs.map((r, i) => (
        <g key={i}>
          <path d={`M${r.x1} ${r.y}H70`} stroke={base[i % 4]} strokeWidth="4" />
          <path d={`M70 ${r.y}H${r.x2}`} stroke={base[(i + 2) % 4]} strokeWidth="4" />
        </g>
      ))}
      <path d={strand(-1)} strokeWidth="5" stroke={INK} strokeOpacity="0.35" />
      <path d={strand(1)} strokeWidth="5" stroke={c.L} />
      <path d={strand(1)} strokeWidth="1" stroke="#fffaf0" strokeOpacity="0.6" />
      {/* leaf */}
      <G cls="a-sway" origin="120px 172px">
        <path d="M120 172c-6-40 8-92 58-108 8 50-12 98-58 108Z" fill={c.L} fillOpacity="0.2" />
        <path d="M120 172c-6-40 8-92 58-108 8 50-12 98-58 108Z" fill={c.hi} stroke="none" />
        <path d="M120 172c-6-40 8-92 58-108 8 50-12 98-58 108Z" strokeWidth="2.2" />
        <path d="M120 172c12-34 30-68 56-104" strokeWidth="1.8" />
        <path d="M130 146l-6-20M130 146l20-6M140 124l-4-22M140 124l22-8M152 102l-2-16M152 102l18-10" strokeWidth="1.2" />
      </G>
      <g className="a-drift">
        <circle cx="168" cy="150" r="3" fill={c.L} stroke="none" />
        <circle cx="178" cy="136" r="2.2" fill={c.L} stroke="none" />
      </g>
    </>
  )
}

const SCENES = [Matter, AtomScene, Bonds, Balance, Acids, Energy, Elements, Organic, Bio]
