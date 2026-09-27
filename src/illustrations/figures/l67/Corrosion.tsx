import { Atom, ChemText, Draw, DrawArrow, Eq, Fade, Figure, Lbl, Liquid, Pop, Travel, pat, useFig } from './kit'

const STEEL = '#9aa0aa'
const RUST = '#9a4a1e'
const DROP = 'M92 190 C104 96 356 96 368 190Z'

function O2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Atom x={x - 5} y={y} r={6} el="O" text="" />
      <Atom x={x + 5} y={y} r={6} el="O" text="" />
    </g>
  )
}

function Metal({ d, fill = STEEL }: { d: string; fill?: string }) {
  const { id } = useFig()
  return (
    <g>
      <path d={d} fill={fill} />
      <path d={d} fill={pat(id, 'x')} />
      <path d={d} className="f67-o" />
    </g>
  )
}

function Rust({ x, w }: { x: number; w: number }) {
  const { id } = useFig()
  const d = `M${x} 190 Q${x + w * 0.2} ${181} ${x + w / 2} 180 Q${x + w * 0.8} 181 ${x + w} 190Z`
  return (
    <g>
      <path d={d} fill={RUST} />
      <path d={d} fill={pat(id, 'dd')} />
      <path d={d} className="f67-o f67-thin" />
    </g>
  )
}

