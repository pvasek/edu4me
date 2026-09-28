import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Atom, ChemText, Fade, Figure, Mol, Plate, Pop, Slide, useNarrow } from './kit'

const LABEL =
  'Dva typy polymerace. Adiční polymerace: mnoho molekul monomeru ethenu CH2=CH2 se spojí, dvojné vazby C=C se otevřou a vznikne dlouhý řetězec poly(ethenu). Opakující se jednotka je [–CH2–CH2–]n a nic se přitom neodštěpí. Kondenzační polymerace: dikarboxylová kyselina (kyselina tereftalová HOOC–C6H4–COOH) a diol (ethan-1,2-diol HO–CH2–CH2–OH) se spojují esterovými vazbami –CO–O–; při vzniku každé vazby se odštěpí malá molekula vody. Tak vzniká polyester PET.'

export default function PolymerizationTypes() {
  return (
    <Figure name="polymerization-types" level={8} label={LABEL} max={680}>
      {/* one method per row: each plate uses the whole width */}
      <StepStrip
        min={600}
        steps={[
          { title: 'Adiční polymerace', art: <Addition /> },
          { title: 'Kondenzační polymerace', art: <Condensation /> },
        ]}
      />
    </Figure>
  )
}

// ------------------------------------------------------------------ addition

function Ethene({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* halo on the double bond that opens */}
      <ellipse cx={x} cy={y} rx={24} ry={13} style={{ fill: 'color-mix(in srgb, var(--lv) 24%, transparent)' }} />
      <Mol atoms={[['C', x - 13, y], ['C', x + 13, y]]} bonds={[[0, 1, 2]]} hLen={15} />
    </g>
  )
}

function Addition() {
  const n = useNarrow()
  const L = n
    ? { w: 340, h: 330, mono: [48, 124, 200, 276], my: 62, arr: [170, 136, 170, 176], cy: 236, c0: 42, nC: 9, dc: 32 }
    : { w: 620, h: 180, mono: [40, 108, 176], my: 80, arr: [222, 80, 290, 80], cy: 80, c0: 322, nC: 8, dc: 34 }
  const cs = Array.from({ length: L.nC }, (_, i) => L.c0 + i * L.dc)
  const [ax1, ay1, ax2, ay2] = L.arr
  const vertical = ax1 === ax2
  const mid = (L.mono[0] + L.mono[L.mono.length - 1]) / 2
  const cy = L.cy
  const unitX = (cs[2] + cs[3]) / 2
  return (
    <Plate w={L.w} h={L.h}>
      <Fade delay={0.05} dur={0.3}>
        <text className="f89-lb f89-lv" x={mid} y={L.my - 42} textAnchor="middle">
          monomery
        </text>
      </Fade>
      {L.mono.map((x, i) => (
        <Pop key={x} delay={0.05 + i * 0.04}>
          <Ethene x={x} y={L.my} />
        </Pop>
      ))}
      <Fade delay={0.15} dur={0.3}>
        <text className="f89-f" x={mid} y={L.my + 44} textAnchor="middle">
          <ChemText text="n CH_{2}=CH_{2}" />
        </text>
        <text className="f89-lb f89-sm" x={mid} y={L.my + 62} textAnchor="middle">
          ethen
        </text>
      </Fade>
      <Fade delay={0.15} dur={0.3}>
        <Arrow x1={ax1} y1={ay1} x2={ax2} y2={ay2} className="f89-arr f89-arr-lv" />
        <text className="f89-lb f89-lv f89-sm" x={vertical ? ax1 + 14 : (ax1 + ax2) / 2} y={vertical ? ay1 + 14 : ay1 - 12} textAnchor={vertical ? 'start' : 'middle'}>
          C=C se otevře
        </text>
        <text className="f89-lb f89-sm" x={vertical ? ax1 + 14 : (ax1 + ax2) / 2} y={vertical ? ay1 + 32 : ay1 + 22} textAnchor={vertical ? 'start' : 'middle'}>
          nic se neodštěpí
        </text>
      </Fade>
      <Fade delay={0.2} dur={0.3}>
        <line className="f89-guide" x1={cs[0] - 24} y1={cy} x2={cs[0]} y2={cy} />
        <line className="f89-guide" x1={cs[L.nC - 1]} y1={cy} x2={cs[L.nC - 1] + 24} y2={cy} />
      </Fade>
      {cs.map((x, i) => (
        <Pop key={x} delay={0.15 + i * 0.03}>
          {i < L.nC - 1 && <line className="f89-bond" x1={x} y1={cy} x2={cs[i + 1]} y2={cy} />}
          <line className="f89-bond" x1={x} y1={cy} x2={x} y2={cy - 17} />
          <line className="f89-bond" x1={x} y1={cy} x2={x} y2={cy + 17} />
          <Atom x={x} y={cy - 17} el="H" r={5.2} />
          <Atom x={x} y={cy + 17} el="H" r={5.2} />
          <Atom x={x} y={cy} el="C" r={8.5} />
        </Pop>
      ))}
      <Fade delay={0.3} dur={0.3}>
        <text className="f89-lb f89-b" x={n ? 170 : (cs[0] + cs[L.nC - 1]) / 2} y={cy - 44} textAnchor="middle">
          poly(ethen) – polyethylen
        </text>
        <path className="f89-ln" style={{ stroke: 'var(--lv)', strokeWidth: 2 }} d={`M${cs[2] - 13} ${cy - 29} h-5 v58 h5 M${cs[3] + 13} ${cy - 29} h5 v58 h-5`} />
        <text className="f89-lb f89-lv" x={cs[3] + 21} y={cy + 33}>
          n
        </text>
        <text className="f89-f" x={unitX} y={cy + 52} textAnchor="middle">
          <ChemText text="[–CH_{2}–CH_{2}–]_{n}" />
        </text>
        <text className="f89-lb f89-lv f89-sm" x={unitX} y={cy + 70} textAnchor="middle">
          opakující se jednotka
        </text>
      </Fade>
    </Plate>
  )
}

