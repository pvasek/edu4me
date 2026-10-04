import { Arrow, Cloud, Flag, G, GEO, PAPER, Person, PlateClip, Star, Tree, detail, f, plateBand, waveD, type Ctx } from './kit'

/* Geography vignettes 10–12 (gymnázium). */

/* ---------------------------------------------------------------- 10 Systémy Země a přírodní rizika */
export function CoastSatellite(c: Ctx) {
  const seafloor = 'M0 140L92 142C100 144 106 150 112 158C122 172 134 186 146 200'
  return (
    <>
      <PlateClip>
        {/* sea over a subducting oceanic plate */}
        <path d="M0 104H128L122 120C118 132 115 146 112 158C106 150 100 144 92 142L0 140Z" fill={GEO.sea} />
        <path d={`${seafloor}H128C118 188 104 170 96 162C90 158 84 156 76 156L0 154Z`} fill={c.hl} />
        <path d="M0 154L76 156C84 156 90 158 96 162C104 170 118 188 128 200H0Z" fill={c.hx} stroke="none" />
        <path d="M0 154L76 156C84 156 90 158 96 162C104 170 118 188 128 200H0Z" fill={GEO.red} fillOpacity="0.25" stroke="none" />
        {/* continent with a cliff coast */}
        <path d="M128 104L122 120C118 132 115 146 112 158C122 172 134 186 146 200H200V92L176 90C160 88 150 94 140 96L130 98Z" fill={c.L} fillOpacity="0.16" />
        <path d="M128 104L122 120C118 132 115 146 112 158C122 172 134 186 146 200H200V92L176 90C160 88 150 94 140 96L130 98Z" fill={c.hi} stroke="none" />
        <path d="M130 98L140 96C150 94 160 88 176 90L200 92" stroke={GEO.forest} strokeWidth="3" />
        <path d="M150 120h8M170 134h10M140 150h6M166 170h8" {...detail} strokeOpacity="0.55" />
        <path d={`${waveD(0, 50, 104, 1.4, 9)}${waveD(98, 126, 104, 1.4, 9)}${waveD(10, 110, 118, 1.2, 12)}`} strokeWidth="1.1" strokeOpacity="0.65" />
      </PlateClip>
      <Arrow x1={20} y1={147.5} x2={62} y2={149} color={PAPER} w={2} head={6} />
      {/* breaking wave */}
      <path d="M50 104C58 100 62 88 74 84C86 80 96 86 96 96C92 92 84 92 82 98C81 102 86 104 92 104Z" fill={GEO.sea} strokeWidth="1.6" />
      <path d="M62 96c4-6 10-9 18-8M84 90c4-1 8 0 10 3" stroke={PAPER} strokeOpacity="0.75" strokeWidth="1.3" />
      {/* earthquake at the plate boundary */}
      <G cls="a-glow">
        <path d="M104 158a12 12 0 0 1 14-10M128 160a12 12 0 0 1-12 12M100 166a18 18 0 0 1 8-16" stroke="var(--yellow)" strokeWidth="1.4" />
      </G>
      <Star x={115} y={162} r={6} fill="var(--yellow)" />
      {/* lighthouse and houses on the cliff */}
      <path d="M132 97L134 72h6l2 25Z" fill={PAPER} />
      <path d="M133.2 87h7.6l.4 5h-8.4ZM134 77h6l.3 4h-6.6Z" fill={GEO.red} stroke="none" />
      <path d="M132 97L134 72h6l2 25Z" />
      <path d="M133 72v-5h8v5M132 67l5-4 5 4Z" fill={c.L} strokeWidth="1.2" />
      <path className="a-glow" d="M131 69l-10-3M131 70l-10 3" stroke="var(--yellow)" strokeWidth="1.6" />
      <path d="M152 92v-8h10v8M150 85l7-6 7 6M168 90v-8h10v8M166 83l7-6 7 6" fill={GEO.wall} strokeWidth="1.3" />
      {/* satellite scanning the coast */}
      <path d="M68 50L92 103L178 90Z" fill={c.L} fillOpacity="0.1" stroke={c.L} strokeWidth="1" strokeDasharray="3 3" />
      <G cls="a-bob">
        <path d="M58 40h-18v-7h18ZM78 40h18v-7H78Z" fill={GEO.blue} strokeWidth="1.3" />
        <path d="M46 33v7M52 33v7M84 33v7M90 33v7" strokeWidth="0.8" strokeOpacity="0.7" />
        <path d="M58 36.5h4M74 36.5h4" strokeWidth="1.4" />
        <rect x="62" y="30" width="12" height="13" rx="1.5" fill={c.L} strokeWidth="1.5" />
        <rect x="62" y="30" width="12" height="13" rx="1.5" fill={c.hi} stroke="none" />
        <path d="M63 47a5 3 0 0 0 10 0ZM68 43v4" fill="var(--surface)" strokeWidth="1.2" />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 11 Obyvatelstvo, města a geopolitika */
function Tower({ x, w, top, c, fill = 'var(--surface)' }: { x: number; w: number; top: number; c: Ctx; fill?: string }) {
  const floors = Array.from({ length: Math.floor((128 - top - 6) / 6) }, (_, i) => `M${x + 2} ${top + 6 + i * 6}h${w - 4}`).join('')
  return (
    <g>
      <path d={`M${x} 128V${top}h${w}V128Z`} fill={fill} />
      <path d={`M${x + w / 2} ${top}h${w / 2}V128h${-w / 2}Z`} fill={c.hi} stroke="none" />
      <path d={floors} strokeWidth="0.8" strokeOpacity="0.55" />
      <path d={`M${x + w / 2} ${top + 3}V126`} strokeWidth="0.8" strokeOpacity="0.55" />
      <path d={`M${x} 128V${top}h${w}V128`} strokeWidth="1.6" />
    </g>
  )
}
export function CityFlags(c: Ctx) {
  const ribs = [-12, -6, 0, 6, 12].map((dx) => `M${100 + dx} 92Q${100 + dx * 0.9} 78 ${100 + dx * 0.3} 73`).join('')
  const cols = Array.from({ length: 10 }, (_, i) => {
    const x = i < 5 ? 64 + i * 4.5 : 117 + (i - 5) * 4.5
    return `M${x} 116V128`
  }).join('')
  return (
    <>
      {/* back towers */}
      <Tower x={20} w={14} top={96} c={c} fill={GEO.rock} />
      <Tower x={156} w={16} top={84} c={c} fill={GEO.rock} />
      <Tower x={170} w={12} top={100} c={c} fill={GEO.rock} />
      {/* domed building with colonnades */}
      <path d="M62 128V113h76v15Z" fill={GEO.wall} />
      <path d="M62 113h76" strokeWidth="2.2" />
      <path d={cols} strokeWidth="1.3" />
      <path d="M62 128V113M138 128V113" />
      <path d="M84 113V92h32v21Z" fill={GEO.wall} />
      <path d="M100 92h16v21h-16Z" fill={c.hi} stroke="none" />
      <path d="M84 113V92h32v21Z" />
      <path d="M89 98h4v9h-4ZM98 98h4v9h-4ZM107 98h4v9h-4Z" fill={c.hx} strokeWidth="0.9" />
      <path d="M82 92A18 19 0 0 1 118 92Z" fill={c.L} />
      <path d="M100 73A18 19 0 0 1 118 92H100Z" fill={c.hi} stroke="none" />
      <path d={ribs} strokeWidth="0.9" strokeOpacity="0.7" />
      <path d="M82 92A18 19 0 0 1 118 92Z" />
      <path d="M97 74v-6h6v6M96 68l4-4 4 4Z" fill={GEO.wall} strokeWidth="1.2" />
      <circle cx="100" cy="62" r="1.8" fill="var(--yellow)" strokeWidth="0.9" />
      {/* front towers */}
      <Tower x={36} w={10} top={78} c={c} fill={GEO.rock} />
      <Tower x={44} w={16} top={62} c={c} />
      <path d="M52 62V48" strokeWidth="1.4" />
      <Tower x={138} w={16} top={68} c={c} />
      <PlateClip>
        <path d={plateBand(128, 196, 92)} fill={GEO.sand} stroke="none" />
        <path d="M100 128L44 196M100 128L76 196M100 128L124 196M100 128L156 196M8 146H192M8 170H192" strokeWidth="0.9" strokeOpacity="0.4" />
      </PlateClip>
      <path d="M10 128H190" strokeWidth="2" />
      {/* row of flags */}
      {[
        [36, c.L, undefined],
        [68, GEO.blue, PAPER],
        [100, GEO.red, PAPER],
        [132, GEO.teal, GEO.field],
        [164, GEO.ochre, undefined],
      ].map(([x, fill, band], i) => (
        <g key={i}>
          <Flag x={x as number} y={162} h={46} fill={fill as string} band={band as string | undefined} delay={i * 0.5} />
          <path d={`M${(x as number) - 4} 162h8`} strokeWidth="2.4" />
        </g>
      ))}
      {/* people on the square */}
      <Person x={54} y={182} s={0.85} fill={GEO.violet} />
      <Person x={116} y={186} s={0.9} fill={GEO.field} flip />
      <Person x={146} y={178} s={0.8} fill={c.L} />
      {/* birds */}
      <path d="M70 34c3-3 5-3 7 0 2-3 4-3 7 0M120 28c2-2 4-2 5 0 1-2 3-2 5 0" strokeWidth="1.3" />
    </>
  )
}

/* ---------------------------------------------------------------- 12 Globální hospodářství a udržitelnost */
const PX = 100
const PY = 242
const PR = 142
const rad = (a: number) => (a * Math.PI) / 180
const onPlanet = (a: number, r = PR): [number, number] => [PX + r * Math.sin(rad(a)), PY - r * Math.cos(rad(a))]
function ringPatch(a0: number, a1: number, r0: number, r1: number) {
  const [x0, y0] = onPlanet(a0, r1)
  const [x1, y1] = onPlanet(a1, r1)
  const [x2, y2] = onPlanet(a1, r0)
  const [x3, y3] = onPlanet(a0, r0)
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 0 0 ${f(x3)} ${f(y3)}Z`
}
function Turbine({ a, h, c }: { a: number; h: number; c: Ctx }) {
  const [bx, by] = onPlanet(a)
  const [hx, hy] = onPlanet(a, PR + h)
  const L = h * 0.4
  const blade = `M0 0C2.4 -3 3 ${f(-L * 0.45)} 0 ${f(-L)}C-1.6 ${f(-L * 0.5)} -1.4 -3 0 0Z`
  return (
    <g>
      <path d={`M${f(bx)} ${f(by)}L${f(hx)} ${f(hy)}`} strokeWidth="2.6" />
      <path d={`M${f(bx)} ${f(by)}L${f(hx)} ${f(hy)}`} stroke="var(--surface)" strokeWidth="0.9" />
      <G cls="a-spin" origin={`${f(hx)}px ${f(hy)}px`} style={{ animationDuration: `${(6 + h / 12).toFixed(1)}s` }}>
        {[0, 120, 240].map((r) => (
          <path key={r} d={blade} transform={`translate(${f(hx)} ${f(hy)}) rotate(${r})`} fill="var(--surface)" strokeWidth="1.3" />
        ))}
      </G>
      <circle cx={f(hx)} cy={f(hy)} r="2.6" fill={c.L} strokeWidth="1.2" />
    </g>
  )
}
export function WindPlanet(c: Ctx) {
  const fills = [GEO.field, GEO.meadow, GEO.fieldPale, GEO.forestLight, GEO.field, GEO.meadow, GEO.fieldPale, GEO.field]
  const patches = Array.from({ length: 8 }, (_, i) => -48 + i * 12)
  const meridians = [-45, -30, -15, 0, 15, 30, 45]
    .map((a) => {
      const [x0, y0] = onPlanet(a, 40)
      const [x1, y1] = onPlanet(a, PR - 18)
      return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`
    })
    .join('')
  return (
    <>
      {/* sky */}
      <circle cx="140" cy="34" r="9" fill="var(--yellow)" />
      <path className="a-glow" d="M140 19v-4M153 26l3-3M155 34h4M127 26l-3-3" stroke="var(--yellow)" strokeWidth="1.8" />
      <Cloud x={30} y={86} w={24} />
      <Cloud x={82} y={74} w={20} hatch={c.hi} />
      <PlateClip>
        {/* the globe: sea with a graticule, land and fields on top */}
        <circle cx={PX} cy={PY} r={PR} fill={GEO.sea} />
        <g strokeWidth="0.9" strokeOpacity="0.5">
          <circle cx={PX} cy={PY} r={PR - 44} />
          <circle cx={PX} cy={PY} r={PR - 76} />
          <path d={meridians} />
        </g>
        {patches.map((a, i) => (
          <g key={a}>
            <path d={ringPatch(a, a + 12, PR - 18, PR)} fill={fills[i]} strokeWidth="1.2" />
            {i % 2 === 0 && <path d={ringPatch(a, a + 12, PR - 18, PR)} fill={c.hi} stroke="none" />}
          </g>
        ))}
        <path d={ringPatch(-60, 60, PR - 26, PR - 18)} fill={c.L} fillOpacity="0.55" stroke="none" />
        <path d={ringPatch(-60, 60, PR - 26, PR - 18)} fill={c.hx} stroke="none" />
        <circle cx={PX} cy={PY} r={PR - 26} strokeWidth="1.3" />
        <circle cx={PX} cy={PY} r={PR} strokeWidth="2" />
      </PlateClip>
      {/* solar panels, trees and a farm on the surface */}
      {[9, 13].map((a) => (
        <g key={a} transform={`rotate(${a} ${PX} ${PY})`}>
          <path d={`M95 ${PY - PR}v-4M104 ${PY - PR}v-6`} strokeWidth="1.2" />
          <path d={`M90 ${PY - PR - 3}l18-6v3.5l-18 6Z`} fill={GEO.blue} strokeWidth="1.2" />
        </g>
      ))}
      {[-34, -29, 30, 36].map((a, i) => (
        <g key={a} transform={`rotate(${a} ${PX} ${PY})`}>
          <Tree x={PX} y={PY - PR} r={i % 2 ? 5 : 6.5} fill={GEO.forestLight} hatch={c.hi} />
        </g>
      ))}
      <g transform={`rotate(-9 ${PX} ${PY})`}>
        <path d={`M92 ${PY - PR}v-9h14v9`} fill={GEO.wall} strokeWidth="1.3" />
        <path d={`M90 ${PY - PR - 8}l9-7 9 7Z`} fill={GEO.roof} strokeWidth="1.3" />
        <path d={`M97 ${PY - PR}v-4h4v4`} fill={c.hx} strokeWidth="0.9" />
      </g>
      {/* wind turbines */}
      <Turbine a={-17} h={54} c={c} />
      <Turbine a={2} h={64} c={c} />
      <Turbine a={21} h={44} c={c} />
    </>
  )
}
