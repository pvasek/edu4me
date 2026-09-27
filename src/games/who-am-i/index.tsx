import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { BY_SYMBOL, categoryVar } from '../../courses/chemie/data/elements'
import { Md } from '../../core/markup'
import { ElementTile } from '../../ui/ElementTile'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, rise, shake, spring, stagger } from '../../ui/motion'
import { Bump, Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt } from '../shared/hooks'
import { pickLevel } from '../shared/util'
import { levelNum, type GameProps } from '../types'
import { LEVELS } from './levels'
import { POINTS, answerOptions, matchAnswer, pickSubjects, roundPoints, subjectAnswer, suggestAnswers, type Answer } from './logic'
import './who-am-i.css'

const ROUNDS = 5
type Status = 'play' | 'won' | 'lost'
type Mode = 'type' | 'tiles'

/** "sodík (Na)" / "ethanol ($C2H5OH$)" in <Md> markup. */
const label = (a: Answer) => (a.symbol ? `${a.name.toLowerCase()} ($${a.symbol}$)` : a.formula ? `${a.name} (${a.formula})` : a.name)

/** Option card / reveal card for a compound: name and formula. */
function CompoundCard({ a, dim = false, onClick }: { a: Answer; dim?: boolean; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag type={onClick ? 'button' : undefined} className={`g-wa-cmp${dim ? ' is-dim' : ''}`} onClick={onClick} aria-label={a.name}>
      <span className="g-wa-cmp-name">{a.name}</span>
      {a.formula && (
        <span className="g-wa-cmp-formula">
          <Md text={a.formula} />
        </span>
      )}
    </Tag>
  )
}

