import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, pat, useFig } from "./kit";
import { T, smooth } from "./land";

const LABEL =
  "Jak vzniká slepé rameno, animace po krocích, s mapou shora a řezem korytem. 1. V zákrutu meandru teče voda nejrychleji u vnějšího břehu, který podemílá (výsep, eroze); u vnitřního břehu teče pomalu a ukládá písek a štěrk (jesep). V řezu je vnější břeh strmý a hluboký, vnitřní mělký a pozvolný. 2. Zákruty se tak postupně zvětšují a šíje mezi nimi se zužuje. 3. Při povodni řeka šíji protrhne a teče novou zkratkou. 4. Starý zákrut se na koncích zanese nánosy a oddělí se jako slepé rameno – jezero ve tvaru podkovy, které postupně zarůstá.";

const W = 440;
const H = 304;
const Y0 = 104; // river axis
const CX = 150; // the loop that will be cut off

type Pt = [number, number];
const F1: Pt[] = [[0, Y0], [60, Y0 + 6], [104, Y0 - 4], [124, Y0 - 38], [150, Y0 - 54], [176, Y0 - 38], [196, Y0 - 4], [240, Y0 + 6], [280, Y0]];
const LOOP: Pt[] = [[138, Y0 - 12], [116, Y0 - 50], [150, Y0 - 80], [184, Y0 - 50], [162, Y0 - 12]];
const F2: Pt[] = [[0, Y0], [70, Y0 + 8], [126, Y0 + 6], ...LOOP, [174, Y0 + 6], [230, Y0 + 8], [280, Y0]];
const CUT: Pt[] = [[126, Y0 + 6], [150, Y0 + 7], [174, Y0 + 6]];
const NEW: Pt[] = [[0, Y0], [70, Y0 + 8], [126, Y0 + 7], [174, Y0 + 7], [230, Y0 + 8], [280, Y0]];
// the second bend, unchanged in every frame (section A–B through its apex)
const BEND2 = `M280 ${Y0} C310 ${Y0} 296 ${Y0 + 58} 334 ${Y0 + 58} C372 ${Y0 + 58} 358 ${Y0} 390 ${Y0} C410 ${Y0} 426 ${Y0} 440 ${Y0}`;

function Channel({ d, w = 10, dry = false }: { d: string; w?: number; dry?: boolean }) {
  return (
    <g>
      <path d={d} className="gz2-bank" style={{ strokeWidth: w + 3 }} />
      <path d={d} className={dry ? "gz2-oxbow" : "gz2-river"} style={{ strokeWidth: w }} />
    </g>
  );
}

function Plain({ children }: { children?: ReactNode }) {
  const { id } = useFig();
  return (
    <g>
      <rect x={4} y={6} width={W - 8} height={190} rx={4} className="gz2-grass" />
      <rect x={4} y={6} width={W - 8} height={190} rx={4} fill={pat(id, "dots")} opacity={0.5} />
      {children}
      {/* second bend: deposition inside, erosion outside */}
      <path d={`M318 ${Y0 + 40} Q334 ${Y0 + 28} 350 ${Y0 + 40} Q334 ${Y0 + 46} 318 ${Y0 + 40}Z`} className="gz2-sand gz2-o gz2-thin" />
      <Channel d={BEND2} />
      <path d={`M300 ${Y0 + 50} C312 ${Y0 + 70} 356 ${Y0 + 70} 368 ${Y0 + 50}`} className="gz2-fault" />
      <Arrow d={`M306 ${Y0 + 40} C318 ${Y0 + 62} 350 ${Y0 + 62} 360 ${Y0 + 44}`} tone="blue" />
      <path d={`M334 ${Y0 + 30} V${Y0 + 84}`} className="gz2-o gz2-dash" />
      <T x={334} y={Y0 + 24} cls="gz2-sm gz2-b">A</T>
      <T x={344} y={Y0 + 86} a="start" cls="gz2-sm gz2-b">B</T>
      <rect x={4} y={6} width={W - 8} height={190} rx={4} className="gz2-o" />
    </g>
  );
}

