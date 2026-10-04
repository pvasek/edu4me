import { Draw, Fade, Figure, Pop } from "./kit";

const LABEL =
  "Systém OSN. Valné shromáždění: všech 193 členských států, každý stát má jeden hlas. Rada bezpečnosti: 15 členů, z toho 5 stálých s právem veta – USA, Rusko, Čína, Spojené království a Francie – a 10 nestálých volených na dva roky; rozhoduje o sankcích a mírových misích. Sekretariát vede generální tajemník. Mezinárodní soudní dvůr v Haagu řeší spory mezi státy. Hospodářská a sociální rada koordinuje agentury: UNICEF pro děti, WHO pro zdraví, UNESCO pro vzdělání, vědu a kulturu, UNHCR pro uprchlíky.";

const W = 480;
const H = 526;

function Box({
  x,
  y,
  w,
  h,
  lvl = false,
  title,
  lines,
  delay = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lvl?: boolean;
  title: string[];
  lines: string[];
  delay?: number;
}) {
  const cx = x + w / 2;
  return (
    <Pop delay={delay}>
      <rect x={x} y={y} width={w} height={h} rx={8} className={lvl ? "gz7-box-lvl" : "gz7-box"} />
      {title.map((t, i) => (
        <text key={i} x={cx} y={y + 24 + i * 19} textAnchor="middle" className="gz7-lbl gz7-b gz7-un-t">
          {t}
        </text>
      ))}
      {lines.map((t, i) => (
        <text key={i} x={cx} y={y + 30 + title.length * 19 + i * 18} textAnchor="middle" className="gz7-lbl gz7-sm">
          {t}
        </text>
      ))}
    </Pop>
  );
}

/** hemicycle of seats (the General Assembly hall) */
function Hall({ cx, cy }: { cx: number; cy: number }) {
  const seats = [];
  const rows = [
    [30, 9],
    [42, 13],
    [54, 17],
    [66, 21],
  ];
  for (const [r, n] of rows)
    for (let i = 0; i < n; i++) {
      const a = Math.PI + (i / (n - 1)) * Math.PI;
      seats.push(
        <circle key={`${r}-${i}`} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={3.2} className="gz7-seat gz7-o gz7-thin" />,
      );
    }
  return (
    <g>
      {seats}
      <rect x={cx - 14} y={cy - 8} width={28} height={10} rx={2} className="gz7-lvl-fill gz7-o gz7-thin" />
    </g>
  );
}

export default function UnSystem() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={620} boost={false}>
      <text x={W / 2} y={24} textAnchor="middle" className="gz7-title">
        OSN · 193 členských států · sídlo New York
      </text>
      {/* connectors */}
      <Draw d="M240 34 V44 M120 44 H360 M120 44 V56 M356 44 V56" className="gz7-o gz7-thin" delay={0.1} />
      <Draw d="M120 262 V276 M356 262 V276 M86 276 H394 M86 276 V288 M240 276 V288 M394 276 V288" className="gz7-o gz7-thin" delay={0.3} />
      <Draw d="M394 384 V408 M64 408 H416 M64 408 V420 M182 408 V420 M298 408 V420 M416 408 V420" className="gz7-o gz7-thin" delay={0.5} />

      {/* General Assembly */}
      <Box x={12} y={56} w={216} h={206} title={["Valné shromáždění"]} lines={[]} />
      <Hall cx={120} cy={160} />
      <text x={120} y={196} textAnchor="middle" className="gz7-lbl">
        všech 193 států
      </text>
      <text x={120} y={216} textAnchor="middle" className="gz7-lbl gz7-sm">
        1 stát = 1 hlas
      </text>
      <text x={120} y={236} textAnchor="middle" className="gz7-lbl gz7-sm">
        rozpočet, doporučení
      </text>

      {/* Security Council */}
      <Box x={240} y={56} w={232} h={206} lvl title={["Rada bezpečnosti"]} lines={[]} delay={0.1} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <circle cx={312 + i * 22} cy={104} r={9} className="gz7-lvl-strong gz7-o" />
          <text x={312 + i * 22} y={107} textAnchor="middle" className="gz7-veto">
            V
          </text>
        </g>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={266 + i * 20} cy={128} r={7} className="gz7-paper-fill gz7-o gz7-thin" />
      ))}
      <text x={356} y={160} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        5 stálých s právem veta:
      </text>
      <text x={356} y={178} textAnchor="middle" className="gz7-lbl gz7-sm">
        USA, Rusko, Čína,
      </text>
      <text x={356} y={196} textAnchor="middle" className="gz7-lbl gz7-sm">
        Spojené království, Francie
      </text>
      <text x={356} y={218} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b">
        + 10 nestálých na 2 roky
      </text>
      <text x={356} y={240} textAnchor="middle" className="gz7-lbl gz7-sm">
        mír: sankce, mírové mise
      </text>

      {/* principal organs */}
      <Box x={12} y={288} w={148} h={96} title={["Sekretariát"]} lines={["generální tajemník,", "úředníci OSN"]} delay={0.3} />
      <Box x={166} y={288} w={148} h={96} title={["Mezinárodní", "soudní dvůr"]} lines={["Haag · 15 soudců"]} delay={0.35} />
      <Box x={320} y={288} w={148} h={96} title={["Hospodářská a", "sociální rada"]} lines={["54 členů"]} delay={0.4} />

      {/* agencies */}
      <Fade delay={0.5}>
        <text x={240} y={402} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t gz7-halo">
          programy, fondy a odborné agentury
        </text>
      </Fade>
      <Box x={12} y={420} w={106} h={92} title={["UNICEF"]} lines={["Dětský fond", "OSN"]} delay={0.55} />
      <Box x={124} y={420} w={116} h={92} title={["WHO"]} lines={["zdraví", "Ženeva"]} delay={0.6} />
      <Box x={246} y={420} w={110} h={92} title={["UNESCO"]} lines={["vzdělání, věda,", "kultura · Paříž"]} delay={0.65} />
      <Box x={362} y={420} w={106} h={92} title={["UNHCR"]} lines={["uprchlíci", "Ženeva"]} delay={0.7} />
    </Figure>
  );
}
