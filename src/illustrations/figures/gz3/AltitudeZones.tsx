import type { ReactElement } from "react";
import { Fade, FadePath, Figure, Lbl, Pop, f1, useFig } from "./kit";

const LABEL =
  "Výškové stupně v Alpách. S každými 100 metry výšky klesá teplota vzduchu průměrně o 0,65 °C: když je v 500 m 20 °C, ve 2 500 m je jen 7 °C a ve 4 500 m −6 °C. Proto se s výškou mění rostlinstvo: do 800 m listnaté lesy a pole, v 800–1 500 m smíšené lesy s bukem, jedlí a smrkem, v 1 500–2 000 m jehličnaté lesy se smrkem, modřínem a limbou. Asi ve 2 000 m je horní hranice lesa, nad ní roste kleč a ve 2 300–2 800 m alpínské louky. Nad sněžnou čárou v asi 2 800 m leží skály, trvalý sníh a ledovce.";

const W = 552;
const H = 450;
const y = (m: number) => 462 - m * 0.092;

// mountain outline: left slope and right slope as (x, altitude)
const LEFT: [number, number][] = [
  [118, 300],
  [146, 900],
  [170, 1500],
  [196, 2100],
  [216, 2600],
  [234, 3000],
  [248, 2900],
  [266, 3600],
  [296, 4400],
];
const RIGHT: [number, number][] = [
  [296, 4400],
  [314, 3900],
  [332, 3300],
  [350, 2600],
  [364, 1900],
  [378, 1200],
  [392, 700],
  [404, 300],
];
const OUTLINE =
  "M" + [...LEFT, ...RIGHT.slice(1)].map(([x, m]) => `${x} ${f1(y(m))}`).join(" L") + "Z";

/** x of a slope at altitude m (the monotonic part near the ground) */
function slopeX(m: number, side: "l" | "r") {
  const pts = side === "l" ? LEFT.slice(0, 6) : [...RIGHT].reverse();
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, m0] = pts[i];
    const [x1, m1] = pts[i + 1];
    if (m >= m0 && m <= m1) return x0 + ((x1 - x0) * (m - m0)) / (m1 - m0);
  }
  return pts[pts.length - 1][0];
}

const BELTS = [
  { a: 300, b: 800, cls: "gz3-leaf", t: "listnaté lesy, pole", r: "do 800 m", icon: "dec" },
  { a: 800, b: 1500, cls: "gz3-mixed", t: "smíšené lesy", r: "800–1 500 m", icon: "mix" },
  { a: 1500, b: 2000, cls: "gz3-conifer", t: "jehličnaté lesy", r: "1 500–2 000 m", icon: "con" },
  { a: 2000, b: 2300, cls: "gz3-grass", t: "kleč", r: "2 000–2 300 m", icon: "bush" },
  { a: 2300, b: 2800, cls: "gz3-meadow", t: "alpínské louky", r: "2 300–2 800 m", icon: "grass" },
  { a: 2800, b: 4800, cls: "gz3-snow", t: "skály, sníh, led", r: "nad 2 800 m", icon: "" },
] as const;

function Icon({ kind, x, yy, k }: { kind: string; x: number; yy: number; k: number }) {
  if (kind === "dec" || (kind === "mix" && k % 2 === 0))
    return (
      <g>
        <path d={`M${f1(x)} ${f1(yy + 6)} v5`} className="gz3-o gz3-thin" />
        <circle cx={x} cy={yy} r={6.5} className="gz3-o gz3-leaf gz3-thin" />
      </g>
    );
  if (kind === "con" || kind === "mix")
    return <path d={`M${f1(x)} ${f1(yy - 9)} L${f1(x + 5.5)} ${f1(yy + 6)} H${f1(x - 5.5)} Z M${f1(x)} ${f1(yy + 6)} v4`} className="gz3-o gz3-conifer gz3-thin" />;
  if (kind === "bush")
    return <path d={`M${f1(x - 7)} ${f1(yy + 3)} a7 5 0 0 1 14 0 Z`} className="gz3-o gz3-conifer gz3-thin" />;
  if (kind === "grass")
    return <path d={`M${f1(x - 4)} ${f1(yy + 3)} l2 -6 M${f1(x)} ${f1(yy + 3)} v-7 M${f1(x + 4)} ${f1(yy + 3)} l-2 -6`} className="gz3-o gz3-thin gz3-good-s" />;
  return null;
}

