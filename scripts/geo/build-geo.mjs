#!/usr/bin/env node
/**
 * Builds the map data of the Zeměpis course: src/geo/data/*.ts and src/geo/codes.ts.
 *
 *   node scripts/geo/build-geo.mjs [--cache DIR] [--only world,europe]
 *
 * Dependency-free (Node ≥ 22.18: it imports the TypeScript view presets from src/geo directly).
 * Sources, downloaded once into the cache folder (default: $TMPDIR/natural-earth-cache):
 *   - Natural Earth (public domain, https://www.naturalearthdata.com), from
 *     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/:
 *     admin-0 countries 1:50m and 1:10m, admin-1 states/provinces 1:10m (Czech kraje),
 *     rivers + lake centrelines 1:50m and 1:10m (+ the 1:10m Europe supplement), lakes 1:50m and 1:10m (+ Europe).
 *   - PB2002 plate boundaries (Bird 2003, G³ 4(3) 1027), GeoJSON by Hugo Ahlenius,
 *     https://github.com/fraxen/tectonicplates, ODC-BY 1.0 (attribution in spec/geo.md and on the map).
 *
 * For every view in src/geo/views.ts it writes one lazily loaded module src/geo/data/<view>.ts:
 *   1. countries (1:50m or 1:10m by the view's `scale`; the Czech regions too on `czechia`) clipped in lon/lat
 *      to the view's clip box (src/geo/frame.ts; rings across the antimeridian are shifted by ±360° first),
 *   2. quantised to the view's `q` (degrees) and turned into a topology: shared borders become one arc,
 *      so neighbours stay gap-free after simplification and coasts can be told from borders,
 *   3. arcs simplified with Douglas–Peucker (the view's `tol`, longitude scaled by cos φ),
 *   4. lakes and rivers clipped, filtered by Natural Earth scalerank, simplified, Czech names from NAMES_CS below,
 *   5. every coordinate list encoded as zigzag varint deltas in base64url characters (see src/geo/load.ts).
 * Plus src/geo/data/plates.ts (global, PB2002) and src/geo/codes.ts (ADM0_A3 → curated Czech name).
 *
 * Re-run after changing a view preset, a tolerance or a name table; the output is deterministic.
 */
import { register } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

// let `import './project'` (extensionless, as Vite writes it) resolve to project.ts
register(
  'data:text/javascript,' +
    encodeURIComponent(
      `export async function resolve(s, c, next) { try { return await next(s, c) } catch (e) { if (/^\\.\\.?\\//.test(s) && !/\\.[cm]?[jt]s$/.test(s)) return next(s + '.ts', c); throw e } }`,
    ),
)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'src', 'geo', 'data')
const args = process.argv.slice(2)
const argOf = (k) => {
  const i = args.indexOf(k)
  return i >= 0 ? args[i + 1] : undefined
}
const CACHE = argOf('--cache') ?? join(tmpdir(), 'natural-earth-cache')
const ONLY = argOf('--only')?.split(',')

const { VIEW_DEFS } = await import(join(ROOT, 'src', 'geo', 'views.ts'))
const { getView } = await import(join(ROOT, 'src', 'geo', 'frame.ts'))

const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
const PB = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

function load(name, url = NE + name + '.geojson') {
  mkdirSync(CACHE, { recursive: true })
  const file = join(CACHE, url.split('/').pop())
  if (!existsSync(file)) {
    console.log('downloading', url)
    execFileSync('curl', ['-sSfL', '-o', file, url], { stdio: 'inherit' })
  }
  return JSON.parse(readFileSync(file, 'utf8'))
}

// ------------------------------------------------------------------ Czech names

/** Curated Czech names where Intl's CLDR name is not the textbook one (or missing). */
const COUNTRY_CS = {
  ALD: 'Alandy',
  ATC: 'Ashmorovy a Cartierovy ostrovy',
  COD: 'Demokratická republika Kongo',
  COG: 'Kongo',
  CYN: 'Severní Kypr',
  HKG: 'Hongkong',
  IOA: 'Australská území v Indickém oceánu',
  KAS: 'Siačenský ledovec',
  MAC: 'Macao',
  MAF: 'Svatý Martin (francouzská část)',
  MMR: 'Myanmar',
  PSX: 'Palestina',
  SOL: 'Somaliland',
  SXM: 'Svatý Martin (nizozemská část)',
  USA: 'Spojené státy americké',
}

/** Czech regions: Natural Earth admin-1 still has the letter codes of ISO 3166-2:CZ before 2016. */
const REGION_CODE = {
  'CZ-PR': 'CZ-10', 'CZ-ST': 'CZ-20', 'CZ-JC': 'CZ-31', 'CZ-PL': 'CZ-32', 'CZ-KA': 'CZ-41', 'CZ-US': 'CZ-42', 'CZ-LI': 'CZ-51',
  'CZ-KR': 'CZ-52', 'CZ-PA': 'CZ-53', 'CZ-VY': 'CZ-63', 'CZ-JM': 'CZ-64', 'CZ-OL': 'CZ-71', 'CZ-ZL': 'CZ-72', 'CZ-MO': 'CZ-80',
}
const REGION_CS = {
  'CZ-10': 'Hlavní město Praha', 'CZ-20': 'Středočeský kraj', 'CZ-31': 'Jihočeský kraj', 'CZ-32': 'Plzeňský kraj',
  'CZ-41': 'Karlovarský kraj', 'CZ-42': 'Ústecký kraj', 'CZ-51': 'Liberecký kraj', 'CZ-52': 'Královéhradecký kraj',
  'CZ-53': 'Pardubický kraj', 'CZ-63': 'Kraj Vysočina', 'CZ-64': 'Jihomoravský kraj', 'CZ-71': 'Olomoucký kraj',
  'CZ-72': 'Zlínský kraj', 'CZ-80': 'Moravskoslezský kraj',
}

