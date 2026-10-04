import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, StripBox, Sun, pat, useFig } from "./kit";

const LABEL =
  "Slapy (příliv a odliv). Měsíc přitahuje oceánskou vodu, a tak vzniknou dvě vzdutí vody: na straně k Měsíci a na odvrácené straně; tam je příliv, mezi nimi odliv. Země se pod vzdutími otáčí, takže většina pobřeží zažije dva přílivy a dva odlivy asi za 24 h 50 min. Na pobřeží voda při přílivu stoupá a při odlivu ustupuje. Když jsou Slunce, Země a Měsíc v jedné přímce (nov a úplněk), slapy se sčítají a nastává skočný příliv; když svírají pravý úhel (první a poslední čtvrť), částečně se ruší a nastává hluchý příliv.";

const W = 240;
const H = 224;

function Earth({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  const { id } = useFig();
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} className="gz1-sea2" />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={pat(id, "h")} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} className="gz1-o gz1-thin" style={{ stroke: "var(--blue)" }} />
      <circle cx={x} cy={y} r={34} className="gz1-land gz1-o" />
    </g>
  );
}
function Moon({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={12} className="gz1-moon gz1-o gz1-thin" />;
}
const T = ({ x, y, c, a = "middle", children }: { x: number; y: number; c?: string; a?: "start" | "middle" | "end"; children: string }) => (
  <text x={x} y={y} textAnchor={a} className={`gz1-lbl gz1-sm gz1-b ${c ?? ""}`}>
    {children}
  </text>
);

function TwoBulges() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Earth x={92} y={112} rx={64} ry={42} />
      <Moon x={214} y={112} />
      <DrawArrow d="M164 96 H198" tone="ink" />
      <T x={214} y={88}>
        Měsíc
      </T>
      <T x={92} y={58} c="gz1-muted-t">
        odliv
      </T>
      <T x={92} y={176} c="gz1-muted-t">
        odliv
      </T>
      <T x={168} y={140} c="gz1-blue-t" a="start">
        příliv
      </T>
      <T x={22} y={140} c="gz1-blue-t" a="start">
        příliv
      </T>
      <T x={W / 2} y={H - 8}>
        2× příliv za 24 h 50 min
      </T>
    </Frame>
  );
}

function Coast() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H} className="gz1-small">
      {/* low-water sea and the shore */}
      <path d="M0 150 H240 V200 H0Z" className="gz1-sea2" />
      <path d="M0 96 H240 V150 H0Z" className="gz1-hightide" />
      <path d="M0 96 H240 V150 H0Z" fill={pat(id, "h")} opacity={0.5} />
      <path d="M0 40 H40 C70 60 90 120 130 150 L240 190 V200 H0Z" className="gz1-land" />
      <path d="M0 40 H40 C70 60 90 120 130 150 L240 190" className="gz1-o" />
      <path d="M0 96 H240" className="gz1-hw" />
      <path d="M0 150 H240" className="gz1-lw" />
      <DrawArrow d="M214 142 V104" tone="blue" both />
      <T x={236} y={88} a="end" c="gz1-blue-t">
        příliv
      </T>
      <T x={236} y={172} a="end" c="gz1-muted-t">
        odliv
      </T>
      <T x={W / 2} y={H - 8}>
        za asi 6 h se příliv mění v odliv
      </T>
    </Frame>
  );
}

function Spring() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sun x={22} y={104} r={16} rays={false} />
      <Earth x={118} y={104} rx={74} ry={40} />
      <Moon x={222} y={104} />
      <path d="M40 104 H44 M192 104 H210" className="gz1-o gz1-thin gz1-dash" />
      <T x={22} y={146}>
        Slunce
      </T>
      <T x={218} y={80} a="end">
        Měsíc
      </T>
      <T x={W / 2} y={178} c="gz1-blue-t">
        vysoký příliv, nízký odliv
      </T>
      <T x={W / 2} y={H - 8}>
        v jedné přímce: nov, úplněk
      </T>
    </Frame>
  );
}

function Neap() {
  return (
    <Frame w={W} h={H} className="gz1-small">
      <Sun x={22} y={116} r={16} rays={false} />
      <Earth x={128} y={116} rx={48} ry={56} />
      <Moon x={128} y={30} />
      <path d="M128 42 V58 M40 116 H78" className="gz1-o gz1-thin gz1-dash" />
      <path d="M128 92 h14 v24" className="gz1-o gz1-thin" />
      <T x={146} y={34} a="start">
        Měsíc
      </T>
      <T x={22} y={158}>
        Slunce
      </T>
      <T x={W / 2} y={H - 8}>
        pravý úhel: 1. a poslední čtvrť
      </T>
    </Frame>
  );
}

export default function Tides() {
  return (
    <Figure level={2} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL} note="Vzdutí vody je kvůli názornosti mnohonásobně zvětšené.">
        <StepStrip
          min={170}
          phoneColumns={2}
          steps={[
            { title: "Dvě vzdutí", art: <TwoBulges />, caption: "Na straně k Měsíci i na odvrácené straně je příliv." },
            { title: "Na pobřeží", art: <Coast />, caption: "Při přílivu voda stoupá, při odlivu ustupuje." },
            { title: "Skočný příliv", art: <Spring />, caption: "Slapy Slunce a Měsíce se sčítají." },
            { title: "Hluchý příliv", art: <Neap />, caption: "Slapy Slunce a Měsíce se částečně ruší." },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
