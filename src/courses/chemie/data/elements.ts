/**
 * All 118 elements with Czech names.
 * Row format: Z | symbol | Czech name | relative atomic mass | category code | Pauling electronegativity
 * Category codes: a alkali, e alkaline earth, t transition, p post-transition,
 * m metalloid, n other nonmetal, h halogen, g noble gas, l lanthanide, c actinide, u unknown.
 * Masses in parentheses in real tables (no stable isotope) are written as plain numbers here
 * and flagged with `radioactiveOnly`.
 */
export type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide'
  | 'unknown'

export interface ChemElement {
  z: number
  symbol: string
  name: string
  mass: number
  category: ElementCategory
  /** Pauling electronegativity, null where not defined. */
  en: number | null
  period: number
  /** 1–18; null for the f-block (lanthanides 58–71 / actinides 90–103 and La, Ac shown in the f-row). */
  group: number | null
  block: 's' | 'p' | 'd' | 'f'
  state: 'solid' | 'liquid' | 'gas'
  radioactiveOnly: boolean
}

const RAW = `1|H|Vodík|1.008|n|2.20
2|He|Helium|4.0026|g|
3|Li|Lithium|6.94|a|0.98
4|Be|Beryllium|9.0122|e|1.57
5|B|Bor|10.81|m|2.04
6|C|Uhlík|12.011|n|2.55
7|N|Dusík|14.007|n|3.04
8|O|Kyslík|15.999|n|3.44
9|F|Fluor|18.998|h|3.98
10|Ne|Neon|20.180|g|
11|Na|Sodík|22.990|a|0.93
12|Mg|Hořčík|24.305|e|1.31
13|Al|Hliník|26.982|p|1.61
14|Si|Křemík|28.085|m|1.90
15|P|Fosfor|30.974|n|2.19
16|S|Síra|32.06|n|2.58
17|Cl|Chlor|35.45|h|3.16
18|Ar|Argon|39.95|g|
19|K|Draslík|39.098|a|0.82
20|Ca|Vápník|40.078|e|1.00
21|Sc|Skandium|44.956|t|1.36
22|Ti|Titan|47.867|t|1.54
23|V|Vanad|50.942|t|1.63
24|Cr|Chrom|51.996|t|1.66
25|Mn|Mangan|54.938|t|1.55
26|Fe|Železo|55.845|t|1.83
27|Co|Kobalt|58.933|t|1.88
28|Ni|Nikl|58.693|t|1.91
29|Cu|Měď|63.546|t|1.90
30|Zn|Zinek|65.38|t|1.65
31|Ga|Gallium|69.723|p|1.81
32|Ge|Germanium|72.630|m|2.01
33|As|Arsen|74.922|m|2.18
34|Se|Selen|78.971|n|2.55
35|Br|Brom|79.904|h|2.96
36|Kr|Krypton|83.798|g|3.00
37|Rb|Rubidium|85.468|a|0.82
38|Sr|Stroncium|87.62|e|0.95
39|Y|Yttrium|88.906|t|1.22
40|Zr|Zirkonium|91.224|t|1.33
41|Nb|Niob|92.906|t|1.6
42|Mo|Molybden|95.95|t|2.16
43|Tc|Technecium|98|t|1.9
44|Ru|Ruthenium|101.07|t|2.2
45|Rh|Rhodium|102.91|t|2.28
46|Pd|Palladium|106.42|t|2.20
47|Ag|Stříbro|107.87|t|1.93
48|Cd|Kadmium|112.41|t|1.69
49|In|Indium|114.82|p|1.78
50|Sn|Cín|118.71|p|1.96
51|Sb|Antimon|121.76|m|2.05
52|Te|Tellur|127.60|m|2.1
53|I|Jod|126.90|h|2.66
54|Xe|Xenon|131.29|g|2.6
55|Cs|Cesium|132.91|a|0.79
56|Ba|Baryum|137.33|e|0.89
57|La|Lanthan|138.91|l|1.10
58|Ce|Cer|140.12|l|1.12
59|Pr|Praseodym|140.91|l|1.13
60|Nd|Neodym|144.24|l|1.14
61|Pm|Promethium|145|l|
62|Sm|Samarium|150.36|l|1.17
63|Eu|Europium|151.96|l|
64|Gd|Gadolinium|157.25|l|1.20
65|Tb|Terbium|158.93|l|
66|Dy|Dysprosium|162.50|l|1.22
67|Ho|Holmium|164.93|l|1.23
68|Er|Erbium|167.26|l|1.24
69|Tm|Thulium|168.93|l|1.25
70|Yb|Ytterbium|173.05|l|
71|Lu|Lutecium|174.97|l|1.27
72|Hf|Hafnium|178.49|t|1.3
73|Ta|Tantal|180.95|t|1.5
74|W|Wolfram|183.84|t|2.36
75|Re|Rhenium|186.21|t|1.9
76|Os|Osmium|190.23|t|2.2
77|Ir|Iridium|192.22|t|2.20
78|Pt|Platina|195.08|t|2.28
79|Au|Zlato|196.97|t|2.54
80|Hg|Rtuť|200.59|t|2.00
81|Tl|Thallium|204.38|p|1.62
82|Pb|Olovo|207.2|p|1.87
83|Bi|Bismut|208.98|p|2.02
84|Po|Polonium|209|p|2.0
85|At|Astat|210|h|2.2
86|Rn|Radon|222|g|2.2
87|Fr|Francium|223|a|0.7
88|Ra|Radium|226|e|0.9
89|Ac|Aktinium|227|c|1.1
90|Th|Thorium|232.04|c|1.3
91|Pa|Protaktinium|231.04|c|1.5
92|U|Uran|238.03|c|1.38
93|Np|Neptunium|237|c|1.36
94|Pu|Plutonium|244|c|1.28
95|Am|Americium|243|c|1.3
96|Cm|Curium|247|c|
97|Bk|Berkelium|247|c|
98|Cf|Kalifornium|251|c|
99|Es|Einsteinium|252|c|
100|Fm|Fermium|257|c|
101|Md|Mendelevium|258|c|
102|No|Nobelium|259|c|
103|Lr|Lawrencium|266|c|
104|Rf|Rutherfordium|267|t|
105|Db|Dubnium|268|t|
106|Sg|Seaborgium|269|t|
107|Bh|Bohrium|270|t|
108|Hs|Hassium|277|t|
109|Mt|Meitnerium|278|u|
110|Ds|Darmstadtium|281|u|
111|Rg|Roentgenium|282|u|
112|Cn|Kopernicium|285|u|
113|Nh|Nihonium|286|u|
114|Fl|Flerovium|289|u|
115|Mc|Moscovium|290|u|
116|Lv|Livermorium|293|u|
117|Ts|Tennessin|294|u|
118|Og|Oganesson|294|u|`

