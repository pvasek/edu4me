import { ChemText, Draw, DrawArrow, Fade, Figure, Lbl, pat, useFig } from './kit'

// plot frame
const X0 = 56
const X1 = 452
const YB = 292
const EMAX = 8
const EA = 3.8
const EA_CAT = 2.4
const sx = (e: number) => X0 + (e / EMAX) * (X1 - X0)
const sy = (f: number) => YB - f * 520

/** Maxwell–Boltzmann energy distribution (normalised), kT in arbitrary units. */
const mb = (e: number, kt: number) => 2 * Math.sqrt(e / Math.PI) * Math.pow(1 / kt, 1.5) * Math.exp(-e / kt)

function curve(kt: number, from = 0, to = EMAX) {
  const pts: string[] = []
  const n = 90
  for (let i = 0; i <= n; i++) {
    const e = from + ((to - from) * i) / n
    pts.push(`${sx(e).toFixed(1)} ${sy(mb(e, kt)).toFixed(1)}`)
  }
  return pts
}
const line = (kt: number) => 'M' + curve(kt).join(' L')
const area = (kt: number) => `M${sx(EA)} ${YB} L` + curve(kt, EA).join(' L') + ` L${sx(EMAX)} ${YB}Z`

const T1 = 1
const T2 = 1.7

function Areas() {
  const { id } = useFig()
  return (
    <g>
      <path d={area(T2)} fill="var(--accent)" fillOpacity={0.18} />
      <path d={area(T2)} fill={pat(id, 'b')} />
      <path d={area(T1)} fill="var(--blue)" fillOpacity={0.35} />
      <path d={area(T1)} fill={pat(id, 'dd')} />
    </g>
  )
}

export default function MaxwellBoltzmann() {
  const pk1 = [sx(T1 / 2), sy(mb(T1 / 2, T1))]
  const pk2 = [sx(T2 / 2), sy(mb(T2 / 2, T2))]
  return (
    <Figure
      level={6}
      w={480}
      h={372}
      max={620}
      label="Maxwellovo–Boltzmannovo rozdělení energií částic plynu při dvou teplotách. Při nižší teplotě T1 je křivka vyšší a užší, při vyšší teplotě T2 je nižší, širší a posunutá k vyšším energiím. Svislá čára označuje aktivační energii Ea. Plocha pod křivkou vpravo od Ea odpovídá částicím, které mají dost energie na účinnou srážku; při vyšší teplotě je jich mnohem víc. Katalyzátor snižuje Ea."
    >
      <Fade delay={0.8}>
        <Areas />
      </Fade>
      {/* axes */}
      <DrawArrow d={`M${X0} ${YB} H${X1 + 14}`} />
      <DrawArrow d={`M${X0} ${YB} V22`} />
      <Fade delay={0.3}>
        <text x={X1 + 10} y={YB + 24} textAnchor="end" className="f67-lbl">
          kinetická energie částic
        </text>
        <text x={X0 - 12} y={30} textAnchor="end" className="f67-lbl" transform={`rotate(-90 ${X0 - 12} 30)`}>
          počet částic
        </text>
      </Fade>

      {/* curves */}
      <Draw d={line(T1)} className="f67-curve f67-curve-1" delay={0.3} />
      <Draw d={line(T2)} className="f67-curve f67-curve-2" delay={0.6} />
      <Fade delay={1.2}>
        <text x={pk1[0] + 10} y={pk1[1] - 6} className="f67-lbl f67-b f67-big f67-blue-t">
          <ChemText text="T_{1}" />
        </text>
        <text x={pk2[0] - 8} y={pk2[1] - 12} className="f67-lbl f67-b f67-big f67-acc-t f67-halo">
          <ChemText text="T_{2} > T_{1}" />
        </text>
      </Fade>

      {/* activation energy */}
      <Draw d={`M${sx(EA)} ${YB} V40`} className="f67-o f67-thick" delay={1.1} />
      <Fade delay={1.4}>
        <text x={sx(EA) + 8} y={54} className="f67-lbl f67-b f67-big">
          <ChemText text="E_{a}" />
        </text>
        <path d={`M${sx(EA_CAT)} ${YB} V96`} className="f67-o f67-dash f67-sec" style={{ stroke: 'var(--good)' }} />
        <text x={sx(EA_CAT) - 6} y={92} textAnchor="middle" className="f67-lbl f67-sm f67-green-t f67-sec">
          <ChemText text="E_{a} s katalyzátorem" />
        </text>
        <Lbl x={sx(5.9)} y={150} tx={sx(4.6)} ty={YB - 14} lx={sx(5.4)} ly={194} anchor="middle" className="f67-b">
          účinné srážky
        </Lbl>
        <text x={sx(5.9)} y={168} textAnchor="middle" className="f67-lbl f67-sm">
          <ChemText text="částice s E ≥ E_{a}" />
        </text>
        <text x={sx(5.9)} y={186} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          <ChemText text="při T_{2} jich je mnohem víc" />
        </text>
      </Fade>

      {/* legend */}
      <Fade delay={1.6}>
        <g transform={`translate(${X0 + 6} ${YB + 44})`}>
          <path d="M0 0 H26" className="f67-curve f67-curve-1" />
          <text x={34} y={5} className="f67-lbl f67-sm">
            nižší teplota
          </text>
          <path d="M170 0 H196" className="f67-curve f67-curve-2" />
          <text x={204} y={5} className="f67-lbl f67-sm">
            vyšší teplota
          </text>
        </g>
      </Fade>
    </Figure>
  )
}
