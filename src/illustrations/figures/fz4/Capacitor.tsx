import { Draw, DrawArrow, Fade, Figure, Head, Lbl, Pop, Qty, Sym, pat, useCompact, useFig } from './kit'

const LABEL =
  'Deskový kondenzátor připojený ke zdroji. Zdroj o napětí U přesune elektrony z levé desky na pravou: levá deska připojená ke kladnému pólu má náboj +Q, pravá −Q. Mezi deskami vzdálenými d je dielektrikum (izolant); jeho molekuly se v poli natočí jako malé dipóly a pole uvnitř zeslabí. Siločáry pole E vedou od kladné desky k záporné. Vpravo schematická značka kondenzátoru, dvě rovnoběžné čárky. Kapacita C = Q / U, pro deskový kondenzátor C = ε₀ · ε_r · S / d, kde S je plocha desky.'

const PL = 120 // left plate (outer x)
const PR = 232 // right plate (outer x)
const T = 8 // plate thickness
const Y0 = 50
const Y1 = 210
const WY = 284 // bottom wire

function Device() {
  const { id } = useFig()
  const rows = [66, 92, 118, 144, 170, 196]
  return (
    <g>
      {/* dielectric */}
      <rect x={146} y={62} width={68} height={136} rx={3} className="fz4-o fz4-thin fz4-dielectric" />
      <rect x={146} y={62} width={68} height={136} rx={3} fill={pat(id, 'b')} opacity={0.5} />
      {/* plates */}
      <rect x={PL} y={Y0} width={T} height={Y1 - Y0} className="fz4-o fz4-plate-p" />
      <rect x={PR} y={Y0} width={T} height={Y1 - Y0} className="fz4-o fz4-plate-n" />
      {/* field */}
      {[130, 180].map((y, i) => (
        <DrawArrow key={y} d={`M150 ${y} H210`} tone="blue" delay={0.6 + i * 0.08} />
      ))}
      {/* polarised molecules of the dielectric: − towards the + plate */}
      <Fade delay={1}>
        {[
          [166, 105],
          [194, 105],
          [166, 155],
          [194, 155],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <ellipse cx={x} cy={y} rx={11} ry={6.5} className="fz4-o fz4-thin fz4-fill" />
            <text x={x - 5} y={y + 3.5} textAnchor="middle" className="fz4-dip-t fz4-blue-t">
              −
            </text>
            <text x={x + 5} y={y + 3.5} textAnchor="middle" className="fz4-dip-t fz4-red-t">
              +
            </text>
          </g>
        ))}
      </Fade>
      {/* charges on the inner faces */}
      <Pop delay={0.9}>
        {rows.map((y) => (
          <g key={y}>
            <text x={PL + T + 9} y={y + 5} textAnchor="middle" className="fz4-charge-t fz4-red-t">
              +
            </text>
            <text x={PR - 9} y={y + 5} textAnchor="middle" className="fz4-charge-t fz4-blue-t">
              −
            </text>
          </g>
        ))}
      </Pop>
      {/* wires and source */}
      <Draw d={`M${PL} 130 H80 V${WY} H170`} className="fz4-wire" delay={0} />
      <Draw d={`M182 ${WY} H280 V130 H${PR + T}`} className="fz4-wire" delay={0} />
      <path d={`M170 ${WY - 16} V${WY + 16}`} className="fz4-cell-long" />
      <path d={`M182 ${WY - 8} V${WY + 8}`} className="fz4-cell-short" />
      <text x={162} y={WY - 20} textAnchor="middle" className="fz4-eq fz4-eq-sm">
        +
      </text>
      <text x={190} y={WY - 14} textAnchor="middle" className="fz4-eq fz4-eq-sm">
        −
      </text>
      <path d={`M80 ${WY} H170 M182 ${WY} H280`} className="fz4-eflow" />
      <Fade delay={1.1}>
        <Head x={80} y={196} deg={90} tone="blue" s={1.3} />
        <Head x={280} y={204} deg={-90} tone="blue" s={1.3} />
        <Sym x={70} y={202} t="e^{−}" anchor="end" tone="blue" />
        <Sym x={290} y={210} t="e^{−}" anchor="start" tone="blue" />
        <text x={176} y={WY + 36} textAnchor="middle" className="fz4-lbl fz4-sm">
          zdroj napětí <tspan className="fz4-it fz4-b">U</tspan>
        </text>
      </Fade>
      {/* labels */}
      <Fade delay={1.3}>
        <Qty x={PL - 8} y={76} s="+Q" anchor="end" className="fz4-eq-lg fz4-red-t" />
        <Qty x={PR + T + 8} y={76} s="−Q" className="fz4-eq-lg fz4-blue-t" />
        <path d={`M${PL + T} ${Y1 + 8} V${Y1 + 22} M${PR} ${Y1 + 8} V${Y1 + 22}`} className="fz4-o fz4-thin" />
        <path d={`M${PL + T + 2} ${Y1 + 15} H${PR - 2}`} className="fz4-o fz4-thin" />
        <Sym x={180} y={Y1 + 38} t="d" />
        <Lbl x={20} y={28} tx={PL + 3} ty={Y0 + 2} className="fz4-sm">
          deska, plocha S
        </Lbl>
        <Lbl x={316} y={28} tx={206} ty={66} anchor="end" className="fz4-sm">
          dielektrikum
        </Lbl>
        <Sym x={180} y={88} t="E" tone="blue" />
      </Fade>
    </g>
  )
}

function SymbolBox() {
  return (
    <g>
      <text x={75} y={0} textAnchor="middle" className="fz4-lbl fz4-b">
        schematická značka
      </text>
      <Draw d="M4 42 H64 M86 42 H146" className="fz4-wire" delay={0.4} />
      <path d="M64 18 V66 M86 18 V66" className="fz4-cap-sym" />
      <Sym x={75} y={92} t="C" />
      <Pop delay={1.4}>
        <rect x={0} y={108} width={150} height={66} rx={6} className="fz4-tag-lvl" />
        <Qty x={75} y={134} s="C = Q / U" anchor="middle" />
        <Qty x={75} y={160} s="C = ε_{0} ε_{r} S / d" anchor="middle" />
      </Pop>
    </g>
  )
}

export default function Capacitor() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure level={11} w={n ? 340 : 530} h={n ? 520 : 332} max={n ? 420 : 680} compact={compact} boost={false} label={LABEL}>
      <g transform={n ? 'translate(4 0)' : undefined}>
        <Device />
      </g>
      <g transform={n ? 'translate(95 344)' : 'translate(362 84)'}>
        <SymbolBox />
      </g>
    </Figure>
  )
}
