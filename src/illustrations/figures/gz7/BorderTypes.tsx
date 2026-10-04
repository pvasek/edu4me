import { StepStrip } from "../../sequence/StepFigure";
import { Figure, Frame, StripBox } from "./kit";

const LABEL =
  "Typy hranic. Přírodní hranice vede po hřebeni hor nebo středem řeky, například Pyreneje mezi Francií a Španělskem nebo Odra a Lužická Nisa mezi Německem a Polskem. Geometrická hranice je rovná čára po rovnoběžce nebo poledníku, například hranice Egypta se Súdánem na 22° s. š. a s Libyí na 25° v. d. Kulturní hranice odděluje jazyky nebo náboženství, například jazyková hranice v Belgii. Enkláva je území ze všech stran obklopené cizím státem, exkláva je část státu oddělená od jeho hlavního území.";

const W = 240;
const H = 200;

function Natural() {
  // border: ridge (top half) then river (bottom half)
  const ridge = "M118 14 L126 34 L114 52 L128 72 L116 92 L122 104";
  const river = "M122 104 Q140 124 120 142 Q100 160 124 188";
  const peaks = [
    [120, 28],
    [118, 50],
    [124, 70],
    [118, 90],
  ];
  return (
    <Frame w={W} h={H} className="gz7-small">
      <path d={`M10 14 H118 L126 34 L114 52 L128 72 L116 92 L122 104 Q140 124 120 142 Q100 160 124 188 H10 Z`} className="gz7-state gz7-o" />
      <path d={`M230 14 H118 L126 34 L114 52 L128 72 L116 92 L122 104 Q140 124 120 142 Q100 160 124 188 H230 Z`} className="gz7-state2 gz7-o" />
      {peaks.map(([x, y], i) => (
        <path key={i} d={`M${x - 15} ${y + 9} L${x} ${y - 10} L${x + 15} ${y + 9} Z`} className="gz7-mount gz7-o gz7-thin" />
      ))}
      <path d={ridge} className="gz7-border" />
      <path d={river} className="gz7-river" />
      <path d={river} className="gz7-border gz7-border-thin" />
      <text x={60} y={124} textAnchor="middle" className="gz7-lbl gz7-b">
        stát A
      </text>
      <text x={186} y={124} textAnchor="middle" className="gz7-lbl gz7-b">
        stát B
      </text>
      <text x={178} y={56} textAnchor="middle" className="gz7-lbl gz7-sm">
        hřbet hor
      </text>
      <text x={174} y={170} textAnchor="middle" className="gz7-lbl gz7-sm gz7-blue-t">
        řeka
      </text>
    </Frame>
  );
}

function Geometric() {
  // Egypt: Mediterranean coast (top), Red Sea (east), 25° E (west), 22° N (south)
  return (
    <Frame w={W} h={H} className="gz7-small">
      <rect x={6} y={6} width={W - 12} height={30} className="gz7-sea" />
      <text x={120} y={26} textAnchor="middle" className="gz7-lbl gz7-sm gz7-blue-t">
        Středozemní moře
      </text>
      {/* graticule */}
      {[60, 120, 180].map((x) => (
        <path key={x} d={`M${x} 36 V196`} className="gz7-o gz7-thin gz7-dot2 gz7-faint" />
      ))}
      {[90, 150].map((y) => (
        <path key={y} d={`M6 ${y} H234`} className="gz7-o gz7-thin gz7-dot2 gz7-faint" />
      ))}
      <path d="M6 36 H60 V196 H6 Z" className="gz7-other gz7-o gz7-thin" />
      <path d="M60 150 H200 L226 196 H60 Z" className="gz7-other gz7-o gz7-thin" />
      <path d="M60 36 Q100 44 130 36 Q160 30 176 40 L184 60 L210 150 H60 Z" className="gz7-state gz7-o" />
      <path d="M184 60 L210 150 L234 150 V60 Z" className="gz7-sea" />
      <path d="M60 36 V150 H210" className="gz7-border" />
      <text x={122} y={104} textAnchor="middle" className="gz7-lbl gz7-b">
        Egypt
      </text>
      <text x={32} y={110} textAnchor="middle" className="gz7-lbl gz7-sm">
        Libye
      </text>
      <text x={130} y={180} textAnchor="middle" className="gz7-lbl gz7-sm">
        Súdán
      </text>
      <text x={64} y={64} className="gz7-num gz7-halo">
        25° v. d.
      </text>
      <text x={150} y={144} textAnchor="middle" className="gz7-num gz7-halo">
        22° s. š.
      </text>
    </Frame>
  );
}

