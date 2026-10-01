import { useId } from 'react'
import { Draw, Fade, Figure, Pop, pat, rng, useCompact, useFig } from './kit'

const LABEL =
  'Sluneční soustava, vzdálenosti ani velikosti nejsou v měřítku. Kolem Slunce obíhají po drahách v pořadí od Slunce: Merkur, Venuše, Země a Mars (kamenné planety), pak pás planetek, dále plynní obři Jupiter a Saturn s prstenci a ledoví obři Uran a Neptun. Za Neptunem obíhá trpasličí planeta Pluto v Kuiperově pásu.'

interface Body {
  name: string
  r: number
  col: string
  ring?: boolean
  bands?: boolean
}
const BODIES: Body[] = [
  { name: 'Merkur', r: 4.5, col: '#9a8f86' },
  { name: 'Venuše', r: 8, col: '#e0c48a' },
  { name: 'Země', r: 8.5, col: '#3d7fd1' },
  { name: 'Mars', r: 6, col: '#c8553d' },
  { name: 'Jupiter', r: 22, col: '#d6a878', bands: true },
  { name: 'Saturn', r: 18, col: '#e2c68c', ring: true, bands: true },
  { name: 'Uran', r: 12, col: '#8fd0d8' },
  { name: 'Neptun', r: 12, col: '#4a6fd8' },
  { name: 'Pluto', r: 3.5, col: '#b3a58f' },
]
const BELT = 4 // index in the sequence where the asteroid belt sits (before Jupiter)

function Planet({ x, y, b }: { x: number; y: number; b: Body }) {
  const { id } = useFig()
  return (
    <g>
      {b.ring && <ellipse cx={x} cy={y} rx={b.r * 1.9} ry={b.r * 0.55} className="fz3-o fz3-saturn-ring" transform={`rotate(-18 ${x} ${y})`} />}
      <circle cx={x} cy={y} r={b.r} fill={b.col} className="fz3-o" />
      {b.bands && (
        <path
          d={`M${x - b.r * 0.92} ${y - b.r * 0.35} H${x + b.r * 0.92} M${x - b.r} ${y + b.r * 0.08} H${x + b.r} M${x - b.r * 0.85} ${y + b.r * 0.48} H${x + b.r * 0.85}`}
          className="fz3-band"
        />
      )}
      {b.name === 'Země' && <path d={`M${x - 4} ${y - 3} q3 -3 5 0 q2 4 -2 6Z`} fill="#5c9a6b" />}
      <path d={`M${x} ${y - b.r} A${b.r} ${b.r} 0 0 1 ${x} ${y + b.r} A${b.r * 0.45} ${b.r} 0 0 0 ${x} ${y - b.r}`} fill={pat(id, 'sh')} />
      {b.ring && (
        <path
          d={`M${x - b.r * 1.9} ${y} A${b.r * 1.9} ${b.r * 0.55} 0 0 0 ${x + b.r * 1.9} ${y}`}
          className="fz3-o fz3-saturn-ring"
          transform={`rotate(-18 ${x} ${y})`}
        />
      )}
    </g>
  )
}

