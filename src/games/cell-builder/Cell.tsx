/**
 * Engraved cell pictures for Stavitel buňky: a plant cell, an animal cell and a bacterium
 * (viewBox 360 × 260). Every structure is its own group so a task can leave one out.
 * Marker points live in levels.ts (ANCHORS) and must sit on the drawn structure.
 */
import { useId, type ReactNode } from 'react'
import { VIEW, type CellId, type PartId } from './levels'

const mix = (c: string, p: number) => `color-mix(in srgb, var(--${c}) ${p}%, var(--surface))`

const INK = 'var(--edge)'

function Hatch({ id, color, gap = 5, angle = 45, width = 0.8 }: { id: string; color: string; gap?: number; angle?: number; width?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={width} />
    </pattern>
  )
}

function Mito({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse rx="14" ry="7" fill={mix('accent', 38)} stroke={INK} strokeWidth="1.3" />
      <path d="M-10 0 l2.5 -4.2 l2.5 8.4 l2.5 -8.4 l2.5 8.4 l2.5 -8.4 l2.5 8.4 l2.5 -8.4 l2.5 4.2" fill="none" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
    </g>
  )
}

function Chloro({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <ellipse rx="16" ry="7.5" fill={mix('green', 45)} stroke={INK} strokeWidth="1.3" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--green)" strokeWidth="0.8" />
      {[-8, -1, 6].map((gx) => (
        <g key={gx}>
          <rect x={gx} y="-4" width="4" height="8" rx="0.8" fill="var(--green)" />
          <line x1={gx} y1="-1.3" x2={gx + 4} y2="-1.3" stroke="var(--surface)" strokeWidth="0.6" />
          <line x1={gx} y1="1.3" x2={gx + 4} y2="1.3" stroke="var(--surface)" strokeWidth="0.6" />
        </g>
      ))}
    </g>
  )
}

/** A membrane tube: ink outline with a coloured core. */
function Tube({ d, color }: { d: string; color: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth="4.2" />
      <path d={d} stroke={color} strokeWidth="2.4" />
    </g>
  )
}

function Dots({ pts, r = 1.5 }: { pts: [number, number][]; r?: number }) {
  return (
    <g fill="var(--ink)">
      {pts.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={r} />
      ))}
    </g>
  )
}

function Golgi({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      {[0, 1, 2, 3].map((k) => (
        <Tube key={k} d={`M${-17 + k * 2} ${-8 + k * 5.5} q ${17 - k * 2} ${-8} ${34 - k * 4} 0`} color={mix('yellow', 55)} />
      ))}
      <circle cx="-21" cy="-6" r="2.6" fill={mix('yellow', 55)} stroke={INK} strokeWidth="1" />
      <circle cx="20" cy="2" r="2.6" fill={mix('yellow', 55)} stroke={INK} strokeWidth="1" />
    </g>
  )
}

function Nucleus({ x, y, r, nucleolus, show }: { x: number; y: number; r: number; nucleolus: [number, number]; show: (p: PartId) => boolean }) {
  return (
    <g>
      {show('jadro') && (
        <g>
          <circle cx={x} cy={y} r={r} fill={mix('violet', 20)} stroke={INK} strokeWidth="1.5" />
          <circle cx={x} cy={y} r={r - 3.2} fill="none" stroke={INK} strokeWidth="0.8" strokeDasharray="7 3" />
          <path d={`M${x - r * 0.55} ${y + r * 0.2} q 6 -8 12 -2 t 10 4 M${x - r * 0.2} ${y - r * 0.5} q 5 6 12 2`} fill="none" stroke="var(--violet)" strokeWidth="0.8" />
        </g>
      )}
      {show('jaderko') && show('jadro') && <circle cx={nucleolus[0]} cy={nucleolus[1]} r={r * 0.3} fill={mix('violet', 70)} stroke={INK} strokeWidth="1" />}
    </g>
  )
}

