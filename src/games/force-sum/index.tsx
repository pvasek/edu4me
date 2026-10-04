import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { parseDecimal, timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { colorOf, ComponentsFigure, Construction, InclineFigure, Scene } from './Diagram'
import {
  checkNumber,
  cz,
  DIR_WORD,
  explain,
  fmt,
  hint,
  judgeVector,
  makeRound,
  parseAngle,
  playedLevel,
  type Polar,
  type Task,
  type Verdict,
} from './logic'
import './force-sum.css'

const BONUS_MAX = 25
const BONUS_FULL = 20
const BONUS_ZERO = 60
const PER_TASK = 100 + BONUS_MAX

type Status = 'play' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const KIND_LABEL: Record<Task['kind'], string> = {
  resultant: 'Výslednice',
  balance: 'Rovnováha',
  component: 'Rozklad síly',
  incline: 'Nakloněná rovina',
}

/** Arrow glyph pointing at `angle` (degrees, counter-clockwise from →). */
function DirGlyph({ angle }: { angle: number }) {
  return (
    <svg viewBox="-20 -20 40 40" className="g-fs-glyph" aria-hidden="true">
      <g transform={`rotate(${-angle})`}>
        <line x1="-13" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M15 0 L5 -7 L5 7 Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

/** Keeps a number and its unit on one line ("10 N/kg", "5 dm^{3}"). */
const nb = (s: string) => s.replace(/(\d) (?=[^\s\d−+=:·→<>(])/g, '$1\u00a0')

export default function ForceSum({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [magText, setMagText] = useState('')
  const [angText, setAngText] = useState('')
  const [dir, setDir] = useState<number | null>(null)
  const [arrow, setArrow] = useState<Polar | null>(null)
  const [wrongArrow, setWrongArrow] = useState<Polar | null>(null)
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
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 0
  const vectorTask = t.kind === 'resultant' || t.kind === 'balance'
  const axisOnly = t.kind === 'resultant' ? t.level === 2 : t.kind === 'balance' ? t.axisOnly : false
  const u = t.unit

  const say = (kind: Msg['kind'], text: string) => {
    setMsg({ kind, text })
    setMsgN((n) => n + 1)
  }

  /* ---- the learner's arrow (balance) and its inputs stay in sync ---- */
  const setFromArrow = (p: Polar) => {
    setArrow(p)
    setMagText(cz(p.mag))
    if (t.kind === 'balance' && t.axisOnly) setDir(p.angle)
    else setAngText(cz(p.angle, 0))
  }
  const onMag = (s: string) => {
    setMagText(s)
    if (t.kind !== 'balance') return
    const m = parseDecimal(s)
    const a = t.axisOnly ? dir : parseAngle(angText)
    if (m !== null && m > 0) setArrow({ mag: m, angle: a ?? arrow?.angle ?? 0 })
  }
  const onAng = (s: string) => {
    setAngText(s)
    const a = parseAngle(s)
    const m = arrow?.mag ?? parseDecimal(magText)
    if (a !== null && m) setArrow({ mag: m, angle: a })
  }
  const onDir = (a: number) => {
    setDir(a)
    if (t.kind === 'balance') {
      const m = parseDecimal(magText)
      if (m !== null && m > 0) setArrow({ mag: m, angle: a })
      else if (arrow) setArrow({ ...arrow, angle: a })
    }
  }

  const correctAnswerText = (): string => {
    if (t.kind === 'component' || t.kind === 'incline') return `${fmt(t.answer)} ${u}`
    if (t.answer.mag === 0) return '0 N (rovnováha)'
    return `${fmt(t.answer.mag)} ${u}, ${axisOnly ? DIR_WORD[t.answer.angle] : `${cz(t.answer.angle, 0)}°`}`
  }

  const win = (secsNow: number) => {
    const p = tries === 0 ? 100 + timeBonus(secsNow, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 50
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    setFrozen(secsNow)
    setStatus('won')
    say('good', `Správně! ${correctAnswerText()}.${tries === 0 && secsNow <= BONUS_FULL ? ' A bleskově!' : ''}`)
    jolt.pop()
  }

  const miss = (secsNow: number, verdict: Verdict | 'wrong') => {
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      say('bad', `Ještě ne. ${hint(t, verdict)}`)
      inputRef.current?.select()
    } else {
      setFrozen(secsNow)
      setStatus('lost')
      say('warn', `Správně je ${correctAnswerText()}.`)
    }
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play') return
    const secsNow = (Date.now() - start) / 1000
    if (t.kind === 'component' || t.kind === 'incline') {
      const r = checkNumber(magText, t.answer)
      if (r.kind === 'invalid') return say('info', `Napiš číslo v ${u}, třeba 12,5. Čárka i tečka platí.`)
      return r.kind === 'ok' ? win(secsNow) : miss(secsNow, 'wrong')
    }
    const mag = parseDecimal(magText.replace(/k?N\s*$/i, ''))
    if (mag === null) return say('info', `Napiš velikost síly v ${u}, třeba 120.`)
    let angle: number | null
    if (axisOnly) angle = dir
    else if (t.kind === 'balance') angle = parseAngle(angText)
    else angle = dir
    if (mag > 0 && angle === null) return say('info', axisOnly || t.kind === 'resultant' ? 'Vyber ještě směr šipkou.' : 'Doplň úhel ve stupních (0–360°).')
    // a picked arrow counts as right when it is the arrow of the right direction
    const v = judgeVector(mag, angle, t.answer)
    if (t.kind === 'balance' && v !== 'ok') setWrongArrow(mag > 0 && angle !== null ? { mag, angle } : null)
    return v === 'ok' ? win(secsNow) : miss(secsNow, v)
  }

  const giveUp = () => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say('info', `Nevadí. Správně je ${correctAnswerText()}.`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setMagText('')
    setAngText('')
    setDir(null)
    setArrow(null)
    setWrongArrow(null)
    setMsg(null)
    setPts(0)
    setStart(Date.now())
  }

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'
  const done = status !== 'play'

  /* ---- figure ---- */
  let figure: ReactNode
  let legend: ReactNode = null
  if (vectorTask) {
    const label = `${t.title}: ${t.forces.map((f) => `${f.who} ${f.mass !== undefined ? `(hmotnost ${cz(f.mass)} kg)` : `${cz(f.mag)} ${u}`} ${axisOnly ? DIR_WORD[f.angle] : `pod úhlem ${f.angle}°`}`).join(', ')}`
    figure = (
      <Scene
        forces={t.forces}
        body={t.body}
        showAxes={!axisOnly}
        label={label}
        scaleTo={t.kind === 'balance' ? t.answer.mag : undefined}
        editor={
          t.kind === 'balance' && !done
            ? { value: arrow, onChange: setFromArrow, axisOnly: t.axisOnly, snap: t.snap, unit: u }
            : undefined
        }
      />
    )
    legend = (
      <ul className="g-fs-legend" aria-label="Síly">
        {t.forces.map((f, k) => (
          <li key={k} style={{ ['--fs-c' as string]: colorOf(k) }}>
            <span className="g-fs-lsym">
              <Md text={f.label} />
            </span>
            <span className="g-fs-lwho">{f.who}</span>
            <span className="g-fs-lval mono">
              {f.mass !== undefined ? `m = ${cz(f.mass)} kg` : `${cz(f.mag)} ${u}`}
              {axisOnly ? '' : `, ${f.angle}°`}
            </span>
            {axisOnly && (
              <span className="g-fs-ldir" aria-label={DIR_WORD[f.angle]}>
                <DirGlyph angle={f.angle} />
              </span>
            )}
          </li>
        ))}
      </ul>
    )
  } else if (t.kind === 'component') {
    figure = <ComponentsFigure force={t.force} body={t.body} reveal={done} axis={t.axis} unit={u} />
  } else {
    figure = <InclineFigure alpha={t.alpha} reveal={done} part={t.part} />
  }

  /* ---- construction shown with the feedback ---- */
  let construction: ReactNode = null
  if (done && t.kind === 'resultant') {
    construction = (
      <Construction
        items={t.forces.map((f, k) => ({ label: f.label, polar: f, color: colorOf(k) }))}
        result={t.answer.mag > 0 ? { label: 'F', polar: t.answer, color: 'var(--accent)' } : undefined}
        label={`Konstrukce výslednice: síly skládané za sebou, výslednice ${correctAnswerText()}`}
      />
    )
  } else if (done && t.kind === 'balance') {
    construction = (
      <Construction
        items={t.forces.map((f, k) => ({ label: f.label, polar: f, color: colorOf(k) }))}
        closing={{ label: 'F', polar: t.answer, color: 'var(--accent)' }}
        wrong={status === 'lost' ? wrongArrow : null}
        label={`Síly skládané za sebou, hledaná síla F ${correctAnswerText()} obrazec uzavře`}
      />
    )
  }

  const canCheck =
    magText.trim() !== '' &&
    (t.kind === 'component' || t.kind === 'incline' || (t.kind === 'balance' && !t.axisOnly ? angText.trim() !== '' : true))

  return (
    <div className="g-sh-root g-fs">
      <p className="g-sh-instr">
        Skládej síly a hledej výslednici nebo sílu, která drží těleso v klidu. Velikost se uznává s tolerancí ±2 %
        {level !== 2 ? '; úhel měříme od osy x proti směru hodinových ručiček (±3°)' : ''}.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-fs-card">
        <div className="g-fs-top">
          <div className="g-fs-q">
            <span className="eyebrow">
              {KIND_LABEL[t.kind]} · {t.title}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-fs-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={nb(t.text)} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={54} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>
        <div className="g-fs-fig" key={`f${i}`}>
          {figure}
        </div>
        {legend}
        {t.kind === 'balance' && !done && (
          <p className="g-fs-tip">
            <Icon name="info" /> Táhni oranžový kroužek, nebo vyplň velikost a {t.axisOnly ? 'směr' : 'úhel'} níže.
          </p>
        )}
        {status === 'play' && (
          <div className="g-fs-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-fs-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {status === 'play' && (
        <form className="g-fs-form" onSubmit={submit}>
          {vectorTask && (axisOnly || t.kind === 'resultant') && (
            <fieldset className="g-fs-dirs">
              <legend>{t.kind === 'resultant' ? 'Směr výslednice' : 'Směr síly F'}</legend>
              <div className="g-fs-dirrow">
                {(t.kind === 'resultant' ? t.choices : [0, 90, 180, 270]).map((a, k) => {
                  const name = axisOnly ? DIR_WORD[a] : `šipka ${'ABCD'[k]}, přibližně ${a}°`
                  return (
                    <button
                      key={a}
                      type="button"
                      className="g-fs-dir"
                      aria-pressed={dir === a}
                      aria-label={name}
                      title={axisOnly ? name : undefined}
                      onClick={() => onDir(a)}
                    >
                      <DirGlyph angle={a} />
                      {!axisOnly && <span className="g-fs-dirkey">{'ABCD'[k]}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}
          <div className="g-fs-fields">
            <label className="g-fs-field">
              <span className="g-fs-flabel">
                {t.kind === 'component' ? (
                  <Md text={`F_{${t.axis}}`} />
                ) : t.kind === 'incline' ? (
                  <Md text={t.part === 'par' ? 'F_{1}' : 'F_{2}'} />
                ) : t.kind === 'resultant' ? (
                  'Velikost výslednice F'
                ) : (
                  'Velikost síly F'
                )}
              </span>
              <span className="g-fs-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-fs-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="např. 120"
                  value={magText}
                  onChange={(e) => onMag(e.target.value)}
                />
                <span className="g-fs-unit">{u}</span>
              </span>
            </label>
            {t.kind === 'balance' && !t.axisOnly && (
              <label className="g-fs-field">
                <span className="g-fs-flabel">Úhel od osy x</span>
                <span className="g-fs-inwrap">
                  <input
                    className="g-sh-input g-fs-input"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0–360"
                    value={angText}
                    onChange={(e) => onAng(e.target.value)}
                  />
                  <span className="g-fs-unit">°</span>
                </span>
              </label>
            )}
          </div>
          <div className="g-sh-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!canCheck}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </form>
      )}

      <div className="g-fs-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={nb(msg.text)} />
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="card-flat g-fs-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          {construction && (
            <figure className="g-fs-con-fig">
              {construction}
              <figcaption>
                {t.kind === 'resultant'
                  ? t.forces.length === 2 && t.level === 8
                    ? 'Rovnoběžník sil: výslednice je jeho úhlopříčka.'
                    : 'Síly kladené za sebou (šipka za šipku): výslednice vede od začátku ke konci.'
                  : 'V rovnováze se šipky kladené za sebou uzavřou – síla F vede zpět na začátek.'}
                {t.kind === 'balance' && status === 'lost' && wrongArrow ? ' Čárkovaně tvoje síla.' : ''}
              </figcaption>
            </figure>
          )}
          <p className="g-fs-why">
            <Md text={nb(explain(t))} />
          </p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úloha'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

