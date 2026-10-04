import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, StripBox } from "./kit";

const LABEL =
  "Jednovaječná a dvojvaječná dvojčata. Jednovaječná: jedno vajíčko oplodí jedna spermie, vznikne jedna zygota a zárodek se v prvních dnech rozdělí na dva; dvojčata mají stejnou DNA a vždy stejné pohlaví. Dvojvaječná: dvě vajíčka oplodí dvě různé spermie, vzniknou dvě zygoty a dva zárodky; dvojčata jsou si podobná jako jiní sourozenci a mohou mít různé pohlaví.";

const W = 240;
const H = 362;

function Egg({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 4} className="bz6-corona" />
      <circle cx={x} cy={y} r={r} className="bz6-o bz6-egg" />
      <circle cx={x + 3} cy={y - 2} r={r * 0.3} className="bz6-o bz6-thin bz6-lvlsoft-f" />
    </g>
  );
}

/** sperm heading towards (x, y) from the upper left */
function Sperm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(35)`}>
      <path d="M-8 0 q-6 -4 -11 0 t-11 0 t-10 0" className="bz6-tail" />
      <ellipse cx={-3} cy={0} rx={6} ry={3.8} className="bz6-o bz6-thin bz6-sperm" />
    </g>
  );
}

function Zygote({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={20} className="bz6-o bz6-egg" />
      <circle cx={x} cy={y} r={7} className="bz6-o bz6-thin bz6-lvlmid-f" />
    </g>
  );
}

function Embryo({ x, y }: { x: number; y: number }) {
  const cells: [number, number][] = [
    [-6, -6],
    [6, -6],
    [-6, 6],
    [6, 6],
    [0, 0],
  ];
  return (
    <g>
      <circle cx={x} cy={y} r={17} className="bz6-o bz6-thin bz6-corona-f" />
      {cells.map(([dx, dy], i) => (
        <circle key={i} cx={x + dx} cy={y + dy} r={6.5} className="bz6-o bz6-thin bz6-egg" />
      ))}
    </g>
  );
}

function Child({ x, y, tone }: { x: number; y: number; tone: "a" | "b" }) {
  return (
    <g className={`bz6-child bz6-child-${tone}`}>
      <circle cx={x} cy={y - 16} r={9} className="bz6-o" />
      <path d={`M${x - 12} ${y + 20} L${x - 9} ${y - 2} Q${x} ${y - 7} ${x + 9} ${y - 2} L${x + 12} ${y + 20}Z`} className="bz6-o" />
    </g>
  );
}

function Txt({ y, children }: { y: number; children: string }) {
  return (
    <text x={W / 2} y={y} textAnchor="middle" className="bz6-lbl bz6-sm">
      {children}
    </text>
  );
}

function Identical() {
  return (
    <Frame w={W} h={H} className="bz6-small">
      <Egg x={128} y={46} />
      <Sperm x={104} y={30} />
      <Txt y={98}>vajíčko + spermie</Txt>
      <DrawArrow d="M120 106 V120" />
      <Zygote x={120} y={144} />
      <Txt y={192}>jedna zygota</Txt>
      <DrawArrow d="M108 200 L88 216" tone="lvl" />
      <DrawArrow d="M132 200 L152 216" tone="lvl" />
      <Embryo x={78} y={236} />
      <Embryo x={162} y={236} />
      <Txt y={278}>zárodek se rozdělí</Txt>
      <Child x={96} y={314} tone="a" />
      <Child x={144} y={314} tone="a" />
      <Txt y={358}>stejná DNA</Txt>
    </Frame>
  );
}

function Fraternal() {
  return (
    <Frame w={W} h={H} className="bz6-small">
      <Egg x={78} y={46} r={17} />
      <Egg x={170} y={46} r={17} />
      <Sperm x={58} y={32} />
      <Sperm x={150} y={32} />
      <Txt y={98}>2 vajíčka + 2 spermie</Txt>
      <DrawArrow d="M78 106 V120" />
      <DrawArrow d="M162 106 V120" />
      <Zygote x={78} y={144} />
      <Zygote x={162} y={144} />
      <Txt y={192}>dvě zygoty</Txt>
      <DrawArrow d="M78 200 V214" />
      <DrawArrow d="M162 200 V214" />
      <Embryo x={78} y={236} />
      <Embryo x={162} y={236} />
      <Txt y={278}>dva zárodky</Txt>
      <Child x={96} y={314} tone="a" />
      <Child x={144} y={314} tone="b" />
      <Txt y={358}>různá DNA</Txt>
    </Frame>
  );
}

export default function Twins() {
  return (
    <Figure level={7} label={LABEL} max={640} interactive boost={false}>
      <StripBox label={LABEL} note="Stejná barva postav = stejná DNA.">
        <StepStrip
          min={200}
          phoneColumns={2}
          steps={[
            {
              title: "Jednovaječná dvojčata",
              art: <Identical />,
              caption: "Jedna zygota se rozdělí na dva zárodky: stejná DNA, vždy stejné pohlaví.",
            },
            {
              title: "Dvojvaječná dvojčata",
              art: <Fraternal />,
              caption: "Dvě vajíčka a dvě spermie: podobní jako jiní sourozenci, pohlaví může být různé.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
