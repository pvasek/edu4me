import { Draw, Fade, Figure, f1 } from "./kit";

const LABEL =
  "Křivky přežívání na logaritmické stupnici: kolik z 1 000 narozených jedinců je naživu v určitém věku. Typ I (člověk, slon) – téměř všichni přežijí do vysokého věku a umírají hlavně ve stáří; tak žijí K-stratégové. Typ II (pěvci) – v každém věku umírá stejný podíl jedinců, na logaritmické stupnici je to přímka. Typ III (dub, kapr) – obrovská většina zahyne jako semena nebo mláďata a jen pár jedinců se dožije dospělosti; tak žijí r-stratégové.";

const W = 480;
const H = 396;
const L = 76;
const R = 456;
const T = 52;
const B = 300;
const px = (p: number) => L + ((R - L) * p) / 100;
const py = (n: number) => T + ((3 - Math.log10(n)) * (B - T)) / 3;

/** smooth curve through points (Catmull-Rom → Bézier) */
function smooth(pts: [number, number][]) {
  const P = pts.map(([p, n]) => [px(p), py(n)] as [number, number]);
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

const TYPE1 = smooth([
  [0, 1000],
  [20, 985],
  [40, 960],
  [60, 900],
  [75, 700],
  [85, 400],
  [93, 100],
  [97, 15],
  [100, 1],
]);
const TYPE2 = `M${px(0)} ${py(1000)} L${px(100)} ${py(1)}`;
const TYPE3 = smooth([
  [0, 1000],
  [2, 250],
  [5, 70],
  [10, 30],
  [20, 16],
  [40, 9],
  [60, 5.5],
  [80, 3],
  [100, 1],
]);

function Plate() {
  return (
    <>
      {/* grid and axes */}
      {[1000, 100, 10, 1].map((n) => (
        <g key={n}>
          <path d={`M${L} ${py(n)} H${R}`} className="bz8-grid" />
          <text x={L - 8} y={py(n) + 4.5} textAnchor="end" className="bz8-num">
            {n === 1000 ? "1 000" : n}
          </text>
        </g>
      ))}
      {[0, 20, 40, 60, 80, 100].map((p) => (
        <g key={p}>
          <path d={`M${px(p)} ${B} v6`} className="bz8-o bz8-thin" />
          <text x={px(p)} y={B + 22} textAnchor="middle" className="bz8-num">
            {p}
          </text>
        </g>
      ))}
      <path d={`M${L} ${T - 12} V${B} H${R + 8}`} className="bz8-o" />
      <text
        x={20}
        y={(T + B) / 2}
        textAnchor="middle"
        transform={`rotate(-90 20 ${(T + B) / 2})`}
        className="bz8-lbl bz8-sm"
      >
        přeživší z 1 000
      </text>
      <text x={(L + R) / 2} y={B + 46} textAnchor="middle" className="bz8-lbl bz8-sm">
        věk (% maximální délky života)
      </text>

      {/* curves */}
      <Draw d={TYPE1} className="bz8-curve bz8-curve-1" delay={0.1} />
      <Draw d={TYPE2} className="bz8-curve bz8-curve-2" delay={0.5} />
      <Draw d={TYPE3} className="bz8-curve bz8-curve-3" delay={0.9} />

      <Fade delay={0.9}>
        <text x={px(4)} y={T - 20} className="bz8-lbl bz8-b bz8-lvl-t">
          typ I · člověk, slon
        </text>
        <text x={px(100)} y={T - 20} textAnchor="end" className="bz8-lbl bz8-sm bz8-lvl-t">
          K-stratégové
        </text>
        <text x={px(57)} y={py(40) - 6} className="bz8-lbl bz8-b bz8-acc-t">
          typ II · pěvci
        </text>
        <text x={px(13)} y={py(8) + 24} className="bz8-lbl bz8-b bz8-teal-t">
          typ III · dub, kapr
        </text>
        <text x={px(13)} y={py(8) + 42} className="bz8-lbl bz8-sm bz8-teal-t">
          r-stratégové
        </text>
      </Fade>
      <Fade delay={1.5}>
        <text x={(L + R) / 2} y={H - 8} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
          logaritmická stupnice: každý dílek nahoru = 10× víc
        </text>
      </Fade>
    </>
  );
}

export default function SurvivorshipCurves() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
