import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { PyramidView } from '../../illustrations/geography/PyramidView'
import { czn } from '../../illustrations/geography/charts'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { POP_BY_ID } from './data'
import type { TaskKind } from './levels'
import { STEP, checkNumber, label, makeRound, playedLevel, toSpec, type ChoiceTask, type NumberTask } from './logic'
import './pop-pyramid.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const WINDOW: Record<TaskKind, [number, number]> = {
  type: [8, 30],
  share: [12, 45],
  more: [6, 25],
  cohort: [12, 45],
  war: [10, 40],
  develop: [8, 30],
  country: [10, 40],
  stage: [12, 45],
  future: [12, 45],
  trend: [12, 45],
  surplus: [10, 40],
  dependency: [25, 80],
  support: [20, 70],
  'dep-pair': [12, 45],
}
const EYEBROW: Record<TaskKind, string> = {
  type: 'Typ pyramidy',
  share: 'Čtení pyramidy',
  more: 'Děti a senioři',
  cohort: 'Silné a slabé ročníky',
  war: 'Stopy války',
  develop: 'Pyramida a vyspělost',
  country: 'Poznej stát',
  stage: 'Demografický přechod',
  future: 'Za 20 let',
  trend: 'Projekce OSN',
  surplus: 'Migrace',
  dependency: 'Index závislosti',
  support: 'Pracující a senioři',
  'dep-pair': 'Index závislosti',
}

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { points: number; ok: boolean } | null

export default function PopPyramid({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
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
    say(ok ? 'good' : 'bad', ok ? `Správně! ${c.why}` : `Správně je: ${right}. ${c.why}`)
  }

  const submit = (n: NumberTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const r = checkNumber(text, n)
    if (r.kind === 'invalid') return say('info', 'Napiš číslo, třeba 57,3.')
    if (r.kind === 'ok') {
      end(tries === 0 ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 50, true)
      say('good', `Správně! ${n.why}`)
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say(
        'bad',
        n.kind === 'dependency'
          ? `${czn(r.value, 1)} to není. Sečti děti a seniory, vyděl to lidmi ve věku 15–64 a vynásob 100.`
          : `${czn(r.value, 1)} to není. Vyděl podíl lidí 15–64 podílem seniorů 65+.`,
      )
      inputRef.current?.select()
    } else {
      end(0, false)
      say('warn', `Ani to ne. Správně je ${czn(n.value, n.digits)}. ${n.why}`)
    }
  }
  const giveUp = (n: NumberTask) => {
    end(0, false)
    say('info', `Nevadí. Správně je ${czn(n.value, n.digits)}. ${n.why}`)
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
  const ids = done && t.after ? t.after : t.pops
  const pyramids = ids.map((id) => toSpec(POP_BY_ID[id]))
  const two = ids.length > 1
  const names = !t.hideName || done
    ? two && !t.after
      ? ids.map((id, k) => `${'AB'[k]}: ${label(POP_BY_ID[id])}`)
      : undefined
    : two
      ? ['Pyramida A', 'Pyramida B']
      : ['Neznámý stát, 2023']
  const marks = done ? t.marks : t.kind === 'future' ? [t.marks?.[0] ?? []] : undefined

  return (
    <div className="g-sh-root g-pp">
      <p className="g-sh-instr">
        Věková pyramida ukazuje, kolik procent obyvatel je v každé věkové skupině: muži vlevo, ženy vpravo, nejmladší dole. Ze tvaru poznáš, jestli populace roste, nebo stárne.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-pp-card">
        <div className="g-pp-top">
          <div className="g-pp-q">
            <span className="eyebrow">
              {EYEBROW[t.kind]}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-pp-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={t.text} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {done && done.points > 0 && <PointsPop key={`p${i}`} points={done.points} />}
        </div>

        {!done && (
          <div className="g-pp-bonus" aria-label={`Bonus za rychlost: ${bonusNow} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-pp-bonusbar">
              <span style={{ width: `${(bonusNow / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        <div className="g-pp-stage">
          <PyramidView key={`${i}-${ids.length}`} step={STEP} pyramids={pyramids} names={names} marks={marks} />
        </div>

        {t.mode === 'choice' && (
          <div className={`g-pp-options${t.options.length === 2 ? ' two' : ''}${t.options.length >= 5 ? ' many' : ''}`} role="group" aria-label="Odpovědi">
            {t.options.map((o) => {
              const state = !done ? '' : o.id === t.answer ? ' right' : o.id === picked ? ' wrong' : ' off'
              return (
                <button key={o.id} type="button" className={`g-pp-option${state}`} disabled={!!done} aria-pressed={picked === o.id} onClick={() => choose(t, o.id)}>
                  {o.label}
                </button>
              )
            })}
          </div>
        )}

        {t.mode === 'number' && !done && (
          <form className="g-pp-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-pp-field">
              <span className="sr-only">Odpověď</span>
              <span className="g-pp-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-pp-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="např. 57,3"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-pp-unit">{t.unit}</span>
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

      <div className="g-pp-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
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
