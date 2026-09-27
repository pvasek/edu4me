import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { levelNum, type GameProps } from '../types'
import { Md } from '../../core/markup'
import { chemie } from '../../courses/chemie'
import { Icon } from '../../ui/Icon'
import { Mascot, MascotSays, type Mood } from '../../ui/Mascot'
import { ease, popIn, shake, spring } from '../../ui/motion'
import { playLevel, swipeDeck, type SwipeCard } from './pool'
import './swipe.css'

type Phase = 'loading' | 'empty' | 'play' | 'done'
type Dir = 'left' | 'right'

interface Toast {
  id: number
  ok: boolean
  truth: boolean
  explain?: string
}

export default function Swipe({ levelId, onFinish }: GameProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [cards, setCards] = useState<SwipeCard[]>([])
  const level = levelNum(playLevel(levelId))
  const [pos, setPos] = useState(0)
  const [exitDir, setExitDir] = useState<1 | -1>(1)
  const [toast, setToast] = useState<Toast | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const finished = useRef(false)
  const toastId = useRef(0)

  useEffect(() => {
    let alive = true
    swipeDeck(chemie, levelId)
      .catch(() => [])
      .then((picked) => {
        if (!alive) return
        if (!picked.length) {
          setPhase('empty')
          return
        }
        setCards(picked)
        setPhase('play')
      })
    return () => {
      alive = false
    }
  }, [levelId])

  const finish = useCallback(
    (s: number, max: number) => {
      if (finished.current) return
      finished.current = true
      onFinish({ score: s, max })
    },
    [onFinish],
  )

  const commit = useCallback(
    (dir: Dir) => {
      if (phase !== 'play' || pos >= cards.length) return
      const q = cards[pos].question
      const ok = (dir === 'right') === q.answer
      setExitDir(dir === 'right' ? 1 : -1)
      setScore((s) => s + (ok ? 1 : 0))
      const ns = ok ? streak + 1 : 0
      setStreak(ns)
      setBest((b) => Math.max(b, ns))
      setToast({ id: ++toastId.current, ok, truth: q.answer, explain: q.explain })
      const next = pos + 1
      setPos(next)
      if (next >= cards.length) setPhase('done')
    },
    [phase, pos, cards, streak],
  )

  // Keyboard: ← = nepravda, → = pravda.
  useEffect(() => {
    if (phase !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const k = e.key.toLowerCase()
      if (k === 'arrowleft' || k === 'n') {
        e.preventDefault()
        commit('left')
      } else if (k === 'arrowright' || k === 'p') {
        e.preventDefault()
        commit('right')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, commit])

  if (phase === 'loading') {
    return (
      <div className="g-sw g-sw-center">
        <MascotSays mood="think">Míchám kartičky…</MascotSays>
      </div>
    )
  }
  if (phase === 'empty') {
    return (
      <div className="g-sw g-sw-center">
        <MascotSays mood="sad">Pro tuhle úroveň tu zatím nemám žádná tvrzení. Brzy je doplníme, zkus to prosím později!</MascotSays>
        <button type="button" className="btn btn-primary" onClick={() => finish(0, 1)}>
          Rozumím
        </button>
      </div>
    )
  }

  const mood: Mood =
    phase === 'done' ? (score >= cards.length * 0.75 ? 'cheer' : 'happy') : toast ? (toast.ok ? (streak >= 3 ? 'cheer' : 'happy') : 'sad') : 'think'

  return (
    <div className="g-sw">
      <div className="g-sw-top">
        <p className="g-sw-instr">Pravdivé tvrzení odhoď doprava, nepravdivé doleva. Nebo použij tlačítka či šipky.</p>
        <span className="chip chip-soft g-sw-level" title={level ? `Tvrzení z úrovně ${level}` : 'Tvrzení ze všech úrovní'}>
          <Icon name="book" /> {level ? `Úroveň ${level}` : 'Vše'}
        </span>
      </div>

      <div className="g-sw-hud">
        <span className="chip">
          <Icon name="book" /> {Math.min(pos + 1, cards.length)}/{cards.length}
        </span>
        <motion.span
          className="chip"
          key={`sc${score}`}
          initial={score ? { scale: 1.25 } : false}
          animate={{ scale: 1 }}
          transition={spring.bouncy}
        >
          <Icon name="star" /> {score}
        </motion.span>
        <motion.span
          className={`chip g-sw-streak${streak >= 3 ? ' hot' : ''}`}
          key={`st${streak}`}
          initial={streak ? { scale: 1.25, rotate: -6 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={spring.bouncy}
        >
          <Icon name="flame" /> Série {streak}
        </motion.span>
        <span className="g-sw-spacer" />
        <Mascot mood={mood} size={48} />
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(pos / cards.length) * 100}%` }} />
      </div>

      <div className="g-sw-stage">
        <AnimatePresence initial={false} custom={exitDir}>
          {phase === 'done' ? (
            <motion.div key="done" className="g-sw-done card" variants={popIn} initial="hidden" animate="show">
              <Mascot mood={mood} size={80} />
              <div className="g-sw-done-text">
                <strong>Hotovo!</strong>
                <span>
                  {score} z {cards.length} správně, nejdelší série {best}.
                </span>
              </div>
            </motion.div>
          ) : (
            cards
              .slice(pos, pos + 3)
              .map((q, i) => (
                <Card
                  key={pos + i}
                  q={q.question}
                  review={q.review}
                  n={pos + i + 1}
                  total={cards.length}
                  depth={i}
                  onCommit={commit}
                />
              ))
              .reverse()
          )}
        </AnimatePresence>
      </div>

      {phase === 'play' ? (
        <div className="g-sw-buttons">
          <button type="button" className="btn btn-lg g-sw-btn no" onClick={() => commit('left')}>
            <Icon name="x" /> Nepravda
          </button>
          <button type="button" className="btn btn-lg g-sw-btn yes" onClick={() => commit('right')}>
            <Icon name="check" /> Pravda
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => finish(score, cards.length)} autoFocus>
          Zobrazit výsledky <Icon name="arrowRight" />
        </button>
      )}

      <div className="g-sw-toast-slot" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {toast && (
            <motion.div
              key={toast.id}
              className={`g-sw-toast ${toast.ok ? 'ok' : 'bad'}`}
              role="status"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={toast.ok ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1, x: shake.x }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              transition={{ default: spring.snappy, x: { ...shake.transition, delay: 0.08 } }}
            >
              <div className="g-sw-toast-head">
                <Icon name={toast.ok ? 'check' : 'x'} />
                {toast.ok ? 'Správně!' : `Vedle! Tvrzení bylo ${toast.truth ? 'pravdivé' : 'nepravdivé'}.`}
              </div>
              {toast.explain && (
                <div className="g-sw-toast-body">
                  <Md text={toast.explain} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Card in the stack. Only the top one (depth 0) can be dragged. */
function Card({
  q,
  review,
  n,
  total,
  depth,
  onCommit,
}: {
  q: SwipeCard['question']
  review: boolean
  n: number
  total: number
  depth: number
  onCommit: (dir: Dir) => void
}) {
  const top = depth === 0
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-16, 16])
  const yes = useTransform(x, [12, 110], [0, 1])
  const no = useTransform(x, [-110, -12], [1, 0])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const width = ref.current?.offsetWidth || 300
    const dx = info.offset.x
    if (Math.abs(dx) > Math.min(110, width * 0.3) || (Math.abs(info.velocity.x) > 600 && Math.abs(dx) > 30)) {
      onCommit(dx > 0 ? 'right' : 'left')
    } else {
      animate(x, 0, spring.snappy)
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`g-sw-card${top ? ' top' : ''}`}
      style={{ x, rotate, zIndex: 3 - depth }}
      initial={{ opacity: 0, y: 36, scale: 0.85 }}
      animate={{ opacity: 1, y: depth * 12, scale: 1 - depth * 0.05 }}
      exit="fly"
      variants={{
        fly: (dir: number) => ({
          x: dir * 520,
          opacity: 0,
          transition: { duration: 0.32, ease: ease.inOut },
        }),
      }}
      transition={spring.gentle}
      drag={top ? 'x' : false}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      aria-hidden={!top}
      role={top ? 'group' : undefined}
      aria-label={top ? `Tvrzení ${n} z ${total}` : undefined}
    >
      {top && (
        <>
          <motion.div className="g-sw-tint right" style={{ opacity: yes }} aria-hidden="true" />
          <motion.div className="g-sw-tint left" style={{ opacity: no }} aria-hidden="true" />
          <motion.span className="g-sw-stamp right" style={{ opacity: yes }} aria-hidden="true">
            <Icon name="check" /> Pravda
          </motion.span>
          <motion.span className="g-sw-stamp left" style={{ opacity: no }} aria-hidden="true">
            <Icon name="x" /> Nepravda
          </motion.span>
        </>
      )}
      <div className="g-sw-eyebrow">
        <span className="eyebrow">Tvrzení {n}</span>
        {review && (
          <span className="g-sw-review" title="Tvrzení z předchozí úrovně">
            <Icon name="refresh" /> opakování
          </span>
        )}
      </div>
      <div className="g-sw-q">
        <Md text={q.q} />
      </div>
      <div className="g-sw-hint muted" aria-hidden="true">
        <Icon name="arrowLeft" /> nepravda · pravda <Icon name="arrowRight" />
      </div>
    </motion.div>
  )
}
