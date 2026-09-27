import type { ReactNode } from 'react'
import { Draw, Fade, Figure, Mol, Plate, Pop, headAt, useHatch } from './kit'

const LABEL =
  'Životní cyklus plastu: z ropy se vyrobí monomer (ethen), polymerací polymer (granulát polyethylenu), z něj výrobek, například lahev. Po použití se plast může recyklovat zpět na surovinu pro nové výrobky, nebo skončí ve spalovně (energie a CO2, z PVC vzniká chlorovodík a dioxiny), na skládce, kde vydrží stovky let, nebo se rozpadne na mikroplasty menší než 5 mm, které končí v oceánu. Dole recyklační kódy 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS a 7 ostatní.'

type N = { x: number; y: number; name: string; sub?: string; icon: ReactNode; delay: number; tone?: string }

function Node({ x, y, name, sub, icon, delay, tone }: N) {
  const hatch = useHatch()
  return (
    <Pop delay={delay}>
      <circle cx={x} cy={y} r={31} fill={tone ?? 'var(--surface)'} stroke="var(--edge)" strokeWidth={1.6} />
      <circle cx={x} cy={y} r={31} fill={hatch('d')} className="f89-hatch" style={{ opacity: 0.4 }} />
      <circle cx={x} cy={y} r={27} fill="none" stroke="var(--edge)" strokeWidth={0.6} />
      <g transform={`translate(${x} ${y})`}>{icon}</g>
      <text className="f89-lb f89-b" x={x} y={y + 50} textAnchor="middle">
        {name}
      </text>
      {sub && (
        <text className="f89-lb f89-sm" x={x} y={y + 66} textAnchor="middle">
          {sub}
        </text>
      )}
    </Pop>
  )
}

/** Arrow from node a to node b, trimmed to the circles; optional bend. */
function Link({ a, b, delay, bend = 0, lv = false, dashed = false }: { a: [number, number]; b: [number, number]; delay: number; bend?: number; lv?: boolean; dashed?: boolean }) {
  const [x1, y1] = a
  const [x2, y2] = b
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const sx = x1 + ux * 36
  const sy = y1 + uy * 36
  const ex = x2 - ux * 36
  const ey = y2 - uy * 36
  const cx = (sx + ex) / 2 - uy * bend
  const cy = (sy + ey) / 2 + ux * bend
  const color = lv ? 'var(--lv)' : 'var(--edge)'
  return (
    <g>
      <Draw d={`M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`} className="f89-ln" delay={delay} dur={0.5} style={{ stroke: color, strokeWidth: lv ? 2.4 : 1.8, strokeDasharray: dashed ? '5 4' : undefined }} />
      <Fade delay={delay + 0.45} dur={0.15}>
        <polygon points={headAt(ex, ey, cx, cy, 10)} fill={color} />
      </Fade>
    </g>
  )
}

