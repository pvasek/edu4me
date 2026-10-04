import type { ReactNode } from "react";
import { StepFilm } from "../../sequence/StepFigure";
import { Arrow, Fade, Figure, Frame, Pop, pat, useFig } from "./kit";
import { T, Tree, waves } from "./land";

const LABEL =
  "Jak moře rozrušuje skalní pobřeží, animace po krocích. 1. Vlny narážejí do skalního břehu a u hladiny vyhlodávají příbojový žlab; skála nad ním se zřítí a vzniká strmý útes, klif. 2. Vlny nejvíc rozrušují místa s puklinami a vyhloubí v nich jeskyni. 3. Když jeskyně projde skrz celý výběžek, vznikne skalní brána. 4. Strop brány se zřítí a zůstane samostatná skalní věž; tu moře dál obrušuje, až z ní zbude jen nízký pahýl.";
const LABEL2 =
  "Pláž a kosa na mapě. Vlny přicházejí ke břehu šikmo, ale voda stéká zpět kolmo, takže zrnka písku putují cik-cak podél pobřeží – je to pobřežní proud. Písek se usazuje v zátokách jako pláž; kde pobřeží končí nebo se stáčí, roste písečný val do moře, kosa, a za ní může vzniknout laguna. Příkladem je Kuršská kosa v Baltském moři, dlouhá 98 km.";

const W = 440;
const H = 262;
const SL = 196;

function Scene(p: Parameters<typeof SceneArt>[0]) {
  return (
    <Frame w={W} h={H}>
      <SceneArt {...p} />
    </Frame>
  );
}

function SceneArt({ children, face }: { children?: ReactNode; face: string }) {
  const { id } = useFig();
  return (
    <>
      <rect x={4} y={4} width={W - 8} height={SL - 4} className="gz2-sky" />
      {/* the coast behind */}
      <path d={`M4 120 L60 100 L120 84 L120 ${SL} L4 ${SL}Z`} className="gz2-rock" />
      <path d={`M4 120 L60 100 L120 84 L120 ${SL} L4 ${SL}Z`} fill={pat(id, "b")} opacity={0.35} />
      <path d={`M4 120 L60 100 L120 84`} className="gz2-o" style={{ strokeWidth: 4, stroke: "var(--gz2-grass-line)" }} />
      <path d={`M4 120 L60 100 L120 84 L120 ${SL}`} className="gz2-o gz2-thin" />
      {/* sea */}
      <rect x={4} y={SL} width={W - 8} height={H - 4 - SL} className="gz2-sea" />
      <rect x={4} y={SL} width={W - 8} height={H - 4 - SL} fill={pat(id, "h")} opacity={0.5} />
      {/* the headland: front cliff face */}
      <path d={face} className="gz2-lime" />
      <path d={face} fill={pat(id, "brick")} />
      <path d={face} className="gz2-o" />
      {children}
      {[SL + 18, SL + 38].map((y, i) => (
        <path key={y} d={waves(4 + i * 10, W - 4, y, 2.5, 22)} className="gz2-o gz2-thin" style={{ opacity: 0.6 }} />
      ))}
      <path d={`M4 ${SL} H${W - 4}`} className="gz2-o gz2-thin" />
      <Arrow d={`M150 ${H - 14} L170 ${SL + 4}`} tone="blue" className="gz2-vec" />
      <Arrow d={`M300 ${H - 14} L284 ${SL + 4}`} tone="blue" className="gz2-vec" />
    </>
  );
}

const TOP = (x0: number, x1: number) =>
  `M${x0} ${SL} L${x0} 92 Q${x0 + 4} 84 ${x0 + 12} 82 L${x1 - 10} 80 Q${x1 - 2} 82 ${x1} 90 L${x1} ${SL}`;
const GRASS = (x0: number, x1: number) => `M${x0 + 4} 84 L${x1 - 4} 81`;
// the whole headland, front face
const HEAD = `${TOP(120, 360)}Z`;