function PlantCell({ show, hid }: { show: (p: PartId) => boolean; hid: string }) {
  return (
    <>
      {show('stena') && (
        <g>
          <rect x="8" y="8" width="344" height="244" rx="16" fill={mix('green', 26)} stroke={INK} strokeWidth="1.8" />
          <rect x="8" y="8" width="344" height="244" rx="16" fill={`url(#${hid}-g)`} />
        </g>
      )}
      <rect x="22" y="22" width="316" height="216" rx="10" fill={mix('green', 7)} stroke={INK} strokeWidth="1.3" />
      {show('vakuola') && (
        <g>
          <path d="M160 72 C 180 50, 290 48, 308 72 C 320 102, 318 168, 304 194 C 286 216, 180 216, 160 196 C 146 172, 144 98, 160 72 Z" fill={mix('teal', 16)} stroke={INK} strokeWidth="1.3" />
          <path d="M160 72 C 180 50, 290 48, 308 72 C 320 102, 318 168, 304 194 C 286 216, 180 216, 160 196 C 146 172, 144 98, 160 72 Z" fill={`url(#${hid}-t)`} />
        </g>
      )}
      <Nucleus x={78} y={84} r={30} nucleolus={[86, 90]} show={show} />
      {show('drsneER') && (
        <g>
          {[40, 46, 52].map((r) => (
            <g key={r}>
              <Tube d={arc(78, 84, r, 128, 52).replace(' 0 0 1 ', ' 0 0 0 ')} color={mix('blue', 22)} />
              <Dots pts={arcDots(78, 84, r, 128, 52, 9)} r={1.3} />
            </g>
          ))}
        </g>
      )}
      {show('golgi') && <Golgi x={64} y={178} />}
      {show('hladkeER') && (
        <g>
          <Tube d="M92 206 q 5 -5 10 0 t 10 0 t 10 0 q 4 3 2 8" color={mix('blue', 22)} />
          <Tube d="M94 216 q 5 -5 10 0 t 10 0 t 8 -2" color={mix('blue', 22)} />
        </g>
      )}
      {show('mitochondrie') && (
        <g>
          <Mito x={114} y={158} r={70} />
          <Mito x={52} y={220} r={-8} s={0.9} />
          <Mito x={300} y={36} r={4} s={0.85} />
        </g>
      )}
      {show('chloroplast') && (
        <g>
          <Chloro x={182} y={36} r={-3} />
          <Chloro x={250} y={35} />
          <Chloro x={200} y={226} r={3} />
          <Chloro x={262} y={226} r={-4} />
          <Chloro x={328} y={130} r={90} />
        </g>
      )}
      {show('ribozomy') && (
        <Dots
          pts={[
            [128, 180],
            [135, 184],
            [140, 190],
            [131, 192],
            [139, 179],
            [126, 189],
            [118, 100],
            [124, 108],
            [40, 46],
            [36, 120],
            [116, 60],
            [150, 228],
            [232, 230],
            [326, 200],
            [316, 52],
          ]}
        />
      )}
    </>
  )
}

const ANIMAL_MEMBRANE = 'M40 120 C 34 60, 110 18, 190 22 C 270 26, 334 60, 334 128 C 334 196, 268 240, 186 238 C 100 236, 46 190, 40 120 Z'

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)].map((v) => v.toFixed(1)).join(' ')
  return `M${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`
}
function arcDots(cx: number, cy: number, r: number, a0: number, a1: number, n: number): [number, number][] {
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * (k + 0.5)) / n) * Math.PI) / 180
    const rr = r + (k % 2 ? 3.2 : -3.2)
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
  })
}

