import { Atom, Draw, Fade, Figure, Plate, Pop, useHatch, headAt } from './kit'

const LABEL =
  'Skleníkový efekt. Krátkovlnné sluneční záření prochází atmosférou a ohřívá zemský povrch, část se odrazí zpět do vesmíru. Ohřátý povrch vyzařuje infračervené (tepelné) záření. Část uniká do vesmíru, ale skleníkové plyny v atmosféře – oxid uhličitý CO2, methan CH4 a vodní pára H2O – ho pohlcují a část vyzáří zpět k Zemi, která se tak ohřívá. Bez přirozeného skleníkového efektu by průměrná teplota byla asi −18 °C, s ním je kolem +15 °C.'

const SUN = '#e0a526'
const IR = '#c8452f'

/** Wavy path from p1 to p2. */
function wave(x1: number, y1: number, x2: number, y2: number, amp = 3.2, wl = 20) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const nx = -uy
  const ny = ux
  const n = Math.max(2, Math.round(len / (wl / 2)))
  let d = `M${x1.toFixed(1)} ${y1.toFixed(1)}`
  for (let i = 1; i <= n; i++) {
    const t = (i / n) * len
    const tp = ((i - 0.5) / n) * len
    const s = i % 2 ? 1 : -1
    const cxp = x1 + ux * tp + nx * amp * 2 * s
    const cyp = y1 + uy * tp + ny * amp * 2 * s
    d += ` Q${cxp.toFixed(1)} ${cyp.toFixed(1)} ${(x1 + ux * t).toFixed(1)} ${(y1 + uy * t).toFixed(1)}`
  }
  return d
}

function WaveArrow({ x1, y1, x2, y2, delay, color = IR, flow = false }: { x1: number; y1: number; x2: number; y2: number; delay: number; color?: string; flow?: boolean }) {
  const d = wave(x1, y1, x2, y2)
  return (
    <g>
      <Draw d={d} className="f89-ln" delay={delay} dur={0.9} style={{ stroke: color, strokeWidth: 2.2 }} />
      {flow && (
        <Fade delay={delay + 1}>
          <path d={d} className="f89-flow" fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.2} />
        </Fade>
      )}
      <Fade delay={delay + 0.8} dur={0.2}>
        <polygon points={headAt(x2, y2, x1, y1, 11)} fill={color} />
      </Fade>
    </g>
  )
}

function Beam({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  return (
    <g>
      <Draw d={`M${x1} ${y1} L${x2} ${y2}`} className="f89-ln" delay={delay} dur={0.7} style={{ stroke: SUN, strokeWidth: 3 }} />
      <Fade delay={delay + 0.6} dur={0.2}>
        <polygon points={headAt(x2, y2, x1, y1, 12)} fill={SUN} />
      </Fade>
    </g>
  )
}

function CO2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line className="f89-bond" x1={x - 15} y1={y - 2} x2={x + 15} y2={y - 2} />
      <line className="f89-bond" x1={x - 15} y1={y + 2} x2={x + 15} y2={y + 2} />
      <Atom x={x - 15} y={y} el="O" r={6.5} label={false} />
      <Atom x={x + 15} y={y} el="O" r={6.5} label={false} />
      <Atom x={x} y={y} el="C" r={7} label={false} />
    </g>
  )
}
function CH4({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 90, 180, 270].map((a) => (
        <line key={a} className="f89-bond" x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * 12} y2={y + Math.sin((a * Math.PI) / 180) * 12} />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <Atom key={a} x={x + Math.cos((a * Math.PI) / 180) * 12} y={y + Math.sin((a * Math.PI) / 180) * 12} el="H" r={4} label={false} />
      ))}
      <Atom x={x} y={y} el="C" r={7} label={false} />
    </g>
  )
}
function H2O({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line className="f89-bond" x1={x} y1={y} x2={x - 11} y2={y + 9} />
      <line className="f89-bond" x1={x} y1={y} x2={x + 11} y2={y + 9} />
      <Atom x={x - 11} y={y + 9} el="H" r={4.5} label={false} />
      <Atom x={x + 11} y={y + 9} el="H" r={4.5} label={false} />
      <Atom x={x} y={y} el="O" r={7} label={false} />
    </g>
  )
}

export default function GreenhouseEffect() {
  return (
    <Figure name="greenhouse-effect" level={9} label={LABEL} max={620}>
      <Plate w={480} h={420}>
        <Scene />
      </Plate>
    </Figure>
  )
}

