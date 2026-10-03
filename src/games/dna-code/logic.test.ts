import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { AMINO, FAMOUS, LEVELS } from './levels'
import {
  ALL_CODONS,
  CODE,
  MUTATION_KINDS,
  ROUND,
  SENSE_CODONS,
  STOP,
  STOP_CODONS,
  allMutations,
  anticodon,
  checkTyped,
  classify,
  codingToMrna,
  makeMutation,
  makeOrf,
  makeRound,
  mrnaToCoding,
  mrnaToTemplate,
  playedLevel,
  taskKey,
  transcribe,
  translate,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('standard genetic code', () => {
  it('has 64 codons, 61 sense codons and 3 stops', () => {
    expect(ALL_CODONS).toHaveLength(64)
    expect(SENSE_CODONS).toHaveLength(61)
    expect(STOP_CODONS.sort()).toEqual(['UAA', 'UAG', 'UGA'])
  })

  it('agrees with the textbook table', () => {
    const known: Record<string, string> = {
      AUG: 'Met', UGG: 'Trp', UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', CUG: 'Leu', AUU: 'Ile', AUA: 'Ile', GUU: 'Val',
      UCU: 'Ser', AGU: 'Ser', AGC: 'Ser', CCC: 'Pro', ACG: 'Thr', GCA: 'Ala', UAU: 'Tyr', CAU: 'His', CAA: 'Gln',
      AAU: 'Asn', AAA: 'Lys', AAG: 'Lys', GAU: 'Asp', GAG: 'Glu', UGU: 'Cys', CGA: 'Arg', AGA: 'Arg', AGG: 'Arg', GGG: 'Gly',
      GUG: 'Val', UAA: STOP, UAG: STOP, UGA: STOP,
    }
    for (const [c, aa] of Object.entries(known)) expect(CODE[c], c).toBe(aa)
  })

  it('has the right degeneracy for every amino acid', () => {
    const count = (aa: string) => ALL_CODONS.filter((c) => CODE[c] === aa).length
    const expected: Record<string, number> = {
      Leu: 6, Ser: 6, Arg: 6, Ala: 4, Gly: 4, Pro: 4, Thr: 4, Val: 4, Ile: 3, Phe: 2, Tyr: 2, His: 2, Gln: 2, Asn: 2,
      Lys: 2, Asp: 2, Glu: 2, Cys: 2, Met: 1, Trp: 1,
    }
    for (const [aa, n] of Object.entries(expected)) expect(count(aa), aa).toBe(n)
    expect(Object.keys(expected).sort()).toEqual(Object.keys(AMINO).sort())
  })
})

describe('transcription and translation', () => {
  it('transcribes the template strand by complementarity and the coding strand by T → U', () => {
    expect(transcribe('TACGGT')).toBe('AUGCCA')
    expect(codingToMrna('ATGCCA')).toBe('AUGCCA')
    expect(mrnaToCoding('AUGCCA')).toBe('ATGCCA')
    expect(mrnaToTemplate('AUGCCA')).toBe('TACGGT')
    for (let s = 1; s < 30; s++) {
      const m = makeOrf(4, rng(s))
      expect(transcribe(mrnaToTemplate(m))).toBe(m)
    }
  })

  it('pairs anticodons with U, never T', () => {
    expect(anticodon('AUG')).toBe('UAC')
    expect(anticodon('GCA')).toBe('CGU')
  })

  it('translates from the start to the stop codon', () => {
    expect(translate('AUGGCUUGGUAA')).toEqual(['Met', 'Ala', 'Trp'])
    expect(translate('AUGUAAGGG')).toEqual(['Met'])
    expect(translate('GGAUGUUU', 2)).toEqual(['Met', 'Phe'])
    expect(translate('AUGUAAGGG', 0, true)).toEqual(['Met', STOP, 'Gly'])
  })

  it('makes reading frames with a single start and a final stop', () => {
    for (let s = 1; s < 50; s++) {
      const orf = makeOrf(4, rng(s))
      expect(orf.length).toBe(18)
      expect(orf.startsWith('AUG')).toBe(true)
      expect(STOP_CODONS).toContain(orf.slice(-3))
      expect(translate(orf)).toHaveLength(5)
    }
  })
})

describe('point mutations', () => {
  it('classifies mutations', () => {
    expect(classify('AUGGCUUAA', 'AUGGCCUAA')).toBe('silent') // GCU -> GCC, Ala
    expect(classify('AUGGAGUAA', 'AUGGUGUAA')).toBe('missense') // Glu -> Val (sickle cell)
    expect(classify('AUGUAUUGGUAA', 'AUGUAAUGGUAA')).toBe('nonsense') // Tyr -> stop
    expect(classify('AUGGCUUGGUAA', 'AUGGCUGUGGUAA')).toBe('frameshift')
    expect(classify('AUGGCUUGGUAA', 'AUGGCUGGUAA')).toBe('frameshift')
  })

  it('generates every kind on demand', () => {
    for (const kind of MUTATION_KINDS) {
      for (let s = 1; s < 25; s++) {
        const { orf, m } = makeMutation(kind, rng(s * 7 + 1))
        expect(classify(orf, m.mrna), `${kind} ${orf} ${m.mrna}`).toBe(kind)
        expect(m.pos).toBeGreaterThanOrEqual(3)
        if (kind !== 'frameshift') {
          expect(m.type).toBe('sub')
          expect([...orf].filter((b, i) => b !== m.mrna[i])).toHaveLength(1)
        } else expect(Math.abs(m.mrna.length - orf.length)).toBe(1)
      }
    }
  })

  it('never mutates the start or the stop codon', () => {
    const orf = makeOrf(3, rng(3))
    for (const m of allMutations(orf)) {
      expect(m.pos).toBeGreaterThanOrEqual(3)
      expect(m.pos).toBeLessThan(orf.length - 3)
    }
  })

  it('the famous mutation is the real one: GAG -> GUG, Glu -> Val', () => {
    for (const f of FAMOUS) {
      expect(classify(`AUG${f.from}UAA`, `AUG${f.to}UAA`)).toBe('missense')
      expect([...f.from].filter((b, i) => b !== f.to[i])).toHaveLength(1)
    }
    expect(CODE.GAG).toBe('Glu')
    expect(CODE.GUG).toBe('Val')
  })
})

describe('dna-code rounds', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(Object.keys(GAME_BY_ID['dna-code'].courses.biologie!).map(Number).sort())
    for (const mix of Object.values(LEVELS)) expect(Object.values(mix).reduce((a, b) => a + b, 0)).toBe(ROUND)
  })

  it('picks the level from the level id', () => {
    expect(playedLevel('l10')).toBe(10)
    expect(playedLevel('l7')).toBeUndefined()
  })

  it('deals 10 valid, distinct tasks with computed answers', () => {
    for (let s = 1; s < 80; s++) {
      for (const level of [10, undefined]) {
        const round = makeRound(level, rng(s))
        expect(round).toHaveLength(ROUND)
        expect(new Set(round.map(taskKey)).size).toBe(ROUND)
        const muts = round.filter((t) => t.kind === 'mutation').map((t) => t.answer)
        expect(new Set(muts).size, `seed ${s}`).toBe(muts.length)
        for (const t of round) {
          expect(t.explain.length).toBeGreaterThan(10)
          if (typeof t.answer === 'string') {
            // typed transcription
            expect(t.answer).toMatch(/^[AUGC]{9}$/)
            const dna = t.strands[0].seq
            expect(t.kind === 'transcribe-template' ? transcribe(dna) : codingToMrna(dna)).toBe(t.answer)
          } else {
            expect(t.options).toBeDefined()
            expect(t.options!.length).toBe(4)
            expect(new Set(t.options).size, `${t.kind} ${t.options}`).toBe(4)
            expect(t.answer).toBeGreaterThanOrEqual(0)
            expect(t.answer).toBeLessThan(4)
          }
          if (t.kind === 'translate') expect(t.options![t.answer as number]).toBe(translate(t.strands[0].seq).join('–'))
          if (t.kind === 'translate-start') {
            const m = t.strands[0].seq
            expect(t.options![t.answer as number]).toBe(translate(m, m.indexOf('AUG')).join('–'))
          }
          if (t.kind === 'anticodon') expect(t.options![t.answer as number]).toBe(anticodon(t.strands[0].seq))
          if (t.kind === 'mutation') {
            const [a, b] = t.strands.map((x) => x.seq)
            expect(MUTATION_KINDS[t.answer as number]).toBe(classify(a, b))
          }
        }
      }
    }
  })

  it('checks typed mRNA base by base', () => {
    expect(checkTyped('AUGC', 'AUGCCA')).toEqual({ kind: 'short' })
    expect(checkTyped('AUGCCA', 'AUGCCA')).toEqual({ kind: 'ok' })
    expect(checkTyped('AUGCCU', 'AUGCCA')).toEqual({ kind: 'wrong', bad: [5] })
  })
})