function Grass({ d }: { d: string }) {
  return <path d={d} className="gz2-o" style={{ strokeWidth: 5, stroke: "var(--gz2-grass-line)" }} />;
}

const STEPS = [
  {
    title: "Klif",
    caption: "Vlny vyhlodávají u hladiny příbojový žlab; skála nad ním se zřítí a vzniká strmý útes – klif.",
    art: (
      <Scene face={HEAD}>
        <Grass d={GRASS(120, 360)} />
        <path d={`M126 ${SL} Q130 ${SL - 12} 150 ${SL - 13} Q240 ${SL - 20} 330 ${SL - 13} Q350 ${SL - 12} 354 ${SL}Z`} className="gz2-hole" />
        <path d={`M240 90 L236 130 L244 160 L240 ${SL - 18}`} className="gz2-o" />
        {/* fallen blocks */}
        <path d={`M140 ${SL} l6 -10 l10 2 l2 8Z M320 ${SL} l4 -8 l10 0 l3 8Z`} className="gz2-rock2 gz2-o gz2-thin" />
        <Fade delay={0.3}>
          <T x={240} y={40} cls="gz2-b">klif</T>
          <T x={380} y={SL - 26} a="start" cls="gz2-sm">příbojový</T>
          <T x={380} y={SL - 10} a="start" cls="gz2-sm">žlab</T>
          <path d="M378 182 L350 186" className="gz2-lead" />
          <T x={272} y={120} a="start" cls="gz2-sm">puklina</T>
          <path d="M270 116 L244 124" className="gz2-lead" />
        </Fade>
      </Scene>
    ),
  },
  {
    title: "Jeskyně",
    caption: "Nejrychleji ustupují místa s puklinami: moře v nich vyhloubí jeskyni.",
    art: (
      <Scene face={HEAD}>
        <Grass d={GRASS(120, 360)} />
        <path d={`M240 90 L236 130 L240 140`} className="gz2-o" />
        <Pop delay={0.1}>
          <path d={`M214 ${SL} Q214 146 240 140 Q266 146 266 ${SL}Z`} className="gz2-hole" />
        </Pop>
        <Fade delay={0.3}>
          <T x={240} y={40} cls="gz2-b">jeskyně</T>
          <path d="M240 48 V136" className="gz2-lead" />
        </Fade>
      </Scene>
    ),
  },
  {
    title: "Skalní brána",
    caption: "Jeskyně prorazí skrz celý výběžek a vznikne skalní brána.",
    art: (
      <Scene face={HEAD}>
        <Grass d={GRASS(120, 360)} />
        <Pop delay={0.1}>
          <path d={`M200 ${SL} Q198 118 240 112 Q282 118 280 ${SL}Z`} className="gz2-sky gz2-o" />
          <path d={`M200 ${SL - 10} Q240 ${SL - 14} 280 ${SL - 10} L280 ${SL} L200 ${SL}Z`} className="gz2-sea" />
        </Pop>
        <Fade delay={0.3}>
          <T x={240} y={40} cls="gz2-b">skalní brána</T>
        </Fade>
      </Scene>
    ),
  },
  {
    title: "Skalní věž a pahýl",
    caption: "Strop brány se zřítí a zbude samostatná skalní věž; moře ji obrousí až na nízký pahýl.",
    art: (
      <Scene face={`${TOP(120, 196)}Z`}>
        <Grass d={GRASS(120, 196)} />
        <Pop delay={0.1}>
          <path d={`M284 ${SL} L286 110 Q288 98 300 96 L330 98 Q340 102 340 116 L344 ${SL}Z`} className="gz2-lime" />
          <path d={`M284 ${SL} L286 110 Q288 98 300 96 L330 98 Q340 102 340 116 L344 ${SL}Z`} className="gz2-o" />
          <path d={`M386 ${SL} L390 ${SL - 14} Q402 ${SL - 20} 414 ${SL - 12} L416 ${SL}Z`} className="gz2-lime gz2-o" />
          <path d={`M210 ${SL} l6 -10 l12 2 l2 8Z M244 ${SL} l8 -6 l10 2 l0 4Z`} className="gz2-rock2 gz2-o gz2-thin" />
        </Pop>
        <Fade delay={0.3}>
          <T x={314} y={40} cls="gz2-b">skalní věž</T>
          <path d="M314 48 V92" className="gz2-lead" />
          <T x={404} y={150} cls="gz2-b">pahýl</T>
          <path d="M404 158 V176" className="gz2-lead" />
        </Fade>
      </Scene>
    ),
  },
];

