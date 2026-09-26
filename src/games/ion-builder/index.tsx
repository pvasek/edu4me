import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useAnimate } from 'motion/react'
import type { GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { bump, fadeUp, popIn, rise, shake, slide, spring, stagger } from '../../ui/motion'
import { parseFormula } from '../../courses/chemie/data/formula'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce } from '../shared/hooks'
import { levelNumber } from '../shared/util'
import { ionMarkup, ionPlain, type Anion, type Cation } from '../shared/ions'
import { gcd, group } from '../shared/nomenclature'
import { buildTasks, type Task } from './tasks'
import './ion-builder.css'

const BASE = 10
const LANE_MAX = 6
const bonusFor = (streak: number) => Math.min(Math.max(streak - 1, 0), 3) * 2

type Ion = Cation | Anion
interface Tile {
  id: number
  ion: Ion
}
type Phase = 'build' | 'formed' | 'revealed'
type Fb = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string; n: number } | null

const keyOf = (i: Ion) => `${i.formula}${i.charge}`
const isCation = (i: Ion): i is Cation => i.charge > 0

/** Czech plural: 1 náboj, 2–4 náboje, 5+ nábojů. */
function charges(n: number, sign: '+' | '−') {
  const adj = sign === '+' ? ['kladný', 'kladné', 'kladných'] : ['záporný', 'záporné', 'záporných']
  const noun = ['náboj', 'náboje', 'nábojů']
  const f = n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2
  return `${n} ${adj[f]} ${noun[f]}`
}

