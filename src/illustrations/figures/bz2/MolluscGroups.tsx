import { StepStrip } from "../../sequence/StepFigure";
import { Fade, Figure, Frame, Lbl, StripBox, pat, useFig } from "./kit";

const LABEL =
  "Tři skupiny měkkýšů vedle sebe a jejich společné části těla: hlava, noha, útrobní vak s orgány a plášť, který vylučuje schránku. Plž (hlemýžď) má spirálně stočenou ulitu, plochou svalnatou nohu a hlavu s tykadly, oči má na koncích delších tykadel. Mlž (škeble) má schránku ze dvou lastur, sekerovitou nohu a sifony, ale nemá hlavu. Hlavonožec (chobotnice) má nohu přeměněnou v ramena s přísavkami a nálevku, velké oči na hlavě a schránka je vnitřní nebo chybí.";

const W = 240;
const H = 196;

function Snail() {
  const { id } = useFig();
  // shell spiral (logarithmic-ish) around (96, 92)
  const sp: string[] = [];
  for (let t = 0; t <= 4 * Math.PI; t += 0.2) {
    const r = 46 * Math.exp(-0.17 * t);
    sp.push(`${(96 + Math.cos(t + Math.PI / 2) * r).toFixed(1)} ${(92 + Math.sin(t + Math.PI / 2) * r * 0.95).toFixed(1)}`);
  }
  return (
    <Frame w={W} h={H}>
      {/* foot */}
      <path
        d="M30 160 Q40 146 80 144 L170 140 Q196 136 206 120 Q214 108 220 112 Q226 124 214 146 Q200 164 160 166 L40 168 Q28 168 30 160Z"
        className="bz2-o bz2-flesh"
      />
      <path
        d="M30 160 Q40 146 80 144 L170 140 Q196 136 206 120 Q214 108 220 112 Q226 124 214 146 Q200 164 160 166 L40 168 Q28 168 30 160Z"
        fill={pat(id, "dots")}
      />
      {/* tentacles: long (eyes) and short */}
      <path d="M210 114 Q212 92 222 74 M204 118 Q200 100 200 86" className="bz2-o" style={{ strokeWidth: 3 }} />
      <circle cx={222} cy={72} r={3.4} className="bz2-o bz2-ink-f" />
      <circle cx={200} cy={84} r={3.4} className="bz2-o bz2-ink-f" />
      <path d="M220 136 Q232 140 234 150 M216 140 Q224 150 222 158" className="bz2-o bz2-thin" />
      {/* shell */}
      <circle cx={96} cy={92} r={48} className="bz2-o bz2-shell" />
      <circle cx={96} cy={92} r={48} fill={pat(id, "d")} />
      <path d={`M${sp.join(" L")}`} className="bz2-o" />
      {/* mantle edge at the aperture */}
      <path d="M134 120 Q148 132 140 146" className="bz2-o bz2-lvl-s" style={{ strokeWidth: 3 }} />
      <Fade delay={0.3}>
        <Lbl x={8} y={26} tx={66} ty={58} className="bz2-b">ulita</Lbl>
        <Lbl x={190} y={30} tx={222} ty={70} className="bz2-sm">oko</Lbl>
        <Lbl x={170} y={60} tx={202} ty={96} className="bz2-sm">tykadla</Lbl>
        <Lbl x={162} y={188} tx={186} ty={156} className="bz2-b">noha</Lbl>
        <Lbl x={60} y={188} tx={140} ty={136} className="bz2-sm bz2-lvl-t">plášť</Lbl>
        <Lbl x={8} y={48} tx={92} ty={96} className="bz2-sm" sec>útrobní vak</Lbl>
        <Lbl x={150} y={124} tx={204} ty={126} className="bz2-sm" sec>hlava</Lbl>
      </Fade>
    </Frame>
  );
}

