import { StepStrip } from "../../sequence/StepFigure";
import type { ReactElement } from "react";
import { Arrow, Figure, Frame, FrontLine, pat, useFig } from "./kit";

const LABEL =
  "Atmosférické fronty v řezu, obě postupují zleva doprava. Studená fronta: těžký studený vzduch se jako klín podsouvá pod teplý vzduch a prudce ho zvedá; rozhraní je strmé, vznikají kupovitá a bouřková oblaka (kumulonimby), krátké silné přeháňky a bouřky, po přechodu se ochladí. Na mapě je to modrá čára s trojúhelníky. Teplá fronta: lehčí teplý vzduch pomalu vyklouzává vzhůru po ustupujícím studeném vzduchu; rozhraní je mírné, oblaka jsou vrstevnatá – řasy daleko před frontou, vyvýšená sloha a u země dešťová sloha s dlouhým vytrvalým deštěm, po přechodu se oteplí. Na mapě je to červená čára s půlkruhy. Okluzní fronta vzniká, když studená fronta dožene teplou, a kreslí se fialově se střídajícími se trojúhelníky a půlkruhy.";

const W = 440;
const H = 290;
const G = 220;

function Symbol({ kind, text }: { kind: "cold" | "warm"; text: string }) {
  return (
    <g>
      <rect x={10} y={G + 22} width={W - 20} height={52} rx={6} className="gz3-tag" />
      <text x={22} y={G + 54} className="gz3-lbl gz3-sm">
        na mapě:
      </text>
      <FrontLine x0={92} x1={256} y={G + 58} kind={kind} />
      <Arrow d={`M264 ${G + 54} H292`} tone="ink" />
      <text x={278} y={G + 40} textAnchor="middle" className="gz3-lbl gz3-sm gz3-muted-t">
        pohyb
      </text>
      <text x={W - 20} y={G + 54} textAnchor="end" className={`gz3-lbl gz3-b ${kind === "cold" ? "gz3-blue-t" : "gz3-red-t"}`}>
        {text}
      </text>
    </g>
  );
}

function Rain({ x0, x1, y0, len, gap = 9 }: { x0: number; x1: number; y0: number; len: number; gap?: number }) {
  const out: ReactElement[] = [];
  for (let x = x0, i = 0; x <= x1; x += gap, i++) {
    out.push(<path key={x} d={`M${x} ${y0 + (i % 3) * 4} l-3 ${len - (i % 2) * 4}`} className="gz3-rain-s" />);
  }
  return <g>{out}</g>;
}

function Cold() {
  const { id } = useFig();
  const wedge = `M10 ${G} V74 C96 76 156 96 200 140 C228 168 244 196 250 ${G} Z`;
  return (
    <Frame w={W} h={H}>
      <rect x={10} y={10} width={W - 20} height={G - 10} className="gz3-warm-f" />
      <path d={wedge} className="gz3-cold-f" />
      <path d={wedge} fill={pat(id, "b")} opacity={0.5} />
      <path d="M10 74 C96 76 156 96 200 140 C228 168 244 196 250 220" className="gz3-front-surf gz3-front-cold" />
      {/* cumulonimbus over the front */}
      <path
        d="M224 150 C212 140 214 124 228 122 C218 104 230 88 244 88 C238 70 248 56 258 50 C240 46 214 44 200 38 C220 30 270 26 320 26 C344 26 360 28 362 34 C352 42 326 46 306 50 C316 64 320 80 310 90 C324 98 324 118 312 124 C322 134 318 150 304 150 Z"
        className="gz3-o gz3-cloud-d"
      />
      <Rain x0={232} x1={300} y0={156} len={22} gap={8} />
      <path d="M272 154 l-6 14 h7 l-6 14" className="gz3-bolt" />
      <Arrow d="M40 190 H170" tone="blue" className="gz3-wind" />
      <Arrow d="M330 200 C300 196 268 170 252 118" tone="red" className="gz3-wind" />
      <path d={`M10 ${G} H${W - 10}`} className="gz3-o" />
      <text x={24} y={100} className="gz3-lbl gz3-b gz3-blue-t">
        studený
      </text>
      <text x={24} y={118} className="gz3-lbl gz3-b gz3-blue-t">
        vzduch
      </text>
      <text x={W - 20} y={136} textAnchor="end" className="gz3-lbl gz3-b gz3-red-t">
        teplý vzduch
      </text>
      <text x={W - 20} y={74} textAnchor="end" className="gz3-lbl gz3-sm">
        kumulonimbus
      </text>
      <text x={W - 20} y={90} textAnchor="end" className="gz3-lbl gz3-sm">
        bouřky, přeháňky
      </text>
      <Symbol kind="cold" text="studená fronta" />
    </Frame>
  );
}

