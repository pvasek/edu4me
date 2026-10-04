import { DrawArrow, Eq, Fade, Figure, Pop, rng } from "./kit";

const LABEL =
  "Způsoby přenosu látek přes membránu. Pasivní transport jde po koncentračním spádu a nepotřebuje ATP: malé molekuly jako kyslík a oxid uhličitý procházejí lipidovou dvojvrstvou prostou difuzí, ionty a glukóza usnadněnou difuzí kanálem nebo přenašečem a voda osmózou přes akvaporiny. Aktivní transport přenáší látky proti spádu bílkovinnou pumpou a spotřebuje ATP, který se rozloží na ADP a fosfát. Velké částice buňka přijímá endocytózou, kdy se membrána vchlípí a uzavře do měchýřku, a vylučuje exocytózou, kdy měchýřek splyne s membránou.";

const W = 440;
const H = 472;
const Y1 = 126;
const Y2 = 344;

/** A phospholipid bilayer along any path: dotted heads on both faces, pale tails inside. */
function Membrane({ d }: { d: string }) {
  return (
    <g>
      <path d={d} className="bz3-mem-heads" />
      <path d={d} className="bz3-mem-tails" />
      <path d={d} className="bz3-mem-mid" />
    </g>
  );
}

function Protein({ x, y, w = 13, h = 44, gap = 8, pump = false }: { x: number; y: number; w?: number; h?: number; gap?: number; pump?: boolean }) {
  if (pump)
    return (
      <g>
        <path
          d={`M${x - 22} ${y - h / 2} H${x - 5} V${y - 6} Q${x} ${y + 4} ${x + 5} ${y - 6} V${y - h / 2} H${x + 22} V${y + h / 2} H${x - 22}Z`}
          className="bz3-protein bz3-pump"
        />
      </g>
    );
  return (
    <g>
      <rect x={x - gap / 2 - w} y={y - h / 2} width={w} height={h} rx={6} className="bz3-protein" />
      <rect x={x + gap / 2} y={y - h / 2} width={w} height={h} rx={6} className="bz3-protein" />
    </g>
  );
}

const O2 = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x - 3} cy={y} r={3.6} className="bz3-o2" />
    <circle cx={x + 3} cy={y} r={3.6} className="bz3-o2" />
  </g>
);
const Ion = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={4} className="bz3-ion" />;
const H2O = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={3.6} className="bz3-o2" />
    <circle cx={x - 3.6} cy={y + 3} r={2} className="bz3-h" />
    <circle cx={x + 3.6} cy={y + 3} r={2} className="bz3-h" />
  </g>
);

function scatter(seed: number, n: number, x0: number, x1: number, y0: number, y1: number, avoid?: [number, number]) {
  const r = rng(seed);
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const x = x0 + r() * (x1 - x0);
    const y = y0 + r() * (y1 - y0);
    if (avoid && x > avoid[0] && x < avoid[1]) continue;
    if (out.some(([a, b]) => Math.hypot(a - x, b - y) < 12)) continue;
    out.push([x, y]);
  }
  return out;
}

function Title({ x, y, t, sub }: { x: number; y: number; t: string; sub?: string }) {
  return (
    <g>
      <text x={x} y={y} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
        {t}
      </text>
      {sub && (
        <text x={x} y={y + 17} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          {sub}
        </text>
      )}
    </g>
  );
}

