import { Draw, Lbl, Plate, Pop } from './kit'

const CY = 112
const RO = 68

function Nucleon({ x, y, p }: { x: number; y: number; p: boolean }) {
  return (
    <g>
      <circle className={p ? 'f12-proton' : 'f12-neutron'} cx={x} cy={y} r={12} />
      <path className="f12-shine" d={`M${x - 7.5} ${y - 2} A8 8 0 0 1 ${x - 2} ${y - 7.5}`} opacity={0.7} />
      {p && (
        <text className="f12-charge" x={x} y={y + 0.5} style={{ fontSize: 13 }}>
          +
        </text>
      )}
    </g>
  )
}

const ISO = [
  { name: 'protium', a: 1, n: 0, occ: '99,98 %', nuc: [[0, 0, 1]] },
  { name: 'deuterium', a: 2, n: 1, occ: '0,02 %', nuc: [[-10, 0, 1], [10, 0, 0]] },
  { name: 'tritium', a: 3, n: 2, occ: 'stopy · radioaktivní', nuc: [[0, -9, 1], [-10.5, 8, 0], [10.5, 8, 0]] },
] as const

function Isotope({ i }: { i: number }) {
  const it = ISO[i]
  const cx = 100 + i * 200
  return (
    <g>
      <Draw d={`M${cx - RO} ${CY} A${RO} ${RO} 0 1 1 ${cx + RO} ${CY} A${RO} ${RO} 0 1 1 ${cx - RO} ${CY}`} className="f12-orbit2" delay={0.2 + i * 0.2} dur={1} />
      {it.nuc.map(([dx, dy, p], k) => (
        <Pop key={k} delay={0.5 + i * 0.25 + k * 0.12}>
          <Nucleon x={cx + dx} y={CY + dy} p={p === 1} />
        </Pop>
      ))}
      {i === 2 && (
        <g className="f12-rays">
          <path d={`M${cx + 24} ${CY - 22} q5 -4 3 -9 q-2 -5 3 -9 M${cx - 26} ${CY - 20} q-5 -4 -3 -9 q2 -5 -3 -9 M${cx + 28} ${CY + 18} q6 2 9 -2 q3 -4 9 -2`} />
        </g>
      )}
      <Pop delay={1 + i * 0.2}>
        <g className="f12-spin" style={{ transformOrigin: `${cx}px ${CY}px`, animationDuration: `${5 + i}s` }}>
          <circle className="f12-electron" cx={cx} cy={CY - RO} r={7} />
          <text className="f12-charge" x={cx} y={CY - RO + 0.5} style={{ fontSize: 11 }}>
            −
          </text>
        </g>
      </Pop>
      <text className="f12-title" x={cx} y={222} textAnchor="middle">
        {it.name}
      </text>
      <g className="f12-nota">
        <text className="f12-nota-s" x={cx - 8} y={250} textAnchor="end">
          {it.a}
        </text>
        <text className="f12-nota-s" x={cx - 8} y={274} textAnchor="end">
          1
        </text>
        <text className="f12-nota-h" x={cx - 6} y={272}>
          H
        </text>
      </g>
      <text className="f12-num" x={cx} y={300} textAnchor="middle">
        1 p⁺ · {it.n} n⁰<tspan className="f12-sec"> · 1 e⁻</tspan>
      </text>
      <text className="f12-small" x={cx} y={322} textAnchor="middle">
        {it.occ}
      </text>
    </g>
  )
}

export default function HydrogenIsotopes() {
  return (
    <Plate
      level={2}
      w={600}
      h={334}
      max={640}
      label="Izotopy vodíku vedle sebe. Protium má v jádře 1 proton a žádný neutron, v přírodě ho je 99,98 %. Deuterium má 1 proton a 1 neutron, je ho 0,02 %. Tritium má 1 proton a 2 neutrony, vyskytuje se jen ve stopách a je radioaktivní. Všechny mají jeden elektron. Nezakresleno v měřítku."
    >
      {[0, 1, 2].map((i) => (
        <Isotope key={i} i={i} />
      ))}
      <Lbl x={14} y={30} tx={92} ty={CY - 8} delay={1.4} sec>
        proton
      </Lbl>
      <Lbl x={386} y={30} tx={311} ty={CY - 6} anchor="end" delay={1.6} sec>
        neutron
      </Lbl>
      <Lbl x={14} y={196} tx={42} ty={CY + 36} delay={1.8} sec>
        elektron
      </Lbl>
      <text className="f12-small f12-sec" x={586} y={20} textAnchor="end">
        nezakresleno v měřítku
      </text>
    </Plate>
  )
}
