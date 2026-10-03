/**
 * Model of the `bacterial-growth` experiment: one bacterium in ideal conditions
 * (enough food and room) divides every `doubling` minutes, so after k divisions
 * there are 2^k cells. E. coli at 37 °C manages it in about 20 minutes; in real
 * life the food runs out and growth slows down long before the dish is full.
 */

export const START = 1

export function bacteria(tMin: number, doublingMin: number): { generations: number; count: number } {
  const generations = Math.max(0, Math.floor(tMin / doublingMin + 1e-9))
  return { generations, count: START * 2 ** generations }
}

/** First time (min) when the count goes over `target`, i.e. after the division that crosses it. */
export function timeToExceed(target: number, doublingMin: number): number {
  let k = 0
  while (START * 2 ** k <= target) k++
  return k * doublingMin
}

/** Most dots the dish draws. */
export const MAX_DOTS = 256

/**
 * How many bacteria one drawn dot stands for (a power of two), so that at most
 * MAX_DOTS dots are drawn; and how many dots that is.
 */
export function dotScale(count: number): { perDot: number; dots: number } {
  let perDot = 1
  while (count / perDot > MAX_DOTS) perDot *= 2
  return { perDot, dots: Math.max(1, Math.round(count / perDot)) }
}

/** Dot positions in a sunflower spiral filling a disc of radius r (the first dot in the centre). */
export function dotPositions(n: number, r: number, max = MAX_DOTS): [number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const out: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const rr = r * Math.sqrt((i + 0.5) / max)
    const a = i * golden
    out.push([rr * Math.cos(a), rr * Math.sin(a)])
  }
  return out
}

/** Czech plural: 1 bakterie, 2–4 bakterie, 5 a víc bakterií. */
export const bakterie = (n: number) => (n === 1 || (n >= 2 && n <= 4) ? 'bakterie' : 'bakterií')

/** "2 h 20 min" */
export function hm(tMin: number): string {
  const h = Math.floor(tMin / 60)
  const m = Math.round(tMin - h * 60)
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}
