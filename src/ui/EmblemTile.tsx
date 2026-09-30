import './element-tile.css'

/** Medal-like tile for a level emblem that isn't a chemical element (a physics unit or constant). */
export function EmblemTile({
  symbol,
  name,
  color,
  number,
  size = 'md',
  dim = false,
  hideName = false,
}: {
  symbol: string
  name?: string
  color: string
  /** level number shown in the corner */
  number?: number
  size?: 'sm' | 'md' | 'lg'
  dim?: boolean
  hideName?: boolean
}) {
  const label = name ? `${name}, ${symbol}` : symbol
  return (
    <div
      className={`el-tile em-tile el-${size}${dim ? ' el-dim' : ''}`}
      style={{ ['--em' as string]: color }}
      role="img"
      aria-label={dim ? `${label} – zatím nezískáno` : label}
      title={label}
    >
      {number !== undefined && <span className="el-z">{number}</span>}
      <span className={`el-sym${symbol.length > 1 ? ' em-long' : ''}`}>{symbol}</span>
      {!hideName && name && <span className="el-name">{name}</span>}
    </div>
  )
}
