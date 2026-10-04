import type { ReactNode } from "react";
import { DrawArrow, Eq, Fade, Figure, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Zpětné vazby oteplování kolem středu „globální oteplení“. Tři kladné zpětné vazby oteplení zesilují: led a albedo (taje led a sníh, tmavší povrch má nižší albedo a pohltí víc slunečního záření), permafrost (rozmrzlá půda se rozkládá a uvolňuje methan a CO₂, které zesílí skleníkový efekt) a vodní pára (teplejší vzduch pojme víc vodní páry, asi o 7 % na každý 1 °C, a pára je skleníkový plyn). Záporná zpětná vazba oteplení tlumí: víc CO₂ urychlí růst rostlin, ty fotosyntézou odeberou část CO₂ z atmosféry; tato vazba je ale slabší než ty kladné.";

const W = 440;
const H = 474;
const C: [number, number] = [220, 238];

type Q = {
  at: [number, number];
  sign: "+" | "−";
  title: string;
  lines: string[];
  side: "l" | "r";
  top: boolean;
  icon: ReactNode;
  d: number;
};

function Loop({ q }: { q: Q }) {
  const [cx, cy] = C;
  const [qx, qy] = q.at;
  const L = Math.hypot(qx - cx, qy - cy);
  const ux = (qx - cx) / L;
  const uy = (qy - cy) / L;
  const nx = -uy;
  const ny = ux;
  const P = (t: number, off: number): [number, number] => [cx + ux * t + nx * off, cy + uy * t + ny * off];
  const a0 = P(54, 9);
  const a1 = P(L - 48, 9);
  const am = P(L / 2, 24);
  const b0 = P(L - 48, -9);
  const b1 = P(54, -9);
  const bm = P(L / 2, -24);
  const mid = P(L / 2, 0);
  const tone = q.sign === "+" ? "red" : "green";
  return (
    <g>
      <DrawArrow d={`M${f1(a0[0])} ${f1(a0[1])} Q${f1(am[0])} ${f1(am[1])} ${f1(a1[0])} ${f1(a1[1])}`} tone={tone} delay={q.d} />
      <DrawArrow d={`M${f1(b0[0])} ${f1(b0[1])} Q${f1(bm[0])} ${f1(bm[1])} ${f1(b1[0])} ${f1(b1[1])}`} tone={tone} delay={q.d + 0.35} />
      <Pop delay={q.d + 0.5}>
        <circle cx={mid[0]} cy={mid[1]} r={13} className="gz6-tag" style={{ stroke: q.sign === "+" ? "var(--bad)" : "var(--good)", strokeWidth: 1.8 }} />
        <text x={mid[0]} y={mid[1] + 6.5} textAnchor="middle" className={`gz6-sign ${q.sign === "+" ? "gz6-tone-red" : "gz6-tone-green"}`} style={{ fontSize: 19 }}>
          {q.sign}
        </text>
      </Pop>
    </g>
  );
}

function Text({ q }: { q: Q }) {
  const x = q.side === "l" ? 8 : W - 8;
  const anchor = q.side === "l" ? "start" : "end";
  const y0 = q.top ? 22 : 398;
  return (
    <Fade delay={q.d - 0.1}>
      <text x={x} y={y0} textAnchor={anchor} className={`gz6-lbl gz6-b ${q.sign === "+" ? "gz6-red-t" : "gz6-good-t"}`}>
        {q.title}
      </text>
      {q.lines.map((l, i) => (
        <text key={i} x={x} y={y0 + 18 + i * 16} textAnchor={anchor} className="gz6-lbl gz6-sm">
          {l}
        </text>
      ))}
    </Fade>
  );
}

function IceIcon() {
  const { id } = useFig();
  return (
    <g>
      <rect x={58} y={150} width={84} height={18} className="gz6-sea-deep" />
      <rect x={58} y={150} width={84} height={18} fill={pat(id, "h")} />
      <path d="M58 150 L64 142 H96 L100 150 Z" className="gz6-ice gz6-o" />
      <path d="M58 150 H142 M58 168 H142" className="gz6-o gz6-thin" />
      <circle cx={70} cy={104} r={9} className="gz6-sun gz6-o" />
      <path d="M78 112 L116 146" className="gz6-arr gz6-arr-acc" />
      <path d="M78 112 L80 146" className="gz6-arr gz6-arr-acc" />
      <path d="M82 144 L94 116" className="gz6-arr gz6-arr-acc gz6-dash" />
    </g>
  );
}
function PermaIcon() {
  const { id } = useFig();
  return (
    <g>
      <rect x={300} y={136} width={92} height={32} className="gz6-soil" />
      <rect x={300} y={136} width={92} height={32} fill={pat(id, "dots")} />
      <path d="M312 150 h16 M342 158 h18 M366 146 h14" className="gz6-o gz6-blue-s" style={{ strokeWidth: 3, opacity: 0.6 }} />
      <path d="M300 136 H392" className="gz6-o" />
      {[318, 346, 372].map((x, i) => (
        <circle key={x} cx={x} cy={124 - i * 5} r={4} className="gz6-tag" style={{ strokeWidth: 0.9 }} />
      ))}
      <Eq x={346} y={102} t="CH_{4}" anchor="middle" className="gz6-eq-sm" />
    </g>
  );
}
function VapourIcon() {
  return (
    <g>
      <path
        d="M66 336 Q54 336 56 326 Q58 316 70 318 Q74 304 90 307 Q100 296 116 304 Q130 300 134 314 Q148 316 144 328 Q142 336 132 336 Z"
        className="gz6-cloud gz6-o"
      />
      {[72, 88, 104, 120].map((x, i) => (
        <path key={x} d={`M${x} ${360 - (i % 2) * 6} q4 -6 0 -12 t0 -12`} className="gz6-o gz6-blue-s" style={{ strokeWidth: 1.4 }} />
      ))}
      <Eq x={100} y={378} t="H_{2}O" anchor="middle" className="gz6-eq-sm" />
    </g>
  );
}
function PlantIcon() {
  return (
    <g>
      <path d="M348 372 V334" className="gz6-o" style={{ strokeWidth: 3 }} />
      <path d="M348 344 Q326 340 324 322 Q344 320 348 344 Z M348 336 Q370 332 372 312 Q350 312 348 336 Z" className="gz6-veg gz6-o" />
      <path d="M326 372 H372" className="gz6-o" />
      <Eq x={386} y={318} t="CO_{2}" anchor="middle" className="gz6-eq-sm" />
      <path d="M386 324 Q382 336 368 330" className="gz6-arr gz6-arr-green" />
    </g>
  );
}

const QS: Q[] = [
  {
    at: [100, 140],
    sign: "+",
    title: "led a albedo",
    lines: ["taje led a sníh →", "tmavší povrch, nižší albedo →", "víc pohlceného záření"],
    side: "l",
    top: true,
    icon: <IceIcon />,
    d: 0.2,
  },
  {
    at: [346, 140],
    sign: "+",
    title: "permafrost",
    lines: ["rozmrzá věčně zmrzlá půda →", "rozklad uvolní methan a CO₂ →", "silnější skleníkový efekt"],
    side: "r",
    top: true,
    icon: <PermaIcon />,
    d: 0.5,
  },
  {
    at: [100, 336],
    sign: "+",
    title: "vodní pára",
    lines: ["teplejší vzduch pojme víc páry", "(≈ 7 % na 1 °C) →", "pára je skleníkový plyn"],
    side: "l",
    top: false,
    icon: <VapourIcon />,
    d: 0.8,
  },
  {
    at: [346, 336],
    sign: "−",
    title: "růst rostlin",
    lines: ["víc CO₂ urychlí fotosyntézu →", "rostliny odeberou část CO₂", "(slabší než kladné vazby)"],
    side: "r",
    top: false,
    icon: <PlantIcon />,
    d: 1.1,
  },
];

function Plate() {
  return (
    <>
      {QS.map((q) => (
        <g key={q.title}>
          <Loop q={q} />
          <Fade delay={q.d}>{q.icon}</Fade>
          <Text q={q} />
        </g>
      ))}
      <circle cx={C[0]} cy={C[1]} r={46} className="gz6-warm gz6-o" />
      <circle cx={C[0]} cy={C[1]} r={40} className="gz6-o gz6-thin gz6-red-s" fill="none" />
      <text x={C[0]} y={C[1] - 2} textAnchor="middle" className="gz6-lbl gz6-b">
        globální
      </text>
      <text x={C[0]} y={C[1] + 15} textAnchor="middle" className="gz6-lbl gz6-b">
        oteplení
      </text>
      <Fade delay={1.6}>
        <text x={C[0]} y={C[1] + 72} textAnchor="middle" className="gz6-lbl gz6-sm gz6-red-t">
          + zesiluje
        </text>
        <text x={C[0]} y={C[1] + 89} textAnchor="middle" className="gz6-lbl gz6-sm gz6-good-t">
          − tlumí
        </text>
      </Fade>
    </>
  );
}

export default function ClimateFeedbacks() {
  return (
    <Figure label={LABEL} w={W} h={H} max={600} boost={false} replay>
      <Plate />
    </Figure>
  );
}
