import { Draw, Fade, Plate, czNum, f1, url, useNarrow, usePlate } from './kit'
import { imageOf, imageWords, imageX, isMirror, type ImageInfo, type OpticalElement } from './rays'

type Pt = [number, number]

const ELEMENT: Record<OpticalElement, { gen: string; place: [string, string] }> = {
  'convex-lens': { gen: 'spojky (spojné čočky)', place: ['za čočkou', 'před čočkou, na straně předmětu'] },
  'concave-lens': { gen: 'rozptylky (rozptylné čočky)', place: ['za čočkou', 'před čočkou, na straně předmětu'] },
  'concave-mirror': { gen: 'dutého zrcadla', place: ['před zrcadlem', 'za zrcadlem'] },
  'convex-mirror': { gen: 'vypuklého zrcadla', place: ['před zrcadlem', 'za zrcadlem'] },
  'plane-mirror': { gen: 'rovinného zrcadla', place: ['před zrcadlem', 'za zrcadlem'] },
}

const r2 = (n: number) => czNum(Math.round(n * 100) / 100)

export function raysLabel(element: OpticalElement, object: number, info: ImageInfo): string {
  const e = ELEMENT[element]
  const fTxt = element === 'plane-mirror' ? '' : `, ohnisková vzdálenost f = ${r2(info.f)}`
  let s = `Chod paprsků u ${e.gen}: předmět (šipka) ve vzdálenosti a = ${r2(object)}${fTxt}. `
  if (!info.exists) return s + 'Předmět je v ohnisku, paprsky za prvkem jsou rovnoběžné a obraz nevzniká.'
  s += `Obraz vzniká ve vzdálenosti ${r2(Math.abs(info.ai))} ${e.place[info.real ? 0 : 1]} (a′ = ${r2(info.ai)}); je ${imageWords(info).join(', ')}, zvětšení Z = ${r2(info.m)}.`
  if (!info.real) s += ' Zdánlivý obraz leží na čárkovaném prodloužení paprsků.'
  return s
}

interface Ray {
  /** hit height on the element plane (world) */
  y: number
  /** direction after the element, lens-equivalent (x > 0) */
  d: Pt
}

