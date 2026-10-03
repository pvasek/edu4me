/**
 * Křížení – genes and tasks per level (spec/courses/biologie/games.md).
 * Only the curated facts live here (alleles, which allele dominates, phenotype names,
 * population numbers). Gametes, offspring, ratios and probabilities are computed in logic.ts.
 *
 * Notation: alleles are one letter with an optional superscript in braces, as in the
 * lessons: A, a, I^{A}, i, X^{D}, Y. Every individual has two alleles per gene
 * (a man has X and Y). `phen` lists every genotype in canonical order (allele order).
 */

export interface Gene {
  /** Alleles in canonical order: the order genotypes are written in (dominant first). */
  alleles: string[]
  /** Phenotype of every genotype, keys in canonical order. */
  phen: Record<string, string>
}

export const GENES = {
  /** Mendel's pea: yellow seeds dominate over green. */
  'hrach-barva': { alleles: ['A', 'a'], phen: { AA: 'žlutá', Aa: 'žlutá', aa: 'zelená' } },
  /** Mendel's pea: round seeds dominate over wrinkled. */
  'hrach-tvar': { alleles: ['B', 'b'], phen: { BB: 'kulatá', Bb: 'kulatá', bb: 'svraštělá' } },
  /** Mendel's pea: purple flowers dominate over white. */
  'hrach-kvet': { alleles: ['A', 'a'], phen: { AA: 'fialový', Aa: 'fialový', aa: 'bílý' } },
  /** Mendel's pea: tall plants dominate over dwarf. */
  'hrach-vyska': { alleles: ['A', 'a'], phen: { AA: 'vysoká', Aa: 'vysoká', aa: 'zakrslá' } },
  /** Four-o'clock (Mirabilis jalapa), Correns: incomplete dominance, heterozygote pink. */
  nocenka: { alleles: ['A', 'a'], phen: { AA: 'červené', Aa: 'růžové', aa: 'bílé' } },
  /** Guinea pig: black coat dominates over white (albino). */
  morce: { alleles: ['A', 'a'], phen: { AA: 'černá', Aa: 'černá', aa: 'bílá' } },
  /** Cystic fibrosis: autosomal recessive; carriers are healthy. */
  cf: { alleles: ['A', 'a'], phen: { AA: 'zdravé dítě', Aa: 'zdravé dítě', aa: 'dítě s cystickou fibrózou' } },
  /** Huntington's disease: autosomal dominant. */
  huntington: { alleles: ['H', 'h'], phen: { HH: 'nemocné dítě', Hh: 'nemocné dítě', hh: 'zdravé dítě' } },
  /** ABO blood groups: I^A and I^B codominant, both dominant over i. */
  abo: {
    alleles: ['I^{A}', 'I^{B}', 'i'],
    phen: {
      'I^{A}I^{A}': 'krevní skupina A',
      'I^{A}I^{B}': 'krevní skupina AB',
      'I^{A}i': 'krevní skupina A',
      'I^{B}I^{B}': 'krevní skupina B',
      'I^{B}i': 'krevní skupina B',
      ii: 'krevní skupina 0',
    },
  },
  /** Rh factor: D (Rh+) dominates over d (Rh−). */
  rh: { alleles: ['D', 'd'], phen: { DD: 'Rh+', Dd: 'Rh+', dd: 'Rh−' } },
  /** Sex chromosomes. */
  pohlavi: { alleles: ['X', 'Y'], phen: { XX: 'dívka', XY: 'chlapec' } },
  /** Red–green colour blindness: X-linked recessive. */
  barvoslepost: {
    alleles: ['X^{D}', 'X^{d}', 'Y'],
    phen: {
      'X^{D}X^{D}': 'zdravá dcera',
      'X^{D}X^{d}': 'zdravá dcera',
      'X^{D}Y': 'zdravý syn',
      'X^{d}X^{d}': 'barvoslepá dcera',
      'X^{d}Y': 'barvoslepý syn',
    },
  },
  /** Haemophilia A: X-linked recessive. */
  hemofilie: {
    alleles: ['X^{H}', 'X^{h}', 'Y'],
    phen: {
      'X^{H}X^{H}': 'zdravá dcera',
      'X^{H}X^{h}': 'zdravá dcera',
      'X^{H}Y': 'zdravý syn',
      'X^{h}X^{h}': 'dcera s hemofilií',
      'X^{h}Y': 'syn s hemofilií',
    },
  },
  /** Fruit fly eye colour (Morgan, 1910): red X^W dominates over white X^w. */
  'octomilka-oci': {
    alleles: ['X^{W}', 'X^{w}', 'Y'],
    phen: {
      'X^{W}X^{W}': 'samička s červenýma očima',
      'X^{W}X^{w}': 'samička s červenýma očima',
      'X^{W}Y': 'sameček s červenýma očima',
      'X^{w}X^{w}': 'samička s bílýma očima',
      'X^{w}Y': 'sameček s bílýma očima',
    },
  },
} satisfies Record<string, Gene>

