import { Draw, Fade, Figure, Pop } from "./kit";
import { Animal } from "./animals";

const LABEL =
  "Kladogram obratlovců. Větve vedou ke skupinám mihule, žralok, kapr, skokan, ještěrka a myš. Na kmeni jsou vyznačeny odvozené znaky, které sdílejí všechny skupiny nad nimi: obratle, čelisti, kostěná kostra, čtyři končetiny, amniotické vejce a nakonec srst a mléčné žlázy. Každý uzel představuje společného předka. Ještěrka je příbuznější myši než kaprovi, protože ještěrka a myš mají mladšího společného předka (uzel s amniotickým vejcem). Příbuznost se čte podle uzlů, ne podle pořadí větví zleva doprava.";

const W = 462;
const H = 470;
const RX = 50; // root
const RY = 430;
const TIPY = 104;
const JX = 14;
const at = (d: number): [number, number] => [RX + d, RY - d];
const TAXA = [
  { kind: "mihule", name: "mihule" },
  { kind: "zralok", name: "žralok" },
  { kind: "kapr", name: "kapr" },
  { kind: "skokan", name: "skokan" },
  { kind: "jesterka", name: "ještěrka" },
  { kind: "mys", name: "myš" },
] as const;
const NODE_D = [150, 186, 222, 258, 294];
const END_D = RY - TIPY; // spine reaches the tips' height
// branch from node (x, y) up-left at 45° to the tip line
const tipX = (d: number) => {
  const [x, y] = at(d);
  return x - (y - TIPY);
};
const TRAITS: [number, string, string?][] = [
  [128, "obratle"],
  [168, "čelisti"],
  [204, "kostěná kostra"],
  [240, "čtyři končetiny"],
  [276, "amniotické", "vejce"],
  [311, "srst,", "mléčné žlázy"],
];

export default function Cladogram() {
  const tips = [...NODE_D.map(tipX), at(END_D)[0]];
  const hl = at(NODE_D[4]);
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={640} replay>
      {/* spine and branches */}
      <Draw d={`M${at(100)[0]} ${at(100)[1]} L${at(END_D)[0]} ${at(END_D)[1]}`} className="bz4-cl-line" />
      {NODE_D.map((d, i) => {
        const [x, y] = at(d);
        return <Draw key={i} d={`M${x} ${y} L${tips[i]} ${TIPY}`} className="bz4-cl-line" delay={0.2 + i * 0.12} />;
      })}
      {/* highlighted node: common ancestor of lizard and mouse */}
      <Pop delay={1.2}>
        <circle cx={hl[0]} cy={hl[1]} r={8} className="bz4-cl-node" />
      </Pop>
      {/* taxa */}
      {TAXA.map((t, i) => (
        <Pop key={t.kind} delay={0.5 + i * 0.1}>
          <Animal kind={t.kind} x={tips[i]} y={TIPY - 30} s={1.05} />
          <text x={tips[i]} y={TIPY - 54} textAnchor="middle" className="bz4-lbl bz4-b">
            {t.name}
          </text>
        </Pop>
      ))}
      {/* derived traits on the spine */}
      {TRAITS.map(([d, a, b], i) => {
        const [x, y] = at(d);
        return (
          <Fade key={a} delay={0.9 + i * 0.1}>
            <path d={`M${x - 9} ${y - 9} L${x + 9} ${y + 9}`} className="bz4-cl-tick" />
            <text x={x + 14} y={y + 16} className="bz4-lbl bz4-sm bz4-lvl-t bz4-b">
              {a}
            </text>
            {b && (
              <text x={x + 14} y={y + 32} className="bz4-lbl bz4-sm bz4-lvl-t bz4-b">
                {b}
              </text>
            )}
          </Fade>
        );
      })}
      {/* how to read it */}
      <Fade delay={1.4}>
        <text x={JX} y={RY - 54} className="bz4-lbl bz4-b">jak číst</text>
        <text x={JX} y={RY - 34} className="bz4-lbl bz4-sm">
          <tspan className="bz4-cl-dot">●</tspan> uzel = společný předek
        </text>
        <text x={JX} y={RY - 16} className="bz4-lbl bz4-sm">
          <tspan className="bz4-cl-dot">▬</tspan> znak na kmeni mají všechny větve nad ním
        </text>
        <text x={JX} y={RY + 4} className="bz4-lbl bz4-sm">
          ještěrka je bližší myši než kaprovi: mají
        </text>
        <text x={JX} y={RY + 22} className="bz4-lbl bz4-sm">
          mladšího společného předka (uzel <tspan className="bz4-cl-dot">●</tspan>)
        </text>
      </Fade>
    </Figure>
  );
}