const CAT: Record<string, ElementCategory> = {
  a: 'alkali',
  e: 'alkaline',
  t: 'transition',
  p: 'post',
  m: 'metalloid',
  n: 'nonmetal',
  h: 'halogen',
  g: 'noble',
  l: 'lanthanide',
  c: 'actinide',
  u: 'unknown',
}

const PERIOD_START = [1, 3, 11, 19, 37, 55, 87]
const GASES = new Set(['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'])
const LIQUIDS = new Set(['Br', 'Hg'])
const STABLE_MISSING = new Set([43, 61])

function position(z: number): { period: number; group: number | null } {
  let period = 1
  for (let p = 0; p < PERIOD_START.length; p++) if (z >= PERIOD_START[p]) period = p + 1
  const o = z - PERIOD_START[period - 1]
  if (period === 1) return { period, group: z === 1 ? 1 : 18 }
  if (period <= 3) return { period, group: o < 2 ? o + 1 : o + 11 }
  if (period <= 5) return { period, group: o + 1 }
  if (o < 2) return { period, group: o + 1 }
  if (o <= 16) return { period, group: null }
  return { period, group: o - 13 }
}

function blockOf(group: number | null, z: number): ChemElement['block'] {
  if (group === null) return 'f'
  if (z === 2 || group <= 2) return 's'
  if (group >= 13) return 'p'
  return 'd'
}

export const ELEMENTS: ChemElement[] = RAW.split('\n').map((line) => {
  const [z, symbol, name, mass, cat, en] = line.split('|')
  const zn = Number(z)
  const { period, group } = position(zn)
  return {
    z: zn,
    symbol,
    name,
    mass: Number(mass),
    category: CAT[cat],
    en: en ? Number(en) : null,
    period,
    group,
    block: blockOf(group, zn),
    state: GASES.has(symbol) ? 'gas' : LIQUIDS.has(symbol) ? 'liquid' : 'solid',
    radioactiveOnly: zn > 83 || STABLE_MISSING.has(zn),
  }
})

export const BY_SYMBOL: Record<string, ChemElement> = Object.fromEntries(ELEMENTS.map((e) => [e.symbol, e]))
export const BY_Z: Record<number, ChemElement> = Object.fromEntries(ELEMENTS.map((e) => [e.z, e]))

export const CATEGORY_LABEL: Record<ElementCategory, string> = {
  alkali: 'alkalický kov',
  alkaline: 'kov alkalických zemin',
  transition: 'přechodný kov',
  post: 'nepřechodný kov',
  metalloid: 'polokov',
  nonmetal: 'nekov',
  halogen: 'halogen',
  noble: 'vzácný plyn',
  lanthanide: 'lanthanoid',
  actinide: 'aktinoid',
  unknown: 'neprozkoumané vlastnosti',
}

/** CSS variable holding the category colour. */
export const categoryVar = (c: ElementCategory) => `var(--cat-${c})`

/** Czech-style number formatting: 22,99 */
export const fmtMass = (m: number, digits = 2) => m.toFixed(digits).replace('.', ',')

/** Grid position in the standard 18-column table; f-block goes to rows 9 and 10. */
export function tablePosition(e: ChemElement): { row: number; col: number } {
  if (e.group !== null) return { row: e.period, col: e.group }
  const start = e.period === 6 ? 57 : 89
  return { row: e.period === 6 ? 9 : 10, col: 3 + (e.z - start) }
}

/** Shell occupancy by the simple 2-8-8-2 school model (valid up to Z = 20). */
export function simpleShells(z: number): number[] {
  const caps = [2, 8, 8, 2]
  const out: number[] = []
  let left = z
  for (const c of caps) {
    if (left <= 0) break
    const n = Math.min(c, left)
    out.push(n)
    left -= n
  }
  return out
}
