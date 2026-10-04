import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, f1, pat, useFig, type P2 } from "./kit";
import { T } from "./land";

const LABEL =
  "Pohyb kontinentů za posledních 250 milionů let, animace po krocích. 1. Před 250 miliony let tvořily všechny pevniny jeden prakontinent Pangeu, obklopený oceánem Panthalassa. 2. Před 180 miliony let se Pangea rozdělila na severní Laurasii a jižní Gondwanu, mezi nimi byl oceán Tethys. 3. Před 66 miliony let se otevíral Atlantský oceán, Indie plula k severu a Austrálie byla ještě spojená s Antarktidou. 4. Dnes: Indie narazila do Asie a vyvrásnila Himálaj, Atlantik se dál rozšiřuje asi o 2 až 5 cm za rok. 5. Důkazy Alfreda Wegenera: pobřeží Jižní Ameriky a Afriky do sebe zapadají jako skládačka a stejné fosilie, například sladkovodního plaza mesosaura v Jižní Americe a Africe nebo plaza lystrosaura v Africe, Indii a Antarktidě, najdeme na kontinentech, které dnes dělí oceán.";

const W = 440;
const H = 262;
const K = 1.2;
const MY = 8;
const MH = 160 * K;
const X = (lon: number) => 4 + (lon + 180) * K;
const Y = (lat: number) => MY + (80 - lat) * K;

type Part = { pts: P2[]; group: string };

// coarse outlines (lon, lat), a schoolroom wall map
const NAM: P2[] = [[-166, 66], [-160, 71], [-140, 70], [-115, 69], [-95, 72], [-85, 69], [-80, 63], [-93, 59], [-82, 52], [-78, 58], [-66, 60], [-56, 52], [-66, 45], [-70, 42], [-76, 37], [-81, 31], [-80, 26], [-84, 30], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-88, 16], [-83, 15], [-83, 10], [-78, 8], [-86, 12], [-92, 15], [-105, 20], [-112, 29], [-110, 23], [-117, 32], [-124, 40], [-124, 48], [-133, 56], [-146, 60], [-158, 57], [-164, 60]];
const GRL: P2[] = [[-55, 60], [-43, 60], [-35, 66], [-22, 70], [-20, 79], [-35, 82], [-60, 80], [-70, 77], [-58, 75], [-52, 68]];
const SAM: P2[] = [[-78, 8], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -14], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -50], [-69, -55], [-74, -52], [-73, -42], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, 0]];
const AFR: P2[] = [[-17, 21], [-13, 28], [-9, 33], [-5, 36], [10, 37], [11, 33], [20, 31], [25, 32], [32, 31], [34, 28], [39, 21], [43, 12], [51, 12], [51, 4], [40, -3], [40, -11], [35, -20], [33, -26], [27, -34], [20, -35], [18, -32], [12, -18], [13, -8], [9, -1], [9, 4], [4, 6], [-5, 5], [-8, 4], [-13, 8], [-17, 14]];
const MAD: P2[] = [[44, -25], [47, -25], [50, -15], [49, -12], [44, -16]];
const EUR: P2[] = [[-9, 37], [-9, 43], [-1, 46], [-4, 48], [2, 51], [8, 54], [9, 57], [12, 56], [18, 55], [24, 60], [22, 65], [18, 63], [11, 59], [5, 62], [14, 68], [28, 71], [40, 67], [55, 69], [68, 73], [80, 73], [100, 76], [130, 72], [160, 70], [180, 68], [180, 64], [170, 60], [163, 58], [156, 51], [142, 59], [136, 54], [140, 48], [130, 42], [126, 35], [121, 40], [118, 38], [122, 31], [117, 23], [108, 21], [106, 18], [109, 12], [105, 9], [100, 13], [103, 2], [98, 8], [98, 16], [94, 17], [92, 22], [92, 25], [88, 27], [80, 30], [74, 34], [70, 30], [67, 25], [62, 25], [58, 24], [60, 22], [55, 17], [45, 13], [43, 13], [39, 21], [35, 28], [34, 31], [36, 35], [27, 37], [26, 40], [23, 40], [19, 40], [13, 45], [18, 40], [16, 38], [10, 44], [3, 43], [-1, 37], [-6, 36]];
const IND: P2[] = [[67, 25], [70, 30], [74, 34], [80, 30], [88, 27], [92, 25], [92, 22], [89, 22], [87, 21], [80, 15], [80, 10], [77, 8], [73, 16], [73, 21], [68, 23]];
const AUS: P2[] = [[114, -22], [114, -34], [118, -35], [124, -34], [131, -31], [138, -35], [140, -38], [147, -38], [150, -37], [153, -30], [153, -25], [146, -19], [142, -11], [136, -12], [136, -15], [130, -12], [125, -15], [122, -18]];
const ANT_TODAY: P2[] = [[-180, -80], [-180, -74], [-150, -76], [-120, -73], [-90, -72], [-70, -68], [-58, -63], [-62, -70], [-40, -77], [-20, -73], [0, -70], [30, -69], [60, -67], [90, -66], [120, -66], [150, -68], [165, -71], [180, -74], [180, -80]];
/** Antarctica as one block (the frame cannot show it from above) */
const antBlob = (lon: number, lat: number, w: number): P2[] => [
  [lon - w, lat - 4], [lon - w * 0.8, lat + 4], [lon - w * 0.35, lat + 7], [lon, lat + 8], [lon + w * 0.4, lat + 6], [lon + w * 0.85, lat + 3], [lon + w, lat - 4], [lon + w * 0.7, lat - 9], [lon, lat - 10], [lon - w * 0.6, lat - 9],
];

