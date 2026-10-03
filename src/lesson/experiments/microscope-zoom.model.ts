/**
 * Model of the `microscope-zoom` experiment: what you see in the eyepiece of a
 * school light microscope at each magnification (all values approximate).
 *
 * - magnification = eyepiece × objective (okulár 10×; objektivy 4×, 10×, 40×);
 *   the first step is a hand lens (lupa) 10×,
 * - field of view = field number of the eyepiece (≈ 18 mm) / objective; a 10×
 *   hand lens shows a field of about 15 mm,
 * - onion skin (pokožka cibule, iodine-stained): long cells ≈ 250 × 60 µm with a
 *   cellulose wall, nucleus ≈ 20 µm; cheek cells (buňky ústní sliznice, methylene
 *   blue): flat cells ≈ 60 µm across, no wall, nucleus ≈ 9 µm.
 */

export interface Step {
  /** total magnification */
  mag: number
  /** eyepiece × objective; null for the hand lens */
  ocular: number | null
  objective: number | null
  /** diameter of the field of view in µm */
  field: number
}

export const FIELD_NUMBER_UM = 18000

export const STEPS: Step[] = [
  { mag: 10, ocular: null, objective: null, field: 15000 },
  { mag: 40, ocular: 10, objective: 4, field: FIELD_NUMBER_UM / 4 },
  { mag: 100, ocular: 10, objective: 10, field: FIELD_NUMBER_UM / 10 },
  { mag: 400, ocular: 10, objective: 40, field: FIELD_NUMBER_UM / 40 },
]

export const SAMPLES = {
  cibule: { name: 'pokožka cibule', cellW: 250, cellH: 60, nucleus: 20, wall: true },
  lice: { name: 'buňky ústní sliznice', cellW: 80, cellH: 80, nucleus: 10, wall: false },
} as const
export type SampleId = keyof typeof SAMPLES

export type Structure = 'vzorek' | 'bunky' | 'stena' | 'membrana' | 'jadro' | 'jaderko' | 'cytoplazma'

export const STRUCTURE_NAMES: Record<Structure, string> = {
  vzorek: 'kousek vzorku',
  bunky: 'jednotlivé buňky',
  stena: 'buněčná stěna',
  membrana: 'buněčná membrána',
  jadro: 'jádro',
  jaderko: 'jadérko',
  cytoplazma: 'cytoplazma',
}

/**
 * The smallest detail the eye still makes out in the image is about 0,2 mm
 * (200 µm) divided by the magnification; a structure shows when it is a few
 * times larger than that.
 */
export const resolvableUm = (mag: number) => 200 / mag

/**
 * What can be made out in the sample at this magnification (from coarse to fine).
 * Pale, thin structures need to be several resolvable details across: a cell
 * ≥ 4, a stained nucleus ≥ 8, the grainy cytoplasm round it ≥ 16, a nucleolus
 * inside the nucleus ≥ 30.
 */
export function visible(sample: SampleId, mag: number): Structure[] {
  const s = SAMPLES[sample]
  const d = resolvableUm(mag)
  const out: Structure[] = ['vzorek']
  if (s.cellH >= 4 * d) out.push('bunky', s.wall ? 'stena' : 'membrana')
  if (s.nucleus >= 8 * d) out.push('jadro')
  if (s.nucleus >= 16 * d) out.push('cytoplazma')
  if (s.nucleus >= 30 * d) out.push('jaderko')
  return out
}

export const seesNucleus = (sample: SampleId, mag: number) => visible(sample, mag).includes('jadro')

/** px per µm when the field of view (diameter in µm) is drawn `diameterPx` wide. */
export const scaleAt = (step: Step, diameterPx: number) => diameterPx / step.field

/** A "nice" scale bar length in µm, about a quarter of the field. */
export function scaleBar(field: number): number {
  const raw = field / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  const f = raw / mag
  return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * mag
}

// ------------------------------------------------------------------ the slide (µm, field centre = 0, 0)

