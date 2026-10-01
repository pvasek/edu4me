import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, pat, useFig } from './kit'
import { type V, add, f, mul, sub } from './geom'

const LABEL =
  'Zatmění Slunce a Měsíce (není v měřítku). Zatmění Slunce: Měsíc stojí mezi Sluncem a Zemí a jeho plný stín (kužel) dopadne na malou oblast Země, kde je úplné zatmění; v širším polostínu je zatmění částečné. Zatmění Měsíce: Země stojí mezi Sluncem a Měsícem a Měsíc vstoupí do zemského stínu, zčervená, ale nezmizí, protože zemská atmosféra do stínu láme trochu červeného světla.'

const SUN: V = [0, 95]
const RS = 56
const W = 320

/** The two lines through homothety centre `h` tangent to circle (c, r): unit directions. */
function tangents(h: V, c: V, r: number): V[] {
  const d = sub(c, h)
  const D = Math.hypot(d[0], d[1])
  const a = Math.atan2(d[1], d[0])
  const s = Math.asin(r / D)
  return [a - s, a + s].map((x) => [Math.cos(x), Math.sin(x)] as V)
}
/** point of line (h, u) nearest to c = the tangent point */
const foot = (h: V, u: V, c: V): V => add(h, mul(u, (c[0] - h[0]) * u[0] + (c[1] - h[1]) * u[1]))
/** point of line (h, u) at x */
const atX = (h: V, u: V, x: number): V => add(h, mul(u, (x - h[0]) / u[0]))

function Shadows({ c, r, xEnd }: { c: V; r: number; xEnd: number }) {
  // external (umbra apex) and internal (penumbra) centres of similitude
  const he: V = add(c, mul(sub(c, SUN), r / (RS - r)))
  const hi: V = add(SUN, mul(sub(c, SUN), RS / (RS + r)))
  const ue = tangents(he, c, r)
  const ui = tangents(hi, c, r)
  const umb = ue.map((u) => foot(he, u, c))
  const pen = ui.map((u) => foot(hi, u, c))
  const apexX = Math.min(he[0], xEnd)
  const umbraPoly =
    he[0] <= xEnd ? `M${f(umb[0])} L${f(he)} L${f(umb[1])}Z` : `M${f(umb[0])} L${f(atX(he, ue[0], apexX))} L${f(atX(he, ue[1], apexX))} L${f(umb[1])}Z`
  const penPoly = `M${f(pen[0])} L${f(atX(hi, ui[0], xEnd))} L${f(atX(hi, ui[1], xEnd))} L${f(pen[1])}Z`
  // light rays grazing the body: sun tangent point → past the body
  const rays = [
    [foot(he, ue[0], SUN), atX(he, ue[0], apexX)],
    [foot(he, ue[1], SUN), atX(he, ue[1], apexX)],
    [foot(hi, ui[0], SUN), atX(hi, ui[0], xEnd)],
    [foot(hi, ui[1], SUN), atX(hi, ui[1], xEnd)],
  ]
  return (
    <g>
      <path d={penPoly} className="fz2-penumbra" />
      <path d={umbraPoly} className="fz2-umbra" />
      {rays.map(([a, b], i) => (
        <path key={i} d={`M${f(a)} L${f(b)}`} className={`fz2-sunray ${i > 1 ? 'fz2-sunray-2' : ''}`} />
      ))}
    </g>
  )
}

function Sun() {
  const { id } = useFig()
  return (
    <g>
      <circle cx={SUN[0]} cy={SUN[1]} r={RS} className="fz2-sun" />
      <circle cx={SUN[0]} cy={SUN[1]} r={RS} fill={pat(id, 'd')} opacity={0.5} />
      <text x={4} y={100} className="fz2-lbl fz2-b fz2-sm fz2-dark-t">
        Slunce
      </text>
    </g>
  )
}

function Earth({ c, r }: { c: V; r: number }) {
  const { id } = useFig()
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={r} className="fz2-earth" />
      <path d={`M${c[0] - r * 0.6} ${c[1] - r * 0.5} q${r * 0.4} ${-r * 0.2} ${r * 0.6} ${r * 0.2} t${r * 0.3} ${r * 0.5} M${c[0] - r * 0.3} ${c[1] + r * 0.4} q${r * 0.3} ${r * 0.1} ${r * 0.5} ${r * 0.4}`} className="fz2-land" />
      <circle cx={c[0]} cy={c[1]} r={r} fill={pat(id, 'd')} opacity={0.35} />
      <circle cx={c[0]} cy={c[1]} r={r} className="fz2-o" fill="none" />
    </g>
  )
}

function Solar() {
  const moon: V = [170, 95]
  const rm = 13
  const earth: V = [252, 95]
  return (
    <Frame w={W} h={190} className="fz2-clip">
      <Earth c={earth} r={36} />
      <Shadows c={moon} r={rm} xEnd={W} />
      <Sun />
      <circle cx={moon[0]} cy={moon[1]} r={rm} className="fz2-moon fz2-o" />
      <text x={moon[0]} y={moon[1] - 44} textAnchor="middle" className="fz2-lbl fz2-b">
        Měsíc
      </text>
      <line x1={moon[0]} y1={moon[1] - 40} x2={moon[0]} y2={moon[1] - rm - 3} className="fz2-lead" />
      <text x={earth[0] + 14} y={154} textAnchor="middle" className="fz2-lbl fz2-b">
        Země
      </text>
      <text x={312} y={22} textAnchor="end" className="fz2-lbl fz2-sm">
        polostín: částečné
      </text>
      <line x1={272} y1={27} x2={232} y2={70} className="fz2-lead" />
      <text x={150} y={182} textAnchor="middle" className="fz2-lbl fz2-sm">
        stín: úplné zatmění
      </text>
      <line x1={176} y1={168} x2={214} y2={99} className="fz2-lead" />
    </Frame>
  )
}

function Lunar() {
  const earth: V = [160, 95]
  const moon: V = [276, 95]
  return (
    <Frame w={W} h={190} className="fz2-clip">
      <Shadows c={earth} r={30} xEnd={W} />
      <Sun />
      <Earth c={earth} r={30} />
      <circle cx={moon[0]} cy={moon[1]} r={9} className="fz2-o fz2-bloodmoon" />
      <text x={earth[0]} y={165} textAnchor="middle" className="fz2-lbl fz2-b">
        Země
      </text>
      <text x={moon[0]} y={165} textAnchor="middle" className="fz2-lbl fz2-b">
        Měsíc
      </text>
      <line x1={moon[0]} y1={150} x2={moon[0]} y2={106} className="fz2-lead" />
      <text x={236} y={22} textAnchor="middle" className="fz2-lbl fz2-sm">
        zemský stín
      </text>
      <line x1={236} y1={28} x2={236} y2={84} className="fz2-lead" />
    </Frame>
  )
}

export default function Eclipses() {
  return (
    <Figure level={5} label={LABEL} max={700} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            { title: 'Zatmění Slunce', caption: 'Slunce – Měsíc – Země: stín Měsíce padne na Zemi, jen za novu.', art: <Solar /> },
            { title: 'Zatmění Měsíce', caption: 'Slunce – Země – Měsíc: Měsíc vstoupí do stínu Země a zčervená, jen za úplňku.', art: <Lunar /> },
          ]}
        />
        <p className="fz2-strip-note">plný stín = žádné přímé sluneční světlo, polostín = jen část Slunce · není v měřítku</p>
      </div>
    </Figure>
  )
}
