import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BY_SYMBOL, categoryVar } from '../../courses/chemie/data/elements'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, rise, spring, stagger } from '../../ui/motion'
import { Feedback, Hud, LevelChip, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { fmtNum, timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { TOLERANCE, breakdown, checkMass, pickItems, playedLevel } from './logic'
import './molar-mass.css'

const BONUS_MAX = 25
const BONUS_FULL = 15
const BONUS_ZERO = 45
const PER_ROUND = 100 + BONUS_MAX

type Status = 'play' | 'won' | 'lost'

export default function MolarMass({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [items] = useState(() => pickItems(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<{ kind: 'good' | 'bad' | 'warn' | 'info'; text: string } | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const collected = useRef<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const f = items[i].formula
  const name = items[i].name
  const bd = breakdown(f)
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 0
  const counts = bd.rows.map((r) => `${r.count}× ${r.symbol}`).join(', ')

  const say = (kind: 'good' | 'bad' | 'warn' | 'info', t: string) => {
    setMsg({ kind, text: t })
    setMsgN((n) => n + 1)
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play') return
    const r = checkMass(text, f)
    if (r.kind === 'invalid') {
      say('info', 'Napiš číslo, třeba 18,02. Desetinná čárka i tečka jsou v pořádku.')
      return
    }
    const t = (Date.now() - start) / 1000
    if (r.kind === 'ok') {
      const p = tries === 0 ? 100 + timeBonus(t, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 50
      scoreRef.current += p
      setScore(scoreRef.current)
      setPts(p)
      setFrozen(t)
      for (const row of bd.rows) if (!collected.current.includes(row.symbol)) collected.current.push(row.symbol)
      setStatus('won')
      say('good', `Správně! M = ${fmtNum(bd.total)} g/mol.${tries === 0 && t <= BONUS_FULL ? ' A ještě k tomu bleskově!' : ''}`)
      jolt.pop()
      return
    }
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      say('bad', `${fmtNum(r.value)} g/mol to není. Zkontroluj počty atomů (${counts}) a zkus to znovu.`)
      inputRef.current?.select()
    } else {
      setFrozen(t)
      setStatus('lost')
      say('warn', `Ani ${fmtNum(r.value)} to není. Správně je ${fmtNum(bd.total)} g/mol – mrkni na rozpis.`)
    }
  }

  const giveUp = () => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('lost')
    say('info', `Nevadí. Takhle se to počítá: M = ${fmtNum(bd.total)} g/mol.`)
  }

  const next = () => {
    if (i + 1 >= items.length) {
      finish({ score: scoreRef.current, max: items.length * PER_ROUND, collected: [...collected.current] })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setText('')
    setMsg(null)
    setPts(0)
    setStart(Date.now())
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'

  return (
    <div className="g-sh-root g-mm">
      <p className="g-sh-instr">
        Spočítej molární hmotnost v g/mol (tolerance ±{fmtNum(TOLERANCE, 1)}, u velkých molekul 0,1 %). Čím rychleji, tím větší bonus.
      </p>
      <Hud
        score={score}
        round={i + 1}
        rounds={items.length}
        roundLabel="Vzorec"
        seconds={secs}
        extra={<LevelChip level={level ?? 'mix'} />}
      />

      <div ref={cardRef} className="card g-mm-card">
        <div className="g-mm-top">
          <div className="g-mm-q">
            <span className="eyebrow">Molární hmotnost</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={i}
                className="g-mm-formula"
                variants={popIn}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              >
                <span className="g-mm-m">M(</span>
                <Md text={`$${f}$`} />
                <span className="g-mm-m">) = ?</span>
                <span className="g-mm-cname" lang="cs">
                  {name}
                </span>
              </motion.span>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={60} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        <div className="g-mm-ar">
          <span className="g-mm-ar-label">Relativní atomové hmotnosti</span>
          <motion.ul key={`ar${i}`} className="g-mm-chips" variants={stagger(0.05, 0.15)} initial="hidden" animate="show">
            {bd.rows.map((r) => (
              <motion.li
                key={r.symbol}
                variants={popIn}
                className="g-mm-chip"
                style={{ ['--mm-cat' as string]: categoryVar(BY_SYMBOL[r.symbol].category) }}
                title={BY_SYMBOL[r.symbol].name}
              >
                <b>{r.symbol}</b>
                <span className="mono">{fmtNum(r.ar, r.ar < 10 ? 3 : 2)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {status === 'play' && (
          <div className="g-mm-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-mm-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {status === 'play' ? (
        <form className="g-mm-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="g-mm-input">
            Molární hmotnost v g/mol
          </label>
          <div className="g-mm-field">
            <input
              id="g-mm-input"
              ref={inputRef}
              className="g-sh-input g-mm-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoFocus
              placeholder="např. 18,02"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <span className="g-mm-unit">g/mol</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </form>
      ) : null}

      <div className="g-mm-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {status !== 'play' && (
        <motion.div className="card-flat g-mm-break" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <table className="g-mm-table">
            <caption>
              Rozpis pro <Md text={`$${f}$`} /> ({name})
            </caption>
            <thead>
              <tr>
                <th scope="col">Prvek</th>
                <th scope="col">Počet</th>
                <th scope="col">
                  A<sub>r</sub>
                </th>
                <th scope="col">Počet × A<sub>r</sub></th>
              </tr>
            </thead>
            <motion.tbody variants={stagger(0.08, 0.1)} initial="hidden" animate="show">
              {bd.rows.map((r) => (
                <motion.tr key={r.symbol} variants={rise}>
                  <th scope="row">
                    <span className="g-mm-el">
                      <span className="g-mm-sym" style={{ background: categoryVar(BY_SYMBOL[r.symbol].category) }}>
                        {r.symbol}
                      </span>
                      <span className="g-mm-name">{BY_SYMBOL[r.symbol].name}</span>
                    </span>
                  </th>
                  <td className="mono">{r.count}</td>
                  <td className="mono">{fmtNum(r.ar, 3)}</td>
                  <td className="mono">{fmtNum(r.subtotal, 2)}</td>
                </motion.tr>
              ))}
              <motion.tr variants={rise} className="g-mm-total">
                <th scope="row" colSpan={3}>
                  M
                </th>
                <td className="mono">
                  <b>{fmtNum(bd.total, 2)}</b> g/mol
                </td>
              </motion.tr>
            </motion.tbody>
          </table>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= items.length ? 'Dokončit' : 'Další vzorec'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
