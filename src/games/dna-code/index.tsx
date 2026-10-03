import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { CodonTable, Slots, StrandView } from './Strand'
import { checkTyped, makeRound, playedLevel, type Task } from './logic'
import './dna-code.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
/** Full bonus up to / none from (seconds): reading a table takes longer than typing nine bases. */
const WINDOW: Record<Task['kind'], [number, number]> = {
  'transcribe-template': [15, 45],
  'transcribe-coding': [12, 40],
  codon: [10, 35],
  anticodon: [10, 35],
  translate: [20, 60],
  'translate-start': [25, 70],
  mutation: [25, 70],
}
const KEYS = ['A', 'U', 'G', 'C'] as const

type Status = 'play' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

export default function DnaCode({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [typed, setTyped] = useState('')
  const [bad, setBad] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(true)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const t = tasks[i]
  const typing = typeof t.answer === 'string'
  const right = typing ? (t.answer as string) : ''
  const win = WINDOW[t.kind]
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, win[0], win[1]) : 0

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const award = (p: number) => {
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
  }

  // ---------- typing the mRNA
  const press = (b: string) => {
    if (status !== 'play' || !typing) return
    if (b === 'T') {
      say('info', 'V RNA thymin není – místo T se páruje uracil **U**.')
      return
    }
    setTyped((s) => (s.length < right.length ? s + b : s))
    setBad([])
  }
  const back = () => {
    if (status !== 'play') return
    setTyped((s) => s.slice(0, -1))
    setBad([])
  }
  const check = () => {
    if (status !== 'play' || !typing) return
    const r = checkTyped(typed, right)
    if (r.kind === 'short') return say('info', `Doplň všech ${right.length} bází.`)
    const s = (Date.now() - start) / 1000
    if (r.kind === 'ok') {
      award(tries === 0 ? 100 + timeBonus(s, BONUS_MAX, win[0], win[1]) : 50)
      setFrozen(s)
      setStatus('won')
      say('good', `Správně! mRNA je ${right}.`)
      jolt.pop()
      return
    }
    jolt.shake()
    setBad(r.bad)
    if (tries === 0) {
      setTries(1)
      say('bad', `${r.bad.length === 1 ? 'Jedna báze nesedí' : `${r.bad.length} ${r.bad.length <= 4 ? 'báze nesedí' : 'bází nesedí'}`} (označené). ${t.hint ?? ''}`)
    } else {
      setFrozen(s)
      setStatus('lost')
      say('warn', `Ani teď to není ono. Správně je ${right}.`)
    }
  }

  // keyboard: letters, Backspace, Enter while typing
  const keyRef = useRef({ press, back, check })
  keyRef.current = { press, back, check }
  useEffect(() => {
    if (!typing || status !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      const k = e.key.toUpperCase()
      if (['A', 'U', 'G', 'C', 'T'].includes(k)) {
        e.preventDefault()
        keyRef.current.press(k)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        keyRef.current.back()
      } else if (e.key === 'Enter' && el?.tagName !== 'BUTTON') {
        e.preventDefault()
        keyRef.current.check()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [typing, status, i])

  // ---------- choosing
  const choose = (k: number) => {
    if (status !== 'play' || typing || !t.options) return
    const s = (Date.now() - start) / 1000
    setPicked(k)
    setFrozen(s)
    if (k === t.answer) {
      award(100 + timeBonus(s, BONUS_MAX, win[0], win[1]))
      setStatus('won')
      say('good', 'Správně!')
      jolt.pop()
    } else {
      setStatus('lost')
      say('bad', `Tentokrát ne. Správně je: ${t.options[t.answer as number]}.`)
      jolt.shake()
    }
  }

  const giveUp = () => {
    if (status !== 'play') return
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say('info', `Nevadí. Správně je ${typing ? right : t.options![t.answer as number]}.`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setTyped('')
    setBad([])
    setPicked(null)
    setMsg(null)
    setPts(0)
    setStart(Date.now())
  }

  const done = status !== 'play'
  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'
  const longOptions = t.kind === 'mutation' || t.kind === 'translate' || t.kind === 'translate-start'

  return (
    <div className="g-sh-root g-dc">
      <p className="g-sh-instr">Přepiš DNA do mRNA, přelož ji podle tabulky kodonů a posuď, co udělá mutace. Rychlé správné odpovědi mají bonus.</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-dc-card">
        <div className="g-dc-top">
          <div className="g-dc-q">
            <span className="eyebrow">{t.title}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-dc-prompt" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={t.prompt} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={54} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        <div className="g-dc-strands" key={`s${i}`}>
          {t.strands.map((s) => (
            <StrandView key={s.label} strand={s} />
          ))}
          {typing && <Slots length={right.length} typed={done ? right : typed} frame={t.strands[0].frame} bad={bad} done={done} />}
        </div>

        {status === 'play' && (
          <div className="g-dc-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-dc-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {t.table && (
        <section className="card-flat g-dc-tablewrap" aria-label="Tabulka kodonů">
          <button type="button" className="btn btn-sm g-dc-toggle" aria-expanded={showTable} onClick={() => setShowTable((v) => !v)}>
            <Icon name="book" /> {showTable ? 'Skrýt tabulku kodonů' : 'Ukázat tabulku kodonů'}
          </button>
          {showTable && <CodonTable highlight={done ? t.highlight : []} />}
        </section>
      )}

      {typing && status === 'play' && (
        <div className="g-dc-pad">
          <span className="sr-only" aria-live="polite">
            Napsáno: {typed.split('').join(' ') || 'nic'}
          </span>
          <div className="g-dc-keys" role="group" aria-label="Báze RNA">
            {KEYS.map((b) => (
              <button key={b} type="button" className={`g-dc-key g-dc-${b}`} onClick={() => press(b)} disabled={typed.length >= right.length}>
                {b}
              </button>
            ))}
            <button type="button" className="g-dc-key g-dc-back" onClick={back} disabled={!typed} aria-label="Smazat poslední bázi">
              <Icon name="arrowLeft" />
            </button>
          </div>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={check} disabled={typed.length < right.length}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </div>
      )}

      {!typing && t.options && (
        <div className={`g-dc-options${longOptions ? ' is-long' : ''}`} role="group" aria-label="Možnosti">
          {t.options.map((o, k) => {
            const state = done ? (k === t.answer ? ' is-right' : picked === k ? ' is-wrong' : '') : ''
            return (
              <button key={o} type="button" className={`g-dc-opt${state}`} aria-pressed={picked === k} disabled={done} onClick={() => choose(k)}>
                {done && k === t.answer && <Icon name="check" />}
                {done && k !== t.answer && picked === k && <Icon name="x" />}
                <span>{o}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="g-dc-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="card-flat g-dc-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-dc-why">
            <Md text={t.explain} />
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
