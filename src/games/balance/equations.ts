import { parseFormula } from '../../courses/chemie/data/formula'

export interface Equation {
  id: string
  reactants: string[]
  products: string[]
  /** Smallest whole-number coefficients, reactants first, then products. */
  coefs: number[]
  /** 1 easy, 2 medium, 3 hard. */
  level: 1 | 2 | 3
  /** Redox equation typically balanced via oxidation numbers (level 6+). */
  redox?: boolean
  /** Short Czech caption: what is happening. */
  note: string
}

const eq = (
  id: string,
  left: string,
  right: string,
  coefs: number[],
  level: 1 | 2 | 3,
  note: string,
  redox = false,
): Equation => ({
  id,
  reactants: left.split(' + '),
  products: right.split(' + '),
  coefs,
  level,
  note,
  ...(redox ? { redox } : {}),
})

export const EQUATIONS: Equation[] = [
  // ---------- easy ----------
  eq('water', 'H2 + O2', 'H2O', [2, 1, 2], 1, 'Hoření vodíku – vzniká voda.'),
  eq('ammonia', 'N2 + H2', 'NH3', [1, 3, 2], 1, 'Syntéza amoniaku (Haberův–Boschův proces).'),
  eq('nacl', 'Na + Cl2', 'NaCl', [2, 1, 2], 1, 'Sodík hoří v chloru na kuchyňskou sůl.'),
  eq('mgo', 'Mg + O2', 'MgO', [2, 1, 2], 1, 'Hoření hořčíku oslnivým plamenem.'),
  eq('cao', 'Ca + O2', 'CaO', [2, 1, 2], 1, 'Oxidace vápníku.'),
  eq('cuo', 'Cu + O2', 'CuO', [2, 1, 2], 1, 'Měď se na vzduchu při zahřátí pokryje černým CuO.'),
  eq('hcl', 'H2 + Cl2', 'HCl', [1, 1, 2], 1, 'Slučování vodíku s chlorem.'),
  eq('h2o2', 'H2O2', 'H2O + O2', [2, 2, 1], 1, 'Rozklad peroxidu vodíku (třeba s kvasnicemi).'),
  eq('hgo', 'HgO', 'Hg + O2', [2, 2, 1], 1, 'Rozklad oxidu rtuťnatého – tak Priestley objevil kyslík.'),
  eq('so3', 'SO2 + O2', 'SO3', [2, 1, 2], 1, 'Oxidace SO₂ při výrobě kyseliny sírové.'),
  eq('na2o', 'Na + O2', 'Na2O', [4, 1, 2], 1, 'Oxidace sodíku.'),
  eq('zn-hcl', 'Zn + HCl', 'ZnCl2 + H2', [1, 2, 1, 1], 1, 'Zinek v kyselině chlorovodíkové – bublinky vodíku.'),
  eq('kclo3', 'KClO3', 'KCl + O2', [2, 2, 3], 1, 'Tepelný rozklad chlorečnanu draselného.'),
  eq('ki-cl2', 'KI + Cl2', 'KCl + I2', [2, 1, 2, 1], 1, 'Chlor vytěsní jod z jodidu.'),
  eq('naoh-co2', 'NaOH + CO2', 'Na2CO3 + H2O', [2, 1, 1, 1], 1, 'Hydroxid sodný pohlcuje oxid uhličitý.'),

  // ---------- medium ----------
  eq('fe2o3', 'Fe + O2', 'Fe2O3', [4, 3, 2], 2, 'Železo rezaví (zjednodušeně).'),
  eq('al2o3', 'Al + O2', 'Al2O3', [4, 3, 2], 2, 'Hliník se pokryje ochrannou vrstvou oxidu.'),
  eq('p2o5', 'P + O2', 'P2O5', [4, 5, 2], 2, 'Hoření fosforu.'),
  eq('ch4', 'CH4 + O2', 'CO2 + H2O', [1, 2, 1, 2], 2, 'Hoření methanu (zemní plyn).'),
  eq('na-h2o', 'Na + H2O', 'NaOH + H2', [2, 2, 2, 1], 2, 'Sodík divoce reaguje s vodou.'),
  eq('neutral-h2so4', 'H2SO4 + NaOH', 'Na2SO4 + H2O', [1, 2, 1, 2], 2, 'Neutralizace kyseliny sírové.'),
  eq('caoh2-hcl', 'Ca(OH)2 + HCl', 'CaCl2 + H2O', [1, 2, 1, 2], 2, 'Neutralizace hydroxidu vápenatého.'),
  eq('al-hcl', 'Al + HCl', 'AlCl3 + H2', [2, 6, 2, 3], 2, 'Hliník se rozpouští v kyselině chlorovodíkové.'),
  eq('caco3-hcl', 'CaCO3 + HCl', 'CaCl2 + H2O + CO2', [1, 2, 1, 1, 1], 2, 'Vápenec šumí v kyselině.'),
  eq('nahco3', 'NaHCO3', 'Na2CO3 + H2O + CO2', [2, 1, 1, 1], 2, 'Jedlá soda se při pečení rozkládá.'),
  eq('bacl2', 'BaCl2 + Na2SO4', 'BaSO4 + NaCl', [1, 1, 1, 2], 2, 'Srážení bílého síranu barnatého.'),
  eq('fecl3', 'Fe + Cl2', 'FeCl3', [2, 3, 2], 2, 'Železo hoří v chloru.'),
  eq('al2o3-hcl', 'Al2O3 + HCl', 'AlCl3 + H2O', [1, 6, 2, 3], 2, 'Amfoterní oxid hlinitý reaguje s kyselinou.'),
  eq('fe-h2o', 'Fe + H2O', 'Fe3O4 + H2', [3, 4, 1, 4], 2, 'Rozžhavené železo rozkládá vodní páru.'),
  eq('ethanol', 'C2H5OH + O2', 'CO2 + H2O', [1, 3, 2, 3], 2, 'Hoření ethanolu (líh v kahanu).'),
  eq('agno3-cu', 'Cu + AgNO3', 'Cu(NO3)2 + Ag', [1, 2, 1, 2], 2, 'Měď vytěsní stříbro z roztoku – „stříbrný stromeček“.'),
  eq('h2s', 'H2S + O2', 'SO2 + H2O', [2, 3, 2, 2], 2, 'Hoření sulfanu.'),
  eq('photo', 'CO2 + H2O', 'C6H12O6 + O2', [6, 6, 1, 6], 2, 'Fotosyntéza.'),

  // ---------- hard ----------
  eq('propane', 'C3H8 + O2', 'CO2 + H2O', [1, 5, 3, 4], 3, 'Hoření propanu (plyn do vařiče).'),
  eq('ethane', 'C2H6 + O2', 'CO2 + H2O', [2, 7, 4, 6], 3, 'Hoření ethanu.'),
  eq('butane', 'C4H10 + O2', 'CO2 + H2O', [2, 13, 8, 10], 3, 'Hoření butanu (zapalovač).'),
  eq('glucose', 'C6H12O6 + O2', 'CO2 + H2O', [1, 6, 6, 6], 3, 'Buněčné dýchání – oxidace glukózy.'),
  eq('al-h2so4', 'Al + H2SO4', 'Al2(SO4)3 + H2', [2, 3, 1, 3], 3, 'Hliník ve zředěné kyselině sírové.'),
  eq('caoh2-h3po4', 'Ca(OH)2 + H3PO4', 'Ca3(PO4)2 + H2O', [3, 2, 1, 6], 3, 'Neutralizace kyseliny fosforečné.'),
  eq('fe2o3-co', 'Fe2O3 + CO', 'Fe + CO2', [1, 3, 2, 3], 3, 'Výroba železa ve vysoké peci.'),
  eq('fe3o4-co', 'Fe3O4 + CO', 'Fe + CO2', [1, 4, 3, 4], 3, 'Redukce magnetitu ve vysoké peci.'),
  eq('kmno4-heat', 'KMnO4', 'K2MnO4 + MnO2 + O2', [2, 1, 1, 1], 3, 'Tepelný rozklad manganistanu – příprava kyslíku.', true),
  eq('nh3-ox', 'NH3 + O2', 'NO + H2O', [4, 5, 4, 6], 3, 'Katalytická oxidace amoniaku (výroba HNO₃).', true),
  eq('mno2-hcl', 'MnO2 + HCl', 'MnCl2 + Cl2 + H2O', [1, 4, 1, 1, 2], 3, 'Příprava chloru z burelu.', true),
  eq('cu-hno3-conc', 'Cu + HNO3', 'Cu(NO3)2 + NO2 + H2O', [1, 4, 1, 2, 2], 3, 'Měď v koncentrované kyselině dusičné – hnědý NO₂.', true),
  eq('cu-hno3-dil', 'Cu + HNO3', 'Cu(NO3)2 + NO + H2O', [3, 8, 3, 2, 4], 3, 'Měď ve zředěné kyselině dusičné.', true),
  eq('cu-h2so4', 'Cu + H2SO4', 'CuSO4 + SO2 + H2O', [1, 2, 1, 1, 2], 3, 'Měď v horké koncentrované kyselině sírové.', true),
  eq('kmno4-hcl', 'KMnO4 + HCl', 'KCl + MnCl2 + Cl2 + H2O', [2, 16, 2, 2, 5, 8], 3, 'Manganistan oxiduje chlorovodík na chlor.', true),
  eq('k2cr2o7-hcl', 'K2Cr2O7 + HCl', 'KCl + CrCl3 + Cl2 + H2O', [1, 14, 2, 2, 3, 7], 3, 'Dichroman oxiduje chlorovodík.', true),
  eq(
    'kmno4-feso4',
    'KMnO4 + FeSO4 + H2SO4',
    'K2SO4 + MnSO4 + Fe2(SO4)3 + H2O',
    [2, 10, 8, 1, 2, 5, 8],
    3,
    'Manganometrie – manganistan oxiduje železnaté ionty.',
    true,
  ),
]

