import { StepStrip } from "../../sequence/StepFigure";
import { Body, Figure, Frame, ell, f1, pat, useFig } from "./kit";

const LABEL =
  "Srovnání jednoděložných a dvouděložných rostlin v pěti znacích. Děložní lístky: jednoděložné mají v semeni jeden, dvouděložné dva. Žilnatina listu: u jednoděložných souběžná (rovnoběžné žilky v úzkém listu), u dvouděložných zpeřená a síťnatá. Květ: části po třech (například šest okvětních lístků) proti částem po čtyřech nebo pěti. Kořeny: svazčité kořeny bez hlavního kořene proti hlavnímu kořeni s postranními. Stonek v řezu: cévní svazky roztroušené proti svazkům uspořádaným do kruhu. Jednoděložné jsou třeba trávy, obilí, kukuřice a tulipán, dvouděložné fazole, růže, dub nebo slunečnice.";

const W = 172;
const ROW = 90;
const TOP = 6;
const H = TOP + 5 * ROW + 34;
const CX = W / 2;

function Row({ i, text, children }: { i: number; text: string; children: React.ReactNode }) {
  const y = TOP + i * ROW;
  return (
    <g>
      {i > 0 && <path d={`M10 ${y} H${W - 10}`} className="bz1-o bz1-thin bz1-dash" style={{ opacity: 0.4 }} />}
      <g transform={`translate(0 ${y})`}>{children}</g>
      <text x={CX} y={y + ROW - 8} textAnchor="middle" className="bz1-lbl bz1-sm bz1-b">
        {text}
      </text>
    </g>
  );
}

// ------------------------------------------------------------- monocot
function Mono() {
  const { id } = useFig();
  const bundles: [number, number][] = [];
  for (let k = 0; k < 16; k++) {
    const a = k * 2.4;
    const r = 22 * Math.sqrt((k + 0.5) / 16);
    bundles.push([CX + Math.cos(a) * r, 34 + Math.sin(a) * r]);
  }
  return (
    <Frame w={W} h={H}>
      <Row i={0} text="1 děložní lístek">
        <path d={`M${CX - 50} 50 H${CX + 50}`} className="bz1-o" />
        <Body d={ell(CX, 57, 13, 7)} fill="bz1-shell" />
        <Body d={`M${CX - 2} 52 C${CX - 6} 34 ${CX - 2} 16 ${CX + 6} 6 C${CX + 4} 20 ${CX + 4} 38 ${CX + 3} 52 Z`} fill="bz1-leaf" />
      </Row>
      <Row i={1} text="souběžná žilnatina">
        <Body d={`M${CX} 64 C${CX - 14} 46 ${CX - 12} 20 ${CX} 4 C${CX + 12} 20 ${CX + 14} 46 ${CX} 64 Z`} fill="bz1-leaf" />
        <path d={`M${CX} 62 V8 M${CX - 4} 60 C${CX - 9} 40 ${CX - 8} 22 ${CX - 2} 9 M${CX + 4} 60 C${CX + 9} 40 ${CX + 8} 22 ${CX + 2} 9 M${CX - 8} 54 C${CX - 12} 40 ${CX - 10} 28 ${CX - 6} 18 M${CX + 8} 54 C${CX + 12} 40 ${CX + 10} 28 ${CX + 6} 18`} className="bz1-o bz1-thin" />
      </Row>
      <Row i={2} text="části květu po 3">
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} 34)`}>
            <Body d={ell(CX, 19, 8.5, 15)} fill="bz1-petal" thin />
          </g>
        ))}
        {[60, 180, 300].map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} 34)`}>
            <Body d={ell(CX, 21, 6.5, 12)} fill="bz1-petal" thin />
          </g>
        ))}
        <circle cx={CX} cy={34} r={5} className="bz1-o bz1-pollen" />
      </Row>
      <Row i={3} text="svazčité kořeny">
        <path d={`M${CX - 40} 6 H${CX + 40} M${CX} 6 V0`} className="bz1-o" />
        <path
          d={[-26, -16, -8, 0, 8, 16, 26]
            .map((dx, k) => `M${CX + dx * 0.2} 7 C${CX + dx * 0.6} 26 ${CX + dx} 40 ${CX + dx * 1.2 + (k % 2 ? 3 : -3)} ${56 - Math.abs(dx) * 0.3}`)
            .join(" ")}
          className="bz1-o"
          style={{ strokeWidth: 1.3 }}
        />
      </Row>
      <Row i={4} text="svazky roztroušené">
        <circle cx={CX} cy={34} r={28} className="bz1-o bz1-stem" />
        <circle cx={CX} cy={34} r={28} fill={pat(id, "dots")} opacity={0.5} />
        {bundles.map(([x, y], k) => (
          <circle key={k} cx={f1(x)} cy={f1(y)} r={2.8} className="bz1-o bz1-thin bz1-vac" />
        ))}
      </Row>
      <text x={CX} y={H - 10} textAnchor="middle" className="bz1-lbl bz1-sm bz1-lvl-t">
        tráva, kukuřice, tulipán
      </text>
    </Frame>
  );
}

