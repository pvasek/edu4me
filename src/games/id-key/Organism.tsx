/**
 * Engraved line drawings of the organisms in the key (viewBox 120 × 90, theme tokens only).
 * Each drawing shows the features the key asks about (brvy, jehlice po dvou, klepeta,
 * žluté půlměsíčky…). Microscopic organisms sit in a round field of view.
 */
import { useId, type ReactNode } from 'react'
import type { PicId } from './levels'

type P = { x: number; y: number }
const tint = (c: string, o = 0.3) => ({ fill: `var(--${c})`, fillOpacity: o })
const D = (pts: P[], close = false) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + (close ? ' Z' : '')
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Points along an ellipse (rotated by `rot` degrees). */
function ellipsePts(cx: number, cy: number, rx: number, ry: number, n: number, rot = 0) {
  const r = (rot * Math.PI) / 180
  return range(n).map((i) => {
    const a = (2 * Math.PI * i) / n
    const x = rx * Math.cos(a)
    const y = ry * Math.sin(a)
    // outward normal of the ellipse
    let nx = Math.cos(a) / rx
    let ny = Math.sin(a) / ry
    const l = Math.hypot(nx, ny)
    nx /= l
    ny /= l
    return {
      x: cx + x * Math.cos(r) - y * Math.sin(r),
      y: cy + x * Math.sin(r) + y * Math.cos(r),
      nx: nx * Math.cos(r) - ny * Math.sin(r),
      ny: nx * Math.sin(r) + ny * Math.cos(r),
    }
  })
}

