/**
 * Shared pieces of the three map games (Slepá mapa, Zeměpisná síť, Časová pásma): the round state,
 * the question header, answer options and MapStage – a GeoMap that takes taps and draws game marks on top.
 * Styles: map-kit.css (prefix g-mk-).
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MapBand, MapHighlight, MapLayer, MapPoint, MapRoute, MapView } from '../../core/types'
import { GeoMap, type GeoPick } from '../../geo/GeoMap'
import { getView } from '../../geo/frame'
import { loadView, type GeoData } from '../../geo/load'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameResult } from '../types'
import { projectParts, type LL } from './hit'
import './map-kit.css'

export const BONUS_MAX = 25
export const PER_TASK = 100 + BONUS_MAX

export type MsgKind = 'good' | 'bad' | 'warn' | 'info'
export type Msg = { kind: MsgKind; text: ReactNode }
export type Done = { points: number; ok: boolean } | null

/* ------------------------------------------------------------------ round state */

/** Task index, score, feedback and timing of one round; `finish` is called once after the last task. */
export function useRound<T>(tasks: T[], onFinish: (r: GameResult) => void) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState<Done>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(!done && tasks.length > 0, 250)
  const secs = done ? frozen : Math.max(0, (now - start) / 1000)
  const elapsed = useCallback(() => (Date.now() - start) / 1000, [start])

  const say = (kind: MsgKind, text: ReactNode) => {
    setMsg({ kind, text })
    setMsgN((n) => n + 1)
  }
  /** Ends the current task with `points`; `ok` decides the mascot and the jolt. */
  const end = (points: number, ok: boolean, kind: MsgKind, text: ReactNode) => {
    scoreRef.current += points
    setScore(scoreRef.current)
    setFrozen(elapsed())
    setDone({ points, ok })
    say(kind, text)
    if (ok) jolt.pop()
    else jolt.shake()
  }
  /** Full points plus the speed bonus for a time window [full, zero] in seconds. */
  const points = (win: [number, number]) => 100 + timeBonus(elapsed(), BONUS_MAX, win[0], win[1])
  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setDone(null)
    setMsg(null)
    setStart(Date.now())
  }
  return { i, t: tasks[i] as T, done, msg, msgN, score, secs, say, end, points, next, cardRef, jolt, last: i + 1 >= tasks.length }
}

/** Loads a view's data (for hit tests, label points and river lines); undefined until ready. */
export function useViewData(view: MapView): GeoData | undefined {
  const [d, setD] = useState<{ view: MapView; data: GeoData } | undefined>()
  useEffect(() => {
    let live = true
    loadView(view).then(
      (data) => live && setD({ view, data }),
      () => undefined,
    )
    return () => {
      live = false
    }
  }, [view])
  return d?.view === view ? d.data : undefined
}

/* ------------------------------------------------------------------ question header */

export function TaskHead({ eyebrow, k, mood, done, children }: { eyebrow: string; k: number; mood: Mood; done: Done; children: ReactNode }) {
  return (
    <div className="g-mk-top">
      <div className="g-mk-q">
        <span className="eyebrow">{eyebrow}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p key={k} className="g-mk-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            {children}
          </motion.p>
        </AnimatePresence>
      </div>
      <Mascot mood={mood} size={46} />
      {done && done.points > 0 && <PointsPop key={`p${k}`} points={done.points} />}
    </div>
  )
}

