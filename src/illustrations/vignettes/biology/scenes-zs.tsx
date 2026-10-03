import { BIO, Ball, Finch, G, GLASS, Ground, Helix, INK, Leaf, PAPER, detail, labelFill, labelFont, pathOf, plateBand, type Ctx } from './kit'

/* Biology vignettes 1–8 (ZŠ). */

/* ---------------------------------------------------------------- 1 Život a buňka */
export function CellScope(c: Ctx) {
  const chloro = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2
    return [140 + 21 * Math.cos(a), 74 + 21 * Math.sin(a), (a * 180) / Math.PI + 90] as const
  })
  return (
    <>
      <Ground c={c} y={174} rx={74} />
      {/* base and arm */}
      <path d="M36 172h64l-5-12H41Z" fill={c.L} fillOpacity="0.85" />
      <path d="M36 172h64l-5-12H41Z" fill={c.hi} stroke="none" />
      <path d="M74 160c10-28 10-58-6-84l9-6c18 28 18 62 8 90Z" fill="var(--surface)" />
      <path d="M74 160c10-28 10-58-6-84l9-6c18 28 18 62 8 90Z" fill={c.hx} stroke="none" />
      <path d="M74 160c10-28 10-58-6-84l9-6c18 28 18 62 8 90Z" />
      <circle cx="84" cy="112" r="7" fill={c.L} />
      <circle cx="84" cy="112" r="2.4" fill={INK} stroke="none" />
      {/* tube, eyepiece and objective */}
      <g transform="rotate(-18 56 70)">
        <rect x="48" y="40" width="16" height="50" rx="2" fill="var(--surface)" />
        <rect x="56" y="40" width="8" height="50" fill={c.hl} stroke="none" />
        <rect x="48" y="40" width="16" height="50" rx="2" />
        <rect x="50" y="26" width="12" height="14" rx="1.5" fill={c.L} />
        <path d="M47 26h18" strokeWidth="2.6" />
        <path d="M51 90h10l-1.5 12h-7Z" fill="var(--surface)" />
        <path d="M51 96h10" {...detail} />
        <path d="M52 48v32" {...detail} strokeOpacity="0.5" />
      </g>
      {/* stage, slide and light */}
      <path d="M28 120h52v7H28Z" fill="var(--surface)" />
      <path d="M28 120h52v7H28Z" fill={c.hi} stroke="none" />
      <path d="M28 120h52v7H28Z" />
      <rect x="36" y="115" width="34" height="5" fill={GLASS} strokeWidth="1.3" />
      <ellipse cx="54" cy="117.5" rx="5" ry="1.8" fill={c.L} stroke="none" />
      <path d="M54 127v12" strokeWidth="1.4" />
      <path d="M44 146a10 6 0 0 0 20 0Z" fill={c.hl} />
      <path className="a-glow" d="M48 136l-4-6M60 136l4-6M54 134v-5" stroke="var(--yellow)" strokeWidth="1.6" />
      {/* zoom lines from the slide to the magnified view */}
      <path d="M60 115L112 96M60 115L138 112" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.55" />
      {/* magnified field of view: a plant cell */}
      <circle cx="140" cy="74" r="40" fill="var(--surface)" />
      <circle cx="140" cy="74" r="40" fill={c.L} fillOpacity="0.08" stroke="none" />
      <path d="M100 74a40 40 0 1 0 80 0a40 40 0 1 0-80 0ZM105 74a35 35 0 1 0 70 0a35 35 0 1 0-70 0Z" fill={c.hl} fillRule="evenodd" stroke="none" />
      <circle cx="140" cy="74" r="40" strokeWidth="2.4" />
      <circle cx="140" cy="74" r="35" strokeWidth="1" />
      <path d="M113 50l6 5M163 50l-6 5M113 98l6-5M163 98l-6-5" {...detail} strokeOpacity="0.5" />
      <rect x="114" y="49" width="52" height="50" rx="12" fill={GLASS} strokeWidth="2.2" />
      <rect x="118" y="53" width="44" height="42" rx="9" strokeWidth="1" strokeOpacity="0.55" />
      <G cls="a-spin-slow" origin="140px 74px" style={{ animationDuration: '24s' }}>
        {chloro.map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="5.2" ry="3" transform={`rotate(${r.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`} fill="var(--green)" strokeWidth="1.1" />
        ))}
      </G>
      <Ball x={140} y={74} r={8.5} fill={c.L} sw={1.6} />
      <circle cx="142.5" cy="76" r="2.4" fill={INK} stroke="none" />
    </>
  )
}

