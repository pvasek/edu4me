import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, Reorder, motion, useDragControls } from 'motion/react'
import { Md, plain } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { FlowDiagram } from './Flow'
import type { Card } from './levels'
import {
  checkNumber,
  cz,
  family,
  formsLine,
  isRightOrder,
  makeRound,
  move,
  playedLevel,
  positionsRight,
  type NumberTask,
  type Task,
} from './logic'
import './energy-chain.css'

const BONUS_MAX = 25
const BONUS_FULL = 20
const BONUS_ZERO = 60
const PER_TASK = 100 + BONUS_MAX

type Status = 'play' | 'won' | 'lost'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const FAMILY_COLOR: Record<string, string> = {
  light: 'var(--warn)',
  heat: 'var(--bad)',
  work: 'var(--teal)',
  pot: 'var(--blue)',
  kin: 'var(--green)',
  elastic: 'var(--pink)',
  chem: 'var(--violet)',
  el: 'var(--yellow)',
  nuc: 'var(--accent)',
}
const colorOf = (c: Card) => FAMILY_COLOR[family(c.form)] ?? 'var(--muted)'

const KIND_LABEL: Record<Task['kind'], string> = {
  order: 'Seřaď řetězec',
  missing: 'Chybějící článek',
  eta: 'Účinnost',
  useful: 'Užitečná práce',
  carnot: 'Carnotova účinnost',
  cop: 'Chladicí a topný faktor',
}

function CardFace({ card, mark }: { card: Card; mark?: 'good' | 'bad' }) {
  return (
    <span className="g-ec-face">
      <span className="g-ec-ctext">{card.text}</span>
      <span className="g-ec-form">
        <Md text={card.form} />
      </span>
      {mark && (
        <span className={`g-ec-mark g-ec-mark-${mark}`} aria-label={mark === 'good' ? 'na správném místě' : 'na špatném místě'}>
          <Icon name={mark === 'good' ? 'check' : 'x'} />
        </span>
      )}
    </span>
  )
}

