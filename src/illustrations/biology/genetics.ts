/**
 * Pure genetics behind the `punnett` block: alleles → gametes → offspring →
 * genotype and phenotype ratios. Genotypes use the lesson markup:
 * 'Aa', 'AaBb', 'X^{A}X^{a}', 'X^{A}Y', 'I^{A}i'.
 *
 * - Alleles come in pairs; the n-th pair of each parent is the n-th gene.
 * - A pair is a sex chromosome pair when it holds an X with an allele
 *   (X^{A}) or an X together with a Y; then X sorts before Y and dominance is
 *   read from the superscript (X^{A} over X^{a}). Males show their single X.
 * - Otherwise an allele with a capital letter is dominant over a small one
 *   (A over a, I^{A} over i); two different capital alleles are codominant
 *   (I^{A}I^{B} → AB), so they form their own phenotype.
 */

export type Allele = string

export interface PartGroup {
  /** markup: a genotype ('Aa') or a phenotype name ('fialový květ') */
  label: string
  count: number
  /** 0–1 */
  share: number
}

export interface Offspring {
  genotype: string
  /** index into Cross.phenotypes */
  phenotype: number
}

export interface Cross {
  parents: [string, string]
  /** per gene: is it on the sex chromosomes? */
  sex: boolean[]
  /** gametes of parent 1 (rows) and parent 2 (columns), each a list of alleles */
  gametes: [Allele[][], Allele[][]]
  /** cells[row][col] */
  cells: Offspring[][]
  genotypes: PartGroup[]
  phenotypes: PartGroup[]
  /** reduced ratios, e.g. [1, 2, 1] and [3, 1] */
  genotypeRatio: number[]
  phenotypeRatio: number[]
}

// ------------------------------------------------------------------ alleles

/** Alleles of a genotype (same rule as the validator), normalised to X^{A} form. */
export function allelesOf(genotype: string): Allele[] {
  const raw = genotype.replace(/\s+/g, '').match(/[A-Za-z](?:\^\{[^}]+\}|\^[A-Za-z0-9+-])?/g) ?? []
  return raw.map((a) => {
    const { base, sup } = parts(a)
    return sup ? `${base}^{${sup}}` : base
  })
}

function parts(a: Allele): { base: string; sup: string } {
  const m = /^([A-Za-z])(?:\^\{([^}]+)\}|\^([A-Za-z0-9+-]))?$/.exec(a)
  return { base: m?.[1] ?? a, sup: m?.[2] ?? m?.[3] ?? '' }
}

const upper = (c: string) => !!c && c !== c.toLowerCase() && c === c.toUpperCase()

/** Allele pairs (genes) of a genotype. */
export function genesOf(genotype: string): Allele[][] {
  const al = allelesOf(genotype)
  const out: Allele[][] = []
  for (let i = 0; i + 1 < al.length; i += 2) out.push([al[i], al[i + 1]])
  return out
}

function isSexPair(pair: Allele[]): boolean {
  const ps = pair.map(parts)
  if (!ps.every((p) => p.base === 'X' || p.base === 'Y')) return false
  return ps.some((p) => p.base === 'X' && p.sup) || (ps.some((p) => p.base === 'X') && ps.some((p) => p.base === 'Y'))
}

/** Is the allele dominant (capital)? On sex chromosomes the superscript decides. */
function dominant(a: Allele, sex: boolean): boolean {
  const { base, sup } = parts(a)
  if (sex) return base === 'X' && (!sup || upper(sup[0]))
  return upper(base)
}

/** Sort key of an allele: dominant first (and X before Y), then by superscript. */
function alleleKey(a: Allele, sex: boolean): string {
  const { base, sup } = parts(a)
  if (sex) return `${base === 'X' ? 0 : 1}${sup && !upper(sup[0]) ? 1 : 0}${sup}`
  return `${upper(base) ? 0 : 1}${sup && !upper(sup[0]) ? 1 : 0}${sup}${base}`
}

const sortPair = (pair: Allele[], sex: boolean) => [...pair].sort((x, y) => (alleleKey(x, sex) < alleleKey(y, sex) ? -1 : alleleKey(x, sex) > alleleKey(y, sex) ? 1 : 0))

// ------------------------------------------------------------------ gametes