function AnimalCell({ show }: { show: (p: PartId) => boolean }) {
  return (
    <>
      <path d={ANIMAL_MEMBRANE} fill={mix('pink', 9)} stroke={INK} strokeWidth="1.8" />
      <path d={ANIMAL_MEMBRANE} fill="none" stroke={INK} strokeWidth="0.7" transform="translate(187 130) scale(0.975) translate(-187 -130)" opacity="0.6" />
      {show('cytoskelet') && (
        <g fill="none" stroke="var(--teal)" strokeWidth="0.9" opacity="0.75" strokeLinecap="round">
          <path d="M108 148 Q 92 168 76 191" />
          <path d="M108 148 Q 80 130 52 104" />
          <path d="M108 148 Q 120 196 150 228" />
          <path d="M108 148 Q 104 90 122 40" />
          <path d="M108 148 Q 60 160 46 146" />
        </g>
      )}
      <Nucleus x={165} y={118} r={34} nucleolus={[173, 125]} show={show} />
      {show('drsneER') && (
        <g>
          {[44, 51, 58].map((r) => (
            <g key={r}>
              <Tube d={arc(165, 118, r, -55, 55)} color={mix('blue', 22)} />
              <Dots pts={arcDots(165, 118, r, -55, 55, 12)} r={1.3} />
            </g>
          ))}
        </g>
      )}
      {show('golgi') && <Golgi x={268} y={154} r={-10} />}
      {show('vacek') && (
        <g fill={mix('yellow', 50)} stroke={INK} strokeWidth="1.1">
          <circle cx="308" cy="118" r="6.5" />
          <circle cx="294" cy="136" r="3.8" />
          <circle cx="298" cy="174" r="3.8" />
        </g>
      )}
      {show('hladkeER') && (
        <g>
          <Tube d="M232 200 q 5 -5 10 0 t 10 0 t 10 0 q 5 2 4 8" color={mix('blue', 22)} />
          <Tube d="M236 211 q 5 -5 10 0 t 10 0 t 9 -3" color={mix('blue', 22)} />
        </g>
      )}
      {show('lysozom') && (
        <g>
          {[
            [192, 212, 8.5],
            [64, 140, 7],
          ].map(([x, y, r]) => (
            <g key={x}>
              <circle cx={x} cy={y} r={r} fill={mix('pink', 40)} stroke={INK} strokeWidth="1.2" />
              <Dots pts={[[x - r * 0.35, y - r * 0.2], [x + r * 0.3, y - r * 0.35], [x, y + r * 0.35], [x + r * 0.4, y + r * 0.25]]} r={1.1} />
            </g>
          ))}
        </g>
      )}
      {show('centrioly') && (
        <g transform="translate(108 148)" fill={mix('teal', 40)} stroke={INK} strokeWidth="1">
          <rect x="-12" y="-3" width="11" height="6" rx="1" />
          <rect x="1" y="-10" width="6" height="11" rx="1" />
          <path d="M-9 -3 v6 M-6 -3 v6 M-3 -3 v6 M1 -7 h6 M1 -4 h6 M1 -1 h6" strokeWidth="0.6" />
        </g>
      )}
      {show('mitochondrie') && (
        <g>
          <Mito x={95} y={88} r={-25} />
          <Mito x={276} y={86} r={15} s={0.95} />
          <Mito x={120} y={214} r={10} s={0.85} />
        </g>
      )}
      {show('ribozomy') && (
        <Dots
          pts={[
            [134, 196],
            [141, 200],
            [146, 194],
            [138, 206],
            [148, 204],
            [132, 204],
            [230, 60],
            [210, 44],
            [70, 104],
            [84, 120],
            [300, 100],
            [312, 150],
            [226, 226],
            [160, 226],
            [60, 170],
          ]}
        />
      )}
    </>
  )
}