function Cultural() {
  const border = "M10 92 Q50 80 80 98 Q110 116 140 96 Q170 76 200 100 Q216 110 230 104";
  return (
    <Frame w={W} h={H} className="gz7-small">
      <path d={`${border} V14 H10 Z`} className="gz7-state gz7-o gz7-thin" />
      <path d={`${border} V188 H10 Z`} className="gz7-state3 gz7-o gz7-thin" />
      <path d={border} className="gz7-border gz7-border-cult" />
      {/* speech bubbles */}
      <g>
        <path d="M30 30 h70 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-50 l-10 10 v-10 h-10 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8z" className="gz7-paper-fill gz7-o gz7-thin" />
        <text x={65} y={52} textAnchor="middle" className="gz7-lbl gz7-b">
          Dag!
        </text>
        <path d="M130 136 h86 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-60 l-10 10 v-10 h-16 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8z" className="gz7-paper-fill gz7-o gz7-thin" />
        <text x={173} y={158} textAnchor="middle" className="gz7-lbl gz7-b">
          Bonjour!
        </text>
      </g>
      <text x={176} y={46} textAnchor="middle" className="gz7-lbl gz7-sm">
        nizozemština
      </text>
      <text x={60} y={150} textAnchor="middle" className="gz7-lbl gz7-sm">
        francouzština
      </text>
    </Frame>
  );
}

function Enclave() {
  return (
    <Frame w={W} h={H} className="gz7-small">
      <path d="M8 20 H70 Q84 70 66 110 Q56 150 74 186 H8 Z" className="gz7-state gz7-o" />
      <path d="M70 20 H232 V186 H74 Q56 150 66 110 Q84 70 70 20 Z" className="gz7-state2 gz7-o" />
      {/* exclave of A inside B */}
      <path d="M128 52 q16 -8 26 4 q8 14 -6 22 q-18 6 -24 -8 q-2 -12 4 -18z" className="gz7-state gz7-o" />
      {/* a whole small state inside B */}
      <circle cx={170} cy={140} r={18} className="gz7-state3 gz7-o" />
      <text x={36} y={108} textAnchor="middle" className="gz7-lbl gz7-b">
        A
      </text>
      <text x={212} y={104} textAnchor="middle" className="gz7-lbl gz7-b">
        B
      </text>
      <text x={170} y={145} textAnchor="middle" className="gz7-lbl gz7-b">
        C
      </text>
      <text x={141} y={100} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        exkláva A
      </text>
      <text x={141} y={116} textAnchor="middle" className="gz7-lbl gz7-sm">
        = enkláva v B
      </text>
      <text x={120} y={180} textAnchor="middle" className="gz7-lbl gz7-sm gz7-teal-t gz7-b">
        enkláva C
      </text>
    </Frame>
  );
}

export default function BorderTypes() {
  return (
    <Figure level={11} label={LABEL} max={860} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={230}
          phoneColumns={2}
          steps={[
            {
              title: "Přírodní",
              art: <Natural />,
              caption: "Po hřebeni hor nebo středem řeky: Pyreneje (Francie – Španělsko), Odra a Lužická Nisa (Německo – Polsko).",
            },
            {
              title: "Geometrická",
              art: <Geometric />,
              caption: "Rovné čáry po rovnoběžkách a polednících, často z koloniálních dob: Egypt, hranice USA – Kanada na 49° s. š.",
            },
            {
              title: "Kulturní",
              art: <Cultural />,
              caption: "Odděluje jazyky nebo náboženství: jazyková hranice v Belgii, rozdělení Indie a Pákistánu (1947).",
            },
            {
              title: "Enkláva a exkláva",
              art: <Enclave />,
              caption: "Enkláva je ze všech stran obklopená cizím státem (Lesotho, Vatikán). Exkláva je oddělený kus státu (Kaliningradská oblast Ruska). Španělská Llívia ve Francii je obojí.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
