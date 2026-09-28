import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { StepFilm } from '../../sequence/StepFigure'
import { Beaker, ChemText, CurveArrow, Fade, Figure, Frame, Note, Pop, T, pat, usePid } from './kit'

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

function Stock({ x, y, level }: { x: number; y: number; level: number }) {
  const pts = dots(Math.round((30 * level) / 72), x, y + 120 - level, 104, level, 3)
  return (
    <g>
      <Beaker x={x} y={y} w={104} h={120} level={level} color={LIQ} opacity={1}>
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={3.2} className="f35-solute" />
        ))}
      </Beaker>
    </g>
  )
}

/** Bulb pipette, tip at (x, tipY); `level` = liquid height above the tip. */
function Pipette({ x, top, tipY, level, drip = false }: { x: number; top: number; tipY: number; level: number; drip?: boolean }) {
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
      {drip && <circle cx={x} cy={tipY + 5} r={2.6} className="f35-drop f35-drip" style={{ ['--drop' as string]: '34px' }} />}
    </g>
  )
}

/**
 * Volumetric flask: bulb centre (cx, cy) radius r, neck to top.
 * fill 0 = empty, 1 = the pipetted 50 cm³ at the bottom, 2 = topped up with water to the mark.
 */
function VolFlask({ cx, cy, r, top, fill }: { cx: number; cy: number; r: number; top: number; fill: 0 | 1 | 2 }) {
  const p = usePid()
  const nw = 9
  const sy = cy - Math.sqrt(r * r - nw * nw)
  const d = `M${cx - nw} ${top} V${sy} A${r} ${r} 0 1 0 ${cx + nw} ${sy} V${top}`
  const clip = `${p}-vf`
  const mark = top + 30
  const low = cy + r - 34
  const surf = fill === 2 ? mark : low
  const h = cy + r - surf
  const inBulb = (px: number, py: number) => Math.hypot(px - cx, py - cy) < r - 6
  const pts =
    fill === 2
      ? dots(8, cx - r, cy - r + 10, r * 2, r * 2 - 10, 11, inBulb)
      : dots(8, cx - r, low, r * 2, 34, 5, (px, py) => inBulb(px, py) && py > low + 4)
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${d}Z`} />
        </clipPath>
      </defs>
      <path d={`${d}Z`} className="f35-glass" />
      {fill > 0 && (
        <g clipPath={`url(#${clip})`}>
          <motion.g
            variants={{
              hidden: { y: fill === 2 ? cy + r - 34 - mark : 34 },
              show: { y: 0, transition: { delay: 0.2, duration: 0.9, ease: ease.out } },
            }}
          >
            <rect x={cx - r} y={surf} width={r * 2} height={h + 4} fill={LIQ} />
            <rect x={cx - r} y={surf} width={r * 2} height={h + 4} fill={pat(p, 'h')} />
            <line x1={cx - r} x2={cx + r} y1={surf} y2={surf} className="f35-surface" />
          </motion.g>
          <Fade d={fill === 2 ? 0.6 : 0.5}>
            {pts.map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r={3.2} className="f35-solute" />
            ))}
          </Fade>
        </g>
      )}
      <path d={`M${cx - r * 0.62} ${cy - r * 0.36} A${r * 0.72} ${r * 0.72} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.68}`} className="f35-glass-glint" />
      <path d={d} className="f35-glass-edge" />
      <line x1={cx - nw - 5} x2={cx + nw + 5} y1={mark} y2={mark} className="f35-lvline" />
      {fill === 2 && <rect x={cx - nw - 2} y={top - 12} width={nw * 2 + 4} height={13} rx={3} className="f35-fill2" />}
      <path d={`M${cx - r * 0.7} ${cy + r + 1} H${cx + r * 0.7}`} className="f35-line" />
    </g>
  )
}

