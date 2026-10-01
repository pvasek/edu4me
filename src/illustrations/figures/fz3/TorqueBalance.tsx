import { Eq, Fade, Figure, Pop, Sym, Vec, pat, useFig } from './kit'

const LABEL =
  'Momentová věta. Houpačka je v rovnováze, když jsou momenty sil na obou stranách osy stejné: dítě o hmotnosti 40 kg sedí 1,5 m od osy a působí tíhou 400 N, moment 400 N · 1,5 m = 600 N·m; dítě o hmotnosti 30 kg sedí 2 m od osy, moment 300 N · 2 m = 600 N·m. Lehčí dítě tedy musí sedět dál. Věžový jeřáb: břemeno 1 t na výložníku 12 m od věže vyrovnává protizávaží 2 t ve vzdálenosti 6 m; oba momenty mají velikost 120 kN·m (g ≐ 10 N/kg).'

const PX = 80 // px per metre on the seesaw
const P0: [number, number] = [210, 112] // pivot top

function Kid({ x, y, s, col }: { x: number; y: number; s: number; col: string }) {
  // a child sitting on the beam at (x, y); s = size factor
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-12 0 Q-13 -26 0 -30 Q13 -26 12 0Z" fill={col} className="fz3-o" />
      <circle cx={0} cy={-40} r={10} className="fz3-o fz3-skin" />
      <path d="M-8 -46 Q0 -54 8 -46" className="fz3-o fz3-hair" />
      <path d="M-10 -2 L-16 14 M10 -2 L16 14" className="fz3-o" style={{ strokeWidth: 3 }} />
    </g>
  )
}

function Seesaw() {
  const { id } = useFig()
  const x1 = P0[0] - 1.5 * PX
  const x2 = P0[0] + 2 * PX
  const by = P0[1] - 8
  return (
    <g>
      <path d={`M${P0[0]} ${P0[1]} L${P0[0] - 22} ${P0[1] + 44} H${P0[0] + 22}Z`} className="fz3-o fz3-fill2" />
      <path d={`M${P0[0]} ${P0[1]} L${P0[0] - 22} ${P0[1] + 44} H${P0[0] + 22}Z`} fill={pat(id, 'd')} />
      <path d={`M24 ${P0[1] + 44} H396`} className="fz3-o" />
      <rect x={34} y={by} width={352} height={9} rx={2} className="fz3-o fz3-wood" />
      <circle cx={P0[0]} cy={P0[1] - 3} r={3} className="fz3-dot" />
      <Kid x={x1} y={by} s={1.12} col="#6f9fd8" />
      <Kid x={x2} y={by} s={0.95} col="#d9736a" />
      {/* weights */}
      <Vec a={[x1, by + 10]} b={[x1, by + 10 + 40]} tone="red" t="F_{1}" at={[x1 - 12, by + 44]} anchor="end" delay={0.5} />
      <Vec a={[x2, by + 10]} b={[x2, by + 10 + 30]} tone="red" t="F_{2}" at={[x2 + 12, by + 36]} anchor="start" delay={0.6} />
      {/* arms */}
      <Fade delay={0.8}>
        <path
          d={`M${x1} ${P0[1] + 60} V${P0[1] + 70} M${x1} ${P0[1] + 65} H${P0[0]} M${P0[0]} ${P0[1] + 60} V${P0[1] + 70} M${P0[0]} ${P0[1] + 65} H${x2} M${x2} ${P0[1] + 60} V${P0[1] + 70}`}
          className="fz3-o fz3-thin"
        />
        <Sym x={(x1 + P0[0]) / 2} y={P0[1] + 88} t="r_{1} = 1,5 m" />
        <Sym x={(x2 + P0[0]) / 2} y={P0[1] + 88} t="r_{2} = 2 m" />
        <text x={x1} y={30} textAnchor="middle" className="fz3-eq fz3-eq-sm">
          40 kg → 400 N
        </text>
        <text x={x2 - 16} y={30} textAnchor="middle" className="fz3-eq fz3-eq-sm">
          30 kg → 300 N
        </text>
      </Fade>
    </g>
  )
}

