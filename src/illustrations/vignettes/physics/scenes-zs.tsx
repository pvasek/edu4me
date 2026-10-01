import { Arrow, Ball, G, GLASS, Ground, INK, PAPER, SPECTRUM, Star, Stopwatch, detail, labelFill, labelFont, type Ctx } from './kit'

/* Physics vignettes 1–7 (ZŠ). */

/* ---------------------------------------------------------------- 1 Měření a látky */
export function Measuring(c: Ctx) {
  const grads = Array.from({ length: 13 }, (_, i) => 56 + i * 8)
  const ticks = Array.from({ length: 19 }, (_, i) => {
    const x = 84 + i * 4.4
    const h = i % 5 === 0 ? 7 : 3.5
    return `M${x.toFixed(1)} 148v${h}`
  }).join('')
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* measuring cylinder */}
      <path d="M36 42V164H64V42" fill={GLASS} />
      <path d="M36 100Q50 108 64 100V164H36Z" fill={c.hl} stroke="none" />
      <path d="M36 100Q50 108 64 100" stroke={c.L} strokeWidth="1.8" />
      <path d={grads.map((y, i) => `M36 ${y}h${i % 2 === 0 ? 11 : 6}`).join('')} strokeWidth="1.1" />
      <path d="M58 50v40" {...detail} strokeOpacity="0.45" />
      <path d="M36 42V164H64V42" />
      <path d="M32 42h36M36 42l-5-5" strokeWidth="2.4" />
      <path d="M26 172h48l-5-8H31Z" fill="var(--surface)" />
      <path d="M26 172h48l-5-8H31Z" fill={c.hi} stroke="none" />
      {/* a drop falling into the cylinder */}
      <G cls="a-fall" style={{ ['--fall' as string]: '52px' }}>
        <path d="M50 30c1.6 2.2 2.6 3.8 2.6 5.2a2.6 2.6 0 0 1-5.2 0c0-1.4 1-3 2.6-5.2Z" fill={c.L} strokeWidth="1" />
      </G>
      {/* stopwatch */}
      <Stopwatch c={c} x={136} y={70} r={30} />
      {/* ruler */}
      <rect x="80" y="148" width="90" height="16" rx="1.5" fill="var(--surface)" />
      <rect x="80" y="158" width="90" height="6" fill={c.hl} stroke="none" />
      <path d={ticks} strokeWidth="1.1" />
      <rect x="80" y="148" width="90" height="16" rx="1.5" />
      {/* a cube of matter */}
      <path d="M100 124l9-8h27l-9 8Z" fill={c.L} fillOpacity="0.4" />
      <path d="M127 124l9-8v24l-9 8Z" fill={c.L} fillOpacity="0.85" />
      <path d="M127 124l9-8v24l-9 8Z" fill={c.hi} stroke="none" />
      <rect x="100" y="124" width="27" height="24" fill={c.L} fillOpacity="0.85" />
      <path d="M104 142v-14h6" stroke={PAPER} strokeOpacity="0.7" {...detail} />
      <path d="M100 124l9-8h27v24l-9 8H100Z" />
    </>
  )
}

