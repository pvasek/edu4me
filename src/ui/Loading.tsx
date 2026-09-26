import { Mascot } from './Mascot'

export function Loading({ text = 'Míchám činidla…' }: { text?: string }) {
  return (
    <div className="loading" role="status">
      <Mascot mood="think" size={72} />
      <span className="hand">{text}</span>
    </div>
  )
}
