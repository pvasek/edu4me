import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, f1, pat, useFig } from "./kit";
import { House, T, Tree } from "./land";

const LABEL =
  "Jak vzniká tsunami, animace po krocích. 1. Oceánská deska se podsouvá pod pevninskou; desky se zaklesnou a okraj pevninské desky se ohýbá dolů, roste napětí. 2. Při zemětřesení okraj desky náhle vyskočí nahoru, zvedne mořské dno o několik metrů a s ním celý sloupec vody nad ním. 3. Na volném oceánu je vlna nízká, obvykle pod 1 metr, ale dlouhá 100 až 200 km a rychlá jako dopravní letadlo, asi 700 km/h; lodě ji skoro nepoznají. 4. U pobřeží v mělké vodě vlna zpomalí, zkrátí se a naroste do výšky až desítek metrů (Japonsko 2011 až 40 m). Varováním je náhlý ústup moře od břehu.";

const W = 460;
const H = 262;
const SL = 92; // sea level

/** sea surface: a hump (centre, height, half-width) and an optional trough before it */
function surface(c: number, a: number, w: number, trough = 0, front = w) {
  const pts: string[] = [];
  for (let x = 4; x <= W - 4; x += 3) {
    let y = SL - a * Math.exp(-(((x - c) / (x > c ? front : w)) ** 2));
    if (trough) y += trough * Math.exp(-(((x - c - w * 2.2) / (w * 1.1)) ** 2));
    pts.push(`${x} ${f1(y)}`);
  }
  return pts;
}

/** the leading edge of the continental plate: bent down (−) or sprung up (+) */
function contPlate(bend: number) {
  const e = (x: number) => bend * Math.max(0, (x - 70) / 110) ** 1.6;
  const top = [
    [4, SL - 12],
    [40, SL - 8],
    [52, SL],
    [90, SL + 30],
    [130, SL + 56],
    [180, SL + 82],
  ].map(([x, y]) => `${x} ${f1(y - e(x))}`);
  return `M${top.join(" L")} L192 ${f1(SL + 102 - Math.min(0, e(192)))} L4 ${H - 27}Z`;
}

const OCEAN = `M456 ${SL + 100} L210 ${SL + 104} Q190 ${SL + 104} 180 ${SL + 108} L4 ${H - 26} V${H - 4} H456Z`;
const SHELF = `M456 ${SL + 100} L340 ${SL + 100} Q378 ${SL + 70} 404 ${SL + 22} Q420 ${SL - 2} 436 ${SL - 8} L456 ${SL - 10}Z`;

function Base({ bend, sea }: { bend: number; sea: string[] }) {
  const { id } = useFig();
  const seaD = `M${sea.join(" L")} L${W - 4} ${H - 4} L4 ${H - 4}Z`;
  return (
    <g>
      <path d={seaD} className="gz2-sea" />
      <path d={seaD} fill={pat(id, "h")} opacity={0.45} />
      <path d={`M${sea.join(" L")}`} className="gz2-o" />
      {/* oceanic plate diving under the continent */}
      <path d={OCEAN} className="gz2-ocrust" />
      <path d={OCEAN} fill={pat(id, "d")} opacity={0.5} />
      <path d={OCEAN} className="gz2-o" />
      <path d={contPlate(bend)} className="gz2-crust" />
      <path d={contPlate(bend)} fill={pat(id, "b")} opacity={0.4} />
      <path d={contPlate(bend)} className="gz2-o" />
      {/* the far coast with a town */}
      <path d={SHELF} className="gz2-sed" />
      <path d={SHELF} fill={pat(id, "dots")} />
      <path d={SHELF} className="gz2-o" />
      <House x={444} y={SL - 9} s={0.9} />
      <Tree x={428} y={SL - 6} s={0.8} />
      <Tree x={18} y={SL - 11} s={0.8} conifer />
      <text x={330} y={H - 12} className="gz2-lbl gz2-sm gz2-sec" textAnchor="middle">
        oceánská deska
      </text>
      <text x={10} y={SL + 22} className="gz2-lbl gz2-sm gz2-sec">
        pevninská deska
      </text>
    </g>
  );
}