/** Rivers and lakes: Natural Earth name (any segment of the river) → Czech name. Unlisted ones keep the NE name. */
const NAMES_CS = {
  // Czechia and neighbours
  Elbe: 'Labe', Vltava: 'Vltava', Morava: 'Morava', Oder: 'Odra', Odra: 'Odra', Dyje: 'Dyje', Thaya: 'Dyje', Eger: 'Ohře',
  'Sázava': 'Sázava', Svratka: 'Svratka', Svitava: 'Svitava', Uhlava: 'Úhlava', 'Luzicka Nisa': 'Lužická Nisa',
  'Nysa Kłodzka': 'Kladská Nisa', Spree: 'Spréva', Saale: 'Sála', Main: 'Mohan', Inn: 'Inn', Isar: 'Isara', 'Váh': 'Váh',
  Hron: 'Hron', Warta: 'Varta', 'Bóbr': 'Bobr', 'Weisse Elster': 'Bílý Halštrov', 'Schwarze Elster': 'Černý Halštrov',
  'Zwickauer Mulde': 'Cvikovská Mulda', Waldnaab: 'Waldnaab', Unstrut: 'Unstruta', Prosna: 'Prosna',
  // Europe
  Donau: 'Dunaj', Danube: 'Dunaj', Duna: 'Dunaj', Dunav: 'Dunaj', Dunărea: 'Dunaj', Rhine: 'Rýn', Rhein: 'Rýn', Rhin: 'Rýn',
  Vistula: 'Visla', 'Wisła': 'Visla', Volga: 'Volha', Dnieper: 'Dněpr', Dnipro: 'Dněpr', Dnepr: 'Dněpr', Dniester: 'Dněstr',
  Don: 'Don', Ural: 'Ural', Loire: 'Loira', Seine: 'Seina', 'Rhône': 'Rhôna', Rhone: 'Rhôna', Po: 'Pád', Tagus: 'Tajo',
  Tajo: 'Tajo', Tejo: 'Tajo', Ebro: 'Ebro', Douro: 'Duero', Duero: 'Duero', Guadalquivir: 'Guadalquivir', Thames: 'Temže',
  Garonne: 'Garonna', Tisza: 'Tisa', Tisa: 'Tisa', Sava: 'Sáva', Drava: 'Dráva', Mura: 'Mura', Neman: 'Němen',
  Nemunas: 'Němen', Daugava: 'Daugava', 'Western Dvina': 'Daugava', 'Severnaya Dvina': 'Severní Dvina',
  'Northern Dvina': 'Severní Dvina', Pechora: 'Pečora', Kama: 'Kama', Oka: 'Oka', Bug: 'Bug', Prut: 'Prut',
  Weser: 'Vezera', Ems: 'Emže', Mosel: 'Mosela', Moselle: 'Mosela', Maas: 'Máza', Meuse: 'Máza', Tiber: 'Tibera',
  Tevere: 'Tibera', Maritsa: 'Marica', Vardar: 'Vardar', Mures: 'Mureș', 'Mureș': 'Mureș', Olt: 'Olt', Siret: 'Siret',
  Desna: 'Desna', 'Pripyat': 'Pripjať', 'Pripyat’': 'Pripjať', Dvina: 'Severní Dvina', Neva: 'Něva', Narva: 'Narva',
  Kemijoki: 'Kemijoki', Glomma: 'Glomma', Dalälven: 'Dalälven', 'Shannon': 'Shannon', Severn: 'Severn',
  // Asia
  'Chang Jiang': "Jang-c'-ťiang", Yangtze: "Jang-c'-ťiang", Jinsha: "Jang-c'-ťiang", Tongtian: "Jang-c'-ťiang",
  Tuotuo: "Jang-c'-ťiang", Huang: 'Chuang-che', 'Huang He': 'Chuang-che', Ganges: 'Ganga', Ganga: 'Ganga',
  Brahmaputra: 'Brahmaputra', Yarlung: 'Brahmaputra', Dihang: 'Brahmaputra', Indus: 'Indus', Mekong: 'Mekong',
  Lancang: 'Mekong', Ob: 'Ob', "Ob'": 'Ob', Yenisey: 'Jenisej', Yenisei: 'Jenisej', Lena: 'Lena', Amur: 'Amur',
  'Heilong Jiang': 'Amur', Irtysh: 'Irtyš', Ertis: 'Irtyš', Ertix: 'Irtyš', Euphrates: 'Eufrat', Firat: 'Eufrat',
  'Al Furat': 'Eufrat', Tigris: 'Tigris', Dicle: 'Tigris', 'Dijlah': 'Tigris', 'Shatt al Arab': 'Šatt al-Arab',
  Ayeyarwady: 'Iravadi', Irrawaddy: 'Iravadi', Salween: 'Salwin', Nu: 'Salwin', Thanlwin: 'Salwin',
  'Syr Darya': 'Syrdarja', 'Amu Darya': 'Amudarja', Angara: 'Angara', Kolyma: 'Kolyma', Selenge: 'Selenga',
  'Selenge (Selenga)': 'Selenga', 'Xi': 'Si-ťiang', 'Zhu': 'Perlová řeka', Godavari: 'Godávarí', Krishna: 'Krišna',
  Narmada: 'Narmada', Indigirka: 'Indigirka', Yana: 'Jana', Olenek: 'Olenek', Vilyuy: 'Viljuj', Aldan: 'Aldan',
  Tobol: 'Tobol', Ishim: 'Išim', 'Ili': 'Ili', 'Kura': 'Kura', 'Aras': 'Araks', Jordan: 'Jordán',
  // Africa
  Nile: 'Nil', 'El Bahr el Abyad': 'Nil', 'Bahr el Jebel': 'Nil', 'Albert Nile': 'Nil', 'Victoria Nile': 'Nil',
  'Rosetta Branch': 'Nil', 'Damietta Branch': 'Nil', 'El Bahr el Azraq': 'Modrý Nil', Abay: 'Modrý Nil',
  Congo: 'Kongo', Lualaba: 'Kongo', Niger: 'Niger', Zambezi: 'Zambezi', Limpopo: 'Limpopo', Orange: 'Oranžská řeka',
  Senegal: 'Senegal', Okavango: 'Okavango', Ubangi: 'Ubangi', Kasai: 'Kasai', Benue: 'Benue', Volta: 'Volta',
  Shire: 'Shire', Uele: 'Uele',
  // Americas
  Amazonas: 'Amazonka', Amazon: 'Amazonka', Solimões: 'Amazonka', Mississippi: 'Mississippi', Missouri: 'Missouri',
  Ohio: 'Ohio', 'St. Lawrence': 'Řeka svatého Vavřince', 'Saint Lawrence': 'Řeka svatého Vavřince', Yukon: 'Yukon',
  Mackenzie: 'Mackenzie', Colorado: 'Colorado', 'Rio Grande': 'Rio Grande', Columbia: 'Columbia', Nelson: 'Nelson',
  Paraná: 'Paraná', Paraguay: 'Paraguay', Uruguay: 'Uruguay', Orinoco: 'Orinoko', Madeira: 'Madeira', Negro: 'Rio Negro',
  'São Francisco': 'São Francisco', Tocantins: 'Tocantins', Ucayali: 'Ucayali', Magdalena: 'Magdalena',
  Arkansas: 'Arkansas', 'Red': 'Red River', Tennessee: 'Tennessee', Niagara: 'Niagara', Fraser: 'Fraser',
  // Australia
  Murray: 'Murray', Darling: 'Darling',
  // lakes
  'Lake Baikal': 'Bajkal', 'Lake Ladoga': 'Ladožské jezero', 'Lake Onega': 'Oněžské jezero', 'Lake Victoria': 'Viktoriino jezero',
  'Lake Tanganyika': 'Tanganika', 'Lake Malawi': 'Malawi', 'Lake Chad': 'Čadské jezero', 'Lake Superior': 'Hořejší jezero',
  'Lake Michigan': 'Michiganské jezero', 'Lake Huron': 'Huronské jezero', 'Lake Erie': 'Erijské jezero', 'Lake Ontario': 'Ontario',
  'Great Bear Lake': 'Velké Medvědí jezero', 'Great Slave Lake': 'Velké Otročí jezero', 'Lake Winnipeg': 'Winnipeg',
  'Lago Titicaca': 'Titicaca', 'Lake Balkhash': 'Balchaš', 'North Aral Sea': 'Aralské jezero', 'South Aral Sea': 'Aralské jezero',
  'Lake Balaton': 'Balaton', 'Lake Geneva': 'Ženevské jezero', Bodensee: 'Bodamské jezero', 'Lake Constance': 'Bodamské jezero',
  'Lake Peipus': 'Čudské jezero', Vänern: 'Vänern', Vättern: 'Vättern', 'Dead Sea': 'Mrtvé moře', 'Sea of Galilee': 'Genezaretské jezero',
  'Lake Van': 'Van', 'Lake Urmia': 'Urmijské jezero', 'Issyk-Kul': 'Issyk-kul', 'Lake Turkana': 'Turkana', 'Lake Kivu': 'Kivu',
  'Lake Albert': 'Albertovo jezero', 'Lake Tana': 'Tana', 'Lake Volta': 'Volta', 'Lake Kariba': 'Kariba',
  'Great Salt Lake': 'Velké Solné jezero', 'Lago de Nicaragua': 'Nikaragujské jezero', 'Lake Eyre North': 'Eyreovo jezero',
  'Lake Garda': 'Gardské jezero', 'Lago di Garda': 'Gardské jezero', 'Lago Maggiore': 'Lago Maggiore', 'Lake Lucerne': 'Lucernské jezero',
  'Lake Neuchâtel': 'Neuchâtelské jezero', 'Lake Zurich': 'Curyšské jezero', 'Lipno': 'Lipno', 'Lake Lipno': 'Lipno',
  'Vodní nádrž Lipno': 'Lipno', 'Orlík': 'Orlík', 'Lake Saimaa': 'Saimaa', 'Lake Inari': 'Inari', Inarijärvi: 'Inari',
  'Lake Chany': 'Čany', Mälaren: 'Mälaren', 'Lake Titicaca': 'Titicaca', 'Caspian Sea': 'Kaspické moře',
}
const csName = (n) => (n ? (NAMES_CS[n] ?? NAMES_CS[n.trim()] ?? n) : '')

