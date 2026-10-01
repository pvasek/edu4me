import { useId } from 'react'
import { Fade, Figure, Pop, Vec, f1, pat, useFig, useLive } from './kit'

const LABEL =
  'Dopplerův jev. Sanitka se sirénou jede doprava rychlostí v. Každá další vlnoplocha zvuku vychází z místa, kam sanitka mezitím dojela, proto jsou vlnoplochy před sanitkou nahuštěné a za ní roztažené. Posluchač vpředu, ke kterému se sanitka blíží, slyší kratší vlnovou délku, tedy vyšší frekvenci a vyšší tón: f′ = f·c/(c − v). Posluchač vzadu, od kterého se vzdaluje, slyší nižší tón: f′ = f·c/(c + v).'

const SX = 250 // siren (current position)
const SY = 170
const ROAD = 232
const LAMBDA = 34 // wavelength at rest (c·T)
const BETA = 0.45 // v / c
const N = 7

function Ambulance() {
  return (
    <g>
      <path d={`M${SX - 52} ${ROAD - 10} V${SY + 16} H${SX + 26} L${SX + 44} ${SY + 34} V${ROAD - 10}Z`} className="fz3-o fz3-amb" />
      <path d={`M${SX + 28} ${SY + 20} L${SX + 40} ${SY + 34} H${SX + 28}Z`} className="fz3-o fz3-glass" />
      <path d={`M${SX - 52} ${ROAD - 22} H${SX + 44}`} className="fz3-amb-stripe" />
      <path d={`M${SX - 16} ${SY + 24} v18 M${SX - 25} ${SY + 33} h18`} className="fz3-cross" />
      <rect x={SX - 7} y={SY - 4} width={14} height={20} rx={3} className="fz3-o fz3-siren" />
      {[SX - 32, SX + 24].map((x) => (
        <g key={x}>
          <circle cx={x} cy={ROAD - 8} r={9} className="fz3-o fz3-fill3" />
          <circle cx={x} cy={ROAD - 8} r={3.5} className="fz3-o fz3-fill" />
        </g>
      ))}
    </g>
  )
}

function Person({ x, flip = false }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1
  return (
    <g>
      <circle cx={x} cy={ROAD - 50} r={8} className="fz3-o fz3-skin" />
      <path
        d={`M${x} ${ROAD - 42} V${ROAD - 18} M${x} ${ROAD - 18} L${x - 7} ${ROAD} M${x} ${ROAD - 18} L${x + 7} ${ROAD} M${x - 10} ${ROAD - 34} L${x + 10} ${ROAD - 34}`}
        className="fz3-o"
        style={{ strokeWidth: 2.4 }}
      />
      <path d={`M${x + s * 6} ${ROAD - 54} q${s * 5} 4 0 8`} className="fz3-o fz3-thin" />
    </g>
  )
}

function Fronts({ clip }: { clip: string }) {
  const live = useLive()
  const dur = 3.2
  const rMax = LAMBDA * N
  return (
    <g clipPath={`url(#${clip})`}>
      {Array.from({ length: N }, (_, i) => {
        const k = i + 1
        const r = LAMBDA * k
        const cx = SX - BETA * r
        return (
          <circle key={k} cx={f1(cx)} cy={SY} r={r} className="fz3-front">
            {live && (
              <>
                <animate attributeName="r" values={`0;${rMax}`} dur={`${dur}s`} begin={`${(-dur * k) / N}s`} repeatCount="indefinite" />
                <animate
                  attributeName="cx"
                  values={`${SX};${f1(SX - BETA * rMax)}`}
                  dur={`${dur}s`}
                  begin={`${(-dur * k) / N}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;1;0"
                  keyTimes="0;0.8;1"
                  dur={`${dur}s`}
                  begin={`${(-dur * k) / N}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        )
      })}
    </g>
  )
}

export default function DopplerEffect() {
  const clip = 'fz3d' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <Figure level={9} w={440} h={330} max={580} label={LABEL}>
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={440} height={ROAD} />
        </clipPath>
      </defs>
      <Fronts clip={clip} />
      <path d={`M8 ${ROAD} H432`} className="fz3-o" />
      <RoadHatch />
      <Pop delay={0.1}>
        <Ambulance />
      </Pop>
      <Vec a={[SX + 50, ROAD - 34]} b={[SX + 96, ROAD - 34]} tone="lvl" t="v" at={[SX + 104, ROAD - 29]} anchor="start" delay={0.5} />
      <Person x={30} flip />
      <Person x={412} />
      <Fade delay={0.6}>
        <text x={12} y={28} className="fz3-lbl fz3-b fz3-halo">
          nižší tón
        </text>
        <text x={12} y={48} className="fz3-lbl fz3-sm fz3-halo">
          vlny roztažené
        </text>
        <text x={428} y={28} textAnchor="end" className="fz3-lbl fz3-b fz3-halo">
          vyšší tón
        </text>
        <text x={428} y={48} textAnchor="end" className="fz3-lbl fz3-sm fz3-halo">
          vlny nahuštěné
        </text>
      </Fade>
      <Fade delay={0.9}>
        <text x={110} y={262} textAnchor="middle" className="fz3-lbl fz3-sm">
          sanitka se vzdaluje
        </text>
        <text x={110} y={286} textAnchor="middle" className="fz3-eq">
          f′ = f · c / (c + v)
        </text>
        <text x={330} y={262} textAnchor="middle" className="fz3-lbl fz3-sm">
          sanitka se blíží
        </text>
        <text x={330} y={286} textAnchor="middle" className="fz3-eq">
          f′ = f · c / (c − v)
        </text>
        <text x={220} y={318} textAnchor="middle" className="fz3-lbl fz3-sm fz3-muted-t">
          c = rychlost zvuku, f = frekvence sirény
        </text>
      </Fade>
    </Figure>
  )
}

function RoadHatch() {
  const { id } = useFig()
  return <rect x={8} y={ROAD} width={424} height={7} fill={pat(id, 'd')} />
}