const PARTS: Part[] = [
  { pts: NAM, group: "nam" },
  { pts: GRL, group: "nam" },
  { pts: SAM, group: "sam" },
  { pts: AFR, group: "afr" },
  { pts: MAD, group: "afr" },
  { pts: EUR, group: "eur" },
  { pts: IND, group: "ind" },
  { pts: AUS, group: "aus" },
];

const centre = (pts: P2[]): P2 => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];
const PIVOT: Record<string, P2> = {
  nam: centre(NAM),
  sam: centre(SAM),
  afr: centre(AFR),
  eur: centre(EUR),
  ind: centre(IND),
  aus: centre(AUS),
};
/** shift (lon, lat) and clockwise turn (deg) of each plate group, relative to today */
type Move = Record<string, [number, number, number]>;
const PANGEA: Move = {
  afr: [0, -10, 0],
  sam: [56.1, -9.7, -28.7],
  nam: [61.2, -35.3, -33],
  eur: [0, -10, 0],
  ind: [-17.6, -46.3, 30.9],
  aus: [-35.4, -25.4, -5],
};
const STAGES: { m: Move; f: Record<string, number>; ant: P2[]; age: string; era: string }[] = [
  { m: PANGEA, f: {}, ant: antBlob(44, -62, 38), age: "před 250 mil. let", era: "konec prvohor (perm)" },
  {
    m: { ...PANGEA, nam: [59, -27, -33], eur: [0, -3, 0] },
    f: { afr: 0.1, sam: 0.06, ind: 0.12, aus: 0.1 },
    ant: antBlob(46, -64, 38),
    age: "před 180 mil. let",
    era: "druhohory (jura)",
  },
  {
    m: PANGEA,
    f: { afr: 0.65, sam: 0.55, nam: 0.6, eur: 0.7, ind: 0.42, aus: 0.15 },
    ant: antBlob(60, -72, 52),
    age: "před 66 mil. let",
    era: "konec druhohor: vymírání dinosaurů",
  },
  { m: PANGEA, f: { afr: 1, sam: 1, nam: 1, eur: 1, ind: 1, aus: 1 }, ant: ANT_TODAY, age: "dnes", era: "čtvrtohory" },
];

function place(pts: P2[], g: string, m: Move, f: number): P2[] {
  const [dl, db, rot] = m[g];
  const k = 1 - f;
  const [cx, cy] = PIVOT[g];
  const a = (-rot * k * Math.PI) / 180; // lat grows upwards: clockwise on screen = negative here
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([lo, la]) => {
    const x = lo - cx;
    const y = la - cy;
    return [cx + x * c - y * s + dl * k, cy + x * s + y * c + db * k] as P2;
  });
}
const path = (pts: P2[]) => "M" + pts.map(([lo, la]) => `${f1(X(lo))} ${f1(Y(la))}`).join(" L") + "Z";