/* ---------------------------------------------------------------- 2 Pohyb a síly */
function Wheel({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="var(--surface)" strokeWidth="2.2" />
      <G cls="a-spin" origin={`${x}px ${y}px`}>
        <path d={`M${x - r + 2} ${y}h${2 * r - 4}M${x} ${y - r + 2}v${2 * r - 4}`} strokeWidth="1.3" />
      </G>
      <circle cx={x} cy={y} r="2.4" fill={INK} stroke="none" />
    </>
  )
}
export function Motion(c: Ctx) {
  const apple = (y: number) => `M150 ${y - 6}c-4-3-10-1-10 5 0 6 5 10 10 8 5 2 10-2 10-8 0-6-6-8-10-5Z`
  return (
    <>
      <Ground c={c} y={174} rx={78} />
      <path d="M22 168h156" strokeWidth="1.4" strokeOpacity="0.6" />
      {/* branch with leaves */}
      <path d="M178 30c-14 2-28 4-44 12" strokeWidth="3" />
      <path d="M150 38c-2 4-1 8 0 10" strokeWidth="1.4" />
      <path d="M160 34c4-10 14-12 20-10-2 8-12 12-20 10Z" fill="var(--green)" fillOpacity="0.75" />
      <path d="M140 40c-8-6-18-4-22 0 6 6 16 6 22 0Z" fill="var(--green)" fillOpacity="0.75" />
      {/* stroboscopic ghosts: equal time steps, growing gaps */}
      <path d="M150 58V150" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.45" />
      {[
        [72, 0.22],
        [98, 0.3],
        [136, 0.4],
      ].map(([y, o]) => (
        <path key={y} d={apple(y)} stroke={c.L} strokeOpacity={o + 0.35} strokeWidth="1.4" strokeDasharray="2.5 2.5" />
      ))}
      <G cls="a-fall" style={{ ['--fall' as string]: '104px' }}>
        <path d={apple(56)} fill={c.L} />
        <path d="M145 52a4 4 0 0 1 4-3" stroke={PAPER} strokeWidth="1.4" strokeOpacity="0.8" />
      </G>
      <Arrow x1={168} y1={84} x2={168} y2={112} color={INK} w={1.6} head={6} />
      <text x="174" y="104" fill={labelFill(c)} stroke="none" style={labelFont(15)}>
        g
      </text>
      {/* cart pushed by a force */}
      <G cls="a-drift">
        <Arrow x1={18} y1={132} x2={58} y2={132} color={c.L} w={4.4} head={11} />
        <text x="30" y="122" fill={labelFill(c)} stroke="none" style={labelFont(18)}>
          F
        </text>
        <path d="M62 112h66l-4 36H66Z" fill={c.L} fillOpacity="0.85" />
        <path d="M62 112h66l-4 36H66Z" fill={c.hi} stroke="none" />
        <path d="M64 124h62M65 136h60" stroke={PAPER} strokeOpacity="0.55" {...detail} />
        <path d="M62 112h66l-4 36H66Z" />
        <path d="M58 112h74" strokeWidth="3" />
        <Wheel x={80} y={156} />
        <Wheel x={112} y={156} />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 3 Tlak a tekutiny */
export function Fluids(c: Ctx) {
  let waves = 'M12.3 120'
  for (let x = 12.3; x < 187; x += 12.5) waves += `Q${(x + 3.1).toFixed(1)} 116.5 ${(x + 6.25).toFixed(1)} 120T${(x + 12.5).toFixed(1)} 120`
  const water = `${waves}L187.7 120A90 90 0 0 1 12.3 120Z`
  const dial = Array.from({ length: 7 }, (_, i) => {
    const a = ((-120 + i * 40) * Math.PI) / 180
    const r1 = i % 3 === 0 ? 12 : 14
    return `M${(48 + r1 * Math.sin(a)).toFixed(1)} ${(58 - r1 * Math.cos(a)).toFixed(1)}L${(48 + 17 * Math.sin(a)).toFixed(1)} ${(58 - 17 * Math.cos(a)).toFixed(1)}`
  }).join('')
  return (
    <>
      {/* water */}
      <path d={water} fill={c.L} fillOpacity="0.16" stroke="none" />
      <path d="M30 140h22M78 148h26M130 142h30M40 162h24M114 166h36M160 156h14" stroke={c.L} strokeOpacity="0.55" {...detail} />
      {/* pressure probe and gauge */}
      <path d="M48 80V150a6 6 0 0 0 6 6h4" strokeWidth="5.4" />
      <path d="M48 80V150a6 6 0 0 0 6 6h4" stroke="var(--surface)" strokeWidth="2.4" />
      <path d="M58 148l10-5v26l-10-5Z" fill={c.L} />
      <circle cx="48" cy="58" r="23" fill="var(--surface)" />
      <path d="M25 58a23 23 0 1 0 46 0a23 23 0 1 0-46 0ZM29.5 58a18.5 18.5 0 1 0 37 0a18.5 18.5 0 1 0-37 0Z" fill={c.hl} fillRule="evenodd" stroke="none" />
      <circle cx="48" cy="58" r="23" />
      <circle cx="48" cy="58" r="18.5" strokeWidth="1.2" />
      <path d={dial} strokeWidth="1.3" />
      <G cls="a-swing" origin="48px 58px" style={{ ['--swing' as string]: '9deg', animationDuration: '3.6s' }}>
        <path d="M48 58l8-11" stroke={c.L} strokeWidth="2.4" />
      </G>
      <circle cx="48" cy="58" r="2.6" fill={INK} stroke="none" />
      <text x="48" y="74" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(12)}>
        p
      </text>
      {/* buoyancy */}
      <Arrow x1={126} y1={176} x2={126} y2={142} color={c.L} w={3.6} head={9} />
      <text x="134" y="172" fill={labelFill(c)} stroke="none" style={labelFont(15)}>
        F<tspan dy="3" style={{ fontSize: 10 }}>vz</tspan>
      </text>
      {/* ship */}
      <G cls="a-bob">
        <path d="M68 104H176L162 134H84Z" fill="var(--surface)" />
        <path d="M76 120H169.4L162 134H84Z" fill={c.hx} stroke="none" />
        <path d="M68 104H176L173.7 109H70.3Z" fill={c.L} stroke="none" />
        <path d="M68 104H176L162 134H84Z" />
        <rect x="94" y="84" width="34" height="20" fill="var(--surface)" />
        <circle cx="103" cy="94" r="3" strokeWidth="1.2" />
        <circle cx="119" cy="94" r="3" strokeWidth="1.2" />
        <path d="M136 104V66h13v38" fill={c.L} />
        <path d="M136 72h13" stroke={INK} strokeWidth="3" />
        <path d="M136 104V66h13v38" />
      </G>
      <g className="a-drift">
        <circle cx="146" cy="54" r="5" strokeWidth="1.2" fill={GLASS} />
        <circle cx="156" cy="44" r="6.5" strokeWidth="1.2" fill={GLASS} />
        <circle cx="168" cy="36" r="4.5" strokeWidth="1.2" fill={GLASS} />
      </g>
      <path d={waves} stroke={c.L} strokeWidth="1.8" />
    </>
  )
}

/* ---------------------------------------------------------------- 4 Teplo a zvuk */
export function HeatSound(c: Ctx) {
  const arc = (r: number, side: 1 | -1) => {
    const a = (36 * Math.PI) / 180
    const x1 = 146 + side * r * Math.cos(a)
    const y1 = 76 - r * Math.sin(a)
    const y2 = 76 + r * Math.sin(a)
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${x1.toFixed(1)} ${y2.toFixed(1)}`
  }
  return (
    <>
      <Ground c={c} y={174} rx={78} />
      {/* burner and flame */}
      <path d="M36 148l-6 24M92 148l6 24M34 148h60" strokeWidth="2.2" />
      <g className="a-flicker">
        <path d="M64 170c-8 0-10-6-8-11 1 3 3 4 4 4-1-6 2-10 5-13 0 5 7 7 7 13 0 4-3 7-8 7Z" fill="#e88b35" />
        <path d="M64 170c-3 0-4-2-3-5 1 1 2 1 2 1 0-2 1-4 2-5 0 2 3 3 3 5 0 2-1 4-4 4Z" fill="#e0b43a" stroke="none" />
      </g>
      {/* pot */}
      <path d="M30 104h68v34a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8Z" fill={c.L} fillOpacity="0.85" />
      <path d="M30 104h68v34a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8Z" fill={c.hi} stroke="none" />
      <path d="M36 112v26" stroke={PAPER} strokeOpacity="0.7" {...detail} />
      <path d="M30 104h68v34a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8Z" />
      <path d="M30 112h-7v10h7M98 112h7v10h-7" strokeWidth="2.2" />
      <G cls="a-bob" style={{ animationDuration: '1.6s' }}>
        <path d="M26 104c10-12 66-12 76 0Z" fill="var(--surface)" />
        <circle cx="64" cy="92" r="3.6" fill={c.L} />
      </G>
      {/* steam */}
      {[48, 64, 80].map((x, i) => (
        <path
          key={x}
          className="a-bubble"
          d={`M${x} 82c-6-5 6-9 0-14s6-9 0-14`}
          strokeWidth="1.8"
          strokeOpacity="0.6"
          style={{ animationDelay: `${i * 1.05}s`, animationDuration: '3.2s' }}
        />
      ))}
      {/* tuning fork on a resonance box */}
      <path d="M120 150h52v22h-52Z" fill={c.L} fillOpacity="0.85" />
      <path d="M120 150h52v22h-52Z" fill={c.hi} stroke="none" />
      <path d="M120 150h52v22h-52Z" />
      <ellipse cx="146" cy="161" rx="10" ry="4" fill={INK} stroke="none" />
      <path d="M146 150V124M136 52V112a10 10 0 0 0 20 0V52" strokeWidth="7" />
      <path d="M146 150V124M136 52V112a10 10 0 0 0 20 0V52" stroke="var(--surface)" strokeWidth="3" />
      {/* sound waves */}
      {[20, 30, 40].map((r, i) => (
        <path key={`r${r}`} className="a-glow" d={arc(r, 1)} stroke={c.L} strokeWidth="2.4" style={{ animationDelay: `${i * 0.4}s`, animationDuration: '1.6s' }} />
      ))}
      {[20, 30].map((r, i) => (
        <path key={`l${r}`} className="a-glow" d={arc(r, -1)} stroke={c.L} strokeWidth="2.4" style={{ animationDelay: `${i * 0.4}s`, animationDuration: '1.6s' }} />
      ))}
    </>
  )
}

/* ---------------------------------------------------------------- 5 Světlo */
export function Light(c: Ctx) {
  // right face of the prism, A(96 46) → C(142 140)
  const face = (y: number) => 96 + ((y - 46) / 94) * 46
  const fy = (i: number) => 86 + i * 2.4
  const ey = (i: number) => 100 + i * 8
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return `M${(30 + 12 * Math.cos(a)).toFixed(1)} ${(114 + 12 * Math.sin(a)).toFixed(1)}L${(30 + 17 * Math.cos(a)).toFixed(1)} ${(114 + 17 * Math.sin(a)).toFixed(1)}`
  }).join('')
  return (
    <>
      <Ground c={c} y={146} rx={56} cx={96} />
      {/* source */}
      <G cls="a-spin-slow" origin="30px 114px">
        <path d={rays} stroke={c.L} strokeWidth="2" />
      </G>
      <circle cx="30" cy="114" r="8.5" fill="var(--yellow)" />
      {/* white beam */}
      <path d="M40 110L73 94" strokeWidth="7" />
      <path d="M40 110L73 94" stroke={PAPER} strokeWidth="4" />
      <path className="a-flow" d="M40 110L73 94" stroke="var(--yellow)" strokeWidth="2" strokeDasharray="3 7" />
      {/* spectrum fan */}
      {SPECTRUM.map((col, i) => (
        <path
          key={col}
          d={`M${face(fy(i)).toFixed(1)} ${fy(i)}L170 ${ey(i)}V${ey(i + 1)}L${face(fy(i + 1)).toFixed(1)} ${fy(i + 1)}Z`}
          fill={col}
          fillOpacity="0.9"
          stroke="none"
        />
      ))}
      <path d={`M${face(fy(0)).toFixed(1)} ${fy(0)}L170 ${ey(0)}M${face(fy(6)).toFixed(1)} ${fy(6)}L170 ${ey(6)}`} strokeWidth="1.2" />
      {/* prism */}
      <path d="M96 46L50 140H142Z" fill={GLASS} />
      <path d="M96 46V140H142Z" fill={c.hi} stroke="none" />
      <path d={`M73 94L${face(86).toFixed(1)} 86L${face(100.4).toFixed(1)} 100.4Z`} fill={PAPER} fillOpacity="0.85" stroke="none" />
      <path d="M96 46L50 140H142Z" strokeWidth="2.6" />
      <path d="M96 56l-38 78" stroke={PAPER} strokeOpacity="0.7" {...detail} />
      {/* screen */}
      <rect x="170" y="94" width="7" height="60" fill="var(--surface)" />
      <rect x="170" y="94" width="7" height="60" fill={c.hi} stroke="none" />
      <rect x="170" y="94" width="7" height="60" />
    </>
  )
}

/* ---------------------------------------------------------------- 6 Elektřina */
export function Electricity(c: Ctx) {
  const wire = 'M160 138V144a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10V96a10 10 0 0 1 10-10H150a10 10 0 0 1 10 10V104'
  const halo = Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 - 90) * Math.PI) / 180
    if (Math.sin(a) > 0.5) return ''
    return `M${(100 + 29 * Math.cos(a)).toFixed(1)} ${(44 + 29 * Math.sin(a)).toFixed(1)}L${(100 + 37 * Math.cos(a)).toFixed(1)} ${(44 + 37 * Math.sin(a)).toFixed(1)}`
  }).join('')
  return (
    <>
      <path d={wire} strokeWidth="2.6" />
      <path className="a-flow" d={wire} stroke={c.L} strokeWidth="2.6" strokeDasharray="2 8" style={{ animationDirection: 'reverse' }} />
      {/* bulb */}
      <circle className="a-glow" cx="100" cy="44" r="27" fill="var(--yellow)" fillOpacity="0.28" stroke="none" />
      <path className="a-glow" d={halo} stroke="var(--yellow)" strokeWidth="2.6" />
      <path d="M91 68c0-8-13-12-13-24a22 22 0 1 1 44 0c0 12-13 16-13 24Z" fill="var(--yellow)" fillOpacity="0.45" />
      <path d="M91 68c0-8-13-12-13-24a22 22 0 1 1 44 0c0 12-13 16-13 24Z" fill={GLASS} fillOpacity="0.4" stroke="none" />
      <path d="M95 68V50M105 68V50" {...detail} />
      <path d="M95 50l2-5 2 5 2-5 2 5 2-5" stroke="#e88b35" strokeWidth="2" />
      <path d="M86 34a16 16 0 0 1 8-10" stroke={PAPER} strokeWidth="1.6" strokeOpacity="0.9" />
      <path d="M91 68c0-8-13-12-13-24a22 22 0 1 1 44 0c0 12-13 16-13 24Z" />
      <path d="M90 68h20v12a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4Z" fill="var(--surface)" />
      <path d="M90 68h20v12a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4Z" fill={c.hx} stroke="none" />
      <path d="M90 68h20v12a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4Z" />
      <path d="M90 73h20M90 78h20" {...detail} />
      {/* switch (closed) */}
      <circle cx="160" cy="138" r="3.4" fill="var(--surface)" />
      <circle cx="160" cy="104" r="3.4" fill="var(--surface)" />
      <path d="M160 138L163 106" stroke={c.L} strokeWidth="3.6" />
      <path d="M162 118h12" strokeWidth="2.2" />
      <circle cx="176" cy="118" r="4" fill={c.L} />
      {/* battery */}
      <rect x="126" y="147" width="6" height="14" rx="1.5" fill={INK} />
      <rect x="70" y="140" width="56" height="28" rx="5" fill="var(--surface)" />
      <rect x="92" y="140" width="34" height="28" rx="5" fill={c.L} fillOpacity="0.85" stroke="none" />
      <rect x="92" y="140" width="34" height="28" fill={c.hi} stroke="none" />
      <rect x="70" y="140" width="56" height="28" rx="5" />
      <path d="M92 140v28" />
      <path d="M104 154h10M109 149v10" stroke={PAPER} strokeWidth="2.4" />
      <path d="M76 154h9" strokeWidth="2.4" />
    </>
  )
}

/* ---------------------------------------------------------------- 7 Magnetismus, energetika a vesmír */
export function Magnetism(c: Ctx) {
  const blade = 'M142 78C135 64 136 50 142 36C147 50 148 64 142 78Z'
  return (
    <>
      <Ground c={c} y={174} rx={78} />
      {/* stars */}
      {[
        [104, 26, 4, 0],
        [32, 92, 3.2, 0.8],
        [100, 72, 3, 1.6],
        [22, 46, 2.6, 2.2],
      ].map(([x, y, r, d]) => (
        <g key={`${x}`} className="a-glow" style={{ animationDelay: `${d}s` }}>
          <Star x={x} y={y} r={r} fill="var(--yellow)" />
        </g>
      ))}
      {/* Saturn */}
      <g transform="rotate(-16 62 50)">
        <ellipse cx="62" cy="50" rx="30" ry="8.5" stroke={INK} strokeWidth="1.6" />
        <Ball x={62} y={50} r={15} fill={c.L} />
        <path d="M49 44h26M47.5 52h29" stroke={PAPER} strokeOpacity="0.45" {...detail} />
        <path d="M32 50a30 8.5 0 0 0 60 0" strokeWidth="2.4" />
        <path d="M36 50a26 6.2 0 0 0 52 0" stroke={c.L} strokeWidth="1.2" />
      </g>
      {/* horseshoe magnet with field lines */}
      <path d="M47 114C47 98 85 98 85 114M47 114C44 86 88 86 85 114M47 114C40 72 92 72 85 114" stroke={c.L} strokeWidth="1.4" strokeDasharray="3 3" />
      <path d="M40 116C28 108 24 98 24 88M92 116C104 108 108 98 108 88" stroke={c.L} strokeWidth="1.4" strokeDasharray="3 3" strokeOpacity="0.7" />
      <path d="M40 114V146a26 26 0 0 0 52 0V114H78V146a12 12 0 0 1-24 0V114Z" fill={c.L} fillOpacity="0.85" />
      <path d="M40 146a26 26 0 0 0 52 0H78a12 12 0 0 1-24 0Z" fill={c.hi} stroke="none" />
      <path d="M40 114h14v14H40Z" fill="#c8453a" />
      <path d="M78 114h14v14H78Z" fill="var(--surface)" />
      <path d="M78 114h14v14H78Z" fill={c.hx} stroke="none" />
      <path d="M40 114V146a26 26 0 0 0 52 0V114H78V146a12 12 0 0 1-24 0V114Z" />
      <path d="M40 128h14M78 128h14" />
      <text x="47" y="125" textAnchor="middle" fill={PAPER} stroke="none" style={{ font: '700 10px var(--font-body)' }}>
        N
      </text>
      <text x="85" y="125" textAnchor="middle" fill="var(--ink)" stroke="none" style={{ font: '700 10px var(--font-body)' }}>
        S
      </text>
      {/* wind turbine */}
      <path d="M138 172L140.5 82h3L146 172Z" fill="var(--surface)" />
      <path d="M142 82V172H146Z" fill={c.hi} stroke="none" />
      <path d="M138 172L140.5 82h3L146 172Z" />
      <path d="M136 74h14a4 4 0 0 1 0 8h-14Z" fill={c.L} />
      <G cls="a-spin" origin="142px 78px">
        {[0, 120, 240].map((a) => (
          <path key={a} d={blade} transform={`rotate(${a} 142 78)`} fill="var(--surface)" strokeWidth="1.8" />
        ))}
      </G>
      <circle cx="142" cy="78" r="4.5" fill={c.L} strokeWidth="1.6" />
    </>
  )
}
