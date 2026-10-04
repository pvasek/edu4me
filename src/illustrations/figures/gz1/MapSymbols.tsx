import { Fade, Figure, useFig, pat } from "./kit";

const LABEL =
  "Malá topografická mapa s legendou. Bodové značky: kostel, vrchol s nadmořskou výškou 712 m a pramen. Liniové značky: silnice, železnice, řeka a státní hranice. Plošné značky: les, vodní plocha a zastavěná plocha. Legenda vysvětluje každou značku, bez ní mapu nepřečteme.";

const W = 520;
const H = 470;
const MX = 14;
const MY = 10;
const MW = 492;
const MH = 262;

function Church({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5} className="gz1-o gz1-fill" style={{ strokeWidth: 1.4 }} />
      <path d={`M${x} ${y - 5} v-10 M${x - 4} ${y - 11} h8`} className="gz1-o" style={{ strokeWidth: 1.6 }} />
    </g>
  );
}
function Peak({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 7} L${x + 7} ${y + 5} L${x - 7} ${y + 5}Z`} className="gz1-o" style={{ fill: "var(--ink)" }} />;
}
function Spring({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4.5} className="gz1-spring" />
    </g>
  );
}

const ROAD = "M14 120 C90 128 150 150 210 150 S330 132 380 160 S460 220 506 214";
const RAIL = "M14 236 C140 226 260 248 360 236 S470 200 506 196";
const RIVER = "M150 38 C160 70 140 92 170 112 S236 150 262 182 S296 192 312 196";
const BORDER = "M452 10 C440 60 470 100 446 150 S470 230 456 272";

function Map() {
  const { id } = useFig();
  return (
    <g>
      <rect x={MX} y={MY} width={MW} height={MH} className="gz1-mapbg" />
      {/* forest */}
      <path d="M14 10 H120 C130 50 96 80 60 96 S20 100 14 104Z" className="gz1-forest" />
      <path d="M60 272 C70 250 110 240 140 252 S170 266 176 272Z" className="gz1-forest" />
      <path d="M60 272 C70 250 110 240 140 252 S170 266 176 272Z" fill={pat(id, "forest")} />
      <path d="M14 10 H120 C130 50 96 80 60 96 S20 100 14 104Z" fill={pat(id, "forest")} />
      <path d="M300 10 H420 C430 40 400 70 360 76 S300 60 300 10Z" className="gz1-forest" />
      <path d="M300 10 H420 C430 40 400 70 360 76 S300 60 300 10Z" fill={pat(id, "forest")} />
      {/* lake */}
      <path d="M296 194 C316 176 366 178 380 194 S356 222 326 222 S286 208 296 194Z" className="gz1-lake gz1-o gz1-thin" />
      {/* village (built-up area) */}
      <path d="M186 132 L246 128 L262 158 L240 182 L196 178 L180 156Z" className="gz1-built gz1-o gz1-thin" />
      <path d={RIVER} className="gz1-river" />
      <path d={ROAD} className="gz1-road" />
      <path d={ROAD} className="gz1-road-in" />
      <path d={RAIL} className="gz1-rail" />
      <path d={RAIL} className="gz1-rail-in" />
      <path d={BORDER} className="gz1-border" />
      <Church x={226} y={172} />
      <text x={196} y={200} className="gz1-lbl gz1-b gz1-sm gz1-halo">
        Lhota
      </text>
      <Peak x={360} y={110} />
      <text x={374} y={115} className="gz1-num gz1-halo">
        712
      </text>
      <Spring x={150} y={38} />
      <rect x={MX} y={MY} width={MW} height={MH} className="gz1-o" />
    </g>
  );
}

type Item = { name: string; sym: (x: number, y: number) => React.ReactNode };
function useCols(): { title: string; items: Item[] }[] {
  const { id } = useFig();
  const seg = (cls: string, inner?: string) => (x: number, y: number) => (
    <g>
      <path d={`M${x - 14} ${y} H${x + 14}`} className={cls} />
      {inner && <path d={`M${x - 14} ${y} H${x + 14}`} className={inner} />}
    </g>
  );
  const area = (cls: string, forest = false) => (x: number, y: number) => (
    <g>
      <rect x={x - 14} y={y - 9} width={28} height={18} className={`${cls} gz1-o gz1-thin`} />
      {forest && <rect x={x - 14} y={y - 9} width={28} height={18} fill={pat(id, "forest")} />}
    </g>
  );
  return [
    {
      title: "bodové",
      items: [
        { name: "kostel", sym: (x, y) => <Church x={x} y={y + 4} /> },
        { name: "vrchol (m n. m.)", sym: (x, y) => <Peak x={x} y={y} /> },
        { name: "pramen", sym: (x, y) => <Spring x={x} y={y} /> },
      ],
    },
    {
      title: "liniové",
      items: [
        { name: "silnice", sym: seg("gz1-road", "gz1-road-in") },
        { name: "železnice", sym: seg("gz1-rail", "gz1-rail-in") },
        { name: "řeka", sym: seg("gz1-river") },
        { name: "státní hranice", sym: seg("gz1-border") },
      ],
    },
    {
      title: "plošné",
      items: [
        { name: "les", sym: area("gz1-forest", true) },
        { name: "vodní plocha", sym: area("gz1-lake") },
        { name: "zastavěná plocha", sym: area("gz1-built") },
      ],
    },
  ];
}

function Legend() {
  const cols = useCols();
  const y0 = MY + MH + 30;
  const cw = MW / 3;
  return (
    <g>
      <text x={MX} y={y0 - 6} className="gz1-lbl gz1-b gz1-sec">
        Legenda
      </text>
      {cols.map((c, i) => {
        const x = MX + i * cw;
        return (
          <g key={c.title}>
            <text x={x + 2} y={y0 + 18} className="gz1-lbl gz1-b gz1-lvl-t">
              {c.title}
            </text>
            {c.items.map((it, k) => (
              <g key={it.name}>
                {it.sym(x + 18, y0 + 42 + k * 30)}
                <text x={x + 40} y={y0 + 47 + k * 30} className="gz1-lbl gz1-sm">
                  {it.name}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function MapSymbols() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={620}>
      <ForestPattern />
      <Map />
      <Fade delay={0.3}>
        <Legend />
      </Fade>
    </Figure>
  );
}

/** little tree-crown marks for the forest areas */
function ForestPattern() {
  const { id } = useFig();
  return (
    <defs>
      <pattern id={`${id}-forest`} width={16} height={14} patternUnits="userSpaceOnUse">
        <circle cx={5} cy={5} r={3} className="gz1-treemark" />
        <circle cx={13} cy={12} r={3} className="gz1-treemark" />
      </pattern>
    </defs>
  );
}
