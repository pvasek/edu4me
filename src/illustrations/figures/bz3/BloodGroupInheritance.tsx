import { ChemText, Figure, Fade, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Krevní skupiny systému AB0. Gen má tři alely: Iᴬ a Iᴮ jsou kodominantní, alela i je recesivní. Skupina A (genotyp IᴬIᴬ nebo Iᴬi) má na povrchu červených krvinek antigen A, skupina B (IᴮIᴮ nebo Iᴮi) antigen B, skupina AB (IᴬIᴮ) oba antigeny a skupina 0 (ii) žádný. V plazmě jsou protilátky proti chybějícím antigenům. Křížení rodičů Iᴬi (skupina A) a Iᴮi (skupina B) dává v Punnettově čtverci čtyři stejně pravděpodobné kombinace, takže dítě může mít skupinu AB, A, B i 0, každou s pravděpodobností 25 %.";

const W = 420;
const H = 486;

const ANT_A = "#3d6fd1";
const ANT_B = "#e0b43a";

/** A red blood cell (biconcave disc seen from above) with A (triangle) / B (round) antigens. */
function RedCell({
  x,
  y,
  r = 28,
  a = false,
  b = false,
}: {
  x: number;
  y: number;
  r?: number;
  a?: boolean;
  b?: boolean;
}) {
  const { id } = useFig();
  const n = r > 20 ? 12 : 8;
  const marks = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const kind = a && b ? (i % 2 ? "B" : "A") : a ? "A" : b ? "B" : null;
    if (!kind) continue;
    const s = r > 20 ? 1 : 0.65;
    const px = x + Math.cos(ang) * r;
    const py = y + Math.sin(ang) * r;
    const deg = (ang * 180) / Math.PI + 90;
    marks.push(
      <g key={i} transform={`translate(${f1(px)} ${f1(py)}) rotate(${f1(deg)}) scale(${s})`}>
        <line x1={0} y1={0} x2={0} y2={-5} className="bz3-ant-stalk" />
        {kind === "A" ? (
          <path d="M-4.2 -5 L4.2 -5 L0 -11.5Z" fill={ANT_A} className="bz3-ant" />
        ) : (
          <circle cx={0} cy={-8.2} r={3.6} fill={ANT_B} className="bz3-ant" />
        )}
      </g>,
    );
  }
  return (
    <g>
      {marks}
      <circle cx={x} cy={y} r={r} className="bz3-rbc" />
      <circle cx={x} cy={y} r={r} fill={pat(id, "d")} opacity={0.35} />
      <ellipse cx={x} cy={y} rx={r * 0.45} ry={r * 0.42} className="bz3-rbc-in" />
    </g>
  );
}

const GROUPS = [
  { g: "A", a: true, b: false, geno: ["I^{A}I^{A}", "nebo I^{A}i"], anti: "anti-B" },
  { g: "B", a: false, b: true, geno: ["I^{B}I^{B}", "nebo I^{B}i"], anti: "anti-A" },
  { g: "AB", a: true, b: true, geno: ["I^{A}I^{B}", ""], anti: "žádné" },
  { g: "0", a: false, b: false, geno: ["ii", ""], anti: "anti-A, anti-B" },
];

const GX = 160;
const GY = 316;
const CW = 104;
const CH = 64;

