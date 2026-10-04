import { Draw, DrawArrow, Fade, Figure, f1 } from "./kit";

const LABEL =
  "Růžice světových stran: hlavní světové strany sever (S), východ (V), jih (J) a západ (Z) a vedlejší severovýchod (SV), jihovýchod (JV), jihozápad (JZ) a severozápad (SZ). Azimut je úhel měřený od severu ve směru hodinových ručiček; směr s azimutem 60° leží mezi severovýchodem a východem.";

const W = 480;
const H = 500;
const C = 240;
const CY = 236;
const RING = 150;
const RAD = Math.PI / 180;
/** point at azimuth `az` (0 = north, clockwise) and radius r */
const pt = (az: number, r: number): [number, number] => [C + r * Math.sin(az * RAD), CY - r * Math.cos(az * RAD)];

const DIRS: [string, string, number][] = [
  ["S", "sever", 0],
  ["SV", "", 45],
  ["V", "východ", 90],
  ["JV", "", 135],
  ["J", "jih", 180],
  ["JZ", "", 225],
  ["Z", "západ", 270],
  ["SZ", "", 315],
];

function point(az: number, len: number, w: number) {
  const tip = pt(az, len);
  const l = pt(az - 90, w);
  const r = pt(az + 90, w);
  return {
    left: `M${C} ${CY} L${f1(l[0])} ${f1(l[1])} L${f1(tip[0])} ${f1(tip[1])}Z`,
    right: `M${C} ${CY} L${f1(r[0])} ${f1(r[1])} L${f1(tip[0])} ${f1(tip[1])}Z`,
  };
}

const AZ = 60;

export default function CompassRose() {
  const a0 = pt(0, 104);
  const a1 = pt(AZ, 104);
  const lab = pt(AZ / 2, 122);
  const tip = pt(AZ, RING - 6);
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={520} replay>
      {/* ring with ticks every 10° */}
      <circle cx={C} cy={CY} r={RING} className="gz1-fill gz1-o" />
      <circle cx={C} cy={CY} r={RING - 12} className="gz1-o gz1-thin" />
      {Array.from({ length: 36 }, (_, i) => {
        const [x1, y1] = pt(i * 10, RING);
        const [x2, y2] = pt(i * 10, RING - (i % 9 === 0 ? 12 : 6));
        return <path key={i} d={`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`} className="gz1-o gz1-thin" />;
      })}
      {/* the star: intermediate points first, main points on top */}
      {[45, 135, 225, 315, 0, 90, 180, 270].map((az) => {
        const main = az % 90 === 0;
        const p = point(az, main ? 128 : 78, main ? 16 : 11);
        return (
          <g key={az}>
            <path d={p.left} className={az === 0 ? "gz1-lvl-f gz1-o gz1-thin" : "gz1-fill gz1-o gz1-thin"} />
            <path d={p.right} className={az === 0 ? "gz1-north-dark gz1-o gz1-thin" : "gz1-star-dark gz1-o gz1-thin"} />
          </g>
        );
      })}
      {/* letters */}
      {DIRS.map(([k, , az]) => {
        const main = az % 90 === 0;
        const [x, y] = pt(az, main ? RING + 26 : RING + 22);
        return (
          <g key={k}>
            <text
              x={f1(x)}
              y={f1(y + 6)}
              textAnchor="middle"
              className={`gz1-dir ${main ? "gz1-dir-main" : ""} ${az === 0 ? "gz1-lvl-t" : ""}`}
            >
              {k}
            </text>
          </g>
        );
      })}
      {DIRS.filter((d) => d[1]).map(([k, name, az]) => {
        const [x, y] = pt(az, RING + 26);
        const dy = az === 0 ? -22 : 24;
        return (
          <text key={k} x={f1(x)} y={f1(y + 6 + dy)} textAnchor="middle" className="gz1-lbl gz1-sm gz1-muted-t">
            {name}
          </text>
        );
      })}
      {/* azimuth 60° */}
      <Draw d={`M${f1(a0[0])} ${f1(a0[1])} A104 104 0 0 1 ${f1(a1[0])} ${f1(a1[1])}`} className="gz1-az-arc" delay={0.4} />
      <DrawArrow d={`M${C} ${CY} L${f1(tip[0])} ${f1(tip[1])}`} tone="acc" delay={0.2} className="gz1-vec" />
      <circle cx={C} cy={CY} r={4} className="gz1-fill gz1-o gz1-thin" />
      <Fade delay={1.1}>
        <text x={f1(lab[0] + 4)} y={f1(lab[1])} textAnchor="middle" className="gz1-lbl gz1-b gz1-acc-t gz1-halo">
          60°
        </text>
      </Fade>
      <Fade delay={1.3}>
        <text x={C} y={H - 30} textAnchor="middle" className="gz1-lbl gz1-b">
          azimut 60°: úhel od severu
        </text>
        <text x={C} y={H - 10} textAnchor="middle" className="gz1-lbl gz1-sm">
          ve směru hodinových ručiček (0° až 360°)
        </text>
      </Fade>
    </Figure>
  );
}
