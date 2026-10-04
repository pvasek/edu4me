import type { ReactNode } from "react";
import { Draw, Fade, Figure, Travel } from "./kit";

const LABEL =
  "Cyklus zvládání rizika katastrof ve čtyřech fázích. Po katastrofě přichází reakce (záchrana, evakuace, první pomoc, voda a přístřeší), potom obnova (oprava domů a silnic, stavět lépe a bezpečněji). Před další událostí následuje prevence (hráze a poldry, stavební předpisy, územní plán, který nepustí stavby do záplavového území) a připravenost (varovné systémy, evakuační plány, nácvik, zásoby). Pak cyklus začíná znovu další katastrofou. Nejvíc životů a peněz ušetří fáze před událostí.";

const W = 440;
const H = 372;
const CW = 196;
const CH = 70;
const TOPY = 78;
const BOTY = 262;
const LX = 8;
const RX = W - 8 - CW;

function Card({
  x,
  y,
  title,
  lines,
  icon,
  delay,
  before,
}: {
  x: number;
  y: number;
  title: string;
  lines: string[];
  icon: ReactNode;
  delay: number;
  before: boolean;
}) {
  return (
    <Fade delay={delay}>
      <rect x={x} y={y} width={CW} height={CH} rx={8} className={before ? "gz6-box-lvl" : "gz6-box"} />
      <g transform={`translate(${x + 22} ${y + 26})`}>{icon}</g>
      <text x={x + 44} y={y + 22} className="gz6-lbl gz6-b gz6-big">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 44} y={y + 41 + i * 16} className="gz6-lbl gz6-sm">
          {l}
        </text>
      ))}
    </Fade>
  );
}

const Shield = (
  <path d="M0 -12 L11 -8 V0 Q11 9 0 14 Q-11 9 -11 0 V-8 Z" className="gz6-good-fill gz6-o" />
);
const Bell = (
  <g>
    <path d="M-9 6 Q-8 -10 0 -11 Q8 -10 9 6 Z" className="gz6-sun gz6-o" />
    <path d="M-12 6 H12 M-2 9 h4" className="gz6-o" />
  </g>
);
const Cross = (
  <g>
    <circle r={12} className="gz6-tag" />
    <path d="M0 -7 V7 M-7 0 H7" className="gz6-o gz6-red-s" style={{ strokeWidth: 3.4 }} />
  </g>
);
const Home = (
  <g>
    <path d="M-10 10 V-2 L0 -11 L10 -2 V10 Z" className="gz6-fill gz6-o" />
    <path d="M-3 10 V3 H3 V10" className="gz6-o gz6-thin" />
  </g>
);

// the loop the cycle runs along (clockwise): top-right card → bottom-right → bottom-left → top-left → event
const LOOP = `M300 ${TOPY + CH} V${BOTY} M${RX} ${BOTY + CH / 2} H${LX + CW} M140 ${BOTY} V${TOPY + CH}`;
const RUN = `M200 34 Q300 34 300 ${TOPY} V${BOTY + CH / 2} H140 V${TOPY} Q140 34 200 34 Z`;

function Plate() {
  return (
    <>
      {/* halves */}
      <path d={`M220 52 V${BOTY - 6}`} className="gz6-o gz6-thin gz6-dash gz6-faint" />
      <text x={132} y={(TOPY + CH + BOTY) / 2 + 5} textAnchor="end" className="gz6-lbl gz6-b gz6-lvl-t">
        před událostí
      </text>
      <text x={308} y={(TOPY + CH + BOTY) / 2 + 5} className="gz6-lbl gz6-b gz6-red-t">
        po události
      </text>

      {/* arrows of the cycle */}
      <Draw d={`M228 34 Q300 34 300 ${TOPY - 4}`} className="gz6-arr gz6-arr-ink" arrow="ink" delay={0.2} />
      <Draw d={LOOP.split(" M")[0]} className="gz6-arr gz6-arr-ink" arrow="ink" delay={0.5} />
      <Draw d={"M" + LOOP.split(" M")[1]} className="gz6-arr gz6-arr-ink" arrow="ink" delay={0.8} />
      <Draw d={"M" + LOOP.split(" M")[2]} className="gz6-arr gz6-arr-ink" arrow="ink" delay={1.1} />
      <Draw d={`M140 ${TOPY} Q140 34 210 34`} className="gz6-arr gz6-arr-ink" arrow="ink" delay={1.4} />

      {/* the event */}
      <Fade delay={0.05}>
        <circle cx={220} cy={34} r={18} className="gz6-bad-fill gz6-o" />
        <path d="M223 20 L212 37 H220 L216 49 L229 30 H221 Z" style={{ fill: "var(--bad)" }} />
        <text x={244} y={22} className="gz6-lbl gz6-b gz6-red-t">
          katastrofa
        </text>
      </Fade>

      <Card x={RX} y={TOPY} title="reakce" lines={["záchrana, evakuace", "první pomoc, voda, přístřeší"]} icon={Cross} delay={0.3} before={false} />
      <Card x={RX} y={BOTY} title="obnova" lines={["oprava domů a silnic", "stavět lépe a bezpečněji"]} icon={Home} delay={0.6} before={false} />
      <Card x={LX} y={BOTY} title="prevence" lines={["hráze, poldry, předpisy", "nestavět v záplavovém území"]} icon={Shield} delay={0.9} before />
      <Card x={LX} y={TOPY} title="připravenost" lines={["varování, evakuační plány", "nácvik, zásoby"]} icon={Bell} delay={1.2} before />

      <Travel path={RUN} dur={9} rest={[300, 200]}>
        <circle r={5} className="gz6-lvl-f" style={{ stroke: "var(--edge)", strokeWidth: 1 }} />
      </Travel>

      <Fade delay={1.6}>
        <text x={W / 2} y={H - 12} textAnchor="middle" className="gz6-lbl gz6-sm">
          nejvíc životů a peněz ušetří prevence a připravenost
        </text>
      </Fade>
    </>
  );
}

export default function DisasterCycle() {
  return (
    <Figure label={LABEL} w={W} h={H} max={600} boost={false} replay>
      <Plate />
    </Figure>
  );
}

