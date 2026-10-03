import { Fragment } from 'react'
import { crossOf, czPercent, genotypeLine, parentSex, type Cross } from './genetics'
import { Draw, Fade, KeyRow, Plate, Pop, SvgMd, Swatch, f1, groupTone, md, say, textW, url, useNarrow, usePlate } from './kit'

const SEX_SIGN = { f: '♀', m: '♂' } as const

/** Parent genotype as written in the corner, with ♀ / ♂ when the cross involves sex chromosomes. */
const parentText = (c: Cross, i: 0 | 1) => {
  const s = parentSex(c.parents[i], c.sex)
  return (s ? `${SEX_SIGN[s]} ` : '') + c.parents[i]
}

export function punnettLabel(c: Cross): string {
  const g = (i: 0 | 1) => c.gametes[i].map((a) => say(a.join(''))).join(', ')
  const pheno = `${c.phenotypeRatio.join(' : ')} – ${c.phenotypes.map((p) => `${czPercent(p.share).replace(' ', ' ')} ${say(p.label)}`).join('; ')}`
  return (
    `Punnettův čtverec: křížení ${say(c.parents[0])} × ${say(c.parents[1])}. ` +
    `Gamety prvního rodiče (řádky): ${g(0)}; gamety druhého rodiče (sloupce): ${g(1)}. ` +
    `Genotypy potomků: ${say(genotypeLine(c))}. Fenotypy: ${pheno}.`
  )
}

/** A Punnett square computed from the parents' genotypes (block `punnett`). */
export function PunnettView({ parents, traits }: { parents: [string, string]; traits?: Record<string, string> }) {
  const narrow = useNarrow()
  const c = crossOf(parents, traits)
  if (!c)
    return (
      <Plate label={`Křížení ${parents.join(' × ')} nejde nakreslit.`} vb={[0, 0, 240, 40]} narrow={narrow} max={360}>
        <text x={120} y={25} textAnchor="middle" className="ph-lbl ph-lbl-sm">
          {parents.join(' × ')}
        </text>
      </Plate>
    )
  const k = c.gametes[0].length
  const big = k > 2
  const cs = big ? 64 : 88
  // the corner holds both parents' genotypes on either side of its diagonal
  const longest = Math.max(textW(parentText(c, 0), 13), textW(parentText(c, 1), 13))
  const hs = Math.min(84, Math.max(big ? 56 : 62, Math.ceil(longest * 1.25 + 14)))
  const M = 4
  const size = hs + k * cs
  const W = size + 2 * M
  const sep = c.phenotypes.some((p) => p.label.includes(',')) ? ';' : ','
  const footer = (
    <div className="bio-key">
      <KeyRow term="genotyp">{md(genotypeLine(c))}</KeyRow>
      <KeyRow term="fenotyp">
        {c.phenotypeRatio.join(' : ')} –{' '}
        {c.phenotypes.map((p, i) => {
          const { tone, hatch } = groupTone(i)
          return (
            <span key={i} className="bio-key-item">
              <Swatch tone={tone} hatch={hatch} /> {czPercent(p.share)} {md(p.label)}
              {i < c.phenotypes.length - 1 ? sep : ''}
            </span>
          )
        })}
      </KeyRow>
    </div>
  )
  return (
    <Plate label={punnettLabel(c)} vb={[0, 0, W, W]} narrow={narrow} max={big ? 470 : 340} className="bio bio-punnett" footer={footer}>
      <Square c={c} cs={cs} hs={hs} M={M} />
    </Plate>
  )
}

function Square({ c, cs, hs, M }: { c: Cross; cs: number; hs: number; M: number }) {
  const { id } = usePlate()
  const k = c.gametes[0].length
  const big = k > 2
  const size = hs + k * cs
  const gx = M + hs
  const gy = M + hs
  const r = big ? 19 : 22
  const n = k * k
  const step = Math.min(0.2, 0.85 / Math.max(1, n - 1))
  const who = (i: 0 | 1) => parentText(c, i)
  const cellFont = big ? 'bio-geno bio-geno-sm' : 'bio-geno'

  const grid: string[] = []
  for (let i = 1; i < k; i++) {
    grid.push(`M${f1(gx + i * cs)} ${M} V${M + size}`)
    grid.push(`M${M} ${f1(gy + i * cs)} H${M + size}`)
  }
  return (
    <g>
      {/* headers */}
      <rect x={M} y={M} width={size} height={hs} className="ph-fill2" />
      <rect x={M} y={M} width={hs} height={size} className="ph-fill2" />
      {/* cells */}
      {c.cells.map((row, ri) =>
        row.map((cell, ci) => {
          const { tone, hatch } = groupTone(cell.phenotype)
          const x = gx + ci * cs
          const y = gy + ri * cs
          return (
            <Pop key={`${ri}-${ci}`} delay={0.25 + (ri * k + ci) * step}>
              <g className={`ph-tone-${tone}`}>
                <rect x={x + 3} y={y + 3} width={cs - 6} height={cs - 6} rx={4} className="bio-tint" />
                {hatch && <rect x={x + 3} y={y + 3} width={cs - 6} height={cs - 6} rx={4} fill={url(id, `t${tone}`)} />}
                <text x={f1(x + cs / 2)} y={f1(y + cs / 2 + (big ? 5 : 6))} textAnchor="middle" className={cellFont}>
                  <SvgMd text={cell.genotype} />
                </text>
              </g>
            </Pop>
          )
        }),
      )}
      {/* frame and grid */}
      <Draw d={`M${M} ${M} H${M + size} V${M + size} H${M} Z`} className="ph-o ph-thick" dur={0.6} />
      <Draw d={`M${gx} ${M} V${M + size} M${M} ${gy} H${M + size}`} className="ph-o ph-thick" delay={0.1} dur={0.5} />
      {grid.length > 0 && <Draw d={grid.join(' ')} className="ph-o ph-thin" delay={0.15} dur={0.5} />}
      <Draw d={`M${M} ${M} L${gx} ${gy}`} className="ph-o ph-thin" delay={0.1} dur={0.3} />
      {/* corner: parent 2 above the diagonal (columns), parent 1 below it (rows) */}
      <Fade delay={0.15}>
        <text x={gx - 4} y={M + 15} textAnchor="end" className="bio-parent">
          <SvgMd text={who(1)} />
        </text>
        <text x={M + 4} y={gy - 6} className="bio-parent">
          <SvgMd text={who(0)} />
        </text>
      </Fade>
      {/* gametes */}
      {[0, 1].map((side) =>
        c.gametes[side].map((g, i) => {
          const cx = side ? gx + i * cs + cs / 2 : M + hs / 2
          const cy = side ? M + hs / 2 : gy + i * cs + cs / 2
          return (
            <Fragment key={`${side}-${i}`}>
              <Pop delay={0.1 + i * 0.05}>
                <circle cx={f1(cx)} cy={f1(cy)} r={r} className="bio-gamete" />
                <text x={f1(cx)} y={f1(cy + 5)} textAnchor="middle" className={big ? 'bio-gam-t bio-gam-sm' : 'bio-gam-t'}>
                  <SvgMd text={g.join('')} />
                </text>
              </Pop>
            </Fragment>
          )
        }),
      )}
    </g>
  )
}