/** Gametes of a genotype: every combination of one allele per gene (independent assortment). */
export function gametesOf(genotype: string): Allele[][] {
  return genesOf(genotype).reduce<Allele[][]>((acc, pair) => acc.flatMap((g) => pair.map((a) => [...g, a])), [[]])
}

// ------------------------------------------------------------------ phenotype

interface GenePheno {
  name: string
  /** the default shorthand (A_, aa) rather than a named trait */
  symbolic?: boolean
  /** ordering: smaller = listed first */
  rank: string
}

const ABO: Record<string, string> = { 'I^{A}': 'A', 'I^{B}': 'B', 'I^{A}I^{B}': 'AB', i: '0' }

function genePhenotype(
  pair: Allele[],
  sex: boolean,
  abo: boolean,
  hasRecessive: boolean,
  traits: Record<string, string>,
): GenePheno {
  const geno = pair.join('')
  const look = (...keys: string[]) => keys.map((k) => traits[k]).find((t) => t !== undefined)

  if (sex) {
    const male = pair.some((a) => parts(a).base === 'Y')
    const xs = pair.filter((a) => parts(a).base === 'X')
    const sexWord = look(male ? 'XY' : 'XX') ?? (male ? 'chlapec' : 'dívka')
    const withAllele = xs.filter((a) => parts(a).sup)
    if (!withAllele.length) return { name: sexWord, rank: male ? '1' : '0' }
    // the allele shown: a male's only X, a female's dominant one
    const shown = male ? withAllele[0] : sortPair(withAllele, true)[0]
    const sup = parts(shown).sup
    const dom = upper(sup[0])
    const trait = look(geno, shown, sup) ?? (dom ? 'dominantní znak' : 'recesivní znak')
    return { name: `${sexWord}, ${trait}`, rank: `${male ? 1 : 0}${dom ? 0 : 1}${sup}` }
  }

  const [p, q] = pair
  // dominant over recessive → the dominant allele; equal → that allele; else codominance (I^{A}I^{B})
  const key = p === q || (dominant(p, false) && !dominant(q, false)) ? p : p + q
  // AA, Aa < aa; for codominance C^{R}C^{R} < C^{R}C^{W} < C^{W}C^{W}
  const rank = dominant(p, false) ? `0${alleleKey(p, false)}${key === p ? '0' : '1'}${alleleKey(q, false)}` : `2${alleleKey(p, false)}`
  if (abo) {
    const order = { 'I^{A}': '0', 'I^{B}': '1', 'I^{A}I^{B}': '2', i: '3' } as Record<string, string>
    const name = look(geno, key) ?? (ABO[key] ? `skupina ${ABO[key]}` : key)
    return { name, rank: order[key] ?? '9' }
  }
  // without traits: the usual shorthand A_ (dominant), aa (recessive), C^{R}C^{W} (codominant)
  const fallback = key !== p ? key : dominant(p, false) && hasRecessive ? `${p}_` : p + p
  const named = look(geno, key)
  return named !== undefined ? { name: named, rank } : { name: fallback, rank, symbolic: true }
}

// ------------------------------------------------------------------ cross

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
export const reduceRatio = (xs: number[]) => {
  const g = xs.reduce(gcd, 0) || 1
  return xs.map((x) => x / g)
}

/**
 * The full cross. Returns null when the genotypes cannot be crossed (odd number
 * of alleles, a different number of genes, more than two genes).
 */
