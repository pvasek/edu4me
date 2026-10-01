import { Arrow, Ball, G, GLASS, Ground, INK, PAPER, Star, detail, labelFill, labelFont, pathOf, type Ctx } from './kit'

/* Physics vignettes 8–12 (gymnázium). */

/* ---------------------------------------------------------------- 8 Kinematika a dynamika */
export function Kinematics(c: Ctx) {
  // horizontal launch from a cliff: equal time steps → equal x steps, growing drops
  const x0 = 68
  const y0 = 60
  const dx = 19
  const k = 0.0113
  const pos = (i: number) => [x0 + dx * i, y0 + k * (dx * i) ** 2] as const
  const traj = pathOf(40, (t) => pos(t * 5) as [number, number])
  const [bx, by] = pos(3)
  const vy = 2 * k * dx * dx * 3 * 0.9
  return (
    <>
      <Ground c={c} y={174} rx={78} />
      <path d="M22 168h150" strokeWidth="1.4" strokeOpacity="0.6" />
      {[1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${pos(i)[0].toFixed(1)} 164v8`} strokeWidth="1.2" strokeOpacity="0.55" />
      ))}
      {/* stone tower */}
      <path d="M22 172V76H62V172Z" fill="var(--surface)" />
      <path d="M22 172V76H62V172Z" fill={c.hi} stroke="none" />
      <path
        d={Array.from({ length: 10 }, (_, r) => {
          const y = 76 + (r + 1) * 9.6
          const off = r % 2 ? 0 : 7
          return `M22 ${y.toFixed(1)}H62` + [0, 1, 2].map((k) => `M${22 + off + 7 + k * 13} ${y.toFixed(1)}v-9.6`).join('')
        }).join('')}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <path d="M22 172V76H62V172Z" />
      <path d="M18 76h48" strokeWidth="3" />
      {/* cannon */}
      <path d="M30 54h32l4-1v14l-4-1H30a6 6 0 0 1 0-12Z" fill={c.L} fillOpacity="0.9" />
      <path d="M30 60h36v6l-4-1H30a6 6 0 0 1-5.2-3Z" fill={c.hi} stroke="none" />
      <path d="M30 54h32l4-1v14l-4-1H30a6 6 0 0 1 0-12Z" />
      <path d="M58 54v12" {...detail} />
      <circle cx="40" cy="68" r="8" fill="var(--surface)" strokeWidth="2.2" />
      <path d="M34 68h12M40 62v12" {...detail} />
      <g className="a-drift">
        <circle cx="74" cy="52" r="3.5" strokeWidth="1.1" fill={GLASS} />
        <circle cx="80" cy="46" r="2.6" strokeWidth="1.1" fill={GLASS} />
      </g>
      {/* trajectory */}
      <path className="a-flow" d={traj} stroke={c.L} strokeWidth="2" strokeDasharray="4 6" />
      {[1, 2, 5].map((i) => (
        <circle key={i} cx={pos(i)[0]} cy={pos(i)[1]} r="5.5" fill={c.L} fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1.4" />
      ))}
      {/* velocity at one instant */}
      <Arrow x1={bx} y1={by} x2={bx + 20} y2={by} color={INK} w={1.5} head={6} />
      <Arrow x1={bx} y1={by} x2={bx} y2={by + vy} color={INK} w={1.5} head={6} />
      <path d={`M${bx + 20} ${by}V${by + vy}H${bx}`} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />
      <Arrow x1={bx} y1={by} x2={bx + 20} y2={by + vy} color={c.L} w={3} head={9} />
      <Ball x={bx} y={by} r={6.5} fill={c.L} />
      <text x={bx + 14} y={by + vy + 16} fill={labelFill(c)} stroke="none" style={labelFont(16)}>
        v
      </text>
      {/* gravity */}
      <Arrow x1={166} y1={50} x2={166} y2={80} color={INK} w={2} head={7} />
      <text x="172" y="70" fill={labelFill(c)} stroke="none" style={labelFont(16)}>
        g
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 9 Gravitace, rotace, kmity a vlny */
export function Gravity(c: Ctx) {
  const wave = pathOf(64, (t) => [28 + t * 144, 156 - 11 * Math.sin(t * Math.PI * 4)])
  const px = 146
  const py = 34
  const len = 84
  const arc = (a: number) => [px + len * Math.sin((a * Math.PI) / 180), py + len * Math.cos((a * Math.PI) / 180)] as const
  const [ax1, ay1] = arc(-17)
  const [ax2, ay2] = arc(17)
  return (
    <>
      {/* planet and orbiting satellite */}
      <circle cx="62" cy="66" r="38" strokeWidth="1.2" strokeDasharray="2 4" strokeOpacity="0.6" />
      <Ball x={62} y={66} r={16} fill={c.L} />
      <path d="M48 72c8 4 20 4 29-2M50 58c6-3 16-3 24 0" stroke={PAPER} strokeOpacity="0.5" {...detail} />
      <G cls="a-spin" origin="62px 66px" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
        <Arrow x1={92} y1={66} x2={81} y2={66} color={c.L} w={2.2} head={6} />
        <path d="M100 58v16" strokeWidth="1.6" />
        <rect x="95" y="50" width="10" height="7" fill={c.hl} strokeWidth="1.2" />
        <rect x="95" y="75" width="10" height="7" fill={c.hl} strokeWidth="1.2" />
        <rect x="96.5" y="62" width="7" height="8" rx="1.5" fill="var(--surface)" strokeWidth="1.6" />
      </G>
      {/* pendulum */}
      <rect x="120" y="26" width="46" height="8" fill={c.hi} stroke="none" />
      <path d="M120 34h46" strokeWidth="2.4" />
      <path d={`M${ax1.toFixed(1)} ${ay1.toFixed(1)}A${len} ${len} 0 0 0 ${ax2.toFixed(1)} ${ay2.toFixed(1)}`} strokeWidth="1.2" strokeDasharray="2 4" strokeOpacity="0.6" />
      <path d={`M${px} ${py}V${py + len + 12}`} strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.45" />
      <G cls="a-swing" origin={`${px}px ${py}px`} style={{ ['--swing' as string]: '17deg', animationDuration: '2.8s' }}>
        <path d={`M${px} ${py}V${py + len}`} strokeWidth="1.6" />
        <Ball x={px} y={py + len} r={10} fill={c.L} />
      </G>
      <circle cx={px} cy={py} r="2.6" fill={INK} stroke="none" />
      {/* wave */}
      <path d="M24 156h152" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.45" />
      <path d={wave} stroke={c.L} strokeWidth="3.2" />
      <path d="M46 136v-6M118 136v-6M46 133h72" strokeWidth="1.2" />
      <text x="82" y="128" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(15)}>
        λ
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 10 Molekulová fyzika a termodynamika */
export function Thermo(c: Ctx) {
  const mols: [number, number, number, number][] = [
    [56, 112, 7, -4],
    [78, 124, -6, 5],
    [102, 110, 6, 6],
    [64, 146, 7, 3],
    [90, 150, -7, -3],
    [110, 136, -4, -7],
    [52, 132, 5, -6],
    [84, 100, 7, -2],
  ]
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* gas */}
      <path d="M44 86H120V160H44Z" fill={c.L} fillOpacity="0.14" stroke="none" />
      {mols.map(([x, y, vx, vy], i) => (
        <G key={i} cls="a-jiggle" delay={-i * 0.37} style={{ animationDuration: `${1.1 + (i % 3) * 0.25}s` }}>
          <Arrow x1={x} y1={y} x2={x + vx * 1.5} y2={y + vy * 1.5} color={INK} w={1.1} head={4} />
          <Ball x={x} y={y} r={5} fill={c.L} sw={1.4} />
        </G>
      ))}
      {/* cylinder walls */}
      <path d="M38 62V168H126V62H120V160H44V62Z" fill="var(--surface)" />
      <path d="M38 62V168H126V62H120V160H44V62Z" fill={c.hx} stroke="none" />
      <path d="M38 62V168H126V62H120V160H44V62Z" />
      {/* piston */}
      <G cls="a-piston">
        <path d="M78 86V36M76 36h8" strokeWidth="5" />
        <path d="M80 86V38" stroke="var(--surface)" strokeWidth="1.6" />
        <rect x="62" y="24" width="36" height="12" rx="2" fill={c.L} fillOpacity="0.85" />
        <rect x="62" y="24" width="36" height="12" rx="2" fill={c.hi} stroke="none" />
        <rect x="62" y="24" width="36" height="12" rx="2" />
        <rect x="44" y="76" width="76" height="12" fill={c.L} fillOpacity="0.85" />
        <rect x="44" y="76" width="76" height="12" fill={c.hi} stroke="none" />
        <rect x="44" y="76" width="76" height="12" />
        <path d="M44 80h76M44 84h76" {...detail} strokeOpacity="0.6" />
      </G>
      {/* thermometer */}
      <path d="M150 140V50a6 6 0 0 1 12 0V140" fill="var(--surface)" />
      <path d="M153.5 146V78h5V146" fill="#c8453a" stroke="none" />
      <circle cx="156" cy="152" r="11" fill="#c8453a" />
      <path d="M150 140V50a6 6 0 0 1 12 0V142" />
      <path d="M152 148a5 5 0 0 1 4-3" stroke={PAPER} strokeOpacity="0.8" strokeWidth="1.4" />
      <path d={Array.from({ length: 8 }, (_, i) => `M162 ${58 + i * 10}h${i % 2 ? 4 : 7}`).join('')} strokeWidth="1.2" />
      <text x="174" y="68" fill={labelFill(c)} stroke="none" style={labelFont(15)}>
        T
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 11 Elektřina a magnetismus */
export function EM(c: Ctx) {
  const turns = Array.from({ length: 7 }, (_, i) => 84 + i * 7.6)
  const cy = 82
  const ry = 20
  const rx = 5.5
  const back = turns.map((x) => `M${x} ${cy - ry}a${rx} ${ry} 0 0 1 0 ${2 * ry}`).join('')
  const front = turns.map((x) => `M${x} ${cy + ry}a${rx} ${ry} 0 0 1 0 ${-2 * ry}`).join('')
  const gx = 110
  const gy = 150
  const scale = Array.from({ length: 7 }, (_, i) => {
    const a = ((-54 + i * 18) * Math.PI) / 180
    const r1 = i === 3 ? 13 : 16
    return `M${(gx + r1 * Math.sin(a)).toFixed(1)} ${(gy - r1 * Math.cos(a)).toFixed(1)}L${(gx + 20 * Math.sin(a)).toFixed(1)} ${(gy - 20 * Math.cos(a)).toFixed(1)}`
  }).join('')
  return (
    <>
      {/* leads */}
      <path d={`M84 ${cy + ry}V142a6 6 0 0 0 6 6h2M130 ${cy + ry}V142a6 6 0 0 1-6 6h-2`} strokeWidth="2.2" />
      {/* coil, back halves */}
      <path d={back} stroke={c.L} strokeWidth="2.2" strokeOpacity="0.45" />
      {/* magnet sliding in and out, with its field */}
      <G cls="a-slide">
        <path d="M66 74C60 50 22 50 16 74M66 90C60 114 22 114 16 90" stroke={c.L} strokeWidth="1.3" strokeDasharray="3 3" />
        <rect x="16" y="74" width="25" height="16" fill="var(--surface)" />
        <rect x="16" y="74" width="25" height="16" fill={c.hx} stroke="none" />
        <rect x="41" y="74" width="25" height="16" fill="#c8453a" />
        <rect x="16" y="74" width="50" height="16" />
        <text x="28.5" y="86" textAnchor="middle" fill="var(--ink)" stroke="none" style={{ font: '700 10px var(--font-body)' }}>
          S
        </text>
        <text x="53.5" y="86" textAnchor="middle" fill={PAPER} stroke="none" style={{ font: '700 10px var(--font-body)' }}>
          N
        </text>
      </G>
      {/* coil, front halves */}
      <path d={front} stroke={INK} strokeWidth="4.4" />
      <path d={front} stroke={c.L} strokeWidth="2.4" />
      {/* galvanometer */}
      <circle cx={gx} cy={gy} r="26" fill="var(--surface)" />
      <path d={`M${gx - 26} ${gy}a26 26 0 1 0 52 0a26 26 0 1 0-52 0ZM${gx - 22} ${gy}a22 22 0 1 0 44 0a22 22 0 1 0-44 0Z`} fill={c.hl} fillRule="evenodd" stroke="none" />
      <circle cx={gx} cy={gy} r="26" />
      <circle cx={gx} cy={gy} r="22" strokeWidth="1.2" />
      <path d={scale} strokeWidth="1.2" />
      <G cls="a-swing" origin={`${gx}px ${gy + 6}px`} delay={-1} style={{ ['--swing' as string]: '30deg', animationDuration: '4s' }}>
        <path d={`M${gx} ${gy + 6}V${gy - 15}`} stroke={c.L} strokeWidth="2.2" />
      </G>
      <circle cx={gx} cy={gy + 6} r="2.6" fill={INK} stroke="none" />
      <text x={gx} y={gy + 18} textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(11)}>
        G
      </text>
      <Arrow x1={84} y1={108} x2={84} y2={130} color={c.L} w={2.4} head={7} />
      <text x="74" y="126" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(16)}>
        I
      </text>
      <circle cx="92" cy="148" r="2.4" fill={INK} stroke="none" />
      <circle cx="128" cy="148" r="2.4" fill={INK} stroke="none" />
    </>
  )
}

/* ---------------------------------------------------------------- 12 Optika a moderní fyzika */
export function Modern(c: Ctx) {
  const ax = 52
  const ay = 100
  const photon = pathOf(40, (t) => [98 + t * 20, ay - 5 * Math.sin(t * Math.PI * 4)])
  const slit = [92, 108]
  const fringes = Array.from({ length: 9 }, (_, j) => j - 4)
  const arcs = (sy: number) =>
    [10, 19, 28]
      .map((r) => {
        const a = (50 * Math.PI) / 180
        return `M${(128 + r * Math.cos(a)).toFixed(1)} ${(sy - r * Math.sin(a)).toFixed(1)}A${r} ${r} 0 0 1 ${(128 + r * Math.cos(a)).toFixed(1)} ${(sy + r * Math.sin(a)).toFixed(1)}`
      })
      .join('')
  return (
    <>
      {/* star */}
      <G cls="a-twinkle">
        <Star x={150} y={34} r={11} fill="var(--yellow)" />
      </G>
      <g className="a-glow" style={{ animationDelay: '1.2s' }}>
        <Star x={108} y={44} r={4} fill="var(--yellow)" />
      </g>
      {/* atom */}
      {[15, 27, 38].map((r) => (
        <circle key={r} cx={ax} cy={ay} r={r} strokeWidth="1.2" strokeOpacity={r === 15 ? 0.85 : 0.65} />
      ))}
      <G cls="a-spin" origin={`${ax}px ${ay}px`}>
        <circle cx={ax} cy={ay - 27} r="4.6" fill={c.L} strokeWidth="1.4" />
      </G>
      <path d={`M${ax + 29} ${ay - 24}q3 8-4 12`} stroke={c.L} strokeWidth="1.6" strokeDasharray="2 2.5" />
      <circle cx={ax + 15} cy={ay} r="4.6" fill={c.L} strokeWidth="1.4" />
      <Ball x={ax} y={ay} r={8} fill={c.L} />
      {/* photon */}
      <G cls="a-emit">
        <path d={photon} stroke={c.L} strokeWidth="2.2" />
        <Arrow x1={116} y1={ay} x2={122} y2={ay} color={c.L} w={2.2} head={6} />
      </G>
      <text x="104" y="86" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(14)}>
        hf
      </text>
      {/* double slit */}
      <path d={`M125 50H131V${slit[0] - 3}H125ZM125 ${slit[0] + 3}H131V${slit[1] - 3}H125ZM125 ${slit[1] + 3}H131V150H125Z`} fill="var(--surface)" />
      <path d={`M125 50H131V${slit[0] - 3}H125ZM125 ${slit[0] + 3}H131V${slit[1] - 3}H125ZM125 ${slit[1] + 3}H131V150H125Z`} fill={c.hx} stroke="none" />
      <path d={`M125 50H131V${slit[0] - 3}H125ZM125 ${slit[0] + 3}H131V${slit[1] - 3}H125ZM125 ${slit[1] + 3}H131V150H125Z`} strokeWidth="1.6" />
      <path d={arcs(slit[0]) + arcs(slit[1])} stroke={c.L} strokeWidth="1.4" strokeOpacity="0.7" />
      {/* screen with fringes */}
      <rect x="164" y="58" width="9" height="84" fill="var(--surface)" />
      {fringes.map((j) => (
        <rect key={j} x="164" y={100 + j * 9 - 3} width="9" height="6" fill={c.L} fillOpacity={Math.max(0.15, 1 - Math.abs(j) * 0.22)} stroke="none" />
      ))}
      <rect x="164" y="58" width="9" height="84" strokeWidth="1.6" />
    </>
  )
}
