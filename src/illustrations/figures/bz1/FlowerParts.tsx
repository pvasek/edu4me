import { Body, DrawArrow, Fade, Figure, Lbl, Pop, ell, pat, useFig } from "./kit";

const LABEL =
  "Květ v podélném řezu. Na stonku květní lůžko, z něj vyrůstají zelené kališní lístky a barevné korunní lístky. Uprostřed pestík: nahoře lepkavá blizna, pod ní čnělka a dole semeník s vajíčky. Kolem pestíku tyčinky: tenká nitka nese prašník plný pylu. Včela přenáší pyl z jiného květu na bliznu, to je opylení hmyzem; po oplození vajíček z nich vzniknou semena a ze semeníku plod.";

const W = 450;
const H = 394;
const CX = 226;
const RY = 312; // receptacle

const PETAL = `M${CX - 14} ${RY - 6} C${CX - 60} ${RY - 18} ${CX - 104} ${RY - 70} ${CX - 112} ${RY - 150} C${CX - 82} ${RY - 150} ${CX - 44} ${RY - 110} ${CX - 22} ${RY - 52} Z`;
const SEPAL = `M${CX - 12} ${RY + 2} C${CX - 40} ${RY + 2} ${CX - 64} ${RY - 10} ${CX - 74} ${RY - 30} C${CX - 54} ${RY - 30} ${CX - 30} ${RY - 18} ${CX - 14} ${RY - 8} Z`;

function Stamen({ x, y, side }: { x: number; y: number; side: 1 | -1 }) {
  const { id } = useFig();
  return (
    <g>
      <path d={`M${CX + side * 16} ${RY - 8} C${CX + side * 24} ${RY - 60} ${x - side * 4} ${y + 60} ${x} ${y + 12}`} className="bz1-o" style={{ strokeWidth: 1.6 }} />
      <Body d={ell(x, y, 6, 13)} fill="bz1-pollen" />
      <path d={ell(x, y, 6, 13)} fill={pat(id, "dots")} />
      <path d={`M${x} ${y - 12} V${y + 12}`} className="bz1-o bz1-thin" />
    </g>
  );
}

