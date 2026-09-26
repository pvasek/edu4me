import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate as animateValue, motion, useAnimate, useMotionValue, type Variants } from 'motion/react'
import type { GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, shake, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useNow } from '../shared/hooks'
import { levelNumber, shuffle, timeBonus } from '../shared/util'
import { CLASSES, CONFUSE, ITEMS, labelOf, type ClassId, type FgItem } from './data'
import './functional-groups.css'

const ROUND_S = 20
const BASE = 10
const BONUS = 5

interface Round {
  item: FgItem
  options: string[]
}

type Result = { choice: string | null; correct: boolean; points: number }

function buildRounds(level: number): Round[] {
  const withBio = level >= 9
  const byKind = (k: FgItem['kind']) => shuffle(ITEMS.filter((i) => i.kind === k))
  const plan: [FgItem['kind'], number][] = withBio
    ? [
        ['fragment', 3],
        ['example', 3],
        ['bio', 4],
      ]
    : [
        ['fragment', 4],
        ['example', 6],
      ]
  const perAnswer = new Map<string, number>()
  const chosen: FgItem[] = []
  for (const [kind, n] of plan) {
    let taken = 0
    for (const item of byKind(kind)) {
      if (taken === n) break
      const c = perAnswer.get(item.answer) ?? 0
      if (c >= 2) continue
      perAnswer.set(item.answer, c + 1)
      chosen.push(item)
      taken++
    }
  }
  // Start with a fragment (the "rule"), then mix the rest.
  const [first, ...rest] = chosen
  return [first, ...shuffle(rest)].map((item) => ({ item, options: optionsFor(item) }))
}

function optionsFor(item: FgItem): string[] {
  if (item.options) return shuffle(item.options)
  const answer = item.answer as ClassId
  const banned = new Set<string>([answer, ...(item.exclude ?? [])])
  const pool = [
    ...shuffle(CONFUSE[answer]),
    ...shuffle((Object.keys(CLASSES) as ClassId[]).filter((c) => !CONFUSE[answer].includes(c))),
  ]
  const wrong: string[] = []
  for (const c of pool) {
    if (wrong.length === 3) break
    if (!banned.has(c) && !wrong.includes(c)) wrong.push(c)
  }
  return shuffle([answer, ...wrong])
}

const optVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, x: 0, scale: 1, transition: { ...spring.snappy, delay: 0.08 + i * 0.05 } }),
  correct: { opacity: 1, y: 0, scale: bump.scale, transition: bump.transition },
  wrong: { opacity: 1, y: 0, x: shake.x, transition: shake.transition },
  dim: { opacity: 0.45, y: 0, scale: 0.98, transition: { duration: 0.2 } },
}

