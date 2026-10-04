import { useId } from "react";
import { Fade, Figure, Pop, pat, useFig } from "./kit";
import { projector, type LL } from "./world";

const LABEL =
  "Mapa hlavních biomů světa. Tropický deštný les (Amazonie, Kongo, jihovýchodní Asie) – teplo celý rok kolem 26 °C a přes 2 000 mm srážek. Savana (Afrika kolem pralesa, Brazílie, sever Austrálie, Indie) – teplo, 500–1 500 mm srážek a výrazné období sucha. Poušť (Sahara, Arábie, střední Asie, vnitrozemí Austrálie, Kalahari) – méně než 250 mm srážek. Listnatý les mírného pásu (Evropa včetně Česka, východ USA, východní Asie) – průměrně 5–15 °C, 600–1 500 mm a čtyři roční období. Tajga (sever Eurasie a Kanady) – jehličnatý les, dlouhá studená zima. Tundra (nejsevernější pobřeží) – průměr pod −5 °C, málo srážek a trvale zmrzlá půda. Ostatní plochy jsou stepi, hory a ledovce.";

const W = 520;
const H = 400;

type Biome = {
  id: string;
  name: string;
  key: string;
  cls: string;
  hatch: string;
  areas: LL[][];
};

const BIOMES: Biome[] = [
  {
    id: "tundra",
    name: "tundra",
    key: "pod −5 °C · do 300 mm · permafrost",
    cls: "bz4-bi-tundra",
    hatch: "h",
    areas: [
      [[-170, 80], [-50, 80], [-55, 60], [-78, 59], [-95, 61], [-112, 66], [-140, 67], [-170, 64]],
      [[22, 80], [180, 80], [180, 64], [160, 66], [140, 70], [110, 71], [80, 68], [60, 67], [40, 67], [25, 70]],
    ],
  },
  {
    id: "taiga",
    name: "tajga",
    key: "−5 až 5 °C · 300–900 mm · zima",
    cls: "bz4-bi-taiga",
    hatch: "b",
    areas: [
      [[-165, 64], [-140, 67], [-112, 66], [-95, 61], [-78, 59], [-55, 60], [-55, 50], [-70, 46], [-90, 47], [-120, 52], [-135, 58], [-160, 58]],
      [[6, 58], [20, 70], [25, 70], [40, 67], [60, 67], [80, 68], [110, 71], [140, 70], [160, 66], [180, 64], [180, 57], [160, 56], [140, 51], [125, 49], [110, 51], [90, 53], [60, 56], [40, 57], [25, 58]],
    ],
  },
  {
    id: "temperate",
    name: "listnatý les mírného pásu",
    key: "5–15 °C · 600–1 500 mm · 4 období",
    cls: "bz4-bi-temp",
    hatch: "d",
    areas: [
      [[-96, 48], [-70, 47], [-64, 44], [-75, 35], [-82, 30], [-95, 30], [-98, 38]],
      [[-11, 59], [6, 58], [25, 58], [40, 57], [46, 51], [32, 45], [20, 41], [5, 43], [-11, 42]],
      [[110, 51], [125, 49], [140, 51], [146, 44], [141, 32], [120, 24], [104, 25], [110, 35], [115, 42]],
      [[-76, -37], [-70, -37], [-70, -56], [-77, -56]],
      [[139, -33], [153, -27], [153, -40], [143, -41]],
      [[164, -33], [180, -33], [180, -48], [164, -48]],
    ],
  },
  {
    id: "desert",
    name: "poušť",
    key: "pod 250 mm · velké výkyvy teplot",
    cls: "bz4-bi-desert",
    hatch: "dots",
    areas: [
      [[-18, 16], [-18, 30], [-8, 31], [10, 32], [30, 31], [35, 32], [45, 33], [60, 35], [70, 32], [72, 25], [60, 24], [55, 17], [45, 13], [35, 16], [25, 16], [10, 15]],
      [[52, 46], [62, 47], [80, 45], [95, 46], [112, 45], [116, 40], [100, 37], [85, 36], [70, 39], [55, 40]],
      [[116, -20], [138, -19], [143, -28], [134, -33], [118, -30]],
      [[11, -29], [11, -17], [22, -18], [26, -24], [21, -31]],
      [[-119, 37], [-109, 37], [-103, 30], [-103, 23], [-112, 25]],
      [[-81, -4], [-75, -4], [-70, -28], [-72, -28]],
    ],
  },
  {
    id: "savanna",
    name: "savana",
    key: "20–30 °C · 500–1 500 mm · sucho",
    cls: "bz4-bi-sav",
    hatch: "x",
    areas: [
      [[-17, 15], [10, 15], [25, 16], [35, 16], [45, 12], [41, 5], [30, 5], [10, 8], [-10, 8], [-17, 11]],
      [[12, -5], [30, -3], [41, -5], [41, -18], [34, -26], [26, -24], [22, -18], [12, -17]],
      [[-61, -8], [-42, -3], [-37, -12], [-44, -23], [-55, -23], [-63, -15]],
      [[119, -11], [146, -10], [149, -21], [138, -19], [116, -20]],
      [[72, 25], [86, 25], [87, 20], [80, 11], [73, 15]],
      [[-73, 9], [-61, 10], [-61, 5], [-73, 5]],
    ],
  },
  {
    id: "rainforest",
    name: "tropický deštný les",
    key: "kolem 26 °C · přes 2 000 mm · celý rok",
    cls: "bz4-bi-rain",
    hatch: "xd",
    areas: [
      [[-79, 5], [-60, 8], [-50, 2], [-44, -3], [-50, -7], [-61, -8], [-70, -12], [-78, -8]],
      [[8, 5], [30, 4], [30, -5], [12, -5]],
      [[-14, 10], [-6, 9], [6, 6.5], [9, 4], [-8, 4]],
      [[95, 20], [108, 18], [110, 10], [126, 10], [151, -3], [151, -10], [131, -9.5], [105, -9], [95, 5]],
      [[-92, 18], [-84, 16], [-77, 8.5], [-80, 7], [-88, 13]],
    ],
  },
];

