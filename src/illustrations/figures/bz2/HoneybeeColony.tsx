import {
  Lbl,
  Dashed,
  Draw,
  Fade,
  Frame,
  Plates,
  Pop,
  pat,
  useFig,
} from "./kit";

const LABEL =
  "Včelstvo včely medonosné. Nahoře tři kasty ve stejném měřítku: matka s dlouhým zadečkem klade vajíčka a je ve včelstvu jen jedna, dělnic jsou desítky tisíc a dělají všechnu práci, trubci s velkýma očima jsou samci a slouží jen k oplození matky. Vlevo dole plástev ze šestibokých buněk: vajíčko, larva, zavíčkovaný plod, med a pyl. Vpravo dole kmitavý tanec dělnice na svislé plástvi: přímý úsek tance svírá se svislým směrem stejný úhel, jaký svírá směr ke květům se směrem ke Slunci; čím déle se včela vrtí, tím dál květy jsou.";

function Bee({
  x,
  y,
  s = 1,
  abd = 26,
  thick = 8,
  eye = 3.4,
}: {
  x: number;
  y: number;
  s?: number;
  abd?: number;
  thick?: number;
  eye?: number;
}) {
  const { id } = useFig();
  const ax = 8 + abd / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* wings */}
      <ellipse cx={10} cy={-15} rx={17} ry={6.5} transform="rotate(-14 10 -15)" className="bz2-o bz2-thin bz2-wing" />
      <ellipse cx={14} cy={-9} rx={12} ry={4.5} transform="rotate(-6 14 -9)" className="bz2-o bz2-thin bz2-wing" />
      {/* legs */}
      <path d="M-4 7 L-8 18 L-12 22 M2 8 L2 20 L0 25 M7 7 L14 18 L16 24" className="bz2-o bz2-thin" />
      {/* abdomen with stripes */}
      <ellipse cx={ax} cy={3} rx={abd / 2} ry={thick} className="bz2-o bz2-gold" />
      {Array.from({ length: 3 }, (_, i) => {
        const bx = ax - abd / 4 + (i * abd) / 4;
        return <path key={i} d={`M${bx} ${3 - thick + 1} Q${bx + 3} 3 ${bx} ${3 + thick - 1}`} className="bz2-o" style={{ strokeWidth: 3.2 }} />;
      })}
      {/* thorax */}
      <circle cx={0} cy={0} r={9} className="bz2-o bz2-chitin" />
      <circle cx={0} cy={0} r={9} fill={pat(id, "x")} />
      {/* head */}
      <circle cx={-14} cy={2} r={7} className="bz2-o bz2-chitin" />
      <ellipse cx={-15} cy={0} rx={eye * 0.75} ry={eye} className="bz2-ink-f" />
      <path d="M-18 -4 Q-24 -14 -28 -14" className="bz2-o bz2-thin" />
    </g>
  );
}

const CASTES = [
  { t: "matka", sub: "jen 1 · klade vajíčka", short: "jen 1", abd: 44, thick: 9, eye: 3.4 },
  { t: "dělnice", sub: "desítky tisíc · všechna práce", short: "desítky tisíc", abd: 24, thick: 7.5, eye: 3.4 },
  { t: "trubec", sub: "stovky · samci", short: "samci", abd: 30, thick: 10.5, eye: 6.4 },
];

function Castes() {
  const { narrow } = useFig();
  const w = narrow ? 340 : 560;
  const xs = narrow ? [52, 168, 282] : [92, 270, 440];
  const s = narrow ? 1.05 : 1.35;
  return (
    <Frame w={w} h={narrow ? 136 : 150} area="1 / -1">
      {CASTES.map((c, i) => (
        <g key={c.t}>
          <Pop delay={i * 0.15}>
            <Bee x={xs[i]} y={narrow ? 48 : 60} s={s} abd={c.abd} thick={c.thick} eye={c.eye} />
          </Pop>
          <text x={xs[i] + (narrow ? 10 : 20)} y={narrow ? 104 : 122} textAnchor="middle" className="bz2-lbl bz2-b bz2-big">
            {c.t}
          </text>
          <text x={xs[i] + (narrow ? 10 : 20)} y={narrow ? 128 : 142} textAnchor="middle" className="bz2-lbl bz2-sm">
            {narrow ? c.short : c.sub}
          </text>
        </g>
      ))}
    </Frame>
  );
}

