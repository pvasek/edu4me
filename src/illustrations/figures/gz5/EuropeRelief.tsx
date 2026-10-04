import { Draw, Fade, Figure, Lbl, Pop, pat, smoothPath, useFig } from "./kit";

const LABEL =
  "Schematický výškový řez Evropou od západu na východ: z Atlantského oceánu přes pobřeží a nízkou Pařížskou pánev, přes pohoří Jura k Alpám s Mont Blankem (≈ 4 806 m n. m., nejvyšší hora Alp), dál přes Alpské předhůří a Českou vysočinu na Severoevropskou nížinu a rozlehlou Východoevropskou rovinu až k Uralu (Narodnaja 1 895 m), za jehož východním úpatím začíná Asie. Na západě a jihu Evropy jsou vysoká mladá pohoří, na severu a východě převládají nížiny. Výšky jsou oproti délkám asi pětisetkrát zvětšené.";

const W = 460;
const H = 340;
const L = 54;
const R = 446;
const KM0 = -1100;
const KM1 = 4800;
const SEA = 236; // y of 0 m n. m.
const TOPY = 62; // y of 4 806 m
const BOT = 282; // bottom of the drawing
const X = (km: number) => L + ((R - L) * (km - KM0)) / (KM1 - KM0);
const Y = (m: number) => SEA - ((SEA - TOPY) * m) / 4806;
const EXAG = (SEA - TOPY) / 4806 / ((R - L) / ((KM1 - KM0) * 1000));

// [km from the Breton coast, m n. m.] along Brest → Paříž → Mont Blanc → Řezno → Praha → Varšava-ish → Valdaj → Narodnaja
const PTS: [number, number][] = [
  [-1100, -3800], [-800, -3600], [-500, -3300], [-260, -2600], [-190, -500],
  [-140, -160], [-60, -110], [0, 0], [40, 180], [90, 260], [160, 140], [260, 110], [360, 70],
  [460, 140], [560, 260], [650, 380], [720, 600], [770, 1450], [800, 900],
  [840, 420], [870, 1500], [900, 4806], [930, 3000], [970, 3700], [1010, 2600],
  [1060, 3300], [1110, 2100], [1170, 1200], [1230, 650], [1310, 520], [1380, 360],
  [1460, 650], [1520, 1250], [1560, 900], [1640, 450], [1720, 280], [1800, 380],
  [1860, 1200], [1900, 700], [1980, 250], [2100, 160], [2300, 110], [2500, 130],
  [2700, 160], [2900, 140], [3050, 210], [3150, 300], [3250, 190], [3450, 160],
  [3700, 200], [3950, 170], [4200, 140], [4380, 200], [4480, 420], [4550, 1000],
  [4600, 1895], [4640, 1100], [4690, 450], [4740, 160], [4800, 90],
];
const LINE = smoothPath(PTS.map(([k, m]) => [X(k), Y(m)]));
const GROUND = `${LINE} L${R} ${BOT} L${L} ${BOT} Z`;

const BANDS: { from: number; to: number; cls: string }[] = [
  { from: -5000, to: 0, cls: "gz5-crust" },
  { from: 0, to: 200, cls: "gz5-low" },
  { from: 200, to: 500, cls: "gz5-hill" },
  { from: 500, to: 2000, cls: "gz5-mount" },
  { from: 2000, to: 3500, cls: "gz5-high" },
  { from: 3500, to: 6000, cls: "gz5-snow" },
];

function Ground() {
  const { id } = useFig();
  const clip = `${id}-er`;
  return (
    <g>
      <rect x={L} y={SEA} width={X(0) - L} height={BOT - SEA} className="gz5-sea" />
      <rect x={L} y={SEA} width={X(0) - L} height={BOT - SEA} fill={pat(id, "h")} />
      <clipPath id={clip}>
        <path d={GROUND} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {BANDS.map((b) => (
          <rect
            key={b.from}
            x={L}
            y={Math.max(TOPY - 20, Y(b.to))}
            width={R - L}
            height={Math.min(BOT, Y(b.from)) - Math.max(TOPY - 20, Y(b.to))}
            className={b.cls}
          />
        ))}
        <rect x={L} y={TOPY - 20} width={R - L} height={BOT - TOPY + 20} fill={pat(id, "d")} opacity={0.5} />
      </g>
    </g>
  );
}

/** keeps the cut-off ocean floor inside the plate */
function ClipBox({ children }: { children: React.ReactNode }) {
  const { id } = useFig();
  return (
    <g>
      <clipPath id={`${id}-box`}>
        <rect x={L} y={0} width={R - L} height={BOT} />
      </clipPath>
      <g clipPath={`url(#${id}-box)`}>{children}</g>
    </g>
  );
}

