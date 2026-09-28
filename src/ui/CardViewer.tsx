/**
 * Detail view for a set of cards (icon cards, process steps…): tap a card and it
 * opens big. One shared component, so every card set behaves the same way.
 *
 * - Phones: full-screen sheet. Swipe left/right = previous/next, swipe down = close.
 * - Wide screens: a centered dialog over the dimmed page.
 * - Always visible controls: close, "n / total", ‹ ›, dots. Keys: ← → Esc.
 */
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ChemIcon } from '../illustrations/catalog'
import { Medal } from '../illustrations/blocks/Medal'
import { Md } from '../core/markup'
import { Icon } from './Icon'
import './card-viewer.css'

export interface ViewerCard {
  icon?: ChemIcon
  /** small label above the title, e.g. "Krok 2" */
  kicker?: string
  title: string
  text?: string
  /** optional extra content under the text */
  extra?: ReactNode
}

const CLOSE = 110

export function CardViewer({
  cards,
  index,
  onIndex,
  onClose,
  tone,
  label = 'Detail karty',
}: {
  cards: ViewerCard[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  /** level colour of the page the cards come from */
  tone?: string
  label?: string
}) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const lock = useRef<'x' | 'y' | null>(null)
  const [w, setW] = useState(0)
  const last = cards.length - 1

  // the track holds every card side by side; x = -index * width (+ finger offset)
  const x = useMotionValue(0)
  // the whole sheet follows a downward swipe; the backdrop fades with it
  const sheetY = useMotionValue(0)
  const shade = useTransform(sheetY, [0, 420], [1, 0.15])
  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 330, damping: 36 }

  const go = (n: number) => {
    if (n < 0 || n > last) return
    if (n === index) animate(x, -index * w, spring)
    else onIndex(n)
  }

  useLayoutEffect(() => {
    const el = viewRef.current
    if (!el) return
    const measure = () => setW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // first layout: jump; later index changes: slide
  const placed = useRef(false)
  useLayoutEffect(() => {
    if (!w) return
    if (!placed.current) {
      x.set(-index * w)
      placed.current = true
    } else animate(x, -index * w, spring)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, w])

  // focus, keys and scroll lock while open
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      prevFocus?.focus?.()
    }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const onDrag = (_: unknown, info: PanInfo) => {
    if (lock.current === 'y') sheetY.set(Math.max(0, info.offset.y))
  }
  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (lock.current === 'y') {
      if (offset.y > CLOSE || velocity.y > 700) onClose()
      else animate(sheetY, 0, spring)
    } else {
      let n = index
      if (offset.x < -w * 0.18 || velocity.x < -450) n = index + 1
      else if (offset.x > w * 0.18 || velocity.x > 450) n = index - 1
      go(Math.max(0, Math.min(last, n)))
    }
    lock.current = null
  }

  const style = tone ? ({ '--level': tone } as CSSProperties) : undefined

  return createPortal(
    <div className="cv" style={style}>
      <motion.div className="cv-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="cv-shade" style={{ opacity: shade }} />
      </motion.div>
      <motion.div
        className="cv-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        style={{ y: sheetY }}
        initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 240 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      >
        <div className="cv-top">
          <span className="cv-count tabnum">
            {index + 1} / {cards.length}
          </span>
          <button ref={closeRef} type="button" className="cv-close" onClick={onClose} aria-label="Zavřít">
            <Icon name="x" />
          </button>
        </div>

        <div className="cv-view" ref={viewRef}>
          <motion.div
            className="cv-track"
            style={{ x, width: w ? w * cards.length : undefined }}
            drag
            dragDirectionLock
            onDirectionLock={(axis) => (lock.current = axis)}
            dragConstraints={{ left: -last * w, right: 0, top: 0, bottom: 0 }}
            dragElastic={{ left: 0.22, right: 0.22, top: 0, bottom: 0 }}
            dragMomentum={false}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          >
            {cards.map((card, i) => (
              <article key={i} className="cv-card" style={{ width: w || '100%' }} aria-hidden={i !== index}>
                {card.icon && (
                  <div className="cv-medal">
                    <Medal icon={card.icon} size="xl" />
                  </div>
                )}
                <span className="cv-kicker">{card.kicker ?? `№ ${i + 1}`}</span>
                <h2 className="cv-title">
                  <Md text={card.title} />
                </h2>
                {card.text && (
                  <p className="cv-text">
                    <Md text={card.text} />
                  </p>
                )}
                {card.extra}
              </article>
            ))}
          </motion.div>
        </div>

        <div className="cv-nav">
          <button type="button" className="cv-arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Předchozí">
            <Icon name="arrowLeft" />
          </button>
          <div className="cv-dots" role="tablist" aria-label="Karty">
            {cards.map((c, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}: ${c.title.replace(/[*$_^{}=]/g, '')}`}
                className={`cv-dot${i === index ? ' on' : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button type="button" className="cv-arrow" onClick={() => go(index + 1)} disabled={index === last} aria-label="Další">
            <Icon name="arrowRight" />
          </button>
        </div>
        <p className="cv-hint" aria-hidden="true">
          Přejeď do stran · dolů zavřeš
        </p>
      </motion.div>
    </div>,
    document.body,
  )
}

/** State helper: which card of a set is open (null = closed) and the page's level colour. */
export function useCardViewer() {
  const [open, setOpen] = useState<number | null>(null)
  const [tone, setTone] = useState<string | undefined>()
  const openAt = (i: number, from?: HTMLElement | null) => {
    if (from) setTone(getComputedStyle(from).getPropertyValue('--level').trim() || undefined)
    setOpen(i)
  }
  return { open, tone, openAt, setOpen, close: () => setOpen(null) }
}
