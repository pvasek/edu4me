/**
 * Detail view for a set of cards (icon cards, process steps…): tap a card and it
 * opens big. One shared component, so every card set behaves the same way.
 *
 * - Phones: full-screen sheet. Swipe left/right = previous/next, swipe down = close.
 * - Wide screens: a centered dialog over the dimmed page.
 * - Always visible controls: close, "n / total", ‹ ›, dots. Keys: ← → Esc.
 */
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
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

const SWIPE = 70
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
  const [dir, setDir] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const last = cards.length - 1
  const card = cards[index]

  const go = (n: number) => {
    if (n < 0 || n > last || n === index) return
    setDir(n > index ? 1 : -1)
    onIndex(n)
  }

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

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x < -SWIPE || velocity.x < -500) go(index + 1)
      else if (offset.x > SWIPE || velocity.x > 500) go(index - 1)
    } else if (offset.y > CLOSE || velocity.y > 700) onClose()
  }

  const style = tone ? ({ '--level': tone } as CSSProperties) : undefined
  const slide = reduce ? 0 : 60

  return createPortal(
    <div className="cv" style={style}>
      <motion.div className="cv-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="cv-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ opacity: 0, y: reduce ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : 60 }}
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

        <motion.div
          className="cv-track"
          drag
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.6}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
        >
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.article
              key={index}
              className="cv-card"
              custom={dir}
              initial={{ opacity: 0, x: dir * slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -dir * slide }}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              {card.icon && (
                <div className="cv-medal">
                  <Medal icon={card.icon} size="xl" />
                </div>
              )}
              <span className="cv-kicker">{card.kicker ?? `№ ${index + 1}`}</span>
              <h2 className="cv-title">
                <Md text={card.title} />
              </h2>
              {card.text && (
                <p className="cv-text">
                  <Md text={card.text} />
                </p>
              )}
              {card.extra}
            </motion.article>
          </AnimatePresence>
        </motion.div>

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
