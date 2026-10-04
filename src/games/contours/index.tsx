import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { ContourMap, ProfileChart } from './ContourMap'
import { buildTask, checkNumber, makeRound, playedLevel, type ChoiceTask, type NumberTask, type Task } from './logic'
import './contours.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const WINDOW: Record<Task['kind'], [number, number]> = {
  'on-contour': [10, 40],
  between: [10, 40],
  interval: [10, 40],
  steeper: [6, 25],
  profile: [12, 45],
  landform: [8, 30],
  'stream-dir': [8, 30],
  'stream-line': [8, 30],
  highest: [12, 45],
  'steep-part': [12, 45],
  climb: [20, 70],
  water: [10, 40],
}

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { points: number; ok: boolean } | null

/** Short description of the map for screen readers. */
function mapLabel(t: Task): string {
  const parts = [`Mapa s vrstevnicemi po ${t.map.interval} m`]
  if (t.map.streams.length) parts.push('potoky')
  if (t.map.trail) parts.push('turistická stezka')
  if (t.marks.length) parts.push(`body ${t.marks.map((m) => m.label).join(', ')}`)
  return parts.join(', ')
}

export default function Contours({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [specs] = useState(() => makeRound(level))
  const cache = useRef(new Map<number, Task>())
  const get = (k: number) => {
    let t = cache.current.get(k)
    if (!t) {
      t = buildTask(specs[k])
      cache.current.set(k, t)
    }
    return t
  }
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

  const t = get(i)
  // build the next map in the background while this one is played
  useEffect(() => {
    if (i + 1 >= specs.length) return
    const id = window.setTimeout(() => get(i + 1), 400)
    return () => window.clearTimeout(id)
  }, [i])

  const secs = done ? frozen : Math.max(0, (now - start) / 1000)
  const [full, zero] = WINDOW[t.kind]
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

  const submit = (n: NumberTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const r = checkNumber(text, n)
    if (r.kind === 'invalid') return say('info', 'Napiš počet metrů, třeba 240.')
    if (r.kind === 'ok') {
      end(tries === 0 ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 50, true)
      say('good', `Správně, ${n.answer} m. ${n.why}`)
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      const off = r.value - n.answer
      const hint =
        Math.abs(off) === t.map.interval
          ? 'Jsi o jednu vrstevnici vedle: odpočítej je znovu od popsané vrstevnice.'
          : 'Zjisti, na které vrstevnici chata stojí (odpočítej od popsané vrstevnice), a odečti ji od výšky vrcholu.'
      say('bad', `${r.value} m to není. ${hint}`)
      inputRef.current?.select()
    } else {
      end(0, false)
      say('warn', `Ani to ne. Správně je ${n.answer} m. ${n.why}`)
    }
  }
  const giveUp = (n: NumberTask) => {
    end(0, false)
    say('info', `Nevadí. Správně je ${n.answer} m. ${n.why}`)
  }

  const next = () => {
    if (i + 1 >= specs.length) {
      finish({ score: scoreRef.current, max: specs.length * PER_TASK })
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
  const profiles = t.type === 'choice' && t.options.some((o) => o.profile)

  return (
    <div className="g-sh-root g-ct">
      <p className="g-sh-instr">Vrstevnice spojují místa se stejnou nadmořskou výškou. Čísla na nich jsou psaná hlavou do kopce, hustší vrstevnice znamenají strmější svah.</p>
      <Hud score={score} round={i + 1} rounds={specs.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-ct-card">
        <div className="g-ct-top">
          <div className="g-ct-q">
            <span className="eyebrow">
              {t.eyebrow}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-ct-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {t.text}
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {done && done.points > 0 && <PointsPop key={`p${i}`} points={done.points} />}
        </div>

        {!done && (
          <div className="g-ct-bonus" aria-label={`Bonus za rychlost: ${bonusNow} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-ct-bonusbar">
              <span style={{ width: `${(bonusNow / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        <figure className="g-ct-stage">
          <ContourMap key={i} map={t.map} marks={t.marks} segs={done ? [...t.segs, ...t.reveal] : t.segs} label={mapLabel(t)} />
          {t.kind !== 'interval' && (
            <figcaption className="g-ct-legend">
              <span className="g-ct-key g-ct-key-c" aria-hidden="true" /> vrstevnice po {t.map.interval} m
              <span className="g-ct-key g-ct-key-ci" aria-hidden="true" /> zesílené po {5 * t.map.interval} m
            </figcaption>
          )}
        </figure>

        {t.type === 'choice' && (
          <div className={`g-ct-options${profiles ? ' profiles' : t.options.length === 2 ? ' two' : ''}`} role="group" aria-label="Odpovědi">
            {t.options.map((o) => {
              const state = !done ? '' : o.id === t.answer ? ' right' : o.id === picked ? ' wrong' : ' off'
              return (
                <button key={o.id} type="button" className={`g-ct-option${state}`} disabled={!!done} aria-pressed={picked === o.id} onClick={() => choose(t, o.id)}>
                  {o.profile && t.range ? (
                    <>
                      <span className="g-ct-optlabel">{o.label}</span>
                      <ProfileChart profile={o.profile} range={t.range} interval={t.map.interval} />
                    </>
                  ) : (
                    <span>{o.label}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {t.type === 'number' && !done && (
          <form className="g-ct-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-ct-field">
              <span className="sr-only">Výškový rozdíl v metrech</span>
              <span className="g-ct-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-ct-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="např. 240"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-ct-unit">m</span>
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

      <div className="g-ct-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="g-sh-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {i + 1 >= specs.length ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