/** Short strokes standing out of an ellipse (cilia, spines, hair). */
function fringe(cx: number, cy: number, rx: number, ry: number, n: number, len: number, rot = 0) {
  return ellipsePts(cx, cy, rx, ry, n, rot)
    .map((p) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)}l${(p.nx * len).toFixed(1)} ${(p.ny * len).toFixed(1)}`)
    .join('')
}

/** Points of a curve y = f(x) between x0 and x1. */
const curve = (f: (x: number) => number, x0: number, x1: number, n = 40): P[] => range(n + 1).map((i) => ({ x: x0 + ((x1 - x0) * i) / n, y: f(x0 + ((x1 - x0) * i) / n) }))

/** A tube along a centre line: ink outline, paper body, tinted. */
function Tube({ d, w, c, o = 0.35, children }: { d: string; w: number; c: string; o?: number; children?: ReactNode }) {
  return (
    <>
      <path d={d} stroke="var(--ink)" strokeWidth={w + 3} />
      <path d={d} stroke="var(--surface)" strokeWidth={w} />
      <path d={d} stroke={`var(--${c})`} strokeOpacity={o} strokeWidth={w} />
      {children}
    </>
  )
}

/** Round microscope field of view. */
function Field({ children }: { children: ReactNode }) {
  return (
    <>
      <circle cx={60} cy={45} r={43} {...tint('blue', 0.06)} strokeWidth={1} />
      <circle cx={60} cy={45} r={40.5} strokeWidth={0.5} strokeDasharray="1 3" />
      {children}
    </>
  )
}

/** Subject black (ladybird spots, blackbird, viper zigzag): stays dark in dark mode too. */
const BLACK = '#2b2a30'
/** Subject white (the garden spider's cross). */
const WHITE = '#f4f0e6'
const thin = { strokeWidth: 0.9 }
const hair = { strokeWidth: 0.6 }

/** Five-petal flower centred at (x, y). */
const fivePetals = (x: number, y: number, r: number) =>
  range(5).map((i) => {
    const a = (i * 72 - 90) * (Math.PI / 180)
    return <ellipse key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} rx={r * 0.85} ry={r * 0.75} transform={`rotate(${i * 72} ${x + Math.cos(a) * r} ${y + Math.sin(a) * r})`} {...tint('pink', 0.35)} />
  })

const PICS: Record<PicId, (hatch: string) => ReactNode> = {
  /* ---------------------------------------------------------- level 1 */
  ecoli: () => (
    <Field>
      <path d="M88 41c6-6 9 2 14-3s7-2 9 0" {...thin} />
      <path d="M88 50c6 4 9-3 14 3s7 5 9 2" {...thin} />
      <path d="M32 44c-6-5-9 3-14-2s-6-3-8 0" {...thin} />
      <path d="M33 50c-5 5-9-2-13 4" {...thin} />
      <rect x={31} y={34} width={58} height={21} rx={10.5} {...tint('green', 0.22)} />
      <rect x={34} y={37} width={52} height={15} rx={7.5} {...hair} />
      <path d="M46 45c3-5 6 5 9 0s6 5 9 0s6 5 9 0" strokeWidth={1.1} stroke="var(--violet)" />
      {[[40, 41], [43, 49], [80, 41], [77, 49], [58, 40], [66, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="var(--ink)" stroke="none" />
      ))}
      <path d="M44 34l-1-4M54 34v-4M66 34l1-4M76 34l2-4M48 55l-1 4M60 55v4M72 55l1 4" {...hair} />
    </Field>
  ),
  trepka: () => (
    <Field>
      <path d={fringe(60, 45, 33, 15, 64, 3.2, -14)} {...hair} />
      <ellipse cx={60} cy={45} rx={33} ry={15} transform="rotate(-14 60 45)" {...tint('teal', 0.2)} />
      <path d="M50 52c6-2 10-7 12-3" {...thin} />
      <ellipse cx={63} cy={43} rx={8} ry={5} transform="rotate(-14 63 43)" {...tint('violet', 0.45)} {...thin} />
      <circle cx={71} cy={40} r={1.8} fill="var(--violet)" stroke="none" />
      <path d={fringe(36, 50, 3, 3, 8, 2.5)} {...hair} />
      <circle cx={36} cy={50} r={3} {...tint('blue', 0.3)} {...thin} />
      <path d={fringe(84, 37, 3, 3, 8, 2.5)} {...hair} />
      <circle cx={84} cy={37} r={3} {...tint('blue', 0.3)} {...thin} />
      <circle cx={52} cy={44} r={2.2} {...tint('yellow', 0.5)} {...hair} />
      <circle cx={46} cy={47} r={1.8} {...tint('yellow', 0.5)} {...hair} />
    </Field>
  ),
  menavka: () => (
    <Field>
      <path
        d="M42 40c-8-6-4-18 6-14 2-10 16-11 18-2 8-7 20-2 16 8 10 0 14 10 6 15 8 6 2 16-8 13 0 9-14 11-18 3-6 7-18 4-16-5-9-1-12-12-4-18z"
        {...tint('pink', 0.22)}
      />
      <circle cx={60} cy={46} r={6.5} {...tint('violet', 0.45)} {...thin} />
      <circle cx={46} cy={50} r={3.4} {...tint('yellow', 0.45)} {...thin} />
      <circle cx={72} cy={36} r={2.6} {...tint('yellow', 0.45)} {...thin} />
      <circle cx={75} cy={55} r={3.6} {...tint('blue', 0.3)} {...thin} />
      <path d="M50 36l1 1M66 58l1 1M56 60l1 0M78 46l1 1M44 42l1 1" strokeWidth={1.4} />
    </Field>
  ),
  kvasinka: () => (
    <Field>
      <ellipse cx={55} cy={50} rx={23} ry={18} {...tint('yellow', 0.22)} strokeWidth={2.4} />
      <ellipse cx={55} cy={50} rx={20} ry={15} {...hair} />
      <ellipse cx={83} cy={31} rx={10} ry={8} {...tint('yellow', 0.22)} strokeWidth={2.4} />
      <ellipse cx={83} cy={31} rx={7.5} ry={5.5} {...hair} />
      <circle cx={50} cy={47} r={5} {...tint('violet', 0.45)} {...thin} />
      <circle cx={62} cy={55} r={6} {...tint('blue', 0.25)} {...thin} />
      <path d="M44 58l1 1M66 42l1 1M41 47l1 0M85 32l1 1" strokeWidth={1.4} />
    </Field>
  ),
  hrib: (h) => (
    <>
      <path d="M50 50c-6 10-10 22-7 32h34c3-10-1-22-7-32z" {...tint('yellow', 0.18)} />
      <path d="M48 58l24 8M47 66l26 8M48 74l22 6M50 56l-1 26M58 55v27M66 55l2 27" stroke={`url(#${h})`} strokeWidth={6} opacity={0.5} />
      <path d="M49 60l3 3 3-3 3 3 3-3 3 3 3-3 3 3M48 68l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3M48 76l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3" {...hair} />
      <path d="M22 46c2-26 74-26 76 0z" {...tint('accent', 0.4)} />
      <path d="M32 40c6-8 16-12 26-13" {...hair} />
      <path d="M22 46c10 6 66 6 76 0" {...tint('yellow', 0.45)} />
      {range(16).map((i) => (
        <circle key={i} cx={28 + i * 4.3} cy={49 + Math.sin((i / 15) * Math.PI) * 1.6} r={0.7} fill="var(--ink)" stroke="none" />
      ))}
      <path d="M14 82h92" {...thin} />
    </>
  ),
  smrk: (h) => (
    <>
      <path d="M60 6l9 15h-5l11 17h-6l13 18h-7l14 18H30l14-18h-7l13-18h-6l11-17h-5z" {...tint('green', 0.3)} />
      <path d="M60 6l9 15h-5l11 17h-6l13 18h-7l14 18H30" fill={`url(#${h})`} stroke="none" opacity={0.35} />
      <path d="M57 70v14h6V70" {...tint('accent', 0.3)} />
      <path d="M60 22v48M60 34l-8 5M60 34l8 5M60 50l-11 6M60 50l11 6M60 64l-14 7M60 64l14 7" {...hair} />
      <ellipse cx={82} cy={65} rx={3} ry={7} {...tint('accent', 0.45)} {...thin} />
      <path d="M82 58v-3" {...thin} />
      <ellipse cx={42} cy={60} rx={2.6} ry={6} {...tint('accent', 0.45)} {...thin} />
      <path d="M42 54v-3" {...thin} />
      <path d="M20 84h80" {...thin} />
    </>
  ),
  sedmikraska: () => (
    <>
      <path d="M60 40c-1 14 1 30-1 42" />
      <path d="M58 82c-12-2-24-8-30-4 6 2 18 6 30 4zM61 82c12-3 24-10 31-6-6 3-19 7-31 6zM59 82c-6-6-16-10-18-16 6 2 14 8 18 16z" {...tint('green', 0.35)} {...thin} />
      {range(18).map((i) => (
        <ellipse key={i} cx={60} cy={20} rx={2.4} ry={11} transform={`rotate(${i * 20} 60 31)`} fill="var(--surface)" {...thin} />
      ))}
      {range(18).map((i) => (
        <path key={`t${i}`} d="M58.6 11.5a1.6 1.6 0 0 1 2.8 0" stroke="var(--pink)" strokeWidth={1.4} transform={`rotate(${i * 20} 60 31)`} />
      ))}
      <circle cx={60} cy={31} r={7} {...tint('yellow', 0.75)} />
      <path d="M56 29l1 1M60 27l1 1M63 30l1 1M58 33l1 1M62 34l1 1" strokeWidth={1.2} />
      <path d="M14 84h92" {...thin} />
    </>
  ),
  zizala: () => {
    const d = 'M12 62C26 40 44 72 62 54S94 34 110 48'
    return (
      <Tube d={d} w={8} c="pink" o={0.45}>
        <path d={d} stroke="var(--ink)" strokeWidth={8} strokeDasharray="0.6 2.8" opacity={0.55} />
        <path d={d} pathLength={100} stroke="var(--accent)" strokeOpacity={0.55} strokeWidth={9.5} strokeDasharray="0 30 9 100" />
        <path d="M18 76h86" {...thin} />
      </Tube>
    )
  },
  slunecko: () => (
    <>
      <path d="M38 44l-12-6-4 6M37 54l-13 2-3 7M40 62l-9 10-1 6M82 44l12-6 4 6M83 54l13 2 3 7M80 62l9 10 1 6" {...thin} />
      <path d="M54 24c-4-6-10-8-14-6M66 24c4-6 10-8 14-6" {...thin} />
      <ellipse cx={60} cy={52} rx={25} ry={24} {...tint('accent', 0.6)} />
      <path d="M60 30v46" />
      <path d="M48 26c4-6 20-6 24 0" fill={BLACK} />
      <ellipse cx={60} cy={28} rx={9} ry={5} fill={BLACK} />
      <circle cx={53.5} cy={27} r={1.6} fill="var(--surface)" stroke="none" />
      <circle cx={66.5} cy={27} r={1.6} fill="var(--surface)" stroke="none" />
      {[[60, 36, 4.2], [48, 44, 3.6], [72, 44, 3.6], [45, 58, 3.6], [75, 58, 3.6], [52, 68, 3], [68, 68, 3]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={BLACK} stroke="none" />
      ))}
      <path d="M44 36c4-4 8-5 12-5" stroke="var(--surface)" strokeWidth={1.2} opacity={0.7} />
    </>
  ),
  veverka: (h) => (
    <>
      <path d="M48 78C22 82 10 56 18 36c6-16 26-22 30-8 3 10-8 14-6 26 1 8 6 14 6 24z" {...tint('accent', 0.38)} />
      <path d="M48 78C22 82 10 56 18 36c6-16 26-22 30-8" fill={`url(#${h})`} stroke="none" opacity={0.35} />
      <path d="M26 40c2 10 8 16 6 26M34 34c-2 8 2 18 0 30" {...hair} />
      <path d="M52 80c-6-10-6-28 4-36 6-5 16-4 20 4 6 12 4 26-2 32z" {...tint('accent', 0.38)} />
      <path d="M58 58c4 4 10 4 14 0" {...tint('yellow', 0.35)} {...thin} />
      <path d="M66 48c-6-4-6-16 2-20 7-4 16 0 17 8 1 6-2 11-8 13z" {...tint('accent', 0.38)} />
      <path d="M69 28l-1-9 5 7M78 28l2-9 3 9" {...tint('accent', 0.38)} />
      <circle cx={78} cy={36} r={1.6} fill="var(--ink)" stroke="none" />
      <path d="M85 40l1 1" strokeWidth={2} />
      <path d="M72 56c4 0 8 2 10 0M76 60c3-2 6-2 8-5" {...thin} />
      <circle cx={84} cy={57} r={3} {...tint('yellow', 0.5)} {...thin} />
      <path d="M54 80h18M58 80c0-4 4-6 8-6" {...thin} />
      <path d="M12 82h96" {...thin} />
    </>
  ),

  /* ---------------------------------------------------------- level 2 */
  virus: () => (
    <Field>
      {range(22).map((i) => {
        const a = (i / 22) * Math.PI * 2
        const x1 = 60 + Math.cos(a) * 24
        const y1 = 45 + Math.sin(a) * 24
        const x2 = 60 + Math.cos(a) * 31
        const y2 = 45 + Math.sin(a) * 31
        return (
          <g key={i}>
            <path d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} {...thin} />
            {i % 2 ? <circle cx={x2} cy={y2} r={1.8} {...tint('pink', 0.6)} {...hair} /> : <rect x={x2 - 1.5} y={y2 - 1.5} width={3} height={3} {...tint('teal', 0.6)} {...hair} />}
          </g>
        )
      })}
      <circle cx={60} cy={45} r={24} {...tint('violet', 0.18)} />
      <circle cx={60} cy={45} r={21} {...hair} strokeDasharray="2 2" />
      {[[52, 38, 0], [64, 36, 40], [70, 46, -30], [56, 50, 70], [64, 54, 10], [48, 46, -60], [58, 42, 100], [68, 40, 160]].map(([x, y, r], i) => (
        <path key={i} d="M-4 0c1.5-2 2.5 2 4 0s2.5 2 4 0" transform={`translate(${x} ${y}) rotate(${r})`} stroke="var(--accent)" strokeWidth={1.3} />
      ))}
    </Field>
  ),
  nostoc: () => {
    const pts = range(12).map((i) => ({ x: 20 + i * 7.3, y: 45 + 13 * Math.sin(i * 0.75) }))
    return (
      <Field>
        <path d="M18 30c20-12 36 8 52-2s26-6 34 4c4 14-8 18-14 26s-24 12-38 6-34-2-38-14 0-16 4-20z" {...tint('teal', 0.08)} strokeWidth={0.8} strokeDasharray="2 2" />
        {pts.map((p, i) =>
          i === 6 ? (
            <circle key={i} cx={p.x} cy={p.y} r={4.6} {...tint('yellow', 0.35)} {...thin} />
          ) : (
            <circle key={i} cx={p.x} cy={p.y} r={3.6} {...tint('teal', 0.5)} {...thin} />
          ),
        )}
      </Field>
    )
  },
  borelie: () => {
    const pts = curve((x) => 44 + 7 * Math.sin((x - 18) / 3.2) + (x - 60) * 0.12, 18, 102, 160)
    return (
      <Field>
        {[[34, 66], [86, 26], [88, 62]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={9} {...tint('accent', 0.25)} {...thin} />
            <circle cx={x} cy={y} r={4} {...hair} />
          </g>
        ))}
        <path d={D(pts)} strokeWidth={3.2} />
        <path d={D(pts)} strokeWidth={1.4} stroke="var(--teal)" />
      </Field>
    )
  },
  krasnoocko: () => (
    <Field>
      <path d="M33 47c-4-8-4-16 2-22s4-12 0-16" {...thin} />
      <path d="M32 48C42 30 78 30 94 46 80 62 44 66 32 48z" {...tint('green', 0.2)} />
      {[[50, 42], [58, 54], [72, 40], [80, 50], [64, 46], [46, 51], [76, 44]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={3.4} ry={1.8} transform={`rotate(${i * 37} ${x} ${y})`} {...tint('green', 0.65)} {...hair} />
      ))}
      <circle cx={67} cy={49} r={5} {...tint('violet', 0.45)} {...thin} />
      <circle cx={39} cy={44} r={2.6} fill="var(--accent)" stroke="none" />
      <circle cx={40} cy={50} r={2} {...tint('blue', 0.3)} {...hair} />
      <path d="M36 52c10 6 30 8 46 2M40 40c12-6 32-6 44 2" {...hair} strokeDasharray="1 2" />
    </Field>
  ),
  stetickovec: () => (
    <Field>
      <path d="M22 72c16-3 26 3 40 0s28-4 38 0M26 78c12-2 22 2 34 0" />
      {[
        [40, 72, 34],
        [62, 72, 26],
        [82, 72, 36],
      ].map(([x, y, top], i) => (
        <g key={i}>
          <path d={`M${x} ${y}V${top}M${x} ${top}l-5-5M${x} ${top}v-6M${x} ${top}l5-5`} {...thin} />
          {[-5, 0, 5].map((dx, j) =>
            range(4).map((k) => (
              <circle key={`${j}${k}`} cx={x + dx * (1 + k * 0.25)} cy={top - (j === 1 ? 7 : 6) - k * 3.6} r={1.6} {...tint('blue', 0.55)} {...hair} />
            )),
          )}
        </g>
      ))}
      <path d="M40 60h-2M40 50h2M62 58h2M82 60h-2M82 48h2" {...hair} />
    </Field>
  ),
  muchomurka: () => (
    <>
      <path d="M50 54c-2 10-3 18-3 22h26c0-4-1-12-3-22z" fill="var(--surface)" />
      <path d="M44 84c-4-10 2-14 6-10h20c4-4 10 0 6 10z" fill="var(--surface)" />
      <path d="M44 84c-4-10 2-14 6-10M70 74c4-4 10 0 6 10" {...thin} />
      <path d="M48 60c4 6 20 6 24 0l-2 5c-6 4-14 4-20 0z" fill="var(--surface)" {...thin} />
      <path d="M22 46c2-26 74-26 76 0z" {...tint('green', 0.38)} />
      <path d="M36 32l8 2M52 26l2 4M70 27l-2 4M84 34l-6 1M46 38l4 1" {...hair} />
      <path d="M22 46c10 7 66 7 76 0" fill="var(--surface)" />
      <path d={range(26).map((i) => `M${(25 + i * 2.8).toFixed(1)} ${(47.5 + Math.sin((i / 25) * Math.PI) * 3).toFixed(1)}l${((i - 12.5) * 0.12).toFixed(2)} 3`).join('')} {...hair} />
      <path d="M14 84h92" {...thin} />
    </>
  ),
  tercovnik: () => (
    <>
      <path d="M10 70c10-14 30-20 56-18s40 8 46 22l-4 10H12z" {...tint('muted', 0.18)} {...thin} />
      {range(9).map((i) => {
        const a = (i / 9) * Math.PI * 2
        const x = 52 + Math.cos(a) * 16
        const y = 60 + Math.sin(a) * 9
        return <ellipse key={i} cx={x} cy={y} rx={9} ry={5} transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} {...tint('yellow', 0.7)} {...thin} />
      })}
      <ellipse cx={52} cy={60} rx={12} ry={7} {...tint('yellow', 0.7)} {...thin} />
      {[[48, 58], [55, 61], [51, 64], [57, 57]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2.4} {...tint('accent', 0.75)} {...thin} />
          <circle cx={x} cy={y} r={1} fill="var(--accent)" stroke="none" />
        </g>
      ))}
      <path d="M62 50l18-20" {...thin} strokeDasharray="2 2" />
      <circle cx={92} cy={22} r={17} fill="var(--surface)" />
      <path d="M78 16c8 4 14-4 26 2M77 26c10-2 16 6 28 0M84 8c2 10-4 18 2 28M98 7c-2 10 4 20-2 30" {...thin} />
      {[[86, 18], [96, 15], [92, 26], [100, 25], [84, 28]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} {...tint('green', 0.65)} {...hair} />
      ))}
    </>
  ),

  /* ---------------------------------------------------------- level 3 */
  raselinik: () => (
    <>
      <path d="M8 80c14-3 30 3 52 0s38-3 52 0M16 86c12-2 24 2 40 0" {...thin} />
      {[38, 60, 82].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 80V${26 + i * 4}`} />
          {range(5).map((j) => (
            <path key={j} d={`M${x} ${40 + i * 4 + j * 8}c-5 2-9 6-11 12M${x} ${40 + i * 4 + j * 8}c5 2 9 6 11 12`} stroke="var(--green)" strokeWidth={1.2} />
          ))}
          <circle cx={x} cy={24 + i * 4} r={8} {...tint('green', 0.4)} />
          <path d={`M${x - 6} ${24 + i * 4}h12M${x} ${18 + i * 4}v12M${x - 4} ${20 + i * 4}l8 8M${x + 4} ${20 + i * 4}l-8 8`} {...hair} />
        </g>
      ))}
    </>
  ),
  kaprad: () => {
    const frond = (x0: number, y0: number, x1: number, y1: number, bend: number, sori: boolean, key: string) => {
      const pts = range(10).map((i) => {
        const t = (i + 1) / 11
        const x = x0 + (x1 - x0) * t + Math.sin(t * Math.PI) * bend
        const y = y0 + (y1 - y0) * t
        return { x, y, s: 1 - t * 0.7 }
      })
      return (
        <g key={key}>
          <path d={`M${x0} ${y0}Q${(x0 + x1) / 2 + bend * 1.2} ${(y0 + y1) / 2} ${x1} ${y1}`} {...thin} />
          {pts.map((p, i) => (
            <g key={i}>
              <ellipse cx={p.x - 7 * p.s} cy={p.y + 1} rx={7 * p.s} ry={2.2 * p.s + 0.6} transform={`rotate(-20 ${p.x - 7 * p.s} ${p.y + 1})`} {...tint('green', 0.38)} {...hair} />
              <ellipse cx={p.x + 7 * p.s} cy={p.y + 1} rx={7 * p.s} ry={2.2 * p.s + 0.6} transform={`rotate(20 ${p.x + 7 * p.s} ${p.y + 1})`} {...tint('green', 0.38)} {...hair} />
              {sori && i < 7 && <circle cx={p.x + 6 * p.s} cy={p.y + 1.5} r={0.9} fill="var(--accent)" stroke="none" />}
            </g>
          ))}
        </g>
      )
    }
    return (
      <>
        {frond(60, 84, 32, 10, -10, false, 'a')}
        {frond(60, 84, 88, 12, 10, true, 'b')}
        {frond(60, 84, 60, 6, 2, false, 'c')}
        <path d="M70 84c4-6 8-8 8-12a3 3 0 1 0-5 1" {...thin} />
        <path d="M14 84h92" {...thin} />
      </>
    )
  },
  preslicka: () => (
    <>
      <path d="M48 84V10" />
      {range(7).map((i) => {
        const y = 20 + i * 9
        const l = 8 + i * 2.6
        return (
          <g key={i}>
            <path d={`M45.5 ${y}h5`} strokeWidth={2.2} />
            <path d={`M48 ${y}c-${l / 2} 2-${l} 5-${l + 2} 9M48 ${y}c${l / 2} 2 ${l} 5 ${l + 2} 9M48 ${y}c-${l / 4} 3-${l / 2} 6-${l / 2} 9M48 ${y}c${l / 4} 3 ${l / 2} 6 ${l / 2} 9`} stroke="var(--green)" strokeWidth={1.1} />
          </g>
        )
      })}
      <path d="M88 84V44" {...tint('accent', 0.3)} />
      {[56, 66, 76].map((y) => (
        <path key={y} d={`M85 ${y}l3 3 3-3`} {...thin} />
      ))}
      <ellipse cx={88} cy={34} rx={5} ry={10} {...tint('accent', 0.4)} />
      <path d="M83.5 30h9M83 36h10M84 42h8" {...hair} />
      <path d="M14 84h92" {...thin} />
    </>
  ),
  borovice: (h) => (
    <>
      <path d="M8 74C30 62 60 46 112 30" strokeWidth={2.4} />
      {range(9).map((i) => {
        const x = 18 + i * 10.5
        const y = 69 - i * 4.4
        return <path key={i} d={`M${x} ${y}l${-6 + (i % 2) * 2} -20M${x} ${y}l${6 - (i % 2)} -20M${x} ${y}l${-4} 18M${x} ${y}l${5} 17`} stroke="var(--green)" strokeWidth={1.2} />
      })}
      <ellipse cx={70} cy={66} rx={8} ry={12} transform="rotate(-15 70 66)" {...tint('accent', 0.35)} />
      <ellipse cx={70} cy={66} rx={8} ry={12} transform="rotate(-15 70 66)" fill={`url(#${h})`} stroke="none" opacity={0.6} />
      <path d="M63 60l13 2M62 67l15 0M64 74l11-2M68 56l-2 20M73 56l1 20" {...hair} />
      <path d="M66 53l2-4" {...thin} />
      <circle cx={92} cy={74} r={10} fill="var(--surface)" {...hair} />
      <path d="M92 80l-4-12M92 80l4-12" stroke="var(--green)" strokeWidth={1.6} />
      <path d="M90 82h4" strokeWidth={2} />
    </>
  ),
  modrin: () => (
    <>
      <path d="M8 70C34 60 66 46 112 36" strokeWidth={2} />
      {range(6).map((i) => {
        const x = 20 + i * 16
        const y = 65 - i * 5.7
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={1.4} fill="var(--ink)" stroke="none" />
            {range(13).map((j) => {
              const a = (-160 + j * 11) * (Math.PI / 180)
              return <path key={j} d={`M${x} ${y}l${(Math.cos(a) * 9).toFixed(1)} ${(Math.sin(a) * 9).toFixed(1)}`} stroke="var(--green)" strokeWidth={0.9} />
            })}
          </g>
        )
      })}
      {[[45, 62], [84, 52]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y + 2}v6`} {...thin} />
          <ellipse cx={x} cy={y - 3} rx={4.6} ry={5.6} {...tint('accent', 0.4)} />
          <path d={`M${x - 4} ${y - 4}h8M${x - 3.5} ${y - 7}h7M${x - 4} ${y - 1}h8`} {...hair} />
        </g>
      ))}
    </>
  ),
  lilie: () => {
    const flower = (x: number, y: number) => (
      <g>
        {[-60, -25, 0, 25, 60].map((r, i) => (
          <path key={i} d="M0 0c-4 6-4 14 0 18 3-4 4-10 3-14" transform={`translate(${x} ${y}) rotate(${r + 180})`} {...tint('pink', 0.5)} {...thin} />
        ))}
        <path d={`M${x} ${y}l-6 16M${x} ${y}l-2 18M${x} ${y}l2 18M${x} ${y}l6 16`} {...hair} />
        {[[-6, 16], [-2, 18], [2, 18], [6, 16]].map(([dx, dy], i) => (
          <ellipse key={i} cx={x + dx} cy={y + dy + 1.5} rx={0.9} ry={2} fill="var(--accent)" stroke="none" />
        ))}
        <path d={`M${x - 3} ${y - 6}l1 1M${x + 3} ${y - 7}l1 1M${x} ${y - 9}l1 1`} strokeWidth={1.3} stroke="var(--accent)" />
      </g>
    )
    return (
      <>
        <path d="M58 86V14" />
        <path d="M58 14c8-2 14 2 18 10M58 14c-8 0-14 4-16 12" {...thin} />
        {flower(76, 30)}
        {flower(42, 32)}
        {[-1, 1].map((s) =>
          [0, 1, 2].map((j) => (
            <path
              key={`${s}${j}`}
              d={`M58 66c${s * 6} -4 ${s * 16} -6 ${s * 22} ${-2 + j * 4}c${-s * 6} 6 ${-s * 16} 4 ${-s * 22} 2z`}
              {...tint('green', 0.35)}
              {...thin}
            />
          )),
        )}
        <path d="M58 66c8-3 16-3 22-1M58 66c-8-3-16-3-22-1" {...hair} />
        <path d="M14 86h92" {...thin} />
      </>
    )
  },
  psenice: () => (
    <>
      <path d="M50 86V30" />
      {[44, 62, 76].map((y) => (
        <path key={y} d={`M47.5 ${y}h5`} strokeWidth={2.4} />
      ))}
      <path d="M50 62c12-6 24-6 36-18-6 14-20 18-36 20" {...tint('green', 0.35)} {...thin} />
      <path d="M54 61c10-4 20-6 28-14M54 62c10-3 20-5 30-14" {...hair} />
      <path d="M50 76c-10-4-20-6-30-14 4 10 16 14 30 16" {...tint('green', 0.35)} {...thin} />
      {range(8).map((i) => {
        const y = 30 - i * 3.4
        const s = i % 2 ? 1 : -1
        return (
          <g key={i}>
            <ellipse cx={50 + s * 3.6} cy={y} rx={3.4} ry={4.4} transform={`rotate(${s * 20} ${50 + s * 3.6} ${y})`} {...tint('yellow', 0.55)} {...thin} />
            <path d={`M${50 + s * 5} ${y - 4}l${s * 5} -12`} {...hair} />
          </g>
        )
      })}
      <path d="M14 86h92" {...thin} />
    </>
  ),
  smetanka: () => (
    <>
      <path d="M40 84V36M82 84V30" {...thin} />
      <path d="M40 34m-12 0a12 12 0 1 0 24 0a12 12 0 1 0 -24 0" {...tint('yellow', 0.55)} />
      {range(24).map((i) => (
        <path key={i} d="M40 34l0 -11" transform={`rotate(${i * 15} 40 34)`} {...hair} />
      ))}
      <circle cx={40} cy={34} r={5} {...tint('yellow', 0.7)} {...hair} />
      {range(28).map((i) => (
        <g key={`p${i}`} transform={`rotate(${i * (360 / 28)} 82 26)`}>
          <path d="M82 26v-14" {...hair} />
          <path d="M82 12l-2-2M82 12l2-2M82 12v-2.6" {...hair} />
        </g>
      ))}
      <circle cx={82} cy={26} r={2.6} fill="var(--ink)" stroke="none" />
      <path d="M60 84c-8-2-14-4-22-12l4-1-6-5 5 0-6-6c8 2 16 8 25 24zM62 84c8-2 14-6 20-14l-4 0 5-6h-5l5-6c-8 2-14 10-21 26z" {...tint('green', 0.35)} {...thin} />
      <path d="M14 84h92" {...thin} />
    </>
  ),
  hrach: () => (
    <>
      <path d="M40 86C38 66 44 44 40 18" />
      <path d="M40 30c8-4 12 2 9 5-2 2-5 0-3-2M41 52c-8-4-12 2-9 5 2 2 5 0 3-2" {...thin} />
      <ellipse cx={30} cy={66} rx={8} ry={5} transform="rotate(-20 30 66)" {...tint('green', 0.35)} {...thin} />
      <ellipse cx={50} cy={72} rx={8} ry={5} transform="rotate(20 50 72)" {...tint('green', 0.35)} {...thin} />
      <path d="M40 40c8 0 14-4 18-8" {...thin} />
      <path d="M58 32c-2-10 6-18 14-14 6 3 6 12-2 16-4 2-9 1-12-2z" fill="var(--surface)" />
      <path d="M58 32c-2-10 6-18 14-14 6 3 6 12-2 16-4 2-9 1-12-2z" {...tint('pink', 0.2)} />
      <path d="M60 30c4 4 10 6 16 4-3 6-12 6-16-4z" {...tint('pink', 0.45)} {...thin} />
      <path d="M61 31c3 1 7 1 9-1" {...hair} />
      <path d="M62 64c10-12 24-18 40-16-6 12-22 20-40 16z" {...tint('green', 0.35)} />
      {[70, 78, 86, 94].map((x, i) => (
        <circle key={x} cx={x} cy={60 - i * 2.4} r={3.4} {...tint('green', 0.6)} {...thin} />
      ))}
      <path d="M62 64c12-4 26-10 40-16" {...hair} />
      <path d="M14 86h92" {...thin} />
    </>
  ),
  kokoska: () => (
    <>
      <path d="M60 84V14" />
      {range(5).map((i) => {
        const y = 64 - i * 10
        const s = i % 2 ? 1 : -1
        return (
          <g key={i}>
            <path d={`M60 ${y}l${s * 10} -4`} {...thin} />
            <path d={`M${60 + s * 10} ${y - 4}l${s * 7} -5 ${s * 2} 7z`} {...tint('green', 0.4)} {...thin} />
          </g>
        )
      })}
      {[[-5, 12], [5, 12], [0, 8]].map(([dx, y], i) => (
        <g key={i} transform={`translate(${60 + dx} ${y})`}>
          {range(4).map((j) => (
            <ellipse key={j} cx={0} cy={-2.2} rx={1.3} ry={2} transform={`rotate(${j * 90 + 45})`} fill="var(--surface)" {...hair} />
          ))}
          <circle r={0.8} fill="var(--yellow)" stroke="none" />
        </g>
      ))}
      <path d="M60 84c-10 0-20-4-26-2l4-4-6-2 6-2-4-5c8 0 18 6 26 15zM60 84c10 0 20-4 26-2l-4-4 6-2-6-2 4-5c-8 0-18 6-26 15z" {...tint('green', 0.35)} {...thin} />
      <circle cx={98} cy={24} r={13} fill="var(--surface)" {...hair} />
      <path d="M98 34V20M98 20l-8-6 8 2 8-2z" {...tint('green', 0.45)} {...thin} />
      <path d="M14 84h92" {...thin} />
    </>
  ),
  hluchavka: () => (
    <>
      <path d="M56 86V10M62 86V10" />
      <path d="M59 86V10" {...hair} />
      {[64, 40].map((y, i) => (
        <g key={i}>
          <path d={`M56 ${y}c-10-8-26-6-30 2 6 6 22 6 30-2z`} {...tint('green', 0.35)} {...thin} />
          <path d={`M62 ${y}c10-8 26-6 30 2-6 6-22 6-30-2z`} {...tint('green', 0.35)} {...thin} />
          <path d={`M28 ${y - 2}l2 2 2-2 2 2 2-2 2 2M80 ${y - 2}l2 2 2-2 2 2 2-2 2 2`} {...hair} />
          {[-1, 1].map((s) => (
            <g key={s} transform={`translate(${59 + s * 5} ${y - 6}) scale(${s} 1)`}>
              <path d="M0 0c2-6 6-10 12-12 2 4 0 8-4 10" fill="var(--surface)" {...thin} />
              <path d="M2 0c4 2 8 2 11 6-4 1-8 0-11-3" fill="var(--surface)" {...thin} />
            </g>
          ))}
        </g>
      ))}
      <path d="M14 86h92" {...thin} />
      <rect x={92} y={12} width={14} height={14} rx={2} fill="var(--surface)" {...thin} />
      <path d="M92 19h14M99 12v14" {...hair} />
    </>
  ),
  ruze: () => (
    <>
      <path d="M30 86C34 62 40 44 52 30" />
      {[[33, 70], [37, 56], [44, 44]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y}l5-2-4 5`} fill="var(--ink)" {...hair} />
      ))}
      <path d="M36 58c10 0 22 2 30 8" {...thin} />
      {[[48, 58], [58, 61], [66, 66]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y - 5} rx={3} ry={5} transform={`rotate(20 ${x} ${y - 5})`} {...tint('green', 0.4)} {...hair} />
          <ellipse cx={x + 2} cy={y + 5} rx={3} ry={5} transform={`rotate(-30 ${x + 2} ${y + 5})`} {...tint('green', 0.4)} {...hair} />
        </g>
      ))}
      {fivePetals(64, 22, 9)}
      <circle cx={64} cy={22} r={5} {...tint('yellow', 0.6)} {...hair} />
      {range(12).map((i) => (
        <circle key={i} cx={64 + Math.cos(i * 0.52) * 3.6} cy={22 + Math.sin(i * 0.52) * 3.6} r={0.8} fill="var(--ink)" stroke="none" />
      ))}
      <path d="M44 44c10-6 30-4 44 6" {...thin} />
      <ellipse cx={92} cy={58} rx={6} ry={9} {...tint('accent', 0.6)} />
      <path d="M88 50l4-4 4 4M92 46v-6" {...thin} />
      <path d="M14 86h92" {...thin} />
    </>
  ),

  /* ---------------------------------------------------------- level 4 */
  houba: () => (
    <>
      <path d="M8 80c20-8 50-8 104 0" strokeWidth={2} />
      {[
        [30, 30],
        [48, 18],
        [64, 26],
        [80, 14],
        [94, 34],
      ].map(([x, top], i) => (
        <g key={i}>
          <path d={`M${x - 6} 78c-1-18 0-${70 - top} 6-${78 - top}c6 8 7 ${60 - top} 6 ${78 - top}`} {...tint('green', 0.35)} />
          <ellipse cx={x} cy={top + 2} rx={2.4} ry={1.4} fill="var(--ink)" stroke="none" />
          {range(5).map((j) => (
            <circle key={j} cx={x + (j % 2 ? 2 : -2)} cy={top + 12 + j * 10} r={0.9} fill="var(--ink)" stroke="none" />
          ))}
        </g>
      ))}
    </>
  ),
  nezmar: () => (
    <>
      <path d="M20 86c10-30 30-60 40-80" stroke="var(--green)" strokeWidth={3} strokeOpacity={0.5} />
      <path d="M58 82c-4-12-4-30 0-46h10c4 16 4 34 0 46z" {...tint('green', 0.45)} />
      <path d="M58 82h10" strokeWidth={2.2} />
      <path d="M68 60c6-2 10-6 12-10l3 2c-3 6-8 10-15 12" {...tint('green', 0.45)} {...thin} />
      {[[-16, -24], [-6, -30], [4, -32], [14, -26], [22, -16], [-22, -12]].map(([dx, dy], i) => (
        <g key={i}>
          <path d={`M63 36c${dx / 3} ${dy / 2} ${dx / 1.4} ${dy / 1.3} ${dx} ${dy}`} strokeWidth={1.3} />
          {range(4).map((j) => (
            <circle key={j} cx={63 + (dx * (j + 1)) / 5} cy={36 + (dy * (j + 1)) / 5} r={0.8} fill="var(--ink)" stroke="none" />
          ))}
        </g>
      ))}
      <path d="M59 36c2 2 6 2 8 0" {...thin} />
    </>
  ),
  hvezdice: () => {
    const pts = range(10).map((i) => {
      const a = ((-90 + i * 36) * Math.PI) / 180
      const r = i % 2 ? 13 : 38
      return { x: 60 + Math.cos(a) * r, y: 48 + Math.sin(a) * r }
    })
    return (
      <>
        <path d={D(pts, true)} {...tint('accent', 0.4)} strokeLinejoin="round" />
        {range(5).map((i) => {
          const a = ((-90 + i * 72) * Math.PI) / 180
          return [9, 16, 23, 29].map((r, j) => (
            <circle key={`${i}${j}`} cx={60 + Math.cos(a) * r} cy={48 + Math.sin(a) * r} r={1.3 - j * 0.15} fill="var(--ink)" stroke="none" />
          ))
        })}
        {range(5).map((i) => {
          const a = ((-90 + i * 72 + 12) * Math.PI) / 180
          return <circle key={`s${i}`} cx={60 + Math.cos(a) * 14} cy={48 + Math.sin(a) * 14} r={0.8} fill="var(--ink)" stroke="none" />
        })}
        <circle cx={60} cy={48} r={3} {...thin} />
      </>
    )
  },
  plostenka: () => (
    <>
      <path d="M18 46c0-8 8-10 14-8 22-8 50-8 70 2 6 3 8 8 0 10-20 8-50 8-70 2-6 2-14 0-14-6z" fill="var(--surface)" />
      <path d="M18 46c0-8 8-10 14-8 22-8 50-8 70 2 6 3 8 8 0 10-20 8-50 8-70 2-6 2-14 0-14-6z" {...tint('muted', 0.1)} />
      <circle cx={26} cy={43} r={1.4} fill="var(--ink)" stroke="none" />
      <circle cx={26} cy={49} r={1.4} fill="var(--ink)" stroke="none" />
      <path d="M50 46h16" strokeWidth={3} stroke="var(--pink)" strokeOpacity={0.6} />
      <path d="M40 40c12 4 26 4 40 0M40 52c12-4 26-4 40 0M36 46h70" {...hair} />
      <path d="M14 66h92" {...thin} />
    </>
  ),
  skrkavka: () => {
    const d = 'M14 58C30 30 50 74 70 50S100 36 108 46'
    return (
      <>
        <Tube d={d} w={7} c="pink" o={0.25} />
        <path d={d} stroke="var(--surface)" strokeWidth={1} opacity={0.7} transform="translate(0 -1.5)" />
        <path d="M18 78h86" {...thin} />
      </>
    )
  },
  hlemyzd: () => (
    <>
      <path d="M14 76c10-6 24-8 44-8h36c8 0 12-6 10-14l-2-8c4 2 6 10 4 18-2 10-10 14-20 14H20z" {...tint('muted', 0.2)} />
      <path d="M96 48l-4-18M100 48l6-16" {...thin} />
      <circle cx={92} cy={29} r={1.8} fill="var(--ink)" stroke="none" />
      <circle cx={106} cy={31} r={1.8} fill="var(--ink)" stroke="none" />
      <path d="M92 54l-6-6M96 56l2-6" {...thin} />
      <circle cx={54} cy={46} r={24} {...tint('yellow', 0.4)} />
      <path d="M54 46m-4 0a4 4 0 1 1 8 0a8 8 0 1 1 -16 0a12 12 0 1 1 24 0a17 17 0 1 1 -34 0" {...thin} />
      <path d="M36 32c4 4 6 8 6 14M44 24c4 6 4 12 2 18M66 26c-2 6 0 10 4 14M74 40c-4 2-6 6-4 10" {...hair} />
    </>
  ),
  skeble: () => (
    <>
      <path d="M38 62c-4 8 0 14 8 12 6-2 8-8 6-12" {...tint('pink', 0.4)} {...thin} />
      <path d="M86 34l12-6M88 40l12-2" {...thin} />
      <path d="M18 44c4-16 22-24 42-22 22 2 34 10 32 22-2 10-14 18-36 18-26 0-40-6-38-18z" {...tint('teal', 0.25)} />
      <path d="M22 44c4-12 18-18 36-16M28 46c4-8 14-12 28-12M36 48c4-4 10-6 18-6" {...hair} />
      <path d="M18 44c10 4 30 6 52 4 10-1 18-2 22-4" />
      <path d="M44 22c2-4 8-5 12-2" strokeWidth={2} />
      <path d="M14 80h92" {...thin} />
    </>
  ),
  rak: () => (
    <>
      <path d="M44 30C30 22 16 16 6 16M44 30C34 18 24 10 10 6" {...hair} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${54 + i * 5} 40l-4 ${10 + i}l-4 4M${54 + i * 5} 28l-4 -${10 + i}l-4 -4`} {...thin} />
      ))}
      <path d="M48 28c-6-4-10-8-14-10M48 40c-6 4-10 8-14 10" strokeWidth={2.2} />
      <path d="M34 18c-8-6-18-6-24-2 6 0 10 2 12 4-6 0-10 2-12 4 8 2 18 0 24-6z" {...tint('accent', 0.4)} />
      <path d="M34 50c-8 6-18 6-24 2 6 0 10-2 12-4-6 0-10-2-12-4 8-2 18 0 24 6z" {...tint('accent', 0.4)} />
      <ellipse cx={60} cy={34} rx={16} ry={9} {...tint('accent', 0.4)} />
      <path d="M48 34h24" {...hair} />
      {range(5).map((i) => (
        <rect key={i} x={76 + i * 6} y={28.5 + i * 0.4} width={6} height={11 - i * 0.8} rx={2} {...tint('accent', 0.4)} {...thin} />
      ))}
      <path d="M106 34l8-8v16z" {...tint('accent', 0.4)} {...thin} />
      <path d="M106 34h8M106 34l6-6M106 34l6 6" {...hair} />
      <circle cx={46} cy={31} r={1.2} fill="var(--ink)" stroke="none" />
      <circle cx={46} cy={37} r={1.2} fill="var(--ink)" stroke="none" />
    </>
  ),
  stonozka: () => (
    <>
      {range(15).map((i) => {
        const x = 24 + i * 5.2
        return <path key={i} d={`M${x} 42l-3 -10l-2 -2M${x} 50l-3 10l-2 2`} {...thin} />
      })}
      <path d="M20 44c-6-6-10-14-12-22M20 48c-6 6-10 14-12 22" {...thin} />
      <path d="M18 44c-3 0-4 1-5 2M18 48c-3 0-4-1-5-2" strokeWidth={1.4} />
      <ellipse cx={20} cy={46} rx={5} ry={5} {...tint('accent', 0.4)} />
      {range(15).map((i) => (
        <rect key={`s${i}`} x={23 + i * 5.2} y={41} width={5.4} height={10} rx={1.6} {...tint('accent', 0.35)} {...thin} />
      ))}
      <path d="M102 44l8-6M102 48l8 6" {...thin} />
    </>
  ),
  krizak: () => (
    <>
      <path d="M10 10L110 80M110 10L10 80M60 2v86M4 45h112" {...hair} opacity={0.6} />
      <path d="M60 45m-30 0a30 22 0 1 0 60 0a30 22 0 1 0 -60 0M60 45m-18 0a18 13 0 1 0 36 0a18 13 0 1 0 -36 0" {...hair} opacity={0.6} />
      {[-1, 1].map((s) =>
        [-30, -10, 10, 32].map((a, i) => (
          <path
            key={`${s}${i}`}
            d={`M${60 + s * 4} 30 l${s * (12 + i)} ${(a - 10) / 3} l${s * 8} ${a / 2 + 8}`}
            strokeWidth={1.3}
          />
        )),
      )}
      <ellipse cx={60} cy={30} rx={7} ry={6} {...tint('accent', 0.45)} />
      <path d="M60 36v3" strokeWidth={1.4} />
      <ellipse cx={60} cy={54} rx={14} ry={17} {...tint('accent', 0.45)} />
      <path d="M60 44v20M54 52h12" stroke={WHITE} strokeWidth={2.6} />
      {[[60, 44], [60, 50], [60, 58], [60, 64], [54, 52], [66, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill={WHITE} {...hair} />
      ))}
      <path d="M57 24l-2-4M63 24l2-4" {...thin} />
    </>
  ),
  kliste: () => (
    <>
      {[-1, 1].map((s) =>
        [-24, -8, 8, 22].map((a, i) => (
          <path key={`${s}${i}`} d={`M${60 + s * 10} ${44 + i * 4} l${s * 12} ${a / 2} l${s * 10} ${a / 2 + 8}`} strokeWidth={1.3} />
        )),
      )}
      <path d="M56 26l-1-8 5 4 5-4-1 8" fill={BLACK} fillOpacity={0.8} {...thin} />
      <ellipse cx={60} cy={50} rx={16} ry={22} {...tint('accent', 0.6)} />
      <path d="M46 40c0-10 6-14 14-14s14 4 14 14c-4 6-24 6-28 0z" fill={BLACK} fillOpacity={0.8} />
      <path d="M52 58c4 2 12 2 16 0M50 64c6 3 14 3 20 0" {...hair} />
    </>
  ),
  vcela: () => (
    <>
      <ellipse cx={52} cy={26} rx={20} ry={8} transform="rotate(-25 52 26)" {...tint('blue', 0.1)} {...thin} />
      <ellipse cx={70} cy={24} rx={16} ry={7} transform="rotate(20 70 24)" {...tint('blue', 0.1)} {...thin} />
      <path d="M50 26l26 4M58 20l14 6" {...hair} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${54 + i * 6} 48l${-6 + i * 4} 12l${-2 + i * 3} 10M${54 + i * 6} 48`} {...thin} />
      ))}
      <path d="M30 38c-6-6-10-8-14-6M30 36c-4-8-6-12-10-12" {...thin} />
      <circle cx={34} cy={40} r={8} {...tint('ink', 0.55)} />
      <ellipse cx={36} cy={38} rx={2.6} ry={4} fill="var(--ink)" stroke="none" />
      <ellipse cx={56} cy={40} rx={13} ry={10} {...tint('yellow', 0.5)} />
      <path d="M48 34c4-2 10-2 14 0M46 42c6 2 12 2 18 0" {...hair} />
      <path d="M68 40c2-12 30-12 36 0-6 12-34 12-36 0z" {...tint('yellow', 0.65)} />
      {[76, 84, 92].map((x) => (
        <path key={x} d={`M${x} 31c-2 6-2 12 0 18`} strokeWidth={3.4} />
      ))}
      <path d="M104 40l5 1" strokeWidth={1.4} />
    </>
  ),

  /* ---------------------------------------------------------- level 5 */
  macka: () => (
    <>
      <path d="M8 46c10-10 28-14 50-12 16 1 28 4 38 8l18-14-4 20 6 14-20-8c-12 6-26 8-40 8-16 0-34-4-48-16z" {...tint('yellow', 0.18)} />
      <path d="M58 34l4-8 6 9M82 40l4-6 3 6M44 58l-6 10 12-8M74 56l2 6 4-6" {...tint('yellow', 0.18)} {...thin} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${30 + i * 3.2} 41c-1 4-1 8 0 12`} {...thin} />
      ))}
      <circle cx={18} cy={43} r={1.6} fill="var(--ink)" stroke="none" />
      <path d="M10 50c4 2 8 2 12 1" {...thin} />
      {[[44, 44], [50, 50], [56, 42], [62, 48], [68, 44], [74, 50], [80, 45], [88, 48], [64, 54], [52, 56], [94, 44]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.1} fill="var(--ink)" stroke="none" />
      ))}
    </>
  ),
  kapr: (h) => (
    <>
      <path d="M14 48c12-18 36-26 58-20 10 3 18 8 24 14l14-12-2 18 4 18-16-12c-8 8-20 12-34 12-22 0-40-6-48-18z" {...tint('yellow', 0.35)} />
      <path d="M40 30c8-14 26-16 40-8l-4 12" {...tint('yellow', 0.35)} {...thin} />
      <path d="M54 62l-2 10 10-8M74 60l2 6 6-6" {...tint('yellow', 0.35)} {...thin} />
      <path d="M36 32c-6 10-6 26 0 34" />
      <path d="M44 34c12 2 40 6 52 10M42 60c16-2 40-6 54-12" {...hair} />
      <path d="M44 36h52v24H44z" fill={`url(#${h})`} stroke="none" opacity={0.3} />
      {range(5).map((i) =>
        range(3).map((j) => <path key={`${i}${j}`} d={`M${48 + i * 9} ${38 + j * 7}a4 4 0 0 0 0 7`} {...hair} />),
      )}
      <circle cx={24} cy={42} r={2.4} fill="var(--surface)" {...thin} />
      <circle cx={24} cy={42} r={1} fill="var(--ink)" stroke="none" />
      <path d="M14 50c-2 4-4 6-6 6M15 52c0 4-1 7-3 9" {...thin} />
    </>
  ),
  colek: () => (
    <>
      <path d="M14 50c4-6 12-8 20-6 14-4 30-4 44 0 12-2 24-12 36-20-6 14-18 26-36 30-14 4-30 4-44 2-8 2-16 0-20-6z" {...tint('teal', 0.3)} />
      <path d="M36 43l3-3 3 3 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-3 3 3" {...thin} />
      <path d="M30 52c14 3 32 3 48-1" stroke="var(--accent)" strokeWidth={2.4} strokeOpacity={0.45} />
      {[[30, 54, -1], [40, 54, 1], [64, 54, -1], [74, 54, 1]].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y}l${s * 3} 10M${x + s * 3} ${y + 10}l-2 3M${x + s * 3} ${y + 10}l0 3M${x + s * 3} ${y + 10}l2 3`} {...thin} />
      ))}
      {[[46, 52], [54, 54], [62, 52], [70, 50], [38, 52], [80, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill="var(--accent)" stroke="none" />
      ))}
      <circle cx={21} cy={48} r={1.6} fill="var(--ink)" stroke="none" />
      <path d="M8 76h104" {...thin} />
    </>
  ),
  skokan: () => (
    <>
      <path d="M22 58c0-12 10-20 24-20 16 0 32 8 42 20 4 6 2 14-6 16H42c-12 0-20-6-20-16z" {...tint('accent', 0.3)} />
      <path d="M66 70c-4-12 6-20 16-14 8 5 6 16-4 18" {...tint('accent', 0.3)} />
      <path d="M78 74c-6 2-14 4-24 4l-6 3M54 78l-5-1M54 78l-4 4" {...thin} />
      <path d="M38 70l-2 9-5 2M36 79l1 3M36 79l4 2" {...thin} />
      <circle cx={33} cy={41} r={5} fill="var(--surface)" />
      <circle cx={33} cy={41} r={2.2} fill="var(--ink)" stroke="none" />
      <path d="M36 46c4-1 9 0 11 4-3 4-9 4-12 1z" fill={BLACK} fillOpacity={0.7} {...thin} />
      <path d="M22 58c6 2 12 2 18-1" {...thin} />
      <path d="M48 44c10 2 22 6 32 14" {...hair} />
      {[[56, 54], [64, 50], [70, 60], [50, 62]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill="var(--ink)" fillOpacity={0.45} stroke="none" />
      ))}
      <path d="M12 82h96" {...thin} />
    </>
  ),
  jesterka: () => (
    <>
      <path d="M10 46c4-6 12-8 20-6 14-4 34-4 46 2 14 0 26 8 34 22-10-8-20-12-34-12-14 4-32 4-46 2-8 2-16-2-20-8z" {...tint('green', 0.4)} />
      <path d="M36 42c12-3 28-3 40 2-12 6-28 6-40 0" fill="var(--accent)" fillOpacity={0.25} stroke="none" />
      <path d="M30 44c14-2 30-2 46 2" {...hair} strokeDasharray="2 2" />
      {[[28, 50, -1], [36, 52, 1], [62, 52, -1], [70, 52, 1]].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y}l${s * 6} 8l${s * 4} 4M${x + s * 6} ${y + 8}l${s * 1} 5M${x + s * 6} ${y + 8}l${-s * 3} 4`} {...thin} />
      ))}
      <circle cx={17} cy={44} r={1.6} fill="var(--ink)" stroke="none" />
      <path d="M8 72h104" {...thin} />
    </>
  ),
  uzovka: () => {
    const pts = curve((x) => 52 + 14 * Math.sin((x - 20) / 12), 20, 96, 60)
    return (
      <>
        <Tube d={D(pts)} w={9} c="muted" o={0.35} />
        <path d={D(pts)} stroke="var(--ink)" strokeWidth={9} strokeDasharray="1 5" opacity={0.25} />
        <ellipse cx={106} cy={51} rx={8} ry={7} {...tint('muted', 0.35)} />
        <path d="M91 45.5v13" stroke={BLACK} strokeWidth={3.2} />
        <ellipse cx={95.5} cy={48.6} rx={2.4} ry={3} fill="var(--yellow)" stroke={BLACK} strokeWidth={0.7} />
        <ellipse cx={95.5} cy={56.4} rx={2.4} ry={3} fill="var(--yellow)" stroke={BLACK} strokeWidth={0.7} />
        <circle cx={108} cy={48} r={2} fill="var(--surface)" {...hair} />
        <circle cx={108} cy={48} r={1} fill="var(--ink)" stroke="none" />
        <path d="M114 52l4 1-3 2" {...hair} />
        <path d="M8 78h104" {...thin} />
      </>
    )
  },
  zmije: () => {
    const f = (x: number) => 52 + 14 * Math.sin((x - 20) / 12)
    const pts = curve(f, 20, 94, 60)
    const zig = range(26).map((i) => {
      const x = 22 + i * 2.8
      return { x, y: f(x) + (i % 2 ? 3 : -3) }
    })
    return (
      <>
        <Tube d={D(pts)} w={10} c="muted" o={0.25} />
        <path d={D(zig)} stroke={BLACK} strokeWidth={2.6} strokeLinejoin="miter" />
        <path d="M94 44l12 2c4 1 6 3 6 5s-2 4-6 5l-12 2c-2-4-2-10 0-14z" {...tint('muted', 0.25)} />
        <path d="M96 47l5 4-5 4M101 47l4 4" stroke={BLACK} strokeWidth={1.4} />
        <ellipse cx={107} cy={48} rx={1.6} ry={2} fill="var(--surface)" {...hair} />
        <path d="M107 46.6v2.8" stroke="var(--ink)" strokeWidth={0.8} />
        <path d="M8 78h104" {...thin} />
      </>
    )
  },
  kane: (h) => (
    <>
      <path d="M20 82h80" strokeWidth={3} />
      <path d="M50 76c-10-10-12-30-4-44 4-8 12-12 20-10 10 2 16 10 16 22 0 16-8 28-16 34z" {...tint('accent', 0.35)} />
      <path d="M52 40c0 14 4 26 12 34 4-10 6-22 4-34" fill="var(--surface)" fillOpacity={0.6} {...hair} />
      <path d="M54 48h10M55 54h11M57 60h10M59 66h8" {...hair} />
      <path d="M78 34c10 8 14 24 10 40-4-6-10-10-14-12" {...tint('accent', 0.35)} />
      <path d="M80 40c4 8 6 18 6 26" fill={`url(#${h})`} {...hair} />
      <path d="M58 24c-4 0-8 2-10 6 2 0 4 2 4 4 2-2 4-4 6-4" {...tint('yellow', 0.6)} />
      <path d="M48 30c-1 2-1 4 1 5" strokeWidth={1.6} />
      <circle cx={62} cy={26} r={1.8} fill="var(--ink)" stroke="none" />
      <path d="M58 76l-2 6M66 76l2 6M52 82l3-3M56 82h1M64 82l1-3M70 82l-2-3" strokeWidth={1.8} />
      <path d="M84 70l6 12M88 72l6 10" {...thin} />
    </>
  ),
  kos: () => (
    <>
      <path d="M16 82h88" strokeWidth={2.4} />
      <path d="M40 56c0-14 10-22 22-22 10 0 16-8 24-8 6 0 10 4 10 8 0 8-10 14-12 22-4 12-16 18-30 16-6-1-14-6-14-16z" fill={BLACK} fillOpacity={0.85} />
      <path d="M44 62c-10 6-20 10-30 10 8-4 16-10 22-16" fill={BLACK} fillOpacity={0.85} />
      <path d="M95 32l12 2-12 3z" fill="var(--yellow)" {...thin} />
      <circle cx={88} cy={32} r={2.2} fill="var(--yellow)" stroke="none" />
      <circle cx={88} cy={32} r={0.9} fill="var(--ink)" stroke="none" />
      <path d="M58 70l-2 12M66 70l2 12" {...thin} />
      <path d="M52 50c8 4 18 4 24 0" stroke="var(--surface)" strokeWidth={0.7} opacity={0.6} />
    </>
  ),
  netopyr: () => (
    <>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(60 0) scale(${s} 1) translate(-60 0)`}>
          <path d="M66 36c10-8 22-14 40-14-4 8-2 18 2 26-8-4-14-2-18 4-4-4-10-6-16-2-2-6-6-10-8-14z" {...tint('muted', 0.3)} />
          <path d="M66 36L106 22M70 40L108 48M72 42L90 52M70 44l2 8" {...hair} />
        </g>
      ))}
      <ellipse cx={60} cy={42} rx={7} ry={11} {...tint('accent', 0.3)} />
      <circle cx={60} cy={30} r={5.6} {...tint('accent', 0.3)} />
      <path d="M56 26l-3-9 5 5M64 26l3-9-5 5" {...tint('accent', 0.3)} {...thin} />
      <circle cx={58} cy={30} r={0.9} fill="var(--ink)" stroke="none" />
      <circle cx={62} cy={30} r={0.9} fill="var(--ink)" stroke="none" />
      <path d="M57 53l-2 4M63 53l2 4" {...thin} />
    </>
  ),
  srnec: () => (
    <>
      <path d="M32 46c4-8 16-10 30-8 10 1 18 0 22-4l6 2c2 6 0 12-6 14-2 6-8 10-20 10H40c-6 0-10-6-8-14z" {...tint('accent', 0.35)} />
      <path d="M32 46c-4 2-4 8 0 12" {...tint('surface', 1)} {...thin} />
      <path d="M86 34c2-6 6-10 10-10l6 4-6 4c-2 2-4 4-6 6" {...tint('accent', 0.35)} />
      <path d="M90 24l-2-8 5 4M96 24c0-6 0-10 2-14M97 14l-4-4M98 12l4-2M93 22l-4-12M91 14l-3-2" {...thin} />
      <circle cx={97} cy={28} r={1.2} fill="var(--ink)" stroke="none" />
      <path d="M100 30l2 1" strokeWidth={2} />
      {[[40, 60], [48, 60], [70, 60], [78, 58]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y}l${i < 2 ? -2 : 2} 10l0 10`} strokeWidth={1.6} />
          <path d={`M${x + (i < 2 ? -3.4 : 0.6)} ${y + 20}h3l0.4 -3h-3z`} fill="var(--ink)" stroke="none" />
        </g>
      ))}
      <path d="M10 82h100" {...thin} />
    </>
  ),
  jezek: () => (
    <>
      <path d={fringe(56, 54, 30, 20, 60, 7)} strokeWidth={1.1} />
      <path d={fringe(56, 54, 24, 15, 44, 6)} strokeWidth={0.9} />
      <path d="M26 64c0-22 14-32 30-32s30 8 30 26c0 4-2 8-4 10H30c-2-2-4-2-4-4z" {...tint('muted', 0.35)} />
      <path d="M82 64c6-4 12-6 18-4l8 4-8 2c-6 2-12 2-18 0z" {...tint('accent', 0.25)} />
      <circle cx={108} cy={64} r={1.6} fill="var(--ink)" stroke="none" />
      <circle cx={94} cy={60} r={1.4} fill="var(--ink)" stroke="none" />
      <path d="M40 70l-2 8M54 70v8M70 70l2 8" strokeWidth={2} />
      <path d="M14 80h96" {...thin} />
    </>
  ),
  liska: () => (
    <>
      <path d="M30 50C18 50 8 58 4 70c8-4 16-4 22-6 4-2 6-6 8-10" {...tint('accent', 0.45)} />
      <path d="M4 70c3-2 6-3 9-3l-3 5z" fill="var(--surface)" {...thin} />
      <path d="M30 46c6-6 20-8 36-6 8 1 14-2 18-6l8 2c2 6-2 12-8 14-2 6-10 10-22 10H40c-8 0-12-6-10-14z" {...tint('accent', 0.45)} />
      <path d="M84 34l2-12 6 8 6-6 0 10c4 2 10 4 14 8-4 2-10 4-16 3l-6 3c-4-2-6-8-6-14z" {...tint('accent', 0.45)} />
      <path d="M96 46l14-2" {...thin} />
      <path d="M100 45l1 3 1-3" fill="var(--surface)" stroke="var(--ink)" strokeWidth={0.7} />
      <path d="M88 52c4 2 8 2 10 0" fill="var(--surface)" {...hair} />
      <circle cx={94} cy={36} r={1.4} fill="var(--ink)" stroke="none" />
      <circle cx={112} cy={42} r={1.4} fill="var(--ink)" stroke="none" />
      {[[40, 60], [48, 60], [72, 60], [80, 58]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y}l${i < 2 ? -2 : 2} 10l0 8l3 0`} strokeWidth={1.8} />
      ))}
      <path d="M8 80h104" {...thin} />
    </>
  ),
  mys: () => (
    <>
      <path d="M30 66c-10 4-22 2-26-6" {...thin} />
      <path d="M30 64c-2-14 12-24 32-24 16 0 28 6 34 16l12 6c-2 4-8 6-14 6H40c-6 0-10-2-10-4z" {...tint('muted', 0.35)} />
      <circle cx={84} cy={44} r={9} {...tint('pink', 0.3)} />
      <circle cx={84} cy={44} r={5} {...hair} />
      <circle cx={98} cy={56} r={1.6} fill="var(--ink)" stroke="none" />
      <circle cx={109} cy={62} r={1.4} fill="var(--pink)" stroke="none" />
      <path d="M105 64l1 5h2l-0.5-5z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth={0.6} />
      <path d="M106 60l10-4M106 62l11 0M106 62l10 4" {...hair} />
      <path d="M48 68l-2 6 3 1M76 68l2 6 3 1" {...thin} />
      <path d="M8 76h104" {...thin} />
    </>
  ),
}

/** Drawing of an organism; `label` (if given) is its accessible name. */
export function OrganismPic({ pic, label, className }: { pic: PicId; label?: string; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const hatch = `ik-h${uid}`
  return (
    <svg
      viewBox="0 0 120 90"
      className={className ? `g-ik-pic ${className}` : 'g-ik-pic'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <pattern id={hatch} width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="2.4" stroke="var(--ink)" strokeWidth="0.7" strokeOpacity="0.6" />
        </pattern>
      </defs>
      <g fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {PICS[pic](hatch)}
      </g>
    </svg>
  )
}

export const PIC_IDS = Object.keys(PICS) as PicId[]
