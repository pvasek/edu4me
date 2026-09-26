import { describe, expect, it } from 'vitest'
import { parseFormula } from '../../courses/chemie/data/formula'
import { ANIONS, CATIONS, anion, cation, ionMarkup, ionPlain } from './ions'
import {
  adjective,
  anionStem,
  binary,
  crossRule,
  genitive,
  group,
  halide,
  hydrate,
  hydroxide,
  normalizeFormula,
  oxide,
  oxoacid,
  oxoanion,
  salt,
  sulfide,
} from './nomenclature'

describe('adjective endings I–VIII', () => {
  const cases: [string, number, string][] = [
    ['Na', 1, 'sodný'],
    ['K', 1, 'draselný'],
    ['Cu', 1, 'měďný'],
    ['Cu', 2, 'měďnatý'],
    ['Ca', 2, 'vápenatý'],
    ['Mg', 2, 'hořečnatý'],
    ['Zn', 2, 'zinečnatý'],
    ['Fe', 2, 'železnatý'],
    ['Fe', 3, 'železitý'],
    ['Al', 3, 'hlinitý'],
    ['Mn', 2, 'manganatý'],
    ['Mn', 4, 'manganičitý'],
    ['Mn', 6, 'manganový'],
    ['Mn', 7, 'manganistý'],
    ['Sn', 2, 'cínatý'],
    ['Sn', 4, 'cíničitý'],
    ['Pb', 2, 'olovnatý'],
    ['Pb', 4, 'olovičitý'],
    ['Ni', 2, 'nikelnatý'],
    ['C', 2, 'uhelnatý'],
    ['C', 4, 'uhličitý'],
    ['Si', 4, 'křemičitý'],
    ['N', 1, 'dusný'],
    ['N', 2, 'dusnatý'],
    ['N', 3, 'dusitý'],
    ['N', 4, 'dusičitý'],
    ['N', 5, 'dusičný'],
    ['P', 3, 'fosforitý'],
    ['P', 5, 'fosforečný'],
    ['S', 2, 'sirnatý'],
    ['S', 4, 'siřičitý'],
    ['S', 6, 'sírový'],
    ['Cl', 1, 'chlorný'],
    ['Cl', 3, 'chloritý'],
    ['Cl', 5, 'chlorečný'],
    ['Cl', 7, 'chloristý'],
    ['I', 5, 'jodičný'],
    ['Cr', 3, 'chromitý'],
    ['Cr', 6, 'chromový'],
    ['Os', 8, 'osmičelý'],
    ['Ti', 4, 'titaničitý'],
    ['V', 5, 'vanadičný'],
    ['Xe', 2, 'xenonatý'],
  ]
  it.each(cases)('%s(%i) -> %s', (el, ox, adj) => {
    expect(adjective(el, ox)).toBe(adj)
  })
})

