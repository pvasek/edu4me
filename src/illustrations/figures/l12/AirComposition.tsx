import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Draw, Fade, Lbl, Plate, Pop, Sub, drawV, useHatch, type HatchKind } from './kit'

const CX = 175
const CY = 205
const R = 140

const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)] as const
}
const arc = (a0: number, a1: number, r: number) => {
  const [x0, y0] = pt(a0, r)
  const [x1, y1] = pt(a1, r)
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}
const wedge = (a0: number, a1: number) => `M${CX} ${CY} L${pt(a0, R).join(' ')} ${arc(a0, a1, R).replace(/^M[^A]*/, '')} Z`

const SECTORS: { a0: number; a1: number; cls: string; hatch: HatchKind; delay: number }[] = [
  { a0: 0, a1: 281.09, cls: 'f12-air-n2', hatch: 'd', delay: 0.07 },
  { a0: 281.09, a1: 356.51, cls: 'f12-air-o2', hatch: 'x', delay: 0.63 },
  { a0: 356.51, a1: 360, cls: 'f12-air-ar', hatch: 's', delay: 0.84 },
]

function Mol({ kind }: { kind: 'N2' | 'O2' | 'Ar' | 'CO2' }) {
  if (kind === 'Ar') return <circle className="f12-atom f12-Ar" cx={0} cy={0} r={9} />
  if (kind === 'CO2')
    return (
      <g>
        <circle className="f12-atom f12-O" cx={-14} cy={0} r={7.5} />
        <circle className="f12-atom f12-O" cx={14} cy={0} r={7.5} />
        <circle className="f12-atom f12-C" cx={0} cy={0} r={8} />
      </g>
    )
  const c = kind === 'N2' ? 'f12-N' : 'f12-O'
  return (
    <g>
      <circle className={`f12-atom ${c}`} cx={-7} cy={0} r={9} />
      <circle className={`f12-atom ${c}`} cx={7} cy={0} r={9} />
    </g>
  )
}

const ROWS: { kind: 'N2' | 'O2' | 'Ar' | 'CO2'; name: ReactNode; v: string }[] = [
  { kind: 'N2', name: <>dusík N<Sub>2</Sub></>, v: '78 %' },
  { kind: 'O2', name: <>kyslík O<Sub>2</Sub></>, v: '21 %' },
  { kind: 'Ar', name: 'argon Ar', v: '0,93 %' },
  { kind: 'CO2', name: <>oxid uhličitý</>, v: '0,04 %' },
]

export default function AirComposition() {
  return (
    <Plate
      level={1}
      w={620}
      h={400}
      max={640}
      label="Složení suchého vzduchu v objemových procentech: dusík 78 %, kyslík 21 %, argon 0,93 %, oxid uhličitý 0,04 % a ostatní plyny (neon, helium, methan, vodík) dohromady méně než 0,01 %. Zvětšený výřez ukazuje, že zbylé asi 1 % tvoří hlavně argon."
    >
      <Body />
    </Plate>
  )
}

function Body() {
  const h = useHatch()
  const [mx, my] = pt(358, R - 6)
  return (
    <>
      {/* pie: thick arcs sweep in, hatching follows */}
      {SECTORS.map((s) => (
        <motion.path key={s.cls} className={`f12-sweep ${s.cls}`} d={arc(s.a0, s.a1, R / 2)} style={{ strokeWidth: R }} variants={drawV(s.delay, s.a1 - s.a0 > 100 ? 1 : 0.4)} />
      ))}
      <Fade delay={0.91}>
        {SECTORS.map((s) => (
          <path key={s.cls} className="f12-hatch" d={wedge(s.a0, s.a1)} fill={h(s.hatch)} />
        ))}
      </Fade>
      <Fade delay={0.84}>
        {SECTORS.map((s) => (
          <path key={s.cls} className="f12-line" d={wedge(s.a0, s.a1)} />
        ))}
      </Fade>
      <Draw d={`M${CX} ${CY - R - 5} ${arc(0, 359.9, R + 5).replace(/^M[^A]*/, '')}`} className="f12-thin" dur={1.6} />

      <Fade delay={1.05}>
        <text className="f12-pie-t" x={226} y={262} textAnchor="middle">
          dusík
        </text>
        <text className="f12-pie-v" x={226} y={292} textAnchor="middle">
          78 %
        </text>
        <text className="f12-pie-t" x={114} y={136} textAnchor="middle">
          kyslík
        </text>
        <text className="f12-pie-v" x={114} y={164} textAnchor="middle">
          21 %
        </text>
      </Fade>

      {/* zoom on the last 1 % */}
      <Pop delay={1.19}>
        <circle className="f12-zoom" cx={mx} cy={my} r={13} />
      </Pop>
      <Draw d={`M${mx + 9} ${my - 9} L372 42 M${mx + 9} ${my + 9} L372 150`} className="f12-thin f12-dash" delay={1.26} dur={0.6} />
      <Pop delay={1.4}>
        <g>
          <rect className="f12-inset-plain" x={372} y={36} width={236} height={120} rx={6} />
          <text className="f12-t f12-t-strong" x={386} y={62}>
            zbylé ≐ 1 %
          </text>
          <motion.g variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: 1.61, duration: 0.8 } } }} style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}>
            <rect className="f12-air-ar-bar" x={386} y={76} width={196} height={26} />
            <rect className="f12-hatch" x={386} y={76} width={196} height={26} fill={h('s')} />
            <rect className="f12-air-co2-bar" x={582} y={76} width={9} height={26} />
            <rect className="f12-air-tr-bar" x={591} y={76} width={3} height={26} />
          </motion.g>
          <text className="f12-t" x={390} y={126}>
            argon 0,93 %
          </text>
          <Lbl x={594} y={140} tx={586} ty={104} anchor="end" delay={1.82} sec>
            CO₂ 0,04 %
          </Lbl>
        </g>
      </Pop>

      {/* legend with molecules */}
      {ROWS.map((r, i) => (
        <Pop key={r.kind} delay={1.26 + i * 0.08}>
          <g transform={`translate(0 ${206 + i * 44})`}>
            <g transform="translate(396 0)">
              <Mol kind={r.kind} />
            </g>
            <text className="f12-t f12-t-strong" x={426} y={6}>
              {r.kind === 'CO2' ? (
                <>
                  CO<Sub>2</Sub>
                </>
              ) : (
                r.name
              )}
            </text>
            <text className="f12-num f12-legend-v" x={606} y={6} textAnchor="end">
              {r.v}
            </text>
            <path className="f12-hair" d="M372 22 L606 22" />
          </g>
        </Pop>
      ))}
      <text className="f12-small" x={CX} y={386} textAnchor="middle">
        suchý vzduch, objemová %
      </text>
    </>
  )
}
