import { Draw, Fade, Figure, cz, f1 } from "./kit";

const LABEL =
  "Myšlení ve scénářích: vějíř možných budoucností globální teploty od dneška do konce století podle IPCC (2021), oteplení proti období 1850–1900. Do roku 2050 se scénáře liší jen o necelý stupeň (1,6 až 2,4 °C), na konci století už o tři stupně: od 1,4 °C při velmi nízkých emisích po 4,4 °C při velmi vysokých. Nejistota se s časem rozevírá. Zelená čárkovaná čára je cíl Pařížské dohody 1,5 °C. O tom, kudy povedeme, rozhodují emise skleníkových plynů, politika a mezinárodní dohody, technologie a spotřeba.";

const W = 490;
const H = 430;
const L = 54;
const R = 366;
const T = 30;
const B = 300;
const px = (yr: number) => L + ((yr - 2000) / 100) * (R - L);
const py = (t: number) => B - (t / 5) * (B - T);

/** AR6 SPM Table SPM.1 best estimates: 2021–2040, 2041–2060, 2081–2100 */
const SSP = [
  { n: "velmi nízké", v: [1.5, 1.6, 1.4], cls: "gz7-sc-1" },
  { n: "nízké", v: [1.5, 1.7, 1.8], cls: "gz7-sc-2" },
  { n: "střední", v: [1.5, 2.0, 2.7], cls: "gz7-sc-3" },
  { n: "vysoké", v: [1.5, 2.1, 3.6], cls: "gz7-sc-4" },
  { n: "velmi vysoké", v: [1.6, 2.4, 4.4], cls: "gz7-sc-5" },
];
const START: [number, number] = [2015, 1.09]; // 2011–2020

function curve(v: number[]) {
  const P = [START, [2030, v[0]], [2050, v[1]], [2090, v[2]]].map(([y, t]) => [px(y), py(t)]);
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

export default function ScenarioFan() {
  // the fan between the lowest and the highest path (straight segments, a faint fill)
  const top = [START, [2030, 1.6], [2050, 2.4], [2090, 4.4]];
  const bot = [[2090, 1.4], [2050, 1.6], [2030, 1.5]];
  const fan = "M" + [...top, ...bot].map(([y, t]) => `${f1(px(y))} ${f1(py(t))}`).join(" L") + " Z";
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={620} replay>
      {/* grid */}
      {[0, 1, 2, 3, 4, 5].map((t) => (
        <g key={t}>
          <path d={`M${L} ${py(t)} H${R}`} className="gz7-grid" />
          <text x={L - 8} y={py(t) + 4.5} textAnchor="end" className="gz7-num">
            {t}
          </text>
        </g>
      ))}
      {[2000, 2025, 2050, 2075, 2100].map((y) => (
        <g key={y}>
          <path d={`M${px(y)} ${B} v6`} className="gz7-o gz7-thin" />
          <text x={px(y)} y={B + 22} textAnchor="middle" className="gz7-num">
            {y}
          </text>
        </g>
      ))}
      <path d={`M${L} ${T - 10} V${B} H${R + 4}`} className="gz7-o" />
      <text x={L - 30} y={T - 14} className="gz7-lbl gz7-sm">
        oteplení (°C)
      </text>
      {/* 1.5 °C target and the present */}
      <path d={`M${L} ${py(1.5)} H${px(2090)}`} className="gz7-sc-goal" />
      <text x={L + 6} y={py(1.5) - 6} className="gz7-lbl gz7-sm gz7-good-t">
        cíl 1,5 °C
      </text>
      <path d={`M${px(2025)} ${T} V${B}`} className="gz7-o gz7-thin gz7-dash" />
      <text x={px(2025) - 6} y={T + 6} textAnchor="end" className="gz7-lbl gz7-sm gz7-b">
        dnes
      </text>
      <path d={`M${px(2050)} ${T + 20} V${B}`} className="gz7-sc-2050" />
      {/* observed so far */}
      <path d={`M${px(2000)} ${py(0.75)} Q${px(2008)} ${py(0.9)} ${px(START[0])} ${py(START[1])}`} className="gz7-curve gz7-sc-obs" />
      <Fade delay={0.9}>
        <path d={fan} className="gz7-sc-fan" />
      </Fade>
      {/* scenarios */}
      {SSP.map((s, i) => (
        <Draw key={i} d={curve(s.v)} className={`gz7-curve gz7-sc ${s.cls}`} delay={0.2 + i * 0.12} />
      ))}
      <Fade delay={1.2}>
        {SSP.map((s, i) => (
          <text key={i} x={px(2090) + 10} y={py(s.v[2]) + 5} className={`gz7-lbl gz7-sm gz7-b ${s.cls}-t`}>
            {cz(s.v[2], 1)} °C {s.n}
          </text>
        ))}
        <text x={R + 18} y={T - 14} className="gz7-lbl gz7-sm gz7-muted-t">
          emise:
        </text>
        {/* the spread at 2050 vs 2090 */}
        <path d={`M${px(2050) - 8} ${py(2.4)} v${py(1.6) - py(2.4)}`} className="gz7-sc-brace" />
        <text x={px(2050) - 12} y={py(2.5) - 4} textAnchor="end" className="gz7-lbl gz7-sm gz7-halo">
          2050: 1,6–2,4 °C
        </text>
        <text x={px(2067)} y={py(4.55)} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
          nejistota se rozevírá
        </text>
      </Fade>
      {/* what decides */}
      <rect x={20} y={340} width={450} height={66} rx={8} className="gz7-tag-lvl" />
      <text x={245} y={364} textAnchor="middle" className="gz7-lbl gz7-b">
        Kudy půjdeme, rozhodují:
      </text>
      <text x={245} y={388} textAnchor="middle" className="gz7-lbl gz7-sm">
        emise · politika a dohody · technologie · spotřeba a počet lidí
      </text>
      <text x={W - 4} y={H - 4} textAnchor="end" className="gz7-src">
        IPCC AR6 (2021), proti období 1850–1900
      </text>
    </Figure>
  );
}
