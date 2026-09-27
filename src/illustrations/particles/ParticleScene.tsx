import { Fragment, useId, useMemo, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import type { ParticleBox } from '../../core/types'
import { Md, plain } from '../../core/markup'
import { stagger, rise, ease } from '../../ui/motion'
import { ChargeBadge, GlyphG } from './Glyph'
import { glyphFor, hash, rng, type Glyph } from './species'
import './particles.css'

/**
 * Particle-model "specimen jars": elements, compounds, mixtures, states of matter,
 * solutions, before → after. Particles jiggle / slide / fly with CSS ambient loops
 * and rest in place when motion is reduced.
 */
export function ParticleScene({ boxes, arrows }: { boxes: ParticleBox[]; arrows?: boolean }) {
  const scale = useMemo(() => Math.min(...boxes.map(maxScale), 10), [boxes])
  return (
    <motion.div
      className="pt-scene"
      variants={stagger(0.14, 0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {boxes.map((b, i) => (
        <Fragment key={i}>
          {arrows && i > 0 && <SceneArrow />}
          <motion.div className="pt-box" variants={rise}>
            <Jar box={b} index={i} scale={scale} />
            <div className="pt-label">
              <Md text={b.label} />
            </div>
            {b.note && (
              <div className="pt-note">
                <Md text={b.note} />
              </div>
            )}
          </motion.div>
        </Fragment>
      ))}
    </motion.div>
  )
}

function SceneArrow() {
  return (
    <motion.div className="pt-arrow" variants={rise} aria-hidden="true">
      <svg viewBox="0 0 44 24">
        <motion.path
          d="M4 12 H38"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.5, ease: ease.out } } }}
        />
        <path d="M31 5 L39 12 L31 19" />
      </svg>
    </motion.div>
  )
}

// ------------------------------------------------------------------ geometry
/** jar interior (particle area) in the 160×190 viewBox */
const IN = { x0: 28, x1: 132, y0: 36, y1: 166 }
const IW = IN.x1 - IN.x0
const IH = IN.y1 - IN.y0

const STATE_CZ: Record<string, string> = { solid: 'pevná látka', liquid: 'kapalina', gas: 'plyn', solution: 'roztok' }

interface Species {
  g: Glyph
  count: number
}

function speciesOf(box: ParticleBox): Species[] {
  return box.items.map((it) => ({ g: glyphFor(it.species), count: Math.max(0, Math.min(60, Math.round(it.count))) }))
}

/** Largest px/Å scale at which this box's particles fit their arrangement. */
function maxScale(box: ParticleBox): number {
  const sp = speciesOf(box)
  const n = sp.reduce((s, x) => s + x.count, 0) || 1
  const span = Math.max(...sp.map((x) => x.g.span), 1.2)
  const state = box.state
  if (state === 'solid') {
    let best = 0
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols)
      best = Math.max(best, Math.min(IW / (cols * span * 1.06), (IH * 0.8) / (rows * span * 1.06)))
    }
    return best
  }
  if (state === 'liquid') return Math.sqrt((IW * IH * 0.5) / (n * span * span))
  if (state === 'solution') return Math.sqrt((IW * IH * 0.16) / (n * span * span))
  return Math.sqrt((IW * IH * 0.15) / (n * span * span))
}

interface Placed {
  g: Glyph
  x: number
  y: number
  rot: number
  kind: 'vib' | 'slide' | 'fly'
  style: CSSProperties
  solvent?: boolean
}

function interleave(sp: Species[]): Glyph[] {
  const left = sp.map((s) => s.count)
  const out: Glyph[] = []
  while (left.some((c) => c > 0))
    sp.forEach((s, k) => {
      if (left[k] > 0) {
        out.push(s.g)
        left[k]--
      }
    })
  return out
}

function shuffle<T>(a: T[], r: () => number) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const px = (v: number) => `${v.toFixed(1)}px`

