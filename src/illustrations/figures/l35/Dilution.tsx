import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Beaker, ChemText, CurveArrow, Fade, Figure, Note, Pop, T, pat, usePid } from './kit'

const LIQ = 'color-mix(in srgb, var(--lv) 22%, var(--surface))'

function rnd(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Scatter n solute dots inside a box (jittered grid, stable). */
function dots(n: number, x: number, y: number, w: number, h: number, seed: number, inside?: (px: number, py: number) => boolean) {
  const out: [number, number][] = []
  let i = 0
  while (out.length < n && i < n * 40) {
    const px = x + 5 + rnd(seed + i * 1.37) * (w - 10)
    const py = y + 5 + rnd(seed + i * 2.71 + 0.5) * (h - 10)
    i++
    if (inside && !inside(px, py)) continue
    if (out.some(([qx, qy]) => Math.hypot(qx - px, qy - py) < 8)) continue
    out.push([px, py])
  }
  return out
}

function Stock({ x, y }: { x: number; y: number }) {
  const pts = dots(30, x, y + 120 - 72, 104, 72, 3)
  return (
    <g>
      <Beaker x={x} y={y} w={104} h={120} level={72} color={LIQ} opacity={1}>
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={3.2} className="f35-solute" />
        ))}
      </Beaker>
    </g>
  )
}

/** Bulb pipette, tip at (x, tipY). */
function Pipette({ x, top, tipY, level }: { x: number; top: number; tipY: number; level: number }) {
  const p = usePid()
  const bulbY = top + (tipY - top) * 0.5
  const bw = 13
  const tw = 3.5
  const d = `M${x - tw} ${top} V${bulbY - 34} C${x - tw} ${bulbY - 26} ${x - bw} ${bulbY - 22} ${x - bw} ${bulbY - 10} V${bulbY + 10} C${x - bw} ${bulbY + 22} ${x - tw} ${bulbY + 26} ${x - tw} ${bulbY + 34} V${tipY - 8} L${x - 1.2} ${tipY} H${x + 1.2} L${x + tw} ${tipY - 8} V${bulbY + 34} C${x + tw} ${bulbY + 26} ${x + bw} ${bulbY + 22} ${x + bw} ${bulbY + 10} V${bulbY - 10} C${x + bw} ${bulbY - 22} ${x + tw} ${bulbY - 26} ${x + tw} ${bulbY - 34} V${top}`
  const clip = `${p}-pip`
  const lt = tipY - level
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d}Z`} />
        </clipPath>
      </defs>
      <path d={`${d}Z`} className="f35-glass" />
      <g clipPath={`url(#${clip})`}>
        <rect x={x - bw} y={lt} width={bw * 2} height={level + 2} fill={LIQ} />
        <rect x={x - bw} y={lt} width={bw * 2} height={level + 2} fill={pat(p, 'h')} />
        {[
          [-6, bulbY - 4],
          [5, bulbY - 12],
          [-3, bulbY + 10],
          [6, bulbY + 6],
          [0, bulbY - 18],
          [-6, bulbY + 18],
          [5, bulbY + 20],
          [0, bulbY + 2],
        ].map(([dx, py], i) => (py > lt ? <circle key={i} cx={x + dx} cy={py} r={3} className="f35-solute" /> : null))}
      </g>
      <path d={d} className="f35-glass-edge" />
      {/* calibration mark and bulb */}
      <line x1={x - 7} x2={x + 7} y1={top + 26} y2={top + 26} className="f35-line" />
      <rect x={x - 9} y={top - 22} width={18} height={24} rx={8} className="f35-rubber" />
      {/* a drop leaves the tip (loop) */}
      <circle cx={x} cy={tipY + 5} r={2.6} className="f35-drop f35-drip" style={{ ['--drop' as string]: '34px' }} />
    </g>
  )
}

/** Volumetric flask: bulb centre (cx, cy) radius r, neck to top; filled to the mark. */
function VolFlask({ cx, cy, r, top, n }: { cx: number; cy: number; r: number; top: number; n: number }) {
  const p = usePid()
  const nw = 9
  const sy = cy - Math.sqrt(r * r - nw * nw)
  const d = `M${cx - nw} ${top} V${sy} A${r} ${r} 0 1 0 ${cx + nw} ${sy} V${top}`
  const clip = `${p}-vf`
  const mark = top + 30
  const h = cy + r - mark
  const pts = dots(n, cx - r, cy - r + 10, r * 2, r * 2 - 10, 11, (px, py) => Math.hypot(px - cx, py - cy) < r - 6)
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d}Z`} />
        </clipPath>
      </defs>
      <path d={`${d}Z`} className="f35-glass" />
      <g clipPath={`url(#${clip})`}>
        <motion.g variants={{ hidden: { y: h * 0.8 }, show: { y: 0, transition: { delay: 1.2, duration: 1.6, ease: ease.out } } }}>
          <rect x={cx - r} y={mark} width={r * 2} height={h + 4} fill={LIQ} />
          <rect x={cx - r} y={mark} width={r * 2} height={h + 4} fill={pat(p, 'h')} />
          <line x1={cx - r} x2={cx + r} y1={mark} y2={mark} className="f35-surface" />
        </motion.g>
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={3.2} className="f35-solute" />
        ))}
      </g>
      <path d={`M${cx - r * 0.62} ${cy - r * 0.36} A${r * 0.72} ${r * 0.72} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.68}`} className="f35-glass-glint" />
      <path d={d} className="f35-glass-edge" />
      <line x1={cx - nw - 5} x2={cx + nw + 5} y1={mark} y2={mark} className="f35-lvline" />
      <rect x={cx - nw - 2} y={top - 12} width={nw * 2 + 4} height={13} rx={3} className="f35-fill2" />
      <path d={`M${cx - r * 0.7} ${cy + r + 1} H${cx + r * 0.7}`} className="f35-line" />
    </g>
  )
}

