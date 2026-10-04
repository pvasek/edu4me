import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Eq, Figure, Frame, pat, rng, useFig } from "./kit";
import { T, Tree } from "./land";

const LABEL =
  "Tři druhy zvětrávání. Mechanické zvětrávání: voda zateče do pukliny ve skále, v noci zmrzne a led má asi o 9 % větší objem než voda, takže puklinu roztlačí; opakováním se skála rozpadá na úlomky a pod ní vzniká suť. Chemické zvětrávání: dešťová voda s rozpuštěným oxidem uhličitým rozpouští vápenec (CaCO3 + H2O + CO2 → Ca(HCO3)2), a tak ve skále vznikají žlábky a rozšířené pukliny. Biologické zvětrávání: kořeny stromů vrůstají do puklin a roztlačují je, lišejníky na povrchu skály vylučují kyseliny, které horninu narušují.";

const W = 260;
const H = 210;
const G = 182; // ground

function Ground() {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} className="gz2-soil" />
      <rect x={4} y={G} width={W - 8} height={H - 4 - G} fill={pat(id, "dots")} />
      <path d={`M4 ${G} H${W - 4}`} className="gz2-o" />
    </g>
  );
}

const ROCK = `M40 ${G} L46 86 Q60 62 96 58 L150 56 Q190 60 204 84 L214 ${G}Z`;

function Rock({ cls = "gz2-rock" }: { cls?: string }) {
  const { id } = useFig();
  return (
    <g>
      <path d={ROCK} className={cls} />
      <path d={ROCK} fill={pat(id, "d")} opacity={0.45} />
      <path d={ROCK} className="gz2-o" />
    </g>
  );
}

function Frost() {
  const r = rng(5);
  return (
    <Frame w={W} h={H}>
      <Ground />
      <Rock />
      {/* the crack held open by ice */}
      <path d="M112 57 L134 57 L125 92 L128 120 L116 152 L118 120 L111 92Z" className="gz2-icecrack gz2-o" />
      <Arrow d="M108 86 h-24" tone="blue" />
      <Arrow d="M134 86 h24" tone="blue" />
      {/* a broken-off block and scree */}
      <path d="M204 84 L214 112 L196 104Z" className="gz2-rock2 gz2-o gz2-thin" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 214 + r() * 34;
        const y = G - 2 - r() * (x - 212) * 0.35;
        return <path key={i} d={`M${x} ${y} l4 -3 l4 2 l-1 4 l-6 1Z`} className="gz2-rock2 gz2-o gz2-thin" />;
      })}
      <T x={124} y={26} cls="gz2-b gz2-blue-t">voda v puklině zmrzne</T>
      <T x={124} y={44} cls="gz2-sm">led má o 9 % větší objem</T>
      <T x={232} y={150} cls="gz2-sm">suť</T>
    </Frame>
  );
}

function Chemical() {
  return (
    <Frame w={W} h={H}>
      <Ground />
      <Rock cls="gz2-lime" />
      {/* grooves dissolved by water */}
      {[78, 104, 136, 166].map((x, i) => (
        <path key={x} d={`M${x} ${58 + (i === 0 ? 4 : 0)} q4 ${30 + i * 6} -2 ${50 + i * 8}`} className="gz2-o" style={{ strokeWidth: 3 }} />
      ))}
      {/* rain */}
      {[60, 90, 120, 150, 180, 70, 130, 170].map((x, i) => (
        <path key={i} d={`M${x} ${14 + (i % 3) * 8} l-3 10`} className="gz2-arr gz2-arr-blue" style={{ strokeWidth: 1.6 }} />
      ))}
      <T x={W / 2} y={54} cls="gz2-sm gz2-b gz2-blue-t">voda s CO₂</T>
      <T x={W / 2} y={138} cls="gz2-b">vápenec se rozpouští</T>
      <Eq x={W / 2} y={G + 20} t="CaCO_{3} + H_{2}O + CO_{2} → Ca(HCO_{3})_{2}" anchor="middle" className="gz2-eq-sm" />
    </Frame>
  );
}

function Biological() {
  return (
    <Frame w={W} h={H}>
      <Ground />
      <Rock />
      {/* roots pushing into cracks */}
      <path d="M120 58 L116 96 L122 130" className="gz2-o" />
      <path d="M120 58 Q118 80 116 96 Q118 112 122 130" className="gz2-root" />
      <path d="M126 58 Q140 70 150 92" className="gz2-root" />
      <Arrow d="M110 100 h-20" tone="green" />
      <Arrow d="M128 100 h20" tone="green" />
      <Tree x={122} y={58} s={1.9} />
      {/* lichens */}
      {[
        [62, 96],
        [56, 128],
        [184, 104],
        [194, 140],
        [170, 74],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7} className="gz2-lichen gz2-o gz2-thin" />
          <circle cx={x + 6} cy={y + 4} r={4} className="gz2-lichen gz2-o gz2-thin" />
        </g>
      ))}
      <T x={14} y={26} a="start" cls="gz2-sm gz2-b">kořeny roztlačují</T>
      <T x={14} y={42} a="start" cls="gz2-sm gz2-b">pukliny</T>
      <T x={W / 2} y={G - 14} cls="gz2-sm">lišejníky: kyseliny</T>
    </Frame>
  );
}

export default function WeatheringTypes() {
  return (
    <Figure level={3} label={LABEL} max={900} interactive>
      <div className="gz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={230}
          steps={[
            {
              title: "Mechanické",
              art: <Frost />,
              caption: "Zmrzlá voda roztlačí puklinu; skála se rozpadá na úlomky, pod ní roste suť.",
            },
            {
              title: "Chemické",
              art: <Chemical />,
              caption: "Voda s oxidem uhličitým rozpouští vápenec; vznikají žlábky (škrapy) a jeskyně.",
            },
            {
              title: "Biologické",
              art: <Biological />,
              caption: "Kořeny rostlin roztlačují pukliny, lišejníky leptají povrch skály kyselinami.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
