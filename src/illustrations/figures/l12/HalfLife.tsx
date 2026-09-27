import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Fade, cz, drawV, rng } from './kit'

const HL = 5730
const X0 = 58
const X1 = 424
const Y0 = 252
const Y1 = 26
const TMAX = 5
const sx = (t: number) => X0 + (t / TMAX) * (X1 - X0)
const sy = (n: number) => Y0 - n * (Y0 - Y1)
const FRAC = ['1', '½', '¼', '⅛', '¹⁄₁₆']

let CURVE = ''
for (let i = 0; i <= 100; i++) {
  const t = (i / 100) * TMAX
  CURVE += `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(Math.pow(0.5, t)).toFixed(1)}`
}

/** decay order of the 64 nuclei (deterministic shuffle) */
const RANK = (() => {
  const r = rng(14)
  const a = Array.from({ length: 64 }, (_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  const rank: number[] = []
  a.forEach((idx, k) => (rank[idx] = k))
  return rank
})()

function Chart({ step }: { step: number }) {
  return (
    <motion.svg className="f12-svg" viewBox="0 0 440 300" aria-hidden="true">
      {/* axes */}
      {[0, 0.25, 0.5, 0.75, 1].map((n) => (
        <line key={n} className="f12-grid" x1={X0} x2={X1} y1={sy(n)} y2={sy(n)} />
      ))}
      <line className="f12-axisline" x1={X0} x2={X1 + 6} y1={Y0} y2={Y0} />
      <line className="f12-axisline" x1={X0} x2={X0} y1={Y0} y2={Y1 - 8} />
      {Array.from({ length: TMAX + 1 }, (_, k) => (
        <text key={k} className={`f12-tick ${k % 2 ? 'f12-sec' : ''}`} x={sx(k)} y={Y0 + 18} textAnchor="middle">
          {cz(k * HL, 0)}
        </text>
      ))}
      {[0, 0.5, 1].map((n) => (
        <text key={n} className="f12-tick" x={X0 - 8} y={sy(n) + 4} textAnchor="end">
          {n === 0 ? '0' : n === 1 ? '100 %' : '50 %'}
        </text>
      ))}
      <text className="f12-t" x={X1} y={Y0 + 42} textAnchor="end">
        čas (roky)
      </text>
      <text className="f12-t" x={X0 + 10} y={Y1 - 10}>
        zbývá uhlíku-14
      </text>

      {/* halvings */}
      {[1, 2, 3, 4].map((k) => (
        <Fade key={k} delay={0.9 + k * 0.2}>
          <path className="f12-cross" d={`M${sx(k)} ${Y0} L${sx(k)} ${sy(Math.pow(0.5, k))} L${X0} ${sy(Math.pow(0.5, k))}`} />
          <text className="f12-frac" x={sx(k) + 6} y={sy(Math.pow(0.5, k)) - 8}>
            {FRAC[k]}
          </text>
        </Fade>
      ))}
      <motion.path className="f12-decay" d={CURVE} variants={drawV(0.2, 1.4)} />
      <Fade delay={1.6}>
        <text className="f12-t" x={sx(2.1)} y={sy(0.86)}>
          poločas přeměny C-14
        </text>
        <text className="f12-t f12-t-strong" x={sx(2.1)} y={sy(0.86) + 22}>
          = 5 730 let
        </text>
      </Fade>
      <motion.circle className="f12-now" r={7} initial={false} animate={{ cx: sx(step), cy: sy(Math.pow(0.5, step)) }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
    </motion.svg>
  )
}

function Sample({ step }: { step: number }) {
  const alive = 64 / Math.pow(2, step)
  return (
    <svg className="f12-svg f12-box" viewBox="0 0 196 250" aria-hidden="true" style={{ ['--f12-fs' as string]: '17px' }}>
      <text className="f12-t f12-t-strong" x={98} y={22} textAnchor="middle">
        zbývá {alive} z 64
      </text>
      {RANK.map((rk, i) => {
        const x = 24 + (i % 8) * 21.2
        const y = 48 + Math.floor(i / 8) * 21.2
        const on = rk < alive
        return <circle key={i} className={on ? 'f12-c14' : 'f12-n14'} cx={x} cy={y} r={on ? 8 : 6.5} />
      })}
      <text className="f12-small" x={98} y={236} textAnchor="middle">
        {step === 0 ? 'na začátku' : `po ${step} ${step === 1 ? 'poločasu' : 'poločasech'} (${cz(step * HL, 0)} let)`}
      </text>
    </svg>
  )
}

export default function HalfLife() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (!inView) return
    setStep(0)
    const timers = [1, 2, 3, 4].map((k) => window.setTimeout(() => setStep(k), 900 + k * 1400))
    return () => timers.forEach(clearTimeout)
  }, [inView, run])
  return (
    <div className="f12 f12-l2" style={{ maxWidth: 680 }} ref={ref}>
      <motion.div
        className="f12-hl-wrap"
        role="img"
        aria-label="Poločas přeměny uhlíku-14 je 5 730 let. Graf ukazuje, že po každém poločasu zbývá polovina jader: po 5 730 letech polovina, po 11 460 letech čtvrtina, po 17 190 letech osmina a po 22 920 letech šestnáctina. Vedle je vzorek 64 jader uhlíku-14, ze kterých se po každém poločasu polovina přemění na dusík-14: 64, 32, 16, 8 a 4."
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Chart step={step} />
        <Sample step={step} />
      </motion.div>
      <div className="f12-controls">
        <span className="f12-key">
          <i className="f12-key-c" /> uhlík-14
        </span>
        <span className="f12-key">
          <i className="f12-key-n" /> dusík-14 (po přeměně β)
        </span>
        <button type="button" className="f12-btn" onClick={() => setRun((n) => n + 1)}>
          Přehrát znovu
        </button>
      </div>
    </div>
  )
}
