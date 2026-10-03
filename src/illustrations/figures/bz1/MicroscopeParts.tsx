import { Body, Draw, Fade, Figure, Lbl, Pop, pat, useFig } from "./kit";

const LABEL =
  "Světelný mikroskop s popsanými částmi. Nahoře okulár, do kterého se díváme, pod ním tubus a revolverová hlavice se třemi objektivy. Pod objektivem leží na stolku preparát, pod stolkem je kondenzor s clonou a dole v podstavci osvětlení (u starších mikroskopů zrcátko). Světlo prochází zdola preparátem, objektivem a okulárem do oka. Rameno nese makrošroub pro hrubé a mikrošroub pro jemné zaostření. Celkové zvětšení = zvětšení okuláru × zvětšení objektivu, například 10× · 40× = 400×.";

const AX = 205; // optical axis

function Microscope() {
  const { id } = useFig();
  return (
    <g>
      {/* arm (rameno) */}
      <Body
        d="M262 404 C286 350 292 300 288 250 C285 214 276 186 262 166 L284 152 C304 180 314 216 316 254 C319 304 310 356 290 404 Z"
        fill="bz1-fill2"
        hatch="d"
      />
      {/* base (podstavec) */}
      <Body
        d="M140 436 L152 404 H316 L330 436 Z"
        fill="bz1-fill3"
        hatch="d"
      />
      <path d="M146 422 H324" className="bz1-o bz1-thin" />
      {/* lamp in the base */}
      <rect x={AX - 16} y={388} width={32} height={16} rx={3} className="bz1-o bz1-fill" />
      <ellipse cx={AX} cy={388} rx={13} ry={3.5} className="bz1-o bz1-glass" />
      {/* stage (stolek) */}
      <Body d="M134 250 H292 V262 H134 Z" fill="bz1-fill2" hatch="b" />
      {/* slide + clips */}
      <rect x={164} y={244} width={84} height={6} className="bz1-o bz1-glass" />
      <rect x={190} y={242} width={30} height={2.5} className="bz1-o bz1-thin bz1-glass" />
      <circle cx={AX} cy={246.5} r={2.4} className="bz1-lvl-f" />
      <path d="M150 244 L176 241 M262 244 L238 241" className="bz1-o" style={{ strokeWidth: 2.2 }} />
      {/* condenser + diaphragm */}
      <Body d={`M${AX - 14} 264 H${AX + 14} L${AX + 11} 290 H${AX - 11} Z`} fill="bz1-fill" hatch="v" />
      <path d={`M${AX + 12} 282 L${AX + 30} 290`} className="bz1-o" />
      {/* head */}
      <Body d={`M${AX - 18} 146 H262 L284 152 L262 166 V178 H${AX - 18} Z`} fill="bz1-fill2" hatch="d" />
      {/* tube */}
      <Body d={`M${AX - 15} 76 H${AX + 15} V146 H${AX - 15} Z`} fill="bz1-fill" hatch="v" />
      {/* eyepiece */}
      <Body d={`M${AX - 12} 40 H${AX + 12} V76 H${AX - 12} Z`} fill="bz1-fill2" />
      <rect x={AX - 15} y={34} width={30} height={8} rx={2} className="bz1-o bz1-fill3" />
      <text x={AX} y={64} textAnchor="middle" className="bz1-eq bz1-eq-sm">
        10×
      </text>
      {/* revolver */}
      <Body d={`M${AX - 30} 178 H${AX + 30} L${AX + 22} 192 H${AX - 22} Z`} fill="bz1-fill3" hatch="b" />
      {/* objectives */}
      <g>
        <Body d={`M${AX - 8} 192 H${AX + 8} V222 L${AX + 5} 230 H${AX - 5} L${AX - 8} 222 Z`} fill="bz1-fill" />
        <path d={`M${AX - 8} 204 H${AX + 8}`} className="bz1-lvl-s bz1-o" style={{ strokeWidth: 2.4 }} />
        <text x={AX} y={218} textAnchor="middle" className="bz1-eq bz1-eq-sm" style={{ fontSize: 9 }}>
          40×
        </text>
      </g>
      <g transform={`rotate(24 ${AX - 18} 190)`}>
        <Body d={`M${AX - 25} 190 H${AX - 11} V210 L${AX - 13} 216 H${AX - 23} L${AX - 25} 210 Z`} fill="bz1-fill" />
      </g>
      <g transform={`rotate(-24 ${AX + 18} 190)`}>
        <Body d={`M${AX + 11} 190 H${AX + 25} V214 L${AX + 23} 220 H${AX + 13} L${AX + 11} 214 Z`} fill="bz1-fill" />
      </g>
      {/* focus knobs */}
      <circle cx={300} cy={300} r={18} className="bz1-o bz1-fill2" />
      <circle cx={300} cy={300} r={18} fill={pat(id, "x")} />
      <circle cx={300} cy={300} r={6} className="bz1-o bz1-fill" />
      <circle cx={300} cy={340} r={10} className="bz1-o bz1-fill3" />
      <circle cx={300} cy={340} r={3} className="bz1-o bz1-fill" />
    </g>
  );
}

