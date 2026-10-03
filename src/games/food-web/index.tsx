import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { ChemIconView } from '../../illustrations/ChemIcon'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { ECOSYSTEMS, SPECIES } from './levels'
import { chainLinks, checkNumber, cz, makeRound, playedLevel, webOf, type ChainTask, type ChoiceTask, type NumberTask, type Task } from './logic'
import { WebDiagram } from './WebDiagram'
import './food-web.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const WINDOW: Record<Task['kind'], [number, number]> = {
  chain: [10, 40],
  food: [6, 25],
  eater: [6, 25],
  order: [8, 30],
  removal: [8, 30],
  pyramid: [12, 45],
  efficiency: [20, 70],
  energy: [25, 80],
  biomass: [15, 60],
}
const EYEBROW: Record<Task['kind'], string> = {
  chain: 'Potravní řetězec',
  food: 'Kdo co žere',
  eater: 'Kdo co žere',
  order: 'Trofické úrovně',
  removal: 'Když druh zmizí',
  pyramid: 'Pyramida energie',
  efficiency: 'Tok energie',
  energy: 'Tok energie',
  biomass: 'Pyramida biomasy',
}

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { points: number; ok: boolean } | null

function Chip({ id }: { id: string }) {
  const s = SPECIES[id]
  return (
    <>
      <ChemIconView name={s.icon} size={18} />
      <span>{s.short}</span>
    </>
  )
}

