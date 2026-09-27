import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type MouseEvent as RMouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BY_Z } from '../../courses/chemie/data/elements'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Bump, Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt } from '../shared/hooks'
import { pickLevel } from '../shared/util'
import { levelNum, type GameProps } from '../types'
import { BohrAtom } from './BohrAtom'
import { LEVELS } from './levels'
import { MAX_E, MAX_N, MAX_P, chargeText, checkAtom, makeLevelTasks, nobleText, taskPoints, type AtomTask } from './logic'
import './build-atom.css'

type Particle = 'p' | 'n' | 'e'
const MAX: Record<Particle, number> = { p: MAX_P, n: MAX_N, e: MAX_E }
const NAMES: Record<Particle, { one: string; label: string }> = {
  p: { one: 'proton', label: 'Protony' },
  n: { one: 'neutron', label: 'Neutrony' },
  e: { one: 'elektron', label: 'Elektrony' },
}

/** Nuclide notation with A over Z on the left and the charge top right. */
function Nuclide({ a, z, symbol, charge }: { a?: number; z?: number; symbol: string; charge?: number | '?' }) {
  return (
    <span className="g-ba-nuc">
      {(a !== undefined || z !== undefined) && (
        <span className="g-ba-nuc-idx">
          <span>{a ?? ''}</span>
          <span>{z ?? ''}</span>
        </span>
      )}
      <span className="g-ba-nuc-sym">{symbol}</span>
      {charge === '?' ? (
        <span className="g-ba-nuc-q g-ba-nuc-ask" aria-label="náboj zjisti sám">
          ?
        </span>
      ) : charge ? (
        <span className="g-ba-nuc-q">{chargeText(charge)}</span>
      ) : null}
    </span>
  )
}

function TaskTitle({ t }: { t: AtomTask }) {
  if (t.partner) {
    return (
      <>
        <span className="eyebrow">Postav ion</span>
        <span className="g-ba-taskname">
          <Nuclide a={t.a} symbol={t.symbol} charge="?" />
        </span>
        <span className="g-ba-tasktext">
          <Md text={`Ion, který vzniká ${t.partner.from} ve sloučenině ${t.partner.with} ($${t.partner.formula}$).`} />
        </span>
      </>
    )
  }
  if (t.kind === 'isotope') {
    return (
      <>
        <span className="eyebrow">Postav izotop</span>
        <span className="g-ba-taskname">{t.label}</span>
      </>
    )
  }
  return (
    <>
      <span className="eyebrow">{t.kind === 'ion' ? 'Postav ion' : 'Postav atom'}</span>
      <span className="g-ba-taskname">
        <Nuclide a={t.a} z={t.kind === 'atom' ? t.z : undefined} symbol={t.symbol} charge={t.charge} />
      </span>
    </>
  )
}

function successText(t: AtomTask, attempt: number): string {
  const who = t.label ? `Izotop ${t.label}` : t.kind === 'ion' ? `Ion $${t.symbol}^{${chargeText(t.charge)}}$` : BY_Z[t.z].name
  const noble = nobleText(t)
  const same = noble ? ` Má ${t.e} ${t.e <= 4 ? 'elektrony' : 'elektronů'} jako ${noble}, tedy konfiguraci vzácného plynu.` : ''
  return `Přesně tak! ${who} = ${t.z} p, ${t.n} n, ${t.e} e.${same}${attempt === 1 ? ' Napoprvé!' : ''}`
}

/** A −/+ button that repeats while held (pointer) and steps once per keyboard click. */
function StepButton({ onStep, disabled, label, sign }: { onStep: () => void; disabled: boolean; label: string; sign: '+' | '−' }) {
  const timer = useRef<number | null>(null)
  const step = useRef(onStep)
  step.current = onStep
  const stop = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])
  useEffect(() => {
    if (disabled) stop()
  }, [disabled])
  const start = (ev: RPointerEvent) => {
    if (disabled || ev.button !== 0) return
    step.current()
    const loop = (delay: number) => {
      timer.current = window.setTimeout(() => {
        step.current()
        loop(85)
      }, delay)
    }
    loop(420)
  }
  return (
    <button
      type="button"
      className={`g-ba-step g-ba-step-${sign === '+' ? 'plus' : 'minus'}`}
      aria-label={label}
      disabled={disabled}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e: RMouseEvent) => {
        // keyboard activation (detail 0); pointer presses were handled on pointerdown
        if (e.detail === 0) onStep()
      }}
    >
      {sign}
    </button>
  )
}

