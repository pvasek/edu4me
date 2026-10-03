import { Body, Draw, Fade, Figure, Pop, ell, f1, pat, useFig } from "./kit";

const LABEL =
  "Jednoduchý dvouvětvý určovací klíč pro živočichy ze zahrady. Otázka 1: Má nohy? Ne – pokračuj otázkou 2: Má ulitu? Ano – hlemýžď zahradní, ne – žížala obecná. Ano – pokračuj otázkou 3: Má 8 nohou? Ano – křižák obecný (pavouk), ne, má 6 nohou – slunéčko sedmitečné (brouk). Zvýrazněná cesta ukazuje, jak se klíčem dojde ke slunéčku: má nohy, nemá jich osm.";

const W = 420;
const H = 392;
const Q1: [number, number] = [210, 34];
const Q2: [number, number] = [105, 128];
const Q3: [number, number] = [315, 128];
const LEAVES = [55, 155, 265, 365];
const AY = 262; // animal centre line

function Question({ at, n, text, w = 136 }: { at: [number, number]; n: number; text: string; w?: number }) {
  return (
    <g>
      <rect x={at[0] - w / 2} y={at[1] - 18} width={w} height={36} rx={8} className="bz1-box" />
      <circle cx={at[0] - w / 2} cy={at[1] - 18} r={10} className="bz1-num-badge" style={{ fill: "var(--lvl)", stroke: "var(--edge)" }} />
      <text x={at[0] - w / 2} y={at[1] - 14} textAnchor="middle" className="bz1-eq bz1-eq-sm" style={{ fill: "var(--on-level)", fontWeight: 800 }}>
        {n}
      </text>
      <text x={at[0]} y={at[1] + 6} textAnchor="middle" className="bz1-lbl bz1-b">
        {text}
      </text>
    </g>
  );
}

function Branch({ from, to, yes, hl = false, delay = 0 }: { from: [number, number]; to: [number, number]; yes: boolean; hl?: boolean; delay?: number }) {
  const y0 = from[1] + 18;
  const y1 = to[1];
  const ym = y0 + 18;
  const d = `M${from[0]} ${y0} V${ym} H${to[0]} V${y1}`;
  const lx = (from[0] + to[0]) / 2;
  return (
    <g>
      <Draw d={d} className={`bz1-o ${hl ? "bz1-lvl-s" : ""}`} delay={delay} style={hl ? { strokeWidth: 3.2 } : undefined} />
      <Fade delay={delay + 0.4}>
        <text x={lx} y={ym - 6} textAnchor="middle" className={`bz1-lbl bz1-sm bz1-b ${yes ? "bz1-tone-green" : "bz1-tone-red"} bz1-halo`}>
          {yes ? "ano" : "ne"}
        </text>
      </Fade>
    </g>
  );
}

