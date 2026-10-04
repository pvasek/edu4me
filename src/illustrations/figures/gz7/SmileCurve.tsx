import { Draw, Fade, Figure, Lbl, f1 } from "./kit";

const LABEL =
  "Úsměvová křivka hodnotového řetězce: na vodorovné ose fáze výroby od výzkumu a vývoje přes design, výrobu součástek, montáž a logistiku až po značku, marketing a servis, na svislé ose přidaná hodnota. Nejvíc vydělávají oba konce – výzkum, design, značka a služby, které sídlí hlavně ve vyspělých státech. Nejméně vynáší montáž, kterou dělají státy s levnou prací, například Čína, Vietnam nebo Mexiko. Česko vyrábí hlavně díly a montuje, například automobily. Oproti 70. létům se křivka prohloubila.";

const W = 480;
const H = 420;
const L = 46;
const R = 466;
const T = 54;
const B = 310;
const STAGES = [
  ["výzkum", "a vývoj"],
  ["design"],
  ["součástky"],
  ["montáž"],
  ["logistika"],
  ["značka,", "marketing"],
  ["servis"],
];
const xs = (i: number) => L + 30 + (i * (R - L - 60)) / (STAGES.length - 1);
const ys = (v: number) => B - (v / 100) * (B - T);

function smooth(vals: number[]) {
  const P = vals.map((v, i) => [xs(i), ys(v)] as [number, number]);
  let d = `M${f1(P[0][0])} ${f1(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

const NOW = [90, 76, 40, 12, 36, 78, 86];
const PAST = [66, 60, 50, 42, 48, 58, 62];

export default function SmileCurve() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={620} replay>
      {/* axes */}
      <path d={`M${L} ${T - 18} V${B} H${R}`} className="gz7-o" />
      <text x={L - 12} y={(T + B) / 2} textAnchor="middle" transform={`rotate(-90 ${L - 12} ${(T + B) / 2})`} className="gz7-lbl gz7-sm">
        přidaná hodnota →
      </text>
      {STAGES.map((s, i) => (
        <g key={i}>
          <path d={`M${xs(i)} ${B} v6`} className="gz7-o gz7-thin" />
          {s.map((t, k) => (
            <text key={k} x={xs(i)} y={B + 24 + k * 16} textAnchor="middle" className={`gz7-lbl gz7-sm ${i === 3 ? "gz7-b" : ""}`}>
              {t}
            </text>
          ))}
        </g>
      ))}
      <text x={(L + R) / 2} y={B + 76} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t">
        před výrobou ← výroba → po výrobě
      </text>

      {/* curves */}
      <Draw d={smooth(PAST)} className="gz7-curve gz7-curve-past" delay={0.1} />
      <Draw d={smooth(NOW)} className="gz7-curve gz7-curve-now" delay={0.5} />
      <Fade delay={1.3}>
        <text x={xs(0) - 4} y={ys(66) + 24} className="gz7-lbl gz7-sm gz7-muted-t">
          70. léta
        </text>
        <text x={xs(6) + 4} y={ys(86) - 14} textAnchor="end" className="gz7-lbl gz7-b gz7-lvl-t">
          dnes
        </text>
      </Fade>

      {/* who sits where */}
      <Fade delay={1.6}>
        <Lbl x={xs(0) - 14} y={T - 22} tx={xs(0) + 6} ty={ys(90) - 6} className="gz7-sm gz7-b">
          USA, Japonsko, Německo
        </Lbl>
        <Lbl x={xs(6) + 8} y={T - 22} tx={xs(5) + 8} ty={ys(80) - 6} anchor="end" className="gz7-sm gz7-b">
          Apple, Nike: značka
        </Lbl>
        <Lbl x={xs(3)} y={T + 8} tx={xs(3)} ty={ys(12) - 4} anchor="middle" className="gz7-sm gz7-b gz7-red-t">
          Čína, Vietnam, Mexiko: levná práce
        </Lbl>
        <Lbl x={L + 10} y={250} tx={xs(2) + 16} ty={ys(27) + 3} className="gz7-sm gz7-b gz7-lvl-t">
          {"Česko: díly,\nmontáž aut"}
        </Lbl>
      </Fade>
      <text x={W - 4} y={H - 6} textAnchor="end" className="gz7-src">
        podle Stana Shiha (Acer, 1992), schéma
      </text>
    </Figure>
  );
}
