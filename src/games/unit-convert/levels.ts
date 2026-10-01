/**
 * Převody jednotek – units and the conversions trained per level
 * (spec/courses/fyzika/games.md: 1 délka, objem, hmotnost, čas a předpony ·
 * 2 rychlost a síla · 3 tlak, práce, výkon, energie · 6 proud, napětí, odpor, kWh ·
 * 8 vědecký zápis a odvozené jednotky).
 *
 * Only the unit definitions (value of 1 unit in SI) are typed in here; every
 * answer and every factor is computed in logic.ts.
 */

export type Quantity =
  | 'length'
  | 'area'
  | 'volume'
  | 'mass'
  | 'time'
  | 'speed'
  | 'force'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'current'
  | 'voltage'
  | 'resistance'
  | 'density'

export const QUANTITY_NAME: Record<Quantity, string> = {
  length: 'Délka',
  area: 'Obsah',
  volume: 'Objem',
  mass: 'Hmotnost',
  time: 'Čas',
  speed: 'Rychlost',
  force: 'Síla',
  pressure: 'Tlak',
  energy: 'Energie a práce',
  power: 'Výkon',
  current: 'Elektrický proud',
  voltage: 'Elektrické napětí',
  resistance: 'Elektrický odpor',
  density: 'Hustota',
}

export interface Unit {
  sym: string
  q: Quantity
  /** Value of 1 unit in the SI unit of the quantity (m, m², m³, kg, s, m/s, N, Pa, J, W, A, V, Ω, kg/m³). */
  si: number
  /**
   * Where the unit sits on the prefix ladder: base symbol, prefix exponent (k = 3, m = −3…)
   * and the power of the base (m² → 2), so one step is ×10, ×100 or ×1 000.
   */
  ladder?: { base: string; p: number; dim: 1 | 2 | 3 }
}

/** SI prefixes used on the ladder. */
export const PREFIX: Record<number, string> = { 9: 'G', 6: 'M', 3: 'k', 2: 'h', 1: 'da', 0: '', [-1]: 'd', [-2]: 'c', [-3]: 'm', [-6]: 'µ', [-9]: 'n' }

const units: Unit[] = []
/** Adds base+prefix units, e.g. ladder('m', 'length', 1, 1, [3, 0, -1, -2, -3, -6, -9]). */
function ladder(base: string, q: Quantity, baseSi: number, dim: 1 | 2 | 3, ps: number[], sup = '') {
  for (const p of ps) units.push({ sym: `${PREFIX[p]}${base}${sup}`, q, si: baseSi * 10 ** (p * dim), ladder: { base, p, dim } })
}
const plain = (sym: string, q: Quantity, si: number) => units.push({ sym, q, si })

ladder('m', 'length', 1, 1, [3, 0, -1, -2, -3, -6, -9])
ladder('m', 'area', 1, 2, [3, 0, -1, -2, -3], '²')
plain('ha', 'area', 1e4)
plain('a', 'area', 100)
ladder('m', 'volume', 1, 3, [0, -1, -2, -3], '³')
ladder('l', 'volume', 1e-3, 1, [2, 0, -1, -2, -3])
ladder('g', 'mass', 1e-3, 1, [3, 1, 0, -3, -6])
plain('t', 'mass', 1000)
plain('den', 'time', 86400)
plain('h', 'time', 3600)
plain('min', 'time', 60)
ladder('s', 'time', 1, 1, [0, -3, -6, -9])
plain('km/h', 'speed', 1 / 3.6)
plain('m/s', 'speed', 1)
ladder('N', 'force', 1, 1, [6, 3, 0, -3])
ladder('Pa', 'pressure', 1, 1, [6, 3, 2, 0])
plain('N/cm²', 'pressure', 1e4)
plain('N/mm²', 'pressure', 1e6)
ladder('J', 'energy', 1, 1, [9, 6, 3, 0])
plain('Wh', 'energy', 3600)
plain('kWh', 'energy', 3.6e6)
ladder('W', 'power', 1, 1, [9, 6, 3, 0, -3])
ladder('A', 'current', 1, 1, [3, 0, -3, -6])
ladder('V', 'voltage', 1, 1, [6, 3, 0, -3])
ladder('Ω', 'resistance', 1, 1, [6, 3, 0, -3])
plain('kg/m³', 'density', 1)
plain('g/cm³', 'density', 1000)
plain('g/l', 'density', 1)
plain('kg/l', 'density', 1000)