/* ---------------------------------------------------------------- 2 Mikroorganismy a houby */
function Rod({ x, y, a, len = 20, fill }: { x: number; y: number; a: number; len?: number; fill: string }) {
  const tail = pathOf(16, (t) => [-len / 2 - t * 14, 2.6 * Math.sin(t * Math.PI * 3)])
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d={tail} strokeWidth="1.1" />
      <rect x={-len / 2} y="-4.5" width={len} height="9" rx="4.5" fill={fill} strokeWidth="1.6" />
      <path d={`M${-len / 2 + 4} -1.5h${len - 9}`} stroke={PAPER} strokeOpacity="0.7" strokeWidth="1.1" />
    </g>
  )
}
export function Microbes(c: Ctx) {
  return (
    <>
      {/* soil with mycelium */}
      <path d={plateBand(150, 192, 92)} fill={c.hi} stroke="none" />
      <path d="M14 150h172" strokeWidth="1.6" />
      <path d="M62 150c-4 10-14 14-26 16M62 150c2 12 10 18 24 22M58 158c-8 6-10 14-8 22M70 160c6 2 12 0 18-6M48 166c-6 0-10 4-14 8M84 170c6 4 12 4 16 2" strokeWidth="1" stroke={c.L} strokeOpacity="0.8" />
      {/* big mushroom */}
      <path d="M54 150c2-18 2-38 0-56h16c-2 18-2 38 0 56Z" fill="var(--surface)" />
      <path d="M62 150c1-18 1-38 0-56h8c-2 18-2 38 0 56Z" fill={c.hi} stroke="none" />
      <path d="M54 150c2-18 2-38 0-56h16c-2 18-2 38 0 56Z" />
      <path d="M52 112c4 4 16 4 20 0" strokeWidth="1.6" />
      <path d="M22 94c0-30 18-48 40-48s40 18 40 48Z" fill={c.L} fillOpacity="0.9" />
      <path d="M62 46c22 0 40 18 40 48H66c4-18 2-36-4-48Z" fill={c.hi} stroke="none" />
      <path d="M22 94c0-30 18-48 40-48s40 18 40 48Z" />
      <path d="M24 94h76" strokeWidth="2.4" />
      <path d="M32 94l6 5M44 94l4 6M56 94l2 6M68 94l-2 6M80 94l-4 6M92 94l-6 5" {...detail} />
      {[
        [42, 66, 4.5],
        [62, 58, 5.5],
        [80, 72, 4],
        [50, 82, 3],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.75} fill={PAPER} strokeWidth="1.1" />
      ))}
      {/* small mushroom */}
      <path d="M104 150c1-8 1-16 0-22h7c-1 6-1 14 0 22Z" fill="var(--surface)" />
      <path d="M90 130c0-12 8-20 17-20s17 8 17 20Z" fill={c.L} fillOpacity="0.9" />
      <path d="M90 130c0-12 8-20 17-20s17 8 17 20Z" fill={c.hi} stroke="none" />
      <path d="M90 130c0-12 8-20 17-20s17 8 17 20ZM104 150c1-8 1-16 0-22h7c-1 6-1 14 0 22Z" />
      {/* drifting spores */}
      <g className="a-drift" style={{ animationDuration: '7s' }}>
        <circle cx="34" cy="108" r="1.6" fill={c.L} stroke="none" />
        <circle cx="26" cy="120" r="1.3" fill={c.L} stroke="none" />
        <circle cx="40" cy="128" r="1.5" fill={c.L} stroke="none" />
      </g>
      {/* bacteria under a lens */}
      <circle cx="146" cy="74" r="34" fill="var(--surface)" />
      <circle cx="146" cy="74" r="34" fill={c.L} fillOpacity="0.1" stroke="none" />
      <circle cx="146" cy="74" r="34" strokeWidth="2.4" />
      <circle cx="146" cy="74" r="30" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.55" />
      <path d="M170 98l14 14" strokeWidth="6" />
      <path d="M170 98l14 14" stroke="var(--surface)" strokeWidth="2.4" />
      <G cls="a-jiggle" style={{ animationDuration: '2.4s' }}>
        <Rod x={152} y={58} a={-20} fill="var(--green)" />
        <Rod x={136} y={84} a={24} fill="var(--green)" />
      </G>
      <G cls="a-jiggle" delay={1.1} style={{ animationDuration: '2.8s' }}>
        <Rod x={160} y={84} a={170} len={16} fill={c.L} />
        <g fill="var(--yellow)" strokeWidth="1.3">
          <circle cx="128" cy="62" r="4" />
          <circle cx="135" cy="58" r="4" />
          <circle cx="142" cy="56.5" r="4" />
        </g>
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 3 Rostliny */
export function Plants(c: Ctx) {
  const petals = Array.from({ length: 6 }, (_, i) => (i * 60 * Math.PI) / 180)
  const fern = pathOf(24, (t) => [138 + 30 * t + 10 * t * t, 172 - 118 * t + 28 * t * t])
  const pinnae = Array.from({ length: 7 }, (_, i) => {
    const t = 0.16 + i * 0.105
    const x = 138 + 30 * t + 10 * t * t
    const y = 172 - 118 * t + 28 * t * t
    return [x, y, 22 - i * 2.2] as const
  })
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* fern frond and fiddlehead */}
      <path d={fern} stroke={c.L} strokeWidth="2.4" />
      {pinnae.map(([x, y, l], i) => (
        <g key={i}>
          <Leaf x={x} y={y} a={-160 + i * 3} len={l} w={0.28} fill={c.L} />
          <Leaf x={x} y={y} a={-15 - i * 4} len={l * 0.9} w={0.28} fill={c.L} hatch={c.hi} />
        </g>
      ))}
      <path d="M166 172c2-22 6-34 14-38 6-3 8 4 4 7-3 2-6 0-4-3" stroke={c.L} strokeWidth="2.2" />
      {/* flowering plant */}
      <G cls="a-sway" origin="76px 172px">
        <path d="M76 172c-2-30 2-60 0-86" strokeWidth="2.6" stroke={BIO.leafDark} />
        <Leaf x={76} y={146} a={-150} len={30} fill={c.L} hatch={c.hi} />
        <Leaf x={77} y={124} a={-28} len={28} fill={c.L} hatch={c.hi} />
        {petals.map((a, i) => {
          const x = 76 + 15 * Math.cos(a)
          const y = 74 + 15 * Math.sin(a)
          return <ellipse key={i} cx={x} cy={y} rx="11" ry="7" transform={`rotate(${(i * 60).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`} fill={BIO.petal} strokeWidth="1.5" />
        })}
        <circle cx="76" cy="74" r="9" fill={BIO.pollen} strokeWidth="1.6" />
        <circle cx="76" cy="74" r="9" fill={c.hi} stroke="none" />
      </G>
      {/* bee with its flight path */}
      <path d="M28 86c4-12 10-18 18-22" strokeWidth="1.1" strokeDasharray="2 4" strokeOpacity="0.6" />
      <G cls="a-bob" style={{ animationDuration: '2.2s' }}>
        <g transform="translate(46 50) rotate(18)">
          <ellipse cx="-2" cy="-10" rx="7" ry="10" transform="rotate(-25 -2 -10)" fill={GLASS} strokeWidth="1.2" />
          <ellipse cx="6" cy="-9" rx="6" ry="9" transform="rotate(20 6 -9)" fill={GLASS} strokeWidth="1.2" />
          <ellipse cx="0" cy="0" rx="13" ry="8" fill={BIO.pollen} strokeWidth="1.6" />
          <path d="M-4 -7.5v15M3 -7.5v15" stroke={INK} strokeWidth="3" />
          <circle cx="14" cy="-1" r="5" fill={INK} stroke="none" />
          <path d="M-13 0l-5 1" strokeWidth="1.6" />
          <path d="M16 -5l4-6M17 -3l6-3" strokeWidth="1" />
        </g>
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 4 Bezobratlí */
export function Invertebrates(c: Ctx) {
  // spiral shell
  const shell = pathOf(60, (t) => {
    const a = t * Math.PI * 4.2
    const r = 2 + 18 * t
    return [128 + r * Math.cos(a), 140 - r * Math.sin(a)]
  })
  const web = Array.from({ length: 5 }, (_, i) => (i * 22.5 * Math.PI) / 180)
  const ring = (r: number) => web.map((a, i) => `${i ? 'L' : 'M'}${(36 + r * Math.cos(a)).toFixed(1)} ${(36 + r * Math.sin(a)).toFixed(1)}`).join('')
  return (
    <>
      <Ground c={c} y={174} rx={74} />
      {/* spider web in the corner */}
      <path d={web.map((a) => `M36 36L${(36 + 64 * Math.cos(a)).toFixed(1)} ${(36 + 64 * Math.sin(a)).toFixed(1)}`).join('')} strokeWidth="1" strokeOpacity="0.6" />
      <path d={[16, 30, 44, 58].map(ring).join('')} strokeWidth="1" strokeOpacity="0.6" />
      {/* spider on its thread */}
      <G cls="a-piston" style={{ animationDuration: '4.4s' }}>
        <path d="M66 20V80" strokeWidth="1" />
        <path d="M60 84l-10-6-4 6M60 88l-12 0-4 6M72 84l10-6 4 6M72 88l12 0 4 6M61 92l-8 8-2 6M71 92l8 8 2 6" strokeWidth="1.6" />
        <circle cx="66" cy="84" r="5.5" fill={INK} stroke="none" />
        <ellipse cx="66" cy="96" rx="8" ry="9" fill={c.L} />
        <path d="M62 94l4 4 4-4" stroke={PAPER} strokeWidth="1.4" />
      </G>
      {/* butterfly */}
      <g transform="translate(146 54) rotate(14)">
        <path d="M0 0c-8-18-28-26-34-14-4 10 10 18 34 14Z" fill={c.L} fillOpacity="0.9" />
        <path d="M0 0c-8-18-28-26-34-14-4 10 10 18 34 14Z" fill={c.hi} stroke="none" />
        <path d="M0 0c-8-18-28-26-34-14-4 10 10 18 34 14Z" />
        <path d="M0 0c8-18 28-26 34-14 4 10-10 18-34 14Z" fill={c.L} fillOpacity="0.9" />
        <path d="M0 0c8-18 28-26 34-14 4 10-10 18-34 14Z" />
        <path d="M0 2c-6 4-18 14-14 20 4 4 12-6 14-20ZM0 2c6 4 18 14 14 20-4 4-12-6-14-20Z" fill={BIO.pollen} strokeWidth="1.5" />
        <circle cx="-20" cy="-10" r="3.4" fill={PAPER} strokeWidth="1" />
        <circle cx="20" cy="-10" r="3.4" fill={PAPER} strokeWidth="1" />
        <path d="M0 -6v28" strokeWidth="3.6" />
        <path d="M0 -6c-2-6-4-8-8-10M0 -6c2-6 4-8 8-10" strokeWidth="1.1" />
      </g>
      {/* snail with its slime trail */}
      <path d="M40 168h56" stroke={c.L} strokeOpacity="0.45" strokeWidth="3" />
      <G cls="a-slide" style={{ animationDuration: '10s' }}>
        <path d="M92 168c4-10 14-14 24-12h40c10-8 14-20 14-24l4 2c0 8-2 20-10 30-4 4-8 4-12 4H96c-4 0-6 2-4 0Z" fill="var(--surface)" />
        <path d="M92 168c4-10 14-14 24-12h40c10-8 14-20 14-24l4 2c0 8-2 20-10 30-4 4-8 4-12 4H96c-4 0-6 2-4 0Z" fill={c.hx} stroke="none" />
        <path d="M92 168c4-10 14-14 24-12h40c10-8 14-20 14-24l4 2c0 8-2 20-10 30-4 4-8 4-12 4H96c-4 0-6 2-4 0Z" />
        <path d="M168 136l-2-14M174 136l4-12" strokeWidth="1.6" />
        <circle cx="166" cy="121" r="2" fill={INK} stroke="none" />
        <circle cx="178.5" cy="123" r="2" fill={INK} stroke="none" />
        <circle cx="128" cy="140" r="21" fill={c.L} fillOpacity="0.85" />
        <circle cx="128" cy="140" r="21" fill={c.hi} stroke="none" />
        <path d={shell} strokeWidth="1.8" />
        <circle cx="128" cy="140" r="21" />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 5 Obratlovci a chování */
export function Vertebrates(c: Ctx) {
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* pond with a lily pad */}
      <ellipse cx="140" cy="166" rx="44" ry="11" fill={c.hl} />
      <path d="M108 166h10M150 170h14M126 172h8" stroke={PAPER} strokeOpacity="0.7" {...detail} />
      <path d="M116 158a24 7 0 1 0 48 0a24 7 0 0 0-22-7l-2 7-4-7a24 7 0 0 0-20 7Z" fill={BIO.leaf} strokeWidth="1.5" />
      {/* frog with a pulsing throat sac */}
      <ellipse cx="124" cy="152" rx="9" ry="6" fill={BIO.frog} strokeWidth="1.5" />
      <ellipse cx="156" cy="152" rx="9" ry="6" fill={BIO.frog} strokeWidth="1.5" />
      <path d="M122 154c0-16 8-24 18-24s18 8 18 24c0 4-8 4-18 4s-18 0-18-4Z" fill={BIO.frog} />
      <path d="M140 130c10 0 18 8 18 24 0 4-8 4-18 4Z" fill={c.hi} stroke="none" />
      <path d="M122 154c0-16 8-24 18-24s18 8 18 24c0 4-8 4-18 4s-18 0-18-4Z" />
      <circle cx="131" cy="128" r="6" fill={BIO.frog} />
      <circle cx="149" cy="128" r="6" fill={BIO.frog} />
      <circle cx="131" cy="127" r="2.6" fill={INK} stroke="none" />
      <circle cx="149" cy="127" r="2.6" fill={INK} stroke="none" />
      <circle className="a-glow" cx="140" cy="146" r="6" fill={PAPER} fillOpacity="0.85" strokeWidth="1.2" />
      <path d="M130 140c6 3 14 3 20 0" strokeWidth="1.4" />
      <path d="M128 156l-4 2M152 156l4 2" strokeWidth="1.6" />
      {/* fox sitting with its tail around its feet */}
      <path d="M40 170c-18 0-20-22-6-28 12-4 22 6 28 22" fill={BIO.fox} />
      <path d="M40 170c-12 0-16-10-12-18 4 4 8 8 12 18Z" fill={PAPER} strokeWidth="1.2" />
      <path d="M48 170c-6-26-2-48 10-58h24c12 10 16 32 10 58Z" fill={BIO.fox} />
      <path d="M70 112h12c12 10 16 32 10 58H74c6-20 4-40-4-58Z" fill={c.hi} stroke="none" />
      <path d="M48 170c-6-26-2-48 10-58h24c12 10 16 32 10 58Z" />
      <path d="M62 116c3 16 5 34 8 50 3-16 5-34 8-50Z" fill={PAPER} strokeWidth="1.2" />
      <path d="M58 170v-10M82 170v-10" strokeWidth="1.6" />
      <path d="M52 94l-6-30 20 18M90 94l6-30-20 18" fill={BIO.fox} />
      <path d="M50 72l2 12 6-4M92 72l-2 12-6-4" fill={INK} stroke="none" />
      <path d="M48 92c6-10 14-14 23-14s17 4 23 14l-23 30Z" fill={BIO.fox} />
      <path d="M71 78c9 0 17 4 23 14l-23 30Z" fill={c.hi} stroke="none" />
      <path d="M48 92c6-10 14-14 23-14s17 4 23 14l-23 30Z" />
      <path d="M54 98c8 4 26 4 34 0l-17 24Z" fill={PAPER} strokeWidth="1.3" />
      <circle cx="62" cy="94" r="2.4" fill={INK} stroke="none" />
      <circle cx="80" cy="94" r="2.4" fill={INK} stroke="none" />
      <circle cx="71" cy="120" r="3.2" fill={INK} stroke="none" />
      {/* bird on a branch */}
      <path d="M180 62c-18 2-34 2-54 8" strokeWidth="3" stroke={BIO.bark} />
      <path d="M150 66c4-8 10-10 16-8-4 6-10 8-16 8Z" fill={BIO.leaf} strokeWidth="1.2" />
      <G cls="a-bob" delay={0.6}>
        <Finch x={142} y={68} body={c.L} beak="insect" scale={1.2} />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 6 Lidské tělo */
export function Body(c: Ctx) {
  const ribs = [104, 116, 128, 140]
  return (
    <>
      {/* torso outline */}
      <path d="M60 22c-6 18-4 30 0 40-18 6-30 20-32 46l-2 50M140 22c6 18 4 30 0 40 18 6 30 20 32 46l2 50" strokeWidth="1.6" strokeOpacity="0.6" />
      {/* trachea and air flow */}
      <path d="M94 30v40h12V30" fill="var(--surface)" />
      <path d="M94 38h12M94 46h12M94 54h12M94 62h12" {...detail} />
      <path d="M94 30v40h12V30" />
      <path className="a-flow" d="M100 20v54" stroke={c.L} strokeWidth="2" strokeDasharray="3 7" style={{ animationDuration: '2.4s' }} />
      <path d="M100 70l-14 14M100 70l14 14" strokeWidth="3.4" />
      {/* lungs */}
      <path d="M86 84c-12-6-30 4-34 26-4 22-2 42 6 48 10 6 24-4 30-14 4-8 4-30 0-46Z" fill={BIO.lung} fillOpacity="0.85" />
      <path d="M86 84c-12-6-30 4-34 26-4 22-2 42 6 48 10 6 24-4 30-14 4-8 4-30 0-46Z" fill={c.hi} stroke="none" />
      <path d="M86 84c-12-6-30 4-34 26-4 22-2 42 6 48 10 6 24-4 30-14 4-8 4-30 0-46Z" />
      <path d="M114 84c12-6 30 4 34 26 4 22 2 42-6 48-10 6-24-4-30-14-4-8-4-30 0-46Z" fill={BIO.lung} fillOpacity="0.85" />
      <path d="M114 84c12-6 30 4 34 26 4 22 2 42-6 48-10 6-24-4-30-14-4-8-4-30 0-46Z" />
      <path d="M86 84c-6 12-16 18-24 22M82 100c-6 8-14 12-20 22M114 84c6 12 16 18 24 22M118 100c6 8 14 12 20 22" strokeWidth="1.2" strokeOpacity="0.75" />
      {/* ribs and spine over the lungs */}
      <path d={ribs.map((y) => `M96 ${y}c-14-6-34-4-44 8M104 ${y}c14-6 34-4 44 8`).join('')} stroke={BIO.bone} strokeWidth="4.4" strokeOpacity="0.9" />
      <path d={ribs.map((y) => `M96 ${y}c-14-6-34-4-44 8M104 ${y}c14-6 34-4 44 8`).join('')} strokeWidth="1" strokeOpacity="0.7" />
      <path d="M100 92v84" stroke={BIO.bone} strokeWidth="7" />
      <path d="M100 92v84" strokeWidth="7" strokeDasharray="1 6" strokeOpacity="0.75" />
      {/* heart */}
      <path d="M108 120c0-10 14-14 18-4 4-10 20-6 16 8-4 12-16 20-24 26-6-8-12-16-10-30Z" fill={BIO.blood} />
      <path d="M126 116c4-10 20-6 16 8-4 12-16 20-24 26 2-12 6-24 8-34Z" fill={c.hi} stroke="none" />
      <path d="M108 120c0-10 14-14 18-4 4-10 20-6 16 8-4 12-16 20-24 26-6-8-12-16-10-30Z" />
      <path d="M118 112c0-8 2-14 6-18M128 114c2-6 6-10 12-12" stroke={BIO.blood} strokeWidth="3.6" />
      <path d="M118 112c0-8 2-14 6-18M128 114c2-6 6-10 12-12" strokeWidth="1" />
      <path className="a-glow" d="M114 124c0-4 4-6 6-4" stroke={PAPER} strokeWidth="2" style={{ animationDuration: '1s' }} />
      {/* diaphragm */}
      <path d="M50 166c16-12 34-14 50-8 16-6 34-4 50 8" stroke={c.L} strokeWidth="3" />
    </>
  )
}

/* ---------------------------------------------------------------- 7 Dědičnost a evoluce */
export function Heredity(c: Ctx) {
  const pods = [
    [60, 96, -30],
    [92, 70, 30],
  ] as const
  const peas: [number, string][] = [
    [40, BIO.pollen],
    [62, BIO.pollen],
    [84, BIO.pollen],
    [106, BIO.leaf],
  ]
  return (
    <>
      <Ground c={c} y={174} rx={76} />
      {/* support cane */}
      <path d="M100 172V28" stroke={BIO.bark} strokeWidth="2.4" />
      {/* climbing pea plant */}
      <G cls="a-sway" origin="80px 172px">
        <path d="M80 172c-4-20 14-28 10-48s-14-30-4-48c6-10 14-14 12-30" strokeWidth="2.4" stroke={BIO.leafDark} />
        <path d="M90 120c6-2 8 2 10 0-2-4-6-6-4-10M88 76c6-4 10 0 12-4" strokeWidth="1.2" stroke={BIO.leafDark} />
        <Leaf x={84} y={150} a={-160} len={22} w={0.5} hatch={c.hi} />
        <Leaf x={86} y={150} a={-20} len={18} w={0.5} />
        <Leaf x={88} y={104} a={-170} len={20} w={0.5} hatch={c.hi} />
        <Leaf x={88} y={52} a={-150} len={18} w={0.5} />
        {pods.map(([x, y, a], i) => (
          <g key={i} transform={`rotate(${a} ${x} ${y})`}>
            <path d={`M${x - 16} ${y}c6-8 26-8 32 0-6 8-26 8-32 0Z`} fill={BIO.leaf} />
            <path d={`M${x - 16} ${y}c6 8 26 8 32 0Z`} fill={c.hi} stroke="none" />
            <path d={`M${x - 16} ${y}c6-8 26-8 32 0-6 8-26 8-32 0Z`} />
            {[-8, 0, 8].map((dx) => (
              <circle key={dx} cx={x + dx} cy={y} r="3" fill={BIO.frog} strokeWidth="1" />
            ))}
          </g>
        ))}
        {/* flower */}
        <path d="M96 46c-6-10 0-20 10-18 8 2 8 12 2 18Z" fill={c.L} strokeWidth="1.4" />
        <path d="M98 46c-2-6 0-10 4-12" stroke={PAPER} strokeOpacity="0.7" strokeWidth="1.2" />
      </G>
      {/* 3 : 1 */}
      {peas.map(([x, col], i) => (
        <Ball key={i} x={x} y={162} r={7.5} fill={col} sw={1.6} />
      ))}
      <text x="72" y="190" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(14)}>
        3 : 1
      </text>
      {/* DNA */}
      <G cls="a-bob" delay={0.8}>
        <Helix c={c} cx={150} y0={38} y1={160} amp={16} turns={1.5} rungs={11} />
      </G>
    </>
  )
}

/* ---------------------------------------------------------------- 8 Země a ekosystémy */
export function Earth(c: Ctx) {
  return (
    <>
      {/* mountains */}
      <path d="M8 116l38-58 20 24 30-44 40 56 16-18 40 40Z" fill="var(--surface)" />
      <path d="M96 38l40 56 16-18 40 40H96Z" fill={c.hi} stroke="none" />
      <path d="M8 116l38-58 20 24 30-44 40 56 16-18 40 40" />
      <path d="M84 56l12-18 12 16-6-2-4 6-6-6Z" fill={PAPER} strokeWidth="1.2" />
      <path d="M38 70l8-12 8 10-4-1-4 4Z" fill={PAPER} strokeWidth="1.2" />
      {/* strata */}
      <path d={plateBand(116, 132, 92)} fill={c.L} fillOpacity="0.28" stroke="none" />
      <path d={plateBand(132, 150, 92)} fill={c.hl} stroke="none" />
      <path d={plateBand(150, 168, 92)} fill={c.L} fillOpacity="0.14" stroke="none" />
      <path d={plateBand(150, 168, 92)} fill={c.hi} stroke="none" />
      <path d={plateBand(168, 192, 92)} fill={c.hx} stroke="none" />
      <path d="M8 116H192M10 132H190M14 150H186M22 168H178" strokeWidth="1.4" />
      <path d="M30 124h6M60 126h4M140 122h8M118 158h6M40 160h8M156 160h4" {...detail} strokeOpacity="0.6" />
      {/* ammonite fossil */}
      <g>
        <circle cx="62" cy="141" r="9" fill="var(--surface)" strokeWidth="1.6" />
        <path d={pathOf(40, (t) => [62 + (1 + 8 * t) * Math.cos(t * Math.PI * 5), 141 + (1 + 8 * t) * Math.sin(t * Math.PI * 5)])} strokeWidth="1.3" />
        <path d="M62 132v3M70 138l-3 1M68 148l-2-2M56 148l2-2M53 139l3 1" strokeWidth="1" />
      </g>
      <path d="M120 140c4-2 10-2 14 2M124 144l4-4" strokeWidth="1.2" strokeOpacity="0.7" />
      {/* oak tree with roots */}
      <path d="M140 116c0-14 2-24 0-34h8c-2 10 0 20 0 34Z" fill={BIO.bark} />
      <path d="M140 116c-6 4-10 8-12 12M148 116c6 4 10 10 10 14M144 116v12" strokeWidth="1.4" stroke={BIO.bark} />
      <G cls="a-sway" origin="144px 116px">
        <path d="M120 82c-10 0-14-14-4-20-4-12 8-22 18-16 6-10 22-8 24 2 12-2 18 12 10 20 6 10-4 18-12 14-6 6-18 6-24 0-4 4-10 2-12 0Z" fill={BIO.leaf} />
        <path d="M144 46c6-10 22-8 24 2 12-2 18 12 10 20 6 10-4 18-12 14-6 6-18 6-24 0Z" fill={c.hi} stroke="none" />
        <path d="M120 82c-10 0-14-14-4-20-4-12 8-22 18-16 6-10 22-8 24 2 12-2 18 12 10 20 6 10-4 18-12 14-6 6-18 6-24 0-4 4-10 2-12 0Z" />
        <path d="M130 66c4 2 6 0 8-2M150 58c2 4 6 4 8 2M156 76c2-2 6-2 8 0" strokeWidth="1.1" />
      </G>
      {/* falling acorn */}
      <G cls="a-fall" style={{ ['--fall' as string]: '24px', animationDuration: '5s' }}>
        <ellipse cx="166" cy="90" rx="3.4" ry="4.4" fill={BIO.pollen} strokeWidth="1.1" />
        <path d="M162.4 88a3.6 2.6 0 0 1 7.2 0Z" fill={BIO.bark} strokeWidth="1.1" />
      </G>
      <text x="100" y="186" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(12)}>
        ↓ starší vrstvy
      </text>
    </>
  )
}
