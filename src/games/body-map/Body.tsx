/**
 * Engraved human body seen from the front (viewBox 320 × 520, cropped vertically per task).
 * The person's right side is on the viewer's left – marked P / L. Every organ is its own
 * drawing; a task shows only the organs it needs (or none, when the learner places them).
 * Marker points are in levels.ts (ORGANS[…].at) and sit on these drawings.
 */
import { useId, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ORGANS, type OrganId } from './levels'

type P = [number, number]
const INK = 'var(--edge)'
const mix = (c: string, p: number) => `color-mix(in srgb, var(--${c}) ${p}%, var(--surface))`

/* ------------------------------------------------------------------ silhouette */

interface Seg {
  c?: [P, P]
  to: P
}
const START: P = [174, 88]
/** Right half of the outline (viewer's right), from the neck down to the crotch. */
const RIGHT: Seg[] = [
  { to: [175, 118] },
  { c: [[190, 126], [224, 124]], to: [240, 138] },
  { c: [[252, 150], [256, 190]], to: [258, 230] },
  { c: [[260, 270], [266, 320]], to: [268, 360] },
  { c: [[270, 380], [272, 400]], to: [268, 412] },
  { c: [[264, 420], [254, 418]], to: [252, 408] },
  { c: [[250, 390], [248, 370]], to: [246, 350] },
  { c: [[242, 310], [240, 260]], to: [238, 200] },
  { c: [[237, 185], [235, 175]], to: [232, 168] },
  { c: [[236, 210], [234, 260]], to: [228, 304] },
  { c: [[226, 334], [240, 360]], to: [240, 400] },
  { c: [[240, 440], [232, 480]], to: [228, 518] },
  { to: [166, 518] },
  { c: [[166, 490], [164, 466]], to: [160, 456] },
]
const m = ([x, y]: P): P => [320 - x, y]
const pt = (p: P) => `${p[0]} ${p[1]}`

function silhouette(): string {
  let d = `M${pt(START)}`
  for (const s of RIGHT) d += s.c ? ` C${pt(s.c[0])} ${pt(s.c[1])} ${pt(s.to)}` : ` L${pt(s.to)}`
  const pts = [START, ...RIGHT.map((s) => s.to)]
  for (let k = RIGHT.length - 1; k >= 0; k--) {
    const s = RIGHT[k]
    const from = pts[k]
    d += s.c ? ` C${pt(m(s.c[1]))} ${pt(m(s.c[0]))} ${pt(m(from))}` : ` L${pt(m(from))}`
  }
  return d + ' Z'
}
const OUTLINE = silhouette()

/* ------------------------------------------------------------------ helpers */

function Tube({ d, color, w = 7 }: { d: string; color: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 2.4} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  )
}

const both = (node: (flip: boolean) => ReactNode) => (
  <>
    {node(false)}
    <g transform="translate(320 0) scale(-1 1)">{node(true)}</g>
  </>
)

/* ------------------------------------------------------------------ organs */

type Draw = (h: string) => ReactNode

const BONE = mix('yellow', 14)
const STOMACH = 'M190 280 C 206 272, 226 282, 226 300 C 226 322, 212 338, 194 342 C 180 344, 170 338, 168 330 C 176 330, 188 328, 194 318 C 200 306, 196 296, 190 290 Z'

