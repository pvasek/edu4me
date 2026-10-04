import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, StripBox, Sym, Town } from "./kit";

const LABEL =
  "Dvě teorie migrace. Ravensteinovy zákony migrace: většina migrantů se stěhuje jen na krátkou vzdálenost, často po etapách z vesnice do menšího města a odtud do velkoměsta; velká města přitahují nejvíc a každý migrační proud má svůj protiproud. Gravitační model: migrační tok mezi dvěma místy roste s počtem jejich obyvatel a klesá se vzdáleností – dvě velká blízká města si vymění mnoho lidí, velké a malé vzdálené místo jen málo.";

const W = 300;
const H = 240;

function Ravenstein() {
  return (
    <Frame w={W} h={H} className="gz7-small">
      {/* countryside */}
      <path
        d="M14 40 Q70 22 104 50 Q118 120 100 196 Q60 214 14 200 Z"
        className="gz7-grass gz7-o gz7-thin"
      />
      <text x={22} y={228} className="gz7-lbl gz7-sm">
        venkov
      </text>
      <Town x={44} y={70} size={1} />
      <Town x={74} y={124} size={1} />
      <Town x={40} y={172} size={1} />
      {/* town and city */}
      <Town x={160} y={124} size={2} />
      <text x={150} y={100} textAnchor="middle" className="gz7-lbl gz7-sm">
        město
      </text>
      <Town x={258} y={118} size={4} className="gz7-house-lvl" />
      <text x={298} y={60} textAnchor="end" className="gz7-lbl gz7-b gz7-lvl-t">
        velkoměsto
      </text>
      {/* many short moves (thick) */}
      <Arrow d="M58 76 Q110 84 138 114" tone="lvl" className="gz7-mig-thick" />
      <Arrow d="M88 124 H136" tone="lvl" className="gz7-mig-thick" />
      <Arrow d="M54 168 Q108 162 138 134" tone="lvl" className="gz7-mig-thick" />
      {/* step migration: town → city */}
      <Arrow d="M182 118 H226" tone="lvl" className="gz7-mig-thick" />
      <text x={212} y={95} textAnchor="middle" className="gz7-lbl gz7-sm gz7-lvl-t">
        etapa 2
      </text>
      <text x={124} y={160} textAnchor="middle" className="gz7-lbl gz7-sm gz7-lvl-t gz7-halo">
        etapa 1
      </text>
      {/* rare long move (thin) */}
      <Arrow d="M50 54 Q150 0 232 104" tone="lvl" className="gz7-mig-thin" />
      <text x={150} y={20} textAnchor="middle" className="gz7-lbl gz7-sm">
        dálková migrace: málokdo
      </text>
      {/* counter-current */}
      <Arrow d="M252 144 Q214 196 166 144" tone="muted" dashed />
      <text x={212} y={198} textAnchor="middle" className="gz7-lbl gz7-sm gz7-muted-t">
        protiproud
      </text>
    </Frame>
  );
}

function Gravity() {
  return (
    <Frame w={W} h={H} className="gz7-small">
      {/* pair 1: two big cities, close */}
      <circle cx={52} cy={62} r={26} className="gz7-lvl-fill gz7-o" />
      <circle cx={162} cy={62} r={26} className="gz7-lvl-fill gz7-o" />
      <Sym x={52} y={68} t="P_{1}" />
      <Sym x={162} y={68} t="P_{2}" />
      <Arrow d="M82 56 H130" tone="lvl" both className="gz7-mig-thick" />
      <Arrow d="M82 70 H130" tone="lvl" both className="gz7-mig-thick" />
      <text x={106} y={104} textAnchor="middle" className="gz7-lbl gz7-sm">
        blízko
      </text>
      <text x={200} y={58} className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        velký tok
      </text>
      <text x={200} y={76} className="gz7-lbl gz7-sm">
        velká a blízká
      </text>
      {/* pair 2: big and small, far */}
      <circle cx={52} cy={152} r={26} className="gz7-lvl-fill gz7-o" />
      <circle cx={266} cy={152} r={12} className="gz7-lvl-fill gz7-o" />
      <Sym x={52} y={158} t="P_{1}" />
      <Sym x={266} y={130} t="P_{3}" />
      <Arrow d="M82 152 H250" tone="lvl" both className="gz7-mig-thin" />
      <path d="M82 176 v8 M250 176 v8 M82 180 H250" className="gz7-o gz7-thin" />
      <text x={166} y={170} textAnchor="middle" className="gz7-lbl gz7-sm">
        daleko
      </text>
      <text x={166} y={142} textAnchor="middle" className="gz7-lbl gz7-sm gz7-b gz7-lvl-t">
        malý tok
      </text>
      <Sym x={166} y={200} t="d" />
      {/* formula */}
      <rect x={58} y={208} width={184} height={28} rx={6} className="gz7-tag-lvl" />
      <text x={150} y={228} textAnchor="middle" className="gz7-eq gz7-eq-lg">
        tok ≈ <tspan className="gz7-sym-t">k · P</tspan>
        <tspan dy="0.28em" fontSize="70%">1</tspan>
        <tspan dy="-0.28em" className="gz7-sym-t"> · P</tspan>
        <tspan dy="0.28em" fontSize="70%">2</tspan>
        <tspan dy="-0.28em" className="gz7-sym-t"> / d</tspan>
        <tspan dy="-0.42em" fontSize="70%">2</tspan>
      </text>
    </Frame>
  );
}

export default function MigrationModels() {
  return (
    <Figure level={11} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={260}
          steps={[
            {
              title: "Ravensteinovy zákony (1885)",
              art: <Ravenstein />,
              caption:
                "Většina lidí se stěhuje jen kousek, často po etapách: z vesnice do města, odtud do velkoměsta. Velká města lákají nejvíc a každý proud má svůj protiproud.",
            },
            {
              title: "Gravitační model",
              art: <Gravity />,
              caption:
                "Tok mezi dvěma místy roste s jejich velikostí (P = počet obyvatel) a klesá se vzdáleností d – jako přitažlivost dvou těles.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