export default function BloodGroupInheritance() {
  const grid = [
    [
      { geno: "I^{A}I^{B}", g: "AB", a: true, b: true },
      { geno: "I^{B}i", g: "B", a: false, b: true },
    ],
    [
      { geno: "I^{A}i", g: "A", a: true, b: false },
      { geno: "ii", g: "0", a: false, b: false },
    ],
  ];
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={560}>
      <Fade>
        <text x={14} y={22} className="bz3-lbl bz3-b bz3-sm">
          Čtyři krevní skupiny
        </text>
        <text x={W - 14} y={22} textAnchor="end" className="bz3-lbl bz3-sm">
          <ChemText text="I^{A}, I^{B} kodominantní, i recesivní" />
        </text>
      </Fade>
      {GROUPS.map((G, i) => {
        const x = 57 + i * 102;
        return (
          <Pop key={G.g} delay={0.1 + i * 0.12}>
            <RedCell x={x} y={76} a={G.a} b={G.b} />
            <text x={x} y={140} textAnchor="middle" className="bz3-group">
              {G.g}
            </text>
            <text x={x} y={162} textAnchor="middle" className="bz3-eq">
              <ChemText text={G.geno[0]} />
            </text>
            {G.geno[1] && (
              <text x={x} y={180} textAnchor="middle" className="bz3-eq bz3-eq-sm">
                <ChemText text={G.geno[1]} />
              </text>
            )}
            <text x={x} y={202} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
              {G.anti}
            </text>
          </Pop>
        );
      })}
      <Fade delay={0.7}>
        <g transform="translate(14 228)">
          <path d="M0 0 L9 0 L4.5 -9Z" fill={ANT_A} className="bz3-ant" />
          <text x={14} y={0} className="bz3-lbl bz3-sm">
            antigen A
          </text>
          <circle cx={98} cy={-4} r={4.5} fill={ANT_B} className="bz3-ant" />
          <text x={108} y={0} className="bz3-lbl bz3-sm">
            antigen B
          </text>
          <text x={392} y={0} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
            dole: protilátky v plazmě
          </text>
        </g>
        <line x1={12} x2={W - 12} y1={244} y2={244} className="bz3-rule" />
      </Fade>

      {/* example cross */}
      <Fade delay={0.9}>
        <text x={14} y={268} className="bz3-lbl bz3-b bz3-sm">
          Rodiče A × B
        </text>
        <text x={W - 14} y={268} textAnchor="end" className="bz3-eq">
          <ChemText text="I^{A}i × I^{B}i" />
        </text>
        {/* gametes */}
        {[
          ["I^{A}", GX + CW * 0.5, GY - 20],
          ["i", GX + CW * 1.5, GY - 20],
        ].map(([t, x, y]) => (
          <g key={`t${t}`}>
            <circle cx={x as number} cy={y as number} r={14} className="bz3-gamete" />
            <text x={x as number} y={(y as number) + 5} textAnchor="middle" className="bz3-eq">
              <ChemText text={t as string} />
            </text>
          </g>
        ))}
        {[
          ["I^{B}", GX - 24, GY + CH * 0.5],
          ["i", GX - 24, GY + CH * 1.5],
        ].map(([t, x, y]) => (
          <g key={`l${t}`}>
            <circle cx={x as number} cy={y as number} r={14} className="bz3-gamete" />
            <text x={x as number} y={(y as number) + 5} textAnchor="middle" className="bz3-eq">
              <ChemText text={t as string} />
            </text>
          </g>
        ))}
        <text x={GX - 46} y={GY - 15} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          gamety
        </text>
        <rect x={GX} y={GY} width={CW * 2} height={CH * 2} className="bz3-o bz3-fill" />
        <path d={`M${GX + CW} ${GY} V${GY + CH * 2} M${GX} ${GY + CH} H${GX + CW * 2}`} className="bz3-o" />
      </Fade>
      {grid.map((row, r) =>
        row.map((c, k) => {
          const cx = GX + CW * k;
          const cy = GY + CH * r;
          return (
            <Pop key={`${r}${k}`} delay={1.2 + (r * 2 + k) * 0.15}>
              <RedCell x={cx + 26} y={cy + CH / 2} r={14} a={c.a} b={c.b} />
              <text x={cx + 72} y={cy + 30} textAnchor="middle" className="bz3-group bz3-group-sm">
                {c.g}
              </text>
              <text x={cx + 72} y={cy + 50} textAnchor="middle" className="bz3-eq bz3-eq-sm">
                <ChemText text={c.geno} />
              </text>
            </Pop>
          );
        }),
      )}
      <Fade delay={2}>
        <text x={W / 2} y={GY + CH * 2 + 30} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
          dítě může mít kteroukoli skupinu,
        </text>
        <text x={W / 2} y={GY + CH * 2 + 50} textAnchor="middle" className="bz3-lbl bz3-sm">
          každou s pravděpodobností 25 %
        </text>
      </Fade>
    </Figure>
  );
}