export default function SolarSystem() {
  const compact = useCompact()
  const n = compact.narrow
  const uid = 'fz3s' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  // positions along the row (wide) or column (narrow); not to scale
  const along = n ? [62, 104, 146, 188, 0, 268, 330, 388, 436, 484] : [96, 146, 198, 248, 0, 350, 430, 506, 568, 628]
  const beltAt = n ? 224 : 296
  const W = n ? 340 : 680
  const H = n ? 520 : 290
  const sun = n ? { x: 70, y: -80, r: 96 } : { x: -40, y: 140, r: 96 }
  const pos = (s: number): [number, number] => (n ? [70, s] : [s, 140])
  const dist = (s: number) => (n ? s - sun.y : s - sun.x)
  const R = rng(7)
  const belt = Array.from({ length: 70 }, () => {
    const d = dist(beltAt) + (R() - 0.5) * 22
    const a = n ? -0.12 + R() * 0.47 : (R() - 0.5) * 1.1
    const base = n ? Math.PI / 2 : 0
    return [sun.x + Math.cos(base + a) * d, sun.y + Math.sin(base + a) * d, 0.8 + R() * 1.3]
  })
  const idx = (i: number) => (i < BELT ? i : i + 1)
  const groups = [
    { t: 'kamenné planety', a: along[0], b: along[3] },
    { t: 'plynní obři', a: along[5], b: along[6] },
    { t: 'ledoví obři', a: along[7], b: along[8] },
  ]
  return (
    <Figure level={7} w={W} h={H} max={n ? 420 : 720} compact={compact} boost={false} label={LABEL}>
      <SolarDefs w={W} h={H} uid={uid} />
      <g clipPath={`url(#${uid}-clip)`}>
        {BODIES.map((_, i) => {
          const s = along[idx(i)]
          return <Draw key={i} d={circle(sun.x, sun.y, dist(s))} className={`fz3-orbit ${i === 8 ? 'fz3-dash' : ''}`} delay={0.05 * i} />
        })}
        <Fade delay={0.6}>
          {belt.map(([x, y, r], k) => (
            <circle key={k} cx={x} cy={y} r={r} className="fz3-rock" />
          ))}
        </Fade>
        <circle cx={sun.x} cy={sun.y} r={sun.r + 10} className="fz3-sun-halo" />
        <circle cx={sun.x} cy={sun.y} r={sun.r} className="fz3-sun" />
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill={`url(#${uid}-dots)`} />
      </g>
      <text x={n ? 170 : 16} y={n ? 22 : 40} textAnchor={n ? 'middle' : 'start'} className="fz3-lbl fz3-b fz3-big fz3-sun-t">
        Slunce
      </text>
      {BODIES.map((b, i) => {
        const [x, y] = pos(along[idx(i)])
        const up = i % 2 === 0
        return (
          <g key={b.name}>
            <Pop delay={0.2 + i * 0.07}>
              <Planet x={x} y={y} b={b} />
            </Pop>
            <Fade delay={0.4 + i * 0.07}>
              {n ? (
                <text x={112} y={y + 6} className="fz3-lbl fz3-b">
                  {b.name}
                  {b.name === 'Pluto' ? (
                    <tspan className="fz3-muted-t" style={{ fontWeight: 600 }}>
                      {' '}
                      – trpasličí planeta
                    </tspan>
                  ) : null}
                </text>
              ) : (
                <>
                  <text x={x} y={up ? y - Math.max(b.r, 8) - 12 : y + Math.max(b.r, 8) + 22} textAnchor="middle" className="fz3-lbl fz3-b">
                    {b.name}
                  </text>
                  {b.name === 'Pluto' && (
                    <text x={x} y={y + 28} textAnchor="middle" className="fz3-lbl fz3-sm fz3-muted-t">
                      <tspan x={x}>trpasličí</tspan>
                      <tspan x={x} dy={17}>
                        planeta
                      </tspan>
                    </text>
                  )}
                </>
              )}
            </Fade>
          </g>
        )
      })}
      <Fade delay={0.8}>
        {n ? (
          <text x={112} y={beltAt + 6} className="fz3-lbl fz3-muted-t fz3-halo">
            pás planetek
          </text>
        ) : (
          <text x={beltAt} y={220} textAnchor="middle" className="fz3-lbl fz3-sm fz3-muted-t fz3-halo">
            pás planetek
          </text>
        )}
        {groups.map((g) =>
          n ? (
            <g key={g.t}>
              <path d={`M${300} ${g.a - 8} h8 V${g.b + 8} h-8`} className="fz3-o fz3-thin fz3-lvl-s" />
              <text x={296} y={(g.a + g.b) / 2 + 5} textAnchor="end" className="fz3-lbl fz3-sm fz3-lvl-t">
                {g.t}
              </text>
            </g>
          ) : (
            <g key={g.t}>
              <path d={`M${g.a - 10} 250 v8 H${g.b + 10} v-8`} className="fz3-o fz3-thin fz3-lvl-s" />
              <text x={(g.a + g.b) / 2} y={278} textAnchor="middle" className="fz3-lbl fz3-sm fz3-lvl-t">
                {g.t}
              </text>
            </g>
          ),
        )}
        {!n && (
          <text x={664} y={276} textAnchor="end" className="fz3-lbl fz3-sm fz3-muted-t">
            není v měřítku
          </text>
        )}
      </Fade>
    </Figure>
  )
}

const circle = (x: number, y: number, r: number) => `M${x - r} ${y} A${r} ${r} 0 1 0 ${x + r} ${y} A${r} ${r} 0 1 0 ${x - r} ${y}`

function SolarDefs({ w, h, uid }: { w: number; h: number; uid: string }) {
  return (
    <defs>
      <clipPath id={`${uid}-clip`}>
        <rect x={0} y={0} width={w} height={h} />
      </clipPath>
      <pattern id={`${uid}-dots`} width={7} height={7} patternUnits="userSpaceOnUse">
        <circle cx={2} cy={2} r={0.9} fill="#b8741a" opacity={0.5} />
        <circle cx={5.5} cy={5.5} r={0.9} fill="#b8741a" opacity={0.5} />
      </pattern>
    </defs>
  )
}
