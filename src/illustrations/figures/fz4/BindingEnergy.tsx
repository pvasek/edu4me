import { Axes, ChemText, Draw, DrawArrow, Fade, Figure, Pop, f1 } from "./kit";

const LABEL =
  "Vazebná energie na jeden nukleon v závislosti na nukleonovém čísle A. Křivka rychle stoupá od deuteria ²H (1,1 MeV) přes mimořádně pevné helium ⁴He (7,1 MeV) a uhlík ¹²C (7,7 MeV) k maximu kolem železa ⁵⁶Fe, asi 8,8 MeV na nukleon – nejpevněji vázaná jádra. K těžkým jádrům pak pozvolna klesá až na 7,6 MeV u uranu ²³⁸U. Energie se uvolní, když vzniknou jádra s větší vazebnou energií na nukleon: lehká jádra slučováním (syntéza, šipka zleva k železu), těžká jádra štěpením (šipka zprava k železu).";

const O = [62, 292] as const;
const X = (a: number) => O[0] + a * 1.46;
const Y = (e: number) => O[1] - e * 24.5;
// (A, E_v/A in MeV)
const DATA: [number, number][] = [
  [2, 1.11],
  [3, 2.57],
  [4, 7.07],
  [6, 5.33],
  [7, 5.61],
  [9, 6.46],
  [11, 6.93],
  [12, 7.68],
  [14, 7.48],
  [16, 7.98],
  [20, 8.03],
  [24, 8.26],
  [28, 8.45],
  [32, 8.49],
  [40, 8.55],
  [48, 8.72],
  [56, 8.79],
  [62, 8.79],
  [90, 8.71],
  [120, 8.51],
  [150, 8.28],
  [200, 7.91],
  [238, 7.57],
];

/** Straight segments for the jagged light nuclei, a smooth Catmull-Rom spline from carbon on. */
function curve() {
  const P = DATA.map(([a, e]) => [X(a), Y(e)] as [number, number]);
  const s = 7; // index of ¹²C
  let d =
    "M" +
    P.slice(0, s + 1)
      .map((p) => `${f1(p[0])} ${f1(p[1])}`)
      .join(" L");
  for (let i = s; i < P.length - 1; i++) {
    const p0 = P[Math.max(i - 1, s)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(i + 2, P.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

const MARKS: {
  a: number;
  e: number;
  t: string;
  dx: number;
  dy: number;
  anchor?: "start" | "end" | "middle";
}[] = [
  { a: 2, e: 1.11, t: "^{2}H", dx: 10, dy: 6 },
  { a: 4, e: 7.07, t: "^{4}He", dx: -6, dy: -44 },
  { a: 238, e: 7.57, t: "^{238}U", dx: 0, dy: -14, anchor: "middle" },
];

export default function BindingEnergy() {
  return (
    <Figure level={12} w={460} h={340} max={620} label={LABEL}>
      <Axes x={O[0]} y={O[1]} w={384} h={270} xl="A" yl="E_{v} / A" />
      <Fade delay={0.3}>
        {[0, 50, 100, 150, 200].map((a) => (
          <g key={a}>
            <path d={`M${f1(X(a))} ${O[1]} v5`} className="fz4-o fz4-thin" />
            <text
              x={X(a)}
              y={O[1] + 20}
              textAnchor="middle"
              className="fz4-num"
            >
              {a}
            </text>
          </g>
        ))}
        {[2, 4, 6, 8, 10].map((e) => (
          <g key={e}>
            <path
              d={`M${O[0] - 5} ${f1(Y(e))} H${O[0] + 384}`}
              className="fz4-grid"
            />
            <text
              x={O[0] - 8}
              y={Y(e) + 4}
              textAnchor="end"
              className="fz4-num"
            >
              {e}
            </text>
          </g>
        ))}
        <text x={O[0] - 8} y={O[1] + 4} textAnchor="end" className="fz4-num">
          0
        </text>
        <path
          d={`M${f1(X(4))} ${f1(Y(7.07) - 4)} V${f1(Y(7.07) - 38)}`}
          className="fz4-lead"
        />
        <text x={O[0] + 84} y={O[1] - 264} className="fz4-eq fz4-eq-sm">
          (MeV)
        </text>
      </Fade>
      <Draw d={curve()} className="fz4-curve fz4-curve-lvl" delay={0.2} />
      <Fade delay={1}>
        {DATA.map(([a, e]) => (
          <circle key={a} cx={X(a)} cy={Y(e)} r={2.6} className="fz4-dot" />
        ))}
        {MARKS.map((m) => (
          <text
            key={m.t}
            x={X(m.a) + m.dx}
            y={Y(m.e) + m.dy}
            textAnchor={m.anchor ?? "start"}
            className="fz4-eq fz4-b-eq"
          >
            <ChemText text={m.t} />
          </text>
        ))}
      </Fade>
      {/* the peak */}
      <Pop delay={1.2}>
        <circle cx={X(56)} cy={Y(8.79)} r={5} className="fz4-pt" />
        <text x={X(56) + 10} y={Y(9.5)} className="fz4-eq fz4-b-eq">
          <ChemText text="^{56}Fe: 8,8 MeV – maximum" />
        </text>
      </Pop>
      {/* fusion and fission */}
      <DrawArrow
        d={`M${f1(X(10))} ${f1(Y(2.9))} Q${f1(X(32))} ${f1(Y(3.3))} ${f1(X(48))} ${f1(Y(7.5))}`}
        tone="acc"
        delay={1.3}
        className="fz4-vec"
      />
      <DrawArrow
        d={`M${f1(X(236))} ${f1(Y(6.4))} Q${f1(X(160))} ${f1(Y(6.6))} ${f1(X(80))} ${f1(Y(8.1))}`}
        tone="blue"
        delay={1.4}
        className="fz4-vec"
      />
      <Fade delay={1.7}>
        <text x={X(24)} y={Y(2.5)} className="fz4-lbl fz4-b fz4-acc-t">
          syntéza
        </text>
        <text x={X(24)} y={Y(2.5) + 18} className="fz4-lbl fz4-sm">
          lehká jádra se slučují
        </text>
        <text
          x={X(236)}
          y={Y(5.5)}
          textAnchor="end"
          className="fz4-lbl fz4-b fz4-blue-t"
        >
          štěpení
        </text>
        <text
          x={X(236)}
          y={Y(5.5) + 18}
          textAnchor="end"
          className="fz4-lbl fz4-sm"
        >
          těžká jádra se dělí
        </text>
      </Fade>
    </Figure>
  );
}
