import { BIO, Ball, Finch, G, GLASS, Ground, Helix, INK, PAPER, Star, detail, labelFill, labelFont, pathOf, type Beak, type Ctx } from './kit'

/* Biology vignettes 9–12 (gymnázium). */

/* ---------------------------------------------------------------- 9 Buňka a energie */
export function CellEnergy(c: Ctx) {
  const cristae = pathOf(40, (t) => [72 + t * 52, 146 + 7 * Math.sign(Math.sin(t * Math.PI * 8)) * Math.abs(Math.sin(t * Math.PI))])
  const grana = [120, 131, 142, 153]
  return (
    <>
      {/* light reaching the chloroplast */}
      <circle cx="146" cy="28" r="8" fill="var(--yellow)" />
      <circle cx="146" cy="28" r="8" fill={c.hi} stroke="none" />
      <path className="a-flow" d="M140 40l-6 18M148 40l2 18M134 34l-14 14M158 34l12 14" stroke="var(--yellow)" strokeWidth="2.2" strokeDasharray="5 5" />
      {/* plant cell: wall and membrane */}
      <rect x="28" y="48" width="144" height="122" rx="30" fill={c.L} fillOpacity="0.08" strokeWidth="2.6" />
      <rect x="33" y="53" width="134" height="112" rx="26" fill={c.hi} fillOpacity="0.25" stroke="none" />
      <rect x="33" y="53" width="134" height="112" rx="26" strokeWidth="1.2" />
      {/* vacuole */}
      <path d="M92 112c-6-14 6-26 24-26s26 10 22 22c-4 10-18 14-30 14-8 0-14-4-16-10Z" fill={GLASS} strokeWidth="1.2" strokeDasharray="3 3" />
      {/* nucleus */}
      <circle cx="62" cy="88" r="20" fill="var(--surface)" />
      <circle cx="62" cy="88" r="20" fill={c.hl} stroke="none" />
      <circle cx="62" cy="88" r="20" strokeWidth="2" />
      <circle cx="62" cy="88" r="16.5" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
      <Ball x={66} y={92} r={6} fill={c.L} sw={1.4} />
      {/* endoplasmic reticulum */}
      <path d="M84 72c6-4 6 4 12 0s6 4 12 0M86 80c6-4 6 4 12 0" strokeWidth="1.2" strokeOpacity="0.75" />
      <path d="M40 120h0M46 126h0M38 134h0M52 116h0" strokeWidth="3" strokeOpacity="0.7" />
      {/* chloroplast */}
      <g transform="rotate(-16 136 72)">
        <ellipse cx="136" cy="72" rx="26" ry="14" fill={BIO.leaf} />
        <ellipse cx="136" cy="72" rx="26" ry="14" />
        <ellipse cx="136" cy="72" rx="22" ry="10.5" strokeWidth="1" strokeOpacity="0.6" />
        {grana.map((x) => (
          <path key={x} d={`M${x - 3.5} 66h7M${x - 3.5} 69.5h7M${x - 3.5} 73h7M${x - 3.5} 76.5h7`} stroke={BIO.leafDark} strokeWidth="2.6" />
        ))}
        <path d="M114 71.5h44" stroke={BIO.leafDark} strokeWidth="1" strokeOpacity="0.8" />
      </g>
      {/* mitochondrion */}
      <ellipse cx="98" cy="146" rx="32" ry="14" fill={c.L} fillOpacity="0.85" />
      <ellipse cx="98" cy="146" rx="32" ry="14" fill={c.hi} stroke="none" />
      <ellipse cx="98" cy="146" rx="32" ry="14" />
      <ellipse cx="98" cy="146" rx="28" ry="10.5" fill="var(--surface)" fillOpacity="0.55" strokeWidth="1" />
      <path d={cristae} stroke={c.L} strokeWidth="2" />
      {/* ATP sparks */}
      <g className="a-glow">
        <Star x={150} y={136} r={6} fill="var(--yellow)" />
        <Star x={156} y={150} r={4} fill="var(--yellow)" />
      </g>
      <text x="128" y="128" fill={labelFill(c)} stroke="none" style={labelFont(12)}>
        ATP
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 10 Molekulární genetika a biotechnologie */
export function GeneEdit(c: Ctx) {
  const px = 136
  const py = 100
  return (
    <>
      <Ground c={c} y={180} rx={60} />
      {/* DNA cut in two */}
      <Helix c={c} cx={70} y0={22} y1={92} amp={18} turns={1} rungs={7} />
      <Helix c={c} cx={70} y0={108} y1={176} amp={18} turns={1} rungs={7} />
      <path d="M52 100l-8-4M52 100l-8 4M88 100l8-4M88 100l8 4" stroke={c.L} strokeWidth="1.6" />
      <path d="M56 100h28" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />
      {/* guide strand pairing above the cut */}
      <path d="M38 84c4-6 8-6 12 0" stroke={c.L} strokeWidth="2.4" strokeDasharray="3 2" />
      {/* scissors: two blades snipping in step */}
      <G cls="a-swing" origin={`${px}px ${py}px`} style={{ ['--swing' as string]: '7deg', animationDuration: '2.4s' }}>
        <path d={`M${px} ${py}L82 ${py - 9}c6 4 30 8 54 3Z`} fill="var(--surface)" />
        <path d={`M${px} ${py}L82 ${py - 9}c6 4 30 8 54 3Z`} fill={c.hx} stroke="none" />
        <path d={`M${px} ${py}L82 ${py - 9}c6 4 30 8 54 3Z`} />
        <path d={`M${px} ${py}c10 2 16-8 22-16`} strokeWidth="4" />
        <circle cx="166" cy="78" r="11" fill={c.L} fillOpacity="0.9" strokeWidth="2.2" />
        <circle cx="166" cy="78" r="5.5" fill="var(--surface)" strokeWidth="1.6" />
      </G>
      <G cls="a-swing" origin={`${px}px ${py}px`} delay={-1.2} style={{ ['--swing' as string]: '7deg', animationDuration: '2.4s' }}>
        <path d={`M${px} ${py}L82 ${py + 9}c6-4 30-8 54-3Z`} fill="var(--surface)" />
        <path d={`M${px} ${py}L82 ${py + 9}c6-4 30-8 54-3Z`} />
        <path d={`M${px} ${py}c10-2 16 8 22 16`} strokeWidth="4" />
        <circle cx="166" cy="122" r="11" fill={c.L} fillOpacity="0.9" strokeWidth="2.2" />
        <circle cx="166" cy="122" r="5.5" fill="var(--surface)" strokeWidth="1.6" />
      </G>
      <circle cx={px} cy={py} r="3.4" fill={INK} stroke="none" />
      <path d="M150 154l4 6M160 150l6 4M146 164h6" {...detail} stroke={c.L} />
    </>
  )
}

/* ---------------------------------------------------------------- 11 Fyziologie a homeostáza */
export function Physiology(c: Ctx) {
  const ecg = 'M34 140h20l4-6 4 6h6l3 5 5-32 5 42 4-15h8l6-8 6 8h10l4-6 4 6h6l3 5 5-32 5 42 4-15h8l6-8 6 8'
  const myelin = [86, 108, 130]
  return (
    <>
      {/* neuron: dendrites, body, myelinated axon, terminals */}
      <g transform="translate(12 8)">
        <path d="M44 58l-14-14-6 2M30 44l-2-10M42 46l-6-20M36 26l-6-2M36 26l4-7M48 74l-12 14-8-2M36 88l-2 8M56 44l4-14 8-4" strokeWidth="1.8" />
        <path d="M38 52c-4-12 10-22 20-16 10-2 18 8 14 18 6 8-4 20-14 16-10 6-24-4-20-18Z" fill={c.L} fillOpacity="0.85" />
        <path d="M58 36c10-2 18 8 14 18 6 8-4 20-14 16Z" fill={c.hi} stroke="none" />
        <path d="M38 52c-4-12 10-22 20-16 10-2 18 8 14 18 6 8-4 20-14 16-10 6-24-4-20-18Z" />
        <circle cx="55" cy="54" r="6.5" fill="var(--surface)" strokeWidth="1.6" />
        <circle cx="56" cy="55" r="2.2" fill={INK} stroke="none" />
        <path d="M72 58H150" strokeWidth="2" />
        {myelin.map((x) => (
          <g key={x}>
            <rect x={x - 9} y="51.5" width="18" height="13" rx="6.5" fill="var(--surface)" />
            <rect x={x - 9} y="51.5" width="18" height="13" rx="6.5" fill={c.hl} stroke="none" />
            <rect x={x - 9} y="51.5" width="18" height="13" rx="6.5" strokeWidth="1.6" />
          </g>
        ))}
        <path className="a-flow" d="M72 58H150" stroke="var(--yellow)" strokeWidth="3.4" strokeDasharray="6 14" style={{ animationDuration: '0.9s' }} />
        <path d="M150 58l10-10M150 58h12M150 58l10 10" strokeWidth="1.8" />
        {[
          [162, 46],
          [165, 58],
          [162, 70],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={c.L} strokeWidth="1.4" />
        ))}
      </g>
      {/* heart and its rhythm */}
      <rect x="34" y="112" width="132" height="48" rx="6" fill="var(--surface)" strokeWidth="1.4" />
      <path d="M34 128h132M34 144h132M67 112v48M100 112v48M133 112v48" strokeWidth="0.8" stroke={c.L} strokeOpacity="0.35" />
      <path d={ecg} stroke={c.L} strokeWidth="2.6" />
      <path className="a-flow" d={ecg} stroke={PAPER} strokeOpacity="0.85" strokeWidth="1.4" strokeDasharray="2 18" style={{ animationDuration: '1.2s' }} />
      <g className="a-glow" style={{ animationDuration: '1.2s' }} transform="translate(-22 2)">
        <path d="M148 178c-6-4-12-8-12-14 0-4 4-6 6-6 3 0 5 2 6 4 1-2 3-4 6-4 2 0 6 2 6 6 0 6-6 10-12 14Z" fill={BIO.blood} strokeWidth="1.4" />
      </g>
      <text x="80" y="178" textAnchor="middle" fill={labelFill(c)} stroke="none" style={labelFont(13)}>
        72 tepů/min
      </text>
    </>
  )
}

/* ---------------------------------------------------------------- 12 Evoluce a ekologie */
export function TreeOfLife(c: Ctx) {
  const branches = 'M100 170C100 150 98 136 100 128M100 128C90 118 70 116 62 104M100 128C110 118 130 116 138 104M62 104C52 96 44 88 40 74M62 104C70 96 78 88 80 72M138 104C130 96 122 88 120 72M138 104C148 96 156 88 160 74'
  const tips: [number, number, Beak, string, boolean][] = [
    [40, 74, 'seed', '#5a4a3a', true],
    [80, 72, 'probe', BIO.bark, true],
    [120, 72, 'insect', '#7c6a4c', false],
    [160, 74, 'cactus', '#4c4036', false],
  ]
  return (
    <>
      {/* island and sea */}
      <path d="M30 176c10-10 30-14 70-14s60 4 70 14Z" fill={c.hl} />
      <path d="M24 182c6-3 10-3 16 0s10 3 16 0M144 182c6-3 10-3 16 0s10 3 16 0" stroke={c.L} strokeWidth="1.4" />
      {/* tree of life */}
      <path d={branches} strokeWidth="7" />
      <path d={branches} stroke={c.L} strokeWidth="4" />
      {[
        [100, 128],
        [62, 104],
        [138, 104],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--surface)" strokeWidth="1.6" />
      ))}
      {/* time axis */}
      <path d="M180 160V42" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M176 48l4-8 4 8" strokeWidth="1.2" strokeOpacity="0.6" />
      {/* finches with different beaks */}
      {tips.map(([x, y, beak, body, flip], i) => (
        <G key={i} cls="a-bob" delay={i * 0.7} style={{ animationDuration: '3.2s' }}>
          <Finch x={x} y={y} body={body} beak={beak} flip={flip} scale={1.05} />
        </G>
      ))}
    </>
  )
}