// ------------------------------------------------------------------ geometry helpers

const EPS = 1e-9
/** Polygons of a GeoJSON geometry as lists of rings ([[lon, lat], …]). */
function polygonsOf(g) {
  if (!g) return []
  if (g.type === 'Polygon') return [g.coordinates]
  if (g.type === 'MultiPolygon') return g.coordinates
  return []
}
function linesOf(g) {
  if (!g) return []
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  return []
}

/** Shift (by ±360°) that puts most of the coordinates inside the clip longitudes. */
function lonShift(coords, clip) {
  let lo = Infinity
  let hi = -Infinity
  for (const [x] of coords) {
    if (x < lo) lo = x
    if (x > hi) hi = x
  }
  let best = 0
  let bestOv = -Infinity
  for (const s of [0, -360, 360]) {
    const ov = Math.min(hi + s, clip[2]) - Math.max(lo + s, clip[0])
    if (ov > bestOv + EPS) {
      bestOv = ov
      best = s
    }
  }
  return best
}

/** Sutherland–Hodgman against an axis-aligned box. Ring without the closing point. */
function clipRing(ring, [w, s, e, n]) {
  const edges = [
    [(p) => p[0] >= w, (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= e, (a, b) => [e, a[1] + ((b[1] - a[1]) * (e - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= s, (a, b) => [a[0] + ((b[0] - a[0]) * (s - a[1])) / (b[1] - a[1]), s]],
    [(p) => p[1] <= n, (a, b) => [a[0] + ((b[0] - a[0]) * (n - a[1])) / (b[1] - a[1]), n]],
  ]
  let out = ring
  for (const [inside, cut] of edges) {
    if (!out.length) break
    const inp = out
    out = []
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length]
      const b = inp[i]
      const ia = inside(a)
      const ib = inside(b)
      if (ib) {
        if (!ia) out.push(cut(a, b))
        out.push(b)
      } else if (ia) out.push(cut(a, b))
    }
  }
  return out
}

/** Liang–Barsky: the parts of a polyline inside the box. */
function clipLine(line, [w, s, e, n]) {
  const parts = []
  let cur = null
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]
    const b = line[i]
    let t0 = 0
    let t1 = 1
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const p = [-dx, dx, -dy, dy]
    const q = [a[0] - w, e - a[0], a[1] - s, n - a[1]]
    let ok = true
    for (let k = 0; k < 4 && ok; k++) {
      if (Math.abs(p[k]) < 1e-15) {
        if (q[k] < 0) ok = false
      } else {
        const r = q[k] / p[k]
        if (p[k] < 0) {
          if (r > t1) ok = false
          else if (r > t0) t0 = r
        } else if (r < t0) ok = false
        else if (r < t1) t1 = r
      }
    }
    if (!ok) {
      cur = null
      continue
    }
    const A = [a[0] + t0 * dx, a[1] + t0 * dy]
    const B = [a[0] + t1 * dx, a[1] + t1 * dy]
    if (!cur || t0 > 0) {
      cur = [A]
      parts.push(cur)
    }
    cur.push(B)
    if (t1 < 1) cur = null
  }
  return parts.filter((p) => p.length >= 2)
}

