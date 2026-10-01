import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Flame, Frame, pat, useFig } from './kit'

const W = 230
const H = 170
const BRASS = '#c9a24a'
const STEEL = '#8a93a3'

/** Annular sector between radii r1 < r2 around (cx, cy), from angle a0 to a1 (0 = up, clockwise). */
function band(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(cx + r * Math.sin(a)).toFixed(1)} ${(cy - r * Math.cos(a)).toFixed(1)}`
  return `M${p(r2, a0)} A${r2} ${r2} 0 0 1 ${p(r2, a1)} L${p(r1, a1)} A${r1} ${r1} 0 0 0 ${p(r1, a0)}Z`
}

function Bimetal() {
  const { id } = useFig()
  const x0 = 34
  const yb = 58 // brass / steel boundary
  const R = 240
  const th = 0.56
  const cy = yb + R
  const tipX = x0 + R * Math.sin(th)
  const tipY = cy - R * Math.cos(th)
  return (
    <g>
      {/* cold: straight, touching the contact */}
      <g opacity={0.45}>
        <rect x={x0} y={yb - 6} width={150} height={6} fill={BRASS} className="fz1-o fz1-thin fz1-dash" />
        <rect x={x0} y={yb} width={150} height={6} fill={STEEL} className="fz1-o fz1-thin fz1-dash" />
      </g>
      {/* hot: brass (outside) is longer, the strip bends */}
      <path d={band(x0, cy, R, R + 6, 0, th)} fill={BRASS} className="fz1-o" />
      <path d={band(x0, cy, R - 6, R, 0, th)} fill={STEEL} className="fz1-o" />
      {/* clamp */}
      <rect x={10} y={36} width={24} height={52} fill={pat(id, 'x')} className="fz1-o fz1-fill2" />
      {/* contact */}
      <path d={`M${x0 + 150} ${yb - 7} V20 H212`} className="fz1-wire" />
      <circle cx={x0 + 150} cy={yb - 8} r={3.5} className="fz1-o fz1-lvl-f" />
      <text x={x0 + 146} y={16} textAnchor="end" className="fz1-lbl fz1-sm">
        kontakt
      </text>
      <Arrow d={`M${x0 + 158} ${yb + 10} Q${tipX + 16} ${tipY - 20} ${tipX + 8} ${tipY - 4}`} tone="lvl" />
      <text x={70} y={yb - 12} className="fz1-lbl fz1-sm fz1-b">
        mosaz
      </text>
      <text x={60} y={yb + 26} className="fz1-lbl fz1-sm fz1-b">
        ocel
      </text>
      <Flame x={110} y={H - 10} h={26} w={9} />
      <Flame x={132} y={H - 10} h={20} w={7} />
      <text x={146} y={H - 12} className="fz1-lbl fz1-sm">
        teplo
      </text>
    </g>
  )
}

/** Rail seen from the side: head, web and foot, lying on sleepers. */
function Rail({ x, y, w }: { x: number; y: number; w: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x} y={y} width={w} height={9} fill={STEEL} className="fz1-o" />
      <rect x={x} y={y + 9} width={w} height={9} fill={STEEL} className="fz1-o" />
      <rect x={x} y={y + 9} width={w} height={9} fill={pat(id, 'd')} opacity={0.6} />
      <rect x={x} y={y + 18} width={w} height={5} fill={STEEL} className="fz1-o" />
    </g>
  )
}

function Rails() {
  const { id } = useFig()
  const row = (y: number, gap: number, name: string, hot: boolean) => (
    <g>
      <text x={8} y={y - 10} className={`fz1-lbl fz1-sm fz1-b ${hot ? 'fz1-red-t' : 'fz1-blue-t'}`}>
        {name}
      </text>
      <text x={222} y={y - 10} textAnchor="end" className="fz1-lbl fz1-sm">
        {hot ? 'skoro bez mezery' : 'široká mezera'}
      </text>
      {[34, 84, 146, 196].map((sx) => (
        <rect key={sx} x={sx - 11} y={y + 23} width={22} height={9} fill={pat(id, 'b')} className="fz1-o fz1-wood" />
      ))}
      <Rail x={10} y={y} w={105 - gap / 2} />
      <Rail x={115 + gap / 2} y={y} w={105 - gap / 2} />
      <path d={`M${115 - gap / 2} ${y - 5} V${y + 28} M${115 + gap / 2} ${y - 5} V${y + 28}`} className="fz1-o fz1-thin fz1-lvl-s" />
    </g>
  )
  return (
    <g>
      {row(52, 16, 'zima', false)}
      {row(128, 2, 'léto', true)}
    </g>
  )
}

/** Finger (comb) expansion joint seen from above. */
function Joint() {
  const { id } = useFig()
  const row = (y: number, open: number, name: string, hot: boolean) => {
    const mid = 115
    const fingers = [0, 1, 2, 3]
    const L = mid - open / 2
    const R = mid + open / 2
    const f = 26 // finger length
    const left = `M16 ${y} H${L - f / 2} ${fingers.map((i) => `V${y + i * 12 + 1} H${L + f / 2} V${y + i * 12 + 7} H${L - f / 2}`).join(' ')} V${y + 48} H16Z`
    const right = `M214 ${y} H${R + f / 2} ${fingers.map((i) => `V${y + i * 12 + 7} H${R - f / 2} V${y + i * 12 + 13} H${R + f / 2}`).join(' ')} V${y + 48} H214Z`
    return (
      <g>
        <text x={8} y={y - 8} className={`fz1-lbl fz1-sm fz1-b ${hot ? 'fz1-red-t' : 'fz1-blue-t'}`}>
          {name}
        </text>
        <text x={222} y={y - 8} textAnchor="end" className="fz1-lbl fz1-sm">
          {hot ? 'zuby zasunuté' : 'zuby vysunuté'}
        </text>
        <path d={left} fill="#b3aa98" className="fz1-o" />
        <path d={left} fill={pat(id, 'dots')} />
        <path d={right} fill="#b3aa98" className="fz1-o" />
        <path d={right} fill={pat(id, 'dots')} />
      </g>
    )
  }
  return (
    <g>
      {row(26, 22, 'zima', false)}
      {row(110, 2, 'léto', true)}
    </g>
  )
}

const LABEL =
  'Teplotní roztažnost ve třech příkladech. Bimetalový pásek z mosazi a oceli: při zahřátí se mosaz roztáhne víc než ocel, pásek se ohne a rozpojí kontakt – tak pracuje termostat. Kolejnice: v zimě jsou mezi nimi široké mezery, v létě se kolejnice prodlouží a mezera skoro zmizí. Most: dilatační spára se zuby, které se v létě zasunou do sebe a v zimě vysunou.'

export default function ThermalExpansion() {
  return (
    <Figure label={LABEL} max={720} interactive boost={false}>
      <div className="fz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            {
              title: 'bimetalový pásek',
              caption: 'Mosaz se teplem roztahuje víc než ocel, pásek se ohne a rozpojí kontakt (termostat).',
              art: (
                <Frame w={W} h={H}>
                  <Bimetal />
                </Frame>
              ),
            },
            {
              title: 'mezery mezi kolejnicemi',
              caption: 'V létě se kolejnice prodlouží – bez mezery by se zkroutily.',
              art: (
                <Frame w={W} h={H}>
                  <Rails />
                </Frame>
              ),
            },
            {
              title: 'dilatační spára mostu',
              caption: 'Most se v létě prodlouží, zuby spáry se zasunou do sebe; v zimě se vysunou.',
              art: (
                <Frame w={W} h={H}>
                  <Joint />
                </Frame>
              ),
            },
          ]}
        />
      </div>
    </Figure>
  )
}
