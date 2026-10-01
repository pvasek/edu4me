import { Axes, Draw, Fade, Figure, Lbl, Pop, Qty, Sym, Travel, f1, sine, useCompact } from './kit'

const LABEL =
  'Fotoelektrický jev ve fotonce. Ve vakuové baňce dopadá světlo na kovovou katodu a každý foton předá svou energii h · f jednomu elektronu. Elektron spotřebuje výstupní práci W_v a se zbylou kinetickou energií E_k letí k anodě. Zdroj zapojený obráceně (anoda záporná) elektrony brzdí; mikroampérmetr ukazuje proud a voltmetr napětí. Při brzdném napětí U_b se zastaví i nejrychlejší elektrony a proud klesne na nulu, takže e · U_b = E_k. Graf vpravo: E_k roste s frekvencí světla lineárně, E_k = h · f − W_v; sklon přímky je Planckova konstanta h, přímka protne osu f v mezní frekvenci f₀ a její prodloužení protne osu energie v bodě −W_v. Pod mezní frekvencí nevyletí žádný elektron, ať svítíme jakkoli silně.'

const BX = 150
const BY = 100
const CATH = 76 // cathode x (its face)
const ANODE = 226

function Tube() {
  const ePath = (dy: number) => `M${CATH + 6} ${BY + dy} Q${(CATH + ANODE) / 2} ${BY + dy * 0.4 - 6} ${ANODE - 6} ${BY + dy * 0.2}`
  return (
    <g>
      {/* photons */}
      {[0, 1, 2].map((i) => {
        // parallel photons heading for the cathode
        const deg = 42
        const len = 78
        const a = (deg * Math.PI) / 180
        const ex = CATH - 10
        const ey = BY - 34 + i * 22
        return (
          <g key={i} transform={`translate(${f1(ex - Math.cos(a) * (len + 10))} ${f1(ey - Math.sin(a) * (len + 10))}) rotate(${deg})`}>
            <Draw d={sine(0, 0, len, 3.5, 16)} className="fz4-photon-wave" delay={0.2 + i * 0.12} />
            <path d={`M${len} -5 L${len + 10} 0 L${len} 5Z`} className="fz4-photon-head" />
          </g>
        )
      })}
      <text x={106} y={16} className="fz4-lbl fz4-b">
        světlo, fotony <tspan className="fz4-it">h f</tspan>
      </text>
      {/* glass bulb */}
      <ellipse cx={BX} cy={BY} rx={112} ry={72} className="fz4-o fz4-glass" />
      <path d={`M${BX - 70} ${BY - 50} Q${BX - 40} ${BY - 66} ${BX} ${BY - 66}`} className="fz4-shine fz4-shine-soft" />
      {/* cathode: a curved metal sheet, anode: a rod */}
      <path d={`M${CATH} ${BY - 44} Q${CATH - 20} ${BY} ${CATH} ${BY + 44}`} className="fz4-cathode" />
      <path d={`M${ANODE} ${BY - 30} V${BY + 30}`} className="fz4-anode" />
      <path d={`M${CATH} ${BY + 44} V250 M${ANODE} ${BY + 30} V250`} className="fz4-wire fz4-wire-thin" />
      {/* electrons */}
      {[-24, 0, 22].map((dy) => (
        <path key={dy} d={ePath(dy)} className="fz4-o fz4-thin fz4-dash" opacity={0.6} />
      ))}
      {[-24, 0, 22].map((dy, i) => (
        <Travel key={dy} path={ePath(dy)} dur={1.6 + i * 0.25} phase={i * 0.3} rest={[(CATH + ANODE) / 2, BY + dy * 0.4 - 3]} fade>
          <circle r={5.5} className="fz4-e" />
          <text y={3} textAnchor="middle" className="fz4-e-t">
            −
          </text>
        </Travel>
      ))}
      <Fade delay={0.8}>
        <Lbl x={20} y={186} tx={CATH - 8} ty={BY + 30} className="fz4-b">
          katoda
        </Lbl>
        <Lbl x={290} y={186} tx={ANODE + 2} ty={BY + 22} anchor="end" className="fz4-b">
          anoda
        </Lbl>
        <text x={BX} y={BY + 58} textAnchor="middle" className="fz4-lbl fz4-sm fz4-muted-t">
          vakuum
        </text>
        <Sym x={BX} y={BY - 30} t="e^{−}" tone="blue" />
      </Fade>
      {/* circuit: retarding source, microammeter, voltmeter */}
      <path d={`M${CATH} 250 H124 M136 250 H170 M196 250 H${ANODE}`} className="fz4-wire fz4-wire-thin" />
      <path d="M124 238 V262" className="fz4-cell-long" />
      <path d="M136 244 V256" className="fz4-cell-short" />
      <text x={118} y={240} textAnchor="end" className="fz4-eq fz4-eq-sm">
        +
      </text>
      <text x={142} y={242} className="fz4-eq fz4-eq-sm">
        −
      </text>
      <circle cx={183} cy={250} r={13} className="fz4-o fz4-fill" />
      <text x={183} y={254} textAnchor="middle" className="fz4-meter-t">
        µA
      </text>
      <path d={`M${CATH} 212 H${BX - 13} M${BX + 13} 212 H${ANODE}`} className="fz4-wire fz4-wire-thin" />
      <circle cx={BX} cy={212} r={13} className="fz4-o fz4-fill" />
      <text x={BX} y={217} textAnchor="middle" className="fz4-meter-t">
        V
      </text>
      <text x={130} y={282} textAnchor="middle" className="fz4-lbl fz4-sm">
        brzdné napětí <tspan className="fz4-it fz4-b">U</tspan>
        <tspan fontSize="70%" dy="0.3em" className="fz4-b">
          b
        </tspan>
      </text>
    </g>
  )
}

