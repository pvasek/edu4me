import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, shake, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import {
  SEG_NAME,
  TOL,
  UNITS,
  areaOf,
  checkValue,
  cz,
  describe,
  graphOf,
  makeRound,
  pieces,
  playedLevel,
  shapeLabel,
  slope,
  typeName,
  type Graph,
  type NumTask,
  type Task,
  type Unit,
} from './logic'
import './motion-graph.css'

const BASE = 100
const BONUS = 25
const PER_TASK = BASE + BONUS

type Status = 'play' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const optVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, x: 0, scale: 1, transition: { ...spring.snappy, delay: 0.05 + i * 0.05 } }),
  correct: { opacity: 1, y: 0, scale: bump.scale, transition: bump.transition },
  wrong: { opacity: 1, y: 0, x: shake.x, transition: shake.transition },
  dim: { opacity: 0.5, y: 0, scale: 0.98, transition: { duration: 0.2 } },
}

export default function MotionGraph({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState<Task[]>(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [unit, setUnit] = useState<Unit | null>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const t = tasks[i]
  const numeric = t.level === 8
  const full = numeric ? 25 : 8
  const zero = numeric ? 75 : 30
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS, full, zero) : 0
  const last = i + 1 >= tasks.length

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }

  const win = (why: string) => {
    const el = (Date.now() - start) / 1000
    const p = tries === 0 ? BASE + timeBonus(el, BONUS, full, zero) : Math.round(BASE / 2)
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    setFrozen(el)
    setStatus('won')
    say('good', `Správně! ${why}`)
    jolt.pop()
  }

  const lose = (lead: string, why: string, kind: Msg['kind'] = 'bad') => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say(kind, `${lead}${why}`)
    jolt.shake()
  }

  const pick = (k: number) => {
    if (status !== 'play' || t.level !== 2) return
    setPicked(k)
    const right = graphOf(t.story)
    const why = describe(right)
    if (k === t.answer) {
      win(why)
      return
    }
    if (t.kind === 'pick-graph') {
      const g = t.options[k]
      const lead = g.type !== right.type ? `Pozor na osy: tohle je graf ${typeName(g.type)}. ` : 'Tenhle graf vypráví jiný příběh. '
      lose(lead, why)
    } else lose('Tenhle příběh ke grafu nepatří. ', why)
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play' || t.level !== 8) return
    const r = checkValue(text, t.answer)
    if (r === 'invalid') {
      say('info', 'Napiš číslo, třeba 2,5 nebo −1,5. Desetinná čárka i tečka platí.')
      return
    }
    if (!unit) {
      say('info', 'Vyber ještě jednotku.')
      return
    }
    if (r === 'ok' && unit === t.unit) {
      win(t.why)
      return
    }
    const lead = r === 'ok' ? `Číslo sedí, ale jednotka ne: ${hintUnit(t)} ` : unit !== t.unit ? `Číslo ani jednotka nesedí. ` : `${text.trim()} ${unit} to není. `
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say('bad', `${lead}${r === 'ok' ? '' : hintNum(t)} Zkus to ještě jednou.`)
      inputRef.current?.select()
      return
    }
    lose(lead, `Správně je ${cz(t.answer)} ${t.unit}. ${t.why}`)
  }

  const giveUp = () => {
    if (status !== 'play' || t.level !== 8) return
    lose('', `Správně je ${cz(t.answer)} ${t.unit}. ${t.why}`, 'info')
  }

  const next = () => {
    if (last) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setPicked(null)
    setText('')
    setUnit(null)
    setMsg(null)
    setPts(0)
    setStart(Date.now())
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Keys 1–4 pick an option on level 2.
  useEffect(() => {
    if (t.level !== 2 || status !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= t.options.length) {
        e.preventDefault()
        pick(n - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'
  const instr =
    t.level === 2
      ? 'Přiřaď příběh ke grafu. Hlídej osy: s–t je dráha v čase, v–t je rychlost v čase.'
      : `Čti z grafu v–t: směrnice je zrychlení, plocha pod grafem je dráha. Napiš číslo a vyber jednotku (tolerance ±${TOL * 100} %).`

  return (
    <div className="g-sh-root g-mg">
      <p className="g-sh-instr">{instr}</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Graf" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-mg-card">
        <div className="g-mg-top">
          <span className="eyebrow">
            {t.level === 2 ? (t.kind === 'pick-graph' ? 'Příběh → graf' : 'Graf → příběh') : 'Graf v–t · úroveň 8'}
          </span>
          <Mascot mood={mood} size={48} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            className="g-mg-prompt"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: spring.gentle }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          >
            {t.level === 2 && t.kind === 'pick-graph' && (
              <>
                <p className="g-mg-story">„{t.story.text}“</p>
                <p className="g-mg-q">Který graf k příběhu patří?</p>
              </>
            )}
            {t.level === 2 && t.kind === 'pick-story' && (
              <>
                <div className="g-mg-big">
                  <MiniGraph g={graphOf(t.story)} big />
                </div>
                <p className="g-mg-q">Který příběh graf popisuje?</p>
              </>
            )}
            {t.level === 8 && (
              <>
                <p className="g-mg-q">{t.question}</p>
                <VtChart task={t} reveal={status !== 'play'} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
        {status === 'play' && (
          <div className="g-mg-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-mg-bonusbar">
              <span style={{ width: `${(bonus / BONUS) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {t.level === 2 && (
        <div className={t.kind === 'pick-graph' ? 'g-mg-tiles' : 'g-mg-stories'} role="group" aria-label="Možnosti">
          {t.options.map((o, k) => {
            const right = k === t.answer
            const state = status === 'play' ? 'show' : right ? 'correct' : picked === k ? 'wrong' : 'dim'
            return (
              <motion.button
                key={`${i}-${k}`}
                type="button"
                className={`g-mg-opt is-${state}`}
                onClick={() => pick(k)}
                disabled={status !== 'play'}
                aria-keyshortcuts={String(k + 1)}
                aria-label={t.kind === 'pick-graph' ? `${k + 1}: ${shapeLabel(o as Graph)}` : undefined}
                custom={k}
                variants={optVariants}
                initial="hidden"
                animate={state}
                whileTap={status === 'play' ? { y: 3 } : undefined}
              >
                <span className="g-mg-key" aria-hidden="true">
                  {k + 1}
                </span>
                {t.kind === 'pick-graph' ? <MiniGraph g={o as Graph} /> : <span className="g-mg-opt-text">{(o as { text: string }).text}</span>}
                {status !== 'play' && (right || picked === k) && (
                  <motion.span className="g-mg-opt-icon" variants={popIn} initial="hidden" animate="show">
                    <Icon name={right ? 'check' : 'x'} />
                    <span className="sr-only">{right ? 'správně' : 'tvoje volba, špatně'}</span>
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      )}

      {t.level === 8 && status === 'play' && (
        <form className="g-mg-form" onSubmit={submit}>
          <div className="g-mg-field">
            <label className="sr-only" htmlFor="g-mg-in">
              Výsledek (číslo)
            </label>
            <input
              id="g-mg-in"
              ref={inputRef}
              className="g-sh-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoFocus
              placeholder="např. 2,5"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="g-mg-units" role="radiogroup" aria-label="Jednotka">
              {UNITS.map((u) => (
                <button key={u} type="button" role="radio" aria-checked={unit === u} className={`g-mg-unit${unit === u ? ' on' : ''}`} onClick={() => setUnit(u)}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="g-sh-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim() || !unit}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </form>
      )}

      <div className="g-mg-status" aria-live="polite">
        <AnimatePresence mode="wait">
          {msg && (
            <Feedback kind={msg.kind} key={msgN}>
              {msg.text}
            </Feedback>
          )}
        </AnimatePresence>
      </div>

      {status !== 'play' && (
        <motion.div className="g-mg-next" variants={fadeUp} initial="hidden" animate="show">
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {last ? 'Dokončit' : 'Další graf'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}

function hintUnit(t: NumTask): string {
  if (t.kind === 'slope') return 'zrychlení se měří v m/s² (metr za sekundu na druhou).'
  if (t.kind === 'avg') return 'rychlost se měří v m/s.'
  return 'dráha je délka, měří se v metrech.'
}

function hintNum(t: NumTask): string {
  if (t.kind === 'slope') return 'Zrychlení = změna rychlosti : doba (Δv / Δt).'
  if (t.kind === 'avg') return 'Průměrná rychlost = celá dráha : celý čas.'
  return 'Dráha = plocha pod grafem (obdélník v·t, trojúhelník ½·t·v).'
}

// ------------------------------------------------------------------ drawings

/** Small engraved graph without numbers (level 2). */
function MiniGraph({ g, big = false }: { g: Graph; big?: boolean }) {
  const W = 160
  const H = 108
  const L = 20
  const B = 18
  const T = 10
  const R = 12
  const tMax = g.t[g.t.length - 1]
  const yMax = Math.max(6, ...g.y) * 1.12
  const x = (tt: number) => L + (tt / tMax) * (W - L - R)
  const y = (v: number) => H - B - (v / yMax) * (H - B - T)
  const d = g.t.map((tt, k) => `${k ? 'L' : 'M'}${x(tt).toFixed(1)} ${y(g.y[k]).toFixed(1)}`).join(' ')
  const uid = useId().replace(/:/g, '')
  return (
    <svg className={`g-mg-mini${big ? ' big' : ''}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={shapeLabel(g)}>
      <defs>
        <marker id={`ah${uid}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 1 L8 5 L0 9 z" className="g-mg-axis-head" />
        </marker>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={L} x2={W - R} y1={y(yMax * f)} y2={y(yMax * f)} className="g-mg-grid" />
      ))}
      {g.t.slice(1, -1).map((tt) => (
        <line key={tt} x1={x(tt)} x2={x(tt)} y1={T} y2={H - B} className="g-mg-grid" />
      ))}
      <line x1={L} y1={H - B} x2={L} y2={T - 4} className="g-mg-axis" markerEnd={`url(#ah${uid})`} />
      <line x1={L} y1={H - B} x2={W - R + 6} y2={H - B} className="g-mg-axis" markerEnd={`url(#ah${uid})`} />
      <text x={L - 7} y={T + 6} textAnchor="end" className="g-mg-axlbl">
        {g.type === 'st' ? 's' : 'v'}
      </text>
      <text x={W - R + 4} y={H - 3} textAnchor="end" className="g-mg-axlbl">
        t
      </text>
      <motion.path d={d} className="g-mg-line" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
      {g.t.map((tt, k) => (
        <circle key={k} cx={x(tt)} cy={y(g.y[k])} r="2.2" className="g-mg-dot" />
      ))}
      <text x={W - R} y={T + 4} textAnchor="end" className="g-mg-typelbl">
        {typeName(g.type)}
      </text>
    </svg>
  )
}

/** Level-8 v–t graph with numbers; after the answer it shows the slope triangle or the shaded area. */
function VtChart({ task, reveal }: { task: NumTask; reveal: boolean }) {
  const g = task.graph
  const W = 340
  const H = 250
  const L = 40
  const B = 40
  const T = 34
  const R = 16
  const tMax = g.t[g.t.length - 1]
  const vTop = Math.max(...g.y)
  const vStep = vTop > 12 ? 4 : 2
  const vMax = Math.ceil((vTop + 1) / vStep) * vStep
  const x = (tt: number) => L + (tt / tMax) * (W - L - R)
  const y = (v: number) => H - B - (v / vMax) * (H - B - T)
  const d = g.t.map((tt, k) => `${k ? 'L' : 'M'}${x(tt).toFixed(1)} ${y(g.y[k]).toFixed(1)}`).join(' ')
  const uid = useId().replace(/:/g, '')
  const n = pieces(g)
  const asked = task.kind === 'slope' || task.kind === 'area' ? [task.seg] : Array.from({ length: n }, (_, k) => k)
  const label = `Graf v–t: ${g.t.map((tt, k) => `v čase ${tt} s rychlost ${g.y[k]} m/s`).join(', ')}. Úseky ${Array.from({ length: n }, (_, k) => SEG_NAME[k]).join(', ')}.`
  const k = task.seg
  const showArea = reveal && task.kind !== 'slope'
  const showTri = reveal && task.kind === 'slope' && slope(g, k) !== 0
  return (
    <svg className="g-mg-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <marker id={`ch${uid}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 1 L8 5 L0 9 z" className="g-mg-axis-head" />
        </marker>
        <pattern id={`hp${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="g-mg-hatch" />
        </pattern>
      </defs>
      {Array.from({ length: tMax + 1 }, (_, tt) => (
        <line key={`t${tt}`} x1={x(tt)} x2={x(tt)} y1={T} y2={H - B} className="g-mg-grid" />
      ))}
      {Array.from({ length: vMax / vStep + 1 }, (_, j) => (
        <g key={`v${j}`}>
          <line x1={L} x2={W - R} y1={y(j * vStep)} y2={y(j * vStep)} className="g-mg-grid" />
          <text x={L - 7} y={y(j * vStep) + 4.5} textAnchor="end" className="g-mg-num">
            {j * vStep}
          </text>
        </g>
      ))}
      {Array.from({ length: tMax + 1 }, (_, tt) =>
        tt % (tMax > 10 ? 2 : 1) === 0 ? (
          <text key={`tl${tt}`} x={x(tt)} y={H - B + 17} textAnchor="middle" className="g-mg-num">
            {tt}
          </text>
        ) : null,
      )}
      {asked.length < n &&
        asked.map((s) => <rect key={`hl${s}`} x={x(g.t[s])} y={T} width={x(g.t[s + 1]) - x(g.t[s])} height={H - B - T} className="g-mg-band" />)}
      {showArea &&
        asked.map((s) => (
          <motion.path
            key={`ar${s}`}
            d={`M${x(g.t[s])} ${y(0)} L${x(g.t[s])} ${y(g.y[s])} L${x(g.t[s + 1])} ${y(g.y[s + 1])} L${x(g.t[s + 1])} ${y(0)} Z`}
            fill={`url(#hp${uid})`}
            className="g-mg-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      {showArea &&
        asked.map((s) =>
          areaOf(g, s) > 0 ? (
            <motion.text
              key={`al${s}`}
              x={(x(g.t[s]) + x(g.t[s + 1])) / 2}
              y={y((g.y[s] + g.y[s + 1]) / 4) + 5}
              textAnchor="middle"
              className="g-mg-arealbl"
              variants={popIn}
              initial="hidden"
              animate="show"
            >
              {cz(areaOf(g, s))} m
            </motion.text>
          ) : null,
        )}
      <line x1={L} y1={H - B} x2={L} y2={T - 8} className="g-mg-axis" markerEnd={`url(#ch${uid})`} />
      <line x1={L} y1={H - B} x2={W - R + 8} y2={H - B} className="g-mg-axis" markerEnd={`url(#ch${uid})`} />
      <text x={L + 10} y={T - 16} className="g-mg-axlbl">
        v (m/s)
      </text>
      <text x={W - R} y={H - 6} textAnchor="end" className="g-mg-axlbl">
        t (s)
      </text>
      <motion.path d={d} className="g-mg-line" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      {asked.length < n && (
        <path d={`M${x(g.t[k])} ${y(g.y[k])} L${x(g.t[k + 1])} ${y(g.y[k + 1])}`} className="g-mg-line g-mg-line-hl" />
      )}
      {g.t.map((tt, j) => (
        <circle key={j} cx={x(tt)} cy={y(g.y[j])} r="3" className="g-mg-dot" />
      ))}
      {Array.from({ length: n }, (_, s) => {
        const cx = (x(g.t[s]) + x(g.t[s + 1])) / 2
        const cy = Math.max(T - 4, Math.min(y(g.y[s]), y(g.y[s + 1])) - 22)
        return (
          <g key={`sl${s}`} className={`g-mg-seg${asked.includes(s) && asked.length < n ? ' on' : ''}`}>
            <circle cx={cx} cy={cy} r="10" className="g-mg-segdot" />
            <text x={cx} y={cy + 4.5} textAnchor="middle" className="g-mg-seglbl">
              {SEG_NAME[s]}
            </text>
          </g>
        )
      })}
      {showTri && (
        <motion.g variants={popIn} initial="hidden" animate="show">
          <path
            d={`M${x(g.t[k])} ${y(g.y[k])} L${x(g.t[k + 1])} ${y(g.y[k])} L${x(g.t[k + 1])} ${y(g.y[k + 1])}`}
            className="g-mg-tri"
          />
          <text
            x={(x(g.t[k]) + x(g.t[k + 1])) / 2}
            y={y(g.y[k]) + (g.y[k + 1] > g.y[k] && g.y[k] > 0 ? 17 : -7)}
            textAnchor="middle"
            className="g-mg-trilbl"
          >
            Δt = {g.t[k + 1] - g.t[k]} s
          </text>
          <text
            x={x(g.t[k + 1]) + (k === n - 1 ? -6 : 6)}
            y={(y(g.y[k]) + y(g.y[k + 1])) / 2 + 4}
            textAnchor={k === n - 1 ? 'end' : 'start'}
            className="g-mg-trilbl"
          >
            Δv = {cz(g.y[k + 1] - g.y[k])} m/s
          </text>
        </motion.g>
      )}
    </svg>
  )
}
