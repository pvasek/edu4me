import type { ReactNode } from 'react'
import { Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const LABEL =
  'Cesta elektrické energie z elektrárny do domácností. Generátor v elektrárně vyrábí napětí asi 20 kV. Zvyšovací transformátor ho zvýší na 400 kV a energie putuje dálkovým vedením velmi vysokého napětí na stožárech. V rozvodně snižovací transformátory napětí sníží na 110 kV a 22 kV, trafostanice v obci pak na 400 V a 230 V pro domácnosti. Vysoké napětí znamená při stejném výkonu malý proud, a tedy malé ztráty teplem ve vedení.'

type Kind = 'plant' | 'up' | 'pylon' | 'sub' | 'down' | 'house'
const STATIONS: { kind: Kind; name: string; note: string }[] = [
  { kind: 'plant', name: 'elektrárna', note: 'generátor ≈ 20 kV' },
  { kind: 'up', name: 'zvyšovací', note: 'transformátor' },
  { kind: 'pylon', name: 'dálkové vedení', note: 'velmi vysoké napětí' },
  { kind: 'sub', name: 'rozvodna', note: '400 → 110 → 22 kV' },
  { kind: 'down', name: 'trafostanice', note: '22 kV → 400 V' },
  { kind: 'house', name: 'domácnosti', note: 'zásuvka 230 V' },
]
const LINKS = ['20 kV', '400 kV', '400 kV', '22 kV', '230 V']

function Trafo({ up }: { up: boolean }) {
  return (
    <g>
      <circle cx={-8} cy={0} r={14} className="fz3-o fz3-fill" />
      <circle cx={8} cy={0} r={14} className="fz3-o" />
      <path d={up ? 'M0 26 V14 M-5 19 L0 13 L5 19' : 'M0 13 V25 M-5 20 L0 26 L5 20'} className="fz3-arr fz3-arr-lvl" />
    </g>
  )
}

function Icon({ kind }: { kind: Kind }) {
  const { id } = useFig()
  switch (kind) {
    case 'plant':
      return (
        <g>
          <path d="M8 28 C12 10 12 -6 6 -22 H28 C22 -6 22 10 26 28Z" className="fz3-o fz3-fill2" />
          <path d="M8 28 C12 10 12 -6 6 -22 H28 C22 -6 22 10 26 28Z" fill={pat(id, 'v')} />
          <path d="M10 -26 q4 -8 10 -4 q6 -8 12 0" className="fz3-o fz3-thin fz3-steam" />
          <rect x={-30} y={2} width={38} height={26} className="fz3-o fz3-fill" />
          <rect x={-30} y={2} width={38} height={26} fill={pat(id, 'brick')} />
          <circle cx={-11} cy={15} r={8} className="fz3-o fz3-fill" />
          <path d="M-16 15 q2.5 -5 5 0 t5 0" className="fz3-o fz3-thin" />
        </g>
      )
    case 'up':
    case 'down':
      return <Trafo up={kind === 'up'} />
    case 'pylon':
      return (
        <g className="fz3-pylon">
          <path
            d="M-14 30 L-3 -30 H3 L14 30 M-24 -20 H24 M-18 -6 H18 M-10 8 L8 -6 M10 8 L-8 -6 M-12 20 L9 8 M12 20 L-9 8 M-5 -20 L4 -6 M5 -20 L-4 -6"
            className="fz3-o"
          />
          {[-22, 22].map((x) => (
            <path key={x} d={`M${x} -20 v5`} className="fz3-o" />
          ))}
        </g>
      )
    case 'sub':
      return (
        <g>
          <rect x={-30} y={-18} width={60} height={46} rx={2} className="fz3-o fz3-fill" />
          <rect x={-30} y={-18} width={60} height={46} rx={2} fill={pat(id, 'x')} opacity={0.5} />
          <g transform="translate(0 4) scale(0.85)">
            <Trafo up={false} />
          </g>
        </g>
      )
    case 'house':
      return (
        <g>
          {[
            [-15, 0],
            [14, 6],
          ].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M-14 22 V-2 L0 -16 L14 -2 V22Z" className="fz3-o fz3-fill" />
              <path d="M-17 1 L0 -18 L17 1" className="fz3-o fz3-lvl-s" />
              <rect x={-4} y={8} width={8} height={14} className="fz3-o fz3-fill3" />
              <rect x={-9} y={-3} width={7} height={6} className="fz3-o fz3-win" />
            </g>
          ))}
        </g>
      )
  }
}

