import type { CSSProperties } from 'react'
import { motion, type Variants } from 'motion/react'
import type { IconItem } from '../../core/types'
import { Md } from '../../core/markup'
import { ChemIconView } from '../ChemIcon'
import { ease, spring } from '../../ui/motion'
import { Medal } from './Medal'
import '../illustrations.css'

/** Seconds between two stations lighting up. */
const STEP = 0.32

const station: Variants = {
  hidden: { opacity: 0.3, filter: 'grayscale(1)' },
  show: (i: number) => ({ opacity: 1, filter: 'grayscale(0)', transition: { delay: i * STEP, duration: 0.35 } }),
}
const medal: Variants = {
  hidden: { scale: 0.75 },
  show: (i: number) => ({ scale: 1, transition: { ...spring.bouncy, delay: i * STEP } }),
}
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: i * STEP + 0.18, duration: 0.35, ease: ease.inOut },
  }),
}
const head: Variants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({ opacity: 1, transition: { delay: i * STEP + 0.45, duration: 0.15 } }),
}
const fade: Variants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({ opacity: 1, transition: { delay: i * STEP + 0.15, duration: 0.4 } }),
}

type Placement = 'top' | 'bottom' | 'left' | 'right'

function Station({
  step,
  i,
  className = '',
  style,
}: {
  step: IconItem
  i: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.li className={`il-station ${className}`} style={style} custom={i} variants={station}>
      <motion.span custom={i} variants={medal} style={{ display: 'block', position: 'relative' }}>
        <Medal icon={step.icon}>
          <span className="il-station-no" aria-hidden="true">
            {i + 1}
          </span>
        </Medal>
      </motion.span>
      <div className="il-station-body">
        <div className="il-station-title">
          <Md text={step.title} />
        </div>
        {step.text && (
          <div className="il-station-text">
            <Md text={step.text} />
          </div>
        )}
      </div>
    </motion.li>
  )
}

function HArrow({ i }: { i: number }) {
  return (
    <svg className="il-arrow il-arrow-h" viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="M3 10h27" custom={i} variants={draw} />
      <motion.path d="M24.5 5.5 30 10l-5.5 4.5" custom={i} variants={head} />
    </svg>
  )
}

function VArrow({ i }: { i: number }) {
  return (
    <svg className="il-arrow il-arrow-v" viewBox="0 0 56 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="M28 3v23" custom={i} variants={draw} />
      <motion.path d="M23.5 20.5 28 26l4.5-5.5" custom={i} variants={head} />
    </svg>
  )
}

const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.25 } } as const

/** A flow of numbered stations: rows of arrows on wide screens, a vertical list on phones. */
function Flow({ steps }: { steps: IconItem[] }) {
  const n = steps.length
  const per = n <= 4 ? n : n <= 8 ? Math.ceil(n / 2) : 4
  const cols = per > 1 ? `repeat(${per - 1}, minmax(0, 1fr) var(--arrow)) minmax(0, 1fr)` : 'minmax(0, 1fr)'
  const items = []
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / per)
    const col = i % per
    items.push(
      <Station key={`s${i}`} step={steps[i]} i={i} style={{ '--r': row * 2 + 1, '--c': col * 2 + 1 } as CSSProperties} />,
    )
    if (i === n - 1) break
    const rowEnd = col === per - 1
    items.push(
      <li
        key={`a${i}`}
        aria-hidden="true"
        className={`il-arrow-wrap${rowEnd ? ' is-rowend' : ''}`}
        style={{ '--r': row * 2 + 1, '--c': col * 2 + 2 } as CSSProperties}
      >
        <HArrow i={i} />
        <VArrow i={i} />
      </li>,
    )
    if (rowEnd) {
      items.push(
        <motion.li
          key={`r${i}`}
          className="il-return"
          aria-hidden="true"
          custom={i}
          variants={fade}
          style={{ '--r': row * 2 + 2, '--per': per } as CSSProperties}
        >
          <span className="il-return-a" />
          <span className="il-return-b" />
          <svg className="il-return-head" viewBox="0 0 13 10" aria-hidden="true">
            <path d="M1.5 2 6.5 8.5 11.5 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.li>,
      )
    }
  }
  return (
    <motion.ol className="il-flow" style={{ '--cols': cols, listStyle: 'none', margin: 0, padding: 0 } as CSSProperties} {...inView}>
      {items}
    </motion.ol>
  )
}