function Graph() {
  const o: [number, number] = [36, 200]
  const f0 = 110
  const end: [number, number] = [236, 86]
  const k = (o[1] - end[1]) / (end[0] - f0)
  const wv = o[1] + (f0 - o[0]) * k
  return (
    <g>
      <Axes x={o[0]} y={o[1]} w={216} h={190} down={wv - o[1] + 14} xl="f" yl="E_{k}" />
      <Draw d={`M${f0} ${o[1]} L${end[0]} ${end[1]}`} className="fz4-curve fz4-curve-lvl" delay={0.5} />
      <Draw d={`M${f0} ${o[1]} L${o[0]} ${f1(wv)}`} className="fz4-o fz4-dash" delay={0.9} />
      <Pop delay={1.2}>
        <circle cx={f0} cy={o[1]} r={4.5} className="fz4-pt" />
      </Pop>
      <Fade delay={1.2}>
        <Sym x={f0} y={o[1] + 22} t="f_{0}" />
        <Sym x={o[0] - 6} y={wv + 6} t="−W_{v}" anchor="end" />
        <path d={`M${o[0] - 4} ${f1(wv)} H${o[0] + 4}`} className="fz4-o" />
        <text x={158} y={180} className="fz4-lbl fz4-sm fz4-b">
          sklon = <tspan className="fz4-it">h</tspan>
        </text>
        <path d={`M196 ${f1(o[1] - (196 - f0) * k)} H222 V${f1(o[1] - (222 - f0) * k)}`} className="fz4-o fz4-thin" />
        <text x={o[0] + 6} y={o[1] - 8} className="fz4-lbl fz4-sm fz4-muted-t">
          žádné e<tspan fontSize="70%" dy="-0.4em">−</tspan>
        </text>
      </Fade>
      <Pop delay={1.4}>
        <rect x={44} y={0} width={168} height={32} rx={6} className="fz4-tag-lvl" />
        <Qty x={128} y={22} s="E_{k} = h f − W_{v}" anchor="middle" />
      </Pop>
    </g>
  )
}

export default function PhotoelectricEffect() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure level={12} w={n ? 340 : 600} h={n ? 570 : 300} max={n ? 420 : 720} compact={compact} boost={false} label={LABEL}>
      <g transform={n ? 'translate(18 0)' : undefined}>
        <Tube />
      </g>
      <g transform={n ? 'translate(40 300) scale(0.92)' : 'translate(330 20)'}>
        <Graph />
      </g>
    </Figure>
  )
}