function Station({ x, y, i, children }: { x: number; y: number; i: number; children?: ReactNode }) {
  return (
    <g>
      <Pop delay={0.1 + i * 0.14}>
        <g transform={`translate(${x} ${y})`}>
          <Icon kind={STATIONS[i].kind} />
        </g>
      </Pop>
      {children}
    </g>
  )
}

export default function PowerGrid() {
  const compact = useCompact()
  const n = compact.narrow
  if (n) {
    // vertical chain for phones
    const X = 52
    const ys = STATIONS.map((_, i) => 40 + i * 86)
    const wire = `M${X} ${ys[0]} V${ys[ys.length - 1]}`
    return (
      <Figure level={7} w={340} h={574} max={420} compact={compact} boost={false} label={LABEL}>
        <path d={wire} className="fz3-wire fz3-wire-thin" />
        <path d={wire} className="fz3-current" />
        {STATIONS.map((s, i) => (
          <Station key={i} x={X} y={ys[i]} i={i}>
            <Fade delay={0.3 + i * 0.14}>
              <text x={104} y={ys[i] - 2} className="fz3-lbl fz3-b fz3-big">
                {s.name}
              </text>
              <text x={104} y={ys[i] + 20} className="fz3-lbl">
                {s.note}
              </text>
            </Fade>
          </Station>
        ))}
        {LINKS.map((t, i) => (
          <Fade key={i} delay={0.5 + i * 0.14}>
            <text x={X + 12} y={(ys[i] + ys[i + 1]) / 2 + 6} className="fz3-eq fz3-b-eq fz3-lvl-t fz3-halo">
              {t}
            </text>
          </Fade>
        ))}
        <rect x={8} y={520} width={324} height={48} rx={6} className="fz3-tag-lvl" />
        <text x={170} y={540} textAnchor="middle" className="fz3-lbl fz3-b">
          vysoké napětí → malý proud
        </text>
        <text x={170} y={559} textAnchor="middle" className="fz3-lbl">
          → malé ztráty ve vedení
        </text>
      </Figure>
    )
  }
  const xs = [48, 158, 300, 440, 552, 656]
  const Y = 96
  const sag = `Q199 ${Y - 8} 240 ${Y - 20} Q270 ${Y - 8} 300 ${Y - 20} Q330 ${Y - 8} 360 ${Y - 20} Q400 ${Y - 8} ${xs[3] - 30} ${Y - 20}`
  const wire = `M${xs[0]} ${Y - 20} H${xs[1] + 30} ${sag} H${xs[5]}`
  return (
    <Figure level={7} w={704} h={236} max={720} compact={compact} boost={false} label={LABEL}>
      <path d={wire} className="fz3-wire fz3-wire-thin" />
      <path d={wire} className="fz3-current" />
      {/* the long line hangs between two more pylons */}
      <Pop delay={0.4}>
        {[240, 360].map((x) => (
          <g key={x} transform={`translate(${x} ${Y})`}>
            <Icon kind="pylon" />
          </g>
        ))}
      </Pop>

      {STATIONS.map((s, i) => (
        <Station key={i} x={xs[i]} y={Y} i={i}>
          <Fade delay={0.3 + i * 0.14}>
            <text x={xs[i]} y={Y + 56} textAnchor="middle" className="fz3-lbl fz3-b">
              {s.name}
            </text>
            <text x={xs[i]} y={Y + 76} textAnchor="middle" className="fz3-lbl fz3-sm">
              {s.note}
            </text>
          </Fade>
        </Station>
      ))}
      {LINKS.map((t, i) => (
        <Fade key={i} delay={0.5 + i * 0.14}>
          <text x={i === 1 ? 199 : i === 2 ? 400 : (xs[i] + xs[i + 1]) / 2} y={Y - 34} textAnchor="middle" className="fz3-eq fz3-b-eq fz3-lvl-t">
            {t}
          </text>
        </Fade>
      ))}
      <rect x={130} y={190} width={444} height={36} rx={6} className="fz3-tag-lvl" />
      <text x={352} y={214} textAnchor="middle" className="fz3-lbl fz3-b">
        vysoké napětí → malý proud → malé ztráty ve vedení
      </text>
    </Figure>
  )
}
