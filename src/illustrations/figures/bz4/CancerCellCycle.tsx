import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, blob, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Buněčný cyklus a vznik nádoru. 1. Cyklus má fáze G1 (růst), S (kopírování DNA), G2 (příprava) a M (mitóza); na třech kontrolních bodech – na konci G1, na konci G2 a uprostřed mitózy – buňka pokračuje, jen když je DNA nepoškozená a vše připravené. 2. Dělení řídí geny jako plyn a brzda: onkogen je zaseknutý plyn, který dělení pohání pořád; porouchaný nádorový supresor (například p53) je brzda, která nezastaví ani buňku s poškozenou DNA. 3. Růst nádoru: z normální vrstvy buněk se nekontrolovaným dělením stane hromada buněk, zhoubný nádor pak prorůstá bazální membránou do cév a jeho buňky zakládají metastázy.";

const W = 300;
const H = 262;

// ------------------------------------------------------------ 1. the cycle
const CX = 150;
const CY = 140;
const R0 = 64;
const R1 = 92;
const rad = (d: number) => (d * Math.PI) / 180;
const P = (r: number, a: number): [number, number] => [
  CX + r * Math.sin(rad(a)),
  CY - r * Math.cos(rad(a)),
];
function arc(r0: number, r1: number, a0: number, a1: number) {
  const L = a1 - a0 > 180 ? 1 : 0;
  const [x1, y1] = P(r1, a0);
  const [x2, y2] = P(r1, a1);
  const [x3, y3] = P(r0, a1);
  const [x4, y4] = P(r0, a0);
  return `M${f1(x1)} ${f1(y1)} A${r1} ${r1} 0 ${L} 1 ${f1(x2)} ${f1(y2)} L${f1(x3)} ${f1(y3)} A${r0} ${r0} 0 ${L} 0 ${f1(x4)} ${f1(y4)}Z`;
}
const PHASES: [string, number, number, string][] = [
  ["M", -28, 22, "bz4-cc-m"],
  ["G1", 22, 168, "bz4-cc-g"],
  ["S", 168, 262, "bz4-cc-s"],
  ["G2", 262, 332, "bz4-cc-g"],
];
const CHECKS = [168, 332, 6];

function Cycle() {
  return (
    <Frame w={W} h={H} className="bz4-panel">
      {PHASES.map(([t, a0, a1, cls]) => {
        const [x, y] = P((R0 + R1) / 2, t === "M" ? -17 : (a0 + a1) / 2);
        return (
          <g key={t}>
            <path d={arc(R0, R1, a0, a1)} className={`bz4-o ${cls}`} />
            <text x={x} y={y + 6} textAnchor="middle" className="bz4-cc-ph">
              {t}
            </text>
          </g>
        );
      })}
      {/* direction */}
      <Arrow
        d={`M${f1(P(52, 40)[0])} ${f1(P(52, 40)[1])} A52 52 0 0 1 ${f1(P(52, 142)[0])} ${f1(P(52, 142)[1])}`}
        tone="muted"
      />
      {/* checkpoints */}
      {CHECKS.map((a) => {
        const [x0, y0] = P(R0 - 8, a);
        const [x1, y1] = P(R1 + 8, a);
        const [sx, sy] = P(R1 + 22, a);
        return (
          <g key={a}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} className="bz4-cc-gate" />
            <Stop x={sx} y={sy} />
          </g>
        );
      })}
      <text x={CX} y={CY - 4} textAnchor="middle" className="bz4-lbl bz4-sm">
        je DNA
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" className="bz4-lbl bz4-sm">
        v pořádku?
      </text>
      {/* G0 exit */}
      <Arrow d={`M${f1(P(R1, 70)[0])} ${f1(P(R1, 70)[1])} L${W - 34} 98`} tone="ink" dashed />
      <text x={W - 10} y={90} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">
        G0
      </text>
      <Stop x={14} y={18} />
      <text x={28} y={24} className="bz4-lbl bz4-sm bz4-red-t">
        kontrolní bod
      </text>
    </Frame>
  );
}

function Stop({ x, y }: { x: number; y: number }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    return `${f1(x + Math.cos(a) * 8)} ${f1(y + Math.sin(a) * 8)}`;
  }).join(" ");
  return <polygon points={pts} className="bz4-cc-stop" />;
}

// ------------------------------------------------------------ 2. accelerator and brake
function Pedal({
  x,
  wide,
  broken = false,
  stuck = false,
}: {
  x: number;
  wide: boolean;
  broken?: boolean;
  stuck?: boolean;
}) {
  const { id } = useFig();
  const w = wide ? 56 : 34;
  const top = 64;
  const padL = x - 6 - w / 2;
  return (
    <g>
      <path d={`M${x - 50} 168 H${x + 50}`} className="bz4-o" />
      <rect x={x - 50} y={168} width={100} height={8} fill={pat(id, "d")} />
      <g transform={`rotate(${stuck ? 44 : 0} ${x} 166)`}>
        {/* pedal arm from the hinge up to the pad */}
        <path d={`M${x} 166 L${x - 6} ${top + 40}`} className="bz4-o bz4-cc-arm" />
        {broken && (
          <path d={`M${x - 12} 136 L${x + 1} 130 L${x - 7} 142 L${x + 6} 136`} className="bz4-cc-crack" />
        )}
        <g transform={`rotate(12 ${x - 6} ${top + 40})`}>
          <rect x={padL} y={top} width={w} height={46} rx={6} className="bz4-o bz4-cc-pad" />
          <rect x={padL} y={top} width={w} height={46} rx={6} fill={pat(id, "h")} />
          {stuck && (
            <g>
              <rect x={padL - 20} y={top + 4} width={20} height={38} rx={2} className="bz4-o bz4-cc-wedge" />
              <rect x={padL - 20} y={top + 4} width={20} height={38} rx={2} fill={pat(id, "brick")} />
            </g>
          )}
        </g>
      </g>
      <circle cx={x} cy={166} r={4} className="bz4-o bz4-fill" />
    </g>
  );
}

