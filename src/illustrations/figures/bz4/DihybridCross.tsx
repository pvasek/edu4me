import { DrawArrow, Fade, Figure, Pop, f1, pat, useFig, type P2, smooth } from "./kit";

const LABEL =
  "Dihybridní křížení hrachu podle Mendela. Alela A (žlutá barva semene) je dominantní nad a (zelená), alela B (kulatý tvar) nad b (svraštělý). Rodiče AABB (žlutá kulatá semena) a aabb (zelená svraštělá) dají v F1 jen semena AaBb, žlutá kulatá. Rostlina F1 tvoří čtyři druhy gamet stejně často: AB, Ab, aB, ab. Kombinační čtverec 4 × 4 dává 16 kombinací a v F2 poměr fenotypů 9 žlutých kulatých : 3 žlutá svraštělá : 3 zelená kulatá : 1 zelené svraštělé – obě vlastnosti se dědí nezávisle.";

const W = 470;
const H = 672;
const CELL = 80;
const GX = 116;
const GY = 250;
const GAM = ["AB", "Ab", "aB", "ab"];

/** a pea seed: round (smooth) or wrinkled, yellow or green */
function Pea({
  x,
  y,
  r = 15,
  round,
  yellow,
}: {
  x: number;
  y: number;
  r?: number;
  round: boolean;
  yellow: boolean;
}) {
  const { id } = useFig();
  const n = 12;
  const pts: P2[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = i % 2 ? 0.86 : 1.02;
    return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.94];
  });
  const d = round ? "" : smooth(pts, true, 1.1);
  const cls = yellow ? "bz4-pea-y" : "bz4-pea-g";
  return (
    <g>
      {round ? (
        <circle cx={x} cy={y} r={r} className={`bz4-o ${cls}`} />
      ) : (
        <path d={d} className={`bz4-o ${cls}`} />
      )}
      {round ? (
        <path
          d={`M${f1(x - r * 0.55)} ${f1(y - r * 0.2)} A${r * 0.6} ${r * 0.6} 0 0 1 ${f1(x + r * 0.1)} ${f1(y - r * 0.6)}`}
          className="bz4-shine"
        />
      ) : (
        <path
          d={`M${f1(x - r * 0.4)} ${f1(y - r * 0.3)} q${f1(r * 0.3)} ${f1(r * 0.25)} ${f1(r * 0.1)} ${f1(r * 0.6)} M${f1(x + r * 0.25)} ${f1(y - r * 0.45)} q${f1(-r * 0.15)} ${f1(r * 0.35)} ${f1(r * 0.2)} ${f1(r * 0.7)}`}
          className="bz4-o bz4-thin"
        />
      )}
      <circle cx={x} cy={y} r={r} fill={pat(id, "sh")} opacity={0.35} className="bz4-nohit" />
    </g>
  );
}

const geno = (g1: string, g2: string) => {
  // sort each gene's alleles: dominant (upper case) first
  const a = [g1[0], g2[0]].sort().join("");
  const b = [g1[1], g2[1]].sort().join("");
  return a + b;
};
const pheno = (g: string) => ({ yellow: g.includes("A"), round: g.includes("B") });