function hash01(...xs: number[]): number {
  let h = 2166136261
  for (const x of xs) {
    h ^= x
    h = Math.imul(h, 16777619)
    h ^= h >>> 13
    h = Math.imul(h, 0x5bd1e995)
    h ^= h >>> 15
  }
  return (h >>> 0) / 4294967296
}

export interface Cell {
  /** outline as points (µm) */
  pts: [number, number][]
  /** nucleus centre and radius (µm) */
  nx: number
  ny: number
  nr: number
}

/** Outline of the whole specimen on the slide (a torn piece of skin, or the smear). */
export function specimenOutline(sample: SampleId): [number, number][] {
  const pts: [number, number][] = []
  const n = 40
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const wob = 1 + 0.07 * Math.sin(3 * a + 1) + 0.05 * (hash01(5, i) - 0.5)
    if (sample === 'cibule') {
      // a rounded rectangle, about 8 × 6 mm, shifted a little off the centre
      const c = Math.cos(a)
      const s = Math.sin(a)
      const k = 1 / Math.max(Math.abs(c) / 4000, Math.abs(s) / 3000)
      pts.push([600 + c * k * 0.98 * wob, 300 + s * k * 0.98 * wob])
    } else pts.push([400 + Math.cos(a) * 2600 * wob, -200 + Math.sin(a) * 2100 * wob])
  }
  return pts
}

const inside = (pts: [number, number][], x: number, y: number) => {
  let r = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]
    const [xj, yj] = pts[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r
  }
  return r
}

/**
 * The cells reaching into a circle of `radius` µm round the field centre (and
 * inside the specimen). Onion: rows of long cells laid like bricks; cheek: loose flat
 * cells scattered over the smear.
 */
export function cellsNear(sample: SampleId, radius: number): Cell[] {
  const S = SAMPLES[sample]
  const outline = specimenOutline(sample)
  const out: Cell[] = []
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
  if (sample === 'cibule') {
    const H = S.cellH
    const j0 = Math.floor(-radius / H) - 1
    const j1 = Math.ceil(radius / H) + 1
    for (let j = j0; j <= j1; j++) {
      const y = j * H
      let x = -4000 - hash01(1, j) * S.cellW
      for (let k = 0; x < 4000; k++) {
        const w = S.cellW * (0.75 + 0.5 * hash01(2, j, k))
        const cx = x + w / 2
        const cy = y + H / 2
        // the nearest point of the cell to the field centre is in the field
        const px = clamp(0, x, x + w)
        const py = clamp(0, y, y + H)
        if (px * px + py * py <= radius * radius && inside(outline, cx, cy)) {
          const t = hash01(3, j, k)
          out.push({
            pts: [
              [x, y],
              [x + w, y],
              [x + w, y + H],
              [x, y + H],
            ],
            nx: x + w * (0.25 + 0.5 * t),
            ny: cy + (hash01(4, j, k) - 0.5) * H * 0.3,
            nr: S.nucleus / 2,
          })
        }
        x += w
      }
    }
  } else {
    const g = 170
    const n = Math.ceil(radius / g) + 1
    for (let j = -n; j <= n; j++)
      for (let i = -n; i <= n; i++) {
        if (hash01(6, i, j) > 0.85) continue
        const cx = i * g + (hash01(7, i, j) - 0.5) * 150
        const cy = j * g + (hash01(8, i, j) - 0.5) * 150
        const reach = radius + S.cellW / 2
        if (cx * cx + cy * cy > reach * reach || !inside(outline, cx, cy)) continue
        const rot = hash01(9, i, j) * Math.PI * 2
        const pts: [number, number][] = []
        for (let v = 0; v < 7; v++) {
          const a = rot + (v / 7) * Math.PI * 2
          const r = (S.cellW / 2) * (0.85 + 0.3 * hash01(10, i, j, v))
          pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.85])
        }
        out.push({
          pts,
          nx: cx + (hash01(11, i, j) - 0.5) * 10,
          ny: cy + (hash01(12, i, j) - 0.5) * 10,
          nr: S.nucleus / 2,
        })
      }
  }
  return out
}