// ------------------------------------------------------------------ condensation

/** One piece of a monospaced structural formula; `ring` = benzene ring glyph. */
type Tok = { t: string; hl?: boolean; muted?: boolean; pad?: number } | 'ring'

const RING_W = 26

/** Width of a mono token (JetBrains Mono ≈ 0.6 em, sub/superscripts at 70 %). */
function tokW(tok: Tok, size: number) {
  if (tok === 'ring') return RING_W
  let w = tok.pad ?? 0
  const re = /([\^_])\{([^}]*)\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(tok.t))) {
    w += (m.index - last) * 0.6 * size + m[2].length * 0.6 * 0.7 * size
    last = m.index + m[0].length
  }
  w += (tok.t.length - last) * 0.6 * size
  return w
}

function layout(toks: Tok[], x: number, size: number) {
  let cx = x
  return toks.map((tok) => {
    const w = tokW(tok, size)
    const r = { tok, x: cx, w }
    cx += w
    return r
  })
}

function Ring({ x, y }: { x: number; y: number }) {
  const r = 11
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3
    return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
  return (
    <g>
      <polygon points={pts} className="f89-thin" style={{ strokeWidth: 1.4, fill: 'var(--surface)' }} />
      <circle cx={x} cy={y} r={6} className="f89-thin" />
    </g>
  )
}

/** A formula line laid out from tokens; returns positions via `out`. */
function Formula({ toks, x, y, size }: { toks: Tok[]; x: number; y: number; size: number }) {
  const lay = layout(toks, x, size)
  return (
    <g>
      {lay.map((p, i) =>
        p.tok === 'ring' ? (
          <Ring key={i} x={p.x + RING_W / 2} y={y - size * 0.34} />
        ) : (
          <text
            key={i}
            className={`f89-f${p.tok.hl ? ' f89-lv f89-b' : ''}${p.tok.muted ? ' f89-muted' : ''}`}
            x={p.x + (p.tok.pad ?? 0)}
            y={y}
            style={{ fontSize: size }}
          >
            <ChemText text={p.tok.t} />
          </text>
        ),
      )}
    </g>
  )
}

function Water({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line className="f89-bond" x1={x} y1={y} x2={x - 9} y2={y + 7} />
      <line className="f89-bond" x1={x} y1={y} x2={x + 9} y2={y + 7} />
      <Atom x={x - 9} y={y + 7} el="H" r={4.2} />
      <Atom x={x + 9} y={y + 7} el="H" r={4.2} />
      <Atom x={x} y={y} el="O" r={6.5} label={false} />
    </g>
  )
}

const ACID: Tok[] = [{ t: 'HO', hl: true }, { t: 'OC–' }, 'ring', { t: '–CO' }, { t: 'OH', hl: true }]
const DIOL: Tok[] = [{ t: 'H', hl: true }, { t: 'O–CH_{2}–CH_{2}–O' }, { t: 'H', hl: true }]
const UNIT: Tok[] = [{ t: 'CO', hl: true, pad: 8 }, { t: '–' }, 'ring', { t: '–' }, { t: 'CO–O', hl: true }, { t: '–CH_{2}–CH_{2}–' }, { t: 'O–', hl: true }, { t: '', pad: 8 }]

