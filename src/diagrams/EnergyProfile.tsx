import { Arrow, DrawPath, Fallback, FadeIn, Svg, oneOf, type DiagramProps } from './util'

const AX = 44 // y axis x
const BASE = 262 // x axis y

function curve(yR: number, peak: number, yP: number) {
  return `M${AX + 8} ${yR} L110 ${yR} C160 ${yR} 165 ${peak} 205 ${peak} C245 ${peak} 250 ${yP} 300 ${yP} L392 ${yP}`
}

export default function EnergyProfile({ props }: DiagramProps) {
  const kind = oneOf(props.kind, ['exo', 'endo'] as const, null)
  if (!kind || (props.catalyst !== undefined && typeof props.catalyst !== 'boolean'))
    return <Fallback id="energy-profile" reason="kind musí být exo nebo endo" />
  const cat = props.catalyst === true
  const exo = kind === 'exo'
  const yR = exo ? 150 : 222
  const yP = exo ? 222 : 150
  const peak = 58
  const peakCat = 112

  return (
    <div className="dg dg-energy">
      <Svg
        w={400}
        h={296}
        max={560}
        label={`Energetický diagram ${exo ? 'exotermní' : 'endotermní'} reakce: produkty mají ${exo ? 'nižší' : 'vyšší'} energii než reaktanty, ΔH ${exo ? '< 0' : '> 0'}. Šipka Ea ukazuje aktivační energii${cat ? ', čárkovaná křivka s katalyzátorem má nižší aktivační energii' : ''}.`}
      >
        {/* axes */}
        <Arrow x1={AX} y1={BASE} x2={AX} y2={14} className="dg-arrow dg-axis" head={9} />
        <Arrow x1={AX} y1={BASE} x2={396} y2={BASE} className="dg-arrow dg-axis" head={9} />
        <text className="dg-t dg-strong" x={AX - 10} y={24} textAnchor="end">
          E
        </text>
        <text className="dg-t dg-muted" x={396} y={BASE + 22} textAnchor="end">
          průběh reakce →
        </text>

        {/* guides */}
        <line className="dg-guide" x1={110} y1={yR} x2={372} y2={yR} />

        {/* curves */}
        {cat && (
          <FadeIn delay={1}>
            <path className="dg-curve dg-curve-cat" d={curve(yR, peakCat, yP)} />
          </FadeIn>
        )}
        <DrawPath className="dg-curve" d={curve(yR, peak, yP)} />

        <text className="dg-t dg-strong" x={80} y={yR - 10} textAnchor="middle">
          reaktanty
        </text>
        <text className="dg-t dg-strong" x={340} y={exo ? yP + 20 : yP - 10} textAnchor="middle">
          produkty
        </text>
        <text className="dg-note" x={210} y={peak - 12} textAnchor="middle">
          aktivovaný komplex
        </text>

        {/* activation energy */}
        <Arrow x1={205} y1={yR} x2={205} y2={peak + 2} className="dg-arrow dg-ea" both head={8} />
        <text className="dg-t dg-strong dg-ea-t" x={197} y={(yR + peak) / 2 + 5} textAnchor="end">
          Eₐ
        </text>
        {cat && (
          <>
            <Arrow x1={230} y1={yR} x2={230} y2={peakCat + 6} className="dg-arrow dg-cat" both head={8} />
            <line className="dg-curve dg-curve-cat" x1={56} y1={exo ? 196 : 76} x2={84} y2={exo ? 196 : 76} />
            <text className="dg-note dg-cat-t" x={exo ? 90 : 54} y={exo ? 201 : 100}>
              s katalyzátorem
            </text>
            <text className="dg-t dg-small dg-cat-t" x={exo ? 90 : 54} y={exo ? 220 : 118}>
              nižší Eₐ
            </text>
          </>
        )}

        {/* reaction enthalpy */}
        <Arrow x1={362} y1={yR} x2={362} y2={yP} className="dg-arrow dg-dh" head={9} />
        <text className="dg-t dg-strong" x={352} y={(yR + yP) / 2 + 5} textAnchor="end">
          ΔH {exo ? '< 0' : '> 0'}
        </text>
        <text className="dg-note" x={392} y={exo ? yR - 10 : yR + 26} textAnchor="end">
          {exo ? 'teplo se uvolní' : 'teplo se spotřebuje'}
        </text>
      </Svg>
    </div>
  )
}
