import { ChemText, DrawArrow, Fade, Figure, Liquid, Pop, Travel, pat, useFig } from './kit'
import { Banner, Factory, Rabbit, Soil, Sun, Tree } from './scenery'

const G = 262
const SEA = 400 // shoreline x

function Underground() {
  const { id } = useFig()
  return (
    <g>
      {/* fossil fuel seam */}
      <path d="M150 404 Q260 392 360 404 V432 Q260 444 150 432Z" fill="#2b2320" fillOpacity={0.85} />
      <path d="M150 404 Q260 392 360 404 V432 Q260 444 150 432Z" fill={pat(id, 'hi')} opacity={0.25} />
      <path d="M150 404 Q260 392 360 404 V432 Q260 444 150 432Z" className="f67-o" />
      {/* limestone under the sea */}
      <rect x={SEA} y={412} width={520 - SEA} height={52} fill="#d9d3c3" />
      <rect x={SEA} y={412} width={520 - SEA} height={52} fill={pat(id, 'brick')} />
      <path d={`M${SEA} 412 H520`} className="f67-o" />
    </g>
  )
}

function Sea() {
  return (
    <g>
      <Liquid d={`M${SEA} ${G + 6} H520 V412 H${SEA}Z`} color="#3b8fe0" opacity={0.3} />
      <path d={`M${SEA} ${G + 6} q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} className="f67-o" />
      {[
        [430, 390],
        [470, 396],
        [498, 386],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x - 7} ${y} Q${x} ${y - 10} ${x + 7} ${y}Z`} fill="#efe6cf" className="f67-o f67-thin" />
      ))}
    </g>
  )
}

function Car({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 8} V${y - 20} Q${x + 2} ${y - 24} ${x + 10} ${y - 24} L${x + 18} ${y - 34} H${x + 40} L${x + 50} ${y - 24} Q${x + 60} ${y - 24} ${x + 62} ${y - 18} V${y - 8}Z`} className="f67-o f67-fill2" />
      <circle cx={x + 14} cy={y - 7} r={6} className="f67-o f67-fill3" />
      <circle cx={x + 48} cy={y - 7} r={6} className="f67-o f67-fill3" />
      <path d={`M${x - 4} ${y - 14} q-8 -2 -12 -10`} className="f67-o f67-thin f67-drift" style={{ opacity: 0.6 }} />
    </g>
  )
}

const P = {
  photo: 'M92 62 Q84 100 104 132',
  resp: 'M160 132 Q176 100 172 62',
  animal: 'M238 212 Q250 140 236 62',
  decay: 'M196 300 Q226 200 212 62',
  burn: 'M318 156 Q336 110 320 62',
  mine: 'M300 398 V264',
  ocean1: 'M434 62 Q424 160 432 260',
  ocean2: 'M470 258 Q480 160 468 62',
  shells: 'M456 380 V412',
}

export default function CarbonCycle() {
  return (
    <Figure
      level={7}
      w={520}
      h={470}
      max={680}
      label="Koloběh uhlíku. Rostliny fotosyntézou berou CO2 ze vzduchu (6CO2 + 6H2O → C6H12O6 + 6O2), rostliny i živočichové dýcháním CO2 vracejí. Rozkladači uvolňují CO2 z odumřelých těl. Oceán CO2 rozpouští a zase uvolňuje; ze schránek mořských živočichů vzniká vápenec, který uhlík uchová miliony let. Spalováním fosilních paliv (uhlí, ropa, zemní plyn) z továren a aut se do vzduchu vrací uhlík, který byl dlouho uložen pod zemí."
    >
      <Soil x={0} y={G} w={SEA} h={210} />
      <Sea />
      <Underground />
      <Pop>
        <Banner x={272} y={34} w={200}>
          <ChemText text="CO_{2} ve vzduchu" />
        </Banner>
      </Pop>
      <Pop delay={0.1}>
        <Sun x={40} y={44} />
      </Pop>
      <Pop delay={0.2}>
        <Tree x={130} y={G} />
      </Pop>
      <Pop delay={0.3}>
        <Rabbit x={240} y={G} />
      </Pop>
      <Pop delay={0.4}>
        <Factory x={268} y={G} />
        <Car x={336} y={G + 2} />
      </Pop>
      <path d="M190 270 q8 -8 16 0 q8 -6 14 2" className="f67-o" style={{ stroke: '#8a5a33' }} />

      {Object.entries(P).map(([k, d], i) => (
        <DrawArrow
          key={k}
          d={d}
          tone={k === 'photo' || k === 'ocean2' ? 'green' : k === 'burn' ? 'red' : k === 'mine' || k === 'shells' ? 'muted' : 'ink'}
          delay={0.7 + i * 0.12}
          className={k === 'burn' ? 'f67-wide' : ''}
        />
      ))}
      <Travel path={P.burn} dur={2.6} rest={[330, 110]}>
        <circle r={3.5} className="f67-gas" />
      </Travel>
      <Travel path={P.photo} dur={3} rest={[88, 96]}>
        <circle r={3.5} fill="#5f8f4e" className="f67-o f67-thin" />
      </Travel>

      <Fade delay={1.6}>
        <text x={80} y={96} textAnchor="end" className="f67-lbl f67-sm f67-b f67-green-t f67-halo">
          fotosyntéza
        </text>
        <text x={176} y={96} className="f67-lbl f67-sm f67-halo">
          dýchání
        </text>
        <text x={250} y={170} className="f67-lbl f67-sm f67-sec f67-halo">
          dýchání
        </text>
        <text x={186} y={326} className="f67-lbl f67-sm f67-halo">
          rozklad
        </text>
        <text x={338} y={96} className="f67-lbl f67-sm f67-b f67-red-t f67-halo">
          spalování
        </text>
        <text x={308} y={336} className="f67-lbl f67-sm f67-sec f67-halo">
          těžba
        </text>
        <text x={255} y={460} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-halo">
          uhlí, ropa, zemní plyn
        </text>
        <text x={456} y={300} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-halo">
          oceán
        </text>
        <text x={456} y={316} textAnchor="middle" className="f67-lbl f67-sm f67-sec f67-halo">
          <ChemText text="rozpouští CO_{2}" />
        </text>
        <text x={456} y={442} textAnchor="middle" className="f67-lbl f67-sm f67-b f67-halo">
          vápenec
        </text>
      </Fade>
    </Figure>
  )
}