const I = {
  barrel: (
    <g>
      <rect x={-12} y={-15} width={24} height={30} rx={3} fill="#3b3b3b" stroke="var(--edge)" strokeWidth={1} />
      <line x1={-12} y1={-6} x2={12} y2={-6} stroke="#9a9a9a" strokeWidth={1.4} />
      <line x1={-12} y1={6} x2={12} y2={6} stroke="#9a9a9a" strokeWidth={1.4} />
      <path d="M16 2 C19 7 20 10 17 12 C14 13 13 9 16 2Z" fill="#3b3b3b" />
    </g>
  ),
  monomer: (
    <g transform="scale(0.8)">
      <Mol atoms={[['C', -11, 0], ['C', 11, 0]]} bonds={[[0, 1, 2]]} hLen={13} rH={4.5} rHeavy={7} />
    </g>
  ),
  polymer: (
    <g>
      {[-16, -8, 0, 8, 16].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? -5 : 5} r={5} fill="#8e6aa8" stroke="var(--edge)" strokeWidth={0.9} />
      ))}
      <path d="M-16 5 L-8 -5 L0 5 L8 -5 L16 5" fill="none" stroke="var(--edge)" strokeWidth={1.2} />
    </g>
  ),
  bottle: (
    <g>
      <path d="M-4 -20 H4 V-15 C4 -12 10 -10 10 -3 V17 Q10 20 7 20 H-7 Q-10 20 -10 17 V-3 C-10 -10 -4 -12 -4 -15Z" fill="color-mix(in srgb, #5b9bd5 30%, var(--surface))" stroke="var(--edge)" strokeWidth={1.2} />
      <rect x={-5} y={-23} width={10} height={4} rx={1} fill="#4f7f5a" stroke="var(--edge)" strokeWidth={0.8} />
      <rect x={-10} y={0} width={20} height={8} fill="#c46a86" opacity={0.8} />
    </g>
  ),
  bag: (
    <g>
      <path d="M-13 -8 H13 L11 18 H-11Z" fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.2} />
      <path d="M-6 -8 C-6 -20 6 -20 6 -8" fill="none" stroke="var(--edge)" strokeWidth={1.4} />
      <path d="M-4 2 h8" stroke="var(--edge)" strokeWidth={1} />
    </g>
  ),
  recycle: (
    <g stroke="#3f7a4c" strokeWidth={3} fill="none" strokeLinecap="round">
      <path d="M-4 -14 L-14 4" />
      <path d="M-10 12 H10" />
      <path d="M14 4 L4 -14" />
      <polygon points="-17,-1 -13,8 -9,1" fill="#3f7a4c" stroke="none" />
      <polygon points="8,8 15,12 8,16" fill="#3f7a4c" stroke="none" />
      <polygon points="1,-18 7,-11 -1,-10" fill="#3f7a4c" stroke="none" />
    </g>
  ),
  fire: (
    <g>
      <path d="M0 18 C12 12 12 0 3 -8 C4 0 -2 2 -2 -6 C-2 -12 0 -16 -1 -20 C-12 -10 -14 6 0 18Z" fill="#f08c2b" stroke="#c4561a" strokeWidth={1.1} />
      <path d="M0 18 C6 14 6 6 1 1 C1 6 -4 8 -4 12 C-4 15 -2 17 0 18Z" fill="#ffd166" />
    </g>
  ),
  landfill: (
    <g>
      <path d="M-20 14 Q-6 -16 20 14Z" fill="#b39a6a" stroke="var(--edge)" strokeWidth={1.2} />
      <rect x={-8} y={0} width={6} height={9} fill="#5b9bd5" transform="rotate(-20 -5 4)" stroke="var(--edge)" strokeWidth={0.7} />
      <rect x={4} y={3} width={8} height={5} fill="#c46a86" stroke="var(--edge)" strokeWidth={0.7} />
      <line x1={-22} y1={14} x2={22} y2={14} stroke="var(--edge)" strokeWidth={1.2} />
    </g>
  ),
  ocean: (
    <g>
      <path d="M-22 -4 q5.5 -5 11 0 t11 0 t11 0 t11 0" fill="none" stroke="#3d6fd1" strokeWidth={1.6} />
      <path d="M-22 4 q5.5 -5 11 0 t11 0 t11 0 t11 0" fill="none" stroke="#3d6fd1" strokeWidth={1.2} opacity={0.7} />
      {[
        [-12, 10],
        [-3, 13],
        [6, 9],
        [13, 14],
        [-8, 17],
        [2, 18],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={2.6} height={2.6} fill={['#c46a86', '#e0b43a', '#4f9a5a'][i % 3]} />
      ))}
      <path d="M-4 -16 q6 -5 12 0 q-6 5 -12 0Z M8 -16 l5 -4 v8z" fill="var(--edge)" opacity={0.7} />
    </g>
  ),
}

const CODES = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'O']

