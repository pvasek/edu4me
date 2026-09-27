import { Atom, Bubbles, ChemText, Eq, Fade, Figure, Lbl, Pop, Sign, Travel, pat, useFig } from './kit'

const ANODES = [140, 250, 360]
const CRUST = 186
const MELT = 198
const AL = 300
const FLOOR = 346

function Cell() {
  const { id } = useFig()
  return (
    <g>
      {/* steel shell + carbon lining (cathode) */}
      <rect x={30} y={170} width={440} height={220} rx={4} fill="#9aa0aa" />
      <rect x={30} y={170} width={440} height={220} rx={4} fill={pat(id, 'x')} />
      <rect x={30} y={170} width={440} height={220} rx={4} className="f67-o f67-thick" />
      <rect x={44} y={176} width={412} height={200} fill="#3b3b3b" />
      <rect x={44} y={176} width={412} height={200} fill={pat(id, 'hi')} opacity={0.35} />
      {/* molten electrolyte and aluminium */}
      <rect x={60} y={MELT} width={380} height={AL - MELT} fill="#e8a94a" fillOpacity={0.55} />
      <rect x={60} y={MELT} width={380} height={AL - MELT} fill={pat(id, 'h')} />
      <rect x={60} y={AL} width={380} height={FLOOR - AL} fill="#c9ccd3" />
      <rect x={60} y={AL} width={380} height={FLOOR - AL} fill={pat(id, 'x')} />
      <path d={`M60 ${AL} H440`} className="f67-o" />
      {/* frozen crust of Al2O3 on top */}
      <path d={`M60 ${MELT} V${CRUST + 4} q10 -8 20 -2 t20 0 t20 -2 t20 1 V${MELT}Z`} fill="#e8e4d8" className="f67-o f67-thin" />
      <path d={`M440 ${MELT} V${CRUST + 4} q-10 -8 -20 -2 t-20 0 t-20 -2 t-20 1 V${MELT}Z`} fill="#e8e4d8" className="f67-o f67-thin" />
      <path d={`M60 ${MELT} H440`} className="f67-o f67-thin" />
      {/* collector bars of the cathode */}
      <rect x={6} y={352} width={40} height={12} fill="#9aa0aa" className="f67-o" />
      <rect x={454} y={352} width={40} height={12} fill="#9aa0aa" className="f67-o" />
    </g>
  )
}

function Anodes() {
  const { id } = useFig()
  return (
    <g>
      <rect x={84} y={62} width={328} height={12} rx={2} fill="#c7773d" className="f67-o" />
      {ANODES.map((x) => (
        <g key={x}>
          <rect x={x - 4} y={74} width={8} height={52} fill="#9aa0aa" className="f67-o" />
          <rect x={x - 40} y={124} width={80} height={128} rx={3} fill="#3b3b3b" />
          <rect x={x - 40} y={124} width={80} height={128} rx={3} fill={pat(id, 'hi')} opacity={0.4} />
          <rect x={x - 40} y={124} width={80} height={128} rx={3} className="f67-o" />
          {/* burnt-away corners */}
          <path d={`M${x - 40} 240 q4 10 12 12 M${x + 40} 240 q-4 10 -12 12`} className="f67-o f67-thin" style={{ stroke: '#e8a94a' }} />
        </g>
      ))}
    </g>
  )
}

