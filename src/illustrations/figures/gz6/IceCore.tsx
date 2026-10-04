import { Draw, Eq, Fade, Figure, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Ledové jádro z Antarktidy (EPICA Dome C, hloubka přes 3 200 m) a co se z něj dá vyčíst. Sníh se každý rok ukládá v nové vrstvě, takže hlouběji je starší led; vrstvy se tlakem ztenčují. V ledu jsou uzavřené vzduchové bublinky – vzorky tehdejší atmosféry. Z nich a ze složení ledu sestavíme křivky za posledních 800 000 let (zjednodušeně): koncentrace CO₂ kolísala mezi asi 170 a 300 ppm a teplota v Antarktidě se střídavě měnila mezi dobami ledovými (asi o 9 °C chladněji než dnes) a teplými obdobími. Obě křivky jdou spolu. Dnešní koncentrace CO₂ asi 425 ppm (Mauna Loa 2024) je daleko nad celým rozpětím za 800 000 let.";

const W = 480;
const H = 444;
// core
const CL = 50;
const CR = 96;
const CT = 62;
const CB = 400;
// graph
const GX0 = 216;
const GX1 = 466;
const C_T = 66;
const C_B = 214;
const T_T = 250;
const T_B = 378;
const gx = (ka: number) => GX1 - ((GX1 - GX0) * ka) / 800;
const gc = (ppm: number) => C_B - ((C_B - C_T) * (ppm - 160)) / (440 - 160);
const gt = (dt: number) => T_B - ((T_B - T_T) * (dt + 10)) / 14;

/** simplified EPICA Dome C CO₂ record (ka before present, ppm) */
const CO2: [number, number][] = [
  [800, 200], [792, 260], [780, 240], [770, 200], [748, 192], [730, 230], [712, 240], [700, 215],
  [690, 240], [676, 190], [667, 172], [650, 195], [630, 215], [610, 262], [592, 240], [575, 225],
  [560, 205], [545, 192], [530, 225], [505, 245], [490, 235], [470, 205], [445, 190], [430, 195],
  [412, 285], [400, 270], [380, 230], [355, 195], [340, 205], [330, 298], [318, 250], [300, 235],
  [285, 245], [268, 200], [252, 200], [242, 260], [232, 245], [218, 260], [200, 230], [180, 200],
  [160, 190], [150, 192], [140, 200], [130, 285], [120, 270], [110, 235], [95, 225], [75, 215],
  [60, 205], [40, 200], [22, 186], [18, 190], [11, 262], [6, 265], [1, 280], [0, 280],
];
/** Antarctic temperature anomaly follows CO₂ closely (simplified, °C vs the last millennium) */
const DT: [number, number][] = CO2.map(([ka, c]) => {
  let t = (c - 278) / 11.5;
  if (ka >= 125 && ka <= 132) t += 2;
  if (ka >= 400 && ka <= 415) t += 0.6;
  return [ka, Math.max(-9.6, Math.min(3.8, t))];
});

function smooth(pts: [number, number][]) {
  const P = pts;
  let d = `M${f1(P[0][0])} ${f1(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

const CO2_PATH = smooth(CO2.map(([k, c]) => [gx(k), gc(c)]));
const DT_PATH = smooth(DT.map(([k, t]) => [gx(k), gt(t)]));

function Core() {
  const { id } = useFig();
  // annual layers, thinning with depth
  const lines: number[] = [];
  let y = CT + 3;
  while (y < CB - 2) {
    lines.push(y);
    const f = (y - CT) / (CB - CT);
    y += 7.5 * (1 - f) + 1.6;
  }
  const R = rng(7);
  const bubbles = Array.from({ length: 16 }, () => [146 + (R() - 0.5) * 54, 150 + (R() - 0.5) * 54, 1.6 + R() * 2.6]);
  return (
    <g>
      <rect x={CL} y={CT} width={CR - CL} height={CB - CT} className="gz6-ice" />
      <rect x={CL} y={CT} width={CR - CL} height={CB - CT} fill={pat(id, "hi")} opacity={0.4} />
      {lines.map((ly, i) => (
        <path key={i} d={`M${CL} ${f1(ly)} H${CR}`} className="gz6-o gz6-thin" style={{ opacity: 0.45 }} />
      ))}
      <ellipse cx={(CL + CR) / 2} cy={CT} rx={(CR - CL) / 2} ry={6} className="gz6-ice gz6-o" />
      <path d={`M${CL} ${CT} V${CB} A${(CR - CL) / 2} 6 0 0 0 ${CR} ${CB} V${CT}`} className="gz6-o" />
      {/* depth scale (m) */}
      {[0, 1000, 2000, 3000].map((m) => {
        const yy = CT + ((CB - CT) * m) / 3200;
        return (
          <g key={m}>
            <path d={`M${CL - 6} ${f1(yy)} H${CL}`} className="gz6-o gz6-thin" />
            <text x={CL - 8} y={yy + 4} textAnchor="end" className="gz6-num" style={{ fontSize: 11 }}>
              {m === 0 ? "0 m" : m === 3000 ? "3 000 m" : `${m / 1000} 000`}
            </text>
          </g>
        );
      })}

      {/* magnified piece with air bubbles */}
      <rect x={CL} y={144} width={CR - CL} height={14} className="gz6-o gz6-lvl-s" fill="none" />
      <path d={`M${CR} 144 L118 124 M${CR} 158 L118 176`} className="gz6-lead" />
      <circle cx={146} cy={150} r={34} className="gz6-ice" />
      <path d="M112 136 H180 M112 162 H180" className="gz6-o gz6-thin" style={{ opacity: 0.5 }} />
      {bubbles.map(([bx, by, r], i) =>
        Math.hypot(bx - 146, by - 150) < 30 - r ? (
          <circle key={i} cx={f1(bx)} cy={f1(by)} r={f1(r)} className="gz6-tag" style={{ strokeWidth: 0.8 }} />
        ) : null,
      )}
      <circle cx={146} cy={150} r={34} className="gz6-o gz6-lvl-s" fill="none" style={{ strokeWidth: 1.8 }} />
      <text x={146} y={204} textAnchor="middle" className="gz6-lbl gz6-b">
        bublinky
      </text>
      <text x={146} y={220} textAnchor="middle" className="gz6-lbl gz6-sm">
        vzduchu =
      </text>
      <text x={146} y={236} textAnchor="middle" className="gz6-lbl gz6-sm">
        vzorek staré
      </text>
      <text x={146} y={252} textAnchor="middle" className="gz6-lbl gz6-sm">
        atmosféry
      </text>
      <text x={104} y={84} className="gz6-lbl gz6-sm">
        roční vrstvy
      </text>
      <path d="M102 80 L92 80" className="gz6-lead" />
      <text x={73} y={CB + 26} textAnchor="middle" className="gz6-lbl gz6-b">
        ≈ 800 000 let
      </text>
      <text x={150} y={CB - 26} textAnchor="middle" className="gz6-lbl gz6-sm">
        hlouběji =
      </text>
      <text x={150} y={CB - 10} textAnchor="middle" className="gz6-lbl gz6-sm">
        starší led
      </text>
    </g>
  );
}

function Graph() {
  return (
    <g>
      {/* axes */}
      {[200, 280, 360, 440].map((p) => (
        <g key={p}>
          <path d={`M${GX0} ${f1(gc(p))} H${GX1}`} className="gz6-grid" />
          <text x={GX0 - 5} y={gc(p) + 4} textAnchor="end" className="gz6-num" style={{ fontSize: 11 }}>
            {p}
          </text>
        </g>
      ))}
      {[-8, -4, 0, 4].map((t) => (
        <g key={t}>
          <path d={`M${GX0} ${f1(gt(t))} H${GX1}`} className={t === 0 ? "gz6-o gz6-thin gz6-dash" : "gz6-grid"} />
          <text x={GX0 - 5} y={gt(t) + 4} textAnchor="end" className="gz6-num" style={{ fontSize: 11 }}>
            {t > 0 ? `+${t}` : t < 0 ? `−${-t}` : "0"}
          </text>
        </g>
      ))}
      <path d={`M${GX0} ${C_T - 6} V${C_B} H${GX1}`} className="gz6-o" />
      <path d={`M${GX0} ${T_T - 6} V${T_B} H${GX1}`} className="gz6-o" />
      {[800, 600, 400, 200, 0].map((k) => (
        <g key={k}>
          <path d={`M${f1(gx(k))} ${T_B} v5`} className="gz6-o gz6-thin" />
          <text x={gx(k)} y={T_B + 18} textAnchor={k === 0 ? "end" : "middle"} className="gz6-num" style={{ fontSize: 11 }}>
            {k === 0 ? "dnes" : k}
          </text>
        </g>
      ))}
      <text x={(GX0 + GX1) / 2} y={T_B + 36} textAnchor="middle" className="gz6-lbl gz6-sm">
        tisíce let před současností
      </text>
      <Eq x={GX0} y={C_T - 14} t="CO_{2} v atmosféře (ppm)" className="gz6-tone-lvl" />
      <text x={GX0} y={T_T - 14} className="gz6-eq gz6-tone-red">
        teplota oproti dnešku (°C)
      </text>

      {/* max of 800 000 years and today */}
      <path d={`M${GX0} ${f1(gc(300))} H${GX1}`} className="gz6-o gz6-thin gz6-dash gz6-lvl-s" />
      <Draw d={CO2_PATH} className="gz6-curve gz6-curve-lvl" delay={0.1} style={{ strokeWidth: 2 }} />
      <Draw d={DT_PATH} className="gz6-curve gz6-curve-red" delay={0.3} style={{ strokeWidth: 2 }} />
      <Draw d={`M${GX1} ${f1(gc(280))} V${f1(gc(425))}`} className="gz6-curve gz6-curve-red" delay={1.3} style={{ strokeWidth: 3 }} />
      <Fade delay={1.6}>
        <circle cx={GX1} cy={gc(425)} r={4} style={{ fill: "var(--bad)" }} />
        <text x={GX1 - 10} y={gc(425) + 5} textAnchor="end" className="gz6-lbl gz6-b gz6-red-t gz6-halo">
          2024: ≈ 425 ppm
        </text>
        <text x={GX1 - 10} y={gc(300) - 6} textAnchor="end" className="gz6-lbl gz6-sm gz6-lvl-t gz6-halo">
          max. 300 ppm za 800 000 let
        </text>
      </Fade>
      <Fade delay={1.2}>
        <text x={GX1 - 4} y={T_B - 8} textAnchor="end" className="gz6-lbl gz6-sm gz6-halo">
          doba ledová
        </text>
        <text x={gx(128) - 8} y={gt(3.8) + 12} textAnchor="end" className="gz6-lbl gz6-sm gz6-halo">
          teplé období
        </text>
      </Fade>
    </g>
  );
}

function Plate() {
  return (
    <>
      <text x={8} y={22} className="gz6-lbl gz6-b gz6-big">
        ledové jádro
      </text>
      <text x={8} y={40} className="gz6-lbl gz6-sm">
        EPICA Dome C, Antarktida
      </text>
      <text x={GX1} y={22} textAnchor="end" className="gz6-lbl gz6-sm">
        zjednodušeno
      </text>
      <Core />
      <Graph />
    </>
  );
}

export default function IceCore() {
  return (
    <Figure label={LABEL} w={W} h={H} max={660} boost={false} replay>
      <Plate />
    </Figure>
  );
}
