import { Ball, Cloud, Conifer, G, GEO, Globe, INK, PAPER, Person, PlateClip, Star, Tree, detail, f, labelFill, labelFont, pathOf, plateBand, waveD, type Ctx } from './kit'

/* Geography vignettes 1–9 (ZŠ). */

/* ---------------------------------------------------------------- 1 Mapa a orientace */
export function MapCompass(c: Ctx) {
  const ridge = 'M8 128C36 122 54 110 78 106S118 84 150 70C164 72 178 82 192 94'
  return (
    <>
      <PlateClip>
        {/* distant ridge */}
        <path d="M8 114C28 102 50 104 68 96S98 84 118 80V120H8Z" fill={c.hi} stroke="none" />
        <path d="M8 114C28 102 50 104 68 96S98 84 118 80" strokeWidth="1.2" strokeOpacity="0.6" />
        {/* the ridge the hiker stands on */}
        <path d={`${ridge}V200H8Z`} fill={GEO.meadow} stroke="none" />
        <path d="M150 70C164 72 178 82 192 94V200H150Z" fill={c.hi} stroke="none" />
        <path d={ridge} />
        <path d="M24 136c6-2 10-2 14 0M90 112c5-2 9-2 12 0M170 104c4 2 8 2 12 0" {...detail} strokeOpacity="0.6" />
      </PlateClip>
      <Cloud x={54} y={56} w={36} hatch={c.hi} />
      <Conifer x={30} y={127} h={17} />
      <Conifer x={42} y={124} h={23} hatch={c.hi} />
      <Conifer x={180} y={90} h={18} hatch={c.hi} />
      {/* marked trail up the ridge */}
      <path d="M66 140C84 126 98 112 118 92" stroke={GEO.red} strokeWidth="1.6" strokeDasharray="2.5 3.5" />
      {/* KČT signpost: white arrows with the white–red–white mark */}
      <path d="M124 86V48" strokeWidth="2.6" />
      <rect x="115" y="44" width="18" height="6" fill={PAPER} strokeWidth="1.1" />
      <path d="M118 47h12" strokeWidth="0.8" strokeOpacity="0.55" />
      <path d="M125 54h21l4.5 3.5-4.5 3.5h-21Z" fill={PAPER} strokeWidth="1.1" />
      <rect x="140" y="55.5" width="4" height="4" fill={PAPER} strokeWidth="0.6" />
      <rect x="140" y="56.8" width="4" height="1.4" fill={GEO.red} stroke="none" />
      <path d="M128 57.5h9" strokeWidth="0.8" strokeOpacity="0.55" />
      <path d="M123 64h-20l-4.5 3.5 4.5 3.5h20Z" fill={PAPER} strokeWidth="1.1" />
      <rect x="104" y="65.5" width="4" height="4" fill={PAPER} strokeWidth="0.6" />
      <rect x="104" y="66.8" width="4" height="1.4" fill="var(--blue)" stroke="none" />
      <path d="M111 67.5h9" strokeWidth="0.8" strokeOpacity="0.55" />
      {/* hiker on the crest */}
      <Person x={160} y={72} s={1.15} fill={c.L} pack={GEO.ochre} stick />
      {/* unfolded map in the foreground */}
      <path d="M28 150L112 138L122 177L42 190Z" fill="var(--surface)" strokeWidth="1.8" />
      <path d="M70 144L112 138L122 177L82 183.5Z" fill={c.hi} fillOpacity="0.55" stroke="none" />
      <path d="M70 144L82 183.5M35 170L117 157.5" strokeWidth="1" strokeOpacity="0.6" />
      <g transform="rotate(-9 64 166)" stroke={c.L}>
        <ellipse cx="64" cy="166" rx="22" ry="10" strokeWidth="1.3" />
        <ellipse cx="66" cy="165" rx="14" ry="6" strokeWidth="1.3" />
        <ellipse cx="67" cy="164.5" rx="6" ry="2.6" strokeWidth="1.3" fill={c.L} fillOpacity="0.35" />
      </g>
      <path d="M32 160c10 2 14 10 22 14s14 2 24 12" stroke="var(--blue)" strokeWidth="1.6" />
      <path d="M50 186C62 172 74 160 104 150" stroke={GEO.red} strokeWidth="1.3" strokeDasharray="2 2.5" />
      {/* compass */}
      <circle cx="122" cy="170" r="19" fill={c.L} />
      <circle cx="122" cy="170" r="19" fill={c.hi} stroke="none" />
      <circle cx="122" cy="170" r="19" />
      <circle cx="122" cy="170" r="15" fill="var(--surface)" strokeWidth="1.4" />
      <path d="M122 156.5v3M122 180.5v3M108.5 170h3M132.5 170h3M112.5 160.5l1.6 1.6M131.5 160.5l-1.6 1.6M112.5 179.5l1.6-1.6M131.5 179.5l-1.6-1.6" strokeWidth="1.1" />
      <G cls="a-swing" origin="122px 170px" style={{ ['--swing' as string]: '9deg', animationDuration: '4.2s' }}>
        <path d="M122 158l3.4 12h-6.8Z" fill={GEO.red} strokeWidth="1.1" />
        <path d="M122 182l3.4-12h-6.8Z" fill="var(--surface)" strokeWidth="1.1" />
      </G>
      <circle cx="122" cy="170" r="1.8" fill={INK} stroke="none" />
      <text x="122" y="148" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(11)}>
        S
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 2 Země ve vesmíru */
export function EarthSun(c: Ctx) {
  const [sx, sy, sr] = [62, 68, 22]
  const [ex, ey, er] = [128, 120, 38]
  const tilt = 23.4
  const th = Math.atan2(sy - ey, sx - ex)
  const p1 = [ex + er * Math.cos(th + Math.PI / 2), ey + er * Math.sin(th + Math.PI / 2)]
  const p2 = [ex + er * Math.cos(th - Math.PI / 2), ey + er * Math.sin(th - Math.PI / 2)]
  const night = `M${f(p1[0])} ${f(p1[1])}A${er} ${er} 0 0 1 ${f(p2[0])} ${f(p2[1])}Z`
  const t = (tilt * Math.PI) / 180
  const R = er + 15
  const top = [ex + R * Math.sin(t), ey - R * Math.cos(t)]
  const bot = [ex - R * Math.sin(t), ey + R * Math.cos(t)]
  const arcEnd = [ex + (er + 11) * Math.sin(t), ey - (er + 11) * Math.cos(t)]
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    return `M${f(sx + (sr + 5) * Math.cos(a))} ${f(sy + (sr + 5) * Math.sin(a))}L${f(sx + (sr + 12) * Math.cos(a))} ${f(sy + (sr + 12) * Math.sin(a))}`
  }).join('')
  return (
    <>
      {/* stars */}
      <g className="a-twinkle">
        <Star x={28} y={128} r={3.2} fill="var(--yellow)" />
      </g>
      <g className="a-twinkle" style={{ animationDelay: '1.4s' }}>
        <Star x={168} y={40} r={3.6} fill="var(--yellow)" />
      </g>
      <Star x={112} y={28} r={2.4} fill="var(--yellow)" />
      <Star x={42} y={156} r={2.2} fill="var(--yellow)" />
      <Star x={178} y={150} r={2.6} fill="var(--yellow)" />
      <circle cx="96" cy="44" r="1.1" fill={INK} stroke="none" />
      <circle cx="150" cy="22" r="1" fill={INK} stroke="none" />
      <circle cx="22" cy="96" r="1.1" fill={INK} stroke="none" />
      <circle cx="66" cy="176" r="1" fill={INK} stroke="none" />
      {/* orbit */}
      <ellipse cx="80" cy="88" rx="64" ry="22" transform="rotate(28 80 88)" strokeWidth="1.2" strokeDasharray="3 4" strokeOpacity="0.7" />
      {/* Sun */}
      <path className="a-glow" d={rays} stroke="var(--yellow)" strokeWidth="2.4" />
      <circle cx={sx} cy={sy} r={sr} fill="var(--yellow)" />
      <circle cx={sx} cy={sy} r={sr - 5} strokeWidth="1" strokeOpacity="0.45" />
      <path d={`M${sx - 14} ${sy - 4}a15 15 0 0 1 10-11`} stroke={PAPER} strokeOpacity="0.8" strokeWidth="2.2" />
      {/* Earth: lit half, night half, tilted axis */}
      <Globe cx={ex} cy={ey} r={er} tilt={tilt}>
        <path d={night} fill={c.hx} stroke="none" />
        <path d={night} fill={INK} fillOpacity="0.12" stroke="none" />
      </Globe>
      <path d={`M${ex} ${ey - er - 2}V${ey - er - 16}`} strokeWidth="1" strokeDasharray="2 2.5" strokeOpacity="0.7" />
      <path d={`M${ex} ${f(ey - er - 11)}A${er + 11} ${er + 11} 0 0 1 ${f(arcEnd[0])} ${f(arcEnd[1])}`} stroke={c.L} strokeWidth="1.3" />
      <path d={`M${f(top[0])} ${f(top[1])}L${f(bot[0])} ${f(bot[1])}`} stroke={c.L} strokeWidth="2.6" />
      <circle cx={f(top[0])} cy={f(top[1])} r="2.2" fill={c.L} stroke="none" />
      <g transform={`translate(${f(ex + (er + 6) * Math.sin(t))} ${f(ey - (er + 6) * Math.cos(t))}) rotate(${tilt})`}>
        <path d="M-8 0A8 2.6 0 0 0 8 0" stroke={c.L} strokeWidth="1.4" />
        <path d="M8 0l-1-4M8 0l-4 1.4" stroke={c.L} strokeWidth="1.4" />
      </g>
      {/* Moon */}
      <G cls="a-bob" delay={0.6}>
        <Ball x={170} y={76} r={7} fill="var(--surface)" sw={1.5} />
        <path d="M170 69a7 7 0 0 1 0 14a9 9 0 0 0 0-14Z" fill={c.hx} stroke="none" />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 3 Reliéf Země */
export function Relief(c: Ctx) {
  const fold = (base: number, amp: number) => (t: number): [number, number] => {
    const x = t * 200
    return [x, base + amp * Math.sin(((x - 30) / 150) * Math.PI * 2)]
  }
  const curve = (base: number) => pathOf(50, fold(base, 7))
  const band = (b0: number | null, b1: number) => {
    const top = b0 === null ? 'M0 131H200' : curve(b0)
    const bottom = pathOf(50, (t) => fold(b1, 7)(1 - t)).replace(/^M/, 'L')
    return `${top}${bottom}Z`
  }
  return (
    <>
      <PlateClip>
        {/* folded strata cut by the land surface */}
        <path d={band(null, 144)} fill={c.L} fillOpacity="0.3" stroke="none" />
        <path d={band(144, 158)} fill={c.hl} stroke="none" />
        <path d={band(158, 172)} fill={GEO.rock} stroke="none" />
        <path d={band(158, 172)} fill={c.hi} stroke="none" />
        <path d={band(172, 186)} fill={c.L} fillOpacity="0.18" stroke="none" />
        <path d={band(186, 230)} fill={c.hx} stroke="none" />
        <path d={`${curve(144)}${curve(158)}${curve(172)}${curve(186)}`} strokeWidth="1.3" />
        <path d="M24 152h5M150 140h6M120 168h5M70 178h6M168 176h4" {...detail} strokeOpacity="0.55" />
        {/* magma chamber feeding the volcano */}
        <path d="M30 172c2-10 16-14 26-12 12 2 20 8 16 16-4 7-18 8-28 6-10-1-16-4-14-10Z" fill={GEO.red} />
        <path d="M30 172c2-10 16-14 26-12 12 2 20 8 16 16-4 7-18 8-28 6-10-1-16-4-14-10Z" fill={c.hi} stroke="none" />
      </PlateClip>
      {/* volcano */}
      <path d="M8 131C26 112 40 88 47 70h16c7 18 21 42 41 61Z" fill="var(--surface)" />
      <path d="M55 70h8c7 18 21 42 41 61H55Z" fill={c.hi} stroke="none" />
      <path d="M8 131C26 112 40 88 47 70h16c7 18 21 42 41 61Z" />
      <path d="M53 160V74" stroke={GEO.red} strokeWidth="3.4" />
      <path d="M47 70c3 3 13 3 16 0" stroke={GEO.red} strokeWidth="2.2" />
      <path d="M49 73c-4 10-6 16-12 26-3 5-4 9-3 14M58 74c3 8 4 14 10 22" stroke={GEO.red} strokeWidth="2" />
      <path d="M8 131H104" strokeWidth="2" />
      {/* ash cloud */}
      <G cls="a-drift" style={{ animationDuration: '7s' }}>
        <circle cx="54" cy="56" r="8" fill={GEO.rock} strokeWidth="1.3" />
        <circle cx="66" cy="46" r="10" fill={GEO.rock} strokeWidth="1.3" />
        <circle cx="80" cy="38" r="8" fill={GEO.rock} strokeWidth="1.3" />
        <circle cx="66" cy="46" r="10" fill={c.hi} stroke="none" />
      </G>
      {/* folded mountains */}
      <path d="M98 131L116 98L124 106L144 58L158 86L166 78L192 131Z" fill="var(--surface)" />
      <path d="M144 58L158 86L166 78L192 131H150Z" fill={c.hi} stroke="none" />
      <path d="M124 106L144 58L150 131H116Z" fill={c.L} fillOpacity="0.12" stroke="none" />
      <path d="M98 131L116 98L124 106L144 58L158 86L166 78L192 131" />
      <path d="M136.5 76L144 58L151.5 72L147.5 69L144 75L140.5 71Z" fill={PAPER} strokeWidth="1.2" />
      <path d="M112 106l4-8 4 4-2 1-2-2Z" fill={PAPER} strokeWidth="1" />
      <path d="M120 118l8-10M132 124l10-24M160 104l6 10M172 112l6 8" {...detail} strokeOpacity="0.6" />
      <path d="M104 131H192" strokeWidth="2" />
    </>
  )
}

/* ---------------------------------------------------------------- 4 Podnebí, vody a krajinné pásy */
export function ClimateLake(c: Ctx) {
  const precip = [14, 10, 9, 15, 30, 56, 78, 72, 46, 22, 16, 16]
  const temp = [-17.5, -14.5, -6, 2.5, 9.5, 15.5, 18, 16, 9, 1.5, -8, -15]
  const bx = (i: number) => 44 + i * 5.4
  const tempLine = pathOf(11, (u) => {
    const i = Math.round(u * 11)
    return [bx(i) + 1.9, 70 - temp[i] * 1.15]
  })
  const conifers = [14, 22, 30, 38, 48, 58, 66, 76, 86, 96, 106]
  return (
    <>
      <PlateClip>
        {/* far shore: mountains and taiga */}
        <path d="M108 130L134 94L144 104L162 84L196 126V130Z" fill="var(--surface)" />
        <path d="M162 84L196 126V130H150Z" fill={c.hi} stroke="none" />
        <path d="M108 130L134 94L144 104L162 84L196 126" />
        <path d="M156 92L162 84L168 92L165 90L162 94L159 90Z" fill={PAPER} strokeWidth="1" />
        <path d="M4 130C18 116 36 110 56 116C72 106 92 104 112 122L116 130Z" fill={GEO.forestLight} stroke="none" />
        <path d="M4 130C18 116 36 110 56 116C72 106 92 104 112 122L116 130Z" fill={c.hi} stroke="none" />
        <path d="M4 130C18 116 36 110 56 116C72 106 92 104 112 122" strokeWidth="1.4" />
        {conifers.map((x, i) => (
          <Conifer key={x} x={x} y={131} h={11 + ((i * 5) % 7)} hatch={i % 2 ? c.hi : undefined} />
        ))}
        {/* the lake */}
        <path d={plateBand(130, 196, 92)} fill={GEO.lake} stroke="none" />
        <path d="M8 130H192" strokeWidth="2" />
        <path d={`${waveD(30, 80, 146)}${waveD(110, 170, 152)}${waveD(46, 120, 166, 1.4, 12)}${waveD(70, 140, 182, 1.4, 12)}`} strokeWidth="1.1" strokeOpacity="0.65" />
        <path d="M20 138h22M60 140h30M128 138h18M150 140h26" stroke={PAPER} strokeOpacity="0.55" strokeWidth="1.2" />
      </PlateClip>
      {/* a klimatogram drawn on the sky */}
      <path d="M40 40V96H110" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M37 50h3M37 68h3M37 86h3" strokeWidth="1" strokeOpacity="0.6" />
      {precip.map((p, i) => (
        <rect key={i} x={bx(i)} y={96 - p * 0.5} width="3.8" height={p * 0.5} fill="var(--blue)" fillOpacity="0.55" strokeWidth="0.8" />
      ))}
      <path d={tempLine} stroke="var(--bad)" strokeWidth="2" />
      {/* rain cloud over the lake */}
      <path className="a-flow" d="M136 76l-6 50M148 76l-6 50M160 76l-6 50M172 76l-6 44" stroke="var(--blue)" strokeWidth="1.5" strokeDasharray="4 6" />
      <Cloud x={152} y={76} w={58} fill="var(--surface)" hatch={c.hi} />
      <path d="M128 74h48" stroke={c.L} strokeWidth="2.4" />
      <Cloud x={92} y={40} w={26} />
    </>
  )
}

/* ---------------------------------------------------------------- 5 Lidé na Zemi */
type Gable = 'tri' | 'step' | 'curve'
function Facade({ x, w, top, gable, wall, c }: { x: number; w: number; top: number; gable: Gable; wall: string; c: Ctx }) {
  const base = 140
  const g =
    gable === 'tri'
      ? `L${x + w / 2} ${top - w * 0.55}`
      : gable === 'step'
        ? `V${top - 6}h5v-6h5v-6h${w - 20}v6h5v6h5`
        : `C${x + 1} ${top - 9} ${x + w * 0.3} ${top - 7} ${x + w * 0.32} ${top - 14}L${x + w * 0.38} ${top - 20}h${w * 0.24}L${x + w * 0.68} ${top - 14}C${x + w * 0.7} ${top - 7} ${x + w - 1} ${top - 9} ${x + w} ${top}`
  const d = `M${x} ${base}V${top}${g}${gable === 'tri' ? `L${x + w} ${top}` : ''}V${base}Z`
  const win = (wx: number, wy: number) => `M${wx} ${wy}h5v7h-5Z`
  const cols = [x + w * 0.25 - 2.5, x + w * 0.75 - 2.5]
  const rows = [top + 7, top + 22].filter((y) => y + 7 < 122)
  const arch = (ax: number, aw: number) => `M${f(ax)} 140V131a${f(aw / 2)} ${f(aw / 2)} 0 0 1 ${f(aw)} 0V140Z`
  return (
    <g>
      <path d={d} fill={wall} strokeWidth="1.6" />
      {gable === 'tri' && <path d={`M${x} ${top}L${x + w / 2} ${top - w * 0.55}L${x + w} ${top}Z`} fill={c.hi} stroke="none" />}
      <path d={`M${x} ${top}H${x + w}M${x} 124H${x + w}`} strokeWidth="1.1" />
      <path d={rows.flatMap((y) => cols.map((cx) => win(cx, y))).join('')} fill={c.hx} strokeWidth="1" />
      {gable !== 'tri' && <circle cx={x + w / 2} cy={top - 7} r="2.2" strokeWidth="1" />}
      <path d={`${arch(x + 3, w / 2 - 5)}${arch(x + w / 2 + 2, w / 2 - 5)}`} fill={c.hx} strokeWidth="1.1" />
    </g>
  )
}
export function TownSquare(c: Ctx) {
  const mixL = (p: number) => `color-mix(in srgb, ${c.L} ${p}%, var(--surface))`
  return (
    <>
      <PlateClip>
        <path d={plateBand(140, 196, 92)} fill={GEO.sand} stroke="none" />
        <path d="M100 140L40 196M100 140L70 196M100 140L130 196M100 140L160 196M8 156H192M8 176H192" strokeWidth="0.9" strokeOpacity="0.4" />
      </PlateClip>
      {/* town hall tower */}
      <path d="M93 94V44h16v50Z" fill={GEO.wall} />
      <path d="M101 44h8v50h-8Z" fill={c.hi} stroke="none" />
      <path d="M93 94V44h16v50Z" />
      <path d="M90 44h22l-3-5H93Z" fill={GEO.roof} strokeWidth="1.4" />
      <path d="M93 39l8-22 8 22Z" fill={GEO.roof} />
      <path d="M101 17l8 22h-8Z" fill={c.hi} stroke="none" />
      <path d="M93 39l8-22 8 22Z" />
      <circle cx="101" cy="15" r="2" fill="var(--yellow)" strokeWidth="1" />
      <circle cx="101" cy="56" r="5.5" fill={PAPER} strokeWidth="1.3" />
      <G cls="a-tick" origin="101px 56px">
        <path d="M101 56v-4" strokeWidth="1.2" />
      </G>
      <path d="M101 56h2.6" strokeWidth="1.2" />
      <path d="M97 68h8v8h-8Z" fill={c.hx} strokeWidth="1" />
      {/* houses round the square */}
      <Facade x={16} w={34} top={84} gable="tri" wall={GEO.fieldPale} c={c} />
      <Facade x={50} w={34} top={70} gable="step" wall={mixL(30)} c={c} />
      <Facade x={84} w={34} top={94} gable="curve" wall={GEO.wall} c={c} />
      <Facade x={118} w={34} top={68} gable="curve" wall={GEO.meadow} c={c} />
      <Facade x={152} w={32} top={84} gable="tri" wall={GEO.fieldPale} c={c} />
      <path d="M12 140H188" strokeWidth="2" />
      {/* fountain */}
      <ellipse cx="100" cy="164" rx="20" ry="5.5" fill={GEO.lake} />
      <path d="M80 164v5a20 5.5 0 0 0 40 0v-5" fill="var(--surface)" />
      <path d="M80 164v5a20 5.5 0 0 0 40 0v-5" fill={c.hi} stroke="none" />
      <path d="M80 164v5a20 5.5 0 0 0 40 0v-5" />
      <path d="M100 164v-16" strokeWidth="2.4" />
      <path className="a-flow" d="M100 148c-4-2-8 2-10 12M100 148c4-2 8 2 10 12" stroke="var(--blue)" strokeWidth="1.3" strokeDasharray="3 2" />
      {/* people */}
      <Person x={50} y={172} s={1.15} fill={c.L} />
      <Person x={63} y={174} s={0.75} fill={GEO.field} />
      <path d="M54.5 156c2 2 4 3 6.5 3.5" strokeWidth="1.3" />
      <Person x={132} y={176} s={1.2} fill={GEO.blue} flip />
      <Person x={150} y={170} s={1.05} fill={GEO.teal} />
      <Person x={84} y={186} s={1.1} fill={GEO.ochre} />
    </>
  )
}

/* ---------------------------------------------------------------- 6 Hospodářství světa */
function Box({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width="13" height="8" fill={fill} strokeWidth="1.1" />
      <path d={`M${x + 3.2} ${y + 1.5}v5M${x + 6.5} ${y + 1.5}v5M${x + 9.8} ${y + 1.5}v5`} strokeWidth="0.7" strokeOpacity="0.6" />
    </g>
  )
}
export function Port(c: Ctx) {
  const cols = [GEO.red, GEO.blue, c.L, GEO.teal, GEO.ochre, GEO.field]
  const truss = Array.from({ length: 18 }, (_, i) => `M${26 + i * 8} 51L${30 + i * 8} 57L${34 + i * 8} 51`).join('')
  return (
    <>
      <Cloud x={150} y={36} w={34} />
      <PlateClip>
        {/* water */}
        <path d={plateBand(142, 196, 92)} fill={GEO.sea} stroke="none" />
        <path d={`${waveD(96, 186, 156)}${waveD(20, 120, 168, 1.5, 12)}${waveD(50, 160, 182, 1.5, 12)}`} strokeWidth="1.1" strokeOpacity="0.6" />
        {/* quay */}
        <path d="M0 132H92V146H0Z" fill="var(--surface)" />
        <path d="M0 138H92V146H0Z" fill={c.hx} stroke="none" />
        <path d="M0 132H92V146" />
      </PlateClip>
      {/* stacked containers on the quay */}
      {[0, 1, 2].map((row) =>
        [0, 1].map((k) => (row === 2 && k === 1 ? null : <Box key={`${row}${k}`} x={16 + k * 14} y={124 - row * 8} fill={cols[(row * 2 + k) % 6]} />)),
      )}
      {/* gantry crane */}
      <path d="M50 132V58M80 132V58M50 92H80M50 60H80M50 92l30 32M80 92l-30 32" strokeWidth="2" />
      <path d="M46 132h8M76 132h8" strokeWidth="3" />
      <path d="M24 51H174M24 57H174" strokeWidth="2" />
      <path d={truss} strokeWidth="0.9" strokeOpacity="0.7" />
      <path d="M58 51V28h14v23" fill={c.L} fillOpacity="0.25" strokeWidth="1.8" />
      <path d="M65 28L24 51M65 28L174 51" strokeWidth="1.2" />
      <rect x="40" y="40" width="12" height="10" fill={c.L} strokeWidth="1.4" />
      <rect x="122" y="57" width="12" height="5" fill={INK} stroke="none" />
      <G cls="a-piston" style={{ animationDuration: '4.4s' }}>
        <path d="M125 62v30M131 62v30" strokeWidth="0.9" />
        <path d="M120 92h16" strokeWidth="2" />
        <Box x={121.5} y={93} fill={GEO.teal} />
      </G>
      {/* container ship */}
      <path d="M94 128H190L184 148H104Z" fill={c.L} />
      <path d="M94 128H190L184 148H104Z" fill={c.hi} stroke="none" />
      <path d="M100.8 142H185.8L184 148H104Z" fill={GEO.red} stroke="none" />
      <path d="M94 128H190L184 148H104Z" />
      <path d="M98 133h88" strokeWidth="1" strokeOpacity="0.6" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <Box x={100 + k * 14} y={120} fill={cols[(k + 1) % 6]} />
          {k !== 2 && <Box x={100 + k * 14} y={112} fill={cols[(k + 4) % 6]} />}
        </g>
      ))}
      <path d="M160 128V98h16v30" fill="var(--surface)" />
      <path d="M168 98h8v30h-8Z" fill={c.hi} stroke="none" />
      <path d="M160 128V98h16v30" />
      <path d="M157 98h22" strokeWidth="2.2" />
      <path d="M163 104h3v3h-3ZM170 104h3v3h-3ZM163 112h3v3h-3ZM170 112h3v3h-3Z" fill={c.hx} strokeWidth="0.8" />
      <path d="M166 98v-8h6v8" fill={GEO.ochre} strokeWidth="1.3" />
      {/* gulls */}
      <path d="M100 30c3-3 5-3 7 0 2-3 4-3 7 0M124 24c2-2 4-2 5 0 1-2 3-2 5 0" strokeWidth="1.3" />
    </>
  )
}

