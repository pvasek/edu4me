import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, type Variants } from 'motion/react'
import type { GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, shake, slide, spring } from '../../ui/motion'
import { parseFormula } from '../../courses/chemie/data/formula'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce } from '../shared/hooks'
import { levelNumber, shuffle } from '../shared/util'
import { normalizeFormula } from '../shared/nomenclature'
import { CAT_LABEL, buildQuestions, weightsFor, type Question } from './questions'
import './naming.css'

const BASE = 10
const bonusFor = (streak: number) => Math.min(Math.max(streak - 1, 0), 3) * 2
const DECOYS = ['C', 'N', 'S', 'P', 'K', 'Na', 'Ca', 'Cl', 'Co', 'Cu', 'Si', 'Mn', 'Mg', 'Fe', 'O', 'H']

type Verdict = 'correct' | 'partial' | 'case' | 'wrong'
interface Result {
  verdict: Verdict
  points: number
  choice?: string
  typed?: string
}

const optVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, x: 0, scale: 1, transition: { ...spring.snappy, delay: 0.1 + i * 0.05 } }),
  correct: { opacity: 1, y: 0, scale: bump.scale, transition: bump.transition },
  wrong: { opacity: 1, y: 0, x: shake.x, transition: shake.transition },
  dim: { opacity: 0.45, y: 0, scale: 0.98, transition: { duration: 0.2 } },
}

function sameAtoms(a: string, b: string) {
  try {
    const x = parseFormula(a)
    const y = parseFormula(b)
    const keys = new Set([...Object.keys(x), ...Object.keys(y)])
    return [...keys].every((k) => x[k] === y[k])
  } catch {
    return false
  }
}

function judge(typed: string, formula: string): Verdict {
  const t = normalizeFormula(typed)
  if (t === formula) return 'correct'
  if (t.toLowerCase() === formula.toLowerCase()) return 'case'
  if (sameAtoms(t, formula)) return 'partial'
  return 'wrong'
}

/** Symbols in a formula, in order of appearance. */
const symbolsOf = (f: string) => [...new Set(f.match(/[A-Z][a-z]?/g) ?? [])]

