/**
 * Greedy label placement for GeoMap: boxes in SVG units; a label takes the first candidate that collides with
 * nothing already placed and stays inside the drawing. Optional labels (graticule, names) are dropped when no
 * candidate fits; required ones (points) take the least bad candidate.
 */
export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export const overlaps = (a: Box, b: Box, pad = 0) =>
  a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad

export class Placer {
  taken: Box[] = []
  constructor(
    readonly W: number,
    readonly H: number,
    /** gap kept between labels, SVG units */
    readonly pad = 0,
  ) {}
  inside(b: Box) {
    return b.x >= 1 && b.y >= 1 && b.x + b.w <= this.W - 1 && b.y + b.h <= this.H - 1
  }
  free(b: Box) {
    return this.inside(b) && !this.taken.some((t) => overlaps(b, t, this.pad))
  }
  /** Reserve a box (a symbol) without placing a label. */
  block(b: Box) {
    this.taken.push(b)
  }
  /** First free candidate, or (required) the least colliding one inside the drawing; null if none. */
  place(cands: Box[], required = false): Box | null {
    for (const c of cands)
      if (this.free(c)) {
        this.taken.push(c)
        return c
      }
    if (!required) return null
    let best: Box | null = null
    let bs = Infinity
    for (const c of cands) {
      let s = this.inside(c) ? 0 : 1000
      for (const t of this.taken) if (overlaps(c, t, this.pad)) s += 1
      if (s < bs) {
        bs = s
        best = c
      }
    }
    if (best) this.taken.push(best)
    return best
  }
}
