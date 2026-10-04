import { Draw, DrawArrow, Fade, Figure, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Model všeobecné cirkulace atmosféry se třemi buňkami na každé polokouli. U rovníku se vzduch ohřívá a stoupá: vzniká rovníková tlaková níže, intertropická zóna konvergence (ITCZ), s bouřkami a dešti. Ve výšce proudí k pólům a kolem 30° zeměpisné šířky klesá: subtropická tlaková výše, kde leží velké pouště. Od ní vanou při zemi zpět k rovníku pasáty, stočené otáčením Země – na severní polokouli od severovýchodu, na jižní od jihovýchodu. To je Hadleyova buňka. Mezi 30° a 60° je Ferrelova buňka a při zemi vanou západní větry k subpolární tlakové níži kolem 60°, kde se vzduch zvedá. Nad póly studený vzduch klesá (polární tlaková výše) a odtud vanou polární východní větry; to je polární buňka.";

const W = 534;
const H = 548;
const CX = 258;
const CY = 282;
const R = 200;
const RI = R + 8;
const RO = R + 48;

const rad = (deg: number) => (deg * Math.PI) / 180;
const yLat = (lat: number) => CY - R * Math.sin(rad(lat));
const half = (lat: number) => R * Math.cos(rad(lat));
/** point on the right limb at latitude `lat`, radius `rr` */
const limb = (lat: number, rr: number): [number, number] => [
  CX + rr * Math.cos(rad(lat)),
  CY - rr * Math.sin(rad(lat)),
];
const P = (p: [number, number]) => `${f1(p[0])} ${f1(p[1])}`;

/** closed loop hugging the right limb between latitudes a < b */
function loop(a: number, b: number) {
  const cap = (RO - RI) / 2;
  return `M${P(limb(a, RI))} A${RI} ${RI} 0 0 0 ${P(limb(b, RI))} A${cap} ${cap} 0 0 1 ${P(limb(b, RO))} A${RO} ${RO} 0 0 1 ${P(limb(a, RO))} A${cap} ${cap} 0 0 1 ${P(limb(a, RI))} Z`;
}
/** arrow head at latitude `lat` on radius `rr`, pointing towards higher latitudes (`up`) or lower */
function head(lat: number, rr: number, up: boolean) {
  const [x, y] = limb(lat, rr);
  const t = up
    ? [-Math.sin(rad(lat)), -Math.cos(rad(lat))]
    : [Math.sin(rad(lat)), Math.cos(rad(lat))];
  const ang = (Math.atan2(t[1], t[0]) * 180) / Math.PI;
  return (
    <path
      d="M-6 -5 L6 0 L-6 5 L-3 0Z"
      className="gz3-cell-h"
      transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})`}
    />
  );
}

// surface flow: true = towards the pole along the ground
const CELLS = [
  { a: 0, b: 30, name: "Hadleyova", poleward: false },
  { a: 30, b: 60, name: "Ferrelova", poleward: true },
  { a: 60, b: 90, name: "polární", poleward: false },
];

/** surface wind arrow centred at (x, y) with direction (dx, dy) */
function wind(x: number, y: number, dx: number, dy: number) {
  return `M${f1(x - dx / 2)} ${f1(y - dy / 2)} L${f1(x + dx / 2)} ${f1(y + dy / 2)}`;
}

function Plate() {
  const { id } = useFig();
  return (
    <>
      {/* globe */}
      <Fade>
        <circle cx={CX} cy={CY} r={R} className="gz3-sea" />
        {/* subtropical desert belts and the rainy equator */}
        {[1, -1].map((s) => (
          <path
            key={s}
            d={`M${f1(CX - half(20))} ${f1(yLat(20 * s))} H${f1(CX + half(20))} L${f1(CX + half(34))} ${f1(yLat(34 * s))} H${f1(CX - half(34))} Z`}
            className="gz3-sand"
            opacity={0.75}
          />
        ))}
        <rect x={CX - R} y={yLat(5)} width={2 * R} height={yLat(-5) - yLat(5)} className="gz3-rain-belt" />
        <circle cx={CX} cy={CY} r={R} fill={pat(id, "h")} opacity={0.35} />
        {[60, 30, -30, -60].map((lat) => (
          <path
            key={lat}
            d={`M${f1(CX - half(lat))} ${f1(yLat(lat))} H${f1(CX + half(lat))}`}
            className="gz3-o gz3-thin gz3-dash"
          />
        ))}
        <path d={`M${CX - R} ${CY} H${CX + R}`} className="gz3-o" />
        <circle cx={CX} cy={CY} r={R} className="gz3-o" />
      </Fade>

      {/* cells on the right limb; the southern ones are the mirror image */}
      {CELLS.map((c, i) => (
        <Pop key={c.name} delay={0.3 + i * 0.15}>
          <path d={loop(c.a + 2.5, c.b - 2.5)} className="gz3-cell" />
          {head((c.a + c.b) / 2, RI, c.poleward)}
          {head((c.a + c.b) / 2, RO, !c.poleward)}
          <g transform={`matrix(1 0 0 -1 0 ${2 * CY})`}>
            <path d={loop(c.a + 2.5, c.b - 2.5)} className="gz3-cell" />
            {head((c.a + c.b) / 2, RI, c.poleward)}
            {head((c.a + c.b) / 2, RO, !c.poleward)}
          </g>
          <path
            id={`${id}-cp${i}`}
            d={`M${P(limb(c.b - 1, R + 24))} A${R + 24} ${R + 24} 0 0 1 ${P(limb(c.a + 1, R + 24))}`}
            fill="none"
          />
          <text className="gz3-lbl gz3-sm gz3-b gz3-lvl-t">
            <textPath href={`#${id}-cp${i}`} startOffset="50%" textAnchor="middle">
              {c.name}
            </textPath>
          </text>
        </Pop>
      ))}

      {/* surface winds */}
      <Fade delay={0.8}>
        {[
          // trade winds (NE in the north, SE in the south)
          [CX - 112, yLat(15), -36, 14],
          [CX + 104, yLat(15), -36, 14],
          [CX - 112, yLat(-15), -36, -14],
          [CX + 104, yLat(-15), -36, -14],
          // westerlies
          [CX - 96, yLat(45), 36, -14],
          [CX + 92, yLat(45), 36, -14],
          [CX - 96, yLat(-45), 36, 14],
          [CX + 92, yLat(-45), 36, 14],
          // polar easterlies
          [CX + 22, yLat(75), -28, 8],
          [CX + 22, yLat(-75), -28, -8],
        ].map(([x, y, dx, dy], k) => (
          <DrawArrow key={k} d={wind(x, y, dx, dy)} tone="lvl" className="gz3-wind" delay={0.8 + (k % 4) * 0.05} />
        ))}
      </Fade>
      <Draw d={`M${CX - R} ${CY} H${CX + R}`} className="gz3-o" delay={0} />

      {/* labels */}
      <Fade delay={1.2}>
        <text x={CX} y={yLat(15) + 5} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          pasáty
        </text>
        <text x={CX} y={yLat(-15) + 5} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          pasáty
        </text>
        <text x={CX} y={yLat(45) + 5} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          západní větry
        </text>
        <text x={CX} y={yLat(-45) + 5} textAnchor="middle" className="gz3-lbl gz3-b gz3-halo">
          západní větry
        </text>
        <Lbl x={CX - 60} y={CY + R + 30} anchor="end" tx={CX + 10} ty={yLat(-75) - 2} className="gz3-sm gz3-b">
          polární východní větry
        </Lbl>

        <text x={CX - R + 14} y={CY - 6} className="gz3-lbl gz3-b gz3-red-t gz3-halo">
          ITCZ · rovníková níže
        </text>
        <text x={f1(CX - half(30) + 14)} y={f1(yLat(30) - 6)} className="gz3-lbl gz3-sm gz3-b gz3-blue-t gz3-halo">
          subtropická výše · pouště
        </text>
        <text x={f1(CX - half(-30) + 14)} y={f1(yLat(-30) + 16)} className="gz3-lbl gz3-sm gz3-b gz3-blue-t gz3-halo">
          subtropická výše · pouště
        </text>
        <text x={f1(CX - half(60) + 12)} y={f1(yLat(60) + 17)} className="gz3-lbl gz3-sm gz3-b gz3-red-t gz3-halo">
          subpolární níže
        </text>
        <text x={CX - 20} y={CY - R - 10} textAnchor="end" className="gz3-lbl gz3-sm gz3-b gz3-blue-t">
          polární výše
        </text>
        {[0, 30, 60, -30, -60].map((lat) => {
          const hi = Math.abs(lat) === 30 || Math.abs(lat) === 90;
          const [x, y] = Math.abs(lat) === 90 ? [CX, lat > 0 ? CY - R + 16 : CY + R - 6] : [CX + half(lat) - 16, yLat(lat) + (lat >= 0 ? -5 : 15)];
          return (
            <text key={lat} x={f1(x)} y={f1(y)} textAnchor="middle" className={`gz3-pres-s gz3-halo ${hi ? "gz3-pres-h" : "gz3-pres-n"}`}>
              {hi ? "H" : "N"}
            </text>
          );
        })}
        {[60, 30, 0, -30, -60].map((lat) => (
          <text key={lat} x={f1(CX - half(lat) - 6)} y={f1(yLat(lat) + 4)} textAnchor="end" className="gz3-num">
            {lat === 0 ? "0°" : `${Math.abs(lat)}° ${lat > 0 ? "s" : "j"}. š.`}
          </text>
        ))}
      </Fade>
    </>
  );
}

export default function GlobalCirculation() {
  return (
    <Figure label={LABEL} w={W} h={H} max={620} replay>
      <Plate />
    </Figure>
  );
}
