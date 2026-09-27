import { Arrow, Draw, Fade, Flame, Hx, Lbl, Plate, Pop, useFigId, useHatch } from './kit'

const TUBE = 'M190 -11 L0 -11 A11 11 0 0 0 0 11 L190 11 Z'
const T = 'translate(250 250) rotate(-45)'

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <Pop delay={1.2 + n * 0.12}>
      <g className="f12-badge">
        <circle cx={x} cy={y} r={10} />
        <text x={x} y={y + 0.5}>
          {n}
        </text>
      </g>
    </Pop>
  )
}

function Goggles({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="f12-line" d="M-34 -4 Q-40 -2 -44 4 M34 -4 Q40 -2 44 4" />
      <path className="f12-line f12-glass" d="M-32 -12 Q-4 -16 -4 0 Q-4 12 -18 12 Q-32 12 -32 -12 Z M32 -12 Q4 -16 4 0 Q4 12 18 12 Q32 12 32 -12 Z" />
      <path className="f12-line" d="M-4 -2 Q0 -6 4 -2" />
      <path className="f12-shine" d="M-26 -6 Q-22 -9 -16 -9 M10 -9 Q14 -10 20 -9" />
    </g>
  )
}

export default function HeatingTestTube() {
  const clip = useFigId()
  const h = useHatch()
  return (
    <Plate
      level={1}
      w={600}
      h={410}
      max={640}
      label="Správné zahřívání zkumavky: ochranné brýle, kapalina nejvýš do třetiny, zkumavka v držáku v horní třetině blízko ústí, držená šikmo asi pod úhlem 45 stupňů, ústí otočené od sebe i od ostatních, zahřívá se v nesvítivém plameni a zkumavkou se stále mírně pohybuje. Vedle je špatný příklad: do zkumavky se při zahřívání nikdy nedívej shora."
      after={
        <ol className="f12-notes">
          <li>Nasaď si ochranné brýle.</li>
          <li>Kapalina nejvýš do třetiny zkumavky.</li>
          <li>Držák v horní třetině, blízko ústí.</li>
          <li>Šikmo, ústí od sebe i od ostatních.</li>
          <li>Nesvítivý plamen a stále mírně pohybuj.</li>
        </ol>
      }
    >
      <defs>
        <clipPath id={clip}>
          <path d={TUBE} transform={T} />
        </clipPath>
      </defs>

      {/* burner */}
      <g>
        <Hx d="M218 370 L282 370 L294 386 L206 386 Z" kind="x" tone="var(--f12-metal)" />
        <Hx d="M241 300 L259 300 L259 370 L241 370 Z" kind="d" tone="var(--f12-metal)" />
        <Hx d="M237 342 L263 342 L263 355 L237 355 Z" kind="x" tone="var(--f12-metal-2)" />
        <path className="f12-line" d="M200 386 L300 386" />
      </g>
      <Pop delay={0.5} origin="50% 100%">
        <Flame x={250} y={300} h={80} kind="blue" />
      </Pop>

      {/* angle */}
      <Fade delay={1}>
        <path className="f12-thin f12-dash" d="M250 250 L350 250" />
        <path className="f12-thin" d="M340 250 A90 90 0 0 0 313.6 186.4" />
        <text className="f12-t" x={346} y={226}>
          ≈ 45°
        </text>
      </Fade>

      {/* tube + holder, gently rocking */}
      <g className="f12-rock">
        <path className="f12-glass" d={TUBE} transform={T} />
        <g clipPath={`url(#${clip})`}>
          <Fade delay={0.6}>
            <rect x={200} y={210} width={120} height={70} style={{ fill: 'color-mix(in srgb, var(--pink) 34%, var(--surface))' }} />
            <rect x={200} y={210} width={120} height={70} fill={h('h')} className="f12-hatch" />
            <path className="f12-liq" d="M200 210 L320 210" />
            <circle className="f12-bubble" cx={246} cy={252} r={2.4} style={{ ['--rise' as string]: '-36px' }} />
            <circle className="f12-bubble" cx={256} cy={250} r={1.8} style={{ ['--rise' as string]: '-34px', animationDelay: '-0.8s' }} />
            <circle className="f12-bubble" cx={240} cy={246} r={1.6} style={{ ['--rise' as string]: '-30px', animationDelay: '-1.5s' }} />
          </Fade>
        </g>
        <g transform={T}>
          <Draw d="M194 -14 Q192 -11 190 -11 L0 -11 A11 11 0 0 0 0 11 L190 11 Q192 11 194 14" />
          <path className="f12-shine" d="M20 -6 L170 -6" opacity={0.6} />
        </g>
        {/* wooden holder from the clamp to the hand */}
        <g transform="translate(349 151) rotate(160)">
          <path className="f12-line" d="M-6 -6 L184 -6 L184 6 L-6 6 Z" style={{ fill: 'var(--f12-wood)' }} />
          <path className="f12-hatch" d="M-6 0 L184 0 L184 6 L-6 6 Z" fill={h('d')} />
          <path className="f12-hair" d="M30 -2 Q80 -4 140 -1" />
        </g>
        <g transform={`${T} translate(140 0)`}>
          <path className="f12-line" d="M-5 -15 L5 -15 L5 15 L-5 15 Z" style={{ fill: 'var(--f12-metal-2)' }} />
          <path className="f12-thin" d="M-5 -15 L-5 15" />
        </g>
      </g>

      {/* mouth direction */}
      <Arrow x1={392} y1={108} x2={448} y2={52} className="f12-arrow f12-arrow-lv" delay={1.3} />

      {/* labels */}
      <Goggles x={62} y={56} />
      <Lbl x={112} y={62} sec delay={1}>
        ochranné brýle
      </Lbl>
      <Badge x={62} y={84} n={1} />

      <Lbl x={176} y={290} tx={244} ty={238} anchor="end" line2="zkumavky" sec>
        nejvýš ⅓
      </Lbl>
      <Badge x={276} y={226} n={2} />

      <Lbl x={316} y={112} tx={345} ty={146} anchor="end" line2="v horní třetině" sec>
        držák
      </Lbl>
      <Badge x={372} y={166} n={3} />

      <Lbl x={456} y={46} line2="i od ostatních" sec>
        ústí od sebe
      </Lbl>
      <Badge x={430} y={92} n={4} />

      <Lbl x={306} y={318} tx={262} ty={280} line2="pohybuj zkumavkou" sec>
        nesvítivý plamen,
      </Lbl>
      <Badge x={224} y={312} n={5} />

      {/* wrong way inset */}
      <Pop delay={1.6}>
        <g className="f12-inset">
          <rect className="f12-inset-box" x={448} y={228} width={140} height={168} rx={8} />
          <text className="f12-t f12-t-strong" x={518} y={254} textAnchor="middle">
            takhle ne!
          </text>
          <path className="f12-line" d="M500 280 Q518 266 536 280 Q518 294 500 280 Z" style={{ fill: 'var(--surface)' }} />
          <circle cx={518} cy={280} r={5.5} style={{ fill: 'var(--ink)' }} />
          <path className="f12-thin f12-dash" d="M518 290 L518 310" />
          <path className="f12-glass" d="M509 312 L509 372 A9 9 0 0 0 527 372 L527 312 Z" />
          <path className="f12-liq" d="M509.8 352 L526.2 352 L526.2 372 A8.2 8.2 0 0 1 509.8 372 Z" style={{ fill: 'color-mix(in srgb, var(--pink) 34%, var(--surface))' }} />
          <path className="f12-line" d="M505 309 Q509 310 509 314 L509 372 A9 9 0 0 0 527 372 L527 314 Q527 310 531 309" />
          <g className="f12-no">
            <circle cx={562} cy={360} r={15} />
            <path d="M555 353 L569 367 M569 353 L555 367" />
          </g>
        </g>
      </Pop>
    </Plate>
  )
}
