import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, pat, rng, useFig } from './kit'

const LABEL =
  'Polovodičová dioda. Přechod PN vznikne spojením polovodiče typu P, kde proud vedou díry (kladné), a typu N, kde ho vedou volné elektrony; na rozhraní je tenká vrstva bez volných nábojů. Značka diody je trojúhelník s čárkou: anoda A je strana P, katoda K strana N. V propustném směru (plus zdroje na P) se vrstva zúží, diodou teče proud a LED svítí. V závěrném směru (plus zdroje na N) se vrstva rozšíří, proud neteče a LED nesvítí. Dioda tak propouští proud jen jedním směrem.'

const PCOL = '#e8a598'
const NCOL = '#a9c3de'

/** P–N block at (x, y), size w × h, depletion zone half-width dz. */
function Block({ x, y, w, h, dz, carriers = 6 }: { x: number; y: number; w: number; h: number; dz: number; carriers?: number }) {
  const { id } = useFig()
  const cx = x + w / 2
  const rw = w / 2 - dz
  const cols = Math.max(1, Math.round(Math.sqrt((carriers * rw) / h)))
  const rows = Math.ceil(carriers / cols)
  const r = rng(carriers * 7 + dz)
  const spot = (x0: number, i: number) => {
    const cxx = x0 + ((i % cols) + 0.5) * (rw / cols) + (r() - 0.5) * (rw / cols) * 0.4
    const cyy = y + (Math.floor(i / cols) + 0.5) * (h / rows) + (r() - 0.5) * (h / rows) * 0.3
    return [cxx, cyy]
  }
  const holes = Array.from({ length: carriers }, (_, i) => spot(x, i))
  const elec = Array.from({ length: carriers }, (_, i) => spot(cx + dz, i))
  return (
    <g>
      <rect x={x} y={y} width={w / 2} height={h} fill={PCOL} />
      <rect x={cx} y={y} width={w / 2} height={h} fill={NCOL} />
      <rect x={cx - dz} y={y} width={2 * dz} height={h} className="fz2-fill" />
      <rect x={cx - dz} y={y} width={2 * dz} height={h} fill={pat(id, 'd')} />
      <rect x={x} y={y} width={w} height={h} className="fz2-o" fill="none" />
      {holes.map(([hx, hy], i) => (
        <g key={i}>
          <circle cx={hx} cy={hy} r={4.2} className="fz2-hole" />
          <path d={`M${hx - 2.2} ${hy} H${hx + 2.2} M${hx} ${hy - 2.2} V${hy + 2.2}`} className="fz2-hole-t" />
        </g>
      ))}
      {elec.map(([ex, ey], i) => (
        <g key={i}>
          <circle cx={ex} cy={ey} r={4.2} className="fz2-e" />
          <path d={`M${ex - 2.2} ${ey} H${ex + 2.2}`} className="fz2-e-mark" />
        </g>
      ))}
    </g>
  )
}

function Junction() {
  return (
    <Frame w={260} h={196}>
      <Block x={30} y={30} w={200} h={64} dz={12} carriers={8} />
      <text x={40} y={24} className="fz2-lbl fz2-b fz2-big">
        P
      </text>
      <text x={220} y={24} textAnchor="end" className="fz2-lbl fz2-b fz2-big">
        N
      </text>
      <text x={130} y={112} textAnchor="middle" className="fz2-lbl fz2-sm">
        přechod bez volných nábojů
      </text>
      {/* diode symbol */}
      <path d="M40 158 H108 M152 158 H220" className="fz2-o fz2-thick" />
      <path d="M108 142 L148 158 L108 174Z" className="fz2-o fz2-lvl-f" />
      <path d="M150 142 V174" className="fz2-o" style={{ strokeWidth: 3 }} />
      <text x={40} y={182} className="fz2-lbl fz2-b fz2-sm">
        A – anoda
      </text>
      <text x={220} y={182} textAnchor="end" className="fz2-lbl fz2-b fz2-sm">
        K – katoda
      </text>
    </Frame>
  )
}

function Circuit({ forward }: { forward: boolean }) {
  const loop = 'M126 150 H30 V50 H80 M180 50 H230 V150 H138'
  return (
    <Frame w={260} h={196}>
      <path d={loop} className="fz2-wire" />
      {forward && <path d="M126 150 H30 V50 H230 V150 H138" className="fz2-current" />}
      <Block x={80} y={32} w={100} h={36} dz={forward ? 4 : 16} carriers={4} />
      <text x={86} y={26} className="fz2-lbl fz2-b fz2-sm">
        P
      </text>
      <text x={174} y={26} textAnchor="end" className="fz2-lbl fz2-b fz2-sm">
        N
      </text>
      {/* LED on the right branch */}
      <circle cx={230} cy={100} r={15} className={`fz2-o ${forward ? 'fz2-led-on' : 'fz2-led-off'}`} />
      {forward && (
        <g className="fz2-glow">
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180
            return <path key={a} d={`M${230 + Math.cos(r) * 19} ${100 + Math.sin(r) * 19} L${230 + Math.cos(r) * 27} ${100 + Math.sin(r) * 27}`} className="fz2-rays" />
          })}
        </g>
      )}
      {/* battery: long plate = + */}
      <path d={forward ? 'M126 136 V164 M138 142 V158' : 'M126 142 V158 M138 136 V164'} className="fz2-o" style={{ strokeWidth: 3 }} />
      <text x={forward ? 116 : 148} y={134} textAnchor="middle" className="fz2-lbl fz2-b">
        +
      </text>
      <text x={forward ? 148 : 116} y={134} textAnchor="middle" className="fz2-lbl fz2-b">
        −
      </text>
      {forward ? (
        <>
          <Arrow d="M52 50 H74" tone="lvl" className="fz2-wide" />
          <text x={130} y={186} textAnchor="middle" className="fz2-lbl fz2-b fz2-green-t">
            proud teče, LED svítí
          </text>
        </>
      ) : (
        <text x={130} y={186} textAnchor="middle" className="fz2-lbl fz2-b fz2-red-t">
          I = 0, LED nesvítí
        </text>
      )}
      <text x={130} y={90} textAnchor="middle" className="fz2-lbl fz2-sm">
        {forward ? 'tenký přechod' : 'široký přechod'}
      </text>
    </Frame>
  )
}

export default function PnDiode() {
  return (
    <Figure level={6} label={LABEL} max={720} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={200}
          steps={[
            { title: 'Přechod PN a značka', caption: 'V P vedou díry (+), v N elektrony (−). Šipka ve značce ukazuje směr proudu.', art: <Junction /> },
            { title: 'Propustný směr', caption: 'Plus zdroje na P (anodu): přechod se zúží a diodou teče proud.', art: <Circuit forward /> },
            { title: 'Závěrný směr', caption: 'Plus zdroje na N (katodu): přechod se rozšíří a proud neteče.', art: <Circuit forward={false} /> },
          ]}
        />
      </div>
    </Figure>
  )
}
