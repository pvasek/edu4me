import type { ReactNode } from "react";
import { Chloro, Figure, Pop, ScaleBar, f1, pat, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Tabule pěti jednobuněčných eukaryot (protist) s měřítky v mikrometrech. Měňavka velká, asi 0,4 mm, mění tvar a leze pomocí panožek, potravu pohlcuje do potravních vakuol. Trepka velká, asi 0,25 mm, má tvar střevíčku a pokrytý brvami, kterými plave, se dvěma jádry a buněčnými ústy. Krásnoočko zelené, asi 50 µm, plave bičíkem, má červenou světločivnou skvrnu a chloroplasty, takže je řasou i prvokem. Rozsivka, asi 50 µm, je řasa ve skleněné křemité schránce. Dírkonožec, asi 0,5 mm, žije v moři v komůrkové vápenité schránce s póry, kterými vysouvá tenká vlákna.";

const TW = 200;
const TH = 190;

function Tile({ x, y, name, kind, children }: { x: number; y: number; name: string; kind: string; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={4} y={4} width={TW - 8} height={TH - 8} rx={10} className="bz1-o bz1-thin bz1-fill" style={{ opacity: 0.9 }} />
      {children}
      <text x={14} y={TH - 34} className="bz1-lbl bz1-b">
        {name}
      </text>
      <text x={14} y={TH - 16} className="bz1-lbl bz1-sm bz1-lvl-t">
        {kind}
      </text>
    </g>
  );
}

function blob(cx: number, cy: number, r: number, k: (a: number) => number, n = 40) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * (r + k(a)), cy + Math.sin(a) * (r + k(a)) * 0.8] as const;
  });
  const mid = (i: number) => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2] as const;
  let d = `M${f1(mid(0)[0])} ${f1(mid(0)[1])}`;
  for (let i = 1; i <= n; i++) d += ` Q${f1(pts[i % n][0])} ${f1(pts[i % n][1])} ${f1(mid(i)[0])} ${f1(mid(i)[1])}`;
  return d + "Z";
}

function Amoeba() {
  const { id } = useFig();
  const lobes = (a: number) => 22 * Math.max(0, Math.cos(3 * a + 0.4)) ** 3 + 14 * Math.max(0, Math.cos(5 * a - 1)) ** 4 - 6;
  const d = blob(100, 76, 46, lobes);
  return (
    <g>
      <path d={d} className="bz1-cyto" />
      <path d={d} fill={pat(id, "dots")} opacity={0.6} />
      <path d={d} className="bz1-o" />
      <ellipse cx={92} cy={78} rx={11} ry={9} className="bz1-o bz1-thin bz1-nuc" />
      <circle cx={122} cy={66} r={8} className="bz1-o bz1-thin bz1-vac" />
      {(
        [
          [72, 64],
          [112, 92],
          [80, 98],
        ] as const
      ).map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={6} className="bz1-o bz1-thin bz1-fill2" />
          <circle cx={x + 1} cy={y} r={2.2} className="bz1-mito" />
        </g>
      ))}
      <ScaleBar x={130} y={140} len={37} text="100 µm" />
    </g>
  );
}

function Paramecium() {
  const { id } = useFig();
  const body = "M30 80 C30 56 70 46 110 52 C140 56 172 58 172 78 C172 98 140 104 110 104 C88 104 80 92 66 96 C46 102 30 98 30 80 Z";
  const cilia: string[] = [];
  const R = rng(3);
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2;
    const x = 101 + Math.cos(a) * 71;
    const y = 77 + Math.sin(a) * (Math.sin(a) < 0 ? 26 : 24);
    cilia.push(`M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * (5 + R() * 2))} ${f1(Math.sin(a) * (5 + R() * 2))}`);
  }
  const star = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3;
      return `M${cx} ${cy} l${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)}`;
    }).join(" ");
  return (
    <g>
      <path d={cilia.join(" ")} className="bz1-o bz1-thin" />
      <path d={body} className="bz1-cyto" />
      <path d={body} fill={pat(id, "dots")} opacity={0.6} />
      <path d={body} className="bz1-o" />
      <path d="M70 94 C82 86 96 86 104 92" className="bz1-o bz1-thin" />
      <ellipse cx={106} cy={74} rx={16} ry={10} className="bz1-o bz1-thin bz1-nuc" />
      <circle cx={124} cy={70} r={3.5} className="bz1-o bz1-thin bz1-nucleolus" />
      <path d={`${star(56, 72)} ${star(152, 76)}`} className="bz1-o bz1-thin" />
      <circle cx={56} cy={72} r={3.4} className="bz1-o bz1-thin bz1-vac" />
      <circle cx={152} cy={76} r={3.4} className="bz1-o bz1-thin bz1-vac" />
      <circle cx={86} cy={66} r={4.5} className="bz1-o bz1-thin bz1-fill2" />
      <ScaleBar x={126} y={140} len={60} text="100 µm" />
    </g>
  );
}

