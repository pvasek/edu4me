import { Figure, pat, rng, useClock, useCompact, useFig } from './kit'

const X0 = 54 // right prong of the fork = source
const V = 210 // wave speed (units / s)
const LAM = 110 // wavelength
const T = LAM / V
const W_ = (2 * Math.PI) / T
const A = 7.5 // particle amplitude
const DUR = 2.4
const TOPY = 44
const ROWS = 8
const GY = 250 // graph baseline
const GA = 34 // graph amplitude

/** particle displacement at rest position x, time t (a wave starting at the fork at t = 0) */
function s(x: number, t: number) {
  const tt = t - (x - X0) / V
  return tt > 0 ? A * Math.sin(W_ * tt) : 0
}
/** relative pressure (−∂s/∂x, normalised to ±1) */
function p(x: number, t: number) {
  const tt = t - (x - X0) / V
  return tt > 0 ? Math.cos(W_ * tt) * Math.min(1, tt / 0.04) : 0
}

export default function SoundWave() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={4}
      w={n ? 360 : 560}
      h={318}
      max={620}
      replay
      compact={compact}
      label="Zvuk jako podélné vlnění. Rozkmitaná ladička tlačí a odtahuje vzduch, částice vzduchu kmitají sem a tam ve směru šíření a vytvářejí střídavě zhuštění (vyšší tlak) a zředění (nižší tlak). Vlnění postupuje od ladičky, samotné částice zůstávají na místě. Graf pod částicemi ukazuje tlak vzduchu: vrcholy odpovídají zhuštěním, sedla zředěním, vzdálenost dvou zhuštění je vlnová délka λ."
    >
      <Plate w={n ? 360 : 560} />
    </Figure>
  )
}

function Plate({ w }: { w: number }) {
  const { id } = useFig()
  const t = useClock(DUR)
  const x1 = w - 14
  const done = t >= DUR - 1e-6
  // rest positions, slightly jittered
  const r = rng(7)
  const pts: [number, number][] = []
  for (let x = X0 + 8; x <= x1; x += 8) for (let j = 0; j < ROWS; j++) pts.push([x + (r() - 0.5) * 1.5, TOPY + 6 + j * 12 + (r() - 0.5) * 4])
  // pressure curve
  let d = ''
  for (let x = X0 + 6; x <= x1; x += 2) d += `${d ? 'L' : 'M'}${x} ${(GY - GA * p(x, t)).toFixed(1)} `
  // compression / rarefaction markers at the end
  const crest: number[] = []
  const trough: number[] = []
  for (let m = 0; m < 12; m++) {
    const xc = X0 + V * (DUR - m * T)
    const xt = X0 + V * (DUR - (m + 0.5) * T)
    if (xc > X0 + 30 && xc < x1 - 20) crest.push(xc)
    if (xt > X0 + 30 && xt < x1 - 20) trough.push(xt)
  }
  crest.sort((a, b) => a - b)
  trough.sort((a, b) => a - b)
  const narrow = w < 400
  const c1 = crest.find((x) => x > (narrow ? 95 : 135)) ?? crest[0]
  const c2 = crest.find((x) => x > c1 + 1)
  const tr = trough.find((x) => x > c1) ?? trough[0]
  const prong = s(X0, t)
  return (
    <g>
      {/* tuning fork */}
      <g>
        <path d={`M30 34 V148 Q30 160 39 160 Q${48 + prong} 160 ${48 + prong} 148 V34`} className="fz2-fork-o" />
        <path d={`M30 34 V148 Q30 160 39 160 Q${48 + prong} 160 ${48 + prong} 148 V34`} className="fz2-fork" />
        <path d="M39 162 V206" className="fz2-fork-o" />
        <path d="M39 162 V206" className="fz2-fork" />
        <rect x={20} y={206} width={38} height={12} rx={2} className="fz2-o fz2-fill2" />
        <rect x={20} y={206} width={38} height={12} rx={2} fill={pat(id, 'd')} />
      </g>
      <text x={14} y={24} className="fz2-lbl fz2-b">
        ladička
      </text>

      {/* air particles */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={(x + s(x, t)).toFixed(1)} cy={y} r={2.4} className="fz2-air" />
      ))}

      {/* pressure graph */}
      <path d={`M${X0 + 6} ${GY} H${x1}`} className="fz2-normal" />
      <path d={`M${X0 + 6} ${GY - GA - 16} V${GY + GA + 10}`} className="fz2-o fz2-thin" />
      <path d={d} className="fz2-curve fz2-curve-l" />
      <text x={X0 + 12} y={w < 400 ? GY + GA + 24 : GY - GA - 20} className="fz2-lbl fz2-sm">
        {w < 400 ? 'tlak p' : 'tlak vzduchu p'}
      </text>
      <text x={x1} y={GY - 6} textAnchor="end" className="fz2-lbl fz2-sm fz2-sec">
        p₀ bez zvuku
      </text>

      {done && (
        <g className="fz2-in">
          {c1 !== undefined && (
            <g>
              <path d={`M${c1} ${narrow ? TOPY : 36} V${GY - GA}`} className="fz2-guide" />
              <text x={c1} y={narrow ? 166 : 30} textAnchor="middle" className="fz2-lbl fz2-b fz2-lvl-t fz2-halo">
                zhuštění
              </text>
            </g>
          )}
          {tr !== undefined && (
            <g>
              <path d={`M${tr} 36 V${GY + GA}`} className="fz2-guide" />
              <text x={tr} y={GY + GA + 22} textAnchor="middle" className="fz2-lbl fz2-b">
                zředění
              </text>
            </g>
          )}
          {c1 !== undefined && c2 !== undefined && (
            <g>
              <path d={`M${c1} ${GY - GA - 8} H${c2}`} className="fz2-arr fz2-arr-ink" markerEnd={pat(id, 'ah-ink')} markerStart={pat(id, 'ah-ink')} />
              <text x={(c1 + c2) / 2} y={GY - GA - 14} textAnchor="middle" className="fz2-lbl fz2-b fz2-halo">
                λ
              </text>
            </g>
          )}
          <text x={X0 + 12} y={170} className="fz2-lbl fz2-sm fz2-sec">
            částice kmitají sem a tam ↔, vlna postupuje →
          </text>
        </g>
      )}
    </g>
  )
}
