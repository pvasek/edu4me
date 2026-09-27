import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Atom, ChemText, Fade, Figure, T, pat, usePid } from './kit'

const MAX = 3.3

/** Electron cloud outline + hatch. */
function Cloud({ d }: { d: string }) {
  const p = usePid()
  return (
    <g>
      <path d={d} className="f35-cloud" />
      <path d={d} fill={pat(p, 'd')} opacity={0.7} />
      <path d={d} className="f35-cloud-edge" />
    </g>
  )
}

function H2() {
  return (
    <g>
      <Cloud d="M-34 0 C-34 -24 34 -24 34 0 C34 24 -34 24 -34 0Z" />
      <Atom x={-11} y={0} r={11} el="H" />
      <Atom x={11} y={0} r={11} el="H" />
    </g>
  )
}
function HCl() {
  return (
    <g>
      <Cloud d="M-30 0 C-30 -16 -10 -24 14 -26 C40 -28 44 -12 44 0 C44 12 40 28 14 26 C-10 24 -30 16 -30 0Z" />
      <Atom x={-14} y={0} r={10} el="H" />
      <Atom x={16} y={0} r={17} el="Cl" />
      <text x={-16} y={-24} className="f35-delta f35-dpos" textAnchor="middle" style={{ fontSize: 15 }}>
        δ+
      </text>
      <text x={24} y={-31} className="f35-delta f35-dneg" textAnchor="middle" style={{ fontSize: 15 }}>
        δ−
      </text>
    </g>
  )
}
function NaCl() {
  return (
    <g>
      <circle cx={-24} cy={0} r={15} className="f35-cloud" />
      <circle cx={-24} cy={0} r={15} className="f35-cloud-edge" />
      <circle cx={17} cy={0} r={26} className="f35-cloud" />
      <circle cx={17} cy={0} r={26} className="f35-cloud-edge" />
      <Atom x={-24} y={0} r={11} el="Na" charge="+" />
      <Atom x={17} y={0} r={19} el="Cl" charge="−" />
    </g>
  )
}

function Scale({ W }: { W: number }) {
  const p = usePid()
  const x0 = 24
  const x1 = W - 24
  const X = (v: number) => x0 + (v / MAX) * (x1 - x0)
  const by = 156
  const bh = 22
  const ex = [
    { v: 0, name: 'H_{2}', dx: 'ΔX = 0', art: <H2 />, cx: Math.max(X(0) + 36, 58) },
    { v: 0.96, name: 'HCl', dx: 'ΔX = 0,96', art: <HCl />, cx: X(0.96) + (W < 420 ? 30 : 12) },
    { v: 2.23, name: 'NaCl', dx: 'ΔX = 2,23', art: <NaCl />, cx: X(2.23) + (W < 420 ? 34 : 18) },
  ]
  const narrow = W < 420
  return (
    <>
      <T x={x0} y={24} anchor="start" className="f35-title">
        rozdíl elektronegativit ΔX
      </T>
      {/* the bar: three hatched segments */}
      <rect x={X(0)} y={by} width={X(0.4) - X(0)} height={bh} className="f35-seg1" />
      <rect x={X(0.4)} y={by} width={X(1.7) - X(0.4)} height={bh} className="f35-seg2" />
      <rect x={X(0.4)} y={by} width={X(1.7) - X(0.4)} height={bh} fill={pat(p, 'd')} />
      <rect x={X(1.7)} y={by} width={X(MAX) - X(1.7)} height={bh} className="f35-seg3" />
      <rect x={X(1.7)} y={by} width={X(MAX) - X(1.7)} height={bh} fill={pat(p, 'x')} />
      <rect x={x0} y={by} width={x1 - x0} height={bh} className="f35-line" />
      <motion.rect
        x={x0}
        y={by - 3}
        height={bh + 6}
        width={x1 - x0}
        className="f35-wipe"
        style={{ originX: 1, transformBox: 'fill-box' }}
        variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0, transition: { duration: 1.1, ease: ease.inOut } } }}
      />
      {[0, 0.4, 1.7, MAX].map((v) => (
        <g key={v}>
          <line x1={X(v)} x2={X(v)} y1={by - 4} y2={by + bh + 6} className="f35-line" />
          <T x={X(v)} y={by + bh + 20} className="f35-mono f35-b">
            {String(v).replace('.', ',')}
          </T>
        </g>
      ))}
      {[1, 2, 3].map((v) => (
        <line key={v} x1={X(v)} x2={X(v)} y1={by + bh} y2={by + bh + 4} className="f35-thin" />
      ))}
      {/* region names */}
      <Fade d={0.8}>
        <T x={(X(0) + X(0.4)) / 2 + (narrow ? 8 : 4)} y={by + bh + 44} className="f35-note">
          nepolární
        </T>
        <T x={(X(0) + X(0.4)) / 2 + (narrow ? 8 : 4)} y={by + bh + 61} className="f35-note">
          kovalentní
        </T>
        <T x={(X(0.4) + X(1.7)) / 2} y={by + bh + 44} className="f35-note">
          polární
        </T>
        <T x={(X(0.4) + X(1.7)) / 2} y={by + bh + 61} className="f35-note">
          kovalentní
        </T>
        <T x={(X(1.7) + X(MAX)) / 2} y={by + bh + 44} className="f35-note">
          iontová
        </T>
        <T x={(X(1.7) + X(MAX)) / 2} y={by + bh + 61} className="f35-t f35-small f35-muted">
          vznikají ionty
        </T>
      </Fade>
      {/* examples slide from 0 to their ΔX */}
      {ex.map((e, i) => (
        <motion.g
          key={e.name}
          variants={{
            hidden: { x: x0 - X(e.v), opacity: 0 },
            show: { x: 0, opacity: 1, transition: { delay: 0.5 + i * 0.25, duration: 1.2, ease: ease.out } },
          }}
        >
          <g transform={`translate(${e.cx} 76)`}>{e.art}</g>
          <T x={e.cx} y={126} className="f35-t f35-b">
            <ChemText text={e.name} />
          </T>
          <T x={e.cx} y={143} className="f35-mono f35-muted" size={11.5}>
            {e.dx}
          </T>
          <path d={`M${X(e.v)} ${by - 1} l-5 -9 h10z`} className="f35-pointer" />
        </motion.g>
      ))}
    </>
  )
}

export default function BondTypeScale() {
  return (
    <Figure
      level={3}
      label="Stupnice rozdílu elektronegativit ΔX od 0 do 3,3: pod 0,4 nepolární kovalentní vazba (H2, ΔX = 0), od 0,4 do 1,7 polární kovalentní vazba (HCl, ΔX = 0,96), od 1,7 iontová vazba (NaCl, ΔX = 2,23). S rostoucím ΔX se elektronový oblak posouvá k elektronegativnějšímu atomu, až vzniknou ionty."
      layouts={[
        { w: 500, h: 250, max: 660, when: 'wide', draw: () => <Scale W={500} /> },
        { w: 380, h: 250, max: 460, when: 'narrow', draw: () => <Scale W={380} /> },
      ]}
    />
  )
}