export default function DihybridCross() {
  return (
    <Figure level={10} label={LABEL} w={W} h={H} max={560} replay>
      {/* key */}
      <text x={W / 2} y={22} textAnchor="middle" className="bz4-lbl bz4-sm">
        <tspan className="bz4-dh-g">A</tspan> žluté &gt; <tspan className="bz4-dh-g">a</tspan> zelené ·{" "}
        <tspan className="bz4-dh-g">B</tspan> kulaté &gt; <tspan className="bz4-dh-g">b</tspan> svraštělé
      </text>
      {/* parents */}
      <Fade>
        <text x={18} y={70} className="bz4-dh-gen">P</text>
        <Pea x={120} y={64} r={19} round yellow />
        <text x={150} y={62} className="bz4-dh-g bz4-dh-big">AABB</text>
        <text x={150} y={80} className="bz4-lbl bz4-sm">žluté kulaté</text>
        <text x={W / 2 + 10} y={70} textAnchor="middle" className="bz4-dh-x">×</text>
        <Pea x={292} y={64} r={19} round={false} yellow={false} />
        <text x={322} y={62} className="bz4-dh-g bz4-dh-big">aabb</text>
        <text x={322} y={80} className="bz4-lbl bz4-sm">zelené svraštělé</text>
      </Fade>
      <DrawArrow d="M235 94 V112" delay={0.3} />
      <Fade delay={0.4}>
        <text x={18} y={140} className="bz4-dh-gen">F1</text>
        <Pea x={180} y={134} r={19} round yellow />
        <text x={210} y={132} className="bz4-dh-g bz4-dh-big">AaBb</text>
        <text x={210} y={150} className="bz4-lbl bz4-sm">všechna žlutá kulatá</text>
        <text x={W / 2} y={184} textAnchor="middle" className="bz4-lbl bz4-sm">
          F1 × F1: každá rostlina tvoří 4 druhy gamet, každý v ¼ případů
        </text>
      </Fade>
      {/* gametes */}
      <Fade delay={0.6}>
        <text x={GX + 2 * CELL} y={GY - 38} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
          pylová zrna (♂)
        </text>
        <text
          x={GX - 50}
          y={GY + 2 * CELL}
          textAnchor="middle"
          transform={`rotate(-90 ${GX - 50} ${GY + 2 * CELL})`}
          className="bz4-lbl bz4-sm bz4-b"
        >
          vajíčka (♀)
        </text>
        {GAM.map((g, i) => (
          <g key={g}>
            <circle cx={GX + i * CELL + CELL / 2} cy={GY - 16} r={14} className="bz4-o bz4-thin bz4-lvlsoft-f" />
            <text x={GX + i * CELL + CELL / 2} y={GY - 11.5} textAnchor="middle" className="bz4-dh-g">
              {g}
            </text>
            <circle cx={GX - 20} cy={GY + i * CELL + CELL / 2} r={14} className="bz4-o bz4-thin bz4-lvlsoft-f" />
            <text x={GX - 20} y={GY + i * CELL + CELL / 2 + 4.5} textAnchor="middle" className="bz4-dh-g">
              {g}
            </text>
          </g>
        ))}
      </Fade>
      {/* the square */}
      {GAM.map((r, i) =>
        GAM.map((c, j) => {
          const g = geno(r, c);
          const p = pheno(g);
          const x = GX + j * CELL;
          const y = GY + i * CELL;
          const cls = p.round && p.yellow ? "bz4-fill" : p.round || p.yellow ? "bz4-fill2" : "bz4-fill3";
          return (
            <Pop key={`${i}${j}`} delay={0.7 + (i * 4 + j) * 0.04}>
              <rect x={x} y={y} width={CELL} height={CELL} className={`bz4-o bz4-thin ${cls}`} />
              <Pea x={x + CELL / 2} y={y + 32} round={p.round} yellow={p.yellow} />
              <text x={x + CELL / 2} y={y + 68} textAnchor="middle" className="bz4-dh-g">
                {g}
              </text>
            </Pop>
          );
        }),
      )}
      <rect x={GX} y={GY} width={4 * CELL} height={4 * CELL} className="bz4-o" fill="none" />
      {/* the ratio */}
      <Fade delay={1.5}>
        <text x={18} y={GY + 4 * CELL + 40} className="bz4-dh-gen">F2</text>
        {(
          [
            [9, true, true, "žluté kulaté"],
            [3, false, true, "žluté svraštělé"],
            [3, true, false, "zelené kulaté"],
            [1, false, false, "zelené svraštělé"],
          ] as const
        ).map(([n, round, yellow, t], k) => {
          const x = 92 + k * 98;
          const y = GY + 4 * CELL + 36;
          return (
            <g key={t}>
              <text x={x - 4} y={y + 8} textAnchor="end" className="bz4-dh-n">
                {n}
              </text>
              <Pea x={x + 16} y={y} r={14} round={round} yellow={yellow} />
              {k < 3 && (
                <text x={x + 64} y={y + 8} textAnchor="middle" className="bz4-dh-n">
                  :
                </text>
              )}
              <text x={x + 12} y={y + 34} textAnchor="middle" className="bz4-lbl bz4-sm">
                {t.split(" ")[0]}
              </text>
              <text x={x + 12} y={y + 50} textAnchor="middle" className="bz4-lbl bz4-sm">
                {t.split(" ")[1]}
              </text>
            </g>
          );
        })}
      </Fade>
    </Figure>
  );
}