function Equation({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <Pop d={2.4}>
      <rect x={x - w / 2} y={y - 24} width={w} height={48} rx={6} className="f35-lvfill" />
      <text x={x} y={y - 3} textAnchor="middle" className="f35-t f35-b" style={{ fontSize: 17 }}>
        <ChemText text="c_{1} · V_{1} = c_{2} · V_{2}" />
      </text>
      <text x={x} y={y + 16} textAnchor="middle" className="f35-mono" style={{ fontSize: 12 }}>
        2,0 · 50 = 0,40 · 250 → n se nemění
      </text>
    </Pop>
  )
}

export default function Dilution() {
  return (
    <Figure
      level={4}
      label="Ředění roztoku: pipetou odměříš 50 cm3 zásobního roztoku o koncentraci 2,0 mol/dm3, převedeš ho do odměrné baňky na 250 cm3 a doplníš vodou po rysku. Počet částic rozpuštěné látky se nemění, jen se rozprostřou do většího objemu, takže nová koncentrace je 0,40 mol/dm3. Platí c1 · V1 = c2 · V2."
      replay
      layouts={[
        {
          w: 560,
          h: 380,
          max: 680,
          when: 'wide',
          draw: () => (
            <>
              <Fade d={0}>
                <Stock x={24} y={150} />
              </Fade>
              <T x={76} y={296} className="f35-note">
                zásobní roztok
              </T>
              <T x={76} y={316} className="f35-mono" size={12.5}>
                <ChemText text="c_{1} = 2,0 mol/dm^{3}" />
              </T>
              <CurveArrow x1={120} y1={140} cx={150} cy={60} x2={186} y2={70} delay={0.5} />
              <Pop d={0.3}>
                <Pipette x={232} top={40} tipY={240} level={150} />
              </Pop>
              <Note x={252} y={128} size={15}>
                pipeta
              </Note>
              <text x={252} y={146} className="f35-mono" style={{ fontSize: 12.5 }}>
                <ChemText text="V_{1} = 50 cm^{3}" />
              </text>
              <CurveArrow x1={250} y1={262} cx={300} cy={300} x2={360} y2={236} delay={1} />
              <Pop d={0.6}>
                <VolFlask cx={430} cy={236} r={60} top={40} n={8} />
              </Pop>
              <Note x={452} y={66} tx={443} ty={70} size={15} className="f35-sec">
                ryska
              </Note>
              <Note x={500} y={120} tx={448} ty={140} size={15} className="f35-sec">
                + voda
              </Note>
              <T x={430} y={320} className="f35-note">
                odměrná baňka
              </T>
              <T x={430} y={338} className="f35-mono" size={12.5}>
                <ChemText text="V_{2} = 250 cm^{3}" />
              </T>
              <T x={430} y={356} className="f35-mono f35-b f35-lvt" size={12.5}>
                <ChemText text="c_{2} = 0,40 mol/dm^{3}" />
              </T>
              <Equation x={196} y={352} w={300} />
            </>
          ),
        },
        {
          w: 340,
          h: 640,
          max: 420,
          when: 'narrow',
          draw: () => (
            <>
              <Fade d={0}>
                <Stock x={20} y={120} />
              </Fade>
              <T x={72} y={266} className="f35-note">
                zásobní roztok
              </T>
              <T x={72} y={284} className="f35-mono" size={12}>
                <ChemText text="c_{1} = 2,0 mol/dm^{3}" />
              </T>
              <CurveArrow x1={118} y1={112} cx={150} cy={40} x2={196} y2={56} delay={0.5} />
              <Pop d={0.3}>
                <Pipette x={236} top={36} tipY={236} level={150} />
              </Pop>
              <Note x={258} y={124} size={15}>
                pipeta
              </Note>
              <text x={258} y={142} className="f35-mono" style={{ fontSize: 12 }}>
                <ChemText text="V_{1} = 50 cm^{3}" />
              </text>
              <CurveArrow x1={236} y1={262} cx={236} cy={300} x2={196} y2={330} delay={1} />
              <Pop d={0.6}>
                <VolFlask cx={150} cy={450} r={58} top={300} n={8} />
              </Pop>
              <T x={262} y={420} anchor="start" className="f35-note">
                odměrná
              </T>
              <T x={262} y={438} anchor="start" className="f35-note">
                baňka
              </T>
              <T x={262} y={458} anchor="start" className="f35-mono" size={12}>
                <ChemText text="V_{2} = 250 cm^{3}" />
              </T>
              <T x={170} y={538} className="f35-mono f35-b f35-lvt" size={13}>
                <ChemText text="c_{2} = 0,40 mol/dm^{3}" />
              </T>
              <Equation x={170} y={596} w={316} />
            </>
          ),
        },
      ]}
    />
  )
}
