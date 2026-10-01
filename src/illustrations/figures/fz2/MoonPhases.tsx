import { Arrow, DrawArrow, Fade, Figure, Num, Pop, useCompact } from './kit'

const LIT = '#f1ead2'
const DARK = '#3b3f4a'
const NAMES: [string, string][] = [
  ['nov', ''],
  ['dorůstající', 'srpek'],
  ['první', 'čtvrť'],
  ['dorůstající', 'měsíc'],
  ['úplněk', ''],
  ['couvající', 'měsíc'],
  ['poslední', 'čtvrť'],
  ['couvající', 'srpek'],
]

/** Moon as seen from Earth (northern hemisphere) at elongation e (degrees, 0 = new moon). */
function Phase({ x, y, r, e }: { x: number; y: number; r: number; e: number }) {
  const rx = Math.abs(Math.cos((e * Math.PI) / 180)) * r
  const top = `${x} ${y - r}`
  const bot = `${x} ${y + r}`
  let lit = ''
  if (e > 0 && e < 180) lit = `M${top} A${r} ${r} 0 0 1 ${bot} A${rx} ${r} 0 0 ${e < 90 ? 0 : 1} ${top}Z`
  else if (e > 180 && e < 360) lit = `M${top} A${r} ${r} 0 0 0 ${bot} A${rx} ${r} 0 0 ${e > 270 ? 1 : 0} ${top}Z`
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={e === 180 ? LIT : DARK} />
      {lit && <path d={lit} fill={LIT} />}
      <circle cx={x} cy={y} r={r} className="fz2-o" fill="none" />
    </g>
  )
}

function Orbit() {
  const c: [number, number] = [150, 150]
  const R = 104
  return (
    <g>
      {/* sunlight from the right */}
      {[36, 84, 124, 176, 216, 264].map((y, i) => (
        <DrawArrow key={y} d={`M322 ${y} H292`} tone="acc" delay={0.1 + i * 0.05} />
      ))}
      <Fade delay={0.3}>
        <text x={314} y={20} textAnchor="end" className="fz2-lbl fz2-b fz2-acc-t">
          světlo ze Slunce
        </text>
      </Fade>
      <circle cx={c[0]} cy={c[1]} r={R} className="fz2-orbit" />
      <Arrow d={`M${c[0] + R * Math.cos(-0.25)} ${c[1] + R * Math.sin(-0.25)} A${R} ${R} 0 0 0 ${c[0] + R * Math.cos(-0.55)} ${c[1] + R * Math.sin(-0.55)}`} tone="muted" />
      {/* Earth, lit on the sunny side */}
      <Pop delay={0.1}>
        <circle cx={c[0]} cy={c[1]} r={24} className="fz2-earth" />
        <path d={`M${c[0]} ${c[1] - 24} A24 24 0 0 0 ${c[0]} ${c[1] + 24}Z`} fill="rgba(8,10,18,0.5)" />
        <circle cx={c[0]} cy={c[1]} r={24} className="fz2-o" fill="none" />
        <text x={c[0]} y={c[1] + 44} textAnchor="middle" className="fz2-lbl fz2-b">
          Země
        </text>
      </Pop>
      {NAMES.map((_, i) => {
        const a = (-i * 45 * Math.PI) / 180
        const x = c[0] + R * Math.cos(a)
        const y = c[1] + R * Math.sin(a)
        const bx = c[0] + (R + 25) * Math.cos(a)
        const by = c[1] + (R + 25) * Math.sin(a)
        return (
          <Pop key={i} delay={0.2 + i * 0.07}>
            <circle cx={x} cy={y} r={11} fill={DARK} />
            <path d={`M${x} ${y - 11} A11 11 0 0 1 ${x} ${y + 11}Z`} fill={LIT} />
            <circle cx={x} cy={y} r={11} className="fz2-o" fill="none" />
            <Num x={bx} y={by} n={i + 1} r={9} />
          </Pop>
        )
      })}
    </g>
  )
}

export default function MoonPhases() {
  const compact = useCompact()
  const n = compact.narrow
  const cw = n ? 88 : 76
  const gx = n ? 4 : 346
  const gy = n ? 306 : 40
  return (
    <Figure
      level={5}
      w={n ? 360 : 660}
      h={n ? 550 : 300}
      max={700}
      compact={compact}
      boost={false}
      label="Měsíční fáze. Měsíc obíhá Zemi a Slunce vždy osvětluje jeho polovinu přivrácenou ke Slunci. Podle toho, kolik z osvětlené poloviny vidíme ze Země, se mění fáze: nov, dorůstající srpek, první čtvrť, dorůstající měsíc, úplněk, couvající měsíc, poslední čtvrť a couvající srpek. Jeden cyklus trvá asi 29,5 dne. Z naší severní polokoule platí: tvar písmene D znamená, že Měsíc dorůstá, tvar C, že couvá."
    >
      <g transform={n ? 'translate(20 0)' : undefined}>
        <Orbit />
      </g>
      <Fade delay={0.8}>
        {NAMES.map(([a, b], i) => {
          const x = gx + (i % 4) * cw
          const y = gy + Math.floor(i / 4) * 112
          return (
            <g key={i}>
              <Num x={x + 10} y={y + 4} n={i + 1} r={8.5} />
              <Phase x={x + cw / 2} y={y + 32} r={22} e={i * 45} />
              <text x={x + cw / 2} y={y + 76} textAnchor="middle" className="fz2-lbl fz2-sm fz2-b fz2-keep2">
                {a}
              </text>
              <text x={x + cw / 2} y={y + 92} textAnchor="middle" className="fz2-lbl fz2-sm fz2-keep2">
                {b}
              </text>
            </g>
          )
        })}
        <text x={n ? 180 : 498} y={n ? 542 : 288} textAnchor="middle" className="fz2-lbl fz2-sm fz2-lvl-t">
          tvar D – dorůstá, tvar C – couvá
        </text>
      </Fade>
    </Figure>
  )
}
