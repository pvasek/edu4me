import type { ReactNode } from 'react'
import { Arrow, Draw, F, Fade, Figure, headAt, Plate, Pop, useHatch, useNarrow } from './kit'

const LABEL =
  'Buněčné dýchání krok za krokem. 1. Glykolýza probíhá v cytoplazmě: glukóza C6H12O6 se rozloží na 2 pyruváty a vzniknou 2 ATP a 2 NADH. 2. Pyruvát vstoupí do mitochondrie a v matrix se oxidační dekarboxylací mění na acetyl-CoA; uvolní se 2 CO2 a vzniknou 2 NADH. 3. V Krebsově cyklu v matrix se acetylové zbytky ze 2 acetyl-CoA oxidují na 4 CO2 a vznikne 6 NADH, 2 FADH2 a 2 ATP. 4. Dýchací řetězec a ATP-syntáza ve vnitřní membráně mitochondrie (v kristách) předají elektrony z NADH a FADH2 kyslíku, O2 se redukuje na vodu a vznikne asi 26–28 ATP. Celkem asi 30–32 ATP z jedné molekuly glukózy; souhrnně C6H12O6 + 6 O2 → 6 CO2 + 6 H2O.'

const MEM = 'color-mix(in srgb, #c0602c 78%, var(--ink))'
const OUTER = 'color-mix(in srgb, #e0955e 42%, var(--surface))'
const MATRIX = 'color-mix(in srgb, #e0955e 14%, var(--surface))'

export default function CellularRespiration() {
  return (
    <Figure name="cellular-respiration" level={9} label={LABEL} max={720}>
      <Scene />
    </Figure>
  )
}

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="f89-lvfill" stroke="var(--edge)" strokeWidth={1} />
      <text x={x} y={y + 4.2} textAnchor="middle" style={{ font: '700 12px var(--font-body)', fill: 'var(--on-level)' }}>
        {n}
      </text>
    </g>
  )
}

/** Stage title with a numbered badge. */
function Stage({ x, y, n, children, anchor = 'start' }: { x: number; y: number; n: number; children: ReactNode; anchor?: 'start' | 'middle' }) {
  return (
    <g>
      {anchor === 'start' && <Badge x={x + 10} y={y - 5} n={n} />}
      <text className="f89-lb f89-b" x={anchor === 'start' ? x + 26 : x} y={y} textAnchor={anchor}>
        {children}
      </text>
    </g>
  )
}

/** Yield chip (mono, level colour). */
function Chip({ x, y, t, anchor = 'start', muted = false }: { x: number; y: number; t: string; anchor?: 'start' | 'middle' | 'end'; muted?: boolean }) {
  return <F x={x} y={y} t={t} anchor={anchor} className={`f89-f f89-b ${muted ? 'f89-muted' : 'f89-lv'}`} />
}

function Glucose({ x, y }: { x: number; y: number }) {
  const r = 16
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((30 + 60 * i) * Math.PI) / 180
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return (
    <g>
      <polygon points={pts} style={{ fill: 'var(--cat-transition)', stroke: 'var(--edge)', strokeWidth: 1.5 }} />
      <circle cx={x + r * Math.cos(-Math.PI / 6)} cy={y + r * Math.sin(-Math.PI / 6)} r={4} fill="#d9493b" stroke="var(--edge)" strokeWidth={1} />
    </g>
  )
}

/** Engraved mitochondrion: outer membrane, inner membrane folded into cristae along the bottom. */
function Mitochondrion({ x, y, w, h, r, folds, foldH }: { x: number; y: number; w: number; h: number; r: number; folds: number[]; foldH: number }) {
  const hatch = useHatch()
  const g = 11
  const bottom = y + h - g
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} style={{ fill: OUTER, stroke: 'var(--edge)', strokeWidth: 1.7 }} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={hatch('d')} className="f89-hatch" style={{ opacity: 0.6 }} />
      <rect x={x + g} y={y + g} width={w - 2 * g} height={h - 2 * g} rx={r - g} style={{ fill: MATRIX, stroke: MEM, strokeWidth: 1.4 }} />
      {folds.map((fx) => (
        <path
          key={fx}
          d={`M${fx - 7} ${bottom + 0.8} V${bottom - foldH} Q${fx} ${bottom - foldH - 12} ${fx + 7} ${bottom - foldH} V${bottom + 0.8}`}
          style={{ fill: OUTER, stroke: MEM, strokeWidth: 1.3 }}
        />
      ))}
      {/* respiratory-chain complexes and ATP synthase on the cristae */}
      {folds.map((fx, i) => (
        <g key={`c${fx}`}>
          <rect x={fx - 11} y={bottom - foldH * 0.62} width={8} height={11} rx={3} fill="#8a63c9" stroke="var(--edge)" strokeWidth={0.8} />
          {i % 2 === 0 ? (
            <g>
              <line x1={fx + 7} y1={bottom - foldH * 0.35} x2={fx + 15} y2={bottom - foldH * 0.35} stroke="var(--edge)" strokeWidth={1.6} />
              <circle cx={fx + 19} cy={bottom - foldH * 0.35} r={4.5} fill="#e0b43a" stroke="var(--edge)" strokeWidth={0.8} />
            </g>
          ) : (
            <rect x={fx + 3} y={bottom - foldH * 0.4} width={8} height={11} rx={3} fill="#3d6fd1" stroke="var(--edge)" strokeWidth={0.8} />
          )}
        </g>
      ))}
    </g>
  )
}