describe('binary compounds', () => {
  const cases: [string, string, { formula: string; name: string }][] = [
    ['SO2', 'oxid siřičitý', oxide('S', 4)],
    ['SO3', 'oxid sírový', oxide('S', 6)],
    ['Fe2O3', 'oxid železitý', oxide('Fe', 3)],
    ['FeO', 'oxid železnatý', oxide('Fe', 2)],
    ['CO', 'oxid uhelnatý', oxide('C', 2)],
    ['CO2', 'oxid uhličitý', oxide('C', 4)],
    ['N2O', 'oxid dusný', oxide('N', 1)],
    ['NO', 'oxid dusnatý', oxide('N', 2)],
    ['N2O3', 'oxid dusitý', oxide('N', 3)],
    ['NO2', 'oxid dusičitý', oxide('N', 4)],
    ['N2O5', 'oxid dusičný', oxide('N', 5)],
    ['P2O5', 'oxid fosforečný', oxide('P', 5)],
    ['Cl2O7', 'oxid chloristý', oxide('Cl', 7)],
    ['Cl2O', 'oxid chlorný', oxide('Cl', 1)],
    ['OsO4', 'oxid osmičelý', oxide('Os', 8)],
    ['Mn2O7', 'oxid manganistý', oxide('Mn', 7)],
    ['MnO2', 'oxid manganičitý', oxide('Mn', 4)],
    ['Al2O3', 'oxid hlinitý', oxide('Al', 3)],
    ['Na2O', 'oxid sodný', oxide('Na', 1)],
    ['Cu2O', 'oxid měďný', oxide('Cu', 1)],
    ['CaO', 'oxid vápenatý', oxide('Ca', 2)],
    ['SiO2', 'oxid křemičitý', oxide('Si', 4)],
    ['CrO3', 'oxid chromový', oxide('Cr', 6)],
    ['NaCl', 'chlorid sodný', halide('Na', 1, 'Cl')],
    ['CaF2', 'fluorid vápenatý', halide('Ca', 2, 'F')],
    ['FeCl3', 'chlorid železitý', halide('Fe', 3, 'Cl')],
    ['PCl5', 'chlorid fosforečný', halide('P', 5, 'Cl')],
    ['SF6', 'fluorid sírový', halide('S', 6, 'F')],
    ['CCl4', 'chlorid uhličitý', halide('C', 4, 'Cl')],
    ['SnCl4', 'chlorid cíničitý', halide('Sn', 4, 'Cl')],
    ['KI', 'jodid draselný', halide('K', 1, 'I')],
    ['AgBr', 'bromid stříbrný', halide('Ag', 1, 'Br')],
    ['Na2S', 'sulfid sodný', sulfide('Na', 1)],
    ['Al2S3', 'sulfid hlinitý', sulfide('Al', 3)],
    ['CS2', 'sulfid uhličitý', sulfide('C', 4)],
    ['PbS', 'sulfid olovnatý', sulfide('Pb', 2)],
    ['CaH2', 'hydrid vápenatý', binary('Ca', 2, 'H')],
    ['NaH', 'hydrid sodný', binary('Na', 1, 'H')],
    ['AlH3', 'hydrid hlinitý', binary('Al', 3, 'H')],
    ['Mg3N2', 'nitrid hořečnatý', binary('Mg', 2, 'N')],
    ['XeF4', 'fluorid xenoničitý', halide('Xe', 4, 'F')],
  ]
  it.each(cases)('%s = %s', (formula, name, got) => {
    expect(got).toEqual({ formula, name })
  })
})

describe('hydroxides', () => {
  it.each([
    ['NaOH', 'hydroxid sodný', hydroxide(cation('Na'))],
    ['Ca(OH)2', 'hydroxid vápenatý', hydroxide(cation('Ca'))],
    ['Al(OH)3', 'hydroxid hlinitý', hydroxide(cation('Al'))],
    ['Fe(OH)3', 'hydroxid železitý', hydroxide('Fe', 3)],
    ['Fe(OH)2', 'hydroxid železnatý', hydroxide('Fe', 2)],
    ['Cu(OH)2', 'hydroxid měďnatý', hydroxide(cation('Cu', 2))],
    ['NH4OH', 'hydroxid amonný', hydroxide(cation('NH4'))],
    ['Ba(OH)2', 'hydroxid barnatý', hydroxide('Ba', 2)],
  ])('%s = %s', (formula, name, got) => {
    expect(got).toEqual({ formula, name })
  })
})

describe('oxoacids (H/X/O rule)', () => {
  it.each([
    ['H2SO4', 'kyselina sírová', 'S', 6],
    ['H2SO3', 'kyselina siřičitá', 'S', 4],
    ['HNO3', 'kyselina dusičná', 'N', 5],
    ['HNO2', 'kyselina dusitá', 'N', 3],
    ['H2CO3', 'kyselina uhličitá', 'C', 4],
    ['H3PO4', 'kyselina fosforečná', 'P', 5],
    ['HClO4', 'kyselina chloristá', 'Cl', 7],
    ['HClO3', 'kyselina chlorečná', 'Cl', 5],
    ['HClO2', 'kyselina chloritá', 'Cl', 3],
    ['HClO', 'kyselina chlorná', 'Cl', 1],
    ['HMnO4', 'kyselina manganistá', 'Mn', 7],
    ['H2MnO4', 'kyselina manganová', 'Mn', 6],
    ['H2CrO4', 'kyselina chromová', 'Cr', 6],
    ['H2SiO3', 'kyselina křemičitá', 'Si', 4],
    ['H3BO3', 'kyselina boritá', 'B', 3],
    ['HBrO3', 'kyselina bromečná', 'Br', 5],
    ['HIO3', 'kyselina jodičná', 'I', 5],
    ['HIO4', 'kyselina jodistá', 'I', 7],
    ['H2SeO4', 'kyselina selenová', 'Se', 6],
  ] as [string, string, string, number][])('%s = %s', (formula, name, el, ox) => {
    const a = oxoacid(el, ox)
    expect({ formula: a.formula, name: a.name }).toEqual({ formula, name })
    // Sum of oxidation numbers is zero: h·(+1) + ox + o·(−2) = 0
    expect(a.h + ox - 2 * a.o).toBe(0)
  })
})