/* ---------------------------------------------------------------- 7 Regiony světa */
export function Rainforest(c: Ctx) {
  const leftBank = 'M95 94C84 104 112 116 86 128C62 140 76 168 24 200'
  const rightBank = 'M105 94C98 104 132 116 114 128C98 140 128 168 150 200'
  const river = `${leftBank}L150 200C128 168 98 140 114 128C132 116 98 104 105 94Z`
  return (
    <>
      <PlateClip>
        {/* sky haze and sun */}
        <circle cx="140" cy="50" r="14" fill="var(--yellow)" />
        <circle className="a-glow" cx="140" cy="50" r="20" stroke="var(--yellow)" strokeWidth="1.4" />
        <path d="M24 74h40M120 78h52" stroke={INK} strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="10 4" />
        {/* far forest wall */}
        <path d="M0 96C8 88 14 92 20 86C28 82 34 90 42 86C50 80 58 88 66 84C74 80 82 88 90 86C100 82 110 88 118 84C126 80 134 88 142 84C152 80 160 88 170 84C180 80 190 88 200 86V110H0Z" fill={GEO.forestLight} />
        <path d="M0 96C8 88 14 92 20 86C28 82 34 90 42 86C50 80 58 88 66 84C74 80 82 88 90 86C100 82 110 88 118 84C126 80 134 88 142 84C152 80 160 88 170 84C180 80 190 88 200 86V110H0Z" fill={c.hi} stroke="none" />
        {/* banks */}
        <path d={`${leftBank}L0 200V94Z`} fill={GEO.forest} stroke="none" />
        <path d={`${rightBank}L200 200V94Z`} fill={GEO.forest} stroke="none" />
        <path d={`${rightBank}L200 200V94Z`} fill={c.hi} stroke="none" />
        {/* river */}
        <path d={river} fill={GEO.lake} stroke="none" />
        <path d={`${leftBank}M${rightBank.slice(1)}`} strokeWidth="1.6" />
        <path className="a-flow" d="M100 100C96 108 116 116 100 128C84 140 96 164 84 196" stroke={PAPER} strokeOpacity="0.7" strokeWidth="1.3" strokeDasharray="6 4" />
        <path d={`${waveD(70, 104, 160, 1.2, 8)}${waveD(98, 130, 176, 1.2, 8)}`} strokeWidth="1" strokeOpacity="0.6" />
      </PlateClip>
      {/* canopy on both banks */}
      <Tree x={60} y={110} r={10} fill={GEO.forestLight} hatch={c.hi} />
      <Tree x={78} y={104} r={7} fill={GEO.forestLight} />
      <Tree x={130} y={108} r={8} fill={GEO.forestLight} hatch={c.hi} />
      <Tree x={146} y={112} r={10} fill={GEO.forestLight} />
      <Tree x={44} y={128} r={9} fill={GEO.forestLight} />
      <Tree x={70} y={126} r={8} fill={GEO.forestLight} hatch={c.hi} />
      <Tree x={128} y={128} r={8} fill={GEO.forestLight} />
      <Tree x={22} y={142} r={14} fill={GEO.forest} hatch={c.hi} />
      <Tree x={170} y={140} r={13} fill={GEO.forest} hatch={c.hi} />
      {/* emergent tree with an umbrella crown */}
      <path d="M40 150V62M40 96l-8-8M40 84l8-6" strokeWidth="2.4" />
      <path d="M14 64c4-10 14-14 26-14s22 4 26 14c-8 4-44 4-52 0Z" fill={GEO.forestLight} strokeWidth="1.5" />
      <path d="M40 50c12 0 22 4 26 14-8 2-18 3-26 3Z" fill={c.hi} stroke="none" />
      {/* palm */}
      <path d="M156 168c2-16 0-30-6-44" strokeWidth="2.6" />
      <G cls="a-sway" origin="150px 124px">
        <path d="M150 124c-8-6-18-6-26 0M150 124c-4-8-12-12-20-12M150 124c4-8 14-10 22-6M150 124c8-2 16 2 20 10M150 124c0-6 2-12 6-16" strokeWidth="5" />
        <path d="M150 124c-8-6-18-6-26 0M150 124c-4-8-12-12-20-12M150 124c4-8 14-10 22-6M150 124c8-2 16 2 20 10M150 124c0-6 2-12 6-16" stroke={GEO.forestLight} strokeWidth="2.8" />
        <path d="M150 124c-8-6-18-6-26 0M150 124c4-8 14-10 22-6M150 124c8-2 16 2 20 10" stroke={PAPER} strokeOpacity="0.45" strokeWidth="0.9" />
      </G>
      {/* dugout canoe */}
      <G cls="a-bob" delay={0.4}>
        <path d="M88 146h26c-2 4-6 5-13 5s-11-1-13-5Z" fill={GEO.ochre} strokeWidth="1.3" />
        <Person x={101} y={146} s={0.62} fill={c.L} />
        <path d="M106 132l6 18" strokeWidth="1.3" />
      </G>
      {/* foreground leaves */}
      <path d="M8 178c10-16 26-22 44-18-8 14-26 22-44 18Z" fill={GEO.forest} strokeWidth="1.5" />
      <path d="M8 178c14-6 28-12 44-18" strokeWidth="1" />
      <path d="M192 176c-12-14-28-18-44-12 10 12 28 18 44 12Z" fill={GEO.forestLight} strokeWidth="1.5" />
      <path d="M192 176c-14-4-30-8-44-12" strokeWidth="1" />
      {/* macaw */}
      <path d="M70 46c4-4 8-4 10 0 3-4 7-5 11-2" stroke={GEO.red} strokeWidth="2" />
    </>
  )
}

