import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import type { FillSpec } from './logic'

/** Background tints for phenotype classes once the square is complete (letters stay readable: --cat-ink). */
const TINTS = ['var(--cat-post)', 'var(--cat-nonmetal)', 'var(--cat-alkaline)', 'var(--cat-noble)', 'var(--cat-metalloid)', 'var(--cat-alkali)']

/** Plain-text genotype for screen readers: "I^{A}i" -> "I A i". */
export const spoken = (g: string) => g.replace(/\^\{([^}]*)\}/g, ' $1 ').replace(/\s+/g, ' ').trim()

/**
 * Interactive Punnett square: rows = ♀ gametes, columns = ♂ gametes.
 * Blank cells are buttons; the learner selects one and fills it from the palette.
 */
export function Square({
  fill,
  answers,
  selected,
  wrong,
  reveal,
  phen,
  onSelect,
}: {
  fill: FillSpec
  answers: (string | null)[][]
  selected: [number, number] | null
  wrong: [number, number][]
  /** Square checked (or given up): no more editing, show the right genotypes. */
  reveal: boolean
  /** Phenotype per cell, to tint the finished square (with a legend). */
  phen?: string[][]
  onSelect: (r: number, c: number) => void
}) {
  const isWrong = (r: number, c: number) => wrong.some(([a, b]) => a === r && b === c)
  const classes = phen ? [...new Set(phen.flat())] : []
  const w = fill.weights
  return (
    <div className="g-pn-sqwrap">
      <table className={`g-pn-sq${w ? ' g-pn-pool' : ''}${fill.cols.length > 2 || fill.rows.some((g) => (g.match(/[A-Za-z](?:\^\{[^}]*\})?/g) ?? []).length > 1) ? ' g-pn-wide' : ''}`}>
        <caption className="sr-only">
          Punnettův čtverec: řádky jsou gamety {fill.rowLabel}, sloupce gamety {fill.colLabel}.
        </caption>
        {w && (
          <colgroup>
            <col className="g-pn-col0" />
            {w.map((x, i) => (
              <col key={i} style={{ width: `${Math.max(22, x * 82)}%` }} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            <th scope="col" className="g-pn-corner">
              <span className="g-pn-cc">
                {fill.colLabel}
                {w ? ' →' : ''}
              </span>
              <span className="g-pn-cr">
                {fill.rowLabel}
                {w ? ' ↓' : ''}
              </span>
            </th>
            {fill.cols.map((g, c) => (
              <th key={c} scope="col" className="g-pn-head">
                <span className="g-pn-gam">
                  <Md text={g} />
                </span>
                {fill.colSub && <span className="g-pn-sub">{fill.colSub[c]}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fill.rows.map((g, r) => (
            <tr key={r} style={w ? { height: `${Math.round(46 + w[r] * 90)}px` } : undefined}>
              <th scope="row" className="g-pn-head">
                <span className="g-pn-gam">
                  <Md text={g} />
                </span>
                {fill.rowSub && <span className="g-pn-sub">{fill.rowSub[r]}</span>}
              </th>
              {fill.cells[r].map((right, c) => {
                const tint = phen && reveal ? TINTS[classes.indexOf(phen[r][c]) % TINTS.length] : undefined
                const style = tint ? { background: tint, color: 'var(--cat-ink)' } : undefined
                if (!fill.blanks[r][c])
                  return (
                    <td key={c} className="g-pn-cell g-pn-given" style={style}>
                      <Md text={right} />
                    </td>
                  )
                const val = reveal ? right : answers[r][c]
                const bad = isWrong(r, c)
                const sel = !reveal && selected?.[0] === r && selected?.[1] === c
                const label = `Políčko ${spoken(fill.rows[r])} a ${spoken(fill.cols[c])}: ${val ? spoken(val) : 'prázdné'}${bad ? ', chyba' : ''}`
                return (
                  <td key={c} className="g-pn-cell" style={style}>
                    <button
                      type="button"
                      className={`g-pn-btn${sel ? ' is-sel' : ''}${bad ? ' is-bad' : ''}${val ? '' : ' is-empty'}`}
                      aria-pressed={sel}
                      aria-label={label}
                      disabled={reveal}
                      onClick={() => onSelect(r, c)}
                    >
                      {val ? (
                        <span className="g-pn-val">
                          <Md text={val} />
                        </span>
                      ) : (
                        '?'
                      )}
                      {bad && (
                        <span className="g-pn-badmark" aria-hidden="true">
                          <Icon name="x" />
                        </span>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {phen && reveal && classes.length > 1 && (
        <ul className="g-pn-legend" aria-label="Fenotypy ve čtverci">
          {classes.map((p, i) => (
            <li key={p}>
              <span className="g-pn-swatch" style={{ background: TINTS[i % TINTS.length] }} aria-hidden="true" />
              {p} <span className="g-pn-count">({phen.flat().filter((x) => x === p).length}×)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** q over generations under selection: a small line chart. */
export function SelectionChart({ path }: { path: number[] }) {
  const W = 300
  const H = 140
  const L = 34
  const B = 26
  const T = 10
  const R = 10
  const n = path.length - 1
  const x = (i: number) => L + (i / n) * (W - L - R)
  const top = Math.ceil(path[0] * 10 - 1e-9) / 10
  const y = (q: number) => T + (1 - q / top) * (H - T - B)
  const d = path.map((q, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(q).toFixed(1)}`).join(' ')
  const ticks = [0, top / 2, top]
  return (
    <figure className="g-pn-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Četnost q během ${n} generací: z ${path[0].toFixed(2)} na ${path[n].toFixed(2)}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="g-pn-grid" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="g-pn-tick">
              {String(Math.round(t * 100) / 100).replace('.', ',')}
            </text>
          </g>
        ))}
        {[0, Math.round(n / 2), n].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="g-pn-tick">
            {i}
          </text>
        ))}
        <path d={d} className="g-pn-line" />
        {path.map((q, i) => (
          <circle key={i} cx={x(i)} cy={y(q)} r={i === 1 ? 4.5 : 2.6} className={i === 1 ? 'g-pn-dot1' : 'g-pn-dot'} />
        ))}
      </svg>
      <figcaption>Četnost alely a (q) v dalších generacích; zvýrazněná je 1. generace.</figcaption>
    </figure>
  )
}
