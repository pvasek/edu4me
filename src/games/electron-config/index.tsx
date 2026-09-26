import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BY_Z, categoryVar } from '../../courses/chemie/data/elements'
import { configMarkup, electronConfig, shorthandMarkup } from '../../courses/chemie/data/electronConfig'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { rise, shake, spring, stagger } from '../../ui/motion'
import { Bump, Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt } from '../shared/hooks'
import { levelNumber } from '../shared/util'
import type { GameProps } from '../types'
import {
  ecPoints,
  emptyFilling,
  fillingMarkup,
  keyOf,
  pickTargets,
  solution,
  tapOrbital,
  totalOf,
  validateFilling,
  type Filling,
  type Orbital,
  type Verdict,
} from './logic'
import './electron-config.css'

const ARROW: Record<string, string> = { u: '↑', d: '↓' }

function boxLabel(key: string, idx: number, o: Orbital) {
  const what = o.length === 0 ? 'prázdný' : o.length === 1 ? `1 elektron ${ARROW[o[0]]}` : `2 elektrony ${o.map((s) => ARROW[s]).join('')}`
  return `Orbital ${key}, ${idx + 1}. políčko: ${what}`
}

export default function ElectronConfig({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId)
  const [targets] = useState(() => pickTargets(level))
  const [i, setI] = useState(0)
  const [fill, setFill] = useState<Filling>(() => emptyFilling(targets[0].z))
  const [attempt, setAttempt] = useState(1)
  const [status, setStatus] = useState<'play' | 'won' | 'lost'>('play')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [last, setLast] = useState<string | null>(null)
  const scoreRef = useRef(0)
  const collected = useRef<string[]>([])
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const [checks, setChecks] = useState(0)

  const target = targets[i]
  const el = BY_Z[target.z]
  const total = totalOf(fill)
  const maxScore = targets.reduce((a, t) => a + ecPoints(1, t.bonus), 0)

  const tap = (si: number, oi: number) => {
    if (status !== 'play') return
    setFill((f) =>
      f.map((s, a) => (a !== si ? s : { ...s, orbitals: s.orbitals.map((o, b) => (b === oi ? tapOrbital(o) : o)) })),
    )
    setLast(`${si}-${oi}`)
    if (verdict) setVerdict(null)
  }

  const check = () => {
    const v = validateFilling(target.z, fill)
    setVerdict(v)
    setChecks((c) => c + 1)
    if (v.ok) {
      const p = ecPoints(attempt, target.bonus)
      scoreRef.current += p
      setScore(scoreRef.current)
      setPts(p)
      collected.current.push(el.symbol)
      setStatus('won')
      jolt.pop()
      return
    }
    jolt.shake()
    // a missing electron is not a real attempt
    if (v.rule === 'count' && total < target.z) return
    if (attempt >= 3) setStatus('lost')
    else setAttempt(attempt + 1)
  }

  const next = () => {
    if (i + 1 >= targets.length) {
      finish({ score: scoreRef.current, max: maxScore, collected: [...collected.current] })
      return
    }
    const ni = i + 1
    setI(ni)
    setFill(emptyFilling(targets[ni].z))
    setAttempt(1)
    setStatus('play')
    setVerdict(null)
    setPts(0)
    setLast(null)
  }

  const bad = verdict && !verdict.ok ? verdict.where : undefined
  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : verdict && !verdict.ok ? 'think' : total === target.z ? 'wow' : 'happy'
  const live = fillingMarkup(fill)

  return (
    <div className="g-sh-root g-ec">
      <p className="g-sh-instr">Ťukej na políčka orbitalů: 1× přidá ↑, 2× doplní ↓, 3× vyprázdní. Dodrž výstavbový princip, Pauliho princip a Hundovo pravidlo.</p>
      <Hud score={score} round={i + 1} rounds={targets.length} roundLabel="Prvek" />

      <div ref={cardRef} className="card g-sh-prompt g-ec-task">
        <motion.span
          key={i}
          className="g-ec-tile"
          style={{ background: categoryVar(el.category) }}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.5, rotate: -14 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={spring.bouncy}
        >
          <span className="g-ec-tile-z">{el.z}</span>
          <span className="g-ec-tile-sym">{el.symbol}</span>
        </motion.span>
        <div className="g-sh-prompt-body">
          <span className="eyebrow">
            Zaplň orbitaly{target.bonus ? ' · bonus ×1,5' : ''}
          </span>
          <span className="g-ec-name">{el.name}</span>
          <span className="g-ec-sub">
            Z = {el.z}, tedy <b>{el.z}</b> {el.z <= 4 ? 'elektrony' : 'elektronů'}
          </span>
        </div>
        <Mascot mood={mood} size={56} />
        {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
      </div>

      {target.bonus && status === 'play' && attempt === 1 && (
        <p className="note g-ec-bonusnote">Bonus: tenhle prvek má zradu. Přemýšlej o stabilitě podslupky 3d!</p>
      )}

      <div className="g-ec-board">
        <div className="g-ec-meter" aria-live="polite">
          <span className={`chip g-ec-count${total === el.z ? ' is-full' : total > el.z ? ' is-over' : ''}`}>
            <Icon name="atom" /> Umístěno <Bump value={total} />/{el.z}
          </span>
          <span className="g-ec-live">{live ? <Md text={`$${live}$`} /> : <span className="muted">zatím prázdné</span>}</span>
        </div>

        <motion.div
          className="g-ec-diagram"
          role="group"
          aria-label={`Orbitalový diagram pro ${el.name}`}
          key={`d${i}`}
          variants={stagger(0.06, 0.1)}
          initial="hidden"
          animate="show"
        >
          <span className="g-ec-energy" aria-hidden="true">
            ↓ energie roste směrem dolů
          </span>
          {fill.map((s, si) => {
            const key = keyOf(s)
            return (
              <motion.div key={key} variants={rise}>
              <motion.div
                className={`g-ec-row g-ec-l-${s.l}${bad === key ? ' is-bad' : ''}`}
                animate={bad === key ? { x: shake.x } : { x: 0 }}
                transition={shake.transition}
              >
                <span className="g-ec-label">
                  {s.n}
                  <i>{s.l}</i>
                </span>
                <div className="g-ec-boxes">
                  {s.orbitals.map((o, oi) => (
                    <button
                      key={oi}
                      type="button"
                      className={`g-ec-box g-ec-n${o.length}${last === `${si}-${oi}` ? ' is-last' : ''}`}
                      aria-label={boxLabel(key, oi, o)}
                      aria-disabled={status !== 'play' || undefined}
                      onClick={() => tap(si, oi)}
                    >
                      {o.map((sp, k) => (
                        <motion.span
                          key={`${k}${sp}`}
                          className={`g-ec-arrow g-ec-${sp}`}
                          aria-hidden="true"
                          initial={{ opacity: 0, y: sp === 'u' ? 12 : -12, scale: 0.4 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={spring.bouncy}
                        >
                          {ARROW[sp]}
                        </motion.span>
                      ))}
                    </button>
                  ))}
                </div>
                {bad === key && (
                  <motion.span className="g-ec-flag" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={spring.snappy}>
                    <Icon name="alert" /> tady
                  </motion.span>
                )}
              </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="g-ec-bottom" aria-live="polite">
        {verdict && !verdict.ok && (
          <Feedback kind={status === 'lost' ? 'warn' : verdict.rule === 'count' ? 'info' : 'bad'} key={`${i}-${checks}`}>
            <Md text={verdict.message} />
            {status === 'lost' && <p className="g-ec-sol">Tři pokusy jsou pryč. Mrkni na správné řešení.</p>}
          </Feedback>
        )}
        {status === 'won' && (
          <Feedback kind="good">
            <span>
              Správně! {el.name}: <Md text={`$${configMarkup(electronConfig(el.z))}$`} />
              <span className="g-ec-short">
                {' '}
                zkráceně <Md text={`$${shorthandMarkup(el.z)}$`} />
              </span>
            </span>
          </Feedback>
        )}
        <div className="g-sh-actions">
          {status === 'play' && (
            <>
              <button type="button" className="btn btn-primary btn-lg" onClick={check}>
                <Icon name="check" /> Zkontrolovat
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setFill(emptyFilling(target.z))
                  setVerdict(null)
                }}
              >
                <Icon name="refresh" /> Vymazat
              </button>
            </>
          )}
          {status === 'lost' && (
            <button type="button" className="btn" onClick={() => setFill(solution(target.z))}>
              <Icon name="bulb" /> Ukázat řešení
            </button>
          )}
          {status !== 'play' && (
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= targets.length ? 'Dokončit' : 'Další prvek'} <Icon name="arrowRight" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