describe('salts', () => {
  const S = (c: [string, number?], a: string) => salt(cation(c[0], c[1]), anion(a))
  it.each([
    ['CuSO4', 'síran měďnatý', S(['Cu', 2], 'SO4')],
    ['AgNO3', 'dusičnan stříbrný', S(['Ag'], 'NO3')],
    ['CaCO3', 'uhličitan vápenatý', S(['Ca'], 'CO3')],
    ['NaHCO3', 'hydrogenuhličitan sodný', S(['Na'], 'HCO3')],
    ['Ca3(PO4)2', 'fosforečnan vápenatý', S(['Ca'], 'PO4')],
    ['Al2(SO4)3', 'síran hlinitý', S(['Al'], 'SO4')],
    ['KMnO4', 'manganistan draselný', S(['K'], 'MnO4')],
    ['NaClO', 'chlornan sodný', S(['Na'], 'ClO')],
    ['K2Cr2O7', 'dichroman draselný', S(['K'], 'Cr2O7')],
    ['(NH4)2SO4', 'síran amonný', S(['NH4'], 'SO4')],
    ['NH4Cl', 'chlorid amonný', S(['NH4'], 'Cl')],
    ['Fe2(SO4)3', 'síran železitý', S(['Fe', 3], 'SO4')],
    ['FeSO4', 'síran železnatý', S(['Fe', 2], 'SO4')],
    ['Na2CO3', 'uhličitan sodný', S(['Na'], 'CO3')],
    ['Ca(HCO3)2', 'hydrogenuhličitan vápenatý', S(['Ca'], 'HCO3')],
    ['NaH2PO4', 'dihydrogenfosforečnan sodný', S(['Na'], 'H2PO4')],
    ['K2HPO4', 'hydrogenfosforečnan draselný', S(['K'], 'HPO4')],
    ['Mg(NO3)2', 'dusičnan hořečnatý', S(['Mg'], 'NO3')],
    ['KNO2', 'dusitan draselný', S(['K'], 'NO2')],
    ['Na2SO3', 'siřičitan sodný', S(['Na'], 'SO3')],
    ['KClO3', 'chlorečnan draselný', S(['K'], 'ClO3')],
    ['Al2O3', 'oxid hlinitý', S(['Al'], 'O')],
    ['AlPO4', 'fosforečnan hlinitý', S(['Al'], 'PO4')],
    ['Pb(NO3)2', 'dusičnan olovnatý', S(['Pb'], 'NO3')],
    ['Cr2(SO4)3', 'síran chromitý', S(['Cr'], 'SO4')],
  ])('%s = %s', (formula, name, got) => {
    expect(got).toEqual({ formula, name })
  })

  it('makes hydrates', () => {
    const cuso4 = salt(cation('Cu', 2), anion('SO4'))
    expect(hydrate(cuso4, 5)).toEqual({ formula: 'CuSO4·5H2O', name: 'pentahydrát síranu měďnatého' })
    const soda = salt(cation('Na'), anion('CO3'))
    expect(hydrate(soda, 10)).toEqual({ formula: 'Na2CO3·10H2O', name: 'dekahydrát uhličitanu sodného' })
    const gypsum = salt(cation('Ca'), anion('SO4'))
    expect(hydrate(gypsum, 2)).toEqual({ formula: 'CaSO4·2H2O', name: 'dihydrát síranu vápenatého' })
    expect(parseFormula(hydrate(cuso4, 5).formula)).toEqual({ Cu: 1, S: 1, O: 9, H: 10 })
  })
})