function Condensation() {
  const n = useNarrow()
  const size = n ? 12 : 14
  const acidW = layout(ACID, 0, size).reduce((s, p) => s + p.w, 0)
  const diolW = layout(DIOL, 0, size).reduce((s, p) => s + p.w, 0)
  const L = n
    ? { w: 340, h: 390, acid: { x: 170 - acidW / 2, y: 50 }, plus: { x: 170, y: 104 }, diol: { x: 170 - diolW / 2, y: 150 }, arr: 188, chainY: 300 }
    : { w: 620, h: 300, acid: { x: 60, y: 50 }, plus: { x: 60 + acidW + 36, y: 50 }, diol: { x: 60 + acidW + 72, y: 50 }, arr: 98, chainY: 230 }
  // chain: ends dashed; 1 unit bracketed; ester links highlighted
  const chainToks: Tok[] = [{ t: '…–', muted: true }, { t: 'O–', hl: true }, ...UNIT, ...UNIT.slice(0, 5), { t: '–…', muted: true }]
  const chainW = layout(chainToks, 0, size).reduce((s, p) => s + p.w, 0)
  const cx0 = L.w / 2 - chainW / 2
  const lay = layout(chainToks, cx0, size)
  // ester link centres: boundary O–|CO and the middle of CO–O
  const links: number[] = []
  lay.forEach((p, i) => {
    if (p.tok === 'ring' || !p.tok.hl) return
    if (p.tok.t === 'CO–O') links.push(p.x + p.w / 2)
    if (p.tok.t === 'O–' && lay[i + 1] && lay[i + 1].tok !== 'ring') links.push(p.x + p.w)
  })
  const unitStart = lay[2].x + 1
  const unitEnd = lay[2 + UNIT.length - 1].x + 7
  const cy = L.chainY
  const ty = cy - size * 0.34
  const midX = L.w / 2
  return (
    <Plate w={L.w} h={L.h}>
      <Pop delay={0.05}>
        <text className="f89-lb f89-lv f89-sm" x={L.acid.x + acidW / 2} y={L.acid.y - 24} textAnchor="middle">
          monomer 1 · dikarboxylová kyselina
        </text>
        <Formula toks={ACID} x={L.acid.x} y={L.acid.y} size={size} />
        <text className="f89-lb f89-sm" x={L.acid.x + acidW / 2} y={L.acid.y + 24} textAnchor="middle">
          kyselina tereftalová
        </text>
      </Pop>
      <Fade delay={0.1} dur={0.3}>
        <text className="f89-sym" x={L.plus.x} y={L.plus.y + 4} textAnchor="middle">
          +
        </text>
      </Fade>
      <Pop delay={0.1}>
        <text className="f89-lb f89-lv f89-sm" x={L.diol.x + diolW / 2} y={L.diol.y - 24} textAnchor="middle">
          monomer 2 · diol
        </text>
        <Formula toks={DIOL} x={L.diol.x} y={L.diol.y} size={size} />
        <text className="f89-lb f89-sm" x={L.diol.x + diolW / 2} y={L.diol.y + 24} textAnchor="middle">
          ethan-1,2-diol
        </text>
      </Pop>
      <Fade delay={0.15} dur={0.3}>
        <Arrow x1={midX} y1={L.arr} x2={midX} y2={L.arr + (n ? 40 : 34)} className="f89-arr f89-arr-lv" />
        <text className="f89-lb f89-lv f89-sm" x={midX + 14} y={L.arr + (n ? 18 : 16)}>
          OH + H → H₂O
        </text>
      </Fade>
      <Fade delay={0.15} dur={0.3}>
        <text className="f89-lb f89-b" x={midX} y={cy - (n ? 66 : 70)} textAnchor="middle">
          polyester PET
        </text>
      </Fade>
      <Pop delay={0.15}>
        <Formula toks={chainToks} x={cx0} y={cy} size={size} />
      </Pop>
      {/* a water molecule leaves every new ester link */}
      {links.map((x, i) => (
        <Slide key={x} delay={0.15 + i * 0.05} dy={22} dur={0.4}>
          <Water x={x} y={cy - 38} />
          <line className="f89-guide" x1={x} y1={cy - 28} x2={x} y2={cy - size - 2} style={{ strokeDasharray: '2 3' }} />
        </Slide>
      ))}
      <Fade delay={0.3} dur={0.3}>
        <text className="f89-lb f89-lv" x={n ? links[links.length - 1] + 18 : links[links.length - 1] + 20} y={cy - 36}>
          {n ? 'H₂O' : 'voda se odštěpí'}
        </text>
        <path
          className="f89-ln"
          style={{ stroke: 'var(--lv)', strokeWidth: 2 }}
          d={`M${unitStart + 3} ${ty - 16} h-4 v34 h4 M${unitEnd - 3} ${ty - 16} h4 v34 h-4`}
        />
        <text className="f89-lb f89-lv" x={unitEnd + 3} y={ty + 26}>
          n
        </text>
        <text className="f89-lb f89-lv f89-sm" x={(unitStart + unitEnd) / 2} y={cy + 30} textAnchor="middle">
          opakující se jednotka
        </text>
        <line className="f89-lead" x1={links[3]} y1={cy + 4} x2={links[3]} y2={cy + 42} />
        <circle className="f89-dot" cx={links[3]} cy={cy + 4} r={2} />
        <text className="f89-lb f89-sm" x={n ? links[3] + 26 : links[3]} y={cy + 56} textAnchor={n ? 'end' : 'middle'}>
          esterová vazba –CO–O–
        </text>
        {n && (
          <text className="f89-lb f89-lv f89-sm" x={midX} y={cy + 80} textAnchor="middle">
            voda se odštěpí u každé esterové vazby
          </text>
        )}
      </Fade>
    </Plate>
  )
}
