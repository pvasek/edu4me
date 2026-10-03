import { Draw, DrawArrow, Fade, Figure, Pop, cz, f1, pat, useFig } from "./kit";

const LABEL =
  "Povrch a objem krychlí o hraně 1, 2 a 4. Krychle s hranou 1 cm má povrch 6 cm² a objem 1 cm³, poměr povrchu k objemu 6 : 1. Hrana 2 cm: povrch 24 cm², objem 8 cm³, poměr 3 : 1. Hrana 4 cm: povrch 96 cm², objem 64 cm³, poměr jen 1,5 : 1. Objem roste rychleji než povrch. Dole buňka, která roste: do malé buňky látky povrchem proniknou až do středu, do velké buňky jen k okraji a její střed strádá, proto se buňka raději rozdělí.";

const U = 20; // px per cm
const BASE = 142;
const COLS = [96, 196, 326];
const SIZES = [1, 2, 4];
const ROWS = [
  { k: "a", unit: "cm", f: (a: number) => a },
  { k: "S", unit: "cm²", f: (a: number) => 6 * a * a },
  { k: "V", unit: "cm³", f: (a: number) => a ** 3 },
];

function Cube({ cx, a }: { cx: number; a: number }) {
  const { id } = useFig();
  const s = a * U;
  const dx = s * 0.42;
  const dy = -s * 0.3;
  const x = cx - (s + dx) / 2;
  const y = BASE;
  const front = `M${x} ${y} h${s} v${-s} h${-s} Z`;
  const top = `M${x} ${y - s} l${f1(dx)} ${f1(dy)} h${s} l${f1(-dx)} ${f1(-dy)} Z`;
  const side = `M${x + s} ${y} l${f1(dx)} ${f1(dy)} v${-s} l${f1(-dx)} ${f1(-dy)} Z`;
  const g: string[] = [];
  for (let i = 1; i < a; i++) {
    const t = i / a;
    g.push(`M${x + i * U} ${y} v${-s}`, `M${x} ${y - i * U} h${s}`);
    g.push(`M${x + i * U} ${y - s} l${f1(dx)} ${f1(dy)}`, `M${f1(x + t * dx)} ${f1(y - s + t * dy)} h${s}`);
    g.push(`M${f1(x + s + t * dx)} ${f1(y + t * dy)} v${-s}`, `M${x + s} ${y - i * U} l${f1(dx)} ${f1(dy)}`);
  }
  return (
    <g>
      <path d={front} className="bz1-lvlsoft-f" />
      <path d={top} className="bz1-fill" />
      <path d={side} className="bz1-lvl-fill" />
      <path d={side} fill={pat(id, "d")} />
      {g.length > 0 && <path d={g.join(" ")} className="bz1-o bz1-thin" style={{ opacity: 0.55 }} />}
      <path d={`${front} ${top} ${side}`} className="bz1-o" />
    </g>
  );
}

/** Concentric diffusion picture: arrows reach `reach` px into a cell of radius r. */
function Cell({ x, y, r, reach }: { x: number; y: number; r: number; reach: number }) {
  const { id } = useFig();
  const core = r - reach;
  const n = r > 40 ? 10 : 6;
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bz1-cyto" />
      <circle cx={x} cy={y} r={r} fill={pat(id, "dots")} opacity={0.6} />
      {core > 2 && (
        <g>
          <circle cx={x} cy={y} r={core} className="bz1-blood" />
          <circle cx={x} cy={y} r={core} fill={pat(id, "x")} />
          <circle cx={x} cy={y} r={core} className="bz1-o bz1-thin bz1-dash" />
        </g>
      )}
      <circle cx={x} cy={y} r={r} className="bz1-o" style={{ strokeWidth: 2 }} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const r0 = r + 13;
        const r1 = Math.max(r - reach, 4);
        return (
          <DrawArrow
            key={i}
            d={`M${f1(x + Math.cos(a) * r0)} ${f1(y + Math.sin(a) * r0)} L${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)}`}
            tone="blue"
            delay={1.3 + i * 0.03}
          />
        );
      })}
    </g>
  );
}

export default function SurfaceVolume() {
  return (
    <Figure level={1} label={LABEL} w={440} h={524} max={600} replay>
      {SIZES.map((a, i) => (
        <Pop key={a} delay={i * 0.25}>
          <Cube cx={COLS[i]} a={a} />
        </Pop>
      ))}
      <Fade delay={0.7}>
        {ROWS.map((r, j) => (
          <g key={r.k}>
            <text x={14} y={180 + j * 26} className="bz1-sym-t" style={{ fontSize: 18 }}>
              {r.k}
            </text>
            {SIZES.map((a, i) => (
              <text key={a} x={COLS[i]} y={180 + j * 26} textAnchor="middle" className="bz1-eq">
                {cz(r.f(a))} {r.unit}
              </text>
            ))}
          </g>
        ))}
        <rect x={6} y={236} width={428} height={34} rx={7} className="bz1-box-lvl" />
        <text x={14} y={259} className="bz1-sym-t" style={{ fontSize: 18 }}>
          S : V
        </text>
        {SIZES.map((a, i) => (
          <text key={a} x={COLS[i]} y={259} textAnchor="middle" className="bz1-eq bz1-eq-lg" style={{ fontWeight: 800 }}>
            {cz(6 / a, a === 4 ? 1 : 0)} : 1
          </text>
        ))}
        <text x={220} y={292} textAnchor="middle" className="bz1-lbl bz1-sm">
          objem roste rychleji než povrch
        </text>
      </Fade>
      <Fade delay={1.1}>
        <path d="M14 312 H426" className="bz1-o bz1-thin bz1-dash" style={{ opacity: 0.5 }} />
        <text x={14} y={340} className="bz1-title">
          Buňka, která roste
        </text>
        <Cell x={92} y={420} r={28} reach={28} />
        <Cell x={320} y={422} r={58} reach={22} />
        <text x={92} y={492} textAnchor="middle" className="bz1-lbl bz1-sm">
          látky dojdou do středu
        </text>
        <text x={320} y={427} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b bz1-red-t bz1-halo">
          střed strádá
        </text>
        <text x={320} y={514} textAnchor="middle" className="bz1-lbl bz1-sm">
          → buňka se rozdělí
        </text>
      </Fade>
      <Draw d="M150 422 H222" className="bz1-o bz1-lvl-s" delay={1.2} arrow="lvl" style={{ strokeWidth: 2.4 }} />
      <Fade delay={1.3}>
        <text x={186} y={412} textAnchor="middle" className="bz1-lbl bz1-sm bz1-lvl-t">
          roste
        </text>
      </Fade>
    </Figure>
  );
}