export function RaysView({
  element,
  focal,
  object,
  height,
}: {
  element: OpticalElement
  focal: number
  object: number
  height?: number
}) {
  const nar = useNarrow()
  const narrow = nar.narrow
  const mirror = isMirror(element)
  const plane = element === 'plane-mirror'
  const info = imageOf(element, focal, object)
  const a = object
  const h = height && height > 0 ? height : 1
  const f = info.f
  const F = plane ? a : Math.abs(f)
  const xi = info.exists ? imageX(element, info.ai) : NaN

  // ---- horizontal extent (world) and compression beyond ±Xb
  const Xb = plane ? Infinity : 2.7 * F
  const Cap = plane ? Infinity : 3.7 * F
  const must = [-a, ...(Number.isFinite(xi) ? [xi] : [])]
  let needL = Math.max(plane ? 1.45 * a : 2.45 * F, ...must.map((x) => (x < 0 ? -x * 1.1 + 0.15 * F : 0)))
  let needR = Math.max(plane ? 1.45 * a : element === 'concave-mirror' ? 0.6 * F : 2.45 * F, ...must.map((x) => (x > 0 ? x * 1.1 + 0.15 * F : 0)))
  if (mirror && !plane && Number.isFinite(xi) && xi > 0) needR = Math.max(needR, xi * 1.12)
  needL = Math.max(needL, 0.3 * F)
  const cL = needL > Cap ? (Cap - Xb) / (needL - Xb) : 1
  const cR = needR > Cap ? (Cap - Xb) / (needR - Xb) : 1
  const dispL = cL < 1 ? Cap : needL
  const dispR = cR < 1 ? Cap : needR
  const dx = (x: number) => {
    if (x < -Xb && cL < 1) return -Xb + (x + Xb) * cL
    if (x > Xb && cR < 1) return Xb + (x - Xb) * cR
    return x
  }

  const W = narrow ? 340 : 600
  const m0 = 16
  const kx = (W - 2 * m0) / (dispL + dispR)
  const X = (x: number) => m0 + (dx(x) + dispL) * kx

  // ---- vertical scale
  const Hmax = narrow ? 96 : 118
  let objPx = narrow ? 42 : 50
  const am = info.exists ? Math.abs(info.m) : 1
  if (objPx * am > Hmax) objPx = Math.max(24, Hmax / am)
  const ky = objPx / h
  const imgPx = am * objPx
  const half = Math.min(Hmax, Math.max(objPx, imgPx)) + 16
  const top = 30
  const axisY = top + half
  const bottom = axisY + half
  const H = bottom + 28
  const Y = (y: number) => axisY - y * ky
  const clipped = imgPx > Hmax + 1

  // ---- rays (lens-equivalent; mirrors fold the "after" part back to the left)
  const O: Pt = [-a, h]
  const rays: Ray[] = plane
    ? [
        { y: 0, d: [a, -h] },
        { y: -0.75 * h, d: [a, -1.75 * h] },
      ]
    : [
        { y: h, d: [Math.abs(f), -h * Math.sign(f)] },
        { y: 0, d: [a, -h] },
        ...(info.exists ? [{ y: (-h * f) / (a - f), d: [1, 0] as Pt }] : []),
      ]
  const fold = (p: Pt): Pt => (mirror ? [-p[0], p[1]] : p)
  const endX = mirror ? needL : needR
  /** polyline in world units → display path, split where the compression starts */
  const path = (pts: Pt[]) => {
    const out: Pt[] = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      const [p, q] = [pts[i - 1], pts[i]]
      for (const b of [-Xb, Xb])
        if (Number.isFinite(b) && (p[0] - b) * (q[0] - b) < 0) {
          const t = (b - p[0]) / (q[0] - p[0])
          out.push([b, p[1] + (q[1] - p[1]) * t])
        }
      out.push(q)
    }
    return 'M' + out.map((p) => `${f1(X(p[0]))} ${f1(Y(p[1]))}`).join(' L')
  }
  const tones = ['a', 'c', 'd'] as const
  const drawn = rays.map((r, i) => {
    const hit: Pt = [0, r.y]
    const t = endX / r.d[0]
    const after: Pt = [r.d[0] * t, r.y + r.d[1] * t]
    const main = path([O, hit, fold(after)])
    const ext = info.exists && !info.real ? path([hit, fold([info.ai, info.m * h])]) : null
    return { main, ext, tone: tones[i] }
  })

  // ---- element size
  const hits = rays.map((r) => Math.abs(r.y * ky))
  const L = Math.min(half - 4, Math.max(objPx + 14, ...hits.map((v) => v + 12)))
  const x0 = X(0)

  const marks: { x: number; t: string }[] = plane
    ? []
    : mirror
      ? [
          { x: f > 0 ? -F : F, t: 'F' },
          { x: f > 0 ? -2 * F : 2 * F, t: 'S' },
        ]
      : [
          // a diverging lens has its image focus F′ on the object side
          { x: -F, t: f > 0 ? 'F' : 'F′' },
          { x: F, t: f > 0 ? 'F′' : 'F' },
          { x: -2 * F, t: f > 0 ? '2F' : '2F′' },
          { x: 2 * F, t: f > 0 ? '2F′' : '2F' },
        ]

  const words = imageWords(info)
  const footer = (
    <div className="ph-chips" aria-hidden="true">
      <span className="ph-chips-head">Obraz</span>
      {words.map((w) => (
        <span key={w} className="ph-chip">
          {w}
        </span>
      ))}
      <span className="ph-chips-note">
        <span>a = {r2(a)}</span>
        {!plane && <span>f = {r2(f)}</span>}
        {info.exists && <span>a′ = {r2(info.ai)}</span>}
        {info.exists && <span>Z = {r2(info.m)}</span>}
      </span>
    </div>
  )

  const imgTop = info.exists ? Y(info.m * h) : axisY
  const imgClamped = Math.min(Math.max(imgTop, axisY - half + 2), axisY + half - 2)

  return (
    <Plate
      narrow={nar}
      vb={[0, 0, W, H]}
      max={680}
      label={raysLabel(element, object, info)}
      className="ph-rays"
      footer={footer}
    >
      <RayClip top={axisY - half} h={2 * half} w={W} />
      {/* optical axis */}
      <Draw d={`M${m0 - 6} ${axisY} H${W - m0 + 6}`} className="ph-axis" dur={0.4} />
      <Fade delay={0.1}>
        <Element element={element} x={x0} y={axisY} L={L} />
        {marks.map((mk) => (
          <g key={mk.t}>
            <circle cx={f1(X(mk.x))} cy={axisY} r={3} className="ph-ink-f" />
            <text x={f1(X(mk.x))} y={axisY + 20} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
              {mk.t}
            </text>
          </g>
        ))}
        {/* object */}
        <Draw d={`M${f1(X(-a))} ${axisY} V${f1(Y(h) + 1)}`} className="ph-obj" arrow="ink" dur={0.3} />
        <text x={f1(X(-a))} y={f1(Y(h) - 9)} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
          předmět
        </text>
      </Fade>
      <Clipped>
        {drawn.map((r, i) => (
          <g key={i} className={`ph-tone-${r.tone}`}>
            <Draw d={r.main} className="ph-ray" delay={0.35 + i * 0.25} dur={1} />
            {r.ext && <Draw d={r.ext} className="ph-ray ph-ray-v" delay={1.1 + i * 0.1} dur={0.5} />}
          </g>
        ))}
      </Clipped>
      {cL < 1 && <Break x={X(-Xb)} y0={axisY - half} y1={axisY + half} />}
      {cR < 1 && <Break x={X(Xb)} y0={axisY - half} y1={axisY + half} />}
      {info.exists && (
        <Fade delay={1.5}>
          <Clipped>
            <ImageArrow d={`M${f1(X(xi))} ${axisY} V${f1(imgTop + (info.m > 0 ? 1 : -1))}`} real={info.real} head={!clipped} />
          </Clipped>
          <text
            x={f1(clipped ? X(xi) + (X(xi) > W - 90 ? -8 : 8) : Math.min(Math.max(X(xi), 30), W - 30))}
            y={f1(clipped ? axisY + (info.m > 0 ? 18 : -10) : info.m > 0 ? imgClamped - 8 : imgClamped + 17)}
            textAnchor={clipped ? (X(xi) > W - 90 ? 'end' : 'start') : 'middle'}
            className="ph-lbl ph-lbl-sm ph-halo"
            style={{ fill: 'var(--ph-b)' }}
          >
            obraz{clipped ? ' (přesahuje)' : ''}
          </text>
        </Fade>
      )}
    </Plate>
  )
}

