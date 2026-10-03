import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, rise, spring, stagger } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { LEVELS } from './levels'
import { OrganismPic } from './Organism'
import { BONUS_MAX, cap, lead, makeRound, playedLevel, traitOf, walkBonusWindow, walkPoints, type ReverseTask, type Task, type WalkTask } from './logic'
import './id-key.css'

const PER_TASK = 100 + BONUS_MAX
const REV_FULL = 8
const REV_ZERO = 30

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { title: string; points: number } | null
/** One answered couplet of a walk: the right lead and whether it was hit first time. */
type Trail = { n: number; text: string; answer: boolean; clean: boolean }[]

export default function IdKey({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [step, setStep] = useState(0)
  const [missed, setMissed] = useState<boolean | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [trail, setTrail] = useState<Trail>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [done, setDone] = useState<Done>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const firstLead = useRef<HTMLButtonElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(!done, 250)

  const t: Task = tasks[i]
  const set = LEVELS[t.level]
  const secs = done ? frozen : Math.max(0, (now - start) / 1000)

  const say = (kind: Msg['kind'], text: string) => {
    setMsg({ kind, text })
    setMsgN((n) => n + 1)
  }
  const award = (p: number) => {
    scoreRef.current += p
    setScore(scoreRef.current)
  }

  /* ---------------------------------------------------------- walk */
  const answerStep = (w: WalkTask, answer: boolean) => {
    if (done) return
    const s = w.steps[step]
    const tr = s.couplet.trait
    if (answer !== s.answer) {
      if (missed === null) setMistakes((m) => m + 1)
      setMissed(answer)
      say('bad', `Ne – tenhle organismus ${lead(tr, s.answer)}. ${tr.why}`)
      jolt.shake()
      return
    }
    const clean = missed === null
    const nextTrail = [...trail, { n: s.couplet.n, text: lead(tr, s.answer), answer: s.answer, clean }]
    setTrail(nextTrail)
    setMissed(null)
    if (step + 1 < w.steps.length) {
      setStep(step + 1)
      if (clean) setMsg(null)
      window.setTimeout(() => firstLead.current?.focus(), 0)
      return
    }
    // named
    const el = (Date.now() - start) / 1000
    const m = mistakes
    const win = walkBonusWindow(w.steps.length)
    const p = walkPoints(w.steps.length, m, m === 0 ? timeBonus(el, BONUS_MAX, win.full, win.zero) : 0)
    award(p)
    setFrozen(el)
    setDone({ title: w.org.name, points: p })
    if (m === 0) {
      say('good', `Určeno bez chyby! Je to ${w.org.name}.`)
      jolt.pop()
    } else say('info', `Určeno: ${w.org.name}. ${m === 1 ? 'Jedna teze napoprvé nevyšla' : m < 5 ? `${m} teze napoprvé nevyšly` : `${m} tezí napoprvé nevyšlo`} – zkus si je zapamatovat.`)
  }

  /* ---------------------------------------------------------- reverse */
  const choose = (r: ReverseTask, id: string) => {
    if (done) return
    const el = (Date.now() - start) / 1000
    const right = traitOf(set, r.answer)
    const why = `${cap(r.a.name)} ${lead(right, r.a.t[r.answer])}, ${r.b.name} ${lead(right, r.b.t[r.answer])}.`
    setPicked(id)
    setFrozen(el)
    if (id === r.answer) {
      const p = 100 + timeBonus(el, BONUS_MAX, REV_FULL, REV_ZERO)
      award(p)
      setDone({ title: 'Správná otázka', points: p })
      say('good', `Přesně tak: ${why}`)
      jolt.pop()
    } else {
      const wrong = traitOf(set, id)
      const v = r.a.t[id]
      setDone({ title: 'Tahle je nerozliší', points: 0 })
      say('bad', `Na otázku „${wrong.q}“ je u obou stejná odpověď (${v ? 'ano' : 'ne'}). Rozliší je „${right.q}“: ${why}`)
      jolt.shake()
    }
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStep(0)
    setMissed(null)
    setMistakes(0)
    setTrail([])
    setPicked(null)
    setDone(null)
    setMsg(null)
    setStart(Date.now())
    window.setTimeout(() => firstLead.current?.focus(), 0)
  }

  // keyboard: A / B (or 1 / 2) answer a couplet, Enter goes on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (t.kind !== 'walk' || done) return
      const k = e.key.toLowerCase()
      if (k === 'a' || k === '1') answerStep(t, true)
      else if (k === 'b' || k === '2') answerStep(t, false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const mood: Mood = done ? (done.points >= 100 ? 'cheer' : done.points > 0 ? 'happy' : 'sad') : missed !== null ? 'think' : 'happy'
  const levelNote = level === undefined ? ` · úroveň ${t.level}` : ''

  return (
    <div className="g-sh-root g-ik">
      <p className="g-sh-instr">
        Odpovídej na dvojice tvrzení (teze <b>a</b> / <b>b</b>) jako v určovacím klíči, dokud organismus nepojmenuješ. Občas klíč obrátíš: najdi otázku, která dva organismy rozliší.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      {t.kind === 'walk' ? (
        <>
          <div ref={cardRef} className="card g-ik-card">
            <div className="g-ik-top">
              <span className="eyebrow">
                {set.title}
                {levelNote}
              </span>
              <Mascot mood={mood} size={48} />
              {done && <PointsPop key={`p${i}`} points={done.points} />}
            </div>
            <div className="g-ik-specimen">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={i} className="g-ik-picwrap" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                  <OrganismPic pic={t.org.pic} label={done ? `${t.org.name} (${t.org.latin})` : 'Neznámý organismus k určení'} />
                  {t.org.micro && <span className="g-ik-micro">pod mikroskopem</span>}
                </motion.div>
              </AnimatePresence>
              <div className="g-ik-look">
                <span className="g-ik-label">Co vidíš</span>
                <ul>
                  {t.org.look.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card-flat g-ik-key" aria-label="Určovací klíč">
            {trail.length > 0 && (
              <ol className="g-ik-trail">
                {trail.map((s) => (
                  <li key={s.n} className={s.clean ? 'ok' : 'fixed'}>
                    <span className="g-ik-num mono">
                      {s.n}
                      {s.answer ? 'a' : 'b'}
                    </span>
                    <span>{s.text}</span>
                    <Icon name={s.clean ? 'check' : 'refresh'} />
                  </li>
                ))}
              </ol>
            )}
            {!done ? (
              (() => {
                const s = t.steps[step]
                const tr = s.couplet.trait
                return (
                  <motion.div key={`${i}-${step}`} className="g-ik-couplet" variants={stagger(0.06, 0)} initial="hidden" animate="show">
                    <span className="g-ik-label">
                      Teze {s.couplet.n} · krok {step + 1}
                    </span>
                    {[true, false].map((ans) => (
                      <motion.button
                        key={String(ans)}
                        ref={ans ? firstLead : undefined}
                        type="button"
                        variants={rise}
                        className={`g-ik-lead${missed === ans ? ' wrong' : ''}`}
                        disabled={missed === ans}
                        onClick={() => answerStep(t, ans)}
                        aria-keyshortcuts={ans ? 'A' : 'B'}
                      >
                        <span className="g-ik-num mono">
                          {s.couplet.n}
                          {ans ? 'a' : 'b'}
                        </span>
                        <span className="g-ik-leadtext">{cap(lead(tr, ans))}</span>
                        <span className="g-ik-dots" aria-hidden="true">
                          {typeof (ans ? s.couplet.yes : s.couplet.no) === 'string' ? '→ jméno' : '→ další teze'}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )
              })()
            ) : (
              <motion.div className="g-ik-named" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
                <span className="g-ik-label">Určeno</span>
                <b className="g-ik-name">{t.org.name}</b>
                <i className="g-ik-latin">{t.org.latin}</i>
                <span className="chip g-ik-group">{t.org.group}</span>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <div ref={cardRef} className="card g-ik-card">
          <div className="g-ik-top">
            <span className="eyebrow">Obrácený klíč{levelNote}</span>
            <Mascot mood={mood} size={48} />
            {done && <PointsPop key={`p${i}`} points={done.points} />}
          </div>
          <div className="g-ik-pair">
            {[t.a, t.b].map((o) => (
              <figure key={o.id} className="g-ik-paircell">
                <OrganismPic pic={o.pic} label={`${o.name} (${o.latin})`} />
                <figcaption>
                  <b>{o.name}</b>
                  <i>{o.latin}</i>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="g-ik-ask">Kterou otázkou je klíč od sebe odliší?</p>
          <div className="g-ik-options" role="group" aria-label="Otázky z klíče">
            {t.options.map((id) => {
              const state = !done ? '' : id === t.answer ? ' right' : id === picked ? ' wrong' : ' off'
              return (
                <button key={id} type="button" className={`g-ik-option${state}`} disabled={!!done} aria-pressed={picked === id} onClick={() => choose(t, id)}>
                  {traitOf(set, id).q}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="g-ik-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {done && (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {i + 1 >= tasks.length ? 'Dokončit' : 'Další organismus'} <Icon name="arrowRight" />
          </button>
        </div>
      )}
    </div>
  )
}