export function crossOf(parents: [string, string], traits: Record<string, string> = {}): Cross | null {
  const g1 = genesOf(parents[0])
  const g2 = genesOf(parents[1])
  const n1 = allelesOf(parents[0]).length
  const n2 = allelesOf(parents[1]).length
  if (!g1.length || n1 % 2 || n2 % 2 || g1.length !== g2.length || g1.length > 2) return null
  const nGenes = g1.length
  const sex = g1.map((_, i) => isSexPair(g1[i]) || isSexPair(g2[i]))
  const geneAlleles = g1.map((_, i) => [...g1[i], ...g2[i]])
  const abo = geneAlleles.map(
    (al, i) => !sex[i] && al.every((a) => parts(a).base.toLowerCase() === 'i') && al.some((a) => parts(a).sup),
  )
  const hasRecessive = geneAlleles.map((al, i) => al.some((a) => !dominant(a, sex[i])))

  const gametes: [Allele[][], Allele[][]] = [gametesOf(parents[0]), gametesOf(parents[1])]
  const genoCount = new Map<string, { count: number; key: string }>()
  const phenoIndex = new Map<string, number>()
  const phenos: { label: string; count: number; rank: string }[] = []

  const raw = gametes[0].map((r) =>
    gametes[1].map((c) => {
      const genes = Array.from({ length: nGenes }, (_, i) => sortPair([r[i], c[i]], sex[i]))
      const genotype = genes.map((p) => p.join('')).join('')
      const key = genes.map((p, i) => p.map((a) => alleleKey(a, sex[i])).join('.')).join('|')
      const gc = genoCount.get(genotype)
      if (gc) gc.count++
      else genoCount.set(genotype, { count: 1, key })
      const per = genes.map((p, i) => genePhenotype(p, sex[i], abo[i], hasRecessive[i], traits))
      // a sex gene names the child first ("dívka, …")
      const ordered = per.map((x, i) => ({ x, s: sex[i] })).sort((a, b) => Number(b.s) - Number(a.s))
      // A_B_ when nothing is named, else "žlutá, kulatá"
      const label = ordered.map((o) => o.x.name).join(ordered.every((o) => o.x.symbolic) ? '' : ', ')
      const rank = ordered.map((o) => o.x.rank).join('|')
      let idx = phenoIndex.get(label)
      if (idx === undefined) {
        idx = phenos.length
        phenoIndex.set(label, idx)
        phenos.push({ label, count: 0, rank })
      }
      phenos[idx].count++
      if (rank < phenos[idx].rank) phenos[idx].rank = rank
      return { genotype, phenotype: idx }
    }),
  )
  const total = gametes[0].length * gametes[1].length

  // phenotypes in the textbook order: dominant first (9 : 3 : 3 : 1), codominant in between (1 : 2 : 1)
  const order = phenos.map((_, i) => i).sort((a, b) => (phenos[a].rank < phenos[b].rank ? -1 : phenos[a].rank > phenos[b].rank ? 1 : 0))
  const remap = new Map(order.map((old, i) => [old, i]))
  const phenotypes = order.map((i) => ({ label: phenos[i].label, count: phenos[i].count, share: phenos[i].count / total }))
  const cells = raw.map((row) => row.map((c) => ({ genotype: c.genotype, phenotype: remap.get(c.phenotype)! })))

  const genotypes = [...genoCount.entries()]
    .sort((a, b) => (a[1].key < b[1].key ? -1 : 1))
    .map(([label, v]) => ({ label, count: v.count, share: v.count / total }))

  return {
    parents: [g1.flat().join(''), g2.flat().join('')],
    sex,
    gametes,
    cells,
    genotypes,
    phenotypes,
    genotypeRatio: reduceRatio(genotypes.map((g) => g.count)),
    phenotypeRatio: reduceRatio(phenotypes.map((p) => p.count)),
  }
}

/** Sex of a parent when the cross involves sex chromosomes ('f' | 'm'), else null. */
export function parentSex(genotype: string, sex: boolean[]): 'f' | 'm' | null {
  const genes = genesOf(genotype)
  const i = sex.indexOf(true)
  if (i < 0 || !genes[i]) return null
  return genes[i].some((a) => parts(a).base === 'Y') ? 'm' : 'f'
}

// ------------------------------------------------------------------ words

/** Czech percentage: 75 %, 56,25 %, 33,3 %. */
export function czPercent(share: number): string {
  const v = Math.round(share * 10000) / 100
  const s = Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, '')
  return s.replace('.', ',') + ' %'
}

/** "3 : 1 – 75 % fialový květ, 25 % bílý květ" (markup). */
export function phenotypeLine(c: Cross): string {
  const sep = c.phenotypes.some((p) => p.label.includes(',')) ? '; ' : ', '
  return `${c.phenotypeRatio.join(' : ')} – ${c.phenotypes.map((p) => `${czPercent(p.share)} ${p.label}`).join(sep)}`
}

/** "1 AA : 2 Aa : 1 aa" (markup), counts reduced. */
export function genotypeLine(c: Cross): string {
  return c.genotypes.map((g, i) => `${c.genotypeRatio[i]} ${g.label}`).join(' : ')
}
