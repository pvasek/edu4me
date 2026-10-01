import { StepStrip } from "../../sequence/StepFigure";
import {
  Arrow,
  Figure,
  Flame,
  Frame,
  Travel,
  f1,
  pat,
  useFig,
  type P2,
} from "./kit";

const LABEL =
  "Tlak plynu jako nárazy molekul, srovnání dvou stavů ve stejné uzavřené nádobě s pístem. Studený plyn při teplotě 300 K: molekuly letí pomaleji (střední kvadratická rychlost asi 500 m/s), do stěn a pístu narážejí méně často a slaběji, manometr ukazuje 100 kPa. Ohřátý plyn při 600 K: molekuly jsou √2krát rychlejší (asi 710 m/s), narážejí častěji a každý náraz předá větší hybnost, takže tlak vzroste na dvojnásobek, 200 kPa. Při stálém objemu je tlak přímo úměrný teplotě.";

const W = 300;
const H = 270;
// gas space (the molecule centres stay inside)
const X0 = 36;
const X1 = 212;
const Y0 = 72;
const Y1 = 234;
const R = 5;

/** Triangle wave 0 → 1 → 0 over one period. */
const tri = (p: number) => 1 - Math.abs(2 * (p - Math.floor(p)) - 1);

/**
 * A closed bouncing path: `a` round trips across and `b` round trips up and down per lap,
 * so the molecule returns to its start and the loop never jumps.
 */
function bounce(a: number, b: number, px: number, py: number) {
  const times = new Set<number>([0, 1]);
  for (let k = 0; k <= 2 * a + 1; k++) {
    const t = (k / 2 - px) / a;
    if (t > 0 && t < 1) times.add(t);
  }
  for (let k = 0; k <= 2 * b + 1; k++) {
    const t = (k / 2 - py) / b;
    if (t > 0 && t < 1) times.add(t);
  }
  const at = (t: number): P2 => [
    X0 + R + tri(px + a * t) * (X1 - X0 - 2 * R),
    Y0 + R + tri(py + b * t) * (Y1 - Y0 - 2 * R),
  ];
  const pts = [...times].sort((p, q) => p - q).map(at);
  return { d: "M" + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(" L"), at };
}

const MOLS = [
  [1, 2, 0.1, 0.35],
  [2, 1, 0.42, 0.7],
  [1, 1, 0.8, 0.15],
  [2, 3, 0.25, 0.55],
  [3, 2, 0.6, 0.9],
  [1, 3, 0.05, 0.4],
  [3, 1, 0.33, 0.05],
  [2, 1, 0.9, 0.3],
  [1, 2, 0.55, 0.8],
  [3, 2, 0.15, 0.62],
  [1, 1, 0.48, 0.48],
  [2, 3, 0.7, 0.2],
].map(([a, b, px, py]) => bounce(a, b, px, py));

/** Wall impacts drawn as short outward pushes (more and longer when hot). */
const HITS_COLD: [number, number, number][] = [
  [X0 - 2, 120, 180],
  [X1 + 2, 222, 0],
  [96, Y0 - 1, -90],
  [160, Y0 - 1, -90],
  [70, Y1 + 2, 90],
];
const HITS_HOT: [number, number, number][] = [
  [X0 - 2, 112, 180],
  [X0 - 2, 196, 180],
  [X1 + 2, 84, 0],
  [X1 + 2, 222, 0],
  [72, Y0 - 1, -90],
  [124, Y0 - 1, -90],
  [176, Y0 - 1, -90],
  [56, Y1 + 2, 90],
  [196, Y1 + 2, 90],
];

function Vessel() {
  const { id } = useFig();
  return (
    <g>
      {/* gas */}
      <rect
        x={X0}
        y={Y0}
        width={X1 - X0}
        height={Y1 - Y0}
        className="fz4-glass"
      />
      {/* walls */}
      <path
        d={`M${X0 - 2} 46 V${Y1 + 2} H${X1 + 2} V46`}
        className="fz4-o fz4-wall"
      />
      <path d={`M${X0 - 8} 46 V${Y1 + 8} H${X1 + 8} V46`} className="fz4-o" />
      <path
        d={`M${X0 - 8} ${Y1 + 8} H${X1 + 8} V46 H${X1 + 2} V${Y1 + 2} H${X0 - 2} V46 H${X0 - 8}Z`}
        fill={pat(id, "d")}
      />
      {/* piston */}
      <rect
        x={X0}
        y={Y0 - 16}
        width={X1 - X0}
        height={16}
        rx={2}
        className="fz4-o fz4-steel"
      />
      <rect
        x={X0}
        y={Y0 - 16}
        width={X1 - X0}
        height={16}
        rx={2}
        fill={pat(id, "x")}
      />
      <rect
        x={(X0 + X1) / 2 - 5}
        y={20}
        width={10}
        height={Y0 - 36}
        className="fz4-o fz4-steel"
      />
      <rect
        x={(X0 + X1) / 2 - 22}
        y={14}
        width={44}
        height={8}
        rx={3}
        className="fz4-o fz4-fill3"
      />
      {/* gauge on a short pipe */}
      <path
        d={`M${X1 + 8} 150 H230`}
        className="fz4-pipe-o"
        style={{ strokeWidth: 9 }}
      />
      <path
        d={`M${X1 + 2} 150 H230`}
        className="fz4-pipe-i"
        style={{ strokeWidth: 5 }}
      />
    </g>
  );
}

