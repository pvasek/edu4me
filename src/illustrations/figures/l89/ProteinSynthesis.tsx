import { Draw, Fade, Figure, Lbl, Plate, Pop, Slide, useHatch, useNarrow } from './kit'

const LABEL =
  'Proteosyntéza. Transkripce v jádře: RNA-polymeráza rozplete DNA a podle vlákna 3′-TAC CGT AAG-5′ vytvoří mRNA 5′-AUG GCA UUC-3′. mRNA projde pórem jaderného obalu do cytoplazmy. Translace na ribozomu: ribozom čte mRNA po kodonech, tRNA s antikodonem přináší odpovídající aminokyselinu. tRNA s antikodonem CGU nese řetězec Met–Ala, další tRNA s antikodonem AAG přináší fenylalanin ke kodonu UUC a řetězec roste. Kodon AUG je startovní a kóduje methionin.'

const TEMPLATE = 'TACCGTAAG'
const MRNA = 'AUGGCAUUC'
const CODONS = ['AUG', 'GCA', 'UUC', 'GGA', 'UAA']

export default function ProteinSynthesis() {
  return (
    <Figure name="protein-synthesis" level={9} label={LABEL} max={700} replay>
      <Scene />
    </Figure>
  )
}

function Nucleus() {
  const hatch = useHatch()
  const pores = [-0.5, 0.35, 1.35, 2.3]
  return (
    <g>
      <ellipse cx={150} cy={170} rx={132} ry={122} fill="color-mix(in srgb, var(--violet) 10%, var(--surface))" stroke="var(--edge)" strokeWidth={1.6} />
      <ellipse cx={150} cy={170} rx={124} ry={114} fill="none" stroke="var(--edge)" strokeWidth={0.9} />
      <ellipse cx={150} cy={170} rx={132} ry={122} fill={hatch('d')} className="f89-hatch" style={{ opacity: 0.35 }} />
      {pores.map((a) => (
        <rect key={a} x={150 + Math.cos(a) * 128 - 5} y={170 + Math.sin(a) * 118 - 5} width={10} height={10} fill="var(--surface)" stroke="var(--edge)" strokeWidth={0.8} transform={`rotate(${(a * 180) / Math.PI} ${150 + Math.cos(a) * 128} ${170 + Math.sin(a) * 118})`} />
      ))}
    </g>
  )
}

function Letters({ x, y, s, lv = false, dx = 12 }: { x: number; y: number; s: string; lv?: boolean; dx?: number }) {
  return (
    <g>
      {s.split('').map((c, i) => (
        <text key={i} className="f89-f f89-b" x={x + i * dx} y={y} textAnchor="middle" style={{ fontSize: 11.5, fill: lv ? 'var(--lv-t)' : undefined }}>
          {c}
        </text>
      ))}
    </g>
  )
}

function Transcription() {
  const x0 = 98
  return (
    <g>
      <Nucleus />
      {/* DNA: closed on both sides, open bubble in the middle */}
      <path className="f89-ln" d={`M36 150 H86 C94 150 96 132 106 132 H200 C212 132 214 150 222 150 H266`} style={{ strokeWidth: 2.4 }} />
      <path className="f89-ln" d={`M36 164 H86 C94 164 96 178 106 178 H200 C212 178 214 164 222 164 H266`} style={{ strokeWidth: 2.4, stroke: 'var(--blue)' }} />
      {[46, 58, 70, 232, 244, 256].map((x) => (
        <line key={x} x1={x} y1={150} x2={x} y2={164} stroke="var(--muted)" strokeWidth={2} />
      ))}
      <Letters x={x0 + 4} y={194} s={TEMPLATE} />
      <text className="f89-f f89-sm f89-muted" x={x0 - 12} y={194} textAnchor="end">
        3′
      </text>
      {/* RNA polymerase */}
      <ellipse cx={206} cy={196} rx={30} ry={24} fill="#8fb8d8" opacity={0.45} stroke="var(--edge)" strokeWidth={1} />
      <Fade delay={0.3}>
        <text className="f89-lb f89-b" x={30} y={126}>
          DNA
        </text>
        <text className="f89-lb f89-sm" x={176} y={262} textAnchor="middle">
          RNA-polymeráza
        </text>
        <text className="f89-lb f89-b f89-lv" x={150} y={98} textAnchor="middle">
          transkripce
        </text>
      </Fade>
    </g>
  )
}

function Trna({ x, anti, aa, color, faded }: { x: number; anti: string; aa?: string; color: string; faded?: boolean }) {
  // anticodon sits just above the mRNA line (y 302)
  return (
    <g opacity={faded ? 0.55 : 1}>
      <path d={`M${x - 20} 276 H${x + 20} V292 H${x - 20}Z`} fill="#e7d3a6" stroke="var(--edge)" strokeWidth={1.1} />
      <path d={`M${x - 6} 276 V238 H${x - 18} V224 H${x - 6} V214 H${x + 6} V224 H${x + 18} V238 H${x + 6} V276`} fill="#e7d3a6" stroke="var(--edge)" strokeWidth={1.1} />
      <Letters x={x - 12} y={288} s={anti} />
      {aa && (
        <g>
          <line className="f89-bond" x1={x} y1={214} x2={x} y2={204} />
          <circle cx={x} cy={194} r={11} fill={color} stroke="var(--edge)" strokeWidth={1.2} />
          <text className="f89-t" x={x} y={197.5} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: '#1f2a44' }}>
            {aa}
          </text>
        </g>
      )}
    </g>
  )
}

