import type { ReactNode } from "react";
import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, pat, useFig } from "./kit";
import { T, Tree } from "./land";

const LABEL =
  "Pět typů pobřeží na mapkách. Fjord je dlouhý úzký a hluboký záliv v horách, který vznikl zaplavením ledovcového údolí, například v Norsku. Ria je zaplavené ústí říčního údolí, rozvětvené jako strom, například v Galicii ve Španělsku. Laguna je mělká zátoka oddělená od moře písečným valem, například Benátská laguna. Delta je vějíř nánosů, kterými řeka roste do moře a rozděluje se na ramena, například Nil nebo Dunaj. Korálový útes stavějí korálnatci v teplém mělkém moři, například Velký bariérový útes u Austrálie.";

const W = 200;
const H = 150;
const SEA = "M4 4 H196 V146 H4Z";

function Mini(p: Parameters<typeof MiniArt>[0]) {
  return (
    <Frame w={W} h={H}>
      <MiniArt {...p} />
    </Frame>
  );
}

function MiniArt({ land, children, hatch = "dots" }: { land: string; children?: ReactNode; hatch?: string }) {
  const { id } = useFig();
  return (
    <>
      <path d={SEA} className="gz2-sea" />
      <path d={SEA} fill={pat(id, "h")} opacity={0.45} />
      <path d={land} className="gz2-grass" />
      <path d={land} fill={pat(id, hatch)} opacity={0.5} />
      <path d={land} className="gz2-o" />
      {children}
      <path d={SEA} className="gz2-o gz2-thin" />
    </>
  );
}

const STEPS = [
  {
    title: "Fjord",
    caption: "Zaplavené ledovcové údolí: úzké, dlouhé a hluboké, se strmými stěnami (Norsko).",
    art: (
      <Mini
        hatch="x"
        land="M4 4 H196 V96 L150 100 L132 92 L110 98 L105 76 L97 52 L89 26 L79 28 L85 52 L91 76 L90 98 L70 96 L52 104 L4 100Z"
      >
        <path d="M84 27 L76 12" className="gz2-river" style={{ strokeWidth: 2.4 }} />
        <T x={150} y={128} cls="gz2-sm gz2-b">fjord</T>
      </Mini>
    ),
  },
  {
    title: "Ria",
    caption: "Moře zaplavilo ústí říčního údolí, záliv se větví jako strom (Galicie ve Španělsku).",
    art: (
      <Mini land="M4 4 H196 V98 Q170 104 150 96 Q132 88 124 70 Q118 60 120 46 Q112 58 110 70 Q104 60 100 50 Q96 62 100 76 Q90 70 84 64 Q86 78 96 86 Q86 96 66 98 Q40 104 4 96Z">
        <path d="M120 46 Q122 30 132 16 M100 50 Q96 34 88 22 M84 64 Q72 56 60 50" className="gz2-river" style={{ strokeWidth: 2.2 }} />
        <T x={150} y={128} cls="gz2-sm gz2-b">ria</T>
      </Mini>
    ),
  },
  {
    title: "Laguna",
    caption: "Mělkou zátoku odděluje od moře písečný val s úzkými průlivy (Benátská laguna).",
    art: (
      <Mini land="M4 4 H196 V60 Q150 66 100 62 Q50 58 4 64Z">
        <path d="M4 64 Q50 58 100 62 Q150 66 196 60 V88 Q150 92 100 90 Q50 88 4 92Z" className="gz2-lagoon" />
        <path d="M4 92 Q50 88 94 90 L96 98 Q50 96 4 100Z M104 90 Q150 92 196 88 V96 Q150 100 106 98Z" className="gz2-sand gz2-o gz2-thin" />
        <circle cx={70} cy={76} r={4} className="gz2-roof gz2-o gz2-thin" />
        <T x={150} y={80} cls="gz2-sm gz2-b">laguna</T>
        <T x={100} y={126} cls="gz2-sm">písečný val</T>
      </Mini>
    ),
  },
  {
    title: "Delta",
    caption: "Řeka ukládá nánosy rychleji, než je moře odnese, a dělí se na ramena (Nil, Dunaj).",
    art: (
      <Mini land="M4 4 H196 V62 Q160 64 150 78 Q140 100 120 112 Q100 120 80 112 Q60 100 50 78 Q40 64 4 62Z">
        <path d="M40 63 Q48 66 52 78 Q62 100 80 112 Q100 120 120 112 Q138 100 148 78 Q152 66 160 63 Q130 54 100 54 Q70 54 40 63Z" className="gz2-sed" />
        <path d="M100 4 Q98 30 100 56 M100 56 Q90 80 70 104 M100 56 Q100 84 100 116 M100 56 Q112 80 128 106 M100 56 Q84 66 60 86 M100 56 Q118 68 142 88" className="gz2-river" style={{ strokeWidth: 2.2 }} />
        <T x={176} y={128} cls="gz2-sm gz2-b">delta</T>
      </Mini>
    ),
  },
  {
    title: "Korálový útes",
    caption: "Útes z vápenatých koster korálnatců roste jen v teplém, čistém a mělkém moři (Velký bariérový útes).",
    art: (
      <Mini land="M4 4 H196 V50 Q150 56 100 52 Q50 48 4 54Z">
        <path d="M4 54 Q50 48 100 52 Q150 56 196 50 V96 Q150 104 100 100 Q50 96 4 102Z" className="gz2-lagoon" />
        <path d="M4 102 Q50 96 84 99 L86 108 Q50 104 4 110Z M96 100 Q150 104 196 96 V104 Q150 112 98 108Z" className="gz2-coral gz2-o gz2-thin" />
        {[30, 120, 160].map((x) => (
          <Tree key={x} x={x} y={40} s={0.7} />
        ))}
        <T x={100} y={80} cls="gz2-sm gz2-blue-t">laguna</T>
        <T x={100} y={132} cls="gz2-sm gz2-b">korálový útes</T>
      </Mini>
    ),
  },
];

export default function CoastTypes() {
  return (
    <Figure level={3} label={LABEL} max={980} interactive>
      <div className="gz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip min={170} phoneColumns={2} steps={STEPS} />
      </div>
    </Figure>
  );
}