const DRAW: Partial<Record<OrganId, Draw>> = {
  mozek: (h) => (
    <g>
      <path d="M128 52 C 120 26, 146 12, 164 14 C 186 15, 200 30, 194 52 C 190 62, 176 64, 160 62 C 144 64, 132 62, 128 52 Z" fill={mix('pink', 24)} stroke={INK} strokeWidth="1.4" />
      <path d="M128 52 C 120 26, 146 12, 164 14 C 186 15, 200 30, 194 52 C 190 62, 176 64, 160 62 C 144 64, 132 62, 128 52 Z" fill={`url(#${h}-ink)`} opacity="0.6" />
      <path
        d="M160 16 C 158 30, 162 44, 160 62 M140 24 q 8 6 4 14 t 6 12 M178 22 q -6 8 0 14 t -4 14 M134 44 q 8 -2 10 6 M186 44 q -8 -2 -10 6"
        fill="none"
        stroke={INK}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </g>
  ),
  oko: () =>
    both(() => (
      <g>
        <ellipse cx="147" cy="56" rx="7" ry="3.8" fill="var(--surface)" stroke={INK} strokeWidth="1.1" />
        <circle cx="147" cy="56" r="2.5" fill={mix('blue', 70)} stroke={INK} strokeWidth="0.6" />
        <circle cx="147" cy="56" r="1" fill={INK} />
      </g>
    )),
  ucho: () =>
    both(() => (
      <path d="M128 56 C 118 50, 112 62, 116 72 C 118 79, 125 80, 128 75" fill={mix('pink', 30)} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
    )),
  nosni_dutina: () => <path d="M154 54 L160 50 L166 54 L169 72 L151 72 Z" fill={mix('blue', 22)} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />,
  usni_dutina: () => (
    <g>
      <ellipse cx="160" cy="80" rx="11" ry="4.6" fill={mix('pink', 45)} stroke={INK} strokeWidth="1.1" />
      <path d="M152 80 q 8 2.5 16 0" fill="none" stroke={INK} strokeWidth="0.7" />
    </g>
  ),
  hltan: () => <rect x="154.5" y="70" width="11" height="28" rx="4" fill={mix('pink', 35)} stroke={INK} strokeWidth="1.1" />,
  hrtan: () => (
    <g>
      <path d="M151 97 L169 97 L166 112 L154 112 Z" fill={mix('blue', 22)} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M153 102 h14 M154 107 h12" stroke={INK} strokeWidth="0.7" />
    </g>
  ),
  stitna: () => (
    <g fill={mix('violet', 40)} stroke={INK} strokeWidth="1.1">
      <ellipse cx="151" cy="118" rx="6" ry="9" transform="rotate(-12 151 118)" />
      <ellipse cx="169" cy="118" rx="6" ry="9" transform="rotate(12 169 118)" />
      <rect x="153" y="117" width="14" height="5" rx="2" />
    </g>
  ),
  prudusnice: () => (
    <g>
      <Tube d="M160 110 L160 156 M160 156 Q 150 162 140 172 M160 156 Q 170 162 180 172" color={mix('blue', 20)} w={8} />
      <path d="M155.5 118 h9 M155.5 126 h9 M155.5 134 h9 M155.5 142 h9 M155.5 150 h9" stroke={INK} strokeWidth="0.8" />
    </g>
  ),
  plice: (h) => (
    <g>
      {both((flip) => (
        <g>
          <path
            d={
              flip
                ? 'M150 150 C 130 146, 104 170, 98 214 C 94 246, 100 262, 112 266 C 126 270, 140 262, 146 256 C 136 248, 140 234, 150 228 Z'
                : 'M150 150 C 130 146, 104 170, 98 214 C 94 246, 100 262, 112 266 C 128 270, 146 262, 150 248 Z'
            }
            fill={mix('pink', 30)}
            stroke={INK}
            strokeWidth="1.4"
          />
          <path
            d={
              flip
                ? 'M150 150 C 130 146, 104 170, 98 214 C 94 246, 100 262, 112 266 C 126 270, 140 262, 146 256 C 136 248, 140 234, 150 228 Z'
                : 'M150 150 C 130 146, 104 170, 98 214 C 94 246, 100 262, 112 266 C 128 270, 146 262, 150 248 Z'
            }
            fill={`url(#${h}-pink)`}
          />
          <path
            d={flip ? 'M140 172 L128 188 M134 180 L124 196 M128 188 L114 200 M138 176 L140 204' : 'M140 172 L126 190 L114 214 M126 190 L120 200 M132 182 L136 210 M120 200 L106 214 M114 214 L112 232'}
            fill="none"
            stroke={INK}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          {!flip && <path d="M104 196 C 118 202, 134 200, 148 196 M100 232 C 116 228, 134 236, 150 240" fill="none" stroke={INK} strokeWidth="0.7" strokeDasharray="3 2" />}
        </g>
      ))}
    </g>
  ),
  srdce: () => (
    <g>
      <path d="M160 204 C 166 192, 184 194, 188 202 C 198 200, 206 212, 200 226 C 196 238, 186 248, 182 256 C 172 248, 158 236, 156 224 C 154 214, 156 208, 160 204 Z" fill={mix('pink', 60)} stroke={INK} strokeWidth="1.4" />
      <Tube d="M172 200 C 168 184, 190 180, 192 196" color={mix('pink', 60)} w={5} />
      <path d="M172 206 C 176 222, 178 236, 182 252" fill="none" stroke={INK} strokeWidth="0.8" />
    </g>
  ),
  branice: () => <Tube d="M98 268 C 116 240, 148 246, 160 258 C 174 252, 204 254, 224 278" color={mix('accent', 40)} w={4} />,
  jicen: () => <Tube d="M160 96 L160 250 C 160 266, 176 276, 194 282" color={mix('pink', 40)} w={6} />,
  jatra: (h) => (
    <g>
      <path d="M96 272 C 120 262, 170 264, 196 276 C 200 282, 190 292, 172 298 C 150 306, 130 318, 112 318 C 98 316, 92 296, 96 272 Z" fill={mix('accent', 48)} stroke={INK} strokeWidth="1.4" />
      <path d="M96 272 C 120 262, 170 264, 196 276 C 200 282, 190 292, 172 298 C 150 306, 130 318, 112 318 C 98 316, 92 296, 96 272 Z" fill={`url(#${h}-ink)`} opacity="0.7" />
      <path d="M150 270 C 148 284, 144 296, 140 308" fill="none" stroke={INK} strokeWidth="0.8" />
    </g>
  ),
  zlucnik: () => <ellipse cx="146" cy="322" rx="6.5" ry="10" transform="rotate(-22 146 322)" fill={mix('green', 55)} stroke={INK} strokeWidth="1.2" />,
  zaludek: (h) => (
    <g>
      <path d={STOMACH} fill={mix('pink', 38)} stroke={INK} strokeWidth="1.4" />
      <path d={STOMACH} fill={`url(#${h}-pink)`} />
    </g>
  ),
  slinivka: () => (
    <g>
      <path d="M150 344 C 160 334, 196 336, 222 330 C 229 329, 231 338, 222 342 C 200 348, 176 352, 156 355 C 146 356, 144 348, 150 344 Z" fill={mix('yellow', 50)} stroke={INK} strokeWidth="1.3" />
      <path d="M156 346 q 6 -3 12 0 t 12 0 t 12 -1 t 12 -2 t 12 -3" fill="none" stroke={INK} strokeWidth="0.6" />
    </g>
  ),
  slezina: () => <ellipse cx="221" cy="290" rx="6.5" ry="13" transform="rotate(18 221 290)" fill={mix('violet', 45)} stroke={INK} strokeWidth="1.3" />,
  tenke_strevo: () => (
    <Tube
      d="M148 362 C 132 362, 128 376, 142 378 C 156 380, 176 372, 186 380 C 196 388, 182 398, 168 394 C 150 390, 132 394, 134 404 C 136 414, 156 410, 170 410 C 186 410, 196 416, 190 424 C 184 430, 168 426, 160 428"
      color={mix('pink', 32)}
      w={7}
    />
  ),
  tluste_strevo: () => (
    <g>
      <Tube d="M112 424 C 104 410, 102 380, 106 358 C 108 348, 130 350, 160 352 C 190 354, 210 346, 214 358 C 218 380, 216 404, 212 420 C 208 432, 186 428, 172 432" color={mix('accent', 30)} w={10} />
      <path d="M112 424 C 104 410, 102 380, 106 358 C 108 348, 130 350, 160 352 C 190 354, 210 346, 214 358 C 218 380, 216 404, 212 420 C 208 432, 186 428, 172 432" fill="none" stroke={INK} strokeWidth="0.7" strokeDasharray="1 6" />
    </g>
  ),
  konecnik: () => <Tube d="M172 432 C 164 436, 160 442, 160 454" color={mix('accent', 30)} w={7} />,
  ledviny: () =>
    both((flip) => (
      <path
        d={flip ? 'M122 324 C 108 324, 106 360, 120 364 C 128 366, 132 356, 128 348 C 126 342, 130 336, 130 332 C 130 326, 126 324, 122 324 Z' : 'M122 328 C 108 328, 106 364, 120 368 C 128 370, 132 360, 128 352 C 126 346, 130 340, 130 336 C 130 330, 126 328, 122 328 Z'}
        fill={mix('accent', 55)}
        stroke={INK}
        strokeWidth="1.3"
      />
    )),
  nadledviny: () =>
    both((flip) => <path d={flip ? 'M114 324 L122 312 L131 323 Z' : 'M114 328 L122 316 L131 327 Z'} fill={mix('yellow', 55)} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />),
  mocovod: () => (
    <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
      <path d="M130 352 C 136 380, 140 400, 152 414" />
      <path d="M190 346 C 184 380, 180 400, 168 414" />
    </g>
  ),
  mocovy_mechyr: () => <ellipse cx="160" cy="418" rx="15" ry="11.5" fill={mix('yellow', 40)} stroke={INK} strokeWidth="1.3" />,
  mocova_trubice: () => <Tube d="M160 429 L160 454" color={mix('yellow', 40)} w={3} />,
  micha: () => (
    <g>
      <Tube d="M160 84 L160 330" color={mix('yellow', 60)} w={4} />
      <path d="M160 140 l-10 4 M160 140 l10 4 M160 180 l-10 4 M160 180 l10 4 M160 220 l-10 4 M160 220 l10 4 M160 260 l-10 4 M160 260 l10 4 M160 300 l-10 4 M160 300 l10 4" stroke={INK} strokeWidth="0.9" />
      <path d="M160 330 l-6 30 M160 330 l6 30 M160 330 l0 34" stroke={INK} strokeWidth="0.8" />
    </g>
  ),
  nervy: () =>
    both(() => (
      <g fill="none" stroke="var(--yellow)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M160 130 C 130 128, 94 136, 80 160 C 70 200, 70 280, 62 380" />
        <path d="M160 340 C 150 380, 136 420, 132 516" />
        <path d="M70 290 l8 18 M134 450 l10 30" strokeWidth="1.1" />
      </g>
    )),
  hypofyza: () => (
    <g>
      <path d="M128 52 C 120 26, 146 12, 164 14 C 186 15, 200 30, 194 52 C 190 62, 176 64, 160 62 C 144 64, 132 62, 128 52 Z" fill="none" stroke={INK} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <path d="M160 58 L160 62" stroke={INK} strokeWidth="1.2" />
      <ellipse cx="160" cy="66" rx="5" ry="4" fill={mix('violet', 55)} stroke={INK} strokeWidth="1.1" />
    </g>
  ),
  brzlik: () => (
    <g fill={mix('teal', 35)} stroke={INK} strokeWidth="1.1">
      <ellipse cx="154" cy="168" rx="7" ry="13" transform="rotate(8 154 168)" />
      <ellipse cx="166" cy="170" rx="7" ry="14" transform="rotate(-8 166 170)" />
    </g>
  ),
  mandle: () =>
    both(() => <ellipse cx="152" cy="88" rx="3.6" ry="5" fill={mix('teal', 45)} stroke={INK} strokeWidth="1" />),
  mizni_uzliny: () => (
    <g>
      {both(() => (
        <g>
          <path d="M140 108 C 120 140, 104 152, 92 162 M92 162 C 110 250, 130 360, 126 428" fill="none" stroke="var(--teal)" strokeWidth="0.9" strokeDasharray="3 2" />
          {(
            [
              [140, 108],
              [92, 162],
              [126, 428],
              [146, 372],
            ] as P[]
          ).map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="4.2" ry="3" fill={mix('teal', 45)} stroke={INK} strokeWidth="1" />
          ))}
        </g>
      ))}
    </g>
  ),
  kostni_dren: () =>
    both(() => (
      <g>
        <Tube d="M130 404 L125 516" color={BONE} w={13} />
        <path d="M129.4 420 L125.8 516" stroke={mix('pink', 70)} strokeWidth="5" strokeLinecap="round" />
      </g>
    )),
  lebka: () => (
    <g>
      <path d="M128 52 C 124 22, 146 10, 160 10 C 174 10, 196 22, 192 52 C 190 64, 186 70, 184 78 C 180 90, 170 94, 160 94 C 150 94, 140 90, 136 78 C 134 70, 130 64, 128 52 Z" fill={BONE} stroke={INK} strokeWidth="1.4" />
      <ellipse cx="147" cy="56" rx="7" ry="6" fill={INK} opacity="0.75" />
      <ellipse cx="173" cy="56" rx="7" ry="6" fill={INK} opacity="0.75" />
      <path d="M157 66 L160 74 L163 66 Z M146 82 h28 M150 80 v4 M155 80 v4 M160 80 v4 M165 80 v4 M170 80 v4" fill={INK} stroke={INK} strokeWidth="0.8" />
    </g>
  ),
  klicni_kost: () =>
    both(() => <Tube d="M154 126 C 140 122, 132 132, 120 130 C 110 128, 102 130, 94 136" color={BONE} w={4.5} />),
  hrudni_kost: () => <path d="M154 132 L166 132 L165 210 L162 230 L158 230 L155 210 Z" fill={BONE} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />,
  zebra: () =>
    both(() => (
      <g fill="none" strokeLinecap="round">
        {[0, 1, 2, 3, 4, 5, 6].map((k) => {
          const y = 140 + k * 14
          const d = `M156 ${y} C 130 ${y - 6}, ${104 - k} ${y + 2}, ${100 - k} ${y + 22} C ${99 - k} ${y + 30}, ${102 - k} ${y + 36}, ${106 - k} ${y + 40}`
          return (
            <g key={k}>
              <path d={d} stroke={INK} strokeWidth="5" />
              <path d={d} stroke={BONE} strokeWidth="3" />
            </g>
          )
        })}
      </g>
    )),
  pater: () => (
    <g fill={BONE} stroke={INK} strokeWidth="1">
      {Array.from({ length: 22 }, (_, k) => (
        <rect key={k} x={k > 16 ? 151 : 153} y={92 + k * 14} width={k > 16 ? 18 : 14} height="11" rx="3" />
      ))}
    </g>
  ),
  panev: () => (
    <path
      d="M110 366 C 98 378, 102 410, 128 420 C 140 424, 150 418, 160 424 C 170 418, 180 424, 192 420 C 218 410, 222 378, 210 366 C 196 382, 176 378, 160 392 C 144 378, 124 382, 110 366 Z"
      fill={BONE}
      stroke={INK}
      strokeWidth="1.4"
    />
  ),
  pazni_kost: () => both(() => <Tube d="M80 146 L68 292" color={BONE} w={9} />),
  stehenni_kost: () =>
    both(() => (
      <g>
        <Tube d="M130 404 L125 516" color={BONE} w={13} />
        <circle cx="134" cy="404" r="8" fill={BONE} stroke={INK} strokeWidth="1.2" />
      </g>
    )),
}

