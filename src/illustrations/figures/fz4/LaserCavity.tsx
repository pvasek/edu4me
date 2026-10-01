import { StepFilm } from '../../sequence/StepFigure'
import { Arrow, Fade, Figure, Frame, Pop, Sym, pat, sine, useFig } from './kit'

const LABEL =
  'Jak vzniká laserový paprsek, animace po krocích. Laser tvoří aktivní prostředí (tyč) mezi dvěma zrcadly: vlevo úplně odrazné zrcadlo, vpravo polopropustné. 1. Čerpání: výbojka dodá atomům energii a většina atomů přejde do excitovaného stavu – vznikne inverzní populace. 2. Stimulovaná emise: foton dopadne na excitovaný atom a vyvolá vyzáření druhého fotonu se stejnou energií, směrem i fází; z jednoho fotonu jsou dva, pak čtyři, lavina roste. 3. Rezonátor a svazek: zrcadla vracejí fotony tam a zpět tyčí, takže lavina dál roste, a polopropustným zrcadlem vychází úzký, souběžný a koherentní laserový svazek.'

const W = 420
const H = 250
const RX0 = 70
const RX1 = 350
const RY0 = 96
const RY1 = 150

type Step = 0 | 1 | 2

const ATOMS = Array.from({ length: 30 }, (_, i) => ({ x: 88 + (i % 10) * 27, y: 108 + Math.floor(i / 10) * 15, i }))
const GROUND_AT_START = new Set([3, 11, 17, 26, 8, 22])

function Photon({ x, y, back = false, len = 26 }: { x: number; y: number; back?: boolean; len?: number }) {
  return (
    <g transform={`translate(${x} ${y})${back ? ' scale(-1 1)' : ''}`}>
      <path d={sine(0, 0, len, 3, 8.6)} className="fz4-laser-photon" />
      <path d={`M${len} -4 L${len + 8} 0 L${len} 4Z`} className="fz4-laser-head" />
    </g>
  )
}

function Cavity() {
  const { id } = useFig()
  return (
    <g>
      <rect x={RX0} y={RY0} width={RX1 - RX0} height={RY1 - RY0} rx={6} className="fz4-o fz4-gainrod" />
      <rect x={RX0} y={RY0} width={RX1 - RX0} height={RY1 - RY0} rx={6} fill={pat(id, 'd')} opacity={0.35} />
      {/* mirrors */}
      <rect x={48} y={80} width={14} height={86} rx={2} className="fz4-o fz4-mirror-full" />
      <rect x={48} y={80} width={14} height={86} rx={2} fill={pat(id, 'xd')} />
      <rect x={358} y={80} width={8} height={86} rx={2} className="fz4-o fz4-mirror-half" />
      <text x={55} y={30} textAnchor="middle" className="fz4-lbl fz4-sm fz4-b">
        zrcadlo
      </text>
      <text x={55} y={46} textAnchor="middle" className="fz4-lbl fz4-sm">
        odrazí 100 %
      </text>
      <text x={372} y={30} textAnchor="middle" className="fz4-lbl fz4-sm fz4-b">
        polopropustné
      </text>
      <text x={372} y={46} textAnchor="middle" className="fz4-lbl fz4-sm">
        zrcadlo
      </text>
      {/* flash lamp */}
      <rect x={110} y={56} width={200} height={14} rx={7} className="fz4-o fz4-lamp" />
      <text x={210} y={46} textAnchor="middle" className="fz4-lbl fz4-sm fz4-b">
        výbojka (čerpání)
      </text>
      <text x={RX0 + 4} y={RY1 + 20} className="fz4-lbl fz4-sm fz4-muted-t">
        aktivní prostředí
      </text>
    </g>
  )
}

function Atoms({ excited }: { excited: (i: number) => boolean }) {
  return (
    <g>
      {ATOMS.map((a) =>
        excited(a.i) ? (
          <g key={a.i}>
            <circle cx={a.x} cy={a.y} r={6.5} className="fz4-atom-glow" />
            <circle cx={a.x} cy={a.y} r={4} className="fz4-atom-ex" />
          </g>
        ) : (
          <circle key={a.i} cx={a.x} cy={a.y} r={4} className="fz4-atom-gr" />
        ),
      )}
    </g>
  )
}

function Legend() {
  return (
    <g>
      <circle cx={222} cy={RY1 + 26} r={6.5} className="fz4-atom-glow" />
      <circle cx={222} cy={RY1 + 26} r={4} className="fz4-atom-ex" />
      <text x={232} y={RY1 + 31} className="fz4-lbl fz4-sm">
        excitovaný
      </text>
      <circle cx={314} cy={RY1 + 26} r={4} className="fz4-atom-gr" />
      <text x={324} y={RY1 + 31} className="fz4-lbl fz4-sm">
        základní stav
      </text>
    </g>
  )
}

