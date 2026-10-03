import { Body, Draw, Fade, Figure, Lbl, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Stavba houby. Nad zemí je plodnice: klobouk, na jeho spodní straně lupeny, ze kterých padají drobné výtrusy, a třeň s prstenem. Skutečné tělo houby je ale pod zemí: podhoubí (mycelium), síť tenkých vláken, hyf, která prorůstají půdou a vstřebávají živiny. Dole dva výřezy: kvasinky, jednobuněčné houby, které se množí pučením, a plíseň štětičkovec, jejíž hyfy nesou štětičky řetízků výtrusů.";

const W = 420;
const H = 532;
const GY = 300; // soil surface
const CX = 210;

function Mushroom() {
  const cap = `M106 128 C104 72 156 40 ${CX} 40 C264 40 316 72 314 128 C300 134 120 134 106 128 Z`;
  const under = `M108 128 C140 168 280 168 312 128 C280 134 140 134 108 128 Z`;
  const gills: string[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const x = 112 + t * 196;
    const y = 130 + Math.sin(t * Math.PI) * 4;
    gills.push(`M${f1(CX + (t - 0.5) * 24)} 156 L${f1(x)} ${f1(y)}`);
  }
  const stem = `M198 138 C196 190 192 250 190 ${GY - 6} C190 ${GY + 4} 230 ${GY + 4} 230 ${GY - 6} C228 250 224 190 222 138 Z`;
  return (
    <g>
      <Body d={stem} fill="bz1-fill" hatch="v" hatchOpacity={0.6} />
      <path d="M197 158 C190 170 194 176 186 182 C200 176 220 176 234 182 C226 176 230 170 223 158 Z" className="bz1-o bz1-fill2" />
      <path d={under} className="bz1-o bz1-fill3" />
      <path d={gills.join(" ")} className="bz1-o bz1-thin" />
      <Body d={cap} fill="bz1-cap" hatch="d" hatchOpacity={0.7} />
      <path d="M130 84 C150 60 180 52 200 52" className="bz1-o bz1-thin" style={{ stroke: "var(--surface)", strokeWidth: 3, opacity: 0.6 }} />
    </g>
  );
}

function Mycelium() {
  const R = rng(5);
  const paths: string[] = [];
  const grow = (x: number, y: number, a: number, len: number, depth: number) => {
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    const mx = (x + x2) / 2 + (R() - 0.5) * 10;
    const my = (y + y2) / 2 + (R() - 0.5) * 8;
    paths.push(`M${f1(x)} ${f1(y)} Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}`);
    if (depth > 0) {
      grow(x2, y2, a - 0.5 + R() * 0.3, len * 0.75, depth - 1);
      grow(x2, y2, a + 0.3 + R() * 0.3, len * 0.7, depth - 1);
    }
  };
  for (const a of [0.12, 0.45, 0.9, 1.3, 1.85, 2.25, 2.7, 3.02]) grow(CX + Math.cos(a) * 14, GY + 2, a, 28, 2);
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-soil`}>
        <rect x={8} y={GY} width={W - 16} height={70} />
      </clipPath>
      <path d={paths.join(" ")} clipPath={`url(#${id}-soil)`} className="bz1-hypha" style={{ stroke: "var(--ink)", opacity: 0.75 }} />
    </g>
  );
}

function Inset({ x, y, title, children }: { x: number; y: number; title: string; children: React.ReactNode }) {
  const { id } = useFig();
  const cid = `${id}-clip-${x}`;
  return (
    <g>
      <clipPath id={cid}>
        <circle cx={x} cy={y} r={58} />
      </clipPath>
      <circle cx={x} cy={y} r={58} className="bz1-fill" />
      <g clipPath={`url(#${cid})`}>{children}</g>
      <circle cx={x} cy={y} r={58} className="bz1-o" style={{ strokeWidth: 2 }} />
      <text x={x} y={y + 80} textAnchor="middle" className="bz1-lbl bz1-b">
        {title}
      </text>
    </g>
  );
}

function Yeasts({ x, y }: { x: number; y: number }) {
  const cells: [number, number, number, number?][] = [
    [-24, -18, 15, 7],
    [18, -24, 13],
    [22, 10, 16, 8],
    [-20, 24, 13, 6],
    [-40, 2, 10],
    [44, 36, 11],
    [0, 46, 10],
  ];
  return (
    <g>
      {cells.map(([dx, dy, r, b], i) => (
        <g key={i}>
          <ellipse cx={x + dx} cy={y + dy} rx={r} ry={r * 0.85} className="bz1-o bz1-lvl-fill" />
          <circle cx={x + dx - r * 0.2} cy={y + dy + 2} r={r * 0.3} className="bz1-o bz1-thin bz1-nuc" />
          {b && <circle cx={x + dx + r * 0.85} cy={y + dy - r * 0.6} r={b} className="bz1-o bz1-lvl-fill" />}
        </g>
      ))}
    </g>
  );
}

function Mould({ x, y }: { x: number; y: number }) {
  const spores: [number, number][] = [];
  const tips = [-12, -4, 4, 12];
  tips.forEach((t) => {
    for (let k = 0; k < 4; k++) spores.push([x + t * 1.2 + t * 0.15 * k, y - 22 - k * 7]);
  });
  return (
    <g>
      <path
        d={`M${x - 60} ${y + 34} C${x - 30} ${y + 26} ${x - 10} ${y + 40} ${x + 20} ${y + 32} C${x + 40} ${y + 28} ${x + 50} ${y + 36} ${x + 64} ${y + 30} M${x - 30} ${y + 30} L${x - 44} ${y + 54} M${x + 30} ${y + 30} L${x + 40} ${y + 54}`}
        className="bz1-hypha"
        style={{ strokeWidth: 2.4 }}
      />
      <path
        d={`M${x} ${y + 34} V${y - 4} M${x} ${y - 4} L${x - 10} ${y - 14} M${x} ${y - 4} L${x + 10} ${y - 14} M${x - 10} ${y - 14} L${x - 15} ${y - 20} M${x - 10} ${y - 14} L${x - 5} ${y - 20} M${x + 10} ${y - 14} L${x + 5} ${y - 20} M${x + 10} ${y - 14} L${x + 15} ${y - 20}`}
        className="bz1-hypha"
        style={{ strokeWidth: 2.2 }}
      />
      {spores.map(([sx, sy], i) => (
        <circle key={i} cx={f1(sx)} cy={f1(sy)} r={3.2} className="bz1-o bz1-thin bz1-chl" />
      ))}
    </g>
  );
}

export default function FungusAnatomy() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={560} replay>
      <Fade>
        <SoilAndMushroom />
      </Fade>
      <Draw d={`M318 40 h8 V${GY - 4} h-8`} className="bz1-o bz1-lvl-s" delay={0.6} />
      <Fade delay={0.7}>
        <Lbl x={334} y={176} className="bz1-b bz1-lvl-t">
          plodnice
        </Lbl>
        <Lbl x={92} y={70} tx={126} ty={92} anchor="end" className="bz1-b">
          klobouk
        </Lbl>
        <Lbl x={92} y={146} tx={128} ty={140} anchor="end" className="bz1-b">
          lupeny
        </Lbl>
        <Lbl x={92} y={206} tx={140} ty={196} anchor="end">
          výtrusy
        </Lbl>
        <Lbl x={252} y={240} tx={226} ty={236} className="bz1-b">
          třeň
        </Lbl>
        <Lbl x={252} y={206} tx={232} ty={180} sec>
          prsten
        </Lbl>
        <Lbl x={W - 12} y={GY + 46} anchor="end" className="bz1-b bz1-halo">
          {"podhoubí\n(mycelium)"}
        </Lbl>
      </Fade>
      <Pop delay={1}>
        <Inset x={105} y={442} title="kvasinky pučí">
          <Yeasts x={105} y={438} />
        </Inset>
      </Pop>
      <Pop delay={1.2}>
        <Inset x={315} y={442} title="plíseň: hyfy, výtrusy">
          <Mould x={315} y={442} />
        </Inset>
      </Pop>
    </Figure>
  );
}

function SoilAndMushroom() {
  const { id } = useFig();
  return (
    <g>
      <rect x={8} y={GY} width={W - 16} height={70} rx={4} className="bz1-soil" />
      <rect x={8} y={GY} width={W - 16} height={70} rx={4} fill={pat(id, "dots")} />
      <path d={`M8 ${GY} H${W - 8}`} className="bz1-o" />
      <Mycelium />
      <Mushroom />
      {[126, 142, 158, 174, 246, 262, 278, 294].map((x, i) => {
        return (
          <circle
            key={i}
            cx={x}
            cy={168 + (i % 3) * 12}
            r={1.8}
            className="bz1-spot bz1-fall"
            style={{ ["--fall" as string]: "70px", animationDelay: `${-i * 0.37}s` }}
          />
        );
      })}
    </g>
  );
}