function MapBase() {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={MY} width={360 * K} height={MH} rx={4} className="gz2-sea" />
      <rect x={4} y={MY} width={360 * K} height={MH} fill={pat(id, "h")} opacity={0.3} />
      <path d={`M4 ${Y(0)} H${4 + 360 * K}`} className="gz2-o gz2-thin gz2-dash" style={{ opacity: 0.6 }} />
      <text x={8} y={Y(0) - 4} className="gz2-lbl gz2-sm gz2-muted-t gz2-sec">
        rovník
      </text>
    </g>
  );
}

function Lands({ n, ghostNorth = false }: { n: number; ghostNorth?: boolean }) {
  const { id } = useFig();
  const st = STAGES[n];
  const shapes = [
    ...PARTS.map((p) => ({ d: path(place(p.pts, p.group, st.m, st.f[p.group] ?? 0)), g: p.group })),
    { d: path(st.ant), g: "ant" },
  ];
  return (
    <g>
      {shapes.map((s, i) => {
        const ghost = ghostNorth && (s.g === "nam" || s.g === "eur");
        return (
          <g key={i} style={{ opacity: ghost ? 0.35 : 1 }}>
            <path d={s.d} className={s.g === "ant" ? "gz2-ice" : "gz2-land"} />
            {s.g !== "ant" && <path d={s.d} fill={pat(id, "dots")} opacity={0.5} />}
            <path d={s.d} className="gz2-o gz2-thin" />
          </g>
        );
      })}
    </g>
  );
}

function Foot({ n }: { n: number }) {
  const st = STAGES[n];
  return (
    <g>
      <text x={8} y={MY + MH + 30} className="gz2-lbl gz2-b gz2-big gz2-lvl-t">
        {st.age}
      </text>
      <text x={W - 8} y={MY + MH + 30} textAnchor="end" className="gz2-lbl gz2-sm">
        {st.era}
      </text>
    </g>
  );
}

const ll = (lon: number, lat: number) => [X(lon), Y(lat)] as const;

function Stage({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <Frame w={W} h={H}>
      <MapBase />
      <Lands n={n} />
      <Foot n={n} />
      <Fade delay={0.3}>{children}</Fade>
    </Frame>
  );
}

function Evidence() {
  return (
    <Frame w={W} h={H}>
      <EvidenceArt />
    </Frame>
  );
}

function EvidenceArt() {
  const { id } = useFig();
  const st = STAGES[0];
  const P = (g: string, pts: P2[]) => path(place(pts, g, st.m, 0));
  // fossil finds (lon, lat in today's coordinates of each continent)
  const meso: [string, P2[]][] = [
    ["sam", [[-52, -18], [-40, -18], [-44, -28], [-52, -34], [-58, -32]]],
    ["afr", [[12, -16], [22, -16], [24, -30], [17, -32], [13, -24]]],
  ];
  const lystro: [string, P2[]][] = [
    ["afr", [[24, -20], [34, -20], [31, -30], [25, -32]]],
    ["ind", [[74, 22], [86, 23], [84, 14], [76, 12]]],
  ];
  return (
    <>
      <MapBase />
      <Lands n={0} ghostNorth />
      {meso.map(([g, pts], i) => (
        <g key={`m${i}`}>
          <path d={P(g, pts)} className="gz2-fos-a" />
          <path d={P(g, pts)} fill={pat(id, "d")} />
        </g>
      ))}
      {lystro.map(([g, pts], i) => (
        <g key={`l${i}`}>
          <path d={P(g, pts)} className="gz2-fos-b" />
          <path d={P(g, pts)} fill={pat(id, "b")} />
        </g>
      ))}
      <path d={path(antBlob(26, -64, 18))} className="gz2-fos-b" />
      {/* the matching coasts */}
      <Pop delay={0.2}>
        <path
          d={"M" + place([[-35, -5], [-35, -9], [-39, -14], [-41, -22], [-48, -26], [-53, -34]], "sam", st.m, 0).map(([a, b]) => `${f1(X(a))} ${f1(Y(b))}`).join(" L")}
          className="gz2-fit"
        />
      </Pop>
      <g>
        <rect x={8} y={MY + MH + 14} width={22} height={12} className="gz2-fos-a gz2-o gz2-thin" />
        <text x={36} y={MY + MH + 25} className="gz2-lbl gz2-sm">
          mesosaurus
        </text>
        <rect x={136} y={MY + MH + 14} width={22} height={12} className="gz2-fos-b gz2-o gz2-thin" />
        <text x={164} y={MY + MH + 25} className="gz2-lbl gz2-sm">
          lystrosaurus
        </text>
        <path d={`M262 ${MY + MH + 20} h22`} className="gz2-fit" />
        <text x={290} y={MY + MH + 25} className="gz2-lbl gz2-sm">
          pobřeží do sebe zapadají
        </text>
        <text x={8} y={MY + MH + 50} className="gz2-lbl gz2-sm gz2-muted-t">
          Wegener 1912: stejné fosilie na dnes vzdálených kontinentech
        </text>
      </g>
    </>
  );
}

