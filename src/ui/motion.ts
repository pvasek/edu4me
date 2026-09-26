/**
 * Shared animation language (see spec/style-guide.md → Motion).
 *
 * Rule of thumb:
 *  - Motion (`motion/react`) for anything that enters, leaves, changes layout,
 *    reacts to a gesture or runs as a sequence: pages, lesson steps, feedback,
 *    cards, path maps, counters, toasts, game pieces.
 *  - Plain CSS only for hover/press transitions and infinite ambient loops
 *    (orbiting electrons, a pulsing "current" node).
 *
 * Always use these presets instead of ad-hoc timings so the app feels like one piece.
 * <MotionConfig reducedMotion="user"> in App.tsx turns transforms off for
 * people who ask for reduced motion.
 */
import type { Transition, Variants } from 'motion/react'

export const spring = {
  /** buttons, chips, small pops */
  snappy: { type: 'spring', stiffness: 520, damping: 30 } satisfies Transition,
  /** rewards, stars, mascot */
  bouncy: { type: 'spring', stiffness: 380, damping: 14 } satisfies Transition,
  /** panels, pages, layout changes */
  gentle: { type: 'spring', stiffness: 170, damping: 24 } satisfies Transition,
}

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
}

/** Page / panel entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

/** Parent that reveals its children one after another. */
export const stagger = (step = 0.06, delay = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})

/** Child of `stagger`: rises in. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out } },
}

/** Child of `stagger`: pops in with a spring (nodes, tiles, badges). */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: spring.bouncy },
}

/** Horizontal slide between steps; use with custom={direction} (1 forward, -1 back). */
export const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.38, ease: ease.out } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.2 } }),
}

/** Keyframes for a wrong answer. */
export const shake = { x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.42 } }

/** Keyframes for a right answer. */
export const bump = { scale: [1, 1.06, 1], transition: { duration: 0.32, ease: ease.out } }

/** Tap/hover props for interactive cards. */
export const pressable = {
  whileHover: { y: -3, rotate: -0.4 },
  whileTap: { scale: 0.97, y: 1 },
  transition: spring.snappy,
}