function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(18)`}>
      <ellipse cx={-6} cy={-14} rx={12} ry={7} transform="rotate(-25 -6 -14)" className="bz1-o bz1-thin bz1-glass" />
      <ellipse cx={6} cy={-14} rx={11} ry={6} transform="rotate(20 6 -14)" className="bz1-o bz1-thin bz1-glass" />
      <ellipse cx={0} cy={0} rx={18} ry={10} className="bz1-o bz1-pollen" />
      <path d="M-8 -9 V9 M0 -10 V10 M8 -9 V9" className="bz1-o" style={{ strokeWidth: 3.2 }} />
      <circle cx={21} cy={-1} r={7} className="bz1-o" style={{ fill: "var(--ink)" }} />
      <path d="M25 -6 Q30 -14 34 -14 M23 -7 Q26 -16 30 -18" className="bz1-o bz1-thin" />
      <path d="M-18 0 L-24 1" className="bz1-o" />
      {[
        [-4, 14],
        [3, 15],
        [-10, 12],
      ].map(([px, py]) => (
        <circle key={px} cx={px} cy={py} r={2.4} className="bz1-o bz1-thin bz1-pollen" />
      ))}
    </g>
  );
}

function Flower() {
  return (
    <g>
      {/* stem + receptacle */}
      <Body d={`M${CX - 6} ${H - 14} V${RY + 6} H${CX + 6} V${H - 14} Z`} fill="bz1-stem" />
      <Body d={SEPAL} fill="bz1-leaf" />
      <g transform={`translate(${2 * CX} 0) scale(-1 1)`}>
        <Body d={SEPAL} fill="bz1-leaf" />
      </g>
      <Body d={PETAL} fill="bz1-petal" hatch="b" hatchOpacity={0.5} />
      <g transform={`translate(${2 * CX} 0) scale(-1 1)`}>
        <Body d={PETAL} fill="bz1-petal" hatch="b" hatchOpacity={0.5} />
      </g>
      <Body d={`M${CX - 22} ${RY - 4} Q${CX} ${RY + 14} ${CX + 22} ${RY - 4} Q${CX} ${RY - 10} ${CX - 22} ${RY - 4} Z`} fill="bz1-stem" />
      <Stamen x={CX - 42} y={RY - 128} side={-1} />
      <Stamen x={CX + 42} y={RY - 128} side={1} />
      <Stamen x={CX - 26} y={RY - 112} side={-1} />
      <Stamen x={CX + 26} y={RY - 112} side={1} />
      {/* pistil: ovary, style, stigma */}
      <path d={`M${CX - 4} ${RY - 52} C${CX - 4} ${RY - 100} ${CX - 3} ${RY - 130} ${CX - 3} ${RY - 152} H${CX + 3} C${CX + 3} ${RY - 130} ${CX + 4} ${RY - 100} ${CX + 4} ${RY - 52} Z`} className="bz1-o bz1-leaf2" />
      <Body d={`M${CX} ${RY - 56} C${CX - 26} ${RY - 50} ${CX - 26} ${RY - 4} ${CX} ${RY - 4} C${CX + 26} ${RY - 4} ${CX + 26} ${RY - 50} ${CX} ${RY - 56} Z`} fill="bz1-leaf2" />
      <path d={`M${CX} ${RY - 48} V${RY - 10}`} className="bz1-o bz1-thin" />
      {[RY - 42, RY - 32, RY - 22, RY - 13].map((y, i) => (
        <g key={y}>
          <ellipse cx={CX - 8} cy={y} rx={5} ry={3.6} className="bz1-o bz1-thin bz1-fill" />
          <ellipse cx={CX + 8} cy={y + (i % 2 ? 2 : 0)} rx={5} ry={3.6} className="bz1-o bz1-thin bz1-fill" />
        </g>
      ))}
      <Body d={`M${CX - 12} ${RY - 152} C${CX - 14} ${RY - 166} ${CX - 2} ${RY - 166} ${CX} ${RY - 158} C${CX + 2} ${RY - 166} ${CX + 14} ${RY - 166} ${CX + 12} ${RY - 152} Z`} fill="bz1-lvl-fill" />
      <path d={`M${CX - 12} ${RY - 152} H${CX + 12}`} className="bz1-o bz1-thin" />
      {[-6, 2, 8].map((dx) => (
        <circle key={dx} cx={CX + dx} cy={RY - 164} r={2.4} className="bz1-o bz1-thin bz1-pollen" />
      ))}
    </g>
  );
}

export default function FlowerParts() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={600} replay>
      <Fade>
        <Flower />
      </Fade>
      <Fade delay={0.5}>
        <Lbl x={106} y={150} tx={CX - 46} ty={RY - 132} anchor="end" className="bz1-b">
          prašník
        </Lbl>
        <Lbl x={106} y={196} tx={CX - 30} ty={RY - 92} anchor="end">
          nitka
        </Lbl>
        <text x={14} y={122} className="bz1-lbl bz1-sm bz1-muted-t">
          tyčinka:
        </text>
        <Lbl x={92} y={256} tx={CX - 84} ty={RY - 86} anchor="end" className="bz1-b">
          {"korunní\nlístek"}
        </Lbl>
        <Lbl x={92} y={322} tx={CX - 56} ty={RY - 20} anchor="end">
          {"kališní\nlístek"}
        </Lbl>
        <Lbl x={92} y={366} tx={CX - 14} ty={RY + 4} anchor="end" sec>
          {"květní\nlůžko"}
        </Lbl>
        <text x={348} y={122} className="bz1-lbl bz1-sm bz1-muted-t">
          pestík:
        </text>
        <Lbl x={348} y={148} tx={CX + 12} ty={RY - 156} className="bz1-b bz1-lvl-t">
          blizna
        </Lbl>
        <Lbl x={348} y={206} tx={CX + 4} ty={RY - 96} className="bz1-b">
          čnělka
        </Lbl>
        <Lbl x={348} y={290} tx={CX + 20} ty={RY - 36} className="bz1-b">
          semeník
        </Lbl>
        <Lbl x={348} y={330} tx={CX + 12} ty={RY - 20}>
          vajíčka
        </Lbl>
      </Fade>
      <Pop delay={0.9}>
        <Bee x={86} y={58} />
      </Pop>
      <DrawArrow d={`M118 66 C170 54 206 90 ${CX - 4} ${RY - 168}`} tone="lvl" delay={1.1} className="bz1-dash" />
      <Fade delay={1.4}>
        <text x={W - 14} y={34} textAnchor="end" className="bz1-lbl bz1-b bz1-lvl-t">
          opylení hmyzem
        </text>
        <text x={W - 14} y={54} textAnchor="end" className="bz1-lbl bz1-sm">
          pyl z jiného květu na bliznu
        </text>
      </Fade>
    </Figure>
  );
}