/* ring geometry (SVG user units) */
const W = 720
const R = 165
const TOP = 112
const CX = W / 2
const CY = TOP + R
/** a station sits at the very bottom only for an even count; its text needs room below */
const ringHeight = (n: number) => TOP + 2 * R + (n % 2 === 0 ? 118 : 36)

function polar(deg: number, r = R) {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const
}
const f = (v: number) => v.toFixed(1)

/** Stations on a closed ring (wide) / a looped vertical list (narrow). */
function Cycle({ steps }: { steps: IconItem[] }) {
  const n = steps.length
  const H = ringHeight(n)
  const angle = (i: number) => -90 + (360 / n) * i
  const gap = (38 / R) * (180 / Math.PI)
  const arcs = steps.map((_, i) => {
    const a0 = angle(i) + gap
    const a1 = angle(i + 1) - gap
    const [x0, y0] = polar(a0)
    const [x1, y1] = polar(a1)
    const large = a1 - a0 > 180 ? 1 : 0
    // arrowhead: tangent (clockwise) at the end point
    const t = (a1 * Math.PI) / 180
    const tx = -Math.sin(t)
    const ty = Math.cos(t)
    const hl = 10
    const wing = (s: number) => {
      const c = Math.cos(0.5)
      const sn = Math.sin(0.5) * s
      const bx = -tx
      const by = -ty
      return [x1 + hl * (bx * c - by * sn), y1 + hl * (bx * sn + by * c)] as const
    }
    const [ax, ay] = wing(1)
    const [bx, by] = wing(-1)
    return {
      d: `M${f(x0)} ${f(y0)}A${R} ${R} 0 ${large} 1 ${f(x1)} ${f(y1)}`,
      h: `M${f(ax)} ${f(ay)}L${f(x1)} ${f(y1)}L${f(bx)} ${f(by)}`,
    }
  })
  const placement = (i: number): Placement => {
    const a = (angle(i) * Math.PI) / 180
    const c = Math.cos(a)
    if (Math.abs(c) < 0.3) return Math.sin(a) < 0 ? 'top' : 'bottom'
    return c > 0 ? 'right' : 'left'
  }
  return (
    <>
      <motion.div
        className="il-cycle-ring"
        style={{ '--ring-h': H, '--hub-y': (CY / H) * 100 } as CSSProperties}
        {...inView}
      >
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx={CX} cy={CY} r={R + 7} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 5" />
          {arcs.map((a, i) => (
            <g key={i} className="il-ring-path">
              <motion.path d={a.d} custom={i} variants={draw} />
              <motion.path d={a.h} custom={i} variants={head} />
            </g>
          ))}
        </svg>
        <div className="il-cycle-hub" aria-hidden="true">
          <ChemIconView name="arrow-cycle" size={40} />
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {steps.map((s, i) => {
            const [x, y] = polar(angle(i))
            return (
              <Station
                key={i}
                step={s}
                i={i}
                className={`il-at-${placement(i)}`}
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              />
            )
          })}
        </ol>
      </motion.div>
      <motion.ol className="il-cycle-list" style={{ listStyle: 'none', margin: 0 }} {...inView}>
        <motion.li className="il-loop-rail" aria-hidden="true" custom={n - 1} variants={fade} />
        {steps.map((s, i) => [
          <Station key={`s${i}`} step={s} i={i} />,
          <li key={`a${i}`} className="il-arrow-wrap" aria-hidden="true">
            <VArrow i={i} />
          </li>,
        ])}
        <motion.li className="il-loop-back" custom={n - 1} variants={fade}>
          ↺ zpět na začátek
        </motion.li>
      </motion.ol>
    </>
  )
}

/** 3–7 steps with icons, as a flow (→) or a closed cycle. */
export function Process({ layout, steps }: { layout: 'flow' | 'cycle'; steps: IconItem[] }) {
  return (
    <div className={`il-process il-process-${layout}`} role="group" aria-label={layout === 'cycle' ? 'Koloběh' : 'Postup'}>
      {layout === 'cycle' && steps.length > 2 ? <Cycle steps={steps} /> : <Flow steps={steps} />}
    </div>
  )
}
