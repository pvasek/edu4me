import { Atom, ChemText, DrawArrow, Draw, Eq, Fade, Figure, Lbl, Liquid, Pop, Sign, Travel, pat, useCompact, useFig } from './kit'

const KX = 175 // cathode (spoon) centre
const AX = 345 // anode (copper plate) centre
const TOP = 112
const SURF = 168 // liquid surface
const CU = '#c7773d'

/** Cu²⁺ ions leave the anode and drift to the spoon; sulfate ions stay put. */
function Ions() {
  const rests: [number, number][] = [
    [298, 188],
    [232, 206],
    [276, 230],
    [226, 254],
    [300, 266],
  ]
  const sulfate: [number, number][] = [
    [262, 184],
    [322, 238],
    [204, 226],
  ]
  return (
    <g>
      {rests.map(([x, y], i) => (
        <Travel key={`c${i}`} path={`M${AX - 22} ${y} L${KX + 30} ${y + (i % 2 ? 10 : -8)}`} dur={4.2} phase={i / rests.length} rest={[x, y]} fade>
          <Atom x={0} y={0} r={11} el="Cu" text="Cu^{2+}" size={7.5} />
        </Travel>
      ))}
      {sulfate.map(([x, y], i) => (
        <g key={`s${i}`} className="f67-drift" style={{ animationDelay: `${-i * 0.9}s` }}>
          <Atom x={x} y={y} r={12} el="S" text="SO_{4}^{2-}" size={6.5} />
        </g>
      ))}
    </g>
  )
}

function Spoon() {
  const { id } = useFig()
  const bowl = `M${KX} 236 C${KX + 20} 236 ${KX + 19} 300 ${KX} 302 C${KX - 19} 300 ${KX - 20} 236 ${KX} 236Z`
  return (
    <g>
      <defs>
        <clipPath id={`${id}-wet`}>
          <rect x={KX - 40} y={SURF} width={80} height={200} />
        </clipPath>
      </defs>
      <Pop delay={0.3}>
        <path d={`M${KX - 3.5} ${TOP} H${KX + 3.5} L${KX + 4.5} 238 H${KX - 4.5}Z`} fill="#b9bec7" className="f67-o" />
        <path d={bowl} fill="#b9bec7" className="f67-o" />
        <path d={bowl} fill={pat(id, 'hi')} opacity={0.5} />
      </Pop>
      {/* the copper coat grows on the wet part */}
      <Fade delay={2.2}>
        <g clipPath={`url(#${id}-wet)`}>
          <path d={`M${KX - 3.5} ${TOP} H${KX + 3.5} L${KX + 4.5} 238 H${KX - 4.5}Z`} className="f67-coat" />
          <path d={bowl} className="f67-coat" />
          <path d={bowl} fill={CU} fillOpacity={0.55} />
        </g>
      </Fade>
    </g>
  )
}

function Anode() {
  const { id } = useFig()
  // straight above the liquid, eaten away (jagged) below it
  const d = `M${AX - 10} ${TOP} H${AX + 10} V${SURF + 6} L${AX + 8} 196 L${AX + 9.5} 214 L${AX + 6.5} 238 L${AX + 8.5} 262 L${AX + 5.5} 286 L${AX + 6} 300 H${AX - 6} L${AX - 7.5} 280 L${AX - 5.5} 256 L${AX - 8.5} 232 L${AX - 6} 208 L${AX - 9} 186 L${AX - 10} ${SURF + 6}Z`
  return (
    <Pop delay={0.35}>
      <path d={d} fill={CU} className="f67-o" />
      <path d={d} fill={pat(id, 'x')} opacity={0.5} />
      <path d={`M${AX - 5} ${TOP + 6} V${SURF - 4}`} className="f67-o f67-thin" style={{ stroke: '#f2c8a0' }} />
    </Pop>
  )
}

