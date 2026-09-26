import { BY_SYMBOL, CATEGORY_LABEL, categoryVar, fmtMass, type ChemElement } from '../courses/chemie/data/elements'
import './element-tile.css'

/** Periodic-table style tile. Pass a symbol or a full element. */
export function ElementTile({
  symbol,
  element,
  size = 'md',
  showCategory = false,
  dim = false,
  onClick,
  selected = false,
  hideName = false,
}: {
  symbol?: string
  element?: ChemElement
  size?: 'sm' | 'md' | 'lg'
  showCategory?: boolean
  dim?: boolean
  onClick?: () => void
  selected?: boolean
  hideName?: boolean
}) {
  const e = element ?? (symbol ? BY_SYMBOL[symbol] : undefined)
  if (!e) return <span className="el-tile el-missing">{symbol}</span>
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`el-tile el-${size}${dim ? ' el-dim' : ''}${selected ? ' el-selected' : ''}`}
      style={{ ['--el-bg' as string]: categoryVar(e.category) }}
      onClick={onClick}
      aria-label={`${e.name}, ${e.symbol}, protonové číslo ${e.z}`}
      title={`${e.name} (${CATEGORY_LABEL[e.category]})`}
    >
      <span className="el-z">{e.z}</span>
      <span className="el-sym">{e.symbol}</span>
      {!hideName && <span className="el-name">{e.name}</span>}
      {size !== 'sm' && !hideName && <span className="el-mass">{fmtMass(e.mass)}</span>}
      {showCategory && <span className="el-cat">{CATEGORY_LABEL[e.category]}</span>}
    </Tag>
  )
}