export default function FoodWeb({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [done, setDone] = useState<Done>(null)
  const [seq, setSeq] = useState<string[]>([])
  const [links, setLinks] = useState<boolean[] | null>(null)
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

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const end = (points: number, ok: boolean) => {
    scoreRef.current += points
    setScore(scoreRef.current)
    setFrozen((Date.now() - start) / 1000)
    setDone({ points, ok })
    if (ok) jolt.pop()
    else jolt.shake()
  }
  const elapsed = () => (Date.now() - start) / 1000

  /* ---------------------------------------------------------- chain */
  const add = (id: string) => {
    if (done || seq.includes(id)) return
    setSeq([...seq, id])
  }
  const removeAt = (k: number) => {
    if (done) return
    setSeq(seq.filter((_, j) => j !== k))
  }
  const checkChain = (c: ChainTask) => {
    const l = chainLinks(c.eco, seq)
    const good = l.filter(Boolean).length
    setLinks(l)
    const all = good === l.length && seq[0] === c.answer[0]
    const p = all ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : Math.round((100 * good) / l.length / 2)
    end(p, all)
    if (all) say('good', `Správně! ${c.why}`)
    else say('bad', `${good} z ${l.length} šipek sedí. Správně: ${c.why}`)
  }

  /* ---------------------------------------------------------- choice */
  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    end(ok ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 0, ok)
    const right = c.options.find((o) => o.id === c.answer)!.label
    if (ok) say('good', `Ano! ${c.why}`)
    else say('bad', `Správně je: ${right}. ${c.why}`)
  }

  /* ---------------------------------------------------------- number */
  const submit = (n: NumberTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const r = checkNumber(text, n)
    if (r.kind === 'invalid') return say('info', `Napiš číslo v ${n.unit === '%' ? 'procentech' : n.unit === 'kg' ? 'kilogramech' : 'kJ'}, třeba 12,5.`)
    if (r.kind === 'ok') {
      end(tries === 0 ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 50, true)
      say('good', `Správně, ${cz(n.value)} ${n.unit}. ${n.why}`)
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say('bad', `${cz(r.value)} ${n.unit} to není. Zkus to ještě jednou – násob účinností za každý přechod mezi články.`)
      inputRef.current?.select()
    } else {
      end(0, false)
      say('warn', `Ani to ne. Správně je ${cz(n.value)} ${n.unit}. ${n.why}`)
    }
  }
  const giveUp = (n: NumberTask) => {
    end(0, false)
    say('info', `Nevadí. Správně je ${cz(n.value)} ${n.unit}. ${n.why}`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setDone(null)
    setSeq([])
    setLinks(null)
    setPicked(null)
    setText('')
    setTries(0)
    setMsg(null)
    setStart(Date.now())
  }

  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : tries ? 'think' : 'happy'
  const showWeb = t.kind !== 'chain' && 'showWeb' in t ? t.showWeb || !!done : !!done
  const eco = ECOSYSTEMS[t.eco]

  return (
    <div className="g-sh-root g-fw">
      <p className="g-sh-instr">Šipka v síti vede od potravy ke konzumentovi – tím směrem teče energie. Skládej řetězce, odhaduj, co udělá zmizení druhu, a počítej, kolik energie dojde nahoru.</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-fw-card">
        <div className="g-fw-top">
          <div className="g-fw-q">
            <span className="eyebrow">
              {EYEBROW[t.kind]} · {eco.name}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-fw-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={t.text} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {done && done.points > 0 && <PointsPop key={`p${i}`} points={done.points} />}
        </div>

        {!done && (
          <div className="g-fw-bonus" aria-label={`Bonus za rychlost: ${bonusNow} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-fw-bonusbar">
              <span style={{ width: `${(bonusNow / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        {t.kind === 'chain' && (
          <div className="g-fw-chain">
            <ol className="g-fw-slots" aria-label="Tvůj řetězec">
              {t.answer.map((_, k) => (
                <li key={k} className="g-fw-slotwrap">
                  {k > 0 && (
                    <span className={`g-fw-arrow${links ? (links[k - 1] ? ' ok' : ' bad') : ''}`} aria-hidden="true">
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={`g-fw-slot${seq[k] ? ' filled' : ''}`}
                    disabled={!seq[k] || !!done}
                    onClick={() => removeAt(k)}
                    aria-label={seq[k] ? `${k + 1}. ${SPECIES[seq[k]].short} – odebrat` : `${k + 1}. místo, prázdné`}
                  >
                    {seq[k] ? <Chip id={seq[k]} /> : <span className="g-fw-slotnum">{k + 1}</span>}
                  </button>
                </li>
              ))}
            </ol>
            {!done && (
              <>
                <div className="g-fw-pool" role="group" aria-label="Organismy k seřazení">
                  {t.pool.map((id) => (
                    <button key={id} type="button" className="g-fw-chip" disabled={seq.includes(id)} onClick={() => add(id)} title={`${SPECIES[id].name} (${SPECIES[id].latin})`}>
                      <Chip id={id} />
                    </button>
                  ))}
                </div>
                <div className="g-sh-actions">
                  <button type="button" className="btn btn-primary btn-lg" disabled={seq.length < t.answer.length} onClick={() => checkChain(t)}>
                    <Icon name="check" /> Zkontrolovat
                  </button>
                  <button type="button" className="btn btn-ghost" disabled={!seq.length} onClick={() => setSeq([])}>
                    Vymazat
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showWeb && (
          <motion.div className="g-fw-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring.gentle}>
            <WebDiagram
              eco={t.eco}
              focus={t.kind === 'chain' ? [] : done ? t.focus : []}
              chain={t.kind === 'chain' ? t.answer : t.kind === 'pyramid' || t.kind === 'energy' || t.kind === 'biomass' || t.kind === 'order' ? t.focus : undefined}
              removed={t.kind === 'removal' ? t.removed : undefined}
              target={t.kind === 'removal' ? t.target : undefined}
            />
            <span className="g-fw-caption">šipka = kdo koho žere (od potravy ke konzumentovi)</span>
          </motion.div>
        )}

        {'options' in t && (
          <div className={`g-fw-options${t.kind === 'removal' ? ' two' : ''}`} role="group" aria-label="Odpovědi">
            {t.options.map((o) => {
              const state = !done ? '' : o.id === t.answer ? ' right' : o.id === picked ? ' wrong' : ' off'
              return (
                <button key={o.id} type="button" className={`g-fw-option${state}`} disabled={!!done} aria-pressed={picked === o.id} onClick={() => choose(t, o.id)}>
                  {t.kind === 'removal' ? (
                    <Icon name={o.id === 'up' ? 'arrowRight' : 'arrowLeft'} className={`g-fw-dir ${o.id}`} />
                  ) : SPECIES[o.id] ? (
                    <ChemIconView name={SPECIES[o.id].icon} size={20} />
                  ) : null}
                  <span>{o.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {(t.kind === 'efficiency' || t.kind === 'energy' || t.kind === 'biomass') && !done && (
          <form className="g-fw-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-fw-field">
              <span className="sr-only">Odpověď v {t.unit}</span>
              <span className="g-fw-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-fw-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="např. 12,5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-fw-unit">{t.unit}</span>
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

      <div className="g-fw-status" aria-live="polite">
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

      {done && (
        <details className="g-fw-legend">
          <summary>Druhy v této síti</summary>
          <ul>
            {webOf(t.eco).ids.map((id) => (
              <li key={id}>
                {SPECIES[id].name} <i>{SPECIES[id].latin}</i>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