/** Element order of first appearance (for the tally). */
export function elementsOf(e: Equation): string[] {
  const out: string[] = []
  for (const f of [...e.reactants, ...e.products]) for (const el of Object.keys(parseFormula(f))) if (!out.includes(el)) out.push(el)
  return out
}

/** Atom counts per element on each side for given coefficients. */
export function tally(e: Equation, coefs: number[]): Record<string, [number, number]> {
  const t: Record<string, [number, number]> = {}
  for (const el of elementsOf(e)) t[el] = [0, 0]
  const add = (formulas: string[], offset: number, side: 0 | 1) =>
    formulas.forEach((f, i) => {
      for (const [el, n] of Object.entries(parseFormula(f))) t[el][side] += n * coefs[offset + i]
    })
  add(e.reactants, 0, 0)
  add(e.products, e.reactants.length, 1)
  return t
}

export function isBalanced(e: Equation, coefs: number[]): boolean {
  return Object.values(tally(e, coefs)).every(([l, r]) => l === r)
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
export const gcdAll = (xs: number[]) => xs.reduce((g, x) => gcd(g, x), 0)

/** Pick `n` equations for a level (l4–l5: easy/medium plus one hard non-redox; l6+: redox included). */
export function pickEquations(level: number, rnd: () => number = Math.random, n = 6): Equation[] {
  const shuffle = <T,>(a: T[]) => {
    const b = [...a]
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[b[i], b[j]] = [b[j], b[i]]
    }
    return b
  }
  const withRedox = level >= 6
  const plan: (1 | 2 | 3 | 'redox')[] = withRedox ? [1, 2, 2, 3, 'redox', 'redox'] : [1, 1, 2, 2, 2, 3]
  const used = new Set<string>()
  const out: Equation[] = []
  for (const slot of plan.slice(0, n)) {
    const pool = shuffle(
      EQUATIONS.filter((e) =>
        slot === 'redox' ? e.redox : e.level === slot && !e.redox,
      ),
    ).filter((e) => !used.has(e.id))
    const pickE = pool[0]
    if (!pickE) continue
    used.add(pickE.id)
    out.push(pickE)
  }
  return out
}
