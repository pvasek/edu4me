import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { fadeUp } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import {
  ANGLE_MAX,
  ANGLE_MIN,
  BONUS,
  MAX_SHOTS,
  ORBIT_TOL,
  PER_TASK,
  SHOT_POINTS,
  V_MAX,
  V_MIN,
  V_STEP,
  checkOrbit,
  cz,
  explainOrbit,
  explainThrow,
  makeRound,
  missText,
  orbitFate,
  playedLevel,
  shoot,
  throwPoints,
  type Launch,
  type OrbitTask,
  type Shot,
  type Task,
  type ThrowTask,
} from './logic'
import { OrbitScene, ThrowScene } from './Scene'
import './projectile.css'

type Status = 'aim' | 'flying' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const START: Launch = { angle: 45, v: 10 }
const FATE_TEXT = {
  fall: 'S tvou rychlostí by projektil spadl zpátky na povrch.',
  ellipse: 'S tvou rychlostí by obíhal po protáhlé elipse.',
  escape: 'S tvou rychlostí by uletěl pryč (překročil by 2. kosmickou rychlost).',
  circle: '',
}

export default function Projectile({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState<Task[]>(() => makeRound(level))
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const finish = useFinishOnce(onFinish)
  const t = tasks[i]
  const last = i + 1 >= tasks.length

  const next = () => {
    if (last) finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
    else setI(i + 1)
  }
  const add = (p: number) => {
    scoreRef.current += p
    setScore(scoreRef.current)
  }

  return (
    <div className="g-sh-root g-pr">
      <p className="g-sh-instr">
        {t.kind === 'throw'
          ? 'Nastav úhel a rychlost a vystřel. Čím méně výstřelů, tím víc bodů.'
          : 'Spočítej první kosmickou rychlost těsně nad povrchem.'}{' '}
        Odpor vzduchu zanedbáváme.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Cíl" level={level ?? 'mix'} />
      {t.kind === 'throw' ? (
        <ThrowRound key={i} task={t} last={last} onPoints={add} onNext={next} mixed={level === undefined} />
      ) : (
        <OrbitRound key={i} task={t} last={last} onPoints={add} onNext={next} />
      )}
    </div>
  )
}

// ------------------------------------------------------------------ throw

function ThrowRound({
  task,
  last,
  mixed,
  onPoints,
  onNext,
}: {
  task: ThrowTask
  last: boolean
  mixed: boolean
  onPoints: (p: number) => void
  onNext: () => void
}) {
  const [aim, setAim] = useState<Launch>(() => ({ angle: task.fixedAngle ?? START.angle, v: START.v }))
  const [shots, setShots] = useState<Shot[]>([])
  const [status, setStatus] = useState<Status>('aim')
  const [progress, setProgress] = useState(1)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [pts, setPts] = useState(0)
  const [start] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const reduce = useReducedMotion()
  const [cardRef, jolt] = useJolt()
  const fireRef = useRef<HTMLButtonElement>(null)
  const now = useNow(status === 'aim' || status === 'flying', 500)
  const secs = status === 'won' || status === 'lost' ? frozen : Math.max(0, (now - start) / 1000)
  const flying = status === 'flying' || shots.length ? shots[shots.length - 1] ?? null : null

  const say = (kind: Msg['kind'], text: string) => {
    setMsg({ kind, text })
    setMsgN((n) => n + 1)
  }

  const land = (shot: Shot, n: number) => {
    if (shot.outcome === 'hit') {
      const el = (Date.now() - start) / 1000
      const p = throwPoints(true, n, timeBonus(el, BONUS, 20, 60))
      setPts(p)
      onPoints(p)
      setFrozen(el)
      setStatus('won')
      say('good', `Zásah ${n === 1 ? 'hned první ranou' : `na ${n}. pokus`}! ${explainThrow(task, shot.launch)}`)
      jolt.pop()
      return
    }
    jolt.shake()
    if (n >= MAX_SHOTS) {
      setFrozen((Date.now() - start) / 1000)
      setStatus('lost')
      const s = task.solution
      say('warn', `Došly výstřely. Šlo to třeba s ${task.fixedAngle === undefined ? `α = ${cz(s.angle, 0)}° a ` : ''}v₀ = ${cz(s.v)} m/s: ${explainThrow(task, s)}`)
      return
    }
    setStatus('aim')
    say('bad', missText(task, shot))
    window.setTimeout(() => fireRef.current?.focus(), 0)
  }

  const fire = () => {
    if (status !== 'aim') return
    const shot = shoot(task, aim)
    const n = shots.length + 1
    setShots((s) => [...s, shot])
    setMsg(null)
    if (reduce) {
      setProgress(1)
      land(shot, n)
      return
    }
    setStatus('flying')
    setProgress(0)
    const dur = Math.min(2200, Math.max(800, shot.time * 450))
    const t0 = performance.now()
    const tick = (tm: number) => {
      const p = Math.min(1, (tm - t0) / dur)
      setProgress(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else land(shot, n)
    }
    raf.current = requestAnimationFrame(tick)
  }
  const raf = useRef(0)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const setAngle = (a: number) => setAim((x) => ({ ...x, angle: Math.min(ANGLE_MAX, Math.max(ANGLE_MIN, Math.round(a))) }))
  const setV = (v: number) => setAim((x) => ({ ...x, v: Math.min(V_MAX, Math.max(V_MIN, Math.round(v / V_STEP) * V_STEP)) }))
  const enterFires = (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fire()
    }
  }

  const used = shots.length
  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : status === 'flying' ? 'wow' : used ? 'think' : 'happy'
  const solution = status === 'lost' ? shoot(task, task.solution) : null
  const kindName = task.throwKind === 'horizontal' ? 'Vodorovný vrh' : task.throwKind === 'ground' ? 'Šikmý vrh' : 'Šikmý vrh na plošinu'

  return (
    <>
      <div ref={cardRef} className="card g-pr-card">
        <div className="g-pr-top">
          <div className="g-pr-title">
            <span className="eyebrow">
              {kindName}
              {mixed && <> · úroveň {task.level}</>}
            </span>
            <span className="g-pr-g">
              {task.body.name}: g = {cz(task.body.g, 2)} m/s²
            </span>
          </div>
          <div className="g-pr-shots" aria-label={`Výstřel ${Math.min(used + (status === 'aim' ? 1 : 0), MAX_SHOTS)} z ${MAX_SHOTS}`}>
            {Array.from({ length: MAX_SHOTS }, (_, k) => (
              <span key={k} className={`g-pr-shotdot${k < used ? (shots[k].outcome === 'hit' ? ' hit' : ' used') : ''}`} title={`${SHOT_POINTS[k]} b.`} />
            ))}
          </div>
          <Mascot mood={mood} size={44} />
          {status === 'won' && <PointsPop points={pts} />}
        </div>
        <ThrowScene task={task} aim={aim} shots={shots} flying={flying} progress={progress} solution={solution} hit={status === 'won'} />
        <p className="g-pr-goal">
          {task.throwKind === 'horizontal'
            ? `Z věže vysoké ${cz(task.h0)} m vystřel vodorovně tak, aby projektil dopadl ${cz(task.target.x)} m daleko (± ${cz(task.target.w)} m).`
            : task.throwKind === 'ground'
              ? `Zasáhni cíl na zemi ${cz(task.target.x)} m daleko (± ${cz(task.target.w)} m).`
              : `Dopadni na plošinu vysokou ${cz(task.target.y)} m, její střed je ${cz(task.target.x)} m daleko (± ${cz(task.target.w)} m).`}
          {task.body.id === 'jupiter' && ' Jupiter nemá pevný povrch – plošina se vznáší v jeho atmosféře.'}
        </p>
      </div>

      {(status === 'aim' || status === 'flying') && (
        <div className="g-pr-ctrl">
          {task.fixedAngle === undefined ? (
            <Dial
              id="angle"
              label="Úhel α"
              value={aim.angle}
              text={`${cz(aim.angle, 0)}°`}
              min={ANGLE_MIN}
              max={ANGLE_MAX}
              step={1}
              onChange={setAngle}
              onKeyDown={enterFires}
              disabled={status !== 'aim'}
            />
          ) : (
            <div className="g-pr-fixed">
              <span className="g-pr-dial-lbl">Úhel α</span>
              <b>0° – vodorovně</b>
            </div>
          )}
          <Dial
            id="speed"
            label="Rychlost v₀"
            value={aim.v}
            text={`${cz(aim.v)} m/s`}
            min={V_MIN}
            max={V_MAX}
            step={V_STEP}
            onChange={setV}
            onKeyDown={enterFires}
            disabled={status !== 'aim'}
          />
          <button ref={fireRef} type="button" className="btn btn-primary btn-lg btn-block g-pr-fire" onClick={fire} disabled={status !== 'aim'}>
            <Icon name="target" /> Vystřelit
            <span className="g-pr-fire-sub">
              {used + 1}. výstřel · za zásah {SHOT_POINTS[Math.min(used, MAX_SHOTS - 1)]} b.
            </span>
          </button>
        </div>
      )}

      <div className="g-pr-status" aria-live="polite">
        <AnimatePresence mode="wait">
          {msg && (
            <Feedback kind={msg.kind} key={msgN}>
              {msg.text}
            </Feedback>
          )}
        </AnimatePresence>
      </div>

      {(status === 'won' || status === 'lost') && (
        <motion.div className="g-pr-next" variants={fadeUp} initial="hidden" animate="show">
          <span className="muted g-pr-time">Čas {Math.round(secs)} s</span>
          <button type="button" className="btn btn-primary btn-lg" onClick={onNext} autoFocus>
            {last ? 'Dokončit' : 'Další cíl'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </>
  )
}

/** Slider with − / + steppers (big touch targets), keyboard: arrows on the slider, Enter fires. */
function Dial({
  id,
  label,
  value,
  text,
  min,
  max,
  step,
  onChange,
  onKeyDown,
  disabled,
}: {
  id: string
  label: string
  value: number
  text: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  onKeyDown: (e: ReactKeyboardEvent) => void
  disabled: boolean
}) {
  const inputId = `g-pr-${id}`
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="g-pr-dial">
      <div className="g-pr-dial-head">
        <label htmlFor={inputId} className="g-pr-dial-lbl">
          {label}
        </label>
        <output htmlFor={inputId} className="g-pr-dial-val">
          {text}
        </output>
      </div>
      <div className="g-pr-dial-row">
        <button type="button" className="g-pr-step" onClick={() => onChange(value - step)} disabled={disabled || value <= min} aria-label={`${label}: ubrat`}>
          −
        </button>
        <input
          id={inputId}
          type="range"
          className="g-pr-range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-valuetext={text}
          style={{ ['--pct' as string]: `${pct}%` }}
        />
        <button type="button" className="g-pr-step" onClick={() => onChange(value + step)} disabled={disabled || value >= max} aria-label={`${label}: přidat`}>
          +
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ orbit

function OrbitRound({ task, last, onPoints, onNext }: { task: OrbitTask; last: boolean; onPoints: (p: number) => void; onNext: () => void }) {
  const [text, setText] = useState('')
  const [tries, setTries] = useState(0)
  const [status, setStatus] = useState<'play' | 'won' | 'lost'>('play')
  const [tried, setTried] = useState<number | null>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [pts, setPts] = useState(0)
  const [start] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const [cardRef, jolt] = useJolt()
  const b = task.body

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (status !== 'play') return
    const r = checkOrbit(text, b)
    if (r.kind === 'invalid') {
      say('info', 'Napiš kladné číslo v km/s, třeba 7,9. Čárka i tečka platí.')
      return
    }
    setTried(r.v)
    if (r.kind === 'ok') {
      const el = (Date.now() - start) / 1000
      const p = tries === 0 ? SHOT_POINTS[0] + timeBonus(el, BONUS, 40, 120) : SHOT_POINTS[1]
      setPts(p)
      onPoints(p)
      setStatus('won')
      say('good', `Správně! ${explainOrbit(b)}`)
      jolt.pop()
      return
    }
    jolt.shake()
    const ratio = r.v / task.answer
    const units = ratio > 25 || ratio < 0.04 ? ' Hlídej jednotky: R dosaď v metrech a výsledek převeď na km/s.' : ''
    if (tries === 0) {
      setTries(1)
      say('bad', `${cz(r.v / 1000, 2)} km/s to není. ${FATE_TEXT[orbitFate(b, r.v)]}${units} Zkus to znovu.`)
      inputRef.current?.select()
      return
    }
    setStatus('lost')
    say('warn', `${FATE_TEXT[orbitFate(b, r.v)]} ${explainOrbit(b)}`)
  }

  const giveUp = () => {
    if (status !== 'play') return
    setStatus('lost')
    say('info', explainOrbit(b))
  }

  return (
    <>
      <div ref={cardRef} className="card g-pr-card">
        <div className="g-pr-top">
          <div className="g-pr-title">
            <span className="eyebrow">Oběžná rychlost · {b.name}</span>
            <span className="g-pr-g">
              g = {cz(b.g, 2)} m/s², R = {cz(b.R / 1000, 0)} km
            </span>
          </div>
          <Mascot mood={status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'} size={44} />
          {status === 'won' && <PointsPop points={pts} />}
        </div>
        <OrbitScene task={task} tried={tried} reveal={status !== 'play'} />
        <p className="g-pr-goal">
          Jak rychle musí těleso letět vodorovně těsně nad povrchem {b.of}, aby nespadlo a obíhalo po kružnici? Gravitační síla je tu dostředivá: g = v² / R.
        </p>
      </div>

      {status === 'play' && (
        <form className="g-pr-orbitform" onSubmit={submit}>
          <div className="g-pr-field">
            <label className="sr-only" htmlFor="g-pr-v1">
              Oběžná rychlost v km/s
            </label>
            <input
              id="g-pr-v1"
              ref={inputRef}
              className="g-sh-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoFocus
              placeholder="např. 7,9"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <span className="g-pr-field-unit">km/s</span>
          </div>
          <div className="g-sh-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
          <p className="muted g-pr-note">Tolerance ±{cz(ORBIT_TOL * 100, 0)} %. Poloměr dosaď v metrech.</p>
        </form>
      )}

      <div className="g-pr-status" aria-live="polite">
        <AnimatePresence mode="wait">
          {msg && (
            <Feedback kind={msg.kind} key={msgN}>
              {msg.text}
            </Feedback>
          )}
        </AnimatePresence>
      </div>

      {status !== 'play' && (
        <motion.div className="g-pr-next" variants={fadeUp} initial="hidden" animate="show">
          <button type="button" className="btn btn-primary btn-lg" onClick={onNext} autoFocus>
            {last ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </>
  )
}