function Snail({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const foot = `M${x - 34} ${y + 14} C${x - 30} ${y + 4} ${x + 18} ${y + 4} ${x + 26} ${y + 6} C${x + 30} ${y} ${x + 32} ${y - 8} ${x + 28} ${y - 12} L${x + 34} ${y - 26} M${x + 28} ${y - 12} L${x + 24} ${y - 28} M${x + 26} ${y + 6} C${x + 34} ${y + 10} ${x + 30} ${y + 16} ${x + 20} ${y + 16} H${x - 26} Q${x - 34} ${y + 16} ${x - 34} ${y + 14}`;
  let spiral = "";
  for (let t = 0; t <= 2.6 * Math.PI; t += 0.25) {
    const r = 18 - t * 2;
    spiral += `${spiral ? " L" : "M"}${f1(x - 6 + Math.cos(t) * r)} ${f1(y - 10 + Math.sin(t) * r)}`;
  }
  return (
    <g>
      <path d={foot} className="bz1-o bz1-skin" />
      <circle cx={x + 34} cy={y - 26} r={2} className="bz1-spot" />
      <circle cx={x + 24} cy={y - 28} r={1.6} className="bz1-spot" />
      <Body d={ell(x - 6, y - 10, 19, 19)} fill="bz1-shell" />
      <path d={ell(x - 6, y - 10, 19, 19)} fill={pat(id, "d")} opacity={0.6} />
      <path d={spiral} className="bz1-o" />
    </g>
  );
}

function Worm({ x, y }: { x: number; y: number }) {
  const d = `M${x - 38} ${y + 8} C${x - 26} ${y - 12} ${x - 12} ${y - 12} ${x} ${y} C${x + 12} ${y + 12} ${x + 26} ${y + 12} ${x + 38} ${y - 6}`;
  return (
    <g>
      <path d={d} className="bz1-o" style={{ strokeWidth: 13, stroke: "var(--edge)" }} />
      <path d={d} style={{ strokeWidth: 10, fill: "none", stroke: "color-mix(in srgb, var(--pink) 45%, var(--surface))", strokeLinecap: "round" }} />
      <path d={d} style={{ strokeWidth: 10, fill: "none", stroke: "var(--edge)", strokeDasharray: "0.8 4.2", opacity: 0.55 }} />
      {/* clitellum (opasek) */}
      <path
        d={`M${x - 12} ${y - 8} C${x - 6} ${y - 6} ${x - 3} ${y - 3} ${x} ${y}`}
        style={{ strokeWidth: 10, fill: "none", stroke: "color-mix(in srgb, var(--pink) 75%, var(--surface))" }}
      />
    </g>
  );
}

function Spider({ x, y }: { x: number; y: number }) {
  const legs = [];
  for (let i = 0; i < 4; i++) {
    const a = -55 + i * 32;
    for (const s of [-1, 1]) {
      const r = (a * Math.PI) / 180;
      const kx = x + s * Math.cos(r) * 20;
      const ky = y - 4 + Math.sin(r) * 16 - 8;
      const fx = x + s * Math.cos(r) * 34;
      const fy = ky + 16 + i * 2;
      legs.push(`M${x + s * 4} ${y - 4} L${f1(kx)} ${f1(ky)} L${f1(fx)} ${f1(fy)}`);
    }
  }
  return (
    <g>
      <path d={legs.join(" ")} className="bz1-o" style={{ strokeWidth: 1.4 }} />
      <ellipse cx={x} cy={y - 6} rx={8} ry={7} className="bz1-o bz1-shell" />
      <ellipse cx={x} cy={y + 14} rx={13} ry={15} className="bz1-o bz1-cap" />
      <path d={`M${x} ${y + 4} V${y + 22} M${x - 6} ${y + 10} H${x + 6}`} className="bz1-o" style={{ stroke: "var(--surface)", strokeWidth: 2.2 }} />
    </g>
  );
}

function Ladybird({ x, y }: { x: number; y: number }) {
  const legs = [-1, 1]
    .flatMap((s) => [-8, 2, 12].map((dy, i) => `M${x + s * 14} ${y + dy} L${x + s * 24} ${y + dy - 4 + i * 4} L${x + s * 28} ${y + dy + 4 + i * 2}`))
    .join(" ");
  return (
    <g>
      <path d={legs} className="bz1-o" style={{ strokeWidth: 1.4 }} />
      <ellipse cx={x} cy={y - 20} rx={8} ry={6} className="bz1-o" style={{ fill: "var(--ink)" }} />
      <ellipse cx={x} cy={y + 2} rx={20} ry={22} className="bz1-o bz1-red-fill" />
      <path d={`M${x} ${y - 19} V${y + 24}`} className="bz1-o" />
      {(
        [
          [0, -14, 4],
          [-10, -4, 4],
          [10, -4, 4],
          [-9, 12, 3.5],
          [9, 12, 3.5],
          [-4, 3, 3],
          [4, 3, 3],
        ] as const
      ).map(([dx, dy, r]) => (
        <circle key={`${dx}${dy}`} cx={x + dx} cy={y + dy} r={r} className="bz1-spot" />
      ))}
    </g>
  );
}

const NAMES = ["hlemýžď\nzahradní", "žížala\nobecná", "křižák\nobecný", "slunéčko\nsedmitečné"];

export default function DichotomousKey() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={560} replay>
      <Branch from={Q1} to={[Q2[0], Q2[1] - 18]} yes={false} delay={0.2} />
      <Branch from={Q1} to={[Q3[0], Q3[1] - 18]} yes hl delay={0.2} />
      <Branch from={Q2} to={[LEAVES[0], AY - 40]} yes delay={0.6} />
      <Branch from={Q2} to={[LEAVES[1], AY - 40]} yes={false} delay={0.6} />
      <Branch from={Q3} to={[LEAVES[2], AY - 40]} yes delay={0.6} />
      <Branch from={Q3} to={[LEAVES[3], AY - 40]} yes={false} hl delay={0.6} />
      <Pop>
        <Question at={Q1} n={1} text="Má nohy?" />
      </Pop>
      <Pop delay={0.4}>
        <Question at={Q2} n={2} text="Má ulitu?" w={124} />
      </Pop>
      <Pop delay={0.4}>
        <Question at={Q3} n={3} text="Má 8 nohou?" w={124} />
      </Pop>
      <Fade delay={1.1}>
        <Snail x={LEAVES[0] + 2} y={AY + 4} />
        <Worm x={LEAVES[1]} y={AY + 2} />
        <Spider x={LEAVES[2]} y={AY - 2} />
        <Ladybird x={LEAVES[3]} y={AY} />
        {NAMES.map((n, i) => (
          <text key={n} x={LEAVES[i]} y={322} textAnchor="middle" className={`bz1-lbl ${i === 3 ? "bz1-b bz1-lvl-t" : "bz1-b"}`}>
            {n.split("\n").map((l, j) => (
              <tspan key={j} x={LEAVES[i]} dy={j ? "1.1em" : 0}>
                {l}
              </tspan>
            ))}
          </text>
        ))}
        <text x={LEAVES[3]} y={370} textAnchor="middle" className="bz1-lbl bz1-sm bz1-muted-t">
          (6 nohou)
        </text>
      </Fade>
    </Figure>
  );
}
