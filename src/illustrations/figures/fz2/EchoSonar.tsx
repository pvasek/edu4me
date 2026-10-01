import { Arrow, Fade, Figure, Pop, pat, useClock, useCompact, useFig } from './kit'

const SURF = 76
const BED = 280
const SX = 190 // transducer
const SY = 92
const DUR = 2.1

function arcPath(c: [number, number], r: number, a1: number, a2: number) {
  const p = (a: number) => `${(c[0] + Math.cos((a * Math.PI) / 180) * r).toFixed(1)} ${(c[1] + Math.sin((a * Math.PI) / 180) * r).toFixed(1)}`
  return `M${p(a1)} A${r} ${r} 0 0 1 ${p(a2)}`
}

function Sea() {
  const { id } = useFig()
  const t = useClock(DUR)
  const depth = BED - SY
  const half = DUR * 0.48
  const k = t / half
  const down = t > 0.02 && t < half ? depth * k : -1
  const up = t >= half && t < 2 * half ? depth * (k - 1) : -1
  const done = t >= DUR - 1e-6
  let bed = `M0 ${BED}`
  for (let x = 0; x <= 370; x += 10) bed += ` L${x} ${BED + Math.sin(x / 23) * 4 + Math.cos(x / 9) * 1.5}`
  return (
    <g>
      <rect x={0} y={SURF} width={370} height={BED - SURF + 6} className="fz2-water" />
      <rect x={0} y={SURF} width={370} height={BED - SURF + 6} fill={pat(id, 'h')} opacity={0.35} />
      <path d={`${bed} V312 H0Z`} className="fz2-sand" />
      <path d={`${bed} V312 H0Z`} fill={pat(id, 'dots')} />
      <path d={bed} className="fz2-o" />
      <path d={`M0 ${SURF} ${Array.from({ length: 19 }, (_, i) => `Q${i * 20 + 10} ${SURF - 3} ${i * 20 + 20} ${SURF}`).join(' ')}`} className="fz2-o fz2-thin" />
      {/* ship */}
      <Pop delay={0}>
        <path d={`M110 ${SURF - 18} H270 L252 ${SURF + 12} H128Z`} className="fz2-o fz2-fill2" />
        <path d={`M110 ${SURF - 18} H270 L252 ${SURF + 12} H128Z`} fill={pat(id, 'd')} />
        <rect x={150} y={SURF - 40} width={60} height={22} className="fz2-o fz2-fill" />
        <path d={`M170 ${SURF - 40} V${SURF - 64} M162 ${SURF - 56} H178`} className="fz2-o" />
        <rect x={SX - 9} y={SURF + 10} width={18} height={7} rx={2} className="fz2-o fz2-lvl-f" />
      </Pop>
      <text x={286} y={40} className="fz2-lbl fz2-sm">
        sonar
      </text>
      <line x1={284} y1={42} x2={SX + 10} y2={SURF + 14} className="fz2-lead" />

      {/* travelling pulse */}
      {down > 0 && <path d={arcPath([SX, SY], down, 62, 118)} className="fz2-pulse" />}
      {up > 0 && <path d={arcPath([SX, 2 * BED - SY], depth - up, 242, 298)} className="fz2-pulse fz2-pulse-back" />}

      {done && (
        <g className="fz2-in">
          <Arrow d={`M${SX - 14} ${SY + 6} V${BED - 8}`} tone="lvl" className="fz2-wide" />
          <Arrow d={`M${SX + 14} ${BED - 8} V${SY + 6}`} tone="blue" className="fz2-wide" dashed />
        </g>
      )}
      <Fade delay={0.3}>
        <path d={`M40 ${SURF + 4} V${BED - 4}`} className="fz2-arr fz2-arr-ink" markerEnd={pat(id, 'ah-ink')} markerStart={pat(id, 'ah-ink')} />
        <text x={48} y={(SURF + BED) / 2 + 6} className="fz2-lbl fz2-b fz2-big">
          h
        </text>
        <text x={60} y={BED + 26} className="fz2-lbl fz2-sm">
          mořské dno
        </text>
        <text x={SX - 22} y={170} textAnchor="end" className="fz2-lbl fz2-sm fz2-lvl-t">
          vyslaný
        </text>
        <text x={SX - 22} y={187} textAnchor="end" className="fz2-lbl fz2-sm fz2-lvl-t">
          impulz
        </text>
        <text x={SX + 22} y={250} className="fz2-lbl fz2-sm fz2-blue-t">
          ozvěna
        </text>
        <rect x={250} y={112} width={112} height={104} rx={6} className="fz2-tag" />
        <text x={260} y={134} className="fz2-eq">
          v = 1 500 m/s
        </text>
        <text x={260} y={156} className="fz2-eq">
          t = 0,4 s
        </text>
        <text x={260} y={180} className="fz2-eq fz2-eq-lg">
          h = v · t / 2
        </text>
        <text x={260} y={204} className="fz2-eq fz2-eq-lg fz2-lvl-t">
          h = 300 m
        </text>
      </Fade>
    </g>
  )
}