function Crane() {
  const { id } = useFig()
  const T = 176 // tower axis
  const JY = 304 // jib
  const PXM = 18 // px per metre
  const cw = T - 6 * PXM
  const ld = T + 12 * PXM
  return (
    <g>
      <path d={`M24 468 H396`} className="fz3-o" />
      {/* tower (lattice) */}
      <path d={`M${T - 9} 468 V${JY - 26} H${T + 9} V468`} className="fz3-o fz3-crane" />
      <path
        d={Array.from({ length: 8 }, (_, i) => `M${T - 9} ${468 - i * 22} L${T + 9} ${468 - (i + 1) * 22}`).join(' ')}
        className="fz3-o fz3-thin"
      />
      <path d={`M${T} ${JY - 26} L${cw + 10} ${JY - 2} M${T} ${JY - 26} L${ld - 30} ${JY - 2}`} className="fz3-o fz3-thin" />
      {/* jib */}
      <rect x={cw - 16} y={JY - 3} width={ld + 22 - (cw - 16)} height={8} className="fz3-o fz3-crane" />
      <rect x={cw - 16} y={JY - 3} width={ld + 22 - (cw - 16)} height={8} fill={pat(id, 'x')} opacity={0.5} />
      {/* counterweight */}
      <rect x={cw - 16} y={JY + 5} width={32} height={30} className="fz3-o fz3-fill3" />
      <rect x={cw - 16} y={JY + 5} width={32} height={30} fill={pat(id, 'brick')} />
      {/* trolley, cable, load */}
      <rect x={ld - 8} y={JY + 5} width={16} height={6} className="fz3-o fz3-fill2" />
      <path d={`M${ld} ${JY + 11} V${JY + 64}`} className="fz3-o fz3-thin" />
      <rect x={ld - 18} y={JY + 64} width={36} height={24} className="fz3-o fz3-load" />
      <rect x={ld - 18} y={JY + 64} width={36} height={24} fill={pat(id, 'd')} opacity={0.5} />
      <Vec a={[cw, JY + 38]} b={[cw, JY + 38 + 56]} tone="red" t="20 kN" at={[cw + 8, JY + 86]} anchor="start" delay={1} />
      <Vec a={[ld, JY + 90]} b={[ld, JY + 90 + 28]} tone="red" t="10 kN" at={[ld - 8, JY + 114]} anchor="end" delay={1.1} />
      <Fade delay={1.1}>
        <path
          d={`M${cw} ${JY - 22} V${JY - 14} M${cw} ${JY - 18} H${T} M${T} ${JY - 40} V${JY - 32} M${T} ${JY - 36} H${ld} M${ld} ${JY - 40} V${JY - 32}`}
          className="fz3-o fz3-thin"
        />
        <text x={(cw + T) / 2} y={JY - 26} textAnchor="middle" className="fz3-eq fz3-eq-sm">
          6 m
        </text>
        <text x={(T + ld) / 2} y={JY - 44} textAnchor="middle" className="fz3-eq fz3-eq-sm">
          12 m
        </text>
        <text x={cw - 18} y={JY + 118} className="fz3-lbl">
          protizávaží 2 t
        </text>
        <text x={ld - 24} y={JY + 80} textAnchor="end" className="fz3-lbl">
          břemeno 1 t
        </text>
      </Fade>
    </g>
  )
}

export default function TorqueBalance() {
  return (
    <Figure level={9} w={420} h={534} max={560} boost={false} label={LABEL}>
      <Pop delay={0}>
        <Seesaw />
      </Pop>
      <Pop delay={1}>
        <rect x={40} y={212} width={340} height={50} rx={6} className="fz3-tag-lvl" />
        <Eq x={210} y={233} t="M_{1} = F_{1} · r_{1} = 400 N · 1,5 m = 600 N·m" anchor="middle" />
        <Eq x={210} y={254} t="M_{2} = F_{2} · r_{2} = 300 N · 2 m = 600 N·m" anchor="middle" />
      </Pop>
      <g transform="translate(0 30)">
        <Pop delay={0.4}>
          <Crane />
        </Pop>
      </g>
      <Fade delay={1.3}>
        <text x={210} y={526} textAnchor="middle" className="fz3-lbl">
          20 kN · 6 m = 10 kN · 12 m = 120 kN·m
        </text>
      </Fade>
    </Figure>
  )
}
