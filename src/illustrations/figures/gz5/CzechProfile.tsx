import { Draw, Fade, Figure, Pop, pat, smoothPath, useFig } from "./kit";

const LABEL =
  "Schematický výškový profil Českem od jihozápadu k severovýchodu: ze Šumavy (Boubín 1 362 m n. m.) přes nižší pahorkatiny k Brdům (Tok 865 m), dolů do údolí Vltavy v Praze (asi 186 m), přes plochou nížinu Polabí kolem Labe (asi 185 m) a nahoru do Krkonoš na Sněžku (1 603 m n. m.), nejvyšší horu Česka. Výšky jsou oproti délkám mnohonásobně zvětšené. Nejnižší bod Česka, hladina Labe u Hřenska (115 m n. m.), leží mimo tento profil. Celý profil leží v Českém masivu.";

const W = 440;
const H = 336;
const L = 52;
const R = 424;
const TOP = 70;
const BASE = 262; // 0 m n. m.
const KM = 300;
const MMAX = 1700;
const X = (km: number) => L + ((R - L) * km) / KM;
const Y = (m: number) => BASE - ((BASE - TOP) * m) / MMAX;
/** vertical exaggeration of the drawing */
const EXAG = (BASE - TOP) / MMAX / ((R - L) / (KM * 1000));

// [km along the route, m n. m.] – Boubín → Brdy → Praha → Polabí → Sněžka → Polsko
const PTS: [number, number][] = [
  [0, 1362], [5, 1120], [10, 920], [17, 760], [25, 610], [34, 530], [44, 570],
  [54, 490], [62, 540], [70, 660], [76, 800], [80, 865], [84, 760], [90, 610],
  [98, 440], [108, 390], [116, 330], [121, 270], [125, 186], [129, 260],
  [136, 300], [146, 280], [156, 240], [166, 210], [175, 185], [185, 200],
  [195, 235], [205, 300], [215, 335], [225, 400], [235, 425], [245, 510],
  [254, 660], [262, 900], [268, 1190], [273, 1440], [277, 1603], [282, 1330],
  [288, 940], [294, 640], [300, 470],
];

const LINE = smoothPath(PTS.map(([k, m]) => [X(k), Y(m)]));
const GROUND = `${LINE} L${R} ${BASE} L${L} ${BASE} Z`;

// height bands (hypsometric tints as in a school atlas)
const BANDS: { from: number; to: number; cls: string }[] = [
  { from: 0, to: 200, cls: "gz5-low" },
  { from: 200, to: 500, cls: "gz5-hill" },
  { from: 500, to: 1000, cls: "gz5-mount" },
  { from: 1000, to: 1800, cls: "gz5-high" },
];

function Ground() {
  const { id } = useFig();
  const clip = `${id}-cp`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={GROUND} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {BANDS.map((b) => (
          <rect
            key={b.from}
            x={L}
            y={Y(b.to)}
            width={R - L}
            height={Y(b.from) - Y(b.to)}
            className={b.cls}
          />
        ))}
        <rect x={L} y={TOP - 10} width={R - L} height={BASE - TOP + 10} fill={pat(id, "d")} opacity={0.55} />
      </g>
    </g>
  );
}

type Peak = { km: number; m: number; name: string; sub: string; y: number; anchor?: "start" | "middle" | "end"; dx?: number };
const PEAKS: Peak[] = [
  { km: 0, m: 1362, name: "Šumava", sub: "Boubín 1 362 m", y: 26, anchor: "start", dx: -4 },
  { km: 80, m: 865, name: "Brdy", sub: "Tok 865 m", y: 92, anchor: "middle" },
  { km: 125, m: 186, name: "Praha", sub: "Vltava 186 m", y: 146, anchor: "middle" },
  { km: 175, m: 185, name: "Polabí", sub: "Labe 185 m", y: 146, anchor: "start", dx: -6 },
  { km: 277, m: 1603, name: "Krkonoše", sub: "Sněžka 1 603 m", y: 26, anchor: "end", dx: 22 },
];

function Plate() {
  return (
    <>
      {/* height axis */}
      {[0, 500, 1000, 1500].map((m) => (
        <g key={m}>
          <path d={`M${L} ${Y(m)} H${R}`} className="gz5-grid" />
          <text x={L - 6} y={Y(m) + 4} textAnchor="end" className="gz5-num">
            {m === 0 ? "0" : m.toLocaleString("cs-CZ").replace(/\s/g, " ")}
          </text>
        </g>
      ))}
      <text x={L - 6} y={TOP - 14} textAnchor="end" className="gz5-lbl gz5-sm">
        m n. m.
      </text>

      <Fade delay={0.2}>
        <Ground />
      </Fade>
      <Draw d={LINE} className="gz5-o" delay={0} />
      <path d={`M${L} ${BASE} H${R}`} className="gz5-o" />

      {/* lowest point of Czechia, off this profile */}
      <Fade delay={1.2}>
        <path d={`M${L} ${Y(115)} H${R}`} className="gz5-ln gz5-dot2 gz5-blue-s" />
        <text x={L} y={BASE + 44} className="gz5-lbl gz5-sm gz5-blue-t">
          ··· nejnižší bod Česka: Hřensko 115 m (mimo profil)
        </text>
      </Fade>

      {/* rivers in the valleys */}
      {[125, 175].map((k) => (
        <ellipse key={k} cx={X(k)} cy={Y(k === 125 ? 186 : 185) + 2} rx={4} ry={2.2} className="gz5-water-dot" />
      ))}

      {PEAKS.map((p, i) => {
        const x = X(p.km) + (p.dx ?? 0);
        return (
          <Pop key={p.name} delay={0.6 + i * 0.18}>
            <path d={`M${X(p.km)} ${Y(p.m) - 4} V${p.y + 28}`} className="gz5-lead" />
            <circle cx={X(p.km)} cy={Y(p.m)} r={2.6} className="gz5-peak-dot" />
            <text x={x} y={p.y} textAnchor={p.anchor} className="gz5-lbl gz5-b">
              {p.name}
            </text>
            <text x={x} y={p.y + 18} textAnchor={p.anchor} className="gz5-eq gz5-eq-sm">
              {p.sub}
            </text>
          </Pop>
        );
      })}

      {/* distance axis */}
      {[0, 100, 200, 300].map((k) => (
        <g key={k}>
          <path d={`M${X(k)} ${BASE} v5`} className="gz5-o gz5-thin" />
          <text x={X(k)} y={BASE + 19} textAnchor={k === 300 ? "end" : "middle"} dx={k === 300 ? 4 : 0} className="gz5-num">
            {k === 300 ? "300 km" : k}
          </text>
        </g>
      ))}
      <Fade delay={1.6}>
        <text x={L} y={H - 10} className="gz5-lbl gz5-sm gz5-muted-t">
          JZ
        </text>
        <text x={R} y={H - 10} textAnchor="end" className="gz5-lbl gz5-sm gz5-muted-t">
          SV
        </text>
        <text x={(L + R) / 2} y={H - 10} textAnchor="middle" className="gz5-lbl gz5-sm gz5-muted-t">
          výšky ≈ {Math.round(EXAG / 10) * 10}× zvětšené
        </text>
      </Fade>
    </>
  );
}

export default function CzechProfile() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={640} replay>
      <Plate />
    </Figure>
  );
}
