import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, Legend, StripBox, f1 } from "./kit";

const LABEL =
  "Tři klasické modely vnitřní struktury města. Burgessův model soustředných zón: kolem centrální obchodní čtvrti leží přechodná zóna, pak zóna dělnického bydlení, bydlení středních vrstev a na okraji bohatší zóna dojíždějících. Hoytův sektorový model: čtvrti rostou v klínech podél dopravních tras, průmysl podél železnice, bohaté bydlení na opačné straně. Model mnoha jader (Harris–Ullman): velké město má několik jader – centrum, průmyslové zóny, vedlejší obchodní centra a předměstí.";

const W = 220;
const H = 220;
const CX = 110;
const CY = 110;

/** fill class of each land-use category (numbers as in the classic Harris–Ullman legend) */
const FILL: Record<number, string> = {
  1: "gz7-lvl-strong",
  2: "gz7-gray-fill",
  3: "gz7-acc-fill",
  4: "gz7-yel-fill",
  5: "gz7-good-fill",
  6: "gz7-ink-fill",
  7: "gz7-lvl-fill",
  8: "gz7-grass",
  9: "gz7-teal-fill",
};

function N({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g className="gz7-zone-n">
      <circle cx={x} cy={y} r={9.5} />
      <text x={x} y={y + 5}>
        {n}
      </text>
    </g>
  );
}

function Burgess() {
  const rings: [number, number][] = [
    [104, 5],
    [82, 4],
    [60, 3],
    [38, 2],
    [17, 1],
  ];
  return (
    <Frame w={W} h={H} className="gz7-small">
      {rings.map(([r, n]) => (
        <circle key={n} cx={CX} cy={CY} r={r} className={`${FILL[n]} gz7-o`} />
      ))}
      {rings.map(([r, n], i) => {
        const inner = rings[i + 1]?.[0] ?? 0;
        const rr = n === 1 ? 0 : (r + inner) / 2;
        const a = (-35 * Math.PI) / 180;
        return <N key={n} x={CX + Math.cos(a) * rr} y={CY + Math.sin(a) * rr} n={n} />;
      })}
    </Frame>
  );
}

function Hoyt() {
  // sectors: [from°, to°, category] (0° = east, clockwise)
  const S: [number, number, number][] = [
    [-18, 18, 2],
    [18, 70, 3],
    [-62, -18, 3],
    [70, 150, 4],
    [-140, -62, 4],
    [150, 220, 5],
  ];
  const R = 104;
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return `${f1(CX + Math.cos(a) * r)} ${f1(CY + Math.sin(a) * r)}`;
  };
  const mid = (a: number, b: number, r: number) => pt((a + b) / 2, r).split(" ").map(Number);
  return (
    <Frame w={W} h={H} className="gz7-small">
      {S.map(([a, b, n], i) => (
        <path
          key={i}
          d={`M${CX} ${CY} L${pt(a, R)} A${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${pt(b, R)} Z`}
          className={`${FILL[n]} gz7-o`}
        />
      ))}
      {/* railway along the industrial sector */}
      <path d={`M${CX + 16} ${CY} H${CX + R + 6}`} className="gz7-rail" />
      <path d={`M${CX + 16} ${CY} H${CX + R + 6}`} className="gz7-rail-ties" />
      <circle cx={CX} cy={CY} r={17} className={`${FILL[1]} gz7-o`} />
      <N x={CX} y={CY} n={1} />
      {S.map(([a, b, n], i) => {
        const [x, y] = mid(a, b, n === 2 ? 70 : 66);
        return <N key={i} x={x} y={n === 2 ? y - 14 : y} n={n} />;
      })}
    </Frame>
  );
}

/** Harris–Ullman: a 5 × 5 grid of land-use cells */
const HU = [
  [8, 5, 5, 4, 4],
  [5, 5, 3, 2, 3],
  [4, 3, 1, 2, 3],
  [4, 7, 3, 3, 6],
  [4, 4, 4, 6, 9],
];
const HU_LABEL: [number, number][] = [
  [0, 0],
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 2],
  [3, 1],
  [3, 4],
  [4, 4],
];

function HarrisUllman() {
  const c = 40;
  const x0 = 10;
  const y0 = 10;
  let edges = "";
  for (let r = 0; r < 5; r++)
    for (let k = 0; k < 5; k++) {
      const v = HU[r][k];
      const x = x0 + k * c;
      const y = y0 + r * c;
      if (r === 0 || HU[r - 1][k] !== v) edges += `M${x} ${y} h${c}`;
      if (k === 0 || HU[r][k - 1] !== v) edges += `M${x} ${y} v${c}`;
      if (r === 4) edges += `M${x} ${y + c} h${c}`;
      if (k === 4) edges += `M${x + c} ${y} v${c}`;
    }
  return (
    <Frame w={W} h={H} className="gz7-small">
      {HU.map((row, r) =>
        row.map((v, k) => (
          <rect
            key={`${r}-${k}`}
            x={x0 + k * c - 0.3}
            y={y0 + r * c - 0.3}
            width={c + 0.6}
            height={c + 0.6}
            className={FILL[v]}
          />
        )),
      )}
      <path d={edges} className="gz7-o" />
      {HU_LABEL.map(([r, k]) => (
        <N key={`${r}-${k}`} x={x0 + k * c + c / 2} y={y0 + r * c + c / 2} n={HU[r][k]} />
      ))}
    </Frame>
  );
}

export default function UrbanModels() {
  return (
    <Figure level={11} label={LABEL} max={760} interactive boost={false}>
      <StripBox
        label={LABEL}
        legend={
          <Legend
            items={[
              { n: 1, fill: FILL[1], text: "centrální obchodní čtvrť (CBD)" },
              { n: 2, fill: FILL[2], text: "lehký průmysl a velkoobchod (u Burgesse přechodná zóna)" },
              { n: 3, fill: FILL[3], text: "bydlení nižších vrstev (dělnické čtvrti)" },
              { n: 4, fill: FILL[4], text: "bydlení středních vrstev" },
              { n: 5, fill: FILL[5], text: "bydlení vyšších vrstev (u Burgesse zóna dojíždějících)" },
              { n: 6, fill: FILL[6], text: "těžký průmysl" },
              { n: 7, fill: FILL[7], text: "vedlejší obchodní centrum" },
              { n: 8, fill: FILL[8], text: "rezidenční předměstí" },
              { n: 9, fill: FILL[9], text: "průmyslové předměstí" },
            ]}
          />
        }
      >
        <StepStrip
          min={190}
          steps={[
            {
              title: "Burgessův model soustředných zón (1925)",
              art: <Burgess />,
              caption:
                "Město roste ze středu v kruzích, čím dál od centra, tím bohatší bydlení. Vystihuje Chicago 20. let, ale nepočítá s dopravními tahy, terénem ani s více centry.",
            },
            {
              title: "Hoytův sektorový model (1939)",
              art: <Hoyt />,
              caption:
                "Čtvrti rostou v klínech podél dopravních tras: průmysl podél železnice, chudší bydlení vedle něj, bohatí na opačné straně. Pořád ale počítá s jediným centrem.",
            },
            {
              title: "Model mnoha jader (Harris–Ullman, 1945)",
              art: <HarrisUllman />,
              caption:
                "Velké město má několik jader: centrum, průmyslové zóny, obchodní centra na předměstí. Sedí na dnešní metropole propojené auty, ale popisuje, nevysvětluje.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