function Section() {
  const { id } = useFig();
  // A (inner bank, left) → B (outer bank, right)
  const bed = "M60 222 Q160 230 230 252 Q290 270 312 266 Q322 262 326 226 L380 222";
  const ground = `${bed} L380 296 L60 296Z`;
  const water = "M140 236 Q190 240 230 252 Q290 270 312 266 Q322 262 324 236Z";
  return (
    <g>
      <path d={ground} className="gz2-land" />
      <path d={ground} fill={pat(id, "d")} opacity={0.4} />
      <path d={water} className="gz2-water" />
      <path d={water} fill={pat(id, "h")} opacity={0.5} />
      <path d="M150 238 Q190 240 226 250 Q190 246 150 238Z" className="gz2-sand" />
      <path d="M86 228 Q140 232 196 244 L226 252 Q160 240 86 228Z" className="gz2-sand gz2-o gz2-thin" />
      <path d={bed} className="gz2-o" />
      <path d="M326 228 Q322 262 312 266" className="gz2-fault" />
      <T x={60} y={214} a="start" cls="gz2-sm gz2-b">A</T>
      <T x={380} y={214} a="end" cls="gz2-sm gz2-b">B</T>
      <T x={14} y={248} a="start" cls="gz2-sm">jesep:</T>
      <T x={14} y={264} a="start" cls="gz2-sm">ukládání</T>
      <T x={W - 8} y={250} a="end" cls="gz2-sm gz2-red-t">výsep:</T>
      <T x={W - 8} y={266} a="end" cls="gz2-sm gz2-red-t">eroze</T>
      <T x={220} y={214} cls="gz2-sm gz2-muted-t">řez A–B</T>
    </g>
  );
}

function Scene({ stage, children }: { stage: 0 | 1 | 2 | 3; children?: ReactNode }) {
  return (
    <Frame w={W} h={H}>
      <Plain>
        {stage === 0 && <Channel d={smooth(F1)} />}
        {(stage === 1 || stage === 2) && <Channel d={smooth(F2)} />}
        {stage === 2 && (
          <Pop delay={0.2}>
            <path d={`M118 ${Y0 - 4} Q150 ${Y0 - 14} 182 ${Y0 - 4} Q186 ${Y0 + 16} 150 ${Y0 + 20} Q114 ${Y0 + 16} 118 ${Y0 - 4}Z`} className="gz2-flood" />
            <Channel d={smooth(CUT)} w={8} />
          </Pop>
        )}
        {stage === 3 && (
          <>
            <Channel d={smooth(LOOP)} dry />
            <path d={`M132 ${Y0 - 4} l12 -2 l-4 -14 l-10 2Z M168 ${Y0 - 4} l-12 -2 l4 -14 l10 2Z`} className="gz2-sand gz2-o gz2-thin" />
            <Channel d={smooth(NEW)} />
          </>
        )}
      </Plain>
      <Section />
      <Fade delay={0.3}>{children}</Fade>
    </Frame>
  );
}

const STEPS = [
  {
    title: "Výsep a jesep",
    caption: "Vnější břeh zákrutu voda podemílá (výsep), u vnitřního břehu ukládá písek a štěrk (jesep).",
    art: (
      <Scene stage={0}>
        <T x={CX} y={30} cls="gz2-b">meandr</T>
        <T x={290} y={Y0 + 66} a="end" cls="gz2-sm gz2-blue-t">nejrychlejší</T>
        <T x={290} y={Y0 + 82} a="end" cls="gz2-sm gz2-blue-t">proud</T>
      </Scene>
    ),
  },
  {
    title: "Šíje se zužuje",
    caption: "Zákruty se zvětšují a stěhují; úzká šíje mezi nimi se zužuje.",
    art: (
      <Scene stage={1}>
        <T x={CX} y={Y0 + 40} cls="gz2-b">šíje</T>
        <path d={`M${CX} ${Y0 + 26} V${Y0 - 8}`} className="gz2-lead" />
      </Scene>
    ),
  },
  {
    title: "Povodeň protrhne šíji",
    caption: "Při povodni se voda přelije přes šíji a prorazí si kratší cestu.",
    art: (
      <Scene stage={2}>
        <T x={CX} y={Y0 + 44} cls="gz2-b gz2-blue-t">povodeň</T>
      </Scene>
    ),
  },
  {
    title: "Slepé rameno",
    caption: "Konce starého zákrutu se zanesou nánosy a vznikne jezero ve tvaru podkovy – slepé rameno.",
    art: (
      <Scene stage={3}>
        <T x={CX + 42} y={Y0 - 62} a="start" cls="gz2-b">slepé rameno</T>
        <T x={CX} y={Y0 + 30} cls="gz2-sm">nové koryto</T>
      </Scene>
    ),
  },
];

export default function Meander() {
  return (
    <Figure level={3} label={LABEL} max={640} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
