import type { CSSProperties } from 'react'
import { Arrow, ChemText, Draw, Fade, Figure, Plate, Pop, useHatch, useNarrow } from './kit'

const LABEL =
  'Fotosyntéza a buněčné dýchání jako koloběh. V chloroplastu listu vzniká ze 6 CO2 a 6 H2O za pomoci energie světla a chlorofylu glukóza C6H12O6 a 6 O2. V mitochondrii se glukóza s kyslíkem „spaluje“ zpět na 6 CO2 a 6 H2O a uvolněná energie se ukládá do ATP. Produkty jednoho děje jsou výchozími látkami druhého.'

export default function PhotosynthesisRespiration() {
  return (
    <Figure name="photosynthesis-respiration" level={9} label={LABEL} max={680}>
      <Scene />
    </Figure>
  )
}

function Chloroplast({ x, y }: { x: number; y: number }) {
  const hatch = useHatch()
  const grana = [
    [-58, -8],
    [-22, 14],
    [14, -12],
    [50, 10],
    [-30, -26],
    [30, 26],
  ]
  return (
    <g>
      <ellipse cx={x} cy={y} rx={100} ry={56} fill="#cfe2b8" stroke="var(--edge)" strokeWidth={1.6} />
      <ellipse cx={x} cy={y} rx={100} ry={56} fill={hatch('d')} className="f89-hatch" />
      <ellipse cx={x} cy={y} rx={93} ry={49} fill="#e3eed4" stroke="var(--edge)" strokeWidth={0.9} />
      {/* lamellae */}
      <path className="f89-thin" d={`M${x - 72} ${y + 4} C${x - 40} ${y - 10} ${x - 20} ${y + 24} ${x + 10} ${y} S${x + 50} ${y + 14} ${x + 74} ${y - 2}`} style={{ stroke: '#4f7f3a' }} />
      {grana.map(([dx, dy], i) => (
        <g key={i}>
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x + dx - 11} y={y + dy - 9 + k * 4.6} width={22} height={4.2} rx={2} fill="#6f9a4f" stroke="#2f5a26" strokeWidth={0.7} />
          ))}
        </g>
      ))}
    </g>
  )
}

function Mitochondrion({ x, y }: { x: number; y: number }) {
  const hatch = useHatch()
  const folds = [-64, -36, -8, 20, 48]
  return (
    <g>
      <ellipse cx={x} cy={y} rx={100} ry={52} fill="#f0c9a8" stroke="var(--edge)" strokeWidth={1.6} />
      <ellipse cx={x} cy={y} rx={100} ry={52} fill={hatch('d')} className="f89-hatch" />
      <ellipse cx={x} cy={y} rx={91} ry={43} fill="#f7e0cb" stroke="#a4552c" strokeWidth={1.2} />
      {/* cristae: folds of the inner membrane */}
      {folds.map((dx, i) => {
        const top = i % 2 === 0
        const yy = top ? y - 40 : y + 40
        const tip = top ? y + 14 : y - 14
        return <path key={dx} d={`M${x + dx} ${yy} V${tip} Q${x + dx + 7} ${tip + (top ? 10 : -10)} ${x + dx + 14} ${tip} V${yy}`} fill="#f0c9a8" stroke="#a4552c" strokeWidth={1.2} />
      })}
    </g>
  )
}

function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <line key={i} x1={x + Math.cos(a) * 20} y1={y + Math.sin(a) * 20} x2={x + Math.cos(a) * (i % 2 ? 27 : 31)} y2={y + Math.sin(a) * (i % 2 ? 27 : 31)} stroke="#d9a21b" strokeWidth={2} strokeLinecap="round" />
      })}
      <circle cx={x} cy={y} r={15} fill="#f2c94c" stroke="#b07d12" strokeWidth={1.3} />
    </g>
  )
}