function WaterDrop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y - 9 * s} Q${x + 6 * s} ${y - 1 * s} ${x + 5 * s} ${y + 2 * s} A${5 * s} ${5 * s} 0 0 1 ${x - 5 * s} ${y + 2 * s} Q${x - 6 * s} ${y - 1 * s} ${x} ${y - 9 * s}Z`} fill="#6f9fd8" fillOpacity={0.6} className="f67-o f67-thin" />
}

function Vignette({ x, title, lines, delay, children }: { x: number; title: string; lines: string[]; delay: number; children: React.ReactNode }) {
  return (
    <Pop delay={delay}>
      <rect x={x} y={330} width={136} height={156} rx={6} className="f67-o f67-thin f67-fill" />
      <text x={x + 68} y={352} textAnchor="middle" className="f67-lbl f67-b">
        {title}
      </text>
      {children}
      {lines.map((l, i) => (
        <text key={i} x={x + 68} y={452 + i * 17} textAnchor="middle" className="f67-lbl f67-sm">
          <ChemText text={l} />
        </text>
      ))}
    </Pop>
  )
}

export default function Corrosion() {
  return (
    <Figure
      level={6}
      w={460}
      h={500}
      max={620}
      label="Koroze železa pod kapkou vody. Uprostřed kapky, kam se dostane málo kyslíku, je anoda: železo se rozpouští, Fe → Fe2+ + 2e−. Elektrony putují kovem k okraji kapky, kde je hodně kyslíku a probíhá katodový děj O2 + 2H2O + 4e− → 4OH−. Kde se ionty Fe2+ a OH− potkají, usazuje se prstenec rzi Fe2O3·xH2O. Ochrana: nátěr odděluje železo od vody a kyslíku, pozinkování a obětovaná anoda z hořčíku nebo zinku korodují místo železa."
    >
      {/* droplet on steel */}
      <Metal d="M20 190 H204 Q230 214 256 190 H440 V244 H20Z" />
      <Fade delay={0.2}>
        <Liquid d={DROP} color="#6f9fd8" opacity={0.28} />
      </Fade>
      <Draw d={DROP.replace('Z', '')} className="f67-o" delay={0.2} />
      <Pop delay={1.1}>
        <Rust x={132} w={46} />
        <Rust x={282} w={46} />
      </Pop>

      {/* oxygen diffusing in at the rim */}
      <Fade delay={0.6}>
        <O2 x={70} y={120} />
        <O2 x={392} y={120} />
        <O2 x={230} y={40} />
        <DrawArrow d="M78 134 Q92 156 104 168" tone="red" delay={0.9} />
        <DrawArrow d="M384 134 Q370 156 356 168" tone="red" delay={0.9} />
        <path d="M230 56 V92" className="f67-arr f67-arr-muted f67-dash" />
        <text x={242} y={82} className="f67-lbl f67-sm f67-sec">
          sem proniká málo <ChemText text="O_{2}" />
        </text>
      </Fade>

      {/* ions moving and meeting */}
      {[0, 1].map((k) => (
        <g key={k}>
          <Travel path={k ? 'M244 194 Q270 176 302 176' : 'M216 194 Q190 176 158 176'} dur={2.8} phase={k * 0.5} rest={[k ? 272 : 188, 182]} fade>
            <Atom x={0} y={0} r={8} el="Fe" text="Fe^{2+}" size={6.5} />
          </Travel>
          <Travel path={k ? 'M352 184 L318 176' : 'M108 184 L142 176'} dur={2.8} phase={0.3 + k * 0.5} rest={[k ? 336 : 124, 178]} fade>
            <Atom x={0} y={0} r={8} el="O" text="OH^{-}" size={6} />
          </Travel>
        </g>
      ))}

      {/* electrons through the metal */}
      <DrawArrow d="M214 224 H104" tone="blue" delay={1.2} className="f67-wide" />
      <DrawArrow d="M246 224 H356" tone="blue" delay={1.2} className="f67-wide" />
      <Fade delay={1.5}>
        <text x={160} y={238} textAnchor="middle" className="f67-lbl f67-b" style={{ fill: '#2f5fb3' }}>
          e⁻
        </text>
        <text x={300} y={238} textAnchor="middle" className="f67-lbl f67-b" style={{ fill: '#2f5fb3' }}>
          e⁻
        </text>
      </Fade>

      {/* labels */}
      <Fade delay={0.9}>
        <Lbl x={230} y={140} tx={230} ty={203} anchor="middle" className="f67-b">
          anoda
        </Lbl>
        <Lbl x={20} y={170} tx={100} ty={186} className="f67-sm">
          katoda
        </Lbl>
        <Lbl x={440} y={170} tx={360} ty={186} anchor="end" className="f67-sm">
          katoda
        </Lbl>
        <Lbl x={440} y={36} tx={318} ty={181} anchor="end" className="f67-sm">
          prstenec rzi
        </Lbl>
        <Lbl x={20} y={36} tx={120} ty={150} className="f67-sm" sec>
          kapka vody
        </Lbl>
        <text x={430} y={236} textAnchor="end" className="f67-lbl f67-sm f67-light-t f67-sec">
          železo
        </text>
      </Fade>
      <Fade delay={1.6}>
        <Eq x={20} y={272} t="anoda: Fe → Fe^{2+} + 2e^{-}" />
        <Eq x={20} y={294} t="katoda: O_{2} + 2H_{2}O + 4e^{-} → 4OH^{-}" />
        <Eq x={20} y={316} t="Fe^{2+} + OH^{-} + O_{2} → rez Fe_{2}O_{3}·xH_{2}O" className="f67-eq-sm f67-sec" />
      </Fade>

      {/* protection vignettes */}
      <Vignette x={10} title="nátěr" lines={['odděluje železo', 'od vody a O_{2}']} delay={1.8}>
        <Metal d="M22 404 H134 V428 H22Z" />
        <rect x={22} y={396} width={112} height={8} className="f67-lvl-f f67-o f67-thin" />
        <WaterDrop x={50} y={372} />
        <O2 x={104} y={368} />
        <path d="M58 380 L66 390 L74 380 M96 378 L104 390 L112 378" className="f67-arr f67-arr-muted" />
        <Lbl x={128} y={442} tx={120} ty={400} anchor="end" className="f67-sm f67-lvl-t" sec>
          barva
        </Lbl>
      </Vignette>
      <Vignette x={162} title="pozinkování" lines={['zinek se obětuje,', 'i v rýze']} delay={2.0}>
        <Metal d="M174 404 H286 V428 H174Z" />
        <rect x={174} y={396} width={46} height={8} fill="#8a93a3" className="f67-o f67-thin" />
        <rect x={240} y={396} width={46} height={8} fill="#8a93a3" className="f67-o f67-thin" />
        <WaterDrop x={230} y={390} s={0.9} />
        <path d="M210 386 Q220 372 228 380" className="f67-arr f67-arr-blue" />
        <text x={230} y={372} textAnchor="middle" className="f67-eq f67-eq-sm">
          <ChemText text="Zn → Zn^{2+}" />
        </text>
        <Lbl x={176} y={442} tx={196} ty={400} className="f67-sm" sec>
          Zn
        </Lbl>
      </Vignette>
      <Vignette x={314} title="obětovaná anoda" lines={['Mg nebo Zn koroduje', 'místo oceli']} delay={2.2}>
        <Liquid d="M326 386 H438 V436 H326Z" color="#6f9fd8" opacity={0.25} />
        <Metal d="M334 370 H430 Q428 404 382 408 Q340 404 334 370Z" />
        <rect x={372} y={408} width={20} height={14} fill="#5c9a6b" className="f67-o" />
        <path d="M376 422 l3 -3 l3 3 M384 422 l3 -3" className="f67-o f67-thin" />
        <DrawArrow d="M382 406 Q360 398 356 386" tone="blue" delay={2.6} />
        <text x={344} y={396} textAnchor="end" className="f67-lbl f67-b f67-sm" style={{ fill: '#2f5fb3' }}>
          e⁻
        </text>
        <Lbl x={430} y={432} tx={392} ty={416} anchor="end" className="f67-sm f67-b" sec>
          Mg
        </Lbl>
      </Vignette>
    </Figure>
  )
}
