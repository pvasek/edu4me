import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { SelectionChart, Square, spoken } from './Square'
import { checkNumber, cz, makeRound, playedLevel, sameSet, wrongCells, type Task } from './logic'
import './punnett.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
/** Full bonus up to / no bonus from (seconds): a square to fill takes longer. */
const WINDOW = { fill: [25, 75], plain: [12, 45] } as const

type Stage = 'fill' | 'ask' | 'done'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const emptyAnswers = (t: Task) => (t.fill ? t.fill.cells.map((row, r) => row.map((g, c) => (t.fill!.blanks[r][c] ? null : g))) : [])
const firstBlank = (t: Task, answers: (string | null)[][]): [number, number] | null => {
  if (!t.fill) return null
  for (let r = 0; r < t.fill.rows.length; r++) for (let c = 0; c < t.fill.cols.length; c++) if (t.fill.blanks[r][c] && !answers[r][c]) return [r, c]
  return null
}

export default function Punnett({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const t = tasks[i]
  const [stage, setStage] = useState<Stage>(t.fill ? 'fill' : 'ask')
  const [answers, setAnswers] = useState(() => emptyAnswers(t))
  const [sel, setSel] = useState<[number, number] | null>(() => firstBlank(t, emptyAnswers(t)))
  const [wrong, setWrong] = useState<[number, number][]>([])
  const [fillTries, setFillTries] = useState(0)
  const [fillOk, setFillOk] = useState(false)
  const [picked, setPicked] = useState<number[]>([])
  const [qTries, setQTries] = useState(0)
  const [qOk, setQOk] = useState<boolean | null>(null)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const taskPts = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(stage !== 'done', 250)

  const win = t.fill ? WINDOW.fill : WINDOW.plain
  const secs = stage !== 'done' ? Math.max(0, (now - start) / 1000) : frozen
  const clean = fillTries === 0 && qTries === 0
  const bonus = clean ? timeBonus(secs, BONUS_MAX, win[0], win[1]) : 0
  const fill = t.fill
  const qWorth = fill ? 50 : 100

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const add = (p: number) => {
    taskPts.current += p
    scoreRef.current += p
    setScore(scoreRef.current)
  }

  /** Ends the task: time bonus when everything was right at the first try. */
  const close = (ok: boolean, firstTry: boolean) => {
    const s = (Date.now() - start) / 1000
    setFrozen(s)
    if (ok && firstTry && fillTries === 0 && (!fill || fillOk)) add(timeBonus(s, BONUS_MAX, win[0], win[1]))
    setPts(taskPts.current)
    setStage('done')
    if (ok) jolt.pop()
    else jolt.shake()
  }

  // ---------- filling the square
  const place = (g: string) => {
    if (stage !== 'fill' || !sel || !fill) return
    const next = answers.map((row) => [...row])
    next[sel[0]][sel[1]] = g
    setAnswers(next)
    setWrong((w) => w.filter(([r, c]) => r !== sel[0] || c !== sel[1]))
    // next empty blank after the current one, else the first empty one, else stay
    const order: [number, number][] = []
    fill.blanks.forEach((row, r) => row.forEach((b, c) => b && order.push([r, c])))
    const at = order.findIndex(([r, c]) => r === sel[0] && c === sel[1])
    const after = [...order.slice(at + 1), ...order.slice(0, at)].find(([r, c]) => !next[r][c])
    setSel(after ?? sel)
  }
  const filledAll = fill ? fill.blanks.every((row, r) => row.every((b, c) => !b || answers[r][c])) : false

  const checkSquare = () => {
    if (!fill || stage !== 'fill' || !filledAll) return
    const bad = wrongCells(fill, answers)
    if (bad.length === 0) {
      const p = fillTries === 0 ? 50 : 25
      add(p)
      setFillOk(true)
      setStage('ask')
      say('good', fillTries === 0 ? 'Čtverec sedí! Teď z něj vyčti odpověď.' : 'Teď už čtverec sedí. Vyčti z něj odpověď.')
      jolt.pop()
      return
    }
    jolt.shake()
    if (fillTries === 0) {
      setFillTries(1)
      setWrong(bad)
      setSel(bad[0])
      say(
        'bad',
        `${bad.length === 1 ? 'Jedno políčko nesedí' : `${bad.length} ${bad.length <= 4 ? 'políčka nesedí' : 'políček nesedí'}`}. V každém je jedna alela z řádku (${fill.rowLabel}) a jedna ze sloupce (${fill.colLabel}), dominantní se píše první.`,
      )
    } else {
      setFillTries(2)
      setWrong(bad)
      setStage('ask')
      say('warn', 'Ani teď to nesedí – správné genotypy jsou doplněné. Vyčti ze čtverce odpověď.')
    }
  }

  // ---------- the question
  const q = t.q
  const choose = (k: number) => {
    if (stage !== 'ask' || q.kind !== 'choice') return
    setPicked([k])
    const ok = k === q.answer
    setQOk(ok)
    if (ok) {
      add(qWorth)
      say('good', 'Správně!')
    } else say('bad', `Tentokrát ne. Správně je ${q.options[q.answer]}.`)
    close(ok, true)
  }
  const toggle = (k: number) => {
    if (stage !== 'ask' || q.kind !== 'multi') return
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))
  }
  const checkMulti = () => {
    if (stage !== 'ask' || q.kind !== 'multi' || picked.length === 0) return
    if (sameSet(picked, q.answer)) {
      add(qTries === 0 ? qWorth : qWorth / 2)
      setQOk(true)
      say('good', 'Správně!')
      close(true, qTries === 0)
      return
    }
    if (qTries === 0) {
      setQTries(1)
      jolt.shake()
      const extra = picked.some((k) => !q.answer.includes(k))
      say('bad', extra ? 'Něco z vybraného gameta být nemůže: gameta nese z každého genu jen jednu alelu, a to takovou, kterou rodič má.' : 'Chybí ti některá gameta. Zkus projít všechny kombinace.')
      return
    }
    setQOk(false)
    say('warn', `Správně jsou: ${q.answer.map((k) => q.options[k]).join(', ')}.`)
    close(false, false)
  }
  const submitNumber = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (stage !== 'ask' || q.kind !== 'number') return
    const r = checkNumber(text, q)
    if (r.kind === 'invalid') return say('info', q.unit === '%' ? 'Napiš číslo v procentech, třeba 4,2.' : q.unit === 'gen' ? 'Napiš celé číslo, třeba 5.' : 'Napiš desetinné číslo, třeba 0,25.')
    const show = q.unit === 'gen' ? cz(q.value) : q.unit === '%' ? `${cz(q.value, 2)} %` : cz(q.value, 3)
    if (r.kind === 'ok') {
      add(qTries === 0 ? 100 : 50)
      setQOk(true)
      say('good', `Správně, ${show}!`)
      close(true, qTries === 0)
      return
    }
    if (qTries === 0) {
      setQTries(1)
      jolt.shake()
      say('bad', `${cz(r.value, 3)} to není. ${q.hint}`)
      inputRef.current?.select()
      return
    }
    setQOk(false)
    say('warn', `Správně je ${show}.`)
    close(false, false)
  }
  const giveUp = () => {
    if (stage === 'done') return
    if (stage === 'fill') {
      setFillTries(2)
      setWrong(fill ? wrongCells(fill, answers).filter(([r, c]) => answers[r][c]) : [])
      setStage('ask')
      say('info', 'Nevadí, čtverec je doplněný. Zkus z něj aspoň vyčíst odpověď.')
      return
    }
    setQOk(false)
    say(
      'info',
      `Nevadí. Správně je ${q.kind === 'choice' ? q.options[q.answer] : q.kind === 'multi' ? q.answer.map((k) => q.options[k]).join(', ') : q.unit === '%' ? `${cz(q.value, 2)} %` : cz(q.value, 3)}.`,
    )
    close(false, false)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    const nt = tasks[i + 1]
    const a = emptyAnswers(nt)
    setI(i + 1)
    setStage(nt.fill ? 'fill' : 'ask')
    setAnswers(a)
    setSel(firstBlank(nt, a))
    setWrong([])
    setFillTries(0)
    setFillOk(false)
    setPicked([])
    setQTries(0)
    setQOk(null)
    setText('')
    setMsg(null)
    setPts(0)
    taskPts.current = 0
    setStart(Date.now())
  }

  const mood: Mood = stage === 'done' ? (qOk ? 'cheer' : 'sad') : fillTries || qTries ? 'think' : 'happy'
  const reveal = stage !== 'fill'

  return (
    <div className="g-sh-root g-pn">
      <p className="g-sh-instr">
        Křížení řeš Punnettovým čtvercem: vyber políčko, pak genotyp, a vyčti z něj odpověď. Četnosti alel spočítej. Za rychlost bez chyby je bonus.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-pn-card">
        <div className="g-pn-top">
          <div className="g-pn-q">
            <span className="eyebrow">
              {t.title}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={i} className="g-pn-intro" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <p>
                  <Md text={t.intro} />
                </p>
                {t.cross && (
                  <p className="g-pn-cross" aria-label={`Křížení: samice ${spoken(t.cross.split(' × ')[0].slice(2))}, samec ${spoken(t.cross.split(' × ')[1].slice(2))}`}>
                    <Md text={t.cross} />
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={54} />
          {stage === 'done' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        {fill && (
          <Square
            fill={fill}
            answers={answers}
            selected={sel}
            wrong={wrong}
            reveal={reveal}
            phen={stage === 'done' ? fill.phen : undefined}
            onSelect={(r, c) => setSel([r, c])}
          />
        )}

        {stage !== 'done' && (
          <div className="g-pn-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-pn-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {stage === 'fill' && fill && (
        <div className="g-pn-fillbar">
          <div className="g-pn-palette" role="group" aria-label="Genotypy k doplnění">
            {fill.palette.map((g) => (
              <button key={g} type="button" className="g-pn-chip" onClick={() => place(g)} disabled={!sel} aria-label={`Vložit ${spoken(g)}`}>
                <Md text={g} />
              </button>
            ))}
          </div>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={checkSquare} disabled={!filledAll}>
              <Icon name="check" /> Zkontrolovat čtverec
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </div>
      )}

      {stage !== 'fill' && (
        <motion.div className="g-pn-ask" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-pn-prompt">
            <Md text={q.prompt} />
          </p>
          {q.kind === 'choice' && (
            <div className={`g-pn-options${q.options.length <= 2 ? ' n2' : ''}`} role="group" aria-label="Možnosti">
              {q.options.map((o, k) => {
                const state = stage === 'done' ? (k === q.answer ? ' is-right' : picked.includes(k) ? ' is-wrong' : '') : ''
                return (
                  <button key={o} type="button" className={`g-pn-opt${state}`} aria-pressed={picked.includes(k)} disabled={stage === 'done'} onClick={() => choose(k)}>
                    {stage === 'done' && k === q.answer && <Icon name="check" />}
                    {stage === 'done' && k !== q.answer && picked.includes(k) && <Icon name="x" />}
                    <span>
                      <Md text={o} />
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {q.kind === 'multi' && (
            <>
              <div className="g-pn-options g-pn-gametes" role="group" aria-label="Gamety">
                {q.options.map((o, k) => {
                  const on = picked.includes(k)
                  const state = stage === 'done' ? (q.answer.includes(k) ? ' is-right' : on ? ' is-wrong' : '') : ''
                  return (
                    <button key={o} type="button" className={`g-pn-opt g-pn-gam-opt${state}`} aria-pressed={on} aria-label={spoken(o)} disabled={stage === 'done'} onClick={() => toggle(k)}>
                      <span className="g-pn-tick-box" aria-hidden="true">
                        {on && <Icon name="check" />}
                      </span>
                      <span className="g-pn-gam">
                        <Md text={o} />
                      </span>
                    </button>
                  )
                })}
              </div>
              {stage === 'ask' && (
                <div className="g-sh-actions">
                  <button type="button" className="btn btn-primary btn-lg" onClick={checkMulti} disabled={picked.length === 0}>
                    <Icon name="check" /> Zkontrolovat
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={giveUp}>
                    Nevím
                  </button>
                </div>
              )}
            </>
          )}
          {q.kind === 'number' && stage === 'ask' && (
            <form className="g-pn-form" onSubmit={submitNumber}>
              <label className="sr-only" htmlFor="g-pn-input">
                {q.prompt}
              </label>
              <span className="g-pn-inwrap">
                <input
                  id="g-pn-input"
                  ref={inputRef}
                  className="g-sh-input g-pn-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  autoFocus
                  placeholder={q.unit === '%' ? 'např. 4,2' : q.unit === 'gen' ? 'např. 5' : 'např. 0,25'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {q.unit && <span className="g-pn-unit">{q.unit === 'gen' ? 'gen.' : '%'}</span>}
              </span>
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
        </motion.div>
      )}

      <div className="g-pn-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {stage === 'done' && (
        <motion.div className="card-flat g-pn-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-pn-why">
            <Md text={t.explain} />
          </p>
          {t.path && <SelectionChart path={t.path} />}
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