function Equation({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <Pop d={0.8}>
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

const LABEL =
  'Ředění roztoku: pipetou odměříš 50 cm3 zásobního roztoku o koncentraci 2,0 mol/dm3, převedeš ho do odměrné baňky na 250 cm3 a doplníš vodou po rysku. Počet částic rozpuštěné látky se nemění, jen se rozprostřou do většího objemu, takže nová koncentrace je 0,40 mol/dm3. Platí c1 · V1 = c2 · V2.'

// one scene for all three steps: stock beaker on the left, volumetric flask on the right
const BK = { x: 20, y: 190 }
const FL = { cx: 268, cy: 330, r: 56, top: 180 }

function Scene({ step }: { step: 1 | 2 | 3 }) {
  return (
    <Frame
      layouts={[
        {
          w: 360,
          h: 460,
          max: 460,
          draw: () => (
            <>
              <Stock x={BK.x} y={BK.y} level={step === 1 ? 72 : 58} />
              <T x={72} y={334} className="f35-note">
                zásobní roztok
              </T>
              <T x={72} y={352} className="f35-mono" size={12.5}>
                <ChemText text="c_{1} = 2,0 mol/dm^{3}" />
              </T>

              <VolFlask cx={FL.cx} cy={FL.cy} r={FL.r} top={FL.top} fill={step === 1 ? 0 : step === 2 ? 1 : 2} />
              <Note x={FL.cx + 26} y={FL.top + 22} tx={FL.cx + 14} ty={FL.top + 30} size={15}>
                ryska
              </Note>
              <T x={FL.cx} y={406} className="f35-note">
                odměrná baňka
              </T>
              <T x={FL.cx} y={424} className="f35-mono" size={12.5}>
                <ChemText text="V_{2} = 250 cm^{3}" />
              </T>

              {step === 1 && (
                <>
                  <Pop d={0.1}>
                    <Pipette x={72} top={110} tipY={290} level={150} />
                  </Pop>
                  <Fade d={0.4}>
                    <Note x={96} y={124} size={15}>
                      pipeta
                    </Note>
                    <text x={96} y={142} className="f35-mono" style={{ fontSize: 12.5 }}>
                      <ChemText text="V_{1} = 50 cm^{3}" />
                    </text>
                  </Fade>
                </>
              )}
              {step === 2 && (
                <>
                  <CurveArrow x1={110} y1={176} cx={140} cy={60} x2={246} y2={52} delay={0.1} />
                  <Pop d={0.2}>
                    <Pipette x={FL.cx} top={34} tipY={214} level={26} drip />
                  </Pop>
                  <Fade d={0.4}>
                    <Note x={FL.cx - 22} y={96} anchor="end" size={15}>
                      pipeta
                    </Note>
                    <text x={FL.cx - 22} y={114} textAnchor="end" className="f35-mono" style={{ fontSize: 12.5 }}>
                      <ChemText text="V_{1} = 50 cm^{3}" />
                    </text>
                  </Fade>
                </>
              )}
              {step === 3 && (
                <>
                  <Equation x={180} y={52} w={316} />
                  <Fade d={0.1}>
                    <Note x={FL.cx + 30} y={FL.top - 48} size={15}>
                      + voda
                    </Note>
                    <CurveArrow x1={FL.cx + 34} y1={FL.top - 40} cx={FL.cx + 20} cy={FL.top - 30} x2={FL.cx + 4} y2={FL.top - 16} delay={0.1} />
                  </Fade>
                  <Fade d={0.9}>
                    <T x={FL.cx} y={444} className="f35-mono f35-b f35-lvt" size={13}>
                      <ChemText text="c_{2} = 0,40 mol/dm^{3}" />
                    </T>
                  </Fade>
                </>
              )}
            </>
          ),
        },
      ]}
    />
  )
}

export default function Dilution() {
  return (
    <Figure level={4} label={LABEL} max={460} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          { title: 'Odměř pipetou', caption: 'Pipetou odebereš ze zásobního roztoku přesně 50 cm³.', art: <Scene step={1} /> },
          { title: 'Převeď do baňky', caption: 'Roztok z pipety vypustíš do odměrné baňky na 250 cm³.', art: <Scene step={2} /> },
          {
            title: 'Doplň vodou po rysku',
            caption: 'Částic je pořád stejně, jen se rozprostřou do pětkrát většího objemu: koncentrace klesne na 0,40 mol/dm³.',
            art: <Scene step={3} />,
          },
        ]}
      />
    </Figure>
  )
}
