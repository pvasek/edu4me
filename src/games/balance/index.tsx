import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { levelNum, type GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, rise, shake, slide, spring, stagger } from '../../ui/motion'
import { BY_SYMBOL, categoryVar } from '../../courses/chemie/data/elements'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce } from '../shared/hooks'
import { LEVELS, MAX_COEF, difficulty, gcdAll, isBalanced, pickEquations, tally, type Equation } from './equations'
import './balance.css'

const BASE = 10
const bonusFor = (streak: number) => Math.min(Math.max(streak - 1, 0), 2) * 2
const pointsFor = (mistakes: number) => Math.max(4, BASE - 2 * mistakes)

type Phase = 'play' | 'solved' | 'revealed'
type Fb = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string; n: number } | null

export default function Balance({ levelId, onFinish }: GameProps) {
  const n = levelNum(levelId)
  const level = n !== undefined && LEVELS[n] ? n : undefined
  const [eqs] = useState(() => pickEquations(level))
  const maxScore = useMemo(() => eqs.reduce((s, _, i) => s + BASE + bonusFor(i + 1), 0), [eqs])
  const finish = useFinishOnce(onFinish)

  const [idx, setIdx] = useState(0)
  const eq = eqs[idx]
  const [coefs, setCoefs] = useState<number[]>(() => ones(eqs[0]))
  const [phase, setPhase] = useState<Phase>('play')
  const [mistakes, setMistakes] = useState(0)
  const [fb, setFbRaw] = useState<Fb>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gained, setGained] = useState<{ n: number; key: number }>({ n: 0, key: 0 })
  const [collected] = useState(() => new Set<string>())
  const [scope, animate] = useAnimate<HTMLDivElement>()

  const setFb = (f: Omit<NonNullable<Fb>, 'n'> | null) => setFbRaw((old) => (f ? { ...f, n: (old?.n ?? 0) + 1 } : null))
  const fx = (kind: 'shake' | 'bump') => {
    if (!scope.current) return
    if (kind === 'shake') animate(scope.current, { x: shake.x }, shake.transition)
    else animate(scope.current, { scale: bump.scale }, bump.transition)
  }

  const t = useMemo(() => tally(eq, coefs), [eq, coefs])
  const allEqual = Object.values(t).every(([l, r]) => l === r)
  const okCount = Object.values(t).filter(([a, b]) => a === b).length
  const locked = phase !== 'play'
  const last = idx === eqs.length - 1

  const mood: Mood =
    phase === 'solved' ? 'cheer' : phase === 'revealed' ? 'think' : fb?.kind === 'bad' ? 'sad' : allEqual ? 'wow' : 'think'

  function setCoef(i: number, delta: number) {
    if (locked) return
    setCoefs((c) => c.map((v, j) => (j === i ? Math.min(MAX_COEF, Math.max(1, v + delta)) : v)))
    if (fb && fb.kind !== 'info') setFb(null)
  }

  function check() {
    if (locked) return
    if (!isBalanced(eq, coefs)) {
      const off = Object.entries(t)
        .filter(([, [l, r]]) => l !== r)
        .map(([el, [l, r]]) => `${el} (${l} vlevo, ${r} vpravo)`)
      setMistakes((m) => m + 1)
      setStreak(0)
      fx('shake')
      setFb({ kind: 'bad', text: `Ještě to nesedí: ${off.join(', ')}. Každý prvek musí mít na obou stranách stejně atomů.` })
      return
    }
    const g = gcdAll(coefs)
    if (g > 1) {
      fx('shake')
      setFb({
        kind: 'warn',
        text: `Atomy sedí, ale koeficienty nejsou nejmenší možné – všechny jdou vydělit ${g}. Zkrať je na ${coefs.map((c) => c / g).join(' : ')}.`,
      })
      return
    }
    const s = mistakes === 0 ? streak + 1 : 0
    const pts = pointsFor(mistakes) + (mistakes === 0 ? bonusFor(s) : 0)
    setStreak(s)
    setScore((x) => x + pts)
    setGained((g0) => ({ n: pts, key: g0.key + 1 }))
    for (const el of Object.keys(t)) collected.add(el)
    setPhase('solved')
    fx('bump')
    setFb({
      kind: 'good',
      text: (mistakes === 0 ? 'Vyčísleno napoprvé!' : 'Vyčísleno!') + (s >= 2 ? ` Série ${s}× bez chyby.` : '') + ` ${eq.caption}.`,
    })
  }

  function reveal() {
    setCoefs(eq.coefs)
    setPhase('revealed')
    setStreak(0)
    setFb({ kind: 'info', text: `Řešení: ${formatEquation(eq, eq.coefs)}. ${eq.caption}.` })
  }

  function next() {
    if (last) {
      finish({ score, max: maxScore, collected: [...collected] })
      return
    }
    const n = idx + 1
    setIdx(n)
    setCoefs(ones(eqs[n]))
    setPhase('play')
    setMistakes(0)
    setFb(null)
  }

  const species = [...eq.reactants, ...eq.products].map((f, i) => ({ f, i }))

  return (
    <div className="g-bal">
      <p className="g-bal-instr">Nastav koeficienty tlačítky − a + tak, aby vlevo i vpravo bylo stejně atomů každého prvku.</p>
      <Hud
        score={score}
        round={idx + 1}
        rounds={eqs.length}
        roundLabel="Rovnice"
        extra={
          <>
            <LevelChip level={level} />
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span className="chip g-bal-streak" key="streak" variants={popIn} initial="hidden" animate="show" exit="hidden">
                  <Icon name="flame" /> {streak}×
                </motion.span>
              )}
            </AnimatePresence>
          </>
        }
      />

      <div ref={scope} className="card g-bal-stage">
        <AnimatePresence mode="wait" custom={1} initial={false}>
          <motion.div
            key={eq.id}
            className="g-bal-stage-inner"
            custom={1}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="g-bal-head">
              <motion.div key={mood} initial={{ scale: 0.8, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>
                <Mascot mood={mood} size={52} />
              </motion.div>
              <div className="g-bal-head-text">
                <span className="eyebrow">
                  {eq.redox ? 'Redoxní rovnice' : ['Rozcvička', 'Střední', 'Těžší'][difficulty(eq) - 1]}
                </span>
                <span className="g-bal-note">{eq.caption}</span>
              </div>
              <PointsPop key={gained.key} points={phase === 'solved' ? gained.n : 0} />
            </div>

            <motion.div
              className="g-bal-eq"
              role="group"
              aria-label="Rovnice s koeficienty"
              variants={stagger(0.05, 0.1)}
              initial="hidden"
              animate="show"
            >
              <Side items={species.slice(0, eq.reactants.length)} coefs={coefs} setCoef={setCoef} locked={locked} />
              <motion.span className="g-bal-arrow" variants={rise} role="img" aria-label="dává">
                <Icon name="arrowRight" />
              </motion.span>
              <Side items={species.slice(eq.reactants.length)} coefs={coefs} setCoef={setCoef} locked={locked} />
            </motion.div>

            <motion.div
              className="g-bal-tally"
              aria-label="Počty atomů na obou stranách"
              variants={stagger(0.05, 0.25)}
              initial="hidden"
              animate="show"
            >
              {Object.entries(t).map(([el, [l, r]]) => (
                <ScaleRow key={el} el={el} left={l} right={r} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <p className={`g-bal-status${allEqual ? ' is-ok' : ''}`} aria-live="polite">
          <Icon name={allEqual ? 'check' : 'info'} />
          {allEqual
            ? `Všechny prvky jsou v rovnováze${phase === 'play' ? ' – zkontroluj to!' : '.'}`
            : `V rovnováze: ${okCount} z ${Object.keys(t).length} prvků`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {fb && (
          <motion.div key={fb.n} variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <Feedback kind={fb.kind}>
              <Md text={fb.text} />
            </Feedback>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="g-bal-actions">
        {phase === 'play' ? (
          <>
            <motion.button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={check}
              animate={allEqual ? { scale: [1, 1.08, 1], rotate: [0, -1.5, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Icon name="check" /> Zkontrolovat
            </motion.button>
            <button type="button" className="btn btn-ghost" onClick={() => setCoefs(ones(eq))}>
              <Icon name="refresh" /> Vynulovat
            </button>
            {mistakes >= 2 && (
              <motion.button type="button" className="btn btn-ghost" onClick={reveal} variants={popIn} initial="hidden" animate="show">
                <Icon name="bulb" /> Ukázat řešení
              </motion.button>
            )}
          </>
        ) : (
          <motion.button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={next}
            autoFocus
            variants={popIn}
            initial="hidden"
            animate="show"
          >
            {last ? 'Dokončit' : 'Další rovnice'} <Icon name="arrowRight" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

/** Single bonds in condensed organic formulas shown as dashes. */
const bonds = (f: string) => f.replace(/-/g, '–')

function ones(e: Equation) {
  return [...e.reactants, ...e.products].map(() => 1)
}

function formatEquation(e: Equation, c: number[]) {
  const part = (fs: string[], off: number) => fs.map((f, i) => `${c[off + i] > 1 ? c[off + i] + ' ' : ''}$${bonds(f)}$`).join(' + ')
  return `${part(e.reactants, 0)} -> ${part(e.products, e.reactants.length)}`
}

function Side({
  items,
  coefs,
  setCoef,
  locked,
}: {
  items: { f: string; i: number }[]
  coefs: number[]
  setCoef: (i: number, d: number) => void
  locked: boolean
}) {
  return (
    <div className="g-bal-side">
      {items.map(({ f, i }, k) => (
        <motion.div className="g-bal-term" key={f + i} variants={rise}>
          {k > 0 && (
            <span className="g-bal-plus" aria-hidden="true">
              +
            </span>
          )}
          <div className="g-bal-species">
            <button
              type="button"
              className="g-bal-step"
              onClick={() => setCoef(i, 1)}
              disabled={locked || coefs[i] >= MAX_COEF}
              aria-label={`Zvýšit koeficient u ${f} (teď ${coefs[i]})`}
            >
              +
            </button>
            <div className="g-bal-term-body">
              <span className="g-bal-coef-slot">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={coefs[i]}
                    className={`g-bal-coef${coefs[i] === 1 ? ' is-one' : ''}`}
                    initial={{ y: -14, opacity: 0, scale: 1.4 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 14, opacity: 0 }}
                    transition={spring.snappy}
                  >
                    {coefs[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="g-bal-formula">
                <Md text={`$${bonds(f)}$`} />
              </span>
            </div>
            <button
              type="button"
              className="g-bal-step"
              onClick={() => setCoef(i, -1)}
              disabled={locked || coefs[i] <= 1}
              aria-label={`Snížit koeficient u ${f} (teď ${coefs[i]})`}
            >
              −
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/** One element: a little balance scale that tilts toward the heavier side. */
function ScaleRow({ el, left, right }: { el: string; left: number; right: number }) {
  const ok = left === right
  const deg = Math.max(-16, Math.min(16, (right - left) * 5))
  const rad = (deg * Math.PI) / 180
  const cx = 70
  const cy = 16
  const arm = 50
  const lx = cx - arm * Math.cos(rad)
  const ly = cy - arm * Math.sin(rad)
  const rx = cx + arm * Math.cos(rad)
  const ry = cy + arm * Math.sin(rad)
  const e = BY_SYMBOL[el]
  const label = `${e?.name ?? el}: vlevo ${left}, vpravo ${right}${ok ? ', v rovnováze' : ''}`
  return (
    <motion.div className={`g-bal-row${ok ? ' is-ok' : ''}`} role="img" aria-label={label} variants={rise} layout>
      <span className="g-bal-el" style={{ ['--el-bg' as string]: e ? categoryVar(e.category) : 'var(--surface-2)' }}>
        {el}
      </span>
      <svg className="g-bal-scale" viewBox="0 0 140 66" aria-hidden="true">
        <path className="g-bal-stand" d="M70 18 L70 60 M54 64 L86 64" />
        <path className="g-bal-stand-foot" d="M60 64 L70 56 L80 64 Z" />
        <motion.g initial={false} style={{ x: cx, y: cy }} animate={{ rotate: deg }} transition={spring.bouncy}>
          <line className="g-bal-beam" x1={-arm} y1="0" x2={arm} y2="0" />
        </motion.g>
        <circle className="g-bal-pivot" cx={cx} cy={cy} r="3.5" />
        <Pan x={lx} y={ly} n={left} />
        <Pan x={rx} y={ry} n={right} />
      </svg>
      <span className="g-bal-verdict">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={ok ? 'ok' : 'no'} className="g-bal-verdict-icon" variants={popIn} initial="hidden" animate="show" exit="hidden">
            <Icon name={ok ? 'check' : 'x'} />
          </motion.span>
        </AnimatePresence>
        <span className="g-bal-verdict-text">{ok ? 'sedí' : left > right ? 'vlevo víc' : 'vpravo víc'}</span>
      </span>
    </motion.div>
  )
}

function Pan({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <motion.g className="g-bal-pan" initial={false} animate={{ x, y }} transition={spring.bouncy}>
      <path d="M0 0 L-15 16 M0 0 L15 16" />
      <path className="g-bal-dish" d="M-20 16 L20 16 Q20 34 0 34 Q-20 34 -20 16 Z" />
      <text x="0" y="30" textAnchor="middle">
        {n}
      </text>
    </motion.g>
  )
}

/** HUD chip: which level's content is being played. */
function LevelChip({ level }: { level?: number }) {
  return (
    <span className="chip g-sh-hud-chip" title={level ? `Rovnice z úrovně ${level}` : 'Rovnice ze všech úrovní'}>
      <Icon name={level ? 'book' : 'shuffle'} />
      <span>{level ? `Úroveň ${level}` : 'Vše'}</span>
    </span>
  )
}
