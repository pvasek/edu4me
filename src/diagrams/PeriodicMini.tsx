import { useState } from 'react'
import { ELEMENTS, tablePosition, type ChemElement } from '../courses/chemie/data/elements'
import { Arrow, Fallback, Svg, oneOf, type DiagramProps } from './util'

const MODES = ['groups', 'blocks', 'metals', 'trends'] as const
type Mode = (typeof MODES)[number]

interface Cls {
  key: string
  label: string
  color: string
}

const GROUPS: Record<string, Cls> = {
  alkali: { key: 'alkali', label: 'alkalické kovy', color: 'var(--cat-alkali)' },
  alkaline: { key: 'alkaline', label: 'kovy alk. zemin', color: 'var(--cat-alkaline)' },
  transition: { key: 'transition', label: 'přechodné kovy', color: 'var(--cat-transition)' },
  chalco: { key: 'chalco', label: 'chalkogeny', color: 'var(--cat-metalloid)' },
  halogen: { key: 'halogen', label: 'halogeny', color: 'var(--cat-halogen)' },
  noble: { key: 'noble', label: 'vzácné plyny', color: 'var(--cat-noble)' },
  f: { key: 'f', label: 'lanthanoidy a aktinoidy', color: 'var(--cat-lanthanide)' },
  other: { key: 'other', label: 'ostatní', color: 'var(--surface-2)' },
}
const BLOCKS: Record<string, Cls> = {
  s: { key: 's', label: 's-blok', color: 'var(--cat-alkali)' },
  p: { key: 'p', label: 'p-blok', color: 'var(--cat-nonmetal)' },
  d: { key: 'd', label: 'd-blok', color: 'var(--cat-transition)' },
  f: { key: 'f', label: 'f-blok', color: 'var(--cat-lanthanide)' },
}
const METALS: Record<string, Cls> = {
  metal: { key: 'metal', label: 'kovy', color: 'var(--cat-alkaline)' },
  metalloid: { key: 'metalloid', label: 'polokovy', color: 'var(--cat-metalloid)' },
  nonmetal: { key: 'nonmetal', label: 'nekovy', color: 'var(--cat-nonmetal)' },
  unknown: { key: 'unknown', label: 'neprozkoumané', color: 'var(--cat-unknown)' },
}

const METAL_CATS = new Set(['alkali', 'alkaline', 'transition', 'post', 'lanthanide', 'actinide'])
const metalClass = (e: ChemElement) =>
  e.category === 'unknown' ? 'unknown' : METAL_CATS.has(e.category) ? 'metal' : e.category === 'metalloid' ? 'metalloid' : 'nonmetal'

function classify(mode: Mode, e: ChemElement): Cls | null {
  if (mode === 'blocks') return BLOCKS[e.block]
  if (mode === 'metals') return METALS[metalClass(e)]
  if (mode === 'trends') return null
  if (e.group === null) return GROUPS.f
  if (e.z === 1) return GROUPS.other
  if (e.group === 1) return GROUPS.alkali
  if (e.group === 2) return GROUPS.alkaline
  if (e.group <= 12) return GROUPS.transition
  if (e.group === 16) return GROUPS.chalco
  if (e.group === 17) return GROUPS.halogen
  if (e.group === 18) return GROUPS.noble
  return GROUPS.other
}

const S = 22 // cell pitch
const C = 20 // cell size

const MODE_LABEL: Record<Mode, string> = {
  groups: 'skupiny prvků',
  blocks: 'bloky s, p, d, f',
  metals: 'kovy, polokovy a nekovy',
  trends: 'trendy v periodické tabulce',
}

