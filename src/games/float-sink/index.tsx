import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useLater, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { Tank } from './Tank'
import { OUTCOME_LABEL, checkNumber, cz, makeRound, playedLevel, toleranceText, type Outcome, type Task } from './logic'
import './float-sink.css'

const BONUS_MAX = 25
const BONUS_FULL = 12
const BONUS_ZERO = 45
const PER_TASK = 100 + BONUS_MAX
/** Time the drop animation needs before the verdict is shown. */
const LAND_MS = 1300

type Status = 'play' | 'dropping' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const KIND_LABEL: Record<Task['kind'], string> = {
  material: 'Hustota',
  mv: 'Hustota z m a V',
  hover: 'Hustota',
  buoyancy: 'Vztlaková síla',
  fraction: 'Ponor',
  ship: 'Loď s nákladem',
  capacity: 'Loď s nákladem',
  forces: 'Tíha a vztlak',
}

/** Small picture on the answer buttons: where the block ends up. */
function OutcomeGlyph({ o }: { o: Outcome }) {
  const y = o === 'plave' ? 8 : o === 'vznasi' ? 20 : 31
  return (
    <svg viewBox="0 0 44 44" className="g-fl-glyph" aria-hidden="true">
      <rect x="3" y="14" width="38" height="27" fill="currentColor" opacity="0.16" />
      <line x1="3" y1="14" x2="41" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 4 V41 H41 V4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y={y} width="14" height="10" rx="1.5" fill="currentColor" />
    </svg>
  )
}

const SHIP_TEXT: Record<Outcome, string> = { plave: 'Udrží se', klesne: 'Potopí se', vznasi: 'Vznáší se' }

/** Keeps a number and its unit on one line ("10 N/kg", "5 dm^{3}"). */
const nb = (s: string) => s.replace(/(\d) (?=[^\s\d−+=:·→<>(])/g, '$1\u00a0')

export default function FloatSink({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<Outcome | null>(null)
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
  const later = useLater()
  const still = useReducedMotion()
  const now = useNow(status === 'play', 250)

  const t = tasks[i]
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 0
  const dropped = status !== 'play'
  const done = status === 'won' || status === 'lost'

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }

  const award = (p: number) => {
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
  }

  const choose = (o: Outcome) => {
    if (status !== 'play' || t.answer !== 'predict') return
    const s = (Date.now() - start) / 1000
    setFrozen(s)
    setPicked(o)
    setStatus('dropping')
    setMsg(null)
    const ok = o === t.outcome
    later(
      () => {
        const real = t.kind === 'ship' ? SHIP_TEXT[t.outcome].toLowerCase() : OUTCOME_LABEL[t.outcome]
        if (ok) {
          award(100 + timeBonus(s, BONUS_MAX, BONUS_FULL, BONUS_ZERO))
          setStatus('won')
          say('good', `Správně – ${real}!`)
          jolt.pop()
        } else {
          setStatus('lost')
          say('bad', `Tentokrát ne – ${real}.`)
          jolt.shake()
        }
      },
      still ? 0 : LAND_MS,
    )
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play' || t.answer !== 'number') return
    const r = checkNumber(text, t)
    if (r.kind === 'invalid') return say('info', `Napiš číslo${t.unit === '%' ? ' v procentech' : ` v ${t.unit === 't' ? 'tunách' : 'newtonech'}`}, třeba 2,5.`)
    const s = (Date.now() - start) / 1000
    if (r.kind === 'ok') {
      award(tries === 0 ? 100 + timeBonus(s, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 50)
      setFrozen(s)
      setStatus('won')
      say('good', `Správně! ${t.symbol} ≈ ${cz(t.value, 2)} ${t.unit}.`)
      jolt.pop()
      return
    }
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      const hint =
        t.kind === 'buoyancy'
          ? 'Objem převeď na m^{3} (1 dm^{3} = 0,001 m^{3}, 1 cm^{3} = 0,000 001 m^{3}) a dosaď do F_{vz} = V · ρ · g.'
          : t.kind === 'fraction'
            ? 'Ponořená část = ρ tělesa : ρ kapaliny.'
            : 'Vztlak unese nejvýš V · ρ (v kg), odečti hmotnost člunu.'
      say('bad', `${cz(r.value, 3)} to není. ${hint}`)
      inputRef.current?.select()
    } else {
      setFrozen(s)
      setStatus('lost')
      say('warn', `Správně je ${cz(t.value, 2)} ${t.unit}.`)
    }
  }

  const giveUp = () => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say('info', `Nevadí. Správně je ${t.answer === 'number' ? `${cz(t.value, 2)} ${t.unit}` : OUTCOME_LABEL[t.outcome]}.`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setText('')
    setPicked(null)
    setMsg(null)
    setPts(0)
    setStart(Date.now())
  }

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : status === 'dropping' ? 'wow' : tries ? 'think' : 'happy'

  return (
    <div className="g-sh-root g-fl">
      <p className="g-sh-instr">
        Odhadni, co těleso v kapalině udělá, nebo spočítej vztlak. Čísla se uznávají s tolerancí ±2 % (ponor ±1 procentní bod).
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Pokus" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-fl-card">
        <div className="g-fl-top">
          <div className="g-fl-q">
            <span className="eyebrow">
              {KIND_LABEL[t.kind]}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-fl-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={nb(t.text)} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={54} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        <div className="g-fl-stage">
          <Tank key={i} body={t.body} liquid={t.liquid} dropped={dropped} showForces={done} />
          <span className="g-fl-caption">
            {t.liquid.name} · ρ = <Md text={`${cz(t.liquid.rho)} kg/m^{3}`} />
          </span>
        </div>

        {status === 'play' && (
          <div className="g-fl-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-fl-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {t.answer === 'predict' && status !== 'won' && status !== 'lost' && (
        <div className={`g-fl-choices n${t.options.length}`} role="group" aria-label="Tvůj odhad">
          {t.options.map((o) => (
            <button
              key={o}
              type="button"
              className="g-fl-choice"
              aria-pressed={picked === o}
              disabled={status !== 'play'}
              onClick={() => choose(o)}
            >
              <OutcomeGlyph o={o} />
              <span>{t.kind === 'ship' ? SHIP_TEXT[o] : OUTCOME_LABEL[o]}</span>
            </button>
          ))}
        </div>
      )}

      {t.answer === 'number' && status === 'play' && (
        <form className="g-fl-form" onSubmit={submit}>
          <label className="g-fl-field">
            <span className="g-fl-flabel">
              <Md text={t.symbol} /> ({toleranceText(t)})
            </span>
            <span className="g-fl-inwrap">
              <input
                ref={inputRef}
                className="g-sh-input g-fl-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="např. 2,5"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <span className="g-fl-unit">{t.unit}</span>
            </span>
          </label>
          <div className="g-sh-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </form>
      )}

      <div className="g-fl-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={nb(msg.text)} />
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="card-flat g-fl-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-fl-why">
            <Md text={nb(t.explain)} />
          </p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další pokus'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