export default function WhoAmI({ levelId, onFinish }: GameProps) {
  const level = pickLevel(LEVELS, levelNum(levelId))
  const [rounds] = useState(() => pickSubjects(level, ROUNDS))
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(1)
  const [mode, setMode] = useState<Mode>(level === 2 ? 'tiles' : 'type')
  const [options, setOptions] = useState(() => answerOptions(rounds[0]))
  const [wrong, setWrong] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('play')
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [msg, setMsg] = useState<{ kind: 'good' | 'bad' | 'warn' | 'info'; text: string } | null>(null)
  const [text, setText] = useState('')
  const [active, setActive] = useState(0)
  const collected = useRef<string[]>([])
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const listId = useId()

  const round = rounds[i]
  const subject = round.subject
  const isEl = subject.kind === 'element'
  const target = subjectAnswer(subject)
  const hints = subject.hints
  const sugg = status === 'play' ? suggestAnswers(text, subject.kind, 6) : []
  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : wrong.length ? 'wow' : 'think'
  const allElements = level !== undefined && level <= 7
  const noun = level === undefined ? 'prvek nebo látku' : allElements ? 'prvek' : 'látku'

  const moreHint = () => {
    if (shown < hints.length) setShown(shown + 1)
  }

  const guess = (a: Answer) => {
    if (status !== 'play') return
    if (a.id === target.id) {
      const p = roundPoints(shown, mode)
      scoreRef.current += p
      setScore(scoreRef.current)
      setPts(p)
      if (a.symbol) collected.current.push(a.symbol)
      setStatus('won')
      const praise = shown === 1 ? 'Na první nápovědu, klobouk dolů.' : `Stačilo ti ${shown} nápověd.`
      setMsg({ kind: 'good', text: isEl ? `Správně, jsem ${label(a)}! ${praise}` : `Správně, je to ${label(a)}! ${praise}` })
      jolt.pop()
      return
    }
    if (wrong.includes(a.id)) {
      setMsg({ kind: 'info', text: `${a.name} už jsi zkoušel(a). Zkus něco jiného.` })
      return
    }
    setWrong([...wrong, a.id])
    jolt.shake()
    setText('')
    const nope = isEl ? `Kdepak, nejsem ${a.name.toLowerCase()}.` : `Kdepak, ${a.name} to není.`
    if (shown < hints.length) {
      setShown(shown + 1)
      setMsg({ kind: 'bad', text: `${nope} Přidávám další nápovědu.` })
    } else {
      setStatus('lost')
      setMsg({ kind: 'warn', text: isEl ? `${nope} Byl jsem ${label(target)}.` : `${nope} Správná odpověď: ${label(target)}.` })
    }
  }

  const submitText = () => {
    const a = sugg[active] ?? matchAnswer(text, subject.kind)
    if (!a) {
      if (text.trim()) {
        setMsg({ kind: 'info', text: isEl ? 'Takový prvek neznám. Vyber ho z nabídky pod políčkem.' : 'Takovou látku neznám. Vyber ji z nabídky pod políčkem.' })
      }
      return
    }
    guess(a)
    setText('')
    setActive(0)
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, Math.max(0, sugg.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submitText()
    } else if (e.key === 'Escape') {
      setText('')
    }
  }

  const next = () => {
    if (i + 1 >= rounds.length) {
      finish({ score: scoreRef.current, max: ROUNDS * POINTS[0], collected: [...collected.current] })
      return
    }
    const ni = i + 1
    setI(ni)
    setShown(1)
    setWrong([])
    setStatus('play')
    setMsg(null)
    setText('')
    setActive(0)
    setPts(0)
    setOptions(answerOptions(rounds[ni]))
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    if (m === 'type') window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const potential = roundPoints(shown, mode)

  return (
    <div className="g-sh-root g-wa">
      <p className="g-sh-instr">Hádej {noun} z nápověd. Čím méně jich potřebuješ, tím víc bodů.</p>
      <Hud
        score={score}
        round={i + 1}
        rounds={ROUNDS}
        roundLabel={level === undefined ? 'Hádanka' : allElements ? 'Prvek' : 'Látka'}
        level={level ?? 'mix'}
      />

      <div ref={cardRef} className="card g-wa-card">
        <div className="g-wa-head">
          <Mascot mood={mood} size={60} />
          <div className="g-wa-head-text">
            <span className="eyebrow">
              Kdo jsem?{level === undefined ? ` · úroveň ${round.level}` : ''}
            </span>
            <span className="g-wa-worth">
              {status === 'play' ? (
                <>
                  Teď za <Bump value={potential} /> b.
                </>
              ) : status === 'won' ? (
                <>Uhodnuto!</>
              ) : (
                <>Tentokrát ne</>
              )}
            </span>
          </div>
          {status !== 'play' && (
            <motion.div
              className="g-wa-reveal"
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={spring.bouncy}
            >
              {target.symbol ? <ElementTile element={BY_SYMBOL[target.symbol]} size="md" /> : <CompoundCard a={target} />}
            </motion.div>
          )}
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        <motion.ol className="g-wa-hints" key={i} variants={stagger(0.07, 0.1)} initial="hidden" animate="show">
          {hints.map((h, k) => {
            const open = k < shown || status !== 'play'
            return (
              <motion.li key={k} className={`g-wa-hint${open ? ' is-open' : ''}`} variants={rise} layout="position">
                <motion.span
                  className="g-wa-num"
                  aria-hidden="true"
                  key={open ? 'o' : 'c'}
                  initial={{ scale: 0.4, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={spring.bouncy}
                >
                  {k + 1}
                </motion.span>
                {open ? (
                  <motion.div
                    className="g-wa-hint-body"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={spring.snappy}
                  >
                    <span className="g-wa-hint-label">{h.label}</span>
                    <span>
                      <Md text={h.text} />
                    </span>
                  </motion.div>
                ) : (
                  <span className="g-wa-locked">
                    <Icon name="lock" /> Nápověda {k + 1} · za {roundPoints(k + 1, mode)} b.
                  </span>
                )}
              </motion.li>
            )
          })}
        </motion.ol>
      </div>

      <div className="g-wa-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={`${i}-${wrong.length}-${status}`}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {status === 'play' ? (
        <div className="g-wa-answer">
          <div className="g-wa-tools">
            <div className="g-sh-seg" role="group" aria-label="Způsob odpovědi">
              <button type="button" aria-pressed={mode === 'type'} onClick={() => switchMode('type')}>
                Napíšu
              </button>
              <button type="button" aria-pressed={mode === 'tiles'} onClick={() => switchMode('tiles')}>
                Vyberu ze 4
              </button>
            </div>
            <button type="button" className="btn btn-sm" onClick={moreHint} disabled={shown >= hints.length}>
              <Icon name="bulb" /> Další nápověda
            </button>
          </div>

          {mode === 'type' ? (
            <div className="g-wa-combo">
              <div className="g-wa-inputrow">
                <input
                  ref={inputRef}
                  className="g-sh-input"
                  type="text"
                  role="combobox"
                  aria-expanded={sugg.length > 0}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={sugg.length ? `${listId}-${active}` : undefined}
                  aria-label={isEl ? 'Název nebo značka prvku' : 'Název látky'}
                  placeholder={isEl ? 'Napiš název nebo značku…' : 'Napiš název látky…'}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setActive(0)
                  }}
                  onKeyDown={onKey}
                />
                <button type="button" className="btn btn-primary" onClick={submitText} disabled={!text.trim()}>
                  Tipnout
                </button>
              </div>
              {sugg.length > 0 && (
                <motion.ul
                  className="g-wa-sugg"
                  role="listbox"
                  id={listId}
                  aria-label="Návrhy"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring.snappy}
                >
                  {sugg.map((a, k) => {
                    const tried = wrong.includes(a.id)
                    return (
                      <li
                        key={a.id}
                        id={`${listId}-${k}`}
                        role="option"
                        aria-selected={k === active}
                        className={`g-wa-opt${k === active ? ' is-active' : ''}${tried ? ' is-wrong' : ''}`}
                        onPointerDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          guess(a)
                          setText('')
                          setActive(0)
                        }}
                      >
                        {a.symbol ? (
                          <span className="g-wa-optsym" style={{ background: categoryVar(BY_SYMBOL[a.symbol].category) }}>
                            {a.symbol}
                          </span>
                        ) : null}
                        <span>{a.name}</span>
                        {!a.symbol && a.formula && (
                          <span className="g-wa-optformula">
                            <Md text={a.formula} />
                          </span>
                        )}
                        {tried && (
                          <span className="g-wa-opttag">
                            <Icon name="x" /> zkoušeno
                          </span>
                        )}
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </div>
          ) : (
            <motion.div
              className={`g-wa-tiles${isEl ? '' : ' g-wa-tiles-cmp'}`}
              role="group"
              aria-label={isEl ? 'Vyber prvek' : 'Vyber látku'}
              key={`t${i}`}
              variants={stagger(0.06, 0.05)}
              initial="hidden"
              animate="show"
            >
              {options.map((a) => {
                const bad = wrong.includes(a.id)
                return (
                  <motion.div key={a.id} variants={popIn}>
                    <motion.div
                      className={`g-wa-tile${bad ? ' is-wrong' : ''}`}
                      animate={bad ? { x: shake.x } : { x: 0 }}
                      transition={shake.transition}
                      whileTap={bad ? undefined : { scale: 0.95 }}
                    >
                      {a.symbol ? (
                        <ElementTile element={BY_SYMBOL[a.symbol]} size="md" dim={bad} onClick={bad ? undefined : () => guess(a)} />
                      ) : (
                        <CompoundCard a={a} dim={bad} onClick={bad ? undefined : () => guess(a)} />
                      )}
                      {bad && (
                        <motion.span
                          className="g-wa-tilex"
                          aria-label="špatně"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={spring.bouncy}
                        >
                          <Icon name="x" />
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {i + 1 >= rounds.length ? 'Dokončit' : 'Další hádanka'}
            <Icon name="arrowRight" />
          </button>
        </div>
      )}
    </div>
  )
}
