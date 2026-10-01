import { StepFilm } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, Head, Qty, Sym, f1, pat, useClock, useFig, NORTH, SOUTH } from './kit'

const LABEL =
  'Elektromagnetická indukce a Lenzův zákon jako animace po krocích. Cívka je připojená ke galvanometru. 1. Magnet se severním pólem napřed se zasouvá do cívky: magnetický tok cívkou roste, indukuje se proud a ručička galvanometru se vychýlí. Indukovaný proud vytvoří na konci cívky u magnetu severní pól, který přibližující se magnet odpuzuje – brání změně, která ho vyvolala. 2. Magnet stojí: tok se nemění, indukované napětí je nulové a ručička se vrátí na nulu. 3. Magnet se vysouvá: tok klesá, proud teče opačně, ručička se vychýlí na druhou stranu a konec cívky se stane jižním pólem, který odcházející magnet přitahuje.'

const W = 360
const H = 272
const CY = 112 // coil axis
const C0 = 180 // coil from
const C1 = 300 // coil to
const TURNS = 7
const RY = 40
const ML = 110 // magnet length
const AT_REST = 132 // magnet left end when inside
const OUTSIDE = 12

type Phase = 0 | 1 | 2 // in, still, out

const ease = (x: number) => 1 - (1 - x) ** 2

function Coil({ front }: { front: boolean }) {
  const s = (C1 - C0) / TURNS
  const d: string[] = []
  for (let i = 0; i < TURNS; i++) {
    const x = C0 + i * s
    // a helix seen from the side: each half-turn bows a little sideways
    d.push(
      front
        ? `M${f1(x)} ${CY + RY} C${f1(x + 7)} ${CY + RY * 0.4} ${f1(x + s / 2 - 7)} ${CY - RY * 0.4} ${f1(x + s / 2)} ${CY - RY}`
        : `M${f1(x + s / 2)} ${CY - RY} C${f1(x + s / 2 + 5)} ${CY - RY * 0.4} ${f1(x + s - 5)} ${CY + RY * 0.4} ${f1(x + s)} ${CY + RY}`,
    )
  }
  return <path d={d.join(' ')} className={front ? 'fz4-winding' : 'fz4-winding-back'} />
}

function Magnet({ x }: { x: number }) {
  const { id } = useFig()
  const h = 28
  return (
    <g>
      <rect x={x} y={CY - h / 2} width={ML / 2} height={h} fill={SOUTH} className="fz4-o" />
      <rect x={x + ML / 2} y={CY - h / 2} width={ML / 2} height={h} fill={NORTH} className="fz4-o" />
      <rect x={x} y={CY - h / 2} width={ML} height={h} fill={pat(id, 'd')} opacity={0.45} />
      <text x={x + ML / 4} y={CY + 6} textAnchor="middle" className="fz4-pole-t">
        S
      </text>
      <text x={x + (3 * ML) / 4} y={CY + 6} textAnchor="middle" className="fz4-pole-t">
        N
      </text>
    </g>
  )
}

function Galvanometer({ deg }: { deg: number }) {
  const cx = 240
  const cy = 236
  const r = 28
  const a = ((deg - 90) * Math.PI) / 180
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="fz4-o fz4-fill" />
      <path d={`M${cx - 20} ${cy - 8} A22 22 0 0 1 ${cx + 20} ${cy - 8}`} className="fz4-o fz4-thin" />
      <path d={`M${cx} ${cy - 22} V${cy - 16}`} className="fz4-o fz4-thin" />
      <path d={`M${cx} ${cy + 10} L${f1(cx + Math.cos(a) * 30)} ${f1(cy + 10 + Math.sin(a) * 30)}`} className="fz4-needle-l" />
      <circle cx={cx} cy={cy + 10} r={3} className="fz4-dot" />
      <text x={cx} y={cy + 24} textAnchor="middle" className="fz4-gauge-t">
        G
      </text>
    </g>
  )
}