/** Molecule tokens travelling along a path (ambient loop). */
function Tokens({ d, color, n = 3, dur = 6 }: { d: string; color: string; n?: number; dur?: number }) {
  return (
    <g aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          r={4.2}
          fill={color}
          stroke="var(--edge)"
          strokeWidth={0.8}
          className="f89-along"
          style={{ offsetPath: `path('${d}')`, '--dur': `${dur}s`, '--del': `${(-dur * i) / n}s` } as CSSProperties}
        />
      ))}
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const L = n
    ? {
        w: 340,
        h: 610,
        chl: { x: 170, y: 150 },
        mit: { x: 170, y: 440 },
        sun: { x: 40, y: 40 },
        go: 'M262 176 C330 230 330 350 262 414',
        back: 'M78 414 C10 350 10 230 78 176',
        goL: { x: 250, y: 280, a: 'end' as const },
        backL: { x: 58, y: 318, a: 'start' as const },
        eqChl: { x: 170, y: 230 },
        eqMit: { x: 170, y: 515 },
        atp: [170, 548, 170, 574],
      }
    : {
        w: 660,
        h: 360,
        chl: { x: 150, y: 170 },
        mit: { x: 500, y: 170 },
        sun: { x: 42, y: 40 },
        go: 'M232 128 C300 50 350 50 418 128',
        back: 'M418 212 C350 290 300 290 232 212',
        goL: { x: 325, y: 60, a: 'middle' as const },
        backL: { x: 325, y: 296, a: 'middle' as const },
        eqChl: { x: 150, y: 250 },
        eqMit: { x: 500, y: 246 },
        atp: [602, 170, 648, 170],
      }
  const [ax1, ay1, ax2, ay2] = L.atp
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.1}>
        <Sun {...L.sun} />
      </Pop>
      <Draw d={`M${L.sun.x + 24} ${L.sun.y + 22} l10 4 l-4 8 l12 5 l-4 8 l14 6`} className="f89-ln" style={{ stroke: '#d9a21b', strokeWidth: 2.2 }} delay={0.3} dur={0.6} />
      <Fade delay={0.35}>
        <text className="f89-lb f89-sm" x={L.sun.x + 38} y={L.sun.y - 6}>
          světlo
        </text>
      </Fade>
      <Pop delay={0.2}>
        <Chloroplast {...L.chl} />
      </Pop>
      <Pop delay={0.4}>
        <Mitochondrion {...L.mit} />
      </Pop>
      <Fade delay={0.6}>
        <text className="f89-lb f89-b" x={L.chl.x + (n ? 0 : 30)} y={L.chl.y - 64} textAnchor="middle">
          chloroplast · fotosyntéza
        </text>
        <text className="f89-lb f89-b" x={L.mit.x} y={L.mit.y - 60} textAnchor="middle">
          mitochondrie · dýchání
        </text>
      </Fade>

      <Draw d={L.go} className="f89-lvstroke" delay={0.8} dur={0.7} style={{ strokeWidth: 2.6 }} />
      <Draw d={L.back} className="f89-ln" delay={1.1} dur={0.7} style={{ strokeWidth: 2.6, stroke: 'var(--blue)' }} />
      <Fade delay={1.6}>
        <ArrowHead d={L.go} cls="f89-lvfill" />
        <ArrowHead d={L.back} fill="var(--blue)" />
        <text className="f89-f f89-lv f89-b" x={L.goL.x} y={L.goL.y} textAnchor={L.goL.a}>
          <ChemText text="C_{6}H_{12}O_{6} + 6 O_{2}" />
        </text>
        <text className="f89-f f89-b" x={L.backL.x} y={L.backL.y} textAnchor={L.backL.a} style={{ fill: 'var(--blue)' }}>
          <ChemText text="6 CO_{2} + 6 H_{2}O" />
        </text>
      </Fade>
      <Fade delay={1.8}>
        <Tokens d={L.go} color="#f1d67a" />
        <Tokens d={L.back} color="#9fc0e6" />
      </Fade>

      {/* equations */}
      <Fade delay={1.5}>
        <text className="f89-f f89-sm" x={L.eqChl.x} y={L.eqChl.y} textAnchor="middle">
          <ChemText text="6CO_{2} + 6H_{2}O → C_{6}H_{12}O_{6} + 6O_{2}" />
        </text>
        <text className="f89-lb f89-sm" x={L.eqChl.x} y={L.eqChl.y + 17} textAnchor="middle">
          endotermní · světlo, chlorofyl
        </text>
        <text className="f89-f f89-sm" x={L.eqMit.x} y={L.eqMit.y} textAnchor="middle">
          <ChemText text="C_{6}H_{12}O_{6} + 6O_{2} → 6CO_{2} + 6H_{2}O" />
        </text>
        <text className="f89-lb f89-sm" x={L.eqMit.x} y={L.eqMit.y + 17} textAnchor="middle">
          exotermní · energie do ATP
        </text>
      </Fade>
      <Fade delay={1.7}>
        <Arrow x1={ax1} y1={ay1} x2={ax2} y2={ay2} className="f89-arr" />
        <path d={`M${ax2 + (n ? -6 : 2)} ${ay2 + (n ? 6 : -14)} l-6 12 h7 l-4 11 l11 -15 h-7 l4 -8z`} fill="#f2c94c" stroke="#b07d12" strokeWidth={1} />
        <text className="f89-lb f89-b" x={n ? ax2 + 14 : ax2 - 6} y={n ? ay2 + 24 : ay2 + 36} textAnchor={n ? 'start' : 'middle'}>
          ATP
        </text>
      </Fade>
    </Plate>
  )
}

/** Arrowhead at the end of a cubic path given as "M.. C c1 c2 end". */
function ArrowHead({ d, cls, fill }: { d: string; cls?: string; fill?: string }) {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const [c2x, c2y, ex, ey] = nums.slice(-4)
  const a = Math.atan2(ey - c2y, ex - c2x)
  const s = 11
  const bx = ex - Math.cos(a) * s
  const by = ey - Math.sin(a) * s
  const w = s * 0.5
  return <polygon className={cls} fill={fill} points={`${ex},${ey} ${bx + Math.sin(a) * w},${by - Math.cos(a) * w} ${bx - Math.sin(a) * w},${by + Math.cos(a) * w}`} />
}
