import { useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { BoardTask, type BoardSpec } from './BoardTask'
import { CellGlyph, CellPicture } from './Cell'
import { ANCHORS, CELLS, PARTS, VIEW, type CellId, type PartId } from './levels'
import { cap, makeRound, playedLevel, surelyLacks, type LabelTask, type MissingTask, type SortTask, type Task } from './logic'
import './cell-builder.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX

const KIND_LABEL: Record<Task['kind'], string> = {
  label: 'Popiš buňku',
  function: 'Co to dělá?',
  sort: 'Kde to najdeš?',
  missing: 'Co chybí?',
}

type Status = 'play' | 'done'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

function prompt(t: Task): string {
  const distractor = t.kind !== 'missing' && t.tokens.some((x) => x.answer === null)
  if (t.kind === 'label')
    return `Popiš ${CELLS[t.cell].acc}: přetáhni každý název k jeho číslu.${distractor ? ' Jeden název do téhle buňky nepatří.' : ''}`
  if (t.kind === 'function') return `Co dělá která část? Přiřaď funkci k číslu.${distractor ? ' Jedna funkce do téhle buňky nepatří.' : ''}`
  if (t.kind === 'sort') {
    const [a, b] = t.scheme.groups
    return `Která buňka to má? Roztřiď karty: jen ${a.name}, jen ${b.name}, nebo obě.`
  }
  return `Na obrázku je ${CELLS[t.cell].name}, ale jedna součást chybí. Která?`
}

/** Bonus time per task: full up to `full` s, nothing from `zero` s. */
function bonusTime(t: Task): [number, number] {
  if (t.kind === 'missing') return [8, 25]
  const n = t.tokens.length
  return [n * 3, n * 10]
}

export default function CellBuilder({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const [picked, setPicked] = useState<PartId | null>(null)
  const scoreRef = useRef(0)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const t = tasks[i]
  const [full, zero] = bonusTime(t)
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, full, zero) : 0

  const say = (kind: Msg['kind'], text: string) => {
    setMsg({ kind, text })
    setMsgN((n) => n + 1)
  }
  const end = () => {
    setFrozen((Date.now() - start) / 1000)
    setStatus('done')
  }
  const win = () => {
    const s = (Date.now() - start) / 1000
    const p = tries === 0 ? 100 + timeBonus(s, BONUS_MAX, full, zero) : 50
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    end()
    say('good', tries === 0 ? 'Správně, všechno sedí!' : 'Teď už je to správně.')
    jolt.pop()
  }
  const retry = (ok: number, total: number) => {
    setTries(1)
    say('bad', `Správně ${ok} z ${total}. Zelené zůstávají, zbytek se vrátil – zkus ho umístit znovu.`)
    jolt.shake()
  }
  const lose = () => {
    end()
    say('warn', 'Tady je správné řešení – oranžově jsou opravené karty.')
    jolt.shake()
  }

  const chooseMissing = (o: PartId) => {
    if (status !== 'play' || t.kind !== 'missing') return
    setPicked(o)
    if (o === t.missing) return win()
    end()
    const why = surelyLacks(o, t.cell)
      ? `${cap(PARTS[o].name)} ${CELLS[t.cell].inName} vůbec není: ${PARTS[o].lacks![t.cell]}.`
      : `${cap(PARTS[o].name)} na obrázku je. Chybí ${PARTS[t.missing].name}.`
    say('bad', why)
    jolt.shake()
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setMsg(null)
    setPts(0)
    setPicked(null)
    setStart(Date.now())
  }

  const mood: Mood = status === 'done' ? (pts > 0 ? 'cheer' : 'sad') : tries ? 'think' : 'happy'

  return (
    <div className="g-sh-root g-cb">
      <p className="g-sh-instr">Přetáhni kartu na místo, nebo na ni ťukni a pak ťukni na místo. Jde to i klávesnicí (Tab, Enter).</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-cb-card">
        <div className="g-cb-top">
          <div className="g-cb-q">
            <span className="eyebrow">
              {KIND_LABEL[t.kind]}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-cb-prompt" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {prompt(t)}
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {status === 'done' && pts > 0 && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        {status === 'play' && (
          <div className="g-cb-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-cb-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        {t.kind === 'missing' ? (
          <MissingView key={i} t={t} done={status === 'done'} picked={picked} onPick={chooseMissing} />
        ) : (
          <BoardTask
            key={i}
            spec={specOf(t)}
            tries={tries}
            done={status === 'done'}
            figure={t.kind === 'sort' ? undefined : (ctx) => <CellFigure t={t} markers={ctx.markers} />}
            onWin={win}
            onRetry={retry}
            onLose={lose}
          />
        )}
      </div>

      <div className="g-cb-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {status === 'done' && (
        <motion.div className="card-flat g-cb-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-cb-why">{t.explain}</p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function specOf(t: LabelTask | SortTask): BoardSpec {
  if (t.kind === 'sort') {
    const [a, b] = t.scheme.groups
    const glyph = (k: number) => {
      const cells = t.scheme.groups[k].cells
      return cells.length === 1 ? <CellGlyph cell={cells[0]} /> : <CellGlyph cell="animal" />
    }
    return {
      tokens: t.tokens,
      zones: t.zones.map((z) => ({
        id: z.id,
        title: z.groups.length === 2 ? `${cap(a.name)} i ${b.name}` : cap(z.title),
        icon: z.groups.length === 2 ? undefined : glyph(z.groups[0]),
      })),
      trayTitle: 'Karty',
    }
  }
  return {
    tokens: t.tokens,
    slots: t.slots.map((s) => ({ id: s.id, num: s.num, title: s.title })),
    wide: t.kind === 'function',
    trayTitle: t.kind === 'function' ? 'Funkce' : 'Názvy',
  }
}

const yPct = (cell: CellId, y: number) => ((y - VIEW[cell][0]) / VIEW[cell][1]) * 100

function CellFigure({ t, markers }: { t: LabelTask; markers: (list: { slot: string; num: number; x: number; y: number; title: string }[]) => ReactNode }) {
  const list = useMemo(
    () =>
      t.slots.map((s) => {
        const [x, y] = ANCHORS[t.cell][s.part]!
        return { slot: s.id, num: s.num, x: (x / 360) * 100, y: yPct(t.cell, y), title: `${s.num}` }
      }),
    [t],
  )
  return (
    <figure className="g-cb-fig">
      <div className="g-dnd-figure">
        <CellPicture cell={t.cell} />
        {markers(list)}
      </div>
      <figcaption>{cap(CELLS[t.cell].name)}</figcaption>
    </figure>
  )
}

function MissingView({ t, done, picked, onPick }: { t: MissingTask; done: boolean; picked: PartId | null; onPick: (p: PartId) => void }) {
  const hidden = useMemo(() => new Set<PartId>(done ? [] : [t.missing]), [done, t.missing])
  const at = ANCHORS[t.cell][t.missing]!
  return (
    <div className="g-cb-missing">
      <figure className="g-cb-fig">
        <div className="g-dnd-figure">
          <CellPicture cell={t.cell} hidden={hidden} label={`${cap(CELLS[t.cell].name)}, jedna součást chybí`} />
          {done && (
            <motion.span
              className="g-cb-found"
              style={{ left: `${(at[0] / 360) * 100}%`, top: `${yPct(t.cell, at[1])}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={spring.bouncy}
              aria-hidden="true"
            >
              <Icon name="check" />
            </motion.span>
          )}
        </div>
        <figcaption>{cap(CELLS[t.cell].name)}</figcaption>
      </figure>
      <div className="g-cb-options" role="group" aria-label="Co na obrázku chybí?">
        {t.options.map((o) => {
          const right = done && o === t.missing
          const wrong = done && picked === o && o !== t.missing
          return (
            <button
              key={o}
              type="button"
              className={`g-cb-option${right ? ' ok' : ''}${wrong ? ' bad' : ''}`}
              aria-pressed={picked === o}
              disabled={done}
              onClick={() => onPick(o)}
            >
              {right && <Icon name="check" />}
              {wrong && <Icon name="x" />}
              {cap(PARTS[o].name)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
