import { DrawArrow, Fade, Figure, Pop, pat, useCompact, useFig } from './kit'
import { along, bAt, fieldLines, toPath, type Poles, type Pt } from './field'

const RED = '#c8453a'
const BLUE = '#3d6fd1'

/** Bar magnet centred at (x, y), half-length l; N on the right unless `flip`. */
export function BarMagnet({ x, y, l, h = 34, flip = false, small = false }: { x: number; y: number; l: number; h?: number; flip?: boolean; small?: boolean }) {
  const { id } = useFig()
  const [lc, rc] = flip ? [RED, BLUE] : [BLUE, RED]
  const [lt, rt] = flip ? ['N', 'S'] : ['S', 'N']
  return (
    <g>
      <rect x={x - l} y={y - h / 2} width={l} height={h} fill={lc} />
      <rect x={x} y={y - h / 2} width={l} height={h} fill={rc} />
      <rect x={x - l} y={y - h / 2} width={2 * l} height={h} fill={pat(id, 'd')} opacity={0.35} />
      <rect x={x - l} y={y - h / 2} width={2 * l} height={h} className="fz1-o" />
      <text x={x - l / 2} y={y + (small ? 5.5 : 7)} textAnchor="middle" className="fz1-mag-t" style={{ fontSize: small ? 15 : 20 }}>
        {lt}
      </text>
      <text x={x + l / 2} y={y + (small ? 5.5 : 7)} textAnchor="middle" className="fz1-mag-t" style={{ fontSize: small ? 15 : 20 }}>
        {rt}
      </text>
    </g>
  )
}

/** Compass: the red (north) end of the needle points along the field `deg`. */
export function Compass({ x, y, deg, r = 12 }: { x: number; y: number; deg: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="fz1-o fz1-fill" />
      <g transform={`rotate(${deg.toFixed(1)} ${x} ${y})`}>
        <path d={`M${x} ${y - 3} L${x + r - 2} ${y} L${x} ${y + 3}Z`} fill={RED} className="fz1-o fz1-thin" />
        <path d={`M${x} ${y - 3} L${x - r + 2} ${y} L${x} ${y + 3}Z`} fill="#e9eef5" className="fz1-o fz1-thin" />
      </g>
      <circle cx={x} cy={y} r={1.6} className="fz1-dot" />
    </g>
  )
}

/** Small arrow head at a point, pointing along `deg`. */
export function Head({ p, deg }: { p: Pt; deg: number }) {
  return <path d="M-5 -4 L5 0 L-5 4Z" transform={`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${deg.toFixed(1)})`} className="fz1-head" />
}