function Gauge({ p }: { p: number }) {
  const cx = 258;
  const cy = 150;
  const r = 28;
  // 0–300 kPa over 240°
  const ang = (v: number) => ((-210 + (v / 300) * 240) * Math.PI) / 180;
  const tick = (v: number, r1: number, r2: number) => {
    const a = ang(v);
    return `M${f1(cx + Math.cos(a) * r1)} ${f1(cy + Math.sin(a) * r1)} L${f1(cx + Math.cos(a) * r2)} ${f1(cy + Math.sin(a) * r2)}`;
  };
  const a = ang(p);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} className="fz4-o fz4-fill3" />
      <circle cx={cx} cy={cy} r={r} className="fz4-o fz4-fill" />
      <path
        d={[0, 50, 100, 150, 200, 250, 300]
          .map((v) => tick(v, r - 7, r - 2))
          .join(" ")}
        className="fz4-o fz4-thin"
      />
      <path
        d={`M${f1(cx - Math.cos(a) * 5)} ${f1(cy - Math.sin(a) * 5)} L${f1(cx + Math.cos(a) * (r - 6))} ${f1(cy + Math.sin(a) * (r - 6))}`}
        className="fz4-needle-l"
      />
      <circle cx={cx} cy={cy} r={2.6} className="fz4-dot" />
      <text x={cx} y={cy + 17} textAnchor="middle" className="fz4-gauge-t">
        kPa
      </text>
      <text
        x={cx}
        y={cy + r + 22}
        textAnchor="middle"
        className="fz4-eq fz4-b-eq"
      >
        {p} kPa
      </text>
      <text
        x={cx}
        y={cy - r - 10}
        textAnchor="middle"
        className="fz4-lbl fz4-sm"
      >
        manometr
      </text>
    </g>
  );
}

function Panel({ hot }: { hot: boolean }) {
  const dur = hot ? 5 / Math.SQRT2 : 5;
  const hits = hot ? HITS_HOT : HITS_COLD;
  const len = hot ? 15 : 10;
  return (
    <Frame w={W} h={H}>
      <Vessel />
      {MOLS.map((m, i) => {
        const ph = (i * 0.37) % 1;
        const rest = m.at(ph);
        return (
          <Travel key={i} path={m.d} dur={dur} phase={ph} rest={rest}>
            <circle r={R} className="fz4-mol" />
          </Travel>
        );
      })}
      {hits.map(([x, y, deg], i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <Arrow
            key={i}
            d={`M${f1(x)} ${f1(y)} L${f1(x + Math.cos(a) * len)} ${f1(y + Math.sin(a) * len)}`}
            tone="red"
            className="fz4-hit"
          />
        );
      })}
      <Gauge p={hot ? 200 : 100} />
      <text x={12} y={24} className="fz4-eq fz4-eq-lg">
        <tspan className="fz4-it">T</tspan> = {hot ? 600 : 300} K
      </text>
      <text x={X1 + 14} y={56} className="fz4-lbl fz4-sm">
        píst
      </text>
      {hot ? (
        <g>
          <Flame x={86} y={H - 4} h={22} w={9} />
          <Flame x={124} y={H - 4} h={26} w={10} />
          <Flame x={162} y={H - 4} h={22} w={9} />
        </g>
      ) : (
        <text
          x={(X0 + X1) / 2}
          y={H - 8}
          textAnchor="middle"
          className="fz4-lbl fz4-sm fz4-muted-t"
        >
          bez ohřevu
        </text>
      )}
    </Frame>
  );
}

export default function GasMoleculesPressure() {
  return (
    <Figure level={10} label={LABEL} max={760} interactive boost={false}>
      <div className="fz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Studený plyn",
              art: <Panel hot={false} />,
              caption:
                "Molekuly letí asi 500 m/s. Do stěn a pístu narážejí méně často a slaběji: tlak 100 kPa.",
            },
            {
              title: "Ohřátý plyn",
              art: <Panel hot />,
              caption:
                "Při dvojnásobné teplotě jsou √2krát rychlejší: nárazů je víc a jsou silnější, tlak vzroste na 200 kPa.",
            },
          ]}
        />
        <p className="fz4-strip-note">
          tlak = průměrná síla nárazů molekul na 1 m² stěny; při stálém objemu
          roste s teplotou
        </p>
      </div>
    </Figure>
  );
}