export default function AluminiumElectrolysis() {
  return (
    <Figure
      level={7}
      w={500}
      h={528}
      max={640}
      label="Hallův–Héroultův elektrolyzér hliníku v řezu. Oxid hlinitý je rozpuštěný v roztaveném kryolitu Na3AlF6 při asi 950 °C. Shora do taveniny zasahují uhlíkové anody (+), dno a stěny tvoří uhlíková vyzdívka, která je katodou (−). Ionty Al3+ putují ke katodě a redukují se: Al3+ + 3e− → Al; roztavený hliník se hromadí na dně. Ionty O2− se na anodě oxidují na kyslík, který spaluje uhlík anod na CO2, proto anody ubývají."
    >
      <Pop>
        <Cell />
      </Pop>
      <Pop delay={0.2}>
        <Anodes />
      </Pop>
      {ANODES.map((x, i) => (
        <g key={x}>
          <Bubbles x={x + 46} y={250} rise={52} n={4} spread={6} r={3.4} className="f67-sec" />
          <Bubbles x={x - 46} y={250} rise={52} n={3} spread={6} r={3} />
          {[0, 1].map((k) => (
            <g key={k}>
              <Travel path={`M${x - 22 + k * 30} 262 L${x - 18 + k * 30} 294`} dur={2.4} phase={(i + k) / 4} rest={[x - 20 + k * 30, 276]} fade>
                <Atom x={0} y={0} r={8} el="Al" text="Al^{3+}" size={6.5} />
              </Travel>
              <Travel path={`M${x - 6 + k * 24} 294 L${x - 8 + k * 24} 260`} dur={2.4} phase={(i + k + 0.5) / 4} rest={[x - 6 + k * 24, 282]} fade>
                <Atom x={0} y={0} r={8} el="O" text="O^{2-}" size={6.5} />
              </Travel>
            </g>
          ))}
        </g>
      ))}

      {/* circuit */}
      <rect x={414} y={16} width={70} height={36} rx={4} className="f67-o f67-fill2" />
      <path d="M440 24 V44 M456 28 V40" className="f67-ln f67-thick" />
      <path d="M414 34 H404 V62" className="f67-wire" />
      <path d="M484 34 H494 V352" className="f67-wire" />
      <Fade delay={1}>
        <path d="M494 352 V34 H484" className="f67-current" />
        <path d="M414 34 H404 V62" className="f67-current" />
      </Fade>
      <Sign x={400} y={16} s="+" r={9} />
      <Sign x={494} y={384} s="−" r={9} />

      <Fade delay={0.8}>
        <Lbl x={12} y={100} tx={100} ty={140} className="f67-b">
          anody (+)
        </Lbl>
        <text x={12} y={118} className="f67-lbl f67-sm">
          uhlík, ubývají
        </text>
        <rect x={12} y={132} width={70} height={22} rx={4} className="f67-tag-lvl" />
        <text x={47} y={148} textAnchor="middle" className="f67-num f67-num-b">
          950 °C
        </text>
        <text x={250} y={330} textAnchor="middle" className="f67-lbl f67-b f67-dark-t">
          roztavený hliník
        </text>
        <Lbl x={20} y={416} tx={70} ty={250} className="f67-sm">
          <ChemText text="Al_{2}O_{3} v kryolitu Na_{3}AlF_{6}" />
        </Lbl>
        <Lbl x={480} y={416} tx={446} ty={366} anchor="end" className="f67-sm">
          uhlíková vyzdívka = katoda (−)
        </Lbl>
        <Lbl x={466} y={132} tx={430} ty={190} anchor="end" className="f67-sm" sec>
          kůra
        </Lbl>
        <Lbl x={196} y={44} tx={186} ty={206} anchor="end" className="f67-sm" sec>
          <ChemText text="CO_{2} unikají" />
        </Lbl>
      </Fade>

      <Pop delay={1.4}>
        <rect x={14} y={432} width={472} height={88} rx={6} className="f67-tag-lvl" />
        <text x={130} y={452} textAnchor="middle" className="f67-cap f67-lvl-t">
          katoda (−) · redukce
        </text>
        <Eq x={130} y={474} t="Al^{3+} + 3e^{-} → Al" anchor="middle" className="f67-eq-lg" />
        <text x={370} y={452} textAnchor="middle" className="f67-cap f67-lvl-t">
          anoda (+) · oxidace
        </text>
        <Eq x={370} y={474} t="2O^{2-} → O_{2} + 4e^{-}" anchor="middle" className="f67-eq-lg" />
        <Eq x={250} y={504} t="C + O_{2} → CO_{2}  (anody se spalují)" anchor="middle" />
      </Pop>
    </Figure>
  )
}
