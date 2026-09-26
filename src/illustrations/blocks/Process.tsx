import type { IconItem } from '../../core/types'
import { Md } from '../../core/markup'

/** STUB – replaced by the icon agent. */
export function Process({ steps }: { layout: 'flow' | 'cycle'; steps: IconItem[] }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={i}>
          <Md text={s.title} />
        </li>
      ))}
    </ol>
  )
}