export type GeneId = keyof typeof GENES

/** What the learner is asked about a cross once the square is filled. */
export type Ask =
  /** Phenotype ratio, dominant phenotype first. */
  | { kind: 'ratio' }
  /** Probability that an offspring has this phenotype (must be one of the genes' phenotypes). */
  | { kind: 'prob'; phen: string; text?: string }
  /** Probability of one genotype (canonical, e.g. "Aa"). */
  | { kind: 'geno'; geno: string; text: string }
  /** Probability among sons or among daughters only. */
  | { kind: 'cond'; among: 'son' | 'daughter'; phen?: string; geno?: string; text: string }

export interface CrossItem {
  type: 'cross'
  id: string
  /** Round composition group (see QUOTA). */
  group: string
  genes: GeneId[]
  /** ♀ and ♂ genotype. */
  parents: [string, string]
  /** Appended to the phenotype ("žlutá" + "semena"). */
  noun?: string
  /** One or two sentences: organism, which allele dominates (Md). */
  intro: string
  asks: Ask[]
}

export interface GametesItem {
  type: 'gametes'
  id: string
  group: string
  genes: GeneId[]
  genotype: string
  intro: string
}

export interface LinkageItem {
  type: 'linkage'
  id: string
  group: string
  intro: string
  /** Distance of the genes in cM = % of recombinant gametes. */
  r: number
  /** cis: dihybrid got AB from one parent and ab from the other; trans: Ab and aB. */
  phase: 'cis' | 'trans'
  /** Offspring class asked about in a test cross with aabb: one gamete class or all recombinants. */
  target: 'AB' | 'Ab' | 'aB' | 'ab' | 'recomb'
  /** The question, naming the class in words (Md). */
  text: string
}

/** A gene pool drawn as a Punnett square: rows and columns are alleles with their frequencies. */
export interface PoolItem {
  type: 'pool'
  id: string
  group: string
  intro: string
  /** Frequency of the dominant allele A. */
  p: number
  ask: 'het' | 'rec' | 'dom'
}

/** Hardy–Weinberg calculation with a typed answer. */
export interface HwItem {
  type: 'hw'
  id: string
  group: string
  intro: string
  /** What is known: 1 in N shows the recessive trait, % recessive, genotype counts or q itself. */
  given: { oneIn: number } | { recPct: number } | { counts: [number, number, number] } | { q: number }
  ask: 'p' | 'q' | 'carriers' | 'dom'
}

/** Is a population in Hardy–Weinberg equilibrium? (chi-square, df = 1) */
export interface HwEqItem {
  type: 'hweq'
  id: string
  group: string
  intro: string
  counts: [number, number, number]
}

/** Selection against the recessive homozygote aa (fitness w; AA and Aa have fitness 1). */
export interface SelItem {
  type: 'sel'
  id: string
  group: string
  intro: string
  q0: number
  /** Relative fitness of aa (0 = none of them reproduces). */
  w: number
  /** q after one generation, or the number of generations until q falls to `target` (w = 0 only). */
  ask: 'q1' | { target: number }
}

export type Item = CrossItem | GametesItem | LinkageItem | PoolItem | HwItem | HwEqItem | SelItem

const HRACH = 'U hrachu (Mendel)'