function Plate() {
  const asia = X(4700);
  return (
    <>
      {/* height axis */}
      {[0, 2000, 4000].map((m) => (
        <g key={m}>
          <path d={`M${L} ${Y(m)} H${R}`} className="gz5-grid" />
          <text x={L - 6} y={Y(m) + 4} textAnchor="end" className="gz5-num">
            {m === 0 ? "0" : `${m / 1000} 000`}
          </text>
        </g>
      ))}
      <text x={L - 6} y={TOPY - 26} textAnchor="end" className="gz5-lbl gz5-sm">
        m n. m.
      </text>

      <Fade delay={0.2}>
        <Ground />
      </Fade>
      <ClipBox>
        <Draw d={LINE} className="gz5-o" />
      </ClipBox>
      <path d={`M${L} ${SEA} H${X(0)}`} className="gz5-sea-line" />
      <path d={`M${L} ${BOT} H${R}`} className="gz5-o gz5-thin" />

      {/* Europe | Asia: the eastern foot of the Urals */}
      <Fade delay={1.2}>
        <path d={`M${asia} ${Y(450) - 4} V${BOT}`} className="gz5-ln gz5-dash gz5-thin" />
        <text x={asia + 4} y={BOT - 8} className="gz5-lbl gz5-sm gz5-muted-t">
          Asie
        </text>
        <text x={asia - 4} y={BOT - 8} textAnchor="end" className="gz5-lbl gz5-sm gz5-muted-t">
          Evropa
        </text>
      </Fade>

      <Pop delay={0.5}>
        <text x={L + 3} y={SEA + 20} className="gz5-lbl gz5-sm gz5-blue-t">
          Atlantský
        </text>
        <text x={L + 3} y={SEA + 37} className="gz5-lbl gz5-sm gz5-blue-t">
          oceán
        </text>
      </Pop>
      <Pop delay={0.65}>
        <Lbl x={X(250)} y={182} tx={X(250)} ty={Y(110) - 3} anchor="middle" className="gz5-sm">
          {"Pařížská\npánev"}
        </Lbl>
      </Pop>
      <Pop delay={0.8}>
        <circle cx={X(900)} cy={Y(4806)} r={2.8} className="gz5-peak-dot" />
        <text x={X(900) + 10} y={TOPY + 2} className="gz5-lbl gz5-b gz5-big">
          Alpy
        </text>
        <text x={X(900) + 10} y={TOPY + 20} className="gz5-eq gz5-eq-sm">
          Mont Blanc
        </text>
        <text x={X(900) + 10} y={TOPY + 37} className="gz5-eq gz5-eq-sm">
          ≈ 4 806 m
        </text>
      </Pop>
      <Pop delay={0.95}>
        <Lbl x={X(1560)} y={128} tx={X(1520)} ty={Y(1250) - 3} anchor="middle" className="gz5-sm">
          {"Česká\nvysočina"}
        </Lbl>
      </Pop>
      <Pop delay={1.1}>
        <Lbl x={X(2480)} y={184} tx={X(2480)} ty={Y(125) - 3} anchor="middle" className="gz5-sm">
          {"Severoevropská\nnížina"}
        </Lbl>
      </Pop>
      <Pop delay={1.25}>
        <Lbl x={X(3650)} y={128} tx={X(3650)} ty={Y(190) - 3} anchor="middle" className="gz5-sm">
          {"Východoevropská\nrovina"}
        </Lbl>
      </Pop>
      <Pop delay={1.4}>
        <path d={`M${X(4600)} ${Y(1895) - 5} V${TOPY + 26}`} className="gz5-lead" />
        <circle cx={X(4600)} cy={Y(1895)} r={2.8} className="gz5-peak-dot" />
        <text x={R + 4} y={TOPY + 2} textAnchor="end" className="gz5-lbl gz5-b gz5-big">
          Ural
        </text>
        <text x={R + 4} y={TOPY + 20} textAnchor="end" className="gz5-eq gz5-eq-sm">
          Narodnaja 1 895 m
        </text>
      </Pop>

      {/* scale and notes */}
      <Fade delay={1.6}>
        <path d={`M${L} ${BOT + 18} h${X(1000) - X(0)} M${L} ${BOT + 13} v10 M${L + X(1000) - X(0)} ${BOT + 13} v10`} className="gz5-o" />
        <text x={L + X(1000) - X(0) + 8} y={BOT + 22} className="gz5-eq gz5-eq-sm">
          1 000 km
        </text>
        <text x={R} y={BOT + 22} textAnchor="end" className="gz5-lbl gz5-sm gz5-muted-t">
          výšky ≈ {Math.round(EXAG / 100) * 100}× zvětšené
        </text>
        <text x={L} y={H - 8} className="gz5-lbl gz5-sm gz5-muted-t gz5-sec">
          mimo řez: Pyreneje, Apeniny, Karpaty, Skandinávské pohoří
        </text>
      </Fade>
    </>
  );
}

export default function EuropeRelief() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={680} replay>
      <Plate />
    </Figure>
  );
}