/** Douglas–Peucker on integer points; x scaled by cos φ. Keeps both ends. */
function simplify(pts, tolQ, cosAt) {
  const n = pts.length
  if (n <= 2) return pts.slice()
  const keep = new Uint8Array(n)
  keep[0] = keep[n - 1] = 1
  const stack = [[0, n - 1]]
  const t2 = tolQ * tolQ
  while (stack.length) {
    const [i, j] = stack.pop()
    const c = cosAt((pts[i][1] + pts[j][1]) / 2)
    const ax = pts[i][0] * c
    const ay = pts[i][1]
    const bx = pts[j][0] * c - ax
    const by = pts[j][1] - ay
    const L2 = bx * bx + by * by
    let best = -1
    let bd = t2
    for (let k = i + 1; k < j; k++) {
      const px = pts[k][0] * c - ax
      const py = pts[k][1] - ay
      let d
      if (L2 === 0) d = px * px + py * py
      else {
        const t = Math.max(0, Math.min(1, (px * bx + py * by) / L2))
        const ex = px - t * bx
        const ey = py - t * by
        d = ex * ex + ey * ey
      }
      if (d > bd) {
        bd = d
        best = k
      }
    }
    if (best >= 0) {
      keep[best] = 1
      stack.push([i, best], [best, j])
    }
  }
  return pts.filter((_, k) => keep[k])
}