// ------------------------------------------------------------- dicot
function Di() {
  const { id } = useFig();
  const net: string[] = [];
  for (let k = 0; k < 4; k++) {
    const y = 52 - k * 11;
    const w = 18 - Math.abs(k - 1.5) * 3;
    net.push(`M${CX} ${y} L${f1(CX - w)} ${y - 8} M${CX} ${y} L${f1(CX + w)} ${y - 8}`);
    net.push(`M${f1(CX - w * 0.5)} ${y - 4} l-2 -8 M${f1(CX + w * 0.5)} ${y - 4} l2 -8`);
  }
  return (
    <Frame w={W} h={H}>
      <Row i={0} text="2 děložní lístky">
        <path d={`M${CX - 50} 50 H${CX + 50}`} className="bz1-o" />
        <path d={`M${CX} 50 V24`} className="bz1-o" style={{ strokeWidth: 2.4 }} />
        <Body d={`M${CX} 26 C${CX - 8} 10 ${CX - 30} 10 ${CX - 34} 22 C${CX - 28} 34 ${CX - 10} 34 ${CX} 26 Z`} fill="bz1-leaf2" />
        <Body d={`M${CX} 26 C${CX + 8} 10 ${CX + 30} 10 ${CX + 34} 22 C${CX + 28} 34 ${CX + 10} 34 ${CX} 26 Z`} fill="bz1-leaf2" />
      </Row>
      <Row i={1} text="zpeřená, síťnatá">
        <Body d={`M${CX} 64 C${CX - 30} 52 ${CX - 30} 16 ${CX} 4 C${CX + 30} 16 ${CX + 30} 52 ${CX} 64 Z`} fill="bz1-leaf" />
        <path d={`M${CX} 62 V8 ${net.join(" ")}`} className="bz1-o bz1-thin" />
      </Row>
      <Row i={2} text="části květu po 4 či 5">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a} ${CX} 34)`}>
            <Body d={`M${CX} 34 C${CX - 14} 23 ${CX - 12} 8 ${CX} 8 C${CX + 12} 8 ${CX + 14} 23 ${CX} 34 Z`} fill="bz1-petal" thin />
          </g>
        ))}
        <circle cx={CX} cy={34} r={5} className="bz1-o bz1-pollen" />
      </Row>
      <Row i={3} text="hlavní kořen">
        <path d={`M${CX - 40} 6 H${CX + 40} M${CX} 6 V0`} className="bz1-o" />
        <path d={`M${CX} 7 C${CX - 2} 30 ${CX + 2} 46 ${CX} 62`} className="bz1-o" style={{ strokeWidth: 3.2 }} />
        <path
          d={`M${CX} 16 Q${CX - 12} 20 ${CX - 22} 30 M${CX} 22 Q${CX + 12} 26 ${CX + 22} 36 M${CX} 32 Q${CX - 10} 36 ${CX - 16} 46 M${CX} 40 Q${CX + 8} 44 ${CX + 14} 52`}
          className="bz1-o"
          style={{ strokeWidth: 1.2 }}
        />
      </Row>
      <Row i={4} text="svazky v kruhu">
        <circle cx={CX} cy={34} r={28} className="bz1-o bz1-stem" />
        <circle cx={CX} cy={34} r={28} fill={pat(id, "dots")} opacity={0.5} />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2;
          return (
            <ellipse
              key={k}
              cx={f1(CX + Math.cos(a) * 18)}
              cy={f1(34 + Math.sin(a) * 18)}
              rx={4.2}
              ry={2.8}
              transform={`rotate(${f1((a * 180) / Math.PI)} ${f1(CX + Math.cos(a) * 18)} ${f1(34 + Math.sin(a) * 18)})`}
              className="bz1-o bz1-thin bz1-vac"
            />
          );
        })}
      </Row>
      <text x={CX} y={H - 10} textAnchor="middle" className="bz1-lbl bz1-sm bz1-lvl-t">
        fazole, růže, dub
      </text>
    </Frame>
  );
}

export default function MonocotDicot() {
  return (
    <Figure level={3} label={LABEL} max={460} interactive>
      <div className="bz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={150}
          phoneColumns={2}
          steps={[
            { title: "Jednoděložné", art: <Mono /> },
            { title: "Dvouděložné", art: <Di /> },
          ]}
        />
      </div>
    </Figure>
  );
}