function Euglena() {
  const { id } = useFig();
  const body = "M44 80 C56 62 100 58 140 70 C158 75 168 80 174 84 C164 90 150 96 136 98 C100 104 56 98 44 80 Z";
  return (
    <g>
      <path d="M46 78 C34 66 26 74 18 62 C12 52 22 44 14 34" className="bz1-o bz1-wiggle" style={{ strokeWidth: 1.4 }} />
      <path d={body} className="bz1-cyto" />
      <path d={body} fill={pat(id, "dots")} opacity={0.5} />
      <path d={body} className="bz1-o" />
      {(
        [
          [82, 74, 10],
          [100, 90, -8],
          [120, 76, 6],
          [138, 88, -12],
          [70, 90, 14],
        ] as const
      ).map(([x, y, r]) => (
        <Chloro key={x} x={x} y={y} rot={r} rx={8} ry={4.5} />
      ))}
      <ellipse cx={104} cy={82} rx={8} ry={6} className="bz1-o bz1-thin bz1-nuc" />
      <circle cx={56} cy={76} r={3.8} className="bz1-o bz1-thin bz1-red-fill" />
      <ScaleBar x={150} y={140} len={28} text="10 µm" />
    </g>
  );
}

function Diatom() {
  const valve = "M30 78 C50 56 150 56 170 78 C150 100 50 100 30 78 Z";
  const striae: string[] = [];
  for (let x = 40; x <= 160; x += 6) {
    const h = 20 * Math.sqrt(Math.max(0, 1 - ((x - 100) / 70) ** 2));
    if (Math.abs(x - 100) < 6) continue;
    striae.push(`M${x} ${f1(78 - h + 2)} V${74} M${x} 82 V${f1(78 + h - 2)}`);
  }
  return (
    <g>
      <path d={valve} className="bz1-shell" />
      <path d={striae.join(" ")} className="bz1-o bz1-thin" style={{ opacity: 0.7 }} />
      <path d="M40 78 H96 M104 78 H160" className="bz1-o" />
      <circle cx={100} cy={78} r={4} className="bz1-o bz1-thin" />
      <path d={valve} className="bz1-o" style={{ strokeWidth: 2 }} />
      <path d="M58 70 C70 64 84 64 92 68 M108 88 C120 92 136 92 146 86" className="bz1-o" style={{ stroke: "color-mix(in srgb, var(--yellow) 80%, var(--ink))", strokeWidth: 4, opacity: 0.6 }} />
      <ScaleBar x={150} y={140} len={30} text="10 µm" />
    </g>
  );
}

function Foram() {
  const { id } = useFig();
  const cx = 100;
  const cy = 78;
  const ch: ReactNode[] = [];
  // chambers growing along a spiral
  for (let i = 9; i >= 0; i--) {
    const a = i * 0.72;
    const r = 6 + i * 3.6;
    const rr = 5 + i * 1.7;
    const x = cx + Math.cos(a) * r * 0.75;
    const y = cy + Math.sin(a) * r * 0.75;
    ch.push(
      <g key={i}>
        <circle cx={f1(x)} cy={f1(y)} r={f1(rr)} className="bz1-o bz1-thin bz1-shell" />
        <circle cx={f1(x)} cy={f1(y)} r={f1(rr)} fill={pat(id, "dots")} />
      </g>,
    );
  }
  const R = rng(11);
  const threads = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + R() * 0.2;
    const l = 26 + R() * 22;
    return `M${f1(cx + Math.cos(a) * 34)} ${f1(cy + Math.sin(a) * 30)} q${f1(Math.cos(a + 0.4) * l * 0.5)} ${f1(Math.sin(a + 0.4) * l * 0.5)} ${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l * 0.8)}`;
  });
  return (
    <g>
      <path d={threads.join(" ")} className="bz1-o bz1-thin" style={{ opacity: 0.7 }} />
      {ch}
      <ScaleBar x={140} y={140} len={28} text="200 µm" />
    </g>
  );
}

const ITEMS: { name: string; kind: string; art: ReactNode }[] = [
  { name: "měňavka", kind: "prvok · panožky", art: <Amoeba /> },
  { name: "trepka", kind: "prvok · brvy", art: <Paramecium /> },
  { name: "krásnoočko", kind: "řasa i prvok · bičík", art: <Euglena /> },
  { name: "rozsivka", kind: "řasa · křemitá schránka", art: <Diatom /> },
  { name: "dírkonožec", kind: "prvok · vápenitá schránka", art: <Foram /> },
];

export default function ProtistsGallery() {
  const compact = useCompact(460);
  const cols = compact.narrow ? 2 : 3;
  const rows = Math.ceil((ITEMS.length + 1) / cols);
  const w = cols * TW + 10;
  const h = rows * TH + 10;
  return (
    <Figure level={2} label={LABEL} w={w} h={h} max={cols * 220} compact={compact} boost={false} replay>
      {ITEMS.map((it, i) => (
        <Pop key={it.name} delay={i * 0.15}>
          <Tile x={5 + (i % cols) * TW} y={5 + Math.floor(i / cols) * TH} name={it.name} kind={it.kind}>
            {it.art}
          </Tile>
        </Pop>
      ))}
      <Pop delay={0.8}>
        <g transform={`translate(${5 + (ITEMS.length % cols) * TW} ${5 + Math.floor(ITEMS.length / cols) * TH})`}>
          <text x={TW / 2} y={50} textAnchor="middle" className="bz1-lbl bz1-b">
            měřítko
          </text>
          <text x={TW / 2} y={80} textAnchor="middle" className="bz1-eq">
            1 mm = 1 000 µm
          </text>
          <text x={TW / 2} y={110} textAnchor="middle" className="bz1-lbl bz1-sm">
            {"každá je jediná buňka"}
          </text>
          <text x={TW / 2} y={130} textAnchor="middle" className="bz1-lbl bz1-sm">
            s jádrem
          </text>
        </g>
      </Pop>
    </Figure>
  );
}