export default function MicroscopeParts() {
  return (
    <Figure level={1} label={LABEL} w={440} h={520} max={540} replay>
      <Fade>
        <Microscope />
      </Fade>
      {/* light path */}
      <Draw
        d={`M${AX} 384 V292 M${AX} 262 V232 M${AX} 176 V80 M${AX} 34 V14`}
        className="bz1-o bz1-lvl-s bz1-dash"
        delay={0.4}
        style={{ strokeWidth: 2 }}
      />
      <Pop delay={1.3}>
        <path d={`M${AX - 6} 22 L${AX} 12 L${AX + 6} 22`} className="bz1-o bz1-lvl-s" style={{ strokeWidth: 2 }} />
      </Pop>
      <Fade delay={0.8}>
        <Lbl x={160} y={52} tx={AX - 13} ty={56} anchor="end" className="bz1-b">
          okulár
        </Lbl>
        <Lbl x={160} y={112} tx={AX - 15} ty={112} anchor="end" sec>
          tubus
        </Lbl>
        <Lbl x={152} y={168} tx={AX - 30} ty={184} anchor="end">
          {"revolverová\nhlavice"}
        </Lbl>
        <Lbl x={160} y={216} tx={AX - 8} ty={212} anchor="end" className="bz1-b">
          objektiv
        </Lbl>
        <Lbl x={150} y={246} tx={166} ty={247} anchor="end" sec>
          preparát
        </Lbl>
        <Lbl x={120} y={282} tx={136} ty={258} anchor="end" className="bz1-b">
          stolek
        </Lbl>
        <Lbl x={150} y={312} tx={AX - 12} ty={280} anchor="end" sec>
          {"kondenzor\ns clonou"}
        </Lbl>
        <Lbl x={150} y={376} tx={AX - 16} ty={396} anchor="end" className="bz1-b">
          {"osvětlení\n(zrcátko)"}
        </Lbl>
        <Lbl x={322} y={180} tx={296} ty={196}>
          {"rameno\n(stativ)"}
        </Lbl>
        <Lbl x={326} y={292} tx={318} ty={296} className="bz1-b">
          makrošroub
        </Lbl>
        <Lbl x={318} y={360} tx={308} ty={344} className="bz1-b">
          mikrošroub
        </Lbl>
        <Lbl x={340} y={432} tx={326} ty={428} sec>
          podstavec
        </Lbl>
        <Lbl x={AX + 14} y={18} className="bz1-sm bz1-lvl-t" sec>
          oko
        </Lbl>
      </Fade>
      <Fade delay={1.4}>
        <rect x={60} y={454} width={320} height={56} rx={8} className="bz1-box-lvl" />
        <text x={220} y={477} textAnchor="middle" className="bz1-eq bz1-eq-lg">
          zvětšení = okulár × objektiv
        </text>
        <text x={220} y={500} textAnchor="middle" className="bz1-eq">
          10× · 40× = 400×
        </text>
      </Fade>
    </Figure>
  );
}
