import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView } from 'motion/react'
import { fadeUp, spring, stagger } from './motion'

/** Motion-enabled router link (for pressable cards). */
export const MLink = motion.create(Link)

/** Page wrapper: fades up on mount and staggers its direct `rise`/`popIn` children. */
export function Page({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.main
      className={`page ${className}`}
      style={style}
      variants={{ ...fadeUp, show: { ...(fadeUp.show as object), transition: { duration: 0.4, staggerChildren: 0.07 } } }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.main>
  )
}

/** Section that reveals its children in sequence when scrolled into view. */
export function Reveal({ children, className = '', step = 0.07 }: { children: ReactNode; className?: string; step?: number }) {
  return (
    <motion.div className={className} variants={stagger(step)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
      {children}
    </motion.div>
  )
}

/** Progress bar whose fill springs to the new value. */
export function Bar({ value, color, className = '', label }: { value: number; color?: string; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(1, value))
  return (
    <div
      className={`progress ${className}`}
      style={color ? ({ ['--bar' as string]: color } as React.CSSProperties) : undefined}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
    >
      <motion.span initial={{ width: 0 }} animate={{ width: `${v * 100}%` }} transition={spring.gentle} />
    </div>
  )
}

/** Number that counts up to its value when it first appears or changes. */
export function CountUp({ value, duration = 0.9, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const from = useRef(0)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(from.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${Math.round(v).toLocaleString('cs-CZ')}${suffix}`
      },
    })
    from.current = value
    return () => controls.stop()
  }, [value, inView, duration, prefix, suffix])
  return (
    <span ref={ref} className="tabnum">
      {prefix}0{suffix}
    </span>
  )
}