const HEX_R = 19;
const hexPath = (cx: number, cy: number, r = HEX_R) =>
  "M" +
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(" L") +
  "Z";

type Cell = "egg" | "larva" | "cap" | "honey" | "pollen" | "empty";
const GRID: Cell[][] = [
  ["egg", "egg", "larva", "larva", "honey", "honey"],
  ["egg", "larva", "cap", "cap", "pollen", "honey"],
  ["larva", "cap", "cap", "cap", "pollen", "honey"],
  ["empty", "cap", "cap", "pollen", "honey", "honey"],
];

function Comb() {
  const { id } = useFig();
  const dx = HEX_R * Math.sqrt(3);
  const dy = HEX_R * 1.5;
  return (
    <Frame w={300} h={212} title="plástev">
      {GRID.map((row, r) =>
        row.map((c, k) => {
          const cx = 34 + k * dx + (r % 2 ? dx / 2 : 0);
          const cy = 64 + r * dy;
          return (
            <g key={`${r}-${k}`}>
              <path d={hexPath(cx, cy)} className={`bz2-o ${c === "honey" ? "bz2-honey" : c === "pollen" ? "bz2-pollen" : c === "cap" ? "bz2-wax" : "bz2-fill"}`} />
              {c === "cap" && <path d={hexPath(cx, cy, HEX_R - 3)} fill={pat(id, "dots")} />}
              {c === "honey" && <path d={hexPath(cx, cy, HEX_R - 3)} fill={pat(id, "h")} opacity={0.6} />}
              {c === "egg" && <ellipse cx={cx} cy={cy} rx={2} ry={5} className="bz2-o bz2-hair bz2-paper-f" />}
              {c === "larva" && <path d={`M${cx - 6} ${cy + 2} A7 7 0 1 1 ${cx + 6} ${cy + 2}`} className="bz2-o bz2-larva" />}
              {c === "pollen" && (
                <g>
                  <circle cx={cx - 4} cy={cy - 3} r={2.4} className="bz2-o bz2-hair bz2-gold" />
                  <circle cx={cx + 4} cy={cy + 1} r={2.4} className="bz2-o bz2-hair bz2-gold" />
                  <circle cx={cx - 1} cy={cy + 5} r={2.4} className="bz2-o bz2-hair bz2-gold" />
                </g>
              )}
            </g>
          );
        }),
      )}
      {/* legend */}
      <Lbl x={34} y={22} tx={34} ty={52} anchor="middle" className="bz2-sm">vajíčko</Lbl>
      <Lbl x={100} y={22} tx={100} ty={52} anchor="middle" className="bz2-sm">larva</Lbl>
      <Lbl x={198} y={22} tx={198} ty={52} anchor="middle" className="bz2-sm">med</Lbl>
      <Lbl x={83} y={200} tx={83} ty={160} anchor="middle" className="bz2-sm">víčko: kukla</Lbl>
      <Lbl x={170} y={200} tx={154} ty={158} anchor="middle" className="bz2-sm">pyl</Lbl>
    </Frame>
  );
}