function Pedals() {
  return (
    <Frame w={W} h={H} className="bz4-panel">
      <text x={76} y={26} textAnchor="middle" className="bz4-lbl bz4-b">
        plyn
      </text>
      <text x={224} y={26} textAnchor="middle" className="bz4-lbl bz4-b">
        brzda
      </text>
      <Pedal x={80} wide={false} stuck />
      <Pedal x={228} wide broken />
      <text x={76} y={200} textAnchor="middle" className="bz4-lbl bz4-b bz4-red-t">
        onkogen
      </text>
      <text x={76} y={220} textAnchor="middle" className="bz4-lbl bz4-sm">
        zaseknutý plyn:
      </text>
      <text x={76} y={238} textAnchor="middle" className="bz4-lbl bz4-sm">
        „děl se“ pořád
      </text>
      <text x={224} y={200} textAnchor="middle" className="bz4-lbl bz4-b bz4-red-t">
        supresor p53
      </text>
      <text x={224} y={220} textAnchor="middle" className="bz4-lbl bz4-sm">
        porouchaná brzda:
      </text>
      <text x={224} y={238} textAnchor="middle" className="bz4-lbl bz4-sm">
        nezastaví nic
      </text>
      <line x1={W / 2} y1={40} x2={W / 2} y2={244} className="bz4-lead bz4-dash" />
    </Frame>
  );
}

// ------------------------------------------------------------ 3. tumour growth
function Tissue({ y, stage }: { y: number; stage: 0 | 1 | 2 }) {
  const { id } = useFig();
  const r = rng(11 + stage);
  const x0 = 8;
  const x1 = W - 8;
  const base = y + 64;
  const cells: { x: number; y: number; bad: boolean }[] = [];
  for (let x = x0 + 9; x < x1 - 4; x += 17) cells.push({ x, y: base - 10, bad: false });
  if (stage >= 1)
    for (let k = 0; k < (stage === 1 ? 7 : 17); k++) {
      const cx = 150 + (r() - 0.5) * (stage === 1 ? 54 : 130);
      const cy = base - 25 - r() * (stage === 1 ? 14 : 18);
      cells.push({ x: cx, y: cy, bad: true });
    }
  return (
    <g>
      {/* basement membrane and the tissue below */}
      <rect x={x0} y={base} width={x1 - x0} height={12} fill={pat(id, "dots")} />
      <path d={`M${x0} ${base} H${x1}`} className="bz4-o bz4-cc-bm" />
      {stage === 2 && (
        <g>
          <path d={`M${x0 + 4} ${base + 7} H${x1 - 4}`} className="bz4-cc-vessel" />
          <path d={blob(150, base + 7, 6, 4.5, 3)} className="bz4-o bz4-thin bz4-cc-bad" />
          <path d={blob(214, base + 7, 6, 4.5, 4)} className="bz4-o bz4-thin bz4-cc-bad" />
          <Arrow d={`M224 ${base + 7} H252`} tone="red" />
        </g>
      )}
      {cells.map((c, i) => (
        <g key={i}>
          <path d={blob(c.x, c.y, 8.5, 9, i + stage * 30, c.bad ? 0.14 : 0.04, 8)} className={`bz4-o bz4-thin ${c.bad ? "bz4-cc-bad" : "bz4-epi"}`} />
          <circle cx={c.x} cy={c.y} r={c.bad ? 3.6 : 2.8} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
        </g>
      ))}
    </g>
  );
}

function Growth() {
  const rows = ["normální tkáň", "nekontrolované dělení", "zhoubný nádor"];
  return (
    <Frame w={W} h={H} className="bz4-panel">
      {rows.map((a, k) => (
        <g key={a}>
          <Tissue y={4 + k * 82} stage={k as 0 | 1 | 2} />
          <text x={8} y={20 + k * 82} className={`bz4-lbl bz4-sm bz4-b ${k === 2 ? "bz4-red-t" : ""}`}>
            {a}
          </text>
        </g>
      ))}
      <text x={W - 8} y={20} textAnchor="end" className="bz4-lbl bz4-sm bz4-cc-note">
        bazální membrána ↓
      </text>
      <text x={W - 8} y={259} textAnchor="end" className="bz4-lbl bz4-sm bz4-cc-note">
        céva: metastázy
      </text>
    </Frame>
  );
}

export default function CancerCellCycle() {
  return (
    <Figure level={10} label={LABEL} max={980} interactive boost={false}>
      <div className="bz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            {
              title: "Kontrolní body",
              art: <Cycle />,
              caption:
                "G1 růst, S kopírování DNA, G2 příprava, M mitóza. Na kontrolních bodech se cyklus zastaví, když je DNA poškozená.",
            },
            {
              title: "Plyn a brzda",
              art: <Pedals />,
              caption:
                "Onkogen pohání dělení pořád. Porouchaný nádorový supresor (p53) nezastaví ani buňku s poškozenou DNA.",
            },
            {
              title: "Růst nádoru",
              art: <Growth />,
              caption:
                "Buňky se množí bez kontroly. Zhoubný nádor prorůstá bazální membránou do cév a šíří se do těla.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
