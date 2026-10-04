import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, Ray, pat, useFig } from './kit'
import { type V, along, norm, sub } from './geom'

const LABEL =
  'Kulová zrcadla a rovnoběžné paprsky. Duté zrcadlo je spojné: paprsky rovnoběžné s optickou osou se po odrazu protnou v ohnisku F, které leží v polovině vzdálenosti mezi zrcadlem a středem křivosti S (f = r/2); používá se v baterce, reflektoru, kosmetickém zrcátku a dalekohledu. Vypuklé zrcadlo je rozptylné: odražené paprsky se rozbíhají, jako by vycházely ze zdánlivého ohniska za zrcadlem; dává zmenšený obraz s velkým rozhledem, proto je na křižovatkách a jako zpětné zrcátko.'

const AX = 104 // optical axis
const HS = [-60, -32, 32, 60]

/** Mirror profile x(y) for a vertex at vx: a paraboloid with focal length f (exact focusing, same curvature as the sphere r = 2f at the vertex). */
const prof = (vx: number, f: number, s: 1 | -1) => (y: number) => vx + (s * (y - AX) ** 2) / (4 * f)

function MirrorShape({ x }: { x: (y: number) => number }) {
  const { id } = useFig()
  const ys = Array.from({ length: 31 }, (_, i) => AX - 76 + (i * 152) / 30)
  const front = ys.map((y, i) => `${i ? 'L' : 'M'}${x(y).toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const back = ys
    .slice()
    .reverse()
    .map((y) => `L${(x(y) + 9).toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')
  return (
    <g>
      <path d={`${front} ${back}Z`} fill={pat(id, 'd')} />
      <path d={front} className="fz2-mirror" />
    </g>
  )
}

function Axis({ x1, x2 }: { x1: number; x2: number }) {
  return <path d={`M${x1} ${AX} H${x2}`} className="fz2-axis" />
}

function Point({ x, t, sub: s }: { x: number; t: string; sub?: string }) {
  return (
    <g>
      <circle cx={x} cy={AX} r={3.2} className="fz2-pt" />
      <text x={x} y={AX + 22} textAnchor="middle" className="fz2-lbl fz2-b">
        {t}
      </text>
      {s && (
        <text x={x} y={AX + 38} textAnchor="middle" className="fz2-lbl fz2-sm">
          {s}
        </text>
      )}
    </g>
  )
}

function Concave() {
  const f = 88
  const vx = 262
  const F: V = [vx - f, AX]
  const x = prof(vx, f, -1)
  return (
    <Frame w={320} h={196}>
      <Axis x1={14} x2={300} />
      <MirrorShape x={x} />
      {HS.map((h, i) => {
        const H: V = [x(AX + h), AX + h]
        const d = norm(sub(F, H))
        return <Ray key={h} pts={[[14, AX + h], H, along(H, d, (Math.hypot(H[0] - F[0], H[1] - F[1]) + 30))]} delay={i * 0.1} />
      })}
      <Point x={F[0]} t="F" />
      <Point x={vx - 2 * f} t="S" />
      <path d={`M${F[0]} ${AX - 84} H${vx}`} className="fz2-dim" />
      <text x={(F[0] + vx) / 2} y={AX - 88} textAnchor="middle" className="fz2-lbl fz2-sm">
        f = r/2
      </text>
      <text x={16} y={AX - 8} className="fz2-lbl fz2-sm fz2-sec">
        optická osa
      </text>
    </Frame>
  )
}

function Convex() {
  const f = 70
  const vx = 150
  const F: V = [vx + f, AX]
  const x = prof(vx, f, 1)
  return (
    <Frame w={320} h={196}>
      <Axis x1={14} x2={306} />
      <MirrorShape x={x} />
      {HS.map((h, i) => {
        const H: V = [x(AX + h), AX + h]
        const d = norm(sub(H, F))
        return (
          <g key={h}>
            <Ray pts={[[14, AX + h], H, along(H, d, 48)]} delay={i * 0.1} />
            <Ray pts={[H, F]} dashed delay={0.5 + i * 0.1} />
          </g>
        )
      })}
      <Point x={F[0]} t="F" />
    </Frame>
  )
}

export default function CurvedMirrors() {
  return (
    <Figure level={5} label={LABEL} max={700} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            {
              title: 'Duté zrcadlo – spojné',
              caption: 'Rovnoběžné paprsky se sejdou v ohnisku F, v půli cesty ke středu křivosti S. Baterka, reflektor, kosmetické zrcátko, dalekohled.',
              art: <Concave />,
            },
            {
              title: 'Vypuklé zrcadlo – rozptylné',
              caption: 'Paprsky se rozbíhají, jako by vycházely ze zdánlivého ohniska F za zrcadlem. Dopravní a zpětné zrcátko: velký rozhled.',
              art: <Convex />,
            },
          ]}
        />
      </div>
    </Figure>
  )
}
