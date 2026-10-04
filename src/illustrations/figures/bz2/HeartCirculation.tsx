import { Fade, Frame, Lbl, Plates, blob, pat, useFig, useLive, type P2 } from "./kit";

const LABEL =
  "Srdce v řezu zepředu a dvojí krevní oběh. Srdce má čtyři dutiny: pravou předsíň a pravou komoru, levou předsíň a levou komoru; na obrázku je pravá polovina vlevo, protože se díváme zepředu. Pravou polovinou teče odkysličená krev (modře): do pravé předsíně ji přivádějí duté žíly a pravá komora ji vypuzuje plicnicí do plic. Levou polovinou teče okysličená krev (červeně): z plic přitéká plicními žilami do levé předsíně a levá komora s nejsilnější stěnou ji vypuzuje srdečnicí (aortou) do celého těla. Chlopně mezi předsíněmi a komorami a na výstupu z komor pouštějí krev jen jedním směrem. Vpravo schéma: malý (plicní) oběh z pravé komory přes plíce do levé předsíně, velký (tělní) oběh z levé komory přes tělo do pravé předsíně.";

const HEART: P2[] = [
  [100, 104],
  [178, 98],
  [256, 104],
  [282, 160],
  [262, 244],
  [196, 316],
  [118, 258],
  [80, 176],
];

function Tube({ d, cls, w = 22 }: { d: string; cls: "oxy" | "deoxy"; w?: number }) {
  return (
    <g>
      <path d={d} className="bz2-o" style={{ strokeWidth: w + 3, strokeLinecap: "butt" }} />
      <path d={d} className={`bz2-tube-${cls}`} style={{ strokeWidth: w }} />
    </g>
  );
}

function Valve({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <path
      d="M-14 0 Q-8 8 -3 14 M14 0 Q8 8 3 14"
      transform={`translate(${x} ${y}) rotate(${rot})`}
      className="bz2-o bz2-valve"
    />
  );
}

function Heart() {
  const { id } = useFig();
  return (
    <Frame w={340} h={340}>
      {/* vessels behind the heart */}
      <Tube d="M78 330 Q84 230 104 160" cls="deoxy" />
      <Tube d="M300 112 L250 126" cls="oxy" w={14} />
      <Tube d="M300 140 L254 146" cls="oxy" w={14} />
      <Tube d="M150 180 L150 70 Q150 56 136 56 L52 56" cls="deoxy" w={20} />
      <Tube d="M150 70 Q150 56 166 56 L304 56" cls="deoxy" w={16} />
      {/* heart muscle */}
      <path d={blob(HEART)} className="bz2-o bz2-myo" style={{ strokeWidth: 2 }} />
      <path d={blob(HEART)} fill={pat(id, "b")} opacity={0.5} />
      {/* chambers */}
      <path d={blob([[100, 120], [162, 114], [170, 160], [104, 168]])} className="bz2-o bz2-deoxy-f" />
      <path d={blob([[102, 190], [168, 184], [178, 282], [140, 252]])} className="bz2-o bz2-deoxy-f" />
      <path d={blob([[192, 116], [254, 120], [262, 158], [196, 162]])} className="bz2-o bz2-oxy-f" />
      <path d={blob([[210, 188], [248, 182], [236, 250], [202, 290]])} className="bz2-o bz2-oxy-f" />
      {/* atrioventricular (cuspid) valves */}
      <Valve x={136} y={170} />
      <Valve x={228} y={172} />
      {/* superior vena cava + aorta in front */}
      <Tube d="M112 20 L112 124" cls="deoxy" />
      <Tube d="M218 184 Q206 96 214 60 Q228 22 262 30 Q290 40 292 96" cls="oxy" />
      {[220, 238, 256].map((x, i) => (
        <path key={x} d={`M${x} ${36 - i * 2} l${i - 1} -24`} className="bz2-o bz2-tube-o" />
      ))}
      {/* semilunar valves at the exits */}
      <path d="M140 176 q10 -8 20 0" className="bz2-o bz2-valve" />
      <path d="M206 170 q11 -8 22 0" className="bz2-o bz2-valve" />
      {/* flow arrows */}
      <Fade delay={0.6}>
        <path d="M132 136 L134 210" className="bz2-arr bz2-arr-ink" />
        <path d="M128 202 L134 212 L140 202" className="bz2-o" />
        <path d="M226 136 L226 214" className="bz2-arr bz2-arr-ink" />
        <path d="M220 206 L226 216 L232 206" className="bz2-o" />
      </Fade>
      {/* labels */}
      <Lbl x={6} y={142} tx={116} ty={140} className="bz2-sm">pravá předsíň</Lbl>
      <Lbl x={6} y={236} tx={130} ty={232} className="bz2-sm bz2-b">pravá komora</Lbl>
      <Lbl x={336} y={190} tx={240} ty={140} anchor="end" lx={300} ly={178} className="bz2-sm">levá předsíň</Lbl>
      <Lbl x={336} y={272} tx={222} ty={240} anchor="end" lx={286} ly={264} className="bz2-sm bz2-b">levá komora</Lbl>
      <Lbl x={336} y={20} tx={286} ty={60} anchor="end" lx={318} ly={26} className="bz2-sm bz2-red-t bz2-b">srdečnice</Lbl>
      <Lbl x={6} y={44} className="bz2-sm bz2-blue-t bz2-b">plicnice</Lbl>
      <Lbl x={124} y={14} tx={112} ty={24} className="bz2-xs bz2-blue-t" sec>horní dutá žíla</Lbl>
      <Lbl x={6} y={318} tx={80} ty={310} className="bz2-xs bz2-blue-t" sec>dolní dutá žíla</Lbl>
      <Lbl x={336} y={102} anchor="end" className="bz2-xs bz2-red-t" sec>plicní žíly</Lbl>
      <Lbl x={160} y={334} tx={136} ty={182} anchor="middle" lx={150} ly={316} className="bz2-xs">chlopně</Lbl>
    </Frame>
  );
}