export function BonusBar({ value }: { value: number }) {
  return (
    <div className="g-mk-bonus" aria-label={`Bonus za rychlost: ${value} bodů`}>
      <Icon name="bolt" />
      <div className="progress g-mk-bonusbar">
        <span style={{ width: `${(value / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
      </div>
    </div>
  )
}

export interface Opt {
  id: string
  label: ReactNode
}

/** Answer buttons; after the answer the right one is marked, a wrong pick struck through. */
export function Options({ options, answer, picked, done, onPick, wide = false }: { options: Opt[]; answer: string; picked: string | null; done: boolean; onPick: (id: string) => void; wide?: boolean }) {
  return (
    <div className={`g-mk-options${wide ? ' wide' : ''}`} role="group" aria-label="Odpovědi">
      {options.map((o) => {
        const state = !done ? '' : o.id === answer ? ' right' : o.id === picked ? ' wrong' : ' off'
        return (
          <button key={o.id} type="button" className={`g-mk-option${state}`} disabled={done} aria-pressed={picked === o.id} onClick={() => onPick(o.id)}>
            <span>{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Status({ msg, n }: { msg: Msg | null; n: number }) {
  return (
    <div className="g-mk-status" aria-live="polite">
      {msg && (
        <Feedback kind={msg.kind} key={n}>
          {msg.text}
        </Feedback>
      )}
    </div>
  )
}

export function NextButton({ last, onClick }: { last: boolean; onClick: () => void }) {
  return (
    <motion.div className="g-sh-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
      <button type="button" className="btn btn-primary btn-lg" onClick={onClick} autoFocus>
        {last ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
      </button>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ the map */

/** A game mark drawn over the map: the tap, a pin, the right place, a wrong tap or a numbered choice. */
export interface Mark {
  lon: number
  lat: number
  kind: 'tap' | 'pin' | 'good' | 'bad' | 'num'
  n?: number
  label?: string
}
/** A line feature drawn over the map (a mountain range, a river): `target` while asked, `good` after. */
export interface Trace {
  parts: LL[][]
  tone: 'target' | 'good' | 'bad'
}

export interface MapStageProps {
  view: MapView
  layers?: MapLayer[]
  highlight?: MapHighlight[]
  points?: MapPoint[]
  routes?: MapRoute[]
  bands?: MapBand[]
  selected?: string[]
  /** hover outline of states / regions (tap-a-state tasks) */
  hover?: boolean
  /** taps are taken while set; `u` = SVG units per CSS px (for tolerances in screen px) */
  onTap?: (hit: GeoPick, u: number) => void
  marks?: Mark[]
  traces?: Trace[]
  label?: string
}

const EMPTY: never[] = []

export function MapStage({ view, layers = EMPTY, highlight = EMPTY, points = EMPTY, routes = EMPTY, bands = EMPTY, selected = EMPTY, hover = false, onTap, marks = EMPTY, traces = EMPTY, label }: MapStageProps) {
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(640)
  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((e) => {
      const cw = e[0]?.contentRect.width ?? 0
      if (cw > 0) setW(cw)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const u = 1000 / w
  const uRef = useRef(u)
  uRef.current = u
  const tapRef = useRef(onTap)
  tapRef.current = onTap
  const pick = useCallback((hit: GeoPick) => tapRef.current?.(hit, uRef.current), [])
  const clip = 'gmk' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const H = getView(view).H
  const traceD = useMemo(
    () =>
      traces.map((t) =>
        projectParts(view, t.parts)
          .map((p) => (p.length === 1 ? '' : 'M' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')))
          .join(''),
      ),
    [view, traces],
  )
  return (
    <div ref={box} className={`g-mk-map${onTap ? ' tapping' : ''}`}>
      <GeoMap
        view={view}
        layers={layers}
        highlight={highlight}
        points={points}
        routes={routes}
        bands={bands}
        selected={selected}
        interactive={hover && !!onTap}
        onPick={onTap ? pick : undefined}
        label={label}
        animate={false}
      >
        {({ project }) => (
          <g className="g-mk-over">
            <clipPath id={clip}>
              <rect x={0} y={0} width={1000} height={H} />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
              {traces.map((t, k) => (
                <g key={k} className={`g-mk-trace g-mk-trace-${t.tone}`}>
                  <path d={traceD[k]} className="g-mk-trace-halo" strokeWidth={9 * u} />
                  <path d={traceD[k]} className="g-mk-trace-line" strokeWidth={4 * u} />
                  {t.parts.filter((p) => p.length === 1).map((p, j) => {
                    const [x, y] = project(p[0][0], p[0][1])
                    return <circle key={j} cx={x} cy={y} r={7 * u} className="g-mk-trace-dot" strokeWidth={2 * u} />
                  })}
                </g>
              ))}
            </g>
            {marks.map((m, k) => {
              const [x, y] = project(m.lon, m.lat)
              return <MarkSym key={k} m={m} x={x} y={y} u={u} />
            })}
          </g>
        )}
      </GeoMap>
    </div>
  )
}

function MarkSym({ m, x, y, u }: { m: Mark; x: number; y: number; u: number }) {
  const s = (v: number) => v * u
  const text = m.label ? (
    <text x={x + s(11)} y={y + s(4.5)} className="g-mk-mark-label" fontSize={s(13)} strokeWidth={s(3.5)}>
      {m.label}
    </text>
  ) : null
  switch (m.kind) {
    case 'tap':
      return (
        <g className="g-mk-mark g-mk-mark-tap">
          <circle cx={x} cy={y} r={s(8)} strokeWidth={s(2.2)} />
          <path d={`M${x - s(12)} ${y}H${x - s(4)}M${x + s(4)} ${y}H${x + s(12)}M${x} ${y - s(12)}V${y - s(4)}M${x} ${y + s(4)}V${y + s(12)}`} strokeWidth={s(2)} />
        </g>
      )
    case 'pin':
      return (
        <g className="g-mk-mark g-mk-mark-pin">
          <path
            d={`M${x} ${y}C${x - s(2)} ${y - s(5)} ${x - s(7)} ${y - s(8)} ${x - s(7)} ${y - s(14)}A${s(7)} ${s(7)} 0 1 1 ${x + s(7)} ${y - s(14)}C${x + s(7)} ${y - s(8)} ${x + s(2)} ${y - s(5)} ${x} ${y}Z`}
            strokeWidth={s(1.6)}
          />
          <circle cx={x} cy={y - s(14)} r={s(2.6)} className="g-mk-pin-eye" />
          {text}
        </g>
      )
    case 'good':
      return (
        <g className="g-mk-mark g-mk-mark-good">
          <circle cx={x} cy={y} r={s(9)} strokeWidth={s(2.6)} />
          <circle cx={x} cy={y} r={s(2.4)} className="g-mk-dot" />
          {text}
        </g>
      )
    case 'bad':
      return (
        <g className="g-mk-mark g-mk-mark-bad">
          <path d={`M${x - s(6)} ${y - s(6)}L${x + s(6)} ${y + s(6)}M${x + s(6)} ${y - s(6)}L${x - s(6)} ${y + s(6)}`} strokeWidth={s(3)} />
        </g>
      )
    case 'num':
      return (
        <g className="g-mk-mark g-mk-mark-num">
          <circle cx={x} cy={y} r={s(10)} strokeWidth={s(1.8)} />
          <text x={x} y={y + s(4.6)} fontSize={s(13)} textAnchor="middle">
            {m.n}
          </text>
        </g>
      )
  }
}

/**
 * Keyboard (and no-tap) alternative for a tap task: four numbered places on the map, chosen with buttons.
 * Renders the toggle; while open, the parent draws the numbered marks and the number buttons.
 */
export function NoTapToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="btn btn-ghost g-mk-notap" aria-pressed={open} onClick={onToggle}>
      <Icon name={open ? 'x' : 'target'} />
      {open ? 'Zpět na ťukání' : 'Vybrat z očíslovaných míst'}
    </button>
  )
}
