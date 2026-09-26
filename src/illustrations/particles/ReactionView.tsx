import { Md } from '../../core/markup'

/** STUB – replaced by the molecule agent. */
export function ReactionView({ equation }: { equation: string }) {
  return <Md text={`$${equation}$`} />
}