function Pump() {
  return (
    <g>
      <Atoms excited={(i) => !GROUND_AT_START.has(i)} />
      <Fade delay={0.2}>
        {[130, 170, 210, 250, 290].map((x) => (
          <path key={x} d={`M${x + 4} 72 L${x - 3} 82 H${x + 3} L${x - 4} 93`} className="fz4-pump" />
        ))}
      </Fade>
      <Legend />
      <Pop delay={0.6}>
        <rect x={86} y={196} width={248} height={32} rx={6} className="fz4-tag-lvl" />
        <text x={210} y={217} textAnchor="middle" className="fz4-lbl fz4-b">
          inverzní populace: 24 z 30 excitováno
        </text>
      </Pop>
    </g>
  )
}

/** Stimulated emission: one photon → two → four, the atoms they pass fall to the ground state. */
const CASCADE: { x: number; y: number }[][] = [[{ x: 84, y: 123 }], [{ x: 150, y: 116 }, { x: 150, y: 130 }], [{ x: 232, y: 106 }, { x: 232, y: 118 }, { x: 232, y: 130 }, { x: 232, y: 142 }]]

function Cascade() {
  return (
    <g>
      <Atoms excited={(i) => !GROUND_AT_START.has(i) && !(i % 10 === 2 || i % 10 === 4 || i % 10 === 5)} />
      {CASCADE.map((col, k) => (
        <Fade key={k} delay={0.15 + k * 0.35}>
          {col.map((p, j) => (
            <Photon key={j} x={p.x} y={p.y} />
          ))}
        </Fade>
      ))}
      {/* the act itself, on two levels */}
      <Fade delay={0.4}>
        <path d="M100 194 H176 M100 236 H176" className="fz4-level" />
        <Sym x={92} y={199} t="E_{2}" anchor="end" className="fz4-sym-sm" />
        <Sym x={92} y={241} t="E_{1}" anchor="end" className="fz4-sym-sm" />
        <Arrow d="M138 196 V232" tone="ink" />
        <circle cx={138} cy={194} r={6.5} className="fz4-atom-glow" />
        <circle cx={138} cy={194} r={4} className="fz4-atom-ex" />
        <circle cx={138} cy={236} r={4} className="fz4-atom-gr" />
        <Photon x={50} y={215} len={22} />
        <Photon x={186} y={206} len={22} />
        <Photon x={186} y={222} len={22} />
        <text x={226} y={210} className="fz4-lbl fz4-sm">
          dopadající foton
        </text>
        <text x={226} y={228} className="fz4-lbl fz4-sm">
          + stejný nový foton
        </text>
      </Fade>
    </g>
  )
}

function Beam() {
  return (
    <g>
      <Atoms excited={(i) => i % 3 !== 0} />
      <Fade delay={0.1}>
        {[104, 116, 128, 140].map((y, j) => (
          <g key={y}>
            <Photon x={96 + (j % 2) * 60} y={y} back={j % 2 === 1} />
            <Photon x={190 + (j % 2) * 40} y={y} back={j % 2 === 0} />
            <Photon x={290 - (j % 2) * 30} y={y} />
          </g>
        ))}
      </Fade>
      <Fade delay={0.5}>
        <rect x={366} y={113} width={W - 366} height={20} className="fz4-laser-beam" />
        <Arrow d={`M372 123 H${W - 4}`} tone="red" className="fz4-vec" />
        <text x={W - 6} y={182} textAnchor="end" className="fz4-lbl fz4-b fz4-red-t">
          laserový svazek
        </text>
      </Fade>
      <Pop delay={0.8}>
        <rect x={60} y={196} width={300} height={32} rx={6} className="fz4-tag-lvl" />
        <text x={210} y={217} textAnchor="middle" className="fz4-lbl fz4-b">
          stejná vlnová délka, směr i fáze
        </text>
      </Pop>
    </g>
  )
}

const STEPS = [
  {
    title: 'Čerpání',
    caption: 'Výbojka dodá atomům energii. Většina přejde do excitovaného stavu – vznikne inverzní populace.',
  },
  {
    title: 'Stimulovaná emise',
    caption: 'Foton dopadne na excitovaný atom a vyvolá vyzáření druhého, stejného fotonu. Z jednoho jsou dva, pak čtyři…',
  },
  {
    title: 'Rezonátor a svazek',
    caption: 'Zrcadla vracejí fotony tam a zpět a lavina roste. Polopropustným zrcadlem vychází úzký souběžný svazek.',
  },
]

export default function LaserCavity() {
  return (
    <Figure level={12} label={LABEL} max={600} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s, k) => ({
          ...s,
          art: (
            <Frame w={W} h={H}>
              <Cavity />
              {(k as Step) === 0 ? <Pump /> : k === 1 ? <Cascade /> : <Beam />}
            </Frame>
          ),
        }))}
      />
    </Figure>
  )
}