function Dance() {
  // straight run at alpha = 40° right of vertical
  const a = (40 * Math.PI) / 180;
  const cx = 86;
  const cy = 112;
  const L = 46;
  const sx = cx - Math.sin(a) * L;
  const sy = cy + Math.cos(a) * L;
  const ex = cx + Math.sin(a) * L;
  const ey = cy - Math.cos(a) * L;
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  // zigzag along the run
  const zz: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const px = sx + (ex - sx) * t;
    const py = sy + (ey - sy) * t;
    const o = (i % 2 ? 1 : -1) * 5;
    zz.push(`${(px + Math.cos(a) * o).toFixed(1)} ${(py + Math.sin(a) * o).toFixed(1)}`);
  }
  const arc = (r: number, x: number, y: number) =>
    `M${x} ${y - r} A${r} ${r} 0 0 1 ${(x + Math.sin(a) * r).toFixed(1)} ${(y - Math.cos(a) * r).toFixed(1)}`;
  return (
    <Frame w={340} h={240} title="kmitavý tanec">
      {/* the vertical comb */}
      <rect x={14} y={30} width={144} height={170} rx={8} className="bz2-o bz2-wax" />
      <text x={86} y={222} textAnchor="middle" className="bz2-lbl bz2-sm">svislá plástev</text>
      <Dashed d={`M${cx} ${cy + 64} V${cy - 72}`} className="bz2-o bz2-thin bz2-dash" />
      <text x={cx - 6} y={48} textAnchor="end" className="bz2-lbl bz2-xs">nahoru</text>
      {/* return loops */}
      <Draw d={`M${ex} ${ey} C${ex + nx * 62} ${ey + ny * 62} ${sx + nx * 62} ${sy + ny * 62} ${sx} ${sy}`} className="bz2-o bz2-thin" delay={0.6} arrow="ink" />
      <Draw d={`M${ex} ${ey} C${ex - nx * 62} ${ey - ny * 62} ${sx - nx * 62} ${sy - ny * 62} ${sx} ${sy}`} className="bz2-o bz2-thin" delay={0.8} arrow="ink" />
      <Draw d={`M${zz.join(" L")}`} className="bz2-o bz2-lvl-s" style={{ strokeWidth: 2.4 }} delay={0.2} />
      <path d={arc(30, cx, cy)} className="bz2-o bz2-lvl-s bz2-thin" />
      <text x={cx + 8} y={cy - 34} className="bz2-lbl bz2-b bz2-lvl-t">α</text>
      {/* the field */}
      <g transform="translate(176 0)">
        <circle cx={70} cy={30} r={13} className="bz2-sun" />
        {Array.from({ length: 8 }, (_, i) => {
          const b = (i / 8) * Math.PI * 2;
          return <path key={i} d={`M${70 + Math.cos(b) * 16} ${30 + Math.sin(b) * 16} L${70 + Math.cos(b) * 22} ${30 + Math.sin(b) * 22}`} className="bz2-o bz2-thin" />;
        })}
        {/* hive */}
        <rect x={56} y={176} width={28} height={24} rx={2} className="bz2-o bz2-shell" />
        <path d="M52 176 L70 164 L88 176Z" className="bz2-o bz2-shell" />
        <text x={70} y={222} textAnchor="middle" className="bz2-lbl bz2-sm">úl</text>
        <Dashed d="M70 164 V50" className="bz2-o bz2-thin bz2-dash" />
        <Draw
          d={`M70 164 L${(70 + Math.sin(a) * 120).toFixed(1)} ${(164 - Math.cos(a) * 120).toFixed(1)}`}
          className="bz2-arr bz2-arr-lvl"
          arrow="lvl"
          delay={0.3}
        />
        <path d={arc(34, 70, 164)} className="bz2-o bz2-lvl-s bz2-thin" />
        <text x={78} y={120} className="bz2-lbl bz2-b bz2-lvl-t">α</text>
        {/* flowers */}
        <Fade delay={0.9}>
          {[
            [148, 66],
            [158, 78],
          ].map(([fx, fy], i) => (
            <g key={i}>
              <path d={`M${fx} ${fy} V${fy + 22}`} className="bz2-o bz2-thin" />
              {Array.from({ length: 5 }, (_, k) => {
                const b = (k / 5) * Math.PI * 2;
                return <circle key={k} cx={fx + Math.cos(b) * 5} cy={fy + Math.sin(b) * 5} r={4} className="bz2-o bz2-hair bz2-lvlmid-f" />;
              })}
              <circle cx={fx} cy={fy} r={2.6} className="bz2-gold" />
            </g>
          ))}
        </Fade>
        <text x={160} y={118} textAnchor="end" className="bz2-lbl bz2-sm">květy</text>
      </g>
    </Frame>
  );
}

export default function HoneybeeColony() {
  return (
    <Plates
      label={LABEL}
      level={4}
      max={720}
      cols="1fr 1.1fr"
      stackBelow={600}
      note="Úhel přímého úseku tance od svislice = úhel cesty ke květům od směru ke Slunci."
    >
      <Castes />
      <Comb />
      <Dance />
    </Plates>
  );
}