/** Simplify a closed ring (first point repeated at the end): split at the point farthest from the start. */
function simplifyClosed(pts, tolQ, cosAt) {
  const n = pts.length - 1
  let far = 1
  let fd = -1
  for (let k = 1; k < n; k++) {
    const d = (pts[k][0] - pts[0][0]) ** 2 + (pts[k][1] - pts[0][1]) ** 2
    if (d > fd) {
      fd = d
      far = k
    }
  }
  const a = simplify(pts.slice(0, far + 1), tolQ, cosAt)
  const b = simplify(pts.slice(far), tolQ, cosAt)
  return a.concat(b.slice(1))
}

function ringArea(pts) {
  let a = 0
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % n]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return a / 2
}

// ------------------------------------------------------------------ encoding (see decode in src/geo/load.ts)

const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
function encInt(v, out) {
  let z = v < 0 ? -2 * v - 1 : 2 * v
  while (z >= 32) {
    out.push(ALPH[(z & 31) | 32])
    z = Math.floor(z / 32)
  }
  out.push(ALPH[z])
}
/** Points (integers) → string: first point absolute, then deltas; x before y. */
function encode(pts) {
  const out = []
  let px = 0
  let py = 0
  for (const [x, y] of pts) {
    encInt(x - px, out)
    encInt(y - py, out)
    px = x
    py = y
  }
  return out.join('')
}

// ------------------------------------------------------------------ topology

const KEY = (x, y) => (x + 1048576) * 2097152 + (y + 1048576)

/**
 * Rings (integer points, not closed) → arcs + rings as arc references (~i = arc i reversed).
 * `onFrame(a, b)` tells whether segment a→b lies on the clip frame (or the antimeridian / a pole line).
 */
function topology(rings, onFrame) {
  const sig = new Map() // vertex → neighbour signature, or -1 = junction
  const junction = new Set()
  for (const r of rings) {
    const n = r.length
    for (let i = 0; i < n; i++) {
      const p = r[(i + n - 1) % n]
      const v = r[i]
      const q = r[(i + 1) % n]
      const kv = KEY(v[0], v[1])
      const kp = KEY(p[0], p[1])
      const kq = KEY(q[0], q[1])
      const s = kp < kq ? kp + ':' + kq : kq + ':' + kp
      const old = sig.get(kv)
      if (old === undefined) sig.set(kv, s)
      else if (old !== s) junction.add(kv)
      if (onFrame(p, v) !== onFrame(v, q)) junction.add(kv)
    }
  }
  const arcs = []
  const index = new Map()
  const addArc = (pts) => {
    // canonical direction: compare the sequence with its reverse
    const f = pts.map((p) => p[0] + ',' + p[1]).join(';')
    const rv = pts
      .slice()
      .reverse()
      .map((p) => p[0] + ',' + p[1])
      .join(';')
    if (index.has(f)) return index.get(f)
    if (index.has(rv)) return ~index.get(rv)
    arcs.push(pts)
    index.set(f, arcs.length - 1)
    return arcs.length - 1
  }
  const refs = rings.map((r) => {
    const n = r.length
    const js = []
    for (let i = 0; i < n; i++) if (junction.has(KEY(r[i][0], r[i][1]))) js.push(i)
    if (!js.length) {
      // closed arc without junctions: rotate to the smallest vertex, pick the smaller direction
      let m = 0
      for (let i = 1; i < n; i++) if (KEY(r[i][0], r[i][1]) < KEY(r[m][0], r[m][1])) m = i
      const rot = r.slice(m).concat(r.slice(0, m))
      const fwd = rot.concat([rot[0]])
      const back = [rot[0]].concat(rot.slice(1).reverse(), [rot[0]])
      const kf = KEY(fwd[1][0], fwd[1][1])
      const kb = KEY(back[1][0], back[1][1])
      if (kf <= kb) return [addArc(fwd)]
      const id = addArc(back)
      return [~id]
    }
    const out = []
    for (let k = 0; k < js.length; k++) {
      const a = js[k]
      const b = js[(k + 1) % js.length]
      const pts = []
      for (let i = a; ; i = (i + 1) % n) {
        pts.push(r[i])
        if (i === b && pts.length > 1) break
      }
      if (js.length === 1) {
        // one junction: the arc goes all the way round
      }
      out.push(addArc(pts))
    }
    return out
  })
  return { arcs, refs }
}

// ------------------------------------------------------------------ build one view

const round = (v, d = 4) => Math.round(v * 10 ** d) / 10 ** d

