import type { CSSProperties } from 'react'
import { Fade, Figure, Lbl, Plate, Pop, useHatch, useNarrow } from './kit'

const LABEL =
  'Buněčná membrána jako lipidová dvojvrstva. Fosfolipidy mají polární hydrofilní hlavičku a dva nepolární hydrofobní ocasy; hlavičky míří ven k vodě na obou stranách, ocasy k sobě dovnitř. Mezi fosfolipidy jsou vsunuté molekuly cholesterolu, které membránu zpevňují. Napříč membránou prochází kanálový protein s pórem, kterým procházejí ionty.'

const HEAD = '#c46a86'

function Lipid({ x, y, up, kink }: { x: number; y: number; up: boolean; kink: boolean }) {
  const hatch = useHatch()
  const s = up ? 1 : -1
  const t1 = `M${x - 3.5} ${y + 8 * s} q-3 ${9 * s} 0 ${18 * s} q3 ${9 * s} 0 ${18 * s} q-3 ${9 * s} 0 ${18 * s} q3 ${9 * s} 0 ${14 * s}`
  const t2 = kink
    ? `M${x + 3.5} ${y + 8 * s} q3 ${9 * s} 0 ${18 * s} l7 ${14 * s} q3 ${9 * s} 0 ${18 * s} q-2 ${7 * s} 0 ${14 * s}`
    : `M${x + 3.5} ${y + 8 * s} q3 ${9 * s} 0 ${18 * s} q-3 ${9 * s} 0 ${18 * s} q3 ${9 * s} 0 ${18 * s} q-3 ${9 * s} 0 ${14 * s}`
  return (
    <g>
      <path d={t1} className="f89-thin" style={{ strokeWidth: 1.4 }} />
      <path d={t2} className="f89-thin" style={{ strokeWidth: 1.4 }} />
      <circle cx={x} cy={y} r={9} fill={HEAD} stroke="var(--edge)" strokeWidth={1.1} />
      <circle cx={x} cy={y} r={9} fill={hatch('s')} className="f89-hatch" />
    </g>
  )
}

function Cholesterol({ x, y, up }: { x: number; y: number; up: boolean }) {
  const s = up ? 1 : -1
  // head (OH) at the head row, rigid ring body into the tail zone
  const body = y + 18 * s
  return (
    <g>
      <circle cx={x} cy={y + 4 * s} r={3.5} fill="#d9493b" stroke="var(--edge)" strokeWidth={0.8} />
      <rect x={x - 6} y={up ? body - 8 : body - 28} width={12} height={36} rx={4} fill="#e8c35a" stroke="var(--edge)" strokeWidth={1.1} />
      {[0, 1, 2].map((k) => (
        <polygon
          key={k}
          points={Array.from({ length: 6 }, (_, j) => {
            const a = (j / 6) * Math.PI * 2 + Math.PI / 6
            const cy = (up ? body - 2 : body - 22) + k * 10
            return `${(x + Math.cos(a) * 4.2).toFixed(1)},${(cy + Math.sin(a) * 4.2).toFixed(1)}`
          }).join(' ')}
          fill="none"
          stroke="var(--edge)"
          strokeWidth={0.7}
        />
      ))}
      <line className="f89-thin" x1={x} y1={up ? body + 28 : body - 28} x2={x} y2={up ? body + 40 : body - 40} />
    </g>
  )
}

export default function LipidBilayer() {
  return (
    <Figure name="lipid-bilayer" level={9} label={LABEL} max={660}>
      <Scene />
    </Figure>
  )
}