function Warm() {
  const { id } = useFig();
  const wedge = `M110 ${G} C200 196 320 160 ${W - 10} 118 V${G} Z`;
  return (
    <Frame w={W} h={H}>
      <rect x={10} y={10} width={W - 20} height={G - 10} className="gz3-warm-f" />
      <path d={wedge} className="gz3-cold-f" />
      <path d={wedge} fill={pat(id, "b")} opacity={0.5} />
      <path d={`M110 ${G} C200 196 320 160 ${W - 10} 118`} className="gz3-front-surf gz3-front-warm" />
      {/* layered clouds along the front surface */}
      <path d="M92 172 C80 150 96 132 124 128 C170 116 230 118 262 124 C276 134 268 150 250 156 C210 166 160 174 120 186 Z" className="gz3-o gz3-cloud-d" />
      <path d="M210 106 C230 96 300 92 338 98 C350 104 344 114 330 116 C290 122 240 124 214 118 Z" className="gz3-o gz3-cloud" />
      <g className="gz3-cirrus">
        <path d="M330 58 q20 -2 32 -12 q4 -3 9 -3" />
        <path d="M362 70 q18 -1 28 -10" />
        <path d="M300 74 q16 0 26 -8" />
      </g>
      <Rain x0={104} x1={232} y0={180} len={30} gap={10} />
      <Arrow d="M30 200 C120 176 230 150 330 108" tone="red" className="gz3-wind" />
      <path d={`M10 ${G} H${W - 10}`} className="gz3-o" />
      <text x={24} y={40} className="gz3-lbl gz3-b gz3-red-t">
        teplý vzduch
      </text>
      <text x={W - 20} y={176} textAnchor="end" className="gz3-lbl gz3-b gz3-blue-t">
        studený vzduch
      </text>
      <text x={160} y={150} textAnchor="middle" className="gz3-lbl gz3-sm">
        dešťová sloha
      </text>
      <text x={276} y={88} textAnchor="middle" className="gz3-lbl gz3-sm">
        vyvýšená sloha
      </text>
      <text x={W - 20} y={88} textAnchor="end" className="gz3-lbl gz3-sm">
        řasy
      </text>
      <Symbol kind="warm" text="teplá fronta" />
    </Frame>
  );
}

export default function WeatherFronts() {
  return (
    <Figure label={LABEL} max={900} interactive>
      <div className="gz3-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={300}
          steps={[
            {
              title: "Studená fronta",
              art: <Cold />,
              caption:
                "Studený vzduch se podsouvá pod teplý a prudce ho zvedá. Strmé rozhraní: kumulonimby, krátké silné přeháňky a bouřky, nárazy větru. Potom se ochladí a vyjasní.",
            },
            {
              title: "Teplá fronta",
              art: <Warm />,
              caption:
                "Teplý vzduch pomalu klouže vzhůru po studeném. Mírné rozhraní: vrstevnatá oblaka od řas po dešťovou slohu a dlouhý vytrvalý déšť. Potom se oteplí.",
            },
          ]}
        />
        <p className="gz3-strip-note">
          <svg viewBox="0 0 120 20" width="96" height="16" aria-hidden="true" className="gz3-inline-sym">
            <FrontLine x0={0} x1={120} y={16} kind="occ" step={26} />
          </svg>{" "}
          okluzní fronta: studená fronta dohnala teplou
        </p>
      </div>
    </Figure>
  );
}
