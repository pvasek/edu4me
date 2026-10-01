import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, ChemText, Figure, Frame, pat, useFig } from './kit'

const LABEL =
  'Hybnost při srážkách dvou vozíků o hmotnosti 2 kg. Před srážkou jede vozík A rychlostí 3 m/s a vozík B stojí; celková hybnost je 6 kg·m/s a kinetická energie 9 J. Pružná srážka: A se zastaví a B odjede rychlostí 3 m/s, hybnost 6 kg·m/s i energie 9 J se zachovají. Nepružná srážka: A jede 1 m/s a B 2 m/s, hybnost je opět 6 kg·m/s, ale energie klesne na 5 J. Dokonale nepružná srážka: vozíky se spojí a jedou společně 1,5 m/s, hybnost 6 kg·m/s, energie 4,5 J.'

const W = 300
const H = 244
const CW = 54 // cart width
const PK = 8 // px per kg·m/s
const COL = { A: '#6f9fd8', B: '#e0b43a' }

function Cart({ x, y, k }: { x: number; y: number; k: 'A' | 'B' }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x} y={y - 26} width={CW} height={24} rx={3} fill={COL[k]} className="fz3-o" />
      <rect x={x} y={y - 26} width={CW} height={24} rx={3} fill={pat(id, 'd')} opacity={0.45} />
      <text x={x + CW / 2} y={y - 9} textAnchor="middle" className="fz3-cart-t">
        {k} · 2 kg
      </text>
      <circle cx={x + 12} cy={y + 3} r={5} className="fz3-o fz3-fill3" />
      <circle cx={x + CW - 12} cy={y + 3} r={5} className="fz3-o fz3-fill3" />
    </g>
  )
}

/** Momentum arrow under a cart (or pair) centred at cx, with its value; v written above. */
function Moves({ cx, y, p, v }: { cx: number; y: number; p: number; v: string }) {
  return (
    <g>
      <text x={cx} y={y - 34} textAnchor="middle" className="fz3-lbl fz3-sm">
        <ChemText text={`v = ${v}`} />
      </text>
      {p > 0 ? (
        <>
          <Arrow d={`M${cx - 6} ${y + 20} H${cx - 6 + p * PK}`} tone="lvl" className="fz3-vec" />
          <text x={cx - 12} y={y + 25} textAnchor="end" className="fz3-eq fz3-eq-sm fz3-lvl-t">
            p = {p.toString().replace('.', ',')}
          </text>
        </>
      ) : (
        <text x={cx} y={y + 25} textAnchor="middle" className="fz3-eq fz3-eq-sm fz3-lvl-t">
          p = 0
        </text>
      )}
    </g>
  )
}

function Track({ y }: { y: number }) {
  return <path d={`M8 ${y + 8} H${W - 8}`} className="fz3-o fz3-thin" />
}

type After = {
  a: number
  b: number
  va: string
  vb: string
  pa: number
  pb: number
  joined?: boolean
}
const CASES: { title: string; after: After; caption: string }[] = [
  {
    title: 'Pružná srážka',
    after: { a: 100, b: 200, va: '0', vb: '3 m/s', pa: 0, pb: 6 },
    caption: 'A se zastaví, B odjede 3 m/s. Hybnost 6 → 6 kg·m/s, energie 9 J → 9 J.',
  },
  {
    title: 'Nepružná srážka',
    after: { a: 90, b: 186, va: '1 m/s', vb: '2 m/s', pa: 2, pb: 4 },
    caption: 'Oba jedou dál pomaleji. Hybnost 6 → 2 + 4 = 6 kg·m/s, energie 9 J → 5 J.',
  },
  {
    title: 'Dokonale nepružná',
    after: { a: 104, b: 104 + CW, va: '', vb: '', pa: 0, pb: 0, joined: true },
    caption: 'Vozíky se spojí a jedou 1,5 m/s. Hybnost 4 kg · 1,5 m/s = 6 kg·m/s, energie 4,5 J.',
  },
]

function Panel({ after }: { after: After }) {
  const y1 = 84
  const y2 = 204
  return (
    <Frame w={W} h={H}>
      <text x={10} y={20} className="fz3-cap">
        před srážkou
      </text>
      <Track y={y1} />
      <Cart x={40} y={y1} k="A" />
      <Cart x={186} y={y1} k="B" />
      <Moves cx={40 + CW / 2} y={y1} p={6} v="3 m/s" />
      <Moves cx={186 + CW / 2} y={y1} p={0} v="0" />
      <text x={W - 10} y={20} textAnchor="end" className="fz3-eq fz3-eq-sm">
        p = 6 kg·m/s
      </text>
      <line x1={8} x2={W - 8} y1={124} y2={124} className="fz3-o fz3-soft" />
      <text x={10} y={146} className="fz3-cap">
        po srážce
      </text>
      <text x={W - 10} y={146} textAnchor="end" className="fz3-eq fz3-eq-sm">
        p = 6 kg·m/s
      </text>
      <Track y={y2} />
      <Cart x={after.a} y={y2} k="A" />
      <Cart x={after.b} y={y2} k="B" />
      {after.joined ? (
        <Moves cx={after.a + CW - 22} y={y2} p={6} v="1,5 m/s" />
      ) : (
        <>
          <Moves cx={after.a + CW / 2} y={y2} p={after.pa} v={after.va} />
          <Moves cx={after.b + CW / 2} y={y2} p={after.pb} v={after.vb} />
        </>
      )}
      {after.joined && <rect x={after.a + CW - 3} y={y2 - 20} width={6} height={12} className="fz3-o fz3-fill3" />}
    </Frame>
  )
}

export default function MomentumCollision() {
  return (
    <Figure level={8} label={LABEL} max={980} interactive>
      <div className="fz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={CASES.map((c) => ({
            title: c.title,
            art: <Panel after={c.after} />,
            caption: c.caption,
          }))}
        />
        <p className="fz3-strip-note">celková hybnost se zachová vždy, kinetická energie jen při pružné srážce</p>
      </div>
    </Figure>
  )
}