const STEPS = [
  {
    title: "Napětí roste",
    caption: "Oceánská deska se podsouvá pod pevninskou. Desky se zaklesnou a okraj pevninské desky se ohýbá dolů.",
    art: (
      <Frame w={W} h={H}>
        <Base bend={-20} sea={surface(150, 0, 30)} />
        <path d={contPlate(0).split(" L192")[0].replace(/^M/, "M")} className="gz2-o gz2-thin gz2-dash gz2-faint" />
        <Arrow d="M330 214 H230" tone="lvl" className="gz2-vec" />
        <Fade delay={0.3}>
          <T x={240} y={40} cls="gz2-b">desky se zaklesnou</T>
          <T x={240} y={58} cls="gz2-sm">okraj se ohýbá, napětí roste</T>
        </Fade>
      </Frame>
    ),
  },
  {
    title: "Zemětřesení zvedne dno",
    caption: "Okraj desky náhle vyskočí nahoru, zvedne mořské dno o několik metrů a s ním celý sloupec vody.",
    art: (
      <Frame w={W} h={H}>
        <Base bend={10} sea={surface(150, 12, 34)} />
        <Pop delay={0.1}>
          <path d="M150 182 l3 7 l8 0 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 0Z" className="gz2-quake gz2-o gz2-thin" />
        </Pop>
        <Arrow d="M150 160 V130" tone="red" className="gz2-vec" />
        <Fade delay={0.3}>
          <T x={196} y={204} a="start" cls="gz2-red-t gz2-b">ohnisko</T>
          <T x={240} y={40} cls="gz2-b">dno se zvedne o několik metrů</T>
          <T x={240} y={58} cls="gz2-sm">a nadzvedne vodu nad sebou</T>
        </Fade>
      </Frame>
    ),
  },
  {
    title: "Na volném oceánu",
    caption: "Vlna je nízká (obvykle pod 1 m), ale dlouhá 100–200 km a rychlá asi 700 km/h; lodě ji skoro nepoznají.",
    art: (
      <Frame w={W} h={H}>
        <Base bend={6} sea={surface(270, 6, 64)} />
        <Arrow d="M300 70 H350" tone="lvl" className="gz2-vec" />
        <path d={`M206 ${SL + 14} H334`} className="gz2-o gz2-thin" />
        <path d={`M206 ${SL + 9} v10 M334 ${SL + 9} v10`} className="gz2-o gz2-thin" />
        <Fade delay={0.3}>
          <T x={270} y={SL + 32} cls="gz2-sm">délka vlny 100–200 km</T>
          <T x={150} y={40} cls="gz2-b">výška pod 1 m</T>
          <T x={150} y={58} cls="gz2-sm">rychlost ≈ 700 km/h</T>
          <T x={270} y={170} cls="gz2-sm gz2-sec">hloubka ≈ 4 km</T>
        </Fade>
      </Frame>
    ),
  },
  {
    title: "U pobřeží",
    caption: "V mělké vodě vlna zpomalí, zkrátí se a naroste až na desítky metrů. Varováním je náhlý ústup moře od břehu.",
    art: (
      <Frame w={W} h={H}>
        <Base bend={6} sea={surface(380, 36, 30, 8, 10)} />
        <Arrow d="M350 40 H400" tone="lvl" className="gz2-vec" />
        <Fade delay={0.3}>
          <T x={330} y={36} a="end" cls="gz2-b">vlna zpomalí a naroste</T>
          <T x={330} y={54} a="end" cls="gz2-sm">až desítky metrů</T>
          <T x={448} y={150} a="end" cls="gz2-sm gz2-blue-t">moře ustoupí</T>
          <path d="M432 138 L418 104" className="gz2-lead" />
        </Fade>
      </Frame>
    ),
  },
];

export default function Tsunami() {
  return (
    <Figure level={3} label={LABEL} max={680} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