function Mussel() {
  const { id } = useFig();
  const valve =
    "M34 98 Q36 52 96 44 Q160 38 198 72 Q214 92 200 116 Q178 140 116 144 Q50 146 34 98Z";
  return (
    <Frame w={W} h={H}>
      {/* foot (axe-shaped) between the valves */}
      <path d="M58 132 Q40 166 70 178 Q104 184 112 150Z" className="bz2-o bz2-flesh" />
      <path d="M58 132 Q40 166 70 178 Q104 184 112 150Z" fill={pat(id, "dots")} />
      {/* siphons at the rear */}
      <path d="M198 100 Q222 96 230 104 Q224 112 200 112" className="bz2-o bz2-flesh" />
      <path d="M200 88 Q220 80 228 86 Q224 94 202 98" className="bz2-o bz2-flesh" />
      {/* the valve */}
      <path d={valve} className="bz2-o bz2-shell" />
      <path d={valve} fill={pat(id, "b")} />
      {/* growth lines from the umbo */}
      {[0.82, 0.64, 0.46, 0.28].map((k) => (
        <path
          key={k}
          d={`M${96 - 40 * k} ${50 + 44 * k} Q${96 + 20 * k} ${46 + 100 * k} ${96 + 92 * k} ${54 + 40 * k}`}
          className="bz2-o bz2-thin"
        />
      ))}
      <circle cx={88} cy={50} r={5} className="bz2-o bz2-fill3" />
      <Fade delay={0.3}>
        <Lbl x={8} y={24} tx={70} ty={72} className="bz2-b">2 lastury</Lbl>
        <Lbl x={100} y={22} tx={120} ty={96} className="bz2-sm" sec>útrobní vak</Lbl>
        <Lbl x={134} y={188} tx={88} ty={168} className="bz2-b">noha</Lbl>
        <Lbl x={172} y={34} tx={220} ty={86} className="bz2-sm">sifony</Lbl>
        <text x={150} y={168} className="bz2-lbl bz2-b bz2-lvl-t">bez hlavy</text>
      </Fade>
    </Frame>
  );
}

function Octopus() {
  const { id } = useFig();
  const arms = [
    "M100 120 Q70 140 50 170 Q40 186 22 182",
    "M106 124 Q88 150 80 182",
    "M110 125 Q100 160 98 188",
    "M118 125 Q130 158 142 186",
    "M114 126 Q112 158 118 186",
    "M122 124 Q140 152 160 178 Q170 188 184 182",
    "M128 120 Q160 136 188 150 Q206 160 218 150",
    "M96 116 Q64 120 40 136 Q26 146 14 140",
  ];
  return (
    <Frame w={W} h={H}>
      {arms.map((d, i) => (
        <g key={i}>
          <path d={d} className="bz2-o" style={{ strokeWidth: 9 }} />
          <path d={d} className="bz2-arm" />
          <path d={d} className="bz2-suckers" />
        </g>
      ))}
      {/* mantle (sack) and head */}
      <path d="M80 104 Q60 64 90 32 Q118 12 146 32 Q170 62 146 104 Q134 120 112 122 Q90 122 80 104Z" className="bz2-o bz2-lvlmid-f" />
      <path d="M80 104 Q60 64 90 32 Q118 12 146 32 Q170 62 146 104 Q134 120 112 122 Q90 122 80 104Z" fill={pat(id, "d")} />
      <path d="M84 88 Q112 98 142 88" className="bz2-o bz2-thin" />
      <ellipse cx={96} cy={102} rx={9} ry={7} className="bz2-o bz2-paper-f" />
      <ellipse cx={96} cy={102} rx={3.5} ry={5} className="bz2-ink-f" />
      {/* funnel */}
      <path d="M140 104 L160 98 L162 108 L144 114Z" className="bz2-o bz2-flesh" />
      <Fade delay={0.3}>
        <Lbl x={150} y={16} tx={150} ty={50} className="bz2-b">plášť</Lbl>
        <Lbl x={176} y={60} tx={128} ty={70} className="bz2-sm" sec>útrobní vak</Lbl>
        <Lbl x={44} y={76} tx={88} ty={100} className="bz2-sm">oko</Lbl>
        <Lbl x={186} y={92} tx={160} ty={102} className="bz2-sm">nálevka</Lbl>
        <Lbl x={8} y={22} className="bz2-sm">ramena</Lbl>
        <Lbl x={8} y={38} tx={30} ty={137} lx={30} ly={44} className="bz2-sm">s přísavkami</Lbl>
      </Fade>
    </Frame>
  );
}

export default function MolluscGroups() {
  return (
    <Figure level={4} label={LABEL} max={860} interactive boost={false}>
      <StripBox
        label={LABEL}
        note="Stejný plán těla – hlava, noha, útrobní vak a plášť se schránkou – je u každé skupiny přestavěný jinak."
      >
        <StepStrip
          min={190}
          steps={[
            {
              title: "Plž – hlemýžď",
              art: <Snail />,
              caption: "Stočená ulita, plochá svalnatá noha na lezení, hlava s tykadly a očima.",
            },
            {
              title: "Mlž – škeble",
              art: <Mussel />,
              caption: "Dvě lastury, sekerovitá noha k zahrabávání; hlavu nemá, potravu filtruje.",
            },
            {
              title: "Hlavonožec – chobotnice",
              art: <Octopus />,
              caption: "Noha se změnila v ramena a nálevku, velké oči; schránka chybí nebo je uvnitř.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