/** Random points inside [x0,x1]×[y0,y1] keeping a minimum distance (seeded). */
function scatter(n: number, box: { x0: number; x1: number; y0: number; y1: number }, minD: number, r: () => number, taken: { x: number; y: number; d: number }[] = []) {
  const pts: { x: number; y: number }[] = []
  let d = minD
  let tries = 0
  while (pts.length < n) {
    const x = box.x0 + r() * (box.x1 - box.x0)
    const y = box.y0 + r() * (box.y1 - box.y0)
    const ok = pts.every((p) => Math.hypot(p.x - x, p.y - y) >= d) && taken.every((p) => Math.hypot(p.x - x, p.y - y) >= (p.d + d) / 2)
    if (ok) pts.push({ x, y })
    if (++tries > 400) {
      d *= 0.9
      tries = 0
    }
  }
  return pts
}

function layout(box: ParticleBox, index: number, s: number): { parts: Placed[]; level: number | null } {
  const r = rng(hash(JSON.stringify(box.items) + (box.state ?? '') + index))
  const sp = speciesOf(box)
  const glyphs = interleave(sp)
  const n = glyphs.length
  const span = Math.max(...sp.map((x) => x.g.span), 1.2) * s
  const parts: Placed[] = []
  const state = box.state

  if (state === 'solid') {
    const cell = span * 1.06
    let cols = 1
    let best = -1
    for (let c = 1; c <= n; c++) {
      const rows = Math.ceil(n / c)
      if (c * cell > IW + 0.01 || rows * cell > IH * 0.8 + 0.01) continue
      const score = -Math.abs(c * cell - rows * cell * 1.25)
      if (score > best || best === -1) {
        best = score
        cols = c
      }
    }
    const rows = Math.ceil(n / cols)
    const x0 = (IN.x0 + IN.x1) / 2 - ((cols - 1) * cell) / 2
    glyphs.forEach((g, k) => {
      const row = Math.floor(k / cols)
      let col = k % cols
      if (row % 2) col = cols - 1 - col
      const y = IN.y1 - span / 2 - (rows - 1 - row) * cell - 2
      parts.push({
        g,
        x: x0 + col * cell,
        y,
        rot: 0,
        kind: 'vib',
        style: { '--dur': `${(0.28 + r() * 0.25).toFixed(2)}s`, '--delay': `${(-r()).toFixed(2)}s` } as CSSProperties,
      })
    })
    return { parts, level: null }
  }

  if (state === 'liquid') {
    const order = shuffle([...glyphs], r)
    const cell = span * 0.98
    const cols = Math.max(1, Math.floor(IW / cell))
    const xPad = (IW - cols * cell) / 2
    order.forEach((g, k) => {
      const row = Math.floor(k / cols)
      const col = k % cols
      const shift = row % 2 ? cell * 0.5 : 0
      const x = IN.x0 + xPad + cell / 2 + ((col * cell + shift) % (cols * cell)) + (r() - 0.5) * cell * 0.15
      const y = IN.y1 - cell / 2 - row * cell * 0.86 - r() * cell * 0.1
      parts.push({
        g,
        x,
        y,
        rot: (r() - 0.5) * 70,
        kind: 'slide',
        style: {
          '--dur': `${(2.6 + r() * 2.4).toFixed(2)}s`,
          '--delay': `${(-r() * 4).toFixed(2)}s`,
          '--dx': px((r() - 0.5) * cell * 0.5),
          '--dy': px((r() - 0.5) * cell * 0.2),
          '--rot': `${((r() - 0.5) * 40).toFixed(0)}deg`,
        } as CSSProperties,
      })
    })
    const rows = Math.ceil(n / cols)
    const level = Math.max(IN.y0 + 6, IN.y1 - rows * cell * 0.86 - cell * 0.35)
    return { parts, level }
  }

  if (state === 'solution') {
    const level = IN.y0 + IH * 0.2
    const reg = { x0: IN.x0 + span / 2, x1: IN.x1 - span / 2, y0: level + span / 2 + 2, y1: IN.y1 - span / 2 }
    const pts = scatter(n, reg, span * 1.25, r)
    const solutes = shuffle([...glyphs], r).map((g, k) => ({ g, ...pts[k] }))
    // faint solvent water molecules in the gaps
    const water = glyphFor('H2O')
    const ws = Math.min(s * 0.8, 7)
    const wSpan = water.span * ws
    const taken = solutes.map((p) => ({ x: p.x, y: p.y, d: span * 1.1 + wSpan }))
    const wReg = { x0: IN.x0 + wSpan / 2, x1: IN.x1 - wSpan / 2, y0: level + wSpan / 2 + 1, y1: IN.y1 - wSpan / 2 }
    const room = Math.max(0, (IW * (IN.y1 - level) - n * span * span * 1.3) / (wSpan * wSpan * 2.2))
    const wn = Math.min(46, Math.floor(room))
    const wpts = scatterSoft(wn, wReg, wSpan * 1.15, r, taken)
    for (const p of wpts)
      parts.push({
        g: water,
        x: p.x,
        y: p.y,
        rot: r() * 360,
        kind: 'slide',
        solvent: true,
        style: {
          '--dur': `${(3 + r() * 3).toFixed(2)}s`,
          '--delay': `${(-r() * 5).toFixed(2)}s`,
          '--dx': px((r() - 0.5) * 5),
          '--dy': px((r() - 0.5) * 3),
          '--rot': `${((r() - 0.5) * 60).toFixed(0)}deg`,
        } as CSSProperties,
      })
    for (const p of solutes)
      parts.push({
        g: p.g,
        x: p.x,
        y: p.y,
        rot: (r() - 0.5) * 90,
        kind: 'slide',
        style: {
          '--dur': `${(3.4 + r() * 3).toFixed(2)}s`,
          '--delay': `${(-r() * 5).toFixed(2)}s`,
          '--dx': px((r() - 0.5) * 8),
          '--dy': px((r() - 0.5) * 6),
          '--rot': `${((r() - 0.5) * 50).toFixed(0)}deg`,
        } as CSSProperties,
      })
    return { parts, level }
  }

  // gas (and default)
  const reg = { x0: IN.x0 + span / 2, x1: IN.x1 - span / 2, y0: IN.y0 + span / 2, y1: IN.y1 - span / 2 }
  const pts = scatter(n, reg, Math.max(span * 1.4, Math.sqrt((IW * IH) / n) * 0.72), r)
  shuffle([...glyphs], r).forEach((g, k) => {
    const p = pts[k]
    const fly = state === 'gas'
    const way = () => ({ x: reg.x0 + r() * (reg.x1 - reg.x0) - p.x, y: reg.y0 + r() * (reg.y1 - reg.y0) - p.y })
    const w1 = way()
    const w2 = way()
    const w3 = way()
    parts.push({
      g,
      x: p.x,
      y: p.y,
      rot: r() * 360,
      kind: fly ? 'fly' : 'slide',
      style: fly
        ? ({
            '--dur': `${(7 + r() * 5).toFixed(2)}s`,
            '--delay': `${(-r() * 10).toFixed(2)}s`,
            '--x1': px(w1.x),
            '--y1': px(w1.y),
            '--x2': px(w2.x),
            '--y2': px(w2.y),
            '--x3': px(w3.x),
            '--y3': px(w3.y),
            '--sdur': `${(4 + r() * 6).toFixed(2)}s`,
          } as CSSProperties)
        : ({
            '--dur': `${(3 + r() * 3).toFixed(2)}s`,
            '--delay': `${(-r() * 5).toFixed(2)}s`,
            '--dx': px((r() - 0.5) * 6),
            '--dy': px((r() - 0.5) * 6),
            '--rot': `${((r() - 0.5) * 40).toFixed(0)}deg`,
          } as CSSProperties),
    })
  })
  return { parts, level: null }
}

