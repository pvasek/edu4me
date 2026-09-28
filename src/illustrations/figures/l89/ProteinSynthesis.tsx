import type { ReactNode } from 'react'
import { StepFilm } from '../../sequence/StepFigure'
import { Draw, Fade, Figure, Lbl, Plate, Pop, Slide, useHatch, useNarrow } from './kit'

const LABEL =
  'Proteosyntéza. Transkripce v jádře: RNA-polymeráza rozplete DNA a podle vlákna 3′-TAC CGT AAG-5′ vytvoří mRNA 5′-AUG GCA UUC-3′. mRNA projde pórem jaderného obalu do cytoplazmy. Translace na ribozomu: ribozom čte mRNA po kodonech, tRNA s antikodonem přináší odpovídající aminokyselinu. tRNA s antikodonem CGU nese řetězec Met–Ala, další tRNA s antikodonem AAG přináší fenylalanin ke kodonu UUC a řetězec roste. Kodon AUG je startovní a kóduje methionin.'

const TEMPLATE = 'TACCGTAAG'
const MRNA = 'AUGGCAUUC'
const CODONS = ['AUG', 'GCA', 'UUC', 'GGA', 'UAA']

export default function ProteinSynthesis() {
  return (
    <Figure name="protein-synthesis" level={9} label={LABEL} max={700} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: 'Transkripce v jádře',
            caption: 'RNA-polymeráza rozplete DNA a podle vlákna 3′-TAC CGT AAG-5′ vytvoří mRNA 5′-AUG GCA UUC-3′.',
            art: <Scene step={0} />,
          },
          {
            title: 'mRNA opouští jádro',
            caption: 'mRNA projde pórem jaderného obalu do cytoplazmy a navlékne se na ribozom.',
            art: <Scene step={1} />,
          },
          {
            title: 'Translace na ribozomu',
            caption: 'Ribozom čte mRNA po kodonech, tRNA s antikodonem přináší aminokyselinu a řetězec Met–Ala–Phe roste.',
            art: <Scene step={2} />,
          },
        ]}
      />
    </Figure>
  )
}