export default function MembraneTransport() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={600} replay>
      {/* ---------------- passive */}
      <Fade>
        <text x={14} y={22} className="bz3-lbl bz3-b bz3-lvl-t">
          pasivní transport
        </text>
        <text x={W - 14} y={22} textAnchor="end" className="bz3-lbl bz3-sm bz3-lvl-t">
          po spádu, bez ATP
        </text>
        <text x={W - 10} y={Y1 - 28} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          vně
        </text>
        <text x={W - 10} y={Y1 + 40} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          v buňce
        </text>
      </Fade>
      <Membrane d={`M10 ${Y1} H190 M230 ${Y1} H330 M370 ${Y1} H${W - 10}`} />
      <Protein x={210} y={Y1} />
      <Protein x={350} y={Y1} gap={6} />
      {/* diffusion */}
      <Pop delay={0.2}>
        {scatter(1, 7, 20, 140, Y1 - 70, Y1 - 22).map(([x, y], i) => (
          <O2 key={i} x={x} y={y} />
        ))}
        {scatter(2, 2, 20, 140, Y1 + 24, Y1 + 56).map(([x, y], i) => (
          <O2 key={i} x={x} y={y} />
        ))}
        {scatter(3, 7, 160, 262, Y1 - 70, Y1 - 24, [196, 224]).map(([x, y], i) => (
          <Ion key={i} x={x} y={y} />
        ))}
        {scatter(4, 2, 160, 262, Y1 + 24, Y1 + 56).map(([x, y], i) => (
          <Ion key={i} x={x} y={y} />
        ))}
        {scatter(5, 6, 292, 410, Y1 - 70, Y1 - 24, [336, 364]).map(([x, y], i) => (
          <H2O key={i} x={x} y={y} />
        ))}
        {scatter(6, 2, 292, 380, Y1 + 24, Y1 + 56).map(([x, y], i) => (
          <H2O key={i} x={x} y={y} />
        ))}
      </Pop>
      <DrawArrow d={`M78 ${Y1 - 34} V${Y1 + 30}`} tone="lvl" delay={0.5} className="bz3-arr-w" />
      <DrawArrow d={`M210 ${Y1 - 36} V${Y1 + 32}`} tone="lvl" delay={0.6} className="bz3-arr-w" />
      <DrawArrow d={`M350 ${Y1 - 36} V${Y1 + 32}`} tone="blue" delay={0.7} className="bz3-arr-w" />
      <Fade delay={0.8}>
        <Title x={78} y={Y1 + 80} t="prostá difuze" />
        <Eq x={78} y={Y1 + 98} t="O_{2}, CO_{2}" anchor="middle" />
        <Title x={210} y={Y1 + 80} t="usnadněná difuze" sub="kanál, přenašeč" />
        <Title x={350} y={Y1 + 80} t="osmóza" sub="voda akvaporinem" />
      </Fade>

      {/* ---------------- active */}
      <Fade delay={0.3}>
        <line x1={10} x2={W - 10} y1={Y1 + 120} y2={Y1 + 120} className="bz3-rule" />
        <text x={14} y={Y1 + 146} className="bz3-lbl bz3-b bz3-acc-t">
          aktivní transport
        </text>
        <text x={W - 14} y={Y1 + 146} textAnchor="end" className="bz3-lbl bz3-sm bz3-acc-t">
          spotřebuje ATP
        </text>
      </Fade>
      <Membrane
        d={`M10 ${Y2} H66 M114 ${Y2} H196 C204 ${Y2} 206 ${Y2 + 8} 206 ${Y2 + 18} C206 ${Y2 + 46} 254 ${Y2 + 46} 254 ${Y2 + 18} C254 ${Y2 + 8} 256 ${Y2} 264 ${Y2} H326 C334 ${Y2} 336 ${Y2 + 8} 336 ${Y2 + 18} C336 ${Y2 + 46} 384 ${Y2 + 46} 384 ${Y2 + 18} C384 ${Y2 + 8} 386 ${Y2} 394 ${Y2} H${W - 10}`}
      />
      <Protein x={90} y={Y2} pump h={48} />
      <Pop delay={0.4}>
        {scatter(7, 7, 20, 170, Y2 - 70, Y2 - 26).map(([x, y], i) => (
          <Ion key={i} x={x} y={y} />
        ))}
        {scatter(8, 2, 30, 150, Y2 + 30, Y2 + 56, [70, 110]).map(([x, y], i) => (
          <Ion key={i} x={x} y={y} />
        ))}
        <Ion x={90} y={Y2 + 2} />
        {/* endocytosis: particle in the pocket and a pinched-off vesicle */}
        <circle cx={230} cy={Y2 + 20} r={7} className="bz3-food" />
        <circle cx={230} cy={Y2 - 34} r={7} className="bz3-food" />
        <circle cx={286} cy={Y2 + 60} r={13} className="bz3-vesicle" />
        <circle cx={286} cy={Y2 + 60} r={6} className="bz3-food" />
        {/* exocytosis: vesicle opens to the outside, another one on its way */}
        <circle cx={350} cy={Y2 + 22} r={3.5} className="bz3-secr" />
        <circle cx={368} cy={Y2 + 18} r={3.5} className="bz3-secr" />
        <circle cx={346} cy={Y2 - 24} r={3.5} className="bz3-secr" />
        <circle cx={376} cy={Y2 - 40} r={3.5} className="bz3-secr" />
        <circle cx={410} cy={Y2 + 58} r={13} className="bz3-vesicle" />
        <circle cx={406} cy={Y2 + 56} r={3} className="bz3-secr" />
        <circle cx={414} cy={Y2 + 62} r={3} className="bz3-secr" />
      </Pop>
      <DrawArrow d={`M90 ${Y2 + 46} V${Y2 - 42}`} tone="acc" delay={0.8} className="bz3-arr-w" />
      <DrawArrow d={`M230 ${Y2 - 24} V${Y2 + 6}`} tone="lvl" delay={0.9} />
      <DrawArrow d={`M360 ${Y2 + 30} V${Y2 - 40}`} tone="lvl" delay={1} />
      <Fade delay={1}>
        <g>
          <rect x={112} y={Y2 + 34} width={78} height={40} rx={6} className="bz3-tag" />
          <Eq x={151} y={Y2 + 51} t="ATP →" anchor="middle" className="bz3-eq-sm" />
          <Eq x={151} y={Y2 + 67} t="ADP + P" anchor="middle" className="bz3-eq-sm" />
          <path d={`M112 ${Y2 + 46} L104 ${Y2 + 30}`} className="bz3-lead" />
        </g>
        <Title x={70} y={Y2 + 96} t="pumpa" sub="proti spádu" />
        <Title x={230} y={Y2 + 96} t="endocytóza" sub="příjem do měchýřku" />
        <Title x={374} y={Y2 + 96} t="exocytóza" sub="vylučování" />
      </Fade>
    </Figure>
  );
}
