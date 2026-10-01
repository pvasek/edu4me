import { Axes, Draw, DrawArrow, Fade, Figure, Lbl, Pop, Qty, Sym, pat, useFig } from './kit'

const LABEL =
  'Diagram napětí–deformace tažné oceli a zkušební tyč na trhacím stroji. Na vodorovné ose je relativní prodloužení ε, na svislé normálové napětí σ_n. Nejdřív strmá přímka: pružná deformace, kde platí Hookův zákon σ_n = E · ε, až po mez pružnosti σ_E. Pak kluz: materiál se trvale prodlužuje téměř bez zvýšení napětí. Následuje zpevnění až k mezi pevnosti σ_p, nejvyššímu bodu křivky. Potom se tyč zúží v krčku, napětí klesá a tyč se přetrhne. Pod grafem tyč upnutá v čelistech, natahovaná silami F, s původní délkou l₀.'

// plot (not to scale: the elastic part is stretched so it can be seen)
const O = [60, 292] as const
const A = [78, 176] as const // elastic limit
const B = [82, 166] as const // upper yield point
const C = [130, 174] as const // end of yielding
const D = [292, 108] as const // ultimate strength
const E = [372, 148] as const // fracture

const CURVE = `M${O[0]} ${O[1]} L${A[0]} ${A[1]} Q${A[0] + 2} ${A[1] - 8} ${B[0]} ${B[1]} L${B[0] + 4} ${A[1]} Q${B[0] + 14} ${A[1] + 3} ${B[0] + 24} ${A[1] - 1} Q${B[0] + 36} ${A[1] - 4} ${C[0]} ${C[1]} C${C[0] + 56} ${C[1] - 44} ${D[0] - 66} ${D[1]} ${D[0]} ${D[1]} C${D[0] + 38} ${D[1]} ${E[0] - 26} ${E[1] - 22} ${E[0]} ${E[1]}`

function Specimen() {
  const { id } = useFig()
  const y = 350
  const bone = `M100 ${y - 12} H106 Q114 ${y - 12} 116 ${y - 6} H304 Q306 ${y - 12} 314 ${y - 12} H320 V${y + 12} H314 Q306 ${y + 12} 304 ${y + 6} H116 Q114 ${y + 12} 106 ${y + 12} H100Z`
  return (
    <g>
      {/* jaws */}
      {[60, 320].map((x) => (
        <g key={x}>
          <rect x={x} y={y - 22} width={40} height={44} rx={3} className="fz4-o fz4-steel" />
          <rect x={x} y={y - 22} width={40} height={44} rx={3} fill={pat(id, 'xd')} />
        </g>
      ))}
      <path d={bone} className="fz4-o fz4-fill" />
      <path d={bone} fill={pat(id, 'b')} opacity={0.6} />
      <DrawArrow d={`M58 ${y} H22`} tone="red" delay={1.2} className="fz4-vec" />
      <DrawArrow d={`M362 ${y} H398`} tone="red" delay={1.2} className="fz4-vec" />
      <Fade delay={1.5}>
        <Sym x={34} y={y - 12} t="F" tone="red" />
        <Sym x={386} y={y - 12} t="F" tone="red" />
      </Fade>
      <path d={`M116 ${y - 16} V${y - 28} M304 ${y - 16} V${y - 28} M118 ${y - 23} H302`} className="fz4-o fz4-thin" />
      <Sym x={210} y={y - 30} t="l_{0}" />
      <text x={210} y={y + 34} textAnchor="middle" className="fz4-lbl fz4-sm">
        zkušební tyč v čelistech trhacího stroje
      </text>
    </g>
  )
}

export default function StressStrain() {
  return (
    <Figure level={10} w={420} h={392} max={600} label={LABEL}>
      <Axes x={O[0]} y={O[1]} w={350} h={268} xl="ε" yl="σ_{n}" />
      {/* elastic region tint */}
      <Fade delay={0.4}>
        <path d={`M${O[0]} ${O[1]} L${A[0]} ${A[1]} V${O[1]}Z`} className="fz4-region" />
      </Fade>
      {/* guide lines to the axis */}
      <Fade delay={1.1}>
        <path d={`M${O[0]} ${A[1]} H${A[0]} M${O[0]} ${D[1]} H${D[0]}`} className="fz4-o fz4-thin fz4-dash" />
        <Sym x={O[0] - 6} y={A[1] + 6} t="σ_{E}" anchor="end" />
        <Sym x={O[0] - 6} y={D[1] + 6} t="σ_{p}" anchor="end" />
      </Fade>
      <Draw d={CURVE} className="fz4-curve fz4-curve-lvl" delay={0.1} />
      <Pop delay={1.2}>
        <circle cx={A[0]} cy={A[1]} r={4} className="fz4-pt" />
        <circle cx={D[0]} cy={D[1]} r={4} className="fz4-pt" />
        <path d={`M${E[0] - 6} ${E[1] - 6} L${E[0] + 6} ${E[1] + 6} M${E[0] + 6} ${E[1] - 6} L${E[0] - 6} ${E[1] + 6}`} className="fz4-break" />
      </Pop>
      <Fade delay={1.3}>
        <Lbl x={68} y={98} tx={A[0] + 1} ty={A[1] - 3} className="fz4-b">
          mez pružnosti
        </Lbl>
        <text x={D[0]} y={D[1] - 14} textAnchor="middle" className="fz4-lbl fz4-b">
          mez pevnosti
        </text>
        <text x={106} y={200} className="fz4-lbl fz4-b">
          kluz
        </text>
        <text x={206} y={172} className="fz4-lbl fz4-b">
          zpevnění
        </text>
        <text x={E[0]} y={E[1] + 26} textAnchor="middle" className="fz4-lbl fz4-b">
          přetržení
        </text>
        <text x={E[0] - 4} y={E[1] - 36} textAnchor="middle" className="fz4-lbl fz4-sm fz4-sec">
          krček
        </text>
        <Lbl x={90} y={250} tx={66} ty={252} className="fz4-b fz4-lvl-t">
          pružná deformace
        </Lbl>
        <Qty x={90} y={272} s="σ_{n} = E · ε" />
      </Fade>
      <Specimen />
    </Figure>
  )
}