function buildView(id, src) {
  const def = VIEW_DEFS[id]
  const geo = getView(id)
  const clip = geo.clip
  const q = def.q
  const Q = (v) => Math.round(v / q)
  const tolQ = def.tol / q
  const cosAt = (yq) => Math.max(0.05, Math.cos(yq * q * (Math.PI / 180)))
  const qc = clip.map(Q)
  const onLine = (p) => {
    const lon = p[0] * q
    return (
      p[0] === qc[0] || p[0] === qc[2] || p[1] === qc[1] || p[1] === qc[3] ||
      Math.abs(Math.abs(lon) - 180) < q / 2 || Math.abs(Math.abs(lon) - 540) < q / 2 || Math.abs(Math.abs(p[1] * q) - 90) < q / 2
    )
  }
  const onFrame = (a, b) => {
    if (!onLine(a) || !onLine(b)) return false
    // both on the same frame line
    if (a[0] === b[0] && (a[0] === qc[0] || a[0] === qc[2] || Math.abs(Math.abs(a[0] * q) - 180) < q / 2 || Math.abs(Math.abs(a[0] * q) - 540) < q / 2)) return true
    if (a[1] === b[1] && (a[1] === qc[1] || a[1] === qc[3] || Math.abs(Math.abs(a[1] * q) - 90) < q / 2)) return true
    return false
  }

  // rings far outside the frame (e.g. on the far side of an azimuthal view whose clip box is global) are dropped
  const [fx0, fy0, fx1, fy1] = geo.frame
  const fm = (fx1 - fx0) * 0.05
  const nearFrame = (pts) => {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity
    for (const [x, y] of pts) {
      const [px, py] = geo.proj.forward(x, y)
      if (px < a) a = px
      if (px > c) c = px
      if (py < b) b = py
      if (py > d) d = py
    }
    return !(c < fx0 - fm || a > fx1 + fm || d < fy0 - fm || b > fy1 + fm)
  }
  const inClip = ([x, y]) => {
    const xs = x + lonShift([[x, y]], clip)
    return xs >= clip[0] && xs <= clip[2] && y >= clip[1] && y <= clip[3] && nearFrame([[xs, y]])
  }

  /** clip + quantise one source ring; null if nothing is left */
  const prepRing = (ring) => {
    let r = ring.slice(0, -1)
    if (r.length < 3) return null
    const sh = lonShift(r, clip)
    if (sh) r = r.map(([x, y]) => [x + sh, y])
    let lo = Infinity, hi = -Infinity, lo2 = Infinity, hi2 = -Infinity
    for (const [x, y] of r) {
      if (x < lo) lo = x
      if (x > hi) hi = x
      if (y < lo2) lo2 = y
      if (y > hi2) hi2 = y
    }
    if (hi < clip[0] || lo > clip[2] || hi2 < clip[1] || lo2 > clip[3]) return null
    const inside = lo >= clip[0] && hi <= clip[2] && lo2 >= clip[1] && hi2 <= clip[3]
    if (!inside) r = clipRing(r, clip)
    if (r.length < 3 || !nearFrame(r)) return null
    const out = []
    for (const [x, y] of r) {
      const p = [Q(x), Q(y)]
      const last = out[out.length - 1]
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p)
    }
    while (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) out.pop()
    // drop spikes a → b → a
    for (let changed = true; changed && out.length >= 3; ) {
      changed = false
      for (let i = 0; i < out.length && out.length >= 3; i++) {
        const a = out[(i + out.length - 1) % out.length]
        const c = out[(i + 1) % out.length]
        if (a[0] === c[0] && a[1] === c[1]) {
          out.splice(i, 1)
          const j = i % out.length
          out.splice(j, 1)
          changed = true
          break
        }
      }
    }
    return out.length >= 3 ? out : null
  }

  // ---- collect rings of countries (and regions)
  const rings = []
  const owner = [] // [layer, code]
  const labels = {}
  const emptyFeatures = []
  const countryFeatures = src.countries.features.filter((f) => src.codes.has(f.properties.ADM0_A3))
  for (const f of countryFeatures) {
    const code = f.properties.ADM0_A3
    let any = false
    for (const poly of polygonsOf(f.geometry))
      for (const ring of poly) {
        const r = prepRing(ring)
        if (r) {
          rings.push(r)
          owner.push(['c', code])
          any = true
        }
      }
    const lp = [f.properties.LABEL_X, f.properties.LABEL_Y]
    if (any || inClip(lp)) labels[code] = [round(lp[0], 3), round(lp[1], 3)]
    // a state too small for any ring at this scale (Vatican on the world map) keeps its code and label point:
    // GeoMap draws it as a marker
    if (!any && labels[code]) emptyFeatures.push(code)
  }
  if (src.regions)
    for (const f of src.regions) {
      const code = REGION_CODE[f.properties.iso_3166_2]
      for (const poly of polygonsOf(f.geometry))
        for (const ring of poly) {
          const r = prepRing(ring)
          if (r) {
            rings.push(r)
            owner.push(['r', code])
          }
        }
      labels[code] = [round(f.properties.longitude, 3), round(f.properties.latitude, 3)]
    }

  const topo = topology(rings, onFrame)
  // simplify arcs
  const simple = topo.arcs.map((a) => {
    const closed = a.length > 3 && a[0][0] === a[a.length - 1][0] && a[0][1] === a[a.length - 1][1]
    return closed ? simplifyClosed(a, tolQ, cosAt) : simplify(a, tolQ, cosAt)
  })
  const arcPts = (ref, s) => {
    const a = (s ?? simple)[ref < 0 ? ~ref : ref]
    return ref < 0 ? a.slice().reverse() : a
  }
  const ringPts = (refs, s) => {
    const out = []
    for (const ref of refs) {
      const p = arcPts(ref, s)
      for (let i = out.length ? 1 : 0; i < p.length; i++) out.push(p[i])
    }
    if (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) out.pop()
    return out
  }
  // drop rings that collapse (small islands), but keep ≥ 1 ring for every feature (unsimplified if needed)
  const minArea = tolQ * tolQ * 1.5
  const byFeature = new Map()
  topo.refs.forEach((refs, i) => {
    const k = owner[i].join(':')
    if (!byFeature.has(k)) byFeature.set(k, [])
    byFeature.get(k).push(i)
  })
  const keepRing = new Uint8Array(rings.length)
  const raw = new Set() // arcs kept unsimplified
  for (const [, idx] of byFeature) {
    let any = false
    for (const i of idx) {
      const refs = topo.refs[i]
      const shared = refs.length > 1
      const pts = ringPts(refs)
      if (shared || (pts.length >= 3 && Math.abs(ringArea(pts)) >= minArea)) {
        keepRing[i] = 1
        any = true
      }
    }
    if (!any) {
      // tiny feature (a microstate, an atoll state): keep its largest ring with full detail
      let best = idx[0]
      let ba = -1
      for (const i of idx) {
        const a = Math.abs(ringArea(ringPts(topo.refs[i], topo.arcs)))
        if (a > ba) {
          ba = a
          best = i
        }
      }
      keepRing[best] = 1
      for (const ref of topo.refs[best]) raw.add(ref < 0 ? ~ref : ref)
    }
  }
  // re-index the used arcs
  const used = new Map()
  const outArcs = []
  const frame = []
  const remap = (ref) => {
    const i = ref < 0 ? ~ref : ref
    if (!used.has(i)) {
      const pts = raw.has(i) ? topo.arcs[i] : simple[i]
      used.set(i, outArcs.length)
      let fr = pts.length > 1
      for (let k = 1; k < pts.length && fr; k++) if (!onFrame(pts[k - 1], pts[k])) fr = false
      if (fr) frame.push(outArcs.length)
      outArcs.push(encode(pts))
    }
    const j = used.get(i)
    return ref < 0 ? ~j : j
  }
  const countries = new Map(emptyFeatures.map((c) => [c, []]))
  const regions = new Map()
  topo.refs.forEach((refs, i) => {
    if (!keepRing[i]) return
    const [layer, code] = owner[i]
    const m = layer === 'c' ? countries : regions
    if (!m.has(code)) m.set(code, [])
    m.get(code).push(refs.map(remap))
  })

  // ---- lakes
  const lakes = []
  for (const f of src.lakes) {
    const name = csName(f.properties.name)
    const rs = []
    for (const poly of polygonsOf(f.geometry)) {
      const r = prepRing(poly[0])
      if (!r) continue
      const s = simplifyClosed(r.concat([r[0]]), tolQ, cosAt)
      s.pop()
      if (s.length >= 3 && Math.abs(ringArea(s)) >= minArea * 4) rs.push(encode(s))
    }
    if (rs.length) lakes.push([name, f.properties.scalerank ?? 0, rs])
  }

  // ---- rivers (grouped by Czech/NE name)
  const riverMap = new Map()
  for (const f of src.rivers) {
    const name = csName(f.properties.name)
    const rank = f.properties.scalerank ?? 9
    for (const line of linesOf(f.geometry)) {
      const sh = lonShift(line, clip)
      const l2 = sh ? line.map(([x, y]) => [x + sh, y]) : line
      for (const part of clipLine(l2, clip)) {
        if (!nearFrame(part)) continue
        const pts = []
        for (const [x, y] of part) {
          const p = [Q(x), Q(y)]
          const last = pts[pts.length - 1]
          if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p)
        }
        const s = simplify(pts, tolQ * 0.8, cosAt)
        if (s.length < 2) continue
        const key = name || '#' + (f.properties.rivernum ?? f.properties.ne_id ?? Math.random())
        if (!riverMap.has(key)) riverMap.set(key, [name, rank, []])
        const g = riverMap.get(key)
        g[1] = Math.min(g[1], rank)
        g[2].push(encode(s))
      }
    }
  }
  const rivers = [...riverMap.values()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0], 'cs'))

  const data = {
    q,
    arcs: outArcs,
    frame,
    countries: [...countries.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    ...(regions.size ? { regions: [...regions.entries()].sort((a, b) => a[0].localeCompare(b[0])) } : {}),
    labels,
    lakes: lakes.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0], 'cs')),
    rivers,
  }
  return data
}

