import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { BoardTask, type BoardSpec, type FigureCtx } from '../cell-builder/BoardTask'
import { BodyPicture, cropOf, drawingOf } from './Body'
import { ORGANS, type OrganId } from './levels'
import { makeRound, playedLevel, type PathTask, type Task } from './logic'
import './body-map.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
/** Tallest the body may be drawn (px), so the slots stay in reach on a phone. */
const MAX_H = 430

const KIND_LABEL: Record<Task['kind'], string> = { place: 'Kde to leží?', match: 'Přiřaď', path: 'Seřaď' }

type Status = 'play' | 'done'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

function specOf(t: Task): BoardSpec {
  return {
    tokens: t.tokens,
    slots: t.slots.map((s) => ({ id: s.id, num: s.num, title: s.title })),
    arrows: t.kind === 'path',
    wide: t.kind !== 'place',
    trayTitle: t.kind === 'place' ? 'Orgány' : t.kind === 'match' ? t.cards : 'Kroky',
    placeholder: t.kind === 'path' ? 'Sem polož krok' : 'Sem polož',
  }
}

export default function BodyMap({ levelId, onFinish }: GameProps) {
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
  const scoreRef = useRef(0)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const t = tasks[i]
  const n = t.tokens.length
  const full = n * 3
  const zero = n * 10
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, full, zero) : 0
  const spec = useMemo(() => specOf(t), [t])

  const say = (kind: Msg['kind'], text: string) => {
    setMsg({ kind, text })
    setMsgN((k) => k + 1)
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
    setStart(Date.now())
  }

  const mood: Mood = status === 'done' ? (pts > 0 ? 'cheer' : 'sad') : tries ? 'think' : 'happy'
  const figure = t.kind === 'path' ? undefined : (ctx: FigureCtx) => <BodyFigure t={t} ctx={ctx} />

  return (
    <div className="g-sh-root g-bm">
      <p className="g-sh-instr">Přetáhni kartu na místo, nebo na ni ťukni a pak ťukni na místo. Jde to i klávesnicí (Tab, Enter).</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-bm-card">
        <div className="g-bm-top">
          <div className="g-bm-q">
            <span className="eyebrow">
              {KIND_LABEL[t.kind]} · {t.title}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-bm-prompt" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                {t.prompt}
              </motion.p>
            </AnimatePresence>
            {t.kind !== 'path' && <p className="g-bm-hint">Díváš se na člověka zepředu: jeho pravá strana (P) je na obrázku vlevo.</p>}
          </div>
          <Mascot mood={mood} size={50} />
          {status === 'done' && pts > 0 && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        {status === 'play' && (
          <div className="g-bm-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-bm-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        <BoardTask key={i} spec={spec} tries={tries} done={status === 'done'} figure={figure} onWin={win} onRetry={retry} onLose={lose} />
      </div>

      <div className="g-bm-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            {msg.text}
          </Feedback>
        )}
      </div>

      {status === 'done' && (
        <motion.div className="card-flat g-bm-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          {t.kind === 'path' && t.route && <PathFigure t={t} />}
          <p className="g-bm-why">{t.explain}</p>
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

const sizeStyle = ([y0, y1]: [number, number]) => ({ maxWidth: `min(100%, ${Math.round((MAX_H * 320) / (y1 - y0))}px)` })

function BodyFigure({ t, ctx }: { t: Task; ctx: FigureCtx }) {
  const organs = useMemo(() => t.slots.map((s) => s.organ!), [t])
  const crop = useMemo(() => cropOf(organs.map((o) => ORGANS[o].at)), [organs])
  const show = useMemo(() => new Set<OrganId>(t.kind === 'place' && !ctx.done ? [] : organs.map(drawingOf)), [t.kind, ctx.done, organs])
  const markers = t.slots.map((s) => {
    const [x, y] = ORGANS[s.organ!].at
    return { slot: s.id, num: s.num, x: (x / 320) * 100, y: ((y - crop[0]) / (crop[1] - crop[0])) * 100, title: s.title ?? `${s.num}` }
  })
  const label =
    t.kind === 'place' && !ctx.done
      ? 'Obrys lidského těla zepředu s očíslovanými místy'
      : `Lidské tělo zepředu: ${organs.map((o) => ORGANS[o].name).join(', ')}`
  return (
    <figure className="g-bm-fig">
      <div className="g-dnd-figure" style={sizeStyle(crop)}>
        <BodyPicture show={show} crop={crop} label={label} />
        {ctx.markers(markers)}
      </div>
    </figure>
  )
}

function PathFigure({ t }: { t: PathTask }) {
  const crop = useMemo(() => cropOf(t.route!), [t])
  const show = useMemo(() => new Set<OrganId>((t.organs ?? []).map(drawingOf)), [t])
  return (
    <figure className="g-bm-fig g-bm-pathfig">
      <div className="g-dnd-figure" style={sizeStyle(crop)}>
        <BodyPicture show={show} crop={crop} route={t.route} label={`${t.title} v těle: ${t.slots.length} zastávek`} />
      </div>
      <figcaption>{t.title}</figcaption>
    </figure>
  )
}