/** The drawing that shows an organ (several marker points share one drawing). */
export const drawingOf = (id: OrganId): OrganId => ORGANS[id].draw ?? id

/* ------------------------------------------------------------------ picture */

export function cropOf(points: readonly P[]): [number, number] {
  const ys = points.map((p) => p[1])
  let y0 = Math.max(0, Math.min(...ys) - 58)
  let y1 = Math.min(520, Math.max(...ys) + 58)
  if (y1 - y0 < 250) {
    const c = (y0 + y1) / 2
    y0 = Math.max(0, c - 125)
    y1 = Math.min(520, y0 + 250)
    y0 = Math.max(0, y1 - 250)
  }
  return [Math.round(y0), Math.round(y1)]
}

export function BodyPicture({
  show,
  crop,
  route,
  label,
  order,
}: {
  show: ReadonlySet<OrganId>
  crop: [number, number]
  /** Points of a path drawn over the body (after a path task). */
  route?: readonly P[]
  label: string
  /** Drawing order (back to front). */
  order?: readonly OrganId[]
}) {
  const h = useId().replace(/:/g, '')
  const still = useReducedMotion()
  const [y0, y1] = crop
  const ids = (order ?? DRAW_ORDER).filter((id) => show.has(id))
  return (
    <svg viewBox={`0 ${y0} 320 ${y1 - y0}`} role="img" aria-label={label} className="g-bm-svg">
      <defs>
        <pattern id={`${h}-ink`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--hatch)" strokeWidth="1.2" />
        </pattern>
        <pattern id={`${h}-pink`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--pink)" strokeWidth="0.6" opacity="0.6" />
        </pattern>
        <pattern id={`${h}-body`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--hatch)" strokeWidth="1" />
        </pattern>
        <clipPath id={`${h}-right`}>
          <rect x="0" y="0" width="118" height="520" />
        </clipPath>
      </defs>
      <path d={OUTLINE} fill={mix('accent', 9)} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d={OUTLINE} fill={`url(#${h}-body)`} clipPath={`url(#${h}-right)`} />
      <ellipse cx="160" cy="50" rx="34" ry="42" fill={mix('accent', 9)} stroke={INK} strokeWidth="1.6" />
      <line x1="160" y1={Math.max(y0, 96)} x2="160" y2="452" stroke={INK} strokeWidth="0.6" strokeDasharray="2 5" opacity="0.45" />
      <g className="g-bm-side" aria-hidden="true">
        <text x="26" y={y0 + 26} textAnchor="middle">
          P
        </text>
        <text x="26" y={y0 + 40} textAnchor="middle" className="g-bm-side-small">
          pravá
        </text>
        <text x="294" y={y0 + 26} textAnchor="middle">
          L
        </text>
        <text x="294" y={y0 + 40} textAnchor="middle" className="g-bm-side-small">
          levá
        </text>
      </g>
      {ids.map((id) => (
        <motion.g
          key={id}
          data-organ={id}
          initial={still ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          {DRAW[id]?.(h)}
        </motion.g>
      ))}
      {route && route.length > 1 && (
        <motion.path
          d={`M${route.map(pt).join(' L')}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 0"
          initial={still ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      )}
      {route?.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="3.4" fill="var(--accent)" stroke={INK} strokeWidth="1" />
      ))}
    </svg>
  )
}

/** Back to front. */
export const DRAW_ORDER: OrganId[] = [
  'pater',
  'zebra',
  'hrudni_kost',
  'klicni_kost',
  'panev',
  'pazni_kost',
  'stehenni_kost',
  'kostni_dren',
  'lebka',
  'micha',
  'nervy',
  'ledviny',
  'nadledviny',
  'mocovod',
  'mocovy_mechyr',
  'mocova_trubice',
  'mizni_uzliny',
  'plice',
  'prudusnice',
  'jicen',
  'brzlik',
  'srdce',
  'branice',
  'slezina',
  'jatra',
  'zlucnik',
  'zaludek',
  'slinivka',
  'tluste_strevo',
  'tenke_strevo',
  'konecnik',
  'mozek',
  'hypofyza',
  'oko',
  'ucho',
  'nosni_dutina',
  'usni_dutina',
  'hltan',
  'hrtan',
  'stitna',
  'mandle',
]

export const DRAWN = new Set(Object.keys(DRAW) as OrganId[])