/* ---------------------------------------------------------------- 8 Evropa */
export function Danube(c: Ctx) {
  const hangers = Array.from({ length: 9 }, (_, i) => {
    const x = 66 + i * 8.5
    const t = (x - 58) / 84
    return `M${f(x)} ${f(100 + 96 * t * (1 - t) + 1)}V133`
  }).join('')
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    return [44 + 13 * Math.cos(a), 52 + 13 * Math.sin(a)] as const
  })
  const Tower = ({ x }: { x: number }) => (
    <g>
      <path d={`M${x - 10} 158V98h20v60Z`} fill="var(--surface)" />
      <path d={`M${x} 98h10v60h-10Z`} fill={c.hi} stroke="none" />
      <path d={`M${x - 10} 158V98h20v60Z`} />
      <path d={`M${x - 12} 98h24M${x - 11} 104h22`} strokeWidth="1.6" />
      <path d={`M${x - 5} 137V118a5 5 0 0 1 10 0V137Z`} fill={c.hx} strokeWidth="1.2" />
      <path d={`M${x - 12} 146h24`} strokeWidth="1.2" />
    </g>
  )
  return (
    <>
      <PlateClip>
        {/* Alps */}
        <path d="M0 108L28 80L38 90L62 52L76 72L90 62L112 98L128 72L140 82L160 44L180 74L200 92V124H0Z" fill="var(--surface)" />
        <path d="M62 52L76 72L90 62L112 98L100 124H62ZM160 44L180 74L200 92V124H160Z" fill={c.hi} stroke="none" />
        <path d="M0 108L28 80L38 90L62 52L76 72L90 62L112 98L128 72L140 82L160 44L180 74L200 92" />
        <path d="M54 64L62 52L69 62L65 60L62 65L58 61ZM152 56L160 44L167 54L163 52L160 57L156 53ZM85 70L90 62L95 70L92 68L90 71Z" fill={PAPER} strokeWidth="1.1" />
        {/* foothills with vineyards */}
        <path d="M0 116C30 104 60 112 100 106C140 100 170 110 200 104V140H0Z" fill={GEO.meadow} />
        <path d="M130 108l-8 20M138 106l-8 22M146 106l-8 22M154 106l-8 24" {...detail} strokeOpacity="0.5" />
        {/* the river */}
        <path d={plateBand(138, 196, 92)} fill={GEO.sea} stroke="none" />
        <path d="M0 138H200" strokeWidth="1.6" />
        <path d={`${waveD(14, 40, 164)}${waveD(80, 120, 172)}${waveD(150, 186, 162)}${waveD(40, 160, 184, 1.4, 12)}`} strokeWidth="1.1" strokeOpacity="0.6" />
      </PlateClip>
      {/* EU ring of stars */}
      {stars.map(([x, y], i) => (
        <Star key={i} x={x} y={y} r={2.9} fill="var(--yellow)" />
      ))}
      {/* chain bridge */}
      <path d="M8 133H192V138H8Z" fill={c.L} />
      <path d="M8 133H192V138H8Z" fill={c.hi} stroke="none" />
      <path d="M8 133H192M8 138H192" strokeWidth="1.6" />
      <path d={hangers} strokeWidth="0.9" />
      <path d="M18 126Q40 128 58 100M58 100Q100 148 142 100M142 100Q160 128 182 126" stroke={c.L} strokeWidth="2.6" />
      <path d="M58 100Q100 148 142 100" stroke={INK} strokeWidth="0.8" strokeOpacity="0.6" />
      <Tower x={58} />
      <Tower x={142} />
      {/* river boat */}
      <G cls="a-slide" style={{ animationDuration: '9s' }}>
        <path d="M78 168h34l-4 6H82Z" fill="var(--surface)" strokeWidth="1.4" />
        <path d="M84 168v-6h20v6" fill={GEO.red} strokeWidth="1.2" />
        <path d="M88 164.5h3M95 164.5h3" stroke={PAPER} strokeWidth="1.4" />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 9 Česko */
export function Snezka(c: Ctx) {
  const massif = 'M0 98C20 92 42 88 62 90C78 91 88 88 98 84C110 70 120 52 128 44h6C142 54 150 70 162 86C172 92 184 96 200 98'
  return (
    <>
      <Cloud x={46} y={54} w={32} hatch={c.hi} />
      <PlateClip>
        {/* Krkonoše ridge with Sněžka */}
        <path d={`${massif}V140H0Z`} fill={GEO.meadow} stroke="none" />
        <path d="M100 84C110 70 120 52 128 44h6C142 54 150 70 162 86C150 92 116 92 100 84Z" fill={GEO.rock} stroke="none" />
        <path d="M131 44h3C142 54 150 70 162 86C150 92 136 92 128 90Z" fill={c.hi} stroke="none" />
        <path d={massif} />
        <path d="M128 50c-2 8 6 10 2 18s6 10 4 20" stroke={GEO.red} strokeWidth="1.3" strokeDasharray="2 2.5" />
        {/* dwarf pine on the slopes */}
        <path d="M30 96c3-3 6-3 8 0M48 94c3-3 6-3 8 0M70 96c3-3 6-3 8 0M168 98c3-3 6-3 8 0M182 102c3-3 6-3 8 0" stroke={GEO.forest} strokeWidth="2.6" />
        {/* spruce forest */}
        <path d="M0 112C40 104 80 110 120 106C150 104 176 108 200 106V140H0Z" fill={GEO.forest} />
        <path d="M0 112C40 104 80 110 120 106C150 104 176 108 200 106V140H0Z" fill={c.hi} stroke="none" />
        {/* meadow in the foreground */}
        <path d="M0 134C40 126 80 128 120 132C150 135 176 130 200 128V200H0Z" fill={GEO.meadow} />
        <path d="M30 160c3-2 5-2 7 0M120 172c3-2 5-2 7 0M150 152c3-2 5-2 7 0M70 182c3-2 5-2 7 0" {...detail} strokeOpacity="0.6" />
      </PlateClip>
      {[16, 26, 36, 82, 92, 104, 114, 176, 186].map((x, i) => (
        <Conifer key={x} x={x} y={120 + (i % 3) * 3} h={12 + (i % 3) * 3} hatch={i % 2 ? c.hi : undefined} />
      ))}
      {/* chapel and observatory on the summit */}
      <path d="M124 44v-4h5v4" fill={PAPER} strokeWidth="1" />
      <path d="M123 40l3.5-4 3.5 4Z" fill={c.L} strokeWidth="1" />
      <path d="M132 44v-3h6v3" fill={PAPER} strokeWidth="1" />
      <ellipse cx="135" cy="40" rx="4.2" ry="1.6" fill={PAPER} strokeWidth="1" />
      <text x="146" y="40" fill={labelFill(c)} stroke="none" style={labelFont(11)}>
        1 603 m
      </text>
      {/* mountain hut */}
      <path d="M40 160V142h34v18Z" fill={GEO.wall} />
      <path d="M40 160V142h34v18Z" />
      <path d="M36 144L57 120L78 144Z" fill={c.L} />
      <path d="M57 120L78 144H57Z" fill={c.hi} stroke="none" />
      <path d="M36 144L57 120L78 144Z" />
      <path d="M46 147h6v6h-6ZM62 147h6v6h-6ZM54 134h6v5h-6Z" fill={c.hx} strokeWidth="1" />
      <path d="M68 130v-8h4v12" fill="var(--surface)" strokeWidth="1.2" />
      <G cls="a-drift" style={{ animationDuration: '5s' }}>
        <path d="M70 118c-3-4 3-6 0-10s3-6 0-10" strokeWidth="1.2" strokeOpacity="0.55" />
      </G>
      {/* foreground spruces */}
      <Conifer x={150} y={176} h={44} hatch={c.hi} />
      <Conifer x={170} y={166} h={32} />
      <Conifer x={22} y={170} h={26} hatch={c.hi} />
    </>
  )
}