function Krebs({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) {
  const heads = [20, 140, 260].map((deg) => {
    const a = (deg * Math.PI) / 180
    const px = x + r * Math.cos(a)
    const py = y + r * Math.sin(a)
    return headAt(px, py, px + Math.sin(a) * 10, py - Math.cos(a) * 10, 11)
  })
  return (
    <g>
      <circle cx={x} cy={y} r={r} style={{ fill: 'color-mix(in srgb, var(--lv) 10%, transparent)' }} />
      <Draw d={`M${x + r} ${y} A${r} ${r} 0 1 1 ${x + r - 0.01} ${y - 0.5}`} className="f89-lvstroke" delay={delay} dur={0.6} style={{ strokeWidth: 2.6 }} />
      <Fade delay={delay + 0.5}>
        {heads.map((h) => (
          <polygon key={h} points={h} className="f89-lvfill" />
        ))}
        <text className="f89-lb f89-b" x={x} y={y - 2} textAnchor="middle" style={{ fontSize: 15 }}>
          Krebsův
        </text>
        <text className="f89-lb f89-b" x={x} y={y + 15} textAnchor="middle" style={{ fontSize: 15 }}>
          cyklus
        </text>
      </Fade>
    </g>
  )
}

/** Summary: ATP yield per glucose as a stacked bar. */
function Total({ x, y, w, narrow }: { x: number; y: number; w: number; narrow: boolean }) {
  const hatch = useHatch()
  const u = w / 32
  const segs = [
    { n: 2, t: '2', c: 'var(--cat-transition)', name: 'glykolýza' },
    { n: 2, t: '2', c: 'var(--cat-halogen)', name: 'Krebsův c.' },
    { n: 26, t: '26–28', c: 'var(--lv)', name: 'dýchací řetězec' },
  ]
  let cx = x
  return (
    <g>
      <text className="f89-lb f89-b" x={x} y={y}>
        Celkem z 1 glukózy ≈ 30–32 ATP
      </text>
      {segs.map((s, i) => {
        const x0 = cx
        cx += s.n * u
        return (
          <g key={s.name}>
            <rect x={x0} y={y + 10} width={s.n * u} height={22} style={{ fill: s.c, stroke: 'var(--edge)', strokeWidth: 1.2 }} />
            <text className="f89-f f89-b" x={x0 + (s.n * u) / 2} y={y + 26} textAnchor="middle" style={{ fill: i === 2 ? 'var(--on-level)' : '#1f2a44', fontSize: 12 }}>
              {s.t}
            </text>
            {i !== 1 && (
              <text className="f89-lb f89-sm" x={i === 0 ? x0 : x0 + (s.n * u) / 2 + (narrow ? 20 : 0)} y={y + 48} textAnchor={i === 0 ? 'start' : 'middle'}>
                {i === 0 ? (narrow ? 'glykolýza + Krebs' : 'glykolýza + Krebsův cyklus') : s.name}
              </text>
            )}
          </g>
        )
      })}
      {/* the range 26–28 */}
      <rect x={cx} y={y + 10} width={2 * u} height={22} fill={hatch('lv')} stroke="var(--edge)" strokeWidth={1} strokeDasharray="3 2" />
    </g>
  )
}

function Scene() {
  return useNarrow() ? <Narrow /> : <Wide />
}

function Wide() {
  const m = { x: 272, y: 72, w: 412, h: 284, r: 100 }
  const kr = { x: 486, y: 190, r: 40 }
  return (
    <Plate w={700} h={520}>
      {/* cell */}
      <Fade delay={0}>
        <rect x={6} y={8} width={688} height={404} rx={26} style={{ fill: 'color-mix(in srgb, var(--green) 6%, transparent)', stroke: 'var(--edge)', strokeWidth: 1.3 }} />
        <rect x={10} y={12} width={680} height={396} rx={23} className="f89-thin" style={{ opacity: 0.5 }} />
        <text className="f89-lb f89-lv" x={26} y={36}>
          cytoplazma
        </text>
      </Fade>

      {/* 1 glycolysis */}
      <Pop delay={0.1}>
        <Glucose x={100} y={74} />
        <text className="f89-lb f89-b" x={126} y={72}>
          glukóza
        </text>
        <F x={126} y={90} t="C_{6}H_{12}O_{6}" anchor="start" className="f89-f f89-sm" />
      </Pop>
      <Fade delay={0.3}>
        <Arrow x1={100} y1={98} x2={100} y2={196} className="f89-arr f89-arr-lv" />
        <Stage x={108} y={134} n={1}>
          glykolýza
        </Stage>
        <Chip x={134} y={154} t="+ 2 ATP" />
        <Chip x={134} y={172} t="+ 2 NADH" />
      </Fade>
      <Pop delay={0.45}>
        <text className="f89-lb f89-b" x={100} y={220} textAnchor="middle">
          2 pyruvát
        </text>
        <F x={100} y={237} t="2 × C_{3}" className="f89-f f89-sm f89-muted" />
      </Pop>

      {/* mitochondrion */}
      <Fade delay={0.5}>
        <Mitochondrion {...m} folds={[424, 470, 516, 562]} foldH={50} />
        <text className="f89-lb f89-b" x={684} y={58} textAnchor="end">
          mitochondrie
        </text>
        <text className="f89-lb f89-sm f89-muted" x={620} y={250} textAnchor="middle">
          matrix
        </text>
        <text className="f89-lb f89-sm f89-muted f89-sec" x={640} y={312} textAnchor="middle">
          kristy
        </text>
      </Fade>

      {/* 2 oxidative decarboxylation */}
      <Fade delay={0.7}>
        <Arrow x1={140} y1={214} x2={306} y2={214} className="f89-arr f89-arr-lv" />
        <Stage x={292} y={120} n={2}>
          oxidační
        </Stage>
        <text className="f89-lb f89-b" x={318} y={138}>
          dekarboxylace
        </text>
        <text className="f89-lb f89-b" x={312} y={219}>
          acetyl-CoA
        </text>
        <Chip x={312} y={240} t="+ 2 NADH" />
        <Arrow x1={344} y1={200} x2={344} y2={156} className="f89-arr f89-arr-soft" dashed />
        <Chip x={352} y={176} t="2 CO_{2}" muted />
        <Arrow x1={392} y1={214} x2={kr.x - kr.r - 4} y2={200} className="f89-arr f89-arr-lv" />
      </Fade>

      {/* 3 Krebs cycle */}
      <Krebs {...kr} delay={0.9} />
      <Fade delay={1.2}>
        <Badge x={kr.x} y={kr.y - kr.r - 16} n={3} />
        <Arrow x1={kr.x + 22} y1={kr.y - kr.r + 4} x2={kr.x + 40} y2={m.y - 20} className="f89-arr f89-arr-soft" dashed />
        <Chip x={kr.x + 46} y={m.y - 14} t="4 CO_{2}" muted />
        <Chip x={kr.x + kr.r + 16} y={kr.y - 16} t="+ 6 NADH" />
        <Chip x={kr.x + kr.r + 16} y={kr.y + 2} t="+ 2 FADH_{2}" />
        <Chip x={kr.x + kr.r + 16} y={kr.y + 20} t="+ 2 ATP" />
        {/* NADH, FADH2 carry electrons down to the chain */}
        <Arrow x1={kr.x + kr.r + 40} y1={kr.y + 28} x2={560} y2={268} className="f89-arr f89-arr-soft" dashed />
        <text className="f89-lb f89-sm" x={600} y={284} textAnchor="middle">
          e⁻
        </text>
      </Fade>

      {/* 4 respiratory chain */}
      <Fade delay={1.4}>
        <Stage x={284} y={380} n={4}>
          dýchací řetězec + ATP-syntáza
        </Stage>
        <text className="f89-lb f89-sm" x={310} y={398}>
          ve vnitřní membráně (kristy)
        </text>
        <F x={318} y={298} t="O_{2} → H_{2}O" anchor="start" className="f89-f f89-b" />
        <Chip x={318} y={320} t="≈ 26–28 ATP" />
        <line className="f89-lead" x1={520} y1={372} x2={520} y2={344} />
      </Fade>

      {/* total */}
      <Fade delay={1.6}>
        <Total x={24} y={446} w={652} narrow={false} />
        <F x={676} y={446} t="C_{6}H_{12}O_{6} + 6 O_{2} → 6 CO_{2} + 6 H_{2}O" anchor="end" className="f89-f f89-sm" />
      </Fade>
    </Plate>
  )
}

function Narrow() {
  const m = { x: 12, y: 206, w: 316, h: 380, r: 90 }
  const kr = { x: 96, y: 372, r: 40 }
  return (
    <Plate w={340} h={724}>
      <Fade delay={0}>
        <rect x={4} y={6} width={332} height={594} rx={22} style={{ fill: 'color-mix(in srgb, var(--green) 6%, transparent)', stroke: 'var(--edge)', strokeWidth: 1.3 }} />
        <text className="f89-lb f89-lv" x={326} y={30} textAnchor="end">
          cytoplazma
        </text>
      </Fade>
      <Pop delay={0.1}>
        <Glucose x={40} y={44} />
        <text className="f89-lb f89-b" x={64} y={42}>
          glukóza
        </text>
        <F x={64} y={60} t="C_{6}H_{12}O_{6}" anchor="start" className="f89-f f89-sm" />
      </Pop>
      <Fade delay={0.3}>
        <Arrow x1={40} y1={68} x2={40} y2={140} className="f89-arr f89-arr-lv" />
        <Stage x={50} y={98} n={1}>
          glykolýza
        </Stage>
        <Chip x={76} y={118} t="+ 2 ATP  + 2 NADH" />
      </Fade>
      <Pop delay={0.45}>
        <text className="f89-lb f89-b" x={22} y={162}>
          2 pyruvát
        </text>
      </Pop>
      <Fade delay={0.5}>
        <Mitochondrion {...m} folds={[128, 170, 212]} foldH={40} />
        <text className="f89-lb f89-b" x={326} y={194} textAnchor="end">
          mitochondrie
        </text>
      </Fade>
      <Fade delay={0.7}>
        <Arrow x1={40} y1={172} x2={40} y2={250} className="f89-arr f89-arr-lv" />
        <Stage x={50} y={244} n={2}>
          oxidační dekarboxylace
        </Stage>
        <text className="f89-lb f89-b" x={76} y={266}>
          → acetyl-CoA
        </text>
        <Chip x={76} y={288} t="+ 2 NADH" />
        <Chip x={170} y={288} t="2 CO_{2}↑" muted />
        <Arrow x1={70} y1={296} x2={kr.x - 14} y2={kr.y - kr.r - 2} className="f89-arr f89-arr-lv" />
      </Fade>
      <Krebs {...kr} delay={0.9} />
      <Fade delay={1.2}>
        <Badge x={kr.x - kr.r - 6} y={kr.y - kr.r + 2} n={3} />
        <Chip x={160} y={342} t="4 CO_{2}↑" muted />
        <Chip x={160} y={362} t="+ 6 NADH" />
        <Chip x={160} y={382} t="+ 2 FADH_{2}" />
        <Chip x={160} y={402} t="+ 2 ATP" />
        <Arrow x1={170} y1={412} x2={170} y2={446} className="f89-arr f89-arr-soft" dashed />
        <text className="f89-lb f89-sm" x={180} y={436}>
          e⁻
        </text>
      </Fade>
      <Fade delay={1.4}>
        <Stage x={40} y={464} n={4}>
          dýchací řetězec
        </Stage>
        <text className="f89-lb f89-b" x={66} y={482}>
          + ATP-syntáza
        </text>
        <F x={66} y={506} t="O_{2} → H_{2}O" anchor="start" className="f89-f f89-b" />
        <Chip x={196} y={506} t="≈ 26–28 ATP" />
      </Fade>
      <Fade delay={1.6}>
        <Total x={16} y={634} w={308} narrow />
        <F x={170} y={710} t="C_{6}H_{12}O_{6} + 6 O_{2} → 6 CO_{2} + 6 H_{2}O" className="f89-f f89-sm" />
      </Fade>
    </Plate>
  )
}