const PW = 440;
const PH = 210;

function Spit() {
  return (
    <Frame w={PW} h={PH}>
      <SpitArt />
    </Frame>
  );
}

function SpitArt() {
  const { id } = useFig();
  const land = "M4 4 H436 V22 Q380 26 330 48 Q300 64 280 96 Q250 120 200 122 Q140 122 110 96 Q90 74 60 70 L4 70Z";
  const beach = "M110 96 Q140 122 200 122 Q250 120 280 96 Q276 108 252 124 Q204 136 160 130 Q122 122 110 96Z";
  const spit = "M280 96 Q300 72 336 62 Q380 52 420 60 L424 66 Q384 62 344 72 Q310 82 286 104Z";
  return (
    <>
      <rect x={4} y={4} width={PW - 8} height={PH - 8} className="gz2-sea" />
      <rect x={4} y={4} width={PW - 8} height={PH - 8} fill={pat(id, "h")} opacity={0.45} />
      <path d={land} className="gz2-grass" />
      <path d={land} fill={pat(id, "dots")} opacity={0.4} />
      <path d={land} className="gz2-o" />
      {/* lagoon behind the spit */}
      <path d="M282 98 Q300 64 330 48 Q380 26 436 22 V60 L420 60 Q380 52 336 62 Q300 72 286 102Z" className="gz2-lagoon" />
      <path d={beach} className="gz2-sand gz2-o gz2-thin" />
      <path d={spit} className="gz2-sand gz2-o gz2-thin" />
      {/* longshore drift: oblique swash, straight backwash */}
      {[0, 1, 2, 3].map((k) => {
        const x = 120 + k * 42;
        return (
          <g key={k}>
            <Arrow d={`M${x - 26} ${170} L${x + 4} ${132}`} tone="blue" />
          </g>
        );
      })}
      <path d="M128 128 l14 -8 l2 12 l14 -8 l2 12 l14 -8 l2 12 l14 -8 l2 12 l14 -8 l2 10 l14 -8 l2 10 l14 -10 l4 8 l12 -12" className="gz2-arr gz2-arr-acc" />
      <Arrow d="M150 186 H290" tone="acc" className="gz2-vec" />
      <path d={`M4 4 H${PW - 4} V${PH - 4} H4Z`} className="gz2-o" />
      {[40, 60, 230].map((x) => (
        <Tree key={x} x={x} y={44} s={0.8} />
      ))}
      <T x={60} y={190} a="start" cls="gz2-sm gz2-blue-t">vlny přicházejí šikmo</T>
      <T x={300} y={190} a="start" cls="gz2-sm gz2-b gz2-acc-t">pobřežní proud</T>
      <T x={190} y={112} cls="gz2-sm gz2-b">pláž</T>
      <T x={360} y={98} cls="gz2-sm gz2-b">kosa</T>
      <T x={380} y={48} cls="gz2-sm gz2-blue-t">laguna</T>
    </>
  );
}

export default function CoastalErosion() {
  return (
    <Figure level={3} label={LABEL} max={640} interactive>
      <div className="gz2-stripbox">
        <StepFilm label={LABEL} steps={STEPS} />
        <p className="gz2-strip-note">Co moře ubere na výběžcích, uloží v zátokách:</p>
        <div role="img" aria-label={LABEL2}>
          <Spit />
        </div>
      </div>
    </Figure>
  );
}
