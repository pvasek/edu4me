import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, shake, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { PREFIX, QUANTITY_NAME, UNITS } from './levels'
import { explain, fmt, fmtAuto, isRight, ladderSteps, makeRound, parseNumber, parseSci, playedLevel, superscript, type Task } from './logic'
import './unit-convert.css'

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
  dim: { opacity: 0.45, y: 0, scale: 0.98, transition: { duration: 0.2 } },
}

export default function UnitConvert({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState<Task[]>(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [exp, setExp] = useState('')
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
  const sci = t.level >= 8
  const choice = t.mode === 'choice'
  const full = choice ? 6 : 12
  const zero = choice ? 20 : 40
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS, full, zero) : 0
  const last = i + 1 >= tasks.length
  const why = explain(t)

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }

  const win = () => {
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

  const lose = (lead: string) => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say(lead ? 'bad' : 'info', `${lead}${why}`)
    jolt.shake()
  }

  const pick = (x: number) => {
    if (status !== 'play') return
    setPicked(x)
    if (x === t.answer) win()
    else lose(`${fmtAuto(x, sci)} ${t.to} to není. `)
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play') return
    const v = t.mode === 'sci' ? parseSci(text, exp) : parseNumber(text)
    if (v === null) {
      say('info', t.mode === 'sci' ? 'Napiš číslo (třeba 4,5) a exponent (třeba −7). Čárka i tečka platí.' : 'Napiš číslo, třeba 2,5. Desetinná čárka i tečka platí.')
      return
    }
    if (isRight(v, t.answer)) {
      win()
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say('bad', `${fmtAuto(v, sci)} ${t.to} to není. ${hint(t, v)} Zkus to ještě jednou.`)
      inputRef.current?.select()
      return
    }
    lose(`Ani ${fmtAuto(v, sci)} ${t.to} to není. `)
  }

  const giveUp = () => {
    if (status !== 'play') return
    lose('')
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
    setExp('')
    setMsg(null)
    setPts(0)
    setStart(Date.now())
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Keys 1–4 pick an option.
  useEffect(() => {
    if (!choice || status !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const n = Number(e.key)
      if (t.options && n >= 1 && n <= t.options.length) {
        e.preventDefault()
        pick(t.options[n - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'
  const steps = ladderSteps(t.from, t.to)

  return (
    <div className="g-sh-root g-uc">
      <p className="g-sh-instr">
        Převeď na jinou jednotku. {choice ? 'Vyber správnou možnost (klávesy 1–4).' : 'Napiš číslo; platí čárka i tečka, tolerance ±0,5 %.'} Čím rychleji, tím větší bonus.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Převod" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-uc-card">
        <div className="g-uc-top">
          <span className="eyebrow">
            {QUANTITY_NAME[UNITS[t.from].q]}
            {level === undefined && <> · úroveň {t.level}</>}
          </span>
          <Mascot mood={mood} size={52} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={i}
            className="g-uc-q"
            variants={popIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
            aria-label={`${fmtAuto(t.value, sci)} ${t.from} je kolik ${t.to}?`}
          >
            <span className="g-uc-val">{fmtAuto(t.value, sci)}</span>
            <span className="g-uc-unit">{t.from}</span>
            <span className="g-uc-eq">=</span>
            <span className={`g-uc-ans${status !== 'play' ? ' done' : ''}`}>{status === 'play' ? '?' : fmtAuto(t.answer, sci)}</span>
            <span className="g-uc-unit g-uc-unit-to">{t.to}</span>
          </motion.p>
        </AnimatePresence>
        {steps && <Ladder key={i} {...steps} reveal={status !== 'play'} wide={sci} />}
        {status === 'play' && (
          <div className="g-uc-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-uc-bonusbar">
              <span style={{ width: `${(bonus / BONUS) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {choice ? (
        <div className="g-uc-opts" role="group" aria-label="Možnosti">
          {t.options!.map((o, k) => {
            const right = o === t.answer
            const state = status === 'play' ? 'show' : right ? 'correct' : picked === o ? 'wrong' : 'dim'
            return (
              <motion.button
                key={`${i}-${o}`}
                type="button"
                className={`g-uc-opt is-${state}`}
                onClick={() => pick(o)}
                disabled={status !== 'play'}
                aria-keyshortcuts={String(k + 1)}
                custom={k}
                variants={optVariants}
                initial="hidden"
                animate={state}
                whileTap={status === 'play' ? { y: 3 } : undefined}
              >
                <span className="g-uc-key" aria-hidden="true">
                  {k + 1}
                </span>
                <span className="g-uc-opt-num">{fmtAuto(o, sci)}</span>
                <span className="g-uc-opt-unit">{t.to}</span>
                {status !== 'play' && (right || picked === o) && (
                  <motion.span className="g-uc-opt-icon" variants={popIn} initial="hidden" animate="show">
                    <Icon name={right ? 'check' : 'x'} />
                    <span className="sr-only">{right ? 'správně' : 'tvoje volba, špatně'}</span>
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      ) : (
        status === 'play' && (
          <form className="g-uc-form" onSubmit={submit}>
            {t.mode === 'sci' ? (
              <div className="g-uc-sci">
                <label className="sr-only" htmlFor="g-uc-m">
                  Číslo před mocninou deseti
                </label>
                <input
                  id="g-uc-m"
                  ref={inputRef}
                  className="g-sh-input g-uc-in-m"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  autoFocus
                  placeholder="4,5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-uc-times" aria-hidden="true">
                  · 10
                </span>
                <span className="g-uc-expwrap">
                  <label className="sr-only" htmlFor="g-uc-e">
                    Exponent (prázdný = 0)
                  </label>
                  <input
                    id="g-uc-e"
                    className="g-sh-input g-uc-in-e"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    value={exp}
                    onChange={(e) => setExp(e.target.value.replace(/[^0-9\-−]/g, '').slice(0, 4))}
                  />
                  <button
                    type="button"
                    className="g-uc-pm"
                    aria-label="Změnit znaménko exponentu"
                    onClick={() => setExp((x) => (/^[-−]/.test(x) ? x.slice(1) : '−' + x))}
                  >
                    ±
                  </button>
                </span>
                <span className="g-uc-sci-unit">{t.to}</span>
              </div>
            ) : (
              <div className="g-uc-field">
                <label className="sr-only" htmlFor="g-uc-in">
                  Výsledek v {t.to}
                </label>
                <input
                  id="g-uc-in"
                  ref={inputRef}
                  className="g-sh-input g-uc-in"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  autoFocus
                  placeholder="např. 2,5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-uc-in-unit">{t.to}</span>
              </div>
            )}
            <div className="g-sh-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
                <Icon name="check" /> Zkontrolovat
              </button>
              <button type="button" className="btn btn-ghost" onClick={giveUp}>
                Nevím
              </button>
            </div>
            {t.mode === 'sci' && <p className="muted g-uc-note">Zapiš jako a · 10ⁿ, např. 4,5 · 10⁻⁷. Prázdný exponent znamená 10⁰.</p>}
          </form>
        )
      )}

      <div className="g-uc-status" aria-live="polite">
        <AnimatePresence mode="wait">
          {msg && (
            <Feedback kind={msg.kind} key={msgN}>
              {msg.text}
            </Feedback>
          )}
        </AnimatePresence>
      </div>

      {status !== 'play' && (
        <motion.div className="g-uc-next" variants={fadeUp} initial="hidden" animate="show">
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {last ? 'Dokončit' : 'Další převod'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}

/** A nudge after the first wrong typed answer: wrong direction or wrong number of zeros. */
function hint(t: Task, v: number): string {
  const r = v / t.answer
  const lg = Math.log10(r)
  if (Math.abs(v - t.value / t.factor) <= 0.005 * Math.abs(t.value / t.factor)) return 'Převádíš opačným směrem.'
  if (Math.abs(lg - Math.round(lg)) < 1e-6 && Math.round(lg) !== 0) return `Číslice sedí, ale máš ${fmt(r > 1 ? r : 1 / r)}× ${r > 1 ? 'víc' : 'míň'}. Hlídej počet nul.`
  if (t.factor !== 1) return t.factor > 1 ? 'Na menší jednotku vyjde větší číslo.' : 'Na větší jednotku vyjde menší číslo.'
  return ''
}

const EXPS = [9, 6, 3, 2, 1, 0, -1, -2, -3, -6, -9]

/** The prefix ladder: k h da · d c m … µ, with the start (from) and target (to) steps marked. */
function Ladder({ from, to, dim, base, reveal, wide }: { from: number; to: number; dim: number; base: string; reveal: boolean; wide: boolean }) {
  // m, g and l get the full school ladder k h da · d c m; other units only their real prefixes (MPa kPa hPa Pa)
  const school = base === 'm' || base === 'g' || base === 'l'
  const family = Object.values(UNITS)
    .filter((u) => u.ladder && u.ladder.base === base && u.ladder.dim === dim)
    .map((u) => u.ladder!.p)
  const lo = school ? Math.min(from, to, -3) : Math.min(...family)
  const hi = school ? Math.max(from, to, wide ? Math.max(from, to) : base === 'l' ? 2 : 3) : Math.max(...family)
  const exps = EXPS.filter((e) => e <= hi && e >= lo && (family.includes(e) || (school && Math.abs(e) <= 3)))
  const W = 44
  const H = 13
  const n = exps.length
  const vw = n * W + 8
  const vh = 60 + n * H
  const sup = dim === 2 ? '²' : dim === 3 ? '³' : ''
  const xi = (e: number) => 4 + exps.indexOf(e) * W + W / 2
  const yi = (e: number) => 40 + exps.indexOf(e) * H
  const diff = (from - to) * dim
  const steps = Math.abs(from - to)
  // one box = one power of ten only on a gap-free stretch; otherwise count orders of magnitude
  const path = exps.filter((e) => e <= Math.max(from, to) && e >= Math.min(from, to))
  const gapless = path.length === steps + 1
  const stepWord = gapless ? (steps === 1 ? 'schod' : steps < 5 ? 'schody' : 'schodů') : steps === 1 ? 'řád' : steps < 5 ? 'řády' : 'řádů'
  const per = dim === 1 ? '10' : dim === 2 ? '100' : '1 000'
  const x1 = xi(from)
  const x2 = xi(to)
  const yTop = Math.min(yi(from), yi(to)) - 18
  const label = `Předponový žebřík: ${exps.map((e) => `${PREFIX[e]}${base}${sup}`).join(', ')}. Z ${PREFIX[from]}${base}${sup} na ${PREFIX[to]}${base}${sup} je to ${steps} ${stepWord} ${from > to ? 'dolů' : 'nahoru'}.`
  return (
    <figure className="g-uc-ladder">
      <svg viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={label} style={{ maxWidth: Math.round(vw * 1.3) }}>
        <defs>
          <pattern id="g-uc-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" className="g-uc-hatchline" />
          </pattern>
          <marker id="g-uc-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L9 5 L0 9 z" className="g-uc-headfill" />
          </marker>
        </defs>
        {exps.map((e, k) => {
          const x = 4 + k * W
          const y = 40 + k * H
          const isFrom = e === from
          const isTo = e === to
          return (
            <g key={e} className={`g-uc-step${isFrom ? ' from' : ''}${isTo ? ' to' : ''}`}>
              <rect x={x + 1} y={y} width={W - 2} height={vh - y - 2} rx="2" className="g-uc-stepbox" />
              {(isFrom || isTo) && <rect x={x + 1} y={y} width={W - 2} height={vh - y - 2} rx="2" fill="url(#g-uc-hatch)" className="g-uc-stephatch" />}
              <line x1={x + 1} x2={x + W - 1} y1={y} y2={y} className="g-uc-tread" />
              <text x={x + W / 2} y={y + 17} textAnchor="middle" className="g-uc-steplbl">
                {PREFIX[e]}
                {base}
                {sup}
              </text>
              <text x={x + W / 2} y={y + 30} textAnchor="middle" className="g-uc-steppow">
                10{superscript(e * dim)}
              </text>
            </g>
          )
        })}
        <motion.path
          key={`${from}-${to}`}
          d={`M${x1} ${yi(from) - 3} C ${x1} ${yTop - 14}, ${x2} ${yTop - 14}, ${x2} ${yi(to) - 3}`}
          className="g-uc-arrow"
          markerEnd="url(#g-uc-head)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </svg>
      <figcaption className="g-uc-ladder-cap">
        <span>
          {steps} {stepWord} {from > to ? 'dolů' : 'nahoru'}, každý {from > to ? '×' : ':'}{per}
        </span>
        {reveal && (
          <motion.b variants={popIn} initial="hidden" animate="show">
            → {from > to ? '×' : ':'}
            {Math.abs(diff) >= 4 && wide ? `10${superscript(Math.abs(diff))}` : fmt(10 ** Math.abs(diff))}
          </motion.b>
        )}
      </figcaption>
    </figure>
  )
}
