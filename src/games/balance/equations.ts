import { parseFormula } from '../../courses/chemie/data/formula'
import { shuffle } from '../shared/util'

export interface Equation {
  id: string
  reactants: string[]
  products: string[]
  /** Smallest whole-number coefficients, reactants first, then products. */
  coefs: number[]
  /** Short Czech caption shown with the equation: what is happening. */
  caption: string
  /** Redox equation (level 6+), shown with an eyebrow. */
  redox?: boolean
}

/** Levels the game supports (see spec/courses/chemie/games.md). */
export const BALANCE_LEVELS = [4, 5, 6, 7, 8, 9] as const
/** Equations in one round. */
export const ROUND = 6
/** Highest coefficient the stepper allows. */
export const MAX_COEF = 20

const eq = (id: string, left: string, right: string, coefs: number[], caption: string, redox = false): Equation => ({
  id,
  reactants: left.split(' + '),
  products: right.split(' + '),
  coefs,
  caption,
  ...(redox ? { redox } : {}),
})

/**
 * Equations per level. Every one balances with its listed minimal coefficients,
 * has exactly one solution and is not balanced with all coefficients 1
 * (checked in equations.test.ts). Bonds (-, =, ≡) are allowed in organic formulas.
 */
export const LEVELS: Record<number, Equation[]> = {
  // Syntéza, rozklad, jednoduchá a podvojná záměna, hoření prvků a methanu.
  4: [
    eq('l4-h2o', 'H2 + O2', 'H2O', [2, 1, 2], 'Syntéza: hoření vodíku na vodu'),
    eq('l4-nacl', 'Na + Cl2', 'NaCl', [2, 1, 2], 'Syntéza: sodík hoří v chloru na kuchyňskou sůl'),
    eq('l4-mgo', 'Mg + O2', 'MgO', [2, 1, 2], 'Syntéza: hořčík hoří oslnivým plamenem'),
    eq('l4-al2o3', 'Al + O2', 'Al2O3', [4, 3, 2], 'Syntéza: hliník se pokryje vrstvičkou oxidu'),
    eq('l4-fecl3', 'Fe + Cl2', 'FeCl3', [2, 3, 2], 'Syntéza: železo hoří v chloru'),
    eq('l4-al2s3', 'Al + S', 'Al2S3', [2, 3, 1], 'Syntéza: hliník se slučuje se sírou'),
    eq('l4-li3n', 'Li + N2', 'Li3N', [6, 1, 2], 'Syntéza: lithium reaguje i s dusíkem'),
    eq('l4-hgo', 'HgO', 'Hg + O2', [2, 2, 1], 'Rozklad: tak Priestley objevil kyslík'),
    eq('l4-kclo3', 'KClO3', 'KCl + O2', [2, 2, 3], 'Rozklad: tepelný rozklad chlorečnanu draselného'),
    eq('l4-nan3', 'NaN3', 'Na + N2', [2, 2, 3], 'Rozklad: azid sodný nafoukne airbag'),
    eq('l4-h2o-el', 'H2O', 'H2 + O2', [2, 2, 1], 'Rozklad: voda se proudem rozloží na plyny'),
    eq('l4-cl2-kbr', 'Cl2 + KBr', 'KCl + Br2', [1, 2, 2, 1], 'Jednoduchá záměna: chlor vytěsní brom'),
    eq('l4-cu-agno3', 'Cu + AgNO3', 'Cu(NO3)2 + Ag', [1, 2, 1, 2], 'Jednoduchá záměna: měď vytěsní stříbro'),
    eq('l4-al-cucl2', 'Al + CuCl2', 'AlCl3 + Cu', [2, 3, 2, 3], 'Jednoduchá záměna: hliník vyloučí měď'),
    eq('l4-pbi2', 'Pb(NO3)2 + KI', 'PbI2 + KNO3', [1, 2, 1, 2], 'Podvojná záměna: „zlatý déšť“ jodidu olovnatého'),
    eq('l4-cus', 'CuCl2 + Na2S', 'CuS + NaCl', [1, 1, 1, 2], 'Podvojná záměna: sráží se černý sulfid měďnatý'),
    eq('l4-ch4', 'CH4 + O2', 'CO2 + H2O', [1, 2, 1, 2], 'Hoření methanu (zemní plyn)'),
    eq('l4-co', 'C + O2', 'CO', [2, 1, 2], 'Nedokonalé hoření uhlíku na jedovatý CO'),
    eq('l4-p2o5', 'P + O2', 'P2O5', [4, 5, 2], 'Hoření fosforu bílým dýmem'),
  ],

  // Neutralizace, srážecí reakce, kyselina + kov, kyselina + uhličitan.
  5: [
    eq('l5-h2so4-naoh', 'H2SO4 + NaOH', 'Na2SO4 + H2O', [1, 2, 1, 2], 'Neutralizace kyseliny sírové hydroxidem sodným'),
    eq('l5-hcl-caoh2', 'HCl + Ca(OH)2', 'CaCl2 + H2O', [2, 1, 1, 2], 'Neutralizace hydroxidu vápenatého'),
    eq('l5-h3po4-caoh2', 'H3PO4 + Ca(OH)2', 'Ca3(PO4)2 + H2O', [2, 3, 1, 6], 'Neutralizace kyseliny fosforečné vápenným mlékem'),
    eq('l5-h3po4-naoh', 'H3PO4 + NaOH', 'Na3PO4 + H2O', [1, 3, 1, 3], 'Úplná neutralizace kyseliny fosforečné'),
    eq('l5-hno3-baoh2', 'HNO3 + Ba(OH)2', 'Ba(NO3)2 + H2O', [2, 1, 1, 2], 'Neutralizace kyseliny dusičné'),
    eq('l5-aloh3-hcl', 'Al(OH)3 + HCl', 'AlCl3 + H2O', [1, 3, 1, 3], 'Antacidum: hydroxid hlinitý neutralizuje žaludeční kyselinu'),
    eq('l5-h2so4-aloh3', 'H2SO4 + Al(OH)3', 'Al2(SO4)3 + H2O', [3, 2, 1, 6], 'Neutralizace: vzniká síran hlinitý'),
    eq('l5-agcl', 'AgNO3 + CaCl2', 'AgCl + Ca(NO3)2', [2, 1, 2, 1], 'Srážení: důkaz chloridů bílou sraženinou AgCl'),
    eq('l5-baso4', 'BaCl2 + Na2SO4', 'BaSO4 + NaCl', [1, 1, 1, 2], 'Srážení: bílý síran barnatý dokazuje sírany'),
    eq('l5-cuoh2', 'CuSO4 + NaOH', 'Cu(OH)2 + Na2SO4', [1, 2, 1, 1], 'Srážení: modrá sraženina hydroxidu měďnatého'),
    eq('l5-feoh3', 'FeCl3 + NaOH', 'Fe(OH)3 + NaCl', [1, 3, 1, 3], 'Srážení: rezavě hnědý hydroxid železitý'),
    eq('l5-zn-hcl', 'Zn + HCl', 'ZnCl2 + H2', [1, 2, 1, 1], 'Kyselina + kov: zinek uvolní vodík'),
    eq('l5-fe-hcl', 'Fe + HCl', 'FeCl2 + H2', [1, 2, 1, 1], 'Kyselina + kov: železo v kyselině chlorovodíkové'),
    eq('l5-al-hcl', 'Al + HCl', 'AlCl3 + H2', [2, 6, 2, 3], 'Kyselina + kov: hliník se rozpouští v HCl'),
    eq('l5-al-h2so4', 'Al + H2SO4', 'Al2(SO4)3 + H2', [2, 3, 1, 3], 'Kyselina + kov: hliník ve zředěné kyselině sírové'),
    eq('l5-caco3-hcl', 'CaCO3 + HCl', 'CaCl2 + H2O + CO2', [1, 2, 1, 1, 1], 'Kyselina + uhličitan: vápenec šumí'),
    eq('l5-na2co3-hcl', 'Na2CO3 + HCl', 'NaCl + H2O + CO2', [1, 2, 2, 1, 1], 'Kyselina + uhličitan: soda uvolní CO₂'),
    eq('l5-nahco3-h2so4', 'NaHCO3 + H2SO4', 'Na2SO4 + H2O + CO2', [2, 1, 1, 2, 2], 'Kyselina + hydrogenuhličitan: jedlá soda šumí'),
    eq('l5-cuo-hcl', 'CuO + HCl', 'CuCl2 + H2O', [1, 2, 1, 1], 'Zásaditý oxid + kyselina: vzniká sůl a voda'),
    eq('l5-p2o5', 'P2O5 + H2O', 'H3PO4', [1, 3, 2], 'Kyselinotvorný oxid + voda: kyselina fosforečná'),
  ],

  // Redoxní rovnice (vyčíslení přes oxidační čísla) a elektrolýza.
  6: [
    eq('l6-kmno4-hcl', 'KMnO4 + HCl', 'KCl + MnCl2 + Cl2 + H2O', [2, 16, 2, 2, 5, 8], 'Manganistan oxiduje chlorovodík na chlor', true),
    eq('l6-cu-hno3-dil', 'Cu + HNO3', 'Cu(NO3)2 + NO + H2O', [3, 8, 3, 2, 4], 'Měď ve zředěné kyselině dusičné: vzniká NO', true),
    eq('l6-cu-hno3-conc', 'Cu + HNO3', 'Cu(NO3)2 + NO2 + H2O', [1, 4, 1, 2, 2], 'Měď v koncentrované HNO₃: hnědý NO₂', true),
    eq('l6-k2cr2o7-hcl', 'K2Cr2O7 + HCl', 'KCl + CrCl3 + Cl2 + H2O', [1, 14, 2, 2, 3, 7], 'Dichroman oxiduje chlorovodík', true),
    eq('l6-k2cr2o7-feso4', 'K2Cr2O7 + FeSO4 + H2SO4', 'K2SO4 + Cr2(SO4)3 + Fe2(SO4)3 + H2O', [1, 6, 7, 1, 1, 3, 7], 'Dichroman oxiduje železnaté ionty', true),
    eq('l6-kmno4-feso4', 'KMnO4 + FeSO4 + H2SO4', 'K2SO4 + MnSO4 + Fe2(SO4)3 + H2O', [2, 10, 8, 1, 2, 5, 8], 'Manganometrie: manganistan oxiduje Fe²⁺', true),
    eq('l6-h2o2-ki', 'KI + H2O2 + H2SO4', 'I2 + K2SO4 + H2O', [2, 1, 1, 1, 1, 2], 'Peroxid vodíku jako oxidovadlo: vylučuje jod', true),
    eq('l6-h2o2-pbs', 'PbS + H2O2', 'PbSO4 + H2O', [1, 4, 1, 4], 'Peroxid jako oxidovadlo: černý PbS na bílý PbSO₄ (obnova obrazů)', true),
    eq('l6-h2o2-cl2', 'Cl2 + H2O2', 'HCl + O2', [1, 1, 2, 1], 'Peroxid vodíku jako redukční činidlo: redukuje chlor', true),
    eq('l6-mno2-hcl', 'MnO2 + HCl', 'MnCl2 + Cl2 + H2O', [1, 4, 1, 1, 2], 'Příprava chloru z burelu', true),
    eq('l6-cu-h2so4', 'Cu + H2SO4', 'CuSO4 + SO2 + H2O', [1, 2, 1, 1, 2], 'Měď v horké koncentrované kyselině sírové', true),
    eq('l6-zn-hno3', 'Zn + HNO3', 'Zn(NO3)2 + NH4NO3 + H2O', [4, 10, 4, 1, 3], 'Zinek ve velmi zředěné HNO₃: dusík až na −III', true),
    eq('l6-cl2-naoh', 'Cl2 + NaOH', 'NaCl + NaClO + H2O', [1, 2, 1, 1, 1], 'Disproporcionace chloru: vzniká SAVO', true),
    eq('l6-pb-acc', 'Pb + PbO2 + H2SO4', 'PbSO4 + H2O', [1, 1, 2, 2, 2], 'Olověný akumulátor při vybíjení', true),
    eq('l6-co-no', 'CO + NO', 'CO2 + N2', [2, 2, 2, 1], 'Katalyzátor v autě mění CO a NO na neškodné plyny', true),
    eq('l6-el-nacl', 'NaCl', 'Na + Cl2', [2, 2, 1], 'Elektrolýza taveniny chloridu sodného', true),
    eq('l6-el-cuso4', 'CuSO4 + H2O', 'Cu + O2 + H2SO4', [2, 2, 2, 1, 2], 'Elektrolýza roztoku síranu měďnatého', true),
  ],

  // Průmyslové výroby.
  7: [
    eq('l7-fe2o3-co', 'Fe2O3 + CO', 'Fe + CO2', [1, 3, 2, 3], 'Vysoká pec: redukce oxidu železitého'),
    eq('l7-fe3o4-co', 'Fe3O4 + CO', 'Fe + CO2', [1, 4, 3, 4], 'Vysoká pec: redukce magnetitu'),
    eq('l7-fe2o3-c', 'Fe2O3 + C', 'Fe + CO2', [2, 3, 4, 3], 'Redukce železné rudy koksem'),
    eq('l7-nh3', 'N2 + H2', 'NH3', [1, 3, 2], 'Haberova–Boschova syntéza amoniaku'),
    eq('l7-so3', 'SO2 + O2', 'SO3', [2, 1, 2], 'Kontaktní způsob: oxidace SO₂ na katalyzátoru V₂O₅'),
    eq('l7-fes2', 'FeS2 + O2', 'Fe2O3 + SO2', [4, 11, 2, 8], 'Pražení pyritu: zdroj SO₂ pro kyselinu sírovou'),
    eq('l7-zns', 'ZnS + O2', 'ZnO + SO2', [2, 3, 2, 2], 'Pražení sfaleritu při výrobě zinku'),
    eq('l7-ostwald-1', 'NH3 + O2', 'NO + H2O', [4, 5, 4, 6], 'Ostwaldův proces 1: katalytická oxidace amoniaku'),
    eq('l7-ostwald-2', 'NO + O2', 'NO2', [2, 1, 2], 'Ostwaldův proces 2: NO na hnědý NO₂'),
    eq('l7-ostwald-3', 'NO2 + O2 + H2O', 'HNO3', [4, 1, 2, 4], 'Ostwaldův proces 3: vzniká kyselina dusičná'),
    eq('l7-dolomit', 'CaMg(CO3)2', 'CaO + MgO + CO2', [1, 1, 1, 2], 'Vápenka: pálení dolomitu'),
    eq('l7-cac2', 'CaO + C', 'CaC2 + CO', [1, 3, 1, 1], 'Z páleného vápna karbid vápníku'),
    eq('l7-gypsum', 'CaSO3 + O2 + H2O', 'CaSO4·2H2O', [2, 1, 4, 2], 'Odsiřování elektráren: vzniká sádrovec'),
    eq('l7-superphosphate', 'Ca3(PO4)2 + H2SO4', 'Ca(H2PO4)2 + CaSO4', [1, 2, 1, 2], 'Výroba superfosfátu (hnojivo)'),
    eq('l7-thermite', 'Fe2O3 + Al', 'Al2O3 + Fe', [1, 2, 1, 2], 'Aluminotermie: svařování kolejnic termitem'),
    eq('l7-chloralkali', 'NaCl + H2O', 'NaOH + H2 + Cl2', [2, 2, 2, 1, 1], 'Elektrolýza solanky: NaOH, vodík a chlor'),
    eq('l7-al', 'Al2O3', 'Al + O2', [2, 4, 3], 'Elektrolýza taveniny bauxitu: výroba hliníku'),
    eq('l7-si', 'SiO2 + C', 'Si + CO', [1, 2, 1, 2], 'Výroba křemíku redukcí písku'),
    eq('l7-reforming', 'CH4 + H2O', 'CO + H2', [1, 1, 1, 3], 'Parní reforming: vodík pro syntézu amoniaku'),
    eq('l7-w', 'WO3 + H2', 'W + H2O', [1, 3, 1, 3], 'Výroba wolframu redukcí vodíkem'),
    eq('l7-p4', 'Ca3(PO4)2 + SiO2 + C', 'CaSiO3 + P4 + CO', [2, 6, 10, 6, 1, 10], 'Výroba fosforu v elektrické peci'),
    eq('l7-al-naoh', 'Al + NaOH + H2O', 'Na[Al(OH)4] + H2', [2, 2, 6, 2, 3], 'Amfoterní hliník se rozpouští v louhu'),
  ],

  // Spalování, halogenace, esterifikace, hydrogenace, zmýdelnění.
  8: [
    eq('l8-propane', 'C3H8 + O2', 'CO2 + H2O', [1, 5, 3, 4], 'Hoření propanu (plyn do vařiče)'),
    eq('l8-butane', 'C4H10 + O2', 'CO2 + H2O', [2, 13, 8, 10], 'Hoření butanu (zapalovač)'),
    eq('l8-ethane', 'C2H6 + O2', 'CO2 + H2O', [2, 7, 4, 6], 'Hoření ethanu'),
    eq('l8-pentane', 'C5H12 + O2', 'CO2 + H2O', [1, 8, 5, 6], 'Hoření pentanu'),
    eq('l8-hexane', 'C6H14 + O2', 'CO2 + H2O', [2, 19, 12, 14], 'Hoření hexanu (složka benzinu)'),
    eq('l8-ethene', 'CH2=CH2 + O2', 'CO2 + H2O', [1, 3, 2, 2], 'Hoření ethenu (alken)'),
    eq('l8-propene', 'CH2=CH-CH3 + O2', 'CO2 + H2O', [2, 9, 6, 6], 'Hoření propenu (alken)'),
    eq('l8-ethyne', 'CH≡CH + O2', 'CO2 + H2O', [2, 5, 4, 2], 'Hoření ethynu: acetylenový plamen řeže ocel'),
    eq('l8-methanol', 'CH3OH + O2', 'CO2 + H2O', [2, 3, 2, 4], 'Hoření methanolu (alkohol)'),
    eq('l8-ethanol', 'C2H5OH + O2', 'CO2 + H2O', [1, 3, 2, 3], 'Hoření ethanolu (líh v kahanu)'),
    eq('l8-propanol', 'C3H7OH + O2', 'CO2 + H2O', [2, 9, 6, 8], 'Hoření propan-1-olu (alkohol)'),
    eq('l8-ccl4', 'CH4 + Cl2', 'CCl4 + HCl', [1, 4, 1, 4], 'Halogenace: úplná chlorace methanu na tetrachlormethan'),
    eq('l8-ch2cl2', 'CH4 + Cl2', 'CH2Cl2 + HCl', [1, 2, 1, 2], 'Halogenace: chlorace methanu na dichlormethan'),
    eq('l8-c2h6-cl2', 'C2H6 + Cl2', 'C2H4Cl2 + HCl', [1, 2, 1, 2], 'Halogenace: radikálová chlorace ethanu'),
    eq('l8-c2h2-br2', 'CH≡CH + Br2', 'CHBr2-CHBr2', [1, 2, 1], 'Adice bromu na ethyn: bromová voda se odbarví'),
    eq('l8-diacetate', 'CH3COOH + HO-CH2-CH2-OH', 'CH3COO-CH2-CH2-OOCCH3 + H2O', [2, 1, 1, 2], 'Esterifikace: ethan-1,2-diol s kyselinou octovou'),
    eq('l8-triacetin', 'C3H5(OH)3 + CH3COOH', 'C3H5(OOCCH3)3 + H2O', [1, 3, 1, 3], 'Esterifikace: glycerol s kyselinou octovou'),
    eq('l8-ethyne-h2', 'CH≡CH + H2', 'CH3-CH3', [1, 2, 1], 'Hydrogenace ethynu až na ethan'),
    eq('l8-benzene-h2', 'C6H6 + H2', 'C6H12', [1, 3, 1], 'Hydrogenace benzenu na cyklohexan'),
    eq('l8-butadiene-h2', 'CH2=CH-CH=CH2 + H2', 'C4H10', [1, 2, 1], 'Hydrogenace buta-1,3-dienu na butan'),
    eq('l8-saponification', 'C3H5(OOCC17H35)3 + NaOH', 'C3H5(OH)3 + C17H35COONa', [1, 3, 1, 3], 'Zmýdelnění tristearinu hydroxidem sodným: vzniká mýdlo'),
    eq('l8-diacetate-naoh', 'CH3COO-CH2-CH2-OOCCH3 + NaOH', 'HO-CH2-CH2-OH + CH3COONa', [1, 2, 1, 2], 'Zásaditá hydrolýza diesteru hydroxidem sodným'),
    eq('l8-cracking', 'C16H34', 'C8H18 + CH2=CH2', [1, 1, 4], 'Krakování: z dlouhého alkanu benzin a ethen'),
  ],

  // Biochemické děje.
  9: [
    eq('l9-photosynthesis', 'CO2 + H2O', 'C6H12O6 + O2', [6, 6, 1, 6], 'Fotosyntéza: z CO₂ a vody glukóza'),
    eq('l9-respiration', 'C6H12O6 + O2', 'CO2 + H2O', [1, 6, 6, 6], 'Buněčné dýchání = pomalé „spalování“ glukózy'),
    eq('l9-sucrose-burn', 'C12H22O11 + O2', 'CO2 + H2O', [1, 12, 12, 11], 'Spalování sacharózy v kalorimetru'),
    eq('l9-alcoholic', 'C6H12O6', 'C2H5OH + CO2', [1, 2, 2], 'Alkoholové kvašení (kvasinky)'),
    eq('l9-lactic', 'C6H12O6', 'CH3-CH(OH)-COOH', [1, 2], 'Mléčné kvašení: ve svalech i v jogurtu'),
    eq('l9-lactate-ox', 'CH3-CH(OH)-COOH + O2', 'CO2 + H2O', [1, 3, 3, 3], 'Kyselina mléčná se v srdci a játrech oxiduje'),
    eq('l9-sucrose-hydrolysis', 'C12H22O11 + H2O', 'C6H12O6', [1, 1, 2], 'Hydrolýza sacharózy na glukózu a fruktózu'),
    eq('l9-sucrose-photo', 'CO2 + H2O', 'C12H22O11 + O2', [12, 11, 1, 12], 'Fotosyntéza cukrové řepy: souhrnně sacharóza'),
    eq('l9-glygly', 'H2N-CH2-COOH', 'C4H8N2O3 + H2O', [2, 1, 1], 'Vznik dipeptidu Gly-Gly: peptidová vazba'),
    eq('l9-alaala', 'H2N-CH(CH3)-COOH', 'C6H12N2O3 + H2O', [2, 1, 1], 'Vznik dipeptidu Ala-Ala z alaninu'),
    eq('l9-triglycine', 'H2N-CH2-COOH', 'C6H11N3O4 + H2O', [3, 1, 2], 'Tripeptid ze tří glycinů: dvě peptidové vazby'),
    eq('l9-fat', 'C3H5(OH)3 + C17H35COOH', 'C3H5(OOCC17H35)3 + H2O', [1, 3, 1, 3], 'Vznik tuku: glycerol a tři mastné kyseliny'),
    eq('l9-butyric', 'C3H7COOH + O2', 'CO2 + H2O', [1, 5, 4, 4], 'Oxidace kyseliny máselné (mastná kyselina)'),
    eq('l9-catalase', 'H2O2', 'H2O + O2', [2, 2, 1], 'Kataláza rozkládá peroxid vodíku v buňkách'),
    eq('l9-methanogens', 'CO2 + H2', 'CH4 + H2O', [1, 4, 1, 2], 'Metanogenní archea v bachoru krav vyrábějí methan'),
    eq('l9-nitrification', 'NH3 + O2', 'HNO2 + H2O', [2, 3, 2, 2], 'Nitrifikační bakterie oxidují amoniak v půdě'),
    eq('l9-urea', 'NH3 + CO2', 'CO(NH2)2 + H2O', [2, 1, 1, 1], 'Močovina: souhrnně z amoniaku a CO₂ (v játrech)'),
  ],
}

