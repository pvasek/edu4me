import { useEffect, useImperativeHandle, useMemo, useState, type Ref } from 'react'
import type { Question } from '../core/types'
import { correctAnswerText, isCorrect, shuffle, type Answer } from '../core/check'
import { Md } from '../core/markup'
import { Icon } from '../ui/Icon'
import { AnimatePresence, motion } from 'motion/react'
import { bump, rise, shake, spring, stagger } from '../ui/motion'
import './question.css'

const KIND_HINT: Record<Question['kind'], string> = {
  choice: 'Vyber jednu odpověď',
  multi: 'Vyber všechny správné odpovědi',
  tf: 'Pravda, nebo nepravda?',
  number: 'Napiš číslo',
  text: 'Napiš odpověď',
  order: 'Seřaď správně',
  match: 'Spoj dvojice',
}

/** Lets a parent own the "Zkontrolovat" button (the quiz's single bottom button). */
export interface QuestionControls {
  submit: () => void
}

/**
 * Renders any question kind. Calls `onAnswered(correct)` once the learner
 * presses "Zkontrolovat". Feedback and explanation are shown in place.
 * With `controls`, the question has no button of its own: the parent calls
 * `submit()` and learns from `onReadyChange` when an answer is complete.
 */
export function QuestionView({
  question,
  onAnswered,
  compact = false,
  controls,
  onReadyChange,
}: {
  question: Question
  onAnswered?: (correct: boolean) => void
  compact?: boolean
  controls?: Ref<QuestionControls>
  onReadyChange?: (ready: boolean) => void
}) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [result, setResult] = useState<boolean | null>(null)
  const done = result !== null
  const isReady = ready(question, answer)

  const submit = () => {
    if (!answer || done) return
    const ok = isCorrect(question, answer)
    setResult(ok)
    onAnswered?.(ok)
  }
  useImperativeHandle(controls, () => ({ submit }))
  useEffect(() => onReadyChange?.(isReady && !done), [isReady, done, onReadyChange])

  return (
    <div className={`qv${compact ? ' qv-compact' : ''}${done ? (result ? ' qv-ok' : ' qv-bad') : ''}`}>
      <div className="qv-hint">{KIND_HINT[question.kind]}</div>
      <div className="qv-q">
        <Md text={question.q} />
      </div>
      <Inputs question={question} answer={answer} setAnswer={setAnswer} locked={done} onEnter={submit} />
      {!done && !controls && (
        <div className="qv-actions">
          <button type="button" className="btn btn-primary" disabled={!isReady} onClick={submit}>
            Zkontrolovat
          </button>
        </div>
      )}
      <AnimatePresence>
      {done && (
        <motion.div
          className={`qv-feedback ${result ? 'ok' : 'bad'}`}
          role="status"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring.bouncy}
        >
          <div className="qv-verdict">
            <motion.span
              className="qv-verdict-icon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...spring.bouncy, delay: 0.08 }}
            >
              <Icon name={result ? 'check' : 'x'} />
            </motion.span>
            {result ? pick(PRAISE) : 'Tentokrát ne.'}
          </div>
          {!result && (
            <div className="qv-correct">
              Správně: <Md text={correctAnswerText(question)} />
            </div>
          )}
          {question.explain && (
            <div className="qv-explain">
              <Md text={question.explain} />
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

const PRAISE = ['Přesně tak!', 'Správně!', 'Výborně!', 'Paráda!', 'Trefa!', 'Skvělá práce!']
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)]

function ready(q: Question, a: Answer | null): boolean {
  if (!a) return false
  if (a.kind === 'multi') return a.indices.length > 0
  if (a.kind === 'number' || a.kind === 'text') return a.value.trim().length > 0
  if (a.kind === 'match' && q.kind === 'match') return Object.keys(a.pairs).length === q.pairs.length
  return true
}

function Inputs({
  question: q,
  answer,
  setAnswer,
  locked,
  onEnter,
}: {
  question: Question
  answer: Answer | null
  setAnswer: (a: Answer) => void
  locked: boolean
  onEnter: () => void
}) {
  switch (q.kind) {
    case 'choice':
    case 'multi':
      return <Options q={q} answer={answer} setAnswer={setAnswer} locked={locked} />
    case 'tf': {
      const v = answer?.kind === 'tf' ? answer.value : null
      return (
        <div className="qv-tf">
          {[true, false].map((b) => (
            <motion.button
              key={String(b)}
              animate={locked && v === b ? (q.answer === b ? bump : shake) : undefined}
              whileTap={locked ? undefined : { scale: 0.96 }}
              type="button"
              disabled={locked}
              className={`qv-opt${v === b ? ' sel' : ''}${locked && q.answer === b ? ' right' : ''}${locked && v === b && q.answer !== b ? ' wrong' : ''}`}
              onClick={() => setAnswer({ kind: 'tf', value: b })}
            >
              <Icon name={b ? 'check' : 'x'} /> {b ? 'Pravda' : 'Nepravda'}
            </motion.button>
          ))}
        </div>
      )
    }
    case 'number':
    case 'text': {
      const v = answer && (answer.kind === 'number' || answer.kind === 'text') ? answer.value : ''
      return (
        <div className="qv-input-row">
          <input
            className="qv-input"
            inputMode={q.kind === 'number' ? 'decimal' : 'text'}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={locked}
            placeholder={q.kind === 'text' ? (q.placeholder ?? 'Tvoje odpověď') : '0'}
            value={v}
            onChange={(e) => setAnswer({ kind: q.kind, value: e.target.value } as Answer)}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            aria-label="Odpověď"
          />
          {q.kind === 'number' && q.unit && <span className="qv-unit">{q.unit}</span>}
        </div>
      )
    }
    case 'order':
      return <Order q={q} answer={answer} setAnswer={setAnswer} locked={locked} />
    case 'match':
      return <Match q={q} answer={answer} setAnswer={setAnswer} locked={locked} />
  }
}

type Props<K extends Question['kind']> = {
  q: Extract<Question, { kind: K }>
  answer: Answer | null
  setAnswer: (a: Answer) => void
  locked: boolean
}

function Options({ q, answer, setAnswer, locked }: Props<'choice' | 'multi'>) {
  const order = useMemo(() => shuffle(q.options.map((_, i) => i)), [q])
  const multi = q.kind === 'multi'
  const selected = answer?.kind === 'choice' ? [answer.index] : answer?.kind === 'multi' ? answer.indices : []
  const correct = q.kind === 'choice' ? [q.answer] : q.answers
  const toggle = (i: number) => {
    if (!multi) return setAnswer({ kind: 'choice', index: i })
    const s = new Set(selected)
    if (s.has(i)) s.delete(i)
    else s.add(i)
    setAnswer({ kind: 'multi', indices: [...s] })
  }
  return (
    <motion.div className="qv-opts" variants={stagger(0.05)} initial="hidden" animate="show">
      {order.map((i, pos) => {
        const sel = selected.includes(i)
        const right = locked && correct.includes(i)
        const wrong = locked && sel && !correct.includes(i)
        return (
          <motion.div key={i} variants={rise}>
          <motion.button
            type="button"
            disabled={locked}
            animate={wrong ? shake : right && sel ? bump : undefined}
            whileTap={locked ? undefined : { scale: 0.98 }}
            aria-pressed={sel}
            className={`qv-opt${sel ? ' sel' : ''}${right ? ' right' : ''}${wrong ? ' wrong' : ''}`}
            onClick={() => toggle(i)}
          >
            <span className={`qv-key${multi ? ' sq' : ''}`}>{multi ? (sel ? '✓' : '') : 'ABCDEFG'[pos]}</span>
            <span>
              <Md text={q.options[i]} />
            </span>
          </motion.button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function Order({ q, answer, setAnswer, locked }: Props<'order'>) {
  const initial = useMemo(() => {
    let s = shuffle(q.items.map((_, i) => i))
    if (s.every((v, i) => v === i) && s.length > 1) s = [...s.slice(1), s[0]]
    return s
  }, [q])
  const order = answer?.kind === 'order' ? answer.order : initial
  const move = (pos: number, d: -1 | 1) => {
    const n = [...order]
    const t = pos + d
    if (t < 0 || t >= n.length) return
    ;[n[pos], n[t]] = [n[t], n[pos]]
    setAnswer({ kind: 'order', order: n })
  }
  return (
    <ol className="qv-order">
      {order.map((idx, pos) => (
        <motion.li layout transition={spring.snappy} key={idx} className={locked ? (idx === pos ? 'right' : 'wrong') : ''}>
          <span className="qv-order-n">{pos + 1}</span>
          <span className="qv-order-t">
            <Md text={q.items[idx]} />
          </span>
          {!locked && (
            <span className="qv-order-btns">
              <button type="button" className="btn btn-sm" aria-label="Posunout nahoru" disabled={pos === 0} onClick={() => move(pos, -1)}>
                ↑
              </button>
              <button
                type="button"
                className="btn btn-sm"
                aria-label="Posunout dolů"
                disabled={pos === order.length - 1}
                onClick={() => move(pos, 1)}
              >
                ↓
              </button>
            </span>
          )}
        </motion.li>
      ))}
      {!answer && !locked && (
        <li className="qv-order-confirm">
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAnswer({ kind: 'order', order })}>
            Pořadí je hotové
          </button>
        </li>
      )}
    </ol>
  )
}

const PAIR_COLORS = ['var(--cat-nonmetal)', 'var(--cat-transition)', 'var(--cat-post)', 'var(--cat-noble)', 'var(--cat-alkali)', 'var(--cat-metalloid)', 'var(--cat-alkaline)', 'var(--cat-lanthanide)']

function Match({ q, answer, setAnswer, locked }: Props<'match'>) {
  const rightOrder = useMemo(() => shuffle(q.pairs.map((_, i) => i)), [q])
  const [activeLeft, setActiveLeft] = useState<number | null>(null)
  const pairs = answer?.kind === 'match' ? answer.pairs : {}
  const colorOfLeft = (l: number) => PAIR_COLORS[l % PAIR_COLORS.length]
  const leftOfRight = (r: number) => {
    const e = Object.entries(pairs).find(([, v]) => v === r)
    return e ? Number(e[0]) : null
  }
  const pickRight = (r: number) => {
    if (activeLeft === null) return
    const n: Record<number, number> = {}
    for (const [l, v] of Object.entries(pairs)) if (v !== r && Number(l) !== activeLeft) n[Number(l)] = v
    n[activeLeft] = r
    setAnswer({ kind: 'match', pairs: n })
    const next = q.pairs.findIndex((_, i) => !(i in n))
    setActiveLeft(next === -1 ? null : next)
  }
  return (
    <div className="qv-match">
      <div className="qv-match-col">
        {q.pairs.map(([l], i) => (
          <button
            key={i}
            type="button"
            disabled={locked}
            className={`qv-opt${activeLeft === i ? ' sel' : ''}${locked ? (pairs[i] === i ? ' right' : ' wrong') : ''}`}
            style={i in pairs ? { background: colorOfLeft(i), color: 'var(--cat-ink)' } : undefined}
            onClick={() => setActiveLeft(i)}
          >
            <Md text={l} />
          </button>
        ))}
      </div>
      <div className="qv-match-col">
        {rightOrder.map((r) => {
          const l = leftOfRight(r)
          return (
            <button
              key={r}
              type="button"
              disabled={locked || activeLeft === null}
              className="qv-opt"
              style={l !== null ? { background: colorOfLeft(l), color: 'var(--cat-ink)' } : undefined}
              onClick={() => pickRight(r)}
            >
              <Md text={q.pairs[r][1]} />
            </button>
          )
        })}
      </div>
      {!locked && <p className="qv-match-help muted">Klepni vlevo, pak vpravo. Spojené dvojice mají stejnou barvu.</p>}
    </div>
  )
}
