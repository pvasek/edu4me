import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, Val, pat, useFig } from './kit'

const W = 200
const H = 250
const R = 16

function Ceiling() {
  const { id } = useFig()
  return (
    <g>
      <rect x={10} y={2} width={W - 20} height={10} fill={pat(id, 'd')} />
      <path d={`M10 12 H${W - 10}`} className="fz1-o" />
    </g>
  )
}

function Wheel({ x, y, r = R }: { x: number; y: number; r?: number }) {
  const { id } = useFig()
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="fz1-o fz1-metal" />
      <circle cx={x} cy={y} r={r} fill={pat(id, 'd')} opacity={0.4} />
      <circle cx={x} cy={y} r={r - 4} className="fz1-o fz1-thin" />
      <circle cx={x} cy={y} r={2.6} className="fz1-o fz1-fill" />
    </g>
  )
}

function Load({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <path d={`M${x} ${y - 14} V${y}`} className="fz1-o" />
      <path d={`M${x - 26} ${y + 36} L${x - 21} ${y} H${x + 21} L${x + 26} ${y + 36}Z`} fill="#8a93a3" className="fz1-o" />
      <path d={`M${x - 26} ${y + 36} L${x - 21} ${y} H${x + 21} L${x + 26} ${y + 36}Z`} fill={pat(id, 'x')} opacity={0.4} />
      <text x={x} y={y + 24} textAnchor="middle" className="fz1-num fz1-num-b fz1-light-t" style={{ fontSize: 11.5 }}>
        100 N
      </text>
    </g>
  )
}

function Rope({ d }: { d: string }) {
  return <path d={d} className="fz1-rope" />
}

function Fixed() {
  const cx = 100
  const cy = 52
  return (
    <g>
      <Ceiling />
      <path d={`M${cx} 12 V${cy}`} className="fz1-o fz1-thick" />
      <Rope d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy} V160 M${cx - R} ${cy} V172`} />
      <Wheel x={cx} y={cy} />
      <Load x={cx - R} y={186} />
      <Arrow d={`M${cx + R} 160 V206`} tone="red" className="fz1-wide" />
      <Val x={cx + R + 8} y={200} t="F = 100 N" className="fz1-red-t" />
    </g>
  )
}

function Movable() {
  const cx = 96
  const cy = 150
  return (
    <g>
      <Ceiling />
      <Rope d={`M${cx - R} 12 V${cy} A${R} ${R} 0 0 0 ${cx + R} ${cy} V52`} />
      <Wheel x={cx} y={cy} />
      <Load x={cx} y={cy + 30} />
      <path d={`M${cx} ${cy} V${cy + 16}`} className="fz1-o fz1-thick" />
      <Arrow d={`M${cx + R} 64 V22`} tone="red" className="fz1-wide" />
      <Val x={cx + R + 8} y={40} t="F = 50 N" className="fz1-red-t" />
      <text x={cx - R - 6} y={100} textAnchor="end" className="fz1-lbl fz1-sm">
        2 provazy
      </text>
    </g>
  )
}

function Tackle() {
  const top = 48
  const bot = 146
  // neighbouring wheels touch the same vertical rope: centres 2R apart
  const B1 = 70
  const T1 = B1 + 2 * R
  const B2 = T1 + 2 * R
  const T2 = B2 + 2 * R
  return (
    <g>
      <Ceiling />
      {/* upper block */}
      <path d={`M${(B1 + T2) / 2 + 6} 12 V24 M${B1 - R} 24 H${T2} M${B1 - R} 24 V${top - 4} M${T1} 24 V${top} M${T2} 24 V${top}`} className="fz1-o fz1-thick" />
      <Rope
        d={`M${B1 - R} ${top - 4} V${bot} A${R} ${R} 0 0 0 ${B1 + R} ${bot} V${top} A${R} ${R} 0 0 1 ${T1 + R} ${top} V${bot} A${R} ${R} 0 0 0 ${B2 + R} ${bot} V${top} A${R} ${R} 0 0 1 ${T2 + R} ${top} V168`}
      />
      <Wheel x={T1} y={top} />
      <Wheel x={T2} y={top} />
      <Wheel x={B1} y={bot} />
      <Wheel x={B2} y={bot} />
      {/* lower block */}
      <path d={`M${B1} ${bot} V${bot + 22} H${B2} V${bot} M${(B1 + B2) / 2} ${bot + 22} V${bot + 28}`} className="fz1-o fz1-thick" />
      <Load x={(B1 + B2) / 2} y={bot + 42} />
      <Arrow d={`M${T2 + R} 166 V210`} tone="red" className="fz1-wide" />
      <Val x={T2 + R + 4} y={244} t="F = 25 N" anchor="end" className="fz1-red-t" />
    </g>
  )
}

const LABEL =
  'Kladky zvedající stejné břemeno o tíze 100 N. Pevná kladka jen mění směr síly, táhneme silou 100 N. Volná kladka visí na dvou provazech, stačí síla 50 N, ale provazu vytáhneme dvakrát víc. Kladkostroj se čtyřmi nosnými provazy potřebuje jen 25 N, provazu však vytáhneme čtyřikrát víc – co ušetříme na síle, ztratíme na dráze.'

export default function PulleySystems() {
  return (
    <Figure label={LABEL} max={720} interactive boost={false}>
      <div className="fz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={180}
          phoneColumns={2}
          steps={[
            {
              title: 'pevná kladka',
              caption: 'Mění jen směr síly: F\u00a0=\u00a0100\u00a0N.',
              art: (
                <Frame w={W} h={H}>
                  <Fixed />
                </Frame>
              ),
            },
            {
              title: 'volná kladka',
              caption: 'Břemeno nesou 2 provazy: F\u00a0=\u00a050\u00a0N, provazu vytáhneš 2×\u00a0víc.',
              art: (
                <Frame w={W} h={H}>
                  <Movable />
                </Frame>
              ),
            },
            {
              title: 'kladkostroj',
              caption: 'Nesou ho 4 provazy: F\u00a0=\u00a025\u00a0N, provazu vytáhneš 4×\u00a0víc.',
              art: (
                <Frame w={W} h={H}>
                  <Tackle />
                </Frame>
              ),
            },
          ]}
        />
        <p className="fz1-strip-note">co ušetříš na síle, ztratíš na dráze (zlaté pravidlo mechaniky)</p>
      </div>
    </Figure>
  )
}
