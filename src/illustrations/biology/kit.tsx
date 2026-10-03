/**
 * Small drawing kit for the parametric biology blocks (punnett, pedigree).
 * Builds on the physics plate (src/illustrations/physics/kit.tsx): the same
 * engraved line art, theme tokens, tones (a = level colour), SvgMd markup,
 * draw-in and reduced-motion handling. Classes prefixed bio-.
 */
import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { ease } from '../../ui/motion'
import { Md } from '../../core/markup'
import type { Tone } from '../../core/types'
import './biology.css'

export { Draw, Fade, Plate, SvgMd, f1, say, textW, url, useNarrow, usePlate } from '../physics/kit'

const TONES: Tone[] = ['a', 'b', 'c', 'd']
/** Tone of the i-th group; from the 5th group on the tones repeat with hatching. */
export const groupTone = (i: number): { tone: Tone; hatch: boolean } => ({ tone: TONES[i % 4], hatch: i >= 4 })

/** Pops a part in (scale + fade from its own centre); custom = delay in s. */
export const popV: Variants = {
  hidden: { opacity: 0, scale: 0.55 },
  show: (d: unknown) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: typeof d === 'number' ? d : 0, duration: 0.32, ease: ease.out },
  }),
}

export function Pop({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <motion.g variants={popV} custom={delay} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      {children}
    </motion.g>
  )
}

/** A tinted swatch for HTML keys under a plate (same look as a shaded cell). */
export function Swatch({ tone, hatch }: { tone: Tone; hatch?: boolean }) {
  return (
    <svg viewBox="0 0 14 14" width={14} height={14} aria-hidden="true" className={`bio-swatch ph-tone-${tone}`}>
      <rect x={0.75} y={0.75} width={12.5} height={12.5} rx={2} className="bio-tint" />
      {hatch && <path d="M1 9 L9 1 M5 13 L13 5" className="bio-swatch-hl" />}
    </svg>
  )
}

/** A row of the key: a small caps term and inline markup. */
export function KeyRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <p className="bio-key-row">
      <span className="bio-key-term">{term}</span> {children}
    </p>
  )
}

export const md = (text: string) => <Md text={text} />

/** Czech plural: plural(5, ['osoba', 'osoby', 'osob']) → "osob". */
export function plural(n: number, forms: [string, string, string]): string {
  return n === 1 ? forms[0] : n >= 2 && n <= 4 ? forms[1] : forms[2]
}
