import { Draw, Fade, Figure, f1, pat, useCompact, useFig } from "./kit";

const LABEL =
  "Model demografické revoluce v pěti fázích. Porodnost a úmrtnost v promilích a velikost populace. 1. fáze: porodnost i úmrtnost jsou vysoké, počet obyvatel téměř neroste (Evropa před rokem 1750, dnes žádný stát). 2. fáze: úmrtnost rychle klesá, porodnost zůstává vysoká, populace roste nejrychleji (Niger). 3. fáze: klesá i porodnost, růst se zpomaluje (Keňa, Indie). 4. fáze: porodnost i úmrtnost jsou nízké, populace je velká a téměř nerostoucí (USA). 5. fáze: porodnost klesne pod úmrtnost a počet obyvatel ubývá (Japonsko, Itálie, Česko). Rozdíl mezi porodností a úmrtností je přirozený přírůstek.";

const H = 486;
const T = 100;
const B = 344;
// the plot is wider on large screens; the phone layout uses a narrower viewBox
let W = 640;
let L = 62;
let R = 616;
let SW = (R - L) / 5;
function layout(narrow: boolean) {
  W = narrow ? 440 : 640;
  L = narrow ? 40 : 62;
  R = W - (narrow ? 8 : 24);
  SW = (R - L) / 5;
}
/** x of a position in stages (0 = start of stage 1, 5 = end of stage 5) */
const sx = (s: number) => L + s * SW;
/** y of a rate in ‰ (0–50) */
const ry = (v: number) => B - (v / 50) * (B - T);

function smooth(pts: [number, number][]) {
  const P = pts.map(([s, v]) => [sx(s), ry(v)] as [number, number]);
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

// schematic rates (‰), as in the textbook model
const BIRTH: [number, number][] = [
  [0, 40], [0.5, 41], [1, 40], [1.5, 40.5], [2, 40], [2.5, 34], [3, 24], [3.5, 16], [4, 12], [4.5, 11], [5, 9],
];
const DEATH: [number, number][] = [
  [0, 37], [0.25, 41], [0.5, 34], [0.75, 40], [1, 36], [1.5, 24], [2, 16], [2.5, 12], [3, 10], [3.5, 9], [4, 9.5], [4.5, 11], [5, 12],
];
// total population (relative, 0–1), drawn on the same plot
const POP: [number, number][] = [
  [0, 0.06], [0.5, 0.065], [1, 0.07], [1.5, 0.16], [2, 0.32], [2.5, 0.5], [3, 0.66], [3.5, 0.75], [4, 0.79], [4.5, 0.79], [5, 0.76],
];
const popY = (p: number) => B - p * (B - T) * 0.98;

function popPath() {
  const P = POP.map(([s, p]) => [sx(s), popY(p)] as [number, number]);
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

/** area between birth and death rate (natural increase), sampled linearly */
function gapArea() {
  const lerp = (pts: [number, number][], s: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, va] = pts[i];
      const [b, vb] = pts[i + 1];
      if (s >= a && s <= b) return va + ((vb - va) * (s - a)) / (b - a);
    }
    return pts[pts.length - 1][1];
  };
  const top: string[] = [];
  const bot: string[] = [];
  for (let s = 1; s <= 4.001; s += 0.05) {
    top.push(`${f1(sx(s))} ${f1(ry(lerp(BIRTH, s)))}`);
    bot.unshift(`${f1(sx(s))} ${f1(ry(Math.min(lerp(DEATH, s), lerp(BIRTH, s))))}`);
  }
  return `M${top.join(" L")} L${bot.join(" L")} Z`;
}

const STAGES = [
  { n: "1", name: "vysoká\nstagnace", ex: "Evropa\npřed 1750" },
  { n: "2", name: "rychlý\nrůst", ex: "Niger" },
  { n: "3", name: "zpomalený\nrůst", ex: "Keňa,\nIndie" },
  { n: "4", name: "nízká\nstagnace", ex: "USA" },
  { n: "5", name: "úbytek", ex: "Japonsko,\nItálie,\nČesko" },
];

