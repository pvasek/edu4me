/** CPK atom colours (subject colours, see spec/illustration-guide.md) and display radii. */
import { BY_SYMBOL } from '../../courses/chemie/data/elements'

export const CPK: Record<string, string> = {
  H: '#f4f1ea',
  C: '#3b3b3b',
  N: '#3d6fd1',
  O: '#d9493b',
  S: '#e0b43a',
  P: '#e88b35',
  Cl: '#4fae5a',
  F: '#8fcf6b',
  Br: '#8c3a2b',
  I: '#6b3f8f',
  Na: '#8a63c9',
  K: '#7a4fb3',
  Ca: '#6b8c7a',
  Mg: '#5c9a6b',
  Fe: '#b86a3c',
  Cu: '#c7773d',
  Zn: '#8a93a3',
  Al: '#a3a8b3',
  Si: '#c2a36b',
}
export const cpk = (el: string) => CPK[el] ?? '#b3a58f'

/** Ball radius (Å) in the ball-and-stick model. */
const BALL: Record<string, number> = {
  H: 0.24, C: 0.37, N: 0.36, O: 0.35, F: 0.33, Cl: 0.46, Br: 0.5, I: 0.56, S: 0.47, P: 0.47, B: 0.37, Be: 0.38, Xe: 0.56,
}
export const ballRadius = (el: string) => BALL[el] ?? 0.45

/** Particle radius (Å) for the compact, space-filling-like particle glyphs. */
const PART: Record<string, number> = {
  H: 0.55, C: 0.8, N: 0.76, O: 0.74, F: 0.7, Cl: 0.98, Br: 1.06, I: 1.2, S: 0.98, P: 0.98, B: 0.82, Xe: 1.1,
  He: 0.6, Ne: 0.7, Ar: 0.9, Kr: 1.0,
}
export function particleRadius(el: string): number {
  if (PART[el]) return PART[el]
  const cat = BY_SYMBOL[el]?.category
  if (cat === 'alkali' || cat === 'alkaline') return 1.15
  if (cat === 'transition' || cat === 'post' || cat === 'lanthanide' || cat === 'actinide') return 1.05
  return 0.9
}

export const isMetal = (el: string) => {
  const c = BY_SYMBOL[el]?.category
  return c === 'alkali' || c === 'alkaline' || c === 'transition' || c === 'post' || c === 'lanthanide' || c === 'actinide'
}

/** Czech element name in lower case ("kyslík"). */
export function elementName(el: string): string {
  const n = BY_SYMBOL[el]?.name
  return n ? n.charAt(0).toLowerCase() + n.slice(1) : el
}

/** "2−", "+", "3+" */
export function chargeLabel(q: number): string {
  if (!q) return ''
  const n = Math.abs(q)
  return (n > 1 ? String(n) : '') + (q > 0 ? '+' : '−')
}
