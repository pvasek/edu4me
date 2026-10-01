import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, pat, useFig } from './kit'

const LABEL =
  'Na čem závisí elektrický odpor drátu: R = ρ · l / S. Delší drát má větší odpor: měděný drát o průřezu 1 mm² a délce 1 m má odpor 0,017 Ω, dvakrát delší 0,034 Ω. Tlustší drát má menší odpor: při průřezu 2 mm² je odpor poloviční, 0,0085 Ω. Záleží i na materiálu: stejný drát z nikelinu má odpor 0,40 Ω, protože nikelin má asi 24krát větší rezistivitu než měď.'

const CU = '#c7773d'
const NI = '#a3a8b3'

/** Engraved wire (a cylinder seen from the side) from x, length l (px), diameter d. */
function Wire({ x, y, l, d, color }: { x: number; y: number; l: number; d: number; color: string }) {
  const { id } = useFig()
  const r = d / 2
  return (
    <g>
      <path d={`M${x} ${y - r} H${x + l} A${r * 0.45} ${r} 0 0 1 ${x + l} ${y + r} H${x}Z`} fill={color} className="fz2-o" />
      <path d={`M${x} ${y - r} H${x + l} A${r * 0.45} ${r} 0 0 1 ${x + l} ${y + r} H${x}Z`} fill={pat(id, 'sh')} opacity={0.6} />
      <path d={`M${x + 3} ${y - r * 0.45} H${x + l - 2}`} className="fz2-glint-w" />
      <ellipse cx={x} cy={y} rx={r * 0.45} ry={r} fill={color} className="fz2-o" />
    </g>
  )
}

function Row({ y, l, d, color, left, r }: { y: number; l: number; d: number; color: string; left: string; r: string }) {
  return (
    <g>
      <text x={6} y={y - 14} className="fz2-lbl fz2-sm">
        {left}
      </text>
      <text x={218} y={y - 14} textAnchor="end" className="fz2-eq fz2-b-eq fz2-lvl-t">
        {r}
      </text>
      <Wire x={8} y={y} l={l} d={d} color={color} />
    </g>
  )
}

const P = ({ children }: { children: React.ReactNode }) => (
  <Frame w={224} h={118}>
    {children}
  </Frame>
)

export default function ResistanceWire() {
  return (
    <Figure level={6} label={LABEL} max={720} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={200}
          steps={[
            {
              title: 'Délka l',
              caption: 'Dvakrát delší drát má dvakrát větší odpor.',
              art: (
                <P>
                  <Row y={42} l={100} d={10} color={CU} left="měď, l = 1 m" r="0,017 Ω" />
                  <Row y={98} l={200} d={10} color={CU} left="měď, l = 2 m" r="0,034 Ω" />
                </P>
              ),
            },
            {
              title: 'Průřez S',
              caption: 'Dvakrát větší průřez: poloviční odpor.',
              art: (
                <P>
                  <Row y={42} l={200} d={10} color={CU} left="S = 1 mm²" r="0,017 Ω" />
                  <Row y={98} l={200} d={14.1} color={CU} left="S = 2 mm²" r="0,0085 Ω" />
                </P>
              ),
            },
            {
              title: 'Materiál ρ',
              caption: 'Nikelin klade proudu asi 24krát větší odpor než měď.',
              art: (
                <P>
                  <Row y={42} l={200} d={10} color={CU} left="měď (ρ = 0,017)" r="0,017 Ω" />
                  <Row y={98} l={200} d={10} color={NI} left="nikelin (ρ = 0,40)" r="0,40 Ω" />
                </P>
              ),
            },
          ]}
        />
        <p className="fz2-strip-note">
          R = ρ · l / S &nbsp;·&nbsp; ρ v Ω·mm²/m, l v m, S v mm² &nbsp;·&nbsp; vždy l = 1 m a S = 1 mm², pokud není uvedeno jinak
        </p>
      </div>
    </Figure>
  )
}