function Bacterium({ show, hid }: { show: (p: PartId) => boolean; hid: string }) {
  return (
    <>
      {show('bicik') && <path d="M290 130 C 300 116, 310 116, 318 126 S 336 136, 344 122 S 352 108, 357 112" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />}
      {show('stena') && (
        <g>
          <rect x="20" y="72" width="270" height="116" rx="58" fill={mix('yellow', 34)} stroke={INK} strokeWidth="1.8" />
          <rect x="20" y="72" width="270" height="116" rx="58" fill={`url(#${hid}-y)`} />
        </g>
      )}
      <rect x="30" y="82" width="250" height="96" rx="48" fill={mix('yellow', 10)} stroke={INK} strokeWidth="1.3" />
      {show('nukleoid') && (
        <path
          d="M118 128 C 112 108, 140 104, 150 116 C 160 128, 178 106, 190 118 C 202 132, 182 150, 168 140 C 154 130, 150 152, 134 148 C 120 145, 128 130, 140 132 C 152 134, 160 122, 172 126 C 180 130, 176 140, 166 138"
          fill="none"
          stroke="var(--violet)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
      {show('plazmid') && (
        <g fill="none" stroke="var(--violet)" strokeWidth="1.5">
          <circle cx="232" cy="108" r="8" />
          <circle cx="108" cy="160" r="6" />
        </g>
      )}
      {show('ribozomy') && (
        <Dots
          pts={[
            [190, 152],
            [197, 158],
            [203, 151],
            [193, 162],
            [204, 162],
            [70, 108],
            [86, 150],
            [100, 98],
            [210, 96],
            [252, 140],
            [258, 116],
            [150, 164],
            [240, 160],
          ]}
          r={1.6}
        />
      )}
    </>
  )
}

const NAMES: Record<CellId, string> = { plant: 'Rostlinná buňka', animal: 'Živočišná buňka', bacterium: 'Bakteriální buňka' }

export function CellPicture({ cell, hidden, label }: { cell: CellId; hidden?: ReadonlySet<PartId>; label?: string }) {
  const hid = useId().replace(/:/g, '')
  const show = (p: PartId) => !hidden?.has(p)
  let body: ReactNode
  if (cell === 'plant') body = <PlantCell show={show} hid={hid} />
  else if (cell === 'animal') body = <AnimalCell show={show} />
  else body = <Bacterium show={show} hid={hid} />
  return (
    <svg viewBox={`0 ${VIEW[cell][0]} 360 ${VIEW[cell][1]}`} role="img" aria-label={label ?? `${NAMES[cell]} (schéma)`} className="g-cb-svg">
      <defs>
        <Hatch id={`${hid}-g`} color="var(--green)" gap={4} angle={-45} width={0.7} />
        <Hatch id={`${hid}-t`} color="var(--teal)" gap={7} angle={35} width={0.5} />
        <Hatch id={`${hid}-y`} color="var(--yellow)" gap={4} angle={-45} width={0.8} />
      </defs>
      {body}
    </svg>
  )
}

/** Small glyph of a cell type for sorting zones. */
export function CellGlyph({ cell }: { cell: CellId }) {
  return (
    <svg viewBox="0 0 34 24" aria-hidden="true">
      {cell === 'plant' && (
        <g stroke={INK} strokeWidth="1.2">
          <rect x="2" y="2" width="30" height="20" rx="3" fill={mix('green', 30)} />
          <rect x="5" y="5" width="24" height="14" rx="2" fill={mix('green', 8)} strokeWidth="0.8" />
          <ellipse cx="11" cy="9" rx="3.6" ry="1.8" fill="var(--green)" strokeWidth="0.6" />
          <circle cx="22" cy="12" r="3.2" fill={mix('violet', 30)} strokeWidth="0.8" />
        </g>
      )}
      {cell === 'animal' && (
        <g stroke={INK} strokeWidth="1.2">
          <path d="M4 12 C 3 5, 12 2, 18 3 C 27 4, 32 8, 31 14 C 30 20, 22 22, 15 21 C 8 21, 5 17, 4 12 Z" fill={mix('pink', 18)} />
          <circle cx="17" cy="12" r="4" fill={mix('violet', 30)} strokeWidth="0.8" />
        </g>
      )}
      {cell === 'bacterium' && (
        <g stroke={INK} strokeWidth="1.2">
          <rect x="2" y="7" width="26" height="11" rx="5.5" fill={mix('yellow', 34)} />
          <path d="M28 12 q 2 -3 3 0 t 3 0" fill="none" />
          <path d="M9 12 q 3 -3 6 0 t 5 0" fill="none" stroke="var(--violet)" strokeWidth="1" />
        </g>
      )}
    </svg>
  )
}