function Field({ cx, cy, l, box, compasses, n }: { cx: number; cy: number; l: number; box: [number, number, number, number]; compasses: Pt[]; n: boolean }) {
  const { id } = useFig()
  const poles: Poles = { n: [cx + l - 12, cy], s: [cx - l + 12, cy] }
  const angles = n ? [-20, -48, -80, -118, 20, 48, 80, 118] : [-16, -36, -58, -84, -118, 16, 36, 58, 84, 118]
  const lines = fieldLines(poles, box, angles)
  return (
    <g>
      <defs>
        <clipPath id={`${id}-mf`}>
          <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} rx={14} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-mf)`}>
        {/* iron-filings look: dashed lines fade in (a pathLength draw would drop the dashes) */}
        {lines.map((pts, i) => (
          <Fade key={i} delay={0.15 + (i % 6) * 0.1}>
            <path d={toPath(pts)} className="fz1-field" />
          </Fade>
        ))}
        <Fade delay={1.1}>
          {lines.map((pts, i) => {
            const a = along(pts, 0.5)
            return <Head key={i} p={a.p} deg={a.deg} />
          })}
        </Fade>
      </g>
      <Pop delay={0}>
        <BarMagnet x={cx} y={cy} l={l} />
      </Pop>
      {compasses.map((c, i) => {
        const b = bAt(c, poles)
        return (
          <Pop key={i} delay={1.2 + i * 0.08}>
            <Compass x={c[0]} y={c[1]} deg={(Math.atan2(b[1], b[0]) * 180) / Math.PI} />
          </Pop>
        )
      })}
    </g>
  )
}

/** Inset: like poles repel, unlike poles attract. */
function Poles2({ x, y, w }: { x: number; y: number; w: number }) {
  const l = 34
  const g = 26
  const c = x + w / 2
  return (
    <g>
      <text x={c} y={y} textAnchor="middle" className="fz1-lbl fz1-b fz1-red-t">
        souhlasné póly se odpuzují
      </text>
      <BarMagnet x={c - g / 2 - l} y={y + 28} l={l} h={22} small />
      <BarMagnet x={c + g / 2 + l} y={y + 28} l={l} h={22} flip small />
      <DrawArrow d={`M${c - g / 2 - l} ${y + 52} h-34`} tone="red" delay={1.4} />
      <DrawArrow d={`M${c + g / 2 + l} ${y + 52} h34`} tone="red" delay={1.4} />

      <text x={c} y={y + 88} textAnchor="middle" className="fz1-lbl fz1-b fz1-green-t">
        nesouhlasné póly se přitahují
      </text>
      <BarMagnet x={c - g / 2 - l} y={y + 116} l={l} h={22} small />
      <BarMagnet x={c + g / 2 + l} y={y + 116} l={l} h={22} small />
      <DrawArrow d={`M${c - g / 2 - l - 20} ${y + 140} h30`} tone="green" delay={1.5} />
      <DrawArrow d={`M${c + g / 2 + l + 20} ${y + 140} h-30`} tone="green" delay={1.5} />
    </g>
  )
}

export default function MagnetField() {
  const compact = useCompact()
  const n = compact.narrow
  const L = n
    ? { w: 360, h: 548, cx: 180, cy: 168, l: 64, box: [4, 22, 356, 318] as [number, number, number, number], ix: 20, iy: 368, iw: 320 }
    : { w: 660, h: 400, cx: 222, cy: 196, l: 74, box: [6, 24, 438, 372] as [number, number, number, number], ix: 452, iy: 128, iw: 204 }
  const comp: Pt[] = n
    ? [
        [L.cx, L.cy - 70],
        [L.cx + L.l + 46, L.cy],
        [L.cx - L.l - 46, L.cy],
        [L.cx + 100, L.cy + 88],
        [L.cx - 100, L.cy - 88],
      ]
    : [
        [L.cx, L.cy - 76],
        [L.cx, L.cy + 76],
        [L.cx + L.l + 54, L.cy],
        [L.cx - L.l - 54, L.cy],
        [L.cx + 128, L.cy - 108],
        [L.cx - 128, L.cy + 108],
      ]
  return (
    <Figure
      w={L.w}
      h={L.h}
      max={n ? 420 : 700}
      compact={compact}
      boost={false}
      replay
      label="Magnetické pole tyčového magnetu. Magnetické indukční čáry, jak je ukážou železné piliny, vycházejí ze severního pólu N a vstupují do jižního pólu S; nejhustší jsou u pólů. Střelky kompasů se natočí podél čar, severním koncem ve směru čar. Vložený obrázek: souhlasné póly (N a N) se odpuzují, nesouhlasné póly (N a S) se přitahují."
    >
      <Field cx={L.cx} cy={L.cy} l={L.l} box={L.box} compasses={comp} n={n} />
      <Fade delay={0.4}>
        <text x={L.cx} y={14} textAnchor="middle" className="fz1-lbl fz1-sm">
          indukční čáry (železné piliny): z N do S
        </text>
      </Fade>
      <Fade delay={1.3}>
        <text x={L.cx} y={L.box[3] + 20} textAnchor="middle" className="fz1-lbl fz1-sm">
          střelka kompasu míří červeným koncem podél čar
        </text>
      </Fade>
      <Pop delay={1.2}>
        {!n && <rect x={L.ix - 4} y={L.iy - 30} width={L.iw + 8} height={196} rx={8} className="fz1-o fz1-soft fz1-fill" />}
        <Poles2 x={L.ix} y={L.iy} w={L.iw} />
      </Pop>
      <Fade delay={0.6}>
        <text x={n ? L.w / 2 : L.ix + L.iw / 2} y={n ? L.h - 6 : L.iy - 60} textAnchor="middle" className="fz1-lbl fz1-sm fz1-muted-t">
          N – severní pól, S – jižní pól
        </text>
      </Fade>
    </Figure>
  )
}