export const UNITS: Record<string, Unit> = Object.fromEntries(units.map((u) => [u.sym, u]))

/** How a level is answered: pick one of 4, type a number, or type in scientific notation. */
export type Mode = 'choice' | 'type' | 'sci'

export interface LevelSet {
  /** Conversions [from, to]; both directions are listed where both are trained. */
  pairs: [string, string][]
  /** Answer mode for the i-th task of a round. */
  mode: (i: number) => Mode
}

const both = (list: [string, string][]): [string, string][] => list.flatMap(([a, b]) => [[a, b] as [string, string], [b, a] as [string, string]])

export const LEVELS: Record<number, LevelSet> = {
  /** f1-2: length, area, volume, mass, time and prefixes. */
  1: {
    pairs: both([
      ['km', 'm'],
      ['m', 'cm'],
      ['m', 'mm'],
      ['cm', 'mm'],
      ['dm', 'cm'],
      ['m', 'dm'],
      ['mm', 'µm'],
      ['kg', 'g'],
      ['g', 'mg'],
      ['dag', 'g'],
      ['t', 'kg'],
      ['hl', 'l'],
      ['l', 'ml'],
      ['l', 'dl'],
      ['dm³', 'l'],
      ['cm³', 'ml'],
      ['m³', 'l'],
      ['m³', 'dm³'],
      ['m²', 'cm²'],
      ['m²', 'dm²'],
      ['ha', 'm²'],
      ['h', 'min'],
      ['min', 's'],
      ['h', 's'],
    ]),
    mode: () => 'choice',
  },
  /** f2-1, f2-3: speed km/h ↔ m/s and force. */
  2: {
    pairs: [
      ...both([
        ['km/h', 'm/s'],
        ['kN', 'N'],
        ['N', 'mN'],
        ['MN', 'kN'],
      ]),
      ['km/h', 'm/s'],
      ['m/s', 'km/h'],
      ['km', 'm'],
      ['h', 's'],
    ],
    mode: (i) => (i % 3 === 2 ? 'type' : 'choice'),
  },
  /** f3-1, f3-4, f3-5: pressure, work, power, energy. */
  3: {
    pairs: both([
      ['kPa', 'Pa'],
      ['hPa', 'Pa'],
      ['MPa', 'kPa'],
      ['MPa', 'Pa'],
      ['kJ', 'J'],
      ['MJ', 'kJ'],
      ['MJ', 'J'],
      ['kW', 'W'],
      ['MW', 'kW'],
      ['W', 'mW'],
      ['hPa', 'kPa'],
    ]),
    mode: (i) => (i % 2 ? 'type' : 'choice'),
  },
  /** f6-2, f6-3, f6-5: current, voltage, resistance, kWh. */
  6: {
    pairs: both([
      ['A', 'mA'],
      ['mA', 'µA'],
      ['kV', 'V'],
      ['V', 'mV'],
      ['kΩ', 'Ω'],
      ['MΩ', 'kΩ'],
      ['Wh', 'J'],
      ['kWh', 'Wh'],
      ['kWh', 'MJ'],
      ['kW', 'W'],
    ]),
    mode: () => 'type',
  },
  /** f1-2 + f8-1: scientific notation, orders of magnitude and derived units. */
  8: {
    pairs: [
      ['nm', 'm'],
      ['µm', 'm'],
      ['m', 'nm'],
      ['km', 'm'],
      ['GW', 'W'],
      ['W', 'MW'],
      ['µA', 'A'],
      ['ns', 's'],
      ['µs', 's'],
      ['mg', 'kg'],
      ['g/cm³', 'kg/m³'],
      ['kg/m³', 'g/cm³'],
      ['km/h', 'm/s'],
      ['kWh', 'J'],
      ['N/cm²', 'Pa'],
      ['N/mm²', 'Pa'],
      ['mm²', 'm²'],
      ['cm²', 'm²'],
      ['cm³', 'm³'],
      ['l', 'm³'],
      ['ml', 'm³'],
      ['MPa', 'Pa'],
      ['J', 'kWh'],
      ['g', 'kg'],
    ],
    mode: () => 'sci',
  },
}
