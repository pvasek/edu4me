import { DrawArrow, Fade, Figure, Liquid, f1, useFig, pat } from "./kit";

const LABEL =
  "Model systému na příkladu jezera. Vstupy (srážky, přítok řeky) přinášejí vodu do systému, zásobami jsou jezero a podzemní voda, mezi nimi probíhá tok (průsak) a výstupy jsou výpar, odtok řekou a podzemní odtok. Dole dvě zpětné vazby: kladná zpětná vazba změnu zesiluje (méně vegetace → víc eroze půdy → tenčí a sušší půda → ještě méně vegetace), záporná zpětná vazba změnu tlumí a vrací systém k rovnováze (hladina jezera stoupne → zvětší se plocha hladiny → víc výparu → hladina zase klesne).";

const W = 440;
const H = 446;

/** a point on a circle, angle in degrees (0 = right, clockwise on screen) */
const on = (cx: number, cy: number, r: number, a: number) =>
  [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)] as const;

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = on(cx, cy, r, a0);
  const [x1, y1] = on(cx, cy, r, a1);
  return `M${f1(x0)} ${f1(y0)} A${r} ${r} 0 0 1 ${f1(x1)} ${f1(y1)}`;
}

function Node({ x, y, t, delay }: { x: number; y: number; t: string; delay: number }) {
  const lines = t.split("\n");
  const y0 = y - ((lines.length - 1) * 16) / 2 + 5;
  return (
    <Fade delay={delay}>
      <text className="gz6-lbl gz6-b gz6-halo" textAnchor="middle" x={x} y={y0}>
        {lines.map((l, i) => (
          <tspan key={i} x={x} dy={i ? 16 : 0}>
            {l}
          </tspan>
        ))}
      </text>
    </Fade>
  );
}