export default function IonBuilder({ levelId, onFinish }: GameProps) {
  const level = levelNumber(levelId, 5)
  const [tasks] = useState(() => buildTasks(level))
  const maxScore = useMemo(() => tasks.reduce((s, _, i) => s + BASE + bonusFor(i + 1), 0), [tasks])
  const finish = useFinishOnce(onFinish)

  const [idx, setIdx] = useState(0)
  const task = tasks[idx]
  const [tiles, setTiles] = useState<Tile[]>([])
  const [phase, setPhase] = useState<Phase>('build')
  const [mistakes, setMistakes] = useState(0)
  const [fb, setFbRaw] = useState<Fb>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gained, setGained] = useState({ n: 0, key: 0 })
  const [collected] = useState(() => new Set<string>())
  const nextId = useRef(1)
  const [scope, animate] = useAnimate<HTMLDivElement>()

  const setFb = (f: Omit<NonNullable<Fb>, 'n'> | null) => setFbRaw((old) => (f ? { ...f, n: (old?.n ?? 0) + 1 } : null))
  const fx = (kind: 'shake' | 'bump') => {
    if (!scope.current) return
    if (kind === 'shake') animate(scope.current, { x: shake.x }, shake.transition)
    else animate(scope.current, { scale: bump.scale }, bump.transition)
  }

  const cats = tiles.filter((t) => isCation(t.ion))
  const ans = tiles.filter((t) => !isCation(t.ion))
  const plus = cats.reduce((s, t) => s + t.ion.charge, 0)
  const minus = ans.reduce((s, t) => s - t.ion.charge, 0)
  const total = plus - minus
  const locked = phase !== 'build'
  const last = idx === tasks.length - 1

  const mood: Mood =
    phase === 'formed' ? 'cheer' : phase === 'revealed' ? 'think' : fb?.kind === 'bad' ? 'sad' : tiles.length && total === 0 ? 'wow' : 'think'

  function add(ion: Ion) {
    if (locked) return
    const lane = isCation(ion) ? cats : ans
    if (lane.length >= LANE_MAX) {
      fx('shake')
      setFb({ kind: 'warn', text: 'Víc iontů se sem nevejde – zkus jiný poměr.' })
      return
    }
    setTiles((ts) => [...ts, { id: nextId.current++, ion }])
    if (fb?.kind !== 'info') setFb(null)
  }

  function remove(id: number) {
    if (locked) return
    setTiles((ts) => ts.filter((t) => t.id !== id))
    if (fb?.kind !== 'info') setFb(null)
  }

  function wrongMove(text: string) {
    setMistakes((m) => m + 1)
    setStreak(0)
    fx('shake')
    setFb({ kind: 'bad', text })
  }

  function check() {
    if (locked) return
    const wrongC = cats.find((t) => keyOf(t.ion) !== keyOf(task.cation))
    const wrongA = ans.find((t) => keyOf(t.ion) !== keyOf(task.anion))
    if (wrongC) {
      return wrongMove(
        task.mode === 'name'
          ? `„${task.name}“ obsahuje ${task.cation.ion} ${ionMarkup(task.cation)}${
              task.cation.formula === task.cation.element
                ? ` (koncovka -${ending(task.cation.adj)} = oxidační číslo ${roman(task.cation.charge)})`
                : ''
            }, ne ${ionMarkup(wrongC.ion)}.`
          : `Kation ${ionMarkup(wrongC.ion)} do zadání nepatří.`,
      )
    }
    if (wrongA) {
      return wrongMove(
        task.mode === 'name'
          ? `„${task.anion.stem[0].toUpperCase() + task.anion.stem.slice(1)}“ je ${task.anion.ion} ${ionMarkup(task.anion)}, ne ${ionMarkup(wrongA.ion)}.`
          : `Anion ${ionMarkup(wrongA.ion)} do zadání nepatří.`,
      )
    }
    if (!cats.length || !ans.length) {
      return wrongMove(`Sloučenina potřebuje kationty i anionty. Přidej ${!cats.length ? 'kation' : 'anion'}.`)
    }
    if (total !== 0) {
      return wrongMove(
        total > 0
          ? `Přebývá ${charges(total, '+')}. Přidej anion, nebo uber kation.`
          : `Přebývá ${charges(-total, '−')}. Přidej kation, nebo uber anion.`,
      )
    }
    const g = gcd(cats.length, ans.length)
    if (g > 1) {
      fx('shake')
      setFb({
        kind: 'warn',
        text: `Náboj je vyrovnaný, ale vzorec se píše v nejmenším poměru: ${cats.length} : ${ans.length} → ${cats.length / g} : ${ans.length / g}. Uber ionty.`,
      })
      return
    }
    const s = mistakes === 0 ? streak + 1 : 0
    const pts = mistakes === 0 ? BASE + bonusFor(s) : BASE / 2
    setStreak(s)
    setScore((x) => x + pts)
    setGained((g0) => ({ n: pts, key: g0.key + 1 }))
    for (const el of Object.keys(parseFormula(task.formula))) collected.add(el)
    setPhase('formed')
    fx('bump')
    setFb({
      kind: 'good',
      text: `${mistakes === 0 ? 'Přesně tak!' : 'Hotovo!'}${s >= 2 ? ` Kombo ${s}×!` : ''} $${task.formula}$ je ${task.name}.`,
    })
  }

  function reveal() {
    const t: Tile[] = [
      ...Array.from({ length: task.nC }, () => ({ id: nextId.current++, ion: task.cation as Ion })),
      ...Array.from({ length: task.nA }, () => ({ id: nextId.current++, ion: task.anion as Ion })),
    ]
    setTiles(t)
    setPhase('revealed')
    setStreak(0)
    setFb({ kind: 'info', text: `Řešení: ${task.nC}× ${ionMarkup(task.cation)} a ${task.nA}× ${ionMarkup(task.anion)} → $${task.formula}$ (${task.name}).` })
  }

  function next() {
    if (last) {
      finish({ score, max: maxScore, collected: [...collected] })
      return
    }
    setIdx((i) => i + 1)
    setTiles([])
    setPhase('build')
    setMistakes(0)
    setFb(null)
  }

  const trayIons: Ion[] = [...task.trayCations, ...task.trayAnions]

  return (
    <div className="g-ion">
      <p className="g-ion-instr">Přidávej kationty a anionty, dokud nebude celkový náboj nula. Klepnutím na dlaždici na desce ji zase odebereš.</p>
      <Hud
        score={score}
        round={idx + 1}
        rounds={tasks.length}
        roundLabel="Úkol"
        extra={
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span className="chip g-ion-streak" key="streak" variants={popIn} initial="hidden" animate="show" exit="hidden">
                <Icon name="flame" /> kombo {streak}×
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div ref={scope} className="card g-ion-stage">
        <AnimatePresence mode="wait" custom={1} initial={false}>
          <motion.div key={idx} className="g-ion-target" custom={1} variants={slide} initial="enter" animate="center" exit="exit">
            <motion.div key={mood} initial={{ scale: 0.75, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>
              <Mascot mood={mood} size={54} />
            </motion.div>
            <div className="g-ion-target-text">
              <span className="eyebrow">{task.mode === 'name' ? 'Sestav sloučeninu' : 'Spoj ionty do sloučeniny'}</span>
              {task.mode === 'name' ? (
                <span className="g-ion-target-name">{task.name}</span>
              ) : (
                <span className="g-ion-target-pair">
                  <Md text={ionMarkup(task.cation)} /> <span className="g-ion-amp">+</span> <Md text={ionMarkup(task.anion)} />
                </span>
              )}
              {task.mode === 'pair' && (
                <span className="g-ion-target-sub">
                  {task.cation.ion} a {task.anion.ion}
                </span>
              )}
            </div>
            <PointsPop key={gained.key} points={phase === 'formed' ? gained.n : 0} />
          </motion.div>
        </AnimatePresence>

        <LayoutGroup>
          <div className="g-ion-board" aria-label="Deska se sestavenými ionty">
            <Lane title="Kationty" sign="+" tiles={cats} onRemove={remove} locked={locked} />
            <Lane title="Anionty" sign="−" tiles={ans} onRemove={remove} locked={locked} />
          </div>
          <ChargeMeter plus={plus} minus={minus} />
        </LayoutGroup>

        <AnimatePresence>
          {phase !== 'build' && (
            <motion.div key={`cross-${idx}`} variants={fadeUp} initial="hidden" animate="show" exit="exit">
              <CrossRule task={task} />
            </motion.div>
          )}
        </AnimatePresence>
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

      {phase === 'build' && (
        <motion.div
          key={`tray-${idx}`}
          className="g-ion-tray"
          role="group"
          aria-label="Zásobník iontů"
          variants={stagger(0.06, 0.15)}
          initial="hidden"
          animate="show"
        >
          <span className="g-ion-tray-label">Přidej:</span>
          {trayIons.map((ion) => (
            <motion.button
              key={keyOf(ion)}
              type="button"
              className={`g-ion-tile g-ion-tile-tray ${isCation(ion) ? 'is-cat' : 'is-an'}`}
              onClick={() => add(ion)}
              aria-label={`Přidat ${isCation(ion) ? 'kation' : 'anion'} ${ionPlain(ion)}`}
              variants={rise}
              whileHover={{ y: -3, rotate: -1 }}
              whileTap={{ scale: 0.92, y: 1 }}
            >
              <span className="g-ion-plus-badge" aria-hidden="true">
                <Icon name="arrowRight" style={{ transform: 'rotate(90deg)' }} />
              </span>
              <IonFace ion={ion} />
            </motion.button>
          ))}
        </motion.div>
      )}

      <div className="g-ion-actions">
        {phase === 'build' ? (
          <>
            <motion.button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={check}
              disabled={!tiles.length}
              animate={tiles.length && total === 0 ? { scale: [1, 1.08, 1], rotate: [0, -1.5, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Icon name="check" /> Zkontrolovat
            </motion.button>
            {tiles.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setTiles([])}>
                <Icon name="refresh" /> Vyčistit
              </button>
            )}
            {mistakes >= 1 && (
              <motion.button type="button" className="btn btn-ghost" onClick={reveal} variants={popIn} initial="hidden" animate="show">
                <Icon name="bulb" /> Ukázat řešení
              </motion.button>
            )}
          </>
        ) : (
          <motion.button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus variants={popIn} initial="hidden" animate="show">
            {last ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

function ending(adj: string) {
  const m = adj.match(/(ičelý|istý|ový|ičný|ečný|ičitý|itý|natý|ný)$/)
  return m ? m[1] : adj
}
function roman(n: number) {
  return ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n]
}

/** Formula with charge + a row of big charge pips. */
function IonFace({ ion }: { ion: Ion }) {
  const n = Math.abs(ion.charge)
  const pos = isCation(ion)
  return (
    <>
      <span className="g-ion-formula">
        <Md text={ionMarkup(ion)} />
      </span>
      <span className="g-ion-pips" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={`g-ion-pip ${pos ? 'is-plus' : 'is-minus'}`}>
            {pos ? '+' : '−'}
          </span>
        ))}
      </span>
    </>
  )
}

function Lane({
  title,
  sign,
  tiles,
  onRemove,
  locked,
}: {
  title: string
  sign: '+' | '−'
  tiles: Tile[]
  onRemove: (id: number) => void
  locked: boolean
}) {
  return (
    <div className={`g-ion-lane ${sign === '+' ? 'is-cat' : 'is-an'}`}>
      <span className="g-ion-lane-title">
        {title} <b aria-hidden="true">{sign}</b> <span className="g-ion-lane-count">{tiles.length ? `× ${tiles.length}` : ''}</span>
      </span>
      <div className="g-ion-lane-tiles">
        <AnimatePresence mode="popLayout">
          {tiles.length === 0 && (
            <motion.span key="empty" className="g-ion-lane-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              zatím prázdné
            </motion.span>
          )}
          {tiles.map((t) => (
            <motion.button
              key={t.id}
              layout
              type="button"
              className={`g-ion-tile g-ion-tile-board ${sign === '+' ? 'is-cat' : 'is-an'}`}
              onClick={() => onRemove(t.id)}
              disabled={locked}
              aria-label={`Odebrat ${ionPlain(t.ion)}`}
              initial={{ opacity: 0, scale: 0.4, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: -12 }}
              transition={spring.bouncy}
              whileTap={locked ? undefined : { scale: 0.9 }}
            >
              {!locked && (
                <span className="g-ion-x" aria-hidden="true">
                  <Icon name="x" />
                </span>
              )}
              <IonFace ion={t.ion} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Pip ledger: every + pip is paired with a − pip; unpaired ones glow. */
function ChargeMeter({ plus, minus }: { plus: number; minus: number }) {
  const total = plus - minus
  const cols = Math.max(plus, minus)
  const status =
    plus + minus === 0
      ? 'Deska je prázdná.'
      : total === 0
        ? 'Náboje jsou vyrovnané.'
        : total > 0
          ? `Přebývá ${charges(total, '+')}.`
          : `Přebývá ${charges(-total, '−')}.`
  return (
    <motion.div layout className={`g-ion-meter${plus + minus > 0 && total === 0 ? ' is-zero' : ''}`}>
      <div className="g-ion-meter-head">
        <span className="g-ion-meter-label">Celkový náboj</span>
        <span className="g-ion-meter-value" aria-live="polite" aria-label={`Celkový náboj ${total}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={total}
              initial={{ y: -16, opacity: 0, scale: 1.4 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={spring.snappy}
            >
              {total > 0 ? `+${total}` : total < 0 ? `−${-total}` : '0'}
            </motion.span>
          </AnimatePresence>
          {plus + minus > 0 && total === 0 && <Icon name="check" />}
        </span>
      </div>
      {cols > 0 && (
        <div className="g-ion-ledger" aria-hidden="true">
          {Array.from({ length: cols }, (_, i) => {
            const paired = i < plus && i < minus
            return (
              <motion.span key={i} layout className={`g-ion-col${paired ? ' is-paired' : ''}`} variants={popIn} initial="hidden" animate="show">
                <span className={`g-ion-pip is-plus${i < plus ? '' : ' is-ghost'}`}>{i < plus ? '+' : ''}</span>
                <span className={`g-ion-pip is-minus${i < minus ? '' : ' is-ghost'}`}>{i < minus ? '−' : ''}</span>
              </motion.span>
            )
          })}
        </div>
      )}
      <p className="g-ion-meter-status">{status}</p>
    </motion.div>
  )
}

/** Křížové pravidlo: the cation's charge becomes the anion's index and vice versa. */
function CrossRule({ task }: { task: Task }) {
  const c = task.cation
  const a = task.anion
  const qa = Math.abs(a.charge)
  const g = gcd(c.charge, qa)
  const part = (ion: Ion, n: number, cls: string, delay: number) => {
    const poly = group(ion.formula, 2).startsWith('(')
    return (
      <span className="g-ion-part">
        {poly && n > 1 ? '(' : ''}
        <Md text={`$${ion.formula}$`} />
        {poly && n > 1 ? ')' : ''}
        {n > 1 && (
          <motion.sub
            className={`g-ion-idx ${cls}`}
            initial={{ opacity: 0, y: -18, scale: 1.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring.bouncy, delay }}
          >
            {n}
          </motion.sub>
        )}
      </span>
    )
  }
  return (
    <div className="g-ion-cross" role="img" aria-label={`Křížové pravidlo: ${ionPlain(c)} a ${ionPlain(a)} dávají ${task.formula}`}>
      <span className="eyebrow">Křížové pravidlo</span>
      <div className="g-ion-cross-row">
        <span className="g-ion-cross-ion">
          <Md text={`$${c.formula}$`} />
          <sup className="g-ion-q is-c">{c.charge > 1 ? c.charge : ''}+</sup>
        </span>
        <svg className="g-ion-cross-x" viewBox="0 0 80 44" aria-hidden="true">
          <motion.path
            d="M6 6 L74 38"
            className="g-ion-arrow is-c"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          />
          <motion.path
            d="M74 6 L6 38"
            className="g-ion-arrow is-a"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.35 }}
          />
        </svg>
        <span className="g-ion-cross-ion">
          <Md text={`$${a.formula}$`} />
          <sup className="g-ion-q is-a">{qa > 1 ? qa : ''}−</sup>
        </span>
      </div>
      {g > 1 && (
        <motion.p className="g-ion-cross-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Md text={`Poměr ${qa} : ${c.charge} zkrátíme ${g} → ${task.nC} : ${task.nA}`} />
        </motion.p>
      )}
      <motion.div
        className="g-ion-cross-result"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...spring.bouncy, delay: 0.7 }}
      >
        {part(c, task.nC, 'is-a', 0.9)}
        {part(a, task.nA, 'is-c', 1.05)}
      </motion.div>
      <motion.span className="g-ion-cross-name" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        {task.name}
        {(task.nC === 1 || task.nA === 1) && <span className="g-ion-cross-hint"> · jednička se v indexu nepíše</span>}
      </motion.span>
    </div>
  )
}
