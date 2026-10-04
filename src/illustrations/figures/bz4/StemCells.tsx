import type { ReactElement } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, pat, useFig } from "./kit";
import {
  Blastocyst,
  Epithelium,
  Fibroblast,
  HeartCells,
  MuscleFibre,
  Neuron,
  Platelets,
  RedCell,
  StemCell,
  WhiteCell,
} from "./cells";

const LABEL =
  "Tři druhy kmenových buněk. 1. Embryonální kmenové buňky pocházejí z vnitřní buněčné masy raného embrya (blastocysty); jsou pluripotentní – mohou se změnit téměř v jakoukoli buňku těla, například v neuron, červenou krvinku, svalovou nebo kožní buňku. 2. Dospělé kmenové buňky, například v červené kostní dřeni, jsou multipotentní: dávají vznik jen buňkám své tkáně – červeným a bílým krvinkám a krevním destičkám. 3. Indukované pluripotentní (iPS) buňky vzniknou přeprogramováním dospělé buňky, například kožního fibroblastu, vnesením čtyř genů; chovají se jako embryonální kmenové buňky a lze z nich vypěstovat třeba buňky srdečního svalu nebo neurony.";

const W = 280;
const H = 250;

function Es() {
  const outs: [number, string, (p: { x: number; y: number; s?: number }) => ReactElement][] = [
    [38, "neuron", Neuron],
    [104, "krvinka", RedCell],
    [176, "sval", MuscleFibre],
    [246, "kůže", Epithelium],
  ];
  return (
    <Frame w={W} h={H} className="bz4-panel">
      <Blastocyst x={52} y={66} s={1.1} />
      <text x={52} y={22} textAnchor="middle" className="bz4-lbl bz4-sm">
        blastocysta
      </text>
      <Arrow d="M90 62 H158" tone="lvl" />
      <text x={124} y={54} textAnchor="middle" className="bz4-lbl bz4-sm">
        odběr
      </text>
      <StemCell x={196} y={64} s={1.15} />
      <text x={196} y={22} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        kmenová buňka
      </text>
      {outs.map(([x], i) => (
        <Arrow key={i} d={`M${196 + (x - 196) * 0.14} 94 L${x + (196 - x) * 0.12} 150`} tone="ink" />
      ))}
      {outs.map(([x, t, C]) => (
        <g key={t}>
          <C x={x} y={x === 38 ? 166 : 180} s={x === 38 ? 0.9 : 1} />
          <text x={x} y={222} textAnchor="middle" className="bz4-lbl bz4-sm">
            {t}
          </text>
        </g>
      ))}
      <text x={W / 2} y={244} textAnchor="middle" className="bz4-lbl bz4-b bz4-lvl-t">
        pluripotentní: skoro cokoli
      </text>
    </Frame>
  );
}

function Marrow() {
  const { id } = useFig();
  // long bone with the marrow cavity, a magnified spot of red marrow
  const bone =
    "M20 40 C10 28 22 14 34 22 C42 14 58 18 54 32 L54 128 C60 142 46 154 36 146 C26 156 10 146 18 132 L22 32Z";
  return (
    <Frame w={W} h={H} className="bz4-panel">
      <path d={bone} className="bz4-o" fill="var(--bz4-bone)" />
      <path d={bone} fill={pat(id, "dots")} />
      <rect x={30} y={36} width={16} height={96} rx={7} className="bz4-o bz4-thin bz4-marrow" />
      <text x={38} y={176} textAnchor="middle" className="bz4-lbl bz4-sm">
        kost
      </text>
      <circle cx={38} cy={84} r={9} className="bz4-o bz4-thin" fill="none" />
      <path d="M46 80 L104 46 M46 90 L104 120" className="bz4-lead" />
      <circle cx={140} cy={84} r={44} className="bz4-o bz4-marrow" />
      <circle cx={140} cy={84} r={44} fill={pat(id, "dots")} />
      <StemCell x={140} y={84} s={1} />
      <text x={140} y={22} textAnchor="middle" className="bz4-lbl bz4-sm">
        červená kostní dřeň
      </text>
      <Arrow d="M178 66 L214 46" tone="ink" />
      <Arrow d="M184 84 H214" tone="ink" />
      <Arrow d="M178 102 L214 124" tone="ink" />
      <RedCell x={236} y={42} />
      <WhiteCell x={236} y={86} />
      <Platelets x={236} y={128} s={1.2} />
      <text x={236} y={160} textAnchor="middle" className="bz4-lbl bz4-sm">
        destičky
      </text>
      <text x={140} y={150} textAnchor="middle" className="bz4-lbl bz4-sm">
        dospělá kmenová
      </text>
      <text x={140} y={166} textAnchor="middle" className="bz4-lbl bz4-sm">
        buňka
      </text>
      <text x={W / 2} y={214} textAnchor="middle" className="bz4-lbl bz4-sm">
        krvinky a destičky stále dorůstají
      </text>
      <text x={W / 2} y={244} textAnchor="middle" className="bz4-lbl bz4-b bz4-lvl-t">
        multipotentní: jen buňky své tkáně
      </text>
    </Frame>
  );
}

function Ips() {
  return (
    <Frame w={W} h={H} className="bz4-panel">
      <Fibroblast x={46} y={68} s={1.15} />
      <text x={46} y={30} textAnchor="middle" className="bz4-lbl bz4-sm">
        buňka z kůže
      </text>
      <Arrow d="M86 68 H160" tone="lvl" />
      <text x={123} y={58} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        + 4 geny
      </text>
      <text x={123} y={90} textAnchor="middle" className="bz4-lbl bz4-sm">
        přeprogramování
      </text>
      <StemCell x={200} y={68} s={1.15} />
      <text x={200} y={30} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b">
        iPS buňka
      </text>
      <Arrow d="M184 98 L128 150" tone="ink" />
      <Arrow d="M212 98 L222 150" tone="ink" />
      <HeartCells x={104} y={176} />
      <Neuron x={226} y={166} s={0.9} />
      <text x={104} y={214} textAnchor="middle" className="bz4-lbl bz4-sm">
        srdeční sval
      </text>
      <text x={226} y={214} textAnchor="middle" className="bz4-lbl bz4-sm">
        neuron
      </text>
      <text x={W / 2} y={244} textAnchor="middle" className="bz4-lbl bz4-b bz4-lvl-t">
        bez embrya, z buněk pacienta
      </text>
    </Frame>
  );
}

export default function StemCells() {
  return (
    <Figure level={10} label={LABEL} max={960} interactive boost={false}>
      <div className="bz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Embryonální",
              art: <Es />,
              caption:
                "Z vnitřní buněčné masy raného embrya. Umí se změnit téměř v jakoukoli buňku těla.",
            },
            {
              title: "Dospělé (kostní dřeň)",
              art: <Marrow />,
              caption:
                "Doplňují buňky jedné tkáně: z kmenových buněk kostní dřeně vznikají všechny krevní buňky.",
            },
            {
              title: "iPS buňky",
              art: <Ips />,
              caption:
                "Dospělou buňku lze vnesením čtyř genů vrátit do stavu kmenové buňky (Jamanaka, Nobelova cena 2012).",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