function Plate() {
  const { id } = useFig();
  const icons: ReactElement[] = [];
  BELTS.forEach((b) => {
    if (!b.icon) return;
    const rows = b.b - b.a > 400 ? [b.a + (b.b - b.a) * 0.3, b.a + (b.b - b.a) * 0.72] : [(b.a + b.b) / 2];
    rows.forEach((m, ri) => {
      const x0 = slopeX(m, "l") + 12;
      const x1 = slopeX(m, "r") - 12;
      const n = Math.max(1, Math.floor((x1 - x0) / 19));
      for (let i = 0; i <= n; i++) {
        const x = x0 + ((x1 - x0) * i) / n + (ri % 2) * 6;
        if (x > x1) continue;
        icons.push(<Icon key={`${b.a}-${ri}-${i}`} kind={b.icon} x={x} yy={y(m)} k={i + ri} />);
      }
    });
  });
  const temp = (m: number) => 20 - ((m - 500) / 100) * 0.65;
  return (
    <>
      <defs>
        <clipPath id={`${id}-mt`}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      <Fade>
        <rect x={60} y={y(4800)} width={W - 70} height={y(300) - y(4800)} className="gz3-sky" />
        <g clipPath={`url(#${id}-mt)`}>
          {BELTS.map((b) => (
            <rect key={b.a} x={100} y={y(b.b)} width={320} height={y(b.a) - y(b.b)} className={b.cls} />
          ))}
          <path d={`M240 ${y(3000)} L270 ${y(3300)} L284 ${y(2900)} M300 ${y(4100)} L322 ${y(3500)} L340 ${y(3100)}`} className="gz3-o gz3-thin" />
        </g>
        <path d={OUTLINE} className="gz3-o" />
        <path d={`M60 ${y(300)} H${W - 10}`} className="gz3-o" />
      </Fade>
      <Pop delay={0.3}>
        <g clipPath={`url(#${id}-mt)`}>{icons}</g>
      </Pop>

      {/* tree line and snow line */}
      <FadePath d={`M${f1(slopeX(2000, "l") - 4)} ${y(2000)} H${f1(slopeX(2000, "r") + 4)}`} className="gz3-o gz3-dash gz3-lvl-s" delay={0.6} />
      <FadePath d={`M${f1(slopeX(2800, "l") - 4)} ${y(2800)} H${f1(slopeX(2800, "r") + 4)}`} className="gz3-o gz3-dash gz3-blue-s" delay={0.7} />
      <Fade delay={0.9}>
        <text x={f1(slopeX(2000, "l") - 6)} y={y(2000) - 5} textAnchor="end" className="gz3-lbl gz3-sm gz3-b gz3-lvl-t">
          hranice lesa
        </text>
        <text x={f1(slopeX(2800, "l") - 6)} y={y(2800) - 5} textAnchor="end" className="gz3-lbl gz3-sm gz3-b gz3-blue-t">
          sněžná čára
        </text>
      </Fade>

      {/* altitude and temperature scale */}
      <Fade delay={0.2}>
        {[500, 1500, 2500, 3500, 4500].map((m) => (
          <g key={m}>
            <path d={`M40 ${y(m)} h6`} className="gz3-o gz3-thin" />
            <text x={37} y={y(m) - 3} textAnchor="end" className="gz3-num gz3-num-sm">
              {m >= 1000 ? `${Math.floor(m / 1000)} ${String(m % 1000).padStart(3, "0")}` : m}
            </text>
            <text x={37} y={y(m) + 12} textAnchor="end" className="gz3-num gz3-num-sm gz3-red-t">
              {temp(m) < 0 ? `−${Math.abs(temp(m)).toFixed(0)}` : temp(m) % 1 ? temp(m).toFixed(1).replace(".", ",") : temp(m).toFixed(0)} °C
            </text>
          </g>
        ))}
        <path d={`M40 ${y(300)} V${y(4800)}`} className="gz3-o" />
        <text x={10} y={18} className="gz3-lbl gz3-sm">
          výška (m n. m.) a teplota v letní den
        </text>
        <text x={W - 10} y={18} textAnchor="end" className="gz3-lbl gz3-sm gz3-b gz3-red-t">
          −0,65 °C na každých 100 m
        </text>
      </Fade>

      {/* belt labels on the right */}
      <Fade delay={1}>
        {BELTS.map((b, i) => {
          const m = b.a === 2800 ? 3400 : (b.a + b.b) / 2;
          const ly = [y(550) + 2, y(1150) + 2, y(1750), y(2150) - 4, y(2550) - 8, y(3400)][i];
          return (
            <g key={b.a}>
              <Lbl x={418} y={ly} tx={slopeX(Math.min(m, 3200), "r") - 6} ty={y(Math.min(m, 3200))} className="gz3-b">
                {b.t}
              </Lbl>
              <text x={418} y={ly + 15} className="gz3-lbl gz3-sm">
                {b.r}
              </text>
            </g>
          );
        })}
      </Fade>
    </>
  );
}

export default function AltitudeZones() {
  return (
    <Figure label={LABEL} w={W} h={H} max={640} replay>
      <Plate />
    </Figure>
  );
}
