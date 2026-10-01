import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, pat, useFig } from './kit'

const LABEL =
  'Siločáry elektrického pole. Kladný náboj: siločáry míří od něj na všechny strany. Záporný náboj: siločáry míří do něj. Kladný a záporný náboj: siločáry vycházejí z kladného a končí v záporném, náboje se přitahují. Dva kladné náboje: siločáry se od sebe odklánějí, mezi náboji je místo bez pole, náboje se odpuzují. Mezi dvěma nabitými deskami je pole homogenní: siločáry jsou rovnoběžné a stejně husté, míří od kladné desky k záporné.'

type Q = { x: number; y: number; q: number }
const S = 200

function field(cs: Q[], x: number, y: number): [number, number] {
  let ex = 0
  let ey = 0
  for (const c of cs) {
    const dx = x - c.x
    const dy = y - c.y
    const r3 = Math.pow(dx * dx + dy * dy, 1.5) || 1
    ex += (c.q * dx) / r3
    ey += (c.q * dy) / r3
  }
  return [ex, ey]
}

/** Trace one field line from (x, y), along E (dir = 1) or against it (dir = −1). */
function trace(cs: Q[], x: number, y: number, dir: 1 | -1) {
  const pts: [number, number][] = [[x, y]]
  for (let i = 0; i < 400; i++) {
    const [ex, ey] = field(cs, x, y)
    const l = Math.hypot(ex, ey) || 1
    x += (dir * 2 * ex) / l
    y += (dir * 2 * ey) / l
    pts.push([x, y])
    if (x < 2 || y < 2 || x > S - 2 || y > S - 2) break
    if (cs.some((c) => Math.sign(c.q) === -dir && Math.hypot(x - c.x, y - c.y) < 11)) break
  }
  return pts
}

function Line({ pts, flip }: { pts: [number, number][]; flip: boolean }) {
  const { id } = useFig()
  const p = flip ? pts.slice().reverse() : pts
  // arrow head about a third of the way along (never inside a charge)
  const k = Math.max(2, Math.min(p.length - 2, Math.round(p.length * (flip ? 0.62 : 0.4))))
  const a = p.slice(0, k + 1)
  const b = p.slice(k)
  const d = (q: [number, number][]) => q.map((v, i) => `${i ? 'L' : 'M'}${v[0].toFixed(1)} ${v[1].toFixed(1)}`).join(' ')
  return (
    <g>
      <path d={d(a)} className="fz2-fl" markerEnd={pat(id, 'ah-lvl')} />
      <path d={d(b)} className="fz2-fl" />
    </g>
  )
}

function Charge({ c }: { c: Q }) {
  return (
    <g>
      <circle cx={c.x} cy={c.y} r={11} className={c.q > 0 ? 'fz2-qp' : 'fz2-qn'} />
      <text x={c.x} y={c.y + 6} textAnchor="middle" className="fz2-q-t">
        {c.q > 0 ? '+' : '−'}
      </text>
    </g>
  )
}

function Charges({ cs, n = 12 }: { cs: Q[]; n?: number }) {
  const src = cs.some((c) => c.q > 0) ? cs.filter((c) => c.q > 0) : cs
  const dir: 1 | -1 = src[0].q > 0 ? 1 : -1
  const lines = src.flatMap((c) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i + 0.5) / n) * 2 * Math.PI
      return trace(cs, c.x + Math.cos(a) * 12, c.y + Math.sin(a) * 12, dir)
    }),
  )
  return (
    <Frame w={S} h={S} className="fz2-clip">
      {lines.map((p, i) => (
        <Line key={i} pts={p} flip={dir < 0} />
      ))}
      {cs.map((c, i) => (
        <Charge key={i} c={c} />
      ))}
    </Frame>
  )
}

function Plates() {
  return (
    <Frame w={S} h={S}>
      <PlatesArt />
    </Frame>
  )
}

function PlatesArt() {
  const { id } = useFig()
  const xs = [44, 66, 88, 110, 132, 154]
  return (
    <g>
      {xs.map((x) => (
        <g key={x}>
          <path d={`M${x} 48 V100`} className="fz2-fl" markerEnd={pat(id, 'ah-lvl')} />
          <path d={`M${x} 100 V152`} className="fz2-fl" />
        </g>
      ))}
      <path d="M26 48 Q16 100 26 152 M174 48 Q184 100 174 152" className="fz2-fl fz2-fl-soft" />
      <rect x={20} y={32} width={160} height={14} rx={2} className="fz2-qp" />
      <rect x={20} y={154} width={160} height={14} rx={2} className="fz2-qn" />
      {[40, 70, 100, 130, 160].map((x) => (
        <g key={x}>
          <text x={x} y={44} textAnchor="middle" className="fz2-q-t fz2-q-sm">
            +
          </text>
          <text x={x} y={166} textAnchor="middle" className="fz2-q-t fz2-q-sm">
            −
          </text>
        </g>
      ))}
      <text x={100} y={194} textAnchor="middle" className="fz2-lbl fz2-b fz2-halo">
        E = konst.
      </text>
    </g>
  )
}

export default function FieldLinesCharges() {
  return (
    <Figure level={6} label={LABEL} max={720} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={170}
          phoneColumns={2}
          steps={[
            { title: 'kladný náboj', caption: 'Siločáry vedou od náboje ven.', art: <Charges cs={[{ x: 100, y: 100, q: 1 }]} /> },
            { title: 'záporný náboj', caption: 'Siločáry vedou do náboje.', art: <Charges cs={[{ x: 100, y: 100, q: -1 }]} /> },
            {
              title: 'opačné náboje',
              caption: 'Z + do −, náboje se přitahují.',
              art: <Charges cs={[{ x: 62, y: 100, q: 1 }, { x: 138, y: 100, q: -1 }]} n={14} />,
            },
            {
              title: 'souhlasné náboje',
              caption: 'Siločáry se odklánějí, náboje se odpuzují.',
              art: <Charges cs={[{ x: 62, y: 100, q: 1 }, { x: 138, y: 100, q: 1 }]} />,
            },
            { title: 'nabité desky', caption: 'Homogenní pole: rovnoběžné siločáry od + k −.', art: <Plates /> },
          ]}
        />
      </div>
    </Figure>
  )
}