/** Like scatter but gives up gracefully (solvent is decoration). */
function scatterSoft(n: number, box: { x0: number; x1: number; y0: number; y1: number }, d: number, r: () => number, taken: { x: number; y: number; d: number }[]) {
  const pts: { x: number; y: number }[] = []
  for (let t = 0; t < n * 60 && pts.length < n; t++) {
    const x = box.x0 + r() * (box.x1 - box.x0)
    const y = box.y0 + r() * (box.y1 - box.y0)
    if (pts.every((p) => Math.hypot(p.x - x, p.y - y) >= d) && taken.every((p) => Math.hypot(p.x - x, p.y - y) >= p.d / 2)) pts.push({ x, y })
  }
  return pts
}

// ------------------------------------------------------------------ jar
const OUTER = 'M18 26 V158 Q18 176 36 176 H124 Q142 176 142 158 V26 Z'
const INNER = 'M23.5 27 V157 Q23.5 170.5 37 170.5 H123 Q136.5 170.5 136.5 157 V27 Z'

function Jar({ box, index, scale }: { box: ParticleBox; index: number; scale: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { parts, level } = useMemo(() => layout(box, index, scale), [box, index, scale])
  const aria =
    `${plain(box.label)}: ` +
    box.items.map((it) => `${it.count}× ${plain('$' + it.species + '$')}`).join(', ') +
    (box.state ? ` (${STATE_CZ[box.state]})` : '')
  const glass = `pt-g-${uid}`
  const liq = `pt-l-${uid}`
  const clip = `pt-c-${uid}`
  return (
    <svg className="pt-jar" viewBox="0 0 160 190" role="img" aria-label={aria}>
      <defs>
        <pattern id={glass} patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" className="pt-hatch" />
        </pattern>
        <pattern id={liq} patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="5" className="pt-liq-hatch" />
        </pattern>
        <clipPath id={clip}>
          <path d={INNER} />
        </clipPath>
      </defs>
      {/* lid and rim */}
      <rect x="26" y="5" width="108" height="12" rx="3" fill={`url(#${glass})`} className="pt-lid" />
      <rect x="26" y="5" width="108" height="12" rx="3" className="pt-line" />
      {/* glass wall (hatched) */}
      <path d={OUTER} fill={`url(#${glass})`} />
      <path d={INNER} className="pt-inside" />
      <g clipPath={`url(#${clip})`}>
        {level !== null && (
          <>
            <rect x="20" y={level} width="120" height={180 - level} className="pt-liquid" />
            <rect x="20" y={level} width="120" height={180 - level} fill={`url(#${liq})`} />
            <path d={`M20 ${level - 2.5} Q80 ${level + 3} 140 ${level - 2.5}`} className="pt-surface" />
          </>
        )}
        {parts.map((p, k) => (
          <g key={k} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} className={p.solvent ? 'pt-solvent' : undefined}>
            <g className={`pt-${p.kind}`} style={p.style}>
              <g className={p.kind === 'fly' ? 'pt-spin' : undefined} style={p.kind === 'fly' ? p.style : undefined}>
                <g transform={`rotate(${p.rot.toFixed(0)})`}>
                  <GlyphG g={p.g} s={p.solvent ? Math.min(scale * 0.8, 7) : scale} badge={false} />
                </g>
              </g>
              {!p.solvent && <ChargeBadge g={p.g} s={scale} />}
            </g>
          </g>
        ))}
      </g>
      <path d={INNER} className="pt-line pt-line-thin" />
      <path d={OUTER} className="pt-line" />
      <rect x="14" y="15" width="132" height="12" rx="3.5" className="pt-rim" />
      <path d="M30 40 V148" className="pt-glare" />
    </svg>
  )
}
