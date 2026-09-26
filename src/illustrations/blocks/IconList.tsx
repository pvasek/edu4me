import type { IconItem } from '../../core/types'
import { Md } from '../../core/markup'

/** STUB – replaced by the icon agent. */
export function IconList({ items }: { items: IconItem[] }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>
          <Md text={it.title} /> {it.text && <Md text={it.text} />}
        </li>
      ))}
    </ul>
  )
}