/** Level 7 (b7-2, b7-3): one gene, dominance, incomplete dominance, blood groups, sex, colour blindness. */
const L7: Item[] = [
  {
    type: 'cross', id: 'hrach-Aa-Aa', group: 'mono', genes: ['hrach-barva'], parents: ['Aa', 'Aa'], noun: 'semena',
    intro: `${HRACH} je žlutá barva semen (A) dominantní nad zelenou (a). Kříží se dva heterozygoti.`,
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'zelená semena', text: 'Jaká je pravděpodobnost, že semeno bude zelené?' }],
  },
  {
    type: 'cross', id: 'hrach-AA-aa', group: 'mono', genes: ['hrach-barva'], parents: ['AA', 'aa'], noun: 'semena',
    intro: `${HRACH} je žlutá barva semen (A) dominantní nad zelenou (a). Kříží se dva homozygoti, žlutý a zelený.`,
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'zelená semena', text: 'Jaká je pravděpodobnost, že semeno v F₁ bude zelené?' }],
  },
  {
    type: 'cross', id: 'hrach-Aa-aa', group: 'mono', genes: ['hrach-barva'], parents: ['Aa', 'aa'], noun: 'semena',
    intro: `${HRACH} je žlutá barva semen (A) dominantní nad zelenou (a). Heterozygot se kříží s recesivním homozygotem (zpětné křížení).`,
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'žlutá semena', text: 'Jaká je pravděpodobnost, že semeno bude žluté?' }],
  },
  {
    type: 'cross', id: 'kvet-Aa-Aa', group: 'mono', genes: ['hrach-kvet'], parents: ['Aa', 'Aa'], noun: 'květ',
    intro: `${HRACH} je fialový květ (A) dominantní nad bílým (a).`,
    asks: [
      { kind: 'prob', phen: 'bílý květ', text: 'Jaká je pravděpodobnost, že rostlina bude mít bílý květ?' },
      { kind: 'geno', geno: 'Aa', text: 'Jaká část potomků bude heterozygotní (Aa)?' },
      { kind: 'geno', geno: 'AA', text: 'Jaká část potomků bude dominantní homozygot (AA)?' },
    ],
  },
  {
    type: 'cross', id: 'vyska-AA-Aa', group: 'mono', genes: ['hrach-vyska'], parents: ['AA', 'Aa'], noun: 'rostlina',
    intro: `${HRACH} je vysoký vzrůst (A) dominantní nad zakrslým (a).`,
    asks: [
      { kind: 'prob', phen: 'zakrslá rostlina', text: 'Jaká je pravděpodobnost, že potomek bude zakrslý?' },
      { kind: 'geno', geno: 'Aa', text: 'Jaká část potomků bude heterozygotní (Aa)?' },
    ],
  },
  {
    type: 'cross', id: 'nocenka-Aa-Aa', group: 'mono', genes: ['nocenka'], parents: ['Aa', 'Aa'], noun: 'květy',
    intro: 'U nocenky (Mirabilis jalapa) je dominance neúplná: AA kvete červeně, aa bíle a heterozygot Aa růžově.',
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'růžové květy', text: 'Jaká je pravděpodobnost, že potomek pokvete růžově?' }],
  },
  {
    type: 'cross', id: 'nocenka-AA-aa', group: 'mono', genes: ['nocenka'], parents: ['AA', 'aa'], noun: 'květy',
    intro: 'U nocenky (Mirabilis jalapa) je dominance neúplná: AA kvete červeně, aa bíle a heterozygot Aa růžově. Kříží se červená a bílá rostlina.',
    asks: [{ kind: 'prob', phen: 'červené květy', text: 'Jaká je pravděpodobnost, že potomek pokvete červeně?' }, { kind: 'ratio' }],
  },
  {
    type: 'cross', id: 'morce-Aa-aa', group: 'mono', genes: ['morce'], parents: ['Aa', 'aa'], noun: 'srst',
    intro: 'U morčete je černá srst (A) dominantní nad bílou (a). Černá samička je heterozygot, sameček je bílý.',
    asks: [{ kind: 'prob', phen: 'bílá srst', text: 'Jaká je pravděpodobnost, že mládě bude bílé?' }, { kind: 'ratio' }],
  },
  {
    type: 'cross', id: 'cf-Aa-Aa', group: 'mono', genes: ['cf'], parents: ['Aa', 'Aa'],
    intro: 'Cystická fibróza je recesivní choroba (a). Oba rodiče jsou zdraví přenašeči (Aa).',
    asks: [
      { kind: 'prob', phen: 'dítě s cystickou fibrózou', text: 'Jaká je pravděpodobnost, že dítě bude nemocné?' },
      { kind: 'geno', geno: 'Aa', text: 'Jaká je pravděpodobnost, že dítě bude zdravý přenašeč (Aa)?' },
    ],
  },
  {
    type: 'cross', id: 'abo-Ai-Bi', group: 'abo', genes: ['abo'], parents: ['I^{A}i', 'I^{B}i'],
    intro: 'Alely I^{A} a I^{B} jsou kodominantní, obě dominují nad i. Matka má skupinu A (I^{A}i), otec B (I^{B}i).',
    asks: [
      { kind: 'prob', phen: 'krevní skupina 0', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu 0?' },
      { kind: 'prob', phen: 'krevní skupina AB', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu AB?' },
    ],
  },
  {
    type: 'cross', id: 'abo-AB-ii', group: 'abo', genes: ['abo'], parents: ['I^{A}I^{B}', 'ii'],
    intro: 'Alely I^{A} a I^{B} jsou kodominantní, obě dominují nad i. Matka má skupinu AB, otec 0.',
    asks: [
      { kind: 'prob', phen: 'krevní skupina AB', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu AB?' },
      { kind: 'prob', phen: 'krevní skupina A', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu A?' },
      { kind: 'prob', phen: 'krevní skupina 0', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu 0?' },
    ],
  },
  {
    type: 'cross', id: 'abo-AA-Bi', group: 'abo', genes: ['abo'], parents: ['I^{A}I^{A}', 'I^{B}i'],
    intro: 'Alely I^{A} a I^{B} jsou kodominantní, obě dominují nad i. Matka je I^{A}I^{A}, otec I^{B}i.',
    asks: [
      { kind: 'prob', phen: 'krevní skupina AB', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu AB?' },
      { kind: 'prob', phen: 'krevní skupina B', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu B?' },
    ],
  },
  {
    type: 'cross', id: 'abo-AB-Ai', group: 'abo', genes: ['abo'], parents: ['I^{A}I^{B}', 'I^{A}i'],
    intro: 'Alely I^{A} a I^{B} jsou kodominantní, obě dominují nad i. Matka má skupinu AB, otec A (I^{A}i).',
    asks: [
      { kind: 'prob', phen: 'krevní skupina A', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu A?' },
      { kind: 'prob', phen: 'krevní skupina 0', text: 'Jaká je pravděpodobnost, že dítě bude mít krevní skupinu 0?' },
    ],
  },
  {
    type: 'cross', id: 'pohlavi', group: 'sex', genes: ['pohlavi'], parents: ['XX', 'XY'],
    intro: 'Žena má pohlavní chromozomy XX, muž XY. Pohlaví dítěte určí, který chromozom nese spermie.',
    asks: [{ kind: 'prob', phen: 'chlapec', text: 'Jaká je pravděpodobnost, že se narodí chlapec?' }],
  },
  {
    type: 'cross', id: 'barvo-Dd-DY', group: 'sex', genes: ['barvoslepost'], parents: ['X^{D}X^{d}', 'X^{D}Y'],
    intro: 'Barvoslepost je recesivní a gen leží na chromozomu X. Matka je zdravá přenašečka, otec je zdravý.',
    asks: [
      { kind: 'cond', among: 'son', phen: 'barvoslepý syn', text: 'Jaká je pravděpodobnost, že **syn** bude barvoslepý?' },
      { kind: 'prob', phen: 'barvoslepá dcera', text: 'Jaká je pravděpodobnost, že se narodí barvoslepá dcera?' },
    ],
  },
  {
    type: 'gametes', id: 'g-Aa', group: 'gametes', genes: ['hrach-barva'], genotype: 'Aa',
    intro: 'Heterozygotní hrách Aa (žlutá semena).',
  },
  {
    type: 'gametes', id: 'g-AA', group: 'gametes', genes: ['hrach-barva'], genotype: 'AA',
    intro: 'Homozygotní hrách AA (žlutá semena).',
  },
  {
    type: 'gametes', id: 'g-Ai', group: 'gametes', genes: ['abo'], genotype: 'I^{A}i',
    intro: 'Člověk s krevní skupinou A a genotypem I^{A}i.',
  },
  {
    type: 'gametes', id: 'g-AB', group: 'gametes', genes: ['abo'], genotype: 'I^{A}I^{B}',
    intro: 'Člověk s krevní skupinou AB.',
  },
  {
    type: 'gametes', id: 'g-XY', group: 'gametes', genes: ['pohlavi'], genotype: 'XY',
    intro: 'Muž s pohlavními chromozomy XY.',
  },
]

const DROS = 'U octomilky leží geny pro barvu těla (A šedé, a černé) a tvar křídel (B normální, b zakrnělá) na stejném chromozomu, asi 17 cM od sebe (Morganovy pokusy).'

/** Level 10 (b10-5): two genes, linkage, X-linked traits. */
const L10: Item[] = [
  {
    type: 'cross', id: 'di-AaBb-AaBb', group: 'di', genes: ['hrach-barva', 'hrach-tvar'], parents: ['AaBb', 'AaBb'], noun: 'semena',
    intro: `${HRACH}: žlutá (A) dominuje nad zelenou (a), kulatá (B) nad svraštělou (b). Geny leží na různých chromozomech.`,
    asks: [
      { kind: 'ratio' },
      { kind: 'prob', phen: 'zelená, svraštělá semena', text: 'Jaká je pravděpodobnost zeleného svraštělého semene?' },
      { kind: 'prob', phen: 'žlutá, svraštělá semena', text: 'Jaká je pravděpodobnost žlutého svraštělého semene?' },
      { kind: 'geno', geno: 'AaBb', text: 'Jaká část potomků bude dihybrid AaBb?' },
    ],
  },
  {
    type: 'cross', id: 'di-AaBb-aabb', group: 'di', genes: ['hrach-barva', 'hrach-tvar'], parents: ['AaBb', 'aabb'], noun: 'semena',
    intro: `${HRACH}: žlutá (A) dominuje nad zelenou (a), kulatá (B) nad svraštělou (b). Testovací křížení dihybrida s recesivním homozygotem.`,
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'žlutá, kulatá semena', text: 'Jaká je pravděpodobnost žlutého kulatého semene?' }],
  },
  {
    type: 'cross', id: 'di-AaBb-Aabb', group: 'di', genes: ['hrach-barva', 'hrach-tvar'], parents: ['AaBb', 'Aabb'], noun: 'semena',
    intro: `${HRACH}: žlutá (A) dominuje nad zelenou (a), kulatá (B) nad svraštělou (b).`,
    asks: [{ kind: 'ratio' }, { kind: 'prob', phen: 'zelená, svraštělá semena', text: 'Jaká je pravděpodobnost zeleného svraštělého semene?' }],
  },
  {
    type: 'cross', id: 'di-AABb-aaBb', group: 'di', genes: ['hrach-barva', 'hrach-tvar'], parents: ['AABb', 'aaBb'], noun: 'semena',
    intro: `${HRACH}: žlutá (A) dominuje nad zelenou (a), kulatá (B) nad svraštělou (b).`,
    asks: [
      { kind: 'prob', phen: 'žlutá, svraštělá semena', text: 'Jaká je pravděpodobnost žlutého svraštělého semene?' },
      { kind: 'prob', phen: 'zelená, kulatá semena', text: 'Jaká je pravděpodobnost zeleného kulatého semene?' },
    ],
  },
  {
    type: 'cross', id: 'di-abo-rh-1', group: 'di', genes: ['abo', 'rh'], parents: ['I^{A}iDd', 'I^{B}idd'],
    intro: 'Krevní skupiny AB0 a Rh faktor (D = Rh+, dominantní; d = Rh−) se dědí nezávisle. Matka je I^{A}i Dd, otec I^{B}i dd.',
    asks: [
      { kind: 'prob', phen: 'krevní skupina 0, Rh−', text: 'Jaká je pravděpodobnost, že dítě bude mít skupinu 0 Rh−?' },
      { kind: 'prob', phen: 'krevní skupina AB, Rh+', text: 'Jaká je pravděpodobnost, že dítě bude mít skupinu AB Rh+?' },
    ],
  },
  {
    type: 'cross', id: 'di-abo-rh-2', group: 'di', genes: ['abo', 'rh'], parents: ['I^{A}I^{B}Dd', 'iiDd'],
    intro: 'Krevní skupiny AB0 a Rh faktor (D = Rh+, dominantní; d = Rh−) se dědí nezávisle. Matka je I^{A}I^{B} Dd, otec ii Dd.',
    asks: [
      { kind: 'prob', phen: 'krevní skupina A, Rh+', text: 'Jaká je pravděpodobnost, že dítě bude mít skupinu A Rh+?' },
      { kind: 'prob', phen: 'krevní skupina 0, Rh+', text: 'Jaká je pravděpodobnost, že dítě bude mít skupinu 0 Rh+?' },
    ],
  },
  {
    type: 'cross', id: 'x-barvo-Dd-dY', group: 'x', genes: ['barvoslepost'], parents: ['X^{D}X^{d}', 'X^{d}Y'],
    intro: 'Barvoslepost je recesivní znak vázaný na X. Matka je přenašečka, otec je barvoslepý.',
    asks: [
      { kind: 'cond', among: 'daughter', phen: 'barvoslepá dcera', text: 'Jaká je pravděpodobnost, že **dcera** bude barvoslepá?' },
      { kind: 'prob', phen: 'barvoslepá dcera', text: 'Jaká je pravděpodobnost, že se narodí barvoslepá dcera?' },
    ],
  },
  {
    type: 'cross', id: 'x-barvo-DD-dY', group: 'x', genes: ['barvoslepost'], parents: ['X^{D}X^{D}', 'X^{d}Y'],
    intro: 'Barvoslepost je recesivní znak vázaný na X. Matka je zdravá (ne přenašečka), otec je barvoslepý.',
    asks: [
      { kind: 'cond', among: 'daughter', geno: 'X^{D}X^{d}', text: 'Jaká je pravděpodobnost, že **dcera** bude přenašečka?' },
      { kind: 'cond', among: 'son', phen: 'barvoslepý syn', text: 'Jaká je pravděpodobnost, že **syn** bude barvoslepý?' },
    ],
  },
  {
    type: 'cross', id: 'x-hemo-Hh-HY', group: 'x', genes: ['hemofilie'], parents: ['X^{H}X^{h}', 'X^{H}Y'],
    intro: 'Hemofilie A je recesivní choroba vázaná na X. Matka je přenašečka, otec je zdravý.',
    asks: [
      { kind: 'cond', among: 'son', phen: 'syn s hemofilií', text: 'Jaká je pravděpodobnost, že **syn** bude mít hemofilii?' },
      { kind: 'geno', geno: 'X^{H}X^{h}', text: 'Jaká je pravděpodobnost, že se narodí dcera přenašečka?' },
    ],
  },
  {
    type: 'cross', id: 'x-dros-ww-WY', group: 'x', genes: ['octomilka-oci'], parents: ['X^{w}X^{w}', 'X^{W}Y'],
    intro: 'Morganova octomilka: červené oči (X^{W}) dominují nad bílými (X^{w}). Samička má bílé oči, sameček červené.',
    asks: [
      { kind: 'cond', among: 'son', phen: 'sameček s bílýma očima', text: 'Jaká je pravděpodobnost, že **sameček** z F₁ bude mít bílé oči?' },
      { kind: 'cond', among: 'daughter', phen: 'samička s bílýma očima', text: 'Jaká je pravděpodobnost, že **samička** z F₁ bude mít bílé oči?' },
    ],
  },
  {
    type: 'cross', id: 'huntington', group: 'x', genes: ['huntington'], parents: ['hh', 'Hh'],
    intro: 'Huntingtonova choroba je autozomálně dominantní (H). Matka je zdravá, otec je heterozygot.',
    asks: [{ kind: 'prob', phen: 'nemocné dítě', text: 'Jaká je pravděpodobnost, že dítě onemocní?' }],
  },
  {
    type: 'gametes', id: 'g-AaBb', group: 'gametes', genes: ['hrach-barva', 'hrach-tvar'], genotype: 'AaBb',
    intro: 'Dihybrid AaBb; geny leží na různých chromozomech.',
  },
  {
    type: 'gametes', id: 'g-AaBB', group: 'gametes', genes: ['hrach-barva', 'hrach-tvar'], genotype: 'AaBB',
    intro: 'Rostlina AaBB; geny leží na různých chromozomech.',
  },
  {
    type: 'gametes', id: 'g-Aibb', group: 'gametes', genes: ['abo', 'rh'], genotype: 'I^{A}iDd',
    intro: 'Člověk I^{A}i Dd (krevní skupina A, Rh+).',
  },
  {
    type: 'gametes', id: 'g-Hh', group: 'gametes', genes: ['hemofilie'], genotype: 'X^{H}X^{h}',
    intro: 'Žena přenašečka hemofilie.',
  },
  {
    type: 'linkage', id: 'link-dros-recomb', group: 'linkage', intro: `${DROS} Samička AB/ab se kříží se samečkem ab/ab.`,
    r: 17, phase: 'cis', target: 'recomb', text: 'Kolik procent potomků bude rekombinantních (šedé tělo se zakrnělými křídly nebo černé s normálními)?',
  },
  {
    type: 'linkage', id: 'link-dros-Ab', group: 'linkage', intro: `${DROS} Samička AB/ab se kříží se samečkem ab/ab.`,
    r: 17, phase: 'cis', target: 'Ab', text: 'Kolik procent potomků bude mít šedé tělo a zakrnělá křídla (Aabb)?',
  },
  {
    type: 'linkage', id: 'link-dros-ab', group: 'linkage', intro: `${DROS} Samička AB/ab se kříží se samečkem ab/ab.`,
    r: 17, phase: 'cis', target: 'ab', text: 'Kolik procent potomků bude mít černé tělo a zakrnělá křídla (aabb)?',
  },
  {
    type: 'linkage', id: 'link-20-trans', group: 'linkage',
    intro: 'Geny A a B leží na jednom chromozomu 20 cM od sebe. Dihybrid zdědil Ab od matky a aB od otce (Ab/aB) a kříží se s aabb.',
    r: 20, phase: 'trans', target: 'AB', text: 'Kolik procent potomků bude mít oba dominantní znaky (AaBb)?',
  },
  {
    type: 'linkage', id: 'link-10-cis', group: 'linkage',
    intro: 'Geny A a B leží na jednom chromozomu 10 cM od sebe. Dihybrid AB/ab se kříží s aabb.',
    r: 10, phase: 'cis', target: 'AB', text: 'Kolik procent potomků bude mít oba dominantní znaky (AaBb)?',
  },
]

/** Level 12 (b10-6, b12): allele frequencies, Hardy–Weinberg and selection. */
const L12: Item[] = [
  { type: 'pool', id: 'pool-07-het', group: 'pool', p: 0.7, ask: 'het', intro: 'V genofondu populace má alela A četnost p = 0,7 a alela a četnost q = 0,3. Páření je náhodné.' },
  { type: 'pool', id: 'pool-06-rec', group: 'pool', p: 0.6, ask: 'rec', intro: 'V genofondu populace má alela A četnost p = 0,6 a alela a četnost q = 0,4. Páření je náhodné.' },
  { type: 'pool', id: 'pool-08-dom', group: 'pool', p: 0.8, ask: 'dom', intro: 'V genofondu populace má dominantní alela A četnost p = 0,8, recesivní a četnost q = 0,2. Páření je náhodné.' },
  { type: 'pool', id: 'pool-05-het', group: 'pool', p: 0.5, ask: 'het', intro: 'V genofondu populace mají obě alely stejnou četnost: p = q = 0,5. Páření je náhodné.' },
  { type: 'pool', id: 'pool-09-rec', group: 'pool', p: 0.9, ask: 'rec', intro: 'V genofondu populace má alela A četnost p = 0,9 a alela a četnost q = 0,1. Páření je náhodné.' },
  {
    type: 'hw', id: 'hw-2500', group: 'hw', ask: 'carriers', given: { oneIn: 2500 },
    intro: 'Recesivní dědičnou chorobu (aa) má v populaci v Hardyho–Weinbergově rovnováze 1 člověk z 2 500. Kolik procent lidí jsou zdraví přenašeči (Aa)?',
  },
  {
    type: 'hw', id: 'hw-10000', group: 'hw', ask: 'carriers', given: { oneIn: 10000 },
    intro: 'Recesivní dědičnou chorobu (aa) má v populaci v Hardyho–Weinbergově rovnováze 1 člověk z 10 000. Kolik procent lidí jsou zdraví přenašeči (Aa)?',
  },
  {
    type: 'hw', id: 'hw-rec16-p', group: 'hw', ask: 'p', given: { recPct: 16 },
    intro: 'V populaci ovcí v rovnováze má 16 % zvířat recesivní znak (aa). Jaká je četnost dominantní alely p?',
  },
  {
    type: 'hw', id: 'hw-rec9-q', group: 'hw', ask: 'q', given: { recPct: 9 },
    intro: 'V populaci v rovnováze má 9 % jedinců recesivní znak (aa). Jaká je četnost recesivní alely q?',
  },
  {
    type: 'hw', id: 'hw-counts-p', group: 'hw', ask: 'p', given: { counts: [360, 480, 160] },
    intro: 'V populaci 1 000 rostlin je 360 AA, 480 Aa a 160 aa. Jaká je četnost alely A (p)?',
  },
  {
    type: 'hw', id: 'hw-counts-q', group: 'hw', ask: 'q', given: { counts: [90, 420, 490] },
    intro: 'V populaci 1 000 brouků je 90 AA, 420 Aa a 490 aa. Jaká je četnost alely a (q)?',
  },
  {
    type: 'hw', id: 'hw-q03-dom', group: 'hw', ask: 'dom', given: { q: 0.3 },
    intro: 'Recesivní alela a má v populaci v rovnováze četnost q = 0,3. Kolik procent jedinců má dominantní fenotyp?',
  },
  {
    type: 'hweq', id: 'eq-yes', group: 'hweq', counts: [490, 420, 90],
    intro: 'Populace 1 000 jedinců: 490 AA, 420 Aa, 90 aa. Je v Hardyho–Weinbergově rovnováze?',
  },
  {
    type: 'hweq', id: 'eq-no-het', group: 'hweq', counts: [450, 100, 450],
    intro: 'Populace 1 000 jedinců: 450 AA, 100 Aa, 450 aa. Je v Hardyho–Weinbergově rovnováze?',
  },
  {
    type: 'hweq', id: 'eq-yes-2', group: 'hweq', counts: [160, 480, 360],
    intro: 'Populace 1 000 jedinců: 160 AA, 480 Aa, 360 aa. Je v Hardyho–Weinbergově rovnováze?',
  },
  {
    type: 'hweq', id: 'eq-no-many-het', group: 'hweq', counts: [200, 700, 100],
    intro: 'Populace 1 000 jedinců: 200 AA, 700 Aa, 100 aa. Je v Hardyho–Weinbergově rovnováze?',
  },
  {
    type: 'sel', id: 'sel-05', group: 'sel', q0: 0.5, w: 0, ask: 'q1',
    intro: 'Jedinci aa se nedožijí rozmnožování (w = 0), AA a Aa ano. Teď je q = 0,5. Jaká bude četnost q v příští generaci?',
  },
  {
    type: 'sel', id: 'sel-02', group: 'sel', q0: 0.2, w: 0, ask: 'q1',
    intro: 'Jedinci aa se nedožijí rozmnožování (w = 0), AA a Aa ano. Teď je q = 0,2. Jaká bude četnost q v příští generaci?',
  },
  {
    type: 'sel', id: 'sel-04-half', group: 'sel', q0: 0.4, w: 0.5, ask: 'q1',
    intro: 'Jedinci aa mají jen poloviční zdatnost (w = 0,5), AA a Aa plnou. Teď je q = 0,4. Jaká bude četnost q v příští generaci?',
  },
  {
    type: 'sel', id: 'sel-gen-05-01', group: 'sel', q0: 0.5, w: 0, ask: { target: 0.1 },
    intro: 'Jedinci aa se nerozmnožují (w = 0). Platí q_{n} = q_{0} : (1 + n · q_{0}). Za kolik generací klesne q z 0,5 na 0,1?',
  },
  {
    type: 'sel', id: 'sel-gen-02-005', group: 'sel', q0: 0.2, w: 0, ask: { target: 0.05 },
    intro: 'Jedinci aa se nerozmnožují (w = 0). Platí q_{n} = q_{0} : (1 + n · q_{0}). Za kolik generací klesne q z 0,2 na 0,05?',
  },
]

export const LEVELS: Record<number, Item[]> = { 7: L7, 10: L10, 12: L12 }

/** How many items of each group a round of a level takes (sums to the round length). */
export const QUOTA: Record<number, Record<string, number>> = {
  7: { mono: 3, abo: 2, sex: 1, gametes: 2 },
  10: { di: 3, x: 2, gametes: 1, linkage: 2 },
  12: { pool: 2, hw: 3, hweq: 1, sel: 2 },
}