describe('oxoanions derived from acids agree with the ion table', () => {
  it.each([
    ['S', 6, 0, 'SO4'],
    ['S', 6, 1, 'HSO4'],
    ['S', 4, 0, 'SO3'],
    ['S', 4, 1, 'HSO3'],
    ['N', 5, 0, 'NO3'],
    ['N', 3, 0, 'NO2'],
    ['C', 4, 0, 'CO3'],
    ['C', 4, 1, 'HCO3'],
    ['P', 5, 0, 'PO4'],
    ['P', 5, 1, 'HPO4'],
    ['P', 5, 2, 'H2PO4'],
    ['Cl', 1, 0, 'ClO'],
    ['Cl', 3, 0, 'ClO2'],
    ['Cl', 5, 0, 'ClO3'],
    ['Cl', 7, 0, 'ClO4'],
    ['Mn', 7, 0, 'MnO4'],
    ['Cr', 6, 0, 'CrO4'],
    ['Si', 4, 0, 'SiO3'],
  ] as [string, number, number, string][])('%s(%i) keep %i H -> %s', (el, ox, keep, formula) => {
    const a = anion(formula)
    expect(oxoanion(el, ox, keep)).toEqual({ formula: a.formula, charge: a.charge, stem: a.stem })
  })

  it('acid names in the ion table match the generator', () => {
    expect(anion('SO4').acid).toBe(oxoacid('S', 6).name)
    expect(anion('ClO').acid).toBe(oxoacid('Cl', 1).name)
    expect(anion('PO4').acid).toBe(oxoacid('P', 5).name)
  })
})

describe('ion table sanity', () => {
  it('all formulas parse and charges have the right sign', () => {
    for (const c of CATIONS) {
      expect(c.charge).toBeGreaterThan(0)
      expect(() => parseFormula(c.formula)).not.toThrow()
      expect(c.ion).toBe(`${c.adj} kation`)
    }
    for (const a of ANIONS) {
      expect(a.charge).toBeLessThan(0)
      expect(() => parseFormula(a.formula)).not.toThrow()
      expect(a.ion).toBe(`${a.stem}ový anion`)
    }
  })
  it('monoatomic cation adjectives agree with the element table', () => {
    for (const c of CATIONS) {
      if (c.noSalt || c.formula === 'NH4') continue
      expect(adjective(c.formula, c.charge)).toBe(c.adj)
    }
  })
  it('salts are electrically neutral', () => {
    for (const c of CATIONS.filter((x) => !x.noSalt)) {
      for (const a of ANIONS) {
        const [nc, na] = crossRule(c.charge, a.charge)
        expect(nc * c.charge + na * a.charge).toBe(0)
      }
    }
  })
  it('formats ions', () => {
    expect(ionMarkup(anion('SO4'))).toBe('$SO4^2-$')
    expect(ionMarkup(cation('NH4'))).toBe('$NH4^+$')
    expect(ionPlain(cation('Fe', 3))).toBe('Fe³⁺')
    expect(ionPlain(anion('PO4'))).toBe('PO₄³⁻')
  })
})

describe('helpers', () => {
  it('cross rule', () => {
    expect(crossRule(3, -2)).toEqual([2, 3])
    expect(crossRule(2, -2)).toEqual([1, 1])
    expect(crossRule(4, -2)).toEqual([1, 2])
  })
  it('groups', () => {
    expect(group('SO4', 3)).toBe('(SO4)3')
    expect(group('OH', 2)).toBe('(OH)2')
    expect(group('Cl', 2)).toBe('Cl2')
    expect(group('NH4', 1)).toBe('NH4')
  })
  it('genitive and anion stems', () => {
    expect(genitive('síran měďnatý')).toBe('síranu měďnatého')
    expect(genitive('hydrogenuhličitan sodný')).toBe('hydrogenuhličitanu sodného')
    expect(anionStem('sírový')).toBe('síran')
    expect(anionStem('dusičný')).toBe('dusičnan')
    expect(anionStem('chlorný')).toBe('chlornan')
    expect(anionStem('siřičitý')).toBe('siřičitan')
  })
  it('normalises typed formulas without touching case', () => {
    expect(normalizeFormula(' CuSO4 . 5H2O ')).toBe('CuSO4·5H2O')
    expect(normalizeFormula('H₂SO₄')).toBe('H2SO4')
    expect(normalizeFormula('co')).toBe('co')
  })
})