function Scene() {
  const hatch = useHatch()
  const ground = 'M0 340 Q240 300 480 340 V420 H0 Z'
  return (
    <>
      {/* atmosphere layer */}
      <rect x={0} y={112} width={480} height={124} fill="color-mix(in srgb, #5b9bd5 16%, var(--surface))" />
      <rect x={0} y={112} width={480} height={124} fill={hatch('w')} className="f89-hatch" />
      <line className="f89-thin" x1={0} y1={112} x2={480} y2={112} style={{ strokeDasharray: '6 4' }} />
      <text className="f89-lb f89-b" x={472} y={132} textAnchor="end">
        atmosféra
      </text>

      {/* sun */}
      <Pop delay={0.1}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <line key={i} x1={56 + Math.cos(a) * 30} y1={56 + Math.sin(a) * 30} x2={56 + Math.cos(a) * 40} y2={56 + Math.sin(a) * 40} stroke={SUN} strokeWidth={2.2} strokeLinecap="round" />
        })}
        <circle cx={56} cy={56} r={24} fill="#f2c94c" stroke="#b07d12" strokeWidth={1.4} />
      </Pop>

      {/* greenhouse gases */}
      <Pop delay={0.3}>
        <CO2 x={300} y={192} />
        <CH4 x={380} y={200} />
        <H2O x={438} y={190} />
        <CO2 x={196} y={208} />
      </Pop>
      <Fade delay={0.5}>
        <text className="f89-f f89-sm" x={300} y={218} textAnchor="middle">
          CO₂
        </text>
        <text className="f89-f f89-sm" x={352} y={216} textAnchor="middle">
          CH₄
        </text>
        <text className="f89-f f89-sm" x={440} y={222} textAnchor="middle">
          H₂O
        </text>
      </Fade>

      {/* ground */}
      <path d={ground} fill="#9bb56a" opacity={0.8} />
      <path d="M0 340 Q60 328 118 322 Q132 370 108 420 H0 Z" fill="#5b9bd5" opacity={0.55} />
      <path d={ground} fill={hatch('d')} className="f89-hatch" />
      <path d="M0 340 Q240 300 480 340" className="f89-ln" />
      <text className="f89-lb f89-b" x={16} y={404}>
        Země
      </text>

      {/* incoming short-wave light */}
      <Beam x1={78} y1={80} x2={170} y2={316} delay={0.6} />
      <Beam x1={84} y1={74} x2={236} y2={308} delay={0.8} />
      {/* part reflected */}
      <Draw d="M86 88 L118 138 L150 96" className="f89-ln" delay={1.0} dur={0.7} style={{ stroke: SUN, strokeWidth: 2, strokeDasharray: '5 4' }} />
      <Fade delay={1.6}>
        <polygon points={headAt(150, 96, 118, 138, 10)} fill={SUN} />
        <text className="f89-lb f89-sm" x={156} y={96}>
          část se odrazí
        </text>
        <text className="f89-lb f89-b" x={100} y={24} style={{ fill: '#a8761a' }}>
          krátkovlnné záření Slunce
        </text>
      </Fade>

      {/* ground warms */}
      <Fade delay={1.5}>
        <ellipse cx={210} cy={318} rx={60} ry={8} fill={IR} opacity={0.3} />
      </Fade>

      {/* outgoing infrared */}
      <WaveArrow x1={270} y1={312} x2={250} y2={48} delay={1.8} />
      <WaveArrow x1={318} y1={314} x2={304} y2={204} delay={2.1} />
      <WaveArrow x1={400} y1={322} x2={386} y2={216} delay={2.3} />
      {/* re-emitted back to the ground */}
      <WaveArrow x1={316} y1={200} x2={352} y2={318} delay={3.1} flow />
      <WaveArrow x1={440} y1={206} x2={450} y2={326} delay={3.3} flow />

      <Fade delay={2.6}>
        <text className="f89-lb f89-b" x={262} y={62} style={{ fill: IR }}>
          infračervené záření
        </text>
        <text className="f89-lb f89-sm" x={262} y={78}>
          část uniká do vesmíru
        </text>
      </Fade>
      <Fade delay={3.6}>
        <text className="f89-lb f89-sm" x={472} y={150} textAnchor="end">
          plyny záření pohltí
        </text>
        <text className="f89-lb f89-sm" x={472} y={166} textAnchor="end">
          a část vyzáří zpět
        </text>
        {/* thermometer */}
        <g transform="translate(30 300)">
          <rect x={-5} y={-50} width={10} height={56} rx={5} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.2} />
          <rect x={-2.5} y={-30} width={5} height={34} fill={IR} />
          <circle cx={0} cy={10} r={8} fill={IR} stroke="var(--edge)" strokeWidth={1.2} />
          <text className="f89-f f89-b" x={14} y={-30}>
            +15 °C
          </text>
          <text className="f89-lb f89-sm" x={14} y={-14}>
            bez skleníku
          </text>
          <text className="f89-lb f89-sm" x={14} y={2}>
            jen −18 °C
          </text>
        </g>
      </Fade>
    </>
  )
}