function Bat({ x, y }: { x: number; y: number }) {
  const d =
    'M0 -4 C4 -10 10 -12 16 -18 C18 -10 24 -8 30 -12 C28 -4 30 2 36 4 C26 4 20 8 14 14 C10 8 4 6 0 10 C-4 6 -10 8 -14 14 C-20 8 -26 4 -36 4 C-30 2 -28 -4 -30 -12 C-24 -8 -18 -10 -16 -18 C-10 -12 -4 -10 0 -4Z'
  return (
    <g transform={`translate(${x} ${y}) scale(0.9)`}>
      <path d={d} className="fz2-bat" />
      <path d="M-3 -6 L-5 -12 L-1 -8 M3 -6 L5 -12 L1 -8" className="fz2-bat" />
    </g>
  )
}

function BatInset() {
  return (
    <g>
      <rect x={0} y={0} width={184} height={176} rx={10} className="fz2-o fz2-fill" />
      <text x={92} y={24} textAnchor="middle" className="fz2-lbl fz2-b">
        netopýr: echolokace
      </text>
      <Bat x={40} y={90} />
      {/* moth */}
      <g transform="translate(150 88)">
        <path d="M0 0 L-12 -12 L-4 0 L-12 12Z M0 0 L12 -12 L4 0 L12 12Z" className="fz2-moth" />
        <path d="M0 -8 V8" className="fz2-o" />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={arcPath([66, 88], 18 + i * 16, -35, 35)} className="fz2-o fz2-soundarc" />
      ))}
      {[0, 1].map((i) => (
        <path key={i} d={arcPath([140, 88], 20 + i * 16, 150, 210)} className="fz2-soundarc fz2-back" />
      ))}
      <text x={92} y={146} textAnchor="middle" className="fz2-lbl fz2-sm">
        ultrazvuk nad 20 kHz,
      </text>
      <text x={92} y={164} textAnchor="middle" className="fz2-lbl fz2-sm">
        ozvěna prozradí kořist
      </text>
    </g>
  )
}

export default function EchoSonar() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={4}
      w={n ? 372 : 580}
      h={n ? 510 : 316}
      max={660}
      replay
      compact={compact}
      boost={false}
      label="Echolot neboli sonar: loď vyšle zvukový impulz ke dnu, ten se ode dna odrazí a vrátí jako ozvěna. Zvuk ve vodě má rychlost asi 1 500 m/s. Pokud se ozvěna vrátí za 0,4 s, zvuk urazil cestu tam i zpět, takže hloubka je h = v · t / 2 = 1 500 · 0,4 / 2 = 300 m. Stejně se orientuje netopýr: vysílá ultrazvuk a z ozvěny pozná, kde je hmyz."
    >
      <Sea />
      <g transform={n ? 'translate(94 326)' : 'translate(388 70)'}>
        <Pop delay={0.6}>
          <BatInset />
        </Pop>
      </g>
    </Figure>
  )
}