function Scene({ k }: { k: Phase }) {
  const t = useClock(1.2)
  const p = ease(Math.min(1, t / 1.2))
  const x = k === 0 ? OUTSIDE + (AT_REST - OUTSIDE) * p : k === 1 ? AT_REST : AT_REST - (AT_REST - OUTSIDE) * p
  // needle: right while the flux grows, left while it falls, zero when still
  const swing = k === 1 ? 0 : (k === 0 ? 34 : -34) * Math.min(1, t / 0.3)
  const dir = k === 0 ? -1 : k === 2 ? 1 : 0 // current on the front strands: −1 up, +1 down
  const s = (C1 - C0) / TURNS
  return (
    <g>
      <text x={W / 2} y={24} textAnchor="middle" className="fz4-lbl fz4-b fz4-big">
        {k === 0 ? 'tok Φ roste' : k === 1 ? 'tok Φ se nemění' : 'tok Φ klesá'}
      </text>
      {/* wires to the galvanometer */}
      <path d={`M${C0} ${CY + RY} V236 H212 M${C1} ${CY + RY} V236 H268`} className="fz4-wire fz4-wire-thin" />
      {dir !== 0 && (
        <g>
          <Head x={C0} y={200} deg={dir < 0 ? -90 : 90} tone="acc" s={1.3} />
          <Head x={C1} y={200} deg={dir < 0 ? 90 : -90} tone="acc" s={1.3} />
        </g>
      )}
      <Coil front={false} />
      <Magnet x={x} />
      <Coil front />
      {dir !== 0 &&
        [1, 3, 5].map((i) => {
          const x0 = C0 + i * s + s / 4
          const up = (Math.atan2(-2 * RY, s / 2) * 180) / Math.PI
          return <Head key={i} x={x0} y={CY + (dir < 0 ? 20 : -20)} deg={dir < 0 ? up : up + 180} tone="acc" s={1.2} />
        })}
      <Galvanometer deg={swing} />
      <text x={204} y={262} textAnchor="end" className="fz4-lbl fz4-sm">
        galvanometr
      </text>
      {/* motion of the magnet */}
      {k === 0 && <Arrow d={`M${OUTSIDE + 20} ${CY - 30} H${OUTSIDE + 80}`} tone="ink" className="fz4-vec" />}
      {k === 2 && <Arrow d={`M${OUTSIDE + 80} ${CY - 30} H${OUTSIDE + 20}`} tone="ink" className="fz4-vec" />}
      {k === 1 ? (
        <text x={60} y={CY - 26} textAnchor="middle" className="fz4-lbl fz4-sm">
          magnet stojí
        </text>
      ) : (
        <Sym x={OUTSIDE + 50} y={CY - 38} t="v" />
      )}
      {/* induced pole and field (Lenz) */}
      {dir !== 0 && (
        <g>
          <circle cx={C0 - 6} cy={56} r={12} fill={k === 0 ? NORTH : SOUTH} className="fz4-o" />
          <text x={C0 - 6} y={62} textAnchor="middle" className="fz4-pole-t">
            {k === 0 ? 'N' : 'S'}
          </text>
          <Arrow d={k === 0 ? `M${C1 - 10} 56 H${C1 - 64}` : `M${C1 - 64} 56 H${C1 - 10}`} tone="acc" className="fz4-vec" />
          <Sym x={C1 + 2} y={62} t="B_{i}" tone="acc" anchor="start" />
        </g>
      )}
      {k === 1 && <Qty x={C1 - 30} y={62} s="U_{i}" v="0" anchor="middle" className="fz4-eq-lg" />}
      <text x={14} y={176} className="fz4-lbl fz4-sm fz4-muted-t">
        {k === 0 ? 'cívka magnet odpuzuje' : k === 1 ? 'žádný proud' : 'cívka magnet přitahuje'}
      </text>
    </g>
  )
}

const STEPS: { title: string; caption: string }[] = [
  {
    title: 'Magnet se zasouvá',
    caption: 'Tok roste, ručička se vychýlí. Indukovaný proud udělá z konce cívky severní pól, který magnet odpuzuje.',
  },
  {
    title: 'Magnet stojí',
    caption: 'Tok se nemění, indukované napětí je nulové a ručička se vrátí na nulu.',
  },
  {
    title: 'Magnet se vysouvá',
    caption: 'Tok klesá, proud teče opačně a ručička jde na druhou stranu. Jižní pól cívky odcházející magnet přitahuje.',
  },
]

export default function FaradayLenz() {
  return (
    <Figure level={11} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={STEPS.map((s, k) => ({
          ...s,
          art: (
            <Frame w={W} h={H}>
              <Scene k={k as Phase} />
            </Frame>
          ),
        }))}
      />
    </Figure>
  )
}
