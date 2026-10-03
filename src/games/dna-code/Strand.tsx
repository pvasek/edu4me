import { BASES, CODE, STOP, type Strand } from './logic'

/** Splits a sequence into codon groups from `frame` (bases before it form their own group); no frame = single bases. */
function groups(seq: string, frame?: number): { start: number; bases: string }[] {
  if (frame === undefined) return [...seq].map((b, i) => ({ start: i, bases: b }))
  const out: { start: number; bases: string }[] = []
  if (frame > 0) out.push({ start: 0, bases: seq.slice(0, frame) })
  for (let i = frame; i < seq.length; i += 3) out.push({ start: i, bases: seq.slice(i, i + 3) })
  return out
}

/** A strand of DNA or RNA as coloured base tiles (letters always shown), grouped into codons. */
export function StrandView({ strand, bad = [] }: { strand: Strand; bad?: number[] }) {
  const mark = strand.mark ?? []
  const spoken = `${strand.label}: ${strand.ends[0]} konec, ${[...strand.seq].join(' ')}, ${strand.ends[1]} konec${mark.length ? `. Změněná báze je ${mark.map((m) => m + 1).join(', ')}.` : ''}`
  return (
    <div className="g-dc-strand">
      <span className="g-dc-label">{strand.label}</span>
      <div className="g-dc-seq" role="img" aria-label={spoken}>
        <span className="g-dc-end">{strand.ends[0]}</span>
        {groups(strand.seq, strand.frame).map((g) => (
          <span key={g.start} className={`g-dc-codon${strand.frame === undefined ? ' is-single' : ''}`}>
            {[...g.bases].map((b, k) => {
              const i = g.start + k
              return (
                <span key={i} className={`g-dc-b g-dc-${b}${mark.includes(i) ? ' is-mark' : ''}${bad.includes(i) ? ' is-bad' : ''}`}>
                  {b}
                </span>
              )
            })}
          </span>
        ))}
        <span className="g-dc-end">{strand.ends[1]}</span>
      </div>
    </div>
  )
}

/** The typed mRNA under a DNA strand: one slot per base, grouped like the strand, the next slot marked. */
export function Slots({ length, typed, frame, bad, done }: { length: number; typed: string; frame?: number; bad: number[]; done: boolean }) {
  const seq = typed.padEnd(length, ' ')
  return (
    <div className="g-dc-strand g-dc-answer">
      <span className="g-dc-label">mRNA (tvoje odpověď)</span>
      <div className="g-dc-seq" aria-hidden="true">
        <span className="g-dc-end">5′</span>
        {groups(seq, frame).map((g) => (
          <span key={g.start} className="g-dc-codon">
            {[...g.bases].map((b, k) => {
              const i = g.start + k
              const empty = b === ' '
              return (
                <span
                  key={i}
                  className={`g-dc-b ${empty ? 'g-dc-slot' : `g-dc-${b}`}${!done && i === typed.length ? ' is-next' : ''}${bad.includes(i) ? ' is-bad' : ''}`}
                >
                  {empty ? '' : b}
                </span>
              )
            })}
          </span>
        ))}
        <span className="g-dc-end">3′</span>
      </div>
    </div>
  )
}

/** The standard codon table: rows = 1st base, columns = 2nd base, each cell lists the four codons. */
export function CodonTable({ highlight }: { highlight: string[] }) {
  return (
    <table className="g-dc-table">
      <caption className="sr-only">Genetický kód: kodony mRNA a aminokyseliny. Řádky jsou 1. báze, sloupce 2. báze.</caption>
      <thead>
        <tr>
          <th scope="col" className="g-dc-tcorner">
            <span aria-hidden="true">1.\2.</span>
            <span className="sr-only">1. báze</span>
          </th>
          {BASES.map((b) => (
            <th key={b} scope="col" className={`g-dc-th g-dc-${b}`}>
              {b}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {BASES.map((first) => (
          <tr key={first}>
            <th scope="row" className={`g-dc-th g-dc-${first}`}>
              {first}
            </th>
            {BASES.map((second) => (
              <td key={second}>
                <ul>
                  {BASES.map((third) => {
                    const c = first + second + third
                    const aa = CODE[c]
                    const hl = highlight.includes(c)
                    return (
                      <li key={c} className={`${hl ? 'is-hl' : ''}${aa === STOP ? ' is-stop' : ''}${c === 'AUG' ? ' is-start' : ''}`}>
                        <span className="g-dc-tc">{c}</span> <b>{aa === STOP ? 'stop' : aa}</b>
                      </li>
                    )
                  })}
                </ul>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