export default function FunctionalGroups({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId, 8)
  const [rounds] = useState(() => buildRounds(level))
  const finish = useFinishOnce(onFinish)
  const [idx, setIdx] = useState(0)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [result, setResult] = useState<Result | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const answeredRef = useRef(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const timeLeft = useMotionValue(1)
  const timerCtl = useRef<{ stop: () => void } | null>(null)

  const round = rounds[idx]
  const item = round.item
  const asking = result === null
  const now = useNow(asking, 250)
  const elapsed = asking ? Math.max(0, Math.min(ROUND_S, (now - startedAt) / 1000)) : 0
  const last = idx === rounds.length - 1

  const answer = useCallback(
    (choice: string | null) => {
      if (answeredRef.current) return
      answeredRef.current = true
      timerCtl.current?.stop()
      const secs = (Date.now() - startedAt) / 1000
      const correct = choice === round.item.answer
      const points = correct ? BASE + timeBonus(secs, BONUS, 4, ROUND_S) : 0
      setResult({ choice, correct, points })
      setScore((s) => s + points)
      setStreak((s) => (correct ? s + 1 : 0))
      if (scope.current) {
        if (correct) animate(scope.current, { scale: bump.scale }, bump.transition)
        else animate(scope.current, { x: shake.x }, shake.transition)
      }
    },
    [round, startedAt, animate, scope],
  )

  // Draining timer bar + time-out.
  useEffect(() => {
    if (!asking) return
    const left = Math.max(0, ROUND_S * 1000 - (Date.now() - startedAt))
    timeLeft.set(left / (ROUND_S * 1000))
    timerCtl.current = animateValue(timeLeft, 0, { duration: left / 1000, ease: 'linear' })
    const id = window.setTimeout(() => answer(null), left)
    return () => {
      window.clearTimeout(id)
      timerCtl.current?.stop()
    }
  }, [asking, startedAt, answer, timeLeft])

  // Keys 1–4 pick an option.
  useEffect(() => {
    if (!asking) return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= round.options.length) {
        e.preventDefault()
        answer(round.options[n - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [asking, round, answer])

  function next() {
    if (last) {
      finish({ score, max: rounds.length * (BASE + BONUS) })
      return
    }
    answeredRef.current = false
    setIdx((i) => i + 1)
    setResult(null)
    setStartedAt(Date.now())
  }

  const mood: Mood = !result
    ? 'think'
    : result.choice === null
      ? 'sleep'
      : result.correct
        ? result.points >= BASE + BONUS - 1
          ? 'cheer'
          : 'happy'
        : 'sad'

  const combo = !!item.options
  const question =
    item.kind === 'fragment'
      ? 'Která třída sloučenin má tuto skupinu?'
      : combo
        ? 'Které funkční skupiny molekula obsahuje?'
        : item.kind === 'bio'
          ? 'Do které třídy tahle část biomolekuly patří?'
          : 'Do které třídy látka patří?'
  const remaining = ROUND_S - elapsed
  const urgency = remaining > 12 ? 'is-calm' : remaining > 6 ? 'is-hurry' : 'is-urgent'

  return (
    <div className="g-fg">
      <p className="g-fg-instr">Poznej funkční skupinu a vyber správnou třídu sloučenin. Čím rychleji, tím víc bodů.</p>
      <Hud
        score={score}
        round={idx + 1}
        rounds={rounds.length}
        seconds={asking ? remaining : undefined}
        extra={
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span className="chip g-fg-streak" key="streak" variants={popIn} initial="hidden" animate="show" exit="hidden">
                <Icon name="flame" /> {streak}×
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div ref={scope} className="card g-fg-card">
        <div className={`g-fg-timer ${asking ? urgency : ''}`} aria-hidden="true">
          <motion.span style={{ scaleX: timeLeft }} />
        </div>
        <div className="g-fg-head">
          <span className="eyebrow">{item.kind === 'fragment' ? 'Funkční skupina' : item.kind === 'bio' ? 'Biomolekula' : 'Molekula'}</span>
          <motion.div key={mood} initial={{ scale: 0.75, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>
            <Mascot mood={mood} size={48} />
          </motion.div>
          {result && <PointsPop key={idx} points={result.points} />}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="g-fg-prompt"
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, transition: spring.bouncy }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
          >
            <Prompt item={item} />
          </motion.div>
        </AnimatePresence>
        <p className="g-fg-q">{question}</p>
      </div>

      <div className="g-fg-opts" role="group" aria-label="Možnosti">
        {round.options.map((o, i) => {
          const isAnswer = o === item.answer
          const isChoice = result?.choice === o
          const state = !result ? 'show' : isAnswer ? 'correct' : isChoice ? 'wrong' : 'dim'
          return (
            <motion.button
              key={`${idx}-${o}`}
              type="button"
              className={`g-fg-opt is-${state}`}
              onClick={() => answer(o)}
              disabled={!!result}
              aria-keyshortcuts={String(i + 1)}
              custom={i}
              variants={optVariants}
              initial="hidden"
              animate={state}
              whileTap={result ? undefined : { y: 3 }}
            >
              <span className="g-fg-key" aria-hidden="true">
                {i + 1}
              </span>
              <span className="g-fg-opt-label">{labelOf(o)}</span>
              <AnimatePresence>
                {result && (isAnswer || isChoice) && (
                  <motion.span className="g-fg-opt-icon" variants={popIn} initial="hidden" animate="show">
                    <Icon name={isAnswer ? 'check' : 'x'} />
                    <span className="sr-only">{isAnswer ? 'správně' : 'tvoje volba, špatně'}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div key={idx} className="g-fg-after" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <Feedback kind={result.correct ? 'good' : 'bad'}>
              <Explain item={item} result={result} />
            </Feedback>
            <div className="g-fg-actions">
              <motion.button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={next}
                autoFocus
                variants={popIn}
                initial="hidden"
                animate="show"
              >
                {last ? 'Dokončit' : 'Další'} <Icon name="arrowRight" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Explain({ item, result }: { item: FgItem; result: Result }) {
  const cls = item.answer in CLASSES ? CLASSES[item.answer as ClassId] : null
  const chosen = result.choice && result.choice in CLASSES ? CLASSES[result.choice as ClassId] : null
  const head = result.correct
    ? `**Správně!**${result.points > BASE ? ` Rychlostní bonus +${result.points - BASE}.` : ''}`
    : result.choice === null
      ? `**Čas vypršel.** Správně je **${labelOf(item.answer)}**.`
      : `**Tohle je ${labelOf(item.answer)}.**`
  return (
    <div className="g-fg-explain">
      <p>
        <Md text={head} /> {cls && <Md text={cls.tell} />}
      </p>
      {!result.correct && chosen && (
        <p className="g-fg-explain-alt">
          <Md text={`Pro třídu „${chosen.label}“ je typické: ${chosen.group}.`} />
        </p>
      )}
      {(item.name || item.note) && (
        <p className="g-fg-explain-alt">
          {item.name && (
            <>
              Látka: <b>{item.name}</b>.{' '}
            </>
          )}
          {item.note && <Md text={item.note} />}
        </p>
      )}
    </div>
  )
}

function Prompt({ item }: { item: FgItem }) {
  if (item.ring) return <BenzeneRing sub={item.ring.sub} />
  if (item.art)
    return (
      <pre className="g-fg-art" role="img" aria-label="strukturní vzorec">
        {item.art}
      </pre>
    )
  return (
    <div className="g-fg-formula">
      {(item.text ?? '').split('\n').map((line, i) => (
        <span key={i}>
          <Md text={line} />
        </span>
      ))}
    </div>
  )
}

/** Benzene ring (hexagon with a circle), optionally with a substituent on the right. */
function BenzeneRing({ sub }: { sub?: string }) {
  const cx = 50
  const cy = 50
  const r = 34
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  const parts = sub ? (sub.match(/[A-Za-z]+|\d+/g) ?? []) : []
  return (
    <div className="g-fg-ring">
      <svg viewBox={sub ? '0 0 170 100' : '0 0 100 100'} role="img" aria-label={sub ? `benzenové jádro se skupinou ${sub}` : 'benzenové jádro'}>
        <motion.polygon
          points={pts}
          className="g-fg-ring-hex"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r * 0.58}
          className="g-fg-ring-pi"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        />
        {sub && (
          <>
            <line x1={cx + r} y1={cy} x2={cx + r + 20} y2={cy} className="g-fg-ring-hex" />
            <text x={cx + r + 24} y={cy + 8} className="g-fg-ring-sub">
              {parts.map((p, i) =>
                /\d/.test(p) ? (
                  <tspan key={i} baselineShift="sub" fontSize="15">
                    {p}
                  </tspan>
                ) : (
                  <tspan key={i}>{p}</tspan>
                ),
              )}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
