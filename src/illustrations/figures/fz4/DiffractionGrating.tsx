import { Angle, Draw, Fade, Figure, Pop, Qty, Sym, f1 } from './kit'

const LABEL =
  'Optická mřížka v bílém světle. Bílé světlo dopadá kolmo na mřížku s mřížkovou konstantou d (zde 300 vrypů na milimetr, d ≈ 3,3 µm). Za mřížkou vznikají ostrá maxima pod úhly, pro které platí d · sin α = k · λ. Střední maximum nultého řádu k = 0 zůstane bílé, protože tam se zesílí všechny barvy. V prvním řádu k = ±1 a ve druhém řádu k = ±2 se světlo rozloží na spektrum: fialová (400 nm) je nejblíže středu, červená (700 nm) se ohýbá nejvíc – opačně než v hranolu. Spektra druhého řádu jsou dvakrát širší.'

const XG = 170 // grating
const XS = 440 // screen
const CY = 170
const L = XS - XG
const D = 3333 // nm
const COLS: [number, string][] = [
  [700, '#d9342b'],
  [630, '#ec7a1c'],
  [585, '#e8c21c'],
  [530, '#3fa24a'],
  [480, '#2f8fd0'],
  [440, '#3b4fc4'],
  [405, '#7d3fb8'],
]
const yAt = (k: number, lam: number) => CY - L * Math.tan(Math.asin((k * lam) / D))

export default function DiffractionGrating() {
  const orders = [-2, -1, 1, 2]
  const a1 = (Math.asin(700 / D) * 180) / Math.PI
  return (
    <Figure level={12} w={520} h={340} max={680} label={LABEL}>
      {/* lamp and white beam */}
      <circle cx={34} cy={CY} r={16} className="fz4-o fz4-bulb" />
      <path d={`M28 ${CY + 16} V${CY + 26} H40 V${CY + 16}`} className="fz4-o fz4-fill3" />
      <rect x={52} y={CY - 10} width={XG - 52} height={20} className="fz4-white-beam" />
      <text x={34} y={CY - 26} textAnchor="middle" className="fz4-lbl fz4-b">
        bílé světlo
      </text>
      {/* rays fanning out */}
      <Fade delay={0.4}>
        <path d={`M${XG} ${CY} H${XS}`} className="fz4-ray-white" />
        {orders.map((k) =>
          COLS.map(([lam, c]) => (
            <path key={`${k}-${lam}`} d={`M${XG} ${CY} L${XS} ${f1(yAt(k, lam))}`} className="fz4-ray-col" style={{ stroke: c }} />
          )),
        )}
      </Fade>
      {/* grating */}
      <path d={`M${XG} 36 V304`} className="fz4-grating" />
      <text x={XG} y={26} textAnchor="middle" className="fz4-lbl fz4-b">
        mřížka
      </text>
      {/* screen with spectra */}
      <rect x={XS - 3} y={18} width={10} height={304} className="fz4-o fz4-fill3" />
      <Pop delay={1}>
        <rect x={XS - 3} y={CY - 5} width={10} height={10} className="fz4-o fz4-thin fz4-white" />
        {orders.map((k) =>
          COLS.map(([lam, c], i) => {
            const y = yAt(k, lam)
            const next = i < COLS.length - 1 ? yAt(k, COLS[i + 1][0]) : y + (y - yAt(k, COLS[i - 1][0]))
            const h = Math.abs(next - y) + 0.8
            return <rect key={`${k}-${lam}`} x={XS - 3} y={f1(Math.min(y, next))} width={10} height={f1(h)} fill={c} />
          }),
        )}
      </Pop>
      <text x={XS + 2} y={12} textAnchor="middle" className="fz4-lbl fz4-b">
        stínítko
      </text>
      <Fade delay={1.2}>
        {[0, ...orders].map((k) => {
          const y = k === 0 ? CY : (yAt(k, 405) + yAt(k, 700)) / 2
          return (
            <text key={k} x={XS + 14} y={y + 5} className="fz4-eq fz4-eq-sm">
              k = {k < 0 ? '−' : ''}
              {Math.abs(k)}
            </text>
          )
        })}
      </Fade>
      {/* angle of the first order (red) */}
      <Fade delay={1.3}>
        <Angle c={[XG, CY]} a1={-a1} a2={0} r={74} />
        <Sym x={XG + 88} y={CY - 6} t="α_{1}" anchor="start" className="fz4-sym-sm" />
      </Fade>
      <Draw d={`M${XG} ${CY} L${XS} ${f1(yAt(1, 700))}`} className="fz4-ray-col fz4-ray-key" style={{ stroke: COLS[0][1] }} delay={0.9} />
      <Pop delay={1.5}>
        <rect x={10} y={262} width={150} height={30} rx={6} className="fz4-tag-lvl" />
        <Qty x={85} y={282} s="d sin α = k λ" anchor="middle" />
      </Pop>
      <Fade delay={1.6}>
        <text x={10} y={318} className="fz4-lbl fz4-sm">
          červená se ohýbá víc než fialová
        </text>
      </Fade>
    </Figure>
  )
}