function Code({ x, y, n, abbr, delay }: { x: number; y: number; n: number; abbr: string; delay: number }) {
  const r = 17
  const pts = [0, 1, 2].map((k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3
    return [x + Math.cos(a) * r, y + 3 + Math.sin(a) * r] as const
  })
  return (
    <Pop delay={delay}>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#3f7a4c" strokeWidth={2} strokeLinejoin="round" strokeDasharray="14 5" />
      <text className="f89-f f89-b" x={x} y={y + 8} textAnchor="middle" style={{ fontSize: 12 }}>
        {n}
      </text>
      <text className="f89-f f89-sm" x={x} y={y + 36} textAnchor="middle">
        {abbr}
      </text>
    </Pop>
  )
}

export default function PlasticLifecycle() {
  const P: Record<string, [number, number]> = {
    ropa: [50, 64],
    mono: [168, 64],
    poly: [300, 64],
    prod: [420, 170],
    use: [300, 270],
    rec: [180, 170],
    burn: [96, 408],
    land: [240, 408],
    sea: [384, 408],
  }
  return (
    <Figure name="plastic-lifecycle" level={9} label={LABEL} max={620}>
      <Plate w={480} h={580}>
        <Node x={P.ropa[0]} y={P.ropa[1]} name="ropa" icon={I.barrel} delay={0.1} />
        <Node x={P.mono[0]} y={P.mono[1]} name="monomer" sub="ethen" icon={I.monomer} delay={0.35} />
        <Node x={P.poly[0]} y={P.poly[1]} name="polymer" sub="granulát PE" icon={I.polymer} delay={0.6} tone="var(--lv-soft)" />
        <Node x={P.prod[0]} y={P.prod[1]} name="výrobek" sub="lahev, fólie" icon={I.bottle} delay={0.85} />
        <Node x={P.use[0]} y={P.use[1]} name="použití" icon={I.bag} delay={1.1} />
        <Node x={P.rec[0]} y={P.rec[1]} name="recyklace" sub="žlutý kontejner" icon={I.recycle} delay={1.35} tone="var(--good-soft)" />
        <Link a={P.ropa} b={P.mono} delay={0.3} />
        <Link a={P.mono} b={P.poly} delay={0.55} />
        <Link a={P.poly} b={P.prod} delay={0.8} bend={-10} />
        <Link a={P.prod} b={P.use} delay={1.05} bend={-10} />
        <Link a={P.use} b={P.rec} delay={1.3} bend={-10} lv />
        <Link a={P.rec} b={P.poly} delay={1.55} bend={-10} lv />
        <Fade delay={1.9}>
          <text className="f89-lb f89-lv f89-b" x={300} y={176} textAnchor="middle">
            koloběh
          </text>
        </Fade>

        {/* end of life */}
        <Node x={P.burn[0]} y={P.burn[1]} name="spalovna" sub="energie + CO₂" icon={I.fire} delay={2.0} />
        <Node x={P.land[0]} y={P.land[1]} name="skládka" sub="vydrží stovky let" icon={I.landfill} delay={2.2} />
        <Node x={P.sea[0]} y={P.sea[1]} name="mikroplasty" sub="pod 5 mm, v oceánu" icon={I.ocean} delay={2.4} />
        <Link a={[P.use[0], P.use[1] + 34]} b={P.burn} delay={2.0} dashed />
        <Link a={[P.use[0], P.use[1] + 34]} b={P.land} delay={2.2} dashed />
        <Link a={[P.use[0], P.use[1] + 34]} b={P.sea} delay={2.4} dashed />

        {/* recycling codes */}
        <line className="f89-thin" x1={10} y1={492} x2={470} y2={492} style={{ opacity: 0.4 }} />
        <Fade delay={2.7}>
          <text className="f89-lb f89-sm" x={240} y={510} textAnchor="middle">
            recyklační kódy na obalech
          </text>
        </Fade>
        {CODES.map((c, i) => (
          <Code key={c} x={42 + i * 66} y={536} n={i + 1} abbr={c} delay={2.8 + i * 0.08} />
        ))}
      </Plate>
    </Figure>
  )
}
