/**
 * Genetický kód – content per level (spec/courses/biologie/games.md: level 10, b10-2 and b10-4).
 * Sequences are generated in logic.ts from the standard codon table; here live the round
 * composition, the Czech amino-acid names and the one famous mutation used as a story.
 */

export type TaskKind = 'transcribe-template' | 'transcribe-coding' | 'codon' | 'anticodon' | 'translate' | 'translate-start' | 'mutation'

/** How many tasks of each kind a round of the level has (sums to the round length). */
export const LEVELS: Record<number, Partial<Record<TaskKind, number>>> = {
  10: {
    'transcribe-template': 2,
    'transcribe-coding': 1,
    codon: 1,
    anticodon: 1,
    translate: 1,
    'translate-start': 1,
    mutation: 3,
  },
}

/** The 20 amino acids of the genetic code: three-letter code → Czech name. */
export const AMINO: Record<string, string> = {
  Ala: 'alanin',
  Arg: 'arginin',
  Asn: 'asparagin',
  Asp: 'kyselina asparagová',
  Cys: 'cystein',
  Gln: 'glutamin',
  Glu: 'kyselina glutamová',
  Gly: 'glycin',
  His: 'histidin',
  Ile: 'isoleucin',
  Leu: 'leucin',
  Lys: 'lysin',
  Met: 'methionin',
  Phe: 'fenylalanin',
  Pro: 'prolin',
  Ser: 'serin',
  Thr: 'threonin',
  Trp: 'tryptofan',
  Tyr: 'tyrosin',
  Val: 'valin',
}

/** Real point mutations told as a story (mRNA codons). Sickle-cell anaemia: β-globin codon 6, GAG → GUG (Glu → Val). */
export const FAMOUS = [
  {
    id: 'srpkovita-anemie',
    from: 'GAG',
    to: 'GUG',
    intro: 'Srpkovitá anémie: v genu pro β-globin (část hemoglobinu) se v jednom kodonu změnila jediná báze.',
  },
]
