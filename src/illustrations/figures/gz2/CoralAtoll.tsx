import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, f1, pat, useFig } from "./kit";
import { T, waves } from "./land";

const LABEL =
  "Jak vzniká atol podle Charlese Darwina, animace po krocích, v řezu a na mapce shora. 1. Kolem mladého sopečného ostrova v teplém moři vyroste korálový útes přímo u břehu – lemový útes. 2. Vyhaslá sopka pomalu klesá, ale korály rostou vzhůru a drží se u hladiny, protože potřebují světlo. Mezi ostrovem a útesem vznikne laguna; je to bariérový útes, například u ostrova Bora Bora. 3. Ostrov se ponoří úplně a zůstane jen prstenec korálového útesu s lagunou uprostřed – atol, například na Maledivách.";

const W = 440;
const H = 264;
const SL = 112; // sea level
const SF = 252; // sea floor
const CX = 270;

/** island cone sunk by d */
const cone = (d: number) => `M${CX - 150} ${SF + d} Q${CX - 56} ${44 + d} ${CX} ${36 + d} Q${CX + 56} ${44 + d} ${CX + 150} ${SF + d}Z`;
/** x of the island's left flank at height y (sunk by d) */
function flank(y: number, d: number) {
  // sample the left quadratic
  let best = CX;
  let err = 1e9;
  for (let t = 0; t <= 1; t += 0.002) {
    const u = 1 - t;
    const x = u * u * (CX - 150) + 2 * u * t * (CX - 56) + t * t * CX;
    const yy = u * u * (SF + d) + 2 * u * t * (44 + d) + t * t * (36 + d);
    if (Math.abs(yy - y) < err) {
      err = Math.abs(yy - y);
      best = x;
    }
  }
  return best;
}
const X0 = flank(SL, 0); // where the first reef grew
const DS = [0, 46, 108];

function Reef({ d, side }: { d: number; side: -1 | 1 }) {
  // the reef grows straight up from where it started; the island sinks away beneath it
  const m = (x: number) => (side < 0 ? x : 2 * CX - x);
  const pts: [number, number][] = [
    [X0 - 14, SL - 3],
    [X0 + 10, SL - 3],
    [X0 + 10, SL + d - 2],
    [X0 + 2, SL + d + 2],
    [X0 - 4, SL + d + 14],
    [X0 - 22, SL + d + 30],
    [X0 - 14, SL + d * 0.6 + 12],
  ];
  const dd = "M" + pts.map(([x, y]) => `${f1(m(x))} ${f1(y)}`).join(" L") + "Z";
  return <path d={dd} className="gz2-coral gz2-o gz2-thin" />;
}

function Plan({ k }: { k: number }) {
  const ri = [34, 20, 0][k];
  return (
    <g transform="translate(62 62)">
      <circle r={48} className="gz2-sea gz2-o gz2-thin" />
      <circle r={42} className="gz2-coral gz2-o gz2-thin" />
      <circle r={k === 0 ? 34 : 35} className={k === 0 ? "gz2-rock2" : "gz2-lagoon"} />
      {ri > 0 && <circle r={ri} className="gz2-rock2 gz2-o gz2-thin" />}
      {ri > 0 && <circle r={ri * 0.5} className="gz2-forest gz2-o gz2-thin" />}
      {k > 0 && <path d="M38 -16 L46 -18" className="gz2-o" style={{ strokeWidth: 3, stroke: "var(--paper)" }} />}
      <text y={64} textAnchor="middle" className="gz2-lbl gz2-sm gz2-muted-t">
        shora
      </text>
    </g>
  );
}

function Stage({ k, children }: { k: number; children?: ReactNode }) {
  return (
    <Frame w={W} h={H}>
      <Scene k={k}>{children}</Scene>
    </Frame>
  );
}

