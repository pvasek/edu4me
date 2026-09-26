import type { CompareColumn } from '../../core/types'
import { Md } from '../../core/markup'

/** STUB – replaced by the icon agent. */
export function Compare({ columns }: { columns: CompareColumn[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 12 }}>
      {columns.map((c, i) => (
        <div key={i}>
          <strong>
            <Md text={c.title} />
          </strong>
          <ul>
            {c.points.map((p, j) => (
              <li key={j}>
                <Md text={p} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