export default function PeriodicMini({ props }: DiagramProps) {
  const [active, setActive] = useState<string | null>(null)
  const mode = oneOf(props.highlight, MODES, 'groups')
  if (!mode) return <Fallback id="periodic-mini" reason="neznámé zvýraznění" />

  const trends = mode === 'trends'
  const ML = trends ? 30 : 4
  const MT = trends ? 44 : 18
  const W = ML + 18 * S + 4
  const H = MT + 9 * S + 8 + 4
  const pos = (e: ChemElement) => {
    const { row, col } = tablePosition(e)
    return { x: ML + (col - 1) * S, y: row <= 7 ? MT + (row - 1) * S : MT + 7 * S + 8 + (row - 9) * S }
  }
  const legend = mode === 'groups' ? GROUPS : mode === 'blocks' ? BLOCKS : mode === 'metals' ? METALS : null

  // metal / non-metal staircase: shared edges between a metal and a (semi)non-metal
  const stair: string[] = []
  if (mode === 'metals') {
    const grid = new Map<string, ChemElement>()
    for (const e of ELEMENTS) if (e.group !== null) grid.set(`${e.period}-${e.group}`, e)
    const isMetal = (e?: ChemElement) => (e ? metalClass(e) === 'metal' : null)
    const isNon = (e?: ChemElement) => !!e && e.z !== 1 && (metalClass(e) === 'metalloid' || metalClass(e) === 'nonmetal')
    for (const e of grid.values()) {
      if (!isNon(e)) continue
      const { x, y } = pos(e)
      const left = grid.get(`${e.period}-${(e.group ?? 0) - 1}`)
      const below = grid.get(`${e.period + 1}-${e.group}`)
      const above = grid.get(`${e.period - 1}-${e.group}`)
      if (isMetal(left)) stair.push(`M${x - 1} ${y - 1}v${S}`)
      if (isMetal(below)) stair.push(`M${x - 1} ${y + S - 1}h${S}`)
      if (isMetal(above)) stair.push(`M${x - 1} ${y - 1}h${S}`)
    }
  }

  const ENs = ELEMENTS.map((e) => e.en).filter((v): v is number => v !== null)
  const enMin = Math.min(...ENs)
  const enMax = Math.max(...ENs)

  return (
    <div className="dg dg-pt">
      <Svg w={W} h={H} max={620} label={`Periodická tabulka: ${MODE_LABEL[mode]}.`}>
        {Array.from({ length: 18 }, (_, i) => (
          <text key={i} className="dg-pt-gnum" x={ML + i * S + C / 2} y={MT - 5} textAnchor="middle">
            {i + 1}
          </text>
        ))}
        <text className="dg-pt-gnum" x={ML + 2 * S + 1} y={MT + 7 * S + 8 + 14} textAnchor="end">
          f
        </text>
        {ELEMENTS.map((e) => {
          const { x, y } = pos(e)
          const cls = classify(mode, e)
          const dim = active !== null && cls?.key !== active
          const pastel = cls !== null && cls.key !== 'other'
          const showSym = mode !== 'blocks' && (e.block === 's' || e.block === 'p')
          return (
            <g key={e.z} className={`dg-pt-cell${dim ? ' dg-dim' : ''}`}>
              <title>{`${e.name} (${e.symbol})${cls ? ' – ' + cls.label : e.en ? ` – elektronegativita ${String(e.en).replace('.', ',')}` : ''}`}</title>
              <rect x={x} y={y} width={C} height={C} rx={3} fill={cls ? cls.color : e.en ? 'var(--surface)' : 'var(--surface-2)'} />
              {trends && e.en !== null && (
                <rect x={x} y={y} width={C} height={C} rx={3} fill="var(--accent)" fillOpacity={0.1 + (0.75 * (e.en - enMin)) / (enMax - enMin)} />
              )}
              <rect x={x} y={y} width={C} height={C} rx={3} className="dg-pt-edge" />
              {showSym && (
                <text className="dg-pt-sym" x={x + C / 2} y={y + C / 2 + 3.5} textAnchor="middle" fill={pastel ? 'var(--cat-ink)' : 'var(--ink)'}>
                  {e.symbol}
                </text>
              )}
            </g>
          )
        })}
        {stair.length > 0 && <path className="dg-stair" d={stair.join(' ')} />}
        {mode === 'blocks' && (
          <g className="dg-pt-block">
            <text x={ML + S - 1} y={MT + 4.6 * S}>s</text>
            <text x={ML + 15 * S - 1} y={MT + 3.1 * S}>p</text>
            <text x={ML + 7 * S - 1} y={MT + 5.1 * S}>d</text>
            <text x={ML + 10 * S - 1} y={MT + 8.35 * S + 8}>f</text>
          </g>
        )}
        {trends && (
          <g>
            <Arrow x1={ML} y1={10} x2={ML + 18 * S - 2} y2={10} className="dg-arrow dg-heat" head={9} />
            <Arrow x1={ML + 18 * S - 2} y1={24} x2={ML} y2={24} className="dg-arrow dg-cool" head={9} />
            <Arrow x1={10} y1={MT + 7 * S - 2} x2={10} y2={MT} className="dg-arrow dg-heat" head={9} />
            <Arrow x1={22} y1={MT} x2={22} y2={MT + 7 * S - 2} className="dg-arrow dg-cool" head={9} />
          </g>
        )}
      </Svg>
      {legend && (
        <ul className="dg-legend" onMouseLeave={() => setActive(null)}>
          {Object.values(legend).map((c) => (
            <li key={c.key}>
              <button
                type="button"
                className={`dg-legend-btn${active === c.key ? ' is-on' : ''}`}
                aria-pressed={active === c.key}
                onMouseEnter={() => setActive(c.key)}
                onFocus={() => setActive(c.key)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((a) => (a === c.key ? null : c.key))}
              >
                <span className="dg-swatch" style={{ background: c.color }} />
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {trends && (
        <ul className="dg-legend dg-legend-static">
          <li>
            <span className="dg-legend-arrow dg-heat-t">→ ↑</span> ionizační energie a elektronegativita rostou
          </li>
          <li>
            <span className="dg-legend-arrow dg-cool-t">← ↓</span> poloměr atomu roste
          </li>
          <li>
            <span className="dg-swatch dg-swatch-grad" /> tmavší políčko = vyšší elektronegativita
          </li>
        </ul>
      )}
    </div>
  )
}