function Scene({ k, children }: { k: number; children?: ReactNode }) {
  const { id } = useFig();
  const d = DS[k];
  const clip = `${id}-sea`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={100} y={4} width={W - 104} height={SF - 4} />
        </clipPath>
      </defs>
      <rect x={120} y={SL} width={W - 124} height={SF - SL} className="gz2-sea" />
      <rect x={120} y={SL} width={W - 124} height={SF - SL} fill={pat(id, "h")} opacity={0.45} />
      <g clipPath={`url(#${clip})`}>
        <path d={cone(d)} className="gz2-basalt" />
        <path d={cone(d)} fill={pat(id, "b")} opacity={0.35} />
        <path d={cone(d)} className="gz2-o" />
        {k < 2 && <path d={`M${CX - 30} ${46 + d} Q${CX} ${30 + d} ${CX + 30} ${46 + d}`} className="gz2-o" style={{ strokeWidth: 5, stroke: "var(--gz2-grass-line)" }} />}
      </g>
      <g clipPath={`url(#${clip})`}>
        <Reef d={d} side={-1} />
        <Reef d={d} side={1} />
      </g>
      {k > 0 && <path d={`M${X0 + 10} ${SL} H${2 * CX - X0 - 10}`} className="gz2-o gz2-thin" />}
      <path d={waves(120, W - 4, SL, 1.6, 16)} className="gz2-o gz2-thin" />
      <path d={`M120 ${SF} H${W - 4}`} className="gz2-o" />
      <Plan k={k} />
      {k > 0 && <Arrow d={`M${CX + 70} ${SL + 34} v34`} tone="ink" className="gz2-vec" />}
      {k > 0 && <Arrow d={`M${2 * CX - X0 + 34} ${SL + 70} v-36`} tone="red" />}
      <Fade delay={0.3}>{children}</Fade>
      {k > 0 && (
        <>
          <T x={CX + 80} y={SL + 56} a="start" cls="gz2-sm gz2-sec">ostrov klesá</T>
        </>
      )}
    </>
  );
}

const STEPS = [
  {
    title: "Lemový útes",
    caption: "Kolem sopečného ostrova v teplém moři vyroste korálový útes přímo u břehu.",
    art: (
      <Stage k={0}>
        <T x={W - 8} y={50} a="end" cls="gz2-b">lemový útes</T>
        <path d={`M${2 * CX - X0} 56 V${SL - 6}`} className="gz2-lead" />
        <T x={CX} y={24} cls="gz2-sm">sopečný ostrov</T>
      </Stage>
    ),
  },
  {
    title: "Bariérový útes",
    caption: "Ostrov klesá, korály rostou vzhůru k hladině; mezi útesem a ostrovem vznikne laguna (Bora Bora).",
    art: (
      <Stage k={1}>
        <T x={W - 8} y={30} a="end" cls="gz2-b">bariérový útes</T>
        <path d={`M${2 * CX - X0} 36 V${SL - 6}`} className="gz2-lead" />
        <T x={W - 8} y={SL - 30} a="end" cls="gz2-sm gz2-blue-t">laguna</T>
        <path d={`M${W - 50} ${SL - 26} L${2 * CX - X0 - 22} ${SL + 6}`} className="gz2-lead" />
        <T x={2 * CX - X0 + 10} y={SL + 92} a="start" cls="gz2-sm gz2-sec">korály rostou</T>
      </Stage>
    ),
  },
  {
    title: "Atol",
    caption: "Ostrov se ponoří úplně; zůstane prstenec útesu s lagunou uprostřed (Maledivy).",
    art: (
      <Stage k={2}>
        <T x={W - 8} y={50} a="end" cls="gz2-b">atol</T>
        <path d={`M${2 * CX - X0} 56 V${SL - 6}`} className="gz2-lead" />
        <T x={CX} y={SL + 30} cls="gz2-sm gz2-blue-t">laguna</T>
        <T x={2 * CX - X0 + 10} y={SL + 92} a="start" cls="gz2-sm gz2-sec">korály rostou</T>
      </Stage>
    ),
  },
];

export default function CoralAtoll() {
  return (
    <Figure level={3} label={LABEL} max={640} interactive>
      <StepFilm label={LABEL} steps={STEPS} />
    </Figure>
  );
}
