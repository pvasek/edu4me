import { Fragment, useMemo } from 'react'
import { motion, type Variants } from 'motion/react'
import { Md, plain } from '../../core/markup'
import { spring, ease } from '../../ui/motion'
import { ChargeBadge, GlyphG } from './Glyph'
import { chargeTally, glyphFor, parseEquation, tally, type Term } from './species'
import { chargeLabel } from '../molecules/cpk'
import './particles.css'

/**
 * A balanced equation drawn as particles: each species repeated coefficient times,
 * plus signs, a drawn arrow (⇌ for equilibria), formulas under the groups and an
 * atom ledger (left = right) below. Reactants appear, the arrow draws, products appear.
 */
export function ReactionView({ equation }: { equation: string }) {
  const eq = useMemo(() => parseEquation(equation), [equation])
  if (!eq) return <Md text={`$${equation}$`} />
  const all = [...eq.left, ...eq.right]
  const maxSpan = Math.max(...all.map((t) => glyphFor(t.species).span), 1.5)
  const s = Math.min(10, 56 / maxSpan)
  const rows = tally(eq)
  const q = chargeTally(eq)
  const tArrow = 0.25 + eq.left.length * 0.18
  const tProd = tArrow + 0.55
  const aria = `Rovnice ${plain('$' + equation + '$')}: ` + rows.map((r) => `${r.el} ${r.left} vlevo, ${r.right} vpravo`).join('; ')

  return (
    <motion.div
      className="pt-rx"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      role="group"
      aria-label={aria}
    >
      <div className="pt-rx-eq">
        <Side terms={eq.left} s={s} delay={0.05} />
        <div className="pt-rx-arrow" aria-hidden="true">
          <svg viewBox="0 0 64 30">
            {eq.reversible ? (
              <>
                <motion.path d="M5 11 H57 M49 4.5 L58 11" variants={draw(tArrow)} />
                <motion.path d="M59 19 H7 M15 25.5 L6 19" variants={draw(tArrow + 0.2)} />
              </>
            ) : (
              <motion.path d="M5 15 H57 M48 7 L58 15 L48 23" variants={draw(tArrow)} />
            )}
          </svg>
        </div>
        <Side terms={eq.right} s={s} delay={tProd} />
      </div>
      <motion.div className="pt-ledger" variants={fade(tProd + 0.35)}>
        <div className="pt-ledger-head">Počet atomů · vlevo = vpravo</div>
        <div className="pt-ledger-rows">
          {rows.map((r) => (
            <LedgerRow key={r.el} name={r.el} left={r.left} right={r.right} />
          ))}
          {q && <LedgerRow name="náboj" left={q.left} right={q.right} charge />}
        </div>
      </motion.div>
    </motion.div>
  )
}

function LedgerRow({ name, left, right, charge }: { name: string; left: number; right: number; charge?: boolean }) {
  const ok = left === right
  const fmt = (n: number) => (charge ? (n === 0 ? '0' : chargeLabel(n)) : String(n))
  return (
    <div className={'pt-ledger-row' + (ok ? ' is-ok' : ' is-bad')}>
      <span className={charge ? 'pt-ledger-el is-word' : 'pt-ledger-el'}>{name}:</span>
      <span className="pt-ledger-n">{fmt(left)}</span>
      <span className="pt-ledger-eq">{ok ? '=' : '≠'}</span>
      <span className="pt-ledger-n">{fmt(right)}</span>
      <span className="pt-ledger-mark" aria-label={ok ? 'souhlasí' : 'nesouhlasí'}>
        {ok ? '✓' : '✗'}
      </span>
    </div>
  )
}

const draw = (delay: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.55, ease: ease.inOut, delay }, opacity: { duration: 0.01, delay } } },
})
const fade = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out, delay } },
})
const pop = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { ...spring.bouncy, delay } },
})

function Side({ terms, s, delay }: { terms: Term[]; s: number; delay: number }) {
  let t = delay
  return (
    <div className="pt-rx-side">
      {terms.map((term, i) => {
        const d = t
        t += 0.18
        return (
          <Fragment key={i}>
            {i > 0 && (
              <motion.span className="pt-rx-plus" variants={fade(d - 0.05)} aria-hidden="true">
                +
              </motion.span>
            )}
            <Group term={term} s={s} delay={d} />
          </Fragment>
        )
      })}
    </div>
  )
}

function Group({ term, s, delay }: { term: Term; s: number; delay: number }) {
  const g = glyphFor(term.species)
  const n = Math.min(term.coef, 12)
  const cols = n <= 3 ? n : n === 4 ? 2 : n <= 6 ? 3 : 4
  const rows = Math.ceil(n / cols)
  const cell = g.span * s + 6
  const W = cols * cell + 8
  const H = rows * cell + 8
  return (
    <div className="pt-rx-group">
      <svg className="pt-rx-mols" viewBox={`0 0 ${W.toFixed(1)} ${H.toFixed(1)}`} width={W} height={H} aria-hidden="true">
        {Array.from({ length: n }, (_, k) => {
          const row = Math.floor(k / cols)
          const inRow = row === rows - 1 ? n - row * cols : cols
          const x = 4 + cell / 2 + (k % cols) * cell + ((cols - inRow) * cell) / 2
          const y = 4 + cell / 2 + row * cell
          return (
            <g key={k} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <motion.g variants={pop(delay + k * 0.06)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <GlyphG g={g} s={s} badge={false} />
                <ChargeBadge g={g} s={s} />
              </motion.g>
            </g>
          )
        })}
      </svg>
      <motion.div className="pt-rx-formula" variants={fade(delay + 0.1)}>
        <Md text={'$' + term.text + '$'} />
        {term.coef > 12 && <span className="pt-rx-more"> (zobrazeno 12)</span>}
      </motion.div>
    </div>
  )
}