function OrderItem({
  card,
  index,
  count,
  locked,
  mark,
  onMove,
}: {
  card: Card
  index: number
  count: number
  locked: boolean
  mark?: 'good' | 'bad'
  onMove: (from: number, to: number) => void
}) {
  const controls = useDragControls()
  const name = plain(card.text)
  return (
    <Reorder.Item
      value={card}
      as="li"
      className={`g-ec-card${mark ? ` is-${mark}` : ''}`}
      style={{ ['--ec-c' as string]: colorOf(card) }}
      dragListener={false}
      dragControls={controls}
      drag={locked ? false : 'y'}
      whileDrag={{ scale: 1.03, boxShadow: '6px 8px 0 var(--shadow-color)', zIndex: 3 }}
    >
      <span className="g-ec-num" aria-hidden="true">
        {index + 1}
      </span>
      {!locked && (
        <span className="g-ec-grip" onPointerDown={(e) => controls.start(e)} aria-hidden="true" title="Přetáhni">
          <svg viewBox="0 0 12 20">
            {[4, 10, 16].map((y) => (
              <g key={y}>
                <circle cx="3" cy={y} r="1.6" />
                <circle cx="9" cy={y} r="1.6" />
              </g>
            ))}
          </svg>
        </span>
      )}
      <CardFace card={card} mark={mark} />
      {!locked && (
        <span className="g-ec-moves">
          <button type="button" className="g-ec-mv" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Posunout nahoru: ${name}`}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 13 L10 6 L16 13" />
            </svg>
          </button>
          <button type="button" className="g-ec-mv" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`Posunout dolů: ${name}`}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 7 L10 14 L16 7" />
            </svg>
          </button>
        </span>
      )}
    </Reorder.Item>
  )
}

/** Keeps a number and its unit on one line ("10 N/kg", "5 dm^{3}"). */
const nb = (s: string) => s.replace(/(\d) (?=[^\s\d−+=:·→<>(])/g, '$1\u00a0')

export default function EnergyChain({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const t = tasks[i]
  const [order, setOrder] = useState<Card[]>(() => (t.kind === 'order' ? t.start : []))
  const [marks, setMarks] = useState<boolean[] | null>(null)
  const [pick, setPick] = useState<Card | null>(null)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [live, setLive] = useState('')
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)

  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 0
  const done = status !== 'play'

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const win = (s: number, extra = '') => {
    const p = tries === 0 ? 100 + timeBonus(s, BONUS_MAX, BONUS_FULL, BONUS_ZERO) : 50
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    setFrozen(s)
    setStatus('won')
    say('good', `Správně!${extra}`)
    jolt.pop()
  }
  const lose = (s: number, text: string) => {
    setFrozen(s)
    setStatus('lost')
    say('warn', text)
    jolt.shake()
  }

  const onMove = (from: number, to: number) => {
    setMarks(null)
    const next = move(order, from, to)
    setOrder(next)
    setLive(`${plain(order[from].text)} je teď na ${to + 1}. místě.`)
  }

  const checkOrder = () => {
    if (t.kind !== 'order' || status !== 'play') return
    const s = (Date.now() - start) / 1000
    if (isRightOrder(order, t.chain)) return win(s)
    const pos = positionsRight(order, t.chain)
    setMarks(pos)
    if (tries === 0) {
      setTries(1)
      const right = pos.filter(Boolean).length
      say('bad', `Na správném místě ${right === 1 ? 'je 1 karta' : right >= 2 && right <= 4 ? `jsou ${right} karty` : `je ${right} karet`}. Začni zdrojem energie a sleduj, na co se mění.`)
      jolt.shake()
    } else {
      setOrder(t.chain.cards)
      setMarks(null)
      lose(s, 'Tady je správné pořadí.')
    }
  }

  const choose = (c: Card) => {
    if (t.kind !== 'missing' || status !== 'play') return
    setPick(c)
    const s = (Date.now() - start) / 1000
    const right = t.chain.cards[t.gap]
    if (c === right) win(s)
    else lose(s, `Sem patří „${right.text}“ (${plain(right.form)}).`)
  }

  const submit = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play' || t.kind === 'order' || t.kind === 'missing') return
    const r = checkNumber(text, t)
    if (r.kind === 'invalid') return say('info', 'Napiš číslo, třeba 32,5. Čárka i tečka platí.')
    const s = (Date.now() - start) / 1000
    if (r.kind === 'ok') return win(s, ` ${plain(t.symbol)} ≐ ${answerOf(t)}.`)
    if (tries === 0) {
      setTries(1)
      const hint =
        t.kind === 'carnot'
          ? 'Teploty převeď na kelviny (T = t + 273,15) a dosaď do η = 1 − T_{2}/T_{1}.'
          : t.kind === 'cop'
            ? 'Chladicí faktor ε = Q_{2}/W, topný faktor ε = Q_{1}/W, kde Q_{1} = Q_{2} + W.'
            : t.kind === 'useful'
              ? 'Užitečná práce W = η · Q_{1} (η jako desetinné číslo).'
              : 'Účinnost η = W / Q_{1} · 100 %; práce W = Q_{1} − Q_{2}.'
      say('bad', `${cz(r.value, 3)} to není. ${hint}`)
      jolt.shake()
      inputRef.current?.select()
    } else lose(s, `Správně je ${answerOf(t)}.`)
  }

  const giveUp = () => {
    const s = (Date.now() - start) / 1000
    if (t.kind === 'order') setOrder(t.chain.cards)
    setMarks(null)
    setFrozen(s)
    setStatus('lost')
    say(
      'info',
      t.kind === 'order' ? 'Nevadí, tady je správné pořadí.' : t.kind === 'missing' ? `Nevadí. Sem patří „${t.chain.cards[t.gap].text}“.` : `Nevadí. Správně je ${answerOf(t)}.`,
    )
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    const nt = tasks[i + 1]
    setI(i + 1)
    setOrder(nt.kind === 'order' ? nt.start : [])
    setMarks(null)
    setPick(null)
    setText('')
    setStatus('play')
    setTries(0)
    setMsg(null)
    setPts(0)
    setLive('')
    setStart(Date.now())
  }

  const mood: Mood = status === 'won' ? 'cheer' : status === 'lost' ? 'sad' : tries ? 'think' : 'happy'
  const title = t.kind === 'order' || t.kind === 'missing' ? t.chain.title : t.title
  const prompt =
    t.kind === 'order'
      ? 'Seřaď karty od zdroje energie (nahoře) až po její využití (dole). Táhni za úchyt, nebo použij šipky.'
      : t.kind === 'missing'
        ? 'Který článek v řetězci chybí?'
        : t.text

  return (
    <div className="g-sh-root g-ec">
      <p className="g-sh-instr">Sleduj, jak se energie mění od zdroje až po využití. Čísla se uznávají s tolerancí ±2 % (procenta ±1 procentní bod).</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-ec-card-main">
        <div className="g-ec-top">
          <div className="g-ec-q">
            <span className="eyebrow">
              {KIND_LABEL[t.kind]} · {title}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-ec-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={nb(prompt)} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={54} />
          {status === 'won' && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        {t.kind === 'order' && (
          <Reorder.Group key={i} as="ol" axis="y" values={order} onReorder={(v) => (setMarks(null), setOrder(v))} className="g-ec-list" aria-label="Karty řetězce">
            {order.map((c, k) => (
              <OrderItem
                key={c.text}
                card={c}
                index={k}
                count={order.length}
                locked={done}
                mark={marks ? (marks[k] ? 'good' : 'bad') : undefined}
                onMove={onMove}
              />
            ))}
          </Reorder.Group>
        )}

        {t.kind === 'missing' && (
          <ol className="g-ec-list" aria-label="Řetězec s chybějícím článkem">
            {t.chain.cards.map((c, k) =>
              k === t.gap ? (
                <li key={k} className={`g-ec-card g-ec-gap${done ? ' is-filled' : ''}`} style={{ ['--ec-c' as string]: done ? colorOf(c) : 'var(--muted)' }}>
                  <span className="g-ec-num" aria-hidden="true">
                    {k + 1}
                  </span>
                  {done ? (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring.bouncy} className="g-ec-fill">
                      <CardFace card={c} />
                    </motion.span>
                  ) : (
                    <span className="g-ec-q-mark">?</span>
                  )}
                </li>
              ) : (
                <li key={k} className="g-ec-card is-static" style={{ ['--ec-c' as string]: colorOf(c) }}>
                  <span className="g-ec-num" aria-hidden="true">
                    {k + 1}
                  </span>
                  <CardFace card={c} />
                </li>
              ),
            )}
          </ol>
        )}

        {t.kind !== 'order' && t.kind !== 'missing' && (
          <div className="g-ec-flowwrap">
            <FlowDiagram key={i} flow={t.flow} reveal={done} answerText={`Výsledek: ${answerOf(t)}.`} />
          </div>
        )}

        {status === 'play' && (
          <div className="g-ec-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-ec-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {live}
      </p>

      {status === 'play' && t.kind === 'order' && (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={checkOrder}>
            <Icon name="check" /> Zkontrolovat pořadí
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </div>
      )}

      {t.kind === 'missing' && status === 'play' && (
        <div className="g-ec-options" role="group" aria-label="Možnosti">
          {t.options.map((c) => (
            <button key={c.text} type="button" className="g-ec-opt" style={{ ['--ec-c' as string]: colorOf(c) }} aria-pressed={pick === c} onClick={() => choose(c)}>
              <CardFace card={c} />
            </button>
          ))}
        </div>
      )}

      {t.kind !== 'order' && t.kind !== 'missing' && status === 'play' && (
        <form className="g-ec-answer" onSubmit={submit}>
          <label className="g-ec-field">
            <span className="g-ec-flab">
              <Md text={t.symbol} />
            </span>
            <span className="g-ec-inwrap">
              <input
                ref={inputRef}
                className="g-sh-input g-ec-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="např. 32,5"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {t.unit && <span className="g-ec-unit">{t.unit}</span>}
            </span>
          </label>
          <div className="g-sh-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
              <Icon name="check" /> Zkontrolovat
            </button>
            <button type="button" className="btn btn-ghost" onClick={giveUp}>
              Nevím
            </button>
          </div>
        </form>
      )}

      <div className="g-ec-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={nb(msg.text)} />
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="card-flat g-ec-reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p className="g-ec-why">
            <Md text={nb(t.kind === 'order' || t.kind === 'missing' ? `Energie se mění: ${formsLine(t.chain)}.` : t.explain)} />
          </p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úloha'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function answerOf(t: NumberTask): string {
  return `${cz(t.value, t.unit === '%' ? 1 : 2)}${t.unit ? ` ${t.unit}` : ''}`
}
