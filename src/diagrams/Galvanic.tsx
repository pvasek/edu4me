import { motion, useReducedMotion } from 'motion/react'
import { ChemText, Hatches, Svg, hatch, useSvgId, type DiagramProps } from './util'

function Tri({ x, y }: { x: number; y: number }) {
  return <polygon className="dg-wire-head" points={`${x + 6},${y} ${x - 5},${y - 6} ${x - 5},${y + 6}`} />
}

export default function Galvanic(_: DiagramProps) {
  const wire = 'M93 92 V44 H307 V92'
  const hid = useSvgId()
  const still = useReducedMotion()
  return (
    <div className="dg dg-galvanic">
      <Svg
        w={400}
        h={358}
        max={520}
        label="Daniellův článek: zinková elektroda v roztoku síranu zinečnatého je anoda (−), měděná elektroda v roztoku síranu měďnatého je katoda (+). Elektrony tečou vodičem od zinku k mědi přes voltmetr, který ukazuje 1,10 V. Solný můstek spojuje roztoky. Anoda: Zn → Zn2+ + 2e−, oxidace. Katoda: Cu2+ + 2e− → Cu, redukce."
      >
        <Hatches id={hid} />
        {/* solutions (engraved: tint + horizontal hatching) */}
        <rect x={34} y={158} width={132} height={102} fill="#aab8c6" fillOpacity={0.35} />
        <rect x={234} y={158} width={132} height={102} fill="#3b8fe0" fillOpacity={0.4} />
        <rect x={34} y={158} width={132} height={102} fill={hatch(hid, 'h')} className="dg-hatch" />
        <rect x={234} y={158} width={132} height={102} fill={hatch(hid, 'h')} className="dg-hatch" />

        {/* salt bridge */}
        <path className="dg-bridge-out" d="M150 200 V112 H250 V200" />
        <path className="dg-bridge-in" d="M150 200 V112 H250 V200" />
        <text className="dg-t dg-tiny" x={197} y={116} textAnchor="end">
          ← <ChemText text="NO_{3}^{-}" />
        </text>
        <text className="dg-t dg-tiny" x={205} y={116}>
          <ChemText text="K^{+}" /> →
        </text>
        <text className="dg-note" x={200} y={94} textAnchor="middle">
          solný můstek
        </text>

        {/* beakers */}
        <path className="dg-glass dg-glass-open" d="M28 134 L32 138 V262 H168 V138 L172 134" />
        <path className="dg-glass dg-glass-open" d="M228 134 L232 138 V262 H368 V138 L372 134" />

        {/* electrodes */}
        <rect x={84} y={92} width={18} height={150} rx={2} fill="#a5adb8" className="dg-outline" />
        <rect x={298} y={92} width={18} height={150} rx={2} fill="#c8753a" className="dg-outline" />
        <rect x={84} y={134} width={18} height={108} fill={hatch(hid, 'd')} className="dg-hatch dg-hatch-dark" />
        <rect x={298} y={134} width={18} height={108} fill={hatch(hid, 'd')} className="dg-hatch dg-hatch-dark" />
        <text className="dg-t dg-strong" x={93} y={126} textAnchor="middle" fill="#26221e" style={{ fill: '#26221e' }}>
          Zn
        </text>
        <text className="dg-t dg-strong" x={307} y={126} textAnchor="middle" fill="#26221e" style={{ fill: '#26221e' }}>
          Cu
        </text>

        {/* wire, electrons, voltmeter */}
        <path className="dg-wire" d={wire} />
        <motion.path
          className="dg-electrons"
          d={wire}
          initial={{ strokeDashoffset: 0 }}
          animate={still ? { strokeDashoffset: 0 } : { strokeDashoffset: -18 }}
          transition={still ? { duration: 0 } : { duration: 0.9, ease: 'linear', repeat: Infinity }}
        />
        <Tri x={140} y={44} />
        <Tri x={260} y={44} />
        <text className="dg-note dg-blue-t" x={140} y={32} textAnchor="middle">
          e⁻
        </text>
        <text className="dg-note dg-blue-t" x={260} y={32} textAnchor="middle">
          e⁻
        </text>
        <circle className="dg-rule dg-rule-fill" cx={200} cy={44} r={31} />
        <circle className="dg-box" cx={200} cy={44} r={27} />
        <text className="dg-t dg-tiny dg-muted" x={200} y={33} textAnchor="middle">
          V
        </text>
        <text className="dg-mono dg-strong" x={200} y={52} textAnchor="middle">
          1,10 V
        </text>

        {/* signs */}
        <circle className="dg-badge" cx={68} cy={72} r={12} />
        <text className="dg-badge-t" x={68} y={77} textAnchor="middle">
          −
        </text>
        <circle className="dg-badge" cx={332} cy={72} r={12} />
        <text className="dg-badge-t" x={332} y={77} textAnchor="middle">
          +
        </text>

        {/* ions */}
        <text className="dg-t dg-small" x={40} y={178}>
          <ChemText text="ZnSO_{4}" />
        </text>
        <text className="dg-t dg-small" x={322} y={178}>
          <ChemText text="CuSO_{4}" />
        </text>
        <text className="dg-t dg-small dg-strong" x={108} y={228}>
          <ChemText text="Zn^{2+}" /> →
        </text>
        <text className="dg-t dg-small dg-strong" x={292} y={228} textAnchor="end">
          <ChemText text="Cu^{2+}" /> →
        </text>
        <text className="dg-t dg-small dg-muted" x={40} y={252}>
          <ChemText text="SO_{4}^{2-}" />
        </text>
        <text className="dg-t dg-small dg-muted" x={322} y={252}>
          <ChemText text="SO_{4}^{2-}" />
        </text>

        {/* half-reactions */}
        <text className="dg-t dg-strong" x={100} y={284} textAnchor="middle">
          anoda (−)
        </text>
        <text className="dg-t" x={100} y={304} textAnchor="middle">
          <ChemText text="Zn → Zn^{2+} + 2e^{-}" />
        </text>
        <text className="dg-note" x={100} y={324} textAnchor="middle">
          oxidace
        </text>
        <text className="dg-t dg-strong" x={300} y={284} textAnchor="middle">
          katoda (+)
        </text>
        <text className="dg-t" x={300} y={304} textAnchor="middle">
          <ChemText text="Cu^{2+} + 2e^{-} → Cu" />
        </text>
        <text className="dg-note" x={300} y={324} textAnchor="middle">
          redukce
        </text>
        <text className="dg-t dg-small dg-muted" x={200} y={350} textAnchor="middle">
          <ChemText text="celkem: Zn + Cu^{2+} → Zn^{2+} + Cu" />
        </text>
      </Svg>
    </div>
  )
}
