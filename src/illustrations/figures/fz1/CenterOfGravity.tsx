import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, pat, useFig } from './kit'

const W = 230
const H = 190
const GY = 162 // ground

/** The classic centre-of-mass sign: a circle with two filled quarters. */
export function CoG({ x, y, r = 6.5, label = true }: { x: number; y: number; r?: number; label?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="fz1-o fz1-fill" />
      <path d={`M${x} ${y} V${y - r} A${r} ${r} 0 0 1 ${x + r} ${y}Z M${x} ${y} V${y + r} A${r} ${r} 0 0 1 ${x - r} ${y}Z`} className="fz1-cog" />
      <circle cx={x} cy={y} r={r} className="fz1-o" />
      {label && (
        <text x={x + r + 3} y={y - r} className="fz1-val fz1-val-sm">
          T
        </text>
      )}
    </g>
  )
}

function Ground({ x1 = 8, x2 = W - 8 }: { x1?: number; x2?: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x1} y={GY} width={x2 - x1} height={9} fill={pat(id, 'd')} />
      <path d={`M${x1} ${GY} H${x2}`} className="fz1-o" />
    </g>
  )
}

const rot = (x: number, y: number, px: number, py: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a)]
}

/** Box of w × h standing left of the pivot (px, GY), tipped `deg` clockwise about it. */
function Tipped({ px, w, h, deg, ok, ghost = false, fill = 'fz1-wood' }: { px: number; w: number; h: number; deg: number; ok: boolean; ghost?: boolean; fill?: string }) {
  const { id } = useFig()
  const [tx, ty] = rot(px - w / 2, GY - h / 2, px, GY, deg)
  return (
    <g opacity={ghost ? 0.75 : 1}>
      <g transform={`rotate(${deg} ${px} ${GY})`}>
        <rect x={px - w} y={GY - h} width={w} height={h} className={`fz1-o ${ghost ? 'fz1-dash' : fill}`} />
        {!ghost && <rect x={px - w} y={GY - h} width={w} height={h} fill={pat(id, 'b')} opacity={0.3} />}
      </g>
      <path d={`M${tx} ${ty} V${GY}`} className={`fz1-o fz1-dash ${ok ? 'fz1-ok-s' : 'fz1-bad-s'}`} />
      <circle cx={tx} cy={GY} r={3} className={ok ? 'fz1-ok-f' : 'fz1-bad-f'} />
      <CoG x={tx} y={ty} label={!ghost} />
    </g>
  )
}

function Tipping() {
  const px = 150
  return (
    <g>
      <Ground />
      <Tipped px={px} w={64} h={104} deg={44} ok={false} ghost />
      <Tipped px={px} w={64} h={104} deg={16} ok />
      <circle cx={px} cy={GY} r={3.5} className="fz1-o fz1-lvl-f" />
      <text x={16} y={GY + 24} className="fz1-lbl fz1-sm fz1-b fz1-green-t">
        vrátí se
      </text>
      <text x={W - 10} y={GY + 24} textAnchor="end" className="fz1-lbl fz1-sm fz1-b fz1-red-t">
        převrhne se
      </text>
      <text x={W - 10} y={20} textAnchor="end" className="fz1-lbl fz1-sm">
        hrana překlopení
      </text>
      <path d={`M${W - 50} 26 L${px + 3} ${GY - 6}`} className="fz1-lead" />
      <Arrow d={`M${px - 22} 30 Q${px - 52} 22 ${px - 68} 46`} tone="green" />
    </g>
  )
}

function LowHigh() {
  return (
    <g>
      <Ground />
      <Tipped px={100} w={86} h={48} deg={26} ok fill="fz1-lvlsoft-f" />
      <Tipped px={196} w={30} h={112} deg={26} ok={false} fill="fz1-lvlsoft-f" />
      <text x={12} y={GY + 24} className="fz1-lbl fz1-sm fz1-b fz1-green-t">
        nízké – stojí
      </text>
      <text x={W - 6} y={GY + 24} textAnchor="end" className="fz1-lbl fz1-sm fz1-b fz1-red-t">
        vysoké – padá
      </text>
    </g>
  )
}

/** Balancing toy on a pointed stand: heavy balls hang below the support point. */
function Toy() {
  const { id } = useFig()
  const tx = 115
  const tip = 70
  return (
    <g>
      <Ground />
      <path d={`M${tx} ${tip + 4} L${tx - 30} ${GY} H${tx + 30}Z`} className="fz1-o fz1-wood" />
      <path d={`M${tx} ${tip + 4} L${tx - 30} ${GY} H${tx + 30}Z`} fill={pat(id, 'b')} opacity={0.3} />
      {/* the figure */}
      <circle cx={tx} cy={tip - 40} r={9} className="fz1-o fz1-fill" />
      <path d={`M${tx} ${tip - 31} V${tip}`} className="fz1-o fz1-thick" />
      {/* curved arms with heavy balls far below the tip */}
      <path d={`M${tx} ${tip - 22} C${tx - 60} ${tip - 20} ${tx - 86} ${tip + 20} ${tx - 84} ${tip + 66}`} className="fz1-o fz1-thick" />
      <path d={`M${tx} ${tip - 22} C${tx + 60} ${tip - 20} ${tx + 86} ${tip + 20} ${tx + 84} ${tip + 66}`} className="fz1-o fz1-thick" />
      <circle cx={tx - 84} cy={tip + 72} r={10} fill="#8a93a3" className="fz1-o" />
      <circle cx={tx + 84} cy={tip + 72} r={10} fill="#8a93a3" className="fz1-o" />
      <circle cx={tx} cy={tip} r={3.5} className="fz1-o fz1-lvl-f" />
      <CoG x={tx} y={tip + 34} />
      <text x={tx - 6} y={tip + 4} textAnchor="end" className="fz1-lbl fz1-sm">
        opora
      </text>
    </g>
  )
}

const LABEL =
  'Stabilita a těžiště ve třech obrázcích. Nakloněná krabice se vrátí zpět, dokud svislice z těžiště T prochází její podstavou; když svislice přejde za hranu překlopení, krabice se převrhne. Při stejném naklonění nízké a široké těleso stojí, vysoké a úzké se převrhne – nízké těžiště znamená větší stabilitu. Balanční hračka má těžké konce ramen níž než bod opory, její těžiště leží pod oporou, a proto nespadne.'

export default function CenterOfGravity() {
  return (
    <Figure label={LABEL} max={720} interactive boost={false}>
      <div className="fz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            {
              title: 'naklonění krabice',
              caption: 'Dokud svislice z těžiště prochází podstavou, krabice se vrátí. Za hranou se převrhne.',
              art: (
                <Frame w={W} h={H}>
                  <Tipping />
                </Frame>
              ),
            },
            {
              title: 'nízké a vysoké těžiště',
              caption: 'Při stejném naklonění nízké a široké těleso stojí, vysoké a úzké spadne.',
              art: (
                <Frame w={W} h={H}>
                  <LowHigh />
                </Frame>
              ),
            },
            {
              title: 'balanční hračka',
              caption: 'Těžké konce ramen jsou níž než opora – těžiště leží pod ní a hračka nespadne.',
              art: (
                <Frame w={W} h={H}>
                  <Toy />
                </Frame>
              ),
            },
          ]}
        />
      </div>
    </Figure>
  )
}
