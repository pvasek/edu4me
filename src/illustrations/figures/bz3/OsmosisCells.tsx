import { Arrow, Fade, Figure, Pop, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Osmóza u červené krvinky a rostlinné buňky ve třech roztocích. V hypotonickém roztoku, kde je venku méně rozpuštěných látek, voda proudí do buňky: krvinka nabobtná a praskne (hemolýza), rostlinná buňka se napne a pevná buněčná stěna ji udrží – vzniká turgor. V izotonickém roztoku voda proudí oběma směry stejně, krvinka má normální tvar a rostlinná buňka je ochablá. V hypertonickém roztoku s více solí venku voda z buňky odchází: krvinka se svraští (plazmorhiza neboli krenace) a u rostlinné buňky se protoplast odtrhne od stěny – plazmolýza.";

const W = 420;
const H = 452;
const COLS = [
  { x: 72, name: "hypotonický", sub: "venku méně solí", dots: 4 },
  { x: 210, name: "izotonický", sub: "stejně solí", dots: 12 },
  { x: 348, name: "hypertonický", sub: "venku více solí", dots: 26 },
];
const R1 = 126; // red cell row
const R2 = 314; // plant cell row

function RedCell({ x, y, kind }: { x: number; y: number; kind: 0 | 1 | 2 }) {
  const { id } = useFig();
  if (kind === 0)
    return (
      <g>
        <circle cx={x} cy={y} r={36} className="bz3-rbc" />
        <circle cx={x} cy={y} r={36} fill={pat(id, "d")} opacity={0.3} />
        <path d={`M${x + 24} ${y - 27} l8 -9 M${x + 30} ${y - 18} l12 -4 M${x + 18} ${y - 32} l2 -12`} className="bz3-burst" />
      </g>
    );
  if (kind === 1)
    return (
      <g>
        <circle cx={x} cy={y} r={30} className="bz3-rbc" />
        <circle cx={x} cy={y} r={30} fill={pat(id, "d")} opacity={0.3} />
        <ellipse cx={x} cy={y} rx={13} ry={12} className="bz3-rbc-in" />
      </g>
    );
  // crenated: spiky shrunken outline
  let d = "";
  const n = 14;
  for (let i = 0; i <= n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const rr = i % 2 ? 26 : 19;
    d += `${i ? "L" : "M"}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `;
  }
  return (
    <g>
      <path d={d + "Z"} className="bz3-rbc" strokeLinejoin="round" />
      <path d={d + "Z"} fill={pat(id, "dd")} opacity={0.35} />
    </g>
  );
}

function PlantCell({ x, y, kind }: { x: number; y: number; kind: 0 | 1 | 2 }) {
  const { id } = useFig();
  const w = 104;
  const h = 76;
  const inset = kind === 2 ? 16 : kind === 1 ? 3 : 0;
  const vac = kind === 0 ? [36, 22] : kind === 1 ? [30, 17] : [18, 11];
  const px = x - w / 2 + 5 + inset;
  const py = y - h / 2 + 5 + inset * 0.7;
  const pw = w - 10 - inset * 2;
  const ph = h - 10 - inset * 1.4;
  const rx = kind === 2 ? 18 : 6;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} className="bz3-wall" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} fill={pat(id, "d")} opacity={0.5} />
      <rect x={x - w / 2 + 5} y={y - h / 2 + 5} width={w - 10} height={h - 10} rx={3} className="bz3-wall-in" />
      <rect x={px} y={py} width={pw} height={ph} rx={rx} className={kind === 1 ? "bz3-proto bz3-proto-soft" : "bz3-proto"} />
      <ellipse cx={x + 4} cy={y + 1} rx={vac[0]} ry={vac[1]} className="bz3-vacuole" />
      <circle cx={px + 12} cy={py + 12} r={6} className="bz3-nucleus bz3-o bz3-thin" />
      {[
        [px + pw - 10, py + 8],
        [px + 10, py + ph - 8],
        [px + pw - 14, py + ph - 7],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={4.5} ry={2.6} className="bz3-chloro" />
      ))}
    </g>
  );
}

