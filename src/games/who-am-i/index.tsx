import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { categoryVar, type ChemElement } from '../../courses/chemie/data/elements'
import { ElementTile } from '../../ui/ElementTile'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, rise, shake, spring, stagger } from '../../ui/motion'
import { Bump, Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt } from '../shared/hooks'
import { levelNumber } from '../shared/util'
import type { GameProps } from '../types'
import { POINTS, hintsFor, matchElement, pickTargets, roundPoints, suggest, tileOptions } from './logic'
import './who-am-i.css'

const ROUNDS = 5
type Status = 'play' | 'won' | 'lost'
type Mode = 'type' | 'tiles'

export default function WhoAmI({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId)
  const [targets] = useState(() => pickTargets(level, ROUNDS))
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(1)
  const [mode, setMode] = useState<Mode>(level <= 2 ? 'tiles' : 'type')
  const [options, setOptions] = useState(() => tileOptions(targets[0], level))
  const [wrong, setWrong] = useState<number[]>([])
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

  const target = targets[i]
  const hints = hintsFor(target)
  const sugg = status === 'play' ? suggest(text, 6) : []
  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : wrong.length ? 'wow' : 'think'

  const moreHint = () => {
    if (shown < hints.length) setShown(shown + 1)
  }

  const guess = (el: ChemElement) => {
    if (status !== 'play') return
    if (el.z === target.z) {
      const p = roundPoints(shown, mode)
      scoreRef.current += p
      setScore(scoreRef.current)
      setPts(p)
      collected.current.push(el.symbol)
      setStatus('won')
      setMsg({
        kind: 'good',
        text: `Správně, jsem ${el.name.toLowerCase()} (${el.symbol})! ${shown === 1 ? 'Na první nápovědu, klobouk dolů.' : `Stačilo ti ${shown} nápověd.`}`,
      })
      jolt.pop()
      return
    }
    if (wrong.includes(el.z)) {
      setMsg({ kind: 'info', text: `${el.name} už jsi zkoušel(a). Zkus jiný prvek.` })
      return
    }
    setWrong([...wrong, el.z])
    jolt.shake()
    setText('')
    if (shown < hints.length) {
      setShown(shown + 1)
      setMsg({ kind: 'bad', text: `Kdepak, nejsem ${el.name.toLowerCase()}. Přidávám další nápovědu.` })
    } else {
      setStatus('lost')
      setMsg({ kind: 'warn', text: `Nejsem ${el.name.toLowerCase()}. Byl jsem ${target.name.toLowerCase()} (${target.symbol}).` })
    }
  }

  const submitText = () => {
    const el = sugg[active] ?? matchElement(text)
    if (!el) {
      if (text.trim()) setMsg({ kind: 'info', text: 'Takový prvek neznám. Vyber ho z nabídky pod políčkem.' })
      return
    }
    guess(el)
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
    if (i + 1 >= targets.length) {
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
    setOptions(tileOptions(targets[ni], level))
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    if (m === 'type') window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const potential = roundPoints(shown, mode)

  return (
    <div className="g-sh-root g-wa">
      <p className="g-sh-instr">Hádej prvek z nápověd. Čím méně jich potřebuješ, tím víc bodů.</p>
      <Hud score={score} round={i + 1} rounds={ROUNDS} roundLabel="Prvek" />

      <div ref={cardRef} className="card g-wa-card">
        <div className="g-wa-head">
          <Mascot mood={mood} size={60} />
          <div className="g-wa-head-text">
            <span className="eyebrow">Kdo jsem?</span>
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
              <ElementTile element={target} size="md" />
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
                    <span>{h.text}</span>
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
            {msg.text}
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
                  aria-label="Název nebo značka prvku"
                  placeholder="Napiš název nebo značku…"
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
                  {sugg.map((e, k) => (
                    <li
                      key={e.z}
                      id={`${listId}-${k}`}
                      role="option"
                      aria-selected={k === active}
                      className={`g-wa-opt${k === active ? ' is-active' : ''}${wrong.includes(e.z) ? ' is-wrong' : ''}`}
                      onPointerDown={(ev) => ev.preventDefault()}
                      onClick={() => {
                        guess(e)
                        setText('')
                        setActive(0)
                      }}
                    >
                      <span className="g-wa-optsym" style={{ background: categoryVar(e.category) }}>
                        {e.symbol}
                      </span>
                      <span>{e.name}</span>
                      {wrong.includes(e.z) && (
                        <span className="g-wa-opttag">
                          <Icon name="x" /> zkoušeno
                        </span>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          ) : (
            <motion.div
              className="g-wa-tiles"
              role="group"
              aria-label="Vyber prvek"
              key={`t${i}`}
              variants={stagger(0.06, 0.05)}
              initial="hidden"
              animate="show"
            >
              {options.map((e) => {
                const bad = wrong.includes(e.z)
                return (
                  <motion.div key={e.z} variants={popIn}>
                    <motion.div
                      className={`g-wa-tile${bad ? ' is-wrong' : ''}`}
                      animate={bad ? { x: shake.x } : { x: 0 }}
                      transition={shake.transition}
                      whileTap={bad ? undefined : { scale: 0.95 }}
                    >
                      <ElementTile element={e} size="md" dim={bad} onClick={bad ? undefined : () => guess(e)} />
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
            {i + 1 >= targets.length ? 'Dokončit' : 'Další prvek'}
            <Icon name="arrowRight" />
          </button>
        </div>
      )}
    </div>
  )
}
