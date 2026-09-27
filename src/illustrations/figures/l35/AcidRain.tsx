import type { CSSProperties } from 'react'
import { ChemText, CurveArrow, Fade, Figure, Note, Pop, T, pat, usePid } from './kit'

function Factory({ x, y }: { x: number; y: number }) {
  const p = usePid()
  const body = `M${x} ${y} V${y - 44} L${x + 22} ${y - 60} V${y - 44} L${x + 44} ${y - 60} V${y - 44} L${x + 66} ${y - 60} V${y - 44} L${x + 88} ${y - 60} V${y}Z`
  return (
    <g>
      <rect x={x + 14} y={y - 128} width={13} height={80} className="f35-fill2" />
      <rect x={x + 44} y={y - 112} width={12} height={64} className="f35-fill2" />
      <rect x={x + 14} y={y - 128} width={13} height={80} fill={pat(p, 'd')} />
      <path d={body} className="f35-fill" />
      <path d={body} fill={pat(p, 'd')} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 10 + i * 26} y={y - 30} width={14} height={14} className="f35-fill2" />
      ))}
      {/* smoke puffs (loop) */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 22} cy={y - 138} r={9} className="f35-puff f35-smoke" style={{ animationDelay: `${i * 1.3}s` }} />
      ))}
      {[0, 1].map((i) => (
        <circle key={`b${i}`} cx={x + 50} cy={y - 120} r={7} className="f35-puff f35-smoke" style={{ animationDelay: `${0.6 + i * 2}s` }} />
      ))}
    </g>
  )
}