/** Fades in on the frame that introduces the part; drawn still on later frames. */
function In({ now, delay = 0, children }: { now: boolean; delay?: number; children: ReactNode }) {
  return now ? <Fade delay={delay}>{children}</Fade> : <g>{children}</g>
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

function Letters({ x, y, s, lv = false, dx = 12, onLight = false }: { x: number; y: number; s: string; lv?: boolean; dx?: number; onLight?: boolean }) {
  return (
    <g>
      {s.split('').map((c, i) => (
        <text key={i} className="f89-f f89-b" x={x + i * dx} y={y} textAnchor="middle" style={{ fontSize: 11.5, fill: onLight ? (lv ? '#8a2f52' : '#1f2a44') : lv ? 'var(--lv-t)' : undefined }}>
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
      <g>
        <text className="f89-lb f89-b" x={30} y={126}>
          DNA
        </text>
        <text className="f89-lb f89-sm" x={176} y={262} textAnchor="middle">
          RNA-polymeráza
        </text>
        <text className="f89-lb f89-b f89-lv" x={150} y={98} textAnchor="middle">
          transkripce
        </text>
      </g>
    </g>
  )
}

function Trna({ x, anti, aa, color, faded }: { x: number; anti: string; aa?: string; color: string; faded?: boolean }) {
  // anticodon sits just above the mRNA line (y 302)
  return (
    <g opacity={faded ? 0.55 : 1}>
      <path d={`M${x - 20} 276 H${x + 20} V292 H${x - 20}Z`} fill="#e7d3a6" stroke="var(--edge)" strokeWidth={1.1} />
      <path d={`M${x - 6} 276 V238 H${x - 18} V224 H${x - 6} V214 H${x + 6} V224 H${x + 18} V238 H${x + 6} V276`} fill="#e7d3a6" stroke="var(--edge)" strokeWidth={1.1} />
      <Letters x={x - 12} y={288} s={anti} onLight />
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

/** Ribosome on the mRNA; the tRNAs and labels come in on the translation frame (step 2). */
function Translation({ narrow, step }: { narrow: boolean; step: number }) {
  const hatch = useHatch()
  const cx = (i: number) => 430 + i * 50
  return (
    <g>
      {/* ribosome: large subunit above, small below the mRNA */}
      <ellipse cx={505} cy={246} rx={98} ry={50} fill="#b9a3c9" opacity={0.55} stroke="var(--edge)" strokeWidth={1.5} />
      <ellipse cx={505} cy={246} rx={98} ry={50} fill={hatch('d')} className="f89-hatch" />
      <ellipse cx={505} cy={322} rx={84} ry={22} fill="#b9a3c9" opacity={0.7} stroke="var(--edge)" strokeWidth={1.5} />
      <rect x={cx(0) - 22} y={305} width={cx(4) - cx(0) + 44} height={18} rx={3} fill="#efe3c8" stroke="var(--edge)" strokeWidth={0.8} />
      {CODONS.map((c, i) => (
        <g key={c}>
          <Letters x={cx(i) - 12} y={318} s={c} lv={i < 3} onLight />
          <line className="f89-thin" x1={cx(i) - 18} y1={306} x2={cx(i) + 18} y2={306} style={{ opacity: 0.5 }} />
        </g>
      ))}
      {step === 2 && (
        <>
          {/* leaving tRNA */}
          <Slide delay={0.5} dx={20} dy={30} dur={0.6}>
            <g transform="translate(-28 -48)">
              <Trna x={430} anti="UAC" color="#c9a86a" faded />
            </g>
          </Slide>
          {/* P site: tRNA carrying the chain Met–Ala */}
          <Pop delay={0.1}>
            <Trna x={cx(1)} anti="CGU" aa="Ala" color="#b98a5a" />
            <line className="f89-bond" x1={cx(1) - 8} y1={186} x2={cx(1) - 20} y2={172} />
            <circle cx={cx(1) - 28} cy={164} r={11} fill="#c9a86a" stroke="var(--edge)" strokeWidth={1.2} />
            <text className="f89-t" x={cx(1) - 28} y={167.5} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 700, fill: '#1f2a44' }}>
              Met
            </text>
          </Pop>
          {/* A site: incoming tRNA with Phe */}
          <Slide delay={0.3} dx={70} dy={-60} dur={0.7}>
            <Trna x={cx(2)} anti="AAG" aa="Phe" color="#9bb56a" />
          </Slide>
          <Draw d={`M${cx(1) + 11} 194 H${cx(2) - 11}`} className="f89-lvstroke" delay={1.0} dur={0.3} style={{ strokeDasharray: '3 3' }} />
        </>
      )}
      {step === 2 && (
        <Fade delay={0.6}>
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
      )}
    </g>
  )
}

/** The whole cell; `step` 0 = transcription, 1 = mRNA leaves the nucleus, 2 = translation. */
function Scene({ step }: { step: number }) {
  const n = useNarrow()
  const nuc = n ? 'translate(20 0)' : ''
  const rib = n ? 'translate(-330 250)' : ''
  // the transcript under the letters, then its way out through a pore into the ribosome (y 302 in ribosome space)
  const transcript = n ? 'M122 214 H236' : 'M102 214 H216'
  const path = n
    ? 'M122 214 H236 C290 214 318 250 322 300 V536 C322 548 318 552 306 552 H14'
    : 'M102 214 H216 C262 214 276 250 300 280 C314 298 330 302 350 302 H660'
  const mrna = { className: 'f89-ln', style: { stroke: 'var(--lv)', strokeWidth: 2.6 } }
  return (
    <Plate w={n ? 340 : 670} h={n ? 640 : 390}>
      <g transform={nuc}>
        {step === 0 ? (
          <Pop delay={0.1}>
            <Transcription />
          </Pop>
        ) : (
          <Transcription />
        )}
        <text className="f89-lb f89-b" x={18} y={42}>
          jádro
        </text>
      </g>
      {step === 0 && <Draw d={transcript} {...mrna} delay={0.5} dur={0.6} />}
      {step === 1 && <Draw d={path} {...mrna} delay={0.1} dur={1.0} />}
      {step === 2 && <path d={path} fill="none" {...mrna} />}
      <g transform={nuc}>
        <In now={step === 0} delay={0.6}>
          <Letters x={102} y={210} s={MRNA} lv />
          <text className="f89-f f89-sm f89-muted" x={90} y={210} textAnchor="end">
            5′
          </text>
        </In>
      </g>
      {step >= 1 && (
        <In now={step === 1} delay={0.6}>
          <text className="f89-lb f89-b f89-lv" x={n ? 240 : 300} y={n ? 356 : 256} textAnchor={n ? 'middle' : 'start'}>
            mRNA
          </text>
          <text className="f89-lb f89-sm" x={n ? 240 : 300} y={n ? 374 : 274} textAnchor={n ? 'middle' : 'start'}>
            pórem ven
          </text>
        </In>
      )}
      {step >= 1 && (
        <g transform={rib}>
          <In now={step === 1} delay={0.5}>
            <Translation narrow={n} step={step} />
          </In>
        </g>
      )}
    </Plate>
  )
}