function writeModule(name, typeName, data, note) {
  const body =
    `// Generated by scripts/geo/build-geo.mjs from ${note} – do not edit by hand.\n` +
    `import type { ${typeName} } from '../types'\n\n` +
    `const data: ${typeName} = ${JSON.stringify(data)}\n\nexport default data\n`
  mkdirSync(OUT, { recursive: true })
  writeFileSync(join(OUT, name + '.ts'), body)
  return body.length
}

// ------------------------------------------------------------------ main

const ne50 = load('ne_50m_admin_0_countries')
const codes = new Set(ne50.features.map((f) => f.properties.ADM0_A3))

// codes.ts
{
  const dn = new Intl.DisplayNames(['cs'], { type: 'region' })
  const names = {}
  for (const f of ne50.features) {
    const p = f.properties
    const a2 = p.ISO_A2_EH !== '-99' ? p.ISO_A2_EH : p.ISO_A2
    let n = COUNTRY_CS[p.ADM0_A3]
    if (!n && a2 && a2 !== '-99') {
      try {
        n = dn.of(a2)
      } catch {
        n = undefined
      }
    }
    if (!n || n === a2) throw new Error(`no Czech name for ${p.ADM0_A3} (${p.NAME}): add it to COUNTRY_CS`)
    names[p.ADM0_A3] = n
  }
  const lines = Object.keys(names)
    .sort()
    .map((k) => `  ${k}: ${JSON.stringify(names[k])},`)
  const regs = Object.entries(REGION_CS).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
  writeFileSync(
    join(ROOT, 'src', 'geo', 'codes.ts'),
    `/**
 * Country codes the map block accepts (Natural Earth ADM0_A3, equal to ISO 3166-1 alpha-3 for almost every state)
 * with their Czech names, and the 14 Czech regions (ISO 3166-2). Generated by scripts/geo/build-geo.mjs from
 * Natural Earth 1:50m admin-0 (CLDR Czech names, curated); the map data in src/geo/data uses the same codes.
 * Kept small: the validator imports it.
 */
export const COUNTRY_NAMES: Record<string, string> = {
${lines.join('\n')}
}

/** Czech regions (kraje), ISO 3166-2 codes. */
export const CZ_REGION_NAMES: Record<string, string> = {
${regs.join('\n')}
}
`,
  )
}