function Scene() {
  const n = useNarrow()
  const hatch = useHatch()
  const L = n ? { w: 360, h: 420, x0: 18, x1: 350, top: 150, ch: 214 } : { w: 620, h: 330, x0: 24, x1: 420, top: 88, ch: 290 }
  const bot = L.top + 154
  const mid = (L.top + bot) / 2
  const xs: number[] = []
  for (let x = L.x0; x <= L.x1; x += 22) if (Math.abs(x - L.ch) > 34) xs.push(x)
  const chol = new Set([xs[3], xs[xs.length - 3]])
  const cholLow = new Set([xs[6], xs[1]])
  const ions = [0, 1, 2]
  return (
    <Plate w={L.w} h={L.h}>
      {/* water on both sides */}
      <rect x={4} y={L.top - 76} width={L.x1 - L.x0 + 36} height={64} rx={6} className="f89-water" />
      <rect x={4} y={bot + 12} width={L.x1 - L.x0 + 36} height={64} rx={6} className="f89-water" />
      <rect x={4} y={L.top - 76} width={L.x1 - L.x0 + 36} height={64} rx={6} fill={hatch('w')} className="f89-hatch" />
      <rect x={4} y={bot + 12} width={L.x1 - L.x0 + 36} height={64} rx={6} fill={hatch('w')} className="f89-hatch" />
      <text className="f89-lb" x={14} y={L.top - 54}>
        vně buňky (voda)
      </text>
      <text className="f89-lb" x={14} y={bot + 68}>
        cytoplazma (voda)
      </text>

      {/* hydrophobic core */}
      <rect x={L.x0 - 12} y={L.top + 12} width={L.x1 - L.x0 + 24} height={bot - L.top - 24} fill="#e8c35a" opacity={0.12} />

      {xs.map((x, i) => (
        <Pop key={`u${x}`} delay={0.1 + i * 0.04}>
          {chol.has(x) ? <Cholesterol x={x} y={L.top} up /> : <Lipid x={x} y={L.top} up kink={i % 3 === 1} />}
        </Pop>
      ))}
      {xs.map((x, i) => (
        <Pop key={`d${x}`} delay={0.5 + i * 0.04}>
          {cholLow.has(x) ? <Cholesterol x={x} y={bot} up={false} /> : <Lipid x={x} y={bot} up={false} kink={i % 4 === 2} />}
        </Pop>
      ))}

      {/* channel protein with a pore */}
      <Pop delay={1.3}>
        {[-1, 1].map((s) => (
          <g key={s}>
            <path
              d={`M${L.ch + s * 8} ${L.top - 26} C${L.ch + s * 40} ${L.top - 34} ${L.ch + s * 36} ${mid} ${L.ch + s * 34} ${mid} C${L.ch + s * 36} ${mid} ${L.ch + s * 40} ${bot + 34} ${L.ch + s * 8} ${bot + 26} C${L.ch + s * 12} ${mid + 30} ${L.ch + s * 12} ${mid - 30} ${L.ch + s * 8} ${L.top - 26}Z`}
              fill="#6aa7a0"
              stroke="var(--edge)"
              strokeWidth={1.4}
            />
            <path
              d={`M${L.ch + s * 8} ${L.top - 26} C${L.ch + s * 40} ${L.top - 34} ${L.ch + s * 36} ${mid} ${L.ch + s * 34} ${mid} C${L.ch + s * 36} ${mid} ${L.ch + s * 40} ${bot + 34} ${L.ch + s * 8} ${bot + 26} C${L.ch + s * 12} ${mid + 30} ${L.ch + s * 12} ${mid - 30} ${L.ch + s * 8} ${L.top - 26}Z`}
              fill={hatch('s')}
              className="f89-hatch"
            />
          </g>
        ))}
      </Pop>
      <g aria-hidden="true">
        {ions.map((i) => (
          <circle
            key={i}
            className="f89-rise"
            cx={L.ch}
            cy={L.top - 40}
            r={4.5}
            fill="#8a63c9"
            stroke="var(--edge)"
            strokeWidth={0.8}
            style={{ '--rise': `${bot - L.top + 80}px`, '--del': `${i * 1.4}s`, '--dur': '4.2s' } as CSSProperties}
          />
        ))}
      </g>

      {/* labels */}
      <Fade delay={1.8}>
        {n ? (
          <>
            <Lbl x={200} y={L.top - 90} tx={xs[xs.length - 2]} ty={L.top - 9} className="f89-b">
              polární hlavička
            </Lbl>
            <Lbl x={346} y={20} tx={L.ch + 16} ty={L.top - 30} anchor="end" className="f89-b">
              kanálový protein
            </Lbl>
            <Lbl x={130} y={bot + 104} tx={xs[1]} ty={bot + 8} className="f89-b">
              cholesterol
            </Lbl>
            <Lbl x={346} y={bot + 124} tx={xs[xs.length - 2] + 4} ty={mid + 30} anchor="end" className="f89-b">
              nepolární ocasy
            </Lbl>
          </>
        ) : (
          <>
            <Lbl x={452} y={L.top - 2} tx={L.x1 - 2} ty={L.top} className="f89-b">
              polární hlavička
            </Lbl>
            <Lbl x={452} y={L.top + 14} className="f89-sm">
              hydrofilní
            </Lbl>
            <Lbl x={452} y={mid + 4} tx={L.x1 + 4} ty={mid - 16} className="f89-b">
              nepolární ocasy
            </Lbl>
            <Lbl x={452} y={mid + 20} className="f89-sm">
              hydrofobní
            </Lbl>
            <Lbl x={452} y={L.top + 50} tx={xs[xs.length - 3] + 6} ty={L.top + 32} className="f89-b">
              cholesterol
            </Lbl>
            <Lbl x={452} y={32} tx={L.ch + 22} ty={L.top - 26} className="f89-b">
              kanálový protein
            </Lbl>
            <Lbl x={452} y={48} className="f89-sm">
              pór pro ionty
            </Lbl>
          </>
        )}
      </Fade>
    </Plate>
  )
}
