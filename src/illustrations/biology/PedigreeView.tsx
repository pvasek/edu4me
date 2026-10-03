import type { PedigreePerson } from '../../core/types'
import { Draw, KeyRow, Plate, Pop, SvgMd, f1, plural, say, textW, useNarrow } from './kit'
import { pedigreeLayout, roman, type PedigreeLayout } from './pedigree'

const R = 13 // half side of a square / radius of a circle
const ROW = 86 // generation spacing
const LEFT = 34 // room for the roman numerals
const TOP = 20
const LABEL = 13 // label font size

function who(p: PedigreePerson, gen: number): string {
  const name = p.label ? say(p.label) : p.sex === 'm' ? 'muž' : 'žena'
  return `${name} (${roman(gen)}. generace)`
}

export function pedigreeLabel(people: PedigreePerson[], lay: PedigreeLayout): string {
  const gen = new Map(lay.nodes.map((n) => [n.id, n.gen]))
  const men = people.filter((p) => p.sex === 'm').length
  const women = people.length - men
  const affected = people.filter((p) => p.affected)
  const carriers = people.filter((p) => p.carrier && !p.affected)
  const list = (ps: PedigreePerson[]) => ps.map((p) => who(p, gen.get(p.id) ?? 0)).join(', ')
  return (
    `Rodokmen: ${lay.gens} ${plural(lay.gens, ['generace', 'generace', 'generací'])}, ${people.length} ${plural(people.length, ['osoba', 'osoby', 'osob'])} ` +
    `(${men} ${plural(men, ['muž', 'muži', 'mužů'])}, ${women} ${plural(women, ['žena', 'ženy', 'žen'])}). ` +
    (affected.length ? `Postižení: ${list(affected)}. ` : 'Nikdo není postižený. ') +
    (carriers.length ? `Přenašeči: ${list(carriers)}.` : '')
  ).trim()
}

/** A family pedigree chart (block `pedigree`): generations laid out from the parent links. */
export function PedigreeView({ people }: { people: PedigreePerson[] }) {
  const narrow = useNarrow()
  const lay = pedigreeLayout(people)
  const labelW = Math.max(0, ...people.map((p) => (p.label ? textW(p.label, LABEL) : 0)))
  const S = Math.max(50, Math.ceil(labelW + 12))
  const hasLabels = people.some((p) => p.label)
  const W = LEFT + lay.width * S + 4
  const H = TOP + (lay.gens - 1) * ROW + R + (hasLabels ? 24 : 8)
  const at = new Map(lay.nodes.map((n) => [n.id, n]))
  const X = (x: number) => LEFT + (x + 0.5) * S
  const Y = (g: number) => TOP + g * ROW
  const drop = R + (hasLabels ? 25 : 14)

  const anyAffected = people.some((p) => p.affected)
  const carriers = people.filter((p) => p.carrier && !p.affected)
  const footer = (
    <div className="bio-key bio-key-ped" aria-hidden="true">
      <KeyRow term="značky">
        <span className="bio-key-item">
          <Mini sex="m" /> muž
        </span>
        <span className="bio-key-item">
          <Mini sex="f" /> žena
        </span>
        {anyAffected && (
          <span className="bio-key-item">
            <Mini sex="m" affected />
            <Mini sex="f" affected /> postižený jedinec
          </span>
        )}
        {carriers.length > 0 && (
          <span className="bio-key-item">
            <Mini sex={carriers.every((p) => p.sex === 'f') ? 'f' : 'm'} carrier />{' '}
            {carriers.every((p) => p.sex === 'f') ? 'přenašečka' : 'přenašeč'}
          </span>
        )}
      </KeyRow>
    </div>
  )

  return (
    <Plate label={pedigreeLabel(people, lay)} vb={[0, 0, W, H]} narrow={narrow} max={Math.min(680, W * 1.15)} className="bio bio-pedigree" footer={footer}>
      {/* generation numerals */}
      {Array.from({ length: lay.gens }, (_, g) => (
        <text key={g} x={14} y={f1(Y(g) + 5)} textAnchor="middle" className="bio-gen">
          {roman(g)}
        </text>
      ))}
      {/* couples and sibships */}
      {lay.couples.map((c, i) => {
        const l = at.get(c.left)!
        const r = at.get(c.right)!
        const y = Y(c.gen)
        const mx = X(c.mid)
        const kids = c.children.map((id) => at.get(id)!).filter(Boolean)
        const sibY = y + drop
        const xs = [mx, ...kids.map((k) => X(k.x))]
        let d = `M${f1(X(l.x) + R)} ${f1(Y(l.gen))} H${f1(X(r.x) - R)}`
        if (kids.length) {
          d += ` M${f1(mx)} ${f1(y)} V${f1(sibY)}`
          if (Math.max(...xs) - Math.min(...xs) > 0.5) d += ` M${f1(Math.min(...xs))} ${f1(sibY)} H${f1(Math.max(...xs))}`
          for (const k of kids) d += ` M${f1(X(k.x))} ${f1(sibY)} V${f1(Y(k.gen) - R - 1)}`
        }
        return <Draw key={i} d={d} className="ph-o bio-line" delay={0.12 + c.gen * 0.3} dur={0.45} />
      })}
      {/* people */}
      {lay.nodes.map((n, i) => {
        const cx = X(n.x)
        const cy = Y(n.gen)
        const p = n.person
        return (
          <Pop key={n.id} delay={n.gen * 0.3 + (i % 6) * 0.03}>
            <Symbol sex={p.sex} affected={p.affected} carrier={p.carrier} cx={cx} cy={cy} />
            {p.label && (
              <text x={f1(cx)} y={f1(cy + R + 16)} textAnchor="middle" className="bio-plabel">
                <SvgMd text={p.label} />
              </text>
            )}
          </Pop>
        )
      })}
    </Plate>
  )
}

function Symbol({ sex, affected, carrier, cx, cy }: { sex: 'm' | 'f'; affected?: boolean; carrier?: boolean; cx: number; cy: number }) {
  const cls = `bio-sym ${affected ? 'bio-aff' : ''}`
  return (
    <g>
      {sex === 'm' ? (
        <rect x={f1(cx - R)} y={f1(cy - R)} width={2 * R} height={2 * R} rx={1.5} className={cls} />
      ) : (
        <circle cx={f1(cx)} cy={f1(cy)} r={R + 1} className={cls} />
      )}
      {carrier && !affected && <circle cx={f1(cx)} cy={f1(cy)} r={3.8} className="bio-dot" />}
    </g>
  )
}

/** Tiny symbol for the key under the chart. */
function Mini({ sex, affected, carrier }: { sex: 'm' | 'f'; affected?: boolean; carrier?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width={15} height={15} className="bio-mini">
      {sex === 'm' ? (
        <rect x={1.5} y={1.5} width={13} height={13} rx={1} className={`bio-sym ${affected ? 'bio-aff' : ''}`} />
      ) : (
        <circle cx={8} cy={8} r={6.6} className={`bio-sym ${affected ? 'bio-aff' : ''}`} />
      )}
      {carrier && <circle cx={8} cy={8} r={2.2} className="bio-dot" />}
    </svg>
  )
}