export const ALL_EQUATIONS: Equation[] = BALANCE_LEVELS.flatMap((l) => LEVELS[l])

/** Atom counts of a formula; bonds in condensed organic formulas are ignored. */
export const atoms = (f: string) => parseFormula(f.replace(/[-=≡–]/g, ''))

/** Element order of first appearance (for the tally). */
export function elementsOf(e: Equation): string[] {
  const out: string[] = []
  for (const f of [...e.reactants, ...e.products]) for (const el of Object.keys(atoms(f))) if (!out.includes(el)) out.push(el)
  return out
}

/** Atom counts per element on each side for given coefficients. */
export function tally(e: Equation, coefs: number[]): Record<string, [number, number]> {
  const t: Record<string, [number, number]> = {}
  for (const el of elementsOf(e)) t[el] = [0, 0]
  const add = (formulas: string[], offset: number, side: 0 | 1) =>
    formulas.forEach((f, i) => {
      for (const [el, n] of Object.entries(atoms(f))) t[el][side] += n * coefs[offset + i]
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

/** 1 easy, 2 medium, 3 hard – from the size of the coefficients and the number of species. */
export function difficulty(e: Equation): 1 | 2 | 3 {
  const sum = e.coefs.reduce((s, c) => s + c, 0)
  if (sum <= 6 && e.coefs.length <= 4) return 1
  if (sum <= 13) return 2
  return 3
}

/** Pool for a level number; free play (undefined) or an unsupported level mixes all levels. */
export function poolFor(level?: number): Equation[] {
  return level !== undefined && LEVELS[level] ? LEVELS[level] : ALL_EQUATIONS
}

/**
 * `n` equations for a round, ordered from easy to hard.
 * Tries 2 easy, 2 medium and 2 hard; missing slots are filled from the rest.
 */
export function pickEquations(level?: number, rnd: () => number = Math.random, n = ROUND): Equation[] {
  const pool = shuffle(poolFor(level), rnd)
  const byDiff = (d: number) => pool.filter((e) => difficulty(e) === d)
  const want = [Math.floor(n / 3), Math.floor(n / 3), n - 2 * Math.floor(n / 3)]
  const picked: Equation[] = []
  ;[1, 2, 3].forEach((d, i) => picked.push(...byDiff(d).slice(0, want[i])))
  for (const e of pool) {
    if (picked.length >= n) break
    if (!picked.includes(e)) picked.push(e)
  }
  return picked.slice(0, n).sort((a, b) => difficulty(a) - difficulty(b) || a.coefs.length - b.coefs.length)
}