function Water({ x, y, kind, r, vertical = false }: { x: number; y: number; kind: 0 | 1 | 2; r: number; vertical?: boolean }) {
  // arrows on both sides of the cell: in (0), both ways (1), out (2)
  const seg = (sgn: number, from: number, to: number, off = 0) =>
    vertical
      ? `M${x + off} ${y + sgn * from} V${y + sgn * to}`
      : `M${x + sgn * from} ${y + off} H${x + sgn * to}`;
  const a = (sgn: number) => {
    const outer = r + 24;
    const inner = r + 4;
    if (kind === 0) return <Arrow key={sgn} d={seg(sgn, outer, inner)} tone="blue" className="bz3-arr-w" />;
    if (kind === 2) return <Arrow key={sgn} d={seg(sgn, inner, outer)} tone="blue" className="bz3-arr-w" />;
    return (
      <g key={sgn}>
        <Arrow d={seg(sgn, outer, inner, -6)} tone="blue" />
        <Arrow d={seg(sgn, inner, outer, 6)} tone="blue" />
      </g>
    );
  };
  return <g>{[-1, 1].map(a)}</g>;
}

function Plate() {
  return (
    <>
      {COLS.map((c, i) => {
        const r = rng(i + 3);
        return (
          <g key={c.name}>
            <rect x={c.x - 66} y={44} width={132} height={H - 50} rx={10} className="bz3-sol" />
            {Array.from({ length: c.dots }, (_, k) => (
              <circle key={k} cx={f1(c.x - 58 + r() * 116)} cy={f1(52 + r() * (H - 66))} r={2} className="bz3-salt" />
            ))}
            <text x={c.x} y={20} textAnchor="middle" className="bz3-lbl bz3-b">
              {c.name}
            </text>
            <text x={c.x} y={38} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
              {c.sub}
            </text>
          </g>
        );
      })}
      <Fade>
        <text x={10} y={66} className="bz3-lbl bz3-sm bz3-b bz3-lvl-t bz3-halo">
          červená krvinka
        </text>
        <text x={10} y={244} className="bz3-lbl bz3-sm bz3-b bz3-lvl-t bz3-halo">
          rostlinná buňka
        </text>
      </Fade>
      {COLS.map((c, i) => (
        <Pop key={`r${i}`} delay={0.2 + i * 0.2}>
          <RedCell x={c.x} y={R1} kind={i as 0 | 1 | 2} />
          <Water x={c.x} y={R1} kind={i as 0 | 1 | 2} r={i === 0 ? 36 : i === 1 ? 30 : 26} />
          <text x={c.x} y={R1 + 64} textAnchor="middle" className="bz3-lbl bz3-sm bz3-b bz3-halo">
            {["nabobtná, praskne", "normální tvar", "svraští se"][i]}
          </text>
          {i !== 1 && (
            <text x={c.x} y={R1 + 82} textAnchor="middle" className="bz3-lbl bz3-sm bz3-halo">
              {i === 0 ? "(hemolýza)" : "(plazmorhiza)"}
            </text>
          )}
          {i === 2 && (
            <text x={c.x} y={R1 + 100} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t bz3-halo">
              = krenace
            </text>
          )}
        </Pop>
      ))}
      {COLS.map((c, i) => (
        <Pop key={`p${i}`} delay={0.5 + i * 0.2}>
          <PlantCell x={c.x} y={R2} kind={i as 0 | 1 | 2} />
          <Water x={c.x} y={R2} kind={i as 0 | 1 | 2} r={38} vertical />
          <text x={c.x} y={R2 + 84} textAnchor="middle" className="bz3-lbl bz3-sm bz3-b bz3-halo">
            {["turgor", "ochablá", "plazmolýza"][i]}
          </text>
          <text x={c.x} y={R2 + 102} textAnchor="middle" className="bz3-lbl bz3-sm bz3-halo">
            {["stěna ji udrží", "voda v rovnováze", "protoplast od stěny"][i]}
          </text>
        </Pop>
      ))}
    </>
  );
}

export default function OsmosisCells() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={580}>
      <Plate />
    </Figure>
  );
}