let total = 0
const sizes = []
const lazy = {}
const get = (k, f) => (lazy[k] ??= f())
const views = Object.keys(VIEW_DEFS).filter((v) => !ONLY || ONLY.includes(v))
for (const id of views) {
  const def = VIEW_DEFS[id]
  const fine = def.scale === '10m'
  const countries = fine ? get('c10', () => load('ne_10m_admin_0_countries')) : ne50
  const regions =
    id === 'czechia'
      ? get('a1', () => load('ne_10m_admin_1_states_provinces')).features.filter((f) => f.properties.adm0_a3 === 'CZE')
      : undefined
  const lakeSrc = fine
    ? [...get('l10', () => load('ne_10m_lakes')).features, ...get('l10e', () => load('ne_10m_lakes_europe')).features]
    : get('l50', () => load('ne_50m_lakes')).features
  const riverSrc = fine
    ? [...get('r10', () => load('ne_10m_rivers_lake_centerlines')).features, ...get('r10e', () => load('ne_10m_rivers_europe')).features]
    : get('r50', () => load('ne_50m_rivers_lake_centerlines')).features
  // rank filters per view: small-scale views keep only the big rivers and lakes
  const maxRiver = id === 'world' ? 3 : id === 'europe' ? 6 : fine ? 12 : 5
  const maxLake = id === 'world' ? 0 : fine ? 12 : 2
  const data = buildView(id, {
    countries,
    codes,
    regions,
    lakes: lakeSrc.filter((f) => f.geometry && (f.properties.scalerank ?? 0) <= maxLake),
    rivers: riverSrc.filter((f) => f.geometry && (f.properties.scalerank ?? 0) <= maxRiver && f.properties.featurecla !== 'Lake Centerline'),
  })
  const size = writeModule(id, 'CountryModule', data, `Natural Earth 1:${def.scale} (public domain)`)
  total += size
  sizes.push(`${id}: ${(size / 1024).toFixed(1)} KB (${data.arcs.length} arcs, ${data.countries.length} countries, ${data.rivers.length} rivers, ${data.lakes.length} lakes)`)
}

// plates
if (!ONLY || ONLY.includes('plates')) {
  const pb = load('PB2002_boundaries', PB)
  const q = 0.05
  const Q = (v) => Math.round(v / q)
  const cosAt = (yq) => Math.max(0.05, Math.cos(yq * q * (Math.PI / 180)))
  const lines = []
  for (const f of pb.features) {
    for (const line of linesOf(f.geometry)) {
      const pts = []
      for (const [x, y] of line) {
        const p = [Q(x), Q(y)]
        const last = pts[pts.length - 1]
        if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p)
      }
      const s = simplify(pts, 0.12 / q, cosAt)
      if (s.length >= 2) lines.push([f.properties.Name, f.properties.Type === 'subduction' ? 1 : 0, encode(s)])
    }
  }
  const size = writeModule('plates', 'PlatesModule', { q, lines }, 'PB2002 (Bird 2003), ODC-BY 1.0, https://github.com/fraxen/tectonicplates')
  total += size
  sizes.push(`plates: ${(size / 1024).toFixed(1)} KB (${lines.length} lines)`)
}
console.log(sizes.join('\n'))
console.log(`total ${(total / 1024).toFixed(1)} KB`)