function Translation({ narrow }: { narrow: boolean }) {
  const hatch = useHatch()
  const cx = (i: number) => 430 + i * 50
  return (
    <g>
      {/* ribosome: large subunit above, small below the mRNA */}
      <ellipse cx={505} cy={246} rx={98} ry={50} fill="#b9a3c9" opacity={0.55} stroke="var(--edge)" strokeWidth={1.5} />
      <ellipse cx={505} cy={246} rx={98} ry={50} fill={hatch('d')} className="f89-hatch" />
      <ellipse cx={505} cy={322} rx={84} ry={22} fill="#b9a3c9" opacity={0.7} stroke="var(--edge)" strokeWidth={1.5} />
      {CODONS.map((c, i) => (
        <g key={c}>
          <Letters x={cx(i) - 12} y={318} s={c} lv={i < 3} />
          <line className="f89-thin" x1={cx(i) - 18} y1={306} x2={cx(i) + 18} y2={306} style={{ opacity: 0.5 }} />
        </g>
      ))}
      {/* leaving tRNA */}
      <Slide delay={2.6} dx={20} dy={30} dur={0.8}>
        <g transform="translate(-28 -48)">
          <Trna x={430} anti="UAC" color="#c9a86a" faded />
        </g>
      </Slide>
      {/* P site: tRNA carrying the chain Met–Ala */}
      <Pop delay={2.0}>
        <Trna x={cx(1)} anti="CGU" aa="Ala" color="#b98a5a" />
        <line className="f89-bond" x1={cx(1) - 8} y1={186} x2={cx(1) - 20} y2={172} />
        <circle cx={cx(1) - 28} cy={164} r={11} fill="#c9a86a" stroke="var(--edge)" strokeWidth={1.2} />
        <text className="f89-t" x={cx(1) - 28} y={167.5} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: '#1f2a44' }}>
          Met
        </text>
      </Pop>
      {/* A site: incoming tRNA with Phe */}
      <Slide delay={2.8} dx={70} dy={-60} dur={0.9}>
        <Trna x={cx(2)} anti="AAG" aa="Phe" color="#9bb56a" />
      </Slide>
      <Draw d={`M${cx(1) + 11} 194 H${cx(2) - 11}`} className="f89-lvstroke" delay={3.8} dur={0.4} style={{ strokeDasharray: '3 3' }} />
      <Fade delay={3.4}>
        <text className="f89-lb f89-b f89-lv" x={505} y={60} textAnchor="middle">
          translace
        </text>
        <Lbl x={narrow ? 342 : 378} y={narrow ? 118 : 140} tx={narrow ? undefined : cx(1) - 36} ty={narrow ? undefined : 158} className="f89-sm" anchor={narrow ? 'start' : 'end'}>
          rostoucí řetězec
        </Lbl>
        <Lbl x={604} y={214} tx={586} ty={232} className="f89-sm">
          ribozom
        </Lbl>
        <Lbl x={604} y={268} tx={cx(2) + 22} ty={284} className="f89-sm">
          antikodon
        </Lbl>
        <Lbl x={604} y={176} tx={cx(2) + 18} ty={230} className="f89-sm">
          tRNA
        </Lbl>
        <path className="f89-thin" d={`M${cx(2) - 18} 326 v5 h36 v-5`} />
        <text className="f89-lb f89-sm" x={cx(2)} y={348} textAnchor="middle">
          kodon
        </text>
        <text className="f89-f f89-sm f89-muted" x={505} y={372} textAnchor="middle">
          AUG = start (Met) · UAA = stop
        </text>
      </Fade>
    </g>
  )
}

function Scene() {
  const n = useNarrow()
  const nuc = n ? 'translate(20 0)' : ''
  const rib = n ? 'translate(-330 250)' : ''
  // mRNA leaves the nucleus through a pore and threads through the ribosome (y 302 in ribosome space)
  const path = n
    ? 'M122 214 H236 C290 214 318 250 322 300 V536 C322 548 318 552 306 552 H14'
    : 'M102 214 H216 C262 214 276 250 300 280 C314 298 330 302 350 302 H660'
  return (
    <Plate w={n ? 340 : 670} h={n ? 640 : 390}>
      <g transform={nuc}>
        <Pop delay={0.1}>
          <Transcription />
        </Pop>
        <Fade delay={0.2}>
          <text className="f89-lb f89-b" x={18} y={42}>
            jádro
          </text>
        </Fade>
      </g>
      <Draw d={path} className="f89-ln" delay={0.8} dur={1.4} style={{ stroke: 'var(--lv)', strokeWidth: 2.6 }} />
      <g transform={nuc}>
        <Fade delay={0.9}>
          <Letters x={102} y={210} s={MRNA} lv />
          <text className="f89-f f89-sm f89-muted" x={90} y={210} textAnchor="end">
            5′
          </text>
        </Fade>
      </g>
      <Fade delay={1.6}>
        <text className="f89-lb f89-b f89-lv" x={n ? 240 : 300} y={n ? 356 : 256} textAnchor={n ? 'middle' : 'start'}>
          mRNA
        </text>
        <text className="f89-lb f89-sm" x={n ? 240 : 300} y={n ? 374 : 274} textAnchor={n ? 'middle' : 'start'}>
          pórem ven
        </text>
      </Fade>
      <g transform={rib}>
        <Fade delay={1.8}>
          <Translation narrow={n} />
        </Fade>
      </g>
    </Plate>
  )
}