function Plate({ narrow }: { narrow: boolean }) {
  const { id } = useFig();
  layout(narrow);
  return (
    <>
      {/* stage columns */}
      {STAGES.map((st, i) => (
        <g key={st.n}>
          {i % 2 === 1 && (
            <rect x={sx(i)} y={T - 10} width={SW} height={B - T + 10} className="gz4-fill2" opacity={0.6} />
          )}
          {i > 0 && <path d={`M${sx(i)} ${T - 10} V${B}`} className="gz4-grid" />}
          <circle cx={sx(i + 0.5)} cy={T - 66} r={11} className="gz4-tag-lvl" />
          <text x={sx(i + 0.5)} y={T - 61} textAnchor="middle" className="gz4-eq gz4-lvl-t" style={{ fontWeight: 800 }}>
            {st.n}
          </text>
          <text x={sx(i + 0.5)} y={T - 20} textAnchor="middle" className="gz4-lbl gz4-sm gz4-b">
            {st.name.split("\n").map((l, k) => (
              <tspan key={k} x={sx(i + 0.5)} dy={k ? "0.95em" : "-0.95em"}>
                {l}
              </tspan>
            ))}
          </text>
          <text x={sx(i + 0.5)} y={B + 46} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
            {st.ex.split("\n").map((l, k) => (
              <tspan key={k} x={sx(i + 0.5)} dy={k ? "1.05em" : 0}>
                {l}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      <text x={W / 2} y={H - 6} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
        {narrow ? "příklady: UN WPP 2024" : "příklady států podle UN World Population Prospects 2024"}
      </text>

      {/* axes */}
      {[0, 10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <path d={`M${L - 5} ${ry(v)} H${L}`} className="gz4-o gz4-thin" />
          <text x={L - 9} y={ry(v) + 4.5} textAnchor="end" className="gz4-num">
            {v}
          </text>
        </g>
      ))}
      <path d={`M${L} ${T - 10} V${B} H${R}`} className="gz4-o" />
      <text x={narrow ? 10 : 18} y={(T + B) / 2} textAnchor="middle" transform={`rotate(-90 ${narrow ? 10 : 18} ${(T + B) / 2})`} className="gz4-lbl gz4-sm">
        {narrow ? "‰" : "‰ (na 1 000 obyvatel za rok)"}
      </text>
      <text x={(L + R) / 2} y={B + 22} textAnchor="middle" className="gz4-lbl gz4-sm">
        čas →
      </text>

      {/* natural increase */}
      <Fade delay={1.2}>
        <path d={gapArea()} fill={pat(id, "d")} className="gz4-nohit" />
        <path d={gapArea()} className="gz4-lvl-fill" opacity={0.45} />
        <text x={sx(1.75)} y={ry(35)} textAnchor="middle" className="gz4-lbl gz4-b gz4-lvl-t gz4-halo">
          přirozený
        </text>
        <text x={sx(1.75)} y={ry(31.4)} textAnchor="middle" className="gz4-lbl gz4-b gz4-lvl-t gz4-halo">
          přírůstek
        </text>
      </Fade>

      {/* lines */}
      <Draw d={smooth(DEATH)} className="gz4-curve gz4-dt-death" delay={0.1} />
      <Draw d={smooth(BIRTH)} className="gz4-curve gz4-dt-birth" delay={0.3} />
      <Draw d={popPath()} className="gz4-curve gz4-dt-pop" delay={0.7} />

      <Fade delay={1.3}>
        <text x={sx(0.1)} y={ry(44.5)} className="gz4-lbl gz4-b gz4-acc-t gz4-halo">
          porodnost
        </text>
        <text x={sx(0.12)} y={ry(27)} className="gz4-lbl gz4-b gz4-blue-t gz4-halo">
          úmrtnost
        </text>
        <text x={sx(4.95)} y={popY(0.76) - 12} textAnchor="end" className="gz4-lbl gz4-b gz4-halo">
          počet obyvatel
        </text>
      </Fade>
    </>
  );
}

export default function DemographicTransition() {
  const compact = useCompact();
  layout(compact.narrow);
  return (
    <Figure level={5} label={LABEL} w={W} h={H} max={680} replay compact={compact}>
      <Plate narrow={compact.narrow} />
    </Figure>
  );
}
