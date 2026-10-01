import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, Ray } from './kit'
import type { V } from './geom'

const LABEL =
  'Vady oka a jejich oprava brýlemi. Krátkozraké oko je příliš dlouhé nebo jeho čočka láme příliš silně: rovnoběžné paprsky ze vzdáleného předmětu se sbíhají před sítnicí a obraz je rozmazaný; opraví ho rozptylka se zápornou optickou mohutností. Dalekozraké oko je příliš krátké: paprsky by se sbíhaly až za sítnicí; opraví ho spojka s kladnou optickou mohutností. Brýle posunou ohnisko přesně na sítnici.'

const LX = 150 // eye lens
const F = 100 // focal length of the eye
const D = 70 // glasses in front of the eye
const HS = [-26, 0, 26]

/** Power 1/f of the glasses that bring parallel rays to focus on a retina `lr` behind the eye lens. */
const glasses = (lr: number) => (1 - lr / F) / (lr + D - (D * lr) / F)

function Lens({ x, y, kind, h = 34 }: { x: number; y: number; kind: 'plus' | 'minus' | 'eye'; h?: number }) {
  if (kind === 'minus')
    return <path d={`M${x - 7} ${y - h} H${x + 7} Q${x + 1} ${y} ${x + 7} ${y + h} H${x - 7} Q${x - 1} ${y} ${x - 7} ${y - h}Z`} className="fz2-o fz2-lensg" />
  return <ellipse cx={x} cy={y} rx={kind === 'eye' ? 7 : 6} ry={h} className={`fz2-o ${kind === 'eye' ? 'fz2-lens' : 'fz2-lensg'}`} />
}

function Row({ y, lr, fix, label }: { y: number; lr: number; fix: boolean; label: string }) {
  const P = fix ? glasses(lr) : 0
  const R = LX + lr
  const myopic = lr > F
  return (
    <g>
      <path d={`M${LX - 18} ${y} C${LX - 18} ${y - 50} ${R + 8} ${y - 52} ${R + 8} ${y} C${R + 8} ${y + 52} ${LX - 18} ${y + 50} ${LX - 18} ${y}Z`} className="fz2-o fz2-sclera" />
      <path d={`M${R + 5} ${y - 30} Q${R + 10} ${y} ${R + 5} ${y + 30}`} className="fz2-retina" />
      <path d={`M6 ${y} H${R + 20}`} className="fz2-axis" />
      <Lens x={LX} y={y} kind="eye" h={26} />
      {fix && <Lens x={LX - D} y={y} kind={P < 0 ? 'minus' : 'plus'} h={36} />}
      {HS.map((h, i) => {
        const pts: V[] = [[8, y + h]]
        let hh = h
        let s = 0
        if (fix) {
          pts.push([LX - D, y + h])
          s = -h * P
          hh = h + s * D
        }
        pts.push([LX, y + hh])
        s = s - hh / F
        const atRetina: V = [R + 5, y + hh + s * (lr + 5)]
        pts.push(atRetina)
        const focusX = LX + hh / -s
        return (
          <g key={h}>
            <Ray pts={pts} delay={i * 0.06} heads={i !== 1} />
            {!fix && !myopic && h !== 0 && <Ray pts={[atRetina, [focusX, y]]} dashed />}
          </g>
        )
      })}
      <text x={8} y={y - 40} className="fz2-lbl fz2-b fz2-sm">
        {label}
      </text>
      {!fix && (
        <g>
          <circle cx={LX + F} cy={y} r={3.5} className="fz2-focus" />
          <text x={LX + F} y={y + 58} textAnchor="middle" className="fz2-lbl fz2-sm fz2-red-t">
            {myopic ? 'ohnisko před sítnicí' : 'ohnisko za sítnicí'}
          </text>
        </g>
      )}
      {fix && (
        <g>
          <circle cx={R + 5} cy={y} r={3.5} className="fz2-focus fz2-ok" />
          <text x={LX - D} y={y + 54} textAnchor="middle" className="fz2-lbl fz2-sm fz2-b fz2-lvl-t">
            {P < 0 ? 'rozptylka (−)' : 'spojka (+)'}
          </text>
          <text x={R} y={y + 58} textAnchor="end" className="fz2-lbl fz2-sm fz2-green-t">
            ostrý obraz
          </text>
        </g>
      )}
    </g>
  )
}

function Panel({ lr }: { lr: number }) {
  return (
    <Frame w={320} h={262}>
      <Row y={72} lr={lr} fix={false} label="bez brýlí" />
      <Row y={196} lr={lr} fix label="s brýlemi" />
    </Frame>
  )
}

export default function VisionDefects() {
  return (
    <Figure level={5} label={LABEL} max={700} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            { title: 'Krátkozrakost', caption: 'Oko je moc dlouhé, obraz vzniká před sítnicí. Blízko vidí ostře, do dálky rozmazaně. Pomůže rozptylka.', art: <Panel lr={150} /> },
            { title: 'Dalekozrakost', caption: 'Oko je moc krátké, obraz by vznikl až za sítnicí. Do dálky vidí lépe než zblízka. Pomůže spojka.', art: <Panel lr={72} /> },
          ]}
        />
      </div>
    </Figure>
  )
}