export default function BuildAtom({ levelId, onFinish }: GameProps) {
  const level = pickLevel(LEVELS, levelNum(levelId))
  const [tasks] = useState(() => makeLevelTasks(level))
  const [i, setI] = useState(0)
  const [cnt, setCnt] = useState<Record<Particle, number>>({ p: 0, n: 0, e: 0 })
  const [attempt, setAttempt] = useState(1)
  const [status, setStatus] = useState<'play' | 'won' | 'lost'>('play')
  const [problems, setProblems] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const scoreRef = useRef(0)
  const collected = useRef<string[]>([])
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()

  const t = tasks[i]
  const el = cnt.p > 0 ? BY_Z[cnt.p] : undefined
  const a = cnt.p + cnt.n
  const q = cnt.p - cnt.e

  const change = (k: Particle, d: number) => {
    if (status !== 'play') return
    setCnt((c) => ({ ...c, [k]: Math.max(0, Math.min(MAX[k], c[k] + d)) }))
    if (problems.length) setProblems([])
  }

  const check = () => {
    const r = checkAtom(t, cnt.p, cnt.n, cnt.e)
    if (r.ok) {
      const p = taskPoints(attempt)
      scoreRef.current += p
      setScore(scoreRef.current)
      setPts(p)
      collected.current.push(t.symbol)
      setStatus('won')
      setProblems([])
      jolt.pop()
      return
    }
    setProblems(r.problems)
    jolt.shake()
    if (attempt >= 3) setStatus('lost')
    else setAttempt(attempt + 1)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * 100, collected: [...collected.current] })
      return
    }
    setI(i + 1)
    setCnt({ p: 0, n: 0, e: 0 })
    setAttempt(1)
    setStatus('play')
    setProblems([])
    setPts(0)
  }

  const showSolution = () => setCnt({ p: t.z, n: t.n, e: t.e })

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : problems.length ? 'think' : 'happy'
  const chargeWord = q === 0 ? 'neutrální atom' : q > 0 ? 'kation' : 'anion'
  const atomLabel = `Model atomu: ${cnt.p} protonů, ${cnt.n} neutronů, ${cnt.e} elektronů`

  return (
    <div className="g-sh-root g-ba">
      <p className="g-sh-instr">Přidávej protony, neutrony a elektrony, až postavíš zadanou částici. Pak ji zkontroluj.</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-sh-prompt g-ba-task">
        <Mascot mood={mood} size={60} />
        <div className="g-sh-prompt-body" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={i}
              className="g-ba-title"
              variants={popIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            >
              <TaskTitle t={t} />
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="chip chip-soft g-ba-try">Pokus {Math.min(attempt, 3)}/3</span>
        {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
      </div>

      <div className="g-ba-main">
        <div className="card-flat g-ba-stage">
          <BohrAtom p={cnt.p} n={cnt.n} e={cnt.e} label={atomLabel} />
          <ul className="g-ba-legend" aria-hidden="true">
            <li>
              <span className="g-ba-dot g-ba-dot-p" /> proton
            </li>
            <li>
              <span className="g-ba-dot g-ba-dot-n" /> neutron
            </li>
            <li>
              <span className="g-ba-dot g-ba-dot-e" /> elektron
            </li>
          </ul>
        </div>

        <div className="g-ba-side">
          <div className="g-ba-read" aria-live="polite">
            <div className="g-ba-read-nuc">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={el ? el.symbol : '?'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
                  transition={spring.bouncy}
                >
                  {el ? <Nuclide a={a} z={cnt.p} symbol={el.symbol} charge={q} /> : <span className="g-ba-nuc-empty">?</span>}
                </motion.span>
              </AnimatePresence>
            </div>
            <dl className="g-ba-facts">
              <div>
                <dt>Prvek</dt>
                <dd>{el ? el.name : 'žádný (bez protonů)'}</dd>
              </div>
              <div>
                <dt>Nukleonové číslo A</dt>
                <dd className="mono">{a}</dd>
              </div>
              <div>
                <dt>Náboj</dt>
                <dd>
                  <span className="mono">{q === 0 ? '0' : chargeText(q)}</span> · {chargeWord}
                </dd>
              </div>
            </dl>
          </div>

          <div className="g-ba-ctrls">
            {(['p', 'n', 'e'] as Particle[]).map((k) => (
              <div key={k} className={`g-ba-ctrl g-ba-ctrl-${k}`}>
                <span className={`g-ba-dot g-ba-dot-${k}`} aria-hidden="true" />
                <span className="g-ba-ctrl-label" id={`g-ba-l-${k}`}>
                  {NAMES[k].label}
                </span>
                <StepButton
                  sign="−"
                  label={`Odebrat ${NAMES[k].one}`}
                  disabled={status !== 'play' || cnt[k] === 0}
                  onStep={() => change(k, -1)}
                />
                <output className="g-ba-count" aria-labelledby={`g-ba-l-${k}`}>
                  <Bump value={cnt[k]} />
                </output>
                <StepButton
                  sign="+"
                  label={`Přidat ${NAMES[k].one}`}
                  disabled={status !== 'play' || cnt[k] >= MAX[k]}
                  onStep={() => change(k, 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="g-ba-bottom" aria-live="polite">
        {status === 'won' && (
          <Feedback kind="good">
            <Md text={successText(t, attempt)} />
          </Feedback>
        )}
        {problems.length > 0 && (
          <Feedback kind={status === 'lost' ? 'warn' : 'bad'} key={`f${i}-${attempt}-${status}`}>
            <ul className="g-ba-problems">
              {problems.map((p, k) => (
                <li key={k}>
                  <Md text={p} />
                </li>
              ))}
            </ul>
            {status === 'lost' && <p className="g-ba-sol">Tři pokusy jsou pryč – podívej se na správné řešení.</p>}
          </Feedback>
        )}
        <div className="g-sh-actions">
          {status === 'play' && (
            <>
              <button type="button" className="btn btn-primary btn-lg" onClick={check}>
                <Icon name="check" /> Zkontrolovat
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setCnt({ p: 0, n: 0, e: 0 })}>
                <Icon name="refresh" /> Vynulovat
              </button>
            </>
          )}
          {status === 'lost' && (
            <button type="button" className="btn" onClick={showSolution}>
              <Icon name="bulb" /> Ukázat řešení
            </button>
          )}
          {status !== 'play' && (
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