const [a1, b1] = ll(-120, 12);
/** where India sits 66 million years ago */
const [ix, iy] = centre(place(IND, "ind", STAGES[2].m, STAGES[2].f.ind));
const STEPS = [
  {
    title: "Pangea",
    caption: "Všechny pevniny tvoří jeden prakontinent Pangeu; kolem je jediný oceán Panthalassa.",
    art: (
      <Stage n={0}>
        <T x={X(10)} y={Y(18)} cls="gz2-b">Pangea</T>
        <T x={a1} y={b1} cls="gz2-blue-t">Panthalassa</T>
        <T x={X(96)} y={Y(8)} cls="gz2-sm gz2-blue-t">Tethys</T>
      </Stage>
    ),
  },
  {
    title: "Laurasie a Gondwana",
    caption: "Pangea se trhá na severní Laurasii a jižní Gondwanu; mezi nimi se rozlévá oceán Tethys.",
    art: (
      <Stage n={1}>
        <T x={X(40)} y={Y(52)} cls="gz2-b">Laurasie</T>
        <T x={X(14)} y={Y(-30)} cls="gz2-b">Gondwana</T>
        <T x={X(100)} y={Y(14)} cls="gz2-sm gz2-blue-t">Tethys</T>
      </Stage>
    ),
  },
  {
    title: "Otevírá se Atlantik",
    caption: "Amerika se vzdaluje od Evropy a Afriky, Indie pluje na sever, Austrálie se drží Antarktidy.",
    art: (
      <Stage n={2}>
        <T x={X(-30)} y={Y(20)} cls="gz2-sm gz2-blue-t">Atlantik</T>
        <T x={X(ix) - 14} y={Y(iy) + 4} a="end" cls="gz2-sm gz2-b">Indie</T>
        <Arrow d={`M${X(ix + 2)} ${Y(iy + 12)} L${X(ix + 6)} ${Y(iy + 26)}`} tone="lvl" />
      </Stage>
    ),
  },
  {
    title: "Dnes",
    caption: "Indie narazila do Asie a vyvrásnila Himálaj; Atlantik se dál rozšiřuje o 2–5 cm za rok.",
    art: (
      <Stage n={3}>
        <T x={X(-40)} y={Y(32)} cls="gz2-sm gz2-blue-t">Atlantik</T>
        <T x={X(86)} y={Y(40)} cls="gz2-sm gz2-b">Himálaj</T>
        <Arrow d={`M${X(-42)} ${Y(14)} H${X(-54)}`} tone="lvl" />
        <Arrow d={`M${X(-34)} ${Y(14)} H${X(-22)}`} tone="lvl" />
      </Stage>
    ),
  },
  {
    title: "Wegenerovy důkazy",
    caption: "Pobřeží Jižní Ameriky a Afriky do sebe zapadají a na obou najdeme stejné fosilie, třeba sladkovodního plaza mesosaura.",
    art: <Evidence />,
  },
];

export default function ContinentalDrift() {
  return (
    <Figure level={3} label={LABEL} max={680} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