function Car({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 6} V${y - 16} L${x + 10} ${y - 16} L${x + 18} ${y - 26} H${x + 38} L${x + 46} ${y - 16} H${x + 54} V${y - 6}Z`} className="f35-fill2" />
      <path d={`M${x + 21} ${y - 23} H${x + 36} L${x + 41} ${y - 16} H${x + 16}Z`} className="f35-glass" />
      <circle cx={x + 12} cy={y - 5} r={5.5} className="f35-fill" />
      <circle cx={x + 43} cy={y - 5} r={5.5} className="f35-fill" />
      <circle cx={x - 6} cy={y - 10} r={5} className="f35-puff f35-smoke" style={{ animationDelay: '0.4s' }} />
    </g>
  )
}

function Cloud({ cx, cy }: { cx: number; cy: number }) {
  const p = usePid()
  const d = `M${cx - 90} ${cy + 22} C${cx - 112} ${cy + 22} ${cx - 110} ${cy - 8} ${cx - 86} ${cy - 6} C${cx - 86} ${cy - 30} ${cx - 50} ${cy - 36} ${cx - 38} ${cy - 20} C${cx - 30} ${cy - 50} ${cx + 18} ${cy - 50} ${cx + 22} ${cy - 22} C${cx + 36} ${cy - 40} ${cx + 76} ${cy - 30} ${cx + 70} ${cy - 6} C${cx + 100} ${cy - 10} ${cx + 106} ${cy + 22} ${cx + 80} ${cy + 22}Z`
  return (
    <g>
      <path d={d} className="f35-cloud2" />
      <path d={d} fill={pat(p, 'd')} />
      <path d={d} className="f35-line" />
    </g>
  )
}

function Tree({ x, y, s = 1, dead = false }: { x: number; y: number; s?: number; dead?: boolean }) {
  if (dead)
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} className="f35-tree-dead">
        <path d="M0 0 V-58 M0 -46 L-12 -38 M0 -36 L11 -28 M0 -26 L-14 -16 M0 -50 L9 -44 M0 -16 L12 -8" />
      </g>
    )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -62 L14 -36 H7 L18 -16 H-18 L-7 -36 H-14Z" className="f35-tree" />
      <path d="M0 -16 V0" className="f35-line" />
    </g>
  )
}

function Rain({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const drops = []
  let i = 0
  for (let x = x1; x <= x2; x += 16) {
    const off = (i * 23) % 40
    drops.push(
      <path
        key={i}
        d={`M${x} ${y + off} l-3 9`}
        className="f35-rain f35-fall"
        style={{ animationDelay: `${((i * 0.37) % 1.6).toFixed(2)}s`, '--fx': '-14px', '--fy': '90px' } as CSSProperties}
      />,
    )
    i++
  }
  return <g>{drops}</g>
}

export default function AcidRain() {
  return (
    <Figure
      level={5}
      label="Kyselé deště: továrny a elektrárny vypouštějí oxid siřičitý SO2, auta oxidy dusíku NOx. V oblacích reagují s vodou a kyslíkem na kyselinu siřičitou, sírovou a dusičnou. Kyselý déšť s pH pod 5,6 poškozuje lesy a okyseluje jezera. Rovnice: SO2 + H2O → H2SO3; 2 SO2 + O2 → 2 SO3 a SO3 + H2O → H2SO4; 4 NO2 + O2 + 2 H2O → 4 HNO3."
      layouts={[
        {
          w: 420,
          h: 440,
          max: 600,
          draw: () => <Plate />,
        },
      ]}
    />
  )
}

function Plate() {
  const pid = usePid()
  return (
    <>
      {/* ground and lake */}
      <path d="M6 262 H414" className="f35-line" />
      <path d="M6 262 Q60 252 120 258 T240 256 T414 258" className="f35-thin" />
      <path d="M232 262 Q290 284 350 262Z" className="f35-lake" />
      <path d="M232 262 Q290 284 350 262Z" fill={`url(#${pid}-h)`} />
      <path d="M232 262 Q290 284 350 262" className="f35-line" />
      <Factory x={18} y={262} />
      <Car x={128} y={262} />
      <Fade d={0.4}>
        <T x={40} y={100} className="f35-t f35-b" size={15}>
          <ChemText text="SO_{2}" />
        </T>
        <T x={150} y={214} className="f35-t f35-b" size={15}>
          <ChemText text="NO_{x}" />
        </T>
      </Fade>
      <CurveArrow x1={50} y1={86} cx={70} cy={40} x2={148} y2={58} className="f35-arrow" delay={0.6} />
      <CurveArrow x1={156} y1={196} cx={176} cy={140} x2={196} y2={100} className="f35-arrow" delay={0.9} />
      <Pop d={0.2}>
        <Cloud cx={270} cy={66} />
      </Pop>
      <Fade d={1.3}>
        <T x={270} y={70} className="f35-t f35-b" size={14}>
          <ChemText text="H_{2}SO_{4}, HNO_{3}" />
        </T>
      </Fade>
      <Rain x1={210} x2={360} y={92} />
      <Fade d={1.5}>
        <text x={406} y={140} textAnchor="end" className="f35-mono f35-b f35-red-t" style={{ fontSize: 14 }}>
          pH &lt; 5,6
        </text>
      </Fade>
      {/* forest: healthy far left of the rain, dying under it */}
      <Pop d={0.8}>
        <Tree x={196} y={262} s={0.8} />
        <Tree x={366} y={262} s={1} dead />
        <Tree x={392} y={262} s={0.85} dead />
        <Tree x={218} y={262} s={0.95} dead />
      </Pop>
      <Fade d={1.8}>
        <Note x={410} y={296} anchor="end" tx={380} ty={228} size={15}>
          poškozený les
        </Note>
        <Note x={232} y={300} anchor="end" tx={276} ty={268} size={15}>
          okyselené jezero
        </Note>
      </Fade>
      {/* equations */}
      <line x1={10} x2={410} y1={318} y2={318} className="f35-rule" />
      <Fade d={2}>
        {[
          'SO_{2} + H_{2}O → H_{2}SO_{3}',
          '2 SO_{2} + O_{2} → 2 SO_{3};  SO_{3} + H_{2}O → H_{2}SO_{4}',
          '4 NO_{2} + O_{2} + 2 H_{2}O → 4 HNO_{3}',
        ].map((e, i) => (
          <text key={i} x={210} y={346 + i * 26} textAnchor="middle" className="f35-mono" style={{ fontSize: 12.5 }}>
            <ChemText text={e} />
          </text>
        ))}
        <text x={210} y={428} textAnchor="middle" className="f35-note" style={{ fontSize: 14 }}>
          kyselina siřičitá · sírová · dusičná
        </text>
      </Fade>
    </>
  )
}