function Swatch({ b, x, y }: { b: Biome; x: number; y: number }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={x} y={y} width={28} height={20} rx={3} className={`bz4-o bz4-thin ${b.cls}`} />
      <rect x={x} y={y} width={28} height={20} rx={3} fill={pat(id, b.hatch)} opacity={0.55} />
    </g>
  );
}

export default function Biomes() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={680}>
      <Inner />
    </Figure>
  );
}

function Inner() {
  const { id } = useFig();
  const clip = "bz4bi" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const MX = 10;
  const MY = 10;
  const pr = projector(MX, MY, W - 20);
  const [cx, cy] = pr.p(15.5, 49.8);
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={pr.land} />
        </clipPath>
      </defs>
      <rect x={MX} y={MY} width={W - 20} height={pr.h} rx={4} className="bz4-hm-sea" />
      <path d={pr.land} className="bz4-bi-other" />
      <path d={pr.land} fill={pat(id, "dots")} opacity={0.35} />
      <g clipPath={`url(#${clip})`}>
        {BIOMES.map((b, i) => (
          <Fade key={b.id} delay={0.1 + i * 0.15}>
            {b.areas.map((a, k) => (
              <g key={k}>
                <path d={pr.ring(a)} className={b.cls} />
                <path d={pr.ring(a)} fill={pat(id, b.hatch)} opacity={0.5} />
              </g>
            ))}
          </Fade>
        ))}
      </g>
      <path d={pr.land} className="bz4-o bz4-thin" fill="none" />
      {/* equator and tropics */}
      {[0, 23.4, -23.4].map((lat) => {
        const y = pr.p(0, lat)[1];
        return <line key={lat} x1={MX} x2={W - MX} y1={y} y2={y} className={lat === 0 ? "bz4-bi-eq" : "bz4-bi-trop"} />;
      })}
      <text x={W - MX - 4} y={pr.p(0, 0)[1] - 4} textAnchor="end" className="bz4-bi-lat">rovník</text>
      <Pop delay={1.1}>
        <circle cx={cx} cy={cy} r={4} className="bz4-bi-cz" />
        <text x={cx - 6} y={cy - 8} textAnchor="end" className="bz4-hm-t">ČR</text>
      </Pop>

      {/* legend with climate keys */}
      <Fade delay={0.6}>
        {BIOMES.slice()
          .reverse()
          .map((b, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 10 + col * 262;
            const y = pr.h + 30 + row * 46;
            return (
              <g key={b.id}>
                <Swatch b={b} x={x} y={y} />
                <text x={x + 36} y={y + 13} className="bz4-lbl bz4-sm bz4-b">
                  {b.name}
                </text>
                <text x={x + 36} y={y + 31} className="bz4-bi-key">
                  {b.key}
                </text>
              </g>
            );
          })}
        <rect x={12} y={H - 26} width={28} height={16} rx={3} className="bz4-o bz4-thin bz4-bi-other" />
        <text x={48} y={H - 13} className="bz4-lbl bz4-sm">
          ostatní: stepi, středomoří, hory, ledovce
        </text>
      </Fade>
    </g>
  );
}