function Circulation() {
  const live = useLive();
  return (
    <Frame w={300} h={340} title="dvojí oběh">
      <g className={live ? "bz2-live" : ""}>
        {/* lungs */}
        <rect x={70} y={16} width={160} height={54} rx={22} className="bz2-o bz2-lung" />
        <text x={150} y={48} textAnchor="middle" className="bz2-lbl bz2-b">plíce</text>
        {/* body */}
        <rect x={50} y={266} width={200} height={58} rx={14} className="bz2-o bz2-flesh" />
        <text x={150} y={300} textAnchor="middle" className="bz2-lbl bz2-b">tělo</text>
        {/* heart: 4 boxes */}
        <rect x={104} y={136} width={44} height={30} rx={5} className="bz2-o bz2-deoxy-f" />
        <rect x={104} y={168} width={44} height={42} rx={5} className="bz2-o bz2-deoxy-f" />
        <rect x={152} y={136} width={44} height={30} rx={5} className="bz2-o bz2-oxy-f" />
        <rect x={152} y={168} width={44} height={42} rx={5} className="bz2-o bz2-oxy-f" />
        <text x={126} y={156} textAnchor="middle" className="bz2-cell-t">PP</text>
        <text x={126} y={194} textAnchor="middle" className="bz2-cell-t">PK</text>
        <text x={174} y={156} textAnchor="middle" className="bz2-cell-t">LP</text>
        <text x={174} y={194} textAnchor="middle" className="bz2-cell-t">LK</text>
        {/* pulmonary loop: RV → lungs (blue), lungs → LA (red) */}
        <path d="M104 190 H82 V60 H90" className="bz2-o bz2-loop-deoxy" />
        <path d="M210 60 H218 V150 H196" className="bz2-o bz2-loop-oxy" />
        <path d="M82 190 V60" className="bz2-flow bz2-flow-light" />
        <path d="M218 60 V150" className="bz2-flow bz2-flow-light" />
        {/* systemic loop: LV → body (red), body → RA (blue) */}
        <path d="M196 190 H262 V286 H250" className="bz2-o bz2-loop-oxy" />
        <path d="M50 286 H38 V150 H104" className="bz2-o bz2-loop-deoxy" />
        <path d="M262 190 V286" className="bz2-flow bz2-flow-light" />
        <path d="M38 286 V150" className="bz2-flow bz2-flow-light" />
        {/* heads */}
        <path d="M86 56 l8 4 l-8 4" className="bz2-o bz2-loop-head" />
        <path d="M202 146 l-8 4 l8 4" className="bz2-o bz2-loop-head" />
        <path d="M254 282 l-8 4 l8 4" className="bz2-o bz2-loop-head" />
        <path d="M98 146 l8 4 l-8 4" className="bz2-o bz2-loop-head" />
      </g>
      <text x={150} y={96} textAnchor="middle" className="bz2-lbl bz2-sm bz2-b">malý (plicní) oběh</text>
      <text x={150} y={118} textAnchor="middle" className="bz2-lbl bz2-xs bz2-muted-t">CO₂ ven, O₂ do krve</text>
      <text x={150} y={236} textAnchor="middle" className="bz2-lbl bz2-sm bz2-b">velký (tělní) oběh</text>
      <text x={150} y={256} textAnchor="middle" className="bz2-lbl bz2-xs bz2-muted-t">O₂ k buňkám, CO₂ zpět</text>
    </Frame>
  );
}

export default function HeartCirculation() {
  return (
    <Plates
      label={LABEL}
      level={6}
      max={760}
      cols="1.15fr 1fr"
      stackBelow={600}
      note="Pohled zepředu: pravá polovina srdce je na obrázku vlevo. Modře odkysličená, červeně okysličená krev."
    >
      <Heart />
      <Circulation />
    </Plates>
  );
}