function Loop({
  cx,
  sign,
  title,
  sub,
  nodes,
  d0,
}: {
  cx: number;
  sign: "+" | "−";
  title: string;
  sub: string;
  nodes: [string, string, string];
  d0: number;
}) {
  const cy = 368;
  const r = 54;
  const tone = sign === "+" ? "red" : "green";
  const [tx, ty] = on(cx, cy, r, -90);
  const [rx, ry] = on(cx, cy, r, 30);
  const [lx, ly] = on(cx, cy, r, 150);
  return (
    <g>
      <Fade delay={d0}>
        <text x={cx} y={268} textAnchor="middle" className="gz6-lbl gz6-b gz6-big">
          {title}
        </text>
        <text x={cx} y={287} textAnchor="middle" className={`gz6-lbl gz6-sm ${sign === "+" ? "gz6-red-t" : "gz6-good-t"}`}>
          {sub}
        </text>
      </Fade>
      <DrawArrow d={arc(cx, cy, r, -62, 2)} tone={tone} delay={d0 + 0.2} />
      <DrawArrow d={arc(cx, cy, r, 62, 118)} tone={tone} delay={d0 + 0.45} />
      <DrawArrow d={arc(cx, cy, r, 178, 242)} tone={tone} delay={d0 + 0.7} />
      <Fade delay={d0 + 0.3}>
        <circle cx={cx} cy={cy} r={15} className="gz6-tag" style={{ stroke: sign === "+" ? "var(--bad)" : "var(--good)", strokeWidth: 1.8 }} />
        <text x={cx} y={cy + 7} textAnchor="middle" className={`gz6-sign ${sign === "+" ? "gz6-tone-red" : "gz6-tone-green"}`}>
          {sign}
        </text>
      </Fade>
      <Node x={tx} y={ty} t={nodes[0]} delay={d0 + 0.1} />
      <Node x={rx + 4} y={ry + 6} t={nodes[1]} delay={d0 + 0.4} />
      <Node x={lx - 4} y={ly + 6} t={nodes[2]} delay={d0 + 0.65} />
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const lake = "M146 64 H294 Q290 104 220 122 Q150 104 146 64 Z";
  return (
    <>
      {/* column heads */}
      <Fade>
        <text x={14} y={22} className="gz6-eq gz6-eq-sm gz6-tone-blue" style={{ letterSpacing: 1 }}>
          VSTUPY
        </text>
        <text x={220} y={22} textAnchor="middle" className="gz6-eq gz6-eq-sm gz6-tone-lvl" style={{ letterSpacing: 1 }}>
          SYSTÉM
        </text>
        <text x={W - 14} y={22} textAnchor="end" className="gz6-eq gz6-eq-sm gz6-tone-acc" style={{ letterSpacing: 1 }}>
          VÝSTUPY
        </text>
      </Fade>
      {/* boundary */}
      <rect x={106} y={34} width={228} height={194} rx={14} className="gz6-o gz6-lvl-s gz6-dash" />
      <text x={220} y={220} textAnchor="middle" className="gz6-lbl gz6-sm gz6-lvl-t">
        hranice systému
      </text>

      {/* store 1: the lake */}
      <Liquid d={lake} color="var(--blue)" opacity={0.3} />
      <path d={lake} className="gz6-o" />
      <text x={220} y={86} textAnchor="middle" className="gz6-lbl gz6-b">
        jezero
      </text>
      <text x={220} y={103} textAnchor="middle" className="gz6-lbl gz6-sm">
        zásoba
      </text>

      {/* store 2: groundwater */}
      <rect x={138} y={152} width={164} height={44} rx={8} className="gz6-sea" />
      <rect x={138} y={152} width={164} height={44} rx={8} fill={pat(id, "dots")} />
      <rect x={138} y={152} width={164} height={44} rx={8} className="gz6-o" />
      <text x={220} y={171} textAnchor="middle" className="gz6-lbl gz6-b">
        podzemní voda
      </text>
      <text x={220} y={188} textAnchor="middle" className="gz6-lbl gz6-sm">
        zásoba
      </text>

      {/* transfer */}
      <DrawArrow d="M220 124 V148" delay={0.6} />
      <Fade delay={0.7}>
        <text x={228} y={142} className="gz6-lbl gz6-sm gz6-b">
          průsak (tok)
        </text>
      </Fade>

      {/* inputs */}
      <DrawArrow d="M14 74 H150" tone="blue" delay={0.1} />
      <DrawArrow d="M14 106 H168" tone="blue" delay={0.25} />
      <Fade delay={0.2}>
        <text x={14} y={67} className="gz6-lbl gz6-blue-t">
          srážky
        </text>
        <text x={14} y={99} className="gz6-lbl gz6-blue-t">
          přítok řeky
        </text>
      </Fade>
      {/* outputs */}
      <DrawArrow d="M290 74 H426" tone="acc" delay={0.9} />
      <DrawArrow d="M272 106 H426" tone="acc" delay={1.0} />
      <DrawArrow d="M302 176 H426" tone="acc" delay={1.1} />
      <Fade delay={1.0}>
        <text x={W - 14} y={67} textAnchor="end" className="gz6-lbl gz6-acc-t">
          výpar
        </text>
        <text x={W - 14} y={99} textAnchor="end" className="gz6-lbl gz6-acc-t">
          odtok řekou
        </text>
        <text x={W - 14} y={169} textAnchor="end" className="gz6-lbl gz6-acc-t">
          podzemní odtok
        </text>
      </Fade>

      <path d={`M14 244 H${W - 14}`} className="gz6-o gz6-thin gz6-faint" />

      <Loop
        cx={112}
        sign="+"
        title="kladná zpětná vazba"
        sub="zesiluje změnu"
        nodes={["méně vegetace", "víc eroze\npůdy", "tenčí, sušší\npůda"]}
        d0={1.2}
      />
      <Loop
        cx={328}
        sign="−"
        title="záporná zpětná vazba"
        sub="tlumí změnu, vrací rovnováhu"
        nodes={["hladina stoupne", "větší plocha\nhladiny", "víc\nvýparu"]}
        d0={1.5}
      />
    </>
  );
}

export default function SystemModel() {
  return (
    <Figure label={LABEL} w={W} h={H} max={600} boost={false} replay>
      <Plate />
    </Figure>
  );
}
