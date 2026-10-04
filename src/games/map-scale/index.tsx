import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { checkNumber, fmt, makeRound, playedLevel, type ChoiceTask, type NumberTask, type RulerTask, type Task } from './logic'
import { RulerBoard, ScaleBar } from './MapScaleViews'
import './map-scale.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const WINDOW: Record<Task['type'], [number, number]> = {
  number: [15, 60],
  choice: [8, 30],
  ruler: [30, 100],
}
const UNIT_WORD = { cm: 'centimetrech', m: 'metrech', km: 'kilometrech', '': 'číslech' } as const

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { points: number; ok: boolean } | null

export default function MapScale({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound())
  const [i, setI] = useState(0)
  const [done, setDone] = useState<Done>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(!done, 250)

  const t = tasks[i]
  const secs = done ? frozen : Math.max(0, (now - start) / 1000)
  const [full, zero] = WINDOW[t.type]
  const bonusNow = timeBonus(secs, BONUS_MAX, full, zero)
  const elapsed = () => (Date.now() - start) / 1000

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const end = (points: number, ok: boolean) => {
    scoreRef.current += points
    setScore(scoreRef.current)
    setFrozen(elapsed())
    setDone({ points, ok })
    if (ok) jolt.pop()
    else jolt.shake()
  }

  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    end(ok ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 0, ok)
    const right = c.options.find((o) => o.id === c.answer)!.label
    if (ok) say('good', `Správně! ${c.why}`)
    else say('bad', `Správně je ${right}. ${c.why}`)
  }

  const answerText = (n: NumberTask | RulerTask) => `${n.type === 'number' && n.prefix ? `${n.prefix} ` : ''}${fmt(n.answer, 2)}${n.unit ? ` ${n.unit}` : ''}`

  const submit = (n: NumberTask | RulerTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const r = checkNumber(text, n)
    if (r.kind === 'invalid') return say('info', `Napiš číslo v ${UNIT_WORD[n.unit]}, třeba 2,5. Čárka i tečka platí.`)
    if (r.kind === 'ok') {
      end(tries === 0 ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 50, true)
      say('good', `Správně, ${answerText(n)}. ${n.why}`)
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      const hint = r.units
        ? `Číslice sedí, ale řád ne: pozor na převod jednotek (1 m = 100 cm, 1 km = 1 000 m).`
        : n.type === 'ruler'
          ? 'Zkontroluj, že nula pravítka leží přesně na prvním bodě, a přepočítej podle měřítka.'
          : 'Zkus to ještě jednou: kolik je 1 cm na mapě ve skutečnosti?'
      say('bad', `${fmt(r.value, 3)} to není. ${hint}`)
      inputRef.current?.select()
    } else {
      end(0, false)
      say('warn', `Ani to ne. Správně je ${answerText(n)}. ${n.why}`)
    }
  }
  const giveUp = (n: NumberTask | RulerTask) => {
    end(0, false)
    say('info', `Nevadí. Správně je ${answerText(n)}. ${n.why}`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setDone(null)
    setPicked(null)
    setText('')
    setTries(0)
    setMsg(null)
    setStart(Date.now())
  }

  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : tries ? 'think' : 'happy'

  return (
    <div className="g-sh-root g-ms">
      <p className="g-sh-instr">Měřítko 1 : 50 000 znamená, že 1 cm na mapě je 50 000 cm ve skutečnosti. Počítej vzdálenosti, čti grafické měřítko a měř pravítkem.</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-ms-card">
        <div className="g-ms-top">
          <div className="g-ms-q">
            <span className="eyebrow">{t.eyebrow}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-ms-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {t.text}
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {done && done.points > 0 && <PointsPop key={`p${i}`} points={done.points} />}
        </div>

        {!done && (
          <div className="g-ms-bonus" aria-label={`Bonus za rychlost: ${bonusNow} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-ms-bonusbar">
              <span style={{ width: `${(bonusNow / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        {t.type !== 'ruler' && t.bar && (
          <div className="g-ms-barstage">
            <ScaleBar bar={t.bar} />
          </div>
        )}

        {t.type === 'ruler' && <RulerBoard key={i} map={t.map} scale={t.scale} done={!!done} cm={t.cm} />}

        {t.type === 'choice' && (
          <div className={`g-ms-options${t.options.some((o) => o.bar) ? ' bars' : t.options.length === 2 ? ' two' : ''}`} role="group" aria-label="Odpovědi">
            {t.options.map((o) => {
              const state = !done ? '' : o.id === t.answer ? ' right' : o.id === picked ? ' wrong' : ' off'
              return (
                <button key={o.id} type="button" className={`g-ms-option${state}`} disabled={!!done} aria-pressed={picked === o.id} onClick={() => choose(t, o.id)}>
                  {o.bar ? (
                    <>
                      <span className="g-ms-optlabel">{o.label}</span>
                      <ScaleBar bar={o.bar} />
                    </>
                  ) : (
                    <span>{o.label}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {(t.type === 'number' || t.type === 'ruler') && !done && (
          <form className="g-ms-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-ms-field">
              <span className="sr-only">Odpověď v {UNIT_WORD[t.unit]}</span>
              <span className="g-ms-inwrap">
                {t.type === 'number' && t.prefix && <span className="g-ms-prefix">{t.prefix}</span>}
                <input
                  ref={inputRef}
                  className={`g-sh-input g-ms-input${t.type === 'number' && t.prefix ? ' has-prefix' : ''}`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={t.unit === '' ? 'např. 25 000' : 'např. 2,5'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {t.unit && <span className="g-ms-unit">{t.unit}</span>}
              </span>
            </label>
            <div className="g-sh-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
                <Icon name="check" /> Zkontrolovat
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => giveUp(t)}>
                Nevím
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="g-ms-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="g-sh-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {i + 1 >= tasks.length ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