function Clipped({ children }: { children: React.ReactNode }) {
  const { id } = usePlate()
  return <g clipPath={`url(#${id}-clip)`}>{children}</g>
}

function ImageArrow({ d, real, head }: { d: string; real: boolean; head: boolean }) {
  const { id } = usePlate()
  return <path d={d} className={`ph-img ${real ? '' : 'ph-img-v'}`} markerEnd={head ? url(id, 'ah-b') : undefined} />
}

function RayClip({ top, h, w }: { top: number; h: number; w: number }) {
  const { id } = usePlate()
  return (
    <defs>
      <clipPath id={`${id}-clip`}>
        <rect x={0} y={f1(top)} width={w} height={f1(h)} />
      </clipPath>
    </defs>
  )
}

/** Axis break (the drawing is shortened beyond it). */
function Break({ x, y0, y1 }: { x: number; y0: number; y1: number }) {
  const zig = (dx: number) => {
    let d = `M${f1(x + dx)} ${f1(y0)}`
    for (let y = y0; y < y1; y += 8) d += ` L${f1(x + dx + ((y / 8) % 2 < 1 ? 2.5 : -2.5))} ${f1(y + 8)}`
    return d
  }
  return (
    <g>
      <rect x={f1(x - 4)} y={f1(y0)} width={8} height={f1(y1 - y0)} className="ph-break" />
      <path d={zig(-4)} className="ph-o ph-thin" />
      <path d={zig(4)} className="ph-o ph-thin" />
    </g>
  )
}

function Element({ element, x, y, L }: { element: OpticalElement; x: number; y: number; L: number }) {
  const { id } = usePlate()
  const t = 7
  if (element === 'convex-lens' || element === 'concave-lens') {
    const d =
      element === 'convex-lens'
        ? `M${f1(x)} ${f1(y - L)} Q${f1(x + 2 * t)} ${f1(y)} ${f1(x)} ${f1(y + L)} Q${f1(x - 2 * t)} ${f1(y)} ${f1(x)} ${f1(y - L)} Z`
        : `M${f1(x - t)} ${f1(y - L)} H${f1(x + t)} Q${f1(x + 1)} ${f1(y)} ${f1(x + t)} ${f1(y + L)} H${f1(x - t)} Q${f1(x - 1)} ${f1(y)} ${f1(x - t)} ${f1(y - L)} Z`
    return (
      <g>
        <path d={d} className="ph-glass" />
        <path d={d} fill={url(id, 'b')} opacity={0.5} />
        <path d={d} className="ph-o" />
        <path d={`M${f1(x)} ${f1(y - L)} V${f1(y + L)}`} className="ph-o ph-thin ph-dot2" />
      </g>
    )
  }
  const s = element === 'concave-mirror' ? -6 : element === 'convex-mirror' ? 6 : 0
  // point on the mirror curve for parameter u ∈ [−1, 1]
  const at = (u: number): Pt => [x + s * u * u, y + u * L]
  const d = `M${f1(x + s)} ${f1(y - L)} Q${f1(x - s)} ${f1(y)} ${f1(x + s)} ${f1(y + L)}`
  let ticks = ''
  for (let u = -1; u <= 1.001; u += 0.14) {
    const p = at(u)
    ticks += `M${f1(p[0] + 1)} ${f1(p[1])} l7 -7 `
  }
  return (
    <g>
      <path d={ticks} className="ph-o ph-thin" />
      <path d={d} className="ph-o" style={{ strokeWidth: 2.6 }} />
    </g>
  )
}