export default function Naming({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId, 7)
  const [questions] = useState(() => buildQuestions(level))
  const withHydrates = 'hydrate' in weightsFor(level)
  const maxScore = useMemo(() => questions.reduce((s, _, i) => s + BASE + bonusFor(i + 1), 0), [questions])
  const finish = useFinishOnce(onFinish)

  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [collected] = useState(() => new Set<string>())
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>(null)

  const q: Question = questions[idx]
  const item = q.item
  const last = idx === questions.length - 1

  const chips = useMemo(() => {
    const own = symbolsOf(item.formula)
    const decoys = shuffle(DECOYS.filter((d) => !own.includes(d))).slice(0, 2)
    return shuffle([...own, ...decoys])
  }, [item])

  const settle = useCallback(
    (verdict: Verdict, extra: Partial<Result>) => {
      const ok = verdict === 'correct' || verdict === 'partial'
      const s = verdict === 'correct' ? streak + 1 : verdict === 'partial' ? streak : 0
      const points = verdict === 'correct' ? BASE + bonusFor(s) : verdict === 'partial' ? BASE / 2 : 0
      setStreak(s)
      setScore((x) => x + points)
      setResult({ verdict, points, ...extra })
      if (ok) for (const el of symbolsOf(item.formula)) collected.add(el)
      if (scope.current) {
        if (verdict === 'correct') animate(scope.current, { scale: bump.scale }, bump.transition)
        else if (verdict !== 'partial') animate(scope.current, { x: shake.x }, shake.transition)
      }
    },
    [streak, item, collected, animate, scope],
  )

  const choose = useCallback(
    (name: string) => {
      if (result) return
      settle(name === item.name ? 'correct' : 'wrong', { choice: name })
    },
    [result, item, settle],
  )

  function submitFormula() {
    if (result || !input.trim()) return
    settle(judge(input, item.formula), { typed: normalizeFormula(input) })
  }

  function press(token: string) {
    if (result) return
    if (token === '⌫') {
      setInput((v) => v.replace(/([A-Z][a-z]?|.)$/, ''))
      return
    }
    setInput((v) => (v + token).slice(0, 24))
  }

  function next() {
    if (last) {
      finish({ score, max: maxScore, collected: [...collected] })
      return
    }
    setIdx((i) => i + 1)
    setInput('')
    setResult(null)
  }

  // Keys 1–4 for multiple choice.
  useEffect(() => {
    if (result || q.dir !== 'toName') return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= q.options.length) {
        e.preventDefault()
        choose(q.options[n - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [q, result, choose])

  const ok = result && (result.verdict === 'correct' || result.verdict === 'partial')
  const mood: Mood = !result ? 'think' : result.verdict === 'correct' ? (streak >= 3 ? 'cheer' : 'happy') : ok ? 'wow' : 'sad'
  const formulaMarkup = item.display ?? `$${item.formula}$`

  return (
    <div className="g-nm">
      <p className="g-nm-instr">Převáděj vzorce na názvy a zpátky. Vzorce piš přesně – záleží na velkých a malých písmenech.</p>
      <Hud
        score={score}
        round={idx + 1}
        rounds={questions.length}
        roundLabel="Otázka"
        extra={
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span className="chip g-nm-streak" key="streak" variants={popIn} initial="hidden" animate="show" exit="hidden">
                <Icon name="flame" /> série {streak}×
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div ref={scope} className="card g-nm-stage">
        <AnimatePresence mode="wait" custom={1} initial={false}>
          <motion.div key={idx} className="g-nm-q" custom={1} variants={slide} initial="enter" animate="center" exit="exit">
            <div className="g-nm-head">
              <div className="g-nm-head-text">
                <span className="eyebrow">{CAT_LABEL[item.cat]}</span>
                <span className="g-nm-dir">
                  {q.dir === 'toName' ? (
                    <>
                      vzorec <Icon name="arrowRight" /> název
                    </>
                  ) : (
                    <>
                      název <Icon name="arrowRight" /> vzorec
                    </>
                  )}
                </span>
              </div>
              <motion.div key={mood} initial={{ scale: 0.75, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>
                <Mascot mood={mood} size={50} />
              </motion.div>
              {result && <PointsPop key={idx} points={result.points} />}
            </div>
            <motion.div
              className={q.dir === 'toName' ? 'g-nm-prompt-formula' : 'g-nm-prompt-name'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring.bouncy, delay: 0.1 }}
            >
              {q.dir === 'toName' ? <Md text={formulaMarkup} /> : item.name}
            </motion.div>
            <p className="g-nm-ask">{q.dir === 'toName' ? 'Jak se to jmenuje?' : 'Jaký je vzorec?'}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {q.dir === 'toName' ? (
        <div className="g-nm-opts" role="group" aria-label="Možnosti">
          {q.options.map((o, i) => {
            const isAnswer = o === item.name
            const isChoice = result?.choice === o
            const state = !result ? 'show' : isAnswer ? 'correct' : isChoice ? 'wrong' : 'dim'
            return (
              <motion.button
                key={`${idx}-${o}`}
                type="button"
                className={`g-nm-opt is-${state}`}
                onClick={() => choose(o)}
                disabled={!!result}
                aria-keyshortcuts={String(i + 1)}
                custom={i}
                variants={optVariants}
                initial="hidden"
                animate={state}
              >
                <span className="g-nm-key" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="g-nm-opt-label">{o}</span>
                <AnimatePresence>
                  {result && (isAnswer || isChoice) && (
                    <motion.span className="g-nm-opt-icon" variants={popIn} initial="hidden" animate="show">
                      <Icon name={isAnswer ? 'check' : 'x'} />
                      <span className="sr-only">{isAnswer ? 'správně' : 'tvoje volba, špatně'}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      ) : (
        <motion.div className="g-nm-build" key={`build-${idx}`} variants={fadeUp} initial="hidden" animate="show">
          <div className={`g-nm-preview${result ? (ok ? ' is-good' : ' is-bad') : ''}`} aria-hidden="true">
            {input.trim() ? (
              <motion.span key={input} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={spring.snappy}>
                <Md text={`$${normalizeFormula(input)}$`} />
              </motion.span>
            ) : (
              <span className="g-nm-preview-empty">tvůj vzorec</span>
            )}
            {result && (
              <span className="g-nm-preview-icon">
                <Icon name={ok ? 'check' : 'x'} />
              </span>
            )}
          </div>
          <form
            className="g-nm-inputrow"
            onSubmit={(e) => {
              e.preventDefault()
              submitFormula()
            }}
          >
            <label className="sr-only" htmlFor="g-nm-input">
              Vzorec pro {item.name}
            </label>
            <input
              id="g-nm-input"
              ref={inputRef}
              className="g-sh-input g-nm-input"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 24))}
              placeholder="napiš, nebo skládej z dílků"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              readOnly={!!result}
            />
            <button type="submit" className="btn btn-primary" disabled={!!result || !input.trim()}>
              <Icon name="check" /> <span className="g-nm-hide-xs">Zkontrolovat</span>
            </button>
          </form>
          {!result && (
            <div className="g-nm-pad" role="group" aria-label="Dílky vzorce">
              <div className="g-nm-pad-row g-nm-pad-sym">
                {chips.map((c) => (
                  <Chip key={c} label={c} onPress={press} kind="sym" />
                ))}
              </div>
              <div className="g-nm-pad-row g-nm-pad-num">
                {['2', '3', '4', '5', '6', '7', '8', '9', '1', '0'].map((c) => (
                  <Chip key={c} label={c} onPress={press} kind="num" />
                ))}
              </div>
              <div className="g-nm-pad-row g-nm-pad-misc">
                <Chip label="(" onPress={press} kind="misc" />
                <Chip label=")" onPress={press} kind="misc" />
                {withHydrates && <Chip label="·" onPress={press} kind="misc" aria="tečka pro hydrát" />}
                <Chip label="⌫" onPress={press} kind="del" aria="smazat poslední" />
              </div>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {result && (
          <motion.div key={idx} className="g-nm-after" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <Feedback kind={result.verdict === 'correct' ? 'good' : result.verdict === 'partial' ? 'warn' : 'bad'}>
              <Explain q={q} result={result} />
            </Feedback>
            <div className="g-nm-actions">
              <motion.button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus variants={popIn} initial="hidden" animate="show">
                {last ? 'Dokončit' : 'Další'} <Icon name="arrowRight" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Chip({ label, onPress, kind, aria }: { label: string; onPress: (t: string) => void; kind: string; aria?: string }) {
  return (
    <motion.button
      type="button"
      className={`g-nm-chip is-${kind}`}
      onClick={() => onPress(label)}
      aria-label={aria ?? label}
      whileTap={{ scale: 0.86, y: 2 }}
      transition={spring.snappy}
    >
      {label}
    </motion.button>
  )
}

function Explain({ q, result }: { q: Question; result: Result }) {
  const item = q.item
  const f = item.display ?? `$${item.formula}$`
  let head: string
  switch (result.verdict) {
    case 'correct':
      head = `**Správně!** ${f} = ${item.name}.`
      break
    case 'partial':
      head = `**Atomy sedí**, ale píše se to ${f} (${item.name}). Za to půl bodů.`
      break
    case 'case':
      head = `**Pozor na velká a malá písmena!** Správně je ${f}. Třeba $Co$ je kobalt, ale $CO$ je oxid uhelnatý.`
      break
    default:
      head = q.dir === 'toName' ? `**Správně je: ${item.name}.**` : `**Správný vzorec je ${f}.**`
  }
  return (
    <div className="g-nm-explain">
      <p>
        <Md text={head} />
      </p>
      <p className="g-nm-explain-alt">
        <Md text={item.explain} />
      </p>
    </div>
  )
}