export default function Electroplating() {
  const compact = useCompact()
  const n = compact.narrow
  const { h, bx } = n ? { h: 494, bx: [[96, 374, 328], [96, 434, 328]] } : { h: 430, bx: [[14, 370, 240], [266, 370, 240]] }
  const wireL = `M222 40 H${KX} V${TOP}`
  const wireR = `M${AX} ${TOP} V40 H298`
  return (
    <Figure
      level={6}
      w={n ? 340 : 520}
      x0={n ? 90 : 0}
      h={h}
      max={640}
      compact={compact}
      boost={false}
      label="Galvanické pokovování mědí. Zdroj stejnosměrného napětí je spojen s měděnou deskou jako anodou (+) a se lžičkou jako katodou (−); obě jsou ponořené do roztoku síranu měďnatého. Na anodě se měď rozpouští: Cu → Cu2+ + 2e−. Kationty Cu2+ putují roztokem ke katodě a tam se redukují: Cu2+ + 2e− → Cu, takže lžičku pokryje vrstvička mědi. Elektrony tečou vodičem od anody přes zdroj ke katodě."
    >
      {/* vessel + CuSO₄ solution */}
      <Liquid d={`M111 ${SURF} H409 V326 Q409 329 406 329 H114 Q111 329 111 326Z`} color="#3b8fe0" opacity={0.36} />
      <Draw d="M104 142 L108 146 V326 Q108 332 114 332 H406 Q412 332 412 326 V146 L416 142" className="f67-o f67-thick" />
      <path d="M116 150 V320" className="f67-o f67-thin" style={{ opacity: 0.5 }} />

      <Spoon />
      <Anode />
      <Ions />

      {/* drift of the copper ions */}
      <DrawArrow d={`M${AX - 30} 308 H${KX + 34}`} tone="lvl" delay={1.6} />
      <Fade delay={1.8}>
        <text x={262} y={300} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-lvl-t">
          <ChemText text="Cu^{2+} ke katodě" />
        </text>
      </Fade>

      {/* circuit with flowing electrons: anode → source → cathode */}
      <path d={wireL} className="f67-wire" />
      <path d={wireR} className="f67-wire" />
      {[0, 0.5].map((ph) => (
        <g key={ph}>
          <Travel path={wireR} dur={3} phase={ph} rest={[AX, 70 - ph * 40]}>
            <circle r={5.5} className="f67-e" />
            <text y={3} textAnchor="middle" className="f67-e-t">
              −
            </text>
          </Travel>
          <Travel path={wireL} dur={3} phase={ph} rest={[KX, 70 - ph * 40]}>
            <circle r={5.5} className="f67-e" />
            <text y={3} textAnchor="middle" className="f67-e-t">
              −
            </text>
          </Travel>
        </g>
      ))}
      <rect x={222} y={20} width={76} height={40} rx={4} className="f67-o f67-fill" />
      <path d="M252 32 V48 M268 25 V55" className="f67-ln f67-thick" />
      <path d="M222 40 H252 M268 40 H298" className="f67-ln" />
      <Sign x={KX + 24} y={TOP - 16} s="−" r={10} />
      <Sign x={AX - 24} y={TOP - 16} s="+" r={10} />
      <Fade delay={1}>
        <text x={KX - 10} y={70} textAnchor="end" className="f67-lbl f67-b f67-blue-t">
          e⁻ ↓
        </text>
        <text x={AX + 10} y={70} className="f67-lbl f67-b f67-blue-t">
          e⁻ ↑
        </text>
      </Fade>
      <Lbl x={306} y={14} tx={290} ty={24} sec>
        zdroj stejnosměrného napětí
      </Lbl>

      {/* labels */}
      <Fade delay={0.9}>
        {n ? (
          <>
            <text x={KX - 10} y={100} textAnchor="end" className="f67-lbl f67-b">
              katoda
            </text>
            <text x={AX + 10} y={100} className="f67-lbl f67-b">
              anoda
            </text>
            <text x={260} y={354} textAnchor="middle" className="f67-lbl f67-sm">
              <ChemText text="roztok CuSO_{4}" />
            </text>
          </>
        ) : (
          <>
            <Lbl x={14} y={112} tx={KX - 5} ty={132} className="f67-b">
              katoda (−)
            </Lbl>
            <Lbl x={14} y={200} tx={KX - 4} ty={206} className="f67-sm">
              lžička
            </Lbl>
            <Lbl x={14} y={276} tx={KX - 18} ty={272} className="f67-sm">
              vrstvička mědi
            </Lbl>
            <Lbl x={506} y={112} tx={AX + 10} ty={132} anchor="end" className="f67-b">
              anoda (+)
            </Lbl>
            <Lbl x={506} y={200} tx={AX + 10} ty={150} anchor="end" className="f67-sm">
              měděná deska
            </Lbl>
            <Lbl x={506} y={256} tx={AX + 7} ty={250} anchor="end" className="f67-sm" sec>
              rozpouští se
            </Lbl>
            <Lbl x={506} y={322} tx={400} ty={312} anchor="end" className="f67-sm">
              <ChemText text="roztok CuSO_{4}" />
            </Lbl>
          </>
        )}
      </Fade>

      {/* half-reactions */}
      <Pop delay={1.4}>
        <rect x={bx[0][0]} y={bx[0][1]} width={bx[0][2]} height={54} rx={6} className="f67-tag-lvl" />
        <text x={bx[0][0] + bx[0][2] / 2} y={bx[0][1] + 19} textAnchor="middle" className="f67-cap f67-lvl-t">
          katoda (−) · měď se vylučuje
        </text>
        <Eq x={bx[0][0] + bx[0][2] / 2} y={bx[0][1] + 42} t="Cu^{2+} + 2e^{-} → Cu" anchor="middle" className="f67-eq-lg" />
      </Pop>
      <Pop delay={1.6}>
        <rect x={bx[1][0]} y={bx[1][1]} width={bx[1][2]} height={54} rx={6} className="f67-tag" />
        <text x={bx[1][0] + bx[1][2] / 2} y={bx[1][1] + 19} textAnchor="middle" className="f67-cap">
          anoda (+) · měď se rozpouští
        </text>
        <Eq x={bx[1][0] + bx[1][2] / 2} y={bx[1][1] + 42} t="Cu → Cu^{2+} + 2e^{-}" anchor="middle" className="f67-eq-lg" />
      </Pop>
    </Figure>
  )
}
